/* jogo — "02 · O jogo" (3 s)
   Ideia: o celular entra em pé e gira para o lado como quem vira um console; o mundo low-poly do
   jogo se ergue em camadas e o personagem do perfil vira o herói da fase. */
{
Motion.cena('jogo', {
  render: (c) => `
    <div class="camada c-longe"><div class="luz"></div><div class="chao"></div></div>
    <div class="camada c-meio"><div class="aparelho">${c.mockup('celular', { classe: 'fone-deitado', tela: `
      <div class="fase">
        <div class="ceu"></div><div class="sol"></div>
        <div class="montes m1"></div><div class="montes m2"></div><div class="montes m3"></div>
        <div class="pista"></div>
        <div class="heroi-jogo">${c.foto('personagem')}</div>
        <div class="moedas"><i></i><i></i><i></i><i></i></div>
        <div class="bloco b1"></div><div class="bloco b2"></div>
        <div class="hud"><span class="pontos">0450</span><span class="vidas"><i></i><i></i><i></i></span></div>
      </div>` })}</div>
      <div class="icone i-controle">${c.foto('joystick')}</div>
    </div>
    <div class="camada c-perto"><div class="coluna topo">
      <p class="rotulo">02 · Jogo</p>
      <h2 class="titulo frase">Um <span class="destaque">jogo</span><br>pro celular.</h2>
    </div></div>`,
  montar(el, api) {
    el.ap = el.$('.aparelho');
    el.montes = el.$$('.montes'); el.sol = el.$('.sol'); el.pista = el.$('.pista');
    el.heroi = el.$('.heroi-jogo'); el.moedas = el.$$('.moedas i'); el.blocos = el.$$('.bloco');
    el.hud = el.$('.hud'); el.pontos = el.$('.pontos'); el.ctrl = el.$('.i-controle');
    el.rot = api.tipo.dividir(el.$('.rotulo'), { por: 'palavra' });
    el.pal = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.luz = el.$('.luz');
    el.cam = api.camera({ camadas: [{ el: el.$('.c-longe'), z: -0.6 }, { el: el.$('.c-meio'), z: 0 }, { el: el.$('.c-perto'), z: 0.2 }] });
  },

  quadro(t, el, api) {
    const { tipo, prog, suave, ease, spring, vida, mola, pulso, ref } = api;
    // o celular gira para o lado e trava na batida 1, com um quique pequeno
    const g = ease.simetrica(prog(t, 0, 0.5));
    api.set(el.ap, { r: 90 * (1 - g) + mola(t - 0.5, -55, { freq: 2.2, amort: 7 }), s: 0.62 + 0.38 * ease.forte(prog(t, 0, 0.6)) });
    // o mundo se ergue em camadas e corre em paralaxe
    el.montes.forEach((m, i) => {
      const t0 = 0.4 + 0.08 * i;
      api.set(m, { y: 10 * (1 - ease.forte(prog(t, t0, t0 + 0.6))), x: -[0.5, 0.9, 1.5][i] * (t - ref), o: suave(prog(t, t0, t0 + 0.12)) });
    });
    api.set(el.sol, { o: suave(prog(t, 0.45, 0.9)), s: 0.85 + 0.15 * ease.forte(prog(t, 0.45, 1.1)) + 0.03 * vida(t, { inicio: 1.2, periodo: 3.3 }) });
    api.set(el.pista, { o: suave(prog(t, 0.35, 0.5)) });
    // o personagem cai na pista ('pof') e depois pula de leve a cada batida
    const f = prog(t, 0.9, 1.12);
    const queda = -16 * (1 - f * f) * (t < 1.12 ? 1 : 0) + mola(t - 1.12, 40, { freq: 3, amort: 9 });
    const pulo = t > 1.4 ? -1.1 * pulso(((t - 1.4) % 0.5) / 0.5) : 0;
    api.set(el.heroi, { y: queda + pulo, o: suave(prog(t, 0.88, 0.95)) });
    el.moedas.forEach((m, i) => { const t0 = 1.0 + 0.08 * i; api.set(m, { s: 0.6 + 0.4 * spring(t - t0, { freq: 1.8, damp: 7 }), o: suave(prog(t, t0, t0 + 0.08)), y: 0.4 * vida(t, { inicio: 1.5, periodo: 1.0, fase: i * 0.25 }) }); });
    el.blocos.forEach((b, i) => { const t0 = 1.0 + 0.12 * i; api.set(b, { sy: Math.max(0.02, spring(t - t0, { freq: 1.7, damp: 6.5 })), origem: '50% 100%', o: suave(prog(t, t0, t0 + 0.06)) }); });
    window.subir(t, api, el.hud, 1.1, { y: -1.2, blur: 0.2 });
    el.pontos.textContent = String(Math.round(45 * ease.outCubic(prog(t, 1.1, 1.95))) * 10).padStart(4, '0');
    window.chegar(t, api, el.ctrl, { inicio: 0.95, de: { y: 8, r: 20, s: 0.8 } });
    api.set(el.ctrl, { y: 0.8 * vida(t, { inicio: 1.6, periodo: 2.7 }) + 8 * (1 - spring(t - 0.95, { freq: 1.4, damp: 6.4 })) });
    tipo.focar(t, el.rot, { inicio: 0.12 });
    tipo.focar(t, el.pal, { inicio: 0.22 });
    tipo.varrerDestaque(t, el.pal, { inicio: 0.6, dur: 0.45 });
    tipo.derivaDestaque(t, el.pal, { inicio: 1.2 });
    api.fx.respirar(t, el.luz, { periodo: 4.6, amp: 0.08 });
    el.cam.pose({ zoom: (1 - 0.03 * pulso(prog(t, 0, 0.7))) * api.viva(t) });
  },
});
}
