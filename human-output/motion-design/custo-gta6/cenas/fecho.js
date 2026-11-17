/* fecho — "A pergunta final" (5 s)
   Ideia: de volta ao pôr do sol da abertura (a rima): a pergunta sobe gigante, o sol afunda no mar,
   o horizonte encolhe até um ponto e apaga.
   Batidas: 0 "vai valer" · b(1) "cada centavo?" pela lente · b(3) brilho · b(7) o sol afunda ·
   4,4 tudo sai e o horizonte vira um ponto · último quadro: o fundo. */
Motion.cena('fecho', {
  render: () => `
    ${Vice.cenario()}
    <div class="pilha bloco">
      <p class="titulo l1">Vai valer</p>
      <h2 class="titulo l2"><span class="destaque">cada centavo?</span></h2>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set(el.$('.l2'), { o: 0 }); api.set(el.$('.l1'), { o: 0.4, blur: 0.6 }); },
    meio: (el, api) => { api.set(el.$('.l2'), { o: 0.55, blur: 0.8, s: 1.25 }); },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.l1 = api.tipo.dividir(el.$('.l1'), { por: 'palavra' });
    el.l2 = api.tipo.dividir(el.$('.l2'), { por: 'letra' });
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, b } = api;
    const V = el.V;
    // o sol afunda no mar e o céu escurece
    const pz = ease.inOutSine(prog(t, b(7), 4.6));
    Vice.vida(t, V, api, { sol: 1 - pz });
    const d = 15 * pz;
    const corte = 50 - (d / 30) * 100;
    api.set(V.sol, { y: d * 0.5625, style: { webkitMaskImage: `linear-gradient(180deg, #000 ${corte}%, transparent ${corte + 0.5}%)`, maskImage: `linear-gradient(180deg, #000 ${corte}%, transparent ${corte + 0.5}%)` } });
    // o mundo apaga; a linha do horizonte encolhe até um ponto e some por último
    const apaga = ease.inCubic(prog(t, 4.2, 4.85));
    api.set([V.ceu, V.mar, ...V.sky, ...V.palmas], { o: 1 - apaga, bright: 1 - 0.45 * pz });
    const enc = ease.inExpo(prog(t, 4.35, 4.85));
    api.set(V.linha, { sx: lerp(1, 0.01, enc), o: 1 - suave(prog(t, 4.8, 4.98)) });
    // a pergunta
    const s1 = tipo.focar(t, el.l1, { inicio: api.inicioEntrada(0.02), aplicar: false });
    const s2 = tipo.lente(t, el.l2, { inicio: b(1), eixo: 'quadro', aplicar: false });
    const x1 = tipo.sair(t, el.l1, { inicio: 4.2, dur: 0.3, aplicar: false });
    const x2 = tipo.sair(t, el.l2, { inicio: 4.25, dur: 0.3, aplicar: false });
    tipo.aplicar(el.l1, s1, x1);
    tipo.aplicar(el.l2, s2, x2);
    tipo.brilho(t, el.l2, { inicio: b(3), dur: 0.8, forca: 0.45 });
    tipo.derivaDestaque(t, el.l2, { inicio: b(3.5) });
    el.cam.pose({ zoom: 1 + 0.009 * (t - api.ref), y: -3 * pz });
  },
});
