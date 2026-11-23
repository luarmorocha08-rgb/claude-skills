# Leitura da referência: 9e6d5aee-7df0c588651841988c194724646134c7.MP4

> Medições automáticas, quadro a quadro. Elas apontam ONDE olhar e dão os números (tempos, durações, curvas);
> a descrição do que acontece (tipografia, objetos, estilo) vem de abrir as imagens. Onde o número e o olho
> discordarem, vale o olho.

## Ficha técnica

| | |
|---|---|
| Arquivo | `/root/.claude/uploads/c521d7ad-873e-5ffc-ac81-716c655750aa/9e6d5aee-7df0c588651841988c194724646134c7.MP4` |
| Trecho analisado | 0,00 s a 74,00 s (2220 quadros) |
| Duração do arquivo | 74,00 s |
| Formato | 720×1280, 9:16 vertical |
| Quadros por segundo | 30 |
| Um quadro dura | 33 ms |
| Codec / cor | h264 · yuv420p · bt709 · bt709 |
| Som | aac, 2 canal(is), 44100 Hz |

## Em uma olhada

- **5 planos** em 74,00 s: duração média 14,80 s, mediana 13,93 s, do mais curto (4,00 s) ao mais longo (29,03 s).
- **Transições**: 1 corte(s) seco(s), 0 corte(s) com quadro intermediário, 0 passagem(ns) por tela lisa (preto/branco/cor), 3 transição(ões) contínua(s) sem corte.
- **Tempo de tela**: 31% em batidas de movimento, 62% em hold vivo, 0% em movimento contínuo (filmagem/câmera), 7% congelado, 0% em tela lisa, 0% em cortes e transições.
- **Batidas de movimento medidas**: 68 (média de 0,9 por segundo). Duração típica de um movimento: 317 ms (metade fica entre 167 ms e 467 ms).
- **Curvas** (pela forma da energia): ease-in-out 43 · ease-out 13 · ease-in 7 · linear 2 · seco 1 · ease-in forte 1 · ease-out forte 1.
- **Foco**: 1 entrada(s) do desfoque para o foco e 8 saída(s) desfocando.
- **Ritmo de corte**: acelera: o primeiro terço tem planos de 19,4 s e o último de 4,0 s, durações variadas.
- **Pulso visual**: cortes e inícios de movimento não caem numa grade de andamento fixa (ritmo livre, guiado pela leitura, pela fala ou pelo som).
- **Som**: sem batida regular: a trilha parece fala, efeitos ou ambiente. 0 de 4 cortes caem num impacto do som.
- **Cor**: domina quase preto #0D0D14 (75% da tela no tempo); o mais claro é cinza claro #DCD8D2 (contraste 13,6:1 com o dominante); acentos saturados: laranja #DC9A47 (1,1%), laranja #8F5F3A (1,0%), magenta #6E2F51 (0,71%).

## Imagens, na ordem de leitura

1. `00-linha-do-tempo.png`: o vídeo inteiro no tempo. De cima para baixo: **COR** (cada coluna é o quadro espremido), **PLANOS**, **ESTADO** (branco = batida de movimento, verde = hold vivo, ciano = movimento contínuo, cinza = congelado, azul-escuro = tela lisa, vermelho = corte), **ENERGIA** (escala log; tracinhos amarelos = início de cada batida; faixas azuis = tela lisa; faixas laranja = transição contínua), **FOCO** (sobe = mais nítido), **LUZ** (brilho médio), **CAMERA** (verde para cima = aproxima, roxo para baixo = afasta; a linha clara é a velocidade de deslocamento), **SOM** (ataques do som; pontos amarelos = impactos). Linhas vermelhas verticais = cortes secos.
2. `01-planos-1.jpg`: storyboard reverso, os quadros-chave A (primeiro estado legível), B (meio) e C (composição final do hold, rótulo amarelo) de cada plano.
3. `planos/plano-NN.jpg`: folha de contato de cada plano, densa nas batidas (10 qps) e espaçada no hold; a faixa de baixo é a energia do plano com o número de cada quadro.
4. `transicoes/tNN-MM.jpg`: tira densa de cada transição que não é corte seco (moldura vermelha = primeiro quadro do plano seguinte).
5. `cortes/cortes-N.jpg`: cada corte seco com 2 quadros antes e 3 depois.
6. `paleta.png`: cores dominantes (global e por plano).

