#!/usr/bin/env python3
"""Construit les fichiers du hero à partir de l'illustration maîtresse.

Tout ce qui peut être calculé une fois pour toutes l'est ici. La version
précédente dessinait la mer en SVG avec un masque et des filtres (turbulence,
flou gaussien) réévalués à chaque image : la page tombait à 20 images par
seconde. Le navigateur n'anime gratuitement que les transformations et
l'opacité ; le reste doit donc être cuit dans des images.

Sorties, dans public/beach :

  hero-scene-light.webp : l'illustration, dix fois plus légère que le PNG
                          maître à qualité visuelle équivalente
  hero-sea-mask.png     : l'eau, portée par le canal alpha. Il confine
                          l'animation de la mer, qui sans lui baverait sur la
                          falaise et les rochers émergés. Le trait de côte est
                          relevé à la main (COAST) : plus fiable qu'une
                          segmentation par couleur, l'eau étant très pâle sous
                          le soleil.
  hero-swell-*.webp     : crêtes de vagues, déjà floutées et irrégulières
  hero-screen-glow.webp : halo de l'écran du laptop, au cadrage de
                          l'illustration pour tomber pile sur la dalle
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "art/hero-scene-light.png"
OUT = ROOT / "public/beach"

W, H = 1536, 1024
HORIZON = 590
ROCKS_FROM = 680  # premier rocher émergé
SCREEN = (757, 597)  # dalle du laptop, relevée sur l'illustration

# Trait de côte, du point où la falaise coupe l'horizon jusqu'au bas du cadre.
COAST = [
    (1072, HORIZON),
    (1090, 620),
    (1122, 650),
    (1142, 690),
    (1140, 730),
    (1142, 775),
    (1155, 820),
    (1166, 870),
    (1174, 920),
    (1182, 970),
    (1192, 1024),
]


def sea_mask(src: Image.Image) -> Image.Image:
    water = Image.new("L", (W, H), 0)
    ImageDraw.Draw(water).polygon(
        [*COAST, (W, 1024), (W, HORIZON)], fill=255
    )
    m = np.asarray(water).astype(bool)

    a = np.asarray(src).astype(np.int16)
    r, b = a[:, :, 0], a[:, :, 2]
    lum = a.mean(axis=2)
    # Le contre-jour rend l'écume chaude elle aussi : la teinte seule confond
    # les rochers avec les traînées de mousse. On ne garde donc que les taches
    # chaudes assez épaisses pour être de la roche, l'ouverture morphologique
    # effaçant les traînées, qui sont fines.
    warm = (r > b + 6) & (lum < 236)
    # Sous l'horizon, la bande de soleil est chaude sur toute sa largeur ; la
    # recherche ne commence donc qu'au premier rocher émergé.
    warm[:ROCKS_FROM] = False
    rock = Image.fromarray(warm.astype(np.uint8) * 255)
    rock = rock.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(15))
    m &= np.asarray(rock) < 128

    mask = Image.fromarray((m * 255).astype(np.uint8))
    # Recule de quelques pixels du trait de côte et des rochers, puis adoucit
    # la bordure pour que les vagues s'y éteignent au lieu de s'y couper net.
    mask = mask.filter(ImageFilter.MinFilter(9))
    mask = mask.filter(ImageFilter.GaussianBlur(7))

    # La forme est portée par le canal alpha, pas par la luminance : un masque
    # CSS lit l'alpha par défaut, et une image opaque en niveaux de gris ne
    # masquerait donc rien du tout.
    out = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    out.putalpha(mask.convert("L"))
    return out


SWELL_W, SWELL_H = 1200, 150


def swell(seed: int) -> Image.Image:
    """Une crête de vague, blanche, doublée d'un creux turquoise.

    La ligne de crête est une somme de sinusoïdes : une bande rectiligne se
    lisait comme un filtre qui glisse. Le flou est appliqué ici, une fois, au
    lieu d'être demandé au navigateur à chaque image.
    """
    rng = np.random.default_rng(seed)
    x = np.arange(SWELL_W)
    y = np.zeros(SWELL_W)
    for wavelength, amplitude in ((SWELL_W / 1.7, 11), (SWELL_W / 4.3, 6), (SWELL_W / 9.1, 3)):
        y += amplitude * np.sin(2 * np.pi * x / wavelength + rng.uniform(0, 2 * np.pi))
    crest = SWELL_H * 0.34 + y

    yy = np.arange(SWELL_H)[:, None]
    # Profils gaussiens de part et d'autre de la ligne de crête.
    top = np.exp(-(((yy - crest[None, :]) / 11.0) ** 2))
    bottom = np.exp(-(((yy - crest[None, :] - 34) / 20.0) ** 2))

    # Extinction sur les bords : sans elle, la crête se termine par une coupe
    # franche au milieu de l'eau.
    fade = np.clip(np.minimum(x, SWELL_W - 1 - x) / (SWELL_W * 0.16), 0, 1)
    fade = fade[None, :] ** 1.5

    white = np.array([255, 255, 255], dtype=float)
    teal = np.array([30, 143, 168], dtype=float)

    a_top = top * fade
    a_bottom = bottom * fade * 0.55
    alpha = np.clip(a_top + a_bottom, 0, 1)
    with np.errstate(invalid="ignore"):
        mix = np.where(alpha > 0, a_bottom / np.maximum(alpha, 1e-6), 0)
    rgb = white[None, None, :] * (1 - mix[..., None]) + teal[None, None, :] * mix[..., None]

    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA").filter(ImageFilter.GaussianBlur(3))


def screen_glow() -> Image.Image:
    """Halo de l'écran, au cadrage de l'illustration.

    Le fichier fait la taille de l'illustration pour pouvoir être affiché avec
    le même `object-cover` : le halo tombe alors pile sur la dalle quel que soit
    le format de la fenêtre, sans le moindre calcul.
    """
    cx, cy = SCREEN
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)

    halo = np.clip(1 - d / 190.0, 0, 1) ** 2.1 * 0.5
    core = np.clip(1 - d / 52.0, 0, 1) ** 1.5 * 0.85
    alpha = np.clip(halo + core, 0, 1)

    rgb = np.empty((H, W, 3), dtype=float)
    rgb[..., 0], rgb[..., 1], rgb[..., 2] = 176, 216, 255
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA").filter(ImageFilter.GaussianBlur(6))


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    if src.size != (W, H):
        raise SystemExit(f"illustration attendue en {W}×{H}, reçue en {src.size}")

    written = []

    def write(name: str, im: Image.Image, **kw) -> None:
        path = OUT / name
        im.save(path, **kw)
        written.append(path)

    write("hero-scene-light.webp", src, format="WEBP", quality=92, method=6)
    write("hero-sea-mask.png", sea_mask(src), optimize=True)
    write("hero-screen-glow.webp", screen_glow(), format="WEBP", quality=88, method=6)
    for i, seed in enumerate((11, 29, 47), start=1):
        write(f"hero-swell-{i}.webp", swell(seed), format="WEBP", quality=88, method=6)

    for p in written:
        print(f"écrit {p.relative_to(ROOT)} ({p.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
