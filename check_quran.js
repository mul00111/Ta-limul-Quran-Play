const fs = require('fs');
async function searchWord(word) {
  const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(word)}&size=1`);
  const data = await res.json();
  if (data.search && data.search.results && data.search.results.length > 0) {
    const ayah = data.search.results[0].verse_key; // e.g. 1:2
    console.log(`${word} found in ${ayah}`);
  } else {
    console.log(`${word} not found`);
  }
}
async function run() {
  await searchWord("من هاد");
  await searchWord("من علق");
  await searchWord("من حكيم");
  await searchWord("من غفور");
  await searchWord("من خوف");
  await searchWord("ينئون");
  await searchWord("منهم");
  await searchWord("انعمت");
  await searchWord("وانحر");
  await searchWord("فسينغضون");
  await searchWord("والمنخنقة");
}
run();
