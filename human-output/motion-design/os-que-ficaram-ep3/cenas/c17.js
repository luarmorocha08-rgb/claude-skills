/* c17 — "Mais uma pessoa". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const CANECA = `<g transform="translate(0,-4) scale(.9)">${Pr.caneca({ cor: '#ecf0f1' })}</g>`;
const portao = (pre) => EP3.escolaFora(pre, { atores: elenco(['pai', 'mae', 'menino', 'helena']) });
const familia = (P, t, x0 = 3200, ex = {}) => { p(P, 'pai', 'pai', pose({ x: x0, y: 980, s: 1.75, d: 1, ol: [6, 0] }, { o: [-6, 60], c: [10, 70] }, ex.pai || {})); p(P, 'mae', 'mae', pose({ x: x0 - 170, y: 980, s: 1.65, d: 1, ol: [6, 0], ab: pisca(t, 3) }, { item: '<rect x="-20" y="0" width="40" height="44" rx="6" fill="#d9c7aa" stroke="#141414" stroke-width="3"/>' }));
  p(P, 'menino', 'menino', pose({ x: x0 + 40, y: 980 - 230, s: 0.85, d: 1, chao: 0, alt: 0, q: [70, 80], j: [80, 90], ol: [5, 0] }, ex.menino || {})); };
K.cenaN('c17', [
  { de: 0, svg: (pre) => portao(pre),
    quadro(tl, el, P, t, F) { const k = prog(t, F(0), F(0) + 3); familia(P, t, lerp(2700, 3250, k)); p(P, 'helena', 'helena', pose({ x: 3640, y: 870, s: 1.5, d: -1, ol: [6, 0] }, t > F(0) + 2 ? ANDA(tl, 6, .5) : {}));
      camera(P, 3300, 700, lerp(1.0, 1.15, prog(t, F(0), F(2)))); } },
  { de: 2, svg: (pre) => portao(pre),
    quadro(tl, el, P, t, F) { familia(P, t, 3250, { menino: { boca: fala(t, F(2), F(2) + 1.8), cab: -6, ol: [6, -2] } }); p(P, 'helena', 'helena', pose({ x: 3640, y: 870, s: 1.5, d: -1 }));
      const ab = ent(t, F(3), F(3) + 1.2); at(P.q('.portaoQuadra'), 'transform', `translate(3500,0) scale(${lerp(1, 0.1, ab)},1) translate(-3500,0)`);
      camera(P, lerp(3320, 3450, ab), lerp(640, 700, ab), lerp(2.6, 1.6, ab)); } },
  { de: 4, svg: (pre) => EP3.servico(pre, { atores: elenco(['voce'], { voce: { item: CANECA } }) }),
    quadro(tl, el, P, t, F) { at(P.q('.bd0'), 'transform', 'translate(630,880)'); const serve = Math.sin(Math.PI * prog(t, F(5), F(5) + 1.6)); const nivel = ent(t, F(5), F(5) + 1.6);
      at(P.q('.bd0 .agua'), 'y', lerp(-30, -18, nivel)); at(P.q('.bd0 .agua'), 'height', lerp(30, 18, nivel));
      p(P, 'voce', 'voce', pose({ x: 820, y: 990, s: 1.7, d: -1, cab: 20, ol: [3, 6], lean: serve * 26 }, { o: [-6, lerp(30, 70, serve)], c: [10, 20] }));
      camera(P, 700, 820, lerp(2.2, 2.6, ent(t, F(5), F(5) + 1))); } },
  { de: 6, svg: (pre) => portao(pre) + `<g class="mug"><g transform="scale(.9)">${Pr.caneca({ cor: '#ecf0f1' })}</g></g>`,
    quadro(tl, el, P, t, F) { familia(P, t, 3700, { menino: { o: [-6, 100], c: [10, 110], cab: 10, ol: [3, 4], ab: 0.7 } }); p(P, 'helena', 'helena', pose({ x: 4000, y: 980, s: 1.7, d: -1 }));
      at(P.q('.portaoQuadra'), 'transform', 'translate(3500,0) scale(0.1,1) translate(-3500,0)');
      const bebe = ent(t, F(7), F(7) + 0.6); const m = B.maoFrente(pose({ x: 3740, y: 750, s: 0.85, d: 1, chao: 0, alt: 0, q: [70, 80], j: [80, 90] }, { o: [-6, 100], c: [10, 110] }));
      at(P.q('.mug'), 'transform', `translate(${lerp(3500, m[0] + 6, ent(t, F(6), F(6) + 0.8))},${lerp(820, m[1] - 4, ent(t, F(6), F(6) + 0.8))}) rotate(${bebe * -30})`);
      camera(P, 3700, 720, lerp(2.4, 2.6, prog(t, F(6), F(8)))); } },
  { de: 8, svg: (pre) => EP3.mapa3(pre) + `<g class="caneta"><rect x="-12" y="-200" width="24" height="190" rx="8" fill="#d6262f" stroke="#141414" stroke-width="4"/><polygon points="-12,-10 12,-10 0,14" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 0); op(P.q('.mCaminhao'), 1); op(P.q('.mCarros'), 1); op(P.q('.mMaquina'), 1);
      const k = ent(t, F(9), F(9) + 1.5); op(P.q('.mHora'), k); at(P.q('.caneta'), 'transform', `translate(${lerp(1300, 1660, k)},${lerp(900, 950, k) + Math.sin(t * 16) * 6}) rotate(25)`); op(P.q('.caneta'), t < F(10) + 1.5 ? 1 : 0);
      camera(P, lerp(960, 1400, ent(t, F(9), F(9) + 1)), lerp(540, 880, ent(t, F(9), F(9) + 1)), lerp(1.0, 2.0, ent(t, F(9), F(9) + 1))); } },
]);
}
