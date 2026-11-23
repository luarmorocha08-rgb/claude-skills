/* convite — "O convite" (9 s)
   Ideia: a pergunta entra, a palavra-chave se digita na caixa de comentário, o comentário é enviado e
   o guia chega na DM; no fim tudo escurece e fica só o ícone e o @. */
{
const PALAVRA = 'CLAUDE';
Motion.cena('convite', {
  render: () => `
    ${Moldura.html(6)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Quer os 5 <em>prompts</em> prontos?</h2>
      <div class="vidro c-dm">
        <div class="c-env"><i class="c-env-aba"></i><b class="c-selo">1</b></div>
        <div class="c-dm-txt"><span class="mono c-dm-rot">direct · agora</span><span class="c-dm-t">Guia completo: os 5 prompts</span></div>
      </div>
      <span class="mono c-rot">comenta a palavra</span>
      <div class="vidro c-caixa">
        <i class="c-av">✳</i><span class="c-campo"><span class="c-palavra">${PALAVRA}</span></span><i class="c-env-seta">↑</i>
      </div>
    </div>
    <div class="c-fim">
      <i class="c-ig"><b></b></i>
      <span class="c-handle">${Moldura.HANDLE}</span>
      <span class="mono c-fim-rot">comenta “${PALAVRA}” que eu te mando</span>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$('.c-dm'), { o: 0 });
      el.$('.c-palavra').textContent = '';
    },
    meio: (el, api) => {
      api.set(el.$('.c-dm'), { o: 0 });
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 6);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
  },
});
}
