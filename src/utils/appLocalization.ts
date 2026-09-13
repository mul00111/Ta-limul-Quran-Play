import { LanguageCode } from '../types';

export interface MainMenuLocalization {
  menuTitle: string;
  menuBadge: string;
  menuSubtitle: string;
  homeBtn: string;
  madrasaPortalTitle: string;
  madrasaPortalSub: string;
  enterPortal: string;
  categories: {
    quran: {
      title: string;
      qaidah: string;
      quran: string;
      blankBoard: string;
    };
    games: {
      title: string;
      allGames: string;
      magnetic: string;
      quiz: string;
    };
    ai: {
      title: string;
      aiTutor: string;
      voicePortal: string;
    };
    islamic: {
      title: string;
      hub: string;
      prayerTimes: string;
    };
    live: {
      title: string;
      liveClass: string;
      fees: string;
    };
    parents: {
      title: string;
      controls: string;
    };
    profile: {
      title: string;
      rewards: string;
    };
  };
  footerButtons: {
    language: string;
    settings: string;
    security: string;
    about: string;
    privacy: string;
  };
}

export interface HomeScreenLocalization {
  header: {
    parentDashboardTitle: string;
    languageTitle: string;
    settingsTitle: string;
  };
  duaCard: {
    title: string;
    reciter: string;
    translation: string;
    clickToListen: string;
  };
  stats: {
    profileTitle: string;
    coinsTitle: string;
    streakTitle: string;
    remainingTime: string;
    timeFraction: string;
  };
  featuredHubs: {
    heading: string;
    viewMore: string;
    quranBadge: string;
    quranTitle: string;
    quranDesc: string;
    quranBtn: string;
    islamicBadge: string;
    islamicTitle: string;
    islamicDesc: string;
    islamicBtn: string;
  };
  interactiveGrid: {
    heading: string;
    viewMore: string;
    madaniQaidah: {
      pill: string;
      title: string;
      sub: string;
    };
    blankBoard: {
      pill: string;
      title: string;
      sub: string;
    };
    murakkabatPuzzle: {
      pill: string;
      title: string;
      sub: string;
    };
    tajweedGames: {
      pill: string;
      title: string;
      sub: string;
    };
    aiUstadh: {
      pill: string;
      title: string;
      sub: string;
    };
    liveClassroom: {
      pill: string;
      title: string;
      sub: string;
    };
  };
  bottomNav: {
    home: string;
    liveClass: string;
    games: string;
    qaidaQuran: string;
    parent: string;
  };
}

export interface GamificationLocalization {
  headerTitle: string;
  headerSub: string;
  backHome: string;
  streakLabel: string;
  coinsLabel: string;
  levelLabel: string;
  daysSuffix: string;
  badgesHeading: string;
  leaderboardHeading: string;
  rankLabel: string;
  badges: {
    firstLetter: { title: string; desc: string };
    tajweedChamp: { title: string; desc: string };
    hifzStar: { title: string; desc: string };
    streak5: { title: string; desc: string };
  };
  leaderboardNames: {
    userSuffix: string;
  };
}

export interface AppLocalizationData {
  mainMenu: MainMenuLocalization;
  homeScreen: HomeScreenLocalization;
  gamification: GamificationLocalization;
  sequentialBlankHeader: {
    backHome: string;
    title: string;
  };
  qaidahHeader: {
    backBtn: string;
    title: string;
    liveClassBtn: string;
    searchPlaceholder: string;
    noLessonFound: string;
  };
}

