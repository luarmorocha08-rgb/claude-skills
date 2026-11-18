/* recorde — "O recorde" (3 s)
   Ideia: a câmera chega ao céu e a frase do recorde chega letra a letra; "mais caro" acende no degradê.
   Batidas: 0 etiqueta · b(0,5) frase · b(1,5) varredura do destaque · b(4) brilho · saída empurrar para baixo. */
Motion.cena('recorde', {
  render: (c) => `
    ${Vice.cenario({ classe: 'ceu-alto' })}
    <div class="pilha bloco">
      <p class="etiqueta">Na época, foi</p>
      <h2 class="titulo frase">${c.porFormato({ '16x9': 'O jogo <span class="destaque">mais caro</span><br>já feito', '9x16': 'O jogo<br><span class="destaque">mais caro</span><br>já feito' })}</h2>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set(el.$('.frase'), { o: 0.2, blur: 1, y: 2 }); api.set(el.$('.etiqueta'), { o: 0 }); },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.et = api.tipo.dividir(el.$('.etiqueta'), { por: 'palavra' });
    el.letras = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    el.dest = el.letras.filter((p) => p.destaque);
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { tipo, b } = api;
    const ini = api.inicioEntrada(0.02);
    Vice.vida(t, el.V, api);
    tipo.focar(t, el.et, { inicio: ini });
    tipo.focar(t, el.letras, { inicio: b(0.5), cascata: 0.022 });
    tipo.varrerDestaque(t, el.letras, { inicio: b(1.5), dur: 0.5 });
    tipo.brilho(t, el.dest, { inicio: b(4), dur: 0.7, forca: 0.45 });
    tipo.derivaDestaque(t, el.letras, { inicio: b(3) });
    el.cam.pose({ zoom: 1 + 0.01 * (t - api.ref) });
  },
});
