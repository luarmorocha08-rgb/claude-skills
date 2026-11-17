/* fecho — "A conta" (3,5 s)
   Ideia: de volta ao pôr do sol (a rima com a abertura): "QUASE 3 HORAS" a pé sobe gigante, a
   lembrança do avião entra embaixo, o sol afunda no mar e o horizonte apaga num ponto.
   178 min = 2 h 58 → "quase 3 horas" (dos tempos da referência).
   Batidas: 0 "A PÉ, É QUASE" · b(1) "3 HORAS" pela lente · b(2) apoio · 2,4 o sol afunda · 3,1 tudo sai. */
Motion.cena('fecho', {
  render: () => `
    ${Vice.cenario()}
    <div class="pilha bloco">
      <p class="etiqueta e1">De ponta a ponta</p>
      <p class="titulo l1">A pé, é quase</p>
      <h2 class="titulo l2"><span class="destaque">3 horas</span></h2>
      <p class="apoio">De avião: <b>7 minutos</b></p>
    </div>`,
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.e1 = api.tipo.dividir(el.$('.e1'), { por: 'palavra' });
    el.l1 = api.tipo.dividir(el.$('.l1'), { por: 'palavra' });
    el.l2 = api.tipo.dividir(el.$('.l2'), { por: 'letra' });
    el.ap = api.tipo.dividir(el.$('.apoio'), { por: 'palavra' });
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, b } = api;
    const V = el.V;
    const pz = ease.inOutSine(prog(t, 2.2, 3.4));
    Vice.vida(t, V, api, { sol: 1 - 0.7 * pz });
    const d = 14 * pz, corte = 50 - (d / 44) * 100;
    const m = `linear-gradient(180deg, #000 ${corte}%, transparent ${corte + 0.5}%)`;
    api.set(V.sol, { y: d * 0.5625, style: { webkitMaskImage: m, maskImage: m } });
    const apaga = ease.inCubic(prog(t, 3.05, 3.5));
    api.set([V.ceu, V.mar, ...V.sky, ...V.palmas], { o: 1 - apaga, bright: 1 - 0.4 * pz });
    api.set(V.linha, { sx: lerp(1, 0.01, ease.inExpo(prog(t, 3.1, 3.48))), o: 1 - suave(prog(t, 3.42, 3.5)) });
    const sai = (p, i0) => tipo.sair(t, p, { inicio: i0, dur: 0.28, aplicar: false });
    tipo.aplicar(el.e1, tipo.focar(t, el.e1, { inicio: 0.05, aplicar: false }), sai(el.e1, 3.0));
    tipo.aplicar(el.l1, tipo.focar(t, el.l1, { inicio: 0.15, aplicar: false }), sai(el.l1, 3.02));
    tipo.aplicar(el.l2, tipo.lente(t, el.l2, { inicio: b(1), eixo: 'quadro', aplicar: false }), sai(el.l2, 3.05));
    tipo.aplicar(el.ap, tipo.focar(t, el.ap, { inicio: b(2), aplicar: false }), sai(el.ap, 3.0));
    tipo.brilho(t, el.l2, { inicio: b(4), dur: 0.7, forca: 0.45 });
    el.cam.pose({ zoom: 1 + 0.012 * (t - api.ref), y: -2 * pz });
  },
});
