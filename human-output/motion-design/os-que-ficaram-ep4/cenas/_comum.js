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
        ${mochila}${capuz}${corpo}${alca}${o.coldre ? `<g class="b-coldre"><path d="M-20,-2 L22,-2" stroke="#3b2a1e" stroke-width="5"/><rect x="8" y="-4" width="16" height="28" rx="4" fill="#3b2a1e" stroke="${T}" stroke-width="3"/><rect x="11" y="-12" width="10" height="10" rx="2" fill="#2b2b2b" stroke="${T}" stroke-width="2"/></g>` : ''}
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
        ${manga('b-bf')}<circle class="b-mf" r="8.5" fill="${T}"/>${o.faixa ? '<circle class="b-faixa" r="7.5" fill="none" stroke="#ffffff" stroke-width="5.5"/>' : ''}
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
      mt: q('.b-mt'), mf: q('.b-mf'), o1: q('.b-o1'), o2: q('.b-o2'), boca: q('.b-boca'), medo: q('.b-medo'), it: q('.b-it'), itT: q('.b-itT'), faixa: q('.b-faixa'),
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
    if (r.faixa) { r.faixa.setAttribute('cx', f2(lerp(cF[0], mF[0], 0.72))); r.faixa.setAttribute('cy', f2(lerp(cF[1], mF[1], 0.72))); }
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


