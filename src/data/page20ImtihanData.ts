export interface ImtihanWordItem {
  id: number;
  word: string;
  hijjaText: string;
  rawSound: string;
  category: 'alif' | 'waw' | 'yaa' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'mixed' | 'short';
  maddahFeatures: ('alif_maddah' | 'waw_maddah' | 'yaa_maddah' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'harakat' | 'leen')[];
  row: number; // 1 to 10
  col: number; // 1 (Rightmost) to 5 (Leftmost)
  section: 1 | 2 | 3;
  page: 20;
  meaningOrContext: string;
  tajweedNotes: string;
  isHeavy?: boolean;
  syllableBreakdown: string[];
}

export const PAGE_20_IMTIHAN_WORDS: ImtihanWordItem[] = [
  // ==========================================
  // SECTION 1 (Rows 1 to 3 - 15 Words)
  // ==========================================
  // Row 1
  {
    id: 501,
    word: 'أَفَلَا',
    hijjaText: 'ہمزہ زبر اَ ، فا زبر فَ ، لام الف زبر لَا = أَفَلَا',
    rawSound: 'أَفَلَا',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 1, col: 1, section: 1, page: 20,
    meaningOrContext: 'کیا پس نہیں (قرآنی استفہام)',
    tajweedNotes: 'اَ اور فَ کو بغیر کھینچے جلدی پڑھیں، لَا میں الف مدہ کو ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['أَ', 'فَ', 'لَا']
  },
  {
    id: 502,
    word: 'يُقَالُ',
    hijjaText: 'یا پیش يُ ، قاف الف زبر قَا ، لام پیش لُ = يُقَالُ',
    rawSound: 'يُقَالُ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 1, col: 2, section: 1, page: 20,
    meaningOrContext: 'کہا جاتا ہے',
    tajweedNotes: 'قاف مستعلیہ ہے، قَا کو پُر اور ۱ الف کھینچ کر پڑھیں، يُ اور لُ جلدی۔',
    isHeavy: true,
    syllableBreakdown: ['يُ', 'قَا', 'لُ']
  },
  {
    id: 503,
    word: 'يَدَاهُ',
    hijjaText: 'یا زبر يَ ، دال الف زبر دَا ، ہا پیش هُ = يَدَاهُ',
    rawSound: 'يَدَاهُ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 1, col: 3, section: 1, page: 20,
    meaningOrContext: 'اس کے دونوں ہاتھ',
    tajweedNotes: 'دَا ۱ الف مدہ باریک، يَ اور هُ بغیر کھینچے۔',
    isHeavy: false,
    syllableBreakdown: ['يَ', 'دَا', 'هُ']
  },
  {
    id: 504,
    word: 'بَنٰهَا',
    hijjaText: 'با زبر بَ ، نون کھڑا زبر نٰ ، ہا الف زبر هَا = بَنٰهَا',
    rawSound: 'بَنٰهَا',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'alif_maddah', 'harakat'],
    row: 1, col: 4, section: 1, page: 20,
    meaningOrContext: 'اس نے اسے بنایا',
    tajweedNotes: 'نٰ (کھڑا زبر) اور هَا (الف مدہ) دونوں کو برابر ۱، ۱ الف کھینچ کر پڑھیں۔',
    isHeavy: false,
    syllableBreakdown: ['بَ', 'نٰ', 'هَا']
  },
  {
    id: 505,
    word: 'اَثَرِ',
    hijjaText: 'ہمزہ زبر اَ ، ثا زبر ثَ ، را زیر رِ = اَثَرِ',
    rawSound: 'اَثَرِ',
    category: 'short',
    maddahFeatures: ['harakat'],
    row: 1, col: 5, section: 1, page: 20,
    meaningOrContext: 'نشان / نقشِ قدم',
    tajweedNotes: 'تینوں متحرک حروف کو بغیر کھینچے معروف پڑھیں، ثا نرمی سے اور رِ باریک۔',
    isHeavy: false,
    syllableBreakdown: ['اَ', 'ثَ', 'رِ']
  },

  // Row 2
  {
    id: 506,
    word: 'اٰتِكَ',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، تا زیر تِ ، کاف زبر كَ = اٰتِكَ',
    rawSound: 'اٰتِكَ',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'harakat'],
    row: 2, col: 1, section: 1, page: 20,
    meaningOrContext: 'میں تیرے پاس لاتا ہوں',
    tajweedNotes: 'اٰ پر کھڑا زبر ۱ الف کھینچیں، تِ اور كَ کو جلدی ادا کریں۔',
    isHeavy: false,
    syllableBreakdown: ['اٰ', 'تِ', 'كَ']
  },
  {
    id: 507,
    word: 'نَاقَةَ',
    hijjaText: 'نون الف زبر نَا ، قاف زبر قَ ، تا زبر تَ = نَاقَةَ',
    rawSound: 'نَاقَةَ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 2, col: 2, section: 1, page: 20,
    meaningOrContext: 'اونٹنی (حضرت صالح علیہ السلام کی)',
    tajweedNotes: 'نَا الف مدہ ۱ الف، قَ پُر (موٹا) اور تَ باریک جلدی۔',
    isHeavy: true,
    syllableBreakdown: ['نَا', 'قَ', 'تَ']
  },
  {
    id: 508,
    word: 'تَلٰهَا',
    hijjaText: 'تا زبر تَ ، لام کھڑا زبر لٰ ، ہا الف زبر هَا = تَلٰهَا',
    rawSound: 'تَلٰهَا',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'alif_maddah', 'harakat'],
    row: 2, col: 3, section: 1, page: 20,
    meaningOrContext: 'اس کے پیچھے آیا',
    tajweedNotes: 'لٰ (کھڑا زبر) اور هَا (الف مدہ) دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['تَ', 'لٰ', 'هَا']
  },
  {
    id: 509,
    word: 'مَلِكِ',
    hijjaText: 'میم زبر مَ ، لام زیر لِ ، کاف زیر كِ = مَلِكِ',
    rawSound: 'مَلِكِ',
    category: 'short',
    maddahFeatures: ['harakat'],
    row: 2, col: 4, section: 1, page: 20,
    meaningOrContext: 'بادشاہ / مالک',
    tajweedNotes: 'تمام حرکات کو بغیر کھینچے اور جھٹکا دیے بغیر نرمی سے ادا کریں۔',
    isHeavy: false,
    syllableBreakdown: ['مَ', 'لِ', 'كِ']
  },
  {
    id: 510,
    word: 'اَبِيْهِ',
    hijjaText: 'ہمزہ زبر اَ ، با یا زیر بِيْ ، ہا زیر هِ = اَبِيْهِ',
    rawSound: 'اَبِيْهِ',
    category: 'yaa',
    maddahFeatures: ['yaa_maddah', 'harakat'],
    row: 2, col: 5, section: 1, page: 20,
    meaningOrContext: 'اس کے والد',
    tajweedNotes: 'بِيْ میں یاء مدہ ہے (۱ الف کھینچیں)، اَ اور هِ کو جلدی پڑھیں۔',
    isHeavy: false,
    syllableBreakdown: ['اَ', 'بِيْ', 'هِ']
  },

  // Row 3
  {
    id: 511,
    word: 'اِنْسَانَ',
    hijjaText: 'ہمزہ زیر نون اِنْ ، سین الف زبر سَا ، نون زبر نَ = اِنْسَانَ',
    rawSound: 'اِنْسَانَ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 3, col: 1, section: 1, page: 20,
    meaningOrContext: 'انسان',
    tajweedNotes: 'نون ساکن پر اخفاء، سَا الف مدہ ۱ الف کھینچ کر، نَ جلدی۔',
    isHeavy: false,
    syllableBreakdown: ['اِنْ', 'سَا', 'نَ']
  },
  {
    id: 512,
    word: 'اَبْرَارٍ',
    hijjaText: 'ہمزہ زبر با اَبْ ، را الف زبر رَا ، را دو زیر رٍ = اَبْرَارٍ',
    rawSound: 'اَبْرَارٍ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 3, col: 2, section: 1, page: 20,
    meaningOrContext: 'نیک و پرہیزگار لوگ',
    tajweedNotes: 'با ساکن پر قلقلہ، رَا پُر (موٹا) ۱ الف مدہ، رٍ تنوین باریک۔',
    isHeavy: true,
    syllableBreakdown: ['اَبْ', 'رَا', 'رٍ']
  },
  {
    id: 513,
    word: 'قُلُوْبِ',
    hijjaText: 'قاف پیش قُ ، لام واؤ پیش لُوْ ، با زیر بِ = قُلُوْبِ',
    rawSound: 'قُلُوْبِ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 3, col: 3, section: 1, page: 20,
    meaningOrContext: 'دل (جمع)',
    tajweedNotes: 'قُ پُر، لُوْ واؤ مدہ ۱ الف کھینچ کر، بِ باریک۔',
    isHeavy: true,
    syllableBreakdown: ['قُ', 'لُوْ', 'بِ']
  },
  {
    id: 514,
    word: 'اَدْرٰىكَ',
    hijjaText: 'ہمزہ زبر دال اَدْ ، را کھڑا زبر رٰ ، کاف زبر كَ = اَدْرٰىكَ',
    rawSound: 'اَدْرٰىكَ',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'harakat'],
    row: 3, col: 4, section: 1, page: 20,
    meaningOrContext: 'تجھے معلوم کرایا',
    tajweedNotes: 'دال ساکن پر قلقلہ، رٰ پُر کھڑا زبر ۱ الف مد، كَ جلدی۔',
    isHeavy: true,
    syllableBreakdown: ['اَدْ', 'رٰى', 'كَ']
  },
  {
    id: 515,
    word: 'يَقُوْمُ',
    hijjaText: 'یا زبر يَ ، قاف واؤ پیش قُوْ ، میم پیش مُ = يَقُوْمُ',
    rawSound: 'يَقُوْمُ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 3, col: 5, section: 1, page: 20,
    meaningOrContext: 'وہ کھڑا ہوتا ہے',
    tajweedNotes: 'قُوْ پُر واؤ مدہ ۱ الف کھینچ کر، يَ اور مُ بغیر کھینچے۔',
    isHeavy: true,
    syllableBreakdown: ['يَ', 'قُوْ', 'مُ']
  },

  // ==========================================
  // SECTION 2 (Rows 4 to 6 - 15 Words)
  // ==========================================
  // Row 4
  {
    id: 516,
    word: 'اٰخِرَةِ',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، خا زیر خِ ، را زبر رَ ، تا زیر تِ = اٰخِرَةِ',
    rawSound: 'اٰخِرَةِ',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'harakat'],
    row: 4, col: 1, section: 2, page: 20,
    meaningOrContext: 'آخرت',
    tajweedNotes: 'اٰ کھڑا زبر ۱ الف مد، خِ اور رَ پُر (موٹا) پڑھیں۔',
    isHeavy: true,
    syllableBreakdown: ['اٰ', 'خِ', 'رَ', 'ةِ']
  },
  {
    id: 517,
    word: 'يُوْثِقُ',
    hijjaText: 'یا واؤ پیش يُوْ ، ثا زیر ثِ ، قاف پیش قُ = يُوْثِقُ',
    rawSound: 'يُوْثِقُ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 4, col: 2, section: 2, page: 20,
    meaningOrContext: 'وہ جکڑتا ہے / باندھتا ہے',
    tajweedNotes: 'يُوْ واؤ مدہ ۱ الف، ثِ نرم، قُ پُر پیش کے ساتھ۔',
    isHeavy: true,
    syllableBreakdown: ['يُوْ', 'ثِ', 'قُ']
  },
  {
    id: 518,
    word: 'نَعِيْمٍ',
    hijjaText: 'نون زبر نَ ، عین یا زیر عِيْ ، میم دو زیر مٍ = نَعِيْمٍ',
    rawSound: 'نَعِيْمٍ',
    category: 'yaa',
    maddahFeatures: ['yaa_maddah', 'harakat'],
    row: 4, col: 3, section: 2, page: 20,
    meaningOrContext: 'عیش و آرام / نعمتیں',
    tajweedNotes: 'عِيْ حلق کے درمیان سے یاء مدہ ۱ الف کھینچ کر، نَ جلدی۔',
    isHeavy: false,
    syllableBreakdown: ['نَ', 'عِيْ', 'مٍ']
  },
  {
    id: 519,
    word: 'اَنْهٰرَ',
    hijjaText: 'ہمزہ زبر نون اَنْ ، ہا کھڑا زبر هٰ ، را زبر رَ = اَنْهٰرَ',
    rawSound: 'اَنْهٰرَ',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'harakat'],
    row: 4, col: 4, section: 2, page: 20,
    meaningOrContext: 'نہریں',
    tajweedNotes: 'نون ساکن پر اظہار (صاف پڑھیں)، هٰ کھڑا زبر ۱ الف، رَ پُر۔',
    isHeavy: true,
    syllableBreakdown: ['اَنْ', 'هٰ', 'رَ']
  },
  {
    id: 520,
    word: 'حَيَاتِىْ',
    hijjaText: 'حا زبر حَ ، یا الف زبر يَا ، تا یا زیر تِيْ = حَيَاتِىْ',
    rawSound: 'حَيَاتِىْ',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'yaa_maddah', 'harakat'],
    row: 4, col: 5, section: 2, page: 20,
    meaningOrContext: 'میری زندگی',
    tajweedNotes: 'يَا (الف مدہ) اور تِيْ (یاء مدہ) دونوں کو برابر ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['حَ', 'يَا', 'تِيْ']
  },

  // Row 5
  {
    id: 521,
    word: 'وَثَاقَهُ',
    hijjaText: 'واؤ زبر وَ ، ثا الف زبر ثَا ، قاف زبر قَ ، ہا پیش هُ = وَثَاقَهُ',
    rawSound: 'وَثَاقَهُ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 5, col: 1, section: 2, page: 20,
    meaningOrContext: 'اس کا جکڑنا / باندھنا',
    tajweedNotes: 'ثَا نرمی سے ۱ الف مدہ، قَ پُر (موٹا)، وَ اور هُ بغیر کھینچے۔',
    isHeavy: true,
    syllableBreakdown: ['وَ', 'ثَا', 'قَ', 'هُ']
  },
  {
    id: 522,
    word: 'عِبَادِىْ',
    hijjaText: 'عین زیر عِ ، با الف زبر بَا ، دال یا زیر دِيْ = عِبَادِىْ',
    rawSound: 'عِبَادِىْ',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'yaa_maddah', 'harakat'],
    row: 5, col: 2, section: 2, page: 20,
    meaningOrContext: 'میرے بندے',
    tajweedNotes: 'بَا (الف مدہ) اور دِيْ (یاء مدہ) دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['عِ', 'بَا', 'دِيْ']
  },
  {
    id: 523,
    word: 'اَنْزَلْنَا',
    hijjaText: 'ہمزہ زبر نون اَنْ ، زا زبر زَ ، لام ساکن زَلْ ، نون الف زبر نَا = اَنْزَلْنَا',
    rawSound: 'اَنْزَلْنَا',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 5, col: 3, section: 2, page: 20,
    meaningOrContext: 'ہم نے نازل کیا',
    tajweedNotes: 'نون ساکن پر اخفاء، زَ سیٹی دار، نَا ۱ الف مدہ کھینچ کر۔',
    isHeavy: false,
    syllableBreakdown: ['اَنْ', 'زَلْ', 'نَا']
  },
  {
    id: 524,
    word: 'قُعُوْدٌ',
    hijjaText: 'قاف پیش قُ ، عین واؤ پیش عُوْ ، دال دو پیش دٌ = قُعُوْدٌ',
    rawSound: 'قُعُوْدٌ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 5, col: 4, section: 2, page: 20,
    meaningOrContext: 'بیٹھے ہوئے لوگ',
    tajweedNotes: 'قُ پُر، عُوْ حلق سے واؤ مدہ ۱ الف، دٌ تنوین کے ساتھ۔',
    isHeavy: true,
    syllableBreakdown: ['قُ', 'عُوْ', 'دٌ']
  },
  {
    id: 525,
    word: 'عَلَيْهَا',
    hijjaText: 'عین زبر عَ ، لام یا زبر لَيْ ، ہا الف زبر هَا = عَلَيْهَا',
    rawSound: 'عَلَيْهَا',
    category: 'mixed',
    maddahFeatures: ['leen', 'alif_maddah', 'harakat'],
    row: 5, col: 5, section: 2, page: 20,
    meaningOrContext: 'اس پر',
    tajweedNotes: 'لَيْ یاء لین نرمی سے، هَا ۱ الف مدہ کھینچ کر پڑھیں۔',
    isHeavy: false,
    syllableBreakdown: ['عَ', 'لَيْ', 'هَا']
  },

  // Row 6
  {
    id: 526,
    word: 'اَعْطَيْنَا',
    hijjaText: 'ہمزہ زبر عین اَعْ ، طا یا زبر طَيْ ، نون الف زبر نَا = اَعْطَيْنَا',
    rawSound: 'اَعْطَيْنَا',
    category: 'mixed',
    maddahFeatures: ['leen', 'alif_maddah', 'harakat'],
    row: 6, col: 1, section: 2, page: 20,
    meaningOrContext: 'ہم نے عطا کیا',
    tajweedNotes: 'عین حلق سے، طَيْ پُر یاء لین، نَا ۱ الف مدہ۔',
    isHeavy: true,
    syllableBreakdown: ['اَعْ', 'طَيْ', 'نَا']
  },
  {
    id: 527,
    word: 'اِهْدِنَا',
    hijjaText: 'ہمزہ زیر ہا اِهْ ، دال زیر دِ ، نون الف زبر نَا = اِهْدِنَا',
    rawSound: 'اِهْدِنَا',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 6, col: 2, section: 2, page: 20,
    meaningOrContext: 'ہمیں سیدھی راہ دکھا',
    tajweedNotes: 'ہا سینے سے صاف، دِ باریک، نَا ۱ الف مدہ۔',
    isHeavy: false,
    syllableBreakdown: ['اِهْ', 'دِ', 'نَا']
  },
  {
    id: 528,
    word: 'يَتِيْمٍ',
    hijjaText: 'یا زبر يَ ، تا یا زیر تِيْ ، میم دو زیر مٍ = يَتِيْمٍ',
    rawSound: 'يَتِيْمٍ',
    category: 'yaa',
    maddahFeatures: ['yaa_maddah', 'harakat'],
    row: 6, col: 3, section: 2, page: 20,
    meaningOrContext: 'یتیم',
    tajweedNotes: 'تِيْ یاء مدہ ۱ الف کھینچ کر، يَ جلدی۔',
    isHeavy: false,
    syllableBreakdown: ['يَ', 'تِيْ', 'مٍ']
  },
  {
    id: 529,
    word: 'تَجْرِىْ',
    hijjaText: 'تا زبر جیم تَجْ ، را یا زیر رِيْ = تَجْرِىْ',
    rawSound: 'تَجْرِىْ',
    category: 'yaa',
    maddahFeatures: ['yaa_maddah', 'harakat'],
    row: 6, col: 4, section: 2, page: 20,
    meaningOrContext: 'وہ بہتی ہے',
    tajweedNotes: 'جیم ساکن پر قلقلہ، رِيْ باریک یاء مدہ ۱ الف۔',
    isHeavy: false,
    syllableBreakdown: ['تَجْ', 'رِيْ']
  },
  {
    id: 530,
    word: 'عَلَيْنَا',
    hijjaText: 'عین زبر عَ ، لام یا زبر لَيْ ، نون الف زبر نَا = عَلَيْنَا',
    rawSound: 'عَلَيْنَا',
    category: 'mixed',
    maddahFeatures: ['leen', 'alif_maddah', 'harakat'],
    row: 6, col: 5, section: 2, page: 20,
    meaningOrContext: 'ہم پر',
    tajweedNotes: 'عَ حلق سے، لَيْ یاء لین نرمی سے، نَا ۱ الف مدہ۔',
    isHeavy: false,
    syllableBreakdown: ['عَ', 'لَيْ', 'نَا']
  },

  // ==========================================
  // SECTION 3 (Rows 7 to 10 - 20 Words)
  // ==========================================
  // Row 7
  {
    id: 531,
    word: 'اَخْبَارَهَا',
    hijjaText: 'ہمزہ زبر خا اَخْ ، با الف زبر بَا ، را زبر رَ ، ہا الف زبر هَا = اَخْبَارَهَا',
    rawSound: 'اَخْبَارَهَا',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 7, col: 1, section: 3, page: 20,
    meaningOrContext: 'اس کی خبریں',
    tajweedNotes: 'خا پُر، بَا اور هَا دونوں الف مدہ ہیں (۱، ۱ الف)، رَ پُر۔',
    isHeavy: true,
    syllableBreakdown: ['اَخْ', 'بَا', 'رَ', 'هَا']
  },
  {
    id: 532,
    word: 'كَاتِبِيْنَ',
    hijjaText: 'کاف الف زبر كَا ، تا زیر تِ ، با یا زیر بِيْ ، نون زبر نَ = كَاتِبِيْنَ',
    rawSound: 'كَاتِبِيْنَ',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'yaa_maddah', 'harakat'],
    row: 7, col: 2, section: 3, page: 20,
    meaningOrContext: 'لکھنے والے (کاتب)',
    tajweedNotes: 'كَا (الف مدہ) اور بِيْ (یاء مدہ) دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['كَا', 'تِ', 'بِيْ', 'نَ']
  },
  {
    id: 533,
    word: 'اُوَارِىَ',
    hijjaText: 'ہمزہ پیش اُ ، واؤ الف زبر وَا ، را زیر رِ ، یا زبر يَ = اُوَارِىَ',
    rawSound: 'اُوَارِىَ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 7, col: 3, section: 3, page: 20,
    meaningOrContext: 'میں چھپاؤں',
    tajweedNotes: 'وَا ۱ الف مدہ، اُ ، رِ ، يَ بغیر کھینچے جلدی۔',
    isHeavy: false,
    syllableBreakdown: ['اُ', 'وَا', 'رِ', 'يَ']
  },
  {
    id: 534,
    word: 'اَشْقٰىهَا',
    hijjaText: 'ہمزہ زبر شین اَشْ ، قاف کھڑا زبر قٰ ، ہا الف زبر هَا = اَشْقٰىهَا',
    rawSound: 'اَشْقٰىهَا',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'alif_maddah', 'harakat'],
    row: 7, col: 4, section: 3, page: 20,
    meaningOrContext: 'سب سے زیادہ بدبخت',
    tajweedNotes: 'قٰ پُر کھڑا زبر اور هَا الف مدہ، دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: true,
    syllableBreakdown: ['اَشْ', 'قٰى', 'هَا']
  },
  {
    id: 535,
    word: 'هَدَيْنَا',
    hijjaText: 'ہا زبر هَ ، دال یا زبر دَيْ ، نون الف زبر نَا = هَدَيْنَا',
    rawSound: 'هَدَيْنَا',
    category: 'mixed',
    maddahFeatures: ['leen', 'alif_maddah', 'harakat'],
    row: 7, col: 5, section: 3, page: 20,
    meaningOrContext: 'ہم نے ہدایت دی',
    tajweedNotes: 'دَيْ یاء لین نرمی سے، نَا ۱ الف مدہ۔',
    isHeavy: false,
    syllableBreakdown: ['هَ', 'دَيْ', 'نَا']
  },

  // Row 8
  {
    id: 536,
    word: 'اِيْتُوْنِىْ',
    hijjaText: 'ہمزہ یا زیر اِيْ ، تا واؤ پیش تُوْ ، نون یا زیر نِيْ = اِيْتُوْنِىْ',
    rawSound: 'اِيْتُوْنِىْ',
    category: 'mixed',
    maddahFeatures: ['yaa_maddah', 'waw_maddah'],
    row: 8, col: 1, section: 3, page: 20,
    meaningOrContext: 'میرے پاس لاؤ',
    tajweedNotes: 'تینوں حروفِ مدہ (اِيْ ، تُوْ ، نِيْ) کو برابر ۱، ۱ الف کھینچ کر پڑھیں۔',
    isHeavy: false,
    syllableBreakdown: ['اِيْ', 'تُوْ', 'نِيْ']
  },
  {
    id: 537,
    word: 'مُوْقَدَةُ',
    hijjaText: 'میم واؤ پیش مُوْ ، قاف زبر قَ ، دال زبر دَ ، تا پیش تُ = مُوْقَدَةُ',
    rawSound: 'مُوْقَدَةُ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 8, col: 2, section: 3, page: 20,
    meaningOrContext: 'بھڑکائی ہوئی (آگ)',
    tajweedNotes: 'مُوْ واؤ مدہ ۱ الف، قَ پُر (موٹا) پڑھیں۔',
    isHeavy: true,
    syllableBreakdown: ['مُوْ', 'قَ', 'دَ', 'ةُ']
  },
  {
    id: 538,
    word: 'اَثْقَالَهَا',
    hijjaText: 'ہمزہ زبر ثا اَثْ ، قاف الف زبر قَا ، لام زبر لَ ، ہا الف زبر هَا = اَثْقَالَهَا',
    rawSound: 'اَثْقَالَهَا',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 8, col: 3, section: 3, page: 20,
    meaningOrContext: 'اس کے بوجھ',
    tajweedNotes: 'ثا نرم، قَا پُر الف مدہ اور هَا الف مدہ، دونوں ۱، ۱ الف۔',
    isHeavy: true,
    syllableBreakdown: ['اَثْ', 'قَا', 'لَ', 'هَا']
  },
  {
    id: 539,
    word: 'فُجُوْرَهَا',
    hijjaText: 'فا پیش فُ ، جیم واؤ پیش جُوْ ، را زبر رَ ، ہا الف زبر هَا = فُجُوْرَهَا',
    rawSound: 'فُجُوْرَهَا',
    category: 'mixed',
    maddahFeatures: ['waw_maddah', 'alif_maddah', 'harakat'],
    row: 8, col: 4, section: 3, page: 20,
    meaningOrContext: 'اس کی برائی و نافرمانی',
    tajweedNotes: 'جُوْ واؤ مدہ اور هَا الف مدہ ۱، ۱ الف، رَ پُر۔',
    isHeavy: true,
    syllableBreakdown: ['فُ', 'جُوْ', 'رَ', 'هَا']
  },
  {
    id: 540,
    word: 'اِبْرٰهٖمَ',
    hijjaText: 'ہمزہ زیر با اِبْ ، را کھڑا زبر رٰ ، ہا کھڑا زیر هٖ ، میم زبر مَ = اِبْرٰهٖمَ',
    rawSound: 'اِبْرٰهٖمَ',
    category: 'khara_zer',
    maddahFeatures: ['khara_zabar', 'khara_zer', 'harakat'],
    row: 8, col: 5, section: 3, page: 20,
    meaningOrContext: 'حضرت ابراہیم علیہ السلام کا مبارک نام',
    tajweedNotes: 'با ساکن پر قلقلہ، رٰ (کھڑا زبر) اور هٖ (کھڑا زیر) دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: true,
    syllableBreakdown: ['اِبْ', 'رٰ', 'هٖ', 'مَ']
  },

  // Row 9
  {
    id: 541,
    word: 'خِتٰمُهُ',
    hijjaText: 'خا زیر خِ ، تا کھڑا زبر تٰ ، میم پیش مُ ، ہا پیش هُ = خِتٰمُهُ',
    rawSound: 'خِتٰمُهُ',
    category: 'khara_zabar',
    maddahFeatures: ['khara_zabar', 'harakat'],
    row: 9, col: 1, section: 3, page: 20,
    meaningOrContext: 'اس کی مہر / انجام',
    tajweedNotes: 'خِ پُر، تٰ کھڑا زبر ۱ الف مد، مُ اور هُ بغیر کھینچے۔',
    isHeavy: true,
    syllableBreakdown: ['خِ', 'تٰ', 'مُ', 'هُ']
  },
  {
    id: 542,
    word: 'مَوْءٗدَةُ',
    hijjaText: 'میم واؤ زبر مَوْ ، ہمزہ الٹا پیش ءٗ ، دال زبر دَ ، تا پیش تُ = مَوْءٗدَةُ',
    rawSound: 'مَوْءٗدَةُ',
    category: 'ulta_pesh',
    maddahFeatures: ['leen', 'ulta_pesh', 'harakat'],
    row: 9, col: 2, section: 3, page: 20,
    meaningOrContext: 'زندہ درگور کی گئی معصوم بچی',
    tajweedNotes: 'مَوْ واؤ لین نرمی سے، ءٗ الٹا پیش ۱ الف مد، دَ اور تُ جلدی۔',
    isHeavy: false,
    syllableBreakdown: ['مَوْ', 'ءٗ', 'دَ', 'ةُ']
  },
  {
    id: 543,
    word: 'يُوْعُوْنَ',
    hijjaText: 'یا واؤ پیش يُوْ ، عین واؤ پیش عُوْ ، نون زبر نَ = يُوْعُوْنَ',
    rawSound: 'يُوْعُوْنَ',
    category: 'waw',
    maddahFeatures: ['waw_maddah', 'harakat'],
    row: 9, col: 3, section: 3, page: 20,
    meaningOrContext: 'وہ جمع کرتے ہیں / دلوں میں چھپاتے ہیں',
    tajweedNotes: 'يُوْ اور عُوْ دونوں واؤ مدہ ہیں، دونوں کو ۱، ۱ الف کھینچ کر پڑھیں۔',
    isHeavy: false,
    syllableBreakdown: ['يُوْ', 'عُوْ', 'نَ']
  },
  {
    id: 544,
    word: 'كَالُوْهُمْ',
    hijjaText: 'کاف الف زبر كَا ، لام واؤ پیش لُوْ ، ہا پیش میم هُمْ = كَالُوْهُمْ',
    rawSound: 'كَالُوْهُمْ',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'waw_maddah', 'harakat'],
    row: 9, col: 4, section: 3, page: 20,
    meaningOrContext: 'انہوں نے انہیں ناپ کر دیا',
    tajweedNotes: 'كَا (الف مدہ) اور لُوْ (واؤ مدہ) دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['كَا', 'لُوْ', 'هُمْ']
  },
  {
    id: 545,
    word: 'وَسْوَاسِ',
    hijjaText: 'واؤ زبر سین وَسْ ، واؤ الف زبر وَا ، سین زیر سِ = وَسْوَاسِ',
    rawSound: 'وَسْوَاسِ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 9, col: 5, section: 3, page: 20,
    meaningOrContext: 'وسوسہ ڈالنے والا (شیطان)',
    tajweedNotes: 'سین سیٹی دار، وَا الف مدہ ۱ الف، سِ باریک۔',
    isHeavy: false,
    syllableBreakdown: ['وَسْ', 'وَا', 'سِ']
  },

  // Row 10
  {
    id: 546,
    word: 'ظَهْرِهِ',
    hijjaText: 'ظا زبر ہا ظَهْ ، را زیر رِ ، ہا زیر هِ = ظَهْرِهِ',
    rawSound: 'ظَهْرِهِ',
    category: 'short',
    maddahFeatures: ['harakat'],
    row: 10, col: 1, section: 3, page: 20,
    meaningOrContext: 'اس کی پیٹھ',
    tajweedNotes: 'ظا پُر اور نرمی سے، رِ اور هِ باریک اور جلدی۔',
    isHeavy: true,
    syllableBreakdown: ['ظَهْ', 'رِ', 'هِ']
  },
  {
    id: 547,
    word: 'قَارُوْنَ',
    hijjaText: 'قاف الف زبر قَا ، را واؤ پیش رُوْ ، نون زبر نَ = قَارُوْنَ',
    rawSound: 'قَارُوْنَ',
    category: 'mixed',
    maddahFeatures: ['alif_maddah', 'waw_maddah', 'harakat'],
    row: 10, col: 2, section: 3, page: 20,
    meaningOrContext: 'قارون (سرکش مالدار)',
    tajweedNotes: 'قَا اور رُوْ دونوں پُر اور ۱، ۱ الف مدہ کھینچ کر پڑھیں۔',
    isHeavy: true,
    syllableBreakdown: ['قَا', 'رُوْ', 'نَ']
  },
  {
    id: 548,
    word: 'وَبَنِيْهِ',
    hijjaText: 'واؤ زبر وَ ، با زبر بَ ، نون یا زیر نِيْ ، ہا زیر هِ = وَبَنِيْهِ',
    rawSound: 'وَبَنِيْهِ',
    category: 'yaa',
    maddahFeatures: ['yaa_maddah', 'harakat'],
    row: 10, col: 3, section: 3, page: 20,
    meaningOrContext: 'اور اس کے بیٹے',
    tajweedNotes: 'نِيْ یاء مدہ ۱ الف، وَ ، بَ ، هِ بغیر کھینچے۔',
    isHeavy: false,
    syllableBreakdown: ['وَ', 'بَ', 'نِيْ', 'هِ']
  },
  {
    id: 549,
    word: 'اُدْعُوْنِىْ',
    hijjaText: 'ہمزہ پیش دال اُدْ ، عین واؤ پیش عُوْ ، نون یا زیر نِيْ = اُدْعُوْنِىْ',
    rawSound: 'اُدْعُوْنِىْ',
    category: 'mixed',
    maddahFeatures: ['waw_maddah', 'yaa_maddah', 'harakat'],
    row: 10, col: 4, section: 3, page: 20,
    meaningOrContext: 'تم مجھ سے دعا مانگو / پکارو',
    tajweedNotes: 'دال ساکن پر قلقلہ، عُوْ اور نِيْ دونوں کو ۱، ۱ الف کھینچیں۔',
    isHeavy: false,
    syllableBreakdown: ['اُدْ', 'عُوْ', 'نِيْ']
  },
  {
    id: 550,
    word: 'طَعَامِهِ',
    hijjaText: 'طا زبر طَ ، عین الف زبر عَا ، میم زیر مِ ، ہا زیر هِ = طَعَامِهِ',
    rawSound: 'طَعَامِهِ',
    category: 'alif',
    maddahFeatures: ['alif_maddah', 'harakat'],
    row: 10, col: 5, section: 3, page: 20,
    meaningOrContext: 'اس کا کھانا',
    tajweedNotes: 'طَ پُر، عَا ۱ الف مدہ حلق سے، مِ اور هِ جلدی۔',
    isHeavy: true,
    syllableBreakdown: ['طَ', 'عَا', 'مِ', 'هِ']
  }
];

// Helper to get words by section
export const PAGE_20_SECTION_1 = PAGE_20_IMTIHAN_WORDS.filter(w => w.section === 1);
export const PAGE_20_SECTION_2 = PAGE_20_IMTIHAN_WORDS.filter(w => w.section === 2);
export const PAGE_20_SECTION_3 = PAGE_20_IMTIHAN_WORDS.filter(w => w.section === 3);

// Grouped rows for exact authentic 10-row grid layout
export const PAGE_20_ROWS = Array.from({ length: 10 }, (_, r) => ({
  rowNumber: r + 1,
  section: (r < 3 ? 1 : r < 6 ? 2 : 3) as 1 | 2 | 3,
  words: PAGE_20_IMTIHAN_WORDS.filter(w => w.row === r + 1)
}));
