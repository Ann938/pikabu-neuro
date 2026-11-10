// Проверка интерактива лендинга: поле запроса, модели, лента сценариев, FAQ, якоря.
// node scripts/check.mjs
import { chromium } from "playwright";
const b = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(String(e)));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await p.goto("http://localhost:3200/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);

await p.getByRole("button", { name: "Придумать идеи" }).click();
console.log("chip → поле:", await p.locator("#hero-prompt").inputValue());
await p.getByRole("button", { name: /GPT-6 Luna/ }).click();
await p.getByRole("option", { name: "Claude" }).click();
console.log("модель:", (await p.locator("[aria-haspopup=listbox]").innerText()).trim());
const [popup] = await Promise.all([ctx.waitForEvent("page"), p.getByRole("button", { name: "Отправить запрос" }).click()]);
console.log("отправка →", decodeURIComponent(popup.url()).slice(0, 110));
await popup.close();

// сценарии: лента едет вбок, пока экран закреплён
const htrack = p.locator('[data-htrack]');
const x0 = await htrack.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41);
const pinTop = await p.evaluate(() => document.querySelector('[data-hpin]').getBoundingClientRect().top + scrollY);
await p.evaluate((y) => scrollTo(0, y + 900), pinTop);
await p.waitForTimeout(1500);
console.log('лента сценариев x:', Math.round(x0), '→', Math.round(await htrack.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m41)));

// модели: наведение на строку раскрывает описание
await p.locator('#models li').nth(1).hover();
await p.waitForTimeout(600);
console.log('модель при наведении:', await p.locator('#models li').nth(1).innerText().then((t) => t.split("\n").slice(0, 2).join(' / ')));

const visibleBefore = await p.locator("#faq [data-hidden]").count();
await p.getByRole("button", { name: /Показать все 15 вопросов/ }).click();
await p.waitForTimeout(800);
console.log("FAQ скрытых до/после:", visibleBefore, "/", await p.locator("#faq [data-hidden]").count());
await p.getByRole("button", { name: "Что будет, если закончатся кредиты?" }).click();
await p.waitForTimeout(600);
console.log("ответ 14 открыт:", await p.getByRole("button", { name: "Что будет, если закончатся кредиты?" }).getAttribute("aria-expanded"));

await p.locator("header").getByRole("link", { name: "Тарифы" }).click();
await p.waitForTimeout(1800);
console.log("якорь «Тарифы» → top секции:", await p.evaluate(() => Math.round(document.querySelector("#pricing").getBoundingClientRect().top)));
console.log("errors:", errors.length ? errors.join("\n") : "none");
await b.close();
