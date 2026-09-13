import fs from 'fs';
const file = 'src/utils/qariAudioService.ts';
let code = fs.readFileSync(file, 'utf8');

const ttsInjection = `
const FORCE_TTS_PHRASES = [
  'فَسَيُنْغِضُوْنَ',
  'مِنْ هَادٍ',
  'عَلِيْمٌ خَبِيْرٌ',
  'قَوْمًا غَيْرَكُمْ',
  'فَمَنْ تَبِعَ',
  'مِنْ ثَمَرَةٍ',
  'مَنْ شَكَرَ',
  'مِنْ صَلْصَالٍ',
  'مِنْ طِيْنٍ',
  'مِنْ قَبْلُ',
  'اَنْتَ',
  'تَنْسَوْنَ',
  'نُنْشِزُهَا',
  'مَنْضُوْدٍ',
  'فَصَبْرٌ جَمِيْلٌ',
  'سِرَاعًا ذٰلِكَ',
  'مُحَمَّدٌ رَّسُوْلُ اللّٰهِ'
];
`;

code = code.replace(
  "export const getAlafasyWordAudioUrls = async (text: string): Promise<string[] | null> => {",
  ttsInjection + "\nexport const getAlafasyWordAudioUrls = async (text: string): Promise<string[] | null> => {"
);

code = code.replace(
  "const clean = text.replace(/[﴿﴾«»\\[\\]\\(\\)\\{\\}\\d:,\\.\\?\\!_#-]/g, '').trim();\n    if (!clean) return null;",
  "const clean = text.replace(/[﴿﴾«»\\[\\]\\(\\)\\{\\}\\d:,\\.\\?\\!_#-]/g, '').trim();\n    if (!clean) return null;\n\n    // For specific Tajweed examples, Word-by-Word slices them and ruins the pronunciation (missing Ikhfa/Idgham, adding prefixes like Wa).\n    // Force TTS so they are read continuously and smoothly.\n    if (FORCE_TTS_PHRASES.includes(clean) || FORCE_TTS_PHRASES.includes(text.trim())) {\n      console.log('Forcing TTS for Tajweed phrase:', clean);\n      return null;\n    }"
);

fs.writeFileSync(file, code);
