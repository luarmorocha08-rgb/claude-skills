/* Clips de GTA 6 com IA — animação pura em função do tempo (render(t)). */
const T = 70.0;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const pr = (t, a, b) => cl((t - a) / (b - a));
const eo = x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x) * (1 - x * 0.0) ; // outExpo
const eoN = x => x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.pow(2, -10 * x)) / (1 - Math.pow(2, -10));
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const ein = x => x * x * x;
const lerp = (a, b, k) => a + (b - a) * k;
const mola = (x, f = 1.5, d = 6) => x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(2 * Math.PI * f * x);
function hash(i) { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

function set(el, { o = 1, x = 0, y = 0, s = 1, r = 0, b = 0, extra = '' } = {}) {
  el.style.opacity = o.toFixed(4);
  el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${s.toFixed(4)}) rotate(${r.toFixed(3)}deg) ${extra}`;
  el.style.filter = b > 0.05 ? `blur(${b.toFixed(2)}px)` : 'none';
}
/* entrada do desfoque + saída acelerando */
function vis(el, t, tin, tout, op = {}) {
  const { dy = 26, dur = 0.6, blur = 14, s0 = 1, x0 = 0, odur = 0.25, mola: m = false } = op;
  const k = pr(t, tin, tin + dur), e = eoN(k);
  const ko = tout == null ? 0 : ein(pr(t, tout - odur, tout));
  const ks = m ? mola(pr(t, tin, tin + 1.1)) : e;
  set(el, {
    o: cl(pr(t, tin, tin + dur * 0.35)) * (1 - ko),
    x: x0 * (1 - e), y: dy * (1 - e) - 30 * ko,
    s: lerp(s0, 1, ks) * (1 + 0.04 * ko),
    b: blur * (1 - eoN(pr(t, tin, tin + dur * 0.8))) + 12 * ko,
  });
  return e * (1 - ko);
}

/* divide um título em palavras preservando <em> */
function palavras(el) {
  const out = [];
  const walk = (node, em) => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const parts = n.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = p; frag.appendChild(s); out.push(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n, em || n.tagName === 'EM');
    });
  };
  walk(el, false);
  return out;
}
function cascata(ws, t, t0, tout, passo = 0.06) {
  ws.forEach((w, i) => vis(w, t, t0 + i * passo, tout, { dy: 22, dur: 0.55, blur: 10 }));
}

/* ---------- cenas ---------- */
const CENAS = [
  { id: 'c1', a: 0, b: 6.7, pil: 'GTA 6 · IA', sub: 'intro' },
  { id: 'c2', a: 6.7, b: 18.4, pil: 'POR QUE AGORA', sub: 'intro' },
  { id: 'c3', a: 18.4, b: 24.4, pil: 'PASSO 1 · GRAVAR', sub: 'passo 1/5', n: '01', step: 0 },
  { id: 'c4', a: 24.4, b: 33.4, pil: 'PASSO 2 · CORTAR', sub: 'passo 2/5', n: '02', step: 1 },
  { id: 'c5', a: 33.4, b: 41.0, pil: 'PASSO 3 · GANCHO', sub: 'passo 3/5', n: '03', step: 2 },
  { id: 'c6', a: 41.0, b: 49.4, pil: 'PASSO 4 · POSTAR', sub: 'passo 4/5', n: '04', step: 3 },
  { id: 'c7', a: 49.4, b: 57.8, pil: 'PASSO 5 · RECEBER', sub: 'passo 5/5', n: '05', step: 4 },
  { id: 'c8', a: 57.8, b: 62.7, pil: 'ANTES DE COMEÇAR', sub: 'atenção' },
  { id: 'c9', a: 62.7, b: T + 1, pil: 'LANÇAMENTO', sub: 'amanhã' },
];

/* ---------- legenda (falas transcritas e conferidas com o roteiro) ---------- */
const FALAS = `Você@0.0 vai@0.34 jogar@0.52 *GTA@0.76 *6@1.1 e@1.66 ainda@1.88 pode@2.1 *ganhar@2.32 *dinheiro@2.6 com@3.04 isso.@3.3
E@3.86 quem@4.04 vai@4.2 editar@4.4 não@4.82 é@5.08 você,@5.3 é@6.0 a@6.06 *IA.@6.12
O@6.76 primeiro@7.16 trailer@7.4 fez@7.78 mais@8.02 de@8.26 *90@8.38 *milhões@8.7 de@9.02 views@9.3 em@9.5 24@9.7 horas.@10.08
O@10.88 jogo@10.9 sai@11.1 *amanhã@11.42 e@11.92 milhões@12.32 de@12.62 pessoas@12.78 vão@13.08 procurar@13.24 a@13.54 mesma@13.64 coisa@13.82 ao@14.16 mesmo@14.36 tempo.@14.54
A@15.22 *demanda@15.32 já@15.78 existe,@15.96 só@16.76 falta@16.9 quem@17.24 *entregue.@17.54
Passo@18.56 1.@18.98 Grave@19.56 sessões@19.76 *longas.@20.14 Não@20.78 fique@20.88 caçando@21.08 o@21.5 momento@21.62 certo.@21.76
Quem@22.44 encontra@22.66 o@23.12 momento@23.22 é@23.42 a@23.62 *IA.@23.86
Passo@24.5 2.@24.92 Sobe@25.68 o@25.92 vídeo@26.04 no@26.26 *OpusClip@26.46 ou@27.32 no@27.62 *Eklipse.@27.8
De@28.26 uma@28.76 hora@28.88 de@29.1 jogo,@29.22 saem@29.6 *dezenas@29.82 de@30.32 clips,@30.46 já@30.96 cortados@31.1 em@31.54 *vertical@31.68 e@32.04 com@32.32 nota@32.46 de@32.68 *viral.@32.88
Passo@33.5 3.@33.86 O@34.54 *gancho@34.7 vale@35.16 mais@35.38 que@35.72 o@35.86 clipe.@35.96
Legenda@36.46 no@36.86 *CapCut,@37.0 voz@37.66 no@37.8 *ElevenLabs@37.96 e@38.42 os@38.68 3@38.8 primeiros@38.92 segundos@39.24 escritos@39.5 pela@40.18 *IA.@40.5
Passo@41.06 4.@41.46 Um@42.12 clipe,@42.24 *3@42.88 *plataformas,@43.06 TikTok,@44.1 Reels,@44.84 Shorts,@45.5 *2@46.16 *a@46.56 *3@46.9 posts@47.22 por@47.52 dia@47.8 nas@48.1 primeiras@48.26 semanas.@48.7
E@49.52 pra@49.66 receber:@49.78 *campanhas@50.22 de@51.04 *clipe@51.18 que@51.52 pagam@51.94 por@52.28 mil@52.48 views,@52.7 *YouTube@53.42 *Shorts,@53.6 *TikTok@54.42 *Creator@54.6 *Rewards@55.58 e@55.96 *afiliados.@56.6
Só@58.04 um@58.48 *cuidado:@58.54 *nunca@59.4 reposte@59.54 clipe@60.08 dos@60.28 outros.@60.48 Grave@61.0 o@61.22 seu,@61.44 com@61.64 a@61.88 sua@62.02 *voz.@62.12
O@62.78 jogo@62.84 sai@63.02 *amanhã.@63.24 Seu@63.94 canal@64.08 pode@64.34 *já@64.62 *estar@64.84 *pronto.@65.02
Comenta@65.62 *GTA@65.88 que@66.18 eu@66.42 te@66.58 mando@66.68 a@66.92 lista@67.0 com@67.12 todas@67.36 as@67.52 ferramentas.@67.74`;

const W = FALAS.split(/\s+/).filter(Boolean).map(s => {
  const [w, tt] = s.split('@'); const hl = w.startsWith('*');
  return { w: hl ? w.slice(1) : w, t: +tt, hl };
});
/* blocos de até 4 palavras, quebrando na pontuação e nas pausas */
const BLOCOS = [];
{
  let cur = [];
  W.forEach((x, i) => {
    cur.push(x);
    const prox = W[i + 1];
    const pont = /[.,:]$/.test(x.w);
    const pausa = prox && prox.t - x.t > 0.6;
    const cola = prox && /^GTA$/.test(x.w);
    const len = cur.reduce((a, c) => a + c.w.length + 1, 0);
    if (!prox || (!cola && ((pont && cur.length >= 2) || cur.length >= 4 || pausa || len > 20))) { BLOCOS.push(cur); cur = []; }
  });
}
function montarLegenda() {
  const leg = $('#legenda');
  BLOCOS.forEach((bl, bi) => {
    const d = document.createElement('div'); d.className = 'bloco abs'; d.style.cssText = 'left:0;top:0;width:940px';
    bl.forEach(x => {
      const s = document.createElement('span'); s.className = 'lw';
      if (x.hl) { const c = document.createElement('i'); c.className = 'cx'; s.appendChild(c); }
      const tx = document.createElement('span'); tx.textContent = x.w; s.appendChild(tx);
      if (x.hl) tx.style.color = '#14100a';
      d.appendChild(s); x.el = s; x.cx = s.querySelector('.cx');
    });
    d.style.font = "700 70px/1.18 'DM Sans'"; d.style.letterSpacing = '-.01em';
    leg.appendChild(d); bl.el = d;
    bl.ini = bl[0].t; bl.fim = BLOCOS.length > bi ? null : null;
  });
  BLOCOS.forEach((bl, i) => { bl.fim = i + 1 < BLOCOS.length ? BLOCOS[i + 1].ini : T; });
}
function legenda(t) {
  BLOCOS.forEach(bl => {
    const fimVis = Math.min(bl.fim, bl[bl.length - 1].t + 1.6);
    const ativo = t >= bl.ini - 0.08 && t < fimVis + 0.02;
    if (!ativo) { bl.el.style.opacity = 0; return; }
    const ko = ein(pr(t, fimVis - 0.14, fimVis));
    bl.el.style.opacity = (1 - ko).toFixed(3);
    bl.el.style.filter = ko > 0.02 ? `blur(${(8 * ko).toFixed(2)}px)` : 'none';
    bl.el.style.transform = `translateY(${(-14 * ko).toFixed(2)}px)`;
    bl.forEach(x => {
      const k = pr(t, x.t - 0.06, x.t + 0.22), e = eoN(k);
      x.el.style.opacity = cl(k * 2.2).toFixed(3);
      x.el.style.transform = `translateY(${(18 * (1 - e)).toFixed(2)}px)`;
      x.el.style.filter = e < 0.97 ? `blur(${(7 * (1 - e)).toFixed(2)}px)` : 'none';
      if (x.cx) x.cx.style.transform = `scaleX(${eoN(pr(t, x.t, x.t + 0.25)).toFixed(4)})`;
    });
  });
}

/* ---------- montagem ---------- */
let TIT = {};
function montar() {
  ['c3tit', 'c4tit', 'c5tit', 'c6tit', 'c7tit', 'c8tit', 'c9l1', 'c9l2'].forEach(id => TIT[id] = palavras($('#' + id)));
  montarLegenda();
  [['c3','01'],['c4','02'],['c5','03'],['c6','04']].forEach(([id,n]) => {
    const d = document.createElement('div'); d.className = 'passoG abs';
    d.style.cssText = 'left:0;right:0;top:400px;text-align:center';
    d.innerHTML = `<div class="rot" style="color:#eaa83c;font-size:30px;letter-spacing:.4em">PASSO</div><div style="font:italic 500 420px/1 'Newsreader';color:#f4efe6;margin-top:10px;text-shadow:0 0 80px rgba(234,168,60,.35)">${n}</div>`;
    $('#' + id).appendChild(d);
  });
  // pílulas
  const pil = $('#pilula');
  CENAS.forEach(c => { const d = document.createElement('div'); d.className = 'pil'; d.textContent = c.pil; pil.appendChild(d); c.pilEl = d; });
  // marcos da linha do tempo
  const tempo = $('#tempo'); const rot = ['01 gravar', '02 cortar', '03 gancho', '04 postar', '05 receber'];
  rot.forEach((r, i) => {
    const m = document.createElement('div'); m.className = 'marco'; m.style.left = (i * 25) + '%';
    m.innerHTML = `<i></i><u>${r}</u>`; tempo.appendChild(m);
    const u = m.querySelector('u'); u.style.left = '20px'; u.style.transform = i === 0 ? 'translateX(0)' : i === 4 ? 'translateX(-100%)' : 'translateX(-50%)';
  });
  tempo.appendChild($('#ponto'));
  // brasas
  const br = $('#brasas');
  for (let i = 0; i < 26; i++) { const d = document.createElement('i'); d.className = 'brasa'; br.appendChild(d); }
  // cena 3: barras do gameplay
  const cb = $('#c3barras'); const picos = [6, 15, 24, 33, 41];
  for (let i = 0; i < 46; i++) {
    const d = document.createElement('i'); const pico = picos.includes(i);
    const h = pico ? 0.92 + 0.08 * hash(i) : 0.18 + 0.42 * hash(i) * (0.6 + 0.4 * Math.sin(i * 0.7) ** 2);
    d.style.cssText = `position:absolute;bottom:0;left:${i * (860 / 46)}px;width:${860 / 46 - 6}px;height:${(h * 100).toFixed(1)}%;border-radius:5px;background:#3a4152;transform-origin:bottom`;
    d.dataset.pico = pico ? 1 : 0; cb.appendChild(d);
  }
  // cena 4: grade de clips
  const g = $('#c4grade'); const notas = [71, 94, 63, 82, 58, 89, 66, 77, 91, 60, 74, 68];
  const cores = [['#ff6aa2', '#5b2a86'], ['#f6a04d', '#7a2c5c'], ['#4fc3e8', '#2a3a86'], ['#c86bff', '#2c1f5c'], ['#ff8a5c', '#5a2040'], ['#59d6b5', '#1f4a5c']];
  for (let i = 0; i < 12; i++) {
    const c = cores[i % 6]; const col = i % 6, lin = Math.floor(i / 6);
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${col * 160}px;top:${lin * 268}px;width:140px;height:249px;border-radius:14px;overflow:hidden;background:linear-gradient(${150 + i * 17}deg,${c[0]},${c[1]} 70%,#11131c);border:2px solid rgba(255,255,255,.12)`;
    d.innerHTML = `<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(0,0,0,.55))"></div>
      <div class="tag" style="position:absolute;left:10px;top:10px;font:400 16px 'DM Mono';color:#fff;opacity:.8">9:16</div>
      <div class="nota" style="position:absolute;left:10px;bottom:10px;padding:4px 10px;border-radius:8px;background:rgba(12,15,22,.8);font:700 26px 'DM Sans';color:#fff">0</div>`;
    d.dataset.nota = notas[i]; g.appendChild(d);
  }
  // cena 5: onda de voz
  const on = $('#c5onda'); for (let i = 0; i < 22; i++) { const d = document.createElement('i'); d.style.cssText = 'display:block;flex:1;height:100%;border-radius:4px;background:#eaa83c;transform-origin:center'; on.appendChild(d); }
  // cena 6: colunas e semana
  const cc = $('#c6cols'); ['TikTok', 'Reels', 'Shorts'].forEach((n, i) => {
    const d = document.createElement('div'); d.className = 'col';
    d.style.cssText = 'position:absolute;left:440px;top:0;width:200px;height:356px;border-radius:22px;overflow:hidden;border:2px solid rgba(255,255,255,.14);background:linear-gradient(160deg,#f6a04d,#7a2c5c 60%,#141826)';
    d.innerHTML = `<img src="assets/gta6-logo.png" style="position:absolute;left:30px;top:110px;width:140px;opacity:.6">`;
    cc.appendChild(d);
    const l = document.createElement('div'); l.className = 'colrot';
    l.style.cssText = `position:absolute;top:372px;width:200px;text-align:center;font:500 36px 'DM Sans'`; l.textContent = n; cc.appendChild(l);
  });
  const dias = $('#c6dias'); const qtd = [2, 3, 2, 3, 3, 2, 3]; const letra = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  let ord = 0;
  qtd.forEach((q, i) => {
    const col = document.createElement('div'); col.style.cssText = `position:absolute;left:${i * 124}px;top:0;width:100px;height:130px`;
    col.innerHTML = `<div style="position:absolute;bottom:0;width:100%;text-align:center;font:400 22px 'DM Mono';color:#8f95a3">${letra[i]}</div>`;
    for (let k = 0; k < q; k++) { const p = document.createElement('i'); p.className = 'post'; p.dataset.ord = ord++; p.style.cssText = `position:absolute;left:14px;width:72px;height:24px;border-radius:8px;background:#eaa83c;bottom:${40 + k * 30}px`; col.appendChild(p); }
    dias.appendChild(col);
  });
  // cena 7: ranking
  const rk = $('#c7rank');
  const linhas = [
    ['Campanhas de clipping', 'pagam por mil views', 'MAIS RÁPIDO', 50.22, ['#b97a22', '#f2b552']],
    ['YouTube Shorts', 'programa de parcerias', '', 53.42, ['#5b4a2a', '#a7823f']],
    ['TikTok Creator Rewards', 'vídeos com mais de 1 min', '', 54.42, ['#3f3a33', '#7f6a46']],
    ['Afiliados', 'link de controle e headset', '', 56.6, ['#2f3240', '#565b6c']],
  ];
  linhas.forEach((l, i) => {
    const r = document.createElement('div'); r.className = 'linha';
    r.style.cssText = `position:absolute;left:0;top:${i * 156}px;width:1080px;height:136px`;
    r.innerHTML = `<div class="faixa" style="position:absolute;left:0;top:18px;height:100px;width:1010px;border-radius:0 18px 18px 0;background:linear-gradient(90deg,${l[4][0]},${l[4][1]});transform-origin:left"></div>
      <div class="cart" style="position:absolute;left:92px;top:8px;height:120px;width:640px;border-radius:16px;background:#f4efe6;color:#14100a;padding:18px 26px;box-shadow:0 14px 30px rgba(0,0,0,.4)">
        <div style="font:700 38px/1.1 'DM Sans'">${l[0]}</div><div style="font:400 22px 'DM Mono';letter-spacing:.06em;margin-top:10px;color:#5b5346">${l[1]}</div></div>
      <div style="position:absolute;left:62px;top:0;width:50px;height:50px;border-radius:50%;background:#0c0f16;border:2px solid #eaa83c;color:#eaa83c;display:grid;place-items:center;font:400 26px 'DM Mono'">${i + 1}</div>
      ${l[2] ? `<div class="flag" style="position:absolute;left:770px;top:44px;padding:10px 18px;border-radius:10px;background:#0c0f16;color:#eaa83c;font:400 22px 'DM Mono';letter-spacing:.12em">${l[2]}</div>` : ''}`;
    r.dataset.t = l[3]; rk.appendChild(r);
  });
}

