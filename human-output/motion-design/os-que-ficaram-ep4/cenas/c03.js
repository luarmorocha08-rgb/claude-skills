/* c03 — "O caminho conhecido". O banco do ponto, o lápis amarelo, a papelaria fechada e a barreira na rua. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const rua = (pre) => EP4.ruaPonto(pre, { atores: elenco(['davi', 'leo', 'voce'], { davi: { mochila: true } }) });
const trio = (P, t, tl, xs, anda, ex = {}) => [['davi', 1.75, 0], ['voce', 1.7, 1], ['leo', 1.7, 2]].forEach(([n, s, i]) => p(P, n, n, pose({ x: xs[i], y: 980, s, d: 1, ol: [6, 0], ab: pisca(t, i + 1) }, anda ? ANDA(tl + i * 0.35, 6, 0.75) : {}, ex[n] || {})));
K.cenaN('c03', [
  { de: 0, svg: rua,
    quadro(tl, el, P, t, F) { const k = prog(t, F(0), F(1) + 1); const x = lerp(-100, 900, k); trio(P, t, tl, [x + 300, x, x - 180], k < 1, { voce: { cab: 10, ol: [3, 4] } });
      camera(P, lerp(500, 800, k), 700, 1.15); } },
  { de: 1, svg: rua,
    quadro(tl, el, P, t, F) { trio(P, t, tl, [1250, 980, 800], false, { voce: { d: -1, cab: 6, ol: [5, 3], ab: 0.85 } }); const pv = pose({ x: 980, y: 980, s: 1.7, d: -1 });
      const c = B.cabecaMundo(pv); camera(P, lerp(c[0] - 120, c[0] - 180, prog(t, F(1), F(3))), c[1] + 120, lerp(2.4, 2.6, prog(t, F(1), F(3)))); } },
  { de: 3, svg: rua,
    quadro(tl, el, P, t, F) { const k = prog(t, F(3), F(8)); const x = lerp(900, 1500, k);
      trio(P, t, tl, [x + 340, x, x - 200], true, { voce: { boca: fala(t, F(4), F(4) + 2) * 0.6 }, davi: { boca: fala(t, F(6), F(7) + 1) * 0.6, cab: t > F(5) && t < F(5) + 0.6 ? 10 : 0 } });
      camera(P, x + 140, 720, lerp(1.6, 1.7, k)); } },
  { de: 6, svg: (pre) => EP4.maos(pre, { fundo: '#5b6b80', obj: `<g class="desenho" transform="translate(960,540) rotate(4)"><rect x="-300" y="-200" width="600" height="400" fill="#fbf8f1" stroke="#141414" stroke-width="8"/>
      <circle cx="160" cy="-90" r="60" fill="#f1c40f"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="160" y1="-90" x2="${160 + Math.cos(i * 0.785) * 100}" y2="${-90 + Math.sin(i * 0.785) * 100}" stroke="#f1c40f" stroke-width="8"/>`).join('')}
      <path d="M-240,150 L-160,40 L-80,150 Z" fill="#e74c3c" stroke="#141414" stroke-width="5"/><rect x="-230" y="150" width="140" height="10" fill="#141414"/>
      ${[[-30, 60], [40, 40], [100, 70]].map(([x, h]) => `<g transform="translate(${x},150)"><line y1="0" y2="${-h}" stroke="#141414" stroke-width="6"/><circle cy="${-h - 22}" r="22" fill="#fff" stroke="#141414" stroke-width="5"/></g>`).join('')}
      <path d="M150,170 L176,140" stroke="#f1c40f" stroke-width="14" stroke-linecap="round"/><path d="M180,134 L190,122" stroke="#141414" stroke-width="6"/></g>` }),
    quadro(tl, el, P, t, F) { at(P.q('.mA'), 'transform', 'translate(640,760)'); op(P.q('.mB'), 1); at(P.q('.mB'), 'transform', 'translate(1290,760)');
      const quebra = ent(t, F(7), F(7) + 0.5); at(P.q('.desenho'), 'transform', `translate(960,${lerp(560, 540, ent(t, F(6), F(6) + 1))}) rotate(4)`);
      camera(P, lerp(960, 1100, quebra), lerp(540, 480, quebra), lerp(1.0, 1.9, quebra)); } },
  { de: 8, svg: rua,
    quadro(tl, el, P, t, F) { trio(P, t, tl, [1900, 1600, 1420], false, { leo: { d: 1, cab: -8, ol: [7, -2], boca: fala(t, F(9), F(9) + 1) * 0.6 }, voce: { d: -1 }, davi: { d: -1 } });
      const k = ent(t, F(8), F(8) + 1.5); camera(P, lerp(1450, 1760, k), lerp(720, 620, k), lerp(1.7, 1.25, k)); } },
  { de: 10, svg: rua,
    quadro(tl, el, P, t, F) { const k = prog(t, F(10), F(11)); const para = t > F(11) - 0.4; const x = lerp(2000, 2500, k);
      trio(P, t, tl, [x + 320, x, x - 190], !para, { voce: { ab: para ? 1.2 : 1 }, davi: { o: para ? [-6, 60] : [-7, 7], c: para ? [10, 0] : [10, 10] } });
      const rev = ent(t, F(11), F(13) + 1.2); camera(P, lerp(2500, 3290, rev), lerp(760, 880, rev), lerp(1.1, 1.6, ent(t, F(12), F(13) + 1)));
      at(P.q('.corda'), 'd', `M3140,1040 Q3280,${1080 + Math.sin(t * 2) * 6} 3420,1040`); } },
]);
}
