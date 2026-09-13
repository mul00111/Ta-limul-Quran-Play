export type MaddahType = 'alif' | 'waw' | 'yaa';

export interface MaddahPairItem {
  id: number;
  letter: string;
  baseLetterName: string;
  maddahType: MaddahType;
  harakahDisplay: string; // e.g. بَ
  maddahDisplay: string;  // e.g. بَا
  harakahHijja: string;
  maddahHijja: string;
  combinedRaw: string;
  combinedHijja: string;
  isHeavy: boolean;
  tajweedNote: string;
}

export interface MaddahMashqWord {
  id: number;
  word: string;
  maddahType: MaddahType | 'mixed';
  hijjaText: string;
  rawSound: string;
  category: 'short' | 'compound';
  page: 16 | 17 | 18 | 20;
  meaningOrContext?: string;
  tajweedNotes: string;
  isHeavy?: boolean;
}

export interface TajweedRuleItem {
  id: number;
  title: string;
  urduDescription: string;
  exampleArabic: string;
  highlightText: string;
}

export const HUROOF_MADDAH_RULES: TajweedRuleItem[] = [
  {
    id: 1,
    title: 'حروفِ مدہ کی تعریف',
    urduDescription: 'حروفِ مدہ تین (۳) ہیں: الف مدہ ، واؤ مدہ ، اور یاء مدہ۔ ان کو ایک الف یعنی دو حرکات کے برابر کھینچ کر پڑھا جاتا ہے۔',
    exampleArabic: 'بَا ، بُوْ ، بِيْ',
    highlightText: '۳ حروف: ا ، و ، ی'
  },
  {
    id: 2,
    title: 'الف مدہ کا قاعدہ',
    urduDescription: 'خالی الف سے پہلے حرف پر زبر آئے تو الف مدہ ہوگا، جیسے: بَ + ا = بَا ۔',
    exampleArabic: 'بَ + ا = بَا (با الف زبر بَا)',
    highlightText: 'الف سے پہلے زبر'
  },
  {
    id: 3,
    title: 'واؤ مدہ کا قاعدہ',
    urduDescription: 'واؤ ساکن (وْ) سے پہلے حرف پر پیش آئے تو واؤ مدہ ہوگا، جیسے: اُ + وْ = اُوْ ، بُ + وْ = بُوْ ۔',
    exampleArabic: 'اُ + وْ = اُوْ ، بُوْ (با واؤ پیش بُوْ)',
    highlightText: 'واؤ ساکن سے پہلے پیش'
  },
  {
    id: 4,
    title: 'یاء مدہ کا قاعدہ',
    urduDescription: 'یاء ساکن (يْ) سے پہلے حرف کے نیچے زیر آئے تو یاء مدہ ہوگا، جیسے: اِ + يْ = اِيْ ، بِ + يْ = بِيْ ۔',
    exampleArabic: 'اِ + يْ = اِيْ ، بِيْ (با یا زیر بِيْ)',
    highlightText: 'یاء ساکن سے پہلے زیر'
  },
  {
    id: 5,
    title: 'حرکات اور مدہ کا فرق (۲۹ حروف)',
    urduDescription: 'حرکت (زبر، زیر، پیش) کو بغیر کھینچے جلدی پڑھیں، جبکہ مدہ کو ایک الف (دو حرکات) کھینچ کر پڑھیں۔ دونوں کا تقابلی موازنہ دیا گیا ہے۔',
    exampleArabic: 'بَ بَا  |  بُ بُوْ  |  بِ بِيْ',
    highlightText: 'حرکت بمقابلہ مدہ'
  },
  {
    id: 6,
    title: 'حروفِ مستعلیہ (پُر حروف)',
    urduDescription: 'سات حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) کو حروفِ مدہ اور مشق کے الفاظ میں بھی ہمیشہ پُر (موٹا) پڑھا جائے گا۔',
    exampleArabic: 'خَا ، صُوْ ، طِيْ ، قَالَ ، خُرُوْجِ',
    highlightText: 'ہمیشہ پُر (موٹا) پڑھیں'
  }
];

