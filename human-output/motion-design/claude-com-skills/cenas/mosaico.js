/* mosaico — "Tudo isso" (5,217 s = uma frase da música)
   Ideia: os oito artefatos voltam e batem na mesa, um por batida, vindos de perto da câmera,
   montando um mosaico 4 × 2 que ocupa o quadro. Na batida 8 o mosaico recua e escurece e a frase
   "Tudo isso a partir de uma frase" sai do desfoque na frente (a rima com o pedido do começo). Na
   batida 14 tudo é tragado para o centro e vira o ponto de luz de onde o fecho nasce. */
{
const P = 0.3261;
const ORDEM = [0, 5, 2, 7, 4, 1, 6, 3]; // a ordem em que os cartões batem (salta pela grade)
const T = { recua: 8 * P, frase: 8 * P + 0.05, varre: 10 * P, suga: 14 * P, ponto: 14 * P + 0.2 };

Motion.cena('mosaico', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <div class="grade">${OFICIOS.map((o, k) => `<div class="vaga">${Cartoes.html(k)}</div>`).join('')}</div>
      <span class="veu"></span>
      <div class="pilha"><h2 class="titulo frase">Tudo isso a partir<br>de <span class="destaque">uma frase</span></h2></div>
      <span class="ponto ponto-luz"></span>
    </div>`,

  montar(el, api) {
    el.grade = el.$('.grade');
    const g = Pos(el.grade); // a grade é centrada por translate(-50%,-50%), que o layout não vê
    el.vagas = el.$$('.vaga').map((v, k) => { const q = Pos(v); return { el: v, k, t0: ORDEM.indexOf(k) * P, p: { x: q.x - g.x, y: q.y - g.y } }; });
    el.letras = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    el.destaque = el.letras.filter((p) => p.destaque);
    el.veu = el.$('.veu');
    el.ponto = el.$('.ponto');
    el.fzs = el.$$('.grade .faisca');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, set, tipo, fisica } = api;
    const recua = ease.inOutSine(prog(t, T.recua - 0.05, T.recua + 0.5));
    const suga = ease.inCubic(prog(t, T.suga, T.suga + 0.36));
    let choque = 0;
    el.vagas.forEach((v) => {
      const q = prog(t, v.t0 - 0.24, v.t0);
      const chega = ease.inOutSine(q) * 0.35 + ease.inQuad(q) * 0.65; // acelera até bater
      choque += Pulso(t, v.t0, { decai: 0.15 });
      const mola = t > v.t0 ? 1 - 0.035 * Math.sin(Math.min(1, (t - v.t0) / 0.04) * Math.PI / 2) * Math.exp(-(t - v.t0) * 8) * Math.cos((t - v.t0) * 24) : 1;
      set(v.el, {
        s: lerp(1.9, 1, chega) * mola * lerp(1, 0.15, suga),
        x: -v.p.x * suga * 0.98,
        y: -v.p.y * suga * 0.98,
        r: lerp(v.k % 2 ? 8 : -8, 0, chega),
        o: suave(prog(t, v.t0 - 0.24, v.t0 - 0.15)) * (1 - suave(prog(suga, 0.6, 1))),
        blur: 0.7 * (1 - chega) + 0.18 * recua + 0.3 * suga,
        bright: (1 - 0.6 * recua) * (1 + 1.5 * suga),
      });
    });
    el.fzs.forEach((f) => { f.style.transform = `rotate(${(20 * t).toFixed(3)}deg)`; });
    set(el.grade, { s: lerp(1, 0.92, recua) * (1 + 0.004 * choque) });
    el.veu.style.opacity = (0.85 * recua * (1 - suga)).toFixed(4);

    // a frase: sai do desfoque na frente; na batida 14 é tragada junto com tudo para o centro
    tipo.aplicar(el.letras,
      tipo.focar(t, el.letras, { inicio: T.frase, cascata: 0.02, aplicar: false }),
      tipo.sugar(t, el.letras, { inicio: T.suga, dur: 0.32, ponto: [0, 0], aplicar: false }));
    tipo.varrerDestaque(t, el.letras, { inicio: T.varre, dur: 0.45 });

    const cresce = ease.inCubic(prog(t, T.suga + 0.1, T.suga + 0.36));
    set(el.ponto, { s: 0.15 + 0.55 * cresce + 0.3 * ease.outCubic(prog(t, T.suga + 0.32, api.dur)), o: cresce, bright: 1 + 0.6 * cresce * Math.sin(Math.PI * prog(t, T.suga + 0.3, api.dur)) });
    el.luz.style.setProperty('--luz-a-y', `${(50 - 6 * ease.inOutSine(prog(t, T.suga, api.dur))).toFixed(2)}%`);
    api.fx.respirar(t, el.luz, { periodo: 3, amp: 0.07, base: 1 + 0.1 * Math.min(1, choque) });
    el.luz.style.opacity = (1 - 0.6 * suga).toFixed(4);
    el.cam.pose({ zoom: (1 + 0.012 * t) * (1 + 0.006 * Math.min(1, choque)), giro: 0.8 * Math.sin((2 * Math.PI * t) / 6) });
  },
});
}
