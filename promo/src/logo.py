"""WENBOT "WB" symbol, redrawn as clean vector geometry.

Fitted on the brand's reference artwork (see assets/wb_symbol_reference.png):
straight edges by least squares, curves by constrained cubic Bezier fits,
W made exactly symmetric about its apex. Units: cap height = 1.0, origin at the
hook tip x / cap top y, y pointing down (screen space).

Every part is exposed separately so the film can use the symbol as a graphic
language (dot, zigzag, strokes, stem, bowls, ring + dot) and rebuild it.
"""
import math
import skia

# ---------------------------------------------------------------- geometry
G = {
    "hook": [[0.267664, 0.251274], [0.157402, 0.251274], [0.094394, 0.242181], [0.0, 0.166665]],
    # each W edge is given by its x at the cap line (y=0) and at the baseline (y=1)
    "E1L": [-0.047463, 0.237319], "E1R": [0.205026, 0.454307],
    "E2L": [0.564094, 0.298992], "E2R": [0.775139, 0.490033],
    "E3L": [0.524627, 0.809733], "E3R": [0.735673, 1.000774],
    "E4L": [1.094740, 0.845459], "E4R": [1.347229, 1.062447],
    "n1": [0.379038, 0.698055], "n2": [0.649883, 0.439332],
    "n3": [0.920728, 0.698055], "n4": [1.148218, 0.698818],
    "stemL": 1.148218, "stemR": 1.376155,
    "ubA": [[1.478693, 0.0], [1.633368, 0.0], [1.767605, 0.075721], [1.767605, 0.248723]],
    "ubB": [[1.767609, 0.251871], [1.767609, 0.357590], [1.730819, 0.408101], [1.646297, 0.468441]],
    "lbC": [[1.646297, 0.468441], [1.771334, 0.514951], [1.855788, 0.552415], [1.855788, 0.719774]],
    "lbD": [[1.855799, 0.722922], [1.855799, 0.858842], [1.781882, 0.934342], [1.663710, 0.981535]],
    "lb_ext": [1.628610, 0.995553],
    "uc1": [[1.385794, 0.177035], [1.453915, 0.177035], [1.546917, 0.187209], [1.546917, 0.278810]],
    "uc2": [[1.546905, 0.281956], [1.546905, 0.380884], [1.459566, 0.391443], [1.385656, 0.391443]],
    "lc1": [[1.387713, 0.588595], [1.471698, 0.588595], [1.615887, 0.577610], [1.615887, 0.706610]],
    "lc2": [[1.615848, 0.709747], [1.615848, 0.770483], [1.583616, 0.779004], [1.581056, 0.797568]],
    "lc_ext": [1.576753, 0.828769],
    "ring_c": [1.478706, 0.940189], "ring_r": 0.173165, "bdot_r": 0.072945,
    "tdot_c": [0.154202, 0.087843], "tdot_r": 0.086803,
}
WIDTH = 1.855809          # symbol width in cap-height units
BOTTOM = G["ring_c"][1] + G["bdot_r"]   # the lower dot sits slightly under the baseline
AXIS = 0.649883           # symmetry axis of the W
STROKE_ANGLE = math.degrees(math.atan(G["E1L"][1] - G["E1L"][0]))  # ~15.9 deg


def ex(k, y):
    a, b = G[k]
    return a + (b - a) * y


def _cubic(p, c):
    p.cubicTo(c[1][0], c[1][1], c[2][0], c[2][1], c[3][0], c[3][1])


def circle(cx, cy, r):
    p = skia.Path()
    p.addCircle(cx, cy, r)
    return p


def union(*ps):
    out = ps[0]
    for q in ps[1:]:
        out = skia.Op(out, q, skia.PathOp.kUnion_PathOp)
    return out


def diff(a, b):
    return skia.Op(a, b, skia.PathOp.kDifference_PathOp)


def inter(a, b):
    return skia.Op(a, b, skia.PathOp.kIntersect_PathOp)


# ---------------------------------------------------------------- parts
def w_silhouette():
    h = G["hook"]
    p = skia.Path()
    p.moveTo(*h[3])
    p.lineTo(ex("E1L", 1), 1)
    p.lineTo(ex("E2R", 1), 1)
    p.lineTo(*G["n2"])
    p.lineTo(ex("E3L", 1), 1)
    p.lineTo(ex("E4R", 1), 1)
    p.lineTo(*G["n4"])
    p.lineTo(G["stemL"], 0)
    p.lineTo(ex("E4L", 0), 0)
    p.lineTo(*G["n3"])
    p.lineTo(ex("E3R", 0), 0)
    p.lineTo(ex("E2L", 0), 0)
    p.lineTo(*G["n1"])
    p.lineTo(*h[0])
    p.cubicTo(h[1][0], h[1][1], h[2][0], h[2][1], h[3][0], h[3][1])
    p.close()
    return p


def w_pure_silhouette():
    """The W on its own (stroke 4 runs to the cap line instead of into the stem)."""
    h = G["hook"]
    p = skia.Path()
    p.moveTo(*h[3])
    p.lineTo(ex("E1L", 1), 1)
    p.lineTo(ex("E2R", 1), 1)
    p.lineTo(*G["n2"])
    p.lineTo(ex("E3L", 1), 1)
    p.lineTo(ex("E4R", 1), 1)
    p.lineTo(ex("E4R", 0), 0)
    p.lineTo(ex("E4L", 0), 0)
    p.lineTo(*G["n3"])
    p.lineTo(ex("E3R", 0), 0)
    p.lineTo(ex("E2L", 0), 0)
    p.lineTo(*G["n1"])
    p.lineTo(*h[0])
    p.cubicTo(h[1][0], h[1][1], h[2][0], h[2][1], h[3][0], h[3][1])
    p.close()
    return p