/* ═════════════ EP4: elenco novo, objetos e cenários (cruzamento, farmácia, mesa, corredor) ═════════════ */
(function () {
  const { COR, txt, f2, rand } = K;
  const T = COR.tinta;
  Object.assign(EP3.ELENCO, {
    breno: { roupa: '#1f1f24', roupaEsc: '#0b0b0d', faixa: true, cabeloCurto: true, corCabelo: '#111' },
    mauro: { camiseta: true, roupa: '#dfe5ec', roupaEsc: '#aab4c0', cabeloCurto: true, corCabelo: '#7a7a7a', coldre: true },
    cintia: { camiseta: true, roupa: '#7d8a3a', roupaEsc: '#5c6629', coque: true, corCabelo: '#1b1410' },
    nando: { camiseta: true, roupa: '#2c7fb8', roupaEsc: '#1e5a85', bone: '#e67e22' },
    radio: { roupa: '#5b4636', roupaEsc: '#3f3025', faixa: true, cabeloCurto: true, corCabelo: '#222' },
    mulher: { roupa: '#b03a5b', roupaEsc: '#86283f', cabelo: true },
    senhor: { camiseta: true, roupa: '#95a5a6', roupaEsc: '#6c7a7b', cabeloCurto: true, corCabelo: '#cfcfcf', oculos: true },
    homem: { camiseta: true, roupa: '#a0522d', roupaEsc: '#7a3e22' },
    crianca: { roupa: '#5dade2', roupaEsc: '#3a8cc4' },
  });
  Object.assign(EP3.ESCALA, { crianca: 0.45, mauro: 1.03, nando: 1.0 });

  /* objetos */
  Object.assign(Pr, {
    lanternaAzul: () => `<g class="p-lantA"><rect x="-26" y="-9" width="40" height="18" rx="4" fill="#2b2e34" stroke="${T}" stroke-width="3"/><path d="M14,-14 L30,-18 L30,18 L14,14 Z" fill="#5fb4ff" stroke="#1d4fa8" stroke-width="3" opacity=".95"/><path d="M-20,-10 q10,-6 20,0 q10,6 22,-2" fill="none" stroke="#a8dcff" stroke-width="2" opacity=".8"/></g>`,
    bastao: () => `<g class="p-bastao"><rect x="-5" y="-96" width="10" height="110" rx="5" fill="#5a4636" stroke="${T}" stroke-width="3"/><rect x="-6" y="-2" width="12" height="18" rx="3" fill="#222"/></g>`,
    caderneta: () => `<g class="p-cad"><rect x="-16" y="-22" width="32" height="40" rx="3" fill="#2c3e50" stroke="${T}" stroke-width="3"/><rect x="-12" y="-18" width="4" height="32" fill="#c0392b"/></g>`,
    prancheta: () => `<g class="p-pranch" transform="rotate(-8)"><rect x="-24" y="-32" width="48" height="62" rx="3" fill="#8d6e4c" stroke="${T}" stroke-width="3"/><rect x="-18" y="-24" width="36" height="48" fill="#fbf8f1"/><rect x="-8" y="-36" width="16" height="8" rx="2" fill="#7f8c8d" stroke="${T}" stroke-width="2"/>${[-14, -6, 2, 10].map((y) => `<line x1="-13" y1="${y}" x2="13" y2="${y}" stroke="#7f8c8d" stroke-width="2.5"/>`).join('')}</g>`,
    chave: () => `<g class="p-chave"><circle cx="-10" cy="0" r="8" fill="none" stroke="#c9a227" stroke-width="5"/><path d="M-2,0 L18,0 M12,0 L12,8 M17,0 L17,6" stroke="#c9a227" stroke-width="5" stroke-linecap="round"/></g>`,
    corrente: (n = 6) => `<g class="p-corr">${Array.from({ length: n }, (_, i) => `<ellipse cx="${i * 13}" cy="${i % 2 ? 2 : 0}" rx="9" ry="${i % 2 ? 4 : 6}" fill="none" stroke="#9aa1a6" stroke-width="4"/>`).join('')}</g>`,
    lapis: () => `<g class="p-lapis"><rect x="-22" y="-5" width="36" height="10" fill="#f1c40f" stroke="${T}" stroke-width="2.5"/><path d="M14,-5 L26,0 L14,5 Z" fill="#f3d9b1" stroke="${T}" stroke-width="2.5"/><path d="M22,-1.6 L26,0 L22,1.6 Z" fill="${T}"/><rect x="-28" y="-5" width="7" height="10" fill="#e88aa0" stroke="${T}" stroke-width="2.5"/></g>`,
    recipiente: (c = '#3f8fd6') => `<g class="p-recip"><path d="M-22,-50 L22,-50 L26,0 L-26,0 Z" fill="${c}" fill-opacity=".55" stroke="${T}" stroke-width="3"/><rect x="-8" y="-60" width="16" height="11" rx="2" fill="#2c3e50"/><path d="M-12,-50 q12,-14 24,0" fill="none" stroke="${T}" stroke-width="3"/></g>`,
    ferramentas: () => `<g class="p-ferr"><rect x="-32" y="-26" width="64" height="30" rx="5" fill="#c0392b" stroke="${T}" stroke-width="3"/><path d="M-12,-26 L-12,-36 L12,-36 L12,-26" fill="none" stroke="${T}" stroke-width="4"/></g>`,
    toalha: () => `<g class="p-toalha"><path d="M-30,-40 Q0,-60 30,-40 L36,30 Q0,40 -36,30 Z" fill="#f5e6c8" stroke="${T}" stroke-width="3"/></g>`,
    canecas: () => `<g class="p-canecas">${[0, 1, 2, 3].map((i) => `<g transform="translate(${(i % 2) * 6 - 3},${-i * 24})">${Pr.caneca()}</g>`).join('')}</g>`,
    mochilinha: () => `<g class="p-mochil"><rect x="-18" y="-24" width="36" height="42" rx="8" fill="#16a085" stroke="${T}" stroke-width="3"/></g>`,
  });
  const lanternaChao = (pre) => `<g class="lantChao"><ellipse class="lantGlow" cx="-60" cy="0" rx="260" ry="46" fill="url(#${pre}-glowA)" opacity=".9"/><polygon class="lantCone" points="0,-8 -520,-90 -520,60" fill="url(#${pre}-feixeA)" opacity=".55" style="mix-blend-mode:screen" transform="scale(-1,1) scale(-1,1)"/><g transform="scale(1.6)">${Pr.lanternaAzul()}</g></g>`;

  /* o cruzamento: avenida do EP3 com corrente na cabine, lanterna sob a carroceria, carros-barreira, muro baixo */
  function cruzamento(pre, o = {}) {
    const veic = o.veiculos || [[300, 1130, '#c0392b'], [820, 1170, '#7f8c8d'], [1950, 1150, '#ecf0f1'], [3700, 1180, '#8e5ea2'], [4300, 1150, '#e0a43a']];
    let s = EP3.avenida(pre, { luz: o.luz || 'dia', veiculos: veic, atoresFundo: o.atoresFundo || '', atores: '' });
    // tira o rótulo vazio "atoresFrente" para pôr camadas próprias depois
    s = s.replace('<g class="atoresFrente"></g>', '');
    s = s.replace('<g class="pipaA"', `<g class="atrasPipa">${o.atrasPipa || ''}</g><g class="pipaA"`);
    s = s.replace(/<rect class="av-noite"[^>]*\/>/, '');
    // caixas de comida no balcão da farmácia (vistas pela vitrine) e escada
    s += `<g class="balcaoCaixas">${[[2600, 820], [2660, 820], [2630, 770], [2900, 820], [2960, 820]].map(([x, y]) => `<rect x="${x}" y="${y - 50}" width="54" height="50" fill="#c9a06a" stroke="#8a6a3f" stroke-width="3"/>`).join('')}</g>`;
    s += `<g class="escadaF" opacity="${o.escada ? 1 : 0}"><line x1="3090" y1="980" x2="3160" y2="560" stroke="#7f8c8d" stroke-width="10"/><line x1="3150" y1="980" x2="3220" y2="560" stroke="#7f8c8d" stroke-width="10"/>${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${3097 + i * 11}" y1="${940 - i * 70}" x2="${3157 + i * 11}" y2="${940 - i * 70}" stroke="#7f8c8d" stroke-width="7"/>`).join('')}</g>`;
    s += `<g class="atoresEscada">${o.atoresEscada || ''}</g>`;
    // corrente e cadeado na porta da cabine (mundo: porta ~ 3175..3345 × 885..1060)
    s += `<g class="correnteCab" opacity="${o.semCorrente ? 0 : 1}"><path d="M3200,985 q30,22 60,0 q30,22 60,0" fill="none" stroke="#9aa1a6" stroke-width="9"/><rect x="3248" y="992" width="28" height="32" rx="5" fill="#9aa1a6" stroke="${T}" stroke-width="3"/></g>`;
    s += `<g class="nandoVidro" opacity="0"><circle cx="3255" cy="925" r="26" fill="#fff" stroke="${T}" stroke-width="4"/><circle cx="3263" cy="922" r="3.5" fill="${T}"/><circle cx="3274" cy="922" r="3.5" fill="${T}"/><path d="M3240,906 C3240,890 3272,888 3282,902 Z" fill="#e67e22"/></g>`;
    s += `<g class="maoVidro4" opacity="0"><circle r="14" fill="${T}"/></g>`;
    // corda entre dois carros (barreira) — usada em c03 numa rua lateral; aqui, opcional
    s += `<g class="lantLayer" transform="translate(2860,1142)" opacity="${o.semLanterna ? 0 : 1}">${lanternaChao(pre)}</g>`;
    s += `<g class="atoresFrente">${o.atores || ''}</g>`;
    if (o.muro) s += `<g class="muro"><rect x="-600" y="1290" width="5800" height="400" fill="#b5651d" stroke="${T}" stroke-width="6"/>${Array.from({ length: 60 }, (_, i) => `<line x1="${-600 + i * 100 + (i % 2) * 50}" y1="1290" x2="${-600 + i * 100 + (i % 2) * 50}" y2="1690" stroke="#8a4a14" stroke-width="4"/>`).join('')}<line x1="-600" y1="1350" x2="5200" y2="1350" stroke="#8a4a14" stroke-width="4"/><rect x="-600" y="1280" width="5800" height="24" fill="#c9c5bb"/></g>`;
    s += `<g class="atoresPerto">${o.perto || ''}</g>`;
    s += `<rect class="av-noite" x="-600" y="-400" width="5600" height="2000" fill="#16223e" opacity="0" style="mix-blend-mode:multiply"/>`;
    return s;
  }
  /* rua do ponto de ônibus, papelaria fechada e a barreira (carro + carro + corda) */
  function ruaPonto(pre, o = {}) {
    let s = EP2.ruaLado(pre, { luz: o.luz || 'manha' });
    s += `<g class="ponto" transform="translate(700,980)">${EP3.abrigoOnibus()}</g>`;
    s += `<g class="papelaria"><rect x="1500" y="520" width="520" height="360" fill="#f3e3b3" stroke="#8a6a3f" stroke-width="5"/><rect x="1480" y="500" width="560" height="60" fill="#e67e22"/>${txt(1760, 544, 'PAPELARIA', { f: 'Anton', t: 44, a: 'middle' })}
      <rect x="1540" y="600" width="440" height="280" fill="#8d939b"/>${Array.from({ length: 11 }, (_, i) => `<line x1="1540" y1="${620 + i * 24}" x2="1980" y2="${620 + i * 24}" stroke="#6b7179" stroke-width="5"/>`).join('')}
      <g transform="translate(1660,560) rotate(-12)"><rect x="-40" y="-8" width="80" height="16" fill="#f1c40f" stroke="${T}" stroke-width="2"/></g></g>`;
    s += `<g class="barreira"><g transform="translate(3000,1150) rotate(8)">${EP3.carroLado('#2c3e50')}</g><g transform="translate(3560,1170) rotate(-6) scale(-1,1)">${EP3.carroLado('#ecf0f1')}</g>
      <path class="corda" d="M3140,1040 Q3280,1090 3420,1040" fill="none" stroke="#d9b36a" stroke-width="8"/></g>`;
    s += `<g class="rp-atores">${o.atores || ''}</g>`;
    return s;
  }
  /* farmácia por dentro (mundo 0..3600; pés em y=990): vitrine com a cabine lá fora, balcão, prateleiras, fundos com famílias, pia */
  function farmaciaDentro(pre, o = {}) {
    let s = `<rect x="-600" y="-400" width="4800" height="1290" fill="#e4efe8"/><rect x="-600" y="-400" width="4800" height="420" fill="#d3e2d8"/><rect x="-600" y="880" width="4800" height="700" fill="#c9d3cc"/>`;
    for (let x = -600; x < 4200; x += 160) s += `<line x1="${x}" y1="880" x2="${f2(960 + (x - 960) * 2.2)}" y2="1580" stroke="#b6c1b9" stroke-width="2"/>`;
    for (let x = 200; x < 3600; x += 700) s += `<rect class="luzF" x="${x}" y="40" width="260" height="16" rx="4" fill="${rand(x) > 0.5 ? '#fffbe8' : '#9a978e'}"/>`;
    // vitrine com a cabine do caminhão lá fora
    s += `<clipPath id="${pre}-vt"><rect x="20" y="200" width="600" height="660"/></clipPath><g clip-path="url(#${pre}-vt)"><rect x="0" y="180" width="640" height="700" fill="url(#${pre}-ceuDia)"/><rect x="0" y="700" width="640" height="200" fill="#7c8088"/>
      <g transform="translate(160,980) scale(1.3)">${EP3.caminhaoPipa()}</g><path d="M290,700 q30,22 60,0 q30,22 60,0" fill="none" stroke="#9aa1a6" stroke-width="10"/>
      <g class="vt-nando"><circle cx="420" cy="620" r="30" fill="#fff" stroke="${T}" stroke-width="4"/><path d="M402,600 C402,584 436,582 446,596 Z" fill="#e67e22"/></g></g>
      <rect x="10" y="190" width="620" height="680" fill="none" stroke="#5e6670" stroke-width="20"/><line x1="320" y1="200" x2="320" y2="860" stroke="#5e6670" stroke-width="12"/>`;
    s += `<rect x="640" y="380" width="200" height="500" fill="#5e6670"/><rect x="655" y="395" width="170" height="485" fill="#a7c6dc" opacity=".6"/>`;
    s += `<rect x="900" y="-10" width="700" height="80" fill="#1e8449"/>${txt(1250, 48, 'FARMÁCIA', { f: 'Anton', t: 56, a: 'middle' })}`;
    s += `<g class="f-atrasBalcao">${o.atrasBalcao || ''}</g>`;
    // balcão (900..1700) com caixas de comida, recipiente, prancheta e chave
    s += `<g class="balcao" transform="translate(0,78)"><rect x="900" y="740" width="820" height="250" fill="#2e8b57" stroke="#1d5e3a" stroke-width="6"/><rect x="880" y="722" width="860" height="26" fill="#f4f6f7" stroke="#7f8c8d" stroke-width="3"/>
      ${[[930, 722], [990, 722], [955, 672], [1050, 722]].map(([x, y]) => `<rect x="${x}" y="${y - 50}" width="56" height="50" fill="#c9a06a" stroke="#8a6a3f" stroke-width="3"/>`).join('')}
      <g class="f-prancheta" transform="translate(1520,712) rotate(-80) scale(1.1)">${Pr.prancheta()}</g>
      <g class="f-chave" transform="translate(1610,716)">${Pr.chave()}</g>
      <g class="f-recip" transform="translate(1250,722)">${Pr.recipiente()}</g></g>`;
    // prateleiras meio vazias
    s += `<g class="prat">${[0, 1].map((g) => { const x0 = 1900 + g * 380; let r = `<rect x="${x0}" y="300" width="340" height="590" fill="#f4f6f7" stroke="#95a5a6" stroke-width="4"/>`;
      for (let n = 0; n < 4; n++) { const y = 420 + n * 125; r += `<rect x="${x0}" y="${y}" width="340" height="10" fill="#95a5a6"/>`; for (let k = 0; k < 8; k++) if (rand(g * 40 + n * 8 + k) > 0.7) r += `<rect x="${x0 + 12 + k * 40}" y="${y - 40}" width="28" height="40" fill="${['#e74c3c', '#ecf0f1', '#3498db', '#2ecc71'][k % 4]}" stroke="${T}" stroke-width="2"/>`; }
      return r; }).join('')}</g>`;
    // fundos: colchonetes, aparelho de pressão, pia
    s += `<g class="fundos"><rect x="2700" y="950" width="260" height="34" rx="10" fill="#8e5ea2" stroke="${T}" stroke-width="3"/><rect x="3000" y="950" width="240" height="34" rx="10" fill="#2980b9" stroke="${T}" stroke-width="3"/>
      <g transform="translate(3300,900)"><rect x="-40" y="-30" width="80" height="50" rx="6" fill="#ecf0f1" stroke="${T}" stroke-width="3"/><circle cx="-12" cy="-6" r="13" fill="#bdc3c7" stroke="${T}" stroke-width="2"/><path d="M28,0 q30,20 10,40" fill="none" stroke="${T}" stroke-width="3"/></g>
      <g class="pia"><rect x="3420" y="760" width="200" height="230" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="4"/><path d="M3500,700 L3500,680 Q3500,664 3520,664 L3540,664 L3540,690" fill="none" stroke="#7f8c8d" stroke-width="10"/></g></g>`;
    s += `<g class="f-atores">${o.atores || ''}</g>`;
    return s;
  }
  /* carteira escolar vista de cima (1920×1080) com o que vão levar */
  function mesa(pre) {
    let s = `<rect x="-300" y="-300" width="2520" height="1680" fill="#3b4a5c"/><rect x="160" y="80" width="1600" height="920" rx="20" fill="#c79a62" stroke="#8a6a3f" stroke-width="10"/>`;
    for (let y = 120; y < 980; y += 60) s += `<path d="M180,${y} Q960,${y + 14} 1740,${y}" stroke="#b9895a" stroke-width="4" fill="none" opacity=".6"/>`;
    s += `<g class="ms-garrafa" transform="translate(420,520) scale(3)">${Pr.garrafa()}</g>`;
    s += `<g class="ms-rec1" transform="translate(680,600) scale(3)">${Pr.recipiente()}</g><g class="ms-rec2" transform="translate(900,620) scale(3)">${Pr.recipiente('#5dade2')}</g>`;
    s += `<g class="ms-bolachas" transform="translate(1120,520)"><rect x="-90" y="-50" width="180" height="100" rx="12" fill="#e67e22" stroke="${T}" stroke-width="6"/>${txt(0, 14, 'BOLACHAS', { f: 'Anton', t: 34, a: 'middle' })}</g>`;
    s += `<g class="ms-lant" transform="translate(1380,420) scale(3) rotate(30)">${Pr.lanterna()}</g>`;
    s += `<g class="ms-ferr" transform="translate(1440,760) scale(3.2)">${Pr.ferramentas()}</g>`;
    s += `<g class="ms-mang"><path d="M300,860 C420,760 560,940 700,850 C820,780 900,900 1040,860" fill="none" stroke="#2f7a3a" stroke-width="22" stroke-linecap="round"/></g>`;
    s += `<g class="ms-curativo" transform="translate(1150,820) rotate(-8)"><rect x="-80" y="-36" width="160" height="72" rx="10" fill="#fbf8f1" stroke="${T}" stroke-width="5"/><rect x="-14" y="-24" width="28" height="48" fill="#e74c3c"/><rect x="-24" y="-14" width="48" height="28" fill="#e74c3c"/></g>`;
    s += `<g class="ms-mao"><circle r="46" fill="${T}"/></g><g class="ms-mao2"><circle r="46" fill="${T}"/></g>`;
    return s;
  }
  /* close de papel com texto (documento de entrega) */
  function documento(pre) {
    return `<rect x="-300" y="-300" width="2520" height="1680" fill="#2e8b57"/><g transform="rotate(-4 960 540)"><rect x="560" y="60" width="800" height="1000" rx="12" fill="#8d6e4c" stroke="${T}" stroke-width="8"/>
      <rect x="610" y="120" width="700" height="900" fill="#fbf8f1"/><rect x="880" y="40" width="160" height="60" rx="10" fill="#7f8c8d" stroke="${T}" stroke-width="5"/>
      ${txt(960, 210, 'ORDEM DE ENTREGA', { f: 'Anton', t: 56, c: '#141414', a: 'middle' })}
      ${txt(660, 300, 'CARGA: ÁGUA POTÁVEL — 10.000 L', { f: 'Inter', t: 32, p: 600, c: '#2b2e34' })}
      ${txt(660, 360, 'MOTORISTA: NANDO', { f: 'Inter', t: 32, p: 600, c: '#2b2e34' })}
      <g class="doc-destino">${txt(660, 450, 'DESTINO:', { f: 'Inter', t: 32, p: 700, c: '#2b2e34' })}${txt(660, 510, 'ESCOLA MUNICIPAL', { f: 'Anton', t: 64, c: '#c0392b' })}${txt(660, 560, 'entrada pela quadra', { f: 'Inter', t: 30, c: '#2b2e34' })}</g>
      ${[640, 690, 740, 790, 840].map((y) => `<line x1="660" y1="${y}" x2="${1200 - (y % 3) * 40}" y2="${y}" stroke="#bdc3c7" stroke-width="6"/>`).join('')}
      <path d="M700,940 q40,-40 80,0 t80,0 t80,-10" fill="none" stroke="#1d4fa8" stroke-width="5"/></g>
      <g class="doc-mao" opacity="0"><circle r="60" fill="${T}"/></g>`;
  }
  /* corredor da escola à noite: lâmpadas que se apagam, porta de saída */
  function corredor(pre, o = {}) {
    let s = `<rect x="-600" y="-400" width="4800" height="1290" fill="#c9c2b0"/><rect x="-600" y="880" width="4800" height="700" fill="#8f8a7c"/><rect x="-600" y="840" width="4800" height="44" fill="#6b665a"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${200 + i * 640}" y="430" width="200" height="450" fill="#8d6e4c" stroke="#5a4636" stroke-width="6"/><rect x="${230 + i * 640}" y="470" width="140" height="90" fill="#a7c6dc" opacity=".5"/>${txt(300 + i * 640, 410, 'SALA ' + (i + 1), { f: 'Anton', t: 30, c: '#5a4636', a: 'middle' })}`;
    s += `<rect x="3300" y="380" width="260" height="500" fill="#5e6670" stroke="#3a3f48" stroke-width="6"/><rect x="3360" y="330" width="140" height="40" fill="#2ecc71"/>${txt(3430, 360, 'SAÍDA', { f: 'Anton', t: 30, a: 'middle' })}`;
    s += `<g class="canecasPilha"></g>`;
    s += `<g class="c-atores">${o.atores || ''}</g>`;
    s += `<rect class="c-noite" x="-600" y="-400" width="4800" height="2000" fill="#16223e" opacity=".62" style="mix-blend-mode:multiply"/>`;
    s += `<g class="lampadas">${[0, 1, 2, 3, 4, 5].map((i) => `<g class="lamp lamp${i}"><rect x="${100 + i * 620}" y="40" width="240" height="18" rx="4" fill="#fffbe8"/><ellipse cx="${220 + i * 620}" cy="420" rx="360" ry="480" fill="url(#${pre}-glowQ)" opacity=".42" style="mix-blend-mode:screen"/></g>`).join('')}</g>`;
    return s;
  }
  /* close do pulso com a faixa branca (1920×1080) */
  function pulso(pre, o = {}) {
    return `<rect x="-300" y="-300" width="2520" height="1680" fill="${o.fundo || '#1b2236'}"/><g transform="translate(960,560) rotate(-12)"><rect x="-900" y="-70" width="1000" height="140" fill="${o.manga || '#5b4636'}" stroke="${T}" stroke-width="10"/>
      <rect x="100" y="-48" width="420" height="96" rx="48" fill="${T}"/><rect x="230" y="-60" width="70" height="120" rx="10" fill="#f4f1ea" stroke="${T}" stroke-width="6"/><circle cx="590" cy="0" r="88" fill="${T}"/></g>`;
  }
  /* close das mãos (genérico): fundo, objetos via o.obj */
  function maos(pre, o = {}) {
    return `<rect x="-300" y="-300" width="2520" height="1680" fill="${o.fundo || '#5e6670'}"/>${o.obj || ''}<g class="mA"><circle r="70" fill="${T}"/></g><g class="mB" opacity="0"><circle r="70" fill="${T}"/></g>`;
  }
  /* porta da cabine em close (1920×1080): Nando atrás do vidro, corrente e cadeado na maçaneta */
  function cabineClose(pre, o = {}) {
    return `<rect x="-300" y="-300" width="2520" height="1680" fill="url(#${pre}-ceuDia)"/><rect x="-300" y="820" width="2520" height="600" fill="#7c8088"/>
      <path d="M220,1180 L220,120 L1260,120 L1700,560 L1720,1180 Z" fill="#f4f6f7" stroke="${T}" stroke-width="12" stroke-linejoin="round"/>
      <clipPath id="${pre}-jan"><path d="M330,200 L1180,200 L1560,560 L330,560 Z"/></clipPath>
      <g clip-path="url(#${pre}-jan)"><rect x="300" y="180" width="1300" height="400" fill="#3d4a5c"/><g class="cab-dentro">${o.dentro || ''}</g><rect x="300" y="180" width="1300" height="400" fill="#a7c6dc" opacity=".22"/>
        <path d="M420,220 L700,220 L520,540 L400,540 Z" fill="#fff" opacity=".12"/></g>
      <path d="M330,200 L1180,200 L1560,560 L330,560 Z" fill="none" stroke="${T}" stroke-width="12"/>
      <rect x="1180" y="700" width="160" height="40" rx="10" fill="#7f8c8d" stroke="${T}" stroke-width="6"/>
      <g class="cab-corrente"><path d="M1000,640 q60,50 120,0 q60,50 120,0 q60,50 120,0 q40,60 0,140" fill="none" stroke="#9aa1a6" stroke-width="18"/>
        <g class="cadeado" transform="translate(1290,800)"><path d="M-30,-10 L-30,-50 Q0,-90 30,-50 L30,-10" fill="none" stroke="#7f8c8d" stroke-width="14"/><rect x="-50" y="-14" width="100" height="90" rx="12" fill="#c9a227" stroke="${T}" stroke-width="6"/><circle cy="24" r="10" fill="${T}"/></g></g>
      <g class="cab-mao" opacity="0"><circle r="60" fill="${T}"/></g>`;
  }
  window.EP4 = { cabineClose, cruzamento, ruaPonto, farmaciaDentro, mesa, documento, corredor, pulso, maos, lanternaChao };
})();

