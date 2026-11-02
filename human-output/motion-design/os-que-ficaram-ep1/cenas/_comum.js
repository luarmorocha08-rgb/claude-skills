/* Os Que Ficaram — biblioteca comum das cenas.
   K: tempo e interpolação · B: o boneco (rig de stickman) · P: objetos · INT: a casa (cozinha + sala)
   RUA: a rua em perspectiva · NAVE / RAST: a nave-mãe e o rastreador · CEL / TV: telas · K.cena: cena feita de planos.
   Tudo é função pura do tempo: cada quadro escreve todos os atributos que anima. */
(function () {
  const D2R = Math.PI / 180;
  const COR = {
    tinta: '#141414', pele: '#ffffff', azul: '#2f6fd6', azulEsc: '#1d4fa8', verde: '#4e8a3a', verdeEsc: '#36652a',
    salmao: '#ef8a74', cabelo: '#6b4126', mochila: '#2a2c32', alien: '#5fb4ff', alienForte: '#a8dcff',
  };

  /* ───────────── K: tempo ───────────── */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const prog = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));
  const E = {
    lin: (k) => k,
    io: (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2),
    out: (k) => 1 - Math.pow(1 - k, 3),
    in: (k) => k * k * k,
    outQ: (k) => 1 - Math.pow(1 - k, 4),
    outBack: (k) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); },
    sine: (k) => -(Math.cos(Math.PI * k) - 1) / 2,
    passo: (k) => (k < 1 ? 0 : 1),
  };
  function mistura(a, b, k) {
    if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, k);
    if (Array.isArray(a)) return a.map((v, i) => mistura(v, b[i] === undefined ? v : b[i], k));
    if (a && typeof a === 'object') {
      const o = {};
      for (const key of new Set([...Object.keys(a), ...Object.keys(b || {})])) {
        const va = a[key], vb = b ? b[key] : undefined;
        if (va === undefined) o[key] = vb; else if (vb === undefined) o[key] = va;
        else if (typeof va === 'number' || typeof va === 'object') o[key] = mistura(va, vb, k);
        else o[key] = k < 0.5 ? va : vb;
      }
      return o;
    }
    return k < 0.5 ? a : b;
  }
  /** Chaves [[t, valor, curva?], …]: interpola até a próxima chave com a curva da chave de destino. */
  function trilha(t, chaves, curvaPadrao = E.io) {
    if (!chaves.length) return undefined;
    if (t <= chaves[0][0]) return chaves[0][1];
    for (let i = 1; i < chaves.length; i++) {
      const [t1, v1, c] = chaves[i];
      if (t <= t1) {
        const [t0, v0] = chaves[i - 1];
        const curva = typeof c === 'function' ? c : curvaPadrao;
        return mistura(v0, v1, curva(prog(t, t0, t1)));
      }
    }
    return chaves[chaves.length - 1][1];
  }
  /** Ruído determinístico suave (−1..1). */
  function ruido(x, s = 1) {
    const h = (n) => { const v = Math.sin(n * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return (lerp(h(i), h(i + 1), u)) * 2 - 1;
  }
  const rand = (n) => { const v = Math.sin(n * 91.345 + 47.853) * 43758.5453; return v - Math.floor(v); };
  const f2 = (v) => Math.round(v * 100) / 100;
  /** Tremor que decai depois de t0. */
  function tremor(t, t0, forca = 10, freq = 18, dec = 7) {
    const u = t - t0;
    if (u < 0) return [0, 0];
    const env = forca * Math.exp(-dec * u);
    return [env * Math.sin(u * freq * 6.28), env * Math.cos(u * freq * 1.3 * 6.28)];
  }
  /** Pulso de vibração de celular entre a e b. */
  const vibra = (t, a, b, amp = 4) => (t > a && t < b ? amp * Math.sin(t * 90) : 0);

  /* ───────────── B: o boneco ───────────── */
  const L = { coxa: 55, canela: 55, tronco: 60, braco: 32, ante: 30, raio: 37 };
  const POSE0 = { x: 0, y: 0, s: 1, d: 1, lean: 0, q: [-3, 3], j: [2, 2], o: [-7, 7], c: [10, 10], cab: 0, cx: 0, cy: 0,
    ol: [0, 0], ab: 1, boca: 0, medo: 0, chao: 1, alt: 0, rot: 0, iR: 0, brilho: 0 };

  function svgBoneco(id, o = {}) {
    const roupa = o.roupa || COR.azul, roupaEsc = o.roupaEsc || COR.azulEsc, T = COR.tinta;
    const capuz = o.camiseta ? '' : `<path d="M-19,-56 C-31,-66 -27,-86 -9,-86 L4,-66 Z" fill="${roupaEsc}" stroke="${T}" stroke-width="4.5" stroke-linejoin="round"/>`;
    const corpo = o.camiseta
      ? `<path d="M-19,6 C-22,-20 -24,-44 -19,-56 C-11,-63 11,-63 19,-56 C24,-44 22,-20 19,6 Z" fill="${roupa}" stroke="${T}" stroke-width="4.5" stroke-linejoin="round"/>
         <path d="M-6,-60 Q0,-53 7,-60" fill="none" stroke="${T}" stroke-width="3"/>`
      : `<path d="M-21,8 C-25,-20 -27,-44 -20,-57 C-12,-65 12,-65 20,-57 C27,-44 25,-20 21,8 Z" fill="${roupa}" stroke="${T}" stroke-width="4.5" stroke-linejoin="round"/>
         <path d="M-13,-10 L13,-10 L15,5 L-15,5 Z" fill="${roupaEsc}" opacity=".55"/>
         <path d="M3,-61 L5,-47 M10,-60 L12,-48" stroke="#e9eef8" stroke-width="2.4" stroke-linecap="round"/>`;
    const mochila = o.mochila ? `<rect x="-41" y="-56" width="24" height="50" rx="9" fill="${COR.mochila}" stroke="${T}" stroke-width="4"/>
         <rect x="-38" y="-30" width="18" height="16" rx="4" fill="#1d1f24"/>` : '';
    const alca = o.mochila ? `<path d="M-15,-58 Q-4,-40 -9,-14" fill="none" stroke="${COR.mochila}" stroke-width="5" stroke-linecap="round"/>` : '';
    const cabeloTras = o.cabelo ? `<path d="M-30,-14 C-52,-6 -60,22 -44,44 C-40,22 -36,6 -24,0 Z" fill="${COR.cabelo}" stroke="${T}" stroke-width="4"/>` : '';
    const cabeloFrente = o.cabelo ? `<path d="M-36,-6 C-38,-36 -10,-46 14,-40 C30,-36 38,-20 37,-8 C26,-26 6,-30 -14,-24 C-24,-20 -30,-12 -36,-6 Z" fill="${COR.cabelo}" stroke="${T}" stroke-width="4"/>` : '';
    const manga = (cls) => o.camiseta
      ? `<path class="${cls}-mc" fill="none" stroke="${T}" stroke-width="17" stroke-linecap="round"/><path class="${cls}-mi" fill="none" stroke="${roupa}" stroke-width="10" stroke-linecap="round"/><path class="${cls}-an" fill="none" stroke="${T}" stroke-width="8.5" stroke-linecap="round"/>`
      : `<path class="${cls}-mc" fill="none" stroke="${T}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path class="${cls}-mi" fill="none" stroke="${roupa}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g id="${id}" class="bon">
      <ellipse class="b-sombra" cx="0" cy="0" rx="44" ry="7" fill="#000" opacity=".16"/>
      <path class="b-pt" fill="none" stroke="${T}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="b-pf" fill="none" stroke="${T}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <g class="b-tr">
        ${manga('b-bt')}<circle class="b-mt" r="8.5" fill="${T}"/>
        <g class="b-itT">${o.itemT || ''}</g>
        ${mochila}${capuz}${corpo}${alca}
        <g class="b-cab">
          ${cabeloTras}
          <circle r="${L.raio}" fill="${COR.pele}" stroke="${T}" stroke-width="5"/>
          <ellipse class="b-o1" rx="4.6" ry="6.4" fill="${T}"/><ellipse class="b-o2" rx="4.6" ry="6.4" fill="${T}"/>
          <ellipse class="b-boca" cx="17" cy="17" rx="0" ry="0" fill="${T}"/>
          ${cabeloFrente}
          <g class="b-medo" fill="none" stroke="${T}" stroke-width="3" stroke-linecap="round" opacity="0">
            <path d="M44,-30 q8,-6 6,-16"/><path d="M50,-10 q10,-2 12,-12"/><path d="M-44,-30 q-8,-6 -6,-16"/>
          </g>
        </g>
        ${manga('b-bf')}<circle class="b-mf" r="8.5" fill="${T}"/>
        <g class="b-it">${o.item || ''}</g>
      </g>
    </g>`;
  }

  function refsBoneco(g) {
    if (g.__r) return g.__r;
    const q = (s) => g.querySelector(s);
    g.__r = {
      sombra: q('.b-sombra'), pt: q('.b-pt'), pf: q('.b-pf'), tr: q('.b-tr'), cab: q('.b-cab'),
      btc: q('.b-bt-mc'), bti: q('.b-bt-mi'), bta: q('.b-bt-an'), bfc: q('.b-bf-mc'), bfi: q('.b-bf-mi'), bfa: q('.b-bf-an'),
      mt: q('.b-mt'), mf: q('.b-mf'), o1: q('.b-o1'), o2: q('.b-o2'), boca: q('.b-boca'), medo: q('.b-medo'), it: q('.b-it'), itT: q('.b-itT'),
    };
    return g.__r;
  }
  const pt = (a, len, x0, y0) => [x0 + Math.sin(a * D2R) * len, y0 + Math.cos(a * D2R) * len];

  /** Aplica a pose ao boneco. Ângulos em graus; perna e braço medidos a partir da vertical para baixo, + para a frente. */
  function posar(g, pose) {
    const p = Object.assign({}, POSE0, pose);
    const r = refsBoneco(g);
    // pernas a partir da pélvis (0,0)
    const perna = (qa, ja) => { const k = pt(qa, L.coxa, 0, 0); const a = pt(qa - ja, L.canela, k[0], k[1]); return [k, a]; };
    const [kT, aT] = perna(p.q[0], p.j[0]);
    const [kF, aF] = perna(p.q[1], p.j[1]);
    const py = p.chao ? -Math.max(aT[1], aF[1]) - 5 + p.alt : -115 + p.alt;
    const pe = (k, a) => { const ang = Math.atan2(a[1] - k[1], a[0] - k[0]); const fx = Math.cos(ang - Math.PI / 2) * 11; const fy = Math.sin(ang - Math.PI / 2) * 11;
      return `M0,${f2(py)} L${f2(k[0])},${f2(k[1] + py)} L${f2(a[0])},${f2(a[1] + py)} l${f2(fx)},${f2(fy)}`; };
    r.pt.setAttribute('d', pe(kT, aT));
    r.pf.setAttribute('d', pe(kF, aF));
    const sc = p.s;
    g.setAttribute('transform', `translate(${f2(p.x)},${f2(p.y)}) rotate(${f2(p.rot)}) scale(${f2(sc * p.d)},${f2(sc)})`);
    r.sombra.setAttribute('opacity', p.chao ? 0.16 : Math.max(0, 0.16 - p.alt * -0.0006));
    r.tr.setAttribute('transform', `translate(0,${f2(py)}) rotate(${f2(p.lean)})`);
    // braços no referencial do tronco: ombro em (0,-54)
    const braco = (oa, ca) => { const c = pt(oa, L.braco, 0, -54); const m = pt(oa + ca, L.ante, c[0], c[1]); return [c, m]; };
    const [cT, mT] = braco(-p.o[0] + 180 - 180, p.c[0]);
    const [cF, mF] = braco(p.o[1], p.c[1]);
    // o braço de trás usa o mesmo sentido (+ = para a frente)
    const [cT2, mT2] = braco(p.o[0], p.c[0]);
    const dT = `M0,-54 L${f2(cT2[0])},${f2(cT2[1])} L${f2(mT2[0])},${f2(mT2[1])}`;
    const dF = `M0,-54 L${f2(cF[0])},${f2(cF[1])} L${f2(mF[0])},${f2(mF[1])}`;
    r.btc.setAttribute('d', dT); r.bfc.setAttribute('d', dF);
    if (r.bta) { // camiseta: manga só no braço; antebraço preto
      const mbT = `M0,-54 L${f2(lerp(0, cT2[0], 0.75))},${f2(lerp(-54, cT2[1], 0.75))}`;
      const mbF = `M0,-54 L${f2(lerp(0, cF[0], 0.75))},${f2(lerp(-54, cF[1], 0.75))}`;
      r.btc.setAttribute('d', mbT); r.bfc.setAttribute('d', mbF);
      r.bti.setAttribute('d', mbT); r.bfi.setAttribute('d', mbF);
      r.bta.setAttribute('d', `M${f2(lerp(0, cT2[0], 0.6))},${f2(lerp(-54, cT2[1], 0.6))} L${f2(cT2[0])},${f2(cT2[1])} L${f2(mT2[0])},${f2(mT2[1])}`);
      r.bfa.setAttribute('d', `M${f2(lerp(0, cF[0], 0.6))},${f2(lerp(-54, cF[1], 0.6))} L${f2(cF[0])},${f2(cF[1])} L${f2(mF[0])},${f2(mF[1])}`);
    } else { r.bti.setAttribute('d', dT); r.bfi.setAttribute('d', dF); }
    r.mt.setAttribute('cx', f2(mT2[0])); r.mt.setAttribute('cy', f2(mT2[1]));
    r.mf.setAttribute('cx', f2(mF[0])); r.mf.setAttribute('cy', f2(mF[1]));
    r.it.setAttribute('transform', `translate(${f2(mF[0])},${f2(mF[1])}) rotate(${f2(p.iR)})`);
    if (r.itT) r.itT.setAttribute('transform', `translate(${f2(mT2[0])},${f2(mT2[1])})`);
    // cabeça
    r.cab.setAttribute('transform', `translate(${f2(p.cx)},${f2(-60 - 34 + p.cy)}) rotate(${f2(p.cab)})`);
    const ab = clamp(p.ab, 0.08, 1.4);
    [[r.o1, 9], [r.o2, 24]].forEach(([e, x]) => {
      e.setAttribute('cx', f2(x + p.ol[0])); e.setAttribute('cy', f2(-4 + p.ol[1]));
      e.setAttribute('ry', f2(6.4 * ab)); e.setAttribute('rx', f2(ab < 0.2 ? 5.5 : 4.6));
    });
    r.boca.setAttribute('rx', f2(3.2 * p.boca)); r.boca.setAttribute('ry', f2(4.6 * p.boca));
    r.boca.setAttribute('cx', f2(17 + p.ol[0] * 0.6));
    r.medo.setAttribute('opacity', f2(p.medo));
    return p;
  }
  /** Posição da mão da frente em coordenadas do mundo (para pôr objetos e câmera). */
  function maoFrente(pose) {
    const p = Object.assign({}, POSE0, pose);
    const perna = (qa, ja) => { const k = pt(qa, L.coxa, 0, 0); return pt(qa - ja, L.canela, k[0], k[1]); };
    const py = p.chao ? -Math.max(perna(p.q[0], p.j[0])[1], perna(p.q[1], p.j[1])[1]) - 5 + p.alt : -115 + p.alt;
    const c = pt(p.o[1], L.braco, 0, -54); const m = pt(p.o[1] + p.c[1], L.ante, c[0], c[1]);
    const a = p.lean * D2R; const lx = m[0] * Math.cos(a) - m[1] * Math.sin(a); const ly = m[0] * Math.sin(a) + m[1] * Math.cos(a);
    return [p.x + p.s * p.d * lx, p.y + p.s * (ly + py)];
  }
  function cabecaMundo(pose) {
    const p = Object.assign({}, POSE0, pose);
    const perna = (qa, ja) => { const k = pt(qa, L.coxa, 0, 0); return pt(qa - ja, L.canela, k[0], k[1]); };
    const py = p.chao ? -Math.max(perna(p.q[0], p.j[0])[1], perna(p.q[1], p.j[1])[1]) - 5 + p.alt : -115 + p.alt;
    const hx = p.cx, hy = -94 + p.cy; const a = p.lean * D2R;
    return [p.x + p.s * p.d * (hx * Math.cos(a) - hy * Math.sin(a)), p.y + p.s * (hx * Math.sin(a) + hy * Math.cos(a) + py)];
  }
  /** Ciclo de caminhada/corrida: f = fase (rad), a = amplitude (1 andar, 1.6 correr). */
  function andar(f, a = 1) {
    const s = Math.sin(f), c = Math.cos(f);
    return { q: [22 * a * s, -22 * a * s], j: [6 + 30 * a * Math.max(0, -c), 6 + 30 * a * Math.max(0, c)],
      o: [-20 * a * s, 20 * a * s], c: [18 * a, 18 * a], alt: -Math.abs(Math.sin(f)) * 4 * a, lean: 3 * a };
  }
  const POSES = {
    em_pe: {},
    agachado: { q: [70, 80], j: [120, 130], lean: 18, o: [10, 30], c: [40, 50] },
    encolhido: { q: [95, 100], j: [150, 155], lean: 34, o: [40, 60], c: [100, 110], cab: 10 },
    deitado_chao: { rot: -90, q: [8, -6], j: [10, 4], o: [150, 165], c: [10, 6], chao: 0, alt: 40 },
    celular: { o: [-6, 34], c: [10, 92], cab: 14, ol: [2, 3], iR: -20 },
    orelha: { o: [-6, 18], c: [10, 150], cab: -4, iR: -150 },
  };

  /* ───────────── P: objetos ───────────── */
  const P = {
    celular: (o = {}) => `<g class="p-cel"><rect x="-8" y="-15" width="16" height="30" rx="3" fill="#1b1d23" stroke="${COR.tinta}" stroke-width="2.5"/>
      <rect class="p-cel-tela" x="-6" y="-12" width="12" height="23" rx="1.5" fill="${o.tela || '#8ccaf7'}" opacity="${o.aceso === false ? 0.15 : 1}"/></g>`,
    caneca: (o = {}) => `<g class="p-caneca"><path d="M9,-6 q11,0 11,10 q0,10 -11,10" fill="none" stroke="${COR.tinta}" stroke-width="4"/>
      <path d="M-11,-12 L11,-12 L9,16 Q0,19 -9,16 Z" fill="${o.cor || '#f1efe9'}" stroke="${COR.tinta}" stroke-width="4" stroke-linejoin="round"/></g>`,
    lanterna: (o = {}) => `<g class="p-lant"><rect x="-6" y="-24" width="12" height="30" rx="3" fill="#2b2e34" stroke="${COR.tinta}" stroke-width="2.5"/>
      <rect x="-8" y="-30" width="16" height="8" rx="2" fill="#4a4e57" stroke="${COR.tinta}" stroke-width="2.5"/></g>`,
    mangueira: () => `<g class="p-mang"><path d="M0,0 l12,-4" stroke="#2f7a3a" stroke-width="7" stroke-linecap="round"/><rect x="10" y="-8" width="10" height="7" rx="2" fill="#d9a63a" stroke="${COR.tinta}" stroke-width="2"/></g>`,
  };

  /* ───────────── defs comuns (degradês, filtros) ───────────── */
  function defs(pre) {
    return `<defs>
      <radialGradient id="${pre}-vinheta" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <radialGradient id="${pre}-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff" stop-opacity="1"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="${pre}-glowA" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${COR.alienForte}" stop-opacity=".95"/><stop offset="45%" stop-color="${COR.alien}" stop-opacity=".45"/><stop offset="100%" stop-color="${COR.alien}" stop-opacity="0"/></radialGradient>
      <radialGradient id="${pre}-glowQ" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffe7b0" stop-opacity=".95"/><stop offset="50%" stop-color="#ffcf7a" stop-opacity=".35"/><stop offset="100%" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
      <linearGradient id="${pre}-feixe" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/><stop offset="100%" stop-color="#dff1ff" stop-opacity=".55"/></linearGradient>
      <linearGradient id="${pre}-feixeA" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${COR.alienForte}" stop-opacity=".9"/><stop offset="100%" stop-color="${COR.alien}" stop-opacity="0"/></linearGradient>
      <linearGradient id="${pre}-ceuDia" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6fa6e0"/><stop offset="100%" stop-color="#d6e8f6"/></linearGradient>
      <linearGradient id="${pre}-ceuTarde" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b4a72"/><stop offset="45%" stop-color="#b8687a"/><stop offset="100%" stop-color="#f4a25e"/></linearGradient>
      <linearGradient id="${pre}-ceuNoite" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#070b18"/><stop offset="100%" stop-color="#1b2b4e"/></linearGradient>
      <filter id="${pre}-desf" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
      <filter id="${pre}-desfP" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    </defs>`;
  }

  /* ───────────── NAVE e RASTREADOR ───────────── */
  function svgNave(pre, o = {}) {
    // centrada em (0,0); largura 2000, altura ~420
    const luzes = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI; const x = -880 * Math.cos(a); const y = 40 + 46 * Math.sin(a);
      return `<rect x="${f2(x - 18)}" y="${f2(y - 3)}" width="36" height="6" rx="3" fill="${COR.alien}" opacity=".85"/>`;
    }).join('');
    return `<g class="nave">
      <ellipse cx="0" cy="60" rx="1000" ry="150" fill="#1a1f2b"/>
      <ellipse cx="0" cy="30" rx="980" ry="140" fill="#2a3142"/>
      <ellipse cx="0" cy="-10" rx="700" ry="120" fill="#232a39"/>
      <ellipse cx="0" cy="-60" rx="420" ry="90" fill="#2e3648"/>
      <path d="M-980,30 Q0,190 980,30" fill="none" stroke="#11151e" stroke-width="10"/>
      <ellipse cx="0" cy="96" rx="620" ry="70" fill="#141821"/>
      ${luzes}
      <ellipse class="nave-anel" cx="0" cy="110" rx="150" ry="34" fill="none" stroke="${COR.alienForte}" stroke-width="10" opacity=".9"/>
      <ellipse cx="0" cy="110" rx="260" ry="70" fill="url(#${pre}-glowA)" opacity=".8"/>
      <ellipse cx="0" cy="112" rx="90" ry="20" fill="#e8f6ff"/>
    </g>`;
  }
  function svgNavinha(pre) {
    return `<g class="navinha"><path d="M-70,0 L60,-14 L90,0 L60,12 Z" fill="#1d2230" stroke="#0e1118" stroke-width="3"/>
      <path d="M-30,-6 L30,-12 L40,-3 Z" fill="#2c3346"/><circle cx="70" cy="0" r="5" fill="${COR.alien}"/>
      <circle cx="70" cy="0" r="16" fill="url(#${pre}-glowA)"/></g>`;
  }
  function svgRast(pre) {
    // corpo em (0,0); as pernas são desenhadas em quadro (paths .r-perna)
    return `<g class="rast">
      <path class="r-perna r-p0" fill="none" stroke="#0f1218" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
      <path class="r-perna r-p1" fill="none" stroke="#0f1218" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
      <path class="r-perna r-p2" fill="none" stroke="#151922" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
      <path class="r-perna r-p3" fill="none" stroke="#151922" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
      <g class="r-corpo">
        <path d="M-90,10 Q-96,-56 0,-66 Q96,-56 90,10 Q0,40 -90,10 Z" fill="#1c212d" stroke="#0b0d12" stroke-width="5"/>
        <path d="M-70,-30 Q0,-56 70,-30" fill="none" stroke="#2d3446" stroke-width="8"/>
        <rect x="-40" y="-90" width="6" height="30" fill="#0b0d12"/><rect x="34" y="-90" width="6" height="30" fill="#0b0d12"/>
        <circle cx="0" cy="-6" r="24" fill="#0b0d12"/>
        <circle class="r-olho" cx="0" cy="-6" r="13" fill="${COR.alienForte}"/>
        <circle cx="0" cy="-6" r="60" fill="url(#${pre}-glowA)"/>
      </g>
    </g>`;
  }
  /** Pernas do rastreador: 4 pernas articuladas, fase de passo f. */
  function posarRast(g, x, y, s, f = 0, alturaCorpo = 330, abertura = 1) {
    g.setAttribute('transform', `translate(${f2(x)},${f2(y)}) scale(${f2(s)})`);
    const H = alturaCorpo;
    const pernas = [[-1, 0], [1, Math.PI], [-0.55, Math.PI * 0.5], [0.55, Math.PI * 1.5]];
    g.querySelectorAll('.r-perna').forEach((p, i) => {
      const [lado, fase] = pernas[i];
      const passo = Math.sin(f + fase);
      const ergue = Math.max(0, Math.cos(f + fase)) * 26;
      const px = lado * 170 * abertura + passo * 40;
      const jx = lado * 120 * abertura + passo * 20, jy = -H * 0.55 - ergue * 0.5;
      p.setAttribute('d', `M${lado * 46},${f2(-H + 4)} L${f2(jx)},${f2(-H * 1.32 - ergue * 0.4)} L${f2(px)},${f2(-ergue)}`);
    });
    g.querySelector('.r-corpo').setAttribute('transform', `translate(0,${f2(-H + Math.sin(f * 2) * 4)})`);
  }

  /* ───────────── RUA: a rua em perspectiva ───────────── */
  const VP = { x: 960, y: 520, f: 820, h: 1.7 };
  const proj = (X, Y, Z) => [VP.x + (X * VP.f) / Z, VP.y + ((VP.h - Y) * VP.f) / Z];
  const poly = (pts) => pts.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ');
  function casaLateral(X, Z1, Z2, o) {
    const lado = Math.sign(X), h = o.h || 5.4;
    const fach = [proj(X, 0, Z1), proj(X, 0, Z2), proj(X, h, Z2), proj(X, h, Z1)];
    const tel = [proj(X, h, Z1), proj(X, h, Z2), proj(X + lado * 4, h + 2.6, Z2), proj(X + lado * 4, h + 2.6, Z1)];
    const frente = [proj(X, 0, Z1), proj(X + lado * 9, 0, Z1), proj(X + lado * 9, h, Z1), proj(X + lado * 4, h + 2.6, Z1), proj(X, h, Z1)];
    let jan = '';
    const nJ = 3;
    for (let i = 0; i < nJ; i++) {
      const za = lerp(Z1, Z2, (i + 0.25) / nJ), zb = lerp(Z1, Z2, (i + 0.7) / nJ);
      if (i === 1 && o.porta) {
        jan += `<polygon points="${poly([proj(X, 0, za), proj(X, 0, zb), proj(X, 2.3, zb), proj(X, 2.3, za)])}" fill="${o.portaCor || '#4a3a30'}"/>`;
      } else {
        jan += `<polygon class="janela-casa" points="${poly([proj(X, 1.3, za), proj(X, 1.3, zb), proj(X, 3.1, zb), proj(X, 3.1, za)])}" fill="${o.janela}" stroke="${o.moldura}" stroke-width="2"/>`;
      }
    }
    return `<g class="casa"><polygon points="${poly(frente)}" fill="${o.frente}"/>
      <polygon points="${poly(fach)}" fill="${o.parede}"/><polygon points="${poly(tel)}" fill="${o.telhado}"/>${jan}</g>`;
  }
  function svgRua(pre, o = {}) {
    const luz = o.luz || 'dia';
    const pal = {
      dia: { ceu: `url(#${pre}-ceuDia)`, asf: '#7c8088', calc: '#b9b6ad', grama: '#7ea35a', paredes: ['#e5d6bd', '#d9c7aa', '#e9e1d2', '#cdb99b'], tel: '#6b5547', jan: '#a7c6dc', mold: '#f4f1ea', arv: '#4f7f3c', poste: '#5a4a3c', cidade: '#9fb4cc' },
      tarde: { ceu: `url(#${pre}-ceuTarde)`, asf: '#4a4650', calc: '#7c6f6c', grama: '#5d6644', paredes: ['#b9967f', '#a88672', '#c3a58e', '#9c7c69'], tel: '#4a3836', jan: '#e9b27a', mold: '#d9c3b0', arv: '#3d4a33', poste: '#2a2324', cidade: '#59506b' },
      noite: { ceu: `url(#${pre}-ceuNoite)`, asf: '#1f2533', calc: '#2c3344', grama: '#1e2a26', paredes: ['#33405a', '#2d3950', '#3a4762', '#2a344a'], tel: '#1a2030', jan: '#1a2234', mold: '#46536e', arv: '#152019', poste: '#0e121a', cidade: '#1d2a44' },
    }[luz];
    let s = `<rect x="-400" y="-400" width="2720" height="1000" fill="${pal.ceu}"/>`;
    if (luz === 'noite') s += Array.from({ length: 60 }, (_, i) => `<circle cx="${f2(rand(i) * 1920)}" cy="${f2(rand(i + 99) * 420)}" r="${f2(1 + rand(i + 7) * 1.4)}" fill="#fff" opacity="${f2(0.3 + rand(i + 3) * 0.6)}"/>`).join('');
    // cidade no horizonte
    s += `<g fill="${pal.cidade}">` + Array.from({ length: 16 }, (_, i) => { const w = 18 + rand(i + 40) * 26, h = 40 + rand(i + 20) * 120; const x = 860 + i * 13 - 30 + rand(i) * 8; return `<rect x="${f2(x)}" y="${f2(VP.y - h + 10)}" width="${f2(w)}" height="${f2(h)}"/>`; }).join('') + '</g>';
    // chão
    s += `<polygon points="${poly([proj(-60, 0, 2), proj(60, 0, 2), proj(60, 0, 400), proj(-60, 0, 400)])}" fill="${pal.grama}"/>`;
    s += `<polygon points="${poly([proj(-7.5, 0, 1.5), proj(7.5, 0, 1.5), proj(7.5, 0, 400), proj(-7.5, 0, 400)])}" fill="${pal.calc}"/>`;
    s += `<polygon points="${poly([proj(-4.6, 0, 1.5), proj(4.6, 0, 1.5), proj(4.6, 0, 400), proj(-4.6, 0, 400)])}" fill="${pal.asf}"/>`;
    // faixa central tracejada
    for (let z = 4; z < 140; z *= 1.32) s += `<polygon points="${poly([proj(-0.08, 0, z), proj(0.08, 0, z), proj(0.08, 0, z * 1.14), proj(-0.08, 0, z * 1.14)])}" fill="${luz === 'noite' ? '#55607a' : '#e8e2c8'}" opacity=".8"/>`;
    // meios-fios
    s += `<polyline points="${poly([proj(-4.6, 0, 1.5), proj(-4.6, 0, 400)])}" stroke="#00000033" stroke-width="3" fill="none"/>`;
    s += `<polyline points="${poly([proj(4.6, 0, 1.5), proj(4.6, 0, 400)])}" stroke="#00000033" stroke-width="3" fill="none"/>`;
    // casas (do fundo para a frente)
    const casas = [];
    for (let i = 0; i < 12; i++) { const z = 6 + i * 11; casas.push([-11, z, z + 8, i], [11, z + 4, z + 12, i + 5]); }
    casas.sort((a, b) => b[1] - a[1]).forEach(([X, z1, z2, i]) => {
      const c = pal.paredes[i % 4];
      s += casaLateral(X, z1, z2, { parede: c, frente: c, telhado: pal.tel, janela: (o.janelasAcesas && rand(i * 3 + X) > 0.6) ? '#ffd88a' : pal.jan, moldura: pal.mold, porta: i % 2 === 0, h: 5 + (i % 3) * 0.5 });
    });
    // árvores e postes (fundo → frente)
    const objs = [];
    for (let z = 140; z > 3; z /= 1.22) objs.push(['poste', -6.3, z], ['poste', 6.3, z * 1.1]);
    for (let z = 90; z > 7; z /= 2.1) objs.push(['arv', -8.6, z * 1.05], ['arv', 8.8, z * 0.8]);
    objs.sort((a, b) => b[2] - a[2]).forEach(([tipo, X, Z]) => {
      const [bx, by] = proj(X, 0, Z); const k = VP.f / Z;
      if (tipo === 'poste') {
        s += `<rect x="${f2(bx - 0.12 * k)}" y="${f2(by - 9 * k)}" width="${f2(0.24 * k)}" height="${f2(9 * k)}" fill="${pal.poste}"/>
              <rect x="${f2(bx - 0.9 * k)}" y="${f2(by - 8.4 * k)}" width="${f2(1.8 * k)}" height="${f2(0.14 * k)}" fill="${pal.poste}"/>`;
      } else {
        s += `<rect x="${f2(bx - 0.18 * k)}" y="${f2(by - 3 * k)}" width="${f2(0.36 * k)}" height="${f2(3 * k)}" fill="#3d2f25"/>
              <ellipse cx="${f2(bx)}" cy="${f2(by - 4.6 * k)}" rx="${f2(2.2 * k)}" ry="${f2(2.3 * k)}" fill="${pal.arv}"/>
              <ellipse cx="${f2(bx - 0.9 * k)}" cy="${f2(by - 3.8 * k)}" rx="${f2(1.5 * k)}" ry="${f2(1.4 * k)}" fill="${pal.arv}"/>`;
      }
    });
    // fios dos postes
    [-6.3, 6.3].forEach((X) => { const a = proj(X - Math.sign(X) * 0.8, 8.4, 3.2), b = proj(X - Math.sign(X) * 0.8, 8.4, 140); s += `<path d="M${f2(a[0])},${f2(a[1])} Q${f2((a[0] + b[0]) / 2)},${f2((a[1] + b[1]) / 2 + 30)} ${f2(b[0])},${f2(b[1])}" stroke="${pal.poste}" stroke-width="2" fill="none"/>`; });
    return s;
  }
  /** Carro visto de frente/trás, centrado na base. */
  function svgCarro(o = {}) {
    const c = o.cor || '#eceae4';
    return `<g class="carro"><rect x="-120" y="-120" width="240" height="90" rx="26" fill="${c}" stroke="${COR.tinta}" stroke-width="5"/>
      <path d="M-86,-118 L-64,-180 L64,-180 L86,-118 Z" fill="${c}" stroke="${COR.tinta}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-72,-124 L-56,-170 L56,-170 L72,-124 Z" fill="${o.vidro || '#5b6b80'}"/>
      <rect x="-104" y="-92" width="44" height="18" rx="6" fill="${o.farol || '#f6efcf'}" stroke="${COR.tinta}" stroke-width="3"/>
      <rect x="60" y="-92" width="44" height="18" rx="6" fill="${o.farol || '#f6efcf'}" stroke="${COR.tinta}" stroke-width="3"/>
      <rect x="-40" y="-70" width="80" height="16" rx="3" fill="#2b2e34"/>
      <rect x="-118" y="-34" width="40" height="34" rx="8" fill="#1b1d22"/><rect x="78" y="-34" width="40" height="34" rx="8" fill="#1b1d22"/></g>`;
  }
  /** Bicicleta de lado, rodas com raios (a da frente gira com `giro`). */
  function svgBike() {
    const roda = (cls, cx) => `<g class="${cls}" transform="translate(${cx},0)"><circle r="46" fill="none" stroke="${COR.tinta}" stroke-width="7"/>
      ${[0, 45, 90, 135].map((a) => `<line x1="${f2(-44 * Math.cos(a * D2R))}" y1="${f2(-44 * Math.sin(a * D2R))}" x2="${f2(44 * Math.cos(a * D2R))}" y2="${f2(44 * Math.sin(a * D2R))}" stroke="${COR.tinta}" stroke-width="2"/>`).join('')}</g>`;
    return `<g class="bike">${roda('bk-r1', -70)}${roda('bk-r2', 70)}
      <path d="M-70,0 L-20,-60 L40,-60 L70,0 M-20,-60 L0,0 L40,-60 M0,0 L-70,0 M40,-60 L48,-86 M-28,-74 L-6,-74" fill="none" stroke="#c0392b" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M36,-88 L62,-90" stroke="${COR.tinta}" stroke-width="7" stroke-linecap="round"/></g>`;
  }

  /* ───────────── INT: a casa (cozinha + sala), mundo 0..3400 × 0..1080 ───────────── */
  const CHAO = 990; // linha dos pés
  function svgInterior(pre, o = {}) {
    const T = COR.tinta;
    const parede = '#e8d8bb', paredeSala = '#d8cab0', mad = '#cfae82', madEsc = '#a8865c', bancada = '#6b5a4a';
    let s = '';
    // paredes e piso
    s += `<rect x="-900" y="-400" width="2700" height="1280" fill="${parede}"/>`;
    s += `<rect x="1780" y="-400" width="2800" height="1280" fill="${paredeSala}"/>`;
    s += `<rect x="-900" y="880" width="2680" height="700" fill="#e6e0d2"/>`;
    for (let x = -900; x < 1800; x += 120) s += `<line x1="${x}" y1="880" x2="${f2(960 + (x - 960) * 2.2)}" y2="1280" stroke="#cfc6b3" stroke-width="2"/>`;
    [920, 975, 1050, 1150].forEach((y) => (s += `<line x1="-900" y1="${y}" x2="1780" y2="${y}" stroke="#cfc6b3" stroke-width="2"/>`));
    s += `<rect x="1780" y="880" width="2800" height="700" fill="#9b7656"/>`;
    for (let y = 900; y < 1280; y += 34) s += `<line x1="1780" y1="${y}" x2="4580" y2="${y}" stroke="#86644a" stroke-width="2"/>`;
    s += `<rect x="-900" y="866" width="5500" height="16" fill="#f1ebdf"/>`;
    // armários superiores
    const armario = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${mad}" stroke="${madEsc}" stroke-width="4"/><rect x="${x + w - 18}" y="${y + h - 40}" width="6" height="26" rx="3" fill="#7d6243"/>`;
    for (let i = 0; i < 4; i++) s += armario(250 + i * 92, 130, 88, 250);
    s += armario(1030, 130, 90, 250) + armario(1124, 130, 90, 250);
    // geladeira
    s += `<rect x="30" y="300" width="210" height="580" rx="14" fill="#eef0ec" stroke="#b8bcb6" stroke-width="5"/>
          <line x1="30" y1="520" x2="240" y2="520" stroke="#b8bcb6" stroke-width="5"/>
          <rect x="210" y="360" width="9" height="110" rx="4" fill="#b8bcb6"/><rect x="210" y="550" width="9" height="140" rx="4" fill="#b8bcb6"/>
          <rect x="70" y="350" width="26" height="26" rx="4" fill="#e85d4a"/><rect x="110" y="380" width="22" height="30" rx="4" fill="#f2c14e"/><circle cx="90" cy="430" r="12" fill="#5aa0e0"/>
          <rect x="90" y="580" width="60" height="44" fill="#fff" stroke="#c9cdc6" stroke-width="2"/>`;
    // bancada e armários de baixo
    s += `<rect x="240" y="580" width="980" height="300" fill="${mad}" stroke="${madEsc}" stroke-width="4"/>`;
    for (let i = 0; i < 7; i++) { if (i === 2) continue; s += `<rect x="${252 + i * 138}" y="620" width="126" height="236" rx="4" fill="#d8ba90" stroke="${madEsc}" stroke-width="3"/><rect x="${352 + i * 138}" y="660" width="6" height="30" rx="3" fill="#7d6243"/>`; }
    s += `<rect x="530" y="600" width="130" height="270" rx="6" fill="#e9ebe7" stroke="#b8bcb6" stroke-width="4"/><rect x="545" y="616" width="100" height="10" rx="4" fill="#b8bcb6"/>`;
    s += `<rect x="230" y="556" width="1000" height="30" rx="4" fill="${bancada}"/>`;
    // cafeteira
    s += `<g class="int-cafeteira"><rect x="320" y="440" width="96" height="118" rx="8" fill="#26282d" stroke="${T}" stroke-width="4"/>
          <rect x="332" y="492" width="72" height="56" rx="10" fill="#9c5a33" opacity=".9" stroke="#c9d6dd" stroke-width="4"/>
          <rect x="326" y="446" width="84" height="24" rx="4" fill="#3a3d44"/><circle cx="400" cy="458" r="5" fill="#e85d4a" class="int-cafe-led"/></g>`;
    s += `<g class="int-vapor" opacity="0.7">${[0, 1, 2].map((i) => `<path class="int-vap${i}" d="M${350 + i * 18},436 q-10,-20 0,-40 q10,-20 0,-40" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`).join('')}</g>`;
    // janela da cozinha com a vista
    s += `<clipPath id="${pre}-cjan"><rect x="660" y="190" width="320" height="270"/></clipPath>`;
    s += `<g clip-path="url(#${pre}-cjan)"><g class="int-vista">${o.vista || ''}</g></g>`;
    s += `<rect class="int-janluz" x="660" y="190" width="320" height="270" fill="#ffffff" opacity="0"/>`;
    s += `<rect x="644" y="174" width="352" height="302" rx="6" fill="none" stroke="#f4f1ea" stroke-width="22"/>
          <line x1="820" y1="190" x2="820" y2="460" stroke="#f4f1ea" stroke-width="12"/><line x1="660" y1="325" x2="980" y2="325" stroke="#f4f1ea" stroke-width="10"/>
          <rect x="630" y="476" width="380" height="18" rx="4" fill="#f4f1ea"/>`;
    // pia e torneira
    s += `<rect x="730" y="550" width="180" height="12" rx="5" fill="#9aa1a6"/>
          <g class="int-torneira"><path d="M820,556 L820,500 Q820,480 845,480 L860,480 L860,500" fill="none" stroke="#a9b0b5" stroke-width="12" stroke-linecap="round"/>
          <rect class="int-torn-alav" x="800" y="530" width="10" height="26" rx="4" fill="#a9b0b5"/></g>
          <path class="int-agua" d="M860,504 L860,556" stroke="#bfe3ff" stroke-width="7" stroke-linecap="round" opacity="0"/>`;
    // vaso e fruteira
    s += `<path d="M1110,556 L1100,500 L1160,500 L1150,556 Z" fill="#c76b4a"/><path d="M1130,500 q-30,-50 -10,-90 M1130,500 q20,-60 50,-80 M1130,500 q-50,-20 -70,-50 M1130,500 q40,-20 60,-10" stroke="#4f8a3a" stroke-width="10" fill="none" stroke-linecap="round"/>`;
    // relógio
    s += `<g class="int-relogio" transform="translate(1340,250)"><circle r="52" fill="#fbf8f1" stroke="#3a3330" stroke-width="7"/>
          ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-44" x2="0" y2="-36" stroke="#3a3330" stroke-width="3" transform="rotate(${i * 30})"/>`).join('')}
          <line class="int-rel-h" x1="0" y1="4" x2="0" y2="-26" stroke="#3a3330" stroke-width="6" stroke-linecap="round"/>
          <line class="int-rel-m" x1="0" y1="6" x2="0" y2="-38" stroke="#3a3330" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="#3a3330"/></g>`;
    // quadro na parede
    s += `<rect x="1530" y="200" width="150" height="110" fill="#f3efe6" stroke="#5a4636" stroke-width="8"/><path d="M1546,296 L1590,240 L1620,272 L1640,250 L1666,296 Z" fill="#8fb3c9"/>`;
    // porta da cozinha para a sala (batente)
    s += `<rect x="1750" y="230" width="60" height="660" fill="#c9b897"/><rect x="1756" y="230" width="48" height="650" fill="#bda886"/>`;
    // SALA: janela da frente com cortinas
    s += `<clipPath id="${pre}-sjan"><rect x="1990" y="230" width="380" height="320"/></clipPath>`;
    s += `<g clip-path="url(#${pre}-sjan)"><g class="int-vistaSala">${o.vistaSala || ''}</g></g>`;
    s += `<rect x="1974" y="214" width="412" height="352" rx="4" fill="none" stroke="#efe8da" stroke-width="20"/><line x1="2180" y1="230" x2="2180" y2="550" stroke="#efe8da" stroke-width="10"/>`;
    s += `<rect x="1940" y="190" width="480" height="16" rx="6" fill="#5a4636"/>`;
    s += `<path class="int-cortE" d="M1950,200 L2170,200 L2170,620 Q2060,640 1950,620 Z" fill="#7b8ea8" stroke="#5f6f87" stroke-width="4"/>`;
    s += `<path class="int-cortD" d="M2410,200 L2190,200 L2190,620 Q2300,640 2410,620 Z" fill="#7b8ea8" stroke="#5f6f87" stroke-width="4"/>`;
    // sofá
    s += `<rect x="1900" y="700" width="560" height="190" rx="40" fill="#6f7c8f" stroke="#4d5866" stroke-width="5"/>
          <rect x="1930" y="640" width="500" height="110" rx="34" fill="#7d8b9f" stroke="#4d5866" stroke-width="5"/>
          <rect x="1880" y="690" width="70" height="200" rx="28" fill="#66727f" stroke="#4d5866" stroke-width="5"/><rect x="2410" y="690" width="70" height="200" rx="28" fill="#66727f" stroke="#4d5866" stroke-width="5"/>`;
    // luminária
    s += `<line x1="2540" y1="880" x2="2540" y2="470" stroke="#3a3330" stroke-width="8"/><path d="M2490,470 L2590,470 L2570,400 L2510,400 Z" fill="#efe1c2" stroke="#3a3330" stroke-width="5"/>`;
    s += `<ellipse class="int-lumluz" cx="2540" cy="500" rx="220" ry="220" fill="url(#${pre}-glowQ)" opacity="0"/>`;
    // TV
    s += `<rect x="2600" y="810" width="440" height="70" rx="6" fill="#5a4636"/><rect x="2614" y="890" width="12" height="0" fill="#5a4636"/>
          <rect x="2620" y="540" width="400" height="250" rx="10" fill="#111317" stroke="#2b2e34" stroke-width="8"/>
          <rect x="2805" y="790" width="30" height="22" fill="#2b2e34"/>`;
    s += `<g class="int-tvtela" transform="translate(2634,554)">${o.tv || ''}</g>`;
    s += `<ellipse class="int-tvluz" cx="2820" cy="680" rx="520" ry="380" fill="url(#${pre}-glowA)" opacity="0" style="mix-blend-mode:screen"/>`;
    // cabide e casaco
    s += `<rect x="3000" y="360" width="60" height="10" rx="4" fill="#3a3330"/><path d="M3016,370 L2998,560 L3060,560 L3046,370 Z" fill="#40485a"/>`;
    // porta da frente
    s += `<rect x="3084" y="300" width="262" height="690" fill="#c9b897"/>`;
    s += `<g class="int-porta"><rect x="3100" y="316" width="230" height="674" fill="#3e4757" stroke="#2a313d" stroke-width="5"/>
          <rect x="3124" y="350" width="182" height="250" rx="6" fill="none" stroke="#2f3644" stroke-width="5"/><rect x="3124" y="640" width="182" height="300" rx="6" fill="none" stroke="#2f3644" stroke-width="5"/>
          <circle cx="3215" cy="400" r="6" fill="#1b1f27"/>
          <rect x="3110" y="560" width="22" height="40" rx="4" fill="#b8a46b"/>
          <g class="int-macaneta" transform="translate(3124,650)"><circle r="14" fill="#c9b47a" stroke="#6d5d34" stroke-width="3"/><rect x="0" y="-5" width="30" height="10" rx="5" fill="#c9b47a" stroke="#6d5d34" stroke-width="3"/></g></g>`;
    s += `<rect x="3080" y="984" width="270" height="20" rx="3" fill="#3b3a36"/>`;
    // corrimão da escada à direita
    s += `<rect x="3370" y="560" width="14" height="330" fill="#5a4636"/><rect x="3360" y="550" width="300" height="16" fill="#5a4636" transform="rotate(-28 3370 556)"/>`;
    // mesa da cozinha e cadeiras (na frente)
    s += `<g class="int-mesa">
          <rect x="1010" y="640" width="26" height="250" rx="6" fill="#6b4026"/><path d="M1000,640 L1090,640 L1090,700 L1000,700 Z" fill="#7a4b2c" stroke="#4e2f1b" stroke-width="4"/>
          <rect x="1060" y="720" width="560" height="22" rx="4" fill="#7a4b2c" stroke="#4e2f1b" stroke-width="4"/>
          <rect x="1090" y="742" width="20" height="246" fill="#5e3a22"/><rect x="1570" y="742" width="20" height="246" fill="#5e3a22"/>
          <rect x="1150" y="742" width="14" height="170" fill="#4e2f1b"/><rect x="1514" y="742" width="14" height="170" fill="#4e2f1b"/>
          <rect x="1600" y="640" width="26" height="340" rx="6" fill="#6b4026"/><rect x="1580" y="820" width="90" height="16" fill="#7a4b2c" stroke="#4e2f1b" stroke-width="3"/>
          <rect x="1590" y="836" width="12" height="150" fill="#5e3a22"/><rect x="1650" y="836" width="12" height="150" fill="#5e3a22"/>
          
        </g>`;
    s += `<g class="int-fruteira" transform="translate(1440,720)"><path d="M-60,-6 Q0,26 60,-6 Z" fill="#b5855a" stroke="#4e2f1b" stroke-width="3"/><circle cx="-22" cy="-16" r="15" fill="#f2a33a"/><circle cx="6" cy="-20" r="16" fill="#e2483a"/><circle cx="30" cy="-12" r="13" fill="#f6c84a"/></g>`;
    // itens da mesa (cena 1 e cena 5)
    s += `<g class="int-canecaMesa" transform="translate(1170,720)"><g transform="translate(0,-17) scale(1.4)">${P.caneca()}</g></g>`;
    s += `<g class="int-celMesa" transform="translate(1330,716)"><rect x="-34" y="-7" width="68" height="10" rx="4" fill="#1b1d23"/><rect class="int-celMesaTela" x="-30" y="-8" width="60" height="4" rx="2" fill="#8ccaf7" opacity=".2"/></g>`;
    s += `<g class="int-suprimentos" opacity="0">
          ${[0, 1, 2].map((i) => `<g class="int-garrafa int-g${i}" transform="translate(${1140 + i * 46},720)"><rect x="-14" y="-92" width="28" height="92" rx="9" fill="#cfe7f7" stroke="#6f93ad" stroke-width="3" opacity=".9"/><rect x="-7" y="-106" width="14" height="16" rx="3" fill="#3f78c8"/><rect x="-14" y="-60" width="28" height="22" fill="#4a90d9" opacity=".7"/></g>`).join('')}
          <g class="int-latas" transform="translate(1310,720)"><rect x="-44" y="-50" width="38" height="50" rx="5" fill="#c94a3a" stroke="#6b2a22" stroke-width="3"/><rect x="0" y="-50" width="38" height="50" rx="5" fill="#d9a43a" stroke="#6b4f22" stroke-width="3"/><rect x="-22" y="-98" width="38" height="48" rx="5" fill="#5f8f4a" stroke="#2f4f22" stroke-width="3"/></g>
          <g class="int-lantMesa" transform="translate(1440,712) rotate(-90)">${P.lanterna()}</g>
          <g class="int-powerbank" transform="translate(1520,712)"><rect x="-26" y="-14" width="52" height="18" rx="5" fill="#33363d" stroke="${T}" stroke-width="3"/><circle cx="16" cy="-5" r="3" fill="#58d68d"/></g>
        </g>`;
    s += `<g class="int-mochilaPorta" opacity="0" transform="translate(2990,990)"><path d="M-46,0 L-50,-110 Q-50,-140 0,-142 Q50,-140 50,-110 L46,0 Z" fill="${COR.mochila}" stroke="${T}" stroke-width="5"/><rect x="-30" y="-70" width="60" height="44" rx="8" fill="#1d1f24" stroke="${T}" stroke-width="3"/><path d="M-20,-142 Q0,-170 20,-142" fill="none" stroke="${T}" stroke-width="6"/></g>`;
    // cadeira da esquerda (na frente da mesa)
    s += `<g class="int-cadeira"><rect x="1050" y="840" width="110" height="18" fill="#7a4b2c" stroke="#4e2f1b" stroke-width="3"/><rect x="1060" y="858" width="12" height="130" fill="#5e3a22"/><rect x="1140" y="858" width="12" height="130" fill="#5e3a22"/><rect x="1040" y="660" width="22" height="330" rx="6" fill="#6b4026"/></g>`;
    // camadas de personagens
    s += `<g class="int-atores">${o.atores || ''}</g>`;
    // luz: entardecer, noite, flash branco, lanterna, varredura azul
    s += `<rect class="int-tarde" x="-900" y="-400" width="5500" height="2000" fill="#f0a060" opacity="0" style="mix-blend-mode:multiply"/>`;
    s += `<rect class="int-noite" x="-900" y="-400" width="5500" height="2000" fill="#1a2747" opacity="0" style="mix-blend-mode:multiply"/>`;
    s += `<rect class="int-frestaPorta" x="3100" y="986" width="230" height="6" fill="${COR.alienForte}" opacity="0"/>`;
    s += `<ellipse class="int-frestaLuz" cx="3215" cy="1000" rx="260" ry="70" fill="url(#${pre}-glowA)" opacity="0" style="mix-blend-mode:screen"/>`;
    s += `<ellipse class="int-lanterna" cx="1440" cy="700" rx="420" ry="300" fill="url(#${pre}-glowQ)" opacity="0" style="mix-blend-mode:screen"/>`;
    s += `<polygon class="int-varre" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`;
    s += `<rect class="int-flash" x="-900" y="-400" width="5500" height="2000" fill="#f4fbff" opacity="0"/>`;
    return s;
  }
  /** Vista da janela da cozinha (coordenadas da janela: 660..980 × 190..460). */
  function vistaCozinha(pre, o = {}) {
    const luz = o.luz || 'dia';
    const ceu = luz === 'noite' ? `url(#${pre}-ceuNoite)` : luz === 'tarde' ? `url(#${pre}-ceuTarde)` : `url(#${pre}-ceuDia)`;
    const casa = luz === 'noite' ? '#2a344a' : luz === 'tarde' ? '#a5806c' : '#e3d3b9';
    const tel = luz === 'noite' ? '#1a2030' : '#7a5c4a';
    return `<rect x="640" y="170" width="360" height="320" fill="${ceu}"/>
      <g class="vista-nave" transform="translate(820,150) scale(.32)">${svgNave(pre)}</g>
      <rect class="vista-sombra" x="640" y="170" width="360" height="320" fill="#24304a" opacity="0" style="mix-blend-mode:multiply"/>
      <polygon points="640,420 700,380 760,420" fill="${tel}"/><rect x="650" y="420" width="100" height="60" fill="${casa}"/><rect x="680" y="432" width="26" height="22" fill="${luz === 'noite' ? '#151b28' : '#a7c6dc'}"/>
      <polygon points="850,410 930,360 1010,410" fill="${tel}"/><rect x="860" y="410" width="140" height="70" fill="${casa}"/><rect x="890" y="424" width="30" height="24" fill="${luz === 'noite' ? '#151b28' : '#a7c6dc'}"/>
      <ellipse cx="790" cy="440" rx="40" ry="36" fill="${luz === 'noite' ? '#14201a' : '#5f8f46'}"/>`;
  }

  /* ───────────── telas: celular em close e TV ───────────── */
  /** Celular grande para planos de detalhe: moldura centrada em (0,0), tela 520×1000. */
  function svgCelGrande(conteudo, o = {}) {
    return `<g class="celG">
      <rect x="-300" y="-560" width="600" height="1120" rx="70" fill="#15171c" stroke="${COR.tinta}" stroke-width="10"/>
      <g class="celG-tela"><clipPath id="${o.id || 'cg'}-clip"><rect x="-266" y="-526" width="532" height="1052" rx="44"/></clipPath>
      <g clip-path="url(#${o.id || 'cg'}-clip)"><rect x="-266" y="-526" width="532" height="1052" fill="${o.fundo || '#0f141d'}"/>${conteudo}</g></g>
      <rect x="-60" y="-512" width="120" height="30" rx="15" fill="#08090b"/>
      ${o.mao === false ? '' : `<circle cx="-300" cy="200" r="120" fill="${COR.tinta}"/><circle cx="300" cy="120" r="70" fill="${COR.tinta}"/><circle cx="300" cy="260" r="64" fill="${COR.tinta}"/>`}
    </g>`;
  }
  const txt = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-family="${o.f || 'Inter'}" font-size="${o.t || 30}" font-weight="${o.p || 400}" fill="${o.c || '#fff'}" ${o.a ? `text-anchor="${o.a}"` : ''} ${o.cls ? `class="${o.cls}"` : ''} ${o.ls ? `letter-spacing="${o.ls}"` : ''} ${o.op !== undefined ? `opacity="${o.op}"` : ''}>${s}</text>`;
  function avatar(x, y, r, tipo = 'irma') {
    if (tipo === 'irma') return `<g transform="translate(${x},${y}) scale(${r / 50})"><circle r="50" fill="#f6d7cf"/><path d="M-30,-6 C-46,0 -52,26 -38,44 C-34,24 -30,10 -20,4 Z" fill="${COR.cabelo}"/><circle cy="4" r="30" fill="#fff" stroke="${COR.tinta}" stroke-width="4"/><path d="M-30,0 C-32,-24 -8,-32 12,-28 C26,-24 32,-12 31,-2 C22,-16 4,-20 -12,-16 Z" fill="${COR.cabelo}"/><ellipse cx="6" cy="6" rx="3.4" ry="4.6" fill="${COR.tinta}"/><ellipse cx="17" cy="6" rx="3.4" ry="4.6" fill="${COR.tinta}"/></g>`;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a4a66"/>`;
  }

  /* ───────────── K.cena: uma cena feita de planos ───────────── */
  /** planos: [{ ate, svg(pre), montar(el, P), quadro(tl, el, P, t) }] em ordem; `ate` = fim do plano (s). */
  function cena(id, def) {
    const planos = def.planos;
    Motion.cena(id, {
      render: () => planos.map((p, i) => `<svg class="kplano kp${i}" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${defs(`${id}${i}`)}<g class="cam">${p.svg(`${id}${i}`)}</g>${p.sobre ? p.sobre(`${id}${i}`) : ''}<rect x="0" y="0" width="1920" height="1080" fill="url(#${id}${i}-vinheta)" pointer-events="none"/><rect class="kpreto" x="0" y="0" width="1920" height="1080" fill="#000" opacity="0"/><rect class="kbranco" x="0" y="0" width="1920" height="1080" fill="#f6fbff" opacity="0"/></svg>`).join('') + (def.extra ? def.extra() : ''),
      montar(el) {
        el.planos = planos.map((p, i) => {
          const svg = el.$(`.kp${i}`);
          const q = (s) => svg.querySelector(s);
          const P = { svg, q, qa: (s) => [...svg.querySelectorAll(s)], cam: svg.querySelector('.cam'), preto: svg.querySelector('.kpreto'), branco: svg.querySelector('.kbranco') };
          if (p.montar) p.montar(el, P);
          return P;
        });
      },
      quadro(t, el, api) {
        let ini = 0, ativo = planos.length - 1;
        for (let i = 0; i < planos.length; i++) { if (t < planos[i].ate) { ativo = i; break; } }
        for (let i = 0; i < planos.length; i++) {
          const P = el.planos[i];
          const on = i === ativo;
          P.svg.style.display = on ? 'block' : 'none';
          if (on) {
            P.preto.setAttribute('opacity', 0); P.branco.setAttribute('opacity', 0);
            ini = i === 0 ? 0 : planos[i - 1].ate;
            planos[i].quadro(t - ini, el, P, t, api);
          }
        }
        if (def.quadroExtra) def.quadroExtra(t, el, api);
      },
    });
  }
  /** Câmera do plano: centro (cx, cy) no mundo, zoom z, giro r, tremor [tx, ty]. */
  function camera(P, cx, cy, z = 1, r = 0, tr = [0, 0]) {
    P.cam.setAttribute('transform', `translate(${f2(960 + tr[0])},${f2(540 + tr[1])}) rotate(${f2(r)}) scale(${f2(z * 1000) / 1000}) translate(${f2(-cx)},${f2(-cy)})`);
  }
  const at = (el, nome, v) => el && el.setAttribute(nome, typeof v === 'number' ? f2(v) : v);
  const op = (el, v) => el && el.setAttribute('opacity', f2(clamp(v)));

  window.K = { clamp, lerp, prog, E, trilha, mistura, ruido, rand, f2, tremor, vibra, cena, camera, at, op, defs, txt, avatar, COR, CHAO, D2R };
  window.B = { svg: svgBoneco, posar, andar, POSES, maoFrente, cabecaMundo, POSE0 };
  window.Pr = P;
  window.INT = { svg: svgInterior, vista: vistaCozinha, CHAO };
  window.RUA = { svg: svgRua, proj, VP, carro: svgCarro, bike: svgBike, poly };
  window.NAVE = { svg: svgNave, navinha: svgNavinha };
  window.RAST = { svg: svgRast, posar: posarRast };
  window.CEL = { svg: svgCelGrande };
})();

