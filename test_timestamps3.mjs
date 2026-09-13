async function getTimestamps() {
  const recRes = await fetch('https://api.quran.com/api/v4/recitations/7/by_chapter/1?per_page=100');
  const recData = await recRes.json();
  console.log(recData.audio_files[0]);
}
getTimestamps();
