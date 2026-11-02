/* c05 — "O carrinho na escada". */
{
const { E, camera, op, at, prog, lerp, ruido, tremor, txt } = K; const { pose, ANDA, AG, fala, pisca, elenco, p, ent } = H3;
const carr = () => `<g class="carr">${EP2.carrinho()}<g class="carga"><rect x="-70" y="-230" width="60" height="70" fill="#8e5ea2" stroke="#141414" stroke-width="3"/><rect x="0" y="-240" width="60" height="80" fill="#3498db" stroke="#141414" stroke-width="3"/><rect x="-30" y="-270" width="70" height="40" fill="#e74c3c" stroke="#141414" stroke-width="3"/></g></g><g class="roda"><circle r="12" fill="#1b1d22"/></g>`;
const cena = (pre) => EP3.estacao(pre, { atores: elenco(['voce', 'irma', 'leo', 'davi', 'bia'], { bia: { item: `<rect x="-26" y="-14" width="52" height="30" rx="6" fill="#f1c40f" stroke="#141414" stroke-width="3"/>` } }) + carr() });
const degrau = (x) => 990 - ((x - 300) * 570) / 1200;
const grupo = (P, t, xs = {}) => {
  p(P, 'voce', 'voce', pose({ x: xs.voce ?? 120, y: 990, d: 1, s: 1.7 }, xs.pv || {})); p(P, 'irma', 'irma', pose({ x: xs.irma ?? -40, y: 990, d: 1, s: 1.62 }, xs.pi || {})); p(P, 'leo', 'leo', pose({ x: xs.leo ?? -200, y: 990, d: 1, s: 1.7 }, xs.pl || {}));
  p(P, 'bia', 'bia', pose({ x: xs.bia ?? 230, y: 990, d: -1, s: 1.1 }, { o: [-6, 60], c: [10, 60] }, xs.pb || {}));
};
K.cenaN('c05', [
  { de: 0, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const sobe = Math.floor((t - F(1)) / 1.1); const fr = ((t - F(1)) % 1.1) / 1.1; const xs = 560 + Math.max(0, sobe) * 66 + (t > F(1) ? E.out(Math.min(1, fr * 3)) * 66 : 0);
      const xd = Math.min(xs + 120, 1300); p(P, 'davi', 'davi', pose({ x: xd, y: degrau(xd), d: -1, lean: -14, cab: 6, ol: [5, 2] }, { o: [-6, 70], c: [10, 20] }));
      at(P.q('.carr'), 'transform', `translate(${xs},${degrau(xs) + 8}) rotate(-25) scale(.95)`); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      const k = prog(t, F(0), F(0) + 2); grupo(P, t, { voce: lerp(-300, 150, k), irma: lerp(-450, 0, k), leo: lerp(-600, -150, k), pv: k < 1 ? ANDA(tl, 6, 0.7) : {}, pi: k < 1 ? ANDA(tl + .3, 6, .7) : {}, pl: k < 1 ? ANDA(tl + .5, 6, .7) : {} });
      camera(P, 650, 720, 0.8, 0, (t - F(1)) % 1.1 < 0.12 && t > F(1) ? [0, 5] : [0, 0]); } },
  { de: 3, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { at(P.q('.carr'), 'transform', `translate(${790},${degrau(790) + 8}) rotate(-25) scale(.95)`); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      grupo(P, t, { pv: { d: -1, cab: -4, ol: [6, -1], ab: 1.3, medo: 0.5 } }); p(P, 'davi', 'davi', pose({ x: 910, y: degrau(910), d: -1, lean: -14 }, { o: [-6, 70], c: [10, 20] }));
      const pv = pose({ x: 120, y: 990, s: 1.7, d: -1 }); const c = B.cabecaMundo(pv); camera(P, c[0] + 40, c[1] + 60, lerp(2.8, 3.0, prog(t, F(3), F(5)))); } },
  { de: 5, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { at(P.q('.carr'), 'transform', `translate(790,${degrau(790) + 8}) rotate(-25) scale(.95)`); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      grupo(P, t, { irma: 380, pi: { boca: fala(t, F(5), F(5) + 1.2), o: [-6, 60], c: [10, 0] } });
      p(P, 'davi', 'davi', pose({ x: 910, y: degrau(910), d: -1, lean: -10, cab: lerp(0, 8, ent(t, F(6), F(6) + .5)), ol: [6, 0], boca: fala(t, F(6), F(8)) }, { o: [-6, 70], c: [10, 20] }));
      camera(P, 650, 640, 1.3); } },
  { de: 8, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { at(P.q('.carr'), 'transform', 'translate(-999,0)'); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      grupo(P, t, { bia: 230, pb: { cab: 10, ol: [4, 3], ab: pisca(t) } }); p(P, 'davi', 'davi', pose({ x: -999, y: 990 }));
      camera(P, 230, 830, lerp(3.0, 3.3, prog(t, F(8), F(10)))); } },
  { de: 10, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { at(P.q('.carr'), 'transform', `translate(790,${degrau(790) + 8}) rotate(-25) scale(.95)`); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      grupo(P, t); p(P, 'davi', 'davi', pose({ x: 910, y: degrau(910), d: -1, lean: -10, ol: [5, 1] }, { o: [-6, 70], c: [10, 20] }));
      const alvo = t < F(11) ? [910, degrau(910) - 230] : [230, 860]; camera(P, alvo[0], alvo[1], 2.6); } },
  { de: 12, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { grupo(P, t, { voce: -999, leo: -999, irma: 200 }); const tent = [F(13), F(14), F(15)]; const s1 = ent(t, tent[0], tent[0] + 0.7); const xs = 790 + s1 * 66;
      const solta = t > tent[2] + 0.3; at(P.q('.carr'), 'transform', `translate(${xs},${degrau(xs) + 8}) rotate(${-25 + (t > tent[1] ? 6 : 0)}) scale(.95)`);
      const u = Math.max(0, t - tent[2] - 0.3); const rx = xs - 60 - u * 220; at(P.q('.roda'), 'transform', solta ? `translate(${rx},${Math.min(990, degrau(rx) - 12 + Math.abs(Math.sin(u * 10)) * -14)}) rotate(${u * 700})` : 'translate(-999,0)');
      p(P, 'voce', 'voce', pose({ x: xs + 60, y: degrau(xs + 60), d: -1, lean: -18, ab: t > tent[1] ? 1.3 : 1 }, { o: [-6, 80], c: [10, 20] }));
      p(P, 'leo', 'leo', pose({ x: xs - 120, y: degrau(xs - 120), d: 1, lean: 16 }, { o: [-6, 80], c: [10, 20] }));
      p(P, 'davi', 'davi', pose({ x: xs + 230, y: degrau(xs + 230), d: -1, lean: -14 }, { o: [-6, 70], c: [10, 20] }));
      camera(P, 860, 680, 1.25, 0, tremor(t, tent[1], 6, 14, 6)); } },
  { de: 16, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { const ag = ent(t, F(18), F(18) + 0.6); grupo(P, t, { voce: -999, leo: -999, irma: 200, bia: lerp(300, 440, ag), pb: K.mistura({ cab: 0 }, Object.assign({}, AG, { o: [60, 90], c: [10, 0] }), ag) }); const xs = 856; at(P.q('.carr'), 'transform', `translate(${xs},${degrau(xs) + 8}) rotate(-19) scale(.95)`);
      const u = t - (F(16) - 1.0); const pega = t > F(18) + 0.6; const rx = pega ? 470 : Math.max(470, 760 - u * 120); at(P.q('.roda'), 'transform', `translate(${rx},${degrau(rx) - 12}) rotate(${pega ? 0 : u * 500})`);
      p(P, 'voce', 'voce', pose({ x: xs + 60, y: degrau(xs + 60), d: -1, lean: -10, ab: 1.4, medo: 0.6 })); p(P, 'leo', 'leo', pose({ x: xs - 120, y: degrau(xs - 120), d: 1, ab: 1.4 }));
      p(P, 'davi', 'davi', pose({ x: xs + 230, y: degrau(xs + 230), d: -1, ab: 1.4 }));
      camera(P, 650, 760, lerp(1.1, 1.2, prog(t, F(16), F(19)))); } },
  { de: 19, svg: (pre) => cena(pre),
    quadro(tl, el, P, t, F) { at(P.q('.carr'), 'transform', `translate(856,${degrau(856) + 8}) rotate(-19) scale(.95)`); at(P.q('.roda'), 'transform', 'translate(-999,0)');
      grupo(P, t, { voce: 760, irma: 200, leo: 620, bia: 440, pv: { d: -1 }, pb: Object.assign({}, AG) }); p(P, 'davi', 'davi', pose({ x: 980, y: degrau(980), d: -1 }));
      camera(P, 650, 760, lerp(1.0, 0.95, prog(tl, 0, 3))); } },
]);
}
