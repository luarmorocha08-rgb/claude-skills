/* buraco — "4 · Buraco na rua" (6,5 s)
   Ideia: três fotos do buraco chegam como polaroides; a rua se ergue em 3D, as faixas correm em
   direção à câmera e o buraco acende como zona de risco. */
{
Motion.cena('buraco', {
  render: () => `
    ${Moldura.html(4)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Foto de buraco vira <em>cena 3D</em></h2>
      ${Pecas.contador('Fotos', '<span class="n">3</span>', 'b-cont')}
      <div class="b-fotos">${[0, 1, 2].map((i) => `<div class="b-foto f${i}"><i></i></div>`).join('')}</div>
      <div class="vidro b-janela">
        <div class="b-vista">
          <div class="b-chao">
            <i class="b-calcada e"></i><i class="b-calcada d"></i>
            <i class="b-faixa"></i>
            <i class="b-brilho"></i><i class="b-buraco"></i>
          </div>
        </div>
        <span class="mono b-rot">cena 3D · aproximada</span>
        <div class="b-tag"><span>zona de risco</span><i></i></div>
      </div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.b-chao'), { o: 0 });
      api.set(el.$('.b-tag'), { o: 0 });
      el.$('.n').textContent = '1';
      api.set(el.$('.b-fotos'), { s: 1.9, x: -24, y: 22 });
    },
    meio: (el, api) => {
      api.set(el.$('.b-chao'), { rx: -40, o: 0.8 });
      api.set(el.$('.b-tag'), { o: 0 });
      api.set(el.$('.b-brilho'), { o: 0 });
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 4);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
  },
});
}
