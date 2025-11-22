const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'resources', 'images-base64.json');
const outDir = path.join(__dirname, '..', 'public', 'images', 'products');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(src, 'utf8'));
let written = 0;
for (const [name, b64] of Object.entries(data)) {
  const buf = Buffer.from(b64, 'base64');
  fs.writeFileSync(path.join(outDir, name), buf);
  written++;
}
console.log(`Wrote ${written} images to ${outDir}`);
