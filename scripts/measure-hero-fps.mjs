/**
 * Mesure la fluidité de la hero : distribution des intervalles entre images.
 *
 *   node scripts/measure-hero-fps.mjs [url] [secondes]
 *
 * Un intervalle bien au-delà de 16,7 ms est une image sautée. On regarde la
 * queue de la distribution plutôt que la moyenne : c'est elle qu'on perçoit.
 */
import puppeteer from "puppeteer-core";

const [url = "http://localhost:4321/", secs = "6"] = process.argv.slice(2);

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: [
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    // Sans ça, le rendu logiciel du mode headless plafonne artificiellement.
    "--enable-gpu-rasterization",
    "--use-gl=swiftshader",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));

const gaps = await page.evaluate((duration) => {
  return new Promise((resolve) => {
    const stamps = [];
    const tick = (t) => {
      stamps.push(t);
      if (t - stamps[0] < duration * 1000) requestAnimationFrame(tick);
      else {
        const out = [];
        for (let i = 1; i < stamps.length; i++) out.push(stamps[i] - stamps[i - 1]);
        resolve(out);
      }
    };
    requestAnimationFrame(tick);
  });
}, Number(secs));

gaps.sort((a, b) => a - b);
const at = (q) => gaps[Math.min(gaps.length - 1, Math.floor(gaps.length * q))];
const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;

console.log(`images        : ${gaps.length}`);
console.log(`moyenne       : ${mean.toFixed(1)} ms  (${(1000 / mean).toFixed(1)} i/s)`);
console.log(`médiane       : ${at(0.5).toFixed(1)} ms`);
console.log(`p90           : ${at(0.9).toFixed(1)} ms`);
console.log(`p99           : ${at(0.99).toFixed(1)} ms`);
console.log(`pire          : ${gaps[gaps.length - 1].toFixed(1)} ms`);
console.log(`> 25 ms       : ${gaps.filter((g) => g > 25).length}`);
console.log(`> 50 ms       : ${gaps.filter((g) => g > 50).length}`);

await browser.close();
