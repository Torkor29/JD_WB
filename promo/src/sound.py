"""WENBOT — sound design, synthesised from scratch and locked to film.T.

Palette: sub bass, dry digital ticks, muted impacts, short low whooshes,
a sonified market line, silence. No samples, no music loops.

  python sound.py --out ../out/wenbot_sound.wav
"""
import argparse
import math
import os
import sys

import numpy as np
from scipy import signal
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film  # noqa: E402

T = film.T
SR = 48000
RNG = np.random.default_rng(7)


def db(x):
    return 10 ** (x / 20.0)


def tt(dur):
    return np.arange(int(round(dur * SR))) / SR


# ----------------------------------------------------------------- generators
def pink(n):
    w = RNG.standard_normal(n)
    spec = np.fft.rfft(w)
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = f[1]
    spec /= np.sqrt(f)
    x = np.fft.irfft(spec, n)
    return x / (np.abs(x).max() + 1e-9)


def env_ad(n, a, d, curve=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)
    return e ** curve


def norm(x):
    return x / (np.abs(x).max() + 1e-12)


def tick(freq=3200.0, decay=0.004, dur=0.03, bright=0.35):
    t = tt(dur)
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / decay)
    s += bright * np.sin(2 * np.pi * freq * 2.01 * t) * np.exp(-t / (decay * 0.45))
    click = np.zeros_like(t)
    k = int(0.0007 * SR)
    click[:k] = RNG.standard_normal(k) * np.hanning(2 * k)[k:]
    b, a = signal.butter(2, 3000 / (SR / 2), "high")
    s += 0.5 * signal.lfilter(b, a, click)
    s *= np.minimum(1, t / 0.0004)
    return norm(s)


def blip(freq=1318.5, dur=0.9):
    """The dot: a pure, short ping (reused for the logo's dot)."""
    t = tt(dur)
    f = freq * (1 + 0.012 * np.exp(-t / 0.01))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * env_ad(len(t), 0.0015, 0.16)
    s += 0.22 * np.sin(2 * ph) * env_ad(len(t), 0.001, 0.05)
    s += 0.35 * np.sin(2 * np.pi * 164.8 * t) * env_ad(len(t), 0.002, 0.035)
    return norm(s)


def thump(f0=70.0, f1=42.0, decay=0.35, dur=None, drive=1.6, sweep=0.045):
    dur = dur or decay * 6
    t = tt(dur)
    f = f1 + (f0 * 1.9 - f1) * np.exp(-t / sweep)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * env_ad(len(t), 0.003, decay)
    s = np.tanh(drive * s) / np.tanh(drive)
    # a hint of octave so small speakers still feel it
    s += 0.18 * np.sin(2 * ph) * env_ad(len(t), 0.002, decay * 0.4)
    return norm(s)


def transient(dur=0.03, lp=1800.0, hp=120.0):
    n = int(dur * SR)
    x = RNG.standard_normal(n) * np.exp(-np.arange(n) / SR / (dur / 5))
    b, a = signal.butter(2, [hp / (SR / 2), lp / (SR / 2)], "band")
    return norm(signal.lfilter(b, a, x))


def impact(level=1.0, f0=66.0, f1=41.0, decay=0.42, tr=0.35, tr_lp=1600.0):
    th = thump(f0, f1, decay)
    trn = transient(0.035, tr_lp)
    out = th.copy()
    out[:len(trn)] += tr * trn
    return norm(out) * level


def swept_band(x, f_from, f_to, q=1.1, curve="log", block=64):
    """Band-pass noise with a moving centre frequency (block-wise RBJ biquad)."""
    n = len(x)
    y = np.zeros(n)
    zi = np.zeros(2)
    nb = (n + block - 1) // block
    for i in range(nb):
        u = i / max(1, nb - 1)
        if callable(f_from):
            fc = f_from(u)
        else:
            fc = f_from * (f_to / f_from) ** u if curve == "log" else f_from + (f_to - f_from) * u
        fc = min(max(fc, 20.0), SR * 0.45)
        w0 = 2 * np.pi * fc / SR
        alpha = np.sin(w0) / (2 * q)
        b = np.array([alpha, 0.0, -alpha])
        a = np.array([1 + alpha, -2 * np.cos(w0), 1 - alpha])
        b /= a[0]
        a /= a[0]
        seg = x[i * block:(i + 1) * block]
        y[i * block:i * block + len(seg)], zi = signal.lfilter(b, a, seg, zi=zi)
    return y


