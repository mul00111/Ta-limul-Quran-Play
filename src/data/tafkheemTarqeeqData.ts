export interface TafkheemTarqeeqWord {
  id: string;
  arabic: string;
  urduTranslation: string;
  spellingHijja: string;
  letterType: 'alif' | 'laam' | 'raa';
  ruleType: 'tafkheem' | 'tarqeeq' | 'jawaz';
  category: 
    | 'alif_pur' 
    | 'alif_bareek' 
    | 'laam_jalalat_pur' 
    | 'laam_jalalat_bareek' 
    | 'laam_aam_bareek' 
    | 'raa_pur_harakat' 
    | 'raa_pur_aarizi_zer' 
    | 'raa_pur_mutaalliya' 
    | 'raa_bareek';
  ruleUrdu: string;
  explanation: string;
}

export const tafkheemTarqeeqRules = [
  {
    id: 'alif',
    title: 'اَلِفْ کے قواعد (پُر و باریک)',
    summary: 'الف سے پہلے اگر پُر حرف (حروف مستعلیہ یا را پُر) آئے تو الف کو پُر پڑھیں گے، اور باریک حرف آئے تو الف کو باریک پڑھیں گے۔',
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-400'
  },
  {
    id: 'laam',
    title: 'لَامْ کے قواعد (اسمِ جلالت و عام لام)',
    summary: 'اسم جلالت "اللہ" کے لام سے پہلے زبر یا پیش ہو تو لام کو پُر، اور زیر ہو تو باریک پڑھیں۔ اسم جلالت کے علاوہ باقی تمام لام ہمیشہ باریک پڑھے جاتے ہیں۔',
    color: 'from-emerald-600 to-teal-700',
    borderColor: 'border-emerald-400'
  },
  {
    id: 'raa_pur',
    title: 'رَا کو پُر (موٹا) پڑھنے کے قواعد',
    summary: 'را پر زبر، پیش، دو زبر، دو پیش، کھڑا زبر ہو یا را ساکن سے پہلے زبر، پیش، عارضی زیر ہو، یا را ساکن کے بعد حرفِ مستعلیہ آئے تو را کو پُر پڑھیں گے۔',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-400'
  },
  {
    id: 'raa_bareek',
    title: 'رَا کو باریک پڑھنے کے قواعد',
    summary: 'را کے نیچے زیر یا دو زیر ہوں، را ساکن سے پہلے زیر اصلی اسی کلمے میں ہو، یا را ساکن سے پہلے یائے ساکنہ ہو تو را کو باریک پڑھیں گے۔',
    color: 'from-teal-600 to-cyan-700',
    borderColor: 'border-teal-400'
  }
];

