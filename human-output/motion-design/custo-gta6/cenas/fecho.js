/* fecho — "A pergunta final" (5 s)
   Ideia: de volta ao pôr do sol da abertura; a pergunta sobe gigante, o sol afunda no mar,
   o horizonte encolhe até um ponto e apaga. */
Motion.cena('fecho', {
  render: () => `
    ${Vice.cenario()}
    <div class="pilha bloco">
      <p class="titulo l1">Vai valer</p>
      <h2 class="titulo l2"><span class="destaque">cada centavo?</span></h2>
    </div>`,
  poses: {
    inicio: (el, api) => { api.set(el.$('.l2'), { o: 0 }); api.set(el.$('.l1'), { o: 0.4, blur: 0.6 }); },
    meio: (el, api) => { api.set(el.$('.l2'), { o: 0.55, blur: 0.8, s: 1.25 }); },
  },
});
