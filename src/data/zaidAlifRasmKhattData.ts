// Data and definitions for Sabaq 15: Zaid Alif & Rasm ul Khatt (سبق ۱۵: زائد الف و رسم الخط)
// Comprehensive Tajweed data according to Dawat-e-Islami Madani Qaidah & Standard Tajweed Rules

export interface ZaidAlifWordItem {
  id: string;
  arabic: string;
  ruleCategory: 'rule1_wasl_no_waqf_yes' | 'rule2_salabila_optional' | 'rule3_never_read' | 'rule4_ana_not_zaid' | 'rasm_ul_khatt';
  ruleCategoryUrdu: string;
  surahRefUrdu: string; // e.g. "پ ۱۵، الکہف ۳۸"
  waslPronunciation: string; // e.g. "لٰكِنَّ (ن زبر نَ)"
  waqfPronunciation: string; // e.g. "لٰكِنَّا (۱ الف کھینچ کر)"
  waslAudioText: string;     // Clean Arabic text for audio playback in Wasl mode
  waqfAudioText: string;     // Clean Arabic text for audio playback in Waqf mode
  spellingHijja: string;
  explanationUrdu: string;
  displayColoredParts: {
    text: string;
    type: 'normal' | 'zaid_alif' | 'silent_letter' | 'pronounced_alif' | 'rasm_waw';
  }[];
  audioText: string;
}

export interface RasmKhattItem {
  id: string;
  arabic: string;
  categoryUrdu: string;
  silentLetter: string;
  explanationUrdu: string;
  spellingHijja: string;
  displayColoredParts: {
    text: string;
    type: 'normal' | 'silent' | 'rasm_vowel';
  }[];
  audioText?: string;
}

