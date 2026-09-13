// High-Quality Qari Audio Service for Madani Qaida & Quran Learning
// Prioritizes natural Qari voices, Sheikh Mishary Rashid Alafasy recordings, and AlQuran Cloud APIs

import { PARA_30_SURAHS } from '../data/para30Surahs';
import { WAQF_ITEMS, NOON_QUTNI_ITEMS } from '../data/waqfData';
import { ALL_MUTAFARRIQ_ITEMS } from '../data/mutafarriqQawaidData';

export interface QariVoiceOption {
  id: string;
  name: string;
  qariNameUrdu: string;
  folder: string;
}

export const QARI_VOICES: QariVoiceOption[] = [
  { 
    id: 'sudais', 
    name: 'Abdurrahman As-Sudais & Saud Ash-Shuraim', 
    qariNameUrdu: 'الشيخ عبد الرحمن السديس والشريم (تراويح الحرم المكي 192kbps)', 
    folder: 'Abdurrahmaan_As-Sudais_192kbps' 
  },
  { 
    id: 'alafasy', 
    name: 'Mishary Rashid Alafasy', 
    qariNameUrdu: 'الشيخ مشاري راشد العفاسي (الكويت - أستوديو 128kbps)', 
    folder: 'Alafasy_128kbps' 
  },
  { 
    id: 'husary', 
    name: 'Mahmoud Khalil Al-Husary (Muallim)', 
    qariNameUrdu: 'الشيخ محمود خليل الحصري (معلم تجويد القرآن)', 
    folder: 'Husary_128kbps' 
  },
  { 
    id: 'minshawi', 
    name: 'Mohamed Siddiq Al-Minshawi', 
    qariNameUrdu: 'الشيخ محمد صديق المنشاوی (ترتيل وتجويد مصري)', 
    folder: 'Minshawy_Murattal_128kbps' 
  },
  { 
    id: 'abdulbasit', 
    name: 'Abdul Basit Abdul Samad', 
    qariNameUrdu: 'الشيخ عبد الباسط عبد الصمد (تجويد وترتيل 192kbps)', 
    folder: 'Abdul_Basit_Murattal_192kbps' 
  },
  { 
    id: 'shuraym', 
    name: 'Saud Al-Shuraim', 
    qariNameUrdu: 'الشيخ سعود الشريم (إمام الحرم المكي)', 
    folder: 'Saood_ash-Shuraym_128kbps' 
  },
  { 
    id: 'ghamdi', 
    name: 'Saad Al-Ghamdi', 
    qariNameUrdu: 'الشيخ سعد الغامدي (قراءة مرتلة)', 
    folder: 'Ghamadi_40kbps' 
  },
];

/**
 * Returns accurate reciter attribution for a given Surah.
 * For the Haramain Taraweeh dataset (Abdurrahman As-Sudais & Saud Ash-Shuraim),
 * it precisely indicates whether Sheikh Sudais or Sheikh Shuraim led the recitation.
 */
export const getSurahReciterDetail = (surahNumber: number, voiceId: string): { urdu: string; english: string } => {
  if (voiceId === 'sudais' || voiceId === 'shuraym') {
    // In the classic Makkah Haramain recording, Surahs are divided:
    // Sheikh Sudais: Surahs 1-5, 11-18, 36, 55, 67, 78-114, etc.
    // Sheikh Shuraim: Surahs 6-10, 19-35, 37-54 (including Surah 48 Al-Fath), 56-66, 68-77
    const shuraimSurahs = new Set([
      6, 7, 8, 9, 10,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54,
      56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
      68, 69, 70, 71, 72, 73, 74, 75, 76, 77
    ]);

    if (shuraimSurahs.has(surahNumber)) {
      return {
        urdu: 'الشيخ سعود الشريم (تراويح الحرم المكي)',
        english: 'Sheikh Saud Ash-Shuraim (Makkah Taraweeh)'
      };
    } else {
      return {
        urdu: 'الشيخ عبد الرحمن السديس (تراويح الحرم المكي)',
        english: 'Sheikh Abdurrahman As-Sudais (Makkah Taraweeh)'
      };
    }
  }

  const voice = QARI_VOICES.find(v => v.id === voiceId);
  return {
    urdu: voice?.qariNameUrdu || 'الشيخ مشاري راشد العفاسي',
    english: voice?.name || 'Mishary Rashid Alafasy'
  };
};

let selectedQariId = 'sudais';

export const getSelectedQariVoiceId = (): string => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('selected_qari_voice_id') || selectedQariId;
  }
  return selectedQariId;
};

export const setSelectedQariVoiceId = (id: string): void => {
  selectedQariId = id;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('selected_qari_voice_id', id);
  }
};

let currentAudio: HTMLAudioElement | null = null;
let activeSequenceToken = 0;

export const stopAllQariAudio = () => {
  activeSequenceToken++;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
};

/**
 * Get EveryAyah MP3 URL for selected Qari by Surah and Ayah
 */
export const getAlafasyUrlForSurahAyah = (surah: number, ayah: number, customVoiceId?: string): string => {
  const s = String(surah).padStart(3, '0');
  const a = String(ayah).padStart(3, '0');
  const activeId = customVoiceId || getSelectedQariVoiceId();
  const voice = QARI_VOICES.find((v) => v.id === activeId) || QARI_VOICES[0];
  const server = voice.folder || 'Alafasy_128kbps';
  return `https://everyayah.com/data/${server}/${s}${a}.mp3`;
};

/**
 * Helper to strip diacritics and normalize Arabic/Urdu text for robust matching
 */
export const normalizeArabicForMatching = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove all harakat, sukun, shaddah, superscripts, maddah above (\u0653), hamza above (\u0654)
    .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#\-۝]/g, '') // remove brackets, ayah numbers, end marks, punctuation
    .replace(/آ|أ|إ|ٱ|ا/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ہ|ھ|ۂ|ۃ/g, 'ه') // Normalize Urdu He / Gol He to Arabic He
    .replace(/ى|ی|ئ|ي/g, 'ي') // Normalize Persian/Urdu Yeh to Arabic Yeh
    .replace(/ک|ڪ/g, 'ك') // Normalize Urdu/Persian Kaf to Arabic Kaf
    .replace(/گ/g, 'ك')
    .replace(/ں/g, 'ن') // Noon Ghunnah to Noon
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Dedicated matcher for all 14/16 Quranic Huroof-e-Muqatta'at to their authentic Qari recitation audio URLs
 */
export const getMuqattaatAudioUrls = (text: string, customVoiceId?: string): string[] | null => {
  if (!text) return null;
  const raw = text.trim();
  const normKey = normalizeArabicForMatching(raw);

  // 0. Combined حٰمٓ عٓسٓقٓ (Surah Ash-Shura 42:1 and 42:2) - Plays Ayah 1 (حٰمٓ) followed by Ayah 2 (عٓسٓقٓ)
  if (
    normKey.includes('حم عسق') ||
    normKey.includes('حاميم عين سين قاف') ||
    normKey.includes('حاميم عسق') ||
    normKey.includes('حم عين سين قاف') ||
    (raw.includes('حٰمٓ') && raw.includes('عٓسٓقٓ')) ||
    (raw.includes('حم') && raw.includes('عسق'))
  ) {
    return [
      getAlafasyUrlForSurahAyah(42, 1, customVoiceId),
      getAlafasyUrlForSurahAyah(42, 2, customVoiceId),
    ];
  }

  const singleUrl = getMuqattaatAudioUrl(text, customVoiceId);
  return singleUrl ? [singleUrl] : null;
};

export const getMuqattaatAudioUrl = (text: string, customVoiceId?: string): string | null => {
  if (!text) return null;
  const raw = text.trim();

  // 1. Any text containing short vowel harakat (zabar \u064E, zer \u0650, pesh \u064F) or tanween (\u064B, \u064C, \u064D) or sukun (\u0652)
  // is a regular vocalized letter or word (e.g. صَ, صِ, صُ, قَ, قِ, قُ, نَ, نِ, نُ, خَلَقَ, etc.) and MUST NEVER match Muqatta'at.
  if (/[\u064B-\u0652]/.test(raw)) {
    return null;
  }

  // 2. Bare single letters without Maddah (Lesson 1 Mufradat: ص, ق, ن, etc.) are regular alphabet letters, NOT Muqatta'at.
  // Muqatta'at single letters always have Maddah (صٓ, قٓ, نٓ) in Quranic text.
  if (raw === 'ص' || raw === 'ق' || raw === 'ن' || raw === 'صاد' || raw === 'قاف' || raw === 'نون') {
    return null;
  }

  const normKey = normalizeArabicForMatching(raw);

  // 0. Combined حٰمٓ عٓسٓقٓ check fallback
  if (
    normKey.includes('حم عسق') ||
    normKey.includes('حاميم عين سين قاف') ||
    (raw.includes('حٰمٓ') && raw.includes('عٓسٓقٓ'))
  ) {
    return getAlafasyUrlForSurahAyah(42, 1, customVoiceId);
  }

  // 1. صٓ (Surah Sad 38:1) - ONLY match explicit Muqatta'ah with Maddah
  if (raw === 'صٓ' || raw === 'صَآدْ' || raw.includes('صٓ') || normKey === 'صاد مد' || normKey === 'صاد مد لازم') {
    return getAlafasyUrlForSurahAyah(38, 1, customVoiceId);
  }
  // 2. قٓ (Surah Qaf 50:1) - ONLY match explicit Muqatta'ah with Maddah
  if (raw === 'قٓ' || raw === 'قَآفْ' || raw.includes('قٓ') || normKey === 'قاف مد' || normKey === 'قاف مد لازم') {
    return getAlafasyUrlForSurahAyah(50, 1, customVoiceId);
  }
  // 3. نٓ (Surah Al-Qalam 68:1) - ONLY match explicit Muqatta'ah with Maddah
  if (raw === 'نٓ' || raw === 'نُوْنْ' || raw.includes('نٓ') || normKey === 'نون مد' || normKey === 'نون مد لازم') {
    return getAlafasyUrlForSurahAyah(68, 1, customVoiceId);
  }
  // 4. طٰہٰ / طه (Surah Ta-Ha 20:1)
  if (normKey === 'طه' || normKey === 'طاها' || normKey === 'طاه' || raw.includes('طٰہٰ') || raw.includes('طٰهٰ') || raw === 'طَاہَا') {
    return getAlafasyUrlForSurahAyah(20, 1, customVoiceId);
  }
  // 5. یٰسٓ / يس (Surah Ya-Sin 36:1)
  if (normKey === 'يس' || normKey === 'ياسين' || normKey === 'ياسي' || raw.includes('یٰسٓ') || raw.includes('يٰسٓ') || raw === 'یَاسِیْنْ') {
    return getAlafasyUrlForSurahAyah(36, 1, customVoiceId);
  }
  // 6. طٰسٓ / طس (Surah An-Naml 27:1)
  if (normKey === 'طس' || normKey === 'طاسين' || normKey === 'طاسي' || raw === 'طٰسٓ' || raw === 'طَاسِیْنْ') {
    return getAlafasyUrlForSurahAyah(27, 1, customVoiceId);
  }
  // 7. حٰمٓ / حم (Surah Ghafir 40:1, Fussilat 41:1, etc.)
  if ((normKey === 'حم' || normKey === 'حاميم' || normKey === 'حامي' || raw === 'حٰمٓ' || raw === 'حَامِیْمْ') && !normKey.includes('عسق') && !raw.includes('عٓسٓقٓ')) {
    return getAlafasyUrlForSurahAyah(40, 1, customVoiceId);
  }
  // 8. الٓرٰ / الر (Surah Yunus 10:1, Hud 11:1, Yusuf 12:1, Ibrahim 14:1, Al-Hijr 15:1)
  if (normKey === 'الر' || normKey === 'الف لام را' || normKey === 'الف لام ر' || raw.includes('الٓرٰ') || raw === 'اَلِفْ لَامْ رَا') {
    return getAlafasyUrlForSurahAyah(10, 1, customVoiceId);
  }
  // 9. الٓمٰرٰ / المر (Surah Ar-Ra'd 13:1)
  if (normKey === 'المر' || normKey === 'الف لام ميم را' || normKey === 'الف لام ميم ر' || raw.includes('الٓمٰرٰ') || raw.includes('الٓمٓرٰ') || raw === 'اَلِفْ لَامْ مِیْمْ رَا') {
    return getAlafasyUrlForSurahAyah(13, 1, customVoiceId);
  }
  // 10. عٓسٓقٓ / عسق (Surah Ash-Shura 42:2)
  if ((normKey === 'عسق' || normKey === 'عين سين قاف' || normKey === 'عي سي قا' || raw === 'عٓسٓقٓ' || raw === 'عَیْنْ سِیْنْ قَافْ') && !normKey.includes('حم') && !raw.includes('حٰمٓ')) {
    return getAlafasyUrlForSurahAyah(42, 2, customVoiceId);
  }
  // 11. طٰسٓمٓ / طسم (Surah Ash-Shu'ara 26:1, Al-Qasas 28:1)
  if (normKey === 'طسم' || normKey === 'طاسين ميم' || normKey === 'طاسي ميم' || normKey === 'طاسيم ميم' || raw.includes('طٰسٓمٓ') || raw === 'طَاسِیْنْ مِّیْمْ') {
    return getAlafasyUrlForSurahAyah(26, 1, customVoiceId);
  }
  // 12. الٓمٓصٓ / المص (Surah Al-A'raf 7:1)
  if (normKey === 'المص' || normKey === 'الف لام ميم صاد' || normKey === 'الف لام ميم ص' || raw.includes('الٓمٓصٓ') || raw === 'اَلِفْ لَامْ مِّیْمْ صَادْ') {
    return getAlafasyUrlForSurahAyah(7, 1, customVoiceId);
  }
  // 13. کٓہٰیٰعٓصٓ / كٓهٰيٰعٓصٓ / كهيعص (Surah Maryam 19:1)
  if (normKey === 'كهيعص' || normKey === 'كاف ها يا عين صاد' || normKey === 'كاف ه يا عي صا' || raw.includes('کٓہٰیٰعٓصٓ') || raw.includes('كٓهٰيٰعٓصٓ') || raw === 'کَافْ ہَا یَا عَیْنْ صَادْ') {
    return getAlafasyUrlForSurahAyah(19, 1, customVoiceId);
  }
  // 14. الٓمّٓ اللّٰهُ / الم الله (Surah Aal-e-Imran 3:1)
  if (normKey === 'الم الله' || normKey === 'الف لام ميم الله' || normKey === 'الف لام ميم الل' || raw.includes('الٓمّٓ اللّٰهُ') || raw.includes('الم الله')) {
    return getAlafasyUrlForSurahAyah(3, 1, customVoiceId);
  }
  // 15. الٓمٓ / الم (Surah Al-Baqarah 2:1)
  if (normKey === 'الم' || normKey === 'الف لام ميم' || normKey === 'الف لام م' || raw.includes('الٓمٓ') || raw === 'اَلِفْ لَامْ مِّیْمْ') {
    return getAlafasyUrlForSurahAyah(2, 1, customVoiceId);
  }

  return null;
};

