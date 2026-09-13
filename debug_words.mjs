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

const inputs = [
  "فَسَيُنْغِضُوْنَ",
  "مِنْ هَادٍ",
  "عَلِيْمٌ خَبِيْرٌ",
  "قَوْمًا غَيْرَكُمْ",
  "فَمَنْ تَبِعَ",
  "مِنْ ثَمَرَةٍ",
  "مَنْ شَكَرَ",
  "مِنْ صَلْصَالٍ",
  "مِنْ طِيْنٍ",
  "مِنْ قَبْلُ",
  "اَنْتَ",
  "تَنْسَوْنَ",
  "نُنْشِزُهَا",
  "مَنْضُوْدٍ",
  "فَصَبْرٌ جَمِيْلٌ",
  "سِرَاعًا ذٰلِكَ",
  "مُحَمَّدٌ رَّسُوْلُ اللّٰهِ"
];

for (const query of inputs) {
  const url = `http://localhost:3000/api/quran-word-audio?word=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(`Query: ${query} => `, data.audioUrls);
}
