export interface MurakkabExerciseItem {
  id: string;
  compound: string;
  name: string; // e.g. "قَافْ لَامْ" or "بَاءْ سِينْ مِيمْ"
  letters: string[]; // e.g. ['ق', 'ل']
  breakdown: string; // e.g. "ق + ل"
  page: 1 | 2;
  section: 'page1_grid1' | 'page1_grid2' | 'page1_grid3' | 'page2_grid1' | 'page2_words' | 'page2_sentences';
  category: '2-letter' | '3-letter' | '4-letter' | 'sentence';
  urduMeaning?: string;
  audioPronunciation?: string;
}

// ========================================================
// PAGE 1: مشق (TWO-LETTER COMPOUNDS - 3 TABLES = 96 ITEMS)
// ========================================================

export const PAGE_1_EXERCISE: MurakkabExerciseItem[] = [
  // Grid 1 (Row 1 to 4)
  { id: 'p1-1', compound: 'قل', name: 'قَافْ لَامْ', letters: ['ق', 'ل'], breakdown: 'ق + ل', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-2', compound: 'لم', name: 'لَامْ مِيمْ', letters: ['ل', 'م'], breakdown: 'ل + م', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-3', compound: 'ذك', name: 'ذَالْ كَافْ', letters: ['ذ', 'ك'], breakdown: 'ذ + ك', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-4', compound: 'سب', name: 'سِينْ بَاءْ', letters: ['س', 'ب'], breakdown: 'س + ب', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-5', compound: 'بذ', name: 'بَاءْ ذَالْ', letters: ['ب', 'ذ'], breakdown: 'ب + ذ', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-6', compound: 'نص', name: 'نُوْنْ صَادْ', letters: ['ن', 'ص'], breakdown: 'ن + ص', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-7', compound: 'مض', name: 'مِيمْ ضَادْ', letters: ['م', 'ض'], breakdown: 'م + ض', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-8', compound: 'لد', name: 'لَامْ دَالْ', letters: ['ل', 'د'], breakdown: 'ل + د', page: 1, section: 'page1_grid1', category: '2-letter' },

  { id: 'p1-9', compound: 'يس', name: 'يَاءْ سِينْ', letters: ['ي', 'س'], breakdown: 'ي + س', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-10', compound: 'تن', name: 'تَاءْ نُوْنْ', letters: ['ت', 'ن'], breakdown: 'ت + ن', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-11', compound: 'حم', name: 'حَاءْ مِيمْ', letters: ['ح', 'م'], breakdown: 'ح + م', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-12', compound: 'سق', name: 'سِينْ قَافْ', letters: ['س', 'ق'], breakdown: 'س + ق', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-13', compound: 'كن', name: 'كَافْ نُوْنْ', letters: ['ك', 'ن'], breakdown: 'ك + ن', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-14', compound: 'يو', name: 'يَاءْ وَاوْ', letters: ['ي', 'و'], breakdown: 'ي + و', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-15', compound: 'به', name: 'بَاءْ هَاءْ', letters: ['ب', 'ه'], breakdown: 'ب + ه', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-16', compound: 'ثن', name: 'ثَاءْ نُوْنْ', letters: ['ث', 'ن'], breakdown: 'ث + ن', page: 1, section: 'page1_grid1', category: '2-letter' },

  { id: 'p1-17', compound: 'خص', name: 'خَاءْ صَادْ', letters: ['خ', 'ص'], breakdown: 'خ + ص', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-18', compound: 'ظب', name: 'ظَاءْ بَاءْ', letters: ['ظ', 'ب'], breakdown: 'ظ + ب', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-19', compound: 'تم', name: 'تَاءْ مِيمْ', letters: ['ت', 'م'], breakdown: 'ت + م', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-20', compound: 'لك', name: 'لَامْ كَافْ', letters: ['ل', 'ك'], breakdown: 'ل + ك', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-21', compound: 'تر', name: 'تَاءْ رَاءْ', letters: ['ت', 'ر'], breakdown: 'ت + ر', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-22', compound: 'كل', name: 'كَافْ لَامْ', letters: ['ك', 'ل'], breakdown: 'ك + ل', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-23', compound: 'صن', name: 'صَادْ نُوْنْ', letters: ['ص', 'ن'], breakdown: 'ص + ن', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-24', compound: 'نظ', name: 'نُوْنْ ظَاءْ', letters: ['ن', 'ظ'], breakdown: 'ن + ظ', page: 1, section: 'page1_grid1', category: '2-letter' },

  { id: 'p1-25', compound: 'طى', name: 'طَاءْ يَاءْ', letters: ['ط', 'ي'], breakdown: 'ط + ي', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-26', compound: 'بع', name: 'بَاءْ عَيْنْ', letters: ['ب', 'ع'], breakdown: 'ب + ع', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-27', compound: 'مغ', name: 'مِيمْ غَيْنْ', letters: ['م', 'غ'], breakdown: 'م + غ', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-28', compound: 'لح', name: 'لَامْ حَاءْ', letters: ['ل', 'ح'], breakdown: 'ل + ح', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-29', compound: 'قض', name: 'قَافْ ضَادْ', letters: ['ق', 'ض'], breakdown: 'ق + ض', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-30', compound: 'عد', name: 'عَيْنْ دَالْ', letters: ['ع', 'د'], breakdown: 'ع + د', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-31', compound: 'سن', name: 'سِينْ نُوْنْ', letters: ['س', 'ن'], breakdown: 'س + ن', page: 1, section: 'page1_grid1', category: '2-letter' },
  { id: 'p1-32', compound: 'نذ', name: 'نُوْنْ ذَالْ', letters: ['ن', 'ذ'], breakdown: 'ن + ذ', page: 1, section: 'page1_grid1', category: '2-letter' },

  // Grid 2 (Row 1 to 4)
  { id: 'p1-33', compound: 'مث', name: 'مِيمْ ثَاءْ', letters: ['م', 'ث'], breakdown: 'م + ث', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-34', compound: 'سل', name: 'سِينْ لَامْ', letters: ['س', 'ل'], breakdown: 'س + ل', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-35', compound: 'تز', name: 'تَاءْ زَايْ', letters: ['ت', 'ز'], breakdown: 'ت + ز', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-36', compound: 'بد', name: 'بَاءْ دَالْ', letters: ['ب', 'د'], breakdown: 'ب + د', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-37', compound: 'سو', name: 'سِينْ وَاوْ', letters: ['س', 'و'], breakdown: 'س + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-38', compound: 'شر', name: 'شِينْ رَاءْ', letters: ['ش', 'ر'], breakdown: 'ش + ر', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-39', compound: 'لق', name: 'لَامْ قَافْ', letters: ['ل', 'ق'], breakdown: 'ل + ق', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-40', compound: 'کس', name: 'كَافْ سِينْ', letters: ['ك', 'س'], breakdown: 'ك + س', page: 1, section: 'page1_grid2', category: '2-letter' },

  { id: 'p1-41', compound: 'سع', name: 'سِينْ عَيْنْ', letters: ['س', 'ع'], breakdown: 'س + ع', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-42', compound: 'عط', name: 'عَيْنْ طَاءْ', letters: ['ع', 'ط'], breakdown: 'ع + ط', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-43', compound: 'هب', name: 'هَاءْ بَاءْ', letters: ['ه', 'ب'], breakdown: 'ه + ب', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-44', compound: 'مة', name: 'مِيمْ تَاءْ', letters: ['م', 'ة'], breakdown: 'م + ة', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-45', compound: 'صف', name: 'صَادْ فَاءْ', letters: ['ص', 'ف'], breakdown: 'ص + ف', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-46', compound: 'جع', name: 'جِيمْ عَيْنْ', letters: ['ج', 'ع'], breakdown: 'ج + ع', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-47', compound: 'له', name: 'لَامْ هَاءْ', letters: ['ل', 'ه'], breakdown: 'ل + ه', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-48', compound: 'مش', name: 'مِيمْ شِينْ', letters: ['م', 'ش'], breakdown: 'م + ش', page: 1, section: 'page1_grid2', category: '2-letter' },

  { id: 'p1-49', compound: 'حت', name: 'حَاءْ تَاءْ', letters: ['ح', 'ت'], breakdown: 'ح + ت', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-50', compound: 'قر', name: 'قَافْ رَاءْ', letters: ['ق', 'ر'], breakdown: 'ق + ر', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-51', compound: 'شغ', name: 'شِينْ غَيْنْ', letters: ['ش', 'غ'], breakdown: 'ش + غ', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-52', compound: 'لو', name: 'لَامْ وَاوْ', letters: ['ل', 'و'], breakdown: 'ل + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-53', compound: 'مه', name: 'مِيمْ هَاءْ', letters: ['م', 'ه'], breakdown: 'م + ه', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-54', compound: 'هو', name: 'هَاءْ وَاوْ', letters: ['ه', 'و'], breakdown: 'ه + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-55', compound: 'طو', name: 'طَاءْ وَاوْ', letters: ['ط', 'و'], breakdown: 'ط + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-56', compound: 'لة', name: 'لَامْ تَاءْ', letters: ['ل', 'ة'], breakdown: 'ل + ة', page: 1, section: 'page1_grid2', category: '2-letter' },

  { id: 'p1-57', compound: 'يو', name: 'يَاءْ وَاوْ', letters: ['ي', 'و'], breakdown: 'ي + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-58', compound: 'خغ', name: 'خَاءْ غَيْنْ', letters: ['خ', 'غ'], breakdown: 'خ + غ', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-59', compound: 'عن', name: 'عَيْنْ نُوْنْ', letters: ['ع', 'ن'], breakdown: 'ع + ن', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-60', compound: 'فز', name: 'فَاءْ زَايْ', letters: ['ف', 'ز'], breakdown: 'ف + ز', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-61', compound: 'غو', name: 'غَيْنْ وَاوْ', letters: ['غ', 'و'], breakdown: 'غ + و', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-62', compound: 'يع', name: 'يَاءْ عَيْنْ', letters: ['ي', 'ع'], breakdown: 'ي + ع', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-63', compound: 'جم', name: 'جِيمْ مِيمْ', letters: ['ج', 'م'], breakdown: 'ج + م', page: 1, section: 'page1_grid2', category: '2-letter' },
  { id: 'p1-64', compound: 'کو', name: 'كَافْ وَاوْ', letters: ['ك', 'و'], breakdown: 'ك + و', page: 1, section: 'page1_grid2', category: '2-letter' },

  // Grid 3 (Row 1 to 4)
  { id: 'p1-65', compound: 'لا', name: 'لَامْ أَلِفْ', letters: ['ل', 'ا'], breakdown: 'ل + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-66', compound: 'بى', name: 'بَاءْ يَاءْ', letters: ['ب', 'ي'], breakdown: 'ب + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-67', compound: 'يج', name: 'يَاءْ جِيمْ', letters: ['ي', 'ج'], breakdown: 'ي + ج', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-68', compound: 'ما', name: 'مِيمْ أَلِفْ', letters: ['م', 'ا'], breakdown: 'م + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-69', compound: 'صى', name: 'صَادْ يَاءْ', letters: ['ص', 'ي'], breakdown: 'ص + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-70', compound: 'كا', name: 'كَافْ أَلِفْ', letters: ['ك', 'ا'], breakdown: 'ك + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-71', compound: 'نج', name: 'نُوْنْ جِيمْ', letters: ['ن', 'ج'], breakdown: 'ن + ج', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-72', compound: 'يا', name: 'يَاءْ أَلِفْ', letters: ['ي', 'ا'], breakdown: 'ي + ا', page: 1, section: 'page1_grid3', category: '2-letter' },

  { id: 'p1-73', compound: 'يخ', name: 'يَاءْ خَاءْ', letters: ['ي', 'خ'], breakdown: 'ي + خ', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-74', compound: 'با', name: 'بَاءْ أَلِفْ', letters: ['ب', 'ا'], breakdown: 'ب + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-75', compound: 'لج', name: 'لَامْ جِيمْ', letters: ['ل', 'ج'], breakdown: 'ل + ج', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-76', compound: 'تى', name: 'تَاءْ يَاءْ', letters: ['ت', 'ي'], breakdown: 'ت + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-77', compound: 'طخ', name: 'طَاءْ خَاءْ', letters: ['ط', 'خ'], breakdown: 'ط + خ', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-78', compound: 'تا', name: 'تَاءْ أَلِفْ', letters: ['ت', 'ا'], breakdown: 'ت + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-79', compound: 'قى', name: 'قَافْ يَاءْ', letters: ['ق', 'ي'], breakdown: 'ق + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-80', compound: 'ئا', name: 'هَمْزَة أَلِفْ', letters: ['ء', 'ا'], breakdown: 'ء + ا', page: 1, section: 'page1_grid3', category: '2-letter' },

  { id: 'p1-81', compound: 'جا', name: 'جِيمْ أَلِفْ', letters: ['ج', 'ا'], breakdown: 'ج + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-82', compound: 'نخ', name: 'نُوْنْ خَاءْ', letters: ['ن', 'خ'], breakdown: 'ن + خ', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-83', compound: 'لى', name: 'لَامْ يَاءْ', letters: ['ل', 'ي'], breakdown: 'ل + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-84', compound: 'فا', name: 'فَاءْ أَلِفْ', letters: ['ف', 'ا'], breakdown: 'ف + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-85', compound: 'لخ', name: 'لَامْ خَاءْ', letters: ['ل', 'خ'], breakdown: 'ل + خ', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-86', compound: 'ها', name: 'هَاءْ أَلِفْ', letters: ['ه', 'ا'], breakdown: 'ه + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-87', compound: 'شی', name: 'شِينْ يَاءْ', letters: ['ش', 'ي'], breakdown: 'ش + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-88', compound: 'لا', name: 'لَامْ أَلِفْ', letters: ['ل', 'ا'], breakdown: 'ل + ا', page: 1, section: 'page1_grid3', category: '2-letter' },

  { id: 'p1-89', compound: 'ثى', name: 'ثَاءْ يَاءْ', letters: ['ث', 'ي'], breakdown: 'ث + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-90', compound: 'بج', name: 'بَاءْ جِيمْ', letters: ['ب', 'ج'], breakdown: 'ب + ج', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-91', compound: 'كى', name: 'كَافْ يَاءْ', letters: ['ك', 'ي'], breakdown: 'ك + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-92', compound: 'يي', name: 'يَاءْ يَاءْ', letters: ['ي', 'ي'], breakdown: 'ي + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-93', compound: 'خا', name: 'خَاءْ أَلِفْ', letters: ['خ', 'ا'], breakdown: 'خ + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-94', compound: 'نى', name: 'نُوْنْ يَاءْ', letters: ['ن', 'ي'], breakdown: 'ن + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-95', compound: 'عا', name: 'عَيْنْ أَلِفْ', letters: ['ع', 'ا'], breakdown: 'ع + ا', page: 1, section: 'page1_grid3', category: '2-letter' },
  { id: 'p1-96', compound: 'ئى', name: 'هَمْزَة يَاءْ', letters: ['ء', 'ي'], breakdown: 'ء + ي', page: 1, section: 'page1_grid3', category: '2-letter' },
];

// ========================================================
// PAGE 2: مشق (صفحہ نمبر ۶ - مرکبات و قرآنی کلمات)
// ========================================================

export const PAGE_2_EXERCISE: MurakkabExerciseItem[] = [
  // Grid 1: 32 Two-letter words (Rows 1 to 4)
  { id: 'p2-1', compound: 'حص', name: 'حَاءْ صَادْ', letters: ['ح', 'ص'], breakdown: 'ح + ص', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-2', compound: 'قد', name: 'قَافْ دَالْ', letters: ['ق', 'د'], breakdown: 'ق + د', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-3', compound: 'نف', name: 'نُوْنْ فَاءْ', letters: ['ن', 'ف'], breakdown: 'ن + ف', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-4', compound: 'غي', name: 'غَيْنْ يَاءْ', letters: ['غ', 'ي'], breakdown: 'غ + ي', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-5', compound: 'بق', name: 'بَاءْ قَافْ', letters: ['ب', 'ق'], breakdown: 'ب + ق', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-6', compound: 'عذ', name: 'عَيْنْ ذَالْ', letters: ['ع', 'ذ'], breakdown: 'ع + ذ', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-7', compound: 'ثم', name: 'ثَاءْ مِيمْ', letters: ['ث', 'م'], breakdown: 'ث + م', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-8', compound: 'سع', name: 'سِينْ عَيْنْ', letters: ['س', 'ع'], breakdown: 'س + ع', page: 2, section: 'page2_grid1', category: '2-letter' },

  { id: 'p2-9', compound: 'نص', name: 'نُوْنْ صَادْ', letters: ['ن', 'ص'], breakdown: 'ن + ص', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-10', compound: 'نع', name: 'نُوْنْ عَيْنْ', letters: ['ن', 'ع'], breakdown: 'ن + ع', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-11', compound: 'لد', name: 'لَامْ دَالْ', letters: ['ل', 'د'], breakdown: 'ل + د', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-12', compound: 'بي', name: 'بَاءْ يَاءْ', letters: ['ب', 'ي'], breakdown: 'ب + ي', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-13', compound: 'لي', name: 'لَامْ يَاءْ', letters: ['ل', 'ي'], breakdown: 'ل + ي', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-14', compound: 'نج', name: 'نُوْنْ جِيمْ', letters: ['ن', 'ج'], breakdown: 'ن + ج', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-15', compound: 'ثل', name: 'ثَاءْ لَامْ', letters: ['ث', 'ل'], breakdown: 'ث + ل', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-16', compound: 'نز', name: 'نُوْنْ زَايْ', letters: ['ن', 'ز'], breakdown: 'ن + ز', page: 2, section: 'page2_grid1', category: '2-letter' },

  { id: 'p2-17', compound: 'تز', name: 'تَاءْ زَايْ', letters: ['ت', 'ز'], breakdown: 'ت + ز', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-18', compound: 'لج', name: 'لَامْ جِيمْ', letters: ['ل', 'ج'], breakdown: 'ل + ج', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-19', compound: 'يغ', name: 'يَاءْ غَيْنْ', letters: ['ي', 'غ'], breakdown: 'ي + غ', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-20', compound: 'خف', name: 'خَاءْ فَاءْ', letters: ['خ', 'ف'], breakdown: 'خ + ف', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-21', compound: 'شج', name: 'شِينْ جِيمْ', letters: ['ش', 'ج'], breakdown: 'ش + ج', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-22', compound: 'له', name: 'لَامْ هَاءْ', letters: ['ل', 'ه'], breakdown: 'ل + ه', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-23', compound: 'نخ', name: 'نُوْنْ خَاءْ', letters: ['ن', 'خ'], breakdown: 'ن + خ', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-24', compound: 'عص', name: 'عَيْنْ صَادْ', letters: ['ع', 'ص'], breakdown: 'ع + ص', page: 2, section: 'page2_grid1', category: '2-letter' },

  { id: 'p2-25', compound: 'لن', name: 'لَامْ نُوْنْ', letters: ['ل', 'ن'], breakdown: 'ل + ن', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-26', compound: 'خس', name: 'خَاءْ سِينْ', letters: ['خ', 'س'], breakdown: 'خ + س', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-27', compound: 'عش', name: 'عَيْنْ شِينْ', letters: ['ع', 'ش'], breakdown: 'ع + ش', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-28', compound: 'يم', name: 'يَاءْ مِيمْ', letters: ['ي', 'م'], breakdown: 'ي + م', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-29', compound: 'لي', name: 'لَامْ يَاءْ', letters: ['ل', 'ي'], breakdown: 'ل + ي', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-30', compound: 'بع', name: 'بَاءْ عَيْنْ', letters: ['ب', 'ع'], breakdown: 'ب + ع', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-31', compound: 'هي', name: 'هَاءْ يَاءْ', letters: ['ه', 'ي'], breakdown: 'ه + ي', page: 2, section: 'page2_grid1', category: '2-letter' },
  { id: 'p2-32', compound: 'فج', name: 'فَاءْ جِيمْ', letters: ['ف', 'ج'], breakdown: 'ف + ج', page: 2, section: 'page2_grid1', category: '2-letter' },

  // Grid 2: 36 Three & Four-letter words
  { id: 'p2-33', compound: 'بسم', name: 'بَاءْ سِينْ مِيمْ', letters: ['ب', 'س', 'م'], breakdown: 'ب + س + م', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'اللہ کے نام سے' },
  { id: 'p2-34', compound: 'شفع', name: 'شِينْ فَاءْ عَيْنْ', letters: ['ش', 'ف', 'ع'], breakdown: 'ش + ف + ع', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-35', compound: 'عسق', name: 'عَيْنْ سِينْ قَافْ', letters: ['ع', 'س', 'ق'], breakdown: 'ع + س + ق', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-36', compound: 'سجد', name: 'سِينْ جِيمْ دَالْ', letters: ['س', 'ج', 'د'], breakdown: 'س + ج + د', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'اس نے سجدہ کیا' },
  { id: 'p2-37', compound: 'علم', name: 'عَيْنْ لَامْ مِيمْ', letters: ['ع', 'ل', 'م'], breakdown: 'ع + ل + م', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'علم، جاننا' },
  { id: 'p2-38', compound: 'خلق', name: 'خَاءْ لَامْ قَافْ', letters: ['خ', 'ل', 'ق'], breakdown: 'خ + ل + ق', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'اس نے پیدا کیا' },

  { id: 'p2-39', compound: 'نصر', name: 'نُوْنْ صَادْ رَاءْ', letters: ['ن', 'ص', 'ر'], breakdown: 'ن + ص + ر', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'مدد، فتح' },
  { id: 'p2-40', compound: 'عند', name: 'عَيْنْ نُوْنْ دَالْ', letters: ['ع', 'ن', 'د'], breakdown: 'ع + ن + د', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'پاس، نزدیک' },
  { id: 'p2-41', compound: 'لهب', name: 'لَامْ هَاءْ بَاءْ', letters: ['ل', 'ه', 'ب'], breakdown: 'ل + ه + ب', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'شعلہ' },
  { id: 'p2-42', compound: 'حمد', name: 'حَاءْ مِيمْ دَالْ', letters: ['ح', 'م', 'د'], breakdown: 'ح + م + د', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'تعریف، حمد' },
  { id: 'p2-43', compound: 'قنت', name: 'قَافْ نُوْنْ تَاءْ', letters: ['ق', 'ن', 'ت'], breakdown: 'ق + ن + ت', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-44', compound: 'ثنا', name: 'ثَاءْ نُوْنْ أَلِفْ', letters: ['ث', 'ن', 'ا'], breakdown: 'ث + ن + ا', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'تعریف' },

  { id: 'p2-45', compound: 'فله', name: 'فَاءْ لَامْ هَاءْ', letters: ['ف', 'ل', 'ه'], breakdown: 'ف + ل + ه', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-46', compound: 'لحم', name: 'لَامْ حَاءْ مِيمْ', letters: ['ل', 'ح', 'م'], breakdown: 'ل + ح + م', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'گوشت' },
  { id: 'p2-47', compound: 'بكم', name: 'بَاءْ كَافْ مِيمْ', letters: ['ب', 'ك', 'م'], breakdown: 'ب + ك + م', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'گونگے' },
  { id: 'p2-48', compound: 'يكن', name: 'يَاءْ كَافْ نُوْنْ', letters: ['ي', 'ك', 'ن'], breakdown: 'ي + ك + ن', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'وہ ہو جائے' },
  { id: 'p2-49', compound: 'غيث', name: 'غَيْنْ يَاءْ ثَاءْ', letters: ['غ', 'ي', 'ث'], breakdown: 'غ + ي + ث', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'بارش' },
  { id: 'p2-50', compound: 'فلا', name: 'فَاءْ لَامْ أَلِفْ', letters: ['ف', 'ل', 'ا'], breakdown: 'ف + ل + ا', page: 2, section: 'page2_words', category: '3-letter' },

  { id: 'p2-51', compound: 'عمل', name: 'عَيْنْ مِيمْ لَامْ', letters: ['ع', 'م', 'ل'], breakdown: 'ع + م + ل', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'کام، عمل' },
  { id: 'p2-52', compound: 'نصب', name: 'نُوْنْ صَادْ بَاءْ', letters: ['ن', 'ص', 'ب'], breakdown: 'ن + ص + ب', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-53', compound: 'لعن', name: 'لَامْ عَيْنْ نُوْنْ', letters: ['ل', 'ع', 'ن'], breakdown: 'ل + ع + ن', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'لعنت کی' },
  { id: 'p2-54', compound: 'لها', name: 'لَامْ هَاءْ أَلِفْ', letters: ['ل', 'ه', 'ا'], breakdown: 'ل + ه + ا', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'اس کے لیے' },
  { id: 'p2-55', compound: 'خيل', name: 'خَاءْ يَاءْ لَامْ', letters: ['خ', 'ي', 'ل'], breakdown: 'خ + ي + ل', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'گھوڑے' },
  { id: 'p2-56', compound: 'لما', name: 'لَامْ مِيمْ أَلِفْ', letters: ['ل', 'م', 'ا'], breakdown: 'ل + م + ا', page: 2, section: 'page2_words', category: '3-letter' },

  { id: 'p2-57', compound: 'سطح', name: 'سِينْ طَاءْ حَاءْ', letters: ['س', 'ط', 'ح'], breakdown: 'س + ط + ح', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'سطح، پھیلایا' },
  { id: 'p2-58', compound: 'قضى', name: 'قَافْ ضَادْ يَاءْ', letters: ['ق', 'ض', 'ى'], breakdown: 'ق + ض + ى', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'فیصلہ کیا' },
  { id: 'p2-59', compound: 'كلا', name: 'كَافْ لَامْ أَلِفْ', letters: ['ك', 'ل', 'ا'], breakdown: 'ك + ل + ا', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'ہرگز نہیں' },
  { id: 'p2-60', compound: 'حسن', name: 'حَاءْ سِينْ نُوْنْ', letters: ['ح', 'س', 'ن'], breakdown: 'ح + س + ن', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'خوبصورت، نیکی' },
  { id: 'p2-61', compound: 'سفل', name: 'سِينْ فَاءْ لَامْ', letters: ['س', 'ف', 'ل'], breakdown: 'س + ف + ل', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'نیچے، پست' },
  { id: 'p2-62', compound: 'بقى', name: 'بَاءْ قَافْ يَاءْ', letters: ['ب', 'ق', 'ى'], breakdown: 'ب + ق + ى', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'باقی رہا' },

  { id: 'p2-63', compound: 'نشر', name: 'نُوْنْ شِينْ رَاءْ', letters: ['ن', 'ش', 'ر'], breakdown: 'ن + ش + ر', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'پھیلایا' },
  { id: 'p2-64', compound: 'عبد', name: 'عَيْنْ بَاءْ دَالْ', letters: ['ع', 'ب', 'د'], breakdown: 'ع + ب + د', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'بندہ، عبادت گزار' },
  { id: 'p2-65', compound: 'سلا', name: 'سِينْ لَامْ أَلِفْ', letters: ['س', 'ل', 'ا'], breakdown: 'س + ل + ا', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-66', compound: 'عفو', name: 'عَيْنْ فَاءْ وَاوْ', letters: ['ع', 'ف', 'و'], breakdown: 'ع + ف + و', page: 2, section: 'page2_words', category: '3-letter', urduMeaning: 'معافی' },
  { id: 'p2-67', compound: 'مقا', name: 'مِيمْ قَافْ أَلِفْ', letters: ['م', 'ق', 'ا'], breakdown: 'م + ق + ا', page: 2, section: 'page2_words', category: '3-letter' },
  { id: 'p2-68', compound: 'تقهر', name: 'تَاءْ قَافْ هَاءْ رَاءْ', letters: ['ت', 'ق', 'ه', 'ر'], breakdown: 'ت + ق + ه + ر', page: 2, section: 'page2_words', category: '4-letter', urduMeaning: 'سختی کرو' },

  // Grid 3: Quranic Long Compound Sentences / Ayahs
  {
    id: 'p2-69',
    compound: 'فَسَيَكْفِيكَهُمُ اللَّهُ',
    name: 'فَاءْ سِينْ يَاءْ كَافْ فَاءْ يَاءْ كَافْ هَاءْ مِيمْ أَلِفْ لَامْ لَامْ هَاءْ',
    letters: ['ف', 'س', 'ي', 'ك', 'ف', 'ي', 'ك', 'ه', 'م', 'ا', 'ل', 'ل', 'ه'],
    breakdown: 'ف + س + ي + ك + ف + ي + ك + ه + م + الله',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'پس اللہ تمہاری طرف سے ان کے لیے کافی ہوگا'
  },
  {
    id: 'p2-70',
    compound: 'لَتُنَبَّؤُنَّ',
    name: 'لَامْ تَاءْ نُوْنْ بَاءْ هَمْزَة نُوْنْ',
    letters: ['ل', 'ت', 'ن', 'ب', 'ئ', 'ن'],
    breakdown: 'ل + ت + ن + ب + ئ + ن',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'تمہیں ضرور باخبر کیا جائے گا'
  },
  {
    id: 'p2-71',
    compound: 'فَجَعَلَهُمْ',
    name: 'فَاءْ جِيمْ عَيْنْ لَامْ هَاءْ مِيمْ',
    letters: ['ف', 'ج', 'ع', 'ل', 'ه', 'م'],
    breakdown: 'ف + ج + ع + ل + ه + م',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'پس اس نے انہیں بنا دیا'
  },
  {
    id: 'p2-72',
    compound: 'فَتَنْفَعَهُ',
    name: 'فَاءْ تَاءْ نُوْنْ فَاءْ عَيْنْ هَاءْ',
    letters: ['ف', 'ت', 'ن', 'ف', 'ع', 'ه'],
    breakdown: 'ف + ت + ن + ف + ع + ه',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'پس اسے فائدہ پہنچائے'
  },
  {
    id: 'p2-73',
    compound: 'كَعَصْفٍ مَّأْكُولٍ',
    name: 'كَافْ عَيْنْ صَادْ فَاءْ مِيمْ هَمْزَة كَافْ وَاوْ لَامْ',
    letters: ['ك', 'ع', 'ص', 'ف', 'م', 'أ', 'ك', 'و', 'ل'],
    breakdown: 'ك + ع + ص + ف + م + أ + ك + و + ل',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'کھائے ہوئے بھوسے کی طرح'
  },
  {
    id: 'p2-74',
    compound: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ',
    name: 'سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ',
    letters: ['س', 'ب', 'ح', 'ن', 'ر', 'ب', 'ك', 'ر', 'ب', 'ا', 'ل', 'ع', 'ز', 'ة', 'ع', 'م', 'ا', 'ي', 'ص', 'ف', 'و', 'ن'],
    breakdown: 'سبحن + ربك + رب + العزة + عما + يصفون',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'پاک ہے آپ کا پروردگار، عزت والا، ان تمام باتوں سے جو وہ بیان کرتے ہیں'
  },
  {
    id: 'p2-75',
    compound: 'وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    name: 'وَسَلَامٌ عَلَى الْمُرْسَلِينَ وَالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    letters: ['و', 'س', 'ل', 'ا', 'م', 'ع', 'ل', 'ى', 'ا', 'ل', 'م', 'ر', 'س', 'ل', 'ي', 'ن', 'و', 'ا', 'ل', 'ح', 'م', 'د', 'ل', 'ل', 'ه', 'ر', 'ب', 'ا', 'ل', 'ع', 'ل', 'م', 'ي', 'ن'],
    breakdown: 'وسلام + على + المرسلين + والحمد + لله + رب + العلمين',
    page: 2,
    section: 'page2_sentences',
    category: 'sentence',
    urduMeaning: 'اور سلام ہو رسولوں پر اور تمام تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے'
  }
];

export const ALL_MURAKKABAT_MASHQ: MurakkabExerciseItem[] = [
  ...PAGE_1_EXERCISE,
  ...PAGE_2_EXERCISE
];
