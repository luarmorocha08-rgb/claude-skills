/* tensao — "O gancho" (6 s)
   Ideia: a palavra ATENÇÃO, cortada ao meio, se reencontra devagar: as metades vêm das bordas e
   chegam a um fio uma da outra, sem nunca encostar. Um relógio honesto conta os segundos. */
{
const PALAVRA = 'ATENÇÃO';
Motion.cena('tensao', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <div class="relogio">
      <p class="apoio rotulo">você está aqui há</p>
      <p class="titulo num"><span class="n">5</span></p>
      <p class="apoio un">segundos</p>
    </div>
    <div class="corte" data-ponte="corte">
      <div class="brasa"></div>
      <div class="metade cima"><span class="palavra">${PALAVRA}</span></div>
      <div class="metade baixo"><span class="palavra">${PALAVRA}</span></div>
      <div class="fenda"></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.cima'), { y: -62 });
      api.set(el.$('.baixo'), { y: 62 });
      api.set([el.$('.fenda'), el.$('.brasa')], { o: 0 });
      api.set(el.$('.relogio'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.cima'), { y: -7 });
      api.set(el.$('.baixo'), { y: 7 });
      api.set(el.$('.fenda'), { o: 0.35 });
      api.set(el.$('.brasa'), { o: 0.25 });
      el.$('.n').textContent = '2';
    },
  },
});
}
