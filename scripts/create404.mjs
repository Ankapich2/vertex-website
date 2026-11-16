import { readFile, writeFile } from "node:fs/promises";
const html = await readFile("dist/index.html", "utf8");
await writeFile(
  "dist/404.html",
  html
    .replace(
      /<title>[^<]*<\/title>/,
      "<title>404 — Страница не найдена · ВЕРТЭКС</title>",
    )
    .replace("</head>", '<meta name="robots" content="noindex"/></head>'),
);
console.log("Created standalone dist/404.html");
