import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:8080/";
const outDir = path.resolve("screenshots");
await fs.mkdir(outDir, { recursive: true });

const consoleErrors = [];
const pageErrors = [];

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
}

const browser = await chromium.launch();

// desktop 1440
const ctxDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctxDesk.newPage();
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => pageErrors.push(String(e)));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// hero-only
await page.screenshot({ path: path.join(outDir, "fix-hero.png"), fullPage: false });

// how many lines does the h1 wrap to at 1440?
const h1Info = await page.evaluate(() => {
  const el = document.querySelector("h1.display");
  if (!el) return null;
  const style = getComputedStyle(el);
  const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize);
  const rect = el.getBoundingClientRect();
  return {
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    height: Math.round(rect.height),
    approxLines: Math.round(rect.height / lh),
  };
});

// full-page desktop with reveal
await scrollThrough(page);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await scrollThrough(page);
await page.screenshot({ path: path.join(outDir, "fix-desktop.png"), fullPage: true });

// footer viewport shot
await page.evaluate(() => {
  const f = document.querySelector("footer");
  if (f) f.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "fix-footer.png"), fullPage: false });

const desk = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctxDesk.close();

// mobile 390
const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p390 = await ctx390.newPage();
p390.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
p390.on("pageerror", (e) => pageErrors.push(String(e)));
await p390.goto(URL, { waitUntil: "networkidle" });
await p390.waitForTimeout(1800);
await p390.screenshot({ path: path.join(outDir, "fix-hero-mobile.png"), fullPage: false });

const h1Mobile = await p390.evaluate(() => {
  const el = document.querySelector("h1.display");
  if (!el) return null;
  const style = getComputedStyle(el);
  const lh = parseFloat(style.lineHeight) || parseFloat(style.fontSize);
  const rect = el.getBoundingClientRect();
  return { fontSize: style.fontSize, height: Math.round(rect.height), approxLines: Math.round(rect.height / lh) };
});

const mob390 = await p390.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctx390.close();

// mobile 360
const ctx360 = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 });
const p360 = await ctx360.newPage();
p360.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
p360.on("pageerror", (e) => pageErrors.push(String(e)));
await p360.goto(URL, { waitUntil: "networkidle" });
await p360.waitForTimeout(1200);
const mob360 = await p360.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctx360.close();

await browser.close();

console.log("H1_DESKTOP:", JSON.stringify(h1Info));
console.log("H1_MOBILE:", JSON.stringify(h1Mobile));
console.log("OVERFLOW:", JSON.stringify({ desk, mob390, mob360 }));
console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors));
console.log("PAGE_ERRORS:", JSON.stringify(pageErrors));
