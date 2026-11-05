/* c21 — "A água chega". O reservatório sobe, a torneira corre, Rosa e a cadeira, Bia e o lápis amarelo que Léo lembrou. */
{
const { E, camera, op, at, prog, lerp } = K; const { pose, ANDA, SC, AG, fala, pisca, elenco, p, ent } = H3;
const serv = (pre) => EP3.servico(pre, { balde: true, atores: elenco(['joel', 'voce', 'mulher:cz']) + `<path class="mangR" d="M2300,600 C2100,600 2050,420 1920,420" fill="none" stroke="#2f7a3a" stroke-width="22"/>` });
const quadra = (pre) => EP3.quadra(pre, { atores: elenco(['rosa', 'leo', 'voce', 'davi', 'bia', 'irma'], { davi: { item: Pr.garrafa() } }) });
K.cenaN('c21', [
  { de: 0, svg: quadra,
    quadro(tl, el, P, t, F) { const k = prog(t, F(0), F(1)); p(P, 'voce', 'voce', pose({ x: lerp(1500, 2200, k), y: 990, s: 1.7, d: 1, ol: [6, 1], ab: 0.9 }, k < 1 ? ANDA(tl, 5, 0.6) : {}));
      ['rosa', 'leo', 'davi', 'bia', 'irma'].forEach((n) => p(P, n, n, pose({ x: -9999, y: 990 }))); camera(P, lerp(1700, 2200, k), 640, 1.0); } },
  { de: 1, svg: serv,
    quadro(tl, el, P, t, F) { const sobe = prog(t, F(1), F(3) + 1); at(P.q('.nivel'), 'y', lerp(700, 470, sobe)); at(P.q('.nivel'), 'height', lerp(146, 376, sobe)); op(P.q('.marca2'), 1);
      p(P, 'joel', 'joel', pose({ x: 1150, y: 990, s: 1.75, d: 1, ol: [6, -3], ab: pisca(t), cab: -6 })); p(P, 'voce', 'voce', pose({ x: -9999, y: 990 })); p(P, 'cz', 'mulher', pose({ x: -9999, y: 990 }));
      camera(P, lerp(1450, 1550, prog(t, F(1), F(3))), lerp(640, 560, prog(t, F(1), F(3))), lerp(1.1, 1.5, prog(t, F(1), F(3)))); } },
  { de: 3, svg: serv,
    quadro(tl, el, P, t, F) { op(P.q('.fio'), 1); at(P.q('.fio'), 'd', `M630,548 L${630 + Math.sin(t * 30)},${800}`); at(P.q('.fio'), 'stroke-width', 14);
      p(P, 'cz', 'mulher', pose({ x: 820, y: 990, s: 1.62, d: -1, ol: [6, 2], boca: fala(t, F(3) + 1.5, F(3) + 2.6), ab: 0.6 })); p(P, 'joel', 'joel', pose({ x: -9999, y: 990 }));
      p(P, 'voce', 'voce', pose({ x: 1100, y: 990, s: 1.7, d: -1, ol: [6, 1], ab: t > F(4) ? 0.7 : 1 }));
      const pv = pose({ x: 1100, y: 990, s: 1.7, d: -1 }); const c = B.cabecaMundo(pv); const k = ent(t, F(4), F(4) + 1.5); camera(P, lerp(850, c[0], k), lerp(700, c[1] + 60, k), lerp(1.5, 3.2, k)); } },
  { de: 5, svg: quadra,
    quadro(tl, el, P, t, F) { const senta = ent(t, F(7) + 0.6, F(7) + 1.4); const ap = ent(t, F(7), F(7) + 0.5);
      p(P, 'rosa', 'rosa', pose({ x: 3880, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t), boca: fala(t, F(5), F(6)) * 0.6 }, { o: [-6, 80], c: [10, 0] }));
      p(P, 'leo', 'leo', K.mistura(pose({ x: 4080, y: 990, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 2), boca: fala(t, F(6), F(7)) * 0.6 }, { o: [-6, 40], c: [10, 90] }), pose({ x: 4080, y: 990, s: 1.7, d: -1 }, SC, { o: [-6, 40], c: [10, 90] }), senta));
      p(P, 'voce', 'voce', pose({ x: 4300, y: 990, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 3) }, { o: [-6, lerp(10, 95, ap)], c: [10, 0] }));
      ['davi', 'bia', 'irma'].forEach((n) => p(P, n, n, pose({ x: -9999, y: 990 }))); camera(P, 4080, 680, lerp(1.6, 1.75, prog(t, F(5), F(8)))); } },
  { de: 8, svg: quadra,
    quadro(tl, el, P, t, F) { const corre = E.out(prog(t, F(8), F(9))); const abr = t > F(9) - 0.2; const mostra = ent(t, F(10), F(10) + 0.5); const fecha = t > F(12) && t < F(13) + 1.5;
      p(P, 'bia', 'bia', pose({ x: lerp(4900, 5340, corre), y: 990, s: 1.1, d: 1, ol: [6, abr ? -6 : 0], ab: pisca(t, 4), boca: fala(t, F(9), F(9) + 1.4) * 0.5 + fala(t, F(11), F(12)) * 0.5 }, corre < 1 ? ANDA(tl, 9, 1) : { o: [-6, 100], c: [10, 40] }));
      p(P, 'davi', 'davi', pose({ x: 5470, y: 990, s: 1.75, d: -1, ol: [6, 3], ab: fecha ? 0.08 : pisca(t, 2), cab: 8 }, { o: [-6, lerp(40, 100, mostra)], c: [10, lerp(60, -10, mostra)] }));
      ['rosa', 'leo', 'voce', 'irma'].forEach((n) => p(P, n, n, pose({ x: -9999, y: 990 })));
      const k = ent(t, F(12), F(12) + 1); camera(P, lerp(5300, 5430, k), lerp(720, 620, k), lerp(1.8, 3.0, k)); } },
  { de: 14, svg: (pre) => EP4.maos(pre, { fundo: '#d9d2c0', obj: `<g class="lapisG">${Pr.lapis()}</g>` }),
    quadro(tl, el, P, t, F) { const sai = ent(t, F(14), F(14) + 1); const dá = ent(t, F(15) + 0.5, F(16)); at(P.q('.lapisG'), 'transform', `translate(${lerp(500, 1100, dá)},${lerp(lerp(900, 560, sai), 540, dá)}) scale(6) rotate(${lerp(-30, 0, dá)})`);
      at(P.q('.mA'), 'transform', `translate(${lerp(440, 1050, dá)},${lerp(lerp(980, 640, sai), 620, dá)})`); op(P.q('.mB'), t > F(16) - 0.4 ? 1 : 0); at(P.q('.mB'), 'transform', `translate(1250,${lerp(800, 600, ent(t, F(16) - 0.4, F(16)))}) scale(.75)`);
      camera(P, lerp(700, 1050, dá), 600, lerp(1.0, 1.15, dá)); } },
  { de: 17, svg: quadra,
    quadro(tl, el, P, t, F) { p(P, 'bia', 'bia', pose({ x: 5340, y: 990, s: 1.1, d: 1, ol: [3, 5], cab: 14, ab: 1.1 }, { o: [-6, 50], c: [10, 90], item: Pr.lapis() }));
      p(P, 'davi', 'davi', pose({ x: 5470, y: 990, s: 1.75, d: -1, ol: [-7, 0], ab: 0.8, cab: -6 })); p(P, 'leo', 'leo', pose({ x: 5180, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, { o: [-6, 40], c: [10, 90] }));
      ['rosa', 'voce', 'irma'].forEach((n) => p(P, n, n, pose({ x: -9999, y: 990 }))); camera(P, 5330, 700, lerp(2.0, 2.15, prog(t, F(17), F(17) + 4))); } },
]);
}
