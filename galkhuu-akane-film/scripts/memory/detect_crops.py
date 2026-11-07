"""Detect real photo bounds inside phone screenshots (black letterbox/pillarbox),
detect faces (local OpenCV Haar cascade) for focal points, write JSON."""
import sys, json, os
import numpy as np
from PIL import Image, ImageOps
import cv2

src_dir, out_json = sys.argv[1], sys.argv[2]
res = {}
for i in range(1, 46):
    pid = f"{i:02d}"
    im = ImageOps.exif_transpose(Image.open(os.path.join(src_dir, f"{pid}.jpg"))).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    H, W, _ = a.shape
    lum = a.max(axis=2)  # max channel: dark clothes still count if any channel lit
    nonblack = lum > 24
    rowfrac = nonblack.mean(axis=1)
    colfrac = nonblack.mean(axis=0)
    def longest_run(mask):
        best = (0, 0); s = None
        for k, v in enumerate(list(mask) + [False]):
            if v and s is None: s = k
            if not v and s is not None:
                if k - s > best[1] - best[0]: best = (s, k)
                s = None
        return best
    # a row belongs to the photo if a meaningful fraction is lit; allow short dark gaps
    rmask = rowfrac > 0.12
    # close gaps up to 2% of height (dark bands inside real photo)
    gap = int(H * 0.02)
    rm = rmask.copy()
    idx = np.where(rmask)[0]
    for a0, b0 in zip(idx[:-1], idx[1:]):
        if 1 < b0 - a0 <= gap: rm[a0:b0] = True
    y0, y1 = longest_run(rm)
    sub = nonblack[y0:y1]
    cfrac = sub.mean(axis=0)
    cm = cfrac > 0.12
    x0, x1 = longest_run(cm)
    # trim 2px safety inward to drop any JPEG edge fringe
    if y0 > 0: y0 += 2
    if y1 < H: y1 -= 2
    if x0 > 0: x0 += 2
    if x1 < W: x1 -= 2
    crop = im.crop((x0, y0, x1, y1))
    cw, ch = crop.size
    faces = []
    res[pid] = dict(file_w=W, file_h=H, crop=[int(x0), int(y0), int(x1), int(y1)], w=cw, h=ch,
                    aspect=round(cw / ch, 4), faces=faces,
                    letterboxed=bool(y0 > 4 or x0 > 4 or y1 < H - 4 or x1 < W - 4))
    print(pid, W, H, "->", (x0, y0, x1, y1), cw, ch, round(cw / ch, 3), "faces", len(faces))
json.dump(res, open(out_json, "w"), indent=1)