def whoosh(dur, f0=110.0, f1=520.0, peak=0.82, q=0.9, sub=0.5, rise=2.4):
    """Short, low whoosh: swept band noise + a sub swell underneath."""
    n = int(dur * SR)
    x = pink(n)
    y = swept_band(x, f0, f1, q)
    u = np.arange(n) / n
    e = np.where(u < peak, (u / peak) ** rise, np.exp(-(u - peak) / 0.05))
    y = norm(y) * e
    if sub:
        f = 38 + 20 * u
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * e ** 1.5
        y = y + sub * s
    return norm(y)


def air(dur, f0=2500.0, f1=7000.0, rise=1.5, peak=0.7):
    n = int(dur * SR)
    y = swept_band(pink(n) * 0.5 + RNG.standard_normal(n) * 0.5, f0, f1, 0.8)
    u = np.arange(n) / n
    e = np.where(u < peak, (u / peak) ** rise, np.exp(-(u - peak) / 0.12))
    return norm(y * e)


def pad(dur, freqs, gains, attack=0.8, release=1.2, lp=900.0, detune=0.0025, am=0.07):
    t = tt(dur)
    s = np.zeros_like(t)
    for f, g in zip(freqs, gains):
        for d in (-detune, detune):
            s += g * np.sin(2 * np.pi * f * (1 + d) * t + RNG.uniform(0, 6.28))
    s *= 1 + am * np.sin(2 * np.pi * 0.23 * t)
    e = np.minimum(1, t / attack) * np.minimum(1, (dur - t) / release)
    b, a = signal.butter(2, lp / (SR / 2))
    return norm(signal.lfilter(b, a, s * np.clip(e, 0, 1)))


def glass(dur=1.4, base=1760.0):
    """Clear, airy partials for TRANSPARENT."""
    t = tt(dur)
    s = np.zeros_like(t)
    for k, (m, g, d) in enumerate([(1.0, 1.0, 0.55), (1.5, 0.5, 0.4), (2.0, 0.35, 0.3), (3.01, 0.18, 0.2)]):
        s += g * np.sin(2 * np.pi * base * m * t + k) * env_ad(len(t), 0.06, d)
    return norm(s)


# ----------------------------------------------------------------- mix bus
class Bus:
    def __init__(self, dur):
        self.n = int(dur * SR)
        self.dry = np.zeros((self.n, 2))
        self.send = np.zeros((self.n, 2))

    def add(self, sig, t0, gain_db=0.0, pan=0.0, rev=0.15, width=0.0):
        i0 = int(round(t0 * SR))
        if i0 >= self.n:
            return
        if i0 < 0:
            sig = sig[-i0:]
            i0 = 0
        sig = sig[: self.n - i0]
        g = db(gain_db)
        if sig.ndim == 1:
            pl = math.cos((pan + 1) * math.pi / 4)
            pr = math.sin((pan + 1) * math.pi / 4)
            st = np.stack([sig * pl, sig * pr], 1) * g * math.sqrt(2)
            if width:
                # decorrelate a little with a tiny delay on one side
                d = int(0.009 * SR)
                st[d:, 1] = (1 - width) * st[d:, 1] + width * st[:-d, 0] if len(st) > d else st[d:, 1]
        else:
            st = sig * g
        self.dry[i0:i0 + len(st)] += st
        self.send[i0:i0 + len(st)] += st * rev

    def add_panned(self, sig, t0, gain_db, pan_curve, rev=0.15):
        """pan_curve: array in [-1, 1] same length as sig."""
        i0 = int(round(t0 * SR))
        sig = sig[: self.n - i0]
        pan_curve = pan_curve[: len(sig)]
        g = db(gain_db) * math.sqrt(2)
        st = np.stack([sig * np.cos((pan_curve + 1) * np.pi / 4), sig * np.sin((pan_curve + 1) * np.pi / 4)], 1) * g
        self.dry[i0:i0 + len(st)] += st
        self.send[i0:i0 + len(st)] += st * rev


