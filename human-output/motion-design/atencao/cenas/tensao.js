/* tensao — "O gancho" (4,5 s)
   Ideia: a palavra ATENÇÃO, cortada ao meio, se reencontra devagar: as metades vêm das bordas e
   chegam a um fio uma da outra, sem nunca encostar. Um relógio honesto conta os segundos. */
{
const PALAVRA = 'ATENÇÃO';
Motion.cena('tensao', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <div class="relogio">
      <p class="apoio rotulo">você está aqui há</p>
      <p class="titulo num"><span class="n">5</span></p>
      <p class="apoio un">segundos</p>
    </div>
    <div class="corte" data-ponte="corte">
      <div class="brasa"></div>
      <div class="metade cima"><span class="palavra">${PALAVRA}</span></div>
      <div class="metade baixo"><span class="palavra">${PALAVRA}</span></div>
      <div class="fenda"></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.cima'), { y: -62 });
      api.set(el.$('.baixo'), { y: 62 });
      api.set([el.$('.fenda'), el.$('.brasa')], { o: 0 });
      api.set(el.$('.relogio'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.cima'), { y: -7 });
      api.set(el.$('.baixo'), { y: 7 });
      api.set(el.$('.fenda'), { o: 0.35 });
      api.set(el.$('.brasa'), { o: 0.25 });
      el.$('.n').textContent = '2';
    },
  },

  montar(el, api) {
    el.cima = el.$('.cima'); el.baixo = el.$('.baixo');
    el.fenda = el.$('.fenda'); el.brasa = el.$('.brasa'); el.luz = el.$('.luz');
    el.relogio = el.$('.relogio'); el.n = el.$('.n'); el.num = el.$('.num'); el.un = el.$('.un');
    el.cam = api.camera({ origem: [50, 54] });
  },

  // as metades: batem na tela com peso (0,45 s) e depois rastejam, cada vez mais devagar, sem nunca encostar
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, clamp } = api;
    const dist = (u) => 150 - 133 * ease.outExpo(prog(u, -0.07, 0.45)) - 16.7 * ease.outQuad(prog(u, 0.3, 4.1)) - 0.05 * prog(u, 4.1, 4.5);
    const d = dist(t);
    const v = (dist(t + 1 / 120) - dist(t - 1 / 120)) * 60; // cqw/s
    const BATE = 0.42;
    const tr = api.tremor(t, BATE, { forca: 0.5, freq: 10 });
    const fio = suave(prog(t, 3.0, 3.8));
    const mi = 0.05 * fio * api.ruido(t, 3, { freq: 7 });
    api.set(el.cima, { y: -(d - 0.28) + tr.y + mi });
    api.set(el.baixo, { y: d - 0.28 - tr.y - mi });
    api.fx.obturador(el.cima, 0, v);
    api.fx.obturador(el.baixo, 0, v);

    // batimento: a brasa pulsa em batidas cada vez mais próximas, cada uma mais quente
    const bat = [1.0, 1.75, 2.35, 2.85, 3.25, 3.58, 3.85, 4.08, 4.28];
    let pulso = 0;
    bat.forEach((tb, i) => { pulso += api.pulsoSemQuique(t - tb, 0.07) * (0.25 + 0.06 * i); });
    const acende = suave(prog(t, 0.9, 3.4));
    api.set(el.fenda, { o: Math.min(1, acende * (0.85 + 0.4 * pulso)) + 0.9 * api.pulsoSemQuique(t - BATE, 0.04) * (1 - acende), sx: lerp(0.2, 1, ease.forte(prog(t, 0.35, 3.2))), bright: 1 + 0.8 * pulso });
    const calor = Math.pow(clamp(prog(t, 0.4, 4.0)), 1.3);
    api.set(el.brasa, { o: Math.min(1.2, calor * (1 + 0.5 * pulso) + 0.5 * api.pulsoSemQuique(t - BATE, 0.05)), sx: lerp(0.6, 1, calor) * (1 + 0.05 * pulso) });
    api.fx.respirar(t, el.luz, { periodo: 3.1, amp: 0.1, base: 0.22 });

    // o relógio: entra em 1 s, cada segundo vira na hora certa, sai antes do corte
    const n = clamp(Math.floor(t), 1, 4);
    el.n.textContent = String(n);
    el.un.textContent = n === 1 ? 'segundo' : 'segundos';
    const entra = ease.forte(prog(t, 0.9, 1.4));
    const sai = ease.inCubic(prog(t, 4.25, 4.5));
    api.set(el.relogio, { o: suave(prog(t, 0.9, 1.08)) * (1 - sai), blur: 0.9 * (1 - entra) + 0.8 * sai, y: 2.2 * (1 - entra) - 2 * sai });
    const f = t - Math.floor(t);
    const vira = t < 2 ? 1 : ease.forte(prog(f, 0, 0.4));
    const vai = t < 4 ? ease.inCubic(prog(f, 0.86, 1)) : 0;
    api.set(el.num, { y: 1.6 * (1 - vira) - 1.2 * vai, blur: 0.5 * (1 - vira) + 0.5 * vai, o: (t < 2 ? 1 : suave(prog(f, 0, 0.16))) * (1 - vai) });

    // câmera: nasce perto e recebe o peso da batida; depois empurra devagar na fenda
    const perto = 1 + 0.16 * (1 - ease.forte(prog(t, 0, 0.8)));
    const kick = 1 + 0.03 * api.pulsoSemQuique(t - BATE, 0.06);
    const push = 1 + 0.06 * (ease.inOutSine(prog(t, 0.6, 4.5)) - ease.inOutSine(prog(4.0, 0.6, 4.5)));
    el.cam.pose({ zoom: perto * kick * push, x: tr.x * 0.4 + 0.06 * fio * api.ruido(t, 9, { freq: 6 }), y: 0.06 * fio * api.ruido(t, 11, { freq: 6 }), giro: tr.giro * 0.5 });
  },
});
}
