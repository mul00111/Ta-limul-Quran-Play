const fs = require('fs');
const { execSync } = require('child_process');

const items = [
  { id: 'nq1', verse: '104:2', startWord: 1, endWord: 2, addEnd: 600 }, // لُمَزَةٍ ٱلَّذِى
  { id: 'nq2', verse: '11:42', startWord: 5, endWord: 6, addEnd: 600 }, // نُوحٌ ٱبْنَهُ
  { id: 'nq3', verse: '67:1', startWord: 2, endWord: 3, addEnd: 600 }, // قَدِيرٌ ٱلَّذِي
  { id: 'nq4', verse: '104:3', startWord: 2, endWord: 3, addEnd: 600 }, // لُمَزَةٍ ٱلَّذِي (or similar in 104:2)
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
