// ============================================================================
// نورانی و مدنی قاعدہ - جامع مشقِ سکون و قلقلہ و ہمزہ ساکنہ (۶۰ کلمات)
// مأخوذ از کتابی صفحات: مشقِ سکون و قلقلہ (صفحات ۱ و ۲)
// ============================================================================

export interface SukoonMashqItem {
  id: string;
  word: string;
  displayColored?: {
    letter: string;
    type: 'qalqalah' | 'heavy' | 'hamzah_sakinah' | 'normal';
  }[];
  categoryLabelUrdu: string;
  letterCount: number;
  letters: string[];
  breakdown: string;
  spellingHijja: string;
  pronunciationWord: string;
  isQalqalah?: boolean;
  qalqalahLetter?: string;
  isHeavyLetterIncluded?: boolean;
  heavyLetter?: string;
  isHamzahSakinah?: boolean;
  mashqPage: 1 | 2;
  rowNumber: number;
  colNumber: number;
  tajweedRuleTitle: string;
  tajweedRuleBadgeColor: 'red' | 'blue' | 'green' | 'amber' | 'emerald' | 'purple';
}

// ============================================================================
// مشق (۲۵ کلمات - ۵ قطاریں x ۵ کالمز)
// ============================================================================
export const SUKOON_MASHQ_PAGE_1_ITEMS: SukoonMashqItem[] = [
  // Row 1: قُلْ ، إِنْ ، عَنْ ، مَنْ ، بَلْ
  {
    id: 'm1-r1-c1',
    word: 'قُلْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['قُ', 'لْ'],
    breakdown: 'قُ + لْ',
    spellingHijja: 'قَاف پَیْش لام جزم قُلْ',
    pronunciationWord: 'قُلْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق',
    mashqPage: 1,
    rowNumber: 1,
    colNumber: 1,
    tajweedRuleTitle: 'حرفِ مستعلیہ (ق پُر) مع لام ساکن',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'قُ', type: 'heavy' },
      { letter: 'لْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r1-c2',
    word: 'إِنْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['إِ', 'نْ'],
    breakdown: 'إِ + نْ',
    spellingHijja: 'ہَمْزَہ زَیْر نُون جزم إِنْ',
    pronunciationWord: 'إِنْ',
    mashqPage: 1,
    rowNumber: 1,
    colNumber: 2,
    tajweedRuleTitle: 'ہمزہ زیر کے ساتھ نون ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'إِ', type: 'normal' },
      { letter: 'نْ', type: 'heavy' }
    ]
  },
  {
    id: 'm1-r1-c3',
    word: 'عَنْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['عَ', 'نْ'],
    breakdown: 'عَ + نْ',
    spellingHijja: 'عَیْن زَبَر نُون جزم عَنْ',
    pronunciationWord: 'عَنْ',
    mashqPage: 1,
    rowNumber: 1,
    colNumber: 3,
    tajweedRuleTitle: 'عین زبر کے ساتھ نون ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'عَ', type: 'normal' },
      { letter: 'نْ', type: 'heavy' }
    ]
  },
  {
    id: 'm1-r1-c4',
    word: 'مَنْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['مَ', 'نْ'],
    breakdown: 'مَ + نْ',
    spellingHijja: 'مِيم زَبَر نُون جزم مَنْ',
    pronunciationWord: 'مَنْ',
    mashqPage: 1,
    rowNumber: 1,
    colNumber: 4,
    tajweedRuleTitle: 'میم زبر کے ساتھ نون ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'مَ', type: 'normal' },
      { letter: 'نْ', type: 'heavy' }
    ]
  },
  {
    id: 'm1-r1-c5',
    word: 'بَلْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['بَ', 'لْ'],
    breakdown: 'بَ + لْ',
    spellingHijja: 'بَا زَبَر لام جزم بَلْ',
    pronunciationWord: 'بَلْ',
    mashqPage: 1,
    rowNumber: 1,
    colNumber: 5,
    tajweedRuleTitle: 'با زبر کے ساتھ لام ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'بَ', type: 'normal' },
      { letter: 'لْ', type: 'heavy' }
    ]
  },

  // Row 2: لَمْ ، كُمْ ، هُمْ ، ذُقْ ، قَدْ
  {
    id: 'm1-r2-c1',
    word: 'لَمْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['لَ', 'مْ'],
    breakdown: 'لَ + مْ',
    spellingHijja: 'لَام زَبَر مِيم جزم لَمْ',
    pronunciationWord: 'لَمْ',
    mashqPage: 1,
    rowNumber: 2,
    colNumber: 1,
    tajweedRuleTitle: 'لام زبر کے ساتھ میم ساکن',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'لَ', type: 'heavy' },
      { letter: 'مْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r2-c2',
    word: 'كُمْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['كُ', 'مْ'],
    breakdown: 'كُ + مْ',
    spellingHijja: 'كَاف پَیْش مِيم جزم كُمْ',
    pronunciationWord: 'كُمْ',
    mashqPage: 1,
    rowNumber: 2,
    colNumber: 2,
    tajweedRuleTitle: 'کاف پیش کے ساتھ میم ساکن',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'كُ', type: 'heavy' },
      { letter: 'مْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r2-c3',
    word: 'هُمْ',
    categoryLabelUrdu: 'مشق (۲ حرفی)',
    letterCount: 2,
    letters: ['هُ', 'مْ'],
    breakdown: 'هُ + مْ',
    spellingHijja: 'ہَا پَیْش مِيم جزم هُمْ',
    pronunciationWord: 'هُمْ',
    mashqPage: 1,
    rowNumber: 2,
    colNumber: 3,
    tajweedRuleTitle: 'ہا پیش کے ساتھ میم ساکن',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'هُ', type: 'heavy' },
      { letter: 'مْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r2-c4',
    word: 'ذُقْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 2,
    letters: ['ذُ', 'قْ'],
    breakdown: 'ذُ + قْ',
    spellingHijja: 'ذَال پَیْش قَاف جزم ذُقْ',
    pronunciationWord: 'ذُقْ',
    isQalqalah: true,
    qalqalahLetter: 'ق',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق',
    mashqPage: 1,
    rowNumber: 2,
    colNumber: 4,
    tajweedRuleTitle: 'قلقلہ (ق پُر مع جنبش)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'ذُ', type: 'heavy' },
      { letter: 'قْ', type: 'qalqalah' }
    ]
  },
  {
    id: 'm1-r2-c5',
    word: 'قَدْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 2,
    letters: ['قَ', 'دْ'],
    breakdown: 'قَ + دْ',
    spellingHijja: 'قَاف زَبَر دَال جزم قَدْ',
    pronunciationWord: 'قَدْ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق',
    mashqPage: 1,
    rowNumber: 2,
    colNumber: 5,
    tajweedRuleTitle: 'ق پُر (نیلا) + دال قلقلہ (سرخ)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'قَ', type: 'heavy' },
      { letter: 'دْ', type: 'qalqalah' }
    ]
  },

  // Row 3: اِصْطَبِرْ ، مُسْتَطَرٌ ، فَاغْفِرْ ، أَعْيُنٍ ، أَعْنَابًا
  {
    id: 'm1-r3-c1',
    word: 'اِصْطَبِرْ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 5,
    letters: ['اِصْ', 'طَ', 'بِرْ'],
    breakdown: 'اِصْ + طَ + بِرْ',
    spellingHijja: 'ہَمْزَہ زَیْر صَاد جزم اِصْ ، طَا زَبَر طَ ، بَا زَیْر رَا جزم بِرْ = اِصْطَبِرْ',
    pronunciationWord: 'اِصْطَبِرْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ص، ط',
    mashqPage: 1,
    rowNumber: 3,
    colNumber: 1,
    tajweedRuleTitle: 'حروفِ مستعلیہ پُر (صاد اور طا)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'اِ', type: 'normal' },
      { letter: 'صْطَ', type: 'heavy' },
      { letter: 'بِرْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r3-c2',
    word: 'مُسْتَطَرٌ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 5,
    letters: ['مُسْ', 'تَ', 'طَ', 'رٌ'],
    breakdown: 'مُسْ + تَ + طَ + رٌ',
    spellingHijja: 'مِيم پَیْش سِین جزم مُسْ ، تَا زَبَر تَ ، طَا زَبَر طَ ، رَا دو پَیْش رٌ',
    pronunciationWord: 'مُسْتَطَرٌ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ط',
    mashqPage: 1,
    rowNumber: 3,
    colNumber: 2,
    tajweedRuleTitle: 'حرفِ مستعلیہ (ط پُر) مع تنوین',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'مُسْ', type: 'heavy' },
      { letter: 'تَ', type: 'normal' },
      { letter: 'طَ', type: 'heavy' },
      { letter: 'رٌ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r3-c3',
    word: 'فَاغْفِرْ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 5,
    letters: ['فَاغْ', 'فِرْ'],
    breakdown: 'فَاغْ + فِرْ',
    spellingHijja: 'فَا زَبَر غَیْن جزم فَاغْ ، فَا زَیْر رَا جزم فِرْ',
    pronunciationWord: 'فَاغْفِرْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'غ',
    mashqPage: 1,
    rowNumber: 3,
    colNumber: 3,
    tajweedRuleTitle: 'حرفِ غین پُر (مستعلیہ) ساکن',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'فَا', type: 'normal' },
      { letter: 'غْ', type: 'heavy' },
      { letter: 'فِرْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r3-c4',
    word: 'أَعْيُنٍ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 4,
    letters: ['أَعْ', 'يُ', 'نٍ'],
    breakdown: 'أَعْ + يُ + نٍ',
    spellingHijja: 'ہَمْزَہ زَبَر عَیْن جزم أَعْ ، يَا پَیْش يُ ، نُون دو زَیْر نٍ',
    pronunciationWord: 'أَعْيُنٍ',
    mashqPage: 1,
    rowNumber: 3,
    colNumber: 4,
    tajweedRuleTitle: 'عین ساکن (حلق کے درمیان سے)',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'أَعْ', type: 'normal' },
      { letter: 'يُ', type: 'heavy' },
      { letter: 'نٍ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r3-c5',
    word: 'أَعْنَابًا',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 5,
    letters: ['أَعْ', 'نَا', 'بًا'],
    breakdown: 'أَعْ + نَا + بًا',
    spellingHijja: 'ہَمْزَہ زَبَر عَیْن جزم أَعْ ، نُون زَبَر اَلِف نَا ، بَا دو زَبَر اَلِف بًا',
    pronunciationWord: 'أَعْنَابًا',
    mashqPage: 1,
    rowNumber: 3,
    colNumber: 5,
    tajweedRuleTitle: 'عین ساکن + مد اصلی + تنوین',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'أَعْ', type: 'normal' },
      { letter: 'نَا', type: 'heavy' },
      { letter: 'بًا', type: 'normal' }
    ]
  },

  // Row 4: زَجْرَةٌ ، نُطْفَةٍ ، مُدْهَنُوْنَ ، أَبْوَابًا ، فَافْرُقْ
  {
    id: 'm1-r4-c1',
    word: 'زَجْرَةٌ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['زَجْ', 'رَ', 'ةٌ'],
    breakdown: 'زَجْ + رَ + ةٌ',
    spellingHijja: 'زَا زَبَر جِيم جزم زَجْ ، رَا زَبَر رَ ، تَا دو پَیْش ةٌ',
    pronunciationWord: 'زَجْرَةٌ',
    isQalqalah: true,
    qalqalahLetter: 'ج',
    mashqPage: 1,
    rowNumber: 4,
    colNumber: 1,
    tajweedRuleTitle: 'قلقلہ جیم (سرخ) مع جنبش',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'زَ', type: 'normal' },
      { letter: 'جْ', type: 'qalqalah' },
      { letter: 'رَةٌ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r4-c2',
    word: 'نُطْفَةٍ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['نُطْ', 'فَ', 'ةٍ'],
    breakdown: 'نُطْ + فَ + ةٍ',
    spellingHijja: 'نُون پَیْش طَا جزم نُطْ ، فَا زَبَر فَ ، تَا دو زَیْر ةٍ',
    pronunciationWord: 'نُطْفَةٍ',
    isQalqalah: true,
    qalqalahLetter: 'ط',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ط',
    mashqPage: 1,
    rowNumber: 4,
    colNumber: 2,
    tajweedRuleTitle: 'طا قلقلہ (سرخ) مع پُر آواز',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'نُ', type: 'normal' },
      { letter: 'طْ', type: 'qalqalah' },
      { letter: 'فَةٍ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r4-c3',
    word: 'مُدْهَنُوْنَ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 6,
    letters: ['مُدْ', 'هَ', 'نُوْ', 'نَ'],
    breakdown: 'مُدْ + هَ + نُوْ + نَ',
    spellingHijja: 'مِيم پَیْش دَال جزم مُدْ ، ہَا زَبَر هَ ، نُون پَیْش وَاو نُوْ ، نُون زَبَر نَ',
    pronunciationWord: 'مُدْهَنُوْنَ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    mashqPage: 1,
    rowNumber: 4,
    colNumber: 3,
    tajweedRuleTitle: 'دال قلقلہ (سرخ) مع واؤ مدہ',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'مُ', type: 'normal' },
      { letter: 'دْ', type: 'qalqalah' },
      { letter: 'هَنُوْنَ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r4-c4',
    word: 'أَبْوَابًا',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 5,
    letters: ['أَبْ', 'وَا', 'بًا'],
    breakdown: 'أَبْ + وَا + بًا',
    spellingHijja: 'ہَمْزَہ زَبَر بَا جزم اَبْ ، وَاو زَبَر اَلِف وَا ، بَا دو زَبَر اَلِف بًا',
    pronunciationWord: 'أَبْوَابًا',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    mashqPage: 1,
    rowNumber: 4,
    colNumber: 4,
    tajweedRuleTitle: 'با قلقلہ (سرخ) مع الف مدہ',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'أَ', type: 'normal' },
      { letter: 'بْ', type: 'qalqalah' },
      { letter: 'وَابًا', type: 'normal' }
    ]
  },
  {
    id: 'm1-r4-c5',
    word: 'فَافْرُقْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 5,
    letters: ['فَافْ', 'رُقْ'],
    breakdown: 'فَافْ + رُقْ',
    spellingHijja: 'فَا زَبَر فَا جزم فَافْ ، رَا پَیْش قَاف جزم رُقْ',
    pronunciationWord: 'فَافْرُقْ',
    isQalqalah: true,
    qalqalahLetter: 'ق',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق',
    mashqPage: 1,
    rowNumber: 4,
    colNumber: 5,
    tajweedRuleTitle: 'قاف قلقلہ (سرخ) مع پُر آواز',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'فَا', type: 'normal' },
      { letter: 'فْ', type: 'heavy' },
      { letter: 'رُ', type: 'normal' },
      { letter: 'قْ', type: 'qalqalah' }
    ]
  },

  // Row 5: يُقْرِضُ ، يُغْنِیْ ، تَجْرِیْ ، جَمْعًا ، فَتْحٌ
  {
    id: 'm1-r5-c1',
    word: 'يُقْرِضُ',
    categoryLabelUrdu: 'مشق (قلقلہ و پُر)',
    letterCount: 4,
    letters: ['يُقْ', 'رِ', 'ضُ'],
    breakdown: 'يُقْ + رِ + ضُ',
    spellingHijja: 'يَا پَیْش قَاف جزم يُقْ ، رَا زَیْر رِ ، ضَاد پَیْش ضُ',
    pronunciationWord: 'يُقْرِضُ',
    isQalqalah: true,
    qalqalahLetter: 'ق',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق، ض',
    mashqPage: 1,
    rowNumber: 5,
    colNumber: 1,
    tajweedRuleTitle: 'قاف قلقلہ (سرخ) + ضاد پُر (نیلا)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'يُ', type: 'normal' },
      { letter: 'قْ', type: 'qalqalah' },
      { letter: 'رِ', type: 'normal' },
      { letter: 'ضُ', type: 'heavy' }
    ]
  },
  {
    id: 'm1-r5-c2',
    word: 'يُغْنِیْ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['يُغْ', 'نِیْ'],
    breakdown: 'يُغْ + نِیْ',
    spellingHijja: 'يَا پَیْش غَیْن جزم يُغْ ، نُون زَیْر يَا نِیْ',
    pronunciationWord: 'يُغْنِیْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'غ',
    mashqPage: 1,
    rowNumber: 5,
    colNumber: 2,
    tajweedRuleTitle: 'غین پُر ساکن مع یاء مدہ',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'يُ', type: 'normal' },
      { letter: 'غْ', type: 'heavy' },
      { letter: 'نِیْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r5-c3',
    word: 'تَجْرِیْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['تَجْ', 'رِیْ'],
    breakdown: 'تَجْ + رِیْ',
    spellingHijja: 'تَا زَبَر جِيم جزم تَجْ ، رَا زَیْر يَا رِیْ',
    pronunciationWord: 'تَجْرِیْ',
    isQalqalah: true,
    qalqalahLetter: 'ج',
    mashqPage: 1,
    rowNumber: 5,
    colNumber: 3,
    tajweedRuleTitle: 'جیم قلقلہ (سرخ) مع یاء مدہ',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'تَ', type: 'normal' },
      { letter: 'جْ', type: 'qalqalah' },
      { letter: 'رِیْ', type: 'normal' }
    ]
  },
  {
    id: 'm1-r5-c4',
    word: 'جَمْعًا',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 4,
    letters: ['جَمْ', 'عًا'],
    breakdown: 'جَمْ + عًا',
    spellingHijja: 'جِيم زَبَر مِيم جزم جَمْ ، عَیْن دو زَبَر اَلِف عًا',
    pronunciationWord: 'جَمْعًا',
    mashqPage: 1,
    rowNumber: 5,
    colNumber: 4,
    tajweedRuleTitle: 'میم ساکن مع عین تنوین',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'جَمْ', type: 'normal' },
      { letter: 'عًا', type: 'heavy' }
    ]
  },
  {
    id: 'm1-r5-c5',
    word: 'فَتْحٌ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 3,
    letters: ['فَتْ', 'حٌ'],
    breakdown: 'فَتْ + حٌ',
    spellingHijja: 'فَا زَبَر تَا جزم فَتْ ، حَا دو پَیْش حٌ',
    pronunciationWord: 'فَتْحٌ',
    mashqPage: 1,
    rowNumber: 5,
    colNumber: 5,
    tajweedRuleTitle: 'تا ساکن مع حا تنوین',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'فَتْ', type: 'normal' },
      { letter: 'حٌ', type: 'heavy' }
    ]
  }
];

