/* abertura — "O gancho" (4 s)
   Ideia: o horizonte acende do preto, o céu de Vice City queima de baixo para cima e a pergunta
   sobe gigante sobre o pôr do sol.
   Batidas: 0 linha do horizonte · 0,4 céu e sol · 0,75 palmeiras e cidade · b(2) "QUANTO CUSTOU" ·
   b(3) "GTA VI?" pela lente · 2,8 brilho · saída avancar-desfocar. */
Motion.cena('abertura', {
  render: () => `
    ${Vice.cenario()}
    <div class="pilha bloco">
      <p class="titulo pergunta">Quanto custou</p>
      <h1 class="titulo gta"><span class="destaque">GTA VI?</span></h1>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.ceu'), { o: 0.08 });
      api.set([el.$('.sol'), el.$('.sol-brilho'), el.$('.mar'), ...el.$$('.skyline'), ...el.$$('.palmas'), el.$('.bloco')], { o: 0 });
      api.set(el.$('.horizonte-luz'), { sx: 0.35 });
    },
    meio: (el, api) => {
      api.set(el.$('.gta'), { o: 0 });
      api.set(el.$('.sol'), { y: 6 });
      api.set(el.$$('.palmas'), { y: 12 });
    },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.pal = api.tipo.dividir(el.$('.pergunta'), { por: 'palavra' });
    el.gta = api.tipo.dividir(el.$('.gta'), { por: 'letra' });
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, b } = api;
    const V = el.V;
    // 0 → 0,6: a linha do horizonte nasce como ponto e corre para as pontas
    api.set(V.linha, { sx: lerp(0.015, 1, ease.forte(prog(t, 0, 0.75))), o: suave(prog(t, 0, 0.12)) });
    // o céu queima de baixo para cima (máscara que sobe) e ganha força
    const c = ease.inOutSine(prog(t, 0.25, 1.5));
    const borda = lerp(-30, 110, c);
    api.set(V.ceu, { o: suave(prog(t, 0.2, 0.5)), style: { webkitMaskImage: `linear-gradient(0deg, #000 ${borda}%, transparent ${borda + 30}%)`, maskImage: `linear-gradient(0deg, #000 ${borda}%, transparent ${borda + 30}%)` } });
    api.set(V.mar, { o: suave(prog(t, 0.15, 0.7)) });
    // o sol sobe meia altura do mar
    const s = ease.forte(prog(t, 0.4, 1.7));
    api.set(V.sol, { y: lerp(5.5, 0, s), o: suave(prog(t, 0.4, 0.75)) });
    const kSol = suave(prog(t, 0.45, 1.4));
    // a cidade e as palmeiras sobem com paralaxe
    V.sky.forEach((k, i) => api.set(k, { y: lerp(1.2 + i, 0, ease.forte(prog(t, 0.7 + 0.1 * i, 1.6))), o: suave(prog(t, 0.7 + 0.1 * i, 1.1)) }));
    V.palmas.forEach((p, i) => api.set(p, { y: lerp(26, 0, ease.forte(prog(t, 0.75 + 0.08 * i, 2.0))), o: suave(prog(t, 0.75, 0.95)) }));
    Vice.vida(t, V, api, { sol: kSol });
    // a pergunta
    api.set(el.$('.bloco'), { o: 1 });
    tipo.focar(t, el.pal, { inicio: b(2) });
    tipo.lente(t, el.gta, { inicio: b(3), eixo: 'quadro' });
    tipo.brilho(t, el.gta, { inicio: 2.8, dur: 0.8, forca: 0.45 });
    tipo.derivaDestaque(t, el.gta, { inicio: 2.0 });
    // câmera: nasce baixa, rente ao mar, e sobe; depois push-in vivo
    const tilt = ease.forte(prog(t, 0, 2.2));
    el.cam.pose({ zoom: api.viva(t) * lerp(1.06, 1, tilt), y: lerp(7, 0, tilt) * api.k });
  },
});
