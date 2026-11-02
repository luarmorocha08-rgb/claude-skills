/* noite — Cena 8 "Mais uma noite" (41,9 s). Narração começa em 0,4 s.
   Planos: as cortinas fechadas → contar o que sobrou → o rádio → as pilhas → girando o botão, uma voz atravessa o chiado
   → abrigo na escola municipal → o mapa: do outro lado da cidade, a avenida da máquina → as garrafas → ficar também é risco
   → EPISÓDIO 3 — DO OUTRO LADO. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const IRMA = (o = {}) => B.svg('irma', Object.assign({}, K.IRMA, o));
const SENTADO = { q: [84, 88], j: [86, 90], chao: 0, alt: 40, o: [10, 30], c: [40, 50] };
const noite = (P, k = 0.82) => { op(P.q('.int-noite'), k); op(P.q('.int-canecaMesa'), 0); op(P.q('.int-celMesa'), 0); op(P.q('.int-fruteira'), 0); op(P.q('.vista-nave'), 0); };
const lant = (P, x, y, k = 0.8) => { const l = P.q('.int-lanterna'); at(l, 'cx', x); at(l, 'cy', y); op(l, k); };
const mesaNoite = (P) => { op(P.q('.int-suprimentos'), 1); op(P.q('.int-g2'), 0); op(P.q('.int-powerbank'), 0); op(P.q('.int-lantMesa'), 1); };
const LCD = [[17.9, 'ABRIGO'], [18.6, 'ESCOLA MUNICIPAL'], [20.6, 'ÁGUA POTÁVEL'], [21.7, 'COMIDA'], [22.5, 'PORTÕES: AMANHECER'], [24.6, 'REPETINDO ENDEREÇO…']];

K.cena('noite', { planos: [
  /* S1 — em casa, as cortinas se fecham */
  { ate: 3.0,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: IRMA() }),
    quadro(tl, el, P, t) {
      INT.ceuSala(P, 0, 0.3, 0.7); op(P.q('.int-noite'), 0.55); op(P.q('.int-mochilaPorta'), 1);
      const f = E.io(prog(t, 0.6, 2.4));
      at(P.q('.int-cortE'), 'transform', `translate(1950,0) scale(${lerp(1, 1.05, f)},1) translate(-1950,0)`);
      at(P.q('.int-cortD'), 'transform', `translate(2410,0) scale(${lerp(1, 1.05, f)},1) translate(-2410,0)`);
      B.posar(P.q('#irma'), pose({ x: 2180, y: 990, s: S * 0.95, d: -1, cab: -10, ol: [4, -4] }, { o: [-6, lerp(120, 160, f)], c: [10, -10] }));
      camera(P, 2180, 560, lerp(1.35, 1.45, tl / 3));
    } },
  /* S2 — água, algumas latas, um pacote de bolacha amassado */
  { ate: 9.4,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#4a2e1a"/>
      ${Array.from({ length: 22 }, (_, i) => `<path d="M-200,${i * 70 - 100} C400,${i * 70 - 60} 1200,${i * 70 - 140} 2200,${i * 70 - 90}" stroke="#3d2414" stroke-width="${3 + (i % 3) * 2}" fill="none" opacity=".6"/>`).join('')}
      <ellipse cx="960" cy="540" rx="900" ry="600" fill="url(#${pre}-glowQ)" opacity=".55"/>
      ${[0, 1, 2].map((i) => `<g class="it a${i}"><rect x="-55" y="-190" width="110" height="380" rx="44" fill="#cfe7f7" stroke="#6f93ad" stroke-width="8"/><rect x="-55" y="-30" width="110" height="80" fill="#4a90d9" opacity=".6"/><circle cy="-200" r="34" fill="#3f78c8" stroke="#141414" stroke-width="6"/></g>`).join('')}
      ${[0, 1].map((i) => `<g class="it l${i}"><circle r="90" fill="${['#c94a3a', '#d9a43a'][i]}" stroke="#141414" stroke-width="8"/><circle r="64" fill="none" stroke="#141414" stroke-width="4"/><circle cx="30" cy="-30" r="12" fill="none" stroke="#141414" stroke-width="5"/></g>`).join('')}
      <g class="it bol"><path d="M-170,-80 L150,-100 L175,60 L-150,95 Z" fill="#e2b13c" stroke="#141414" stroke-width="8"/><path d="M-120,-40 L-60,10 L-100,40 M20,-60 L60,0 L10,40" stroke="#a8832a" stroke-width="5" fill="none"/>${txt(0, -20, 'BOLACHA', { f: 'Anton', t: 34, c: '#7a3a1a', a: 'middle' })}</g>`,
    quadro(tl, el, P, t) {
      const it = [['.a0', 3.2, 420, 520, -8], ['.a1', 3.4, 580, 560, 5], ['.a2', 3.6, 740, 520, -3], ['.l0', 4.0, 1060, 380, 0], ['.l1', 4.3, 1280, 440, 0], ['.bol', 5.3, 1240, 760, -6]];
      it.forEach(([s, t0, x, y, r]) => { const k = E.outBack(prog(t, t0, t0 + 0.3)); at(P.q(s), 'transform', `translate(${x},${y - (1 - k) * 60}) rotate(${r}) scale(${(s.startsWith('.l') ? 1 : 0.85) * (0.8 + 0.2 * k)})`); op(P.q(s), prog(t, t0, t0 + 0.12)); });
      camera(P, 960, 560, lerp(1.0, 1.1, tl / 6.4));
    } },
  /* S3 — sua irmã tira um rádio da mochila */
  { ate: 12.0,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'noite' }), atores: B.svg('voce', {}) + IRMA({ item: Pr.radio() }) }),
    quadro(tl, el, P, t) {
      noite(P); mesaNoite(P);
      const tira = E.out(prog(t, 9.8, 10.6));
      B.posar(P.q('#irma'), pose({ x: 1560, y: 990, s: S * 0.95, d: -1, cab: 10, ol: [4, 3] }, { o: [-6, lerp(-10, 70, tira)], c: [10, lerp(10, 40, tira)], iR: 0 }));
      B.posar(P.q('#voce'), pose({ x: 1120, y: 990, s: S, d: 1, cab: 6, ol: [5, 1] }, SENTADO));
      lant(P, 1380, 650, 0.85);
      camera(P, 1340, 640, lerp(1.55, 1.65, tl / 2.6));
    } },
  /* S4 — você ainda tem as pilhas no bolso */
  { ate: 13.7,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#4a2e1a"/><ellipse cx="960" cy="540" rx="900" ry="600" fill="url(#${pre}-glowQ)" opacity=".5"/>
      <g transform="translate(1250,620) scale(5)">${Pr.radio()}</g>
      <g class="mao"><path d="M-300,700 L0,0" stroke="#141414" stroke-width="70" stroke-linecap="round"/><path d="M-300,700 L-40,90" stroke="#2f6fd6" stroke-width="44" stroke-linecap="round"/><circle r="60" fill="#141414"/>
      <g transform="translate(70,-70) scale(4)">${Pr.pilhas()}</g><g transform="translate(140,-40) scale(4) rotate(12)">${Pr.pilhas()}</g></g>`,
    quadro(tl, el, P, t) {
      const k = E.out(prog(t, 12.0, 12.6));
      at(P.q('.mao'), 'transform', `translate(${lerp(400, 700, k)},${lerp(1000, 640, k)})`);
      camera(P, 960, 560, lerp(1.0, 1.06, tl / 1.7));
    } },
  /* S5 — girando o botão; uma voz atravessa o chiado: abrigo na escola municipal */
  { ate: 26.6,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#3d2414"/><ellipse cx="960" cy="540" rx="900" ry="600" fill="url(#${pre}-glowQ)" opacity=".45"/>
      <g transform="translate(960,600)">${EP2.radio(pre)}</g>`,
    quadro(tl, el, P, t) {
      const gira = t < 17.6 ? (t - 13.7) * 70 + Math.sin(t * 3) * 30 : 273 + Math.sin(t * 0.7) * 2;
      at(P.q('.r-botao'), 'transform', `translate(330,120) rotate(${gira})`);
      at(P.q('.r-agulha'), 'x', 60 + ((gira % 360) / 360) * 360);
      const sinal = t > 17.6 ? 1 : 0;
      op(P.q('.r-onda'), sinal * (0.5 + 0.5 * Math.sin(t * 9)));
      at(P.q('.r-onda'), 'transform', `translate(-40,0)`);
      let txtA = t < 17.6 ? (Math.floor(t * 12) % 2 ? '— — —' : '· · · ·') : '';
      LCD.forEach(([t0, s]) => { if (t >= t0) txtA = s; });
      const tx = P.q('.r-txt'); tx.textContent = txtA; at(tx, 'font-size', txtA.length > 14 ? 30 : 40);
      op(P.q('.r-lcd'), 0.75 + 0.2 * (sinal ? 1 : rand(Math.floor(t * 15))));
      camera(P, lerp(1000, 1160, E.io(prog(t, 17.4, 18.4))), lerp(560, 470, E.io(prog(t, 17.4, 18.4))), lerp(1.0, 1.7, E.io(prog(t, 17.4, 18.4))), 0, t < 17.6 ? [ruido(t * 10, 3) * 2, 0] : [0, 0]);
    } },
  /* S6 — você conhece aquela escola: fica do outro lado da cidade */
  { ate: 31.0,
    svg: (pre) => EP2.mapa(pre) + `<g class="caneta"><rect x="-10" y="-160" width="20" height="150" rx="6" fill="#d6262f" stroke="#141414" stroke-width="4"/><polygon points="-10,-10 10,-10 0,10" fill="#141414"/></g>`,
    quadro(tl, el, P, t) {
      const k = E.io(prog(t, 27.0, 29.8));
      at(P.q('.rota'), 'stroke-dashoffset', 1400 * (1 - k));
      const r = P.q('.rota'); let pt = [450, 790];
      try { const L = r.getTotalLength(); const p = r.getPointAtLength(L * k); pt = [p.x, p.y]; } catch (e) {}
      at(P.q('.caneta'), 'transform', `rotate(-3 960 540) translate(${pt[0]},${pt[1]}) rotate(25)`); op(P.q('.caneta'), t < 30.2 ? 1 : 0);
      const pg = P.q('.perigo'); op(pg, E.out(prog(t, 29.4, 29.8))); at(pg, 'transform', `translate(1040,600) scale(${1 + 0.15 * Math.sin(t * 6)})`);
      camera(P, lerp(900, 1040, E.io(prog(t, 29.4, 30.4))), lerp(560, 580, E.io(prog(t, 29.4, 30.4))), lerp(1.0, 1.5, E.io(prog(t, 29.4, 30.4))));
    } },
  /* S7 — você olha para as garrafas sobre a mesa */
  { ate: 33.2,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'noite' }), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      noite(P); mesaNoite(P);
      B.posar(P.q('#voce'), pose({ x: 1120, y: 990, s: S, d: 1, cab: 18, ol: [5, 5] }, SENTADO));
      lant(P, 1300, 650, 0.85);
      camera(P, lerp(1230, 1210, tl / 2.2), 640, lerp(2.2, 2.4, tl / 2.2));
    } },
  /* S8 — dessa vez, ficar em casa também é um risco */
  { ate: 37.4,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'noite' }), atores: B.svg('voce', {}) + IRMA({ mochila: false }) }),
    quadro(tl, el, P, t) {
      noite(P, 0.88); mesaNoite(P);
      B.posar(P.q('#voce'), pose({ x: 1120, y: 990, s: S, d: 1, cab: 4, ol: [6, 0] }, SENTADO));
      B.posar(P.q('#irma'), pose({ x: 1660, y: 990, s: S * 0.95, d: -1, cab: 4, ol: [6, 0] }, SENTADO));
      lant(P, 1380, 650, 0.8 + 0.04 * Math.sin(t * 6));
      camera(P, 1380, lerp(640, 660, tl / 4.2), lerp(1.7, 1.15, E.io(prog(tl, 0, 4.2))));
    } },
  /* S9 — EPISÓDIO 3 — DO OUTRO LADO. */
  { ate: 99,
    svg: (pre) => `<rect x="-400" y="-400" width="2720" height="1880" fill="#000"/><g class="fim">${txt(960, 560, 'EPISÓDIO 3 — DO OUTRO LADO.', { f: 'Anton', t: 86, c: '#f4f1ea', a: 'middle', ls: 3 })}</g>`,
    quadro(tl, el, P, t) {
      const k = E.out(prog(t, 38.2, 39.1)) * (1 - E.in(prog(t, 41.1, 41.9)));
      op(P.q('.fim'), k); P.q('.fim').style.filter = `blur(${((1 - E.out(prog(t, 38.2, 39.1))) * 6).toFixed(1)}px)`;
      camera(P, 960, 540, lerp(1.0, 1.03, prog(t, 38, 42)));
    } },
] });
}
