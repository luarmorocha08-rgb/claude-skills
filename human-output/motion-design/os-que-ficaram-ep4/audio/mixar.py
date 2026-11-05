# Mixagem do EP4: narração (narr/cXX.mp3, entra 0,5 s após o início de cada cena) + voz de Mauro pelo rádio + efeitos.
# Efeitos: só os sons já usados nos EPs 1–3 (sfx/). Tempos por frase em roteiro/tempos.json (medidos na voz real).
# Uso: python3 mixar.py            -> trilha-youtube.m4a (voz + efeitos, efeitos abaixam sob a voz)
#      python3 mixar.py --sem-voz  -> trilha-sfx.m4a (só efeitos)
import json, os, subprocess, sys
m = json.load(open('../motion.json')); T = json.load(open('../roteiro/tempos.json'))['cenas']
ordem = [c['id'] for c in m['cenas']]; dur = {c['id']: c['dur'] for c in m['cenas']}
ini = {}; acc = 0
for c in ordem: ini[c] = acc; acc += dur[c]
TOTAL = round(acc, 2)
def X(c, i, off=0): return ini[c] + (T[c]['frases'][i][0] if i is not None else 0) + off
s = lambda n: 'sfx/' + n
f = dict(manha=s('Quiet_suburban_kitchen_m.mp3'), noite=s('Silent_suburban_night_in.mp3'), radio=s('synth_radio.wav'), vento=s('synth_vento.wav'),
  drone=s('synth_drone.wav'), vozes=s('synth_vozes.wav'), agua=s('synth_agua.wav'), vidro=s('synth_vidro.wav'), papel=s('synth_papel.wav'),
  pancada=s('synth_pancada.wav'), mac=s('Door_handle_slowly_turni.mp3'), tit=s('Cinematic_title_reveal__.mp3'), queda=s('Person_diving_and_landin.mp3'),
  barra=s('synth_barra.wav'), torn=s('Kitchen_faucet_handle_tu.mp3'), click=s('Single_flashlight_button.mp3'), xic=s('Ceramic_coffee_mug_falli.mp3'),
  mangueira=s('Garden_hose_spraying_wat.mp3'), bate=s('Three_slow_heavy_knocks_.mp3'), batida=s('Driverless_car_crashing_.mp3'), motor=s('Driverless_car_rolling_s.mp3'),
  apagao=s('Power_outage_in_a_house_.mp3'), faisca=s('synth_faiscas.wav'))