// Dictionary of popular Quranic verses and Ism Jalalah to EveryAyah Alafasy MP3s
const STATIC_ALAFASY_VERSES: Record<string, string> = {
  'الله الصمد': getAlafasyUrlForSurahAyah(112, 2),
  'اسم جلاله': getAlafasyUrlForSurahAyah(112, 2),
  'بسم الله': getAlafasyUrlForSurahAyah(1, 1),
  'بسم الله الرحمن الرحيم': getAlafasyUrlForSurahAyah(1, 1),
  'الحمد لله رب العالمين': getAlafasyUrlForSurahAyah(1, 2),
  'الرحمن الرحيم': getAlafasyUrlForSurahAyah(1, 3),
  'مالك يوم الدين': getAlafasyUrlForSurahAyah(1, 4),
  'اياك نعبد واياك نستعين': getAlafasyUrlForSurahAyah(1, 5),
  'اهدنا الصراط المستقيم': getAlafasyUrlForSurahAyah(1, 6),
  'صراط الذين انعمت عليهم غير المغضوب عليهم ولا الضالين': getAlafasyUrlForSurahAyah(1, 7),

  'قل هو الله احد': getAlafasyUrlForSurahAyah(112, 1),
  'لم يلد ولم يولد': getAlafasyUrlForSurahAyah(112, 3),
  'ولم يكن له كفوا احد': getAlafasyUrlForSurahAyah(112, 4),

  'قل اعوذ برب الفلق': getAlafasyUrlForSurahAyah(113, 1),
  'من شر ما خلق': getAlafasyUrlForSurahAyah(113, 2),
  'ومن شر غاسق اذا وقب': getAlafasyUrlForSurahAyah(113, 3),
  'ومن شر النفاثات في العقد': getAlafasyUrlForSurahAyah(113, 4),
  'ومن شر حاسد اذا حسد': getAlafasyUrlForSurahAyah(113, 5),

  'قل اعوذ برب الناس': getAlafasyUrlForSurahAyah(114, 1),
  'ملك الناس': getAlafasyUrlForSurahAyah(114, 2),
  'اله الناس': getAlafasyUrlForSurahAyah(114, 3),
  'من شر الوسواس الخناس': getAlafasyUrlForSurahAyah(114, 4),
  'الذي يوسوس في صدور الناس': getAlafasyUrlForSurahAyah(114, 5),
  'من الجنة والناس': getAlafasyUrlForSurahAyah(114, 6),

  'انا اعطيناك الكوثر': getAlafasyUrlForSurahAyah(108, 1),
  'فصل لربك وانحر': getAlafasyUrlForSurahAyah(108, 2),
  'ان شانئك هو الابتر': getAlafasyUrlForSurahAyah(108, 3),

  'اذا جاء نصر الله والفتح': getAlafasyUrlForSurahAyah(110, 1),
  'ورايت الناس يدخلون في دين الله افواجا': getAlafasyUrlForSurahAyah(110, 2),
  'فسبح بحمد ربك واستغفره انه كان توابا': getAlafasyUrlForSurahAyah(110, 3),

  'قل يا ايها الكافرون': getAlafasyUrlForSurahAyah(109, 1),
  'لا اعبد ما تعبدون': getAlafasyUrlForSurahAyah(109, 2),
  'ولا انتم عابدون ما اعبد': getAlafasyUrlForSurahAyah(109, 3),
  'ولا انا عابد ما عبدتم': getAlafasyUrlForSurahAyah(109, 4),
  'لكم دينكم ولي دين': getAlafasyUrlForSurahAyah(109, 6),

  'الله لا اله الا هو الحي القيوم': getAlafasyUrlForSurahAyah(2, 255),
  'هو الله الذي لا اله الا هو': getAlafasyUrlForSurahAyah(59, 22),
  'حسبي الله لا اله الا هو عليه توكلت وهو رب العرش العظيم': getAlafasyUrlForSurahAyah(9, 129),
  'سبحان الذي سخر لنا هذا وما كنا له مقرنين وانا الى ربنا لمنقلبون': getAlafasyUrlForSurahAyah(43, 13),
  'بسم الله مجراها ومرساها ان ربي لغفور رحيم': getAlafasyUrlForSurahAyah(11, 41),
  'رب انزلني منزلا مباركا وانت خير المنزلين': getAlafasyUrlForSurahAyah(23, 29),
  'ما شاء الله لا قوة الا بالله': getAlafasyUrlForSurahAyah(18, 39),
  'انا لله وانا اليه راجعون': getAlafasyUrlForSurahAyah(2, 156),
  'منها خلقناكم وفيها نعيدكم ومنها نخرجكم تارة اخرى': getAlafasyUrlForSurahAyah(20, 55),
  'رب زدني علما': getAlafasyUrlForSurahAyah(20, 114),
  'ارايت الذي يكذب بالدين': getAlafasyUrlForSurahAyah(107, 1),
  'لايلاف قريش': getAlafasyUrlForSurahAyah(106, 1),
  'الم تر كيف فعل ربك باصحاب الفيل': getAlafasyUrlForSurahAyah(105, 1),
  'ویل لكل همزة لمزة': getAlafasyUrlForSurahAyah(104, 1),
  'والعصر': getAlafasyUrlForSurahAyah(103, 1),
  'ان الانسان لفي خسر': getAlafasyUrlForSurahAyah(103, 2),
};

/**
 * Searches and returns authentic Qari audio URL for any Quranic text, Muqatta'at, or Ayah reference
 */
