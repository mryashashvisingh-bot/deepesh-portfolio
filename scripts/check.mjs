import { readFile } from 'node:fs/promises';
const files = ['index.html', 'sheru.html', 'src/styles/main.css', 'src/scripts/main.js'];
let failed = false;
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (text.includes('localhost')) { console.error(`${file}: hardcoded localhost found`); failed = true; }
}
const index = await readFile('index.html', 'utf8');
for (const required of ['Deepesh Singh — Senior Visual &amp; Brand Designer', 'WORK', 'SHERU', 'ABOUT', 'EXPERIMENTS', 'CONTACT']) {
  if (!index.toUpperCase().includes(required.toUpperCase())) { console.error(`Missing ${required}`); failed = true; }
}
if (failed) process.exit(1);
console.log('Portfolio static checks passed');
