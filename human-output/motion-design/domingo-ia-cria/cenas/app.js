/* app — "03 · O app" (3 s)
   Ideia: o celular sobe de pé, a tela se monta card a card num rufar e a barra de hoje
   cresce por último e acende em dourado: o treino do dia fecha a semana. */
{
const DIAS = [['', 46], ['', 70], ['', 38], ['', 82], ['', 58], ['', 30], ['hoje', 96]];
Motion.cena('app', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio"><div class="aparelho">${c.mockup('celular', { classe: 'fone', tela: `
      <div class="ui">
        <p class="ola">Bom dia,</p><p class="nome">Raul</p>
        <div class="card treino"><div class="t-ic">${c.foto('rocket')}</div><div><p class="t1">Treino de hoje</p><p class="t2">25 min · corpo todo</p></div></div>
        <div class="card semana"><p class="t1">Sua semana</p>
          <div class="barras">${DIAS.map(([d, h], i) => `<div class="col${i === 6 ? ' hoje' : ''}"><i style="height:${h}%"></i><span>${d}</span></div>`).join('')}</div>
        </div>
        <div class="dupla"><div class="card mini"><p class="n">5</p><p class="t2">treinos</p></div><div class="card mini"><p class="n">2,4k</p><p class="t2">kcal</p></div></div>
      </div>` })}</div></div>
    <div class="camada c-perto"><div class="coluna topo">
      <p class="rotulo">03 · App</p>
      <h2 class="titulo frase">Um <span class="destaque">app</span><br>de treino.</h2>
    </div></div>`,
  poses: {
    inicio: (el, api) => {
      api.midia.mockup(el.$('.fone'), { ry: -30, rx: 10, s: 0.84, y: 6 });
      api.set(el.$$('.ui > *:not(.ola):not(.nome)'), { o: 0 });
      api.set(el.$('.frase'), { o: 0 });
    },
    meio: (el, api) => {
      api.midia.mockup(el.$('.fone'), { ry: -8, rx: 3, s: 0.96 });
      api.set(el.$$('.dupla'), { o: 0, y: 3 });
      el.$$('.barras i').forEach((b, i) => api.set(b, { sy: i < 3 ? 1 : 0.05, origem: '50% 100%' }));
    },
  },
});
}
