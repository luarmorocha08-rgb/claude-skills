/* fecho — "A marca" (4,6 s)
   Ideia: rima com a resposta. Um ponto acende no escuro e vira a faísca com o mesmo gesto (meia
   chave + tique); ela desliza, "Claude" nasce da luz dela e o convite sobe embaixo, com
   "especialista" acendendo em terracota. No fim tudo é tragado para a faísca, que vai ao centro,
   gira cada vez mais rápido, encolhe até um ponto, solta um traço horizontal de luz e apaga. O
   último quadro já é a cor de fundo.
   Os primeiros ~0,25 s acontecem por baixo da travessia da cena anterior. */
{
const T = { ponto: 0.22, nasce: 0.34, gesto: 0.86, desliza: [1.06, 1.62], marca: 1.14, convite: 1.8, varre: 2.15, brilho: 2.95, suga: 3.6, centro: [3.72, 4.0], some: [3.98, 4.3], traco: [4.2, 4.6] };

Motion.cena('fecho', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <span class="halo halo-quente"></span>
      <div class="pilha">
        <div class="lockup"><span class="simb">${Faisca.svg()}</span><h2 class="titulo marca">Claude</h2></div>
        <p class="titulo convite">Ensine uma skill, ganhe um <span class="destaque">especialista</span></p>
      </div>
      <span class="ponto ponto-luz"></span>
      <span class="traco"></span>
    </div>`,

  montar(el, api) {
    el.simb = el.$('.simb');
    el.P = Pos(el.simb);
    el.letras = api.tipo.dividir(el.$('.marca'), { por: 'letra' });
    el.palavras = api.tipo.dividir(el.$('.convite'), { por: 'palavra' });
    el.destaque = api.tipo.dividir(el.$('.convite .destaque'), { por: 'letra' });
    el.halo = el.$('.halo');
    el.ponto = el.$('.ponto');
    el.traco = el.$('.traco');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, set, fisica } = api;
    const P = el.P;
    const d = ease.bezier(0.55, 0, 0.2, 1)(prog(t, T.desliza[0], T.desliza[1]));
    const c = ease.inOutCubic(prog(t, T.centro[0], T.centro[1]));
    const fora = 1 - d + c;
    const sx = -P.x * fora, sy = -P.y * fora;
    const nasce = prog(t, T.nasce, T.nasce + 0.5);
    const some = prog(t, T.some[0], T.some[1]);
    const sSome = lerp(1, 0.04, ease.inCubic(some));
    const torce = 220 * ease.inCubic(prog(t, T.centro[0], T.some[1]));
    const giro = lerp(-70, 0, ease.outExpo(prog(t, T.nasce, T.nasce + 0.7)))
      + 90 * ease.inOutExpo(prog(t, T.gesto, T.gesto + 0.24)) + fisica.tique(t, T.gesto + 0.24, { passa: 6 })
      + 4 * (t - 2.9) + torce;
    const quente = 1 - ease.outCubic(prog(t, T.nasce, T.nasce + 0.8));
    const absorve = suave(prog(t, T.suga + 0.05, T.suga + 0.3));
    set(el.simb, {
      x: sx, y: sy, r: giro,
      s: (0.1 + 0.9 * ease.outBack(1.5)(nasce)) * (1 + 0.025 * api.vida(t, { inicio: 2.0, periodo: 2.6 })) * (1 + 0.08 * Math.sin(Math.PI * prog(t, T.centro[1] - 0.12, T.centro[1] + 0.1))) * sSome,
      o: suave(prog(t, T.nasce, T.nasce + 0.12)) * (1 - suave(prog(some, 0.7, 1))),
      blur: 0.25 * ease.inCubic(prog(t, T.centro[0], T.some[1])),
      bright: 1 + 1.3 * quente + 0.7 * absorve,
    });
    // ponto de luz: acende no escuro, a faísca nasce dele; no fim volta a ser ponto e apaga
    const pIn = suave(prog(t, T.ponto, T.ponto + 0.14)) * (1 - suave(prog(t, T.nasce + 0.04, T.nasce + 0.3)));
    const pOut = suave(prog(some, 0.4, 0.9)) * (1 - suave(prog(t, T.traco[0] + 0.05, T.traco[1] - 0.05)));
    set(el.ponto, { s: 0.3 + 0.7 * ease.outCubic(prog(t, T.ponto, T.ponto + 0.25)) + 0.4 * pOut, o: Math.max(pIn, pOut) });
    // o traço horizontal: nasce do ponto, corre para as pontas e apaga desacelerando
    const tr = prog(t, T.traco[0], T.traco[1]);
    set(el.traco, { sx: Math.max(0.0005, ease.outExpo(tr)), o: suave(prog(tr, 0, 0.08)) * (1 - ease.inOutSine(prog(tr, 0.25, 1))) });
    set(el.halo, {
      x: P.x + sx, y: P.y + sy,
      s: (0.45 + 0.25 * ease.outCubic(nasce)) * lerp(1, 0.6, ease.inCubic(some)),
      o: (0.25 + 0.45 * ease.outCubic(nasce) - 0.15 * d * (1 - c) + 0.05 * Math.sin((2 * Math.PI * (t - 1)) / 3.1)) * (1 - ease.inOutSine(prog(t, T.some[0], T.traco[1] - 0.05))) * suave(prog(t, T.ponto, T.ponto + 0.3)),
    });

    const pf = [P.x, P.y];
    tipo.aplicar(el.letras,
      tipo.nascerDaLuz(t, el.letras, { inicio: T.marca, cascata: 0.038, aplicar: false }),
      tipo.sugar(t, el.letras, { inicio: T.suga + 0.04, dur: 0.26, ponto: pf, aplicar: false }));
    tipo.brilho(t, el.letras, { inicio: T.brilho, dur: 0.75, forca: 0.45 });
    tipo.aplicar(el.palavras,
      tipo.focar(t, el.palavras, { inicio: T.convite, cascata: 0.05, aplicar: false }),
      tipo.sugar(t, el.palavras, { inicio: T.suga, dur: 0.3, ponto: pf, aplicar: false }));
    tipo.varrerDestaque(t, el.destaque, { inicio: T.varre, dur: 0.5 });

    // a luz de fundo respira e se apaga junto com a faísca: o último quadro é a cor de fundo
    api.fx.respirar(t, el.luz, { periodo: 3.8, amp: 0.07 });
    el.luz.style.opacity = ((1 - ease.inOutSine(prog(t, T.some[0] - 0.2, T.traco[1] - 0.02))) * suave(prog(t, 0, 0.5))).toFixed(4);
    el.cam.pose({ zoom: lerp(0.98, 1, ease.outQuad(prog(t, 0, 2.9))) * (1 + 0.008 * Math.max(0, t - 2.9)) });
  },
});
}
