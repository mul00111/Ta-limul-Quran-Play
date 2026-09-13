async function searchWord(query) {
  const url = `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=en`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.search && data.search.results && data.search.results.length > 0) {
    const verseKey = data.search.results[0].verse_key;
    const res2 = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true`);
    const data2 = await res2.json();
    console.log(`Found "${query}" in ${verseKey}:`);
    data2.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text} - ${w.audio_url}`));
  } else {
    console.log(`Not found: ${query}`);
  }
}

await searchWord("عَلِيمٌ خَبِيرٌ");
await searchWord("قَوْمًا غَيْرَكُمْ");
await searchWord("مِنْ ثَمَرَةٍ");
await searchWord("مِنْ طِينٍ");
await searchWord("تَنسَوْنَ");
await searchWord("عَذَابٌ شَدِيدٌ");
await searchWord("مِن يَوْمٍ");
await searchWord("سِرَاعًا");
await searchWord("ثَمَنًا قَلِيلًا");
await searchWord("خَبِيرًا بَصِيرًا");
await searchWord("كِتَابًا يَلْقَاهُ");
