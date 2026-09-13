import fs from 'fs';

function normalizeArabicText(str) {
  return str
    .replace(/[\u064B-\u0652\u0670\u0656-\u0658\u06DF-\u06E8]/g, '')
    .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
    .replace(/آ|أ|إ|ٱ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ہ|ھ/g, 'ه')
    .replace(/ى|ی/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getAyahWords(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,text_imlaei_simple`);
  const data = await res.json();
  if (data.verse) {
    return data.verse.words.map(w => ({
      text: w.text_imlaei_simple,
      norm: normalizeArabicText(w.text_imlaei_simple || ''),
      url: w.audio_url ? `https://audio.qurancdn.com/${w.audio_url}` : null
    }));
  }
  return [];
}

async function getSpecificWord(surah, ayah, wordIndex) {
  const words = await getAyahWords(surah, ayah);
  if (words[wordIndex - 1]) {
    console.log(`URL for ${surah}:${ayah}:${wordIndex}:`, words[wordIndex - 1].url);
  } else {
    console.log(`Word not found at ${surah}:${ayah}:${wordIndex}`);
  }
}

// ينئون 6:26 word 4
// تنسون 2:44 word 5
// انبئهم 2:33 word 4
await getSpecificWord(6, 26, 4);
await getSpecificWord(2, 44, 5);
await getSpecificWord(2, 33, 4);

