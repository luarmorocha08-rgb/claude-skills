# Mede o tempo de cada frase na narração real (audio/narr/cXX.mp3) e grava roteiro/tempos.json.
# Silêncios (silencedetect) viram candidatos de fronteira; a escolha entre eles é feita por programação
# dinâmica, comparando com a posição esperada pela contagem de caracteres. Cenas sem áudio ficam estimadas.
import json, os, re, subprocess, sys
AQUI = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(AQUI)
txt = open(f'{P}/roteiro/narracao.txt').read()
blocos = {}; cur = None
for l in txt.split('\n'):
    if l.startswith('## '): cur = l[3:].strip(); blocos[cur] = []
    elif l.strip() and cur: blocos[cur].append(l.strip())
OFF, CAUDA = 0.5, 1.2
def silencios(f, nz=-38, d=0.18):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', f'silencedetect=noise={nz}dB:d={d}', '-f', 'null', '-'], capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r)]; fim = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r)]
    dur = float(re.search(r'Duration: (\d+):(\d+):([\d.]+)', r).groups()[2]) + 60 * float(re.search(r'Duration: (\d+):(\d+)', r).groups()[1])
    return list(zip(ini, fim)), dur
def medir(frases, f):
    S, dur = silencios(f, -33, 0.07)
    fala_ini = S[0][1] if S and S[0][0] < 0.05 else 0.0
    fala_fim = S[-1][0] if S and S[-1][1] >= dur - 0.05 else dur
    cand = [(a, b) for a, b in S if a > fala_ini + 0.1 and b < fala_fim - 0.1]
    # fronteiras "virtuais" (sem pausa audível), com penalidade, para quando o narrador emenda duas frases
    t = fala_ini + 0.3
    while t < fala_fim - 0.3: cand.append((t, t)); t += 0.1
    cand.sort()
    n = len(frases); m = len(cand); INF = 1e18
    taxa = (fala_fim - fala_ini - 0.42 * (n - 1)) / sum(len(x) for x in frases)
    exp = [max(0.3, len(x) * taxa) for x in frases]
    def custo(d, e): return 3.0 * (d - e) ** 2 / e if d > 0.15 else INF
    def bon(i): g = cand[i][1] - cand[i][0]; return 2.5 if g == 0 else -3.0 * min(g, 0.6)
    best = [[INF] * m for _ in range(n - 1)]; prev = [[-1] * m for _ in range(n - 1)]
    for j in range(n - 1):
        for i in range(m):
            if j == 0: best[j][i] = custo(cand[i][0] - fala_ini, exp[0]) + bon(i); continue
            bi = INF; pk = -1; ai = cand[i][0]
            for k in range(i):
                bk = best[j - 1][k]
                if bk >= INF: continue
                c = bk + custo(ai - cand[k][1], exp[j])
                if c < bi: bi = c; pk = k
            if pk >= 0: best[j][i] = bi + bon(i); prev[j][i] = pk
    i = min(range(m), key=lambda i: best[n - 2][i] + custo(fala_fim - cand[i][1], exp[n - 1])); esc = []
    for j in range(n - 2, -1, -1): esc.append(i); i = prev[j][i]
    esc = esc[::-1]; out = []; ini = fala_ini; virt = 0
    for j in range(n):
        fim = cand[esc[j]][0] if j < n - 1 else fala_fim
        out.append([round(ini + OFF, 2), round(fim + OFF, 2), frases[j]])
        if j < n - 1: ini = cand[esc[j]][1]; virt += cand[esc[j]][1] == cand[esc[j]][0]
    return out, f'{len(S)} pausas, {virt} virtuais'
res = {}; spc = []; pausas = []
for c, fr in blocos.items():
    f = f'{P}/audio/narr/{c}.mp3'
    if os.path.exists(f):
        o, nc = medir(fr, f); res[c] = {'frases': o, 'dur': round(o[-1][1] + CAUDA, 2)}
        for a, b, t in o: spc.append((b - a) / len(t))
        pausas += [o[k + 1][0] - o[k][1] for k in range(len(o) - 1)]
        print(c, len(fr), 'cand', nc, 'dur', res[c]['dur'])
s = sorted(spc)[len(spc) // 2]; pz = sum(pausas) / len(pausas)
for c, fr in blocos.items():
    if c in res: continue
    t = OFF; o = []
    for x in fr: d = len(x) * s; o.append([round(t, 2), round(t + d, 2), x]); t += d + pz
    res[c] = {'frases': o, 'dur': round(o[-1][1] + CAUDA, 2), 'estimado': True}; print(c, 'ESTIMADO', res[c]['dur'])
json.dump({'ritmo': {'s_por_char': s, 'pausa': pz}, 'cenas': res}, open(f'{P}/roteiro/tempos.json', 'w'), ensure_ascii=False, indent=1)
print('total', round(sum(v['dur'] for v in res.values()), 1))