def reverb_ir(rt=2.3, pre=0.018):
    n = int((rt + pre) * SR)
    out = np.zeros((n, 2))
    t = np.arange(n) / SR
    for ch in range(2):
        x = RNG.standard_normal(n)
        acc = np.zeros(n)
        for lo, hi, tau in ((20, 400, rt / 5.2), (400, 3500, rt / 6.6), (3500, 16000, rt / 11.0)):
            b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], "band")
            acc += signal.lfilter(b, a, x) * np.exp(-t / tau)
        acc[: int(pre * SR)] = 0
        # soft onset avoids a click at the reverb start
        k = int(0.012 * SR)
        acc[int(pre * SR):int(pre * SR) + k] *= np.linspace(0, 1, k)
        out[:, ch] = acc
    return out / np.sqrt((out ** 2).sum() / 2)


def limiter(x, ceiling_db=-1.2, look=0.004, release=0.09):
    ceil = db(ceiling_db)
    peak = np.abs(x).max(1)
    k = int(look * SR)
    # running max over the look-ahead window
    from scipy.ndimage import maximum_filter1d
    pk = maximum_filter1d(peak, size=2 * k + 1)
    gain = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    # smooth release
    a = math.exp(-1.0 / (release * SR))
    g = np.empty_like(gain)
    cur = 1.0
    for i in range(len(gain)):
        cur = gain[i] if gain[i] < cur else a * cur + (1 - a) * gain[i]
        g[i] = cur
    return x * g[:, None]


# ----------------------------------------------------------------- score
def zig_vertex_times():
    """When the construction zig-zag reaches each vertex (for pitched ticks)."""
    import logo
    z = logo.zigzag_points()
    L = [math.dist(a, b) for a, b in zip(z[:-1], z[1:])]
    cum = np.cumsum(L) / sum(L)
    out = []
    for c in cum:
        # invert the in_out_cubic trim used by the film
        us = np.linspace(0, 1, 4001)
        vals = np.array([film.EASE["in_out_cubic"](u) for u in us])
        u = us[np.searchsorted(vals, c)]
        out.append(T["zig"] + 0.36 * u)
    return out, [p[1] for p in z[1:]]


