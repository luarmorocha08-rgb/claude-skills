# Mixagem do EP2: narração neutra + efeitos (tempos escritos no tempo original das cenas e convertidos pela sincronia)
import json, subprocess
m = json.load(open('../motion.json')); W = json.load(open('sincronia.json'))
ordem = [c['id'] for c in m['cenas']]; dur = {c['id']: c['dur'] for c in m['cenas']}
ini = {}; acc = 0
for c in ordem: ini[c] = acc; acc += dur[c]
TOTAL = round(acc, 2)
def novo(cena, t):  # tempo original -> tempo novo
    w = W.get(cena)
    if not w: return t
    for i in range(1, len(w)):
        if t <= w[i][1] or i == len(w) - 1:
            (n0, o0), (n1, o1) = w[i - 1], w[i]
            return n0 + (t - o0) * (n1 - n0) / max(1e-6, o1 - o0)
X = lambda c, t: ini[c] + novo(c, t)
f = dict(noite='sfx/Silent_suburban_night_in.mp3', mac='sfx/Door_handle_slowly_turni.mp3', feixe='sfx/Alien_tractor_beam_power.mp3', carro='sfx/Driverless_car_crashing_.mp3',
  alarme='sfx/synth_alarme.wav', maq='sfx/Giant_alien_walking_mach.mp3', tit='sfx/Cinematic_title_reveal__.mp3', manha='sfx/Quiet_suburban_kitchen_m.mp3', torn='sfx/Kitchen_faucet_handle_tu.mp3',
  vib='sfx/Smartphone_vibrating_onc.mp3', faisca='sfx/synth_faiscas.wav', merc='sfx/synth_mercado.wav', queda='sfx/Person_diving_and_landin.mp3', barra='sfx/synth_barra.wav',
  click='sfx/Single_flashlight_button.mp3', xic='sfx/Ceramic_coffee_mug_falli.mp3', rasgo='sfx/synth_rasgo.wav', radio='sfx/synth_radio.wav')
E = [  # (arquivo, cena, t original, corte, duração, dB, fade-in, fade-out)
  ('noite', 'porta', 0, 0, 22, -18, 0.5, 1), ('noite', 'porta', 21.5, 2, 5.4, -18, 0.5, 0.5),
  ('mac', 'porta', 0.3, 0, 1.2, -9, 0, 0.3), ('feixe', 'porta', 3.0, 0, 6, -24, 1, 1), ('mac', 'porta', 7.0, 0.2, 0.8, -14, 0, 0.3),
  ('carro', 'porta', 13.5, 0, 1.4, -6, 0, 0.4), ('alarme', 'porta', 14.9, 0, 6.18, -11, 0.05, 2.0), ('mac', 'porta', 17.3, 0.6, 0.5, -10, 0, 0.1),
  ('maq', 'porta', 18.8, 4, 5.0, -12, 0.3, 2.0),
  ('tit', 'abertura', 0, 0, 5, -7, 0, 1),
  ('manha', 'comida', 0, 3, 12.5, -21, 1, 2),
  ('torn', 'comida', 13.55, 0, 0.85, -8, 0.02, 0.05), ('torn', 'comida', 14.5, 0.9, 0.22, -10, 0.02, 0.05), ('torn', 'comida', 14.95, 1.2, 0.18, -11, 0.02, 0.05),
  ('torn', 'comida', 15.45, 1.5, 0.16, -13, 0.02, 0.05), ('torn', 'comida', 15.9, 1.8, 0.12, -16, 0.02, 0.05),
  ('vib', 'saida', 2.9, 0, 0.4, -12, 0, 0.1), ('mac', 'saida', 10.9, 0, 1.3, -8, 0, 0.3), ('manha', 'saida', 11.3, 5, 10.5, -22, 0.5, 1.5), ('faisca', 'saida', 14.0, 0, 2.2, -9, 0.05, 0.3),
  ('merc', 'mercado', 3.4, 0, 25.3, -13, 0.6, 0.6), ('queda', 'mercado', 11.1, 0, 0.5, -16, 0, 0.2),
  ('merc', 'deposito', 0, 2, 4.6, -14, 0, 0.6), ('queda', 'deposito', 1.6, 0, 0.6, -13, 0, 0.2), ('queda', 'deposito', 2.5, 0, 0.6, -13, 0, 0.2), ('queda', 'deposito', 3.4, 0, 0.6, -13, 0, 0.2),
  ('click', 'deposito', 4.6, 0, 0.5, -8, 0, 0.1), ('noite', 'deposito', 4.6, 6, 15, -23, 0.5, 1), ('barra', 'deposito', 11.6, 0, 1.6, -5, 0, 0.3),
  ('merc', 'barulho', 0, 5, 14, -14, 0.3, 0.8), ('xic', 'barulho', 4.95, 0, 1.5, -3, 0, 0.3), ('carro', 'barulho', 5.3, 0, 1.2, -8, 0, 0.4),
  ('maq', 'barulho', 8.6, 0, 14.5, -8, 1.2, 1.5), ('feixe', 'barulho', 16.4, 0, 3.4, -12, 0.3, 0.5), ('rasgo', 'barulho', 23.5, 0, 2.5, -5, 0.05, 0.05),
  ('mac', 'tras', 9.4, 0.6, 0.6, -8, 0, 0.1), ('queda', 'tras', 9.6, 0, 0.6, -12, 0, 0.2), ('manha', 'tras', 10.9, 2, 10.9, -22, 0.5, 1.5),
  ('noite', 'noite', 0, 0, 22, -19, 0.8, 0.5), ('noite', 'noite', 21.5, 3, 16, -19, 0.5, 1.5),
  ('radio', 'noite', 13.7, 0, 8, -12, 0.2, 0.5), ('radio', 'noite', 21.7, 4, 4, -19, 0.2, 1.0),
  ('tit', 'noite', 38.2, 0, 4, -11, 0, 1.2),
]
inp, fil = [], []
for i, (k, c, t, ss, d, db, fi, fo) in enumerate(E):
    t0 = max(0, X(c, t)); inp += ['-ss', str(ss), '-t', str(d), '-i', f[k]]
    ch = f'[{i}]aformat=sample_rates=48000:channel_layouts=stereo,volume={db}dB'
    if fi: ch += f',afade=t=in:d={fi}'
    if fo: ch += f',afade=t=out:st={max(0, d - fo):.3f}:d={fo}'
    fil.append(ch + f',adelay={int(t0 * 1000)}|{int(t0 * 1000)}[s{i}]')
n = len(E)
for j, c in enumerate(['porta', 'comida', 'saida', 'mercado', 'deposito', 'barulho', 'tras', 'noite']):
    inp += ['-i', f'c{j + 1}n.mp3']; d = int((ini[c] + 0.4) * 1000)
    fil.append(f'[{n + j}]aformat=sample_rates=48000:channel_layouts=stereo,adelay={d}|{d}[v{j}]')
fil.append(''.join(f'[v{j}]' for j in range(8)) + f'amix=inputs=8:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[narr]')
fil.append(''.join(f'[s{i}]' for i in range(n)) + f'amix=inputs={n}:normalize=0,apad=whole_dur={TOTAL},atrim=0:{TOTAL}[fx]')
fil.append('[narr][fx]amix=inputs=2:normalize=0,alimiter=limit=0.89,loudnorm=I=-14:TP=-1.5:LRA=11[o]')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fil), '-map', '[o]', '-ar', '48000', '-b:a', '256k', 'trilha-youtube.m4a'], check=True)
print('ok', TOTAL)
