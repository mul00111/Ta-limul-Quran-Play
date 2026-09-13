/**
 * Quran Paras (Juz 1 - 30) and 114 Surahs Master Directory
 * Complete metadata for all 30 Paras, their Arabic names, Urdu names, and Surah listings.
 */

export interface ParaInfo {
  number: number;
  arabicName: string;
  urduName: string;
  romanName: string;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  totalAyahs: number;
  surahNumbers: number[];
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  urduName: string;
  totalAyahs: number;
  type: 'مكية' | 'مدنية';
  hasBismillah: boolean;
  juzNumbers: number[];
}

// All 30 Paras (Juz) with accurate Arabic names and boundaries
export const ALL_30_PARAS: ParaInfo[] = [
  {
    number: 1,
    arabicName: "الم",
    urduName: "پارہ ۱: الم",
    romanName: "Alif Lam Meem",
    startSurah: 1,
    startAyah: 1,
    endSurah: 2,
    endAyah: 141,
    totalAyahs: 148,
    surahNumbers: [1, 2]
  },
  {
    number: 2,
    arabicName: "سَيَقُولُ",
    urduName: "پارہ ۲: سیقول",
    romanName: "Sayaqool",
    startSurah: 2,
    startAyah: 142,
    endSurah: 2,
    endAyah: 252,
    totalAyahs: 111,
    surahNumbers: [2]
  },
  {
    number: 3,
    arabicName: "تِلْكَ الرُّسُلُ",
    urduName: "پارہ ۳: تلک الرسل",
    romanName: "Tilkar Rusul",
    startSurah: 2,
    startAyah: 253,
    endSurah: 3,
    endAyah: 91,
    totalAyahs: 125,
    surahNumbers: [2, 3]
  },
  {
    number: 4,
    arabicName: "لَنْ تَنَالُوا",
    urduName: "پارہ ۴: لن تنالوا",
    romanName: "Lan Tanaloo",
    startSurah: 3,
    startAyah: 92,
    endSurah: 4,
    endAyah: 23,
    totalAyahs: 132,
    surahNumbers: [3, 4]
  },
  {
    number: 5,
    arabicName: "وَالْمُحْصَنَاتُ",
    urduName: "پارہ ۵: والمحصنات",
    romanName: "Wal Muhsanat",
    startSurah: 4,
    startAyah: 24,
    endSurah: 4,
    endAyah: 147,
    totalAyahs: 124,
    surahNumbers: [4]
  },
  {
    number: 6,
    arabicName: "لَا يُحِبُّ اللَّهُ",
    urduName: "پارہ ۶: لا یحب اللہ",
    romanName: "La Yuhibbullah",
    startSurah: 4,
    startAyah: 148,
    endSurah: 5,
    endAyah: 81,
    totalAyahs: 110,
    surahNumbers: [4, 5]
  },
  {
    number: 7,
    arabicName: "وَإِذَا سَمِعُوا",
    urduName: "پارہ ۷: واذا سمعوا",
    romanName: "Wa Iza Sami'oo",
    startSurah: 5,
    startAyah: 82,
    endSurah: 6,
    endAyah: 110,
    totalAyahs: 149,
    surahNumbers: [5, 6]
  },
  {
    number: 8,
    arabicName: "وَلَوْ أَنَّنَا",
    urduName: "پارہ ۸: ولو اننا",
    romanName: "Wa Lau Annana",
    startSurah: 6,
    startAyah: 111,
    endSurah: 7,
    endAyah: 87,
    totalAyahs: 142,
    surahNumbers: [6, 7]
  },
  {
    number: 9,
    arabicName: "قَالَ الْمَلَأُ",
    urduName: "پارہ ۹: قال الملا",
    romanName: "Qalal Mala'o",
    startSurah: 7,
    startAyah: 88,
    endSurah: 8,
    endAyah: 40,
    totalAyahs: 159,
    surahNumbers: [7, 8]
  },
  {
    number: 10,
    arabicName: "وَاعْلَمُوا",
    urduName: "پارہ ۱۰: واعلموا",
    romanName: "Wa'lamoo",
    startSurah: 8,
    startAyah: 41,
    endSurah: 9,
    endAyah: 92,
    totalAyahs: 127,
    surahNumbers: [8, 9]
  },
  {
    number: 11,
    arabicName: "يَعْتَذِرُونَ",
    urduName: "پارہ ۱۱: یعتذرون",
    romanName: "Ya'taziroon",
    startSurah: 9,
    startAyah: 93,
    endSurah: 11,
    endAyah: 5,
    totalAyahs: 151,
    surahNumbers: [9, 10, 11]
  },
  {
    number: 12,
    arabicName: "وَمَا مِنْ دَابَّةٍ",
    urduName: "پارہ ۱۲: وما من دابۃ",
    romanName: "Wa Mamin Daabbah",
    startSurah: 11,
    startAyah: 6,
    endSurah: 12,
    endAyah: 52,
    totalAyahs: 170,
    surahNumbers: [11, 12]
  },
  {
    number: 13,
    arabicName: "وَمَا أُبَرِّئُ",
    urduName: "پارہ ۱۳: وما ابرئ",
    romanName: "Wa Ma Ubarri'u",
    startSurah: 12,
    startAyah: 53,
    endSurah: 14,
    endAyah: 52,
    totalAyahs: 154,
    surahNumbers: [12, 13, 14]
  },
  {
    number: 14,
    arabicName: "رُبَمَا",
    urduName: "پارہ ۱۴: ربما",
    romanName: "Rubama",
    startSurah: 15,
    startAyah: 1,
    endSurah: 16,
    endAyah: 128,
    totalAyahs: 227,
    surahNumbers: [15, 16]
  },
  {
    number: 15,
    arabicName: "سُبْحَانَ الَّذِي",
    urduName: "پارہ ۱۵: سبحان الذی",
    romanName: "Subhanallazi",
    startSurah: 17,
    startAyah: 1,
    endSurah: 18,
    endAyah: 74,
    totalAyahs: 185,
    surahNumbers: [17, 18]
  },
  {
    number: 16,
    arabicName: "قَالَ أَلَمْ",
    urduName: "پارہ ۱۶: قال الم",
    romanName: "Qal Alam",
    startSurah: 18,
    startAyah: 75,
    endSurah: 20,
    endAyah: 135,
    totalAyahs: 269,
    surahNumbers: [18, 19, 20]
  },
  {
    number: 17,
    arabicName: "اقْتَرَبَ لِلنَّاسِ",
    urduName: "پارہ ۱۷: اقترب للناس",
    romanName: "Iqtaraba Lin Nasi",
    startSurah: 21,
    startAyah: 1,
    endSurah: 22,
    endAyah: 78,
    totalAyahs: 190,
    surahNumbers: [21, 22]
  },
  {
    number: 18,
    arabicName: "قَدْ أَفْلَحَ",
    urduName: "پارہ ۱۸: قد افلح",
    romanName: "Qad Aflaha",
    startSurah: 23,
    startAyah: 1,
    endSurah: 25,
    endAyah: 20,
    totalAyahs: 202,
    surahNumbers: [23, 24, 25]
  },
  {
    number: 19,
    arabicName: "وَقَالَ الَّذِينَ",
    urduName: "پارہ ۱۹: وقال الذین",
    romanName: "Wa Qalallazina",
    startSurah: 25,
    startAyah: 21,
    endSurah: 27,
    endAyah: 59,
    totalAyahs: 343,
    surahNumbers: [25, 26, 27]
  },
  {
    number: 20,
    arabicName: "أَمَّنْ خَلَقَ",
    urduName: "پارہ ۲۰: امن خلق",
    romanName: "Amman Khalaqa",
    startSurah: 27,
    startAyah: 60,
    endSurah: 29,
    endAyah: 44,
    totalAyahs: 171,
    surahNumbers: [27, 28, 29]
  },
  {
    number: 21,
    arabicName: "اتْلُ مَا أُوحِيَ",
    urduName: "پارہ ۲۱: اتل ما اوحی",
    romanName: "Utlu Ma Oohiya",
    startSurah: 29,
    startAyah: 45,
    endSurah: 33,
    endAyah: 30,
    totalAyahs: 179,
    surahNumbers: [29, 30, 31, 32, 33]
  },
  {
    number: 22,
    arabicName: "وَمَنْ يَّقْنُتْ",
    urduName: "پارہ ۲۲: ومن یقنت",
    romanName: "Wa Manyaqnut",
    startSurah: 33,
    startAyah: 31,
    endSurah: 36,
    endAyah: 27,
    totalAyahs: 169,
    surahNumbers: [33, 34, 35, 36]
  },
  {
    number: 23,
    arabicName: "وَمَا لِيَ",
    urduName: "پارہ ۲۳: وما لی",
    romanName: "Wa Maliya",
    startSurah: 36,
    startAyah: 28,
    endSurah: 39,
    endAyah: 31,
    totalAyahs: 357,
    surahNumbers: [36, 37, 38, 39]
  },
  {
    number: 24,
    arabicName: "فَمَنْ أَظْلَمُ",
    urduName: "پارہ ۲۴: فمن اظلم",
    romanName: "Faman Azlamu",
    startSurah: 39,
    startAyah: 32,
    endSurah: 41,
    endAyah: 46,
    totalAyahs: 175,
    surahNumbers: [39, 40, 41]
  },
  {
    number: 25,
    arabicName: "إِلَيْهِ يُرَدُّ",
    urduName: "پارہ ۲۵: الیہ یرد",
    romanName: "Ilayhi Yuraddu",
    startSurah: 41,
    startAyah: 47,
    endSurah: 45,
    endAyah: 37,
    totalAyahs: 246,
    surahNumbers: [41, 42, 43, 44, 45]
  },
  {
    number: 26,
    arabicName: "حـم (حمٓ)",
    urduName: "پارہ ۲۶: حٰمٓ",
    romanName: "Ha-Meem",
    startSurah: 46,
    startAyah: 1,
    endSurah: 51,
    endAyah: 30,
    totalAyahs: 195,
    surahNumbers: [46, 47, 48, 49, 50, 51]
  },
  {
    number: 27,
    arabicName: "قَالَ فَمَا خَطْبُكُمْ",
    urduName: "پارہ ۲۷: قال فما خطبکم",
    romanName: "Qala Fama Khatbukum",
    startSurah: 51,
    startAyah: 31,
    endSurah: 57,
    endAyah: 29,
    totalAyahs: 399,
    surahNumbers: [51, 52, 53, 54, 55, 56, 57]
  },
  {
    number: 28,
    arabicName: "قَدْ سَمِعَ اللَّهُ",
    urduName: "پارہ ۲۸: قد سمع اللہ",
    romanName: "Qad Sami'allah",
    startSurah: 58,
    startAyah: 1,
    endSurah: 66,
    endAyah: 12,
    totalAyahs: 137,
    surahNumbers: [58, 59, 60, 61, 62, 63, 64, 65, 66]
  },
  {
    number: 29,
    arabicName: "تَبَارَكَ الَّذِي",
    urduName: "پارہ ۲۹: تبارک الذی",
    romanName: "Tabarakallazi",
    startSurah: 67,
    startAyah: 1,
    endSurah: 77,
    endAyah: 50,
    totalAyahs: 431,
    surahNumbers: [67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77]
  },
  {
    number: 30,
    arabicName: "عَمَّ يَتَسَاءَلُونَ",
    urduName: "پارہ ۳۰: عمّ یتساءلون",
    romanName: "Amma Yatasa'aloon",
    startSurah: 78,
    startAyah: 1,
    endSurah: 114,
    endAyah: 6,
    totalAyahs: 564,
    surahNumbers: Array.from({ length: 37 }, (_, i) => 78 + i)
  }
];

