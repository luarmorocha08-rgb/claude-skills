/* voz — Cena 7 "A voz" (24 s). Narração começa em 0,3 s.
   Planos: três batidas → a voz dela pedindo para entrar → você quase abre → o celular vibra
   → a mensagem dela → você olha para a porta → a maçaneta gira; clique; corte seco para preto
   → CONTINUA NO EPISÓDIO 2. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, vibra } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const BATIDAS = [0.25, 0.62, 0.99];
const batida = (t) => BATIDAS.reduce((acc, b) => { const tr = tremor(t, b, 7, 22, 16); return [acc[0] + tr[0], acc[1] + tr[1]]; }, [0, 0]);
const portaLuz = (P, t) => { op(P.q('.int-frestaPorta'), 0.85 + 0.15 * Math.sin(t * 11)); op(P.q('.int-frestaLuz'), 0.9); op(P.q('.int-mochilaPorta'), 1); op(P.q('.int-noite'), 0.92); };

K.cena('voz', { planos: [
  /* S1 — três batidas */
  { ate: 2.8,
    svg: (pre) => INT.svg(pre, {}) + BATIDAS.map((b, i) => `<g class="toc toc${i}">${txt(0, 0, 'TOC', { f: 'Anton', t: 64, c: '#e9edf5', a: 'middle' })}</g>`).join(''),
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const b = batida(t);
      at(P.q('.int-porta'), 'transform', `translate(${b[0] * 0.4},0)`);
      BATIDAS.forEach((bt, i) => { const u = t - bt; const g = P.q(`.toc${i}`); op(g, u < 0 ? 0 : 1 - prog(u, 0.5, 1.4));
        at(g, 'transform', `translate(${3215 + [-70, 60, -20][i]},${[520, 470, 600][i] - u * 20}) rotate(${[-8, 6, -3][i]}) scale(${0.8 + 0.2 * E.outBack(prog(u, 0, 0.15))})`); });
      camera(P, 3215, 650, lerp(1.55, 1.62, tl / 2.8), 0, [b[0] * 0.6, b[1] * 0.6]);
    } },
  /* S2 — a voz dela, pedindo para entrar */
  { ate: 5.9,
    svg: (pre) => INT.svg(pre, {}) + `<g class="balao"><path class="balaoF" d="" fill="#e8f2ff" stroke="#5fb4ff" stroke-width="6"/>
      <text class="balaoT" x="0" y="14" text-anchor="middle" font-family="Inter" font-weight="600" font-size="46" fill="#1b2a44">me deixa entrar…</text></g>`,
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const k = E.outBack(prog(t, 3.0, 3.4));
      // contorno que treme de leve: a voz não é bem dela
      const pts = []; for (let i = 0; i <= 36; i++) { const a = (i / 36) * Math.PI * 2; const r = 1 + 0.025 * Math.sin(a * 7 + t * 9); pts.push([Math.cos(a) * 270 * r, Math.sin(a) * 90 * r]); }
      at(P.q('.balaoF'), 'd', 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L') + ' Z M-60,80 L-120,150 L-10,86');
      at(P.q('.balao'), 'transform', `translate(${3215 - 120 + ruido(t * 3, 1) * 4},${430}) scale(${0.62 * k})`);
      op(P.q('.balao'), k);
      at(P.q('.balaoT'), 'letter-spacing', (Math.sin(t * 2.3) * 1.2).toFixed(2));
      camera(P, 3170, 600, lerp(1.6, 1.75, E.sine(tl / 3.1)));
    } },
  /* S3 — você quase abre */
  { ate: 7.5,
    svg: (pre) => INT.svg(pre, { atores: B.svg('voce', { item: '', itemT: Pr.celular({ aceso: false }) }) }),
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const k = E.io(prog(t, 5.9, 7.0));
      const est = E.io(prog(t, 6.6, 7.4));
      B.posar(P.q('#voce'), pose({ x: lerp(2820, 3000, k), y: 990, s: S, d: 1, cab: -6, ol: [5, -2], ab: 1.1 }, k < 1 ? B.andar(tl * 7, 0.7) : {}, { o: [-10, lerp(20, 96, est)], c: [30, lerp(20, -4, est)] }));
      camera(P, lerp(2950, 3060, k), 640, 1.5);
    } },
  /* S4 — mas o celular vibra na sua mão */
  { ate: 10.6,
    svg: (pre) => INT.svg(pre, { atores: B.svg('voce', { item: Pr.celular({ tela: '#bfe4ff' }) }) }) + `<circle class="brilhoCel" r="160" fill="url(#${pre}-glowA)" opacity="0"/>`,
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const v = vibra(t, 7.5, 8.6, 3);
      const olha = E.io(prog(t, 8.3, 8.8));
      const p = pose({ x: 3000, y: 990, s: S, d: 1, cab: lerp(-6, 18, olha), ol: [lerp(5, 2, olha), lerp(-2, 5, olha)], ab: 1.1 }, { o: [-10, lerp(30, 34, olha)], c: [20, lerp(60, 96, olha)], iR: v * 3 - 14 });
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p);
      const bc = P.q('.brilhoCel'); at(bc, 'cx', m[0]); at(bc, 'cy', m[1]); op(bc, t > 7.5 ? 0.9 : 0);
      const c = B.cabecaMundo(p);
      camera(P, c[0] + 30, c[1] + 120, lerp(2.2, 2.4, tl / 3.1));
    } },
  /* S5 — a mensagem dela */
  { ate: 15.0,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#0b1020"/><g filter="url(#${pre}-desf)" opacity=".5"><rect x="1300" y="-100" width="500" height="1300" fill="#2a3a5a"/><rect x="1300" y="1000" width="500" height="20" fill="#5fb4ff"/></g>
      <g class="cel" transform="translate(960,560) rotate(-3) scale(.9)">${CEL.svg(UI.conversa({ nome: 'Irmã', sub: 'online', hora: '23:58', sinal: 1, msgs: [
        { tipo: 'txt', texto: 'Estou escondida no mercado.', linhas: ['Estou escondida', 'no mercado.'], hora: 'agora' },
        { tipo: 'txt', texto: 'Tem uma coisa aqui fora imitando a sua voz.', linhas: ['Tem uma coisa aqui', 'fora imitando a', 'sua voz.'], hora: 'agora' } ] }), { id: 'vz5' })}</g>`,
    quadro(tl, el, P, t) {
      [10.8, 12.5].forEach((t0, i) => { const m = P.q(`.ui-m${i}`); const k = E.outBack(prog(t, t0, t0 + 0.35)); op(m, k); });
      camera(P, 960, lerp(560, 470, E.sine(prog(t, 10.6, 15))), lerp(1.05, 1.35, E.sine(prog(t, 10.6, 15))), 0, [ruido(t, 2) * 3, ruido(t, 3) * 3]);
    } },
  /* S6 — você olha para a porta */
  { ate: 16.5,
    svg: (pre) => INT.svg(pre, { atores: B.svg('voce', { item: Pr.celular({ tela: '#bfe4ff' }) }) }),
    quadro(tl, el, P, t) {
      portaLuz(P, t);
      const sobe = E.io(prog(t, 15.15, 15.6));
      const p = pose({ x: 3000, y: 990, s: S, d: 1, cab: lerp(18, -6, sobe), ol: [lerp(2, 7, sobe), lerp(5, -2, sobe)], ab: lerp(1.1, 1.4, sobe), medo: sobe }, { o: [-10, 34], c: [20, 96], iR: -14 });
      B.posar(P.q('#voce'), p);
      const c = B.cabecaMundo(p);
      camera(P, c[0] + 10, c[1] + 20, lerp(3.4, 3.8, tl / 1.5));
    } },
  /* S7 — a maçaneta começa a girar. Clique. */
  { ate: 19.0,
    svg: (pre) => INT.svg(pre, {}),
    quadro(tl, el, P, t) {
      portaLuz(P, t); op(P.q('.int-noite'), 0.78);
      const gira = E.in(prog(t, 16.8, 18.75)) * 0.7 + prog(t, 16.8, 18.75) * 0.3;
      const clique = tremor(t, 18.85, 5, 30, 20);
      at(P.q('.int-macaneta'), 'transform', `translate(3124,650) rotate(${-34 * gira + clique[0] * 0.6})`);
      camera(P, 3150, 650, lerp(5.2, 5.8, prog(tl, 0, 2.5)), 0, clique);
    } },
  /* S8 — preto. CONTINUA NO EPISÓDIO 2. */
  { ate: 99,
    svg: (pre) => `<rect x="-400" y="-400" width="2720" height="1880" fill="#000"/>
      <g class="fim">${txt(960, 560, 'CONTINUA NO EPISÓDIO 2.', { f: 'Anton', t: 92, c: '#f4f1ea', a: 'middle', ls: 3 })}</g>`,
    quadro(tl, el, P, t) {
      const k = E.out(prog(t, 20.0, 20.9)) * (1 - E.in(prog(t, 23.2, 24.0)));
      op(P.q('.fim'), k);
      P.q('.fim').style.filter = `blur(${((1 - E.out(prog(t, 20.0, 20.9))) * 6).toFixed(1)}px)`;
      camera(P, 960, 540, lerp(1.0, 1.03, prog(t, 20, 24)));
    } },
] });
}
