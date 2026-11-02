/* comida — Cena 2 "O que você tem" (25,7 s). Narração começa em 0,4 s.
   Planos: amanhecer, a comida da casa na mesa → de cima: duas garrafas, meio pacote de bolacha, arroz
   → a banana vira café da manhã → a torneira engasga e para → o que vai beber amanhã. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const SENTADO = { q: [84, 88], j: [86, 90], chao: 0, alt: 40, o: [10, 30], c: [40, 50] };
const manha = (P) => { op(P.q('.int-tarde'), 0.28); op(P.q('.int-noite'), 0.12); op(P.q('.vista-nave'), 0); op(P.q('.int-canecaMesa'), 0); op(P.q('.int-celMesa'), 0); op(P.q('.int-fruteira'), 0); };
const mesaComida = (P, t, mostrar) => {
  op(P.q('.int-suprimentos'), 1); op(P.q('.int-lantMesa'), 0); op(P.q('.int-powerbank'), 0); op(P.q('.int-g2'), 0);
  op(P.q('.int-g0'), mostrar >= 1 ? 1 : 0); op(P.q('.int-g1'), mostrar >= 1 ? 1 : 0); op(P.q('.int-latas'), mostrar >= 2 ? 1 : 0);
};

K.cena('comida', { planos: [
  /* S1 — quando amanhece, toda a comida da casa na mesa */
  { ate: 4.2,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', { item: Pr.garrafa() }) }),
    quadro(tl, el, P, t) {
      manha(P); mesaComida(P, t, t > 2.4 ? 2 : 1);
      const k = E.io(prog(t, 0.4, 2.2));
      B.posar(P.q('#voce'), pose({ x: lerp(800, 1250, k), y: 990, s: S, d: 1, cab: 10, ol: [3, 3] }, k < 1 && k > 0 ? B.andar(tl * 7, 0.9) : {}, { o: [-8, lerp(40, 70, prog(t, 2.2, 2.7))], c: [10, 40] }));
      op(P.q('#voce .b-it'), t < 2.6 ? 1 : 0);
      camera(P, lerp(1000, 1250, k), 620, lerp(1.2, 1.3, tl / 4.2));
    } },
  /* S2 — de cima: duas garrafas, meio pacote de bolacha, arroz */
  { ate: 8.6,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#7a4b2c"/>
      ${Array.from({ length: 22 }, (_, i) => `<path d="M-200,${i * 70 - 100} C400,${i * 70 - 60} 1200,${i * 70 - 140} 2200,${i * 70 - 90}" stroke="#6a3f24" stroke-width="${3 + (i % 3) * 2}" fill="none" opacity=".6"/>`).join('')}
      <rect x="-200" y="-200" width="2320" height="1480" fill="#f0a060" opacity=".18" style="mix-blend-mode:multiply"/>
      ${[0, 1].map((i) => `<g class="it g${i}"><rect x="-55" y="-190" width="110" height="380" rx="44" fill="#cfe7f7" stroke="#6f93ad" stroke-width="8"/><rect x="-55" y="-30" width="110" height="80" fill="#4a90d9" opacity=".6"/><circle cy="-200" r="34" fill="#3f78c8" stroke="#141414" stroke-width="6"/></g>`).join('')}
      <g class="it bol"><path d="M-170,-90 L170,-90 L170,90 L-170,90 Z" fill="#e2b13c" stroke="#141414" stroke-width="8"/><path d="M60,-90 L90,-60 L70,-30 L100,0 L75,30 L110,60 L90,90" fill="#7a4b2c" stroke="#141414" stroke-width="6"/>
        ${[-120, -60, 0].map((x) => `<circle cx="${x}" cy="0" r="38" fill="#d8a85a" stroke="#8a6a3f" stroke-width="5"/>`).join('')}${txt(-60, -50, 'BOLACHA', { f: 'Anton', t: 34, c: '#7a3a1a', a: 'middle' })}</g>
      <g class="it arr"><rect x="-130" y="-190" width="260" height="380" rx="20" fill="#f4f1ea" stroke="#141414" stroke-width="8"/><rect x="-130" y="-60" width="260" height="110" fill="#e5484d"/>${txt(0, 18, 'ARROZ', { f: 'Anton', t: 64, a: 'middle' })}</g>`,
    quadro(tl, el, P, t) {
      const it = [['.g0', 4.6, 520, 520, -8], ['.g1', 4.85, 700, 560, 6], ['.bol', 6.2, 1100, 380, -4], ['.arr', 8.0, 1400, 640, 5]];
      it.forEach(([s, t0, x, y, r]) => { const k = E.outBack(prog(t, t0, t0 + 0.3)); at(P.q(s), 'transform', `translate(${x},${y - (1 - k) * 60}) rotate(${r}) scale(${0.8 + 0.2 * k})`); op(P.q(s), prog(t, t0, t0 + 0.12)); });
      camera(P, 960, 540, lerp(1.0, 1.08, tl / 4.4));
    } },
  /* S3 — a banana vira café da manhã */
  { ate: 13.0,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', { item: Pr.banana() }) }),
    quadro(tl, el, P, t) {
      manha(P); mesaComida(P, t, 2);
      const come = Math.max(0, Math.sin((t - 11.0) * 4)) * prog(t, 11.0, 11.2);
      B.posar(P.q('#voce'), pose({ x: 1120, y: 990, s: S, d: 1, cab: 6 - come * 6, ol: [3, 1], ab: Math.sin(tl * 1.5) > 0.98 ? 0.1 : 1 }, SENTADO,
        { o: [10, lerp(40, 100, E.io(prog(t, 10.5, 11.0)))], c: [40, lerp(60, 92, E.io(prog(t, 10.5, 11.0)))], iR: -30 }));
      camera(P, 1260, 640, lerp(1.6, 1.7, tl / 4.4));
    } },
  /* S4 — a torneira engasga… e para */
  { ate: 16.8,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', {}) }) + `${[0, 1, 2].map((i) => `<ellipse class="gota gt${i}" rx="5" ry="8" fill="#bfe3ff"/>`).join('')}`,
    quadro(tl, el, P, t) {
      manha(P);
      const mao = E.io(prog(t, 13.1, 13.4));
      B.posar(P.q('#voce'), pose({ x: 1000, y: 990, s: S, d: -1, lean: 10, cab: 16, ol: [3, 4] }, { o: [-6, lerp(20, 78, mao)], c: [10, lerp(40, 30, mao)] }));
      at(P.q('.int-torn-alav'), 'transform', `rotate(${-30 * E.out(prog(t, 13.35, 13.55))} 805 556)`);
      // água: jato que engasga (pulsos) e para
      const jato = t > 13.6 && t < 16.1 && (t < 14.4 || Math.sin(t * 18) > 0.2) ? 1 : 0;
      const ag = P.q('.int-agua'); op(ag, jato * 0.9); at(ag, 'stroke-dasharray', '10 8'); at(ag, 'stroke-dashoffset', -t * 160);
      P.qa('.gota').forEach((g, i) => { const u = ((t - 16.1) * 1.4 + i * 0.33) % 1; at(g, 'cx', 860); at(g, 'cy', 508 + u * 48); op(g, t > 16.1 && t < 16.8 && i === 0 ? 1 - u : 0); });
      camera(P, 880, 540, lerp(2.5, 2.7, tl / 3.8), 0, t > 14.4 && t < 16.1 ? [ruido(t * 20, 1) * 2, 0] : [0, 0]);
    } },
  /* S5 — sobreviver parecia escapar dos alienígenas */
  { ate: 21.6,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      manha(P);
      const olha = E.io(prog(t, 18.0, 18.8));
      B.posar(P.q('#voce'), pose({ x: 1000, y: 990, s: S, d: -1, lean: lerp(10, 0, olha), cab: lerp(16, -14, olha), ol: [3, lerp(4, -4, olha)] }, { o: [-6, lerp(60, 10, olha)], c: [10, 20] }));
      camera(P, lerp(980, 900, E.sine(tl / 4.8)), lerp(560, 480, E.sine(tl / 4.8)), lerp(1.5, 1.8, E.sine(tl / 4.8)));
    } },
  /* S6 — agora, você precisa descobrir o que vai beber amanhã */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      manha(P); mesaComida(P, t, 2);
      B.posar(P.q('#voce'), pose({ x: 1480, y: 990, s: S, d: -1, cab: 22, ol: [3, 5], lean: 6 }, { o: [-6, 20], c: [10, 30] }));
      camera(P, lerp(1300, 1220, E.sine(tl / 4.1)), lerp(640, 690, E.sine(tl / 4.1)), lerp(1.6, 2.4, E.io(prog(tl, 0, 4.1))));
    } },
] });
}