// =========================================================================
// 1. PAGE 16: ALIF MADDAH - 29 LETTERS (Harakah vs Maddah Pair Grid)
// =========================================================================
export const ALIF_MADDAH_29_PAIRS: MaddahPairItem[] = [
  {
    id: 1,
    letter: 'ء',
    baseLetterName: 'ہمزہ',
    maddahType: 'alif',
    harakahDisplay: 'ءَ',
    maddahDisplay: 'ءَا',
    harakahHijja: 'ہمزہ زبر ءَ',
    maddahHijja: 'ہمزہ الف زبر ءَا',
    combinedRaw: 'ءَ ءَا',
    combinedHijja: 'ہمزہ زبر ءَ ، ہمزہ الف زبر ءَا = ءَ ءَا',
    isHeavy: false,
    tajweedNote: 'الف پر جب زبر آئے تو وہ ہمزہ کہلاتا ہے۔'
  },
  {
    id: 2,
    letter: 'ب',
    baseLetterName: 'با',
    maddahType: 'alif',
    harakahDisplay: 'بَ',
    maddahDisplay: 'بَا',
    harakahHijja: 'با زبر بَ',
    maddahHijja: 'با الف زبر بَا',
    combinedRaw: 'بَ بَا',
    combinedHijja: 'با زبر بَ ، با الف زبر بَا = بَ بَا',
    isHeavy: false,
    tajweedNote: 'بَ کو بغیر کھینچے اور بَا کو ایک الف کھینچ کر پڑھیں۔'
  },
  {
    id: 3,
    letter: 'ت',
    baseLetterName: 'تا',
    maddahType: 'alif',
    harakahDisplay: 'تَ',
    maddahDisplay: 'تَا',
    harakahHijja: 'تا زبر تَ',
    maddahHijja: 'تا الف زبر تَا',
    combinedRaw: 'تَ تَا',
    combinedHijja: 'تا زبر تَ ، تا الف زبر تَا = تَ تَا',
    isHeavy: false,
    tajweedNote: 'تَ باریک اور تَا ایک الف کھینچ کر۔'
  },
  {
    id: 4,
    letter: 'ث',
    baseLetterName: 'ثا',
    maddahType: 'alif',
    harakahDisplay: 'ثَ',
    maddahDisplay: 'ثَا',
    harakahHijja: 'ثا زبر ثَ',
    maddahHijja: 'ثا الف زبر ثَا',
    combinedRaw: 'ثَ ثَا',
    combinedHijja: 'ثا زبر ثَ ، ثا الف زبر ثَا = ثَ ثَا',
    isHeavy: false,
    tajweedNote: 'ثا نرمی سے ادا کریں۔'
  },
  {
    id: 5,
    letter: 'ج',
    baseLetterName: 'جیم',
    maddahType: 'alif',
    harakahDisplay: 'جَ',
    maddahDisplay: 'جَا',
    harakahHijja: 'جیم زبر جَ',
    maddahHijja: 'جیم الف زبر جَا',
    combinedRaw: 'جَ جَا',
    combinedHijja: 'جیم زبر جَ ، جیم الف زبر جَا = جَ جَا',
    isHeavy: false,
    tajweedNote: 'جیم کی آواز میں سختی برقرار رکھیں۔'
  },
  {
    id: 6,
    letter: 'ح',
    baseLetterName: 'حا',
    maddahType: 'alif',
    harakahDisplay: 'حَ',
    maddahDisplay: 'حَا',
    harakahHijja: 'حا زبر حَ',
    maddahHijja: 'حا الف زبر حَا',
    combinedRaw: 'حَ حَا',
    combinedHijja: 'حا زبر حَ ، حا الف زبر حَا = حَ حَا',
    isHeavy: false,
    tajweedNote: 'حا حلق کے درمیان سے صاف ادا کریں۔'
  },
  {
    id: 7,
    letter: 'خ',
    baseLetterName: 'خا',
    maddahType: 'alif',
    harakahDisplay: 'خَ',
    maddahDisplay: 'خَا',
    harakahHijja: 'خا زبر خَ',
    maddahHijja: 'خا الف زبر خَا',
    combinedRaw: 'خَ خَا',
    combinedHijja: 'خا زبر خَ ، خا الف زبر خَا = خَ خَا',
    isHeavy: true,
    tajweedNote: 'خا حرفِ مستعلیہ ہے، الف مدہ میں بھی پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 8,
    letter: 'د',
    baseLetterName: 'دال',
    maddahType: 'alif',
    harakahDisplay: 'دَ',
    maddahDisplay: 'دَا',
    harakahHijja: 'دال زبر دَ',
    maddahHijja: 'دال الف زبر دَا',
    combinedRaw: 'دَ دَا',
    combinedHijja: 'دال زبر دَ ، دال الف زبر دَا = دَ دَا',
    isHeavy: false,
    tajweedNote: 'دال باریک پڑھیں۔'
  },
  {
    id: 9,
    letter: 'ذ',
    baseLetterName: 'ذال',
    maddahType: 'alif',
    harakahDisplay: 'ذَ',
    maddahDisplay: 'ذَا',
    harakahHijja: 'ذال زبر ذَ',
    maddahHijja: 'ذال الف زبر ذَا',
    combinedRaw: 'ذَ ذَا',
    combinedHijja: 'ذال زبر ذَ ، ذال الف زبر ذَا = ذَ ذَا',
    isHeavy: false,
    tajweedNote: 'ذال نرمی سے ادا کریں۔'
  },
  {
    id: 10,
    letter: 'ر',
    baseLetterName: 'را',
    maddahType: 'alif',
    harakahDisplay: 'رَ',
    maddahDisplay: 'رَا',
    harakahHijja: 'را زبر رَ',
    maddahHijja: 'را الف زبر رَا',
    combinedRaw: 'رَ رَا',
    combinedHijja: 'را زبر رَ ، را الف زبر رَا = رَ رَا',
    isHeavy: true,
    tajweedNote: 'راء پر زبر ہونے کی وجہ سے پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 11,
    letter: 'ز',
    baseLetterName: 'زا',
    maddahType: 'alif',
    harakahDisplay: 'زَ',
    maddahDisplay: 'زَا',
    harakahHijja: 'زا زبر زَ',
    maddahHijja: 'زا الف زبر زَا',
    combinedRaw: 'زَ زَا',
    combinedHijja: 'زا زبر زَ ، زا الف زبر زَا = زَ زَا',
    isHeavy: false,
    tajweedNote: 'زا سیٹی کی تیز آواز کے ساتھ۔'
  },
  {
    id: 12,
    letter: 'س',
    baseLetterName: 'سین',
    maddahType: 'alif',
    harakahDisplay: 'سَ',
    maddahDisplay: 'سَا',
    harakahHijja: 'سین زبر سَ',
    maddahHijja: 'سین الف زبر سَا',
    combinedRaw: 'سَ سَا',
    combinedHijja: 'سین زبر سَ ، سین الف زبر سَا = سَ سَا',
    isHeavy: false,
    tajweedNote: 'سین سیٹی دار اور باریک۔'
  },
  {
    id: 13,
    letter: 'ش',
    baseLetterName: 'شین',
    maddahType: 'alif',
    harakahDisplay: 'شَ',
    maddahDisplay: 'شَا',
    harakahHijja: 'شین زبر شَ',
    maddahHijja: 'شین الف زبر شَا',
    combinedRaw: 'شَ شَا',
    combinedHijja: 'شین زبر شَ ، شین الف زبر شَا = شَ شَا',
    isHeavy: false,
    tajweedNote: 'شین میں تفشی (ہوا کا پھیلنا) ہے۔'
  },
  {
    id: 14,
    letter: 'ص',
    baseLetterName: 'صاد',
    maddahType: 'alif',
    harakahDisplay: 'صَ',
    maddahDisplay: 'صَا',
    harakahHijja: 'صاد زبر صَ',
    maddahHijja: 'صاد الف زبر صَا',
    combinedRaw: 'صَ صَا',
    combinedHijja: 'صاد زبر صَ ، صاد الف زبر صَا = صَ صَا',
    isHeavy: true,
    tajweedNote: 'صاد مستعلیہ و اطباق ہے، پُر اور سیٹی کے ساتھ۔'
  },
  {
    id: 15,
    letter: 'ض',
    baseLetterName: 'ضاد',
    maddahType: 'alif',
    harakahDisplay: 'ضَ',
    maddahDisplay: 'ضَا',
    harakahHijja: 'ضاد زبر ضَ',
    maddahHijja: 'ضاد الف زبر ضَا',
    combinedRaw: 'ضَ ضَا',
    combinedHijja: 'ضاد زبر ضَ ، ضاد الف زبر ضَا = ضَ ضَا',
    isHeavy: true,
    tajweedNote: 'ضاد زبان کی کروٹ سے پُر ادا کریں۔'
  },
  {
    id: 16,
    letter: 'ط',
    baseLetterName: 'طا',
    maddahType: 'alif',
    harakahDisplay: 'طَ',
    maddahDisplay: 'طَا',
    harakahHijja: 'طا زبر طَ',
    maddahHijja: 'طا الف زبر طَا',
    combinedRaw: 'طَ طَا',
    combinedHijja: 'طا زبر طَ ، طا الف زبر طَا = طَ طَا',
    isHeavy: true,
    tajweedNote: 'طا سب سے زیادہ پر اور موٹا حرف ہے۔'
  },
  {
    id: 17,
    letter: 'ظ',
    baseLetterName: 'ظا',
    maddahType: 'alif',
    harakahDisplay: 'ظَ',
    maddahDisplay: 'ظَا',
    harakahHijja: 'ظا زبر ظَ',
    maddahHijja: 'ظا الف زبر ظَا',
    combinedRaw: 'ظَ ظَا',
    combinedHijja: 'ظا زبر ظَ ، ظا الف زبر ظَا = ظَ ظَا',
    isHeavy: true,
    tajweedNote: 'ظا نرمی اور پُر آواز سے۔'
  },
  {
    id: 18,
    letter: 'ع',
    baseLetterName: 'عین',
    maddahType: 'alif',
    harakahDisplay: 'عَ',
    maddahDisplay: 'عَا',
    harakahHijja: 'عین زبر عَ',
    maddahHijja: 'عین الف زبر عَا',
    combinedRaw: 'عَ عَا',
    combinedHijja: 'عین زبر عَ ، عین الف زبر عَا = عَ عَا',
    isHeavy: false,
    tajweedNote: 'عین حلق کے درمیان سے صاف نکالیں۔'
  },
  {
    id: 19,
    letter: 'غ',
    baseLetterName: 'غین',
    maddahType: 'alif',
    harakahDisplay: 'غَ',
    maddahDisplay: 'غَا',
    harakahHijja: 'غین زبر غَ',
    maddahHijja: 'غین الف زبر غَا',
    combinedRaw: 'غَ غَا',
    combinedHijja: 'غین زبر غَ ، غین الف زبر غَا = غَ غَا',
    isHeavy: true,
    tajweedNote: 'غین حرفِ مستعلیہ ہے، پُر پڑھیں۔'
  },
  {
    id: 20,
    letter: 'ف',
    baseLetterName: 'فا',
    maddahType: 'alif',
    harakahDisplay: 'فَ',
    maddahDisplay: 'فَا',
    harakahHijja: 'فا زبر فَ',
    maddahHijja: 'فا الف زبر فَا',
    combinedRaw: 'فَ فَا',
    combinedHijja: 'فا زبر فَ ، فا الف زبر فَا = فَ فَا',
    isHeavy: false,
    tajweedNote: 'فا سامنے کے اوپر کے دانت اور نچلے ہونٹ سے۔'
  },
  {
    id: 21,
    letter: 'ق',
    baseLetterName: 'قاف',
    maddahType: 'alif',
    harakahDisplay: 'قَ',
    maddahDisplay: 'قَا',
    harakahHijja: 'قاف زبر قَ',
    maddahHijja: 'قاف الف زبر قَا',
    combinedRaw: 'قَ قَا',
    combinedHijja: 'قاف زبر قَ ، قاف الف زبر قَا = قَ قَا',
    isHeavy: true,
    tajweedNote: 'قاف کوا کے پاس سے پُر پڑھا جاتا ہے۔'
  },
  {
    id: 22,
    letter: 'ك',
    baseLetterName: 'کاف',
    maddahType: 'alif',
    harakahDisplay: 'كَ',
    maddahDisplay: 'كَا',
    harakahHijja: 'کاف زبر كَ',
    maddahHijja: 'کاف الف زبر كَا',
    combinedRaw: 'كَ كَا',
    combinedHijja: 'کاف زبر كَ ، کاف الف زبر كَا = كَ كَا',
    isHeavy: false,
    tajweedNote: 'کاف باریک پڑھا جاتا ہے۔'
  },
  {
    id: 23,
    letter: 'ل',
    baseLetterName: 'لام',
    maddahType: 'alif',
    harakahDisplay: 'لَ',
    maddahDisplay: 'لَا',
    harakahHijja: 'لام زبر لَ',
    maddahHijja: 'لام الف زبر لَا',
    combinedRaw: 'لَ لَا',
    combinedHijja: 'لام زبر لَ ، لام الف زبر لَا = لَ لَا',
    isHeavy: false,
    tajweedNote: 'لام باریک ادا کریں۔'
  },
  {
    id: 24,
    letter: 'م',
    baseLetterName: 'میم',
    maddahType: 'alif',
    harakahDisplay: 'مَ',
    maddahDisplay: 'مَا',
    harakahHijja: 'میم زبر مَ',
    maddahHijja: 'میم الف زبر مَا',
    combinedRaw: 'مَ مَا',
    combinedHijja: 'میم زبر مَ ، میم الف زبر مَا = مَ مَا',
    isHeavy: false,
    tajweedNote: 'میم دونوں ہونٹوں کے خشکی والے حصے سے۔'
  },
  {
    id: 25,
    letter: 'ن',
    baseLetterName: 'نون',
    maddahType: 'alif',
    harakahDisplay: 'نَ',
    maddahDisplay: 'نَا',
    harakahHijja: 'نون زبر نَ',
    maddahHijja: 'نون الف زبر نَا',
    combinedRaw: 'نَ نَا',
    combinedHijja: 'نون زبر نَ ، نون الف زبر نَا = نَ نَا',
    isHeavy: false,
    tajweedNote: 'نون زبان کی نوک اور تالو سے۔'
  },
  {
    id: 26,
    letter: 'و',
    baseLetterName: 'واؤ',
    maddahType: 'alif',
    harakahDisplay: 'وَ',
    maddahDisplay: 'وَا',
    harakahHijja: 'واؤ زبر وَ',
    maddahHijja: 'واؤ الف زبر وَا',
    combinedRaw: 'وَ وَا',
    combinedHijja: 'واؤ زبر وَ ، واؤ الف زبر وَا = وَ وَا',
    isHeavy: false,
    tajweedNote: 'واؤ دونوں ہونٹوں کو گول کر کے۔'
  },
  {
    id: 27,
    letter: 'ه',
    baseLetterName: 'ہا',
    maddahType: 'alif',
    harakahDisplay: 'هَ',
    maddahDisplay: 'هَا',
    harakahHijja: 'ہا زبر هَ',
    maddahHijja: 'ہا الف زبر هَا',
    combinedRaw: 'هَ هَا',
    combinedHijja: 'ہا زبر هَ ، ہا الف زبر هَا = هَ هَا',
    isHeavy: false,
    tajweedNote: 'ہا سینے کی طرف والے حلق کے نیچے سے۔'
  },
  {
    id: 28,
    letter: 'لا',
    baseLetterName: 'لام الف',
    maddahType: 'alif',
    harakahDisplay: 'لَا',
    maddahDisplay: 'لَا',
    harakahHijja: 'لام الف زبر لَا',
    maddahHijja: 'لام الف زبر لَا',
    combinedRaw: 'لَا لَا',
    combinedHijja: 'لام الف زبر لَا = لَا',
    isHeavy: false,
    tajweedNote: 'لام الف مرکب حرف ہے۔'
  },
  {
    id: 29,
    letter: 'ي',
    baseLetterName: 'یا',
    maddahType: 'alif',
    harakahDisplay: 'يَ',
    maddahDisplay: 'يَا',
    harakahHijja: 'یا زبر يَ',
    maddahHijja: 'یا الف زبر يَا',
    combinedRaw: 'يَ يَا',
    combinedHijja: 'یا زبر يَ ، یا الف زبر يَا = يَ يَا',
    isHeavy: false,
    tajweedNote: 'یا زبان کے درمیان سے ادا ہوتی ہے۔'
  }
];

