async function getTimestamps() {
  const recRes = await fetch('https://api.quran.com/api/v4/recitations/7/by_chapter/39?per_page=100');
  const recData = await recRes.json();
  const ayah = recData.audio_files.find(a => a.verse_key === '39:36');
  if (ayah && ayah.segments) {
    console.log(ayah.segments);
  } else {
    console.log("No segments found or ayah not found.");
  }
}
getTimestamps();
