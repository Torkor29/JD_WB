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
                          Le trait de côte est relevé à la main (COAST) : plus
                          fiable qu'une segmentation par couleur, l'eau étant
                          très pâle sous le soleil. Il n'est plus servi au
                          navigateur, seulement utilisé ici pour borner.
  hero-swell-*.webp     : nappes de crêtes courtes et d'éclats de soleil, à la
                          perspective de l'eau, déjà bornées à l'eau
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
SCREEN = (755, 603)  # dalle du laptop, relevée sur l'illustration

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


def water(mask: Image.Image) -> np.ndarray:
    """Le masque de l'eau, reculé de la marge de dérive.

    Les nappes de houle dérivent de deux pour cent de la hauteur du cadre. Le
    navigateur n'applique donc plus de masque par-dessus — un masque plein cadre
    l'obligeait à le réappliquer sur tout l'écran dès qu'une nappe bougeait, au
    prix d'un bon tiers des images par seconde. Le bornage est cuit ici, avec un
    recul suffisant pour que la dérive ne pousse jamais une crête sur la falaise
    ni sur un rocher.

    La forme du masque est dans son canal alpha : une conversion en niveaux de
    gris lirait le RGB, blanc partout.
    """
    m = Image.fromarray(np.asarray(mask)[:, :, 3])
    m = m.filter(ImageFilter.MinFilter(49)).filter(ImageFilter.GaussianBlur(9))
    return np.asarray(m).astype(float) / 255.0


def swell_field(seed: int, mask: Image.Image) -> Image.Image:
    """Nappe de crêtes courtes et brisées, à la perspective de l'eau.

    La version précédente était une crête unique, pleine largeur, que l'on
    faisait glisser vers le bas : ça se lisait comme une barre qui descend, pas
    comme de la houle. Ici la nappe est semée de crêtes brèves, orientées et
    dimensionnées selon leur distance — fines et serrées près de l'horizon,
    larges et espacées au premier plan. Trois nappes se relaient à l'écran, si
    bien qu'aucune forme identifiable ne traverse le cadre.

    Le fichier fait la taille de l'illustration : affiché avec le même
    `object-cover`, il tombe pile sur l'eau.
    """
    rng = np.random.default_rng(seed)
    m = water(mask)

    core = np.zeros((H, W), dtype=float)
    shade = np.zeros((H, W), dtype=float)

    top = HORIZON + 6
    for _ in range(150):
        # t vaut 0 à l'horizon, 1 au premier plan. L'exposant resserre le semis
        # près de l'horizon, où l'œil voit beaucoup de crêtes à la fois.
        t = rng.random() ** 1.7
        y0 = top + t * (H - top)
        length = 30 + 260 * t ** 1.45
        thick = 0.9 + 4.2 * t ** 1.35
        x0 = rng.uniform(940, W + 60)

        xa, xb = int(max(0, x0)), int(min(W, x0 + length))
        if xb - xa < 8:
            continue
        u = np.linspace(0, 1, xb - xa)
        # Une crête n'est jamais droite : deux ondulations lui suffisent.
        centre = y0 + (1.5 + 5 * t) * np.sin(
            2 * np.pi * u * rng.uniform(0.6, 1.8) + rng.uniform(0, 6.3)
        )
        # Extinction aux deux bouts, sinon la crête se coupe net dans l'eau.
        taper = np.sin(np.pi * u) ** 0.65

        ya = int(max(0, centre.min() - 3 * thick))
        yb = int(min(H, centre.max() + 7 * thick + 2))
        if yb - ya < 3:
            continue
        rows = np.arange(ya, yb)[:, None]
        core[ya:yb, xa:xb] += (
            np.exp(-(((rows - centre[None, :]) / thick) ** 2)) * taper[None, :]
        )
        shade[ya:yb, xa:xb] += (
            np.exp(-(((rows - centre[None, :] - 2.4 * thick) / (1.9 * thick)) ** 2))
            * taper[None, :]
            * 0.42
        )

    # Éclats du soleil, semés dans la même nappe. Un jeu de calques séparé,
    # scintillant plus vite, coûtait quinze images par seconde à lui seul ; ici
    # les éclats se renouvellent au rythme du relais des nappes.
    top_g = HORIZON + 4
    for _ in range(240):
        t = rng.random() ** 1.5
        y = top_g + t * (H - top_g)
        x = rng.uniform(980, W)
        # La traînée du soleil s'évase vers le premier plan.
        if abs(x - (1290 + 90 * t)) > 150 + 260 * t:
            continue
        r = 0.8 + 3.2 * t
        xa, xb = int(max(0, x - 3 * r)), int(min(W, x + 3 * r + 1))
        ya, yb = int(max(0, y - 1.6 * r)), int(min(H, y + 1.6 * r + 1))
        if xb - xa < 2 or yb - ya < 2:
            continue
        gx = (np.arange(xa, xb) - x) / (2.1 * r)
        gy = (np.arange(ya, yb) - y) / (0.75 * r)
        # Étirés horizontalement : un reflet sur l'eau est un trait, pas un point.
        core[ya:yb, xa:xb] += (
            np.exp(-(gy[:, None] ** 2 + gx[None, :] ** 2)) * rng.uniform(0.8, 1.6)
        )

    core = np.clip(core, 0, 1) * m
    shade = np.clip(shade, 0, 1) * m

    # Discret : trois nappes se superposent à l'écran, et l'illustration porte
    # déjà sa propre texture d'eau. Trop appuyées, les crêtes se lisaient comme
    # des traits peints par-dessus.
    alpha = np.clip(core * 0.30 + shade * 0.34, 0, 1)
    with np.errstate(invalid="ignore"):
        part = np.where(alpha > 0, shade * 0.34 / np.maximum(alpha, 1e-6), 0)[..., None]
    white = np.array([255, 255, 255], dtype=float)
    teal = np.array([38, 150, 174], dtype=float)
    rgb = white * (1 - part) + teal * part

    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA").filter(ImageFilter.GaussianBlur(1.6))


