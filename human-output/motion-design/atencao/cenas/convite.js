/* convite — "O convite" (4 s)
   Ideia: a pergunta, o caminho e, enfim, a colisão que o filme inteiro prometeu: as metades de
   SITES vêm das bordas e encostam na batida, com um estalo de luz na emenda. */
{
Motion.cena('convite', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <h2 class="titulo pergunta">Quer um<br>site assim?</h2>
    <p class="apoio caminho">me chama no direct<br>ou comenta</p>
    <div class="corte" data-ponte="corte">
      <div class="brasa"></div>
      <div class="metade cima"><span class="palavra destaque">SITES</span></div>
      <div class="metade baixo"><span class="palavra destaque">SITES</span></div>
      <div class="fenda"></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.cima'), { y: -14 });
      api.set(el.$('.baixo'), { y: 14 });
      api.set(el.$('.caminho'), { o: 0 });
      api.set(el.$('.brasa'), { o: 0.2 });
    },
  },

  montar(el, api) {
    el.cima = el.$('.cima'); el.baixo = el.$('.baixo');
    el.fenda = el.$('.fenda'); el.brasa = el.$('.brasa'); el.luz = el.$('.luz');
    el.perg = api.tipo.dividir(el.$('.pergunta'), { por: 'palavra' });
    el.cam_ = api.tipo.dividir(el.$('.caminho'), { por: 'palavra' });
    el.cam = api.camera({ origem: [50, 64] });
  },
  quadro(t, el, api) {
    const { tipo, prog, ease, lerp, suave } = api;
    const BATE = 1.5;
    tipo.focar(t, el.perg, { inicio: 0.0 });
    // as metades de SITES entram decididas e aceleram até encostar na batida 3
    // chegam de lados opostos, já perto, e fecham acelerando até encostar
    const d = lerp(13, 0, ease.inCubic(prog(t, 0.35, BATE)));
    const lado = 34 * (1 - ease.forte(prog(t, 0.3, 1.25)));
    const tr = api.tremor(t, BATE, { forca: 0.35, freq: 11 });
    const vem = ease.forte(prog(t, 0.3, 0.8));
    api.set(el.cima, { y: -d + tr.y, x: -lado, o: suave(prog(t, 0.3, 0.45)), blur: 0.6 * (1 - vem) });
    api.set(el.baixo, { y: d - tr.y, x: lado, o: suave(prog(t, 0.3, 0.45)), blur: 0.6 * (1 - vem) });
    // o estalo: a emenda acende do centro para as pontas e esfria devagar
    const estalo = api.pulsoSemQuique(t - BATE, 0.05);
    const corre = ease.forte(prog(t, BATE, BATE + 0.5));
    const antes = (1 - suave(prog(t, 0, 0.35))) * 0.9; // a linha que veio da frase sugada
    const depois = t < BATE ? 0 : lerp(1, 0.25, ease.outCubic(prog(t, BATE + 0.1, BATE + 1.4)));
    api.set(el.fenda, { o: Math.max(antes, depois), sx: t < BATE ? lerp(0.25, 0.6, prog(t, 0, 0.35)) : lerp(0.2, 1, corre), bright: 1 + 1.2 * estalo });
    const nb = api.naBatida(t, { de: 3.5, cada: 1, ataque: 0.12 });
    const brasa = lerp(0.15, 0.45, suave(prog(t, 0.4, BATE))) + 0.9 * estalo * 1 + (t > BATE ? 0.25 * ease.outCubic(prog(t, BATE, BATE + 0.6)) : 0);
    api.set(el.brasa, { o: Math.min(1.2, brasa) * (1 + 0.07 * api.vida(t, { periodo: 2.6, inicio: 2.4 }) + 0.15 * (nb.k === 0 ? nb.v : 0)), sx: 1 + 0.15 * estalo });
    api.fx.respirar(t, el.luz, { periodo: 3.9, amp: 0.08, base: 0.35 });
    tipo.focar(t, el.cam_, { inicio: 2.0 });
    // câmera viva; um empurrão seco de 2 % na colisão, devolvido devagar
    const z = api.viva(t, { v: 0.008 }) * (1 + 0.02 * api.pulsoSemQuique(t - BATE, 0.07));
    el.cam.pose({ zoom: z, x: tr.x * 0.3 });
  },
});
}