// Complete 114 Surahs Directory with precise details
export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, name: "سُورَةُ ٱلْفَاتِحَةِ", englishName: "Al-Fatihah", urduName: "سورۃ الفاتحہ", totalAyahs: 7, type: 'مكية', hasBismillah: false, juzNumbers: [1] },
  { number: 2, name: "سُورَةُ البَقَرَةِ", englishName: "Al-Baqarah", urduName: "سورۃ البقرہ", totalAyahs: 286, type: 'مدنية', hasBismillah: true, juzNumbers: [1, 2, 3] },
  { number: 3, name: "سُورَةُ آلِ عِمْرَانَ", englishName: "Ali 'Imran", urduName: "سورۃ آل عمران", totalAyahs: 200, type: 'مدنية', hasBismillah: true, juzNumbers: [3, 4] },
  { number: 4, name: "سُورَةُ النِّسَاءِ", englishName: "An-Nisa", urduName: "سورۃ النساء", totalAyahs: 176, type: 'مدنية', hasBismillah: true, juzNumbers: [4, 5, 6] },
  { number: 5, name: "سُورَةُ المَائِدَةِ", englishName: "Al-Ma'idah", urduName: "سورۃ المائدہ", totalAyahs: 120, type: 'مدنية', hasBismillah: true, juzNumbers: [6, 7] },
  { number: 6, name: "سُورَةُ الأَنْعَامِ", englishName: "Al-An'am", urduName: "سورۃ الانعام", totalAyahs: 165, type: 'مكية', hasBismillah: true, juzNumbers: [7, 8] },
  { number: 7, name: "سُورَةُ الأَعْرَافِ", englishName: "Al-A'raf", urduName: "سورۃ الاعراف", totalAyahs: 206, type: 'مكية', hasBismillah: true, juzNumbers: [8, 9] },
  { number: 8, name: "سُورَةُ الأَنْفَالِ", englishName: "Al-Anfal", urduName: "سورۃ الانفال", totalAyahs: 75, type: 'مدنية', hasBismillah: true, juzNumbers: [9, 10] },
  { number: 9, name: "سُورَةُ التَّوْبَةِ", englishName: "At-Tawbah", urduName: "سورۃ التوبہ", totalAyahs: 129, type: 'مدنية', hasBismillah: false, juzNumbers: [10, 11] },
  { number: 10, name: "سُورَةُ يُونُسَ", englishName: "Yunus", urduName: "سورۃ یونس", totalAyahs: 109, type: 'مكية', hasBismillah: true, juzNumbers: [11] },
  { number: 11, name: "سُورَةُ هُودٍ", englishName: "Hud", urduName: "سورۃ ہود", totalAyahs: 123, type: 'مكية', hasBismillah: true, juzNumbers: [11, 12] },
  { number: 12, name: "سُورَةُ يُوسُفَ", englishName: "Yusuf", urduName: "سورۃ یوسف", totalAyahs: 111, type: 'مكية', hasBismillah: true, juzNumbers: [12, 13] },
  { number: 13, name: "سُورَةُ الرَّعْدِ", englishName: "Ar-Ra'd", urduName: "سورۃ الرعد", totalAyahs: 43, type: 'مدنية', hasBismillah: true, juzNumbers: [13] },
  { number: 14, name: "سُورَةُ إِبْرَاهِيمَ", englishName: "Ibrahim", urduName: "سورۃ ابراہیم", totalAyahs: 52, type: 'مكية', hasBismillah: true, juzNumbers: [13] },
  { number: 15, name: "سُورَةُ الحِجْرِ", englishName: "Al-Hijr", urduName: "سورۃ الحجر", totalAyahs: 99, type: 'مكية', hasBismillah: true, juzNumbers: [14] },
  { number: 16, name: "سُورَةُ النَّحْلِ", englishName: "An-Nahl", urduName: "سورۃ النحل", totalAyahs: 128, type: 'مكية', hasBismillah: true, juzNumbers: [14] },
  { number: 17, name: "سُورَةُ الإِسْرَاءِ", englishName: "Al-Isra", urduName: "سورۃ الاسراء (بنی اسرائیل)", totalAyahs: 111, type: 'مكية', hasBismillah: true, juzNumbers: [15] },
  { number: 18, name: "سُورَةُ الكَهْفِ", englishName: "Al-Kahf", urduName: "سورۃ الکہف", totalAyahs: 110, type: 'مكية', hasBismillah: true, juzNumbers: [15, 16] },
  { number: 19, name: "سُورَةُ مَرْيَمَ", englishName: "Maryam", urduName: "سورۃ مریم", totalAyahs: 98, type: 'مكية', hasBismillah: true, juzNumbers: [16] },
  { number: 20, name: "سُورَةُ طٰهٰ", englishName: "Ta-Ha", urduName: "سورۃ طٰہٰ", totalAyahs: 135, type: 'مكية', hasBismillah: true, juzNumbers: [16] },
  { number: 21, name: "سُورَةُ الأَنْبِيَاءِ", englishName: "Al-Anbiya", urduName: "سورۃ الانبیاء", totalAyahs: 112, type: 'مكية', hasBismillah: true, juzNumbers: [17] },
  { number: 22, name: "سُورَةُ الحَجِّ", englishName: "Al-Hajj", urduName: "سورۃ الحج", totalAyahs: 78, type: 'مدنية', hasBismillah: true, juzNumbers: [17] },
  { number: 23, name: "سُورَةُ المُؤْمِنُونَ", englishName: "Al-Mu'minun", urduName: "سورۃ المؤمنون", totalAyahs: 118, type: 'مكية', hasBismillah: true, juzNumbers: [18] },
  { number: 24, name: "سُورَةُ النُّورِ", englishName: "An-Nur", urduName: "سورۃ النور", totalAyahs: 64, type: 'مدنية', hasBismillah: true, juzNumbers: [18] },
  { number: 25, name: "سُورَةُ الفُرْقَانِ", englishName: "Al-Furqan", urduName: "سورۃ الفرقان", totalAyahs: 77, type: 'مكية', hasBismillah: true, juzNumbers: [18, 19] },
  { number: 26, name: "سُورَةُ الشُّعَرَاءِ", englishName: "Ash-Shu'ara", urduName: "سورۃ الشعراء", totalAyahs: 227, type: 'مكية', hasBismillah: true, juzNumbers: [19] },
  { number: 27, name: "سُورَةُ النَّمْلِ", englishName: "An-Naml", urduName: "سورۃ النمل", totalAyahs: 93, type: 'مكية', hasBismillah: true, juzNumbers: [19, 20] },
  { number: 28, name: "سُورَةُ القَصَصِ", englishName: "Al-Qasas", urduName: "سورۃ القصص", totalAyahs: 88, type: 'مكية', hasBismillah: true, juzNumbers: [20] },
  { number: 29, name: "سُورَةُ العَنْكَبُوتِ", englishName: "Al-'Ankabut", urduName: "سورۃ العنکبوت", totalAyahs: 69, type: 'مكية', hasBismillah: true, juzNumbers: [20, 21] },
  { number: 30, name: "سُورَةُ الرُّومِ", englishName: "Ar-Rum", urduName: "سورۃ الروم", totalAyahs: 60, type: 'مكية', hasBismillah: true, juzNumbers: [21] },
  { number: 31, name: "سُورَةُ لُقْمَانَ", englishName: "Luqman", urduName: "سورۃ لقمان", totalAyahs: 34, type: 'مكية', hasBismillah: true, juzNumbers: [21] },
  { number: 32, name: "سُورَةُ السَّجْدَةِ", englishName: "As-Sajdah", urduName: "سورۃ السجدہ", totalAyahs: 30, type: 'مكية', hasBismillah: true, juzNumbers: [21] },
  { number: 33, name: "سُورَةُ الأَحْزَابِ", englishName: "Al-Ahzab", urduName: "سورۃ الاحزاب", totalAyahs: 73, type: 'مدنية', hasBismillah: true, juzNumbers: [21, 22] },
  { number: 34, name: "سُورَةُ سَبَإٍ", englishName: "Saba", urduName: "سورۃ سبا", totalAyahs: 54, type: 'مكية', hasBismillah: true, juzNumbers: [22] },
  { number: 35, name: "سُورَةُ فَاطِرٍ", englishName: "Fatir", urduName: "سورۃ فاطر", totalAyahs: 45, type: 'مكية', hasBismillah: true, juzNumbers: [22] },
  { number: 36, name: "سُورَةُ يٰسٓ", englishName: "Ya-Seen", urduName: "سورۃ یٰسٓ (قلب القرآن)", totalAyahs: 83, type: 'مكية', hasBismillah: true, juzNumbers: [22, 23] },
  { number: 37, name: "سُورَةُ الصَّافَّاتِ", englishName: "As-Saffat", urduName: "سورۃ الصافات", totalAyahs: 182, type: 'مكية', hasBismillah: true, juzNumbers: [23] },
  { number: 38, name: "سُورَةُ صٓ", englishName: "Sad", urduName: "سورۃ صٓ", totalAyahs: 88, type: 'مكية', hasBismillah: true, juzNumbers: [23] },
  { number: 39, name: "سُورَةُ الزُّمَرِ", englishName: "Az-Zumar", urduName: "سورۃ الزمر", totalAyahs: 75, type: 'مكية', hasBismillah: true, juzNumbers: [23, 24] },
  { number: 40, name: "سُورَةُ غَافِرٍ", englishName: "Ghafir", urduName: "سورۃ غافر (المؤمن)", totalAyahs: 85, type: 'مكية', hasBismillah: true, juzNumbers: [24] },
  { number: 41, name: "سُورَةُ فُصِّلَتْ", englishName: "Fussilat", urduName: "سورۃ فصلت (حم سجدہ)", totalAyahs: 54, type: 'مكية', hasBismillah: true, juzNumbers: [24, 25] },
  { number: 42, name: "سُورَةُ الشُّورَىٰ", englishName: "Ash-Shura", urduName: "سورۃ الشوریٰ", totalAyahs: 53, type: 'مكية', hasBismillah: true, juzNumbers: [25] },
  { number: 43, name: "سُورَةُ الزُّخْرُفِ", englishName: "Az-Zukhruf", urduName: "سورۃ الزخرف", totalAyahs: 89, type: 'مكية', hasBismillah: true, juzNumbers: [25] },
  { number: 44, name: "سُورَةُ الدُّخَانِ", englishName: "Ad-Dukhan", urduName: "سورۃ الدخان", totalAyahs: 59, type: 'مكية', hasBismillah: true, juzNumbers: [25] },
  { number: 45, name: "سُورَةُ الجَاثِيَةِ", englishName: "Al-Jathiyah", urduName: "سورۃ الجاثیہ", totalAyahs: 37, type: 'مكية', hasBismillah: true, juzNumbers: [25] },
  { number: 46, name: "سُورَةُ الأَحْقَافِ", englishName: "Al-Ahqaf", urduName: "سورۃ الاحقاف", totalAyahs: 35, type: 'مكية', hasBismillah: true, juzNumbers: [26] },
  { number: 47, name: "سُورَةُ مُحَمَّدٍ", englishName: "Muhammad", urduName: "سورۃ محمد ﷺ", totalAyahs: 38, type: 'مدنية', hasBismillah: true, juzNumbers: [26] },
  { number: 48, name: "سُورَةُ الفَتْحِ", englishName: "Al-Fath", urduName: "سورۃ الفتح", totalAyahs: 29, type: 'مدنية', hasBismillah: true, juzNumbers: [26] },
  { number: 49, name: "سُورَةُ الحُجُرَاتِ", englishName: "Al-Hujurat", urduName: "سورۃ الحجرات", totalAyahs: 18, type: 'مدنية', hasBismillah: true, juzNumbers: [26] },
  { number: 50, name: "سُورَةُ قٓ", englishName: "Qaf", urduName: "سورۃ قٓ", totalAyahs: 45, type: 'مكية', hasBismillah: true, juzNumbers: [26] },
  { number: 51, name: "سُورَةُ الذَّارِيَاتِ", englishName: "Adh-Dhariyat", urduName: "سورۃ الذاریات", totalAyahs: 60, type: 'مكية', hasBismillah: true, juzNumbers: [26, 27] },
  { number: 52, name: "سُورَةُ الطُّورِ", englishName: "At-Tur", urduName: "سورۃ الطور", totalAyahs: 49, type: 'مكية', hasBismillah: true, juzNumbers: [27] },
  { number: 53, name: "سُورَةُ النَّجْمِ", englishName: "An-Najm", urduName: "سورۃ النجم", totalAyahs: 62, type: 'مكية', hasBismillah: true, juzNumbers: [27] },
  { number: 54, name: "سُورَةُ القَمَرِ", englishName: "Al-Qamar", urduName: "سورۃ القمر", totalAyahs: 55, type: 'مكية', hasBismillah: true, juzNumbers: [27] },
  { number: 55, name: "سُورَةُ الرَّحْمَٰنِ", englishName: "Ar-Rahman", urduName: "سورۃ الرحمن (عروس القرآن)", totalAyahs: 78, type: 'مدنية', hasBismillah: true, juzNumbers: [27] },
  { number: 56, name: "سُورَةُ الوَاقِعَةِ", englishName: "Al-Waqi'ah", urduName: "سورۃ الواقعہ", totalAyahs: 96, type: 'مكية', hasBismillah: true, juzNumbers: [27] },
  { number: 57, name: "سُورَةُ الحَدِيدِ", englishName: "Al-Hadid", urduName: "سورۃ الحدید", totalAyahs: 29, type: 'مدنية', hasBismillah: true, juzNumbers: [27] },
  { number: 58, name: "سُورَةُ المُجَادِلَةِ", englishName: "Al-Mujadila", urduName: "سورۃ المجادلہ", totalAyahs: 22, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 59, name: "سُورَةُ الحَشْرِ", englishName: "Al-Hashr", urduName: "سورۃ الحشر", totalAyahs: 24, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 60, name: "سُورَةُ المُمْتَحَنَةِ", englishName: "Al-Mumtahanah", urduName: "سورۃ الممتحنہ", totalAyahs: 13, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 61, name: "سُورَةُ الصَّفِّ", englishName: "As-Saff", urduName: "سورۃ الصف", totalAyahs: 14, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 62, name: "سُورَةُ الجُمُعَةِ", englishName: "Al-Jumu'ah", urduName: "سورۃ الجمعہ", totalAyahs: 11, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 63, name: "سُورَةُ المُنَافِقُونَ", englishName: "Al-Munafiqun", urduName: "سورۃ المنافقون", totalAyahs: 11, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 64, name: "سُورَةُ التَّغَابُنِ", englishName: "At-Taghabun", urduName: "سورۃ التغابن", totalAyahs: 18, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 65, name: "سُورَةُ الطَّلَاقِ", englishName: "At-Talaq", urduName: "سورۃ الطلاق", totalAyahs: 12, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 66, name: "سُورَةُ التَّحْرِيمِ", englishName: "At-Tahrim", urduName: "سورۃ التحریم", totalAyahs: 12, type: 'مدنية', hasBismillah: true, juzNumbers: [28] },
  { number: 67, name: "سُورَةُ المُلْكِ", englishName: "Al-Mulk", urduName: "سورۃ الملک (تبارک الذی)", totalAyahs: 30, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 68, name: "سُورَةُ القَلَمِ", englishName: "Al-Qalam", urduName: "سورۃ القلم (نٓ)", totalAyahs: 52, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 69, name: "سُورَةُ الحَاقَّةِ", englishName: "Al-Haqqah", urduName: "سورۃ الحاقہ", totalAyahs: 52, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 70, name: "سُورَةُ المَعَارِجِ", englishName: "Al-Ma'arij", urduName: "سورۃ المعارج", totalAyahs: 44, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 71, name: "سُورَةُ نُوحٍ", englishName: "Nuh", urduName: "سورۃ نوح", totalAyahs: 28, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 72, name: "سُورَةُ الجِنِّ", englishName: "Al-Jinn", urduName: "سورۃ الجن", totalAyahs: 28, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 73, name: "سُورَةُ المُزَّمِّلِ", englishName: "Al-Muzzammil", urduName: "سورۃ المزمل", totalAyahs: 20, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 74, name: "سُورَةُ المُدَّثِّرِ", englishName: "Al-Muddaththir", urduName: "سورۃ المدثر", totalAyahs: 56, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 75, name: "سُورَةُ القِيَامَةِ", englishName: "Al-Qiyamah", urduName: "سورۃ القیامہ", totalAyahs: 40, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 76, name: "سُورَةُ الإِنْسَانِ", englishName: "Al-Insan", urduName: "سورۃ الدھر (الانسان)", totalAyahs: 31, type: 'مدنية', hasBismillah: true, juzNumbers: [29] },
  { number: 77, name: "سُورَةُ المُرْسَلَاتِ", englishName: "Al-Mursalat", urduName: "سورۃ المرسلات", totalAyahs: 50, type: 'مكية', hasBismillah: true, juzNumbers: [29] },
  { number: 78, name: "سُورَةُ النَّبَإِ", englishName: "An-Naba", urduName: "سورۃ النبأ (عمّ)", totalAyahs: 40, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 79, name: "سُورَةُ النَّازِعَاتِ", englishName: "An-Nazi'at", urduName: "سورۃ النازعات", totalAyahs: 46, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 80, name: "سُورَةُ عَبَسَ", englishName: "'Abasa", urduName: "سورۃ عبس", totalAyahs: 42, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 81, name: "سُورَةُ التَّكْوِيرِ", englishName: "At-Takwir", urduName: "سورۃ التکویر", totalAyahs: 29, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 82, name: "سُورَةُ الإِنْفِطَارِ", englishName: "Al-Infitar", urduName: "سورۃ الانفطار", totalAyahs: 19, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 83, name: "سُورَةُ المُطَفِّفِينَ", englishName: "Al-Mutaffifin", urduName: "سورۃ المطففین", totalAyahs: 36, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 84, name: "سُورَةُ الإِنْشِقَاقِ", englishName: "Al-Inshiqaq", urduName: "سورۃ الانشقاق", totalAyahs: 25, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 85, name: "سُورَةُ البُرُوجِ", englishName: "Al-Buruj", urduName: "سورۃ البروج", totalAyahs: 22, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 86, name: "سُورَةُ الطَّارِقِ", englishName: "At-Tariq", urduName: "سورۃ الطارق", totalAyahs: 17, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 87, name: "سُورَةُ الأَعْلَىٰ", englishName: "Al-A'la", urduName: "سورۃ الاعلیٰ", totalAyahs: 19, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 88, name: "سُورَةُ الغَاشِيَةِ", englishName: "Al-Ghashiyah", urduName: "سورۃ الغاشیہ", totalAyahs: 26, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 89, name: "سُورَةُ الفَجْرِ", englishName: "Al-Fajr", urduName: "سورۃ الفجر", totalAyahs: 30, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 90, name: "سُورَةُ البَلَدِ", englishName: "Al-Balad", urduName: "سورۃ البلد", totalAyahs: 20, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 91, name: "سُورَةُ الشَّمْسِ", englishName: "Ash-Shams", urduName: "سورۃ الشمس", totalAyahs: 15, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 92, name: "سُورَةُ اللَّيْلِ", englishName: "Al-Layl", urduName: "سورۃ اللیل", totalAyahs: 21, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 93, name: "سُورَةُ الضُّحَىٰ", englishName: "Ad-Duha", urduName: "سورۃ الضحیٰ", totalAyahs: 11, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 94, name: "سُورَةُ الشَّرْحِ", englishName: "Ash-Sharh", urduName: "سورۃ الشرح (الم نشرح)", totalAyahs: 8, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 95, name: "سُورَةُ التِّينِ", englishName: "At-Tin", urduName: "سورۃ التین", totalAyahs: 8, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 96, name: "سُورَةُ العَلَقِ", englishName: "Al-'Alaq", urduName: "سورۃ العلق (اقرأ)", totalAyahs: 19, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 97, name: "سُورَةُ القَدْرِ", englishName: "Al-Qadr", urduName: "سورۃ القدر", totalAyahs: 5, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 98, name: "سُورَةُ البَيِّنَةِ", englishName: "Al-Bayyinah", urduName: "سورۃ البینہ", totalAyahs: 8, type: 'مدنية', hasBismillah: true, juzNumbers: [30] },
  { number: 99, name: "سُورَةُ الزَّلْزَلَةِ", englishName: "Az-Zalzalah", urduName: "سورۃ الزلزال", totalAyahs: 8, type: 'مدنية', hasBismillah: true, juzNumbers: [30] },
  { number: 100, name: "سُورَةُ العَادِيَاتِ", englishName: "Al-'Adiyat", urduName: "سورۃ العادیات", totalAyahs: 11, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 101, name: "سُورَةُ القَارِعَةِ", englishName: "Al-Qari'ah", urduName: "سورۃ القارعہ", totalAyahs: 11, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 102, name: "سُورَةُ التَّكَاثُرِ", englishName: "At-Takathur", urduName: "سورۃ التکاثر", totalAyahs: 8, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 103, name: "سُورَةُ العَصْرِ", englishName: "Al-'Asr", urduName: "سورۃ العصر", totalAyahs: 3, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 104, name: "سُورَةُ الهُمَزَةِ", englishName: "Al-Humazah", urduName: "سورۃ الہمزہ", totalAyahs: 9, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 105, name: "سُورَةُ الفِيلِ", englishName: "Al-Fil", urduName: "سورۃ الفیل", totalAyahs: 5, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 106, name: "سُورَةُ قُرَيْشٍ", englishName: "Quraysh", urduName: "سورۃ قریش", totalAyahs: 4, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 107, name: "سُورَةُ المَاعُونَ", englishName: "Al-Ma'un", urduName: "سورۃ الماعون", totalAyahs: 7, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 108, name: "سُورَةُ الكَوْثَرِ", englishName: "Al-Kawthar", urduName: "سورۃ الکوثر", totalAyahs: 3, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 109, name: "سُورَةُ الكَافِرُونَ", englishName: "Al-Kafirun", urduName: "سورۃ الکافرون", totalAyahs: 6, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 110, name: "سُورَةُ النَّصْرِ", englishName: "An-Nasr", urduName: "سورۃ النصر (اذا جاء)", totalAyahs: 3, type: 'مدنية', hasBismillah: true, juzNumbers: [30] },
  { number: 111, name: "سُورَةُ المَسَدِ", englishName: "Al-Masad", urduName: "سورۃ المسد (لہب)", totalAyahs: 5, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 112, name: "سُورَةُ الإِخْلَاصِ", englishName: "Al-Ikhlas", urduName: "سورۃ الاخلاص", totalAyahs: 4, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 113, name: "سُورَةُ الفَلَقِ", englishName: "Al-Falaq", urduName: "سورۃ الفلق", totalAyahs: 5, type: 'مكية', hasBismillah: true, juzNumbers: [30] },
  { number: 114, name: "سُورَةُ النَّاسِ", englishName: "An-Nas", urduName: "سورۃ الناس", totalAyahs: 6, type: 'مكية', hasBismillah: true, juzNumbers: [30] }
];

