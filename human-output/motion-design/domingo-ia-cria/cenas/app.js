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
  montar(el, api) {
    el.fone = el.$('.fone');
    el.topo = [el.$('.ola'), el.$('.nome')];
    el.cards = [el.$('.treino'), el.$('.semana'), el.$('.dupla')];
    el.barras = el.$$('.barras i');
    el.hoje = el.$('.col.hoje');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: 0 }, { el: el.$('.c-perto'), z: 0.2 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, suave, ease, spring, vida } = api;
    const m = spring(t, { freq: 1.4, damp: 6.4 });
    api.midia.mockup(el.fone, { ry: -30 * (1 - m) + 3 * vida(t, { inicio: 1.2, periodo: 4.2 }), rx: 10 * (1 - m), s: 0.84 + 0.16 * m, y: 6 * (1 - m) });
    el.topo.forEach((p, i) => window.subir(t, api, p, 0.1 + 0.06 * i, { y: 1.2, blur: 0.2 }));
    [0.25, 0.34, 0.42].forEach((t0, i) => window.subir(t, api, el.cards[i], t0, { y: 2.6, blur: 0.3 }));
    // as barras crescem uma a uma; a de hoje por último, passa um fio e acende dourada na batida 2
    el.barras.forEach((b, i) => {
      const t0 = 0.6 + 0.05 * i;
      const ultimo = i === el.barras.length - 1;
      const k = ultimo ? spring(t - t0, { freq: 1.6, damp: 6 }) : ease.forte(prog(t, t0, t0 + 0.45));
      api.set(b, { sy: Math.max(0.02, k), origem: '50% 100%', o: suave(prog(t, t0, t0 + 0.06)), sat: ultimo ? 0.15 + 0.85 * suave(prog(t, 0.95, 1.2)) : 1, bright: ultimo ? 1 + 0.12 * vida(t, { inicio: 1.3, periodo: 1.6 }) : 1 });
    });
    tipo.focar(t, el.rot, { inicio: 0.12 });
    tipo.focar(t, el.pal, { inicio: 0.22 });
    tipo.varrerDestaque(t, el.pal, { inicio: 0.6, dur: 0.45 });
    tipo.derivaDestaque(t, el.pal, { inicio: 1.2 });
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: api.viva(t) });
  },
});
}
