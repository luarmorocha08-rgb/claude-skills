/* tensao — "O gancho" (6 s)
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

  // as metades: entram rápidas e vão freando como se nunca fossem chegar (meio-gap em cqw)
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, clamp } = api;
    let d = 104 - 82 * ease.forte(prog(t, 0, 1.2)) - 21.7 * ease.outQuad(prog(t, 0.6, 5.3)) - 0.06 * prog(t, 5.3, 6);
    // a um fio: dois micro-avanços e um tremor mínimo
    const fio = suave(prog(t, 4.3, 5.0));
    const tr = 0.05 * fio * (api.ruido(t, 3, { freq: 7 }));
    api.set(el.cima, { y: -(d - 0.28) + tr });
    api.set(el.baixo, { y: d - 0.28 - tr });

    // a fenda acende do centro para as pontas; a brasa esquenta conforme falta menos
    const acende = suave(prog(t, 2.6, 4.6));
    api.set(el.fenda, { o: acende * (0.9 + 0.1 * Math.sin(t * 5.3)), sx: lerp(0.15, 1, ease.forte(prog(t, 2.6, 4.4))) });
    const calor = Math.pow(clamp(prog(t, 1.2, 5.4)), 1.6);
    api.set(el.brasa, { o: calor * (1 + 0.06 * api.vida(t, { periodo: 2.3, inicio: 4.8 })), sx: lerp(0.6, 1, calor) });
    api.fx.respirar(t, el.luz, { periodo: 4.1, amp: 0.08, base: 0.22 });

    // o relógio: entra em 1 s, cada segundo vira na hora certa, sai antes do corte
    const n = clamp(Math.floor(t), 1, 5);
    el.n.textContent = String(n);
    el.un.textContent = n === 1 ? 'segundo' : 'segundos';
    const entra = ease.forte(prog(t, 0.95, 1.5));
    const sai = ease.inCubic(prog(t, 5.72, 6.0));
    api.set(el.relogio, { o: suave(prog(t, 0.95, 1.15)) * (1 - sai), blur: 0.9 * (1 - entra) + 0.8 * sai, y: 2.2 * (1 - entra) - 2 * sai });
    const f = t - Math.floor(t);
    const vira = t < 2 ? 1 : ease.forte(prog(f, 0, 0.4));
    // o número velho sobe e se desfaz um fio antes de virar; o novo sobe de pertinho
    const vai = t < 5 ? ease.inCubic(prog(f, 0.86, 1)) : 0;
    api.set(el.num, { y: 1.6 * (1 - vira) - 1.2 * vai, blur: 0.5 * (1 - vira) + 0.5 * vai, o: (t < 2 ? 1 : suave(prog(f, 0, 0.16))) * (1 - vai) });

    // câmera: push-in lento na fenda, um tremor mínimo a um fio
    const z = 1 + 0.05 * (ease.inOutSine(prog(t, 0, 6)) - ease.inOutSine(prog(5.4, 0, 6)));
    el.cam.pose({ zoom: z, x: 0.06 * fio * api.ruido(t, 9, { freq: 6 }), y: 0.06 * fio * api.ruido(t, 11, { freq: 6 }) });
  },
});
}
