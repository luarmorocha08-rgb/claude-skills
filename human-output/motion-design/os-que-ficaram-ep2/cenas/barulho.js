/* barulho — Cena 6 "O preço do barulho" (25,8 s). Narração começa em 0,4 s.
   Planos: a discussão pelo carrinho → o carrinho derruba a prateleira → você congela → lá fora, algo responde
   → para trás do balcão → a luz azul atravessa a vitrine → a mochila prende → o tecido começa a rasgar. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const ANDA = (t, v = 7, a = 1) => B.andar(t * v, a);
const proj = RUA.proj;
const IRMA = () => B.svg('irma', Object.assign({}, K.IRMA, { mochila: true }));
const brigoes = () => B.svg('b1', { roupa: '#c0392b', roupaEsc: '#00000044' }) + B.svg('b2', { roupa: '#8e5ea2', roupaEsc: '#00000044' });
const estante = () => `<g class="estante"><rect x="-90" y="-300" width="180" height="300" fill="#b9bec6" stroke="#6b7179" stroke-width="5"/>${[0, 1, 2].map((n) => `<rect x="-90" y="${-230 + n * 80}" width="180" height="8" fill="#6b7179"/>${[0, 1, 2, 3].map((k) => `<rect x="${-80 + k * 42}" y="${-266 + n * 80}" width="34" height="36" fill="${['#c94a3a', '#d9a43a', '#5f8f4a', '#3498db'][(k + n) % 4]}" stroke="#141414" stroke-width="2"/>`).join('')}`).join('')}</g>`;
const latas = () => Array.from({ length: 10 }, (_, i) => `<rect class="lata lt${i}" x="-17" y="-18" width="34" height="36" rx="4" fill="${['#c94a3a', '#d9a43a', '#5f8f4a', '#3498db'][i % 4]}" stroke="#141414" stroke-width="2"/>`).join('');
const raiva = (cls) => `<g class="${cls}" fill="none" stroke="#e5484d" stroke-width="5" stroke-linecap="round"><path d="M-14,-14 L-4,-4 M14,-14 L4,-4 M-14,14 L-4,4 M14,14 L4,4"/></g>`;

K.cena('barulho', { planos: [
  /* S1 — uma discussão perto dos caixas */
  { ate: 4.3,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 1450, atores: brigoes() + IRMA() + B.svg('voce', { mochila: true }) }) + raiva('r1') + raiva('r2'),
    quadro(tl, el, P, t) {
      const puxa = Math.sin(t * 5) * 40;
      at(P.q('.m-carrinho'), 'transform', `translate(${1450 + puxa},990)`);
      B.posar(P.q('#b1'), pose({ x: 1280 + puxa, y: 990, s: S, d: 1, lean: -10 + puxa * 0.1, cab: 6, ol: [6, 0] }, { o: [-6, 80], c: [10, 10] }));
      B.posar(P.q('#b2'), pose({ x: 1680 + puxa, y: 990, s: S, d: -1, lean: -10 - puxa * 0.1, cab: 6, ol: [6, 0] }, { o: [-6, 80], c: [10, 10] }));
      at(P.q('.r1'), 'transform', `translate(1310,520) scale(${1 + 0.2 * Math.sin(t * 9)})`); at(P.q('.r2'), 'transform', `translate(1650,500) scale(${1 + 0.2 * Math.sin(t * 9 + 1)})`);
      const x = lerp(3000, 2500, prog(t, 0, 3.5));
      B.posar(P.q('#voce'), pose({ x, y: 990, s: S, d: -1, cab: -2, ol: [5, -1] }, t < 3.5 ? ANDA(tl, 6, 0.7) : {}));
      B.posar(P.q('#irma'), pose({ x: x + 220, y: 990, s: S * 0.95, d: -1, cab: -2, ol: [5, -1] }, t < 3.5 ? ANDA(tl + 0.4, 6, 0.7) : {}));
      op(P.q('.m-escuro'), 0.2);
      camera(P, lerp(2200, 2000, tl / 4.3), 600, 0.75);
    } },
  /* S2 — o carrinho bate numa prateleira */
  { ate: 6.4,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 1450, atores: brigoes() + estante() + latas() }),
    quadro(tl, el, P, t) {
      const voa = E.in(prog(t, 4.4, 4.95));
      const bate = 4.95;
      at(P.q('.m-carrinho'), 'transform', `translate(${lerp(1450, 1820, voa)},990) rotate(${t > bate ? 6 : 0})`);
      const cai = E.in(prog(t, bate, bate + 0.45));
      at(P.q('.estante'), 'transform', `translate(2000,990) rotate(${cai * 82} 90 0)`);
      P.qa('.lata').forEach((l, i) => { const u = Math.max(0, t - bate - 0.2); const x = 2050 + i * 40 + u * (200 + i * 60); const y = Math.min(975, 800 - (i % 3) * 40 - u * 300 + u * u * 1600);
        at(l, 'transform', `translate(${x},${y}) rotate(${u * (300 + i * 80)})`); op(l, t > bate + 0.2 ? 1 : 0); });
      B.posar(P.q('#b1'), pose({ x: 1300, y: 990, s: S, d: 1, cab: 0, ol: [6, 0], ab: t > bate ? 1.3 : 1 }, { o: [-6, t > 4.4 ? 110 : 80], c: [10, 0], lean: t > 4.4 ? 12 : -10 }));
      B.posar(P.q('#b2'), pose({ x: 1700, y: 990, s: S, d: -1, cab: 0, ol: [6, 0], ab: t > bate ? 1.3 : 1 }, { o: [-6, 40], c: [10, 20], lean: -16 }));
      op(P.q('.m-escuro'), 0.2);
      camera(P, 1750, 640, 1.05, 0, tremor(t, bate + 0.45, 18, 14, 6));
    } },
  /* S3 — o estrondo faz você congelar */
  { ate: 8.6,
    svg: (pre) => EP2.mercado(pre, { atores: IRMA() + B.svg('voce', { mochila: true }) }),
    quadro(tl, el, P, t) {
      const p = pose({ x: 2500, y: 990, s: S, d: -1, cab: -2, ol: [7, -1], ab: 1.4, medo: 0.6 });
      B.posar(P.q('#voce'), p);
      B.posar(P.q('#irma'), pose({ x: 2700, y: 990, s: S * 0.95, d: -1, cab: -2, ol: [6, -1], ab: 1.4 }));
      op(P.q('.m-escuro'), 0.25);
      const c = B.cabecaMundo(p);
      camera(P, c[0] + 60, c[1] + 40, lerp(2.6, 2.8, tl / 2.2));
    } },
  /* S4 — lá fora, alguma coisa responde: metal raspando no asfalto */
  { ate: 14.0,
    svg: (pre) => `${RUA.svg(pre, { luz: 'dia' })}<rect x="-400" y="-400" width="2720" height="1880" fill="#56607a" opacity=".35" style="mix-blend-mode:multiply"/><g class="rastG">${RAST.svg(pre)}</g>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 8.6, 14.0);
      const Z = lerp(40, 16, k), X = lerp(2, -1.4, k);
      const [bx, by] = proj(X, 0, Z); RAST.posar(P.q('.rastG'), bx, by, 16.4 / Z, (t - 8.6) * 4, 330, 1);
      camera(P, 960, 540, lerp(1.05, 1.15, k), 0, [ruido(t * 4, 1) * 2, 0]);
    } },
  /* S5 — você puxa sua irmã para trás do balcão */
  { ate: 16.4,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 3450, atores: IRMA() + B.svg('voce', { mochila: true }) }) + `<g class="balcaoFrente"><rect x="1480" y="720" width="380" height="170" fill="#7d8b9f" stroke="#4d5866" stroke-width="5"/><rect x="1480" y="706" width="380" height="20" fill="#2b2e34"/></g>`,
    quadro(tl, el, P, t) {
      const k = E.io(prog(t, 14.0, 15.4));
      const ag = E.io(prog(t, 15.2, 15.9));
      const corre = k > 0 && k < 1 ? ANDA(tl, 9, 1.3) : {};
      B.posar(P.q('#voce'), K.mistura(pose({ x: lerp(2500, 1620, k), y: 990, s: S, d: -1, ab: 1.3 }, corre, { o: [-6, 60], c: [10, 0] }), pose({ x: 1620, y: 990, s: S, d: -1, ab: 1.3, medo: 0.6 }, B.POSES.agachado), ag));
      B.posar(P.q('#irma'), K.mistura(pose({ x: lerp(2700, 1760, k), y: 990, s: S * 0.95, d: -1, ab: 1.3 }, corre), pose({ x: 1760, y: 990, s: S * 0.95, d: -1, ab: 1.3 }, B.POSES.agachado), ag));
      op(P.q('.m-escuro'), 0.3);
      camera(P, lerp(2200, 1700, k), 680, lerp(1.0, 1.35, k));
    } },
  /* S6 — uma luz azul atravessa a vitrine e percorre o corredor */
  { ate: 19.8,
    svg: (pre) => EP2.mercado(pre, { carrinhoX: 3450, atores: IRMA() + B.svg('voce', { mochila: true }) }) +
      `<clipPath id="${pre}-vit2"><rect x="20" y="170" width="860" height="700"/></clipPath><g clip-path="url(#${pre}-vit2)"><g class="rastV">${RAST.svg(pre)}</g></g>
       <g class="balcaoFrente"><rect x="1480" y="720" width="380" height="170" fill="#7d8b9f" stroke="#4d5866" stroke-width="5"/><rect x="1480" y="706" width="380" height="20" fill="#2b2e34"/></g>`,
    quadro(tl, el, P, t) {
      B.posar(P.q('#voce'), pose({ x: 1620, y: 990, s: S, d: -1, ab: 1.4, medo: 0.8, ol: [6, -2] }, B.POSES.agachado));
      B.posar(P.q('#irma'), pose({ x: 1760, y: 990, s: S * 0.95, d: -1, ab: 1.4, ol: [6, -2] }, B.POSES.agachado));
      RAST.posar(P.q('.rastV'), lerp(300, 650, prog(t, 16.4, 19.8)), 900, 0.75, (t - 16) * 3, 330, 1);
      op(P.q('.m-foraSombra'), 0.45); op(P.q('.m-escuro'), 0.55);
      const v = prog(t, 16.6, 19.6); const fx = lerp(600, 3600, E.sine(v));
      at(P.q('.m-varre'), 'points', `450,560 520,540 ${fx + 300},990 ${fx - 300},990`); op(P.q('.m-varre'), 0.8);
      camera(P, 1700, 600, lerp(0.7, 0.74, prog(tl, 0, 3.4)));
    } },
  /* S7 — a mochila prende numa ponta de metal; você tenta soltar */
  { ate: 23.4,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#4d5866"/><rect x="-200" y="-200" width="1100" height="1480" fill="#7d8b9f"/>
      <polygon points="900,-200 1020,-200 1020,1280 900,1280" fill="#5e6670"/><polygon class="ponta" points="900,520 1080,560 900,600" fill="#b8bec7" stroke="#141414" stroke-width="6"/>
      <g class="tecido"><path class="pano" fill="#3a4250" stroke="#141414" stroke-width="8"/><path class="ziper" fill="none" stroke="#1d222b" stroke-width="10" stroke-dasharray="6 6"/><path class="alca" fill="none" stroke="#1d222b" stroke-width="44" stroke-linecap="round"/>
        <path class="braco" fill="none" stroke="#141414" stroke-width="64" stroke-linecap="round"/><path class="manga" fill="none" stroke="#2f6fd6" stroke-width="42" stroke-linecap="round"/><circle class="mao" r="40" fill="#141414"/></g>
      <rect x="-200" y="-200" width="2320" height="1480" fill="#1a2747" opacity=".35" style="mix-blend-mode:multiply"/>`,
    quadro(tl, el, P, t) {
      const puxa = Math.max(0, Math.sin((t - 21.9) * 6)) * prog(t, 21.9, 22.1);
      const dx = puxa * 60;
      at(P.q('.pano'), 'd', `M${1020 + dx},300 Q${1500 + dx},280 ${2000 + dx},320 L${2000 + dx},900 Q${1500 + dx},920 ${1020 + dx},880 Q${980 + dx * 0.4},580 ${1020 + dx},300 Z`);
      at(P.q('.alca'), 'd', `M${1060 + dx * 0.3},560 Q${1300 + dx},${600 - puxa * 30} ${1700 + dx},620`);
      at(P.q('.ziper'), 'd', `M${1120 + dx},380 Q${1500 + dx},360 ${1900 + dx},400`);
      at(P.q('.braco'), 'd', `M2200,1200 L${1720 + dx},640`); at(P.q('.manga'), 'd', `M2200,1200 L${1770 + dx},700`); at(P.q('.mao'), 'cx', 1700 + dx); at(P.q('.mao'), 'cy', 625);
      camera(P, 1200, 580, lerp(1.0, 1.08, tl / 3.6), 0, [puxa * 4, 0]);
    } },
  /* S8 — o tecido começa a rasgar */
  { ate: 99,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#3a4250"/>${Array.from({ length: 30 }, (_, i) => `<line x1="-200" y1="${i * 50 - 200}" x2="2120" y2="${i * 50 - 160}" stroke="#333a47" stroke-width="5"/>`).join('')}
      <path class="rasgo" fill="#08090b" stroke="#8a93a3" stroke-width="7"/>${Array.from({ length: 8 }, (_, i) => `<line class="fio fi${i}" stroke="#aab4c4" stroke-width="4"/>`).join('')}`,
    quadro(tl, el, P, t) {
      const k = E.in(prog(t, 23.5, 25.6));
      const len = 40 + k * 900; const x0 = 960 - len / 2;
      const sup = [[x0, 540]], inf = [];
      for (let i = 1; i <= 12; i++) { const x = x0 + (len * i) / 12; const a = Math.sin(i * 1.7) * 22 * (0.3 + k); const env = Math.sin(Math.PI * i / 12);
        sup.push([x, 540 - Math.abs(a) - k * 90 * env]); inf.push([x, 540 + Math.abs(a) * 0.6 + k * 80 * env]); }
      const pts = sup.concat(inf.reverse());
      at(P.q('.rasgo'), 'd', 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') + ' Z');
      P.qa('.fio').forEach((f, i) => { const x = x0 + len * (i + 0.5) / 8; at(f, 'x1', x); at(f, 'y1', 540 - 70 * k * Math.sin(Math.PI * (i + 0.5) / 8)); at(f, 'x2', x + 10); at(f, 'y2', 540 + 60 * k * Math.sin(Math.PI * (i + 0.5) / 8)); op(f, k > 0.1 ? 1 : 0); });
      camera(P, 960, 540, lerp(1.0, 1.15, prog(tl, 0, 2.4)), 0, [ruido(t * 30, 2) * 2 * k, 0]);
    } },
] });
}
