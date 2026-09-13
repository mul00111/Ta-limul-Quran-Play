import re

with open('src/components/TashdeedGameModal.tsx', 'r') as f:
    content = f.read()

# Replace types and components
content = content.replace('SukoonGameModal', 'TashdeedGameModal')
content = content.replace('SukoonGameCategory', 'TashdeedGameCategory')
content = content.replace('SukoonGameItem', 'TashdeedGameItem')
content = content.replace('SUKOON_GAME_ITEMS', 'TASHDEED_GAME_ITEMS')

# Replace the categories definition
content = re.sub(
    r"export type TashdeedGameCategory = 'all' \| 'two-letter' \| 'three-plus' \| 'qalqalah' \| 'hamzah-sakin' \| 'heavy-sakin';",
    "export type TashdeedGameCategory = 'all' | 'two-letter' | 'three-plus' | 'ghunnah' | 'qalqalah' | 'heavy-tashdeed';",
    content
)

# Replace category labels in the UI
content = content.replace("ساکن و قلقلہ گیم سنٹر 🎯", "تشدید اور غنہ گیم سنٹر 🎯")
content = content.replace("ساکن کلمات کی مشق", "مشدد کلمات کی مشق")
content = content.replace("آواز سن کر صحیح ساکن کلمے کا انتخاب کریں", "آواز سن کر صحیح مشدد کلمے کا انتخاب کریں")
content = content.replace("ساکن کلمے کو پہچانیں", "مشدد کلمے کو پہچانیں")

# We need to replace the dataset
new_dataset = """
// Comprehensive dataset for Tashdeed (Ghunnah, Qalqalah, Basic)
export const TASHDEED_GAME_ITEMS: TashdeedGameItem[] = [
  { id: 't1', word: 'اَبَّ', lettersDisplay: 'اَ + بَّ', urduSpelling: 'ہمزہ زبر باء تشدید اَبَّ', category: 'قلقلہ', rawSound: 'اَبَّ', isQalqalah: true, qalqalahLetter: 'ب', tajweedNote: 'باء پر تشدید ہے، سختی اور قلقلہ کے ساتھ ادا کریں۔', breakdownParts: ['اَ', 'بَّ'] },
  { id: 't2', word: 'اِنَّ', lettersDisplay: 'اِ + نَّ', urduSpelling: 'ہمزہ زیر نون تشدید اِنَّ', category: 'غنہ', rawSound: 'اِنَّ', isGhunnah: true, tajweedNote: 'نون مشدد ہے، غنہ (آواز کو ناک میں روکنا) لازمی ہوگا۔', breakdownParts: ['اِ', 'نَّ'] },
  { id: 't3', word: 'عَمَّ', lettersDisplay: 'عَ + مَّ', urduSpelling: 'عین زبر میم تشدید عَمَّ', category: 'غنہ', rawSound: 'عَمَّ', isGhunnah: true, tajweedNote: 'میم مشدد ہے، غنہ کی مقدار 2 حرکات کے برابر ہوگی۔', breakdownParts: ['عَ', 'مَّ'] },
  { id: 't4', word: 'ثُمَّ', lettersDisplay: 'ثُ + مَّ', urduSpelling: 'ثاء پیش میم تشدید ثُمَّ', category: 'غنہ', rawSound: 'ثُمَّ', isGhunnah: true, tajweedNote: 'ثاء کو نرمی سے ادا کر کے میم پر غنہ کریں۔', breakdownParts: ['ثُ', 'مَّ'] },
  { id: 't5', word: 'حَقُّ', lettersDisplay: 'حَ + قُّ', urduSpelling: 'حاء زبر قاف تشدید حَقُّ', category: 'مستعلیہ', rawSound: 'حَقُّ', isHeavy: true, heavyLetter: 'ق', tajweedNote: 'قاف حرفِ مستعلیہ ہے، اسے موٹا اور تشدید کی سختی سے پڑھیں۔', breakdownParts: ['حَ', 'قُّ'] },
  { id: 't6', word: 'يَظُنُّ', lettersDisplay: 'يَ + ظُ + نُّ', urduSpelling: 'یا زبر ظا پیش نون تشدید ظُنُّ يَظُنُّ', category: '۳ و ۴ حرفی', rawSound: 'يَظُنُّ', isGhunnah: true, tajweedNote: 'نون مشدد پر غنہ ہوگا، اور ظاء کو پُر پڑھا جائے گا۔', breakdownParts: ['يَ', 'ظُ', 'نُّ'] },
  { id: 't7', word: 'رَبِّ', lettersDisplay: 'رَ + بِّ', urduSpelling: 'راء زبر باء تشدید رَبِّ', category: '۲ حرفی مشدد', rawSound: 'رَبِّ', isQalqalah: true, qalqalahLetter: 'ب', tajweedNote: 'باء پر تشدید ہے، سختی سے ادا کریں', breakdownParts: ['رَ', 'بِّ'] },
  { id: 't8', word: 'جَنَّتِ', lettersDisplay: 'جَ + نَّ + تِ', urduSpelling: 'جیم زبر نون تشدید جَنَّ، تاء زیر تِ', category: '۳ و ۴ حرفی', rawSound: 'جَنَّتِ', isGhunnah: true, tajweedNote: 'نون مشدد پر غنہ کرنا ضروری ہے۔', breakdownParts: ['جَ', 'نَّ', 'تِ'] },
  { id: 't9', word: 'مُحَمَّدٍ', lettersDisplay: 'مُ + حَ + مَّ + دٍ', urduSpelling: 'میم پیش مُ، حاء زبر میم تشدید حَمَّ، دال دو زیر دٍ', category: '۳ و ۴ حرفی', rawSound: 'مُحَمَّدٍ', isGhunnah: true, tajweedNote: 'میم مشدد پر غنہ کریں', breakdownParts: ['مُ', 'حَ', 'مَّ', 'دٍ'] },
  { id: 't10', word: 'سَيِّدِ', lettersDisplay: 'سَ + يِّ + دِ', urduSpelling: 'سین زبر یاء تشدید سَيِّ، دال زیر دِ', category: '۳ و ۴ حرفی', rawSound: 'سَيِّدِ', tajweedNote: 'یاء مشدد ہے', breakdownParts: ['سَ', 'يِّ', 'دِ'] },
  { id: 't11', word: 'يُزَكِّي', lettersDisplay: 'يُ + زَ + كِّي', urduSpelling: 'یا پیش يُ، زا زبر کاف تشدید زَكِّ، یاء کھڑی زیر ي', category: '۳ و ۴ حرفی', rawSound: 'يُزَكِّي', tajweedNote: 'کاف پر تشدید ہے', breakdownParts: ['يُ', 'زَ', 'كِّ', 'ي'] },
  { id: 't12', word: 'فَضَّلَ', lettersDisplay: 'فَ + ضَّ + لَ', urduSpelling: 'فا زبر ضاد تشدید فَضَّ، لام زبر لَ', category: 'مستعلیہ', rawSound: 'فَضَّلَ', isHeavy: true, heavyLetter: 'ض', tajweedNote: 'ضاد حرفِ مستعلیہ ہے، اسے پُر (موٹا) پڑھیں', breakdownParts: ['فَ', 'ضَّ', 'لَ'] }
];
"""

