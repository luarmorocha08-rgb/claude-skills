# Leitura da referência: 01-slide.mp4

> Medições automáticas, quadro a quadro. Elas apontam ONDE olhar e dão os números (tempos, durações, curvas);
> a descrição do que acontece (tipografia, objetos, estilo) vem de abrir as imagens. Onde o número e o olho
> discordarem, vale o olho.

## Ficha técnica

| | |
|---|---|
| Arquivo | `/home/user/claude-skills/human-output/motion-design/domingo-ramoraul/referencias/01-slide.mp4` |
| Trecho analisado | 0,00 s a 8,00 s (240 quadros) |
| Duração do arquivo | 8,00 s |
| Formato | 1080×1350, 4:5 vertical |
| Quadros por segundo | 30 |
| Um quadro dura | 33 ms |
| Codec / cor | h264 · yuv420p · bt470bg |
| Som | aac, 2 canal(is), 44100 Hz (trilha muda) |

## Em uma olhada

- **1 planos** em 8,00 s: duração média 8,00 s, mediana 8,00 s, do mais curto (8,00 s) ao mais longo (8,00 s).
- **Transições**: 0 corte(s) seco(s), 0 corte(s) com quadro intermediário, 0 passagem(ns) por tela lisa (preto/branco/cor), 0 transição(ões) contínua(s) sem corte.
- **Tempo de tela**: 0% em batidas de movimento, 0% em hold vivo, 99% em movimento contínuo (filmagem/câmera), 0% congelado, 0% em tela lisa, 0% em cortes e transições.
- **Batidas de movimento medidas**: nenhuma se destaca do movimento de fundo de cada plano (o movimento é contínuo ou a imagem fica parada).
- **Ritmo de corte**: poucos planos para ler uma tendência.
- **Som**: a trilha existe mas está muda.
- **Cor**: domina quase preto #0F1113 (83% da tela no tempo); o mais claro é cinza claro #D5D7D8 (contraste 13,1:1 com o dominante); acentos saturados: rosa #EB4470 (1,0%), magenta #946D9A (0,55%), laranja #D8A086 (0,52%).

## Imagens, na ordem de leitura

1. `00-linha-do-tempo.png`: o vídeo inteiro no tempo. De cima para baixo: **COR** (cada coluna é o quadro espremido), **PLANOS**, **ESTADO** (branco = batida de movimento, verde = hold vivo, ciano = movimento contínuo, cinza = congelado, azul-escuro = tela lisa, vermelho = corte), **ENERGIA** (escala log; tracinhos amarelos = início de cada batida; faixas azuis = tela lisa; faixas laranja = transição contínua), **FOCO** (sobe = mais nítido), **LUZ** (brilho médio), **CAMERA** (verde para cima = aproxima, roxo para baixo = afasta; a linha clara é a velocidade de deslocamento). Linhas vermelhas verticais = cortes secos.
2. `01-planos-1.jpg`: storyboard reverso, os quadros-chave A (primeiro estado legível), B (meio) e C (composição final do hold, rótulo amarelo) de cada plano.
3. `planos/plano-NN.jpg`: folha de contato de cada plano, densa nas batidas (10 qps) e espaçada no hold; a faixa de baixo é a energia do plano com o número de cada quadro.
4. `paleta.png`: cores dominantes (global e por plano).

Dados: `dados.json` (tudo o que está aqui, estruturado) e `quadros.csv` (uma linha por quadro: energia, foco, luz, câmera, estado).

Para ver um trecho quadro a quadro, rode de novo com `--zoom a-b` (todos os quadros entre a e b segundos).

## Planos

| Plano | Tempo | Duração | Batidas | Entrada | Hold | Saída | Câmera | Fundo |
|---|---|---|---|---|---|---|---|---|
| P1 | 0,00–8,00 | 8,00 s | 0 | – | 8,00 s, contínuo | corta do hold, sem saída | afasta 3% | gradiente ou luz suave #131414 |

### P1 · 0,00 s → 8,00 s (8,00 s)

Energia: `▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅▅`

