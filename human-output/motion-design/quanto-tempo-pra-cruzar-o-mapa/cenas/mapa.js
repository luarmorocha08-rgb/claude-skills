/* mapa — "A travessia" (9,5 s)
   Ideia: a câmera recua devagar sobre a ilha à noite enquanto três linhas de luz atravessam o mapa
   de ponta a ponta, uma de cada vez, e cada contador corre junto e trava.
   Batidas: 0 a ilha sai do desfoque · 0,3 HUD · b(2) as linhas · 1,5→4,5 a pé (0→178) ·
   4,9→6,9 de carro (0→35) · 7,2→8,0 de avião (0→7) · 8,8 quadro aprovado · saída lâmina de luz.
   Os tempos são os da referência (aproximados), não medidos por nós. */
{
const LINHAS = [
  { id: 'pe', rot: 'A pé', n: 178, de: 1.5, ate: 4.5, glifo: '<circle class="g" cx="27" cy="7" r="4.6"/><path class="g traco" d="M25 15 L22 28 M24 17 L17 24 M25 17 L32 22 M22 28 L16 44 M22 28 L29 35 L30 44"/>' },
  { id: 'carro', rot: 'De carro', n: 35, de: 4.9, ate: 6.9, glifo: '<path class="g" d="M3 31 q0-6 6-7 l6-8 q2-3 6-3 h11 q3 0 5 3 l6 8 q6 1 6 7 v5 h-4 a5.5 5.5 0 0 0-11 0 h-15 a5.5 5.5 0 0 0-11 0 h-5z M17 23 h9 v-7 h-4 q-1 0-2 1z M29 23 h10 l-4-6 q-1-1-2-1 h-4z" fill-rule="evenodd"/><circle class="g" cx="13.5" cy="37" r="4"/><circle class="g" cx="38.5" cy="37" r="4"/>' },
  { id: 'aviao', rot: 'De avião', n: 7, de: 7.2, ate: 8.0, glifo: '<path class="g" d="M24 2 q3.4 0 3.4 6.5 v10 l18 10.5 v4.5 l-18-5.5 v10.5 l6 4.5 v3.4 l-9.4-2.4 -9.4 2.4 v-3.4 l6-4.5 v-10.5 l-18 5.5 v-4.5 l18-10.5 v-10 q0-6.5 3.4-6.5z"/>' },
];

Motion.cena('mapa', {
  render: () => `
    <div class="plano fundo-mar"></div><div class="ondas-cima"></div>
    <div class="camada c-mapa">${Mapa.svg()}${LINHAS.map((l) => `<div class="cabeca c-${l.id}"></div>`).join('')}</div>
    <div class="camada c-nuvens"><div class="nuvem n1"></div><div class="nuvem n2"></div><div class="nuvem n3"></div></div>
    <div class="veu veu-hud"></div>
    <div class="hud">
      <p class="etiqueta e1">GTA VI · tempo aproximado</p>
      <h2 class="titulo q1">Quanto tempo pra</h2>
      <h2 class="titulo q2"><span class="destaque">cruzar o mapa?</span></h2>
    </div>
    <div class="linhas">${LINHAS.map((l) => `
      <div class="linha l-${l.id}">
        <svg class="glifo" viewBox="0 0 48 48">${l.glifo}</svg>
        <div class="txt"><span class="rot">${l.rot}</span><span class="num"><b class="n">${l.n}</b><span class="u">MIN</span></span></div>
      </div>`).join('')}
    </div>`,
  montar(el, api) {
    el.q1 = api.tipo.dividir(el.$('.q1'), { por: 'palavra' });
    el.q2 = api.tipo.dividir(el.$('.q2'), { por: 'letra' });
    el.e1 = api.tipo.dividir(el.$('.e1'), { por: 'palavra' });
    el.L = LINHAS.map((l) => {
      const rotas = el.$$(`.rota.r-${l.id}, .rota-brilho.r-${l.id}`);
      const rota = el.$(`.rota.r-${l.id}`);
      const len = rota.getTotalLength();
      return { ...l, rotas, rota, len, cab: el.$(`.cabeca.c-${l.id}`), linha: el.$(`.linha.l-${l.id}`), num: el.$(`.l-${l.id} .n`) };
    });
    el.nuvens = el.$$('.nuvem');
    // quando cada rota passa perto de cada cidade: a cidade acende nesse instante
    el.cidades = el.$$('.brilho-cidade').map((c) => {
      const cx = +c.dataset.x, cy = +c.dataset.y, passa = [];
      el.L.forEach((L) => {
        let melhor = 1e9, pm = 0;
        for (let k = 0; k <= 200; k++) { const q = L.rota.getPointAtLength(L.len * k / 200); const d = Math.hypot(q.x - cx, q.y - cy); if (d < melhor) { melhor = d; pm = k / 200; } }
        if (melhor < 140) passa.push({ L, p: pm });
      });
      return { el: c, passa };
    });
    el.mapa = el.$('.c-mapa');
  },
  quadro(t, el, api) {
    const { prog, ease, lerp, suave, tipo } = api;
    // a ilha sai do desfoque e da luz baixa
    const ent = ease.forte(prog(t, 0, 0.9));
    api.set(el.$('.c-mapa'), { blur: lerp(0.8, 0, ent), bright: lerp(0.4, 1, ent) });
    api.set(el.$('.ondas-cima'), { y: t * 0.35 });
    // HUD
    tipo.focar(t, el.e1, { inicio: 0.25 });
    tipo.focar(t, el.q1, { inicio: 0.35 });
    tipo.focar(t, el.q2, { inicio: 0.6 });
    tipo.derivaDestaque(t, el.q2, { inicio: 1.6 });
    // as três linhas: entram juntas (apagadas), cada uma acende quando a sua rota começa
    el.L.forEach((L, i) => {
      const e = ease.forte(prog(t, 0.95 + 0.1 * i, 1.6 + 0.1 * i));
      const acende = suave(prog(t, L.de - 0.25, L.de + 0.1));
      const p = ease.inOutSine(prog(t, L.de, L.ate));
      const trava = t >= L.ate ? Math.exp(-(t - L.ate) * 5) : 0;
      api.set(L.linha, { o: e * lerp(0.42, 1, acende), y: lerp(2.2, 0, e), blur: lerp(0.5, 0, e), bright: 1 + 0.7 * trava });
      L.num.textContent = String(Math.round(L.n * p));
      // a rota se desenha; a cabeça de luz corre na frente
      L.rotas.forEach((r) => { r.style.strokeDashoffset = (1 - p).toFixed(5); r.style.opacity = p > 0 ? '' : '0'; });
      const pt = L.rota.getPointAtLength(L.len * p);
      const X = Mapa.tx + pt.x * Mapa.k, Y = Mapa.ty + pt.y * Mapa.k;
      const vivo = suave(prog(t, L.de - 0.05, L.de + 0.15)) * (1 - 0.65 * suave(prog(t, L.ate, L.ate + 0.6)));
      api.set(L.cab, { x: X / 10.8, y: Y / 10.8, o: vivo, s: 1 + 0.5 * trava });
    });
    // nuvens em deriva, perto da câmera
    el.nuvens.forEach((n, i) => api.set(n, { x: (i % 2 ? -1 : 1) * (t * 0.7 + i), y: 0.3 * Math.sin(t * 0.5 + i) }));
    // cidades acendem quando a linha passa
    el.cidades.forEach((c) => {
      let f = 0;
      c.passa.forEach(({ L, p }) => { const tp = L.de + (L.ate - L.de) * p; f += Math.exp(-Math.max(0, t - tp) * 2.2) * suave(prog(t, tp - 0.05, tp + 0.08)); });
      c.el.style.opacity = (0.7 + 0.3 * Math.min(1, 0.3 + f)).toFixed(4);
      c.el.style.transformBox = 'fill-box'; c.el.style.transformOrigin = 'center';
      c.el.style.transform = `scale(${(1 + 0.35 * Math.min(1, f)).toFixed(4)})`;
    });
    // câmera do mapa: recua sem parar (drone subindo), passando por 1,0 no aprovado; o HUD fica firme
    const rec = ease.outCubic(prog(t, 0, api.ref));
    const z = lerp(1.32, 1, rec) * (1 - 0.006 * Math.max(0, t - api.ref));
    api.set(el.mapa, { s: z, y: lerp(9, 0, rec), origem: '58% 70%' });
    api.set(el.$('.c-nuvens'), { s: 1 + (z - 1) * 1.6, origem: '50% 50%' });
    api.set([el.$('.hud'), el.$('.linhas')], { s: api.viva(t), origem: '0% 0%' });
  },
});
}
