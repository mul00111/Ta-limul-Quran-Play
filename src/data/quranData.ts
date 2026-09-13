import { Surah, QaidaLetter, DuaItem, QuizQuestion } from '../types';

export const sampleSurahs: Surah[] = [
  {
    number: 1,
    name: "سُورَةُ ٱلفَاتِحَةِ",
    englishName: "Al-Fatiha",
    englishNameTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
    verses: [
      {
        numberInSurah: 1,
        text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        transliteration: "Bismillaahi ar-rahmaani ar-raheem"
      },
      {
        numberInSurah: 2,
        text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        transliteration: "Al-hamdu lillahi rabbi al-'alameen"
      },
      {
        numberInSurah: 3,
        text: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful,",
        transliteration: "Ar-rahmaani ar-raheem"
      },
      {
        numberInSurah: 4,
        text: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense.",
        transliteration: "Maaliki yawmi ad-deen"
      },
      {
        numberInSurah: 5,
        text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help.",
        transliteration: "Iyyaaka na'budu wa iyyaaka nasta'een"
      },
      {
        numberInSurah: 6,
        text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path -",
        transliteration: "Ihdina as-sirata al-mustaqeem"
      },
      {
        numberInSurah: 7,
        text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        transliteration: "Sirata alladhina an'amta 'alayhim ghayril maghdubi 'alayhim wala ad-dalleen"
      }
    ]
  },
  {
    number: 112,
    name: "سُورَةُ الإِخْلَاصِ",
    englishName: "Al-Ikhlas",
    englishNameTranslation: "The Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan",
    verses: [
      {
        numberInSurah: 1,
        text: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, \"He is Allah , [who is] One,",
        transliteration: "Qul huwa Allahu ahad"
      },
      {
        numberInSurah: 2,
        text: "اللَّهُ الصَّمَدُ",
        translation: "Allah , the Eternal Refuge.",
        transliteration: "Allahu as-samad"
      },
      {
        numberInSurah: 3,
        text: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "He neither begets nor is born,",
        transliteration: "Lam yalid walam yulad"
      },
      {
        numberInSurah: 4,
        text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translation: "Nor is there to Him any equivalent.\"",
        transliteration: "Walam yakun lahu kufuwan ahad"
      }
    ]
  },
  {
    number: 113,
    name: "سُورَةُ الفَلَقِ",
    englishName: "Al-Falaq",
    englishNameTranslation: "The Daybreak",
    numberOfAyahs: 5,
    revelationType: "Meccan",
    verses: [
      {
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translation: "Say, \"I seek refuge in the Lord of daybreak",
        transliteration: "Qul a'oodhu bi rabbi al-falaq"
      },
      {
        numberInSurah: 2,
        text: "مِن شَرِّ مَا خَلَقَ",
        translation: "From the evil of that which He created",
        transliteration: "Min sharri ma khalaq"
      },
      {
        numberInSurah: 3,
        text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translation: "And from the evil of darkness when it settles",
        transliteration: "Wamin sharri ghasiqin idha waqab"
      },
      {
        numberInSurah: 4,
        text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translation: "And from the evil of the blowers in knots",
        transliteration: "Wamin sharri an-naffathati fi al-'uqad"
      },
      {
        numberInSurah: 5,
        text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translation: "And from the evil of an envier when he envies.\"",
        transliteration: "Wamin sharri hasidin idha hasad"
      }
    ]
  },
  {
    number: 114,
    name: "سُورَةُ النَّاسِ",
    englishName: "An-Nas",
    englishNameTranslation: "Mankind",
    numberOfAyahs: 6,
    revelationType: "Meccan",
    verses: [
      {
        numberInSurah: 1,
        text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Say, \"I seek refuge in the Lord of mankind,",
        transliteration: "Qul a'oodhu bi rabbi an-nas"
      },
      {
        numberInSurah: 2,
        text: "مَلِكِ النَّاسِ",
        translation: "The Sovereign of mankind,",
        transliteration: "Maliki an-nas"
      },
      {
        numberInSurah: 3,
        text: "إِلَهِ النَّاسِ",
        translation: "The God of mankind,",
        transliteration: "Ilahi an-nas"
      },
      {
        numberInSurah: 4,
        text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translation: "From the evil of the retreating whisperer -",
        transliteration: "Min sharri al-waswasi al-khannas"
      },
      {
        numberInSurah: 5,
        text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translation: "Who whispers [evil] into the breasts of mankind -",
        transliteration: "Alladhi yuwaswisu fi sudoori an-nas"
      },
      {
        numberInSurah: 6,
        text: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translation: "From jinn and mankind.\"",
        transliteration: "Mina al-jinnati wa an-nas"
      }
    ]
  },
  {
    number: 67,
    name: "سُورَةُ المُلْكِ",
    englishName: "Al-Mulk",
    englishNameTranslation: "The Sovereignty",
    numberOfAyahs: 3,
    revelationType: "Meccan",
    verses: [
      {
        numberInSurah: 1,
        text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
        transliteration: "Tabaraka alladhi biyadihi al-mulku wahuwa 'ala kulli shay-in qadeer"
      },
      {
        numberInSurah: 2,
        text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
        transliteration: "Alladhi khalaq_al-mawta wa al-hayata liyabluwakum ayukum ahsanu 'amalan wahuwa al-'azeezu al-ghafoor"
      },
      {
        numberInSurah: 3,
        text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        translation: "[Who] created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return your vision [to the sky]; do you see any breaks?",
        transliteration: "Alladhi khalaq_sab'a samawatin tabaqan ma tara fi khalqi ar-rahmani min tafawutin farji'i al-basara hal tara min futoor"
      }
    ]
  }
];

