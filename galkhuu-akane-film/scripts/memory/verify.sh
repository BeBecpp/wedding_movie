#!/bin/bash
# Usage: verify.sh <file.mp4> ... — prints ffprobe facts, decode check, black-frame scan
for f in "$@"; do
  echo "=== $(basename "$f")  ($(du -h "$f" | cut -f1))"
  ffprobe -v error -show_entries format=duration:stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,nb_frames,color_space,color_primaries,color_transfer,sample_rate,channels -of compact=p=0:nk=0 "$f"
  ffmpeg -v error -i "$f" -f null - 2>&1 | head -3 && echo "decode: OK (no errors)"
  ffmpeg -hide_banner -i "$f" -vf "blackdetect=d=0.25:pic_th=0.90" -an -f null - 2>&1 | grep -o "black_start.*" | head -5 || true
  echo "(black segments listed above if any)"
done
