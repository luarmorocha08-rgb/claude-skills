/* tv — "3 · Tela da TV" (6,5 s)
   Ideia: a TV liga cheia de anúncio; os anúncios despencam para fora um a um, o contador desce 6 → 0,
   e no lugar caem os seus apps e os botões da casa, que acendem. */
{
const APPS = [['▶', 'Filmes'], ['♫', 'Música'], ['✦', 'Fotos'], ['◎', 'Câmera']];
const CASA = ['Sala', 'Cozinha', 'Quarto'];
Motion.cena('tv', {
  render: () => `
    ${Moldura.html(3)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Uma tela da TV <em>sem&nbsp;anúncio</em></h2>
      ${Pecas.contador('Anúncios', '<span class="n">0</span>', 't-cont')}
      <div class="vidro t-clima"><span class="mono t-clima-rot">sala</span><span class="t-clima-val">22°</span></div>
      <div class="t-tv">
        <div class="t-tela">
          <div class="t-casa">
            <span class="mono t-rot">casa</span>
            ${CASA.map((c) => `<div class="t-luz"><span>${c}</span><i class="t-chave"><b></b></i></div>`).join('')}
          </div>
          <div class="t-direita">
            <span class="mono t-rot">seus apps</span>
            <div class="t-apps">${APPS.map(([g, n]) => `<div class="t-app"><span class="t-gl">${g}</span><span class="t-nome">${n}</span></div>`).join('')}</div>
            <div class="t-cont-assist"><span class="t-ca-t">Continuar assistindo</span><i class="t-barra"><b></b></i></div>
          </div>
          <div class="t-ads">${Array.from({ length: 6 }, () => '<div class="t-ad"><span>anúncio</span></div>').join('')}</div>
        </div>
      </div>
      <i class="t-pe"></i>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.ads, { o: 1 });
      el.$('.n').textContent = '6';
      api.$$('.t-casa, .t-direita').forEach((x) => api.set(x, { o: 0 }));
    },
    meio: (el, api) => {
      api.set(el.ads, { o: 1 });
      el.adsL.forEach((a, i) => api.set(a, { o: i < 4 ? 0 : 1 }));
      el.$('.n').textContent = '2';
      api.$$('.t-casa, .t-direita').forEach((x) => api.set(x, { o: 0 }));
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 3);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
    el.ads = el.$('.t-ads');
    el.adsL = api.$$('.t-ad');
  },
});
}
