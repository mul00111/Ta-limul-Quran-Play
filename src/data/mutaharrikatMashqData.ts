export interface MutaharrikExerciseWord {
  id: string;
  word: string;             // e.g. "رَبَ"
  category: 'zabar' | 'zer' | 'pesh';
  categoryLabelUrdu: string; // "مشقِ زَبَر" | "مشقِ زَیْر" | "مشقِ پَیْش"
  letterCount: number;
  letters: string[];        // ['رَ', 'بَ']
  breakdown: string;        // "رَ + بَ"
  spellingHijja: string;    // "رَا زَبَر رَ ، بَا زَبَر بَ"
  pronunciationWord: string;// "رَبَ"
  urduMeaning?: string;     // Meaning in Urdu
  isHeavyLetterIncluded?: boolean;
  pageNumber?: number;      // 8, 9, 10, 11
}

// ========================================================
// 1. زَبَر کی مکمل مشق (Zabar / Fatha Mashq - 16 Words)
// ========================================================
export const ZABAR_MASHQ_DATA: MutaharrikExerciseWord[] = [
  // Row 1
  {
    id: 'zb-1',
    word: 'رَبَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 2,
    letters: ['رَ', 'بَ'],
    breakdown: 'رَ + بَ',
    spellingHijja: 'رَا زَبَر رَ ، بَا زَبَر بَ',
    pronunciationWord: 'رَبَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'پالا، پرورش کی'
  },
  {
    id: 'zb-2',
    word: 'دَمَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 2,
    letters: ['دَ', 'مَ'],
    breakdown: 'دَ + مَ',
    spellingHijja: 'دَال زَبَر دَ ، مِيم زَبَر مَ',
    pronunciationWord: 'دَمَ',
    urduMeaning: 'خون'
  },
  {
    id: 'zb-3',
    word: 'مَعَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 2,
    letters: ['مَ', 'عَ'],
    breakdown: 'مَ + عَ',
    spellingHijja: 'مِيم زَبَر مَ ، عَيْن زَبَر عَ',
    pronunciationWord: 'مَعَ',
    urduMeaning: 'ساتھ'
  },
  {
    id: 'zb-4',
    word: 'تَرَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 2,
    letters: ['تَ', 'رَ'],
    breakdown: 'تَ + رَ',
    spellingHijja: 'تَا زَبَر تَ ، رَا زَبَر رَ',
    pronunciationWord: 'تَرَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'تو دیکھتا ہے'
  },
  {
    id: 'zb-5',
    word: 'لَكَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 2,
    letters: ['لَ', 'كَ'],
    breakdown: 'لَ + كَ',
    spellingHijja: 'لَام زَبَر لَ ، كَاف زَبَر كَ',
    pronunciationWord: 'لَكَ',
    urduMeaning: 'تیرے لیے'
  },
  {
    id: 'zb-6',
    word: 'وَزَنَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['وَ', 'زَ', 'نَ'],
    breakdown: 'وَ + زَ + نَ',
    spellingHijja: 'وَاو زَبَر وَ ، زَا زَبَر زَ ، نُون زَبَر نَ',
    pronunciationWord: 'وَزَنَ',
    urduMeaning: 'اس نے تولا'
  },

  // Row 2
  {
    id: 'zb-7',
    word: 'وَرَدَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['وَ', 'رَ', 'دَ'],
    breakdown: 'وَ + رَ + دَ',
    spellingHijja: 'وَاو زَبَر وَ ، رَا زَبَر رَ ، دَال زَبَر دَ',
    pronunciationWord: 'وَرَدَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'وہ وارد ہوا، پہنچا'
  },
  {
    id: 'zb-8',
    word: 'وَزَرَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['وَ', 'زَ', 'رَ'],
    breakdown: 'وَ + زَ + رَ',
    spellingHijja: 'وَاو زَبَر وَ ، زَا زَبَر زَ ، رَا زَبَر رَ',
    pronunciationWord: 'وَزَرَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے بوجھ اٹھایا'
  },
  {
    id: 'zb-9',
    word: 'زَرَعَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['زَ', 'رَ', 'عَ'],
    breakdown: 'زَ + رَ + عَ',
    spellingHijja: 'زَا زَبَر زَ ، رَا زَبَر رَ ، عَيْن زَبَر عَ',
    pronunciationWord: 'زَرَعَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے بویا، کھیتی کی'
  },
  {
    id: 'zb-10',
    word: 'دَرَكَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['دَ', 'رَ', 'كَ'],
    breakdown: 'دَ + رَ + كَ',
    spellingHijja: 'دَال زَبَر دَ ، رَا زَبَر رَ ، كَاف زَبَر كَ',
    pronunciationWord: 'دَرَكَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'درجہ، پستی'
  },
  {
    id: 'zb-11',
    word: 'ذَكَرَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['ذَ', 'كَ', 'رَ'],
    breakdown: 'ذَ + كَ + رَ',
    spellingHijja: 'ذَال زَبَر ذَ ، كَاف زَبَر كَ ، رَا زَبَر رَ',
    pronunciationWord: 'ذَكَرَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے یاد کیا'
  },

  // Row 3
  {
    id: 'zb-12',
    word: 'وَلَدَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['وَ', 'لَ', 'دَ'],
    breakdown: 'وَ + لَ + دَ',
    spellingHijja: 'وَاو زَبَر وَ ، لَام زَبَر لَ ، دَال زَبَر دَ',
    pronunciationWord: 'وَلَدَ',
    urduMeaning: 'اس نے جنا، پیدا کیا'
  },
  {
    id: 'zb-13',
    word: 'عَشَرَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['عَ', 'شَ', 'رَ'],
    breakdown: 'عَ + شَ + رَ',
    spellingHijja: 'عَيْن زَبَر عَ ، شِين زَبَر شَ ، رَا زَبَر رَ',
    pronunciationWord: 'عَشَرَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'دس (10)'
  },
  {
    id: 'zb-14',
    word: 'عَدَلَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['عَ', 'دَ', 'لَ'],
    breakdown: 'عَ + دَ + لَ',
    spellingHijja: 'عَيْن زَبَر عَ ، دَال زَبَر دَ ، لَام زَبَر لَ',
    pronunciationWord: 'عَدَلَ',
    urduMeaning: 'اس نے انصاف کیا، برابر کیا'
  },
  {
    id: 'zb-15',
    word: 'صَدَقَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['صَ', 'دَ', 'قَ'],
    breakdown: 'صَ + دَ + قَ',
    spellingHijja: 'صَاد زَبَر صَ ، دَال زَبَر دَ ، قَاف زَبَر قَ',
    pronunciationWord: 'صَدَقَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے سچ کہا'
  },
  {
    id: 'zb-16',
    word: 'رَفَعَ',
    category: 'zabar',
    categoryLabelUrdu: 'مشقِ زَبَر',
    letterCount: 3,
    letters: ['رَ', 'فَ', 'عَ'],
    breakdown: 'رَ + فَ + عَ',
    spellingHijja: 'رَا زَبَر رَ ، فَاء زَبَر فَ ، عَيْن زَبَر عَ',
    pronunciationWord: 'رَفَعَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے بلند کیا'
  },
];

