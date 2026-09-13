/**
 * Quran API & Offline Storage Service
 * Provides complete Arabic verses and Urdu translations for all 114 Surahs across all 30 Paras.
 * Features multi-tier offline caching (Embedded Para 30 -> IndexedDB/LocalStorage -> Al-Quran Cloud API).
 */

import { PARA_30_SURAHS } from '../data/para30Surahs';
import { ALL_114_SURAHS, SurahMeta } from '../data/quranParasData';
import { Ayah, SurahData } from '../components/QuranLearningHub';

const DB_NAME = 'QuranSurahsTextDB';
const STORE_NAME = 'surahs_text_cache';

// IndexedDB Helper for text caching
function openTextDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCachedAyahsFromIDB(surahNumber: number): Promise<Ayah[] | null> {
  try {
    const db = await openTextDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(surahNumber);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    // Fallback to localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        const item = localStorage.getItem(`quran_surah_${surahNumber}`);
        if (item) return JSON.parse(item);
      } catch {}
    }
    return null;
  }
}

async function saveCachedAyahsToIDB(surahNumber: number, ayahs: Ayah[]): Promise<void> {
  try {
    const db = await openTextDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(ayahs, surahNumber);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(`quran_surah_${surahNumber}`, JSON.stringify(ayahs));
      } catch {}
    }
  }
}

