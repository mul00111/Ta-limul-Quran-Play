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

const content = fs.readFileSync('./src/data/nunSakinTanweenData.ts', 'utf8');
const wordMatches = [...content.matchAll(/arabic:\s*'([^']+)'/g)].map(m => m[1]);

console.log('Total words in Lesson 10:', wordMatches.length);

async function findExactMatch(phrase) {
  const words = phrase.split(/\s+/).filter(Boolean);
  const query = words.map(normalizeArabicText).join(' ');
  
  try {
    const searchUrl = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=12`;
    const sRes = await fetch(searchUrl);
    if (sRes.ok) {
      const sData = await sRes.json();
      const results = sData?.search?.results || [];

      for (const res of results) {
        const verseKey = res.verse_key;
        const vRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,text_indopak`);
        if (!vRes.ok) continue;
        const vData = await vRes.json();
        const vWords = (vData.verse?.words || []).filter((w) => w.char_type_name === 'word' && w.audio_url);

        for (let i = 0; i <= vWords.length - words.length; i++) {
          let allMatch = true;
          const matchedUrls = [];
          const matchedTexts = [];

          for (let j = 0; j < words.length; j++) {
            const targetNorm = normalizeArabicText(words[j]);
            const vWord = vWords[i + j];
            const uNorm = normalizeArabicText(vWord.text_uthmani || vWord.text || '');
            const iNorm = normalizeArabicText(vWord.text_indopak || '');

            if (uNorm === targetNorm || iNorm === targetNorm) {
              matchedUrls.push(`https://audio.qurancdn.com/${vWord.audio_url}`);
              matchedTexts.push(vWord.text_uthmani);
            } else {
              allMatch = false;
              break;
            }
          }

          if (allMatch && matchedUrls.length === words.length) {
            return {
              phrase,
              verseKey,
              matchedTexts: matchedTexts.join(' '),
              urls: matchedUrls
            };
          }
        }
      }
    }
  } catch (err) {}

  // Fallback: search each word individually
  const individualUrls = [];
  const individualTexts = [];
  for (const w of words) {
    const wNorm = normalizeArabicText(w);
    try {
      const wSearch = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(wNorm)}&size=6`);
      if (wSearch.ok) {
        const wData = await wSearch.json();
        const wResults = wData?.search?.results || [];
        let foundWord = false;
        for (const r of wResults) {
          if (foundWord) break;
          const vRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${r.verse_key}?words=true&word_fields=text_uthmani,text_indopak`);
          if (!vRes.ok) continue;
          const vData = await vRes.json();
          const vWords = (vData.verse?.words || []).filter((x) => x.char_type_name === 'word' && x.audio_url);
          for (const vw of vWords) {
            const uNorm = normalizeArabicText(vw.text_uthmani || '');
            const iNorm = normalizeArabicText(vw.text_indopak || '');
            if (uNorm === wNorm || iNorm === wNorm) {
              individualUrls.push(`https://audio.qurancdn.com/${vw.audio_url}`);
              individualTexts.push(vw.text_uthmani);
              foundWord = true;
              break;
            }
          }
        }
      }
    } catch (err) {}
  }

  if (individualUrls.length === words.length) {
    return {
      phrase,
      verseKey: 'individual',
      matchedTexts: individualTexts.join(' '),
      urls: individualUrls
    };
  }

  return null;
}

async function run() {
  const finalMap = {};
  for (let i = 0; i < wordMatches.length; i++) {
    const word = wordMatches[i];
    const res = await findExactMatch(word);
    if (res) {
      console.log((i+1).toString().padStart(2), word.padEnd(25), '=>', res.verseKey.padEnd(8), '::', res.matchedTexts);
      finalMap[word] = res.urls;
      finalMap[normalizeArabicText(word)] = res.urls;
    } else {
      console.log('NOT FOUND:', (i+1), word);
    }
  }
  fs.writeFileSync('./verified_lesson10_audio.json', JSON.stringify(finalMap, null, 2));
  console.log('Saved verified audio map!');
}

run();
