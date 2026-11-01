/* cozinha — Cena 1 "A última manhã normal" (18,6 s). Narração começa em 0,6 s.
   Planos: cozinha larga → celular vibrando na mesa → os grupos explodindo → o vídeo no celular
   → até a janela → o que se vê pela janela → a xícara escorrega e espatifa (corte seco no impacto). */
{
const { trilha, E, camera, op, at, ruido, prog, clamp, lerp, tremor, vibra, txt } = K;
const S = 2.0; // escala do boneco na casa
const pose = (...ps) => Object.assign({}, ...ps);
const MAO_CANECA = { o: [-6, 22], c: [10, 96], iR: 0 };


K.cena('cozinha', { planos: [
  /* S1 — cozinha larga, você espera o café */
  { ate: 4.8,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre).replace('class="vista-nave"', 'class="vista-nave" opacity="0"'), atores: B.svg('voce', { item: Pr.caneca() }) }),
    quadro(tl, el, P, t) {
      const resp = Math.sin(tl * 1.6) * 1.5;
      B.posar(P.q('#voce'), pose({ x: 560, y: 990, s: S, d: -1, lean: 2 + resp * 0.3, cab: 6 + resp, ol: [3, 2] }, MAO_CANECA,
        { ab: tl > 2.3 && tl < 2.45 ? 0.1 : 1 }));
      P.qa('[class^="int-vap"]').forEach((v, i) => { at(v, 'transform', `translate(${Math.sin(tl * 2 + i) * 4},${-((tl * 30 + i * 20) % 40)})`); op(v, 0.35 + 0.3 * Math.sin(tl * 3 + i)); });
      op(P.q('.int-celMesaTela'), tl > 4.2 ? 1 : 0.2);
      at(P.q('.int-celMesa'), 'transform', `translate(${1330 + vibra(t, 4.25, 4.8, 3)},716)`);
      relogio(P, 9, 6 + tl / 60);
      camera(P, lerp(760, 800, E.sine(tl / 4.8)), 640, lerp(0.92, 0.98, E.sine(tl / 4.8)));
    } },
  /* S2 — o celular na mesa, vista de cima: vibra, depois de novo */
  { ate: 8.0,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#7a4b2c"/>
      ${Array.from({ length: 22 }, (_, i) => `<path d="M-200,${i * 70 - 100} C400,${i * 70 - 60} 1200,${i * 70 - 140} 2200,${i * 70 - 90}" stroke="#6a3f24" stroke-width="${3 + (i % 3) * 2}" fill="none" opacity=".6"/>`).join('')}
      <circle cx="1510" cy="300" r="90" fill="none" stroke="#5a3520" stroke-width="10" opacity=".45"/>
      <g class="cel" transform="translate(960,560) rotate(-8) scale(.82)">${CEL.svg(UI.bloqueio({ hora: '9:08', notifs: [
        { titulo: 'Família 🏠', texto: '📹 Vídeo' }, { titulo: 'Trabalho', texto: '📹 Vídeo', cor: '#3b82f6' }, { titulo: 'Condomínio', texto: '📹 Vídeo', cor: '#f59e0b' } ] }), { id: 'cz', mao: false })}</g>
      <rect class="tela-escura" x="0" y="0" width="1920" height="1080" fill="#000" opacity="0"/>`,
    quadro(tl, el, P, t) {
      const z1 = vibra(t, 5.0, 5.7, 6), z2 = vibra(t, 6.5, 7.3, 6);
      at(P.q('.cel'), 'transform', `translate(${960 + z1 + z2},560) rotate(${-8 + (z1 + z2) * 0.25}) scale(.82)`);
      P.qa('.ui-n').forEach((n, i) => { const k = E.outBack(prog(t, [5.0, 6.5, 7.0][i], [5.0, 6.5, 7.0][i] + 0.35)); op(n, k); at(n, 'transform', `translate(0,${-110 + i * 150 + (1 - k) * 30})`); });
      const aceso = t > 5.0 ? 1 : 0;
      op(P.q('.celG-tela'), 0.15 + 0.85 * aceso);
      camera(P, 960, 560, lerp(1.0, 1.08, tl / 3.2));
    } },
  /* S3 — os grupos explodem: você pega o celular */
  { ate: 11.6,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre).replace('class="vista-nave"', 'class="vista-nave" opacity="0"'), atores: B.svg('voce', { item: Pr.celular(), itemT: Pr.caneca() }) }) +
      ['Família (12)', 'Trabalho (47)', 'Condomínio (89)', 'Amigos (23)', 'Escola (31)'].map((g, i) => `<g class="bolha b${i}"><rect x="-150" y="-36" width="300" height="72" rx="36" fill="#ffffff" stroke="#141414" stroke-width="4"/>
        <circle cx="-108" cy="0" r="22" fill="${['#25d366', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'][i]}"/>${txt(-74, 10, g, { t: 30, p: 600, c: '#141414' })}</g>`).join(''),
    quadro(tl, el, P, t) {
      B.posar(P.q('#voce'), pose({ x: 1250, y: 990, s: S, cab: 16, ol: [2, 4] }, B.POSES.celular, { o: [-4, 30], c: [8, 96], iR: -14, ab: tl > 1.8 && tl < 1.95 ? 0.1 : 1.1 }));
      const pos = [[1020, 430], [1480, 380], [1080, 300], [1440, 520], [1260, 230]];
      P.qa('.bolha').forEach((b, i) => { const t0 = 8.25 + i * 0.42; const k = E.outBack(prog(t, t0, t0 + 0.35)); const fl = Math.sin(tl * 2 + i) * 6;
        at(b, 'transform', `translate(${pos[i][0]},${pos[i][1] + fl}) scale(${0.6 + 0.4 * k})`); op(b, k); });
      op(P.q('.int-celMesa'), 0); op(P.q('.int-canecaMesa'), 0);
      relogio(P, 9, 7);
      camera(P, 1250, lerp(600, 560, tl / 3.6), lerp(1.45, 1.55, tl / 3.6));
    } },
  /* S4 — o vídeo no celular: uma coisa enorme no céu */
  { ate: 14.1,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#d8c8a8"/><rect x="-200" y="700" width="2320" height="700" fill="#cdbb98"/>
      <g filter="url(#${pre}-desf)" opacity=".7"><rect x="200" y="160" width="520" height="420" fill="#cfae82"/><rect x="1300" y="140" width="400" height="300" fill="#f4f1ea"/></g>
      <g class="cel" transform="translate(960,600) scale(.92)">${CEL.svg(UI.conversa({ nome: 'Família 🏠', sub: 'Mãe, Tio Zé, você e +6', hora: '9:08', msgs: [
        { tipo: 'video', texto: '📹 0:12' }, { tipo: 'txt', texto: 'vocês tão vendo isso??', hora: '9:07' }, { tipo: 'txt', texto: 'TÁ NO CÉU AGORA', hora: '9:08' } ] }), { id: 'cz4' })}</g>
      <g class="vidG" opacity="0">${UI.video(-200, -120, 400, 240, 'vg')}</g>`,
    quadro(tl, el, P, t) {
      P.qa('.ui-m').forEach((m, i) => { const k = E.out(prog(tl, 0.1 + i * 0.35, 0.45 + i * 0.35)); op(m, k); });
      // a partir de "Uma coisa enorme": o vídeo cresce e toma o quadro
      const k = E.io(prog(t, 11.9, 12.6));
      const vg = P.q('.vidG');
      op(vg, k);
      at(vg, 'transform', `translate(${lerp(810, 960, k)},${lerp(275, 540, k)}) scale(${lerp(0.79, 4.9, k)})`);
      const nv = P.q('.vidG .ui-vid-nave');
      const tr = tremor(t, 12.6, 0) ; const sh = [ruido(t * 9, 1) * 3, ruido(t * 9, 2) * 2];
      at(nv, 'transform', `translate(${200 + sh[0] + (t - 12) * 6},${40 + sh[1]}) scale(.3)`);
      camera(P, 960, 560, lerp(1, 1.06, tl / 2.5), 0, [ruido(tl * 2, 3) * 4, ruido(tl * 2, 4) * 3]);
    } },
  /* S5 — você vai até a janela */
  { ate: 15.7,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', { item: Pr.celular(), itemT: Pr.caneca() }) }),
    quadro(tl, el, P, t) {
      const k = prog(t, 14.15, 15.4);
      const x = lerp(1250, 900, E.sine(k));
      const ang = andar(tl * 7.5, 1);
      B.posar(P.q('#voce'), pose({ x, y: 990, s: S, d: -1, cab: -8, ol: [3, -3] }, k < 1 ? ang : {}, { o: [ang.o ? ang.o[0] * 0.5 : -6, 20], c: [14, 70], iR: -10 }));
      vistaNave(P, t);
      op(P.q('.int-celMesa'), 0); op(P.q('.int-canecaMesa'), 0);
      relogio(P, 9, 8);
      camera(P, lerp(1150, 900, E.sine(k)), 600, 1.25);
    } },
  /* S6 — pela janela: a coisa enorme cobre o céu */
  { ate: 17.2,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre) }),
    quadro(tl, el, P, t) {
      vistaNave(P, t);
      camera(P, 820, 330, lerp(2.9, 3.15, E.sine(tl / 1.5)), 0, [ruido(tl, 5) * 2, ruido(tl, 6) * 2]);
    } },
  /* S7 — a xícara escorrega da mão */
  { ate: 18.05,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#d9c9aa"/>
      <g filter="url(#${pre}-desf)"><rect x="300" y="100" width="700" height="560" fill="#9cc0e2"/><rect x="280" y="80" width="740" height="600" fill="none" stroke="#f4f1ea" stroke-width="40"/><rect x="0" y="760" width="1920" height="400" fill="#cfae82"/></g>
      <rect class="sombraNave" x="-200" y="-200" width="2320" height="1480" fill="#203050" opacity=".35" style="mix-blend-mode:multiply"/>
      <g class="mao"><path d="M-300,420 L-30,40" stroke="#141414" stroke-width="64" stroke-linecap="round"/><path d="M-300,420 L-60,80" stroke="#2f6fd6" stroke-width="40" stroke-linecap="round"/><circle cx="0" cy="0" r="62" fill="#141414"/></g>
      <g class="caneca"><g transform="scale(7.5)">${Pr.caneca()}</g></g>`,
    quadro(tl, el, P, t) {
      const solta = prog(t, 17.55, 18.05);
      const mx = 1060, my = 520;
      at(P.q('.mao'), 'transform', `translate(${mx + E.out(solta) * 20},${my + Math.sin(tl * 3) * 3 - E.out(solta) * 12}) rotate(${-E.out(solta) * 8})`);
      const cy = my - 20 + 1600 * solta * solta;
      at(P.q('.caneca'), 'transform', `translate(${mx + 120 + solta * 60},${cy}) rotate(${10 + solta * solta * 120})`);
      camera(P, 960, 540, lerp(1.0, 1.04, tl / 0.85), 0, [ruido(tl * 6, 7) * 3, 0]);
    } },
  /* S8 — no chão: a xícara espatifa (corte seco no impacto) */
  { ate: 99,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#d8c8a8"/>
      <polygon points="-200,640 2120,640 2120,1280 -200,1280" fill="#e6e0d2"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="${i * 300 - 200}" y1="640" x2="${(i * 300 - 1160) * 2.4 + 960}" y2="1280" stroke="#cfc6b3" stroke-width="3"/>`).join('')}
      <line x1="-200" y1="760" x2="2120" y2="760" stroke="#cfc6b3" stroke-width="3"/><line x1="-200" y1="960" x2="2120" y2="960" stroke="#cfc6b3" stroke-width="3"/>
      <rect x="-200" y="-200" width="2320" height="850" fill="#cfae82"/><rect x="-200" y="610" width="2320" height="34" fill="#f1ebdf"/>
      <ellipse class="mancha" cx="960" cy="860" rx="0" ry="0" fill="#5a3418" opacity=".85"/>
      <g class="canecaInteira"><g transform="scale(7.5)">${Pr.caneca()}</g></g>
      ${Array.from({ length: 9 }, (_, i) => `<path class="caco c${i}" d="M0,0 l${30 + (i % 3) * 18},-${10 + (i % 4) * 8} l-${8 + (i % 2) * 10},${36 + (i % 3) * 6} Z" fill="#f1efe9" stroke="#141414" stroke-width="5" stroke-linejoin="round"/>`).join('')}
      ${Array.from({ length: 10 }, (_, i) => `<circle class="gota g${i}" r="${8 + (i % 3) * 5}" fill="#6b3a1c"/>`).join('')}`,
    quadro(tl, el, P, t) {
      const ti = 18.28; // impacto
      const cai = prog(t, 18.05, ti);
      const pos = t < ti;
      const ci = P.q('.canecaInteira');
      op(ci, pos ? 1 : 0);
      at(ci, 'transform', `translate(960,${-200 + 1060 * cai * cai}) rotate(${130 + cai * 40})`);
      const u = Math.max(0, t - ti);
      P.qa('.caco').forEach((c, i) => { const a = -Math.PI * (0.12 + 0.76 * (i / 8)); const v = 900 + (i % 3) * 300;
        const x = 960 + Math.cos(a) * v * u; const y = 860 + Math.sin(a) * v * u + 2600 * u * u;
        at(c, 'transform', `translate(${x},${Math.min(y, 900 + (i % 4) * 30)}) rotate(${u * (400 + i * 90)})`); op(c, pos ? 0 : 1); });
      P.qa('.gota').forEach((g, i) => { const a = -Math.PI * (0.18 + 0.64 * (i / 9)); const v = 700 + (i % 4) * 260;
        at(g, 'cx', 960 + Math.cos(a) * v * u); at(g, 'cy', Math.min(860 + Math.sin(a) * v * u + 3000 * u * u, 905)); op(g, pos ? 0 : 1); });
      const m = P.q('.mancha'); at(m, 'rx', pos ? 0 : lerp(60, 260, E.out(prog(u, 0, 0.3)))); at(m, 'ry', pos ? 0 : lerp(14, 50, E.out(prog(u, 0, 0.3))));
      const tr = tremor(t, ti, 26, 16, 9);
      camera(P, 960, 700, 1.0, 0, tr);
    } },
] });

function andar(f, a) { return B.andar(f, a); }
function relogio(P, h, m) {
  at(P.q('.int-rel-h'), 'transform', `rotate(${(h % 12) * 30 + m * 0.5})`);
  at(P.q('.int-rel-m'), 'transform', `rotate(${m * 6})`);
}
/** A nave na janela: desce e cobre o céu entre 13,8 s e 17 s; a sombra cobre as casas. */
function vistaNave(P, t) {
  const k = E.io(prog(t, 13.8, 17.2));
  const vn = P.q('.vista-nave');
  op(vn, 1);
  at(vn, 'transform', `translate(${lerp(700, 830, k)},${lerp(40, 205, k)}) scale(${lerp(0.22, 0.42, k)})`);
  op(P.q('.vista-sombra'), lerp(0, 0.75, prog(t, 15.2, 17.2)));
}
}