def zigzag_points():
    """Centre-line of the W: the market line hidden inside the letter."""
    mid_top = 0.5 * (G["E1L"][0] + G["E1R"][0])
    mid_bot = 0.5 * (G["E1L"][1] + G["E1R"][1])
    # where stroke-1 centre line meets the hook
    y0 = 0.2455
    x0 = mid_top + (mid_bot - mid_top) * y0
    bl = 0.5 * (ex("E1L", 1) + ex("E2R", 1))          # bottom-left vertex centre
    br = 2 * AXIS - bl
    tr = 0.5 * (ex("E4L", 0) + ex("E4R", 0))          # stroke-4 top centre
    return [(x0, y0), (bl, 1.0), (AXIS, 0.0), (br, 1.0), (tr, 0.0)]


def w_strokes(s=1.0, s_each=None, pure=False):
    """Union of the four W strokes, each grown from the zig-zag centre line
    (s=0) to its full weight (s=1), clipped to the true silhouette."""
    z = zigzag_points()
    # zig-zag segment of each stroke, expressed as x at y=0 and y=1
    segs = []
    for (ax, ay), (bx, by) in zip(z[:-1], z[1:]):
        k = (bx - ax) / (by - ay)
        segs.append((ax - k * ay, ax + k * (1 - ay)))
    edges = [("E1L", "E1R"), ("E2L", "E2R"), ("E3L", "E3R"), ("E4L", "E4R")]
    polys = []
    for i, ((kl, kr), zc) in enumerate(zip(edges, segs)):
        si = s if s_each is None else s_each[i]
        if si <= 0:
            continue
        l0 = zc[0] + (G[kl][0] - zc[0]) * si
        l1 = zc[1] + (G[kl][1] - zc[1]) * si
        r0 = zc[0] + (G[kr][0] - zc[0]) * si
        r1 = zc[1] + (G[kr][1] - zc[1]) * si
        p = skia.Path()
        p.moveTo(l0, 0)
        p.lineTo(r0, 0)
        p.lineTo(r1, 1)
        p.lineTo(l1, 1)
        p.close()
        polys.append(p)
    if not polys:
        return skia.Path()
    return inter(union(*polys), w_pure_silhouette() if pure else w_silhouette())


def stem():
    return skia.Path.Rect(skia.Rect.MakeLTRB(G["stemL"], 0, G["stemR"], 1))


def b_outer():
    p = skia.Path()
    ubA, ubB, lbC, lbD = G["ubA"], G["ubB"], G["lbC"], G["lbD"]
    p.moveTo(G["stemL"], 0)
    p.lineTo(*ubA[0]); _cubic(p, ubA)
    p.lineTo(*ubB[0]); _cubic(p, ubB)
    _cubic(p, lbC)
    p.lineTo(*lbD[0]); _cubic(p, lbD)
    p.lineTo(*G["lb_ext"])
    p.lineTo(1.53, 1.0)
    p.lineTo(G["stemL"], 1.0)
    p.close()
    return p


def upper_counter():
    a, b = G["uc1"], G["uc2"]
    p = skia.Path()
    p.moveTo(G["stemR"], a[0][1]); p.lineTo(*a[0]); _cubic(p, a)
    p.lineTo(*b[0]); _cubic(p, b); p.lineTo(G["stemR"], b[3][1]); p.close()
    return p


def lower_counter():
    a, b = G["lc1"], G["lc2"]
    p = skia.Path()
    p.moveTo(G["stemR"], a[0][1]); p.lineTo(*a[0]); _cubic(p, a)
    p.lineTo(*b[0]); _cubic(p, b)
    p.lineTo(*G["lc_ext"]); p.lineTo(1.52, 0.90); p.lineTo(G["stemR"], 0.90); p.close()
    return p


def ring_hole():
    return circle(G["ring_c"][0], G["ring_c"][1], G["ring_r"])


def bottom_dot(scale=1.0):
    return circle(G["ring_c"][0], G["ring_c"][1], G["bdot_r"] * scale)


def top_dot(scale=1.0):
    return circle(G["tdot_c"][0], G["tdot_c"][1], G["tdot_r"] * scale)


def b_body():
    """The B without its dot: stem + bowls with counters and ring cut."""
    b = union(stem(), b_outer())
    b = diff(b, upper_counter())
    b = diff(b, lower_counter())
    return diff(b, ring_hole())


def symbol():
    body = union(w_silhouette(), b_body())
    body = diff(body, ring_hole())
    return union(body, bottom_dot(), top_dot())


def pie(cx, cy, r, a0, a1):
    """Angular sector (degrees, clockwise from +x) used to sweep the bowls in."""
    p = skia.Path()
    if a1 <= a0:
        return p
    p.moveTo(cx, cy)
    p.arcTo(skia.Rect.MakeLTRB(cx - r, cy - r, cx + r, cy + r), a0, a1 - a0, False)
    p.close()
    return p


_CACHE = {}


def cached(name, fn):
    if name not in _CACHE:
        _CACHE[name] = fn()
    return _CACHE[name]
