/* c13 — "Nando". A corrente cai sem tocar o chão; o motorista mal fica em pé; a chave da ignição está com Mauro. "Afasta dele." */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const CHAVEIG = `<g transform="rotate(20)"><circle r="10" fill="none" stroke="#7f8c8d" stroke-width="5"/><rect x="8" y="-4" width="34" height="8" fill="#7f8c8d"/></g>`;
const cruz = (pre) => EP4.cruzamento(pre, { semCorrente: true, atores: elenco(['voce', 'nando', 'mauro', 'breno'], { voce: { item: Pr.prancheta() }, mauro: { item: CHAVEIG }, breno: { item: Pr.bastao() } }) });
const base = (P, t, ex = {}) => {
  p(P, 'voce', 'voce', pose({ x: 3020, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, { o: [-6, 50], c: [10, 40] }, ex.voce || {}));
  p(P, 'nando', 'nando', pose({ x: 3260, y: 1260, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 2), lean: 10 }, { o: [-6, -40], c: [10, 20] }, ex.nando || {}));
  p(P, 'mauro', 'mauro', pose({ x: -9999, y: 1260, s: 1.75, d: 1 }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: -9999, y: 1260, s: 1.72, d: -1, ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex.breno || {})); };
K.cenaN('c13', [
  { de: 0, svg: (pre) => EP4.cabineClose(pre, { dentro: elenco(['nando']) }) + `<g class="chaveC"><g transform="scale(3)">${Pr.chave()}</g></g>`,
    quadro(tl, el, P, t, F) { p(P, 'nando', 'nando', pose({ x: 800, y: 1140, s: 3.7, d: -1, ol: [4, 6], ab: 1.1 })); const gira = ent(t, F(0), F(0) + 1.2); const cai = ent(t, F(0) + 1.4, F(0) + 2.4);
      at(P.q('.chaveC'), 'transform', `translate(${lerp(1600, 1300, gira)},${lerp(1100, 830, gira)}) rotate(${lerp(0, 90, ent(t, F(0) + 1, F(0) + 1.4))})`); op(P.q('.chaveC'), 1 - cai);
      at(P.q('.cab-corrente'), 'transform', `translate(${cai * 60},${cai * 260})`); op(P.q('.cab-corrente'), 1 - cai * 0.3);
      op(P.q('.cab-mao'), 1); at(P.q('.cab-mao'), 'transform', `translate(${lerp(1600, 1360, gira)},${lerp(1150, 900, gira) + cai * 200})`);
      camera(P, 1150, lerp(720, 760, cai), lerp(1.5, 1.6, prog(t, F(0), F(1)))); } },
  { de: 1, svg: cruz,
    quadro(tl, el, P, t, F) { const sai = ent(t, F(1), F(1) + 1.8); const apoia = t > F(2); base(P, t, { nando: { x: lerp(3300, 3260, sai), y: lerp(1150, 1260, sai), lean: apoia ? 16 : 6, o: apoia ? [-6, -70] : [-6, 20], c: [10, 0], ab: 0.8 }, voce: { x: 2960 } });
      camera(P, 3150, 940, lerp(1.6, 1.7, prog(t, F(1), F(3)))); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { const olha = t > F(4) && t < F(5); base(P, t, { voce: { boca: fala(t, F(3), F(4)) * 0.6 + fala(t, F(6), F(6) + 0.6) * 0.6, o: [-6, olha ? 80 : 50], c: [10, olha ? 0 : 40] }, nando: { cab: olha ? 18 : 0, ol: olha ? [3, 7] : [6, 0], boca: fala(t, F(5), F(6)) * 0.6 } });
      camera(P, 3140, 900, lerp(1.9, 2.1, prog(t, F(3), F(7)))); } },
  { de: 7, svg: cruz,
    quadro(tl, el, P, t, F) { const ap = ent(t, F(8), F(8) + 0.5); base(P, t, { nando: { ab: t > F(7) && t < F(7) + 1.2 ? 0.08 : 1, d: ap > 0.5 ? 1 : -1, o: [-6, lerp(-40, 100, ap)], c: [10, -10], boca: fala(t, F(9), F(11)) * 0.6 } });
      const pn = pose({ x: 3260, y: 1260, s: 1.7, d: -1, lean: 10 }); const c = B.cabecaMundo(pn); const k = ent(t, F(8), F(8) + 1.2);
      camera(P, lerp(c[0] - 20, 3000, k), lerp(c[1] + 60, 920, k), lerp(3.0, 1.2, k)); } },
  { de: 11, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { mauro: { x: 2450, d: 1, o: [-6, 60], c: [10, 30], iR: Math.sin(t * 5) * 30, ol: [6, 0] }, voce: { x: -9999 }, nando: { x: -9999 } });
      camera(P, 2470, 960, lerp(2.0, 2.3, prog(t, F(11), F(12)))); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { const vem = ent(t, F(12) + 0.5, F(13) + 0.3); base(P, t, { breno: pose({ x: lerp(3700, 3420, vem), d: -1, boca: fala(t, F(13), F(13) + 0.8) }, vem < 1 ? ANDA(tl, 6, 0.7) : { o: [-6, 70], c: [10, 0], iR: 60 }), voce: { d: t > F(13) ? 1 : 1, ab: t > F(13) ? 1.3 : 1, medo: t > F(13) ? 0.6 : 0 }, nando: { ab: t > F(13) ? 1.3 : 1 } });
      camera(P, lerp(3150, 3250, vem), 920, lerp(1.6, 1.5, vem), 0, tremor(t, F(13), 8, 18, 7)); } },
]);
}
