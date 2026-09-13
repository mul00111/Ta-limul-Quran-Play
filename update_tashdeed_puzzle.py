import re

with open('src/components/TashdeedPuzzleGameModal.tsx', 'r') as f:
    content = f.read()

# Replace types and components
content = content.replace('MurakkabatPuzzleGameModal', 'TashdeedPuzzleGameModal')
content = content.replace('MurakkabatPuzzleGameModalProps', 'TashdeedPuzzleGameModalProps')
content = content.replace('MurakkabatPuzzleItem', 'TashdeedPuzzleItem')
content = content.replace('MURAKKABAT_PUZZLE_ITEMS', 'TASHDEED_PUZZLE_ITEMS')

content = content.replace('مرکبات کی اشکال ملائیں 🧩', 'مشدد کلمات ملائیں 🧩')
content = content.replace('حروف ملا کر مرکب کلمہ مکمل کریں', 'حروف ملا کر مشدد کلمہ مکمل کریں')
content = content.replace('پزل گیم سنٹر (مرکبات)', 'پزل گیم سنٹر (تشدید)')


new_dataset = """
// Data set for Tashdeed Puzzle
export const TASHDEED_PUZZLE_ITEMS: TashdeedPuzzleItem[] = [
  { id: 'p1', arabicWord: 'اَبَّ', parts: ['اَ', 'بَّ'], difficulty: 'easy', urduTranslation: 'ہمزہ زبر باء تشدید اَبَّ', completedAudio: 'اَبَّ' },
  { id: 'p2', arabicWord: 'اِنَّ', parts: ['اِ', 'نَّ'], difficulty: 'easy', urduTranslation: 'ہمزہ زیر نون تشدید اِنَّ (غنہ)', completedAudio: 'اِنَّ' },
  { id: 'p3', arabicWord: 'عَمَّ', parts: ['عَ', 'مَّ'], difficulty: 'easy', urduTranslation: 'عین زبر میم تشدید عَمَّ (غنہ)', completedAudio: 'عَمَّ' },
  { id: 'p4', arabicWord: 'ثُمَّ', parts: ['ثُ', 'مَّ'], difficulty: 'easy', urduTranslation: 'ثاء پیش میم تشدید ثُمَّ', completedAudio: 'ثُمَّ' },
  { id: 'p5', arabicWord: 'يَظُنُّ', parts: ['يَ', 'ظُ', 'نُّ'], difficulty: 'medium', urduTranslation: 'ظنّ', completedAudio: 'يَظُنُّ' },
  { id: 'p6', arabicWord: 'جَنَّتِ', parts: ['جَ', 'نَّ', 'تِ'], difficulty: 'medium', urduTranslation: 'جنّت', completedAudio: 'جَنَّتِ' },
  { id: 'p7', arabicWord: 'سَيِّدِ', parts: ['سَ', 'يِّ', 'دِ'], difficulty: 'medium', urduTranslation: 'سید', completedAudio: 'سَيِّدِ' },
  { id: 'p8', arabicWord: 'مُحَمَّدٍ', parts: ['مُ', 'حَ', 'مَّ', 'دٍ'], difficulty: 'hard', urduTranslation: 'محمد', completedAudio: 'مُحَمَّدٍ' },
  { id: 'p9', arabicWord: 'يُزَكِّي', parts: ['يُ', 'زَ', 'كِّ', 'ي'], difficulty: 'hard', urduTranslation: 'یزکی', completedAudio: 'يُزَكِّي' },
  { id: 'p10', arabicWord: 'تَوَابًا', parts: ['تَ', 'وَ', 'ا', 'بًا'], difficulty: 'hard', urduTranslation: 'توابا', completedAudio: 'تَوَابًا' } // wait, better word for tashdeed
];
"""

content = re.sub(
    r"export const TASHDEED_PUZZLE_ITEMS: TashdeedPuzzleItem\[\] = \[.*?\];",
    new_dataset.strip(),
    content,
    flags=re.DOTALL
)

with open('src/components/TashdeedPuzzleGameModal.tsx', 'w') as f:
    f.write(content)