/* ───────────── UI: telas do celular (coordenadas da tela: −266..266 × −526..526) ───────────── */
(function () {
  const { txt, avatar, COR } = K;
  const barra = (hora = '9:08', sinal = 4) => `${txt(-220, -470, hora, { t: 30, p: 600 })}
    <g transform="translate(150,-482)">${[0, 1, 2, 3].map((i) => `<rect x="${i * 12}" y="${14 - i * 5}" width="8" height="${6 + i * 5}" rx="2" fill="#fff" opacity="${i < sinal ? 1 : 0.25}"/>`).join('')}
    <rect x="58" y="-2" width="40" height="20" rx="5" fill="none" stroke="#fff" stroke-width="2.5"/><rect x="62" y="2" width="26" height="12" rx="2" fill="#fff"/></g>`;
  /** Miniatura do vídeo: o céu com a coisa enorme (x, y = canto; w, h). */
  function video(x, y, w, h, id = 'v') {
    const sx = w / 400, sy = h / 240;
    return `<g transform="translate(${x},${y}) scale(${sx},${sy})"><clipPath id="${id}-vc"><rect width="400" height="240" rx="14"/></clipPath><g clip-path="url(#${id}-vc)">
      <rect width="400" height="240" fill="#8fb6dc"/><rect y="120" width="400" height="120" fill="#c9d9e6"/>
      <g class="ui-vid-nave" transform="translate(200,40) scale(.3)"><ellipse rx="1000" ry="150" cy="60" fill="#262c3a"/><ellipse rx="700" ry="120" cy="0" fill="#2e3546"/><ellipse cy="110" rx="160" ry="34" fill="none" stroke="#a8dcff" stroke-width="12"/></g>
      ${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 30 - 4}" y="${150 - ((i * 37) % 60)}" width="26" height="${90 + ((i * 37) % 60)}" fill="#55657c"/>`).join('')}
      <rect width="400" height="240" fill="#000" opacity=".12"/></g>
      <rect width="400" height="240" rx="14" fill="none" stroke="#ffffff22" stroke-width="2"/></g>`;
  }
  function bloqueio(o = {}) {
    const ns = (o.notifs || []).map((n, i) => `<g class="ui-n ui-n${i}" transform="translate(0,${-110 + i * 150})">
        <rect x="-240" y="-62" width="480" height="128" rx="28" fill="#ffffff" opacity=".16"/>
        <rect x="-220" y="-40" width="56" height="56" rx="14" fill="${n.cor || '#25d366'}"/><path d="M-204,-6 q8,-22 30,-12 q-6,22 -30,12 Z M-206,-4 l-6,14 l14,-6" fill="#fff" opacity=".9"/>
        ${txt(-146, -18, n.titulo, { t: 26, p: 600 })}${txt(-146, 18, n.texto, { t: 24, op: 0.85 })}${txt(220, -18, 'agora', { t: 20, a: 'end', op: 0.6 })}</g>`).join('');
    return `<rect x="-266" y="-526" width="532" height="1052" fill="url(#ui-fundoBloq)"/>
      <defs><linearGradient id="ui-fundoBloq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20345a"/><stop offset="1" stop-color="#0d1424"/></linearGradient></defs>
      ${barra(o.hora)}${txt(0, -330, o.hora || '9:08', { t: 150, p: 600, a: 'middle' })}${txt(0, -260, o.data || 'domingo, 1 de novembro', { t: 28, a: 'middle', op: 0.85 })}${ns}`;
  }
  function chamada(o = {}) {
    return `<rect x="-266" y="-526" width="532" height="1052" fill="#16243d"/>${barra(o.hora, o.sinal)}
      ${txt(0, -360, o.estado || 'chamada recebida', { t: 30, a: 'middle', op: 0.7, cls: 'ui-estado' })}
      ${avatar(0, -150, 110)}${txt(0, 30, o.nome || 'Irmã', { t: 64, p: 600, a: 'middle' })}
      ${txt(0, 84, o.sub || 'celular', { t: 28, a: 'middle', op: 0.65, cls: 'ui-sub' })}
      <g class="ui-botoes"><circle cx="-130" cy="360" r="62" fill="#e5484d"/><path d="M-160,362 q30,-22 60,0" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>
      <circle class="ui-atender" cx="130" cy="360" r="62" fill="#30a46c"/><path d="M100,352 q30,22 60,0" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
  }
  /** Conversa: msgs = [{ tipo: 'txt'|'video', texto, hora, de: 'ela'|'eu' }]. */
  function conversa(o = {}) {
    let y = -300;
    const ms = (o.msgs || []).map((m, i) => {
      let g;
      if (m.tipo === 'video') {
        g = `<g class="ui-m ui-m${i}" transform="translate(-236,${y})"><rect width="340" height="250" rx="26" fill="#2a3446"/>${video(12, 12, 316, 190, `vm${i}`)}
          <circle cx="170" cy="107" r="34" fill="#000" opacity=".5"/><path d="M160,90 L190,107 L160,124 Z" fill="#fff"/>${txt(20, 232, m.texto || '0:12', { t: 22, op: 0.7 })}</g>`;
        y += 280;
      } else {
        const linhas = m.linhas || [m.texto];
        const h = 30 + linhas.length * 40;
        const eu = m.de === 'eu';
        g = `<g class="ui-m ui-m${i}" transform="translate(${eu ? 236 - 420 : -236},${y})"><rect width="420" height="${h + 26}" rx="26" fill="${eu ? '#2f6fd6' : '#2a3446'}"/>
          ${linhas.map((l, k) => txt(24, 52 + k * 40, l, { t: 30 })).join('')}${txt(396, h + 12, m.hora || '', { t: 20, a: 'end', op: 0.6, cls: `ui-h${i}` })}</g>`;
        y += h + 50;
      }
      return g;
    }).join('');
    return `<rect x="-266" y="-526" width="532" height="1052" fill="#0f1726"/>${barra(o.hora, o.sinal)}
      <rect x="-266" y="-436" width="532" height="110" fill="#172238"/>${avatar(-190, -381, 36)}
      ${txt(-136, -390, o.nome || 'Irmã', { t: 34, p: 600 })}${txt(-136, -354, o.sub || 'visto por último hoje', { t: 22, op: 0.6 })}
      <g class="ui-msgs">${ms}</g>`;
  }
  function encerrada(o = {}) {
    return `<rect x="-266" y="-526" width="532" height="1052" fill="#1a1d24"/>${barra(o.hora, 0)}
      ${avatar(0, -150, 110)}${txt(0, 30, o.nome || 'Irmã', { t: 64, p: 600, a: 'middle', op: 0.6 })}
      ${txt(0, 100, o.texto || 'chamada encerrada', { t: 34, a: 'middle', c: '#ff6b6b' })}${txt(0, 150, o.sub || 'sem serviço', { t: 28, a: 'middle', op: 0.6 })}`;
  }
  window.UI = { barra, video, bloqueio, chamada, conversa, encerrada };
})();

