/* c14 — "No meio da rua". O documento à vista, a chave que não é entregue, Nando conta a verdade; a porta da farmácia escuta. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const cruz = (pre) => EP4.cruzamento(pre, { semCorrente: true, atoresFundo: elenco(['mulher:f1', 'homem:f2']), atores: elenco(['davi', 'leo', 'voce', 'nando', 'mauro', 'breno'], { voce: { item: Pr.prancheta(), itemT: Pr.chave() }, breno: { item: Pr.bastao() } }) });
const base = (P, t, ex = {}) => {
  p(P, 'f1', 'mulher', pose({ x: -9999, y: 980, s: 1.35, d: 1, ab: pisca(t, 7) }, ex.f1 || {})); p(P, 'f2', 'homem', pose({ x: -9999, y: 980, s: 1.4, d: 1, ab: pisca(t, 8) }, ex.f2 || {}));
  p(P, 'davi', 'davi', pose({ x: 2240, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 3) }, ex.davi || {}));
  p(P, 'leo', 'leo', pose({ x: 2060, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 4) }, { o: [-6, 40], c: [10, 90] }, ex.leo || {}));
  p(P, 'voce', 'voce', pose({ x: 2700, y: 1260, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 1) }, { o: [-6, 70], c: [10, 20] }, ex.voce || {}));
  p(P, 'nando', 'nando', pose({ x: 2900, y: 1260, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 2), lean: 8 }, ex.nando || {}));
  p(P, 'mauro', 'mauro', pose({ x: 2460, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: 3200, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex.breno || {})); };
K.cenaN('c14', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { mauro: { ol: t > F(1) ? [4, 5] : [6, -1], cab: t > F(1) ? 10 : 0 } }); camera(P, lerp(2600, 2640, prog(t, F(0), F(2))), 880, lerp(1.6, 1.8, prog(t, F(0), F(2)))); } },
  { de: 2, svg: cruz,
    quadro(tl, el, P, t, F) { const ergue = ent(t, F(2), F(2) + 0.6); base(P, t, { voce: { o: [-6, lerp(70, 120, ergue)], c: [10, lerp(20, -10, ergue)], boca: fala(t, F(3), F(6)) * 0.6 } });
      const pv = pose({ x: 2700, y: 1260, s: 1.7, d: -1 }); const c = B.cabecaMundo(pv); camera(P, lerp(c[0] - 80, c[0] - 140, prog(t, F(2), F(6))), c[1] + 120, lerp(2.4, 2.3, prog(t, F(2), F(6)))); } },
  { de: 6, svg: cruz,
    quadro(tl, el, P, t, F) { const est = ent(t, F(6), F(6) + 0.5); const recua = ent(t, F(7), F(7) + 0.5); base(P, t, { mauro: { o: [-6, lerp(10, 85, est)], c: [10, 0], boca: fala(t, F(6), F(7)) * 0.6 }, voce: { o: [-6, 40], c: [10, 30], x: 2700 + recua * 30 } });
      camera(P, 2580, 900, lerp(2.0, 2.2, prog(t, F(6), F(8))), 0, tremor(t, F(7), 3, 18, 8)); } },
  { de: 8, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { nando: { boca: fala(t, F(8), F(12)) * 0.6, o: [-6, 40 + 20 * Math.sin(t * 2)], c: [10, 30] }, mauro: { o: [-6, 10], c: [10, 20] } });
      const pn = pose({ x: 2900, y: 1260, s: 1.7, d: -1, lean: 8 }); const c = B.cabecaMundo(pn); const k = ent(t, F(9), F(9) + 1);
      camera(P, lerp(2780, c[0] - 30, k), lerp(900, c[1] + 70, k), lerp(1.7, 2.6, k)); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { const ap = ent(t, F(12), F(12) + 1); base(P, t, { f1: { x: lerp(2380, 2440, ap), d: 1, ol: [6, 0] }, f2: { x: lerp(2520, 2560, ap), d: 1, ol: [6, 0] }, mauro: { d: t > F(14) ? -1 : 1, o: t > F(14) ? [-6, 110] : [-7, 7], c: [10, -10], boca: fala(t, F(14), F(15)) * 0.6 } });
      const k = ent(t, F(14), F(14) + 1); camera(P, lerp(2480, 2480, k), lerp(820, 880, k), lerp(2.2, 1.3, k)); } },
]);
}
