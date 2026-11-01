/* jogo — "02 · O jogo" (3 s)
   Ideia: o celular entra em pé e gira para o lado como quem vira um console; o mundo low-poly do
   jogo se ergue em camadas e o personagem do perfil vira o herói da fase. */
{
Motion.cena('jogo', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio"><div class="aparelho">${c.mockup('celular', { classe: 'fone-deitado', tela: `
      <div class="fase">
        <div class="ceu"></div><div class="sol"></div>
        <div class="montes m1"></div><div class="montes m2"></div><div class="montes m3"></div>
        <div class="pista"></div>
        <div class="heroi-jogo">${c.foto('personagem')}</div>
        <div class="moedas"><i></i><i></i><i></i><i></i></div>
        <div class="bloco b1"></div><div class="bloco b2"></div>
        <div class="hud"><span class="pontos">0450</span><span class="vidas"><i></i><i></i><i></i></span></div>
      </div>` })}</div>
      <div class="icone i-controle">${c.foto('joystick')}</div>
    </div>
    <div class="camada c-perto"><div class="coluna topo">
      <p class="rotulo">02 · Jogo</p>
      <h2 class="titulo frase">Um <span class="destaque">jogo</span><br>pro celular.</h2>
    </div></div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.aparelho'), { r: 90, s: 0.62 });
      api.set(el.$$('.montes, .pista, .heroi-jogo, .moedas, .bloco, .hud, .sol, .i-controle'), { o: 0 });
      api.set(el.$('.frase'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.aparelho'), { r: 18, s: 0.86 });
      api.set(el.$$('.heroi-jogo, .moedas, .bloco, .hud, .i-controle'), { o: 0 });
      api.set(el.$('.m3'), { y: 4 });
    },
  },
});
}