def build(out_path):
    dur = film.DURATION + 0.4
    bus = Bus(dur)
    F = film.Film()

    # 00 — room tone, almost nothing
    n = bus.n
    roomt = pink(n) * db(-66)
    b, a = signal.butter(2, [900 / (SR / 2), 7000 / (SR / 2)], "band")
    room = signal.lfilter(b, a, roomt)
    bus.add(np.stack([room, np.roll(room, 311)], 1), 0.0, 0.0, rev=0.0)

    # 01 — the dot is born
    bus.add(blip(), T["dot"], -17, pan=0.0, rev=0.55)
    # drone bed (E) for the markets section
    dr = pad(3.6, [41.2, 82.4, 123.5, 164.8], [1.0, 0.55, 0.22, 0.08], attack=1.6, release=0.9, lp=420)
    bus.add(dr, 0.55, -27, rev=0.1)
    # tickers: in, updates, out
    for k, ti in enumerate(T["tick_in"]):
        bus.add(tick(2900 - k * 260, 0.005), ti, -25, pan=0.18, rev=0.25)
    for k, (ta, tb) in enumerate(film.TICK_UPD):
        for j, tu in enumerate((ta, tb)):
            bus.add(tick(4200 + 180 * ((k + j) % 3), 0.0022, 0.02, 0.2), tu, -31, pan=0.2 + 0.05 * k, rev=0.2)
    for k in range(3):
        bus.add(tick(2300 - k * 150, 0.003, 0.02, 0.1), T["tick_out"] + k * 0.04 + 0.1, -33, pan=0.12, rev=0.2)
    # the dot glides → the statement lands
    w = whoosh(0.5, 90, 420, peak=0.9, sub=0.35)
    bus.add(w, T["mm_text"] - 0.45, -21, pan=0.25, rev=0.2)
    bus.add(impact(1.0, 68, 42, 0.42), T["mm_text"] + 0.03, -12, rev=0.18)
    bus.add(air(0.5, 1800, 5200, peak=0.3), T["mm_text"], -34, rev=0.2)

    # 02 — the line and the sonified market
    bus.add(air(0.45, 3500, 1500, peak=0.25), T["mm_out"], -34, pan=-0.1, rev=0.2)
    zipn = int(0.5 * SR)
    zipper = air(0.5, 5000, 2200, rise=0.8, peak=0.15)
    bus.add_panned(zipper, T["line"], -36, np.linspace(0.6, -0.8, zipn), rev=0.2)
    # market tone follows the head of the line, then locks at the snap
    rows, (px, py, pr) = F.mm_geom()
    t0, t1 = T["wave"], T["strat_out"] + 0.3
    tt_ = np.arange(int((t1 - t0) * SR)) / SR + t0
    ctrl_t = np.arange(t0, t1, 1 / 200.0)
    off = np.array([F.wave_amp(x) * F.wave(px, x) for x in ctrl_t]) / 72.0   # ≈ [-1.4, 1.4]
    off_s = np.interp(tt_, ctrl_t, off)
    base = 220.0
    freq = base * 2 ** (-off_s * 0.55 / 12)          # ±~0.8 semitone, inverted: up on screen = up in pitch
    ph = 2 * np.pi * np.cumsum(freq) / SR
    tone = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    e = np.clip((tt_ - t0) / 0.5, 0, 1)
    after = tt_ >= T["snap"]
    e = np.where(after, np.exp(-(tt_ - T["snap"]) / 0.55) * 0.65 + 0.0, e)
    e *= np.clip((t1 - tt_) / 0.25, 0, 1)
    bl, al = signal.butter(2, 1500 / (SR / 2))
    tone = signal.lfilter(bl, al, tone * e)
    bus.add(norm(tone), t0, -27, pan=0.1, rev=0.35, width=0.3)
    bus.add(impact(1.0, 60, 40, 0.3, tr=0.2), T["emo"] + 0.02, -18, rev=0.2)
    # SNAP: precise, dry, then stillness
    snap = tick(1900, 0.006, 0.05, 0.5) * 0.8
    bus.add(snap, T["snap"], -14, rev=0.12)
    bus.add(thump(90, 48, 0.12), T["snap"], -15, rev=0.05)
    bus.add(tick(5200, 0.002, 0.02, 0.1), T["snap"] + 0.004, -24, rev=0.05)
    # the wipe that reveals STRATEGY SHOULDN'T.
    scan = air(0.46, 1200, 4800, rise=1.0, peak=0.8)
    bus.add_panned(scan, T["strat"], -33, np.linspace(-0.7, 0.7, len(scan)), rev=0.2)
    bus.add(tick(2600, 0.004), T["strat"] + 0.72, -27, pan=0.5, rev=0.25)   # the period lands

    # the fold → giant W → flood
    bus.add(air(0.35, 3000, 1200, peak=0.3), T["strat_out"], -35, rev=0.15)
    bus.add(whoosh(0.58, 70, 260, peak=0.95, sub=0.8, rise=2.0), T["fold"], -16, rev=0.15)
    bus.add(impact(1.0, 58, 36, 0.8, tr=0.45), T["thick_end"] - 0.02, -8, rev=0.3)
    wf = whoosh(0.4, 90, 700, peak=0.92, sub=0.6, rise=1.6)
    bus.add_panned(wf, T["flood"], -15, np.linspace(-0.3, 0.3, len(wf)), rev=0.2)

    # 03/04 — the system runs: a soft sub pulse on the 0.6 s grid
    beat = 0.6
    for k in range(9):
        tb = T["cap"] + k * beat
        lvl = -23 if k else -20
        bus.add(thump(62, 44, 0.16, drive=1.2), tb, lvl, rev=0.05)
        bus.add(tick(5600, 0.0016, 0.012, 0.0), tb + beat / 2, -38, pan=0.35 * (1 if k % 2 else -1), rev=0.15)
    arch_pad = pad(4.9, [55.0, 82.4, 110.0], [1.0, 0.5, 0.3], attack=0.9, release=0.7, lp=300)
    bus.add(arch_pad, T["cap"], -30, rev=0.1)

    def tock(freq=720.0):
        t = tt(0.12)
        s = np.sin(2 * np.pi * freq * t) * env_ad(len(t), 0.001, 0.022)
        s += 0.3 * np.sin(2 * np.pi * freq * 2.7 * t) * env_ad(len(t), 0.0005, 0.008)
        return norm(s)
    bus.add(tock(700), T["cap"], -20, pan=-0.35, rev=0.25)
    bus.add(tock(760), T["broker"], -22, pan=-0.45, rev=0.25)
    # the frame drawing: a fine pen line travelling around the box
    fr = air(0.62, 3800, 5200, rise=0.5, peak=0.5) * np.hanning(int(0.62 * SR))
    ang = np.linspace(0, 1, len(fr))
    panc = np.interp(ang, [0, 0.35, 0.5, 0.85, 1.0], [-0.8, -0.2, -0.2, -0.8, -0.8])
    bus.add_panned(fr, T["frame"], -37, panc, rev=0.2)

    def confirm(hi=False):
        a_ = tick(2500 if not hi else 2800, 0.0045, 0.04, 0.3)
        b_ = tick(3750 if not hi else 4200, 0.004, 0.04, 0.3)
        out = np.zeros(int(0.12 * SR))
        out[:len(a_)] += a_
        d = int(0.055 * SR)
        out[d:d + len(b_)] += 0.85 * b_
        return norm(out)
    bus.add(confirm(), T["link"] + 0.02, -19, pan=0.05, rev=0.3)
    zl = air(0.4, 2000, 5200, rise=0.7, peak=0.2)
    bus.add_panned(zl, T["link"], -35, np.linspace(0.0, 0.5, len(zl)), rev=0.2)
    bus.add(tock(640), T["wb"], -19, pan=0.4, rev=0.25)
    for k, tp in enumerate(T["pulse"]):
        if k % 2 == 0:   # order: WENBOT → account, confirmed at the mark
            bus.add_panned(air(0.36, 2600, 4200, rise=1.5, peak=0.9) * 0.7, tp, -37, np.linspace(0.45, 0.0, int(0.36 * SR)), rev=0.2)
            bus.add(confirm(True), tp + 0.36, -21, pan=0.0, rev=0.3)
        else:            # fill report: account → WENBOT
            bus.add_panned(air(0.36, 4200, 2600, rise=1.5, peak=0.9) * 0.7, tp, -37, np.linspace(0.0, 0.45, int(0.36 * SR)), rev=0.2)
            bus.add(tick(1900, 0.006, 0.05, 0.25), tp + 0.36, -23, pan=0.45, rev=0.3)
    # iris: the mark's dot swallows the frame
    wi = whoosh(0.46, 60, 300, peak=0.9, sub=0.9, rise=1.8)
    bus.add(wi, T["iris"], -15, rev=0.2)
    bus.add(impact(1.0, 56, 38, 0.5, tr=0.25, tr_lp=900), T["iris_end"] - 0.01, -13, rev=0.25)
    # execution log
    for k in range(3):
        bus.add(tick(1800 - 120 * k, 0.005, 0.03, 0.2), T["rows"] + k * 0.07, -27, pan=-0.6, rev=0.2)
    # the markers run: a fine mechanical clock
    run_t0, run_t1 = T["run"], T["sys"]
    k = 0
    tcur = run_t0
    while tcur < run_t1:
        bus.add(tick(6200 if k % 4 else 5000, 0.0012, 0.01, 0.0), tcur, -40 if k % 4 else -36, pan=-0.1, rev=0.1)
        tcur += beat / 4
        k += 1
    for k, te in enumerate(T["exec"]):
        bus.add(confirm(), te, -16, pan=0.1, rev=0.3)
        bus.add(thump(80, 50, 0.1), te, -20, rev=0.1)
        for j in range(8):   # "EXECUTED" typing
            bus.add(tick(3300 + 90 * j, 0.0015, 0.012, 0.0), te + 0.02 + j * 0.0375, -36, pan=0.55, rev=0.1)
    bt = T["run"] + 0.10 + 0.15
    while bt < T["sys"]:
        bus.add(tick(1150, 0.012, 0.06, 0.0), bt, -36, pan=0.6, rev=0.35)
        bt += 0.625
    # rows converge into one line
    bus.add(whoosh(0.34, 400, 110, peak=0.7, sub=0.2, rise=1.2), T["sys"], -24, rev=0.2)

    # 05 — SYSTEMATIC. typed, DISCIPLINED. locks, TRANSPARENT. clears
    st = F.s_words[0]
    idx = [i for i in range(st.n) if i not in st.skip]
    for j, i in enumerate(idx):
        bus.add(tick(2400, 0.003, 0.025, 0.25), T["sys_type"] + i * 0.046, -22, pan=-0.6 + 1.2 * j / max(1, len(idx) - 1), rev=0.15)
    bus.add(thump(70, 45, 0.25), T["sys_type"] + (st.n - 1) * 0.046, -14, rev=0.15)
    bus.add(tick(1600, 0.006, 0.04, 0.2), T["sys_type"] + (st.n - 1) * 0.046, -22, rev=0.2)
    bus.add(impact(1.0, 64, 40, 0.5), T["disc"], -9, rev=0.22)
    wd = whoosh(0.5, 900, 180, peak=0.12, sub=0.0, rise=0.6)
    bus.add(wd, T["disc"], -27, rev=0.2)
    bus.add(tick(1400, 0.004, 0.04, 0.3), T["disc"] + 0.48, -21, rev=0.2)
    bus.add(impact(0.9, 60, 40, 0.35, tr=0.2), T["trans"], -12, rev=0.3)
    bus.add(glass(1.5, 1760.0), T["trans"] + 0.04, -27, rev=0.6, width=0.4)
    bus.add(air(0.7, 5000, 9000, rise=1.2, peak=0.6), T["trans"] + 0.05, -33, rev=0.4)

    # 06 — custody: warmth, and a seal
    bus.add(air(0.35, 6000, 2500, peak=0.2), T["cust"] - 0.05, -36, rev=0.3)
    bus.add(impact(0.9, 62, 40, 0.45, tr=0.2, tr_lp=1100), T["cust"] + 0.26, -14, rev=0.25)
    cp = pad(2.2, [82.4, 123.5, 164.8, 246.9], [1.0, 0.6, 0.35, 0.12], attack=0.7, release=0.5, lp=700)
    bus.add(cp, T["cust"] + 0.2, -26, rev=0.3, width=0.3)
    t = tt(0.45)
    seal = np.sin(2 * np.pi * np.cumsum(660 + 330 * (t / 0.45) ** 0.7) / SR) * np.sin(np.pi * t / 0.45) ** 2
    bus.add(norm(seal), T["cust"] + 0.72, -33, pan=0.2, rev=0.45)
    bus.add(tick(2200, 0.006, 0.05, 0.3), T["cust"] + 1.12, -24, pan=0.2, rev=0.35)

    # 07 — silence, then the symbol is rebuilt
    bus.add(air(0.4, 3000, 900, peak=0.2), T["fin"], -33, rev=0.3)
    bus.add(blip(), T["tittle"], -15, pan=-0.12, rev=0.5)
    vt, vy = zig_vertex_times()
    for tv, y in zip(vt, vy):
        f = 1046.5 if y < 0.5 else 784.0          # tops ring higher than the troughs
        bus.add(tick(f, 0.01, 0.06, 0.1), tv, -24, pan=-0.3 + 0.15 * vt.index(tv), rev=0.35)
    gs = whoosh(0.6, 60, 240, peak=0.95, sub=0.9, rise=2.2)
    bus.add(gs, T["grow"], -19, rev=0.2)
    bw = air(0.46, 900, 3000, rise=1.0, peak=0.8)
    bus.add_panned(bw, T["bowls"], -31, np.linspace(-0.2, 0.6, len(bw)), rev=0.3)
    # the lock: deep, elegant sub hit + a long, soft tail
    hit = thump(46, 31, 1.9, dur=4.5, drive=1.3, sweep=0.06)
    hit[: int(0.03 * SR)] += 0.25 * transient(0.03, 700)
    bus.add(norm(hit), T["lock"], -5, rev=0.35)
    bus.add(tick(1318.5, 0.02, 0.2, 0.1), T["lock"], -24, rev=0.6)
    end_pad = pad(film.DURATION - T["lock"] + 0.2, [41.2, 61.7, 82.4, 123.5, 185.0],
                  [1.0, 0.5, 0.45, 0.22, 0.07], attack=0.9, release=1.6, lp=520)
    bus.add(end_pad, T["lock"] + 0.1, -30, rev=0.3, width=0.3)
    bus.add(air(0.5, 5200, 2600, rise=0.8, peak=0.7), T["word"], -34, rev=0.4)
    bus.add(tick(2600, 0.005, 0.05, 0.2), T["word"] + 0.34, -30, rev=0.4)
    bus.add(tock(620), T["tag"] + 0.02, -24, rev=0.35)

    # ---------------------------------------------------------- master
    ir = reverb_ir(2.4)
    wet = np.zeros_like(bus.dry)
    for ch in range(2):
        wet[:, ch] = signal.fftconvolve(bus.send[:, ch], ir[:, ch])[: bus.n]
    mix = bus.dry + wet * 0.42
    # true silence before the rebuild of the symbol
    g = np.ones(bus.n)
    s0, s1 = T["fin"] + 0.2, T["tittle"] - 0.004
    i0, i1 = int(s0 * SR), int(s1 * SR)
    fade = int(0.06 * SR)
    g[i0 - fade:i0] = np.linspace(1, 0, fade) ** 2
    g[i0:i1] = 0.0
    mix *= g[:, None]
    # fade out with the picture
    fo0, fo1 = int((T["fade"] - 0.28) * SR), int((film.DURATION - 0.04) * SR)
    ramp = np.ones(bus.n)
    ramp[fo0:fo1] = np.linspace(1, 0, fo1 - fo0) ** 1.6
    ramp[fo1:] = 0
    mix *= ramp[:, None]
    b, a = signal.butter(2, 24 / (SR / 2), "high")
    mix = signal.lfilter(b, a, mix, axis=0)
    # loudness to about -16 LUFS integrated, then a clean peak ceiling
    import pyloudnorm as pyln
    meter = pyln.Meter(SR)
    lufs = meter.integrated_loudness(mix)
    mix *= db(-15.0 - lufs)
    mix = limiter(mix, -1.5)
    lufs2 = meter.integrated_loudness(mix)
    print(f"loudness {lufs:.1f} → {lufs2:.1f} LUFS, peak {20 * np.log10(np.abs(mix).max()):.2f} dBFS")
    wavfile.write(out_path, SR, mix.astype(np.float32))
    print("wrote", out_path)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "..", "out", "wenbot_sound.wav"))
    build(ap.parse_args().out)
