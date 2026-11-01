/* oficios — "Os ofícios" (5,217 s = uma frase da música, do drop até o primeiro mergulho)
   Ideia: a faísca vira um sol. No drop (t = 0) ela solta o ar que prendeu no fim da cena anterior
   e os oito feixes disparam numa rajada; na ponta de cada feixe um ofício pousa, um por batida, no
   sentido do relógio. A faísca pulsa a cada batida. Na batida 8 uma onda de luz corre pelos
   feixes; na batida 12 "Motion design" esquenta, os outros se apagam, e a câmera mergulha no "o"
   (transição do motor, 0,75 s), chegando na cena seguinte exatamente no início da próxima frase. */
{
const RX = 25.5, RY = 33; // elipse das âncoras: cqw na horizontal, cqh na vertical
const P = 0.3261; // uma batida da música
const T = { passo: 0.04, onda: 8 * P, escolhe: 12 * P };
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
    const tb = (k) => ordem(k) * T.passo; // os feixes: rajada no drop
    const tw = (k) => (ordem(k) + 1) * P; // os ofícios: um por batida
    const sel = ease.inOutSine(prog(t, T.escolhe, T.escolhe + 0.4));
    // pulso de cada batida (ataque de um quadro, decai rápido)
    const pulso = PulsoGrade(t, P, P, { ataque: 0.08, decai: 0.16 });

    // ── a faísca: solta no drop com mola curta (objeto), depois pulsa na batida
    const solta = api.spring(t, { freq: 1.7, damp: 6 });
    const s = lerp(0.94, 1, solta) * (1 + 0.022 * pulso) * (1 + 0.03 * api.vida(t, { inicio: 1.0, periodo: 2.4 }));
    set(el.sol, { r: 10 * t * (1 - 0.6 * ease.inOutSine(prog(t, 0, 0.6))) + 6 * api.vida(t, { inicio: 1.0, periodo: 3.6 }), s, bright: 1 + 0.6 * bell(t, 0.06, 0.12) + 0.1 * pulso + 0.25 * sel });
    el.raios.forEach((r, k) => {
      const flick = bell(t, tb(k) + 0.03, 0.06) + 0.35 * bell(t, tw(k), 0.06);
      r.style.transform = `rotate(${k * 45}deg) scale(${(1 - 0.08 * flick).toFixed(4)}, ${(1 + 0.22 * flick).toFixed(4)})`;
    });

    // ── feixes: disparam do raio para fora, com uma cabeça de luz que corre e se apaga na ponta
    el.feixes.forEach((f) => {
      const t0 = tb(f.k);
      const p = ease.forte(prog(t, t0, t0 + 0.4));
      const onda = bell(t, T.onda + ordem(f.k) * 0.08, 0.08);
      const eleito = f.k === 0 ? sel : 0;
      f.el.style.transform = `rotate(var(--ang)) translateX(var(--r0))`;
      set(f.fio, { pre: '', sx: Math.max(0.0005, p * (1 + 0.025 * Math.max(0, t - 1.2))), o: suave(prog(t, t0, t0 + 0.05)) * (1 - 0.85 * sel * (f.k === 0 ? 0 : 1)), bright: 1 + 0.9 * onda + 0.8 * eleito + 0.5 * bell(t, tw(f.k), 0.08) });
      f.cab.style.opacity = (suave(prog(t, t0, t0 + 0.05)) * (1 - suave(prog(t, t0 + 0.25, t0 + 0.5)))).toFixed(4);
      f.cab.style.left = `${(p * 100).toFixed(3)}%`;
    });

    // ── ofícios: nascem quando a luz chega na ponta, empurrados um fio para fora
    const corpo = el.corpo;
    el.palavras.forEach((w) => {
      const t0 = tw(w.k) - 0.03;
      const e = ease.forte(prog(t, t0, t0 + 0.6));
      const onda = bell(t, T.onda + ordem(w.k) * 0.08 + 0.06, 0.1);
      const eleito = w.k === 0;
      const apaga = eleito ? 0 : sel;
      set(w.el, {
        pre: w.pre,
        x: w.ux * (1.2 * (1 - e) + 0.5 * Math.max(0, t - 1.2)) + (eleito ? 0.4 * sel : 0),
        y: w.uy * (1.2 * (1 - e) + 0.5 * Math.max(0, t - 1.2)) + 0.16 * corpo * (1 - e),
        o: suave(prog(t, t0, t0 + 0.2)) * (1 - 0.74 * apaga),
        blur: 0.1 * corpo * (1 - e) + 0.12 * apaga,
        bright: 1 + 0.35 * onda + 0.15 * (eleito ? sel : 0),
        s: eleito ? 1 + 0.04 * sel : 1,
      });
      w.el.style.color = eleito && sel > 0 ? `color-mix(in srgb, var(--destaque) ${(sel * 100).toFixed(1)}%, var(--texto))` : '';
    });

    set(el.halo, { s: 0.62 + 0.08 * ease.outCubic(prog(t, 0, 0.8)) + 0.02 * api.vida(t, { inicio: 1, periodo: 3.3 }), o: 0.7 + 0.2 * bell(t, 0.1, 0.25) + 0.06 * pulso });
    api.fx.respirar(t, el.luz, { periodo: 4.2, amp: 0.07 });
    el.cam.pose({ zoom: (1 + 0.018 * t) * (1 + 0.035 * bell(t, 0.05, 0.25) + 0.006 * pulso), giro: 1.6 * Math.sin((2 * Math.PI * t) / 9) });
  },
});
}