// ============================================================================
// مشق (۳۵ کلمات - ۷ قطاریں x ۵ کالمز)
// ============================================================================
export const SUKOON_MASHQ_PAGE_2_ITEMS: SukoonMashqItem[] = [
  // Row 1: مُؤْمِنِیْنَ ، مُؤْمِنُوْنَ ، يُؤْمِنُوْنَ ، مُؤْصَدَةٌ ، اِقْرَأْ
  {
    id: 'm2-r1-c1',
    word: 'مُؤْمِنِیْنَ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 6,
    letters: ['مُؤْ', 'مِ', 'نِیْ', 'نَ'],
    breakdown: 'مُؤْ + مِ + نِیْ + نَ',
    spellingHijja: 'مِيم پَیْش ہَمْزَہ جزم مُؤْ ، مِيم زَیْر مِ ، نُون زَیْر يَا نِیْ ، نُون زَبَر نَ',
    pronunciationWord: 'مُؤْمِنِیْنَ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 1,
    colNumber: 1,
    tajweedRuleTitle: 'ہمزہ ساکنہ (جھٹکے سے ادا کریں)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'مُ', type: 'heavy' },
      { letter: 'ؤْ', type: 'hamzah_sakinah' },
      { letter: 'مِنِیْنَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r1-c2',
    word: 'مُؤْمِنُوْنَ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 6,
    letters: ['مُؤْ', 'مِ', 'نُوْ', 'نَ'],
    breakdown: 'مُؤْ + مِ + نُوْ + نَ',
    spellingHijja: 'مِيم پَیْش ہَمْزَہ جزم مُؤْ ، مِيم زَیْر مِ ، نُون پَیْش وَاو نُوْ ، نُون زَبَر نَ',
    pronunciationWord: 'مُؤْمِنُوْنَ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 1,
    colNumber: 2,
    tajweedRuleTitle: 'ہمزہ ساکنہ (جھٹکے سے ادا کریں)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'مُ', type: 'heavy' },
      { letter: 'ؤْ', type: 'hamzah_sakinah' },
      { letter: 'مِنُوْنَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r1-c3',
    word: 'يُؤْمِنُوْنَ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 6,
    letters: ['يُؤْ', 'مِ', 'نُوْ', 'نَ'],
    breakdown: 'يُؤْ + مِ + نُوْ + نَ',
    spellingHijja: 'يَا پَیْش ہَمْزَہ جزم يُؤْ ، مِيم زَیْر مِ ، نُون پَیْش وَاو نُوْ ، نُون زَبَر نَ',
    pronunciationWord: 'يُؤْمِنُوْنَ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 1,
    colNumber: 3,
    tajweedRuleTitle: 'ہمزہ ساکنہ (جھٹکے سے ادا کریں)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'يُ', type: 'heavy' },
      { letter: 'ؤْ', type: 'hamzah_sakinah' },
      { letter: 'مِنُوْنَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r1-c4',
    word: 'مُؤْصَدَةٌ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ و پُر)',
    letterCount: 5,
    letters: ['مُؤْ', 'صَ', 'دَ', 'ةٌ'],
    breakdown: 'مُؤْ + صَ + دَ + ةٌ',
    spellingHijja: 'مِيم پَیْش ہَمْزَہ جزم مُؤْ ، صَاد زَبَر صَ ، دَال زَبَر دَ ، تَا دو پَیْش ةٌ',
    pronunciationWord: 'مُؤْصَدَةٌ',
    isHamzahSakinah: true,
    isHeavyLetterIncluded: true,
    heavyLetter: 'ص',
    mashqPage: 2,
    rowNumber: 1,
    colNumber: 4,
    tajweedRuleTitle: 'ہمزہ ساکنہ (جھٹکا) + صَاد پُر (نیلا)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'مُ', type: 'heavy' },
      { letter: 'ؤْ', type: 'hamzah_sakinah' },
      { letter: 'صَ', type: 'heavy' },
      { letter: 'دَةٌ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r1-c5',
    word: 'اِقْرَأْ',
    categoryLabelUrdu: 'مشق (قلقلہ و ہمزہ ساکنہ)',
    letterCount: 4,
    letters: ['اِقْ', 'رَأْ'],
    breakdown: 'اِقْ + رَأْ',
    spellingHijja: 'ہَمْزَہ زَیْر قَاف جزم اِقْ ، رَا زَبَر ہَمْزَہ جزم رَأْ',
    pronunciationWord: 'اِقْرَأْ',
    isQalqalah: true,
    qalqalahLetter: 'ق',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ق',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 1,
    colNumber: 5,
    tajweedRuleTitle: 'قاف قلقلہ (سرخ) + ہمزہ ساکنہ (سبز جھٹکا)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'اِ', type: 'heavy' },
      { letter: 'قْ', type: 'qalqalah' },
      { letter: 'رَ', type: 'normal' },
      { letter: 'أْ', type: 'hamzah_sakinah' }
    ]
  },

  // Row 2: شَأْنُ ، كَأْسًا ، بِئْسَ ، يَشَأْ ، نَشَأْ
  {
    id: 'm2-r2-c1',
    word: 'شَأْنُ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 3,
    letters: ['شَأْ', 'نُ'],
    breakdown: 'شَأْ + نُ',
    spellingHijja: 'شِين زَبَر ہَمْزَہ جزم شَأْ ، نُون پَیْش نُ',
    pronunciationWord: 'شَأْنُ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 2,
    colNumber: 1,
    tajweedRuleTitle: 'ہمزہ ساکنہ (أْ سبز جھٹکا)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'شَ', type: 'heavy' },
      { letter: 'أْ', type: 'hamzah_sakinah' },
      { letter: 'نُ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r2-c2',
    word: 'كَأْسًا',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 4,
    letters: ['كَأْ', 'سًا'],
    breakdown: 'كَأْ + سًا',
    spellingHijja: 'كَاف زَبَر ہَمْزَہ جزم كَأْ ، سِین دو زَبَر اَلِف سًا',
    pronunciationWord: 'كَأْسًا',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 2,
    colNumber: 2,
    tajweedRuleTitle: 'ہمزہ ساکنہ (أْ سبز جھٹکا) مع تنوین',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'كَ', type: 'heavy' },
      { letter: 'أْ', type: 'hamzah_sakinah' },
      { letter: 'سًا', type: 'normal' }
    ]
  },
  {
    id: 'm2-r2-c3',
    word: 'بِئْسَ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 3,
    letters: ['بِئْ', 'سَ'],
    breakdown: 'بِئْ + سَ',
    spellingHijja: 'بَا زَیْر ہَمْزَہ جزم بِئْ ، سِین زَبَر سَ',
    pronunciationWord: 'بِئْسَ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 2,
    colNumber: 3,
    tajweedRuleTitle: 'ہمزہ ساکنہ یاء پر (جھٹکا)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'بِ', type: 'heavy' },
      { letter: 'ئْ', type: 'hamzah_sakinah' },
      { letter: 'سَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r2-c4',
    word: 'يَشَأْ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 3,
    letters: ['يَ', 'شَأْ'],
    breakdown: 'يَ + شَأْ',
    spellingHijja: 'يَا زَبَر يَ ، شِين زَبَر ہَمْزَہ جزم شَأْ',
    pronunciationWord: 'يَشَأْ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 2,
    colNumber: 4,
    tajweedRuleTitle: 'ہمزہ ساکنہ آخر میں (أْ سبز جھٹکا)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'يَ', type: 'heavy' },
      { letter: 'شَ', type: 'normal' },
      { letter: 'أْ', type: 'hamzah_sakinah' }
    ]
  },
  {
    id: 'm2-r2-c5',
    word: 'نَشَأْ',
    categoryLabelUrdu: 'مشق (ہمزہ ساکنہ)',
    letterCount: 3,
    letters: ['نَ', 'شَأْ'],
    breakdown: 'نَ + شَأْ',
    spellingHijja: 'نُون زَبَر نَ ، شِين زَبَر ہَمْزَہ جزم شَأْ',
    pronunciationWord: 'نَشَأْ',
    isHamzahSakinah: true,
    mashqPage: 2,
    rowNumber: 2,
    colNumber: 5,
    tajweedRuleTitle: 'ہمزہ ساکنہ آخر میں (أْ سبز جھٹکا)',
    tajweedRuleBadgeColor: 'green',
    displayColored: [
      { letter: 'نَ', type: 'heavy' },
      { letter: 'شَ', type: 'normal' },
      { letter: 'أْ', type: 'hamzah_sakinah' }
    ]
  },

  // Row 3: إِثْمُ ، يَبْحَثُ ، اَحْيَا ، أُخْرٰی ، اِذْهَبْ
  {
    id: 'm2-r3-c1',
    word: 'إِثْمُ',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 3,
    letters: ['إِثْ', 'مُ'],
    breakdown: 'إِثْ + مُ',
    spellingHijja: 'ہَمْزَہ زَیْر ثَا جزم إِثْ ، مِيم پَیْش مُ',
    pronunciationWord: 'إِثْمُ',
    mashqPage: 2,
    rowNumber: 3,
    colNumber: 1,
    tajweedRuleTitle: 'ثا نرم ساکن (سیٹی کے بغیر)',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'إِثْ', type: 'heavy' },
      { letter: 'مُ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r3-c2',
    word: 'يَبْحَثُ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['يَبْ', 'حَ', 'ثُ'],
    breakdown: 'يَبْ + حَ + ثُ',
    spellingHijja: 'يَا زَبَر بَا جزم يَبْ ، حَا زَبَر حَ ، ثَا پَیْش ثُ',
    pronunciationWord: 'يَبْحَثُ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    mashqPage: 2,
    rowNumber: 3,
    colNumber: 2,
    tajweedRuleTitle: 'با قلقلہ (سرخ) مع حا اور ثا',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'يَ', type: 'heavy' },
      { letter: 'بْ', type: 'qalqalah' },
      { letter: 'حَثُ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r3-c3',
    word: 'اَحْيَا',
    categoryLabelUrdu: 'مشق (مرکبات)',
    letterCount: 4,
    letters: ['اَحْ', 'يَا'],
    breakdown: 'اَحْ + يَا',
    spellingHijja: 'ہَمْزَہ زَبَر حَا جزم اَحْ ، يَا زَبَر اَلِف يَا',
    pronunciationWord: 'اَحْيَا',
    mashqPage: 2,
    rowNumber: 3,
    colNumber: 3,
    tajweedRuleTitle: 'حا ساکن (حلق سے صاف آواز)',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'اَحْ', type: 'heavy' },
      { letter: 'يَا', type: 'normal' }
    ]
  },
  {
    id: 'm2-r3-c4',
    word: 'أُخْرٰی',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['أُخْ', 'رٰی'],
    breakdown: 'أُخْ + رٰی',
    spellingHijja: 'ہَمْزَہ پَیْش خَا جزم أُخْ ، رَا کھڑا زَبَر رٰی',
    pronunciationWord: 'أُخْرٰی',
    isHeavyLetterIncluded: true,
    heavyLetter: 'خ',
    mashqPage: 2,
    rowNumber: 3,
    colNumber: 4,
    tajweedRuleTitle: 'خا پُر ساکن (نیلا مستعلیہ)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'أُ', type: 'heavy' },
      { letter: 'خْ', type: 'heavy' },
      { letter: 'رٰی', type: 'normal' }
    ]
  },
  {
    id: 'm2-r3-c5',
    word: 'اِذْهَبْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['اِذْ', 'هَبْ'],
    breakdown: 'اِذْ + هَبْ',
    spellingHijja: 'ہَمْزَہ زَیْر ذَال جزم اِذْ ، ہَا زَبَر بَا جزم هَبْ',
    pronunciationWord: 'اِذْهَبْ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    mashqPage: 2,
    rowNumber: 3,
    colNumber: 5,
    tajweedRuleTitle: 'ذال نرم + با قلقلہ (سرخ)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'اِ', type: 'heavy' },
      { letter: 'ذْهَ', type: 'normal' },
      { letter: 'بْ', type: 'qalqalah' }
    ]
  },

  // Row 4: اُشْدُدْ ، اِرْكَبْ ، حُشِرَتْ ، نُشِرَتْ ، أُحْضِرَتْ
  {
    id: 'm2-r4-c1',
    word: 'اُشْدُدْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['اُشْ', 'دُدْ'],
    breakdown: 'اُشْ + دُدْ',
    spellingHijja: 'ہَمْزَہ پَیْش شِين جزم اُشْ ، دَال پَیْش دَال جزم دُدْ',
    pronunciationWord: 'اُشْدُدْ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    mashqPage: 2,
    rowNumber: 4,
    colNumber: 1,
    tajweedRuleTitle: 'شین تفشی + دال قلقلہ (سرخ)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'اُ', type: 'heavy' },
      { letter: 'شْدُ', type: 'normal' },
      { letter: 'دْ', type: 'qalqalah' }
    ]
  },
  {
    id: 'm2-r4-c2',
    word: 'اِرْكَبْ',
    categoryLabelUrdu: 'مشق (قلقلہ)',
    letterCount: 4,
    letters: ['اِرْ', 'كَبْ'],
    breakdown: 'اِرْ + كَبْ',
    spellingHijja: 'ہَمْزَہ زَیْر رَا جزم اِرْ ، كَاف زَبَر بَا جزم كَبْ',
    pronunciationWord: 'اِرْكَبْ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    mashqPage: 2,
    rowNumber: 4,
    colNumber: 2,
    tajweedRuleTitle: 'را ساکن + با قلقلہ (سرخ)',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'اِ', type: 'heavy' },
      { letter: 'رْكَ', type: 'normal' },
      { letter: 'بْ', type: 'qalqalah' }
    ]
  },
  {
    id: 'm2-r4-c3',
    word: 'حُشِرَتْ',
    categoryLabelUrdu: 'مشق (افعالِ قرآنی)',
    letterCount: 4,
    letters: ['حُ', 'شِ', 'رَتْ'],
    breakdown: 'حُ + شِ + رَتْ',
    spellingHijja: 'حَا پَیْش حُ ، شِين زَیْر شِ ، رَا زَبَر تَا جزم رَتْ',
    pronunciationWord: 'حُشِرَتْ',
    mashqPage: 2,
    rowNumber: 4,
    colNumber: 3,
    tajweedRuleTitle: 'تا ساکن مع ہمْس (ہلکی ہوا)',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'حُ', type: 'heavy' },
      { letter: 'شِرَتْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r4-c4',
    word: 'نُشِرَتْ',
    categoryLabelUrdu: 'مشق (افعالِ قرآنی)',
    letterCount: 4,
    letters: ['نُ', 'شِ', 'رَتْ'],
    breakdown: 'نُ + شِ + رَتْ',
    spellingHijja: 'نُون پَیْش نُ ، شِين زَیْر شِ ، رَا زَبَر تَا جزم رَتْ',
    pronunciationWord: 'نُشِرَتْ',
    mashqPage: 2,
    rowNumber: 4,
    colNumber: 4,
    tajweedRuleTitle: 'تا ساکن مع ہمْس',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'نُ', type: 'heavy' },
      { letter: 'شِرَتْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r4-c5',
    word: 'أُحْضِرَتْ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 5,
    letters: ['أُحْ', 'ضِ', 'رَتْ'],
    breakdown: 'أُحْ + ضِ + رَتْ',
    spellingHijja: 'ہَمْزَہ پَیْش حَا جزم أُحْ ، ضَاد زَیْر ضِ ، رَا زَبَر تَا جزم رَتْ',
    pronunciationWord: 'أُحْضِرَتْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ض',
    mashqPage: 2,
    rowNumber: 4,
    colNumber: 5,
    tajweedRuleTitle: 'ضاد پُر مکسور (نیلا)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'أُ', type: 'heavy' },
      { letter: 'حْ', type: 'normal' },
      { letter: 'ضِ', type: 'heavy' },
      { letter: 'رَتْ', type: 'normal' }
    ]
  },

  // Row 5: طُمِسَتْ ، فُرِّجَتْ ، نُسِفَتْ ، يُظْلَمُوْنَ ، يَظْهَرُ
  {
    id: 'm2-r5-c1',
    word: 'طُمِسَتْ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['طُ', 'مِ', 'سَتْ'],
    breakdown: 'طُ + مِ + سَتْ',
    spellingHijja: 'طَا پَیْش طُ ، مِيم زَیْر مِ ، سِین زَبَر تَا جزم سَتْ',
    pronunciationWord: 'طُمِسَتْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ط',
    mashqPage: 2,
    rowNumber: 5,
    colNumber: 1,
    tajweedRuleTitle: 'طا پُر مضموم (نیلا)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'طُ', type: 'heavy' },
      { letter: 'مِسَتْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r5-c2',
    word: 'فُرِّجَتْ',
    categoryLabelUrdu: 'مشق (افعالِ قرآنی)',
    letterCount: 4,
    letters: ['فُ', 'رِّ', 'جَتْ'],
    breakdown: 'فُ + رِّ + جَتْ',
    spellingHijja: 'فَا پَیْش فُ ، رَا زَیْر تشدید رِّ ، جِيم زَبَر تَا جزم جَتْ',
    pronunciationWord: 'فُرِّجَتْ',
    mashqPage: 2,
    rowNumber: 5,
    colNumber: 2,
    tajweedRuleTitle: 'را مشدد باریک + تا ساکن',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'فُ', type: 'heavy' },
      { letter: 'رِّجَتْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r5-c3',
    word: 'نُسِفَتْ',
    categoryLabelUrdu: 'مشق (افعالِ قرآنی)',
    letterCount: 4,
    letters: ['نُ', 'سِ', 'فَتْ'],
    breakdown: 'نُ + سِ + فَتْ',
    spellingHijja: 'نُون پَیْش نُ ، سِین زَیْر سِ ، فَا زَبَر تَا جزم فَتْ',
    pronunciationWord: 'نُسِفَتْ',
    mashqPage: 2,
    rowNumber: 5,
    colNumber: 3,
    tajweedRuleTitle: 'فا زبر تا جزم فَتْ',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'نُ', type: 'heavy' },
      { letter: 'سِفَتْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r5-c4',
    word: 'يُظْلَمُوْنَ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 6,
    letters: ['يُظْ', 'لَ', 'مُوْ', 'نَ'],
    breakdown: 'يُظْ + لَ + مُوْ + نَ',
    spellingHijja: 'يَا پَیْش ظَا جزم يُظْ ، لَام زَبَر لَ ، مِيم پَیْش وَاو مُوْ ، نُون زَبَر نَ',
    pronunciationWord: 'يُظْلَمُوْنَ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ظ',
    mashqPage: 2,
    rowNumber: 5,
    colNumber: 4,
    tajweedRuleTitle: 'ظا پُر ساکن (نیلا مستعلیہ)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'يُ', type: 'normal' },
      { letter: 'ظْ', type: 'heavy' },
      { letter: 'لَمُوْنَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r5-c5',
    word: 'يَظْهَرُ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['يَظْ', 'هَ', 'رُ'],
    breakdown: 'يَظْ + هَ + رُ',
    spellingHijja: 'يَا زَبَر ظَا جزم يَظْ ، ہَا زَبَر هَ ، رَا پَیْش رُ',
    pronunciationWord: 'يَظْهَرُ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ظ',
    mashqPage: 2,
    rowNumber: 5,
    colNumber: 5,
    tajweedRuleTitle: 'ظا پُر ساکن مع ہا اور را',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'يَ', type: 'normal' },
      { letter: 'ظْ', type: 'heavy' },
      { letter: 'هَرُ', type: 'normal' }
    ]
  },

  // Row 6: اِصْبِرْ ، بَيْنَكُمْ ، بَيْنَهُمْ ، فَضْلُكَ ، عَلَيْهِمْ
  {
    id: 'm2-r6-c1',
    word: 'اِصْبِرْ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['اِصْ', 'بِرْ'],
    breakdown: 'اِصْ + بِرْ',
    spellingHijja: 'ہَمْزَہ زَیْر صَاد جزم اِصْ ، بَا زَیْر رَا جزم بِرْ',
    pronunciationWord: 'اِصْبِرْ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ص',
    mashqPage: 2,
    rowNumber: 6,
    colNumber: 1,
    tajweedRuleTitle: 'صاد پُر ساکن (نیلا)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'اِ', type: 'heavy' },
      { letter: 'صْ', type: 'heavy' },
      { letter: 'بِرْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r6-c2',
    word: 'بَيْنَكُمْ',
    categoryLabelUrdu: 'مشق (حروفِ لین)',
    letterCount: 5,
    letters: ['بَیْ', 'نَ', 'كُمْ'],
    breakdown: 'بَیْ + نَ + كُمْ',
    spellingHijja: 'بَا زَبَر يَا جزم بَیْ ، نُون زَبَر نَ ، كَاف پَیْش مِيم جزم كُمْ',
    pronunciationWord: 'بَيْنَكُمْ',
    mashqPage: 2,
    rowNumber: 6,
    colNumber: 2,
    tajweedRuleTitle: 'حرفِ لین (بَیْ) نرمی سے ادا کریں',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'بَیْ', type: 'heavy' },
      { letter: 'نَكُمْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r6-c3',
    word: 'بَيْنَهُمْ',
    categoryLabelUrdu: 'مشق (حروفِ لین)',
    letterCount: 5,
    letters: ['بَیْ', 'نَ', 'هُمْ'],
    breakdown: 'بَیْ + نَ + هُمْ',
    spellingHijja: 'بَا زَبَر يَا جزم بَیْ ، نُون زَبَر نَ ، ہَا پَیْش مِيم جزم هُمْ',
    pronunciationWord: 'بَيْنَهُمْ',
    mashqPage: 2,
    rowNumber: 6,
    colNumber: 3,
    tajweedRuleTitle: 'حرفِ لین (بَیْ) مع میم ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'بَیْ', type: 'heavy' },
      { letter: 'نَهُمْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r6-c4',
    word: 'فَضْلُكَ',
    categoryLabelUrdu: 'مشق (حروفِ مستعلیہ)',
    letterCount: 4,
    letters: ['فَضْ', 'لُ', 'كَ'],
    breakdown: 'فَضْ + لُ + كَ',
    spellingHijja: 'فَا زَبَر ضَاد جزم فَضْ ، لَام پَیْش لُ ، كَاف زَبَر كَ',
    pronunciationWord: 'فَضْلُكَ',
    isHeavyLetterIncluded: true,
    heavyLetter: 'ض',
    mashqPage: 2,
    rowNumber: 6,
    colNumber: 4,
    tajweedRuleTitle: 'ضاد پُر ساکن (نیلا مستعلیہ)',
    tajweedRuleBadgeColor: 'blue',
    displayColored: [
      { letter: 'فَ', type: 'normal' },
      { letter: 'ضْ', type: 'heavy' },
      { letter: 'لُكَ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r6-c5',
    word: 'عَلَيْهِمْ',
    categoryLabelUrdu: 'مشق (حروفِ لین)',
    letterCount: 5,
    letters: ['عَ', 'لَیْ', 'هِمْ'],
    breakdown: 'عَ + لَیْ + هِمْ',
    spellingHijja: 'عَیْن زَبَر عَ ، لَام زَبَر يَا جزم لَیْ ، ہَا زَیْر مِيم جزم هِمْ',
    pronunciationWord: 'عَلَيْهِمْ',
    mashqPage: 2,
    rowNumber: 6,
    colNumber: 5,
    tajweedRuleTitle: 'حرفِ لین (لَیْ) مع میم ساکن',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'عَ', type: 'heavy' },
      { letter: 'لَیْ', type: 'normal' },
      { letter: 'هِمْ', type: 'normal' }
    ]
  },

  // Row 7: أَعْمَالُهُمْ ، أَعْمَالَكُمْ ، أَيْدِيْهِمْ ، يَسْتَبْدِلْ ، يَسْتَفْتِحُوْنَ
  {
    id: 'm2-r7-c1',
    word: 'أَعْمَالُهُمْ',
    categoryLabelUrdu: 'مشق (مرکباتِ طویلہ)',
    letterCount: 6,
    letters: ['أَعْ', 'مَا', 'لُ', 'هُمْ'],
    breakdown: 'أَعْ + مَا + لُ + هُمْ',
    spellingHijja: 'ہَمْزَہ زَبَر عَیْن جزم أَعْ ، مِيم زَبَر اَلِف مَا ، لَام پَیْش لُ ، ہَا پَیْش مِيم جزم هُمْ',
    pronunciationWord: 'أَعْمَالُهُمْ',
    mashqPage: 2,
    rowNumber: 7,
    colNumber: 1,
    tajweedRuleTitle: 'عین ساکن + الف مدہ + میم ساکن',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'أَعْ', type: 'heavy' },
      { letter: 'مَالُهُمْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r7-c2',
    word: 'أَعْمَالَكُمْ',
    categoryLabelUrdu: 'مشق (مرکباتِ طویلہ)',
    letterCount: 6,
    letters: ['أَعْ', 'مَا', 'لَ', 'كُمْ'],
    breakdown: 'أَعْ + مَا + لَ + كُمْ',
    spellingHijja: 'ہَمْزَہ زَبَر عَیْن جزم أَعْ ، مِيم زَبَر اَلِف مَا ، لَام زَبَر لَ ، كَاف پَیْش مِيم جزم كُمْ',
    pronunciationWord: 'أَعْمَالَكُمْ',
    mashqPage: 2,
    rowNumber: 7,
    colNumber: 2,
    tajweedRuleTitle: 'عین ساکن + الف مدہ + میم ساکن',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'أَعْ', type: 'heavy' },
      { letter: 'مَالَكُمْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r7-c3',
    word: 'أَيْدِيْهِمْ',
    categoryLabelUrdu: 'مشق (حروفِ لین)',
    letterCount: 6,
    letters: ['أَيْ', 'دِیْ', 'هِمْ'],
    breakdown: 'أَيْ + دِیْ + هِمْ',
    spellingHijja: 'ہَمْزَہ زَبَر يَا جزم أَيْ ، دَال زَیْر يَا دِیْ ، ہَا زَیْر مِيم جزم هِمْ',
    pronunciationWord: 'أَيْدِيْهِمْ',
    mashqPage: 2,
    rowNumber: 7,
    colNumber: 3,
    tajweedRuleTitle: 'حرفِ لین (أَيْ) + یاء مدہ',
    tajweedRuleBadgeColor: 'emerald',
    displayColored: [
      { letter: 'أَيْ', type: 'heavy' },
      { letter: 'دِیْهِمْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r7-c4',
    word: 'يَسْتَبْدِلْ',
    categoryLabelUrdu: 'مشق (قلقلہ مرکب)',
    letterCount: 6,
    letters: ['يَسْ', 'تَبْ', 'دِلْ'],
    breakdown: 'يَسْ + تَبْ + دِلْ',
    spellingHijja: 'يَا زَبَر سِین جزم يَسْ ، تَا زَبَر بَا جزم تَبْ ، دَال زَیْر لَام جزم دِلْ',
    pronunciationWord: 'يَسْتَبْدِلْ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    mashqPage: 2,
    rowNumber: 7,
    colNumber: 4,
    tajweedRuleTitle: 'سین ساکن + با قلقلہ (سرخ) + لام ساکن',
    tajweedRuleBadgeColor: 'red',
    displayColored: [
      { letter: 'يَسْ', type: 'normal' },
      { letter: 'تَ', type: 'heavy' },
      { letter: 'بْ', type: 'qalqalah' },
      { letter: 'دِلْ', type: 'normal' }
    ]
  },
  {
    id: 'm2-r7-c5',
    word: 'يَسْتَفْتِحُوْنَ',
    categoryLabelUrdu: 'مشق (مرکباتِ طویلہ)',
    letterCount: 8,
    letters: ['يَسْ', 'تَفْ', 'تِ', 'حُوْ', 'نَ'],
    breakdown: 'يَسْ + تَفْ + تِ + حُوْ + نَ',
    spellingHijja: 'يَا زَبَر سِین جزم يَسْ ، تَا زَبَر فَا جزم تَفْ ، تَا زَیْر تِ ، حَا پَیْش وَاو حُوْ ، نُون زَبَر نَ',
    pronunciationWord: 'يَسْتَفْتِحُوْنَ',
    mashqPage: 2,
    rowNumber: 7,
    colNumber: 5,
    tajweedRuleTitle: 'سین ساکن + فا ساکن + واؤ مدہ',
    tajweedRuleBadgeColor: 'purple',
    displayColored: [
      { letter: 'يَسْ', type: 'heavy' },
      { letter: 'تَفْتِحُوْنَ', type: 'normal' }
    ]
  }
];

// All 60 Practice Words Combined
export const ALL_SUKOON_MASHQ_WORDS: SukoonMashqItem[] = [
  ...SUKOON_MASHQ_PAGE_1_ITEMS,
  ...SUKOON_MASHQ_PAGE_2_ITEMS
];
