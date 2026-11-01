/* gancho — "O gancho" (2,5 s)
   Ideia: um cursor dourado pisca no escuro e escreve a promessa; a última palavra acende e,
   dela, as três criações saltam para a órbita em volta da IA. */
{
const ICONES = [
  ['laptop', 'i-laptop'], ['video_game', 'i-jogo'], ['mobile_phone', 'i-fone'], ['robot', 'i-robo'], ['rocket', 'i-foguete'],
];
Motion.cena('gancho', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio">
      <svg class="orbita" viewBox="0 0 100 40" preserveAspectRatio="none"><ellipse cx="50" cy="20" rx="49" ry="19" /></svg>
      <div class="heroi"><div class="aro"></div>${c.foto('sparkles', { classe: 'faisca' })}</div>
      ${ICONES.map(([n, k]) => `<div class="icone ${k}">${c.foto(n)}</div>`).join('')}
    </div>
    <div class="camada c-perto">
      <div class="coluna topo">
        <p class="rotulo">Domingo · modo criar</p>
        <h1 class="titulo frase"><span class="l1">Um prompt.</span><br><span class="l2">Três <span class="destaque">criações</span>.</span><span class="cursor"></span></h1>
      </div>
      <div class="coluna base rodape"><div class="monograma">RR</div><span class="arroba">@ramosraul.ia</span></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.set(el.$$('.l2, .icone, .heroi, .orbita, .rodape'), { o: 0 });
      api.set(el.$('.l1'), { clip: 'inset(0 52% 0 0)' });
    },
    meio: (el, api) => {
      api.set(el.$$('.icone'), { o: 0, s: 0.6 });
      api.set(el.$('.orbita'), { o: 0 });
      api.set(el.$('.heroi'), { s: 0.7, o: 0.7 });
      api.set(el.$('.rodape'), { o: 0 });
    },
  },
});
}
