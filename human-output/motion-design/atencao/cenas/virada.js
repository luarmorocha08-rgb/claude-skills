/* virada — "A virada" (3 s)
   Ideia: o relógio para e a frase abraça a palavra: em cima "Você ficou 4 segundos",
   embaixo "esperando isso encostar". As metades seguem a um fio, sem encostar. */
{
Motion.cena('virada', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <h2 class="titulo frase f-cima">Você ficou<br>4 segundos</h2>
    <div class="corte" data-ponte="corte">
      <div class="brasa"></div>
      <div class="metade cima"><span class="palavra">ATENÇÃO</span></div>
      <div class="metade baixo"><span class="palavra">ATENÇÃO</span></div>
      <div class="fenda"></div>
    </div>
    <h2 class="titulo frase f-baixo">esperando<br>isso encostar</h2>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.f-cima'), { o: 0.15, blur: 0.6, y: 1.5 });
      api.set(el.$('.f-baixo'), { o: 0 });
    },
  },

  montar(el, api) {
    el.cima = el.$('.cima'); el.baixo = el.$('.baixo');
    el.fenda = el.$('.fenda'); el.brasa = el.$('.brasa'); el.luz = el.$('.luz');
    el.p1 = api.tipo.dividir(el.$('.f-cima'), { por: 'palavra' });
    el.p2 = api.tipo.dividir(el.$('.f-baixo'), { por: 'palavra' });
    el.cam = api.camera({ origem: [50, 54] });
  },
  quadro(t, el, api) {
    const { tipo, prog, ease, suave } = api;
    const a1 = tipo.focar(t, el.p1, { inicio: 0.05, aplicar: false });
    const a2 = tipo.focar(t, el.p2, { inicio: 0.4, aplicar: false });
    tipo.aplicar(el.p1, a1, tipo.sair(t, el.p1, { inicio: 2.72, dur: 0.28, aplicar: false }));
    tipo.aplicar(el.p2, a2, tipo.sair(t, el.p2, { inicio: 2.72, dur: 0.28, aplicar: false }));
    // as metades seguem a um fio, tremendo de leve
    const tr = 0.05 * api.ruido(t, 3, { freq: 7 });
    api.set(el.cima, { y: 0.04 + tr });
    api.set(el.baixo, { y: -0.04 - tr });
    // na batida 4, a brasa dá um pulso de calor (como se fosse encostar agora)
    // a cada batida a brasa esquenta um pouco mais, como se fosse encostar agora
    const nb = api.naBatida(t, { de: 0.9, cada: 1, ataque: 0.12 });
    const p = t < 2.7 ? nb.v * (0.6 + 0.2 * Math.max(0, nb.k)) : 0;
    api.set(el.brasa, { o: 1 + 0.35 * p + 0.05 * api.vida(t, { periodo: 2.3 }), sx: 1 + 0.06 * p });
    api.set(el.fenda, { o: 0.95 + 0.05 * Math.sin(t * 5.3), bright: 1 + 0.6 * p });
    api.fx.respirar(t, el.luz, { periodo: 4.1, amp: 0.08, base: 0.22 });
    // câmera: herda o push, recua 1 % no fim como quem respira antes de abrir
    const z = 1.002 + 0.016 * t - 0.016 * ease.inOutSine(prog(t, 2.3, 3.0));
    el.cam.pose({ zoom: z });
  },
});
}
