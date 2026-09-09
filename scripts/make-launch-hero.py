"""Compose the launch-email hero: three app screens fanned like a hand of cards,
rising out of the bottom edge, with confetti and a purple/teal glow.
Output is 2x for retina, displayed at 640x400 in the email."""
import math
import random
from PIL import Image, ImageDraw, ImageFilter

SRC = "/Users/frozair/Dev/websites/clipzy.xyz/public/app/release/"
OUT = "/Users/frozair/Dev/websites/clipzy.xyz/public/email/launch-hero.png"
W, H = 1280, 880
BG = (27, 30, 36)          # #1B1E24, the email card colour
TEAL = (45, 212, 191)
PURPLE = (168, 117, 255)
PINK = (255, 107, 169)
GOLD = (255, 209, 102)
WHITE = (243, 245, 247)

random.seed(20260908)
canvas = Image.new("RGBA", (W, H), BG + (255,))

# --- glow mesh -------------------------------------------------------------
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse([-200, 120, 620, 900], fill=PURPLE + (110,))
g.ellipse([700, 60, 1500, 820], fill=TEAL + (80,))
g.ellipse([380, 520, 900, 1000], fill=PINK + (50,))
glow = glow.filter(ImageFilter.GaussianBlur(160))
canvas.alpha_composite(glow)


def confetti(layer, n, box, size_range, alpha):
    d = ImageDraw.Draw(layer)
    colours = [TEAL, PURPLE, PINK, GOLD, WHITE]
    x0, y0, x1, y1 = box
    for _ in range(n):
        c = random.choice(colours) + (alpha,)
        x = random.uniform(x0, x1)
        y = random.uniform(y0, y1)
        s = random.uniform(*size_range)
        kind = random.random()
        if kind < 0.45:
            d.ellipse([x, y, x + s, y + s], fill=c)
        elif kind < 0.85:
            # rotated rectangle strip
            ang = random.uniform(0, math.pi)
            L, T = s * 1.9, s * 0.55
            pts = []
            for dx, dy in [(-L / 2, -T / 2), (L / 2, -T / 2), (L / 2, T / 2), (-L / 2, T / 2)]:
                pts.append((x + dx * math.cos(ang) - dy * math.sin(ang),
                            y + dx * math.sin(ang) + dy * math.cos(ang)))
            d.polygon(pts, fill=c)
        else:
            # ring
            d.ellipse([x, y, x + s, y + s], outline=c, width=max(2, int(s / 5)))


# confetti behind the phones: dense, soft
back = Image.new("RGBA", (W, H), (0, 0, 0, 0))
confetti(back, 70, (0, 0, W, H * 0.75), (10, 24), 150)
back = back.filter(ImageFilter.GaussianBlur(1.2))
canvas.alpha_composite(back)


def phone(path, width, angle):
    """Return an RGBA card of the screenshot with rounded corners, a slim bezel
    and a shadow, rotated by `angle` degrees."""
    img = Image.open(path).convert("RGBA")
    ratio = width / img.width
    img = img.resize((width, int(img.height * ratio)), Image.LANCZOS)
    bezel = int(width * 0.035)
    radius = int(width * 0.16)
    cw, ch = img.width + 2 * bezel, img.height + 2 * bezel
    card = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle([0, 0, cw - 1, ch - 1], radius=radius, fill=(14, 15, 18, 255))
    d.rounded_rectangle([1, 1, cw - 2, ch - 2], radius=radius, outline=(70, 76, 88, 255), width=2)
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, img.width - 1, img.height - 1],
                                           radius=radius - bezel, fill=255)
    card.paste(img, (bezel, bezel), mask)
    # shadow
    pad = 90
    shadow = Image.new("RGBA", (cw + pad * 2, ch + pad * 2), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([pad, pad + 30, pad + cw, pad + ch + 30],
                                             radius=radius, fill=(0, 0, 0, 170))
    shadow = shadow.filter(ImageFilter.GaussianBlur(40))
    shadow.alpha_composite(card, (pad, pad))
    return shadow.rotate(angle, resample=Image.BICUBIC, expand=True)


# three upright screens in story order: Keep in the feed, stack the layout,
# caption and export. Equal size, tops aligned, evenly spaced, cropped at the
# bottom so the eye reads them as one row.
PHONE_W = 330
TOP = 100
shots = ["02-keep.png", "04-stack.png", "05-captions.png"]
cards = [phone(SRC + f, PHONE_W, 0) for f in shots]
cw = cards[0].width
pad = 90
inner = cw - 2 * pad            # visible card width without the shadow margin
gap = (W - 3 * inner) // 4
for i, card in enumerate(cards):
    x = gap + i * (inner + gap) - pad
    canvas.alpha_composite(card, (x, TOP - pad))

# confetti in front: a few crisp pieces, kept above and beside the screens
front = Image.new("RGBA", (W, H), (0, 0, 0, 0))
confetti(front, 14, (0, 0, W, TOP - 14), (8, 16), 230)
canvas.alpha_composite(front)

# fade the very bottom into the card colour so the crop reads as intentional
fade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fd = ImageDraw.Draw(fade)
FADE = 70
for i in range(FADE):
    a = int(255 * (i / FADE) ** 1.6)
    fd.line([(0, H - FADE + i), (W, H - FADE + i)], fill=BG + (a,))
canvas.alpha_composite(fade)

canvas.convert("RGB").save(OUT, optimize=True)
print(OUT, canvas.size)
