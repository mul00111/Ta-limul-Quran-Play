export type MaddType =
  | 'muttasil'      // مَدِّ مُتَّصِل
  | 'munfasil'     // مَدِّ مُنْفَصِل
  | 'laazim'       // مَدِّ لَازِم
  | 'leen_laazim'  // مَدِّ لِیْن لَازِم
  | 'aaridh'       // مَدِّ عَارِض
  | 'leen_aaridh'; // مَدِّ لِیْن عَارِض

export interface MaddRule {
  id: MaddType;
  titleUrdu: string;
  titleEnglish: string;
  definitionUrdu: string;
  cause: 'ہمزہ (ء)' | 'سکونِ اصلی' | 'سکونِ عارضی (وقف)';
  durationAlif: string;
  durationHarakat: string;
  colorGradient: string;
  badgeBg: string;
  badgeText: string;
  exampleWords: string[];
}

export interface MaddWord {
  id: string;
  arabic: string;
  maddType: MaddType;
  categoryLabelUrdu: string;
  spellingHijja: string;
  urduTranslation: string;
  durationText: string;
  harakatCount: number; // 2, 4, 5, 6
  causeExplanation: string;
  isWaqfExample?: boolean;
}

export const MADDAT_RULES: MaddRule[] = [
  {
    id: 'muttasil',
    titleUrdu: 'مَدِّ مُتَّصِل (Madd Muttasil)',
    titleEnglish: 'Connected Madd',
    definitionUrdu: 'حروفِ مدہ کے بعد ہمزہ (ء) اُسی کلمے (ایک ہی لفظ) میں ہو تو مدِّ متصل ہوگا۔',
    cause: 'ہمزہ (ء)',
    durationAlif: '۲ یا ڈھائی الف',
    durationHarakat: '۴ یا ۵ حرکات',
    colorGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    badgeBg: 'bg-emerald-500/20 border-emerald-400',
    badgeText: 'text-emerald-300',
    exampleWords: ['جَآءَ', 'جِیْٓءَ', 'سِیْٓئَتْ', 'أُولٰٓئِكَ', 'حَدَآئِقَ', 'قُرُوْٓءٍ', 'أَوْلِیَآءُ', 'سَمَآءً', 'سَوَآءٌ', 'جَزَآءٌ', 'مَلٰٓئِكَةُ']
  },
  {
    id: 'munfasil',
    titleUrdu: 'مَدِّ مُنْفَصِل (Madd Munfasil)',
    titleEnglish: 'Separated Madd',
    definitionUrdu: 'حروفِ مدہ کے بعد ہمزہ (ء) دوسرے کلمے (اگلے لفظ) کے شروع میں ہو تو مدِّ منفصل ہوگا۔',
    cause: 'ہمزہ (ء)',
    durationAlif: '۲ یا ڈھائی الف',
    durationHarakat: '۴ یا ۵ حرکات',
    colorGradient: 'from-blue-600 via-indigo-600 to-cyan-700',
    badgeBg: 'bg-blue-500/20 border-blue-400',
    badgeText: 'text-blue-300',
    exampleWords: ['فِيْٓ أَنْفُسِكُمْ', 'بِمَآ أُنْزِلَ', 'قَالُوْٓا آمَنَّا', 'يَآ أَرْضُ', 'هٰٓؤُلَاءِ', 'يٰبَنِيْٓ إِسْرَآئِيْلَ', 'لَآ إِلٰهَ', 'إِلَّآ أَنْتَ', 'وَلَآ أَنَا', 'يٰٓأَيُّهَا', 'لَآ أَعْبُدُ', 'إِنَّآ أَنْزَلْنٰهُ']
  },
  {
    id: 'laazim',
    titleUrdu: 'مَدِّ لَازِم (Madd Laazim)',
    titleEnglish: 'Compulsory Madd',
    definitionUrdu: 'حروفِ مدہ کے بعد سکونِ اصلی (جزم یا تشدید) ہو تو مدِّ لازم ہوگا۔ اسے ۳ الف (۶ حرکات) کھینچنا واجب ہے۔',
    cause: 'سکونِ اصلی',
    durationAlif: '۳ الف',
    durationHarakat: '۶ حرکات (طول)',
    colorGradient: 'from-purple-600 via-fuchsia-600 to-pink-700',
    badgeBg: 'bg-purple-500/20 border-purple-400',
    badgeText: 'text-purple-300',
    exampleWords: ['جَآنٌّ', 'ضَآلًّا', 'دَآبَّةٍ', 'اٰلْئٰنَ', 'آٰلذَّكَرَيْنِ', 'مُدْهَآمَّتٰنِ', 'أَتُحَآجُّوْٓنِّيْ', 'كَآفَّةً', 'الْحَآقَّةُ', 'وَالصّٰٓفّٰتِ', 'حَآجُّوْكَ', 'وَحَآجَّهُ', 'تَحٰٓضُّوْنَ', 'يُحَآدُّوْنَ', 'أَنْ يَّتَمَآسَّا', 'وَلَا الضَّآلِّيْنَ', 'طَآمَّةُ']
  },
  {
    id: 'leen_laazim',
    titleUrdu: 'مَدِّ لِیْن لَازِم (Madd Leen Laazim)',
    titleEnglish: 'Compulsory Leen Madd',
    definitionUrdu: 'حروفِ لین کے بعد سکونِ اصلی ہو تو مدِّ لین لازم ہوگا۔',
    cause: 'سکونِ اصلی',
    durationAlif: '۳ الف',
    durationHarakat: '۶ حرکات (طول)',
    colorGradient: 'from-rose-600 via-pink-600 to-red-700',
    badgeBg: 'bg-rose-500/20 border-rose-400',
    badgeText: 'text-rose-300',
    exampleWords: ['عَیْنٓ']
  },
  {
    id: 'aaridh',
    titleUrdu: 'مَدِّ عَارِض (Madd Aaridh Waqfi)',
    titleEnglish: 'Temporary Madd on Waqf',
    definitionUrdu: 'حروفِ مدہ کے بعد عارضی سکون ہو (یعنی وقف کرنے کی وجہ سے آخری حرف ساکن ہو جائے) تو مدِّ عارض ہوگا۔',
    cause: 'سکونِ عارضی (وقف)',
    durationAlif: '۱، ۲ یا ۳ الف',
    durationHarakat: '۲، ۴ یا ۶ حرکات (قصر، توسط، طول)',
    colorGradient: 'from-amber-600 via-orange-600 to-yellow-600',
    badgeBg: 'bg-amber-500/20 border-amber-400',
    badgeText: 'text-amber-300',
    exampleWords: ['مُسْلِمُوْنْ ۝', 'يٰٓأُولِي الْأَلْبَابِ ۝', 'يَتَسَآءَلُوْنَ ۝', 'رَبِّ الْعٰلَمِیْنَ ۝', 'نَسْتَعِیْنُ ۝', 'تَعْلَمُوْنَ ۝']
  },
  {
    id: 'leen_aaridh',
    titleUrdu: 'مَدِّ لِیْن عَارِض (Madd Leen Aaridh)',
    titleEnglish: 'Temporary Leen Madd on Waqf',
    definitionUrdu: 'حروفِ لین کے بعد عارضی سکون ہو (یعنی وقف کرنے کی وجہ سے آخری حرف ساکن ہو جائے) تو مدِّ لین عارض ہوگا۔',
    cause: 'سکونِ عارضی (وقف)',
    durationAlif: '۱، ۲ یا ۳ الف',
    durationHarakat: '۲، ۴ یا ۶ حرکات (قصر، توسط، طول)',
    colorGradient: 'from-yellow-500 via-amber-500 to-orange-500',
    badgeBg: 'bg-yellow-500/20 border-yellow-400',
    badgeText: 'text-yellow-300',
    exampleWords: ['شَفَتَیْنْ ۝', 'خَوْفٍ ۝', 'قُرَیْشٍ ۝', 'الصَّیْفِ ۝', 'بَیْتٍ ۝']
  }
];

