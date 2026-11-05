/* c05 — "Quem controla a rua". Mãos à vista; Breno e as bolsas no chão; Mauro sai de trás do caminhão. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3; const { MAOS_ALTO } = H4;
const BOLSAS = `<g class="bolsas" opacity="0">${[0, 1, 2].map((i) => `<g transform="translate(${2080 + i * 150},1262) scale(1.6)">${Pr.recipiente(['#3f8fd6', '#5dade2', '#16a085'][i])}</g>`).join('')}</g>`;
const cruz = (pre) => EP4.cruzamento(pre, { escada: true, atoresEscada: elenco(['homem:esc']), atores: BOLSAS + elenco(['leo', 'davi', 'voce', 'breno', 'mauro'], { breno: { item: Pr.bastao() }, mauro: { item: Pr.caderneta() } }) });
const esc = (P, t) => p(P, 'esc', 'homem', pose({ x: 3180, y: 700, s: 1.2, d: -1, ol: [-6, 2], ab: pisca(t, 7), chao: 0, alt: 0, q: [10, -10], j: [10, 30] }, { o: [-6, 150], c: [10, 20] }));
const herois = (P, t, tl, x0, anda, ex = {}) => [['leo', -360, 1.7], ['davi', -180, 1.75], ['voce', 0, 1.7]].forEach(([n, dx, s], i) => p(P, n, n, pose({ x: x0 + dx, y: 1260, s, d: 1, ol: [6, 0], ab: pisca(t, i + 1) }, anda ? ANDA(tl + i * 0.3, 5, 0.6) : {}, ex[n] || {})));
const breno = (P, t, x, ex = {}) => p(P, 'breno', 'breno', pose({ x, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex));
const mauro = (P, t, x, ex = {}) => p(P, 'mauro', 'mauro', pose({ x, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, { o: [-6, 10], c: [10, 70] }, ex));
K.cenaN('c05', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); const k = prog(t, F(0), F(2)); herois(P, t, tl, lerp(1500, 2160, k), k < 1, { voce: Object.assign({ boca: fala(t, F(0), F(1) + 1.5) * 0.6 }, MAOS_ALTO), davi: MAOS_ALTO, leo: MAOS_ALTO });
      const vem = ent(t, F(1), F(2) + 0.5); breno(P, t, lerp(2900, 2560, vem), vem > 0 && vem < 1 ? ANDA(tl, 5, 0.6) : {}); mauro(P, t, -9999); op(P.q('.bolsas'), 0);
      camera(P, lerp(2200, 2400, k), 900, lerp(0.85, 0.95, k)); } },
  { de: 2, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); herois(P, t, tl, 2160, false, { voce: Object.assign({ boca: fala(t, F(3), F(4)) * 0.6, cab: t > F(4) ? 6 : 0 }, MAOS_ALTO), davi: MAOS_ALTO, leo: MAOS_ALTO });
      breno(P, t, 2560, { boca: fala(t, F(2) + 1, F(3)) * 0.6, cab: t < F(2) + 1 ? 14 : 0, ol: t < F(2) + 1 ? [3, 5] : [6, 0] }); mauro(P, t, -9999); op(P.q('.bolsas'), 0);
      camera(P, lerp(2330, 2370, prog(t, F(2), F(5))), 900, lerp(1.5, 1.6, prog(t, F(2), F(5)))); } },
  { de: 5, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); const baixa = Math.sin(Math.PI * prog(t, F(5) + 0.6, F(5) + 2.4)); op(P.q('.bolsas'), t > F(5) + 1.5 ? 1 : 0);
      herois(P, t, tl, 2160, false, { voce: K.mistura(pose({}), pose({}, AG), baixa), davi: K.mistura(pose({}), pose({}, AG), baixa), leo: K.mistura(pose({}), pose({}, AG), baixa * 0.6) });
      breno(P, t, 2560, { boca: fala(t, F(5), F(5) + 1) * 0.6, o: [-6, 70], c: [10, 0] }); mauro(P, t, -9999);
      camera(P, 2200, 960, lerp(1.2, 1.3, prog(t, F(5), F(6)))); } },
  { de: 6, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); op(P.q('.bolsas'), 1); herois(P, t, tl, 2160, false, { davi: { boca: fala(t, F(6), F(7)) * 0.6 }, voce: { ab: t > F(7) ? 1.25 : 1 } });
      breno(P, t, 2560, { d: t > F(7) + 0.3 ? 1 : -1 }); const vem = ent(t, F(7) - 0.4, F(8) + 0.3);
      mauro(P, t, lerp(3500, 2840, vem), Object.assign({ boca: fala(t, F(8), F(8) + 0.5) }, vem < 1 ? ANDA(tl, 5, 0.6) : {}));
      camera(P, lerp(2400, 2620, vem), 920, lerp(1.0, 1.15, vem)); } },
  { de: 9, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); op(P.q('.bolsas'), 1); herois(P, t, tl, 2160, false); breno(P, t, 2560, { d: 1 });
      const pm = pose({ x: 2840, y: 1260, s: 1.75, d: -1, ol: [6, 1], ab: 0.75 }); mauro(P, t, 2840, { ab: 0.75, ol: [6, 1] }); const c = B.cabecaMundo(pm);
      const k = prog(t, F(9), F(11)); camera(P, lerp(c[0] - 30, c[0] - 10, k), lerp(c[1] + 60, c[1] + 160, ent(t, F(10), F(10) + 1)), lerp(3.0, 2.2, ent(t, F(10), F(10) + 1))); } },
  { de: 11, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); op(P.q('.bolsas'), 1); herois(P, t, tl, -9999, false); breno(P, t, -9999); mauro(P, t, 2840, { d: 1, cab: -4 });
      camera(P, lerp(2750, 2800, prog(t, F(11), F(12))), 760, lerp(2.0, 2.2, prog(t, F(11), F(12)))); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { esc(P, t); op(P.q('.bolsas'), 1); herois(P, t, tl, 2400, false, { voce: { ab: t > F(14) ? 0.85 : 1.1, boca: 0 }, davi: { x: -9999 }, leo: { x: -9999 } }); breno(P, t, -9999);
      mauro(P, t, 2700, { boca: fala(t, F(12), F(13)) * 0.6 + fala(t, F(14), F(14) + 2) * 0.6, o: [-6, t > F(14) ? 70 : 10], c: [10, t > F(14) ? 10 : 70] });
      const k = ent(t, F(13), F(13) + 1.2) * (1 - ent(t, F(14), F(14) + 0.8)); camera(P, lerp(2550, 2420, k), lerp(900, 840, k), lerp(1.7, 2.6, k)); } },
]);
}
