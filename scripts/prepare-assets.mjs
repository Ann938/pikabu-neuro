// Готовит исходники из Figma (папка с g00.png…, logo-*.svg, i-*.svg):
// генерации → WebP двух размеров (для окна продукта и для крупных карточек),
// SVG копируются как есть.
// node scripts/prepare-assets.mjs <папка исходников>
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const src = process.argv[2];
const out = path.resolve("public/img");
for (const f of fs.readdirSync(src)) {
  const p = path.join(src, f);
  if (/^g\d+\.png$/.test(f)) {
    const name = f.replace(".png", "");
    await sharp(p).resize({ width: 720 }).webp({ quality: 80 }).toFile(path.join(out, "gallery", `${name}.webp`));
    await sharp(p).resize({ width: 360 }).webp({ quality: 74 }).toFile(path.join(out, "gallery", `${name}-s.webp`));
  } else if (f.endsWith(".svg")) {
    fs.copyFileSync(p, path.join(out, "ui", f));
  } else if (f === "avatar.png") {
    await sharp(p).resize({ width: 96 }).webp({ quality: 82 }).toFile(path.join(out, "ui", "avatar.webp"));
  }
}
const size = (d) => fs.readdirSync(d).reduce((s, f) => s + fs.statSync(path.join(d, f)).size, 0);
console.log("gallery KB", (size(path.join(out, "gallery")) / 1024) | 0, "ui KB", (size(path.join(out, "ui")) / 1024) | 0);
