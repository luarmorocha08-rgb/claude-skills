# Mixagem do EP3 (sem narração por enquanto): só efeitos e ambientes.
# Tempos marcados por frase (roteiro/tempos.json). Quando a narração real chegar,
# troque os tempos e adicione as faixas de voz; os efeitos acompanham sozinhos.
import json, subprocess, sys
m = json.load(open('../motion.json')); T = json.load(open('../roteiro/tempos.json'))['cenas']
ordem = [c['id'] for c in m['cenas']]; dur = {c['id']: c['dur'] for c in m['cenas']}
ini = {}; acc = 0
for c in ordem: ini[c] = acc; acc += dur[c]
TOTAL = round(acc, 2)
def X(c, i, off=0):
    return ini[c] + (T[c]['frases'][i][0] if i is not None else 0) + off
s = lambda n: 'sfx/' + n
f = dict(manha=s('Quiet_suburban_kitchen_m.mp3'), noite=s('Silent_suburban_night_in.mp3'), radio=s('synth_radio.wav'), vento=s('synth_vento.wav'),
  drone=s('synth_drone.wav'), vozes=s('synth_vozes.wav'), agua=s('synth_agua.wav'), vidro=s('synth_vidro.wav'), papel=s('synth_papel.wav'),
  pancada=s('synth_pancada.wav'), mac=s('Door_handle_slowly_turni.mp3'), maq=s('Giant_alien_walking_mach.mp3'), feixe=s('Alien_tractor_beam_power.mp3'),
  tit=s('Cinematic_title_reveal__.mp3'), queda=s('Person_diving_and_landin.mp3'), barra=s('synth_barra.wav'), torn=s('Kitchen_faucet_handle_tu.mp3'),
  click=s('Single_flashlight_button.mp3'), xic=s('Ceramic_coffee_mug_falli.mp3'), mangueira=s('Garden_hose_spraying_wat.mp3'), nave=s('Enormous_alien_mothershi.mp3'))
