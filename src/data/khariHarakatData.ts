export type KhariHarakahType = 'khara_zabar' | 'khara_zer' | 'ulta_pesh';

export interface KhariHarakahCell {
  id: number;
  letter: string;
  baseLetterName: string;
  harakahType: KhariHarakahType;
  displaySymbol: string;     // e.g. "بٰ" or "بٖ" or "بٗ"
  arabicWithDiacritic: string; // e.g. "بَٰ" / "بِٖ" / "بُٗ"
  hijjaSpelling: string;      // e.g. "با کھڑا زبر بَا" / "با کھڑا زیر بِيْ" / "با الٹا پیش بُوْ"
  rawSound: string;           // e.g. "بَا" / "بِيْ" / "بُوْ"
  equivalentMaddah: 'alif' | 'yaa' | 'waw';
  equivalentDisplay: string;  // e.g. "بَا (الف مدہ)" / "بِيْ (یاء مدہ)" / "بُوْ (واؤ مدہ)"
  isHeavy: boolean;
  qareebSawtGroupId?: string;
  tajweedNote: string;
}

export interface KhariHarakahTriplet {
  id: number;
  baseLetter: string;
  baseLetterName: string;
  isHeavy: boolean;
  kharaZabarCell: KhariHarakahCell;
  kharaZerCell: KhariHarakahCell;
  ultaPeshCell: KhariHarakahCell;
  tripletRaw: string;   // e.g. "بٰ ، بٖ ، بٗ"
  tripletHijja: string; // e.g. "با کھڑا زبر بٰ ، با کھڑا زیر بٖ ، با الٹا پیش بٗ = بٰ ، بٖ ، بٗ"
  qareebSawtPartner?: string;
}

export interface KhariHarakatMashqWord {
  id: number;
  word: string;
  harakahType: KhariHarakahType | 'mixed';
  hijjaText: string;
  rawSound: string;
  category: 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'mixed';
  page: 19 | 20;
  meaningOrContext?: string;
  tajweedNotes: string;
  isHeavy?: boolean;
  syllableBreakdown: string[];
}

export interface QareebSawtPairItem {
  id: string;
  name: string;
  description: string;
  letters: {
    letter: string;
    letterName: string;
    isHeavy: boolean;
    kharaZabar: string;
    kharaZer: string;
    ultaPesh: string;
    soundQuality: string;
    makhrajNote: string;
  }[];
}

export interface TajweedRuleItem {
  id: number;
  title: string;
  urduDescription: string;
  exampleArabic: string;
  highlightText: string;
}

// 6 Authentic Tajweed Rules for Khari Harakat
export const KHARI_HARAKAT_RULES: TajweedRuleItem[] = [
  {
    id: 1,
    title: 'کھڑی حرکات کی تعریف',
    urduDescription: 'کھڑے زبر ( ــٰ ) ، کھڑے زیر ( ــٖ ) ، اور الٹے پیش ( ــٗ ) کو کھڑی حرکات کہتے ہیں۔',
    exampleArabic: 'بٰ ، بٖ ، بٗ',
    highlightText: '۳ کھڑی حرکات: کھڑا زبر، کھڑا زیر، الٹا پیش'
  },
  {
    id: 2,
    title: 'حروفِ مدہ کے قائم مقام',
    urduDescription: 'کھڑی حرکات حروفِ مدہ کے قائم مقام ہوتی ہیں، اس لیے ان کو بھی حروفِ مدہ کی طرح ایک الف یعنی دو حرکات کے برابر کھینچ کر پڑھا جاتا ہے۔',
    exampleArabic: 'بٰ = بَا  |  بٖ = بِيْ  |  بٗ = بُوْ',
    highlightText: '۱ الف (۲ حرکات) کے برابر کھینچیں'
  },
  {
    id: 3,
    title: 'کھڑا زبر (الف مدہ کا قائم مقام)',
    urduDescription: 'کھڑا زبر الف مدہ کی طرح ہوتا ہے اور اسے ایک الف کھینچ کر پڑھیں جیسے بٰ (با کھڑا زبر بٰ)۔',
    exampleArabic: 'طٰهٰ ، هٰذَا ، اٰدَمَ ، ذٰلِكَ ، مٰلِكِ',
    highlightText: 'کھڑا زبر = الف مدہ'
  },
  {
    id: 4,
    title: 'کھڑا زیر (یاء مدہ کا قائم مقام)',
    urduDescription: 'کھڑا زیر یاء مدہ کی طرح ہوتا ہے اور اسے ایک الف کھینچ کر پڑھیں جیسے بٖ (با کھڑا زیر بٖ)۔',
    exampleArabic: 'بِهٖ ، هٰذِهٖ ، مِثْلِهٖ ، اِلٰفِهِمْ ، عِبَادِهٖ',
    highlightText: 'کھڑا زیر = یاء مدہ'
  },
  {
    id: 5,
    title: 'الٹا پیش (واؤ مدہ کا قائم مقام)',
    urduDescription: 'الٹا پیش واؤ مدہ کی طرح ہوتا ہے اور اسے ایک الف کھینچ کر پڑھیں جیسے بٗ (با الٹا پیش بٗ)۔',
    exampleArabic: 'دَاوٗدُ ، مَالُهٗ ، وَزَادَهٗ ، عِنْدَهٗ ، لَهٗ',
    highlightText: 'الٹا پیش = واؤ مدہ'
  },
  {
    id: 6,
    title: 'حروفِ قریب الصوت میں واضح فرق',
    urduDescription: 'اس سبق میں ملتی جلتی آواز والے حروف (جیسے ت اور ط ، ز، ذ، ظ، ض ، ث، س، ص ، ك اور ق ، ه اور ح ، ء اور ع) کے تلفظ و مخارج میں نمایاں فرق کے ساتھ ادائیگی کریں۔',
    exampleArabic: 'تٰ vs طٰ  |  زٰ vs ذٰ vs ظٰ  |  سٰ vs صٰ',
    highlightText: 'قریب الصوت حروف میں باریک اور پُر کا فرق'
  }
];

