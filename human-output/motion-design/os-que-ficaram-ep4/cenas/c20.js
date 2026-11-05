/* c20 — "A negociação". Mauro cobra; Helena pergunta quanto já foi vendido; o documento passa pela grade; "Agora eu sei onde vocês estão." */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const fora = (pre) => EP3.escolaFora(pre, { dentro: elenco(['helena', 'nando', 'mulher:d1', 'homem:d2', 'senhor:d3', 'irma']), atores: `<g class="carroM">${EP3.carroLado('#8e5ea2')}</g>` + elenco(['voce', 'davi', 'mauro', 'breno'], { mauro: { item: Pr.caderneta() } }) });
const cena = (P, t, ex = {}) => {
  [['d1', 'mulher', 4010], ['d2', 'homem', 4110], ['d3', 'senhor', 4190], ['irma', 'irma', 3930]].forEach(([id, n, x], i) => p(P, id, n, pose({ x, y: 870, s: 1.4, d: -1, ol: [6, 0], ab: pisca(t, 6 + i) }, ex[id] || {})));
  p(P, 'helena', 'helena', pose({ x: 3800, y: 870, s: 1.5, d: -1, ol: [6, 0], ab: pisca(t, 4) }, ex.helena || {}));
  p(P, 'nando', 'nando', pose({ x: -9999, y: 870, s: 1.45, d: -1, ol: [6, 0], ab: pisca(t, 5) }, ex.nando || {}));
  p(P, 'voce', 'voce', pose({ x: 3150, y: 980, s: 1.6, d: 1, ol: [6, 0], ab: pisca(t, 1) }, ex.voce || {}));
  p(P, 'davi', 'davi', pose({ x: 2990, y: 980, s: 1.65, d: 1, ol: [6, 0], ab: pisca(t, 2) }, ex.davi || {}));
  p(P, 'mauro', 'mauro', pose({ x: 3380, y: 980, s: 1.65, d: 1, ol: [6, 0], ab: pisca(t, 3) }, { o: [-6, 40], c: [10, 50] }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: 2400, y: 980, s: 1.6, d: 1, ol: [6, 0], ab: pisca(t, 9) }, H4.BRACOS, ex.breno || {})); };
const carro = (P, x) => at(P.q('.carroM'), 'transform', `translate(${x},1190)`);
const mauroCab = () => B.cabecaMundo(pose({ x: 3380, y: 980, s: 1.65, d: 1 }));
K.cenaN('c20', [
  { de: 0, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); cena(P, t, { mauro: { boca: fala(t, F(0), F(1)) * 0.6, o: [-6, 70], c: [10, 20] }, helena: { boca: fala(t, F(1), F(2)) * 0.6 } });
      const k = ent(t, F(1), F(1) + 0.8); camera(P, lerp(3450, 3720, k), lerp(720, 680, k), lerp(1.8, 2.4, k)); } },
  { de: 2, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); const c = mauroCab(); cena(P, t, { mauro: { ab: 0.85, ol: [6, 1] } }); camera(P, c[0] + 20, c[1] + 60, lerp(3.0, 3.2, prog(t, F(2), F(3)))); } },
  { de: 3, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); const dá = ent(t, F(3), F(3) + 1.2); cena(P, t, { nando: { x: 3930, boca: 0, o: [-6, lerp(20, 90, dá)], c: [10, 0], item: Pr.prancheta() }, helena: { d: 1, o: [-6, lerp(10, 70, dá)], c: [10, 10] } });
      camera(P, 3860, 640, lerp(2.4, 2.6, prog(t, F(3), F(4)))); } },
  { de: 4, svg: (pre) => EP4.documento(pre),
    quadro(tl, el, P, t, F) { const k = ent(t, F(5), F(5) + 1); camera(P, lerp(940, 900, k), lerp(380, 480, k), lerp(1.4, 1.9, k)); } },
  { de: 6, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); cena(P, t, { helena: { boca: fala(t, F(6), F(9)) * 0.6 + fala(t, F(10), F(12)) * 0.6, o: [-6, 40], c: [10, 70] }, mauro: { boca: fala(t, F(9), F(10)) * 0.6, o: [-6, 60], c: [10, 20] } });
      const lado = t > F(9) && t < F(10) ? 1 : 0; const c = mauroCab(); camera(P, lado ? c[0] + 40 : 3700, lado ? c[1] + 80 : 690, lado ? 2.6 : 2.3); } },
  { de: 12, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); const c = mauroCab(); cena(P, t, { mauro: { ab: lerp(1, 0.75, ent(t, F(12), F(12) + 1)), cab: lerp(0, -6, ent(t, F(12), F(12) + 1)) } });
      const k = ent(t, F(13), F(14) + 1); camera(P, lerp(c[0] + 20, 3600, k), lerp(c[1] + 60, 700, k), lerp(3.1, 0.95, k)); } },
  { de: 15, svg: fora,
    quadro(tl, el, P, t, F) { carro(P, 2050); const guarda = ent(t, F(15), F(15) + 0.6); const vira = t > F(16); const g = P.q('#mauro .b-it'); if (g) g.style.display = guarda > 0.8 ? 'none' : '';
      cena(P, t, { mauro: { o: [-6, lerp(40, 10, guarda)], c: [10, lerp(50, 20, guarda)], d: vira ? -1 : 1, ol: [6, 0], ab: vira ? 0.75 : 1, boca: fala(t, F(17), F(17) + 1.4) * 0.6 } });
      const c = B.cabecaMundo(pose({ x: 3380, y: 980, s: 1.65, d: -1 })); const k = ent(t, F(16), F(17)); camera(P, lerp(3300, c[0] - 20, k), lerp(720, c[1] + 50, k), lerp(1.6, 3.3, k)); } },
  { de: 18, svg: fora,
    quadro(tl, el, P, t, F) { const vai = prog(t, F(18), F(18) + 1.2); const parte = E.in(prog(t, F(18) + 1.4, F(18) + 4)); carro(P, 2050 - parte * 2400);
      cena(P, t, { mauro: pose({ x: lerp(3380, 2100, vai), d: -1 }, vai < 1 ? ANDA(tl, 6, 0.7) : {}, { ab: 1 }), breno: pose({ x: lerp(2400, 2000, vai), d: -1 }), voce: { boca: 0, ab: 0.9 } });
      if (vai >= 1) { op(P.q('#mauro'), 0); op(P.q('#breno'), 0); } else { op(P.q('#mauro'), 1); op(P.q('#breno'), 1); }
      camera(P, lerp(2900, 2500, vai), 760, lerp(1.2, 1.0, vai)); } },
]);
}
