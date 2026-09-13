import re

with open('src/components/HuroofMaddahGameModal.tsx', 'r') as f:
    content = f.read()

# Replace Imports
content = re.sub(r"import \{.*?\} from '\.\./data/huroofMaddahData';", "", content, flags=re.DOTALL)

# Inject Tashdeed data
tashdeed_data = """
export interface TashdeedGameItem {
  id: string;
  word: string;
  lettersDisplay: string;
  urduSpelling: string;
  categoryLabelUrdu: string;
  category: string;
  rawSound: string;
  isGhunnah?: boolean;
  isQalqalah?: boolean;
  qalqalahLetter?: string;
  isHeavy?: boolean;
  heavyLetter?: string;
  tajweedNote: string;
  breakdownParts?: string[];
}

export const TASHDEED_GAME_ITEMS: TashdeedGameItem[] = [
  { id: 't1', word: 'اَبَّ', lettersDisplay: 'اَ + بَّ', urduSpelling: 'ہمزہ زبر باء تشدید اَبَّ', category: 'قلقلہ', categoryLabelUrdu: 'قلقلہ', rawSound: 'اَبَّ', isQalqalah: true, qalqalahLetter: 'ب', tajweedNote: 'باء پر تشدید ہے، سختی اور قلقلہ کے ساتھ ادا کریں۔', breakdownParts: ['اَ', 'بَّ'] },
  { id: 't2', word: 'اِنَّ', lettersDisplay: 'اِ + نَّ', urduSpelling: 'ہمزہ زیر نون تشدید اِنَّ', category: 'غنہ', categoryLabelUrdu: 'غنہ', rawSound: 'اِنَّ', isGhunnah: true, tajweedNote: 'نون مشدد ہے، غنہ (آواز کو ناک میں روکنا) لازمی ہوگا۔', breakdownParts: ['اِ', 'نَّ'] },
  { id: 't3', word: 'عَمَّ', lettersDisplay: 'عَ + مَّ', urduSpelling: 'عین زبر میم تشدید عَمَّ', category: 'غنہ', categoryLabelUrdu: 'غنہ', rawSound: 'عَمَّ', isGhunnah: true, tajweedNote: 'میم مشدد ہے، غنہ کی مقدار 2 حرکات کے برابر ہوگی۔', breakdownParts: ['عَ', 'مَّ'] },
  { id: 't4', word: 'ثُمَّ', lettersDisplay: 'ثُ + مَّ', urduSpelling: 'ثاء پیش میم تشدید ثُمَّ', category: 'غنہ', categoryLabelUrdu: 'غنہ', rawSound: 'ثُمَّ', isGhunnah: true, tajweedNote: 'ثاء کو نرمی سے ادا کر کے میم پر غنہ کریں۔', breakdownParts: ['ثُ', 'مَّ'] },
  { id: 't5', word: 'حَقُّ', lettersDisplay: 'حَ + قُّ', urduSpelling: 'حاء زبر قاف تشدید حَقُّ', category: 'مستعلیہ', categoryLabelUrdu: 'مستعلیہ', rawSound: 'حَقُّ', isHeavy: true, heavyLetter: 'ق', tajweedNote: 'قاف حرفِ مستعلیہ ہے، اسے موٹا اور تشدید کی سختی سے پڑھیں۔', breakdownParts: ['حَ', 'قُّ'] },
  { id: 't6', word: 'يَظُنُّ', lettersDisplay: 'يَ + ظُ + نُّ', urduSpelling: 'یا زبر ظا پیش نون تشدید ظُنُّ يَظُنُّ', category: '۳ و ۴ حرفی', categoryLabelUrdu: '۳ و ۴ حرفی', rawSound: 'يَظُنُّ', isGhunnah: true, tajweedNote: 'نون مشدد پر غنہ ہوگا، اور ظاء کو پُر پڑھا جائے گا۔', breakdownParts: ['يَ', 'ظُ', 'نُّ'] },
  { id: 't7', word: 'رَبِّ', lettersDisplay: 'رَ + بِّ', urduSpelling: 'راء زبر باء تشدید رَبِّ', category: '۲ حرفی مشدد', categoryLabelUrdu: '۲ حرفی مشدد', rawSound: 'رَبِّ', isQalqalah: true, qalqalahLetter: 'ب', tajweedNote: 'باء پر تشدید ہے، سختی سے ادا کریں', breakdownParts: ['رَ', 'بِّ'] },
  { id: 't8', word: 'جَنَّتِ', lettersDisplay: 'جَ + نَّ + تِ', urduSpelling: 'جیم زبر نون تشدید جَنَّ، تاء زیر تِ', category: '۳ و ۴ حرفی', categoryLabelUrdu: '۳ و ۴ حرفی', rawSound: 'جَنَّتِ', isGhunnah: true, tajweedNote: 'نون مشدد پر غنہ کرنا ضروری ہے۔', breakdownParts: ['جَ', 'نَّ', 'تِ'] },
  { id: 't9', word: 'مُحَمَّدٍ', lettersDisplay: 'مُ + حَ + مَّ + دٍ', urduSpelling: 'میم پیش مُ، حاء زبر میم تشدید حَمَّ، دال دو زیر دٍ', category: '۳ و ۴ حرفی', categoryLabelUrdu: '۳ و ۴ حرفی', rawSound: 'مُحَمَّدٍ', isGhunnah: true, tajweedNote: 'میم مشدد پر غنہ کریں', breakdownParts: ['مُ', 'حَ', 'مَّ', 'دٍ'] },
  { id: 't10', word: 'سَيِّدِ', lettersDisplay: 'سَ + يِّ + دِ', urduSpelling: 'سین زبر یاء تشدید سَيِّ، دال زیر دِ', category: '۳ و ۴ حرفی', categoryLabelUrdu: '۳ و ۴ حرفی', rawSound: 'سَيِّدِ', tajweedNote: 'یاء مشدد ہے', breakdownParts: ['سَ', 'يِّ', 'دِ'] },
  { id: 't11', word: 'يُزَكِّي', lettersDisplay: 'يُ + زَ + كِّي', urduSpelling: 'یا پیش يُ، زا زبر کاف تشدید زَكِّ، یاء کھڑی زیر ي', category: '۳ و ۴ حرفی', categoryLabelUrdu: '۳ و ۴ حرفی', rawSound: 'يُزَكِّي', tajweedNote: 'کاف پر تشدید ہے', breakdownParts: ['يُ', 'زَ', 'كِّ', 'ي'] },
  { id: 't12', word: 'فَضَّلَ', lettersDisplay: 'فَ + ضَّ + لَ', urduSpelling: 'فا زبر ضاد تشدید فَضَّ، لام زبر لَ', category: 'مستعلیہ', categoryLabelUrdu: 'مستعلیہ', rawSound: 'فَضَّلَ', isHeavy: true, heavyLetter: 'ض', tajweedNote: 'ضاد حرفِ مستعلیہ ہے، اسے پُر (موٹا) پڑھیں', breakdownParts: ['فَ', 'ضَّ', 'لَ'] }
];

interface TashdeedGameModalProps {
  onClose: () => void;
  initialMode?: 'quiz' | 'puzzle' | 'match' | 'speed';
}
"""

