// Multi-language data for Namaz Guide, Prayer Times, Rakahs Chart, Duas, and Sharaait
// Supporting Urdu (اردو), English, Hindi (हिन्दी), and Roman Urdu

export type SupportedLang = 'ur' | 'en' | 'hi' | 'roman';

export interface MultiLangString {
  ur: string;
  en: string;
  hi: string;
  roman: string;
}

export interface LocalizedPrayerTime {
  id: string;
  name: MultiLangString;
  arabicName: string;
  definition: MultiLangString;
  color: string;
  borderColor: string;
  textColor: string;
}

export interface LocalizedPrayerRakah {
  id: string;
  prayer: MultiLangString;
  total: number;
  sunnahPrior: number | null;
  isSunnahPriorMuakkadah?: boolean;
  fard: number;
  sunnahPost: number | null;
  isSunnahPostMuakkadah?: boolean;
  sunnahPostAlt?: string;
  nafl1: number | null;
  wajib: number | null;
  wajibText?: MultiLangString;
  nafl2: number | null;
  orderDescription: MultiLangString;
}

export interface LocalizedSpecialPrayer {
  id: string;
  title: MultiLangString;
  rakahs: MultiLangString;
  note: MultiLangString;
  badge: MultiLangString;
}

export interface LocalizedNamazStep {
  step: number;
  title: MultiLangString;
  desc: MultiLangString;
  arabic: string;
  transliteration: string;
  translation: MultiLangString;
  timing: MultiLangString;
}

export interface LocalizedCondition {
  number: number;
  title: MultiLangString;
  desc: MultiLangString;
}

// 1. PRAYER TIMES DEFINITIONS
export const LOCALIZED_PRAYER_TIMES: LocalizedPrayerTime[] = [
  {
    id: 'fajr',
    name: {
      ur: 'فجر کا وقت',
      en: 'Fajr Time',
      hi: 'फ़ज्र का वक़्त',
      roman: 'Fajr ka Waqt'
    },
    arabicName: 'صَلَاةُ الْفَجْرِ',
    definition: {
      ur: 'صبح صادق سے آفتاب نکلنے تک ہے۔',
      en: 'From dawn (Subh Sadiq) until the sun begins to rise.',
      hi: 'सुबह सादिक़ से लेकर सूरज निकलने तक है।',
      roman: 'Subah Sadiq se lekar sooraj nikalne tak hai.'
    },
    color: 'from-amber-500/20 to-emerald-900/30',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-300'
  },
  {
    id: 'zuhr',
    name: {
      ur: 'ظہر کا وقت',
      en: 'Zuhr Time',
      hi: 'ज़ुहर का वक़्त',
      roman: 'Zuhr ka Waqt'
    },
    arabicName: 'صَلَاةُ الظُّهْرِ',
    definition: {
      ur: 'سورج ڈھلنے سے شروع ہو کر ہر چیز کا سایہ، سایہ اصلی سے دوگنا ہو جائے۔',
      en: 'Begins after midday (Zawal) until the shadow of an object becomes twice its original length.',
      hi: 'सूरज ढलने (ज़वाल) के बाद से लेकर हर चीज़ का साया असली साए से दोगुना होने तक।',
      roman: 'Sooraj dhalne (Zawal) ke baad se lekar har cheez ka saya asli saye se doguna hone tak.'
    },
    color: 'from-yellow-500/20 to-emerald-900/30',
    borderColor: 'border-yellow-500/40',
    textColor: 'text-yellow-300'
  },
  {
    id: 'asr',
    name: {
      ur: 'عصر کا وقت',
      en: 'Asr Time',
      hi: 'अस्र का वक़्त',
      roman: 'Asr ka Waqt'
    },
    arabicName: 'صَلَاةُ الْعَصْرِ',
    definition: {
      ur: 'ظہر کے وقت کے ختم ہونے سے غروب آفتاب تک ہے۔',
      en: 'From the end of Zuhr time until sunset.',
      hi: 'ज़ुहर का वक़्त ख़त्म होने से लेकर सूरज डूबने (ग़ुरूब) तक।',
      roman: 'Zuhr ka waqt khatam hone se lekar sooraj doobne tak.'
    },
    color: 'from-orange-500/20 to-emerald-900/30',
    borderColor: 'border-orange-500/40',
    textColor: 'text-orange-300'
  },
  {
    id: 'maghrib',
    name: {
      ur: 'مغرب کا وقت',
      en: 'Maghrib Time',
      hi: 'मग्रियों का वक़्त',
      roman: 'Maghrib ka Waqt'
    },
    arabicName: 'صَلَاةُ الْمَغْرِبِ',
    definition: {
      ur: 'غروب آفتاب سے شفقِ ابیض کے غروب تک رہتا ہے (تقریباً پون یا ایک گھنٹہ)۔',
      en: 'From sunset until the disappearance of the white twilight (approx. 45-60 mins).',
      hi: 'सूरज डूबने के तुरंत बाद से लेकर सफ़ेद शफ़क़ ग़ायब होने तक (लगभग पौन से एक घंटा)।',
      roman: 'Sooraj doobne se lekar shafaq-e-abyaz ke gayab hone tak (lagbhag paun ya ek ghanta).'
    },
    color: 'from-red-500/20 to-emerald-900/30',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-300'
  },
  {
    id: 'isha',
    name: {
      ur: 'عشاء کا وقت',
      en: 'Isha Time',
      hi: 'इशा का वक़्त',
      roman: 'Isha ka Waqt'
    },
    arabicName: 'صَلَاةُ الْعِشَاءِ',
    definition: {
      ur: 'مغرب کا وقت ختم ہونے سے صبح صادق تک رہتا ہے۔',
      en: 'From the end of Maghrib time until the break of dawn (Subh Sadiq).',
      hi: 'मग्रियों का वक़्त ख़त्म होने से लेकर सुबह सादिक़ (फ़ज्र की शुरुआत) तक।',
      roman: 'Maghrib ka waqt khatam hone se lekar subah sadiq tak.'
    },
    color: 'from-indigo-500/20 to-emerald-900/30',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-300'
  }
];

