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

async function searchAndMatch(query) {
  const normQuery = normalizeArabicText(query);
  const queryWords = normQuery.split(' ');
  
  const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=1`);
  const data = await res.json();
  if (data.search && data.search.results && data.search.results.length > 0) {
    const verseKey = data.search.results[0].verse_key;
    const [surah, ayah] = verseKey.split(':');
    const words = await getAyahWords(surah, ayah);
    
    // Find sequence
    let foundUrls = [];
    for (let i = 0; i <= words.length - queryWords.length; i++) {
      let match = true;
      for (let j = 0; j < queryWords.length; j++) {
        if (words[i+j].norm !== queryWords[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        foundUrls = queryWords.map((_, idx) => words[i+idx].url).filter(u => u);
        break;
      }
    }
    
    // Some single words like "فَسَيُنْغِضُوْنَ" might have prefixes/suffixes in search, let's try a fallback partial match
    if (foundUrls.length === 0) {
       for (let i = 0; i < words.length; i++) {
         if (words[i].norm.includes(normQuery) || normQuery.includes(words[i].norm)) {
           foundUrls.push(words[i].url);
         }
       }
    }

    console.log(`        '${query}': [${foundUrls.map(u => `'${u}'`).join(', ')}],`);
  } else {
    console.log(`        // '${query}' not found`);
  }
}

async function run() {
  const queries = [
    "من اجل", "من هاد", "من علق", "من حكيم", "من غفور", "من خوف", "ينئون", "منهم", 
    "انعمت", "وانحر", "فسينغضون", "والمنخنقة", "عذابا اليما", "بلدا امنا", 
    "نوحا هدينا", "سميع عليم", "قرضا حسنا", "عليم خبير", "قوما غيركم",
    "فمن تبع", "من ثمرة", "من جوع", "من دونكم", "من ذهب", "فان زللتم",
    "من سفه", "من شكر", "من صلصال", "ان ضللت", "من طين", "من ظلم",
    "من فروج", "من قبل", "من كتب", "انت", "تنسون", "ننشزها", "ينصرون",
    "منضود", "ينطقون", "انظر", "انفسكم", "ينقضون", "منكم", "قولا ثقيلا",
    "فصبر جميل", "كأسا دهاقا", "سراعا ذلك", "صعيدا زلقا", "قولا سديدا",
    "عذاب شديد", "عملا صالحا", "عذابا ضعفا", "سبحا طويلا", "سحاب ظلمات",
    "قوما فاسقين", "ثمنا قليلا", "رسول كريم", "كراما كاتبين",
    "من يقول", "من ورق الجنة", "من يوم", "من ولي", "من مشهد", "من مثله",
    "من نصير", "من نطفة", "كتابا يلقاه", "هدى وذكرى", "سراجا منيرا",
    "حطة نغفر لكم", "من ربك", "من ربهم", "من لدنه", "يكن له",
    "محمد رسول الله", "رءوف رحيم", "مصدقا لما", "ويل لكل", "من بعد",
    "من بقلها", "انبئهم", "لينبذن", "قولا بليغا", "خبير بصيرا",
    "جنة بربوة", "كرام بررة", "حل بهذا", "صم بكم"
  ];
  for (const q of queries) {
    await searchAndMatch(q);
    await new Promise(r => setTimeout(r, 100));
  }
}
run();