# Find the start of export interface HuroofMaddahGameModalProps
start_idx = content.find('interface HuroofMaddahGameModalProps')
# Remove everything from imports to start_idx
content = content[:content.find('import { playQariText')] + "import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect, playUrduText } from '../utils/qariAudioService';\n\n" + tashdeed_data + "\n\n" + content[content.find('export const HuroofMaddahGameModal'):]

# Replace names
content = content.replace('HuroofMaddahGameModal', 'TashdeedGameModal')
content = content.replace('MaddahGameItem', 'TashdeedGameItem')
content = content.replace('maddah_game_score', 'tashdeed_game_score')
content = content.replace('maddah_game_coins', 'qaida_coins')
content = content.replace('maddah_best_streak', 'tashdeed_best_streak')
content = content.replace('onBack', 'onClose')

# Replace Data Variables
content = re.sub(r'ALL_MADDAH_MASHQ_WORDS', 'TASHDEED_GAME_ITEMS', content)
content = re.sub(r'WORD_MADDAH_GAME_ITEMS', 'TASHDEED_GAME_ITEMS', content)
content = re.sub(r'SINGLE_MADDAH_GAME_ITEMS', 'TASHDEED_GAME_ITEMS', content)
content = re.sub(r'TRIPLET_MADDAH_GAME_ITEMS', 'TASHDEED_GAME_ITEMS', content)

# Fix breakdown matching
content = content.replace('w.maddahType', 'w.category')
content = content.replace('maddahType:', 'category:')

# Replace header text
content = content.replace('صوتی و بصری گیم: حروفِ مدہ 🎯', 'صوتی و بصری گیم: تشدید 🎯')
content = content.replace('بَا، بُوْ، بِيْ جیسے تمام حروف مدہ اور کلمات کی صوتی و بصری مشق', 'تشدید والے کلمات کی صوتی و بصری مشق اور تفریحی گیمز')
content = content.replace('مفردات مدہ (۱ حرف)', 'آسان سطح (Basic)')
content = content.replace('ثلاثی جوڑیاں', 'درمیانی سطح (Medium)')
content = content.replace('قرآنی و مشقی کلمات', 'مشکل سطح (Hard)')

with open('src/components/TashdeedGameModal.tsx', 'w') as f:
    f.write(content)

