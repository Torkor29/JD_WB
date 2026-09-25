"""WENBOT — promotional film. Every frame is drawn here, as a function of time.

Timeline constants (seconds) live in T and are shared with sound.py so that
picture and sound stay frame-accurate.
"""
import math

import skia

import logo
from engine import (EASE, Text, clamp01, circle, ease, fbm, fill, hexc, lerp, mix,
                    polyline, prog, saved, spring, stroke, trimmed, with_alpha)

FPS = 25

# ----------------------------------------------------------------------------- timeline
T = dict(
    # 01 markets
    dot=0.40, tick_in=(0.72, 0.82, 0.92), tick_out=1.86,
    mm=2.00, mm_text=2.22, mm_out=3.45,
    # 02 discipline
    line=3.45, wave=3.55, emo=3.72, snap=5.10, strat=5.26, strat_out=6.00,
    fold=6.24, fold_end=6.58, thick=6.58, thick_end=6.88, flood=7.04, flood_end=7.36,
    # 03 architecture — from here to the principles, events sit on a 100 BPM grid (0.6 s)
    cap=7.36, frame=7.96, broker=8.06, link=8.56, wb=8.66, pulse=(8.80, 9.40),
    iris=9.90, iris_end=10.36,
    # 04 execution
    rows=10.36, run=10.50, exec=(10.96, 11.56), sys=12.16,
    # 05 principles
    sys_type=12.46, disc=13.36, trans=14.26,
    # 06 custody
    cust=15.14,
    # 07 wenbot
    fin=17.08, tittle=17.56, zig=17.60, grow=17.90, stem=18.02, bowls=18.12, lock=18.58,
    word=18.66, cats=18.96, tag=19.24, legal=19.42, hold=19.72, fade=21.18, end=21.80,
)
DURATION = T["end"]

SECTIONS = [(0.0, "01", "MARKETS"), (T["line"], "02", "DISCIPLINE"), (T["flood"], "03", "ARCHITECTURE"),
            (T["iris"] + 0.2, "04", "EXECUTION"), (T["sys"] + 0.3, "05", "PRINCIPLES"),
            (T["cust"], "06", "CUSTODY"), (T["fin"] + 0.3, "07", "WENBOT")]

# ----------------------------------------------------------------------------- look
DARK = dict(bg=hexc("#0B0B0C"), fg=hexc("#F3F2EE"), fg2=hexc("#8C8B87"), fg3=hexc("#4B4B49"),
            hair=hexc("#2C2C2D"), grid=hexc("#1A1A1B"))
LIGHT = dict(bg=hexc("#EEEDE8"), fg=hexc("#0C0C0D"), fg2=hexc("#72716C"), fg3=hexc("#A6A5A0"),
             hair=hexc("#C9C8C2"), grid=hexc("#DFDED8"))

SEMI = "InterDisplay-SemiBold.ttf"
MED = "InterDisplay-Medium.ttf"
REG = "InterDisplay-Regular.ttf"
MONO = "GeistMono-Regular.ttf"
MONO_M = "GeistMono-Medium.ttf"
BRAND = "Montserrat-Bold.ttf"
BRAND_M = "Montserrat-Medium.ttf"

TICKERS = [("EUR/USD", ["1.17382", "1.17385", "1.17379"]),
           ("XAU/USD", ["3742.6", "3742.9", "3742.4"]),
           ("BTC/USD", ["93,821", "93,834", "93,812"])]
TICK_UPD = [(1.18, 1.56), (1.32, 1.70), (1.25, 1.63)]


def utc(t):
    """The film's market clock (UTC), shared by the HUD and the execution log."""
    ms = int(round((14 * 3600 + 32 * 60 + 5.0 + t) * 1000))
    hh, rem = divmod(ms, 3600000)
    mm_, rem = divmod(rem, 60000)
    ss, mss = divmod(rem, 1000)
    return f"{hh:02d}:{mm_:02d}:{ss:02d}.{mss:03d}"


