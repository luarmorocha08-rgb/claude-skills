/* gancho — "O gancho" (2,5 s)
   Ideia: um cursor dourado pisca no escuro e escreve a promessa; a última palavra acende e,
   dela, as três criações saltam para a órbita em volta da IA. */
{
const ICONES = [
  ['laptop', 'i-laptop'], ['video_game', 'i-jogo'], ['mobile_phone', 'i-fone'], ['robot', 'i-robo'], ['rocket', 'i-foguete'],
];
Motion.cena('gancho', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio">
      <svg class="orbita" viewBox="0 0 100 40" preserveAspectRatio="none"><ellipse cx="50" cy="20" rx="49" ry="19" /></svg>
      <div class="heroi"><div class="aro"></div>${c.foto('sparkles', { classe: 'faisca' })}</div>
      ${ICONES.map(([n, k]) => `<div class="icone ${k}">${c.foto(n)}</div>`).join('')}
    </div>
    <div class="camada c-perto">
      <div class="coluna topo">
        <p class="rotulo">IA na prática</p>
        <h1 class="titulo frase"><span class="l1">Um prompt.</span><br><span class="l2">Três <span class="destaque">criações</span>.</span><span class="cursor"></span></h1>
      </div>
      <span class="cursor cursor-voo"></span>
      <div class="coluna base rodape"><div class="monograma">RR</div><span class="arroba">@ramosraul.ia</span></div>
    </div>`,
  montar(el, api) {
    el.cur = window.prepCursor(el, api, '.frase .cursor');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.l1 = el.pal.filter((p) => p.linha === 0);
    el.l2 = el.pal.filter((p) => p.linha !== 0);
    el.T1 = 0.12; el.T2 = 0.5; el.C = 0.12;
    // por onde o cursor passa: começo da linha 1, fim de cada palavra
    const ini = el.l1[0];
    el.marcos = [{ t: 0, x: ini.x0 - el.cur.l * 1.6, y: ini.cy - el.cur.a / 2 }];
    el.l1.forEach((p, i) => el.marcos.push({ t: el.T1 + el.C * i, x: p.x0 + p.l + el.cur.l * 0.6, y: p.cy - el.cur.a / 2 }));
    el.l2.forEach((p, i) => el.marcos.push({ t: el.T2 + el.C * i, x: p.x0 + p.l + el.cur.l * 0.6, y: p.cy - el.cur.a / 2 }));
    el.marcos[el.marcos.length - 1].x = el.cur.fim[0];
    el.marcos[el.marcos.length - 1].y = el.cur.fim[1];
    el.heroi = el.$('.heroi'); el.aro = el.$('.aro'); el.faisca = el.$('.faisca');
    el.orbita = el.$('.orbita'); el.rodape = el.$('.rodape'); el.luz = el.$('.luz');
    const hc = api.caixa(el.heroi);
    el.icones = el.$$('.icone').map((ic, i) => {
      const c = api.caixa(ic);
      return { el: ic, dx: hc.cx - c.cx, dy: hc.cy - c.cy, t0: 1.0 + [0, 0.09, 0.16, 0.22, 0.27][i] };
    });
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: 0 }, { el: el.$('.c-perto'), z: 0.25 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, ease, lerp, suave, spring, vida } = api;
    tipo.focar(t, el.rot, { inicio: 0.0 });
    const a = tipo.focar(t, el.l1, { inicio: el.T1 - el.C * el.l1[0].i, cascata: el.C, cascataMax: 0, aplicar: false });
    const b = tipo.focar(t, el.l2, { inicio: el.T2 - el.C * el.l2[0].i, cascata: el.C, cascataMax: 0, aplicar: false });
    tipo.aplicar(el.l1, a); tipo.aplicar(el.l2, b);
    tipo.varrerDestaque(t, el.pal, { inicio: 0.78, dur: 0.45 });
    tipo.derivaDestaque(t, el.pal, { inicio: 1.3 });

    // o cursor corre atrás da escrita (cada passo em ~80 ms, com curva forte)
    let x = el.marcos[0].x, y = el.marcos[0].y;
    for (let i = 1; i < el.marcos.length; i++) {
      const m = el.marcos[i], e = ease.forte(prog(t, m.t, m.t + 0.09));
      x = lerp(x, m.x, e); y = lerp(y, m.y, e);
    }
    window.posCursor(el.cur, api, t, [x, y], suave(prog(t, 0, 0.06)) * window.piscar(t, api));

    // a IA nasce quente do centro, com mola curta; o aro se abre em volta
    const h0 = 0.75;
    const mh = spring(t - h0, { freq: 1.4, damp: 6.2 });
    api.set(el.heroi, { s: 0.7 + 0.3 * mh, o: suave(prog(t, h0, h0 + 0.12)), bright: 1 + 0.5 * (1 - ease.outCubic(prog(t, h0, h0 + 0.7))) });
    api.set(el.faisca, { r: -40 * (1 - ease.forte(prog(t, h0, h0 + 0.8))) + 3 * vida(t, { inicio: 1.6, periodo: 3.8 }), s: 1 + 0.03 * vida(t, { inicio: 1.6, periodo: 2.3, fase: 0.25 }) });
    api.set(el.aro, { s: 0.86 + 0.14 * ease.forte(prog(t, h0 + 0.05, h0 + 0.7)), o: suave(prog(t, h0 + 0.05, h0 + 0.35)) });

    // a órbita se desenha do centro para as pontas; os ícones saltam do aro
    const ob = ease.forte(prog(t, 0.95, 1.6));
    api.set(el.orbita, { clip: `inset(0 ${(50 * (1 - ob)).toFixed(2)}% 0 ${(50 * (1 - ob)).toFixed(2)}%)`, o: suave(prog(t, 0.95, 1.1)) });
    el.icones.forEach((ic, i) => {
      const m = spring(t - ic.t0, { freq: 1.5, damp: 6.4 });
      const flut = vida(t, { inicio: ic.t0 + 0.5, periodo: 2.6 + i * 0.37, amp: 0.7, fase: i * 0.21 });
      api.set(ic.el, {
        x: ic.dx * (1 - m), y: ic.dy * (1 - m) + flut,
        s: 0.4 + 0.6 * m, r: 14 * (1 - m) * (i % 2 ? 1 : -1) + 2 * vida(t, { inicio: ic.t0 + 0.5, periodo: 3.1 + i * 0.29, fase: 0.1 * i }),
        o: suave(prog(t, ic.t0, ic.t0 + 0.08)),
      });
    });
    window.subir(t, api, el.rodape, 1.45);
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: lerp(1.06, 1, ease.forte(prog(t, 0, 1.1))) * api.viva(t) });
  },
});
}