LOOP = {'manha', 'noite', 'vento', 'drone', 'vozes', 'agua'}
D = dur; L23 = T['c23']['frases'][18][1]
E = [  # (som, cena, frase|None, desloc, corte, duração, dB, fade-in, fade-out)
  # c01 — amanhecer na escola, torneira, fila
  ('vozes', 'c01', None, 0, 0, D['c01'], -30, 1, 1.5), ('agua', 'c01', 0, 0, 0, T['c01']['frases'][1][0] + 1.2 - T['c01']['frases'][0][0], -22, 0.3, 0.3),
  ('torn', 'c01', 1, 1.0, 0, 0.8, -14, 0, 0.1), ('xic', 'c01', 2, 0.6, 9, 0.4, -24, 0, 0.2), ('papel', 'c01', 7, 0.4, 0, 1.2, -18, 0, 0.3), ('papel', 'c01', 10, 1.8, 0, 1.2, -20, 0, 0.3),
  ('tit', 'abertura', None, 0, 0, 5, -7, 0, 1),
  # c02 — a mesa, o mapa
  ('vozes', 'c02', None, 0, 10, D['c02'], -32, 0.5, 1), ('queda', 'c02', 1, 0.1, 0, 0.5, -22, 0, 0.2), ('queda', 'c02', 1, 1.0, 0, 0.5, -22, 0, 0.2), ('barra', 'c02', 2, 0.9, 0, 0.8, -20, 0, 0.3),
  ('papel', 'c02', 4, 0, 0, 1.2, -16, 0, 0.3), ('drone', 'c02', 9, 0, 0, D['c02'] - T['c02']['frases'][9][0], -22, 1.5, 1),
  # c03 — rua do ponto, a barreira
  ('vento', 'c03', None, 0, 0, D['c03'], -24, 1, 1.5), ('papel', 'c03', 6, 0.3, 0, 1.2, -19, 0, 0.3), ('drone', 'c03', 10, 0, 5, D['c03'] - T['c03']['frases'][10][0], -20, 2, 0.5),
  # c04 — a luz azul
  ('vento', 'c04', None, 0, 10, D['c04'], -25, 0.5, 1), ('drone', 'c04', 0, 0, 0, D['c04'], -17, 1, 1), ('queda', 'c04', 3, 0.1, 0, 0.6, -18, 0, 0.2),
  ('click', 'c04', 7, 0.4, 0, 0.6, -20, 0, 0.1), ('click', 'c04', 7, 1.2, 0, 0.6, -22, 0, 0.1), ('click', 'c04', 11, 0.6, 0, 0.6, -18, 0, 0.1),
  ('bate', 'c04', 15, 0.6, 0, 0.75, -14, 0, 0.1), ('bate', 'c04', 16, -0.2, 0.85, 0.75, -14, 0, 0.1),
  # c05..c07 — o cruzamento
  ('vento', 'c05', None, 0, 20, D['c05'], -26, 0.5, 1), ('drone', 'c05', 6, 0, 10, D['c05'] - T['c05']['frases'][6][0], -22, 2, 1),
  *[('queda', 'c05', 5, 1.5 + k * 0.25, 0, 0.5, -20, 0, 0.2) for k in range(3)],
  ('vento', 'c06', None, 0, 30, D['c06'], -26, 0.5, 1), ('xic', 'c06', 0, 0.6, 9, 0.4, -18, 0, 0.2), ('xic', 'c06', 0, 0.9, 9.2, 0.4, -20, 0, 0.2), ('queda', 'c06', 1, 0.5, 0, 0.4, -22, 0, 0.2),
  ('drone', 'c06', 10, 0, 20, D['c06'] - T['c06']['frases'][10][0], -21, 1.5, 1), ('barra', 'c06', 16, 0.2, 0, 0.6, -22, 0, 0.2),
  ('vento', 'c07', None, 0, 40, D['c07'], -26, 0.5, 1), ('barra', 'c07', 2, 0.6, 0, 0.8, -20, 0, 0.3), ('drone', 'c07', 12, 0, 0, D['c07'] - T['c07']['frases'][12][0], -21, 1, 1),
  # c08..c09 — a farmácia por dentro
  ('vozes', 'c08', None, 0, 20, D['c08'], -31, 0.5, 0.5), ('agua', 'c08', 11, 0.2, 2, 1.6, -22, 0.1, 0.3),
  ('vozes', 'c09', None, 0, 30, T['c09']['frases'][8][0], -31, 0.5, 0.5), ('papel', 'c09', 2, 0.7, 0, 1.2, -18, 0, 0.3),
  ('batida', 'c09', 8, 0.6, 0, 1.6, -14, 0, 0.6), ('vento', 'c09', 8, 0, 0, T['c09']['frases'][11][0] - T['c09']['frases'][8][0], -26, 0.5, 0.5),
  ('drone', 'c09', 12, 0, 30, D['c09'] - T['c09']['frases'][12][0], -21, 1.5, 1),
  # c10..c11 — o mapa, a bolsa de Léo
  ('vento', 'c10', 1, 0, 0, D['c10'] - T['c10']['frases'][1][0], -26, 0.3, 1), ('papel', 'c10', 1, 0.2, 0, 1.2, -16, 0, 0.3), ('papel', 'c10', 14, 0.3, 0, 1.2, -14, 0, 0.3),
  ('drone', 'c10', 3, 0, 0, D['c10'] - T['c10']['frases'][3][0], -20, 1.5, 1),
  ('vento', 'c11', None, 0, 10, D['c11'], -26, 0.5, 1), ('drone', 'c11', 2, 0, 15, D['c11'] - T['c11']['frases'][2][0], -18, 1, 1),
  ('pancada', 'c11', 6, 0.1, 0, 0.5, -8, 0, 0.1), ('batida', 'c11', 7, -0.2, 0.5, 0.9, -14, 0, 0.4), ('barra', 'c11', 8, -0.1, 0, 0.8, -12, 0, 0.3), ('vidro', 'c11', 8, 0.2, 0, 0.4, -16, 0, 0.1),
  # c12..c13 — o segredo, a corrente
  ('vento', 'c12', None, 0, 20, D['c12'], -27, 0.5, 1), ('mac', 'c12', 13, 0.1, 0, 0.8, -16, 0, 0.2), ('papel', 'c12', 13, 0.4, 0, 1.0, -18, 0, 0.3),
  ('vento', 'c13', None, 0, 30, D['c13'], -27, 0.5, 1), ('mac', 'c13', 0, 0.4, 0, 1.4, -12, 0, 0.3), ('barra', 'c13', 0, 1.6, 0, 1.0, -18, 0, 0.4),
  ('drone', 'c13', 12, 0, 0, D['c13'] - T['c13']['frases'][12][0], -17, 0.3, 1), ('pancada', 'c13', 13, 0, 0, 0.5, -14, 0, 0.1),
  # c14..c16 — o impasse
  ('vento', 'c14', None, 0, 40, D['c14'], -27, 0.5, 1), ('drone', 'c14', None, 0, 20, D['c14'], -20, 1, 1),
  ('vento', 'c15', None, 0, 0, D['c15'], -27, 0.5, 1), ('drone', 'c15', 3, 0, 30, D['c15'] - T['c15']['frases'][3][0], -18, 1, 1),
  ('queda', 'c15', 7, 0.6, 0, 0.5, -20, 0, 0.2), ('queda', 'c15', 8, 1.2, 0, 0.5, -22, 0, 0.2), ('queda', 'c15', 9, 1.2, 0, 0.5, -22, 0, 0.2),
  ('vento', 'c16', None, 0, 10, D['c16'], -27, 0.5, 1), ('drone', 'c16', None, 0, 40, T['c16']['frases'][10][0], -20, 1, 2), ('mac', 'c16', 5, 0.5, 1.2, 0.8, -16, 0, 0.2), ('mac', 'c16', 17, 0.3, 1.2, 0.8, -16, 0, 0.2),
  # c17..c18 — água, carro empurrado, motor
  ('vento', 'c17', None, 0, 20, D['c17'], -27, 0.5, 1), ('mangueira', 'c17', 0, 0, 0, 5, -20, 0.3, 0.5), ('agua', 'c17', 0, 0, 0, T['c17']['frases'][6][0] - T['c17']['frases'][0][0], -23, 0.5, 1),
  ('motor', 'c17', 9, 0.6, 0, 2.0, -18, 0.3, 0.5), ('motor', 'c17', 10, 0, 0, 2.0, -19, 0.3, 0.8), ('drone', 'c17', 14, 0, 0, D['c17'] - T['c17']['frases'][14][0], -20, 1, 0.3),
  ('mac', 'c18', 0, -0.3, 0, 0.7, -16, 0, 0.1), ('motor', 'c18', 0, 0.1, 0, 0.9, -16, 0.05, 0.5),
  ('mac', 'c18', 1, -0.3, 0, 0.7, -16, 0, 0.1), ('motor', 'c18', 1, 0.2, 0, 2.0, -10, 0.05, 0.3), ('motor', 'c18', 1, 1.9, 0.3, 1.6, -11, 0.2, 0.3),
  ('drone', 'c18', 1, 0.8, 0, D['c18'] - T['c18']['frases'][1][0] - 0.8, -12, 0.8, 1.5), ('vento', 'c18', None, 0, 30, D['c18'], -26, 0.5, 1),
  # c19..c20 — a escola
  ('vento', 'c19', None, 0, 0, D['c19'], -27, 0.5, 1), ('drone', 'c19', None, 0, 0, T['c19']['frases'][1][0], -18, 0.3, 1.5), ('vozes', 'c19', 1, 0, 0, D['c19'] - T['c19']['frases'][1][0], -30, 1.5, 1),
  ('motor', 'c19', 5, 0, 0, 2.0, -20, 0.5, 1), ('barra', 'c19', 11, 0.6, 0, 1.2, -14, 0, 0.4), ('barra', 'c19', 13, 0.0, 0, 1.2, -12, 0, 0.4),
  ('vozes', 'c20', None, 0, 20, D['c20'], -31, 0.5, 1), ('drone', 'c20', 12, 0, 0, D['c20'] - T['c20']['frases'][12][0], -19, 1.5, 1),
  ('papel', 'c20', 3, 0.5, 0, 1.2, -18, 0, 0.3), ('motor', 'c20', 18, 1.4, 0, 2.0, -18, 0.3, 1),
  # c21..c22 — a água chega, fim de tarde
  ('vozes', 'c21', None, 0, 40, D['c21'], -29, 0.5, 1), ('agua', 'c21', 1, 0, 0, T['c21']['frases'][5][0] - T['c21']['frases'][1][0], -22, 0.5, 1), ('torn', 'c21', 3, 0, 0, 0.8, -14, 0, 0.1),
  ('vozes', 'c22', None, 0, 50, D['c22'], -32, 1, 1.5), ('xic', 'c22', 10, 0.8, 9, 0.4, -26, 0, 0.2),
  # c23 — a lista, o rádio, as luzes
  ('noite', 'c23', None, 0, 0, T['c23']['frases'][6][0], -22, 1, 1), ('xic', 'c23', 0, 0.6, 9, 0.4, -22, 0, 0.2), ('xic', 'c23', 13, 0.1, 9.2, 0.5, -15, 0, 0.3),
  ('drone', 'c23', 7, 0, 0, L23 + 4.4 - T['c23']['frases'][7][0], -18, 2, 1), ('radio', 'c23', 7, 0, 0, L23 + 5 - T['c23']['frases'][7][0], -30, 1, 0.5),
  ('radio', 'c23', 18, 0.8, 2, 3.8, -18, 0.2, 0.6),
  *[('click', 'c23', 18, 5.0 + 1.0 + i * 0.55, 0, 0.5, -16, 0, 0.1) for i in range(6)], ('apagao', 'c23', 18, 5.0 + 3.6, 0, 1.5, -14, 0, 0.5),
  ('tit', 'c23', 18, 5.0 + 4.4 + 0.8, 0, 5, -8, 0, 1.2),
]
inp, fil = [], []
for i, (k, c, fr, off, ss, d, db, fi, fo) in enumerate(E):
    t0 = max(0, X(c, fr, off)); d = max(0.1, d)
    inp += (['-stream_loop', '-1'] if k in LOOP else []) + ['-ss', str(ss), '-t', f'{d:.3f}', '-i', f[k]]
    ch = f'[{i}]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{d:.3f},volume={db}dB'
    if fi: ch += f',afade=t=in:d={min(fi, d / 2)}'
    if fo: ch += f',afade=t=out:st={max(0, d - fo):.3f}:d={min(fo, d)}'
    fil.append(ch + f',adelay={int(t0 * 1000)}|{int(t0 * 1000)}[s{i}]')
