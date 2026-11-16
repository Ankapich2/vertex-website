import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const results = [];
for (const [name, width, height, sections] of [
  [
    "desktop",
    1440,
    5243,
    [
      ["hero", 0, 811],
      ["rental", 859, 1416],
      ["safety", 2371, 351],
      ["services", 2818, 250],
      ["operators", 3164, 529],
      ["support", 3789, 352],
      ["contact", 4237, 1006],
    ],
  ],
  [
    "mobile",
    375,
    7866,
    [
      ["hero", 0, 815],
      ["rental", 879, 2780],
      ["safety", 3723, 529],
      ["services", 4316, 512],
      ["operators", 4892, 864],
      ["support", 5820, 760],
      ["contact", 6644, 1222],
    ],
  ],
]) {
  const reference = await sharp(`design-reference/${name}.png`)
    .resize(width, height, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();
  const actual = await sharp(`qa/${name}-figma.jpg`)
    .resize(width, height, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer();
  const overlay = Buffer.alloc(actual.length),
    difference = Buffer.alloc(actual.length);
  for (let i = 0; i < actual.length; i++) {
    overlay[i] = Math.round((actual[i] + reference[i]) / 2);
    difference[i] = Math.min(255, Math.abs(actual[i] - reference[i]) * 4);
  }
  await sharp(overlay, { raw: { width, height, channels: 3 } })
    .png()
    .toFile(`qa/${name}-overlay.png`);
  await sharp(difference, { raw: { width, height, channels: 3 } })
    .png()
    .toFile(`qa/${name}-difference.png`);
  for (const [section, top, h] of sections) {
    let sum = 0,
      n = 0;
    for (let i = top * width * 3; i < (top + h) * width * 3; i++) {
      sum += Math.abs(actual[i] - reference[i]);
      n++;
    }
    results.push({
      viewport: name,
      section,
      meanAbsoluteChannelDifference: Number((sum / n).toFixed(2)),
    });
  }
}
await writeFile(
  "qa/pixel-comparison.json",
  JSON.stringify(
    {
      note: "Reference full-page exports are downsampled by Figma to 4096px high. Differences include resampling, JPEG screenshots, font rasterization, and intentional prototype interactions. This metric is diagnostic, not a pixel-perfect certification.",
      results,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(results, null, 2));
