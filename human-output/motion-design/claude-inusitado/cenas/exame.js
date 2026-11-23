/* exame — "2 · Exame em 3D" (7 s)
   Ideia: as fatias da tomografia caem uma sobre a outra e empilham um volume 3D que gira, com uma
   lâmina de luz dourada subindo por ele. */
{
const N = 26;
// perfil de uma cabeça, de baixo (pescoço) para cima (topo): raio relativo 0..1
function perfil(u) {
  if (u < 0.14) return 0.46;
  if (u < 0.4) return 0.46 + 0.5 * Math.sin(((u - 0.14) / 0.26) * Math.PI / 2);
  if (u < 0.58) return 0.96 + 0.04 * Math.sin(((u - 0.4) / 0.18) * Math.PI / 2);
  const k = (u - 0.58) / 0.44;
  return Math.max(0.12, Math.sqrt(Math.max(0, 1 - k * k)));
}
const PASSO = 1.75; // cqw entre fatias
Motion.cena('exame', {
  render: () => {
    const fatias = Array.from({ length: N }, (_, i) => {
      const u = i / (N - 1), rr = perfil(u);
      const w = 42 * rr, d = 50 * rr;
      return `<i class="x-fatia" style="width:${w.toFixed(2)}cqw;height:${d.toFixed(2)}cqw;--y:${(-i * PASSO).toFixed(2)}cqw;transform:translate(-50%,-50%) translateY(var(--y)) rotateX(90deg)"></i>`;
    }).join('');
    return `
    ${Moldura.html(2)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Sua tomografia vira <em>modelo 3D</em></h2>
      ${Pecas.contador('Fatias', '<span class="n">240</span>', 'x-cont')}
      <div class="vidro x-arq"><span class="mono x-arq-rot">arquivo</span><span class="x-arq-nome">exame_tc.dcm</span></div>
      <div class="x-palco"><div class="x-giro">${fatias}<i class="x-scan" style="transform:translate(-50%,-50%) translateY(-46cqw) rotateX(90deg)"></i></div></div>
      <div class="x-nota mono">só pra ver · quem interpreta é o médico</div>
    </div>`;
  },
  poses: {
    inicio: (el, api) => {
      el.fatias.forEach((f, i) => api.set(f, { o: i < 5 ? 1 : 0 }));
      el.$('.n').textContent = '46';
      api.set(el.$('.x-nota'), { o: 0 });
    },
    meio: (el, api) => {
      el.fatias.forEach((f, i) => api.set(f, { o: i < 14 ? 1 : 0 }));
      el.$('.n').textContent = '129';
      api.set(el.$('.x-nota'), { o: 0 });
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 2);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
    el.fatias = api.$$('.x-fatia');
    el.giro = el.$('.x-giro');
    el.scan = el.$('.x-scan');
    el.n = el.$('.n');
    el.val = el.$('.x-cont .cont-val');
  },
  quadro(t, el, api) {
    const { prog, ease, suave, lerp, sino } = api;
    Moldura.quadro(t, el, api);
    Pecas.conteudo(t, el, api);
    Pecas.surgir(api, el.$('.x-cont'), t, 0.45, { dy: 2 });
    Pecas.surgir(api, el.$('.x-arq'), t, 0.55, { dy: 2 });
    // fatias caem uma a uma (45 ms → 80 ms entre elas) e assentam com um pouso macio
    const T0 = 0.75;
    let pousadas = 0;
    el.fatias.forEach((f, i) => {
      const ti = T0 + i * 0.07;
      const k = ease.forte(prog(t, ti, ti + 0.42));
      if (t >= ti + 0.3) pousadas++;
      f.style.transform = `translate(-50%,-50%) translateY(calc(var(--y) - ${(14 * (1 - k)).toFixed(3)}cqw)) rotateX(90deg)`;
      f.style.opacity = (suave(prog(t, ti, ti + 0.12))).toFixed(3);
    });
    el.n.textContent = String(Math.round((240 * pousadas) / el.fatias.length));
    api.set(el.val, { s: 1 + 0.03 * suave(prog(t, T0, T0 + 0.2)) * (1 - suave(prog(t, 2.6, 2.9))), origem: '0% 80%' });
    // lâmina de luz sobe pelo volume
    const ks = prog(t, 1.4, 3.2);
    el.scan.style.transform = `translate(-50%,-50%) translateY(${lerp(0, -48, ease.inOutSine(ks)).toFixed(3)}cqw) rotateX(90deg)`;
    el.scan.style.opacity = (sino(ks, 0.5, 0.28) * (ks > 0 && ks < 1 ? 1 : 0)).toFixed(3);
    // o volume gira sem parar (passa pelo ângulo aprovado no ref)
    const ry = -28 + 16 * (t - api.ref) + 10 * (1 - ease.forte(prog(t, 0.6, 2.8)));
    el.giro.style.transform = `rotateX(-12deg) rotateY(${ry.toFixed(3)}deg)`;
    Pecas.surgir(api, el.$('.x-nota'), t, 3.0, { dy: 1 });
  },
});
}