export const getAlafasyAudioForText = async (text: string, customVoiceId?: string): Promise<string | null> => {
  if (!text) return null;

  const activeId = customVoiceId || getSelectedQariVoiceId();
  const voice = QARI_VOICES.find((v) => v.id === activeId) || QARI_VOICES[0];

  // 1. Check if text explicitly specifies [Surah:Ayah] like [112:1] or 112:1
  const refMatch = text.match(/\[?(\d{1,3})[:,\/](\d{1,3})\]?/);
  if (refMatch) {
    const surah = parseInt(refMatch[1], 10);
    const ayah = parseInt(refMatch[2], 10);
    if (surah >= 1 && surah <= 114 && ayah >= 1 && ayah <= 286) {
      return getAlafasyUrlForSurahAyah(surah, ayah, activeId);
    }
  }

  // 2. Check if text is one of the 14/16 Quranic Huroof-e-Muqatta'at
  const muqattaatUrl = getMuqattaatAudioUrl(text, activeId);
  if (muqattaatUrl) {
    return muqattaatUrl;
  }

  const normKey = normalizeArabicForMatching(text);

  // If text is a Salam greeting / reply, return null so TTS speaks cleanly
  if (normKey && (normKey.includes('سلام') || normKey.includes('السلام') || normKey.includes('وعليكم'))) {
    return null;
  }

  if (normKey && STATIC_ALAFASY_VERSES[normKey]) {
    const vUrl = STATIC_ALAFASY_VERSES[normKey];
    if (voice && voice.folder) {
      return vUrl.replace(/Alafasy_128kbps|Abdurrahmaan_As-Sudais_192kbps|Minshawy_Murattal_128kbps|Husary_128kbps/, voice.folder);
    }
    return vUrl;
  }

  // Check standalone word for 'الله' or 'اسم جلاله'
  if (normKey === 'الله' || normKey === 'اسم جلاله' || normKey === 'الله الصمد') {
    return getAlafasyUrlForSurahAyah(112, 2, activeId);
  }

  // Check substring matches in static map
  for (const [key, url] of Object.entries(STATIC_ALAFASY_VERSES)) {
    if (key.length >= 6 && normKey.includes(key)) {
      if (voice && voice.folder) {
        return url.replace(/Alafasy_128kbps|Abdurrahmaan_As-Sudais_192kbps|Minshawy_Murattal_128kbps|Husary_128kbps/, voice.folder);
      }
      return url;
    }
  }

  // 3. Search PARA_30_SURAHS database for matching verse text or substring
  if (normKey.length >= 4) {
    for (const surah of PARA_30_SURAHS) {
      for (const v of surah.verses) {
        const normV = normalizeArabicForMatching(v.arabic);
        if (normKey === normV || (normKey.length >= 6 && (normKey.includes(normV) || normV.includes(normKey)))) {
          return getAlafasyUrlForSurahAyah(surah.number, v.number, activeId);
        }
      }
    }
  }

  // 4. Dynamic lookup via AlQuran Cloud API for any Quranic verse
  if (normKey.length >= 8) {
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(normKey)}/all/ar.alafasy`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.code === 200 && data.data?.matches?.length > 0) {
          const m = data.data.matches[0];
          return getAlafasyUrlForSurahAyah(m.surah.number, m.numberInSurah, activeId);
        }
      }
    } catch {
      // Ignore network failures
    }
  }

  return null;
};

/**
 * Get the best available natural Arabic voice installed on the device
 */
export const getBestArabicQariVoice = (): SpeechSynthesisVoice | null => {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  
  const naturalArabicVoice = voices.find(
    (v) =>
      v.lang.startsWith('ar') &&
      (v.name.includes('Natural') ||
       v.name.includes('Google') ||
       v.name.includes('Maged') ||
       v.name.includes('Tarik') ||
       v.name.includes('Saudi') ||
       v.name.includes('Online'))
  );

  if (naturalArabicVoice) return naturalArabicVoice;
  return voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('Arabic')) || null;
};

/**
 * Custom user recordings for Huruf-e-Tahajji / Mufradat
 * Uses IndexedDB + In-Memory Map + LocalStorage fallback for high performance and unlimited storage size
 */
const inMemoryHurufAudioMap: Record<string, string> = {};

const DB_NAME = 'HurufAudioDB';
const DB_VERSION = 1;
const STORE_NAME = 'huruf_recordings';

const getIDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject('IndexedDB not supported');
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const initCustomHurufAudioStore = async () => {
  try {
    // 1. Synchronous fallback from LocalStorage
    if (typeof localStorage !== 'undefined') {
      const lsMap = localStorage.getItem('custom_huruf_audio_map');
      if (lsMap) {
        const parsed = JSON.parse(lsMap);
        Object.assign(inMemoryHurufAudioMap, parsed);
      }
    }

    // 2. Load all records from IndexedDB
    const db = await getIDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getAllReq = store.openCursor();

    getAllReq.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        if (cursor.key && cursor.value) {
          inMemoryHurufAudioMap[cursor.key as string] = cursor.value;
        }
        cursor.continue();
      }
    };
  } catch (err) {
    console.warn("IndexedDB load info:", err);
  }
};

export const clearAllCustomHurufRecordings = () => {
  for (const k of Object.keys(inMemoryHurufAudioMap)) {
    delete inMemoryHurufAudioMap[k];
  }

  getIDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
  }).catch(() => {});

  try {
    localStorage.removeItem('custom_huruf_audio_map');
  } catch {}
};

// Custom recordings preserved across reloads

export const getAllCustomHurufRecordings = (): Record<string, string> => {
  // Sync with LocalStorage if present
  try {
    if (typeof localStorage !== 'undefined') {
      const lsMap = localStorage.getItem('custom_huruf_audio_map');
      if (lsMap) {
        const parsed = JSON.parse(lsMap);
        Object.assign(inMemoryHurufAudioMap, parsed);
      }
    }
  } catch {}
  return { ...inMemoryHurufAudioMap };
};

export const getCustomHurufAudio = (key: string): string | null => {
  if (!key) return null;
  
  const map = getAllCustomHurufRecordings();

  // Direct exact key match
  if (map[key]) return map[key];

  // Normalized key match
  const norm = normalizeArabicForMatching(key);
  if (norm && map[norm]) return map[norm];

  // Fuzzy match across keys
  for (const [k, v] of Object.entries(map)) {
    if (!k || !v) continue;
    if (k === key) return v;
    if (norm && normalizeArabicForMatching(k) === norm) return v;
    if (k.includes(key) || key.includes(k)) return v;
  }

  return null;
};

export const saveCustomHurufAudio = (key: string, dataUrl: string, letter?: string, id?: number | string) => {
  if (!key || !dataUrl) return;

  const normKey = normalizeArabicForMatching(key);
  const normLetter = letter ? normalizeArabicForMatching(letter) : null;

  // 1. Save into in-memory store
  inMemoryHurufAudioMap[key] = dataUrl;
  if (normKey) inMemoryHurufAudioMap[normKey] = dataUrl;

  if (letter) {
    inMemoryHurufAudioMap[letter] = dataUrl;
  }
  if (normLetter) {
    inMemoryHurufAudioMap[normLetter] = dataUrl;
  }
  if (id) {
    inMemoryHurufAudioMap[String(id)] = dataUrl;
  }

  // 2. Persist to IndexedDB (asynchronous, supports large audio files)
  getIDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(dataUrl, key);
    if (normKey) store.put(dataUrl, normKey);
    if (letter) store.put(dataUrl, letter);
    if (normLetter) store.put(dataUrl, normLetter);
    if (id) store.put(dataUrl, String(id));
  }).catch((err) => {
    console.warn("IndexedDB save warning:", err);
  });

  // 3. Try LocalStorage backup if size allows
  try {
    localStorage.setItem('custom_huruf_audio_map', JSON.stringify(inMemoryHurufAudioMap));
  } catch (err) {
    // QuotaExceededError is harmless because IndexedDB safely holds the audio
  }
};

export const deleteCustomHurufAudio = (key: string, letter?: string, id?: number | string) => {
  const normKey = normalizeArabicForMatching(key);
  const normLetter = letter ? normalizeArabicForMatching(letter) : null;

  delete inMemoryHurufAudioMap[key];
  if (normKey) delete inMemoryHurufAudioMap[normKey];
  if (letter) delete inMemoryHurufAudioMap[letter];
  if (normLetter) delete inMemoryHurufAudioMap[normLetter];
  if (id) delete inMemoryHurufAudioMap[String(id)];

  getIDB().then((db) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    if (normKey) store.delete(normKey);
    if (letter) store.delete(letter);
    if (normLetter) store.delete(normLetter);
    if (id) store.delete(String(id));
  }).catch(() => {});

  try {
    localStorage.setItem('custom_huruf_audio_map', JSON.stringify(inMemoryHurufAudioMap));
  } catch {}
};

/**
 * Shared AudioContext and global unlock handler for instant audio responsiveness across browsers
 */
let sharedAudioCtx: AudioContext | null = null;

export const getSharedAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
};

if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    getSharedAudioContext();
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  };
  window.addEventListener('click', unlockAudio, { capture: true });
  window.addEventListener('touchstart', unlockAudio, { capture: true });
  window.addEventListener('keydown', unlockAudio, { capture: true });

  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      try { window.speechSynthesis.getVoices(); } catch {}
    };
    try { window.speechSynthesis.getVoices(); } catch {}
  }
}

/**
 * Web Audio API Formant & Resonant Vocal Synthesizer
 * 100% reliable fail-safe that generates clear, resonant Arabic vocal tones
 * for Alif Maddah, Waw Maddah, Yaa Maddah, Khada Zabar/Zer/Pesh, Leen Waw, Leen Yaa, Tanween, etc.
 * when external audio URLs or browser speech synthesis are unavailable.
 */
export const playFormantSynthesizerAudio = (
  text: string,
  onEnd?: () => void,
  resolve?: () => void
): void => {
  const cleanT = text.replace(/[\u064B-\u065F\u0670]/g, '').trim();
  const isBaa = cleanT === 'ب' || cleanT === 'باء' || cleanT === 'باءْ' || text.includes('بَاء') || text.includes('بَا');
  const isJeem = cleanT === 'ج' || cleanT === 'جيم' || cleanT === 'جِيم' || cleanT === 'جِيمْ' || text.includes('جِيمْ') || text.includes('جِيْمْ');

  const ctx = getSharedAudioContext();
  const finish = () => {
    if (onEnd) onEnd();
    if (resolve) resolve();
  };

  if (!ctx) {
    finish();
    return;
  }

  if (isJeem) {
    try {
      const now = ctx.currentTime;
      const duration = 1.85; // Pronounced elongation (Madd) for Jeem (جِيْـــــمْ)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      const pitch = 130;
      osc1.frequency.setValueAtTime(pitch * 1.15, now); // Initial palatal burst
      osc2.frequency.setValueAtTime(pitch * 2.3, now);

      // Prolonged Madd transition on Yaa and ending Meem
      osc1.frequency.exponentialRampToValueAtTime(pitch * 1.05, now + 0.8);
      osc1.frequency.exponentialRampToValueAtTime(pitch * 0.92, now + duration);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2.1, now + 0.8);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 1.84, now + duration);

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(450, now); // Yaa vowel formant
      filter1.Q.value = 6.0;
      filter1.frequency.exponentialRampToValueAtTime(850, now + duration);

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(2400, now);
      filter2.Q.value = 6.0;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.35, now + 0.12);
      gainNode.gain.setValueAtTime(0.33, now + duration - 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(filter1);
      osc2.connect(filter2);
      filter1.connect(gainNode);
      filter2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);

      setTimeout(finish, duration * 1000 + 50);
      return;
    } catch (e) {
      console.warn("Jeem formant error:", e);
    }
  }

  if (isBaa) {
    try {
      const now = ctx.currentTime;
      const duration = 0.95;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      const pitch = 135;
      osc1.frequency.setValueAtTime(pitch, now);
      osc2.frequency.setValueAtTime(pitch * 2, now);

      osc1.frequency.exponentialRampToValueAtTime(pitch * 1.15, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(pitch * 0.95, now + duration);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2.3, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 1.9, now + duration);

      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(750, now);
      filter1.Q.value = 5.0;

      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(1300, now);
      filter2.Q.value = 5.5;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.32, now + 0.08);
      gainNode.gain.setValueAtTime(0.30, now + duration - 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(filter1);
      osc2.connect(filter2);
      filter1.connect(gainNode);
      filter2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);

      setTimeout(finish, duration * 1000 + 50);
      return;
    } catch (e) {
      console.warn("Baa formant error:", e);
    }
  }

  try {
    const now = ctx.currentTime;
    const isMaddahOrKhari = /[اوآٰٖٗ]/.test(text) || text.includes('مدہ') || text.includes('کھڑا') || text.includes('الٹا');
    const isYaaOrZer = /[يِيٖيْ]/.test(text) || text.includes('زیر') || text.includes('یاء');
    const isWawOrPesh = /[وُوٗوْ]/.test(text) || text.includes('پیش') || text.includes('واؤ');
    const isLeenWaw = text.includes('َوْ') || text.includes('واؤ لین');
    const isLeenYaa = text.includes('َيْ') || text.includes('یاء لین');

    let f1Freq = 750; // Fatha / Alif
    let f2Freq = 1250;
    let duration = isMaddahOrKhari ? 0.95 : 0.55;

    if (isLeenWaw) {
      f1Freq = 700; f2Freq = 1200; duration = 0.65;
    } else if (isLeenYaa) {
      f1Freq = 700; f2Freq = 1200; duration = 0.65;
    } else if (isYaaOrZer) {
      f1Freq = 280; f2Freq = 2250; duration = isMaddahOrKhari ? 0.95 : 0.55;
    } else if (isWawOrPesh) {
      f1Freq = 320; f2Freq = 800; duration = isMaddahOrKhari ? 0.95 : 0.55;
    }

    // Fundamental Qari Voice Source (Sine + Triangle blend at ~132 Hz)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sine';

    // Base pitch modulation (natural Qari vibrato)
    const pitch = 132;
    osc1.frequency.setValueAtTime(pitch, now);
    osc2.frequency.setValueAtTime(pitch * 2, now);

    // Subtle pitch drop at end
    osc1.frequency.exponentialRampToValueAtTime(pitch * 0.92, now + duration);
    osc2.frequency.exponentialRampToValueAtTime(pitch * 1.84, now + duration);

    // Formant Biquad Filters (F1 & F2)
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(f1Freq, now);
    filter1.Q.value = 4.5;

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'bandpass';
    filter2.frequency.setValueAtTime(f2Freq, now);
    filter2.Q.value = 5.0;

    if (isLeenWaw) {
      filter1.frequency.exponentialRampToValueAtTime(320, now + duration * 0.8);
      filter2.frequency.exponentialRampToValueAtTime(800, now + duration * 0.8);
    } else if (isLeenYaa) {
      filter1.frequency.exponentialRampToValueAtTime(280, now + duration * 0.8);
      filter2.frequency.exponentialRampToValueAtTime(2250, now + duration * 0.8);
    }

    // Master Volume Envelope
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.28, now + 0.08); // Gentle attack
    gainNode.gain.setValueAtTime(0.25, now + duration - 0.12);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration); // Smooth release

    osc1.connect(filter1);
    osc2.connect(filter2);
    filter1.connect(gainNode);
    filter2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);

    setTimeout(() => {
      finish();
    }, Math.floor((duration + 0.08) * 1000));
  } catch {
    finish();
  }
};

const URDU_HIJJA_KEYWORDS = /(?:زبر|زیر|پیش|کھڑا|کھڑی|الٹا|جزم|تشدید|شدہ|دو\s*زبر|دو\s*زیر|دو\s*پیش|سکون|تنوین|ماد|ہمزہ|ساکن|تختی|مشق|یعنی)/i;

const handleUrduHijjaText = async (text: string): Promise<boolean> => {
  if (!text || !URDU_HIJJA_KEYWORDS.test(text)) return false;

  // Case 1: Contains '=' (spellingHijja = finalWord)
  if (text.includes('=')) {
    const parts = text.split('=');
    const spellingPart = parts[0].trim();
    const finalWord = parts[1].trim();
    await playWordWithHijjaAndPronunciation(spellingPart, finalWord);
    return true;
  }

  // Case 2: Contains comma '،' or ',' (multiple hijja steps e.g. "رَا زَبَر رَ ، بَا زَبَر بَ")
  if (text.includes('،') || text.includes(',')) {
    const clauses = text.split(/،|,/).map(c => c.trim()).filter(Boolean);
    for (const clause of clauses) {
      if (!clause) continue;
      const tokens = clause.split(/\s+/);
      const lastToken = tokens[tokens.length - 1];
      const hasArabicResult = /[\u0621-\u064A\u0671-\u06D5]/.test(lastToken) && !URDU_HIJJA_KEYWORDS.test(lastToken);

      if (hasArabicResult && tokens.length > 1) {
        const urduSpelling = tokens.slice(0, -1).join(' ');
        await playUrduText(urduSpelling);
        await new Promise(r => setTimeout(r, 200));
        await playQariText(lastToken);
        await new Promise(r => setTimeout(r, 250));
      } else {
        await playUrduText(clause);
        await new Promise(r => setTimeout(r, 250));
      }
    }
    return true;
  }

  // Case 3: Single clause without comma (e.g. "همزہ زبر اَ" or "تاء دو زبر تَنْ" or "با الف زبر بَا")
  const tokens = text.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1];
  const hasArabicResult = /[\u0621-\u064A\u0671-\u06D5]/.test(lastToken) && !URDU_HIJJA_KEYWORDS.test(lastToken);

  if (hasArabicResult && tokens.length > 1) {
    const urduSpelling = tokens.slice(0, -1).join(' ');
    await playUrduText(urduSpelling);
    await new Promise(r => setTimeout(r, 220));
    await playQariText(lastToken);
  } else {
    await playUrduText(text);
  }

  return true;
};

/**
 * Play text with Tajweed Qari recitation or Custom User Voice Recording
 */
export const playQariText = (
  text: string,
  onEnd?: () => void,
  customAudioUrl?: string,
  forceRobotic: boolean = false,
  voiceId?: string
): Promise<void> => {
  return new Promise(async (resolve) => {
    stopAllQariAudio();

    // Unlock Audio Context immediately
    getSharedAudioContext();

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      resolve();
      return;
    }

    const activeVoiceId = voiceId || getSelectedQariVoiceId();

    // 0. Use passed customAudioUrl if explicitly provided
    if (customAudioUrl) {
      if (activeVoiceId === 'sudais' && customAudioUrl.includes('Alafasy')) {
        const sudaisUrl = customAudioUrl.replace('Alafasy_128kbps', 'Abdurrahmaan_As-Sudais_192kbps');
        playAudioUrl(sudaisUrl, text, onEnd, resolve, 'sudais');
        return;
      }
      playAudioUrl(customAudioUrl, text, onEnd, resolve, activeVoiceId);
      return;
    }

    // Check custom huruf audio map (user uploaded/recorded voice for Madani Qaida letters)
    const customRec = getCustomHurufAudio(text);
    if (customRec) {
      playAudioUrl(customRec, text, onEnd, resolve, activeVoiceId);
      return;
    }

    // Force Robotic logic
    if (forceRobotic) {
      playRoboticWordByWord(text, onEnd, resolve, activeVoiceId);
      return;
    }

    // Check if text is an Urdu Hijja spelling or contains Hijja keywords
    const handledHijja = await handleUrduHijjaText(text);
    if (handledHijja) {
      if (onEnd) onEnd();
      resolve();
      return;
    }

    // Check if the text explicitly specifies a Surah:Ayah reference like [112:1] or 112:1
    const isExplicitAyahRef = /\[?\d{1,3}[:,\/]\d{1,3}\]?/.test(text.trim());
    if (isExplicitAyahRef) {
      const qariUrl = await getAlafasyAudioForText(text, activeVoiceId);
      if (qariUrl) {
        playAudioUrl(qariUrl, text, onEnd, resolve, activeVoiceId);
        return;
      }
    }

    // Check if the text is one of the Huroof-e-Muqatta'at (Surah opening letters)
    const muqattaatUrls = getMuqattaatAudioUrls(text, activeVoiceId);
    if (muqattaatUrls && muqattaatUrls.length > 0) {
      if (muqattaatUrls.length === 1) {
        playAudioUrl(muqattaatUrls[0], text, onEnd, resolve, activeVoiceId);
      } else {
        playAlafasyWordSequence(muqattaatUrls, onEnd, resolve);
      }
      return;
    }

    // Check static verse map (for full verses / Surah items)
    const normalizedKey = normalizeArabicForMatching(text);
    if (STATIC_ALAFASY_VERSES[normalizedKey]) {
      let verseUrl = STATIC_ALAFASY_VERSES[normalizedKey];
      const targetVoice = QARI_VOICES.find(v => v.id === activeVoiceId) || QARI_VOICES[0];
      if (targetVoice && targetVoice.folder) {
        verseUrl = verseUrl.replace(/Alafasy_128kbps|Abdurrahmaan_As-Sudais_192kbps|Minshawy_Murattal_128kbps|Husary_128kbps/, targetVoice.folder);
      }
      playAudioUrl(verseUrl, text, onEnd, resolve, activeVoiceId);
      return;
    }

    // Check Lesson 17 Waqf items (Wasl: Sheikh Sudais, Waqf: Robotic Word-by-Word / Alafasy)
    const matchedWaqf = WAQF_ITEMS.find(item => 
      normalizeArabicForMatching(item.textNormal) === normalizedKey ||
      normalizeArabicForMatching(item.textWaqf) === normalizedKey ||
      item.textNormal.trim() === text.trim() ||
      item.textWaqf.trim() === text.trim()
    );
    if (matchedWaqf) {
      const isWaqfForm = normalizeArabicForMatching(matchedWaqf.textWaqf) === normalizedKey || matchedWaqf.textWaqf.trim() === text.trim();
      if (isWaqfForm) {
        if (matchedWaqf.audioWaqf) {
          playAudioUrl(matchedWaqf.audioWaqf, text, onEnd, resolve, activeVoiceId);
          return;
        }
        playRoboticWordByWord(text, onEnd, resolve, activeVoiceId);
        return;
      }
      const waslUrl = matchedWaqf.audioNormal;
      if (waslUrl) {
        let finalWaslUrl = waslUrl;
        if (activeVoiceId === 'sudais' && !finalWaslUrl.includes('Abdurrahmaan_As-Sudais')) {
          finalWaslUrl = finalWaslUrl.replace('Alafasy_128kbps', 'Abdurrahmaan_As-Sudais_192kbps');
        }
        playAudioUrl(finalWaslUrl, text, onEnd, resolve, activeVoiceId);
        return;
      }
    }

    // Check Lesson 17 Noon Qutni items (Wasl: Sheikh Sudais, Waqf: Robotic Word-by-Word)
    const matchedNq = NOON_QUTNI_ITEMS.find(item =>
      normalizeArabicForMatching(item.text) === normalizedKey ||
      normalizeArabicForMatching(item.وصل) === normalizedKey ||
      normalizeArabicForMatching(item.وقف) === normalizedKey ||
      item.text.trim() === text.trim() ||
      item.وصل.trim() === text.trim() ||
      item.وقف.trim() === text.trim()
    );
    if (matchedNq) {
      const isWaqfForm = normalizeArabicForMatching(matchedNq.وقف) === normalizedKey || matchedNq.وقف.trim() === text.trim();
      if (isWaqfForm) {
        if (matchedNq.audioWaqf) {
          playAudioUrl(matchedNq.audioWaqf, text, onEnd, resolve, activeVoiceId);
          return;
        }
        playRoboticWordByWord(text, onEnd, resolve, activeVoiceId);
        return;
      }
      if (matchedNq.audioNormal) {
        let nqUrl = matchedNq.audioNormal;
        if (activeVoiceId === 'sudais' && !nqUrl.includes('Abdurrahmaan_As-Sudais')) {
          nqUrl = nqUrl.replace('Alafasy_128kbps', 'Abdurrahmaan_As-Sudais_192kbps');
        }
        playAudioUrl(nqUrl, text, onEnd, resolve, activeVoiceId);
        return;
      }
    }

    // Check Lesson 16 Mutafarriq Qawaid items (Qari Sheikh Sudais / Authentic Recitation Audio)
    const matchedMutafarriq = ALL_MUTAFARRIQ_ITEMS.find(item =>
      normalizeArabicForMatching(item.arabic) === normalizedKey ||
      normalizeArabicForMatching(item.audioText) === normalizedKey ||
      item.arabic.trim() === text.trim() ||
      item.audioText.trim() === text.trim()
    );
    if (matchedMutafarriq) {
      if (activeVoiceId === 'sudais' && matchedMutafarriq.audioAyahRef) {
        const url = getAlafasyUrlForSurahAyah(matchedMutafarriq.audioAyahRef.surah, matchedMutafarriq.audioAyahRef.ayah, 'sudais');
        playAudioUrl(url, text, onEnd, resolve, 'sudais');
        return;
      }
      if (matchedMutafarriq.customAudioUrl) {
        playAudioUrl(matchedMutafarriq.customAudioUrl, text, onEnd, resolve, activeVoiceId);
        return;
      }
      if (matchedMutafarriq.wbwAudioUrls && matchedMutafarriq.wbwAudioUrls.length > 0) {
        if (matchedMutafarriq.wbwAudioUrls.length === 1) {
          playAudioUrl(matchedMutafarriq.wbwAudioUrls[0], text, onEnd, resolve, activeVoiceId);
        } else {
          playAlafasyWordSequence(matchedMutafarriq.wbwAudioUrls, onEnd, resolve);
        }
        return;
      }
      if (matchedMutafarriq.audioAyahRef) {
        const url = getAlafasyUrlForSurahAyah(matchedMutafarriq.audioAyahRef.surah, matchedMutafarriq.audioAyahRef.ayah, activeVoiceId);
        playAudioUrl(url, text, onEnd, resolve, activeVoiceId);
        return;
      }
    }

    // Check if the text is a Kalima (کلمہ / کلمات - compound words, 2+ letter words, multi-word phrases across all lessons)
    // Plays with clear, pristine robotic voice word-by-word as requested!
    if (isKalima(text)) {
      playRoboticWordByWord(text, onEnd, resolve, activeVoiceId);
      return;
    }

    // Try fetching authentic Qari Alafasy Word-by-Word Audio if available
    const wordUrls = await getAlafasyWordAudioUrls(text);
    if (wordUrls && wordUrls.length > 0) {
      playAlafasyWordSequence(wordUrls, onEnd, resolve);
      return;
    }

    // Fallback to high quality TTS for custom/unmatched single letters
    fallbackToArabicTTS(text, onEnd, resolve, activeVoiceId);
  });
};

/**
 * Fetch Sheikh Mishary Rashid Alafasy Word-by-Word Audio URLs for any given text / kalima
 */

export const getAlafasyWordAudioUrls = async (text: string): Promise<string[] | null> => {
  if (!text || !text.trim()) return null;

  try {
    const clean = text.replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '').trim();
    if (!clean) return null;

    const res = await fetch(`/api/quran-word-audio?word=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (data?.audioUrls && Array.isArray(data.audioUrls) && data.audioUrls.length > 0) {
        return data.audioUrls;
      }
    }
  } catch (err) {
    console.warn("[Client Word Audio Fetch Error]:", err);
  }

  return null;
};

