/* plataforma — "01 · A plataforma" (3 s)
   Ideia: o card do pedido vira a janela do navegador; a plataforma se monta peça a peça,
   de cima para baixo, como se a IA estivesse escrevendo a página na nossa frente. */
{
const CURSOS = [['robot', 'IA do zero'], ['rocket', 'Lance seu app'], ['sparkles', 'Prompts que vendem']];
Motion.cena('plataforma', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio"><div class="aparelho">${c.mockup('navegador', { classe: 'janela', tela: `
      <div class="site">
        <div class="nav"><i class="marca"></i><b></b><b></b><b></b><em></em></div>
        <div class="hero">
          <p class="kicker">Plataforma de cursos</p>
          <h3>Aprenda IA no<br><span>seu ritmo</span><span class="cursor"></span></h3>
          <div class="cta"></div>
        </div>
        <div class="cursos">${CURSOS.map(([ic, t], i) => `
          <div class="curso"><div class="capa capa-${i}">${c.foto(ic)}</div><p>${t}</p><div class="barra"><i style="width:${[72, 38, 15][i]}%"></i></div></div>`).join('')}
        </div>
      </div>` })}</div></div>
    <div class="camada c-perto"><div class="coluna topo">
      <p class="rotulo">01 · Plataforma</p>
      <h2 class="titulo frase">Uma <span class="destaque">plataforma</span><br>de cursos.</h2>
    </div></div>`,
  poses: {
    inicio: (el, api) => {
      api.midia.mockup(el.$('.janela'), { rx: 18, ry: -8, s: 0.8 });
      api.set(el.$$('.hero, .curso'), { o: 0 });
      api.set(el.$('.frase'), { o: 0 });
    },
    meio: (el, api) => {
      api.midia.mockup(el.$('.janela'), { rx: 6, ry: -4, s: 0.94 });
      el.$$('.curso').forEach((c, i) => api.set(c, i ? { o: 0, y: 3 } : {}));
    },
  },
});
}
