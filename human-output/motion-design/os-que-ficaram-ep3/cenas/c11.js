/* c11 — "Um lugar para sentar". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, SCH, fala, pisca, elenco, p, ent, APONTA } = H3;
const CADEIRA = { q: [84, 88], j: [86, 90], chao: 0, alt: 45, o: [10, 30], c: [40, 50] };
const cena = (pre) => EP3.quadra(pre, { atores: elenco(['rosa', 'davi', 'irma', 'voce', 'leo', 'helena'], { leo: { item: `<rect x="-8" y="-12" width="16" height="22" rx="4" fill="#f1c40f" stroke="#141414" stroke-width="3"/>` }, voce: { item: Pr.celular({ aceso: false }) } }) });
const fora = (P, nomes) => nomes.forEach((n) => p(P, n, n, pose({ x: -999, y: 990 })));
K.cenaN('c11', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { fora(P, ['irma', 'voce', 'leo', 'helena']); const sent = ent(t, F(3), F(3) + 0.8);
      p(P, 'rosa', 'rosa', pose({ x: 3860, y: 990, s: 1.65, d: 1, cab: 8, ol: [4, 2], boca: fala(t, F(2), F(2) + 0.8) }, t > F(2) && t < F(3) ? APONTA : { o: [-6, 70], c: [10, 40] }));
      p(P, 'davi', 'davi', K.mistura(pose({ x: 4030, y: 990, s: 1.75, d: -1, boca: fala(t, F(1), F(1) + 1), cab: -4 }, { o: [-6, 50], c: [10, 20] }), pose({ x: 4060, y: 990, s: 1.75, d: -1 }, CADEIRA), sent));
      camera(P, 3980, 680, lerp(1.6, 1.7, prog(t, F(0), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { fora(P, ['rosa', 'davi', 'leo', 'helena']); const s1 = ent(t, F(4), F(4) + 1.5), s2 = ent(t, F(5), F(5) + 1), apoia = ent(t, F(6), F(6) + 2);
      p(P, 'irma', 'irma', K.mistura(pose({ x: 2400, y: 990, s: 1.62, d: -1 }), pose({ x: 2400, y: 990, s: 1.62, d: 1, ol: [5, 0] }, SCH), s1));
      p(P, 'voce', 'voce', K.mistura(pose({ x: 2560, y: 990, s: 1.7, d: -1 }), pose({ x: 2560, y: 990, s: 1.7, d: 1, ab: lerp(1, 0.55, apoia), lean: -6 - 8 * apoia, cab: -6 * apoia }, SCH), s2));
      camera(P, 2480, 800, lerp(1.9, 2.1, prog(t, F(4), F(7)))); } },
  { de: 7, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { fora(P, ['rosa', 'davi', 'irma', 'voce']); const guarda = ent(t, F(10), F(10) + 0.6);
      p(P, 'leo', 'leo', pose({ x: 4150, y: 990, s: 1.7, d: 1, boca: fala(t, F(7), F(7) + 1.8), ol: [5, 0] }, { o: [-6, lerp(60, 0, guarda)], c: [10, 40] }));
      p(P, 'helena', 'helena', pose({ x: 4550, y: 990, s: 1.7, d: -1, boca: fala(t, F(8), F(9) + 2), ol: [5, 1] }, t > F(8) && t < F(9) ? { o: [-6, 70], c: [10, 30] } : {}));
      camera(P, 4350, 720, lerp(1.6, 1.7, prog(t, F(7), F(11)))); } },
  { de: 11, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a8272"/><g class="cel" transform="translate(960,600) rotate(-6) scale(.8)">${CEL.svg('', { id: 'c11cel', fundo: '#050608' })}</g>`,
    quadro(tl, el, P, t, F) { const g = E.in(prog(t, F(11) + 1.5, F(11) + 2.6)); at(P.q('.cel'), 'transform', `translate(960,${600 + g * 900}) rotate(${-6 + g * 10}) scale(.8)`); camera(P, 960, 560, lerp(1.0, 1.08, prog(tl, 0, 3))); } },
]);
}
