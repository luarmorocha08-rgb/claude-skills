/* comparacao — "A comparação" (6 s)
   Ideia: a câmera recua e as duas torres aparecem lado a lado na proporção real
   (265 milhões contra até 2 bilhões): a pequena some ao pé da gigante, e o "7x" crava.
   Batidas: 0 recuo da câmera · b(1) GTA VI sobe 7,5× · b(3,5) "até" · b(4) "7x" pela lente + peso ·
   b(5) "mais caro" · b(8) brilho · b(10) o sol começa a afundar · saída esmaecer. */
Motion.cena('comparacao', {
  render: () => `
    ${Vice.cenario({ classe: 'baixo' })}
    <div class="palco3d">
      ${Vice.torre({ classe: 'c5', rotulo: 'GTA V', valor: 'US$ 265 mi' })}
      ${Vice.torre({ classe: 'c6', rotulo: 'GTA VI', valor: 'até US$ 2 bi' })}
    </div>
    <div class="texto">
      <p class="titulo ate">até</p>
      <h2 class="titulo vezes"><span class="destaque">7x</span></h2>
      <p class="titulo mais">mais caro</p>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.c6'), { vars: { '--h': '0.5cqmin' } });
      api.set(el.$('.c6 .torre-rotulo'), { o: 0 });
      api.set(el.$('.texto'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.vezes'), { o: 0, blur: 1 });
      api.set(el.$('.mais'), { o: 0 });
    },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.c5 = el.$('.c5');
    el.c6 = el.$('.c6');
    el.ate = api.tipo.dividir(el.$('.ate'), { por: 'palavra' });
    el.vezes = api.tipo.dividir(el.$('.vezes'), { por: 'letra' });
    el.mais = api.tipo.dividir(el.$('.mais'), { por: 'palavra' });
    el.cam = api.camera();
    el.P = el.cam.centro(el.$('.c5'));
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, b } = api;
    const V = el.V;
    Vice.vida(t, V, api);
    // as duas torres giram juntas
    const ry = -30 + 1.6 * (t - api.ref);
    api.set(el.c5, { vars: { '--ry': `${ry.toFixed(3)}deg` } });
    // GTA VI sobe até 7,5× a outra, com mola curta
    const h6 = 67.5 * api.spring(t - b(1), { freq: 0.95, damp: 5.8 });
    api.set(el.c6, { vars: { '--h': `${Math.max(0.3, h6).toFixed(3)}cqmin`, '--ry': `${ry.toFixed(3)}deg` }, style: { visibility: t < b(1) ? 'hidden' : 'visible' } });
    const r6 = ease.forte(prog(t, 1.4, 2.0));
    api.set(el.$('.c6 .torre-rotulo'), { o: suave(prog(t, 1.4, 1.6)), y: 1 * (1 - r6) });
    // texto
    api.set(el.$('.texto'), { o: 1 });
    tipo.focar(t, el.ate, { inicio: b(3.5) });
    tipo.lente(t, el.vezes, { inicio: b(4) });
    tipo.focar(t, el.mais, { inicio: b(5) });
    tipo.brilho(t, el.vezes, { inicio: b(8), dur: 0.7, forca: 0.45 });
    tipo.derivaDestaque(t, el.vezes, { inicio: b(5) });
    // o sol começa a afundar e a luz cai
    const pz = ease.inOutSine(prog(t, b(10), 6.0));
    const d = 9 * pz;
    api.set(V.sol, { y: (d * 30) / 30 * 0.5625, style: { webkitMaskImage: `linear-gradient(180deg, #000 ${50 - (d / 30) * 100}%, transparent ${50.5 - (d / 30) * 100}%)`, maskImage: `linear-gradient(180deg, #000 ${50 - (d / 30) * 100}%, transparent ${50.5 - (d / 30) * 100}%)` } });
    // câmera: recua de perto da torre pequena até o plano aberto; peso quando o 7x trava
    const rec = ease.forte(prog(t, api.inicioEntrada(0), 2.0));
    const peso = 0.012 * api.pulsoSemQuique(prog(t, b(4) + 0.3, b(4) + 1.2), 0.3);
    el.cam.pose({ zoom: lerp(1.6, 1, rec) * (1 + peso) * (1 + 0.004 * (t - api.ref)), x: el.P[0] * (1 - rec), y: el.P[1] * (1 - rec) });
  },
});
