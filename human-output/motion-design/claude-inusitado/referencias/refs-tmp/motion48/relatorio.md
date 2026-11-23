# Leitura da referência: e1152e20-90ba9205365e4e15ae9d73fcea2a9588.MP4

> Medições automáticas, quadro a quadro. Elas apontam ONDE olhar e dão os números (tempos, durações, curvas);
> a descrição do que acontece (tipografia, objetos, estilo) vem de abrir as imagens. Onde o número e o olho
> discordarem, vale o olho.

## Ficha técnica

| | |
|---|---|
| Arquivo | `/root/.claude/uploads/c521d7ad-873e-5ffc-ac81-716c655750aa/e1152e20-90ba9205365e4e15ae9d73fcea2a9588.MP4` |
| Trecho analisado | 0,00 s a 47,87 s (1436 quadros) |
| Duração do arquivo | 47,87 s |
| Formato | 720×1280, 9:16 vertical |
| Quadros por segundo | 30 |
| Um quadro dura | 33 ms |
| Codec / cor | h264 · yuv420p · bt709 · bt709 |
| Som | aac, 2 canal(is), 44100 Hz |

## Em uma olhada

- **7 planos** em 47,87 s: duração média 6,83 s, mediana 5,47 s, do mais curto (4,00 s) ao mais longo (13,67 s).
- **Transições**: 5 corte(s) seco(s), 0 corte(s) com quadro intermediário, 1 passagem(ns) por tela lisa (preto/branco/cor), 0 transição(ões) contínua(s) sem corte.
- **Tempo de tela**: 50% em batidas de movimento, 32% em hold vivo, 0% em movimento contínuo (filmagem/câmera), 17% congelado, 0% em tela lisa, 1% em cortes e transições.
- **Batidas de movimento medidas**: 51 (média de 1,1 por segundo). Duração típica de um movimento: 333 ms (metade fica entre 167 ms e 633 ms).
- **Curvas** (pela forma da energia): ease-in-out 23 · ease-out 16 · ease-in 8 · seco 3 · ease-out forte 1.
- **Foco**: 1 entrada(s) do desfoque para o foco e 0 saída(s) desfocando.
- **Ritmo de corte**: constante ao longo do vídeo (~6,8 s por plano), durações variadas.
- **Pulso visual**: cortes e inícios de movimento não caem numa grade de andamento fixa (ritmo livre, guiado pela leitura, pela fala ou pelo som).
- **Som**: sem batida regular: a trilha parece fala, efeitos ou ambiente. 1 de 6 cortes caem num impacto do som.
- **Cor**: domina quase preto #1A0E0C (26% da tela no tempo); o mais claro é amarelo pastel #E7DECA (contraste 14,1:1 com o dominante); acentos saturados: vermelho #76382C (6,8%), verde #246347 (4,8%), azul #222F67 (4,7%).

## Imagens, na ordem de leitura

1. `00-linha-do-tempo.png`: o vídeo inteiro no tempo. De cima para baixo: **COR** (cada coluna é o quadro espremido), **PLANOS**, **ESTADO** (branco = batida de movimento, verde = hold vivo, ciano = movimento contínuo, cinza = congelado, azul-escuro = tela lisa, vermelho = corte), **ENERGIA** (escala log; tracinhos amarelos = início de cada batida; faixas azuis = tela lisa; faixas laranja = transição contínua), **FOCO** (sobe = mais nítido), **LUZ** (brilho médio), **CAMERA** (verde para cima = aproxima, roxo para baixo = afasta; a linha clara é a velocidade de deslocamento), **SOM** (ataques do som; pontos amarelos = impactos). Linhas vermelhas verticais = cortes secos.
2. `01-planos-1.jpg`: storyboard reverso, os quadros-chave A (primeiro estado legível), B (meio) e C (composição final do hold, rótulo amarelo) de cada plano.
3. `planos/plano-NN.jpg`: folha de contato de cada plano, densa nas batidas (10 qps) e espaçada no hold; a faixa de baixo é a energia do plano com o número de cada quadro.
4. `transicoes/tNN-MM.jpg`: tira densa de cada transição que não é corte seco (moldura vermelha = primeiro quadro do plano seguinte).
5. `cortes/cortes-N.jpg`: cada corte seco com 2 quadros antes e 3 depois.
6. `paleta.png`: cores dominantes (global e por plano).