// ========================================================
// 2. زَیْر کی مکمل مشق (Zer / Kasra Mashq - 16 Words)
// ========================================================
export const ZER_MASHQ_DATA: MutaharrikExerciseWord[] = [
  // Row 1
  {
    id: 'zr-1',
    word: 'إِذِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 2,
    letters: ['إِ', 'ذِ'],
    breakdown: 'إِ + ذِ',
    spellingHijja: 'ہَمْزَہ زَیْر اِ ، ذَال زَیْر ذِ',
    pronunciationWord: 'إِذِ',
    urduMeaning: 'جب کہ'
  },
  {
    id: 'zr-2',
    word: 'لِمَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 2,
    letters: ['لِ', 'مَ'],
    breakdown: 'لِ + مَ',
    spellingHijja: 'لَام زَیْر لِ ، مِيم زَبَر مَ',
    pronunciationWord: 'لِمَ',
    urduMeaning: 'کیوں؟ کس لیے؟'
  },
  {
    id: 'zr-3',
    word: 'بِكَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 2,
    letters: ['بِ', 'كَ'],
    breakdown: 'بِ + كَ',
    spellingHijja: 'بَا زَیْر بِ ، كَاف زَبَر كَ',
    pronunciationWord: 'بِكَ',
    urduMeaning: 'تجھ سے / تیرے ذریعے'
  },
  {
    id: 'zr-4',
    word: 'هِيَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 2,
    letters: ['هِ', 'يَ'],
    breakdown: 'هِ + يَ',
    spellingHijja: 'ہَا زَیْر ہِ ، يَا زَبَر يَ',
    pronunciationWord: 'هِيَ',
    urduMeaning: 'وہ (مونث)'
  },
  {
    id: 'zr-5',
    word: 'بِهِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 2,
    letters: ['بِ', 'هِ'],
    breakdown: 'بِ + هِ',
    spellingHijja: 'بَا زَیْر بِ ، ہَا زَیْر ہِ',
    pronunciationWord: 'بِهِ',
    urduMeaning: 'اس کے ساتھ'
  },
  {
    id: 'zr-6',
    word: 'إِرَمَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['إِ', 'رَ', 'مَ'],
    breakdown: 'إِ + رَ + مَ',
    spellingHijja: 'ہَمْزَہ زَیْر اِ ، رَا زَبَر رَ ، مِيم زَبَر مَ',
    pronunciationWord: 'إِرَمَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'ارم (قومِ عاد کا شہر)'
  },

  // Row 2
  {
    id: 'zr-7',
    word: 'أَذِنَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['أَ', 'ذِ', 'نَ'],
    breakdown: 'أَ + ذِ + نَ',
    spellingHijja: 'ہَمْزَہ زَبَر اَ ، ذَال زَیْر ذِ ، نُون زَبَر نَ',
    pronunciationWord: 'أَذِنَ',
    urduMeaning: 'اس نے اجازت دی، سنا'
  },
  {
    id: 'zr-8',
    word: 'رَحِمَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['رَ', 'حِ', 'مَ'],
    breakdown: 'رَ + حِ + مَ',
    spellingHijja: 'رَا زَبَر رَ ، حَا زَیْر حِ ، مِيم زَبَر مَ',
    pronunciationWord: 'رَحِمَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'اس نے رحم کیا'
  },
  {
    id: 'zr-9',
    word: 'قَدِمَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['قَ', 'دِ', 'مَ'],
    breakdown: 'قَ + دِ + مَ',
    spellingHijja: 'قَاف زَبَر قَ ، دَال زَیْر دِ ، مِيم زَبَر مَ',
    pronunciationWord: 'قَدِمَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'وہ آگے بڑھا، آیا'
  },
  {
    id: 'zr-10',
    word: 'كَذِبَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['كَ', 'ذِ', 'بَ'],
    breakdown: 'كَ + ذِ + بَ',
    spellingHijja: 'كَاف زَبَر كَ ، ذَال زَیْر ذِ ، بَا زَبَر بَ',
    pronunciationWord: 'كَذِبَ',
    urduMeaning: 'اس نے جھوٹ بولا'
  },
  {
    id: 'zr-11',
    word: 'رَضِيَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['رَ', 'ضِ', 'يَ'],
    breakdown: 'رَ + ضِ + يَ',
    spellingHijja: 'رَا زَبَر رَ ، ضَاد زَیْر ضِ ، يَا زَبَر يَ',
    pronunciationWord: 'رَضِيَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'وہ راضی ہوا'
  },

  // Row 3
  {
    id: 'zr-12',
    word: 'رَقَبِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['رَ', 'قَ', 'بِ'],
    breakdown: 'رَ + قَ + بِ',
    spellingHijja: 'رَا زَبَر رَ ، قَاف زَبَر قَ ، بَا زَیْر بِ',
    pronunciationWord: 'رَقَبِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'گردن'
  },
  {
    id: 'zr-13',
    word: 'إِبِلِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['إِ', 'بِ', 'لِ'],
    breakdown: 'إِ + بِ + لِ',
    spellingHijja: 'ہَمْزَہ زَیْر اِ ، بَا زَیْر بِ ، لَام زَیْر لِ',
    pronunciationWord: 'إِبِلِ',
    urduMeaning: 'اونٹ'
  },
  {
    id: 'zr-14',
    word: 'بَلَدِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['بَ', 'لَ', 'دِ'],
    breakdown: 'بَ + لَ + دِ',
    spellingHijja: 'بَا زَبَر بَ ، لَام زَبَر لَ ، دَال زَیْر دِ',
    pronunciationWord: 'بَلَدِ',
    urduMeaning: 'شہر'
  },
  {
    id: 'zr-15',
    word: 'شَرِبَ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['شَ', 'رِ', 'بَ'],
    breakdown: 'شَ + رِ + بَ',
    spellingHijja: 'شِين زَبَر شَ ، رَا زَیْر رِ ، بَا زَبَر بَ',
    pronunciationWord: 'شَرِبَ',
    urduMeaning: 'اس نے پیا'
  },
  {
    id: 'zr-16',
    word: 'حَطَبِ',
    category: 'zer',
    categoryLabelUrdu: 'مشقِ زَیْر',
    letterCount: 3,
    letters: ['حَ', 'طَ', 'بِ'],
    breakdown: 'حَ + طَ + بِ',
    spellingHijja: 'حَا زَبَر حَ ، طَاء زَبَر طَ ، بَا زَیْر بِ',
    pronunciationWord: 'حَطَبِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'لکڑیاں، ایندھن'
  },
];