class Statement:
    """A line of display type whose final period is drawn as the brand dot."""

    def __init__(self, face, text, size, tracking=-0.03):
        self.t = Text(face, text, size, tracking)
        self.size = size
        self.cap = self.t.cap
        self.dot = None
        self.skip = set()
        if text.endswith("."):
            i = len(self.t.glyphs) - 1
            x0, y0, x1, y1 = self.t.glyph_ink(i)
            self.dot = ((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2)
            self.skip = {i}
        inks = [self.t.glyph_ink(i) for i in range(len(self.t.glyphs)) if i not in self.skip]
        inks = [b for b in inks if b]
        self.ink_left = min(b[0] for b in inks)
        self.ink_right = max(b[2] for b in inks)
        self.right = self.t.ink_right

    @property
    def n(self):
        return len(self.t.glyphs)

    def draw(self, c, x, y, paint, fn=None):
        skip = self.skip

        def f(i, g):
            if i in skip:
                return None
            return fn(i, g) if fn else {}
        self.t.draw(c, x, y, paint, f)

    def dot_at(self, x, y):
        cx, cy, r = self.dot
        return x + cx, y + cy, r


def fit(face, text, width, tracking=-0.03, ref=400.0):
    probe = Statement(face, text, ref, tracking)
    return Statement(face, text, ref * width / (probe.right - probe.ink_left), tracking)


class Film:
    def __init__(self, W=3840, H=2160):
        self.W, self.H = W, H
        self.portrait = H > W * 1.2
        self.square = not self.portrait and W < H * 1.2
        self.cache = {}
        self._layout()

    # ------------------------------------------------------------------ helpers
    def txt(self, face, s, size, tracking=0.0):
        key = (face, s, round(size, 3), tracking)
        t = self.cache.get(key)
        if t is None:
            if len(self.cache) > 4000:
                self.cache.clear()
            t = self.cache[key] = Text(face, s, size, tracking)
        return t

    def _layout(self):
        W = self.W
        land = not self.portrait and not self.square
        self.M = 240 if land else 170                   # side margin
        self.hud_in = 96 if land else 84
        cw = W - 2 * self.M                              # content width
        self.cw = cw
        # 01
        self.s_mm = fit(SEMI, "MARKETS MOVE.", cw * (0.985 if land else 1.0))
        if not land:
            self.s_mm = [fit(SEMI, "MARKETS", cw), None]
            self.s_mm[1] = Statement(SEMI, "MOVE.", self.s_mm[0].size, -0.03)
        # 02
        emo_w = cw * (0.80 if land else 1.0)
        if land:
            self.s_emo = [fit(MED, "EMOTION MOVES WITH THEM.", emo_w, -0.02)]
            self.s_strat = [fit(SEMI, "STRATEGY SHOULDN’T.", cw * 0.90)]
        else:
            a = fit(MED, "EMOTION MOVES", emo_w, -0.02)
            self.s_emo = [a, Statement(MED, "WITH THEM.", a.size, -0.02)]
            b = fit(SEMI, "SHOULDN’T.", cw)
            self.s_strat = [Statement(SEMI, "STRATEGY", b.size), b]
        # 03
        sz = 200 if land else 170
        self.s_cap = Statement(SEMI, "YOUR CAPITAL.", sz)
        self.s_broker = Statement(SEMI, "YOUR BROKER.", sz * 0.56)
        self.s_wb = [Statement(SEMI, "WENBOT", sz), Statement(SEMI, "EXECUTES.", sz)]
        # 05
        self.s_words = [fit(SEMI, w, cw * (0.99 if land else 1.0)) for w in ("SYSTEMATIC.", "DISCIPLINED.", "TRANSPARENT.")]
        # 06
        if land:
            c1 = fit(SEMI, "YOUR CAPITAL", cw * 0.62)
            self.s_cust = [c1, Statement(SEMI, "STAYS YOURS.", c1.size)]
        else:
            c1 = fit(SEMI, "YOUR CAPITAL", cw)
            self.s_cust = [c1, Statement(SEMI, "STAYS YOURS.", c1.size)]
        self.s_withdraw = Text(REG, "Withdraw according to your broker’s conditions.", 64 if land else 56, 0.0)

    # ------------------------------------------------------------------ frame
    def draw(self, c, t):
        W, H = self.W, self.H
        if t < T["thick"]:
            self.shot_open(c, t)
        elif t < T["flood_end"]:
            self.shot_open(c, t)
            with saved(c):
                c.clipPath(self.w_mask(t), skia.ClipOp.kIntersect, True)
                self.shot_arch(c, t)
        elif t < T["iris"]:
            self.shot_arch(c, t)
        elif t < T["iris_end"]:
            self.shot_arch(c, t)
            cx, cy, r0 = self.arch_marker()
            u = ease("glide", t, T["iris"], T["iris_end"])
            rmax = math.hypot(max(cx, W - cx), max(cy, H - cy)) + 20
            r = lerp(r0, rmax, u)
            p = skia.Path()
            p.addCircle(cx, cy, r)
            with saved(c):
                c.clipPath(p, skia.ClipOp.kIntersect, True)
                self.shot_exec(c, t)
        elif t < T["disc"]:
            self.shot_exec(c, t)
        elif t < T["trans"]:
            self.shot_disc(c, t)
        elif t < T["fin"]:
            self.shot_trans(c, t)
        else:
            self.shot_final(c, t)

    # ------------------------------------------------------------------ chrome
    def background(self, c, S):
        c.drawColor(S["bg"])

    def grid(self, c, S, alpha):
        if alpha <= 0.01:
            return
        step = 120
        p = fill(with_alpha(S["grid"], alpha))
        ox = (self.W % step) / 2
        oy = (self.H % step) / 2
        pts = []
        y = oy
        while y <= self.H:
            x = ox
            while x <= self.W:
                pts.append(skia.Point(x, y))
                x += step
            y += step
        p.setStrokeWidth(4.0)
        p.setStrokeCap(skia.Paint.kRound_Cap)
        c.drawPoints(skia.Canvas.kPoints_PointMode, pts, p)

    def section(self, t):
        cur = SECTIONS[0]
        prev = None
        for s in SECTIONS:
            if t >= s[0]:
                prev, cur = cur, s
        return cur, prev

    def hud(self, c, t, S, alpha=1.0, text_alpha=1.0):
        a = alpha * ease("in_out_sine", t, 0.75, 1.35)
        if a <= 0.01:
            return
        W, H, m = self.W, self.H, self.hud_in
        land = not self.portrait
        corner = stroke(with_alpha(S["fg3"], a), 3.0)
        L = 40
        for (x, y, sx, sy) in ((m, m, 1, 1), (W - m, m, -1, 1), (m, H - m, 1, -1), (W - m, H - m, -1, -1)):
            c.drawPath(polyline([(x, y + sy * L), (x, y), (x + sx * L, y)]), corner)
        ta = a * text_alpha
        if ta <= 0.01:
            return
        fs = 30 if land else 28
        tx = m + 64
        base_top = m + 58
        base_bot = H - m - 38
        pf = fill(with_alpha(S["fg"], ta * 0.92))
        p2 = fill(with_alpha(S["fg2"], ta))
        brand = self.txt(MONO_M, "WENBOT", fs, 0.14)
        brand.draw(c, tx, base_top, pf)
        if land:
            self.txt(MONO, "SYSTEMATIC EXECUTION", fs, 0.14).draw(c, tx + brand.advance + 64, base_top, p2)
        # section index, rolls when it changes
        cur, prev = self.section(t)
        u = ease("out_quint", t, cur[0], cur[0] + 0.45) if prev and cur is not prev else 1.0
        def sec_text(s):
            return self.txt(MONO_M, f"{s[1]} — {s[2]}", fs, 0.14)
        with saved(c):
            c.clipRect(skia.Rect.MakeLTRB(W / 2, base_top - fs * 1.2, W - m, base_top + fs * 0.5), True)
            st = sec_text(cur)
            st.draw(c, W - m - 64 - st.advance, base_top + (1 - u) * fs * 1.6, pf)
            if prev and u < 1 and prev is not cur:
                sp = sec_text(prev)
                sp.draw(c, W - m - 64 - sp.advance, base_top - u * fs * 1.6, pf)
        # live UTC clock
        clock = utc(t)
        lab = self.txt(MONO, "UTC", fs, 0.14)
        lab.draw(c, tx, base_bot, p2)
        self.txt(MONO, clock, fs, 0.06).draw(c, tx + lab.advance + 28, base_bot, pf)
        # sequence squares
        idx = int(cur[1])
        sq = fs * 0.62
        gap = sq * 0.55
        label = self.txt(MONO_M, f"{idx:02d}/07", fs, 0.14)
        xr = W - m - 64 - label.advance
        label.draw(c, xr, base_bot, pf)
        x = xr - 40 - 7 * sq - 6 * gap
        for i in range(7):
            r = skia.Rect.MakeXYWH(x + i * (sq + gap), base_bot - sq, sq, sq)
            if i < idx:
                c.drawRect(r, fill(with_alpha(S["fg"], ta * (0.9 if i == idx - 1 else 0.55))))
            else:
                c.drawRect(r, stroke(with_alpha(S["fg3"], ta), 2.0))
        # film progress hairline
        pr = clamp01(t / T["hold"])
        y = H - m + 36
        c.drawLine(m, y, m + (W - 2 * m) * pr, y, stroke(with_alpha(S["fg3"], ta * 0.9), 2.0))

    # ------------------------------------------------------------------ 01 + 02 (dark)
    def wave(self, x, t):
        """Market line height offset at screen x."""
        s = (x + 1150.0 * (t - T["wave"])) / 620.0
        return fbm(s, seed=7, octaves=3) * 1.25 + 0.35 * math.sin(s * 1.7 + 0.6)

    def wave_amp(self, t):
        a = 72.0 * ease("in_out_sine", t, T["wave"], T["wave"] + 0.55)
        if t >= T["snap"]:
            a *= 1 - spring(t - T["snap"], zeta=1.0, omega=26.0)
        return a

    def mm_geom(self):
        """Baseline position of MARKETS MOVE. and the head/period point."""
        H = self.H
        if not self.portrait and not self.square:
            st = self.s_mm
            x = self.M - st.ink_left
            y = H / 2 + st.cap / 2
            return [(st, x, y)], st.dot_at(x, y)
        a, b = self.s_mm
        gap = a.size * 1.0
        y1 = H / 2 - gap / 2 + a.cap / 2
        y2 = y1 + gap
        x = self.M - a.ink_left
        return [(a, x, y1), (b, self.M - b.ink_left, y2)], b.dot_at(self.M - b.ink_left, y2)

    def line_y(self):
        rows, (px, py, pr) = self.mm_geom()
        return rows[-1][2]

    def shot_open(self, c, t):
        S = DARK
        W, H = self.W, self.H
        self.background(c, S)
        self.grid(c, S, 0.9 * ease("in_out_sine", t, 0.9, 1.8) * (1 - ease("in_out_sine", t, T["fold"], T["thick_end"])))
        self.hud(c, t, S)
        fg = S["fg"]
        rows, (px, py, pr) = self.mm_geom()
        ly = self.line_y()
        cx0, cy0 = W / 2, H / 2
        # ---- the dot
        dot_r0 = 11.0
        head_x, head_y, head_r = cx0, cy0, dot_r0 * EASE["out_expo"](prog(t, T["dot"], T["dot"] + 0.32))
        # market jitter while tickers update
        jit = 0.0
        for k, (ta, tb) in enumerate(TICK_UPD):
            for j, tu in enumerate((ta, tb)):
                d = [-1, 1, 1, -1, -1, 1][k * 2 + j]
                jit += d * 9.0 * (ease("out_cubic", t, tu, tu + 0.18) - ease("in_out_sine", t, tu + 0.25, tu + 0.7))
        head_y += jit
        # glide to become the period of MARKETS MOVE.
        g = ease("glide", t, T["mm"], T["mm"] + 0.56)
        head_x = lerp(head_x, px, g)
        head_y = lerp(head_y, py, g)
        head_r = lerp(head_r, pr, ease("in_out_cubic", t, T["mm"] + 0.08, T["mm"] + 0.56))
        # sonar ring when the dot is born
        if T["dot"] <= t < T["dot"] + 1.0:
            u = ease("out_cubic", t, T["dot"], T["dot"] + 1.0)
            c.drawCircle(cx0, cy0, lerp(dot_r0, 150, u), stroke(with_alpha(S["fg2"], (1 - u) * 0.55), 2.0))
        # ---- tickers
        self.draw_tickers(c, t, S, cx0, cy0 + jit * 0.0)
        # ---- MARKETS MOVE.
        pf = fill(fg)
        if T["mm"] <= t < T["mm_out"] + 0.6:
            for li, (st, x, y) in enumerate(rows):
                self.rise_statement(c, st, x, y, t, T["mm_text"] + li * 0.08, pf, out_t=T["mm_out"], stagger=0.016)
        # ---- 02: the line, the wave, emotion vs strategy
        if t >= T["line"]:
            amp = self.wave_amp(t)
            u_line = ease("out_quint", t, T["line"], T["line"] + 0.5)
            x_end = px
            x_start = lerp(px, -20, u_line)
            # after the snap the line runs edge to edge
            ext = ease("out_quint", t, T["strat"], T["strat"] + 0.6)
            x_end2 = lerp(px, W + 20, ext)
            fold_u = ease("in_out_cubic", t, T["fold"], T["fold_end"])
            if t < T["thick"]:
                if fold_u <= 0:
                    pts = []
                    x = x_start
                    step = 10.0
                    while x < x_end2:
                        pts.append((x, ly + (amp * self.wave(x, t) if x <= x_end + 1 else 0.0)))
                        x += step
                    pts.append((x_end2, ly + (amp * self.wave(x_end2, t) if x_end2 <= x_end + 1 else 0.0)))
                    c.drawPath(polyline(pts), stroke(with_alpha(fg, 0.92), 3.0, join="round"))
                else:
                    c.drawPath(self.fold_path(fold_u, ly), stroke(with_alpha(fg, 0.95), lerp(3.0, 5.0, fold_u), join="miter"))
            # head dot rides the wave
            head_x = px
            head_y = ly + amp * self.wave(px, t) - pr
            head_r = pr
        # EMOTION MOVES WITH THEM. rides the wave
        if T["emo"] <= t < T["snap"] + 0.6:
            amp = self.wave_amp(t)
            for li, st in enumerate(self.s_emo):
                x = self.M - st.ink_left
                y0 = ly - (len(self.s_emo) - 1 - li) * st.size * 1.02

                def fn(i, g, st=st, x=x, li=li):
                    b = st.t.glyph_ink(i)
                    gx = x + (b[0] + b[2]) / 2
                    k = 1.0 if li == len(self.s_emo) - 1 else 0.55
                    wy = amp * self.wave(gx, t) * k
                    slope = (self.wave(gx + 6, t) - self.wave(gx - 6, t)) * amp * k / 12.0
                    return {"dy": wy, "rot": math.degrees(math.atan(slope))}
                self.rise_statement(c, st, x, y0, t, T["emo"] + li * 0.08, fill(with_alpha(fg, 0.92)),
                                    out_t=T["snap"] + 0.02, stagger=0.006, extra=fn, out_dur=0.15,
                                    clip_pad=12 + 1.6 * amp)
        # STRATEGY SHOULDN'T. — still
        if T["strat"] <= t < T["strat_out"] + 0.5:
            last = len(self.s_strat) - 1
            # revealed in place by a precise wipe: the words themselves never move
            wipe = ease("in_out_cubic", t, T["strat"], T["strat"] + 0.46)
            for li, st in enumerate(self.s_strat):
                x = self.M - st.ink_left
                y0 = ly - (last - li) * st.size * 1.0
                xr = lerp(self.M - 10, self.M + (st.right - st.ink_left) + 10, wipe)
                with saved(c):
                    c.clipRect(skia.Rect.MakeLTRB(-10, -10, xr, self.H + 10), True)
                    self.rise_statement(c, st, x, y0, t, T["strat"] - 1.0, pf, out_t=T["strat_out"], stagger=0.012,
                                        dot=False)
            st = self.s_strat[-1]
            sx, sy, sr = st.dot_at(self.M - st.ink_left, ly)
            g = ease("glide", t, T["strat"] + 0.30, T["strat"] + 0.72)
            head_x = lerp(head_x, sx, g)
            head_y = lerp(head_y, sy, g)
            head_r = lerp(head_r, sr, g)
        if t >= T["strat_out"]:
            # the period sinks into the line
            u = ease("in_out_cubic", t, T["strat_out"] + 0.05, T["fold"])
            head_y = lerp(head_y, ly, u)
            head_r = lerp(head_r, 0, u)
        if head_r > 0.2 and t < T["fold"]:
            circle(c, head_x, head_y, head_r, fill(fg))

    def draw_tickers(self, c, t, S, cx, cy):
        if t < T["tick_in"][0] or t > T["tick_out"] + 0.5:
            return
        fs = 36
        rowh = 62
        x0 = cx + 64
        for k, (sym, vals) in enumerate(TICKERS):
            t_in = T["tick_in"][k]
            t_out = T["tick_out"] + k * 0.04
            yb = cy + (k - 1) * rowh + fs * 0.36
            u_in = ease("out_quint", t, t_in, t_in + 0.35)
            u_out = ease("in_cubic", t, t_out, t_out + 0.2)
            if u_in <= 0 or u_out >= 1:
                continue
            lab = self.txt(MONO, sym, fs, 0.08)
            w_all = lab.advance + 40 + 230
            with saved(c):
                # reveal left→right, collapse back into the dot
                c.clipRect(skia.Rect.MakeLTRB(x0 - 4, yb - fs * 1.1, x0 - 4 + (w_all + 12) * min(u_in, 1 - u_out), yb + fs * 0.45), True)
                lab.draw(c, x0, yb, fill(S["fg2"]))
                ta, tb = TICK_UPD[k]
                v0, v1, v2 = vals
                if t < ta:
                    old, new, u = v0, v0, 1.0
                elif t < tb:
                    old, new, u = v0, v1, ease("out_cubic", t, ta, ta + 0.16)
                else:
                    old, new, u = v1, v2, ease("out_cubic", t, tb, tb + 0.16)
                vx = x0 + lab.advance + 40
                self.flip_value(c, old, new, u, vx, yb, fs, S)

    def flip_value(self, c, old, new, u, x, y, fs, S):
        to = self.txt(MONO, old, fs, 0.02)
        tn = self.txt(MONO, new, fs, 0.02)
        pf = fill(S["fg"])
        changed = {i for i, (a, b) in enumerate(zip(old, new)) if a != b}
        h = fs * 1.05
        with saved(c):
            c.clipRect(skia.Rect.MakeLTRB(x - 4, y - fs * 0.95, x + tn.advance + 8, y + fs * 0.3), True)
            tn.draw(c, x, y, pf, lambda i, g: {} if i not in changed else {"dy": (1 - u) * h})
            if u < 1:
                to.draw(c, x, y, pf, lambda i, g: None if i not in changed else {"dy": -u * h})

    def rise_statement(self, c, st, x, y, t, t0, paint, out_t=None, stagger=0.015, dur=0.62, extra=None,
                       out_dur=0.3, clip_pad=None, dot=True, drop=None):
        n = st.n
        drop = drop if drop is not None else st.cap * 1.18
        pad = clip_pad if clip_pad is not None else st.size * 0.03

        def fn(i, g):
            u = EASE["out_quint"](prog(t, t0 + i * stagger, t0 + i * stagger + dur))
            if u <= 0:
                return None
            dy = (1 - u) * drop
            if out_t is not None and t >= out_t:
                v = EASE["in_cubic"](prog(t, out_t + (n - 1 - i) * stagger * 0.6, out_t + (n - 1 - i) * stagger * 0.6 + out_dur))
                if v >= 1:
                    return None
                dy += v * drop
            d = {"dy": dy}
            if extra:
                e = extra(i, g)
                d["dy"] += e.get("dy", 0.0)
                if "rot" in e:
                    d["rot"] = e["rot"]
            return d
        with saved(c):
            c.clipRect(skia.Rect.MakeLTRB(-10000, -10000, 20000, y + pad), True)
            st.draw(c, x, y, paint, fn)

    # ---- the fold: flat line → W zig-zag → W mask
    def giant(self):
        """Placement of the giant W used as transition mask."""
        W, H = self.W, self.H
        capH = min(H * 1.30, W * 1.02 / (logo.ex("E4R", 0) - logo.ex("E1L", 1)))
        ox = W / 2 - logo.AXIS * capH
        oy = H / 2 - capH / 2
        return capH, ox, oy

    def fold_path(self, u, ly):
        capH, ox, oy = self.giant()
        z = logo.zigzag_points()
        pts = []
        W = self.W
        left = (lerp(-20, ox + z[0][0] * capH, u), lerp(ly, oy + z[0][1] * capH, u))
        right = (lerp(W + 20, ox + z[-1][0] * capH, u), lerp(ly, oy + z[-1][1] * capH, u))
        pts.append(left)
        for (zx, zy) in z:
            X = ox + zx * capH
            Y = lerp(ly, oy + zy * capH, u)
            pts.append((X, Y))
        pts.append(right)
        return polyline(pts)

    def w_mask(self, t):
        """Giant W growing from the zig-zag, then swelling until it floods the frame."""
        capH, ox, oy = self.giant()
        m = skia.Matrix()
        m.setScaleTranslate(capH, capH, ox, oy)
        if t < T["flood"]:
            s = 0.012 + 0.988 * EASE["out_expo"](prog(t, T["thick"], T["thick_end"]))
            q = skia.Path(logo.w_strokes(s, pure=True))
            q.transform(m)
            return q
        q = skia.Path(logo.cached("w_pure", logo.w_pure_silhouette))
        q.transform(m)
        d = EASE["in_cubic"](prog(t, T["flood"], T["flood_end"])) * max(self.W, self.H) * 0.36
        if d < 0.5:
            return q
        p = skia.Paint(AntiAlias=True, Style=skia.Paint.kStrokeAndFill_Style, StrokeWidth=2 * d)
        p.setStrokeJoin(skia.Paint.kMiter_Join)
        p.setStrokeMiter(2.5)
        out = skia.Path()
        p.getFillPath(q, out)
        return out

    # ------------------------------------------------------------------ 03 architecture (light)
    def arch_geom(self):
        W, H, M = self.W, self.H, self.M
        cap, br, wb = self.s_cap, self.s_broker, self.s_wb
        land = not self.portrait and not self.square
        if land:
            pad = 130
            fx0 = M
            fx1 = M + (cap.right - cap.ink_left) + 2 * pad + 40
            fy0, fy1 = H / 2 - 360, H / 2 + 360
            cap_xy = (fx0 + pad - cap.ink_left, H / 2 + cap.cap / 2)
            broker_xy = (fx0 - br.ink_left, fy0 - 52)
            mk = (fx1, H / 2)
            wb_x = fx1 + 440
            lead = wb[0].size * 1.04
            y1 = H / 2 - lead / 2 + wb[0].cap / 2
            wb_xy = [(wb_x - wb[0].ink_left, y1), (wb_x - wb[1].ink_left, y1 + lead)]
            link = ((fx1, H / 2), (wb_x - 80, H / 2))
        else:
            pad = 110
            fx0, fx1 = M, W - M
            lead = wb[0].size * 1.04
            fh = cap.cap + 2 * pad + 60
            link_h = H * (0.13 if self.portrait else 0.10)
            total = (br.cap + 44) + fh + link_h + 40 + wb[0].cap + lead
            fy0 = (H - total) / 2 + br.cap + 44
            fy1 = fy0 + fh
            cap_xy = (fx0 + pad - cap.ink_left, (fy0 + fy1) / 2 + cap.cap / 2)
            broker_xy = (fx0 - br.ink_left, fy0 - 44)
            mk = ((fx0 + fx1) / 2, fy1)
            wy = fy1 + link_h + 40
            wb_xy = [((W - (wb[0].right - wb[0].ink_left)) / 2 - wb[0].ink_left, wy + wb[0].cap),
                     ((W - (wb[1].right - wb[1].ink_left)) / 2 - wb[1].ink_left, wy + wb[0].cap + lead)]
            link = ((fx0 + fx1) / 2, fy1), ((fx0 + fx1) / 2, wy - 40)
        return dict(frame=(fx0, fy0, fx1, fy1), cap=cap_xy, broker=broker_xy, mk=mk, wb=wb_xy, link=link)

    def arch_marker(self):
        g = self.arch_geom()
        return g["mk"][0], g["mk"][1], 16.0

    def shot_arch(self, c, t):
        S = LIGHT
        self.background(c, S)
        self.grid(c, S, 0.8)
        self.hud(c, t, S)
        g = self.arch_geom()
        fg = S["fg"]
        pf = fill(fg)
        if t < T["cap"] - 0.05:
            return
        cx, cy = g["cap"]
        self.rise_statement(c, self.s_cap, cx, cy, t, T["cap"], pf)
        self.statement_dot(c, self.s_cap, cx, cy, t, T["cap"] + 0.28, pf)
        # broker frame, drawn clockwise from the legend corner
        fx0, fy0, fx1, fy1 = g["frame"]
        u = ease("in_out_cubic", t, T["frame"], T["frame"] + 0.62)
        if u > 0:
            rect = skia.Path()
            rect.moveTo(fx0, fy0)
            rect.lineTo(fx1, fy0)
            rect.lineTo(fx1, fy1)
            rect.lineTo(fx0, fy1)
            rect.close()
            c.drawPath(rect, trimmed(stroke(fg, 4.0, join="miter"), 0.0, u))
        bx, by = g["broker"]
        self.rise_statement(c, self.s_broker, bx, by, t, T["broker"], pf)
        self.statement_dot(c, self.s_broker, bx, by, t, T["broker"] + 0.25, pf)
        # link + execution marker on the frame edge
        (lx0, ly0), (lx1, ly1) = g["link"]
        ul = ease("out_quint", t, T["link"], T["link"] + 0.4)
        if ul > 0:
            c.drawLine(lx0, ly0, lerp(lx0, lx1, ul), lerp(ly0, ly1, ul), stroke(fg, 4.0))
        mx, my = g["mk"]
        self.marker(c, mx, my, t, T["link"] + 0.02, S)
        for li, (st, (wx, wy)) in enumerate(zip(self.s_wb, g["wb"])):
            self.rise_statement(c, st, wx, wy, t, T["wb"] + li * 0.07, pf)
        st = self.s_wb[1]
        self.statement_dot(c, st, g["wb"][1][0], g["wb"][1][1], t, T["wb"] + 0.36, pf)
        # an order travels WENBOT → account, a fill report comes back
        for k, tp in enumerate(T["pulse"]):
            if tp <= t < tp + 0.42:
                u = ease("in_out_cubic", t, tp, tp + 0.36)
                if k % 2:
                    u = 1 - u
                px = lerp(lx1, lx0, u)
                py = lerp(ly1, ly0, u)
                a = 1 - ease("linear", t, tp + 0.33, tp + 0.42)
                circle(c, px, py, 9.0, fill(with_alpha(fg, a)))

    def marker(self, c, x, y, t, t0, S, ring_r=40.0, dot_r=16.0):
        """The ring + dot of the B: WENBOT's execution mark."""
        u = EASE["out_expo"](prog(t, t0, t0 + 0.45))
        if u <= 0:
            return
        pulse = 0.0
        for tp in T["pulse"][::2]:
            pulse += math.exp(-max(0.0, t - (tp + 0.36)) * 9.0) * (1.0 if t >= tp + 0.36 else 0.0)
        c.drawCircle(x, y, ring_r * u + 26 + pulse * 10, fill(S["bg"]))
        c.drawCircle(x, y, (ring_r + pulse * 8) * u, stroke(S["fg"], 4.0))
        circle(c, x, y, dot_r * EASE["out_expo"](prog(t, t0 + 0.08, t0 + 0.4)), fill(S["fg"]))

    def statement_dot(self, c, st, x, y, t, t0, paint, scale=1.0):
        if not st.dot:
            return
        dx, dy, r = st.dot_at(x, y)
        u = EASE["out_expo"](prog(t, t0, t0 + 0.4))
        circle(c, dx, dy, r * u * scale, paint)

    # ------------------------------------------------------------------ 04 execution (dark)
    def exec_geom(self):
        W, H, M = self.W, self.H, self.M
        land = not self.portrait
        fs = 54 if land else 50
        gap = 210 if land else 230
        ys = [H / 2 + (k - 1) * gap for k in range(3)]
        if land:
            tx0, tx1 = M + 560, W - M - 700
            sx = W - M - 600
        else:
            tx0, tx1 = M + 330, W - M - 40
            sx = M + 330
        return dict(fs=fs, ys=ys, tx0=tx0, tx1=tx1, sx=sx)

    EXEC_ROWS = [("EUR/USD", 0.63, "EXECUTED"), ("XAU/USD", 0.47, "EXECUTED"), ("BTC/USD", 0.28, "MONITORING")]

    def shot_exec(self, c, t):
        S = DARK
        W, H, M = self.W, self.H, self.M
        self.background(c, S)
        self.grid(c, S, 0.9)
        self.hud(c, t, S)
        g = self.exec_geom()
        fs, ys, tx0, tx1 = g["fs"], g["ys"], g["tx0"], g["tx1"]
        fg = S["fg"]
        land = not self.portrait
        conv = ease("in_out_cubic", t, T["sys"], T["sys"] + 0.34)     # rows converge into one line
        fade = 1 - ease("out_cubic", t, T["sys"], T["sys"] + 0.2)
        st = self.s_words[0]
        sys_x = M - st.ink_left
        sys_y = H / 2 + st.cap / 2
        for k, (sym, stop, status) in enumerate(self.EXEC_ROWS):
            y = lerp(ys[k], sys_y, conv)
            t_in = T["rows"] + k * 0.07
            # label
            if fade > 0:
                lab = self.txt(MONO_M, sym, fs, 0.08)
                u = ease("out_quint", t, t_in, t_in + 0.4)
                with saved(c):
                    c.clipRect(skia.Rect.MakeLTRB(M - 4, y - fs, M + lab.advance * u + 6, y + fs), True)
                    lab.draw(c, M, y + fs * 0.36, fill(with_alpha(fg, fade)))
            # track
            ut = ease("out_quint", t, t_in + 0.06, t_in + 0.6)
            x0 = lerp(tx0, -20, conv)
            x1 = lerp(tx1, W + 20, conv)
            recede = ease("in_out_cubic", t, T["sys_type"] + 0.55, T["sys_type"] + 0.95)
            if ut > 0 and recede < 1:
                xe = lerp(x0, x1, ut)
                x0r = lerp(x0, x1, recede)
                c.drawLine(x0r, y, xe, y, stroke(with_alpha(mix(S["hair"], fg, conv), 1.0), lerp(2.5, 3.0, conv)))
                if fade > 0:
                    tk = stroke(with_alpha(S["fg3"], fade), 2.0)
                    n = 24
                    for i in range(n + 1):
                        tx = lerp(tx0, tx1, i / n)
                        if tx > xe:
                            break
                        h = 16 if i % 6 == 0 else 8
                        c.drawLine(tx, y - h, tx, y, tk)
            if fade <= 0:
                continue
            # marker travelling along the track
            t_run = T["run"] + k * 0.05
            if k < 2:
                te = T["exec"][k]
                um = EASE["in_out_cubic"](prog(t, t_run, te))
                pos = lerp(tx0, lerp(tx0, tx1, stop), um)
            else:
                te = None
                um = EASE["in_out_sine"](prog(t, t_run, T["sys"] + 0.4))
                pos = lerp(tx0, lerp(tx0, tx1, stop), um)
            if t >= t_run - 0.1:
                a = fade * ease("out_cubic", t, t_run - 0.1, t_run + 0.1)
                # progress fill
                c.drawLine(tx0, y, pos, y, stroke(with_alpha(fg, 0.85 * a), 3.0))
                if te is not None and t >= te:
                    ue = EASE["out_expo"](prog(t, te, te + 0.4))
                    c.drawLine(pos, y - 44 * ue, pos, y + 44 * ue, stroke(with_alpha(fg, a), 2.5))
                    c.drawCircle(pos, y, 34 * ue + 10, fill(S["bg"]))
                    c.drawCircle(pos, y, 34 * ue, stroke(with_alpha(fg, a), 3.5))
                    circle(c, pos, y, 13, fill(with_alpha(fg, a)))
                elif te is not None:
                    circle(c, pos, y, 11, fill(with_alpha(fg, a)))
                else:
                    breathe = 0.5 + 0.5 * math.sin((t - t_run) * 2 * math.pi * 1.1)
                    c.drawCircle(pos, y, 14, fill(S["bg"]))
                    c.drawCircle(pos, y, 12 + 4 * breathe, stroke(with_alpha(fg, a * 0.85), 3.0))
            # status
            sx = g["sx"]
            yb = y + fs * 0.36 if land else y + fs * 1.9
            if te is not None and t >= te + 0.02:
                n_chars = int(clamp01((t - te - 0.02) / 0.3) * len(status) + 0.999)
                s = status[:n_chars]
                self.txt(MONO_M, s, fs, 0.08).draw(c, sx, yb, fill(with_alpha(fg, fade)))
                if t >= te + 0.3:
                    a = fade * ease("out_cubic", t, te + 0.3, te + 0.6)
                    self.txt(MONO, utc(te), fs * 0.6, 0.06).draw(c, sx, yb + fs * 1.1, fill(with_alpha(S["fg2"], a)))
            elif te is None and t >= t_run + 0.15:
                a = fade * ease("out_cubic", t, t_run + 0.15, t_run + 0.5)
                blink = 1.0 if int((t - t_run) * 3.2) % 2 == 0 else 0.25
                circle(c, sx + 8, y + (0 if land else fs * 1.5), 7, fill(with_alpha(S["fg2"], a * blink)))
                self.txt(MONO, status, fs, 0.08).draw(c, sx + 36, yb, fill(with_alpha(S["fg2"], a)))
            elif te is not None and t >= t_run:
                a = fade * ease("out_cubic", t, t_run, t_run + 0.3)
                self.txt(MONO, "—", fs, 0.08).draw(c, sx, yb, fill(with_alpha(S["fg3"], a)))
        # 05 — SYSTEMATIC. typed letter by letter on the merged line
        if t >= T["sys_type"] - 0.02:
            n = st.n
            step = 0.046
            shown = set(i for i in range(n) if t >= T["sys_type"] + i * step and i not in st.skip)
            st.t.draw(c, sys_x, sys_y, fill(fg), lambda i, gg: {} if i in shown else None)
            if st.dot:
                td = T["sys_type"] + (n - 1) * step
                dx, dy, r = st.dot_at(sys_x, sys_y)
                circle(c, dx, dy, r * EASE["out_expo"](prog(t, td, td + 0.3)), fill(fg))

    # ------------------------------------------------------------------ 05 principles
    def shot_disc(self, c, t):
        S = LIGHT
        H, M = self.H, self.M
        self.background(c, S)
        self.grid(c, S, 0.8)
        self.hud(c, t, S)
        st = self.s_words[1]
        u = EASE["out_expo"](prog(t, T["disc"], T["disc"] + 0.62))
        spread = (1 - u) * 0.55 * st.size
        n = st.n
        mid = (n - 1) / 2
        x = M - st.ink_left
        y = H / 2 + st.cap / 2
        pf = fill(S["fg"])
        st.draw(c, x, y, pf, lambda i, g: {"dx": (i - mid) * spread})
        if st.dot:
            dx, dy, r = st.dot_at(x, y)
            circle(c, dx + (n - 1 - mid) * spread, dy, r, pf)

    def shot_trans(self, c, t):
        S = DARK
        H, M = self.H, self.M
        self.background(c, S)
        self.grid(c, S, 0.9)
        self.hud(c, t, S)
        fg = S["fg"]
        st = self.s_words[2]
        x = M - st.ink_left
        y = H / 2 + st.cap / 2
        # outline draws on, then the word leaves; the dot stays and becomes the next period
        out = ease("in_out_cubic", t, T["cust"] - 0.06, T["cust"] + 0.26)
        if out < 1:
            u = ease("in_out_cubic", t, T["trans"] + 0.02, T["trans"] + 0.62)
            for i, g in enumerate(st.t.glyphs):
                if i in st.skip or g.ink is None:
                    continue
                m = skia.Matrix()
                m.setScaleTranslate(st.t.k, st.t.k, x + g.x, y + g.y)
                q = skia.Path(g.path)
                q.transform(m)
                c.drawPath(q, trimmed(stroke(fg, 3.5, join="round"), out, u))
        # the period
        dx, dy, r = st.dot_at(x, y)
        cust = self.cust_geom()
        (c2, cx2, cy2) = cust["rows"][-1]
        tx, ty, tr = c2.dot_at(cx2, cy2)
        gl = ease("glide", t, T["cust"] + 0.1, T["cust"] + 0.7)
        u0 = EASE["out_expo"](prog(t, T["trans"] + 0.5, T["trans"] + 0.8))
        px, py, pr = lerp(dx, tx, gl), lerp(dy, ty, gl), lerp(r * u0, tr, gl)
        if t >= T["cust"]:
            self.custody(c, t, S)
        circle(c, px, py, pr, fill(fg))
        # ring of ownership around the period
        ur = ease("in_out_cubic", t, T["cust"] + 0.72, T["cust"] + 1.12)
        if ur > 0 and t < T["fin"] + 0.4:
            ring = skia.Path()
            ring.addCircle(tx, ty, tr * 2.35)
            fo = 1 - ease("in_out_cubic", t, T["fin"], T["fin"] + 0.3)
            c.drawPath(ring, trimmed(stroke(with_alpha(fg, fo), 3.5), 0.0, ur))

    def cust_geom(self):
        H, M = self.H, self.M
        a, b = self.s_cust
        lead = a.size * 1.0
        y1 = H / 2 - lead / 2 + a.cap / 2 - 40
        rows = [(a, M - a.ink_left, y1), (b, M - b.ink_left, y1 + lead)]
        wy = y1 + lead + 170
        return dict(rows=rows, wy=wy)

    def custody(self, c, t, S):
        g = self.cust_geom()
        pf = fill(S["fg"])
        out = T["fin"]
        for li, (st, x, y) in enumerate(g["rows"]):
            self.rise_statement(c, st, x, y, t, T["cust"] + 0.24 + li * 0.08, pf, out_t=out, stagger=0.014)
        a = ease("out_cubic", t, T["cust"] + 0.95, T["cust"] + 1.35) * (1 - ease("in_cubic", t, out, out + 0.25))
        if a > 0:
            w = self.s_withdraw
            dy = (1 - ease("out_quint", t, T["cust"] + 0.95, T["cust"] + 1.45)) * 30
            w.draw(c, self.M - w.ink_left, g["wy"] + dy, fill(with_alpha(S["fg2"], a)))

    # ------------------------------------------------------------------ 07 final
    def final_geom(self):
        W, H = self.W, self.H
        land = not self.portrait and not self.square
        capH = 420 if land else 360
        sw = logo.WIDTH * capH
        ox = W / 2 - sw / 2
        oy = H / 2 - capH * (0.86 if land else 0.95)
        wm = Text(BRAND, "WENBOT", 132 if land else 116, 0.055)
        cats = Text(BRAND_M, "FOREX · COMMODITIES · ENERGY · CRYPTOS", 36 if land else 30, 0.42)
        tag = Statement(SEMI, "BUILT TO EXECUTE.", 86 if land else 76, -0.01)
        legal = Text(REG, "Trading involves risk. Capital at risk.", 32 if land else 30, 0.01)
        wy = oy + capH + 118 + wm.cap
        cy = wy + 104
        ty = cy + (240 if land else 260)
        return dict(capH=capH, ox=ox, oy=oy, wm=wm, cats=cats, tag=tag, legal=legal, wy=wy, cy=cy, ty=ty)

    def shot_final(self, c, t):
        S = DARK
        W, H = self.W, self.H
        self.background(c, S)
        g = self.final_geom()
        hud_a = 1 - ease("in_out_sine", t, T["lock"], T["lock"] + 0.5)
        self.hud(c, t, S, alpha=1.0, text_alpha=hud_a)
        fg = S["fg"]
        pf = fill(fg)
        capH, ox, oy = g["capH"], g["ox"], g["oy"]
        # the custody statement leaves
        if t < T["fin"] + 0.6:
            self.custody(c, t, S)
        # ◉: the period with its ring glides into the B
        cust = self.cust_geom()
        c2, cx2, cy2 = cust["rows"][-1]
        tx, ty, tr = c2.dot_at(cx2, cy2)
        rc = logo.G["ring_c"]
        lx, ly = ox + rc[0] * capH, oy + rc[1] * capH
        lr = logo.G["bdot_r"] * capH
        gl = ease("glide", t, T["fin"] + 0.05, T["fin"] + 0.75)
        mx, my, mr = lerp(tx, lx, gl), lerp(ty, ly, gl), lerp(tr, lr, gl)
        ring_r = lerp(tr * 2.35, logo.G["ring_r"] * capH, gl)
        # symbol construction
        mtx = skia.Matrix()
        mtx.setScaleTranslate(capH, capH, ox, oy)

        def P(path):
            q = skia.Path(path)
            q.transform(mtx)
            return q
        breathe = 1.0 + 0.012 * ease("in_out_sine", t, T["lock"], T["fade"])
        with saved(c):
            c.translate(W / 2, H / 2)
            c.scale(breathe, breathe)
            c.translate(-W / 2, -H / 2)
            # tittle
            ut = EASE["out_expo"](prog(t, T["tittle"], T["tittle"] + 0.35))
            if ut > 0:
                c.drawPath(P(logo.top_dot(ut)), pf)
            # zig-zag line
            uz = ease("in_out_cubic", t, T["zig"], T["zig"] + 0.36)
            s_grow = [EASE["out_expo"](prog(t, T["grow"] + i * 0.035, T["grow"] + i * 0.035 + 0.55)) for i in range(4)]
            if uz > 0 and s_grow[3] < 1:
                z = logo.zigzag_points()
                zp = polyline([(ox + a * capH, oy + b * capH) for a, b in z])
                with saved(c):
                    c.clipRect(skia.Rect.MakeLTRB(0, oy, W, oy + capH), True)
                    c.drawPath(zp, trimmed(stroke(fg, 4.0, join="miter"), 0.0, uz))
            wpart = skia.Path()
            if max(s_grow) > 0:
                wpart = logo.w_strokes(s_each=[max(0.0, v) for v in s_grow])
            # B: stem rises, bowls sweep in
            us = EASE["out_quint"](prog(t, T["stem"], T["stem"] + 0.5))
            ub = EASE["in_out_cubic"](prog(t, T["bowls"], T["bowls"] + 0.46))
            if us > 0 or ub > 0:
                body = logo.cached("b_body", logo.b_body)
                G = logo.G
                stem_clip = skia.Path.Rect(skia.Rect.MakeLTRB(G["stemL"] - 0.01, 1 - us, G["stemR"] + 0.001, 1.0))
                parts = logo.inter(body, stem_clip) if us > 0 else skia.Path()
                if ub > 0:
                    sweep_u = logo.pie(G["stemR"], 0.235, 0.9, -90, -90 + 180 * min(1.0, ub * 1.6))
                    sweep_l = logo.pie(G["stemR"], 0.73, 0.9, -90, -90 + 180 * clamp01(ub * 1.6 - 0.45))
                    waist = G["lbC"][0][1]
                    top_half = skia.Path.Rect(skia.Rect.MakeLTRB(G["stemR"], -0.1, 2.2, waist))
                    bot_half = skia.Path.Rect(skia.Rect.MakeLTRB(G["stemR"], waist, 2.2, 1.2))
                    bowls = logo.union(logo.inter(sweep_u, top_half), logo.inter(sweep_l, bot_half))
                    parts = logo.union(parts, logo.inter(body, bowls))
                wpart = logo.union(wpart, parts) if not wpart.isEmpty() else parts
            if t >= T["lock"]:
                wpart = logo.cached("body", lambda: logo.diff(logo.union(logo.w_silhouette(), logo.b_body()), logo.ring_hole()))
            if not wpart.isEmpty():
                c.drawPath(P(wpart), pf)
            # ◉ → ring hole + dot of the B
            ring_a = 1 - ease("in_out_cubic", t, T["bowls"] + 0.2, T["lock"])
            if ring_a > 0 and t >= T["fin"]:
                c.drawCircle(mx, my, ring_r, stroke(with_alpha(fg, ring_a), 3.5))
            circle(c, mx, my, mr, pf)
            # wordmark
            wm = g["wm"]
            uw = EASE["out_expo"](prog(t, T["word"], T["word"] + 0.8))
            if uw > 0:
                n = len(wm.glyphs)
                mid = (n - 1) / 2
                spread = (1 - uw) * 0.35 * wm.size
                wx = W / 2 - (wm.ink_left + wm.ink_right) / 2
                wm.draw(c, wx, g["wy"], fill(with_alpha(fg, clamp01(uw * 1.6))),
                        lambda i, gg: {"dx": (i - mid) * spread})
            cats = g["cats"]
            ua = ease("out_cubic", t, T["cats"], T["cats"] + 0.5)
            if ua > 0:
                cats.draw(c, W / 2 - (cats.ink_left + cats.ink_right) / 2, g["cy"], fill(with_alpha(S["fg2"], ua)))
            tag = g["tag"]
            tgx = W / 2 - (tag.ink_left + tag.right) / 2
            if t >= T["tag"]:
                self.rise_statement(c, tag, tgx, g["ty"], t, T["tag"], pf, stagger=0.012, dur=0.55)
                self.statement_dot(c, tag, tgx, g["ty"], t, T["tag"] + 0.3, pf)
        legal = g["legal"]
        ul = ease("out_cubic", t, T["legal"], T["legal"] + 0.6)
        if ul > 0:
            legal.draw(c, W / 2 - (legal.ink_left + legal.ink_right) / 2, H - self.hud_in - 38, fill(with_alpha(S["fg2"], ul * 0.9)))
        # fade to black
        f = ease("in_out_sine", t, T["fade"], T["fade"] + 0.34)
        if f > 0:
            c.drawColor(with_alpha(S["bg"], f))
