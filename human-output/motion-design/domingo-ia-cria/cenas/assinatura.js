/* assinatura — "A assinatura" (3,5 s)
   Ideia: as três criações recuam e viram facetas douradas que voam de volta para o personagem;
   o cursor faz a pergunta final e o convite para seguir assina com o monograma. */
{
Motion.cena('assinatura', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio">${window.Personagem(c, 'heroi-direita')}</div>
    <div class="camada c-perto">
      <div class="coluna topo">
        <p class="rotulo">Você escolhe</p>
        <h2 class="titulo frase">Qual é a<br>próxima<br><span class="destaque criar">criação</span>?<span class="cursor"></span></h2>
      </div>
      <div class="coluna base">
        <div class="chamada">${c.foto('sparkles', { classe: 'mini' })}<span>Comenta a sua ideia e segue pra ver ela nascer aqui.</span></div>
        <div class="rodape"><div class="monograma">RR</div><span class="arroba">@ramosraul.ia</span><span class="seguir">Seguir <b>+</b></span></div>
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
      api.set(el.$('.criar'), { clip: 'inset(0 45% 0 0)' });
      api.set(el.$$('.chamada, .rodape'), { o: 0 });
    },
  },
});
}
