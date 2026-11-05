/* c06 — "Escolher o que fica". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, ANDA, AG, SCH, fala, pisca, elenco, p, ent } = H3;
const coisas = () => `<g class="coisas"><rect x="80" y="930" width="180" height="60" rx="14" fill="#f1c40f" stroke="#141414" stroke-width="4"/><g transform="translate(330,990)"><rect x="-60" y="-50" width="120" height="50" rx="8" fill="#95a5a6" stroke="#141414" stroke-width="4"/><rect x="60" y="-40" width="40" height="8" fill="#7f8c8d"/></g>
  <rect x="420" y="950" width="120" height="40" fill="#8e5ea2" stroke="#141414" stroke-width="3"/><rect class="album" x="580" y="940" width="90" height="50" fill="#a04030" stroke="#141414" stroke-width="4"/>
  <g class="galao" transform="translate(760,990)"><rect x="-55" y="-150" width="110" height="150" rx="16" fill="#bfe3ff" stroke="#3f78c8" stroke-width="6" opacity=".95"/><rect x="-20" y="-176" width="40" height="28" rx="6" fill="#3f78c8"/><rect x="-55" y="-110" width="110" height="110" fill="#4a90d9" opacity=".5"/></g></g>`;
const cena = (pre, extra = '') => EP3.estacao(pre, { atores: coisas() + elenco(['voce', 'irma', 'leo', 'davi', 'bia']) + extra });
const base = (P, t) => { p(P, 'irma', 'irma', pose({ x: -150, y: 990, s: 1.62, d: 1, ab: pisca(t) })); p(P, 'bia', 'bia', pose({ x: 900, y: 990, s: 1.1, d: -1, ab: pisca(t, 3) })); };
K.cenaN('c06', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); const c = Math.sin(t * 4);
      p(P, 'voce', 'voce', pose({ x: 420, y: 990, s: 1.7, d: 1, cab: 14, ol: [4, 4] }, AG, { o: [10, 60 + c * 30], c: [40, 30] }));
      p(P, 'davi', 'davi', pose({ x: 660, y: 990, s: 1.75, d: -1, cab: 14, ol: [4, 4] }, AG, { o: [10, 60 - c * 30], c: [40, 30] }));
      p(P, 'leo', 'leo', pose({ x: 0, y: 990, s: 1.7, d: 1 })); camera(P, 450, 860, lerp(1.5, 1.6, prog(t, F(0), F(3)))); } },
  { de: 3, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); const abre = Math.sin(Math.PI * prog(t, F(3) + 0.6, F(3) + 2.4)); op(P.q('.album'), 0);
      const pd = pose({ x: 620, y: 990, s: 1.75, d: -1, cab: 16, ol: [3, 5], ab: lerp(1, 0.6, abre) }, SCH, { o: [10, 60], c: [80, 70], item: '' });
      p(P, 'davi', 'davi', Object.assign(pd, { item: `<g transform="scale(${1 + abre * 0.8},1)"><rect x="-26" y="-18" width="52" height="34" fill="#a04030" stroke="#141414" stroke-width="3"/></g>` }));
      p(P, 'voce', 'voce', pose({ x: 380, y: 990, s: 1.7, d: 1 }, AG)); p(P, 'leo', 'leo', pose({ x: 0, y: 990, s: 1.7, d: 1 }));
      const c = B.cabecaMundo(pd); camera(P, c[0] - 60, c[1] + 120, lerp(2.4, 2.6, prog(t, F(3), F(4)))); } },
  { de: 4, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); op(P.q('.album'), 0); const da = ent(t, F(5) + 1.0, F(5) + 2.2);
      p(P, 'voce', 'voce', pose({ x: 440, y: 990, s: 1.7, d: 1, cab: 6, ol: [5, 2] }, { o: [-6, 60], c: [10, 40], item: `<g transform="translate(0,6) scale(.5)"><path d="M-40,0 L-46,-90 L46,-90 L40,0 Z" fill="#c9b18a" stroke="#141414" stroke-width="8"/></g>` }));
      p(P, 'davi', 'davi', pose({ x: lerp(700, 640, da), y: 990, s: 1.75, d: -1, cab: 8, ol: [4, 2], ab: 0.8 }, { o: [-6, lerp(40, 75, da)], c: [10, 20], item: da < 0.9 ? `<rect x="-26" y="-18" width="52" height="34" fill="#a04030" stroke="#141414" stroke-width="3"/>` : '' }));
      p(P, 'leo', 'leo', pose({ x: 0, y: 990, s: 1.7, d: 1 })); camera(P, 540, 700, 2.0); } },
  { de: 6, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const ap = Math.sin(Math.PI * prog(t, F(6), F(6) + 1.8));
      p(P, 'bia', 'bia', pose({ x: 900, y: 990, s: 1.1, d: -1, cab: 10, ol: [4, 3] }, { o: [-6, lerp(20, 100, ap)], c: [10, -10] })); p(P, 'irma', 'irma', pose({ x: 560, y: 990, s: 1.62, d: 1 }, AG));
      p(P, 'voce', 'voce', pose({ x: 420, y: 990, s: 1.7, d: 1, cab: 14, ol: [4, 4] }, AG, { o: [10, 70], c: [40, 20] })); p(P, 'davi', 'davi', pose({ x: 660, y: 990, s: 1.75, d: -1 }, AG)); p(P, 'leo', 'leo', pose({ x: 0, y: 990, s: 1.7, d: 1 }));
      camera(P, 680, 840, lerp(1.7, 1.85, prog(t, F(6), F(8)))); } },
  { de: 8, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { base(P, t); const er = ent(t, F(8), F(8) + 0.7); const passos = prog(t, F(9), F(9) + 1.6); const solta = ent(t, F(10), F(10) + 0.5);
      const x = 760 + passos * 150; at(P.q('.galao'), 'transform', `translate(${x + 40},${990 - er * (1 - solta) * 60})`);
      p(P, 'voce', 'voce', pose({ x, y: 990, s: 1.7, d: 1, lean: 16 * er * (1 - solta), cab: 6, ol: [5, 3], ab: 0.8 }, passos > 0 && passos < 1 ? ANDA(tl, 4, 0.4) : {}, { o: [-6, lerp(20, 50, er)], c: [10, 30] }));
      p(P, 'davi', 'davi', pose({ x: 560, y: 990, s: 1.75, d: 1 })); p(P, 'leo', 'leo', pose({ x: 0, y: 990, s: 1.7, d: 1 }));
      camera(P, 900, 760, 1.4); } },
  { de: 11, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#7d858c"/><g transform="rotate(-4 960 540)"><rect x="560" y="300" width="800" height="480" fill="#fbf8f1" stroke="#c9b98f" stroke-width="6"/>
      <text class="agua" x="960" y="610" text-anchor="middle" font-family="Anton" font-size="220" fill="#1e3a5a"></text></g>
      <g class="caneta"><rect x="-14" y="-220" width="28" height="210" rx="8" fill="#2c3e50" stroke="#141414" stroke-width="4"/><polygon points="-14,-10 14,-10 0,16" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { const n = Math.floor(prog(t, F(11) + 1.2, F(11) + 3.4) * 4); P.q('.agua').textContent = 'ÁGUA'.slice(0, n);
      at(P.q('.caneta'), 'transform', `translate(${700 + n * 130 + Math.sin(t * 18) * 8},${620 + Math.cos(t * 14) * 10}) rotate(20)`); op(P.q('.caneta'), n < 4 || t < F(11) + 3.8 ? 1 : 0);
      camera(P, 960, 540, lerp(1.0, 1.08, prog(t, F(11), F(12)))); } },
  { de: 12, svg: (pre) => cena(pre, `<g class="bilhete" transform="translate(600,880) rotate(-6)"><rect x="-40" y="-26" width="80" height="52" fill="#fbf8f1" stroke="#141414" stroke-width="3"/>${txt(0, 12, 'ÁGUA', { f: 'Anton', t: 26, c: '#1e3a5a', a: 'middle' })}</g>`),
    quadro(tl, el, P, t, F) { at(P.q('.galao'), 'transform', 'translate(600,990)'); op(P.q('.coisas rect'), 1);
      const k = prog(t, F(12) + 1, F(14) + 1); const sobe = (x) => [x, Math.min(990, 990 - Math.max(0, (x - 300)) * 570 / 1200)];
      ['voce', 'irma', 'leo', 'davi', 'bia'].forEach((n, i) => { const x = lerp(700 - i * 120, 1500 - i * 120, k); const [xx, yy] = sobe(x); p(P, n, n, pose({ x: xx, y: yy, d: 1, s: n === 'bia' ? 1.1 : n === 'irma' ? 1.62 : 1.7 }, k > 0 && k < 1 ? ANDA(tl + i * 0.3, 6, 0.6) : {})); });
      camera(P, lerp(650, 900, k), lerp(820, 700, k), lerp(1.4, 0.9, E.io(k))); } },
]);
}
