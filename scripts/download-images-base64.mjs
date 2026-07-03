import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const urls = [
  'https://lucidedge.com.au/wp-content/uploads/2020/07/sydney-metro-central-station.png',
  'https://lucidedge.com.au/wp-content/uploads/2020/07/the-star-casino-construction-sequence.png',
  'https://lucidedge.com.au/wp-content/uploads/2020/07/Westmead_construction_sequence.png',
  'https://lucidedge.com.au/wp-content/uploads/2020/07/SSC_Works_Final_2.png',
];

async function downloadAndProcess(url) {
  console.log(`Downloading: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  const outputBuffer = await sharp(inputBuffer)
    .resize(900, 375, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();

  const base64 = outputBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

(async () => {
  const results = [];
  for (const url of urls) {
    const dataUri = await downloadAndProcess(url);
    results.push(dataUri);
    console.log(`Done: ${url.split('/').pop()} (${dataUri.length} chars)`);
  }

  const outputPath = join(__dirname, 'image-bases64.json');
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nSaved to: ${outputPath}`);
})();
