async function searchWord(query) {
  const url = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=en`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.search && data.search.results && data.search.results.length > 0) {
    for (let i = 0; i < Math.min(3, data.search.results.length); i++) {
        const verseKey = data.search.results[i].verse_key;
        const res2 = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,text_indopak`);
        const data2 = await res2.json();
        console.log(`Found "${query}" in ${verseKey}:`);
        data2.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text_uthmani} - ${w.audio_url}`));
    }
  } else {
    console.log(`Not found: ${query}`);
  }
}

await searchWord("فَسَيُنْغِضُونَ");
await searchWord("مِنْ هَادٍ");
await searchWord("عَلِيمٌ خَبِيرٌ");
await searchWord("قَوْمًا غَيْرَكُمْ");
await searchWord("فَمَنْ تَبِعَ");
await searchWord("مِنْ ثَمَرَةٍ");
await searchWord("مَنْ شَكَرَ");
await searchWord("مِنْ صَلْصَالٍ");
await searchWord("مِنْ طِينٍ");
await searchWord("مِنْ قَبْلُ");
await searchWord("أَنْتَ");
await searchWord("تَنسَوْنَ");
await searchWord("نُنشِزُهَا");
await searchWord("مَّنضُودٍ");
await searchWord("فَصَبْرٌ جَمِيلٌ");
await searchWord("سِرَاعًا ذٰلِكَ");
await searchWord("مُحَمَّدٌ رَّسُولُ اللَّهِ");
