/* c04 — "A luz azul". Atrás do muro baixo: a luz debaixo do caminhão não é a máquina. É uma lanterna. */
{
const { E, camera, op, at, prog, lerp, ruido, tremor } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3;
const cruz = (pre) => EP4.cruzamento(pre, { atrasPipa: elenco(['breno']), atores: elenco(['davi', 'leo', 'voce']), muro: true });
const trio = (P, t, ag, ex = {}) => [['davi', 1520, 1.75], ['leo', 1700, 1.7], ['voce', 1880, 1.7]].forEach(([n, x, s], i) =>
  p(P, n, n, K.mistura(pose({ x, y: 1420, s, d: 1, ol: [7, -1], ab: pisca(t, i + 1) }), pose({ x, y: 1420, s, d: 1, ol: [7, -1], ab: 1.25, medo: 0.5 }, AG), ag), ex[n]));
const lant = (P, t, on = 1) => { const fraca = 0.75 + 0.25 * Math.sin(t * 9) * Math.sin(t * 2.3); op(P.q('.lantGlow'), 0.9 * on * fraca); op(P.q('.lantCone'), 0.55 * on * fraca); };
const brenoEsconde = (P) => p(P, 'breno', 'breno', pose({ x: 2900, y: 1150, s: 1.55, d: -1 }, AG));
K.cenaN('c04', [
  { de: 0, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); brenoEsconde(P); trio(P, t, ent(t, F(3), F(3) + 0.5));
      const k = ent(t, F(0), F(2) + 1); camera(P, lerp(2100, 2800, k), lerp(1000, 1080, k), lerp(0.85, 1.6, k)); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); brenoEsconde(P); const puxa = ent(t, F(4), F(4) + 0.6);
      trio(P, t, ent(t, F(3), F(3) + 0.4), { leo: pose({ x: lerp(1700, 1640, puxa) }), davi: { o: [-6, lerp(10, 80, puxa)], c: [10, 0] } });
      camera(P, 1720, 1180, lerp(1.9, 2.0, prog(t, F(3), F(5))), 0, tremor(t, F(3), 6, 18, 6)); } },
  { de: 5, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t, t > F(7) ? 0.6 + 0.4 * (Math.sin(t * 23) > 0 ? 1 : 0.3) : 1); brenoEsconde(P); trio(P, t, 1);
      const tosse = t > F(6) && t < F(6) + 0.6 ? 1 : 0; at(P.q('#breno'), 'transform', P.q('#breno').getAttribute('transform') + ` translate(0,${-tosse * 4})`);
      camera(P, lerp(2820, 2860, prog(t, F(5), F(8))), 1080, lerp(2.2, 2.4, prog(t, F(5), F(8))), 0, [tosse * 3 * Math.sin(t * 60), 0]); } },
  { de: 8, svg: cruz,
    quadro(tl, el, P, t, F) { const sai = ent(t, F(8), F(8) + 1.6); const ergue = ent(t, F(9) - 0.4, F(9) + 0.3); const devolve = ent(t, F(11), F(11) + 1.2);
      const comLuz = t > F(8) + 1.6 && t < F(11) + 1.0; op(P.q('.lantLayer'), comLuz ? 0 : 1); lant(P, t, comLuz ? 0 : 1);
      const x = lerp(2900, 2520, sai) + lerp(0, 340, devolve);
      p(P, 'breno', 'breno', K.mistura(pose({ x, y: 1150, s: 1.55, d: -1 }, AG), pose({ x, y: 1150, s: 1.55, d: devolve > 0.3 ? 1 : -1, ol: [6, 0], ab: pisca(t), item: '' }, { o: [-6, lerp(40, 120, ergue * (1 - devolve))], c: [10, -10], iR: -90 }), comLuz ? 1 : sai * (1 - devolve)));
      const g = P.q('#breno .b-it'); if (g) g.innerHTML = comLuz ? `<g transform="scale(1.2) rotate(90)">${Pr.lanternaAzul()}</g>` : '';
      trio(P, t, 1); camera(P, lerp(2400, 2600, prog(t, F(8), F(12))), lerp(1000, 980, prog(t, F(8), F(12))), lerp(1.25, 1.35, prog(t, F(8), F(12)))); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); p(P, 'breno', 'breno', pose({ x: 2860, y: 1150, s: 1.55, d: 1, ol: [6, 0] }));
      trio(P, t, 1, { leo: { d: 1, ol: [-8, 0], cab: -4 }, voce: { d: -1, ol: [6, 0] } });
      camera(P, 1780, 1170, lerp(2.3, 2.45, prog(t, F(12), F(14)))); } },
  { de: 14, svg: cruz,
    quadro(tl, el, P, t, F) { lant(P, t); p(P, 'breno', 'breno', pose({ x: -9999, y: 0 })); trio(P, t, 1);
      const b1 = F(15) + 0.9, b2 = F(16) - 0.1; const bate = (b) => (t > b && t < b + 0.18 ? 1 : 0);
      op(P.q('.nandoVidro'), ent(t, F(15), F(15) + 0.6) * 0.9); op(P.q('.maoVidro4'), t > F(15) + 0.5 ? 1 : 0);
      at(P.q('.maoVidro4'), 'transform', `translate(${3296 + (bate(b1) + bate(b2)) * 5},945)`);
      const k = ent(t, F(14), F(15)); camera(P, lerp(2900, 3260, k), lerp(1040, 940, k), lerp(1.4, 3.2, k), 0, [tremor(t, b1, 3, 20, 14)[0] + tremor(t, b2, 3, 20, 14)[0], 0]); } },
]);
}
