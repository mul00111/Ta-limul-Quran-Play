// Comprehensive Tajweed Data for Lesson 5: Huroof Leen (حروفِ لین: واؤ لین اور یاء لین)
// Pages 14 & 15 of Madani / Noorani Qaida

export interface LeenLetterItem {
  id: number;
  leenType: 'waw' | 'yaa';
  letter: string;           // e.g. "اَوْ" or "اَيْ"
  baseLetterName: string;   // e.g. "ہمزہ"
  hijjaSpelling: string;    // e.g. "ہمزہ واؤ زبر اَوْ" or "ہمزہ یاء زبر اَيْ"
  rawSound: string;         // e.g. "اَوْ"
  isHeavy: boolean;         // true for Musta'liyah letters (خ ص ض ط ظ غ ق) and Raa with Zabar
  ruleNote: string;
}

export interface LeenSingleCardItem {
  id: number;
  pairId: number;
  baseLetterName: string;
  leenType: 'waw' | 'yaa';
  displayLetter: string;      // e.g. "بَوْ"
  baseChar: string;           // e.g. "ب"
  suffixChar: string;         // e.g. "َوْ" or "َيْ"
  hijjaSpelling: string;      // e.g. "با واؤ زبر بَوْ" or "با یا زبر بَيْ"
  rawSound: string;           // e.g. "بَوْ"
  isHeavy: boolean;           // true for خ ص ض ط ظ غ ق
  isRaa?: boolean;
}

export interface LeenPairItem {
  id: number;
  baseLetterName: string;
  isHeavy: boolean;
  wawCard: LeenSingleCardItem;
  yaaCard: LeenSingleCardItem;
  combinedSound: string;      // e.g. "اَوْ ، اَيْ"
  combinedHijja: string;      // e.g. "ہمزہ واؤ زبر اَوْ ، ہمزہ یاء زبر اَيْ = اَوْ ، اَيْ"
}

