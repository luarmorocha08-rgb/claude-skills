/* diagrama — "5 · Diagrama que se mexe" (6,5 s)
   Ideia: o desenho técnico se traça sozinho em linha dourada e, quando fecha, as peças funcionam:
   o bloco desliza no trilho e o ponteiro do relógio acompanha. */
{
const C = 0.866, S = 0.5, U = 50, OX = 270, OY = 300;
const P = (x, y, z) => [OX + (x - y) * C * U, OY + (x + y) * S * U - z * U];
const pt = (p) => p.map((v) => v.toFixed(1)).join(',');
function caixa(x0, x1, y0, y1, z0, z1, cls = '') {
  const topo = [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)];
  const frente = [P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)];
  const lado = [P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)];
  const pol = (q, f) => `<polygon class="face ${f}" points="${q.map(pt).join(' ')}" pathLength="1"/>`;
  return `<g class="peca ${cls}">${pol(lado, 'lado')}${pol(frente, 'frente')}${pol(topo, 'topo')}</g>`;
}
function regua() {
  let d = '';
  for (let i = 0; i <= 32; i++) {
    const x = 1 + i * 0.25, h = i % 4 === 0 ? 0.55 : 0.28;
    const a = P(x, 5, 0.5), b = P(x, 5 - h, 0.5);
    d += `M${pt(a)}L${pt(b)}`;
  }
  return `<path class="tique" d="${d}" pathLength="1"/>`;
}
// o relógio: plano vertical (x, z) em y = 3,6, centro em x = 7, z = 4,4
const [DX, DY] = P(7, 3.6, 4.4);
const DIAL = `<g class="peca dial" transform="matrix(${C},${S},0,1,${DX.toFixed(1)},${DY.toFixed(1)})">
  <circle class="face mostrador" r="56" pathLength="1"/>
  ${Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<line class="marca" x1="${(36 * Math.sin(a)).toFixed(1)}" y1="${(-36 * Math.cos(a)).toFixed(1)}" x2="${(41 * Math.sin(a)).toFixed(1)}" y2="${(-41 * Math.cos(a)).toFixed(1)}"/>`; }).join('')}
  <line class="ponteiro" x1="0" y1="6" x2="0" y2="-34"/><circle class="eixo" r="4"/>
</g>`;
const SVG = `<svg class="d-svg" viewBox="0 0 720 690">
  ${caixa(0, 10, 0, 5, 0, 0.5, 'base')}
  ${regua()}
  ${caixa(1, 9.4, 3.3, 3.9, 0.5, 0.8, 'trilho')}
  ${caixa(0.2, 0.8, 3.3, 3.9, 0.5, 6, 'coluna')}
  ${caixa(0.2, 7.3, 3.35, 3.85, 5.5, 5.9, 'braco')}
  <g class="carro">${caixa(5.8, 7.6, 2.8, 4.4, 0.8, 1.8, 'bloco')}</g>
  ${caixa(6.85, 7.15, 3.45, 3.75, 1.8, 3.6, 'haste')}
  ${DIAL}
</svg>`;
Motion.cena('diagrama', {
  render: () => `
    ${Moldura.html(5)}
    <div class="conteudo">
      <h2 class="titulo-serif frase">Diagramas que<br><em>se mexem</em></h2>
      ${Pecas.contador('Peças', '<span class="n">5</span>', 'd-cont')}
      <div class="vidro d-chip"><span class="mono d-chip-rot">formato</span><span class="d-chip-val">interativo</span></div>
      <div class="vidro d-painel">${SVG}<span class="mono d-rot">desenho que funciona</span></div>
    </div>`,
  poses: {
    inicio: (el, api) => {
      api.$$('.peca').forEach((p, i) => api.set(p, { o: i < 2 ? 1 : 0 }));
      api.$$('.tique').forEach((p) => api.set(p, { o: 0 }));
      el.$('.n').textContent = '1';
    },
    meio: (el, api) => {
      el.$('.carro').setAttribute('transform', `translate(${(-3 * C * U).toFixed(1)},${(-3 * S * U).toFixed(1)})`);
      el.$('.ponteiro').setAttribute('transform', 'rotate(-70)');
    },
  },
  montar(el, api) {
    Moldura.montar(el, api, 5);
    api.tipo.semViuva(el.$('.frase'));
    el.palavras = api.tipo.dividir(el.$('.frase'), { por: 'palavra' });
    el.conteudo = el.$('.conteudo');
  },
});
}
