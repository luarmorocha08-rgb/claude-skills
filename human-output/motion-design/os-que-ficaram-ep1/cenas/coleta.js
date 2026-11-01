/* coleta — Cena 3 "A coleta" (24,2 s). Narração começa em 0,2 s.
   Planos: do branco, você se joga no chão → pela janela, o vizinho sobe com a mangueira → você estica o braço
   → a mão dele some na luz → o prédio da frente e a calçada → você se arrasta para debaixo da mesa
   → olhos fechados, esperando subir → a luz apaga: nada acontece. */
{
const { E, camera, op, at, ruido, prog, clamp, lerp, tremor, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const VIZ = { camiseta: true, roupa: K.COR.verde, roupaEsc: K.COR.verdeEsc, item: Pr.mangueira() };

/* o quintal do vizinho, visto pela nossa janela (mundo 0..1920) */
function quintal(pre) {
  return `<rect x="-300" y="-300" width="2520" height="1200" fill="url(#${pre}-ceuDia)"/>
    <g transform="translate(960,-120) scale(1.4)">${NAVE.svg(pre)}</g>
    <rect x="-300" y="-300" width="2520" height="1700" fill="#2a3756" opacity=".45" style="mix-blend-mode:multiply"/>
    <polygon points="980,160 1500,-40 2020,160" fill="#6b5547"/><rect x="1040" y="160" width="920" height="560" fill="#e3d3b9"/>
    <rect x="1120" y="260" width="180" height="150" fill="#a7c6dc" stroke="#f4f1ea" stroke-width="12"/><rect x="1700" y="260" width="180" height="150" fill="#a7c6dc" stroke="#f4f1ea" stroke-width="12"/>
    <rect x="1420" y="440" width="150" height="280" fill="#4a3a30"/><circle cx="1545" cy="590" r="8" fill="#d9c27a"/>
    <rect x="-300" y="700" width="2520" height="600" fill="#6f9a4e"/>
    ${Array.from({ length: 40 }, (_, i) => `<rect x="${i * 60 - 300}" y="780" width="22" height="90" rx="4" fill="#f4f1ea"/>`).join('')}<rect x="-300" y="800" width="2520" height="14" fill="#f4f1ea"/><rect x="-300" y="842" width="2520" height="14" fill="#f4f1ea"/>
    <ellipse cx="560" cy="905" rx="70" ry="22" fill="#2f7a3a"/><ellipse cx="560" cy="898" rx="52" ry="14" fill="#3f8a46"/>
    <path class="mangChao" fill="none" stroke="#2f7a3a" stroke-width="10" stroke-linecap="round"/>
    <path class="agua" fill="none" stroke="#bfe3ff" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 18" opacity=".9"/>
    <rect class="feixe" x="770" y="-300" width="300" height="1220" fill="url(#${pre}-feixe)" opacity="0" style="mix-blend-mode:screen"/>
    <ellipse class="feixeChao" cx="920" cy="905" rx="170" ry="34" fill="#ffffff" opacity="0"/>
    ${B.svg('viz', VIZ)}`;
}
/* moldura da janela por cima (a gente olha por ela) */
const moldura = () => `<path d="M-10,-10 H1930 V1090 H-10 Z M150,80 V1000 H1770 V80 Z" fill="#e8d8bb" fill-rule="evenodd"/>
  <rect x="140" y="70" width="1640" height="940" fill="none" stroke="#f4f1ea" stroke-width="40"/><line x1="960" y1="80" x2="960" y2="1000" stroke="#f4f1ea" stroke-width="26"/>
  <rect x="100" y="1000" width="1720" height="50" fill="#f4f1ea"/><polygon points="200,90 520,90 260,600 200,600" fill="#ffffff" opacity=".08"/>`;

/* o prédio da frente (fachada) e a calçada */
function predio(pre) {
  let jan = '';
  for (let a = 0; a < 5; a++) for (let c = 0; c < 6; c++) jan += `<rect x="${430 + c * 180}" y="${120 + a * 170}" width="110" height="110" fill="#a7c6dc" stroke="#f1ebdf" stroke-width="8"/>`;
  return `<rect x="-300" y="-600" width="2520" height="2400" fill="url(#${pre}-ceuDia)"/>
    <rect x="360" y="40" width="1200" height="1000" fill="#cdb99b"/><rect x="340" y="20" width="1240" height="40" fill="#a8916f"/>${jan}
    <rect x="-300" y="1040" width="2520" height="60" fill="#b9b6ad"/><rect x="-300" y="1100" width="2520" height="500" fill="#7c8088"/>
    <rect x="140" y="400" width="200" height="640" fill="#d9c7aa"/><rect x="1580" y="300" width="260" height="740" fill="#e5d6bd"/>
    <rect x="-300" y="-600" width="2520" height="2400" fill="#2a3756" opacity=".4" style="mix-blend-mode:multiply"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect class="fx fx${i}" x="${[500, 860, 1220, 300, 1500][i]}" y="-600" width="170" height="1700" fill="url(#${pre}-feixe)" opacity=".75" style="mix-blend-mode:screen"/>`).join('')}
    ${[0, 1, 2, 3, 4].map((i) => B.svg(`s${i}`, { roupa: ['#c0392b', '#e0a43a', '#8e5ea2', '#2c3e50', '#d35400'][i], roupaEsc: '#00000044' })).join('')}`;
}

K.cena('coleta', { planos: [
  /* S1 — você se joga no chão */
  { ate: 1.6,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', { item: Pr.celular() }) }) + `<polygon class="raio" points="660,190 980,190 1500,990 380,990" fill="url(#${pre}-feixe)" opacity=".8" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t) {
      const k = E.io(prog(t, 0.35, 1.0));
      const arco = Math.sin(Math.PI * k) * 90;
      const p = pose({ x: lerp(1000, 1180, k), y: 990 - arco - 37 * S * k, s: S, d: -1, rot: lerp(0, 90, k) * -1 + 0, cab: lerp(0, 10, k), ab: 1.3, medo: 0.8 * k, boca: 0.8 },
        { q: [lerp(-3, 30, k), lerp(3, -20, k)], o: [lerp(-6, 160, k), lerp(20, 170, k)], c: [10, 10], chao: k > 0.05 ? 0 : 1, alt: lerp(0, 50, k) });
      B.posar(P.q('#voce'), p);
      op(P.q('.int-janluz'), 1); op(P.q('.vista-sombra'), 0.7); at(P.q('.vista-nave'), 'transform', 'translate(830,205) scale(.42)');
      op(P.q('.int-flash'), 1 - E.out(prog(t, 0, 0.5)));
      op(P.q('.raio'), 0.8 + 0.15 * Math.sin(t * 20));
      camera(P, 1050, 680, 1.35, 0, tremor(t, 1.0, 10, 14, 6));
    } },
  /* S2 — o vizinho sobe, ainda segurando a mangueira */
  { ate: 6.1,
    svg: (pre) => quintal(pre), sobre: () => moldura(),
    quadro(tl, el, P, t) {
      const sobe = E.in(prog(t, 2.6, 6.1)) * 0.6 + prog(t, 2.6, 6.1) * 0.4;
      const y = 905 - sobe * 640;
      const susto = prog(t, 2.0, 2.4);
      const p = pose({ x: 920, y, s: 1.55, d: 1, chao: sobe > 0.01 ? 0 : 1, alt: 0, cab: lerp(0, -30, susto), ol: [1, lerp(0, -5, susto)], ab: lerp(1, 1.3, susto), boca: susto,
        q: [lerp(-3, -10, sobe), lerp(3, 12, sobe)], j: [lerp(2, 30, sobe), lerp(2, 20, sobe)] }, { o: [lerp(-7, -30, sobe), lerp(40, 70, sobe)], c: [10, lerp(40, 10, sobe)], iR: -10 });
      B.posar(P.q('#viz'), p);
      const m = B.maoFrente(p);
      at(P.q('.mangChao'), 'd', `M560,898 C${lerp(620, 700, sobe)},${905} ${m[0] - 80},${lerp(905, m[1] + 200, sobe)} ${m[0] + 10},${m[1]}`);
      const bx = m[0] + 34, by = m[1] - 6;
      at(P.q('.agua'), 'd', `M${bx},${by} Q${bx + 160},${by - 60 + sobe * 40} ${bx + 260},${by + 120 + sobe * 300}`);
      at(P.q('.agua'), 'stroke-dashoffset', -t * 120);
      op(P.q('.feixe'), E.out(prog(t, 1.7, 2.3)) * (0.85 + 0.1 * Math.sin(t * 18)));
      op(P.q('.feixeChao'), 0.8 * E.out(prog(t, 1.7, 2.3)));
      camera(P, 960, lerp(560, 470, E.sine(prog(tl, 0, 4.5))), lerp(1.0, 1.06, tl / 4.5));
    } },
  /* S3 — você corre para a janela e estica o braço: longe demais */
  { ate: 9.4,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre).replace('<g class="vista-nave"', `<rect class="vfeixe" x="760" y="170" width="70" height="320" fill="#ffffff" opacity=".9"/><circle class="vviz" r="9" fill="#fff" stroke="#141414" stroke-width="3"/><g class="vista-nave"`), atores: B.svg('voce', { item: '' }) }),
    quadro(tl, el, P, t) {
      const k = E.out(prog(t, 6.1, 6.9));
      const est = E.io(prog(t, 6.9, 7.6));
      const p = pose({ x: lerp(1220, 980, k), y: 990, s: S, d: -1, lean: lerp(0, 12, est), cab: lerp(0, -16, est), ol: [4, -5], ab: 1.25, boca: 0.7 },
        k < 1 ? B.andar(tl * 12, 1.4) : {}, { o: [lerp(-10, 30, est), lerp(20, 112, est)], c: [lerp(18, 30, est), lerp(18, -6, est)] });
      B.posar(P.q('#voce'), p);
      op(P.q('.int-janluz'), 0.15); op(P.q('.vista-sombra'), 0.7); at(P.q('.vista-nave'), 'transform', 'translate(830,205) scale(.42)');
      at(P.q('.vviz'), 'cx', 795); at(P.q('.vviz'), 'cy', lerp(400, 230, prog(t, 6.1, 9.4)));
      camera(P, lerp(1050, 930, k), 560, lerp(1.5, 1.75, E.sine(prog(tl, 0, 3.3))));
    } },
  /* S4 — a mão dele desaparece dentro da luz */
  { ate: 11.8,
    svg: (pre) => `<rect x="-300" y="-300" width="2520" height="1680" fill="#dff1ff"/>
      <ellipse cx="960" cy="200" rx="900" ry="700" fill="url(#${pre}-glow)"/>
      <g class="braco"><path d="M0,700 L0,120" stroke="#141414" stroke-width="80" stroke-linecap="round"/><path d="M0,700 L0,420" stroke="#36652a" stroke-width="110" stroke-linecap="round"/>
        <path d="M0,700 L0,430" stroke="#4e8a3a" stroke-width="84" stroke-linecap="round"/><circle cx="0" cy="80" r="74" fill="#141414"/></g>
      <rect class="clarao" x="-300" y="-300" width="2520" height="1680" fill="#ffffff" opacity="0"/>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 9.4, 11.8);
      const b = P.q('.braco');
      at(b, 'transform', `translate(${960 + Math.sin(tl * 2) * 10},${lerp(560, 120, E.in(k))})`);
      op(b, 1 - E.in(prog(t, 10.4, 11.5)));
      b.style.filter = `blur(${(E.in(prog(t, 10.2, 11.5)) * 14).toFixed(1)}px)`;
      op(P.q('.clarao'), 0.6 * E.in(prog(t, 10.6, 11.8)));
      camera(P, 960, 540, lerp(1.0, 1.12, k));
    } },
  /* S5 — no prédio da frente, a mesma coisa; na calçada também */
  { ate: 15.7,
    svg: (pre) => predio(pre),
    quadro(tl, el, P, t) {
      const ori = [[555, 450], [915, 280], [1275, 620], [390, 1040], [1580, 1040]];
      ori.forEach(([x, y], i) => {
        const t0 = 11.9 + i * 0.5 + (i >= 3 ? 1.6 : 0);
        const u = Math.max(0, t - t0);
        const p = pose({ x, y: y - u * u * 60 - u * 80, s: i >= 3 ? 1.5 : 0.75, d: i % 2 ? 1 : -1, chao: u > 0 ? 0 : 1, q: [-8, 14], j: [30, 18], o: [60, 120], c: [10, 20], cab: -20, ab: 1.3, boca: 0.8 });
        B.posar(P.q(`#s${i}`), p);
        op(P.q(`#s${i}`), t < t0 - 0.6 ? 0 : 1);
        op(P.q(`.fx${i}`), t < t0 - 0.4 ? 0 : 0.75 + 0.1 * Math.sin(t * 15 + i));
      });
      const desce = E.io(prog(t, 13.8, 14.6));
      camera(P, 960, lerp(500, 760, desce), lerp(0.95, 1.05, prog(tl, 0, 3.9)));
    } },
  /* S6 — você se arrasta para debaixo da mesa e fecha os olhos */
  { ate: 19.0,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', {}) }) + `<polygon class="raio" points="660,190 980,190 1500,990 380,990" fill="url(#${pre}-feixe)" opacity=".5" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 15.8, 17.6);
      const enc = E.io(prog(t, 17.4, 18.2));
      const rast = { rot: 90, chao: 0, alt: 50, q: [10 + 12 * Math.sin(tl * 6), -10 - 12 * Math.sin(tl * 6)], j: [20, 20], o: [130 + 30 * Math.sin(tl * 6), 130 - 30 * Math.sin(tl * 6)], c: [20, 20], cab: -60, ol: [4, 0] };
      const base = pose({ x: lerp(880, 1170, E.sine(k)), y: 990 - 74, s: S, d: 1, ab: 1.2, medo: 0.6 }, rast);
      const fim = pose({ x: 1330, y: 990, s: 1.85, d: -1, ab: lerp(1.2, 0.1, prog(t, 18.2, 18.5)), medo: 0.8 }, B.POSES.encolhido, { lean: 52, cab: 24 });
      B.posar(P.q('#voce'), enc > 0 ? K.mistura(base, fim, enc) : base);
      op(P.q('.int-janluz'), 0.5); op(P.q('.vista-sombra'), 0.7); at(P.q('.vista-nave'), 'transform', 'translate(830,205) scale(.42)');
      op(P.q('.raio'), 0.45 + 0.15 * Math.sin(t * 9));
      camera(P, lerp(1050, 1250, E.sine(prog(t, 15.8, 18.4))), 760, 1.45);
    } },
  /* S7 — esperando sentir o próprio corpo subir */
  { ate: 21.85,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', {}) }) + `<polygon class="raio" points="660,190 980,190 1500,990 380,990" fill="url(#${pre}-feixe)" opacity=".5" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t) {
      const tr = [ruido(t * 14, 1) * 2.2, 0];
      const sobe = E.in(prog(t, 19.6, 21.6));
      B.posar(P.q('#voce'), pose({ x: 1330 + tr[0], y: 990, s: 1.85, d: -1, ab: 0.1, medo: 1, cy: -sobe * 4 }, B.POSES.encolhido, { lean: 52, cab: 24 - sobe * 6 }));
      op(P.q('.int-janluz'), 0.5); op(P.q('.vista-sombra'), 0.7); at(P.q('.vista-nave'), 'transform', 'translate(830,205) scale(.42)');
      op(P.q('.raio'), 0.5 + 0.3 * sobe + 0.15 * Math.sin(t * 13));
      op(P.q('.int-flash'), 0.25 * sobe);
      camera(P, 1330, 850, lerp(2.6, 3.0, prog(tl, 0, 2.85)));
    } },
  /* S8 — a luz apaga. Nada acontece. */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', {}) }),
    quadro(tl, el, P, t) {
      const abre = E.out(prog(t, 22.9, 23.3));
      B.posar(P.q('#voce'), pose({ x: 1330, y: 990, s: 1.85, d: -1, ab: lerp(0.1, 1.1, abre), medo: 0, ol: [lerp(0, 4, abre), 0] }, B.POSES.encolhido, { lean: 52, cab: 24 }));
      op(P.q('.vista-sombra'), 0.7); at(P.q('.vista-nave'), 'transform', 'translate(830,205) scale(.42)');
      op(P.q('.int-noite'), 0.45);
      camera(P, 1330, 850, lerp(2.4, 2.3, prog(tl, 0, 2.3)));
    } },
] });
}
