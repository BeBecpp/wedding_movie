import re, json, csv, sys
sb, crops_p, idx_p, out_dir = sys.argv[1:5]
src = open(sb, encoding="utf8").read()
c = json.load(open(crops_p))
orig = {r["photo_id"]: r for r in csv.DictReader(open(idx_p, encoding="utf-8-sig"))}
shots = []
for m in re.finditer(r'\{ kind: "(\w+)", at: ([\d.]+),(.*?)\},?\n', src):
    kind, at, rest = m.group(1), float(m.group(2)), m.group(3)
    ids = re.findall(r'p\("(\d\d)"(?:, ([\d.]+), ([\d.]+))?\)', rest)
    title = re.search(r'title: "([^"]+)"', rest); chap = re.search(r'chapter: "(\w+)"', rest)
    shots.append(dict(kind=kind, at=at, ids=ids, title=title.group(1) if title else None, chapter=chap.group(1) if chap else None))
TOTAL = 254.0
for i, s in enumerate(shots): s["end"] = shots[i+1]["at"] if i+1 < len(shots) else TOTAL
chap_names = {"I": "1 The Beginning", "II": "2 The People in Our Lives", "III": "3 Our Own Stories", "IV": "4 A Beautiful New Chapter", None: "Finale"}
photos = []
for pid in sorted(c):
    d = c[pid]; o = orig[pid]
    uses = [dict(shot=i+1, layout=s["kind"], chapter=chap_names[s["chapter"]] if s["kind"] != "finale" else "Finale (names)",
                 start_s=s["at"], end_s=s["end"], focalX=float(f[1] or 0.5), focalY=float(f[2] or 0.45))
            for i, s in enumerate(shots) for f in s["ids"] if f[0] == pid]
    photos.append(dict(photo_id=pid, original_filename=o["original_filename"], file_size=[d["file_w"], d["file_h"]],
        letterbox_detected=d["letterboxed"], crop_box_xyxy=d["crop"], cropped_size=[d["w"], d["h"]],
        processed_copy=f"public/local-photos/memory/{pid}.jpg (metadata stripped, local only)",
        status="EXCLUDED - removed at the couple's request (2026-11-07)" if pid == "32" else ("used" if uses else "UNUSED"),
        uses=uses, identity_review="REVIEW: people not identified; bride/groom, kinship and dates NOT confirmed",
        chronology_review="REVIEW: chapter placement is an editorial guess from the contact sheets"))
json.dump(dict(film="WeddingMemoryFilm", duration_s=TOTAL, fps=30, photos=photos,
    shots=[dict(n=i+1, kind=s["kind"], start_s=s["at"], end_s=s["end"], chapter=s["chapter"], title=s["title"], photos=[f[0] for f in s["ids"]]) for i, s in enumerate(shots)]),
    open(f"{out_dir}/photo_manifest.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
with open(f"{out_dir}/photo_manifest.csv", "w", newline="", encoding="utf-8-sig") as fh:
    w = csv.writer(fh); w.writerow(["photo_id", "status", "chapter", "layout", "start", "end", "crop_box_xyxy", "cropped_size", "identity_review"])
    for p in photos:
        u = p["uses"][0] if p["uses"] else {}
        w.writerow([p["photo_id"], p["status"] + (f" (+{len(p['uses'])-1} repeat)" if len(p["uses"]) > 1 else ""), u.get("chapter", ""), u.get("layout", ""), u.get("start_s", ""), u.get("end_s", ""), p["crop_box_xyxy"], p["cropped_size"], "UNCONFIRMED"])
fmt = lambda x: f"{int(x//60)}:{x%60:04.1f}"
md = ["# Galkhuu & Akane — WeddingMemoryFilm storyboard", "", f"Duration {fmt(TOTAL)} (7620 frames @ 30 fps). Cuts are 1 s cross-dissolves (1.5 s around title cards).", "",
      "| # | Time | Chapter | Layout | Photos / text | Music |", "|---|---|---|---|---|---|"]
def music(t):
    if t < 124.2: return "Song 154 *Unfailing Love*"
    if t < 126.6: return "crossfade 154 -> 132 (2:04.2-2:06.6)"
    s = t - 125.3
    lab = "intro" if s < 18 else "build" if s < 32 else "lift" if s < 42 else "breath" if s < 56 else "climax" if s < 90 else "breath" if s < 104 else "final lift / resolve"
    return f"Song 132 *Now We Are One* - {lab}"
for i, s in enumerate(shots):
    what = s["title"] or ", ".join(f[0] for f in s["ids"])
    md.append(f"| {i+1} | {fmt(s['at'])}–{fmt(s['end'])} | {('Opening' if s['chapter'] is None and s['kind']=='title' else chap_names[s['chapter']] if s['kind']!='finale' else 'Finale')} | {s['kind']} | {what} | {music(s['at'])} |")
md += ["", "Finale text: **GALKHUU & AKANE** / **7 NOVEMBER 2026** — appears ~0.5 s after 3:53 and holds to the last frame (no fade to black).",
       "", "Photo 32 is excluded at the couple's request. People in the photos are not identified; chapter placement is an editorial guess (see photo_manifest.json review markers)."]
open(f"{out_dir}/STORYBOARD.md", "w", encoding="utf8").write("\n".join(md))
used = [p for p in photos if p["status"] == "used"]
print("shots", len(shots), "used photos", len(used), "unused", [p["photo_id"] for p in photos if p["status"] == "UNUSED"])
