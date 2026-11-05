/* c07 — "O homem na cabine". Os olhos do motorista, a corrente, a versão de Mauro, e Nando que balança a cabeça. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, fala, pisca, elenco, p, ent } = H3;
const cab = (pre) => EP4.cabineClose(pre, { dentro: elenco(['nando']) });
const nando = (P, t, ex = {}) => p(P, 'nando', 'nando', pose({ x: 800, y: 1140, s: 3.7, d: -1, ol: [6, 0], ab: pisca(t, 3) }, ex));
const cruz = (pre) => EP4.cruzamento(pre, { atores: elenco(['davi', 'voce', 'breno', 'mauro'], { breno: { item: Pr.bastao() } }) });
const todos = (P, t, ex = {}) => { [['davi', 2160, 1.75], ['voce', 2360, 1.7]].forEach(([n, x, s], i) => p(P, n, n, pose({ x, y: 1260, s, d: 1, ol: [6, 0], ab: pisca(t, i + 1) }, ex[n] || {})));
  p(P, 'breno', 'breno', pose({ x: 2980, y: 1260, s: 1.72, d: -1, ab: pisca(t, 5) }, { o: [-6, 20], c: [10, 40], iR: 20 }));
  p(P, 'mauro', 'mauro', pose({ x: 2720, y: 1260, s: 1.75, d: -1, ol: [6, 0], ab: pisca(t, 6) }, ex.mauro || {})); };
K.cenaN('c07', [
  { de: 0, svg: cab,
    quadro(tl, el, P, t, F) { const olha = t > F(2) ? [3, 7] : t > F(1) ? [-2, 1] : [6, 0]; nando(P, t, { ol: olha, d: t > F(1) ? 1 : -1, cab: t > F(2) ? 12 : 0 });
      const desce = ent(t, F(2), F(2) + 1); camera(P, lerp(800, 1150, desce), lerp(420, 700, desce), lerp(1.3, 1.6, desce)); } },
  { de: 3, svg: cruz,
    quadro(tl, el, P, t, F) { todos(P, t, { voce: { ab: t > F(5) ? 1.25 : 1, d: -1 + 2 * (t < F(3) + 0.6 ? 0 : 1) } }); const pv = pose({ x: 2360, y: 1260, s: 1.7, d: 1 }); const c = B.cabecaMundo(pv);
      camera(P, c[0] + 20, c[1] + 70, lerp(3.0, 3.3, prog(t, F(3), F(6)))); } },
  { de: 6, svg: cruz,
    quadro(tl, el, P, t, F) { todos(P, t, { voce: { boca: fala(t, F(6), F(7)) * 0.6 }, mauro: { boca: fala(t, F(7), F(12)) * 0.6, o: [-6, t > F(9) && t < F(11) ? 80 : 30], c: [10, 20], cab: Math.sin(t * 2) * 3 } });
      const k = prog(t, F(6), F(12)); camera(P, lerp(2450, 2620, k), lerp(900, 880, k), lerp(1.6, 1.85, k)); } },
  { de: 12, svg: cab,
    quadro(tl, el, P, t, F) { const nao = t > F(13) ? Math.sin((t - F(13)) * 3.2) * 14 * (1 - prog(t, F(14) + 1, F(14) + 2.5)) : 0; nando(P, t, { cab: nao, ol: [6, 1], ab: 0.85 });
      camera(P, lerp(820, 790, prog(t, F(12), F(15))), 420, lerp(1.5, 1.8, prog(t, F(12), F(15)))); } },
]);
}