- Imagem: `planos/plano-01.jpg` · quadros-chave A 0,00 s, C 4,00 s
- Fundo: gradiente ou luz suave (borda #131414). Batidas de movimento ocupam 0% do plano.
- Hold: 0,00 s → 8,00 s do plano (8,00 s), em movimento contínuo (filmagem, câmera ou fundo animado).
- Câmera (comparando 0,03 s com 7,93 s): o conteúdo muda demais para medir a câmera por comparação.
- Câmera pelo fluxo (textura em 61% do quadro, somado no plano): afasta 3% (pull-out).
- Nenhuma batida de movimento acima do ruído do plano.

## Transições

Um plano só, sem transições.

## Paleta

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| quase preto | `#0F1113` | 82,8% | 5 | 1 |
| laranja escuro | `#3C3023` | 8,3% | 21 | 11 |
| cinza | `#686362` | 3,6% | 42 | 2 |
| cinza claro | `#D5D7D8` | 2,3% | 86 | 1 |
| laranja | `#D59E73` | 1,0% | 69 | 34 |
| rosa | `#E94671` | 1,0% | 55 | 66 |
| roxo | `#AF9EC4` | 0,9% | 68 | 22 |

Acentos (só as cores saturadas, mesmo pequenas: degradês, brilhos, palavras em destaque):

| Cor | Hex | Parte da tela | Luminosidade | Saturação |
|---|---|---|---|---|
| rosa | `#EB4470` | 1,00% | 55 | 67 |
| magenta | `#946D9A` | 0,55% | 51 | 30 |
| laranja | `#D8A086` | 0,52% | 70 | 28 |
| laranja | `#765233` | 0,40% | 38 | 27 |
| laranja | `#EB9B49` | 0,29% | 71 | 58 |
| azul | `#52C9F1` | 0,23% | 76 | 36 |

Por plano (4 mais presentes): P1 #0E1013 #3D362D #C2C0C9 #C2926C

## Rascunho do roteiro reverso (preencher olhando as imagens)

Mesma forma do storyboard: plano, duração, quadros-chave e batidas com o tempo dentro do plano. Os tempos já estão
medidos; troque cada `[…]` pelo que se vê nas folhas (o que entra, de onde, como, em que unidade, com que curva).

```
P1 · 8,0 s · fundo gradiente ou luz suave
  quadro A (0,0): […primeiro estado legível]
  quadro C (4,0): […composição final]
```

## Linguagem de movimento da referência (rascunho para o storyboard)

- **Ritmo**: livre (sem grade de andamento); planos de 8,0 s na mediana; poucos planos para ler uma tendência.
- **Entradas**: duração típica –; curvas –. […unidade (letra/palavra/linha/bloco), atraso entre unidades, de onde vem, desfoque/opacidade/máscara]
- **Hold**: 8,00 s na mediana; 0 vivos, 0 congelados, 1 em movimento contínuo. […o que se mexe no hold]
- **Saídas**: 0 plano(s) com saída animada (mediana –; curvas –); 1 cortam direto do hold, sem saída animada.
- **Câmera**: nada conclusivo medido. […mergulhos, paralaxe entre camadas]
- **Cortes**: 0 secos, 0 por tela lisa, 0 contínuos. […mesmo eixo? match de forma? corte no movimento?]
- **Luz e cor**: quase preto #0F1113, laranja escuro #3C3023, cinza #686362. […gradiente, brilho que atravessa, grão, vinheta]
- **Profundidade**: […camadas, desfoque de profundidade, motion blur]

## Limites desta leitura

- "Energia" é a diferença média de brilho entre quadros: mede quanto a imagem muda, não o que muda. Opacidade, foco, cor e movimento somam juntos.
- A curva é estimada pela forma da energia; quando várias letras/objetos entram em cascata, ela descreve o conjunto, não cada peça. Confirme na folha.
- Câmera e movimento de objeto só se separam quando há textura no fundo. Em fundo chapado, "sobe/desliza/cresce" é o que se move na tela, não a câmera.
- Texto não é lido (sem OCR): leia nas imagens.
