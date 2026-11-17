/* comparacao — "A comparação" (6 s)
   Ideia: a câmera recua e as duas torres aparecem lado a lado na proporção real
   (265 milhões contra até 2 bilhões): a pequena some ao pé da gigante, e o "7x" crava. */
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
});
