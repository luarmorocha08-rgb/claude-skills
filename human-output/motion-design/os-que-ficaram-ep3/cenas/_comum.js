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
    const mochila = o.mochilaEntrega ? `<rect x="-58" y="-70" width="44" height="62" rx="6" fill="#27ae60" stroke="${T}" stroke-width="4"/><rect x="-52" y="-50" width="32" height="10" fill="#f1c40f"/>` : o.mochila ? `<rect x="-41" y="-56" width="24" height="50" rx="9" fill="${COR.mochila}" stroke="${T}" stroke-width="4"/>
         <rect x="-38" y="-30" width="18" height="16" rx="4" fill="#1d1f24"/>` : '';
    const alca = (o.mochila || o.mochilaEntrega) ? `<path d="M-15,-58 Q-4,-40 -9,-14" fill="none" stroke="${COR.mochila}" stroke-width="5" stroke-linecap="round"/>` : '';
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
          ${o.coque ? `<circle cx="-22" cy="-30" r="15" fill="${o.corCabelo || '#3a2a20'}" stroke="${T}" stroke-width="4"/><path d="M-36,-10 C-36,-34 -6,-42 16,-38 C28,-34 34,-24 35,-14 C20,-28 0,-30 -18,-24 Z" fill="${o.corCabelo || '#3a2a20'}" stroke="${T}" stroke-width="4"/>` : ''}
          ${o.chiquinhas ? `<path d="M-30,-22 C-52,-30 -58,-4 -46,8 C-42,-6 -36,-14 -28,-14 Z M30,-24 C48,-36 60,-12 50,2 C46,-10 40,-16 32,-16 Z" fill="${o.corCabelo || '#4a2c18'}" stroke="${T}" stroke-width="4"/><path d="M-34,-12 C-34,-34 -6,-42 16,-38 C28,-34 34,-24 35,-14 C20,-28 0,-30 -18,-24 Z" fill="${o.corCabelo || '#4a2c18'}" stroke="${T}" stroke-width="4"/>` : ''}
          ${o.cabeloCurto ? `<path d="M-36,-8 C-38,-38 -6,-46 18,-40 C32,-36 38,-22 37,-10 C30,-22 12,-30 -8,-28 C-22,-26 -30,-18 -36,-8 Z" fill="${o.corCabelo || '#2a1d16'}" stroke="${T}" stroke-width="4"/>` : ''}
          ${o.bone ? `<path d="M-36,-14 C-36,-44 34,-46 37,-14 Z" fill="${o.bone}" stroke="${T}" stroke-width="4"/><path d="M20,-16 L62,-12 Q62,-4 20,-8 Z" fill="${o.bone}" stroke="${T}" stroke-width="4"/>` : ''}
          ${o.oculos ? `<g fill="none" stroke="${T}" stroke-width="3"><circle cx="9" cy="-4" r="10"/><circle cx="25" cy="-4" r="10"/><line x1="19" y1="-4" x2="15" y2="-4"/></g>` : ''}
          ${o.bigode ? `<path d="M6,10 Q16,4 26,10 Q16,16 6,10 Z" fill="${T}"/>` : ''}
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
      <linearGradient id="${pre}-ceuManha" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6d82b8"/><stop offset="55%" stop-color="#e6a7a0"/><stop offset="100%" stop-color="#f6d2a2"/></linearGradient>
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
        // sincronia com a narração final: pontos [tempo novo, tempo original] por frase
        const W = (window.SINCRONIA || {})[id];
        if (W && W.length > 1) {
          let i = 1; while (i < W.length - 1 && t > W[i][0]) i++;
          const [n0, o0] = W[i - 1], [n1, o1] = W[i];
          t = o0 + (t - n0) * (o1 - o0) / Math.max(1e-6, n1 - n0);
        }
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

  /** Cena amarrada às frases da narração: cada plano começa na frase `de` (índice). */
  function cenaN(id, planos, opts = {}) {
    const T = () => (window.TEMPOS || {})[id] || { frases: [], dur: 10 };
    const F = (i) => { const fr = T().frases; if (!fr.length) return 0; if (i >= fr.length) return T().dur; return fr[Math.max(0, i)][0]; };
    const Fe = (i) => { const fr = T().frases; return fr.length ? fr[Math.min(fr.length - 1, Math.max(0, i))][1] : 0; };
    const lista = planos.map((p, i) => Object.assign({}, p, { ate: i === planos.length - 1 ? 99 : Math.max(0.1, F(planos[i + 1].de) + (planos[i + 1].off || 0) - (planos[i + 1].antes ?? 0.12)) }));
    lista.forEach((p) => { const q = p.quadro; p.quadro = (tl, el, P, t, api) => q(tl, el, P, t, F, Fe, api); });
    cena(id, Object.assign({ planos: lista }, opts));
  }
  window.K = { cenaN, clamp, lerp, prog, E, trilha, mistura, ruido, rand, f2, tremor, vibra, cena, camera, at, op, defs, txt, avatar, COR, CHAO, D2R };
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

