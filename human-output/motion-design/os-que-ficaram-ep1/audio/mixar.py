# Mixagem dos efeitos do EP1: (arquivo, início no filme em s, corte inicial, duração, volume dB, fade-in, fade-out)
import subprocess
S = {'cozinha': 0, 'abertura': 18.6, 'invasao': 23.6, 'coleta': 46.8, 'sobrou': 71.0, 'noite': 107.0, 'rua': 130.6, 'voz': 149.4}
X = lambda c, t: S[c] + t
f = {k: f'sfx/{v}.mp3' for k, v in dict(amb='Quiet_suburban_kitchen_m', vib='Smartphone_vibrating_onc', notif='Rapid_burst_of_many_smar', nave='Enormous_alien_mothershi',
  xic='Ceramic_coffee_mug_falli', tit='Cinematic_title_reveal__', toque='Modern_smartphone_ringto', glitch='Phone_call_breaking_up_w', feixe='Alien_tractor_beam_power',
  queda='Person_diving_and_landin', mang='Garden_hose_spraying_wat', carro='Driverless_car_crashing_', ringback='Outgoing_phone_call_ring', tv='Old_television_changing_',
  plantao='Breaking_news_TV_bulleti', luz='Power_outage_in_a_house_', torn='Kitchen_faucet_handle_tu', click='Single_flashlight_button', noite='Silent_suburban_night_in',
  maq='Giant_alien_walking_mach', toc='Three_slow_heavy_knocks_', mac='Door_handle_slowly_turni').items()}
E = [
  ('amb', 0.0, 0, 16, -15, 0.5, 2.0),
  ('vib', X('cozinha', 5.0), 0, 0.8, -6, 0, 0.1), ('vib', X('cozinha', 6.5), 0, 0.8, -6, 0, 0.1), ('vib', X('cozinha', 7.0), 0, 0.8, -6, 0, 0.1),
  ('notif', X('cozinha', 8.2), 0, 3.0, -12, 0, 0.5),
  ('nave', X('cozinha', 14.6), 0, 3.68, -12, 1.5, 0.05),
  ('xic', X('cozinha', 18.26), 0, 0.34, -2, 0, 0.05),
  ('tit', X('abertura', 0.0), 0, 5.0, -7, 0, 1.0),
  ('nave', X('invasao', 0.0), 0, 22, -8, 2.0, 0.5), ('nave', X('coleta', 0.0), 0, 21.9, -10, 0.5, 0.05),
  ('toque', X('invasao', 11.3), 0, 2.0, -9, 0, 0.1), ('toque', X('invasao', 13.3), 0, 0.5, -9, 0, 0.2),
  ('glitch', X('invasao', 17.5), 0, 2.4, -9, 0, 0.3),
  ('feixe', X('invasao', 19.9), 0, 3.3, -6, 0.5, 0.05),
  ('feixe', X('coleta', 0.0), 0, 6.0, -11, 0, 0.5), ('feixe', X('coleta', 11.8), 0, 4.0, -13, 0.3, 0.5), ('feixe', X('coleta', 18.9), 0, 3.0, -9, 0.5, 0.02),
  ('queda', X('coleta', 0.95), 0, 1.0, -5, 0, 0.2),
  ('mang', X('coleta', 1.6), 0, 4.5, -18, 0.3, 0.6),
  ('nave', X('sobrou', 1.9), 0, 2.0, -16, 0.2, 1.2),
  ('carro', X('sobrou', 2.7), 0, 1.2, -9, 0, 0.3),
  ('ringback', X('sobrou', 7.8), 0, 7.0, -12, 0, 0.3),
  ('tv', X('sobrou', 15.35), 0, 0.5, -14, 0, 0.1), ('tv', X('sobrou', 19.3), 0, 0.25, -14, 0, 0.05), ('tv', X('sobrou', 21.3), 0, 0.25, -14, 0, 0.05),
  ('tv', X('sobrou', 23.4), 0, 0.25, -14, 0, 0.05), ('tv', X('sobrou', 26.6), 0, 0.25, -14, 0, 0.05),
  ('plantao', X('sobrou', 26.7), 0, 4.0, -15, 0, 0.8),
  ('luz', X('noite', 2.1), 0, 2.0, -7, 0, 0.3),
  ('noite', X('noite', 2.5), 0, 21.1, -17, 1.0, 0.3), ('noite', X('rua', 0.0), 0, 18.8, -17, 0.3, 0.3),
  ('torn', X('noite', 3.55), 0, 2.45, -9, 0.05, 0.4),
  ('click', X('noite', 8.85), 0, 0.5, -5, 0, 0.1), ('vib', X('noite', 11.4), 0, 0.8, -7, 0, 0.1),
  ('maq', X('rua', 0.5), 0, 14.9, -7, 1.5, 0.08),
  ('click', X('rua', 11.85), 0, 0.5, -5, 0, 0.1),
  ('noite', X('voz', 0.0), 2.0, 19.0, -19, 0, 0.02),
  ('toc', X('voz', -0.1), 0.35, 1.6, -3, 0, 0.3),
  ('vib', X('voz', 7.5), 0, 0.9, -6, 0, 0.1),
  ('mac', X('voz', 17.86), 0, 1.14, -3, 0.3, 0.02),
]
inp, fil = [], []
for i, (k, t0, ss, d, db, fi, fo) in enumerate(E):
    inp += ['-ss', str(ss), '-t', str(d), '-i', f[k]]
    ch = f'[{i}]aformat=sample_rates=48000:channel_layouts=stereo,volume={db}dB'
    if fi: ch += f',afade=t=in:d={fi}'
    if fo: ch += f',afade=t=out:st={max(0, d - fo):.3f}:d={fo}'
    ch += f',adelay={int(t0 * 1000)}|{int(t0 * 1000)}[s{i}]'
    fil.append(ch)
fil.append(''.join(f'[s{i}]' for i in range(len(E))) + f'amix=inputs={len(E)}:normalize=0,apad=whole_dur=173.4,atrim=0:173.4[o]')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inp, '-filter_complex', ';'.join(fil), '-map', '[o]', '-ar', '48000', '-b:a', '192k', 'efeitos.mp3'], check=True)
# trilha final: narração na frente, efeitos por baixo, limitador para não estourar
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', 'narracao-completa.mp3', '-i', 'efeitos.mp3', '-filter_complex',
  '[0]volume=1.0[n];[1]volume=1.0[e];[n][e]amix=inputs=2:normalize=0,alimiter=limit=0.89,atrim=0:173.4[o]', '-map', '[o]', '-ar', '48000', '-b:a', '256k', 'trilha-final.m4a'], check=True)
print('ok')
