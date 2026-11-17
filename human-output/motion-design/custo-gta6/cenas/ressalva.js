/* ressalva — "A verdade" (3,5 s)
   Ideia: o pôr do sol vira noite e a frase da ressalva acende como um letreiro que liga. */
Motion.cena('ressalva', {
  render: () => `
    ${Vice.cenario({ classe: 'noite', sol: false })}
    <div class="pilha bloco">
      <p class="etiqueta">Detalhe</p>
      <h2 class="titulo frase">A Rockstar <span class="destaque">nunca</span><br>revelou o valor</h2>
      <p class="nota">os números são estimativas de mercado</p>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set([el.$('.frase'), el.$('.nota')], { o: 0 }); },
    meio: (el, api) => { api.set(el.$('.nota'), { o: 0 }); },
  },
});