# Replace dataset block
content = re.sub(
    r"export const TASHDEED_GAME_ITEMS: TashdeedGameItem\[\] = \[.*?\];",
    new_dataset.strip(),
    content,
    flags=re.DOTALL
)

# Update categories filtering
content = content.replace("cat.id === 'hamzah-sakin'", "cat.id === 'ghunnah'")
content = content.replace("cat.id === 'heavy-sakin'", "cat.id === 'heavy-tashdeed'")
content = content.replace("pool = TASHDEED_GAME_ITEMS.filter(i => i.isHamzahSakinah);", "pool = TASHDEED_GAME_ITEMS.filter(i => i.isGhunnah);")

content = content.replace("pool = TASHDEED_GAME_ITEMS.filter(i => i.category === '۲ حرفی ساکن' || i.word.length <= 4);", "pool = TASHDEED_GAME_ITEMS.filter(i => i.category === '۲ حرفی مشدد' || i.word.length <= 4);")

# Update categories menu
content = content.replace("{ id: 'hamzah-sakin', label: 'ہمزہ ساکنہ' }", "{ id: 'ghunnah', label: 'غنہ مشدد' }")
content = content.replace("{ id: 'heavy-sakin', label: 'مستعلیہ ساکن' }", "{ id: 'heavy-tashdeed', label: 'مستعلیہ مشدد' }")
content = content.replace("{ id: 'two-letter', label: '۲ حرفی ساکن' }", "{ id: 'two-letter', label: '۲ حرفی مشدد' }")


with open('src/components/TashdeedGameModal.tsx', 'w') as f:
    f.write(content)
