// Multi-language data for IslamicLearningHub (Wudu Steps, Stories, and UI)
import { SupportedLang, MultiLangString } from './namazMultiLangData';

export interface LocalizedWuduStep {
  step: number;
  title: MultiLangString;
  desc: MultiLangString;
}

export interface LocalizedStory {
  id: number;
  title: MultiLangString;
  category: MultiLangString;
  summary: MultiLangString;
}

export const LOCALIZED_WUDU_STEPS: LocalizedWuduStep[] = [
  {
    step: 1,
    title: {
      ur: 'نیت اور بسم اللہ',
      en: 'Intention & Bismillah',
      hi: 'नीयत और बिस्मिल्लाह',
      roman: 'Niyyah aur Bismillah'
    },
    desc: {
      ur: 'دل میں وضو کی نیت کریں اور "بِسْمِ اللَّهِ" پڑھ کر دونوں ہاتھ گٹوں (کلائیوں) تک تین بار دھوئیں۔',
      en: 'Make intention for Wudu in your heart, say "Bismillah", and wash both hands up to wrists 3 times.',
      hi: 'दिल में वुज़ू की नीयत करें, "बिस्मिल्लाह" कहें और दोनों हाथ कलाइयों तक ३ बार धोएँ।',
      roman: 'Dil mein wudu ki niyat karein, "Bismillah" kahein aur dono haath kalaiyo tak 3 baar dhoye.'
    }
  },
  {
    step: 2,
    title: {
      ur: 'کلی کرنا اور ناک میں پانی ڈالنا',
      en: 'Rinsing Mouth & Sniffing Water in Nose',
      hi: 'कुल्ली करना और नाक में पानी डालना',
      roman: 'Kulli karna aur Naak mein paani daalna'
    },
    desc: {
      ur: 'دائیں ہاتھ سے تین بار منہ میں پانی لے کر اچھی طرح کلی کریں اور تین بار ناک کے نرم حصے تک پانی چڑھا کر بائیں ہاتھ سے صاف کریں۔',
      en: 'Rinse the mouth thoroughly 3 times with right hand, and sniff water into the nostrils 3 times and blow it out with the left hand.',
      hi: 'दाएँ हाथ से ३ बार मुँह में पानी लेकर कुल्ली करें और ३ बार नाक में पानी चढ़ाकर बाएँ हाथ से साफ़ करें।',
      roman: 'Dayen haath se 3 baar kulli karein aur 3 baar naak mein paani chadhakar bayen haath se saaf karein.'
    }
  },
  {
    step: 3,
    title: {
      ur: 'چہرہ دھونا',
      en: 'Washing the Entire Face',
      hi: 'चेहरा धोना',
      roman: 'Chehra Dhona'
    },
    desc: {
      ur: 'پیشانی کے بالوں کی حد سے لے کر ٹھوڑی کے نیچے تک اور ایک کان کی لو سے دوسرے کان کی لو تک پورا چہرہ تین بار دھوئیں۔',
      en: 'Wash the entire face 3 times: from the hairline of forehead to below chin, and from one earlobe to the other.',
      hi: 'माथे के बालों से लेकर ठुड्डी के नीचे तक और एक कान की लौ से दूसरे कान की लौ तक पूरा चेहरा ३ बार धोएँ।',
      roman: 'Peshani ke baalon se lekar thuddi ke neeche tak aur ek kaan ki lau se doosre kaan tak poora chehra 3 baar dhoye.'
    }
  },
  {
    step: 4,
    title: {
      ur: 'بازو کہنیوں سمیت دھونا',
      en: 'Washing Arms Up to Elbows',
      hi: 'दोनों हाथ कोहनी समेत धोना',
      roman: 'Dono Haath Kohniyo Samet Dhona'
    },
    desc: {
      ur: 'پہلے دایاں بازو کہنی سمیت تین بار دھوئیں، پھر بایاں بازو کہنی سمیت اسی طرح تین بار دھوئیں۔',
      en: 'Wash the right arm including the elbow 3 times, then wash the left arm including the elbow 3 times.',
      hi: 'पहले दायाँ हाथ कोहनी समेत ३ बार धोएँ, फिर बायाँ हाथ कोहनी समेत ३ बार धोएँ।',
      roman: 'Pehle dayan haath kohni samet 3 baar dhoye, phir bayan haath kohni samet 3 baar dhoye.'
    }
  },
  {
    step: 5,
    title: {
      ur: 'سر کا مسح اور پاؤں دھونا',
      en: 'Wiping Head (Masah) & Washing Feet',
      hi: 'सर का मसह और पैर धोना',
      roman: 'Sar ka Masah aur Pair Dhona'
    },
    desc: {
      ur: 'گیلے ہاتھوں سے پورے سر، کانوں اور گردن کا مسح کریں، پھر دونوں پاؤں ٹخنوں سمیت تین بار دھوئیں (پہلے دایاں پھر بایاں)۔',
      en: 'Wipe over entire head and ears with wet hands (Masah), then wash both feet up to the ankles 3 times (right foot first, then left).',
      hi: 'भीगे हाथों से पूरे सर और कानों का मसह करें, फिर दोनों पैर टखनों समेत ३ बार धोएँ (पहले दायाँ फिर बायाँ)।',
      roman: 'Bheege haatho se sar aur kaano ka masah karein, phir dono pair takhno samet 3 baar dhoye (pehle dayan phir bayan).'
    }
  }
];

