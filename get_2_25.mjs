async function get225() {
    const res2 = await fetch(`https://api.quran.com/api/v4/verses/by_key/2:25?words=true&word_fields=text_uthmani,text_indopak`);
    const data2 = await res2.json();
    data2.verse.words.forEach(w => console.log(`  ${w.position}: ${w.text_uthmani} - ${w.audio_url}`));
}
await get225();