Dados: `dados.json` (tudo o que está aqui, estruturado) e `quadros.csv` (uma linha por quadro: energia, foco, luz, câmera, estado).

Para ver um trecho quadro a quadro, rode de novo com `--zoom a-b` (todos os quadros entre a e b segundos). Os trechos que mais valem um zoom: `--zoom 29,55-30,73` (P2, batida de 1067 ms); `--zoom 19,38-19,93` (P2, entrada de 433 ms); `--zoom 40,92-41,40` (P4, entrada de 367 ms).

## Planos

| Plano | Tempo | Duração | Batidas | Entrada | Hold | Saída | Câmera | Fundo |
|---|---|---|---|---|---|---|---|---|
| P1 | 0,00–19,43 | 19,43 s | 19 | 367 ms, in-out | 1,53 s, vivo | 167 ms, in | não medida | gradiente ou luz suave #0D0D16 |
| P2 | 19,43–33,37 | 13,93 s | 15 | 433 ms, out | 1,27 s, vivo | 467 ms, in-forte | não medida | gradiente ou luz suave #0E0D16 |
| P3 | 33,37–40,97 | 7,60 s | 9 | 367 ms, out | 1,20 s, vivo | 167 ms, in | não medida | gradiente ou luz suave #0E0D16 |
| P4 | 40,97–70,00 | 29,03 s | 24 | 367 ms, out | 4,47 s, vivo | corta do hold, sem saída | câmera estável | gradiente ou luz suave #0E0D16 |
| P5 | 70,00–74,00 | 4,00 s | 1 | 367 ms, in-out | 3,47 s, congelado | corta do hold, sem saída | não medida | preto chapado #020204 |

### P1 · 0,00 s → 19,43 s (19,43 s)

Energia: `▅▅▄▃▅▄▅▃▃▅▅▄▄▃▅▅▆▄▆▆▅▅▅▃▄▃▅▄▅▅▃▃▄▃▄▃▄▅▆▃▁▅▃▅▃▆▅▅`

