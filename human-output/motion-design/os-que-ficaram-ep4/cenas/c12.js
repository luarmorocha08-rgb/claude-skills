/* c12 — "Uma porta aberta". Cíntia leva Léo; um segredo ao pé do ouvido; a chave e o documento no balcão. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, ANDA, AG, SCH, fala, pisca, elenco, p, ent } = H3;
const cruz = (pre) => EP4.cruzamento(pre, { atores: elenco(['leo', 'davi', 'cintia', 'voce', 'breno', 'mauro'], { breno: { item: Pr.ferramentas() } }) });
const base = (P, t, tl, ex = {}) => {
  p(P, 'leo', 'leo', pose({ x: 2050, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, ex.leo || {}));
  p(P, 'davi', 'davi', pose({ x: 1900, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 2) }, ex.davi || {}));
  p(P, 'cintia', 'cintia', pose({ x: -9999, y: 1260, s: 1.66, d: -1, ol: [6, 0], ab: pisca(t, 4) }, ex.cintia || {}));
  p(P, 'voce', 'voce', pose({ x: 1800, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 3) }, ex.voce || {}));
  p(P, 'breno', 'breno', pose({ x: 2520, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 50], c: [10, 20] }, ex.breno || {}));
  p(P, 'mauro', 'mauro', pose({ x: 2900, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {})); };
K.cenaN('c12', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { const ajuda = ent(t, F(0) + 0.6, F(0) + 2); const vai = prog(t, F(2), F(3) + 0.5);
      base(P, t, tl, { leo: K.mistura(pose({ x: 2050 }, SCH, { o: [-6, 40], c: [10, 90] }), pose({ x: lerp(2050, 2900, vai), d: vai > 0 ? 1 : -1, o: [-6, 40], c: [10, 90] }, vai > 0 && vai < 1 ? ANDA(tl, 5, 0.5) : {}), ajuda),
        cintia: K.mistura(pose({ x: 2180, d: -1, boca: fala(t, F(0), F(1)) * 0.6 }, AG), pose({ x: lerp(2180, 3030, vai), d: vai > 0 ? 1 : -1 }, vai > 0 && vai < 1 ? ANDA(tl + 0.3, 5, 0.5) : {}), ajuda),
        davi: pose({ x: lerp(1900, 2760, vai), d: 1 }, vai > 0 && vai < 1 ? ANDA(tl + 0.6, 5, 0.5) : {}), mauro: { o: t > F(1) && t < F(2) ? [-6, 60] : [-7, 7], c: [10, 20] } });
      camera(P, lerp(2200, 2500, vai), 920, lerp(1.35, 1.2, vai)); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { const vem = ent(t, F(4), F(4) + 0.8); const sai = ent(t, F(9), F(9) + 1.4);
      base(P, t, tl, { leo: { x: -9999 }, davi: { x: -9999 }, voce: { x: 2300, d: -1 + 2 * (t > F(4) ? 1 : 0), ol: t > F(7) ? [6, 0] : [6, 2], ab: t > F(7) ? 1.15 : pisca(t) },
        cintia: { x: lerp(2700, 2440, vem) + lerp(0, 600, sai), d: sai > 0.1 ? 1 : -1, boca: fala(t, F(5), F(6) + 1) * 0.3, lean: t > F(4) && t < F(7) ? -10 : 0 }, breno: { x: 3100 }, mauro: { x: 3300 } });
      const k = ent(t, F(4), F(4) + 1); camera(P, lerp(2300, 2380, k), lerp(900, 840, k), lerp(1.5, 2.8, k)); } },
  { de: 10, svg: cruz,
    quadro(tl, el, P, t, F) { const vira = ent(t, F(10), F(10) + 0.6); const sai = prog(t, F(10) + 0.8, F(11));
      base(P, t, tl, { leo: { x: -9999 }, davi: { x: -9999 }, cintia: { x: -9999 }, voce: pose({ x: lerp(2300, 2580, sai), d: 1, ab: 1.1 }, sai > 0 && sai < 1 ? ANDA(tl, 7, 0.5) : {}),
        breno: { x: 3150, d: -1 }, mauro: { x: 2950, d: vira > 0.5 ? 1 : -1, boca: fala(t, F(10) + 0.6, F(11)) * 0.6 } });
      camera(P, 2600, 900, 1.3); } },
  { de: 11, svg: (pre) => EP4.farmaciaDentro(pre, { atores: elenco(['voce']) }) + `<g class="mao"><circle r="18" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { p(P, 'voce', 'voce', pose({ x: 1800, y: 990, s: 1.7, d: -1, ol: [6, 3], ab: 1.1 }, { o: [-6, t > F(13) ? 70 : 20], c: [10, 0] }));
      const pega = ent(t, F(13), F(13) + 0.6); at(P.q('.f-chave'), 'transform', `translate(${lerp(1610, 1700, pega)},${lerp(716, 680, pega)})`); at(P.q('.f-prancheta'), 'transform', `translate(${lerp(1520, 1660, pega)},${lerp(712, 690, pega)}) rotate(${lerp(-80, -20, pega)}) scale(1.1)`);
      at(P.q('.mao'), 'transform', `translate(${lerp(1690, 1700, pega)},${lerp(780, 760, pega)})`); op(P.q('.mao'), t > F(13) - 0.3 ? 1 : 0);
      const k = ent(t, F(11), F(12) + 1); camera(P, lerp(1560, 1580, k), lerp(780, 790, k), lerp(2.0, 3.2, k)); } },
]);
}