export const APP_LOCALIZATIONS: Record<LanguageCode, AppLocalizationData> = {
  ur: {
    mainMenu: {
      menuTitle: '☰ MAIN MENU',
      menuBadge: 'مین مینو',
      menuSubtitle: 'تعليم القرآن پلے نیویگیشن',
      homeBtn: '🏠 ہوم (Home)',
      madrasaPortalTitle: 'تعلیم القرآن آن لائن',
      madrasaPortalSub: 'مکمل مدرسہ ایڈمن پینل',
      enterPortal: 'داخل ہوں ←',
      categories: {
        quran: {
          title: '📖 قرآن کی تعلیم',
          qaidah: 'مَدنی قاعدہ (سبق ۱ تا ۱۷)',
          quran: 'قرآن مجید (تمام ۳۰ پارے)',
          blankBoard: 'ترتیب وار بلینک بورڈ',
        },
        games: {
          title: '🎮 کوئز و گیمز زون',
          allGames: 'تمام تجویدی گیمز و چیلنجز',
          magnetic: 'مرکبات مقناطیسی پزل گیم',
          quiz: 'قرآنی و تجویدی کوئز',
        },
        ai: {
          title: '🤖 مصنوعی ذہانت (AI) استاد',
          aiTutor: 'پرو اے آئی استاد و مخرج کوچ',
          voicePortal: 'صوتی ریکارڈنگ و اپلوڈ پورٹل',
        },
        islamic: {
          title: '🌙 اسلامی کتب و اذکار',
          hub: 'اسلامی تربیتی مرکز (نماز، دعائیں)',
          prayerTimes: 'اوقاتِ نماز و قبلہ رخ',
        },
        live: {
          title: '🎥 لائیو کلاس روم',
          liveClass: 'آن لائن لائیو استاد کلاس',
          fees: 'فیس مینجمنٹ پورٹل',
        },
        parents: {
          title: '👨‍👩‍👧 والدین ڈیش بورڈ',
          controls: 'اسکرین ٹائم و تعلیمی رپورٹس',
        },
        profile: {
          title: '🏆 طالب علم کی پروفائل و انعامات',
          rewards: 'سکے، بیجز اور لیڈر بورڈ',
        },
      },
      footerButtons: {
        language: 'زبان تبدیل کریں (Language)',
        settings: 'ترتیبات (Settings)',
        security: 'سیکیورٹی شیلڈ (Security)',
        about: 'ایپ کے متعلق (About)',
        privacy: 'پرائیویسی پالیسی (Privacy)',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'والدین ڈیش بورڈ (Parent Dashboard / Security)',
        languageTitle: 'زبان تبدیل کریں (Language)',
        settingsTitle: 'ترتیبات (Settings)',
      },
      duaCard: {
        title: 'دعائے علم • سورة طه (۱۱۴)',
        reciter: 'تلاوت: الشیخ عبد الرحمن السدیس',
        translation: '“اے میرے پروردگار! میرے علم میں اضافہ فرما”',
        clickToListen: 'تلاوت سننے کے لیے کلک کریں',
      },
      stats: {
        profileTitle: 'پروفائل و انعامات',
        coinsTitle: 'سکے (Coins)',
        streakTitle: 'مسلسل حاضری (Streak)',
        remainingTime: '3 منٹ باقی',
        timeFraction: '12 / 15 منٹ',
      },
      featuredHubs: {
        heading: '📖 قرآنی و اسلامی مراکز',
        viewMore: 'مزید دیکھیں',
        quranBadge: 'تمام ۳۰ پارے | 114 سورتیں',
        quranTitle: 'قرآن مجید و ناظرہ (تمام ۳۰ پارے)',
        quranDesc: 'پارہ ۱ تا ۳۰ کی تمام 114 سورتیں، مستند اردو ترجمہ، ہر پارہ علیحدہ، قراء کی تلاوت و آف لائن آڈیو',
        quranBtn: 'تلاوت سنیں و پڑھیں',
        islamicBadge: 'نماز، وضو، دعائیں و اذکار',
        islamicTitle: 'اسلامی تربیتی مرکز',
        islamicDesc: 'چھ کلمے، نماز و وضو کا تصویری طریقہ، ۴۰ مسنون دعائیں اور ۹۹ اسمائے حسنیٰ صوتی تلفظ کے ساتھ',
        islamicBtn: 'سیکھنا شروع کریں',
      },
      interactiveGrid: {
        heading: '🎮 تجوید، قاعدہ اور تعلیمی گیمز',
        viewMore: 'مزید دیکھیں',
        madaniQaidah: {
          pill: 'سبق 1 تا 17',
          title: 'مدنی قاعدہ',
          sub: 'مفردات، حرکات و تجوید',
        },
        blankBoard: {
          pill: 'صوتی ٹیسٹ',
          title: 'بلینک بورڈ',
          sub: 'خالی خانوں میں حروف کی ترتیب',
        },
        murakkabatPuzzle: {
          pill: 'پزل گیم',
          title: 'مرکبات پزل',
          sub: 'مقناطیسی حروف جوڑیں',
        },
        tajweedGames: {
          pill: 'کوئز چیلنج',
          title: 'تجویدی گیمز',
          sub: 'سکون، مدات و قواعد',
        },
        aiUstadh: {
          pill: 'AI وائس',
          title: 'پرو اے آئی استاد',
          sub: 'صوتی مخرج و کیمرہ اسکین',
        },
        liveClassroom: {
          pill: 'لائیو سبق',
          title: 'لائیو کلاس روم',
          sub: 'استاد سے براہ راست رابطہ',
        },
      },
      bottomNav: {
        home: 'ہوم',
        liveClass: 'لائیو کلاس',
        games: 'گیمز',
        qaidaQuran: 'قاعدہ و قرآن',
        parent: 'والدین',
      },
    },
    gamification: {
      headerTitle: 'بیجز، سکے اور لیڈر بورڈ (Rewards & Leaderboard)',
      headerSub: 'XP پوائنٹس، انعامات اور روزانہ کے چیلنجز',
      backHome: 'واپس ہوم',
      streakLabel: 'اسٹریک (Streak)',
      coinsLabel: 'سکے (Coins)',
      levelLabel: 'لیول (Level)',
      daysSuffix: 'دن',
      badgesHeading: 'حاصل کردہ بیجز اور اعزازات',
      leaderboardHeading: 'ٹاپ طلبہ لیڈر بورڈ',
      rankLabel: 'پوزیشن',
      badges: {
        firstLetter: { title: 'پہلا حرف ماسٹر', desc: 'مدنی قاعدہ کا پہلا سبق مکمل کیا' },
        tajweedChamp: { title: 'تجوید چیمپئن', desc: '5 حروف صحیح تلفظ سے پڑھے' },
        hifzStar: { title: 'حفظ اسٹار', desc: 'سورۃ الإخلاص زبانی یاد کی' },
        streak5: { title: 'مسلسل 5 دن', desc: '5 دن لگاتار ایپ استعمال کی' },
      },
      leaderboardNames: {
        userSuffix: '(آپ)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← مرکزی صفحہ (Home)',
      title: 'ترتیب وار بلینک بورڈ',
    },
    qaidahHeader: {
      backBtn: 'واپسی',
      title: 'مَدنی قاعدہ',
      liveClassBtn: 'لائیو کلاس',
      searchPlaceholder: 'سبق تلاش کریں (مثلاً: وقف، حرکات، نون ساکن)...',
      noLessonFound: 'کوئی سبق نہیں ملا',
    },
  },
  en: {
    mainMenu: {
      menuTitle: '☰ MAIN MENU',
      menuBadge: 'Menu',
      menuSubtitle: 'Ta\'limul Quran Navigation',
      homeBtn: '🏠 Home',
      madrasaPortalTitle: 'Talimul Quran Online',
      madrasaPortalSub: 'Complete Madrasa Admin Panel',
      enterPortal: 'Enter →',
      categories: {
        quran: {
          title: '📖 Quranic Studies',
          qaidah: 'Madani Qaida (Lessons 1-17)',
          quran: 'Holy Quran (All 30 Juz)',
          blankBoard: 'Sequential Blank Board',
        },
        games: {
          title: '🎮 Quiz & Games Zone',
          allGames: 'All Tajweed Games & Challenges',
          magnetic: 'Murakkabat Magnetic Puzzle',
          quiz: 'Quranic & Tajweed Quiz',
        },
        ai: {
          title: '🤖 AI Ustadh & Audio',
          aiTutor: 'Pro AI Ustadh & Makhraj Coach',
          voicePortal: 'Audio Recording & Upload Portal',
        },
        islamic: {
          title: '🌙 Islamic Library & Duas',
          hub: 'Islamic Learning Hub (Salah, Duas)',
          prayerTimes: 'Prayer Times & Qibla Direction',
        },
        live: {
          title: '🎥 Live Classroom',
          liveClass: 'Live Online Teacher Classroom',
          fees: 'Fee Management Portal',
        },
        parents: {
          title: '👨‍👩‍👧 Parent Dashboard',
          controls: 'Screen Time & Progress Reports',
        },
        profile: {
          title: '🏆 Student Profile & Rewards',
          rewards: 'Coins, Badges & Leaderboard',
        },
      },
      footerButtons: {
        language: 'Change Language',
        settings: 'Settings',
        security: 'Security Shield',
        about: 'About App',
        privacy: 'Privacy Policy',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'Parent Dashboard & Security',
        languageTitle: 'Change Language',
        settingsTitle: 'Settings',
      },
      duaCard: {
        title: 'Dua for Knowledge • Surah Taha (114)',
        reciter: 'Recitation: Sheikh Abdul Rahman Al-Sudais',
        translation: '“O my Lord! Increase me in knowledge”',
        clickToListen: 'Click to listen to recitation',
      },
      stats: {
        profileTitle: 'Profile & Rewards',
        coinsTitle: 'Coins',
        streakTitle: 'Daily Streak',
        remainingTime: '3 min left',
        timeFraction: '12 / 15 min',
      },
      featuredHubs: {
        heading: '📖 Quran & Islamic Hubs',
        viewMore: 'View More',
        quranBadge: 'All 30 Juz | 114 Surahs',
        quranTitle: 'Holy Quran & Nazra (All 30 Juz)',
        quranDesc: 'All 114 Surahs across Juz 1 to 30 with authentic translations, individual Juz navigation and crystal-clear Qari recitation.',
        quranBtn: 'Listen & Read',
        islamicBadge: 'Salah, Wudu, Duas & Adhkar',
        islamicTitle: 'Islamic Learning Hub',
        islamicDesc: '6 Kalimas, pictorial Salah & Wudu guide, 40 Masnoon Duas, and 99 Names of Allah with audio pronunciation.',
        islamicBtn: 'Start Learning',
      },
      interactiveGrid: {
        heading: '🎮 Tajweed, Qaida & Learning Games',
        viewMore: 'View More',
        madaniQaidah: {
          pill: 'Lessons 1 to 17',
          title: 'Madani Qaida',
          sub: 'Mufradat, Harakat & Tajweed',
        },
        blankBoard: {
          pill: 'Audio Test',
          title: 'Blank Board',
          sub: 'Arrange letters in sequential order',
        },
        murakkabatPuzzle: {
          pill: 'Puzzle Game',
          title: 'Murakkabat Puzzle',
          sub: 'Connect magnetic Arabic letters',
        },
        tajweedGames: {
          pill: 'Quiz Challenge',
          title: 'Tajweed Games',
          sub: 'Sukoon, Maddat & Rules',
        },
        aiUstadh: {
          pill: 'AI Voice',
          title: 'Pro AI Ustadh',
          sub: 'Voice Makhraj & Camera Scan',
        },
        liveClassroom: {
          pill: 'Live Lesson',
          title: 'Live Classroom',
          sub: 'Direct interaction with teachers',
        },
      },
      bottomNav: {
        home: 'Home',
        liveClass: 'Live Class',
        games: 'Games',
        qaidaQuran: 'Qaida & Quran',
        parent: 'Parents',
      },
    },
    gamification: {
      headerTitle: 'Badges, Coins & Leaderboard',
      headerSub: 'XP points, rewards and daily learning streaks',
      backHome: 'Back Home',
      streakLabel: 'Streak',
      coinsLabel: 'Coins',
      levelLabel: 'Level',
      daysSuffix: 'Days',
      badgesHeading: 'Earned Badges & Honors',
      leaderboardHeading: 'Top Students Leaderboard',
      rankLabel: 'Rank',
      badges: {
        firstLetter: { title: 'First Letter Master', desc: 'Completed Lesson 1 of Madani Qaida' },
        tajweedChamp: { title: 'Tajweed Champion', desc: 'Pronounced 5 letters with accurate makhraj' },
        hifzStar: { title: 'Hifz Star', desc: 'Memorized Surah Al-Ikhlas by heart' },
        streak5: { title: '5-Day Streak', desc: 'Used the application 5 consecutive days' },
      },
      leaderboardNames: {
        userSuffix: '(You)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← Home Screen',
      title: 'Sequential Blank Board',
    },
    qaidahHeader: {
      backBtn: 'Back',
      title: 'Madani Qaida',
      liveClassBtn: 'Live Class',
      searchPlaceholder: 'Search lesson (e.g., Waqf, Harakat, Nun Sakin)...',
      noLessonFound: 'No lesson found',
    },
  },
  ar: {
    mainMenu: {
      menuTitle: '☰ القائمة الرئيسية',
      menuBadge: 'القائمة',
      menuSubtitle: 'تنقل تعليم القرآن بلاي',
      homeBtn: '🏠 الرئيسية',
      madrasaPortalTitle: 'تعليم القرآن أونلاين',
      madrasaPortalSub: 'لوحة إدارة المدرسة المتكاملة',
      enterPortal: 'دخول ←',
      categories: {
        quran: {
          title: '📖 دراسات القرآن الكريم',
          qaidah: 'القاعدة المدنية (الدروس ١ إلى ١٧)',
          quran: 'القرآن الكريم (كامل الـ ٣٠ جزءاً)',
          blankBoard: 'لوحة الفراغات المتسلسلة',
        },
        games: {
          title: '🎮 منطقة الألعاب والاختبارات',
          allGames: 'جميع ألعاب وتحديات التجويد',
          magnetic: 'ألغاز المركبات المغناطيسية',
          quiz: 'اختبارات القرآن والتجويد',
        },
        ai: {
          title: '🤖 الأستاذ الذكي ومصحح الصوت',
          aiTutor: 'الأستاذ الذكي ومدرب مخارج الحروف',
          voicePortal: 'بوابة تسجيل وتحميل التلاوات',
        },
        islamic: {
          title: '🌙 المكتبة الإسلامية والأذكار',
          hub: 'المركز الإسلامي (الصلاة، الأدعية)',
          prayerTimes: 'مواقيت الصلاة واتجاه القبلة',
        },
        live: {
          title: '🎥 الفصول المباشرة',
          liveClass: 'فصل المعلم المباشر أونلاين',
          fees: 'بوابة إدارة الرسوم الدراسية',
        },
        parents: {
          title: '👨‍👩‍👧 لوحة تحكم الوالدين',
          controls: 'وقت الشاشة وتقارير التقدم',
        },
        profile: {
          title: '🏆 ملف الطالب والمكافآت',
          rewards: 'العملات، الشارات وقائمة المتصدرين',
        },
      },
      footerButtons: {
        language: 'تغيير اللغة',
        settings: 'الإعدادات',
        security: 'درع الأمان',
        about: 'حول التطبيق',
        privacy: 'سياسة الخصوصية',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'لوحة تحكم الوالدين والأمان',
        languageTitle: 'تغيير اللغة',
        settingsTitle: 'الإعدادات',
      },
      duaCard: {
        title: 'دعاء طلب العلم • سورة طه (١١٤)',
        reciter: 'تلاوة: الشيخ عبد الرحمن السديس',
        translation: '«رَبِّ زِدْنِي عِلْمًا»',
        clickToListen: 'انقر للاستماع إلى التلاوة',
      },
      stats: {
        profileTitle: 'الملف الشخصي والمكافآت',
        coinsTitle: 'النقاط والعملات',
        streakTitle: 'الحضور المتواصل',
        remainingTime: 'متبقي ٣ دقائق',
        timeFraction: '١٢ / ١٥ دقيقة',
      },
      featuredHubs: {
        heading: '📖 المراكز القرآنية والإسلامية',
        viewMore: 'عرض المزيد',
        quranBadge: 'كامل الـ ٣٠ جزءاً | ١١٤ سورة',
        quranTitle: 'القرآن الكريم والتلاوة (٣٠ جزءاً)',
        quranDesc: 'جميع السور الـ ١١٤ من الجزء ١ إلى ٣٠، مع الترجمة والتلاوة العطرة والاستماع دون اتصال.',
        quranBtn: 'استمع واقرأ',
        islamicBadge: 'الصلاة، الوضوء، الأدعية والأذكار',
        islamicTitle: 'المركز التعليمي الإسلامي',
        islamicDesc: 'الكلمات الست، طريقة الصلاة والوضوء المصورة، ٤٠ دعاءً مسنوناً، و ٩٩ اسماً من أسماء الله الحسنى.',
        islamicBtn: 'ابدأ التعلم',
      },
      interactiveGrid: {
        heading: '🎮 التجويد، القاعدة والألعاب التعليمية',
        viewMore: 'عرض المزيد',
        madaniQaidah: {
          pill: 'الدروس ١ إلى ١٧',
          title: 'القاعدة المدنية',
          sub: 'المفردات، الحركات والتجويد',
        },
        blankBoard: {
          pill: 'اختبار صوتي',
          title: 'لوحة الفراغات',
          sub: 'ترتيب الحروف في الخانات الفارغة',
        },
        murakkabatPuzzle: {
          pill: 'لعبة الألغاز',
          title: 'ألغاز المركبات',
          sub: 'تركيب الحروف المغناطيسية',
        },
        tajweedGames: {
          pill: 'تحدي الأسئلة',
          title: 'ألعاب التجويد',
          sub: 'السكون، المدود والقواعد',
        },
        aiUstadh: {
          pill: 'صوت الذكاء',
          title: 'الأستاذ الذكي برو',
          sub: 'تصحيح المخارج ومسح الكاميرا',
        },
        liveClassroom: {
          pill: 'درس مباشر',
          title: 'الفصل المباشر',
          sub: 'تواصل مباشر مع المعلم',
        },
      },
      bottomNav: {
        home: 'الرئيسية',
        liveClass: 'فصل مباشر',
        games: 'الألعاب',
        qaidaQuran: 'القاعدة والقرآن',
        parent: 'الوالدين',
      },
    },
    gamification: {
      headerTitle: 'الشارات، العملات وقائمة المتصدرين',
      headerSub: 'نقاط الخبرة والمكافآت والتحديات اليومية',
      backHome: 'العودة للرئيسية',
      streakLabel: 'التتابع',
      coinsLabel: 'العملات',
      levelLabel: 'المستوى',
      daysSuffix: 'أيام',
      badgesHeading: 'الشارات والأوسمة المحققة',
      leaderboardHeading: 'لوحة صدارة الطلاب المتميزين',
      rankLabel: 'الترتيب',
      badges: {
        firstLetter: { title: 'سيد الحرف الأول', desc: 'أتممت الدرس الأول من القاعدة المدنية' },
        tajweedChamp: { title: 'بطل التجويد', desc: 'نطقت ٥ حروف بمخارجها الصحيحة' },
        hifzStar: { title: 'نجم الحفظ', desc: 'حفظت سورة الإخلاص عن ظهر قلب' },
        streak5: { title: '٥ أيام متتالية', desc: 'استخدمت التطبيق لمدة ٥ أيام متتابعة' },
      },
      leaderboardNames: {
        userSuffix: '(أنت)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← الصفحة الرئيسية',
      title: 'لوحة الفراغات المتسلسلة',
    },
    qaidahHeader: {
      backBtn: 'رجوع',
      title: 'القاعدة المدنية',
      liveClassBtn: 'فصل مباشر',
      searchPlaceholder: 'ابحث عن درس (مثل: الوقف، الحركات، النون الساكنة)...',
      noLessonFound: 'لم يتم العثور على أي درس',
    },
  },
  hi: {
    mainMenu: {
      menuTitle: '☰ मुख्य मेन्यू (MAIN MENU)',
      menuBadge: 'मेन्यू',
      menuSubtitle: 'तालीमुल क़ुरआन प्ले नेविगेशन',
      homeBtn: '🏠 होम (Home)',
      madrasaPortalTitle: 'तालीमुल क़ुरआन ऑनलाइन',
      madrasaPortalSub: 'संपूर्ण मदरसा एडमिन पोर्टल',
      enterPortal: 'प्रवेश करें →',
      categories: {
        quran: {
          title: '📖 क़ुरआन की तालीम',
          qaidah: 'मदनी क़ायदा (सबक़ 1 से 17)',
          quran: 'क़ुरआन मजीद (सभी 30 पारे)',
          blankBoard: 'तरतीबवार ब्लैंक बोर्ड',
        },
        games: {
          title: '🎮 क्विज़ व गेम ज़ोन',
          allGames: 'सभी तजवीद गेम्स व चुनौतियां',
          magnetic: 'मुरक्कबात मैग्नेटिक पज़ल गेम',
          quiz: 'क़ुरआनी व तजवीद क्विज़',
        },
        ai: {
          title: '🤖 एआई (AI) उस्ताद',
          aiTutor: 'प्रो एआई उस्ताद व मख़रज कोच',
          voicePortal: 'ऑडियो रिकॉर्डिंग व अपलोड पोर्टल',
        },
        islamic: {
          title: '🌙 इस्लामी किताबें व अज़कार',
          hub: 'इस्लामी शिक्षा केंद्र (नमाज़, दुआएं)',
          prayerTimes: 'नमाज़ के औक़ात व क़िबला रुख़',
        },
        live: {
          title: '🎥 लाइव क्लासरूम',
          liveClass: 'ऑनलाइन लाइव टीचर क्लास',
          fees: 'फ़ीस मैनेजमेंट पोर्टल',
        },
        parents: {
          title: '👨‍👩‍👧 अभिभावक डैशबोर्ड',
          controls: 'स्क्रीन टाइम व प्रगति रिपोर्ट',
        },
        profile: {
          title: '🏆 छात्र प्रोफ़ाइल व पुरस्कार',
          rewards: 'सिक्के, बैज और लीडरबोर्ड',
        },
      },
      footerButtons: {
        language: 'भाषा बदलें (Language)',
        settings: 'सेटिंग्स (Settings)',
        security: 'सुरक्षा शील्ड (Security)',
        about: 'ऐप के बारे में (About)',
        privacy: 'गोपनीयता नीति (Privacy)',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'अभिभावक डैशबोर्ड व सुरक्षा',
        languageTitle: 'भाषा बदलें (Language)',
        settingsTitle: 'सेटिंग्स (Settings)',
      },
      duaCard: {
        title: 'इल्म की दुआ • सूरह ताहा (114)',
        reciter: 'क़िरात: शैख़ अब्दुर रहमान अल-सुदैस',
        translation: '“ऐ मेरे परवरदिगार! मेरे इल्म में इज़ाफ़ा फ़रमा”',
        clickToListen: 'तिलावत सुनने के लिए क्लिक करें',
      },
      stats: {
        profileTitle: 'प्रोफ़ाइल व पुरस्कार',
        coinsTitle: 'सिक्के (Coins)',
        streakTitle: 'दैनिक उपस्थिति (Streak)',
        remainingTime: '3 मिनट बाकी',
        timeFraction: '12 / 15 मिनट',
      },
      featuredHubs: {
        heading: '📖 क़ुरआनी व इस्लामी केंद्र',
        viewMore: 'और देखें',
        quranBadge: 'सभी 30 पारे | 114 सूरतें',
        quranTitle: 'क़ुरआन मजीद व नाज़िरा (सभी 30 पारे)',
        quranDesc: 'पारा 1 से 30 की सभी 114 सूरतें, अनुवाद, अलग-अलग पारे और सुंदर क़ारियों की तिलावत।',
        quranBtn: 'तिलावत सुनें व पढ़ें',
        islamicBadge: 'नमाज़, वज़ू, दुआएं व अज़कार',
        islamicTitle: 'इस्लामी शिक्षा केंद्र',
        islamicDesc: 'छह कलिमे, नमाज़ व वज़ू का सचित्र तरीक़ा, 40 मसनून दुआएं और अल्लाह के 99 नाम।',
        islamicBtn: 'सीखना शुरू करें',
      },
      interactiveGrid: {
        heading: '🎮 तजवीद, क़ायदा व शैक्षणिक खेल',
        viewMore: 'और देखें',
        madaniQaidah: {
          pill: 'सबक़ 1 से 17',
          title: 'मदनी क़ायदा',
          sub: 'मुफ़रदात, हरकात व तजवीद',
        },
        blankBoard: {
          pill: 'ऑडियो टेस्ट',
          title: 'ब्लैंक बोर्ड',
          sub: 'ख़ाली ख़ानों में हुरूफ लगाएं',
        },
        murakkabatPuzzle: {
          pill: 'पहेली खेल',
          title: 'मुरक्कबात पज़ल',
          sub: 'चुंबकीय अक्षर जोड़ें',
        },
        tajweedGames: {
          pill: 'क्विज़ चैलेंज',
          title: 'तजवीद गेम्स',
          sub: 'सुकून, मद्दा व नियम',
        },
        aiUstadh: {
          pill: 'AI आवाज़',
          title: 'प्रो एआई उस्ताद',
          sub: 'मख़रज व कैमरा स्कैन',
        },
        liveClassroom: {
          pill: 'लाइव सबक़',
          title: 'लाइव क्लासरूम',
          sub: 'उस्ताद से सीधा संपर्क',
        },
      },
      bottomNav: {
        home: 'होम',
        liveClass: 'लाइव क्लास',
        games: 'गेम्स',
        qaidaQuran: 'क़ायदा व क़ुरआन',
        parent: 'अभिभावक',
      },
    },
    gamification: {
      headerTitle: 'बैज, सिक्के और लीडरबोर्ड (Rewards & Leaderboard)',
      headerSub: 'XP पॉइंट्स, पुरस्कार और दैनिक सीखने की लय',
      backHome: 'वापस होम',
      streakLabel: 'लगातार दिन',
      coinsLabel: 'सिक्के',
      levelLabel: 'लेवल',
      daysSuffix: 'दिन',
      badgesHeading: 'प्राप्त किए गए बैज और सम्मान',
      leaderboardHeading: 'शीर्ष छात्र लीडरबोर्ड',
      rankLabel: 'स्थान',
      badges: {
        firstLetter: { title: 'पहला अक्षर मास्टर', desc: 'मदनी क़ायदे का पहला सबक़ पूरा किया' },
        tajweedChamp: { title: 'तजवीद चैंपियन', desc: '5 हुरूफ सही मख़रज से पढ़े' },
        hifzStar: { title: 'हिफ़्ज़ स्टार', desc: 'सूरह अल-इख़्लास ज़बानी याद की' },
        streak5: { title: 'लगातार 5 दिन', desc: 'लगातार 5 दिन ऐप का उपयोग किया' },
      },
      leaderboardNames: {
        userSuffix: '(आप)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← मुख्य पृष्ठ (Home)',
      title: 'तरतीबवार ब्लैंक बोर्ड',
    },
    qaidahHeader: {
      backBtn: 'वापस',
      title: 'मदनी क़ायदा',
      liveClassBtn: 'लाइव क्लास',
      searchPlaceholder: 'सबक़ खोजें (जैसे: वक़्फ़, हरकात, नून साकिन)...',
      noLessonFound: 'कोई सबक़ नहीं मिला',
    },
  },
  bn: {
    mainMenu: {
      menuTitle: '☰ মেইন মেনু',
      menuBadge: 'মেনু',
      menuSubtitle: 'তালিমুল কুরআন প্লে নেভিগেশন',
      homeBtn: '🏠 হোম (Home)',
      madrasaPortalTitle: 'তালিমুল কুরআন অনলাইন',
      madrasaPortalSub: 'সম্পূর্ণ মাদ্রাসা অ্যাডমিন প্যানেল',
      enterPortal: 'প্রবেশ করুন →',
      categories: {
        quran: {
          title: '📖 কুরআন শিক্ষা',
          qaidah: 'মাদানী কায়দা (পাঠ ১-১৭)',
          quran: 'পবিত্র কুরআন (৩০ পারা)',
          blankBoard: 'ধারাবাহিক ব্ল্যাঙ্ক বোর্ড',
        },
        games: {
          title: '🎮 কুইজ ও গেমস জোন',
          allGames: 'সকল তাজবীদ গেমস ও চ্যালেঞ্জ',
          magnetic: 'মুরাক্কাবাত ম্যাগনেটিক পাজল',
          quiz: 'কুরআনিক ও তাজবীদ কুইজ',
        },
        ai: {
          title: '🤖 এআই (AI) শিক্ষক',
          aiTutor: 'প্রো এআই শিক্ষক ও মাখরাজ কোচ',
          voicePortal: 'অডিও রেকর্ডিং ও আপলোড পোর্টাল',
        },
        islamic: {
          title: '🌙 ইসলামিক বই ও দোয়া',
          hub: 'ইসলামিক কেন্দ্র (নামাজ, দোয়া)',
          prayerTimes: 'নামাজের সময়সূচি ও কিবলা',
        },
        live: {
          title: '🎥 লাইভ ক্লাসরুম',
          liveClass: 'অনলাইন লাইভ শিক্ষক ক্লাস',
          fees: 'ফি ম্যানেজমেন্ট পোর্টাল',
        },
        parents: {
          title: '👨‍👩‍👧 অভিভাবক ড্যাশবোর্ড',
          controls: 'স্ক্রিন সময় ও অগ্রগতি রিপোর্ট',
        },
        profile: {
          title: '🏆 শিক্ষার্থীর প্রোফাইল ও পুরস্কার',
          rewards: 'কয়েন, ব্যাজ ও লিডারবোর্ড',
        },
      },
      footerButtons: {
        language: 'ভাষা পরিবর্তন করুন',
        settings: 'সেটিংস',
        security: 'নিরাপত্তা শিল্ড',
        about: 'অ্যাপ সম্পর্কে',
        privacy: 'গোপনীয়তা নীতি',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'অভিভাবক ড্যাশবোর্ড ও নিরাপত্তা',
        languageTitle: 'ভাষা পরিবর্তন করুন',
        settingsTitle: 'সেটিংস',
      },
      duaCard: {
        title: 'জ্ঞানের দোয়া • সূরা ত্বা-হা (১১৪)',
        reciter: 'তিলাওয়াত: শায়খ আব্দুর রহমান আস-সুদাইস',
        translation: '“হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি করুন”',
        clickToListen: 'তিলাওয়াত শুনতে ক্লিক করুন',
      },
      stats: {
        profileTitle: 'প্রোফাইল ও পুরস্কার',
        coinsTitle: 'কয়েন',
        streakTitle: 'ধারাবাহিক উপস্থিতি',
        remainingTime: '৩ মিনিট বাকি',
        timeFraction: '১২ / ১৫ মিনিট',
      },
      featuredHubs: {
        heading: '📖 কুরআনিক ও ইসলামিক কেন্দ্র',
        viewMore: 'আরও দেখুন',
        quranBadge: 'সকল ৩০ পারা | ১১৪ সূরা',
        quranTitle: 'কুরআন মাজীদ ও নাজেরা (৩০ পারা)',
        quranDesc: 'পারা ১ থেকে ৩০ এর ১১৪টি সূরা, অনুবাদ, প্রতিটি পারার অডিও ও সুন্দর তিলাওয়াত।',
        quranBtn: 'তিলাওয়াত শুনুন ও পড়ুন',
        islamicBadge: 'নামাজ, অজু, দোয়া ও জিকির',
        islamicTitle: 'ইসলামিক প্রশিক্ষণ কেন্দ্র',
        islamicDesc: '৬ কালেমা, সচিত্র নামাজ ও অজুর নিয়ম, ৪০টি মাসনূন দোয়া এবং আল্লাহর ৯৯ নাম।',
        islamicBtn: 'শেখা শুরু করুন',
      },
      interactiveGrid: {
        heading: '🎮 তাজবীদ, কায়দা ও শিক্ষামূলক গেম',
        viewMore: 'আরও দেখুন',
        madaniQaidah: {
          pill: 'পাঠ ১ থেকে ১৭',
          title: 'মাদানী কায়দা',
          sub: 'মুফরাদাত, হরকত ও তাজবীদ',
        },
        blankBoard: {
          pill: 'অডিও টেস্ট',
          title: 'ব্ল্যাঙ্ক বোর্ড',
          sub: 'খালি ঘরে অক্ষর সাজান',
        },
        murakkabatPuzzle: {
          pill: 'ধাঁধা গেম',
          title: 'মুরাক্কাবাত পাজল',
          sub: 'ম্যাগনেটিক অক্ষর জোড়া লাগান',
        },
        tajweedGames: {
          pill: 'কুইজ চ্যালেঞ্জ',
          title: 'তাজবীদ গেমস',
          sub: 'সুকুন, মাদ্দাত ও নিয়মাবলী',
        },
        aiUstadh: {
          pill: 'এআই ভয়েস',
          title: 'প্রো এআই শিক্ষক',
          sub: 'মাখরাজ ও ক্যামেরা স্ক্যান',
        },
        liveClassroom: {
          pill: 'লাইভ পাঠ',
          title: 'লাইভ ক্লাসরুম',
          sub: 'শিক্ষকের সাথে সরাসরি যোগাযোগ',
        },
      },
      bottomNav: {
        home: 'হোম',
        liveClass: 'লাইভ ক্লাস',
        games: 'গেমস',
        qaidaQuran: 'কায়দা ও কুরআন',
        parent: 'অভিভাবক',
      },
    },
    gamification: {
      headerTitle: 'ব্যাজ, কয়েন ও লিডারবোর্ড',
      headerSub: 'এক্সপি পয়েন্ট, পুরস্কার ও দৈনিক চ্যালেঞ্জ',
      backHome: 'হোমে ফিরুন',
      streakLabel: 'ধারাবাহিকতা',
      coinsLabel: 'কয়েন',
      levelLabel: 'লেভেল',
      daysSuffix: 'দিন',
      badgesHeading: 'অর্জিত ব্যাজ ও মেডেল',
      leaderboardHeading: 'শীর্ষ শিক্ষার্থীদের লিডারবোর্ড',
      rankLabel: 'স্থান',
      badges: {
        firstLetter: { title: 'প্রথম অক্ষর মাস্টার', desc: 'মাদানী কায়দার ১ম পাঠ সম্পন্ন করেছেন' },
        tajweedChamp: { title: 'তাজবীদ চ্যাম্পিয়ন', desc: '৫টি হরফ সঠিক মাখরাজে পড়েছেন' },
        hifzStar: { title: 'হিফজ স্টার', desc: 'সূরা আল-ইখলাস মুখস্থ করেছেন' },
        streak5: { title: 'ধারাবাহিক ৫ দিন', desc: 'টানা ৫ দিন অ্যাপ ব্যবহার করেছেন' },
      },
      leaderboardNames: {
        userSuffix: '(আপনি)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← হোম পেজ',
      title: 'ধারাবাহিক ব্ল্যাঙ্ক বোর্ড',
    },
    qaidahHeader: {
      backBtn: 'ফিরে যান',
      title: 'মাদানী কায়দা',
      liveClassBtn: 'লাইভ ক্লাস',
      searchPlaceholder: 'পাঠ অনুসন্ধান করুন (যেমন: ওয়াকফ, হরকত, নূন সাকিন)...',
      noLessonFound: 'কোন পাঠ পাওয়া যায়নি',
    },
  },
  id: {
    mainMenu: {
      menuTitle: '☰ MENU UTAMA',
      menuBadge: 'Menu',
      menuSubtitle: 'Navigasi Talimul Quran Play',
      homeBtn: '🏠 Beranda',
      madrasaPortalTitle: 'Talimul Quran Online',
      madrasaPortalSub: 'Panel Admin Madrasah Lengkap',
      enterPortal: 'Masuk →',
      categories: {
        quran: {
          title: '📖 Pembelajaran Al-Qur\'an',
          qaidah: 'Kaidah Madani (Pelajaran 1-17)',
          quran: 'Al-Qur\'an (Lengkap 30 Juz)',
          blankBoard: 'Papan Kosong Berurutan',
        },
        games: {
          title: '🎮 Zona Kuis & Game',
          allGames: 'Semua Game & Tantangan Tajwid',
          magnetic: 'Puzzle Magnetik Murakkabat',
          quiz: 'Kuis Al-Qur\'an & Tajwid',
        },
        ai: {
          title: '🤖 Guru AI & Audio',
          aiTutor: 'Guru AI Pro & Pelatih Makhraj',
          voicePortal: 'Portal Rekam & Unggah Audio',
        },
        islamic: {
          title: '🌙 Perpustakaan Islam & Doa',
          hub: 'Pusat Belajar Islam (Salat, Doa)',
          prayerTimes: 'Jadwal Salat & Arah Kiblat',
        },
        live: {
          title: '🎥 Ruang Kelas Live',
          liveClass: 'Kelas Live Bersama Guru',
          fees: 'Portal Manajemen Biaya',
        },
        parents: {
          title: '👨‍👩‍👧 Dasbor Orang Tua',
          controls: 'Waktu Layar & Laporan Kemajuan',
        },
        profile: {
          title: '🏆 Profil Siswa & Hadiah',
          rewards: 'Koin, Lencana & Papan Peringkat',
        },
      },
      footerButtons: {
        language: 'Pengaturan Bahasa',
        settings: 'Pengaturan',
        security: 'Perisai Keamanan',
        about: 'Tentang Aplikasi',
        privacy: 'Kebijakan Privasi',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'Dasbor Orang Tua & Keamanan',
        languageTitle: 'Pengaturan Bahasa',
        settingsTitle: 'Pengaturan',
      },
      duaCard: {
        title: 'Doa Memohon Ilmu • Surah Thaha (114)',
        reciter: 'Tilawah: Syekh Abdul Rahman Al-Sudais',
        translation: '“Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan”',
        clickToListen: 'Klik untuk mendengarkan tilawah',
      },
      stats: {
        profileTitle: 'Profil & Hadiah',
        coinsTitle: 'Koin',
        streakTitle: 'Rentetan Hari',
        remainingTime: '3 mnt tersisa',
        timeFraction: '12 / 15 mnt',
      },
      featuredHubs: {
        heading: '📖 Pusat Qur\'an & Edukasi Islam',
        viewMore: 'Lihat Semua',
        quranBadge: 'Lengkap 30 Juz | 114 Surah',
        quranTitle: 'Al-Qur\'an & Nazirah (30 Juz)',
        quranDesc: 'Semua 114 Surah dari Juz 1 hingga 30, terjemahan resmi, pemisahan per Juz, dan audio Qari jernih.',
        quranBtn: 'Dengar & Baca',
        islamicBadge: 'Salat, Wudu, Doa & Zikir',
        islamicTitle: 'Pusat Pembelajaran Islam',
        islamicDesc: '6 Kalimah, panduan bergambar Salat & Wudu, 40 Doa Masnun, dan 99 Asmaul Husna.',
        islamicBtn: 'Mulai Belajar',
      },
      interactiveGrid: {
        heading: '🎮 Tajwid, Kaidah & Game Edukasi',
        viewMore: 'Lihat Semua',
        madaniQaidah: {
          pill: 'Pelajaran 1-17',
          title: 'Kaidah Madani',
          sub: 'Mufradat, Harakat & Tajwid',
        },
        blankBoard: {
          pill: 'Tes Audio',
          title: 'Papan Kosong',
          sub: 'Susun huruf secara berurutan',
        },
        murakkabatPuzzle: {
          pill: 'Game Teka-teki',
          title: 'Puzzle Murakkabat',
          sub: 'Sambungkan huruf magnetik',
        },
        tajweedGames: {
          pill: 'Tantangan Kuis',
          title: 'Game Tajwid',
          sub: 'Sukun, Mad & Hukum Tajwid',
        },
        aiUstadh: {
          pill: 'Suara AI',
          title: 'Guru AI Pro',
          sub: 'Koreksi Makhraj & Scan Kamera',
        },
        liveClassroom: {
          pill: 'Pelajaran Live',
          title: 'Ruang Kelas Live',
          sub: 'Tatap muka langsung dengan guru',
        },
      },
      bottomNav: {
        home: 'Beranda',
        liveClass: 'Kelas Live',
        games: 'Game',
        qaidaQuran: 'Kaidah & Qur\'an',
        parent: 'Orang Tua',
      },
    },
    gamification: {
      headerTitle: 'Lencana, Koin & Papan Peringkat',
      headerSub: 'Poin XP, hadiah dan rentetan belajar harian',
      backHome: 'Kembali ke Beranda',
      streakLabel: 'Rentetan',
      coinsLabel: 'Koin',
      levelLabel: 'Level',
      daysSuffix: 'Hari',
      badgesHeading: 'Lencana & Penghargaan Diraih',
      leaderboardHeading: 'Papan Peringkat Santri Terbaik',
      rankLabel: 'Peringkat',
      badges: {
        firstLetter: { title: 'Ahli Huruf Pertama', desc: 'Menyelesaikan Pelajaran 1 Kaidah Madani' },
        tajweedChamp: { title: 'Juara Tajwid', desc: 'Melafalkan 5 huruf dengan makhraj tepat' },
        hifzStar: { title: 'Bintang Hifz', desc: 'Menghafal Surah Al-Ikhlas dengan lancar' },
        streak5: { title: '5 Hari Berturut-turut', desc: 'Belajar 5 hari berturut-turut di aplikasi' },
      },
      leaderboardNames: {
        userSuffix: '(Anda)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← Beranda Utama',
      title: 'Papan Kosong Berurutan',
    },
    qaidahHeader: {
      backBtn: 'Kembali',
      title: 'Kaidah Madani',
      liveClassBtn: 'Kelas Live',
      searchPlaceholder: 'Cari pelajaran (contoh: Waqaf, Harakat, Nun Sukun)...',
      noLessonFound: 'Pelajaran tidak ditemukan',
    },
  },
  tr: {
    mainMenu: {
      menuTitle: '☰ ANA MENÜ',
      menuBadge: 'Menü',
      menuSubtitle: 'Talimul Kuran Play Gezintisi',
      homeBtn: '🏠 Ana Sayfa',
      madrasaPortalTitle: 'Talimul Kuran Çevrimiçi',
      madrasaPortalSub: 'Tam Medrese Yönetim Paneli',
      enterPortal: 'Giriş Yap →',
      categories: {
        quran: {
          title: '📖 Kur\'an-ı Kerim Eğitimi',
          qaidah: 'Medeni Elifba (1-17. Dersler)',
          quran: 'Kur\'an-ı Kerim (30 Cüz)',
          blankBoard: 'Sıralı Boşluk Panosu',
        },
        games: {
          title: '🎮 Test ve Oyun Bölgesi',
          allGames: 'Tüm Tecvid Oyunları ve Görevler',
          magnetic: 'Manyetik Harf Bulmacası',
          quiz: 'Kur\'an ve Tecvid Testi',
        },
        ai: {
          title: '🤖 Yapay Zeka Hoca & Ses',
          aiTutor: 'Pro Yapay Zeka Hoca & Mahreç',
          voicePortal: 'Ses Kayıt ve Yükleme Portalı',
        },
        islamic: {
          title: '🌙 İslami Kütüphane & Dualar',
          hub: 'İslami Merkez (Namaz, Dualar)',
          prayerTimes: 'Namaz Vakitleri ve Kıble Yönü',
        },
        live: {
          title: '🎥 Canlı Sınıf',
          liveClass: 'Canlı Çevrimiçi Öğretmen Dersi',
          fees: 'Ücret Yönetim Portalı',
        },
        parents: {
          title: '👨‍👩‍👧 Ebeveyn Kontrol Paneli',
          controls: 'Ekran Süresi ve İlerleme Raporu',
        },
        profile: {
          title: '🏆 Öğrenci Profili ve Ödüller',
          rewards: 'Paralar, Rozetler ve Sıralama',
        },
      },
      footerButtons: {
        language: 'Dili Değiştir',
        settings: 'Ayarlar',
        security: 'Güvenlik Kalkanı',
        about: 'Uygulama Hakkında',
        privacy: 'Gizlilik Politikası',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'Ebeveyn Kontrolü ve Güvenlik',
        languageTitle: 'Dili Değiştir',
        settingsTitle: 'Ayarlar',
      },
      duaCard: {
        title: 'İlim Duası • Tâhâ Suresi (114)',
        reciter: 'Tilavet: Şeyh Abdurrahman es-Sudeys',
        translation: '“Rabbim, benim ilmimi artır”',
        clickToListen: 'Tilaveti dinlemek için tıklayın',
      },
      stats: {
        profileTitle: 'Profil ve Ödüller',
        coinsTitle: 'Madeni Paralar',
        streakTitle: 'Günlük Seri',
        remainingTime: '3 dk kaldı',
        timeFraction: '12 / 15 dk',
      },
      featuredHubs: {
        heading: '📖 Kur\'an ve İslami Merkezler',
        viewMore: 'Daha Fazla',
        quranBadge: 'Tüm 30 Cüz | 114 Sure',
        quranTitle: 'Kur\'an-ı Kerim ve Nazra (30 Cüz)',
        quranDesc: 'Cüz 1-30 arası 114 surenin tamamı, çeviriler, cüz bazlı gezinti ve berrak sesli tilavetler.',
        quranBtn: 'Dinle ve Oku',
        islamicBadge: 'Namaz, Abdest, Dualar ve Zikirler',
        islamicTitle: 'İslami Eğitim Merkezi',
        islamicDesc: '6 Kelime, resimli Namaz ve Abdest rehberi, 40 Masnun Dua ve sesli Esmaül Hüsna.',
        islamicBtn: 'Öğrenmeye Başla',
      },
      interactiveGrid: {
        heading: '🎮 Tecvid, Elifba ve Oyunlar',
        viewMore: 'Daha Fazla',
        madaniQaidah: {
          pill: '1-17. Dersler',
          title: 'Medeni Elifba',
          sub: 'Müfredat, Harekeler ve Tecvid',
        },
        blankBoard: {
          pill: 'Ses Testi',
          title: 'Boşluk Panosu',
          sub: 'Harfleri sırasıyla yerleştirin',
        },
        murakkabatPuzzle: {
          pill: 'Bulmaca Oyunu',
          title: 'Birleşik Harfler',
          sub: 'Manyetik harfleri birleştirin',
        },
        tajweedGames: {
          pill: 'Test Yarışması',
          title: 'Tecvid Oyunları',
          sub: 'Sükun, Medler ve Kurallar',
        },
        aiUstadh: {
          pill: 'Yapay Zeka Sesi',
          title: 'Pro Yapay Zeka Hoca',
          sub: 'Mahreç Analizi ve Kamera Tarama',
        },
        liveClassroom: {
          pill: 'Canlı Ders',
          title: 'Canlı Sınıf',
          sub: 'Öğretmenle doğrudan iletişim',
        },
      },
      bottomNav: {
        home: 'Ana Sayfa',
        liveClass: 'Canlı Sınıf',
        games: 'Oyunlar',
        qaidaQuran: 'Elifba & Kur\'an',
        parent: 'Ebeveyn',
      },
    },
    gamification: {
      headerTitle: 'Rozetler, Paralar ve Sıralama',
      headerSub: 'XP puanları, ödüller ve günlük çalışma serileri',
      backHome: 'Ana Sayfaya Dön',
      streakLabel: 'Seri',
      coinsLabel: 'Paralar',
      levelLabel: 'Seviye',
      daysSuffix: 'Gün',
      badgesHeading: 'Kazanılan Rozetler ve Başarılar',
      leaderboardHeading: 'En İyi Öğrenciler Sıralaması',
      rankLabel: 'Sıra',
      badges: {
        firstLetter: { title: 'İlk Harf Ustası', desc: 'Medeni Elifba 1. Dersi tamamlandı' },
        tajweedChamp: { title: 'Tecvid Şampiyonu', desc: '5 harfi doğru mahreç ile okudu' },
        hifzStar: { title: 'Hıfz Yıldızı', desc: 'İhlas Suresini ezberledi' },
        streak5: { title: '5 Günlük Seri', desc: 'Uygulamayı aralıksız 5 gün kullandı' },
      },
      leaderboardNames: {
        userSuffix: '(Sen)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← Ana Sayfa',
      title: 'Sıralı Boşluk Panosu',
    },
    qaidahHeader: {
      backBtn: 'Geri',
      title: 'Medeni Elifba',
      liveClassBtn: 'Canlı Ders',
      searchPlaceholder: 'Ders ara (örn: Vakıf, Harekeler, Sakin Nun)...',
      noLessonFound: 'Ders bulunamadı',
    },
  },
  fr: {
    mainMenu: {
      menuTitle: '☰ MENU PRINCIPAL',
      menuBadge: 'Menu',
      menuSubtitle: 'Navigation Ta\'limul Quran',
      homeBtn: '🏠 Accueil',
      madrasaPortalTitle: 'Talimul Quran en ligne',
      madrasaPortalSub: 'Panneau d\'administration complet',
      enterPortal: 'Entrer →',
      categories: {
        quran: {
          title: '📖 Études Coraniques',
          qaidah: 'Madani Qaida (Leçons 1-17)',
          quran: 'Saint Coran (30 Juz)',
          blankBoard: 'Tableau Blanc Séquentiel',
        },
        games: {
          title: '🎮 Zone Quiz & Jeux',
          allGames: 'Tous les Jeux de Tajwid & Défis',
          magnetic: 'Puzzle Magnétique Murakkabat',
          quiz: 'Quiz Coranique & Tajwid',
        },
        ai: {
          title: '🤖 Tuteur IA & Audio',
          aiTutor: 'Professeur IA Pro & Coach Makhraj',
          voicePortal: 'Portail d\'Enregistrement Audio',
        },
        islamic: {
          title: '🌙 Bibliothèque Islamique & Duas',
          hub: 'Centre Islamique (Prière, Invocations)',
          prayerTimes: 'Heures de Prière & Qibla',
        },
        live: {
          title: '🎥 Classe en Direct',
          liveClass: 'Classe en Ligne avec Enseignant',
          fees: 'Gestion des Frais',
        },
        parents: {
          title: '👨‍👩‍👧 Contrôle Parental',
          controls: 'Temps d\'Écran & Rapports',
        },
        profile: {
          title: '🏆 Profil & Récompenses',
          rewards: 'Pièces, Badges & Classement',
        },
      },
      footerButtons: {
        language: 'Changer de langue',
        settings: 'Paramètres',
        security: 'Bouclier de Sécurité',
        about: 'À propos',
        privacy: 'Politique de Confidentialité',
      },
    },
    homeScreen: {
      header: {
        parentDashboardTitle: 'Tableau de bord parental & Sécurité',
        languageTitle: 'Changer de langue',
        settingsTitle: 'Paramètres',
      },
      duaCard: {
        title: 'Invocation du savoir • Sourate Taha (114)',
        reciter: 'Récitation : Cheikh Abdul Rahman Al-Sudais',
        translation: '« Ô mon Seigneur, accroît mes connaissances »',
        clickToListen: 'Cliquez pour écouter la récitation',
      },
      stats: {
        profileTitle: 'Profil et Récompenses',
        coinsTitle: 'Pièces',
        streakTitle: 'Série quotidienne',
        remainingTime: '3 min restantes',
        timeFraction: '12 / 15 min',
      },
      featuredHubs: {
        heading: '📖 Centres Coraniques et Islamiques',
        viewMore: 'Voir Plus',
        quranBadge: 'Tous les 30 Juz | 114 Sourates',
        quranTitle: 'Saint Coran & Récitation (30 Juz)',
        quranDesc: 'Les 114 sourates des juz 1 à 30, traductions fidèles, navigation par juz et récitation limpide des Qaris.',
        quranBtn: 'Écouter et Lire',
        islamicBadge: 'Prière, Ablutions, Duas & Dhikr',
        islamicTitle: 'Centre d\'Éducation Islamique',
        islamicDesc: '6 Kalimas, guide illustré de prière et ablutions, 40 invocations et les 99 Noms d\'Allah avec audio.',
        islamicBtn: 'Commencer à apprendre',
      },
      interactiveGrid: {
        heading: '🎮 Tajwid, Qaida & Jeux Éducatifs',
        viewMore: 'Voir Plus',
        madaniQaidah: {
          pill: 'Leçons 1 à 17',
          title: 'Madani Qaida',
          sub: 'Mufradat, Harakat & Tajwid',
        },
        blankBoard: {
          pill: 'Test Audio',
          title: 'Tableau Blanc',
          sub: 'Placer les lettres dans l\'ordre',
        },
        murakkabatPuzzle: {
          pill: 'Jeu de Puzzle',
          title: 'Puzzle Murakkabat',
          sub: 'Connecter les lettres magnétiques',
        },
        tajweedGames: {
          pill: 'Défi Quiz',
          title: 'Jeux de Tajwid',
          sub: 'Soukoun, Maddat & Règles',
        },
        aiUstadh: {
          pill: 'Voix IA',
          title: 'Professeur IA Pro',
          sub: 'Makhraj vocal & Scan caméra',
        },
        liveClassroom: {
          pill: 'Cours en direct',
          title: 'Classe en Direct',
          sub: 'Interaction directe avec le professeur',
        },
      },
      bottomNav: {
        home: 'Accueil',
        liveClass: 'Classe Live',
        games: 'Jeux',
        qaidaQuran: 'Qaida & Coran',
        parent: 'Parents',
      },
    },
    gamification: {
      headerTitle: 'Badges, Pièces et Classement',
      headerSub: 'Points XP, récompenses et séries d\'apprentissage',
      backHome: 'Retour Accueil',
      streakLabel: 'Série',
      coinsLabel: 'Pièces',
      levelLabel: 'Niveau',
      daysSuffix: 'Jours',
      badgesHeading: 'Badges & Distinctions Obtenus',
      leaderboardHeading: 'Classement des Meilleurs Élèves',
      rankLabel: 'Rang',
      badges: {
        firstLetter: { title: 'Maître de la 1ère lettre', desc: 'Leçon 1 de Madani Qaida terminée' },
        tajweedChamp: { title: 'Champion du Tajwid', desc: '5 lettres prononcées avec le bon makhraj' },
        hifzStar: { title: 'Étoile du Hifz', desc: 'Sourate Al-Ikhlas mémorisée' },
        streak5: { title: 'Série de 5 jours', desc: 'Utilisation de l\'application 5 jours d\'affilée' },
      },
      leaderboardNames: {
        userSuffix: '(Vous)',
      },
    },
    sequentialBlankHeader: {
      backHome: '← Accueil',
      title: 'Tableau Blanc Séquentiel',
    },
    qaidahHeader: {
      backBtn: 'Retour',
      title: 'Madani Qaida',
      liveClassBtn: 'Classe Live',
      searchPlaceholder: 'Chercher une leçon (ex: Waqf, Harakat, Noun Sakin)...',
      noLessonFound: 'Aucune leçon trouvée',
    },
  },
};

export function getAppLocalization(lang: LanguageCode = 'ur'): AppLocalizationData {
  return APP_LOCALIZATIONS[lang] || APP_LOCALIZATIONS.ur;
}
