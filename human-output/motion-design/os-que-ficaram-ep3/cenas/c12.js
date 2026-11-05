/* c12 — "A primeira refeição". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, SCH, fala, pisca, elenco, p, ent } = H3;
const CANECA = `<g transform="translate(0,-4) scale(.9)">${Pr.caneca({ cor: '#ecf0f1' })}</g>`;
const cena = (pre) => EP3.quadra(pre, { atores: elenco(['helena', 'voce', 'davi', 'bia', 'irma'], { voce: { item: CANECA }, davi: { item: CANECA } }) + EP3.figurante('homem', '#7f8c8d') + EP3.figurante('k1', '#e74c3c') + EP3.figurante('k2', '#3498db') + EP3.figurante('f1', '#16a085') });
const vapor = (P, t) => P.qa('[class^="vp"]').forEach((v, i) => { at(v, 'transform', `translate(${Math.sin(t * 2 + i) * 6},${-((t * 30 + i * 20) % 40)})`); op(v, 0.3 + 0.3 * Math.sin(t * 3 + i)); });
const base = (P, t) => { vapor(P, t); p(P, 'helena', 'helena', pose({ x: 4800, y: 990, s: 1.7, d: 1, ab: pisca(t) })); B.posar(P.q('#k1'), pose({ x: 5600, y: 990, s: 1.0, d: 1 }, { q: [84, 88], j: [86, 90], chao: 0, alt: 0 })); B.posar(P.q('#k2'), pose({ x: 5720, y: 990, s: 1.0, d: -1 }, { q: [84, 88], j: [86, 90], chao: 0, alt: 0 })); };
const fora = (P, ns) => ns.forEach((n) => { const g = P.q('#' + n); if (g) B.posar(g, { x: -999, y: 990 }); });
K.cenaN('c12', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); fora(P, ['davi', 'bia', 'irma']); B.posar(P.q('#homem'), pose({ x: 5000, y: 990, s: 1.75, d: -1 })); B.posar(P.q('#f1'), pose({ x: 5200, y: 990, s: 1.7, d: -1 }));
      p(P, 'voce', 'voce', pose({ x: 5380, y: 990, s: 1.7, d: -1, cab: -8, ol: [6, -2], item: '' })); op(P.q('#voce .b-it'), 0); camera(P, 5100, 680, lerp(1.2, 1.3, prog(t, F(0), F(1)))); } },
  { de: 1, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#8d6e4c"/><g class="lata"><rect x="-60" y="-80" width="120" height="160" rx="12" fill="#c94a3a" stroke="#141414" stroke-width="6"/></g><g class="mug"><g transform="scale(6)">${Pr.caneca({ cor: '#ecf0f1' })}</g></g>
      <g class="maoA"><circle r="60" fill="#141414"/></g><g class="maoB"><circle r="60" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { const k = ent(t, F(1), F(1) + 1.4), k2 = ent(t, F(1) + 1.6, F(1) + 3);
      at(P.q('.lata'), 'transform', `translate(${lerp(500, 1300, k)},${560})`); at(P.q('.maoA'), 'transform', `translate(${lerp(420, 1220, k)},${620})`);
      at(P.q('.mug'), 'transform', `translate(${lerp(1500, 700, k2)},560)`); at(P.q('.maoB'), 'transform', `translate(${lerp(1600, 800, k2)},640)`); camera(P, 960, 560, 1.0); } },
  { de: 2, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#a49c8a"/><g transform="translate(960,640) scale(9)">${Pr.caneca({ cor: '#ecf0f1' })}</g><circle cx="760" cy="760" r="90" fill="#141414"/><circle cx="1180" cy="760" r="90" fill="#141414"/>
      <g opacity=".7">${[0, 1, 2].map((i) => `<path class="vp${i}" d="M${880 + i * 70},420 q-20,-50 0,-100 q20,-50 0,-100" fill="none" stroke="#fff" stroke-width="16" stroke-linecap="round"/>`).join('')}</g>`,
    quadro(tl, el, P, t, F) { vapor(P, t); camera(P, 960, 540, lerp(1.0, 1.06, prog(t, F(2), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); fora(P, ['davi', 'bia', 'irma', 'voce']); const recl = Math.abs(Math.sin(t * 5)) * (t < F(5) ? 1 : 0); const olha = ent(t, F(7), F(7) + 0.6); const volta = prog(t, F(9), F(9) + 2);
      B.posar(P.q('#homem'), pose({ x: lerp(5000, 5300, volta), y: 990, s: 1.75, d: volta > 0 ? 1 : olha > 0.5 ? 1 : -1, boca: fala(t, F(4), F(5)), ol: [6, 0] }, volta > 0 && volta < 1 ? H3.ANDA(tl, 6, .6) : { o: [-6, 60 + recl * 40], c: [10, 20] }));
      p(P, 'helena', 'helena', pose({ x: 4800, y: 990, s: 1.7, d: 1, boca: fala(t, F(5), F(6) + 1), ol: [6, 0] }, t > F(5) && t < F(7) ? { o: [-6, 70], c: [10, 10] } : {}));
      B.posar(P.q('#f1'), pose({ x: 5200, y: 990, s: 1.7, d: -1 }));
      camera(P, lerp(5000, 5350, ent(t, F(7) + 0.5, F(8) + 0.5)), 700, 1.3); } },
  { de: 10, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); fora(P, ['homem', 'f1']); const come = Math.max(0, Math.sin((t - F(10)) * 1.2));
      p(P, 'voce', 'voce', pose({ x: 2560, y: 990, s: 1.7, d: 1, cab: 10 - come * 6, ol: [4, 2], ab: pisca(t) }, SCH, { o: [-20, lerp(40, 80, come)], c: [20, lerp(70, 110, come)] }));
      p(P, 'irma', 'irma', pose({ x: 2400, y: 990, s: 1.62, d: 1, ab: pisca(t, 2) }, SCH)); p(P, 'davi', 'davi', pose({ x: 2900, y: 990, s: 1.75, d: -1, item: '' }, SCH)); op(P.q('#davi .b-it'), 0);
      p(P, 'bia', 'bia', pose({ x: 2780, y: 990, s: 1.1, d: 1 }, SCH)); camera(P, 2620, 780, lerp(1.5, 1.4, prog(t, F(10), F(13)))); } },
  { de: 13, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); fora(P, ['homem', 'f1']); const dorme = ent(t, F(13), F(13) + 2);
      p(P, 'bia', 'bia', pose({ x: 2780, y: 990, s: 1.1, d: 1, ab: lerp(1, 0.1, dorme), lean: dorme * 18, cab: dorme * 22 }, SCH));
      p(P, 'davi', 'davi', pose({ x: 2900, y: 990, s: 1.75, d: -1, cab: 10, ol: [4, 3] }, SCH, { o: [-20, lerp(40, 75, ent(t, F(14), F(14) + 0.6))], c: [20, 40] })); op(P.q('#davi .b-it'), t > F(14) ? 1 : 0);
      p(P, 'voce', 'voce', pose({ x: 2560, y: 990, s: 1.7, d: 1 }, SCH)); p(P, 'irma', 'irma', pose({ x: 2400, y: 990, s: 1.62, d: 1 }, SCH));
      camera(P, 2830, 820, lerp(2.4, 2.6, prog(t, F(13), F(15)))); } },
]);
}
