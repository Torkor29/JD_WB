"""Small motion-design toolkit on top of Skia: easing, shaped type, paths."""
import math
import os
from contextlib import contextmanager

import skia
import uharfbuzz as hb

HERE = os.path.dirname(os.path.abspath(__file__))
FONT_DIR = os.path.join(HERE, "..", "fonts")


# ------------------------------------------------------------------ colour
def hexc(h, a=1.0):
    h = h.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    return skia.Color4f(r, g, b, a)


def mix(c0, c1, u):
    return skia.Color4f(c0.fR + (c1.fR - c0.fR) * u, c0.fG + (c1.fG - c0.fG) * u,
                        c0.fB + (c1.fB - c0.fB) * u, c0.fA + (c1.fA - c0.fA) * u)


def with_alpha(c, a):
    return skia.Color4f(c.fR, c.fG, c.fB, c.fA * a)


# ------------------------------------------------------------------ time
def clamp01(x):
    return 0.0 if x <= 0 else 1.0 if x >= 1 else x


def prog(t, t0, t1):
    if t1 <= t0:
        return 1.0 if t >= t1 else 0.0
    return clamp01((t - t0) / (t1 - t0))


def lerp(a, b, u):
    return a + (b - a) * u


class CubicBezier:
    """CSS-style timing function."""

    def __init__(self, x1, y1, x2, y2):
        self.p = (x1, y1, x2, y2)

    @staticmethod
    def _b(a1, a2, u):
        return 3 * a1 * u * (1 - u) ** 2 + 3 * a2 * u * u * (1 - u) + u ** 3

    @staticmethod
    def _db(a1, a2, u):
        return 3 * a1 * (1 - u) ** 2 + 6 * (a2 - a1) * u * (1 - u) + 3 * (1 - a2) * u * u

    def __call__(self, x):
        x = clamp01(x)
        if x in (0.0, 1.0):
            return x
        x1, y1, x2, y2 = self.p
        u = x
        for _ in range(8):
            f = self._b(x1, x2, u) - x
            d = self._db(x1, x2, u)
            if abs(f) < 1e-7:
                break
            if abs(d) < 1e-6:
                break
            u = clamp01(u - f / d)
        lo, hi = 0.0, 1.0
        if abs(self._b(x1, x2, u) - x) > 1e-5:
            for _ in range(40):
                u = 0.5 * (lo + hi)
                if self._b(x1, x2, u) < x:
                    lo = u
                else:
                    hi = u
        return self._b(y1, y2, u)


def _expo_out(x):
    return 1.0 if x >= 1 else 1 - 2 ** (-10 * x)


def _expo_in_out(x):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    return 2 ** (20 * x - 10) / 2 if x < 0.5 else (2 - 2 ** (-20 * x + 10)) / 2


EASE = {
    "linear": lambda x: clamp01(x),
    "out_expo": lambda x: _expo_out(clamp01(x)),
    "in_out_expo": lambda x: _expo_in_out(clamp01(x)),
    "out_quint": CubicBezier(0.22, 1, 0.36, 1),
    "out_cubic": CubicBezier(0.33, 1, 0.68, 1),
    "in_cubic": CubicBezier(0.32, 0, 0.67, 0),
    "in_quint": CubicBezier(0.64, 0, 0.78, 0),
    "in_out_cubic": CubicBezier(0.65, 0, 0.35, 1),
    "in_out_quint": CubicBezier(0.83, 0, 0.17, 1),
    "in_out_sine": CubicBezier(0.37, 0, 0.63, 1),
    "swift": CubicBezier(0.55, 0, 0.1, 1),      # fast start, long soft landing
    "emph": CubicBezier(0.2, 0, 0, 1),          # emphasized decelerate
    "glide": CubicBezier(0.7, 0, 0.2, 1),       # patient in, precise out
}


def ease(name, t, t0, t1):
    return EASE[name](prog(t, t0, t1))


def spring(x, zeta=1.0, omega=14.0):
    """Unit step response of a damped spring; x in seconds since release."""
    if x <= 0:
        return 0.0
    if zeta >= 1.0:
        return 1 - (1 + omega * x) * math.exp(-omega * x)
    wd = omega * math.sqrt(1 - zeta * zeta)
    return 1 - math.exp(-zeta * omega * x) * (math.cos(wd * x) + zeta * omega / wd * math.sin(wd * x))


