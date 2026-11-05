/* c14 — "A conta que não fecha". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, ANDA, SCH, fala, pisca, elenco, p, ent } = H3;
const PRANCHETA = `<g transform="rotate(-10)"><rect x="-22" y="-30" width="44" height="58" rx="3" fill="#8d6e4c" stroke="#141414" stroke-width="3"/><rect x="-16" y="-22" width="32" height="44" fill="#fbf8f1"/></g>`;
const serv = (pre) => EP3.servico(pre, { atores: elenco(['joel', 'voce', 'helena'], { helena: { item: PRANCHETA } }), balde: true });
K.cenaN('c14', [
  { de: 0, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,790)'); op(P.q('.fio'), t < F(1) + 0.5 ? 0.9 : 0); at(P.q('.fio'), 'd', 'M630,548 L630,700');
      const olha = ent(t, F(1) + 0.6, F(1) + 1.2); const chega = E.out(prog(t, F(1), F(1) + 1.5));
      p(P, 'voce', 'voce', pose({ x: 1000, y: 990, s: 1.7, d: -1, boca: fala(t, F(0), F(0) + 1.5), ol: [5, 0] }));
      p(P, 'joel', 'joel', pose({ x: 820, y: 990, s: 1.75, d: olha > 0.5 ? 1 : -1, cab: 0, ol: [6, 0] }, t > F(1) && t < F(1) + 0.6 ? { o: [-6, 80], c: [10, 10] } : {}));
      p(P, 'helena', 'helena', pose({ x: lerp(1500, 1180, chega), y: 990, s: 1.7, d: -1, ol: [5, 0] }, chega < 1 ? ANDA(tl, 6, .6) : { o: [-6, 50], c: [10, 70] }));
      camera(P, 950, 680, 1.5); } },
  { de: 2, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,790)'); const ap = t > F(4) ? (t > F(5) ? 2 : 1) : 0;
      p(P, 'joel', 'joel', pose({ x: 1150, y: 990, s: 1.75, d: 1, boca: fala(t, F(2), F(3) + 2), ol: [6, -2] }, ap ? { o: [-6, 110], c: [10, -10] } : {}));
      p(P, 'voce', 'voce', pose({ x: 950, y: 990, s: 1.7, d: 1, ol: [6, -2] })); p(P, 'helena', 'helena', pose({ x: 820, y: 990, s: 1.7, d: 1 }, { o: [-6, 50], c: [10, 70] }));
      const k = ent(t, F(4), F(4) + 1); op(P.q('.marca2'), ent(t, F(5), F(5) + 0.4));
      camera(P, lerp(1300, 1370, k), lerp(600, 640, k), lerp(1.0, 2.0, k)); } },
  { de: 7, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,790)'); p(P, 'voce', 'voce', pose({ x: 950, y: 990, s: 1.7, d: -1, cab: 16, ol: [4, 5] })); p(P, 'joel', 'joel', pose({ x: 1150, y: 990, s: 1.75, d: -1 })); p(P, 'helena', 'helena', pose({ x: 1300, y: 990, s: 1.7, d: -1 }));
      camera(P, 700, 800, lerp(2.4, 2.6, prog(t, F(7), F(9)))); } },
  { de: 9, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,790)');
      p(P, 'voce', 'voce', pose({ x: 950, y: 990, s: 1.7, d: 1, boca: fala(t, F(9), F(9) + 1.4), ol: [6, 0] })); p(P, 'joel', 'joel', pose({ x: 820, y: 990, s: 1.75, d: 1 }));
      const ph = pose({ x: 1180, y: 990, s: 1.7, d: -1, cab: 6, ol: [5, 2], boca: fala(t, F(10) + 0.4, F(10) + 3) * 0.6, ab: 0.85 }, { o: [-6, 50], c: [10, 70] }); p(P, 'helena', 'helena', ph);
      const c = B.cabecaMundo(ph); const k = ent(t, F(10), F(10) + 0.8); camera(P, lerp(1060, c[0] - 20, k), lerp(680, c[1] + 50, k), lerp(1.8, 3.2, k)); } },
  { de: 11, svg: (pre) => EP3.quadra(pre, { atores: elenco(['irma', 'bia']) + `<g class="cobertor"><path d="M0,0 Q100,-30 200,0 L200,40 L0,40 Z" fill="#f1c40f" stroke="#141414" stroke-width="4"/></g>` }),
    quadro(tl, el, P, t, F) { const cob = ent(t, F(12), F(12) + 1.6);
      p(P, 'bia', 'bia', pose({ x: 2700, y: 990, s: 1.1, d: 1 }, H3.DEIT, { alt: 30 }));
      p(P, 'irma', 'irma', pose({ x: 2560, y: 990, s: 1.62, d: 1, cab: 14, ol: [4, 5] }, H3.AG, { o: [10, lerp(40, 90, cob)], c: [40, 0] }));
      at(P.q('.cobertor'), 'transform', `translate(2560,${lerp(900, 950, cob)}) scale(${lerp(0.5, 1.1, cob)},1)`); camera(P, 2640, 860, lerp(1.6, 1.8, prog(t, F(11), F(13)))); } },
  { de: 13, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,790)'); const pv = pose({ x: 950, y: 990, s: 1.7, d: 1, ol: [7, 0], ab: 0.85, cab: 4 }); p(P, 'voce', 'voce', pv); p(P, 'joel', 'joel', pose({ x: -999, y: 990 })); p(P, 'helena', 'helena', pose({ x: -999, y: 990 }));
      const c = B.cabecaMundo(pv); camera(P, c[0] + 10, c[1] + 50, lerp(3.2, 3.5, prog(t, F(13), F(15)))); } },
]);
}
