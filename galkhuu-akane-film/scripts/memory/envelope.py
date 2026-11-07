import sys, subprocess, numpy as np
f = sys.argv[1]
raw = subprocess.run(["ffmpeg","-v","error","-i",f,"-ac","1","-ar","8000","-f","f32le","-"],capture_output=True).stdout
x = np.frombuffer(raw, np.float32); sr=8000; w=sr  # 1 s windows
n=len(x)//w; db=[20*np.log10(np.sqrt(np.mean(x[i*w:(i+1)*w]**2))+1e-9) for i in range(n)]
print(f, "dur", len(x)/sr)
# first sound / last sound
nz=[i for i,d in enumerate(db) if d>-50]; print("sound from", nz[0], "to", nz[-1]+1)
line=""
for i,d in enumerate(db):
    line+=f"{i:3d}:{d:5.1f} "
    if i%10==9: print(line); line=""
print(line)
