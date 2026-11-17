/* gta5 — "O antes · GTA V" (5,5 s)
   Ideia: em 2013, a torre de dinheiro de GTA V sobe da linha do mar, maço por maço, girando,
   e o valor viaja no topo dela.
   Batidas: 0 "2013" assenta · b(1) a torre rompe o mar · b(2) rótulo + contagem (trava em b(4)) ·
   b(5) nota · hold girando · saída empurrar para cima. */
Motion.cena('gta5', {
  render: () => `
    ${Vice.cenario({ classe: 'baixo' })}
    <div class="ano titulo" aria-hidden="true">2013</div>
    <div class="palco3d">${Vice.torre({ classe: 't5', rotulo: 'GTA V · 2013', valor: 'US$ 265 mi', nota: 'desenvolvimento + marketing' })}</div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.t5'), { vars: { '--h': '1cqmin', '--ry': '-70deg' } });
      api.set(el.$('.torre-rotulo'), { o: 0 });
      api.set(el.$('.ano'), { o: 0.3, s: 1.1 });
    },
    meio: (el, api) => {
      api.set(el.$('.t5'), { vars: { '--h': '18cqmin', '--ry': '-48deg' } });
      api.set(el.$('.t-nota'), { o: 0 });
    },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.torre = el.$('.t5');
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, b } = api;
    const ini = api.inicioEntrada(0);
    Vice.vida(t, el.V, api);
    // "2013" vazado assenta devagar no céu
    const a = ease.forte(prog(t, ini, 1.6));
    api.set(el.$('.ano'), { s: lerp(1.12, 1, a) * (1 + 0.004 * (t - api.ref)), o: suave(prog(t, ini, ini + 0.4)) });
    // a torre rompe o mar e sobe, com uma mola curta de objeto
    const h = 36 * api.spring(t - b(1), { freq: 0.9, damp: 5.6 });
    const ry = lerp(-70, -32, ease.forte(prog(t, 0.2, 2.6))) + 2 * (t - api.ref);
    api.set(el.torre, { vars: { '--h': `${Math.max(0.3, h).toFixed(3)}cqmin`, '--ry': `${ry.toFixed(3)}deg` } });
    // o rótulo nasce no topo; o valor conta e trava na batida
    const r = ease.forte(prog(t, b(2), b(2) + 0.6));
    api.set(el.$('.torre-rotulo'), { o: suave(prog(t, b(2), b(2) + 0.2)) });
    api.set(el.$('.t-nome'), { y: 1.2 * (1 - r), blur: 0.3 * (1 - r) });
    api.tipo.contar(t, el.$('.t-valor'), { de: 0, ate: 265, inicio: b(2), travar: b(4), prefixo: 'US$ ', sufixo: ' mi' });
    const n = ease.forte(prog(t, b(5), b(5) + 0.6));
    api.set(el.$('.t-nota'), { o: suave(prog(t, b(5), b(5) + 0.2)), y: 0.8 * (1 - n), blur: 0.25 * (1 - n) });
    // câmera: push-in contínuo de ~4 %
    el.cam.pose({ zoom: 1 + 0.008 * (t - api.ref) });
  },
});
