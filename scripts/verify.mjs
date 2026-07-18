import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:8080/";
const outDir = path.resolve("screenshots");
await fs.mkdir(outDir, { recursive: true });

const consoleErrors = [];
const pageErrors = [];

const browser = await chromium.launch();

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
}

async function measureOverflow(page, w) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  return await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
}

// ---- DESKTOP ----
const ctxDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctxDesk.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
page.on("pageerror", (err) => pageErrors.push(String(err)));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// hero-only
await page.screenshot({ path: path.join(outDir, "batch-hero.png"), fullPage: false });

// cases section
const casesEl = await page.$("#cases");
if (casesEl) {
  await casesEl.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, "batch-cases.png"), fullPage: false });

  // carousel: click next 3 times, then prev 2 times → advanced index=1
  const counterBefore = await page.textContent(".cases-counter");
  await page.click(".case-arrow:nth-of-type(2)"); // next
  await page.waitForTimeout(150);
  const counter1 = await page.textContent(".cases-counter");
  await page.click(".case-arrow:nth-of-type(2)");
  await page.waitForTimeout(150);
  const counter2 = await page.textContent(".cases-counter");
  await page.click(".case-arrow:nth-of-type(2)");
  await page.waitForTimeout(150);
  const counter3 = await page.textContent(".cases-counter");
  // screenshot advanced state
  await page.screenshot({ path: path.join(outDir, "batch-cases-2.png"), fullPage: false });
  // wrap test: from index 3, next twice to hit 4, then 0
  await page.click(".case-arrow:nth-of-type(2)");
  await page.waitForTimeout(150);
  await page.click(".case-arrow:nth-of-type(2)");
  await page.waitForTimeout(150);
  const counterWrap = await page.textContent(".cases-counter");
  // prev from 0 → 4
  await page.click(".case-arrow:nth-of-type(1)");
  await page.waitForTimeout(150);
  const counterPrevWrap = await page.textContent(".cases-counter");

  console.log("CAROUSEL:", { counterBefore, counter1, counter2, counter3, counterWrap, counterPrevWrap });
}

// scroll through to fire reveal, then desktop full page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await scrollThrough(page);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);
// scroll to bottom for full-page capture reveal
await scrollThrough(page);
await page.screenshot({ path: path.join(outDir, "batch-desktop.png"), fullPage: true });

// overflow: 1440
const desk = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));

await ctxDesk.close();

// ---- MOBILE 390 ----
const ctx390 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p390 = await ctx390.newPage();
p390.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
p390.on("pageerror", (err) => pageErrors.push(String(err)));

await p390.goto(URL, { waitUntil: "networkidle" });
await p390.waitForTimeout(1600);
await scrollThrough(p390);
await scrollThrough(p390);
await p390.screenshot({ path: path.join(outDir, "batch-mobile.png"), fullPage: true });
const mob390 = await p390.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctx390.close();

// ---- MOBILE 360 ----
const ctx360 = await browser.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 });
const p360 = await ctx360.newPage();
p360.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});
p360.on("pageerror", (err) => pageErrors.push(String(err)));
await p360.goto(URL, { waitUntil: "networkidle" });
await p360.waitForTimeout(1200);
const mob360 = await p360.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctx360.close();

await browser.close();

console.log("OVERFLOW:", JSON.stringify({ desk, mob390, mob360 }, null, 2));
console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors, null, 2));
console.log("PAGE_ERRORS:", JSON.stringify(pageErrors, null, 2));