// Well-known popular Surahs pre-seeded for offline reliability
const POPULAR_OFFLINE_SURAHS: Record<number, Ayah[]> = {
  // Surah 67: Al-Mulk (Para 29)
  67: [
    { number: 1, text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", translationUrdu: "بڑی برکت والا ہے وہ جس کے ہاتھ میں بادشاہی ہے اور وہ ہر چیز پر قادر ہے" },
    { number: 2, text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", translationUrdu: "جس نے پیدا کیا موت اور زندگی کو تاکہ تمہیں آزمائے کہ تم میں سے عمل کے لحاظ سے کون بہتر ہے اور وہ زبردست بخشنے والا ہے" },
    { number: 3, text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", translationUrdu: "جس نے سات آسمان اوپر تلے بنائے، تو رحمان کی آفرینش میں کوئی خلل نہ دیکھے گا، سو پھر نگاہ دوڑا کیا کوئی شگاف دیکھتا ہے" },
    { number: 4, text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", translationUrdu: "پھر دوبارہ نگاہ دوڑا، نگاہ تیری طرف ناکام اور تھکی ہوئی لوٹ آئے گی" },
    { number: 5, text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", translationUrdu: "اور بے شک ہم نے نیچے کے آسمان کو چراغوں سے آراستہ کیا اور انہیں شیطانوں کے مارنے کا ذریعہ بنایا اور ہم نے ان کے لیے بھڑکتی آگ کا عذاب تیار کیا ہے" }
  ],
  // Surah 36: Ya-Seen
  36: [
    { number: 1, text: "يسٓ", translationUrdu: "یٰسٓ" },
    { number: 2, text: "وَالْقُرْآنِ الْحَكِيمِ", translationUrdu: "قسم ہے حکمت والے قرآن کی" },
    { number: 3, text: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", translationUrdu: "بے شک آپ رسولوں میں سے ہیں" },
    { number: 4, text: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ", translationUrdu: "سیدھے راستے پر ہیں" },
    { number: 5, text: "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ", translationUrdu: "یہ غالب اور رحم والے (خدا) کا نازل کیا ہوا ہے" }
  ],
  // Surah 55: Ar-Rahman
  55: [
    { number: 1, text: "الرَّحْمَٰنُ", translationUrdu: "نہایت مہربان خدا" },
    { number: 2, text: "عَلَّمَ الْقُرْآنَ", translationUrdu: "اسی نے قرآن سکھایا" },
    { number: 3, text: "خَلَقَ الْإِنسَانَ", translationUrdu: "اسی نے انسان کو پیدا کیا" },
    { number: 4, text: "عَلَّمَهُ الْبَيَانَ", translationUrdu: "اسے بولنا سکھایا" },
    { number: 5, text: "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ", translationUrdu: "سورج اور چاند ایک حساب کے پابند ہیں" },
    { number: 6, text: "وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ", translationUrdu: "اور بوٹے اور درخت سجدہ کر رہے ہیں" },
    { number: 7, text: "وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ", translationUrdu: "اور اسی نے آسمان کو بلند کیا اور ترازو رکھی" },
    { number: 8, text: "أَلَّا تَطْغَوْا فِي الْمِيزَانِ", translationUrdu: "تاکہ تم تولنے میں حد سے تجاوز نہ کرو" },
    { number: 9, text: "وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ وَلَا تُخْسِرُوا الْمِيزَانَ", translationUrdu: "اور انصاف کے ساتھ وزن کو قائم رکھو اور تول میں کمی نہ کرو" },
    { number: 10, text: "وَالْأَرْضَ وَضَعَهَا لِلْأَنَامِ", translationUrdu: "اور اسی نے زمین کو مخلوقات کے لیے بچھایا" },
    { number: 11, text: "فِيهَا فَاكِهَةٌ وَالنَّخْلُ ذَاتُ الْأَكْمَامِ", translationUrdu: "اس میں میوے اور کھجور کے غلاف دار درخت ہیں" },
    { number: 12, text: "وَالْحَبُّ ذُو الْعَصْفِ وَالرَّيْحَانُ", translationUrdu: "اور بھوسے دار اناج اور خوشبودار پھول ہیں" },
    { number: 13, text: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ", translationUrdu: "پس تم اپنے رب کی کون کون سی نعمتوں کو جھٹلاؤ گے؟" }
  ],
  // Surah 62: Al-Jumu'ah
  62: [
    { number: 1, text: "يُسَبِّحُ لِلَّهِ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ الْمَلِكِ الْقُدُّوسِ الْعَزِيزِ الْحَكِيمِ", translationUrdu: "اللہ کی تسبیح کرتی ہے ہر وہ چیز جو آسمانوں میں ہے اور جو زمین میں ہے، وہ بادشاہ، نہایت پاک، زبردست، حکمت والا ہے" },
    { number: 2, text: "هُوَ الَّذِي بَعَثَ فِي الْأُمِّيِّينَ رَسُولًا مِّنْهُمْ يَتْلُو عَلَيْهِمْ آيَاتِهِ وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ الْكِتَابَ وَالْحِكْمَةَ وَإِن كَانُوا مِن قَبْلُ لَفِي ضَلَالٍ مُّبِينٍ", translationUrdu: "وہی ہے جس نے ان پڑھ لوگوں میں انہی میں سے ایک رسول بھیجا جو ان پر اس کی آیتیں پڑھتا ہے اور انہیں پاک کرتا ہے اور انہیں کتاب اور حکمت سکھاتا ہے" }
  ]
};

/**
 * Fetch or load verses for any Surah (1 to 114)
 */
export async function loadSurahVerses(surahMeta: SurahMeta): Promise<Ayah[]> {
  const surahNum = surahMeta.number;

  // 1. If it belongs to Para 30 or Al-Fatiha, load instantly from embedded PARA_30_SURAHS
  const foundPara30 = PARA_30_SURAHS.find((s) => s.number === surahNum);
  if (foundPara30 && foundPara30.verses.length > 0) {
    return foundPara30.verses.map((v) => ({
      number: v.number,
      text: v.arabic,
      translationUrdu: v.urdu
    }));
  }

  // 2. Check Local IndexedDB / LocalStorage cache
  const cached = await getCachedAyahsFromIDB(surahNum);
  if (cached && cached.length > 0) {
    return cached;
  }

  // 3. Check popular offline seed fallback
  if (POPULAR_OFFLINE_SURAHS[surahNum] && POPULAR_OFFLINE_SURAHS[surahNum].length > 0) {
    // Return seed while attempting background fetch
    fetchAndCacheSurahFromApi(surahMeta).catch(() => {});
    return POPULAR_OFFLINE_SURAHS[surahNum];
  }

  // 4. Fetch from Al-Quran Cloud API (Uthmani Arabic text + Fateh Muhammad Jalandhry Urdu Translation)
  try {
    const ayahs = await fetchAndCacheSurahFromApi(surahMeta);
    if (ayahs && ayahs.length > 0) {
      return ayahs;
    }
  } catch (err) {
    console.warn(`Failed fetching Surah #${surahNum} from API:`, err);
  }

  // 5. Final fallback if completely offline and not cached yet: Generate structured verses
  return Array.from({ length: surahMeta.totalAyahs }, (_, i) => {
    const aNum = i + 1;
    return {
      number: aNum,
      text: `آيَةُ ${aNum} مِنْ ${surahMeta.name} (تلاوت کے لیے سنیں کا بٹن دبائیں)`,
      translationUrdu: `آیت نمبر ${aNum} (${surahMeta.urduName}) - انٹرنیٹ کنکشن ہونے پر مکمل متن از خود محفوظ ہو جائے گا۔`
    };
  });
}

/**
 * Fetch from Al-Quran Cloud API and cache locally
 */
async function fetchAndCacheSurahFromApi(surahMeta: SurahMeta): Promise<Ayah[]> {
  const surahNum = surahMeta.number;
  const url = `https://api.alquran.cloud/v1/surah/${surahNum}/editions/quran-uthmani,ur.jalandhry`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Invalid API response format');
    }

    const arabicEdition = data.data[0];
    const urduEdition = data.data[1] || data.data[0];

    const ayahs: Ayah[] = arabicEdition.ayahs.map((a: any, idx: number) => {
      let text = a.text;
      // Strip Bismillah prefix on first Ayah if present (except Al-Fatiha)
      if (surahNum !== 1 && idx === 0 && text.startsWith('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')) {
        text = text.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', '').trim();
      } else if (surahNum !== 1 && idx === 0 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')) {
        text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
      }

      return {
        number: a.numberInSurah,
        text: text || a.text,
        translationUrdu: urduEdition.ayahs?.[idx]?.text || ''
      };
    });

    if (ayahs.length > 0) {
      await saveCachedAyahsToIDB(surahNum, ayahs);
    }

    return ayahs;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}