/* ---------- quadro ---------- */
function render(t) {
  // fundo vivo
  const cena = CENAS.find(c => t >= c.a && t < c.b) || CENAS[CENAS.length - 1];
  set($('#luz'), { o: 0.85 + 0.15 * Math.sin(t * 0.9), x: 60 * Math.sin(t * 0.21), y: 40 * Math.cos(t * 0.17) - 60, s: 1 + 0.04 * Math.sin(t * 0.33) });
  $$('.brasa').forEach((b, i) => {
    const vx = hash(i + 3), sp = 18 + 30 * hash(i + 9), y0 = hash(i + 21) * 1500;
    const y = 1450 - ((y0 + sp * t) % 1300); const x = 60 + vx * 960 + 20 * Math.sin(t * 0.6 + i);
    const o = (0.25 + 0.6 * hash(i + 40)) * (0.6 + 0.4 * Math.sin(t * (0.8 + hash(i) ) + i)) * cl((1450 - y) / 200) * cl((y - 260) / 200);
    set(b, { o, x, y, s: 0.5 + hash(i + 7) });
  });
  // numeral de fundo
  const num = $('#numeral');
  const nc = CENAS.find(c => c.n && t >= c.a - 0.1 && t < c.b + 0.1);
  if (nc) { num.textContent = nc.n; const k = eoN(pr(t, nc.a, nc.a + 0.9)), ko = ein(pr(t, nc.b - 0.3, nc.b)); set(num, { o: 0.07 * k * (1 - ko), y: 40 * (1 - k) - 20 * pr(t, nc.a, nc.b), b: 20 * (1 - k) + 20 * ko }); }
  else num.style.opacity = 0;
  // pílula e subtítulo
  CENAS.forEach((c, i) => {
    const tin = i === 0 ? -1 : c.a, tout = c.b >= T ? null : c.b;
    if (t < tin - 0.01 || (tout != null && t > tout)) { c.pilEl.style.opacity = 0; return; }
    vis(c.pilEl, t, tin, tout, { dy: 0, x0: 30, dur: 0.5, blur: 8, odur: 0.2 });
  });
  $('#subd').innerHTML = `<i>${cena.sub}</i>`;
  $('#regua2').style.width = (968 * cl(t / 68.4)).toFixed(1) + 'px';
  // linha do tempo
  let pos = 0, aceso = -1;
  CENAS.forEach(c => { if (c.step != null && t >= c.a) { aceso = c.step; } });
  const passos = CENAS.filter(c => c.step != null);
  pos = 0; passos.forEach(c => { pos = lerp(pos, c.step, eio(pr(t, c.a - 0.2, c.a + 0.5))); });
  
  const larg = 940;
  $('#ponto').style.left = (pos / 4 * larg).toFixed(1) + 'px';
  $('#ponto').style.opacity = (0.55 + 0.45 * eoN(pr(t, 18.2, 18.8))).toFixed(3);
  $('#trilhoOuro').style.width = (cl(pos / 4) * larg).toFixed(1) + 'px';
  $$('.marco').forEach((m, i) => {
    const on = cl(pos - i + 1);
    m.querySelector('i').style.background = on > 0.5 ? '#eaa83c' : '#3a3f4c';
    m.querySelector('u').style.color = Math.abs(pos - i) < 0.5 ? '#f4efe6' : on > 0.5 ? '#c99543' : '#5b6170';
  });

  // cenas
  CENAS.forEach(c => {
    const el = $('#' + c.id); const on = t >= c.a - 0.05 && t < c.b + 0.02;
    el.style.opacity = on ? 1 : 0; el.style.visibility = on ? 'visible' : 'hidden';
    if (on) {
      const s = 1 + 0.025 * pr(t, c.a, c.b);
      el.style.transform = `scale(${s.toFixed(4)})`; el.style.transformOrigin = '540px 760px';
      FX[c.id](t, c.a, Math.min(c.b, T + 1));
    }
  });
  legenda(t);
}

