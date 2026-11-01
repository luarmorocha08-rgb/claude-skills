# Monta a trilha (voz + efeitos do ElevenLabs) nos tempos do filme e junta ao MP4.
import subprocess, sys
B = 'audio/brutos/'
VIDEO, SAIDA, DUR = sys.argv[1], sys.argv[2], 20.5
ATEMPO = 1.12
voz = [('IEJ1uMJmBV20rptlNROF', 1.15, 0.12), ('hmzuma4PMn7zlXyupfzL', 4.65, 0), ('zZ7NvjDxbYB6wwnk3ki1', 7.80, 0),
       ('Z7z8quu510DzhLqpjstT', 11.25, 0), ('Z6A98FhZOfF6Fc2mJjRD', 16.05, 0)]
WH, BOOM, BOOM2, BEAT, TICK, SWELL, SNAP = 'zm4I9k5KxSa3XNOaIh4V', 'q15VlyvjpYcmgGLdeOnw', 'zH1ugmJPRMsTnbqqsaoF', 'XxcHFvVjLCCSpYCl3l8l', '9jFudLCKW7a7iD1DuX3L', 'nl66q5zLZdyAFZAg7mSS', 'MUAoRA6YbYGvHnF8ag7G'
fx = []  # (arquivo, tempo, volume, filtro extra)
fx += [(WH, 0.0, 0.55, 'atrim=start=0.05'), (BOOM, 0.40, 0.9, '')]
batidas = [1.0, 1.75, 2.35, 2.85, 3.25, 3.58, 3.85, 4.08, 4.28]
fx += [(BEAT, t, 0.3 + 0.06 * i, 'atrim=end=0.55,afade=t=out:st=0.4:d=0.15') for i, t in enumerate(batidas)]
fx += [(TICK, t - 0.44, 0.3, '') for t in (1, 2, 3, 4)]
fx += [(SWELL, 7.45, 0.5, ''), (WH, 9.05, 0.45, 'areverse')]
for hit in (11.32, 12.92, 14.52):
    fx += [(SNAP, hit, 0.75, ''), (BOOM, hit, 0.35, '')]
fx += [(WH, t, 0.3, '') for t in (12.32, 13.92, 15.72)]
fx += [(WH, 16.05, 0.45, ''), (BOOM2, 17.0, 1.0, ''), (SNAP, 17.0, 0.8, ''), (BEAT, 19.5, 0.3, 'atrim=end=0.55')]

entradas, filtros, rot = ['-i', VIDEO], [], []
for i, (f, t, k) in enumerate(voz):
    entradas += ['-i', B + f + '.mp3']
    filtros.append(f'[{i+1}:a]atrim=start={k},asetpts=PTS-STARTPTS,atempo={ATEMPO},volume=1.0,adelay={int(t*1000)}:all=1[v{i}]')
    rot.append(f'[v{i}]')
base = len(voz) + 1
for j, (f, t, vol, extra) in enumerate(fx):
    entradas += ['-i', B + f + '.mp3']
    ex = (extra + ',') if extra else ''
    ini = max(0, t)
    filtros.append(f'[{base+j}:a]{ex}asetpts=PTS-STARTPTS,volume={vol},adelay={int(ini*1000)}:all=1[f{j}]')
    rot.append(f'[f{j}]')
n = len(rot)
filtros.append(f'{"".join(rot)}amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=end={DUR},afade=t=out:st={DUR-0.3}:d=0.3,loudnorm=I=-14:TP=-1.5:LRA=11[a]')
cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + entradas + ['-filter_complex', ';'.join(filtros), '-map', '0:v', '-map', '[a]',
       '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', SAIDA]
subprocess.run(cmd, check=True)
print('ok', SAIDA)
