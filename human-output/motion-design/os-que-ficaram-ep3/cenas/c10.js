/* c10 — "Helena e a lista". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, fala, pisca, elenco, p, ent } = H3;
const PRANCHETA = `<g transform="rotate(-10)"><rect x="-22" y="-30" width="44" height="58" rx="3" fill="#8d6e4c" stroke="#141414" stroke-width="3"/><rect x="-16" y="-22" width="32" height="44" fill="#fbf8f1"/></g>`;
const cena = (pre) => EP3.quadra(pre, { atores: elenco(['helena', 'voce', 'irma', 'leo', 'davi', 'bia'], { helena: { item: PRANCHETA } }) });
const base = (P, t, ex = {}) => { p(P, 'helena', 'helena', pose({ x: 1420, y: 990, s: 1.7, d: 1, ab: pisca(t, 3) }, { o: [-6, 50], c: [10, 70] }, ex.helena || {}));
  [['voce', 1820, 1.7], ['irma', 1980, 1.62], ['leo', 2140, 1.7], ['davi', 2300, 1.75], ['bia', 2420, 1.1]].forEach(([n, x, s], i) => p(P, n, n, pose({ x, y: 990, s, d: -1, ab: pisca(t, i + 4), ol: [5, 0] }, ex[n] || {}))); };
K.cenaN('c10', [
  { de: 0, svg: (pre) => cena(pre), quadro(tl, el, P, t, F) { base(P, t, { helena: { boca: fala(t, F(0), F(0) + 1.4), cab: 2, ol: [6, 0] } }); camera(P, 1750, 640, lerp(0.95, 1.05, prog(t, F(0), F(3)))); } },
  { de: 3, svg: (pre) => cena(pre), quadro(tl, el, P, t, F) { const esc = Math.sin(t * 6) * 3; base(P, t, { voce: { boca: fala(t, F(3), F(6) + 1.5) }, helena: { cab: 12, ol: [4, 4], o: [-6, 50 + esc], c: [10, 70] } });
      camera(P, 1620, 680, lerp(1.8, 1.9, prog(t, F(3), F(6)))); } },
  { de: 6, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#8d6e4c"/><rect x="560" y="80" width="800" height="1000" rx="20" fill="#6b5236" stroke="#141414" stroke-width="8"/><rect x="600" y="160" width="720" height="900" fill="#fbf8f1"/>
      <rect x="840" y="60" width="240" height="70" rx="10" fill="#95a5a6" stroke="#141414" stroke-width="6"/>${txt(960, 240, 'CHEGADAS', { f: 'Anton', t: 54, c: '#2b2e34', a: 'middle' })}
      ${Array.from({ length: 9 }, (_, i) => `<line class="ln ln${i}" x1="650" y1="${320 + i * 80}" x2="650" y2="${320 + i * 80}" stroke="#2c3e50" stroke-width="7" stroke-linecap="round"/>`).join('')}
      <g class="caneta"><rect x="-12" y="-200" width="24" height="190" rx="8" fill="#2c3e50"/><polygon points="-12,-10 12,-10 0,14" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { let pt = [650, 320]; P.qa('.ln').forEach((l, i) => { const k = prog(t, F(6) + i * 0.9, F(6) + i * 0.9 + 0.8); const x2 = 650 + k * (420 + (i % 3) * 80); at(l, 'x2', x2); if (k > 0 && k < 1) pt = [x2, 320 + i * 80]; });
      at(P.q('.caneta'), 'transform', `translate(${pt[0]},${pt[1]}) rotate(25)`); camera(P, 960, 560, lerp(1.0, 1.06, prog(t, F(6), F(9)))); } },
  { de: 9, svg: (pre) => cena(pre), quadro(tl, el, P, t, F) { base(P, t); camera(P, lerp(250, 800, prog(t, F(9), F(11) + 1)), 420, 1.8); } },
  { de: 11, svg: (pre) => cena(pre), quadro(tl, el, P, t, F) { base(P, t, { irma: { x: 620, d: -1, cab: -10, ol: [6, -3] }, voce: { x: 760, d: -1, cab: -6, ol: [5, -2] } });
      const k = ent(t, F(13), F(13) + 2.5); camera(P, lerp(680, 560, k), lerp(620, 470, k), lerp(1.7, 3.2, k)); } },
]);
}
