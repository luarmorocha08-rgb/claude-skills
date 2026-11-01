"""Abertura "entrando no notebook": o vídeo do celular (vertical) dentro do quadro 16:9, um push-in
contínuo que acelera e mergulha na tela do notebook, e o filme nítido encaixado em perspectiva
dentro da tela até ocupar o quadro inteiro, em sincronia com o que o notebook está mostrando.

Uso: python3 compor.py <pasta_trabalho> <saida.mp4>
  <pasta_trabalho>/fr/0001.jpg…   quadros do celular (29,97 qps)
  <pasta_trabalho>/track3.json     os quatro cantos da tela em cada quadro do celular
  <pasta_trabalho>/rf/NNNN.png     quadros do filme (60 qps), numerados pelo índice no filme

Linha do tempo (segundos do resultado):
  0 – 8,2    o celular inteiro, com um push-in lento que acelera
  8,2 – 9,55 o mergulho na tela; o filme nítido aparece dentro da tela (8,5 – 9,3)
  9,55 →     (fora daqui) o filme em tela cheia, emendado no quadro exato
"""
import json
import subprocess
import sys

import cv2
import numpy as np

D, SAIDA = sys.argv[1], sys.argv[2]
W, H, FPS = 1920, 1080, 60
FPS_CEL = 30000 / 1001
OFF = 127  # o filme começa 127 quadros (2,117 s) depois do início do vídeo do celular
T_A, T_B = 8.2, 9.55  # começo e fim do mergulho
N = int(round(T_B * FPS))  # quadros gerados aqui (o resto é o filme)

trk = json.load(open(f"{D}/track3.json"))
Q = np.array([t["q"] for t in trk], dtype=np.float64)  # tl, tr, br, bl
# suaviza o tremor de detecção (3 quadros), sem apagar o movimento de mão do celular
Qs = Q.copy()
for i in range(1, len(Q) - 1):
    Qs[i] = (Q[i - 1] + 2 * Q[i] + Q[i + 1]) / 4
ULTIMO_BOM = 288

def quad(fi):
    return Qs[min(fi, ULTIMO_BOM)]

def suave(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)

def hermite(t, t0, t1, p0, v0, p1, v1):
    h = t1 - t0
    s = min(1.0, max(0.0, (t - t0) / h))
    h00 = 2 * s**3 - 3 * s**2 + 1
    h10 = s**3 - 2 * s**2 + s
    h01 = -2 * s**3 + 3 * s**2
    h11 = s**3 - s**2
    return h00 * p0 + h10 * h * v0 + h01 * p1 + h11 * h * v1

W_A = 0.15  # quanto do caminho até a tela a câmera anda no push-in lento

def w(t):
    """Fração do caminho do enquadramento inicial até a tela ocupar o quadro (contínua, sem parar)."""
    if t <= T_A:
        return W_A * (t / T_A) ** 2
    return hermite(t, T_A, T_B, W_A, 2 * W_A / T_A, 1.0, 0.0)

# enquadramento inicial: o celular inteiro na altura do quadro, centrado
S0 = 1080 / 1920
def S0_ponto(p):
    return np.array([W / 2 + (p[0] - 540) * S0, H / 2 + (p[1] - 960) * S0])

CANVAS = np.array([[0, 0], [W, 0], [W, H], [0, H]], dtype=np.float64)
CEL = np.array([[0, 0], [1080, 0], [1080, 1920], [0, 1920]], dtype=np.float64)
FILME = CANVAS.copy()

ff = subprocess.Popen(
    ["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}",
     "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", SAIDA],
    stdin=subprocess.PIPE,
)

cache = {}
def cel(fi):
    fi = min(fi, ULTIMO_BOM)
    if fi not in cache:
        cache.clear()
        cache[fi] = cv2.imread(f"{D}/fr/{fi + 1:04d}.jpg")
    return cache[fi]

for n in range(N):
    t = n / FPS
    fi = int(t * FPS_CEL)
    im = cel(fi)
    q = quad(fi)
    k = w(t)
    alvo = np.array([(1 - k) * S0_ponto(p) + k * c for p, c in zip(q, CANVAS)])
    M = cv2.getPerspectiveTransform(q.astype(np.float32), alvo.astype(np.float32))

    # fundo: o próprio celular, cobrindo o quadro, bem desfocado e escuro
    pequeno = cv2.resize(im, (54, 96), interpolation=cv2.INTER_AREA)
    fundo = cv2.resize(pequeno, (W, int(W * 1920 / 1080)), interpolation=cv2.INTER_CUBIC)
    y0 = (fundo.shape[0] - H) // 2
    fundo = cv2.GaussianBlur(fundo[y0:y0 + H], (0, 0), 40) * 0.22

    frente = cv2.warpPerspective(im, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT)
    masc = cv2.warpPerspective(np.ones((1920, 1080), np.float32), M, (W, H), flags=cv2.INTER_LINEAR)
    masc = cv2.GaussianBlur(masc, (0, 0), 1.2)[..., None]
    # no fim do mergulho o entorno do notebook escurece: só a tela continua acesa
    entorno = 1 - 0.9 * suave((t - 9.05) / 0.4)
    out = fundo * (1 - masc) + frente.astype(np.float32) * masc * entorno

    # o filme nítido dentro da tela
    a = suave((t - 8.5) / 0.8)
    if a > 0:
        idx = n - OFF
        fr = cv2.imread(f"{D}/rf/{idx:04d}.png")
        Hr = cv2.getPerspectiveTransform(FILME.astype(np.float32), alvo.astype(np.float32))
        tela = cv2.warpPerspective(fr, Hr, (W, H), flags=cv2.INTER_LINEAR)
        mt = cv2.warpPerspective(np.ones((H, W), np.float32), Hr, (W, H), flags=cv2.INTER_LINEAR)
        mt = cv2.GaussianBlur(mt, (0, 0), 1.0)[..., None] * a
        out = out * (1 - mt) + tela.astype(np.float32) * mt

    ff.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
    if n % 60 == 0:
        print(f"{t:.1f}s", flush=True)

ff.stdin.close()
ff.wait()
print("ok", N, "quadros")
