/* bastidor — "A virada" (5,5 s)
   Ideia: de dentro da letra surge a prancha do storyboard deste próprio filme. A frase "Inclusive
   este vídeo" sai do desfoque; os seis quadrinhos caem em accelerando; a régua de batidas se
   desenha; uma linha de luz percorre a régua e acende cada quadrinho quando passa (o quadrinho 4 é
   esta cena, com a prancha dentro dela). No fim a câmera mergulha no quadrinho 5, que é exatamente
   o primeiro quadro da cena seguinte (transição do motor).
   Os primeiros 0,75 s acontecem por baixo do mergulho da cena anterior: a entrada começa em 0,4. */
{
const T = { frase: 0.4, quadros: 0.78, regua: [1.0, 1.6], varre: [1.55, 3.65], brilho: 3.05, foco: 4.3 };
const BATIDAS = 52; // o filme tem ~26 s a 120 BPM

Motion.cena('bastidor', {
  render: () => {
    const ticks = Array.from({ length: 9 }, (_, i) => `<i class="tk" style="left:${(i * 12.5).toFixed(2)}%"></i>`).join('');
    const quadros = [0, 1, 2, 3, 4, 5].map((i) => `
      <div class="quadro q${i + 1}">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <span class="tela"><span class="mini">${Minis.html(i)}</span><span class="aceso"></span></span>
        <span class="barra"><span class="trilho"></span><span class="enche"></span>${ticks}</span>
      </div>`).join('');
    return `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <div class="prancha">
        <h2 class="titulo frase">Inclusive <span class="destaque">este vídeo</span></h2>
        <div class="grade">${quadros}</div>
      </div>
    </div>`;
  },

  montar(el, api) {
    el.letras = api.tipo.dividir(el.$('.frase'), { por: 'letra' });
    el.quadros = el.$$('.quadro').map((q, i) => ({
      el: q, i, aceso: q.querySelector('.aceso'), num: q.querySelector('.num'), mini: q.querySelector('.mini'),
      trilho: q.querySelector('.trilho'), enche: q.querySelector('.enche'), ticks: [...q.querySelectorAll('.tk')],
    }));
    el.tempos = api.fx.accelerando(6, { de: 0.11, ate: 0.05 }).map((x) => T.quadros + x);
    el.fzMini = el.$$('.mini .faisca');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo, set } = api;
    const bell = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
    tipo.focar(t, el.letras, { inicio: T.frase, cascata: 0.024 });
    tipo.brilho(t, el.letras, { inicio: T.brilho, dur: 0.75, forca: 0.45 });

    const foco = ease.inOutSine(prog(t, T.foco, T.foco + 0.4));
    const passo = (T.varre[1] - T.varre[0]) / 6;
    el.quadros.forEach((q) => {
      const t0 = el.tempos[q.i];
      const p = prog(t, t0, t0 + 0.42);
      const eleito = q.i === 4;
      // a barra de tempo do quadrinho se preenche; quando chega ao fim, o quadrinho está aceso
      const a = T.varre[0] + q.i * passo;
      const f = ease.inOutSine(prog(t, a, a + passo * 1.08));
      const tocando = suave(prog(t, a - 0.04, a + 0.06)) * (1 - suave(prog(t, a + passo, a + passo + 0.25)));
      set(q.el, {
        y: 3 * (1 - ease.outExpo(p)),
        s: 0.95 + 0.05 * Math.min(1.035, ease.outBack(2.2)(p)),
        o: suave(prog(t, t0, t0 + 0.09)) * (1 - (eleito ? 0 : 0.6 * foco)),
        blur: 0.25 * (1 - ease.outCubic(p)) + (eleito ? 0 : 0.1 * foco),
      });
      const luz = Math.max(f, 0);
      set(q.mini, { bright: lerp(0.4, 1, luz) * (1 + 0.18 * tocando) * (eleito ? 1 + 0.1 * foco : 1), sat: lerp(0.45, 1, luz) });
      q.aceso.style.opacity = (0.22 * luz + 0.78 * tocando + (eleito ? 0.75 * foco : 0)).toFixed(4);
      set(q.num, { o: suave(prog(t, t0 + 0.1, t0 + 0.35)) * lerp(0.5, 1, luz) });
      set(q.trilho, { sx: Math.max(0.0005, ease.forte(prog(t, t0 + 0.15, t0 + 0.75))), o: suave(prog(t, t0 + 0.15, t0 + 0.25)) });
      set(q.enche, { sx: Math.max(0.0005, f), o: suave(prog(f, 0, 0.04)) });
      q.ticks.forEach((tk, k) => {
        const on = suave(prog(t, t0 + 0.2 + k * 0.03, t0 + 0.32 + k * 0.03));
        const aceso = suave(prog(f, k / 8 - 0.02, k / 8 + 0.02));
        tk.style.opacity = (on * lerp(0.4, 1, aceso)).toFixed(4);
        tk.style.background = aceso > 0.5 ? 'var(--destaque)' : '';
      });
    });
    el.fzMini.forEach((fz, i) => { fz.style.transform = `rotate(${(8 * t + i * 11).toFixed(3)}deg)`; });

    api.fx.respirar(t, el.luz, { periodo: 3.6, amp: 0.08 });
    el.cam.pose({ zoom: lerp(1.04, 1, ease.outCubic(prog(t, 0.2, 3.8))) * (1 + 0.006 * (t - 3.8)) });
  },
});
}
