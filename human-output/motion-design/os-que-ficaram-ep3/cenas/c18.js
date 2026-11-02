/* c18 — "Do outro lado da grade". Final: duas pancadas no vidro, luz azul sob o caminhão, preto, EPISÓDIO 4. */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, AG, SCH, DEIT, fala, pisca, elenco, p, ent } = H3;
const noite = (pre) => EP3.quadra(pre, { atores: elenco(['davi', 'bia', 'leo', 'voce', 'irma']) });
const dormitorio = (P, t, ex = {}) => { op(P.q('.q-noite'), 0.88); const l = P.q('.q-luz'); at(l, 'cx', 3150); at(l, 'cy', 900); at(l, 'rx', 380); at(l, 'ry', 220); op(l, 0.7);
  p(P, 'davi', 'davi', pose({ x: 2950, y: 990, s: 1.75, d: -1, ab: 0.1, cab: 18 }, SCH)); p(P, 'bia', 'bia', pose({ x: 2780, y: 990, s: 1.1, d: 1 }, DEIT, { alt: 30 }));
  p(P, 'leo', 'leo', pose({ x: 3200, y: 990, s: 1.7, d: -1, cab: 14, ol: [3, 5] }, AG, { o: [10, 80 + Math.sin(t * 3) * 10], c: [40, 10] }));
  p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: 1, ab: ex.voceAb ?? 0.6 }, DEIT, { alt: 30 })); p(P, 'irma', 'irma', pose({ x: 2120, y: 990, s: 1.62, d: 1, ab: 1, boca: ex.irmaBoca || 0 }, DEIT, { alt: 30 })); };
K.cenaN('c18', [
  { de: 0, svg: (pre) => noite(pre),
    quadro(tl, el, P, t, F) { const fecha = ent(t, F(4), F(4) + 3); dormitorio(P, t, { voceAb: lerp(1, 0.1, fecha) }); camera(P, lerp(2700, 2500, prog(t, F(0), F(5))), 820, lerp(1.0, 1.25, prog(t, F(0), F(5))), 0, t > F(1) && t < F(1) + 0.4 ? [2, 0] : [0, 0]); } },
  { de: 5, svg: (pre) => noite(pre),
    quadro(tl, el, P, t, F) { dormitorio(P, t, { voceAb: t > F(6) ? 1 : 0.15, irmaBoca: fala(t, F(5), F(5) + 3) * 0.5 });
      p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: 1, ab: t > F(6) ? 0.9 : 0.15, boca: fala(t, F(7), F(9) + 2) * 0.5 }, DEIT, { alt: 30 }));
      camera(P, 2160, 900, lerp(3.0, 3.3, prog(t, F(5), F(10)))); } },
  { de: 10, svg: (pre) => EP3.avenida(pre, { luz: 'tarde' }) + `<ellipse class="luzB" cx="3000" cy="1160" rx="380" ry="40" fill="url(#${pre}-glowA)" opacity="0"/>`,
    quadro(tl, el, P, t, F) { op(P.q('.av-noite'), 0.92); const k = prog(t, F(10), F(15) + 1.5); at(P.q('.sem-caixa'), 'transform', `translate(190,-626) rotate(${Math.sin(t * 1.4) * 5})`);
      camera(P, lerp(2600, 3330, E.io(k)), lerp(800, 900, k), lerp(0.9, 2.6, E.in(k) * 0.6 + k * 0.4)); } },
  { de: 15, off: 2.0, svg: (pre) => EP3.cabine(pre), sobre: () => `<g><rect class="fimPreto" x="0" y="0" width="1920" height="1080" fill="#000" opacity="0"/><g class="fimTxt" opacity="0">${K.txt(960, 560, 'EPISÓDIO 4 — A ÚLTIMA RESERVA.', { f: 'Anton', t: 84, c: '#f4f1ea', a: 'middle', ls: 3 })}</g></g>`,
    quadro(tl, el, P, t, F) { const t0 = F(15) + 2.0; const b1 = t0 + 1.2, b2 = t0 + 1.75; const luz = t0 + 3.0; const fim = t0 + 4.4;
      const bate = (b) => (t > b && t < b + 0.18 ? 1 : 0); const m = P.q('.maoVidro'); op(m, t > b1 - 0.3 && t < b2 + 0.5 ? 1 : 0); at(m, 'transform', `translate(1200,${590 - (bate(b1) + bate(b2)) * 6}) scale(${1 + (bate(b1) + bate(b2)) * 0.12})`);
      op(P.q('.luzBaixo'), ent(t, luz, luz + 0.4)); const tr = [tremor(t, b1, 3, 20, 14)[0] + tremor(t, b2, 3, 20, 14)[0], 0];
      camera(P, 1150, 640, lerp(1.6, 1.75, prog(t, t0, fim)), 0, tr);
      op(P.q('.fimPreto'), t > fim ? 1 : 0);
      const tx = P.q('.fimTxt'); op(tx, t > fim + 1.0 ? E.out(prog(t, fim + 1.0, fim + 1.9)) * (1 - E.in(prog(t, fim + 4.6, fim + 5.4))) : 0); } },
], { extra: () => '' });
}
