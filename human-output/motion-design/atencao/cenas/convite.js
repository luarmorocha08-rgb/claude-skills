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
});
}
