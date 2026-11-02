import json, subprocess, os, sys
EP = '/home/user/claude-skills/human-output/motion-design/os-que-ficaram-ep1'
V = f'{EP}/entrega/Os-Que-Ficaram-EP1-A-Metade.mp4'
segs = json.load(open('segs.json'))
CX = [800, 960, 1000, 'fit', 960, 1010, 900, 1050, 920, 650, 545, 980, 1000, 900, 930, 700]
FPS = 30; W, H = 1080, 1920; PY = 285; END = 3.2
run = lambda *a: subprocess.run(list(a), check=True)
os.makedirs('out', exist_ok=True)
# frame-accurate durations
durs = [(round(b*FPS) - round(a*FPS)) / FPS for a, b in segs]
starts = []; acc = 0
for d in durs: starts.append(acc); acc += d
TOTAL = acc + END

# ---------- video per segment ----------
only = set(map(int, sys.argv[1].split(','))) if len(sys.argv) > 1 and sys.argv[1] != 'all' else None
for i, (a, b) in enumerate(segs):
    n = i + 1
    if only and n not in only: continue
    cx = CX[i]
    bg = f"[0]scale=-2:{H},crop={W}:{H}:(iw-{W})/2+{0 if cx=='fit' else (cx-960)*H/1080:.0f}:0,boxblur=28:2,eq=brightness=-0.22:saturation=0.8[bg]"
    if cx == 'fit':
        fg = f"[1]scale={W}:-2:flags=lanczos[fg]"; y = f"({H}-h)/2"
    else:
        x0 = max(0, min(3840 - 1728, cx*2 - 864))
        fg = f"[1]crop=1728:2160:{x0}:0,scale={W}:1350:flags=lanczos[fg]"; y = str(PY)
    run('ffmpeg', '-v', 'error', '-y', '-framerate', '30', '-i', f'frames/s{n:02d}/%04d.png', '-framerate', '30', '-i', f'frames/s{n:02d}/%04d.png',
        '-filter_complex', f"{bg};{fg};[bg][fg]overlay=0:{y},format=yuv420p[v]", '-map', '[v]', '-c:v', 'libx264', '-crf', '14', '-preset', 'medium', f'out/s{n:02d}.mp4')
    print('seg', n, 'ok', flush=True)
if only: sys.exit()

# end card background: last frame of seg 16 is black; plain dark
run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x05070a:s={W}x{H}:r=30:d={END}', '-vf', 'format=yuv420p', '-c:v', 'libx264', '-crf', '14', 'out/end.mp4')
with open('out/list.txt', 'w') as f:
    for n in range(1, len(segs)+1): f.write(f"file 's{n:02d}.mp4'\n")
    f.write("file 'end.mp4'\n")
run('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', 'out/list.txt', '-c', 'copy', 'out/video.mp4')

# ---------- audio ----------
inp, fil = [], []
for i, (a, b) in enumerate(segs):
    d = durs[i]
    inp += ['-ss', f'{round(a*FPS)/FPS:.4f}', '-t', f'{d:.4f}', '-i', V]
    fil.append(f'[{i}:a]aresample=48000,afade=t=in:d=0.02,afade=t=out:st={d-0.03:.3f}:d=0.03,apad=whole_dur={d:.4f},atrim=0:{d:.4f}[a{i}]')
k = len(segs)
inp += ['-ss', '168.9', '-t', f'{END}', '-i', V]
fil.append(f'[{k}:a]aresample=48000,afade=t=in:d=0.02,afade=t=out:st={END-1.6}:d=1.6,apad=whole_dur={END},atrim=0:{END}[a{k}]')
fil.append(''.join(f'[a{i}]' for i in range(k+1)) + f'concat=n={k+1}:v=0:a=1,alimiter=limit=0.89[o]')
run('ffmpeg', '-v', 'error', '-y', *inp, '-filter_complex', ';'.join(fil), '-map', '[o]', '-c:a', 'aac', '-b:a', '256k', 'out/audio.m4a')

