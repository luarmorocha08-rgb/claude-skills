/* abertura — "O gancho" (3 s)
   Ideia: o horizonte acende do preto, o céu de Vice City queima e a pergunta desce do alto, linha a
   linha; a última ("O MAPA?") chega pela lente, no degradê do pôr do sol.
   Batidas: 0 linha do horizonte · 0,3 céu e sol · 0,6 palmeiras · b(1) "QUANTO TEMPO" · b(1,5)
   "PRA CRUZAR" · b(2) "O MAPA?" · saída: a câmera mergulha para baixo, rumo ao mar (avançar e desfocar). */
Motion.cena('abertura', {
  render: () => `
    ${Vice.cenario()}
    <div class="pilha bloco">
      <p class="etiqueta e1">GTA VI</p>
      <p class="titulo l1 a">Quanto tempo</p>
      <p class="titulo l1 b">pra cruzar</p>
      <h1 class="titulo l3"><span class="destaque">o mapa?</span></h1>
    </div>`,
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.e1 = api.tipo.dividir(el.$('.e1'), { por: 'palavra' });
    el.a = api.tipo.dividir(el.$('.l1.a'), { por: 'palavra' });
    el.b = api.tipo.dividir(el.$('.l1.b'), { por: 'palavra' });
    el.c = api.tipo.dividir(el.$('.l3'), { por: 'letra' });
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, b } = api;
    const V = el.V;
    api.set(V.linha, { sx: lerp(0.015, 1, ease.forte(prog(t, 0, 0.7))), o: suave(prog(t, 0, 0.1)) });
    const c = ease.inOutSine(prog(t, 0.15, 1.3));
    const borda = lerp(-30, 110, c);
    const m = `linear-gradient(0deg, #000 ${borda}%, transparent ${borda + 30}%)`;
    api.set(V.ceu, { o: suave(prog(t, 0.1, 0.4)), style: { webkitMaskImage: m, maskImage: m } });
    api.set(V.mar, { o: suave(prog(t, 0.1, 0.6)) });
    api.set(V.sol, { y: lerp(6, 0, ease.forte(prog(t, 0.3, 1.6))), o: suave(prog(t, 0.3, 0.65)) });
    V.sky.forEach((k, i) => api.set(k, { y: lerp(1 + i, 0, ease.forte(prog(t, 0.5 + 0.1 * i, 1.4))), o: suave(prog(t, 0.5 + 0.1 * i, 0.9)) }));
    V.palmas.forEach((p, i) => api.set(p, { y: lerp(30, 0, ease.forte(prog(t, 0.55 + 0.08 * i, 1.7))), o: suave(prog(t, 0.55, 0.75)) }));
    Vice.vida(t, V, api, { sol: suave(prog(t, 0.35, 1.2)) });
    tipo.focar(t, el.e1, { inicio: 0.4 });
    tipo.focar(t, el.a, { inicio: b(1) });
    tipo.focar(t, el.b, { inicio: b(1.5) });
    tipo.lente(t, el.c, { inicio: b(2) - 0.1, eixo: 'quadro' });
    tipo.derivaDestaque(t, el.c, { inicio: 2.2 });
    tipo.brilho(t, el.c, { inicio: 2.1, dur: 0.7, forca: 0.45 });
    const tilt = ease.forte(prog(t, 0, 2.0));
    el.cam.pose({ zoom: api.viva(t) * lerp(1.06, 1, tilt), y: lerp(6, 0, tilt) });
  },
});
