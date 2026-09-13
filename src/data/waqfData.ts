export type WaqfRuleItem = {
  id: string;
  textNormal: string;
  textWaqf: string;
  category: 'harakat_tanween' | 'do_zabar' | 'ta_marbuta' | 'no_change' | 'imtihan';
  audioNormal?: string;
  audioWaqf?: string;
  note?: string;
};

export interface NoonQutniItem {
  id: string;
  text: string;
  وصل: string;
  وقف: string;
  surahName: string;
  ayahNumber: string;
  ruleExplanation: string;
  audioNormal?: string;
  audioWaqf?: string;
  note?: string;
}

export const WAQF_CATEGORIES = [
  { 
    id: 'harakat_tanween', 
    title: 'حرکات اور تنوین پر وقف', 
    description: 'زبر، زیر، پیش، دو زیر، اور دو پیش پر وقف کرتے وقت آخری حرف کو ساکن (جزم) کرتے ہیں۔',
    ruleBadge: 'ساکن / جزم ( ْ )'
  },
  { 
    id: 'do_zabar', 
    title: 'دو زبر پر وقف', 
    description: 'دو زبر پر وقف کرتے وقت دو زبر کو الف سے بدل کر ایک الف کی مقدار کھینچ کر پڑھتے ہیں۔',
    ruleBadge: 'الف مدہ ( َا )'
  },
  { 
    id: 'ta_marbuta', 
    title: 'گول تا (ة / ـة) پر وقف', 
    description: 'گول تا (ة) پر خواہ کوئی بھی حرکت یا تنوین ہو، وقف میں ہمیشہ ہائے ساکنہ (ہْ) بن جاتی ہے۔',
    ruleBadge: 'ہائے ساکنہ ( ہْ )'
  },
  { 
    id: 'no_change', 
    title: 'بغیر تبدیلی والے وقف', 
    description: 'حروفِ مدہ، کھڑی حرکات، یا پہلے سے ساکن حروف پر وقف کرتے وقت کوئی تبدیلی نہیں ہوتی۔',
    ruleBadge: 'بلا تبدیلی (ساکن/مدہ)'
  },
  { 
    id: 'imtihan', 
    title: 'خاص و امتحانی وقف', 
    description: 'وہ کلمات جن میں وقف کی خاص حالتیں یا مستثنیٰ قواعد لاگو ہوتے ہیں۔',
    ruleBadge: 'خاص تجویدی قاعدہ'
  }
];

