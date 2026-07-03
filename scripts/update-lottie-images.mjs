import { readFileSync, writeFileSync, statSync } from 'fs';
import { resolve } from 'path';

const projectDir = 'D:/React projects/juanmora-portfolio';

const base64Path = resolve(projectDir, 'scripts/image-bases64.json');
const lottiePath = resolve(projectDir, 'public/documents/lucid-edge-mouse.json');

console.log('Reading image-bases64.json...');
const base64Data = JSON.parse(readFileSync(base64Path, 'utf8'));
console.log(`Found ${base64Data.length} base64 entries.`);

console.log('Reading lucid-edge-mouse.json...');
const lottie = JSON.parse(readFileSync(lottiePath, 'utf8'));

const imageIds = ['image_0', 'image_1', 'image_2', 'image_3'];

let replacedCount = 0;
for (const asset of lottie.assets) {
  const idx = imageIds.indexOf(asset.id);
  if (idx !== -1) {
    asset.p = base64Data[idx];
    replacedCount++;
    console.log(`Replaced p for asset id="${asset.id}" (index ${idx})`);
  }
}

if (replacedCount !== 4) {
  console.warn(`WARNING: Expected to replace 4 assets but replaced ${replacedCount}.`);
}

console.log('Writing updated lucid-edge-mouse.json...');
writeFileSync(lottiePath, JSON.stringify(lottie), 'utf8');

const size = statSync(lottiePath).size;
const sizeMB = (size / 1024 / 1024).toFixed(2);
console.log(`Done. Final file size: ${size} bytes (${sizeMB} MB)`);