n = len(E)
args = [a for a in sys.argv[1:] if not a.startswith('--')]
sem_voz = '--sem-voz' in sys.argv
fx = ''.join(f'[s{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}'
if sem_voz:
    fil.append(fx + ',alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[o]')
else:
    vozes = [(f'narr/{c}.mp3', ini[c] + 0.5, 0) for c in ordem if c.startswith('c') and os.path.exists(f'narr/{c}.mp3')]
    vozes.append(('narr/mauro-radio.wav', ini['c23'] + L23 + 1.5 - 0.35, 2))  # voz de Mauro pelo rádio (+2 dB)
    faltam = [c for c in ordem if c.startswith('c') and not os.path.exists(f'narr/{c}.mp3')]
    if faltam: print('AVISO: sem narração em', faltam)
    for j, (arq, t, g) in enumerate(vozes):
        inp += ['-i', arq]; d = int(t * 1000)
        fil.append(f'[{n + j}]aformat=sample_rates=48000:channel_layouts=stereo,volume={g}dB,adelay={d}|{d}[v{j}]')
    fil.append(''.join(f'[v{j}]' for j in range(len(vozes))) + f'amix=inputs={len(vozes)}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL},asplit=2[narr][chave]')
    fil.append(fx + '[fx]')
    fil.append('[fx][chave]sidechaincompress=threshold=0.03:ratio=4:attack=30:release=400:makeup=1[fxd]')
    fil.append('[narr][fxd]amix=inputs=2:normalize=0,alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[o]')
saida = args[0] if args else ('trilha-sfx.m4a' if sem_voz else 'trilha-youtube.m4a')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fil), '-map', '[o]', '-ar', '48000', '-b:a', '256k', saida], check=True)
print('ok', TOTAL, n, 'eventos', saida)