// =========================================================================
// نُونِ قُطْنِی کے مخصوص کلمات و امثلہ (مستقل اور الگ مجموعہ)
// =========================================================================
export const NOON_QUTNI_ITEMS: NoonQutniItem[] = [
  { 
    id: 'nq1', 
    text: 'نُوحٌ ٱبْنَهُ', 
    وصل: 'نُوحُنِ ٱبْنَهُ', 
    وقف: 'نُوحْ',
    surahName: 'سورۃ ھود',
    ayahNumber: '۴۲',
    ruleExplanation: 'تنوین (دو پیش) کے بعد ہمزہ وصلی (الف) آنے پر تنوین کا نون ساکن گرنے سے بچانے کے لیے کسرہ (زیر: نِ) کے ساتھ پڑھا جاتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/011042.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/011_042_008.mp3',
    note: 'وصل میں: نُوْحُ نِ ابْنَہُ'
  },
  { 
    id: 'nq2', 
    text: 'قَدِيرٌ ٱلَّذِي', 
    وصل: 'قَدِيرُنِ ٱلَّذِي', 
    وقف: 'قَدِيرْ',
    surahName: 'سورۃ الملک',
    ayahNumber: '۱-۲',
    ruleExplanation: 'دو پیش کے بعد ہمزہ وصلی (الف) آنے پر وصل کی حالت میں نونِ قطنی کے ساتھ ملایا جاتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/067001.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/067_001_009.mp3',
    note: 'وصل میں: قَدِیْرُ نِ الَّذِیْ'
  },
  { 
    id: 'nq3', 
    text: 'خَيْرًا ٱلْوَصِيَّةُ', 
    وصل: 'خَيْرَنِ ٱلْوَصِيَّةُ', 
    وقف: 'خَيْرَا',
    surahName: 'سورۃ البقرۃ',
    ayahNumber: '۱۸۰',
    ruleExplanation: 'دو زبر کے بعد ہمزہ وصلی آنے پر وصل کی حالت میں نونِ قطنی کے ساتھ ملا کر پڑھا جاتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002180.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/002_180_003.mp3',
    note: 'وصل میں: خَیْرَ نِ الْوَصِیَّۃُ'
  },
  { 
    id: 'nq4', 
    text: 'مَثَلًا ٱلْقَوْمُ', 
    وصل: 'مَثَلَنِ ٱلْقَوْمُ', 
    وقف: 'مَثَلَا',
    surahName: 'سورۃ الاعراف',
    ayahNumber: '۱۷۷',
    ruleExplanation: 'تنوین کے نون کو ہمزہ وصلی کے بعد آنے والے لام ساکن سے ملا کر زیر دی جاتی ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/007177.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/007_177_002.mp3',
    note: 'وصل میں: مَثَلَ نِ الْقَوْمُ'
  },
  { 
    id: 'nq5', 
    text: 'مُنِيبٍ ٱدْخُلُوهَا', 
    وصل: 'مُنِيبِنِ ٱدْخُلُوهَا', 
    وقف: 'مُنِيبْ',
    surahName: 'سورۃ ق',
    ayahNumber: '۳۳-۳۴',
    ruleExplanation: 'تنوین کے نون کو ہمزہ وصلی گرنے کے بعد دال ساکنہ سے ملانے کے لیے زیر دی جاتی ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/050033.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/050_033_006.mp3',
    note: 'وصل میں: مُنِیْبِ نِ ادْخُلُوْهَا'
  },
  { 
    id: 'nq6', 
    text: 'مُبِينٍ ٱقْتُلُوا', 
    وصل: 'مُبِينِنِ ٱقْتُلُوا', 
    وقف: 'مُبِينْ',
    surahName: 'سورۃ یوسف',
    ayahNumber: '۸-۹',
    ruleExplanation: 'دو زیر کے بعد ہمزہ وصلی آنے پر تنوین کے نون کو زیر دے کر قاف ساکنہ سے ملایا جاتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/012008.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/012_008_017.mp3',
    note: 'وصل میں: مُبِیْنِ نِ اقْتُلُوْا'
  },
  { 
    id: 'nq7', 
    text: 'جَزَآءً ٱلْحُسْنٰى', 
    وصل: 'جَزَآءَنِ ٱلْحُسْنٰى', 
    وقف: 'جَزَآءَا',
    surahName: 'سورۃ الکہف',
    ayahNumber: '۸۸',
    ruleExplanation: 'ہمزہ پر دو زبر کے بعد لام تعریف سے ملانے کے لیے نونِ قطنی استعمال ہوتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/018088.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/018_088_006.mp3',
    note: 'وصل میں: جَزَاءَ نِ الْحُسْنٰی'
  },
  { 
    id: 'nq8', 
    text: 'عَادًا ٱلْاُولٰى', 
    وصل: 'عَادَنِ ٱلْاُولٰى', 
    وقف: 'عَادَا',
    surahName: 'سورۃ النجم',
    ayahNumber: '۵۰',
    ruleExplanation: 'دو زبر کے بعد ہمزہ وصلی آنے پر وصل میں نون قطنی کے ساتھ ملایا جاتا ہے۔',
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/053050.mp3',
    audioWaqf: 'https://audio.qurancdn.com/wbw/053_050_003.mp3',
    note: 'وصل میں: عَادَ نِ الْاُوْلٰی'
  }
];

