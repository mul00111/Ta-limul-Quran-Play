export interface TashdeedItem {
  id: number;
  arabic: string;
  transliteration: string;
  urduTranslation?: string;
  category: 'basic' | 'ghunnah' | 'shaddah_rules' | 'words' | 'exam';
  categoryLabelUrdu: string;
  ruleNoteUrdu?: string;
  isGhunnah?: boolean;
  rowNumber?: number;
  urduSpelling?: string;
  breakdownParts?: string[];
  tajweedNote?: string;
}

export const TASHDEED_RULES = [
  {
    id: 1,
    title: 'تشدید کی تعریف',
    urdu: 'تین دندان " ّ " والی شکل کو تشدید کہتے ہیں۔ جس حرف پر تشدید ہو اسے مشدّد کہتے ہیں۔',
  },
  {
    id: 2,
    title: 'مشدد حرف کی ادائی',
    urdu: 'مشدّد حرف کو دو مرتبہ پڑھتے ہیں: ایک مرتبہ اپنے سے پہلے والے متحرک حرف سے ملا کر اور دوسری مرتبہ خود اپنی حرکت کے مطابق ذرا رک کر سختی سے ادا کرتے ہیں۔',
  },
  {
    id: 3,
    title: 'نون و میم مشدد میں غنہ',
    urdu: 'نونِ مشدّد (نّ) اور میمِ مشدّد (مّ) میں ہمیشہ غنّہ ہوتا ہے۔ غنّہ کے معنیٰ ناک میں آواز لے جانا ہے، غنّہ کی مقدار ایک الف (۲ حرکات) کے برابر ہے۔',
  },
  {
    id: 4,
    title: 'مشدد حروف میں ٹھہراؤ و سختی',
    urdu: 'مشدد حرف کو ادا کرتے ہوئے آواز میں سختی اور جماؤ پیدا کیا جاتا ہے تاکہ تشدید کی واضح ادائی ہو۔',
  },
  {
    id: 5,
    title: 'ساکن کے بعد مشدد حرف کا حکم',
    urdu: 'پہلا حرف متحرک، دوسرا حرف ساکن اور تیسرا حرف مشدد ہو تو اکثر مشدد (ہمیشہ نہیں) ساکن حرف کو چھوڑ دیں گے اور متحرک حرف کو مشدد حرف سے ملا کر پڑھیں گے ( جیسے عَبَدْتُّمْ کو عَبَتُّمْ پڑھیں گے )۔',
  },
  {
    id: 6,
    title: 'ہم آواز حروف میں فرق',
    urdu: 'اس سبق میں تشدید کی مشق کے ساتھ ساتھ ملتی جلتی آواز والے حروف میں واضح فرق کریں۔',
  }
];

