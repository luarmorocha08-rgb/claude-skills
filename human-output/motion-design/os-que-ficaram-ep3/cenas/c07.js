/* c07 — "A travessia". Passarela: deck em y=420. */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3;
const placasFrente = `<g>${[2600, 2780, 2960, 3140].map((x) => `<rect x="${x}" y="300" width="170" height="120" fill="#95a5a6" stroke="#4d5866" stroke-width="5"/>`).join('')}</g>`;
const cena = (pre, frente = '') => EP3.estacao(pre, { atores: `<g class="carrA" transform="translate(470,990) rotate(8)">${EP2.carrinho()}</g><g class="rastG">${RAST.svg(pre)}</g>` + elenco(['voce', 'irma', 'leo', 'davi', 'bia']) }) + frente;
const fila = (P, t, x0, anda, tl, extra = {}) => { const ord = [['leo', 0, 1.7], ['voce', -150, 1.7], ['davi', -330, 1.75], ['bia', -470, 1.1], ['irma', -620, 1.62]];
  ord.forEach(([n, dx, s], i) => p(P, n, n, pose({ x: x0 + dx, y: 420, s, d: 1, ol: [6, 0], ab: pisca(t, i + 1) }, anda ? ANDA(tl + i * 0.3, 6, 0.6) : {}, extra[n] || {}))); };
