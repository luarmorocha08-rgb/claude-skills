/* prompt — "O pedido" (3,5 s)
   Ideia: o personagem se monta em facetas low-poly ao lado de um card escuro; o cursor dourado
   digita o pedido, e a frase "eu só descrevo" assenta embaixo. */
{
Motion.cena('prompt', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio">${window.Personagem(c, 'heroi-direita')}</div>
    <div class="camada c-perto">
      <div class="coluna topo">
        <p class="rotulo">O prompt</p>
        <div class="card-prompt">
          <div class="cabeca">${c.foto('sparkles', { classe: 'mini' })}<span>Novo prompt</span></div>
          <p class="pedido">Cria pra mim uma plataforma de cursos, um jogo e um app de treino.<span class="cursor"></span></p>
        </div>
      </div>
      <div class="coluna meio-esq"><h2 class="titulo frase">Eu só<br><span class="destaque">descrevo</span>.</h2></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.corpo'), { o: 0 }); api.set(el.$('.facetas'), { o: 1 });
      window.posarFacetas(el, api, 0.08, { de: [-30, -10] });
      api.set(el.$('.pedido'), { clip: 'inset(0 0 100% 0)' });
      api.set(el.$('.frase'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.corpo'), { o: 0 }); api.set(el.$('.facetas'), { o: 1 });
      window.posarFacetas(el, api, 0.62, { de: [-30, -10] });
      api.set(el.$('.pedido'), { clip: 'inset(0 0 52% 0)' });
      api.set(el.$('.frase'), { o: 0 });
    },
  },
});
}
