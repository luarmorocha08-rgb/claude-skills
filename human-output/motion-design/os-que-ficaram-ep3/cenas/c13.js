/* c13 — "A escola em funcionamento". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, ANDA, SCH, AG, fala, pisca, elenco, p, ent } = H3;
const BALDE = `<g transform="translate(0,26) scale(.35)"><path d="M-50,-110 L50,-110 L40,0 L-40,0 Z" fill="#2980b9" stroke="#141414" stroke-width="10"/><path d="M-50,-110 Q0,-170 50,-110" fill="none" stroke="#141414" stroke-width="8"/></g>`;
const cena = (pre) => EP3.quadra(pre, { atores: elenco(['helena', 'joel', 'voce', 'irma', 'leo', 'davi'], { voce: { item: BALDE, itemT: BALDE }, joel: { item: BALDE } }) + `<g class="porta" transform="translate(3560,990)"><rect x="0" y="-460" width="120" height="460" fill="#8d6e4c" stroke="#5a4636" stroke-width="5"/></g><g class="mesaM"><rect x="0" y="-20" width="260" height="20" fill="#8d6e4c"/><rect x="10" y="0" width="12" height="130" fill="#6b5236"/><rect x="238" y="0" width="12" height="130" fill="#6b5236"/></g>` });
const trabalhos = (P, t, tl) => { const d = Math.sin(t * 4);
  p(P, 'irma', 'irma', pose({ x: 2100, y: 990, s: 1.62, d: 1, cab: 16, ol: [4, 5] }, { o: [-6, 60 + d * 30], c: [10, 50], lean: 10 }));
  p(P, 'leo', 'leo', pose({ x: 3480, y: 990, s: 1.7, d: 1, cab: 4 }, AG, { o: [10, 90 + d * 10], c: [40, 0] }));
  const mv = (Math.sin(t * 0.8) + 1) / 2; at(P.q('.mesaM'), 'transform', `translate(${4300 + mv * 200},860)`); p(P, 'davi', 'davi', pose({ x: 4270 + mv * 200, y: 990, s: 1.75, d: 1, lean: 14 }, { o: [-6, 80], c: [10, 10] })); };
K.cenaN('c13', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { trabalhos(P, t, tl); p(P, 'helena', 'helena', pose({ x: -999, y: 990 })); p(P, 'joel', 'joel', pose({ x: -999, y: 990 })); op(P.q('#voce .b-it'), 0); op(P.q('#voce .b-itT'), 0);
      const lev = ent(t, F(0) + 0.4, F(0) + 1.6); p(P, 'voce', 'voce', K.mistura(pose({ x: 2560, y: 990, s: 1.7, d: 1 }, SCH), pose({ x: 2560, y: 990, s: 1.7, d: 1, cab: -4 + Math.sin(t * 0.7) * 10, ol: [6, 0] }), lev));
      camera(P, 2560, 700, lerp(1.4, 1.3, prog(t, F(0), F(2)))); } },
  { de: 2, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { trabalhos(P, t, tl); op(P.q('#voce .b-it'), 0); op(P.q('#voce .b-itT'), 0); op(P.q('#joel .b-it'), 0);
      p(P, 'helena', 'helena', pose({ x: 1500, y: 990, s: 1.7, d: 1, boca: fala(t, F(2), F(2) + 2), ol: [6, 0] }, t < F(3) ? { o: [-6, 70], c: [10, 10] } : {}));
      p(P, 'joel', 'joel', pose({ x: 1950, y: 990, s: 1.75, d: -1, ol: [5, 0], cab: 4, ab: pisca(t) }, { o: [-6, 20], c: [10, 40] })); p(P, 'voce', 'voce', pose({ x: 1720, y: 990, s: 1.7, d: 1 }));
      camera(P, 1730, 680, lerp(1.5, 1.6, prog(t, F(2), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { trabalhos(P, t, tl); p(P, 'helena', 'helena', pose({ x: -999, y: 990 })); const k = prog(t, F(4), F(8) + 1); const x = lerp(1700, 4900, k);
      p(P, 'voce', 'voce', pose({ x, y: 990, s: 1.7, d: 1, ol: [6, 0], cab: Math.sin(t) * 6 }, ANDA(tl, 6, 0.7), { o: [-10, 10], c: [10, 10] }));
      p(P, 'joel', 'joel', pose({ x: x + 200, y: 990, s: 1.75, d: 1, ol: [6, 0] }, ANDA(tl + 0.4, 6, 0.7), { o: [-10, 10], c: [10, 10] }));
      camera(P, x + 100, 680, 1.15); } },
  { de: 8, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { trabalhos(P, t, tl); p(P, 'helena', 'helena', pose({ x: 1450, y: 990, s: 1.7, d: 1 }, { o: [-6, 50], c: [10, 70] })); p(P, 'voce', 'voce', pose({ x: -999, y: 990 })); p(P, 'joel', 'joel', pose({ x: -999, y: 990 }));
      camera(P, lerp(2200, 3600, prog(t, F(8), F(10))), 600, 0.62); } },
  { de: 10, svg: (pre) => EP3.servico(pre, { atores: elenco(['joel', 'voce']), balde: true }),
    quadro(tl, el, P, t, F) { const poe = ent(t, F(10), F(10) + 1); at(P.q('.bd0'), 'transform', `translate(${lerp(560, 630, poe)},${lerp(880, 790, poe)})`);
      op(P.q('.fio'), t > F(11) ? 0.9 : 0); at(P.q('.fio'), 'd', 'M630,548 L630,700'); const ench = prog(t, F(11), F(13) + 3); at(P.q('.bd0 .agua'), 'y', -10 - ench * 20); at(P.q('.bd0 .agua'), 'height', 10 + ench * 20);
      p(P, 'joel', 'joel', pose({ x: 820, y: 990, s: 1.75, d: -1, cab: 14, ol: [4, 4] }, { o: [-6, lerp(20, 80, poe)], c: [10, 20] })); p(P, 'voce', 'voce', pose({ x: 1000, y: 990, s: 1.7, d: -1, cab: 14, ol: [4, 4], ab: pisca(t) }));
      camera(P, lerp(780, 660, ent(t, F(12), F(12) + 2)), lerp(700, 680, prog(t, F(10), F(13))), lerp(1.4, 2.4, ent(t, F(12), F(12) + 2))); } },
]);
}
