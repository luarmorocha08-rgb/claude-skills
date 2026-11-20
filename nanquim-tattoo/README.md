# NANQUIM — site do estúdio de tatuagem

Site estático (um único `index.html`). Publicar: importar esta pasta na Vercel (Root Directory = `nanquim-tattoo`, sem build).

- **Corpo 3D realista**: malha MakeHuman (CC0) + three.js; a tattoo é projetada na pele (DecalGeometry).
- **Ver no meu corpo**: câmera ao vivo + rastreamento corporal (MediaPipe) em HTTPS. Dentro de apps/iframes que bloqueiam a câmera, abre a câmera nativa do celular (foto) e aplica a tattoo por cima.
- Troque o número do WhatsApp em `WHATSAPP` e os textos de endereço/artistas.

`src/`: fontes. `python3 src/mkbody.py` gera `bodydata.js` a partir do MakeHuman; `python3 src/assemble.py <url-publicada>` monta o `index.html`.