// Complete 28 Arabic Letters Triplets for Sabaq 7 (Khari Harakat)
export const SABAQ_7_KHARI_TRIPLETS: KhariHarakahTriplet[] = [
  {
    id: 1,
    baseLetter: 'ت',
    baseLetterName: 'تَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 101, letter: 'ت', baseLetterName: 'تَاء', harakahType: 'khara_zabar',
      displaySymbol: 'تٰ', arabicWithDiacritic: 'تَٰ', hijjaSpelling: 'تا کھڑا زبر تٰ',
      rawSound: 'تٰ', equivalentMaddah: 'alif', equivalentDisplay: 'تَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ta-to', tajweedNote: 'ت باریک اور صاف آواز میں ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 102, letter: 'ت', baseLetterName: 'تَاء', harakahType: 'khara_zer',
      displaySymbol: 'تٖ', arabicWithDiacritic: 'تِٖ', hijjaSpelling: 'تا کھڑا زیر تٖ',
      rawSound: 'تٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'تِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ta-to', tajweedNote: 'ت کھڑا زیر تِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 103, letter: 'ت', baseLetterName: 'تَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'تٗ', arabicWithDiacritic: 'تُٗ', hijjaSpelling: 'تا الٹا پیش تٗ',
      rawSound: 'تٗ', equivalentMaddah: 'waw', equivalentDisplay: 'تُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ta-to', tajweedNote: 'ت الٹا پیش تُوْ کی طرح ہونٹ گول کر کے ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'تٰ ، تٖ ، تٗ',
    tripletHijja: 'تا کھڑا زبر تٰ ، تا کھڑا زیر تٖ ، تا الٹا پیش تٗ = تٰ ، تٖ ، تٗ',
    qareebSawtPartner: 'ط'
  },
  {
    id: 2,
    baseLetter: 'ط',
    baseLetterName: 'طَاء',
    isHeavy: true,
    kharaZabarCell: {
      id: 104, letter: 'ط', baseLetterName: 'طَاء', harakahType: 'khara_zabar',
      displaySymbol: 'طٰ', arabicWithDiacritic: 'طَٰ', hijjaSpelling: 'طا کھڑا زبر طٰ',
      rawSound: 'طٰ', equivalentMaddah: 'alif', equivalentDisplay: 'طَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'ta-to', tajweedNote: 'ط پُر (موٹا) حرفِ مستعلیہ ہے، ۱ الف موٹا کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 105, letter: 'ط', baseLetterName: 'طَاء', harakahType: 'khara_zer',
      displaySymbol: 'طٖ', arabicWithDiacritic: 'طِٖ', hijjaSpelling: 'طا کھڑا زیر طٖ',
      rawSound: 'طٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'طِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'ta-to', tajweedNote: 'ط کھڑا زیر طِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 106, letter: 'ط', baseLetterName: 'طَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'طٗ', arabicWithDiacritic: 'طُٗ', hijjaSpelling: 'طا الٹا پیش طٗ',
      rawSound: 'طٗ', equivalentMaddah: 'waw', equivalentDisplay: 'طُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'ta-to', tajweedNote: 'ط الٹا پیش طُوْ کی طرح پر اور موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'طٰ ، طٖ ، طٗ',
    tripletHijja: 'طا کھڑا زبر طٰ ، طا کھڑا زیر طٖ ، طا الٹا پیش طٗ = طٰ ، طٖ ، طٗ',
    qareebSawtPartner: 'ت'
  },
  {
    id: 3,
    baseLetter: 'ز',
    baseLetterName: 'زَا',
    isHeavy: false,
    kharaZabarCell: {
      id: 107, letter: 'ز', baseLetterName: 'زَا', harakahType: 'khara_zabar',
      displaySymbol: 'زٰ', arabicWithDiacritic: 'زَٰ', hijjaSpelling: 'زا کھڑا زبر زٰ',
      rawSound: 'زٰ', equivalentMaddah: 'alif', equivalentDisplay: 'زَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ز کی سیٹی دار تیز آواز کے ساتھ ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 108, letter: 'ز', baseLetterName: 'زَا', harakahType: 'khara_zer',
      displaySymbol: 'زٖ', arabicWithDiacritic: 'زِٖ', hijjaSpelling: 'زا کھڑا زیر زٖ',
      rawSound: 'زٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'زِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ز کھڑا زیر زِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 109, letter: 'ز', baseLetterName: 'زَا', harakahType: 'ulta_pesh',
      displaySymbol: 'زٗ', arabicWithDiacritic: 'زُٗ', hijjaSpelling: 'زا الٹا پیش زٗ',
      rawSound: 'زٗ', equivalentMaddah: 'waw', equivalentDisplay: 'زُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ز الٹا پیش زُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'زٰ ، زٖ ، زٗ',
    tripletHijja: 'زا کھڑا زبر زٰ ، زا کھڑا زیر زٖ ، زا الٹا پیش زٗ = زٰ ، زٖ ، زٗ',
    qareebSawtPartner: 'ذ'
  },
  {
    id: 4,
    baseLetter: 'ذ',
    baseLetterName: 'ذَال',
    isHeavy: false,
    kharaZabarCell: {
      id: 110, letter: 'ذ', baseLetterName: 'ذَال', harakahType: 'khara_zabar',
      displaySymbol: 'ذٰ', arabicWithDiacritic: 'ذَٰ', hijjaSpelling: 'ذال کھڑا زبر ذٰ',
      rawSound: 'ذٰ', equivalentMaddah: 'alif', equivalentDisplay: 'ذَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ذال زبان کی نوک اوپر کے دانتوں کے کنارے لگا کر نرمی سے ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 111, letter: 'ذ', baseLetterName: 'ذَال', harakahType: 'khara_zer',
      displaySymbol: 'ذٖ', arabicWithDiacritic: 'ذِٖ', hijjaSpelling: 'ذال کھڑا زیر ذٖ',
      rawSound: 'ذٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'ذِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ذال کھڑا زیر ذِيْ کی طرح نرمی سے ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 112, letter: 'ذ', baseLetterName: 'ذَال', harakahType: 'ulta_pesh',
      displaySymbol: 'ذٗ', arabicWithDiacritic: 'ذُٗ', hijjaSpelling: 'ذال الٹا پیش ذٗ',
      rawSound: 'ذٗ', equivalentMaddah: 'waw', equivalentDisplay: 'ذُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ذال الٹا پیش ذُوْ کی طرح نرمی سے ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'ذٰ ، ذٖ ، ذٗ',
    tripletHijja: 'ذال کھڑا زبر ذٰ ، ذال کھڑا زیر ذٖ ، ذال الٹا پیش ذٗ = ذٰ ، ذٖ ، ذٗ',
    qareebSawtPartner: 'ظ'
  },
  {
    id: 5,
    baseLetter: 'ظ',
    baseLetterName: 'ظَاء',
    isHeavy: true,
    kharaZabarCell: {
      id: 113, letter: 'ظ', baseLetterName: 'ظَاء', harakahType: 'khara_zabar',
      displaySymbol: 'ظٰ', arabicWithDiacritic: 'ظَٰ', hijjaSpelling: 'ظا کھڑا زبر ظٰ',
      rawSound: 'ظٰ', equivalentMaddah: 'alif', equivalentDisplay: 'ظَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ظ پُر (موٹا) اور نرم حرف ہے، ۱ الف موٹا کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 114, letter: 'ظ', baseLetterName: 'ظَاء', harakahType: 'khara_zer',
      displaySymbol: 'ظٖ', arabicWithDiacritic: 'ظِٖ', hijjaSpelling: 'ظا کھڑا زیر ظٖ',
      rawSound: 'ظٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'ظِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ظ کھڑا زیر ظِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 115, letter: 'ظ', baseLetterName: 'ظَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'ظٗ', arabicWithDiacritic: 'ظُٗ', hijjaSpelling: 'ظا الٹا پیش ظٗ',
      rawSound: 'ظٗ', equivalentMaddah: 'waw', equivalentDisplay: 'ظُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ظ الٹا پیش ظُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'ظٰ ، ظٖ ، ظٗ',
    tripletHijja: 'ظا کھڑا زبر ظٰ ، ظا کھڑا زیر ظٖ ، ظا الٹا پیش ظٗ = ظٰ ، ظٖ ، ظٗ',
    qareebSawtPartner: 'ذ'
  },
  {
    id: 6,
    baseLetter: 'ث',
    baseLetterName: 'ثَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 116, letter: 'ث', baseLetterName: 'ثَاء', harakahType: 'khara_zabar',
      displaySymbol: 'ثٰ', arabicWithDiacritic: 'ثَٰ', hijjaSpelling: 'ثا کھڑا زبر ثٰ',
      rawSound: 'ثٰ', equivalentMaddah: 'alif', equivalentDisplay: 'ثَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'ثا نرمی سے بغیر سیٹی کے ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 117, letter: 'ث', baseLetterName: 'ثَاء', harakahType: 'khara_zer',
      displaySymbol: 'ثٖ', arabicWithDiacritic: 'ثِٖ', hijjaSpelling: 'ثا کھڑا زیر ثٖ',
      rawSound: 'ثٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'ثِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'ثا کھڑا زیر ثِيْ کی طرح نرمی سے ۱ الف کھینچیں۔'
    },
    ultaPeshCell: {
      id: 118, letter: 'ث', baseLetterName: 'ثَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'ثٗ', arabicWithDiacritic: 'ثُٗ', hijjaSpelling: 'ثا الٹا پیش ثٗ',
      rawSound: 'ثٗ', equivalentMaddah: 'waw', equivalentDisplay: 'ثُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'ثا الٹا پیش ثُوْ کی طرح نرمی سے ۱ الف کھینچیں۔'
    },
    tripletRaw: 'ثٰ ، ثٖ ، ثٗ',
    tripletHijja: 'ثا کھڑا زبر ثٰ ، ثا کھڑا زیر ثٖ ، ثا الٹا پیش ثٗ = ثٰ ، ثٖ ، ثٗ',
    qareebSawtPartner: 'س'
  },
  {
    id: 7,
    baseLetter: 'س',
    baseLetterName: 'سِين',
    isHeavy: false,
    kharaZabarCell: {
      id: 119, letter: 'س', baseLetterName: 'سِين', harakahType: 'khara_zabar',
      displaySymbol: 'سٰ', arabicWithDiacritic: 'سَٰ', hijjaSpelling: 'سین کھڑا زبر سٰ',
      rawSound: 'سٰ', equivalentMaddah: 'alif', equivalentDisplay: 'سَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'سین باریک اور تیز سیٹی کے ساتھ ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 120, letter: 'س', baseLetterName: 'سِين', harakahType: 'khara_zer',
      displaySymbol: 'سٖ', arabicWithDiacritic: 'سِٖ', hijjaSpelling: 'سین کھڑا زیر سٖ',
      rawSound: 'سٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'سِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'سین کھڑا زیر سِيْ کی طرح باریک ۱ الف کھینچیں۔'
    },
    ultaPeshCell: {
      id: 121, letter: 'س', baseLetterName: 'سِين', harakahType: 'ulta_pesh',
      displaySymbol: 'سٗ', arabicWithDiacritic: 'سُٗ', hijjaSpelling: 'سین الٹا پیش سٗ',
      rawSound: 'سٗ', equivalentMaddah: 'waw', equivalentDisplay: 'سُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'سین الٹا پیش سُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'سٰ ، سٖ ، سٗ',
    tripletHijja: 'سین کھڑا زبر سٰ ، سین کھڑا زیر سٖ ، سین الٹا پیش سٗ = سٰ ، سٖ ، سٗ',
    qareebSawtPartner: 'ص'
  },
  {
    id: 8,
    baseLetter: 'ص',
    baseLetterName: 'صَاد',
    isHeavy: true,
    kharaZabarCell: {
      id: 122, letter: 'ص', baseLetterName: 'صَاد', harakahType: 'khara_zabar',
      displaySymbol: 'صٰ', arabicWithDiacritic: 'صَٰ', hijjaSpelling: 'صاد کھڑا زبر صٰ',
      rawSound: 'صٰ', equivalentMaddah: 'alif', equivalentDisplay: 'صَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'صاد پُر (موٹا) اور سیٹی والا حرف ہے، ۱ الف موٹا کھینچیں۔'
    },
    kharaZerCell: {
      id: 123, letter: 'ص', baseLetterName: 'صَاد', harakahType: 'khara_zer',
      displaySymbol: 'صٖ', arabicWithDiacritic: 'صِٖ', hijjaSpelling: 'صاد کھڑا زیر صٖ',
      rawSound: 'صٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'صِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'صاد کھڑا زیر صِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 124, letter: 'ص', baseLetterName: 'صَاد', harakahType: 'ulta_pesh',
      displaySymbol: 'صٗ', arabicWithDiacritic: 'صُٗ', hijjaSpelling: 'صاد الٹا پیش صٗ',
      rawSound: 'صٗ', equivalentMaddah: 'waw', equivalentDisplay: 'صُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'sa-seen-saad', tajweedNote: 'صاد الٹا پیش صُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'صٰ ، صٖ ، صٗ',
    tripletHijja: 'صاد کھڑا زبر صٰ ، صاد کھڑا زیر صٖ ، صاد الٹا پیش صٗ = صٰ ، صٖ ، صٗ',
    qareebSawtPartner: 'س'
  },
  {
    id: 9,
    baseLetter: 'ض',
    baseLetterName: 'ضَاد',
    isHeavy: true,
    kharaZabarCell: {
      id: 125, letter: 'ض', baseLetterName: 'ضَاد', harakahType: 'khara_zabar',
      displaySymbol: 'ضٰ', arabicWithDiacritic: 'ضَٰ', hijjaSpelling: 'ضاد کھڑا زبر ضٰ',
      rawSound: 'ضٰ', equivalentMaddah: 'alif', equivalentDisplay: 'ضَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ضاد زبان کی کروٹ داڑھوں سے لگا کر موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 126, letter: 'ض', baseLetterName: 'ضَاد', harakahType: 'khara_zer',
      displaySymbol: 'ضٖ', arabicWithDiacritic: 'ضِٖ', hijjaSpelling: 'ضاد کھڑا زیر ضٖ',
      rawSound: 'ضٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'ضِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ضاد کھڑا زیر ضِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 127, letter: 'ض', baseLetterName: 'ضَاد', harakahType: 'ulta_pesh',
      displaySymbol: 'ضٗ', arabicWithDiacritic: 'ضُٗ', hijjaSpelling: 'ضاد الٹا پیش ضٗ',
      rawSound: 'ضٗ', equivalentMaddah: 'waw', equivalentDisplay: 'ضُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'za-dhal-zaa', tajweedNote: 'ضاد الٹا پیش ضُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'ضٰ ، ضٖ ، ضٗ',
    tripletHijja: 'ضاد کھڑا زبر ضٰ ، ضاد کھڑا زیر ضٖ ، ضاد الٹا پیش ضٗ = ضٰ ، ضٖ ، ضٗ',
    qareebSawtPartner: 'ظ'
  },
  {
    id: 10,
    baseLetter: 'ك',
    baseLetterName: 'كَاف',
    isHeavy: false,
    kharaZabarCell: {
      id: 128, letter: 'ك', baseLetterName: 'كَاف', harakahType: 'khara_zabar',
      displaySymbol: 'كٰ', arabicWithDiacritic: 'كَٰ', hijjaSpelling: 'کاف کھڑا زبر كٰ',
      rawSound: 'كٰ', equivalentMaddah: 'alif', equivalentDisplay: 'كَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'کاف باریک آواز میں ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 129, letter: 'ك', baseLetterName: 'كَاف', harakahType: 'khara_zer',
      displaySymbol: 'كٖ', arabicWithDiacritic: 'كِٖ', hijjaSpelling: 'کاف کھڑا زیر كٖ',
      rawSound: 'كٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'كِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'کاف کھڑا زیر كِيْ کی طرح باریک ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 130, letter: 'ك', baseLetterName: 'كَاف', harakahType: 'ulta_pesh',
      displaySymbol: 'كٗ', arabicWithDiacritic: 'كُٗ', hijjaSpelling: 'کاف الٹا پیش كٗ',
      rawSound: 'كٗ', equivalentMaddah: 'waw', equivalentDisplay: 'كُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'کاف الٹا پیش كُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'كٰ ، كٖ ، كٗ',
    tripletHijja: 'کاف کھڑا زبر كٰ ، کاف کھڑا زیر كٖ ، کاف الٹا پیش كٗ = كٰ ، كٖ ، كٗ',
    qareebSawtPartner: 'ق'
  },
  {
    id: 11,
    baseLetter: 'ق',
    baseLetterName: 'قَاف',
    isHeavy: true,
    kharaZabarCell: {
      id: 131, letter: 'ق', baseLetterName: 'قَاف', harakahType: 'khara_zabar',
      displaySymbol: 'قٰ', arabicWithDiacritic: 'قَٰ', hijjaSpelling: 'قاف کھڑا زبر قٰ',
      rawSound: 'قٰ', equivalentMaddah: 'alif', equivalentDisplay: 'قَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'قاف زبان کی جڑ اور کوے کے پاس سے موٹا ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 132, letter: 'ق', baseLetterName: 'قَاف', harakahType: 'khara_zer',
      displaySymbol: 'قٖ', arabicWithDiacritic: 'قِٖ', hijjaSpelling: 'قاف کھڑا زیر قٖ',
      rawSound: 'قٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'قِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'قاف کھڑا زیر قِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 133, letter: 'ق', baseLetterName: 'قَاف', harakahType: 'ulta_pesh',
      displaySymbol: 'قٗ', arabicWithDiacritic: 'قُٗ', hijjaSpelling: 'قاف الٹا پیش قٗ',
      rawSound: 'قٗ', equivalentMaddah: 'waw', equivalentDisplay: 'قُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kaf-qaaf', tajweedNote: 'قاف الٹا پیش قُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'قٰ ، قٖ ، قٗ',
    tripletHijja: 'قاف کھڑا زبر قٰ ، قاف کھڑا زیر قٖ ، قاف الٹا پیش قٗ = قٰ ، قٖ ، قٗ',
    qareebSawtPartner: 'ك'
  },
  {
    id: 12,
    baseLetter: 'ه',
    baseLetterName: 'هَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 134, letter: 'ه', baseLetterName: 'هَاء', harakahType: 'khara_zabar',
      displaySymbol: 'هٰ', arabicWithDiacritic: 'هَٰ', hijjaSpelling: 'ہا کھڑا زبر هٰ',
      rawSound: 'هٰ', equivalentMaddah: 'alif', equivalentDisplay: 'هَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'ہا سینے کے قریب حلق کے نیچے والے حصے سے ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 135, letter: 'ه', baseLetterName: 'هَاء', harakahType: 'khara_zer',
      displaySymbol: 'هٖ', arabicWithDiacritic: 'هِٖ', hijjaSpelling: 'ہا کھڑا زیر هٖ',
      rawSound: 'هٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'هِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'ہا کھڑا زیر هِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 136, letter: 'ه', baseLetterName: 'هَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'هٗ', arabicWithDiacritic: 'هُٗ', hijjaSpelling: 'ہا الٹا پیش هٗ',
      rawSound: 'هٗ', equivalentMaddah: 'waw', equivalentDisplay: 'هُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'ہا الٹا پیش هُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'هٰ ، هٖ ، هٗ',
    tripletHijja: 'ہا کھڑا زبر هٰ ، ہا کھڑا زیر هٖ ، ہا الٹا پیش هٗ = هٰ ، هٖ ، هٗ',
    qareebSawtPartner: 'ح'
  },
  {
    id: 13,
    baseLetter: 'ح',
    baseLetterName: 'حَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 137, letter: 'ح', baseLetterName: 'حَاء', harakahType: 'khara_zabar',
      displaySymbol: 'حٰ', arabicWithDiacritic: 'حَٰ', hijjaSpelling: 'حا کھڑا زبر حٰ',
      rawSound: 'حٰ', equivalentMaddah: 'alif', equivalentDisplay: 'حَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'حا حلق کے درمیان سے صاف اور شفاف آواز میں ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 138, letter: 'ح', baseLetterName: 'حَاء', harakahType: 'khara_zer',
      displaySymbol: 'حٖ', arabicWithDiacritic: 'حِٖ', hijjaSpelling: 'حا کھڑا زیر حٖ',
      rawSound: 'حٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'حِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'حا کھڑا زیر حِيْ کی طرح حلق کے درمیان سے ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 139, letter: 'ح', baseLetterName: 'حَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'حٗ', arabicWithDiacritic: 'حُٗ', hijjaSpelling: 'حا الٹا پیش حٗ',
      rawSound: 'حٗ', equivalentMaddah: 'waw', equivalentDisplay: 'حُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'ha-haa', tajweedNote: 'حا الٹا پیش حُوْ کی طرح صاف ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'حٰ ، حٖ ، حٗ',
    tripletHijja: 'حا کھڑا زبر حٰ ، حا کھڑا زیر حٖ ، حا الٹا پیش حٗ = حٰ ، حٖ ، حٗ',
    qareebSawtPartner: 'ه'
  },
  {
    id: 14,
    baseLetter: 'ء',
    baseLetterName: 'هَمْزَة',
    isHeavy: false,
    kharaZabarCell: {
      id: 140, letter: 'ء', baseLetterName: 'هَمْزَة', harakahType: 'khara_zabar',
      displaySymbol: 'اٰ / ءٰ', arabicWithDiacritic: 'اٰ', hijjaSpelling: 'ہمزہ کھڑا زبر اٰ',
      rawSound: 'اٰ', equivalentMaddah: 'alif', equivalentDisplay: 'ءَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'ہمزہ کھڑا زبر سینے کے پاس حلق کے نچلے حصے سے ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 141, letter: 'ء', baseLetterName: 'هَمْزَة', harakahType: 'khara_zer',
      displaySymbol: 'اٖ / ءٖ', arabicWithDiacritic: 'اٖ', hijjaSpelling: 'ہمزہ کھڑا زیر اٖ',
      rawSound: 'اٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'اِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'ہمزہ کھڑا زیر اِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 142, letter: 'ء', baseLetterName: 'هَمْزَة', harakahType: 'ulta_pesh',
      displaySymbol: 'اٗ / ءٗ', arabicWithDiacritic: 'اٗ', hijjaSpelling: 'ہمزہ الٹا پیش اٗ',
      rawSound: 'اٗ', equivalentMaddah: 'waw', equivalentDisplay: 'اُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'ہمزہ الٹا پیش اُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'اٰ ، اٖ ، اٗ',
    tripletHijja: 'ہمزہ کھڑا زبر اٰ ، ہمزہ کھڑا زیر اٖ ، ہمزہ الٹا پیش اٗ = اٰ ، اٖ ، اٗ',
    qareebSawtPartner: 'ع'
  },
  {
    id: 15,
    baseLetter: 'ع',
    baseLetterName: 'عَيْن',
    isHeavy: false,
    kharaZabarCell: {
      id: 143, letter: 'ع', baseLetterName: 'عَيْن', harakahType: 'khara_zabar',
      displaySymbol: 'عٰ', arabicWithDiacritic: 'عَٰ', hijjaSpelling: 'عین کھڑا زبر عٰ',
      rawSound: 'عٰ', equivalentMaddah: 'alif', equivalentDisplay: 'عَا (الف مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'عین حلق کے درمیان سے دبا کر ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 144, letter: 'ع', baseLetterName: 'عَيْن', harakahType: 'khara_zer',
      displaySymbol: 'عٖ', arabicWithDiacritic: 'عِٖ', hijjaSpelling: 'عین کھڑا زیر عٖ',
      rawSound: 'عٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'عِيْ (یاء مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'عین کھڑا زیر عِيْ کی طرح حلق کے درمیان سے ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 145, letter: 'ع', baseLetterName: 'عَيْن', harakahType: 'ulta_pesh',
      displaySymbol: 'عٗ', arabicWithDiacritic: 'عُٗ', hijjaSpelling: 'عین الٹا پیش عٗ',
      rawSound: 'عٗ', equivalentMaddah: 'waw', equivalentDisplay: 'عُوْ (واؤ مدہ)',
      isHeavy: false, qareebSawtGroupId: 'hamza-ain', tajweedNote: 'عین الٹا پیش عُوْ کی طرح حلق سے ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'عٰ ، عٖ ، عٗ',
    tripletHijja: 'عین کھڑا زبر عٰ ، عین کھڑا زیر عٖ ، عین الٹا پیش عٗ = عٰ ، عٖ ، عٗ',
    qareebSawtPartner: 'ء'
  },
  {
    id: 16,
    baseLetter: 'د',
    baseLetterName: 'دَال',
    isHeavy: false,
    kharaZabarCell: {
      id: 146, letter: 'د', baseLetterName: 'دَال', harakahType: 'khara_zabar',
      displaySymbol: 'دٰ', arabicWithDiacritic: 'دَٰ', hijjaSpelling: 'دال کھڑا زبر دٰ',
      rawSound: 'دٰ', equivalentMaddah: 'alif', equivalentDisplay: 'دَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'دال باریک آواز میں ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 147, letter: 'د', baseLetterName: 'دَال', harakahType: 'khara_zer',
      displaySymbol: 'دٖ', arabicWithDiacritic: 'دِٖ', hijjaSpelling: 'دال کھڑا زیر دٖ',
      rawSound: 'دٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'دِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'دال کھڑا زیر دِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 148, letter: 'د', baseLetterName: 'دَال', harakahType: 'ulta_pesh',
      displaySymbol: 'دٗ', arabicWithDiacritic: 'دُٗ', hijjaSpelling: 'دال الٹا پیش دٗ',
      rawSound: 'دٗ', equivalentMaddah: 'waw', equivalentDisplay: 'دُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'دال الٹا پیش دُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'دٰ ، دٖ ، دٗ',
    tripletHijja: 'دال کھڑا زبر دٰ ، دال کھڑا زیر دٖ ، دال الٹا پیش دٗ = دٰ ، دٖ ، دٗ'
  },
  {
    id: 17,
    baseLetter: 'خ',
    baseLetterName: 'خَاء',
    isHeavy: true,
    kharaZabarCell: {
      id: 149, letter: 'خ', baseLetterName: 'خَاء', harakahType: 'khara_zabar',
      displaySymbol: 'خٰ', arabicWithDiacritic: 'خَٰ', hijjaSpelling: 'خا کھڑا زبر خٰ',
      rawSound: 'خٰ', equivalentMaddah: 'alif', equivalentDisplay: 'خَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'خا حلق کے اوپر والے حصے سے پُر (موٹا) ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 150, letter: 'خ', baseLetterName: 'خَاء', harakahType: 'khara_zer',
      displaySymbol: 'خٖ', arabicWithDiacritic: 'خِٖ', hijjaSpelling: 'خا کھڑا زیر خٖ',
      rawSound: 'خٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'خِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'خا کھڑا زیر خِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 151, letter: 'خ', baseLetterName: 'خَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'خٗ', arabicWithDiacritic: 'خُٗ', hijjaSpelling: 'خا الٹا پیش خٗ',
      rawSound: 'خٗ', equivalentMaddah: 'waw', equivalentDisplay: 'خُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'خا الٹا پیش خُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'خٰ ، خٖ ، خٗ',
    tripletHijja: 'خا کھڑا زبر خٰ ، خا کھڑا زیر خٖ ، خا الٹا پیش خٗ = خٰ ، خٖ ، خٗ',
    qareebSawtPartner: 'غ'
  },
  {
    id: 18,
    baseLetter: 'غ',
    baseLetterName: 'غَيْن',
    isHeavy: true,
    kharaZabarCell: {
      id: 152, letter: 'غ', baseLetterName: 'غَيْن', harakahType: 'khara_zabar',
      displaySymbol: 'غٰ', arabicWithDiacritic: 'غَٰ', hijjaSpelling: 'غین کھڑا زبر غٰ',
      rawSound: 'غٰ', equivalentMaddah: 'alif', equivalentDisplay: 'غَا (الف مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'غین حلق کے اوپر کے حصے سے موٹا ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 153, letter: 'غ', baseLetterName: 'غَيْن', harakahType: 'khara_zer',
      displaySymbol: 'غٖ', arabicWithDiacritic: 'غِٖ', hijjaSpelling: 'غین کھڑا زیر غٖ',
      rawSound: 'غٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'غِيْ (یاء مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'غین کھڑا زیر غِيْ کی طرح موٹا ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 154, letter: 'غ', baseLetterName: 'غَيْن', harakahType: 'ulta_pesh',
      displaySymbol: 'غٗ', arabicWithDiacritic: 'غُٗ', hijjaSpelling: 'غین الٹا پیش غٗ',
      rawSound: 'غٗ', equivalentMaddah: 'waw', equivalentDisplay: 'غُوْ (واؤ مدہ)',
      isHeavy: true, qareebSawtGroupId: 'kha-ghain', tajweedNote: 'غین الٹا پیش غُوْ کی طرح پُر ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'غٰ ، غٖ ، غٗ',
    tripletHijja: 'غین کھڑا زبر غٰ ، غین کھڑا زیر غٖ ، غین الٹا پیش غٗ = غٰ ، غٖ ، غٗ',
    qareebSawtPartner: 'خ'
  },
  {
    id: 19,
    baseLetter: 'ب',
    baseLetterName: 'بَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 155, letter: 'ب', baseLetterName: 'بَاء', harakahType: 'khara_zabar',
      displaySymbol: 'بٰ', arabicWithDiacritic: 'بَٰ', hijjaSpelling: 'با کھڑا زبر بٰ',
      rawSound: 'بٰ', equivalentMaddah: 'alif', equivalentDisplay: 'بَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'با دونوں ہونٹوں کے تری والے حصے سے ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 156, letter: 'ب', baseLetterName: 'بَاء', harakahType: 'khara_zer',
      displaySymbol: 'بٖ', arabicWithDiacritic: 'بِٖ', hijjaSpelling: 'با کھڑا زیر بٖ',
      rawSound: 'بٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'بِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'با کھڑا زیر بِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 157, letter: 'ب', baseLetterName: 'بَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'بٗ', arabicWithDiacritic: 'بُٗ', hijjaSpelling: 'با الٹا پیش بٗ',
      rawSound: 'بٗ', equivalentMaddah: 'waw', equivalentDisplay: 'بُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'با الٹا پیش بُوْ کی طرح ہونٹ گول کر کے ۱ الف کھینچیں۔'
    },
    tripletRaw: 'بٰ ، بٖ ، بٗ',
    tripletHijja: 'با کھڑا زبر بٰ ، با کھڑا زیر بٖ ، با الٹا پیش بٗ = بٰ ، بٖ ، بٗ'
  },
  {
    id: 20,
    baseLetter: 'م',
    baseLetterName: 'مِيم',
    isHeavy: false,
    kharaZabarCell: {
      id: 158, letter: 'م', baseLetterName: 'مِيم', harakahType: 'khara_zabar',
      displaySymbol: 'مٰ', arabicWithDiacritic: 'مَٰ', hijjaSpelling: 'میم کھڑا زبر مٰ',
      rawSound: 'مٰ', equivalentMaddah: 'alif', equivalentDisplay: 'مَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'میم ہونٹوں کے خشک حصے سے ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 159, letter: 'م', baseLetterName: 'مِيم', harakahType: 'khara_zer',
      displaySymbol: 'مٖ', arabicWithDiacritic: 'مِٖ', hijjaSpelling: 'میم کھڑا زیر مٖ',
      rawSound: 'مٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'مِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'میم کھڑا زیر مِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 160, letter: 'م', baseLetterName: 'مِيم', harakahType: 'ulta_pesh',
      displaySymbol: 'مٗ', arabicWithDiacritic: 'مُٗ', hijjaSpelling: 'میم الٹا پیش مٗ',
      rawSound: 'مٗ', equivalentMaddah: 'waw', equivalentDisplay: 'مُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'میم الٹا پیش مُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'مٰ ، مٖ ، مٗ',
    tripletHijja: 'میم کھڑا زبر مٰ ، میم کھڑا زیر مٖ ، میم الٹا پیش مٗ = مٰ ، مٖ ، مٗ'
  },
  {
    id: 21,
    baseLetter: 'و',
    baseLetterName: 'وَاو',
    isHeavy: false,
    kharaZabarCell: {
      id: 161, letter: 'و', baseLetterName: 'وَاو', harakahType: 'khara_zabar',
      displaySymbol: 'وٰ', arabicWithDiacritic: 'وَٰ', hijjaSpelling: 'واؤ کھڑا زبر وٰ',
      rawSound: 'وٰ', equivalentMaddah: 'alif', equivalentDisplay: 'وَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'واؤ دونوں ہونٹوں کو گول کر کے ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 162, letter: 'و', baseLetterName: 'وَاو', harakahType: 'khara_zer',
      displaySymbol: 'وٖ', arabicWithDiacritic: 'وِٖ', hijjaSpelling: 'واؤ کھڑا زیر وٖ',
      rawSound: 'وٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'وِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'واؤ کھڑا زیر وِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 163, letter: 'و', baseLetterName: 'وَاو', harakahType: 'ulta_pesh',
      displaySymbol: 'وٗ', arabicWithDiacritic: 'وُٗ', hijjaSpelling: 'واؤ الٹا پیش وٗ',
      rawSound: 'وٗ', equivalentMaddah: 'waw', equivalentDisplay: 'وُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'واؤ الٹا پیش وُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'وٰ ، وٖ ، وٗ',
    tripletHijja: 'واؤ کھڑا زبر وٰ ، واؤ کھڑا زیر وٖ ، واؤ الٹا پیش وٗ = وٰ ، وٖ ، وٗ'
  },
  {
    id: 22,
    baseLetter: 'ف',
    baseLetterName: 'فَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 164, letter: 'ف', baseLetterName: 'فَاء', harakahType: 'khara_zabar',
      displaySymbol: 'فٰ', arabicWithDiacritic: 'فَٰ', hijjaSpelling: 'فا کھڑا زبر فٰ',
      rawSound: 'فٰ', equivalentMaddah: 'alif', equivalentDisplay: 'فَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'فا اوپر کے اگلے دانت نیچے کے ہونٹ سے ملا کر ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 165, letter: 'ف', baseLetterName: 'فَاء', harakahType: 'khara_zer',
      displaySymbol: 'فٖ', arabicWithDiacritic: 'فِٖ', hijjaSpelling: 'فا کھڑا زیر فٖ',
      rawSound: 'فٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'فِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'فا کھڑا زیر فِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 166, letter: 'ف', baseLetterName: 'فَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'فٗ', arabicWithDiacritic: 'فُٗ', hijjaSpelling: 'فا الٹا پیش فٗ',
      rawSound: 'فٗ', equivalentMaddah: 'waw', equivalentDisplay: 'فُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'فا الٹا پیش فُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'فٰ ، فٖ ، فٗ',
    tripletHijja: 'فا کھڑا زبر فٰ ، فا کھڑا زیر فٖ ، فا الٹا پیش فٗ = فٰ ، فٖ ، فٗ'
  },
  {
    id: 23,
    baseLetter: 'ل',
    baseLetterName: 'لَام',
    isHeavy: false,
    kharaZabarCell: {
      id: 167, letter: 'ل', baseLetterName: 'لَام', harakahType: 'khara_zabar',
      displaySymbol: 'لٰ', arabicWithDiacritic: 'لَٰ', hijjaSpelling: 'لام کھڑا زبر لٰ',
      rawSound: 'لٰ', equivalentMaddah: 'alif', equivalentDisplay: 'لَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'لام زبان کی نوک اور تالو سے باریک ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 168, letter: 'ل', baseLetterName: 'لَام', harakahType: 'khara_zer',
      displaySymbol: 'لٖ', arabicWithDiacritic: 'لِٖ', hijjaSpelling: 'لام کھڑا زیر لٖ',
      rawSound: 'لٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'لِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'لام کھڑا زیر لِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 169, letter: 'ل', baseLetterName: 'لَام', harakahType: 'ulta_pesh',
      displaySymbol: 'لٗ', arabicWithDiacritic: 'لُٗ', hijjaSpelling: 'لام الٹا پیش لٗ',
      rawSound: 'لٗ', equivalentMaddah: 'waw', equivalentDisplay: 'لُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'لام الٹا پیش لُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'لٰ ، لٖ ، لٗ',
    tripletHijja: 'لام کھڑا زبر لٰ ، لام کھڑا زیر لٖ ، لام الٹا پیش لٗ = لٰ ، لٖ ، لٗ'
  },
  {
    id: 24,
    baseLetter: 'ن',
    baseLetterName: 'نُون',
    isHeavy: false,
    kharaZabarCell: {
      id: 170, letter: 'ن', baseLetterName: 'نُون', harakahType: 'khara_zabar',
      displaySymbol: 'نٰ', arabicWithDiacritic: 'نَٰ', hijjaSpelling: 'نون کھڑا زبر نٰ',
      rawSound: 'نٰ', equivalentMaddah: 'alif', equivalentDisplay: 'نَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'نون زبان کی نوک سے باریک ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 171, letter: 'ن', baseLetterName: 'نُون', harakahType: 'khara_zer',
      displaySymbol: 'نٖ', arabicWithDiacritic: 'نِٖ', hijjaSpelling: 'نون کھڑا زیر نٖ',
      rawSound: 'نٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'نِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'نون کھڑا زیر نِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 172, letter: 'ن', baseLetterName: 'نُون', harakahType: 'ulta_pesh',
      displaySymbol: 'نٗ', arabicWithDiacritic: 'نُٗ', hijjaSpelling: 'نون الٹا پیش نٗ',
      rawSound: 'نٗ', equivalentMaddah: 'waw', equivalentDisplay: 'نُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'نون الٹا پیش نُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'نٰ ، نٖ ، نٗ',
    tripletHijja: 'نون کھڑا زبر نٰ ، نون کھڑا زیر نٖ ، نون الٹا پیش نٗ = نٰ ، نٖ ، نٗ'
  },
  {
    id: 25,
    baseLetter: 'ر',
    baseLetterName: 'رَاء',
    isHeavy: true, // Ra with zabar/pesh is heavy
    kharaZabarCell: {
      id: 173, letter: 'ر', baseLetterName: 'رَاء', harakahType: 'khara_zabar',
      displaySymbol: 'رٰ', arabicWithDiacritic: 'رَٰ', hijjaSpelling: 'را کھڑا زبر رٰ',
      rawSound: 'رٰ', equivalentMaddah: 'alif', equivalentDisplay: 'رَا (الف مدہ)',
      isHeavy: true, tajweedNote: 'را پر کھڑا زبر ہو تو پُر (موٹا) ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 174, letter: 'ر', baseLetterName: 'رَاء', harakahType: 'khara_zer',
      displaySymbol: 'رٖ', arabicWithDiacritic: 'رِٖ', hijjaSpelling: 'را کھڑا زیر رٖ',
      rawSound: 'رٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'رِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'را کے نیچے کھڑا زیر ہو تو باریک ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 175, letter: 'ر', baseLetterName: 'رَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'رٗ', arabicWithDiacritic: 'رُٗ', hijjaSpelling: 'را الٹا پیش رٗ',
      rawSound: 'رٗ', equivalentMaddah: 'waw', equivalentDisplay: 'رُوْ (واؤ مدہ)',
      isHeavy: true, tajweedNote: 'را پر الٹا پیش ہو تو پُر (موٹا) ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'رٰ ، رٖ ، رٗ',
    tripletHijja: 'را کھڑا زبر رٰ ، را کھڑا زیر رٖ ، را الٹا پیش رٗ = رٰ ، رٖ ، رٗ'
  },
  {
    id: 26,
    baseLetter: 'ج',
    baseLetterName: 'جِيم',
    isHeavy: false,
    kharaZabarCell: {
      id: 176, letter: 'ج', baseLetterName: 'جِيم', harakahType: 'khara_zabar',
      displaySymbol: 'جٰ', arabicWithDiacritic: 'جَٰ', hijjaSpelling: 'جیم کھڑا زبر جٰ',
      rawSound: 'جٰ', equivalentMaddah: 'alif', equivalentDisplay: 'جَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'جیم زبان کے درمیانی حصے سے سختی اور مضبوطی کے ساتھ ۱ الف کھینچیں۔'
    },
    kharaZerCell: {
      id: 177, letter: 'ج', baseLetterName: 'جِيم', harakahType: 'khara_zer',
      displaySymbol: 'جٖ', arabicWithDiacritic: 'جِٖ', hijjaSpelling: 'جیم کھڑا زیر جٖ',
      rawSound: 'جٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'جِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'جیم کھڑا زیر جِيْ کی طرح مضبوطی سے ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 178, letter: 'ج', baseLetterName: 'جِيم', harakahType: 'ulta_pesh',
      displaySymbol: 'جٗ', arabicWithDiacritic: 'جُٗ', hijjaSpelling: 'جیم الٹا پیش جٗ',
      rawSound: 'جٗ', equivalentMaddah: 'waw', equivalentDisplay: 'جُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'جیم الٹا پیش جُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'جٰ ، جٖ ، جٗ',
    tripletHijja: 'جیم کھڑا زبر جٰ ، جیم کھڑا زیر جٖ ، جیم الٹا پیش جٗ = جٰ ، جٖ ، جٗ'
  },
  {
    id: 27,
    baseLetter: 'ش',
    baseLetterName: 'شِين',
    isHeavy: false,
    kharaZabarCell: {
      id: 179, letter: 'ش', baseLetterName: 'شِين', harakahType: 'khara_zabar',
      displaySymbol: 'شٰ', arabicWithDiacritic: 'شَٰ', hijjaSpelling: 'شین کھڑا زبر شٰ',
      rawSound: 'شٰ', equivalentMaddah: 'alif', equivalentDisplay: 'شَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'شین منہ میں ہوا پھیلا کر (تفشی) ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 180, letter: 'ش', baseLetterName: 'شِين', harakahType: 'khara_zer',
      displaySymbol: 'شٖ', arabicWithDiacritic: 'شِٖ', hijjaSpelling: 'شین کھڑا زیر شٖ',
      rawSound: 'شٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'شِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'شین کھڑا زیر شِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 181, letter: 'ش', baseLetterName: 'شِين', harakahType: 'ulta_pesh',
      displaySymbol: 'شٗ', arabicWithDiacritic: 'شُٗ', hijjaSpelling: 'شین الٹا پیش شٗ',
      rawSound: 'شٗ', equivalentMaddah: 'waw', equivalentDisplay: 'شُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'شین الٹا پیش شُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'شٰ ، شٖ ، شٗ',
    tripletHijja: 'شین کھڑا زبر شٰ ، شین کھڑا زیر شٖ ، شین الٹا پیش شٗ = شٰ ، شٖ ، شٗ'
  },
  {
    id: 28,
    baseLetter: 'ي',
    baseLetterName: 'يَاء',
    isHeavy: false,
    kharaZabarCell: {
      id: 182, letter: 'ي', baseLetterName: 'يَاء', harakahType: 'khara_zabar',
      displaySymbol: 'يٰ', arabicWithDiacritic: 'يَٰ', hijjaSpelling: 'یا کھڑا زبر يٰ',
      rawSound: 'يٰ', equivalentMaddah: 'alif', equivalentDisplay: 'يَا (الف مدہ)',
      isHeavy: false, tajweedNote: 'یا زبان کے درمیان سے نرمی سے ۱ الف کھینچ کر پڑھیں۔'
    },
    kharaZerCell: {
      id: 183, letter: 'ي', baseLetterName: 'يَاء', harakahType: 'khara_zer',
      displaySymbol: 'يٖ', arabicWithDiacritic: 'يِٖ', hijjaSpelling: 'یا کھڑا زیر يٖ',
      rawSound: 'يٖ', equivalentMaddah: 'yaa', equivalentDisplay: 'يِيْ (یاء مدہ)',
      isHeavy: false, tajweedNote: 'یا کھڑا زیر يِيْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    ultaPeshCell: {
      id: 184, letter: 'ي', baseLetterName: 'يَاء', harakahType: 'ulta_pesh',
      displaySymbol: 'يٗ', arabicWithDiacritic: 'يُٗ', hijjaSpelling: 'یا الٹا پیش يٗ',
      rawSound: 'يٗ', equivalentMaddah: 'waw', equivalentDisplay: 'يُوْ (واؤ مدہ)',
      isHeavy: false, tajweedNote: 'یا الٹا پیش يُوْ کی طرح ۱ الف کھینچ کر پڑھیں۔'
    },
    tripletRaw: 'يٰ ، يٖ ، يٗ',
    tripletHijja: 'یا کھڑا زبر يٰ ، یا کھڑا زیر يٖ ، یا الٹا پیش يٗ = يٰ ، يٖ ، يٗ'
  }
];

// All 84 Individual Khari Harakat Cells
export const SABAQ_7_ALL_84_CELLS: KhariHarakahCell[] = SABAQ_7_KHARI_TRIPLETS.flatMap(t => [
  t.kharaZabarCell,
  t.kharaZerCell,
  t.ultaPeshCell
]);

// Acoustically Similar Letter Pairs (حروفِ قریب الصوت)
export const QAREEB_US_SAWT_PAIRS: QareebSawtPairItem[] = [
  {
    id: 'ta-to',
    name: 'ت بمقابلہ ط (باریک بمقابلہ موٹا)',
    description: 'ت باریک ہے جبکہ ط پُر (موٹا) حرفِ مستعلیہ ہے۔ دونوں کو ادا کرتے وقت واضح فرق کریں۔',
    letters: [
      { letter: 'ت', letterName: 'تَاء (باریک)', isHeavy: false, kharaZabar: 'تٰ', kharaZer: 'تٖ', ultaPesh: 'تٗ', soundQuality: 'باریک اور نکھری آواز', makhrajNote: 'زبان کی نوک سامنے والے اوپر کے دانتوں کی جڑ سے' },
      { letter: 'ط', letterName: 'طَاء (پُر / موٹا)', isHeavy: true, kharaZabar: 'طٰ', kharaZer: 'طٖ', ultaPesh: 'طٗ', soundQuality: 'موٹی اور بھاری آواز (مستعلیہ)', makhrajNote: 'زبان کی نوک اور تالو اوپر اٹھا کر' }
    ]
  },
  {
    id: 'za-dhal-zaa',
    name: 'ز بمقابلہ ذ بمقابلہ ظ بمقابلہ ض (سیٹی، نرمی، موٹا)',
    description: 'ز سیٹی والا، ذ نرم اور باریک، ظ نرم اور موٹا، اور ض داڑھوں کی کروٹ سے ادا ہوتا ہے۔',
    letters: [
      { letter: 'ز', letterName: 'زَا (سیٹی دار)', isHeavy: false, kharaZabar: 'زٰ', kharaZer: 'زٖ', ultaPesh: 'زٗ', soundQuality: 'تیز سیٹی والی آواز (صفیر)', makhrajNote: 'دونوں دانت ملا کر' },
      { letter: 'ذ', letterName: 'ذَال (نرم باریک)', isHeavy: false, kharaZabar: 'ذٰ', kharaZer: 'ذٖ', ultaPesh: 'ذٗ', soundQuality: 'انتہائی نرم باریک آواز', makhrajNote: 'زبان کی نوک اوپر کے دانتوں کے کنارے سے' },
      { letter: 'ظ', letterName: 'ظَاء (نرم موٹا)', isHeavy: true, kharaZabar: 'ظٰ', kharaZer: 'ظٖ', ultaPesh: 'ظٗ', soundQuality: 'پُر (موٹی) اور نرم آواز', makhrajNote: 'زبان کی نوک دانتوں کے کنارے سے، تالو اوپر' },
      { letter: 'ض', letterName: 'ضَاد (داڑھ سے موٹا)', isHeavy: true, kharaZabar: 'ضٰ', kharaZer: 'ضٖ', ultaPesh: 'ضٗ', soundQuality: 'سب سے موٹا اور گہرا حرف (استطالت)', makhrajNote: 'زبان کی کروٹ اوپر کی داڑھوں سے' }
    ]
  },
  {
    id: 'sa-seen-saad',
    name: 'ث بمقابلہ س بمقابلہ ص (نرم، باریک سیٹی، موٹی سیٹی)',
    description: 'ث نرم ہے، س باریک سیٹی دار ہے، ص پُر (موٹی) سیٹی والا حرف ہے۔',
    letters: [
      { letter: 'ث', letterName: 'ثَاء (نرم)', isHeavy: false, kharaZabar: 'ثٰ', kharaZer: 'ثٖ', ultaPesh: 'ثٗ', soundQuality: 'بغیر سیٹی کے نرم آواز', makhrajNote: 'زبان کی نوک دانتوں کے سرے سے' },
      { letter: 'س', letterName: 'سِين (باریک سیٹی)', isHeavy: false, kharaZabar: 'سٰ', kharaZer: 'سٖ', ultaPesh: 'سٗ', soundQuality: 'تیز باریک سیٹی', makhrajNote: 'زبان کی نوک نیچے کے دانتوں کے اندرونی حصے سے' },
      { letter: 'ص', letterName: 'صَاد (موٹی سیٹی)', isHeavy: true, kharaZabar: 'صٰ', kharaZer: 'صٖ', ultaPesh: 'صٗ', soundQuality: 'پُر (موٹی) بھاری سیٹی', makhrajNote: 'زبان تالو کی طرف اٹھا کر موٹا' }
    ]
  },
  {
    id: 'kaf-qaaf',
    name: 'ك بمقابلہ ق (باریک کاف بمقابلہ موٹا قاف)',
    description: 'ك باریک کاف ہے جبکہ ق کوے کے پاس سے موٹا بولا جاتا ہے۔',
    letters: [
      { letter: 'ك', letterName: 'كَاف (باریک)', isHeavy: false, kharaZabar: 'كٰ', kharaZer: 'كٖ', ultaPesh: 'كٗ', soundQuality: 'ہلکی باریک آواز', makhrajNote: 'زبان کی جڑ تالو کے سخت حصے سے' },
      { letter: 'ق', letterName: 'قَاف (پُر / موٹا)', isHeavy: true, kharaZabar: 'قٰ', kharaZer: 'قٖ', ultaPesh: 'قٗ', soundQuality: 'گہری موٹی آواز (مستعلیہ)', makhrajNote: 'زبان کی جڑ تالو کے نرم حصے (کوے) سے' }
    ]
  },
  {
    id: 'ha-haa',
    name: 'ه بمقابلہ ح (سینے کا ہا بمقابلہ حلق کا حا)',
    description: 'ه حلق کے نچلے حصے (سینے کے پاس) سے نکلتی ہے جبکہ ح حلق کے درمیان سے صاف ہوا کے ساتھ ادا ہوتی ہے۔',
    letters: [
      { letter: 'ه', letterName: 'هَاء (ہوائی ہا)', isHeavy: false, kharaZabar: 'هٰ', kharaZer: 'هٖ', ultaPesh: 'هٗ', soundQuality: 'ہلکی گہری آواز', makhrajNote: 'اقصیٰ حلق (سینے کے قریب)' },
      { letter: 'ح', letterName: 'حَاء (صاف حا)', isHeavy: false, kharaZabar: 'حٰ', kharaZer: 'حٖ', ultaPesh: 'حٗ', soundQuality: 'صاف شفاف گلے کی آواز', makhrajNote: 'وسطِ حلق (گلے کے عین بیچ سے)' }
    ]
  },
  {
    id: 'hamza-ain',
    name: 'ء بمقابلہ ع (جھٹکے کا ہمزہ بمقابلہ حلق کا عین)',
    description: 'ء صاف کھٹکے کی آواز ہے جبکہ ع کو حلق کے درمیان سے گہرا دبا کر ادا کیا جاتا ہے۔',
    letters: [
      { letter: 'ء', letterName: 'هَمْزَة / الف', isHeavy: false, kharaZabar: 'اٰ', kharaZer: 'اٖ', ultaPesh: 'اٗ', soundQuality: 'صاف اور کھٹکے دار آواز', makhrajNote: 'اقصیٰ حلق' },
      { letter: 'ع', letterName: 'عَيْن', isHeavy: false, kharaZabar: 'عٰ', kharaZer: 'عٖ', ultaPesh: 'عٗ', soundQuality: 'گلے کے درمیان سے دبا کر گہری آواز', makhrajNote: 'وسطِ حلق' }
    ]
  }
];

// =========================================================================
// 45+ AUTHENTIC QURANIC & QAIDA WORDS MASHQ (مَشْق: کھڑی حرکات)
// =========================================================================

// 1. KHARA ZABAR MASHQ (کھڑا زبر کی مشق)
export const KHARA_ZABAR_MASHQ_WORDS: KhariHarakatMashqWord[] = [
  {
    id: 201, word: 'طٰهٰ', harakahType: 'khara_zabar',
    hijjaText: 'طا کھڑا زبر طٰ ، ہا کھڑا زبر هٰ = طٰهٰ', rawSound: 'طٰهٰ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'سورہ طٰہٰ کی ابتدا (حروفِ مقطعات)',
    tajweedNotes: 'ط موٹا اور ہا باریک، دونوں کو ۱، ۱ الف کھینچ کر پڑھیں۔', isHeavy: true,
    syllableBreakdown: ['طٰ', 'هٰ']
  },
  {
    id: 202, word: 'هٰذَا', harakahType: 'khara_zabar',
    hijjaText: 'ہا کھڑا زبر هٰ ، ذال الف زبر ذَا = هٰذَا', rawSound: 'هٰذَا',
    category: 'khara_zabar', page: 19, meaningOrContext: 'یہ (قرآنی اسم اشارہ)',
    tajweedNotes: 'ہا پر کھڑا زبر اور ذال کے ساتھ الف مدہ، دونوں کو برابر ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['هٰ', 'ذَا']
  },
  {
    id: 203, word: 'اٰدَمَ', harakahType: 'khara_zabar',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، دال زبر دَ ، میم زبر مَ = اٰدَمَ', rawSound: 'اٰدَمَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'حضرت آدم علیہ السلام کا مبارک نام',
    tajweedNotes: 'اٰ کو ۱ الف کھینچیں، دَ اور مَ کو بغیر کھینچے جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['اٰ', 'دَ', 'مَ']
  },
  {
    id: 204, word: 'اٰيٰتٍ', harakahType: 'khara_zabar',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، یا کھڑا زبر يٰ ، تا دو زیر تٍ = اٰيٰتٍ', rawSound: 'اٰيٰتٍ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'نشانیاں / آیات',
    tajweedNotes: 'دو کھڑے زبر (اٰ اور يٰ) کو ۱، ۱ الف کھینچیں اور تا پر تنوین کی آواز نکالیں۔', isHeavy: false,
    syllableBreakdown: ['اٰ', 'يٰ', 'تٍ']
  },
  {
    id: 205, word: 'اٰمَنَ', harakahType: 'khara_zabar',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، میم زبر مَ ، نون زبر نَ = اٰمَنَ', rawSound: 'اٰمَنَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'وہ ایمان لایا',
    tajweedNotes: 'اٰ کو ۱ الف کھینچیں، مَ اور نَ کو بغیر کھینچے پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['اٰ', 'مَ', 'نَ']
  },
  {
    id: 206, word: 'ذٰلِكَ', harakahType: 'khara_zabar',
    hijjaText: 'ذال کھڑا زبر ذٰ ، لام زیر لِ ، کاف زبر كَ = ذٰلِكَ', rawSound: 'ذٰلِكَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'وہ (ذٰلِكَ الْكِتٰبُ)',
    tajweedNotes: 'ذٰ کو نرمی سے ۱ الف کھینچیں، لِ اور كَ کو بغیر کھینچے جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['ذٰ', 'لِ', 'كَ']
  },
  {
    id: 207, word: 'رَاٰهُ', harakahType: 'khara_zabar',
    hijjaText: 'را زبر رَ ، ہمزہ کھڑا زبر اٰ ، ہا پیش هُ = رَاٰهُ', rawSound: 'رَاٰهُ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'اس نے اسے دیکھا',
    tajweedNotes: 'را پر زبر کی وجہ سے موٹا ہوگا، ہمزہ کھڑا زبر اٰ کو ۱ الف کھینچیں۔', isHeavy: true,
    syllableBreakdown: ['رَ', 'اٰ', 'هُ']
  },
  {
    id: 208, word: 'اِلٰهَ', harakahType: 'khara_zabar',
    hijjaText: 'ہمزہ زیر اِ ، لام کھڑا زبر لٰ ، ہا زبر هَ = اِلٰهَ', rawSound: 'اِلٰهَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'معبود برحق (لَا اِلٰهَ اِلَّا الله)',
    tajweedNotes: 'لام کھڑا زبر لٰ کو ۱ الف کھینچیں، اِ اور هَ کو بغیر کھینچے پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['اِ', 'لٰ', 'هَ']
  },
  {
    id: 209, word: 'سَلٰمٌ', harakahType: 'khara_zabar',
    hijjaText: 'سین زبر سَ ، لام کھڑا زبر لٰ ، میم دو پیش مٌ = سَلٰمٌ', rawSound: 'سَلٰمٌ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'سلامتی / امن',
    tajweedNotes: 'لام کھڑا زبر لٰ کو ۱ الف کھینچیں، سین کو سیٹی سے پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['سَ', 'لٰ', 'مٌ']
  },
  {
    id: 210, word: 'كِتٰبٌ', harakahType: 'khara_zabar',
    hijjaText: 'کاف زیر كِ ، تا کھڑا زبر تٰ ، با دو پیش بٌ = كِتٰبٌ', rawSound: 'كِتٰبٌ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'کتاب / قرآن پاک',
    tajweedNotes: 'تا کھڑا زبر تٰ کو ۱ الف کھینچیں، كِ اور بٌ کو جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['كِ', 'تٰ', 'بٌ']
  },
  {
    id: 211, word: 'مٰلِكِ', harakahType: 'khara_zabar',
    hijjaText: 'میم کھڑا زبر مٰ ، لام زیر لِ ، کاف زیر كِ = مٰلِكِ', rawSound: 'مٰلِكِ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'مالک (مٰلِكِ يَوْمِ الدِّيْنِ)',
    tajweedNotes: 'مٰ کو ۱ الف کھینچیں، لِ اور كِ کے زیر کو بغیر کھینچے پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['مٰ', 'لِ', 'كِ']
  },
  {
    id: 212, word: 'سَمٰوٰتٍ', harakahType: 'khara_zabar',
    hijjaText: 'سین زبر سَ ، میم کھڑا زبر مٰ ، واؤ کھڑا زبر وٰ ، تا دو زیر تٍ = سَمٰوٰتٍ', rawSound: 'سَمٰوٰتٍ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'آسمان (جمع)',
    tajweedNotes: 'دونوں کھڑے زبر مٰ اور وٰ کو برابر ۱، ۱ الف کھینچ کر پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['سَ', 'مٰ', 'وٰ', 'تٍ']
  },
  {
    id: 213, word: 'قٰلُوْا', harakahType: 'khara_zabar',
    hijjaText: 'قاف کھڑا زبر قٰ ، لام واؤ پیش لُوْ = قٰلُوْا', rawSound: 'قٰلُوْا',
    category: 'khara_zabar', page: 19, meaningOrContext: 'انہوں نے کہا',
    tajweedNotes: 'قاف کھڑا زبر موٹا ۱ الف اور لام واؤ پیش ۱ الف کھینچیں۔', isHeavy: true,
    syllableBreakdown: ['قٰ', 'لُوْ']
  },
  {
    id: 214, word: 'صَلٰوةَ', harakahType: 'khara_zabar',
    hijjaText: 'صاد زبر صَ ، لام کھڑا زبر لٰ ، تا زبر تَ = صَلٰوةَ', rawSound: 'صَلٰوةَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'نماز',
    tajweedNotes: 'صاد پُر اور لام کھڑا زبر لٰ کو ۱ الف کھینچیں (واؤ رسم الخط میں ساکن ہے)۔', isHeavy: true,
    syllableBreakdown: ['صَ', 'لٰ', 'تَ']
  },
  {
    id: 215, word: 'زَكٰوةَ', harakahType: 'khara_zabar',
    hijjaText: 'زا زبر زَ ، کاف کھڑا زبر كٰ ، تا زبر تَ = زَكٰوةَ', rawSound: 'زَكٰوةَ',
    category: 'khara_zabar', page: 19, meaningOrContext: 'زکوٰۃ',
    tajweedNotes: 'کاف کھڑا زبر كٰ کو ۱ الف کھینچیں اور زا کو سیٹی سے پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['زَ', 'كٰ', 'تَ']
  },
  {
    id: 216, word: 'هُدًى', harakahType: 'khara_zabar',
    hijjaText: 'ہا پیش هُ ، دال کھڑا زبر دا = هُدَى', rawSound: 'هُدَى',
    category: 'khara_zabar', page: 19, meaningOrContext: 'ہدایت و رہنمائی',
    tajweedNotes: 'دال کھڑا زبر ۱ الف کھینچ کر پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['هُ', 'دًى']
  }
];

// 2. KHARA ZER MASHQ (کھڑا زیر کی مشق)
export const KHARA_ZER_MASHQ_WORDS: KhariHarakatMashqWord[] = [
  {
    id: 221, word: 'بِهٖ', harakahType: 'khara_zer',
    hijjaText: 'با زیر بِ ، ہا کھڑا زیر هٖ = بِهٖ', rawSound: 'بِهٖ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس کے ساتھ',
    tajweedNotes: 'ہا کھڑا زیر هٖ کو یاء مدہ کی طرح ۱ الف کھینچیں، بِ کو جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['بِ', 'هٖ']
  },
  {
    id: 222, word: 'هٰذِهٖ', harakahType: 'khara_zer',
    hijjaText: 'ہا کھڑا زبر هٰ ، ذال زیر ذِ ، ہا کھڑا زیر هٖ = هٰذِهٖ', rawSound: 'هٰذِهٖ',
    category: 'mixed', page: 19, meaningOrContext: 'یہ (مونث اشارہ)',
    tajweedNotes: 'هٰ (کھڑا زبر) اور هٖ (کھڑا زیر) دونوں کو برابر ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['هٰ', 'ذِ', 'هٖ']
  },
  {
    id: 223, word: 'مِثْلِهٖ', harakahType: 'khara_zer',
    hijjaText: 'میم زیر مِ ، ثا جزم مِثْ ، لام زیر لِ ، ہا کھڑا زیر هٖ = مِثْلِهٖ', rawSound: 'مِثْلِهٖ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس کی مانند / اس جیسا',
    tajweedNotes: 'ثا ساکن کو نرمی سے ادا کریں اور ہا کھڑا زیر هٖ کو ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['مِثْ', 'لِ', 'هٖ']
  },
  {
    id: 224, word: 'اِلٰفِهِمْ', harakahType: 'khara_zer',
    hijjaText: 'ہمزہ کھڑا زیر اٖ ، لام کھڑا زبر لٰ ، فا زیر فِ ، میم جزم فِهِمْ = اِلٰفِهِمْ', rawSound: 'اِلٰفِهِمْ',
    category: 'mixed', page: 19, meaningOrContext: 'سورہ قریش: ان کی الفت و مانوسیت',
    tajweedNotes: 'ہمزہ کھڑا زیر اور لام کھڑا زبر دونوں کو ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['اٖ', 'لٰ', 'فِ', 'هِمْ']
  },
  {
    id: 225, word: 'عِبَادِهٖ', harakahType: 'khara_zer',
    hijjaText: 'عین زیر عِ ، با الف زبر بَا ، دال زیر دِ ، ہا کھڑا زیر هٖ = عِبَادِهٖ', rawSound: 'عِبَادِهٖ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس کے بندے',
    tajweedNotes: 'بَا (الف مدہ) اور هٖ (کھڑا زیر) دونوں کو ۱، ۱ الف کھینچ کر پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['عِ', 'بَا', 'دِ', 'هٖ']
  },
  {
    id: 226, word: 'رُسُلِهٖ', harakahType: 'khara_zer',
    hijjaText: 'را پیش رُ ، سین پیش سُ ، لام زیر لِ ، ہا کھڑا زیر هٖ = رُسُلِهٖ', rawSound: 'رُسُلِهٖ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس کے رسول (جمع)',
    tajweedNotes: 'رُ موٹا پڑھیں، سُ اور لِ جلدی، اور هٖ کو ۱ الف کھینچیں۔', isHeavy: true,
    syllableBreakdown: ['رُ', 'سُ', 'لِ', 'هٖ']
  },
  {
    id: 227, word: 'كُتُبِهٖ', harakahType: 'khara_zer',
    hijjaText: 'کاف پیش كُ ، تا پیش تُ ، با زیر بِ ، ہا کھڑا زیر هٖ = كُتُبِهٖ', rawSound: 'كُتُبِهٖ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس کی کتابیں',
    tajweedNotes: 'پہلی تین حرکات کو جلدی پڑھیں اور ہا کھڑا زیر هٖ کو ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['كُ', 'تُ', 'بِ', 'هٖ']
  },
  {
    id: 228, word: 'اٰيٰتِهٖ', harakahType: 'khara_zer',
    hijjaText: 'ہمزہ کھڑا زبر اٰ ، یا کھڑا زبر يٰ ، تا زیر تِ ، ہا کھڑا زیر هٖ = اٰيٰتِهٖ', rawSound: 'اٰيٰتِهٖ',
    category: 'mixed', page: 19, meaningOrContext: 'اس کی آیات / نشانیاں',
    tajweedNotes: 'تینوں کھڑی حرکات (اٰ ، يٰ ، هٖ) کو برابر ۱، ۱ الف کھینچ کر پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['اٰ', 'يٰ', 'تِ', 'هٖ']
  },
  {
    id: 229, word: 'فِيْهِ', harakahType: 'khara_zer',
    hijjaText: 'فا یا زیر فِيْ ، ہا کھڑا زیر هٖ = فِيْهِ', rawSound: 'فِيْهِ',
    category: 'khara_zer', page: 19, meaningOrContext: 'اس میں',
    tajweedNotes: 'فِيْ یاء مدہ ہے اور هٖ کھڑا زیر ہے، دونوں کو ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['فِيْ', 'هٖ']
  }
];

// 3. ULTA PESH MASHQ (الٹا پیش کی مشق)
export const ULTA_PESH_MASHQ_WORDS: KhariHarakatMashqWord[] = [
  {
    id: 231, word: 'دَاوٗدُ', harakahType: 'ulta_pesh',
    hijjaText: 'دال الف زبر دَا ، واؤ الٹا پیش وٗ ، دال پیش دُ = دَاوٗدُ', rawSound: 'دَاوٗدُ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'حضرت داؤد علیہ السلام کا مبارک نام',
    tajweedNotes: 'دَا (الف مدہ) اور وٗ (الٹا پیش) دونوں کو ۱، ۱ الف کھینچیں اور دُ کو جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['دَا', 'وٗ', 'دُ']
  },
  {
    id: 232, word: 'مَالُهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'میم الف زبر مَا ، لام پیش لُ ، ہا الٹا پیش هٗ = مَالُهٗ', rawSound: 'مَالُهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کا مال و دولت',
    tajweedNotes: 'مَا (الف مدہ) اور هٗ (الٹا پیش) دونوں کو ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['مَا', 'لُ', 'هٗ']
  },
  {
    id: 233, word: 'وَزَادَهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'واؤ زبر وَ ، زا الف زبر زَا ، دال زبر دَ ، ہا الٹا پیش هٗ = وَزَادَهٗ', rawSound: 'وَزَادَهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اور اس نے اسے زیادہ کیا',
    tajweedNotes: 'زَا اور هٗ کو ۱، ۱ الف کھینچیں، وَ اور دَ کو جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['وَ', 'زَا', 'دَ', 'هٗ']
  },
  {
    id: 234, word: 'عِنْدَهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'عین زیر عِ ، نون جزم عِنْ ، دال زبر دَ ، ہا الٹا پیش هٗ = عِنْدَهٗ', rawSound: 'عِنْدَهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کے پاس',
    tajweedNotes: 'نون ساکن پر اخفاء کریں اور ہا الٹا پیش هٗ کو ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['عِنْ', 'دَ', 'هٗ']
  },
  {
    id: 235, word: 'لَهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'لام زبر لَ ، ہا الٹا پیش هٗ = لَهٗ', rawSound: 'لَهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کے لیے',
    tajweedNotes: 'لَ کو جلدی اور ہا الٹا پیش هٗ کو واؤ مدہ کی طرح ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['لَ', 'هٗ']
  },
  {
    id: 236, word: 'جُنُوْدُهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'جیم پیش جُ ، نون واؤ پیش نُوْ ، دال پیش دُ ، ہا الٹا پیش هٗ = جُنُوْدُهٗ', rawSound: 'جُنُوْدُهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کے لشکر',
    tajweedNotes: 'نُوْ (واؤ مدہ) اور هٗ (الٹا پیش) دونوں کو برابر ۱، ۱ الف کھینچیں۔', isHeavy: false,
    syllableBreakdown: ['جُ', 'نُوْ', 'دُ', 'هٗ']
  },
  {
    id: 237, word: 'يَرَهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'یا زبر يَ ، را زبر رَ ، ہا الٹا پیش هٗ = يَرَهٗ', rawSound: 'يَرَهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'وہ اسے دیکھ لے گا',
    tajweedNotes: 'را کو زبر کی وجہ سے موٹا پڑھیں اور هٗ کو ۱ الف کھینچیں۔', isHeavy: true,
    syllableBreakdown: ['يَ', 'رَ', 'هٗ']
  },
  {
    id: 238, word: 'اَمْرُهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'ہمزہ زبر اَ ، میم جزم اَمْ ، را پیش رُ ، ہا الٹا پیش هٗ = اَمْرُهٗ', rawSound: 'اَمْرُهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کا حکم / اس کا معاملہ',
    tajweedNotes: 'را پیش موٹا پڑھیں اور ہا الٹا پیش هٗ کو ۱ الف کھینچ کر پڑھیں۔', isHeavy: true,
    syllableBreakdown: ['اَمْ', 'رُ', 'هٗ']
  },
  {
    id: 239, word: 'رَبُّهٗ', harakahType: 'ulta_pesh',
    hijjaText: 'را زبر رَ ، با تشدید رَبّْ ، با پیش بُ ، ہا الٹا پیش هٗ = رَبُّهٗ', rawSound: 'رَبُّهٗ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس کا پروردگار / رب',
    tajweedNotes: 'را موٹا، با پر تشدید کی سختی، اور هٗ کو ۱ الف کھینچیں۔', isHeavy: true,
    syllableBreakdown: ['رَبْ', 'بُ', 'هٗ']
  },
  {
    id: 240, word: 'وٗرِيَ', harakahType: 'ulta_pesh',
    hijjaText: 'واؤ الٹا پیش وٗ ، را زیر رِ ، یا زبر يَ = وٗرِيَ', rawSound: 'وٗرِيَ',
    category: 'ulta_pesh', page: 19, meaningOrContext: 'اس سے چھپایا گیا',
    tajweedNotes: 'واؤ الٹا پیش وٗ کو ۱ الف کھینچیں اور رِ اور يَ کو جلدی پڑھیں۔', isHeavy: false,
    syllableBreakdown: ['وٗ', 'رِ', 'يَ']
  }
];

import { PAGE_20_IMTIHAN_WORDS, ImtihanWordItem } from './page20ImtihanData';

export type { ImtihanWordItem };
export { PAGE_20_IMTIHAN_WORDS };

export const PAGE_20_KHARI_MASHQ_WORDS: KhariHarakatMashqWord[] = PAGE_20_IMTIHAN_WORDS.map((w) => ({
  id: w.id,
  word: w.word,
  harakahType: (w.category === 'khara_zabar' ? 'khara_zabar' : w.category === 'khara_zer' ? 'khara_zer' : w.category === 'ulta_pesh' ? 'ulta_pesh' : 'mixed') as KhariHarakahType | 'mixed',
  hijjaText: w.hijjaText,
  rawSound: w.rawSound,
  category: (w.category === 'khara_zabar' ? 'khara_zabar' : w.category === 'khara_zer' ? 'khara_zer' : w.category === 'ulta_pesh' ? 'ulta_pesh' : 'mixed') as 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'mixed',
  page: 20,
  meaningOrContext: w.meaningOrContext,
  tajweedNotes: w.tajweedNotes,
  isHeavy: w.isHeavy,
  syllableBreakdown: w.syllableBreakdown
}));

// Combine all 95+ Mashq Words (45+ Regular Lesson 8 Words + 50 Page 20 Exam Words)
export const ALL_KHARI_HARAKAT_MASHQ_WORDS: KhariHarakatMashqWord[] = [
  ...KHARA_ZABAR_MASHQ_WORDS,
  ...KHARA_ZER_MASHQ_WORDS,
  ...ULTA_PESH_MASHQ_WORDS,
  ...PAGE_20_KHARI_MASHQ_WORDS
];