// =========================================================================
// 2. PAGE 17: WAW MADDAH - 29 LETTERS (Harakah vs Maddah Pair Grid)
// =========================================================================
export const WAW_MADDAH_29_PAIRS: MaddahPairItem[] = [
  {
    id: 1,
    letter: 'ء',
    baseLetterName: 'ہمزہ',
    maddahType: 'waw',
    harakahDisplay: 'اُ',
    maddahDisplay: 'اُوْ',
    harakahHijja: 'ہمزہ پیش اُ',
    maddahHijja: 'ہمزہ واؤ پیش اُوْ',
    combinedRaw: 'اُ اُوْ',
    combinedHijja: 'ہمزہ پیش اُ ، ہمزہ واؤ پیش اُوْ = اُ اُوْ',
    isHeavy: false,
    tajweedNote: 'الف پر پیش ہو تو وہ ہمزہ ہے۔ اُ + وْ = اُوْ'
  },
  {
    id: 2,
    letter: 'ب',
    baseLetterName: 'با',
    maddahType: 'waw',
    harakahDisplay: 'بُ',
    maddahDisplay: 'بُوْ',
    harakahHijja: 'با پیش بُ',
    maddahHijja: 'با واؤ پیش بُوْ',
    combinedRaw: 'بُ بُوْ',
    combinedHijja: 'با پیش بُ ، با واؤ پیش بُوْ = بُ بُوْ',
    isHeavy: false,
    tajweedNote: 'بُ بغیر کھینچے اور بُوْ ایک الف کھینچ کر۔'
  },
  {
    id: 3,
    letter: 'ت',
    baseLetterName: 'تا',
    maddahType: 'waw',
    harakahDisplay: 'تُ',
    maddahDisplay: 'تُوْ',
    harakahHijja: 'تا پیش تُ',
    maddahHijja: 'تا واؤ پیش تُوْ',
    combinedRaw: 'تُ تُوْ',
    combinedHijja: 'تا پیش تُ ، تا واؤ پیش تُوْ = تُ تُوْ',
    isHeavy: false,
    tajweedNote: 'تُوْ کو معروف اور ایک الف کھینچیں۔'
  },
  {
    id: 4,
    letter: 'ث',
    baseLetterName: 'ثا',
    maddahType: 'waw',
    harakahDisplay: 'ثُ',
    maddahDisplay: 'ثُوْ',
    harakahHijja: 'ثا پیش ثُ',
    maddahHijja: 'ثا واؤ پیش ثُوْ',
    combinedRaw: 'ثُ ثُوْ',
    combinedHijja: 'ثا پیش ثُ ، ثا واؤ پیش ثُوْ = ثُ ثُوْ',
    isHeavy: false,
    tajweedNote: 'ثا نرمی سے ادا کریں۔'
  },
  {
    id: 5,
    letter: 'ج',
    baseLetterName: 'جیم',
    maddahType: 'waw',
    harakahDisplay: 'جُ',
    maddahDisplay: 'جُوْ',
    harakahHijja: 'جیم پیش جُ',
    maddahHijja: 'جیم واؤ پیش جُوْ',
    combinedRaw: 'جُ جُوْ',
    combinedHijja: 'جیم پیش جُ ، جیم واؤ پیش جُوْ = جُ جُوْ',
    isHeavy: false,
    tajweedNote: 'جُوْ معروف ادا کریں۔'
  },
  {
    id: 6,
    letter: 'ح',
    baseLetterName: 'حا',
    maddahType: 'waw',
    harakahDisplay: 'حُ',
    maddahDisplay: 'حُوْ',
    harakahHijja: 'حا پیش حُ',
    maddahHijja: 'حا واؤ پیش حُوْ',
    combinedRaw: 'حُ حُوْ',
    combinedHijja: 'حا پیش حُ ، حا واؤ پیش حُوْ = حُ حُوْ',
    isHeavy: false,
    tajweedNote: 'حا حلق کے درمیان سے۔'
  },
  {
    id: 7,
    letter: 'خ',
    baseLetterName: 'خا',
    maddahType: 'waw',
    harakahDisplay: 'خُ',
    maddahDisplay: 'خُوْ',
    harakahHijja: 'خا پیش خُ',
    maddahHijja: 'خا واؤ پیش خُوْ',
    combinedRaw: 'خُ خُوْ',
    combinedHijja: 'خا پیش خُ ، خا واؤ پیش خُوْ = خُ خُوْ',
    isHeavy: true,
    tajweedNote: 'خُوْ کو پُر (موٹا) ادا کریں۔'
  },
  {
    id: 8,
    letter: 'د',
    baseLetterName: 'دال',
    maddahType: 'waw',
    harakahDisplay: 'دُ',
    maddahDisplay: 'دُوْ',
    harakahHijja: 'دال پیش دُ',
    maddahHijja: 'دال واؤ پیش دُوْ',
    combinedRaw: 'دُ دُوْ',
    combinedHijja: 'دال پیش دُ ، دال واؤ پیش دُوْ = دُ دُوْ',
    isHeavy: false,
    tajweedNote: 'دال باریک پڑھیں۔'
  },
  {
    id: 9,
    letter: 'ذ',
    baseLetterName: 'ذال',
    maddahType: 'waw',
    harakahDisplay: 'ذُ',
    maddahDisplay: 'ذُوْ',
    harakahHijja: 'ذال پیش ذُ',
    maddahHijja: 'ذال واؤ پیش ذُوْ',
    combinedRaw: 'ذُ ذُوْ',
    combinedHijja: 'ذال پیش ذُ ، ذال واؤ پیش ذُوْ = ذُ ذُوْ',
    isHeavy: false,
    tajweedNote: 'ذال نرمی سے۔'
  },
  {
    id: 10,
    letter: 'ر',
    baseLetterName: 'را',
    maddahType: 'waw',
    harakahDisplay: 'رُ',
    maddahDisplay: 'رُوْ',
    harakahHijja: 'را پیش رُ',
    maddahHijja: 'را واؤ پیش رُوْ',
    combinedRaw: 'رُ رُوْ',
    combinedHijja: 'را پیش رُ ، را واؤ پیش رُوْ = رُ رُوْ',
    isHeavy: true,
    tajweedNote: 'راء پر پیش ہونے کی وجہ سے پُر (موٹا) پڑھیں۔'
  },
  {
    id: 11,
    letter: 'ز',
    baseLetterName: 'زا',
    maddahType: 'waw',
    harakahDisplay: 'زُ',
    maddahDisplay: 'زُوْ',
    harakahHijja: 'زا پیش زُ',
    maddahHijja: 'زا واؤ پیش زُوْ',
    combinedRaw: 'زُ زُوْ',
    combinedHijja: 'زا پیش زُ ، زا واؤ پیش زُوْ = زُ زُوْ',
    isHeavy: false,
    tajweedNote: 'زا سیٹی کی تیز آواز کے ساتھ۔'
  },
  {
    id: 12,
    letter: 'س',
    baseLetterName: 'سین',
    maddahType: 'waw',
    harakahDisplay: 'سُ',
    maddahDisplay: 'سُوْ',
    harakahHijja: 'سین پیش سُ',
    maddahHijja: 'سین واؤ پیش سُوْ',
    combinedRaw: 'سُ سُوْ',
    combinedHijja: 'سین پیش سُ ، سین واؤ پیش سُوْ = سُ سُوْ',
    isHeavy: false,
    tajweedNote: 'سین باریک اور سیٹی دار۔'
  },
  {
    id: 13,
    letter: 'ش',
    baseLetterName: 'شین',
    maddahType: 'waw',
    harakahDisplay: 'شُ',
    maddahDisplay: 'شُوْ',
    harakahHijja: 'شین پیش شُ',
    maddahHijja: 'شین واؤ پیش شُوْ',
    combinedRaw: 'شُ شُوْ',
    combinedHijja: 'شین پیش شُ ، شین واؤ پیش شُوْ = شُ شُوْ',
    isHeavy: false,
    tajweedNote: 'شین کی آواز کو منہ میں پھیلائیں۔'
  },
  {
    id: 14,
    letter: 'ص',
    baseLetterName: 'صاد',
    maddahType: 'waw',
    harakahDisplay: 'صُ',
    maddahDisplay: 'صُوْ',
    harakahHijja: 'صاد پیش صُ',
    maddahHijja: 'صاد واؤ پیش صُوْ',
    combinedRaw: 'صُ صُوْ',
    combinedHijja: 'صاد پیش صُ ، صاد واؤ پیش صُوْ = صُ صُوْ',
    isHeavy: true,
    tajweedNote: 'صُوْ کو پُر اور سیٹی سے ادا کریں۔'
  },
  {
    id: 15,
    letter: 'ض',
    baseLetterName: 'ضاد',
    maddahType: 'waw',
    harakahDisplay: 'ضُ',
    maddahDisplay: 'ضُوْ',
    harakahHijja: 'ضاد پیش ضُ',
    maddahHijja: 'ضاد واؤ پیش ضُوْ',
    combinedRaw: 'ضُ ضُوْ',
    combinedHijja: 'ضاد پیش ضُ ، ضاد واؤ پیش ضُوْ = ضُ ضُوْ',
    isHeavy: true,
    tajweedNote: 'ضُوْ کو پُر ادا کریں۔'
  },
  {
    id: 16,
    letter: 'ط',
    baseLetterName: 'طا',
    maddahType: 'waw',
    harakahDisplay: 'طُ',
    maddahDisplay: 'طُوْ',
    harakahHijja: 'طا پیش طُ',
    maddahHijja: 'طا واؤ پیش طُوْ',
    combinedRaw: 'طُ طُوْ',
    combinedHijja: 'طا پیش طُ ، طا واؤ پیش طُوْ = طُ طُوْ',
    isHeavy: true,
    tajweedNote: 'طُوْ کو انتہائی پُر و بلند پڑھیں۔'
  },
  {
    id: 17,
    letter: 'ظ',
    baseLetterName: 'ظا',
    maddahType: 'waw',
    harakahDisplay: 'ظُ',
    maddahDisplay: 'ظُوْ',
    harakahHijja: 'ظا پیش ظُ',
    maddahHijja: 'ظا واؤ پیش ظُوْ',
    combinedRaw: 'ظُ ظُوْ',
    combinedHijja: 'ظا پیش ظُ ، ظا واؤ پیش ظُوْ = ظُ ظُوْ',
    isHeavy: true,
    tajweedNote: 'ظُوْ کو نرمی اور پُر پڑھیں۔'
  },
  {
    id: 18,
    letter: 'ع',
    baseLetterName: 'عین',
    maddahType: 'waw',
    harakahDisplay: 'عُ',
    maddahDisplay: 'عُوْ',
    harakahHijja: 'عین پیش عُ',
    maddahHijja: 'عین واؤ پیش عُوْ',
    combinedRaw: 'عُ عُوْ',
    combinedHijja: 'عین پیش عُ ، عین واؤ پیش عُوْ = عُ عُوْ',
    isHeavy: false,
    tajweedNote: 'عین حلق کے درمیان سے۔'
  },
  {
    id: 19,
    letter: 'غ',
    baseLetterName: 'غین',
    maddahType: 'waw',
    harakahDisplay: 'غُ',
    maddahDisplay: 'غُوْ',
    harakahHijja: 'غین پیش غُ',
    maddahHijja: 'غین واؤ پیش غُوْ',
    combinedRaw: 'غُ غُوْ',
    combinedHijja: 'غین پیش غُ ، غین واؤ پیش غُوْ = غُ غُوْ',
    isHeavy: true,
    tajweedNote: 'غُوْ کو پُر پڑھیں۔'
  },
  {
    id: 20,
    letter: 'ف',
    baseLetterName: 'فا',
    maddahType: 'waw',
    harakahDisplay: 'فُ',
    maddahDisplay: 'فُوْ',
    harakahHijja: 'فا پیش فُ',
    maddahHijja: 'فا واؤ پیش فُوْ',
    combinedRaw: 'فُ فُوْ',
    combinedHijja: 'فا پیش فُ ، فا واؤ پیش فُوْ = فُ فُوْ',
    isHeavy: false,
    tajweedNote: 'فا کو باریک پڑھیں۔'
  },
  {
    id: 21,
    letter: 'ق',
    baseLetterName: 'قاف',
    maddahType: 'waw',
    harakahDisplay: 'قُ',
    maddahDisplay: 'قُوْ',
    harakahHijja: 'قاف پیش قُ',
    maddahHijja: 'قاف واؤ پیش قُوْ',
    combinedRaw: 'قُ قُوْ',
    combinedHijja: 'قاف پیش قُ ، قاف واؤ پیش قُوْ = قُ قُوْ',
    isHeavy: true,
    tajweedNote: 'قُوْ کو پُر (موٹا) پڑھیں۔'
  },
  {
    id: 22,
    letter: 'ك',
    baseLetterName: 'کاف',
    maddahType: 'waw',
    harakahDisplay: 'كُ',
    maddahDisplay: 'كُوْ',
    harakahHijja: 'کاف پیش كُ',
    maddahHijja: 'کاف واؤ پیش كُوْ',
    combinedRaw: 'كُ كُوْ',
    combinedHijja: 'کاف پیش كُ ، کاف واؤ پیش كُوْ = كُ كُوْ',
    isHeavy: false,
    tajweedNote: 'کاف باریک پڑھیں۔'
  },
  {
    id: 23,
    letter: 'ل',
    baseLetterName: 'لام',
    maddahType: 'waw',
    harakahDisplay: 'لُ',
    maddahDisplay: 'لُوْ',
    harakahHijja: 'لام پیش لُ',
    maddahHijja: 'لام واؤ پیش لُوْ',
    combinedRaw: 'لُ لُوْ',
    combinedHijja: 'لام پیش لُ ، لام واؤ پیش لُوْ = لُ لُوْ',
    isHeavy: false,
    tajweedNote: 'لام باریک ادا کریں۔'
  },
  {
    id: 24,
    letter: 'م',
    baseLetterName: 'میم',
    maddahType: 'waw',
    harakahDisplay: 'مُ',
    maddahDisplay: 'مُوْ',
    harakahHijja: 'میم پیش مُ',
    maddahHijja: 'میم واؤ پیش مُوْ',
    combinedRaw: 'مُ مُوْ',
    combinedHijja: 'میم پیش مُ ، میم واؤ پیش مُوْ = مُ مُوْ',
    isHeavy: false,
    tajweedNote: 'میم ہونٹ ملا کر۔'
  },
  {
    id: 25,
    letter: 'ن',
    baseLetterName: 'نون',
    maddahType: 'waw',
    harakahDisplay: 'نُ',
    maddahDisplay: 'نُوْ',
    harakahHijja: 'نون پیش نُ',
    maddahHijja: 'نون واؤ پیش نُوْ',
    combinedRaw: 'نُ نُوْ',
    combinedHijja: 'نون پیش نُ ، نون واؤ پیش نُوْ = نُ نُوْ',
    isHeavy: false,
    tajweedNote: 'نُوْ کو ایک الف کھینچیں۔'
  },
  {
    id: 26,
    letter: 'و',
    baseLetterName: 'واؤ',
    maddahType: 'waw',
    harakahDisplay: 'وُ',
    maddahDisplay: 'وُوْ',
    harakahHijja: 'واؤ پیش وُ',
    maddahHijja: 'واؤ واؤ پیش وُوْ',
    combinedRaw: 'وُ وُوْ',
    combinedHijja: 'واؤ پیش وُ ، واؤ واؤ پیش وُوْ = وُ وُوْ',
    isHeavy: false,
    tajweedNote: 'ہونٹ گول کر کے ادا کریں۔'
  },
  {
    id: 27,
    letter: 'ه',
    baseLetterName: 'ہا',
    maddahType: 'waw',
    harakahDisplay: 'هُ',
    maddahDisplay: 'هُوْ',
    harakahHijja: 'ہا پیش هُ',
    maddahHijja: 'ہا واؤ پیش هُوْ',
    combinedRaw: 'هُ هُوْ',
    combinedHijja: 'ہا پیش هُ ، ہا واؤ پیش هُوْ = هُ هُوْ',
    isHeavy: false,
    tajweedNote: 'ہا سینے کی طرف کے حلق سے۔'
  },
  {
    id: 28,
    letter: 'ء',
    baseLetterName: 'ہمزہ',
    maddahType: 'waw',
    harakahDisplay: 'ءُ',
    maddahDisplay: 'ءُوْ',
    harakahHijja: 'ہمزہ پیش ءِ',
    maddahHijja: 'ہمزہ واؤ پیش ءُوْ',
    combinedRaw: 'ءُ ءُوْ',
    combinedHijja: 'ہمزہ پیش ءِ ، ہمزہ واؤ پیش ءُوْ = ءُ ءُوْ',
    isHeavy: false,
    tajweedNote: 'ہمزہ کو جھٹکے بغیر معروف پڑھیں۔'
  },
  {
    id: 29,
    letter: 'ي',
    baseLetterName: 'یا',
    maddahType: 'waw',
    harakahDisplay: 'يُ',
    maddahDisplay: 'يُوْ',
    harakahHijja: 'یا پیش يُ',
    maddahHijja: 'یا واؤ پیش يُوْ',
    combinedRaw: 'يُ يُوْ',
    combinedHijja: 'یا پیش يُ ، یا واؤ پیش يُوْ = يُ يُوْ',
    isHeavy: false,
    tajweedNote: 'یا زبان کے درمیان سے۔'
  }
];

