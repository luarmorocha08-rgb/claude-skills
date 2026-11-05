/* c06 — "O preço". Latas e pilhas sobre o capô; cinco litros; "quantas, exatamente"; as ferramentas de Léo. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, AG, fala, pisca, elenco, p, ent } = H3; const { BRACOS } = H4;
const capo = (pre) => EP4.maos(pre, { fundo: '#7c8088', obj: `<path d="M-300,420 Q960,300 2220,420 L2220,1400 L-300,1400 Z" fill="#8e5ea2" stroke="#141414" stroke-width="10"/><path d="M-300,470 Q960,360 2220,470" fill="none" stroke="#b07cc4" stroke-width="10" opacity=".6"/>
  <g class="latas">${[0, 1].map((i) => `<g transform="translate(${640 + i * 170},640)"><rect x="-60" y="-120" width="120" height="140" rx="10" fill="#bdc3c7" stroke="#141414" stroke-width="7"/><rect x="-60" y="-80" width="120" height="50" fill="#e74c3c"/></g>`).join('')}</g>
  <g class="pilhasC" transform="translate(1250,620) scale(4)">${Pr.pilhas()}</g>` });
const cruz = (pre) => EP4.cruzamento(pre, { atores: elenco(['leo', 'davi', 'voce', 'breno', 'mauro'], { breno: { item: Pr.bastao() }, leo: { item: Pr.ferramentas() } }) });
const todos = (P, t, ex = {}) => { [['leo', 1960, 1.7], ['davi', 2160, 1.75], ['voce', 2360, 1.7]].forEach(([n, x, s], i) => p(P, n, n, pose({ x, y: 1260, s, d: 1, ol: [6, 0], ab: pisca(t, i + 1) }, ex[n] || {})));
  p(P, 'breno', 'breno', pose({ x: 2980, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex.breno || {}));
  p(P, 'mauro', 'mauro', pose({ x: 2720, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {})); };
const lant = (P, t) => { const f = 0.8 + 0.2 * Math.sin(t * 7); op(P.q('.lantGlow'), 0.9 * f); op(P.q('.lantCone'), 0.55 * f); };
K.cenaN('c06', [
  { de: 0, svg: capo,
    quadro(tl, el, P, t, F) { const poe = ent(t, F(0), F(0) + 0.8), poe2 = ent(t, F(1), F(1) + 0.7), sep = ent(t, F(2), F(2) + 1.2);
      at(P.q('.latas'), 'transform', `translate(0,${lerp(-500, 0, poe)})`); at(P.q('.pilhasC'), 'transform', `translate(${1250 + sep * 260},${lerp(100, 620, poe2)}) scale(4)`);
      at(P.q('.mA'), 'transform', `translate(${lerp(500, 760, poe)},${lerp(1300, 760, poe) + (t > F(1) + 1 ? 700 : 0)})`);
      op(P.q('.mB'), t > F(2) - 0.3 ? 1 : 0); at(P.q('.mB'), 'transform', `translate(${1300 + sep * 260},${lerp(260, 560, ent(t, F(2) - 0.3, F(2)))}) scale(.6,1.6)`);
      camera(P, lerp(960, 1100, prog(t, F(0), F(3))), 600, lerp(1.0, 1.1, prog(t, F(0), F(3)))); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); todos(P, t, { mauro: { boca: fala(t, F(3), F(4)) * 0.6, o: [-6, 50], c: [10, 40] }, voce: { boca: fala(t, F(4), F(6) + 1.5) * 0.6, o: [-6, t > F(4) ? 60 : 10], c: [10, 30] } });
      const k = ent(t, F(4), F(4) + 0.8); camera(P, lerp(2650, 2450, k), 900, lerp(1.7, 2.0, k)); } },
  { de: 7, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); todos(P, t, { mauro: { boca: fala(t, F(7), F(8)) * 0.6 }, davi: { cab: t > F(8) ? -4 : 0, ol: t > F(8) ? [-8, 0] : [6, 0], d: t > F(8) ? 1 : 1 }, voce: { boca: fala(t, F(9), F(10)) * 0.5, ab: 0.85 } });
      camera(P, 2340, 920, lerp(1.6, 1.7, prog(t, F(7), F(10)))); } },
  { de: 10, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); const cruza = ent(t, F(10), F(10) + 0.8); todos(P, t, { mauro: Object.assign({ boca: fala(t, F(11), F(12)) * 0.6 }, K.mistura(pose({}), pose({}, BRACOS), cruza)) });
      const pm = pose({ x: 2720, y: 1260, s: 1.75, d: -1 }); const c = B.cabecaMundo(pm); camera(P, lerp(c[0] + 60, c[0] + 140, prog(t, F(10), F(12))), c[1] + 160, lerp(2.4, 2.2, prog(t, F(10), F(12)))); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); todos(P, t, { voce: { ab: 0.85 } }); camera(P, lerp(2780, 2860, prog(t, F(12), F(14))), 1120, lerp(2.4, 2.6, prog(t, F(12), F(14)))); } },
  { de: 14, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); const ap = ent(t, F(14), F(14) + 0.5); const aperta = ent(t, F(16), F(16) + 0.4);
      todos(P, t, { mauro: { boca: fala(t, F(15), F(16)) * 0.6, o: [-6, lerp(10, 95, ap)], c: [10, 0] }, leo: { o: [-6, lerp(30, 60, aperta)], c: [10, lerp(50, 80, aperta)], ab: 1.1 + aperta * 0.2 } });
      camera(P, lerp(2300, 2100, aperta), lerp(920, 980, aperta), lerp(1.2, 2.2, aperta), 0, tremor(t, F(16), 3, 18, 8)); } },
]);
}
