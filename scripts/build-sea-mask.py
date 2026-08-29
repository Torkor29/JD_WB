#!/usr/bin/env python3
"""Construit les fichiers du hero à partir de l'illustration maîtresse.

L'illustration `art/hero-scene-light.png` n'est pas servie telle quelle : le
script en exporte une version WebP, dix fois plus légère à qualité visuelle
équivalente.

Il en tire aussi le masque de l'eau. L'animation de la mer est dessinée en SVG
par-dessus l'illustration ; pour qu'elle ne bave jamais sur la falaise ni sur
les rochers émergés, on la confine à ce masque.

Le contour de la côte est relevé à la main sur l'illustration (COAST, en
coordonnées de l'illustration 1536 × 1024) : c'est plus fiable qu'une
segmentation par couleur, l'eau étant très pâle sous le soleil. Les rochers,
eux, se détectent bien : à l'intérieur du polygone, seuls eux sont chauds
(R nettement supérieur à B) sans être délavés par le contre-jour.

Sortie : public/beach/hero-sea-mask.png — niveaux de gris opaques, donc
utilisable directement comme masque de luminance SVG.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "art/hero-scene-light.png"
OUT_SCENE = ROOT / "public/beach/hero-scene-light.webp"
OUT_MASK = ROOT / "public/beach/hero-sea-mask.png"

W, H = 1536, 1024
HORIZON = 590
ROCKS_FROM = 680  # premier rocher émergé

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


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    if src.size != (W, H):
        raise SystemExit(f"illustration attendue en {W}×{H}, reçue en {src.size}")

    src.save(OUT_SCENE, "WEBP", quality=92, method=6)

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

    mask.convert("L").save(OUT_MASK, optimize=True)

    for p in (OUT_SCENE, OUT_MASK):
        print(f"écrit {p.relative_to(ROOT)} ({p.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
