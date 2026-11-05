# Pranchas do storyboard: 3 cenas por prancha, quadros-chave de storyboard/quadros/16x9, legenda = frase.
import json, os, textwrap
from PIL import Image, ImageDraw, ImageFont
AQUI = os.path.dirname(os.path.abspath(__file__)); P = os.path.dirname(AQUI)
m = json.load(open(f'{P}/motion.json')); Q = f'{P}/storyboard/quadros/16x9'; OUT = f'{P}/storyboard/pranchas'
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT): os.remove(f'{OUT}/{f}')
anton = ImageFont.truetype(f'{P}/marca/fontes/Anton-Regular.ttf', 58); inter = ImageFont.truetype(f'{P}/marca/fontes/Inter-Medium.otf', 21)
inter2 = ImageFont.truetype(f'{P}/marca/fontes/Inter-Regular.otf', 18); durF = ImageFont.truetype(f'{P}/marca/fontes/Inter-Regular.otf', 22)
W, M, COL, G = 1920, 30, 4, 20; TW = (W - 2 * M - (COL - 1) * G) // COL; TH = TW * 9 // 16
arqs = sorted(os.listdir(Q)); cenas = m['cenas']
def bloco(i, c):
    q = [a for a in arqs if a.split('-')[1] == c['id']]; linhas = (len(q) + COL - 1) // COL
    return q, 110 + linhas * (TH + 90) + 20
n = 0
for g in range(0, len(cenas), 3):
    grupo = cenas[g:g + 3]; blocos = [bloco(g + k, c) for k, c in enumerate(grupo)]
    H = M + sum(b[1] for b in blocos); im = Image.new('RGB', (W, H), '#f3f0ea'); d = ImageDraw.Draw(im); y = M
    for c, (q, h) in zip(grupo, blocos):
        nome = 'TÍTULO' if c['id'] == 'abertura' else f"CENA {int(c['id'][1:])} — {c['titulo'].upper()}"
        d.text((M, y + 20), nome, font=anton, fill='#141414'); dur = c['dur']; d.text((W - M, y + 40), f"{int(dur // 60)}:{int(dur % 60):02d}", font=durF, fill='#555', anchor='ra')
        quad = {qq['id']: qq for qq in c['quadros']}
        for k, a in enumerate(q):
            x = M + (k % COL) * (TW + G); yy = y + 110 + (k // COL) * (TH + 90)
            th = Image.open(f'{Q}/{a}').convert('RGB').resize((TW, TH), Image.LANCZOS); im.paste(th, (x, yy))
            leg = quad.get(a.split('-')[2].split('.')[0], {}).get('legenda', '')
            ls = textwrap.wrap(leg, 40)
            if ls: d.text((x, yy + TH + 10), ls[0], font=inter, fill='#141414')
            if len(ls) > 1: d.text((x, yy + TH + 38), ' '.join(ls[1:])[:52] + ('…' if len(' '.join(ls[1:])) > 52 else ''), font=inter2, fill='#333')
        y += h
    n += 1; im.save(f'{OUT}/{n:02d}.png', optimize=True)
print(n, 'pranchas')
