import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const URL = "http://localhost:8080/";
const outDir = path.resolve("screenshots");
await fs.mkdir(outDir, { recursive: true });

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

const browser = await chromium.launch();

// desktop
const ctxDesk = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctxDesk.newPage();
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => pageErrors.push(String(e)));
page.on("requestfailed", (r) => failedRequests.push(`${r.url()} ${r.failure()?.errorText}`));
page.on("response", (res) => {
  if (res.url().includes("pragma-logo.svg")) {
    console.log("LOGO_RESPONSE:", res.status(), res.url());
  }
});

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

// nav close-up (hero-only shot shows nav)
await page.screenshot({ path: path.join(outDir, "logo-nav.png"), fullPage: false });

const navLogoInfo = await page.evaluate(() => {
  const img = document.querySelector(".nav .logo-img");
  const word = document.querySelector(".nav .logo-word");
  return {
    imgExists: !!img,
    imgSrc: img?.getAttribute("src") || null,
    imgHeight: img ? Math.round(img.getBoundingClientRect().height) : null,
    imgWidth: img ? Math.round(img.getBoundingClientRect().width) : null,
    imgNaturalW: img?.naturalWidth ?? null,
    imgNaturalH: img?.naturalHeight ?? null,
    wordText: word?.textContent || null,
    hasLegacyMark: !!document.querySelector(".nav .logo-mark"),
  };
});

// footer
await page.evaluate(() => document.querySelector("footer")?.scrollIntoView({ block: "end" }));
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "logo-footer.png"), fullPage: false });

const footerLogoInfo = await page.evaluate(() => {
  const img = document.querySelector("footer .logo-img");
  const word = document.querySelector("footer .logo-word");
  return {
    imgExists: !!img,
    imgHeight: img ? Math.round(img.getBoundingClientRect().height) : null,
    imgNaturalW: img?.naturalWidth ?? null,
    wordText: word?.textContent || null,
    hasLegacyMark: !!document.querySelector("footer .logo-mark"),
  };
});

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
await p390.screenshot({ path: path.join(outDir, "logo-nav-mobile.png"), fullPage: false });
const mob390 = await p390.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}));
await ctx390.close();

await browser.close();

console.log("NAV_LOGO:", JSON.stringify(navLogoInfo));
console.log("FOOTER_LOGO:", JSON.stringify(footerLogoInfo));
console.log("OVERFLOW:", JSON.stringify({ desk, mob390 }));
console.log("CONSOLE_ERRORS:", JSON.stringify(consoleErrors));
console.log("PAGE_ERRORS:", JSON.stringify(pageErrors));
console.log("FAILED_REQUESTS:", JSON.stringify(failedRequests));