LOOP = {'manha', 'noite', 'vento', 'drone', 'vozes'}
D = dur
E = [  # (som, cena, frase|None, desloc, corte, duração, dB, fade-in, fade-out)
  # c01 — casa de manhã, rádio
  ('manha', 'c01', None, 0, 0, D['c01'], -22, 1, 1.5), ('radio', 'c01', 2, 0, 0, 8, -13, 0.2, 0.8), ('radio', 'c01', 4, 0, 4, 3, -15, 0.1, 1.5),
  ('papel', 'c01', 10, 2.5, 0, 1.2, -20, 0, 0.3),
  ('tit', 'abertura', None, 0, 0, 5, -7, 0, 1),
  # c02 — porta, rua
  ('mac', 'c02', 0, 0.2, 0, 1.2, -10, 0, 0.3), ('mac', 'c02', 1, 0.3, 0.6, 0.5, -12, 0, 0.1), ('mac', 'c02', 1, 0.9, 0.6, 0.5, -12, 0, 0.1),
  ('vento', 'c02', 3, -0.5, 0, D['c02'] - 10, -24, 1.5, 1.5),
  # c03 — avenida, máquina
  ('vento', 'c03', None, 0, 10, D['c03'], -23, 0.5, 1.5), ('drone', 'c03', 5, 0, 0, 16, -16, 2, 3),
  ('maq', 'c03', 5, 0, 0, 13, -12, 0.5, 2.5), ('feixe', 'c03', 8, 0.3, 0, 5, -14, 0.4, 0.8), ('queda', 'c03', 9, 0.3, 0, 0.6, -16, 0, 0.2),
  ('papel', 'c03', 14, 0.5, 0, 1.2, -18, 0, 0.3),
  # c04 — Léo na esquina
  ('vento', 'c04', None, 0, 20, D['c04'], -24, 0.5, 1.5), ('pancada', 'c04', 0, 0.2, 0, 0.5, -10, 0, 0.1), ('barra', 'c04', 11, 0.3, 0, 0.8, -16, 0, 0.3),
  # c05 — escada da estação, carrinho
  ('vento', 'c05', None, 0, 5, D['c05'], -25, 0.5, 1.5),
  *[('pancada', 'c05', 1, 0.6 + k * 0.9, 0, 0.5, -9, 0, 0.1) for k in range(3)], *[('pancada', 'c05', 2, k * 0.9, 0, 0.5, -8, 0, 0.1) for k in range(3)],
  ('drone', 'c05', 3, 0, 0, 12, -19, 1.5, 3), ('pancada', 'c05', 13, 0.6, 0, 0.5, -11, 0, 0.1),
  ('barra', 'c05', 14, 0.4, 0, 0.7, -10, 0, 0.2), ('queda', 'c05', 15, 0.3, 0, 0.6, -10, 0, 0.2), ('drone', 'c05', 16, 0, 10, 8, -16, 0.5, 2.5),
  # c06 — esvaziar o carrinho
  ('vento', 'c06', None, 0, 30, D['c06'], -25, 0.5, 1.5), ('agua', 'c06', 7, 0, 0, 3, -22, 0.2, 0.5), ('queda', 'c06', 10, 0, 0, 0.6, -14, 0, 0.2),
  ('papel', 'c06', 11, 2.0, 0, 1.2, -18, 0, 0.3),
  # c07 — passarela
  ('vento', 'c07', None, 0, 0, D['c07'], -21, 1, 2), ('drone', 'c07', 4, 0, 0, 44, -15, 2, 4),
  ('maq', 'c07', 6, 0, 0, 15, -14, 1, 1), ('maq', 'c07', 14, 0, 5, 10, -16, 0.5, 0.5), ('maq', 'c07', 17, 0, 10, 5, -20, 0.2, 4),
  ('feixe', 'c07', 10, 0, 0, 6, -12, 0.4, 1),
  # c08 — ponto de ônibus
  ('vento', 'c08', None, 0, 15, D['c08'], -26, 1, 1.5), ('queda', 'c08', 0, 2.5, 0, 0.6, -17, 0, 0.2), ('papel', 'c08', 2, 0.3, 0, 1.2, -19, 0, 0.3),
  # c09 — muro da escola
  ('vento', 'c09', None, 0, 40, D['c09'], -25, 0.5, 1), ('barra', 'c09', 1, 0.2, 0, 1.2, -9, 0, 0.3), ('vozes', 'c09', 6, 0, 0, D['c09'] - T['c09']['frases'][6][0], -24, 2.5, 0.5),
  ('mac', 'c09', 16, 0.2, 0, 1.3, -10, 0, 0.3),
  # c10..c13 — abrigo por dentro
  ('vozes', 'c10', None, 0, 5, D['c10'], -25, 0.3, 0.5), ('papel', 'c10', 8, 0.2, 0, 1.2, -20, 0, 0.3),
  ('vozes', 'c11', None, 0, 15, D['c11'], -26, 0.3, 0.5),
  ('vozes', 'c12', None, 0, 25, D['c12'], -25, 0.3, 0.5), ('xic', 'c12', 1, 2.0, 6, 0.6, -20, 0, 0.3), ('xic', 'c12', 5, 0.8, 9, 0.5, -20, 0, 0.3),
  ('vozes', 'c13', None, 0, 35, D['c13'], -27, 0.3, 0.5), ('torn', 'c13', 10, 1.0, 0, 0.85, -12, 0.02, 0.1), ('agua', 'c13', 11, 0, 0, 7.5, -17, 0.3, 1.0),
  # c14 — a conta da água
  ('vozes', 'c14', None, 0, 45, D['c14'], -30, 0.3, 0.5), ('torn', 'c14', 1, 0, 1.2, 0.6, -12, 0.02, 0.1), ('drone', 'c14', 10, 0, 20, 19, -20, 3, 3),
  # c15 — o mapa
  ('vozes', 'c15', None, 0, 10, D['c15'], -29, 0.3, 0.5), ('papel', 'c15', 3, 0, 0, 1.2, -16, 0, 0.3), ('papel', 'c15', 18, 0, 0, 1.2, -20, 0, 0.3),
  # c16 — quem volta
  ('vozes', 'c16', None, 0, 20, D['c16'], -30, 0.3, 0.5), ('papel', 'c16', 9, 1.5, 0, 1.2, -16, 0, 0.3), ('papel', 'c16', 13, 0.5, 0, 1.2, -19, 0, 0.3),
  # c17 — mais uma pessoa
  ('vozes', 'c17', None, 0, 30, D['c17'], -27, 0.3, 0.5), ('barra', 'c17', 0, 2.5, 0, 1.0, -14, 0, 0.3), ('mac', 'c17', 3, 0.5, 0, 1.2, -14, 0, 0.3),
  ('mangueira', 'c17', 5, 0, 1, 2.2, -24, 0.2, 0.6),
  # c18 — noite no abrigo, depois o caminhão
  ('noite', 'c18', None, 0, 0, T['c18']['frases'][10][0], -20, 1, 1), ('radio', 'c18', 2, 0, 2, 3, -22, 0.3, 1), ('xic', 'c18', 3, 0.3, 9, 0.4, -24, 0, 0.2),
  ('vento', 'c18', 10, 0, 0, 14, -22, 1, 0.1), ('drone', 'c18', 13, 0, 0, 7.5, -14, 2, 0.05),
  ('vidro', 'c18', 15, 3.2, 0, 0.4, -6, 0, 0.05), ('vidro', 'c18', 15, 3.75, 0, 0.4, -6, 0, 0.05),
  ('feixe', 'c18', 15, 5.0, 0, 1.4, -10, 0.3, 0.05),
  ('tit', 'c18', 15, 7.4, 0, 5, -8, 0, 1.2),
]
inp, fil = [], []
for i, (k, c, fr, off, ss, d, db, fi, fo) in enumerate(E):
    t0 = max(0, X(c, fr, off))
    inp += (['-stream_loop', '-1'] if k in LOOP else []) + ['-ss', str(ss), '-t', f'{d:.3f}', '-i', f[k]]
    ch = f'[{i}]aformat=sample_rates=48000:channel_layouts=stereo,atrim=0:{d:.3f},volume={db}dB'
    if fi: ch += f',afade=t=in:d={fi}'
    if fo: ch += f',afade=t=out:st={max(0, d - fo):.3f}:d={fo}'
    fil.append(ch + f',adelay={int(t0 * 1000)}|{int(t0 * 1000)}[s{i}]')
n = len(E)
fil.append(''.join(f'[s{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL},alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[o]')
saida = sys.argv[1] if len(sys.argv) > 1 else 'trilha-sfx.m4a'
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fil), '-map', '[o]', '-ar', '48000', '-b:a', '256k', saida], check=True)
print('ok', TOTAL, n, 'eventos')