# ---------- captions (ASS) ----------
S = {'cozinha': 0, 'invasao': 23.6, 'coleta': 46.8, 'sobrou': 71.0, 'noite': 107.0, 'rua': 130.6, 'voz': 149.4}
INI = {"cozinha": 0.6, "invasao": 0.3, "coleta": 0.2, "sobrou": 0.5, "noite": 0.5, "rua": 0.4, "voz": 0.3}
ids = ['cozinha', 'invasao', 'coleta', 'sobrou', 'noite', 'rua', 'voz']
words = []
for ci, seg in enumerate(json.load(open(f'{EP}/audio/palavras.json'))):
    off = S[ids[ci]] + INI[ids[ci]]
    words += [(off + a, off + b, w) for a, b, w in seg]
def ts(t):
    t = max(0, t); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f'{h}:{m:02d}:{s:05.2f}'
ev = []
BLUE = r'{\c&HFFD38F&}'; WHITE = r'{\c&HFFFFFF&}'
for i, (a, b) in enumerate(segs):
    ws = [w for w in words if w[0] >= a - 0.05 and w[1] <= b + 0.05]
    to = lambda t: starts[i] + (t - a)
    chunks, cur = [], []
    for w in ws:
        cur.append(w)
        txt = ' '.join(x[2] for x in cur)
        if w[2][-1] in '.,:?!"…' or len(cur) >= 3 or len(txt) >= 15:
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    for j, ch in enumerate(chunks):
        c_end = min(ch[-1][1] + 0.35, chunks[j+1][0][0] if j + 1 < len(chunks) else b, b)
        for k2, w in enumerate(ch):
            t0 = w[0] if k2 else ch[0][0]
            t1 = ch[k2+1][0] if k2 + 1 < len(ch) else c_end
            parts = [(BLUE if m == k2 else WHITE) + x[2].upper().replace('"', '') for m, x in enumerate(ch)]
            pop = r'{\fscx112\fscy112\t(0,90,\fscx100\fscy100)}' if k2 == 0 else ''
            ev.append(f'Dialogue: 1,{ts(to(t0))},{ts(to(t1))},Cap,,0,0,0,,{pop}' + ' '.join(parts))
# title on top (fades out while the film's own title shows: seg 4)
t4a, t4b = starts[3], starts[3] + durs[3]
for (x0, x1, fi, fo) in [(0, t4a, 0, 250), (t4b, starts[-1] + durs[-1], 250, 300)]:
    ev.append(f'Dialogue: 0,{ts(x0)},{ts(x1)},Title,,0,0,0,,{{\\fad({fi},{fo})}}OS QUE FICARAM')
    ev.append(f'Dialogue: 0,{ts(x0)},{ts(x1)},Sub,,0,0,0,,{{\\fad({fi},{fo})}}RESUMO  ·  EPISÓDIO 1  ·  A METADE')
# end card
e0 = starts[-1] + durs[-1]
ev.append(f'Dialogue: 0,{ts(e0+0.15)},{ts(TOTAL)},End1,,0,0,0,,{{\\fad(400,0)\\blur2\\t(0,500,\\blur0)}}QUEM ESTÁ\\NNA PORTA?')
ev.append(f'Dialogue: 0,{ts(e0+0.9)},{ts(TOTAL)},End2,,0,0,0,,{{\\fad(400,0)}}EPISÓDIO 1 COMPLETO NO CANAL')
ev.append(f'Dialogue: 0,{ts(e0+1.4)},{ts(TOTAL)},End3,,0,0,0,,{{\\fad(400,0)}}Comenta: você abriria a porta?')
ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,Anton,92,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,1,0,1,7,3,2,60,60,400,1
Style: Title,Anton,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,3,0,1,0,4,8,40,40,120,1
Style: Sub,Inter Medium,30,&H00C8B39F,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,6,0,1,0,2,8,40,40,236,1
Style: End1,Anton,150,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,5,60,60,0,1
Style: End2,Inter Medium,40,&H00FFD38F,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,4,0,1,0,0,2,60,60,640,1
Style: End3,Inter,38,&H00C8B39F,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,60,60,570,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + '\n'.join(ev) + '\n'
open('out/legendas.ass', 'w').write(ass)
run('ffmpeg', '-v', 'error', '-y', '-i', 'out/video.mp4', '-i', 'out/audio.m4a', '-vf', 'ass=out/legendas.ass:fontsdir=fonts',
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'slow', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
    '-c:a', 'copy', '-movflags', '+faststart', '-shortest', 'out/short.mp4')
print('TOTAL', TOTAL)