// =========================================================================
// 3. PAGE 18: YAA MADDAH - 29 LETTERS (Harakah vs Maddah Pair Grid)
// =========================================================================
export const YAA_MADDAH_29_PAIRS: MaddahPairItem[] = [
  {
    id: 1,
    letter: 'ء',
    baseLetterName: 'ہمزہ',
    maddahType: 'yaa',
    harakahDisplay: 'اِ',
    maddahDisplay: 'اِيْ',
    harakahHijja: 'ہمزہ زیر اِ',
    maddahHijja: 'ہمزہ یا زیر اِيْ',
    combinedRaw: 'اِ اِيْ',
    combinedHijja: 'ہمزہ زیر اِ ، ہمزہ یا زیر اِيْ = اِ اِيْ',
    isHeavy: false,
    tajweedNote: 'اِ + يْ = اِيْ ۔ الف کے نیچے زیر ہو تو وہ ہمزہ کہلاتا ہے۔'
  },
  {
    id: 2,
    letter: 'ب',
    baseLetterName: 'با',
    maddahType: 'yaa',
    harakahDisplay: 'بِ',
    maddahDisplay: 'بِيْ',
    harakahHijja: 'با زیر بِ',
    maddahHijja: 'با یا زیر بِيْ',
    combinedRaw: 'بِ بِيْ',
    combinedHijja: 'با زیر بِ ، با یا زیر بِيْ = بِ بِيْ',
    isHeavy: false,
    tajweedNote: 'بِ بغیر کھینچے اور بِيْ ایک الف کھینچ کر۔'
  },
  {
    id: 3,
    letter: 'ت',
    baseLetterName: 'تا',
    maddahType: 'yaa',
    harakahDisplay: 'تِ',
    maddahDisplay: 'تِيْ',
    harakahHijja: 'تا زیر تِ',
    maddahHijja: 'تا یا زیر تِيْ',
    combinedRaw: 'تِ تِيْ',
    combinedHijja: 'تا زیر تِ ، تا یا زیر تِيْ = تِ تِيْ',
    isHeavy: false,
    tajweedNote: 'تِيْ معروف اور ایک الف کھینچیں۔'
  },
  {
    id: 4,
    letter: 'ث',
    baseLetterName: 'ثا',
    maddahType: 'yaa',
    harakahDisplay: 'ثِ',
    maddahDisplay: 'ثِيْ',
    harakahHijja: 'ثا زیر ثِ',
    maddahHijja: 'ثا یا زیر ثِيْ',
    combinedRaw: 'ثِ ثِيْ',
    combinedHijja: 'ثا زیر ثِ ، ثا یا زیر ثِيْ = ثِ ثِيْ',
    isHeavy: false,
    tajweedNote: 'ثا نرمی سے۔'
  },
  {
    id: 5,
    letter: 'ج',
    baseLetterName: 'جیم',
    maddahType: 'yaa',
    harakahDisplay: 'جِ',
    maddahDisplay: 'جِيْ',
    harakahHijja: 'جیم زیر جِ',
    maddahHijja: 'جیم یا زیر جِيْ',
    combinedRaw: 'جِ جِيْ',
    combinedHijja: 'جیم زیر جِ ، جیم یا زیر جِيْ = جِ جِيْ',
    isHeavy: false,
    tajweedNote: 'جِيْ معروف آواز میں۔'
  },
  {
    id: 6,
    letter: 'ح',
    baseLetterName: 'حا',
    maddahType: 'yaa',
    harakahDisplay: 'حِ',
    maddahDisplay: 'حِيْ',
    harakahHijja: 'حا زیر حِ',
    maddahHijja: 'حا یا زیر حِيْ',
    combinedRaw: 'حِ حِيْ',
    combinedHijja: 'حا زیر حِ ، حا یا زیر حِيْ = حِ حِيْ',
    isHeavy: false,
    tajweedNote: 'حا حلق کے درمیان سے۔'
  },
  {
    id: 7,
    letter: 'خ',
    baseLetterName: 'خا',
    maddahType: 'yaa',
    harakahDisplay: 'خِ',
    maddahDisplay: 'خِيْ',
    harakahHijja: 'خا زیر خِ',
    maddahHijja: 'خا یا زیر خِيْ',
    combinedRaw: 'خِ خِيْ',
    combinedHijja: 'خا زیر خِ ، خا یا زیر خِيْ = خِ خِيْ',
    isHeavy: true,
    tajweedNote: 'خِيْ کو پُر پڑھا جائے گا۔'
  },
  {
    id: 8,
    letter: 'د',
    baseLetterName: 'دال',
    maddahType: 'yaa',
    harakahDisplay: 'دِ',
    maddahDisplay: 'دِيْ',
    harakahHijja: 'دال زیر دِ',
    maddahHijja: 'دال یا زیر دِيْ',
    combinedRaw: 'دِ دِيْ',
    combinedHijja: 'دال زیر دِ ، دال یا زیر دِيْ = دِ دِيْ',
    isHeavy: false,
    tajweedNote: 'دال باریک پڑھیں۔'
  },
  {
    id: 9,
    letter: 'ذ',
    baseLetterName: 'ذال',
    maddahType: 'yaa',
    harakahDisplay: 'ذِ',
    maddahDisplay: 'ذِيْ',
    harakahHijja: 'ذال زیر ذِ',
    maddahHijja: 'ذال یا زیر ذِيْ',
    combinedRaw: 'ذِ ذِيْ',
    combinedHijja: 'ذال زیر ذِ ، ذال یا زیر ذِيْ = ذِ ذِيْ',
    isHeavy: false,
    tajweedNote: 'ذال نرمی سے۔'
  },
  {
    id: 10,
    letter: 'ر',
    baseLetterName: 'را',
    maddahType: 'yaa',
    harakahDisplay: 'رِ',
    maddahDisplay: 'رِيْ',
    harakahHijja: 'را زیر رِ',
    maddahHijja: 'را یا زیر رِيْ',
    combinedRaw: 'رِ رِيْ',
    combinedHijja: 'را زیر رِ ، را یا زیر رِيْ = رِ رِيْ',
    isHeavy: false,
    tajweedNote: 'راء کے نیچے زیر ہونے کی وجہ سے باریک (ترقیق) پڑھی جائے گی۔'
  },
  {
    id: 11,
    letter: 'ز',
    baseLetterName: 'زا',
    maddahType: 'yaa',
    harakahDisplay: 'زِ',
    maddahDisplay: 'زِيْ',
    harakahHijja: 'زا زیر زِ',
    maddahHijja: 'زا یا زیر زِيْ',
    combinedRaw: 'زِ زِيْ',
    combinedHijja: 'زا زیر زِ ، زا یا زیر زِيْ = زِ زِيْ',
    isHeavy: false,
    tajweedNote: 'زا سیٹی کی آواز سے۔'
  },
  {
    id: 12,
    letter: 'س',
    baseLetterName: 'سین',
    maddahType: 'yaa',
    harakahDisplay: 'سِ',
    maddahDisplay: 'سِيْ',
    harakahHijja: 'سین زیر سِ',
    maddahHijja: 'سین یا زیر سِيْ',
    combinedRaw: 'سِ سِيْ',
    combinedHijja: 'سین زیر سِ ، سین یا زیر سِيْ = سِ سِيْ',
    isHeavy: false,
    tajweedNote: 'سین باریک اور سیٹی دار۔'
  },
  {
    id: 13,
    letter: 'ش',
    baseLetterName: 'شین',
    maddahType: 'yaa',
    harakahDisplay: 'شِ',
    maddahDisplay: 'شِيْ',
    harakahHijja: 'شین زیر شِ',
    maddahHijja: 'شین یا زیر شِيْ',
    combinedRaw: 'شِ شِيْ',
    combinedHijja: 'شین زیر شِ ، شین یا زیر شِيْ = شِ شِيْ',
    isHeavy: false,
    tajweedNote: 'شین کی ہوا پھیلا کر۔'
  },
  {
    id: 14,
    letter: 'ص',
    baseLetterName: 'صاد',
    maddahType: 'yaa',
    harakahDisplay: 'صِ',
    maddahDisplay: 'صِيْ',
    harakahHijja: 'صاد زیر صِ',
    maddahHijja: 'صاد یا زیر صِيْ',
    combinedRaw: 'صِ صِيْ',
    combinedHijja: 'صاد زیر صِ ، صاد یا زیر صِيْ = صِ صِيْ',
    isHeavy: true,
    tajweedNote: 'صِيْ کو پُر پڑھیں۔'
  },
  {
    id: 15,
    letter: 'ض',
    baseLetterName: 'ضاد',
    maddahType: 'yaa',
    harakahDisplay: 'ضِ',
    maddahDisplay: 'ضِيْ',
    harakahHijja: 'ضاد زیر ضِ',
    maddahHijja: 'ضاد یا زیر ضِيْ',
    combinedRaw: 'ضِ ضِيْ',
    combinedHijja: 'ضاد زیر ضِ ، ضاد یا زیر ضِيْ = ضِ ضِيْ',
    isHeavy: true,
    tajweedNote: 'ضِيْ کو پُر پڑھیں۔'
  },
  {
    id: 16,
    letter: 'ط',
    baseLetterName: 'طا',
    maddahType: 'yaa',
    harakahDisplay: 'طِ',
    maddahDisplay: 'طِيْ',
    harakahHijja: 'طا زیر طِ',
    maddahHijja: 'طا یا زیر طِيْ',
    combinedRaw: 'طِ طِيْ',
    combinedHijja: 'طا زیر طِ ، طا یا زیر طِيْ = طِ طِيْ',
    isHeavy: true,
    tajweedNote: 'طِيْ کو پُر اور بلند پڑھیں۔'
  },
  {
    id: 17,
    letter: 'ظ',
    baseLetterName: 'ظا',
    maddahType: 'yaa',
    harakahDisplay: 'ظِ',
    maddahDisplay: 'ظِيْ',
    harakahHijja: 'ظا زیر ظِ',
    maddahHijja: 'ظا یا زیر ظِيْ',
    combinedRaw: 'ظِ ظِيْ',
    combinedHijja: 'ظا زیر ظِ ، ظا یا زیر ظِيْ = ظِ ظِيْ',
    isHeavy: true,
    tajweedNote: 'ظِيْ کو نرمی اور پُر پڑھیں۔'
  },
  {
    id: 18,
    letter: 'ع',
    baseLetterName: 'عین',
    maddahType: 'yaa',
    harakahDisplay: 'عِ',
    maddahDisplay: 'عِيْ',
    harakahHijja: 'عین زیر عِ',
    maddahHijja: 'عین یا زیر عِيْ',
    combinedRaw: 'عِ عِيْ',
    combinedHijja: 'عین زیر عِ ، عین یا زیر عِيْ = عِ عِيْ',
    isHeavy: false,
    tajweedNote: 'عین حلق کے درمیان سے۔'
  },
  {
    id: 19,
    letter: 'غ',
    baseLetterName: 'غین',
    maddahType: 'yaa',
    harakahDisplay: 'غِ',
    maddahDisplay: 'غِيْ',
    harakahHijja: 'غین زیر غِ',
    maddahHijja: 'غین یا زیر غِيْ',
    combinedRaw: 'غِ غِيْ',
    combinedHijja: 'غین زیر غِ ، غین یا زیر غِيْ = غِ غِيْ',
    isHeavy: true,
    tajweedNote: 'غِيْ کو پُر پڑھیں۔'
  },
  {
    id: 20,
    letter: 'ف',
    baseLetterName: 'فا',
    maddahType: 'yaa',
    harakahDisplay: 'فِ',
    maddahDisplay: 'فِيْ',
    harakahHijja: 'فا زیر فِ',
    maddahHijja: 'فا یا زیر فِيْ',
    combinedRaw: 'فِ فِيْ',
    combinedHijja: 'فا زیر فِ ، فا یا زیر فِيْ = فِ فِيْ',
    isHeavy: false,
    tajweedNote: 'فا کو باریک ادا کریں۔'
  },
  {
    id: 21,
    letter: 'ق',
    baseLetterName: 'قاف',
    maddahType: 'yaa',
    harakahDisplay: 'قِ',
    maddahDisplay: 'قِيْ',
    harakahHijja: 'قاف زیر قِ',
    maddahHijja: 'قاف یا زیر قِيْ',
    combinedRaw: 'قِ قِيْ',
    combinedHijja: 'قاف زیر قِ ، قاف یا زیر قِيْ = قِ قِيْ',
    isHeavy: true,
    tajweedNote: 'قِيْ کو پُر پڑھیں۔'
  },
  {
    id: 22,
    letter: 'ك',
    baseLetterName: 'کاف',
    maddahType: 'yaa',
    harakahDisplay: 'كِ',
    maddahDisplay: 'كِيْ',
    harakahHijja: 'کاف زیر كِ',
    maddahHijja: 'کاف یا زیر كِيْ',
    combinedRaw: 'كِ كِيْ',
    combinedHijja: 'کاف زیر كِ ، کاف یا زیر كِيْ = كِ كِيْ',
    isHeavy: false,
    tajweedNote: 'کاف باریک پڑھیں۔'
  },
  {
    id: 23,
    letter: 'ل',
    baseLetterName: 'لام',
    maddahType: 'yaa',
    harakahDisplay: 'لِ',
    maddahDisplay: 'لِيْ',
    harakahHijja: 'لام زیر لِ',
    maddahHijja: 'لام یا زیر لِيْ',
    combinedRaw: 'لِ لِيْ',
    combinedHijja: 'لام زیر لِ ، لام یا زیر لِيْ = لِ لِيْ',
    isHeavy: false,
    tajweedNote: 'لام باریک ادا کریں۔'
  },
  {
    id: 24,
    letter: 'م',
    baseLetterName: 'میم',
    maddahType: 'yaa',
    harakahDisplay: 'مِ',
    maddahDisplay: 'مِيْ',
    harakahHijja: 'میم زیر مِ',
    maddahHijja: 'میم یا زیر مِيْ',
    combinedRaw: 'مِ مِيْ',
    combinedHijja: 'میم زیر مِ ، میم یا زیر مِيْ = مِ مِيْ',
    isHeavy: false,
    tajweedNote: 'میم دونوں ہونٹوں سے۔'
  },
  {
    id: 25,
    letter: 'ن',
    baseLetterName: 'نون',
    maddahType: 'yaa',
    harakahDisplay: 'نِ',
    maddahDisplay: 'نِيْ',
    harakahHijja: 'نون زیر نِ',
    maddahHijja: 'نون یا زیر نِيْ',
    combinedRaw: 'نِ نِيْ',
    combinedHijja: 'نون زیر نِ ، نون یا زیر نِيْ = نِ نِيْ',
    isHeavy: false,
    tajweedNote: 'نون باریک اور ایک الف کھینچ کر۔'
  },
  {
    id: 26,
    letter: 'و',
    baseLetterName: 'واؤ',
    maddahType: 'yaa',
    harakahDisplay: 'وِ',
    maddahDisplay: 'وِيْ',
    harakahHijja: 'واؤ زیر وِ',
    maddahHijja: 'واؤ یا زیر وِيْ',
    combinedRaw: 'وِ وِيْ',
    combinedHijja: 'واؤ زیر وِ ، واؤ یا زیر وِيْ = وِ وِيْ',
    isHeavy: false,
    tajweedNote: 'واؤ ہونٹ گول کر کے۔'
  },
  {
    id: 27,
    letter: 'ه',
    baseLetterName: 'ہا',
    maddahType: 'yaa',
    harakahDisplay: 'هِ',
    maddahDisplay: 'هِيْ',
    harakahHijja: 'ہا زیر هِ',
    maddahHijja: 'ہا یا زیر هِيْ',
    combinedRaw: 'هِ هِيْ',
    combinedHijja: 'ہا زیر هِ ، ہا یا زیر هِيْ = هِ هِيْ',
    isHeavy: false,
    tajweedNote: 'ہا سینے والے حلق سے۔'
  },
  {
    id: 28,
    letter: 'ء',
    baseLetterName: 'ہمزہ',
    maddahType: 'yaa',
    harakahDisplay: 'ءِ',
    maddahDisplay: 'ءِ يْ',
    harakahHijja: 'ہمزہ زیر ءِ',
    maddahHijja: 'ہمزہ یا زیر ءِ يْ',
    combinedRaw: 'ءِ ءِ يْ',
    combinedHijja: 'ہمزہ زیر ءِ ، ہمزہ یا زیر ءِ يْ = ءِ ءِ يْ',
    isHeavy: false,
    tajweedNote: 'ہمزہ زیر ءِ اور یاء مدہ ءِ يْ۔'
  },
  {
    id: 29,
    letter: 'ي',
    baseLetterName: 'یا',
    maddahType: 'yaa',
    harakahDisplay: 'يِ',
    maddahDisplay: 'يِيْ',
    harakahHijja: 'یا زیر يِ',
    maddahHijja: 'یا یا زیر يِيْ',
    combinedRaw: 'يِ يِيْ',
    combinedHijja: 'یا زیر يِ ، یا یا زیر يِيْ = يِ يِيْ',
    isHeavy: false,
    tajweedNote: 'یا زبان کے درمیان سے۔'
  }
];

