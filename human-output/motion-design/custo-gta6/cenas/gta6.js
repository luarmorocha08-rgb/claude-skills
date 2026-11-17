/* gta6 — "O agora · GTA VI" (6,5 s)
   Ideia: a torre de GTA VI rompe a linha do mar e não para de subir: fura o topo do quadro, e o
   número sai de onde GTA V parou (265 mi) e rola até 2.000 mi, virando "2 bi".
   Batidas: 0 a torre rompe · 1,0 fura o quadro (tremor) · b(2,5) etiqueta · b(3,5) contagem (trava em b(6))
   · b(6,5) "até" + nota · hold: a torre segue subindo · saída avancar-desfocar. */
Motion.cena('gta6', {
  render: () => `
    ${Vice.cenario({ classe: 'baixo' })}
    <div class="palco3d">${Vice.torre({ classe: 't6' })}</div>
    <div class="texto">
      <p class="etiqueta">GTA VI</p>
      <p class="apoio-n">até</p>
      <h2 class="titulo valor"><span class="destaque">US$ 2 bi</span></h2>
      <p class="nota">estimativas de US$ 1 a 2 bilhões</p>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.t6'), { vars: { '--h': '30cqmin' } });
      api.set(el.$('.texto'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.t6'), { vars: { '--h': '70cqmin' } });
      api.set([el.$('.valor'), el.$('.nota'), el.$('.apoio-n')], { o: 0 });
    },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.torre = el.$('.t6');
    el.valor = el.$('.valor .destaque');
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, b } = api;
    Vice.vida(t, el.V, api);
    // a torre: rompe o mar acelerando, fura o topo e segue subindo devagar
    const sobe = ease.inOutCubic(prog(t, 0, 1.6));
    const h = 4 + 136 * sobe + 3 * Math.max(0, t - 1.6);
    const ry = lerp(-44, -26, ease.forte(prog(t, 0, 2.4))) + 1.5 * (t - api.ref);
    api.set(el.torre, { vars: { '--h': `${h.toFixed(3)}cqmin`, '--ry': `${ry.toFixed(3)}deg` } });
    // texto
    const surge = (sel, t0, dy = 1.2) => {
      const e = ease.forte(prog(t, t0, t0 + 0.6));
      api.set(el.$(sel), { o: suave(prog(t, t0, t0 + 0.2)), y: dy * (1 - e), blur: 0.4 * (1 - e) });
    };
    api.set(el.$('.texto'), { o: 1 });
    surge('.etiqueta', b(2.5));
    surge('.apoio-n', b(6.5));
    surge('.nota', b(6.5) + 0.1);
    // contagem: de onde GTA V parou até 2.000 mi; na batida b(6) vira "2 bi" com um respiro de foco
    const troca = b(6) + 0.08;
    if (t < troca) api.tipo.contar(t, el.valor, { de: 265, ate: 2000, inicio: b(3.5), travar: b(6), prefixo: 'US$ ', sufixo: ' mi' });
    else el.valor.textContent = 'US$ 2 bi';
    const pulso = Math.sin(Math.PI * prog(t, b(6) - 0.04, b(6) + 0.2));
    const foco = 1 - ease.forte(prog(t, b(3.5), b(3.5) + 0.6));
    const ev = ease.forte(prog(t, b(3.5), b(3.5) + 0.6));
    api.set(el.$('.valor'), { o: suave(prog(t, b(3.5), b(3.5) + 0.2)), y: 1.6 * (1 - ev), blur: 0.25 * pulso + 0.4 * foco, bright: 1 + 0.5 * pulso });
    // câmera: contra-plongée viva; tremor curto quando a torre fura o quadro
    const tr = api.tremor(t, 1.0, { forca: 0.25 });
    el.cam.pose({ zoom: 1 + 0.008 * (t - api.ref), x: tr.x, y: tr.y, giro: tr.giro });
  },
});