export const MADDAT_WORDS: MaddWord[] = [
  // ==========================================
  // ۱. مَدِّ مُتَّصِل (Madd Muttasil)
  // ==========================================
  {
    id: 'muttasil-1',
    arabic: 'جَآءَ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'جیم الف مد زبر جَآ ، ہمزہ زبر ءَ = جَآءَ',
    urduTranslation: 'وہ آیا (ایک ہی کلمے میں الف مدہ کے بعد ہمزہ)',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ مدہ (الف) کے فوراً بعد ہمزہ (ء) اسی کلمے کے اندر آیا ہے۔'
  },
  {
    id: 'muttasil-2',
    arabic: 'جِیْٓءَ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'جیم یا مد زیر جِیْٓ ، ہمزہ زبر ءَ = جِیْٓءَ',
    urduTranslation: 'لایا گیا (یاء مدہ کے بعد ہمزہ اسی کلمے میں)',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ مدہ (یاء) کے بعد ہمزہ اسی کلمے میں واقع ہے۔'
  },
  {
    id: 'muttasil-3',
    arabic: 'سِیْٓئَتْ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'سین یا مد زیر سِیْٓ ، ہمزہ تا زبر ءَ تْ = سِیْٓئَتْ',
    urduTranslation: 'بُرے کر دیے گئے',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'یاء مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-4',
    arabic: 'أُولٰٓئِكَ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'ہمزہ پیش اُ ، لام کھڑا مد زبر لٰٓ ، ہمزہ زیر ءِ ، کاف زبر کَ = أُولٰٓئِكَ',
    urduTranslation: 'وہی لوگ',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'کھڑے زبر کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-5',
    arabic: 'حَدَآئِقَ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'حا زبر حَ ، دال الف مد زبر دَآ ، ہمزہ زیر ءِ ، قاف زبر قَ = حَدَآئِقَ',
    urduTranslation: 'باغات',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-6',
    arabic: 'قُرُوْٓءٍ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'قاف پیش قُ ، را واو مد پیش رُوْٓ ، ہمزہ دو زیر ءِ = قُرُوْٓءٍ',
    urduTranslation: 'مدت / پاکی کے ایام',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'واو مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-7',
    arabic: 'أَوْلِیَآءُ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'ہمزہ واو زبر اَوْ ، لام زیر لِ ، یا الف مد زبر یَآ ، ہمزہ پیش ءُ = أَوْلِیَآءُ',
    urduTranslation: 'دوست و مددگار',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ اسی کلمے میں واقع ہے۔'
  },
  {
    id: 'muttasil-8',
    arabic: 'سَمَآءً',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'سین زبر سَ ، میم الف مد زبر مَآ ، ہمزہ دو زبر ءً = سَمَآءً',
    urduTranslation: 'آسمان',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-9',
    arabic: 'سَوَآءٌ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'سین زبر سَ ، واو الف مد زبر وَآ ، ہمزہ دو پیش ءٌ = سَوَآءٌ',
    urduTranslation: 'برابر ہے',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-10',
    arabic: 'جَزَآءٌ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'جیم زبر جَ ، زا الف مد زبر زَآ ، ہمزہ دو پیش ءٌ = جَزَآءٌ',
    urduTranslation: 'بدلہ',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ اسی کلمے میں ہے۔'
  },
  {
    id: 'muttasil-11',
    arabic: 'مَلٰٓئِكَةُ',
    maddType: 'muttasil',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    spellingHijja: 'میم زبر مَ ، لام کھڑا مد زبر لٰٓ ، ہمزہ زیر ءِ ، کاف زبر کَ ، تا پیش تُ = مَلٰٓئِكَةُ',
    urduTranslation: 'فرشتے',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'کھڑے زبر کے بعد ہمزہ اسی کلمے میں ہے۔'
  },

  // ==========================================
  // ۲. مَدِّ مُنْفَصِل (Madd Munfasil)
  // ==========================================
  {
    id: 'munfasil-1',
    arabic: 'فِيْٓ أَنفُسِكُمْ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'فا یا مد زیر فِيْٓ ، ہمزہ نون زبر اَنْ ، فا پیش فُ ، سین زیر سِ ، کاف میم پیش كُمْ = فِيْٓ أَنفُسِكُمْ',
    urduTranslation: 'تمہاری اپنی جانوں میں (حرفِ مدہ پہلے کلمے میں اور ہمزہ دوسرے کلمے میں)',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ مدہ (یاء) پہلے کلمے کے آخر میں اور ہمزہ (ء) اگلے کلمے کے شروع میں ہے۔'
  },
  {
    id: 'munfasil-2',
    arabic: 'بِمَآ أُنْزِلَ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'با زیر بِ ، میم الف مد زبر مَآ ، ہمزہ نون پیش اُنْ ، زا زیر زِ ، لام زبر لَ = بِمَآ أُنْزِلَ',
    urduTranslation: 'اس پر جو نازل کیا گیا',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ پہلے کلمے کے آخر میں اور ہمزہ دوسرے کلمے میں ہے۔'
  },
  {
    id: 'munfasil-3',
    arabic: 'قَالُوْٓا آمَنَّا',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'قاف الف زبر قَا ، لام واو مد پیش لُوْٓ ، ہمزہ کھڑا زبر اٰ ، میم نون زبر مَنْ ، نون الف زبر نَا = قَالُوْٓا آمَنَّا',
    urduTranslation: 'انہوں نے کہا ہم ایمان لائے',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'واو مدہ پہلے کلمے میں اور ہمزہ اگلے کلمے میں ہے۔'
  },
  {
    id: 'munfasil-4',
    arabic: 'يَآ أَرْضُ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'یا الف مد زبر یَآ ، ہمزہ را زبر اَرْ ، ضاد پیش ضُ = يَآ أَرْضُ',
    urduTranslation: 'اے زمین!',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ ندا (یا) کے بعد ہمزہ منادیٰ کے شروع میں ہے۔'
  },
  {
    id: 'munfasil-5',
    arabic: 'هٰٓؤُلَاءِ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل و مُتَّصِل',
    spellingHijja: 'ہا کھڑا مد زبر هٰٓ ، ہمزہ پیش اُ ، لام الف مد زبر لَآ ، ہمزہ زیر ءِ = هٰٓؤُلَاءِ',
    urduTranslation: 'یہ سب (پہلی مد منفصل اور دوسری متصل ہے)',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'پہلی مد ہا کے بعد ہمزہ دوسرے کلمے کی طرح ہے (منفصل) اور دوسری مد متصل ہے۔'
  },
  {
    id: 'munfasil-6',
    arabic: 'يٰبَنِيْٓ إِسْرَآئِيْلَ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'یا کھڑا زبر یٰ ، با زبر بَ ، نون یا مد زیر نِیْٓ ، ہمزہ سین زیر اِسْ ، را الف مد زبر رَآ ، ہمزہ یا زیر ءِ یْ ، لام زبر لَ = يٰبَنِيْٓ إِسْرَآئِيْلَ',
    urduTranslation: 'اے بنی اسرائیل!',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'بَنِيْٓ کا یاء مدہ پہلے اور إِسْرَآئِيْلَ کا ہمزہ دوسرے کلمے میں ہے۔'
  },
  {
    id: 'munfasil-7',
    arabic: 'لَآ إِلٰهَ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'لام الف مد زبر لَآ ، ہمزہ زیر ءِ ، لام کھڑا زبر لٰ ، ہا زبر هَ = لَآ إِلٰهَ',
    urduTranslation: 'کوئی معبود نہیں',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ دوسرے کلمے میں ہے۔'
  },
  {
    id: 'munfasil-8',
    arabic: 'إِلَّآ أَنْتَ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'ہمزہ زیر اِ ، لام الف مد زبر لَّآ ، ہمزہ نون زبر اَنْ ، تا زبر تَ = إِلَّآ أَنْتَ',
    urduTranslation: 'مگر تو ہی',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد ہمزہ دوسرے کلمے میں ہے۔'
  },
  {
    id: 'munfasil-9',
    arabic: 'إِنَّآ أَنْزَلْنٰهُ',
    maddType: 'munfasil',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    spellingHijja: 'ہمزہ نون زیر اِنْ ، نون الف مد زبر نَّآ ، ہمزہ نون زبر اَنْ ، زا لام زبر زَلْ ، نون کھڑا زبر نٰ ، ہا پیش هُ = إِنَّآ أَنْزَلْنٰهُ',
    urduTranslation: 'بے شک ہم نے اسے نازل فرمایا',
    durationText: '۲ سے ۲.۵ الف (۴ تا ۵ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ پہلے کلمے میں اور ہمزہ دوسرے کلمے میں ہے۔'
  },

  // ==========================================
  // ۳. مَدِّ لَازِم (Madd Laazim)
  // ==========================================
  {
    id: 'laazim-1',
    arabic: 'جَآنٌّ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'جیم الف نون مد زبر جَانْ ، نون دو پیش نٌ = جَآنٌّ',
    urduTranslation: 'جنات (الف مدہ کے بعد تشدید یعنی سکون اصلی)',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'حرفِ مدہ (الف) کے فوراً بعد سکونِ اصلی (تشدید) آئی ہے۔'
  },
  {
    id: 'laazim-2',
    arabic: 'ضَآلًّا',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'ضاد الف لام مد زبر ضَالْ ، لام دو زبر لًا = ضَآلًّا',
    urduTranslation: 'بھٹکا ہوا',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد تشدید (سکون اصلی) واقع ہے۔'
  },
  {
    id: 'laazim-3',
    arabic: 'دَآبَّةٍ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'دال الف با مد زبر دَابْ ، با زبر بَ ، تا دو زیر تٍ = دَآبَّةٍ',
    urduTranslation: 'کوئی بھی جاندار / چلنے والا',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد باء پر تشدید ہے۔'
  },
  {
    id: 'laazim-4',
    arabic: 'اٰلْئٰنَ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مخفف',
    spellingHijja: 'ہمزہ کھڑا لام مد زبر اٰلْ ، ہمزہ کھڑا زبر اٰ ، نون زبر نَ = اٰلْئٰنَ',
    urduTranslation: 'کیا اب؟ (الف مدہ کے بعد جزم یعنی سکون اصلی)',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'حرفِ مدہ کے بعد لام ساکنہ (جزم) سکونِ اصلی کی حالت میں ہے۔'
  },
  {
    id: 'laazim-5',
    arabic: 'آٰلذَّكَرَيْنِ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'ہمزہ الف ذال مد زبر اٰذْ ، ذال زبر ذَ ، کاف زبر کَ ، را یا زبر رَیْ ، نون زیر نِ = آٰلذَّكَرَيْنِ',
    urduTranslation: 'دونوں نر',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد ذال مشددہ ہے۔'
  },
  {
    id: 'laazim-6',
    arabic: 'مُدْهَآمَّتٰنِ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'میم دال پیش مُدْ ، ہا الف میم مد زبر هَامْ ، میم زبر مَ ، تا کھڑا زبر تٰ ، نون زیر نِ = مُدْهَآمَّتٰنِ',
    urduTranslation: 'سیاہی مائل گہرے سبز دو باغ',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد میم مشددہ ہے۔'
  },
  {
    id: 'laazim-7',
    arabic: 'الْحَآقَّةُ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'ہمزہ لام زبر اَلْ ، حا الف قاف مد زبر حَاقْ ، قاف زبر قَ ، تا پیش تُ = الْحَآقَّةُ',
    urduTranslation: 'سچی قائم ہونے والی قیامت',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد قاف مشددہ ہے۔'
  },
  {
    id: 'laazim-8',
    arabic: 'وَالصّٰٓفّٰتِ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'واو صَادْ زبر وَصْ ، صَادْ الف فا مد زبر صَافْ ، فا کھڑا زبر فٰ ، تا زیر تِ = وَالصّٰٓفّٰتِ',
    urduTranslation: 'قسم ہے صف باندھنے والوں کی',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد فا مشددہ ہے۔'
  },
  {
    id: 'laazim-9',
    arabic: 'وَلَا الضَّآلِّيْنَ',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'واو زبر وَ ، لام زبر لَ ، ضاد الف لام مد زبر ضَالْ ، لام یا زیر لِیْ ، نون زبر نَ = وَلَا الضَّآلِّيْنَ',
    urduTranslation: 'اور نہ گمراہوں کا راستہ',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد لام مشددہ ہے۔'
  },
  {
    id: 'laazim-10',
    arabic: 'أَنْ يَّتَمَآسَّا',
    maddType: 'laazim',
    categoryLabelUrdu: 'مَدِّ لَازِم کلمی مثقل',
    spellingHijja: 'ہمزہ یا زبر اَیْ ، تا زبر تَ ، میم الف سین مد زبر مَاسْ ، سین الف زبر سَا = أَنْ يَّتَمَآسَّا',
    urduTranslation: 'اس سے پہلے کہ وہ ایک دوسرے کو چھوئیں',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'الف مدہ کے بعد سین مشددہ ہے۔'
  },

  // ==========================================
  // ۴. مَدِّ لِیْن لَازِم (Madd Leen Laazim)
  // ==========================================
  {
    id: 'leen-laazim-1',
    arabic: 'عَیْنٓ',
    maddType: 'leen_laazim',
    categoryLabelUrdu: 'مَدِّ لِیْن لَازِم',
    spellingHijja: 'عین یا نون مد زبر عَیْنْ = عَیْنٓ',
    urduTranslation: 'حروفِ مقطعات میں عین (یاء لین کے بعد سکونِ اصلی)',
    durationText: '۳ الف (۶ حرکات واجب)',
    harakatCount: 6,
    causeExplanation: 'حرفِ لین (یاء ساکنہ ماقبل مفتوح) کے بعد نون ساکنہ (سکونِ اصلی) ہے۔'
  },

  // ==========================================
  // ۵. مَدِّ عَارِض (Madd Aaridh Waqfi)
  // ==========================================
  {
    id: 'aaridh-1',
    arabic: 'مُسْلِمُوْنْ ۝',
    maddType: 'aaridh',
    categoryLabelUrdu: 'مَدِّ عَارِض وقفی',
    spellingHijja: 'میم سین پیش مُسْ ، لام زیر لِ ، میم واو پیش مُوْ ، نون ساکن = مُسْلِمُوْنْ',
    urduTranslation: 'فرمانبردار (وقف کی حالت میں)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'واو مدہ کے بعد وقف کی وجہ سے نون ساکن (عارضی سکون) ہو گیا ہے۔',
    isWaqfExample: true
  },
  {
    id: 'aaridh-2',
    arabic: 'رَبِّ الْعٰلَمِیْنَ ۝',
    maddType: 'aaridh',
    categoryLabelUrdu: 'مَدِّ عَارِض وقفی',
    spellingHijja: 'را با زبر رَبْ ، با لام زیر بِلْ ، عین کھڑا زبر عٰ ، لام زبر لَ ، میم یا زیر مِیْ ، نون ساکن = رَبِّ الْعٰلَمِیْنَ',
    urduTranslation: 'تمام جہانوں کا پالنے والا (وقف کی صورت میں)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'یاء مدہ کے بعد وقف کی وجہ سے نون عارضی طور پر ساکن ہو گیا ہے۔',
    isWaqfExample: true
  },
  {
    id: 'aaridh-3',
    arabic: 'يٰٓأُولِي الْأَلْبَابِ ۝',
    maddType: 'aaridh',
    categoryLabelUrdu: 'مَدِّ عَارِض وقفی',
    spellingHijja: 'ہمزہ لام زبر اَلْ ، لام زبر لَ ، با الف زبر بَا ، با ساکن (قلقلہ) = الْأَلْبَابِ',
    urduTranslation: 'اے عقل والو! (وقف پر)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'الف مدہ کے بعد وقف کے سبب باء ساکن ہو گئی ہے۔',
    isWaqfExample: true
  },
  {
    id: 'aaridh-4',
    arabic: 'يَتَسَآءَلُوْنَ ۝',
    maddType: 'aaridh',
    categoryLabelUrdu: 'مَدِّ عَارِض وقفی',
    spellingHijja: 'یا زبر یَ ، تا زبر تَ ، سین الف مد زبر سَآ ، ہمزہ زبر ءَ ، لام واو پیش لُوْ ، نون ساکن = يَتَسَآءَلُوْنَ',
    urduTranslation: 'وہ آپس میں پوچھتے ہیں (وقف پر)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'واو مدہ کے بعد وقف کی وجہ سے نون عارضی ساکن ہے۔',
    isWaqfExample: true
  },

  // ==========================================
  // ۶. مَدِّ لِیْن عَارِض (Madd Leen Aaridh)
  // ==========================================
  {
    id: 'leen-aaridh-1',
    arabic: 'شَفَتَیْنْ ۝',
    maddType: 'leen_aaridh',
    categoryLabelUrdu: 'مَدِّ لِیْن عَارِض',
    spellingHijja: 'شین زبر شَ ، فا زبر فَ ، تا یا زبر تَیْ ، نون ساکن = شَفَتَیْنْ',
    urduTranslation: 'دو ہونٹ (وقف کی صورت میں یاء لین کے بعد عارضی سکون)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ لین (یاء لین) کے بعد وقف کی وجہ سے نون ساکن ہو گیا ہے۔',
    isWaqfExample: true
  },
  {
    id: 'leen-aaridh-2',
    arabic: 'خَوْفٍ ۝',
    maddType: 'leen_aaridh',
    categoryLabelUrdu: 'مَدِّ لِیْن عَارِض',
    spellingHijja: 'خا واو زبر خَوْ ، فا ساکن = خَوْفٍ',
    urduTranslation: 'خوف و ڈر (وقف پر واؤ لین کے بعد عارضی سکون)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'حرفِ لین (واو لین) کے بعد وقف کے سبب فاء ساکن ہو گئی ہے۔',
    isWaqfExample: true
  },
  {
    id: 'leen-aaridh-3',
    arabic: 'قُرَیْشٍ ۝',
    maddType: 'leen_aaridh',
    categoryLabelUrdu: 'مَدِّ لِیْن عَارِض',
    spellingHijja: 'قاف پیش قُ ، را یا زبر رَیْ ، شین ساکن = قُرَیْشٍ',
    urduTranslation: 'قریش (وقف پر یاء لین کے بعد عارضی سکون)',
    durationText: '۱، ۲ یا ۳ الف (۲، ۴ یا ۶ حرکات)',
    harakatCount: 4,
    causeExplanation: 'یاء لین کے بعد وقف کے سبب شین ساکن ہو گئی ہے۔',
    isWaqfExample: true
  }
];
