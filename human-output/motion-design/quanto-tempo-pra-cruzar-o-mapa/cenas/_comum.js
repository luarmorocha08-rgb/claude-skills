/* _comum.js — o mundo de Vice City ao pôr do sol, dividido por todas as cenas.
   Fio condutor: a linha do horizonte. Ela abre o filme, vira o chão de onde as torres de dinheiro
   sobem e é onde o sol se põe no fim.
   Vice.cenario({ sol, palmas, skyline }) → HTML das camadas (céu, sol, mar, skyline, palmeiras).
   Vice.torre({ classe, rotulo, valor, nota }) → um paralelepípedo 3D (CSS preserve-3d) com a altura
   em --h; o rótulo viaja no topo, sempre de frente para a câmera. */
(function () {
  const rnd = (i, k) => {
    const x = Math.sin((i + 1) * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  // silhueta da cidade (prédios retangulares com alguns topos de antena), viewBox 1000×120
  function skyline(semente, largura = 1000) {
    let x = 0, i = 0, d = '';
    while (x < largura) {
      const w = 14 + rnd(i, semente) * 34;
      const alto = rnd(i, semente + 1) < 0.18;
      const h = alto ? 60 + rnd(i, semente + 2) * 55 : 12 + rnd(i, semente + 3) * 42;
      d += `M${x.toFixed(1)} 120V${(120 - h).toFixed(1)}H${(x + w).toFixed(1)}V120Z`;
      if (alto && rnd(i, semente + 4) < 0.5) {
        const ax = x + w / 2;
        d += `M${(ax - 0.8).toFixed(1)} ${(120 - h).toFixed(1)}V${(120 - h - 14).toFixed(1)}H${(ax + 0.8).toFixed(1)}V${(120 - h).toFixed(1)}Z`;
      }
      x += w + rnd(i, semente + 5) * 3;
      i++;
    }
    return `<svg class="skyline-svg" viewBox="0 0 ${largura} 120" preserveAspectRatio="none"><path d="${d}"/></svg>`;
  }

  // palmeira em silhueta: tronco curvo e folhas que caem em arco. viewBox 400×800, base no (200,800)
  function palmeira(semente, inclina = 1) {
    const topo = [200 + inclina * (60 + rnd(1, semente) * 50), 120 + rnd(2, semente) * 40];
    const ctrl = [200 + inclina * (-10 + rnd(3, semente) * 20), 420];
    // tronco: duas curvas paralelas, afinando
    const tronco = `M${190} 800 Q${ctrl[0] - 12} ${ctrl[1]} ${topo[0] - 6} ${topo[1]} L${topo[0] + 6} ${topo[1]} Q${ctrl[0] + 12} ${ctrl[1]} ${214} 800 Z`;
    // anéis do tronco
    let aneis = '';
    for (let k = 1; k < 16; k++) {
      const u = k / 16;
      const x = (1 - u) * (1 - u) * 202 + 2 * u * (1 - u) * ctrl[0] + u * u * topo[0];
      const y = (1 - u) * (1 - u) * 800 + 2 * u * (1 - u) * ctrl[1] + u * u * topo[1];
      aneis += `M${(x - 11 + u * 5).toFixed(1)} ${y.toFixed(1)}h${(22 - u * 10).toFixed(1)}`;
    }
    // folhas: cada uma é uma nervura que sai do topo e cai em arco, com folíolos finos penteados para trás
    let nervuras = '', foliolos = '';
    const n = 11;
    for (let f = 0; f < n; f++) {
      const ang = -Math.PI * 1.08 + (f / (n - 1)) * Math.PI * 1.16 + (rnd(f, semente + 7) - 0.5) * 0.2;
      const comp = 150 + rnd(f, semente + 8) * 80;
      const lado = Math.cos(ang);
      const ex = topo[0] + lado * comp;
      const ey = topo[1] + 40 + comp * (0.55 + 0.35 * Math.abs(Math.sin(ang * 0.5 + 0.8)));
      const cx = topo[0] + lado * comp * 0.6;
      const cy = topo[1] - 30 - rnd(f, semente + 9) * 40 + Math.max(0, Math.sin(ang)) * 60;
      const P = (u) => [(1 - u) * (1 - u) * topo[0] + 2 * u * (1 - u) * cx + u * u * ex, (1 - u) * (1 - u) * topo[1] + 2 * u * (1 - u) * cy + u * u * ey];
      nervuras += `M${topo[0].toFixed(1)} ${topo[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
      const M = 22;
      for (let s = 1; s < M; s++) {
        const u = s / M;
        const [x, y] = P(u);
        const [x2, y2] = P(Math.min(1, u + 0.02));
        let tx = x2 - x, ty = y2 - y;
        const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
        const nx = -ty, ny = tx;
        const larg = Math.sin(Math.PI * Math.min(1, 0.15 + u * 0.95)) * 46;
        for (const sg of [1, -1]) {
          // o folíolo cai: aponta para fora e para baixo, penteado para a ponta
          const qx = x + (nx * sg * 0.75 + tx * 0.55) * larg;
          const qy = y + (ny * sg * 0.75 + ty * 0.55) * larg + larg * 0.35;
          foliolos += `M${x.toFixed(1)} ${y.toFixed(1)}L${qx.toFixed(1)} ${qy.toFixed(1)}`;
        }
      }
    }
    // cacho de cocos no topo
    const cocos = [0, 1, 2].map((k) => `M${(topo[0] - 10 + k * 10).toFixed(1)} ${(topo[1] + 12).toFixed(1)}a7 7 0 1 0 0.1 0Z`).join('');
    return `<svg class="palma-svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet"><path d="${tronco}"/><path d="${aneis}" class="aneis"/><path d="${nervuras}" class="nervura"/><path d="${foliolos}" class="foliolo"/><path d="${cocos}"/></svg>`;
  }

  window.Vice = {
    cenario({ sol = true, palmas = true, skyline: comCidade = true, classe = '' } = {}) {
      return `
      <div class="vice ${classe}">
        <div class="plano ceu"></div>
        ${sol ? '<div class="sol-brilho"></div><div class="sol"></div>' : ''}
        ${comCidade ? `<div class="skyline skyline-longe">${skyline(3, 1400)}</div><div class="skyline skyline-perto">${skyline(11)}</div>` : ''}
        <div class="mar"><div class="reflexo"></div><div class="ondas"></div></div>
        <div class="horizonte-luz"></div>
        ${palmas ? `<div class="palmas palmas-esq">${palmeira(2, 1)}${palmeira(5, 0.6)}</div><div class="palmas palmas-dir">${palmeira(8, -1)}${palmeira(13, -0.5)}</div>` : ''}
      </div>`;
    },
    torre({ classe = '', rotulo = '', valor = '', nota = '' } = {}) {
      return `
      <div class="torre ${classe}">
        <div class="face f-frente"></div><div class="face f-tras"></div>
        <div class="face f-dir"></div><div class="face f-esq"></div>
        <div class="face f-topo"></div>
        <div class="torre-rotulo"><span class="t-nome">${rotulo}</span><span class="t-valor destaque">${valor}</span>${nota ? `<span class="t-nota">${nota}</span>` : ''}</div>
      </div>`;
    },
    /** Pega as peças do cenário (no montar). */
    pecas(el) {
      return {
        vice: el.$('.vice'), ceu: el.$('.ceu'), sol: el.$('.sol'), brilho: el.$('.sol-brilho'), mar: el.$('.mar'),
        reflexo: el.$('.reflexo'), ondas: el.$('.ondas'), linha: el.$('.horizonte-luz'),
        sky: el.$$('.skyline'), palmas: el.$$('.palmas'), palmeiras: el.$$('.palma-svg'),
      };
    },
    /** Vida do cenário: o sol respira, o mar cintila e corre, as palmeiras balançam. Função pura de t. */
    vida(t, V, api, { k = 1, sol = 1 } = {}) {
      const S = Math.sin, PI2 = Math.PI * 2;
      if (V.brilho) api.set(V.brilho, { o: sol * (0.9 + 0.1 * k * S(PI2 * t / 4.3)), s: 1 + 0.025 * k * S(PI2 * t / 5.1 + 1) });
      if (V.reflexo) api.set(V.reflexo, { o: sol * (0.82 + 0.18 * S(PI2 * t / 1.9)), sx: 1 + 0.12 * S(PI2 * t / 2.7) });
      if (V.ondas) V.ondas.style.backgroundPosition = `0 ${(t * 0.9).toFixed(4)}cqh`;
      V.palmeiras.forEach((p, i) => api.set(p, { r: (i % 2 ? -1 : 1) * 0.9 * k * S(PI2 * (t + i * 0.83) / (3.6 + i * 0.4)) }));
    },
  };
})();

/* ─── o mapa: uma ilha tropical original vista de cima, à noite, com a luz do pôr do sol na costa ───
   Coordenadas no palco 9:16 (1080×1920). Mapa.svg() → o SVG inteiro; Mapa.rotas → as três rotas. */
(function () {
  const rnd = (i, k) => { const x = Math.sin((i + 1) * 91.37 + k * 47.13) * 24634.6345; return x - Math.floor(x); };
  // contorno grosso → contorno com recortes (deslocamento fractal determinístico) → curva suave
  function costa(pts, semente, amp = 22, niveis = 3) {
    let p = pts.map((q) => q.slice());
    for (let n = 0; n < niveis; n++) {
      const q = [];
      for (let i = 0; i < p.length; i++) {
        const a = p[i], b = p[(i + 1) % p.length];
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        const d = (rnd(i + n * 97, semente) - 0.5) * amp * (l / 90);
        q.push(a, [(a[0] + b[0]) / 2 - (dy / l) * d, (a[1] + b[1]) / 2 + (dx / l) * d]);
      }
      p = q; amp *= 0.55;
    }
    return suave(p, true);
  }
  // Catmull-Rom → cúbicas
  function suave(p, fechado) {
    const n = p.length, P = (i) => fechado ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    const fim = fechado ? n : n - 1;
    for (let i = 0; i < fim; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d + (fechado ? 'Z' : '');
  }
  const ILHA = [[430,520],[470,430],[560,380],[650,352],[760,372],[850,420],[930,500],[962,600],[944,700],[900,760],[850,800],[800,786],[756,806],[740,862],[772,922],[836,944],[872,998],[862,1080],[822,1160],[786,1250],[764,1340],[736,1430],[704,1520],[664,1600],[612,1680],[560,1736],[516,1756],[498,1716],[518,1640],[540,1560],[556,1480],[566,1390],[556,1300],[528,1220],[516,1140],[536,1060],[516,982],[468,922],[420,862],[398,782],[386,700],[398,610]];
  const LAGO = [[640,610],[668,578],[712,566],[756,584],[784,624],[778,668],[742,700],[694,704],[656,682]];
  const CHAVES = [[452,1800,34,16],[400,1830,30,13],[346,1852,28,12],[292,1866,24,10],[240,1874,20,9],[300,1010,40,30],[262,1072,22,16]];
  const CIDADES = [[640,1500,95,520],[700,500,90,380],[660,1020,60,170],[820,1200,45,110],[540,820,45,90]];
  const A_PE = [[560,1708],[612,1600],[640,1500],[628,1400],[664,1300],[704,1200],[690,1116],[640,1040],[600,960],[556,880],[516,800],[500,716],[540,636],[600,560],[656,486],[700,420]];
  const CARRO = [[560,1708],[640,1630],[700,1510],[736,1390],[756,1290],[796,1176],[828,1066],[802,966],[730,920],[692,840],[628,770],[598,690],[620,600],[680,520],[700,420]];
  function svg() {
    const ilha = costa(ILHA, 3), lago = costa(LAGO, 9, 6, 1);
    const chaves = CHAVES.map(([x, y, rx, ry], i) => costa(Array.from({ length: 7 }, (_, k) => { const a = (k / 7) * Math.PI * 2; return [x + Math.cos(a) * rx * (0.8 + 0.4 * rnd(k, i + 20)), y + Math.sin(a) * ry * (0.8 + 0.4 * rnd(k, i + 30))]; }), i + 40, 10, 2)).join('');
    // luzes da cidade: pontos em aglomerados (Box-Muller determinístico), recortados pela ilha
    let pontos = '';
    CIDADES.forEach(([cx, cy, r, n], c) => {
      for (let i = 0; i < n; i++) {
        const u = Math.max(1e-4, rnd(i, c * 7 + 1)), v = rnd(i, c * 7 + 2);
        const g = Math.sqrt(-2 * Math.log(u));
        const x = cx + g * Math.cos(2 * Math.PI * v) * r * 0.55, y = cy + g * Math.sin(2 * Math.PI * v) * r * 0.8;
        const s = 0.9 + rnd(i, c * 7 + 3) * 1.8;
        pontos += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" class="${rnd(i, c * 7 + 4) < 0.22 ? 'luz-quente' : 'luz-fria'}"/>`;
      }
    });
    // malha de ruas: segmentos curtos perto das cidades
    let ruas = '';
    CIDADES.forEach(([cx, cy, r], c) => {
      for (let i = 0; i < 26; i++) {
        const x = cx + (rnd(i, c + 60) - 0.5) * r * 1.8, y = cy + (rnd(i, c + 70) - 0.5) * r * 2.2;
        ruas += rnd(i, c + 80) < 0.5 ? `M${x.toFixed(0)} ${y.toFixed(0)}h${(20 + rnd(i, c + 90) * 60).toFixed(0)}` : `M${x.toFixed(0)} ${y.toFixed(0)}v${(20 + rnd(i, c + 90) * 70).toFixed(0)}`;
      }
    });
    const estradas = suave(A_PE.map(([x, y], i) => [x + (rnd(i, 5) - 0.5) * 18, y]), false) + suave(CARRO.map(([x, y], i) => [x + (rnd(i, 6) - 0.5) * 14, y + 6]), false);
    const rota = (cls, pts) => `<path class="rota-brilho ${cls}" d="${pts}" pathLength="1"/><path class="rota ${cls}" d="${pts}" pathLength="1"/>`;
    const AVIAO = `M560 1708 Q${560 + 150} 1060 700 420`;
    return `
    <svg class="mapa-svg" viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id="clip-ilha"><path d="${ilha}"/></clipPath>
        <linearGradient id="g-terra" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#2c1148"/><stop offset="0.55" stop-color="#22103a"/><stop offset="1" stop-color="#341040"/></linearGradient>
        <radialGradient id="g-cidade"><stop offset="0" stop-color="#ffb46a" stop-opacity="0.55"/><stop offset="0.4" stop-color="#ff4f8a" stop-opacity="0.2"/><stop offset="1" stop-color="#ff4f8a" stop-opacity="0"/></radialGradient>
      </defs>
      <g class="mundo" transform="translate(48 120) scale(0.93)">
      <g class="raso"><path d="${ilha}"/><path d="${chaves}"/></g>
      <g class="praia"><path d="${ilha}"/><path d="${chaves}"/></g>
      <path class="terra" d="${ilha}"/><path class="terra" d="${chaves}"/>
      <g clip-path="url(#clip-ilha)">
        <ellipse class="mangue" cx="560" cy="1260" rx="120" ry="200"/><ellipse class="mangue" cx="820" cy="470" rx="140" ry="90"/>
        ${CIDADES.map(([x, y, r]) => `<ellipse class="brilho-cidade" data-x="${x}" data-y="${y}" cx="${x}" cy="${y}" rx="${r * 1.6}" ry="${r * 2}" fill="url(#g-cidade)"/>`).join('')}
        <path class="ruas" d="${ruas}"/><path class="estradas" d="${estradas}"/>
        <g class="luzes">${pontos}</g>
      </g>
      <path class="lago" d="${lago}"/>
      <g class="rotas">
        ${rota('r-pe', suave(A_PE, false))}
        ${rota('r-carro', suave(CARRO, false))}
        ${rota('r-aviao', AVIAO)}
      </g>
      </g>
    </svg>`;
  }
  window.Mapa = { svg, tx: 48, ty: 120, k: 0.93 };
})();
