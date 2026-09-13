async function getTimestamps() {
  const recRes = await fetch('https://api.quran.com/api/v4/verses/by_key/1:1?words=true&audio=7');
  const recData = await recRes.json();
  console.log(recData.verse.words[0]);
}
getTimestamps();
