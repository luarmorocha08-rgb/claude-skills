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