Dados: `dados.json` (tudo o que está aqui, estruturado) e `quadros.csv` (uma linha por quadro: energia, foco, luz, câmera, estado).

Para ver um trecho quadro a quadro, rode de novo com `--zoom a-b` (todos os quadros entre a e b segundos). Os trechos que mais valem um zoom: `--zoom 0,00-0,67` (P1, entrada de 600 ms); `--zoom 31,82-32,83` (P5, entrada de 900 ms); `--zoom 38,68-39,63` (P6, entrada de 833 ms).

## Planos

| Plano | Tempo | Duração | Batidas | Entrada | Hold | Saída | Câmera | Fundo |
|---|---|---|---|---|---|---|---|---|
| P1 | 0,00–5,47 | 5,47 s | 9 | 600 ms, in-out | 0,60 s, vivo | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #172429 |
| P2 | 5,47–12,73 | 7,27 s | 7 | 800 ms, out | 0,80 s, congelado | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #1D191C |
| P3 | 12,73–26,40 | 13,67 s | 15 | 467 ms, out | 1,07 s, vivo | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #1A1B33 |
| P4 | 26,40–31,87 | 5,47 s | 9 | 567 ms, out | 0,73 s, vivo | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #1A1A24 |
| P5 | 31,87–38,73 | 6,87 s | 7 | 900 ms, out-forte | 0,70 s, vivo | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #172A20 |
| P6 | 38,73–43,83 | 5,10 s | 3 | 833 ms, in-out | 2,27 s, vivo | corta do hold, sem saída | câmera estável | imagem, textura ou filmagem #331517 |
| P7 | 43,87–47,87 | 4,00 s | 1 | 300 ms, out | 3,50 s, congelado | corta do hold, sem saída | não medida | gradiente ou luz suave #0B0405 |

### P1 · 0,00 s → 5,47 s (5,47 s)

Energia: `▇▇▇▇▅▃▂▅▆▄▂▃▅▅▅▄▅▄▃▂▁▂▃▃▄▅▄▄▂▅▄▂▁▄▅▅▄▄▅▆▄▄▄▄▄▄▁▂`

