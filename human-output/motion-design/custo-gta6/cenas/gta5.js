/* gta5 — "O antes" (5,5 s)
   Ideia: em 2013, a torre de dinheiro de GTA V sobe da linha do mar, maço por maço, girando,
   e o valor viaja no topo dela. */
Motion.cena('gta5', {
  render: () => `
    ${Vice.cenario({ classe: 'baixo' })}
    <div class="ano titulo" aria-hidden="true">2013</div>
    <div class="palco3d">${Vice.torre({ classe: 't5', rotulo: 'GTA V · 2013', valor: 'US$ 265 mi', nota: 'desenvolvimento + marketing' })}</div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.t5'), { vars: { '--h': '1cqmin', '--ry': '-70deg' } });
      api.set(el.$('.torre-rotulo'), { o: 0 });
      api.set(el.$('.ano'), { o: 0.3, s: 1.1 });
    },
    meio: (el, api) => {
      api.set(el.$('.t5'), { vars: { '--h': '18cqmin', '--ry': '-48deg' } });
      api.set(el.$('.t-nota'), { o: 0 });
    },
  },
});
