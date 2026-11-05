/* c01 — "O copo". Amanhecer na área de serviço da escola: a torneira, a fila, a irmã entrega o mapa. */
{
const { E, camera, op, at, prog, lerp, ruido } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const PAPEL = `<g transform="rotate(-10)"><rect x="-18" y="-13" width="36" height="26" fill="#f3ead2" stroke="#141414" stroke-width="3"/><line x1="0" y1="-13" x2="0" y2="13" stroke="#c9b98f" stroke-width="2"/></g>`;
const fila = ['mulher:m1', 'homem:h1', 'senhor:s1', 'mulher:m2'];
const serv = (pre) => EP3.servico(pre, { balde: true, atores: `<g class="porta4"><rect x="3350" y="420" width="240" height="460" fill="#8d6e4c" stroke="#5a4636" stroke-width="6"/><rect x="3380" y="450" width="180" height="120" fill="#e9c79a" opacity=".7"/></g>` + elenco(['helena', 'voce', 'davi', 'leo', ...fila, 'crianca:k1'], { helena: { item: Pr.caneca() } })
  + `<g class="recips">${[0, 1, 2, 3, 4, 5].map((i) => `<g transform="translate(${1500 + i * 70},880) scale(1.2)">${Pr.recipiente(['#3f8fd6', '#5dade2', '#e67e22', '#3f8fd6', '#16a085', '#5dade2'][i])}</g>`).join('')}</g>` });
const amanhecer = (P) => { op(P.q('.sv-tarde'), 0.35); op(P.q('.reservatorio'), 0); };
const pFila = (P, t, dx = 0) => fila.forEach((n, i) => { const [nome, id] = n.split(':'); p(P, id, nome, pose({ x: 1100 + i * 170 + dx, y: 990, s: 1.62, d: -1, ab: pisca(t, i + 2), cab: Math.sin(t * 0.7 + i) * 4 })); });
const crianca = (P, mx, my) => p(P, 'k1', 'crianca', pose({ x: mx - 30, y: 893, s: 0.75, d: -1, chao: 0, alt: 0, q: [70, 80], j: [80, 90], o: [60, 40], c: [40, 40] }));
K.cenaN('c01', [
  { de: 0, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { amanhecer(P); op(P.q('.fio'), 0.9); at(P.q('.fio'), 'd', 'M630,548 L630,760');
      p(P, 'helena', 'helena', pose({ x: 760, y: 990, s: 1.7, d: -1, ol: [6, 3], cab: 8 }, { o: [-6, 70], c: [10, 40] }));
      pFila(P, t); crianca(P, 1100 - 20, 990 - 330);
      p(P, 'voce', 'voce', pose({ x: 2300, y: 990, s: 1.7, d: -1, ol: [6, 0] })); p(P, 'davi', 'davi', { x: -9999, y: 0 }); p(P, 'leo', 'leo', { x: -9999, y: 0 });
      camera(P, lerp(1500, 1250, prog(t, F(0), F(1))), 640, lerp(0.8, 0.9, prog(t, F(0), F(1)))); } },
  { de: 1, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { amanhecer(P); const fecha = t > F(1) + 1.2; op(P.q('.fio'), fecha ? 0 : 0.9); at(P.q('.fio'), 'd', 'M630,548 L630,700');
      p(P, 'helena', 'helena', pose({ x: 760, y: 990, s: 1.7, d: -1, ol: [6, 3], cab: 10 }, { o: [-6, 76], c: [10, fecha ? 30 : 46] }));
      pFila(P, t); crianca(P, 1080, 660); p(P, 'voce', 'voce', { x: -9999, y: 0 }); p(P, 'davi', 'davi', { x: -9999, y: 0 }); p(P, 'leo', 'leo', { x: -9999, y: 0 });
      camera(P, 660, 620, lerp(2.4, 2.6, prog(t, F(1), F(2)))); } },
  { de: 2, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { amanhecer(P); const dá = ent(t, F(2), F(2) + 1.2); const pan = ent(t, F(3) - 0.3, F(3) + 2);
      p(P, 'helena', 'helena', pose({ x: 820, y: 990, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t) }, { o: [-6, lerp(50, 90, dá)], c: [10, lerp(40, -4, dá)] }));
      p(P, 'm1', 'mulher', pose({ x: 1060, y: 990, s: 1.62, d: -1, ol: [5, 0], ab: pisca(t, 3), item: '' }, { o: [-6, lerp(20, 70, dá)], c: [10, 10] }));
      crianca(P, 1030, 670); fila.slice(1).forEach((n, i) => { const [nome, id] = n.split(':'); p(P, id, nome, pose({ x: 1300 + i * 190, y: 990, s: 1.62, d: -1, ab: pisca(t, i + 4), cab: 6 })); });
      p(P, 'voce', 'voce', { x: -9999, y: 0 }); p(P, 'davi', 'davi', { x: -9999, y: 0 }); p(P, 'leo', 'leo', { x: -9999, y: 0 });
      camera(P, lerp(940, 1500, pan), 680, lerp(1.7, 1.25, pan)); } },
  { de: 4, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { amanhecer(P); const vira = ent(t, F(4), F(4) + 0.8); pFila(P, t, -9999);
      p(P, 'voce', 'voce', pose({ x: 2700, y: 990, s: 1.7, d: vira > 0.5 ? 1 : -1, ol: [6, 0], ab: pisca(t) }));
      p(P, 'davi', 'davi', pose({ x: 3300, y: 990, s: 1.75, d: -1, ol: [5, 0], ab: pisca(t, 2) }, { o: [-6, 20], c: [10, 30] }));
      p(P, 'leo', 'leo', pose({ x: 3500, y: 990, s: 1.7, d: -1, ol: [5, 0], ab: pisca(t, 3), cab: -4 }));
      p(P, 'helena', 'helena', { x: -9999, y: 0 });
      camera(P, lerp(2800, 3150, ent(t, F(4) + 0.6, F(5))), 680, lerp(1.05, 1.15, prog(t, F(4), F(5)))); } },
  { de: 5, svg: (pre) => serv(pre),
    quadro(tl, el, P, t, F) { amanhecer(P); pFila(P, t); crianca(P, 1080, 660); const olha = t > F(6) ? -1 : 1;
      const pv = pose({ x: 2300, y: 990, s: 1.7, d: olha, ol: [6, 1], ab: 0.9 * pisca(t) }); p(P, 'voce', 'voce', pv);
      p(P, 'helena', 'helena', pose({ x: 760, y: 990, s: 1.7, d: -1 })); p(P, 'davi', 'davi', { x: -9999, y: 0 }); p(P, 'leo', 'leo', { x: -9999, y: 0 });
      const c = B.cabecaMundo(pv); const k = ent(t, F(6), F(6) + 1.6);
      camera(P, lerp(c[0], 1700, k), lerp(c[1] + 60, 800, k), lerp(3.0, 1.4, k)); } },
  { de: 7, svg: (pre) => EP3.quadra(pre, { atores: elenco(['voce', 'irma'], { irma: { item: PAPEL } }) }),
    quadro(tl, el, P, t, F) { op(P.q('.q-noite'), 0.3); const dá = ent(t, F(7), F(7) + 1.2);
      p(P, 'irma', 'irma', pose({ x: 1500, y: 990, s: 1.62, d: 1, ol: [6, 0], ab: pisca(t), boca: fala(t, F(8), F(9)) * 0.6 }, { o: [-6, lerp(20, 80, dá)], c: [10, lerp(60, 0, dá)] }));
      p(P, 'voce', 'voce', pose({ x: 1720, y: 990, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 2), boca: fala(t, F(9), F(10)) * 0.6 }, { o: [-6, lerp(10, 70, dá)], c: [10, 10] }));
      camera(P, 1610, 680, lerp(1.6, 1.85, prog(t, F(7), F(10)))); } },
  { de: 10, svg: (pre) => EP4.maos(pre, { fundo: '#b9b1a0', obj: `<g class="papelG" transform="translate(960,560) rotate(-6)"><rect x="-220" y="-140" width="440" height="280" fill="#f3ead2" stroke="#141414" stroke-width="8"/><path d="M-160,60 L-40,-10 L60,20 L170,-80" stroke="#1e6fd6" stroke-width="12" fill="none" stroke-dasharray="26 16"/><line x1="0" y1="-140" x2="0" y2="140" stroke="#c9b98f" stroke-width="5"/></g>` }),
    quadro(tl, el, P, t, F) { const solta = ent(t, F(10) + 1.6, F(10) + 2.2);
      at(P.q('.mA'), 'transform', `translate(${lerp(760, 560, solta)},${lerp(600, 680, solta)})`); op(P.q('.mB'), 1); at(P.q('.mB'), 'transform', 'translate(1170,520)');
      at(P.q('.papelG'), 'transform', `translate(${lerp(960, 1010, solta)},560) rotate(${lerp(-6, -2, solta)})`);
      camera(P, 960, 560, lerp(1.0, 1.08, prog(t, F(10), F(11)))); } },
]);
}