/**
 * Play sequential word-by-word audio in Sheikh Mishary Rashid Alafasy's voice
 */
export const playAlafasyWordSequence = (
  urls: string[],
  onEnd?: () => void,
  resolve?: () => void
) => {
  stopAllQariAudio();
  if (!urls || urls.length === 0) {
    if (onEnd) onEnd();
    if (resolve) resolve();
    return;
  }

  let index = 0;
  const playNext = () => {
    if (index >= urls.length) {
      currentAudio = null;
      if (onEnd) onEnd();
      if (resolve) resolve();
      return;
    }

    const url = urls[index++];
    const audio = new Audio(url);
    currentAudio = audio;

    audio.onended = () => {
      setTimeout(playNext, 80);
    };

    audio.onerror = () => {
      setTimeout(playNext, 50);
    };

    audio.play().catch(() => {
      playNext();
    });
  };

  playNext();
};

const playAudioUrl = (
  url: string,
  text: string,
  onEnd?: () => void,
  resolve?: () => void,
  voiceId: string = 'sudais'
) => {
  const audio = new Audio(url);
  currentAudio = audio;
  audio.play().then(() => {
    audio.onended = () => {
      currentAudio = null;
      if (onEnd) onEnd();
      if (resolve) resolve();
    };
  }).catch(() => {
    fallbackToArabicTTS(text, onEnd, resolve, voiceId);
  });
};

/**
 * Detect whether an input text represents a Kalima (کلمہ / کلمات - compound words, 2+ letter words, multi-word phrases)
 * Returns true for Kalimat across all lessons (Murakkabat, Harakat words, Tanween words, Sukoon words, Tashdeed words, etc.)
 * Returns false for single isolated letters (حروف مفردات) and single letter vocalizations (e.g. ب, بَ, بِ, بُ, بً, بٍ, بٌ, بٰ, بٖ, بٗ)
 */
export function isKalima(text: string): boolean {
  if (!text || !text.trim()) return false;
  const trimmed = text.trim();

  // 1. If text explicitly has multiple words separated by spaces or punctuation
  const words = trimmed
    .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#\-۞ۖۗۚ؛،۔\/\\]/g, ' ')
    .split(/\s+/)
    .filter(w => w.trim().length > 0);

  if (words.length > 1) {
    return true;
  }

  // 2. Strip all Arabic diacritics, harakat, sukoon, tanween, khari harakat, tatweel, Quran stop signs
  const strippedDiacritics = trimmed.replace(/[\u064B-\u065F\u0670\u0656\u0657\u06E1\u06DF\u06E0\u06E2\u0640\s]/g, '');

  // Single base letter (e.g. ب, بَ, بِ, بُ, بً, بٍ, بٌ, بٰ, بٖ, بٗ)
  if (strippedDiacritics.length <= 1) {
    return false;
  }

  // Single consonant with trailing silent Alif from Tanween Fathatan (e.g. بًا, تًا, ثًا)
  if (strippedDiacritics.length === 2 && strippedDiacritics.endsWith('ا') && /[\u064B]/.test(trimmed)) {
    const base = strippedDiacritics.replace(/ا$/, '');
    if (base.length <= 1) {
      return false;
    }
  }

  // 3. Known single letter names from Lesson 1 (Mufradat)
  const SINGLE_LETTER_NAMES = new Set([
    'الف', 'ألف', 'أَلِفْ', 'اَلِفْ', 'باء', 'بَاءْ', 'تاء', 'تَاءْ', 'ثاء', 'ثَاءْ',
    'جیم', 'جِيمْ', 'جِيْمْ', 'حاء', 'حَاءْ', 'خاء', 'خَاءْ', 'دال', 'دَالْ', 'ذال', 'ذَالْ',
    'راء', 'رَاءْ', 'زا', 'زے', 'زائی', 'زائے', 'زَاءْ', 'زَايْ', 'سین', 'سِيْنْ',
    'شین', 'شِيْنْ', 'صاد', 'صَادْ', 'ضاد', 'ضَادْ', 'طاء', 'طَاءْ', 'ظاء', 'ظَاءْ',
    'عین', 'عَيْنْ', 'غین', 'غَيْنْ', 'فاء', 'فَاءْ', 'قاف', 'قَافْ', 'کاف', 'كَافْ',
    'لام', 'لَامْ', 'میم', 'مِيْمْ', 'نون', 'نُوْنْ', 'واؤ', 'وَاوْ', 'ہا', 'هَاءْ',
    'ہمزہ', 'هَمْزَة', 'یا', 'يَاءْ'
  ]);

  if (SINGLE_LETTER_NAMES.has(trimmed) || SINGLE_LETTER_NAMES.has(strippedDiacritics)) {
    return false;
  }

  // Any other word with 2 or more base letters is a Kalima!
  return true;
}

/**
 * Direct exported helper for playing Kalimat in clear Robotic Voice Word-by-Word
 */
export function playKalimaAudio(
  text: string,
  onEnd?: () => void,
  voiceId?: string
): Promise<void> {
  return playRoboticWordByWord(text, onEnd, undefined, voiceId);
}

/**
 * Play text using Robotic voice (Arabic TTS / SpeechSynthesis) Word-by-Word
 * Splits sentences or multi-word kalimat into individual words and speaks each word sequentially with a clean pedagogical pause.
 */
export function playRoboticWordByWord(
  text: string,
  onEnd?: () => void,
  resolve?: () => void,
  voiceId: string = 'sudais'
): Promise<void> {
  return new Promise((res) => {
    stopAllQariAudio();
    const token = ++activeSequenceToken;

    if (!text || !text.trim()) {
      if (onEnd) onEnd();
      if (resolve) resolve();
      res();
      return;
    }

    const clean = text.replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#\-۞ۖۗۚ؛،۔\/\\]/g, ' ').trim();
    const words = clean.split(/\s+/).filter(w => w.trim().length > 0);

    if (words.length === 0) {
      if (onEnd) onEnd();
      if (resolve) resolve();
      res();
      return;
    }

    let currentIndex = 0;

    const playSingleWord = (word: string, next: () => void) => {
      if (token !== activeSequenceToken) return;

      const normalizedWord = normalizeTextForArabicTTS(word);
      const ttsAudioUrl = `/api/tts?text=${encodeURIComponent(normalizedWord)}&lang=ar&qari=${encodeURIComponent(voiceId)}`;
      const audio = new Audio(ttsAudioUrl);
      currentAudio = audio;

      let wordDone = false;
      let safetyTimer: any = null;

      const onWordComplete = () => {
        if (!wordDone) {
          wordDone = true;
          if (safetyTimer) clearTimeout(safetyTimer);
          currentAudio = null;
          if (token === activeSequenceToken) {
            setTimeout(next, 130);
          }
        }
      };

      // Watchdog: prevents any hung network request or audio glitch from blocking the lesson
      safetyTimer = setTimeout(() => {
        if (!wordDone && token === activeSequenceToken) {
          onWordComplete();
        }
      }, 3500);

      audio.onended = onWordComplete;
      audio.onerror = () => {
        if (token !== activeSequenceToken) return;
        fallbackToSpeechSynthesisSingleWord(normalizedWord, onWordComplete, voiceId);
      };

      audio.play().catch(() => {
        if (token !== activeSequenceToken) return;
        fallbackToSpeechSynthesisSingleWord(normalizedWord, onWordComplete, voiceId);
      });
    };

    const nextWord = () => {
      if (token !== activeSequenceToken) return;
      if (currentIndex >= words.length) {
        if (onEnd) onEnd();
        if (resolve) resolve();
        res();
        return;
      }
      const word = words[currentIndex++];
      playSingleWord(word, nextWord);
    };

    nextWord();
  });
}

function fallbackToSpeechSynthesisSingleWord(
  word: string,
  onEnd: () => void,
  voiceId: string = 'sudais'
) {
  if (!('speechSynthesis' in window)) {
    playFormantSynthesizerAudio(word, onEnd);
    return;
  }
  try {
    const normalizedText = normalizeTextForArabicTTS(word);
    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = 'ar-SA';
    if (voiceId === 'sudais') {
      utterance.rate = 0.80;
      utterance.pitch = 0.88;
    } else if (voiceId === 'alafasy') {
      utterance.rate = 0.82;
      utterance.pitch = 0.98;
    } else {
      utterance.rate = 0.80;
      utterance.pitch = 0.90;
    }
    const voice = getBestArabicQariVoice();
    if (voice) utterance.voice = voice;

    let ended = false;
    const finish = () => {
      if (!ended) {
        ended = true;
        onEnd();
      }
    };

    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    setTimeout(finish, 2200);
  } catch {
    onEnd();
  }
}

