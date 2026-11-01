/* assinatura — "A assinatura" (3,5 s)
   Ideia: as três criações recuam e viram facetas douradas que voam de volta para o personagem;
   o cursor escreve a frase final e assina com o monograma. */
{
Motion.cena('assinatura', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio">${window.Personagem(c, 'heroi-direita')}</div>
    <div class="camada c-perto">
      <div class="coluna topo">
        <p class="rotulo">Seu turno</p>
        <h2 class="titulo frase">Domingo<br>é dia de<br><span class="destaque criar">criar</span>.<span class="cursor"></span></h2>
      </div>
      <div class="coluna base">
        <div class="chamada">${c.foto('sparkles', { classe: 'mini' })}<span>Salva e testa no seu domingo.</span></div>
        <div class="rodape"><div class="monograma">RR</div><span class="arroba">@ramosraul.ia</span></div>
      </div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.corpo'), { o: 0 }); api.set(el.$('.facetas'), { o: 1 });
      window.posarFacetas(el, api, 0.1, { de: [-45, -25], espalhar: 1.2 });
      api.set(el.$$('.frase, .chamada, .rodape'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.corpo'), { o: 0 }); api.set(el.$('.facetas'), { o: 1 });
      window.posarFacetas(el, api, 0.7, { de: [-45, -25], espalhar: 1.2 });
      api.set(el.$('.criar'), { clip: 'inset(0 62% 0 0)' });
      api.set(el.$$('.chamada, .rodape'), { o: 0 });
    },
  },
});
}