# ------------------------------------------------------------------ canvas
@contextmanager
def saved(c):
    c.save()
    try:
        yield c
    finally:
        c.restore()


@contextmanager
def layer(c, alpha=1.0):
    if alpha >= 0.999:
        c.save()
    else:
        c.saveLayerAlpha(None, int(round(255 * clamp01(alpha))))
    try:
        yield c
    finally:
        c.restore()


def fill(color):
    return skia.Paint(AntiAlias=True, Color4f=color, Style=skia.Paint.kFill_Style)


def stroke(color, width, cap="butt", join="miter"):
    caps = {"butt": skia.Paint.kButt_Cap, "round": skia.Paint.kRound_Cap, "square": skia.Paint.kSquare_Cap}
    joins = {"miter": skia.Paint.kMiter_Join, "round": skia.Paint.kRound_Join, "bevel": skia.Paint.kBevel_Join}
    p = skia.Paint(AntiAlias=True, Color4f=color, Style=skia.Paint.kStroke_Style, StrokeWidth=width)
    p.setStrokeCap(caps[cap])
    p.setStrokeJoin(joins[join])
    return p


def trimmed(paint, u0, u1):
    p = skia.Paint(paint)
    if u0 > 0 or u1 < 1:
        p.setPathEffect(skia.TrimPathEffect.Make(max(0.0, u0), min(1.0, u1)))
    return p


def polyline(points, closed=False):
    p = skia.Path()
    if not points:
        return p
    p.moveTo(*points[0])
    for q in points[1:]:
        p.lineTo(*q)
    if closed:
        p.close()
    return p


def circle(c, x, y, r, paint):
    if r > 0:
        c.drawCircle(x, y, r, paint)


def transformed(path, sx, sy, tx, ty):
    m = skia.Matrix()
    m.setScaleTranslate(sx, sy, tx, ty)
    q = skia.Path(path)
    q.transform(m)
    return q