export const qaidaLetters: QaidaLetter[] = [
  { id: 1, arabic: "ا", name: "أَلِفْ (Alif)", transliteration: "A / Ā", makhraj: "جوف دہن (منہ اور حلق کا خلا)", soundExample: "ah", description: "جوف دہن یعنی منہ کے خالی خلا سے ادا ہوتا ہے (حروفِ مدہ)" },
  { id: 2, arabic: "ب", name: "بَاءْ (Baa)", transliteration: "B", makhraj: "دونوں ہونٹوں کا تر حصہ", soundExample: "ba", description: "ب دونوں ہونٹوں کے تر حصے سے ادا ہوتا ہے (حروفِ شفویہ)" },
  { id: 3, arabic: "ت", name: "تَاءْ (Taa)", transliteration: "T", makhraj: "زبان کی نوک اور اوپر کے دانتوں کی جڑ", soundExample: "ta", description: "زبان کی نوک اور اوپر کے دانتوں کی جڑ سے ادا ہوتی ہے (حروفِ نطيّہ)" },
  { id: 4, arabic: "ث", name: "ثَاءْ (Thaa)", transliteration: "Th", makhraj: "زبان کا سرا اور اوپر کے دانتوں کا کنارہ", soundExample: "tha", description: "زبان کا سرا اور اوپر کے دانتوں کے اندرونی کنارے سے ادا ہوتی ہے (حروفِ لثویّہ)" },
  { id: 5, arabic: "ج", name: "جِيْمْ (Jeem)", transliteration: "J", makhraj: "زبان کا درمیان اور تالو", soundExample: "ja", description: "زبان کے درمیان اور تالو کے درمیان سے ادا ہوتی ہے (حروفِ شجریّہ)" },
  { id: 6, arabic: "ح", name: "حَاءْ (Haa)", transliteration: "Ḥ", makhraj: "حلق کا درمیانی حصہ (وسط الحلق)", soundExample: "ḥa", description: "حلق کے درمیان والے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" },
  { id: 7, arabic: "خ", name: "خَاءْ (Khaa)", transliteration: "Kh", makhraj: "حلق کا اوپر والا حصہ (أدنى الحلق)", soundExample: "kha", description: "حلق کے اوپر والے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" },
  { id: 8, arabic: "د", name: "دَالْ (Daal)", transliteration: "D", makhraj: "زبان کی نوک اور اوپر کے دانتوں کی جڑ", soundExample: "da", description: "زبان کی نوک اور اوپر کے دانتوں کی جڑ سے ادا ہوتی ہے (حروفِ نطيّہ)" },
  { id: 9, arabic: "ذ", name: "ذَالْ (Zhaal)", transliteration: "Dh", makhraj: "زبان کا سرا اور اوپر کے دانتوں کا کنارہ", soundExample: "dha", description: "زبان کا سرا اور اوپر کے دانتوں کے اندرونی کنارے سے ادا ہوتی ہے (حروفِ لثویّہ)" },
  { id: 10, arabic: "ر", name: "رَاءْ (Raa)", transliteration: "R", makhraj: "زبان کی نوک اور مقابل کا تالو", soundExample: "ra", description: "زبان کی نوک اور مقابل کے تالو سے ادا ہوتی ہے (حروفِ طرفيّة)" },
  { id: 11, arabic: "ز", name: "زَايْ (Zay)", transliteration: "Z", makhraj: "زبان کی نوک اور دونوں دانتوں کے کنارے", soundExample: "za", description: "زبان کی نوک اور دونوں دانتوں کے اندرونی کنارے سے ادا ہوتی ہے (حروفِ صفيريّة)" },
  { id: 12, arabic: "س", name: "سِيْنْ (Seen)", transliteration: "S", makhraj: "زبان کی نوک اور دونوں دانتوں کے کنارے", soundExample: "sa", description: "زبان کی نوک اور دونوں دانتوں کے اندرونی کنارے سے ادا ہوتی ہے (حروفِ صفيريّة)" },
  { id: 13, arabic: "ش", name: "شِيْنْ (Sheen)", transliteration: "Sh", makhraj: "زبان کا درمیان اور تالو", soundExample: "sha", description: "زبان کے درمیان اور تالو کے درمیان سے ادا ہوتی ہے (حروفِ شجریّہ)" },
  { id: 14, arabic: "ص", name: "صَادْ (Saad)", transliteration: "Ṣ", makhraj: "زبان کی نوک اور دانتوں کے کنارے (پُر)", soundExample: "ṣa", description: "زبان کی نوک اور دونوں دانتوں کے اندرونی کنارے سے پر آواز کے ساتھ (حروفِ صفيريّة)" },
  { id: 15, arabic: "ض", name: "ضَادْ (Daad)", transliteration: "Ḍ", makhraj: "زبان کی کروٹ اور اوپر کی داڑھوں کی جڑ", soundExample: "ḍa", description: "زبان کی کروٹ اور اوپر کی داڑھوں کی جڑ سے ادا ہوتی ہے (حروفِ حافيّة)" },
  { id: 16, arabic: "ط", name: "طَاءْ (Taa)", transliteration: "Ṭ", makhraj: "زبان کی نوک اور اوپر کے دانتوں کی جڑ (پُر)", soundExample: "ṭa", description: "زبان کی نوک اور اوپر کے دانتوں کی جڑ سے پر آواز کے ساتھ (حروفِ نطيّہ)" },
  { id: 17, arabic: "ظ", name: "ظَاءْ (Zhaa)", transliteration: "Ẓ", makhraj: "زبان کا سرا اور اوپر کے دانتوں کا کنارہ (پُر)", soundExample: "ẓa", description: "زبان کا سرا اور اوپر کے دانتوں کے اندرونی کنارے سے پر آواز کے ساتھ (حروفِ لثویّہ)" },
  { id: 18, arabic: "ع", name: "عَيْنْ (Ayn)", transliteration: "‘", makhraj: "حلق کا درمیانی حصہ (وسط الحلق)", soundExample: "'a", description: "حلق کے درمیان والے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" },
  { id: 19, arabic: "غ", name: "غَيْنْ (Ghayn)", transliteration: "Gh", makhraj: "حلق کا اوپر والا حصہ (أدنى الحلق)", soundExample: "gha", description: "حلق کے اوپر والے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" },
  { id: 20, arabic: "ف", name: "فَاءْ (Faa)", transliteration: "F", makhraj: "اوپر کے دانت اور نچلے ہونٹ کا تر حصہ", soundExample: "fa", description: "اوپر کے دانتوں کے کنارے اور نچلے ہونٹ کے تر حصے سے (حروفِ شفویہ)" },
  { id: 21, arabic: "ق", name: "قَافْ (Qaaf)", transliteration: "Q", makhraj: "زبان کی جڑ اور تالو کا نرم حصہ", soundExample: "qa", description: "زبان کی جڑ اور تالو کے نرم حصے سے ادا ہوتی ہے (حروفِ لهويّة)" },
  { id: 22, arabic: "ك", name: "كَافْ (Kaaf)", transliteration: "K", makhraj: "زبان کی جڑ اور تالو کا سخت حصہ", soundExample: "ka", description: "زبان کی جڑ اور تالو کے سخت حصے سے ادا ہوتی ہے (حروفِ لهويّة)" },
  { id: 23, arabic: "ل", name: "لَامْ (Laam)", transliteration: "L", makhraj: "زبان کا کنارہ اور مسوڑھے", soundExample: "la", description: "زبان کا کنارہ اور ضواحک سے ثنایا تک کے مسوڑھوں سے ادا ہوتی ہے" },
  { id: 24, arabic: "م", name: "مِيْمْ (Meem)", transliteration: "M", makhraj: "دونوں ہونٹوں کا خشک حصہ (غنہ)", soundExample: "ma", description: "دونوں ہونٹوں کے خشک حصے سے غنہ کے ساتھ ادا ہوتی ہے (حروفِ شفویہ)" },
  { id: 25, arabic: "ن", name: "نُوْنْ (Noon)", transliteration: "N", makhraj: "زبان کا کنارہ اور دانتوں کی جڑ (غنہ)", soundExample: "na", description: "زبان کا کنارہ اور انیاب سے ثنایا تک کے دانتوں کی جڑ سے (خیشوم غنہ)" },
  { id: 26, arabic: "ه", name: "هَاءْ (Haa)", transliteration: "H", makhraj: "حلق کا نیچے والا حصہ (أقصى الحلق)", soundExample: "ha", description: "حلق کے نیچے والے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" },
  { id: 27, arabic: "و", name: "وَاوْ (Waw)", transliteration: "W / Ū", makhraj: "دونوں ہونٹوں کی گولائی", soundExample: "wa", description: "دونوں ہونٹوں کی گولائی سے ادا ہوتی ہے (حروفِ شفویہ ومدّہ)" },
  { id: 28, arabic: "ي", name: "يَاءْ (Yaa)", transliteration: "Y / Ī", makhraj: "زبان کا درمیان اور تالو", soundExample: "ya", description: "زبان کے درمیان اور تالو کے درمیان سے ادا ہوتی ہے (حروفِ شجریّہ ومدّہ)" },
  { id: 29, arabic: "ء", name: "هَمْزَة (Hamza)", transliteration: "Hamza", makhraj: "حلق کا نچلا حصہ (أقصى الحلق)", soundExample: "'a", description: "حلق کے نچلے حصے سے ادا ہوتی ہے (حروفِ حلقیہ)" }
];