// ----------------------------------------------------------------------------
// RULE 1: 6 Words where Zaid Alif is NOT pronounced in Wasl, but IS in Waqf
// ----------------------------------------------------------------------------
export const RULE_1_ZAID_ALIF_WORDS: ZaidAlifWordItem[] = [
  {
    id: 'zaid-1-lakinna',
    arabic: 'لٰكِنَّا۟',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۵، الکہف ۳۸',
    waslPronunciation: 'لٰكِنَّ (نون زبر نَ)',
    waqfPronunciation: 'لٰكِنَّا (۱ الف کھینچ کر)',
    waslAudioText: 'لٰكِنَّ',
    waqfAudioText: 'لٰكِنَّا',
    spellingHijja: 'لام زبر لٰـ ، کاف زیر کِ ، نون تشدید زبر نَّ (وصل) / وقف میں نون الف زبر نَا',
    explanationUrdu: 'وصل (ملا کر پڑھنے) میں الف نہیں پڑھا جائے گا "لٰكِنَّ"، اور وقف (رکنے) کی صورت میں الف پڑھا جائے گا "لٰكِنَّا"۔',
    displayColoredParts: [
      { text: 'لٰكِنَّ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'لٰكِنَّا'
  },
  {
    id: 'zaid-2-athununa',
    arabic: 'الظُّنُونَا۟',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۱، الاحزاب ۱۰',
    waslPronunciation: 'الظُّنُونَ (ن زبر نَ)',
    waqfPronunciation: 'الظُّنُونَا (۱ الف کھینچ کر)',
    waslAudioText: 'الظُّنُونَ',
    waqfAudioText: 'الظُّنُونَا',
    spellingHijja: 'الظُّنُونَا - وصل میں نون زبر نَ ، وقف میں نون الف زبر نَا',
    explanationUrdu: 'وصل کی حالت میں زائد الف نہیں پڑھیں گے "الظُّنُونَ"، لیکن وقف میں ۱ الف کی مقدار کھینچ کر "الظُّنُونَا" پڑھیں گے۔',
    displayColoredParts: [
      { text: 'الظُّنُونِ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'الظُّنُونَا'
  },
  {
    id: 'zaid-3-arrasula',
    arabic: 'الرَّسُولَا۟',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۲، الاحزاب ۶۶',
    waslPronunciation: 'الرَّسُولَ (لام زبر لَ)',
    waqfPronunciation: 'الرَّسُولَا (۱ الف کھینچ کر)',
    waslAudioText: 'الرَّسُولَ',
    waqfAudioText: 'الرَّسُولَا',
    spellingHijja: 'الرَّسُولَا - وصل میں لام زبر لَ ، وقف میں لام الف زبر لَا',
    explanationUrdu: 'وصل کی صورت میں الف زائدہ حذف ہوگا "الرَّسُولَ"، وقف کی صورت میں الف مدہ ثابت رہے گا "الرَّسُولَا"۔',
    displayColoredParts: [
      { text: 'الرَّسُولَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'الرَّسُولَا'
  },
  {
    id: 'zaid-4-assabila',
    arabic: 'السَّبِيلَا۟',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۲، الاحزاب ۶۷',
    waslPronunciation: 'السَّبِيلَ (لام زبر لَ)',
    waqfPronunciation: 'السَّبِيلَا (۱ الف کھینچ کر)',
    waslAudioText: 'السَّبِيلَ',
    waqfAudioText: 'السَّبِيلَا',
    spellingHijja: 'السَّبِيلَا - وصل میں لام زبر لَ ، وقف میں لام الف زبر لَا',
    explanationUrdu: 'وصل میں زائد الف نہیں پڑھا جائے گا "السَّبِيلَ"، اور وقف کی صورت میں الف پڑھا جائے گا "السَّبِيلَا"۔',
    displayColoredParts: [
      { text: 'السَّبِيلَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'السَّبِيلَا'
  },
  {
    id: 'zaid-5-qawarira-1',
    arabic: 'قَوَارِيرَا۟ (پہلا)',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۹، سورة الدھر ۱۵',
    waslPronunciation: 'قَوَارِيرَ (را زبر رَ)',
    waqfPronunciation: 'قَوَارِيرَا (۱ الف کھینچ کر)',
    waslAudioText: 'قَوَارِيرَ',
    waqfAudioText: 'قَوَارِيرَا',
    spellingHijja: 'قَوَارِيرَا (پہلا) - وصل میں را زبر رَ ، وقف میں را الف زبر رَا',
    explanationUrdu: 'سورۃ الدھر آیت ۱۵ کا پہلا "قواریرا" وصل میں بلا الف "قَوَارِيرَ" اور وقف میں الف کے ساتھ "قَوَارِيرَا" پڑھا جاتا ہے۔',
    displayColoredParts: [
      { text: 'قَوَارِيرَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'قَوَارِيرَا'
  },
  {
    id: 'zaid-6-ana-everywhere',
    arabic: 'أَنَا۟ (ہر جگہ)',
    ruleCategory: 'rule1_wasl_no_waqf_yes',
    ruleCategoryUrdu: 'قاعدہ ۱: وصل میں نہیں، وقف میں الف پڑھا جائے گا',
    surahRefUrdu: 'قرآن پاک میں تمام مقامات پر',
    waslPronunciation: 'أَنَ (نون زبر نَ - مختصر)',
    waqfPronunciation: 'أَنَا (۱ الف کھینچ کر)',
    waslAudioText: 'أَنَ',
    waqfAudioText: 'أَنَا',
    spellingHijja: 'ہَمْزَہ زَبَر أَن ، نُون زَبَر نَ (وصل) / نُون اَلِف زَبَر نَا (وقف)',
    explanationUrdu: 'قرآن پاک میں ہر جگہ منفرد لفظ "أَنَا۟" وصل کی حالت میں "أَنَ" (بغیر الف) اور وقف میں "أَنَا" (الف کے ساتھ) پڑھا جاتا ہے۔',
    displayColoredParts: [
      { text: 'أَنَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'أَنَا'
  }
];

// ----------------------------------------------------------------------------
// RULE 2: Salasila (Optional Alif or Sakin Lam in Waqf)
// ----------------------------------------------------------------------------
export const RULE_2_SALASILA: ZaidAlifWordItem[] = [
  {
    id: 'zaid-7-salasila',
    arabic: 'سَلٰسِلَا۟',
    ruleCategory: 'rule2_salabila_optional',
    ruleCategoryUrdu: 'قاعدہ ۲: سَلٰسِلَا۟ (وقف میں ۲ صورتیں جائز)',
    surahRefUrdu: 'پ ۲۹، سورة الدھر ۴',
    waslPronunciation: 'سَلٰسِلَ (لام زبر لَ)',
    waqfPronunciation: '۱) سَلٰسِلَا (الف کے ساتھ) یا ۲) سَلٰسِلْ (لام ساکن)',
    waslAudioText: 'سَلٰسِلَ',
    waqfAudioText: 'سَلٰسِلَا',
    spellingHijja: 'سَلٰسِلَا - وصل میں "سَلٰسِلَ"، وقف میں "سَلٰسِلَا" اور "سَلٰسِلْ" دونوں درست ہیں',
    explanationUrdu: 'قرآن پاک کے کلمے "سَلٰسِلَا۟" کے زائد الف کو وصل میں ہرگز نہیں پڑھیں گے۔ وقف میں الف پڑھنا "سَلٰسِلَا" اور نہ پڑھنا "سَلٰسِلْ" دونوں جائز ہیں۔',
    displayColoredParts: [
      { text: 'سَلٰسِلَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'سَلٰسِلَا'
  }
];

// ----------------------------------------------------------------------------
// RULE 3: Zaid Alif NEVER pronounced (Neither in Wasl nor in Waqf)
// ----------------------------------------------------------------------------
export const RULE_3_NEVER_READ_WORDS: ZaidAlifWordItem[] = [
  {
    id: 'zaid-8-afain-mata',
    arabic: 'أَفَإِي۟ن مَّاتَ',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۴، آل عمران ۱۴۴',
    waslPronunciation: 'أَفَإِن مَّاتَ',
    waqfPronunciation: 'أَفَإِنْ',
    waslAudioText: 'أَفَإِن مَّاتَ',
    waqfAudioText: 'أَفَإِنْ',
    spellingHijja: 'أَفَإِي۟ن - یاء پر الف زائدہ غیر ملفوظ ہے، زبر زیر کے ساتھ پڑھیں',
    explanationUrdu: 'اس کلمے کا زائد الف وصل اور وقف دونوں حالتوں میں بالکل نہیں پڑھا جاتا۔',
    displayColoredParts: [
      { text: 'أَفَإِ', type: 'normal' },
      { text: 'ي۟', type: 'zaid_alif' },
      { text: 'ن مَّاتَ', type: 'normal' }
    ],
    audioText: 'أَفَإِين مَّاتَ'
  },
  {
    id: 'zaid-9-afain-mutta',
    arabic: 'أَفَإِي۟ن مُّتَّ',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۷، الانبیاء ۳۴',
    waslPronunciation: 'أَفَإِن مُّتَّ',
    waqfPronunciation: 'أَفَإِنْ',
    waslAudioText: 'أَفَإِن مُّتَّ',
    waqfAudioText: 'أَفَإِنْ',
    spellingHijja: 'أَفَإِي۟ن - الف زائدہ لکھا ہے مگر نہیں پڑھا جائے گا',
    explanationUrdu: 'اس زائد الف کا تلفظ کسی بھی صورت میں نہیں ہوگا۔',
    displayColoredParts: [
      { text: 'أَفَإِ', type: 'normal' },
      { text: 'ي۟', type: 'zaid_alif' },
      { text: 'ن مُّتَّ', type: 'normal' }
    ],
    audioText: 'أَفَإِين مُّتَّ'
  },
  {
    id: 'zaid-10-la-ilal-jaheem',
    arabic: 'لَا۟ اِلَى الْجَحِيمِ',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۳، الصَفَّت ۶۸',
    waslPronunciation: 'لَإِلَى الْجَحِيمِ',
    waqfPronunciation: 'لَإِلَى الْجَحِيمْ',
    waslAudioText: 'لَإِلَى الْجَحِيمِ',
    waqfAudioText: 'لَإِلَى الْجَحِيمِ',
    spellingHijja: 'لَا۟ - لام زبر لَ + الَى الْجَحِيمِ ، الف زائدہ خاموش ہے',
    explanationUrdu: 'لام کے بعد الف زائدہ خاموش رہے گا، "لَإِلَى الْجَحِيمِ" پڑھا جائے گا۔',
    displayColoredParts: [
      { text: 'لَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' },
      { text: ' اِلَى الْجَحِيمِ', type: 'normal' }
    ],
    audioText: 'لَا اِلَى الْجَحِيمِ'
  },
  {
    id: 'zaid-11-malaihi',
    arabic: 'مَلَإِي۟هِ (ہر جگہ)',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'قرآن پاک میں تمام مقامات پر',
    waslPronunciation: 'مَلَئِهِ',
    waqfPronunciation: 'مَلَئِهْ',
    waslAudioText: 'مَلَإِهِ',
    waqfAudioText: 'مَلَإِهِ',
    spellingHijja: 'مَلَإِي۟هِ - لام کے بعد زائد الف کا تلفظ نہیں ہوگا',
    explanationUrdu: 'قرآن کریم میں جہاں بھی "مَلَإِي۟هِ" آئے، اس کا زائد الف ساکن/خاموش رہے گا۔',
    displayColoredParts: [
      { text: 'مَلَ', type: 'normal' },
      { text: 'إِي۟', type: 'zaid_alif' },
      { text: 'هِ', type: 'normal' }
    ],
    audioText: 'مَلَإِهِ'
  },
  {
    id: 'zaid-12-wala-awdau',
    arabic: 'وَلَا۟ اَوْضَعُوا',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۰، التوبة ۴۷',
    waslPronunciation: 'وَلَاَوْضَعُوا',
    waqfPronunciation: 'وَلَاَوْضَعُوا',
    waslAudioText: 'وَلَاَوْضَعُوا',
    waqfAudioText: 'وَلَاَوْضَعُوا',
    spellingHijja: 'وَلَا۟ - لام کے بعد الف زائدہ نہیں پڑھا جائے گا',
    explanationUrdu: 'یہاں زائد الف بالکل خاموش ہے، ملا کر "وَلَاَوْضَعُوا" پڑھیں گے۔',
    displayColoredParts: [
      { text: 'وَلَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' },
      { text: ' اَوْضَعُوا', type: 'normal' }
    ],
    audioText: 'وَلَا اَوْضَعُوا'
  },
  {
    id: 'zaid-13-wamalaihim',
    arabic: 'وَمَلَإِي۟هِمْ',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۱، یونس ۸۳',
    waslPronunciation: 'وَمَلَئِهِمْ',
    waqfPronunciation: 'وَمَلَئِهِمْ',
    waslAudioText: 'وَمَلَئِهِمْ',
    waqfAudioText: 'وَمَلَئِهِمْ',
    spellingHijja: 'وَمَلَإِي۟هِمْ - زائد الف دونوں حالتوں میں ساقط ہے',
    explanationUrdu: 'زائد الف رسم الخط کی علامت ہے، تلفظ میں نہیں آئے گا۔',
    displayColoredParts: [
      { text: 'وَمَلَ', type: 'normal' },
      { text: 'إِي۟', type: 'zaid_alif' },
      { text: 'هِمْ', type: 'normal' }
    ],
    audioText: 'وَمَلَئِهِمْ'
  },
  {
    id: 'zaid-14-thamuda',
    arabic: 'ثَمُودَا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۰، العنکبوت ۳۸ / پ ۱۲، ہود ۹۸ / پ ۱۹، الفرقان ۳۸ / پ ۲۷، النجم ۵۱',
    waslPronunciation: 'ثَمُودَ (دال زبر دَ)',
    waqfPronunciation: 'ثَمُودْ (دال ساکن)',
    waslAudioText: 'ثَمُودَ',
    waqfAudioText: 'ثَمُودْ',
    spellingHijja: 'ثَمُودَا۟ - وصل میں دال زبر دَ، وقف میں دال ساکن ثَمُودْ',
    explanationUrdu: 'ان ۴ سورتوں کے کلمے "ثَمُودَا۟" میں زائد الف کسی صورت نہیں پڑھا جاتا (وقف میں دال ساکن "ثَمُودْ" ہوگا)۔',
    displayColoredParts: [
      { text: 'ثَمُودَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'ثَمُودَا'
  },
  {
    id: 'zaid-15-litatluwa',
    arabic: 'لِتَتْلُوا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۳، الرعد ۳۰',
    waslPronunciation: 'لِتَتْلُوَ',
    waqfPronunciation: 'لِتَتْلُوْ',
    waslAudioText: 'لِتَتْلُوَ',
    waqfAudioText: 'لِتَتْلُوْ',
    spellingHijja: 'لِتَتْلُوا۟ - واؤ کے بعد کا الف زائدہ غیر ملفوظ ہے',
    explanationUrdu: 'واؤ کے بعد آنے والا زائد الف لکھا جاتا ہے مگر پڑھا نہیں جاتا۔',
    displayColoredParts: [
      { text: 'لِتَتْلُوَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'لِتَتْلُوا'
  },
  {
    id: 'zaid-16-lan-naduwa',
    arabic: 'لَنْ نَّدْعُوَا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۵، الکہف ۱۴',
    waslPronunciation: 'لَنْ نَّدْعُوَ',
    waqfPronunciation: 'لَنْ نَّدْعُوْ',
    waslAudioText: 'لَنْ نَّدْعُوَ',
    waqfAudioText: 'لَنْ نَّدْعُوْ',
    spellingHijja: 'لَنْ نَّدْعُوَا۟ - واؤ پر زبر کے بعد زائد الف خاموش ہے',
    explanationUrdu: 'آخری زائد الف نہ وصل میں اور نہ وقف میں پڑھیں گے۔',
    displayColoredParts: [
      { text: 'لَنْ نَّدْعُوَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'لَنْ نَّدْعُوَا'
  },
  {
    id: 'zaid-17-liyarbuwa',
    arabic: 'لِيَرْبُوَا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۱، الروم ۳۹',
    waslPronunciation: 'لِيَرْبُوَ',
    waqfPronunciation: 'لِيَرْبُوْ',
    waslAudioText: 'لِيَرْبُوَ',
    waqfAudioText: 'لِيَرْبُوْ',
    spellingHijja: 'لِيَرْبُوَا۟ - زائد الف بغیر تلفظ کا ہے',
    explanationUrdu: 'اس کلمے میں زائد الف کو بلا تلفظ چھوڑ کر پڑھیں۔',
    displayColoredParts: [
      { text: 'لِيَرْبُوَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'لِيَرْبُوَا'
  },
  {
    id: 'zaid-18-liyabluwa',
    arabic: 'لِيَبْلُوَا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۶، محمد ۴',
    waslPronunciation: 'لِيَبْلُوَ',
    waqfPronunciation: 'لِيَبْلُوْ',
    waslAudioText: 'لِيَبْلُوَ',
    waqfAudioText: 'لِيَبْلُوْ',
    spellingHijja: 'لِيَبْلُوَا۟ - واؤ کے بعد الف زائدہ کی کتابت ہے',
    explanationUrdu: 'واؤ کے بعد لکھا ہوا الف زائدہ ہے، اس لیے غیر ملفوظ ہے۔',
    displayColoredParts: [
      { text: 'لِيَبْلُوَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'لِيَبْلُوَا'
  },
  {
    id: 'zaid-19-wanabluwa',
    arabic: 'وَنَبْلُوَا۟',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۶، محمد ۳۱',
    waslPronunciation: 'وَنَبْلُوَ',
    waqfPronunciation: 'وَنَبْلُوْ',
    waslAudioText: 'وَنَبْلُوَ',
    waqfAudioText: 'وَنَبْلُوْ',
    spellingHijja: 'وَنَبْلُوَا۟ - زائد الف نہیں پڑھا جائے گا',
    explanationUrdu: 'وصل و وقف میں زائد الف کو حذف کر کے قراءت کی جائے گی۔',
    displayColoredParts: [
      { text: 'وَنَبْلُوَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'وَنَبْلُوَا'
  },
  {
    id: 'zaid-20-qawarira-2',
    arabic: 'قَوَارِيرَا۟ (دوسرا)',
    ruleCategory: 'rule3_never_read',
    ruleCategoryUrdu: 'قاعدہ ۳: وصل اور وقف دونوں میں الف نہیں پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۹، سورة الدھر ۱۶',
    waslPronunciation: 'قَوَارِيرَ (را زبر رَ)',
    waqfPronunciation: 'قَوَارِيرْ (را ساکن)',
    waslAudioText: 'قَوَارِيرَ',
    waqfAudioText: 'قَوَارِيرْ',
    spellingHijja: 'قَوَارِيرَا (دوسرا) - اس دوسرے کا زائد الف کسی صورت نہیں پڑھا جاتا',
    explanationUrdu: 'سورۃ الدھر آیت ۱۶ کے دوسرے "قواریرا" کا زائد الف وصل "قَوَارِيرَ" اور وقف "قَوَارِيرْ" دونوں میں بالکل نہیں پڑھا جائے گا۔',
    displayColoredParts: [
      { text: 'قَوَارِيرَ', type: 'normal' },
      { text: 'ا۟', type: 'zaid_alif' }
    ],
    audioText: 'قَوَارِيرَا'
  }
];

// ----------------------------------------------------------------------------
// RULE 4: Words containing "Ana" root where Alif is NOT Zaid (Alif IS pronounced)
// ----------------------------------------------------------------------------
export const RULE_4_ANA_NOT_ZAID_WORDS: ZaidAlifWordItem[] = [
  {
    id: 'zaid-21-al-anamila',
    arabic: 'عَلَيْكُمُ الْأَنَامِلَ',
    ruleCategory: 'rule4_ana_not_zaid',
    ruleCategoryUrdu: 'قاعدہ ۴: کلمہ "أَنَا" میں زائد الف نہیں ہے، الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۴، آل عمران ۱۱۹',
    waslPronunciation: 'عَلَيْكُمُ الْأَنَامِلَ (الف ۱ الف کھینچ کر)',
    waqfPronunciation: 'عَلَيْكُمُ الْأَنَامِلْ',
    waslAudioText: 'عَلَيْكُمُ الْأَنَامِلَ',
    waqfAudioText: 'عَلَيْكُمُ الْأَنَامِلْ',
    spellingHijja: 'عَلَيْكُمُ الْأَنَامِلَ - نون کے بعد الف اصلی ہے، مد کی طرح پڑھا جائے گا',
    explanationUrdu: 'اس کلمے کے اندر لفظ "أَنَا" کا حصہ اصلی ہے، یہ زائد الف نہیں ہے لہٰذا اس الف کو پڑھا جائے گا۔',
    displayColoredParts: [
      { text: 'عَلَيْكُمُ الْأَ', type: 'normal' },
      { text: 'نَا', type: 'pronounced_alif' },
      { text: 'مِلَ', type: 'normal' }
    ],
    audioText: 'عَلَيْكُمُ الْأَنَامِلَ'
  },
  {
    id: 'zaid-22-anasiyya',
    arabic: 'أَنَاسِيَّ',
    ruleCategory: 'rule4_ana_not_zaid',
    ruleCategoryUrdu: 'قاعدہ ۴: کلمہ "أَنَا" میں زائد الف نہیں ہے، الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۹، الفرقان ۴۹',
    waslPronunciation: 'أَنَاسِيَّ (نون الف زبر نَا)',
    waqfPronunciation: 'أَنَاسِيّْ',
    waslAudioText: 'أَنَاسِيَّ',
    waqfAudioText: 'أَنَاسِيَّ',
    spellingHijja: 'أَنَاسِيَّ - نون الف زبر نَا کے ساتھ الف ثابت ہے',
    explanationUrdu: 'یہاں نون کے بعد کا الف اصلی ہے، زائد الف نہیں ہے، اسے کھینچ کر پڑھا جائے گا۔',
    displayColoredParts: [
      { text: 'أَ', type: 'normal' },
      { text: 'نَا', type: 'pronounced_alif' },
      { text: 'سِيَّ', type: 'normal' }
    ],
    audioText: 'أَنَاسِيَّ'
  },
  {
    id: 'zaid-23-anabu',
    arabic: 'أَنَابُوا',
    ruleCategory: 'rule4_ana_not_zaid',
    ruleCategoryUrdu: 'قاعدہ ۴: کلمہ "أَنَا" میں زائد الف نہیں ہے، الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۳، الزمر ۱۷',
    waslPronunciation: 'أَنَابُوا (نون الف زبر نَا)',
    waqfPronunciation: 'أَنَابُوْ',
    waslAudioText: 'أَنَابُوا',
    waqfAudioText: 'أَنَابُوا',
    spellingHijja: 'أَنَابُوا - نون کے ساتھ الف اصلی ہے',
    explanationUrdu: 'لفظ "أَنَابُوا" کا الف اصلی ہے زائد نہیں، اسے معمول کے مطابق پڑھیں گے۔',
    displayColoredParts: [
      { text: 'أَ', type: 'normal' },
      { text: 'نَا', type: 'pronounced_alif' },
      { text: 'بُوا', type: 'normal' }
    ],
    audioText: 'أَنَابُوا'
  },
  {
    id: 'zaid-24-lil-anami',
    arabic: 'لِلْأَنَامِ',
    ruleCategory: 'rule4_ana_not_zaid',
    ruleCategoryUrdu: 'قاعدہ ۴: کلمہ "أَنَا" میں زائد الف نہیں ہے، الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۲۷، الرحمن ۱۰',
    waslPronunciation: 'لِلْأَنَامِ',
    waqfPronunciation: 'لِلْأَنَامْ',
    waslAudioText: 'لِلْأَنَامِ',
    waqfAudioText: 'لِلْأَنَامِ',
    spellingHijja: 'لِلْأَنَامِ - نون الف زبر نَا کا الف پڑھا جائے گا',
    explanationUrdu: 'سورۃ الرحمن کے "لِلْأَنَامِ" کا الف ثابت ہے اور پڑھا جائے گا۔',
    displayColoredParts: [
      { text: 'لِلْأَ', type: 'normal' },
      { text: 'نَا', type: 'pronounced_alif' },
      { text: 'مِ', type: 'normal' }
    ],
    audioText: 'لِلْأَنَامِ'
  },
  {
    id: 'zaid-25-man-anaba',
    arabic: 'مَنْ أَنَابَ',
    ruleCategory: 'rule4_ana_not_zaid',
    ruleCategoryUrdu: 'قاعدہ ۴: کلمہ "أَنَا" میں زائد الف نہیں ہے، الف پڑھا جائے گا',
    surahRefUrdu: 'پ ۱۳، الرعد ۲۷ / پ ۲۱، لقمان ۱۵',
    waslPronunciation: 'مَنْ أَنَابَ',
    waqfPronunciation: 'مَنْ أَنَابْ',
    waslAudioText: 'مَنْ أَنَابَ',
    waqfAudioText: 'مَنْ أَنَابَ',
    spellingHijja: 'مَنْ أَنَابَ - نون کے ساتھ الف اصلی حرف ہے',
    explanationUrdu: 'یہاں الف اصلی حرف ہے، لہٰذا ۱ الف کی مقدار کھینچ کر پڑھیں گے۔',
    displayColoredParts: [
      { text: 'مَنْ أَ', type: 'normal' },
      { text: 'نَا', type: 'pronounced_alif' },
      { text: 'بَ', type: 'normal' }
    ],
    audioText: 'مَنْ أَنَابَ'
  }
];

// Combine all Zaid Alif Items
export const ALL_ZAID_ALIF_ITEMS: ZaidAlifWordItem[] = [
  ...RULE_1_ZAID_ALIF_WORDS,
  ...RULE_2_SALASILA,
  ...RULE_3_NEVER_READ_WORDS,
  ...RULE_4_ANA_NOT_ZAID_WORDS
];

// ----------------------------------------------------------------------------
// RASM UL KHATT ITEMS (جو حروف حرکت، تنوین و سکون سے خالی ہوں وہ پڑھے نہیں جاتے)
// ----------------------------------------------------------------------------
export const RASM_KHATT_GRID_ITEMS: RasmKhattItem[] = [
  {
    id: 'rk-1-ila',
    arabic: 'إِلَى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'یاء غیر ملفوظ ہے، اس کے اوپر کھڑا زبر "اِلٰى" کے طور پر پڑھا جاتا ہے۔',
    spellingHijja: 'ہَمْزَہ زَیْر اِ ، لَام کھڑا زَبَر لٰى = اِلٰى',
    displayColoredParts: [
      { text: 'إِلٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-2-ala',
    arabic: 'عَلَى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'آخری یاء رسم الخط میں ہے مگر ملفوظ نہیں، کھڑا زبر پڑھا جاتا ہے۔',
    spellingHijja: 'عَیْن زَبَر عَ ، لَام کھڑا زَبَر لٰى = عَلٰى',
    displayColoredParts: [
      { text: 'عَلٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-3-hatta',
    arabic: 'حَتَّى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'تھا کی تشدید اور کھڑے زبر کے ساتھ پڑھیں گے، آخری یاء خاموش ہے۔',
    spellingHijja: 'حَا زَبَر تَ حَتْ ، تَ کھڑا زَبَر تٰى = حَتَّى',
    displayColoredParts: [
      { text: 'حَتَّٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-4-tawalla',
    arabic: 'تَوَلَّى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'لام تشدید پر کھڑا زبر ہے، آخری یاء رسم الخط کا حصہ ہے۔',
    spellingHijja: 'تَا زَبَر تَ ، وَاو زَبَر لَ وَلْ ، لَام کھڑا زَبَر لٰى = تَوَلَّى',
    displayColoredParts: [
      { text: 'تَوَلَّٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-5-mawa',
    arabic: 'مَأْوَى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'ہمزہ ساکنہ پر جھٹکا اور واو پر کھڑا زبر ہے، یاء خاموش ہے۔',
    spellingHijja: 'مِيم زَبَر ہَمْزَہ جزم مَأْ ، وَاو کھڑا زَبَر وٰى = مَأْوَى',
    displayColoredParts: [
      { text: 'مَأْوَٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-6-amanu',
    arabic: 'آمَنُوا',
    categoryUrdu: 'الف زائدہ بعد الواو',
    silentLetter: 'ا (زائد الف)',
    explanationUrdu: 'جمع کے واو مدہ کے بعد لکھا ہوا الف غیر ملفوظ ہے۔',
    spellingHijja: 'ہَمْزَہ کھڑا زَبَر آ ، مِيم زَبَر مَ ، وَاو پَیْش وُ = آمَنُوا',
    displayColoredParts: [
      { text: 'آمَنُو', type: 'normal' },
      { text: 'ا', type: 'silent' }
    ]
  },
  {
    id: 'rk-7-bilqalami',
    arabic: 'بِالْقَلَمِ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'لام تعریف سے پہلے الف وصل ملا کر پڑھنے میں ساقط ہو جاتا ہے۔',
    spellingHijja: 'بَا زَیْر لَام جزم بِالْ ، قَاف زَبَر قَ ، لَام زَبَر لَ ، مِيم زَیْر مِ',
    displayColoredParts: [
      { text: 'بِ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'لْقَلَمِ', type: 'normal' }
    ]
  },
  {
    id: 'rk-8-bilhaqqi',
    arabic: 'بِالْحَقِّ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'باء زیر "بِ" براہِ راست لام ساکن "لْ" سے ملے گی، الف ساقط ہے۔',
    spellingHijja: 'بَا زَیْر لَام جزم بِالْ ، حَا زَبَر قَ حَقَّ ، قَاف زیر قِّ',
    displayColoredParts: [
      { text: 'بِ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'لْحَقِّ', type: 'normal' }
    ]
  },
  {
    id: 'rk-9-watlu',
    arabic: 'وَاتْلُ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'واو زبر "وَ" براہِ راست تا ساکن "تْ" سے ملے گی، الف غیر ملفوظ ہے۔',
    spellingHijja: 'وَاو زَبَر تَا جزم وَاتْ ، لَام پَیْش لُ = وَاتْلُ',
    displayColoredParts: [
      { text: 'وَ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'تْلُ', type: 'normal' }
    ]
  },
  {
    id: 'rk-10-abqa',
    arabic: 'أَبْقَى',
    categoryUrdu: 'الف مقصورہ (یاء کی صورت)',
    silentLetter: 'ی (خالی)',
    explanationUrdu: 'قاف ساکنہ پر قلقلہ اور آخری یاء رسم الخط کا حصہ ہے۔',
    spellingHijja: 'ہَمْزَہ زَبَر قَاف جزم أَبْ ، قَاف کھڑا زَبَر قٰى = أَبْقَى',
    displayColoredParts: [
      { text: 'أَبْقٰ', type: 'normal' },
      { text: 'ى', type: 'silent' }
    ]
  },
  {
    id: 'rk-11-wanhar',
    arabic: 'وَانْحَرْ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'واو زبر "وَ" نون ساکن "نْ" سے ملتی ہے، الف وصل ساقط ہے۔',
    spellingHijja: 'وَاو زَبَر نُون جزم وَانْ ، حَا زَبَر رَا جزم حَرْ = وَانْحَرْ',
    displayColoredParts: [
      { text: 'وَ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'نْحَرْ', type: 'normal' }
    ]
  },
  {
    id: 'rk-12-farghab',
    arabic: 'فَارْغَبْ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'فاء زبر "فَ" را ساکنہ "رْ" سے ملے گی، الف وصل غیر ملفوظ ہے۔',
    spellingHijja: 'فَا زَبَر رَا جزم فَارْ ، غَيْن زَبَر بَا جزم غَبْ = فَارْغَبْ',
    displayColoredParts: [
      { text: 'فَ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'رْغَبْ', type: 'normal' }
    ]
  },
  {
    id: 'rk-13-salata',
    arabic: 'صَلٰوةَ',
    categoryUrdu: 'رسم الخط واؤ (الف کی صورت)',
    silentLetter: 'و (واؤ رسم الخط)',
    explanationUrdu: 'واؤ کے اوپر کھڑا زبر الف کا کام دیتا ہے، واؤ بالذات نہیں پڑھی جاتی۔',
    spellingHijja: 'صَاد زَبَر صَ ، لَام کھڑا زَبَر لٰـ ، تَا زَبَر تَ = صَلٰوةَ',
    displayColoredParts: [
      { text: 'صَلٰ', type: 'normal' },
      { text: 'و', type: 'rasm_vowel' },
      { text: 'ةَ', type: 'normal' }
    ]
  },
  {
    id: 'rk-14-zakata',
    arabic: 'زَكٰوةَ',
    categoryUrdu: 'رسم الخط واؤ (الف کی صورت)',
    silentLetter: 'و (واؤ رسم الخط)',
    explanationUrdu: 'واؤ کے اوپر کھڑا زبر ہے، تلفظ الف کی طرح ہوگا نہ کہ واؤ کا۔',
    spellingHijja: 'زَا زَبَر زَ ، كَاف کھڑا زَبَر كٰـ ، تَا زَبَر تَ = زَكٰوةَ',
    displayColoredParts: [
      { text: 'زَكٰ', type: 'normal' },
      { text: 'و', type: 'rasm_vowel' },
      { text: 'ةَ', type: 'normal' }
    ]
  },
  {
    id: 'rk-15-ana',
    arabic: 'أَنَا',
    categoryUrdu: 'الف زائدہ (وصل میں غیر ملفوظ)',
    silentLetter: 'ا (الف زائدہ)',
    explanationUrdu: 'لفظِ أَنَا کا آخری الف وصل میں ساقط رہتا ہے۔',
    spellingHijja: 'ہَمْزَہ زَبَر أَن ، نُون زَبَر نَ',
    displayColoredParts: [
      { text: 'أَنَ', type: 'normal' },
      { text: 'ا', type: 'silent' }
    ]
  },
  {
    id: 'rk-16-bismillah',
    arabic: 'بِسْمِ اللهِ',
    categoryUrdu: 'حذف الف اسم و ہمزۃ الوصل',
    silentLetter: 'ا (الفِ اسم)',
    explanationUrdu: 'بِسمِ میں "اسم" کا الف خطاً اور لفظاً دونوں طرح حذف ہوا ہے۔',
    spellingHijja: 'بَا زیر سِين جزم بِسْ ، مِيم زیر مِ ، لَام زیر اللهِ',
    displayColoredParts: [
      { text: 'بِسْمِ اللهِ', type: 'normal' }
    ]
  },
  {
    id: 'rk-17-rabbil-alameen',
    arabic: 'رَبِّ الْعٰلَمِينَ',
    categoryUrdu: 'ہمزۃ الوصل',
    silentLetter: 'ا (الف وصل)',
    explanationUrdu: 'رَبِّ کی باء زیر براہِ راست لام ساکن سے مل رہی ہے، الف غیر ملفوظ ہے۔',
    spellingHijja: 'رَبِّ الْعٰلَمِينَ - الف وصل ساقط ہے',
    displayColoredParts: [
      { text: 'رَبِّ ', type: 'normal' },
      { text: 'ا', type: 'silent' },
      { text: 'لْعٰلَمِينَ', type: 'normal' }
    ]
  },
  {
    id: 'rk-18-malikin-naas',
    arabic: 'مَلِكِ النَّاسِ',
    categoryUrdu: 'ہمزۃ الوصل و لَام شمسیہ',
    silentLetter: 'ا + ل (الف و لام شمسیہ)',
    explanationUrdu: 'مَلِكِ کی کاف زیر براہِ راست نون مشدد "نَّ" سے ملتی ہے، الف اور لام دونوں غیر ملفوظ ہیں۔',
    spellingHijja: 'مَلِكِ النَّاسِ - الف اور لام دونوں پڑھنے میں نہیں آتے',
    displayColoredParts: [
      { text: 'مَلِكِ ', type: 'normal' },
      { text: 'ال', type: 'silent' },
      { text: 'نَّاسِ', type: 'normal' }
    ]
  }
];

// Official Rule Statements for Sabaq 15
export const ZAID_ALIF_OFFICIAL_RULES = [
  {
    id: 1,
    title: 'تعریفِ زائد الف (Zaid Alif Definition)',
    descriptionUrdu: 'قرآن پاک میں بعض جگہ الف پر گول دائرہ ”○“ (یا ”۟“) بنا ہوتا ہے، ایسے الف کو ”زائد الف“ کہتے ہیں۔'
  },
  {
    id: 2,
    title: 'قاعدہ ۱ (۶ کلمات: وصل میں نہیں، وقف میں الف)',
    descriptionUrdu: 'ان چھ کلمات میں ”زائد الف“ کو وقف (رکنے کی صورت) میں پڑھیں گے لیکن وصل (ملا کر پڑھنے کی صورت) میں نہیں پڑھیں گے: ۱) لٰكِنَّا۟ ۲) الظُّنُونَا۟ ۳) الرَّسُولَا۟ ۴) السَّبِيلَا۟ ۵) قَوَارِيرَا۟ (پہلا) ۶) أَنَا۟ (ہر جگہ)۔'
  },
  {
    id: 3,
    title: 'قاعدہ ۲ (کلمہ "سَلٰسِلَا۟": اختیاری وقف)',
    descriptionUrdu: 'قرآن پاک کے اس ایک کلمے ”سَلٰسِلَا۟“ (پ ۲۹، سورة الدھر ۴) کے زائد الف کو وقف میں پڑھنا "سَلٰسِلَا" اور نہ پڑھنا "سَلٰسِلْ" دونوں جائز ہیں۔ البتہ وصل میں اس زائد الف کو ہرگز نہیں پڑھیں گے۔'
  },
  {
    id: 4,
    title: 'قاعدہ ۳ (زائد الف جو کسی صورت نہیں پڑھا جاتا)',
    descriptionUrdu: 'ان تمام کلمات میں زائد الف کو وصلاً (ملا کر پڑھنے) اور وقفا (رکنے) دونوں اعتبار سے نہیں پڑھیں گے: أَفَإِي۟ن مَّاتَ، أَفَإِي۟ن مُّتَّ، لَا۟ اِلَى الْجَحِيمِ، مَلَإِي۟هِ، وَلَا۟ اَوْضَعُوا، وَمَلَإِي۟هِمْ، ثَمُودَا۟ (۴ مقامات)، لِتَتْلُوا۟، لَنْ نَّدْعُوَا۟، لِيَرْبُوَا۟، لِيَبْلُوَا۟، وَنَبْلُوَا۟، اور قَوَارِيرَا۟ (دوسرا)۔'
  },
  {
    id: 5,
    title: 'قاعدہ ۴ (مشتقاتِ "أَنَا": الف اصلی ہے، پڑھا جائے گا)',
    descriptionUrdu: 'ان تمام کلمات کے لفظِ ”أَنَا“ میں زائد الف نہیں ہے لہٰذا اس الف کو معمول کے مطابق ۱ الف کھینچ کر پڑھیں گے: ۱) عَلَيْكُمُ الْأَنَامِلَ ۲) أَنَاسِيَّ ۳) أَنَابُوا ۴) لِلْأَنَامِ ۵) مَنْ أَنَابَ۔'
  },
  {
    id: 6,
    title: 'قاعدہ رسم الخط (غیر ملفوظ حروف)',
    descriptionUrdu: 'جو حروف حرکت، تنوین، و سکون سے خالی ہوں وہ کتابت میں لکھے جاتے ہیں، مگر تلاوت میں پڑھے نہیں جاتے۔ علامتاً کے طور پر چھوٹے دائرے یا رنگ سے ظاہر کیے جاتے ہیں۔'
  }
];
