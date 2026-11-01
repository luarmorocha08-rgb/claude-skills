/* abertura — "Os Que Ficaram" (5 s). Depois do estilhaço, o silêncio: a nave atravessa o preto por cima
   e o título sai do desfoque, letra a letra; o subtítulo abre o espaçamento devagar. */
Motion.cena('abertura', {
  render: () => `
    <svg class="ab-ceu" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">${K.defs('ab')}
      <g class="ab-nave" transform="translate(960,-40) scale(.9)">${NAVE.svg('ab')}</g></svg>
    <div class="ab-pilha">
      <h1 class="ab-titulo">OS QUE FICARAM</h1>
      <div class="ab-linha"></div>
      <div class="ab-sub">EPISÓDIO 1 &nbsp;•&nbsp; A METADE</div>
    </div>`,
  montar(el, api) {
    el.letras = api.tipo.dividir(el.$('.ab-titulo'), { por: 'letra' });
    el.sub = el.$('.ab-sub'); el.linha = el.$('.ab-linha'); el.nave = el.$('.ab-nave'); el.anel = el.$('.ab-nave .nave-anel');
  },
  quadro(t, el, api) {
    const { prog, ease, lerp } = api;
    api.tipo.focar(t, el.letras, { inicio: 0.45, cascata: 0.045, dur: 0.9 });
    const kl = ease.forte(prog(t, 1.2, 2.0));
    api.set(el.linha, { sx: Math.max(0.001, kl), o: kl });
    const ks = ease.forte(prog(t, 1.5, 2.4));
    api.set(el.sub, { o: ks, blur: (1 - ks) * 0.6, ls: lerp(0.9, 0.55, ease.outCubic(prog(t, 1.5, 4.6))) });
    const kn = prog(t, 0, 5);
    el.nave.setAttribute('transform', `translate(${lerp(1100, 860, kn)},${lerp(-160, -60, ease.outCubic(kn))}) scale(.95)`);
    el.anel.setAttribute('opacity', (0.5 + 0.4 * Math.sin(t * 3)).toFixed(2));
    const sai = ease.inCubic(prog(t, 4.35, 5.0));
    api.set(el.$('.ab-pilha'), { o: 1 - sai, s: 1 + 0.03 * prog(t, 0, 5) });
    api.set(el.$('.ab-ceu'), { o: 0.55 * (1 - sai) * ease.forte(prog(t, 0, 1.2)) });
  },
});
