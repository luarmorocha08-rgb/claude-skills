/* c08 — "A farmácia". Por dentro: famílias com medo e fome; Cíntia mede cada porção e completa um copo escondida. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, ANDA, SC, DEIT, fala, pisca, elenco, p, ent } = H3;
const far = (pre) => EP4.farmaciaDentro(pre, { atrasBalcao: elenco(['cintia']), atores: elenco(['voce', 'mulher:dorme', 'crianca:toalha', 'senhor', 'mulher:pede'], { toalha: { item: '' }, pede: { item: Pr.caneca() } }) + `<g class="toalhaG"><path d="M-40,-60 Q0,-80 40,-60 L46,10 Q0,20 -46,10 Z" fill="#f5e6c8" stroke="#141414" stroke-width="4"/></g>` });
const fundos = (P, t, ex = {}) => { p(P, 'dorme', 'mulher', pose({ x: 2780, y: 990, s: 1.62, d: 1, ab: 0.1, cab: 16 }, SC));
  p(P, 'toalha', 'crianca', pose({ x: 3080, y: 990, s: 1.05, d: -1, ab: pisca(t, 3) }, SC)); at(P.q('.toalhaG'), 'transform', 'translate(3080,925)');
  p(P, 'senhor', 'senhor', pose({ x: 3200, y: 990, s: 1.6, d: 1, cab: 18, ol: [4, 6], ab: pisca(t, 4) }, SC, { o: [-6, 60], c: [10, 50] }));
  p(P, 'pede', 'mulher', pose(Object.assign({ x: -9999, y: 990, s: 1.62, d: -1 }, ex.pede || {}))); };
const cintia = (P, t, ex = {}) => p(P, 'cintia', 'cintia', pose({ x: 1320, y: 990, s: 1.66, d: -1, ol: [6, 2], ab: pisca(t, 5) }, ex));
K.cenaN('c08', [
  { de: 0, svg: far,
    quadro(tl, el, P, t, F) { fundos(P, t); cintia(P, t, { x: -9999 }); const k = prog(t, F(0), F(1)); p(P, 'voce', 'voce', pose({ x: lerp(600, 1050, k), y: 990, s: 1.7, d: 1, ol: [6, 0], ab: 1.1 }, k < 1 ? ANDA(tl, 5, 0.6) : {}));
      camera(P, lerp(700, 1000, k), 640, 1.1); } },
  { de: 1, svg: far,
    quadro(tl, el, P, t, F) { fundos(P, t); cintia(P, t, { x: -9999 }); p(P, 'voce', 'voce', pose({ x: -9999, y: 990 }));
      const k = ent(t, F(1), F(3) + 1); camera(P, lerp(2760, 3240, k), 780, lerp(2.2, 2.0, k)); } },
  { de: 4, svg: far,
    quadro(tl, el, P, t, F) { fundos(P, t); cintia(P, t, { x: -9999 }); p(P, 'voce', 'voce', pose({ x: 2420, y: 990, s: 1.7, d: 1, ol: [6, 1], ab: 0.9 * pisca(t) }));
      camera(P, lerp(2800, 2700, prog(t, F(4), F(6))), 700, lerp(1.0, 1.1, prog(t, F(4), F(6)))); } },
  { de: 6, svg: far,
    quadro(tl, el, P, t, F) { fundos(P, t); const poe = ent(t, F(6), F(6) + 0.8); const mede = Math.sin(Math.PI * 2 * prog(t, F(7), F(8)));
      cintia(P, t, { cab: 14, ol: [4, 6], o: [-6, lerp(20, 70, poe)], c: [10, lerp(60, 10 + mede * 20, poe)] }); at(P.q('.f-recip'), 'transform', `translate(1250,${lerp(600, 722, poe)})`);
      p(P, 'voce', 'voce', pose({ x: 1720, y: 990, s: 1.7, d: -1, ol: [6, 1], ab: pisca(t) }));
      camera(P, lerp(1400, 1450, prog(t, F(6), F(8))), 720, lerp(1.7, 1.85, prog(t, F(6), F(8)))); } },
  { de: 8, svg: far,
    quadro(tl, el, P, t, F) { const vem = ent(t, F(8) - 0.5, F(8) + 1.2); fundos(P, t, { pede: { x: lerp(2400, 1160, vem), d: -1, boca: fala(t, F(8) + 0.8, F(9)) * 0.6, o: [-6, 70], c: [10, 20] } });
      const olha = t > F(9) && t < F(11) + 0.3; cintia(P, t, { d: olha ? -1 : 1, ol: olha ? [6, 0] : [6, 2], cab: olha ? -4 : 6 });
      p(P, 'voce', 'voce', pose({ x: 1720, y: 990, s: 1.7, d: -1, ol: [6, 1], ab: pisca(t) }));
      const k = ent(t, F(9), F(9) + 0.8) * (1 - ent(t, F(11) - 0.3, F(11))); camera(P, lerp(1350, 500, k), lerp(720, 600, k), lerp(1.5, 1.3, k)); } },
  { de: 11, svg: far,
    quadro(tl, el, P, t, F) { fundos(P, t, { pede: { x: 1100, d: 1, o: [-6, 70], c: [10, 20] } }); const enche = ent(t, F(11), F(11) + 1.4); const psiu = ent(t, F(11) + 1.6, F(11) + 2.2);
      cintia(P, t, { d: 1, o: [-6, lerp(70, 20, psiu)], c: [10, lerp(10, 150, psiu)], ol: t > F(13) ? [-6, 0] : [6, 2], cab: t > F(13) ? 0 : 8 });
      const ve = t > F(13); p(P, 'voce', 'voce', pose({ x: 1720, y: 990, s: 1.7, d: -1, ol: ve ? [6, 0] : [6, 3], ab: pisca(t) }));
      const k = ent(t, F(12), F(13) + 0.8); camera(P, lerp(1180, 1500, k), lerp(700, 640, k), lerp(2.6, 1.7, k)); } },
]);
}
