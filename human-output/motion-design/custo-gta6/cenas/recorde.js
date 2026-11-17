/* recorde — "O recorde" (3 s)
   Ideia: a câmera sobe da torre para o céu e a frase do recorde chega palavra a palavra. */
Motion.cena('recorde', {
  render: () => `
    ${Vice.cenario({ classe: 'ceu-alto' })}
    <div class="pilha bloco">
      <p class="etiqueta">Na época, foi</p>
      <h2 class="titulo frase">O jogo <span class="destaque">mais caro</span><br>já feito</h2>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set(el.$('.frase'), { o: 0.2, blur: 1, y: 2 }); api.set(el.$('.etiqueta'), { o: 0 }); },
  },
});