// -------------------------------------------------------------
// COMPLETE UNIFIED LESSON: 29 PAIRS (58 CARDS) AS IN THE QAIDA BOOK (29 LETTERS OF HUROOF TAHAJJI)
// Starting with Alif/Hamza (اَوْ ، اَيْ) through Yaa (يَوْ ، يَيْ)
// -------------------------------------------------------------
export const UNIFIED_HUROOF_LEEN_PAIRS: LeenPairItem[] = [
  {
    id: 1,
    baseLetterName: 'ہمزہ / الف',
    isHeavy: false,
    wawCard: { id: 101, pairId: 1, baseLetterName: 'ہمزہ', leenType: 'waw', displayLetter: 'اَوْ', baseChar: 'اَ', suffixChar: 'وْ', hijjaSpelling: 'ہمزہ واؤ زبر اَوْ', rawSound: 'اَوْ', isHeavy: false },
    yaaCard: { id: 102, pairId: 1, baseLetterName: 'ہمزہ', leenType: 'yaa', displayLetter: 'اَيْ', baseChar: 'اَ', suffixChar: 'يْ', hijjaSpelling: 'ہمزہ یاء زبر اَيْ', rawSound: 'اَيْ', isHeavy: false },
    combinedSound: 'اَوْ ، اَيْ',
    combinedHijja: 'ہمزہ واؤ زبر اَوْ ، ہمزہ یاء زبر اَيْ = اَوْ ، اَيْ'
  },
  {
    id: 2,
    baseLetterName: 'باء',
    isHeavy: false,
    wawCard: { id: 103, pairId: 2, baseLetterName: 'باء', leenType: 'waw', displayLetter: 'بَوْ', baseChar: 'بَ', suffixChar: 'وْ', hijjaSpelling: 'با واؤ زبر بَوْ', rawSound: 'بَوْ', isHeavy: false },
    yaaCard: { id: 104, pairId: 2, baseLetterName: 'باء', leenType: 'yaa', displayLetter: 'بَيْ', baseChar: 'بَ', suffixChar: 'يْ', hijjaSpelling: 'با یا زبر بَيْ', rawSound: 'بَيْ', isHeavy: false },
    combinedSound: 'بَوْ ، بَيْ',
    combinedHijja: 'با واؤ زبر بَوْ ، با یا زبر بَيْ = بَوْ ، بَيْ'
  },
  {
    id: 3,
    baseLetterName: 'تاء',
    isHeavy: false,
    wawCard: { id: 105, pairId: 3, baseLetterName: 'تاء', leenType: 'waw', displayLetter: 'تَوْ', baseChar: 'تَ', suffixChar: 'وْ', hijjaSpelling: 'تا واؤ زبر تَوْ', rawSound: 'تَوْ', isHeavy: false },
    yaaCard: { id: 106, pairId: 3, baseLetterName: 'تاء', leenType: 'yaa', displayLetter: 'تَيْ', baseChar: 'تَ', suffixChar: 'يْ', hijjaSpelling: 'تا یا زبر تَيْ', rawSound: 'تَيْ', isHeavy: false },
    combinedSound: 'تَوْ ، تَيْ',
    combinedHijja: 'تا واؤ زبر تَوْ ، تا یا زبر تَيْ = تَوْ ، تَيْ'
  },
  {
    id: 4,
    baseLetterName: 'ثاء',
    isHeavy: false,
    wawCard: { id: 107, pairId: 4, baseLetterName: 'ثاء', leenType: 'waw', displayLetter: 'ثَوْ', baseChar: 'ثَ', suffixChar: 'وْ', hijjaSpelling: 'ثا واؤ زبر ثَوْ', rawSound: 'ثَوْ', isHeavy: false },
    yaaCard: { id: 108, pairId: 4, baseLetterName: 'ثاء', leenType: 'yaa', displayLetter: 'ثَيْ', baseChar: 'ثَ', suffixChar: 'يْ', hijjaSpelling: 'ثا یا زبر ثَيْ', rawSound: 'ثَيْ', isHeavy: false },
    combinedSound: 'ثَوْ ، ثَيْ',
    combinedHijja: 'ثا واؤ زبر ثَوْ ، ثا یا زبر ثَيْ = ثَوْ ، ثَيْ'
  },
  {
    id: 5,
    baseLetterName: 'جیم',
    isHeavy: false,
    wawCard: { id: 109, pairId: 5, baseLetterName: 'جیم', leenType: 'waw', displayLetter: 'جَوْ', baseChar: 'جَ', suffixChar: 'وْ', hijjaSpelling: 'جیم واؤ زبر جَوْ', rawSound: 'جَوْ', isHeavy: false },
    yaaCard: { id: 110, pairId: 5, baseLetterName: 'جیم', leenType: 'yaa', displayLetter: 'جَيْ', baseChar: 'جَ', suffixChar: 'يْ', hijjaSpelling: 'جیم یا زبر جَيْ', rawSound: 'جَيْ', isHeavy: false },
    combinedSound: 'جَوْ ، جَيْ',
    combinedHijja: 'جیم واؤ زبر جَوْ ، جیم یا زبر جَيْ = جَوْ ، جَيْ'
  },
  {
    id: 6,
    baseLetterName: 'حاء',
    isHeavy: false,
    wawCard: { id: 111, pairId: 6, baseLetterName: 'حاء', leenType: 'waw', displayLetter: 'حَوْ', baseChar: 'حَ', suffixChar: 'وْ', hijjaSpelling: 'حا واؤ زبر حَوْ', rawSound: 'حَوْ', isHeavy: false },
    yaaCard: { id: 112, pairId: 6, baseLetterName: 'حاء', leenType: 'yaa', displayLetter: 'حَيْ', baseChar: 'حَ', suffixChar: 'يْ', hijjaSpelling: 'حا یا زبر حَيْ', rawSound: 'حَيْ', isHeavy: false },
    combinedSound: 'حَوْ ، حَيْ',
    combinedHijja: 'حا واؤ زبر حَوْ ، حا یا زبر حَيْ = حَوْ ، حَيْ'
  },
  {
    id: 7,
    baseLetterName: 'خاء',
    isHeavy: true,
    wawCard: { id: 113, pairId: 7, baseLetterName: 'خاء', leenType: 'waw', displayLetter: 'خَوْ', baseChar: 'خَ', suffixChar: 'وْ', hijjaSpelling: 'خا واؤ زبر خَوْ', rawSound: 'خَوْ', isHeavy: true },
    yaaCard: { id: 114, pairId: 7, baseLetterName: 'خاء', leenType: 'yaa', displayLetter: 'خَيْ', baseChar: 'خَ', suffixChar: 'يْ', hijjaSpelling: 'خا یا زبر خَيْ', rawSound: 'خَيْ', isHeavy: true },
    combinedSound: 'خَوْ ، خَيْ',
    combinedHijja: 'خا واؤ زبر خَوْ ، خا یا زبر خَيْ = خَوْ ، خَيْ'
  },
  {
    id: 8,
    baseLetterName: 'دال',
    isHeavy: false,
    wawCard: { id: 115, pairId: 8, baseLetterName: 'دال', leenType: 'waw', displayLetter: 'دَوْ', baseChar: 'دَ', suffixChar: 'وْ', hijjaSpelling: 'دال واؤ زبر دَوْ', rawSound: 'دَوْ', isHeavy: false },
    yaaCard: { id: 116, pairId: 8, baseLetterName: 'دال', leenType: 'yaa', displayLetter: 'دَيْ', baseChar: 'دَ', suffixChar: 'يْ', hijjaSpelling: 'دال یا زبر دَيْ', rawSound: 'دَيْ', isHeavy: false },
    combinedSound: 'دَوْ ، دَيْ',
    combinedHijja: 'دال واؤ زبر دَوْ ، دال یا زبر دَيْ = دَوْ ، دَيْ'
  },
  {
    id: 9,
    baseLetterName: 'ذال',
    isHeavy: false,
    wawCard: { id: 117, pairId: 9, baseLetterName: 'ذال', leenType: 'waw', displayLetter: 'ذَوْ', baseChar: 'ذَ', suffixChar: 'وْ', hijjaSpelling: 'ذال واؤ زبر ذَوْ', rawSound: 'ذَوْ', isHeavy: false },
    yaaCard: { id: 118, pairId: 9, baseLetterName: 'ذال', leenType: 'yaa', displayLetter: 'ذَيْ', baseChar: 'ذَ', suffixChar: 'يْ', hijjaSpelling: 'ذال یا زبر ذَيْ', rawSound: 'ذَيْ', isHeavy: false },
    combinedSound: 'ذَوْ ، ذَيْ',
    combinedHijja: 'ذال واؤ زبر ذَوْ ، ذال یا زبر ذَيْ = ذَوْ ، ذَيْ'
  },
  {
    id: 10,
    baseLetterName: 'راء',
    isHeavy: true,
    wawCard: { id: 119, pairId: 10, baseLetterName: 'راء', leenType: 'waw', displayLetter: 'رَوْ', baseChar: 'رَ', suffixChar: 'وْ', hijjaSpelling: 'را واؤ زبر رَوْ', rawSound: 'رَوْ', isHeavy: true, isRaa: true },
    yaaCard: { id: 120, pairId: 10, baseLetterName: 'راء', leenType: 'yaa', displayLetter: 'رَيْ', baseChar: 'رَ', suffixChar: 'يْ', hijjaSpelling: 'را یا زبر رَيْ', rawSound: 'رَيْ', isHeavy: true, isRaa: true },
    combinedSound: 'رَوْ ، رَيْ',
    combinedHijja: 'را واؤ زبر رَوْ ، را یا زبر رَيْ = رَوْ ، رَيْ'
  },
  {
    id: 11,
    baseLetterName: 'زا',
    isHeavy: false,
    wawCard: { id: 121, pairId: 11, baseLetterName: 'زا', leenType: 'waw', displayLetter: 'زَوْ', baseChar: 'زَ', suffixChar: 'وْ', hijjaSpelling: 'زا واؤ زبر زَوْ', rawSound: 'زَوْ', isHeavy: false },
    yaaCard: { id: 122, pairId: 11, baseLetterName: 'زا', leenType: 'yaa', displayLetter: 'زَيْ', baseChar: 'زَ', suffixChar: 'يْ', hijjaSpelling: 'زا یا زبر زَيْ', rawSound: 'زَيْ', isHeavy: false },
    combinedSound: 'زَوْ ، زَيْ',
    combinedHijja: 'زا واؤ زبر زَوْ ، زا یا زبر زَيْ = زَوْ ، زَيْ'
  },
  {
    id: 12,
    baseLetterName: 'سین',
    isHeavy: false,
    wawCard: { id: 123, pairId: 12, baseLetterName: 'سین', leenType: 'waw', displayLetter: 'سَوْ', baseChar: 'سَ', suffixChar: 'وْ', hijjaSpelling: 'سین واؤ زبر سَوْ', rawSound: 'سَوْ', isHeavy: false },
    yaaCard: { id: 124, pairId: 12, baseLetterName: 'سین', leenType: 'yaa', displayLetter: 'سَيْ', baseChar: 'سَ', suffixChar: 'يْ', hijjaSpelling: 'سین یا زبر سَيْ', rawSound: 'سَيْ', isHeavy: false },
    combinedSound: 'سَوْ ، سَيْ',
    combinedHijja: 'سین واؤ زبر سَوْ ، سین یا زبر سَيْ = سَوْ ، سَيْ'
  },
  {
    id: 13,
    baseLetterName: 'شین',
    isHeavy: false,
    wawCard: { id: 125, pairId: 13, baseLetterName: 'شین', leenType: 'waw', displayLetter: 'شَوْ', baseChar: 'شَ', suffixChar: 'وْ', hijjaSpelling: 'شین واؤ زبر شَوْ', rawSound: 'شَوْ', isHeavy: false },
    yaaCard: { id: 126, pairId: 13, baseLetterName: 'شین', leenType: 'yaa', displayLetter: 'شَيْ', baseChar: 'شَ', suffixChar: 'يْ', hijjaSpelling: 'شین یا زبر شَيْ', rawSound: 'شَيْ', isHeavy: false },
    combinedSound: 'شَوْ ، شَيْ',
    combinedHijja: 'شین واؤ زبر شَوْ ، شین یا زبر شَيْ = شَوْ ، شَيْ'
  },
  {
    id: 14,
    baseLetterName: 'صاد',
    isHeavy: true,
    wawCard: { id: 127, pairId: 14, baseLetterName: 'صاد', leenType: 'waw', displayLetter: 'صَوْ', baseChar: 'صَ', suffixChar: 'وْ', hijjaSpelling: 'صاد واؤ زبر صَوْ', rawSound: 'صَوْ', isHeavy: true },
    yaaCard: { id: 128, pairId: 14, baseLetterName: 'صاد', leenType: 'yaa', displayLetter: 'صَيْ', baseChar: 'صَ', suffixChar: 'يْ', hijjaSpelling: 'صاد یا زبر صَيْ', rawSound: 'صَيْ', isHeavy: true },
    combinedSound: 'صَوْ ، صَيْ',
    combinedHijja: 'صاد واؤ زبر صَوْ ، صاد یا زبر صَيْ = صَوْ ، صَيْ'
  },
  {
    id: 15,
    baseLetterName: 'ضاد',
    isHeavy: true,
    wawCard: { id: 129, pairId: 15, baseLetterName: 'ضاد', leenType: 'waw', displayLetter: 'ضَوْ', baseChar: 'ضَ', suffixChar: 'وْ', hijjaSpelling: 'ضاد واؤ زبر ضَوْ', rawSound: 'ضَوْ', isHeavy: true },
    yaaCard: { id: 130, pairId: 15, baseLetterName: 'ضاد', leenType: 'yaa', displayLetter: 'ضَيْ', baseChar: 'ضَ', suffixChar: 'يْ', hijjaSpelling: 'ضاد یا زبر ضَيْ', rawSound: 'ضَيْ', isHeavy: true },
    combinedSound: 'ضَوْ ، ضَيْ',
    combinedHijja: 'ضاد واؤ زبر ضَوْ ، ضاد یا زبر ضَيْ = ضَوْ ، ضَيْ'
  },
  {
    id: 16,
    baseLetterName: 'طاء',
    isHeavy: true,
    wawCard: { id: 131, pairId: 16, baseLetterName: 'طاء', leenType: 'waw', displayLetter: 'طَوْ', baseChar: 'طَ', suffixChar: 'وْ', hijjaSpelling: 'طا واؤ زبر طَوْ', rawSound: 'طَوْ', isHeavy: true },
    yaaCard: { id: 132, pairId: 16, baseLetterName: 'طاء', leenType: 'yaa', displayLetter: 'طَيْ', baseChar: 'طَ', suffixChar: 'يْ', hijjaSpelling: 'طا یا زبر طَيْ', rawSound: 'طَيْ', isHeavy: true },
    combinedSound: 'طَوْ ، طَيْ',
    combinedHijja: 'طا واؤ زبر طَوْ ، طا یا زبر طَيْ = طَوْ ، طَيْ'
  },
  {
    id: 17,
    baseLetterName: 'ظاء',
    isHeavy: true,
    wawCard: { id: 133, pairId: 17, baseLetterName: 'ظاء', leenType: 'waw', displayLetter: 'ظَوْ', baseChar: 'ظَ', suffixChar: 'وْ', hijjaSpelling: 'ظا واؤ زبر ظَوْ', rawSound: 'ظَوْ', isHeavy: true },
    yaaCard: { id: 134, pairId: 17, baseLetterName: 'ظاء', leenType: 'yaa', displayLetter: 'ظَيْ', baseChar: 'ظَ', suffixChar: 'يْ', hijjaSpelling: 'ظا یا زبر ظَيْ', rawSound: 'ظَيْ', isHeavy: true },
    combinedSound: 'ظَوْ ، ظَيْ',
    combinedHijja: 'ظا واؤ زبر ظَوْ ، ظا یا زبر ظَيْ = ظَوْ ، ظَيْ'
  },
  {
    id: 18,
    baseLetterName: 'عین',
    isHeavy: false,
    wawCard: { id: 135, pairId: 18, baseLetterName: 'عین', leenType: 'waw', displayLetter: 'عَوْ', baseChar: 'عَ', suffixChar: 'وْ', hijjaSpelling: 'عین واؤ زبر عَوْ', rawSound: 'عَوْ', isHeavy: false },
    yaaCard: { id: 136, pairId: 18, baseLetterName: 'عین', leenType: 'yaa', displayLetter: 'عَيْ', baseChar: 'عَ', suffixChar: 'يْ', hijjaSpelling: 'عین یا زبر عَيْ', rawSound: 'عَيْ', isHeavy: false },
    combinedSound: 'عَوْ ، عَيْ',
    combinedHijja: 'عین واؤ زبر عَوْ ، عین یا زبر عَيْ = عَوْ ، عَيْ'
  },
  {
    id: 19,
    baseLetterName: 'غین',
    isHeavy: true,
    wawCard: { id: 137, pairId: 19, baseLetterName: 'غین', leenType: 'waw', displayLetter: 'غَوْ', baseChar: 'غَ', suffixChar: 'وْ', hijjaSpelling: 'غین واؤ زبر غَوْ', rawSound: 'غَوْ', isHeavy: true },
    yaaCard: { id: 138, pairId: 19, baseLetterName: 'غین', leenType: 'yaa', displayLetter: 'غَيْ', baseChar: 'غَ', suffixChar: 'يْ', hijjaSpelling: 'غین یا زبر غَيْ', rawSound: 'غَيْ', isHeavy: true },
    combinedSound: 'غَوْ ، غَيْ',
    combinedHijja: 'غین واؤ زبر غَوْ ، غین یا زبر غَيْ = غَوْ ، غَيْ'
  },
  {
    id: 20,
    baseLetterName: 'فاء',
    isHeavy: false,
    wawCard: { id: 139, pairId: 20, baseLetterName: 'فاء', leenType: 'waw', displayLetter: 'فَوْ', baseChar: 'فَ', suffixChar: 'وْ', hijjaSpelling: 'فا واؤ زبر فَوْ', rawSound: 'فَوْ', isHeavy: false },
    yaaCard: { id: 140, pairId: 20, baseLetterName: 'فاء', leenType: 'yaa', displayLetter: 'فَيْ', baseChar: 'فَ', suffixChar: 'يْ', hijjaSpelling: 'فا یا زبر فَيْ', rawSound: 'فَيْ', isHeavy: false },
    combinedSound: 'فَوْ ، فَيْ',
    combinedHijja: 'فا واؤ زبر فَوْ ، فا یا زبر فَيْ = فَوْ ، فَيْ'
  },
  {
    id: 21,
    baseLetterName: 'قاف',
    isHeavy: true,
    wawCard: { id: 141, pairId: 21, baseLetterName: 'قاف', leenType: 'waw', displayLetter: 'قَوْ', baseChar: 'قَ', suffixChar: 'وْ', hijjaSpelling: 'قاف واؤ زبر قَوْ', rawSound: 'قَوْ', isHeavy: true },
    yaaCard: { id: 142, pairId: 21, baseLetterName: 'قاف', leenType: 'yaa', displayLetter: 'قَيْ', baseChar: 'قَ', suffixChar: 'يْ', hijjaSpelling: 'قاف یا زبر قَيْ', rawSound: 'قَيْ', isHeavy: true },
    combinedSound: 'قَوْ ، قَيْ',
    combinedHijja: 'قاف واؤ زبر قَوْ ، قاف یا زبر قَيْ = قَوْ ، قَيْ'
  },
  {
    id: 22,
    baseLetterName: 'کاف',
    isHeavy: false,
    wawCard: { id: 143, pairId: 22, baseLetterName: 'کاف', leenType: 'waw', displayLetter: 'كَوْ', baseChar: 'كَ', suffixChar: 'وْ', hijjaSpelling: 'کاف واؤ زبر كَوْ', rawSound: 'كَوْ', isHeavy: false },
    yaaCard: { id: 144, pairId: 22, baseLetterName: 'کاف', leenType: 'yaa', displayLetter: 'كَيْ', baseChar: 'كَ', suffixChar: 'يْ', hijjaSpelling: 'کاف یا زبر كَيْ', rawSound: 'كَيْ', isHeavy: false },
    combinedSound: 'كَوْ ، كَيْ',
    combinedHijja: 'کاف واؤ زبر كَوْ ، کاف یا زبر كَيْ = كَوْ ، كَيْ'
  },
  {
    id: 23,
    baseLetterName: 'لام',
    isHeavy: false,
    wawCard: { id: 145, pairId: 23, baseLetterName: 'لام', leenType: 'waw', displayLetter: 'لَوْ', baseChar: 'لَ', suffixChar: 'وْ', hijjaSpelling: 'لام واؤ زبر لَوْ', rawSound: 'لَوْ', isHeavy: false },
    yaaCard: { id: 146, pairId: 23, baseLetterName: 'لام', leenType: 'yaa', displayLetter: 'لَيْ', baseChar: 'لَ', suffixChar: 'يْ', hijjaSpelling: 'لام یا زبر لَيْ', rawSound: 'لَيْ', isHeavy: false },
    combinedSound: 'لَوْ ، لَيْ',
    combinedHijja: 'لام واؤ زبر لَوْ ، لام یا زبر لَيْ = لَوْ ، لَيْ'
  },
  {
    id: 24,
    baseLetterName: 'میم',
    isHeavy: false,
    wawCard: { id: 147, pairId: 24, baseLetterName: 'میم', leenType: 'waw', displayLetter: 'مَوْ', baseChar: 'مَ', suffixChar: 'وْ', hijjaSpelling: 'میم واؤ زبر مَوْ', rawSound: 'مَوْ', isHeavy: false },
    yaaCard: { id: 148, pairId: 24, baseLetterName: 'میم', leenType: 'yaa', displayLetter: 'مَيْ', baseChar: 'مَ', suffixChar: 'يْ', hijjaSpelling: 'میم یا زبر مَيْ', rawSound: 'مَيْ', isHeavy: false },
    combinedSound: 'مَوْ ، مَيْ',
    combinedHijja: 'میم واؤ زبر مَوْ ، میم یا زبر مَيْ = مَوْ ، مَيْ'
  },
  {
    id: 25,
    baseLetterName: 'نون',
    isHeavy: false,
    wawCard: { id: 149, pairId: 25, baseLetterName: 'نون', leenType: 'waw', displayLetter: 'نَوْ', baseChar: 'نَ', suffixChar: 'وْ', hijjaSpelling: 'نون واؤ زبر نَوْ', rawSound: 'نَوْ', isHeavy: false },
    yaaCard: { id: 150, pairId: 25, baseLetterName: 'نون', leenType: 'yaa', displayLetter: 'نَيْ', baseChar: 'نَ', suffixChar: 'يْ', hijjaSpelling: 'نون یا زبر نَيْ', rawSound: 'نَيْ', isHeavy: false },
    combinedSound: 'نَوْ ، نَيْ',
    combinedHijja: 'نون واؤ زبر نَوْ ، نون یا زبر نَيْ = نَوْ ، نَيْ'
  },
  {
    id: 26,
    baseLetterName: 'واؤ',
    isHeavy: false,
    wawCard: { id: 151, pairId: 26, baseLetterName: 'واؤ', leenType: 'waw', displayLetter: 'وَوْ', baseChar: 'وَ', suffixChar: 'وْ', hijjaSpelling: 'واؤ واؤ زبر وَوْ', rawSound: 'وَوْ', isHeavy: false },
    yaaCard: { id: 152, pairId: 26, baseLetterName: 'واؤ', leenType: 'yaa', displayLetter: 'وَيْ', baseChar: 'وَ', suffixChar: 'يْ', hijjaSpelling: 'واؤ یا زبر وَيْ', rawSound: 'وَيْ', isHeavy: false },
    combinedSound: 'وَوْ ، وَيْ',
    combinedHijja: 'واؤ واؤ زبر وَوْ ، واؤ یا زبر وَيْ = وَوْ ، وَيْ'
  },
  {
    id: 27,
    baseLetterName: 'ہاء',
    isHeavy: false,
    wawCard: { id: 153, pairId: 27, baseLetterName: 'ہاء', leenType: 'waw', displayLetter: 'هَوْ', baseChar: 'هَ', suffixChar: 'وْ', hijjaSpelling: 'ہاء واؤ زبر هَوْ', rawSound: 'هَوْ', isHeavy: false },
    yaaCard: { id: 154, pairId: 27, baseLetterName: 'ہاء', leenType: 'yaa', displayLetter: 'هَيْ', baseChar: 'هَ', suffixChar: 'يْ', hijjaSpelling: 'ہاء یا زبر هَيْ', rawSound: 'هَيْ', isHeavy: false },
    combinedSound: 'هَوْ ، هَيْ',
    combinedHijja: 'ہاء واؤ زبر هَوْ ، ہاء یا زبر هَيْ = هَوْ ، هَيْ'
  },
  {
    id: 28,
    baseLetterName: 'ہمزہ',
    isHeavy: false,
    wawCard: { id: 155, pairId: 28, baseLetterName: 'ہمزہ', leenType: 'waw', displayLetter: 'ءَوْ', baseChar: 'ءَ', suffixChar: 'وْ', hijjaSpelling: 'ہمزہ واؤ زبر ءَوْ', rawSound: 'ءَوْ', isHeavy: false },
    yaaCard: { id: 156, pairId: 28, baseLetterName: 'ہمزہ', leenType: 'yaa', displayLetter: 'ءَيْ', baseChar: 'ءَ', suffixChar: 'يْ', hijjaSpelling: 'ہمزہ یاء زبر ءَيْ', rawSound: 'ءَيْ', isHeavy: false },
    combinedSound: 'ءَوْ ، ءَيْ',
    combinedHijja: 'ہمزہ واؤ زبر ءَوْ ، ہمزہ یاء زبر ءَيْ = ءَوْ ، ءَيْ'
  },
  {
    id: 29,
    baseLetterName: 'یاء',
    isHeavy: false,
    wawCard: { id: 157, pairId: 29, baseLetterName: 'یاء', leenType: 'waw', displayLetter: 'يَوْ', baseChar: 'يَ', suffixChar: 'وْ', hijjaSpelling: 'یاء واؤ زبر يَوْ', rawSound: 'يَوْ', isHeavy: false },
    yaaCard: { id: 158, pairId: 29, baseLetterName: 'یاء', leenType: 'yaa', displayLetter: 'يَيْ', baseChar: 'يَ', suffixChar: 'يْ', hijjaSpelling: 'یاء یا زبر يَيْ', rawSound: 'يَيْ', isHeavy: false },
    combinedSound: 'يَوْ ، يَيْ',
    combinedHijja: 'یاء واؤ زبر يَوْ ، یاء یا زبر يَيْ = يَوْ ، يَيْ'
  }
];

