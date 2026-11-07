import sys, os
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
orig = Image.open(src).convert("RGB")
orig.save(os.path.join(out, "Galkhuu_Akane_Wedding_Background.png"))  # original pixels, lossless
bg = orig.resize((1920, 1080), Image.LANCZOS)
bg.save(os.path.join(out, "Galkhuu_Akane_Wedding_Background_1920x1080.png"))
F = r"C:\Windows\Fonts"
GREEN = (30, 72, 28); SOFT = (88, 112, 80)
def screen(name, line, date=True, y0=708):
    im = bg.copy(); d = ImageDraw.Draw(im)
    y = y0
    if line:
        f = ImageFont.truetype(os.path.join(F, "palai.ttf"), 52)
        w = d.textlength(line, font=f); d.text(((1920 - w) / 2, y), line, font=f, fill=GREEN); y += 92
    if date:
        f2 = ImageFont.truetype(os.path.join(F, "segoeuil.ttf"), 28)
        txt = "7  N O V E M B E R  2 0 2 6"
        w = d.textlength(txt, font=f2); d.text(((1920 - w) / 2, y), txt, font=f2, fill=SOFT)
    im.save(os.path.join(out, name)); print(name)
screen("Galkhuu_Akane_Welcome_Screen.png", "Welcome \u2014 we\u2019re so glad you\u2019re here")
screen("Galkhuu_Akane_Closing_Screen.png", "Thank you for celebrating with us")
screen("Galkhuu_Akane_Waiting_Screen.png", "Our celebration will begin shortly")
screen("Galkhuu_Akane_Fallback_Still.png", None, date=True, y0=716)