- Imagem: `planos/plano-01.jpg` · quadros-chave A 0,37 s, C 5,17 s
- Fundo: gradiente ou luz suave (borda #0D0D16). Batidas de movimento ocupam 34% do plano.
- Hold: 4,40 s → 5,93 s do plano (1,53 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 4,43 s com 5,87 s): o conteúdo muda demais para medir a câmera por comparação.
- Batidas (tempo dentro do plano):
  - **0,00** (0,00 s → 0,37 s): ENTRADA · 367 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `·▅▅▅▅▅▅▅▅▅▃`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **0,73** (0,73 s → 0,87 s): 133 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▁▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **1,60** (1,60 s → 1,73 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **2,33** (2,33 s → 2,73 s): 400 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▄▃▃▂▄▅▅▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **3,77** (3,77 s → 4,40 s): 633 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▄▄▄▅▅▅▅▅▅▅▄▄▄▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **5,93** (5,93 s → 6,23 s): 300 ms; onde: centro (3% dos pixels mudando por quadro); curva: velocidade constante (linear); velocidade `▃▅▅▅▅▅▅▅▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **6,47** (6,47 s → 6,80 s): 333 ms; onde: centro (5% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▅▅▆▆▆▆▄▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; remove elemento.
  - **7,17** (7,17 s → 8,23 s): 1067 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▄▄▄▆▆▆▆▅▆▆▅▅▆▅▅▅▄▆▃▂▅`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **8,37** (8,37 s → 8,40 s): 33 ms; onde: alto, no centro (2% dos pixels mudando por quadro); curva: aparece/some seco, num quadro (sem animação); velocidade `▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **8,70** (8,70 s → 9,10 s): 400 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▅▅▄▂▃▃▃▅▅▅▂`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **10,60** (10,60 s → 11,13 s): 533 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▅▅▅▃▃▃▃▄▄▄▄▄▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; transforma a composição.
  - **11,83** (11,83 s → 12,00 s): 167 ms; onde: embaixo, à esquerda (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▁`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **13,00** (13,00 s → 13,13 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▄▄`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **13,73** (13,73 s → 13,90 s): 167 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▄▄▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **14,93** (14,93 s → 15,77 s): 833 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▅▅▅▅▃▄▅▄▃▄▅▆▆▅▅▅▅▄▄▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; transforma a composição.
  - **16,67** (16,67 s → 16,83 s): 167 ms; onde: embaixo, no centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▂`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **17,57** (17,57 s → 17,67 s): 100 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: velocidade constante (linear); velocidade `▅▅▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **18,20** (18,20 s → 18,77 s): 567 ms; onde: centro (4% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▄▅▅▆▆▆▃▄▅▆▆▅▅▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; troca o que está na tela.
  - **19,27** (19,27 s → 19,43 s): SAÍDA · 167 ms; onde: alto, no centro (2% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▄▄▅▅`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P2 · 19,43 s → 33,37 s (13,93 s)

Energia: `▅▄▄▃▅▄▄▄▃▃▄▄▃▅▂▄▆▆▅▄▄▅▃▃▅▃▃▅▃▅▅▄▄▄▃▅▅▅▅▃▃▃▅▂▃▅▄▆`

- Imagem: `planos/plano-02.jpg` · quadros-chave A 19,87 s, B 26,60 s, C 28,97 s
- Fundo: gradiente ou luz suave (borda #0E0D16). Batidas de movimento ocupam 35% do plano.
- Hold: 8,90 s → 10,17 s do plano (1,27 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 28,37 s com 29,53 s): o conteúdo muda demais para medir a câmera por comparação.
- Batidas (tempo dentro do plano):
  - **0,00** (19,43 s → 19,87 s): ENTRADA · 433 ms; onde: centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▅▅▄▄▄▅▄▄▄▄▄▄▄`; entra do desfoque para o foco; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); transforma a composição.
  - **1,27** (20,70 s → 20,87 s): 167 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▅▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **2,10** (21,53 s → 21,70 s): 167 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▄▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **2,97** (22,40 s → 22,87 s): 467 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▄▄▄▄▄▄▄▄▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; acrescenta elemento.
  - **3,80** (23,23 s → 23,50 s): 267 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▃▄▄▅▄▂`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **4,77** (24,20 s → 24,73 s): 533 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▆▆▆▆▄▅▅▅▅▅▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; troca o que está na tela.
  - **5,97** (25,40 s → 25,77 s): 367 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▄▅▅▅▅▃▃▄▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; remove elemento.
  - **6,97** (26,40 s → 26,60 s): 200 ms; onde: meio, à esquerda (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▅▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **7,83** (27,27 s → 27,40 s): 133 ms; onde: meio, à esquerda (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▄▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **8,37** (27,80 s → 27,93 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **8,77** (28,20 s → 28,33 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▂`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **10,17** (29,60 s → 30,67 s): 1067 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▅▄▄▅▅▄▄▄▄▄▄▄▄▄▄▅▅▅▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; acrescenta elemento.
  - **12,17** (31,60 s → 31,80 s): 200 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **13,17** (32,60 s → 32,77 s): 167 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **13,47** (32,90 s → 33,37 s): SAÍDA · 467 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera forte até o fim (ease-in expo, típico de saída para corte); velocidade `▄▄▄▄▄▄▅▅▄▅▅▅▆▆`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; transforma a composição.

### P3 · 33,37 s → 40,97 s (7,60 s)

Energia: `▆▆▅▃▃▄▅▅▅▅▄▃▃▃▅▅▃▃▄▄▃▂▂▅▃▂▄▅▃▅▃▃▃▅▄▄▃▄▅▄▃▃▄▄▃▄▂▆`

- Imagem: `planos/plano-03.jpg` · quadros-chave A 33,73 s, C 36,40 s
- Fundo: gradiente ou luz suave (borda #0E0D16). Batidas de movimento ocupam 34% do plano.
- Hold: 2,43 s → 3,63 s do plano (1,20 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 35,83 s com 36,93 s): o conteúdo muda demais para medir a câmera por comparação.
- Batidas (tempo dentro do plano):
  - **0,00** (33,37 s → 33,73 s): ENTRADA · 367 ms; onde: centro (4% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▆▆▄▅▆▅▅▅▅▅▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); transforma a composição.
  - **0,90** (34,27 s → 34,90 s): 633 ms; onde: centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▅▅▅▅▄▄▄▄▄▄▄▅▅▄▄▃`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; transforma a composição.
  - **2,27** (35,63 s → 35,80 s): 167 ms; onde: embaixo, à esquerda (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▃`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **3,63** (37,00 s → 37,13 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **4,20** (37,57 s → 37,73 s): 167 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▅▃`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **4,60** (37,97 s → 38,13 s): 167 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄▃`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; move/ajusta o que já estava.
  - **5,23** (38,60 s → 39,00 s): 400 ms; onde: centro (1% dos pixels mudando por quadro); curva: arranca rápido e assenta devagar (ease-out forte, tipo expo/quint); velocidade `▄▅▅▅▄▃▃▃▃▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **5,87** (39,23 s → 39,60 s): 367 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▄▃▂▃▄▅▅▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **7,43** (40,80 s → 40,97 s): SAÍDA · 167 ms; onde: alto, no centro (4% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▄▅▅▆▆`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P4 · 40,97 s → 70,00 s (29,03 s)

Energia: `▆▅▅▅▅▅▄▄▄▃▄▄▅▆▅▆▅▄▅▃▆▅▆▄▅▆▆█▅▅▅▃▅▄▄▅▅▅▅▅▅▄▅▄▄▂▅▃`

- Imagem: `planos/plano-04.jpg` · quadros-chave A 41,33 s, C 46,40 s
- Fundo: gradiente ou luz suave (borda #0E0D16). Batidas de movimento ocupam 29% do plano.
- Hold: 3,20 s → 7,67 s do plano (4,47 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 44,20 s com 48,57 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 38% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,00** (40,97 s → 41,33 s): ENTRADA · 367 ms; onde: centro (4% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▆▆▅▅▅▅▅▅▅▄▃`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; transforma a composição.
  - **0,90** (41,87 s → 42,47 s): 600 ms; onde: centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▄▅▅▅▅▅▃▄▅▄▄▄▄▄▄▄▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; transforma a composição.
  - **2,10** (43,07 s → 43,60 s): 533 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▅▅▄▄▅▅▅▅▅▅▅▅▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; acrescenta elemento.
  - **3,07** (44,03 s → 44,17 s): 133 ms; onde: meio, à esquerda (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **7,67** (48,63 s → 48,77 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **8,23** (49,20 s → 49,87 s): 667 ms; onde: centro (3% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▆▆▆▆▄▄▅▄▄▄▄▄▄▄▄▄▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; remove elemento.
  - **9,10** (50,07 s → 50,50 s): 433 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▅▅▅▆▆▆▅▅▄▄▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; acrescenta elemento.
  - **9,97** (50,93 s → 51,10 s): 167 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▃▄▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **11,23** (52,20 s → 52,33 s): 133 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **12,30** (53,27 s → 53,73 s): 467 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▁▅▅▅▅▅▆▅▅▅▄▅▅▄`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; acrescenta elemento.
  - **13,30** (54,27 s → 54,73 s): 467 ms; onde: centro (3% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▅▅▆▆▆▆▅▅▅▄▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **14,53** (55,50 s → 55,70 s): 200 ms; onde: embaixo, à esquerda (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▅▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **15,50** (56,47 s → 56,83 s): 367 ms; onde: centro (4% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▆▆▆▆▅▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **16,63** (57,60 s → 58,10 s): 500 ms; onde: centro (9% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▆▆▇▇▇█▂▂▂▂▄▄▅▄`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; transforma a composição.
  - **17,50** (58,47 s → 58,70 s): 233 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▅▅▄▃`; aparece sem desfoque (opacidade, máscara ou movimento); sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; acrescenta elemento.
  - **18,37** (59,33 s → 59,70 s): 367 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄▄▄▄▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; move/ajusta o que já estava.
  - **19,43** (60,40 s → 60,57 s): 167 ms; onde: centro (2% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄▃`; sai desfocando; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **21,57** (62,53 s → 63,07 s): 533 ms; onde: centro (2% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▅▅▅▄▅▄▄▄▄▄▄▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); transforma a composição.
  - **22,27** (63,23 s → 63,37 s): 133 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄▅▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de cima para baixo; move/ajusta o que já estava.
  - **22,90** (63,87 s → 64,43 s): 567 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▄▃▃▄▄▄▄▄▃▃▃▄▃▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre de baixo para cima; acrescenta elemento.
  - **23,80** (64,77 s → 65,13 s): 367 ms; onde: embaixo, à esquerda (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▄▅▄▄▃▂▃▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **24,57** (65,53 s → 66,03 s): 500 ms; onde: centro (1% dos pixels mudando por quadro); curva: desacelera no fim (ease-out); velocidade `▄▅▅▅▄▄▄▃▃▃▂▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; move/ajusta o que já estava.
  - **25,53** (66,50 s → 66,67 s): 167 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▄▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da direita para a esquerda; move/ajusta o que já estava.
  - **28,30** (69,27 s → 69,40 s): 133 ms; onde: embaixo, no centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▅▃`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

### P5 · 70,00 s → 74,00 s (4,00 s)

Energia: `·▄▄▅▂▄▅▂▂▂·····▂···▁·▁·····▂·▁▁▂▂▂▂▂···▁········`

- Imagem: `planos/plano-05.jpg` · quadros-chave A 70,53 s, C 72,27 s
- Fundo: preto chapado (borda #020204). Batidas de movimento ocupam 9% do plano.
- Hold: 0,53 s → 4,00 s do plano (3,47 s), congelado (imagem parada).
- Câmera (comparando 70,57 s com 73,93 s): o conteúdo muda demais para medir a câmera por comparação.
- Batidas (tempo dentro do plano):
  - **0,17** (70,17 s → 70,53 s): ENTRADA · 367 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▃▄·▅▅▁▂▄·▄▅`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.

## Transições

| De → para | Tempo | Tipo | Duração | Leitura | Imagem |
|---|---|---|---|---|---|
| P1 → P2 | 19,43 s | transição contínua | 600 ms | transformação (elementos viram a próxima tela) | `transicoes/t01-02.jpg` |
| P2 → P3 | 33,37 s | transição contínua | 833 ms | transformação (elementos viram a próxima tela) | `transicoes/t02-03.jpg` |
| P3 → P4 | 40,97 s | transição contínua | 533 ms | transformação (elementos viram a próxima tela) | `transicoes/t03-04.jpg` |
| P4 → P5 | 70,00 s | corte seco | 1 quadro | corte seco, de um quadro calmo para outro (sem movimento forte em volta do corte); o peso da composição fica no mesmo lugar (corte no mesmo eixo) | `cortes/cortes-1.jpg` |

## Som e sincronia

- Sem batida regular clara (98% da trilha é silêncio; provável fala, efeitos ou ambiente). O corte não segue um andamento de música.
- Dos 8 impactos mais fortes do som, 0 têm um corte ou início de movimento a ±2 quadros.
- Dos 4 cortes, 0 (0%) caem a ±2 quadros de um impacto do som; o acaso daria ~2%.
- Impactos mais fortes da trilha (s): 70,40 · 70,68 · 70,76 · 70,84 · 70,94 · 71,02 · 71,34 · 71,44

## Paleta

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| quase preto | `#0D0D14` | 74,6% | 4 | 4 |
| quase preto | `#241D18` | 12,3% | 11 | 5 |
| azul escuro | `#1D1E30` | 6,6% | 12 | 13 |
| laranja | `#675C4E` | 2,0% | 40 | 10 |
| laranja | `#CE8F47` | 1,6% | 64 | 50 |
| cinza claro | `#DCD8D2` | 1,3% | 86 | 3 |
| rosa | `#913F63` | 0,9% | 39 | 39 |
| roxo | `#8D3FA9` | 0,6% | 41 | 66 |

Acentos (só as cores saturadas, mesmo pequenas: degradês, brilhos, palavras em destaque):

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| laranja | `#DC9A47` | 1,11% | 69 | 55 |
| laranja | `#8F5F3A` | 1,00% | 45 | 33 |
| magenta | `#6E2F51` | 0,71% | 29 | 33 |
| azul | `#36426D` | 0,46% | 29 | 28 |
| roxo | `#8140B2` | 0,40% | 40 | 69 |
| magenta | `#DE529B` | 0,35% | 56 | 62 |

Por plano (4 mais presentes): P1 #100F17 #2F2720 #D59E65 #AB48B1 · P2 #0E0E16 #1B1E2F #2E2622 #AF8A6C · P3 #0F0E16 #2A221C #2B2746 #A8A3A2 · P4 #121017 #7D5E43 #E1CDB1 #853769 · P5 #040305 #2F2519 #2D1029 #A09EA1

## Rascunho do roteiro reverso (preencher olhando as imagens)

Mesma forma do storyboard: plano, duração, quadros-chave e batidas com o tempo dentro do plano. Os tempos já estão
medidos; troque cada `[…]` pelo que se vê nas folhas (o que entra, de onde, como, em que unidade, com que curva).

```
P1 · 19,4 s · fundo gradiente ou luz suave
  quadro A (0,4): […primeiro estado legível]
  quadro C (5,2): […composição final]
  0,0  […] (367 ms, in-out)
  0,7  […] (133 ms, in-out)
  1,6  […] (133 ms, in-out, sai desfocando)
  2,3  […] (400 ms, in)
  3,8  […] (633 ms, in-out)
  5,9  […] (300 ms, linear)
  6,5  […] (333 ms, in-out)
  7,2  […] (1067 ms, in-out)
  8,4  […] (33 ms, seco)
  8,7  […] (400 ms, in)
  10,6  […] (533 ms, out)
  11,8  […] (167 ms, in-out, sai desfocando)
  13,0  […] (133 ms, in-out, sai desfocando)
  13,7  […] (167 ms, in-out)
  14,9  […] (833 ms, in-out)
  16,7  […] (167 ms, in-out, sai desfocando)
  17,6  […] (100 ms, linear)
  18,2  […] (567 ms, out)
  19,3  […] (167 ms, in)
  19,4  → transformação (elementos viram a próxima tela)
P2 · 13,9 s · fundo gradiente ou luz suave
  quadro A (0,4): […primeiro estado legível]
  quadro B (7,2): […]
  quadro C (9,5): […composição final]
  0,0  […] (433 ms, out, desfoque→foco)
  1,3  […] (167 ms, in-out)
  2,1  […] (167 ms, in-out)
  3,0  […] (467 ms, in-out)
  3,8  […] (267 ms, in)
  4,8  […] (533 ms, in-out)
  6,0  […] (367 ms, in-out)
  7,0  […] (200 ms, in-out)
  7,8  […] (133 ms, in-out)
  8,4  […] (133 ms, in-out)
  8,8  […] (133 ms, in-out)
  10,2  […] (1067 ms, in-out)
  12,2  […] (200 ms, in-out)
  13,2  […] (167 ms, in-out)
  13,5  […] (467 ms, in-forte)
  13,9  → transformação (elementos viram a próxima tela)
P3 · 7,6 s · fundo gradiente ou luz suave
  quadro A (0,4): […primeiro estado legível]
  quadro C (3,0): […composição final]
  0,0  […] (367 ms, out)
  0,9  […] (633 ms, out)
  2,3  […] (167 ms, in-out, sai desfocando)
  3,6  […] (133 ms, in-out)
  4,2  […] (167 ms, in-out, sai desfocando)
  4,6  […] (167 ms, in-out)
  5,2  […] (400 ms, out-forte)
  5,9  […] (367 ms, in)
  7,4  […] (167 ms, in, sai desfocando)
  7,6  → transformação (elementos viram a próxima tela)
P4 · 29,0 s · fundo gradiente ou luz suave
  quadro A (0,4): […primeiro estado legível]
  quadro C (5,4): […composição final]
  0,0  […] (367 ms, out)
  0,9  […] (600 ms, out)
  2,1  […] (533 ms, in-out)
  3,1  […] (133 ms, in-out)
  7,7  […] (133 ms, in-out)
  8,2  […] (667 ms, out)
  9,1  […] (433 ms, in-out)
  10,0  […] (167 ms, in)
  11,2  […] (133 ms, in-out)
  12,3  […] (467 ms, in-out)
  13,3  […] (467 ms, in-out)
  14,5  […] (200 ms, in-out)
  15,5  […] (367 ms, in-out)
  16,6  […] (500 ms, out)
  17,5  […] (233 ms, in-out)
  18,4  […] (367 ms, in-out)
  19,4  […] (167 ms, in-out, sai desfocando)
  21,6  […] (533 ms, out)
  22,3  […] (133 ms, in-out)
  22,9  […] (567 ms, out)
  23,8  […] (367 ms, out)
  24,6  […] (500 ms, out)
  25,5  […] (167 ms, in-out)
  28,3  […] (133 ms, in-out)
  29,0  → corte seco, de um quadro calmo para outro (sem movimento forte em volta do corte); o peso da composição fica no mesmo lugar (corte no mesmo eixo)
P5 · 4,0 s · fundo preto chapado
  quadro A (0,5): […primeiro estado legível]
  quadro C (2,3): […composição final]
  0,2  […] (367 ms, in-out)
```

## Linguagem de movimento da referência (rascunho para o storyboard)

- **Ritmo**: livre (sem grade de andamento); planos de 13,9 s na mediana; acelera: o primeiro terço tem planos de 19,4 s e o último de 4,0 s, durações variadas.
- **Entradas**: duração típica 367 ms; curvas ease-out 3, ease-in-out 2. […unidade (letra/palavra/linha/bloco), atraso entre unidades, de onde vem, desfoque/opacidade/máscara]
- **Hold**: 1,53 s na mediana; 4 vivos, 1 congelados, 0 em movimento contínuo. […o que se mexe no hold]
- **Saídas**: 3 plano(s) com saída animada (mediana 167 ms; curvas ease-in 2, ease-in forte 1); 2 cortam direto do hold, sem saída animada.
- **Câmera**: nada conclusivo medido. […mergulhos, paralaxe entre camadas]
- **Cortes**: 1 secos, 0 por tela lisa, 3 contínuos. […mesmo eixo? match de forma? corte no movimento?]
- **Luz e cor**: quase preto #0D0D14, quase preto #241D18, azul escuro #1D1E30. […gradiente, brilho que atravessa, grão, vinheta]
- **Profundidade**: […camadas, desfoque de profundidade, motion blur]

## Limites desta leitura

- "Energia" é a diferença média de brilho entre quadros: mede quanto a imagem muda, não o que muda. Opacidade, foco, cor e movimento somam juntos.
- A curva é estimada pela forma da energia; quando várias letras/objetos entram em cascata, ela descreve o conjunto, não cada peça. Confirme na folha.
- Câmera e movimento de objeto só se separam quando há textura no fundo. Em fundo chapado, "sobe/desliza/cresce" é o que se move na tela, não a câmera.
- Texto não é lido (sem OCR): leia nas imagens.
