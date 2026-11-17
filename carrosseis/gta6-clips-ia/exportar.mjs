// Exporta cada slide do carrossel como PNG 1080x1350 em png/.
// Uso: node exportar.mjs   (a partir desta pasta)
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const aqui = path.dirname(fileURLToPath(import.meta.url));
const url = pathToFileURL(path.join(aqui, "carrossel.html")).href + "?render";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
await page.goto(url);
await page.evaluate(() => document.fonts.ready);
const slides = await page.$$(".slide");
for (const [i, s] of slides.entries()) {
  const nome = `png/gta6-clips-ia-${String(i + 1).padStart(2, "0")}.png`;
  await s.screenshot({ path: path.join(aqui, nome) });
  console.log(nome);
}
await browser.close();
