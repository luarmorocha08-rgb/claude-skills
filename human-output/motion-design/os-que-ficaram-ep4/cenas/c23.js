/* c23 — "A lista". As últimas canecas; o corredor; o homem do rádio; a faixa branca; a voz de Mauro; as luzes apagando. EPISÓDIO 5. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, DEIT, fala, pisca, elenco, p, ent } = H3;
const NOITE = (P) => { op(P.q('.q-noite'), 0.85); const l = P.q('.q-luz'); at(l, 'cx', 1400); at(l, 'cy', 700); at(l, 'rx', 800); at(l, 'ry', 420); op(l, 0.65); };
const quadra = (pre) => EP3.quadra(pre, { atores: elenco(['voce', 'helena', 'homem:n1', 'mulher:n2', 'homem:d1', 'mulher:d2', 'senhor:d3', 'crianca:d4'], { voce: { item: Pr.canecas() }, helena: { item: Pr.caderneta() } }) });
const corr = (pre) => EP4.corredor(pre, { atores: elenco(['voce', 'radio'], { voce: { item: Pr.canecas() }, radio: { item: Pr.radio() } }) });
const RADIO = (pre) => `<rect x="-300" y="-300" width="2520" height="1680" fill="#0f1424"/><g transform="translate(960,560) scale(.95)">${EP2.radio(pre)}</g><rect class="estatica" x="-300" y="-300" width="2520" height="1680" fill="#fff" opacity="0"/>`;
const fim = (P, t, L) => {}; // tempos do fim calculados por cena
K.cenaN('c23', [
  { de: 0, svg: quadra,
    quadro(tl, el, P, t, F) { NOITE(P); const k = prog(t, F(0), F(1)); p(P, 'voce', 'voce', pose({ x: lerp(3000, 4600, k), y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, k < 1 ? ANDA(tl, 5, 0.5) : {}, { o: [-6, 40], c: [10, 80] }));
      ['helena', 'n1', 'n2', 'd1', 'd2', 'd3', 'd4'].forEach((n) => p(P, n, 'senhor', pose({ x: -9999, y: 990 }))); camera(P, lerp(3200, 4500, k), 700, 1.1); } },
  { de: 1, svg: quadra,
    quadro(tl, el, P, t, F) { NOITE(P); p(P, 'voce', 'voce', pose({ x: -9999, y: 990 })); p(P, 'helena', 'helena', pose({ x: 1420, y: 990, s: 1.7, d: 1, ol: [6, 2], ab: pisca(t), boca: fala(t, F(2), F(3)) * 0.6 }, { o: [-6, 50], c: [10, 80] }));
      p(P, 'n1', 'homem', pose({ x: 1680, y: 990, s: 1.68, d: -1, ol: [6, 0], ab: pisca(t, 2) })); p(P, 'n2', 'mulher', pose({ x: 1840, y: 990, s: 1.62, d: -1, ol: [6, 0], ab: pisca(t, 3) }));
      ['d1', 'd2', 'd3', 'd4'].forEach((n) => p(P, n, 'senhor', pose({ x: -9999, y: 990 }))); camera(P, 1600, 700, lerp(1.6, 1.75, prog(t, F(1), F(3)))); } },
  { de: 3, svg: quadra,
    quadro(tl, el, P, t, F) { NOITE(P); [['d1', 'homem', 1950], ['d2', 'mulher', 2190], ['d3', 'senhor', 2420], ['d4', 'crianca', 2650]].forEach(([id, n, x], i) => p(P, id, n, pose({ x, y: 990, s: n === 'crianca' ? 1.0 : 1.55, d: 1, ab: 0.1 }, DEIT, { alt: 30 })));
      p(P, 'voce', 'voce', pose({ x: 3050, y: 990, s: 1.7, d: -1, ol: [6, 2], ab: 0.9 }, { o: [-6, 40], c: [10, 80] })); ['helena', 'n1', 'n2'].forEach((n) => p(P, n, 'senhor', pose({ x: -9999, y: 990 })));
      camera(P, lerp(2300, 2700, prog(t, F(3), F(6))), 800, lerp(1.3, 1.4, prog(t, F(3), F(6)))); } },
  { de: 6, svg: corr,
    quadro(tl, el, P, t, F) { const k = prog(t, F(6), F(9)); p(P, 'voce', 'voce', pose({ x: lerp(300, 1900, k), y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, k < 1 ? ANDA(tl, 5, 0.5) : {}, { o: [-6, 40], c: [10, 80] }));
      p(P, 'radio', 'radio', pose({ x: 3150, y: 990, s: 1.7, d: 1, ol: [6, 0], cab: 8 }, { o: [-6, 60], c: [10, 90] })); camera(P, lerp(900, 2300, k), 680, lerp(1.0, 1.1, k)); } },
  { de: 9, svg: corr,
    quadro(tl, el, P, t, F) { p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, { o: [-6, 40], c: [10, 80] }));
      p(P, 'radio', 'radio', pose({ x: 3150, y: 990, s: 1.7, d: 1, ol: [6, 0], cab: 8, boca: fala(t, F(12), F(13)) * 0.4 + fala(t, F(15), F(16)) * 0.4 }, { o: [-6, 60], c: [10, 90] }));
      const para = t > F(13); const q = t < F(12) ? [3100, 640, 2.4] : t < F(13) ? [3150, 640, 3.0] : t < F(15) ? [2300, 620, 2.6] : [3150, 640, 3.2];
      camera(P, q[0], q[1], q[2] * lerp(1, 1.05, prog(t, F(9), F(17))), 0, para && t < F(13) + 0.5 ? tremor(t, F(13), 4, 18, 8) : [0, 0]); } },
  { de: 16, svg: corr,
    quadro(tl, el, P, t, F) { const vira = ent(t, F(16), F(16) + 0.7); p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: 1.2 }, { o: [-6, 40], c: [10, 80] }));
      p(P, 'radio', 'radio', pose({ x: 3150, y: 990, s: 1.7, d: vira > 0.5 ? -1 : 1, ol: [6, 0], ab: 0.85 }, { o: [-6, 60], c: [10, 90] }));
      const pr = pose({ x: 3150, y: 990, s: 1.7, d: -1, o: [-6, 60], c: [10, 90] }); const m = B.maoFrente(pr); const k = ent(t, F(16) + 0.8, F(17));
      camera(P, lerp(2700, m[0], k), lerp(680, m[1], k), lerp(1.4, 4.2, k)); } },
  { de: 17, off: 0.6, svg: (pre) => EP4.pulso(pre, { manga: '#5b4636' }),
    quadro(tl, el, P, t, F) { camera(P, lerp(1100, 1180, prog(t, F(17), F(18))), 560, lerp(1.2, 1.5, prog(t, F(17), F(18)))); } },
  { de: 18, svg: (pre) => EP4.pulso(pre, { manga: '#1f1f24', fundo: '#6fa6e0' }) + `<rect x="-300" y="-300" width="2520" height="1680" fill="#b08a55" opacity=".35" style="mix-blend-mode:multiply"/>`,
    quadro(tl, el, P, t, F) { camera(P, 1180, 560, lerp(1.3, 1.45, prog(t, F(18), F(18) + 2))); } },
  { de: 18, off: 2.6, svg: RADIO,
    quadro(tl, el, P, t, F, Fe) { const L = Fe(18); const voz0 = L + 1.5, voz1 = voz0 + 2.9; op(P.q('.estatica'), t > L + 0.8 && t < voz1 ? 0.05 + 0.06 * Math.abs(Math.sin(t * 47)) : 0);
      op(P.q('.r-lcd'), t > L + 0.8 ? 0.6 + 0.4 * Math.abs(Math.sin(t * 13)) : 0.9); op(P.q('.r-onda'), t > voz0 && t < voz1 ? 0.5 + 0.5 * Math.abs(Math.sin(t * 9)) : 0);
      camera(P, 960, 560, lerp(1.0, 1.25, prog(t, L + 0.6, voz1)), 0, [Math.sin(t * 31) * (t > voz0 && t < voz1 ? 1.5 : 0), 0]); } },
  { de: 18, off: 7.4, svg: (pre) => EP4.corredor(pre, { atores: elenco(['voce', 'radio'], { voce: { item: Pr.canecas() }, radio: { item: Pr.radio() } }) }), sobre: () => `<g><rect class="fimPreto" x="0" y="0" width="1920" height="1080" fill="#000" opacity="0"/><g class="fimTxt" opacity="0">${K.txt(960, 560, 'EPISÓDIO 5 — O INIMIGO JÁ ENTROU.', { f: 'Anton', t: 84, c: '#f4f1ea', a: 'middle', ls: 3 })}</g></g>`,
    quadro(tl, el, P, t, F, Fe) { const L = Fe(18); const t0 = L + 5.0; p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: 1.15 }, { o: [-6, 40], c: [10, 80] }));
      p(P, 'radio', 'radio', pose({ x: 3150, y: 990, s: 1.7, d: -1, ol: [6, 0], ab: 0.85 }, { o: [-6, 60], c: [10, 90] }));
      [0, 1, 2, 3, 4, 5].forEach((i) => op(P.q('.lamp' + (5 - i)), t > t0 + 1.0 + i * 0.55 ? 0 : 1)); op(P.q('.c-noite'), lerp(0.62, 0.9, ent(t, t0 + 1, t0 + 4.3)));
      const fimT = t0 + 4.4; camera(P, 2720, 680, lerp(1.3, 1.45, prog(t, t0, fimT)));
      op(P.q('.fimPreto'), t > fimT ? 1 : 0); op(P.q('.fimTxt'), t > fimT + 0.8 ? E.out(prog(t, fimT + 0.8, fimT + 1.7)) * (1 - E.in(prog(t, fimT + 4.4, fimT + 4.9))) : 0); } },
]);
}