export const sampleDuas: DuaItem[] = [
  {
    id: "dua-1",
    category: "Daily & Morning",
    title: "Upon Waking Up",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushoor",
    translation: "Praise is to Allah who has given us life after He has caused us to die and to Him is the return.",
    benefit: "Expressing gratitude for waking up to a new day of life and worship."
  },
  {
    id: "dua-2",
    category: "Knowledge & Study",
    title: "For Increasing Knowledge",
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "My Lord, increase me in knowledge.",
    benefit: "Recommended when studying the Quran, sciences, or seeking beneficial wisdom."
  },
  {
    id: "dua-3",
    category: "Forgiveness & Protection",
    title: "Seeking Forgiveness (Sayyid al-Istighfar)",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    transliteration: "Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduka...",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant...",
    benefit: "The master prayer for forgiveness and protection from sin."
  },
  {
    id: "dua-4",
    category: "Patience & Ease",
    title: "In Times of Difficulty",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "Hasbunallahu wa ni'mal wakeel",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    benefit: "Instills peace and reliance upon Allah during trials."
  }
];

export const sampleQuizzes: QuizQuestion[] = [
  {
    id: 1,
    question: "How many Surahs are in the Holy Quran?",
    options: ["110", "114", "120", "99"],
    correctIndex: 1,
    explanation: "The Holy Quran has 114 Surahs, starting with Surah Al-Fatiha and ending with Surah An-Nas.",
    category: "Quran Basics"
  },
  {
    id: 2,
    question: "Which Surah is known as the Heart of the Quran?",
    options: ["Surah Al-Mulk", "Surah Al-Baqarah", "Surah Yaseen", "Surah Ar-Rahman"],
    correctIndex: 2,
    explanation: "Prophet Muhammad (PBUH) stated that everything has a heart, and the heart of the Quran is Surah Yaseen.",
    category: "Surah Knowledge"
  },
  {
    id: 3,
    question: "What is the longest Surah in the Holy Quran?",
    options: ["Surah Al-Imran", "Surah Al-Baqarah", "Surah An-Nisa", "Surah Al-Ma'idah"],
    correctIndex: 1,
    explanation: "Surah Al-Baqarah is the longest Surah in the Quran with 286 verses.",
    category: "Quran Structure"
  },
  {
    id: 4,
    question: "In which month was the Holy Quran first revealed?",
    options: ["Rajab", "Dhul-Hijjah", "Ramadan", "Muharram"],
    correctIndex: 2,
    explanation: "The Quran began to be revealed to Prophet Muhammad (PBUH) in the blessed month of Ramadan during Laylat al-Qadr.",
    category: "Islamic History"
  }
];