// Flat list of all 58 cards in order (29 letters x 2 = 58 cards)
export const UNIFIED_ALL_LEEN_CARDS: LeenSingleCardItem[] = UNIFIED_HUROOF_LEEN_PAIRS.flatMap(p => [p.wawCard, p.yaaCard]);


export interface LeenWordItem {
  id: number;
  page: 14 | 15;
  leenType: 'waw' | 'yaa' | 'both';
  word: string;             // e.g. "سَوْفَ" or "اَيْنَ"
  breakdown: string;        // e.g. "سَوْ + فَ"
  spellingHijja: string;    // e.g. "سین واؤ زبر سَوْ ، فا زبر فَ = سَوْفَ"
  categoryLabelUrdu: string;// e.g. "واؤ لین ۲ حرفی"
  letterCount: number;      // 2 | 3 | 4 | 5
  isHeavyLetterIncluded: boolean;
  hasBothLeen?: boolean;    // for زَوْجَيْنِ and حَوْلَيْنِ
  meaningOrContext?: string;
  quranicSurahRef?: string;
}

// -------------------------------------------------------------
// TAJWEED OFFICIAL RULES FOR LESSON 5
// -------------------------------------------------------------
export const HUROOF_LEEN_RULES = {
  title: 'سبق نمبر ۵: حروفِ لین (واؤ لین و یاء لین)',
  summary: 'حروف لین دو ہیں: (۱) واؤ لین (۲) یاء لین۔ انہیں بغیر کھینچے، نرم آواز کے ساتھ، معروف طریقہ سے جلدی پڑھا جاتا ہے۔',
  definitionWaw: 'واؤ ساکن (وْ) سے پہلے زبر ( َ ) ہو تو اسے "واؤ لین" کہتے ہیں۔ جیسے: اَوْ ، بَوْ ، سَوْفَ',
  definitionYaa: 'یاء ساکن (يْ) سے پہلے زبر ( َ ) ہو تو اسے "یاء لین" کہتے ہیں۔ جیسے: اَيْ ، بَيْ ، اَيْنَ',
  howToRead: [
    'نرمی کے ساتھ پڑھیں: حروف لین کو ادا کرتے وقت آواز میں سختی یا جھٹکا نہ ہو۔',
    'بغیر کھینچے جلدی پڑھیں: حروفِ مدہ کی طرح ان کو کھینچا نہیں جاتا بلکہ فوراً ادا کیا جاتا ہے۔',
    'معروف پڑھیں، مجہول سے بچیں: واؤ لین کو او (O) اور یاء لین کو اے (Ay/E) کی طرح مجہول پڑھنے سے سختی سے بچیں۔',
    'حروفِ مستعلیہ کا دھیان: خ، ص، ض، ط، ظ، غ، ق اور زبر والی راء کو ہر حال میں پُر (موٹا) پڑھا جائے گا۔',
    'وقف کی صورت میں مدِ لین: اگر کلمے کے آخری حرف پر وقف کیا جائے تو حروف لین کے بعد مدِ لین (طول، توسط یا قصر) واقع ہوتی ہے۔'
  ],
  comparisonTable: [
    { type: 'واؤ لین', condition: 'واؤ ساکن سے پہلے زبر', example: 'خَوْفٍ ، سَوْفَ', duration: 'بغیر کھینچے فوراً' },
    { type: 'واؤ مدہ', condition: 'واؤ ساکن سے پہلے پیش', example: 'يَقُوْلُ ، نُوْرٌ', duration: '۱ الف (۲ حرکات) کے برابر' },
    { type: 'یاء لین', condition: 'یاء ساکن سے پہلے زبر', example: 'بَيْتٍ ، قُرَيْشٍ', duration: 'بغیر کھینچے فوراً' },
    { type: 'یاء مدہ', condition: 'یاء ساکن سے پہلے زیر', example: 'فِيْهِ ، دِيْنُ', duration: '۱ الف (۲ حرکات) کے برابر' },
  ]
};

