/* _comum.js — o que as cenas dividem.
   · Faisca.svg(): o fio condutor do filme, uma faísca de oito raios afinados (desenhada para este
     filme). Cada raio é um <g class="fz-raio"> próprio, para poder esticar, girar e apagar sozinho.
   · Pos(el): o centro e o tamanho de um elemento no quadro natural (sem transformações), em cqw a
     partir do centro do quadro. Use no montar.
   · OFICIOS: os oito ofícios (a mesma lista no sol, nos cartões e nas miniaturas).
   · Cartoes.html(k): o cartão-artefato de cada ofício. Tudo dentro é medido pela largura do cartão
     (cqi): o mesmo cartão fica idêntico pequeno na miniatura do storyboard e grande na órbita, o que
     deixa o mergulho entre as duas cenas invisível.
   · Minis.html(n): as miniaturas das seis cenas para a prancha da cena "bastidor". */
(function () {
  let n = 0;
  const raio = 'M -6.6 4 C -7.2 -12, -4.4 -33, -2.9 -42.5 Q 0 -49.5 2.9 -42.5 C 4.4 -33, 7.2 -12, 6.6 4 Z';
  window.Faisca = {
    svg({ classe = '', raios = 8 } = {}) {
      const id = `fz-g-${n++}`;
      const g = [];
      for (let k = 0; k < raios; k++) g.push(`<g class="fz-raio" style="transform:rotate(${(k * 360) / raios}deg)"><path d="${raio}"/></g>`);
      return `<svg class="faisca ${classe}" viewBox="-50 -50 100 100" aria-hidden="true"><defs>`
        + `<radialGradient id="${id}" cx="0" cy="0" r="48" gradientUnits="userSpaceOnUse">`
        + `<stop offset="0" style="stop-color:var(--brilho)"/><stop offset=".1" style="stop-color:var(--brilho)"/>`
        + `<stop offset=".36" style="stop-color:var(--destaque)"/><stop offset="1" style="stop-color:var(--luz-3)"/>`
        + `</radialGradient></defs><g class="fz-corpo" fill="url(#${id})">${g.join('')}</g></svg>`;
    },
  };

  // pulso de batida sem tranco: sobe em `ataque` s (3 quadros a 60 qps) numa rampa suave e decai
  window.Pulso = function (t, t0, { ataque = 0.05, decai = 0.3 } = {}) {
    const u = t - t0;
    if (u <= 0) return 0;
    if (u < ataque) { const x = u / ataque; return x * x * (3 - 2 * x); }
    return Math.exp(-(u - ataque) / decai);
  };
  // o pulso da batida mais recente numa grade (período P a partir de t0), contínuo entre batidas
  window.PulsoGrade = function (t, t0, P, op = {}) {
    if (t < t0) return 0;
    const n = Math.floor((t - t0) / P);
    return Math.max(window.Pulso(t, t0 + n * P, op), n > 0 ? window.Pulso(t, t0 + (n - 1) * P, op) : 0);
  };

  window.Pos = function (el) {
    const palco = Motion.palco;
    let x = 0, y = 0;
    for (let e = el; e && e !== palco; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; }
    const CQ = palco.offsetWidth / 100;
    return {
      x: (x + el.offsetWidth / 2 - palco.offsetWidth / 2) / CQ,
      y: (y + el.offsetHeight / 2 - palco.offsetHeight / 2) / CQ,
      w: el.offsetWidth / CQ,
      h: el.offsetHeight / CQ,
    };
  };

  // ângulo 0 = direita, sentido horário (y para baixo). "Motion design" fica à direita: é nele que a
  // câmera mergulha.
  window.OFICIOS = [
    { nome: 'Motion design', id: 'motion' },
    { nome: 'Planilhas', id: 'planilha' },
    { nome: 'Apresentações', id: 'deck' },
    { nome: 'Documentos', id: 'documento' },
    { nome: 'Código', id: 'codigo' },
    { nome: 'Gráficos', id: 'grafico' },
    { nome: 'Storyboards', id: 'storyboard' },
    { nome: 'Campanhas', id: 'campanha' },
  ];

  const r = (i, k) => {
    const x = Math.sin((i + 1) * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const rep = (q, f) => Array.from({ length: q }, (_, i) => f(i)).join('');

  const ARTE = {
    motion: () => `<span class="ar-motion">${window.Faisca.svg({ classe: 'ar-fz' })}
      <span class="ar-trilho"><span class="ar-fio"></span>${rep(5, (i) => `<span class="ar-chave" style="left:${8 + i * 21}%"></span>`)}</span></span>`,
    planilha: () => `<span class="ar-grade">${rep(30, (i) => {
      const col = i % 5, lin = Math.floor(i / 5);
      const cls = lin === 0 ? 'cab' : col === 3 ? 'ac' : '';
      const w = lin === 0 ? 70 : 35 + Math.round(55 * r(i, 2));
      return `<span class="cel ${cls}"><i style="width:${w}%;--a:${(0.35 + 0.6 * r(i, 4)).toFixed(2)}"></i></span>`;
    })}</span>`,
    deck: () => `<span class="ar-slide"><span class="sl-tit"></span><span class="sl-sub"></span>
      <span class="sl-barras">${rep(4, (i) => `<i style="height:${[38, 58, 46, 86][i]}%"></i>`)}</span>
      <span class="sl-lin">${rep(3, (i) => `<i style="width:${[78, 64, 70][i]}%"></i>`)}</span></span>`,
    documento: () => `<span class="ar-pagina"><span class="pg-tit"></span>${rep(8, (i) => `<i style="width:${i === 3 || i === 7 ? 58 : 88 + Math.round(10 * r(i, 3))}%"></i>`)}</span>`,
    codigo: () => `<span class="ar-codigo">${rep(8, (i) => {
      const ind = [0, 1, 2, 2, 1, 2, 1, 0][i];
      const segs = rep(1 + Math.floor(r(i, 5) * 3), (j) => `<i class="t${(i + j) % 3}" style="width:${10 + Math.round(22 * r(i, j + 7))}cqi"></i>`);
      return `<span class="cd-lin" style="padding-left:${ind * 6}cqi">${segs}</span>`;
    })}</span>`,
    grafico: () => `<span class="ar-grafico">${rep(7, (i) => `<i class="${i === 6 ? 'ac' : ''}" style="height:${[24, 32, 29, 45, 52, 66, 88][i]}%"></i>`)}</span>`,
    storyboard: () => `<span class="ar-story">${rep(6, (i) => `<span class="sb-q"><i style="width:${30 + Math.round(40 * r(i, 9))}%"></i></span>`)}</span>`,
    campanha: () => `<span class="ar-campanha">${rep(3, (i) => `<span class="cp-p cp-${i}"><i></i></span>`)}</span>`,
  };

  window.Cartoes = {
    html(k, { classe = '', extra = '' } = {}) {
      const o = window.OFICIOS[k];
      return `<div class="cartao ct-${o.id} ${classe}" ${extra}><span class="ct-arte">${ARTE[o.id]()}</span><span class="ct-nome">${o.nome}</span></div>`;
    },
  };

  // as miniaturas das cenas (a prancha do storyboard dentro do filme)
  const sol = () => {
    const pal = window.OFICIOS.map((o, k) => {
      const a = (k * Math.PI) / 4, c = Math.cos(a), s = Math.sin(a);
      const al = c > 0.35 ? 'e' : c < -0.35 ? 'd' : s < 0 ? 'ct' : 'cb';
      return `<span class="mn-of al-${al}" style="left:${(50 + 25.5 * c).toFixed(2)}%;top:${(50 + 33 * s).toFixed(2)}%">${o.nome}</span>`;
    }).join('');
    const fx = window.OFICIOS.map((o, k) => `<i class="mn-fx" style="transform:rotate(${k * 45}deg)"></i>`).join('');
    return `<span class="mn-sol">${fx}${window.Faisca.svg({ classe: 'mn-fz' })}</span>${pal}`;
  };
  const MINI = [
    () => `<span class="mn-pilha"><span class="mn-frase">Faz um vídeo que <span class="destaque">surpreenda</span><i class="mn-cursor"></i></span></span>`,
    () => `<span class="mn-pilha"><span class="mn-lock">${window.Faisca.svg({ classe: 'mn-fz2' })}<span class="mn-marca">Claude</span></span><span class="mn-sub">com <span class="destaque">skills</span></span></span>`,
    sol,
    () => `<span class="mn-pilha"><span class="mn-frase mn-f4">Inclusive <span class="destaque">este vídeo</span></span><span class="mn-tira">${rep(6, (i) => `<i class="${i === 3 ? 'eu' : ''}"></i>`)}</span></span>`,
    () => `<span class="mn-um">${window.Cartoes.html(0, { classe: 'mn-cartao' })}</span>`,
    () => `<span class="mn-pilha"><span class="mn-lock">${window.Faisca.svg({ classe: 'mn-fz2' })}<span class="mn-marca">Claude</span></span><span class="mn-sub mn-sub6">Ensine uma skill, ganhe um <span class="destaque">especialista</span></span></span>`,
  ];
  window.Minis = { html: (i) => MINI[i]() };
})();
