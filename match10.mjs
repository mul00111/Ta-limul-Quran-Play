async function getAyah(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse && data.verse.words) {
     console.log(`Ayah ${surah}:${ayah}:`);
     data.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text} - ${w.audio_url}`));
  }
}
await getAyah(2, 32); // anta
await getAyah(34, 44); // min kutubin
await getAyah(2, 147); // min rabbika
await getAyah(2, 5); // min rabbihim
await getAyah(112, 4); // yakun lahu
await getAyah(48, 29); // muhammadun rasoolu allahi
await getAyah(9, 128); // raoofun raheem
await getAyah(2, 41); // musaddiqan lima
await getAyah(104, 1); // waylun likulli
await getAyah(2, 27); // min ba'di
