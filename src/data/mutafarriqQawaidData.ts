export interface MutafarriqRuleItem {
  id: string;
  arabic: string;
  category: 'izhar_mutlaq' | 'saktah' | 'sad_sin' | 'tasheel' | 'imalah' | 'bisa_lismu';
  categoryTitleUrdu: string;
  surahRefUrdu: string;
  explanationUrdu: string;
  spellingHijja: string;
  pronunciationUrdu: string;
  audioText: string;
  ruleDetailUrdu?: string;
  audioAyahRef?: { surah: number; ayah: number };
  wbwAudioUrls?: string[];
  customAudioUrl?: string;
}

export interface MutafarriqCategoryGroup {
  id: 'izhar_mutlaq' | 'saktah' | 'sad_sin' | 'tasheel' | 'imalah' | 'bisa_lismu';
  titleUrdu: string;
  titleArabic: string;
  badgeBg: string;
  badgeText: string;
  gradientBorder: string;
  definitionUrdu: string;
  items: MutafarriqRuleItem[];
}

// 1. IZHAR MUTLAQ (اظهار مطلق)
export const IZHAR_MUTLAQ_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'izhar_mutlaq_1',
    arabic: 'دُنْيَا',
    category: 'izhar_mutlaq',
    categoryTitleUrdu: 'اظہارِ مطلق',
    surahRefUrdu: 'پ ۲، البقرة ۸۵',
    explanationUrdu: 'نون ساکن کے بعد یا ایک ہی کلمے میں آنے کی وجہ سے اظہارِ مطلق ہوگا، بغیر غنہ کے صاف پڑھیں۔',
    spellingHijja: 'دال پیش دُ ، نون ساکن دُنْ ، یا الف زبر یَا = دُنْیَا',
    pronunciationUrdu: 'دُنْیَا (بغیر غنہ کے باظہار)',
    audioText: 'دُنْيَا',
    audioAyahRef: { surah: 2, ayah: 85 },
    customAudioUrl: '/audio/dunya.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/002_085_012.mp3']
  },
  {
    id: 'izhar_mutlaq_2',
    arabic: 'بُنْيَانٌ',
    category: 'izhar_mutlaq',
    categoryTitleUrdu: 'اظہارِ مطلق',
    surahRefUrdu: 'پ ۲۸، الصف ۴',
    explanationUrdu: 'نون ساکن کے بعد حروفِ یرملون (یا) ایک کلمے میں ہے، لہذا ادغام نہیں ہوگا بلکہ اظہارِ مطلق ہوگا۔',
    spellingHijja: 'با پیش بُ ، نون ساکن بُنْ ، یا الف زبر یَا ، نون دو پیش نٌ = بُنْیَانٌ',
    pronunciationUrdu: 'بُنْیَانٌ (اظہارِ مطلق)',
    audioText: 'بُنْيَانٌ',
    audioAyahRef: { surah: 61, ayah: 4 },
    customAudioUrl: 'https://audio.qurancdn.com/wbw/061_004_006.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/061_004_006.mp3']
  },
  {
    id: 'izhar_mutlaq_3',
    arabic: 'صِنْوَانٌ',
    category: 'izhar_mutlaq',
    categoryTitleUrdu: 'اظہارِ مطلق',
    surahRefUrdu: 'پ ۱۳، الرعد ۴',
    explanationUrdu: 'نون ساکن کے بعد واؤ ایک ہی کلمے میں آیا ہے، اس لیے غنہ اور ادغام نہیں کریں گے۔',
    spellingHijja: 'صاد زیر صِ ، نون ساکن صِنْ ، واؤ الف زبر وَا ، نون دو پیش نٌ = صِنْوَانٌ',
    pronunciationUrdu: 'صِنْوَانٌ (بغیر غنہ کے)',
    audioText: 'صِنْوَانٌ',
    audioAyahRef: { surah: 13, ayah: 4 },
    customAudioUrl: 'https://audio.qurancdn.com/wbw/013_004_021.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/013_004_021.mp3']
  },
  {
    id: 'izhar_mutlaq_4',
    arabic: 'قِنْوَانٌ',
    category: 'izhar_mutlaq',
    categoryTitleUrdu: 'اظہارِ مطلق',
    surahRefUrdu: 'پ ۷، الانعام ۹۹',
    explanationUrdu: 'نون ساکن کے بعد واؤ ایک کلمے میں ہے، غنہ کے بغیر نون ساکن کو ظاہر کر کے پڑھیں۔',
    spellingHijja: 'قاف زیر قِ ، نون ساکن قِنْ ، واؤ الف زبر وَا ، نون دو پیش نٌ = قِنْوَانٌ',
    pronunciationUrdu: 'قِنْوَانٌ (اظہارِ مطلق)',
    audioText: 'قِنْوَانٌ',
    audioAyahRef: { surah: 6, ayah: 99 },
    customAudioUrl: 'https://audio.qurancdn.com/wbw/006_099_023.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/006_099_023.mp3']
  }
];

