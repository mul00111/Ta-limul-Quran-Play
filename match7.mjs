async function getAyah(surah, ayah) {
  const res = await fetch(`https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true`);
  const data = await res.json();
  if (data.verse && data.verse.words) {
     console.log(`Ayah ${surah}:${ayah}:`);
     data.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text} - ${w.audio_url}`));
  }
}
await getAyah(2, 25);  // min qablu?
await getAyah(24, 40); // sahabun zulumat
await getAyah(2, 44);  // tansawna
await getAyah(2, 183); // min kataba? No, kutiba.
await getAyah(78, 34); // ka'san dihaqan
await getAyah(50, 44); // sira'an thalika (no wait, 70:43 is sira'an ka-annahum)
await getAyah(70, 43); // sira'an
await getAyah(52, 44); // sahabun markoom
