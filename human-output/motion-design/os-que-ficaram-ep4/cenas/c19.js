/* c19 — "O portão da escola". O caminhão chega; o sorriso da irmã desaparece; Helena abre para a água e fecha para Mauro. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const fora = (pre) => EP3.escolaFora(pre, { dentro: elenco(['irma', 'helena', 'joel']), atores: `<g class="pipaE">${EP3.caminhaoPipa()}</g><g class="carroM">${EP3.carroLado('#8e5ea2')}</g>` + elenco(['voce', 'leo', 'nando', 'davi', 'cintia', 'mauro', 'breno']) });
const dentro = (P, t, ex = {}) => { p(P, 'irma', 'irma', pose({ x: -9999, y: 870, s: 1.45, d: -1, ol: [6, 0], ab: pisca(t, 7) }, ex.irma || {})); p(P, 'helena', 'helena', pose({ x: -9999, y: 870, s: 1.5, d: -1, ol: [6, 0], ab: pisca(t, 8) }, ex.helena || {})); p(P, 'joel', 'joel', pose({ x: -9999, y: 870, s: 1.5, d: -1, ab: pisca(t, 9) }, ex.joel || {})); };
const fora4 = (P, t, ex = {}) => [['voce', 1], ['leo', 2], ['nando', 3], ['davi', 4], ['cintia', 5], ['mauro', 6], ['breno', 7]].forEach(([n, i]) => p(P, n, n, pose({ x: -9999, y: 980, s: 1.6, d: 1, ol: [6, 0], ab: pisca(t, i) }, ex[n] || {})));
const pipa = (P, x) => at(P.q('.pipaE'), 'transform', `translate(${x},1160)`); const carro = (P, x) => at(P.q('.carroM'), 'transform', `translate(${x},1190)`);
K.cenaN('c19', [
  { de: 0, svg: fora,
    quadro(tl, el, P, t, F) { dentro(P, t); const chega = E.out(prog(t, F(0) - 0.5, F(1))); pipa(P, lerp(500, 2900, chega) + Math.sin(t * 60) * 1.5); carro(P, -9999); fora4(P, t);
      camera(P, lerp(1800, 2700, chega), 720, lerp(0.75, 0.85, chega)); } },
  { de: 1, svg: fora,
    quadro(tl, el, P, t, F) { pipa(P, 2900); carro(P, -9999); fora4(P, t); const sorri = ent(t, F(2), F(2) + 0.4);
      dentro(P, t, { irma: { x: lerp(4100, 3830, ent(t, F(1), F(1) + 1.4)), boca: sorri * 0.5, ol: [6, -1] } }); camera(P, 3830, 640, lerp(2.3, 2.5, prog(t, F(1), F(3)))); } },
  { de: 3, svg: fora,
    quadro(tl, el, P, t, F) { pipa(P, 2900); dentro(P, t, { irma: { x: 3830 } }); const desce = ent(t, F(4), F(4) + 1.6); const vem = E.out(prog(t, F(5) - 0.3, F(6)));
      fora4(P, t, { leo: { x: 2350, y: 1250, s: 1.75, o: [-6, 40], c: [10, 90] }, nando: { x: 3150, y: lerp(1150, 1250, desce), s: 1.75, lean: 14, o: [-6, -60], c: [10, 0] }, voce: { x: 2550, y: 1250, s: 1.75, d: 1 }, davi: { x: 2750, y: 1250, s: 1.8 } }); carro(P, lerp(400, 2050, vem));
      const quem = t < F(4) ? [2350, 900, 2.2] : t < F(5) ? [3050, 900, 2.0] : [2300, 900, 1.2]; camera(P, quem[0], quem[1], quem[2]); } },
  { de: 6, svg: fora,
    quadro(tl, el, P, t, F) { pipa(P, 2900); carro(P, 2050); dentro(P, t, { irma: { x: 3830, ab: 0.9, cab: 6 } }); fora4(P, t);
      const pi = pose({ x: 3830, y: 870, s: 1.45, d: -1 }); const c = B.cabecaMundo(pi); camera(P, c[0], c[1] + 40, lerp(3.4, 3.6, prog(t, F(6), F(7)))); } },
  { de: 7, svg: fora,
    quadro(tl, el, P, t, F) { pipa(P, 2900); carro(P, 2050); const ch = E.out(prog(t, F(7), F(8))); dentro(P, t, { irma: { x: 3990 }, helena: { x: lerp(4100, 3820, ent(t, F(7), F(8))), boca: 0, ol: [6, 0], cab: t > F(10) ? 6 : 0 } });
      fora4(P, t, { voce: pose({ x: lerp(2700, 3420, ch), boca: fala(t, F(8), F(10)) * 0.6 }, ch < 1 ? ANDA(tl, 6, 0.7) : {}) }); camera(P, lerp(3100, 3600, ch), 720, lerp(1.3, 1.9, ch)); } },
  { de: 11, svg: fora,
    quadro(tl, el, P, t, F) { const ab = ent(t, F(11) + 0.6, F(11) + 1.8); const fecha = ent(t, F(13), F(13) + 0.8); const g = lerp(1, 0.08, ab) + (1 - lerp(1, 0.08, ab)) * fecha;
      at(P.q('.portaoQuadra'), 'transform', `translate(3500,0) scale(${g},1) translate(-3500,0)`); const entra = E.in(prog(t, F(11) + 1.6, F(12) + 1)); pipa(P, lerp(2900, 4600, entra)); carro(P, 2050);
      dentro(P, t, { helena: { x: 3820, boca: fala(t, F(11), F(11) + 1) * 0.6, o: [-6, 80], c: [10, 0] }, joel: { x: lerp(4150, 3960, ab), d: -1 }, irma: { x: 4080 } });
      const vem = prog(t, F(12), F(13) + 0.3); fora4(P, t, { voce: { x: 3300, d: 1 }, mauro: pose({ x: lerp(2200, 3380, vem), d: 1 }, vem > 0 && vem < 1 ? ANDA(tl, 6, 0.7) : {}), davi: { x: 3100 } });
      camera(P, lerp(3200, 3420, ent(t, F(12), F(13))), 740, lerp(0.95, 1.5, ent(t, F(12), F(13) + 1))); } },
  { de: 14, svg: fora,
    quadro(tl, el, P, t, F) { at(P.q('.portaoQuadra'), 'transform', 'translate(3500,0) scale(1,1) translate(-3500,0)'); pipa(P, -9999); carro(P, 2050);
      dentro(P, t, { helena: { x: 3820 } }); fora4(P, t, { voce: { x: 3300, d: 1 }, davi: { x: 3120 }, mauro: { x: 3420, d: 1, item: '' }, breno: { x: 2700 } });
      camera(P, lerp(3300, 3250, prog(t, F(14), F(16))), 720, lerp(1.25, 1.1, prog(t, F(14), F(16)))); } },
]);
}
