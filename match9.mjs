async function getAyah(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse && data.verse.words) {
     console.log(`Ayah ${surah}:${ayah}:`);
     data.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text} - ${w.audio_url}`));
  }
}
await getAyah(2, 33); // anbi'hum
await getAyah(17, 96); // khabeeran baseeran
await getAyah(2, 265); // jannatin birabwatin
await getAyah(90, 2); // hillun bihatha
