/* c02 — "O que levar". A carteira com o que cabe na viagem; Joel e a mangueira; o mapa que esquece as pessoas. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, fala, pisca, elenco, p, ent } = H3;
const pulsa = (t, a) => 1 + 0.12 * Math.sin(Math.PI * K.clamp((t - a) / 0.6));
const mapa = (pre) => EP3.mapa3(pre) + `<g class="dedo"><circle r="38" fill="#141414"/><rect x="-12" y="-110" width="24" height="90" rx="12" fill="#141414"/></g>`;
const mapaQ = (P, t, F) => { at(P.q('.rota2'), 'stroke-dashoffset', 1600 * (1 - ent(t, F(5), F(5) + 2.5))); op(P.q('.rota1'), 0); op(P.q('.mCaminhao'), ent(t, F(5) + 1, F(5) + 1.4)); op(P.q('.mCarros'), 0.8); };
K.cenaN('c02', [
  { de: 0, svg: (pre) => EP4.mesa(pre),
    quadro(tl, el, P, t, F) { const i0 = F(1), i1 = F(1) + 0.9, i2 = F(1) + 2.6;
      at(P.q('.ms-garrafa'), 'transform', `translate(420,520) scale(${3 * pulsa(t, i0)})`);
      at(P.q('.ms-rec1'), 'transform', `translate(680,600) scale(${3 * pulsa(t, i1)})`); at(P.q('.ms-rec2'), 'transform', `translate(900,620) scale(${3 * pulsa(t, i1 + 0.2)})`);
      at(P.q('.ms-bolachas'), 'transform', `translate(1120,520) scale(${pulsa(t, i2)})`);
      const pega = ent(t, F(2), F(2) + 0.8), leva = ent(t, F(2) + 1.0, F(2) + 1.8);
      at(P.q('.ms-ferr'), 'transform', `translate(${1440 + leva * 700},${760 - leva * 100}) scale(3.2)`);
      at(P.q('.ms-mao'), 'transform', `translate(${lerp(2100, 1460, pega) + leva * 700},${lerp(900, 740, pega) - leva * 100})`);
      at(P.q('.ms-mao2'), 'transform', `translate(${lerp(-200, 520, ent(t, F(0), F(0) + 0.8)) - (t > F(1) + 3.5 ? 800 : 0)},${lerp(1200, 640, ent(t, F(0), F(0) + 0.8))})`);
      camera(P, lerp(900, 1000, prog(t, F(0), F(3))), 560, lerp(1.0, 1.1, prog(t, F(0), F(3)))); } },
  { de: 3, svg: (pre) => EP3.quadra(pre, { atores: elenco(['joel', 'davi', 'leo', 'rosa', 'voce'], { joel: { item: Pr.mangueira() }, leo: { item: Pr.ferramentas() } }) }),
    quadro(tl, el, P, t, F) { op(P.q('.q-noite'), 0.25); const dá = ent(t, F(3) + 0.3, F(3) + 1.3);
      p(P, 'joel', 'joel', pose({ x: 1800, y: 990, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t) }, { o: [-6, lerp(30, 80, dá)], c: [10, lerp(40, 0, dá)] }));
      p(P, 'davi', 'davi', pose({ x: 2060, y: 990, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 2) }, { o: [-6, lerp(10, 70, dá)], c: [10, 10] }));
      p(P, 'leo', 'leo', pose({ x: 2300, y: 990, s: 1.7, d: -1, ol: [5, 0], ab: pisca(t, 3) }, { o: [-6, 30], c: [10, 50] }));
      p(P, 'rosa', 'rosa', pose({ x: 1550, y: 990, s: 1.7, d: 1, ab: pisca(t, 4) }));
      p(P, 'voce', 'voce', pose({ x: 2520, y: 990, s: 1.7, d: -1, ab: pisca(t, 5) }));
      camera(P, 2000, 700, lerp(1.25, 1.35, prog(t, F(3), F(4)))); } },
  { de: 4, svg: (pre) => mapa(pre),
    quadro(tl, el, P, t, F) { mapaQ(P, t, F); const aponta = ent(t, F(7), F(7) + 0.6); op(P.q('.mMaquina'), ent(t, F(7) + 0.3, F(7) + 0.7));
      at(P.q('.dedo'), 'transform', `translate(${lerp(1600, 1010, aponta)},${lerp(1200, 680, aponta)})`); op(P.q('.dedo'), t > F(7) ? 1 : 0);
      camera(P, lerp(960, 1000, prog(t, F(4), F(8))), lerp(540, 580, prog(t, F(4), F(8))), lerp(1.0, 1.3, prog(t, F(4), F(8)))); } },
  { de: 8, svg: (pre) => EP3.quadra(pre, { atores: elenco(['helena', 'voce']) }),
    quadro(tl, el, P, t, F) { op(P.q('.q-noite'), 0.25); const acena = Math.sin(Math.PI * prog(t, F(8), F(8) + 0.9));
      p(P, 'helena', 'helena', pose({ x: 1300, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, { o: [-6, 40], c: [10, 70] }));
      p(P, 'voce', 'voce', pose({ x: 1520, y: 990, s: 1.7, d: -1, ol: [6, 0], cab: 8 * acena, ab: pisca(t, 2) }));
      camera(P, 1420, 700, lerp(1.9, 2.0, prog(t, F(8), F(9)))); } },
  { de: 9, svg: (pre) => mapa(pre),
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 0); op(P.q('.rota1'), 0); op(P.q('.mCaminhao'), 1); op(P.q('.mMaquina'), 1); op(P.q('.mCarros'), 0.8); op(P.q('.dedo'), 0);
      const k = ent(t, F(9), F(10) + 1.2); camera(P, lerp(960, 940, k), lerp(540, 610, k), lerp(1.1, 2.6, k));
      op(P.preto, 0.5 * ent(t, F(10), F(10) + 1.5)); } },
]);
}
