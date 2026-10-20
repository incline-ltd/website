"""Incline favicon: an ascending stair whose top step is brand red.

Renders the multi-size .ico and its SVG twin.
"""
import struct
import sys
import zlib

BG = (0x06, 0x06, 0x09)
LINE = (0xF5, 0xF5, 0xF7)
ACCENT = (0xFC, 0x43, 0x48)
SS = 4

# Authored on a 32x32 grid: stair rises left→right, red cap on the top tread.
STEPS = [
    (7.5, 23.5, 13.5, 23.5),
    (13.5, 23.5, 13.5, 17.5),
    (13.5, 17.5, 19.5, 17.5),
    (19.5, 17.5, 19.5, 11.5),
]
CAP = (19.5, 11.5, 24.5, 11.5)
STROKE = 3.4


def rr(x, y, w, h, r):
    if x < 0 or y < 0 or x > w or y > h:
        return False
    cx = min(max(x, r), w - r)
    cy = min(max(y, r), h - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def cap_hit(x, y, seg, r):
    x1, y1, x2, y2 = seg
    dx, dy = x2 - x1, y2 - y1
    d = dx * dx + dy * dy
    t = 0.0 if d == 0 else ((x - x1) * dx + (y - y1) * dy) / d
    t = min(max(t, 0.0), 1.0)
    return (x - (x1 + t * dx)) ** 2 + (y - (y1 + t * dy)) ** 2 <= r * r


def render(size):
    u = size / 32.0
    radius = 7.0 * u
    half = STROKE * u / 2
    steps = [tuple(v * u for v in s) for s in STEPS]
    cap = tuple(v * u for v in CAP)

    px = bytearray()
    for py_i in range(size):
        px.append(0)
        for px_i in range(size):
            a_bg = a_l = a_a = 0
            for sy in range(SS):
                for sx in range(SS):
                    x = px_i + (sx + 0.5) / SS
                    y = py_i + (sy + 0.5) / SS
                    if not rr(x, y, size, size, radius):
                        continue
                    a_bg += 1
                    if cap_hit(x, y, cap, half):
                        a_a += 1
                    elif any(cap_hit(x, y, s, half) for s in steps):
                        a_l += 1
            tot = SS * SS
            if a_bg == 0:
                px.extend((0, 0, 0, 0))
                continue
            alpha = a_bg / tot
            ca, cl, cp = a_a / tot, a_l / tot, (a_bg - a_a - a_l) / tot
            r = (ACCENT[0] * ca + LINE[0] * cl + BG[0] * cp) / alpha
            g = (ACCENT[1] * ca + LINE[1] * cl + BG[1] * cp) / alpha
            b = (ACCENT[2] * ca + LINE[2] * cl + BG[2] * cp) / alpha
            px.extend((round(r), round(g), round(b), round(alpha * 255)))
    return bytes(px)


def png_bytes(size):
    raw = render(size)

    def chunk(tag, payload):
        body = tag + payload
        return struct.pack(">I", len(payload)) + body + struct.pack(">I", zlib.crc32(body))

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )


def ico_bytes(sizes):
    pngs = [(s, png_bytes(s)) for s in sizes]
    head = struct.pack("<HHH", 0, 1, len(pngs))
    offset = 6 + 16 * len(pngs)
    entries = blobs = b""
    for size, data in pngs:
        entries += struct.pack(
            "<BBBBHHII", size, size, 0, 0, 1, 32, len(data), offset
        )
        blobs += data
        offset += len(data)
    return head + entries + blobs


SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Incline">
  <rect width="32" height="32" rx="7" fill="#060609" />
  <g fill="none" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7.5 23.5h6v-6h6v-6" stroke="#f5f5f7" />
    <path d="M19.5 11.5h5" stroke="#fc4348" />
  </g>
</svg>
"""

if __name__ == "__main__":
    out = sys.argv[1]
    with open(out + "/favicon.ico", "wb") as fh:
        fh.write(ico_bytes([16, 32, 48]))
    with open(out + "/favicon.svg", "w") as fh:
        fh.write(SVG)
    print("favicon.ico and favicon.svg written")
