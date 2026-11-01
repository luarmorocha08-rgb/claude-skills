/* noite — Cena 5 "A primeira noite" (23,6 s). Narração começa em 0,5 s.
   Planos: sete da noite → a luz acaba → a torneira: ainda sai água → os suprimentos na mesa, a lanterna acende
   → a mensagem atrasada dela → a mochila perto da porta → esperando. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, vibra } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const SENTADO = { q: [84, 88], j: [86, 90], chao: 0, alt: 0, o: [10, 30], c: [40, 50] };
const NO_CHAO = { q: [70, 80], j: [40, 60], chao: 0, alt: 102, lean: -6, o: [-20, 40], c: [20, 60] };
const MOCHILA_MAO = `<g transform="translate(0,8) scale(.42)"><path d="M-46,0 L-50,110 Q-50,140 0,142 Q50,140 50,110 L46,0 Z" transform="scale(1,-1) translate(0,-150)" fill="#2a2c32" stroke="#141414" stroke-width="10"/></g>`;

K.cena('noite', { planos: [
  /* S1 — sete da noite */
  { ate: 1.5,
    svg: (pre) => INT.svg(pre, {}),
    quadro(tl, el, P, t) {
      at(P.q('.int-rel-h'), 'transform', `rotate(${7 * 30 + (t > 0.9 ? 0 : -0.5)})`);
      at(P.q('.int-rel-m'), 'transform', `rotate(${t > 0.9 ? 0 : -6})`);
      op(P.q('.int-noite'), 0.35); op(P.q('.int-tarde'), 0.2);
      camera(P, 1340, 250, lerp(4.2, 4.5, tl / 1.5));
    } },
  /* S1b — a luz acaba */
  { ate: 3.0,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), tv: `<rect width="372" height="222" fill="#2a4a7a"/><rect y="150" width="372" height="40" fill="#e5484d"/>`, atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      const pisca = (t > 2.15 && t < 2.22) || (t > 2.32 && t < 2.4);
      const aceso = t < 2.15 || (t > 2.22 && t < 2.32) ? 1 : 0;
      op(P.q('.int-lumluz'), aceso * 0.9); op(P.q('.int-tvluz'), aceso * 0.5); op(P.q('.int-tvtela'), aceso);
      op(P.q('.int-noite'), aceso ? 0.45 : 0.86);
      INT.ceuSala(P, 0, 0, 1);
      const susto = E.out(prog(t, 2.45, 2.8));
      B.posar(P.q('#voce'), pose({ x: 2160, y: 990, s: S, d: 1, cab: lerp(4, -10, susto), ol: [lerp(5, 0, susto), lerp(0, -3, susto)], ab: lerp(1, 1.3, susto) }, SENTADO));
      camera(P, 2400, 640, lerp(1.0, 1.04, tl / 1.5));
    } },
  /* S2 — você abre a torneira: ainda sai água */
  { ate: 6.0,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'noite' }), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      const mao = E.io(prog(t, 3.2, 3.6));
      B.posar(P.q('#voce'), pose({ x: 1000, y: 990, s: S, d: -1, lean: 10, cab: lerp(10, 18, mao), ol: [3, 4] }, { o: [-6, lerp(20, 78, mao)], c: [10, lerp(40, 30, mao)] }));
      at(P.q('.int-torn-alav'), 'transform', `rotate(${-30 * E.out(prog(t, 3.55, 3.75))} 805 556)`);
      const ag = P.q('.int-agua'); op(ag, prog(t, 3.75, 3.85) * 0.9);
      at(ag, 'stroke-dasharray', '10 8'); at(ag, 'stroke-dashoffset', -t * 160);
      op(P.q('.int-noite'), 0.72);
      camera(P, 900, 560, lerp(2.4, 2.6, tl / 3));
    } },
  /* S3 — garrafas, comida, a lanterna, o carregador */
  { ate: 11.2,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'noite' }), atores: B.svg('voce', { item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-suprimentos'), 1);
      op(P.q('.int-canecaMesa'), 0); op(P.q('.int-celMesa'), 0); op(P.q('.int-fruteira'), 0);
      const aparece = (sel, t0) => { const k = E.outBack(prog(t, t0, t0 + 0.3)); const e = P.q(sel); op(e, k); };
      aparece('.int-g0', 6.2); aparece('.int-g1', 6.6); aparece('.int-g2', 7.0); aparece('.int-latas', 7.9); aparece('.int-lantMesa', 99); aparece('.int-powerbank', 10.2);
      const pega = t > 8.6;
      const bob = Math.sin(tl * 5) * 6;
      const p = pose({ x: 1690, y: 990, s: S, d: -1, cab: 14, ol: [3, 4] }, { o: [-6, pega ? 60 : 45 + bob], c: [10, pega ? 50 : 50], iR: pega ? -60 : 0 });
      B.posar(P.q('#voce'), p);
      op(P.q('#voce .b-it'), pega ? 1 : 0);
      const lig = t > 8.9 ? 1 : 0;
      const m = B.maoFrente(p);
      const lz = P.q('.int-lanterna'); at(lz, 'cx', m[0] - 220); at(lz, 'cy', m[1] + 40); op(lz, lig * 0.9);
      op(P.q('.int-noite'), lig ? 0.78 : 0.86);
      camera(P, 1440, 700, lerp(1.55, 1.68, tl / 5.2));
    } },
  /* S4 — a mensagem atrasada: "Vou tentar chegar na sua casa." */
  { ate: 17.9,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#141a26"/><g filter="url(#${pre}-desf)" opacity=".18"><ellipse cx="300" cy="900" rx="500" ry="300" fill="#ffcf7a"/></g>
      <g class="cel" transform="translate(960,560) rotate(-3) scale(.9)">${CEL.svg(UI.conversa({ nome: 'Irmã', sub: 'sem conexão', hora: '19:06', sinal: 1, msgs: [
        { tipo: 'txt', de: 'ela', texto: 'Vou tentar chegar na sua casa.', linhas: ['Vou tentar chegar', 'na sua casa.'], hora: 'enviada às 09:05' } ] }), { id: 'nt4' })}</g>
      <circle class="brilho" cx="960" cy="560" r="700" fill="url(#${pre}-glowA)" opacity=".12"/>`,
    quadro(tl, el, P, t) {
      const v = vibra(t, 11.4, 12.0, 4);
      at(P.q('.cel'), 'transform', `translate(${960 + v},560) rotate(-3) scale(.9)`);
      const m = P.q('.ui-m0'); const k = E.outBack(prog(t, 11.5, 11.85));
      op(m, k); at(m, 'transform', `translate(-236,${-300 + (1 - k) * 40})`);
      const h = P.q('.ui-h0'); const real = E.io(prog(t, 15.9, 16.3));
      at(h, 'fill', real > 0.5 ? '#ffd166' : '#ffffff'); op(h, lerp(0.6, 1, real));
      at(h, 'font-size', lerp(20, 24, real));
      camera(P, lerp(960, 900, E.io(prog(t, 15.7, 16.6))), lerp(560, 300, E.io(prog(t, 15.7, 16.6))), lerp(1.05, 1.9, E.io(prog(t, 15.7, 16.6))));
    } },
  /* S5 — a mochila perto da porta */
  { ate: 20.0,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { item: MOCHILA_MAO, itemT: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      const k = prog(t, 17.9, 19.3);
      const solta = t > 19.45;
      const abaixa = Math.sin(Math.PI * prog(t, 19.1, 19.9));
      B.posar(P.q('#voce'), pose({ x: lerp(2600, 2900, E.sine(k)), y: 990, s: S, d: 1, cab: 6 + abaixa * 10, ol: [4, 3] },
        k < 1 ? B.andar(tl * 7, 0.9) : {}, { lean: abaixa * 24, o: [-10, 10 + abaixa * 30], c: [10, 10] }));
      op(P.q('#voce .b-it'), solta ? 0 : 1); op(P.q('.int-mochilaPorta'), solta ? 1 : 0);
      INT.ceuSala(P, 0, 0, 1);
      const m = B.maoFrente({ x: lerp(2600, 2900, E.sine(k)), y: 990, s: S });
      const lz = P.q('.int-lanterna'); at(lz, 'cx', lerp(2600, 2900, E.sine(k)) + 160); at(lz, 'cy', 820); op(lz, 0.8);
      op(P.q('.int-noite'), 0.82);
      camera(P, lerp(2700, 2950, E.sine(k)), 640, 1.35);
    } },
  /* S6 — se ela conseguiu escapar, vai procurar você aqui */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), atores: B.svg('voce', { item: Pr.lanterna() }) }),
    quadro(tl, el, P, t) {
      op(P.q('.int-mochilaPorta'), 1);
      INT.ceuSala(P, 0, 0, 1);
      const p = pose({ x: 2700, y: 990, s: S, d: 1, cab: -2, ol: [5, -1], ab: Math.sin(tl * 1.1) > 0.98 ? 0.1 : 1, iR: -70 }, NO_CHAO);
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p);
      const lz = P.q('.int-lanterna'); at(lz, 'cx', m[0] + 220); at(lz, 'cy', m[1] + 30); op(lz, 0.75 + 0.05 * Math.sin(t * 7));
      op(P.q('.int-noite'), 0.86);
      camera(P, lerp(2850, 2900, tl / 3.6), 660, lerp(1.15, 1.3, E.sine(tl / 3.6)));
    } },
] });
}
