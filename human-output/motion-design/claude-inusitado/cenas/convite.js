/* convite — "O convite" (9 s)
   Ideia: a pergunta entra, a palavra-chave se digita na caixa de comentário, o comentário é enviado e
   o guia chega na DM; no fim tudo escurece e fica só o ícone e o @. */
{
const PALAVRA = 'Wi‑Fi';
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
    el.palavra = el.$('.c-palavra');
    el.seta = el.$('.c-env-seta');
    el.dm = el.$('.c-dm');
    el.selo = el.$('.c-selo');
    el.fim = el.$('.c-fim');
    el.moldura = el.$('.mold');
  },
  quadro(t, el, api) {
    const { prog, ease, suave, lerp, spring } = api;
    Moldura.quadro(t, el, api);
    Pecas.conteudo(t, el, api, { sair: false });
    Pecas.surgir(api, el.$('.c-rot'), t, 0.5, { dy: 1.5 });
    Pecas.surgir(api, el.$('.c-caixa'), t, 0.6, { dy: 5, s0: 0.95, mola: true });
    api.tipo.digitar(t, el.palavra, { inicio: 2.0, cps: 9 });
    // enviar: a seta pulsa, a mensagem chega com mola, o selo pula
    api.set(el.seta, { s: 1 + 0.25 * api.pulsoSemQuique(t - 2.7, 0.1), bright: 1 + 0.6 * api.pulsoSemQuique(t - 2.7, 0.1) });
    Pecas.surgir(api, el.dm, t, 2.85, { dy: -6, s0: 0.92, mola: true });
    const ks = spring(t - 3.2, { freq: 2, damp: 6 });
    api.set(el.selo, { s: t < 3.2 ? 0 : ks, o: t < 3.2 ? 0 : 1 });
    // fecho: tudo escurece e fica o ícone e o @
    const kf = ease.inOutSine(prog(t, 3.75, 4.55));
    const sai = ease.inExpo(prog(t, api.dur - 0.3, api.dur));
    api.set(el.conteudo, { o: 1 - 0.9 * kf, blur: 0.8 * kf, s: 1 + 0.01 * (t - api.ref) - 0.02 * kf, subpixel: true });
    api.set(el.moldura, { o: 1 - 0.7 * kf });
    const ke = ease.forte(prog(t, 4.0, 4.8));
    api.set(el.fim, { o: suave(prog(t, 4.0, 4.35)) * (1 - sai), y: 3 * (1 - ke), blur: 0.6 * (1 - ke), s: 1 + 0.008 * (t - 4.8) });
  },
});
}
