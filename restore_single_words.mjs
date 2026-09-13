import fs from 'fs';

const dump = fs.readFileSync('urls_dump.txt', 'utf8').trim().split('\n');
const singleWords = {};
for (const line of dump) {
  if (line.includes('->')) {
    const [word, urlsStr] = line.split('->').map(s => s.trim());
    const urls = urlsStr.split(',').map(u => `https://audio.qurancdn.com/wbw/${u.trim()}`);
    // Only if it doesn't have a space or it's one of the ones missing from the new set
    if (!word.includes(' ') && word.length > 0) {
      singleWords[word] = urls;
    }
  }
}

let serverTs = fs.readFileSync('server.ts', 'utf8');

// The single words need to be appended inside the qaidaOverrides object.
// Right now the object ends with:
//         'صم بكم': ['https://audio.qurancdn.com/wbw/002_018_001.mp3', 'https://audio.qurancdn.com/wbw/002_018_002.mp3'],
//         'كتابا يلقه': ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],
//       };
let additions = "";
for (const [k, v] of Object.entries(singleWords)) {
  additions += `        '${k}': [${v.map(u => `'${u}'`).join(', ')}],\n`;
}

serverTs = serverTs.replace("        'كتابا يلقه': ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],\n      };", 
"        'كتابا يلقه': ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],\n" + additions + "      };");

fs.writeFileSync('server.ts', serverTs);
console.log("Restored", Object.keys(singleWords).length, "single words.");
