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

await searchWord("سَمِيعٌ عَلِيمٌ");
await searchWord("قَرْضًا حَسَنًا");
await searchWord("فَمَنْ تَبِعَ");
await searchWord("مِنْ جُوعٍ");
await searchWord("مِنْ دُونِكُمْ");
await searchWord("مِنْ ذَهَبٍ");
await searchWord("فَإِنْ زَلَلْتُمْ");
await searchWord("مِنْ سَفَهٍ");
await searchWord("مَنْ شَكَرَ");
await searchWord("مِنْ صَلْصَالٍ");
await searchWord("إِنْ ضَلَلْتُ");
await searchWord("مَنْ ظَلَمَ");
await searchWord("مِنْ فُرُوجٍ");
await searchWord("مِنْ قَبْلُ");
await searchWord("أَنْتَ");
await searchWord("نُنْشِزُهَا");
await searchWord("يَنْصُرُونَ");
await searchWord("مَنْضُودٍ");
await searchWord("يَنْطِقُونَ");
