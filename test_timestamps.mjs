async function getTimestamps() {
  const res = await fetch('https://api.quran.com/api/v4/quran/verses/uthmani');
  // Wait, the segments are in the recitation endpoint.
  const recRes = await fetch('https://api.quran.com/api/v4/recitations/7/by_ayah/39:36'); // 7 is Mishary
  const recData = await recRes.json();
  console.log(JSON.stringify(recData, null, 2));
}
getTimestamps();
