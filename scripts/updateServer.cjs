const fs = require('fs');

const overrides = [
  { key: 'مَا خَلَقْ', file: '/audio/w1_waqf.mp3' },
  { key: 'مَلِكِ النَّاسْ', file: '/audio/w2_waqf.mp3' },
  { key: 'لِمَا يُرِيدْ', file: '/audio/w3_waqf.mp3' },
  { key: 'مِنْ جُوعْ', file: '/audio/w4_waqf.mp3' },
  { key: 'لَكَنُودْ', file: '/audio/w5_waqf.mp3' },
  { key: 'اِذَا حَسَدْ', file: '/audio/w8_waqf.mp3' },
  { key: 'يَوْمِ الدِّيْنْ', file: '/audio/w9_waqf.mp3' },
  { key: 'مَا تَعْبُدُوْنْ', file: '/audio/w11_waqf.mp3' },
  { key: 'كَانَ تَوَّابَا', file: '/audio/w17_waqf.mp3' },
  { key: 'لَمْ يَلِدْ', file: '/audio/w31_waqf.mp3' },
];

let content = fs.readFileSync('server.ts', 'utf-8');

// Find the line with `const normalizedQaidaOverrides: Record<string, string[]> = {`
const marker = 'const normalizedQaidaOverrides: Record<string, string[]> = {';
const insertIndex = content.indexOf(marker) + marker.length;

let insertions = '\n';
for (const o of overrides) {
  insertions += `    '${o.key}': ['${o.file}'],\n`;
}

content = content.slice(0, insertIndex) + insertions + content.slice(insertIndex);
fs.writeFileSync('server.ts', content);
console.log('server.ts updated');
