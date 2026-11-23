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
    el.n = el.$('.n');
    el.val = el.$('.t-cont .cont-val');
    el.casa = el.$('.t-casa');
    el.dir = el.$('.t-direita');
    el.apps = api.$$('.t-app');
    el.chaves = api.$$('.t-chave');
    el.luzes = api.$$('.t-luz');
    el.barra = el.$('.t-barra b');
  },
  quadro(t, el, api) {
    const { prog, ease, suave, lerp, spring } = api;
    Moldura.quadro(t, el, api);
    Pecas.conteudo(t, el, api);
    Pecas.surgir(api, el.$('.t-cont'), t, 0.45, { dy: 2 });
    Pecas.surgir(api, el.$('.t-clima'), t, 0.55, { dy: 2 });
    Pecas.surgir(api, el.$('.t-tv'), t, 0.65, { dy: 5, s0: 0.93, mola: true });
    Pecas.surgir(api, el.$('.t-pe'), t, 0.65, { dy: 5, s0: 0.93, mola: true });
    // anúncios: acendem com a TV e despencam um a um, em accelerando
    const TF = [1.4, 1.62, 1.82, 2.0, 2.16, 2.3];
    api.set(el.ads, { o: suave(prog(t, 0.75, 0.95)) * (t < 3 ? 1 : 0) });
    el.adsL.forEach((a, i) => {
      const tau = Math.max(0, t - TF[i]);
      const lado = (i % 3) - 1;
      api.set(a, { y: 260 * tau * tau, x: lado * 14 * tau, r: lado * 40 * tau + (i % 2 ? 18 : -14) * tau, o: 1 - suave(prog(tau, 0.25, 0.45)) });
    });
    Pecas.contar(api, el.n, t, TF, [6, 5, 4, 3, 2, 1, 0], { pulso: el.val });
    // os seus apps e a casa
    Pecas.surgir(api, el.casa, t, 2.45, { dy: 2 });
    api.set(el.dir, { o: suave(prog(t, 2.5, 2.7)) });
    el.apps.forEach((ap, i) => {
      const ti = 2.6 + i * 0.07;
      const k = spring(t - ti, { freq: 1.7, damp: 7 });
      api.set(ap, { o: suave(prog(t, ti, ti + 0.12)), s: lerp(0.6, 1, k), y: 1.5 * (1 - Math.min(1, k)) });
    });
    api.set(el.$('.t-cont-assist'), { o: suave(prog(t, 2.95, 3.15)), y: 1.2 * (1 - ease.forte(prog(t, 2.95, 3.5))) });
    api.set(el.barra, { sx: Math.max(0.0001, ease.forte(prog(t, 3.1, 3.9))), origem: '0 50%' });
    const TC = [3.2, 3.5, 3.8];
    el.chaves.forEach((c, i) => {
      api.set(c, { vars: { '--on': ease.forte(prog(t, TC[i], TC[i] + 0.25)).toFixed(3) } });
    });
  },
});
}
