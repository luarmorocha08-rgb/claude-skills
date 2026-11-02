/* deposito — Cena 5 "O depósito" (29,6 s). Narração começa em 0,4 s.
   Planos: a porta bloqueada por caixas → chama de novo → escuta seu nome → ela aparece com a barra de ferro e larga
   → o abraço → onde ela passou a noite → a água que ninguém levou → dividir o peso → o próximo passo. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const ANDA = (t, v = 7, a = 1) => B.andar(t * v, a);
const IRMA = (item) => B.svg('irma', Object.assign({}, K.IRMA, { item: item || '' }));
const lant = (P, x, y, k = 0.8) => { const l = P.q('.d-lanterna'); at(l, 'cx', x); at(l, 'cy', y); op(l, k); };

K.cena('deposito', { planos: [
  /* S1 — a porta do depósito bloqueada por caixas */
  { ate: 4.6,
    svg: (pre) => EP2.mercado(pre, { atores: B.svg('voce', { mochila: true }) }),
    quadro(tl, el, P, t) {
      op(P.q('.m-escuro'), 0.3);
      [5, 3, 4].forEach((i, n) => { const t0 = 1.6 + n * 0.9; const u = E.io(prog(t, t0, t0 + 0.6)); at(P.q(`.m-cx${i}`), 'transform', `translate(${-u * 420 - n * 30},${u * (i === 5 ? 220 : 110)})`); });
      const emp = Math.sin(Math.PI * ((t - 1.6) % 0.9 / 0.9)) * (t > 1.6 && t < 4.3 ? 1 : 0);
      B.posar(P.q('#voce'), pose({ x: lerp(3500, 3800, prog(t, 0, 1.4)), y: 990, s: S, d: 1, cab: -6, ol: [5, -2], lean: emp * 10 }, t < 1.4 ? ANDA(tl, 7, 0.8) : {}, { o: [-6, 70 + emp * 30], c: [10, 20] }));
      camera(P, 3950, 620, lerp(1.25, 1.35, tl / 4.6));
    } },
  /* S2 — chama de novo */
  { ate: 6.3,
    svg: (pre) => EP2.deposito(pre, { atores: B.svg('voce', { mochila: true, item: Pr.lanterna() }) }) + `<g class="sussurro"><path d="M-80,-36 Q-90,0 -80,36 L80,36 Q90,0 80,-36 Z M-20,34 L-50,70 L10,34" fill="#ffffff" stroke="#141414" stroke-width="4" stroke-dasharray="10 8"/>${txt(0, 12, '…', { f: 'Anton', t: 44, c: '#141414', a: 'middle' })}</g>`,
    quadro(tl, el, P, t) {
      const chama = Math.sin(Math.PI * prog(t, 4.7, 6.0));
      const p = pose({ x: 700, y: 990, s: S, d: 1, cab: -4, ol: [6, -1], iR: -80 }, { o: [lerp(-6, 105, chama), 40], c: [lerp(10, 125, chama), 50] });
      B.posar(P.q('#voce'), p);
      at(P.q('.sussurro'), 'transform', `translate(880,470) scale(${0.9 * E.out(clamp(chama * 1.4))})`); op(P.q('.sussurro'), chama);
      const m = B.maoFrente(p); lant(P, m[0] + 380, m[1] - 40);
      camera(P, 1000, 640, lerp(1.2, 1.3, tl / 1.7));
    } },
  /* S3 — dessa vez, escuta seu nome */
  { ate: 8.6,
    svg: (pre) => EP2.deposito(pre, { atores: B.svg('voce', { mochila: true, item: Pr.lanterna() }) }) + `<g class="ondas" fill="none" stroke="#ffe7b0" stroke-width="7" stroke-linecap="round">${[0, 1, 2].map((i) => `<path class="on on${i}" d="M0,-40 q-30,40 0,80"/>`).join('')}</g>`,
    quadro(tl, el, P, t) {
      const vira = E.out(prog(t, 6.4, 6.8));
      const p = pose({ x: 900, y: 990, s: S, d: 1, cab: lerp(-4, 4, vira), ol: [lerp(4, 7, vira), 0], ab: lerp(1, 1.3, vira), iR: -80 }, { o: [-6, 40], c: [10, 50] });
      B.posar(P.q('#voce'), p);
      P.qa('.on').forEach((o, i) => { const u = ((t - 6.3) * 1.3 + i * 0.33) % 1; at(o, 'transform', `translate(${2050 - u * 160},640) scale(${0.6 + u})`); op(o, t > 6.3 ? (1 - u) * 0.9 : 0); });
      const m = B.maoFrente(p); lant(P, m[0] + 380, m[1] - 40);
      camera(P, 1400, 620, lerp(0.85, 0.9, tl / 2.3));
    } },
  /* S4 — ela aparece com a barra de ferro; reconhece; larga */
  { ate: 13.9,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA(Pr.barra()) + B.svg('voce', { mochila: true, item: Pr.lanterna() }) }) + `<g class="barraChao">${Pr.barra()}</g>`,
    quadro(tl, el, P, t) {
      const sai = E.out(prog(t, 8.6, 9.6));
      const rec = E.io(prog(t, 10.9, 11.4));
      const larga = t > 11.4;
      B.posar(P.q('#irma'), pose({ x: lerp(2200, 1880, sai), y: 990, s: S * 0.95, d: -1, cab: lerp(-4, 6, rec), ol: [4, -1], ab: lerp(1.3, 1, rec), boca: rec * 0.5 }, sai < 1 ? ANDA(tl, 6, 0.6) : {},
        { o: [-6, larga ? 10 : lerp(150, 110, rec)], c: [10, larga ? 20 : -20], iR: 0, lean: larga ? -4 : 4 }));
      op(P.q('#irma .b-it'), larga ? 0 : 1);
      const u = prog(t, 11.4, 11.8); at(P.q('.barraChao'), 'transform', `translate(1830,${lerp(860, 975, u * u)}) rotate(${lerp(0, 88, u)})`); op(P.q('.barraChao'), larga ? 1 : 0);
      const p = pose({ x: 1200, y: 990, s: S, d: 1, cab: 4, ol: [7, 0], ab: lerp(1.3, 1.1, rec), iR: -80 }, { o: [-6, 40], c: [10, 50] });
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p); lant(P, m[0] + 380, m[1] - 40);
      camera(P, 1560, 640, lerp(1.15, 1.3, tl / 5.3), 0, tremor(t, 11.8, 4, 20, 10));
    } },
  /* S5 — o abraço */
  { ate: 17.0,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA() + B.svg('voce', { mochila: true }) }),
    quadro(tl, el, P, t) {
      const junta = E.out(prog(t, 13.9, 14.5));
      const quase = Math.sin(Math.PI * prog(t, 15.2, 16.2));
      const bal = Math.sin(t * 3) * 3;
      B.posar(P.q('#voce'), pose({ x: lerp(1400, 1690, junta), y: 990, s: S, d: 1, cab: 10, ab: 0.1, lean: 8 + quase * 14 + bal, ol: [3, 2] }, { o: [-6, lerp(20, 85, junta)], c: [10, 70] }));
      B.posar(P.q('#irma'), pose({ x: lerp(2000, 1800, junta), y: 990, s: S * 0.95, d: -1, cab: 12, ab: 0.1, lean: 8 - quase * 8 - bal, ol: [3, 2] }, { o: [-6, lerp(20, 80, junta)], c: [10, 75] }));
      lant(P, 1750, 700, 0.6);
      camera(P, 1745, 660, lerp(1.7, 1.85, tl / 3.1));
    } },
  /* S6 — ela mostra onde passou a noite */
  { ate: 19.0,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA() + B.svg('voce', { mochila: true }) }),
    quadro(tl, el, P, t) {
      B.posar(P.q('#irma'), pose({ x: 2120, y: 990, s: S * 0.95, d: 1, cab: 14, ol: [4, 4] }, { o: [-6, lerp(20, 80, prog(t, 17.1, 17.5))], c: [10, 0] }));
      B.posar(P.q('#voce'), pose({ x: 1900, y: 990, s: S, d: 1, cab: 14, ol: [5, 4] }, { o: [-6, 10], c: [10, 20] }));
      lant(P, 2300, 900, 0.5);
      camera(P, 2260, 720, lerp(1.3, 1.4, tl / 2));
    } },
  /* S7 — algumas garrafas de água que ninguém levou */
  { ate: 22.4,
    svg: (pre) => EP2.deposito(pre, {}),
    quadro(tl, el, P, t) { lant(P, 1900, 900, 0.75); camera(P, 1900, 900, lerp(3.0, 3.3, tl / 3.4)); } },
  /* S8 — vocês dividem o peso entre as mochilas */
  { ate: 24.5,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA(Pr.garrafa()) + B.svg('voce', { mochila: true, item: Pr.garrafa() }) }),
    quadro(tl, el, P, t) {
      const c = Math.sin(t * 5);
      B.posar(P.q('#voce'), pose({ x: 1760, y: 990, s: S, d: 1, ol: [4, 4] }, B.POSES.agachado, { o: [10, 60 + c * 30], c: [40, 30], cab: 10 }));
      B.posar(P.q('#irma'), pose({ x: 2060, y: 990, s: S * 0.95, d: -1, ol: [4, 4] }, B.POSES.agachado, { o: [10, 60 - c * 30], c: [40, 30], cab: 10 }));
      op(P.q('.d-agua'), t < 23.6 ? 1 : 0.0);
      lant(P, 1900, 860, 0.7);
      camera(P, 1910, 760, 1.5);
    } },
  /* S9 — pela primeira vez desde ontem, o próximo passo */
  { ate: 99,
    svg: (pre) => EP2.deposito(pre, { atores: IRMA() + B.svg('voce', { mochila: true, item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.d-agua'), 0);
      const p = pose({ x: 1650, y: 990, s: S, d: 1, cab: -2, ol: [6, -1], iR: -60 }, { o: [-6, 40], c: [10, 40] });
      B.posar(P.q('#voce'), p);
      B.posar(P.q('#irma'), pose({ x: 1880, y: 990, s: S * 0.95, d: -1, cab: -2, ol: [5, -1], ab: Math.sin(tl * 1.3) > 0.98 ? 0.1 : 1 }));
      const m = B.maoFrente(p); lant(P, m[0] + 250, m[1] + 20, 0.8);
      op(P.q('.d-escuro'), 0.5);
      camera(P, lerp(1760, 1770, tl), 640, lerp(1.25, 1.55, E.sine(prog(tl, 0, 5.1))));
    } },
] });
}