// -------------------------------------------------------------
// PAGE 14: WAW LEEN - 29 MUFRADAT LETTERS (حروفِ واؤ لین)
// -------------------------------------------------------------
export const WAW_LEEN_LETTERS: LeenLetterItem[] = [
  { id: 1, leenType: 'waw', letter: 'اَوْ', baseLetterName: 'ہمزہ', hijjaSpelling: 'ہمزہ واؤ زبر اَوْ', rawSound: 'اَوْ', isHeavy: false, ruleNote: 'الف پر حرکت یا سکون ہو تو ہمزہ بن جاتا ہے' },
  { id: 2, leenType: 'waw', letter: 'بَوْ', baseLetterName: 'باء', hijjaSpelling: 'باء واؤ زبر بَوْ', rawSound: 'بَوْ', isHeavy: false, ruleNote: 'ہونٹوں کے تر حصے سے ادا ہوتا ہے' },
  { id: 3, leenType: 'waw', letter: 'تَوْ', baseLetterName: 'تاء', hijjaSpelling: 'تاء واؤ زبر تَوْ', rawSound: 'تَوْ', isHeavy: false, ruleNote: 'زبان کی نوک اور سامنے کے اوپر والے دانتوں کی جڑ سے' },
  { id: 4, leenType: 'waw', letter: 'ثَوْ', baseLetterName: 'ثاء', hijjaSpelling: 'ثاء واؤ زبر ثَوْ', rawSound: 'ثَوْ', isHeavy: false, ruleNote: 'نرمی سے سیٹی کے بغیر پڑھیں' },
  { id: 5, leenType: 'waw', letter: 'جَوْ', baseLetterName: 'جیم', hijjaSpelling: 'جیم واؤ زبر جَوْ', rawSound: 'جَوْ', isHeavy: false, ruleNote: 'زبان کے درمیان اور تالو سے' },
  { id: 6, leenType: 'waw', letter: 'حَوْ', baseLetterName: 'حاء', hijjaSpelling: 'حاء واؤ زبر حَوْ', rawSound: 'حَوْ', isHeavy: false, ruleNote: 'درمیان حلق سے صاف آواز میں' },
  { id: 7, leenType: 'waw', letter: 'خَوْ', baseLetterName: 'خاء', hijjaSpelling: 'خاء واؤ زبر خَوْ', rawSound: 'خَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: پُر (موٹا) پڑھا جائے گا' },
  { id: 8, leenType: 'waw', letter: 'دَوْ', baseLetterName: 'دال', hijjaSpelling: 'دال واؤ زبر دَوْ', rawSound: 'دَوْ', isHeavy: false, ruleNote: 'باریک اور صاف آواز میں' },
  { id: 9, leenType: 'waw', letter: 'ذَوْ', baseLetterName: 'ذال', hijjaSpelling: 'ذال واؤ زبر ذَوْ', rawSound: 'ذَوْ', isHeavy: false, ruleNote: 'نرمی سے بغیر سیٹی کے' },
  { id: 10, leenType: 'waw', letter: 'رَوْ', baseLetterName: 'راء', hijjaSpelling: 'راء واؤ زبر رَوْ', rawSound: 'رَوْ', isHeavy: true, ruleNote: 'راء پر زبر کی وجہ سے پُر (موٹی) پڑھی جائے گی' },
  { id: 11, leenType: 'waw', letter: 'زَوْ', baseLetterName: 'زا', hijjaSpelling: 'زا واؤ زبر زَوْ', rawSound: 'زَوْ', isHeavy: false, ruleNote: 'سیٹی کی تیز آواز کے ساتھ' },
  { id: 12, leenType: 'waw', letter: 'سَوْ', baseLetterName: 'سین', hijjaSpelling: 'سین واؤ زبر سَوْ', rawSound: 'سَوْ', isHeavy: false, ruleNote: 'باریک اور سیٹی کے ساتھ' },
  { id: 13, leenType: 'waw', letter: 'شَوْ', baseLetterName: 'شین', hijjaSpelling: 'شین واؤ زبر شَوْ', rawSound: 'شَوْ', isHeavy: false, ruleNote: 'منہ میں آواز پھیلا کر (تفشی)' },
  { id: 14, leenType: 'waw', letter: 'صَوْ', baseLetterName: 'صاد', hijjaSpelling: 'صاد واؤ زبر صَوْ', rawSound: 'صَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: پُر اور سیٹی کے ساتھ' },
  { id: 15, leenType: 'waw', letter: 'ضَوْ', baseLetterName: 'ضاد', hijjaSpelling: 'ضاد واؤ زبر ضَوْ', rawSound: 'ضَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: زبان کی کروٹ اور داڑھوں سے پُر' },
  { id: 16, leenType: 'waw', letter: 'طَوْ', baseLetterName: 'طاء', hijjaSpelling: 'طاء واؤ زبر طَوْ', rawSound: 'طَوْ', isHeavy: true, ruleNote: 'سب سے زیادہ پُر اور قوی حرف' },
  { id: 17, leenType: 'waw', letter: 'ظَوْ', baseLetterName: 'ظاء', hijjaSpelling: 'ظاء واؤ زبر ظَوْ', rawSound: 'ظَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: نرمی اور پُر آواز کے ساتھ' },
  { id: 18, leenType: 'waw', letter: 'عَوْ', baseLetterName: 'عین', hijjaSpelling: 'عین واؤ زبر عَوْ', rawSound: 'عَوْ', isHeavy: false, ruleNote: 'درمیان حلق سے' },
  { id: 19, leenType: 'waw', letter: 'غَوْ', baseLetterName: 'غین', hijjaSpelling: 'غین واؤ زبر غَوْ', rawSound: 'غَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: ابتدائے حلق سے پُر' },
  { id: 20, leenType: 'waw', letter: 'فَوْ', baseLetterName: 'فاء', hijjaSpelling: 'فاء واؤ زبر فَوْ', rawSound: 'فَوْ', isHeavy: false, ruleNote: 'اوپر کے دانتوں کے کنارے اور نچلے ہونٹ کے پیٹ سے' },
  { id: 21, leenType: 'waw', letter: 'قَوْ', baseLetterName: 'قاف', hijjaSpelling: 'قاف واؤ زبر قَوْ', rawSound: 'قَوْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: زبان کی جڑ اور نرم تالو سے پُر' },
  { id: 22, leenType: 'waw', letter: 'كَوْ', baseLetterName: 'کاف', hijjaSpelling: 'کاف واؤ زبر كَوْ', rawSound: 'كَوْ', isHeavy: false, ruleNote: 'باریک آواز میں' },
  { id: 23, leenType: 'waw', letter: 'لَوْ', baseLetterName: 'لام', hijjaSpelling: 'لام واؤ زبر لَوْ', rawSound: 'لَوْ', isHeavy: false, ruleNote: 'زبان کی کروٹ کے کنارے سے تالو تک' },
  { id: 24, leenType: 'waw', letter: 'مَوْ', baseLetterName: 'میم', hijjaSpelling: 'میم واؤ زبر مَوْ', rawSound: 'مَوْ', isHeavy: false, ruleNote: 'دونوں ہونٹوں کے خشکی والے حصے سے' },
  { id: 25, leenType: 'waw', letter: 'نَوْ', baseLetterName: 'نون', hijjaSpelling: 'نون واؤ زبر نَوْ', rawSound: 'نَوْ', isHeavy: false, ruleNote: 'زبان کی نوک اور سامنے والے تالو سے' },
  { id: 26, leenType: 'waw', letter: 'وَّوْ', baseLetterName: 'واؤ', hijjaSpelling: 'واؤ واؤ زبر وَّوْ', rawSound: 'وَّوْ', isHeavy: false, ruleNote: 'ہونٹوں کو گول کر کے ادا کریں' },
  { id: 27, leenType: 'waw', letter: 'هَوْ', baseLetterName: 'ہاء', hijjaSpelling: 'ہاء واؤ زبر هَوْ', rawSound: 'هَوْ', isHeavy: false, ruleNote: 'انتہائے حلق (سینے کی طرف) سے' },
  { id: 28, leenType: 'waw', letter: 'ءَوْ', baseLetterName: 'ہمزہ', hijjaSpelling: 'ہمزہ واؤ زبر ءَوْ', rawSound: 'ءَوْ', isHeavy: false, ruleNote: 'صاف اور بغیر جھٹکے کے' },
  { id: 29, leenType: 'waw', letter: 'يَوْ', baseLetterName: 'یاء', hijjaSpelling: 'یاء واؤ زبر يَوْ', rawSound: 'يَوْ', isHeavy: false, ruleNote: 'زبان کے درمیان سے' },
];

