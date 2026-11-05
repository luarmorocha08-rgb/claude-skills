/* c17 — "Abrir caminho". A água sai do tanque para os recipientes; o carro que bloqueia é empurrado; Davi sobe na cabine. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3;
const AGUA = `<g class="jato"><path class="jatoP" d="M2700,1080 Q2720,1160 2720,1230" fill="none" stroke="#9fd3f7" stroke-width="16" stroke-linecap="round" opacity=".85"/><rect x="2680" y="1062" width="40" height="22" rx="4" fill="#5e6670" stroke="#141414" stroke-width="3"/></g>`;
const RECS = `<g class="recsC">${[0, 1, 2, 3].map((i) => `<g class="rcx rcx${i}" transform="translate(${2720 - i * 90},1262) scale(1.5)">${Pr.recipiente(['#3f8fd6', '#5dade2', '#e67e22', '#16a085'][i])}</g>`).join('')}</g>`;
const cruz = (pre, o = {}) => EP4.cruzamento(pre, Object.assign({ semCorrente: true, veiculos: [[300, 1130, '#c0392b'], [820, 1170, '#7f8c8d'], [1950, 1150, '#ecf0f1'], [3720, 1180, '#2c3e50'], [4600, 1150, '#e0a43a']], atores: AGUA + RECS + elenco(['voce', 'mulher:m1', 'crianca:k1', 'cintia', 'leo', 'davi', 'nando', 'breno', 'homem:h1'], { breno: { item: Pr.bastao() } }) }, o));
const base = (P, t, ex = {}) => {
  p(P, 'voce', 'voce', pose({ x: 2560, y: 1260, s: 1.7, d: 1, ol: [6, 0], ab: pisca(t, 1) }, ex.voce || {}));
  const xm = ex.m1 && ex.m1.x !== undefined ? ex.m1.x : 2300; p(P, 'm1', 'mulher', pose({ x: xm, y: 1260, s: 1.62, d: 1, ol: [6, 0], ab: pisca(t, 8) }, ex.m1 || {}));
  p(P, 'k1', 'crianca', pose({ x: xm + 30, y: 1163, s: 0.75, d: 1, chao: 0, alt: 0, q: [70, 80], j: [80, 90], o: [60, 40], c: [40, 40] }));
  p(P, 'cintia', 'cintia', pose({ x: 2860, y: 1260, s: 1.66, d: -1, ol: [6, 0], ab: pisca(t, 4) }, ex.cintia || {}));
  p(P, 'leo', 'leo', pose({ x: -9999, y: 1260, s: 1.7, d: 1, ab: pisca(t, 5) }, ex.leo || {}));
  p(P, 'davi', 'davi', pose({ x: -9999, y: 1260, s: 1.75, d: 1, ab: pisca(t, 3) }, ex.davi || {}));
  p(P, 'nando', 'nando', pose({ x: -9999, y: 1260, s: 1.7, d: 1, ab: pisca(t, 2), lean: 6 }, ex.nando || {}));
  p(P, 'h1', 'homem', pose({ x: -9999, y: 1260, s: 1.68, d: 1, ab: pisca(t, 9) }, ex.h1 || {}));
  p(P, 'breno', 'breno', pose({ x: 3250, y: 1260, s: 1.72, d: -1, ol: [6, 0], ab: pisca(t, 6) }, H4.BRACOS, ex.breno || {})); };
const jato = (P, t, on) => { op(P.q('.jato'), on ? 1 : 0); at(P.q('.jatoP'), 'd', `M2700,1080 Q${2720 + Math.sin(t * 20) * 4},1160 2720,1230`); };
const painel = (pre) => `<rect x="-300" y="-300" width="2520" height="1680" fill="#1d2129"/><rect x="-300" y="-300" width="2520" height="520" fill="#a7c6dc" opacity=".5"/><path d="M-300,420 Q960,300 2220,420 L2220,1400 L-300,1400 Z" fill="#2b2f37" stroke="#141414" stroke-width="10"/>
  <circle cx="700" cy="640" r="150" fill="#14171d" stroke="#5e6670" stroke-width="10"/><circle cx="1180" cy="640" r="150" fill="#14171d" stroke="#5e6670" stroke-width="10"/><line class="ponteiro" x1="700" y1="640" x2="600" y2="700" stroke="#e74c3c" stroke-width="10"/>
  <g class="luzes">${[0, 1, 2, 3].map((i) => `<circle class="lz" cx="${880 + i * 50}" cy="840" r="14" fill="${['#e74c3c', '#f1c40f', '#2ecc71', '#3498db'][i]}" opacity=".15"/>`).join('')}</g>
  <g transform="translate(1500,860)"><circle r="60" fill="#3a3f48" stroke="#141414" stroke-width="8"/><rect x="-10" y="-30" width="20" height="60" rx="4" fill="#14171d"/><g class="chaveIg"><circle cx="0" cy="-110" r="34" fill="none" stroke="#bdc3c7" stroke-width="12"/><rect x="-10" y="-80" width="20" height="80" fill="#bdc3c7"/></g></g>
  <g class="maoIg"><circle cx="1500" cy="740" r="80" fill="#141414"/></g>`;
K.cenaN('c17', [
  { de: 0, svg: (pre) => cruz(pre),
    quadro(tl, el, P, t, F) { jato(P, t, true); const sai = ent(t, F(1), F(1) + 2); [0, 1, 2, 3].forEach((i) => at(P.q('.rcx' + i), 'transform', `translate(${2720 - i * 90},1262) scale(1.5)`));
      base(P, t, { voce: pose({ x: 2600 }, AG, { o: [10, 80], c: [40, 0] }), m1: pose({ x: lerp(2380, 2000, sai), d: sai > 0.05 ? -1 : 1, boca: fala(t, F(1), F(1) + 0.8) * 0.5 }, sai > 0.05 && sai < 1 ? ANDA(tl, 5, 0.5) : {}) });
      camera(P, lerp(2600, 2500, prog(t, F(0), F(2))), 1000, lerp(1.9, 1.6, prog(t, F(0), F(2)))); } },
  { de: 2, svg: (pre) => cruz(pre),
    quadro(tl, el, P, t, F) { jato(P, t, true); base(P, t, { m1: { x: -9999 }, leo: { x: 2100, d: 1 }, h1: { x: 2260, d: 1 }, voce: pose({ x: 2600 }, AG, { o: [10, 80], c: [40, 0] }), cintia: { o: [-6, 50], c: [10, 40] } });
      const k = ent(t, F(3), F(5)); camera(P, lerp(2500, 3080, k), lerp(900, 880, k), lerp(1.05, 1.7, k)); } },
  { de: 6, svg: (pre) => cruz(pre),
    quadro(tl, el, P, t, F) { jato(P, false); base(P, t, { m1: { x: -9999 }, voce: { x: 2900, d: 1 }, davi: { x: 3350, d: 1, cab: 8, ol: [6, 3] }, breno: { x: -9999 }, cintia: { x: -9999 } });
      const k = ent(t, F(7), F(7) + 1.4); camera(P, lerp(3300, 3700, k), lerp(900, 1000, k), lerp(1.5, 1.6, k)); } },
  { de: 9, svg: (pre) => cruz(pre),
    quadro(tl, el, P, t, F) { jato(P, false); const em = ent(t, F(9) + 0.6, F(12)); const sacode = Math.sin(t * 6) * 3 * (em > 0 && em < 1 ? 1 : 0);
      at(P.q('.v3'), 'transform', `translate(${3720 + em * 600 + sacode},1180)`);
      const emp = pose({ lean: 26 }, { o: [-6, 90], c: [10, -10], q: [-20, 30], j: [10, 20] });
      base(P, t, { m1: { x: -9999 }, cintia: { x: -9999 }, breno: { x: -9999 }, voce: pose(emp, { x: 3480 + em * 600 }), davi: pose(emp, { x: 3320 + em * 600 }), h1: pose(emp, { x: 3640 + em * 600, d: 1 }),
        leo: pose(emp, { x: 3160 + em * 600, o: [-6, 40], c: [10, 90] }, { o: [-6, 90], c: [10, -10] }) });
      camera(P, 3560 + em * 600, 980, lerp(1.25, 1.3, em), 0, [sacode, 0]); } },
  { de: 12, svg: (pre) => EP4.cabineClose(pre, { dentro: elenco(['davi', 'nando']) }),
    quadro(tl, el, P, t, F) { op(P.q('.cab-corrente'), 0); const sobe = ent(t, F(12), F(12) + 1.2); const senta = ent(t, F(13), F(13) + 1.2);
      p(P, 'davi', 'davi', pose({ x: 1000, y: lerp(1500, 1110, sobe), s: 3.4, d: 1, ol: [6, 0], ab: pisca(t, 2) })); p(P, 'nando', 'nando', pose({ x: lerp(300, 620, senta), y: 1110, s: 3.4, d: 1, ol: [6, 0], ab: pisca(t, 3) }));
      camera(P, 900, 460, lerp(1.4, 1.5, prog(t, F(12), F(14)))); } },
  { de: 14, svg: painel,
    quadro(tl, el, P, t, F) { at(P.q('.maoIg'), 'transform', `translate(0,${lerp(300, 0, ent(t, F(14), F(14) + 1))})`); camera(P, lerp(1300, 1460, ent(t, F(14), F(15) + 2)), lerp(760, 820, ent(t, F(14), F(15) + 2)), lerp(1.2, 2.0, ent(t, F(14), F(15) + 2))); } },
]);
}
