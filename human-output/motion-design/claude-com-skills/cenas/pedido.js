/* pedido — "O pedido" (3,25 s)
   Ideia: o pedido é digitado na tela, grande, por um cursor terracota que esquenta cada letra ao
   passar; quando a frase termina, ela é sugada para o centro e vira o ponto de luz de onde a
   faísca vai nascer.
   Linha do tempo: cursor acende (0,08) e respira · digitação com ritmo humano (0,42–~1,95), cada
   letra nasce quente e esfria · hold legível (até 2,78) · batida: as pontas partem primeiro e tudo
   converge num ponto no centro (2,78–3,08) · o ponto floresce (3,0–3,25). Corte seco: a próxima
   cena começa no mesmo ponto. */
{
const FRASE = 'Faz um vídeo que <span class="destaque">surpreenda</span>';
const T = { cursor: 0.0, digita: 0.5, suga: 5.0, sugaDur: 0.3, pulsos: [0.22, 2.829] };

Motion.cena('pedido', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <span class="brasa halo-quente"></span>
      <div class="pilha"><h2 class="titulo frase">${FRASE}</h2></div>
      <span class="cursor"></span>
      <span class="ponto ponto-luz"></span>
    </div>`,

  montar(el, api) {
    el.letras = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    // ritmo de digitação humano: pausa maior na troca de palavra, variação por semente
    let tt = T.digita;
    el.tempos = el.letras.map((p, i) => {
      if (i > 0 && p.palavra !== el.letras[i - 1].palavra) tt += 0.09;
      const t0 = tt;
      tt += 0.056 + 0.03 * api.rand(i + 7);
      return t0;
    });
    el.fimDigita = el.tempos[el.tempos.length - 1];
    const p0 = Pos(el.letras[0].el);
    el.bordas = [p0.x - p0.w / 2 - 0.3];
    el.letras.forEach((p) => { const b = Pos(p.el); el.bordas.push(b.x + b.w / 2 + 0.35); });
    el.cy = Pos(el.$('.frase')).y;
    el.cursor = el.$('.cursor');
    el.ponto = el.$('.ponto');
    el.brasa = el.$('.brasa');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, set } = api;
    // ── letras: cada uma nasce quente, do desfoque, um fio abaixo, no instante em que o cursor passa
    const entra = el.letras.map((p, i) => {
      const t0 = el.tempos[i];
      const e = ease.forte(prog(t, t0, t0 + 0.32));
      const quente = 1 - ease.outCubic(prog(t, t0, t0 + 0.5));
      return {
        o: suave(prog(t, t0, t0 + 0.07)),
        y: 0.06 * p.corpo * (1 - e),
        blur: 0.07 * p.corpo * (1 - ease.outCubic(prog(t, t0, t0 + 0.18))),
        bright: 1 + 0.9 * quente,
      };
    });
    const suga = tipo.sugar(t, el.letras, { inicio: T.suga, dur: T.sugaDur, ponto: [0, el.cy], espera: 0.08, aplicar: false });
    tipo.aplicar(el.letras, entra, suga);

    // ── cursor: desliza para a borda da última letra digitada (glide curto, nunca salta)
    let n = 0;
    while (n < el.tempos.length && el.tempos[n] <= t) n++;
    const xa = el.bordas[Math.max(0, n - 1)], xb = el.bordas[n];
    const g = n === 0 ? 1 : ease.outCubic(prog(t, el.tempos[n - 1], el.tempos[n - 1] + 0.045));
    let cx = n === 0 ? el.bordas[0] : lerp(xa, xb, g);
    const q = ease.inCubic(prog(t, T.suga + 0.04, T.suga + T.sugaDur));
    cx = lerp(cx, 0, q);
    // respira devagar antes e depois de digitar (nunca pisca); firme enquanto digita
    const digitando = suave(prog(t, T.digita - 0.1, T.digita)) * (1 - suave(prog(t, el.fimDigita + 0.2, el.fimDigita + 0.45)));
    const respira = 0.78 + 0.22 * Math.cos((2 * Math.PI * (t - 0.2)) / 1.1);
    const oc = suave(prog(t, T.cursor, T.cursor + 0.16)) * lerp(respira, 1, digitando) * (1 - suave(prog(q, 0.75, 1)));
    set(el.cursor, { x: cx, y: el.cy, sy: lerp(1, 0.12, q), o: oc, bright: 1 + 1.2 * q });

    // ── ponto de luz: cresce enquanto as letras chegam e floresce no centro
    const cresce = ease.inCubic(prog(t, T.suga + 0.08, T.suga + T.sugaDur));
    const flor = ease.outCubic(prog(t, T.suga + T.sugaDur - 0.04, api.dur));
    set(el.ponto, { y: el.cy, s: 0.15 + 0.55 * cresce + 0.3 * flor, o: cresce });

    // ── brasa: a luz quente segue o cursor e se junta no centro com o ponto
    set(el.brasa, {
      x: lerp(cx * 0.6, 0, q), y: el.cy,
      s: 0.55 + 0.1 * digitando + 0.35 * cresce,
      o: 0.22 + 0.2 * suave(prog(t, T.digita, T.digita + 0.6)) + 0.35 * cresce + T.pulsos.reduce((a, p) => a + 0.25 * api.fisica.impacto(t, p, { decaimento: 1.2 }), 0),
    });
    api.fx.respirar(t, el.luz, { periodo: 3.4, amp: 0.07 });
    el.cam.pose({ zoom: lerp(1.12, 1, ease.inOutSine(prog(t, 0, 4.6))) * (1 + 0.01 * Math.max(0, t - 4.6)) });
  },
});
}