const fallbackToArabicTTS = (
  text: string,
  onEnd?: () => void,
  resolve?: () => void,
  voiceId: string = 'sudais'
) => {
  const normalized = normalizeTextForArabicTTS(text);
  const cleanText = normalized
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/[*#]/g, '')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    if (resolve) resolve();
    return;
  }

  // 1. Try High-Definition HD Studio Audio endpoint first
  const ttsAudioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}&lang=ar&qari=${encodeURIComponent(voiceId)}`;
  const audio = new Audio(ttsAudioUrl);
  currentAudio = audio;

  let finished = false;
  const complete = () => {
    if (!finished) {
      finished = true;
      currentAudio = null;
      if (onEnd) onEnd();
      if (resolve) resolve();
    }
  };

  audio.onended = complete;
  audio.onerror = () => {
    // 2. Fallback to device speech synthesis if network fails
    fallbackToSpeechSynthesis(cleanText, onEnd, resolve, voiceId);
  };

  audio.play().catch(() => {
    // 3. Fallback to speech synthesis if autoplay blocked
    fallbackToSpeechSynthesis(cleanText, onEnd, resolve, voiceId);
  });
};

const fallbackToSpeechSynthesis = (
  text: string,
  onEnd?: () => void,
  resolve?: () => void,
  voiceId: string = 'sudais'
) => {
  if (!('speechSynthesis' in window)) {
    playFormantSynthesizerAudio(text, onEnd, resolve);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch {}

  const normalizedText = normalizeTextForArabicTTS(text);
  const utterance = new SpeechSynthesisUtterance(normalizedText);
  utterance.lang = 'ar-SA';
  
  if (voiceId === 'sudais') {
    utterance.rate = 0.49;
    utterance.pitch = 0.80; // Deeper, resonant Imam tone for Sheikh Sudais
  } else if (voiceId === 'alafasy') {
    utterance.rate = 0.54;
    utterance.pitch = 0.96; // Distinct melodious Qari tone for Sheikh Alafasy
  } else {
    utterance.rate = 0.52;
    utterance.pitch = 0.86;
  }

  const voice = getBestArabicQariVoice();
  if (voice) {
    utterance.voice = voice;
  }

  let fired = false;
  const finish = () => {
    if (!fired) {
      fired = true;
      if (onEnd) onEnd();
      if (resolve) resolve();
    }
  };

  utterance.onend = finish;
  utterance.onerror = () => {
    // Fail-safe: Play Web Audio Formant Synthesizer if SpeechSynthesis errors
    playFormantSynthesizerAudio(text, onEnd, resolve);
  };

  try {
    window.speechSynthesis.speak(utterance);
    // Timeout safeguard if speech synthesis hangs without starting or ending
    setTimeout(() => {
      if (!fired) {
        if (window.speechSynthesis.speaking) return;
        playFormantSynthesizerAudio(text, onEnd, resolve);
      }
    }, 1800);
  } catch {
    playFormantSynthesizerAudio(text, onEnd, resolve);
  }
};

// 29 Huruf-e-Tahajji & Mufradat (bare letters & letter names - with exact phonetic vocalization for Arabic TTS engines)
export const HURUF_EXACT_PHONETICS: Record<string, string> = {
  'مُسَمًّى': 'مُسَمَّنْ',
  'مُسَمَّى': 'مُسَمَّنْ',
  'ا': 'أَلِفْ',
  'أ': 'أَلِفْ',
  'إ': 'أَلِفْ',
  'آ': 'أَلِفْ',
  'الف': 'أَلِفْ',
  'ألف': 'أَلِفْ',
  'أَلِف': 'أَلِفْ',
  'أَلِفْ': 'أَلِفْ',
  'اَلِفْ': 'أَلِفْ',

  'ب': 'بَاءْ',
  'باء': 'بَاءْ',
  'بَاء': 'بَاءْ',
  'بَاءْ': 'بَاءْ',
  'با': 'بَاءْ',
  'بَا': 'بَاءْ',

  'ت': 'تَاءْ',
  'تاء': 'تَاءْ',
  'تَاء': 'تَاءْ',
  'تَاءْ': 'تَاءْ',
  'تا': 'تَاءْ',
  'تَا': 'تَاءْ',

  'ث': 'ثَاءْ',
  'ثاء': 'ثَاءْ',
  'ثَاء': 'ثَاءْ',
  'ثَاءْ': 'ثَاءْ',
  'ثا': 'ثَاءْ',
  'ثَا': 'ثَاءْ',

  'ج': 'جِيمْ',
  'جیم': 'جِيمْ',
  'جِيم': 'جِيمْ',
  'جِيمْ': 'جِيمْ',
  'جِيْمْ': 'جِيمْ',

  'ح': 'حَاءْ',
  'حاء': 'حَاءْ',
  'حَاء': 'حَاءْ',
  'حَاءْ': 'حَاءْ',
  'حا': 'حَاءْ',
  'حَا': 'حَاءْ',

  'خ': 'خَاءْ',
  'خاء': 'خَاءْ',
  'خَاء': 'خَاءْ',
  'خَاءْ': 'خَاءْ',
  'خا': 'خَاءْ',
  'خَا': 'خَاءْ',

  'د': 'دَالْ',
  'دال': 'دَالْ',
  'دَال': 'دَالْ',
  'دَالْ': 'دَالْ',

  'ذ': 'ذَالْ',
  'ذال': 'ذَالْ',
  'ذَال': 'ذَالْ',
  'ذَالْ': 'ذَالْ',

  'ر': 'رَاءْ',
  'راء': 'رَاءْ',
  'رَاء': 'رَاءْ',
  'رَاءْ': 'رَاءْ',
  'را': 'رَاءْ',
  'رَا': 'رَاءْ',

  'ز': 'زَا',
  'زا': 'زَا',
  'زای': 'زَا',
  'زائی': 'زَا',
  'زائے': 'زَا',
  'زے': 'زَا',
  'زَا': 'زَا',
  'زَاء': 'زَا',
  'زَاءْ': 'زَا',
  'زَاي': 'زَا',
  'زَايْ': 'زَا',

  'س': 'سِيْنْ',
  'سین': 'سِيْنْ',
  'سِين': 'سِيْنْ',
  'سِينْ': 'سِيْنْ',
  'سِيْن': 'سِيْنْ',
  'سِيْنْ': 'سِيْنْ',

  'ش': 'شِيْنْ',
  'شین': 'شِيْنْ',
  'شِين': 'شِيْنْ',
  'شِينْ': 'شِيْنْ',
  'شِيْن': 'شِيْنْ',
  'شِيْنْ': 'شِيْنْ',

  'ص': 'صَادْ',
  'صاد': 'صَادْ',
  'صَاد': 'صَادْ',
  'صَادْ': 'صَادْ',

  'ض': 'ضَادْ',
  'ضاد': 'ضَادْ',
  'ضَاد': 'ضَادْ',
  'ضَادْ': 'ضَادْ',

  'ط': 'طَاءْ',
  'طاء': 'طَاءْ',
  'طَاء': 'طَاءْ',
  'طَاءْ': 'طَاءْ',
  'طا': 'طَاءْ',
  'طَا': 'طَاءْ',
  'طوئے': 'طَاءْ',

  'ظ': 'ظَاءْ',
  'ظاء': 'ظَاءْ',
  'ظَاء': 'ظَاءْ',
  'ظَاءْ': 'ظَاءْ',
  'ظا': 'ظَاءْ',
  'ظَا': 'ظَاءْ',
  'ظوئے': 'ظَاءْ',

  'ع': 'عَيْنْ',
  'عین': 'عَيْنْ',
  'عَيْن': 'عَيْنْ',
  'عَيْنْ': 'عَيْنْ',
  'عَيْـن': 'عَيْنْ',

  'غ': 'غَيْنْ',
  'غین': 'غَيْنْ',
  'غَيْن': 'غَيْنْ',
  'غَيْنْ': 'غَيْنْ',
  'غَيْـن': 'غَيْنْ',

  'ف': 'فَاءْ',
  'فاء': 'فَاءْ',
  'فَاء': 'فَاءْ',
  'فَاءْ': 'فَاءْ',
  'فا': 'فَاءْ',
  'فَا': 'فَاءْ',
  'فے': 'فَاءْ',

  'ق': 'قَافْ',
  'قاف': 'قَافْ',
  'قَاف': 'قَافْ',
  'قَافْ': 'قَافْ',

  'ك': 'كَافْ',
  'ک': 'كَافْ',
  'کاف': 'كَافْ',
  'كَاف': 'كَافْ',
  'كَافْ': 'كَافْ',

  'ل': 'لَامْ',
  'لام': 'لَامْ',
  'لاَم': 'لَامْ',
  'لاَمْ': 'لَامْ',
  'لَام': 'لَامْ',
  'لَامْ': 'لَامْ',

  'م': 'مِيمْ',
  'میم': 'مِيمْ',
  'مِيم': 'مِيمْ',
  'مِيمْ': 'مِيمْ',
  'مِيْمْ': 'مِيمْ',

  'ن': 'نُوْنْ',
  'نون': 'نُوْنْ',
  'نُون': 'نُوْنْ',
  'نُونْ': 'نُوْنْ',
  'نُوْن': 'نُوْنْ',
  'نُوْنْ': 'نُوْنْ',

  'و': 'وَاوْ',
  'واو': 'وَاوْ',
  'واؤ': 'وَاوْ',
  'وَاو': 'وَاوْ',
  'وَاوْ': 'وَاوْ',

  'ه': 'هَاءْ',
  'ہ': 'هَاءْ',
  'ھ': 'هَاءْ',
  'هاء': 'هَاءْ',
  'ہاء': 'هَاءْ',
  'ہا': 'هَاءْ',
  'ها': 'هَاءْ',
  'ہے': 'هَاءْ',
  'هَاء': 'هَاءْ',
  'هَاءْ': 'هَاءْ',

  'ء': 'هَمْزَة',
  'ہمزہ': 'هَمْزَة',
  'ہمزۂ': 'هَمْزَة',
  'ہمزۂ': 'هَمْزَة',
  'همزة': 'هَمْزَة',
  'همزه': 'هَمْزَة',
  'هَمْزَة': 'هَمْزَة',
  'هَمْزَةْ': 'هَمْزَة',
  'هَمْزَه': 'هَمْزَة',

  'ي': 'يَاءْ',
  'ی': 'يَاءْ',
  'ے': 'يَاءْ',
  'یاء': 'يَاءْ',
  'یا': 'يَاءْ',
  'یَا': 'يَاءْ',
  'یے': 'يَاءْ',
  'يَاء': 'يَاءْ',
  'يَاءْ': 'يَاءْ',
  'یَاء': 'يَاءْ',

  // === LESSON 7: KHARI HARAKAT (کھڑی حرکات: کھڑا زبر، کھڑا زیر، الٹا پیش) ===
  // Khara Zabar (کھڑا زبر = الف مدہ کے قائم مقام)
  'ءٰ': 'أٰ', 'اٰ': 'أٰ', 'أٰ': 'أٰ',
  'بٰ': 'بَا', 'تٰ': 'تَا', 'ثٰ': 'ثَا', 'جٰ': 'جَا', 'حٰ': 'حَا', 'خٰ': 'خَا',
  'دٰ': 'دَا', 'ذٰ': 'ذَا', 'رٰ': 'رَا', 'زٰ': 'زَا', 'سٰ': 'سَا', 'شٰ': 'شَا',
  'صٰ': 'صَا', 'ضٰ': 'ضَا', 'طٰ': 'طَا', 'ظٰ': 'ظَا', 'عٰ': 'عَا', 'غٰ': 'غَا',
  'فٰ': 'فَا', 'قٰ': 'قَا', 'كٰ': 'كَا', 'لٰ': 'لَا', 'مٰ': 'مَا', 'نٰ': 'نَا',
  'وٰ': 'وَا', 'هٰ': 'هَا', 'ہٰ': 'هَا', 'یٰ': 'يَا', 'يٰ': 'يَا',

  // Khara Zer (کھڑا زیر = یاء مدہ کے قائم مقام)
  'ءٖ': 'إِيْ', 'إٖ': 'إِيْ', 'اٖ': 'إِيْ',
  'بٖ': 'بِيْ', 'تٖ': 'تِيْ', 'ثٖ': 'ثِيْ', 'جٖ': 'جِيْ', 'حٖ': 'حِيْ', 'خٖ': 'خِيْ',
  'دٖ': 'دِيْ', 'ذٖ': 'ذِيْ', 'رٖ': 'رِيْ', 'زٖ': 'زِيْ', 'سٖ': 'سِيْ', 'شٖ': 'شِيْ',
  'صٖ': 'صِيْ', 'ضٖ': 'ضِيْ', 'طٖ': 'طِيْ', 'ظٖ': 'ظِيْ', 'عٖ': 'عِيْ', 'غٖ': 'غِيْ',
  'فٖ': 'فِيْ', 'قٖ': 'قِيْ', 'كٖ': 'كِيْ', 'لٖ': 'لِيْ', 'مٖ': 'مِيْ', 'نٖ': 'نِيْ',
  'وٖ': 'وِيْ', 'هٖ': 'هِيْ', 'ہٖ': 'هِيْ', 'یٖ': 'يِيْ', 'يٖ': 'يِيْ',

  // Ulta Pesh (الٹا پیش = واؤ مدہ کے قائم مقام)
  'ءٗ': 'أُوْ', 'أٗ': 'أُوْ', 'اٗ': 'أُوْ',
  'بٗ': 'بُوْ', 'تٗ': 'تُوْ', 'ثٗ': 'ثُوْ', 'جٗ': 'جُوْ', 'حٗ': 'حُوْ', 'خٗ': 'خُوْ',
  'دٗ': 'دُوْ', 'ذٗ': 'ذُوْ', 'رٗ': 'رُوْ', 'زٗ': 'زُوْ', 'سٗ': 'سُوْ', 'شٗ': 'شُوْ',
  'صٗ': 'صُوْ', 'ضٗ': 'ضُوْ', 'طٗ': 'طُوْ', 'ظٗ': 'ظُوْ', 'عٗ': 'عُوْ', 'غٗ': 'غُوْ',
  'فٗ': 'فُوْ', 'قٗ': 'قُوْ', 'كٗ': 'كُوْ', 'لٗ': 'لُوْ', 'مٗ': 'مُوْ', 'نٗ': 'نُوْ',
  'وٗ': 'وُوْ', 'هٗ': 'هُوْ', 'ہٗ': 'هُوْ', 'یٗ': 'يُوْ', 'يٗ': 'يُوْ',

  // Triplets (ثلاثی مجموعہ: کھڑا زبر، کھڑا زیر، الٹا پیش)
  'ءٰ ءٖ ءٗ': 'أٰ إِيْ أُوْ',
  'بٰ بٖ بٗ': 'بَا بِيْ بُوْ',
  'تٰ تٖ تٗ': 'تَا تِيْ تُوْ',
  'ثٰ ثٖ ثٗ': 'ثَا ثِيْ ثُوْ',
  'جٰ جٖ جٗ': 'جَا جِيْ جُوْ',
  'حٰ حٖ حٗ': 'حَا حِيْ حُوْ',
  'خٰ خٖ خٗ': 'خَا خِيْ خُوْ',
  'دٰ دٖ دٗ': 'دَا دِيْ دُوْ',
  'ذٰ ذٖ ذٗ': 'ذَا ذِيْ ذُوْ',
  'رٰ رٖ رٗ': 'رَا رِيْ رُوْ',
  'زٰ زٖ زٗ': 'زَا زِيْ زُوْ',
  'سٰ سٖ سٗ': 'سَا سِيْ سُوْ',
  'شٰ شٖ شٗ': 'شَا شِيْ شُوْ',
  'صٰ صٖ صٗ': 'صَا صِيْ صُوْ',
  'ضٰ ضٖ ضٗ': 'ضَا ضِيْ ضُوْ',
  'طٰ طٖ طٗ': 'طَا طِيْ طُوْ',
  'ظٰ ظٖ ظٗ': 'ظَا ظِيْ ظُوْ',
  'عٰ عٖ عٗ': 'عَا عِيْ عُوْ',
  'غٰ غٖ غٗ': 'غَا غِيْ غُوْ',
  'فٰ فٖ فٗ': 'فَا فِيْ فُوْ',
  'قٰ قٖ قٗ': 'قَا قِيْ قُوْ',
  'كٰ كٖ كٗ': 'كَا كِيْ كُوْ',
  'لٰ لٖ لٗ': 'لَا لِيْ لُوْ',
  'مٰ مٖ مٗ': 'مَا مِيْ مُوْ',
  'نٰ نٖ نٗ': 'نَا نِيْ نُوْ',
  'وٰ وٖ وٗ': 'وَا وِيْ وُوْ',
  'هٰ هٖ هٗ': 'هَا هِيْ هُوْ',
  'یٰ یٖ یٗ': 'يَا يِيْ يُوْ',
  // === LESSON 7 WORDS PHONETICS (کھڑی حرکات کے کلمات کی درست صوتی قاری ادائیگی) ===
  // 1. Khara Zabar Words
  'طٰهٰ': 'طَاهَا',
  'طٰه': 'طَاهَا',
  'طه': 'طَاهَا',
  'هٰذَا': 'هَاذَا',
  'اٰدَمَ': 'ءَادَمَ',
  'آدَمَ': 'ءَادَمَ',
  'اٰيٰتٍ': 'ءَايَاتٍ',
  'آيَاتٍ': 'ءَايَاتٍ',
  'اٰمَنَ': 'ءَامَنَ',
  'آمَنَ': 'ءَامَنَ',
  'ذٰلِكَ': 'ذَالِكَ',
  'رَاٰهُ': 'رَءَاهُ',
  'رَآهُ': 'رَءَاهُ',
  'اِلٰهَ': 'إِلَاهَ',
  'إِلٰهَ': 'إِلَاهَ',
  'سَلٰمٌ': 'سَلَامٌ',
  'كِتٰبٌ': 'كِتَابٌ',
  'مٰلِكِ': 'مَالِكِ',
  'سَمٰوٰتٍ': 'سَمَاوَاتٍ',
  'قٰلُوْا': 'قَالُوا',
  'قُلُوْا': 'قَالُوا',
  'قَالُوا': 'قَالُوا',
  'قَالُوْا': 'قَالُوا',
  'صَلٰوةَ': 'صَلَاةَ',
  'صَلَوٰةَ': 'صَلَاةَ',
  'صَلَوةَ': 'صَلَاةَ',
  'زَكٰوةَ': 'زَكَاةَ',
  'زَكَوٰةَ': 'زَكَاةَ',
  'زَكَوةَ': 'زَكَاةَ',
  'حَيٰوةَ': 'حَيَاةَ',
  'حَيَوٰةَ': 'حَيَاةَ',
  'مِشْكٰوةٍ': 'مِشْكَاةٍ',
  'مَنٰوةَ': 'مَنَاةَ',
  'نَجٰوةَ': 'نَجَاةَ',
  'غَدٰوةَ': 'غَدَاةَ',
  'هُدًى': 'هُدَى',
  'هُدَى': 'هُدَى',
  'رِبٰوا': 'رِبَا',

  // 2. Khara Zer Words
  'بِهٖ': 'بِهِ',
  'هٰذِهٖ': 'هَاذِهِ',
  'مِثْلِهٖ': 'مِثْلِهِ',
  'اِلٰفِهِمْ': 'إِيلَافِهِمْ',
  'إِلٰفِهِمْ': 'إِيلَافِهِمْ',
  'عِبَادِهٖ': 'عِبَادِهِ',
  'رُسُلِهٖ': 'رُسُلِهِ',
  'كُتُبِهٖ': 'كُتُبِهِ',
  'اٰيٰتِهٖ': 'ءَايَاتِهِ',
  'آيَاتِهٖ': 'ءَايَاتِهِ',
  'فِيْهِ': 'فِيهِ',

  // 3. Ulta Pesh Words
  'دَاوٗدُ': 'دَاوُودُ',
  'مَالُهٗ': 'مَالُهُ',
  'وَزَادَهٗ': 'وَزَادَهُ',
  'عِنْدَهٗ': 'عِنْدَهُ',
  'لَهٗ': 'لَهُ',
  'جُنُوْدُهٗ': 'جُنُودُهُ',
  'يَرَهٗ': 'يَرَهُ',
  'اَمْرُهٗ': 'أَمْرُهُ',
  'رَبُّهٗ': 'رَبُّهُ',
  'وٗرِيَ': 'وُورِيَ',

  // === LESSON 10: NUN SAKIN & TANWEEN KALIMAS (اظہار، ادغام، اقلاب، اخفاء) ===
  'مِنْ اَجْلٍ': 'مِنْ أَجْلٍ',
  'مِنْ هَادٍ': 'مِنْ هَادٍ',
  'مِنْ عَلَقٍ': 'مِنْ عَلَقٍ',
  'مِنْ حَكِيْمٍ': 'مِنْ حَكِيمٍ',
  'مِنْ غَفُوْرٍ': 'مِنْ غَفُورٍ',
  'مِنْ خَوْفٍ': 'مِنْ خَوْفٍ',
  'يَنْئَوْنَ': 'يَنْـَٔوْنَ',
  'مِنْهُمْ': 'مِنْهُمْ',
  'اَنْعَمْتَ': 'أَنْعَمْتَ',
  'وَانْحَرْ': 'وَانْحَرْ',
  'فَسَيُنْغِضُوْنَ': 'فَسَيُنْغِضُونَ',
  'وَالْمُنْخَنِقَةُ': 'وَالْمُنْخَنِقَةُ',
  'عَذَابًا اَلِيْمًا': 'عَذَابًا أَلِيمًا',
  'بَلَدًا اٰمِنًا': 'بَلَدًا آمِنًا',
  'نُوْحًا هَدَيْنَا': 'نُوحًا هَدَيْنَا',
  'سَمِيْعٌ عَلِيْمٌ': 'سَمِيعٌ عَلِيمٌ',
  'قَرْضًا حَسَنًا': 'قَرْضًا حَسَنًا',
  'عَلِيْمٌ خَبِيْرٌ': 'عَلِيمٌ خَبِيرٌ',
  'قَوْمًا غَيْرَكُمْ': 'قَوْمًا غَيْرَكُمْ',
  'فَمَنْ تَبِعَ': 'فَمَنْ تَبِعَ',
  'مِنْ ثَمَرَةٍ': 'مِنْ ثَمَرَةٍ',
  'مِنْ جُوْعٍ': 'مِنْ جُوعٍ',
  'مِنْ دُوْنِكُمْ': 'مِنْ دُونِكُمْ',
  'مِنْ ذَهَبٍ': 'مِنْ ذَهَبٍ',
  'فَاِنْ زَلَلْتُمْ': 'فَإِنْ زَلَلْتُمْ',
  'مِنْ سَفَهٍ': 'مِنْ سَفَهٍ',
  'مَنْ شَكَرَ': 'مَنْ شَكَرَ',
  'مِنْ صَلْصَالٍ': 'مِنْ صَلْصَالٍ',
  'اِنْ ضَلَلْتُ': 'إِنْ ضَلَلْتُ',
  'مِنْ طِيْنٍ': 'مِنْ طِينٍ',
  'مَنْ ظَلَمَ': 'مَنْ ظَلَمَ',
  'مِنْ فُرُوْجٍ': 'مِنْ فُرُوجٍ',
  'مِنْ قَبْلُ': 'مِنْ قَبْلُ',
  'مِنْ كَتَبَ': 'مِنْ كَتَبَ',
  'اَنْتَ': 'أَنْتَ',
  'تَنْسَوْنَ': 'تَنْسَوْنَ',
  'نُنْشِزُهَا': 'نُنْشِزُهَا',
  'يَنْصُرُوْنَ': 'يَنْصُرُونَ',
  'مَنْضُوْدٍ': 'مَنْضُودٍ',
  'يَنْطِقُوْنَ': 'يَنْطِقُونَ',
  'اُنْظُرْ': 'أُنْظُرْ',
  'اَنْفُسَكُمْ': 'أَنْفُسَكُمْ',
  'يَنْقَضُوْنَ': 'يَنْقَضُونَ',
  'مِنْكُمْ': 'مِنْكُمْ',
  'قَوْلًا ثَقِيْلًا': 'قَوْلًا ثَقِيلًا',
  'فَصَبْرٌ جَمِيْلٌ': 'فَصَبْرٌ جَمِيلٌ',
  'كَأْسًا دِهَاقًا': 'كَأْسًا دِهَاقًا',
  'سِرَاعًا ذٰلِكَ': 'سِرَاعًا ذَالِكَ',
  'صَعِيْدًا زَلَقًا': 'صَعِيدًا زَلَقًا',
  'قَوْلًا سَدِيْدًا': 'قَوْلًا سَدِيدًا',
  'عَذَابٌ شَدِيْدٌ': 'عَذَابٌ شَدِيدٌ',
  'عَمَلًا صَالِحًا': 'عَمَلًا صَالِحًا',
  'عَذَابًا ضِعْفًا': 'عَذَابًا ضِعْفًا',
  'سَبْحًا طَوِيْلًا': 'سَبْحًا طَوِيلًا',
  'سَحَابٌ ظُلُمٰتٌ': 'سَحَابٌ ظُلُمَاتٌ',
  'قَوْمًا فَاسِقِيْنَ': 'قَوْمًا فَاسِقِينَ',
  'ثَمَنًا قَلِيْلًا': 'ثَمَنًا قَلِيلًا',
  'رَسُوْلٌ كَرِيْمٌ': 'رَسُولٌ كَرِيمٌ',
  'كِرَامًا كَاتِبِيْنَ': 'كِرَامًا كَاتِبِينَ',
  'مَنْ يَّقُوْلُ': 'مَيْ يَّقُولُ',
  'مِنْ وَّرَقِ الْجَنَّةِ': 'مِوْ وَّرَقِ الْجَنَّةِ',
  'مِنْ يَّوْمٍ': 'مِيْ يَّوْمٍ',
  'مَنْ وَّلِيٍّ': 'مَوْ وَّلِيٍّ',
  'مِنْ مَّشْهَدٍ': 'مِمْ مَّشْهَدٍ',
  'مِنْ مِّثْلِهِ': 'مِمْ مِّثْلِهِ',
  'مِنْ نَّصِيْرٍ': 'مِنْ نَّصِيرٍ',
  'مِنْ نُّطْفَةٍ': 'مِنْ نُّطْفَةٍ',
  'كِتَابًا يَّلْقٰهُ': 'كِتَابَيْ يَّلْقَاهُ',
  'هُدًى وَّذِكْرٰى': 'هُدَوْ وَّذِكْرَى',
  'سِرَاجًا مُّنِيْرًا': 'سِرَاجَمْ مُّنِيرًا',
  'حِطَّةٌ نَّغْفِرْ لَكُمْ': 'حِطَّتُنْ نَّغْفِرْ لَكُمْ',
  'مِنْ رَّبِّكَ': 'مِرْ رَّبِّكَ',
  'مِنْ رَّبِّهِمْ': 'مِرْ رَّبِّهِمْ',
  'مِنْ لَّدُنْهُ': 'مِلْ لَّدُنْهُ',
  'يَكُنْ لَّهُ': 'يَكُلْ لَّهُ',
  'مُحَمَّدٌ رَّسُوْلُ اللّٰهِ': 'مُحَمَّدُرْ رَّسُولُ اللّٰهِ',
  'رَءُوْفٌ رَّحِيْمٌ': 'رَءُوفُرْ رَّحِيمٌ',
  'مُّصَدِّقًا لِّمَا': 'مُصَدِّقَلْ لِّـمَا',
  'وَيلٌ لِّكُلِّ': 'وَيْلُلْ لِّكُلِّ',
  'مِنْۢ بَعْدِ': 'مِمْ بَعْدِ',
  'مِنْ بَعْدِ': 'مِمْ بَعْدِ',
  'مِنْۢ بَقْلِهَا': 'مِمْ بَقْلِهَا',
  'اَنْۢبِئْهُمْ': 'أَمْبِئْهُمْ',
  'لَيُنْۢبَذَنَّ': 'لَيُمْبَذَنَّ',
  'قَوْلًاۢ بَلِيْغًا': 'قَوْلَمْ بَلِيغًا',
  'خَبِيْرٌۢ بَصِيْرًا': 'خَبِيرُمْ بَصِيرًا',
  'جَنَّةٍۢ بِرَبْوَةٍ': 'جَنَّتِمْ بِرَبْوَةٍ',
  'كِرَامٍۢ بَرَرَةٍ': 'كِرَامِمْ بَرَرَةٍ',
  'حِلٌّۢ بِهٰذَا': 'حِلُّمْ بِهَذَا',
  'صُمٌّۢ بُكْمٌ': 'صُمُّمْ بُكْمٌ',

  // === LESSON 9: TASHDEED / SHADDAH KALIMAS ===
  'رَبَّنَا': 'رَبَّنَا',
  'ثُمَّ': 'ثُمَّ',
  'اِنَّ': 'إِنَّ',
  'إِنَّ': 'إِنَّ',
  'قَدَّرَ': 'قَدَّرَ',
  'نَعَّمَ': 'نَعَّمَ',
  'سَخَّرَ': 'سَخَّرَ',
  'حَقَّ': 'حَقَّ',
  'مَدَّ': 'مَدَّ',
  'رَبِّ': 'رَبِّ',
  'تَبَّتْ': 'تَبَّتْ',
  'الصَّلٰوةِ': 'أَلصَّلَاةِ',
  'الصَّلَاةِ': 'أَلصَّلَاةِ',
  'كَلَّا': 'كَلَّا',
  'عَمَّ': 'عَمَّ',
  'اِنَّا': 'إِنَّا',
  'إِنَّا': 'إِنَّا',
  'مُتَّكِئِينَ': 'مُتَّكِئِينَ',
  'يَذَّكَّرُ': 'يَذَّكَّرُ',
  'يَصَّدَّقُ': 'يَصَّدَّقُ',
  'تَوَكَّلْ': 'تَوَكَّلْ',
  'قَوَّامِينَ': 'قَوَّامِينَ',

  // === LESSON 6 & 7: MADDAH & LEEN KALIMAS ===
  'نُوْحِیْهَا': 'نُوحِيهَا',
  'نُوحِيهَا': 'نُوحِيهَا',
  'قَالَا': 'قَالَا',
  'يَقُوْلُ': 'يَقُولُ',
  'يَقُولُ': 'يَقُولُ',
  'قِيْلَ': 'قِيلَ',
  'قِيلَ': 'قِيلَ',
  'جَآءَ': 'جَاءَ',
  'سُوْٓءَ': 'سُوءَ',
  'جِیْٓءَ': 'جِيءَ',
  'خَوْفٍ': 'خَوْفٍ',
  'قُرَيْشٍ': 'قُرَيْشٍ',
  'صَيْفٍ': 'صَيْفٍ',
  'بَيْتٍ': 'بَيْتٍ',
  'يَوْمَ': 'يَوْمَ',
  'عَيْنٍ': 'عَيْنٍ',
  'شَيْءٍ': 'شَيْءٍ',
  'كَيْفَ': 'كَيْفَ',

  // === LESSON 8: SUKOON & QALQALAH KALIMAS ===
  'اِصْطَبِرْ': 'إِصْطَبِرْ',
  'إِصْطَبِرْ': 'إِصْطَبِرْ',
  'اصطبر': 'إِصْطَبِرْ',
  'اِصْطَبَرْ': 'إِصْطَبِرْ',
  'مُسْتَطَرٌ': 'مُسْتَطَرٌ',
  'فَاغْفِرْ': 'فَاغْفِرْ',
  'أَعْيُنٍ': 'أَعْيُنٍ',
  'أَعْنَابًا': 'أَعْنَابًا',
  'زَجْرَةٌ': 'زَجْرَةٌ',
  'نُطْفَةٍ': 'نُطْفَةٍ',
  'مُدْهَنُوْنَ': 'مُدْهَنُونَ',
  'أَبْوَابًا': 'أَبْوَابًا',
  'فَافْرُقْ': 'فَافْرُقْ',
  'يَعْلَمُ': 'يَعْلَمُ',
  'يَقْرَأُ': 'يَقْرَأُ',
  'اَلْحَمْدُ': 'أَلْحَمْدُ',
  'الْحَمْدُ': 'أَلْحَمْدُ',
  'خَلَقْنَا': 'خَلَقْنَا',
  'رَزَقْنَاهُمْ': 'رَزَقْنَاهُمْ',
  'اَبْصَارِهِمْ': 'أَبْصَارِهِمْ',
  'أَبْصَارِهِمْ': 'أَبْصَارِهِمْ',
  'قُلْ': 'قُلْ',
  'قُمْ': 'قُمْ',
  'ذُقْ': 'ذُقْ'
};

export function normalizeTextForArabicTTS(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // 1. Direct exact match in HURUF_EXACT_PHONETICS (e.g., explicit custom overrides, Khari Harakat cells, specific Quran words)
  if (HURUF_EXACT_PHONETICS[trimmed]) {
    return HURUF_EXACT_PHONETICS[trimmed];
  }

  // 2. If input contains diacritics / harakat / khari harakat (zabar, zer, pesh, jazm, tanween, khara zabar, khara zer, ulta pesh):
  // NOTE: We MUST process Mutaharrik letters/words with their vocalization rather than stripping them to bare Mufradat letter names!
  const hasHarakat = /[\u064B-\u065F\u0670]/.test(trimmed);

  if (hasHarakat) {
    let mutaharrikText = trimmed;

    // Check specific known Quranic words with unique Uthmani orthography
    if (/صَلٰوةَ|صَلَوٰةَ/.test(mutaharrikText)) return 'صَلَاةَ';
    if (/زَكٰوةَ|زَكَوٰةَ/.test(mutaharrikText)) return 'زَكَاةَ';
    if (/حَيٰوةَ|حَيَوٰةَ/.test(mutaharrikText)) return 'حَيَاةَ';
    if (/مِشْكٰوةٍ/.test(mutaharrikText)) return 'مِشْكَاةٍ';
    if (/مَنٰوةَ/.test(mutaharrikText)) return 'مَنَاةَ';
    if (/نَجٰوةَ/.test(mutaharrikText)) return 'نَجَاةَ';
    if (/غَدٰوةَ/.test(mutaharrikText)) return 'غَدَاةَ';
    if (/هُدًى/.test(mutaharrikText)) return 'هُدَى';
    if (/قٰلُوْا/.test(mutaharrikText)) return 'قَالُوْا';
    if (/طٰهٰ|طٰه/.test(mutaharrikText)) return 'طَاهَا';

    // Normalize Alif with Harakat/Tanween/Sukoon to proper Hamzah (أَ, إِ, أُ, أْ)
    mutaharrikText = mutaharrikText.replace(/ءَ/g, 'أَ');
    mutaharrikText = mutaharrikText.replace(/ءِ/g, 'إِ');
    mutaharrikText = mutaharrikText.replace(/ءُ/g, 'أُ');
    mutaharrikText = mutaharrikText.replace(/ءْ/g, 'أْ');

    // Unicode decomposed & composed Alif + Harakat
    mutaharrikText = mutaharrikText.replace(/ا\u064E/g, 'أَ');         // Alif + Fatha -> أَ
    mutaharrikText = mutaharrikText.replace(/ا\u0650/g, 'إِ');         // Alif + Kasra -> إِ
    mutaharrikText = mutaharrikText.replace(/ا\u064F/g, 'أُ');         // Alif + Damma -> أُ
    mutaharrikText = mutaharrikText.replace(/ا\u0652/g, 'أْ');         // Alif + Sukoon -> أْ
    mutaharrikText = mutaharrikText.replace(/ا\u064B/g, 'أً');         // Alif + Fathatan -> أً
    mutaharrikText = mutaharrikText.replace(/ا\u064D/g, 'إٍ');         // Alif + Kasratan -> إٍ
    mutaharrikText = mutaharrikText.replace(/ا\u064C/g, 'أٌ');         // Alif + Dammatan -> أٌ
    mutaharrikText = mutaharrikText.replace(/ٱ/g, 'أ');

    mutaharrikText = mutaharrikText.replace(/اَ/g, 'أَ');
    mutaharrikText = mutaharrikText.replace(/اِ/g, 'إِ');
    mutaharrikText = mutaharrikText.replace(/اُ/g, 'أُ');
    mutaharrikText = mutaharrikText.replace(/اْ/g, 'أْ');
    mutaharrikText = mutaharrikText.replace(/اً/g, 'أً');
    mutaharrikText = mutaharrikText.replace(/اٍ/g, 'إٍ');
    mutaharrikText = mutaharrikText.replace(/اٌ/g, 'أٌ');
    mutaharrikText = mutaharrikText.replace(/اٰ/g, 'ءَا');
    mutaharrikText = mutaharrikText.replace(/ءٰ/g, 'ءَا');

    // Uthmani Waw under Khara Zabar (e.g. صلوة -> صلاة)
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u0670و(?=[ة|ت|ا|ى|ي]|$)/g, '$1َا');
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u064Eو\u0670(?=[ة|ت|ا|ى|ي]|$)/g, '$1َا');

    // Khari Harakat Phonetic Normalization (Madani Qaida / Tajweed standard):
    // 1. Khara Zabar (ـٰ or ـَٰ) -> Fatha + Alif (ـَا) for standard Arabic TTS elongation
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u064E?\u0670/g, '$1َا');
    // 2. Khara Zer (ـٖ or ـِٖ) -> Kasra + Yaa (ـِيْ)
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u0650?\u0656/g, '$1ِيْ');
    // 3. Ulta Pesh (ـٗ or ـُٗ) -> Damma + Waw (ـُوْ)
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u064F?\u0657/g, '$1ُوْ');

    // Remove silent trailing Alif after Tanween Fatha in words
    mutaharrikText = mutaharrikText.replace(/([\u0621-\u064A])\u064B\u0627/g, '$1\u064B');

    // Ensure Yaa Leen words with dotless yaa or alif maqsura (e.g. لَدَىْ, دَىْ) are vocalized as dotted yaa (لَدَيْ, دَيْ)
    mutaharrikText = mutaharrikText.replace(/لَدَىْ/g, 'لَدَيْ');
    mutaharrikText = mutaharrikText.replace(/لَدَى/g, 'لَدَيْ');
    mutaharrikText = mutaharrikText.replace(/دَىْ/g, 'دَيْ');
    mutaharrikText = mutaharrikText.replace(/ىْ/g, 'يْ');
    mutaharrikText = mutaharrikText.replace(/ًى/g, 'ى');

    return mutaharrikText;
  }

  // 3. For unvocalized bare letters / Mufradat without harakat, check stripped name match in HURUF_EXACT_PHONETICS
  const stripped = trimmed.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  if (HURUF_EXACT_PHONETICS[stripped]) {
    return HURUF_EXACT_PHONETICS[stripped];
  }

  let text = input;

  // Ensure Yaa Leen words with dotless yaa or alif maqsura are converted to dotted yaa for clear TTS
  text = text.replace(/لَدَىْ/g, 'لَدَيْ');
  text = text.replace(/لَدَى/g, 'لَدَيْ');
  text = text.replace(/دَىْ/g, 'دَيْ');
  text = text.replace(/ىْ/g, 'يْ');

  // 1. Convert Urdu 'الف' with harakat/spelling to 'هَمْزَة' (Hamzah)
  text = text.replace(/الف\s*زبر/g, 'هَمْزَة زَبَرْ');
  text = text.replace(/الف\s*زیر/g, 'هَمْزَة زَيْرْ');
  text = text.replace(/الف\s*پیش/g, 'هَمْزَة بَيْشْ');
  text = text.replace(/الف\s*جزم/g, 'هَمْزَة جَزَمْ');
  text = text.replace(/الف\s*سکون/g, 'هَمْزَة جَزَمْ');

  // Convert Urdu Hamza and letter names to exact Arabic script for TTS engines
  text = text.replace(/ہمزہ/g, 'هَمْزَة');
  text = text.replace(/همزة/g, 'هَمْزَة');
  text = text.replace(/همزه/g, 'هَمْزَة');

  text = text.replace(/زبر/g, 'زَبَرْ');
  text = text.replace(/زیر/g, 'زَيْرْ');
  text = text.replace(/پیش/g, 'بَيْشْ');

  // 2. Convert Alif and standalone Hamza with harakat/tanween/sukoon to vocalized Hamza
  text = text.replace(/ءَ/g, 'أَ');
  text = text.replace(/ءِ/g, 'إِ');
  text = text.replace(/ءُ/g, 'أُ');
  text = text.replace(/ءْ/g, 'أْ');

  text = text.replace(/ا\u064E/g, 'أَ');
  text = text.replace(/ا\u0650/g, 'إِ');
  text = text.replace(/ا\u064F/g, 'أُ');
  text = text.replace(/ا\u0652/g, 'أْ');
  text = text.replace(/ا\u064B/g, 'أً');
  text = text.replace(/ا\u064D/g, 'إٍ');
  text = text.replace(/ا\u064C/g, 'أٌ');
  text = text.replace(/ٱ/g, 'أ');

  text = text.replace(/اَ/g, 'أَ');
  text = text.replace(/اِ/g, 'إِ');
  text = text.replace(/اُ/g, 'أُ');
  text = text.replace(/اْ/g, 'أْ');
  text = text.replace(/اً/g, 'أً');
  text = text.replace(/اٍ/g, 'إٍ');
  text = text.replace(/اٌ/g, 'أٌ');
  text = text.replace(/اٰ/g, 'ءَا');

  // Remove silent trailing Alif after Tanween Fatha
  text = text.replace(/([\u0621-\u064A])\u064B\u0627/g, '$1\u064B');

  // Normalize Urdu letter names
  text = text.replace(/(^|\s)با(\s|$)/g, '$1بَاءْ$2');
  text = text.replace(/(^|\s)تا(\s|$)/g, '$1تَاءْ$2');
  text = text.replace(/(^|\s)ثا(\s|$)/g, '$1ثَاءْ$2');
  text = text.replace(/(^|\s)حا(\s|$)/g, '$1حَاءْ$2');
  text = text.replace(/(^|\s)خا(\s|$)/g, '$1خَاءْ$2');
  text = text.replace(/(^|\s)را(\s|$)/g, '$1رَاءْ$2');
  text = text.replace(/(^|\s)طا(\s|$)/g, '$1طَاءْ$2');
  text = text.replace(/(^|\s)ظا(\s|$)/g, '$1ظَاءْ$2');
  text = text.replace(/(^|\s)فا(\s|$)/g, '$1فَاءْ$2');
  text = text.replace(/(^|\s)ہا(\s|$)/g, '$1هَاءْ$2');
  text = text.replace(/(^|\s)یا(\s|$)/g, '$1يَاءْ$2');
  text = text.replace(/(^|\s)الف(\s|$)/g, '$1أَلِفْ$2');
  text = text.replace(/(^|\s)واؤ(\s|$)/g, '$1وَاوْ$2');

  text = text.replace(/باء/g, 'بَاءْ');
  text = text.replace(/تاء/g, 'تَاءْ');
  text = text.replace(/ثاء/g, 'ثَاءْ');
  text = text.replace(/جیم/g, 'جِيمْ');
  text = text.replace(/حاء/g, 'حَاءْ');
  text = text.replace(/خاء/g, 'خَاءْ');
  text = text.replace(/دال/g, 'دَالْ');
  text = text.replace(/ذال/g, 'ذَالْ');
  text = text.replace(/راء/g, 'رَاءْ');
  text = text.replace(/(^|\s)(زا|زائی|زائے|زای|زے|زَا)($|\s)/g, '$1زَای$3');
  text = text.replace(/سین/g, 'سِيْنْ');
  text = text.replace(/شین/g, 'شِيْنْ');
  text = text.replace(/صاد/g, 'صَادْ');
  text = text.replace(/ضاد/g, 'ضَادْ');
  text = text.replace(/طاء/g, 'طَاءْ');
  text = text.replace(/ظاء/g, 'ظَاءْ');
  text = text.replace(/عین/g, 'عَيْنْ');
  text = text.replace(/غین/g, 'غَيْنْ');
  text = text.replace(/فاء/g, 'فَاءْ');
  text = text.replace(/قاف/g, 'قَافْ');
  text = text.replace(/کاف/g, 'كَافْ');
  text = text.replace(/لاَمْ/g, 'لَامْ');
  text = text.replace(/لاَم/g, 'لَامْ');
  text = text.replace(/لام/g, 'لَامْ');
  text = text.replace(/میم/g, 'مِيمْ');
  text = text.replace(/نون/g, 'نُوْنْ');
  text = text.replace(/واو/g, 'وَاوْ');
  text = text.replace(/هاء/g, 'هَاءْ');
  text = text.replace(/یاء/g, 'يَاءْ');

  const afterTrimmed = text.trim();
  if (HURUF_EXACT_PHONETICS[afterTrimmed]) {
    return HURUF_EXACT_PHONETICS[afterTrimmed];
  }

  return text;
};

export const playMashallahPraiseAudio = async (customMessage?: string): Promise<void> => {
  const phrases = [
    'ماشاء اللہ! بہت خوب!',
    'ماشاء اللہ! شاباش، بہت خوب!',
    'ماشاء اللہ! زبردست، بالکل درست جواب ہے!'
  ];
  const praise = customMessage || phrases[Math.floor(Math.random() * phrases.length)];
  await playUrduText(praise);
};

export const playChimeEffect = (type: 'success' | 'error', speakPraise: boolean = true) => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();

      if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      } else {
        const notes = [329.63, 261.63];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.25);
        });
      }
    }
  } catch (err) {
    console.error('AudioContext chime error', err);
  }

  if (type === 'success' && speakPraise) {
    setTimeout(() => {
      playMashallahPraiseAudio().catch(() => {});
    }, 150);
  }
};

export const playUrduText = (text: string, playbackRate: number = 1): Promise<void> => {
  return new Promise((resolve) => {
    stopAllQariAudio();

    // Clean text for TTS (remove emojis or symbols that disrupt TTS)
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*#]/g, '')
      .trim();

    if (!cleanText) {
      resolve();
      return;
    }

    let activeLang = 'ur';
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tqp_lang');
      if (saved) activeLang = saved;
    }

    // Try server proxy /api/tts first, then fallback Google TTS endpoints
    const ttsUrls = [
      `/api/tts?text=${encodeURIComponent(cleanText.slice(0, 300))}&lang=${activeLang}`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 300))}&tl=${activeLang}&client=tw-ob`,
      `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 300))}&tl=${activeLang}&client=gtx`
    ];

    let endpointIndex = 0;
    let handled = false;

    const tryNextEndpoint = () => {
      if (handled) return;

      if (endpointIndex < ttsUrls.length) {
        const url = ttsUrls[endpointIndex++];
        const audio = new Audio(url);
        audio.playbackRate = playbackRate;
        currentAudio = audio;

        audio.onended = () => {
          if (!handled) {
            handled = true;
            currentAudio = null;
            resolve();
          }
        };

        audio.onerror = () => tryNextEndpoint();
        audio.play().catch(() => tryNextEndpoint());
      } else {
        fallbackToUrduSpeechSynthesis(cleanText, resolve, playbackRate, activeLang);
      }
    };

    tryNextEndpoint();
  });
};

