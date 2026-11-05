/* c11 — "A bolsa de Léo". O puxão, o empurrão, as ferramentas no asfalto; Mauro manda parar, mas não devolve. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, SCH, fala, pisca, elenco, p, ent } = H3;
const FERR = `<g class="ferrChao" opacity="0">${[[0, 0, 20], [70, 18, -40], [-60, 22, 70], [130, 6, 10], [-120, 10, -20]].map(([x, y, r], i) => `<g transform="translate(${x},${y}) rotate(${r})"><rect x="-30" y="-5" width="60" height="10" rx="4" fill="${['#7f8c8d', '#c0392b', '#7f8c8d', '#f1c40f', '#5e6670'][i]}" stroke="#141414" stroke-width="3"/></g>`).join('')}</g>`;
const cruz = (pre) => EP4.cruzamento(pre, { atores: FERR + elenco(['leo', 'davi', 'voce', 'breno', 'mauro'], { breno: { item: Pr.ferramentas() } }) });
const elen = (P, t, ex = {}) => {
  p(P, 'leo', 'leo', pose({ x: 2380, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, ex.leo || {}));
  p(P, 'davi', 'davi', pose({ x: 2020, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 2) }, ex.davi || {}));
  p(P, 'voce', 'voce', pose({ x: 2180, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 3) }, ex.voce || {}));
  p(P, 'breno', 'breno', pose({ x: 2620, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 50], c: [10, 20] }, ex.breno || {}));
  p(P, 'mauro', 'mauro', pose({ x: 2900, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {})); };
K.cenaN('c11', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { const est = ent(t, F(1) + 0.5, F(2)); const puxa = Math.sin(t * 9) * (t > F(3) && t < F(5) ? 1 : 0);
      elen(P, t, { leo: { boca: fala(t, F(0), F(2)) * 0.6, o: [-6, lerp(20, 85, est)], c: [10, 0], x: 2400 + puxa * 14, lean: puxa * 6 }, breno: { o: [-6, 70], c: [10, 0], x: 2620 + puxa * 14, lean: -puxa * 4 } });
      camera(P, lerp(2450, 2510, prog(t, F(0), F(5))), 900, lerp(1.7, 2.1, prog(t, F(2), F(5))), 0, [puxa * 3, 0]); } },
  { de: 5, svg: cruz,
    quadro(tl, el, P, t, F) { const emp = ent(t, F(6), F(6) + 0.35); const cai = ent(t, F(7) - 0.2, F(7) + 0.5); op(P.q('.ferrChao'), t > F(8) - 0.2 ? 1 : 0); at(P.q('.ferrChao'), 'transform', `translate(2360,1270) scale(${lerp(0.4, 1.4, ent(t, F(8) - 0.2, F(8) + 0.3))})`);
      elen(P, t, { leo: K.mistura(pose({ x: lerp(2400, 2050, emp), lean: -18 * emp, ab: 1.3, medo: emp }), pose({ x: 2050, ab: 1.3, medo: 0.6 }, SCH), cai), breno: { o: [-6, lerp(70, 100, emp)], c: [10, -10], x: lerp(2620, 2520, emp) }, davi: { x: 1820 }, voce: { x: 1650 } });
      camera(P, 2250, 950, lerp(1.4, 1.5, prog(t, F(5), F(9))), 0, [tremor(t, F(7), 18, 16, 6)[0], tremor(t, F(7), 10, 13, 6)[1]]); } },
  { de: 9, svg: cruz,
    quadro(tl, el, P, t, F) { op(P.q('.ferrChao'), 1); at(P.q('.ferrChao'), 'transform', 'translate(2360,1270) scale(1.4)'); const passo = ent(t, F(9), F(9) + 0.5); const segura = ent(t, F(10), F(10) + 0.4); const mp = ent(t, F(11), F(11) + 0.4);
      elen(P, t, { leo: pose({ x: 2050, ab: 1.1 }, SCH, { o: [-6, 40], c: [10, 90] }), breno: { x: 2520, o: [-6, 60], c: [10, 10] }, davi: { x: lerp(1820, 1900, segura), o: [-6, lerp(10, 85, segura)], c: [10, 0] }, voce: { x: lerp(1650, 1800, passo) - segura * 30, lean: segura * -10, ab: 1.2 },
        mauro: { o: [-6, lerp(10, 120, mp)], c: [10, -20], boca: fala(t, F(11), F(12)) * 0.6 } });
      camera(P, lerp(2100, 2350, mp), 920, lerp(1.25, 1.15, mp)); } },
  { de: 13, svg: cruz,
    quadro(tl, el, P, t, F) { op(P.q('.ferrChao'), 1); at(P.q('.ferrChao'), 'transform', 'translate(2360,1270) scale(1.4)');
      elen(P, t, { leo: pose({ x: 2050, ab: 0.9, cab: 14, ol: [3, 6] }, SCH, { o: [-6, 40], c: [10, 90] }), breno: { x: 2520 }, davi: { x: 1900 }, voce: { x: 1800, d: 1, ol: [6, 3], ab: 0.85 } });
      const pv = pose({ x: 1800, y: 1260, s: 1.7, d: 1 }); const c = B.cabecaMundo(pv); const k = ent(t, F(14), F(14) + 2);
      camera(P, lerp(1990, c[0] + 30, k), lerp(1080, c[1] + 70, k), lerp(2.0, 3.0, k)); } },
]);
}