// 2. SAKTAH (سکتہ)
export const SAKTAH_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'saktah_1',
    arabic: 'عِوَجًا ۜ قَيِّمًا',
    category: 'saktah',
    categoryTitleUrdu: 'سکتہ واجبہ',
    surahRefUrdu: 'پ ۱۵، الكهف ۱-۲',
    explanationUrdu: 'کلمہ "عِوَجًا" پر آواز روک کر بغیر سانس توڑے اگلا لفظ "قَيِّمًا" پڑھنا واجب ہے۔',
    spellingHijja: 'عِوَجًا پر سکتہ: دو زبر کو الف سے بدل کر "عِوَجَا" بولیں، آواز روک کر بغیر سانس کے "قَيِّمًا" پڑھیں',
    pronunciationUrdu: 'عِوَجَا (سکتہ) قَيِّمًا',
    audioText: 'عِوَجًا ۜ قَيِّمًا',
    audioAyahRef: { surah: 18, ayah: 1 },
    customAudioUrl: '/audio/iwaja_qayyima.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/018_001_011.mp3', 'https://audio.qurancdn.com/wbw/018_002_001.mp3']
  },
  {
    id: 'saktah_2',
    arabic: 'مِنْ مَّرْقَدِنَا ۜ هٰذَا',
    category: 'saktah',
    categoryTitleUrdu: 'سکتہ واجبہ',
    surahRefUrdu: 'پ ۲۳، يس ۵۲',
    explanationUrdu: 'کلمہ "مَّرْقَدِنَا" پر سانس توڑے۔ بغیر آواز کو ایک لمحہ روک کر "هٰذَا" پڑھیں۔',
    spellingHijja: 'مَّرْقَدِنَا پر سکتہ: نون الف زبر نَا پر آواز کا بریک لیں اور سانس جاری رکھتے ہوئے هٰذَا پڑھیں',
    pronunciationUrdu: 'مِنْ مَّرْقَدِنَا (سکتہ) هٰذَا',
    audioText: 'مِنْ مَّرْقَدِنَا ۜ هٰذَا',
    audioAyahRef: { surah: 36, ayah: 52 },
    customAudioUrl: '/audio/min_marqadina_haza.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/036_052_006.mp3', 'https://audio.qurancdn.com/wbw/036_052_007.mp3', 'https://audio.qurancdn.com/wbw/036_052_008.mp3']
  },
  {
    id: 'saktah_3',
    arabic: 'كَلَّا بَلْ ۜ رَانَ',
    category: 'saktah',
    categoryTitleUrdu: 'سکتہ واجبہ',
    surahRefUrdu: 'پ ۳۰، المطففين ۱۴',
    explanationUrdu: 'کلمہ "بَلْ" پر نون یا لام کا ادغام نہیں کریں گے، بلکہ لام پر آواز روک کر سانس لیے بغیر "رَانَ" پڑھیں گے۔',
    spellingHijja: 'بَلْ پر سکتہ: لام ساکن پر آواز روک کر سانس توڑے۔ بغیر رَانَ ادا کریں',
    pronunciationUrdu: 'كَلَّا بَلْ (سکتہ) رَانَ',
    audioText: 'كَلَّا بَلْ ۜ رَانَ',
    audioAyahRef: { surah: 83, ayah: 14 },
    customAudioUrl: '/audio/kalla_bal_rana.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/083_014_001.mp3', 'https://audio.qurancdn.com/wbw/083_014_002.mp3', 'https://audio.qurancdn.com/wbw/083_014_003.mp3']
  },
  {
    id: 'saktah_4',
    arabic: 'وَقِيْلَ مَنْ ۜ رَاقٍ',
    category: 'saktah',
    categoryTitleUrdu: 'سکتہ واجبہ',
    surahRefUrdu: 'پ ۲۹، القيمة ۲۷',
    explanationUrdu: 'نون ساکن کے بعد را آنے کے باوجود ادغام نہیں ہوگا، "مَنْ" پر سکتہ کر کے "رَاقٍ" پڑھیں۔',
    spellingHijja: 'مَنْ پر سکتہ: نون ساکن کی آواز روکیں، سانس نعمہ رکھیں اور رَاقٍ ادا کریں',
    pronunciationUrdu: 'وَقِيْلَ مَنْ (سکتہ) رَاقٍ',
    audioText: 'وَقِيْلَ مَنْ ۜ رَاقٍ',
    audioAyahRef: { surah: 75, ayah: 27 },
    customAudioUrl: '/audio/waqeela_man_raq.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/075_027_001.mp3', 'https://audio.qurancdn.com/wbw/075_027_002.mp3', 'https://audio.qurancdn.com/wbw/075_027_003.mp3']
  }
];

