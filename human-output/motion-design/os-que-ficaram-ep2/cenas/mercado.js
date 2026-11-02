/* mercado — Cena 4 "O mercado" (28,7 s). Narração começa em 0,4 s.
   Planos: a fachada quebrada → gente que teve a mesma ideia → a prateleira de água vazia → a cesta abandonada
   → bolachas, castanhas, latas com anel → as pilhas → chama a irmã, bem baixo → nenhuma resposta. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const ANDA = (t, v = 7, a = 1) => B.andar(t * v, a);
const OUTROS = [['o1', '#c0392b', 2240], ['o2', '#e0a43a', 3300], ['o3', '#8e5ea2', 1500]];
const outros = () => OUTROS.map(([id, c]) => B.svg(id, { roupa: c, roupaEsc: '#00000044', mochila: true })).join('');
function posarOutros(P, t, d = 1) {
  OUTROS.forEach(([id, c, x], i) => { const g = P.q(`#${id}`); if (!g) return;
    const pega = Math.max(0, Math.sin(t * 2.2 + i * 2));
    B.posar(g, pose({ x: x + Math.sin(t * 0.5 + i) * 30, y: 990, s: S * 0.95, d: i % 2 ? -1 : 1, cab: -10 + pega * 6, ol: [4, -3] }, { o: [-6, 60 + pega * 90], c: [10, 20] })); });
}
const fachada = (pre) => `<rect x="-600" y="-400" width="3200" height="1500" fill="url(#${pre}-ceuManha)"/>
  <rect x="300" y="150" width="1400" height="730" fill="#d8cdb5"/><rect x="280" y="130" width="1440" height="40" fill="#b8a98f"/>
  <rect x="560" y="190" width="880" height="120" fill="#2f6fd6"/>${txt(1000, 282, 'MERCADO', { f: 'Anton', t: 96, a: 'middle' })}
  <rect x="380" y="380" width="1240" height="500" fill="#3a4250"/>${[0, 1, 2, 3].map((i) => `<rect x="${400 + i * 305}" y="400" width="285" height="460" fill="#6f8099" opacity=".8"/>`).join('')}
  <path d="M1020,420 L1080,520 L1050,600 M1080,520 L1180,500 M1080,520 L1120,680 M1050,600 L960,660" stroke="#ffffff" stroke-width="6" fill="none"/>
  <polygon points="1010,860 1180,860 1140,700 1060,640" fill="#141414" opacity=".7"/>
  <rect x="-600" y="870" width="3200" height="120" fill="#c9c5bb"/><rect x="-600" y="985" width="3200" height="600" fill="#7c8088"/>
  ${[0, 1, 2].map((i) => `<g transform="translate(${180 + i * 140},990) rotate(${[-8, 12, 80][i]} 0 -20)">${EP2.carrinho()}</g>`).join('')}
  ${Array.from({ length: 10 }, (_, i) => `<polygon points="${1050 + i * 40},${985 - (i % 3) * 4} ${1070 + i * 40},${972 + (i % 2) * 6} ${1080 + i * 40},${985}" fill="#cfe2f0" opacity=".8"/>`).join('')}`;

K.cena('mercado', { planos: [
  /* S1 — você chega: a fachada quebrada */
  { ate: 3.4,
    svg: (pre) => fachada(pre) + B.svg('voce', { mochila: true }),
    quadro(tl, el, P, t) {
      const x = lerp(-200, 900, prog(t, 0, 3.0));
      B.posar(P.q('#voce'), pose({ x, y: 980, s: 1.5, d: 1, cab: -10, ol: [5, -4] }, t < 3.0 ? ANDA(tl, 7, 0.9) : {}));
      camera(P, lerp(900, 1000, tl / 3.4), 560, lerp(0.95, 1.02, tl / 3.4));
    } },
  /* S2 — outras pessoas tiveram a mesma ideia */
  { ate: 6.6,
    svg: (pre) => EP2.mercado(pre, { atores: outros() + B.svg('voce', { mochila: true }) }),
    quadro(tl, el, P, t) {
      posarOutros(P, t);
      const x = lerp(500, 1000, prog(t, 3.4, 5.8));
      B.posar(P.q('#voce'), pose({ x, y: 990, s: S, d: 1, cab: -4, ol: [5, -2] }, t < 5.8 ? ANDA(tl, 7, 0.8) : {}));
      camera(P, lerp(1500, 1800, tl / 3.2), 560, 0.62);
    } },
  /* S3 — a prateleira de água está vazia */
  { ate: 8.8,
    svg: (pre) => EP2.mercado(pre, {}),
    quadro(tl, el, P, t) { camera(P, 2690, lerp(520, 560, tl / 2.2), lerp(2.0, 2.15, tl / 2.2)); } },
  /* S4 — a cesta: pega e logo abandona; só o que couber nas costas */
  { ate: 14.0,
    svg: (pre) => EP2.mercado(pre, { atores: `<g class="cestaChao">${Pr.cesta()}</g>` + B.svg('voce', { mochila: true, item: Pr.cesta() }) }),
    quadro(tl, el, P, t) {
      const larga = t > 11.1;
      const vira = E.io(prog(t, 11.6, 12.2));
      B.posar(P.q('#voce'), pose({ x: 2300, y: 990, s: S, d: vira > 0.5 ? -1 : 1, cab: larga ? -2 : 14, ol: [4, larga ? -1 : 4] }, { o: [-6, larga ? 10 : 30], c: [10, larga ? 20 : 30], iR: 0, lean: vira * 6 }));
      op(P.q('#voce .b-it'), larga ? 0 : 1);
      at(P.q('.cestaChao'), 'transform', `translate(${larga ? 2390 : -999},${960}) scale(1.6)`);
      camera(P, 2320, 640, lerp(1.5, 1.65, tl / 5.2));
    } },
  /* S5 — bolachas, castanhas, latas com anel */
  { ate: 19.5,
    svg: (pre) => EP2.mercado(pre, { atores: B.svg('voce', { mochila: true }) }) +
      ['BOLACHAS', 'CASTANHAS', 'LATAS COM ANEL'].map((n, i) => `<g class="chip ch${i}"><rect x="-150" y="-34" width="300" height="68" rx="34" fill="#fff" stroke="#141414" stroke-width="4"/>${txt(0, 12, n, { f: 'Anton', t: 32, c: '#141414', a: 'middle' })}</g>`).join('') +
      [0, 1, 2].map((i) => `<g class="voa v${i}"><rect x="-18" y="-24" width="36" height="48" fill="${['#e2b13c', '#b5855a', '#c94a3a'][i]}" stroke="#141414" stroke-width="3"/></g>`).join(''),
    quadro(tl, el, P, t) {
      const ciclo = (t - 14) % 1.4 / 1.4;
      B.posar(P.q('#voce'), pose({ x: 3060, y: 990, s: S, d: 1, cab: -14 + ciclo * 10, ol: [4, -3] }, { o: [-6, lerp(160, 40, Math.sin(Math.PI * ciclo))], c: [10, 20] }));
      [16.8, 17.6, 18.4].forEach((t0, i) => { const k = E.outBack(prog(t, t0, t0 + 0.3)); const c = P.q(`.ch${i}`); op(c, k * (1 - prog(t, 19.2, 19.5))); at(c, 'transform', `translate(${2800 + i * 260},${300 + (i % 2) * 70}) scale(${0.7 + 0.3 * k}) rotate(${[-4, 3, -2][i]})`);
        const u = prog(t, t0 - 0.2, t0 + 0.4); const g = P.q(`.v${i}`); at(g, 'transform', `translate(${lerp(3000 + i * 50, 2990, u)},${lerp(430, 760, u) - Math.sin(Math.PI * u) * 80}) rotate(${u * 160})`); op(g, u > 0 && u < 1 ? 1 : 0); });
      camera(P, 3060, 560, lerp(1.25, 1.35, tl / 5.5));
    } },
  /* S6 — perto dos caixas, pilhas: duas cartelas */
  { ate: 23.6,
    svg: (pre) => EP2.mercado(pre, { atores: B.svg('voce', { mochila: true, item: Pr.pilhas() }) }),
    quadro(tl, el, P, t) {
      const pegou = [22.2, 22.7];
      op(P.q('.m-p00'), t < pegou[0] ? 1 : 0); op(P.q('.m-p01'), t < pegou[1] ? 1 : 0);
      const est = Math.max(Math.sin(Math.PI * prog(t, 21.8, 22.4)), Math.sin(Math.PI * prog(t, 22.3, 22.9)));
      B.posar(P.q('#voce'), pose({ x: 2120, y: 990, s: S, d: -1, cab: 4, ol: [3, 1] }, { o: [-6, lerp(30, 95, est)], c: [10, lerp(60, 0, est)] }));
      op(P.q('#voce .b-it'), t > 22.2 && t < 23.2 ? 1 : 0);
      camera(P, 2010, 680, lerp(2.0, 2.15, tl / 4.1));
    } },
  /* S7 — chama a irmã, bem baixo… nenhuma resposta */
  { ate: 99,
    svg: (pre) => EP2.mercado(pre, { atores: B.svg('voce', { mochila: true }) }) + `<g class="sussurro"><path d="M-80,-36 Q-90,0 -80,36 L80,36 Q90,0 80,-36 Z M-20,34 L-50,70 L10,34" fill="#ffffff" stroke="#141414" stroke-width="4" stroke-dasharray="10 8"/>${txt(0, 12, '…', { f: 'Anton', t: 44, c: '#141414', a: 'middle' })}</g>`,
    quadro(tl, el, P, t) {
      const chama = Math.sin(Math.PI * prog(t, 23.8, 26.0));
      B.posar(P.q('#voce'), pose({ x: 3640, y: 990, s: S, d: 1, cab: -4, ol: [6, -1], ab: 1.15 }, { o: [-6, lerp(20, 105, chama)], c: [10, lerp(20, 125, chama)], lean: chama * 6 }));
      const k = chama; at(P.q('.sussurro'), 'transform', `translate(3810,470) scale(${0.9 * E.out(clamp(k * 1.4))})`); op(P.q('.sussurro'), k);
      op(P.q('.m-escuro'), 0.3);
      camera(P, lerp(3700, 3960, E.io(prog(t, 26.4, 28.6))), 620, lerp(1.4, 1.2, E.io(prog(t, 26.4, 28.6))));
    } },
] });
}
