/* tras — Cena 7 "O que fica para trás" (21,8 s). Narração começa em 0,4 s.
   Planos: a comida dentro da mochila → sua irmã → solta uma alça, depois a outra → a porta dos fundos
   → duas ruas depois → quase tudo perdido → ela ainda tem a água → voltam para casa juntos. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const ANDA = (t, v = 7, a = 1) => B.andar(t * v, a);
const IRMA = (o = {}) => B.svg('irma', Object.assign({}, K.IRMA, o));
const balcao = () => `<g class="balcaoFrente"><rect x="1480" y="720" width="380" height="170" fill="#7d8b9f" stroke="#4d5866" stroke-width="5"/><rect x="1480" y="706" width="380" height="20" fill="#2b2e34"/></g>`;
const mochilaPresa = () => `<g class="mochilaPresa" transform="translate(1520,800) rotate(-12)"><path d="M-46,0 L-50,-110 Q-50,-140 0,-142 Q50,-140 50,-110 L46,0 Z" fill="#2a2c32" stroke="#141414" stroke-width="5"/><path d="M-10,-60 l18,10 l-12,12 l16,8" stroke="#0b0c0f" stroke-width="5" fill="none"/></g>`;

K.cena('tras', { planos: [
  /* S1 — a comida dentro da mochila */
  { ate: 3.0,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#3a4250"/><rect x="-200" y="-200" width="2320" height="1480" fill="#1a2747" opacity=".3"/>
      <path d="M560,1100 L540,420 Q540,300 960,290 Q1380,300 1380,420 L1360,1100 Z" fill="#2a2c32" stroke="#141414" stroke-width="12"/>
      <path d="M620,430 Q960,360 1300,430 L1290,560 Q960,520 630,560 Z" fill="#0f1014"/>
      <rect x="680" y="380" width="150" height="190" rx="8" fill="#e2b13c" stroke="#141414" stroke-width="6"/>${txt(755, 470, 'BOLACHA', { f: 'Anton', t: 28, c: '#7a3a1a', a: 'middle' })}
      <rect x="860" y="400" width="120" height="150" rx="10" fill="#c94a3a" stroke="#141414" stroke-width="6"/><rect x="1000" y="410" width="120" height="140" rx="10" fill="#d9a43a" stroke="#141414" stroke-width="6"/>
      <rect x="1140" y="370" width="130" height="190" rx="10" fill="#b5855a" stroke="#141414" stroke-width="6"/>${txt(1205, 470, 'CASTANHA', { f: 'Anton', t: 24, c: '#3a2410', a: 'middle' })}
      <path d="M620,430 Q960,360 1300,430" fill="none" stroke="#141414" stroke-width="10"/>`,
    quadro(tl, el, P, t) { camera(P, 960, 520, lerp(1.0, 1.12, tl / 3), 0, [ruido(t * 3, 1) * 3, 0]); } },
  /* S2 — depois, para sua irmã */
  { ate: 4.9,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 3450, atores: IRMA({ item: '' }) + B.svg('voce', { mochila: true }) }) + balcao(),
    quadro(tl, el, P, t) {
      B.posar(P.q('#voce'), pose({ x: 1620, y: 990, s: S, d: 1, ab: 1.2, ol: [7, 0] }, B.POSES.agachado, { cab: 4 }));
      B.posar(P.q('#irma'), pose({ x: 1790, y: 990, s: S * 0.95, d: -1, ab: 1.2, ol: [6, 0] }, B.POSES.agachado, { cab: 4 + Math.sin(Math.PI * prog(t, 3.8, 4.4)) * 10 }));
      op(P.q('.m-escuro'), 0.55); op(P.q('.m-foraSombra'), 0.45);
      camera(P, 1705, 800, lerp(2.2, 2.35, tl / 1.9));
    } },
  /* S3 — solta uma alça; depois a outra */
  { ate: 7.5,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 3450, atores: mochilaPresa() + IRMA() + B.svg('voce', { mochila: true }) + B.svg('voceS', {}) }) + balcao(),
    quadro(tl, el, P, t) {
      const solto = t > 6.8;
      const a1 = Math.sin(Math.PI * prog(t, 4.9, 5.8)), a2 = Math.sin(Math.PI * prog(t, 6.3, 7.1));
      const base = pose({ x: 1650, y: 990, s: S, d: -1, ab: 1.1, ol: [4, 1] }, B.POSES.agachado, { o: [10 + a1 * 140, 30 + a2 * 140], c: [40, 50], cab: 8 });
      B.posar(P.q('#voce'), base); B.posar(P.q('#voceS'), base);
      op(P.q('#voce'), solto ? 0 : 1); op(P.q('#voceS'), solto ? 1 : 0); op(P.q('.mochilaPresa'), solto ? 1 : 0);
      B.posar(P.q('#irma'), pose({ x: 1820, y: 990, s: S * 0.95, d: -1, ab: 1.1, ol: [5, 1] }, B.POSES.agachado, { cab: 6 }));
      op(P.q('.m-escuro'), 0.55);
      camera(P, 1680, 800, lerp(2.0, 2.15, tl / 2.6));
    } },
  /* S4 — saem pela porta dos fundos sem olhar para trás */
  { ate: 10.9,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA() + B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      const k = prog(t, 7.5, 10.4);
      const corre = ANDA(tl, 9, 1.4);
      B.posar(P.q('#irma'), pose({ x: lerp(1600, 2780, k), y: 990, s: S * 0.95, d: 1, ol: [6, 0], ab: 1.2, lean: 10 }, corre));
      B.posar(P.q('#voce'), pose({ x: lerp(1350, 2640, k), y: 990, s: S, d: 1, ol: [6, 0], ab: 1.2, lean: 10 }, ANDA(tl + 0.3, 9, 1.4)));
      op(P.q('.d-portaSaida'), E.out(prog(t, 9.4, 9.8)));
      op(P.q('#irma'), t > 10.2 ? 0 : 1); op(P.q('#voce'), t > 10.6 ? 0 : 1);
      camera(P, lerp(1700, 2500, k), 640, 0.95);
    } },
  /* S5 — só param duas ruas depois */
  { ate: 13.0,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'tarde' }) + IRMA() + B.svg('voce', {}),
    quadro(tl, el, P, t) {
      const ofega = Math.sin(t * 7) * 3;
      const k = E.out(prog(t, 10.9, 11.6));
      const para = { lean: 36 + ofega, o: [60, 70], c: [-30, -30], q: [20, 10], j: [24, 20], cab: -20 };
      B.posar(P.q('#voce'), K.mistura(pose({ x: 1000, y: 980, s: 1.7, d: 1 }, ANDA(tl, 9, 1.3)), pose({ x: 1150, y: 980, s: 1.7, d: 1, ab: 0.6, ol: [4, 2] }, para), k));
      B.posar(P.q('#irma'), K.mistura(pose({ x: 1200, y: 980, s: 1.62, d: 1 }, ANDA(tl + 0.3, 9, 1.3)), pose({ x: 1360, y: 980, s: 1.62, d: -1, ab: 0.6, ol: [4, 2] }, para), k));
      camera(P, 1250, 760, 1.3);
    } },
  /* S6 — você perdeu quase tudo que conseguiu juntar */
  { ate: 15.9,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'tarde' }) + B.svg('voce', {}),
    quadro(tl, el, P, t) {
      const olha = E.io(prog(t, 13.2, 13.8));
      const p = pose({ x: 1150, y: 980, s: 1.7, d: 1, cab: lerp(-6, 18, olha), ol: [lerp(5, -6, olha), lerp(0, 4, olha)], ab: lerp(1, 0.8, olha) }, { o: [-6, 10], c: [10, 10] });
      B.posar(P.q('#voce'), p);
      const c = B.cabecaMundo(p);
      camera(P, c[0] - 40, c[1] + 120, lerp(2.4, 2.6, tl / 2.9));
    } },
  /* S7 — mas sua irmã ainda está com a água */
  { ate: 18.0,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'tarde' }) + IRMA({ itemT: `<g transform="translate(-30,-70) rotate(-10)">${Pr.garrafa()}</g>` }) + B.svg('voce', {}),
    quadro(tl, el, P, t) {
      const bate = Math.abs(Math.sin(Math.PI * 2 * prog(t, 16.0, 17.2)));
      B.posar(P.q('#irma'), pose({ x: 1360, y: 980, s: 1.62, d: -1, cab: 6, ol: [5, 1], lean: 6 }, { o: [lerp(-6, -40, bate), 10], c: [lerp(10, 120, bate), 20] }));
      B.posar(P.q('#voce'), pose({ x: 1150, y: 980, s: 1.7, d: 1, cab: 4, ol: [6, 0] }));
      camera(P, 1260, 760, lerp(1.6, 1.7, tl / 2.1));
    } },
  /* S8 — dessa vez, vocês voltam para casa juntos */
  { ate: 99,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'tarde' }) + IRMA() + B.svg('voce', {}),
    quadro(tl, el, P, t) {
      const x = lerp(600, 1700, prog(t, 18.0, 21.8));
      B.posar(P.q('#voce'), pose({ x, y: 980, s: 1.0, d: 1, ol: [5, 0] }, ANDA(tl, 6.5, 0.8)));
      B.posar(P.q('#irma'), pose({ x: x + 110, y: 980, s: 0.95, d: 1, ol: [5, 0] }, ANDA(tl + 0.5, 6.5, 0.8)));
      camera(P, lerp(1050, 1250, prog(tl, 0, 3.8)), 560, 0.85);
    } },
] });
}
