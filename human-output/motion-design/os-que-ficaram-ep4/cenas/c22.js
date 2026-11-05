/* c22 — "O que veio junto". Fim de tarde no degrau da quadra; "não sei"; a escola funcionando por alguns minutos. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, SC, fala, pisca, elenco, p, ent } = H3;
const TARDE = `<rect class="tardeF" x="-600" y="-600" width="6800" height="2200" fill="#f0a060" opacity=".32" style="mix-blend-mode:multiply"/>`;
const quadra = (pre) => EP3.quadra(pre, { atores: elenco(['nando', 'cintia', 'helena', 'bia', 'davi', 'voce', 'irma'], { nando: { item: Pr.caneca() }, bia: { item: Pr.lapis() } }) + `<g class="degrau"><rect x="1700" y="960" width="900" height="40" fill="#b9a98f" stroke="#7a6a4a" stroke-width="4"/></g>` }) + TARDE;
const doisSentados = (P, t, ex = {}) => { p(P, 'irma', 'irma', pose({ x: 2050, y: 1000, s: 1.62, d: 1, ol: [6, 0], ab: pisca(t, 2) }, SC, ex.irma || {})); p(P, 'voce', 'voce', pose({ x: 2230, y: 1000, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 1) }, SC, ex.voce || {})); };
const fundo = (P, t) => { p(P, 'nando', 'nando', pose({ x: 4750, y: 990, s: 1.6, d: 1, ol: [6, 3], ab: pisca(t, 3) }, SC, { o: [-6, 40], c: [10, 100 + Math.sin(t * 2) * 15] }));
  p(P, 'cintia', 'cintia', pose({ x: 1300, y: 990, s: 1.6, d: 1, ol: [6, 0], ab: pisca(t, 4), boca: fala(t, 0, 999) * 0.4 })); p(P, 'helena', 'helena', pose({ x: 1480, y: 990, s: 1.62, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 40], c: [10, 70] }));
  p(P, 'bia', 'bia', pose({ x: 3000, y: 990, s: 1.05, d: 1, ol: [3, 6], cab: 14 }, SC, { o: [-6, 60], c: [10, 70] })); p(P, 'davi', 'davi', pose({ x: 3180, y: 990, s: 1.7, d: -1, ol: [6, 2], ab: pisca(t, 6) }, SC)); };
const insert = (obj, fundoC) => (pre) => EP4.maos(pre, { fundo: fundoC, obj: `<g class="ins">${obj}</g>` });
K.cenaN('c22', [
  { de: 0, svg: quadra,
    quadro(tl, el, P, t, F) { fundo(P, t); doisSentados(P, t, { irma: { boca: fala(t, F(0), F(1)) * 0.5 }, voce: { boca: fala(t, F(1), F(4)) * 0.5 } }); camera(P, 2140, 760, lerp(2.2, 2.35, prog(t, F(0), F(1)))); } },
  { de: 1, svg: insert(`<g transform="translate(960,560) scale(6)">${Pr.lanternaAzul()}</g><g transform="translate(1500,560) scale(5)">${Pr.corrente(8)}</g>`, '#2a2f3a'),
    quadro(tl, el, P, t, F) { op(P.q('.mA'), 0); const k = t < F(2) ? 0 : t < F(3) ? 1 : 2; const alvo = [[960, 560, 1.4], [1540, 560, 1.6], [1200, 620, 0.9]][k]; camera(P, alvo[0], alvo[1], alvo[2] * lerp(1, 1.06, ((t - F(1)) % 1.5) / 1.5)); } },
  { de: 4, svg: quadra,
    quadro(tl, el, P, t, F) { fundo(P, t); const olha = t > F(6); doisSentados(P, t, { irma: { boca: fala(t, F(5), F(6)) * 0.5 }, voce: { d: olha ? 1 : -1, ol: olha ? [6, -2] : [6, 0], boca: fala(t, F(7), F(8)) * 0.5, ab: 0.85 } });
      camera(P, lerp(2140, 2200, prog(t, F(4), F(9))), 760, lerp(2.3, 2.5, prog(t, F(4), F(9)))); } },
  { de: 9, svg: quadra,
    quadro(tl, el, P, t, F) { fundo(P, t); const encosta = ent(t, F(9), F(9) + 1.2); doisSentados(P, t, { irma: { x: lerp(2050, 2110, encosta), lean: 10 * encosta, ab: 0.7 }, voce: { ab: 0.8 } }); camera(P, 2160, 790, lerp(2.6, 2.9, prog(t, F(9), F(10)))); } },
  { de: 10, svg: quadra,
    quadro(tl, el, P, t, F) { fundo(P, t); doisSentados(P, t, { irma: { x: 2110, lean: 10, ab: 0.7 }, voce: { ab: 0.85 } }); const q = t < F(11) ? 0 : t < F(12) ? 1 : t < F(13) ? 2 : t < F(14) ? 3 : 4;
      const alvo = [[2900, 640, 0.75], [4950, 660, 1.6], [5100, 600, 1.4], [4750, 760, 2.4], [2160, 780, 2.2]][q]; camera(P, alvo[0], alvo[1], alvo[2]); } },
]);
}
