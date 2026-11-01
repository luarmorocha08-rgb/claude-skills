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
});
}
