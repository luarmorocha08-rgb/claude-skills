/* wifi — "1 · Wi‑Fi lento" (7 s)
   Ideia: o Claude roda o diagnóstico; as linhas do terminal caem uma a uma, a latência sobe até
   189 ms em vermelho, o carimbo bate "troque pra 5 GHz" e o número despenca para 12 ms.
   (Números ilustrativos de uma tela de exemplo.) */
{
const LINHAS = [
  ['ping no roteador', '189 ms'],
  ['perda de pacotes', '12 %'],
  ['canal 2,4 GHz', '6 · 9 redes'],
  ['canal 5 GHz', '36 · livre'],
];
Motion.cena('wifi', {
  render: () => `
    ${Moldura.html(1)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Achar o que deixa o <em>Wi‑Fi lento</em></h2>
      ${Pecas.contador('Latência', '<span class="n">12</span> ms', 'w-cont ok')}
      <div class="w-dial"><i class="w-arco"></i><i class="w-agulha"></i><i class="w-eixo"></i><span class="w-dial-rot mono">sinal</span></div>
      <div class="vidro w-term">
        <div class="w-barra"><i></i><i></i><i></i><span class="mono">terminal · claude code</span></div>
        <div class="w-cmd mono"><b>$</b> <span class="w-digita">claude "minha internet tá lenta"</span></div>
        ${LINHAS.map(([a, b], i) => `<div class="w-linha mono"><span>› ${a}</span><i></i><span class="w-v ${i < 2 ? 'ruim' : i === 3 ? 'bom' : ''}">${b}</span></div>`).join('')}
        <div class="w-ok mono">✓ diagnóstico pronto</div>
      </div>
      <div class="w-carimbo">Troque pra 5 GHz</div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.$$('.w-linha, .w-ok, .w-carimbo').forEach((x) => api.set(x, { o: 0 }));
      el.$('.w-digita').textContent = '';
      el.$('.n').textContent = '40';
      el.cont.classList.remove('ok');
    },
    meio: (el, api) => {
      api.$$('.w-ok, .w-carimbo').forEach((x) => api.set(x, { o: 0 }));
      el.$('.n').textContent = '189';
      el.cont.classList.remove('ok');
      el.cont.classList.add('ruim');
      api.set(el.$('.w-agulha'), { r: -62 });
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 1);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
    el.cont = el.$('.w-cont');
  },
});
}
