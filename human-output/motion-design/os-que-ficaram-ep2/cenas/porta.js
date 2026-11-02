/* porta — Cena 1 "A porta" (27,4 s). Narração começa em 0,4 s.
   Planos: as duas mãos na fechadura → a voz repete, igual → você não responde → o estrondo e o alarme na esquina
   → a maçaneta para → pela fresta, a luz azul se afasta → o resto da noite sentado atrás da porta. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt } = K;
const S = 2.0, A0 = 0.4;
const pose = (...ps) => Object.assign({}, ...ps);
const proj = RUA.proj;
const portaLuz = (P, t, k = 1) => { op(P.q('.int-frestaPorta'), k * (0.85 + 0.15 * Math.sin(t * 11))); op(P.q('.int-frestaLuz'), 0.9 * k); op(P.q('.int-mochilaPorta'), 1); op(P.q('.int-noite'), 0.9); };
const SEGURA = { lean: 14, o: [64, 70], c: [-20, -12], cab: -4, ol: [6, -2], ab: 1.3 };
const balao = () => `<g class="balao"><path d="M-270,-90 Q-290,0 -270,90 L270,90 Q290,0 270,-90 Z M-60,88 L-120,150 L-10,88" fill="#e8f2ff" stroke="#5fb4ff" stroke-width="6"/>
  <text x="0" y="14" text-anchor="middle" font-family="Inter" font-weight="600" font-size="46" fill="#1b2a44">me deixa entrar…</text></g>`;

K.cena('porta', { planos: [
  /* S1 — as duas mãos na fechadura */
  { ate: 3.0,
    svg: (pre) => INT.svg(pre, {}) + `<g class="maos"><circle class="m1" r="26" fill="#141414"/><circle class="m2" r="26" fill="#141414"/>
      <path class="b1" stroke="#2f6fd6" stroke-width="30" stroke-linecap="round" fill="none"/><path class="b2" stroke="#2f6fd6" stroke-width="30" stroke-linecap="round" fill="none"/></g>`,
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const k = E.out(prog(t, 0.3, 0.8));
      const g = Math.sin(t * 22) * 4 * (1 - prog(t, 2.0, 3.0));
      at(P.q('.int-macaneta'), 'transform', `translate(3124,650) rotate(${-20 + g})`);
      const m1 = [lerp(3330, 3150, k), 645], m2 = [lerp(3360, 3160, k), 690];
      at(P.q('.m1'), 'cx', m1[0]); at(P.q('.m1'), 'cy', m1[1]); at(P.q('.m2'), 'cx', m2[0]); at(P.q('.m2'), 'cy', m2[1]);
      at(P.q('.b1'), 'd', `M3420,520 L${m1[0] + 24},${m1[1] - 6}`); at(P.q('.b2'), 'd', `M3440,800 L${m2[0] + 24},${m2[1] + 6}`);
      op(P.q('.int-noite'), 0.78);
      camera(P, 3170, 660, lerp(4.6, 4.9, tl / 3), 0, [ruido(t * 9, 1) * 3, 0]);
    } },
  /* S2 — a voz pede de novo: as mesmas palavras, o mesmo tom */
  { ate: 11.6,
    svg: (pre) => INT.svg(pre, { atores: B.svg('voce', { item: '' }) }) + balao(),
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      B.posar(P.q('#voce'), pose({ x: 3020, y: 990, s: S, d: 1, medo: 0.5 + 0.3 * Math.sin(t * 3) }, SEGURA));
      // o balão aparece duas vezes, idêntico (a repetição é a pista)
      const v1 = prog(t, 3.3, 3.6) * (1 - prog(t, 6.2, 6.5)), v2 = prog(t, 7.1, 7.4) * (1 - prog(t, 11.0, 11.4));
      const v = Math.max(v1, v2);
      at(P.q('.balao'), 'transform', `translate(3090,410) scale(${0.62 * E.outBack(clamp(v * 1.2))})`); op(P.q('.balao'), v);
      camera(P, 3110, 640, lerp(1.55, 1.75, E.sine(tl / 8.6)));
    } },
  /* S3 — você não responde */
  { ate: 13.4,
    svg: (pre) => INT.svg(pre, { atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const p = pose({ x: 3020, y: 990, s: S, d: 1 }, SEGURA, { ab: 1.35, cab: -8 });
      B.posar(P.q('#voce'), p);
      const c = B.cabecaMundo(p);
      camera(P, c[0] - 10, c[1] + 30, lerp(3.6, 3.9, tl / 1.8));
    } },
  /* S4 — um estrondo na esquina; o alarme de um carro dispara */
  { ate: 16.9,
    svg: (pre) => `${RUA.svg(pre, { luz: 'noite' })}<g class="carroA">${RUA.carro({ cor: '#46536e', vidro: '#1e2736' })}</g>
      <circle class="pisca1" r="60" fill="url(#${pre}-glowQ)"/><circle class="pisca2" r="60" fill="url(#${pre}-glowQ)"/>
      <circle class="clarao" cx="1040" cy="500" r="300" fill="url(#${pre}-glowQ)" opacity="0"/>
      <g class="rastG">${RAST.svg(pre)}</g>`,
    quadro(tl, el, P, t) {
      const [cx, cy] = proj(2.2, 0, 34); const sc = 820 / 34 / 100;
      at(P.q('.carroA'), 'transform', `translate(${cx},${cy}) scale(${sc * 1.7})`);
      const pis = t > 14.9 && Math.floor(t * 3) % 2 === 0 ? 1 : 0;
      at(P.q('.pisca1'), 'cx', cx - 150 * sc); at(P.q('.pisca1'), 'cy', cy - 140 * sc); at(P.q('.pisca2'), 'cx', cx + 150 * sc); at(P.q('.pisca2'), 'cy', cy - 140 * sc);
      op(P.q('.pisca1'), pis); op(P.q('.pisca2'), pis);
      op(P.q('.clarao'), E.out(prog(t, 13.5, 13.6)) * (1 - prog(t, 13.6, 14.6)));
      const [bx, by] = proj(-2, 0, 12); RAST.posar(P.q('.rastG'), bx, by, 16.4 / 12, 0, 330, 1);
      camera(P, 980, 520, 1.1, 0, tremor(t, 13.5, 14, 12, 4));
    } },
  /* S5 — a maçaneta para */
  { ate: 18.8,
    svg: (pre) => INT.svg(pre, {}),
    quadro(tl, el, P, t) {
      portaLuz(P, t); op(P.q('.int-noite'), 0.78);
      const g = t < 17.3 ? Math.sin(t * 22) * 3 : 0;
      at(P.q('.int-macaneta'), 'transform', `translate(3124,650) rotate(${lerp(-20, 0, E.out(prog(t, 17.3, 17.9))) + g})`);
      camera(P, 3150, 650, lerp(5.4, 5.6, tl / 1.9));
    } },
  /* S6 — pela fresta da cortina: a luz azul se afasta na direção do barulho */
  { ate: 23.6,
    svg: (pre) => `${RUA.svg(pre, { luz: 'noite' })}<g class="rastG">${RAST.svg(pre)}</g>
      <circle class="pisca" r="40" fill="url(#${pre}-glowQ)"/>
      <path d="M-200,-200 L780,-200 L760,1300 L-200,1300 Z" fill="#46556e"/><path d="M1140,-200 L2120,-200 L2120,1300 L1160,1300 Z" fill="#46556e"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${120 + i * 170},-200 Q${100 + i * 170},500 ${130 + i * 170},1300" stroke="#37445a" stroke-width="18" fill="none"/><path d="M${1260 + i * 170},-200 Q${1280 + i * 170},500 ${1250 + i * 170},1300" stroke="#37445a" stroke-width="18" fill="none"/>`).join('')}
      <rect x="-200" y="-200" width="2320" height="1480" fill="#0f1830" opacity=".35" style="mix-blend-mode:multiply"/>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 18.8, 23.6);
      const Z = lerp(14, 40, E.in(k) * 0.4 + k * 0.6), X = lerp(-1, 1.6, k);
      const [bx, by] = proj(X, 0, Z); RAST.posar(P.q('.rastG'), bx, by, 16.4 / Z, (t - 18.8) * 4, 330, 1);
      const [cx, cy] = proj(2.2, 0.8, 60); at(P.q('.pisca'), 'cx', cx); at(P.q('.pisca'), 'cy', cy); op(P.q('.pisca'), Math.floor(t * 3) % 2 ? 1 : 0.2);
      camera(P, 960, 540, lerp(1.25, 1.35, k));
    } },
  /* S7 — o resto da noite sentado atrás da porta */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1);
      const am = prog(t, 24.5, 27.4);
      INT.ceuSala(P, 0, am * 0.6, 1 - am * 0.6);
      op(P.q('.int-frestaPorta'), 0.6 * (1 - prog(t, 23.6, 24.6))); op(P.q('.int-frestaLuz'), 0.6 * (1 - prog(t, 23.6, 24.6)));
      B.posar(P.q('#voce'), pose({ x: 3060, y: 990, s: S, d: -1, q: [80, 86], j: [130, 134], chao: 0, alt: 70, lean: -4, o: [40, 60], c: [80, 90], cab: 14 + Math.sin(tl) * 2, ol: [3, 2], ab: lerp(1, 0.55, prog(t, 25, 27)), iR: -80 }));
      op(P.q('.int-noite'), lerp(0.9, 0.7, am));
      camera(P, lerp(3020, 2900, prog(tl, 0, 3.8)), 700, lerp(1.6, 1.3, E.io(prog(tl, 0, 3.8))));
    } },
] });
}