// 3. SAD / SIN RULES (ص پر س کے قواعد)
export const SAD_SIN_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'sad_sin_1',
    arabic: 'يَبْصُطُ',
    category: 'sad_sin',
    categoryTitleUrdu: 'ص پر س (صرف س)',
    surahRefUrdu: 'پ ۲، البقرة ۲۴۵',
    explanationUrdu: 'صاد کے اوپر چھوٹا سین لکھا ہے، اس کلمے میں صرف سین (س) کے ساتھ "يَبْسُطُ" پڑھنا واجب ہے۔',
    spellingHijja: 'يَبْسُطُ - یا زبر یَ، با ساکن یَبْ، سین پیش سُ، طا پیش طُ = یَبْسُطُ',
    pronunciationUrdu: 'يَبْسُطُ (صرف سین سے)',
    audioText: 'يَبْصُطُ',
    ruleDetailUrdu: '① صرف سین (س) پڑھیں',
    audioAyahRef: { surah: 2, ayah: 245 },
    customAudioUrl: 'https://audio.qurancdn.com/wbw/002_245_013.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/002_245_013.mp3']
  },
  {
    id: 'sad_sin_2',
    arabic: 'بَصْطَةً',
    category: 'sad_sin',
    categoryTitleUrdu: 'ص پر س (صرف س)',
    surahRefUrdu: 'پ ۸، الاعراف ۶۹',
    explanationUrdu: 'صاد کے اوپر چھوٹا سین ہے، اس کلمے میں صرف سین (س) کے ساتھ "بَسْطَةً" پڑھا جائے گا۔',
    spellingHijja: 'بَسْطَةً - با سین زبر بَسْ، طا زبر طَ، تا دو زبر طَاً = بَسْطَةً',
    pronunciationUrdu: 'بَسْطَةً (صرف سین سے)',
    audioText: 'بَصْطَةً',
    ruleDetailUrdu: '② صرف سین (س) پڑھیں',
    audioAyahRef: { surah: 7, ayah: 69 },
    customAudioUrl: '/audio/bastatan.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/007_069_023.mp3']
  },
  {
    id: 'sad_sin_3',
    arabic: 'أَمْ هُمُ الْمُصَيْطِرُونَ',
    category: 'sad_sin',
    categoryTitleUrdu: 'ص پر س (ص و س دونوں)',
    surahRefUrdu: 'پ ۲۷، الطور ۳۷',
    explanationUrdu: 'صاد کے اوپر سین لکھا ہے۔ اس کلمے کو (ص) اور (س) دونوں طرح پڑھنا جائز ہے (المُصَيْطِرُونَ / المُسَيْطِرُونَ)۔',
    spellingHijja: 'الْمُصَيْطِرُونَ یا الْمُسَيْطِرُونَ - دونوں قرأتیں درست ہیں',
    pronunciationUrdu: 'الْمُصَيْطِرُونَ (صاد و سین دونوں جائز)',
    audioText: 'أَمْ هُمُ الْمُصَيْطِرُونَ',
    ruleDetailUrdu: '③ (ص) اور (س) دونوں جائز',
    audioAyahRef: { surah: 52, ayah: 37 },
    customAudioUrl: '/audio/am_humul_musaitiroon.mp3',
    wbwAudioUrls: [
      'https://audio.qurancdn.com/wbw/052_037_005.mp3',
      'https://audio.qurancdn.com/wbw/052_037_006.mp3',
      'https://audio.qurancdn.com/wbw/052_037_007.mp3'
    ]
  },
  {
    id: 'sad_sin_4',
    arabic: 'بِمُصَيْطِرٍ',
    category: 'sad_sin',
    categoryTitleUrdu: 'ص کے نیچے س (صرف ص)',
    surahRefUrdu: 'پ ۳۰، الغاشية ۲۲',
    explanationUrdu: 'صاد کے نیچے چھوٹا سین لکھا ہے۔ اس کلمے کو صرف صاد (ص) سے "بِمُصَيْطِرٍ" پڑھا جائے گا، سین سے نہیں پڑھ سکتے۔',
    spellingHijja: 'بِمُصَيْطِرٍ - با زیر بـِ، میم پیش مُ، صاد یا زبر صَیْ، طا زیر طِ، را دو زیر رٍ',
    pronunciationUrdu: 'بِمُصَيْطِرٍ (صرف صاد سے)',
    audioText: 'بِمُصَيْطِرٍ',
    ruleDetailUrdu: '④ صرف صاد (ص) پڑھیں',
    audioAyahRef: { surah: 88, ayah: 22 },
    customAudioUrl: 'https://audio.qurancdn.com/wbw/088_022_003.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/088_022_003.mp3']
  }
];

