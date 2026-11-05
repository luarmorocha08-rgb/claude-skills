/* c16 — "Quem volta". */
{
const { E, camera, op, at, prog, lerp, ruido, txt } = K; const { pose, ANDA, fala, pisca, elenco, p, ent } = H3;
const banc = (pre) => EP3.servico(pre, { atores: elenco(['voce', 'irma', 'joel', 'helena', 'davi', 'leo']) });
const grupo = (P, t, ex = {}) => [['voce', 2500, 1.7, 1], ['irma', 2330, 1.62, 1], ['joel', 2180, 1.75, 1], ['helena', 3000, 1.7, -1], ['davi', 3150, 1.75, -1], ['leo', 2850, 1.7, -1]].forEach(([n, x, s, d], i) => p(P, n, n, pose({ x, y: 990, s, d, cab: 12, ol: [4, 4], ab: pisca(t, i + 1) }, ex[n] || {})));
K.cenaN('c16', [
  { de: 0, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { const ch = E.out(prog(t, F(0), F(0) + 1.6)); op(P.q('.sv-lant'), 0.7);
      grupo(P, t, { irma: { x: lerp(1700, 2330, ch), cab: ch > 0.9 ? 14 : 0, ...(ch < 1 ? ANDA(tl, 6, .6) : {}) } }); camera(P, lerp(2300, 2650, ch), 640, 1.15); } },
  { de: 1, svg: (pre) => EP3.mapa3(pre) + `<g class="dedo"><circle r="40" fill="#141414"/><rect x="-14" y="0" width="28" height="160" fill="#ef8a74"/></g>`,
    quadro(tl, el, P, t, F) { at(P.q('.rota2'), 'stroke-dashoffset', 0); op(P.q('.mCaminhao'), 1); op(P.q('.mCarros'), 1); op(P.q('.mMaquina'), ent(t, F(2), F(2) + 0.6));
      const k = ent(t, F(1), F(1) + 1); at(P.q('.dedo'), 'transform', `translate(${lerp(1300, 990, k)},${lerp(950, 600, k)})`); camera(P, 980, 600, lerp(1.2, 1.8, k)); } },
  { de: 2, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { op(P.q('.sv-lant'), 0.7); const pi = pose({ x: 2330, y: 990, s: 1.62, d: 1, cab: 0, ol: [6, 0], boca: fala(t, F(2), F(2) + 1.8) }); grupo(P, t, { irma: pi, voce: { boca: fala(t, F(3), F(3) + 0.6), cab: 0, ol: [-5, 0], d: -1 } });
      const c = B.cabecaMundo(pi); camera(P, c[0] + 60, c[1] + 60, lerp(2.8, 3.0, prog(t, F(2), F(4)))); } },
  { de: 4, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { op(P.q('.sv-lant'), 0.7); grupo(P, t, { irma: { cab: 0, ol: [7, 0] } }); const alvo = t < F(5) ? 3150 : 2850; camera(P, lerp(2600, alvo - 100, ent(t, F(4), F(4) + .6)), 560, 2.0); } },
  { de: 6, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { op(P.q('.sv-lant'), 0.7); grupo(P, t, { voce: { d: -1, cab: 0, ol: [6, 0], boca: fala(t, F(6), F(7) + 2) }, irma: { cab: 0, ol: [6, 0] } }); camera(P, 2420, 620, lerp(2.2, 2.35, prog(t, F(6), F(8)))); } },
  { de: 8, svg: (pre) => banc(pre),
    quadro(tl, el, P, t, F) { op(P.q('.sv-lant'), 0.7); grupo(P, t, { irma: { cab: 16, ol: [3, 5], ab: 0.85 } }); const pi = pose({ x: 2330, y: 990, s: 1.62, d: 1 }); const c = B.cabecaMundo(pi); camera(P, c[0], c[1] + 70, lerp(3.0, 3.2, prog(t, F(8), F(9)))); } },
  { de: 9, svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#8d6e4c"/><g transform="rotate(-3 960 540)"><rect x="520" y="140" width="880" height="820" fill="#fbf8f1" stroke="#c9b98f" stroke-width="6"/>
      ${Array.from({ length: 16 }, (_, i) => `<line x1="540" y1="${200 + i * 48}" x2="1380" y2="${200 + i * 48}" stroke="#bcd3e8" stroke-width="3"/>`).join('')}<line x1="620" y1="150" x2="620" y2="950" stroke="#e8a3a3" stroke-width="3"/>
      <path class="des" d="M640,860 L760,820 L900,820 L1000,760 L1060,640 L1120,520 L1240,440 L1320,320" fill="none" stroke="#2c3e50" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1200" stroke-dashoffset="1200"/>
      <g class="ponto" opacity="0" transform="translate(900,820)"><rect x="-30" y="-50" width="60" height="50" fill="none" stroke="#2c3e50" stroke-width="6"/><line x1="-34" y1="-50" x2="34" y2="-50" stroke="#2c3e50" stroke-width="8"/></g>
      <path d="M520,140 L560,190 L600,150 L640,190 L680,150 L720,190 L760,150" fill="none" stroke="#c9b98f" stroke-width="5" class="rasgo"/></g>
      <g class="lapis"><rect x="-12" y="-200" width="24" height="190" rx="6" fill="#f1c40f" stroke="#141414" stroke-width="4"/><polygon points="-12,-10 12,-10 0,14" fill="#141414"/></g>`,
    quadro(tl, el, P, t, F) { const k = ent(t, F(10), F(11) + 1); at(P.q('.des'), 'stroke-dashoffset', 1200 * (1 - k)); op(P.q('.ponto'), ent(t, F(10) + 2.5, F(10) + 3));
      const r = P.q('.des'); let pt = [640, 860]; try { const L = r.getTotalLength(); const q = r.getPointAtLength(L * k); pt = [q.x, q.y]; } catch (e) {}
      at(P.q('.lapis'), 'transform', `rotate(-3 960 540) translate(${pt[0]},${pt[1]}) rotate(25)`); op(P.q('.lapis'), t > F(10) - 0.3 && t < F(11) + 1.6 ? 1 : 0);
      const rasga = Math.sin(Math.PI * prog(t, F(9) + 0.5, F(9) + 1.5)); camera(P, 960, 540, 1.0, rasga * 3, [rasga * 10, 0]); } },
  { de: 12, svg: (pre) => banc(pre) + `<g class="papel"><rect x="-40" y="-30" width="80" height="60" fill="#fbf8f1" stroke="#141414" stroke-width="3"/></g>`,
    quadro(tl, el, P, t, F) { op(P.q('.sv-lant'), 0.7); const da = ent(t, F(12), F(12) + 1); const dobra = ent(t, F(13), F(13) + 2.5);
      grupo(P, t, { irma: { o: [-6, lerp(20, 80, da)], c: [10, 0], cab: 6, ol: [6, 0] }, voce: { d: -1, cab: 12, ol: [4, 4], o: [-6, lerp(40, 80, da)], c: [10, lerp(10, 70, dobra)] } });
      const m = B.maoFrente(pose({ x: 2500, y: 990, s: 1.7, d: -1 }, { o: [-6, lerp(40, 80, da)], c: [10, lerp(10, 70, dobra)] }));
      at(P.q('.papel'), 'transform', `translate(${m[0] - 10},${m[1] - 10}) scale(${lerp(1, 0.35, dobra)},${lerp(1, 0.5, dobra)})`); camera(P, 2420, 680, lerp(2.0, 2.4, prog(t, F(12), F(14)))); } },
]);
}
