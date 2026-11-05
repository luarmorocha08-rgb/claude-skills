# Monta motion.json do EP4 a partir de roteiro/tempos.json e dos planos de cada cena (cenas/cXX.js, "de: N"),
# e grava window.TEMPOS no fim de cenas/_comum.js.
import json, os, re
AQUI = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(AQUI)
T = json.load(open(f'{P}/roteiro/tempos.json'))['cenas']
TIT = [l.strip() for l in open(f'{P}/roteiro/titulos.txt') if l.strip()]
FIM_C23 = 14.0  # rádio de Mauro, encarada, luzes apagando, preto e cartela do EP5
T['c23'] = dict(T['c23']); T['c23']['dur'] = round(T['c23']['frases'][-1][1] + FIM_C23, 2)
def cap(s): return s[:1] + s[1:].lower()
cenas = []
for i in range(1, 24):
    c = f'c{i:02d}'; fr = T[c]['frases']; js = open(f'{P}/cenas/{c}.js').read() if os.path.exists(f'{P}/cenas/{c}.js') else ''
    des = [(int(a), float(b or 0)) for a, b in re.findall(r'\{ de: (\d+)(?:, off: ([\d.]+))?', js)] or [(0, 0)]
    q = []
    for k, (d, off) in enumerate(des):
        a, b, txt = fr[min(d, len(fr) - 1)]
        q.append({'id': f'q{k}', 'rotulo': f'Plano {k + 1}', 'legenda': txt, 't': round(min(a + off + 1.6, max(b, a + off + 0.6)), 2)})
    if c == 'c23': q.append({'id': f'q{len(q)}', 'rotulo': 'Fim', 'legenda': 'EPISÓDIO 5 — O INIMIGO JÁ ENTROU.', 't': round(T[c]['dur'] - 2.0, 2)})
    cenas.append({'id': c, 'titulo': cap(TIT[i - 1]), 'dur': T[c]['dur'], 'ideia': cap(TIT[i - 1]), 'camera': 'Câmera viva, como nos EPs anteriores.',
                  'quadros': q, 'batidas': [], 'saida': {'tipo': 'corte'}, 'permitirParado': []})
    if c == 'c01':
        cenas.append({'id': 'abertura', 'titulo': 'Título', 'dur': 5, 'ideia': 'OS QUE FICARAM sai do desfoque; Episódio 4 • A Última Reserva.',
                      'camera': 'Título sai do desfoque letra a letra; a nave passa por cima.', 'quadros': [{'id': 'q0', 'rotulo': 'Título', 'legenda': 'OS QUE FICARAM · Episódio 4 · A Última Reserva', 't': 3.2}],
                      'batidas': [], 'saida': {'tipo': 'corte'}})
base = json.load(open(f'{P}/../os-que-ficaram-ep3/motion.json'))
m = {k: base[k] for k in ['versao', 'fps', 'bpm', 'formatoBase', 'formatos', 'movimento', 'referencias']}
m.update({'titulo': 'Os Que Ficaram — EP4 · A Última Reserva', 'slug': 'os-que-ficaram-ep4', 'cartaz': 'Uma escola cheia de gente pode ficar em silêncio por causa de um copo de água',
  'linguagem': [
    {'titulo': 'Ritmo', 'texto': 'A narração manda: cada plano entra na frase que mostra. Cortes secos entre planos; nenhum plano parado mais de 5 s.'},
    {'titulo': 'Câmera', 'texto': 'Viva: aproximação lenta por plano, tremor nos momentos de tensão (empurrão, corrente, motor).'},
    {'titulo': 'Personagens', 'texto': 'Mesmo stickman dos EPs 1–3. Novos: Breno (moletom preto, faixa branca no pulso, bastão), Mauro (roupa limpa, caderneta, arma só no coldre), Cíntia, Nando (motorista preso), o homem do rádio (faixa branca).'},
    {'titulo': 'Luz', 'texto': 'Amanhecer frio na escola → dia claro no cruzamento → fim de tarde na quadra → noite azul no corredor. A lanterna azul é o falso "alienígena".'},
    {'titulo': 'Objetos', 'texto': 'Lanterna em plástico azul, corrente e chave, prancheta com a ordem de entrega, lápis amarelo, mapa.'},
    {'titulo': 'Fecho', 'texto': 'A faixa branca no pulso, a voz de Mauro pelo rádio, as luzes da quadra apagando; preto. EPISÓDIO 5 — O INIMIGO JÁ ENTROU.'}],
  'capa': {'cena': 'c04', 'quadro': 'q3'}, 'storyboard': {'revisao': 0}, 'versoes': [], 'criadoEm': '2026-11-05', 'cenas': cenas})
json.dump(m, open(f'{P}/motion.json', 'w'), ensure_ascii=False, indent=1)
js = open(f'{P}/cenas/_comum.js').read(); js = re.sub(r'\n/\* tempos das frases \*/\nwindow\.TEMPOS = .*\n?$', '', js, flags=re.S)
js += '\n/* tempos das frases */\nwindow.TEMPOS = ' + json.dumps({k: {'frases': v['frases'], 'dur': v['dur']} for k, v in T.items()}, ensure_ascii=False) + ';\n'
open(f'{P}/cenas/_comum.js', 'w').write(js)
tot = sum(c['dur'] for c in cenas); print('cenas', len(cenas), 'total', round(tot, 1), f'= {int(tot // 60)}:{int(tot % 60):02d}')
