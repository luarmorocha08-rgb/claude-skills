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
          <h3>Aprenda IA no<br><span class="ital">seu ritmo</span><span class="cursor"></span></h3>
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
  montar(el, api) {
    el.janela = el.$('.janela');
    el.pecas = [el.$('.nav'), el.$('.kicker'), ...api.tipo.dividir(el.$('.hero h3'), { por: 'linha' }).map((p) => p.el), el.$('.cta')];
    el.cursos = el.$$('.curso');
    el.barras = el.$$('.barra i');
    el.cursor = el.$('.hero .cursor');
    el.site = el.$('.site');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: 0 }, { el: el.$('.c-perto'), z: 0.2 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, suave, ease, spring, vida } = api;
    // a janela herda o mergulho e endireita com mola curta
    const m = spring(t, { freq: 1.4, damp: 6.4 });
    api.midia.mockup(el.janela, { rx: 18 * (1 - m), ry: -8 * (1 - m) + 1.2 * vida(t, { inicio: 1.2, periodo: 4.4 }), s: 0.86 + 0.14 * m });
    // a página se escreve de cima para baixo
    el.pecas.forEach((p, i) => window.subir(t, api, p, 0.15 + 0.07 * i, { y: 1.6, blur: 0.25 }));
    const tc = [0.75, 0.84, 0.91];
    el.cursos.forEach((c, i) => window.chegar(t, api, c, { inicio: tc[i], de: { y: 4, s: 0.94 }, freq: 1.6, damp: 7 }));
    el.barras.forEach((b, i) => api.set(b, { sx: ease.forte(prog(t, tc[i] + 0.25, tc[i] + 0.95)), origem: '0% 50%' }));
    api.set(el.cursor, { o: suave(prog(t, 0.36, 0.42)) * window.piscar(t, api) });
    tipo.focar(t, el.rot, { inicio: 0.12 });
    tipo.focar(t, el.pal, { inicio: 0.22 });
    tipo.varrerDestaque(t, el.pal, { inicio: 0.6, dur: 0.45 });
    tipo.derivaDestaque(t, el.pal, { inicio: 1.2 });
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: api.viva(t) });
  },
});
}
