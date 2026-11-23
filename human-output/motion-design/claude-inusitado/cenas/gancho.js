/* gancho — "O gancho" (5,5 s)
   Ideia: a moldura nasce, a pergunta entra e um card de conversa com o Claude acende os 5 jeitos,
   um por batida, enquanto o contador sobe até 5/5. */
{
const ITENS = ['Wi‑Fi lento', 'Exame em 3D', 'Tela da TV', 'Buraco na rua', 'Diagrama vivo'];
Motion.cena('gancho', {
  render: () => `
    ${Moldura.html(0)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Tem gente usando o Claude de um jeito <em>inusitado</em></h2>
      ${Pecas.contador('Jeitos', '<span class="n">5</span>/5', 'g-cont')}
      <div class="vidro g-card">
        <div class="g-topo"><span class="g-selo">✳</span><span class="g-nome">Claude</span><span class="g-mono mono">nova conversa</span></div>
        <div class="g-prompt">E se eu te pedisse algo <i>bem</i> diferente?</div>
        <div class="g-chips">${ITENS.map((t, i) => `<span class="g-chip"><b>0${i + 1}</b>${t}</span>`).join('')}</div>
      </div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.$$('.g-chip').forEach((c) => api.set(c, { vars: { '--on': 0 } }));
      el.$('.n').textContent = '0';
      api.set(el.$('.g-card'), { o: 0, y: 6 });
    },
    meio: (el, api) => {
      api.$$('.g-chip').forEach((c, i) => api.set(c, { vars: { '--on': i < 2 ? 1 : 0 } }));
      el.$('.n').textContent = '2';
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 0);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
    el.card = el.$('.g-card');
    el.chips = api.$$('.g-chip');
    el.n = el.$('.n');
    el.cont = el.$('.g-cont');
    el.prompt = api.tipo.dividir(el.$('.g-prompt'), { por: 'palavra' });
  },
});
}
