/* c04 — "O rapaz da bicicleta". */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, ANDA, APONTA, fala, pisca, elenco, p, ent } = H3;
const oficina = `<g><rect x="2300" y="440" width="600" height="440" fill="#bfa98a"/><rect x="2280" y="420" width="640" height="40" fill="#6b5547"/><rect x="2360" y="480" width="480" height="70" fill="#2c3e50"/>${txt(2600, 532, 'OFICINA', { f: 'Anton', t: 50, a: 'middle', c: '#f1c40f' })}
  <rect x="2360" y="580" width="480" height="300" fill="#7f8c8d"/>${Array.from({ length: 9 }, (_, i) => `<line x1="2360" y1="${600 + i * 32}" x2="2840" y2="${600 + i * 32}" stroke="#5e6670" stroke-width="4"/>`).join('')}</g>`;
const cena = (pre, extra = '') => EP2.ruaLado(pre, { luz: 'manha', esquinas: [3200] }) + oficina + elenco(['voce', 'irma', 'leo']) + `<g class="bk">${RUA.bike()}</g>` + extra;
const bike = (P, x, y, r = 0, t = 0) => { at(P.q('.bk'), 'transform', `translate(${x},${y}) rotate(${r}) scale(1.05)`); at(P.q('.bk-r1'), 'transform', `translate(-70,0) scale(1,${0.8 + 0.2 * Math.cos(t * 6)})`); };
K.cenaN('c04', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const sai = E.out(prog(t, F(0) + 0.3, F(0) + 1.0)); const susto = ent(t, F(0) + 0.9, F(0) + 1.2);
      p(P, 'leo', 'leo', pose({ x: lerp(3300, 2960, sai), y: 980, s: 1.7, d: -1, ab: lerp(1, 1.4, susto), boca: susto * 0.8, medo: susto, lean: -susto * 10 }, sai < 1 ? ANDA(tl, 6, 0.7) : { o: [-6, 60], c: [10, 20] }));
      bike(P, lerp(3150, 2810, sai), 975, 0, t);
      p(P, 'voce', 'voce', pose({ x: 2600, y: 980, s: 1.7, d: 1, ab: lerp(1, 1.4, susto), boca: susto * 0.8, medo: susto, lean: -susto * 12, alt: -Math.sin(Math.PI * susto) * 20 }));
      p(P, 'irma', 'irma', pose({ x: 2440, y: 980, s: 1.62, d: 1, ab: lerp(1, 1.3, susto) }));
      camera(P, 2720, 760, 1.35, 0, tremor(t, F(0) + 1.0, 8, 12, 5)); } },
  { de: 2, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const baixa = ent(t, F(3), F(3) + 0.6);
      p(P, 'voce', 'voce', pose({ x: 2600, y: 980, s: 1.7, d: 1, ab: 1.3, ol: [7, 0] }, { o: [-6, 95 - baixa * 30], c: [10, -10] }));
      p(P, 'leo', 'leo', pose({ x: 2960, y: 980, s: 1.7, d: -1, ab: 1.3, ol: [7, 0] }, { o: [-6, lerp(95, 20, baixa)], c: [10, lerp(-10, 30, baixa)] }));
      p(P, 'irma', 'irma', pose({ x: 2440, y: 980, s: 1.62, d: 1, ab: 1.2 })); bike(P, 2810, 975, 0, t);
      camera(P, 2780, 740, lerp(1.25, 1.3, prog(t, F(2), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { p(P, 'leo', 'leo', pose({ x: 2960, y: 980, s: 1.7, d: -1, cab: 4, ol: [6, 0], ab: pisca(t), boca: fala(t, F(4), F(4) + 1.2) }, { o: [-6, 20], c: [10, 30] }));
      bike(P, 2810, 975, 0, t); p(P, 'voce', 'voce', pose({ x: 2600, y: 980, s: 1.7, d: 1 })); p(P, 'irma', 'irma', pose({ x: 2440, y: 980, s: 1.62, d: 1 }));
      camera(P, lerp(2930, 2880, prog(t, F(4), F(6))), 680, lerp(2.4, 2.1, ent(t, F(5), F(5) + 1))); } },
  { de: 6, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { p(P, 'leo', 'leo', pose({ x: 2960, y: 980, s: 1.7, d: -1, cab: 2, ol: [6, 0], boca: fala(t, F(6), F(6) + 1.8), ab: pisca(t) }, { o: [-6, 20], c: [10, 30] }));
      p(P, 'voce', 'voce', pose({ x: lerp(2600, 2540, ent(t, F(7), F(7) + 0.6)), y: 980, s: 1.7, d: 1, boca: fala(t, F(7), F(7) + 0.8), ab: pisca(t, 2) }, { lean: -4 }));
      p(P, 'irma', 'irma', pose({ x: 2420, y: 980, s: 1.62, d: 1 })); bike(P, 2810, 975, 0, t);
      camera(P, 2740, 740, 1.3); } },
  { de: 8, svg: (pre) => EP3.mapa3(pre) + `<g class="dedo"><circle r="40" fill="#141414"/><rect x="-14" y="0" width="28" height="160" fill="#e67e22"/></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 0); op(P.q('.mCaminhao'), 1);
      const k = ent(t, F(8), F(8) + 1); at(P.q('.dedo'), 'transform', `translate(${lerp(1400, 1150, k)},${lerp(900, 690, k) + Math.sin(t * 3) * 6})`);
      camera(P, lerp(960, 1120, ent(t, F(9), F(9) + 1)), lerp(540, 620, ent(t, F(9), F(9) + 1)), lerp(1.0, 1.7, ent(t, F(9), F(9) + 1))); } },
  { de: 10, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const ergue = ent(t, F(11), F(11) + 1.0);
      p(P, 'leo', 'leo', pose({ x: 2960, y: 980, s: 1.7, d: -1, cab: 4, ol: [6, 1], lean: 8 * ergue, boca: fala(t, F(12), F(12) + 2) }, { o: [-6, lerp(20, 70, ergue)], c: [10, 40] }));
      bike(P, 2820, 975 - ergue * 50, ergue * 8, t);
      p(P, 'voce', 'voce', pose({ x: 2560, y: 980, s: 1.7, d: 1, boca: fala(t, F(10), F(10) + 1.2) })); p(P, 'irma', 'irma', pose({ x: 2420, y: 980, s: 1.62, d: 1 }));
      camera(P, 2800, 760, lerp(1.4, 1.55, prog(t, F(10), F(13)))); } },
  { de: 13, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const des = Math.sin(t * 5);
      bike(P, 2760, 975, 0, t * 2);
      p(P, 'irma', 'irma', pose({ x: 2580, y: 980, s: 1.62, d: 1, cab: 10, ol: [5, 3] }, { o: [-6, 70], c: [10, 10] }));
      p(P, 'leo', 'leo', pose({ x: 2920, y: 980, s: 1.7, d: -1, cab: 14, ol: [4, 4] }, B.POSES.agachado, { o: [10, 70 + des * 15], c: [40, 30] }));
      p(P, 'voce', 'voce', pose({ x: 2400, y: 980, s: 1.7, d: 1 }));
      camera(P, 2760, 840, lerp(2.0, 2.15, prog(t, F(13), F(15)))); } },
  { de: 15, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const k = prog(t, F(15) + 1.2, F(17)); const olha = Math.sin(Math.PI * prog(t, F(16), F(16) + 2.2));
      bike(P, 2300, 975, -8, 0);
      p(P, 'leo', 'leo', pose({ x: lerp(2500, 3100, k), y: 980, s: 1.7, d: olha > 0.3 ? -1 : 1, cab: olha * 6, ol: [5, 1], ab: lerp(1, 0.8, olha), item: '' }, k > 0 && k < 1 && olha < 0.3 ? ANDA(tl, 6, 0.7) : {}, { o: [-6, 30], c: [10, 40] }));
      p(P, 'voce', 'voce', pose({ x: lerp(2700, 3260, k), y: 980, s: 1.7, d: 1 }, k > 0 && k < 1 ? ANDA(tl + 0.3, 6, 0.7) : {})); p(P, 'irma', 'irma', pose({ x: lerp(2850, 3400, k), y: 980, s: 1.62, d: 1 }, k > 0 && k < 1 ? ANDA(tl + 0.5, 6, 0.7) : {}));
      camera(P, lerp(2500, 2900, k), 760, 1.2); } },
  { de: 17, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { bike(P, 2300, 975, -8, 0);
      const pv = pose({ x: 3200, y: 980, s: 1.7, d: -1, cab: 6, ol: [4, 1], ab: 0.8 }); p(P, 'voce', 'voce', pv); p(P, 'leo', 'leo', pose({ x: 3500, y: 980, s: 1.7, d: 1 })); p(P, 'irma', 'irma', pose({ x: 3650, y: 980, s: 1.62, d: 1 }));
      const c = B.cabecaMundo(pv); camera(P, c[0] - 30, c[1] + 40, lerp(3.2, 3.5, prog(t, F(17), F(18)))); } },
  { de: 18, svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre) }),
    quadro(tl, el, P, t, F) { INT.ceuSala(P, 0.6, 0.4, 0); op(P.q('.int-tarde'), 0.2); op(P.q('.int-noite'), 0.15);
      camera(P, 3215, 650, lerp(1.6, 1.5, prog(tl, 0, 3))); op(P.preto, 0.15 + 0.1 * Math.sin(t)); } },
]);
}
