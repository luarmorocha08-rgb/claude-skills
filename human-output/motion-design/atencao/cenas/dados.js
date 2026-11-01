/* dados — "A prova" (4,5 s)
   Ideia: os números da prova chegam do jeito do filme: cada um cortado ao meio, as metades batem
   e encostam na batida (uma a cada 1,5 s), e saem se partindo para o próximo.
   Dados verificados (fonte na tela): Carleton University 2006 (julgamento visual em 50 ms);
   Stanford Web Credibility 2002 (46,1 % dos comentários sobre credibilidade citam o visual);
   Google "The Need for Mobile Speed" 2016 (53 % abandonam acima de 3 s). */
{
const DADOS = [
  { n: '0,05s', legenda: 'é o tempo que uma pessoa leva<br>para julgar o seu site', fonte: 'Carleton University, 2006' },
  { n: '46%', legenda: 'julgam a credibilidade<br>de um site pelo visual', fonte: 'Stanford, 2002' },
  { n: '53%', legenda: 'abandonam um site no celular<br>que demora mais de 3 segundos', fonte: 'Google, 2016' },
];
const PASSO = 1.5;
Motion.cena('dados', {
  render: () => `
    <div class="camada c-luz"><div class="luz"></div></div>
    <p class="titulo kicker">A atenção decide</p>
    ${DADOS.map((d, i) => `
    <div class="dado d${i}">
      <div class="corte">
        <div class="brasa"></div>
        <div class="metade cima"><span class="palavra">${d.n}</span></div>
        <div class="metade baixo"><span class="palavra">${d.n}</span></div>
        <div class="fenda"></div>
      </div>
      <p class="titulo legenda">${d.legenda}</p>
      <p class="apoio fonte">${d.fonte}</p>
    </div>`).join('')}`,

  montar(el, api) {
    el.luz = el.$('.luz');
    el.kick = api.tipo.dividir(el.$('.kicker'), { por: 'palavra' });
    el.d = el.$$('.dado').map((raiz) => ({
      raiz,
      cima: raiz.querySelector('.cima'), baixo: raiz.querySelector('.baixo'),
      fenda: raiz.querySelector('.fenda'), brasa: raiz.querySelector('.brasa'),
      leg: api.tipo.dividir(raiz.querySelector('.legenda'), { por: 'palavra' }),
      fonte: raiz.querySelector('.fonte'),
    }));
    el.cam = api.camera({ origem: [50, 48] });
  },

  quadro(t, el, api) {
    const { tipo, prog, ease, lerp, suave } = api;
    const a = tipo.focar(t, el.kick, { inicio: -0.05, aplicar: false });
    tipo.aplicar(el.kick, a, tipo.sair(t, el.kick, { inicio: 4.22, dur: 0.28, aplicar: false }));
    let kickCam = 0;
    let tremX = 0;
    el.d.forEach((d, i) => {
      const t0 = i * PASSO;
      const bate = t0 + 0.32;
      const ultimo = i === el.d.length - 1;
      const fimSai = t0 + PASSO;           // a saída termina quando o próximo entra
      const saida = ease.inCubic(prog(t, fimSai - 0.28, fimSai));
      // as metades chegam rápidas, aceleram e encostam na batida
      const dd = lerp(22, 0, ease.inCubic(prog(t, t0 - 0.02, bate)));
      const tr = api.tremor(t, bate, { forca: 0.4, freq: 11, semente: i + 1 });
      const vem = ease.forte(prog(t, t0 - 0.02, t0 + 0.2));
      const abre = 30 * saida;
      const vis = t >= t0 - 0.04 && t < fimSai ? 1 : 0;
      api.set(d.raiz, { o: vis });
      api.set(d.cima, { y: -dd - abre + tr.y, o: vem, blur: 0.5 * (1 - vem) + 0.6 * saida });
      api.set(d.baixo, { y: dd + abre - tr.y, o: vem, blur: 0.5 * (1 - vem) + 0.6 * saida });
      // o estalo: a emenda acende do centro para as pontas e esfria
      const estalo = api.pulsoSemQuique(t - bate, 0.05);
      const corre = ease.forte(prog(t, bate, bate + 0.45));
      api.set(d.fenda, { o: (t < bate ? 0 : lerp(1, 0.2, ease.outCubic(prog(t, bate + 0.08, bate + 1.0)))) * (1 - saida), sx: lerp(0.15, 1, corre), bright: 1 + 1.2 * estalo });
      api.set(d.brasa, { o: (0.25 + 0.6 * estalo + 0.35 * suave(prog(t, bate, bate + 0.5))) * (1 - saida), sx: 1 + 0.12 * estalo });
      const l = tipo.focar(t, d.leg, { inicio: bate + 0.02, cascata: 0.035, aplicar: false });
      tipo.aplicar(d.leg, l, tipo.sair(t, d.leg, { inicio: fimSai - 0.26, dur: 0.24, aplicar: false }));
      const fo = ease.forte(prog(t, bate + 0.2, bate + 0.6));
      api.set(d.fonte, { o: suave(prog(t, bate + 0.2, bate + 0.35)) * (1 - saida), y: 1.2 * (1 - fo), blur: 0.3 * (1 - fo) });
      kickCam += api.pulsoSemQuique(t - bate, 0.06);
      tremX += tr.x;
    });
    api.fx.respirar(t, el.luz, { periodo: 2.9, amp: 0.1, base: 0.28 });
    el.cam.pose({ zoom: api.viva(t, { v: 0.01 }) * (1 + 0.022 * kickCam), x: tremX * 0.3 });
  },
});
}