export const TASHDEED_ITEMS: TashdeedItem[] = [
  // --- BASIC TASHDEED ALPHABET COMBINATIONS ---
  { id: 1, arabic: 'أَتَّ', transliteration: 'At-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 2, arabic: 'إِتَّ', transliteration: 'It-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 3, arabic: 'أُتَّ', transliteration: 'Ut-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 4, arabic: 'أَثَّ', transliteration: 'Ath-tha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 5, arabic: 'إِثَّ', transliteration: 'Ith-tha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 6, arabic: 'أُثَّ', transliteration: 'Uth-tha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 7, arabic: 'أَجَّ', transliteration: 'Aj-ja', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 8, arabic: 'إِجَّ', transliteration: 'Ij-ja', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 9, arabic: 'أُجَّ', transliteration: 'Uj-ja', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 10, arabic: 'أَحَّ', transliteration: 'Ah-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 11, arabic: 'إِحَّ', transliteration: 'Ih-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 12, arabic: 'أُحَّ', transliteration: 'Uh-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 13, arabic: 'أَخَّ', transliteration: 'Akh-kha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 14, arabic: 'إِخَّ', transliteration: 'Ikh-kha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 15, arabic: 'أُخَّ', transliteration: 'Ukh-kha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 16, arabic: 'أَدَّ', transliteration: 'Ad-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 17, arabic: 'إِدَّ', transliteration: 'Id-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 18, arabic: 'أُدَّ', transliteration: 'Ud-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 19, arabic: 'أَذَّ', transliteration: 'Adh-dha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 20, arabic: 'إِذَّ', transliteration: 'Idh-dha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 21, arabic: 'أُذَّ', transliteration: 'Udh-dha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 22, arabic: 'أَرَّ', transliteration: 'Ar-ra', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 23, arabic: 'إِرَّ', transliteration: 'Ir-ra', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 24, arabic: 'أُرَّ', transliteration: 'Ur-ra', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 25, arabic: 'أَزَّ', transliteration: 'Az-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 26, arabic: 'إِزَّ', transliteration: 'Iz-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 27, arabic: 'أُزَّ', transliteration: 'Uz-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 28, arabic: 'أَسَّ', transliteration: 'As-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 29, arabic: 'إِسَّ', transliteration: 'Is-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 30, arabic: 'أُسَّ', transliteration: 'Us-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 31, arabic: 'أَشَّ', transliteration: 'Ash-sha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 32, arabic: 'إِشَّ', transliteration: 'Ish-sha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 33, arabic: 'أُشَّ', transliteration: 'Ush-sha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 34, arabic: 'أَصَّ', transliteration: 'As-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 35, arabic: 'إِصَّ', transliteration: 'Is-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 36, arabic: 'أُصَّ', transliteration: 'Us-sa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 37, arabic: 'أَضَّ', transliteration: 'Ad-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 38, arabic: 'إِضَّ', transliteration: 'Id-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 39, arabic: 'أُضَّ', transliteration: 'Ud-da', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 40, arabic: 'أَطَّ', transliteration: 'At-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 41, arabic: 'إِطَّ', transliteration: 'It-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 42, arabic: 'أُطَّ', transliteration: 'Ut-ta', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 43, arabic: 'أَظَّ', transliteration: 'Az-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 44, arabic: 'إِظَّ', transliteration: 'Iz-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 45, arabic: 'أُظَّ', transliteration: 'Uz-za', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 46, arabic: 'أَعَّ', transliteration: 'A\'\'-\'\'a', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 47, arabic: 'إِعَّ', transliteration: 'I\'\'-\'\'a', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 48, arabic: 'أُعَّ', transliteration: 'U\'\'-\'\'a', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 49, arabic: 'أَغَّ', transliteration: 'Agh-gha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 50, arabic: 'إِغَّ', transliteration: 'Igh-gha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 51, arabic: 'أُغَّ', transliteration: 'Ugh-gha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 52, arabic: 'أَفَّ', transliteration: 'Af-fa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 53, arabic: 'إِفَّ', transliteration: 'If-fa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 54, arabic: 'أُفَّ', transliteration: 'Uf-fa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 55, arabic: 'أَقَّ', transliteration: 'Aq-qa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 56, arabic: 'إِقَّ', transliteration: 'Iq-qa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 57, arabic: 'أُقَّ', transliteration: 'Uq-qa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 58, arabic: 'أَكَّ', transliteration: 'Ak-ka', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 59, arabic: 'إِكَّ', transliteration: 'Ik-ka', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 60, arabic: 'أُكَّ', transliteration: 'Uk-ka', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 61, arabic: 'أَلَّ', transliteration: 'Al-la', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 62, arabic: 'إِلَّ', transliteration: 'Il-la', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 63, arabic: 'أُلَّ', transliteration: 'Ul-la', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 64, arabic: 'أَمَّ', transliteration: 'Am-ma', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },
  { id: 65, arabic: 'إِمَّ', transliteration: 'Im-ma', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },
  { id: 66, arabic: 'أُمَّ', transliteration: 'Um-ma', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },

  { id: 67, arabic: 'أَنَّ', transliteration: 'An-na', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },
  { id: 68, arabic: 'إِنَّ', transliteration: 'In-na', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },
  { id: 69, arabic: 'أُنَّ', transliteration: 'Un-na', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی', isGhunnah: true },

  { id: 70, arabic: 'أَوَّ', transliteration: 'Aw-wa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 71, arabic: 'إِوَّ', transliteration: 'Iw-wa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 72, arabic: 'أُؤَّ', transliteration: 'Uw-wa', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 73, arabic: 'أَهَّ', transliteration: 'Ah-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 74, arabic: 'إِهَّ', transliteration: 'Ih-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 75, arabic: 'أُهَّ', transliteration: 'Uh-ha', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  { id: 76, arabic: 'أَيَّ', transliteration: 'Ay-ya', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 77, arabic: 'إِيَّ', transliteration: 'Iy-ya', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },
  { id: 78, arabic: 'أُيَّ', transliteration: 'Uy-ya', category: 'basic', categoryLabelUrdu: 'تَشْدِیْد کی بنیادی تختی' },

  // --- GHUNNAH PRACTICE (NOON & MEEM MUSHADDAD) ---
  { id: 101, arabic: 'إِنَّ', transliteration: 'In-na', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true, ruleNoteUrdu: 'نون مشدد میں ناک میں آواز لے جا کر غنہ کریں' },
  { id: 102, arabic: 'ثُمَّ', transliteration: 'Thum-ma', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true, ruleNoteUrdu: 'میم مشدد میں ناک میں ۱ الف غنہ کریں' },
  { id: 103, arabic: 'عَمَّ', transliteration: 'Am-ma', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 104, arabic: 'أَمَّا', transliteration: 'Am-maa', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 105, arabic: 'أُمَّهُ', transliteration: 'Um-ma-hu', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 106, arabic: 'مِمَّا', transliteration: 'Mim-maa', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 107, arabic: 'كُنَّا', transliteration: 'Kun-naa', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 108, arabic: 'إِنَّا', transliteration: 'In-naa', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 109, arabic: 'إِنِّي', transliteration: 'In-nee', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 110, arabic: 'جِنَّةٍ', transliteration: 'Jin-na-tin', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 111, arabic: 'خُنَّسٍ', transliteration: 'Khun-na-sin', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },
  { id: 112, arabic: 'أُمَّةً', transliteration: 'Um-ma-tan', category: 'ghunnah', categoryLabelUrdu: 'نون و میم مشدد (غنہ)', isGhunnah: true },

  // --- SHADDAH RULES PRACTICE (STRENGTH & HOLD) ---
  { id: 201, arabic: 'رَبَّ', transliteration: 'Rab-ba', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ', ruleNoteUrdu: 'باء پر تشدید - جماؤ کے ساتھ ادا کریں' },
  { id: 202, arabic: 'رَبِّ', transliteration: 'Rab-bi', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 203, arabic: 'رَبُّهُ', transliteration: 'Rab-bu-hu', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 204, arabic: 'حُبَّ', transliteration: 'Hub-ba', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 205, arabic: 'أَحَبَّ', transliteration: 'A-hab-ba', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 206, arabic: 'فِي الْحَجِّ', transliteration: 'Fil-Haj-ji', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ', ruleNoteUrdu: 'جیم مشدد پر جماؤ کے ساتھ ادا کریں' },
  { id: 207, arabic: 'الثَّاقِبُ', transliteration: 'Ath-thaa-qi-bu', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 208, arabic: 'شَحَّ', transliteration: 'Shah-ha', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },
  { id: 209, arabic: 'ثَجَّاجًا', transliteration: 'Thaj-jaa-jan', category: 'shaddah_rules', categoryLabelUrdu: 'مشدد حروف میں سختی و جماؤ' },

  // --- MASHQ QURANIC WORDS WITH TASHDEED ---
  { id: 301, arabic: 'وَالتِّينِ', transliteration: 'Wat-Teeni', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 302, arabic: 'بِالتَّقْوَى', transliteration: 'Bit-Taqwaa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 303, arabic: 'مُسَخَّرَاتٍ', transliteration: 'Mu-sakh-kha-raatin', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 304, arabic: 'صَدَّقَ', transliteration: 'Sad-da-qa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 305, arabic: 'تَصَدَّى', transliteration: 'Ta-sad-daa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 306, arabic: 'الدَّرَجَاتِ', transliteration: 'Ad-Da-ra-jaati', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 307, arabic: 'مِنَ اللَّهِ', transliteration: 'Mi-nal-Laahi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 308, arabic: 'وَالذَّاكِرِينَ', transliteration: 'Wadh-Dhaaki-reena', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 309, arabic: 'الرَّحْمَنِ', transliteration: 'Ar-Rahmaani', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 310, arabic: 'نَزَّلَ', transliteration: 'Naz-za-la', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 311, arabic: 'فَسَنُيَسِّرُهُ', transliteration: 'Fa-sa-nu-yas-si-ruhu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 312, arabic: 'وَالشَّمْسِ', transliteration: 'Wash-Shamsi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 313, arabic: 'نَقُصُّ', transliteration: 'Na-qussu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 314, arabic: 'وَالصَّالِحِينَ', transliteration: 'Was-Saali-heena', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 315, arabic: 'وَضَلَّنَا', transliteration: 'Wa-dal-la-naa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 316, arabic: 'وَالضُّحَى', transliteration: 'Wad-Duhaa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 317, arabic: 'وَالطُّورِ', transliteration: 'Wat-Toori', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 318, arabic: 'وَالطَّيْرِ', transliteration: 'Wat-Tayri', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 319, arabic: 'الطَّلَاقِ', transliteration: 'At-Talaaqi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 320, arabic: 'وَالظَّاهِرُ', transliteration: 'Waz-Zaahiru', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 321, arabic: 'لِلظَّالِمِينَ', transliteration: 'Lidh-Thaalimeena', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 322, arabic: 'سُعِّرَتْ', transliteration: 'Su\'\'-i-rat', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 323, arabic: 'يُوَفِّ', transliteration: 'Yu-waf-fi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 324, arabic: 'حَقَّتْ', transliteration: 'Haq-qat', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 325, arabic: 'حَقَّ', transliteration: 'Haq-qa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 326, arabic: 'رَبِّكَ', transliteration: 'Rab-bi-ka', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 327, arabic: 'وَالَّذِينَ', transliteration: 'Wal-Lazeena', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 328, arabic: 'فَأُمُّهُ', transliteration: 'Fa-um-muhu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 329, arabic: 'مُسَمًّى', transliteration: 'Mu-sam-man', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ', urduSpelling: 'ميم پیش مُ، سِينْ مِيمْ زَبَر سَمْ، يَ دو زَبَر يَنْ', breakdownParts: ['مُ', 'سَمَّ', 'ى'], tajweedNote: 'میم مشدد اور تنوین مع الف مقصورہ' },
  { id: 330, arabic: 'جَنَّتٍ', transliteration: 'Jan-naatin', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 331, arabic: 'وَالنَّشِطَتِ', transliteration: 'Wan-Naashitaati', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 332, arabic: 'وَالنَّجْمِ', transliteration: 'Wan-Najmi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 333, arabic: 'مُطَهَّرَةٍ', transliteration: 'Mu-tah-ha-ratin', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 334, arabic: 'كُوِّرَتْ', transliteration: 'Kuw-wi-rat', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 335, arabic: 'سُيِّرَتْ', transliteration: 'Suy-yi-rat', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 336, arabic: 'يَذَّكَّرُ', transliteration: 'Yadh-dhak-karu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 337, arabic: 'لِيَدَّبَّرُوا', transliteration: 'Li-yad-dab-ba-roo', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 338, arabic: 'ذُرِّيَّتَهُ', transliteration: 'Dhur-riy-ya-ta-hu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 339, arabic: 'مُزَّمِّلُ', transliteration: 'Muz-zam-milu', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 340, arabic: 'مُدَّثِّرُ', transliteration: 'Mud-dash-shiru', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 341, arabic: 'عَلَى النَّبِيِّ', transliteration: 'A-lan-Na-biy-yi', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 342, arabic: 'يَسَّمَّعُونَ', transliteration: 'Yas-sam-ma-\'\'oo-na', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 343, arabic: 'عِلِّيُّونَ', transliteration: 'Illiy-yoo-na', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 344, arabic: 'يُزَكَّى', transliteration: 'Yu-zak-kaa', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 345, arabic: 'مِنَ الطَّيِّبَتِ', transliteration: 'Mi-nat-Tay-yi-baati', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 346, arabic: 'إِنَّ الظَّنَّ', transliteration: 'In-naz-Zan-na', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 347, arabic: 'مَدَّ الظِّلَّ', transliteration: 'Mad-daz-Zil-la', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },
  { id: 348, arabic: 'شَرِّ النَّفَّاثَاتِ', transliteration: 'Shar-rin-Naf-faa-thaati', category: 'words', categoryLabelUrdu: 'مشق کلماتِ قرآنیہ' },

  // --- EXAM / IMTIHAN TASHDEED ITEMS ---
  { id: 401, arabic: 'عَلَّمَ', transliteration: 'Al-la-ma', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 402, arabic: 'نَزَّلَ', transliteration: 'Naz-za-la', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 403, arabic: 'صَدَّقَ', transliteration: 'Sad-da-qa', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 404, arabic: 'كَذَّبَ', transliteration: 'Kadh-dha-ba', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 405, arabic: 'قَدَّرَ', transliteration: 'Qad-da-ra', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 406, arabic: 'لِلّٰهِ', transliteration: 'Lil-Laahi', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 407, arabic: 'ثَوَّبَ', transliteration: 'Thaw-wa-ba', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 408, arabic: 'خَنَّاسٍ', transliteration: 'Khan-naa-sin', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 409, arabic: 'زَكَّاهَا', transliteration: 'Zak-kaa-haa', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 410, arabic: 'دَسَّاهَا', transliteration: 'Das-saa-haa', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 411, arabic: 'كَرَّةً', transliteration: 'Kar-ra-tan', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 412, arabic: 'بِرَبِّ', transliteration: 'Bi-rab-bi', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 413, arabic: 'مُحَمَّدٌ', transliteration: 'Mu-ham-ma-dun', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 414, arabic: 'يَدُعُّ', transliteration: 'Ya-du\'\'-\'\'u', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 415, arabic: 'بَأَيِّ', transliteration: 'Ba-ay-yi', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 416, arabic: 'تَوَّابًا', transliteration: 'Taw-waa-ban', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 417, arabic: 'جَنَّتٍ', transliteration: 'Jan-naatin', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 418, arabic: 'رَبَّهُمْ', transliteration: 'Rab-ba-hum', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 419, arabic: 'مُدَّتْ', transliteration: 'Mud-dat', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 420, arabic: 'فَعَّالٌ', transliteration: 'Fa\'\'-\'\'aa-lun', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 421, arabic: 'تَفَرَّقَ', transliteration: 'Ta-far-ra-qa', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 422, arabic: 'فَذَكِّرْ', transliteration: 'Fa-dhak-kir', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 423, arabic: 'وَدَّعَكَ', transliteration: 'Wad-da-\'\'a-ka', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 424, arabic: 'بَيِّنَةُ', transliteration: 'Bay-yi-na-tu', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 425, arabic: 'نَفَّثٰتِ', transliteration: 'Naf-faa-thaati', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 426, arabic: 'قَيِّمَةُ', transliteration: 'Qay-yi-ma-tu', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 427, arabic: 'تَحَدَّثُ', transliteration: 'Ta-had-da-thu', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 428, arabic: 'سُجِّرَتْ', transliteration: 'Suj-ji-rat', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 429, arabic: 'سِجِّيلٍ', transliteration: 'Sij-jeelin', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 430, arabic: 'زُوِّجَتْ', transliteration: 'Zuw-wi-jat', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 431, arabic: 'يَحُضُّ', transliteration: 'Ya-hud-du', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' },
  { id: 432, arabic: 'فَسَبِّحْ', transliteration: 'Fa-sab-bih', category: 'exam', categoryLabelUrdu: 'امتحانِ تشدید' }
];