// =========================================================================
// 4. MASHQ (PRACTICE WORDS) DATA EXACTLY FROM PAGES 16, 17, 18
// =========================================================================

// Page 16 Mashq (30 Words with Alif Maddah)
export const PAGE_16_ALIF_MASHQ_WORDS: MaddahMashqWord[] = [
  // Short 2-Letter Words (15 words)
  {
    id: 101,
    word: 'بَابَ',
    maddahType: 'alif',
    hijjaText: 'با الف زبر بَا ، با زبر بَ = بَابَ',
    rawSound: 'بَابَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'با الف زبر بَا کو ۱ الف کھینچیں اور آخری بَ کو بغیر کھینچے۔'
  },
  {
    id: 102,
    word: 'كَانَ',
    maddahType: 'alif',
    hijjaText: 'کاف الف زبر كَا ، نون زبر نَ = كَانَ',
    rawSound: 'كَانَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'کاف الف زبر كَا (الف مدہ)، نون زبر نَ۔'
  },
  {
    id: 103,
    word: 'عَادَ',
    maddahType: 'alif',
    hijjaText: 'عین الف زبر عَا ، دال زبر دَ = عَادَ',
    rawSound: 'عَادَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'عین حلق کے درمیان سے ادا کریں، عَا ۱ الف کھینچ کر۔'
  },
  {
    id: 104,
    word: 'فَازَ',
    maddahType: 'alif',
    hijjaText: 'فا الف زبر فَا ، زا زبر زَ = فَازَ',
    rawSound: 'فَازَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'فا الف زبر فَا الف مدہ، زا سیٹی دار۔'
  },
  {
    id: 105,
    word: 'زَادَ',
    maddahType: 'alif',
    hijjaText: 'زا الف زبر زَا ، دال زبر دَ = زَادَ',
    rawSound: 'زَادَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'زا الف زبر زَا (۱ الف مدہ)، دال باریک۔'
  },
  {
    id: 106,
    word: 'قَالَ',
    maddahType: 'alif',
    hijjaText: 'قاف الف زبر قَا ، لام زبر لَ = قَالَ',
    rawSound: 'قَالَ',
    category: 'short',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'قاف مستعلیہ ہے، قَا کو پُر اور ۱ الف کھینچ کر پڑھیں۔'
  },
  {
    id: 107,
    word: 'تَابَا',
    maddahType: 'alif',
    hijjaText: 'تا الف زبر تَا ، با الف زبر بَا = تَابَا',
    rawSound: 'تَابَا',
    category: 'short',
    page: 16,
    tajweedNotes: 'تَا اور بَا دونوں الف مدہ ہیں، دونوں کو ۱، ۱ الف کھینچیں۔'
  },
  {
    id: 108,
    word: 'خَابَ',
    maddahType: 'alif',
    hijjaText: 'خا الف زبر خَا ، با زبر بَ = خَابَ',
    rawSound: 'خَابَ',
    category: 'short',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'خا مستعلیہ ہے، خَا کو پُر پڑھیں۔'
  },
  {
    id: 109,
    word: 'لَنَا',
    maddahType: 'alif',
    hijjaText: 'لام زبر لَ ، نون الف زبر نَا = لَنَا',
    rawSound: 'لَنَا',
    category: 'short',
    page: 16,
    tajweedNotes: 'لَ بغیر کھینچے، نَا ۱ الف کھینچ کر۔'
  },
  {
    id: 110,
    word: 'نَارُ',
    maddahType: 'alif',
    hijjaText: 'نون الف زبر نَا ، را پیش رُ = نَارُ',
    rawSound: 'نَارُ',
    category: 'short',
    page: 16,
    tajweedNotes: 'نَا الف مدہ، راء پر پیش کی وجہ سے پُر۔'
  },
  {
    id: 111,
    word: 'نَاسَ',
    maddahType: 'alif',
    hijjaText: 'نون الف زبر نَا ، سین زبر سَ = نَاسَ',
    rawSound: 'نَاسَ',
    category: 'short',
    page: 16,
    tajweedNotes: 'نَا الف مدہ، سین باریک۔'
  },
  {
    id: 112,
    word: 'خَافَ',
    maddahType: 'alif',
    hijjaText: 'خا الف زبر خَا ، فا زبر فَ = خَافَ',
    rawSound: 'خَافَ',
    category: 'short',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'خَا مستعلیہ پُر، فا باریک۔'
  },
  {
    id: 113,
    word: 'رَانَ',
    maddahType: 'alif',
    hijjaText: 'را الف زبر رَا ، نون زبر نَ = رَانَ',
    rawSound: 'رَانَ',
    category: 'short',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'رَا پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 114,
    word: 'مَالَا',
    maddahType: 'alif',
    hijjaText: 'میم الف زبر مَا ، لام الف زبر لَا = مَالَا',
    rawSound: 'مَالَا',
    category: 'short',
    page: 16,
    tajweedNotes: 'مَا اور لَا دونوں میں الف مدہ ہے۔'
  },
  {
    id: 115,
    word: 'فَبَا',
    maddahType: 'alif',
    hijjaText: 'فا زبر فَ ، با الف زبر بَا = فَبَا',
    rawSound: 'فَبَا',
    category: 'short',
    page: 16,
    tajweedNotes: 'فَ جلدی اور بَا ۱ الف کھینچ کر۔'
  },

  // Compound / Quranic Words (15 words)
  {
    id: 116,
    word: 'قُلْنَا',
    maddahType: 'alif',
    hijjaText: 'قاف پیش لام قُلْ ، نون الف زبر نَا = قُلْنَا',
    rawSound: 'قُلْنَا',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'قاف پُر، لام ساکن کو قلقلہ کیے بغیر ملا کر، نَا ۱ الف کھینچیں۔'
  },
  {
    id: 117,
    word: 'مِنْهَا',
    maddahType: 'alif',
    hijjaText: 'میم زیر نون مِنْ ، ہا الف زبر هَا = مِنْهَا',
    rawSound: 'مِنْهَا',
    category: 'compound',
    page: 16,
    tajweedNotes: 'نون ساکن پر اظہار (بغیر غنہ)، هَا ۱ الف کھینچ کر۔'
  },
  {
    id: 118,
    word: 'ثَوَابُ',
    maddahType: 'alif',
    hijjaText: 'ثا زبر ثَ ، واؤ الف زبر وَا ، با پیش بُ = ثَوَابُ',
    rawSound: 'ثَوَابُ',
    category: 'compound',
    page: 16,
    tajweedNotes: 'ثَ نرم، وَا ۱ الف مدہ، بُ جلدی۔'
  },
  {
    id: 119,
    word: 'اَصَابَ',
    maddahType: 'alif',
    hijjaText: 'ہمزہ زبر اَ ، صاد الف زبر صَا ، با زبر بَ = اَصَابَ',
    rawSound: 'اَصَابَ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'صَا مستعلیہ پُر پڑھیں، اَ اور بَ باریک۔'
  },
  {
    id: 120,
    word: 'اَخَاهُ',
    maddahType: 'alif',
    hijjaText: 'ہمزہ زبر اَ ، خا الف زبر خَا ، ہا پیش هُ = اَخَاهُ',
    rawSound: 'اَخَاهُ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'خَا مستعلیہ پُر ۱ الف مدہ، هُ بغیر کھینچے۔'
  },
  {
    id: 121,
    word: 'سَلَامُ',
    maddahType: 'alif',
    hijjaText: 'سین زبر سَ ، لام الف زبر لَا ، میم پیش مُ = سَلَامُ',
    rawSound: 'سَلَامُ',
    category: 'compound',
    page: 16,
    tajweedNotes: 'سَ باریک، لَا ۱ الف مدہ، مُ پیش کے ساتھ۔'
  },
  {
    id: 122,
    word: 'وَاِذَا',
    maddahType: 'alif',
    hijjaText: 'واؤ زبر وَ ، ہمزہ زیر اِ ، ذال الف زبر ذَا = وَاِذَا',
    rawSound: 'وَاِذَا',
    category: 'compound',
    page: 16,
    tajweedNotes: 'وَ اور اِ جلدی، ذَا ۱ الف کھینچ کر۔'
  },
  {
    id: 123,
    word: 'اَرَادَ',
    maddahType: 'alif',
    hijjaText: 'ہمزہ زبر اَ ، را الف زبر رَا ، دال زبر دَ = اَرَادَ',
    rawSound: 'اَرَادَ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'رَا پُر (موٹا) الف مدہ، اَ اور دَ باریک۔'
  },
  {
    id: 124,
    word: 'مَالَهَا',
    maddahType: 'alif',
    hijjaText: 'میم الف زبر مَا ، لام زبر لَ ، ہا الف زبر هَا = مَالَهَا',
    rawSound: 'مَالَهَا',
    category: 'compound',
    page: 16,
    tajweedNotes: 'مَا اور هَا دونوں الف مدہ ہیں (۱، ۱ الف)۔'
  },
  {
    id: 125,
    word: 'مَقَامَ',
    maddahType: 'alif',
    hijjaText: 'میم زبر مَ ، قاف الف زبر قَا ، میم زبر مَ = مَقَامَ',
    rawSound: 'مَقَامَ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'قَا پُر الف مدہ، مَ باریک۔'
  },
  {
    id: 126,
    word: 'خِطَابَ',
    maddahType: 'alif',
    hijjaText: 'خا زیر خِ ، طا الف زبر طَا ، با زبر بَ = خِطَابَ',
    rawSound: 'خِطَابَ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'خِ اور طَا دونوں پُر حروف ہیں، طَا ۱ الف مدہ۔'
  },
  {
    id: 127,
    word: 'مَفَازًا',
    maddahType: 'alif',
    hijjaText: 'میم زبر مَ ، فا الف زبر فَا ، زا دو زبر زًا = مَفَازًا',
    rawSound: 'مَفَازًا',
    category: 'compound',
    page: 16,
    tajweedNotes: 'فَا ۱ الف مدہ، زًا پر تنوین ہے۔'
  },
  {
    id: 128,
    word: 'فِرَاشِ',
    maddahType: 'alif',
    hijjaText: 'فا زیر فِ ، را الف زبر رَا ، شین زیر شِ = فِرَاشِ',
    rawSound: 'فِرَاشِ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'فِ باریک، رَا پُر الف مدہ، شِ باریک۔'
  },
  {
    id: 129,
    word: 'اَبْصَارُ',
    maddahType: 'alif',
    hijjaText: 'ہمزہ زبر با اَبْ ، صاد الف زبر صَا ، را پیش رُ = اَبْصَارُ',
    rawSound: 'اَبْصَارُ',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'با ساکن پر قلقلہ، صَا مستعلیہ پُر الف مدہ، رُ پُر۔'
  },
  {
    id: 130,
    word: 'خَلَقْنَا',
    maddahType: 'alif',
    hijjaText: 'خا زبر خَ ، لام زبر لَ ، قاف جزم قْ ، نون الف زبر نَا = خَلَقْنَا',
    rawSound: 'خَلَقْنَا',
    category: 'compound',
    page: 16,
    isHeavy: true,
    tajweedNotes: 'خَ پُر، قاف ساکن پر قلقلہ، نَا ۱ الف کھینچ کر۔'
  }
];

