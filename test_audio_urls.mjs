import fs from 'fs';

const userList = `
مِنْ اَجْلٍ
مِنْ هَادٍ
مِنْ عَلَقٍ
مِنْ حَكِيْمٍ
مِنْ غَفُوْرٍ
مِنْ خَوْفٍ
يَنْئَوْنَ
مِنْهُمْ
اَنْعَمْتَ
وَانْحَرْ
فَسَيُنْغِضُوْنَ
وَالْمُنْخَنِقَةُ
عَذَابًا اَلِيْمًا
بَلَدًا اٰمِنًا
نُوْحًا هَدَيْنَا
سَمِيْعٌ عَلِيْمٌ
قَرْضًا حَسَنًا
عَلِيْمٌ خَبِيْرٌ
قَوْمًا غَيْرَكُمْ
فَمَنْ تَبِعَ
مِنْ ثَمَرَةٍ
مِنْ جُوْعٍ
مِنْ دُوْنِكُمْ
مِنْ ذَهَبٍ
فَاِنْ زَلَلْتُمْ
مِنْ سَفَهٍ
مَنْ شَكَرَ
مِنْ صَلْصَالٍ
اِنْ ضَلَلْتُ
مِنْ طِيْنٍ
مَنْ ظَلَمَ
مِنْ فُرُوْجٍ
مِنْ قَبْلُ
مِنْ كَتَبَ
اَنْتَ
تَنْسَوْنَ
نُنْشِزُهَا
يَنْصُرُوْنَ
مَنْضُوْدٍ
يَنْطِقُوْنَ
اُنْظُرْ
اَنْفُسَكُمْ
يَنْقَضُوْنَ
مِنْكُمْ
قَوْلًا ثَقِيْلًا
فَصَبْرٌ جَمِيْلٌ
كَأْسًا دِهَاقًا
سِرَاعًا ذٰلِكَ
صَعِيْدًا زَلَقًا
قَوْلًا سَدِيْدًا
عَذَابٌ شَدِيْدٌ
عَمَلًا صَالِحًا
عَذَابًا ضِعْفًا
سَبْحًا طَوِيْلًا
سَحَابٌ ظُلُمٰتٌ
قَوْمًا فَاسِقِيْنَ
ثَمَنًا قَلِيْلًا
رَسُوْلٌ كَرِيْمٌ
كِرَامًا كَاتِبِيْنَ
مَنْ يَّقُوْلُ
مِنْ وَّرَقِ الْجَنَّةِ
مِنْ يَّوْمٍ
مَنْ وَّلِيٍّ
مِنْ مَّشْهَدٍ
مِنْ مِّثْلِهِ
مِنْ نَّصِيْرٍ
مِنْ نُّطْفَةٍ
كِتَابًا يَّلْقٰهُ
هُدًى وَّذِكْرٰى
سِرَاجًا مُّنِيْرًا
حِطَّةٌ نَّغْفِرْ لَكُمْ
مِنْ رَّبِّكَ
مِنْ رَّبِّهِمْ
مِنْ لَّدُنْهُ
يَكُنْ لَّهُ
مُحَمَّدٌ رَّسُوْلُ اللّٰهِ
رَءُوْفٌ رَّحِيْمٌ
مُّصَدِّقًا لِّمَا
وَيْلٌ لِّكُلِّ
مِنْۢ بَعْدِ
مِنْۢ بَقْلِهَا
اَنْۢبِئْهُمْ
لَيُنْۢبَذَنَّ
قَوْلًاۢ بَلِيْغًا
خَبِيْرٌۢ بَصِيْرًا
جَنَّةٍۢ بِرَبْوَةٍ
كِرَامٍۢ بَرَرَةٍ
حِلٌّۢ بِهٰذَا
صُمٌّۢ بُكْمٌ
`.split('\n').map(l => l.trim()).filter(l => l);

function normalizeArabicText(text) {
  if (!text) return text;
  return text
    .replace(/[\u064B-\u0652\u0670\u0656-\u0658\u06DF-\u06E8]/g, '')
    .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
    .replace(/آ|أ|إ|ٱ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ہ|ھ/g, 'ه')
    .replace(/ى|ی/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(/ۢ/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeArabicWithDiacritics(text) {
    if (!text) return text;
    return text
      .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
      .replace(/آ|أ|إ|ٱ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ہ|ھ/g, 'ه')
      .replace(/ى|ی/g, 'ي')
      .replace(/ک/g, 'ك')
      .replace(/ۢ/g, '')
      .replace(/\s+/g, ' ')
      .trim();
}

const serverTs = fs.readFileSync('server.ts', 'utf8');
const match = serverTs.match(/const qaidaOverrides:\s*Record<string,\s*string\[\]>\s*=\s*(\{[\s\S]*?\n      \});/);
let qaidaOverrides = {};
if (match) {
  qaidaOverrides = eval('(' + match[1] + ')');
} else {
  console.log("Could not find qaidaOverrides in server.ts");
  process.exit(1);
}

let missing = [];
for (const raw of userList) {
  const normBase = normalizeArabicText(raw);
  const normDiac = normalizeArabicWithDiacritics(raw);
  
  let found = false;
  for (const k of Object.keys(qaidaOverrides)) {
      if (normalizeArabicText(k) === normBase || normalizeArabicWithDiacritics(k) === normDiac) {
          found = true;
          break;
      }
  }
  if (!found) {
    missing.push(raw);
  }
}

console.log("Missing matches:", missing.length === 0 ? "None!" : missing);
