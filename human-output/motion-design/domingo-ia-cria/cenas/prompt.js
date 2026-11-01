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
      <span class="cursor cursor-voo"></span>
      <div class="coluna meio-esq"><h2 class="titulo frase">Eu só<br><span class="destaque">descrevo</span>.</h2></div>
    </div>`,
  montar(el, api) {
    const ped = el.$('.pedido');
    el.cur = window.prepCursor(el, api, '.pedido .cursor');
    // cada caractere do pedido vira um span (a quebra de linha não muda); mede onde o cursor passa
    const txt = ped.firstChild.textContent;
    ped.firstChild.replaceWith(...[...txt].map((ch) => { const sp = document.createElement('span'); sp.className = 'ch'; sp.textContent = ch; return sp; }));
    el.chs = el.$$('.pedido .ch').map((c) => { const k = api.caixa(c); return { el: c, x: k.x + k.l, y: k.cy - el.cur.a / 2 }; });
    el.T0 = 0.38; el.CPS = 40;
    el.card = el.$('.card-prompt'); el.cabeca = el.$('.cabeca');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: -0.1 }, { el: el.$('.c-perto'), z: 0.2 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, suave, ease } = api;
    window.animarFacetas(t, el, api, { inicio: 0.0, dur: 1.3, de: [-38, -52] });
    tipo.focar(t, el.rot, { inicio: api.inicioEntrada(0.02, -0.12) });
    window.chegar(t, api, el.card, { inicio: api.inicioEntrada(0.1, -0.08), de: { s: 0.92, y: 3 } });
    window.subir(t, api, el.cabeca, 0.24, { y: 1 });
    // digitação: um caractere a cada 25 ms, cada um entra em 3 quadros
    const n = el.chs.length;
    el.chs.forEach((c, i) => api.set(c.el, { o: suave(prog(t, el.T0 + i / el.CPS, el.T0 + i / el.CPS + 0.05)) }));
    const k = Math.max(-1, Math.min(n - 1, Math.floor((t - el.T0) * el.CPS)));
    const ultimo = k === n - 1;
    const pos = k < 0 ? [el.chs[0].x - el.chs[0].el.offsetWidth / (api.largura / 100), el.chs[0].y] : (ultimo ? el.cur.fim : [el.chs[k].x + el.cur.l * 0.4, el.chs[k].y]);
    const digitando = t < el.T0 + n / el.CPS + 0.1;
    window.posCursor(el.cur, api, t, pos, suave(prog(t, 0.3, 0.36)) * (digitando ? 1 : window.piscar(t, api)));
    tipo.focar(t, el.pal, { inicio: 1.75 });
    tipo.varrerDestaque(t, el.pal, { inicio: 2.0, dur: 0.45 });
    tipo.derivaDestaque(t, el.pal, { inicio: 2.4 });
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: api.viva(t) });
  },
});
}
