/* _comum.js — a moldura do filme (a identidade do vídeo longo) e as peças que se repetem.
   A moldura é igual em todas as cenas e NÃO entra na câmera: no corte entre cenas ela fica
   parada no lugar, e só o conteúdo troca. O fio condutor é a linha de progresso dourada: a cada
   cena o cursor anda até o próximo passo e o número fantasma troca. A poeira usa o tempo global,
   então continua sem pulo através dos cortes. */
(function () {
  const HANDLE = '@seuperfil';
  const SERIE = '5 jeitos inusitados de usar o Claude';
  const PILULA = ['Intro', 'Passo 1 · Wi‑Fi', 'Passo 2 · Exame', 'Passo 3 · TV', 'Passo 4 · Rua', 'Passo 5 · Diagrama', 'Bônus · Prompts'];
  const PASSO = ['Intro', 'Passo 1/5', 'Passo 2/5', 'Passo 3/5', 'Passo 4/5', 'Passo 5/5', 'Bônus'];
  const FANTASMA = ['05', '01', '02', '03', '04', '05', ''];
  const ROTULOS = ['wi‑fi', 'exame', 'tv', 'rua', 'diagrama'];
  // posição do cursor na trilha (0..4) e quanto da trilha está dourada (0..1)
  const CURSOR = [0, 0, 1, 2, 3, 4, 4];
  const X0 = 10, X1 = 90; // cqw
  const xDot = (i) => X0 + (i * (X1 - X0)) / 4;
  const lerpN = (a, b, k) => (a + (b - a) * k).toFixed(3);
  const N_POEIRA = 34;

  const r = (i, k) => {
    const x = Math.sin((i + 1) * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  window.Moldura = {
    HANDLE,
    html(passo) {
      const pil = PILULA[passo], pilA = PILULA[Math.max(0, passo - 1)];
      // estado natural = quadro final desta cena (o storyboard mostra isto)
      const cur = CURSOR[passo];
      const fr = passo === 0 ? 0 : passo === 6 ? 1 : cur / 4;
      const dots = ROTULOS.map((l, i) => {
        const aceso = passo === 6 || (passo > 0 && i <= cur) ? 1 : 0;
        const atual = passo > 0 && passo < 6 && i === cur ? 1 : 0;
        const feito = passo === 6 || i < cur ? 1 : 0;
        return `<i class="mold-dot" style="left:${xDot(i)}cqw;--aceso:${aceso}"></i>`
          + `<span class="mold-rot" style="left:${xDot(i)}cqw;--atual:${atual};--feito:${feito}"><b>0${i + 1}</b> ${l}</span>`;
      }).join('');
      const poeira = Array.from({ length: N_POEIRA }, (_, i) =>
        `<i style="transform:translate(-50%,-50%) translate(${(r(i, 3) * 100).toFixed(2)}cqw,${(r(i, 2) * 170).toFixed(2)}cqw) scale(${(0.5 + 1.1 * r(i, 6)).toFixed(2)});opacity:${(0.2 + 0.6 * r(i, 5)).toFixed(2)}"></i>`).join('');
      const curStyle = `transform:translate(-50%,-50%) translateX(${lerpN(X0, X1, cur / 4)}cqw)`;
      const ouroStyle = `transform:translateY(-50%) scaleX(${Math.max(0.0001, fr)})`;
      const reguaStyle = `transform:scaleX(${passo === 0 ? 0.06 : Math.max(0.0001, fr)})`;
      return `
      <div class="mold">
        <div class="mold-luz"></div>
        <div class="mold-poeira">${poeira}</div>
        ${FANTASMA[passo] ? `<div class="mold-fantasma">${FANTASMA[passo]}</div>` : ''}
        <div class="mold-topo">
          <span class="mold-selo">✳</span><span class="mold-handle">${HANDLE}</span>
          <span class="mold-pilula"><span class="pil pil-a">${pilA}</span><span class="pil pil-b">${pil}</span></span>
        </div>
        <div class="mold-linha2"><span>${SERIE}</span><span class="mold-passo">${PASSO[passo]}</span></div>
        <div class="mold-regua"><i class="mold-regua-ouro" style="${reguaStyle}"></i></div>
        <div class="mold-trilha">
          <i class="mold-trilho"></i><i class="mold-trilho-ouro" style="${ouroStyle}"></i>${dots}<i class="mold-cursor" style="${curStyle}"></i>
        </div>
        <div class="mold-rodape">guia completo no direct · ${HANDLE}</div>
      </div>`;
    },

    montar(el, api, passo) {
      el.mold = {
        passo,
        luz: el.$('.mold-luz'),
        poeira: api.$$('.mold-poeira i'),
        fantasma: el.$('.mold-fantasma'),
        pilA: el.$('.pil-a'),
        pilB: el.$('.pil-b'),
        regua: el.$('.mold-regua-ouro'),
        ouro: el.$('.mold-trilho-ouro'),
        cursor: el.$('.mold-cursor'),
        dots: api.$$('.mold-dot'),
        rots: api.$$('.mold-rot'),
        pecas: [el.$('.mold-topo'), el.$('.mold-linha2'), el.$('.mold-regua'), el.$('.mold-trilha'), el.$('.mold-rodape')],
      };
      // bases de transform (o inline do estado natural não soma com o que o quadro aplica)
      api.base(el.mold.cursor, 'translate(-50%,-50%)');
      api.base(el.mold.ouro, 'translateY(-50%)');
      api.base(el.mold.regua, '');
      el.mold.poeira.forEach((d) => api.base(d, 'translate(-50%,-50%)'));
    },

    /** anima a moldura. opts.intro: a moldura nasce (só na primeira cena). */
    quadro(t, el, api, { intro = false } = {}) {
      const m = el.mold, { prog, ease, lerp, suave, clamp } = api;
      const p = m.passo;
      const T = api.cena.inicio + t; // tempo global: a poeira e a luz não pulam no corte

      // nascimento da moldura (só na abertura)
      m.pecas.forEach((pc, i) => {
        if (!pc) return;
        const k = intro ? ease.forte(prog(t, 0.05 + i * 0.07, 0.65 + i * 0.07)) : 1;
        api.set(pc, { o: intro ? suave(prog(t, 0.05 + i * 0.07, 0.3 + i * 0.07)) : 1, y: 1.2 * (1 - k), blur: 0.5 * (1 - k) });
      });

      // a pílula troca de passo: o antigo sai desfocando, o novo entra do desfoque
      const kp = intro ? 1 : ease.forte(prog(t, 0.05, 0.5));
      api.set(m.pilA, { o: intro ? 0 : 1 - suave(prog(t, 0.0, 0.22)), blur: intro ? 0 : 0.6 * prog(t, 0, 0.22), y: intro ? 0 : -0.8 * ease.inCubic(prog(t, 0, 0.22)) });
      api.set(m.pilB, { o: intro ? 1 : suave(prog(t, 0.12, 0.34)), blur: 0.6 * (1 - kp), y: 0.8 * (1 - kp) });

      // o cursor anda até o passo desta cena (o fio condutor)
      const de = CURSOR[Math.max(0, p - 1)], para = CURSOR[p];
      const kc = intro ? 1 : ease.forte(prog(t, 0.1, 0.85));
      const pos = lerp(p === 0 ? 0 : de, para, kc);
      const x = lerp(X0, X1, pos / 4);
      const fracao = p === 0 ? 0 : p === 6 ? 1 : (x - X0) / (X1 - X0);
      const fracaoA = p <= 1 ? 0 : (xDot(CURSOR[p - 1]) - X0) / (X1 - X0);
      const fr = p === 6 ? lerp(fracaoA, 1, ease.forte(prog(t, 0.1, 1.1))) : intro ? 0 : fracao;
      api.set(m.ouro, { sx: Math.max(0.0001, fr), origem: '0 50%' });
      api.set(m.regua, { sx: Math.max(0.0001, p === 0 ? 0.06 * ease.forte(prog(t, 0.4, 1.2)) : lerp(fracaoA, p === 6 ? 1 : fracao, 1)), origem: '0 50%' });
      // cursor: pulso de luz quando chega, e respiração depois
      const chega = intro ? 0 : api.pulsoSemQuique(t - 0.62, 0.12);
      const vivo = 1 + 0.06 * Math.sin(2 * Math.PI * T / 1.6);
      api.set(m.cursor, { x: x, s: (1 + 0.35 * chega) * vivo, o: intro ? suave(prog(t, 0.4, 0.7)) : 1, vars: { '--cbrilho': (0.55 + 0.45 * chega).toFixed(3) } });
      m.dots.forEach((d, i) => {
        const aceso = p === 6 ? 1 : i < para || (i === para && p > 0) ? suave(prog(x, xDot(i) - 1, xDot(i))) : 0;
        api.set(d, { vars: { '--aceso': aceso.toFixed(3) } });
      });
      m.rots.forEach((rt, i) => {
        const atual = p > 0 && p < 6 && i === para ? suave(prog(t, 0.5, 0.8)) : 0;
        const feito = p === 6 ? 1 : i < para ? 1 : 0;
        api.set(rt, { vars: { '--atual': atual.toFixed(3), '--feito': String(feito) } });
      });

      // número fantasma: chega do desfoque e deriva devagar; sai junto com o conteúdo
      if (m.fantasma) {
        const kf = ease.forte(prog(t, 0.05, 1.0));
        const sai = ease.inCubic(prog(t, api.dur - 0.28, api.dur));
        api.set(m.fantasma, { o: kf * (1 - sai), blur: 1.6 * (1 - kf) + 1.2 * sai, s: lerp(1.08, 1, kf), x: -0.4 * (t - api.ref) });
      }

      // luz âmbar que respira (tempo global)
      api.set(m.luz, { o: 0.88 + 0.12 * Math.sin(2 * Math.PI * T / 5.3), s: 1 + 0.02 * Math.sin(2 * Math.PI * T / 7.1) });
      // poeira dourada subindo devagar (tempo global, sem pulo no corte)
      const H = api.vertical ? 177.78 : 56.25;
      m.poeira.forEach((d, i) => {
        const v = 0.6 + 1.6 * r(i, 1);
        const y0 = r(i, 2) * (H + 10);
        const y = ((y0 - T * v) % (H + 10) + (H + 10)) % (H + 10) - 5;
        const xx = r(i, 3) * 100 + 1.2 * Math.sin(T * 0.4 + i);
        const tw = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(T * (0.7 + r(i, 4)) + i * 2.1), 2);
        const borda = clamp(Math.min(y + 5, H + 5 - y) / 12);
        api.set(d, { x: xx, y: y, o: tw * borda * (0.25 + 0.75 * r(i, 5)), s: 0.5 + 1.1 * r(i, 6) });
      });
    },
  };

  /** Peças de conteúdo que se repetem. */
  window.Pecas = {
    contador(rotulo, valor, classe = '') {
      return `<div class="contador ${classe}"><span class="cont-rot">${rotulo}</span><span class="cont-val">${valor}</span></div>`;
    },
    /** entrada de um título serifado palavra a palavra + câmera e saída do conteúdo */
    conteudo(t, el, api, { ini = 0 } = {}) {
      const { prog, ease } = api;
      api.tipo.focar(t, el.palavras, { inicio: ini });
      const sai = ease.inExpo(prog(t, api.dur - 0.26, api.dur));
      api.set(el.conteudo, { s: (1 + 0.01 * (t - api.ref)) * (1 + 0.025 * sai), o: 1 - sai, blur: 0.9 * sai, subpixel: true });
    },
  };
})();