// ========================================================
// 3. پَیْش کی مکمل مشق (Pesh / Damma Mashq - 16 Words)
// ========================================================
export const PESH_MASHQ_DATA: MutaharrikExerciseWord[] = [
  // Row 1
  {
    id: 'ps-1',
    word: 'أُخُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['أُ', 'خُ'],
    breakdown: 'أُ + خُ',
    spellingHijja: 'ہَمْزَہ پَیْش اُ ، خَا پَیْش خُ',
    pronunciationWord: 'أُخُ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'بھائی'
  },
  {
    id: 'ps-2',
    word: 'أُكُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['أُ', 'كُ'],
    breakdown: 'أُ + كُ',
    spellingHijja: 'ہَمْزَہ پَیْش اُ ، كَاف پَیْش كُ',
    pronunciationWord: 'أُكُ',
    urduMeaning: 'پھل، خوراک'
  },
  {
    id: 'ps-3',
    word: 'قُمِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['قُ', 'مِ'],
    breakdown: 'قُ + مِ',
    spellingHijja: 'قَاف پَیْش قُ ، مِيم زَیْر مِ',
    pronunciationWord: 'قُمِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'کھڑے ہو جاؤ'
  },
  {
    id: 'ps-4',
    word: 'خُذِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['خُ', 'ذِ'],
    breakdown: 'خُ + ذِ',
    spellingHijja: 'خَا پَیْش خُ ، ذَال زَیْر ذِ',
    pronunciationWord: 'خُذِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'پکڑ لو، لے لو'
  },
  {
    id: 'ps-5',
    word: 'هُوَ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['هُ', 'وَ'],
    breakdown: 'هُ + وَ',
    spellingHijja: 'ہَا پَیْش ہُ ، وَاو زَبَر وَ',
    pronunciationWord: 'هُوَ',
    urduMeaning: 'وہ (مذکر)'
  },
  {
    id: 'ps-6',
    word: 'لَهُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 2,
    letters: ['لَ', 'هُ'],
    breakdown: 'لَ + هُ',
    spellingHijja: 'لَام زَبَر لَ ، ہَا پَیْش ہُ',
    pronunciationWord: 'لَهُ',
    urduMeaning: 'اس کے لیے'
  },

  // Row 2
  {
    id: 'ps-7',
    word: 'وُعِدَ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['وُ', 'عِ', 'دَ'],
    breakdown: 'وُ + عِ + دَ',
    spellingHijja: 'وَاو پَیْش وُ ، عَيْن زَیْر عِ ، دَال زَبَر دَ',
    pronunciationWord: 'وُعِدَ',
    urduMeaning: 'وعدہ کیا گیا'
  },
  {
    id: 'ps-8',
    word: 'قُدِرَ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['قُ', 'دِ', 'رَ'],
    breakdown: 'قُ + دِ + رَ',
    spellingHijja: 'قَاف پَیْش قُ ، دَال زَیْر دِ ، رَا زَبَر رَ',
    pronunciationWord: 'قُدِرَ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'تنگ کیا گیا، اندازہ لگایا گیا'
  },
  {
    id: 'ps-9',
    word: 'قُدُسِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['قُ', 'دُ', 'سِ'],
    breakdown: 'قُ + دُ + سِ',
    spellingHijja: 'قَاف پَیْش قُ ، دَال پَیْش دُ ، سِين زَیْر سِ',
    pronunciationWord: 'قُدُسِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'پاکی، تقدیس'
  },
  {
    id: 'ps-10',
    word: 'أُفُقِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['أُ', 'فُ', 'قِ'],
    breakdown: 'أُ + فُ + قِ',
    spellingHijja: 'ہَمْزَہ پَیْش اُ ، فَاء پَیْش فُ ، قَاف زَیْر قِ',
    pronunciationWord: 'أُفُقِ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'کنارہ، افق'
  },
  {
    id: 'ps-11',
    word: 'رُبُعُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['رُ', 'بُ', 'عُ'],
    breakdown: 'رُ + بُ + عُ',
    spellingHijja: 'رَا پَیْش رُ ، بَا پَیْش بُ ، عَيْن پَیْش عُ',
    pronunciationWord: 'رُبُعُ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'چوتھائی حصہ (1/4)'
  },

  // Row 3
  {
    id: 'ps-12',
    word: 'زُبُرِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['زُ', 'بُ', 'رِ'],
    breakdown: 'زُ + بُ + رِ',
    spellingHijja: 'زَا پَیْش زُ ، بَا پَیْش بُ ، رَا زَیْر رِ',
    pronunciationWord: 'زُبُرِ',
    urduMeaning: 'کتابیں، صحیفے'
  },
  {
    id: 'ps-13',
    word: 'أُمَمِ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['أُ', 'مَ', 'مِ'],
    breakdown: 'أُ + مَ + مِ',
    spellingHijja: 'ہَمْزَہ پَیْش اُ ، مِيم زَبَر مَ ، مِيم زَیْر مِ',
    pronunciationWord: 'أُمَمِ',
    urduMeaning: 'قومیں، امتیں'
  },
  {
    id: 'ps-14',
    word: 'مَثَلُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['مَ', 'ثَ', 'لُ'],
    breakdown: 'مَ + ثَ + لُ',
    spellingHijja: 'مِيم زَبَر مَ ، ثَا زَبَر ثَ ، لَام پَیْش لُ',
    pronunciationWord: 'مَثَلُ',
    urduMeaning: 'مثال، صفت'
  },
  {
    id: 'ps-15',
    word: 'ثُلُثُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['ثُ', 'لُ', 'ثُ'],
    breakdown: 'ثُ + لُ + ثُ',
    spellingHijja: 'ثَا پَیْش ثُ ، لَام پَیْش لُ ، ثَا پَیْش ثُ',
    pronunciationWord: 'ثُلُثُ',
    urduMeaning: 'تہائی حصہ (1/3)'
  },
  {
    id: 'ps-16',
    word: 'رُسُلُ',
    category: 'pesh',
    categoryLabelUrdu: 'مشقِ پَیْش',
    letterCount: 3,
    letters: ['رُ', 'سُ', 'لُ'],
    breakdown: 'رُ + سُ + لُ',
    spellingHijja: 'رَا پَیْش رُ ، سِين پَیْش سُ ، لَام پَیْش لُ',
    pronunciationWord: 'رُسُلُ',
    isHeavyLetterIncluded: true,
    urduMeaning: 'رسول، پیغمبران'
  },
];

// Combine all 48 authentic Noorani Qaida Mutaharrikat Mashq words (Pages 8-9)
export const ALL_MUTAHARRIKAT_MASHQ: MutaharrikExerciseWord[] = [
  ...ZABAR_MASHQ_DATA,
  ...ZER_MASHQ_DATA,
  ...PESH_MASHQ_DATA,
];

// Re-export Page 10 (اضافی مشق) and Page 11 (امتحان)
export { PAGE_10_EXTRA_MASHQ_DATA } from './page10ExtraMashqData';
export { PAGE_11_EXAM_MASHQ_DATA } from './page11ExamData';
import { PAGE_10_EXTRA_MASHQ_DATA } from './page10ExtraMashqData';
import { PAGE_11_EXAM_MASHQ_DATA } from './page11ExamData';

// All 175 authentic Mutaharrikat words across all pages (8, 9, 10, 11)
export const ALL_MUTAHARRIKAT_WORDS: MutaharrikExerciseWord[] = [
  ...ALL_MUTAHARRIKAT_MASHQ,
  ...PAGE_10_EXTRA_MASHQ_DATA,
  ...PAGE_11_EXAM_MASHQ_DATA,
];