/* ═════════════ EP2: irmã, objetos, mercado, depósito, rua de lado, ônibus, mapa, rádio ═════════════ */
(function () {
  const { COR, txt, f2, rand } = K;
  const T = COR.tinta;
  const IRMA = { cabelo: true, roupa: COR.salmao, roupaEsc: '#c4604c', mochila: true };
  const VOCE_MOCHILA = { mochila: true };

  /* objetos extras */
  Object.assign(Pr, {
    banana: (o = {}) => `<g class="p-banana"><path d="M-22,-4 Q0,14 24,-8 Q26,-2 22,2 Q0,22 -24,2 Z" fill="#f2cf4a" stroke="${T}" stroke-width="3"/>${[-12, 0, 12].map((x) => `<circle cx="${x}" cy="${3 + (x === 0 ? 4 : 0)}" r="2.6" fill="#6b4a1e"/>`).join('')}<path d="M22,-8 l6,-4" stroke="${T}" stroke-width="4" stroke-linecap="round"/></g>`,
    garrafa: () => `<g class="p-garrafa"><rect x="-10" y="-46" width="20" height="46" rx="7" fill="#cfe7f7" stroke="#6f93ad" stroke-width="3"/><rect x="-5" y="-56" width="10" height="11" rx="2" fill="#3f78c8"/><rect x="-10" y="-30" width="20" height="12" fill="#4a90d9" opacity=".7"/></g>`,
    cesta: () => `<g class="p-cesta"><path d="M-30,0 L-24,30 L24,30 L30,0 Z" fill="#e5484d" stroke="${T}" stroke-width="3"/><path d="M-20,0 Q0,-30 20,0" fill="none" stroke="${T}" stroke-width="4"/><line x1="-26" y1="12" x2="26" y2="12" stroke="#b33a3e" stroke-width="2"/></g>`,
    barra: () => `<g class="p-barra"><rect x="-4" y="-70" width="8" height="90" rx="3" fill="#6b7179" stroke="${T}" stroke-width="2.5"/></g>`,
    pilhas: () => `<g class="p-pilhas"><rect x="-14" y="-18" width="28" height="36" rx="3" fill="#f1c40f" stroke="${T}" stroke-width="2.5"/><rect x="-8" y="-10" width="7" height="20" rx="2" fill="#2c3e50"/><rect x="2" y="-10" width="7" height="20" rx="2" fill="#2c3e50"/></g>`,
    radio: () => `<g class="p-radio"><rect x="-26" y="-18" width="52" height="34" rx="6" fill="#3a3f48" stroke="${T}" stroke-width="3"/><circle cx="-10" cy="0" r="9" fill="#22262d"/><rect x="6" y="-10" width="14" height="8" fill="#9fd88a"/><line x1="18" y1="-18" x2="30" y2="-44" stroke="${T}" stroke-width="3"/></g>`,
  });

  /* rua vista de lado (mundo 0..4400 × 0..1080; calçada nos pés y=980) */
  function svgRuaLado(pre, o = {}) {
    const luz = o.luz || 'dia';
    const P = {
      dia: { ceu: `url(#${pre}-ceuDia)`, cas: ['#e5d6bd', '#d9c7aa', '#e9e1d2', '#cdb99b', '#d8cdb5'], tel: '#6b5547', jan: '#a7c6dc', calc: '#c9c5bb', asf: '#7c8088', grama: '#7ea35a', poste: '#5a4a3c' },
      manha: { ceu: `url(#${pre}-ceuManha)`, cas: ['#e8cfb6', '#dcc0a6', '#ecd8c6', '#d1b496', '#dccbb4'], tel: '#6b4f47', jan: '#e7c2a4', calc: '#c9bdb0', asf: '#7a7680', grama: '#839a5a', poste: '#4a3c34' },
      tarde: { ceu: `url(#${pre}-ceuTarde)`, cas: ['#b9967f', '#a88672', '#c3a58e', '#9c7c69', '#b19a84'], tel: '#4a3836', jan: '#e9b27a', calc: '#8c7f7a', asf: '#4a4650', grama: '#5d6644', poste: '#2a2324' },
    }[luz];
    let s = `<rect x="-600" y="-400" width="5600" height="1500" fill="${P.ceu}"/>`;
    const esquinas = o.esquinas || [];
    for (let i = 0; i < 18; i++) {
      const x = -400 + i * 300;
      if (esquinas.some((e) => x > e - 300 && x < e + 260)) continue;
      const h = 360 + (i % 3) * 60, c = P.cas[i % 5], aberta = (o.abertas || []).includes(i);
      s += `<polygon points="${x - 10},${880 - h} ${x + 130},${880 - h - 110} ${x + 270},${880 - h}" fill="${P.tel}"/>
        <rect x="${x}" y="${880 - h}" width="260" height="${h}" fill="${c}"/>
        <rect x="${x + 30}" y="${880 - h + 50}" width="70" height="70" fill="${P.jan}" stroke="#f4f1ea" stroke-width="6"/><rect x="${x + 160}" y="${880 - h + 50}" width="70" height="70" fill="${P.jan}" stroke="#f4f1ea" stroke-width="6"/>
        <rect x="${x + 100}" y="730" width="64" height="150" fill="${aberta ? '#141414' : '#5a4436'}"/>${aberta ? `<polygon points="${x + 100},730 ${x + 76},742 ${x + 76},872 ${x + 100},880" fill="#5a4436"/>` : `<circle cx="${x + 152}" cy="808" r="4" fill="#d9c27a"/>`}`;
    }
    esquinas.forEach((e) => { s += `<rect x="${e - 260}" y="560" width="520" height="40" fill="${P.grama}"/>${[-200, -90, 30, 130].map((dx, k) => `<polygon points="${e + dx},560 ${e + dx + 45},${528 - k % 2 * 8} ${e + dx + 90},560" fill="${P.tel}"/><rect x="${e + dx + 6}" y="560" width="78" height="${46 - k % 2 * 8}" fill="${P.cas[k]}"/>`).join('')}
      <polygon points="${e - 250},880 ${e + 250},880 ${e + 95},600 ${e - 95},600" fill="${P.calc}"/><polygon points="${e - 150},880 ${e + 150},880 ${e + 60},600 ${e - 60},600" fill="${P.asf}"/>`; });
    s += `<rect x="-600" y="870" width="5600" height="120" fill="${P.calc}"/><rect x="-600" y="985" width="5600" height="18" fill="#9b968c"/><rect x="-600" y="1000" width="5600" height="500" fill="${P.asf}"/>`;
    for (let x = -600; x < 5000; x += 220) s += `<rect x="${x}" y="1110" width="110" height="10" fill="#e8e2c8" opacity=".7"/>`;
    for (let x = 0; x < 4600; x += 900) s += `<rect x="${x}" y="300" width="18" height="690" fill="${P.poste}"/><rect x="${x - 60}" y="330" width="138" height="10" fill="${P.poste}"/>`;
    s += `<path d="M-600,350 Q-150,400 300,350 Q750,400 1200,350 Q1650,400 2100,350 Q2550,400 3000,350 Q3450,400 3900,350 Q4350,400 4800,350" stroke="${P.poste}" stroke-width="3" fill="none"/>`;
    if (o.fios) s += `<path class="fioCaido" d="M${o.fios},340 Q${o.fios + 120},820 ${o.fios + 420},975 L${o.fios + 700},980" stroke="#141414" stroke-width="5" fill="none"/>`;
    return s;
  }
  /* ônibus visto de lado, centrado na base */
  function svgOnibus() {
    return `<g class="onibus"><rect x="-300" y="-230" width="600" height="200" rx="24" fill="#e2b13c" stroke="${T}" stroke-width="6"/>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${-270 + i * 104}" y="-205" width="86" height="70" rx="8" fill="#5b6b80"/>`).join('')}
      <rect x="-300" y="-110" width="600" height="18" fill="#c0392b"/><rect x="190" y="-205" width="60" height="170" rx="6" fill="#4a5a70"/>
      <circle cx="-190" cy="-28" r="36" fill="#1b1d22" stroke="#555" stroke-width="8"/><circle cx="180" cy="-28" r="36" fill="#1b1d22" stroke="#555" stroke-width="8"/></g>`;
  }

  /* mercado por dentro (mundo 0..4600; pés em y=990) */
  function svgMercado(pre, o = {}) {
    let s = `<rect x="-600" y="-400" width="5800" height="1290" fill="#e9e6dc"/><rect x="-600" y="880" width="5800" height="700" fill="#d8d4c8"/>`;
    for (let x = -600; x < 5200; x += 140) s += `<line x1="${x}" y1="880" x2="${f2(960 + (x - 960) * 2.4)}" y2="1580" stroke="#c4bfb2" stroke-width="2"/>`;
    [930, 1010, 1130].forEach((y) => (s += `<line x1="-600" y1="${y}" x2="5200" y2="${y}" stroke="#c4bfb2" stroke-width="2"/>`));
    // teto e luminárias (algumas apagadas)
    s += `<rect x="-600" y="-400" width="5800" height="480" fill="#d9d5ca"/>`;
    for (let x = 0; x < 4600; x += 420) { const on = rand(x) > 0.35; s += `<rect class="luminaria" x="${x}" y="60" width="240" height="18" rx="4" fill="${on ? '#fffbe8' : '#9a978e'}"/>${on ? `<ellipse cx="${x + 120}" cy="90" rx="200" ry="60" fill="url(#${pre}-glowQ)" opacity=".35"/>` : ''}`; }
    // vitrine e porta (0..900), com a rua lá fora
    s += `<clipPath id="${pre}-vit"><rect x="20" y="170" width="860" height="700"/></clipPath><g clip-path="url(#${pre}-vit)"><g class="m-fora">
      <rect x="0" y="100" width="900" height="800" fill="url(#${pre}-ceuDia)"/><rect x="0" y="700" width="900" height="200" fill="#8a8e94"/>
      <rect x="40" y="380" width="220" height="320" fill="#d9c7aa"/><rect x="560" y="420" width="260" height="280" fill="#e5d6bd"/><rect x="300" y="560" width="14" height="140" fill="#5a4a3c"/></g>
      <rect class="m-foraSombra" x="0" y="100" width="900" height="800" fill="#0f1830" opacity="0"/></g>`;
    s += `<rect x="10" y="160" width="880" height="720" fill="none" stroke="#5e6670" stroke-width="20"/><line x1="300" y1="170" x2="300" y2="870" stroke="#5e6670" stroke-width="14"/><line x1="600" y1="170" x2="600" y2="870" stroke="#5e6670" stroke-width="14"/>
      <path d="M640,300 L700,360 L680,420 M700,360 L770,340 M700,360 L720,450" stroke="#ffffff" stroke-width="4" fill="none" opacity=".8"/>
      <rect x="80" y="200" width="160" height="70" fill="#e5484d"/>${txt(160, 248, 'OFERTAS', { f: 'Anton', t: 36, a: 'middle' })}`;
    s += `<rect x="200" y="-20" width="500" height="70" fill="#2f6fd6"/>${txt(450, 30, 'MERCADO', { f: 'Anton', t: 48, a: 'middle' })}`;
    // caixas (balcões) 1000..1900
    for (let i = 0; i < 2; i++) { const x = 1000 + i * 480;
      s += `<g class="m-caixa${i}"><rect x="${x}" y="720" width="380" height="170" fill="#7d8b9f" stroke="#4d5866" stroke-width="5"/><rect x="${x}" y="706" width="380" height="20" fill="#2b2e34"/>
        <rect x="${x + 280}" y="600" width="80" height="110" fill="#3a3f48" stroke="${T}" stroke-width="3"/><rect x="${x + 290}" y="612" width="60" height="34" fill="#7fd1ff" opacity=".4"/>
        <rect x="${x - 40}" y="520" width="12" height="370" fill="#6b7179"/>${txt(x + 190, 820, String(i + 1), { f: 'Anton', t: 40, a: 'middle', c: '#e9eef8' })}</g>`; }
    s += `<g class="m-pilhasRack"><rect x="1880" y="560" width="160" height="330" fill="#c9ced6" stroke="#6b7179" stroke-width="4"/>${txt(1960, 600, 'PILHAS', { f: 'Anton', t: 30, a: 'middle', c: '#2b2e34' })}
      ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<g class="m-pilha m-p${r}${c}" transform="translate(${1915 + c * 46},${660 + r * 70})">${Pr.pilhas()}</g>`).join('')).join('')}</g>`;
    // gôndolas (2100..3700)
    const prods = ['#e5484d', '#f1c40f', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#ecf0f1'];
    for (let g = 0; g < 4; g++) { const x0 = 2100 + g * 400;
      s += `<rect x="${x0}" y="300" width="380" height="590" fill="#b9bec6" stroke="#6b7179" stroke-width="4"/>`;
      for (let n = 0; n < 4; n++) { const y = 400 + n * 125; s += `<rect x="${x0}" y="${y}" width="380" height="12" fill="#6b7179"/>`;
        if (g === 1) continue;
        for (let k = 0; k < 9; k++) if (rand(g * 50 + n * 9 + k) > 0.62) { const c = prods[Math.floor(rand(k + g + n * 3) * 7)]; s += `<rect x="${x0 + 10 + k * 40}" y="${y - 50 - (k % 2) * 10}" width="30" height="${50 + (k % 2) * 10}" fill="${c}" stroke="${T}" stroke-width="2"/>`; } } }
    s += `<rect x="2520" y="240" width="300" height="56" fill="#3498db"/>${txt(2670, 282, 'ÁGUA', { f: 'Anton', t: 40, a: 'middle' })}`;
    s += `<rect x="2120" y="240" width="300" height="56" fill="#e67e22"/>${txt(2270, 282, 'MERCEARIA', { f: 'Anton', t: 34, a: 'middle' })}`;
    s += `<rect x="2920" y="240" width="300" height="56" fill="#2ecc71"/>${txt(3070, 282, 'BISCOITOS', { f: 'Anton', t: 34, a: 'middle' })}`;
    // fundos: porta do depósito bloqueada por caixas (3900..4500)
    s += `<rect x="3900" y="420" width="420" height="470" fill="#7a7f87" stroke="#4d5866" stroke-width="6"/><line x1="4110" y1="420" x2="4110" y2="890" stroke="#4d5866" stroke-width="6"/>
      <rect x="3960" y="450" width="300" height="44" fill="#e5484d"/>${txt(4110, 482, 'SOMENTE FUNCIONÁRIOS', { t: 24, p: 600, a: 'middle' })}`;
    s += `<g class="m-caixasBloq">${[[3920, 780, 160, 110], [4080, 780, 150, 110], [4240, 780, 140, 110], [3990, 670, 150, 110], [4150, 670, 160, 110], [4060, 560, 140, 110]].map(([x, y, w, h], i) => `<g class="m-cx m-cx${i}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#c9a06a" stroke="#8a6a3f" stroke-width="4"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="#a8834f" stroke-width="3"/></g>`).join('')}</g>`;
    // carrinhos
    s += `<g class="m-carrinho" transform="translate(${o.carrinhoX || 1700},990)">${svgCarrinho()}</g>`;
    s += `<g class="m-atores">${o.atores || ''}</g>`;
    s += `<g class="m-latas"></g>`;
    s += `<rect class="m-escuro" x="-600" y="-400" width="5800" height="2000" fill="#1a2747" opacity="0" style="mix-blend-mode:multiply"/>`;
    s += `<polygon class="m-varre" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`;
    return s;
  }
  function svgCarrinho() {
    return `<g class="carrinho"><path d="M-80,-170 L90,-170 L70,-60 L-60,-60 Z" fill="none" stroke="#6b7179" stroke-width="7" stroke-linejoin="round"/>
      ${[-50, -20, 10, 40, 70].map((x) => `<line x1="${x}" y1="-170" x2="${x - 5}" y2="-60" stroke="#8a9099" stroke-width="3"/>`).join('')}
      <path d="M-80,-170 L-110,-200" stroke="#6b7179" stroke-width="7" stroke-linecap="round"/><line x1="-60" y1="-60" x2="-50" y2="-14" stroke="#6b7179" stroke-width="6"/><line x1="70" y1="-60" x2="60" y2="-14" stroke="#6b7179" stroke-width="6"/>
      <circle cx="-50" cy="-10" r="10" fill="#1b1d22"/><circle cx="60" cy="-10" r="10" fill="#1b1d22"/></g>`;
  }
  /* depósito (mundo 0..2600; pés em y=990) */
  function svgDeposito(pre, o = {}) {
    let s = `<rect x="-600" y="-400" width="3800" height="1290" fill="#9a9488"/><rect x="-600" y="880" width="3800" height="700" fill="#77726a"/>`;
    for (let i = 0; i < 4; i++) { const x = 100 + i * 560; s += `<rect x="${x}" y="220" width="460" height="670" fill="none" stroke="#4d5866" stroke-width="10"/>`;
      for (let n = 0; n < 4; n++) { const y = 320 + n * 160; s += `<rect x="${x}" y="${y}" width="460" height="12" fill="#4d5866"/>`;
        for (let k = 0; k < 3; k++) if (rand(i * 20 + n * 3 + k) > 0.3) s += `<rect x="${x + 20 + k * 145}" y="${y - 90}" width="120" height="90" fill="#c9a06a" stroke="#8a6a3f" stroke-width="4"/>`; } }
    s += `<g class="d-agua">${[0, 1, 2, 3, 4].map((k) => `<g transform="translate(${1830 + k * 34},${960})">${Pr.garrafa()}</g>`).join('')}</g>`;
    s += `<g class="d-cama"><rect x="2280" y="940" width="300" height="40" fill="#c9a06a" stroke="#8a6a3f" stroke-width="4"/><path d="M2290,940 Q2380,900 2470,930 L2560,940 Z" fill="#8e5ea2"/></g>`;
    s += `<rect x="2650" y="420" width="220" height="470" fill="#5e6670" stroke="#3a3f48" stroke-width="6"/><rect x="2700" y="380" width="120" height="34" fill="#2ecc71"/>${txt(2760, 406, 'SAÍDA', { f: 'Anton', t: 28, a: 'middle' })}`;
    s += `<rect class="d-portaSaida" x="2650" y="420" width="220" height="470" fill="#f4e6c8" opacity="0"/>`;
    s += `<g class="d-atores">${o.atores || ''}</g>`;
    s += `<rect class="d-escuro" x="-600" y="-400" width="3800" height="2000" fill="#1a2747" opacity=".45" style="mix-blend-mode:multiply"/>`;
    s += `<ellipse class="d-lanterna" cx="1300" cy="700" rx="500" ry="360" fill="url(#${pre}-glowQ)" opacity="0" style="mix-blend-mode:screen"/>`;
    return s;
  }
  /* mapa de papel (vista de cima, 1920×1080) */
  function svgMapa(pre) {
    let s = `<rect x="-200" y="-200" width="2320" height="1480" fill="#7a4b2c"/><g transform="rotate(-3 960 540)"><rect x="200" y="90" width="1520" height="900" fill="#f3ead2" stroke="#c9b98f" stroke-width="6"/>`;
    for (let x = 260; x < 1700; x += 120) s += `<line x1="${x}" y1="100" x2="${x + 30}" y2="980" stroke="#e2d4b0" stroke-width="10"/>`;
    for (let y = 150; y < 980; y += 110) s += `<line x1="210" y1="${y}" x2="1710" y2="${y + 20}" stroke="#e2d4b0" stroke-width="10"/>`;
    s += `<path d="M210,560 L1710,600" stroke="#e8b84a" stroke-width="34"/>${txt(1040, 560, 'AVENIDA', { f: 'Anton', t: 30, c: '#8a6a2a', a: 'middle' })}
      <path d="M420,250 Q700,300 760,420" stroke="#9ec7e6" stroke-width="24" fill="none"/>
      <g transform="translate(420,820)"><path d="M-30,10 L0,-24 L30,10 L30,40 L-30,40 Z" fill="#2f6fd6" stroke="${T}" stroke-width="4"/>${txt(0, 80, 'CASA', { f: 'Anton', t: 30, c: '#141414', a: 'middle' })}</g>
      <g transform="translate(1500,240)"><rect x="-40" y="-20" width="80" height="56" fill="#e5484d" stroke="${T}" stroke-width="4"/><polygon points="-50,-20 0,-56 50,-20" fill="#c0392b" stroke="${T}" stroke-width="4"/>${txt(0, 76, 'ESCOLA', { f: 'Anton', t: 30, c: '#141414', a: 'middle' })}</g>
      <path class="rota" d="M450,790 L560,700 L700,690 L860,640 L1000,590 L1160,560 L1260,430 L1400,360 L1480,290" stroke="#d6262f" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>
      <g class="perigo" opacity="0" transform="translate(1040,600)"><circle r="48" fill="${COR.alien}" opacity=".35"/><circle r="26" fill="#1c212d" stroke="${T}" stroke-width="4"/><circle r="10" fill="${COR.alienForte}"/></g></g>`;
    return s;
  }
  /* rádio grande (close) */
  function svgRadioGrande(pre) {
    return `<g class="radioG"><rect x="-520" y="-300" width="1040" height="560" rx="50" fill="#3a3f48" stroke="${T}" stroke-width="12"/>
      <circle cx="-260" cy="0" r="190" fill="#22262d" stroke="#14161a" stroke-width="10"/>${Array.from({ length: 7 }, (_, i) => `<circle cx="-260" cy="0" r="${30 + i * 22}" fill="none" stroke="#2c3038" stroke-width="6"/>`).join('')}
      <rect x="20" y="-210" width="440" height="150" rx="14" fill="#1c2a1c" stroke="${T}" stroke-width="6"/><rect class="r-lcd" x="34" y="-196" width="412" height="122" rx="8" fill="#9fd88a" opacity=".9"/>
      ${Array.from({ length: 11 }, (_, i) => `<line x1="${60 + i * 36}" y1="-110" x2="${60 + i * 36}" y2="${i % 2 ? -96 : -88}" stroke="#2d4a2d" stroke-width="3"/>`).join('')}
      <rect class="r-agulha" x="60" y="-186" width="6" height="104" fill="#d6262f"/>
      <text class="r-txt" x="240" y="-140" text-anchor="middle" font-family="Anton" font-size="34" fill="#1c2a1c"></text>
      <g class="r-botao" transform="translate(330,120)"><circle r="80" fill="#22262d" stroke="${T}" stroke-width="8"/><rect x="-8" y="-74" width="16" height="44" rx="6" fill="#b8bec7"/></g>
      <g class="r-onda" fill="none" stroke="#9fd88a" stroke-width="6" stroke-linecap="round" opacity="0"><path d="M-30,-60 q30,60 0,120"/><path d="M-60,-100 q60,100 0,200"/></g>
      <line x1="440" y1="-300" x2="620" y2="-620" stroke="${T}" stroke-width="12" stroke-linecap="round"/></g>`;
  }
  Object.assign(K, { IRMA, VOCE_MOCHILA });
  window.EP2 = { ruaLado: svgRuaLado, onibus: svgOnibus, mercado: svgMercado, carrinho: svgCarrinho, deposito: svgDeposito, mapa: svgMapa, radio: svgRadioGrande };
})();

