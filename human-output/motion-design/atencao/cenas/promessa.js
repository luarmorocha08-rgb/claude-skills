/* promessa — "A promessa" (3,5 s)
   Ideia: a fenda vira janela: as metades se afastam para fora do quadro, a luz de dentro abre e
   de lá sai a frase. */
{
Motion.cena('promessa', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <div class="corte" data-ponte="corte">
      <div class="brasa"></div>
      <div class="metade cima"><span class="palavra">ATENÇÃO</span></div>
      <div class="metade baixo"><span class="palavra">ATENÇÃO</span></div>
      <div class="fenda"></div>
    </div>
    <h2 class="titulo frase">Imagine se<br>o seu site<br>prendesse a<br><span class="destaque">atenção</span><br>desse jeito</h2>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.cima'), { y: -9 });
      api.set(el.$('.baixo'), { y: 9 });
      api.set(el.$('.frase'), { o: 0.12, blur: 0.8, s: 0.96 });
      api.set(el.$('.brasa'), { sy: 2, o: 1 });
    },
  },

  montar(el, api) {
    el.cima = el.$('.cima'); el.baixo = el.$('.baixo');
    el.fenda = el.$('.fenda'); el.brasa = el.$('.brasa'); el.luz = el.$('.luz');
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.K = 62 * api.altura / api.largura; // 62 cqh em cqw
    el.cam = api.camera({ origem: [50, 54] });
    el.yLinha = (64 - 50) * api.altura / api.largura; // a fenda da próxima cena
  },
  quadro(t, el, api) {
    const { tipo, prog, ease, lerp, suave } = api;
    // a fenda vira janela: as metades se separam com arranque macio e saem acelerando
    const e = ease.inCubic(prog(t, 0, 0.75));
    api.set(el.cima, { y: (el.K - 0.28) * (1 - e) - 0.5 * suave(prog(t, 0, 0.08)) });
    api.set(el.baixo, { y: -(el.K - 0.28) * (1 - e) + 0.5 * suave(prog(t, 0, 0.08)) });
    const abre = ease.forte(prog(t, 0.05, 1.1));
    api.set(el.brasa, { sx: lerp(1 / 1.3, 1, abre), sy: lerp(1 / 4.2, 1, abre), o: lerp(1, 0.55, abre) * (1 + 0.08 * api.vida(t, { periodo: 2.7, inicio: 1.2 })) * (1 - suave(prog(t, 3.2, 3.5))) });
    api.set(el.fenda, { o: 1 - suave(prog(t, 0.05, 0.5)), sx: lerp(1, 1.5, abre) });
    api.fx.respirar(t, el.luz, { periodo: 3.7, amp: 0.1, base: 0.4 });
    // a frase sai da luz, palavra a palavra; "atenção" acende na batida 2
    const a = tipo.focar(t, el.pal, { inicio: 0.55, cascata: 0.06, aplicar: false });
    const s = tipo.sugar(t, el.pal, { inicio: 3.2, dur: 0.3, ponto: [0, el.yLinha], aplicar: false });
    tipo.aplicar(el.pal, a, s);
    tipo.varrerDestaque(t, el.pal, { inicio: 1.0, dur: 0.5 });
    tipo.derivaDestaque(t, el.pal, { inicio: 1.6 });
    // câmera: mergulho curto na fenda enquanto ela abre, depois viva
    const z = 1.009 + 0.035 * ease.forte(prog(t, 0, 1.2)) + 0.008 * (t - 2.3) * suave(prog(t, 1.0, 1.6)) - 0.0;
    el.cam.pose({ zoom: z });
  },
});
}