export const LOCALIZED_ISLAMIC_STORIES: LocalizedStory[] = [
  {
    id: 1,
    title: {
      ur: 'حضرت ابراہیم علیہ السلام اور دہکتی آگ',
      en: 'Prophet Ibrahim (A.S.) & The Blazing Fire',
      hi: 'हज़रत इब्राहीम अलैहिस्सलाम और दहकती आग',
      roman: 'Hazrat Ibrahim (A.S.) aur Dehakti Aag'
    },
    category: {
      ur: 'انبیاء کے سبق آموز قصے',
      en: 'Stories of the Prophets',
      hi: 'अम्बिया के सबक़-आमोज़ क़िस्से',
      roman: 'Ambiya ke Sabaq Aamoz Qissay'
    },
    summary: {
      ur: 'جب ظالم بادشاہ نمرود نے حضرت ابراہیم علیہ السلام کو بڑی آگ میں ڈالا، تو اللہ تعالیٰ نے آگ کو حکم دیا: "اے آگ! ابراہیم پر ٹھنڈی اور سلامتی والی بن جا"۔ اور آگ نے آپ کو ذرا بھی نقصان نہ پہنچایا۔',
      en: 'When the tyrant king Nimrod threw Prophet Ibrahim into a massive roaring fire, Allah commanded the fire: "O fire, be cool and peaceful for Ibrahim!" The fire did not harm a single hair of his.',
      hi: 'जब ज़ालिम बादशाह नमरूद ने हज़रत इब्राहीम को विशाल आग में फेंका, तो अल्लाह ने आग को हुक्म दिया: "ऐ आग! इब्राहीम पर ठंडी और सलामती वाली बन जा!" आग ने उन्हें ज़रा सा भी नुक़सान नहीं पहुँचाया।',
      roman: 'Jab zalim badshah Namrood ne Hazrat Ibrahim ko aag mein phenka, toh Allah ne aag ko hukum diya: "Aye aag! Ibrahim par thandi aur salamati wali ban ja!" Aag ne unhe zara bhi nuqsan nahi pahunchaya.'
    }
  },
  {
    id: 2,
    title: {
      ur: 'حضرت یونس علیہ السلام اور مچھلی کا پیٹ',
      en: 'Prophet Yunus (A.S.) & The Whale',
      hi: 'हज़रत यूनुस अलैहिस्सलाम और मछली का पेट',
      roman: 'Hazrat Yunus (A.S.) aur Machhli ka Pait'
    },
    category: {
      ur: 'توبہ اور صبر',
      en: 'Repentance & Patience',
      hi: 'तौबा और सब्र',
      roman: 'Tauba aur Sabr'
    },
    summary: {
      ur: 'سمندر کی گہرائیوں اور مچھلی کے پیٹ کے گھپ اندھیرے میں حضرت یونس علیہ السلام نے کثرت سے یہ دعا پڑھی: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ"۔ اللہ تعالیٰ نے ان کی توبہ قبول فرمائی اور بحفاظت ساحل پر پہنچا دیا۔',
      en: 'In the deep ocean inside the belly of the whale, Prophet Yunus pleaded: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." Allah accepted his plea and delivered him safely.',
      hi: 'समंदर की गहराइयों और मछली के पेट के अंधेरे में हज़रत यूनुस अलैहिस्सलाम ने दुआ पढ़ी: "ला इलाहा इल्ला अंता सुब्हानका इन्नी कुंतु मिनज़-ज़ालिमीन"। अल्लाह ने उनकी तौबा क़बूल फ़रमाई और हिफ़ाज़त से बाहर निकाला।',
      roman: 'Samandar ki gehraiyon aur machhli ke pait ke andhere mein Hazrat Yunus ne dua padhi: "La ilaha illa Anta subhanaka inni kuntu minaz-zalimeen". Allah ne unki dua qubool farmai aur hifazat se nikal diya.'
    }
  },
  {
    id: 3,
    title: {
      ur: 'سچائی کا انعام اور والدین کی خدمت',
      en: 'The Reward of Truthfulness & Honoring Parents',
      hi: 'सच्चाई का इनाम और वालिदैन की ख़िदमत',
      roman: 'Sachchai ka Inam aur Walidain ki Khidmat'
    },
    category: {
      ur: 'اسلامی اخلاقیات و کردار',
      en: 'Islamic Ethics & Character',
      hi: 'इस्लामी अख़लाक़ियात व किरदार',
      roman: 'Islami Akhlaqiaat wa Kirdaar'
    },
    summary: {
      ur: 'ایک نوجوان شیخ عبد القادر جیلانی جب بچپن میں سفر پر نکلے تو والدہ کی نصیحت کے مطابق ڈاکوؤں کے سامنے بھی ہمیشہ سچ بولا کہ میرے کرتے میں دینار سلے ہوئے ہیں۔ ان کے سچ نے تمام ڈاکوؤں کو تائب اور نیک بنا دیا۔',
      en: 'As a young boy on a journey, Sheikh Abdul Qadir Jilani remembered his mother’s advice to never lie. When bandits confronted him, he truthfully admitted where his gold coins were hidden. His truthfulness touched the bandits’ hearts and led them to repent.',
      hi: 'शेख़ अब्दुल क़ादिर जीलानी जब बचपन में सफ़र पर निकले तो माँ की नसीहत पर डाकुओं के सामने भी सच बोला कि मेरे कुर्ते में अशर्फ़ियाँ सिली हैं। उनकी सच्चाई से मुतास्सिर होकर तमाम डाकुओं ने तौबा कर ली।',
      roman: 'Sheikh Abdul Qadir Jilani ne safar ke dauran maa ki naseehat par dakuyo ke samne bhi sach bola. Unki sachchai dekh kar tamam dakuyo ne tauba kar li aur naik ban gaye.'
    }
  }
];