const rast = (P, t, x, f = 0) => RAST.posar(P.q('.rastG'), x, 990, 1.1, f, 330, 1);
K.cenaN('c07', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { rast(P, t, -2000); const k = prog(t, F(0), F(1)); fila(P, t, lerp(2000, 2500, k), k < 1, tl);
      camera(P, lerp(2100, 2400, k), 460, 1.0); } },
  { de: 1, svg: (pre) => EP3.panorama(pre),
    quadro(tl, el, P, t, F) { const k = ent(t, F(2), F(2) + 1.5); camera(P, lerp(800, 1400, prog(t, F(1), F(2) + 1)), lerp(560, 480, k), lerp(1.0, 1.7, k)); } },
  { de: 3, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { rast(P, t, -2000); const pux = Math.sin(Math.PI * prog(t, F(3) + 0.5, F(3) + 1.5));
      fila(P, t, 2500, false, tl, { bia: { o: [-6, lerp(20, 80, pux) + (t > F(4) ? 40 : 0)], c: [10, t > F(4) ? -20 : 0], cab: t > F(4) ? 20 : 0 }, davi: { cab: t > F(4) + 0.4 ? 16 : 0, ol: [5, t > F(4) + 0.4 ? 5 : 0] } });
      camera(P, 2160, 250, lerp(1.9, 2.05, prog(t, F(3), F(5)))); } },
  { de: 5, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const k = prog(t, F(5), F(8)); rast(P, t, lerp(1400, 2300, k), (t - F(5)) * 3); fila(P, t, 2500, false, tl, { voce: { cab: 22, ol: [4, 6], ab: 1.3 } });
      camera(P, lerp(2200, 2100, k), lerp(600, 760, ent(t, F(5), F(5) + 1.5)), 0.78); } },
  { de: 8, svg: (pre) => cena(pre, placasFrente),
    quadro(tl, el, P, t, F) { rast(P, t, 2300); const ag = ent(t, F(8), F(8) + 0.6);
      const xs = { leo: 3200, voce: 3020, davi: 2860, bia: 2770, irma: 2640 };
      Object.entries(xs).forEach(([n, x], i) => p(P, n, n, K.mistura(pose({ x: x - 200, y: 420, s: n === 'bia' ? 1.1 : 1.7, d: 1, ab: 1.3 }), pose({ x, y: 420, s: n === 'bia' ? 1.1 : 1.7, d: 1, ab: 1.3, medo: 0.5 }, AG), ag)));
      if (t > F(9)) p(P, 'bia', 'bia', pose({ x: 2820, y: 420, s: 1.1, d: -1, ab: 1.3 }, AG));
      camera(P, 2900, 380, lerp(1.6, 1.7, prog(t, F(8), F(10)))); } },
  { de: 10, svg: (pre) => cena(pre, placasFrente) + `<polygon class="feixe" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t, F) { rast(P, t, 2300); const k = prog(t, F(10), F(11)); const sobe = ent(t, F(12), F(12) + 1.2);
      const ax = t < F(11) ? lerp(1400, 600, k) : lerp(470, 600, sobe), ay = t < F(11) ? 990 - (ax - 300) * 570 / 1200 - 30 : lerp(900, 700, sobe);
      const olho = [2300, 990 - 1.1 * 330]; at(P.q('.feixe'), 'points', `${olho[0]},${olho[1]} ${ax - 80},${ay} ${ax + 80},${ay + 60}`); op(P.q('.feixe'), 0.85);
      ['leo', 'voce', 'davi', 'bia', 'irma'].forEach((n, i) => p(P, n, n, pose({ x: [3200, 3020, 2860, 2820, 2640][i], y: 420, s: n === 'bia' ? 1.1 : 1.7, d: n === 'bia' ? -1 : 1, ab: 1.3, medo: 0.5 }, AG)));
      camera(P, 1500, 650, 0.62); } },
  { de: 13, svg: (pre) => cena(pre, placasFrente),
    quadro(tl, el, P, t, F) { rast(P, t, 2300); ['leo', 'voce', 'davi', 'bia', 'irma'].forEach((n, i) => p(P, n, n, pose({ x: [3200, 3020, 2860, 2820, 2640][i], y: 420, s: n === 'bia' ? 1.1 : 1.7, d: n === 'bia' ? -1 : 1, ab: 1.3, medo: 0.7, cx: n === 'voce' ? ruido(t * 9, 2) : 0 }, AG, n === 'voce' ? { o: [40, 50], c: [100, 110] } : {})));
      const pv = pose({ x: 3020, y: 420, s: 1.7, d: 1 }, AG); const c = B.cabecaMundo(pv); camera(P, c[0] + 20, c[1] + 70, lerp(3.0, 3.2, prog(t, F(13), F(14)))); } },
  { de: 14, svg: (pre) => cena(pre, placasFrente) + `<polygon class="feixe" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t, F) { rast(P, t, 2300); const pas = prog(t, F(16), F(17));
      const olho = [2300, 990 - 1.1 * 330]; const fx = lerp(2400, 3400, pas); at(P.q('.feixe'), 'points', `${olho[0]},${olho[1]} ${fx - 60},470 ${fx + 60},500`); op(P.q('.feixe'), pas > 0 && pas < 1 ? 0.85 : 0);
      ['leo', 'voce', 'davi', 'bia', 'irma'].forEach((n, i) => p(P, n, n, pose({ x: [3200, 3020, 2860, 2820, 2640][i], y: 420, s: n === 'bia' ? 1.1 : 1.7, d: n === 'bia' ? -1 : 1, ab: 1.3, medo: 0.6 }, AG)));
      camera(P, 2700, 640, lerp(0.75, 0.8, prog(t, F(14), F(17)))); } },
  { de: 17, svg: (pre) => cena(pre, placasFrente),
    quadro(tl, el, P, t, F) { rast(P, t, lerp(2300, 600, prog(t, F(17), F(19))), (t - F(17)) * 3); const lev = ent(t, F(18), F(18) + 0.8); const sinal = Math.sin(Math.PI * prog(t, F(19), F(19) + 1.2)); const anda = prog(t, F(20), F(20) + 3);
      ['voce', 'davi', 'bia', 'irma'].forEach((n, i) => p(P, n, n, anda > 0 ? pose({ x: [3020, 2860, 2820, 2640][i] + anda * 600, y: 420, s: n === 'bia' ? 1.1 : 1.7, d: 1 }, ANDA(tl + i * .3, 6, .6)) : pose({ x: [3020, 2860, 2820, 2640][i], y: 420, s: n === 'bia' ? 1.1 : 1.7, d: 1, ab: 1.2 }, AG)));
      p(P, 'leo', 'leo', anda > 0 ? pose({ x: 3200 + anda * 600, y: 420, s: 1.7, d: 1 }, ANDA(tl, 6, .6)) : K.mistura(pose({ x: 3200, y: 420, s: 1.7, d: 1 }, AG), pose({ x: 3200, y: 420, s: 1.7, d: 1, ol: [6, 3] }, { lean: 10, o: [-6, lerp(10, 140, sinal)], c: [10, -20] }), lev));
      camera(P, 3000 + anda * 400, 380, 1.4); } },
]);
}
