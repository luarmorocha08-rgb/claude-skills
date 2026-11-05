import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
const SK = '/home/user/claude-skills/.claude/skills/human-motion-design/scripts/lib/';
const { montarFilme } = await import(SK + 'montar.mjs');
const { lerProjeto, resolverProjeto } = await import(SK + 'projeto.mjs');
const { renderizarQuadros } = await import(SK + 'captura.mjs');
const P = resolverProjeto('/home/user/claude-skills/human-output/motion-design/os-que-ficaram-ep3');
const projeto = lerProjeto(P);
const fps = 30;
const { arquivo, linha } = montarFilme(projeto, { montagem: 'principal', formato: '16x9', fps });
console.log('total', linha.total);
const segs = JSON.parse(readFileSync('segs.json', 'utf8'));
const so = process.argv[2] ? process.argv[2].split(',').map(Number) : segs.map((_, i) => i + 1);
const quadros = [];
for (const n of so) {
  const [a, b] = segs[n - 1];
  const dir = path.resolve(`frames/s${String(n).padStart(2, '0')}`); mkdirSync(dir, { recursive: true });
  const f0 = Math.round(a * fps), f1 = Math.round(b * fps);
  for (let f = f0; f < f1; f++) { const destino = path.join(dir, `${String(f - f0).padStart(4, '0')}.png`); if (!existsSync(destino)) quadros.push({ f, t: f / fps, destino }); }
}
console.log('quadros', quadros.length);
let u = 0;
const r = await renderizarQuadros({ arquivo, formato: '16x9', fps, escala: 2, quadros, workers: 4, tipo: 'png',
  aoProgresso: ({ feitos, total, restante }) => { if (Date.now() - u > 15000) { u = Date.now(); console.log(feitos, '/', total, 'faltam', Math.round(restante), 's'); } } });
console.log('erros', r.erros, 'seg', r.segundos);