export const tafkheemTarqeeqWords: TafkheemTarqeeqWord[] = [
  // ==========================================
  // ۱. الف پُر (Alif Pur - Before Musta'liya / Heavy)
  // ==========================================
  {
    id: 'tt-1',
    arabic: 'قَاْلَ',
    urduTranslation: 'اس نے کہا',
    spellingHijja: 'قاف الف زبر قَاْ ، لام زبر لَ = قَاْلَ',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (قاف مستعلیہ کی وجہ سے)',
    explanation: 'الف سے پہلے حرفِ مستعلیہ "قاف" پُر ہے اس لیے الف بھی پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 'tt-2',
    arabic: 'صِرَاطَ',
    urduTranslation: 'راستہ',
    spellingHijja: 'صاد زیر صِ ، را الف زبر رَا ، صِرَا ، طا زبر طَ = صِرَاطَ',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (را پُر کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "را" پر زبر ہے جو پُر ہے اس لیے الف بھی پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-3',
    arabic: 'طَالِبٌ',
    urduTranslation: 'طلب کرنے والا',
    spellingHijja: 'طا الف زبر طَا ، لام زیر لِ ، طَالِ ، با دو پیش بُنْ = طَالِبٌ',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (طا مستعلیہ کی وجہ سے)',
    explanation: 'الف سے پہلے حرفِ مستعلیہ "طا" پُر ہے اس لیے الف کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-4',
    arabic: 'خَالِدًا',
    urduTranslation: 'ہمیشہ رہنے والا',
    spellingHijja: 'خا الف زبر خَا ، لام زیر لِ ، خَالِ ، دال الف دو زبر دًا = خَالِدًا',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (خا مستعلیہ کی وجہ سے)',
    explanation: 'الف سے پہلے حرفِ مستعلیہ "خا" ہے اس لیے الف پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-5',
    arabic: 'غَاسِقٍ',
    urduTranslation: 'اندھیرا کرنے والا',
    spellingHijja: 'غین الف زبر غَا ، سین زیر سِ ، غَاسِ ، قاف دو زیر قِنْ = غَاسِقٍ',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (غین مستعلیہ کی وجہ سے)',
    explanation: 'الف سے پہلے حرفِ مستعلیہ "غین" ہے اس لیے الف کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-6',
    arabic: 'طَعَامٍ',
    urduTranslation: 'کھانا',
    spellingHijja: 'طا زبر طَ ، عین الف زبر عَا ، طَعَا ، میم دو زیر مٍ = طَعَامٍ',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (عین باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "عین" باریک ہے اس لیے الف بھی باریک پڑھا جائے گا۔'
  },

  // ==========================================
  // ۲. الف باریک (Alif Bareek - Before Light Letters)
  // ==========================================
  {
    id: 'tt-7',
    arabic: 'سِرَاجًا',
    urduTranslation: 'روشن چراغ',
    spellingHijja: 'سین زیر سِ ، را الف زبر رَا ، سِرَا ، جیم الف دو زبر جًا = سِرَاجًا',
    letterType: 'alif',
    ruleType: 'tafkheem',
    category: 'alif_pur',
    ruleUrdu: 'الف پُر (ماقبل را پر زبر کی وجہ سے)',
    explanation: 'الف سے پہلے را مفتوحہ (پُر) ہے اس لیے الف بھی پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-8',
    arabic: 'كَانَ',
    urduTranslation: 'وہ تھا',
    spellingHijja: 'کاف الف زبر کَا ، نون زبر نَ = كَانَ',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (کاف باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "کاف" باریک ہے اس لیے الف کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-9',
    arabic: 'مَالًا',
    urduTranslation: 'مال و دولت',
    spellingHijja: 'میم الف زبر مَآ ، لام الف دو زبر لًا = مَالًا',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (میم باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "میم" باریک ہے اس لیے الف باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-10',
    arabic: 'مَفَازًا',
    urduTranslation: 'کامیابی کی جگہ',
    spellingHijja: 'میم زبر مَ ، فا الف زبر فَا ، مَفَا ، زا الف دو زبر زًا = مَفَازًا',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (فا باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "فا" باریک ہے اس لیے الف کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-11',
    arabic: 'تَابُوْا',
    urduTranslation: 'انہوں نے توبہ کی',
    spellingHijja: 'تا الف زبر تَا ، با واو پیش بُوْ = تَابُوْا',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (تا باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "تا" باریک ہے اس لیے الف کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-12',
    arabic: 'عَابِدٌ',
    urduTranslation: 'عبادت کرنے والا',
    spellingHijja: 'عین الف زبر عَا ، با زیر بِ ، عَابِ ، دال دو پیش دُنْ = عَابِدٌ',
    letterType: 'alif',
    ruleType: 'tarqeeq',
    category: 'alif_bareek',
    ruleUrdu: 'الف باریک (عین باریک کی وجہ سے)',
    explanation: 'الف سے پہلے حرف "عین" باریک ہے اس لیے الف باریک پڑھا جائے گا۔'
  },

  // ==========================================
  // ۳. اسم جلالت "اللہ" کا لام پُر (Laam Jalalat Pur)
  // ==========================================
  {
    id: 'tt-13',
    arabic: 'اَللهُ',
    urduTranslation: 'اللہ تعالیٰ',
    spellingHijja: 'ہمزہ لام زبر اَلْ ، لام کھڑا زبر لٰ ، اَللّٰ ، ہا پیش ہُ = اَللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسمِ جلالت "اللہ" کے لام سے پہلے ہمزہ پر زبر ہے اس لیے لام کو پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 'tt-14',
    arabic: 'وَاللهُ',
    urduTranslation: 'اور اللہ',
    spellingHijja: 'واو لام زبر وَلْ ، لام کھڑا زبر لٰ ، وَاللّٰ ، ہا پیش ہُ = وَاللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت "اللہ" کے لام سے پہلے حرف "واو" پر زبر ہے اس لیے لامِ جلالت پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-15',
    arabic: 'فَاللّٰهُ',
    urduTranslation: 'پس اللہ',
    spellingHijja: 'فا لام زبر فَلْ ، لام کھڑا زبر لٰ ، فَاللّٰ ، ہا پیش ہُ = فَاللّٰهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت "اللہ" کے لام سے پہلے حرف "فا" پر زبر ہے اس لیے لام کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-16',
    arabic: 'اِنَّ اللهَ',
    urduTranslation: 'بیشک اللہ',
    spellingHijja: 'ہمزہ نون زیر اِنْ ، نون لام زبر نَلْ ، اِنَّلْ ، لام کھڑا زبر لٰ ، اِنَّ اللّٰ ، ہا زبر ہَ = اِنَّ اللهَ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت "اللہ" کے لام سے پہلے نون مشدد پر زبر ہے اس لیے لام کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-17',
    arabic: 'هُوَ اللهُ',
    urduTranslation: 'وہی اللہ ہے',
    spellingHijja: 'ہا پیش ہُ ، واو لام زبر وَلْ ، ہُوَلْ ، لام کھڑا زبر لٰ ، ہُوَ اللّٰ ، ہا پیش ہُ = هُوَ اللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "واو" پر زبر ہے اس لیے لام کو موٹا پڑھیں گے۔'
  },
  {
    id: 'tt-18',
    arabic: 'مِنَ اللهِ',
    urduTranslation: 'اللہ کی طرف سے',
    spellingHijja: 'میم زیر مِ ، نون لام زبر نَلْ ، مِنَلْ ، لام کھڑا زبر لٰ ، مِنَ اللّٰ ، ہا زیر ہِ = مِنَ اللهِ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "نون" پر زبر ہے اس لیے لامِ جلالت پُر ہوگا۔'
  },
  {
    id: 'tt-19',
    arabic: 'رَسُوْلُ اللهِ',
    urduTranslation: 'اللہ کے رسول',
    spellingHijja: 'را زبر رَ ، سین واو پیش سُوْ ، رَسُوْ ، لام لام پیش لُلْ ، رَسُوْلُلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = رَسُوْلُ اللهِ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل پیش)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "لام" پر پیش ہے اس لیے لامِ جلالت کو پُر (موٹا) پڑھیں گے۔'
  },
  {
    id: 'tt-20',
    arabic: 'رَضِیَ اللهُ',
    urduTranslation: 'اللہ راضی ہوا',
    spellingHijja: 'را زبر رَ ، ضاد زیر ضِ ، رَضِ ، یا لام زبر یَلْ ، رَضِیَلْ ، لام کھڑا زبر لٰ ، ہا پیش ہُ = رَضِیَ اللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت سے پہلے حرف "یا" پر زبر ہے اس لیے لامِ جلالت پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-21',
    arabic: 'قَالُوا اللّٰهُمَّ',
    urduTranslation: 'انہوں نے کہا اے اللہ!',
    spellingHijja: 'قاف الف زبر قَا ، لام واو لام پیش لُلْ ، قَالُلْ ، لام کھڑا زبر لٰ ، ہا میم پیش ہُمْ ، میم زبر مَ = قَالُوا اللّٰهُمَّ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل پیش)',
    explanation: 'اسم جلالت کے لام سے پہلے پیش کی حرکت ہے اس لیے لامِ جلالت پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-22',
    arabic: 'نَصْرُ اللهِ',
    urduTranslation: 'اللہ کی مدد',
    spellingHijja: 'نون صاد زبر نَصْ ، را لام پیش رُلْ ، نَصْرُلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = نَصْرُ اللهِ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل پیش)',
    explanation: 'اسم جلالت سے پہلے حرف "را" پر پیش ہے اس لیے لامِ جلالت کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-23',
    arabic: 'سَمِعَ اللهُ',
    urduTranslation: 'اللہ نے سنا',
    spellingHijja: 'سین زبر سَ ، میم زیر مِ ، سَمِ ، عین لام زبر عَلْ ، سَمِعَلْ ، لام کھڑا زبر لٰ ، ہا پیش ہُ = سَمِعَ اللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت سے پہلے حرف "عین" پر زبر ہے اس لیے لامِ جلالت پُر ہوگا۔'
  },
  {
    id: 'tt-24',
    arabic: 'خَلَقَ اللهُ',
    urduTranslation: 'اللہ نے پیدا کیا',
    spellingHijja: 'خا زبر خَ ، لام زبر لَ ، خَلَ ، قاف لام زبر قَلْ ، خَلَقَلْ ، لام کھڑا زبر لٰ ، ہا پیش ہُ = خَلَقَ اللهُ',
    letterType: 'laam',
    ruleType: 'tafkheem',
    category: 'laam_jalalat_pur',
    ruleUrdu: 'اسمِ جلالت کا لام پُر (ماقبل زبر)',
    explanation: 'اسم جلالت سے پہلے حرف "قاف" پر زبر ہے اس لیے لامِ جلالت پُر پڑھیں گے۔'
  },

  // ==========================================
  // ۴. اسم جلالت "اللہ" کا لام باریک (Laam Jalalat Bareek)
  // ==========================================
  {
    id: 'tt-25',
    arabic: 'لِلّٰهِ',
    urduTranslation: 'اللہ کے لیے',
    spellingHijja: 'لام لام زیر لِلْ ، لام کھڑا زبر لٰ ، لِلّٰ ، ہا زیر ہِ = لِلّٰهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "لام" کے نیچے زیر ہے اس لیے لامِ جلالت کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-26',
    arabic: 'بِاللهِ',
    urduTranslation: 'اللہ کے ساتھ',
    spellingHijja: 'با لام زیر بِلْ ، لام کھڑا زبر لٰ ، بِاللّٰ ، ہا زیر ہِ = بِاللهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "با" کے نیچے زیر ہے اس لیے لام کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-27',
    arabic: 'بِسْمِ اللهِ',
    urduTranslation: 'اللہ کے نام سے',
    spellingHijja: 'با سین زیر بِسْ ، میم لام زیر مِلْ ، بِسْمِلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = بِسْمِ اللهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "میم" کے نیچے زیر ہے اس لیے لامِ جلالت باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-28',
    arabic: 'قُلِ اللّٰهُمَّ',
    urduTranslation: 'آپ فرمائیے اے اللہ!',
    spellingHijja: 'قاف پیش قُ ، لام لام زیر لِلْ ، قُلِلْ ، لام کھڑا زبر لٰ ، ہا میم پیش ہُمْ ، میم زبر مَ = قُلِ اللّٰهُمَّ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "لام" کے نیچے زیر ہے اس لیے لام کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-29',
    arabic: 'دِیْنِ اللهِ',
    urduTranslation: 'اللہ کا دین',
    spellingHijja: 'دال یا زیر دِیْ ، نون لام زیر نِلْ ، دِیْنِلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = دِیْنِ اللهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "نون" کے نیچے زیر ہے اس لیے لام باریک ہوگا۔'
  },
  {
    id: 'tt-30',
    arabic: 'عِنْدِ اللهِ',
    urduTranslation: 'اللہ کے پاس',
    spellingHijja: 'عین نون زیر عِنْ ، دال لام زیر دِلْ ، عِنْدِلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = عِنْدِ اللهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت کے لام سے پہلے حرف "دال" کے نیچے زیر ہے اس لیے لام کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-31',
    arabic: 'اَمْرِ اللهِ',
    urduTranslation: 'اللہ کا حکم',
    spellingHijja: 'ہمزہ میم زبر اَمْ ، را لام زیر رِلْ ، اَمْرِلْ ، لام کھڑا زبر لٰ ، ہا زیر ہِ = اَمْرِ اللهِ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت سے پہلے حرف "را" کے نیچے زیر ہے اس لیے لامِ جلالت باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-32',
    arabic: 'بَلِ اللهُ',
    urduTranslation: 'بلکہ اللہ',
    spellingHijja: 'با لام زیر بَلِ ، لام لام زیر لِلْ ، لام کھڑا زبر لٰ ، ہا پیش ہُ = بَلِ اللهُ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_jalalat_bareek',
    ruleUrdu: 'اسمِ جلالت کا لام باریک (ماقبل زیر)',
    explanation: 'اسم جلالت سے پہلے حرف "لام" کے نیچے زیر ہے اس لیے لامِ جلالت باریک پڑھا جائے گا۔'
  },

  // ==========================================
  // ۵. عام لام ہمیشہ باریک (Normal Laam Bareek)
  // ==========================================
  {
    id: 'tt-33',
    arabic: 'مَالَهُمُ',
    urduTranslation: 'نہیں ہے ان کے لیے',
    spellingHijja: 'میم الف زبر مَآ ، لام زبر لَ ، مَالَ ، ہا میم پیش ہُمْ = مَالَهُمُ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_aam_bareek',
    ruleUrdu: 'عام لام ہمیشہ باریک',
    explanation: 'اسمِ جلالت "اللہ" کے علاوہ قرآنِ مجید کے تمام لام ہمیشہ باریک پڑھے جاتے ہیں۔'
  },
  {
    id: 'tt-34',
    arabic: 'اِلَّا الَّذِیْنَ',
    urduTranslation: 'مگر وہ لوگ جو',
    spellingHijja: 'ہمزہ لام زیر اِلْ ، لام الف زبر لَا ، اِلَّا ، لام زبر لَ ، ذال یا زیر ذِیْ ، نون زبر نَ = اِلَّا الَّذِیْنَ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_aam_bareek',
    ruleUrdu: 'عام لام ہمیشہ باریک',
    explanation: 'یہ عام لام ہے اس لیے باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-35',
    arabic: 'عَلٰی',
    urduTranslation: 'پر / اوپر',
    spellingHijja: 'عین زبر عَ ، لام کھڑا زبر لٰی = عَلٰی',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_aam_bareek',
    ruleUrdu: 'عام لام ہمیشہ باریک',
    explanation: 'عام لام ہے، باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-36',
    arabic: 'صَلٰوةَ',
    urduTranslation: 'نماز',
    spellingHijja: 'صاد زبر صَ ، لام کھڑا زبر لٰ ، صَلٰ ، تا زبر تَ = صَلٰوةَ',
    letterType: 'laam',
    ruleType: 'tarqeeq',
    category: 'laam_aam_bareek',
    ruleUrdu: 'عام لام ہمیشہ باریک',
    explanation: 'عام لام ہے، باریک پڑھا جائے گا۔'
  },

  // ==========================================
  // ۶. را پُر - زبر، پیش، دو زبر، دو پیش، کھڑا زبر، ماقبل زبر/پیش
  // ==========================================
  {
    id: 'tt-37',
    arabic: 'رَجُلٌ',
    urduTranslation: 'ایک آدمی',
    spellingHijja: 'را زبر رَ ، جیم پیش جُ ، رَجُ ، لام دو پیش لُنْ = رَجُلٌ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر زبر ہے)',
    explanation: 'را پر زبر ہے اس لیے را کو پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 'tt-38',
    arabic: 'اَلَمْ تَرَ',
    urduTranslation: 'کیا آپ نے نہیں دیکھا',
    spellingHijja: 'ہمزہ زبر اَ ، لام میم زبر لَمْ ، اَلَمْ ، تا زبر تَ ، را زبر رَ = اَلَمْ تَرَ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر زبر ہے)',
    explanation: 'را پر زبر ہے اس لیے را کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-39',
    arabic: 'رُزِقُوْا',
    urduTranslation: 'وہ رزق دیے گئے',
    spellingHijja: 'را پیش رُ ، زا زیر زِ ، رُزِ ، قاف واو پیش قُوْ = رُزِقُوْا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر پیش ہے)',
    explanation: 'را پر پیش ہے اس لیے را کو پُر (موٹا) پڑھا جائے گا۔'
  },
  {
    id: 'tt-40',
    arabic: 'اَكْثَرَ',
    urduTranslation: 'زیادہ',
    spellingHijja: 'ہمزہ کاف زبر اَکْ ، ثا زبر ثَ ، اَکْثَ ، را زبر رَ = اَكْثَرَ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر زبر ہے)',
    explanation: 'را پر زبر ہے اس لیے را کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-41',
    arabic: 'اَجْرًا',
    urduTranslation: 'اجر / ثواب',
    spellingHijja: 'ہمزہ جیم زبر اَجْ ، را الف دو زبر رًا = اَجْرًا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر دو زبر ہیں)',
    explanation: 'را پر دو زبر ہیں اس لیے را کو پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-42',
    arabic: 'اَجْرٌ',
    urduTranslation: 'اجر',
    spellingHijja: 'ہمزہ جیم زبر اَجْ ، را دو پیش رُنْ = اَجْرٌ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر دو پیش ہیں)',
    explanation: 'را پر دو پیش ہیں اس لیے را پُر ہوگی۔'
  },
  {
    id: 'tt-43',
    arabic: 'اِبْرٰهِیْمَ',
    urduTranslation: 'ابراہیم علیہ السلام',
    spellingHijja: 'ہمزہ با زیر اِبْ ، را کھڑا زبر رٰ ، اِبْرٰ ، ہا یا زیر ہِیْ ، اِبْرٰہِیْ ، میم زبر مَ = اِبْرٰهِیْمَ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را پُر (را پر کھڑا زبر ہے)',
    explanation: 'را پر کھڑا زبر ہے اس لیے را کو پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-44',
    arabic: 'عَرْشٌ',
    urduTranslation: 'عرش',
    spellingHijja: 'عین را زبر عَرْ ، شین دو پیش شُنْ = عَرْشٌ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را ساکن پُر (ماقبل زبر ہے)',
    explanation: 'را ساکن سے پہلے حرف "عین" پر زبر ہے اس لیے را ساکن پُر ہوگی۔'
  },
  {
    id: 'tt-45',
    arabic: 'اَمْ صَبَرْنَا',
    urduTranslation: 'یا ہم نے صبر کیا',
    spellingHijja: 'ہمزہ میم زبر اَمْ ، صاد زبر صَ ، با را زبر بَرْ ، صَبَرْ ، نون الف زبر نَا = اَمْ صَبَرْنَا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را ساکن پُر (ماقبل زبر ہے)',
    explanation: 'را ساکن سے پہلے حرف "با" پر زبر ہے اس لیے را ساکن پُر ہوگی۔'
  },
  {
    id: 'tt-46',
    arabic: 'تُرْجَعُوْنَ',
    urduTranslation: 'تم لوٹائے جاؤ گے',
    spellingHijja: 'تا را پیش تُرْ ، جیم زبر جَ ، تُرْجَ ، عین واو پیش عُوْ ، تُرْجَعُوْ ، نون زبر نَ = تُرْجَعُوْنَ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را ساکن پُر (ماقبل پیش ہے)',
    explanation: 'را ساکن سے پہلے حرف "تا" پر پیش ہے اس لیے را ساکن کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-47',
    arabic: 'يُرْزَقُوْنَ',
    urduTranslation: 'وہ رزق پاتے ہیں',
    spellingHijja: 'یا را پیش یُرْ ، زا زبر زَ ، یُرْزَ ، قاف واو پیش قُوْ ، یُرْزَقُوْ ، نون زبر نَ = يُرْزَقُوْنَ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_harakat',
    ruleUrdu: 'را ساکن پُر (ماقبل پیش ہے)',
    explanation: 'را ساکن سے پہلے پیش ہے اس لیے را ساکن پُر پڑھی جائے گی۔'
  },

  // ==========================================
  // ۷. را پُر - عارضی زیر / زیر دوسرے کلمے میں / بعد میں حرفِ مستعلیہ
  // ==========================================
  {
    id: 'tt-48',
    arabic: 'اِرْجِعْ',
    urduTranslation: 'تو لوٹ جا',
    spellingHijja: 'ہمزہ را زیر اِرْ ، جیم زیر جِ ، اِرْجِ ، عین جزم عْ = اِرْجِعْ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (ماقبل عارضی زیر ہے)',
    explanation: 'را ساکن سے پہلے ہمزہ وصل کا زیر عارضی ہے، اس لیے را ساکن پُر پڑھی جائے گی۔'
  },
  {
    id: 'tt-49',
    arabic: 'اِرْجِعُوْا',
    urduTranslation: 'تم سب لوٹ جاؤ',
    spellingHijja: 'ہمزہ را زیر اِرْ ، جیم زیر جِ ، اِرْجِ ، عین واو پیش عُوْ = اِرْجِعُوْا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (ماقبل عارضی زیر ہے)',
    explanation: 'را ساکن سے پہلے ہمزہ وصلیہ کے نیچے عارضی زیر ہے اس لیے را پُر ہوگی۔'
  },
  {
    id: 'tt-50',
    arabic: 'اِرْجِعِیْ',
    urduTranslation: 'تو لوٹ آ (اے مطمئن جان)',
    spellingHijja: 'ہمزہ را زیر اِرْ ، جیم زیر جِ ، اِرْجِ ، عین یا زیر عِیْ = اِرْجِعِیْ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (ماقبل عارضی زیر ہے)',
    explanation: 'را ساکن سے پہلے عارضی زیر ہے اس لیے را کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-51',
    arabic: 'اِرْكَعُوْا',
    urduTranslation: 'تم رکوع کرو',
    spellingHijja: 'ہمزہ را زیر اِرْ ، کاف زبر کَ ، اِرْکَ ، عین واو پیش عُوْ = اِرْكَعُوْا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (ماقبل عارضی زیر ہے)',
    explanation: 'را ساکن سے پہلے عارضی زیر ہے اس لیے را پُر ہوگی۔'
  },
  {
    id: 'tt-52',
    arabic: 'رَبِّ ارْحَمْهُمَا',
    urduTranslation: 'اے میرے رب! ان دونوں پر رحم فرما',
    spellingHijja: 'را زبر رَ ، با را زیر بِرْ ، رَبِّرْ ، حا میم زبر حَمْ ، رَبِّ ارْحَمْ ، ہا میم الف زبر ہُمَا = رَبِّ ارْحَمْهُمَا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (زیر دوسرے کلمے میں ہے)',
    explanation: 'را ساکن سے پہلے والا زیر دوسرے کلمے (رَبِّ) میں ہے اس لیے را ساکن پُر پڑھی جائے گی۔'
  },
  {
    id: 'tt-53',
    arabic: 'رَبِّ ارْجِعُوْنِ',
    urduTranslation: 'اے میرے رب! مجھے واپس بھیج دیجیے',
    spellingHijja: 'را زبر رَ ، با را زیر بِرْ ، رَبِّرْ ، جیم زیر جِ ، عین واو پیش عُوْ ، نون زیر نِ = رَبِّ ارْجِعُوْنِ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (زیر دوسرے کلمے میں ہے)',
    explanation: 'را ساکن سے پہلے زیر دوسرے کلمے میں ہے اس لیے را ساکن پُر ہوگی۔'
  },
  {
    id: 'tt-54',
    arabic: 'اِنِ ارْتَبْتُمْ',
    urduTranslation: 'اگر تمہیں شک ہو',
    spellingHijja: 'ہمزہ زیر اِ ، نون را زیر نِرْ ، اِنِرْ ، تا با زبر تَبْ ، تا میم پیش تُمْ = اِنِ ارْتَبْتُمْ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (زیر دوسرے کلمے میں ہے)',
    explanation: 'را ساکن سے پہلے زیر دوسرے کلمے (اِنِ) میں ہے اس لیے را پُر ہوگی۔'
  },
  {
    id: 'tt-55',
    arabic: 'اَمِ ارْتَابُوْا',
    urduTranslation: 'یا وہ شک میں پڑے',
    spellingHijja: 'ہمزہ زبر اَ ، میم را زیر مِرْ ، اَمِرْ ، تا الف زبر تَا ، با واو پیش بُوْ = اَمِ ارْتَابُوْا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_aarizi_zer',
    ruleUrdu: 'را ساکن پُر (زیر دوسرے کلمے میں ہے)',
    explanation: 'را ساکن سے پہلے زیر دوسرے کلمے (اَمِ) میں ہے اس لیے را پُر پڑھی جائے گی۔'
  },
  {
    id: 'tt-56',
    arabic: 'مِرْصَادًا',
    urduTranslation: 'گھات لگانے کی جگہ',
    spellingHijja: 'میم را زیر مِرْ ، صاد الف زبر صَا ، مِرْصَا ، دال الف دو زبر دًا = مِرْصَادًا',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_mutaalliya',
    ruleUrdu: 'را ساکن پُر (بعد میں حرفِ مستعلیہ صاد ہے)',
    explanation: 'را ساکن کے بعد اسی کلمے میں حرفِ مستعلیہ "صاد" آ گیا ہے اس لیے ماقبل زیر ہونے کے باوجود را کو پُر پڑھیں گے۔'
  },
  {
    id: 'tt-57',
    arabic: 'فِرْقَةٍ',
    urduTranslation: 'ایک گروہ / جماعت',
    spellingHijja: 'فا را زیر فِرْ ، قاف زبر قَ ، فِرْقَ ، تا دو زیر تٍ = فِرْقَةٍ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_mutaalliya',
    ruleUrdu: 'را ساکن پُر (بعد میں حرفِ مستعلیہ قاف ہے)',
    explanation: 'را ساکن کے بعد حرفِ مستعلیہ "قاف" مفتوحہ ہے اس لیے را ساکن پُر ہوگی۔'
  },
  {
    id: 'tt-58',
    arabic: 'فِیْ قِرْطَاسٍ',
    urduTranslation: 'کاغذ پر',
    spellingHijja: 'فا یا زیر فِیْ ، قاف را زیر قِرْ ، طا الف زبر طَا ، قِرْطَا ، سین دو زیر سٍ = فِیْ قِرْطَاسٍ',
    letterType: 'raa',
    ruleType: 'tafkheem',
    category: 'raa_pur_mutaalliya',
    ruleUrdu: 'را ساکن پُر (بعد میں حرفِ مستعلیہ طا ہے)',
    explanation: 'را ساکن کے بعد حرفِ مستعلیہ "طا" ہے اس لیے را ساکن کو پُر پڑھا جائے گا۔'
  },
  {
    id: 'tt-59',
    arabic: 'كُلُّ فِرْقٍ',
    urduTranslation: 'ہر ٹکڑا',
    spellingHijja: 'کاف لام پیش کُلْ ، لام پیش لُ ، کُلُّ ، فا را زیر فِرْ ، قاف دو زیر قٍ = كُلُّ فِرْقٍ',
    letterType: 'raa',
    ruleType: 'jawaz',
    category: 'raa_pur_mutaalliya',
    ruleUrdu: 'پُر و باریک دونوں جائز (قاف مکسور ہونے کی وجہ سے)',
    explanation: 'را ساکن کے بعد حرفِ مستعلیہ "قاف" مکسور (زیر والا) ہے اس لیے اس میں را کو پُر اور باریک دونوں طرح پڑھنا جائز ہے۔'
  },

  // ==========================================
  // ۸. را باریک (Raa Bareek / Tarqeeq - زیر، دو زیر، ماقبل زیرِ اصلی، یائے ساکنہ)
  // ==========================================
  {
    id: 'tt-60',
    arabic: 'وَالنَّهَارِ',
    urduTranslation: 'اور دن',
    spellingHijja: 'واو نون زبر وَنْ ، نون زبر نَ ، وَنَّ ، ہا الف زبر ہَا ، وَالنَّہَا ، را زیر رِ = وَالنَّهَارِ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را کے نیچے زیر ہے)',
    explanation: 'را کے نیچے زیر ہے اس لیے را کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-61',
    arabic: 'رِجَالٌ',
    urduTranslation: 'بہت سے مرد',
    spellingHijja: 'را زیر رِ ، جیم الف زبر جَا ، رِجَا ، لام دو پیش لُنْ = رِجَالٌ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را کے نیچے زیر ہے)',
    explanation: 'را کے نیچے زیر ہے اس لیے را باریک پڑھی جائے گی۔'
  },
  {
    id: 'tt-62',
    arabic: 'اَمْرٍ',
    urduTranslation: 'کوئی کام / حکم',
    spellingHijja: 'ہمزہ میم زبر اَمْ ، را دو زیر رٍ = اَمْرٍ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را کے نیچے دو زیر ہیں)',
    explanation: 'را کے نیچے دو زیر ہیں اس لیے را کو باریک پڑھا جائے گا۔'
  },
  {
    id: 'tt-63',
    arabic: 'فَاصْبِرْ',
    urduTranslation: 'پس آپ صبر کیجیے',
    spellingHijja: 'فا صاد زبر فَصْ ، با را زیر بِرْ = فَاصْبِرْ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را ساکن باریک (ماقبل زیرِ اصلی اسی کلمے میں ہے)',
    explanation: 'را ساکن سے پہلے حرف "با" کے نیچے زیر اصلی اسی کلمے میں ہے اس لیے را ساکن باریک ہوگی۔'
  },
  {
    id: 'tt-64',
    arabic: 'قُمْ فَاَنْذِرْ',
    urduTranslation: 'اٹھیے اور ڈر سنائیے',
    spellingHijja: 'قاف میم پیش قُمْ ، فا زبر فَ ، ہمزہ نون زبر اَنْ ، ذال را زیر ذِرْ = قُمْ فَاَنْذِرْ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را ساکن باریک (ماقبل زیرِ اصلی ہے)',
    explanation: 'را ساکن سے پہلے حرف "ذال" کے نیچے زیر اصلی ہے اس لیے را ساکن باریک پڑھی جائے گی۔'
  },
  {
    id: 'tt-65',
    arabic: 'خَبِیْرٌ',
    urduTranslation: 'خوب باخبر',
    spellingHijja: 'خا زبر خَ ، با یا زیر بِیْ ، خَبِیْ ، را دو پیش رُنْ (وقف میں را ساکنہ ماقبل یائے لین/مدہ) = خَبِیْرٌ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را ساکن سے پہلے یائے ساکنہ ہے)',
    explanation: 'وقف کی صورت میں را ساکنہ سے پہلے یائے ساکنہ آ رہی ہے اس لیے را باریک پڑھی جائے گی۔'
  },
  {
    id: 'tt-66',
    arabic: 'نَذِیْرٌ',
    urduTranslation: 'ڈر سنانے والا',
    spellingHijja: 'نون زبر نَ ، ذال یا زیر ذِیْ ، نَذِیْ ، را دو پیش رُنْ (وقف میں نَذِیْرْ) = نَذِیْرٌ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را ساکن سے پہلے یائے ساکنہ ہے)',
    explanation: 'را ساکن سے پہلے یائے ساکنہ ہونے کی وجہ سے را باریک پڑھی جائے گی۔'
  },
  {
    id: 'tt-67',
    arabic: 'رِسَلَتِ',
    urduTranslation: 'پیغامات',
    spellingHijja: 'را زیر رِ ، سین زبر سَ ، رِسَ ، لام زبر لَ ، تا زیر تِ = رِسَلَتِ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را کے نیچے زیر ہے)',
    explanation: 'را کے نیچے زیر ہے اس لیے را کو باریک پڑھیں گے۔'
  },
  {
    id: 'tt-68',
    arabic: 'مُنْهَمِرٍ',
    urduTranslation: 'بہتا ہوا زور دار پانی',
    spellingHijja: 'میم پیش مُ ، نون ہا زبر نْہَ ، میم زیر مِ ، را دو زیر رٍ = مُنْهَمِرٍ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را باریک (را کے نیچے دو زیر ہیں)',
    explanation: 'را کے نیچے دو زیر ہیں اس لیے را باریک ہوگی۔'
  },
  {
    id: 'tt-69',
    arabic: 'اُمِرْتُ',
    urduTranslation: 'مجھے حکم دیا گیا',
    spellingHijja: 'ہمزہ پیش اRelationُ ، میم زیر مِ ، را جزم رْتُ = اُمِرْتُ',
    letterType: 'raa',
    ruleType: 'tarqeeq',
    category: 'raa_bareek',
    ruleUrdu: 'را ساکن باریک (ماقبل زیرِ اصلی ہے)',
    explanation: 'را ساکن سے پہلے میم کے نیچے زیر اصلی ہے اس لیے را باریک پڑھی جائے گی۔'
  }
];
