import fs from 'fs';
async function getAyahWords(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse) {
    const words = data.verse.words.map(w => ({
      text: w.text,
      pos: w.position,
      url: w.audio_url ? `https://audio.qurancdn.com/${w.audio_url}` : null
    }));
    console.log(`Ayah ${surah}:${ayah}:`, JSON.stringify(words, null, 2));
  }
}

async function searchAndGetWords(query) {
  const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=1`);
  const data = await res.json();
  if (data.search && data.search.results && data.search.results.length > 0) {
    const verseKey = data.search.results[0].verse_key;
    console.log(`\nQuery: "${query}" -> Found in ${verseKey}`);
    const [surah, ayah] = verseKey.split(':');
    await getAyahWords(surah, ayah);
  } else {
    console.log(`\nQuery: "${query}" -> NOT FOUND`);
  }
}

async function run() {
  const queries = [
    "من هاد", "من علق", "من حكيم", "من غفور", "من خوف", "ينئون", "منهم", 
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
    await searchAndGetWords(q);
    // wait 200ms
    await new Promise(r => setTimeout(r, 200));
  }
}
run();
