/* oficios — "Os ofícios" (5 s)
   Ideia: a faísca vira um sol. Ela prende o ar e, na batida, cada raio dispara um feixe de luz no
   sentido do relógio; na ponta de cada feixe nasce um ofício. No hold uma onda de luz corre pelos
   feixes uma vez. Na batida 7 "Motion design" esquenta até a terracota, os outros se apagam, e a
   câmera mergulha dentro do "o" de "Motion" (transição do motor).
   Começa exatamente onde a "faisca" terminou: a faísca no centro, 20 cqmin, raios em 0°. */
{
const RX = 25.5, RY = 33; // elipse das âncoras: cqw na horizontal, cqh na vertical
const T = { prende: 0.36, dispara: 0.5, passo: 0.045, onda: 2.1, escolhe: 3.5 };
const ORDEM = [6, 7, 0, 1, 2, 3, 4, 5]; // começa no alto e gira no sentido do relógio

Motion.cena('oficios', {
  render: (c) => {
    const ratio = c.altura / c.largura;
    const r0 = 10 * ratio + 1.2; // raio da faísca (10 cqmin) + folga, em cqw
    const itens = OFICIOS.map((o, k) => {
      const a = (k * Math.PI) / 4, co = Math.cos(a), si = Math.sin(a);
      const X = RX * co, Y = RY * si * ratio;
      const al = co > 0.35 ? 'e' : co < -0.35 ? 'd' : si < 0 ? 'ct' : 'cb';
      const nome = o.id === 'motion' ? 'M<span class="alvo">o</span>tion design' : o.nome;
      const L = Math.hypot(X, Y) - r0 - 1.6;
      const ang = (Math.atan2(Y, X) * 180) / Math.PI;
      return {
        feixe: `<span class="feixe" data-k="${k}" style="--ang:${ang.toFixed(2)}deg;--r0:${r0.toFixed(2)}cqw;width:${L.toFixed(2)}cqw"><i class="fio"></i><i class="cab"></i></span>`,
        palavra: `<span class="oficio al-${al}" data-k="${k}" style="left:calc(50% + ${X.toFixed(2)}cqw);top:calc(50% + ${Y.toFixed(2)}cqw)">${nome}</span>`,
      };
    });
    return `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <span class="halo halo-quente"></span>
      ${itens.map((i) => i.feixe).join('')}
      <span class="sol">${Faisca.svg()}</span>
      ${itens.map((i) => i.palavra).join('')}
    </div>`;
  },

  montar(el, api) {
    el.sol = el.$('.sol');
    el.raios = [...el.sol.querySelectorAll('.fz-raio')];
    el.feixes = el.$$('.feixe').map((f) => ({ el: f, fio: f.querySelector('.fio'), cab: f.querySelector('.cab'), k: +f.dataset.k }));
    el.palavras = el.$$('.oficio').map((p) => {
      const k = +p.dataset.k, a = (k * Math.PI) / 4;
      const al = p.className.match(/al-(\w+)/)[1];
      const pre = { e: 'translate(0,-50%)', d: 'translate(-100%,-50%)', ct: 'translate(-50%,-100%)', cb: 'translate(-50%,0)' }[al];
      return { el: p, k, ux: Math.cos(a), uy: Math.sin(a), pre };
    });
    el.corpo = parseFloat(getComputedStyle(el.palavras[0].el).fontSize) / (Motion.palco.offsetWidth / 100);
    el.halo = el.$('.halo');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, set } = api;
    const bell = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
    const ordem = (k) => ORDEM.indexOf(k);
    const tb = (k) => T.dispara + ordem(k) * T.passo;
    const sel = ease.inOutSine(prog(t, T.escolhe, T.escolhe + 0.45));

    // ── a faísca: prende o ar, solta na batida (objeto: mola curta), depois respira
    const prende = ease.inOutSine(prog(t, T.prende - 0.16, T.dispara));
    const solta = api.spring(Math.max(0, t - T.dispara), { freq: 1.7, damp: 6 });
    const s = (1 - 0.06 * prende * (t < T.dispara ? 1 : 0)) * (t < T.dispara ? 1 : lerp(0.94, 1, solta))
      * (1 + 0.02 * api.vida(t, { inicio: 1.4, periodo: 2.8 }));
    set(el.sol, { r: 1.6 * (1 - Math.exp(-t / 0.4)) + 2.2 * api.vida(t, { inicio: 1.2, periodo: 5.2 }), s, bright: 1 + 0.35 * bell(t, T.dispara + 0.12, 0.14) + 0.25 * sel });
    el.raios.forEach((r, k) => {
      const flick = bell(t, tb(k) + 0.03, 0.07);
      r.style.transform = `rotate(${k * 45}deg) scale(${(1 - 0.08 * flick).toFixed(4)}, ${(1 + 0.22 * flick).toFixed(4)})`;
    });

    // ── feixes: disparam do raio para fora, com uma cabeça de luz que corre e se apaga na ponta
    el.feixes.forEach((f) => {
      const t0 = tb(f.k);
      const p = ease.forte(prog(t, t0, t0 + 0.46));
      const onda = bell(t, T.onda + ordem(f.k) * 0.11, 0.1);
      const eleito = f.k === 0 ? sel : 0;
      f.el.style.transform = `rotate(var(--ang)) translateX(var(--r0))`;
      set(f.fio, { pre: '', sx: Math.max(0.0005, p), o: suave(prog(t, t0, t0 + 0.06)) * (1 - 0.85 * sel * (f.k === 0 ? 0 : 1)), bright: 1 + 0.9 * onda + 0.8 * eleito });
      f.cab.style.opacity = (suave(prog(t, t0, t0 + 0.05)) * (1 - suave(prog(t, t0 + 0.28, t0 + 0.55)))).toFixed(4);
      f.cab.style.left = `${(p * 100).toFixed(3)}%`;
    });

    // ── ofícios: nascem quando a luz chega na ponta, empurrados um fio para fora
    const corpo = el.corpo;
    el.palavras.forEach((w) => {
      const t0 = tb(w.k) + 0.24;
      const e = ease.forte(prog(t, t0, t0 + 0.6));
      const onda = bell(t, T.onda + ordem(w.k) * 0.11 + 0.08, 0.12);
      const eleito = w.k === 0;
      const apaga = eleito ? 0 : sel;
      set(w.el, {
        pre: w.pre,
        x: w.ux * 1.2 * (1 - e) + (eleito ? 0.4 * sel : 0),
        y: w.uy * 1.2 * (1 - e) + 0.16 * corpo * (1 - e),
        o: suave(prog(t, t0, t0 + 0.2)) * (1 - 0.74 * apaga),
        blur: 0.1 * corpo * (1 - e) + 0.12 * apaga,
        bright: 1 + 0.35 * onda + 0.15 * (eleito ? sel : 0),
        s: eleito ? 1 + 0.04 * sel : 1,
      });
      w.el.style.color = eleito && sel > 0 ? `color-mix(in srgb, var(--destaque) ${(sel * 100).toFixed(1)}%, var(--texto))` : '';
    });

    set(el.halo, { s: 0.62 + 0.08 * ease.outCubic(prog(t, T.dispara, T.dispara + 0.8)) + 0.02 * api.vida(t, { inicio: 1, periodo: 3.3 }), o: 0.7 + 0.1 * bell(t, T.dispara + 0.1, 0.2) });
    api.fx.respirar(t, el.luz, { periodo: 4.2, amp: 0.07 });
    el.cam.pose({ zoom: 1 + 0.01 * t, giro: 0.5 * Math.sin((2 * Math.PI * t) / 10) });
  },
});
}
