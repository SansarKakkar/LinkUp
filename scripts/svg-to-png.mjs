import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, "docs", "screenshots", "architecture.svg");
const pngPath = path.join(__dirname, "docs", "screenshots", "architecture.png");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`file:///${svgPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.screenshot({ path: pngPath });
await browser.close();
console.log("Created architecture.png");
