# WENBOT — film promotionnel

Film de 21,5 s, noir et blanc, entièrement généré par code (image + son), 25 i/s.

| Fichier | Format |
| --- | --- |
| `out/WENBOT_film_16x9_4K.mp4` | Master 16:9, 3840×2160, H.264 High, AAC 320 kb/s |
| `out/WENBOT_film_9x16.mp4` | Vertical 9:16, 2160×3840 (Reels, TikTok, Stories) |
| `out/WENBOT_film_1x1.mp4` | Carré 1:1, 2160×2160 (feed) |
| `out/wenbot_sound.wav` | Bande son seule, 48 kHz stéréo, ≈ −16 LUFS, crête −1,5 dBFS |
| `out/WENBOT_endcard_16x9.png` | Dernière image (vignette / cover) |

## Rendre à nouveau

```bash
pip install skia-python uharfbuzz numpy scipy pyloudnorm pillow imageio-ffmpeg
cd promo/src
python sound.py --out ../out/wenbot_sound.wav
python render.py video --aspect 16x9 --audio ../out/wenbot_sound.wav --out ../out/WENBOT_film_16x9_4K.mp4
python render.py video --aspect 9x16 --audio ../out/wenbot_sound.wav --out ../out/WENBOT_film_9x16.mp4
python render.py video --aspect 1x1  --audio ../out/wenbot_sound.wav --out ../out/WENBOT_film_1x1.mp4
# planche de contrôle (images fixes)
python render.py stills --times 2.8 5.6 6.8 9.6 11.9 13.7 16.4 20.2 --out sheet.png
```

`ffmpeg` doit être dans le `PATH` (le binaire statique d'`imageio-ffmpeg` convient).

## Code

- `src/logo.py` — le symbole WB redessiné en vecteurs (ajusté sur `assets/wb_symbol_reference.png`),
  découpé en éléments animables : point, zig-zag, fûts du W, fût et panses du B, anneau + point.
- `src/film.py` — toute la mise en scène ; les temps de chaque événement sont dans `T`.
- `src/sound.py` — sound design synthétisé (sub, ticks, impacts, whooshes, ligne de marché sonifiée),
  calé sur les mêmes temps `T`.
- `src/engine.py` — easing, typographie (HarfBuzz → contours Skia), tracés.
- `src/render.py` — rendu image par image, flou de bougé par sur-échantillonnage temporel (obturateur 180°), encodage.

Typographies (licence SIL OFL, dans `fonts/`) : Inter Display (titres), Geist Mono (données),
Montserrat (logotype WENBOT, au plus proche du logo existant).

Aucune promesse de rendement n'apparaît dans le film ; mention finale : « Trading involves risk. Capital at risk. »