/* ajudantes de cena do EP4 */
(function () {
  const { lerp, prog, E } = K;
  window.H4 = {
    /** posiciona um elenco inteiro: lista [id, nome?, pose] */
    elenco: (P, t, lista) => lista.forEach(([id, nome, ps]) => H3.p(P, id, nome || id, ps)),
    /** câmera que vai do ponto A ao B entre ta e tb (cx, cy, z) */
    cam: (P, t, ta, tb, a, b, tr) => { const k = E.io(prog(t, ta, tb)); K.camera(P, lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k), 0, tr || [0, 0]); },
    /** fora de cena */
    FORA: { x: -9999, y: 0 },
    AGM: { q: [70, 80], j: [120, 130], lean: 22, o: [30, 50], c: [60, 70] },
    BRACOS: { o: [40, 44], c: [110, 112] }, // braços cruzados
    MAOS_ALTO: { o: [60, 64], c: [70, 72] }, // mãos visíveis
    SEGURA: { o: [-6, 60], c: [10, 40] },
    ESTENDE: { o: [-6, 80], c: [10, 0] },
  };
})();

/* tempos das frases */
window.TEMPOS = {"c01": {"frases": [[0.5, 5.78, "Você descobre que uma escola cheia de gente pode ficar em silêncio por causa de um copo de água."], [6.37, 8.96, "Helena fecha a torneira antes de encher a caneca."], [9.39, 11.86, "Entrega a uma mulher que segura uma criança no colo."], [12.27, 14.39, "Atrás dela, outras pessoas esperam."], [14.82, 18.52, "Você olha para a porta dos fundos, onde Davi e Léo já estão prontos."], [18.88, 21.5, "Ontem, encontrar água era uma possibilidade."], [21.85, 24.39, "Hoje, tem gente esperando você voltar com ela."], [24.86, 26.73, "Sua irmã entrega o caminho que desenhou."], [27.08, 28.98, "Pede que você volte antes de escurecer."], [29.38, 30.4, "Você diz que vai tentar."], [30.75, 34.16, "Ela continua segurando o papel por mais um segundo antes de soltar."]], "dur": 35.36}, "c02": {"frases": [[0.5, 2.96, "Você confere o que vai levar."], [3.43, 6.26, "Uma garrafa. Dois recipientes vazios. Algumas bolachas."], [6.71, 8.27, "Léo fica com as ferramentas."], [8.68, 11.82, "Davi leva uma mangueira que Joel encontrou na área de serviço."], [12.25, 14.75, "O plano é simples enquanto está desenhado no papel."], [15.19, 18.81, "Chegar ao cruzamento. Verificar o caminhão. Trazer água."], [19.1, 22.72, "Se o veículo não funcionar, voltar com o que conseguirem carregar."], [23.16, 25.66, "Helena aponta para a marca da máquina na avenida."], [26.06, 27.21, "Você confirma que lembra."], [27.72, 30.55, "Só depois vai perceber o que faltou marcar naquele mapa."], [31.01, 32.32, "As outras pessoas."]], "dur": 33.52}, "c03": {"frases": [[0.5, 4.27, "Na volta à avenida, você reconhece o banco onde descansou com sua irmã."], [4.87, 6.44, "Parece ter passado uma semana."], [6.98, 8.18, "Não passou nem um dia."], [8.71, 10.28, "Davi anda um pouco à frente."], [10.73, 13.25, "Você pergunta se Bia estava acordada quando ele saiu."], [13.66, 14.32, "Ele confirma."], [14.53, 17.26, "Ela pediu que trouxesse água e um lápis amarelo."], [17.59, 18.24, "O dela quebrou."], [18.74, 20.7, "Léo olha para uma papelaria fechada."], [21.07, 21.86, "Diz que vai lembrar."], [22.37, 25.81, "A conversa termina quando vocês encontram uma coisa diferente na rua."], [26.38, 30.32, "Um carro que ontem estava encostado na calçada agora bloqueia a passagem."], [30.87, 32.49, "Atrás dele, existe outro."], [32.94, 35.29, "E uma corda atravessando o espaço entre os dois."]], "dur": 36.49}, "c04": {"frases": [[0.5, 2.75, "Você vê a luz antes de ver alguém."], [3.33, 3.73, "Azul."], [4.19, 5.27, "Debaixo do caminhão."], [5.7, 7.47, "Seu corpo se abaixa sozinho."], [7.96, 11.19, "Davi segura o ombro de Léo e puxa os dois para trás do muro."], [11.63, 13.69, "Vocês esperam ouvir metal raspando."], [14.03, 15.44, "Mas escutam uma tosse."], [15.78, 18.73, "Depois, uma voz reclama que a bateria está acabando."], [19.15, 21.07, "Você observa o homem levantar a luz."], [21.45, 22.38, "Não era uma máquina."], [22.74, 23.6, "Era uma lanterna."], [23.95, 27.39, "O homem coloca a lanterna no chão outra vez, virada para a avenida."], [27.75, 28.79, "Léo olha para você."], [29.13, 32.02, "A luz está ali para fazer quem passa manter distância."], [32.41, 34.01, "Você volta a observar o caminhão."], [34.34, 36.97, "Uma mão bate discretamente no vidro da cabine."], [37.41, 38.2, "Duas vezes."]], "dur": 39.4}, "c05": {"frases": [[0.5, 2.45, "Você chama antes de chegar perto."], [2.78, 3.95, "Diz que não quer problema."], [4.53, 8.25, "Breno olha para os recipientes vazios e pergunta de onde vocês vieram."], [8.89, 10.6, "Você responde que estão com um grupo."], [10.94, 11.67, "Não diz onde."], [11.96, 14.06, "Ele pede que deixem as bolsas no chão."], [14.49, 17.18, "Davi pergunta quem está responsável pelo caminhão."], [17.74, 19.26, "Uma voz responde atrás dele."], [19.73, 19.97, "“Eu.”"], [20.57, 22.64, "Mauro parece ter dormido menos que você."], [22.99, 23.99, "Mas a roupa está limpa."], [24.32, 28.62, "Atrás dele, você enxerga caixas de comida empilhadas no balcão da farmácia."], [28.9, 31.24, "Ele pergunta quantos litros vocês querem."], [31.71, 33.06, "Você quase sente alívio."], [33.6, 35.74, "Até ele perguntar o que trouxeram para pagar."]], "dur": 36.94}, "c06": {"frases": [[0.5, 2.01, "Você oferece as latas."], [2.3, 3.1, "As pilhas."], [3.44, 5.25, "Mauro separa as pilhas com um dedo."], [5.66, 8.25, "Pelas duas coisas, oferece cinco litros."], [8.58, 10.66, "Você explica que tem crianças no abrigo."], [10.99, 11.8, "Uma enfermaria."], [12.11, 13.47, "Dezenas de pessoas."], [13.74, 15.79, "Ele pergunta quantas, exatamente."], [16.1, 17.99, "Você percebe Davi olhar para você."], [18.41, 20.05, "Responde apenas que são muitas."], [20.38, 21.76, "Mauro cruza os braços."], [22.09, 28.45, "Diz que água acaba. Que ele também tem gente para alimentar. Que ninguém ficou protegendo aquele caminhão por solidariedade."], [28.8, 31.22, "Você olha para a lanterna azul sob a carroceria."], [31.6, 32.33, "Não responde."], [32.72, 34.44, "Então ele aponta para a bolsa de Léo."], [34.84, 36.92, "Pelas ferramentas, pode oferecer mais."], [37.22, 38.9, "Léo segura a alça com força."]], "dur": 40.1}, "c07": {"frases": [[0.5, 2.93, "O motorista chama sua atenção com os olhos."], [3.31, 4.7, "Primeiro, olha para você."], [5.14, 6.91, "Depois, para a corrente na porta."], [7.32, 8.12, "Você entende."], [8.43, 10.25, "Ele não está descansando ali dentro."], [10.59, 11.29, "Está preso."], [11.81, 13.61, "Você pergunta a Mauro quem é o homem."], [14.01, 15.59, "Mauro responde que o caminhão é dele."], [15.98, 18.3, "Nando trabalha para uma empresa de abastecimento."], [18.59, 20.1, "Tentou sair durante a confusão."], [20.48, 22.17, "Mauro diz que precisou impedir."], [22.49, 25.98, "Na versão dele, o motorista estava fugindo com a água de todo mundo."], [26.41, 27.97, "Você olha de novo para a cabine."], [28.37, 29.58, "Nando balança a cabeça."], [30.04, 30.78, "Bem devagar."]], "dur": 31.98}, "c08": {"frases": [[0.5, 4.08, "Você entra na farmácia esperando encontrar mais homens como Breno."], [4.7, 6.49, "Encontra uma mulher dormindo sentada."], [7.01, 8.63, "Um menino enrolado numa toalha."], [9.06, 11.98, "Um senhor olhando para um aparelho de pressão desligado."], [12.59, 14.35, "O grupo de Mauro também tem medo."], [14.75, 15.6, "Também tem fome."], [16.06, 18.19, "Cíntia coloca um recipiente sobre o balcão."], [18.68, 21.64, "Você percebe que ela mede cada porção antes de entregar."], [22.11, 23.95, "Uma mulher dos fundos pede mais água."], [24.43, 26.14, "Cíntia olha na direção da porta."], [26.61, 27.93, "Mauro ainda está lá fora."], [28.39, 31.57, "Ela completa um pouco o copo e faz um sinal para a mulher guardar."], [32.04, 33.17, "Você acompanha o gesto."], [33.51, 34.39, "Cíntia percebe."], [34.8, 35.99, "Nenhum dos dois comenta."]], "dur": 37.19}, "c09": {"frases": [[0.5, 3.4, "Enquanto espera, você vê o nome da escola num papel."], [3.97, 5.72, "O mesmo endereço ouvido no rádio."], [6.36, 9.36, "Você aproxima a mão, mas Cíntia segura a prancheta primeiro."], [10.01, 12.8, "Pergunta, baixo, se vocês vieram de lá."], [13.36, 14.99, "Você não responde imediatamente."], [15.52, 17.45, "Ela olha para os recipientes vazios."], [17.75, 18.92, "Depois, para você."], [19.16, 22.1, "Diz que Nando estava tentando concluir aquela entrega."], [22.55, 25.78, "O caminhão ficou preso no cruzamento depois que um carro bateu."], [25.99, 28.33, "Mauro e os outros ajudaram a abrir passagem."], [28.83, 31.34, "Quando viram o que ele transportava, mudaram de ideia."], [31.92, 34.02, "Você olha para a cabine através da vitrine."], [34.46, 36.97, "O abastecimento da escola não se perdeu no caminho."], [37.41, 38.99, "Alguém decidiu ficar com ele."]], "dur": 40.19}, "c10": {"frases": [[0.5, 2.96, "Você ouve seu nome sendo chamado da porta."], [3.45, 4.84, "Breno está com o mapa na mão."], [5.35, 7.1, "O caminho até a escola está marcado."], [7.64, 10.62, "Você sente o estômago apertar antes de chegar à calçada."], [11.11, 12.94, "Mauro aponta para o desenho do abrigo."], [13.41, 15.44, "Pergunta por que você não disse de onde veio."], [15.9, 17.97, "Você responde que não conhecia ninguém ali."], [18.5, 19.67, "Ele sorri sem humor."], [20.08, 22.66, "Agora, diz que pode levar o caminhão até a escola."], [23.11, 24.63, "Entregar água diretamente."], [25.04, 26.79, "Em troca, quer ver os estoques."], [27.1, 29.08, "Comida. Remédios. Baterias."], [29.18, 30.27, "O que vocês tiverem."], [30.73, 31.9, "Davi pergunta quanto."], [32.33, 33.37, "Mauro fecha o mapa."], [33.87, 35.13, "“Eu decido quando chegar.”"]], "dur": 36.33}, "c11": {"frases": [[0.5, 1.99, "Léo diz que a troca acabou."], [2.49, 4.77, "Vocês vão levar os cinco litros e ir embora."], [5.34, 6.72, "Breno não devolve a bolsa."], [7.15, 7.69, "Puxa."], [8.09, 8.77, "Léo segura."], [9.23, 10.88, "Tudo acontece rápido demais."], [11.24, 11.81, "Um empurrão."], [12.19, 13.71, "Léo bate no carro estacionado."], [13.88, 15.75, "As ferramentas se espalham no asfalto."], [16.2, 17.7, "Você dá um passo na direção dele."], [18.03, 19.23, "Davi segura seu braço."], [19.62, 20.97, "Mauro manda Breno parar."], [21.33, 22.8, "Mas não pede que devolva nada."], [23.23, 26.33, "Você olha para Léo, sentado no chão, segurando o pulso."], [26.68, 30.98, "É quando entende que aquela conversa nunca teve as mesmas regras para os dois lados."]], "dur": 32.18}, "c12": {"frases": [[0.5, 3.34, "Cíntia diz que precisa limpar o corte na mão de Léo."], [3.79, 4.58, "Mauro permite."], [4.98, 5.77, "Davi vai junto."], [6.04, 9.43, "Você fica entre a porta e o caminhão, sem saber para onde olhar."], [9.93, 12.72, "Antes de entrar, Cíntia fala perto do seu ouvido."], [13.17, 14.87, "A chave da corrente está no balcão."], [15.21, 16.34, "Ao lado da prancheta."], [16.82, 18.08, "Você encara o rosto dela."], [18.51, 19.34, "Ela não repete."], [19.66, 20.73, "Só continua andando."], [21.22, 24.24, "Você espera Mauro se virar para Breno e entra na farmácia."], [24.58, 26.94, "A chave está exatamente onde ela disse."], [27.34, 29.02, "Ao lado, o documento da entrega."], [29.43, 30.35, "Você pega os dois."]], "dur": 31.55}, "c13": {"frases": [[0.5, 3.16, "Você abre a corrente tentando não fazer barulho."], [3.72, 6.38, "Nando empurra a porta só o suficiente para sair."], [6.92, 10.19, "Precisa apoiar a mão na carroceria antes de conseguir ficar em pé."], [10.66, 12.48, "Você pergunta se ele consegue dirigir."], [12.98, 15.91, "Ele olha para a escola marcada no papel que você está segurando."], [16.19, 18.16, "Pergunta se ainda tem gente esperando."], [18.6, 19.32, "Você confirma."], [19.84, 21.6, "Nando fecha os olhos por um segundo."], [22.0, 23.72, "Depois, aponta para o caminhão."], [24.18, 25.14, "O motor funciona."], [25.39, 26.58, "A água está no tanque."], [26.81, 28.91, "Mas a chave da ignição está com Mauro."], [29.36, 31.66, "Antes que você consiga responder, escuta:"], [32.03, 32.84, "“Afasta dele.”"], [33.37, 34.78, "Breno viu a porta aberta."]], "dur": 35.98}, "c14": {"frases": [[0.5, 1.89, "Mauro olha para Nando."], [2.33, 4.17, "Depois, para a corrente na sua mão."], [4.47, 6.88, "Você mantém o documento da entrega visível."], [7.31, 9.11, "Diz que a água estava indo para a escola."], [9.39, 11.0, "Que ele pode acompanhar a entrega."], [11.14, 13.23, "Que ninguém precisa sair dali sem água."], [13.76, 15.37, "Mauro pede a chave da corrente."], [15.72, 16.67, "Você não entrega."], [17.12, 19.8, "Nando fala antes que você consiga pensar no que fazer."], [20.07, 22.24, "Diz que aceitou dividir parte da carga."], [22.5, 23.93, "Que só queria continuar a rota."], [24.1, 26.11, "Que foi trancado quando tentou sair."], [26.56, 29.5, "Você vê duas pessoas aparecerem na porta da farmácia."], [29.86, 30.8, "Elas estão ouvindo."], [31.15, 33.44, "Mauro manda todo mundo voltar para dentro."], [33.79, 36.1, "Dessa vez, ninguém se move de imediato."]], "dur": 37.3}, "c15": {"frases": [[0.5, 2.36, "Cíntia desce o degrau da farmácia."], [2.71, 4.8, "Diz que vão encher os recipientes do grupo."], [5.33, 7.29, "Depois, o caminhão segue para a escola."], [7.87, 9.6, "Mauro pergunta quem deu essa ordem."], [10.11, 12.2, "Ela responde olhando diretamente para ele."], [12.66, 14.89, "“Ninguém. Eu estou dizendo o que vou fazer.”"], [15.48, 17.42, "Você percebe que a mão dela está tremendo."], [17.95, 20.26, "Mesmo assim, ela pega o primeiro recipiente."], [20.72, 21.66, "Um homem vem ajudar."], [22.02, 23.61, "Depois, a mulher com a criança."], [24.19, 26.67, "Breno olha para Mauro, esperando alguma reação."], [27.24, 28.77, "Mauro coloca a mão perto da arma."], [29.15, 30.03, "Davi pede calma."], [30.49, 35.48, "Você sente vontade de se afastar, mas Nando ainda está ao seu lado, mal conseguindo ficar em pé."], [35.91, 37.01, "Cíntia não avança."], [37.28, 38.74, "Só aponta para as famílias."], [39.15, 42.95, "Pergunta se ele realmente vai impedir que encham os próprios recipientes."]], "dur": 44.15}, "c16": {"frases": [[0.5, 2.09, "Mauro demora para responder."], [2.62, 4.21, "Você não sabe o que pesa mais."], [4.53, 5.61, "As pessoas olhando."], [5.75, 7.77, "O caminhão que ele não sabe conduzir."], [8.23, 11.05, "Ou a possibilidade de terminar aquela discussão sozinho."], [11.58, 13.1, "Ele coloca a chave sobre o capô."], [13.4, 16.36, "Diz que os recipientes da farmácia serão cheios primeiro."], [16.83, 20.18, "Depois, vai até a escola negociar pessoalmente o restante."], [20.65, 21.73, "Você olha para Davi."], [22.19, 23.48, "Davi olha para Nando."], [23.92, 25.54, "Não é a solução que você queria."], [25.96, 27.31, "Mas o motorista está solto."], [27.64, 28.59, "Léo está de pé."], [28.96, 30.42, "E a chave está ao alcance."], [30.86, 33.45, "Você concorda que Helena vai conversar com ele na entrada."], [33.8, 35.15, "Não promete os estoques."], [35.38, 36.49, "Não promete mais nada."], [36.96, 37.61, "Pega a chave."]], "dur": 38.81}, "c17": {"frases": [[0.5, 2.66, "Você ajuda a encher os recipientes."], [3.08, 6.36, "A mulher com a criança agradece antes de voltar para a farmácia."], [6.85, 11.99, "Você percebe como é fácil olhar para um lugar cheio de desconhecidos e enxergar um grupo só."], [12.51, 13.65, "Cíntia continua ali."], [14.01, 14.72, "Breno também."], [15.25, 16.71, "Mas não fizeram a mesma escolha."], [17.22, 20.05, "Enquanto a água é distribuída, Davi examina o caminho."], [20.47, 22.32, "Um carro bloqueia a saída do caminhão."], [22.57, 26.18, "Está destrancado, mas ficou numa posição ruim depois da batida."], [26.57, 28.49, "Você ajuda a empurrar com os outros."], [28.8, 30.08, "Léo usa só uma mão."], [30.38, 31.73, "Mesmo assim, não para."], [32.12, 35.06, "Quando o espaço finalmente abre, Davi sobe na cabine."], [35.54, 37.26, "Nando senta ao lado para orientar."], [37.63, 40.04, "Você fica olhando para a chave antes que ela gire."], [40.55, 43.62, "O barulho do motor vai anunciar vocês para o bairro inteiro."]], "dur": 44.82}, "c18": {"frases": [[0.5, 2.46, "Na primeira tentativa, nada."], [2.89, 4.57, "Na segunda, o motor pega."], [4.85, 7.38, "Você espera uma luz azul aparecer na esquina."], [7.78, 8.86, "Espera ouvir metal."], [9.41, 11.0, "Mas a rua continua vazia."], [11.59, 14.26, "Léo prende a bolsa de ferramentas recuperada no ombro."], [14.7, 16.81, "Cíntia se aproxima com uma mochila pequena."], [17.25, 18.75, "Vai acompanhar Nando até a escola."], [19.23, 21.22, "Você pergunta pelo resto das pessoas."], [21.43, 26.39, "Ela explica que primeiro quer saber se existe espaço. Depois, volta para buscá-las."], [26.8, 28.34, "Mauro sobe num carro com Breno."], [28.63, 29.8, "Eles vão seguir o caminhão."], [30.24, 31.66, "Você não gosta da ideia."], [31.81, 35.27, "Mas também não pode passar o dia inteiro parado naquele cruzamento."]], "dur": 36.47}, "c19": {"frases": [[0.5, 4.28, "Quando você vê o muro da escola, sente as pernas ficarem leves."], [4.76, 6.26, "Sua irmã aparece no portão."], [6.7, 7.09, "Sorri."], [7.45, 9.4, "Então vê Léo segurando o pulso."], [9.85, 11.7, "Nando com dificuldade para descer."], [12.03, 14.32, "O carro de Mauro parando atrás do caminhão."], [14.82, 16.06, "O sorriso desaparece."], [16.6, 18.65, "Você chega à grade antes dos outros."], [19.08, 20.65, "Conta a Helena que trouxeram água."], [21.04, 23.1, "Depois, explica quem veio junto."], [23.6, 24.63, "Ela escuta até o fim."], [25.11, 28.09, "Só então chama Joel e abre espaço para o caminhão entrar."], [28.65, 29.74, "Mauro tenta acompanhar."], [30.24, 32.03, "Helena fecha o portão na frente dele."], [32.38, 34.18, "Você fica do lado de fora com ela."], [34.57, 36.08, "A conversa vai acontecer ali."]], "dur": 37.28}, "c20": {"frases": [[0.5, 4.99, "Mauro cobra combustível, proteção e o tempo que ficou cuidando do veículo."], [5.58, 7.89, "Helena pergunta quanto de água já foi vendido."], [8.35, 9.2, "Ele não responde."], [9.59, 11.62, "Nando entrega o documento pela grade."], [12.03, 13.22, "O nome da escola está ali."], [13.63, 15.01, "O destino da carga também."], [15.69, 20.0, "Helena diz que pode dividir uma parte da comida disponível com as famílias da farmácia."], [20.23, 21.87, "Depois de contar os suprimentos."], [22.2, 23.95, "E entregar diretamente a elas."], [24.47, 27.02, "Mauro diz que quem organiza aquele grupo é ele."], [27.54, 28.83, "Helena responde que entendeu."], [29.04, 31.54, "Mas a oferta continua sendo para as pessoas."], [32.13, 33.76, "Você observa o rosto dele mudar."], [34.34, 36.55, "Na avenida, ele podia fechar uma passagem."], [36.95, 40.63, "Ali, tem gente dos dois lados da grade ouvindo cada palavra."], [41.2, 42.49, "Mauro guarda a caderneta."], [42.84, 44.66, "Antes de ir embora, olha para você."], [45.2, 46.75, "“Agora eu sei onde vocês estão.”"], [47.21, 49.94, "Você não consegue responder antes que ele entre no carro."]], "dur": 51.14}, "c23": {"frases": [[0.5, 3.67, "Antes de dormir, você leva as últimas canecas para a cozinha."], [4.24, 6.48, "Mais pessoas chegaram desde o abastecimento."], [7.06, 9.6, "Helena diz que alguém deve ter visto o caminhão entrando."], [10.17, 12.21, "Você olha para os colchonetes ocupados."], [12.71, 14.85, "Mais gente significa menos espaço."], [15.15, 17.37, "Também significa mais mãos para ajudar."], [17.96, 20.62, "Você repete isso para si enquanto passa pelo corredor."], [21.21, 25.08, "Perto da saída, um homem que chegou ao anoitecer segura um rádio pequeno."], [25.38, 27.66, "Você acha que ele está procurando uma transmissão."], [28.23, 29.33, "Até ouvir a voz dele."], [29.94, 30.39, "Baixa."], [30.85, 31.23, "Clara."], [31.86, 33.44, "“Tem água. Comida também.”"], [34.0, 34.62, "Você para."], [35.12, 37.23, "O homem continua, de costas para você."], [37.68, 40.58, "“Nos fundos, o portão fecha só com uma corrente.”"], [41.02, 41.83, "O homem se vira."], [42.24, 44.61, "Você reconhece a faixa branca amarrada no pulso."], [45.1, 47.15, "A mesma que Breno usava no cruzamento."]], "dur": 61.15}, "c21": {"frases": [[0.5, 5.02, "Você entra na escola com a sensação de que ainda deixou alguma coisa do lado de fora."], [5.44, 7.09, "Joel acompanha o abastecimento."], [7.52, 9.59, "O nível do reservatório começa a subir."], [10.01, 14.43, "Na cozinha, alguém solta uma risada curta quando a torneira volta a correr direito."], [14.85, 18.2, "Você não esperava que aquele som fosse quase fazer você chorar."], [18.62, 19.79, "Rosa manda Léo sentar."], [20.22, 21.76, "Ele tenta dizer que está bem."], [22.19, 25.22, "Você aponta para a cadeira antes que ela precise repetir."], [25.64, 26.6, "Davi encontra Bia."], [27.02, 29.68, "Ela abraça a cintura dele e pergunta se deu certo."], [30.11, 31.06, "Ele mostra a água."], [31.49, 33.08, "Ela pergunta do lápis amarelo."], [33.51, 34.57, "Davi fecha os olhos."], [35.0, 35.48, "Esqueceu."], [35.9, 37.34, "Léo tira um lápis do bolso."], [37.76, 40.79, "Encontrou num dos balcões da farmácia, enquanto esperava."], [41.22, 42.81, "Bia segura como se fosse novo."], [43.24, 45.79, "Você vê Davi agradecer sem conseguir dizer nada."]], "dur": 46.99}, "c22": {"frases": [[0.5, 3.48, "Sua irmã pergunta se a máquina estava perto do caminhão."], [3.9, 5.39, "Você conta sobre a lanterna."], [5.82, 6.4, "A corrente."], [6.83, 8.63, "As ferramentas espalhadas no chão."], [9.06, 10.49, "Ela escuta sem interromper."], [10.92, 12.89, "Depois, pergunta se Mauro vai voltar."], [13.31, 14.59, "Você olha para o portão."], [15.01, 15.92, "Diz que não sabe."], [16.34, 18.95, "É a resposta que mais deu desde que tudo começou."], [19.37, 21.07, "Sua irmã encosta o ombro no seu."], [21.5, 24.47, "Por alguns minutos, vocês observam a escola funcionando."], [24.9, 25.64, "A água voltou."], [26.07, 27.18, "A cozinha está acesa."], [27.61, 28.99, "Nando não está mais preso."], [29.42, 33.08, "Você tenta deixar que essas coisas sejam suficientes por um instante."]], "dur": 34.28}};