// =========================================================================
// وقف کے کلمات و امثلہ (صرف اور صرف وقف کی ۵۱ امثلہ)
// =========================================================================
export const WAQF_ITEMS: WaqfRuleItem[] = [
  // ==========================================
  // 1. HARAKAT & TANWEEN (حرکات اور تنوین پر وقف)
  // ==========================================
  { 
    id: 'w1', 
    textNormal: 'مَا خَلَقَ', 
    textWaqf: 'مَا خَلَقْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/113002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/113002.mp3',
    note: 'زبر ساکن ہو گیا (وصل: سدیس • وقف: عفاسی)' 
  },
  { 
    id: 'w2', 
    textNormal: 'مَلِكِ النَّاسِ', 
    textWaqf: 'مَلِكِ النَّاسْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/114002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/114002.mp3',
    note: 'زیر ساکن ہو گئی (وصل: سدیس • وقف: عفاسی)' 
  },
  { 
    id: 'w3', 
    textNormal: 'لِمَا يُرِيدُ', 
    textWaqf: 'لِمَا يُرِيدْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/085016.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/085016.mp3',
    note: 'پیش ساکن ہو گیا (وصل: سدیس • وقف: عفاسی)' 
  },
  { 
    id: 'w4', 
    textNormal: 'مِنْ جُوعٍ', 
    textWaqf: 'مِنْ جُوعْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/106004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/106004.mp3',
    note: 'دو زیر ساکن ہو گئیں (وصل: سدیس • وقف: عفاسی)' 
  },
  { 
    id: 'w5', 
    textNormal: 'لَكَنُودٌ', 
    textWaqf: 'لَكَنُودْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/100006.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/100006.mp3',
    note: 'دو پیش ساکن ہو گئے (وصل: سدیس • وقف: عفاسی)' 
  },
  { 
    id: 'w6', 
    textNormal: 'فِيْ اَهْلِهِ', 
    textWaqf: 'فِيْ اَهْلِهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/084013.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/084013.mp3',
    note: 'کھڑی زیر ساکن ہا بن گئی' 
  },
  { 
    id: 'w7', 
    textNormal: 'وَامْرَاَتُهُ', 
    textWaqf: 'وَامْرَاَتُهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/111004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/111004.mp3',
    note: 'الٹا پیش ساکن ہا بن گیا' 
  },
  { 
    id: 'w8', 
    textNormal: 'اِذَا حَسَدَ', 
    textWaqf: 'اِذَا حَسَدْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/113005.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/113005.mp3',
    note: 'دال ساکن (قلقلہ)' 
  },
  { 
    id: 'w9', 
    textNormal: 'يَوْمِ الدِّيْنِ', 
    textWaqf: 'يَوْمِ الدِّيْنْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/001004.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w10', 
    textNormal: 'يَصْدُرُ النَّاسُ', 
    textWaqf: 'يَصْدُرُ النَّاسْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/099006.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/099006.mp3',
    note: 'سین ساکن' 
  },
  { 
    id: 'w11', 
    textNormal: 'مَا تَعْبُدُوْنَ', 
    textWaqf: 'مَا تَعْبُدُوْنْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/109002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/109002.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w12', 
    textNormal: 'وَاسْتَغْفِرْهُ', 
    textWaqf: 'وَاسْتَغْفِرْهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/110003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/110003.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w13', 
    textNormal: 'اِنْ كَذَّبَ', 
    textWaqf: 'اِنْ كَذَّبْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/096013.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/096013.mp3',
    note: 'با ساکن (قلقلہ)' 
  },
  { 
    id: 'w14', 
    textNormal: 'اِلٰى طَعَامِهِ', 
    textWaqf: 'اِلٰى طَعَامِهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/080024.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/080024.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w15', 
    textNormal: 'مَوَازِيْنُهُ', 
    textWaqf: 'مَوَازِيْنُهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/101006.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/101006.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16', 
    textNormal: 'مَا اَمَرَهُ', 
    textWaqf: 'مَا اَمَرَهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/080023.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/080023.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16b', 
    textNormal: 'بِهِ', 
    textWaqf: 'بِهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/100004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/100004.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16c', 
    textNormal: 'عِبَادِهِ', 
    textWaqf: 'عِبَادِهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/042027.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/042027.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16d', 
    textNormal: 'رَبِّهِ', 
    textWaqf: 'رَبِّهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/100006.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/100006.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16e', 
    textNormal: 'بِاَمْرِهِ', 
    textWaqf: 'بِاَمْرِهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/016002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/016002.mp3',
    note: 'ہا ساکن' 
  },
  { 
    id: 'w16f', 
    textNormal: 'اَخْلَدَهُ', 
    textWaqf: 'اَخْلَدَهْ', 
    category: 'harakat_tanween', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/104003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/104003.mp3',
    note: 'ہا ساکن' 
  },

  // ==========================================
  // 3. DO ZABAR (دو زبر پر وقف)
  // ==========================================
  { 
    id: 'w17', 
    textNormal: 'كَانَ تَوَّابًا', 
    textWaqf: 'كَانَ تَوَّابَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/110003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/110003.mp3',
    note: 'دو زبر الف سے بدل گیا' 
  },
  { 
    id: 'w18', 
    textNormal: 'شَهِيْدًا', 
    textWaqf: 'شَهِيْدَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/048028.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/048028.mp3',
    note: 'دو زبر الف سے بدل گیا' 
  },
  { 
    id: 'w19', 
    textNormal: 'دَكًّا دَكًّا', 
    textWaqf: 'دَكًّا دَكَّا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/089021.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/089021.mp3',
    note: 'آخری دو زبر الف سے بدل گیا' 
  },
  { 
    id: 'w19a', 
    textNormal: 'عَدْنًا', 
    textWaqf: 'عَدْنَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/019061.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/019061.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19b', 
    textNormal: 'اَلْفَافًا', 
    textWaqf: 'اَلْفَافَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/078016.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/078016.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19c', 
    textNormal: 'نَبِيًّا', 
    textWaqf: 'نَبِيَّا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/019030.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/019030.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19d', 
    textNormal: 'خَيْرًا', 
    textWaqf: 'خَيْرَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/099007.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/099007.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19e', 
    textNormal: 'شَيْئًا', 
    textWaqf: 'شَيْئَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/018071.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/018071.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19f', 
    textNormal: 'خَبِيْرًا', 
    textWaqf: 'خَبِيْرَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/017017.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/017017.mp3',
    note: 'الف مدہ کی مقدار کھینچیں' 
  },
  { 
    id: 'w19g', 
    textNormal: 'عَلِيْمًا حَكِيْمًا', 
    textWaqf: 'عَلِيْمًا حَكِيْمَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/004011.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/004011.mp3',
    note: 'وقف میں حَكِیْمَا' 
  },
  { 
    id: 'w19h', 
    textNormal: 'غَفُوْرًا رَّحِيْمًا', 
    textWaqf: 'غَفُوْرًا رَّحِيْمَا', 
    category: 'do_zabar', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/004023.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/004023.mp3',
    note: 'وقف میں رَحِیْمَا' 
  },

  // ==========================================
  // 4. TA MARBUTA (گول تا ة پر وقف)
  // ==========================================
  { 
    id: 'w20', 
    textNormal: 'مِنْ قُوَّةٍ', 
    textWaqf: 'مِنْ قُوَّهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/030054.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/030054.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w21', 
    textNormal: 'لُمَزَةٍ', 
    textWaqf: 'لُمَزَهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/104001.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/104001.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w22', 
    textNormal: 'مِثْقَالَ ذَرَّةٍ', 
    textWaqf: 'مِثْقَالَ ذَرَّهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/099007.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/099007.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25', 
    textNormal: 'نَارٌ حَامِيَةٌ', 
    textWaqf: 'نَارٌ حَامِيَهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/101011.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/101011.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25a', 
    textNormal: 'قُوَّةٌ', 
    textWaqf: 'قُوَّهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002165.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002165.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25b', 
    textNormal: 'رَقَبَةٍ', 
    textWaqf: 'رَقَبَهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/090013.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/090013.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25c', 
    textNormal: 'جَارِيَةٌ', 
    textWaqf: 'جَارِيَهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/088012.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/088012.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25d', 
    textNormal: 'اَلْوَصِيَّةُ', 
    textWaqf: 'اَلْوَصِيَّهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002180.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002180.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25e', 
    textNormal: 'الْقَارِعَةُ', 
    textWaqf: 'الْقَارِعَهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/101001.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/101001.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },
  { 
    id: 'w25f', 
    textNormal: 'الصَّاخَّةُ', 
    textWaqf: 'الصَّاخَّهْ', 
    category: 'ta_marbuta', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/080033.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/080033.mp3',
    note: 'گول تا ہا ساکن بن گئی' 
  },

  // ==========================================
  // 5. NO CHANGE (بغیر تبدیلی والے وقف)
  // ==========================================
  { 
    id: 'w26', 
    textNormal: 'اَوْحٰى لَهَا', 
    textWaqf: 'اَوْحٰى لَهَا', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/099005.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/099005.mp3',
    note: 'الف مدہ پر بلا تبدیلی' 
  },
  { 
    id: 'w27', 
    textNormal: 'وَمَا نَقَمُوْا', 
    textWaqf: 'وَمَا نَقَمُوْا', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/085008.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/085008.mp3',
    note: 'واؤ مدہ پر بلا تبدیلی' 
  },
  { 
    id: 'w28', 
    textNormal: 'تَجْرِيْ', 
    textWaqf: 'تَجْرِيْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/085011.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/085011.mp3',
    note: 'یا مدہ پر بلا تبدیلی' 
  },
  { 
    id: 'w29', 
    textNormal: 'وَتَوَاصَوْا', 
    textWaqf: 'وَتَوَاصَوْا', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/103003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/103003.mp3',
    note: 'واؤ لین ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w30', 
    textNormal: 'مَا اَغْنٰى', 
    textWaqf: 'مَا اَغْنٰى', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/111002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/111002.mp3',
    note: 'کھڑا زبر پر بلا تبدیلی' 
  },
  { 
    id: 'w31', 
    textNormal: 'لَمْ يَلِدْ', 
    textWaqf: 'لَمْ يَلِدْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/112003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w32', 
    textNormal: 'فَذَكِّرْ', 
    textWaqf: 'فَذَكِّرْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/088021.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/088021.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w33', 
    textNormal: 'عَلَيْهِمْ', 
    textWaqf: 'عَلَيْهِمْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001007.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w33a', 
    textNormal: 'وَتَوَلّٰى', 
    textWaqf: 'وَتَوَلّٰى', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/080001.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/080001.mp3',
    note: 'کھڑا زبر پر بلا تبدیلی' 
  },
  { 
    id: 'w33b', 
    textNormal: 'مِنَ الْاُوْلٰى', 
    textWaqf: 'مِنَ الْاُوْلٰى', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/093004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/093004.mp3',
    note: 'کھڑا زبر پر بلا تبدیلی' 
  },
  { 
    id: 'w33c', 
    textNormal: 'فَتَرْضٰى', 
    textWaqf: 'فَتَرْضٰى', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/093005.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/093005.mp3',
    note: 'کھڑا زبر پر بلا تبدیلی' 
  },
  { 
    id: 'w33d', 
    textNormal: 'وَانْحَرْ', 
    textWaqf: 'وَانْحَرْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/108002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/108002.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w33e', 
    textNormal: 'فَارْغَبْ', 
    textWaqf: 'فَارْغَبْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/094008.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/094008.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w33f', 
    textNormal: 'فَحَدِّثْ', 
    textWaqf: 'فَحَدِّثْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/093011.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/093011.mp3',
    note: 'پہلے سے ساکن پر بلا تبدیلی' 
  },
  { 
    id: 'w33g', 
    textNormal: 'فِيْهَا', 
    textWaqf: 'فِيْهَا', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/098003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/098003.mp3',
    note: 'الف مدہ پر بلا تبدیلی' 
  },
  { 
    id: 'w33h', 
    textNormal: 'تَهْتَدُوْا', 
    textWaqf: 'تَهْتَدُوْا', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002053.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002053.mp3',
    note: 'واؤ مدہ پر بلا تبدیلی' 
  },
  { 
    id: 'w33i', 
    textNormal: 'قُوْلِيْ', 
    textWaqf: 'قُوْلِيْ', 
    category: 'no_change', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/019026.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/019026.mp3',
    note: 'یا مدہ پر بلا تبدیلی' 
  },

  // ==========================================
  // 6. IMTIHAN (امتحان و جامع مشق)
  // ==========================================
  { 
    id: 'w34', 
    textNormal: 'صِدْقِيْنَ', 
    textWaqf: 'صِدْقِيْنْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002023.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002023.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w35', 
    textNormal: 'مُسْتَقِيْمٌ', 
    textWaqf: 'مُسْتَقِيْمْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001006.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/001006.mp3',
    note: 'میم ساکن' 
  },
  { 
    id: 'w36', 
    textNormal: 'نَدِمِيْنَ', 
    textWaqf: 'نَدِمِيْنْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/005031.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/005031.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w37', 
    textNormal: 'شَفَتَيْنِ', 
    textWaqf: 'شَفَتَيْنْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/090009.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/090009.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w38', 
    textNormal: 'نَسْتَعِيْنُ', 
    textWaqf: 'نَسْتَعِيْنْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001005.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3',
    note: 'نون ساکن' 
  },
  { 
    id: 'w39', 
    textNormal: 'بِالْحَقِّ', 
    textWaqf: 'بِالْحَقْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/103003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/103003.mp3',
    note: 'قاف مشدد ساکن (قلقلہ اکبر)' 
  },
  { 
    id: 'w40', 
    textNormal: 'يَشَآءُ', 
    textWaqf: 'يَشَآءْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002105.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002105.mp3',
    note: 'ہمزہ ساکنہ' 
  },
  { 
    id: 'w41', 
    textNormal: 'مِنْ قَبْلُ', 
    textWaqf: 'مِنْ قَبْلْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002025.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002025.mp3',
    note: 'لام ساکن' 
  },
  { 
    id: 'w42', 
    textNormal: 'شَيْءٍ', 
    textWaqf: 'شَيْءْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/067001.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/067001.mp3',
    note: 'ہمزہ ساکنہ' 
  },
  { 
    id: 'w43', 
    textNormal: 'شَهْرٌ', 
    textWaqf: 'شَهْرْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/097003.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/097003.mp3',
    note: 'را ساکن' 
  },
  { 
    id: 'w44', 
    textNormal: 'قِسْطٌ', 
    textWaqf: 'قِسْطْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/021047.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/021047.mp3',
    note: 'طا ساکن (قلقلہ)' 
  },
  { 
    id: 'w45', 
    textNormal: 'لَهُوْ', 
    textWaqf: 'لَهُوْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/112004.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/112004.mp3',
    note: 'الٹا پیش بلا تبدیلی' 
  },
  { 
    id: 'w46', 
    textNormal: 'بَرْقٌ', 
    textWaqf: 'بَرْقْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002019.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002019.mp3',
    note: 'قاف ساکن (قلقلہ)' 
  },
  { 
    id: 'w47', 
    textNormal: 'قَدِيْرٌ', 
    textWaqf: 'قَدِيْرْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/067001.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/067001.mp3',
    note: 'را ساکن' 
  },
  { 
    id: 'w48', 
    textNormal: 'اَنْعَمْتَ', 
    textWaqf: 'اَنْعَمْتْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001007.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3',
    note: 'تا لمبی ساکن' 
  },
  { 
    id: 'w49', 
    textNormal: 'لَهُمْ جَنّٰتٌ', 
    textWaqf: 'لَهُمْ جَنّٰتْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002025.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002025.mp3',
    note: 'تا لمبی ساکن' 
  },
  { 
    id: 'w50', 
    textNormal: 'اَلسَّمَآءِ', 
    textWaqf: 'اَلسَّمَآءْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/002019.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/002019.mp3',
    note: 'ہمزہ ساکنہ مد کے ساتھ' 
  },
  { 
    id: 'w51', 
    textNormal: 'اَلَّذِيْ', 
    textWaqf: 'اَلَّذِيْ', 
    category: 'imtihan', 
    audioNormal: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/067002.mp3',
    audioWaqf: 'https://everyayah.com/data/Alafasy_128kbps/067002.mp3',
    note: 'یا مدہ بلا تبدیلی' 
  }
];
