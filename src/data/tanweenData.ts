export type TanweenHarakahType = 'do_zabar' | 'do_zer' | 'do_pesh';

export interface TanweenCell {
  id: number;
  letter: string;
  word: string; // e.g. تًا or تٍ or تٌ
  harakahType: TanweenHarakahType;
  harakahUrdu: string; // "دو زبر" | "دو زیر" | "دو پیش"
  spellingHijja: string; // "تاء دو زبر تَنْ"
  soundText: string; // "تَنْ"
  isHeavy: boolean; // Musta'liyah / Heavy letter
  isSoft: boolean; // Soft letter like ث، ذ، ظ
  isWhistle: boolean; // Whistle letter like ص، س، ز
  tajweedRule: string;
}

export interface TanweenTriplet {
  id: number;
  letter: string;
  letterUrdu: string;
  isHeavy: boolean;
  isSoft?: boolean;
  isWhistle?: boolean;
  doZabar: TanweenCell;
  doZer: TanweenCell;
  doPesh: TanweenCell;
  makhrajInfo: string;
}

export interface TanweenMashqWord {
  id: number;
  word: string;
  spellingHijja: string;
  audioPronunciation: string;
  category: TanweenHarakahType | 'mixed';
  categoryLabelUrdu: string;
  isHeavy: boolean;
  tajweedNote: string;
  breakdown: string[];
}

export interface TanweenExamWord {
  id: number;
  word: string;
  spellingHijja: string;
  audioPronunciation: string;
  primaryTanweenType: TanweenHarakahType | 'mixed';
  tajweedRule: string;
  rowNumber: number;
}