// 4. TASHEEL (تسهيل)
export const TASHEEL_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'tasheel_1',
    arabic: 'ءَأَعْجَمِيٌّ وَعَرَبِيٌّ',
    category: 'tasheel',
    categoryTitleUrdu: 'تَسْهِيْلٌ',
    surahRefUrdu: 'پ ۲۴، حم السجده (فصلت) ۴۴',
    explanationUrdu: 'تسهیل کے معنی نرمی کرنے کے ہیں۔ دوسرے ہمزہ کو نرمی سے ادا کریں۔ قرآن میں صرف اسی ایک کلمے میں تسهیل واجب ہے۔',
    spellingHijja: 'ءَ [ہمزہ مسہلہ] عْجَمِيٌّ - دوسرے ہمزہ کو بغیر جھٹکے کے نرمی سے ادا کریں',
    pronunciationUrdu: 'ءَأَعْجَمِيٌّ (دوسرا ہمزہ نرم پڑھیں)',
    audioText: 'ءَأَعْجَمِيٌّ وَعَرَبِيٌّ',
    ruleDetailUrdu: 'تسهیل واجب (دوسرے ہمزہ میں)',
    audioAyahRef: { surah: 41, ayah: 44 },
    customAudioUrl: '/audio/aajamiyyun_v2.mp3',
    wbwAudioUrls: [
      'https://audio.qurancdn.com/wbw/041_044_010.mp3',
      'https://audio.qurancdn.com/wbw/041_044_011.mp3'
    ]
  }
];

