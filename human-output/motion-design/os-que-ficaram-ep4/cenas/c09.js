/* c09 — "A entrega que não chegou". O nome da escola na prancheta; Cíntia conta o que aconteceu no cruzamento. */
{
const { E, camera, op, at, prog, lerp, tremor } = K; const { pose, AG, ANDA, fala, pisca, elenco, p, ent } = H3;
const far = (pre) => EP4.farmaciaDentro(pre, { atrasBalcao: elenco(['cintia']), atores: elenco(['voce']) });
const cintia = (P, t, ex = {}) => p(P, 'cintia', 'cintia', pose({ x: 1380, y: 990, s: 1.66, d: 1, ol: [6, 0], ab: pisca(t, 5) }, ex));
const voce = (P, t, ex = {}) => p(P, 'voce', 'voce', pose({ x: 1760, y: 990, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t) }, ex));
const SEPIA = `<rect x="-600" y="-400" width="5600" height="2000" fill="#b08a55" opacity=".42" style="mix-blend-mode:multiply"/>`;
const flash = (pre) => EP4.cruzamento(pre, { semLanterna: true, semCorrente: true, atores: elenco(['nando', 'mauro', 'breno', 'homem:h1', 'homem:h2']) }) + SEPIA;
K.cenaN('c09', [
  { de: 0, svg: far,
    quadro(tl, el, P, t, F) { cintia(P, t, { x: 2300, d: 1 }); voce(P, t, { cab: 16, ol: [-2, 6], x: 1720 }); const pv = pose({ x: 1720, y: 990, s: 1.7, d: -1 }); const c = B.cabecaMundo(pv);
      const k = ent(t, F(0) + 0.8, F(1)); camera(P, lerp(c[0] - 40, 1540, k), lerp(c[1] + 80, 790, k), lerp(2.6, 3.4, k)); } },
  { de: 1, svg: (pre) => EP4.documento(pre),
    quadro(tl, el, P, t, F) { const k = ent(t, F(1), F(1) + 2); camera(P, lerp(960, 900, k), lerp(540, 470, k), lerp(1.0, 1.6, k)); } },
  { de: 2, svg: far,
    quadro(tl, el, P, t, F) { const mao = ent(t, F(2), F(2) + 0.8), pega = ent(t, F(2) + 0.7, F(2) + 1.2);
      voce(P, t, { o: [-6, lerp(10, 80, mao * (1 - pega * 0.6))], c: [10, 0], boca: 0, ab: pega > 0.5 ? 1.2 : 1 });
      cintia(P, t, { x: 1420, o: [-6, lerp(20, 70, pega)], c: [10, lerp(40, 20, pega)], boca: fala(t, F(3), F(4)) * 0.4, cab: t > F(5) && t < F(6) ? 16 : 0, ol: t > F(5) && t < F(6) ? [3, 6] : [6, 0] });
      at(P.q('.f-prancheta'), 'transform', `translate(${lerp(1520, 1480, pega)},${lerp(712, 640, pega)}) rotate(${lerp(-80, -10, pega)}) scale(1.1)`);
      camera(P, lerp(1560, 1580, prog(t, F(2), F(7))), 700, lerp(2.0, 2.2, prog(t, F(2), F(7)))); } },
  { de: 7, svg: far,
    quadro(tl, el, P, t, F) { at(P.q('.f-prancheta'), 'transform', 'translate(1480,640) rotate(-10) scale(1.1)'); cintia(P, t, { x: 1420, boca: fala(t, F(7), F(8)) * 0.4, o: [-6, 70], c: [10, 20] }); voce(P, t);
      const pc = pose({ x: 1420, y: 990, s: 1.66, d: 1 }); const c = B.cabecaMundo(pc); camera(P, c[0] + 60, c[1] + 70, lerp(3.0, 3.2, prog(t, F(7), F(8)))); } },
  { de: 8, svg: flash,
    quadro(tl, el, P, t, F) { op(P.q('.lantLayer'), 0); const bate = ent(t, F(8) + 0.6, F(8) + 1.0);
      at(P.q('.v3'), 'transform', `translate(${lerp(3200, 3480, bate)},${1185}) rotate(${-8 * bate})`);
      p(P, 'nando', 'nando', pose({ x: lerp(2900, 2700, ent(t, F(9), F(9) + 1)), y: 1260, s: 1.7, d: -1, ol: [6, 0], ab: pisca(t) }, t > F(9) ? ANDA(tl, 5, 0.5) : {}));
      const ajuda = t > F(9); [['h1', 3350], ['h2', 3520], ['mauro', 3700], ['breno', 3880]].forEach(([id, x], i) => p(P, id, id === 'h1' || id === 'h2' ? 'homem' : id, pose({ x: ajuda ? x - 60 : x + 900, y: 1260, s: 1.7, d: -1, lean: ajuda && t < F(10) ? 20 : 0 }, ajuda && t < F(10) ? { o: [-6, 90], c: [10, -10] } : {}, t > F(10) && id === 'mauro' ? { d: -1, cab: -10, ol: [4, -6], o: [-6, 120], c: [10, -10] } : {})));
      camera(P, lerp(3000, 3150, prog(t, F(8), F(11))), 900, 1.15, 0, tremor(t, F(8) + 1.0, 14, 16, 5)); } },
  { de: 11, svg: far,
    quadro(tl, el, P, t, F) { cintia(P, t, { x: -9999 }); voce(P, t, { x: 900, d: -1, ol: [6, 0] }); const k = ent(t, F(11), F(13) + 1);
      camera(P, lerp(700, 400, k), lerp(600, 560, k), lerp(1.3, 2.6, k)); } },
]);
}
