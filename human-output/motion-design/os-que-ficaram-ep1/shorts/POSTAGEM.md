# Os Que Ficaram — Resumo do EP1 (YouTube Shorts)

Vídeo: `Os-Que-Ficaram-EP1-Resumo-Shorts.mp4` — 1080×1920, 30 qps, 62,9 s, narração e efeitos originais do EP1.

## Título
A nave levou metade do mundo… e bateram na sua porta 👽 #shorts

## Descrição
Você descobre que o mundo está acabando enquanto espera o café ficar pronto.
Resumo do Episódio 1 de OS QUE FICARAM — "A Metade". O episódio completo está no canal.

Você abriria a porta? Comenta aí 👇

#osqueficaram #animação #stickman #alienígenas #terror #shorts

## Como foi montado
- 16 trechos do EP1 (tempos em `montagem/segs.json`), re-renderizados em 2× e recortados em 4:5 no centro do quadro vertical, com fundo desfocado.
- Legendas palavra a palavra a partir de `audio/palavras.json` (`montagem/legendas.ass`).
- Refazer: `node montagem/render2x.mjs` e depois `python3 montagem/build.py all` (rodar a partir de uma pasta com `segs.json` e `fonts/`).
