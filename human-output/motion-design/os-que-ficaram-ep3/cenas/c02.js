/* c02 — "A casa fica para trás". */
{
const { E, camera, op, at, prog, lerp, ruido } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const rua = (pre, o = {}) => EP2.ruaLado(pre, Object.assign({ luz: 'manha' }, o));
K.cenaN('c02', [
  { de: 0, svg: (pre) => rua(pre) + elenco(['voce', 'irma']) + `<rect class="chave" x="0" y="0" width="14" height="6" fill="#d9c27a"/>`,
    quadro(tl, el, P, t, F) { const gira = Math.sin(Math.PI * prog(t, F(0) + 0.4, F(0) + 1.2)); const testa = Math.max(Math.sin(Math.PI * prog(t, F(1) + 0.3, F(1) + 0.8)), Math.sin(Math.PI * prog(t, F(1) + 1.0, F(1) + 1.5)));
      p(P, 'voce', 'voce', pose({ x: 1430, y: 980, d: 1, s: 1.7, cab: -4, ol: [5, 0], ab: pisca(t) }, { o: [-6, 80 - testa * 12], c: [10, 10 + gira * 20], lean: testa * 4 }));
      p(P, 'irma', 'irma', pose({ x: 1250, y: 980, d: 1, s: 1.6, cab: 4, ol: [5, 1] }));
      const ch = P.q('.chave'); at(ch, 'x', 1500); at(ch, 'y', 806); op(ch, t < F(1) ? 1 : 0);
      camera(P, 1450, 760, lerp(1.6, 1.75, prog(t, F(0), F(3)))); } },
  { de: 3, svg: (pre) => rua(pre) + elenco(['voce', 'irma']),
    quadro(tl, el, P, t, F) { const anda = t > F(7) + 0.6; const k = prog(t, F(7) + 0.6, F(8) + 2);
      const bate = Math.sin(Math.PI * prog(t, F(4), F(4) + 0.6)), mostra = ent(t, F(6), F(6) + 0.5);
      p(P, 'irma', 'irma', pose({ x: 1260 + (anda ? k * 300 : 0), y: 980, s: 1.6, d: 1, cab: 4, ol: [6, 0], boca: fala(t, F(3), F(3) + 2) + fala(t, F(5), F(5) + 1.2) + fala(t, F(7), F(7) + 1.4) }, anda ? ANDA(tl, 6, 0.8) : {}));
      p(P, 'voce', 'voce', pose({ x: 1460 + (anda ? k * 320 : 0), y: 980, s: 1.7, d: anda ? 1 : -1, cab: 2, ol: [5, 0], ab: pisca(t) }, anda ? ANDA(tl + 0.3, 6, 0.8) : { o: [lerp(-6, 40, bate), lerp(10, 80, mostra)], c: [lerp(10, 80, bate), 20] }));
      camera(P, 1400 + (anda ? k * 200 : 0), 760, 1.55); } },
  { de: 8, svg: (pre) => rua(pre) + elenco(['voce', 'irma']),
    quadro(tl, el, P, t, F) { const k = prog(t, F(8), F(10));
      p(P, 'voce', 'voce', pose({ x: 1900 + k * 1200, y: 980, s: 1.1, d: 1, ol: [5, 0] }, ANDA(tl, 6, 0.8)));
      p(P, 'irma', 'irma', pose({ x: 1780 + k * 1200, y: 980, s: 1.05, d: 1, ol: [5, 0] }, ANDA(tl + 0.4, 6, 0.8)));
      camera(P, 1530, 700, lerp(1.25, 1.18, k)); } },
  { de: 10, svg: (pre) => rua(pre, { esquinas: [1500, 3300] }) + elenco(['voce', 'irma']),
    quadro(tl, el, P, t, F) { const k = prog(t, F(10), F(12) + 2); const x = lerp(400, 3000, k);
      const olha = Math.abs(x - 1500) < 300 || Math.abs(x - 3300) < 300 ? 1 : 0;
      p(P, 'voce', 'voce', pose({ x, y: 980, s: 1.5, d: 1, cab: olha ? -4 : 0, ol: [olha ? 7 : 5, 0] }, ANDA(tl, 6.5, 0.8)));
      p(P, 'irma', 'irma', pose({ x: x - 170, y: 980, s: 1.42, d: 1, ol: [5, 0] }, ANDA(tl + 0.4, 6.5, 0.8)));
      camera(P, x + 150, 720, 1.1); } },
]);
}
