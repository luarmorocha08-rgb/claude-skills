/* c09 — "O muro da escola". */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const cena = (pre) => EP3.escolaFora(pre, { atores: elenco(['voce', 'irma', 'leo', 'davi', 'bia', 'helena']), dentro: [0, 1, 2, 3].map((i) => EP3.figurante('df' + i, ['#e74c3c', '#2980b9', '#16a085', '#8e44ad'][i])).join('') });
const grupo = (P, t, x0, anda, tl, ex = {}) => [['voce', 0, 1.7], ['irma', -150, 1.62], ['leo', -300, 1.7], ['davi', -470, 1.75], ['bia', -590, 1.1]].forEach(([n, dx, s], i) => p(P, n, n, pose({ x: x0 + dx, y: 980, s, d: 1, ab: pisca(t, i + 1), ol: [6, 0] }, anda ? ANDA(tl + i * .3, 6, .7) : {}, ex[n] || {})));
const dentro = (P, t) => [0, 1, 2, 3].forEach((i) => B.posar(P.q('#df' + i), pose({ x: 2750 + i * 330 + Math.sin(t * 0.4 + i) * 40, y: 860, s: 0.9, d: i % 2 ? 1 : -1, ab: pisca(t, i + 4) }, i === 2 ? { q: [84, 88], j: [86, 90], chao: 0, alt: 40 } : {})));
K.cenaN('c09', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); p(P, 'helena', 'helena', pose({ x: -999, y: 980 })); const k = prog(t, F(0), F(0) + 2.5); const puxa = Math.sin(Math.PI * prog(t, F(1), F(1) + 0.8));
      grupo(P, t, lerp(700, 1280, k), k < 1, tl, { voce: { o: [-6, 70 * puxa], c: [10, 0], lean: -puxa * 8 } });
      at(P.q('.corrente'), 'transform', `translate(${puxa * 6},0)`); camera(P, 1150, 700, lerp(1.0, 1.15, k), 0, tremor(t, F(1) + 0.4, 4, 18, 8)); } },
  { de: 3, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); p(P, 'helena', 'helena', pose({ x: -999, y: 980 })); grupo(P, t, 1280, false, tl, { voce: { cab: 14, ol: [3, 4], ab: 0.8 }, irma: { cab: 10 } });
      camera(P, 1100, 720, lerp(1.2, 1.1, prog(t, F(3), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); p(P, 'helena', 'helena', pose({ x: -999, y: 980 })); grupo(P, t, 1280, false, tl, { leo: { x: 1700, o: [-6, 98], c: [10, -8], d: 1 } });
      camera(P, lerp(1700, 1800, prog(t, F(4), F(6))), 700, lerp(1.8, 2.3, ent(t, F(5), F(5) + 1))); } },
  { de: 6, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); p(P, 'helena', 'helena', pose({ x: -999, y: 980 })); const k = prog(t, F(6), F(9)); grupo(P, t, lerp(1500, 3300, k), k < 1, tl, { voce: { cab: k > 0.4 ? -6 : 0, ol: [7, -1] } });
      camera(P, lerp(1700, 3200, k), 660, 0.9); } },
  { de: 9, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); p(P, 'helena', 'helena', pose({ x: -999, y: 980 })); grupo(P, t, 3300, false, tl);
      const k = prog(t, F(10), F(13)); camera(P, lerp(3150, 3950, k), 640, 2.0); } },
  { de: 13, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); const vem = E.out(prog(t, F(13), F(13) + 1.5));
      p(P, 'helena', 'helena', pose({ x: lerp(3900, 3620, vem), y: 870, s: 1.5, d: -1, ol: [6, 0], boca: fala(t, F(13) + 1.2, F(14)) }, vem < 1 ? ANDA(tl, 6, .7) : {}));
      const conta = Math.floor(prog(t, F(14), F(15)) * 5); grupo(P, t, 3300, false, tl, { voce: { o: [-6, conta > 0 ? 80 : 10], c: [10, conta > 0 ? -10 : 10], boca: fala(t, F(15), F(15) + 0.5) } });
      camera(P, 3460, 700, lerp(1.6, 1.75, prog(t, F(13), F(16)))); } },
  { de: 16, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { dentro(P, t); const ab = ent(t, F(16), F(16) + 1.2); at(P.q('.portaoQuadra'), 'transform', `translate(3500,0) scale(${lerp(1, 0.1, ab)},1) translate(-3500,0)`);
      p(P, 'helena', 'helena', pose({ x: 3620, y: 870, s: 1.5, d: -1, ol: [6, 0] }, { o: [-6, 60], c: [10, 20] }));
      const pv = pose({ x: 3300, y: 980, s: 1.7, d: 1, ab: lerp(1.1, 1.0, ab), ol: [6, 0] }); grupo(P, t, 3300, false, tl, { voce: pv });
      const c = B.cabecaMundo(pv); camera(P, lerp(c[0] + 100, 3450, ab), lerp(c[1] + 60, 700, ab), lerp(3.0, 1.6, E.io(prog(t, F(16) + 1, F(16) + 3)))); } },
]);
}
