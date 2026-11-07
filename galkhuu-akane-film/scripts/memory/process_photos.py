import sys, json, os
from PIL import Image, ImageOps, ImageDraw, ImageFont
src, crops_json, out_dir, sheet_dir = sys.argv[1:5]
c = json.load(open(crops_json))
os.makedirs(out_dir, exist_ok=True); os.makedirs(sheet_dir, exist_ok=True)
extra = {"37": (0, 0.06, 1, 1), "06": (0, 0.125, 1, 0.905), "38": (0, 0.245, 0.92, 0.975)}  # 06/38: trim plastic sleeve around archival print  # drop screenshot "Crop" UI button at top-right
thumbs = []
for pid, d in sorted(c.items()):
    if pid in ("32", "26"):
        d["excluded"] = "removed at the couple's request 2026-11-07"; continue
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, pid + ".jpg"))).convert("RGB")
    im = im.crop(tuple(d["crop"]))
    if pid in extra:
        a, b, cc, dd = extra[pid]; w, h = im.size
        im = im.crop((int(a*w), int(b*h), int(cc*w), int(dd*h)))
    d["w"], d["h"] = im.size
    clean = Image.new("RGB", im.size); clean.paste(im)  # drop all metadata
    clean.save(os.path.join(out_dir, pid + ".jpg"), quality=93, subsampling=0)
    t = clean.copy(); t.thumbnail((420, 420)); thumbs.append((pid, t))
json.dump(c, open(crops_json, "w"), indent=1)
f = ImageFont.truetype("arial.ttf", 28)
for k in range(0, 45, 15):
    sheet = Image.new("RGB", (5*440, 3*470), (245, 242, 236)); dr = ImageDraw.Draw(sheet)
    for j, (pid, t) in enumerate(thumbs[k:k+15]):
        x, y = (j % 5)*440 + 10, (j//5)*470 + 40
        sheet.paste(t, (x + (420 - t.width)//2, y)); dr.text((x, y-36), pid, fill=(20, 20, 20), font=f)
    sheet.save(os.path.join(sheet_dir, f"cropped_sheet_{k//15+1}.jpg"), quality=88)
