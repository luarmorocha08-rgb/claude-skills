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
    el.fotos = api.$$('.b-foto');
    el.chao = el.$('.b-chao');
    el.faixa = el.$('.b-faixa');
    el.calcadas = api.$$('.b-calcada');
    el.brilho = el.$('.b-brilho');
    el.tag = el.$('.b-tag');
    el.n = el.$('.n');
    el.val = el.$('.b-cont .cont-val');
  },
  quadro(t, el, api) {
    const { prog, ease, suave, lerp, spring } = api;
    Moldura.quadro(t, el, api);
    Pecas.conteudo(t, el, api);
    Pecas.surgir(api, el.$('.b-cont'), t, 0.4, { dy: 2 });
    // polaroides caem girando, uma por meia batida
    const TP = [0.5, 0.75, 1.0];
    el.fotos.forEach((f, i) => {
      const k = spring(t - TP[i], { freq: 1.6, damp: 7 });
      api.set(f, { o: suave(prog(t, TP[i], TP[i] + 0.1)), y: -22 * (1 - k), r: (i - 1) * 22 * (1 - k), s: lerp(1.25, 1, Math.min(1.2, k)) });
    });
    Pecas.contar(api, el.n, t, TP, [0, 1, 2, 3], { pulso: el.val });
    // a janela entra; a rua se ergue de chapada para 3D
    Pecas.surgir(api, el.$('.b-janela'), t, 1.15, { dy: 5, s0: 0.95 });
    const kr = ease.forte(prog(t, 1.3, 2.1));
    el.chao.style.transform = `rotateX(${lerp(8, 68, kr).toFixed(3)}deg) translateZ(-6cqw)`;
    el.chao.style.opacity = suave(prog(t, 1.2, 1.45)).toFixed(3);
    // as faixas correm em direção à câmera, sem parar
    const corre = api.deriva(t, 1.6, 0.8) * 22;
    el.faixa.style.backgroundPosition = `0 ${corre.toFixed(3)}cqw`;
    el.calcadas.forEach((c) => (c.style.backgroundPosition = `0 ${corre.toFixed(3)}cqw`));
    // zona de risco acende por baixo e respira
    api.set(el.brilho, { o: suave(prog(t, 2.2, 2.7)) * (0.8 + 0.2 * Math.sin(2 * Math.PI * (t - 2.2) / 1.4)) });
    const kt = ease.forte(prog(t, 2.55, 3.15));
    api.set(el.tag, { o: suave(prog(t, 2.55, 2.75)), y: -2.5 * (1 - kt), blur: 0.4 * (1 - kt) });
  },
});
}
