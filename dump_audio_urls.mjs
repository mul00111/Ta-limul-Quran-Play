import fs from 'fs';

const serverTs = fs.readFileSync('server.ts', 'utf8');
const match = serverTs.match(/const qaidaOverrides:\s*Record<string,\s*string\[\]>\s*=\s*(\{[\s\S]*?\n      \});/);
const qaidaOverrides = eval('(' + match[1] + ')');

for (const [k, v] of Object.entries(qaidaOverrides)) {
   if (k.length > 2) { // just skip single char/simple things if any
     console.log(`${k} -> ${v.map(u => u.split('/').pop()).join(', ')}`);
   }
}
