/* sobrou — Cena 4 "Quem sobrou" (36 s). Narração começa em 0,5 s.
   Planos: você sai de debaixo da mesa → a rua no fim de tarde: a nave indo embora, o carro sem motorista no poste,
   a bicicleta girando → o celular na mão → chamando: uma vez, cinco, seis → prendendo a respiração
   → a TV ainda funciona → os canais: o mundo inteiro igual → horas depois, o plantão → a manchete → e você ficou. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const proj = RUA.proj;
const SENTADO = { q: [84, 88], j: [86, 90], chao: 0, alt: 0, o: [10, 30], c: [40, 50] };

/* ── conteúdo da TV (0..1600 × 0..880) ── */
const terco = (a, b) => `<rect x="0" y="690" width="1600" height="130" fill="#0d1b33" opacity=".92"/><rect x="0" y="690" width="16" height="130" fill="#e5484d"/>
  ${txt(50, 745, a, { f: 'Anton', t: 52, c: '#fff' })}${txt(50, 795, b, { t: 30, c: '#cfd8e6' })}`;
const osd = (n) => `${txt(1540, 90, n, { f: 'Anton', t: 80, c: '#7dff9a', a: 'end' })}${txt(60, 80, '● AO VIVO', { t: 34, p: 600, c: '#ff5a5a' })}`;
const CANAIS = [
  // ruas vazias: avenida com torre treliçada
  `<rect width="1600" height="880" fill="#b9c3cc"/><rect y="520" width="1600" height="360" fill="#8b8e93"/>
   <polygon points="800,90 860,520 740,520" fill="#5a6068"/><polygon points="800,90 830,300 770,300" fill="#6b7179"/><rect x="760" y="300" width="80" height="14" fill="#4a4f56"/><rect x="740" y="420" width="120" height="16" fill="#4a4f56"/>
   ${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 120}" y="${300 + i * 20}" width="110" height="${240 - i * 20}" fill="#c9b99a"/><rect x="${1490 - i * 120}" y="${300 + i * 20}" width="110" height="${240 - i * 20}" fill="#c9b99a"/>`).join('')}
   <polygon points="560,880 1040,880 830,520 770,520" fill="#6f7277"/>${terco('PARIS', 'Ruas vazias no centro da cidade')}${osd('04')}`,
  // carros abandonados
  `<rect width="1600" height="880" fill="#c7cdd6"/><rect y="460" width="1600" height="420" fill="#6b6f77"/>
   ${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 140 - 20}" y="${260 + (i % 3) * 30}" width="70" height="${200 - (i % 3) * 30}" fill="#9aa6b6"/>`).join('')}
   ${[[300, 700, 1.1, '#c0392b'], [820, 640, 0.8, '#ecf0f1'], [1240, 720, 1.2, '#2c3e50'], [560, 560, 0.55, '#f1c40f'], [1060, 540, 0.45, '#7f8c8d']].map(([x, y, s, c]) => `<g transform="translate(${x},${y}) scale(${s})">${RUA.carro({ cor: c })}</g>`).join('')}
   ${terco('TÓQUIO', 'Carros abandonados nas avenidas')}${osd('09')}`,
  // gente procurando alguém
  `<rect width="1600" height="880" fill="#9aa8b8"/><rect y="560" width="1600" height="320" fill="#7d7a76"/>
   ${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 210 - 30}" y="${120 + (i % 2) * 60}" width="180" height="440" fill="#b4a690"/>`).join('')}
   ${[0, 1, 2, 3].map((i) => `<g class="tvp tvp${i}"></g>`).join('')}
   ${terco('NOVA YORK', 'Famílias procuram desaparecidos')}${osd('12')}`,
  // orla vazia
  `<rect width="1600" height="880" fill="#9fc5e8"/><polygon points="980,500 1120,250 1220,240 1300,500" fill="#4f7f3c"/><polygon points="1300,500 1380,330 1460,500" fill="#4f7f3c"/>
   <rect y="480" width="1600" height="140" fill="#3d7fb5"/><rect y="600" width="1600" height="280" fill="#e8d6a8"/>
   <path d="M0,640 Q100,610 200,640 T400,640 T600,640 T800,640 T1000,640 T1200,640 T1400,640 T1600,640" stroke="#111" stroke-width="10" fill="none"/>
   ${terco('RIO DE JANEIRO', 'Praias e calçadões desertos')}${osd('21')}`,
];
const PLANTAO = `<rect width="1600" height="880" fill="#14284d"/><rect x="0" y="0" width="1600" height="880" fill="url(#plt)"/>
  <defs><radialGradient id="plt" cx="70%" cy="30%" r="80%"><stop offset="0" stop-color="#2d5aa8" stop-opacity=".7"/><stop offset="1" stop-color="#14284d" stop-opacity="0"/></radialGradient></defs>
  ${Array.from({ length: 9 }, (_, i) => `<rect x="${980 + (i % 3) * 170}" y="${120 + Math.floor(i / 3) * 120}" width="150" height="100" fill="#1f3c70" stroke="#3a64ad" stroke-width="3"/>`).join('')}
  <rect x="260" y="470" width="640" height="210" fill="#0d1b33"/><g class="ancora"></g>
  <rect x="0" y="560" width="1600" height="70" fill="#e5484d"/>${txt(40, 612, 'PLANTÃO', { f: 'Anton', t: 54, c: '#fff', ls: 4 })}
  <rect x="0" y="630" width="1600" height="190" fill="#ffffff"/>
  <text class="manchete" x="40" y="725" font-family="Anton" font-size="66" fill="#0d1b33"></text>
  <text class="manchete2" x="40" y="795" font-family="Anton" font-size="66" fill="#0d1b33"></text>
  <rect x="0" y="820" width="1600" height="60" fill="#0d1b33"/>
  <text class="ticker" x="1600" y="862" font-family="Inter" font-weight="600" font-size="30" fill="#fff">RUAS VAZIAS EM TODOS OS CONTINENTES  •  AUTORIDADES PEDEM QUE A POPULAÇÃO FIQUE EM CASA  •  NAVES SE AFASTAM DA ATMOSFERA  •  </text>`;
const MANCHETE = ['ALIENÍGENAS LEVARAM METADE', 'DA POPULAÇÃO DA TERRA'];

function tvConteudo(pre, qual) {
  const canais = CANAIS.map((c, i) => `<g class="tv-c tv-c${i}" opacity="0">${c}</g>`).join('');
  return `<clipPath id="${pre}-tvclip"><rect width="1600" height="880"/></clipPath><g clip-path="url(#${pre}-tvclip)">
    <rect width="1600" height="880" fill="#05070a"/>${canais}<g class="tv-plantao" opacity="0">${PLANTAO}</g>
    <g class="tv-chiado" opacity="0">${Array.from({ length: 40 }, (_, i) => `<rect class="ch${i}" x="0" y="${i * 22}" width="1600" height="22" fill="#fff"/>`).join('')}</g>
    <rect class="tv-liga" width="1600" height="880" fill="#000" opacity="1"/></g>`;
}
/** Estado da TV: canal (−1 desligada), chiado 0..1, plantão 0..1. */
function tvEstado(P, t, { canal = -1, chiado = 0, plantao = 0, liga = 1, ini = 0 }) {
  P.qa('.tv-c').forEach((c, i) => op(c, i === canal ? 1 : 0));
  op(P.q('.tv-plantao'), plantao);
  op(P.q('.tv-liga'), 1 - liga);
  const ch = P.q('.tv-chiado'); op(ch, chiado);
  if (chiado > 0) P.qa('.tv-chiado rect').forEach((r, i) => { const v = Math.floor(rand(i * 7 + Math.floor(t * 30) * 13) * 200 + 30); at(r, 'fill', `rgb(${v},${v},${v})`); });
  // gente procurando (canal 2): pessoas com cartazes que balançam
  const tk = P.q('.ticker'); if (tk) at(tk, 'x', 1600 - ((t - ini) * 160) % 2400);
  const m = P.q('.manchete'), m2 = P.q('.manchete2');
  if (m) { const n = Math.floor(clamp(prog(t, 29.9, 32.2)) * (MANCHETE[0].length + MANCHETE[1].length));
    m.textContent = MANCHETE[0].slice(0, Math.min(n, MANCHETE[0].length)); m2.textContent = MANCHETE[1].slice(0, Math.max(0, n - MANCHETE[0].length)); }
}
const molduraTV = (pre, qual) => `<rect x="-400" y="-400" width="2720" height="1880" fill="#1b1d22"/>
  <rect x="100" y="60" width="1720" height="1000" rx="24" fill="#0c0d10" stroke="#2b2e34" stroke-width="10"/>
  <g transform="translate(160,100)">${tvConteudo(pre, qual)}</g>
  <rect x="160" y="100" width="1600" height="880" fill="url(#${pre}-glow)" opacity=".06"/>`;

K.cena('sobrou', { planos: [
  /* S1 — você sai de debaixo da mesa */
  { ate: 2.0,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', { item: Pr.celular() }) }),
    quadro(tl, el, P, t) {
      const k = E.io(prog(t, 0.2, 1.7));
      const a = pose({ x: 1330, y: 990, s: 1.85, d: -1 }, B.POSES.encolhido, { lean: 52, cab: 24, ol: [4, 0] });
      const b = pose({ x: 1000, y: 990, s: S, d: -1, cab: -10, ol: [3, -4] }, { o: [-6, 20], c: [10, 40] });
      B.posar(P.q('#voce'), K.mistura(a, b, k));
      op(P.q('.int-tarde'), 0.35); op(P.q('.int-noite'), 0.15); op(P.q('.vista-nave'), 0);
      camera(P, lerp(1300, 1080, k), lerp(820, 680, k), lerp(1.9, 1.5, k));
    } },
  /* S2 — a rua: a nave vai embora; o carro sem motorista; a bicicleta girando */
  { ate: 3.9,
    svg: (pre) => `${RUA.svg(pre, { luz: 'tarde' })}<g class="naveT">${NAVE.svg(pre)}</g>
      <g class="posteX"><rect x="-10" y="-760" width="20" height="760" fill="#2a2324"/><rect x="-70" y="-720" width="140" height="10" fill="#2a2324"/></g>
      <g class="carroX">${RUA.carro({ cor: '#d9d6cf', farol: '#ffd27a' })}</g><g class="fumaca">${[0, 1, 2].map((i) => `<circle class="fm${i}" r="30" fill="#c9c1b8" opacity=".5"/>`).join('')}</g>
      <g class="bikeX">${RUA.bike()}</g>
      <g transform="translate(1260,980) rotate(8)"><rect x="-60" y="-10" width="120" height="16" fill="#e8e2d0" opacity=".8"/></g>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 2.0, 3.9);
      at(P.q('.naveT'), 'transform', `translate(${lerp(1000, 1180, k)},${lerp(30, -60, k)}) scale(${lerp(0.75, 0.42, E.out(k))})`);
      const [px, py] = proj(6.4, 0, 8.5); const sc = 820 / 8.5 / 100;
      at(P.q('.posteX'), 'transform', `translate(${px},${py}) scale(${sc * 1.1})`);
      const bate = 2.75;
      const kc = E.in(prog(t, 2.0, bate));
      const tr = tremor(t, bate, 14, 10, 6);
      at(P.q('.carroX'), 'transform', `translate(${lerp(1180, px - 210, kc) + tr[0]},${py + 30 + tr[1]}) rotate(${t > bate ? -4 : 0}) scale(${sc * 1.6})`);
      P.qa('.fumaca circle').forEach((c, i) => { const u = Math.max(0, t - bate - i * 0.15); at(c, 'cx', px - 210 + i * 30); at(c, 'cy', py - 140 * sc * 1.6 - u * 80); at(c, 'r', 20 + u * 50); op(c, t > bate ? 0.5 * (1 - u / 1.2) : 0); });
      at(P.q('.bikeX'), 'transform', `translate(700,960) rotate(-6) scale(1.1)`);
      at(P.q('.bk-r2'), 'transform', `translate(70,0) rotate(${t * 400})`);
      camera(P, 960, 560, lerp(1.0, 1.05, tl / 1.9));
    } },
  /* S3 — o celular na mão; você liga para ela */
  { ate: 7.8,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', { item: Pr.celular() }) }),
    quadro(tl, el, P, t) {
      const lev = E.io(prog(t, 6.2, 6.9));
      const p = pose({ x: 960, y: 990, s: S, d: -1, cab: lerp(16, -4, lev), ol: [lerp(2, 4, lev), lerp(4, -1, lev)], ab: tl > 1.4 && tl < 1.55 ? 0.1 : 1 },
        K.mistura(B.POSES.celular, B.POSES.orelha, lev));
      B.posar(P.q('#voce'), p);
      op(P.q('.int-tarde'), 0.35); op(P.q('.int-noite'), 0.12); op(P.q('.vista-nave'), 0);
      camera(P, 940, lerp(620, 580, tl / 3.9), lerp(1.8, 1.95, tl / 3.9));
    } },
  /* S4 — chamando: uma vez, cinco vezes, a sexta */
  { ate: 12.4,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#8a6a58"/><g filter="url(#${pre}-desf)" opacity=".6"><rect x="300" y="100" width="600" height="500" fill="#c98a5a"/></g>
      <g class="cel" transform="translate(960,560) rotate(-3) scale(.88)">${CEL.svg(UI.chamada({ nome: 'Irmã', estado: 'chamando…', sub: '1ª tentativa', hora: '18:04' }), { id: 'sb4' })}</g>`,
    quadro(tl, el, P, t) {
      const n = t < 9.0 ? 1 : t < 10.5 ? 5 : 6;
      P.q('.ui-sub').textContent = `${n}ª tentativa`;
      op(P.q('.ui-atender'), 0);
      const pisca = Math.floor(t * 2) % 3;
      P.q('.ui-estado').textContent = 'chamando' + '.'.repeat(pisca + 1);
      const pulo = (t > 9.0 && t < 9.15) || (t > 10.5 && t < 10.65) ? 1 : 0;
      camera(P, 960, 560, lerp(1.0, 1.18, tl / 4.6) + pulo * 0.04);
    } },
  /* S4b — prendendo a respiração, esperando alguém atender */
  { ate: 15.1,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre, { luz: 'tarde' }), atores: B.svg('voce', { item: Pr.celular() }) }),
    quadro(tl, el, P, t) {
      const p = pose({ x: 960, y: 990, s: S, d: -1, cab: -4, ol: [4, -1], ab: 1.3, cx: ruido(t * 8, 2) * 0.6 }, B.POSES.orelha);
      B.posar(P.q('#voce'), p);
      op(P.q('.int-tarde'), 0.35); op(P.q('.int-noite'), 0.12); op(P.q('.vista-nave'), 0);
      const c = B.cabecaMundo(p);
      camera(P, c[0] - 20, c[1] + 30, lerp(3.4, 3.9, tl / 2.7));
    } },
  /* S5 — a televisão ainda funciona */
  { ate: 17.1,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), tv: `<g transform="scale(${372 / 1600})">${tvConteudo(pre)}</g>`, atores: B.svg('voce', { item: Pr.celular() }) }),
    quadro(tl, el, P, t) {
      const liga = E.out(prog(t, 15.35, 15.6));
      tvEstado(P, t, { canal: 0, liga, chiado: liga * (1 - prog(t, 15.6, 16.0)) });
      const vira = E.io(prog(t, 15.5, 16.1));
      B.posar(P.q('#voce'), pose({ x: 2380, y: 990, s: S, d: 1, cab: lerp(-10, 0, vira), ol: [lerp(-6, 4, vira), 0] }, { o: [-6, 10], c: [10, 20] }));
      INT.ceuSala(P, 0, 1, 0);
      op(P.q('.int-tarde'), 0.35); op(P.q('.int-noite'), lerp(0.25, 0.3, liga)); op(P.q('.int-tvluz'), 0.55 * liga);
      camera(P, 2620, 640, lerp(1.25, 1.32, tl / 2));
    } },
  /* S6 — os canais: as mesmas imagens em países diferentes */
  { ate: 25.6,
    svg: (pre) => molduraTV(pre) + `<g transform="translate(160,100)"><g class="pessoasTV">${[0, 1, 2, 3].map((i) => B.svg(`tv${i}`, { roupa: ['#7d8b9f', '#c0392b', '#2c3e50', '#e0a43a'][i], roupaEsc: '#00000044',
      item: `<g transform="translate(0,-60)"><rect x="-46" y="-60" width="92" height="76" fill="#fff" stroke="#141414" stroke-width="4"/><circle cx="0" cy="-30" r="16" fill="#c9d3df"/>${txt(0, 6, 'VIU?', { f: 'Anton', t: 18, c: '#141414', a: 'middle' })}</g>` })).join('')}</g></g>`,
    quadro(tl, el, P, t) {
      const trocas = [17.1, 19.3, 21.3, 23.4];
      let canal = 0; trocas.forEach((tt, i) => { if (t >= tt) canal = i; });
      const desde = t - trocas[canal];
      tvEstado(P, t, { canal, chiado: desde < 0.18 && canal > 0 ? 1 : 0 });
      op(P.q('.pessoasTV'), canal === 2 ? 1 : 0);
      [260, 560, 980, 1300].forEach((x, i) => B.posar(P.q(`#tv${i}`), pose({ x, y: 690, s: 1.5, d: i % 2 ? -1 : 1, o: [-6, 150], c: [10, 10], iR: Math.sin(t * 2 + i) * 6 })));
      camera(P, 960, 540, lerp(1.0, 1.05, tl / 8.5), 0, desde < 0.12 ? [6, 0] : [0, 0]);
    } },
  /* S7 — horas depois: anoitece, o plantão */
  { ate: 29.8,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), tv: `<g transform="scale(${372 / 1600})">${tvConteudo(pre)}</g>`, atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      const k = prog(t, 25.6, 28.6);
      tvEstado(P, t, { canal: t < 26.6 ? 3 : -1, plantao: t >= 26.6 ? 1 : 0, chiado: t > 26.6 && t < 26.8 ? 1 : 0, ini: 26.6 });
      INT.ceuSala(P, 0, 1 - k, k);
      B.posar(P.q('#voce'), pose({ x: 2160, y: 990, s: S, d: 1, cab: 4, ol: [5, 0], ab: Math.sin(tl * 1.3) > 0.97 ? 0.1 : 1 }, SENTADO));
      op(P.q('.int-tarde'), 0.35 * (1 - k)); op(P.q('.int-noite'), lerp(0.3, 0.75, k)); op(P.q('.int-tvluz'), lerp(0.4, 0.75, k));
      camera(P, lerp(2450, 2500, tl / 4.2), 650, lerp(0.95, 1.0, tl / 4.2));
    } },
  /* S8 — a manchete */
  { ate: 33.4,
    svg: (pre) => molduraTV(pre) + `<g transform="translate(160,100)"><clipPath id="${pre}-ancclip"><rect width="1600" height="560"/></clipPath><g class="anc" clip-path="url(#${pre}-ancclip)">${B.svg('ancora', { roupa: '#2b2e34', roupaEsc: '#16181c' })}</g></g>`,
    quadro(tl, el, P, t) {
      tvEstado(P, t, { plantao: 1, ini: 26.6 });
      B.posar(P.q('#ancora'), pose({ x: 580, y: 700, s: 1.45, d: 1, cab: Math.sin(t * 1.5) * 3, o: [20, 40], c: [70, 70], ab: Math.sin(t * 1.1) > 0.97 ? 0.1 : 1 }));
      camera(P, 960, lerp(560, 600, E.sine(tl / 3.6)), lerp(1.0, 1.12, E.sine(tl / 3.6)));
    } },
  /* S9 — e você ficou */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vistaSala: INT.vistaSala(pre), tv: `<g transform="scale(${372 / 1600})">${tvConteudo(pre)}</g>`, atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      tvEstado(P, t, { plantao: 1, ini: 26.6 });
      INT.ceuSala(P, 0, 0, 1);
      B.posar(P.q('#voce'), pose({ x: 2160, y: 990, s: S, d: 1, cab: 4, ol: [5, 0] }, SENTADO));
      op(P.q('.int-noite'), 0.82); op(P.q('.int-tvluz'), 0.8 + 0.06 * Math.sin(t * 9));
      camera(P, lerp(2250, 2450, E.sine(prog(tl, 0, 2.6))), 640, lerp(1.7, 0.95, E.io(prog(tl, 0, 2.6))));
    } },
] });
}
