import hashlib, os, subprocess, json
D = "DELIVERY_Galkhuu_Akane_20261107"; P = f"{D}/PUBLIC_RELEASE"; L = f"{D}/LOCAL_ONLY_MUSIC"
h = lambda f: hashlib.sha256(open(f, "rb").read()).hexdigest()
pub = sorted(f for f in os.listdir(P) if f.endswith((".mp4", ".png", ".zip")))
loc = sorted(f for f in os.listdir(L) if f.endswith((".mp4", ".m4a")) and f not in pub)
def probe(f):
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", f], capture_output=True, text=True).stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video"); a = any(s["codec_type"] == "audio" for s in j["streams"])
    return v["width"], v["height"], round(float(j["format"]["duration"]), 1), a
media = {}
for f in pub:
    if f.endswith(".mp4"): media[f] = probe(f"{P}/{f}")
for f in loc:
    if f.endswith(".mp4"): media[f] = probe(f"{L}/{f}")
t = open("tools/DOWNLOAD_ON_COMPUTER_A.template.ps1", encoding="utf8").read()
t = t.replace("__RELEASE_BASE__", "https://github.com/BeBecpp/wedding_movie/releases/download/wedding-2026-11-07")
t = t.replace("__PUBLIC_HASHES__", "\n".join(f"  '{f}' = '{h(f'{P}/{f}')}'" for f in pub))
t = t.replace("__LOCAL_HASHES__", "\n".join(f"  '{f}' = '{h(f'{L}/{f}')}'" for f in loc))
t = t.replace("__MEDIA__", "\n".join(f"  '{f}' = @({w}, {hh}, {d}, ${'true' if a else 'false'})" for f, (w, hh, d, a) in media.items()))
open(f"{P}/DOWNLOAD_ON_COMPUTER_A.ps1", "w", encoding="utf-8-sig", newline="\r\n").write(t.replace("\r\n", "\n"))
allp = sorted(f for f in os.listdir(P) if f != "SHA256SUMS.txt")
open(f"{P}/SHA256SUMS.txt", "w", newline="\n").write("".join(f"{h(f'{P}/{f}')}  {f}\n" for f in allp))
open(f"{L}/SHA256SUMS_LOCAL_ONLY.txt", "w", newline="\n").write("".join(f"{h(f'{L}/{f}')}  {f}\n" for f in loc))
print(json.dumps(media, indent=0)); print(open(f"{P}/SHA256SUMS.txt").read())