// =========================================================================
// 1. ALL 28/29 TRIPLETS FOR LESSON 8 (تنوین: دو زبر، دو زیر، دو پیش)
// =========================================================================
export const TANWEEN_TRIPLETS: TanweenTriplet[] = [
  {
    id: 1,
    letter: 'ء',
    letterUrdu: 'ہمزہ',
    isHeavy: false,
    makhrajInfo: 'حلق کا نیچے کا حصہ (اقصیٰ حلق)',
    doZabar: { id: 101, letter: 'ء', word: 'ءًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ہَمْزَہ دو زبر اَنْ', soundText: 'اَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہمزہ دو زبر = اَنْ۔ الف کو نہیں پڑھا جائے گا۔' },
    doZer: { id: 102, letter: 'ء', word: 'ءٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ہَمْزَہ دو زیر اِنْ', soundText: 'اِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہمزہ دو زیر = اِنْ۔' },
    doPesh: { id: 103, letter: 'ء', word: 'ءٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ہَمْزَہ دو پیش اُنْ', soundText: 'اُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے اُنْ۔' },
  },
  {
    id: 2,
    letter: 'ب',
    letterUrdu: 'با',
    isHeavy: false,
    makhrajInfo: 'دونوں ہونٹوں کے گیلے (تری والے) حصے کے ملنے سے',
    doZabar: { id: 201, letter: 'ب', word: 'بًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'بَا دو زبر بَنْ', soundText: 'بَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹوں کی تری سے بَنْ ادا کریں۔ الف کو نہیں پڑھیں گے۔' },
    doZer: { id: 202, letter: 'ب', word: 'بٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'بَا دو زیر بِنْ', soundText: 'بِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور معروف بِنْ۔' },
    doPesh: { id: 203, letter: 'ب', word: 'بٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'بَا دو پیش بُنْ', soundText: 'بُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے بُنْ۔' },
  },
  {
    id: 3,
    letter: 'ت',
    letterUrdu: 'تا',
    isHeavy: false,
    makhrajInfo: 'زبان کی نوک اور سامنے والے اوپر کے دانتوں کی جڑ سے',
    doZabar: { id: 301, letter: 'ت', word: 'تًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'تَا دو زبر تَنْ', soundText: 'تَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'دو زبر کے ساتھ الف لکھا جاتا ہے پڑھا نہیں جاتا، نون ساکن کی آواز میں ادا کریں۔' },
    doZer: { id: 302, letter: 'ت', word: 'تٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'تَا دو زیر تِنْ', soundText: 'تِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'دو زیر کی تنوین کو معروف اور نون ساکن کی آواز میں بغیر جھٹکے کے ادا کریں۔' },
    doPesh: { id: 303, letter: 'ت', word: 'تٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'تَا دو پیش تُنْ', soundText: 'تُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'دو پیش کی تنوین میں دونوں ہونٹ گول کر کے نون ساکن کی آواز ادا کریں۔' },
  },
  {
    id: 4,
    letter: 'ث',
    letterUrdu: 'ثا',
    isHeavy: false,
    isSoft: true,
    makhrajInfo: 'زبان کا سرا اور سامنے والے اوپر کے دانتوں کا کنارہ (نرم حرف)',
    doZabar: { id: 401, letter: 'ث', word: 'ثًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ثَا دو زبر ثَنْ', soundText: 'ثَنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'ثا کو بالکل نرمی سے ادا کریں تاکہ سین جیسی سیٹی پیدا نہ ہو۔' },
    doZer: { id: 402, letter: 'ث', word: 'ثٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ثَا دو زیر ثِنْ', soundText: 'ثِنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'نرمی اور نفاست سے ثِنْ۔' },
    doPesh: { id: 403, letter: 'ث', word: 'ثٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ثَا دو پیش ثُنْ', soundText: 'ثُنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'ہونٹ گول اور نرمی سے ثُنْ۔' },
  },
  {
    id: 5,
    letter: 'ج',
    letterUrdu: 'جیم',
    isHeavy: false,
    makhrajInfo: 'زبان کا درمیان اور اس کے بالمقابل اوپر کا تالو',
    doZabar: { id: 501, letter: 'ج', word: 'جًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'جِيْمْ دو زبر جَنْ', soundText: 'جَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'جیم کو مضبوطی اور شدت کے ساتھ جَنْ ادا کریں۔' },
    doZer: { id: 502, letter: 'ج', word: 'جٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'جِيْمْ دو زیر جِنْ', soundText: 'جِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'مضبوطی سے جِنْ۔' },
    doPesh: { id: 503, letter: 'ج', word: 'جٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'جِيْمْ دو پیش جُنْ', soundText: 'جُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے جُنْ۔' },
  },
  {
    id: 6,
    letter: 'ح',
    letterUrdu: 'حا',
    isHeavy: false,
    makhrajInfo: 'حلق کے درمیان والا حصہ (وسطِ حلق)',
    doZabar: { id: 601, letter: 'ح', word: 'حًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'حَا دو زبر حَنْ', soundText: 'حَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'حا کو وسطِ حلق سے صاف ہوا اور رگڑ کے ساتھ حَنْ ادا کریں۔' },
    doZer: { id: 602, letter: 'ح', word: 'حٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'حَا دو زیر حِنْ', soundText: 'حِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'وسطِ حلق سے حِنْ۔' },
    doPesh: { id: 603, letter: 'ح', word: 'حٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'حَا دو پیش حُنْ', soundText: 'حُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور وسطِ حلق سے حُنْ۔' },
  },
  {
    id: 7,
    letter: 'خ',
    letterUrdu: 'خا',
    isHeavy: true,
    makhrajInfo: 'حلق کے اوپر کا حصہ یعنی منہ کی طرف والا (ادنٰی حلق - حروفِ مستعلیہ)',
    doZabar: { id: 701, letter: 'خ', word: 'خًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'خَا دو زبر خَنْ', soundText: 'خَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'خا کو ہمیشہ پر (موٹا) اور حلق کے اوپری حصے سے خَنْ ادا کریں۔' },
    doZer: { id: 702, letter: 'خ', word: 'خٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'خَا دو زیر خِنْ', soundText: 'خِنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'خا زیر کی حالت میں بھی پر رہے گا = خِنْ۔' },
    doPesh: { id: 703, letter: 'خ', word: 'خٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'خَا دو پیش خُنْ', soundText: 'خُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور بھاری آواز میں خُنْ۔' },
  },
  {
    id: 8,
    letter: 'د',
    letterUrdu: 'دال',
    isHeavy: false,
    makhrajInfo: 'زبان کی نوک اور اوپر کے سامنے کے دانتوں کی جڑ',
    doZabar: { id: 801, letter: 'د', word: 'دًى', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'دَالْ دو زبر دَنْ', soundText: 'دَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'دال دو زبر کے بعد "ى" لکھا ہے مگر ہجے میں نام نہیں لیا جائے گا = دَنْ۔' },
    doZer: { id: 802, letter: 'د', word: 'دٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'دَالْ دو زیر دِنْ', soundText: 'دِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور نفاست سے دِنْ۔' },
    doPesh: { id: 803, letter: 'د', word: 'دٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'دَالْ دو پیش دُنْ', soundText: 'دُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے دُنْ۔' },
  },
  {
    id: 9,
    letter: 'ذ',
    letterUrdu: 'ذال',
    isHeavy: false,
    isSoft: true,
    makhrajInfo: 'حروفِ لثویہ (نرم حرف): زبان کا سرا اور سامنے والے اوپر کے دانتوں کا کنارہ',
    doZabar: { id: 901, letter: 'ذ', word: 'ذًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ذَالْ دو زبر ذَنْ', soundText: 'ذَنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'ذال نرمی سے پڑھا جائے گا، سیٹی کی آواز بالکل نہ نکلنے پائے۔' },
    doZer: { id: 902, letter: 'ذ', word: 'ذٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ذَالْ دو زیر ذِنْ', soundText: 'ذِنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'نرمی سے ذِنْ ادا کریں۔' },
    doPesh: { id: 903, letter: 'ذ', word: 'ذٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ذَالْ دو پیش ذُنْ', soundText: 'ذُنْ', isHeavy: false, isSoft: true, isWhistle: false, tajweedRule: 'ہونٹ گول اور نرمی سے ذُنْ۔' },
  },
  {
    id: 10,
    letter: 'ر',
    letterUrdu: 'را',
    isHeavy: true,
    makhrajInfo: 'زبان کی پشت کی نوک اور اوپر کا تالو',
    doZabar: { id: 1001, letter: 'ر', word: 'رًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'رَا دو زبر رَنْ', soundText: 'رَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'را پر دو زبر ہو تو را کو ہمیشہ پُر (موٹا) پڑھیں گے۔' },
    doZer: { id: 1002, letter: 'ر', word: 'رٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'رَا دو زیر رِنْ', soundText: 'رِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'را پر دو زیر ہو تو را کو باریک پڑھا جائے گا = رِنْ۔' },
    doPesh: { id: 1003, letter: 'ر', word: 'رٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'رَا دو پیش رُنْ', soundText: 'رُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'را پر دو پیش ہو تو را کو پُر (موٹا) پڑھا جائے گا = رُنْ۔' },
  },
  {
    id: 11,
    letter: 'ز',
    letterUrdu: 'زا',
    isHeavy: false,
    isWhistle: true,
    makhrajInfo: 'حروفِ صفیر (سیٹی والا حرف): زبان کی نوک اور اوپر نیچے کے دانتوں کا ملنا',
    doZabar: { id: 1101, letter: 'ز', word: 'زًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'زَا دو زبر زَنْ', soundText: 'زَنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'زا میں واضح سیٹی جیسی تیز اور صاف آواز کے ساتھ تنوین ادا کریں۔' },
    doZer: { id: 1102, letter: 'ز', word: 'زٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'زَا دو زیر زِنْ', soundText: 'زِنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'سیٹی کی آواز کے ساتھ دو زیر کی ادائیگی۔' },
    doPesh: { id: 1103, letter: 'ز', word: 'زٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'زَا دو پیش زُنْ', soundText: 'زُنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'ہونٹ گول کر کے زُنْ پڑھیں۔' },
  },
  {
    id: 12,
    letter: 'س',
    letterUrdu: 'سین',
    isHeavy: false,
    isWhistle: true,
    makhrajInfo: 'حروفِ صفیر (سیٹی والا): زبان کی نوک اور سامنے والے نچلے و اوپر والے دانت',
    doZabar: { id: 1201, letter: 'س', word: 'سًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'سِيْنْ دو زبر سَنْ', soundText: 'سَنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'سین میں واضح اور باریک سیٹی کی آواز پیدا ہوگی۔' },
    doZer: { id: 1202, letter: 'س', word: 'سٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'سِيْنْ دو زیر سِنْ', soundText: 'سِنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'باریک اور سیٹی کے ساتھ سِنْ۔' },
    doPesh: { id: 1203, letter: 'س', word: 'سٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'سِيْنْ دو پیش سُنْ', soundText: 'سُنْ', isHeavy: false, isSoft: false, isWhistle: true, tajweedRule: 'ہونٹ گول اور سیٹی کے ساتھ سُنْ۔' },
  },
  {
    id: 13,
    letter: 'ش',
    letterUrdu: 'شین',
    isHeavy: false,
    makhrajInfo: 'زبان کا درمیان اور اوپر کا تالو (صفت تفشی یعنی منہ میں ہوا پھیلنا)',
    doZabar: { id: 1301, letter: 'ش', word: 'شًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'شِيْنْ دو زبر شَنْ', soundText: 'شَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'شین میں تفشی یعنی ہوا منہ میں پھیلے گی = شَنْ۔' },
    doZer: { id: 1302, letter: 'ش', word: 'شٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'شِيْنْ دو زیر شِنْ', soundText: 'شِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'تفشی اور باریکی کے ساتھ شِنْ۔' },
    doPesh: { id: 1303, letter: 'ش', word: 'شٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'شِيْنْ دو پیش شُنْ', soundText: 'شُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور تفشی کے ساتھ شُنْ۔' },
  },
  {
    id: 14,
    letter: 'ص',
    letterUrdu: 'صاد',
    isHeavy: true,
    isWhistle: true,
    makhrajInfo: 'زبان کی نوک دانتوں سے (موٹا اور سیٹی والا حرف)',
    doZabar: { id: 1401, letter: 'ص', word: 'صًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'صَادْ دو زبر صَنْ', soundText: 'صَنْ', isHeavy: true, isSoft: false, isWhistle: true, tajweedRule: 'صاد کو موٹی بھاری آواز اور سیٹی کے ساتھ صَنْ ادا کریں۔' },
    doZer: { id: 1402, letter: 'ص', word: 'صٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'صَادْ دو زیر صِنْ', soundText: 'صِنْ', isHeavy: true, isSoft: false, isWhistle: true, tajweedRule: 'صاد کو پُر رکھ کر صِنْ پڑھیں۔' },
    doPesh: { id: 1403, letter: 'ص', word: 'صٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'صَادْ دو پیش صُنْ', soundText: 'صُنْ', isHeavy: true, isSoft: false, isWhistle: true, tajweedRule: 'ہونٹ گول اور موٹی سیٹی کے ساتھ صُنْ۔' },
  },
  {
    id: 15,
    letter: 'ض',
    letterUrdu: 'ضاد',
    isHeavy: true,
    makhrajInfo: 'زبان کی کروٹ اور اوپر کی ڈاڑھوں کی جڑ (حروفِ مستعلیہ و استطالت)',
    doZabar: { id: 1501, letter: 'ض', word: 'ضًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ضَادْ دو زبر ضَنْ', soundText: 'ضَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ضاد کو موٹا اور استطالت کے ساتھ ضَنْ ادا کریں۔' },
    doZer: { id: 1502, letter: 'ض', word: 'ضٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ضَادْ دو زیر ضِنْ', soundText: 'ضِنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ضاد کو پُر رکھ کر ضِنْ پڑھیں۔' },
    doPesh: { id: 1503, letter: 'ض', word: 'ضٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ضَادْ دو پیش ضُنْ', soundText: 'ضُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور موٹی بھاری آواز میں ضُنْ۔' },
  },
  {
    id: 16,
    letter: 'ط',
    letterUrdu: 'طا',
    isHeavy: true,
    makhrajInfo: 'زبان کی نوک اور اوپر کے دانتوں کی جڑ (حروفِ مستعلیہ - پُر/موٹا پڑھیں)',
    doZabar: { id: 1601, letter: 'ط', word: 'طًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'طَا دو زبر طَنْ', soundText: 'طَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'طا کو ہمیشہ پُر (موٹا) پڑھیں، تنوین میں طَنْ کی بھاری آواز نکلے۔' },
    doZer: { id: 1602, letter: 'ط', word: 'طٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'طَا دو زیر طِنْ', soundText: 'طِنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'طا زیر کی حالت میں بھی موٹا پڑھا جائے گا۔' },
    doPesh: { id: 1603, letter: 'ط', word: 'طٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'طَا دو پیش طُنْ', soundText: 'طُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'طا دو پیش کو پر اور ہونٹ گول کر کے ادا کریں۔' },
  },
  {
    id: 17,
    letter: 'ظ',
    letterUrdu: 'ظا',
    isHeavy: true,
    isSoft: true,
    makhrajInfo: 'حروفِ لثویہ و مستعلیہ: زبان کا سرا اور اوپر کے اگلے دانتوں کا اندرونی کنارہ (موٹا اور نرم)',
    doZabar: { id: 1701, letter: 'ظ', word: 'ظًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ظَا دو زبر ظَنْ', soundText: 'ظَنْ', isHeavy: true, isSoft: true, isWhistle: false, tajweedRule: 'ظا موٹا اور نرم پڑھا جائے گا، ز کی طرح سیٹی نہ نکلے۔' },
    doZer: { id: 1702, letter: 'ظ', word: 'ظٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ظَا دو زیر ظِنْ', soundText: 'ظِنْ', isHeavy: true, isSoft: true, isWhistle: false, tajweedRule: 'ظا کو پُر اور نرمی سے ظِنْ پڑھیں۔' },
    doPesh: { id: 1703, letter: 'ظ', word: 'ظٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ظَا دو پیش ظُنْ', soundText: 'ظُنْ', isHeavy: true, isSoft: true, isWhistle: false, tajweedRule: 'ہونٹ گول اور موٹی آواز میں ظُنْ۔' },
  },
  {
    id: 18,
    letter: 'ع',
    letterUrdu: 'عین',
    isHeavy: false,
    makhrajInfo: 'حلق کا درمیانی حصہ (وسطِ حلق)',
    doZabar: { id: 1801, letter: 'ع', word: 'عًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'عَيْنْ دو زبر عَنْ', soundText: 'عَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'عین کو وسط حلق سے دباؤ کے ساتھ عَنْ ادا کریں۔' },
    doZer: { id: 1802, letter: 'ع', word: 'عٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'عَيْنْ دو زیر عِنْ', soundText: 'عِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'وسط حلق سے عِنْ۔' },
    doPesh: { id: 1803, letter: 'ع', word: 'عٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'عَيْنْ دو پیش عُنْ', soundText: 'عُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور وسط حلق سے عُنْ۔' },
  },
  {
    id: 19,
    letter: 'غ',
    letterUrdu: 'غین',
    isHeavy: true,
    makhrajInfo: 'حلق کے اوپر کا حصہ منہ کی طرف والا (ادنٰی حلق - حروفِ مستعلیہ)',
    doZabar: { id: 1901, letter: 'غ', word: 'غًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'غَيْنْ دو زبر غَنْ', soundText: 'غَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'غین کو پُر اور حلق کے اوپری حصے سے غَنْ ادا کریں۔' },
    doZer: { id: 1902, letter: 'غ', word: 'غٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'غَيْنْ دو زیر غِنْ', soundText: 'غِنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'غین زیر کی حالت میں بھی موٹا رہے گا = غِنْ۔' },
    doPesh: { id: 1903, letter: 'غ', word: 'غٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'غَيْنْ دو پیش غُنْ', soundText: 'غُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور موٹی آواز میں غُنْ۔' },
  },
  {
    id: 20,
    letter: 'ف',
    letterUrdu: 'فا',
    isHeavy: false,
    makhrajInfo: 'اوپر کے اگلے دو دانتوں کے کنارے نچلے ہونٹ کے پیٹ سے',
    doZabar: { id: 2001, letter: 'ف', word: 'فًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'فَا دو زبر فَنْ', soundText: 'فَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'اوپر کے دانت نچلے ہونٹ پر رکھ کر فَنْ ادا کریں۔' },
    doZer: { id: 2002, letter: 'ف', word: 'فٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'فَا دو زیر فِنْ', soundText: 'فِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور نفاست سے فِنْ۔' },
    doPesh: { id: 2003, letter: 'ف', word: 'فٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'فَا دو پیش فُنْ', soundText: 'فُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے فُنْ۔' },
  },
  {
    id: 21,
    letter: 'ق',
    letterUrdu: 'قاف',
    isHeavy: true,
    makhrajInfo: 'زبان کی جڑ تالو کے نرم حصے سے (حروفِ مستعلیہ - پُر/موٹا)',
    doZabar: { id: 2101, letter: 'ق', word: 'قًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'قَافْ دو زبر قَنْ', soundText: 'قَنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'قاف کو پر (موٹا) پڑھیں، کَنْ سے واضح ممتاز رکھیں۔' },
    doZer: { id: 2102, letter: 'ق', word: 'قٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'قَافْ دو زیر قِنْ', soundText: 'قِنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'قاف زیر کی حالت میں بھی پر اور بھاری رہے گا۔' },
    doPesh: { id: 2103, letter: 'ق', word: 'قٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'قَافْ دو پیش قُنْ', soundText: 'قُنْ', isHeavy: true, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور بھاری آواز میں قُنْ۔' },
  },
  {
    id: 22,
    letter: 'ک',
    letterUrdu: 'کاف',
    isHeavy: false,
    makhrajInfo: 'زبان کی جڑ ق کے مخرج سے تھوڑا نیچے منہ کی طرف تالو سے',
    doZabar: { id: 2201, letter: 'ک', word: 'کًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'كَافْ دو زبر کَنْ', soundText: 'کَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'کاف کو ہمیشہ باریک ادا کریں، ق کی طرح موٹا نہ ہو۔' },
    doZer: { id: 2202, letter: 'ک', word: 'کٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'كَافْ دو زیر کِنْ', soundText: 'کِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور نفاست سے کِنْ۔' },
    doPesh: { id: 2203, letter: 'ک', word: 'کٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'كَافْ دو پیش کُنْ', soundText: 'کُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور باریک کُنْ۔' },
  },
  {
    id: 23,
    letter: 'ل',
    letterUrdu: 'لام',
    isHeavy: false,
    makhrajInfo: 'زبان کی کروٹ کا اگلا کنارہ اوپر کے تالو سے',
    doZabar: { id: 2301, letter: 'ل', word: 'لًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'لَامْ دو زبر لَنْ', soundText: 'لَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'لام دو زبر لَنْ۔ عام حالت میں لام باریک پڑھا جاتا ہے۔' },
    doZer: { id: 2302, letter: 'ل', word: 'لٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'لَامْ دو زیر لِنْ', soundText: 'لِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور معروف لِنْ۔' },
    doPesh: { id: 2303, letter: 'ل', word: 'لٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'لَامْ دو پیش لُنْ', soundText: 'لُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے لُنْ۔' },
  },
  {
    id: 24,
    letter: 'م',
    letterUrdu: 'میم',
    isHeavy: false,
    makhrajInfo: 'دونوں ہونٹوں کے خشک حصے کے ملنے سے (حروفِ شفویہ)',
    doZabar: { id: 2401, letter: 'م', word: 'مًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'مِيْمْ دو زبر مَنْ', soundText: 'مَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'میم دو زبر مَنْ۔ غنہ کے بغیر واضح نون ساکن کی آواز۔' },
    doZer: { id: 2402, letter: 'م', word: 'مٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'مِيْمْ دو زیر مِنْ', soundText: 'مِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور معروف مِنْ۔' },
    doPesh: { id: 2403, letter: 'م', word: 'مٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'مِيْمْ دو پیش مُنْ', soundText: 'مُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے مُنْ۔' },
  },
  {
    id: 25,
    letter: 'ن',
    letterUrdu: 'نون',
    isHeavy: false,
    makhrajInfo: 'زبان کی نوک اوپر کے تالو سے (خیشوم یعنی ناک کا بانسہ)',
    doZabar: { id: 2501, letter: 'ن', word: 'نًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'نُوْنْ دو زبر نَنْ', soundText: 'نَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'نون دو زبر نَنْ۔' },
    doZer: { id: 2502, letter: 'ن', word: 'نٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'نُوْنْ دو زیر نِنْ', soundText: 'نِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور نفاست سے نِنْ۔' },
    doPesh: { id: 2503, letter: 'ن', word: 'نٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'نُوْنْ دو پیش نُنْ', soundText: 'نُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے نُنْ۔' },
  },
  {
    id: 26,
    letter: 'و',
    letterUrdu: 'واؤ',
    isHeavy: false,
    makhrajInfo: 'دونوں ہونٹوں کو گول کر کے نامکمل ملانے سے',
    doZabar: { id: 2601, letter: 'و', word: 'وًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'وَاوْ دو زبر وَنْ', soundText: 'وَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے وَنْ ادا کریں۔' },
    doZer: { id: 2602, letter: 'و', word: 'وٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'وَاوْ دو زیر وِنْ', soundText: 'وِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور معروف وِنْ۔' },
    doPesh: { id: 2603, letter: 'و', word: 'وٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'وَاوْ دو پیش وُنْ', soundText: 'وُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے وُنْ۔' },
  },
  {
    id: 27,
    letter: 'ہ',
    letterUrdu: 'ہا',
    isHeavy: false,
    makhrajInfo: 'حلق کے نیچے کا حصہ (سینے کی طرف والا)',
    doZabar: { id: 2701, letter: 'ہ', word: 'ہًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'ہَا دو زبر ہَنْ', soundText: 'ہَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'حلق کے نیچے سے آسانی سے ہَنْ ادا کریں۔' },
    doZer: { id: 2702, letter: 'ہ', word: 'ہٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'ہَا دو زیر ہِنْ', soundText: 'ہِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور واضح ہِنْ۔' },
    doPesh: { id: 2703, letter: 'ہ', word: 'ہٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'ہَا دو پیش ہُنْ', soundText: 'ہُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول اور ہُنْ۔' },
  },
  {
    id: 28,
    letter: 'ی',
    letterUrdu: 'یا',
    isHeavy: false,
    makhrajInfo: 'زبان کا درمیانی حصہ اور اوپر کا تالو',
    doZabar: { id: 2801, letter: 'ی', word: 'یًا', harakahType: 'do_zabar', harakahUrdu: 'دو زبر', spellingHijja: 'يَا دو زبر یَنْ', soundText: 'یَنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'یا دو زبر یَنْ۔' },
    doZer: { id: 2802, letter: 'ی', word: 'یٍ', harakahType: 'do_zer', harakahUrdu: 'دو زیر', spellingHijja: 'يَا دو زیر یِنْ', soundText: 'یِنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'باریک اور نفاست سے یِنْ۔' },
    doPesh: { id: 2803, letter: 'ی', word: 'یٌ', harakahType: 'do_pesh', harakahUrdu: 'دو پیش', spellingHijja: 'يَا دو پیش یُنْ', soundText: 'یُنْ', isHeavy: false, isSoft: false, isWhistle: false, tajweedRule: 'ہونٹ گول کر کے یُنْ۔' },
  },
];

// All individual 84 cells for easy flat access
export const SABAQ_8_ALL_84_CELLS: TanweenCell[] = TANWEEN_TRIPLETS.flatMap(t => [t.doZabar, t.doZer, t.doPesh]);

// =========================================================================
// 2. MASHQ WORDS (مشق دو زبر - تصویر ۵)
// =========================================================================
export const DO_ZABAR_MASHQ_WORDS: TanweenMashqWord[] = [
  { id: 1, word: 'خَوْفًا', spellingHijja: 'خا واؤ زبر خَوْ، فا دو زبر فَنْ = خَوْفًا', audioPronunciation: 'خَوْفًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'خا مستعلیہ (موٹا)، واؤ لین نرمی سے، فا دو زبر فَنْ۔', breakdown: ['خَوْ', 'فًا'] },
  { id: 2, word: 'قَوْلًا', spellingHijja: 'قاف واؤ زبر قَوْ، لام دو زبر لَنْ = قَوْلًا', audioPronunciation: 'قَوْلًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'قاف پر، واؤ لین، لام دو زبر لَنْ۔', breakdown: ['قَوْ', 'لًا'] },
  { id: 3, word: 'قَوْمًا', spellingHijja: 'قاف واؤ زبر قَوْ، میم دو زبر مَنْ = قَوْمًا', audioPronunciation: 'قَوْمًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'قاف پر، واؤ لین، میم دو زبر مَنْ۔', breakdown: ['قَوْ', 'مًا'] },
  { id: 4, word: 'صَوْمًا', spellingHijja: 'صاد واؤ زبر صَوْ، میم دو زبر مَنْ = صَوْمًا', audioPronunciation: 'صَوْمًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'صاد موٹا اور سیٹی والا، واؤ لین، میم دو زبر مَنْ۔', breakdown: ['صَوْ', 'مًا'] },
  { id: 5, word: 'طَوْعًا', spellingHijja: 'طا واؤ زبر طَوْ، عین دو زبر عَنْ = طَوْعًا', audioPronunciation: 'طَوْعًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'طا موٹا، واؤ لین، عین حلق کے درمیان سے عَنْ۔', breakdown: ['طَوْ', 'عًا'] },
  
  { id: 6, word: 'مَالًا', spellingHijja: 'میم الف زبر مَا، لام دو زبر لَنْ = مَالًا', audioPronunciation: 'مَالًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'الف مدہ ایک الف کھینچیں، لام دو زبر لَنْ۔', breakdown: ['مَا', 'لًا'] },
  { id: 7, word: 'نَارًا', spellingHijja: 'نون الف زبر نَا، را دو زبر رَنْ = نَارًا', audioPronunciation: 'نَارًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'را پر دو زبر ہے اس لیے را کو موٹا (پُر) پڑھا جائے گا۔', breakdown: ['نَا', 'رًا'] },
  { id: 8, word: 'وَزْنًا', spellingHijja: 'واؤ زبر وَ، زا نون ساکن زَنْ = وَزْنًا', audioPronunciation: 'وَزْنًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'زا میں سیٹی، نون دو زبر نَنْ۔', breakdown: ['وَزْ', 'نًا'] },
  { id: 9, word: 'رِزْقًا', spellingHijja: 'را زیر رِ، زا ساکن زْ، قاف دو زبر قَنْ = رِزْقًا', audioPronunciation: 'رِزْقًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'را زیر کی وجہ سے باریک، قاف دو زبر موٹا۔', breakdown: ['رِزْ', 'قًا'] },
  { id: 10, word: 'وِرْدًا', spellingHijja: 'واؤ زیر وِ، را ساکن رْ، دال دو زبر دَنْ = وِرْدًا', audioPronunciation: 'وِرْدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'را ساکنہ سے پہلے زیر ہے تو را باریک، دال دو زبر دَنْ۔', breakdown: ['وِرْ', 'دًا'] },

  { id: 11, word: 'رَغَدًا', spellingHijja: 'را زبر رَ، غین زبر غَ، دال دو زبر دَنْ = رَغَدًا', audioPronunciation: 'رَغَدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'را اور غین دونوں پُر (موٹے) پڑھے جائیں گے۔', breakdown: ['رَ', 'غَ', 'دًا'] },
  { id: 12, word: 'نَقْعًا', spellingHijja: 'نون قاف زبر نَقْ، عین دو زبر عَنْ = نَقْعًا', audioPronunciation: 'نَقْعًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'قاف ساکن پر قلقلہ (جھٹکا/آواز کی بازگشت) کریں، عین وسطِ حلق سے۔', breakdown: ['نَقْ', 'عًا'] },
  { id: 13, word: 'اَبَدًا', spellingHijja: 'ہمزہ زبر اَ، با زبر بَ، دال دو زبر دَنْ = اَبَدًا', audioPronunciation: 'اَبَدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'تمام حروف باریک، بغیر جھٹکے اور بغیر کھینچے پڑھیں۔', breakdown: ['اَ', 'بَ', 'دًا'] },
  { id: 14, word: 'طَبَقًا', spellingHijja: 'طا زبر طَ، با زبر بَ، قاف دو زبر قَنْ = طَبَقًا', audioPronunciation: 'طَبَقًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'طا اور قاف دونوں مستعلیہ (موٹے) پڑھے جائیں گے۔', breakdown: ['طَ', 'بَ', 'قًا'] },
  { id: 15, word: 'قَدْحًا', spellingHijja: 'قاف دال زبر قَدْ، حا دو زبر حَنْ = قَدْحًا', audioPronunciation: 'قَدْحًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'دال ساکنہ پر قلقلہ کریں، حا وسط حلق سے۔', breakdown: ['قَدْ', 'حًا'] },

  { id: 16, word: 'عَبْدًا', spellingHijja: 'عین با زبر عَبْ، دال دو زبر دَنْ = عَبْدًا', audioPronunciation: 'عَبْدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'با ساکنہ پر قلقلہ واضح کریں، عین وسط حلق سے۔', breakdown: ['عَبْ', 'دًا'] },
  { id: 17, word: 'طَیْرًا', spellingHijja: 'طا یا زبر طَیْ، را دو زبر رَنْ = طَیْرًا', audioPronunciation: 'طَیْرًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'طا موٹا، یاء لین، را دو زبر موٹا۔', breakdown: ['طَیْ', 'رًا'] },
  { id: 18, word: 'بُشْرًا', spellingHijja: 'با پیش بُ، شین ساکن شْ، را دو زبر رَنْ = بُشْرًا', audioPronunciation: 'بُشْرًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'شین میں تفشی، را دو زبر پر (موٹا)۔', breakdown: ['بُشْ', 'رًا'] },
  { id: 19, word: 'لُبَدًا', spellingHijja: 'لام پیش لُ، با زبر بَ، دال دو زبر دَنْ = لُبَدًا', audioPronunciation: 'لُبَدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'پیش پر ہونٹ گول، دال دو زبر دَنْ۔', breakdown: ['لُ', 'بَ', 'دًا'] },
  { id: 20, word: 'اَکْلًا', spellingHijja: 'ہمزہ کاف زبر اَکْ، لام دو زبر لَنْ = اَکْلًا', audioPronunciation: 'اَکْلًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'کاف میں ہمس (ہلکی ہوا کی آواز)، لام دو زبر لَنْ۔', breakdown: ['اَکْ', 'لًا'] },

  { id: 21, word: 'اَحَدًا', spellingHijja: 'ہمزہ زبر اَ، حا زبر حَ، دال دو زبر دَنْ = اَحَدًا', audioPronunciation: 'اَحَدًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'حا وسط حلق سے، دال دو زبر دَنْ۔', breakdown: ['اَ', 'حَ', 'دًا'] },
  { id: 22, word: 'کِتَابًا', spellingHijja: 'کاف زیر کِ، تا الف زبر تَا، با دو زبر بَنْ = کِتَابًا', audioPronunciation: 'کِتَابًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'تا الف مدہ ایک الف کھینچیں، با دو زبر بَنْ۔', breakdown: ['کِ', 'تَا', 'بًا'] },
  { id: 23, word: 'یُسْرًا', spellingHijja: 'یا پیش یُ، سین ساکن سْ، را دو زبر رَنْ = یُسْرًا', audioPronunciation: 'یُسْرًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'سین میں سیٹی، را دو زبر موٹا پڑھیں۔', breakdown: ['یُسْ', 'رًا'] },
  { id: 24, word: 'شِدَادًا', spellingHijja: 'شین زیر شِ، دال الف زبر دَا، دال دو زبر دَنْ = شِدَادًا', audioPronunciation: 'شِدَادًا', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: false, tajweedNote: 'الف مدہ ایک الف، دال دو زبر دَنْ۔', breakdown: ['شِ', 'دَا', 'دًا'] },
  { id: 25, word: 'نَخِرَةً', spellingHijja: 'نون زبر نَ، خا زیر خِ، را زبر رَ، تا دو زبر تَنْ = نَخِرَةً', audioPronunciation: 'نَخِرَةً', category: 'do_zabar', categoryLabelUrdu: 'دو زبر', isHeavy: true, tajweedNote: 'گول تا پر دو زبر کے بعد الف نہیں لکھا جاتا = تَنْ۔', breakdown: ['نَ', 'خِ', 'رَ', 'ةً'] },
];

// =========================================================================
// 3. MASHQ WORDS (مشق دو زیر - تصویر ۷)
// =========================================================================
export const DO_ZER_MASHQ_WORDS: TanweenMashqWord[] = [
  { id: 26, word: 'شَیْءٍ', spellingHijja: 'شین یا زبر شَیْ، ہمزہ دو زیر اِنْ = شَیْءٍ', audioPronunciation: 'شَیْءٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'یاء لین نرمی سے، ہمزہ دو زیر اِنْ۔', breakdown: ['شَیْ', 'ءٍ'] },
  { id: 27, word: 'عَدْنٍ', spellingHijja: 'عین دال زبر عَدْ، نون دو زیر نِنْ = عَدْنٍ', audioPronunciation: 'عَدْنٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'دال ساکن پر قلقلہ، نون دو زیر نِنْ۔', breakdown: ['عَدْ', 'نٍ'] },
  { id: 28, word: 'هَادٍ', spellingHijja: 'ہا الف زبر ہَا، دال دو زیر دِنْ = هَادٍ', audioPronunciation: 'هَادٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'الف مدہ ایک الف، دال دو زیر دِنْ۔', breakdown: ['هَا', 'دٍ'] },
  { id: 29, word: 'خَوْفٍ', spellingHijja: 'خا واؤ زبر خَوْ، فا دو زیر فِنْ = خَوْفٍ', audioPronunciation: 'خَوْفٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'خا مستعلیہ (موٹا)، واؤ لین، فا دو زیر فِنْ۔', breakdown: ['خَوْ', 'فٍ'] },
  { id: 30, word: 'لَوْحٍ', spellingHijja: 'لام واؤ زبر لَوْ، حا دو زیر حِنْ = لَوْحٍ', audioPronunciation: 'لَوْحٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'واؤ لین، حا وسط حلق سے حِنْ۔', breakdown: ['لَوْ', 'حٍ'] },

  { id: 31, word: 'اَرْضٍ', spellingHijja: 'ہمزہ را زبر اَرْ، ضاد دو زیر ضِنْ = اَرْضٍ', audioPronunciation: 'اَرْضٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'را زبر کی وجہ سے موٹا، ضاد بھی مستعلیہ پُر (موٹا)۔', breakdown: ['اَرْ', 'ضٍ'] },
  { id: 32, word: 'خُسْرٍ', spellingHijja: 'خا پیش خُ، سین ساکن سْ، را دو زیر رِنْ = خُسْرٍ', audioPronunciation: 'خُسْرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'خا موٹا، سین میں سیٹی، را دو زیر باریک رِنْ۔', breakdown: ['خُسْ', 'رٍ'] },
  { id: 33, word: 'جُوْعٍ', spellingHijja: 'جیم واؤ پیش جُوْ، عین دو زیر عِنْ = جُوْعٍ', audioPronunciation: 'جُوْعٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'واؤ مدہ ایک الف کھینچیں، عین وسط حلق سے عِنْ۔', breakdown: ['جُوْ', 'عٍ'] },
  { id: 34, word: 'عَادٍ', spellingHijja: 'عین الف زبر عَا، دال دو زیر دِنْ = عَادٍ', audioPronunciation: 'عَادٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'الف مدہ، دال دو زیر دِنْ۔', breakdown: ['عَا', 'دٍ'] },
  { id: 35, word: 'عَمَدٍ', spellingHijja: 'عین زبر عَ، میم زبر مَ، دال دو زیر دِنْ = عَمَدٍ', audioPronunciation: 'عَمَدٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'عین وسط حلق سے، دال دو زیر دِنْ۔', breakdown: ['عَ', 'مَ', 'دٍ'] },

  { id: 36, word: 'شَهْرٍ', spellingHijja: 'شین ہا زبر شَہْ، را دو زیر رِنْ = شَهْرٍ', audioPronunciation: 'شَهْرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'ہا اقصی حلق سے، را دو زیر باریک رِنْ۔', breakdown: ['شَهْ', 'رٍ'] },
  { id: 37, word: 'طَبَقٍ', spellingHijja: 'طا زبر طَ، با زبر بَ، قاف دو زیر قِنْ = طَبَقٍ', audioPronunciation: 'طَبَقٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'طا اور قاف دونوں پُر (موٹے) پڑھے جائیں گے۔', breakdown: ['طَ', 'بَ', 'قٍ'] },
  { id: 38, word: 'کَبَدٍ', spellingHijja: 'کاف زبر کَ، با زبر بَ، دال دو زیر دِنْ = کَبَدٍ', audioPronunciation: 'کَبَدٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'کاف باریک، دال دو زیر دِنْ۔', breakdown: ['کَ', 'بَ', 'دٍ'] },
  { id: 39, word: 'نَفْسٍ', spellingHijja: 'نون فا زبر نَفْ، سین دو زیر سِنْ = نَفْسٍ', audioPronunciation: 'نَفْسٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'فا میں ہوا، سین میں سیٹی سِنْ۔', breakdown: ['نَفْ', 'سٍ'] },
  { id: 40, word: 'لَهَبٍ', spellingHijja: 'لام زبر لَ، ہا زبر ہَ، با دو زیر بِنْ = لَهَبٍ', audioPronunciation: 'لَهَبٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'بغیر کھینچے، با دو زیر بِنْ۔', breakdown: ['لَ', 'هَ', 'بٍ'] },

  { id: 41, word: 'نَاصِرٍ', spellingHijja: 'نون الف زبر نَا، صاد زیر صِ، را دو زیر رِنْ = نَاصِرٍ', audioPronunciation: 'نَاصِرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'صاد مستعلیہ پر (موٹا)، را دو زیر باریک رِنْ۔', breakdown: ['نَا', 'صِ', 'رٍ'] },
  { id: 42, word: 'قَادِرٍ', spellingHijja: 'قاف الف زبر قَا، دال زیر دِ، را دو زیر رِنْ = قَادِرٍ', audioPronunciation: 'قَادِرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'قاف الف موٹا، را دو زیر باریک رِنْ۔', breakdown: ['قَا', 'دِ', 'رٍ'] },
  { id: 43, word: 'حَاسِدٍ', spellingHijja: 'حا الف زبر حَا، سین زیر سِ، دال دو زیر دِنْ = حَاسِدٍ', audioPronunciation: 'حَاسِدٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'حا وسط حلق سے، دال دو زیر دِنْ۔', breakdown: ['حَا', 'سِ', 'دٍ'] },
  { id: 44, word: 'غَاسِقٍ', spellingHijja: 'غین الف زبر غَا، سین زیر سِ، قاف دو زیر قِنْ = غَاسِقٍ', audioPronunciation: 'غَاسِقٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'غین اور قاف دونوں پُر (موٹے) پڑھے جائیں گے۔', breakdown: ['غَا', 'سِ', 'قٍ'] },
  { id: 45, word: 'وَالِدٍ', spellingHijja: 'واؤ الف زبر وَا، لام زیر لِ، دال دو زیر دِنْ = وَالِدٍ', audioPronunciation: 'وَالِدٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'ہونٹ گول کر کے وَا، دال دو زیر دِنْ۔', breakdown: ['وَالِ', 'دٍ'] },

  { id: 46, word: 'لَیَالٍ', spellingHijja: 'لام زبر لَ، یا الف زبر یَا، لام دو زیر لٍ = لَیَالٍ', audioPronunciation: 'لَیَالٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'الف مدہ، لام دو زیر لِنْ۔', breakdown: ['لَ', 'یَا', 'لٍ'] },
  { id: 47, word: 'اَمْرٍ', spellingHijja: 'ہمزہ میم زبر اَمْ، را دو زیر رِنْ = اَمْرٍ', audioPronunciation: 'اَمْرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'میم ساکن پر اظہار، را دو زیر باریک رِنْ۔', breakdown: ['اَمْ', 'رٍ'] },
  { id: 48, word: 'عَشْرٍ', spellingHijja: 'عین شین زبر عَشْ، را دو زیر رِنْ = عَشْرٍ', audioPronunciation: 'عَشْرٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'شین میں تفشی، را دو زیر باریک رِنْ۔', breakdown: ['عَشْ', 'رٍ'] },
  { id: 49, word: 'مَسَدٍ', spellingHijja: 'میم زبر مَ، سین زبر سَ، دال دو زیر دِنْ = مَسَدٍ', audioPronunciation: 'مَسَدٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: false, tajweedNote: 'سین میں سیٹی، دال دو زیر دِنْ۔', breakdown: ['مَ', 'سَ', 'دٍ'] },
  { id: 50, word: 'قَلْبٍ', spellingHijja: 'قاف لام زبر قَلْ، با دو زیر بِنْ = قَلْبٍ', audioPronunciation: 'قَلْبٍ', category: 'do_zer', categoryLabelUrdu: 'دو زیر', isHeavy: true, tajweedNote: 'قاف مستعلیہ (موٹا)، با دو زیر بِنْ۔', breakdown: ['قَلْ', 'بٍ'] },
];

// =========================================================================
// 4. MASHQ WORDS (مشق دو پیش - تصویر ۹)
// =========================================================================
export const DO_PESH_MASHQ_WORDS: TanweenMashqWord[] = [
  { id: 51, word: 'نُوْرٌ', spellingHijja: 'نون واؤ پیش نُوْ، را دو پیش رٌ = نُوْرٌ', audioPronunciation: 'نُوْرٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'واؤ مدہ ایک الف، را پر دو پیش ہے اس لیے موٹا رُنْ پڑھیں۔', breakdown: ['نُوْ', 'رٌ'] },
  { id: 52, word: 'قَوْلٌ', spellingHijja: 'قاف واؤ زبر قَوْ، لام دو پیش لٌ = قَوْلٌ', audioPronunciation: 'قَوْلٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'قاف موٹا، واؤ لین، لام دو پیش لُنْ۔', breakdown: ['قَوْ', 'لٌ'] },
  { id: 53, word: 'اَجْرٌ', spellingHijja: 'ہمزہ جیم زبر اَجْ، را دو پیش رٌ = اَجْرٌ', audioPronunciation: 'اَجْرٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'جیم ساکنہ پر قلقلہ، را دو پیش پر (موٹا) رُنْ۔', breakdown: ['اَجْ', 'رٌ'] },
  { id: 54, word: 'بَرْقٌ', spellingHijja: 'با را زبر بَرْ، قاف دو پیش قٌ = بَرْقٌ', audioPronunciation: 'بَرْقٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'را اور قاف دونوں موٹے پڑھے جائیں گے۔', breakdown: ['بَرْ', 'قٌ'] },
  { id: 55, word: 'فَصْلٌ', spellingHijja: 'فا صاد زبر فَصْ، لام دو پیش لٌ = فَصْلٌ', audioPronunciation: 'فَصْلٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'صاد موٹا اور سیٹی والا، لام دو پیش لُنْ۔', breakdown: ['فَصْ', 'لٌ'] },

  { id: 56, word: 'عَیْنٌ', spellingHijja: 'عین یا زبر عَیْ، نون دو پیش نٌ = عَیْنٌ', audioPronunciation: 'عَیْنٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'یاء لین نرمی سے، نون دو پیش نُنْ۔', breakdown: ['عَیْ', 'نٌ'] },
  { id: 57, word: 'وَیْلٌ', spellingHijja: 'واؤ یا زبر وَیْ، لام دو پیش لٌ = وَیْلٌ', audioPronunciation: 'وَیْلٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'یاء لین نرمی سے، لام دو پیش لُنْ۔', breakdown: ['وَیْ', 'لٌ'] },
  { id: 58, word: 'ذِکْرٌ', spellingHijja: 'ذال کاف زیر ذِکْ، را دو پیش رٌ = ذِکْرٌ', audioPronunciation: 'ذِکْرٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'ذال نرمی سے، را دو پیش پر (موٹا) رُنْ۔', breakdown: ['ذِکْ', 'رٌ'] },
  { id: 59, word: 'حَبْلٌ', spellingHijja: 'حا با زبر حَبْ، لام دو پیش لٌ = حَبْلٌ', audioPronunciation: 'حَبْلٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'با ساکن پر قلقلہ کریں، لام دو پیش لُنْ۔', breakdown: ['حَبْ', 'لٌ'] },
  { id: 60, word: 'عَدْلٌ', spellingHijja: 'عین دال زبر عَدْ، لام دو پیش لٌ = عَدْلٌ', audioPronunciation: 'عَدْلٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'دال ساکن پر قلقلہ کریں، لام دو پیش لُنْ۔', breakdown: ['عَدْ', 'لٌ'] },

  { id: 61, word: 'اُذُنٌ', spellingHijja: 'ہمزہ پیش اُ، ذال پیش ذُ، نون دو پیش نٌ = اُذُنٌ', audioPronunciation: 'اُذُنٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'ذال نرمی سے، تمام پیش پر ہونٹ گول = اُذُنُنْ۔', breakdown: ['اُ', 'ذُ', 'نٌ'] },
  { id: 62, word: 'یَوْمٌ', spellingHijja: 'یا واؤ زبر یَوْ، میم دو پیش مٌ = یَوْمٌ', audioPronunciation: 'یَوْمٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'واؤ لین نرمی سے، میم دو پیش مُنْ۔', breakdown: ['یَوْ', 'مٌ'] },
  { id: 63, word: 'کُتُبٌ', spellingHijja: 'کاف پیش کُ، تا پیش تُ، با دو پیش بٌ = کُتُبٌ', audioPronunciation: 'کُتُبٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'بغیر کھینچے، با دو پیش بُنْ۔', breakdown: ['کُ', 'تُ', 'بٌ'] },
  { id: 64, word: 'مَتَاعٌ', spellingHijja: 'میم زبر مَ، تا الف زبر تَا، عین دو پیش عٌ = مَتَاعٌ', audioPronunciation: 'مَتَاعٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'الف مدہ، عین دو پیش عُنْ۔', breakdown: ['مَ', 'تَا', 'عٌ'] },
  { id: 65, word: 'اَحَدٌ', spellingHijja: 'ہمزہ زبر اَ، حا زبر حَ، دال دو پیش دٌ = اَحَدٌ', audioPronunciation: 'اَحَدٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'حا وسط حلق سے، دال دو پیش دُنْ۔', breakdown: ['اَ', 'حَ', 'دٌ'] },

  { id: 66, word: 'کَادِحٌ', spellingHijja: 'کاف الف زبر کَا، دال زیر دِ، حا دو پیش حٌ = کَادِحٌ', audioPronunciation: 'کَادِحٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'الف مدہ، حا دو پیش وسطِ حلق سے حُنْ۔', breakdown: ['کَا', 'دِ', 'حٌ'] },
  { id: 67, word: 'عَابِدٌ', spellingHijja: 'عین الف زبر عَا، با زیر بِ، دال دو پیش دٌ = عَابِدٌ', audioPronunciation: 'عَابِدٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'عین الف مدہ، دال دو پیش دُنْ۔', breakdown: ['عَا', 'بِ', 'دٌ'] },
  { id: 68, word: 'قَسَمٌ', spellingHijja: 'قاف زبر قَ، سین زبر سَ، میم دو پیش مٌ = قَسَمٌ', audioPronunciation: 'قَسَمٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'قاف مستعلیہ (موٹا)، سین میں سیٹی، میم دو پیش مُنْ۔', breakdown: ['قَ', 'سَ', 'مٌ'] },
  { id: 69, word: 'سُرُرٌ', spellingHijja: 'سین پیش سُ، را پیش رُ، را دو پیش رٌ = سُرُرٌ', audioPronunciation: 'سُرُرٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'دونوں را پیش کی وجہ سے موٹے (پُر) پڑھے جائیں گے۔', breakdown: ['سُ', 'رُ', 'رٌ'] },
  { id: 70, word: 'وُجُوْهٌ', spellingHijja: 'واؤ پیش وُ، جیم واؤ پیش جُوْ، ہا دو پیش ہٌ = وُجُوْهٌ', audioPronunciation: 'وُجُوْهٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'واؤ مدہ ایک الف، ہا دو پیش ہُنْ۔', breakdown: ['وُ', 'جُوْ', 'هٌ'] },

  { id: 71, word: 'حَافِظٌ', spellingHijja: 'حا الف زبر حَا، فا زیر فِ، ظا دو پیش ظٌ = حَافِظٌ', audioPronunciation: 'حَافِظٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'ظا کو پُر اور نرمی سے ظُنْ ادا کریں۔', breakdown: ['حَا', 'فِ', 'ظٌ'] },
  { id: 72, word: 'غَفُورٌ', spellingHijja: 'غین زبر غَ، فا واؤ پیش فُوْ، را دو پیش رٌ = غَفُورٌ', audioPronunciation: 'غَفُورٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'غین اور را دونوں موٹے پڑھے جائیں گے۔', breakdown: ['غَ', 'فُوْ', 'رٌ'] },
  { id: 73, word: 'رَحِیْمٌ', spellingHijja: 'را زبر رَ، حا یا زیر حِیْ، میم دو پیش مٌ = رَحِیْمٌ', audioPronunciation: 'رَحِیْمٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: true, tajweedNote: 'را موٹا، یاء مدہ ایک الف، میم دو پیش مُنْ۔', breakdown: ['رَ', 'حِیْ', 'مٌ'] },
  { id: 74, word: 'شَهِیْدٌ', spellingHijja: 'شین زبر شَ، ہا یا زیر ہِیْ، دال دو پیش دٌ = شَهِیْدٌ', audioPronunciation: 'شَهِیْدٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'یاء مدہ، دال دو پیش دُنْ۔', breakdown: ['شَ', 'هِیْ', 'دٌ'] },
  { id: 75, word: 'اَزْوَاجٌ', spellingHijja: 'ہمزہ زا زبر اَزْ، واؤ الف زبر وَا، جیم دو پیش جٌ = اَزْوَاجٌ', audioPronunciation: 'اَزْوَاجٌ', category: 'do_pesh', categoryLabelUrdu: 'دو پیش', isHeavy: false, tajweedNote: 'زا میں سیٹی، الف مدہ، جیم دو پیش جُنْ۔', breakdown: ['اَزْ', 'وَا', 'جٌ'] },
];

export const ALL_TANWEEN_MASHQ_WORDS: TanweenMashqWord[] = [
  ...DO_ZABAR_MASHQ_WORDS,
  ...DO_ZER_MASHQ_WORDS,
  ...DO_PESH_MASHQ_WORDS,
];

// =========================================================================
// 5. EXAM WORDS (امتحان برائے تنوین - تصویر ۳ کے ۵۵ جامع کلمات)
// =========================================================================
export const TANWEEN_EXAM_WORDS: TanweenExamWord[] = [
  // Row 1
  { id: 1, word: 'وِفَاقًا', spellingHijja: 'واؤ زیر وِ، فا الف زبر فَا، قاف دو زبر قَنْ = وِفَاقًا', audioPronunciation: 'وِفَاقًا', primaryTanweenType: 'do_zabar', tajweedRule: 'قاف دو زبر پُر (موٹا) قَنْ ادا کریں۔', rowNumber: 1 },
  { id: 2, word: 'سَلٰمٌ', spellingHijja: 'سین زبر سَ، لام کھڑا زبر لٰا، میم دو پیش مٌ = سَلٰمٌ', audioPronunciation: 'سَلٰمٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'کھڑا زبر ایک الف، میم دو پیش مُنْ۔', rowNumber: 1 },
  { id: 3, word: 'اَوْتَادًا', spellingHijja: 'ہمزہ واؤ زبر اَوْ، تا الف زبر تَا، دال دو زبر دَنْ = اَوْتَادًا', audioPronunciation: 'اَوْتَادًا', primaryTanweenType: 'do_zabar', tajweedRule: 'واؤ لین، الف مدہ، دال دو زبر دَنْ۔', rowNumber: 1 },
  { id: 4, word: 'عَلَقٍ', spellingHijja: 'عین زبر عَ، لام زبر لَ، قاف دو زیر قٍ = عَلَقٍ', audioPronunciation: 'عَلَقٍ', primaryTanweenType: 'do_zer', tajweedRule: 'قاف مستعلیہ (موٹا) قِنْ۔', rowNumber: 1 },
  { id: 5, word: 'کَیْدًا', spellingHijja: 'کاف یا زبر کَیْ، دال دو زبر دَنْ = کَیْدًا', audioPronunciation: 'کَیْدًا', primaryTanweenType: 'do_zabar', tajweedRule: 'یاء لین نرمی سے، دال دو زبر دَنْ۔', rowNumber: 1 },

  // Row 2
  { id: 6, word: 'ذَلُولٌ', spellingHijja: 'ذال زبر ذَ، لام واؤ پیش لُوْ، لام دو پیش لٌ = ذَلُولٌ', audioPronunciation: 'ذَلُولٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'ذال نرمی سے، واؤ مدہ، لام دو پیش لُنْ۔', rowNumber: 2 },
  { id: 7, word: 'سُوْرَةٌ', spellingHijja: 'سین واؤ پیش سُوْ، را زبر رَ، تا دو پیش تٌ = سُوْرَةٌ', audioPronunciation: 'سُوْرَةٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'را زبر کی وجہ سے موٹا، گول تا پر دو پیش تُنْ۔', rowNumber: 2 },
  { id: 8, word: 'قِرَدَةً', spellingHijja: 'قاف زیر قِ، را زبر رَ، دال زبر دَ، تا دو زبر تَنْ = قِرَدَةً', audioPronunciation: 'قِرَدَةً', primaryTanweenType: 'do_zabar', tajweedRule: 'قاف موٹا، را موٹا، گول تا دو زبر تَنْ۔', rowNumber: 2 },
  { id: 9, word: 'وَاسِعٌ', spellingHijja: 'واؤ الف زبر وَا، سین زیر سِ، عین دو پیش عٌ = وَاسِعٌ', audioPronunciation: 'وَاسِعٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'الف مدہ، عین دو پیش وسطِ حلق سے عُنْ۔', rowNumber: 2 },
  { id: 10, word: 'دَافِقٍ', spellingHijja: 'دال الف زبر دَا، فا زیر فِ، قاف دو زیر قٍ = دَافِقٍ', audioPronunciation: 'دَافِقٍ', primaryTanweenType: 'do_zer', tajweedRule: 'قاف دو زیر پُر قِنْ۔', rowNumber: 2 },

  // Row 3
  { id: 11, word: 'مِسْکٌ', spellingHijja: 'میم سین زیر مِسْ، کاف دو پیش کٌ = مِسْکٌ', audioPronunciation: 'مِسْکٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'سین میں سیٹی، کاف باریک کُنْ۔', rowNumber: 3 },
  { id: 12, word: 'مَأٰبًا', spellingHijja: 'میم زبر مَ، ہمزہ کھڑا زبر اٰ، با دو زبر بَنْ = مَأٰبًا', audioPronunciation: 'مَأٰبًا', primaryTanweenType: 'do_zabar', tajweedRule: 'ہمزہ کھڑا زبر ایک الف، با دو زبر بَنْ۔', rowNumber: 3 },
  { id: 13, word: 'شَاهِدٍ', spellingHijja: 'شین الف زبر شَا، ہا زیر ہِ، دال دو زیر دٍ = شَاهِدٍ', audioPronunciation: 'شَاهِدٍ', primaryTanweenType: 'do_zer', tajweedRule: 'شین میں تفشی، دال دو زیر دِنْ۔', rowNumber: 3 },
  { id: 14, word: 'کَدْحًا', spellingHijja: 'کاف دال زبر کَدْ، حا دو زبر حَنْ = کَدْحًا', audioPronunciation: 'کَدْحًا', primaryTanweenType: 'do_zabar', tajweedRule: 'دال ساکن پر قلقلہ، حا وسط حلق سے حَنْ۔', rowNumber: 3 },
  { id: 15, word: 'مُطَاعٍ', spellingHijja: 'میم پیش مُ، طا الف زبر طَا، عین دو زیر عٍ = مُطَاعٍ', audioPronunciation: 'مُطَاعٍ', primaryTanweenType: 'do_zer', tajweedRule: 'طا موٹا، عین دو زیر عِنْ۔', rowNumber: 3 },

  // Row 4
  { id: 16, word: 'صُحُفًا', spellingHijja: 'صاد پیش صُ، حا پیش حُ، فا دو زبر فَنْ = صُحُفًا', audioPronunciation: 'صُحُفًا', primaryTanweenType: 'do_zabar', tajweedRule: 'صاد موٹا، حا وسط حلق سے، فا دو زبر فَنْ۔', rowNumber: 4 },
  { id: 17, word: 'رَقَبَةٍ', spellingHijja: 'را زبر رَ، قاف زبر قَ، با زبر بَ، تا دو زیر تٍ = رَقَبَةٍ', audioPronunciation: 'رَقَبَةٍ', primaryTanweenType: 'do_zer', tajweedRule: 'را اور قاف دونوں موٹے، تا دو زیر تِنْ۔', rowNumber: 4 },
  { id: 18, word: 'شَیْئًا', spellingHijja: 'شین یا زبر شَیْ، ہمزہ دو زبر اَنْ = شَیْئًا', audioPronunciation: 'شَیْئًا', primaryTanweenType: 'do_zabar', tajweedRule: 'یاء لین، ہمزہ دو زبر اَنْ۔', rowNumber: 4 },
  { id: 19, word: 'مَتَاعًا', spellingHijja: 'میم زبر مَ، تا الف زبر تَا، عین دو زبر عَنْ = مَتَاعًا', audioPronunciation: 'مَتَاعًا', primaryTanweenType: 'do_zabar', tajweedRule: 'الف مدہ، عین دو زبر عَنْ۔', rowNumber: 4 },
  { id: 20, word: 'اٰیٰتٍ', spellingHijja: 'ہمزہ کھڑا زبر اٰ، یا کھڑا زبر یٰ، تا دو زیر تٍ = اٰیٰتٍ', audioPronunciation: 'اٰیٰتٍ', primaryTanweenType: 'do_zer', tajweedRule: 'کھڑی حرکات ایک الف، تا دو زیر تِنْ۔', rowNumber: 4 },

  // Row 5
  { id: 21, word: 'کُفُوًا', spellingHijja: 'کاف پیش کُ، فا پیش فُ، واؤ دو زبر وَنْ = کُفُوًا', audioPronunciation: 'کُفُوًا', primaryTanweenType: 'do_zabar', tajweedRule: 'بغیر جھٹکے کے کُفُوًا ادا کریں۔ واؤ دو زبر وَنْ۔', rowNumber: 5 },
  { id: 22, word: 'اَمِیْنٌ', spellingHijja: 'ہمزہ زبر اَ، میم یا زیر مِیْ، نون دو پیش نٌ = اَمِیْنٌ', audioPronunciation: 'اَمِیْنٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'یاء مدہ، نون دو پیش نُنْ۔', rowNumber: 5 },
  { id: 23, word: 'کَرِیْمٍ', spellingHijja: 'کاف زبر کَ، را یا زیر رِیْ، میم دو زیر مٍ = کَرِیْمٍ', audioPronunciation: 'کَرِیْمٍ', primaryTanweenType: 'do_zer', tajweedRule: 'را یاء مدہ باریک، میم دو زیر مِنْ۔', rowNumber: 5 },
  { id: 24, word: 'قُرْاٰنٌ', spellingHijja: 'قاف را پیش قُرْ، ہمزہ کھڑا زبر اٰ، نون دو پیش نٌ = قُرْاٰنٌ', audioPronunciation: 'قُرْاٰنٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'قاف اور را دونوں موٹے، نون دو پیش نُنْ۔', rowNumber: 5 },
  { id: 25, word: 'ثُبُوْرًا', spellingHijja: 'ثا پیش ثُ، با واؤ پیش بُوْ، را دو زبر رَنْ = ثُبُوْرًا', audioPronunciation: 'ثُبُوْرًا', primaryTanweenType: 'do_zabar', tajweedRule: 'ثا نرمی سے، را دو زبر پُر (موٹا) رَنْ۔', rowNumber: 5 },

  // Row 6
  { id: 26, word: 'کِرَامًا', spellingHijja: 'کاف زیر کِ، را الف زبر رَا، میم دو زبر مَنْ = کِرَامًا', audioPronunciation: 'کِرَامًا', primaryTanweenType: 'do_zabar', tajweedRule: 'را الف موٹا، میم دو زبر مَنْ۔', rowNumber: 6 },
  { id: 27, word: 'اَلِیْمًا', spellingHijja: 'ہمزہ زبر اَ، لام یا زیر لِیْ، میم دو زبر مَنْ = اَلِیْمًا', audioPronunciation: 'اَلِیْمًا', primaryTanweenType: 'do_zabar', tajweedRule: 'یاء مدہ ایک الف، میم دو زبر مَنْ۔', rowNumber: 6 },
  { id: 28, word: 'خَبِیْرٌ', spellingHijja: 'خا زبر خَ، با یا زیر بِیْ، را دو پیش رٌ = خَبِیْرٌ', audioPronunciation: 'خَبِیْرٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'خا موٹا، را دو پیش پر موٹا رُنْ۔', rowNumber: 6 },
  { id: 29, word: 'مُنِیْبٍ', spellingHijja: 'میم پیش مُ، نون یا زیر نِیْ، با دو زیر بٍ = مُنِیْبٍ', audioPronunciation: 'مُنِیْبٍ', primaryTanweenType: 'do_zer', tajweedRule: 'یاء مدہ، با دو زیر بِنْ۔', rowNumber: 6 },
  { id: 30, word: 'یَسِیْرًا', spellingHijja: 'یا زبر یَ، سین یا زیر سِیْ، را دو زبر رَنْ = یَسِیْرًا', audioPronunciation: 'یَسِیْرًا', primaryTanweenType: 'do_zabar', tajweedRule: 'سین میں سیٹی، را دو زبر موٹا رَنْ۔', rowNumber: 6 },

  // Row 7
  { id: 31, word: 'عَذَابٍ', spellingHijja: 'عین زبر عَ، ذال الف زبر ذَا، با دو زیر بٍ = عَذَابٍ', audioPronunciation: 'عَذَابٍ', primaryTanweenType: 'do_zer', tajweedRule: 'ذال نرمی سے، با دو زیر بِنْ۔', rowNumber: 7 },
  { id: 32, word: 'حِسَابًا', spellingHijja: 'حا زیر حِ، سین الف زبر سَا، با دو زبر بَنْ = حِسَابًا', audioPronunciation: 'حِسَابًا', primaryTanweenType: 'do_zabar', tajweedRule: 'حا وسط حلق سے، سین میں سیٹی، با دو زبر بَنْ۔', rowNumber: 7 },
  { id: 33, word: 'دِهَاقًا', spellingHijja: 'دال زیر دِ، ہا الف زبر ہَا، قاف دو زبر قَنْ = دِهَاقًا', audioPronunciation: 'دِهَاقًا', primaryTanweenType: 'do_zabar', tajweedRule: 'قاف دو زبر موٹا قَنْ۔', rowNumber: 7 },
  { id: 34, word: 'وَاحِدَةٌ', spellingHijja: 'واؤ الف زبر وَا، حا زیر حِ، دال زبر دَ، تا دو پیش تٌ = وَاحِدَةٌ', audioPronunciation: 'وَاحِدَةٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'الف مدہ، حا وسط حلق سے، تا دو پیش تُنْ۔', rowNumber: 7 },
  { id: 35, word: 'رَسُوْلٍ', spellingHijja: 'را زبر رَ، سین واؤ پیش سُوْ، لام دو زیر لٍ = رَسُوْلٍ', audioPronunciation: 'رَسُوْلٍ', primaryTanweenType: 'do_zer', tajweedRule: 'را زبر کی وجہ سے موٹا، لام دو زیر لِنْ۔', rowNumber: 7 },

  // Row 8
  { id: 36, word: 'مَعَاشًا', spellingHijja: 'میم زبر مَ، عین الف زبر عَا، شین دو زبر شَنْ = مَعَاشًا', audioPronunciation: 'مَعَاشًا', primaryTanweenType: 'do_zabar', tajweedRule: 'عین وسط حلق سے، شین میں تفشی شَنْ۔', rowNumber: 8 },
  { id: 37, word: 'مُحِیْطٌ', spellingHijja: 'میم پیش مُ، حا یا زیر حِیْ، طا دو پیش طٌ = مُحِیْطٌ', audioPronunciation: 'مُحِیْطٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'طا مستعلیہ (موٹا) طُنْ۔', rowNumber: 8 },
  { id: 38, word: 'اَفْوَاجًا', spellingHijja: 'ہمزہ فا زبر اَفْ، واؤ الف زبر وَا، جیم دو زبر جَنْ = اَفْوَاجًا', audioPronunciation: 'اَفْوَاجًا', primaryTanweenType: 'do_zabar', tajweedRule: 'فا میں ہوا، الف مدہ، جیم دو زبر جَنْ۔', rowNumber: 8 },
  { id: 39, word: 'هُمَزَةٍ', spellingHijja: 'ہا پیش ہُ، میم زبر مَ، زا زبر زَ، تا دو زیر تٍ = هُمَزَةٍ', audioPronunciation: 'هُمَزَةٍ', primaryTanweenType: 'do_zer', tajweedRule: 'زا میں سیٹی، تا دو زیر تِنْ۔', rowNumber: 8 },
  { id: 40, word: 'غَبَرَةٌ', spellingHijja: 'غین زبر غَ، با زبر بَ، را زبر رَ، تا دو پیش تٌ = غَبَرَةٌ', audioPronunciation: 'غَبَرَةٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'غین اور را دونوں موٹے، تا دو پیش تُنْ۔', rowNumber: 8 },

  // Row 9
  { id: 41, word: 'اَبْوَابًا', spellingHijja: 'ہمزہ با زبر اَبْ، واؤ الف زبر وَا، با دو زبر بَنْ = اَبْوَابًا', audioPronunciation: 'اَبْوَابًا', primaryTanweenType: 'do_zabar', tajweedRule: 'با ساکن پر قلقلہ، با دو زبر بَنْ۔', rowNumber: 9 },
  { id: 42, word: 'یَوْمَئِذٍ', spellingHijja: 'یا واؤ زبر یَوْ، میم زبر مَ، ہمزہ زیر اِ، ذال دو زیر ذٍ = یَوْمَئِذٍ', audioPronunciation: 'یَوْمَئِذٍ', primaryTanweenType: 'do_zer', tajweedRule: 'واؤ لین، ذال نرمی سے ذِنْ۔', rowNumber: 9 },
  { id: 43, word: 'مَوْلُوْدٌ', spellingHijja: 'میم واؤ زبر مَوْ، لام واؤ پیش لُوْ، دال دو پیش دٌ = مَوْلُوْدٌ', audioPronunciation: 'مَوْلُوْدٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'واؤ لین، واؤ مدہ، دال دو پیش دُنْ۔', rowNumber: 9 },
  { id: 44, word: 'رَاضِیَةٍ', spellingHijja: 'را الف زبر رَا، ضاد زیر ضِ، یا زبر یَ، تا دو زیر تٍ = رَاضِیَةٍ', audioPronunciation: 'رَاضِیَةٍ', primaryTanweenType: 'do_zer', tajweedRule: 'را اور ضاد دونوں موٹے، تا دو زیر تِنْ۔', rowNumber: 9 },
  { id: 45, word: 'حَامِیَةٌ', spellingHijja: 'حا الف زبر حَا، میم زیر مِ، یا زبر یَ، تا دو پیش تٌ = حَامِیَةٌ', audioPronunciation: 'حَامِیَةٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'حا وسط حلق سے، تا دو پیش تُنْ۔', rowNumber: 9 },

  // Row 10
  { id: 46, word: 'عِیْشَةٍ', spellingHijja: 'عین یا زیر عِیْ، شین زبر شَ، تا دو زیر تٍ = عِیْشَةٍ', audioPronunciation: 'عِیْشَةٍ', primaryTanweenType: 'do_zer', tajweedRule: 'یاء مدہ، شین میں تفشی، تا دو زیر تِنْ۔', rowNumber: 10 },
  { id: 47, word: 'مَرْقُوْمٌ', spellingHijja: 'میم را زبر مَرْ، قاف واؤ پیش قُوْ، میم دو پیش مٌ = مَرْقُوْمٌ', audioPronunciation: 'مَرْقُوْمٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'را اور قاف دونوں موٹے، میم دو پیش مُنْ۔', rowNumber: 10 },
  { id: 48, word: 'بَرَرَةٍ', spellingHijja: 'با زبر بَ، را زبر رَ، را زبر رَ، تا دو زیر تٍ = بَرَرَةٍ', audioPronunciation: 'بَرَرَةٍ', primaryTanweenType: 'do_zer', tajweedRule: 'دونوں را موٹے پڑھے جائیں گے، تا دو زیر تِنْ۔', rowNumber: 10 },
  { id: 49, word: 'رَءُوْفٌ', spellingHijja: 'را زبر رَ، ہمزہ واؤ پیش اُوْ، فا دو پیش فٌ = رَءُوْفٌ', audioPronunciation: 'رَءُوْفٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'را موٹا، واؤ مدہ، فا دو پیش فُنْ۔', rowNumber: 10 },
  { id: 50, word: 'اَنْدَادًا', spellingHijja: 'ہمزہ نون زبر اَنْ، دال الف زبر دَا، دال دو زبر دَنْ = اَنْدَادًا', audioPronunciation: 'اَنْدَادًا', primaryTanweenType: 'do_zabar', tajweedRule: 'نون ساکن پر اخفاء، الف مدہ، دال دو زبر دَنْ۔', rowNumber: 10 },

  // Row 11
  { id: 51, word: 'طَوِیْلًا', spellingHijja: 'طا زبر طَ، واؤ یا زیر وِیْ، لام دو زبر لَنْ = طَوِیْلًا', audioPronunciation: 'طَوِیْلًا', primaryTanweenType: 'do_zabar', tajweedRule: 'طا مستعلیہ (موٹا)، یاء مدہ، لام دو زبر لَنْ۔', rowNumber: 11 },
  { id: 52, word: 'غِشَاوَةٌ', spellingHijja: 'غین زیر غِ، شین الف زبر شَا، واؤ زبر وَ، تا دو پیش تٌ = غِشَاوَةٌ', audioPronunciation: 'غِشَاوَةٌ', primaryTanweenType: 'do_pesh', tajweedRule: 'غین موٹا، شین میں تفشی، تا دو پیش تُنْ۔', rowNumber: 11 },
  { id: 53, word: 'ظَلُومًا', spellingHijja: 'ظا زبر ظَ، لام واؤ پیش لُوْ، میم دو زبر مَنْ = ظَلُومًا', audioPronunciation: 'ظَلُومًا', primaryTanweenType: 'do_zabar', tajweedRule: 'ظا مستعلیہ (موٹا و نرم)، میم دو زبر مَنْ۔', rowNumber: 11 },
  { id: 54, word: 'حَدِیْثٍ', spellingHijja: 'حا زبر حَ، دال یا زیر دِیْ، ثا دو زیر ثٍ = حَدِیْثٍ', audioPronunciation: 'حَدِیْثٍ', primaryTanweenType: 'do_zer', tajweedRule: 'حا وسط حلق سے، ثا نرمی سے ثِنْ۔', rowNumber: 11 },
  { id: 55, word: 'مَحْفُوظٍ', spellingHijja: 'میم حا زبر مَحْ، فا واؤ پیش فُوْ، ظا دو زیر ظٍ = مَحْفُوظٍ', audioPronunciation: 'مَحْفُوظٍ', primaryTanweenType: 'do_zer', tajweedRule: 'حا وسط حلق سے، ظا موٹا اور نرم ظِنْ۔', rowNumber: 11 },
];

// =========================================================================
// 6. TANWEEN RULES (تجویدی قواعد برائے سبق ۸)
// =========================================================================
export const TANWEEN_RULES = [
  {
    id: 1,
    title: 'تنوین کی تعریف اور حقیقت',
    summary: 'دو زبر ( ً )، دو زیر ( ٍ ) اور دو پیش ( ٌ ) کو تنوین کہتے ہیں۔',
    details: 'جس حرف پر تنوین ہو اسے "مُنَوَّن" کہا جاتا ہے۔ تنوین دراصل ایک نون ساکن ( نْ ) ہوتا ہے جو کلمے کے آخر میں آتا ہے، اس لیے تنوین کو نون ساکن کی آواز میں پڑھا جاتا ہے۔ جیسے: اً = اَنْ ، اٍ = اِنْ ، اٌ = اُنْ',
    icon: '📖'
  },
  {
    id: 2,
    title: 'دو زبر کے بعد الف یا یاء کا قاعدہ',
    summary: 'دو زبر کے ساتھ الف یا کہیں یاء لکھا جاتا ہے مگر پڑھا نہیں جاتا۔',
    details: 'زبر کی تنوین کے بعد رسم الخط میں کہیں "ا" (الف) اور کہیں "ى" (یا) لکھا ہوتا ہے جیسے: تًا ، دًى۔ لیکن ہجے کرتے اور روانی پڑھتے وقت اس الف یا یاء کا نام بالکل نہیں لیا جاتا۔ گول تا ( ةً ) پر دو زبر ہو تو اس کے بعد الف نہیں لکھا جاتا۔',
    icon: '✍️'
  },
  {
    id: 3,
    title: 'تنوین کے ہجے کرنے کا طریقہ',
    summary: 'حرف کا نام + تنوین کا نام + نون ساکن کی ملی ہوئی آواز۔',
    details: 'مثال کے طور پر: مًا = میم دو زبر مَنْ، مٍ = میم دو زیر مِنْ، مٌ = میم دو پیش مُنْ (روانی: مَنْ ، مِنْ ، مُنْ)۔',
    icon: '🗣️'
  },
  {
    id: 4,
    title: 'مستعلیہ و راء کا قاعدہ تنوین میں',
    summary: 'حروف مستعلیہ تنوین میں بھی پُر (موٹے) پڑھے جائیں گے۔',
    details: 'سات حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) تنوین کی حالت میں بھی ہمیشہ پر رہیں گے۔ راء پر دو زبر اور دو پیش ہو تو راء موٹی ہوگی (رًا ، رٌ)، جبکہ دو زیر ہو تو راء باریک ہوگی (رٍ)۔',
    icon: '💎'
  }
];
