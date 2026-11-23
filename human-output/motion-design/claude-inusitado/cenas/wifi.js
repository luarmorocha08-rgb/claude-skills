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
    el.val = el.$('.w-cont .cont-val');
    el.n = el.$('.n');
    el.dial = el.$('.w-dial');
    el.agulha = el.$('.w-agulha');
    el.term = el.$('.w-term');
    el.digita = el.$('.w-digita');
    el.linhas = api.$$('.w-linha');
    el.ok = el.$('.w-ok');
    el.carimbo = el.$('.w-carimbo');
  },
  quadro(t, el, api) {
    const { prog, ease, suave, lerp, spring } = api;
    Moldura.quadro(t, el, api);
    Pecas.conteudo(t, el, api);
    Pecas.surgir(api, el.cont, t, 0.45, { dy: 2 });
    Pecas.surgir(api, el.dial, t, 0.55, { dy: 2 });
    api.tipo.digitar(t, el.digita, { inicio: 1.05, cps: 30 });
    const TL = [2.75, 3.15, 3.55, 3.95];
    el.linhas.forEach((l, i) => {
      const k = spring(t - TL[i], { freq: 1.9, damp: 9 });
      api.set(l, { o: suave(prog(t, TL[i], TL[i] + 0.15)), y: -2.5 * (1 - k) });
    });
    // latência: sobe com os resultados, despenca depois do carimbo
    const STAMP = 7.1;
    const sobe = ease.outCubic(prog(t, 2.75, 3.95)), desce = ease.forte(prog(t, STAMP + 0.15, STAMP + 0.75));
    const lat = Math.round(lerp(lerp(40, 189, sobe), 12, desce));
    el.n.textContent = String(lat);
    const ruim = t >= 2.75 && desce < 0.5, ok = desce >= 0.5;
    el.cont.classList.toggle('ruim', ruim);
    el.cont.classList.toggle('ok', ok);
    api.set(el.val, { s: 1 + 0.07 * api.pulsoSemQuique(t - (STAMP + 0.45), 0.1), origem: '0% 80%' });
    // agulha: −10° → vermelho (−62°) → verde (+62°) com mola, tremendo de leve
    const kv = spring(t - (STAMP + 0.1), { freq: 1.4, damp: 5.5 });
    const A = lerp(lerp(-10, -62, sobe), 62, t > STAMP + 0.1 ? kv : 0) + 2.5 * Math.sin(t * 9.1) * (1 - 0.7 * desce);
    api.set(el.agulha, { r: A - 62 });
    api.set(el.ok, { o: suave(prog(t, 5.3, 5.5)), x: -1.5 * (1 - ease.forte(prog(t, 5.3, 5.75))) });
    // carimbo: chega grande e bate, com tremor no terminal
    const kc = ease.inCubic(prog(t, STAMP - 0.16, STAMP));
    const quica = t > STAMP ? 0.06 * api.mola(t - STAMP, 1, { freq: 3, amort: 9 }) * 6 : 0;
    api.set(el.carimbo, { o: suave(prog(t, STAMP - 0.16, STAMP - 0.06)), s: lerp(1.9, 1, kc) + quica, r: lerp(-14, 0, kc) });
    const tr = api.tremor(t, STAMP, { forca: 0.5, freq: 11 });
    Pecas.surgir(api, el.term, t, 0.7, { dy: 7, s0: 0.95, mola: true, mais: { x: tr.x, r: tr.giro * 0.3 } });
  },
});
}
