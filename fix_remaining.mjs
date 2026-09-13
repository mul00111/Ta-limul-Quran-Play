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

await searchWord("مِنْ هَادٍ");
await searchWord("مِنْ عَلَقٍ");
await searchWord("مِنْ حَكِيمٍ");
await searchWord("يَنْأَوْنَ");
await searchWord("مِنْهُمْ");
await searchWord("أَنْعَمْتَ");
await searchWord("وَانْحَرْ");
await searchWord("فَسَيُنْغِضُونَ");
await searchWord("وَالْمُنْخَنِقَةُ");
await searchWord("عَذَابًا أَلِيمًا");
await searchWord("بَلَدًا آمِنًا");
await searchWord("نُوحًا هَدَيْنَا");
