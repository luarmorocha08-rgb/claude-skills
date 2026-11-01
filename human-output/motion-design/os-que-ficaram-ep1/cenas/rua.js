/* rua — Cena 6 "Alguém na rua" (18,8 s). Narração começa em 0,4 s.
   Planos: metal raspando no asfalto → o olho na fresta da cortina → a máquina para na casa ao lado,
   a luz azul passa pelas janelas → você apaga a lanterna e se abaixa → a luz varre a sala
   → então para → bem na sua porta: a luz azul por baixo dela. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const proj = RUA.proj;
const NO_CHAO = { q: [70, 80], j: [40, 60], chao: 0, alt: 102, lean: -6, o: [-20, 40], c: [20, 60] };

K.cena('rua', { planos: [
  /* S1 — perto da meia-noite: metal raspando no asfalto */
  { ate: 4.5,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1);
      INT.ceuSala(P, 0, 0, 1);
      const vira = E.out(prog(t, 1.7, 2.1));
      const lev = E.io(prog(t, 3.4, 4.4));
      const a = pose({ x: 2700, y: 990, s: S, d: 1, cab: lerp(-2, 0, vira), ol: [lerp(5, -6, vira), -1], ab: lerp(1, 1.3, vira), iR: -70 }, NO_CHAO);
      const b = pose({ x: 2560, y: 990, s: S, d: -1, cab: -4, ol: [4, -2], ab: 1.3, iR: -70 }, { o: [-6, 30], c: [10, 50] });
      const p = lev > 0 ? K.mistura(a, b, lev) : a;
      p.d = lev > 0.5 ? -1 : 1;
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p);
      const lz = P.q('.int-lanterna'); at(lz, 'cx', m[0] + 220 * p.d); at(lz, 'cy', m[1] + 30); op(lz, 0.75);
      op(P.q('.int-noite'), 0.86);
      camera(P, lerp(2700, 2500, lev), 660, lerp(1.25, 1.2, lev), 0, [ruido(t * 3, 1) * 1.5, 0]);
    } },
  /* S2 — pela fresta da cortina */
  { ate: 6.6,
    svg: (pre) => `<g transform="translate(-2400,-260) scale(2)">${RUA.svg(pre, { luz: 'noite' })}</g>
      <circle class="luzAzul" cx="1000" cy="600" r="500" fill="url(#${pre}-glowA)" opacity=".4"/>
      <path d="M-200,-200 L930,-200 L910,1300 L-200,1300 Z" fill="#46556e"/><path d="M1010,-200 L2120,-200 L2120,1300 L1030,1300 Z" fill="#46556e"/>
      ${[0, 1, 2, 3, 4].map((i) => `<path d="M${150 + i * 170},-200 Q${130 + i * 170},500 ${160 + i * 170},1300" stroke="#37445a" stroke-width="18" fill="none"/><path d="M${1130 + i * 170},-200 Q${1150 + i * 170},500 ${1120 + i * 170},1300" stroke="#37445a" stroke-width="18" fill="none"/>`).join('')}
      <rect x="-200" y="-200" width="2320" height="1480" fill="#0f1830" opacity=".5" style="mix-blend-mode:multiply"/>
      <g class="cabeca"><circle r="300" fill="#9aa6c0" stroke="#141414" stroke-width="22"/><ellipse class="olho" cx="-150" cy="-20" rx="24" ry="34" fill="#141414"/><ellipse cx="-60" cy="-20" rx="24" ry="34" fill="#141414"/></g>`,
    quadro(tl, el, P, t) {
      at(P.q('.cabeca'), 'transform', `translate(${lerp(1500, 1420, E.out(prog(tl, 0, 0.8)))},560)`);
      op(P.q('.luzAzul'), 0.3 + 0.25 * (0.5 + 0.5 * Math.sin(t * 5)));
      camera(P, 960, 540, lerp(1.0, 1.06, tl / 2.1));
    } },
  /* S3 — a máquina para diante da casa ao lado; a luz azul passa pelas janelas */
  { ate: 11.2,
    svg: (pre) => `${RUA.svg(pre, { luz: 'noite', janelasAcesas: false })}
      <g class="naveN" transform="translate(1300,-40) scale(.35)" opacity=".7">${NAVE.svg(pre)}</g>
      <polygon class="feixeR" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>
      <ellipse class="manchaR" rx="60" ry="80" fill="url(#${pre}-glowA)" opacity="0"/>
      <g class="rastG">${RAST.svg(pre)}</g>
      <g class="carroN" transform="translate(260,1080) scale(1.4)">${RUA.carro({ cor: '#3a4558', vidro: '#1e2736', farol: '#2a3140' })}</g>`,
    quadro(tl, el, P, t) {
      const para = 8.2;
      const anda = E.out(prog(t, 6.6, para));
      const Z = lerp(36, 15, anda), X = lerp(1.5, 3.4, anda);
      const [bx, by] = proj(X, 0, Z); const sc = 16.4 / Z;
      const fase = t < para ? (t - 6.6) * 5 : (para - 6.6) * 5;
      const g = P.q('.rastG');
      RAST.posar(g, bx, by, sc, fase, 330, 1);
      // a luz percorre as janelas da casa ao lado (lado direito)
      const olho = [bx, by - 330 * sc];
      const v = prog(t, 8.9, 11.0);
      const zj = lerp(16.5, 22, E.sine(v)); const yj = 2.2 + Math.sin(v * 9) * 0.3;
      const alvo = proj(11, yj, zj);
      const lig = E.out(prog(t, 8.5, 8.9));
      at(P.q('.feixeR'), 'points', RUA.poly([olho, [alvo[0], alvo[1] - 60 * (820 / zj / 60)], [alvo[0], alvo[1] + 60 * (820 / zj / 60)]]));
      op(P.q('.feixeR'), 0.85 * lig);
      const mr = P.q('.manchaR'); at(mr, 'cx', alvo[0]); at(mr, 'cy', alvo[1]); at(mr, 'rx', 820 / zj * 1.2); at(mr, 'ry', 820 / zj * 1.6); op(mr, lig);
      camera(P, lerp(980, 1080, anda), 520, lerp(1.0, 1.12, prog(tl, 0, 4.6)));
    } },
  /* S4 — você apaga a lanterna e se abaixa */
  { ate: 13.5,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1); INT.ceuSala(P, 0, 0, 1);
      const off = t > 11.9;
      const desce = E.io(prog(t, 12.2, 12.9));
      const p = K.mistura(pose({ x: 2420, y: 990, s: S, d: -1, cab: -6, ol: [4, -2], ab: 1.25, iR: -70 }, { o: [-6, 40], c: [10, 50] }),
        pose({ x: 2420, y: 990, s: S, d: -1, ab: 1.3, iR: -70, medo: 0.7 }, B.POSES.agachado, { cab: 0, ol: [4, -3] }), desce);
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p);
      const lz = P.q('.int-lanterna'); at(lz, 'cx', m[0] - 220); at(lz, 'cy', m[1] + 20); op(lz, off ? 0 : 0.75);
      op(P.q('.int-noite'), off ? 0.92 : 0.86);
      camera(P, 2300, lerp(640, 700, desce), 1.5);
    } },
  /* S5 — o barulho chega mais perto: a luz varre a sala */
  { ate: 15.3,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', {}) }) +
      `${[0, 1].map((i) => `<path class="pernaSombra ps${i}" d="M0,0 L60,-700" stroke="#05070c" stroke-width="22" stroke-linecap="round" opacity=".55"/>`).join('')}`,
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1); INT.ceuSala(P, 0, 0, 1);
      B.posar(P.q('#voce'), pose({ x: 2420, y: 990, s: S, d: -1, ab: 1.3, medo: 1 }, B.POSES.agachado, { cab: -6, ol: [3, -5] }));
      const v = prog(t, 13.5, 15.3);
      const fx = lerp(1700, 3100, E.sine(v));
      at(P.q('.int-varre'), 'points', `2150,300 2210,300 ${fx + 260},990 ${fx - 260},990`);
      op(P.q('.int-varre'), 0.75);
      P.qa('.pernaSombra').forEach((ps, i) => { const x = lerp(2400, 1960, v) + i * 160 + Math.sin(t * 4 + i * 2) * 20; at(ps, 'transform', `translate(${x},620)`); });
      op(P.q('.int-noite'), 0.92);
      camera(P, 2350, 620, lerp(1.0, 1.08, v), 0, [ruido(t * 6, 3) * 3, ruido(t * 6, 4) * 2]);
    } },
  /* S6 — então para */
  { ate: 16.6,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1); INT.ceuSala(P, 0, 0, 1);
      const p = pose({ x: 2420, y: 990, s: S, d: -1, ab: 1.35, medo: 0.4 }, B.POSES.agachado, { cab: lerp(-6, 10, E.io(prog(t, 15.6, 16.2))), ol: [lerp(3, 6, prog(t, 15.6, 16.2)), -3] });
      B.posar(P.q('#voce'), p);
      at(P.q('.int-varre'), 'points', `2150,300 2210,300 3360,990 2840,990`); op(P.q('.int-varre'), 0.75 * (1 - E.out(prog(t, 15.4, 15.7))));
      op(P.q('.int-noite'), 0.92);
      const c = B.cabecaMundo(p);
      camera(P, c[0] - 30, c[1] + 40, lerp(3.2, 3.5, tl / 1.3));
    } },
  /* S7 — bem na sua porta */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1);
      const k = E.out(prog(t, 16.85, 17.2));
      op(P.q('.int-frestaPorta'), k * (0.85 + 0.15 * Math.sin(t * 11))); op(P.q('.int-frestaLuz'), 0.9 * k);
      op(P.q('.int-noite'), 0.92);
      camera(P, 3215, 680, lerp(1.6, 1.75, E.sine(tl / 2.2)));
    } },
] });
}
