/* c15 — "Cíntia escolhe". Ela desce o degrau; "Ninguém. Eu estou dizendo o que vou fazer." A mão de Mauro perto do coldre (a arma nunca sai). */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const RECS = `<g class="recsCalc">${[0, 1, 2, 3, 4].map((i) => `<g class="rc rc${i}" transform="translate(${2380 + i * 110},1262) scale(1.5)">${Pr.recipiente(['#3f8fd6', '#5dade2', '#e67e22', '#16a085', '#3f8fd6'][i])}</g>`).join('')}</g>`;
const cruz = (pre) => EP4.cruzamento(pre, { semCorrente: true, atores: RECS + elenco(['davi', 'voce', 'nando', 'cintia', 'homem:h1', 'mulher:m1', 'crianca:k1', 'mauro', 'breno'], { breno: { item: Pr.bastao() }, cintia: { item: '' } }) });
const base = (P, t, tl, ex = {}) => {
  p(P, 'davi', 'davi', pose({ x: 1950, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 3) }, ex.davi || {}));
  p(P, 'voce', 'voce', pose({ x: 2120, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, ex.voce || {}));
  p(P, 'nando', 'nando', pose({ x: 2270, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 2), lean: 12 }, ex.nando || {}));
  p(P, 'cintia', 'cintia', pose({ x: 2700, y: 1260, s: 1.66, d: 1, ol: [6, 0], ab: pisca(t, 4) }, ex.cintia || {}));
  p(P, 'h1', 'homem', pose({ x: -9999, y: 1260, s: 1.68, d: -1, ab: pisca(t, 7) }, ex.h1 || {}));
  p(P, 'm1', 'mulher', pose({ x: -9999, y: 1260, s: 1.62, d: -1, ab: pisca(t, 8) }, ex.m1 || {}));
  const xm = (ex.m1 && ex.m1.x) || -9999; p(P, 'k1', 'crianca', pose({ x: xm - 30, y: 1260 - 97, s: 0.75, d: -1, chao: 0, alt: 0, q: [70, 80], j: [80, 90], o: [60, 40], c: [40, 40] }));
  p(P, 'mauro', 'mauro', pose({ x: 3060, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: 3300, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex.breno || {})); };
const recs = (P, pegos) => [0, 1, 2, 3, 4].forEach((i) => op(P.q('.rc' + i), i < pegos ? 0 : 1));
K.cenaN('c15', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { recs(P, 0); const desce = prog(t, F(0), F(0) + 2.2); base(P, t, tl, { cintia: pose({ x: lerp(2450, 2700, desce), y: lerp(1000, 1260, E.io(desce)), s: lerp(1.38, 1.66, desce), boca: fala(t, F(1), F(3)) * 0.6 }, desce < 1 ? ANDA(tl, 5, 0.6) : {}) });
      camera(P, lerp(2500, 2700, desce), lerp(820, 900, desce), lerp(1.3, 1.5, desce)); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { recs(P, 0); base(P, t, tl, { cintia: { d: 1, boca: fala(t, F(5), F(6)) * 0.6, ol: [7, 0] }, mauro: { boca: fala(t, F(3), F(4)) * 0.6, o: [-6, 40], c: [10, 50] } });
      const k = ent(t, F(5), F(5) + 0.8); camera(P, lerp(2880, 2780, k), lerp(880, 930, k), lerp(1.9, 2.7, k)); } },
  { de: 6, svg: cruz,
    quadro(tl, el, P, t, F) { const pega = ent(t, F(7), F(7) + 0.8); recs(P, pega > 0.5 ? 1 : 0); const treme = Math.sin(t * 40) * 2.5;
      base(P, t, tl, { cintia: Object.assign({ o: [-6, lerp(10, 40, pega) + treme], c: [10, 20 + treme], item: '' }, pega > 0.5 ? {} : {}) });
      const g = P.q('#cintia .b-it'); if (g) g.innerHTML = pega > 0.5 ? `<g transform="translate(0,40)">${Pr.recipiente()}</g>` : '';
      const pc = pose({ x: 2700, y: 1260, s: 1.66, d: 1, o: [-6, 40], c: [10, 20] }); const m = B.maoFrente(pc); camera(P, lerp(m[0], 2600, pega), lerp(m[1], 1050, pega), lerp(3.4, 2.0, pega)); } },
  { de: 8, svg: cruz,
    quadro(tl, el, P, t, F) { const v1 = ent(t, F(8), F(8) + 1.4), v2 = ent(t, F(9), F(9) + 1.4); recs(P, 1 + (v1 > 0.9 ? 1 : 0) + (v2 > 0.9 ? 1 : 0));
      base(P, t, tl, { h1: pose({ x: lerp(1600, 2440, v1), d: 1 }, v1 < 1 ? ANDA(tl, 5, 0.6) : { o: [-6, 40], c: [10, 20] }), m1: pose({ x: lerp(1500, 2560, v2), d: 1 }, v2 < 1 ? ANDA(tl + 0.4, 5, 0.6) : {}), cintia: { o: [-6, 40], c: [10, 20] } });
      const g = P.q('#cintia .b-it'); if (g) g.innerHTML = `<g transform="translate(0,40)">${Pr.recipiente()}</g>`;
      camera(P, 2450, 900, 1.15); } },
  { de: 10, svg: cruz,
    quadro(tl, el, P, t, F) { recs(P, 3); const mao = ent(t, F(11), F(11) + 0.8); base(P, t, tl, { h1: { x: 2440, d: 1 }, m1: { x: 2560, d: 1 }, breno: { d: 1, ol: [-6, 0], cab: -6 }, mauro: { o: [-6, lerp(10, 2, mao)], c: [10, lerp(20, -30, mao)], ab: 0.85 } });
      const pm = pose({ x: 3060, y: 1260, s: 1.75, d: -1 }); const c = B.cabecaMundo(pm); const k = ent(t, F(11), F(11) + 1);
      camera(P, lerp(3180, 3060, k), lerp(c[1] + 100, 1080, k), lerp(2.1, 2.9, k)); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { recs(P, 3); const calma = ent(t, F(12), F(12) + 0.5); base(P, t, tl, { h1: { x: 2440, d: 1 }, m1: { x: 2560, d: 1 }, davi: Object.assign({ boca: fala(t, F(12), F(13)) * 0.6 }, calma > 0.5 ? H4.MAOS_ALTO : {}), voce: { ab: 1.2, medo: 0.4, lean: t > F(13) ? -8 : 0 }, nando: { lean: 16, o: [-6, -40], c: [10, 20] } });
      const k = ent(t, F(13), F(13) + 1); camera(P, lerp(2050, 2190, k), 900, lerp(1.8, 2.3, k)); } },
  { de: 14, svg: cruz,
    quadro(tl, el, P, t, F) { recs(P, 3); const ap = ent(t, F(15), F(15) + 0.6); base(P, t, tl, { h1: { x: 2440, d: 1 }, m1: { x: 2560, d: 1 }, cintia: { d: ap > 0.5 ? -1 : 1, o: [-6, lerp(40, 100, ap)], c: [10, 0], boca: fala(t, F(16), F(17)) * 0.6 } });
      camera(P, lerp(2600, 2720, prog(t, F(14), F(17))), 900, lerp(1.2, 1.4, prog(t, F(14), F(17)))); } },
]);
}
