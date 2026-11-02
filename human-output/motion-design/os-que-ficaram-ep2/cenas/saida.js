/* saida — Cena 3 "Sair de casa" (26,7 s). Narração começa em 0,4 s.
   Planos: a mensagem que ela não visualiza → a mochila: carregador, lanterna, garrafas → a porta se abre
   → fios caídos → o ônibus atravessado → portas abertas → as ruas menores → em cada cruzamento, escutar. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const proj = RUA.proj;
const manha = (P) => { op(P.q('.int-tarde'), 0.22); op(P.q('.int-noite'), 0.1); op(P.q('.vista-nave'), 0); op(P.q('.int-canecaMesa'), 0); op(P.q('.int-celMesa'), 0); op(P.q('.int-fruteira'), 0); };
const ANDA = (t, v = 7, a = 1) => B.andar(t * v, a);

K.cena('saida', { planos: [
  /* S1 — "Estou indo ao mercado." Ela não visualiza. */
  { ate: 4.6,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#a08870"/><g filter="url(#${pre}-desf)" opacity=".5"><rect x="200" y="100" width="600" height="500" fill="#f2c79a"/></g>
      <g class="cel" transform="translate(960,560) rotate(-3) scale(.9)">${CEL.svg(UI.conversa({ nome: 'Irmã', sub: 'visto por último ontem às 23:58', hora: '07:12', sinal: 1, msgs: [
        { tipo: 'txt', texto: 'Estou escondida no mercado.', linhas: ['Estou escondida', 'no mercado.'], hora: '23:58' },
        { tipo: 'txt', texto: '…', linhas: ['Tem uma coisa aqui', 'fora imitando a', 'sua voz.'], hora: '23:58' },
        { tipo: 'txt', de: 'eu', texto: 'Estou indo ao mercado.', linhas: ['Estou indo ao', 'mercado.'], hora: '07:12  ✓' } ] }), { id: 'sd1' })}</g>`,
    quadro(tl, el, P, t) {
      const m = P.q('.ui-m2'); const k = E.outBack(prog(t, 2.9, 3.2)); op(m, k);
      const h = P.q('.ui-h2'); at(h, 'fill', t > 4.5 ? '#aab4c4' : '#ffffff');
      camera(P, 960, lerp(560, 600, E.sine(tl / 4.6)), lerp(1.05, 1.25, E.sine(tl / 4.6)));
    } },
  /* S2 — a mochila: carregador, lanterna, garrafas */
  { ate: 10.6,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', {}) + B.svg('voceM', { mochila: true }) }) +
      `<g class="mochilaMesa" transform="translate(1330,720)"><path d="M-30,-180 Q0,-215 30,-180" fill="none" stroke="#141414" stroke-width="8"/><path d="M-70,0 L-74,-140 Q-74,-182 0,-184 Q74,-182 74,-140 L70,0 Z" fill="#3a4250" stroke="#141414" stroke-width="6"/>
  <rect x="-50" y="-90" width="100" height="70" rx="12" fill="#2a303c" stroke="#141414" stroke-width="5"/><path d="M-72,-150 Q0,-128 72,-150" fill="none" stroke="#141414" stroke-width="5"/><circle cx="40" cy="-140" r="6" fill="#d9c27a"/></g>
       <g class="voa v0">${Pr.pilhas()}</g><g class="voa v1" >${Pr.lanterna()}</g><g class="voa v2">${Pr.garrafa()}</g><g class="voa v3">${Pr.garrafa()}</g>`,
    quadro(tl, el, P, t) {
      manha(P);
      const veste = t > 9.3;
      const pega = Math.sin(tl * 3.2) * 0.5 + 0.5;
      B.posar(P.q('#voce'), pose({ x: 1560, y: 990, s: S, d: -1, cab: 14, ol: [3, 4] }, { o: [-6, 40 + pega * 30], c: [10, 50] }));
      B.posar(P.q('#voceM'), pose({ x: 1560, y: 990, s: S, d: -1, cab: 0, ol: [4, -1] }, { o: [-6, 20], c: [10, 30] }));
      op(P.q('#voce'), veste ? 0 : 1); op(P.q('#voceM'), veste ? 1 : 0); op(P.q('.mochilaMesa'), veste ? 0 : 1);
      [5.0, 6.2, 7.3, 8.1].forEach((t0, i) => { const u = prog(t, t0, t0 + 0.45); const x = lerp(1480, 1330, u), y = lerp(640, 600, u) - Math.sin(Math.PI * u) * 120;
        const g = P.q(`.v${i}`); at(g, 'transform', `translate(${x},${y}) rotate(${u * 200}) scale(1.6)`); op(g, t > t0 && u < 1 ? 1 : 0); });
      camera(P, 1440, 660, lerp(1.6, 1.7, tl / 6));
    } },
  /* S3 — quando abre a porta */
  { ate: 14.0,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { mochila: true }) }) +
      `<rect class="luzFora" x="3100" y="316" width="230" height="674" fill="#f6e4c8"/><polygon class="raioPorta" points="3100,316 3330,316 3330,990 2700,1080 2600,1080" fill="#fff3d6" opacity="0" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t) {
      INT.ceuSala(P, 0.5, 0.5, 0); op(P.q('.int-tarde'), 0.15); op(P.q('.int-noite'), 0.1); op(P.q('.int-mochilaPorta'), 0);
      const ab = E.io(prog(t, 11.0, 11.8));
      at(P.q('.int-porta'), 'transform', `translate(3100,0) scale(${lerp(1, 0.18, ab)},1) translate(-3100,0)`);
      const lf = P.q('.luzFora'); at(lf, 'x', 3100 + 230 * lerp(1, 0.18, ab)); at(lf, 'width', 230 * (1 - lerp(1, 0.18, ab)) + 0.01);
      op(P.q('.raioPorta'), 0.5 * ab);
      B.posar(P.q('#voce'), pose({ x: 2980, y: 990, s: S, d: 1, cab: -4, ol: [5, -1], ab: lerp(1, 0.7, ab) }, { o: [-8, lerp(20, 80, prog(t, 10.6, 11.0)) - 50 * ab], c: [10, 20] }));
      camera(P, 3120, 640, lerp(1.45, 1.6, E.sine(tl / 3.4)));
    } },
  /* S4 — fios caídos na calçada */
  { ate: 16.2,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'manha', fios: 900 }) + `${[0, 1, 2, 3, 4].map((i) => `<circle class="faisca fs${i}" r="5" fill="#ffe27a"/>`).join('')}<g class="vc">${B.svg('voce', { mochila: true })}</g>`,
    quadro(tl, el, P, t) {
      P.qa('.faisca').forEach((f, i) => { const u = ((t * 2.3 + i * 0.21) % 1); at(f, 'cx', 1320 + Math.cos(i * 1.7) * 60 * u); at(f, 'cy', 975 - Math.sin(i * 1.1 + 0.6) * 70 * u + 80 * u * u); op(f, rand(Math.floor(t * 8) + i) > 0.5 ? 1 - u : 0); });
      B.posar(P.q('#voce'), pose({ x: lerp(500, 760, prog(t, 14.0, 15.4)), y: 980, s: 1.7, d: 1, cab: 12, ol: [3, 4] }, t < 15.4 ? ANDA(tl, 6, 0.8) : {}));
      camera(P, 1000, 760, 1.25);
    } },
  /* S5 — um ônibus atravessado na avenida */
  { ate: 18.4,
    svg: (pre) => `${RUA.svg(pre, { luz: 'dia' })}<g class="bus">${EP2.onibus()}</g>`,
    quadro(tl, el, P, t) {
      const [bx, by] = proj(0.4, 0, 20); at(P.q('.bus'), 'transform', `translate(${bx},${by}) rotate(-7) scale(${820 / 20 / 60})`);
      camera(P, 960, 540, lerp(1.0, 1.08, tl / 2.2));
    } },
  /* S6 — portas abertas que você prefere não investigar */
  { ate: 21.4,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'manha', abertas: [4, 5, 7] }) + B.svg('voce', { mochila: true }),
    quadro(tl, el, P, t) {
      const x = lerp(700, 1500, prog(t, 18.4, 21.4));
      const olha = Math.sin(Math.PI * prog(t, 19.0, 20.6));
      B.posar(P.q('#voce'), pose({ x, y: 980, s: 1.7, d: 1, cab: -4 - olha * 6, ol: [5 - olha * 8, -2], ab: 1.15 }, ANDA(tl, 6.5, 0.85)));
      camera(P, x + 150, 720, 1.2);
    } },
  /* S7 — as ruas menores */
  { ate: 23.4,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'manha' }) + B.svg('voce', { mochila: true }),
    quadro(tl, el, P, t) {
      const x = lerp(200, 1600, prog(t, 21.4, 23.4));
      B.posar(P.q('#voce'), pose({ x, y: 980, s: 1.0, d: 1, cab: 0, ol: [5, 0] }, ANDA(tl, 7, 0.9)));
      camera(P, 1100, 560, 0.85);
    } },
  /* S8 — a cada cruzamento, para para escutar */
  { ate: 99,
    svg: (pre) => EP2.ruaLado(pre, { luz: 'manha', esquinas: [2400] }) + B.svg('voce', { mochila: true }),
    quadro(tl, el, P, t) {
      const chega = E.out(prog(t, 23.4, 24.3));
      B.posar(P.q('#voce'), K.mistura(pose({ x: lerp(1700, 2180, chega), y: 980, s: 1.7, d: 1 }, ANDA(tl, 6, 0.8)),
        pose({ x: 2180, y: 980, s: 1.7, d: 1, ab: 1.2, ol: [6, -1] }, B.POSES.agachado, { cab: -6, o: [10, 120], c: [40, 100] }), E.io(prog(t, 24.0, 24.6))));
      camera(P, lerp(2000, 2240, chega), 760, lerp(1.25, 1.5, E.sine(prog(t, 23.4, 26.7))));
    } },
] });
}