// 2. RAKAHS TABLE
export const LOCALIZED_RAKAHS_TABLE: LocalizedPrayerRakah[] = [
  {
    id: 'fajr',
    prayer: {
      ur: 'فجر',
      en: 'Fajr',
      hi: 'फ़ज्र',
      roman: 'Fajr'
    },
    total: 4,
    sunnahPrior: 2,
    isSunnahPriorMuakkadah: true,
    fard: 2,
    sunnahPost: null,
    nafl1: null,
    wajib: null,
    nafl2: null,
    orderDescription: {
      ur: 'پہلے ۲ رکعت سنتِ مؤکدہ، پھر ۲ رکعت فرض۔',
      en: 'First 2 Rakah Sunnah Muakkadah, then 2 Rakah Fard.',
      hi: 'पहले २ रकअत सुन्नत-ए-मुअक्कदा, फिर २ रकअत फ़र्ज़।',
      roman: 'Pehle 2 Rakat Sunnat-e-Muakkadah, phir 2 Rakat Fard.'
    }
  },
  {
    id: 'zuhr',
    prayer: {
      ur: 'ظہر',
      en: 'Zuhr',
      hi: 'ज़ुहर',
      roman: 'Zuhr'
    },
    total: 12,
    sunnahPrior: 4,
    isSunnahPriorMuakkadah: true,
    fard: 4,
    sunnahPost: 2,
    isSunnahPostMuakkadah: true,
    nafl1: 2,
    wajib: null,
    nafl2: null,
    orderDescription: {
      ur: 'پہلے ۴ رکعت سنتِ مؤکدہ، پھر ۴ رکعت فرض، پھر ۲ رکعت سنتِ مؤکدہ، پھر ۲ رکعت نفل۔',
      en: 'First 4 Sunnah Muakkadah, then 4 Fard, then 2 Sunnah Muakkadah, then 2 Nafl.',
      hi: 'पहले ४ रकअत सुन्नत-ए-मुअक्कदा, फिर ४ फ़र्ज़, फिर २ सुन्नत-ए-मुअक्कदा, फिर २ नफ़्ल।',
      roman: 'Pehle 4 Rakat Sunnat-e-Muakkadah, phir 4 Fard, phir 2 Sunnat-e-Muakkadah, phir 2 Nafl.'
    }
  },
  {
    id: 'asr',
    prayer: {
      ur: 'عصر',
      en: 'Asr',
      hi: 'अस्र',
      roman: 'Asr'
    },
    total: 8,
    sunnahPrior: 4,
    isSunnahPriorMuakkadah: false,
    fard: 4,
    sunnahPost: null,
    nafl1: null,
    wajib: null,
    nafl2: null,
    orderDescription: {
      ur: 'پہلے ۴ رکعت سنتِ غیر مؤکدہ، پھر ۴ رکعت فرض۔',
      en: 'First 4 Sunnah Ghair Muakkadah, then 4 Fard.',
      hi: 'पहले ४ रकअत सुन्नत-ए-ग़ैर मुअक्कदा, फिर ४ फ़र्ज़।',
      roman: 'Pehle 4 Rakat Sunnat-e-Ghair Muakkadah, phir 4 Fard.'
    }
  },
  {
    id: 'maghrib',
    prayer: {
      ur: 'مغرب',
      en: 'Maghrib',
      hi: 'मग्रियों',
      roman: 'Maghrib'
    },
    total: 7,
    sunnahPrior: null,
    fard: 3,
    sunnahPost: 2,
    isSunnahPostMuakkadah: true,
    nafl1: 2,
    wajib: null,
    nafl2: null,
    orderDescription: {
      ur: 'پہلے ۳ رکعت فرض، پھر ۲ رکعت سنتِ مؤکدہ، پھر ۲ رکعت نفل۔',
      en: 'First 3 Rakah Fard, then 2 Sunnah Muakkadah, then 2 Nafl.',
      hi: 'पहले ३ रकअत फ़र्ज़, फिर २ सुन्नत-ए-मुअक्कदा, फिर २ नफ़्ल।',
      roman: 'Pehle 3 Rakat Fard, phir 2 Sunnat-e-Muakkadah, phir 2 Nafl.'
    }
  },
  {
    id: 'isha',
    prayer: {
      ur: 'عشاء',
      en: 'Isha',
      hi: 'इशा',
      roman: 'Isha'
    },
    total: 17,
    sunnahPrior: 4,
    isSunnahPriorMuakkadah: false,
    fard: 4,
    sunnahPost: 2,
    isSunnahPostMuakkadah: true,
    nafl1: 2,
    wajib: 3,
    wajibText: {
      ur: '۳ وتر',
      en: '3 Witr',
      hi: '३ वित्र',
      roman: '3 Witr'
    },
    nafl2: 2,
    orderDescription: {
      ur: 'پہلے ۴ رکعت سنتِ غیر مؤکدہ، پھر ۴ رکعت فرض، پھر ۲ رکعت سنتِ مؤکدہ، پھر ۲ رکعت نفل، پھر ۳ رکعت وتر واجب، پھر ۲ رکعت نفل۔',
      en: 'First 4 Sunnah Ghair Muakkadah, then 4 Fard, then 2 Sunnah Muakkadah, then 2 Nafl, then 3 Witr Wajib, then 2 Nafl.',
      hi: 'पहले ४ सुन्नत-ए-ग़ैर मुअक्कदा, फिर ४ फ़र्ज़, फिर २ सुन्नत-ए-मुअक्कदा, फिर २ नफ़्ल, फिर ३ वित्र वाजिब, फिर २ नफ़्ल।',
      roman: 'Pehle 4 Sunnat Ghair Muakkadah, phir 4 Fard, phir 2 Sunnat Muakkadah, phir 2 Nafl, phir 3 Witr Wajib, phir 2 Nafl.'
    }
  },
  {
    id: 'jumuah',
    prayer: {
      ur: 'جمعہ',
      en: 'Jumu’ah (Friday)',
      hi: 'जुमुआ (शुक्रवार)',
      roman: 'Jumuah (Juma)'
    },
    total: 14,
    sunnahPrior: 4,
    isSunnahPriorMuakkadah: true,
    fard: 2,
    sunnahPost: 4,
    isSunnahPostMuakkadah: true,
    sunnahPostAlt: '۴ / ۲',
    nafl1: 2,
    wajib: null,
    nafl2: null,
    orderDescription: {
      ur: 'پہلے ۴ رکعت سنتِ مؤکدہ، پھر ۲ رکعت فرض مع خطبہ، پھر ۴ رکعت سنتِ مؤکدہ، پھر ۲ رکعت سنتِ مؤکدہ، پھر ۲ رکعت نفل۔',
      en: 'First 4 Sunnah Muakkadah, then 2 Fard with Khutbah, then 4 Sunnah Muakkadah, then 2 Sunnah Muakkadah, then 2 Nafl.',
      hi: 'पहले ४ सुन्नत-ए-मुअक्कदा, फिर २ फ़र्ज़ ख़ुत्बे के साथ, फिर ४ सुन्नत-ए-मुअक्कदा, फिर २ सुन्नत-ए-मुअक्कदा, फिर २ नफ़्ल।',
      roman: 'Pehle 4 Sunnat Muakkadah, phir 2 Fard ma khutba, phir 4 Sunnat Muakkadah, phir 2 Sunnat Muakkadah, phir 2 Nafl.'
    }
  }
];

// 3. SPECIAL PRAYERS
export const LOCALIZED_SPECIAL_PRAYERS: LocalizedSpecialPrayer[] = [
  {
    id: 'eid',
    title: {
      ur: 'عیدین کی نماز',
      en: 'Eid Prayers (Eid-ul-Fitr & Adha)',
      hi: 'ईदैन की नमाज़ (ईदुल फ़ित्र व अज़हा)',
      roman: 'Eidain ki Namaz'
    },
    rakahs: {
      ur: '۲ رکعت واجب',
      en: '2 Rakahs Wajib',
      hi: '२ रकअत वाजिब',
      roman: '2 Rakat Wajib'
    },
    note: {
      ur: 'عیدین کی نماز طلوعِ آفتاب کے بعد باجماعت پڑھی جاتی ہے جس میں ۶ زائد تکبیریں کہی جاتی ہیں۔',
      en: 'Offered in congregation after sunrise with 6 additional Takbeers.',
      hi: 'सूरज निकलने के बाद बा-जमाअत पढ़ी जाती है जिसमें ६ ज़ायद तकबीरें होती हैं।',
      roman: 'Sooraj nikalne ke baad ba-jamaat padhi jaati hai jisme 6 zayed takbeerein hoti hain.'
    },
    badge: {
      ur: '۲ رکعت واجب مع ۶ زائد تکبیرات',
      en: '2 Rakah Wajib with 6 extra Takbeers',
      hi: '२ रकअत वाजिब मअ ६ ज़ायद तकबीरात',
      roman: '2 Rakat Wajib ma 6 Zayed Takbeerat'
    }
  },
  {
    id: 'taraweeh',
    title: {
      ur: 'نمازِ تراویح',
      en: 'Taraweeh Prayer',
      hi: 'नमाज़-ए-तारावीह',
      roman: 'Namaz-e-Taraweeh'
    },
    rakahs: {
      ur: '۲۰ رکعتیں',
      en: '20 Rakahs',
      hi: '२० रकअतें',
      roman: '20 Rakat'
    },
    note: {
      ur: 'رمضان المبارک میں عشاء کے فرض اور ۲ سنتوں کے بعد باجماعت پڑھی جاتی ہے۔ (سنتِ مؤکدہ)',
      en: 'Offered during Ramadan after Isha Fard and Sunnah in sets of 2 rakahs. (Sunnah Muakkadah)',
      hi: 'माहे रमज़ान में इशा के फ़र्ज़ और सुन्नतों के बाद पढ़ी जाती है। (सुन्नत-ए-मुअक्कदा)',
      roman: 'Ramzan ul Mubarak mein Isha ke Fard aur 2 Sunnat ke baad padhi jaati hai. (Sunnat-e-Muakkadah)'
    },
    badge: {
      ur: '۲۰ رکعتیں (سنتِ مؤکدہ)',
      en: '20 Rakahs (Sunnah Muakkadah)',
      hi: '२० रकअतें (सुन्नत-ए-मुअक्कदा)',
      roman: '20 Rakat (Sunnat-e-Muakkadah)'
    }
  }
];

// 4. MANZOOM DUA (Dua & Munajat from Miftah-ud-Deen)
export const LOCALIZED_MANZOOM_DUA = {
  title: {
    ur: 'دعا و مناجات (از کتاب مفتاح الدین)',
    en: 'Supplication & Munajat (from Book Miftah-ud-Deen)',
    hi: 'दुआ व मुनाजात (किताब मिफ़्ताहुद्दीन से)',
    roman: 'Dua wa Munajat (az Kitaab Miftah-ud-Deen)'
  },
  lines: [
    {
      ur: 'اے میرے مالک اے میرے مولیٰ',
      roman: 'Aye mere Maalik, aye mere Maula',
      hi: 'ए मेरे मालिक, ए मेरे मौला',
      en: 'O my Lord, O my Master'
    },
    {
      ur: 'کر دے تُو سب پہ کرم مرے مولیٰ',
      roman: 'Kar de Tu sab pe karam, mere Maula',
      hi: 'कर दे तू सब पे करम, मेरे मौला',
      en: 'Bestow Your grace upon all, my Master'
    },
    {
      ur: 'جن کا نہیں ہے کوئی جہاں میں',
      roman: 'Jin ka nahi hai koi jahaan mein',
      hi: 'जिन का नहीं है कोई जहाँ में',
      en: 'Those who have no one in this world'
    },
    {
      ur: 'ان کا بھی رکھ دے بھرم میرے مولیٰ',
      roman: 'Un ka bhi rakh de bharam, mere Maula',
      hi: 'उन का भी रख दे भरम, मेरे मौला',
      en: 'Protect their dignity and honor, my Master'
    }
  ]
};

