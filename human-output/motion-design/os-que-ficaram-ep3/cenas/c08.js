/* c08 — "O ponto de ônibus". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, SC, SCH, fala, pisca, elenco, p, ent } = H3;
const cena = (pre) => EP2.ruaLado(pre, { luz: 'manha' }) + `<g transform="translate(1600,980)">${EP3.abrigoOnibus()}</g>` + elenco(['voce', 'irma', 'leo', 'davi', 'bia'], { irma: { item: `<rect x="-14" y="-18" width="28" height="36" rx="2" fill="#2c3e50" stroke="#141414" stroke-width="3"/>` } });
const BANCO = { q: [84, 88], j: [86, 90], chao: 0, alt: 52, o: [10, 30], c: [40, 50] };
const sentados = (P, t, ex = {}) => { const L = [['irma', 1440, 1.62], ['voce', 1560, 1.7], ['leo', 1690, 1.7]];
  L.forEach(([n, x, s], i) => p(P, n, n, pose({ x, y: 980, s, d: 1, ab: pisca(t, i + 2), ol: [5, 1] }, BANCO, ex[n] || {})));
  p(P, 'davi', 'davi', pose({ x: 1960, y: 980, s: 1.75, d: -1, ab: pisca(t, 7), ol: [5, 1] }, ex.davi || {})); p(P, 'bia', 'bia', pose({ x: 1860, y: 980, s: 1.1, d: 1, ab: pisca(t, 8) }, ex.bia || {})); };
K.cenaN('c08', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const esf = Math.max(0, Math.sin(t * 2)) * prog(t, F(0) + 1, F(0) + 1.4);
      sentados(P, t, { voce: { o: [10, lerp(30, 130, esf)], c: [40, 120], cab: -6 + esf * 4 } }); camera(P, 1700, 760, lerp(1.2, 1.3, prog(t, F(0), F(1)))); } },
  { de: 1, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const tira = Math.sin(Math.PI * prog(t, F(1) + 0.3, F(1) + 2.2)); sentados(P, t, { irma: { lean: 30 * tira, o: [10, 60 + 50 * tira], c: [40, 30], cab: 20 * tira, ol: [4, 5] } });
      camera(P, 1440, 840, lerp(2.4, 2.6, prog(t, F(1), F(2)))); } },
  { de: 2, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const dev = Math.sin(Math.PI * prog(t, F(3) + 1.0, F(3) + 2.4));
      sentados(P, t, { leo: { o: [10, 70], c: [40, 20] }, bia: { o: [-6, lerp(40, 80, dev)], c: [10, 20], cab: lerp(0, 10, dev) }, davi: { o: [-6, lerp(10, 60, dev)], c: [10, 20], cab: 10, ol: [4, 4] } });
      camera(P, 1880, 780, lerp(1.9, 2.0, prog(t, F(2), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const vira = ent(t, F(4), F(4) + 0.5); sentados(P, t, { voce: { cab: -8 * vira, ol: [lerp(5, -6, vira), 0] } });
      const pv = pose({ x: 1560, y: 980, s: 1.7, d: 1 }, BANCO); const c = B.cabecaMundo(pv); camera(P, c[0], c[1] + 60, 3.0); } },
  { de: 5, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { sentados(P, t, { voce: { boca: fala(t, F(5), F(5) + 3) } }); camera(P, 1700, 760, lerp(1.25, 1.35, prog(t, F(5), F(7)))); } },
  { de: 7, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { sentados(P, t, { bia: { cab: -14, ol: [4, -4], boca: fala(t, F(7), F(7) + 2.6) }, davi: { cab: 12, ol: [4, 4], boca: fala(t, F(8), F(8) + 1) } });
      camera(P, 1910, 760, lerp(2.4, 2.6, prog(t, F(7), F(10)))); } },
  { de: 10, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const ap = ent(t, F(10), F(10) + 0.8); sentados(P, t, { irma: { o: [10, lerp(60, 80, ap)], c: [40, lerp(60, 110, ap)], cab: 14, ol: [4, 5], ab: 0.7 } });
      camera(P, 1450, 760, lerp(2.7, 2.9, prog(t, F(10), F(11)))); } },
  { de: 11, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { sentados(P, t); camera(P, 1700, 700, lerp(1.1, 0.95, prog(tl, 0, 4))); } },
]);
}
