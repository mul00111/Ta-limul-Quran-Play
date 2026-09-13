const fs = require('fs');
const { execSync } = require('child_process');

const items = [
  { id: 'w1_waqf', verse: '113:2', startWord: 3, endWord: 4, addEnd: 500 }, // مَا خَلَقَ -> مَا خَلَقْ
  { id: 'w2_waqf', verse: '114:2', startWord: 1, endWord: 2, addEnd: 500 }, // مَلِكِ النَّاسِ -> مَلِكِ النَّاسْ
  { id: 'w3_waqf', verse: '85:16', startWord: 2, endWord: 3, addEnd: 500 }, // لِمَا يُرِيدُ -> لِمَا يُرِيدْ
  { id: 'w4_waqf', verse: '106:4', startWord: 3, endWord: 4, addEnd: 500 }, // مِنْ جُوعٍ -> مِنْ جُوعْ
  { id: 'w5_waqf', verse: '100:6', startWord: 4, endWord: 4, addEnd: 500 }, // لَكَنُودٌ -> لَكَنُودْ
  { id: 'w8_waqf', verse: '113:5', startWord: 4, endWord: 5, addEnd: 500 }, // اِذَا حَسَدَ -> اِذَا حَسَدْ
  { id: 'w9_waqf', verse: '1:4', startWord: 2, endWord: 3, addEnd: 500 }, // يَوْمِ الدِّيْنِ -> يَوْمِ الدِّيْنْ
  { id: 'w11_waqf', verse: '109:2', startWord: 3, endWord: 4, addEnd: 500 }, // مَا تَعْبُدُوْنَ -> مَا تَعْبُدُوْنْ
  { id: 'w17_waqf', verse: '110:3', startWord: 5, endWord: 6, addEnd: 500 }, // كَانَ تَوَّابًا -> كَانَ تَوَّابَا (fahuwa tawab)
  { id: 'w31_waqf', verse: '112:3', startWord: 1, endWord: 2, addEnd: 500 }, // لَمْ يَلِدْ
];

async function run() {
  for (const item of items) {
    try {
      console.log(`Processing ${item.id} (${item.verse})...`);
      const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${item.verse}?audio=7&words=true`);
      const data = await res.json();
      const segments = data.verse.audio.segments;
      const audioUrl = `https://audio.qurancdn.com/${data.verse.audio.url}`;
      
      let startTime = null;
      let endTime = null;
      
      for (const seg of segments) {
        // seg is [word_index, something, start_ms, end_ms]
        const pos = seg[0] + 1; 
        if (pos === item.startWord) startTime = seg[2];
        if (pos === item.endWord) endTime = seg[3];
      }
      
      if (startTime !== null && endTime !== null) {
        const startSec = (startTime / 1000).toFixed(3);
        const durationSec = ((endTime + item.addEnd - startTime) / 1000).toFixed(3);
        
        const tempMp3 = `/tmp/verse_${item.verse.replace(':','_')}.mp3`;
        if (!fs.existsSync(tempMp3)) {
          execSync(`curl -s ${audioUrl} -o ${tempMp3}`);
        }
        
        const outFile = `public/audio/${item.id}.mp3`;
        const fadeOutStart = (parseFloat(durationSec) - 0.2).toFixed(3);
        const cmd = `ffmpeg -y -ss ${startSec} -i ${tempMp3} -t ${durationSec} -af "afade=t=in:ss=0:d=0.05,afade=t=out:st=${fadeOutStart}:d=0.2" ${outFile}`;
        execSync(cmd, { stdio: 'ignore' });
        console.log(`Saved ${outFile}`);
      } else {
        console.log(`Failed to find timestamps for ${item.id}`);
      }
    } catch (e) {
      console.error(`Error on ${item.id}:`, e.message);
    }
  }
}
run();