// 5. DETAILED NAMAZ STEPS (14 Steps)
export const LOCALIZED_NAMAZ_STEPS: LocalizedNamazStep[] = [
  {
    step: 1,
    title: {
      ur: '۱. نیت اور قبلہ رخ کھڑا ہونا',
      en: '1. Intention (Niyyah) & Facing Qiblah',
      hi: '१. नीयत और क़िब्ला रुख खड़े होना',
      roman: '1. Niyyah aur Qibla rukh khade hona'
    },
    desc: {
      ur: 'قبلہ کی طرف منہ کر کے سیدھے کھڑے ہوں، دونوں پاؤں کے درمیان چار انگل کا فاصلہ رکھیں۔ دل میں اس وقت کی نماز اور رکعات کا پکا ارادہ کریں (زبان سے کہنا بھی مستحب ہے)۔',
      en: 'Stand upright facing the Holy Ka’bah (Qiblah) with feet spaced about 4 finger-widths apart. Make the firm intention in your heart for the specific prayer and rakahs.',
      hi: 'क़िब्ला की तरफ़ रुख़ करके सीधे खड़े हों, दोनों पैरों के बीच चार अंगुल का फ़ासला रखें। दिल में उस वक़्त की नमाज़ और रकअतों का पक्का इरादा करें।',
      roman: 'Qibla ki taraf rukh karke seedhe khade hon, dono pairon ke darmiyan char ungli ka fasla rakhein. Dil mein us waqt ki namaz aur rakat ka pakka irada karein.'
    },
    arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ لِلَّهِ تَعَالَىٰ رَكْعَتَيْ صَلَاةِ الْفَجْرِ فَرْضًا لِلَّهِ تَعَالَىٰ مُتَوَجِّهًا إِلَىٰ جِهَةِ الْكَعْبَةِ الشَّرِيفَةِ',
    transliteration: 'Nawaytu an usalliya lillāhi ta‘ālā...',
    translation: {
      ur: 'میں نیت کرتا ہوں اللہ تعالیٰ کے واسطے اس وقت کی نماز کی، قبلہ رو ہو کر۔',
      en: 'I intend to pray for the sake of Allah the specific prayer of this time, facing the Ka’bah.',
      hi: 'मैं नीयत करता हूँ अल्लाह तआला के वास्ते इस वक़्त की नमाज़ की, क़िब्ला की तरफ़ रुख़ करके।',
      roman: 'Main niyat karta hoon Allah Taala ke waste is waqt ki namaz ki, Qibla roo ho kar.'
    },
    timing: {
      ur: 'قیام',
      en: 'Qiyam (Standing)',
      hi: 'क़याम (खड़े होना)',
      roman: 'Qiyam'
    }
  },
  {
    step: 2,
    title: {
      ur: '۲. تکبیرِ تحریمہ (ہاتھ اٹھانا)',
      en: '2. Takbeer-e-Tahreema (Raising Hands)',
      hi: '२. तकबीर-ए-तहरीमा (हाथ उठाना)',
      roman: '2. Takbeer-e-Tahreema (Haath Uthana)'
    },
    desc: {
      ur: 'مرد دونوں ہاتھ کانوں کی لو تک اٹھائیں اور انگوٹھا کان کی لو کو چھوئے۔ عورتیں سینے تک ہاتھ اٹھائیں۔ پھر "اللہُ اَکْبَرُ" کہتے ہوئے ہاتھ ناف کے نیچے باندھ لیں (دایاں ہاتھ بائیں ہاتھ پر)۔',
      en: 'Men raise hands up to earlobes (thumbs touching earlobes); women raise hands up to shoulders. Say "Allahu Akbar" and fold hands below the navel (right hand grasping left wrist).',
      hi: 'मर्द दोनों हाथ कानों की लौ तक उठाएँ और अँगूठा कान की लौ को छुए। औरतें सीने तक उठाएँ। फिर "अल्लाहु अकबर" कहते हुए हाथ नाफ़ के नीचे बाँध लें।',
      roman: 'Mard dono haath kaano ki lau tak uthayein aur angootha kaan ki lau ko chhuye. Auratein seene tak uthayein. Phir "Allahu Akbar" kehte hue haath naaf ke neeche baandh lein.'
    },
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: {
      ur: 'اللہ سب سے بڑا ہے۔',
      en: 'Allah is the Greatest.',
      hi: 'अल्लाह सबसे बड़ा है।',
      roman: 'Allah sab se bada hai.'
    },
    timing: {
      ur: 'قیام کی ابتدا',
      en: 'Start of Qiyam',
      hi: 'क़याम की शुरुआत',
      roman: 'Qiyam ki ibteda'
    }
  },
  {
    step: 3,
    title: {
      ur: '۳. ثناء پڑھنا',
      en: '3. Sana (Opening Praise)',
      hi: '३. सना पढ़ना',
      roman: '3. Sana Padhna'
    },
    desc: {
      ur: 'ہاتھ باندھنے کے بعد نظر سجدہ گاہ پر رکھتے ہوئے آہستہ آواز میں ثناء پڑھیں:',
      en: 'After folding hands, keep eyes focused on the place of prostration and quietly recite Sana:',
      hi: 'हाथ बाँधने के बाद नज़र सज्दा गाह पर रखते हुए धीमी आवाज़ में सना पढ़ें:',
      roman: 'Haath baandhne ke baad nazar sajdah gah par rakhte hue aahista aawaz mein Sana padhein:'
    },
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ',
    transliteration: 'Subḥānakallāhumma wa bi-ḥamdika, wa tabāraka-smuka, wa ta‘ālā jadduka, wa lā ilāha ghayruk',
    translation: {
      ur: 'اے اللہ! ہم تیری پاکی بیان کرتے ہیں، اور تیری تعریف کرتے ہیں، اور تیرا نام برکت والا ہے، اور تیری شان بڑی بلند ہے، اور تیرے سوا کوئی معبود نہیں۔',
      en: 'Glory be to You, O Allah, and all praise. Blessed is Your Name, and exalted is Your Majesty, and there is no deity worthy of worship besides You.',
      hi: 'ऐ अल्लाह! हम तेरी पाकी बयान करते हैं, और तेरी तारीफ़ करते हैं, और तेरा नाम बरकत वाला है, और तेरी शान बड़ी बुलंद है, और तेरे सिवा कोई माबूद नहीं।',
      roman: 'Aye Allah! Hum Teri paki bayan karte hain, aur Teri tareef karte hain, aur Tera naam barkat wala hai, aur Teri shaan badi buland hai, aur Tere siwa koi mabood nahi.'
    },
    timing: {
      ur: 'پہلی رکعت میں قیام',
      en: 'Qiyam (1st Rakah)',
      hi: 'पहली रकअत में क़याम',
      roman: 'Pehli Rakat Qiyam'
    }
  },
  {
    step: 4,
    title: {
      ur: '۴. تعوذ اور تسمیہ',
      en: '4. Ta’awwudh & Tasmiyah',
      hi: '४. तअव्वुज़ और तस्मिया',
      roman: '4. Taawwuz aur Tasmiyah'
    },
    desc: {
      ur: 'ثناء کے بعد آہستہ آواز میں اعوذ باللہ اور بسم اللہ پڑھیں:',
      en: 'Quietly recite Ta’awwudh (seeking refuge) and Tasmiyah (in the name of Allah):',
      hi: 'सना के बाद धीमी आवाज़ में अऊज़ु बिल्लाह और बिस्मिल्लाह पढ़ें:',
      roman: 'Sana ke baad aahista aawaz mein Auzubillah aur Bismillah padhein:'
    },
    arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ ۞ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'A‘ūdhu billāhi minash-shayṭānir-rajīm. Bismillāhir-raḥmānir-raḥīm.',
    translation: {
      ur: 'میں پناہ مانگتا ہوں اللہ کی شیطان مردود سے • شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے۔',
      en: 'I seek refuge in Allah from Satan the outcast • In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      hi: 'मैं पनाह माँगता हूँ अल्लाह की शैतान मरदूद से • शुरू अल्लाह के नाम से जो बड़ा मेहरबान निहायत रहम वाला है।',
      roman: 'Main panah maangta hoon Allah ki shaitan mardood se • Shuru Allah ke naam se jo bada meherban nihayat rehem wala hai.'
    },
    timing: {
      ur: 'قیام',
      en: 'Qiyam',
      hi: 'क़याम',
      roman: 'Qiyam'
    }
  },
  {
    step: 5,
    title: {
      ur: '۵. سورۃ الفاتحہ اور سورت ملانا',
      en: '5. Surah Al-Fatihah & Additional Surah',
      hi: '५. सूरह अल-फ़ातिहा और सूरत मिलाना',
      roman: '5. Surah Al-Fatiha aur Surat Milana'
    },
    desc: {
      ur: 'پوری سورۃ الفاتحہ تلاوت کریں اور آخر میں آہستہ سے "آمین" کہیں۔ اس کے بعد کوئی سی سورت (جیسے سورۃ الإخلاص، کوثر یا ۳ چھوٹی آیات) تلاوت کریں۔',
      en: 'Recite the complete Surah Al-Fatihah and say "Ameen" softly. Then recite any other Surah (e.g. Surah Al-Ikhlas, Al-Kawthar, or at least 3 verses).',
      hi: 'पूरी सूरह अल-फ़ातिहा पढ़ें और आहिस्ता से "आमीन" कहें। फिर कोई सूरत (जैसे सूरह इख़लास या कौसर या कम से कम ३ आयात) पढ़ें।',
      roman: 'Poori Surah Al-Fatiha padhein aur aahista se "Ameen" kahein. Phir koi surat (jaise Surah Ikhlas ya Kausar ya 3 aayat) padhein.'
    },
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۞ الرَّحْمَٰنِ الرَّحِيمِ ۞ مَالِكِ يَوْمِ الدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۞ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    transliteration: 'Al-ḥamdu lillāhi Rabbil-‘ālamīn. Ar-Raḥmānir-Raḥīm. Māliki yawmid-dīn. Iyyāka na‘budu wa iyyāka nasta‘īn. Ihdinaṣ-ṣirāṭal-mustaqīm. Ṣirāṭalladhīna an‘amta ‘alayhim, ghayril-maghḍūbi ‘alayhim wa laḍ-ḍāllīn.',
    translation: {
      ur: 'سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔ بڑا مہربان نہایت رحم والا ہے۔ جزا کے دن کا مالک ہے۔ ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد چاہتے ہیں۔ ہمیں سیدھے راستے پر چلا...',
      en: 'All praise is due to Allah, Lord of the worlds. The Entirely Merciful, the Especially Merciful. Master of the Day of Judgment. You alone we worship and You alone we ask for help. Guide us to the straight path...',
      hi: 'सब तारीफ़ें अल्लाह के लिए हैं जो तमाम जहानों का रब है। बड़ा मेहरबान निहायत रहम वाला है। रोज़-ए-जज़ा का मालिक है। हम तेरी ही इबादत करते हैं और तुझ ही से मदद चाहते हैं। हमें सीधे रास्ते पर चला...',
      roman: 'Sab tareefein Allah ke liye hain jo tamam jahano ka Rab hai. Bada meherban nihayat rehem wala hai. Badle ke din ka maalik hai. Hum Teri hi ibadat karte hain aur Tujh hi se madad chahte hain...'
    },
    timing: {
      ur: 'قراءت',
      en: 'Recitation',
      hi: 'क़िराअत',
      roman: 'Qiraat'
    }
  },
  {
    step: 6,
    title: {
      ur: '۶. رکوع اور رکوع کی تسبیح',
      en: '6. Ruku (Bowing) & Its Glorification',
      hi: '६. रुकूअ और रुकूअ की तस्बीह',
      roman: '6. Ruku aur Ruku ki Tasbih'
    },
    desc: {
      ur: 'اللہ اکبر کہتے ہوئے رکوع میں جھکیں۔ دونوں ہاتھوں سے گھٹنوں کو مضبوطی سے پکڑیں، انگلیاں کھلی رکھیں اور پیٹھ کو سیدھا رکھیں۔ کم از کم تین بار یہ تسبیح پڑھیں:',
      en: 'Bow down saying "Allahu Akbar". Grasp knees firmly with spread fingers, keeping the back straight and horizontal. Recite the glorification at least 3 times:',
      hi: '"अल्लाहु अकबर" कहते हुए रुकूअ में झुकें। दोनों हाथों से घुटनों को पकड़ें और पीठ सीधी रखें। कम से कम ३ बार यह तस्बीह पढ़ें:',
      roman: '"Allahu Akbar" kehte hue ruku mein jhukein. Dono haatho se ghutno ko mazbooti se pakdein aur peeth seedhi rakhein. Kam az kam 3 baar yeh tasbih padhein:'
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: 'Subḥāna Rabbiyal-‘Aẓīm',
    translation: {
      ur: 'پاک ہے میرا پروردگار جو بڑی عظمت والا ہے۔ (۳، ۵ یا ۷ بار)',
      en: 'Glory be to my Lord, the Almighty. (3, 5, or 7 times)',
      hi: 'पाक है मेरा परवरदिगार जो बड़ी अज़्मत वाला है। (३, ५ या ७ बार)',
      roman: 'Paak hai mera Parwardigaar jo badi azmat wala hai. (3, 5 ya 7 baar)'
    },
    timing: {
      ur: 'رکوع',
      en: 'Ruku (Bowing)',
      hi: 'रुकूअ',
      roman: 'Ruku'
    }
  },
  {
    step: 7,
    title: {
      ur: '۷. قومہ (رکوع سے سیدھے کھڑے ہونا)',
      en: '7. Qawmah (Standing Up from Ruku)',
      hi: '७. क़ौमा (रुकूअ से सीधे खड़े होना)',
      roman: '7. Qawmah (Ruku se seedhe khade hona)'
    },
    desc: {
      ur: 'رکوع سے سیدھے کھڑے ہوتے ہوئے امام اور تنہا نمازی "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ" کہے، پھر سیدھے کھڑے ہو کر "رَبَّنَا لَكَ الْحَمْد" کہیں۔',
      en: 'Rise from bowing saying "Sami‘allāhu liman ḥamidah", and once standing completely upright say "Rabbanā lakal-ḥamd":',
      hi: 'रुकूअ से सीधे खड़े होते हुए "समिअल्लाहु लिमन हमिदह" कहें, फिर बिल्कुल सीधे खड़े होकर "रब्बना लकल हम्द" कहें:',
      roman: 'Ruku se seedhe khade hote hue "Samiallahu liman hamidah" kahein, phir bilkul seedhe khade ho kar "Rabbana lakal hamd" kahein:'
    },
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۞ رَبَّنَا لَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliteration: 'Sami‘allāhu liman ḥamidah. Rabbanā lakal-ḥamd, ḥamdan kathīran ṭayyiban mubārakan fīh.',
    translation: {
      ur: 'اللہ نے اس کی سن لی جس نے اس کی حمد کی • اے ہمارے رب! تیرے ہی لیے تمام تعریفیں ہیں، بہت زیادہ، پاکیزہ اور برکت والی تعریفیں۔',
      en: 'Allah listens to the one who praises Him • Our Lord, to You belongs all praise, abundant, pure, and blessed praise.',
      hi: 'अल्लाह ने उसकी सुन ली जिसने उसकी तारीफ़ की • ऐ हमारे रब! तेरे ही लिए तमाम तारीफ़ें हैं, बहुत ज़्यादा, पाकीज़ा और बरकत वाली।',
      roman: 'Allah ne uski sun li jisne uski tareef ki • Aye hamare Rab! Tere hi liye tamam tareefein hain, bahut zyada, pakeezah aur barkat wali.'
    },
    timing: {
      ur: 'قومہ',
      en: 'Qawmah',
      hi: 'क़ौमा',
      roman: 'Qawmah'
    }
  },
  {
    step: 8,
    title: {
      ur: '۸. سجدہ اور سجدہ کی تسبیح',
      en: '8. Sajdah (Prostration) & Its Glorification',
      hi: '८. सज्दा और सज्दे की तस्बीह',
      roman: '8. Sajdah aur Sajde ki Tasbih'
    },
    desc: {
      ur: 'اللہ اکبر کہتے ہوئے سجدہ میں جائیں۔ پہلے گھٹنے، پھر ہاتھ، پھر ناک اور پیشانی زمین پر رکھیں۔ دونوں پاؤں کی انگلیاں قبلہ رخ کھڑی ہوں۔ تین بار یہ تسبیح پڑھیں:',
      en: 'Go into prostration saying "Allahu Akbar". Place knees first, then hands, then nose and forehead. Toes must point towards Qiblah. Recite at least 3 times:',
      hi: '"अल्लाहु अकबर" कहते हुए सज्दे में जाएँ। पहले घुटने, फिर हाथ, फिर नाक और पेशानी ज़मीन पर रखें। पैरों की उँगलियाँ क़िब्ला रुख़ हों। ३ बार तस्बीह पढ़ें:',
      roman: '"Allahu Akbar" kehte hue sajdah mein jayein. Pehle ghutne, phir haath, phir naak aur peshani zameen par rakhein. 3 baar tasbih padhein:'
    },
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
    transliteration: 'Subḥāna Rabbiyal-A‘lā',
    translation: {
      ur: 'پاک ہے میرا پروردگار جو سب سے بلند تر ہے۔ (۳، ۵ یا ۷ بار)',
      en: 'Glory be to my Lord, the Most High. (3, 5, or 7 times)',
      hi: 'पाक है मेरा परवरदिगार जो सबसे बुलंद है। (३, ५ या ७ बार)',
      roman: 'Paak hai mera Parwardigaar jo sab se buland hai. (3, 5 ya 7 baar)'
    },
    timing: {
      ur: 'سجدہ',
      en: 'Sajdah (Prostration)',
      hi: 'सज्दा',
      roman: 'Sajdah'
    }
  },
  {
    step: 9,
    title: {
      ur: '۹. جلسہ (دونوں سجدوں کے درمیان بیٹھنا)',
      en: '9. Jalsah (Sitting Between Two Prostrations)',
      hi: '९. जलसा (दोनों सज्दों के बीच बैठना)',
      roman: '9. Jalsah (Dono sajdon ke darmiyan baithna)'
    },
    desc: {
      ur: 'اللہ اکبر کہتے ہوئے سیدھے بیٹھ جائیں۔ بایاں پاؤں بچھا کر اس پر بیٹھیں اور دایاں پاؤں کھڑا رکھیں۔ دونوں ہاتھوں کو رانوں پر رکھیں اور یہ مسنون دعا پڑھیں:',
      en: 'Rise from prostration saying "Allahu Akbar" and sit calmly. Spread left foot to sit upon it and keep right foot upright with toes facing Qiblah. Recite this supplication:',
      hi: '"अल्लाहु अकबर" कहते हुए सीधे बैठ जाएँ। बायाँ पैर बिछाकर उस पर बैठें और दायाँ पैर खड़ा रखें। हाथों को रानों पर रखें और यह मसनून दुआ पढ़ें:',
      roman: '"Allahu Akbar" kehte hue seedhe baith jayein. Bayan pair bichha kar us par baithein aur dayan pair khada rakhein. Haathon ko raano par rakhein aur yeh dua padhein:'
    },
    arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي، وَارْحَمْنِي وَعَافِنِي وَاهْدِنِي وَارْزُقْنِي',
    transliteration: 'Rabbigh-fir lī, Rabbigh-fir lī, war-ḥamnī wa ‘āfinī wah-dinī war-zuqnī',
    translation: {
      ur: 'اے میرے رب! مجھے معاف فرما دے، مجھ پر رحم فرما، مجھے عافیت دے، مجھے ہدایت دے اور مجھے رزق عطا فرما۔',
      en: 'O my Lord! Forgive me, have mercy on me, grant me well-being, guide me, and grant me sustenance.',
      hi: 'ऐ मेरे रब! मुझे माफ़ फ़रमा दे, मुझ पर रहम फ़रमा, मुझे आफ़ियत दे, मुझे हिदायत दे और मुझे रिज़्क़ अता फ़रमा।',
      roman: 'Aye mere Rab! Mujhe maaf farma de, mujh par reham farma, mujhe aafiyat de, mujhe hidayat de aur mujhe rizq ata farma.'
    },
    timing: {
      ur: 'جلسہ',
      en: 'Jalsah',
      hi: 'जलसा',
      roman: 'Jalsah'
    }
  },
  {
    step: 10,
    title: {
      ur: '۱۰. دوسرا سجدہ اور دوسری رکعت',
      en: '10. Second Sajdah & Rising for 2nd Rakah',
      hi: '१०. दूसरा सज्दा और दूसरी रकअत',
      roman: '10. Doosra Sajdah aur Doosri Rakat'
    },
    desc: {
      ur: 'اللہ اکبر کہہ کر دوسرا سجدہ پہلے کی طرح کریں اور تین بار "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ" پڑھیں۔ پھر سیدھے کھڑے ہو جائیں اور دوسری رکعت پہلی کی طرح مکمل کریں۔',
      en: 'Say "Allahu Akbar" and perform the second prostration just like the first, reciting the tasbih 3 times. Then rise to standing for the 2nd rakah.',
      hi: '"अल्लाहु अकबर" कहकर दूसरा सज्दा पहले की तरह करें और ३ बार तस्बीह पढ़ें। फिर सीधे खड़े होकर दूसरी रकअत शुरू करें।',
      roman: '"Allahu Akbar" keh kar doosra sajdah pehle ki tarah karein aur 3 baar tasbih padhein. Phir seedhe khade ho kar doosri rakat shuru karein.'
    },
    arabic: 'اللَّهُ أَكْبَرُ ۞ سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
    transliteration: 'Allāhu Akbar. Subḥāna Rabbiyal-A‘lā',
    translation: {
      ur: 'اللہ سب سے بڑا ہے • پاک ہے میرا پروردگار جو سب سے بلند تر ہے۔',
      en: 'Allah is the Greatest • Glory be to my Lord, the Most High.',
      hi: 'अल्लाह सबसे बड़ा है • पाक है मेरा परवरदिगार जो सबसे बुलंद है।',
      roman: 'Allah sab se bada hai • Paak hai mera Parwardigaar jo sab se buland hai.'
    },
    timing: {
      ur: 'سجدہ ثانیہ',
      en: 'Second Sajdah',
      hi: 'दूसरा सज्दा',
      roman: 'Sajdah Saniyah'
    }
  },
  {
    step: 11,
    title: {
      ur: '۱۱. قعدہ اور التحیات (تشہد)',
      en: '11. Qadah & Tashahhud (Attahiyyat)',
      hi: '११. क़ादा और अत्तहिय्यात (तशह्हुद)',
      roman: '11. Qadah aur Attahiyyat (Tashahhud)'
    },
    desc: {
      ur: 'دو رکعت کے بعد بیٹھ جائیں۔ دونوں ہاتھ رانوں پر رکھیں اور التحیات پڑھیں۔ "أَشْهَدُ أَنْ لَا إِلَٰهَ" پر شہادت کی انگلی اٹھائیں اور "إِلَّا اللَّهُ" پر گرا دیں:',
      en: 'After 2 rakahs, sit in Tashahhud posture. Place hands on thighs and recite Attahiyyat. Raise the index finger at "Ash-hadu alla ilaha" and lower it at "illallah":',
      hi: 'दो रकअत के बाद बैठ जाएँ। दोनों हाथ रानों पर रखें और अत्तहिय्यात पढ़ें। "अश्हदु अल्ला इलाहा" पर शहादत की उँगली उठाएँ और "इल्लल्लाह" पर गिरा दें:',
      roman: 'Do rakat ke baad baith jayein. Dono haath raano par rakhein aur Attahiyyat padhein. "Ashhadu alla ilaha" par ungli uthayein aur "illallah" par gira dein:'
    },
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'At-taḥiyyātu lillāhi waṣ-ṣalawātu waṭ-ṭayyibātu, as-salāmu ‘alayka ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh, as-salāmu ‘alaynā wa ‘alā ‘ibādillāhiṣ-ṣāliḥīn, ash-hadu allā ilāha illallāhu, wa ash-hadu anna Muḥammadan ‘abduhū wa rasūluh.',
    translation: {
      ur: 'تمام زبانی، بدنی اور مالی عبادتیں اللہ کے لیے ہیں۔ اے نبی! آپ پر سلامتی، اللہ کی رحمت اور اس کی برکتیں ہوں۔ سلامتی ہو ہم پر اور اللہ کے تمام نیک بندوں پر۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں اور محمد ﷺ اس کے بندے اور رسول ہیں۔',
      en: 'All verbal, physical, and monetary worship are for Allah. Peace be upon you, O Prophet, and Allah’s mercy and blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no deity except Allah, and I bear witness that Muhammad is His servant and Messenger.',
      hi: 'तमाम ज़बानी, बदनी और माली इबादतें अल्लाह के लिए हैं। ऐ नबी! आप पर सलामती, अल्लाह की रहमत और बरकतें हों। सलामती हो हम पर और अल्लाह के नेक बंदों पर। मैं गवाही देता हूँ कि अल्लाह के सिवा कोई माबूद नहीं और मुहम्मद ﷺ उसके बंदे और रसूल हैं।',
      roman: 'Tamam zabani, badani aur maali ibadatein Allah ke liye hain. Aye Nabi! Aap par salamati, Allah ki rehmat aur uski barkatein hon. Salamati ho hum par aur Allah ke naik bando par. Main gawahi deta hoon ke Allah ke siwa koi mabood nahi aur Muhammad ﷺ Uske bande aur Rasool hain.'
    },
    timing: {
      ur: 'قعدہ اولیٰ و اخیرہ',
      en: 'Qadah (Sitting)',
      hi: 'क़ादा ऊला व अख़ीरा',
      roman: 'Qadah Oola wa Akheera'
    }
  },
  {
    step: 12,
    title: {
      ur: '۱۲. درودِ ابراہیمی',
      en: '12. Durood-e-Ibrahimi',
      hi: '१२. दुरूद-ए-इब्राहीमी',
      roman: '12. Durood-e-Ibrahimi'
    },
    desc: {
      ur: 'آخری قعدہ میں التحیات کے بعد درودِ پاک پڑھیں:',
      en: 'In the final sitting after Tashahhud, recite Durood-e-Ibrahimi:',
      hi: 'आख़िरी क़ादा में अत्तहिय्यात के बाद दुरूद-ए-पाक पढ़ें:',
      roman: 'Aakhiri Qadah mein Attahiyyat ke baad Durood-e-Paak padhein:'
    },
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ ۞ اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'Allāhumma ṣalli ‘alā Muḥammadin wa ‘alā āli Muḥammad, kamā ṣallayta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Ḥamīdum-Majīd. Allāhumma bārik ‘alā Muḥammadin wa ‘alā āli Muḥammad, kamā bārakta ‘alā Ibrāhīma wa ‘alā āli Ibrāhīm, innaka Ḥamīdum-Majīd.',
    translation: {
      ur: 'اے اللہ! رحمت نازل فرما حضرت محمد ﷺ پر اور ان کی آل پر، جس طرح تو نے رحمت نازل فرمائی حضرت ابراہیم علیہ السلام پر اور ان کی آل پر، بے شک تو بڑی تعریف والا بزرگی والا ہے۔ اے اللہ! برکت نازل فرما حضرت محمد ﷺ پر اور ان کی آل پر، جس طرح تو نے برکت نازل فرمائی حضرت ابراہیم علیہ السلام پر اور ان کی آل پر، بے شک تو بڑی تعریف والا بزرگی والا ہے۔',
      en: 'O Allah, bestow Your grace upon Muhammad and the family of Muhammad, as You bestowed grace upon Abraham and the family of Abraham. Indeed, You are Praiseworthy and Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Abraham and the family of Abraham. Indeed, You are Praiseworthy and Glorious.',
      hi: 'ऐ अल्लाह! रहमत नाज़िल फ़रमा हज़रत मुहम्मद ﷺ पर और उनकी आल पर, जिस तरह तूने रहमत नाज़िल फ़रमाई हज़रत इब्राहीम अलैहिस्सलाम पर और उनकी आल पर। बेशक तू बड़ी तारीफ़ वाला बुज़ुर्गी वाला है। ऐ अल्लाह! बरकत नाज़िल फ़रमा हज़रत मुहम्मद ﷺ पर और उनकी आल पर...',
      roman: 'Aye Allah! Rehmat naazil farma Hazrat Muhammad ﷺ par aur unki aal par, jis tarah Tu ne rehmat naazil farmai Hazrat Ibrahim (A.S.) par aur unki aal par, Beshak Tu badi tareef wala buzurgi wala hai. Aye Allah! Barkat naazil farma...'
    },
    timing: {
      ur: 'قعدہ اخیرہ',
      en: 'Final Qadah',
      hi: 'क़ादा अख़ीरा',
      roman: 'Qadah Akheera'
    }
  },
  {
    step: 13,
    title: {
      ur: '۱۳. دعائے ماثورہ',
      en: '13. Dua Masoora (Final Supplication)',
      hi: '१३. दुआ-ए-मासूरा',
      roman: '13. Dua Masoora'
    },
    desc: {
      ur: 'درودِ ابراہیمی کے بعد قرآن و حدیث سے ماثور دعا پڑھیں:',
      en: 'After Durood-e-Ibrahimi, recite the traditional supplication taught by the Prophet ﷺ:',
      hi: 'दुरूद-ए-इब्राहीमी के बाद क़ुरआन व हदीस से माथूर दुआ पढ़ें:',
      roman: 'Durood-e-Ibrahimi ke baad Quran wa Hadees se masoora dua padhein:'
    },
    arabic: 'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration: 'Allāhumma innī ẓalamtu nafsī ẓulman kathīran, wa lā yaghfirudh-dhunūba illā anta, fagh-fir lī maghfiratan min ‘indika, war-ḥamnī, innaka antal-Ghafūrur-Raḥīm.',
    translation: {
      ur: 'اے اللہ! میں نے اپنی جان پر بہت زیادہ ظلم کیا، اور تیرے سوا گناہوں کو کوئی نہیں بخش سکتا، پس تو اپنے پاس سے میری خصوصی مغفرت فرما دے اور مجھ پر رحم فرما، بے شک تو ہی بڑا بخشنے والا، نہایت رحم کرنے والا ہے۔',
      en: 'O Allah, I have wronged my soul greatly, and none forgives sins except You. So forgive me with forgiveness from Yourself and have mercy upon me. Indeed, You are the Forgiving, the Merciful.',
      hi: 'ऐ अल्लाह! मैंने अपनी जान पर बहुत ज़्यादा ज़ुल्म किया, और तेरे सिवा गुनाहों को कोई नहीं बख़्श सकता, पस तू अपने पास से मेरी मफ़िरत फ़रमा दे और मुझ पर रहम फ़रमा, बेशक तू ही बड़ा बख़्शने वाला, निहायत रहम करने वाला है।',
      roman: 'Aye Allah! Maine apni jaan par bahut zyada zulm kiya, aur Tere siwa gunaahon ko koi nahi bakhsh sakta, pas Tu apne paas se meri maghfirat farma de aur mujh par reham farma, beshak Tu hi bada bakhshne wala, nihayat rehem karne wala hai.'
    },
    timing: {
      ur: 'قعدہ اخیرہ (قبل سلام)',
      en: 'Final Qadah (Before Salam)',
      hi: 'क़ादा अख़ीरा (सलाम से पहले)',
      roman: 'Qadah Akheera (Qabl Salam)'
    }
  },
  {
    step: 14,
    title: {
      ur: '۱۴. سلام پھیرنا',
      en: '14. Tasleem (Ending with Salam)',
      hi: '१४. सलाम फेरना',
      roman: '14. Salam Pherna'
    },
    desc: {
      ur: 'پہلے دائیں طرف چہرہ موڑتے ہوئے کہیں "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ"، پھر بائیں طرف اسی طرح کہیں۔ نماز مکمل ہو گئی۔',
      en: 'Turn your face to the right saying "As-Salāmu ‘Alaykum wa Raḥmatullāh", then to the left doing the same. The prayer is now complete.',
      hi: 'पहले दाएँ कंधे की तरफ़ चेहरा मोड़ते हुए कहें "अस्सलामु अलैकुम व रहमतुल्लाह", फिर बाएँ तरफ़ इसी तरह कहें। नमाज़ मुकम्मल हुई।',
      roman: 'Pehle dayen kandhe ki taraf chehra modte hue kahein "As-Salamu Alaykum wa Rahmatullah", phir bayen taraf isi tarah kahein. Namaz mukammal hui.'
    },
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    transliteration: 'As-Salāmu ‘alaykum wa raḥmatullāh',
    translation: {
      ur: 'تم پر سلامتی اور اللہ کی رحمت ہو۔',
      en: 'Peace be upon you and the mercy of Allah.',
      hi: 'तुम पर सलामती और अल्लाह की रहमत हो।',
      roman: 'Tum par salamati aur Allah ki rehmat ho.'
    },
    timing: {
      ur: 'اختتام نماز',
      en: 'Completion of Prayer',
      hi: 'नमाज़ का इख़्तिताम',
      roman: 'Ikhtitam-e-Namaz'
    }
  }
];

// 6. DUA-E-QUNOOT (Witr Prayer)
export const LOCALIZED_DUA_E_QUNOOT = {
  title: {
    ur: 'نمازِ وتر اور دعائے قنوت',
    en: 'Witr Prayer & Dua-e-Qunoot',
    hi: 'नमाज़-ए-वित्र और दुआ-ए-क़ुनूत',
    roman: 'Namaz-e-Witr aur Dua-e-Qunoot'
  },
  note: {
    ur: 'عشاء کی تین رکعت وتر میں تیسری رکعت میں سورۃ الفاتحہ اور سورت پڑھنے کے بعد تکبیر کہہ کر کانوں تک ہاتھ اٹھاتے ہیں اور پھر ہاتھ باندھ کر دعائے قنوت پڑھتے ہیں:',
    en: 'In the 3rd rakah of Witr prayer (after Isha), recite Surah Al-Fatihah and another Surah, then say Takbeer while raising hands to ears, refold hands, and recite Dua-e-Qunoot:',
    hi: 'इशा की तीन रकअत वित्र में तीसरी रकअत में सूरह अल-फ़ातिहा और सूरत पढ़ने के बाद तकबीर कहकर कानों तक हाथ उठाते हैं, फिर हाथ बाँधकर दुआ-ए-क़ुनूत पढ़ते हैं:',
    roman: 'Isha ki 3 rakat Witr mein 3rd rakat mein Surah Al-Fatiha aur Surat padhne ke baad takbeer keh kar kaano tak haath uthate hain, phir haath baandh kar Dua-e-Qunoot padhte hain:'
  },
  arabic: 'اللَّهُمَّ إِنَّا نَسْتَعِينُكَ وَنَسْتَغْفِرُكَ وَنُؤْمِنُ بِكَ وَنَتَوَكَّلُ عَلَيْكَ وَنُثْنِي عَلَيْكَ الْخَيْرَ، وَنَشْكُرُكَ وَلَا نَكْفُرُكَ، وَنَخْلَعُ وَنَتْرُكُ مَنْ يَفْجُرُكَ ۞ اللَّهُمَّ إِيَّاكَ نَعْبُدُ، وَلَكَ نُصَلِّي وَنَسْجُدُ، وَإِلَيْكَ نَسْعَىٰ وَنَحْفِدُ، وَنَرْجُو رَحْمَتَكَ، وَنَخْشَىٰ عَذَابَكَ، إِنَّ عَذَابَكَ بِالْكُفَّارِ مُلْحَقٌ',
  transliteration: 'Allāhumma innā nasta‘īnuka wa nastaghfiruka wa nu’minu bika wa natawakkalu ‘alayka wa nuthnī ‘alaykal-khayr, wa nashkuruka wa lā nakfuruka, wa nakhla‘u wa natruku may-yafjuruk. Allāhumma iyyāka na‘budu, wa laka nuṣallī wa nasjudu, wa ilayka nas‘ā wa naḥfidu, wa narjū raḥmataka, wa nakhshā ‘adhābaka, inna ‘adhābaka bil-kuffāri mulḥaq.',
  translation: {
    ur: 'اے اللہ! ہم تجھ ہی سے مدد چاہتے ہیں، اور تجھ سے مغفرت مانگتے ہیں، اور تجھ پر ایمان لاتے ہیں، اور تجھ ہی پر بھروسا کرتے ہیں، اور تیری بہترین تعریف کرتے ہیں، اور تیرا شکر ادا کرتے ہیں اور تیری ناشکری نہیں کرتے، اور جو شخص تیری نافرمانی کرے ہم اس سے الگ رہتے ہیں اور اسے چھوڑ دیتے ہیں۔ اے اللہ! ہم تیری ہی عبادت کرتے ہیں، اور تیرے ہی لیے نماز پڑھتے اور سجدہ کرتے ہیں، اور تیری ہی طرف دوڑتے اور حاضر ہوتے ہیں، اور ہم تیری رحمت کے امیدوار ہیں اور تیرے عذاب سے ڈرتے ہیں، بے شک تیرا عذاب کافروں کو پہنچنے والا ہے۔',
    en: 'O Allah, we seek Your help and we ask for Your forgiveness, we believe in You and put our trust in You, and we praise You in the best manner. We thank You and are not ungrateful to You, and we abandon and forsake anyone who disobeys You. O Allah, You alone we worship, and to You we pray and prostrate, and towards You we hasten and serve. We hope for Your mercy and fear Your punishment. Truly, Your punishment will overtake the disbelievers.',
    hi: 'ऐ अल्लाह! हम तुझ ही से मदद चाहते हैं, और तुझ से मग़्फ़िरत माँगते हैं, और तुझ पर ईमान लाते हैं, और तुझ ही पर भरोसा करते हैं, और तेरी बेहतरीन तारीफ़ करते हैं, और तेरा शुक्र अदा करते हैं और तेरी नाशुक्री नहीं करते, और जो शख़्स तेरी नाफ़रमानी करे हम उससे अलग रहते हैं और उसे छोड़ देते हैं। ऐ अल्लाह! हम तेरी ही इबादत करते हैं, और तेरे ही लिए नमाज़ पढ़ते और सज्दा करते हैं, और तेरी ही तरफ़ दौड़ते और हाज़िर होते हैं, और हम तेरी रहमत के उम्मीदवार हैं और तेरे अज़ाब से डरते हैं, बेशक तेरा अज़ाब काफ़िरों को पहुँचने वाला है।',
    roman: 'Aye Allah! Hum Tujh hi se madad chahte hain, aur Tujh se maghfirat maangte hain, aur Tujh par imaan laate hain, aur Tujh hi par bharosa karte hain, aur Teri behtareen tareef karte hain, aur Tera shukr ada karte hain aur Teri na-shukri nahi karte, aur jo shakhs Teri nafarmani kare hum us se alag rehte hain aur use chhod dete hain. Aye Allah! Hum Teri hi ibadat karte hain, aur Tere hi liye namaz padhte aur sajdah karte hain, aur Teri hi taraf daudte aur hazir hote hain, aur hum Teri rehmat ke umeedwaar hain aur Tere azaab se darte hain, beshak Tera azaab kafiron ko pahunchne wala hai.'
  }
};

// 7. CONDITIONS & PILLARS OF NAMAZ (SHARAAIT & ARKAAN)
export const LOCALIZED_SHARAAIT_ARKAAN = {
  sharaaitTitle: {
    ur: 'نماز کی شرائط (نماز سے باہر ۷ فرائض)',
    en: 'Conditions of Prayer (7 External Prerequisites)',
    hi: 'नमाज़ की शराइत (नमाज़ से बाहर ७ फ़राइज़)',
    roman: 'Namaz ki Sharaait (Namaz se bahar 7 Faraiz)'
  },
  sharaait: [
    {
      number: 1,
      title: {
        ur: 'طہارتِ بدن',
        en: 'Purity of Body',
        hi: 'तहारत-ए-बदन (शरीर की पाकी)',
        roman: 'Taharat-e-Badan'
      },
      desc: {
        ur: 'جسم کا ناپاکی سے پاک ہونا (وضو یا غسل کے ذریعے)۔',
        en: 'The body must be clean from minor and major impurities (via Wudu or Ghusl).',
        hi: 'शरीर का नापाकी से पाक होना (वुज़ू या ग़ुस्ल के ज़रिए)।',
        roman: 'Jism ka napaki se paak hona (Wudu ya Ghusl ke zariye).'
      }
    },
    {
      number: 2,
      title: {
        ur: 'طہارتِ لباس',
        en: 'Purity of Clothes',
        hi: 'तहारत-ए-लिबास (कपड़ों की पाकी)',
        roman: 'Taharat-e-Libaas'
      },
      desc: {
        ur: 'پہنے ہوئے کپڑوں کا پاک صاف ہونا۔',
        en: 'All clothing worn must be clean and free of impurities.',
        hi: 'पहने हुए कपड़ों का पाक साफ़ होना।',
        roman: 'Pehne hue kapdon ka paak saaf hona.'
      }
    },
    {
      number: 3,
      title: {
        ur: 'طہارتِ مکان',
        en: 'Purity of Place',
        hi: 'तहारत-ए-मकान (जगह की पाकी)',
        roman: 'Taharat-e-Makaan'
      },
      desc: {
        ur: 'نماز پڑھنے کی جگہ کا پاک و صاف ہونا۔',
        en: 'The ground or prayer mat where prayer is offered must be pure.',
        hi: 'नमाज़ पढ़ने की जगह का पाक और साफ़ होना।',
        roman: 'Namaz padhne ki jagah ka paak aur saaf hona.'
      }
    },
    {
      number: 4,
      title: {
        ur: 'سترِ عورت',
        en: 'Covering the Awrah',
        hi: 'सत्र-ए-औरत (बदन ढकना)',
        roman: 'Satr-e-Awrah'
      },
      desc: {
        ur: 'مرد کا ناف سے گھٹنوں تک اور عورت کا چہرے، ہاتھوں اور پاؤں کے سوا تمام بدن چھپانا۔',
        en: 'For men: covering from navel to knees. For women: covering the entire body except face, hands, and feet.',
        hi: 'मर्द का नाफ़ से घुटने तक और औरत का चेहरे, हाथों और पैरों के सिवा पूरा बदन ढकना।',
        roman: 'Mard ka naaf se ghutne tak aur aurat ka chehre, haathon aur pairon ke siwa poora jism chhupana.'
      }
    },
    {
      number: 5,
      title: {
        ur: 'استقبالِ قبلہ',
        en: 'Facing the Qiblah',
        hi: 'इस्तक़बाल-ए-क़िब्ला (क़ाबा रुख़)',
        roman: 'Istiqbal-e-Qibla'
      },
      desc: {
        ur: 'خانہ کعبہ (قبلہ رخ) کی طرف منہ کرنا۔',
        en: 'Facing the direction of the Holy Ka’bah in Makkah.',
        hi: 'ख़ाना-ए-काबा (क़िब्ला) की तरफ़ रुख़ करना।',
        roman: 'Khana-e-Kaba (Qibla rukh) ki taraf rukh karna.'
      }
    },
    {
      number: 6,
      title: {
        ur: 'وقت',
        en: 'Prescribed Time',
        hi: 'वक़्त (नमाज़ का सही समय)',
        roman: 'Waqt (Sahi Time)'
      },
      desc: {
        ur: 'متعلقہ نماز کا وقت داخل ہونا۔',
        en: 'Ensuring the valid time for the specific prayer has entered.',
        hi: 'संबंधित नमाज़ का वक़्त शुरू होना।',
        roman: 'Mutalliqah namaz ka waqt dakhil hona.'
      }
    },
    {
      number: 7,
      title: {
        ur: 'نیت',
        en: 'Intention (Niyyah)',
        hi: 'नीयत (दिल का इरादा)',
        roman: 'Niyyat (Dil ka Irada)'
      },
      desc: {
        ur: 'دل میں متعلقہ نماز اور رکعات کا پختہ ارادہ کرنا۔',
        en: 'Making a firm sincere intention in the heart for that prayer.',
        hi: 'दिल में उस नमाज़ और रकअतों का पक्का इरादा करना।',
        roman: 'Dil mein mutalliqah namaz aur rakato ka pakka irada karna.'
      }
    }
  ],
  arkaanTitle: {
    ur: 'نماز کے ارکان (نماز کے اندر ۶ فرائض)',
    en: 'Pillars of Prayer (6 Internal Obligations)',
    hi: 'नमाज़ के अरकान (नमाज़ के अंदर ६ फ़राइज़)',
    roman: 'Namaz ke Arkaan (Namaz ke andar 6 Faraiz)'
  },
  arkaan: [
    {
      number: 1,
      title: {
        ur: 'تکبیرِ تحریمہ',
        en: 'Takbeer-e-Tahreema',
        hi: 'तकबीर-ए-तहरीमा',
        roman: 'Takbeer-e-Tahreema'
      },
      desc: {
        ur: 'نماز شروع کرتے ہوئے "اللہ اکبر" کہنا۔',
        en: 'Saying "Allahu Akbar" to enter into prayer.',
        hi: 'नमाज़ शुरू करते हुए "अल्लाहु अकबर" कहना।',
        roman: 'Namaz shuru karte hue "Allahu Akbar" kehna.'
      }
    },
    {
      number: 2,
      title: {
        ur: 'قیام',
        en: 'Qiyam (Standing)',
        hi: 'क़याम (सीधे खड़े होना)',
        roman: 'Qiyam (Khade hona)'
      },
      desc: {
        ur: 'فرض و واجب نماز میں سیدھا کھڑا ہونا۔',
        en: 'Standing upright in obligatory and wajib prayers.',
        hi: 'फ़र्ज़ और वाजिब नमाज़ में सीधा खड़ा होना।',
        roman: 'Fard aur Wajib namaz mein seedha khada hona.'
      }
    },
    {
      number: 3,
      title: {
        ur: 'قراءت',
        en: 'Qira’at (Recitation)',
        hi: 'क़िराअत (क़ुरआन पढ़ना)',
        roman: 'Qiraat (Quran Padhna)'
      },
      desc: {
        ur: 'کم از کم ایک بڑی آیت یا تین چھوٹی آیات تلاوت کرنا۔',
        en: 'Reciting at least one long verse or 3 short verses of the Quran.',
        hi: 'कम से कम एक बड़ी आयत या तीन छोटी आयात की तिलावत करना।',
        roman: 'Kam az kam ek badi aayat ya teen chhoti aayaat ki tilawat karna.'
      }
    },
    {
      number: 4,
      title: {
        ur: 'رکوع',
        en: 'Ruku (Bowing)',
        hi: 'रुकूअ (झुकना)',
        roman: 'Ruku (Jhukna)'
      },
      desc: {
        ur: 'دونوں ہاتھوں سے گھٹنوں کو پکڑ کر پیٹھ سیدھی رکھنا۔',
        en: 'Bowing with hands grasping knees and keeping the back flat.',
        hi: 'दोनों हाथों से घुटनों को पकड़कर पीठ सीधी रखना।',
        roman: 'Dono haathon se ghutno ko pakad kar peeth seedhi rakhna.'
      }
    },
    {
      number: 5,
      title: {
        ur: 'سجود',
        en: 'Sujood (Prostrations)',
        hi: 'सुजूद (दोनों सज्दे)',
        roman: 'Sujood (Dono Sajde)'
      },
      desc: {
        ur: 'ہر رکعت میں دو سجدے کرنا (پیشانی و ناک زمین پر جمانا)۔',
        en: 'Performing two prostrations in each rakah (forehead and nose on ground).',
        hi: 'हर रकअत में दो सज्दे करना (पेशानी और नाक ज़मीन पर लगाना)।',
        roman: 'Har rakat mein do sajde karna (peshani aur naak zameen par lagana).'
      }
    },
    {
      number: 6,
      title: {
        ur: 'قعدہ اخیرہ',
        en: 'Qadah Akheera (Final Sitting)',
        hi: 'क़ादा अख़ीरा (आख़िरी बैठक)',
        roman: 'Qadah Akheera'
      },
      desc: {
        ur: 'آخری رکعت کے بعد التحیات کی مقدار بیٹھنا۔',
        en: 'Sitting at the end of the prayer for the duration of reciting Tashahhud.',
        hi: 'आख़िरी रकअत के बाद अत्तहिय्यात की मिक़दार बैठना।',
        roman: 'Aakhiri rakat ke baad Attahiyyat ki miqdaar baithna.'
      }
    }
  ]
};

// 8. GENERAL UI TEXTS FOR NAMAZ SECTION
export const NAMAZ_UI_TEXTS = {
  badge: {
    ur: 'مفتاح الدین • اوقاتِ صلوٰۃ و تعدادِ رکعات کا مکمل نقشہ',
    en: 'Miftah-ud-Deen • Complete Prayer Times & Rakahs Chart',
    hi: 'मिफ़्ताहुद्दीन • नमाज़ के औक़ात व रकअतों का मुकम्मल नक़्शा',
    roman: 'Miftah-ud-Deen • Auqat-e-Salat wa Rakaat ka Mukammal Naqsha'
  },
  mainTitle: {
    ur: '🕌 مکمل نماز گائیڈ اور نقشہ رکعات',
    en: '🕌 Complete Namaz Guide & Rakahs Chart',
    hi: '🕌 मुकम्मल नमाज़ गाइड व नक़्शा-ए-रकअत',
    roman: '🕌 Mukammal Namaz Guide aur Naqsha-e-Rakat'
  },
  mainSubtitle: {
    ur: 'پانچوں نمازوں کے مستند اوقات، تعدادِ رکعات کا مصدقہ چارٹ، سنتِ مؤکدہ و غیر مؤکدہ کی تفصیل اور قدم بہ قدم طریقہ نماز مع اعراب و دعائیں',
    en: 'Authentic timings of the five prayers, verified rakahs chart, Sunnah details, and step-by-step prayer guide with diacritics and supplications',
    hi: 'पाँचों नमाज़ों के मुस्तनद औक़ात, रकअतों का तस्दीक़-शुदा चार्ट, सुन्नत व नफ़्ल की तफ़्सील और क़दम-ब-क़दम तरीक़ा-ए-नमाज़ मअ एअराब व दुआएँ',
    roman: 'Pancho namazo ke mustanad auqat, rakato ka certified chart, sunnat wa nafl ki tafseel aur step-by-step tareeqa-e-namaz'
  },
  fontLabel: {
    ur: 'عربی فونٹ:',
    en: 'Arabic Font:',
    hi: 'अरबी फ़ॉन्ट:',
    roman: 'Arabic Font:'
  },
  languageLabel: {
    ur: 'زبان / Language:',
    en: 'Language:',
    hi: 'भाषा (Language):',
    roman: 'Language (Zaban):'
  },
  tabs: {
    chart: {
      ur: '📋 اوقاتِ صلوٰۃ و نقشہ رکعات',
      en: '📋 Prayer Times & Rakahs',
      hi: '📋 औक़ात-ए-सलात व नक़्शा',
      roman: '📋 Auqat & Naqsha Rakat'
    },
    steps: {
      ur: '🕌 طریقہ نماز (قدم بہ قدم)',
      en: '🕌 Step-by-Step Namaz',
      hi: '🕌 तरीक़ा-ए-नमाज़ (क़दम-ब-क़दम)',
      roman: '🕌 Tareeqa Namaz (Steps)'
    },
    qunoot: {
      ur: '🌙 وتر اور دعائے قنوت',
      en: '🌙 Witr & Dua Qunoot',
      hi: '🌙 वित्र व दुआ-ए-क़ुनूत',
      roman: '🌙 Witr & Dua Qunoot'
    },
    sharaait: {
      ur: '⚖️ شرائط و ارکانِ نماز',
      en: '⚖️ Conditions & Pillars',
      hi: '⚖️ शराइत व अरकान-ए-नमाज़',
      roman: '⚖️ Sharaait wa Arkaan'
    }
  },
  timesHeader: {
    title: {
      ur: 'اوقاتِ صلوٰۃ',
      en: 'Prayer Timings',
      hi: 'औक़ात-ए-सलात (नमाज़ के समय)',
      roman: 'Auqat-e-Salat (Prayer Times)'
    },
    desc: {
      ur: 'پانچوں نمازوں کے فقہی اور مسنون اوقات کی تفصیل',
      en: 'Jurisprudential and Sunnah timings for the five daily prayers',
      hi: 'पाँचों नमाज़ों के शरई व मसनून औक़ात की तफ़्सील',
      roman: 'Pancho namazo ke mustanad auqat ki tafseel'
    }
  },
  rakahsHeader: {
    title: {
      ur: 'تعدادِ رکعاتِ نماز (مکمل نقشہ)',
      en: 'Number of Rakahs in Prayers (Complete Chart)',
      hi: 'तादाद-ए-रकअत-ए-नमाज़ (मुकम्मल नक़्शा)',
      roman: 'Tadad-e-Rakaat-e-Namaz (Full Chart)'
    },
    desc: {
      ur: 'سنتِ مؤکدہ، فرض، سنتِ غیر مؤکدہ، نفل اور وتر کی مفصل تقسیم',
      en: 'Detailed breakdown of Sunnah Muakkadah, Fard, Sunnah Ghair Muakkadah, Nafl, and Witr',
      hi: 'सुन्नत-ए-मुअक्कदा, फ़र्ज़, सुन्नत-ए-ग़ैर मुअक्कदा, नफ़्ल व वित्र का पूरा चार्ट',
      roman: 'Sunnat Muakkadah, Fard, Sunnat Ghair Muakkadah, Nafl aur Witr ka chart'
    }
  },
  tableCols: {
    prayer: { ur: 'نماز', en: 'Prayer', hi: 'नमाज़', roman: 'Namaz' },
    sunnahPrior: { ur: 'سنت قبل', en: 'Sunnah Before', hi: 'सुन्नत पहले', roman: 'Sunnat Pehle' },
    fard: { ur: 'فرض', en: 'Fard', hi: 'फ़र्ज़', roman: 'Fard' },
    sunnahPost: { ur: 'سنت بعد', en: 'Sunnah After', hi: 'सुन्नत बाद', roman: 'Sunnat Baad' },
    nafl1: { ur: 'نفل', en: 'Nafl', hi: 'नफ़्ल', roman: 'Nafl' },
    wajib: { ur: 'وتر', en: 'Witr', hi: 'वित्र', roman: 'Witr' },
    nafl2: { ur: 'نفل بعد', en: 'Nafl After', hi: 'नफ़्ल बाद', roman: 'Nafl Baad' },
    total: { ur: 'کل رکعات', en: 'Total Rakahs', hi: 'कुल रकअत', roman: 'Kul Rakat' }
  },
  legend: {
    title: { ur: 'اصطلاحاتِ نماز:', en: 'Prayer Terms:', hi: 'नमाज़ की इस्तिलाहात:', roman: 'Namaz ki Istelahaat:' },
    muakkadah: {
      ur: 'سنتِ مؤکدہ (جس کی رسول اللہ ﷺ نے ہمیشہ پابندی فرمائی، بلا عذر چھوڑنا گناہ ہے)',
      en: 'Sunnah Muakkadah (Emphasized Sunnah practiced regularly by the Prophet ﷺ)',
      hi: 'सुन्नत-ए-मुअक्कदा (जिस पर हुज़ूर ﷺ ने हमेशा पाबंदी फ़रमाई)',
      roman: 'Sunnat Muakkadah (Jis par Huzoor ﷺ ne hamesha pabandi farmai)'
    },
    ghairMuakkadah: {
      ur: 'سنتِ غیر مؤکدہ (پڑھنا باعثِ ثواب ہے، چھوڑنے پر گناہ نہیں)',
      en: 'Sunnah Ghair Muakkadah (Recommended Sunnah, highly rewarding)',
      hi: 'सुन्नत-ए-ग़ैर मुअक्कदा (पढ़ना सवाब, छोड़ने पर गुनाह नहीं)',
      roman: 'Sunnat Ghair Muakkadah (Padhna sawab, chhodne par gunah nahi)'
    },
    wajib: {
      ur: 'وتر واجب (اس کا پڑھنا ضروری ہے، نہ پڑھنے والا گناہگار ہوگا)',
      en: 'Witr Wajib (Obligatory prayer, sinful to neglect)',
      hi: 'वित्र वाजिब (इसका पढ़ना ज़रूरी है, न पढ़ने पर गुनाहगार होगा)',
      roman: 'Witr Wajib (Iska padhna zaroori hai)'
    }
  },
  listenRecitation: {
    ur: 'تلاوت سنیں',
    en: 'Listen Recitation',
    hi: 'तिलावत सुनें',
    roman: 'Tilawat Sunein'
  },
  stopAudio: {
    ur: 'بند کریں',
    en: 'Stop Audio',
    hi: 'बंद करें',
    roman: 'Band Karein'
  },
  copy: {
    ur: 'کاپی کریں',
    en: 'Copy',
    hi: 'कॉपी करें',
    roman: 'Copy'
  },
  copied: {
    ur: 'کاپی ہو گئی!',
    en: 'Copied!',
    hi: 'कॉपी हो गई!',
    roman: 'Copied!'
  },
  transliterationLabel: {
    ur: 'تلفظ (Roman Transliteration):',
    en: 'Pronunciation (Transliteration):',
    hi: 'उच्चारण (Transliteration):',
    roman: 'Talaffuz (Pronunciation):'
  },
  translationLabel: {
    ur: 'ترجمہ و مفہوم:',
    en: 'Translation & Meaning:',
    hi: 'अनुवाद व अर्थ:',
    roman: 'Tarjuma wa Meaning:'
  }
};