/* ═════════════ EP3: elenco, veículos, avenida, estação, escola ═════════════ */
(function () {
  const { COR, txt, f2, rand } = K;
  const T = COR.tinta;
  /* elenco */
  const ELENCO = {
    voce: { mochila: false }, irma: K.IRMA,
    leo: { camiseta: true, roupa: '#e67e22', roupaEsc: '#b85f12', bone: '#c0392b', mochilaEntrega: true },
    davi: { camiseta: true, roupa: '#5d6d7e', roupaEsc: '#3e4a56', bigode: true, cabeloCurto: true, corCabelo: '#2a1d16' },
    bia: { roupa: '#f1c40f', roupaEsc: '#c79d0a', chiquinhas: true },
    helena: { roupa: '#8e5ea2', roupaEsc: '#6c4580', oculos: true, coque: true, corCabelo: '#5a5a5a' },
    rosa: { camiseta: true, roupa: '#16a085', roupaEsc: '#0e705d', cabeloCurto: true, corCabelo: '#3a2618' },
    joel: { camiseta: true, roupa: '#8d6e4c', roupaEsc: '#6a5236', bone: '#7f8c8d' },
    pai: { camiseta: true, roupa: '#2e5e4e', roupaEsc: '#1f4035' }, mae: { roupa: '#8e2f45', roupaEsc: '#6b2234', cabelo: true },
    menino: { roupa: '#5dade2', roupaEsc: '#3a8cc4' },
  };
  const ESCALA = { bia: 0.62, menino: 0.5, davi: 1.04 };
  const ator = (nome, id, extra = {}) => B.svg(id || nome, Object.assign({}, ELENCO[nome], extra));
  const figurante = (id, cor, extra = {}) => B.svg(id, Object.assign({ roupa: cor, roupaEsc: '#00000044' }, extra));

  /* veículos de lado (base no chão, centro x) */
  const carroLado = (cor = '#c0392b', aberta = false) => `<g class="carroL"><path d="M-170,-40 L-160,-90 L-90,-96 L-50,-150 L70,-150 L120,-96 L170,-86 L176,-40 Z" fill="${cor}" stroke="${T}" stroke-width="6" stroke-linejoin="round"/>
    <path d="M-40,-140 L-6,-140 L-6,-100 L-78,-100 Z" fill="#5b6b80"/><path d="M6,-140 L62,-140 L100,-100 L6,-100 Z" fill="#5b6b80"/>
    ${aberta ? '<path d="M6,-100 L6,-40 L-40,-30 L-40,-96 Z" fill="#1b1d22" opacity=".85"/>' : ''}
    <circle cx="-100" cy="-36" r="34" fill="#1b1d22" stroke="#555" stroke-width="8"/><circle cx="110" cy="-36" r="34" fill="#1b1d22" stroke="#555" stroke-width="8"/></g>`;
  const caminhaoPipa = () => `<g class="pipa"><rect x="-330" y="-250" width="460" height="170" rx="80" fill="#f4f6f7" stroke="${T}" stroke-width="7"/><rect x="-330" y="-190" width="460" height="34" fill="#2f6fd6"/>
    ${txt(-100, -110, 'ÁGUA POTÁVEL', { f: 'Anton', t: 40, c: '#2f6fd6', a: 'middle' })}
    <path d="M150,-80 L150,-230 L250,-230 L310,-160 L320,-80 Z" fill="#f4f6f7" stroke="${T}" stroke-width="7" stroke-linejoin="round"/><path d="M168,-215 L240,-215 L290,-160 L168,-160 Z" fill="#5b6b80" class="pipa-vidro"/>
    <rect x="-340" y="-88" width="670" height="30" fill="#5e6670" stroke="${T}" stroke-width="5"/>
    ${[-260, -150, 250].map((x) => `<circle cx="${x}" cy="-40" r="42" fill="#1b1d22" stroke="#555" stroke-width="9"/>`).join('')}</g>`;
  const semaforo = () => `<g class="semaforo"><rect x="-8" y="-640" width="16" height="640" fill="#2b2e34"/><rect x="-8" y="-640" width="220" height="14" fill="#2b2e34"/>
    <g class="sem-caixa" transform="translate(190,-626)"><rect x="-22" y="0" width="44" height="120" rx="8" fill="#1b1d22" stroke="${T}" stroke-width="4"/>${[22, 60, 98].map((y) => `<circle cy="${y}" r="13" fill="#3a3f48"/>`).join('')}</g></g>`;
  const abrigoOnibus = () => `<g class="abrigo"><rect x="-260" y="-330" width="520" height="22" fill="#5e6670"/><rect x="-250" y="-310" width="12" height="310" fill="#5e6670"/><rect x="238" y="-310" width="12" height="310" fill="#5e6670"/>
    <rect x="-230" y="-300" width="300" height="220" fill="#aac6dc" opacity=".35" stroke="#5e6670" stroke-width="4"/><rect x="-200" y="-120" width="400" height="16" fill="#8d6e4c"/><rect x="-190" y="-104" width="10" height="104" fill="#5e6670"/><rect x="180" y="-104" width="10" height="104" fill="#5e6670"/>
    <rect x="262" y="-420" width="10" height="420" fill="#5e6670"/><circle cx="267" cy="-430" r="34" fill="#2f6fd6" stroke="${T}" stroke-width="4"/>${txt(267, -418, 'Ô', { f: 'Anton', t: 34, a: 'middle' })}</g>`;

  /* avenida vista de lado: calçada ao fundo com a farmácia, pista na frente com carros, ônibus e o caminhão-pipa */
  function avenida(pre, o = {}) {
    let s = EP2.ruaLado(pre, { luz: o.luz || 'dia' });
    s += `<g class="farmacia"><rect x="2500" y="420" width="560" height="460" fill="#e9f2ec"/><rect x="2480" y="400" width="600" height="40" fill="#1e8449"/>
      <rect x="2560" y="460" width="440" height="80" fill="#1e8449"/>${txt(2780, 516, 'FARMÁCIA', { f: 'Anton', t: 54, a: 'middle' })}
      <g transform="translate(3120,420)"><rect x="-40" y="-14" width="80" height="28" fill="#2ecc71"/><rect x="-14" y="-40" width="28" height="80" fill="#2ecc71"/></g>
      <rect x="2560" y="600" width="440" height="280" fill="#7fa8b8" stroke="#5e6670" stroke-width="8"/></g>`;
    s += `<g class="sem" transform="translate(1500,990)">${semaforo()}</g>`;
    const veic = o.veiculos || [[300, 1130, '#c0392b'], [820, 1170, '#7f8c8d'], [1950, 1150, '#ecf0f1'], [2450, 1190, '#2c3e50'], [3500, 1140, '#e0a43a'], [4000, 1180, '#8e5ea2']];
    s += `<g class="onibusA" transform="translate(1250,1160) rotate(-6) scale(1.6)">${EP2.onibus()}</g>`;
    s += `<g class="pipaA" transform="translate(3000,1150) scale(1.15)">${caminhaoPipa()}</g>`;
    s += `<g class="atoresFundo">${o.atoresFundo || ''}</g>`;
    s += veic.map(([x, y, c], i) => `<g class="veic v${i}" transform="translate(${x},${y})">${carroLado(c, i === 2)}</g>`).join('');
    s += `<g class="atoresFrente">${o.atores || ''}</g>`;
    s += `<rect class="av-noite" x="-600" y="-400" width="5600" height="2000" fill="#16223e" opacity="0" style="mix-blend-mode:multiply"/>`;
    return s;
  }
  /* estação: escada de lado subindo para a passarela; estacionamento embaixo (mundo 0..4600) */
  function estacao(pre, o = {}) {
    let s = `<rect x="-600" y="-600" width="5800" height="2200" fill="url(#${pre}-ceuDia)"/>`;
    s += `<g fill="#b9a98f">${Array.from({ length: 14 }, (_, i) => `<rect x="${-400 + i * 380}" y="${560 + (i % 3) * 40}" width="300" height="${330 - (i % 3) * 40}"/>`).join('')}</g>`;
    s += `<rect x="-600" y="880" width="5800" height="700" fill="#8a8e94"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${1800 + i * 240}" y="1000" width="10" height="120" fill="#e8e2c8"/>`).join('')}`;
    s += `<rect x="-600" y="870" width="5800" height="24" fill="#b9b6ad"/>`;
    // escada: de x=300 (chão 990) até x=1500 (plataforma 420)
    let deg = ''; const n = 18;
    for (let i = 0; i < n; i++) { const x = 300 + (i * 1200) / n, y = 990 - (i * 570) / n; deg += `<rect x="${f2(x)}" y="${f2(y - 32)}" width="${f2(1200 / n + 2)}" height="32" fill="#9aa1a6" stroke="#6b7179" stroke-width="2"/>`; }
    s += `<polygon points="300,990 1500,420 1500,1000 300,1000" fill="#7d858c"/>${deg}`;
    s += `<line x1="300" y1="890" x2="1500" y2="320" stroke="#4d5866" stroke-width="10"/>`;
    for (let i = 0; i <= 12; i++) { const x = 300 + i * 100, y = 990 - i * 47.5; s += `<line x1="${x}" y1="${y - 32}" x2="${x}" y2="${y - 100}" stroke="#4d5866" stroke-width="5"/>`; }
    // passarela
    s += `<rect x="1500" y="420" width="3400" height="40" fill="#7d858c" stroke="#4d5866" stroke-width="5"/><rect x="1500" y="460" width="3400" height="40" fill="#5e6670"/>`;
    for (let x = 1500; x <= 4900; x += 30) s += `<line x1="${x}" y1="420" x2="${x}" y2="300" stroke="#4d5866" stroke-width="4" opacity=".8"/>`;
    s += `<rect x="1500" y="292" width="3400" height="12" fill="#4d5866"/>`;
    s += `<g class="placas">${[2600, 2780, 2960, 3140].map((x) => `<rect x="${x}" y="300" width="170" height="120" fill="#95a5a6" stroke="#4d5866" stroke-width="5"/>`).join('')}</g>`;
    s += `<rect x="2000" y="500" width="40" height="490" fill="#5e6670"/><rect x="3600" y="500" width="40" height="490" fill="#5e6670"/>`;
    s += `<rect x="600" y="140" width="520" height="70" fill="#2f6fd6"/>${txt(860, 192, 'ESTAÇÃO', { f: 'Anton', t: 50, a: 'middle' })}`;
    s += `<g class="est-atores">${o.atores || ''}</g>`;
    s += `<polygon class="est-varre" points="0,0 0,0 0,0" fill="url(#${pre}-feixeA)" opacity="0" style="mix-blend-mode:screen"/>`;
    return s;
  }
  /* vista do alto do bairro */
  function panorama(pre) {
    let s = `<rect x="-600" y="-600" width="3200" height="2200" fill="url(#${pre}-ceuDia)"/>`;
    for (let r = 0; r < 5; r++) for (let i = 0; i < 16; i++) { const x = -300 + i * 170 + (r % 2) * 80, y = 520 + r * 110, w = 120 + rand(i + r * 16) * 40, c = ['#c9a98f', '#b98f6f', '#d6c3a8', '#a8836a'][(i + r) % 4];
      s += `<polygon points="${f2(x)},${y} ${f2(x + w / 2)},${y - 40} ${f2(x + w)},${y}" fill="#7a5c4a"/><rect x="${f2(x)}" y="${y}" width="${f2(w)}" height="70" fill="${c}"/>${rand(i * 3 + r) > 0.7 ? `<line x1="${f2(x + w / 2)}" y1="${y - 40}" x2="${f2(x + w / 2)}" y2="${y - 100}" stroke="#4d5866" stroke-width="4"/><line x1="${f2(x + w / 2 - 20)}" y1="${y - 86}" x2="${f2(x + w / 2 + 20)}" y2="${y - 86}" stroke="#4d5866" stroke-width="4"/>` : ''}`; }
    s += `<g class="escolaLonge" transform="translate(1500,470)"><rect x="-150" y="-60" width="300" height="80" fill="#e5d6bd" stroke="#7a5c4a" stroke-width="4"/><rect x="-170" y="-80" width="340" height="24" fill="#c0392b"/><rect x="-40" y="-120" width="80" height="40" fill="#f4f1ea"/>${txt(0, -90, 'ESCOLA', { f: 'Anton', t: 22, c: '#7a3a1a', a: 'middle' })}</g>`;
    return s;
  }
  /* escola por fora (muro, portão com corrente, seta de papelão, entrada da quadra) — mundo 0..4400 */
  function escolaFora(pre, o = {}) {
    let s = `<rect x="-600" y="-600" width="5600" height="2200" fill="url(#${pre}-ceu${o.tarde ? 'Tarde' : 'Dia'})"/>`;
    s += `<rect x="200" y="200" width="2200" height="460" fill="#e5d6bd"/><rect x="180" y="180" width="2240" height="36" fill="#c0392b"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${280 + i * 260}" y="280" width="160" height="120" fill="#a7c6dc" stroke="#f4f1ea" stroke-width="8"/>`).join('')}
      <rect x="900" y="100" width="800" height="80" fill="#f4f1ea" stroke="#7a5c4a" stroke-width="4"/>${txt(1300, 156, 'ESCOLA MUNICIPAL', { f: 'Anton', t: 50, c: '#7a3a1a', a: 'middle' })}`;
    s += `<rect x="-600" y="620" width="5600" height="260" fill="#d9c7aa"/><rect x="-600" y="600" width="5600" height="30" fill="#b9a98f"/>`;
    s += `<g class="portao"><rect x="1000" y="580" width="560" height="300" fill="none" stroke="#3a3f48" stroke-width="12"/>${Array.from({ length: 14 }, (_, i) => `<line x1="${1020 + i * 40}" y1="590" x2="${1020 + i * 40}" y2="870" stroke="#3a3f48" stroke-width="7"/>`).join('')}
      <path class="corrente" d="M1255,700 q12,20 24,0 q12,20 24,0" fill="none" stroke="#9aa1a6" stroke-width="9"/><rect x="1262" y="704" width="34" height="40" rx="6" fill="#9aa1a6" stroke="${T}" stroke-width="3"/></g>`;
    s += `<g class="papelao" transform="translate(1800,700) rotate(-4)"><rect x="-150" y="-70" width="300" height="140" fill="#c9a06a" stroke="#8a6a3f" stroke-width="5"/>${txt(0, -14, 'ENTRADA PELA', { f: 'Anton', t: 30, c: '#3a2410', a: 'middle' })}${txt(0, 30, 'QUADRA  →', { f: 'Anton', t: 34, c: '#3a2410', a: 'middle' })}</g>`;
    // lateral: grade da quadra (2600..4200), com a quadra lá dentro
    s += `<clipPath id="${pre}-grade"><rect x="2600" y="360" width="1600" height="520"/></clipPath><g clip-path="url(#${pre}-grade)">
      <rect x="2600" y="360" width="1600" height="520" fill="#6aa0c8"/><rect x="2600" y="700" width="1600" height="180" fill="#4f8a6a"/><line x1="2600" y1="760" x2="4200" y2="760" stroke="#fff" stroke-width="5"/>
      <line x1="3000" y1="540" x2="3700" y2="540" stroke="#141414" stroke-width="5"/>${[3060, 3160, 3260, 3380, 3500, 3600].map((x, i) => `<rect x="${x}" y="545" width="60" height="70" fill="${['#e74c3c', '#f1c40f', '#3498db', '#ecf0f1', '#9b59b6', '#2ecc71'][i]}"/>`).join('')}
      <line x1="3000" y1="540" x2="3000" y2="760" stroke="#141414" stroke-width="6"/><line x1="3700" y1="540" x2="3700" y2="760" stroke="#141414" stroke-width="6"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${2700 + i * 300}" y="820" width="220" height="40" rx="10" fill="${['#2980b9', '#16a085', '#e67e22', '#8e44ad'][i]}"/>`).join('')}
      <rect x="3800" y="660" width="260" height="20" fill="#8d6e4c"/>${[3830, 3900, 3980].map((x) => `<rect x="${x}" y="620" width="50" height="40" rx="6" fill="#7f8c8d" stroke="${T}" stroke-width="3"/>`).join('')}
      <g class="dentroAtores">${o.dentro || ''}</g></g>`;
    s += `<g>${Array.from({ length: 41 }, (_, i) => `<line x1="${2600 + i * 40}" y1="360" x2="${2600 + i * 40}" y2="880" stroke="#3a3f48" stroke-width="4"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<line x1="2600" y1="${360 + i * 40}" x2="4200" y2="${360 + i * 40}" stroke="#3a3f48" stroke-width="3"/>`).join('')}</g>`;
    s += `<rect class="portaoQuadra" x="3500" y="560" width="240" height="320" fill="#3a3f48" opacity=".9"/>`;
    s += `<rect x="-600" y="870" width="5600" height="120" fill="#c9c5bb"/><rect x="-600" y="985" width="5600" height="600" fill="#7c8088"/>`;
    s += `<g class="ef-atores">${o.atores || ''}</g>`;
    return s;
  }
  /* quadra por dentro: cadastro, parede de nomes, enfermaria, cozinha (mundo 0..5600; pés y=990) */
  function quadra(pre, o = {}) {
    let s = `<rect x="-600" y="-600" width="6800" height="1480" fill="#d9d2c0"/><rect x="-600" y="-600" width="6800" height="300" fill="#b9b1a0"/>`;
    for (let x = -600; x < 6200; x += 400) s += `<line x1="${x}" y1="-300" x2="${x + 200}" y2="80" stroke="#a49c8a" stroke-width="10"/>`;
    s += `<rect x="-600" y="880" width="6800" height="700" fill="#4f8a6a"/><line x1="-600" y1="940" x2="6200" y2="940" stroke="#fff" stroke-width="6"/><line x1="2800" y1="880" x2="2800" y2="1580" stroke="#fff" stroke-width="6"/>`;
    // rede de vôlei com roupas
    s += `<g class="rede"><line x1="2200" y1="430" x2="3400" y2="430" stroke="#141414" stroke-width="5"/>${Array.from({ length: 13 }, (_, i) => `<line x1="${2200 + i * 100}" y1="430" x2="${2200 + i * 100}" y2="520" stroke="#141414" stroke-width="2" opacity=".5"/>`).join('')}
      ${[2280, 2420, 2580, 2760, 2940, 3100, 3260].map((x, i) => `<rect x="${x}" y="436" width="${70 + (i % 3) * 20}" height="${80 + (i % 2) * 30}" fill="${['#e74c3c', '#f1c40f', '#3498db', '#ecf0f1', '#9b59b6', '#2ecc71', '#e67e22'][i]}" opacity=".9"/>`).join('')}
      <line x1="2200" y1="400" x2="2200" y2="990" stroke="#5e6670" stroke-width="10"/><line x1="3400" y1="400" x2="3400" y2="990" stroke="#5e6670" stroke-width="10"/></g>`;
    // cadastro (mesa da Helena) e parede de folhas
    s += `<g class="paredeNomes">${Array.from({ length: 40 }, (_, i) => { const x = 60 + (i % 10) * 92, y = 220 + Math.floor(i / 10) * 120, r = (rand(i) - 0.5) * 8;
        return `<g transform="translate(${x},${y}) rotate(${f2(r)})"><rect x="-38" y="-48" width="76" height="96" fill="#fbf8f1" stroke="#a49c8a" stroke-width="2"/>${i % 3 === 0 ? `<rect x="-24" y="-38" width="48" height="40" fill="#b8c4cf"/><circle cx="0" cy="-22" r="10" fill="#fff" stroke="${T}" stroke-width="2"/>` : ''}<line x1="-28" y1="14" x2="28" y2="14" stroke="#7f8c8d" stroke-width="3"/><line x1="-28" y1="26" x2="18" y2="26" stroke="#7f8c8d" stroke-width="3"/></g>`; }).join('')}</g>`;
    s += `<g class="fotoAlvo" transform="translate(560,460)"><rect x="-60" y="-75" width="120" height="150" fill="#fbf8f1" stroke="#c0392b" stroke-width="4"/><rect x="-44" y="-60" width="88" height="70" fill="#b8c4cf"/><circle cx="0" cy="-30" r="18" fill="#fff" stroke="${T}" stroke-width="3"/>${[20, 36, 52].map((y) => `<line x1="-44" y1="${y}" x2="44" y2="${y}" stroke="#7f8c8d" stroke-width="4"/>`).join('')}</g>`;
    s += `<g class="mesaCadastro"><rect x="1150" y="760" width="560" height="20" fill="#8d6e4c" stroke="#5a4636" stroke-width="3"/><rect x="1170" y="780" width="14" height="200" fill="#6b5236"/><rect x="1676" y="780" width="14" height="200" fill="#6b5236"/>
      ${[1200, 1290, 1380].map((x) => `<rect x="${x}" y="726" width="70" height="34" fill="#fbf8f1" stroke="#7f8c8d" stroke-width="2"/>`).join('')}<rect x="1480" y="716" width="40" height="44" rx="6" fill="#e67e22"/><rect x="1560" y="716" width="40" height="44" rx="6" fill="#2980b9"/></g>`;
    // colchonetes e enfermaria (3500..4300)
    s += [0, 1, 2, 3, 4].map((i) => `<rect x="${3500 + i * 0 }" y="${950 + i * 0}" width="0" height="0"/>`).join('');
    s += `<g class="colchonetes">${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${1900 + i * 230}" y="950" width="200" height="34" rx="10" fill="${['#2980b9', '#16a085', '#e67e22', '#8e44ad', '#2c3e50', '#c0392b'][i]}" stroke="${T}" stroke-width="3"/>`).join('')}</g>`;
    s += `<g class="enfermaria"><rect x="3700" y="420" width="240" height="460" fill="#ecf0f1" stroke="#95a5a6" stroke-width="5"/><g transform="translate(3820,500)"><rect x="-40" y="-12" width="80" height="24" fill="#e74c3c"/><rect x="-12" y="-40" width="24" height="80" fill="#e74c3c"/></g>
      <g class="cadeira" transform="translate(4080,990)"><rect x="-50" y="-140" width="100" height="16" fill="#5e6670"/><rect x="-46" y="-124" width="8" height="124" fill="#5e6670"/><rect x="38" y="-124" width="8" height="124" fill="#5e6670"/><rect x="38" y="-300" width="10" height="176" fill="#5e6670"/></g>
      <g class="energia" transform="translate(4350,980)"><rect x="-70" y="-110" width="140" height="110" rx="12" fill="#2c3e50" stroke="${T}" stroke-width="4"/><rect x="-50" y="-90" width="60" height="26" fill="#58d68d"/><circle cx="40" cy="-70" r="8" fill="#e74c3c"/>${txt(0, -26, 'ENERGIA', { f: 'Anton', t: 20, a: 'middle' })}</g>
      <path d="M4420,960 C4480,940 4520,1000 4600,980" fill="none" stroke="#141414" stroke-width="5"/></g>`;
    // cozinha (4700..5500)
    s += `<g class="cozinhaE"><rect x="4700" y="760" width="760" height="22" fill="#8d6e4c" stroke="#5a4636" stroke-width="3"/><rect x="4720" y="782" width="14" height="200" fill="#6b5236"/><rect x="5426" y="782" width="14" height="200" fill="#6b5236"/>
      <g class="panela" transform="translate(4900,760)"><rect x="-90" y="-100" width="180" height="100" rx="12" fill="#95a5a6" stroke="${T}" stroke-width="5"/><rect x="-104" y="-104" width="208" height="16" rx="6" fill="#7f8c8d" stroke="${T}" stroke-width="4"/></g>
      <g class="vapor" opacity=".6">${[0, 1, 2].map((i) => `<path class="vp${i}" d="M${4860 + i * 40},640 q-10,-24 0,-48 q10,-24 0,-48" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>
      ${[5100, 5180, 5260].map((x) => `<rect x="${x}" y="722" width="44" height="38" rx="6" fill="#ecf0f1" stroke="${T}" stroke-width="3"/>`).join('')}
      <rect x="5000" y="300" width="400" height="60" fill="#e67e22"/>${txt(5200, 344, 'COZINHA', { f: 'Anton', t: 40, a: 'middle' })}</g>`;
    s += `<g class="banco" transform="translate(5650,990)"><rect x="-150" y="-110" width="300" height="20" fill="#8d6e4c"/><rect x="-140" y="-90" width="10" height="90" fill="#6b5236"/><rect x="130" y="-90" width="10" height="90" fill="#6b5236"/></g>`;
    s += `<g class="q-atores">${o.atores || ''}</g>`;
    s += `<rect class="q-noite" x="-600" y="-600" width="6800" height="2200" fill="#16223e" opacity="0" style="mix-blend-mode:multiply"/>`;
    s += `<ellipse class="q-luz" cx="1400" cy="700" rx="700" ry="400" fill="url(#${pre}-glowQ)" opacity="0" style="mix-blend-mode:screen"/>`;
    return s;
  }
  /* área de serviço: torneira, baldes, reservatório, bancada (mundo 0..3600) */
  function servico(pre, o = {}) {
    let s = `<rect x="-600" y="-600" width="4800" height="1480" fill="#cfd8dc"/>`;
    for (let y = -600; y < 880; y += 60) s += `<line x1="-600" y1="${y}" x2="4200" y2="${y}" stroke="#b0bec5" stroke-width="2"/>`;
    for (let x = -600; x < 4200; x += 60) s += `<line x1="${x}" y1="-600" x2="${x}" y2="880" stroke="#b0bec5" stroke-width="2"/>`;
    s += `<rect x="-600" y="880" width="4800" height="700" fill="#90a4ae"/>`;
    s += `<g class="tanqueTorn"><rect x="400" y="660" width="360" height="220" fill="#b0bec5" stroke="#607d8b" stroke-width="5"/><path d="M580,560 L580,520 Q580,500 610,500 L630,500 L630,540" fill="none" stroke="#78909c" stroke-width="14" stroke-linecap="round"/>
      <path class="fio" d="M630,548 L630,${o.balde ? 800 : 660}" stroke="#bfe3ff" stroke-width="5" stroke-linecap="round" opacity="0"/></g>`;
    s += `<g class="baldes">${[0, 1].map((i) => `<g class="balde bd${i}" transform="translate(${560 + i * 160},880)"><path d="M-50,-110 L50,-110 L40,0 L-40,0 Z" fill="#2980b9" stroke="${T}" stroke-width="5"/><path d="M-50,-110 Q0,-170 50,-110" fill="none" stroke="${T}" stroke-width="4"/><rect class="agua" x="-44" y="-30" width="88" height="30" fill="#bfe3ff" opacity=".8"/></g>`).join('')}</g>`;
    s += `<g class="reservatorio"><rect x="1300" y="200" width="620" height="680" rx="40" fill="#455a64" stroke="${T}" stroke-width="7"/><rect x="1330" y="230" width="60" height="620" fill="#263238"/>
      <rect class="nivel" x="1334" y="700" width="52" height="146" fill="#4fc3f7"/>
      <line class="marca1" x1="1300" y1="700" x2="1420" y2="700" stroke="#f1c40f" stroke-width="7"/><line class="marca2" x1="1300" y1="560" x2="1420" y2="560" stroke="#e74c3c" stroke-width="7"/>
      ${txt(1620, 300, 'RESERVATÓRIO', { f: 'Anton', t: 40, c: '#cfd8dc', a: 'middle' })}</g>`;
    s += `<g class="bancada"><rect x="2300" y="740" width="900" height="26" fill="#8d6e4c" stroke="#5a4636" stroke-width="3"/><rect x="2320" y="766" width="16" height="214" fill="#6b5236"/><rect x="3164" y="766" width="16" height="214" fill="#6b5236"/>
      <g transform="translate(2750,736)"><rect x="-260" y="-14" width="520" height="14" fill="#f3ead2" stroke="#c9b98f" stroke-width="3"/></g></g>`;
    s += `<g class="sv-atores">${o.atores || ''}</g>`;
    s += `<ellipse class="sv-lant" cx="2750" cy="700" rx="600" ry="380" fill="url(#${pre}-glowQ)" opacity="0" style="mix-blend-mode:screen"/>`;
    s += `<rect class="sv-tarde" x="-600" y="-600" width="4800" height="2200" fill="#f0a060" opacity="0" style="mix-blend-mode:multiply"/>`;
    return s;
  }
  /* mapa do EP3: camadas que cada cena liga */
  function mapa3(pre) {
    let s = `<rect x="-200" y="-200" width="2320" height="1480" fill="#7a4b2c"/><g transform="rotate(-2 960 540)"><rect x="200" y="90" width="1520" height="900" fill="#f3ead2" stroke="#c9b98f" stroke-width="6"/>`;
    for (let x = 260; x < 1700; x += 120) s += `<line x1="${x}" y1="100" x2="${x + 30}" y2="980" stroke="#e2d4b0" stroke-width="10"/>`;
    for (let y = 150; y < 980; y += 110) s += `<line x1="210" y1="${y}" x2="1710" y2="${y + 20}" stroke="#e2d4b0" stroke-width="10"/>`;
    s += `<path d="M210,560 L1710,600" stroke="#e8b84a" stroke-width="34"/>${txt(760, 548, 'AVENIDA', { f: 'Anton', t: 28, c: '#8a6a2a', a: 'middle' })}
      <rect x="1080" y="470" width="110" height="200" fill="#c9d3df" stroke="#5e6670" stroke-width="4"/>${txt(1135, 460, 'ESTAÇÃO', { f: 'Anton', t: 24, c: '#2b2e34', a: 'middle' })}
      <line x1="1135" y1="470" x2="1135" y2="680" stroke="#5e6670" stroke-width="10" stroke-dasharray="14 8"/>
      <g transform="translate(420,820)"><path d="M-30,10 L0,-24 L30,10 L30,40 L-30,40 Z" fill="#2f6fd6" stroke="${T}" stroke-width="4"/>${txt(0, 80, 'CASA', { f: 'Anton', t: 28, c: '#141414', a: 'middle' })}</g>
      <g transform="translate(1500,240)"><rect x="-40" y="-20" width="80" height="56" fill="#e5484d" stroke="${T}" stroke-width="4"/><polygon points="-50,-20 0,-56 50,-20" fill="#c0392b" stroke="${T}" stroke-width="4"/>${txt(0, 76, 'ESCOLA', { f: 'Anton', t: 28, c: '#141414', a: 'middle' })}</g>
      <path class="rota1" d="M450,790 L560,700 L700,690 L860,640 L1000,590 L1160,560 L1260,430 L1400,360 L1480,290" stroke="#d6262f" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="20 14" opacity=".55"/>
      <path class="rota2" d="M450,790 L620,760 L800,760 L960,720 L1100,690 L1135,600 L1135,480 L1220,420 L1400,360 L1480,290" stroke="#1e6fd6" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1600" stroke-dashoffset="1600"/>
      <g class="mCaminhao" opacity="0" transform="translate(940,610)"><rect x="-44" y="-26" width="64" height="40" rx="14" fill="#fff" stroke="${T}" stroke-width="4"/><rect x="-44" y="-12" width="64" height="10" fill="#2f6fd6"/><rect x="20" y="-22" width="28" height="36" fill="#fff" stroke="${T}" stroke-width="4"/>
        <circle cx="0" cy="0" r="62" fill="none" stroke="#d6262f" stroke-width="7"/></g>
      <g class="mMaquina" opacity="0" transform="translate(1000,560)"><circle r="40" fill="${COR.alien}" opacity=".35"/><circle r="20" fill="#1c212d" stroke="${T}" stroke-width="4"/><circle r="8" fill="${COR.alienForte}"/></g>
      <g class="mCarros" opacity="0">${[[860, 590], [1010, 620], [1060, 575], [900, 625]].map(([x, y]) => `<rect x="${x - 18}" y="${y - 10}" width="36" height="20" fill="none" stroke="#141414" stroke-width="4"/>`).join('')}</g>
      <text class="mHora" x="1640" y="960" text-anchor="end" font-family="Anton" font-size="44" fill="#d6262f" opacity="0">AMANHÃ · 1ª LUZ</text></g>`;
    return s;
  }
  /* cabine do caminhão à noite (close) */
  function cabine(pre) {
    return `<rect x="-400" y="-400" width="2720" height="1880" fill="#0b1020"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${f2(rand(i) * 1920)}" cy="${f2(rand(i + 9) * 300)}" r="2" fill="#fff" opacity=".5"/>`).join('')}
      <rect x="-400" y="780" width="2720" height="700" fill="#141a26"/>
      <g transform="translate(700,1000) scale(2.2)">${caminhaoPipa()}</g>
      <rect x="-400" y="-400" width="2720" height="1880" fill="#16223e" opacity=".6" style="mix-blend-mode:multiply"/>
      <g class="maoVidro" opacity="0"><circle r="34" fill="#141414"/></g>
      <ellipse class="luzBaixo" cx="560" cy="1000" rx="700" ry="90" fill="url(#${pre}-glowA)" opacity="0"/>`;
  }
  window.EP3 = { ELENCO, ESCALA, ator, figurante, carroLado, caminhaoPipa, abrigoOnibus, avenida, estacao, panorama, escolaFora, quadra, servico, mapa3, cabine };
})();

/* ajudantes de cena do EP3 */
(function () {
  const pose = (...ps) => Object.assign({}, ...ps);
  window.H3 = {
    pose,
    ANDA: (t, v = 7, a = 1) => B.andar(t * v, a),
    SC: { q: [84, 88], j: [86, 90], chao: 0, alt: 40, o: [10, 30], c: [40, 50] },
    SCH: { q: [70, 80], j: [40, 60], chao: 0, alt: 102, lean: -6, o: [-20, 40], c: [20, 60] },
    AG: B.POSES.agachado,
    DEIT: { rot: -90, chao: 0, alt: 40, q: [6, -4], j: [10, 20], o: [150, 170], c: [10, 20], ab: 0.1 },
    APONTA: { o: [-6, 98], c: [10, -8] },
    fala: (t, a, b) => (t > a && t < b ? 0.35 + 0.45 * Math.abs(Math.sin(t * 13)) : 0),
    pisca: (t, k = 1) => (Math.sin(t * 1.3 * k + k) > 0.985 ? 0.1 : 1),
    elenco: (nomes, extras = {}) => nomes.map((n) => { const [nome, id] = n.split(':'); return EP3.ator(nome, id || nome, extras[id || nome] || {}); }).join(''),
    p: (P, id, nome, ps) => { const g = P.q('#' + id); if (g) B.posar(g, Object.assign({ s: 2 * (EP3.ESCALA[nome] || 1) }, ps)); },
    ent: (t, a, b) => K.E.io(K.prog(t, a, b)),
  };
})();

/* tempos das frases */
window.TEMPOS = {"c01": {"frases": [[0.5, 3.02, "Você passa a noite esperando o amanhecer."], [3.46, 8.48, "Mas, quando a claridade aparece na janela, sair de casa parece uma ideia muito pior."], [8.92, 12.55, "No rádio, a transmissão da escola volta por alguns segundos."], [12.99, 18.93, "Você escuta o endereço. A entrada pela quadra. Um pedido para levar cobertores e recipientes vazios."], [19.37, 20.56, "Depois, só chiado."], [21.0, 24.63, "Sua irmã coloca uma garrafa na sua bolsa e fica com a outra."], [25.07, 32.11, "Desde o mercado, vocês decidiram dividir os suprimentos. Se alguém perder uma mochila, o outro ainda terá alguma coisa."], [32.55, 34.03, "Você confere o celular."], [34.47, 35.2, "Sem sinal."], [35.64, 37.47, "Mesmo assim, guarda no bolso."], [37.91, 44.03, "Antes de sair, sua irmã pega uma fotografia presa na geladeira e coloca entre as páginas de um caderno."], [44.47, 48.5, "Você finge que não percebe o tempo que ela leva para fechar a capa."]], "dur": 50.14}, "c02": {"frases": [[0.5, 1.81, "Você tranca a porta."], [2.25, 4.48, "Depois, testa a maçaneta duas vezes."], [4.92, 10.23, "Ainda existe uma parte de você preocupada com alguém entrando na casa enquanto está fora."], [10.67, 13.83, "Na calçada, sua irmã pergunta se você trouxe o mapa."], [14.27, 15.52, "Você bate no bolso."], [15.96, 17.5, "Ela pergunta das pilhas."], [17.94, 19.25, "Você mostra a bolsa."], [19.69, 23.14, "Quando pergunta se você está pronto, você começa a andar."], [23.58, 25.82, "É a única resposta que consegue dar."], [26.26, 28.32, "A escola fica a seis quilômetros."], [28.76, 31.11, "Você já fez esse caminho muitas vezes."], [31.55, 36.28, "Só nunca precisou prestar atenção em quantos lugares existiam para se esconder."]], "dur": 37.92}, "c03": {"frases": [[0.5, 3.43, "Na avenida, você encontra um ônibus atravessado."], [3.87, 7.44, "A porta está aberta. Uma bolsa continua no banco da frente."], [7.88, 10.81, "O sinal de trânsito apagado balança com o vento."], [11.25, 16.79, "Você procura uma passagem entre os carros e vê um caminhão-pipa parado perto de uma farmácia."], [17.23, 20.56, "Por um instante, pensa em verificar se existe água ali."], [21.0, 22.77, "Então escuta metal raspando."], [23.21, 24.87, "Sua irmã segura seu braço."], [25.31, 28.18, "Entre os veículos, uma máquina se move devagar."], [28.62, 33.46, "Ela para ao lado de um carro, inclina o corpo e passa uma luz azul pelas janelas."], [33.9, 36.2, "Você se abaixa antes que ela termine."], [36.64, 39.05, "A escola está do outro lado da avenida."], [39.49, 42.82, "A rota alternativa passa pela estação e pela passarela."], [43.26, 46.71, "É mais longe. Tem escadas. Vocês não sabem se está livre."], [47.15, 49.39, "Mas você sabe o que está na avenida."], [49.83, 54.5, "Marca o caminhão no mapa, dobra o papel e acompanha sua irmã pela rua lateral."]], "dur": 56.14}, "c04": {"frases": [[0.5, 3.55, "Você quase grita quando alguém aparece na esquina."], [3.99, 6.45, "O rapaz à sua frente quase grita também."], [6.89, 12.84, "Por um segundo, vocês ficam parados, apontando um para o outro como se isso resolvesse alguma coisa."], [13.28, 15.28, "Ele é o primeiro a baixar a mão."], [15.72, 16.91, "O nome dele é Léo."], [17.35, 20.86, "Você reconhece a mochila de entregas amarrada à bicicleta."], [21.3, 24.17, "Ele pergunta se vocês estão indo para a escola."], [24.61, 26.85, "Você confirma, mas mantém distância."], [27.29, 29.64, "Léo olha para o mapa e aponta uma rua."], [30.08, 36.66, "Diz que a entrada principal da estação está bloqueada. Existe uma passagem pelo estacionamento de funcionários."], [37.1, 38.87, "Você pergunta como ele sabe."], [39.31, 41.78, "Ele levanta a bicicleta com dificuldade."], [42.22, 44.63, "\"Porque eu já tentei o caminho errado.\""], [45.07, 47.19, "A roda não vai aguentar o trajeto."], [47.63, 50.91, "Você espera enquanto ele tira o que consegue carregar."], [51.35, 55.9, "Léo deixa a bicicleta encostada no muro, mas leva a luz removível do guidão."], [56.34, 58.34, "Antes de seguir, olha para trás."], [58.78, 60.79, "Você reconhece aquela expressão."], [61.23, 63.23, "Deixou a mesma na porta de casa."]], "dur": 64.87}, "c05": {"frases": [[0.5, 3.78, "Na escada da estação, você encontra mais duas pessoas."], [4.22, 6.57, "O homem tenta subir um carrinho cheio."], [7.01, 8.95, "Cada degrau produz uma pancada."], [9.39, 11.4, "Você olha na direção da avenida."], [11.84, 13.32, "O som está alto demais."], [13.76, 15.47, "Sua irmã pede que ele pare."], [15.91, 18.09, "Ele responde sem soltar o carrinho."], [18.53, 21.46, "Ali estão a comida, a água e as roupas da filha."], [21.9, 23.44, "Você olha para a menina."], [23.88, 29.36, "Ela segura um cobertor dobrado com tanto cuidado que parece estar carregando algo quebrável."], [29.8, 31.23, "O homem se chama Davi."], [31.67, 32.63, "A menina, Bia."], [33.07, 36.98, "Você segura a parte da frente do carrinho. Léo pega o outro lado."], [37.42, 40.01, "Na primeira tentativa, ele sobe um degrau."], [40.45, 42.62, "Na segunda, uma das rodas se dobra."], [43.06, 44.49, "Na terceira, se solta."], [44.93, 47.28, "Você espera ouvir a máquina responder."], [47.72, 49.66, "Só escuta a própria respiração."], [50.1, 53.9, "Bia se agacha e segura a roda antes que ela role escada abaixo."], [54.34, 56.87, "Ninguém precisa pedir silêncio outra vez."]], "dur": 58.51}, "c06": {"frases": [[0.5, 2.85, "Você ajuda Davi a esvaziar o carrinho."], [3.29, 6.4, "Agora, tudo precisa caber nas mochilas ou nas mãos."], [6.84, 9.07, "Um cobertor fica. Uma panela também."], [9.51, 13.54, "Davi pega um álbum de fotografias, abre na primeira página e fecha."], [13.98, 15.87, "Você abre espaço na sua bolsa."], [16.31, 18.43, "Ele demora um pouco para entregar."], [18.87, 20.41, "Bia aponta para o galão."], [20.85, 24.19, "Vocês enchem as garrafas menores, mas ainda sobra água."], [24.63, 27.32, "Você tenta erguer o galão junto com a bolsa."], [27.76, 29.36, "Consegue dar três passos."], [29.8, 30.88, "Devolve ao chão."], [31.32, 35.58, "Léo encontra uma caneta no bolso e escreve num pedaço de papel: \"ÁGUA\"."], [36.02, 39.3, "Vocês deixam o recipiente à sombra, ao lado da escada."], [39.74, 42.5, "Você não sabe quem vai passar por ali depois."], [42.94, 44.94, "Mas torce para que alguém passe."]], "dur": 46.58}, "c07": {"frases": [[0.5, 4.3, "No alto da passarela, você finalmente enxerga o bairro inteiro."], [4.74, 6.74, "Telhados. Antenas. Ruas paradas."], [7.18, 8.43, "Ao longe, a escola."], [8.87, 12.5, "Você está prestes a apontar quando Bia puxa a camisa do pai."], [12.94, 15.64, "Ela viu uma luz se movendo debaixo de vocês."], [16.08, 17.85, "Você acompanha o olhar dela."], [18.29, 19.95, "A máquina saiu da avenida."], [20.39, 23.43, "Agora, está entrando no estacionamento da estação."], [23.87, 25.99, "Você se agacha atrás de uma placa."], [26.43, 28.03, "Davi puxa Bia para perto."], [28.47, 31.81, "Um feixe azul percorre a escada por onde vocês subiram."], [32.25, 34.02, "Para no carrinho abandonado."], [34.46, 35.88, "Depois, sobe um pouco."], [36.32, 40.35, "Você segura a bolsa contra o corpo para impedir que as latas batam."], [40.79, 42.22, "A máquina fica imóvel."], [42.66, 48.72, "Você não sabe se está ouvindo, procurando movimento ou fazendo alguma coisa que nem consegue imaginar."], [49.16, 51.56, "Só sabe que ninguém ali quer descobrir."], [52.0, 55.17, "Quando o som começa a se afastar, você ainda espera."], [55.61, 58.6, "Léo levanta primeiro, só o suficiente para olhar."], [59.04, 59.94, "Faz um sinal."], [60.38, 62.27, "Vocês continuam sem conversar."]], "dur": 63.91}, "c08": {"frases": [[0.5, 4.18, "Você só percebe a dor no ombro quando coloca a bolsa no chão."], [4.62, 7.44, "Sua irmã tira uma pedrinha de dentro do tênis."], [7.88, 9.94, "Léo divide um pacote de bolachas."], [10.38, 13.89, "Bia recebe duas, olha para o pai e devolve uma à mão dele."], [14.33, 17.32, "Você vira o rosto antes que Davi perceba que viu."], [17.76, 22.95, "Enquanto descansam, você pergunta se alguém sabe alguma coisa sobre as pessoas levadas."], [23.39, 25.22, "Ninguém responde de imediato."], [25.66, 29.86, "Depois, Bia pergunta se a mãe também pode estar procurando uma escola."], [30.3, 31.49, "Davi diz que pode."], [31.93, 36.26, "Você percebe que ele escolhe uma resposta que consegue dizer sem mentir."], [36.7, 39.57, "Sua irmã aperta a fotografia dentro do caderno."], [40.01, 41.78, "Você não faz mais perguntas."]], "dur": 43.42}, "c09": {"frases": [[0.5, 3.84, "Quando chega à escola, você encontra o portão trancado."], [4.28, 5.64, "Puxa a grade uma vez."], [6.08, 6.52, "Nada."], [6.96, 13.14, "Por alguns segundos, o rádio, o mapa e todo aquele caminho parecem ter levado vocês a uma porta fechada."], [13.58, 16.51, "Então Léo encontra uma seta pintada num papelão."], [16.95, 18.26, "Entrada pela quadra."], [18.7, 20.93, "Você contorna o muro e escuta vozes."], [21.37, 23.03, "Não saindo de um aparelho."], [23.47, 26.28, "Vozes conversando, discutindo, chamando nomes."], [26.72, 28.96, "Você olha por uma abertura na grade."], [29.4, 31.86, "Há roupas penduradas numa rede de vôlei."], [32.3, 33.9, "Panelas junto a uma mesa."], [34.34, 36.17, "Gente deitada em colchonetes."], [36.61, 40.82, "Uma mulher vem até o portão e pergunta quantas pessoas estão com você."], [41.26, 43.55, "Você conta, mesmo sabendo a resposta."], [43.99, 44.6, "\"Cinco.\""], [45.04, 49.36, "Só quando ela abre é que você percebe que estava esperando algum truque."]], "dur": 51.0}, "c10": {"frases": [[0.5, 2.62, "A mulher se apresenta como Helena."], [3.06, 4.89, "Ela dava aula naquela escola."], [5.33, 12.49, "Agora, anota quem chega, organiza onde cada um dorme e tenta responder perguntas para as quais ninguém preparou uma aula."], [12.93, 14.12, "Você diz seu nome."], [14.56, 15.81, "O nome da sua irmã."], [16.25, 17.27, "De onde vieram."], [17.71, 21.28, "Helena pergunta se vocês viram outras pessoas pelo caminho."], [21.72, 25.69, "Você conta sobre a avenida, a máquina e a água deixada na estação."], [26.13, 27.15, "Ela anota tudo."], [27.59, 30.58, "Atrás dela, você vê uma parede coberta de folhas."], [31.02, 34.7, "Nomes. Descrições. Telefones que talvez nunca voltem a tocar."], [35.14, 37.55, "Sua irmã para diante de uma fotografia."], [37.99, 39.59, "Você espera ao lado dela."], [40.03, 42.15, "Não é quem vocês estão procurando."], [42.59, 44.59, "Mesmo assim, ela lê até o final."]], "dur": 46.23}, "c11": {"frases": [[0.5, 3.72, "Uma enfermeira chamada Rosa verifica o braço de Davi."], [4.16, 5.64, "Ele diz que não é nada."], [6.08, 7.74, "Ela aponta para a cadeira."], [8.18, 11.46, "Você vê que ele obedece antes que ela precise repetir."], [11.9, 16.74, "Sua irmã encontra um espaço entre dois colchonetes e encosta a mochila na parede."], [17.18, 18.6, "Você se senta ao lado."], [19.04, 24.12, "Pela primeira vez desde que saiu de casa, pode apoiar as costas sem olhar para a rua."], [24.56, 27.66, "Léo pergunta onde pode carregar a luz da bicicleta."], [28.1, 30.86, "Helena mostra uma pequena estação de energia."], [31.3, 35.04, "Só está sendo usada para o rádio e equipamentos da enfermaria."], [35.48, 37.37, "Ele guarda a luz sem insistir."], [37.81, 41.43, "Você olha para o celular desligado na sua mão e faz o mesmo."]], "dur": 43.07}, "c12": {"frases": [[0.5, 5.28, "Quando você sente o cheiro da comida, percebe que passou o dia inteiro com fome."], [5.72, 9.18, "Entrega duas latas à cozinha e recebe uma caneca de sopa."], [9.62, 10.87, "Está quente demais."], [11.31, 13.83, "Você segura com as duas mãos mesmo assim."], [14.27, 17.09, "Perto da mesa, um homem reclama da quantidade."], [17.53, 19.53, "Helena escuta e mostra a panela."], [19.97, 21.51, "Ainda tem gente na fila."], [21.95, 23.43, "O homem olha para trás."], [23.87, 27.85, "Você acompanha o olhar dele e vê duas crianças dividindo um banco."], [28.29, 30.52, "Ele volta para o lugar sem discutir."], [30.96, 32.15, "Você come devagar."], [32.59, 34.31, "Não porque quer aproveitar."], [34.75, 40.75, "Seu corpo parece estar reaprendendo a aceitar que, por alguns minutos, ninguém está perseguindo você."], [41.19, 43.13, "Bia adormece antes de terminar."], [43.57, 46.04, "Davi segura a caneca dela para não cair."]], "dur": 47.68}, "c13": {"frases": [[0.5, 3.78, "Depois de comer, você procura alguma coisa para fazer."], [4.22, 6.86, "Ficar sentado dá espaço demais para pensar."], [7.3, 9.77, "Helena apresenta você a Joel, o zelador."], [10.21, 14.87, "Ele conhece cada porta que emperra e cada cano que dá problema naquela escola."], [15.31, 18.19, "Você acompanha os baldes até a área de serviço."], [18.63, 21.38, "No caminho, vê sua irmã separando cobertores."], [21.82, 27.01, "Léo está ajoelhado junto a uma porta, apertando um parafuso com uma ferramenta pequena."], [27.45, 29.22, "Davi ajuda a mover uma mesa."], [29.66, 33.29, "Você percebe que o abrigo não estava pronto esperando vocês."], [33.73, 35.85, "Está sendo montado por quem chega."], [36.29, 38.53, "Joel coloca um balde sob a torneira."], [38.97, 40.51, "A água cai num fio fino."], [40.95, 41.79, "Você espera."], [42.23, 44.29, "Demora muito mais do que deveria."]], "dur": 45.93}, "c14": {"frases": [[0.5, 2.85, "Você pergunta se a pressão está fraca."], [3.29, 6.92, "Joel fecha a torneira e olha para Helena antes de responder."], [7.36, 10.11, "O abastecimento da rua parou no dia anterior."], [10.55, 12.5, "A escola está usando a reserva."], [12.94, 15.23, "Ele mostra uma marca no reservatório."], [15.67, 17.97, "Depois, uma segunda marca, mais alta."], [18.41, 20.93, "A diferença é o que foi gasto desde cedo."], [21.37, 22.97, "Você olha para os baldes."], [23.41, 27.61, "Pensa na cozinha. Na enfermaria. Nas pessoas que ainda estão chegando."], [28.05, 29.83, "Pergunta quanto tempo resta."], [30.27, 34.12, "Helena responde baixo: \"Do jeito que está, não passa de amanhã.\""], [34.56, 36.1, "Você olha para a quadra."], [36.54, 39.65, "Sua irmã está cobrindo Bia com um cobertor amarelo."], [40.09, 43.54, "Você tinha acabado de encontrar um lugar para ela dormir."], [43.98, 47.84, "Ainda nem tinha pensado em como manter aquele lugar funcionando."]], "dur": 49.48}, "c15": {"frases": [[0.5, 2.21, "Você se lembra do caminhão."], [2.65, 4.77, "Branco. Faixa azul. Tanque grande."], [5.21, 6.41, "Perto da farmácia."], [6.85, 9.2, "Abre o mapa antes de terminar a frase."], [9.64, 12.51, "Joel pergunta se você viu alguma identificação."], [12.95, 15.01, "Você lembra de letras na lateral."], [15.45, 16.35, "Água potável."], [16.79, 20.01, "Não chegou perto o suficiente para verificar o resto."], [20.45, 23.04, "Helena pergunta se ele parecia danificado."], [23.48, 24.44, "Você não sabe."], [24.88, 25.84, "Se tinha água."], [26.28, 27.36, "Também não sabe."], [27.8, 29.39, "Se conseguiria sair dali."], [29.83, 31.14, "Você olha para Davi."], [31.58, 34.34, "Ele conta que dirigia o ônibus daquela linha."], [34.78, 38.69, "Conhece o cruzamento. Conhece a rua de serviço atrás da farmácia."], [39.13, 43.11, "Mas deixa claro que dirigir o caminhão é só uma parte do problema."], [43.55, 48.33, "Vocês ainda precisam encontrá-lo funcionando, com água e com uma saída possível."], [48.77, 52.11, "Léo aponta os carros desenhados às pressas no seu mapa."], [52.55, 54.44, "Talvez dê para abrir passagem."], [54.88, 56.24, "Joel cruza os braços."], [56.68, 57.24, "Talvez."], [57.68, 62.58, "Você percebe que a ideia ficou mais difícil depois que começou a parecer possível."]], "dur": 64.22}, "c16": {"frases": [[0.5, 2.97, "Sua irmã entende antes de você explicar."], [3.41, 5.24, "Ela aponta para o cruzamento."], [5.68, 7.91, "\"Foi onde a gente viu aquela coisa.\""], [8.35, 9.31, "Você confirma."], [9.75, 11.0, "Ela olha para Davi."], [11.44, 12.58, "Depois, para Léo."], [13.02, 18.38, "Você diz que, primeiro, precisam observar de longe. Descobrir se o caminhão ainda está lá."], [18.82, 21.58, "Que ninguém vai ligar um motor sem uma saída."], [22.02, 23.67, "Sua irmã fica em silêncio."], [24.11, 27.28, "Então tira o caderno da mochila e arranca uma folha."], [27.72, 32.67, "Desenha as ruas por onde vocês passaram e marca o ponto de ônibus onde descansaram."], [33.11, 34.89, "Um segundo caminho de volta."], [35.33, 36.81, "Entrega o papel a você."], [37.25, 39.66, "Você dobra com mais cuidado que o mapa."]], "dur": 41.3}, "c17": {"frases": [[0.5, 4.3, "Antes de terminar o plano, você escuta alguém chamar no portão."], [4.74, 5.93, "Mais três pessoas."], [6.37, 8.49, "O menino no colo do pai pede água."], [8.93, 11.28, "Helena abre espaço para eles entrarem."], [11.72, 15.46, "Você pega uma caneca e vai até o balde que acabou de carregar."], [15.9, 18.95, "Enquanto serve, olha o nível baixar mais um pouco."], [19.39, 20.41, "Entrega a água."], [20.85, 23.9, "O menino bebe segurando a caneca com as duas mãos."], [24.34, 25.99, "Você volta para a bancada."], [26.43, 29.13, "Marca um horário de saída no canto do papel."], [29.57, 31.63, "Amanhã, ao primeiro sinal de luz."]], "dur": 33.27}, "c18": {"frases": [[0.5, 4.07, "Quando a escola finalmente fica em silêncio, você se deita."], [4.51, 5.87, "Escuta alguém tossir."], [6.31, 8.14, "O rádio chia na sala ao lado."], [8.58, 10.76, "Uma panela bate de leve na cozinha."], [11.2, 16.68, "Pela primeira vez desde a invasão, o barulho de outras pessoas ajuda você a fechar os olhos."], [17.12, 20.8, "Sua irmã pergunta, bem baixo, se você acha que vai dar certo."], [21.24, 22.96, "Você demora para responder."], [23.4, 24.82, "Diz que encontrou ela."], [25.26, 26.98, "Que vocês chegaram até ali."], [27.42, 30.0, "Que amanhã vai precisar descobrir o resto."], [30.44, 34.64, "Antes de dormir, você tenta lembrar de mais algum detalhe do caminhão."], [35.08, 36.39, "A posição das rodas."], [36.83, 38.43, "O espaço entre os carros."], [38.87, 40.24, "A porta do motorista."], [40.68, 41.87, "Ela estava aberta?"], [42.31, 43.97, "Você não consegue lembrar."]], "dur": 55.61}};
