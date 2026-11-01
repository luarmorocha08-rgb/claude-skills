# Leitura da referência: 68391b3a-Screen_Recording_20261101_055833_Instagram.mp4

> Medições automáticas, quadro a quadro. Elas apontam ONDE olhar e dão os números (tempos, durações, curvas);
> a descrição do que acontece (tipografia, objetos, estilo) vem de abrir as imagens. Onde o número e o olho
> discordarem, vale o olho.

## Ficha técnica

| | |
|---|---|
| Arquivo | `/root/.claude/uploads/0019f62e-aa7f-5581-8066-9a6e5ba0f8a6/68391b3a-Screen_Recording_20261101_055833_Instagram.mp4` |
| Trecho analisado | 0,00 s a 12,82 s (769 quadros) |
| Duração do arquivo | 12,83 s |
| Formato | 1080×2340, 0,46:1 vertical |
| Quadros por segundo | 61,694 (variável no arquivo; lido como constante) · analisado a 60 qps |
| Um quadro dura | 17 ms |
| Codec / cor | h264 · yuv420p · bt709 · bt709 |
| Som | aac, 2 canal(is), 48000 Hz |

## Em uma olhada

- **1 planos** em 12,82 s: duração média 12,82 s, mediana 12,82 s, do mais curto (12,82 s) ao mais longo (12,82 s).
- **Transições**: 0 corte(s) seco(s), 0 corte(s) com quadro intermediário, 0 passagem(ns) por tela lisa (preto/branco/cor), 0 transição(ões) contínua(s) sem corte.
- **Tempo de tela**: 53% em batidas de movimento, 47% em hold vivo, 0% em movimento contínuo (filmagem/câmera), 0% congelado, 0% em tela lisa, 0% em cortes e transições.
- **Batidas de movimento medidas**: 5 (média de 0,4 por segundo). Duração típica de um movimento: 733 ms (metade fica entre 633 ms e 767 ms).
- **Curvas** (pela forma da energia): ease-in-out 4 · ease-in 1.
- **Ritmo de corte**: poucos planos para ler uma tendência.
- **Som**: sem batida regular: a trilha parece fala, efeitos ou ambiente.
- **Cor**: domina preto #020304 (69% da tela no tempo); o mais claro é laranja pastel #D5C6C0 (contraste 12,5:1 com o dominante); acentos saturados: laranja #A76345 (4,1%), laranja #713F2A (0,81%), laranja #C68F75 (0,74%).

## Imagens, na ordem de leitura

1. `00-linha-do-tempo.png`: o vídeo inteiro no tempo. De cima para baixo: **COR** (cada coluna é o quadro espremido), **PLANOS**, **ESTADO** (branco = batida de movimento, verde = hold vivo, ciano = movimento contínuo, cinza = congelado, azul-escuro = tela lisa, vermelho = corte), **ENERGIA** (escala log; tracinhos amarelos = início de cada batida; faixas azuis = tela lisa; faixas laranja = transição contínua), **FOCO** (sobe = mais nítido), **LUZ** (brilho médio), **CAMERA** (verde para cima = aproxima, roxo para baixo = afasta; a linha clara é a velocidade de deslocamento), **SOM** (ataques do som; pontos amarelos = impactos). Linhas vermelhas verticais = cortes secos.
2. `01-planos-1.jpg`: storyboard reverso, os quadros-chave A (primeiro estado legível), B (meio) e C (composição final do hold, rótulo amarelo) de cada plano.
3. `planos/plano-NN.jpg`: folha de contato de cada plano, densa nas batidas (10 qps) e espaçada no hold; a faixa de baixo é a energia do plano com o número de cada quadro.
4. `paleta.png`: cores dominantes (global e por plano).

Dados: `dados.json` (tudo o que está aqui, estruturado) e `quadros.csv` (uma linha por quadro: energia, foco, luz, câmera, estado).

Para ver um trecho quadro a quadro, rode de novo com `--zoom a-b` (todos os quadros entre a e b segundos). Os trechos que mais valem um zoom: `--zoom 12,00-12,90` (P1, saída de 767 ms); `--zoom 0,00-4,67` (P1, entrada de 4550 ms); `--zoom 9,80-10,67` (P1, batida de 733 ms).

## Planos

| Plano | Tempo | Duração | Batidas | Entrada | Hold | Saída | Câmera | Fundo |
|---|---|---|---|---|---|---|---|---|
| P1 | 0,00–12,82 | 12,82 s | 5 | 4550 ms, in | 3,25 s, vivo | 767 ms, in-out | câmera estável | imagem, textura ou filmagem #0B0C0E |

### P1 · 0,00 s → 12,82 s (12,82 s)

Energia: `▅▅▅▄▄▄▄▄▄▅▅▅▅▅▆▆▆▆▃▃▄▄▄▃▄▃▃▃▃▄▃▂▃▂▃▄▄▄▅▄▅▅▅▄▃▅▆▆`

