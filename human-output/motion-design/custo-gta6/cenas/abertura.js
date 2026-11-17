/* abertura — "O gancho" (4 s)
   Ideia: o horizonte acende do preto, o céu de Vice City queima de baixo para cima e a pergunta
   sobe gigante sobre o pôr do sol. */
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
});