export const LOCALIZED_HUB_TEXTS = {
  headerTitle: {
    ur: 'اسلامی تعلیمات و تربیتی مرکز',
    en: 'Islamic Learning & Practice Hub',
    hi: 'इस्लामी तालीमात व तरबियती केंद्र',
    roman: 'Islami Taleemat wa Tarbiyati Hub'
  },
  headerSubtitle: {
    ur: 'نماز، وضو، صبح و شام کے مسنون اذکار، 99 نام اور کہانیاں',
    en: 'Namaz Guide, Wudu Steps, Daily Masnoon Azkar, 99 Names, & Stories',
    hi: 'नमाज़, वुज़ू, मसनून अज़कार, ९९ मुबारक नाम और कहानियाँ',
    roman: 'Namaz, Wudu, Masnoon Azkar, 99 Asma-ul-Husna aur Kahaniyan'
  },
  backButton: {
    ur: 'واپسی',
    en: 'Back',
    hi: 'वापस',
    roman: 'Wapasi'
  },
  tabs: {
    namaz: {
      ur: '🕌 نماز کا طریقہ و نقشہ رکعات',
      en: '🕌 Namaz Guide & Rakahs',
      hi: '🕌 नमाज़ तरीक़ा व नक़्शा-ए-रकअत',
      roman: '🕌 Namaz Tareeqa & Rakahs'
    },
    wudu: {
      ur: '💧 وضو کا طریقہ',
      en: '💧 Wudu Steps',
      hi: '💧 वुज़ू का तरीक़ा',
      roman: '💧 Wudu ka Tareeqa'
    },
    azkar: {
      ur: '🌅 مسنون اذکار (کتاب)',
      en: '🌅 Masnoon Azkar (Book)',
      hi: '🌅 मसनून अज़कार (किताब)',
      roman: '🌅 Masnoon Azkar (Kitab)'
    },
    names: {
      ur: '✨ اسماء الحسنیٰ (99 Names)',
      en: '✨ 99 Names of Allah',
      hi: '✨ अस्माउल हुस्ना (९९ नाम)',
      roman: '✨ Asma-ul-Husna (99 Names)'
    },
    stories: {
      ur: '📚 اسلامی کہانیاں',
      en: '📚 Islamic Stories',
      hi: '📚 इस्लामी कहानियाँ',
      roman: '📚 Islami Kahaniyan'
    }
  },
  wuduSectionTitle: {
    ur: '💧 وضو کا طریقہ (قدم بہ قدم)',
    en: '💧 Wudu (Ablution) Step by Step',
    hi: '💧 वुज़ू का तरीक़ा (क़दम-ब-क़दम)',
    roman: '💧 Wudu ka Tareeqa (Step by Step)'
  },
  namesSectionTitle: {
    ur: '✨ اللہ پاک کے ۹۹ بابرکت نام (اسماء الحسنیٰ)',
    en: '✨ 99 Blessed Names of Allah (Asma-ul-Husna)',
    hi: '✨ अल्लाह तआला के ९९ मुबारक नाम (अस्माउल हुस्ना)',
    roman: '✨ Allah Paak ke 99 Mubarak Naam (Asma-ul-Husna)'
  },
  storiesSectionTitle: {
    ur: '📚 بچوں کے لیے پیاری اسلامی کہانیاں',
    en: '📚 Inspiring Islamic Stories for Children',
    hi: '📚 बच्चों के लिए प्यारी इस्लामी कहानियाँ',
    roman: '📚 Bachon ke liye Islami Kahaniyan'
  },
  playAll: {
    ur: 'مکمل تلاوت سنیں',
    en: 'Listen All 99 Names',
    hi: 'मुकम्मल तिलावत सुनें',
    roman: 'Mukammal Tilawat Sunein'
  },
  stopAll: {
    ur: 'تلاوت روکیں',
    en: 'Stop Audio',
    hi: 'तिलावत रोकें',
    roman: 'Tilawat Rokein'
  }
};
