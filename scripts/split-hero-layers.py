#!/usr/bin/env python3
"""Décompose l'illustration hero en calques animables.

L'illustration d'origine reste le fond, intact. On en extrait :

  - hero-sky-drift.png : la portion de ciel sans élément de premier plan
    (à droite des poteaux), en RGBA avec des bords fondus. Ce calque se
    superpose exactement au fond et dérive lentement : les nuages de
    l'illustration bougent réellement, sans redessiner quoi que ce soit.

  - hero-sea-mask.png : masque alpha de l'eau, pour confiner l'animation des
    vaguelettes à la surface de la mer (rochers et côte exclus).

La silhouette du terrain est détectée colonne par colonne, avec un filtre
médian sur x pour ignorer poteaux et fils, trop fins pour compter.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

SRC = Path("public/beach/hero-scene-light.png")
OUT_BASE = Path("public/beach/hero-base.webp")
OUT_SKY = Path("public/beach/hero-sky-drift.webp")
OUT_SEA = Path("public/beach/hero-sea-mask.webp")
OUT_GLOW = Path("public/beach/hero-screen-glow.webp")
DEBUG_DIR = Path("/tmp")

# Centre de l'écran du laptop, mesuré sur l'illustration
SCREEN = (0.4925, 0.5828)
SCREEN_RADIUS = 0.115  # en fraction de largeur

# Le calque ciel démarre à droite des poteaux, dont les fils montent jusqu'à
# x ≈ 0.42 : tout élément de premier plan pris dans le calque dériverait avec
# les nuages et se décrocherait du sol. Il s'arrête avant le soleil, dont le
# halo doit rester aligné avec son reflet sur l'eau, qui ne bouge pas.
SKY_LEFT_START = 0.44
SKY_LEFT_FULL = 0.58
SKY_RIGHT_START = 0.80
SKY_RIGHT_END = 0.93
SKY_TOP_FEATHER = 0.17  # long, sinon le haut du cadre montre une arête nette
SKY_BOTTOM_BAND = 0.075  # fondu au-dessus de la ligne de crête
LAND_MARGIN = 10
SKY_MAX = 0.60  # garde-fou : le ciel ne descend jamais plus bas

# Ligne d'horizon de cette illustration (mesurée : la mer commence là).
# La détecter automatiquement est peu fiable ici, l'éblouissement du soleil
# rendant l'eau presque blanche sur toute la moitié droite.
SEA_HORIZON = 0.586


def luma(a: np.ndarray) -> np.ndarray:
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def median_1d(v: np.ndarray, win: int) -> np.ndarray:
    half = win // 2
    pad = np.pad(v, half, mode="edge")
    return np.median(np.lib.stride_tricks.sliding_window_view(pad, win), axis=-1)


def smooth_1d(v: np.ndarray, win: int) -> np.ndarray:
    kernel = np.hanning(win)
    kernel /= kernel.sum()
    half = win // 2
    return np.convolve(np.pad(v, half, mode="edge"), kernel, mode="same")[half:-half]


def ramp(v: np.ndarray, lo: float, hi: float) -> np.ndarray:
    return np.clip((v - lo) / (hi - lo), 0.0, 1.0)


def save_webp(rgba: np.ndarray, path: Path) -> None:
    img = Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), mode="RGBA")
    # alpha_quality=100 : les dégradés de bord doivent rester lisses, sinon le
    # calque montre des arêtes en dérivant.
    img.save(path, quality=90, alpha_quality=100, method=6, exact=True)


def land_silhouette(arr: np.ndarray, lum: np.ndarray) -> np.ndarray:
    """Première ligne, par colonne, où le terrain commence vraiment."""
    h, w = lum.shape
    # Le ciel près du soleil est franchement chaud : sans condition de
    # luminosité, il serait pris pour du terrain et la crête remonterait au
    # sommet de l'image sur toute la moitié droite.
    warm = arr[..., 0] - arr[..., 2]
    land = (lum < 140) | (warm > 70) | ((warm > 22) & (lum < 200))

    run = 40
    cs = np.cumsum(np.vstack([np.zeros((1, w)), land.astype(np.float64)]), axis=0)
    solid = ((cs[run:] - cs[:-run]) / run) > 0.8

    first = np.where(solid.any(axis=0), solid.argmax(axis=0), h).astype(np.float64)
    return np.clip(smooth_1d(median_1d(first, 121), 161), 0, SKY_MAX * h)


def sea_mask(arr: np.ndarray) -> tuple[np.ndarray, int]:
    """Masque de l'eau + ligne d'horizon détectée."""
    h, w = arr.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]

    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]

    horizon = int(SEA_HORIZON * h)

    # L'eau est cyan, sauf dans la bande d'éblouissement sous le soleil : elle
    # reste presque blanche, on la rattache à la mer si elle n'est pas chaude.
    cyanish = (b - r > 8) & (g > r - 2)
    glare = (yy < horizon + 0.10 * h) & (xx > 0.60 * w) & ((r - b) < 45)
    water = (yy > horizon) & (cyanish | glare)

    m = Image.fromarray((water * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
    m = m.filter(ImageFilter.GaussianBlur(2.2))
    mask = np.asarray(m).astype(np.float64) / 255.0

    # Pas de vaguelette collée à l'horizon
    mask *= ramp(yy.astype(np.float64), horizon + 4, horizon + 34)
    return mask, horizon


def main() -> None:
    img = Image.open(SRC).convert("RGB")
    w, h = img.size
    arr = np.asarray(img).astype(np.float64)
    lum = luma(arr)
    yy, xx = np.mgrid[0:h, 0:w]

    # ——— calque ciel ———
    land_top = land_silhouette(arr, lum)
    fx = ramp(xx / w, SKY_LEFT_START, SKY_LEFT_FULL) * (
        1 - ramp(xx / w, SKY_RIGHT_START, SKY_RIGHT_END)
    )
    fy = ramp(yy / h, 0.0, SKY_TOP_FEATHER) * ramp(
        (land_top[None, :] - LAND_MARGIN - yy) / h, 0.0, SKY_BOTTOM_BAND
    )
    sky_alpha = fx * fy

    save_webp(np.dstack([arr, sky_alpha * 255.0]), OUT_SKY)

    # ——— masque de mer ———
    mask, horizon = sea_mask(arr)
    save_webp(np.dstack([np.full((h, w, 3), 255.0), mask * 255.0]), OUT_SEA)

    # ——— halo de l'écran ———
    dist = np.hypot((xx / w - SCREEN[0]), (yy / h - SCREEN[1]) * h / w) / SCREEN_RADIUS
    glow = np.clip(1 - dist, 0.0, 1.0) ** 2.2
    tint = np.zeros((h, w, 3))
    tint[..., 0], tint[..., 1], tint[..., 2] = 214, 234, 255
    save_webp(np.dstack([tint, glow * 255.0]), OUT_GLOW)

    # ——— fond, converti pour le poids ———
    Image.fromarray(arr.astype(np.uint8)).save(OUT_BASE, quality=90, method=6)

    # ——— aperçus de contrôle ———
    tint = arr.copy()
    tint[..., 0] = arr[..., 0] * (1 - mask) + 255 * mask
    Image.fromarray(np.clip(tint, 0, 255).astype(np.uint8)).save(
        DEBUG_DIR / "hero-debug-sea.png"
    )
    over = arr * (1 - sky_alpha[..., None]) + np.array([255, 60, 60]) * sky_alpha[
        ..., None
    ] * 0.45 + arr * sky_alpha[..., None] * 0.55
    Image.fromarray(np.clip(over, 0, 255).astype(np.uint8)).save(
        DEBUG_DIR / "hero-debug-sky.png"
    )

    print(f"ciel: couverture {sky_alpha.mean():.3f} | crête {land_top.min():.0f}px")
    print(f"mer: horizon {horizon}px ({horizon / h:.3f}) | couverture {mask.mean():.3f}")


if __name__ == "__main__":
    main()