- Imagem: `planos/plano-01.jpg` · quadros-chave A 0,60 s, C 2,33 s
- Fundo: imagem, textura ou filmagem (borda #172429). Batidas de movimento ocupam 59% do plano.
- Hold: 2,03 s → 2,63 s do plano (0,60 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 2,07 s com 2,57 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 51% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (0,00 s → 0,60 s): ENTRADA · 600 ms; onde: centro (7% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `·▇▇▇▇▇▆▆▆▇▇▇▆▅▄▅▅▃`; entra do desfoque para o foco; encolhe/afasta 2%, desce 2% da altura; varre de cima para baixo; acrescenta elemento.
  - **0,73** (0,73 s → 1,07 s): 333 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▂▅▄▃▄▃▂▆▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **1,37** (1,37 s → 1,73 s): 367 ms; onde: embaixo, no centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▄▅▅▅▅▅▄▃▃▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **1,87** (1,87 s → 2,03 s): 167 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▄▃▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **2,63** (2,63 s → 2,67 s): 33 ms; onde: embaixo, no centro (3% dos pixels mudando por quadro); curva: aparece/some seco, num quadro (sem animação); velocidade `▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **2,77** (2,77 s → 2,97 s): 200 ms; onde: embaixo, à esquerda (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **3,30** (3,30 s → 3,50 s): 200 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `·▅▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **3,77** (3,77 s → 4,90 s): 1133 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▅▅▅▅▄▃▄▃▃▃▅▆▅▅▃▄▄▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **5,03** (5,03 s → 5,20 s): 167 ms; onde: meio, à esquerda (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P2 · 5,47 s → 12,73 s (7,27 s)

Energia: `▇▇▆▇▇▅▁▇▇▇▂▂▇▇▆▂▅▇▇▆▄▅▆▇▃▅▆▇▆▃▅▆▆▆▅▆▆▅▂▃▅▆▄▁·▁▂·`

- Imagem: `planos/plano-02.jpg` · quadros-chave A 6,27 s, B 9,83 s, C 12,33 s
- Fundo: imagem, textura ou filmagem (borda #1D191C). Batidas de movimento ocupam 66% do plano.
- Hold: 6,47 s → 7,27 s do plano (0,80 s), congelado (imagem parada).
- Câmera (comparando 11,97 s com 12,67 s): quadro praticamente parado entre o começo e o fim do trecho.
- Câmera pelo fluxo (textura em 46% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (5,47 s → 6,27 s): ENTRADA · 800 ms; onde: centro (7% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▇▇▇▇▇▇▆▆▄▅▆▆▆▆▇▇▇▆▇▇▆▇▅▁`; aparece sem desfoque (opacidade, máscara ou movimento); encolhe/afasta 3%, desce 5% da altura, desliza 2% para a direita; varre de cima para baixo; acrescenta elemento.
  - **1,07** (6,53 s → 7,00 s): 467 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▆▇▆▇▅▇▇▇▇▄▅▂`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **1,80** (7,27 s → 7,70 s): 433 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▆▇▆▆▇▆▆▆▆▆▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **2,50** (7,97 s → 8,40 s): 433 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▆▆▆▇▆▇▆▆▇▆▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **3,23** (8,70 s → 9,83 s): 1133 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▅▆▆▆▇▆▇▅▃▃▅▄▄▃▄▆▆▆▆▆▇▆▆`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **4,50** (9,97 s → 11,17 s): 1200 ms; onde: centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▃▅▄▄▅▆▆▆▆▆▆▃▅▅▄▆▆▅▄▆▆▄▅▅`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **6,13** (11,60 s → 11,93 s): 333 ms; onde: centro (3% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `·▅▆▆▅▅▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.

### P3 · 12,73 s → 26,40 s (13,67 s)

Energia: `▇▆▄▄▅▆▄▄▅▅▅▅▅▅▄▃▅▆▆▄▅▄▆▂▁▇▇▆▅▅▄▅▃▆▄▄▃▄▅▆▄▅▄▆▄▄▆▄`

- Imagem: `planos/plano-03.jpg` · quadros-chave A 13,20 s, B 21,70 s, C 22,83 s
- Fundo: imagem, textura ou filmagem (borda #1A1B33). Batidas de movimento ocupam 60% do plano.
- Hold: 9,57 s → 10,63 s do plano (1,07 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 22,33 s com 23,30 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 55% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (12,73 s → 13,20 s): ENTRADA · 467 ms; onde: centro (6% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▇▇▇▇▇▇▆▆▄▅▆▅▅▄`; nitidez estável; encolhe/afasta 3%, desce 5% da altura; move/ajusta o que já estava.
  - **0,60** (13,33 s → 14,43 s): 1100 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▄▄▃▃▄▄▄▄▄▄▃▅▅▅▄▄▄▅▆▆▄▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **1,90** (14,63 s → 16,97 s): 2333 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▄▅▅▄▅▄▄▅▄▅▄▄▄▅▅▄▅▅▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; acrescenta elemento.
  - **4,90** (17,63 s → 18,00 s): 367 ms; onde: centro (5% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▁▅▆▆▆▆▆▆▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **5,50** (18,23 s → 18,70 s): 467 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▃▂▂▅▅▄▃▅▅▃▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **6,23** (18,97 s → 19,17 s): 200 ms; onde: embaixo, no centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▆▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; move/ajusta o que já estava.
  - **7,23** (19,97 s → 20,83 s): 867 ms; onde: quadro todo (7% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▇▇▇▇▇▇▆▆▆▇▇▇▄▅▆▆▆▆▅▅▅▅▅▅`; desfoca no meio do movimento (blur de movimento ou transição com desfoque); encolhe/afasta 4%, desce 4% da altura; varre de cima para baixo; acrescenta elemento.
  - **8,27** (21,00 s → 21,17 s): 167 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▃▅▄▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **8,73** (21,47 s → 21,70 s): 233 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▄▃▃▄▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **9,33** (22,07 s → 22,30 s): 233 ms; onde: embaixo, à esquerda (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▃▆▄▄▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **10,63** (23,37 s → 23,40 s): 33 ms; onde: embaixo, no centro (3% dos pixels mudando por quadro); curva: aparece/some seco, num quadro (sem animação); velocidade `▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **10,83** (23,57 s → 24,00 s): 433 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▅▄▄▄▄▄▄▃▆▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **11,83** (24,57 s → 24,70 s): 133 ms; onde: embaixo, à direita (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **12,10** (24,83 s → 25,07 s): 233 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▄▃▃▆▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **12,60** (25,33 s → 26,20 s): 867 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▄▄▄▁▃▄▃·▃▄▂▂▄▄▂▆▆▅▅▃▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; move/ajusta o que já estava.

### P4 · 26,40 s → 31,87 s (5,47 s)

Energia: `▇▇▇▇▄▂▂▃▄▅▄▃▄▂▄▅▄▃▃▂▂▄▃▃▅▄▃▅▄▄▃▄▄▅▅▄▃▃▄▂▅▄▁·▆▅▄▁`

- Imagem: `planos/plano-04.jpg` · quadros-chave A 26,97 s, C 28,60 s
- Fundo: imagem, textura ou filmagem (borda #1A1A24). Batidas de movimento ocupam 43% do plano.
- Hold: 1,83 s → 2,57 s do plano (0,73 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 28,27 s com 28,90 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 39% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (26,40 s → 26,97 s): ENTRADA · 567 ms; onde: centro (10% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▇▇▇▇▇▇▆▆▇▇▇▇▆▄▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; acrescenta elemento.
  - **1,03** (27,43 s → 27,60 s): 167 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▂▅▄▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **1,67** (28,07 s → 28,23 s): 167 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▂▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **2,57** (28,97 s → 29,00 s): 33 ms; onde: embaixo, no centro (3% dos pixels mudando por quadro); curva: aparece/some seco, num quadro (sem animação); velocidade `▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **2,73** (29,13 s → 29,30 s): 167 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **3,03** (29,43 s → 29,77 s): 333 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▃▅▅▄▄▃▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **3,63** (30,03 s → 30,47 s): 433 ms; onde: embaixo, no centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▃▄▅▅▅▄▃▅▄▄▂`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **4,53** (30,93 s → 31,10 s): 167 ms; onde: embaixo, à direita (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▁▅▅▃▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **4,97** (31,37 s → 31,67 s): 300 ms; onde: meio, à direita (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `·▆▆▆▅▃▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P5 · 31,87 s → 38,73 s (6,87 s)

Energia: `▇▇▆▆▅▅▄▁▂▁▂▄▄▄▅▄▄▆▅▄▃▄▅▅▆▅▅▂▅▃▄▂▅▄▄▃▄▆▅▅▅▅▃▁▆▆▄·`

- Imagem: `planos/plano-05.jpg` · quadros-chave A 32,77 s, B 36,50 s, C 36,83 s
- Fundo: imagem, textura ou filmagem (borda #172A20). Batidas de movimento ocupam 61% do plano.
- Hold: 4,63 s → 5,33 s do plano (0,70 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 36,53 s com 37,13 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 51% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (31,87 s → 32,77 s): ENTRADA · 900 ms; onde: quadro todo (6% dos pixels mudando por quadro); curva: arranca rápido e assenta devagar (ease-out forte, tipo expo/quint); velocidade `▇▇▇▇▇▆▆▆▅▆▆▆▅▅▅▅▅▅▅▄▄▃▅▄`; nitidez estável; desce 2% da altura; varre de cima para baixo; acrescenta elemento.
  - **1,57** (33,43 s → 34,67 s): 1233 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▃▄▄▄▄▄▃▂▅▄▄▄▄▄▄▃▂▆▅▅▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **3,03** (34,90 s → 35,70 s): 800 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▅▄▄▄▂▃▃▅▅▅▅▆▆▅▅▅▄▄▃▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **3,97** (35,83 s → 36,00 s): 167 ms; onde: embaixo, à esquerda (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▄▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **4,53** (36,40 s → 36,50 s): 100 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `·▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **5,33** (37,20 s → 37,87 s): 667 ms; onde: embaixo, no centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▁▅▆▅▅▄▂▄▅▅▅▅▄▂▃▄▅▅▃▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **6,37** (38,23 s → 38,53 s): 300 ms; onde: embaixo, à direita (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▁▆▆▅▅▃▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P6 · 38,73 s → 43,83 s (5,10 s)

Energia: `▇▇▆█▇▄▅▄▂▃▄▄▄▅▅▄▅▄▃▃▃▅▄▃▃▃▅▃▃▃▄▄▁▂▃▃▃▂▂▂▂▂▃▂▂▂▂▂`

- Imagem: `planos/plano-06.jpg` · quadros-chave A 39,57 s, B 41,57 s, C 42,70 s
- Fundo: imagem, textura ou filmagem (borda #331517). Batidas de movimento ocupam 31% do plano.
- Hold: 2,83 s → 5,10 s do plano (2,27 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 41,60 s com 43,77 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 42% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (38,73 s → 39,57 s): ENTRADA · 833 ms; onde: quadro todo (9% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▇▇▇▇▇▇▆▆▃▅██▇▆▄▃▄▄▃▃▅▅▃▄`; aparece sem desfoque (opacidade, máscara ou movimento); encolhe/afasta 6%, desce 4% da altura, desliza 4% para a esquerda; varre de cima para baixo; acrescenta elemento.
  - **1,23** (39,97 s → 40,57 s): 600 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▃▃▃▄▅▄▅▅▄▄▄▄▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **2,70** (41,43 s → 41,57 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.

### P7 · 43,87 s → 47,87 s (4,00 s)

Energia: `▃▄▄▅▄▄▂▂▂▂······▂·▁▁·▁·····▂▁▁▂▂▂▂▂▂···▂········`

- Imagem: `planos/plano-07.jpg` · quadros-chave A 44,37 s, C 46,10 s
- Fundo: gradiente ou luz suave (borda #0B0405). Batidas de movimento ocupam 8% do plano.
- Hold: 0,50 s → 4,00 s do plano (3,50 s), congelado (imagem parada).
- Câmera (comparando 44,40 s com 47,80 s): o conteúdo muda demais para medir a câmera por comparação.
- Batidas (tempo dentro do plano):
  - **0,20** (44,07 s → 44,37 s): ENTRADA · 300 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `·▅▅·▂▄·▃▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

## Transições

| De → para | Tempo | Tipo | Duração | Leitura | Imagem |
|---|---|---|---|---|---|
| P1 → P2 | 5,47 s | corte seco | 1 quadro | corte seco, de um quadro calmo para um plano que já entra se mexendo | `cortes/cortes-1.jpg` |
| P2 → P3 | 12,73 s | corte seco | 1 quadro | corte seco, de um quadro calmo para um plano que já entra se mexendo | `cortes/cortes-1.jpg` |
| P3 → P4 | 26,40 s | corte seco | 1 quadro | corte seco, de um quadro calmo para um plano que já entra se mexendo | `cortes/cortes-1.jpg` |
| P4 → P5 | 31,87 s | corte seco | 1 quadro | corte seco, de um quadro calmo para um plano que já entra se mexendo | `cortes/cortes-1.jpg` |
| P5 → P6 | 38,73 s | corte seco | 1 quadro | corte seco, de um quadro calmo para um plano que já entra se mexendo | `cortes/cortes-2.jpg` |
| P6 → P7 | 43,87 s | passagem por tela lisa | 33 ms de tela lisa | passagem pelo preto (#000000); o plano anterior corta seco para a tela lisa, a imagem seguinte volta seca, num quadro | `transicoes/t06-07.jpg` |

## Som e sincronia

- Sem batida regular clara (provável fala, efeitos ou ambiente). O corte não segue um andamento de música.
- Dos 40 impactos mais fortes do som, 9 têm um corte ou início de movimento a ±2 quadros.
- Dos 6 cortes, 1 (17%) caem a ±2 quadros de um impacto do som; o acaso daria ~13%.
- Impactos mais fortes da trilha (s): 0,98 · 2,35 · 2,62 · 3,44 · 4,24 · 4,32 · 4,77 · 5,03 · 5,68 · 6,02 · 6,73 · 7,28 · 8,15 · 9,28 · 9,56 · 10,28 · 10,77 · 11,57 · 12,67 · 15,09 · 19,90 · 20,44 · 23,48 · 24,65

## Paleta

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| quase preto | `#1A0E0C` | 26,5% | 5 | 5 |
| azul escuro | `#17272D` | 24,9% | 15 | 8 |
| vermelho escuro | `#552E24` | 12,0% | 24 | 22 |
| amarelo pastel | `#E7DECA` | 11,1% | 89 | 11 |
| azul escuro | `#1D2756` | 11,0% | 17 | 32 |
| verde | `#2A614B` | 6,4% | 37 | 25 |
| azul | `#506776` | 6,0% | 42 | 12 |
| laranja | `#C4633B` | 2,3% | 53 | 53 |

Acentos (só as cores saturadas, mesmo pequenas: degradês, brilhos, palavras em destaque):

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| vermelho | `#76382C` | 6,80% | 31 | 33 |
| verde | `#246347` | 4,83% | 37 | 29 |
| azul | `#222F67` | 4,66% | 21 | 38 |
| azul | `#4262A1` | 1,76% | 42 | 39 |
| laranja | `#D7AC64` | 1,31% | 73 | 43 |
| roxo | `#9561EE` | 0,14% | 53 | 81 |

Por plano (4 mais presentes): P1 #191A1D #25515D #E5DEC7 #783A29 · P2 #1A181F #424553 #462A1C #E3D9C2 · P3 #1E2A5E #1B1513 #244644 #E2DAC1 · P4 #17223C #19100E #E6DABE #503527 · P5 #0E2B23 #235F45 #341F15 #A4AFC1 · P6 #261010 #532121 #F0E9D6 #944541 · P7 #100606 #393632 #A7A4A3 #B72679

## Rascunho do roteiro reverso (preencher olhando as imagens)

Mesma forma do storyboard: plano, duração, quadros-chave e batidas com o tempo dentro do plano. Os tempos já estão
medidos; troque cada `[…]` pelo que se vê nas folhas (o que entra, de onde, como, em que unidade, com que curva).

```
P1 · 5,5 s · fundo imagem, textura ou filmagem
  quadro A (0,6): […primeiro estado legível]
  quadro C (2,3): […composição final]
  0,0  […] (600 ms, in-out, desfoque→foco)
  0,7  […] (333 ms, in)
  1,4  […] (367 ms, out)
  1,9  […] (167 ms, in-out)
  2,6  […] (33 ms, seco)
  2,8  […] (200 ms, in-out)
  3,3  […] (200 ms, in-out)
  3,8  […] (1133 ms, in-out)
  5,0  […] (167 ms, in)
  5,5  → corte seco, de um quadro calmo para um plano que já entra se mexendo
P2 · 7,3 s · fundo imagem, textura ou filmagem
  quadro A (0,8): […primeiro estado legível]
  quadro B (4,4): […]
  quadro C (6,9): […composição final]
  0,0  […] (800 ms, out)
  1,1  […] (467 ms, in-out)
  1,8  […] (433 ms, in-out)
  2,5  […] (433 ms, in-out)
  3,2  […] (1133 ms, in)
  4,5  […] (1200 ms, out)
  6,1  […] (333 ms, out)
  7,3  → corte seco, de um quadro calmo para um plano que já entra se mexendo
P3 · 13,7 s · fundo imagem, textura ou filmagem
  quadro A (0,5): […primeiro estado legível]
  quadro B (9,0): […]
  quadro C (10,1): […composição final]
  0,0  […] (467 ms, out)
  0,6  […] (1100 ms, in)
  1,9  […] (2333 ms, in-out)
  4,9  […] (367 ms, in-out)
  5,5  […] (467 ms, in-out)
  6,2  […] (200 ms, in-out)
  7,2  […] (867 ms, out)
  8,3  […] (167 ms, out)
  8,7  […] (233 ms, in)
  9,3  […] (233 ms, out)
  10,6  […] (33 ms, seco)
  10,8  […] (433 ms, in-out)
  11,8  […] (133 ms, in-out)
  12,1  […] (233 ms, in)
  12,6  […] (867 ms, in)
  13,7  → corte seco, de um quadro calmo para um plano que já entra se mexendo
P4 · 5,5 s · fundo imagem, textura ou filmagem
  quadro A (0,6): […primeiro estado legível]
  quadro C (2,2): […composição final]
  0,0  […] (567 ms, out)
  1,0  […] (167 ms, out)
  1,7  […] (167 ms, out)
  2,6  […] (33 ms, seco)
  2,7  […] (167 ms, out)
  3,0  […] (333 ms, out)
  3,6  […] (433 ms, in-out)
  4,5  […] (167 ms, in-out)
  5,0  […] (300 ms, out)
  5,5  → corte seco, de um quadro calmo para um plano que já entra se mexendo
P5 · 6,9 s · fundo imagem, textura ou filmagem
  quadro A (0,9): […primeiro estado legível]
  quadro B (4,6): […]
  quadro C (5,0): […composição final]
  0,0  […] (900 ms, out-forte)
  1,6  […] (1233 ms, in)
  3,0  […] (800 ms, in-out)
  4,0  […] (167 ms, in-out)
  4,5  […] (100 ms, in-out)
  5,3  […] (667 ms, in-out)
  6,4  […] (300 ms, out)
  6,9  → corte seco, de um quadro calmo para um plano que já entra se mexendo
P6 · 5,1 s · fundo imagem, textura ou filmagem
  quadro A (0,8): […primeiro estado legível]
  quadro B (2,8): […]
  quadro C (4,0): […composição final]
  0,0  […] (833 ms, in-out)
  1,2  […] (600 ms, in-out)
  2,7  […] (133 ms, in-out)
  5,1  → passagem pelo preto (#000000)
P7 · 4,0 s · fundo gradiente ou luz suave
  quadro A (0,5): […primeiro estado legível]
  quadro C (2,2): […composição final]
  0,2  […] (300 ms, out)
```

## Linguagem de movimento da referência (rascunho para o storyboard)

- **Ritmo**: livre (sem grade de andamento); planos de 5,5 s na mediana; constante ao longo do vídeo (~6,8 s por plano), durações variadas.
- **Entradas**: duração típica 600 ms; curvas ease-out 4, ease-in-out 2, ease-out forte 1. […unidade (letra/palavra/linha/bloco), atraso entre unidades, de onde vem, desfoque/opacidade/máscara]
- **Hold**: 0,80 s na mediana; 5 vivos, 2 congelados, 0 em movimento contínuo. […o que se mexe no hold]
- **Saídas**: 0 plano(s) com saída animada (mediana –; curvas –); 7 cortam direto do hold, sem saída animada.
- **Câmera**: 1 com quadro parado no hold. […mergulhos, paralaxe entre camadas]
- **Cortes**: 5 secos, 1 por tela lisa, 0 contínuos. […mesmo eixo? match de forma? corte no movimento?]
- **Luz e cor**: quase preto #1A0E0C, azul escuro #17272D, vermelho escuro #552E24. […gradiente, brilho que atravessa, grão, vinheta]
- **Profundidade**: […camadas, desfoque de profundidade, motion blur]

## Limites desta leitura

- "Energia" é a diferença média de brilho entre quadros: mede quanto a imagem muda, não o que muda. Opacidade, foco, cor e movimento somam juntos.
- A curva é estimada pela forma da energia; quando várias letras/objetos entram em cascata, ela descreve o conjunto, não cada peça. Confirme na folha.
- Câmera e movimento de objeto só se separam quando há textura no fundo. Em fundo chapado, "sobe/desliza/cresce" é o que se move na tela, não a câmera.
- Texto não é lido (sem OCR): leia nas imagens.
