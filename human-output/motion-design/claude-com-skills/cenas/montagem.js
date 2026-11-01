/* montagem — "Em ação" (10,93 s = duas frases da música; o primeiro quadro cheio em t = 0,5)
   Ideia: um ofício por compasso (4 batidas = 1,304 s), oito no total. Em cada um, o artefato chega
   grande pela direita num chicote, girado em 3D, e as peças dele (células, barras, linhas, quadros)
   saltam no lugar acompanhando as batidas; o nome do ofício sai do desfoque do outro lado. No fim
   do compasso tudo sai pela esquerda acelerando e o próximo já entra pela direita: um movimento
   contínuo, como uma câmera que corre de mesa em mesa. Os lados alternam a cada compasso.
   Os primeiros 0,5 s acontecem por baixo da travessia da cena anterior. */
{
const P = 0.3261, BAR = 4 * P, T0 = 0.5;
const SEQ = [1, 2, 3, 4, 5, 6, 7, 0]; // termina em Motion design
const PECAS = '.cel, .ar-grafico i, .sb-q, .cp-p, .cd-lin, .ar-chave, .sl-tit, .sl-sub, .sl-barras i, .sl-lin i, .pg-tit, .ar-pagina > i, .ar-fz';

Motion.cena('montagem', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      ${SEQ.map((k, i) => `
        <div class="tomada t${i} ${i % 2 ? 'invertida' : ''}">
          <div class="lado-palavra"><h2 class="titulo palavra">${OFICIOS[k].nome}</h2></div>
          <div class="lado-obj">${Cartoes.html(k, { classe: 'grande' })}</div>
        </div>`).join('')}
    </div>`,

  montar(el, api) {
    el.tomadas = el.$$('.tomada').map((tm, i) => {
      const cartao = tm.querySelector('.cartao');
      const pecas = [...cartao.querySelectorAll(PECAS)];
      return {
        el: tm, i, inv: i % 2 === 1,
        s: T0 + i * BAR,
        palavra: tm.querySelector('.lado-palavra'),
        obj: tm.querySelector('.lado-obj'),
        cartao,
        letras: (api.tipo.caber(tm.querySelector('.palavra'), { largura: 0.41, max: 17 }), api.tipo.dividir(tm.querySelector('.palavra'), { por: 'letra' })),
        pecas: pecas.map((e, n) => ({ el: e, n, f: pecas.length > 1 ? n / (pecas.length - 1) : 0 })),
        fz: cartao.querySelector('.faisca'),
      };
    });
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, set, tipo } = api;
    const pulso = PulsoGrade(t, T0, P, { decai: 0.12 });
    el.tomadas.forEach((tm) => {
      const u = t - tm.s;
      // panorâmica contínua: o próximo entra pela direita enquanto este sai pela esquerda, sem
      // nada sumir na tela (cada um só desaparece quando já está fora do quadro)
      const ativo = u > -0.2 && u < BAR + 0.2;
      const ent = ease.outExpo(prog(u, -0.12, 0.42));
      const sai = ease.inCubic(prog(u, BAR - 0.2, BAR + 0.12));
      const vel = 90 * (1 - ent) * (u < 0.42 ? 1 : 0) + 110 * sai;
      const lado = tm.inv ? -1 : 1; // onde o objeto mora (1 = direita)
      set(tm.obj, {
        x: 80 * (1 - ent) - 112 * sai,
        ry: -16 * lado * (1 - 0.4 * ent) + 10 * (1 - ent), persp: 1400,
        s: lerp(0.92, 1, ent) * (1 + 0.012 * pulso) * (1 + 0.012 * Math.max(0, u)),
        o: ativo ? 1 : 0,
        blur: 0.012 * vel,
      });
      set(tm.palavra, {
        x: 84 * (1 - ent) - 108 * sai,
        o: ativo ? 1 : 0,
        blur: 0.008 * vel,
      });
      if (!ativo) {
        tipo.focar(-10, tm.letras, { inicio: 0 });
        tm.pecas.forEach((pc) => set(pc.el, { o: 0 }));
        return;
      }
      tipo.focar(u, tm.letras, { inicio: 0.06, cascata: 0.016, dur: 0.45 });
      // as peças saltam no lugar ao longo das três primeiras batidas (objeto: mola curta)
      tm.pecas.forEach((pc) => {
        const t0 = 0.12 + pc.f * 2.6 * P;
        const q = prog(u, t0, t0 + 0.36);
        set(pc.el, {
          o: suave(prog(u, t0, t0 + 0.1)),
          s: lerp(0.7, 1, Math.min(1.05, ease.outBack(2)(q))),
          y: 1.5 * (1 - ease.outExpo(q)),
          px: false,
        });
      });
      if (tm.fz) tm.fz.style.transform = `rotate(${(30 * u).toFixed(3)}deg)`;
    });
    // a luz troca de lado a cada compasso, sempre por trás do objeto
    const i = Math.max(0, Math.min(7, Math.floor((t - T0) / BAR)));
    const lado = i % 2 ? -1 : 1;
    el.luz.style.setProperty('--luz-a-x', `${(50 + 16 * lado).toFixed(2)}%`);
    api.fx.respirar(t, el.luz, { periodo: 2.6, amp: 0.06, base: 1 + 0.1 * pulso });
    el.cam.pose({ zoom: 1 + 0.006 * pulso + 0.004 * (t - 5), giro: 0.8 * Math.sin((2 * Math.PI * t) / 5.2) });
  },
});
}
