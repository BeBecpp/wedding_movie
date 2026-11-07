import sys, os
from PIL import Image, ImageDraw, ImageFont
src, out = sys.argv[1:3]
ids = sorted(f[:2] for f in os.listdir(src) if f.endswith(".jpg"))
f = ImageFont.truetype("arial.ttf", 28)
for old in [x for x in os.listdir(out) if x.startswith("cropped_sheet_")]: os.remove(os.path.join(out, old))
for k in range(0, len(ids), 15):
    sheet = Image.new("RGB", (5*440, 3*470), (245, 242, 236)); dr = ImageDraw.Draw(sheet)
    for j, pid in enumerate(ids[k:k+15]):
        t = Image.open(os.path.join(src, pid + ".jpg")); t.thumbnail((420, 420))
        x, y = (j % 5)*440 + 10, (j//5)*470 + 40
        sheet.paste(t, (x + (420 - t.width)//2, y)); dr.text((x, y-36), pid, fill=(20, 20, 20), font=f)
    sheet.save(os.path.join(out, f"cropped_sheet_{k//15+1}.jpg"), quality=88)
print(len(ids), "photos:", " ".join(ids))