export const playInstructionAudio = playUrduText;

const fallbackToUrduSpeechSynthesis = (text: string, resolve: () => void, playbackRate: number = 1, langCode: string = 'ur') => {
  if (!('speechSynthesis' in window)) {
    resolve();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  const langMap: Record<string, string> = {
    ur: 'ur-PK',
    en: 'en-US',
    ar: 'ar-SA',
    hi: 'hi-IN',
    bn: 'bn-BD',
    id: 'id-ID',
    tr: 'tr-TR',
    fr: 'fr-FR'
  };

  const targetLocale = langMap[langCode] || 'ur-PK';
  utterance.lang = targetLocale;
  utterance.rate = 0.9 * playbackRate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => v.lang.startsWith(langCode) || v.lang.includes(targetLocale));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => resolve();
  utterance.onerror = () => resolve();

  window.speechSynthesis.speak(utterance);
};

export const playPhoneticLetterAudio = async (arabicChar: string, _key?: string): Promise<void> => {
  return playQariText(arabicChar);
};

export const playQuizFeedbackAudio = async (
  isCorrect: boolean,
  cellSpelling?: string,
  harakatName?: string
) => {
  playChimeEffect(isCorrect ? 'success' : 'error', false);

  if (isCorrect) {
    const praisePhrases = [
      'ماشاء اللہ! بالکل درست جواب ہے۔',
      'شاباش! بہت خوب، صحیح جواب ہے۔',
      'ماشاء اللہ! زبردست، درست جواب ہے۔'
    ];
    const praiseText = praisePhrases[Math.floor(Math.random() * praisePhrases.length)];
    await playUrduText(praiseText);
    if (cellSpelling) {
      await new Promise((r) => setTimeout(r, 200));
      await playQariText(cellSpelling);
    }
  } else {
    const retryText = harakatName
      ? `غلط! یہ ${harakatName} ہے۔ دوبارہ کوشش کریں۔`
      : 'غلط جواب! دوبارہ کوشش کریں۔';
    await playUrduText(retryText);
    if (cellSpelling) {
      await new Promise((r) => setTimeout(r, 200));
      await playQariText(cellSpelling);
    }
  }
};

