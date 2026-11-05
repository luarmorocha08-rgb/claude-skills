# Gera a legenda .srt do EP4 a partir de motion.json (ordem/durações) e roteiro/tempos.json (frases).
import json, os, sys, textwrap
AQUI = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(AQUI)
m = json.load(open(f'{P}/motion.json')); T = json.load(open(f'{P}/roteiro/tempos.json'))['cenas']
def ts(x): h = int(x // 3600); mi = int(x % 3600 // 60); s = x % 60; return f'{h:02d}:{mi:02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}'.replace(',1000', ',999')
out = []; t0 = 0; n = 0
for c in m['cenas']:
    if c['id'] in T:
        fr = T[c['id']]['frases']
        for k, (a, b, txt) in enumerate(fr):
            fim = min(b + 0.35, fr[k + 1][0] - 0.05) if k + 1 < len(fr) else b + 0.6
            n += 1; out.append(f'{n}\n{ts(t0 + a)} --> {ts(t0 + fim)}\n' + '\n'.join(textwrap.wrap(txt, 42)) + '\n')
        if c['id'] == 'c23':
            L = fr[-1][1]; n += 1; out.append(f'{n}\n{ts(t0 + L + 1.5)} --> {ts(t0 + L + 4.4)}\n(MAURO, PELO RÁDIO) Espera apagar a última luz.\n')
    t0 += c['dur']
open(sys.argv[1], 'w').write('\n'.join(out)); print(n, 'legendas', sys.argv[1])