// 5. IMALAH (امالہ)
export const IMALAH_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'imalah_1',
    arabic: 'مَجْرٰىهَا',
    category: 'imalah',
    categoryTitleUrdu: 'إِمَالَهْ',
    surahRefUrdu: 'پ ۱۲، ہود ۴۱',
    explanationUrdu: 'زبر کو زیر اور الف کو یا کی طرف مائل کرنے کو امالہ کہتے ہیں۔ را کو "ری" نہیں بلکہ "رے" کی طرح پڑھیں۔',
    spellingHijja: 'میم جیم زبر مَجْ ، را امالہ والی رے مَجْرٰ ، ھا الف زبر ھَا = مَجْرٰىهَا',
    pronunciationUrdu: 'مَجْرٰىهَا ("رے" کی طرح امالہ)',
    audioText: 'مَجْرٰىهَا',
    ruleDetailUrdu: 'امالہ واجب (را امالہ والی رے)',
    audioAyahRef: { surah: 11, ayah: 41 },
    customAudioUrl: '/audio/majreeha.mp3',
    wbwAudioUrls: ['https://audio.qurancdn.com/wbw/011_041_007.mp3']
  }
];

// 6. BISA LISMU (بئس الاسم)
export const BISA_LISMU_ITEMS: MutafarriqRuleItem[] = [
  {
    id: 'bisa_lismu_1',
    arabic: 'بِئْسَ الاِسْمُ الْفُسُوقُ',
    category: 'bisa_lismu',
    categoryTitleUrdu: 'بِئْسَ الاِسْمُ',
    surahRefUrdu: 'پ ۲۶، الحجرات ۱۱',
    explanationUrdu: 'اس کلمے میں لام سے پہلے اور بعد کے الف کو حذف کر کے لام کو زیر دے کر "بِئْسَ لِلِاسْمُ" پڑھیں گے۔',
    spellingHijja: 'با ہمزہ زیر بِئْ، سین زبر سَ، لام زیر لِ، سین ساکن لِسْ، میم پیش مُ = بِئْسَ لِلِاسْمُ',
    pronunciationUrdu: 'بِئْسَ لِلِاسْمُ الْفُسُوْقُ',
    audioText: 'بِئْسَ الاِسْمُ الْفُسُوقُ',
    ruleDetailUrdu: 'لام کو زیر دیں (بِئْسَ لِلِاسْمُ)',
    audioAyahRef: { surah: 49, ayah: 11 },
    customAudioUrl: '/audio/bisa_lismu_fusuq_v3.mp3',
    wbwAudioUrls: [
      'https://audio.qurancdn.com/wbw/049_011_031.mp3',
      'https://audio.qurancdn.com/wbw/049_011_032.mp3',
      'https://audio.qurancdn.com/wbw/049_011_033.mp3'
    ]
  }
];

// ALL MUTAFARRIQ ITEMS
export const ALL_MUTAFARRIQ_ITEMS: MutafarriqRuleItem[] = [
  ...IZHAR_MUTLAQ_ITEMS,
  ...SAKTAH_ITEMS,
  ...SAD_SIN_ITEMS,
  ...TASHEEL_ITEMS,
  ...IMALAH_ITEMS,
  ...BISA_LISMU_ITEMS
];

