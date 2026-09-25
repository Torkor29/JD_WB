"""Render the WENBOT film.

  python render.py stills --times 0.5 2.6 ... --scale 0.25 --out sheet.png
  python render.py video  --aspect 16x9 --scale 1.0 --out ../out/film_16x9.mp4 --audio ../out/sound.wav
"""
import argparse
import multiprocessing as mp
import os
import subprocess
import sys
import time

import numpy as np
import skia

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film  # noqa: E402

ASPECTS = {"16x9": (3840, 2160), "9x16": (2160, 3840), "1x1": (2160, 2160)}
SHUTTER = 0.5  # 180 degree shutter, in frames

_F = None
_ARGS = None


def _init(aspect, scale, samples, grain):
    global _F, _ARGS
    W, H = ASPECTS[aspect]
    _F = film.Film(W, H)
    _ARGS = dict(scale=scale, samples=samples, grain=grain, W=W, H=H)


def render_raw(t):
    a = _ARGS
    w, h = int(round(a["W"] * a["scale"])), int(round(a["H"] * a["scale"]))
    surf = skia.Surface.MakeRaster(skia.ImageInfo.Make(w, h, skia.kRGBA_8888_ColorType, skia.kPremul_AlphaType))
    c = surf.getCanvas()
    c.scale(a["scale"], a["scale"])
    _F.draw(c, t)
    return surf.makeImageSnapshot().toarray(colorType=skia.kRGBA_8888_ColorType)[:, :, :3]


def render_frame(i):
    a = _ARGS
    fps = film.FPS
    t = i / fps
    half = SHUTTER / fps / 2
    n = a["samples"]
    if n <= 1:
        img = render_raw(t).astype(np.float32)
    else:
        first = render_raw(t - half)
        last = render_raw(t + half)
        diff = np.abs(first.astype(np.int16) - last.astype(np.int16)).max()
        if diff <= 3:
            img = render_raw(t).astype(np.float32)
        else:
            # more samples for larger motions (thin fast lines strobe otherwise)
            k = n if diff > 40 else max(6, n // 2)
            acc = first.astype(np.float32) + last.astype(np.float32)
            for j in range(1, k - 1):
                tt = t - half + 2 * half * j / (k - 1)
                acc += render_raw(tt)
            img = acc / k
    if a["grain"] > 0:
        rng = np.random.default_rng(1000 + i)
        g = rng.standard_normal(img.shape[:2], dtype=np.float32) * a["grain"]
        # grain is strongest in the mid tones, nearly absent in pure black
        lum = img.mean(axis=2, keepdims=True) / 255.0
        wgt = 0.35 + 0.65 * np.sqrt(np.clip(lum * (1.4 - lum), 0, 1))
        img = img + g[:, :, None] * wgt
    return i, np.clip(img + 0.5, 0, 255).astype(np.uint8)


def cmd_stills(args):
    _init(args.aspect, args.scale, args.samples, 0.0)
    from PIL import Image, ImageDraw
    frames = []
    for t in args.times:
        _, img = render_frame(int(round(t * film.FPS)))
        frames.append((t, img))
    cols = args.cols
    h, w = frames[0][1].shape[:2]
    rows = (len(frames) + cols - 1) // cols
    pad = 6
    sheet = Image.new("RGB", (cols * w + (cols - 1) * pad, rows * h + (rows - 1) * pad), (200, 40, 40))
    for k, (t, img) in enumerate(frames):
        im = Image.fromarray(img)
        d = ImageDraw.Draw(im)
        d.rectangle([0, 0, 64, 16], fill=(200, 40, 40))
        d.text((3, 2), f"{t:05.2f}", fill=(255, 255, 255))
        sheet.paste(im, ((k % cols) * (w + pad), (k // cols) * (h + pad)))
    sheet.save(args.out)
    print("wrote", args.out)


def cmd_video(args):
    W, H = ASPECTS[args.aspect]
    w, h = int(round(W * args.scale)), int(round(H * args.scale))
    n_frames = int(round(film.DURATION * film.FPS))
    start = args.start
    if args.limit:
        n_frames = min(n_frames, start + args.limit)
    ff = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}",
          "-r", str(film.FPS), "-i", "-"]
    if args.audio:
        ff += ["-i", args.audio]
    ff += ["-c:v", "libx264", "-preset", args.preset, "-crf", str(args.crf), "-pix_fmt", "yuv420p",
           "-profile:v", "high", "-tune", "film", "-x264-params", "aq-mode=3",
           "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
           "-movflags", "+faststart"]
    if args.audio:
        ff += ["-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-shortest"]
    ff += [args.out]
    proc = subprocess.Popen(ff, stdin=subprocess.PIPE)
    t0 = time.time()
    with mp.Pool(args.jobs, initializer=_init, initargs=(args.aspect, args.scale, args.samples, args.grain)) as pool:
        for k, (i, img) in enumerate(pool.imap(render_frame, range(start, n_frames), chunksize=1)):
            proc.stdin.write(img.tobytes())
            if k % 25 == 0:
                el = time.time() - t0
                print(f"frame {i}/{n_frames}  {el:6.1f}s  {(k + 1) / max(el, 1e-6):.2f} fps", flush=True)
    proc.stdin.close()
    proc.wait()
    print("wrote", args.out, f"in {time.time() - t0:.1f}s")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("stills")
    s.add_argument("--times", type=float, nargs="+", required=True)
    s.add_argument("--aspect", default="16x9")
    s.add_argument("--scale", type=float, default=0.25)
    s.add_argument("--samples", type=int, default=1)
    s.add_argument("--cols", type=int, default=4)
    s.add_argument("--out", default="sheet.png")
    v = sub.add_parser("video")
    v.add_argument("--aspect", default="16x9")
    v.add_argument("--scale", type=float, default=1.0)
    v.add_argument("--samples", type=int, default=32)
    v.add_argument("--grain", type=float, default=0.0)
    v.add_argument("--crf", type=int, default=16)
    v.add_argument("--preset", default="slow")
    v.add_argument("--jobs", type=int, default=max(1, os.cpu_count() - 1))
    v.add_argument("--audio", default=None)
    v.add_argument("--limit", type=int, default=0)
    v.add_argument("--start", type=int, default=0)
    v.add_argument("--out", required=True)
    args = ap.parse_args()
    {"stills": cmd_stills, "video": cmd_video}[args.cmd](args)


if __name__ == "__main__":
    main()