const isArabicQuranicToken = (token: string): boolean => {
  const cleanTok = token.trim();
  if (!cleanTok) return false;

  const hasHarakat = /[\u064B-\u065F\u0670\u0656-\u0658\u06DF-\u06E8]/.test(cleanTok);
  const hasUrduOnly = /[پٹڈڑئےںآگھچھٹھڈھ]/.test(cleanTok);
  const isUrduStructureWord = /^(میں|آپ|کو|کی|کے|کا|کر|ہے|ہے۔|ہمارا|یہ|وہ|تجوید|مخرج|سبق|سوال|جواب|لیا|دیا|گیا|تھا|تھے|ہیں۔|اور|یا|سے|پر|نہ|نہیں|بھی|جب|تو|سکور|پوائنٹس|کھڑا|کھڑی|الٹا|حرکات|زبر|زیر|پیش|جزم|سکون|تشدید|تنوین|مدہ|لین|الف|ہمزہ|با|تا|ثا|جیم|حا|خا|دال|ذال|را|زا|سین|شین|صاد|ضاد|طا|ظا|عین|غین|فا|قاف|کاف|لام|میم|نون|واؤ|ہا|یا|دو|تین|چار|پانچ|=|کیسے|کیوں|کون|کیا|کب|کہاں|پڑھیں|سیکھیں|بتائیں|شاباش|درست|غلط|ماشاء|اللہ|جزاک|اللہ)$/i.test(cleanTok);

  if (isUrduStructureWord || hasUrduOnly) return false;

  // Words with harakat (fatha, kasra, damma, sukoon, shaddah, khari harakat, tanween, etc)
  if (hasHarakat) return true;

  // Quranic / Arabic tokens in pure Arabic unicode script
  if (/^[\u0621-\u064A\u0671-\u06D5]+$/.test(cleanTok)) return true;

  // Recognized Quranic words without harakat
  const normTok = normalizeArabicForMatching(cleanTok);
  return /^(الله|الرحمن|الرحيم|الحمد|رب|العالمين|قل|احد|الصمد|مالك|الدين|اياك|نعبد|نستعين|اهدنا|الصراط|المستقيم|صراط|الذين|انعمت|عليهم|الفلق|الناس|الكوثر|الفتح|الكافرون|الفاتحه|الاخلاص|تبارك|الملك)$/.test(normTok);
};

