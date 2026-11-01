/* faisca — "A resposta" (4 s)
   Ideia: do ponto de luz nasce a faísca (mola curta, girando, quente que esfria); ela faz o
   gesto-assinatura (meia chave em 240 ms com tique) e desliza para a esquerda abrindo espaço:
   "Claude" nasce da luz dela e "com skills" sobe embaixo, com o destaque varrido. No fim as letras
   são tragadas para a faísca, que vai ao centro e cresce até o tamanho exato do sol da cena
   seguinte (corte invisível).
   Batidas: 0 nasce · 0,52 gesto · 0,78 desliza · 0,86 "Claude" · b(3) "com skills" · 1,78 destaque ·
   2,55 brilho · 3,2 tragadas · 3,38–3,98 centro. */
{
const T = { gesto: 0.6, desliza: [0.86, 1.46], marca: 0.96, sub: 2.608, varre: 2.86, brilho: 3.45, suga: 4.3, centro: [4.46, 5.03], prende: [4.95, 5.217] };
const LADO = 16; // cqmin: a faísca do lockup
const SOL = 20; // cqmin: a faísca do sol (cena "oficios")

Motion.cena('faisca', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <span class="halo halo-quente"></span>
      <div class="pilha">
        <div class="lockup"><span class="simb">${Faisca.svg()}</span><h2 class="titulo marca">Claude</h2></div>
        <p class="titulo sub">com <span class="destaque">skills</span></p>
      </div>
      <span class="ponto ponto-luz"></span>
    </div>`,

  montar(el, api) {
    el.simb = el.$('.simb');
    el.P = Pos(el.simb);
    el.letras = api.tipo.dividir(el.$('.marca'), { por: 'letra' });
    el.sub = api.tipo.dividir(el.$('.sub'), { por: 'letra' });
    el.halo = el.$('.halo');
    el.ponto = el.$('.ponto');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, set, fisica } = api;
    const P = el.P;
    // ── posição da faísca: nasce no centro, desliza para o lugar dela, volta ao centro e cresce
    const d = ease.bezier(0.55, 0, 0.2, 1)(prog(t, T.desliza[0], T.desliza[1]));
    const c = ease.inOutCubic(prog(t, T.centro[0], T.centro[1]));
    const fora = 1 - d + c; // 1 = no centro do quadro, 0 = no lugar do lockup
    const sx = -P.x * fora, sy = -P.y * fora;
    const nasce = prog(t, 0.0, 0.5);
    const sNasce = 0.1 + 0.9 * ease.outBack(1.5)(nasce);
    const sFim = lerp(1, SOL / LADO, c) * (1 - 0.06 * ease.inOutSine(prog(t, T.prende[0], T.prende[1])));
    const giro = lerp(-70, 0, ease.outExpo(prog(t, 0, 0.7)))
      + 90 * ease.inOutExpo(prog(t, T.gesto, T.gesto + 0.24)) + fisica.tique(t, T.gesto + 0.24, { passa: 6 })
      + 10 * (t - 5.217) + 45 * ease.inOutCubic(prog(t, T.centro[0], T.centro[1]));
    const vGiro = Math.abs(ease.inOutExpo(prog(t + 0.01, T.gesto, T.gesto + 0.24)) - ease.inOutExpo(prog(t - 0.01, T.gesto, T.gesto + 0.24))) * 90 / 0.02;
    const quente = 1 - ease.outCubic(prog(t, 0, 0.8));
    const absorve = suave(prog(t, T.suga + 0.05, T.suga + 0.3)) * (1 - suave(prog(t, T.centro[0] + 0.1, T.centro[1])));
    const respira = 1 + 0.05 * api.vida(t, { inicio: 1.4, periodo: 2.2 });
    set(el.simb, {
      x: sx, y: sy, r: giro, s: sNasce * sFim * respira,
      o: suave(prog(t, 0.0, 0.12)),
      blur: Math.min(0.5, vGiro * 0.00045),
      bright: 1 + 1.3 * quente + 0.5 * absorve + 0.3 * ease.inCubic(prog(t, T.prende[0], T.prende[1])) + 0.35 * Pulso(t, T.sub, { ataque: 0.08, decai: 0.6 }),
    });
    // ponto de luz (herdado da cena anterior) se desfaz dentro da faísca que nasce
    set(el.ponto, { s: 1 + 0.6 * ease.outCubic(prog(t, 0, 0.3)), o: 1 - suave(prog(t, 0.04, 0.32)) });
    // halo quente atrás da faísca, acompanha
    set(el.halo, {
      x: P.x + sx, y: P.y + sy,
      s: (0.45 + 0.25 * ease.outCubic(nasce)) * lerp(1, 1.25, c),
      o: 0.25 + 0.45 * ease.outCubic(nasce) - 0.15 * d * (1 - c) + 0.06 * Math.sin((2 * Math.PI * (t - 1)) / 3.1),
    });

    // ── "Claude" nasce da luz, letra a letra; no fim é tragado para a faísca
    const pf = [P.x, P.y];
    const ma = tipo.nascerDaLuz(t, el.letras, { inicio: T.marca, cascata: 0.038, aplicar: false });
    const ms = tipo.sugar(t, el.letras, { inicio: T.suga + 0.04, dur: 0.26, ponto: pf, aplicar: false });
    tipo.aplicar(el.letras, ma, ms, tipo.exalar(t, el.letras, { inicio: 1.4, velocidade: 0.012, ref: 3.6, aplicar: false }));
    tipo.brilho(t, el.letras, { inicio: T.brilho, dur: 0.75, forca: 0.45 });
    // ── "com skills"
    const sa = tipo.focar(t, el.sub, { inicio: T.sub, cascata: 0.022, aplicar: false });
    const ss = tipo.sugar(t, el.sub, { inicio: T.suga, dur: 0.3, ponto: pf, aplicar: false });
    tipo.aplicar(el.sub, sa, ss);
    tipo.varrerDestaque(t, el.sub, { inicio: T.varre, dur: 0.5 });
    tipo.derivaDestaque(t, el.sub, { inicio: 2.3 });

    api.fx.respirar(t, el.luz, { periodo: 3.8, amp: 0.07 });
    // câmera: push-in que desacelera e para em 1,0 no último quadro (a próxima começa em 1,0)
    el.cam.pose({ zoom: lerp(0.93, 1, ease.inOutSine(prog(t, 0, T.centro[1]))), x: 0.6 * Math.sin((2 * Math.PI * t) / 6.2) * (1 - c), y: 0.3 * Math.sin((2 * Math.PI * t) / 4.7) * (1 - c) });
  },
});
}
