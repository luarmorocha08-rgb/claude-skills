/* gta6 — "O agora" (6,5 s)
   Ideia: a torre de GTA VI rompe a linha do mar e não para de subir: a câmera inclina para cima,
   ela fura o topo do quadro, e o número rola como odômetro até travar. */
Motion.cena('gta6', {
  render: () => `
    ${Vice.cenario({ classe: 'baixo' })}
    <div class="palco3d">${Vice.torre({ classe: 't6' })}</div>
    <div class="texto">
      <p class="etiqueta">GTA VI</p>
      <p class="apoio-n">até</p>
      <h2 class="titulo valor"><span class="destaque">US$ 2 bi</span></h2>
      <p class="nota">estimativas de US$ 1 a 2 bilhões</p>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.t6'), { vars: { '--h': '30cqmin' } });
      api.set(el.$('.texto'), { o: 0 });
    },
    meio: (el, api) => {
      api.set(el.$('.t6'), { vars: { '--h': '70cqmin' } });
      api.set([el.$('.valor'), el.$('.nota'), el.$('.apoio-n')], { o: 0 });
    },
  },
});
