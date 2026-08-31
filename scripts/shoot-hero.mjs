/**
 * Captures d'écran de la hero à plusieurs instants, pour vérifier les
 * animations sans dépendre d'un œil humain.
 *
 *   node scripts/shoot-hero.mjs [url] [largeur] [hauteur] [instants…]
 */
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer-core";

const [url = "http://localhost:4321/", w = "1440", h = "900", ...rest] =
  process.argv.slice(2);
const times = (rest.length ? rest : ["3", "8", "13", "18", "24", "30"]).map(Number);
const out = "/tmp/hero-shots";

await mkdir(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1"],
});

const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h) });
await page.goto(url, { waitUntil: "networkidle0" });

let previous = 0;
for (const t of times) {
  await new Promise((r) => setTimeout(r, (t - previous) * 1000));
  previous = t;
  const file = `${out}/${w}x${h}-t${String(t).padStart(2, "0")}s.png`;
  await page.screenshot({ path: file });
  console.log(file);
}

await browser.close();