// -------------------------------------------------------------
// PAGE 14: WAW LEEN WORDS (35 قرآنی و قراءتی کلمات)
// -------------------------------------------------------------
export const PAGE_14_WAW_LEEN_WORDS: LeenWordItem[] = [
  // Row 1
  { id: 101, page: 14, leenType: 'waw', word: 'سَوْفَ', breakdown: 'سَوْ + فَ', spellingHijja: 'سین واؤ زبر سَوْ ، فا زبر فَ = سَوْفَ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'عنقریب (قرآنی لفظ)' },
  { id: 102, page: 14, leenType: 'waw', word: 'مَوْتَ', breakdown: 'مَوْ + تَ', spellingHijja: 'میم واؤ زبر مَوْ ، تا زبر تَ = مَوْتَ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'موت' },
  { id: 103, page: 14, leenType: 'waw', word: 'نَوْمُ', breakdown: 'نَوْ + مُ', spellingHijja: 'نون واؤ زبر نَوْ ، میم پیش مُ = نَوْمُ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'نیند' },
  { id: 104, page: 14, leenType: 'waw', word: 'يَوْمِ', breakdown: 'يَوْ + مِ', spellingHijja: 'یا واؤ زبر يَوْ ، میم زیر مِ = يَوْمِ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'دن / روز' },
  { id: 105, page: 14, leenType: 'waw', word: 'لَوْحُ', breakdown: 'لَوْ + حُ', spellingHijja: 'لام واؤ زبر لَوْ ، حا پیش حُ = لَوْحُ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'تختی (لوح محفوظ)' },

  // Row 2
  { id: 106, page: 14, leenType: 'waw', word: 'حَوْلَ', breakdown: 'حَوْ + لَ', spellingHijja: 'حا واؤ زبر حَوْ ، لام زبر لَ = حَوْلَ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'ارد گرد / طاقت' },
  { id: 107, page: 14, leenType: 'waw', word: 'فَوْقُ', breakdown: 'فَوْ + قُ', spellingHijja: 'فا واؤ زبر فَوْ ، قاف پیش قُ = فَوْقُ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'اوپر' },
  { id: 108, page: 14, leenType: 'waw', word: 'زَوْجُ', breakdown: 'زَوْ + جُ', spellingHijja: 'زا واؤ زبر زَوْ ، جیم پیش جُ = زَوْجُ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'جوڑا' },
  { id: 109, page: 14, leenType: 'waw', word: 'سَوْطَ', breakdown: 'سَوْ + طَ', spellingHijja: 'سین واؤ زبر سَوْ ، طا زبر طَ = سَوْطَ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'کوڑا / عذاب کا تازیانہ' },
  { id: 110, page: 14, leenType: 'waw', word: 'قَوْلُ', breakdown: 'قَوْ + لُ', spellingHijja: 'قاف واؤ زبر قَوْ ، لام پیش لُ = قَوْلُ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'بات / کلام' },

  // Row 3
  { id: 111, page: 14, leenType: 'waw', word: 'ثَوْبُ', breakdown: 'ثَوْ + بُ', spellingHijja: 'ثا واؤ زبر ثَوْ ، با پیش بُ = ثَوْبُ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'لباس / کپڑا' },
  { id: 112, page: 14, leenType: 'waw', word: 'خَوْفَ', breakdown: 'خَوْ + فَ', spellingHijja: 'خا واؤ زبر خَوْ ، فا زبر فَ = خَوْفَ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'ڈر / خوف' },
  { id: 113, page: 14, leenType: 'waw', word: 'صَوْتُ', breakdown: 'صَوْ + تُ', spellingHijja: 'صاد واؤ زبر صَوْ ، تا پیش تُ = صَوْتُ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'آواز' },
  { id: 114, page: 14, leenType: 'waw', word: 'صَوْمَ', breakdown: 'صَوْ + مَ', spellingHijja: 'صاد واؤ زبر صَوْ ، میم زبر مَ = صَوْمَ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'روزہ' },
  { id: 115, page: 14, leenType: 'waw', word: 'فَوْزُ', breakdown: 'فَوْ + زُ', spellingHijja: 'فا واؤ زبر فَوْ ، زا پیش زُ = فَوْزُ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'کامیابی' },

  // Row 4
  { id: 116, page: 14, leenType: 'waw', word: 'دَوْرَ', breakdown: 'دَوْ + رَ', spellingHijja: 'دال واؤ زبر دَوْ ، را زبر رَ = دَوْرَ', categoryLabelUrdu: 'واؤ لین مع راء پُر', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'چکر / باری' },
  { id: 117, page: 14, leenType: 'waw', word: 'سَوْءَ', breakdown: 'سَوْ + ءَ', spellingHijja: 'سین واؤ زبر سَوْ ، ہمزہ زبر ءَ = سَوْءَ', categoryLabelUrdu: 'واؤ لین مع ہمزہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'برائی' },
  { id: 118, page: 14, leenType: 'waw', word: 'رَأَوْ', breakdown: 'رَ + اَوْ', spellingHijja: 'را زبر رَ ، ہمزہ واؤ زبر اَوْ = رَأَوْ', categoryLabelUrdu: 'واؤ لین کلمہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'انہوں نے دیکھا' },
  { id: 119, page: 14, leenType: 'waw', word: 'قَوْمُ', breakdown: 'قَوْ + مُ', spellingHijja: 'قاف واؤ زبر قَوْ ، میم پیش مُ = قَوْمُ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'قوم' },
  { id: 120, page: 14, leenType: 'waw', word: 'دَعَوْ', breakdown: 'دَ + عَوْ', spellingHijja: 'دال زبر دَ ، عین واؤ زبر عَوْ = دَعَوْ', categoryLabelUrdu: 'واؤ لین کلمہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'انہوں نے پکارا' },

  // Row 5
  { id: 121, page: 14, leenType: 'waw', word: 'طَوْعَ', breakdown: 'طَوْ + عَ', spellingHijja: 'طا واؤ زبر طَوْ ، عین زبر عَ = طَوْعَ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'خوشی سے اطاعت' },
  { id: 122, page: 14, leenType: 'waw', word: 'غَوْرَ', breakdown: 'غَوْ + رَ', spellingHijja: 'غین واؤ زبر غَوْ ، را زبر رَ = غَوْرَ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'گہرائی میں اتر جانا' },
  { id: 123, page: 14, leenType: 'waw', word: 'شَرَوْ', breakdown: 'شَ + رَوْ', spellingHijja: 'شین زبر شَ ، را واؤ زبر رَوْ = شَرَوْ', categoryLabelUrdu: 'واؤ لین کلمہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'انہوں نے بیچ ڈالا' },
  { id: 124, page: 14, leenType: 'waw', word: 'هَوْنَ', breakdown: 'هَوْ + نَ', spellingHijja: 'ہا واؤ زبر هَوْ ، نون زبر نَ = هَوْنَ', categoryLabelUrdu: 'واؤ لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'عاجزی و وقار' },
  { id: 125, page: 14, leenType: 'waw', word: 'عَصَوْ', breakdown: 'عَ + صَوْ', spellingHijja: 'عین زبر عَ ، صاد واؤ زبر صَوْ = عَصَوْ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'انہوں نے نافرمانی کی' },

  // Row 6
  { id: 126, page: 14, leenType: 'waw', word: 'طَوْلِ', breakdown: 'طَوْ + لِ', spellingHijja: 'طا واؤ زبر طَوْ ، لام زیر لِ = طَوْلِ', categoryLabelUrdu: 'واؤ لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'مالداری و وسعت' },
  { id: 127, page: 14, leenType: 'waw', word: 'كَوْثَرَ', breakdown: 'كَوْ + ثَ + رَ', spellingHijja: 'کاف واؤ زبر كَوْ ، ثا زبر ثَ ، را زبر رَ = كَوْثَرَ', categoryLabelUrdu: 'واؤ لین ۴ حرفی', letterCount: 4, isHeavyLetterIncluded: true, meaningOrContext: 'حوضِ کوثر / خیر کثیر' },
  { id: 128, page: 14, leenType: 'waw', word: 'تَوْبَةً', breakdown: 'تَوْ + بَ + تً', spellingHijja: 'تا واؤ زبر تَوْ ، با زبر بَ ، تا دو زبر تً = تَوْبَةً', categoryLabelUrdu: 'واؤ لین ۴ حرفی مع تنوین', letterCount: 4, isHeavyLetterIncluded: false, meaningOrContext: 'توبہ و استغفار' },
  { id: 129, page: 14, leenType: 'waw', word: 'يَرَوْنَ', breakdown: 'يَ + رَوْ + نَ', spellingHijja: 'یا زبر يَ ، را واؤ زبر رَوْ ، نون زبر نَ = يَرَوْنَ', categoryLabelUrdu: 'واؤ لین ۴ حرفی', letterCount: 4, isHeavyLetterIncluded: true, meaningOrContext: 'وہ دیکھتے ہیں' },
  { id: 130, page: 14, leenType: 'waw', word: 'مَوْعِدًا', breakdown: 'مَوْ + عِ + دً', spellingHijja: 'میم واؤ زبر مَوْ ، عین زیر عِ ، دال دو زبر دً = مَوْعِدًا', categoryLabelUrdu: 'واؤ لین ۵ حرفی مع تنوین', letterCount: 5, isHeavyLetterIncluded: false, meaningOrContext: 'وعدے کی جگہ / وقت' },

  // Row 7
  { id: 131, page: 14, leenType: 'waw', word: 'فَوْقَكَ', breakdown: 'فَوْ + قَ + كَ', spellingHijja: 'فا واؤ زبر فَوْ ، قاف زبر قَ ، کاف زبر كَ = فَوْقَكَ', categoryLabelUrdu: 'واؤ لین ۴ حرفی مرکب', letterCount: 4, isHeavyLetterIncluded: true, meaningOrContext: 'تیرے اوپر' },
  { id: 132, page: 14, leenType: 'waw', word: 'قَوْلُهُ', breakdown: 'قَوْ + لُ + هُ', spellingHijja: 'قاف واؤ زبر قَوْ ، لام پیش لُ ، ہا پیش هُ = قَوْلُهُ', categoryLabelUrdu: 'واؤ لین ۴ حرفی مرکب', letterCount: 4, isHeavyLetterIncluded: true, meaningOrContext: 'اس کا کلام' },
  { id: 133, page: 14, leenType: 'waw', word: 'فَسَوْفَ', breakdown: 'فَ + سَوْ + فَ', spellingHijja: 'فا زبر فَ ، سین واؤ زبر سَوْ ، فا زبر فَ = فَسَوْفَ', categoryLabelUrdu: 'واؤ لین ۴ حرفی مرکب', letterCount: 4, isHeavyLetterIncluded: false, meaningOrContext: 'پس عنقریب' },
  { id: 134, page: 14, leenType: 'waw', word: 'صَوْتُهُ', breakdown: 'صَوْ + تُ + هُ', spellingHijja: 'صاد واؤ زبر صَوْ ، تا پیش تُ ، ہا پیش هُ = صَوْتُهُ', categoryLabelUrdu: 'واؤ لین ۴ حرفی مرکب', letterCount: 4, isHeavyLetterIncluded: true, meaningOrContext: 'اس کی آواز' },
  { id: 135, page: 14, leenType: 'waw', word: 'نَوْمَكُمْ', breakdown: 'نَوْ + مَ + كُمْ', spellingHijja: 'نون واؤ زبر نَوْ ، میم زبر مَ ، کاف میم پیش كُمْ = نَوْمَكُمْ', categoryLabelUrdu: 'واؤ لین ۵ حرفی مرکب', letterCount: 5, isHeavyLetterIncluded: false, meaningOrContext: 'تمہاری نیند' },
];

// -------------------------------------------------------------
// PAGE 15: YAA LEEN - 29 MUFRADAT LETTERS (حروفِ یاء لین)
// -------------------------------------------------------------
export const YAA_LEEN_LETTERS: LeenLetterItem[] = [
  { id: 201, leenType: 'yaa', letter: 'اَيْ', baseLetterName: 'ہمزہ', hijjaSpelling: 'ہمزہ یاء زبر اَيْ', rawSound: 'اَيْ', isHeavy: false, ruleNote: 'الف ساکن سے پہلے زبر ہو تو ہمزہ یاء لین بنتا ہے' },
  { id: 202, leenType: 'yaa', letter: 'بَيْ', baseLetterName: 'باء', hijjaSpelling: 'باء یاء زبر بَيْ', rawSound: 'بَيْ', isHeavy: false, ruleNote: 'ہونٹوں کے تر حصے سے نرمی کے ساتھ' },
  { id: 203, leenType: 'yaa', letter: 'تَيْ', baseLetterName: 'تاء', hijjaSpelling: 'تاء یاء زبر تَيْ', rawSound: 'تَيْ', isHeavy: false, ruleNote: 'زبان کی نوک اور ثنایا علیا کی جڑ سے' },
  { id: 204, leenType: 'yaa', letter: 'ثَيْ', baseLetterName: 'ثاء', hijjaSpelling: 'ثاء یاء زبر ثَيْ', rawSound: 'ثَيْ', isHeavy: false, ruleNote: 'نرمی سے سیٹی کے بغیر' },
  { id: 205, leenType: 'yaa', letter: 'جَيْ', baseLetterName: 'جیم', hijjaSpelling: 'جیم یاء زبر جَيْ', rawSound: 'جَيْ', isHeavy: false, ruleNote: 'زبان کے وسط اور تالو سے' },
  { id: 206, leenType: 'yaa', letter: 'حَيْ', baseLetterName: 'حاء', hijjaSpelling: 'حاء یاء زبر حَيْ', rawSound: 'حَيْ', isHeavy: false, ruleNote: 'وسطِ حلق سے صاف آواز میں' },
  { id: 207, leenType: 'yaa', letter: 'خَيْ', baseLetterName: 'خاء', hijjaSpelling: 'خاء یاء زبر خَيْ', rawSound: 'خَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: پُر (موٹا) پڑھیں' },
  { id: 208, leenType: 'yaa', letter: 'دَيْ', baseLetterName: 'دال', hijjaSpelling: 'دال یاء زبر دَيْ', rawSound: 'دَيْ', isHeavy: false, ruleNote: 'باریک اور صاف آواز میں' },
  { id: 209, leenType: 'yaa', letter: 'ذَيْ', baseLetterName: 'ذال', hijjaSpelling: 'ذال یاء زبر ذَيْ', rawSound: 'ذَيْ', isHeavy: false, ruleNote: 'نرمی سے بغیر سیٹی کے' },
  { id: 210, leenType: 'yaa', letter: 'رَيْ', baseLetterName: 'راء', hijjaSpelling: 'راء یاء زبر رَيْ', rawSound: 'رَيْ', isHeavy: true, ruleNote: 'راء پر زبر کی وجہ سے پُر (موٹی) پڑھی جائے گی' },
  { id: 211, leenType: 'yaa', letter: 'زَيْ', baseLetterName: 'زا', hijjaSpelling: 'زا یاء زبر زَيْ', rawSound: 'زَيْ', isHeavy: false, ruleNote: 'سیٹی کی تیز آواز کے ساتھ' },
  { id: 212, leenType: 'yaa', letter: 'سَيْ', baseLetterName: 'سین', hijjaSpelling: 'سین یاء زبر سَيْ', rawSound: 'سَيْ', isHeavy: false, ruleNote: 'باریک اور سیٹی کے ساتھ' },
  { id: 213, leenType: 'yaa', letter: 'شَيْ', baseLetterName: 'شین', hijjaSpelling: 'شین یاء زبر شَيْ', rawSound: 'شَيْ', isHeavy: false, ruleNote: 'منہ میں آواز پھیلا کر (تفشی)' },
  { id: 214, leenType: 'yaa', letter: 'صَيْ', baseLetterName: 'صاد', hijjaSpelling: 'صاد یاء زبر صَيْ', rawSound: 'صَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: پُر اور سیٹی کے ساتھ' },
  { id: 215, leenType: 'yaa', letter: 'ضَيْ', baseLetterName: 'ضاد', hijjaSpelling: 'ضاد یاء زبر ضَيْ', rawSound: 'ضَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: زبان کی کروٹ سے پُر' },
  { id: 216, leenType: 'yaa', letter: 'طَيْ', baseLetterName: 'طاء', hijjaSpelling: 'طاء یاء زبر طَيْ', rawSound: 'طَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: سب سے قوی اور پُر' },
  { id: 217, leenType: 'yaa', letter: 'ظَيْ', baseLetterName: 'ظاء', hijjaSpelling: 'ظاء یاء زبر ظَيْ', rawSound: 'ظَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: نرمی اور پُر آواز کے ساتھ' },
  { id: 218, leenType: 'yaa', letter: 'عَيْ', baseLetterName: 'عین', hijjaSpelling: 'عین یاء زبر عَيْ', rawSound: 'عَيْ', isHeavy: false, ruleNote: 'درمیان حلق سے' },
  { id: 219, leenType: 'yaa', letter: 'غَيْ', baseLetterName: 'غین', hijjaSpelling: 'غین یاء زبر غَيْ', rawSound: 'غَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: ابتدائے حلق سے پُر' },
  { id: 220, leenType: 'yaa', letter: 'فَيْ', baseLetterName: 'فاء', hijjaSpelling: 'فاء یاء زبر فَيْ', rawSound: 'فَيْ', isHeavy: false, ruleNote: 'اوپر کے دانتوں اور نچلے ہونٹ سے' },
  { id: 221, leenType: 'yaa', letter: 'قَيْ', baseLetterName: 'قاف', hijjaSpelling: 'قاف یاء زبر قَيْ', rawSound: 'قَيْ', isHeavy: true, ruleNote: 'حرفِ مستعلیہ: زبان کی جڑ سے پُر' },
  { id: 222, leenType: 'yaa', letter: 'كَيْ', baseLetterName: 'کاف', hijjaSpelling: 'کاف یاء زبر كَيْ', rawSound: 'كَيْ', isHeavy: false, ruleNote: 'باریک آواز میں' },
  { id: 223, leenType: 'yaa', letter: 'لَيْ', baseLetterName: 'لام', hijjaSpelling: 'لام یاء زبر لَيْ', rawSound: 'لَيْ', isHeavy: false, ruleNote: 'زبان کی کروٹ کے کنارے سے تالو تک' },
  { id: 224, leenType: 'yaa', letter: 'مَيْ', baseLetterName: 'میم', hijjaSpelling: 'میم یاء زبر مَيْ', rawSound: 'مَيْ', isHeavy: false, ruleNote: 'ہونٹوں کے خشکی والے حصے سے' },
  { id: 225, leenType: 'yaa', letter: 'نَيْ', baseLetterName: 'نون', hijjaSpelling: 'نون یاء زبر نَيْ', rawSound: 'نَيْ', isHeavy: false, ruleNote: 'زبان کی نوک اور تالو سے' },
  { id: 226, leenType: 'yaa', letter: 'وَيْ', baseLetterName: 'واؤ', hijjaSpelling: 'واؤ یاء زبر وَيْ', rawSound: 'وَيْ', isHeavy: false, ruleNote: 'ہونٹوں کو گول کر کے نرمی سے' },
  { id: 227, leenType: 'yaa', letter: 'هَيْ', baseLetterName: 'ہاء', hijjaSpelling: 'ہاء یاء زبر هَيْ', rawSound: 'هَيْ', isHeavy: false, ruleNote: 'انتہائے حلق (سینے کی طرف) سے' },
  { id: 228, leenType: 'yaa', letter: 'ءَيْ', baseLetterName: 'ہمزہ', hijjaSpelling: 'ہمزہ یاء زبر ءَيْ', rawSound: 'ءَيْ', isHeavy: false, ruleNote: 'صاف اور بغیر جھٹکے کے' },
  { id: 229, leenType: 'yaa', letter: 'يَيْ', baseLetterName: 'یاء', hijjaSpelling: 'یاء یاء زبر يَيْ', rawSound: 'يَيْ', isHeavy: false, ruleNote: 'زبان کے درمیان سے' },
];

// -------------------------------------------------------------
// PAGE 15: YAA LEEN WORDS (35 قرآنی و قراءتی کلمات)
// -------------------------------------------------------------
export const PAGE_15_YAA_LEEN_WORDS: LeenWordItem[] = [
  // Row 1
  { id: 231, page: 15, leenType: 'yaa', word: 'اَيْنَ', breakdown: 'اَيْ + نَ', spellingHijja: 'ہمزہ یاء زبر اَيْ ، نون زبر نَ = اَيْنَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'کہاں؟' },
  { id: 232, page: 15, leenType: 'yaa', word: 'شَيْءَ', breakdown: 'شَيْ + ءَ', spellingHijja: 'شین یاء زبر شَيْ ، ہمزہ زبر ءَ = شَيْءَ', categoryLabelUrdu: 'یاء لین مع ہمزہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'کوئی چیز' },
  { id: 233, page: 15, leenType: 'yaa', word: 'بَيْتٍ', breakdown: 'بَيْ + تٍ', spellingHijja: 'باء یاء زبر بَيْ ، تا دو زیر تٍ = بَيْتٍ', categoryLabelUrdu: 'یاء لین مع تنوین', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'گھر' },
  { id: 234, page: 15, leenType: 'yaa', word: 'زَيْغُ', breakdown: 'زَيْ + غُ', spellingHijja: 'زا یاء زبر زَيْ ، غین پیش غُ = زَيْغُ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'کجی / ٹیڑھا پن' },
  { id: 235, page: 15, leenType: 'yaa', word: 'لَيْلِ', breakdown: 'لَيْ + لِ', spellingHijja: 'لام یاء زبر لَيْ ، لام زیر لِ = لَيْلِ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'رات' },

  // Row 2
  { id: 236, page: 15, leenType: 'yaa', word: 'رَيْبَ', breakdown: 'رَيْ + بَ', spellingHijja: 'راء یاء زبر رَيْ ، باء زبر بَ = رَيْبَ', categoryLabelUrdu: 'یاء لین مع راء پُر', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'شک / شبہ' },
  { id: 237, page: 15, leenType: 'yaa', word: 'وَيْلُ', breakdown: 'وَيْ + لُ', spellingHijja: 'واؤ یاء زبر وَيْ ، لام پیش لُ = وَيْلُ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'ہلاکت / جہنم کی وادی' },
  { id: 238, page: 15, leenType: 'yaa', word: 'كَيْفَ', breakdown: 'كَيْ + فَ', spellingHijja: 'کاف یاء زبر كَيْ ، فاء زبر فَ = كَيْفَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'کیسے؟' },
  { id: 239, page: 15, leenType: 'yaa', word: 'غَيْرُ', breakdown: 'غَيْ + رُ', spellingHijja: 'غین یاء زبر غَيْ ، راء پیش رُ = غَيْرُ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'علاوہ / سوائے' },
  { id: 240, page: 15, leenType: 'yaa', word: 'خَيْرٌ', breakdown: 'خَيْ + رٌ', spellingHijja: 'خاء یاء زبر خَيْ ، راء دو پیش رٌ = خَيْرٌ', categoryLabelUrdu: 'یاء لین مع مستعلیہ و تنوین', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'بہتری / بھلائی' },

  // Row 3
  { id: 241, page: 15, leenType: 'yaa', word: 'غَيْبَ', breakdown: 'غَيْ + بَ', spellingHijja: 'غین یاء زبر غَيْ ، باء زبر بَ = غَيْبَ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'پوشیدہ بات / غیب' },
  { id: 242, page: 15, leenType: 'yaa', word: 'كَيْدِ', breakdown: 'كَيْ + دِ', spellingHijja: 'کاف یاء زبر كَيْ ، دال زیر دِ = كَيْدِ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'چال / فریب' },
  { id: 243, page: 15, leenType: 'yaa', word: 'عَيْنٌ', breakdown: 'عَيْ + نٌ', spellingHijja: 'عین یاء زبر عَيْ ، نون دو پیش نٌ = عَيْنٌ', categoryLabelUrdu: 'یاء لین مع تنوین', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'آنکھ / چشمہ' },
  { id: 244, page: 15, leenType: 'yaa', word: 'صَيْفِ', breakdown: 'صَيْ + فِ', spellingHijja: 'صاد یاء زبر صَيْ ، فاء زیر فِ = صَيْفِ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'گرمی کا موسم' },
  { id: 245, page: 15, leenType: 'yaa', word: 'بَيْنَ', breakdown: 'بَيْ + نَ', spellingHijja: 'باء یاء زبر بَيْ ، نون زبر نَ = بَيْنَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'درمیان' },

  // Row 4
  { id: 246, page: 15, leenType: 'yaa', word: 'هَيْتَ', breakdown: 'هَيْ + تَ', spellingHijja: 'ہاء یاء زبر هَيْ ، تاء زبر تَ = هَيْتَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'جلدی آؤ' },
  { id: 247, page: 15, leenType: 'yaa', word: 'دَيْنَ', breakdown: 'دَيْ + نَ', spellingHijja: 'دال یاء زبر دَيْ ، نون زبر نَ = دَيْنَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'قرض' },
  { id: 248, page: 15, leenType: 'yaa', word: 'خَيْلِ', breakdown: 'خَيْ + لِ', spellingHijja: 'خاء یاء زبر خَيْ ، لام زیر لِ = خَيْلِ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'گھوڑے' },
  { id: 249, page: 15, leenType: 'yaa', word: 'غَيْثِ', breakdown: 'غَيْ + ثِ', spellingHijja: 'غین یاء زبر غَيْ ، ثاء زیر ثِ = غَيْثِ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'بارانِ رحمت / بارش' },
  { id: 250, page: 15, leenType: 'yaa', word: 'طَيْرُ', breakdown: 'طَيْ + رُ', spellingHijja: 'طاء یاء زبر طَيْ ، راء پیش رُ = طَيْرُ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'پرندے' },

  // Row 5
  { id: 251, page: 15, leenType: 'yaa', word: 'صَيْدُ', breakdown: 'صَيْ + دُ', spellingHijja: 'صاد یاء زبر صَيْ ، دال پیش دُ = صَيْدُ', categoryLabelUrdu: 'یاء لین مع مستعلیہ', letterCount: 3, isHeavyLetterIncluded: true, meaningOrContext: 'شکار' },
  { id: 252, page: 15, leenType: 'yaa', word: 'سَيْلَ', breakdown: 'سَيْ + لَ', spellingHijja: 'سین یاء زبر سَيْ ، لام زبر لَ = سَيْلَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'سیلاب' },
  { id: 253, page: 15, leenType: 'yaa', word: 'زَيْتَ', breakdown: 'زَيْ + تَ', spellingHijja: 'زا یاء زبر زَيْ ، تاء زبر تَ = زَيْتَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'زیتون کا تیل' },
  { id: 254, page: 15, leenType: 'yaa', word: 'حَيْثُ', breakdown: 'حَيْ + ثُ', spellingHijja: 'حاء یاء زبر حَيْ ، ثاء پیش ثُ = حَيْثُ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'جہاں' },
  { id: 255, page: 15, leenType: 'yaa', word: 'لِكَيْ', breakdown: 'لِ + كَيْ', spellingHijja: 'لام زیر لِ ، کاف یاء زبر كَيْ = لِكَيْ', categoryLabelUrdu: 'یاء لین کلمہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'تاکہ' },

  // Row 6
  { id: 256, page: 15, leenType: 'yaa', word: 'لَدَيْ', breakdown: 'لَ + دَيْ', spellingHijja: 'لام زبر لَ ، دال یاء زبر دَيْ = لَدَيْ', categoryLabelUrdu: 'یاء لین کلمہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'پاس / نزدیک' },
  { id: 257, page: 15, leenType: 'yaa', word: 'بَيْعٌ', breakdown: 'بَيْ + عٌ', spellingHijja: 'باء یاء زبر بَيْ ، عین دو پیش عٌ = بَيْعٌ', categoryLabelUrdu: 'یاء لین مع تنوین', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'خرید و فروخت' },
  { id: 258, page: 15, leenType: 'yaa', word: 'لَيْسَ', breakdown: 'لَيْ + سَ', spellingHijja: 'لام یاء زبر لَيْ ، سین زبر سَ = لَيْسَ', categoryLabelUrdu: 'یاء لین ۳ حرفی', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'نہیں ہے' },
  { id: 259, page: 15, leenType: 'yaa', word: 'ذَوَيْ', breakdown: 'ذَ + وَيْ', spellingHijja: 'ذال زبر ذَ ، واؤ یاء زبر وَيْ = ذَوَيْ', categoryLabelUrdu: 'یاء لین کلمہ', letterCount: 3, isHeavyLetterIncluded: false, meaningOrContext: 'دو صاحب / دو والے' },
  { id: 260, page: 15, leenType: 'yaa', word: 'لَيْلَةِ', breakdown: 'لَيْ + لَ + تِ', spellingHijja: 'لام یاء زبر لَيْ ، لام زبر لَ ، تاء زیر تِ = لَيْلَةِ', categoryLabelUrdu: 'یاء لین ۴ حرفی', letterCount: 4, isHeavyLetterIncluded: false, meaningOrContext: 'ایک رات (شب قدر)' },

  // Row 7 (includes combined Waw Leen + Yaa Leen words!)
  { id: 261, page: 15, leenType: 'yaa', word: 'بَيْتُكَ', breakdown: 'بَيْ + تُ + كَ', spellingHijja: 'باء یاء زبر بَيْ ، تاء پیش تُ ، کاف زبر كَ = بَيْتُكَ', categoryLabelUrdu: 'یاء لین ۴ حرفی مرکب', letterCount: 4, isHeavyLetterIncluded: false, meaningOrContext: 'تیرا گھر' },
  { id: 262, page: 15, leenType: 'yaa', word: 'اِلَيْهِمْ', breakdown: 'اِ + لَيْ + هِمْ', spellingHijja: 'ہمزہ زیر اِ ، لام یاء زبر لَيْ ، ہاء میم زیر هِمْ = اِلَيْهِمْ', categoryLabelUrdu: 'یاء لین ۵ حرفی مرکب', letterCount: 5, isHeavyLetterIncluded: false, meaningOrContext: 'ان کی طرف' },
  { id: 263, page: 15, leenType: 'yaa', word: 'بَيْنَكُمْ', breakdown: 'بَيْ + نَ + كُمْ', spellingHijja: 'باء یاء زبر بَيْ ، نون زبر نَ ، کاف میم پیش كُمْ = بَيْنَكُمْ', categoryLabelUrdu: 'یاء لین ۵ حرفی مرکب', letterCount: 5, isHeavyLetterIncluded: false, meaningOrContext: 'تمہارے درمیان' },
  { id: 264, page: 15, leenType: 'both', word: 'زَوْجَيْنِ', breakdown: 'زَوْ + جَيْ + نِ', spellingHijja: 'زا واؤ زبر زَوْ ، جیم یاء زبر جَيْ ، نون زیر نِ = زَوْجَيْنِ', categoryLabelUrdu: 'واؤ لین و یاء لین مجموعہ', letterCount: 5, isHeavyLetterIncluded: false, hasBothLeen: true, meaningOrContext: 'دو جوڑے (واؤ لین اور یاء لین دونوں شامل ہیں)' },
  { id: 265, page: 15, leenType: 'both', word: 'حَوْلَيْنِ', breakdown: 'حَوْ + لَيْ + نِ', spellingHijja: 'حاء واؤ زبر حَوْ ، لام یاء زبر لَيْ ، نون زیر نِ = حَوْلَيْنِ', categoryLabelUrdu: 'واؤ لین و یاء لین مجموعہ', letterCount: 5, isHeavyLetterIncluded: false, hasBothLeen: true, meaningOrContext: 'دو سال (واؤ لین اور یاء لین دونوں شامل ہیں)' },
];

// ALL COMBINED LESSON 5 WORDS
export const ALL_HUROOF_LEEN_WORDS: LeenWordItem[] = [
  ...PAGE_14_WAW_LEEN_WORDS,
  ...PAGE_15_YAA_LEEN_WORDS
];