// Page 17 Mashq (30 Words with Waw Maddah)
export const PAGE_17_WAW_MASHQ_WORDS: MaddahMashqWord[] = [
  // Short Words (15 words)
  {
    id: 201,
    word: 'هُوْدَ',
    maddahType: 'waw',
    hijjaText: 'ہا واؤ پیش هُوْ ، دال زبر دَ = هُوْدَ',
    rawSound: 'هُوْدَ',
    category: 'short',
    page: 17,
    tajweedNotes: 'هُوْ واؤ مدہ (۱ الف کھینچیں)، دَ بغیر کھینچے۔'
  },
  {
    id: 202,
    word: 'نُوْرُ',
    maddahType: 'waw',
    hijjaText: 'نون واؤ پیش نُوْ ، را پیش رُ = نُوْرُ',
    rawSound: 'نُوْرُ',
    category: 'short',
    page: 17,
    tajweedNotes: 'نُوْ واؤ مدہ، رُ پُر۔'
  },
  {
    id: 203,
    word: 'دُوْنِ',
    maddahType: 'waw',
    hijjaText: 'دال واؤ پیش دُوْ ، نون زیر نِ = دُوْنِ',
    rawSound: 'دُوْنِ',
    category: 'short',
    page: 17,
    tajweedNotes: 'دُوْ واؤ مدہ، نِ باریک۔'
  },
  {
    id: 204,
    word: 'حُوْرُ',
    maddahType: 'waw',
    hijjaText: 'حا واؤ پیش حُوْ ، را پیش رُ = حُوْرُ',
    rawSound: 'حُوْرُ',
    category: 'short',
    page: 17,
    tajweedNotes: 'حا حلق کے درمیان سے، حُوْ واؤ مدہ، رُ پُر۔'
  },
  {
    id: 205,
    word: 'لُوْطَ',
    maddahType: 'waw',
    hijjaText: 'لام واؤ پیش لُوْ ، طا زبر طَ = لُوْطَ',
    rawSound: 'لُوْطَ',
    category: 'short',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'لُوْ واؤ مدہ باریک، طَ پُر حرف۔'
  },
  {
    id: 206,
    word: 'نُوْحُ',
    maddahType: 'waw',
    hijjaText: 'نون واؤ پیش نُوْ ، حا پیش حُ = نُوْحُ',
    rawSound: 'نُوْحُ',
    category: 'short',
    page: 17,
    tajweedNotes: 'نُوْ واؤ مدہ، حُ صاف حلق سے۔'
  },
  {
    id: 207,
    word: 'رَضُوْ',
    maddahType: 'waw',
    hijjaText: 'را زبر رَ ، ضاد واؤ پیش ضُوْ = رَضُوْ',
    rawSound: 'رَضُوْ',
    category: 'short',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'رَ اور ضُوْ دونوں پُر ہیں، ضُوْ ۱ الف واؤ مدہ۔'
  },
  {
    id: 208,
    word: 'اَوْفِ',
    maddahType: 'waw',
    hijjaText: 'ہمزہ واؤ زبر اَوْ ، فا زیر فِ = اَوْفِ',
    rawSound: 'اَوْفِ',
    category: 'short',
    page: 17,
    tajweedNotes: 'اَوْ واؤ لین نرمی سے، فِ باریک۔'
  },
  {
    id: 209,
    word: 'رُوْحُ',
    maddahType: 'waw',
    hijjaText: 'را واؤ پیش رُوْ ، حا پیش حُ = رُوْحُ',
    rawSound: 'رُوْحُ',
    category: 'short',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'رُوْ پُر واؤ مدہ، حُ حلق سے۔'
  },
  {
    id: 210,
    word: 'اَخُوْكَ',
    maddahType: 'waw',
    hijjaText: 'ہمزہ زبر اَ ، خا واؤ پیش خُوْ ، کاف زبر كَ = اَخُوْكَ',
    rawSound: 'اَخُوْكَ',
    category: 'short',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'خُوْ پُر واؤ مدہ، اَ اور كَ باریک۔'
  },
  {
    id: 211,
    word: 'وَطُوْرِ',
    maddahType: 'waw',
    hijjaText: 'واؤ زبر وَ ، طا واؤ پیش طُوْ ، را زیر رِ = وَطُوْرِ',
    rawSound: 'وَطُوْرِ',
    category: 'short',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'طُوْ پُر واؤ مدہ، رِ باریک۔'
  },
  {
    id: 212,
    word: 'حُوْتَ',
    maddahType: 'waw',
    hijjaText: 'حا واؤ پیش حُوْ ، تا زبر تَ = حُوْتَ',
    rawSound: 'حُوْتَ',
    category: 'short',
    page: 17,
    tajweedNotes: 'حُوْ واؤ مدہ، تَ باریک۔'
  },
  {
    id: 213,
    word: 'وَدُوْدُ',
    maddahType: 'waw',
    hijjaText: 'واؤ زبر وَ ، دال واؤ پیش دُوْ ، دال پیش دُ = وَدُوْدُ',
    rawSound: 'وَدُوْدُ',
    category: 'short',
    page: 17,
    tajweedNotes: 'وَ جلدی، دُوْ ۱ الف واؤ مدہ، دُ جلدی۔'
  },
  {
    id: 214,
    word: 'رَسُوْلُ',
    maddahType: 'waw',
    hijjaText: 'را زبر رَ ، سین واؤ پیش سُوْ ، لام پیش لُ = رَسُوْلُ',
    rawSound: 'رَسُوْلُ',
    category: 'short',
    page: 17,
    tajweedNotes: 'رَ پُر، سُوْ واؤ مدہ باریک، لُ بغیر کھینچے۔'
  },
  {
    id: 215,
    word: 'مَاعُوْنَ',
    maddahType: 'mixed',
    hijjaText: 'میم الف زبر مَا ، عین واؤ پیش عُوْ ، نون زبر نَ = مَاعُوْنَ',
    rawSound: 'مَاعُوْنَ',
    category: 'short',
    page: 17,
    tajweedNotes: 'مَا الف مدہ (۱ الف)، عُوْ واؤ مدہ (۱ الف)۔'
  },

  // Compound Words (15 words)
  {
    id: 216,
    word: 'ثَمُوْدُ',
    maddahType: 'waw',
    hijjaText: 'ثا زبر ثَ ، میم واؤ پیش مُوْ ، دال پیش دُ = ثَمُوْدُ',
    rawSound: 'ثَمُوْدُ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'ثَ نرم، مُوْ واؤ مدہ، دُ باریک۔'
  },
  {
    id: 217,
    word: 'وَقُوْدُ',
    maddahType: 'waw',
    hijjaText: 'واؤ زبر وَ ، قاف واؤ پیش قُوْ ، دال پیش دُ = وَقُوْدُ',
    rawSound: 'وَقُوْدُ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'قُوْ پُر واؤ مدہ، وَ اور دُ باریک۔'
  },
  {
    id: 218,
    word: 'بُرُوْجِ',
    maddahType: 'waw',
    hijjaText: 'با پیش بُ ، را واؤ پیش رُوْ ، جیم زیر جِ = بُرُوْجِ',
    rawSound: 'بُرُوْجِ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'رُوْ پُر واؤ مدہ، بُ اور جِ باریک۔'
  },
  {
    id: 219,
    word: 'اَبُوْكَ',
    maddahType: 'waw',
    hijjaText: 'ہمزہ زبر اَ ، با واؤ پیش بُوْ ، کاف زبر كَ = اَبُوْكَ',
    rawSound: 'اَبُوْكَ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'بُوْ واؤ مدہ ۱ الف، اَ اور كَ باریک۔'
  },
  {
    id: 220,
    word: 'يُوْلَدُ',
    maddahType: 'waw',
    hijjaText: 'یا واؤ پیش يُوْ ، لام زبر لَ ، دال پیش دُ = يُوْلَدُ',
    rawSound: 'يُوْلَدُ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'يُوْ واؤ مدہ، لَ اور دُ جلدی۔'
  },
  {
    id: 221,
    word: 'نُوْدِيَ',
    maddahType: 'mixed',
    hijjaText: 'نون واؤ پیش نُوْ ، دال زیر دِ ، یا زبر يَ = نُوْدِيَ',
    rawSound: 'نُوْدِيَ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'نُوْ واؤ مدہ، دِ اور يَ جلدی۔'
  },
  {
    id: 222,
    word: 'اَعُوْذُ',
    maddahType: 'waw',
    hijjaText: 'ہمزہ زبر اَ ، عین واؤ پیش عُوْ ، ذال پیش ذُ = اَعُوْذُ',
    rawSound: 'اَعُوْذُ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'عُوْ واؤ مدہ حلق سے، ذُ نرمی سے۔'
  },
  {
    id: 223,
    word: 'وُجُوْهُ',
    maddahType: 'waw',
    hijjaText: 'واؤ پیش وُ ، جیم واؤ پیش جُوْ ، ہا پیش هُ = وُجُوْهُ',
    rawSound: 'وُجُوْهُ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'وُ جلدی، جُوْ واؤ مدہ ۱ الف، هُ جلدی۔'
  },
  {
    id: 224,
    word: 'يَكُوْنُ',
    maddahType: 'waw',
    hijjaText: 'یا زبر يَ ، کاف واؤ پیش كُوْ ، نون پیش نُ = يَكُوْنُ',
    rawSound: 'يَكُوْنُ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'كُوْ واؤ مدہ باریک، يَ اور نُ جلدی۔'
  },
  {
    id: 225,
    word: 'خُرُوْجِ',
    maddahType: 'waw',
    hijjaText: 'خا پیش خُ ، را واؤ پیش رُوْ ، جیم زیر جِ = خُرُوْجِ',
    rawSound: 'خُرُوْجِ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'خُ اور رُوْ دونوں پُر ہیں، رُوْ واؤ مدہ۔'
  },
  {
    id: 226,
    word: 'قُبُوْرِ',
    maddahType: 'waw',
    hijjaText: 'قاف پیش قُ ، با واؤ پیش بُوْ ، را زیر رِ = قُبُوْرِ',
    rawSound: 'قُبُوْرِ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'قُ پُر، بُوْ واؤ مدہ، رِ باریک۔'
  },
  {
    id: 227,
    word: 'هَارُوْنَ',
    maddahType: 'mixed',
    hijjaText: 'ہا الف زبر هَا ، را واؤ پیش رُوْ ، نون زبر نَ = هَارُوْنَ',
    rawSound: 'هَارُوْنَ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'هَا الف مدہ، رُوْ پُر واؤ مدہ، نَ جلدی۔'
  },
  {
    id: 228,
    word: 'وَزُوْرَ',
    maddahType: 'waw',
    hijjaText: 'واؤ زبر وَ ، زا واؤ پیش زُوْ ، را زبر رَ = وَزُوْرَ',
    rawSound: 'وَزُوْرَ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'زُوْ واؤ مدہ سیٹی دار، رَ پُر۔'
  },
  {
    id: 229,
    word: 'هَارُوْتَ',
    maddahType: 'mixed',
    hijjaText: 'ہا الف زبر هَا ، را واؤ پیش رُوْ ، تا زبر تَ = هَارُوْتَ',
    rawSound: 'هَارُوْتَ',
    category: 'compound',
    page: 17,
    isHeavy: true,
    tajweedNotes: 'هَا الف مدہ، رُوْ پُر واؤ مدہ، تَ باریک۔'
  },
  {
    id: 230,
    word: 'اُوْتِيَ',
    maddahType: 'waw',
    hijjaText: 'ہمزہ واؤ پیش اُوْ ، تا زیر تِ ، یا زبر يَ = اُوْتِيَ',
    rawSound: 'اُوْتِيَ',
    category: 'compound',
    page: 17,
    tajweedNotes: 'اُوْ واؤ مدہ ۱ الف، تِ اور يَ جلدی۔'
  }
];