const PASSO = { c3: [18.5, 19.45], c4: [24.45, 25.6], c5: [33.45, 34.45], c6: [41.0, 42.05] };
function passoG(id, t) { const el = $('#' + id + ' .passoG'); const [a, b] = PASSO[id];
  if (t > b + 0.01) { el.style.opacity = 0; return; } vis(el, t, a, b, { dy: 40, s0: 1.08, blur: 20, dur: 0.6, odur: 0.3 }); }
const FX = {
  c1(t, a, b) {
    const logo = $('#c1logo');
    const k = eoN(pr(t, 0.0, 0.9)), m = eio(pr(t, 3.75, 4.45)), ko = ein(pr(t, b - 0.25, b));
    set(logo, { o: cl(t / 0.3) * (1 - ko), y: 30 * (1 - k) - 70 * m - 30 * ko, s: lerp(1.12, 1, k) * lerp(1, 0.78, m), b: 26 * (1 - k) + 12 * ko });
    logo.style.filter += ` drop-shadow(0 0 ${(40 + 20 * Math.sin(t * 2)).toFixed(1)}px rgba(234,168,60,.35))`;
    vis($('#c1card'), t, 3.86, b, { dy: 50, s0: 0.96, mola: true });
    vis($('#c1r1'), t, 4.04, b, { dy: 20 });
    const rk = eoN(pr(t, 4.9, 5.45));
    $('#c1risco').style.width = (790 * rk).toFixed(1) + 'px';
    $('#c1r1').style.opacity = (parseFloat($('#c1r1').style.opacity) * (1 - 0.55 * rk)).toFixed(3);
    vis($('#c1r2'), t, 5.95, b, { dy: 30, s0: 0.9, mola: true, blur: 10 });
  },
  c2(t, a, b) {
    // fase A
    vis($('#c2rot'), t, 6.76, 10.75);
    vis($('#c2num'), t, 7.16, 10.75, { dy: 40, s0: 1.06, blur: 22, dur: 0.8 });
    $('#c2n').textContent = Math.round(90 * eoN(pr(t, 7.4, 8.7)));
    vis($('#c2views'), t, 9.3, 10.75);
    // fase B
    vis($('#c2data'), t, 10.88, 15.1, { dy: 40, mola: true, s0: 0.95 });
    vis($('#c2busca'), t, 12.3, 15.1, { dy: 30 });
    const q = 'gta 6 '; const n = Math.floor(q.length * pr(t, 12.5, 13.0));
    $('#c2q').textContent = q.slice(0, n);
    $('#c2cur').style.opacity = (0.55 + 0.45 * Math.cos(t * 7)).toFixed(3);
    [13.24, 13.54, 13.82, 14.16].forEach((tt, i) => vis($('#c2s' + (i + 1)), t, tt, 15.1, { dy: 0, x0: -40, dur: 0.5 }));
    // fase C
    vis($('#c2barras'), t, 15.22, b, { dy: 30 });
    $('#c2b1').style.transform = `scaleX(${eoN(pr(t, 15.32, 16.3)).toFixed(4)})`; $('#c2b1').style.transformOrigin = 'left';
    $('#c2b1t').style.opacity = pr(t, 15.9, 16.2);
    $('#c2b2').style.transform = `scaleX(${eoN(pr(t, 16.9, 17.5)).toFixed(4)})`; $('#c2b2').style.transformOrigin = 'left';
    $('#c2b2t').style.opacity = pr(t, 17.4, 17.8);
  },
  c3(t, a, b) {
    passoG('c3', t);
    cascata(TIT.c3tit, t, 19.5, b);
    vis($('#c3card'), t, 19.35, b, { dy: 60, s0: 0.97, dur: 0.7 });
    const sec = Math.round(3600 * eio(pr(t, 19.5, 22.3)));
    const hh = String(Math.floor(sec / 3600)).padStart(2, '0'), mm = String(Math.floor(sec / 60) % 60).padStart(2, '0'), ss = String(sec % 60).padStart(2, '0');
    $('#c3tempo').textContent = `${hh}:${mm}:${ss}`;
    $('#c3rec').style.opacity = (0.55 + 0.45 * Math.cos(t * 5)).toFixed(3);
    const prog = pr(t, 19.4, 22.3); const ia = eoN(pr(t, 22.44, 23.0));
    $$('#c3barras i').forEach((d, i) => {
      const k = eoN(pr(prog * 46, i, i + 2.5));
      const pico = d.dataset.pico === '1';
      d.style.transform = `scaleY(${(k * (1 + (pico ? 0.03 * Math.sin(t * 3 + i) * ia : 0))).toFixed(4)})`;
      d.style.opacity = (pico ? 1 : 1 - 0.6 * ia).toFixed(3);
      d.style.background = pico && ia > 0.02 ? `rgb(${Math.round(lerp(58, 234, ia))},${Math.round(lerp(65, 168, ia))},${Math.round(lerp(82, 60, ia))})` : '#3a4152';
      d.style.boxShadow = pico ? `0 0 ${(30 * ia).toFixed(1)}px rgba(234,168,60,${(0.6 * ia).toFixed(2)})` : 'none';
    });
    $('#c3leg').style.opacity = (eoN(pr(t, 19.0, 19.6)) * (1 - pr(t, 22.3, 22.5))).toFixed(3);
    vis($('#c3ia'), t, 22.66, b, { dy: 20, s0: 0.9, mola: true });
  },
  c4(t, a, b) {
    passoG('c4', t);
    cascata(TIT.c4tit, t, 28.26, b);
    vis($('#c4t1'), t, 26.46, b, { dy: 24, s0: 0.92, mola: true });
    vis($('#c4t2'), t, 27.8, b, { dy: 24, s0: 0.92, mola: true });
    vis($('#c4up'), t, 25.68, 29.75, { dy: 40 });
    const pc = eio(pr(t, 25.95, 28.9));
    $('#c4bar').style.width = (868 * pc).toFixed(1) + 'px'; $('#c4pct').textContent = Math.round(100 * pc) + '%';
    const top = [1, 8, 5];
    $$('#c4grade > div').forEach((d, i) => {
      const t0 = 29.7 + i * 0.07;
      const k = vis(d, t, t0, b, { dy: 40, s0: 0.9, dur: 0.6, blur: 12 });
      const nt = 32.46 + (i % 6) * 0.04;
      const nk = eoN(pr(t, nt, nt + 0.5));
      const nota = d.querySelector('.nota'); nota.textContent = Math.round(+d.dataset.nota * nk);
      nota.style.opacity = cl(pr(t, nt - 0.05, nt + 0.1));
      d.querySelector('.tag').style.opacity = 0.85 * pr(t, 31.6, 31.9);
      const eh = top.includes(i), dm = eio(pr(t, 32.85, 33.35));
      d.style.borderColor = eh ? `rgba(234,168,60,${(0.12 + 0.88 * dm).toFixed(2)})` : 'rgba(255,255,255,.12)';
      d.style.boxShadow = eh ? `0 0 ${(40 * dm).toFixed(1)}px rgba(234,168,60,.5)` : 'none';
      if (!eh) d.style.opacity = (parseFloat(d.style.opacity) * (1 - 0.55 * dm)).toFixed(3);
      if (eh) { nota.style.background = `rgba(${Math.round(lerp(12,234,dm))},${Math.round(lerp(15,168,dm))},${Math.round(lerp(22,60,dm))},${lerp(.8,1,dm).toFixed(2)})`; const c = Math.round(lerp(255,20,dm)); nota.style.color = `rgb(${c},${c},${c})`; }
    });
  },
  c5(t, a, b) {
    passoG('c5', t);
    cascata(TIT.c5tit, t, 34.54, b);
    vis($('#c5cel'), t, 34.4, b, { dy: 80, s0: 0.94, mola: true, dur: 0.8 });
    const its = $$('#c5lista .c5i');
    [37.0, 37.96, 39.5].forEach((tt, i) => {
      vis(its[i], t, tt - 0.1, b, { dy: 0, x0: 40, dur: 0.55 });
      const ok = its[i].querySelector('.ok'); const m = mola(pr(t, tt + 0.25, tt + 1.2));
      ok.style.font = "700 50px 'DM Sans'"; ok.style.color = '#eaa83c'; ok.style.opacity = cl(pr(t, tt + 0.25, tt + 0.4)); ok.style.transform = `scale(${(0.6 + 0.4 * m).toFixed(3)})`;
    });
    vis($('#c5leg'), t, 37.0, b, { dy: 16, dur: 0.4 });
    const ok = pr(t, 37.9, 38.2);
    $$('#c5onda i').forEach((d, i) => { d.style.transform = `scaleY(${(0.15 + ok * (0.25 + 0.6 * Math.abs(Math.sin(t * 6 + i * 0.9) * Math.sin(t * 2.3 + i * 0.4)))).toFixed(3)})`; d.style.opacity = 0.3 + 0.7 * ok; });
    const g = $('#c5gancho'); const gk = eoN(pr(t, 38.8, 39.4));
    g.style.clipPath = `inset(0 ${(100 * (1 - gk)).toFixed(2)}% 0 0 round 16px)`;
    g.style.boxShadow = `0 0 ${(30 * gk * (0.7 + 0.3 * Math.sin(t * 2.4))).toFixed(1)}px rgba(234,168,60,.55)`;
  },
  c6(t, a, b) {
    passoG('c6', t);
    cascata(TIT.c6tit, t, 42.12, b);
    const cols = $$('#c6cols .col'), rots = $$('#c6cols .colrot');
    const sp = eio(pr(t, 42.88, 43.7)); const xs = [150, 440, 730];
    const lt = [44.1, 44.84, 45.5];
    cols.forEach((c, i) => {
      const k = eoN(pr(t, 42.12, 42.8)), ko = ein(pr(t, b - 0.25, b));
      const x = lerp(440, xs[i], sp) - 440;
      const rot = (i - 1) * 4 * (1 - sp) * k;
      set(c, { o: (i === 1 ? 1 : cl(sp * 3)) * cl(k * 2) * (1 - ko), x, y: 40 * (1 - k) - 30 * ko, s: lerp(0.9, 1, k), r: rot, b: 12 * (1 - k) + 12 * ko });
      c.style.zIndex = i === 1 ? 2 : 1;
      const hk = pr(t, lt[i], lt[i] + 0.25) * (1 - pr(t, lt[i] + 0.9, lt[i] + 1.4));
      c.style.borderColor = `rgba(234,168,60,${(0.14 + 0.86 * hk).toFixed(2)})`;
      c.style.boxShadow = `0 0 ${(50 * hk).toFixed(1)}px rgba(234,168,60,.45)`;
      rots[i].style.left = xs[i] + 'px';
      vis(rots[i], t, lt[i], b, { dy: 16, dur: 0.45 });
    });
    vis($('#c6sem'), t, 46.0, b, { dy: 40 });
    $$('#c6dias .post').forEach(p => {
      const tt = 46.3 + (+p.dataset.ord) * 0.13; const m = mola(pr(t, tt, tt + 0.9));
      p.style.opacity = cl(pr(t, tt, tt + 0.08)); p.style.transform = `scale(${(0.7 + 0.3 * m).toFixed(3)})`;
    });
  },
  c7(t, a, b) {
    cascata(TIT.c7tit, t, 49.52, b);
    $$('#c7rank .linha').forEach((r, i) => {
      const tt = +r.dataset.t;
      vis(r, t, tt - 0.15, b, { dy: 30, dur: 0.6 });
      r.querySelector('.faixa').style.transform = `scaleX(${eoN(pr(t, tt - 0.1, tt + 0.7)).toFixed(4)})`;
      const ct = r.querySelector('.cart'); const m = mola(pr(t, tt, tt + 1.0));
      ct.style.transform = `translateX(${(-30 * (1 - m)).toFixed(2)}px)`;
      const f = r.querySelector('.flag'); if (f) { const fm = mola(pr(t, tt + 0.6, tt + 1.5)); f.style.opacity = cl(pr(t, tt + 0.6, tt + 0.7)); f.style.transform = `scale(${(0.8 + 0.2 * fm).toFixed(3)}) rotate(-3deg)`; }
    });
  },
  c8(t, a, b) {
    cascata(TIT.c8tit, t, 58.04, b);
    vis($('#c8a'), t, 58.4, b, { dy: 40 });
    const sk = pr(t, 59.45, 59.75), sm = mola(pr(t, 59.45, 60.4), 1.6, 7);
    set($('#c8selo'), { o: cl(sk * 3), s: lerp(1.8, 1, sm), r: -7, b: 8 * (1 - cl(sk * 2)) });
    const fl = Math.exp(-6 * Math.max(0, t - 59.6)) * (t > 59.6 ? 1 : 0);
    $('#c8a').style.boxShadow = `0 0 ${(60 * fl).toFixed(1)}px rgba(229,83,75,.5),0 30px 60px rgba(0,0,0,.45)`;
    vis($('#c8b'), t, 61.0, b, { dy: 50, s0: 0.95, mola: true });
  },
  c9(t, a, b) {
    const logo = $('#c9logo'); const k = eoN(pr(t, 62.8, 63.6));
    set(logo, { o: cl(pr(t, 62.8, 63.0)), y: 30 * (1 - k), s: lerp(1.1, 1, k) * (1 + 0.015 * Math.sin(t * 1.3)), b: 16 * (1 - k) });
    cascata(TIT.c9l1, t, 62.78, null, 0.08);
    cascata(TIT.c9l2, t, 63.94, null, 0.09);
    vis($('#c9cta'), t, 65.5, null, { dy: 50, s0: 0.96, mola: true, dur: 0.7 });
    const g = $('#c9gta'); const m = mola(pr(t, 65.88, 66.9), 1.5, 6);
    g.style.transform = `scale(${(0.8 + 0.2 * m) * (1 + 0.02 * Math.sin(t * 2.2))})`;
    g.style.boxShadow = `0 0 ${(50 + 25 * Math.sin(t * 1.7)).toFixed(1)}px rgba(234,168,60,.45)`;
  },
};

window.pronto = document.fonts.ready.then(() => { montar(); render(0); return true; });
window.render = render;
