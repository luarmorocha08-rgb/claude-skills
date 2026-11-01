/* virada — "A virada" (3 s)
   Ideia: o relógio para e a frase abraça a palavra: em cima "Você ficou 6 segundos",
   embaixo "esperando isso encostar". As metades seguem a um fio, sem encostar. */
{
Motion.cena('virada', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <h2 class="titulo frase f-cima">Você ficou<br>6 segundos</h2>
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
});
}
