/* entregas — "As entregas" (5,5 s)
   Ideia: o cartão de Motion chega sozinho (é o quadrinho 5 do storyboard, no mesmo tamanho); os
   outros sete ofícios entram de fora do quadro já em movimento e caem na pilha em accelerando,
   cada impacto afunda a pilha, que devolve. A pilha prende o ar e, na batida 4, explode em espiral
   numa órbita que nunca para; "Do pedido à entrega" sobe no vazio do centro. Saída: a câmera
   atravessa a órbita (transição do motor).
   Os primeiros 0,75 s acontecem por baixo do mergulho: o cartão segura o tamanho da miniatura. */
{
const W = 17; // cqw: largura de cada cartão na pilha e na órbita
const HEROI = 26; // cqw: a largura do cartão de Motion na miniatura 5 (26 % do quadro)
const T = { assenta: [0.55, 1.15], cai: 0.98, prende: [1.82, 2.0], explode: 2.0, frase: 2.45, varre: 2.85, brilho: 3.7 };
const RX = 37, RY = 16.4; // a órbita, em cqw
const PILHA = [[0, 0, 0], [-1.6, -0.9, -8], [1.4, -1.2, 7], [-0.8, 0.9, -4], [1.9, 0.6, 10], [-2.1, 0.2, 5], [0.7, -0.5, -10], [-0.4, 0.4, 3]];

Motion.cena('entregas', {
  render: () => `
    <div class="camada c-longe"><div class="luz"></div></div>
    <div class="camada c-meio">
      <span class="halo halo-quente"></span>
      <div class="pilha"><h2 class="titulo frase">Do pedido<br>à <span class="destaque">entrega</span></h2></div>
      <div class="cartoes">${OFICIOS.map((o, k) => Cartoes.html(k, { classe: `c${k}` })).join('')}</div>
    </div>`,

  montar(el, api) {
    el.cartoes = el.$$('.cartoes .cartao').map((c, k) => {
      const a0 = api.rand(k + 41) * Math.PI * 2;
      return {
        el: c, k,
        px: PILHA[k][0], py: PILHA[k][1], pr: PILHA[k][2],
        ax: Math.cos(a0) * 70, ay: Math.sin(a0) * 46 - 10, ar: (api.rand(k + 9) - 0.5) * 60,
        fi0: Math.PI / 2 + (k * Math.PI) / 4,
      };
    });
    el.chegadas = [0, ...api.fx.accelerando(7, { de: 0.085, ate: 0.032 }).map((x) => T.cai + x)];
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.letrasDestaque = api.tipo.dividir(el.$('.frase .destaque'), { por: 'letra' });
    el.fzs = el.$$('.cartoes .faisca');
    el.halo = el.$('.halo');
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.5 }, { el: el.$('.c-meio'), z: 0 }] });
  },

  quadro(t, el, api) {
    const { prog, ease, lerp, suave, set, fisica, tipo } = api;
    const impactos = el.chegadas.slice(1);
    const afunda = fisica.afundar(t, impactos, { forca: 0.012 });
    const prende = ease.inOutSine(prog(t, T.prende[0], T.prende[1])) * (1 - suave(prog(t, T.explode, T.explode + 0.05)));
    const sPilha = 1 + afunda - 0.035 * prende;
    // a órbita nunca para: um piso constante e um embalo que vem da explosão e se desfaz
    const dt = Math.max(0, t - T.explode);
    const giro = 0.24 * dt + 1.3 * (1 - Math.exp(-dt / 0.45)) - 1.3;

    el.cartoes.forEach((c) => {
      // ── pilha: o herói assenta; os outros chegam de fora do quadro e batem
      let x, y, r, s, o;
      if (c.k === 0) {
        const a = ease.forte(prog(t, T.assenta[0], T.assenta[1]));
        x = 0; y = 0; r = 0; s = lerp(HEROI / W, 1, a); o = 1;
      } else {
        const tl = el.chegadas[c.k];
        const q = prog(t, tl - 0.3, tl);
        const e = ease.inQuad(q);
        x = lerp(c.ax, c.px, e); y = lerp(c.ay, c.py, e); r = lerp(c.pr + c.ar, c.pr, ease.outCubic(q));
        s = lerp(1.3, 1, e);
        o = suave(prog(t, tl - 0.3, tl - 0.24));
      }
      x *= sPilha; y *= sPilha; s *= sPilha;
      // ── explosão em espiral até a órbita (o herói decola 70 ms depois)
      const te = T.explode + (c.k === 0 ? 0.07 : 0);
      const rho = ease.outExpo(prog(t, te, te + 0.95));
      const fi = c.fi0 + giro - 1.1 * (1 - rho);
      const d = Math.sin(fi); // profundidade: embaixo = perto
      const ox = RX * Math.cos(fi), oy = RY * d;
      const so = 1 + 0.2 * d;
      const ro = -7 * Math.cos(fi);
      const X = lerp(x, ox, rho), Y = lerp(y, oy, rho);
      const atras = Math.max(0, -d) * rho;
      set(c.el, {
        pre: 'translate(-50%,-50%)',
        x: X, y: Y, r: lerp(r, ro, rho), s: lerp(s, so, rho), o,
        blur: 0.22 * atras + (c.k > 0 ? 0.35 * (1 - suave(prog(t, el.chegadas[c.k] - 0.12, el.chegadas[c.k]))) : 0),
        bright: 1 - 0.35 * atras,
      });
      c.el.style.zIndex = rho > 0.02 ? String(Math.round(100 + 60 * d)) : String(10 + c.k);
    });
    el.fzs.forEach((f) => { f.style.transform = `rotate(${(10 * t).toFixed(3)}deg)`; });

    // ── a frase no vazio do centro
    tipo.focar(t, el.palavras, { inicio: T.frase, cascata: 0.06 });
    tipo.varrerDestaque(t, el.letrasDestaque, { inicio: T.varre, dur: 0.5 });
    tipo.brilho(t, el.letrasDestaque, { inicio: T.brilho, dur: 0.6, forca: 0.45 });

    set(el.halo, { s: 0.55 + 0.25 * ease.outCubic(prog(t, T.explode, T.explode + 1)) + 0.02 * api.vida(t, { inicio: 2.5, periodo: 3.2 }), o: 0.55 + 0.25 * Math.exp(-(((t - T.explode - 0.1) / 0.25) ** 2)) });
    api.fx.respirar(t, el.luz, { periodo: 3.9, amp: 0.08 });
    const tremor = api.tremor(t, T.explode, { forca: 0.15 });
    el.cam.pose({ zoom: lerp(1.02, 1, ease.outQuad(prog(t, 0, 3.4))) * (1 + 0.01 * Math.max(0, t - 3.4)), x: tremor.x, y: tremor.y });
  },
});
}