// Page 18 Mashq (25 Words with Yaa Maddah)
export const PAGE_18_YAA_MASHQ_WORDS: MaddahMashqWord[] = [
  // Short Words (15 words)
  {
    id: 301,
    word: 'اَبِيْ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، با یا زیر بِيْ = اَبِيْ',
    rawSound: 'اَبِيْ',
    category: 'short',
    page: 18,
    tajweedNotes: 'اَ جلدی، بِيْ یاء مدہ ۱ الف کھینچیں۔'
  },
  {
    id: 302,
    word: 'اَخِيْ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، خا یا زیر خِيْ = اَخِيْ',
    rawSound: 'اَخِيْ',
    category: 'short',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'خِيْ پُر یاء مدہ، اَ باریک۔'
  },
  {
    id: 303,
    word: 'نَبِيْ',
    maddahType: 'yaa',
    hijjaText: 'نون زبر نَ ، با یا زیر بِيْ = نَبِيْ',
    rawSound: 'نَبِيْ',
    category: 'short',
    page: 18,
    tajweedNotes: 'نَ جلدی، بِيْ یاء مدہ۔'
  },
  {
    id: 304,
    word: 'دِيْنِ',
    maddahType: 'yaa',
    hijjaText: 'دال یا زیر دِيْ ، نون زیر نِ = دِيْنِ',
    rawSound: 'دِيْنِ',
    category: 'short',
    page: 18,
    tajweedNotes: 'دِيْ یاء مدہ ۱ الف، نِ باریک۔'
  },
  {
    id: 305,
    word: 'حِيْنَ',
    maddahType: 'yaa',
    hijjaText: 'حا یا زیر حِيْ ، نون زبر نَ = حِيْنَ',
    rawSound: 'حِيْنَ',
    category: 'short',
    page: 18,
    tajweedNotes: 'حِيْ حلق سے یاء مدہ، نَ جلدی۔'
  },
  {
    id: 306,
    word: 'فِيْهَا',
    maddahType: 'mixed',
    hijjaText: 'فا یا زیر فِيْ ، ہا الف زبر هَا = فِيْهَا',
    rawSound: 'فِيْهَا',
    category: 'short',
    page: 18,
    tajweedNotes: 'فِيْ یاء مدہ اور هَا الف مدہ، دونوں ۱، ۱ الف۔'
  },
  {
    id: 307,
    word: 'قِيْلَ',
    maddahType: 'yaa',
    hijjaText: 'قاف یا زیر قِيْ ، لام زبر لَ = قِيْلَ',
    rawSound: 'قِيْلَ',
    category: 'short',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'قِيْ پُر یاء مدہ، لَ باریک۔'
  },
  {
    id: 308,
    word: 'قُوْلِيْ',
    maddahType: 'mixed',
    hijjaText: 'قاف واؤ پیش قُوْ ، لام یا زیر لِيْ = قُوْلِيْ',
    rawSound: 'قُوْلِيْ',
    category: 'short',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'قُوْ پُر واؤ مدہ، لِيْ یاء مدہ۔'
  },
  {
    id: 309,
    word: 'اَرِنِيْ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، را زیر رِ ، نون یا زیر نِيْ = اَرِنِيْ',
    rawSound: 'اَرِنِيْ',
    category: 'short',
    page: 18,
    tajweedNotes: 'اَ اور رِ جلدی، نِيْ یاء مدہ ۱ الف۔'
  },
  {
    id: 310,
    word: 'دُوْنِيْ',
    maddahType: 'mixed',
    hijjaText: 'دال واؤ پیش دُوْ ، نون یا زیر نِيْ = دُوْنِيْ',
    rawSound: 'دُوْنِيْ',
    category: 'short',
    page: 18,
    tajweedNotes: 'دُوْ واؤ مدہ اور نِيْ یاء مدہ۔'
  },
  {
    id: 311,
    word: 'اَخِيْهِ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، خا یا زیر خِيْ ، ہا زیر هِ = اَخِيْهِ',
    rawSound: 'اَخِيْهِ',
    category: 'short',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'خِيْ پُر یاء مدہ، هِ جلدی۔'
  },
  {
    id: 312,
    word: 'اَمِيْنُ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، میم یا زیر مِيْ ، نون پیش نُ = اَمِيْنُ',
    rawSound: 'اَمِيْنُ',
    category: 'short',
    page: 18,
    tajweedNotes: 'مِيْ یاء مدہ ۱ الف، اَ اور نُ جلدی۔'
  },
  {
    id: 313,
    word: 'اَيْدِيْ',
    maddahType: 'mixed',
    hijjaText: 'ہمزہ یا زبر اَيْ ، دال یا زیر دِيْ = اَيْدِيْ',
    rawSound: 'اَيْدِيْ',
    category: 'short',
    page: 18,
    tajweedNotes: 'اَيْ یاء لین نرمی سے، دِيْ یاء مدہ ۱ الف۔'
  },
  {
    id: 314,
    word: 'يُغْنِيْ',
    maddahType: 'yaa',
    hijjaText: 'یا پیش غین يُغْ ، نون یا زیر نِيْ = يُغْنِيْ',
    rawSound: 'يُغْنِيْ',
    category: 'short',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'غین پُر ساکن، نِيْ یاء مدہ ۱ الف۔'
  },
  {
    id: 315,
    word: 'فِيْلِ',
    maddahType: 'yaa',
    hijjaText: 'فا یا زیر فِيْ ، لام زیر لِ = فِيْلِ',
    rawSound: 'فِيْلِ',
    category: 'short',
    page: 18,
    tajweedNotes: 'فِيْ یاء مدہ، لِ باریک۔'
  },

  // Compound Words (10 words)
  {
    id: 316,
    word: 'قَرِيْبُ',
    maddahType: 'yaa',
    hijjaText: 'قاف زبر قَ ، را یا زیر رِيْ ، با پیش بُ = قَرِيْبُ',
    rawSound: 'قَرِيْبُ',
    category: 'compound',
    page: 18,
    isHeavy: true,
    tajweedNotes: 'قَ پُر، رِيْ باریک یاء مدہ، بُ جلدی۔'
  },
  {
    id: 317,
    word: 'بَعِيْدُ',
    maddahType: 'yaa',
    hijjaText: 'با زبر بَ ، عین یا زیر عِيْ ، دال پیش دُ = بَعِيْدُ',
    rawSound: 'بَعِيْدُ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'عِيْ حلق سے یاء مدہ، بَ اور دُ باریک۔'
  },
  {
    id: 318,
    word: 'اَلِيْمُ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، لام یا زیر لِيْ ، میم پیش مُ = اَلِيْمُ',
    rawSound: 'اَلِيْمُ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'لِيْ یاء مدہ ۱ الف، اَ اور مُ جلدی۔'
  },
  {
    id: 319,
    word: 'اَكِيْدُ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر اَ ، کاف یا زیر كِيْ ، دال پیش دُ = اَكِيْدُ',
    rawSound: 'اَكِيْدُ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'كِيْ یاء مدہ باریک، اَ اور دُ جلدی۔'
  },
  {
    id: 320,
    word: 'اَمْرِيْ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر میم اَمْ ، را یا زیر رِيْ = اَمْرِيْ',
    rawSound: 'اَمْرِيْ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'میم ساکن پر اظہار، رِيْ باریک یاء مدہ۔'
  },
  {
    id: 321,
    word: 'سَبِيْلُ',
    maddahType: 'yaa',
    hijjaText: 'سین زبر سَ ، با یا زیر بِيْ ، لام پیش لُ = سَبِيْلُ',
    rawSound: 'سَبِيْلُ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'سَ باریک، بِيْ یاء مدہ، لُ پیش کے ساتھ۔'
  },
  {
    id: 322,
    word: 'يُرِيْدُ',
    maddahType: 'yaa',
    hijjaText: 'یا پیش يُ ، را یا زیر رِيْ ، دال پیش دُ = يُرِيْدُ',
    rawSound: 'يُرِيْدُ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'رِيْ باریک یاء مدہ، يُ اور دُ جلدی۔'
  },
  {
    id: 323,
    word: 'اَبَابِيْلَ',
    maddahType: 'mixed',
    hijjaText: 'ہمزہ زبر اَ ، با الف زبر بَا ، با یا زیر بِيْ ، لام زبر لَ = اَبَابِيْلَ',
    rawSound: 'اَبَابِيْلَ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'بَا الف مدہ (۱ الف) اور بِيْ یاء مدہ (۱ الف)۔'
  },
  {
    id: 324,
    word: 'ذِكْرِيْ',
    maddahType: 'yaa',
    hijjaText: 'ذال زیر کاف ذِكْ ، را یا زیر رِيْ = ذِكْرِيْ',
    rawSound: 'ذِكْرِيْ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'ذال نرم، کاف ساکن پر ہمْس، رِيْ باریک یاء مدہ۔'
  },
  {
    id: 325,
    word: 'اَزْرِيْ',
    maddahType: 'yaa',
    hijjaText: 'ہمزہ زبر زا اَزْ ، را یا زیر رِيْ = اَزْرِيْ',
    rawSound: 'اَزْرِيْ',
    category: 'compound',
    page: 18,
    tajweedNotes: 'زا سیٹی دار، رِيْ باریک یاء مدہ۔'
  }
];

