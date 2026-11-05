/* c15 — "O caminhão no mapa". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, fala, pisca, elenco, p, ent } = H3;
const LANT = Pr.lanterna();
const banc = (pre) => EP3.servico(pre, { atores: elenco(['voce', 'joel', 'helena', 'davi', 'leo'], { joel: { item: LANT } }) });
const grupo = (P, t, ex = {}) => [['voce', 2500, 1.7, 1], ['joel', 2350, 1.75, 1], ['helena', 3000, 1.7, -1], ['davi', 3150, 1.75, -1], ['leo', 2850, 1.7, -1]].forEach(([n, x, s, d], i) => p(P, n, n, pose({ x, y: 990, s, d, cab: 12, ol: [4, 4], ab: pisca(t, i + 1) }, ex[n] || {})));
const memoria = (pre, foco) => `<rect x="-200" y="-200" width="2320" height="1480" fill="url(#${pre}-ceuDia)"/><rect x="-200" y="900" width="2320" height="600" fill="#7c8088"/>
  <g transform="translate(${foco ? 1300 : 1100},1000) scale(${foco ? 3.2 : 1.8})">${EP3.caminhaoPipa()}</g><rect x="-200" y="-200" width="2320" height="1480" fill="#c9b18a" opacity=".35" style="mix-blend-mode:multiply"/>
  <rect x="-200" y="-200" width="2320" height="1480" fill="url(#${pre}-vinheta)"/>`;
K.cenaN('c15', [
  { de: 0, svg: (pre) => memoria(pre, false), quadro(tl, el, P, t, F) { camera(P, 960, 600, lerp(1.0, 1.15, prog(t, F(0), F(3)))); P.cam.style.filter = 'blur(1.5px) saturate(.7)'; } },
  { de: 3, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { const ab = ent(t, F(3), F(3) + 1); grupo(P, t, { voce: { o: [-6, 80], c: [10, 10], lean: 10 }, joel: { o: [-6, 80], c: [10, -10], boca: fala(t, F(4), F(4) + 1.8) } });
      at(P.q('.bancada g'), 'transform', `translate(2750,736) scale(${lerp(0.3, 1, ab)},1)`); op(P.q('.sv-lant'), 0.7); camera(P, 2750, 660, lerp(1.1, 1.2, prog(t, F(3), F(5)))); } },
  { de: 5, svg: (pre) => memoria(pre, true), quadro(tl, el, P, t, F) { camera(P, lerp(900, 1000, prog(t, F(5), F(8))), 640, 1.1); P.cam.style.filter = 'blur(1px) saturate(.75)'; } },
  { de: 8, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { const enc = Math.max(Math.sin(Math.PI * prog(t, F(9), F(9) + 0.8)), Math.sin(Math.PI * prog(t, F(11), F(11) + 0.8)));
      grupo(P, t, { helena: { boca: fala(t, F(8), F(8) + 2) + fala(t, F(10), F(10) + 1) + fala(t, F(12), F(12) + 1.4), cab: 0, ol: [6, 0] }, voce: { o: [-6 + enc * 50, enc * 50], c: [10 + enc * 80, enc * 80], cab: -4, ol: [6, 0] } });
      op(P.q('.sv-lant'), 0.7); camera(P, 2750, 640, 1.55); } },
  { de: 13, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { grupo(P, t, { voce: { cab: 0, ol: [7, 0] }, davi: { cab: 2, ol: [6, 0], boca: fala(t, F(14), F(17) + 2.5) } }); op(P.q('.sv-lant'), 0.7);
      const pd = pose({ x: 3150, y: 990, s: 1.75, d: -1 }); const c = B.cabecaMundo(pd); camera(P, lerp(2750, c[0] - 60, ent(t, F(14), F(14) + 1)), lerp(640, c[1] + 80, ent(t, F(14), F(14) + 1)), lerp(1.55, 2.6, ent(t, F(14), F(14) + 1))); } },
  { de: 18, svg: (pre) => EP3.mapa3(pre) + `<g class="dedo"><circle r="40" fill="#141414"/><rect x="-14" y="0" width="28" height="160" fill="#e67e22"/></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 0); op(P.q('.mCaminhao'), 1); op(P.q('.mCarros'), 1);
      const k = ent(t, F(18), F(18) + 1); at(P.q('.dedo'), 'transform', `translate(${lerp(1300, 1010, k) + Math.sin(t * 2) * 20},${lerp(900, 640, k)})`);
      camera(P, lerp(960, 960, k), lerp(540, 600, k), lerp(1.0, 1.9, k)); } },
  { de: 20, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { const cruza = ent(t, F(20), F(20) + 0.8); grupo(P, t, { joel: { o: [lerp(-6, 70, cruza), lerp(10, 80, cruza)], c: [lerp(10, 100, cruza), lerp(20, 100, cruza)], cab: 0, ol: [6, 0], boca: fala(t, F(21), F(21) + 0.8) } });
      op(P.q('.sv-lant'), 0.7); camera(P, 2420, 640, lerp(2.4, 2.6, prog(t, F(20), F(22)))); } },
  { de: 22, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { const pv = pose({ x: 2500, y: 990, s: 1.7, d: 1, cab: 14, ol: [4, 5], ab: 0.85 }); grupo(P, t, { voce: pv }); op(P.q('.sv-lant'), 0.7);
      const c = B.cabecaMundo(pv); camera(P, c[0] + 60, c[1] + 80, lerp(2.6, 2.9, prog(tl, 0, 4))); } },
]);
}