- Imagem: `planos/plano-01.jpg` · quadros-chave A 4,58 s, C 8,22 s
- Fundo: imagem, textura ou filmagem (borda #0B0C0E). Batidas de movimento ocupam 53% do plano.
- Hold: 6,60 s → 9,85 s do plano (3,25 s), vivo (algo continua se mexendo de leve).
- Câmera (comparando 6,62 s com 9,82 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 57% do quadro, somado no plano): câmera estável (parada, tripé ou deriva mínima).
- Batidas (tempo dentro do plano):
  - **0,03** (0,03 s → 4,58 s): ENTRADA · 4550 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera para o fim (ease-in); velocidade `▅▅▅▅▄▄▄▄▄▄▄▄▄▅▅▅▅▅▅▅▆▆▆▆`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); acrescenta elemento.
  - **6,50** (6,50 s → 6,60 s): 100 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▂▄▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **9,85** (9,85 s → 10,58 s): 733 ms; onde: embaixo, no centro (0% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▄▄▄▃▄▄▄▄▄▃▅▅▄▄▄▄▄▄▃▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **10,75** (10,75 s → 11,38 s): 633 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▅▄▄▄▄▄▄▅▅▅▅▅▅▅▅▅▅▅▅▄▄▄▄`; nitidez estável; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); move/ajusta o que já estava.
  - **12,05** (12,05 s → 12,82 s): SAÍDA · 767 ms; onde: centro (1% dos pixels mudando por quadro); curva: acelera e desacelera (ease-in-out); velocidade `▄▄▄▄▅▅▅▅▅▅▅▅▅▆▆▆▆▆▅▅▅▅▅▅`; some sem desfoque; sem deslocamento medido (mudança de opacidade, foco, máscara ou rápida demais para medir); varre da esquerda para a direita; acrescenta elemento.

## Transições

Um plano só, sem transições.

## Som e sincronia

- Sem batida regular clara (provável fala, efeitos ou ambiente). O corte não segue um andamento de música.
- Dos 34 impactos mais fortes do som, 1 têm um corte ou início de movimento a ±2 quadros.
- Impactos mais fortes da trilha (s): 0,13 · 0,31 · 3,10 · 3,62 · 3,89 · 4,10 · 4,94 · 5,11 · 5,23 · 5,63 · 5,89 · 6,07 · 6,33 · 6,67 · 6,88 · 7,02 · 7,42 · 7,83 · 8,00 · 8,11 · 8,41 · 8,50 · 8,85 · 9,15

## Paleta

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| preto | `#020304` | 68,8% | 1 | 0 |
| laranja pastel | `#D5C6C0` | 10,4% | 81 | 6 |
| cinza escuro | `#25272B` | 7,4% | 16 | 3 |
| cinza | `#8F8787` | 4,1% | 57 | 3 |
| laranja | `#AE6A4C` | 4,1% | 52 | 37 |
| cinza | `#565254` | 3,3% | 35 | 2 |
| laranja | `#73422E` | 1,8% | 33 | 28 |
| vermelho | `#B6444B` | 0,2% | 45 | 51 |

Acentos (só as cores saturadas, mesmo pequenas: degradês, brilhos, palavras em destaque):

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| laranja | `#A76345` | 4,07% | 49 | 38 |
| laranja | `#713F2A` | 0,81% | 32 | 30 |
| laranja | `#C68F75` | 0,74% | 64 | 28 |
| vermelho | `#C62029` | 0,21% | 43 | 74 |

Por plano (4 mais presentes): P1 #030405 #D2C3BE #333032 #A36146

## Rascunho do roteiro reverso (preencher olhando as imagens)

Mesma forma do storyboard: plano, duração, quadros-chave e batidas com o tempo dentro do plano. Os tempos já estão
medidos; troque cada `[…]` pelo que se vê nas folhas (o que entra, de onde, como, em que unidade, com que curva).

```
P1 · 12,8 s · fundo imagem, textura ou filmagem
  quadro A (4,6): […primeiro estado legível]
  quadro C (8,2): […composição final]
  0,0  […] (4550 ms, in)
  6,5  […] (100 ms, in-out)
  9,8  […] (733 ms, in-out)
  10,8  […] (633 ms, in-out)
  12,1  […] (767 ms, in-out)
```

## Linguagem de movimento da referência (rascunho para o storyboard)

- **Ritmo**: livre (sem grade de andamento); planos de 12,8 s na mediana; poucos planos para ler uma tendência.
- **Entradas**: duração típica 4550 ms; curvas ease-in 1. […unidade (letra/palavra/linha/bloco), atraso entre unidades, de onde vem, desfoque/opacidade/máscara]
- **Hold**: 3,25 s na mediana; 1 vivos, 0 congelados, 0 em movimento contínuo. […o que se mexe no hold]
- **Saídas**: 1 plano(s) com saída animada (mediana 767 ms; curvas ease-in-out 1); 0 cortam direto do hold, sem saída animada.
- **Câmera**: nada conclusivo medido. […mergulhos, paralaxe entre camadas]
- **Cortes**: 0 secos, 0 por tela lisa, 0 contínuos. […mesmo eixo? match de forma? corte no movimento?]
- **Luz e cor**: preto #020304, laranja pastel #D5C6C0, cinza escuro #25272B. […gradiente, brilho que atravessa, grão, vinheta]
- **Profundidade**: […camadas, desfoque de profundidade, motion blur]

## Limites desta leitura

- "Energia" é a diferença média de brilho entre quadros: mede quanto a imagem muda, não o que muda. Opacidade, foco, cor e movimento somam juntos.
- A curva é estimada pela forma da energia; quando várias letras/objetos entram em cascata, ela descreve o conjunto, não cada peça. Confirme na folha.
- Câmera e movimento de objeto só se separam quando há textura no fundo. Em fundo chapado, "sobe/desliza/cresce" é o que se move na tela, não a câmera.
- Texto não é lido (sem OCR): leia nas imagens.
