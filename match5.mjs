import fs from 'fs';
async function getSpecificWord(surah, ayah, wordIndex) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse && data.verse.words) {
    if (data.verse.words[wordIndex - 1]) {
      console.log(`${surah}:${ayah}:${wordIndex} -> ${data.verse.words[wordIndex - 1].audio_url}`);
    } else {
      console.log(`${surah}:${ayah}:${wordIndex} -> Not found`);
    }
  }
}
async function getAyah(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse && data.verse.words) {
     console.log(`Ayah ${surah}:${ayah}:`);
     data.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text} - ${w.audio_url}`));
  }
}

await getAyah(27, 40); // man shakara
await getAyah(2, 259); // nunshizuha

