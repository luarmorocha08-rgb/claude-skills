/* c16 — "O acordo possível". O silêncio de Mauro; a chave do caminhão sobre o capô; o que você não promete. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const CHAVEIG = `<g><circle r="10" fill="none" stroke="#7f8c8d" stroke-width="5"/><rect x="8" y="-4" width="34" height="8" fill="#7f8c8d"/><rect x="34" y="-8" width="8" height="6" fill="#7f8c8d"/></g>`;
const cruz = (pre) => EP4.cruzamento(pre, { semCorrente: true, atrasPipa: `<g class="chaveCapo" opacity="0" transform="translate(3690,1040) scale(1.6)">${CHAVEIG}</g>`, atoresFundo: elenco(['mulher:f1', 'homem:f2', 'senhor:f3']), atores: elenco(['davi', 'leo', 'voce', 'nando', 'cintia', 'mauro', 'breno'], { breno: { item: Pr.bastao() }, voce: { item: Pr.prancheta() } }) });
const base = (P, t, ex = {}) => {
  [['f1', 'mulher', 2420], ['f2', 'homem', 2540], ['f3', 'senhor', 2660]].forEach(([id, n, x], i) => p(P, id, n, pose({ x, y: 980, s: 1.38, d: 1, ol: [6, 0], ab: pisca(t, 7 + i) }, (ex[id] || {}))));
  p(P, 'davi', 'davi', pose({ x: 1950, y: 1260, s: 1.75, d: 1, ol: [6, 0], ab: pisca(t, 3) }, ex.davi || {}));
  p(P, 'leo', 'leo', pose({ x: 1780, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 4) }, { o: [-6, 40], c: [10, 90] }, ex.leo || {}));
  p(P, 'voce', 'voce', pose({ x: 2120, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, { o: [-6, 40], c: [10, 40] }, ex.voce || {}));
  p(P, 'nando', 'nando', pose({ x: 2270, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 2), lean: 10 }, ex.nando || {}));
  p(P, 'cintia', 'cintia', pose({ x: 2700, y: 1260, s: 1.66, d: 1, ol: [6, 0], ab: pisca(t, 4) }, ex.cintia || {}));
  p(P, 'mauro', 'mauro', pose({ x: 3060, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: 3300, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }, ex.breno || {})); };
const capo = (pre) => EP4.maos(pre, { fundo: '#7c8088', obj: `<path d="M-300,420 Q960,300 2220,420 L2220,1400 L-300,1400 Z" fill="#8e5ea2" stroke="#141414" stroke-width="10"/><path d="M-300,470 Q960,360 2220,470" fill="none" stroke="#b07cc4" stroke-width="10" opacity=".6"/><g class="chaveG">${CHAVEIG}</g>` });
K.cenaN('c16', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { mauro: { ab: 0.85, ol: [6, 1] } }); const pm = pose({ x: 3060, y: 1260, s: 1.75, d: -1 }); const c = B.cabecaMundo(pm);
      camera(P, c[0] - 20, c[1] + 60, lerp(2.8, 3.2, prog(t, F(0), F(2)))); } },
  { de: 2, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { f1: { x: 2460 }, f2: { x: 2580 } }); const k = ent(t, F(2), F(3)); const k2 = ent(t, F(3), F(4)); const k3 = ent(t, F(4), F(4) + 1.2);
      camera(P, lerp(lerp(2500, 3000, k2), 3060, k3), lerp(lerp(800, 960, k2), 900, k3), lerp(lerp(2.0, 1.4, k2), 0.85, k3)); } },
  { de: 5, svg: capo,
    quadro(tl, el, P, t, F) { const poe = ent(t, F(5), F(5) + 0.9); at(P.q('.chaveG'), 'transform', `translate(${lerp(1100, 960, poe)},${lerp(200, 620, poe)}) scale(4) rotate(${lerp(-40, 10, poe)})`);
      at(P.q('.mA'), 'transform', `translate(${lerp(1100, 980, poe) + (t > F(5) + 1.3 ? 900 : 0)},${lerp(160, 560, poe)})`); camera(P, 960, 600, lerp(1.1, 1.2, prog(t, F(5), F(6)))); } },
  { de: 6, svg: cruz,
    quadro(tl, el, P, t, F) { base(P, t, { mauro: { boca: fala(t, F(6), F(8)) * 0.6, o: [-6, 40], c: [10, 40] } }); const k = prog(t, F(6), F(8)); camera(P, lerp(2700, 2800, k), 880, lerp(1.25, 1.35, k)); } },
  { de: 8, svg: cruz,
    quadro(tl, el, P, t, F) { const a = t > F(9); base(P, t, { voce: { d: -1, ol: [6, 0] }, davi: { d: a ? 1 : -1, ol: [6, 0] } }); camera(P, lerp(2020, 2100, prog(t, F(8), F(10))), 860, 2.2); } },
  { de: 10, svg: cruz,
    quadro(tl, el, P, t, F) { op(P.q('.chaveCapo'), 1); base(P, t, { nando: { lean: 4 } }); const quem = t < F(11) ? 0 : t < F(12) ? 1 : t < F(13) ? 2 : 3;
      const alvo = [[2150, 900, 1.3], [2270, 860, 2.4], [1780, 860, 2.4], [3700, 1060, 2.6]][quem];
       camera(P, alvo[0], alvo[1], alvo[2] * lerp(1, 1.05, (t * 0.3) % 1)); } },
  { de: 14, svg: cruz,
    quadro(tl, el, P, t, F) { op(P.q('.chaveCapo'), 1); base(P, t, { voce: { boca: fala(t, F(14), F(14) + 3) * 0.6 } }); camera(P, lerp(2400, 2300, prog(t, F(14), F(17))), 880, lerp(1.3, 1.6, prog(t, F(14), F(17)))); } },
  { de: 17, svg: capo,
    quadro(tl, el, P, t, F) { const pega = ent(t, F(17), F(17) + 0.7); at(P.q('.chaveG'), 'transform', `translate(${960 - pega * 500},${620 + pega * 200}) scale(4) rotate(10)`);
      at(P.q('.mA'), 'transform', `translate(${lerp(300, 990, ent(t, F(17) - 0.4, F(17))) - pega * 500},${620 + pega * 200})`); camera(P, 960, 600, 1.2); } },
]);
}
