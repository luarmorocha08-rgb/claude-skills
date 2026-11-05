/* c10 — "O mapa". Breno encontra o mapa na bolsa; Mauro aponta o abrigo e muda o preço. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const PAPEL = `<g transform="rotate(-6)"><rect x="-40" y="-28" width="80" height="56" fill="#f3ead2" stroke="#141414" stroke-width="4"/><path d="M-28,14 L-6,-2 L12,6 L30,-16" stroke="#1e6fd6" stroke-width="5" fill="none"/></g>`;
const BOLSAS = `<g class="bolsas">${[0, 1, 2].map((i) => `<g transform="translate(${2080 + i * 150},1262) scale(1.6)">${Pr.recipiente(['#3f8fd6', '#5dade2', '#16a085'][i])}</g>`).join('')}</g>`;
const cruz = (pre) => EP4.cruzamento(pre, { atores: BOLSAS + elenco(['davi', 'voce', 'breno', 'mauro'], { breno: { item: PAPEL }, mauro: { item: PAPEL } }) });
const breno = (P, t, ex = {}) => p(P, 'breno', 'breno', pose({ x: 2300, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 70], c: [10, 20] }, ex));
const mauro = (P, t, ex = {}) => p(P, 'mauro', 'mauro', pose({ x: 2780, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex));
const tirar = (P, id) => { const g = P.q(`#${id} .b-it`); if (g) g.style.display = 'none'; };
const por = (P, id) => { const g = P.q(`#${id} .b-it`); if (g) g.style.display = ''; };
K.cenaN('c10', [
  { de: 0, svg: (pre) => EP4.farmaciaDentro(pre, { atores: elenco(['voce']) }),
    quadro(tl, el, P, t, F) { const vira = ent(t, F(0) + 0.5, F(0) + 0.9); p(P, 'voce', 'voce', pose({ x: 1500, y: 990, s: 1.7, d: vira > 0.5 ? -1 : 1, ol: [6, 0], ab: 1.15 }));
      camera(P, lerp(1300, 1100, vira), 680, lerp(1.6, 1.4, vira)); } },
  { de: 1, svg: cruz,
    quadro(tl, el, P, t, F) { por(P, 'breno'); tirar(P, 'mauro'); breno(P, t, { boca: fala(t, F(1), F(1) + 1) * 0.6, cab: 10, ol: [3, 5] }); mauro(P, t, { x: -9999 });
      p(P, 'davi', 'davi', pose({ x: -9999, y: 0 })); p(P, 'voce', 'voce', pose({ x: -9999, y: 0 }));
      const k = ent(t, F(2), F(2) + 1); camera(P, lerp(2300, 2380, k), lerp(900, 1000, k), lerp(1.8, 3.4, k)); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { por(P, 'breno'); tirar(P, 'mauro'); const k = prog(t, F(3), F(4)); breno(P, t, { x: 2500, d: 1 }); mauro(P, t);
      p(P, 'voce', 'voce', pose({ x: lerp(1600, 2120, k), y: 1260, s: 1.7, d: 1, ol: [6, 1], ab: 1.1, medo: 0.3 }, k < 1 ? ANDA(tl, 6, 0.7) : {})); p(P, 'davi', 'davi', pose({ x: 1900, y: 1260, s: 1.75, d: 1 }));
      camera(P, lerp(2100, 2350, k), 920, 1.25); } },
  { de: 4, svg: cruz,
    quadro(tl, el, P, t, F) { tirar(P, 'breno'); por(P, 'mauro'); breno(P, t, { x: 2980, d: -1, o: [-6, 20], c: [10, 40] });
      mauro(P, t, { x: 2560, boca: fala(t, F(5), F(6)) * 0.6, o: [-6, t < F(5) ? 95 : 60], c: [10, t < F(5) ? -10 : 30], cab: t > F(7) && t < F(7) + 1.5 ? -6 : 0 });
      p(P, 'voce', 'voce', pose({ x: 2240, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t), boca: fala(t, F(6), F(7)) * 0.6 })); p(P, 'davi', 'davi', pose({ x: 2020, y: 1260, s: 1.75, d: 1, ab: pisca(t, 2) }));
      camera(P, 2400, 900, lerp(1.7, 1.85, prog(t, F(4), F(8)))); } },
  { de: 8, svg: cruz,
    quadro(tl, el, P, t, F) { tirar(P, 'breno'); por(P, 'mauro'); breno(P, t, { x: 2980, d: -1, o: [-6, 20], c: [10, 40] });
      mauro(P, t, { x: 2560, boca: fala(t, F(8), F(13)) * 0.6, o: [-6, 40 + 30 * Math.sin(t * 1.5)], c: [10, 40], d: t > F(9) && t < F(10) ? 1 : -1 });
      p(P, 'voce', 'voce', pose({ x: 2240, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) })); p(P, 'davi', 'davi', pose({ x: 2020, y: 1260, s: 1.75, d: 1, ab: pisca(t, 2) }));
      const pm = pose({ x: 2560, y: 1260, s: 1.75, d: -1 }); const c = B.cabecaMundo(pm); const k = ent(t, F(10), F(10) + 1.5);
      camera(P, lerp(2620, c[0] + 40, k), lerp(880, c[1] + 120, k), lerp(1.4, 2.6, k)); } },
  { de: 13, svg: cruz,
    quadro(tl, el, P, t, F) { tirar(P, 'breno'); const fecha = ent(t, F(14), F(14) + 0.6);
      breno(P, t, { x: 2980, d: -1, o: [-6, 20], c: [10, 40] }); mauro(P, t, { x: 2560, boca: fala(t, F(15), F(15) + 1.4) * 0.6, o: [-6, lerp(60, 30, fecha)], c: [10, 40], ab: t > F(15) ? 0.8 : 1 });
      p(P, 'voce', 'voce', pose({ x: 2240, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) })); p(P, 'davi', 'davi', pose({ x: 2020, y: 1260, s: 1.75, d: 1, ab: pisca(t, 2), boca: fala(t, F(13), F(14)) * 0.6 }));
      const g = P.q('#mauro .b-it'); if (g) { g.style.display = ''; g.setAttribute('transform', (g.getAttribute('transform') || '') + ` scale(${lerp(1, 0.5, fecha)},1)`); }
      const pm = pose({ x: 2560, y: 1260, s: 1.75, d: -1 }); const c = B.cabecaMundo(pm); const k = ent(t, F(15), F(15) + 0.5);
      camera(P, lerp(2300, c[0] + 20, k), lerp(900, c[1] + 60, k), lerp(1.6, 3.2, k)); } },
]);
}
