/* c01 — "Antes de abrir a porta". Planos presos às frases (F(i) = início da frase i). */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, SC, fala, pisca, elenco, p, ent } = H3;
const bolsa = `<g transform="translate(0,6) scale(.5)"><path d="M-40,0 L-46,-90 L46,-90 L40,0 Z" fill="#c9b18a" stroke="#141414" stroke-width="8"/><path d="M-30,-90 Q0,-150 30,-90" fill="none" stroke="#141414" stroke-width="7"/></g>`;
const casa = (P, k) => { op(P.q('.int-noite'), lerp(0.85, 0.45, k)); op(P.q('.int-tarde'), 0.25 * k); op(P.q('.int-canecaMesa'), 0); op(P.q('.int-celMesa'), 0); op(P.q('.int-fruteira'), 0); op(P.q('.vista-nave'), 0); op(P.q('.int-suprimentos'), 1); op(P.q('.int-powerbank'), 0); op(P.q('.int-g2'), 0); };
K.cenaN('c01', [
  { de: 0, svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: elenco(['voce', 'irma']) }),
    quadro(tl, el, P, t, F) { const k = ent(t, F(1), F(2)); casa(P, k);
      p(P, 'voce', 'voce', pose({ x: 1120, y: 990, d: 1, cab: lerp(10, -12, k), ol: [4, lerp(2, -4, k)], ab: pisca(t) }, SC));
      p(P, 'irma', 'irma', pose({ x: 1660, y: 990, d: -1, cab: 8, ol: [4, 2], ab: pisca(t, 2) }, SC));
      camera(P, lerp(1300, 1100, k), lerp(640, 560, k), lerp(1.4, 1.25, k)); } },
  { de: 2, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#2a1a10"/><ellipse cx="960" cy="540" rx="900" ry="600" fill="url(#${pre}-glowQ)" opacity=".3"/><g transform="translate(960,600)">${EP2.radio(pre)}</g>`,
    quadro(tl, el, P, t, F, Fe) { const voz = t > F(2) + 0.4 && t < F(4);
      const tx = P.q('.r-txt'); tx.textContent = t < F(2) + 0.4 || t >= F(4) ? (Math.floor(t * 12) % 2 ? '— — —' : '· · ·') : t < F(3) + 1.5 ? 'ESCOLA MUNICIPAL' : t < F(3) + 3.2 ? 'ENTRADA: QUADRA' : 'COBERTORES • RECIPIENTES';
      at(tx, 'font-size', 32); op(P.q('.r-onda'), voz ? 0.5 + 0.5 * Math.sin(t * 9) : 0); at(P.q('.r-onda'), 'transform', 'translate(-40,0)');
      at(P.q('.r-agulha'), 'x', 250 + Math.sin(t * 2) * 6); at(P.q('.r-botao'), 'transform', 'translate(330,120) rotate(200)');
      camera(P, lerp(1050, 1160, ent(t, F(2), F(2) + 1)), lerp(560, 470, ent(t, F(2), F(2) + 1)), lerp(1.1, 1.6, ent(t, F(2), F(2) + 1)), 0, voz ? [0, 0] : [ruido(t * 10, 1) * 2, 0]); } },
  { de: 5, svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: elenco(['voce', 'irma'], { voce: { itemT: bolsa }, irma: { item: Pr.garrafa() } }) }),
    quadro(tl, el, P, t, F) { casa(P, 1); const da = Math.sin(Math.PI * prog(t, F(5) + 0.3, F(5) + 2.0));
      p(P, 'voce', 'voce', pose({ x: 1250, y: 990, d: 1, cab: 10, ol: [5, 3], ab: pisca(t) }, { o: [20, 10], c: [30, 20] }));
      p(P, 'irma', 'irma', pose({ x: 1520, y: 990, d: -1, cab: 12, ol: [4, 3], lean: da * 10 }, { o: [-6, lerp(30, 85, da)], c: [10, 20] }));
      op(P.q('#irma .b-it'), t < F(5) + 1.4 ? 1 : 0);
      camera(P, 1380, 640, lerp(1.7, 1.8, prog(t, F(5), F(7)))); } },
  { de: 7, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#3a2a20"/><g filter="url(#${pre}-desf)" opacity=".4"><rect x="300" y="100" width="600" height="500" fill="#f2c79a"/></g>
      <g class="cel">${CEL.svg(UI.bloqueio({ hora: '5:42', data: 'segunda, 3 de novembro', notifs: [] }) + `<g transform="translate(0,-130)"><rect x="-200" y="-40" width="400" height="80" rx="40" fill="#e5484d" opacity=".9"/>${txt(0, 12, 'SEM SERVIÇO', { f: 'Anton', t: 36, a: 'middle' })}</g>`, { id: 'c1cel' })}</g>`,
    quadro(tl, el, P, t, F) { const guarda = E.in(prog(t, F(9) + 0.5, F(9) + 1.4));
      at(P.q('.cel'), 'transform', `translate(960,${560 + guarda * 900}) rotate(${-3 + guarda * 10}) scale(.88)`);
      camera(P, 960, 560, lerp(1.0, 1.1, prog(t, F(7), F(10)))); } },
  { de: 10, svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: elenco(['voce', 'irma'], { irma: { item: `<g transform="translate(6,-6)"><rect x="-14" y="-18" width="28" height="36" rx="2" fill="#2c3e50" stroke="#141414" stroke-width="3"/><rect class="fotoN" x="-10" y="-14" width="20" height="16" fill="#f4f1ea"/></g>` } }) }) + `<rect class="fotoGel" x="110" y="590" width="44" height="40" fill="#f4f1ea" stroke="#141414" stroke-width="2"/>`,
    quadro(tl, el, P, t, F) { casa(P, 1); const k = ent(t, F(10), F(10) + 1.6); const fecha = ent(t, F(11) + 0.4, F(11) + 3.2);
      op(P.q('.fotoGel'), t < F(10) + 1.2 ? 1 : 0);
      p(P, 'irma', 'irma', pose({ x: lerp(450, 300, k), y: 990, d: -1, cab: 14, ol: [4, 4], ab: lerp(1, 0.75, fecha) }, { o: [-6, lerp(140, 60, k)], c: [10, lerp(-10, 70, k)] }));
      p(P, 'voce', 'voce', pose({ x: 1120, y: 990, d: -1, cab: lerp(4, -2, fecha), ol: [lerp(5, -2, fecha), 0], ab: pisca(t) }, SC));
      camera(P, lerp(500, 700, prog(t, F(10), F(12))), 600, lerp(1.6, 1.4, prog(t, F(10), F(12)))); } },
]);
}
