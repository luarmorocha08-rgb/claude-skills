/* invasao — Cena 2 "Eles chegaram" (23,2 s). Narração começa em 0,3 s.
   Planos: a rua engolida pela sombra → a barriga da nave, naves menores se soltando → gente filmando,
   a nave parada → o celular toca na janela → "Irmã" → no ouvido: "Não sai de…" → chamada encerrada
   → a luz branca atravessa a janela (o branco vira a próxima cena). */
{
const { trilha, E, camera, op, at, ruido, prog, clamp, lerp, tremor, vibra, txt, rand } = K;
const S = 2.0;
const pose = (...ps) => Object.assign({}, ...ps);
const proj = RUA.proj;
const escala = (Z) => (1.7 * RUA.VP.f) / Z / 250;

/* pessoas na rua: [X, Z, tipo, fase] — tipo: 'corre' | 'filma' | 'olha' */
const GENTE = [[-2.5, 14, 'corre', 0], [1.8, 18, 'filma', 1], [3.2, 11, 'olha', 2], [-5.6, 20, 'filma', 3], [0.4, 26, 'corre', 4], [5.8, 16, 'filma', 5], [-1.2, 34, 'olha', 6], [2.6, 40, 'corre', 7]];
const svgGente = (pre) => GENTE.map((g, i) => B.svg(`p${i}`, { roupa: ['#c0392b', '#2f6fd6', '#7d8b9f', '#e0a43a', '#4e8a3a', '#8e5ea2', '#2c3e50', '#d35400'][i], roupaEsc: '#00000055', item: g[2] === 'filma' ? Pr.celular() : '' })).join('');
function posarGente(P, t, olharCima = 1) {
  GENTE.forEach(([X, Z, tipo, f], i) => {
    const g = P.q(`#p${i}`); if (!g) return;
    let x = X, z = Z;
    let p = {};
    if (tipo === 'corre') { x = X + ((t * 1.6 + f) % 6) * (i % 2 ? 1 : -1) * 0.6; p = B.andar(t * 11 + f, 1.6); }
    else if (tipo === 'filma') p = { o: [-6, 118], c: [8, -28], cab: -20, ol: [3, -6], iR: 180 };
    else p = { cab: -26 * olharCima, ol: [1, -5], o: [-8, 8] };
    const [sx, sy] = proj(x, 0, z);
    B.posar(g, pose({ x: sx, y: sy, s: escala(z), d: (tipo === 'corre' ? (i % 2 ? 1 : -1) : (i % 2 ? -1 : 1)) }, p));
  });
}

K.cena('invasao', { planos: [
  /* S1 — a nave chega e a sombra engole a rua */
  { ate: 4.2,
    svg: (pre) => `${RUA.svg(pre, { luz: 'dia' })}
      <g class="naveR">${NAVE.svg(pre)}</g>
      <rect class="sombra" x="-400" y="-400" width="2720" height="900" fill="#25324f" opacity=".7" style="mix-blend-mode:multiply"/>
      <g class="carroF" transform="translate(300,1060) scale(1.5)">${RUA.carro({ cor: '#efede7' })}</g>
      <g class="gente">${svgGente(pre)}</g>`,
    quadro(tl, el, P, t) {
      const k = E.io(prog(t, 0, 3.4));
      at(P.q('.naveR'), 'transform', `translate(960,${lerp(-560, 90, k)}) scale(1.25)`);
      // a borda da sombra vem do horizonte para perto
      const borda = lerp(300, 1200, E.io(prog(t, 0.6, 3.8)));
      at(P.q('.sombra'), 'height', borda + 400);
      posarGente(P, t);
      camera(P, 960, lerp(560, 520, E.sine(prog(tl, 0, 4.2))), lerp(1.02, 1.08, tl / 4.2), 0, [ruido(tl, 1) * 2, ruido(tl, 2) * 2]);
    } },
  /* S2 — a barriga da nave; naves menores se desprendem */
  { ate: 8.6,
    svg: (pre) => `<rect x="-400" y="-400" width="2720" height="1880" fill="url(#${pre}-ceuDia)"/>
      <g class="naveB" transform="translate(960,40) scale(2.6)">${NAVE.svg(pre)}</g>
      ${[0, 1, 2, 3, 4].map((i) => `<g class="nv nv${i}">${NAVE.navinha(pre)}</g>`).join('')}
      <g fill="#1d2433">${Array.from({ length: 12 }, (_, i) => `<polygon points="${i * 180 - 120},1100 ${i * 180 - 30},${980 - (i % 3) * 30} ${i * 180 + 60},1100"/><rect x="${i * 180 - 110}" y="${1000 - (i % 3) * 20}" width="160" height="120"/>`).join('')}
      <rect x="1500" y="880" width="18" height="240"/><rect x="380" y="900" width="16" height="220"/></g>
      <rect x="-400" y="-400" width="2720" height="1880" fill="#2a3756" opacity=".35" style="mix-blend-mode:multiply"/>`,
    quadro(tl, el, P, t) {
      P.qa('.nv').forEach((n, i) => {
        const t0 = 5.0 + i * 0.55; const u = Math.max(0, t - t0);
        const lado = i % 2 ? 1 : -1;
        const x = 960 + lado * (700 + u * (380 + i * 40)); const y = 260 + i * 30 + u * (60 + i * 10) - u * u * 8;
        at(n, 'transform', `translate(${x},${y}) scale(${(0.9 + u * 0.25) * lado},${0.9 + u * 0.25})`);
        op(n, t < t0 ? 0 : E.out(prog(u, 0, 0.3)));
      });
      op(P.q('.naveB .nave-anel'), 0.6 + 0.3 * Math.sin(t * 2.2));
      camera(P, lerp(940, 990, tl / 4.4), lerp(560, 520, tl / 4.4), lerp(1.0, 1.05, tl / 4.4));
    } },
  /* S3 — gente filmando; a nave completamente parada */
  { ate: 11.2,
    svg: (pre) => `${RUA.svg(pre, { luz: 'dia' })}
      <g transform="translate(960,90) scale(1.25)">${NAVE.svg(pre)}</g>
      <rect x="-400" y="-400" width="2720" height="1880" fill="#25324f" opacity=".7" style="mix-blend-mode:multiply"/>
      <g class="frente">${[0, 1, 2, 3].map((i) => B.svg(`f${i}`, { roupa: ['#c0392b', '#7d8b9f', '#e0a43a', '#8e5ea2'][i], roupaEsc: '#00000055', item: Pr.celular({ tela: '#cfeaff' }) })).join('')}</g>
      ${[0, 1, 2, 3].map((i) => `<circle class="brilhoCel bc${i}" r="40" fill="url(#${pre}-glow)" opacity=".5"/>`).join('')}`,
    quadro(tl, el, P, t) {
      const xs = [380, 760, 1220, 1580], ss = [1.5, 1.25, 1.35, 1.6];
      xs.forEach((x, i) => {
        const p = pose({ x, y: 1250, s: ss[i] * 1.75, d: i < 2 ? 1 : -1, o: [-4, 118], c: [6, -28], cab: -20, ol: [3, -6], iR: 180 + Math.sin(tl * 1.3 + i) * 3, lean: -2 });
        B.posar(P.q(`#f${i}`), p);
        const m = B.maoFrente(p); at(P.q(`.bc${i}`), 'cx', m[0]); at(P.q(`.bc${i}`), 'cy', m[1] - 34 * ss[i]);
      });
      camera(P, 960, 520, lerp(1.0, 1.04, tl / 2.6));
    } },
  /* S4 — na janela: o celular toca */
  { ate: 12.4,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', { item: Pr.celular() }) }) +
      `<g class="vib" fill="none" stroke="#141414" stroke-width="5" stroke-linecap="round"><path d="M-30,-20 q-12,20 0,40"/><path d="M-46,-30 q-18,30 0,60"/><path d="M30,-20 q12,20 0,40"/><path d="M46,-30 q18,30 0,60"/></g>`,
    quadro(tl, el, P, t) {
      const v = vibra(t, 11.3, 12.4, 3);
      const p = pose({ x: 960, y: 990, s: S, d: -1, cab: -14 + (t > 11.7 ? 22 : 0) * prog(t, 11.6, 11.9), ol: [3, -4 + 8 * prog(t, 11.6, 11.9)] }, { o: [-6, 26 + 30 * prog(t, 11.6, 12.0)], c: [10, 80], iR: v * 2 });
      B.posar(P.q('#voce'), p);
      const m = B.maoFrente(p);
      at(P.q('.vib'), 'transform', `translate(${m[0]},${m[1]}) scale(${1 + 0.15 * Math.sin(t * 30)})`); op(P.q('.vib'), t > 11.3 ? 1 : 0);
      sombraVista(P, 1);
      camera(P, 900, 610, 1.7);
    } },
  /* S4b — a tela: Irmã */
  { ate: 13.8,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#7d7464"/><g filter="url(#${pre}-desf)" opacity=".6"><rect x="300" y="100" width="600" height="500" fill="#4a5a7a"/></g>
      <g class="cel">${CEL.svg(UI.chamada({ nome: 'Irmã', estado: 'chamada recebida', hora: '9:11' }), { id: 'in4' })}</g>`,
    quadro(tl, el, P, t) {
      const v = vibra(t, 12.4, 13.8, 5);
      at(P.q('.cel'), 'transform', `translate(${960 + v},560) rotate(${-4 + v * 0.3}) scale(.88)`);
      const at2 = P.q('.ui-atender'); at(at2, 'r', 62 + 8 * Math.sin(tl * 8));
      camera(P, 960, 560, lerp(1.0, 1.1, tl / 1.4));
    } },
  /* S4c — no ouvido: "Não sai de…" */
  { ate: 18.4,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', { item: Pr.celular() }) }) +
      `<g class="balao"><path d="M0,0 C-10,-40 30,-80 120,-80 L420,-80 C500,-80 520,-40 520,-10 C520,30 480,50 420,50 L110,50 L40,90 L60,50 C20,46 2,30 0,0 Z" fill="#fff" stroke="#141414" stroke-width="6"/>
       <text class="balaoTxt" x="250" y="0" text-anchor="middle" font-family="Inter" font-weight="600" font-size="50" fill="#141414">Não sai de—</text></g>`,
    quadro(tl, el, P, t) {
      const resp = Math.sin(tl * 2) * 1;
      const p = pose({ x: 920, y: 990, s: S, d: -1, cab: -6 + resp, ol: [4, -1], lean: 3, ab: 1.15, medo: 0.0 }, B.POSES.orelha);
      B.posar(P.q('#voce'), p);
      const cab = B.cabecaMundo(p);
      const kb = E.outBack(prog(t, 16.6, 16.95));
      const corte = t > 17.6 ? 1 : 0;
      const g = P.q('.balao');
      at(g, 'transform', `translate(${cab[0] + 60 + (corte ? ruido(t * 40, 2) * 10 : 0)},${cab[1] - 140}) scale(${0.85 * kb})`);
      op(g, kb * (corte ? (Math.sin(t * 70) > 0 ? 1 : 0.2) * (1 - prog(t, 17.9, 18.3)) : 1));
      const tx = P.q('.balaoTxt');
      const n = Math.floor(clamp(prog(t, 16.65, 17.6)) * 11);
      tx.textContent = 'Não sai de—'.slice(0, Math.max(1, n));
      sombraVista(P, 1);
      camera(P, lerp(1060, 1090, tl / 4.6), lerp(560, 540, tl / 4.6), lerp(1.9, 2.1, E.sine(tl / 4.6)));
    } },
  /* S5 — chamada encerrada */
  { ate: 19.7,
    svg: (pre) => `<rect x="-200" y="-200" width="2320" height="1480" fill="#7d7464"/><g filter="url(#${pre}-desf)" opacity=".6"><rect x="300" y="100" width="600" height="500" fill="#4a5a7a"/></g>
      <g class="cel" transform="translate(960,560) rotate(-4) scale(.88)">${CEL.svg(UI.encerrada({ nome: 'Irmã', hora: '9:12' }), { id: 'in5' })}</g>`,
    quadro(tl, el, P, t) { camera(P, 960, 560, lerp(1.08, 1.16, tl / 1.3)); } },
  /* S6 — a luz branca atravessa a janela */
  { ate: 99,
    svg: (pre) => INT.svg(pre, { vista: INT.vista(pre), atores: B.svg('voce', { item: Pr.celular() }) }) +
      `<polygon class="raio" points="660,190 980,190 1500,990 380,990" fill="url(#${pre}-feixe)" opacity="0" style="mix-blend-mode:screen"/>`,
    quadro(tl, el, P, t) {
      const k = prog(t, 19.9, 22.6);
      const p = pose({ x: 1000, y: 990, s: S, d: -1, cab: lerp(-10, 8, E.out(prog(t, 20.6, 21.2))), ol: [3, -3], ab: lerp(1.2, 0.25, prog(t, 21.6, 22.3)) },
        { o: [-6, lerp(30, 150, E.out(prog(t, 21.4, 21.9)))], c: [10, lerp(80, 50, prog(t, 21.4, 21.9))], iR: 0 });
      B.posar(P.q('#voce'), p);
      sombraVista(P, 1);
      op(P.q('.int-janluz'), E.in(k));
      op(P.q('.raio'), 0.9 * E.in(prog(t, 20.4, 22.4)));
      op(P.q('.int-flash'), E.in(prog(t, 21.8, 23.1)));
      camera(P, 900, 600, lerp(1.45, 1.6, E.sine(tl / 3.5)), 0, tremor(t, 21.8, 6, 14, 2));
    } },
] });

function sombraVista(P, k) {
  const vn = P.q('.vista-nave');
  at(vn, 'transform', 'translate(830,205) scale(.42)');
  op(P.q('.vista-sombra'), 0.75 * k);
}
}