def screen_glow() -> Image.Image:
    """Halo de l'écran, au cadrage de l'illustration.

    Le fichier fait la taille de l'illustration pour pouvoir être affiché avec
    le même `object-cover` : le halo tombe alors pile sur la dalle quel que soit
    le format de la fenêtre, sans le moindre calcul.
    """
    cx, cy = SCREEN
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)

    halo = np.clip(1 - d / 195.0, 0, 1) ** 1.9 * 0.34
    core = np.clip(1 - d / 74.0, 0, 1) ** 1.25 * 0.95

    # Deux teintes, parce que le calque est simplement superposé et non fusionné
    # en « screen » — ce mode éclaircissait joliment mais obligeait le navigateur
    # à relire le fond sur tout le calque, au prix de 20 images par seconde.
    # Superposer ne peut éclaircir qu'en posant une couleur plus claire que le
    # fond : le cœur est donc quasi blanc, pour que la dalle monte en luminosité,
    # et la nappe reste bleue, pour jeter une lumière froide sur le sable et
    # l'herbe alentour.
    alpha = np.clip(halo + core, 0, 1)
    with np.errstate(invalid="ignore"):
        share = np.where(alpha > 0, core / np.maximum(alpha, 1e-6), 0)[..., None]
    white = np.array([250, 253, 255], dtype=float)
    blue = np.array([132, 194, 255], dtype=float)
    rgb = white * share + blue * (1 - share)

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

    mask = sea_mask(src)

    write("hero-scene-light.webp", src, format="WEBP", quality=92, method=6)
    write("hero-screen-glow.webp", screen_glow(), format="WEBP", quality=88, method=6)
    for i, seed in enumerate((11, 29, 47), start=1):
        write(f"hero-swell-{i}.webp", swell_field(seed, mask), format="WEBP", quality=86, method=6)

    for p in written:
        print(f"écrit {p.relative_to(ROOT)} ({p.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
