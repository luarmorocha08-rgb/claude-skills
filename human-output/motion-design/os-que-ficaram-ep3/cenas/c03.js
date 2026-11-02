/* c03 — "A avenida parada". */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3;
const av = (pre, extra = '') => EP3.avenida(pre, { atoresFundo: elenco(['voce', 'irma']) + extra });
const semBalanca = (P, t) => at(P.q('.sem-caixa'), 'transform', `translate(190,-626) rotate(${Math.sin(t * 1.6) * 7})`);
K.cenaN('c03', [
  { de: 0, svg: (pre) => av(pre),
    quadro(tl, el, P, t, F) { semBalanca(P, t); const k = prog(t, F(0), F(1) + 0.5); const x = lerp(200, 900, k);
      p(P, 'voce', 'voce', pose({ x, y: 980, s: 1.5, d: 1, cab: -6, ol: [6, -2] }, k < 1 ? ANDA(tl, 6, 0.7) : {}));
      p(P, 'irma', 'irma', pose({ x: x - 160, y: 980, s: 1.42, d: 1, ol: [6, -1] }, k < 1 ? ANDA(tl + 0.4, 6, 0.7) : {}));
      camera(P, lerp(900, 1150, prog(t, F(0), F(1))), 760, 0.85); } },
  { de: 1, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#e2b13c"/><rect x="300" y="100" width="560" height="980" fill="#2b2e34" stroke="#141414" stroke-width="10"/>
      <rect x="1000" y="160" width="700" height="360" fill="#5b6b80" stroke="#141414" stroke-width="10"/><rect x="1060" y="600" width="520" height="140" rx="20" fill="#3d6fa8" stroke="#141414" stroke-width="6"/><rect x="1060" y="720" width="520" height="40" fill="#2f5a8a"/>
      <g transform="translate(1320,600)"><path d="M-80,0 L-90,-120 L90,-120 L80,0 Z" fill="#c0392b" stroke="#141414" stroke-width="6"/><path d="M-50,-120 Q0,-190 50,-120" fill="none" stroke="#141414" stroke-width="6"/></g>
      <rect x="-200" y="-200" width="2320" height="1480" fill="#203050" opacity=".18" style="mix-blend-mode:multiply"/>`,
    quadro(tl, el, P, t, F) { camera(P, lerp(900, 1250, ent(t, F(1), F(1) + 2.5)), 560, lerp(1.0, 1.2, prog(t, F(1), F(2)))); } },
  { de: 2, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="url(#${pre}-ceuDia)"/><g class="sem" transform="translate(700,1300)"><g transform="scale(1.6)">${'<rect x="-8" y="-640" width="16" height="640" fill="#2b2e34"/><rect x="-8" y="-640" width="220" height="14" fill="#2b2e34"/>'}<g class="sem-caixa" transform="translate(190,-626)"><rect x="-22" y="0" width="44" height="120" rx="8" fill="#1b1d22" stroke="#141414" stroke-width="4"/>${[22, 60, 98].map((y) => `<circle cy="${y}" r="13" fill="#3a3f48"/>`).join('')}</g></g></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.sem-caixa'), 'transform', `translate(190,-626) rotate(${Math.sin(t * 1.6) * 9})`); camera(P, 1000, 400, lerp(1.0, 1.08, prog(t, F(2), F(3)))); } },
  { de: 3, svg: (pre) => av(pre),
    quadro(tl, el, P, t, F) { semBalanca(P, t); const pensa = ent(t, F(4), F(4) + 1);
      p(P, 'voce', 'voce', pose({ x: 1900, y: 980, s: 1.5, d: 1, cab: -4, ol: [7, -1], ab: pisca(t) }, { o: [-6, lerp(10, 90, ent(t, F(3) + 1.5, F(3) + 2.2)) * (1 - pensa) + 10 * pensa], c: [10, -6] }));
      p(P, 'irma', 'irma', pose({ x: 1740, y: 980, s: 1.42, d: 1, ol: [6, 0] }));
      camera(P, lerp(2000, 2700, ent(t, F(3) + 0.5, F(3) + 3)), 760, lerp(0.9, 0.85, prog(t, F(3), F(5)))); } },
  { de: 5, svg: (pre) => av(pre),
    quadro(tl, el, P, t, F) { const seg = ent(t, F(6), F(6) + 0.5);
      p(P, 'voce', 'voce', pose({ x: 1900, y: 980, s: 1.5, d: 1, cab: -2, ol: [7, -1], ab: 1.3, medo: ent(t, F(5), F(5) + 0.4) * 0.8 }));
      p(P, 'irma', 'irma', pose({ x: lerp(1740, 1800, seg), y: 980, s: 1.42, d: 1, ol: [7, -1], ab: 1.3 }, { o: [-6, lerp(10, 80, seg)], c: [10, 0] }));
      camera(P, 1860, 760, lerp(2.0, 2.2, prog(t, F(5), F(7))), 0, [ruido(t * 4, 1) * 2, 0]); } },
  { de: 7, svg: (pre) => av(pre, `<g class="rastG">${RAST.svg(pre)}</g><polygon class="feixe" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`),
    quadro(tl, el, P, t, F) { const k = prog(t, F(7), F(8)); const para = t > F(8); const x = lerp(4200, 2450, E.out(k));
      RAST.posar(P.q('.rastG'), x, 1060, 1.15, para ? 0 : (t - F(7)) * 3, 330, 1);
      const inc = ent(t, F(8), F(8) + 0.8); at(P.q('.rastG .r-corpo'), 'transform', `translate(${-inc * 30},${-330 + inc * 60}) rotate(${-inc * 12})`);
      const ox = x - inc * 30, oy = 1060 - 1.15 * (330 - inc * 60); const alvo = lerp(2250, 2650, (Math.sin((t - F(8)) * 3) + 1) / 2);
      at(P.q('.feixe'), 'points', `${ox},${oy} ${alvo - 60},1060 ${alvo + 60},1060`); op(P.q('.feixe'), para ? 0.85 : 0);
      p(P, 'voce', 'voce', pose({ x: 1900, y: 980, s: 1.5, d: 1, ab: 1.3, medo: 0.6 })); p(P, 'irma', 'irma', pose({ x: 1800, y: 980, s: 1.42, d: 1, ab: 1.3 }));
      camera(P, lerp(2500, 2300, k), 720, 0.8); } },
  { de: 9, svg: (pre) => av(pre),
    quadro(tl, el, P, t, F) { const ab = ent(t, F(9), F(9) + 0.5);
      p(P, 'voce', 'voce', K.mistura(pose({ x: 1900, y: 980, s: 1.5, d: 1, ab: 1.3 }), pose({ x: 1900, y: 980, s: 1.5, d: 1, ab: 1.3, medo: 0.7 }, AG), ab));
      p(P, 'irma', 'irma', K.mistura(pose({ x: 1790, y: 980, s: 1.42, d: 1, ab: 1.3 }), pose({ x: 1790, y: 980, s: 1.42, d: 1, ab: 1.3 }, AG), ab));
      camera(P, 1860, 900, lerp(2.0, 2.3, ab)); } },
  { de: 10, svg: (pre) => EP3.mapa3(pre) + `<g class="mao"><circle r="44" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 1600 * (1 - ent(t, F(11), F(12) + 2)));
      op(P.q('.mCaminhao'), ent(t, F(14), F(14) + 0.4)); const dobra = E.in(prog(t, F(14) + 2.0, F(14) + 3.0));
      P.cam.parentNode; at(P.q('.mao'), 'transform', `translate(${lerp(1135, 960, ent(t, F(14), F(14) + 0.5))},${lerp(560, 640, ent(t, F(14), F(14) + 0.5))})`); op(P.q('.mao'), t > F(11) && t < F(14) + 1.6 ? 1 : 0);
      camera(P, 960, 540, lerp(1.0, 1.05, prog(t, F(10), F(14))) * (1 - dobra * 0.5), dobra * 6);
      op(P.preto, dobra); } },
  { de: 14, off: 3.1, svg: (pre) => EP2.ruaLado(pre, { luz: 'manha', esquinas: [2000] }) + elenco(['voce', 'irma']),
    quadro(tl, el, P, t, F) { const k = prog(tl, 0, 3); const x = lerp(1300, 2050, k);
      p(P, 'irma', 'irma', pose({ x: x + 120, y: 980, s: 1.42, d: 1, ol: [6, 0] }, ANDA(tl, 6, 0.8))); p(P, 'voce', 'voce', pose({ x, y: 980, s: 1.5, d: 1, ol: [6, 0] }, ANDA(tl + 0.4, 6, 0.8)));
      camera(P, 1800, 740, 1.1); } },
]);
}
