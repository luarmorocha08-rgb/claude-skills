/* c18 — "O motor". Primeira tentativa, nada; na segunda, pega. A esquina vazia; Cíntia vai junto; Mauro e Breno seguem atrás. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const painel = (pre) => `<rect x="-300" y="-300" width="2520" height="1680" fill="#1d2129"/><rect x="-300" y="-300" width="2520" height="520" fill="#a7c6dc" opacity=".5"/><path d="M-300,420 Q960,300 2220,420 L2220,1400 L-300,1400 Z" fill="#2b2f37" stroke="#141414" stroke-width="10"/>
  <circle cx="700" cy="640" r="150" fill="#14171d" stroke="#5e6670" stroke-width="10"/><circle cx="1180" cy="640" r="150" fill="#14171d" stroke="#5e6670" stroke-width="10"/><line class="ponteiro" x1="700" y1="640" x2="600" y2="700" stroke="#e74c3c" stroke-width="10"/>
  <g class="luzes">${[0, 1, 2, 3].map((i) => `<circle class="lz" cx="${880 + i * 50}" cy="840" r="14" fill="${['#e74c3c', '#f1c40f', '#2ecc71', '#3498db'][i]}" opacity=".15"/>`).join('')}</g>
  <g transform="translate(1500,860)"><circle r="60" fill="#3a3f48" stroke="#141414" stroke-width="8"/><g class="chaveIg"><circle cx="0" cy="-110" r="34" fill="none" stroke="#bdc3c7" stroke-width="12"/><rect x="-10" y="-80" width="20" height="80" fill="#bdc3c7"/></g></g>
  <g class="maoIg"><circle cx="1500" cy="740" r="80" fill="#141414"/></g>`;
const cruz = (pre) => EP4.cruzamento(pre, { semCorrente: true, semLanterna: true, veiculos: [[300, 1130, '#c0392b'], [820, 1170, '#7f8c8d'], [1950, 1150, '#ecf0f1'], [4320, 1180, '#2c3e50'], [2100, 1360, '#8e5ea2']],
  atores: elenco(['voce', 'leo', 'cintia', 'mauro', 'breno'], { leo: { item: Pr.ferramentas() }, cintia: { itemT: Pr.mochilinha() } }) });
const base = (P, t, ex = {}) => {
  p(P, 'voce', 'voce', pose({ x: 2700, y: 1260, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t, 1) }, ex.voce || {}));
  p(P, 'leo', 'leo', pose({ x: 2500, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 2) }, { o: [-6, 40], c: [10, 90] }, ex.leo || {}));
  p(P, 'cintia', 'cintia', pose({ x: -9999, y: 1260, s: 1.66, d: 1, ol: [6, 0], ab: pisca(t, 4) }, ex.cintia || {}));
  p(P, 'mauro', 'mauro', pose({ x: -9999, y: 1260, s: 1.75, d: 1, ab: pisca(t, 6) }, ex.mauro || {}));
  p(P, 'breno', 'breno', pose({ x: -9999, y: 1260, s: 1.72, d: 1, ab: pisca(t, 5) }, ex.breno || {})); };
const motor = (P, t, F) => { const liga = t > F(1) + 0.8; const v = liga ? Math.sin(t * 70) * 2 : 0; at(P.q('.pipaA'), 'transform', `translate(${3000 + v},${1150 + Math.abs(v) * 0.5}) scale(1.15)`); return liga; };
K.cenaN('c18', [
  { de: 0, svg: painel,
    quadro(tl, el, P, t, F) { const g1 = ent(t, F(0) - 0.3, F(0) + 0.2), v1 = ent(t, F(0) + 1.0, F(0) + 1.4); const g2 = ent(t, F(1) - 0.3, F(1) + 0.2); const liga = t > F(1) + 0.8;
      const ang = t < F(1) - 0.3 ? 60 * g1 * (1 - v1) : 60 * g2 * (liga ? 0.5 : 1); at(P.q('.chaveIg'), 'transform', `rotate(${ang})`);
      P.qa('.lz').forEach((l, i) => op(l, (t > F(0) - 0.2 && t < F(0) + 1.2) || (t > F(1) - 0.2 && !liga) ? 0.9 : liga ? (i === 2 ? 0.9 : 0.15) : 0.15));
      at(P.q('.ponteiro'), 'x2', liga ? 700 + Math.cos(-0.6 + Math.sin(t * 9) * 0.05) * 120 : 600); at(P.q('.ponteiro'), 'y2', liga ? 640 + Math.sin(-0.6) * 120 : 700);
      const vib = liga ? [Math.sin(t * 60) * 4, Math.cos(t * 53) * 3] : [0, 0]; camera(P, 1300, 760, lerp(1.6, 1.7, prog(t, F(0), F(2))), 0, [vib[0] + tremor(t, F(1) + 0.8, 10, 14, 4)[0], vib[1]]); } },
  { de: 2, svg: cruz,
    quadro(tl, el, P, t, F) { motor(P, t, F); base(P, t, { voce: { d: -1, ol: [6, 0], ab: 1.15 }, leo: { d: -1 } }); const k = ent(t, F(2), F(4) + 1);
      camera(P, lerp(2500, 1100, k), lerp(900, 820, k), lerp(1.4, 0.95, k)); } },
  { de: 5, svg: cruz,
    quadro(tl, el, P, t, F) { motor(P, t, F); const vem = ent(t, F(6) - 0.3, F(6) + 1.3); base(P, t, { leo: { o: [-6, 20], c: [10, 120] }, cintia: pose({ x: lerp(3200, 2900, vem), d: -1, boca: fala(t, F(8) + 1, F(10)) * 0.6 }, vem < 1 ? ANDA(tl, 5, 0.6) : {}), voce: { d: 1, boca: fala(t, F(8), F(9)) * 0.6 } });
      camera(P, lerp(2550, 2800, ent(t, F(6), F(6) + 1.2)), 900, lerp(1.9, 1.7, ent(t, F(6), F(6) + 1.2))); } },
  { de: 10, svg: cruz,
    quadro(tl, el, P, t, F) { motor(P, t, F); const vai = prog(t, F(10), F(11)); base(P, t, { voce: { x: -9999 }, leo: { x: -9999 }, mauro: pose({ x: lerp(2700, 2160, vai), d: -1 }, vai < 1 ? ANDA(tl, 5, 0.6) : {}), breno: pose({ x: lerp(2900, 2300, vai), d: -1 }, vai < 1 ? ANDA(tl + 0.4, 5, 0.6) : {}) });
      const entra = ent(t, F(11), F(11) + 0.8); op(P.q('#mauro'), 1 - entra); op(P.q('#breno'), 1 - entra); camera(P, lerp(2500, 2200, vai), 1000, 1.3); } },
  { de: 12, svg: cruz,
    quadro(tl, el, P, t, F) { const parte = E.in(prog(t, F(13), F(13) + 4)); at(P.q('.pipaA'), 'transform', `translate(${3000 + parte * 1400 + Math.sin(t * 70) * 2},1150) scale(1.15)`);
      at(P.q('.v4'), 'transform', `translate(${2100 + E.in(prog(t, F(13) + 1, F(13) + 5)) * 1500},1360)`); base(P, t, { voce: { x: -9999 }, leo: { x: -9999 } });
      camera(P, lerp(2900, 3400, prog(t, F(12), F(13) + 3)), 940, lerp(1.0, 0.9, prog(t, F(12), F(13) + 3))); } },
]);
}
