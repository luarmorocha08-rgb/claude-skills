/* ressalva — "A verdade" (3 s)
   Ideia: a noite cai sobre Vice City e a frase da ressalva acende como um letreiro que liga:
   cada letra nasce quente e esfria, sem piscar.
   Batidas: 0 etiqueta · b(0,5) frase · b(2) nota · b(3) brilho em "nunca" · saída esmaecer. */
Motion.cena('ressalva', {
  render: (c) => `
    ${Vice.cenario({ classe: 'noite', sol: false })}
    <div class="pilha bloco">
      <p class="etiqueta">Detalhe</p>
      <h2 class="titulo frase">${c.porFormato({ '16x9': 'A Rockstar <span class="destaque">nunca</span><br>revelou o valor', '9x16': 'A Rockstar<br><span class="destaque">nunca</span> revelou<br>o valor' })}</h2>
      <p class="nota">os números são estimativas de mercado</p>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set([el.$('.frase'), el.$('.nota')], { o: 0 }); },
    meio: (el, api) => { api.set(el.$('.nota'), { o: 0 }); },
  },
  montar(el, api) {
    el.V = Vice.pecas(el);
    el.et = api.tipo.dividir(el.$('.etiqueta'), { por: 'palavra' });
    el.letras = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    el.dest = el.letras.filter((p) => p.destaque);
    el.nota = api.tipo.dividir(el.$('.nota'), { por: 'palavra' });
    el.cam = api.camera();
  },
  quadro(t, el, api) {
    const { tipo, b, prog, suave } = api;
    Vice.vida(t, el.V, api, { sol: 0 });
    tipo.focar(t, el.et, { inicio: api.inicioEntrada(0.02) });
    // neon que liga: cada letra nasce quente (brilho alto) e esfria até a cor final
    const ent = tipo.focar(t, el.letras, { inicio: b(0.5), cascata: 0.024, aplicar: false });
    el.letras.forEach((p, i) => {
      const t0 = b(0.5) + 0.024 * i;
      ent[i].bright = 1 + 0.9 * (1 - suave(prog(t, t0 + 0.05, t0 + 0.55)));
    });
    tipo.aplicar(el.letras, ent);
    tipo.focar(t, el.nota, { inicio: b(2) });
    tipo.brilho(t, el.dest, { inicio: b(3), dur: 0.6, forca: 0.45 });
    tipo.derivaDestaque(t, el.letras, { inicio: b(3.5) });
    el.cam.pose({ zoom: 1 + 0.01 * (t - api.ref) });
  },
});
