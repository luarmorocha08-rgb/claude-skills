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
      <span class="cursor cursor-voo"></span>
      <div class="coluna base">
        <div class="chamada">${c.foto('sparkles', { classe: 'mini' })}<span>Comenta a sua ideia e segue pra ver ela nascer aqui.</span></div>
        <div class="rodape"><div class="monograma">RR</div><span class="arroba">@ramosraul.ia</span><span class="seguir">Seguir <b>+</b></span></div>
      </div>
    </div>`,
  montar(el, api) {
    el.cur = window.prepCursor(el, api, '.frase .cursor');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.let = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    const nl = Math.max(...el.let.map((p) => p.linha));
    el.l12 = el.let.filter((p) => p.linha < nl);
    el.l3 = el.let.filter((p) => p.linha === nl);
    el.T3 = 1.05; el.C3 = 0.065;
    el.chamada = el.$('.chamada');
    el.rodape = el.$('.rodape'); el.mono = el.$('.monograma'); el.arroba = el.$('.arroba'); el.seguir = el.$('.seguir'); el.mais = el.$('.seguir b');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: -0.1 }, { el: el.$('.c-perto'), z: 0.2 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, suave, ease, lerp, pulsoSemQuique } = api;
    window.animarFacetas(t, el, api, { inicio: 0.0, dur: 1.05, de: [-45, -25], espalhar: 1.2 });
    tipo.focar(t, el.rot, { inicio: api.inicioEntrada(0.25, -0.1) });
    tipo.focar(t, el.l12, { inicio: 0.45, cascata: 0.022 });
    tipo.focar(t, el.l3, { inicio: el.T3 - el.C3 * el.l3[0].i, cascata: el.C3, cascataMax: 0, dur: 0.35 });
    tipo.varrerDestaque(t, el.let, { inicio: 1.55, dur: 0.45 });
    tipo.brilho(t, el.l3, { inicio: 2.45, dur: 0.75, forca: 0.45 });
    // o cursor escreve a última linha, letra a letra
    const n = el.l3.length;
    const k = Math.floor((t - el.T3) / el.C3);
    const alvo = k < 0 ? el.l3[0] : el.l3[Math.min(n - 1, k)];
    let pos = k < 0 ? [alvo.x0 - el.cur.l * 1.2, alvo.cy - el.cur.a / 2] : [alvo.x0 + alvo.l + el.cur.l * 0.5, alvo.cy - el.cur.a / 2];
    if (k >= n - 1) pos = el.cur.fim;
    const escrevendo = t < el.T3 + n * el.C3 + 0.1;
    window.posCursor(el.cur, api, t, pos, suave(prog(t, 0.95, 1.02)) * (escrevendo ? 1 : window.piscar(t, api)));
    window.chegar(t, api, el.chamada, { inicio: 1.5, de: { s: 0.9, y: 2 }, freq: 1.6, damp: 7 });
    window.subir(t, api, el.mono, 1.75); window.subir(t, api, el.arroba, 1.8);
    window.subir(t, api, el.seguir, 2.0);
    api.set(el.mais, { s: 1 + 0.45 * pulsoSemQuique(prog(t, 2.55, 3.05), 0.3), bright: 1 + 0.4 * pulsoSemQuique(prog(t, 2.55, 3.05), 0.3) });
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: api.viva(t, { v: 0.008 }) });
    // o fim apaga sozinho até o fundo, com curva macia (o loop recomeça no cursor da abertura)
    api.set(el.raiz, { o: 1 - suave(prog(t, 2.95, 3.5)) });
  },
});
}