import { PAGE_20_IMTIHAN_WORDS, ImtihanWordItem } from './page20ImtihanData';

export type { ImtihanWordItem };
export { PAGE_20_IMTIHAN_WORDS };

export const PAGE_20_MADDAH_MASHQ_WORDS: MaddahMashqWord[] = PAGE_20_IMTIHAN_WORDS.map((w) => ({
  id: w.id,
  word: w.word,
  maddahType: w.category === 'alif' ? 'alif' : w.category === 'waw' ? 'waw' : w.category === 'yaa' ? 'yaa' : 'mixed',
  hijjaText: w.hijjaText,
  rawSound: w.rawSound,
  category: w.syllableBreakdown.length <= 2 ? 'short' : 'compound',
  page: 20,
  meaningOrContext: w.meaningOrContext,
  tajweedNotes: w.tajweedNotes,
  isHeavy: w.isHeavy
}));

// All Mashq Words Combined (85 Regular Words + 50 Page 20 Exam Words = 135 Words)
export const ALL_MADDAH_MASHQ_WORDS: MaddahMashqWord[] = [
  ...PAGE_16_ALIF_MASHQ_WORDS,
  ...PAGE_17_WAW_MASHQ_WORDS,
  ...PAGE_18_YAA_MASHQ_WORDS,
  ...PAGE_20_MADDAH_MASHQ_WORDS
];

// =========================================================================
// 5. BOOK SABAQ 7: EXACT GRID ORDER & TRIPLETS (14 Rows x 6 Cells = 84 Boxes)
// As shown in the Madani Qaidah Lesson 7 pages (Images 1 & 2)
// =========================================================================
export interface Sabaq7BookCell {
  id: string;
  letterBase: string;
  baseLetterName: string;
  maddahType: 'alif' | 'waw' | 'yaa';
  arabicText: string;
  harakahSign: 'زبر' | 'پیش' | 'زیر';
  hijjaSpelling: string;
  isHeavy: boolean;
  row: number;
  col: number; // 1 (Rightmost) to 6 (Leftmost)
}

export interface Sabaq7Triplet {
  id: string;
  letterBase: string;
  baseLetterName: string;
  isHeavy: boolean;
  alifCell: Sabaq7BookCell;
  wawCell: Sabaq7BookCell;
  yaaCell: Sabaq7BookCell;
  tripletHijja: string;
  tripletRaw: string;
}

const RAW_SABAQ_7_LETTERS: Array<{
  base: string;
  name: string;
  isHeavy: boolean;
  alifText: string;
  wawText: string;
  yaaText: string;
}> = [
  // Row 1
  { base: 'ب', name: 'با', isHeavy: false, alifText: 'بَا', wawText: 'بُوْ', yaaText: 'بِيْ' },
  { base: 'ت', name: 'تا', isHeavy: false, alifText: 'تَا', wawText: 'تُوْ', yaaText: 'تِيْ' },
  // Row 2
  { base: 'ث', name: 'ثا', isHeavy: false, alifText: 'ثَا', wawText: 'ثُوْ', yaaText: 'ثِيْ' },
  { base: 'ج', name: 'جیم', isHeavy: false, alifText: 'جَا', wawText: 'جُوْ', yaaText: 'جِيْ' },
  // Row 3
  { base: 'ح', name: 'حا', isHeavy: false, alifText: 'حَا', wawText: 'حُوْ', yaaText: 'حِيْ' },
  { base: 'خ', name: 'خا', isHeavy: true, alifText: 'خَا', wawText: 'خُوْ', yaaText: 'خِيْ' },
  // Row 4
  { base: 'د', name: 'دال', isHeavy: false, alifText: 'دَا', wawText: 'دُوْ', yaaText: 'دِيْ' },
  { base: 'ذ', name: 'ذال', isHeavy: false, alifText: 'ذَا', wawText: 'ذُوْ', yaaText: 'ذِيْ' },
  // Row 5
  { base: 'ر', name: 'را', isHeavy: false, alifText: 'رَا', wawText: 'رُوْ', yaaText: 'رِيْ' },
  { base: 'ز', name: 'زا', isHeavy: false, alifText: 'زَا', wawText: 'زُوْ', yaaText: 'زِيْ' },
  // Row 6
  { base: 'س', name: 'سین', isHeavy: false, alifText: 'سَا', wawText: 'سُوْ', yaaText: 'سِيْ' },
  { base: 'ش', name: 'شین', isHeavy: false, alifText: 'شَا', wawText: 'شُوْ', yaaText: 'شِيْ' },
  // Row 7
  { base: 'ص', name: 'صاد', isHeavy: true, alifText: 'صَا', wawText: 'صُوْ', yaaText: 'صِيْ' },
  { base: 'ض', name: 'ضاد', isHeavy: true, alifText: 'ضَا', wawText: 'ضُوْ', yaaText: 'ضِيْ' },
  // Row 8
  { base: 'ط', name: 'طا', isHeavy: true, alifText: 'طَا', wawText: 'طُوْ', yaaText: 'طِيْ' },
  { base: 'ظ', name: 'ظا', isHeavy: true, alifText: 'ظَا', wawText: 'ظُوْ', yaaText: 'ظِيْ' },
  // Row 9
  { base: 'ع', name: 'عین', isHeavy: false, alifText: 'عَا', wawText: 'عُوْ', yaaText: 'عِيْ' },
  { base: 'غ', name: 'غین', isHeavy: true, alifText: 'غَا', wawText: 'غُوْ', yaaText: 'غِيْ' },
  // Row 10
  { base: 'ف', name: 'فا', isHeavy: false, alifText: 'فَا', wawText: 'فُوْ', yaaText: 'فِيْ' },
  { base: 'ق', name: 'قاف', isHeavy: true, alifText: 'قَا', wawText: 'قُوْ', yaaText: 'قِيْ' },
  // Row 11
  { base: 'ك', name: 'کاف', isHeavy: false, alifText: 'كَا', wawText: 'كُوْ', yaaText: 'كِيْ' },
  { base: 'ل', name: 'لام', isHeavy: false, alifText: 'لَا', wawText: 'لُوْ', yaaText: 'لِيْ' },
  // Row 12
  { base: 'م', name: 'میم', isHeavy: false, alifText: 'مَا', wawText: 'مُوْ', yaaText: 'مِيْ' },
  { base: 'ن', name: 'نون', isHeavy: false, alifText: 'نَا', wawText: 'نُوْ', yaaText: 'نِيْ' },
  // Row 13
  { base: 'و', name: 'واؤ', isHeavy: false, alifText: 'وَا', wawText: 'وُوْ', yaaText: 'وِيْ' },
  { base: 'ه', name: 'ہا', isHeavy: false, alifText: 'هَا', wawText: 'هُوْ', yaaText: 'هِيْ' },
  // Row 14
  { base: 'ء', name: 'ہمزہ', isHeavy: false, alifText: 'اَ', wawText: 'اُوْ', yaaText: 'اِيْ' },
  { base: 'ي', name: 'یا', isHeavy: false, alifText: 'يَا', wawText: 'يُوْ', yaaText: 'يِيْ' },
];

export const SABAQ_7_TRIPLETS: Sabaq7Triplet[] = RAW_SABAQ_7_LETTERS.map((item, index) => {
  const rowIndex = Math.floor(index / 2) + 1;
  const isFirstInRow = index % 2 === 0;

  const alifCol = isFirstInRow ? 1 : 4;
  const wawCol = isFirstInRow ? 2 : 5;
  const yaaCol = isFirstInRow ? 3 : 6;

  const alifCell: Sabaq7BookCell = {
    id: `s7-${item.base}-alif`,
    letterBase: item.base,
    baseLetterName: item.name,
    maddahType: 'alif',
    arabicText: item.alifText,
    harakahSign: 'زبر',
    hijjaSpelling: `${item.name} الف زبر ${item.alifText}`,
    isHeavy: item.isHeavy,
    row: rowIndex,
    col: alifCol
  };

  const wawCell: Sabaq7BookCell = {
    id: `s7-${item.base}-waw`,
    letterBase: item.base,
    baseLetterName: item.name,
    maddahType: 'waw',
    arabicText: item.wawText,
    harakahSign: 'پیش',
    hijjaSpelling: `${item.name} واؤ پیش ${item.wawText}`,
    isHeavy: item.isHeavy,
    row: rowIndex,
    col: wawCol
  };

  const yaaCell: Sabaq7BookCell = {
    id: `s7-${item.base}-yaa`,
    letterBase: item.base,
    baseLetterName: item.name,
    maddahType: 'yaa',
    arabicText: item.yaaText,
    harakahSign: 'زیر',
    hijjaSpelling: `${item.name} یا زیر ${item.yaaText}`,
    isHeavy: item.isHeavy,
    row: rowIndex,
    col: yaaCol
  };

  return {
    id: `triplet-${item.base}`,
    letterBase: item.base,
    baseLetterName: item.name,
    isHeavy: item.isHeavy,
    alifCell,
    wawCell,
    yaaCell,
    tripletHijja: `${item.name} الف زبر ${item.alifText} ، ${item.name} واؤ پیش ${item.wawText} ، ${item.name} یا زیر ${item.yaaText} = ${item.alifText} ، ${item.wawText} ، ${item.yaaText}`,
    tripletRaw: `${item.alifText} ، ${item.wawText} ، ${item.yaaText}`
  };
});

// All 84 Cells flattened in exact reading order (Row by row, 6 cells per row)
export const SABAQ_7_ALL_84_CELLS: Sabaq7BookCell[] = [];
for (let r = 0; r < 14; r++) {
  const trip1 = SABAQ_7_TRIPLETS[r * 2];
  const trip2 = SABAQ_7_TRIPLETS[r * 2 + 1];
  if (trip1) {
    SABAQ_7_ALL_84_CELLS.push(trip1.alifCell, trip1.wawCell, trip1.yaaCell);
  }
  if (trip2) {
    SABAQ_7_ALL_84_CELLS.push(trip2.alifCell, trip2.wawCell, trip2.yaaCell);
  }
}