// GROUP DEFINITIONS
export const MUTAFARRIQ_GROUPS: MutafarriqCategoryGroup[] = [
  {
    id: 'izhar_mutlaq',
    titleUrdu: '۱. اِظْهَارِ مُطْلَقٌ (Izhar Mutlaq)',
    titleArabic: 'إِظْهَارِ مُطْلَقٌ',
    badgeBg: 'bg-emerald-500/20 border-emerald-400',
    badgeText: 'text-emerald-300',
    gradientBorder: 'border-emerald-500/50',
    definitionUrdu: 'ان چار کلمات میں نون ساکن کے بعد حروفِ یرملون ایک کلمے میں آنے کی وجہ سے ادغام نہیں بلکہ اظہارِ مطلق ہوگا، اس لیے ان چاروں کلمات میں غنہ نہ کریں۔',
    items: IZHAR_MUTLAQ_ITEMS
  },
  {
    id: 'saktah',
    titleUrdu: '۲. سَكْتَهْ (Saktah - 4 Mandatory Pauses)',
    titleArabic: 'سَكْتَهْ وَاجِبَهْ',
    badgeBg: 'bg-amber-500/20 border-amber-400',
    badgeText: 'text-amber-300',
    gradientBorder: 'border-amber-500/50',
    definitionUrdu: 'آواز روک کر سانس لیے بغیر آگے پڑھنے کو سکتہ کہتے ہیں (آواز رک جائے اور سانس جاری رہے)۔ ان چار کلمات میں سکتہ واجب ہے۔',
    items: SAKTAH_ITEMS
  },
  {
    id: 'sad_sin',
    titleUrdu: '۳. ص / س (Sād & Sīn - 4 Words)',
    titleArabic: 'صَادْ پر سِيْنْ کے قواعد',
    badgeBg: 'bg-cyan-500/20 border-cyan-400',
    badgeText: 'text-cyan-300',
    gradientBorder: 'border-cyan-500/50',
    definitionUrdu: 'قرآن میں ۴ کلمات صاد سے لکھے ہیں اور صاد پر یا نیچے ایک سین بھی ہے: (۱) و (۲) میں صرف س، (۳) میں ص اور س دونوں جائز، (۴) میں صرف ص پڑھیں۔',
    items: SAD_SIN_ITEMS
  },
  {
    id: 'tasheel',
    titleUrdu: '۴. تَسْهِيْلٌ (Tasheel)',
    titleArabic: 'تَسْهِيْلٌ',
    badgeBg: 'bg-teal-500/20 border-teal-400',
    badgeText: 'text-teal-300',
    gradientBorder: 'border-teal-500/50',
    definitionUrdu: 'تسهیل کے معنی نرمی کرنے کے ہیں۔ یعنی دوسرے ہمزہ کو نرمی کے ساتھ ادا کریں۔ قرآن پاک میں صرف اسی ایک کلمے میں تسهیل واجب ہے۔',
    items: TASHEEL_ITEMS
  },
  {
    id: 'imalah',
    titleUrdu: '۵. إِمَالَهْ (Imalah)',
    titleArabic: 'إِمَالَهْ',
    badgeBg: 'bg-rose-500/20 border-rose-400',
    badgeText: 'text-rose-300',
    gradientBorder: 'border-rose-500/50',
    definitionUrdu: 'زبر کو زیر اور الف کو یا کی طرف مائل کرنے کو امالہ کہتے ہیں۔ را کو "ری" نہیں بلکہ اردو لفظ قطرے کی را کی طرح "رے" پڑھیں۔',
    items: IMALAH_ITEMS
  },
  {
    id: 'bisa_lismu',
    titleUrdu: '۶. بِئْسَ الاِسْمُ الْفُسُوقُ',
    titleArabic: 'بِئْسَ الاِسْمُ',
    badgeBg: 'bg-purple-500/20 border-purple-400',
    badgeText: 'text-purple-300',
    gradientBorder: 'border-purple-500/50',
    definitionUrdu: 'اس کلمے میں لام سے پہلے اور بعد کے دونوں الف نہ پڑھیں بلکہ لام کو زیر دے کر "بِئْسَ لِلِاسْمُ" پڑھیں۔',
    items: BISA_LISMU_ITEMS
  }
];