# ------------------------------------------------------------------ type
class Face:
    _cache = {}

    def __new__(cls, name):
        if name in cls._cache:
            return cls._cache[name]
        self = super().__new__(cls)
        path = os.path.join(FONT_DIR, name)
        blob = hb.Blob.from_file_path(path)
        self.hb_face = hb.Face(blob)
        self.hb_font = hb.Font(self.hb_face)
        self.upem = self.hb_face.upem
        self.sk_face = skia.Typeface.MakeFromFile(path)
        self.sk_font = skia.Font(self.sk_face, self.upem)
        self.sk_font.setSubpixel(True)
        self.sk_font.setHinting(skia.FontHinting.kNone)
        self.paths = {}
        self.name = name
        cap = self._glyph_bounds_for("H")
        self.cap = -cap.top() / self.upem if cap else 0.72
        xh = self._glyph_bounds_for("x")
        self.xheight = -xh.top() / self.upem if xh else 0.52
        cls._cache[name] = self
        return self

    def _glyph_bounds_for(self, ch):
        g = self.sk_font.textToGlyphs(ch)
        if not len(g):
            return None
        return self.glyph_path(int(g[0])).computeTightBounds()

    def glyph_path(self, gid):
        p = self.paths.get(gid)
        if p is None:
            p = self.sk_font.getPath(gid)
            if p is None:
                p = skia.Path()
            self.paths[gid] = p
        return p

    def shape(self, text, features=None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        feats = {"kern": True, "liga": True, "calt": True}
        if features:
            feats.update(features)
        hb.shape(self.hb_font, buf, feats)
        out = []
        for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((info.codepoint, pos.x_advance, pos.x_offset, pos.y_offset, info.cluster))
        return out


class Glyph:
    __slots__ = ("gid", "x", "y", "adv", "ch", "path", "ink")

    def __init__(self, gid, x, y, adv, ch, path):
        self.gid, self.x, self.y, self.adv, self.ch, self.path = gid, x, y, adv, ch, path
        b = path.computeTightBounds()
        self.ink = None if b.isEmpty() else b


class Text:
    """A single line of shaped text; positions in px (size = em in px)."""

    def __init__(self, face, text, size, tracking=0.0, features=None):
        self.face = face if isinstance(face, Face) else Face(face)
        self.text, self.size, self.tracking = text, size, tracking
        self.k = size / self.face.upem
        self.glyphs = []
        x = 0.0
        for gid, adv, xo, yo, cl in self.face.shape(text, features):
            gx = x + xo * self.k
            self.glyphs.append(Glyph(gid, gx, -yo * self.k, adv * self.k, text[cl], self.face.glyph_path(gid)))
            x += adv * self.k + tracking * size
        self.advance = x - (tracking * size if self.glyphs else 0.0)
        inks = [(g.x + g.ink.left() * self.k, g.x + g.ink.right() * self.k) for g in self.glyphs if g.ink]
        self.ink_left = min(a for a, b in inks) if inks else 0.0
        self.ink_right = max(b for a, b in inks) if inks else self.advance
        self.cap = self.face.cap * size

    @property
    def ink_width(self):
        return self.ink_right - self.ink_left

    def glyph_ink(self, i):
        g = self.glyphs[i]
        if not g.ink:
            return None
        return (g.x + g.ink.left() * self.k, g.y + g.ink.top() * self.k,
                g.x + g.ink.right() * self.k, g.y + g.ink.bottom() * self.k)

    def draw(self, c, x, y, paint, fn=None, only=None):
        """Draw with baseline-left at (x, y). fn(i, glyph) -> None to skip, or
        dict(dx, dy, alpha, sx, sy, rot, tracking_dx) applied per glyph."""
        k = self.k
        base_alpha = paint.getAlphaf()
        for i, g in enumerate(self.glyphs):
            if only is not None and i not in only:
                continue
            if g.ink is None:
                continue
            tf = fn(i, g) if fn else {}
            if tf is None:
                continue
            a = tf.get("alpha", 1.0)
            if a <= 0.002:
                continue
            c.save()
            c.translate(x + g.x + tf.get("dx", 0.0), y + g.y + tf.get("dy", 0.0))
            rot = tf.get("rot", 0.0)
            sx, sy = tf.get("sx", 1.0), tf.get("sy", 1.0)
            if rot or sx != 1.0 or sy != 1.0:
                # rotate / scale around the glyph's ink centre at baseline
                cx = (g.ink.left() + g.ink.right()) * 0.5 * k
                c.translate(cx, 0)
                if rot:
                    c.rotate(rot)
                c.scale(sx, sy)
                c.translate(-cx, 0)
            c.scale(k, k)
            if a < 0.999:
                p = skia.Paint(paint)
                p.setAlphaf(base_alpha * a)
                c.drawPath(g.path, p)
            else:
                c.drawPath(g.path, paint)
            c.restore()

    def path(self, x=0.0, y=0.0):
        out = skia.Path()
        for g in self.glyphs:
            if g.ink is None:
                continue
            m = skia.Matrix()
            m.setScaleTranslate(self.k, self.k, x + g.x, y + g.y)
            out.addPath(g.path, m)
        return out


def lines_width(texts):
    return max(t.ink_width for t in texts)


# ------------------------------------------------------------------ misc
def smoothstep(e0, e1, x):
    u = clamp01((x - e0) / (e1 - e0))
    return u * u * (3 - 2 * u)


def hash01(*args):
    """Deterministic pseudo random in [0,1)."""
    h = 2166136261
    for a in args:
        for ch in repr(a):
            h = ((h ^ ord(ch)) * 16777619) & 0xFFFFFFFF
    return (h % 1000003) / 1000003.0


def value_noise(x, seed=0):
    """Smooth 1D noise in [-1, 1]."""
    i = math.floor(x)
    f = x - i
    a = hash01(seed, i) * 2 - 1
    b = hash01(seed, i + 1) * 2 - 1
    u = f * f * (3 - 2 * f)
    return a + (b - a) * u


def fbm(x, seed=0, octaves=3):
    s, amp, freq, norm = 0.0, 1.0, 1.0, 0.0
    for o in range(octaves):
        s += amp * value_noise(x * freq, seed + o * 17)
        norm += amp
        amp *= 0.5
        freq *= 2.03
    return s / norm