/* vista da janela da sala (coordenadas 1990..2370 × 230..550): três céus para cruzar (dia/tarde/noite) */
(function () {
  INT.vistaSala = function (pre) {
    const casas = (cor, jan) => `<polygon points="1980,430 2060,370 2140,430" fill="${cor[1]}"/><rect x="1990" y="430" width="140" height="130" fill="${cor[0]}"/><rect x="2020" y="450" width="34" height="30" fill="${jan}"/>
      <polygon points="2200,420 2300,350 2400,420" fill="${cor[1]}"/><rect x="2210" y="420" width="180" height="140" fill="${cor[0]}"/><rect x="2250" y="440" width="38" height="32" fill="${jan}"/>
      <rect x="1980" y="520" width="420" height="40" fill="${cor[2]}"/>`;
    return `<g class="vs-dia"><rect x="1980" y="220" width="420" height="340" fill="url(#${pre}-ceuDia)"/>${casas(['#e3d3b9', '#7a5c4a', '#7ea35a'], '#a7c6dc')}</g>
      <g class="vs-tarde" opacity="0"><rect x="1980" y="220" width="420" height="340" fill="url(#${pre}-ceuTarde)"/>${casas(['#a5806c', '#4a3836', '#5d6644'], '#e9b27a')}</g>
      <g class="vs-noite" opacity="0"><rect x="1980" y="220" width="420" height="340" fill="url(#${pre}-ceuNoite)"/>${casas(['#2a344a', '#1a2030', '#1e2a26'], '#151b28')}
        <circle cx="2330" cy="270" r="16" fill="#e8eef8" opacity=".85"/></g>
      <g class="vs-rast" opacity="0"></g>`;
  };
  INT.ceuSala = function (P, dia, tarde, noite) {
    K.op(P.q('.vs-dia'), dia); K.op(P.q('.vs-tarde'), tarde); K.op(P.q('.vs-noite'), noite);
  };
})();