/**
 * Get Surahs belonging to a specific Juz / Para number
 */
export function getSurahsForJuz(juzNumber: number): SurahMeta[] {
  const para = ALL_30_PARAS.find((p) => p.number === juzNumber);
  if (!para) return [];
  return ALL_114_SURAHS.filter((s) => para.surahNumbers.includes(s.number));
}

/**
 * For a given Para and Surah, get the exact range of Ayahs belonging to that Para
 */
export function getParaAyahRange(
  paraNumber: number,
  surahNumber: number
): { startAyah: number; endAyah: number; totalAyahsInPara: number } | null {
  const para = ALL_30_PARAS.find((p) => p.number === paraNumber);
  if (!para || !para.surahNumbers.includes(surahNumber)) return null;

  const surahMeta = ALL_114_SURAHS.find((s) => s.number === surahNumber);
  const totalInSurah = surahMeta ? surahMeta.totalAyahs : 286;

  let startAyah = 1;
  let endAyah = totalInSurah;

  if (surahNumber === para.startSurah) {
    startAyah = para.startAyah;
  }
  if (surahNumber === para.endSurah) {
    endAyah = para.endAyah;
  }

  return {
    startAyah,
    endAyah,
    totalAyahsInPara: Math.max(1, endAyah - startAyah + 1)
  };
}

