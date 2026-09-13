import fs from 'fs';

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

const words = `
فَسَيُنْغِضُوْنَ
مِنْ هَادٍ
عَلِيْمٌ خَبِيْرٌ
قَوْمًا غَيْرَكُمْ
فَمَنْ تَبِعَ
مِنْ ثَمَرَةٍ
مَنْ شَكَرَ
مِنْ صَلْصَالٍ
مِنْ طِيْنٍ
مِنْ قَبْلُ
اَنْتَ
تَنْسَوْنَ
نُنْشِزُهَا
مَنْضُوْدٍ
فَصَبْرٌ جَمِيْلٌ
سِرَاعًا ذٰلِكَ
مُحَمَّدٌ رَّسُوْلُ اللّٰهِ
`.trim().split('\n');

const serverTs = fs.readFileSync('server.ts', 'utf8');
const match = serverTs.match(/const qaidaOverrides:\s*Record<string,\s*string\[\]>\s*=\s*(\{[\s\S]*?\n      \});/);
if (match) {
  const qaidaOverrides = eval('(' + match[1] + ')');
  const normalizedQaidaOverrides = {};
  for (const [k, v] of Object.entries(qaidaOverrides)) {
    normalizedQaidaOverrides[k] = v;
    normalizedQaidaOverrides[normalizeArabicText(k)] = v;
    normalizedQaidaOverrides[normalizeArabicWithDiacritics(k)] = v;
  }
  
  for (const w of words) {
    const base = normalizeArabicText(w);
    const diac = normalizeArabicWithDiacritics(w);
    if (normalizedQaidaOverrides[diac]) {
      console.log(w, "FOUND diac", normalizedQaidaOverrides[diac]);
    } else if (normalizedQaidaOverrides[base]) {
      console.log(w, "FOUND base", normalizedQaidaOverrides[base]);
    } else {
      console.log(w, "NOT FOUND! base=", base, "diac=", diac);
    }
  }
}