/**
 * Recites Khari Harakah spelling (ہجے) with authentic Urdu explanation followed by accurate Qari voice recitation
 */
export const playKhariHarakahSpellingAudio = async (
  letterNameUrdu: string,
  harakahNameUrdu: string,
  resultArabic: string
): Promise<void> => {
  stopAllQariAudio();
  // Example: "با کھڑا زبر" -> then "بَا"
  const spellingPrefix = `${letterNameUrdu} ${harakahNameUrdu}`;
  await playUrduText(spellingPrefix);
  await new Promise((r) => setTimeout(r, 220));
  await playQariText(resultArabic);
};

/**
 * Recites full word spelling (ہجے) cleanly, then recites the authentic word in Qari voice
 * Example for 'قٰلُوْا':
 * Speaks Urdu: "قاف کھڑا زبر قا ، لام واؤ پیش لو"
 * Then speaks Arabic: "قَالُوا" (Qālū)
 */
export const playWordWithHijjaAndPronunciation = async (
  hijjaText: string,
  finalWord: string
): Promise<void> => {
  stopAllQariAudio();

  // 1. Separate spelling part from final word if formatted like "ہجے = لفظ"
  const parts = hijjaText.split('=');
  const spellingPart = parts[0]?.trim() || hijjaText;

  // Clean and smooth out the spelling for crisp Urdu voice
  const cleanSpelling = spellingPart
    .replace(/[=]/g, '')
    .replace(/،/g, ' ، ')
    .replace(/\s+/g, ' ')
    .trim();

  // Speak spelling in Urdu
  await playUrduText(cleanSpelling);

  // Natural teacher pause
  await new Promise((r) => setTimeout(r, 350));

  // Speak authentic final word in Qari Arabic recitation
  await playQariText(finalWord);
};

export const processMixedUrduArabicText = async (text: string): Promise<void> => {
  const cleanUrdu = text
    .replace(/(?:وعلیکم\s*السلام|و\s*علیکم\s*السلام|السلام\s*علیکم)(?:\s*ورحمۃ\s*اللہ|\s*و\s*رحمۃ\s*اللہ)*(?:\s*وبرکاتہ)*/gi, '')
    .trim();

  if (!cleanUrdu) return;

  // Tokenize by space while keeping punctuation
  const words = cleanUrdu.split(/\s+/);
  let currentSegment: string[] = [];
  let currentIsArabic = false;

  for (const word of words) {
    if (!word) continue;
    const wordIsArabic = isArabicQuranicToken(word);

    if (currentSegment.length === 0) {
      currentIsArabic = wordIsArabic;
      currentSegment.push(word);
    } else if (currentIsArabic === wordIsArabic) {
      currentSegment.push(word);
    } else {
      // Flush current segment
      const phrase = currentSegment.join(' ').trim();
      if (phrase) {
        if (currentIsArabic) {
          await playQariText(phrase);
          await new Promise((r) => setTimeout(r, 200));
        } else {
          await playUrduText(phrase);
          await new Promise((r) => setTimeout(r, 200));
        }
      }
      currentSegment = [word];
      currentIsArabic = wordIsArabic;
    }
  }

  if (currentSegment.length > 0) {
    const phrase = currentSegment.join(' ').trim();
    if (phrase) {
      if (currentIsArabic) {
        await playQariText(phrase);
        await new Promise((r) => setTimeout(r, 200));
      } else {
        await playUrduText(phrase);
        await new Promise((r) => setTimeout(r, 200));
      }
    }
  }
};

/**
 * Smartly speaks AI Ustadh messages with authentic Qari Arabic pronunciation for Quranic verses / Arabic text
 * and clear Urdu voice for explanations.
 */
export const speakUstadhMessage = async (text: string, playbackRate: number = 1): Promise<void> => {
  stopAllQariAudio();

  if (!text.trim()) return;

  // Clean text from markdown bold/italics symbols
  let clean = text.replace(/[*#_]/g, '').trim();

  // If text contains Arabic Salam bracket, strip out duplicate Urdu Salam phrases immediately following it
  if (clean.includes('﴿') && clean.includes('﴾')) {
    clean = clean.replace(/(﴿[^﴾]+﴾)[\s\n]*(?:وعلیکم\s*السلام|و\s*علیکم\s*السلام|السلام\s*علیکم)(?:\s*ورحمۃ\s*اللہ|\s*و\s*رحمۃ\s*اللہ)*(?:\s*وبرکاتہ)*[!۔،\s]*/gi, '$1\n\n');
  } else {
    // If text starts with unbracketed Salam, wrap in proper Arabic diacritic brackets for Qari recitation
    clean = clean.replace(/^(?:وعلیکم\s*السلام|و\s*علیکم\s*السلام|السلام\s*علیکم)(?:\s*ورحمۃ\s*اللہ|\s*و\s*رحمۃ\s*اللہ)*(?:\s*وبرکاتہ)*[!۔،\s]*/gi, '﴿وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n');
  }

  // Split by brackets ﴿...﴾, «...», “...”, or "..."
  const bracketRegex = /([﴿«“"][^﴿»”"]+[﴾»”"])/g;
  const parts = clean.split(bracketRegex);

  for (const part of parts) {
    if (!part.trim()) continue;

    const trimmedPart = part.trim();
    const isBracketed = /^[﴿«“"]/.test(trimmedPart) && /[﴾»”"]$/.test(trimmedPart);
    const content = trimmedPart.replace(/[﴿﴾«»“”"]/g, '').trim();

    if (!content) continue;

    if (isBracketed && /[\u0600-\u06FF]/.test(content)) {
      await playQariText(content);
      await new Promise((r) => setTimeout(r, 200));
    } else {
      await playUrduText(part, playbackRate);
    }
  }
};
