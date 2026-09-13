import { LanguageCode } from '../types';

export interface QaidaGamesTexts {
  backBtn: string;
  headerTitle: string;
  headerSubtitle: string;
  rankLevel: string;
  todayChallenge: string;
  todayChallengeReward: string;
  todayChallengeDesc: string;
  playNow: string;
  learningGamesHeading: string;
  playBtn: string;
  playPuzzleBtn: string;
  lessonTag1to12: string;
  
  // 5 Main Cards
  cardHurufTitle: string;
  cardHurufDesc: string;
  cardMagneticTitle: string;
  cardMagneticDesc: string;
  cardTajweedTitle: string;
  cardTajweedDesc: string;
  cardQuizTitle: string;
  cardQuizDesc: string;
  cardMemoryTitle: string;
  cardMemoryDesc: string;

  // Secondary Tabs
  tabTournament: string;
  tabBadges: string;
  tabDailyChallenge: string;

  // Sub-tabs in Tajweed Games
  subMutaharrikat: string;
  subSukoon: string;
  subMurakkabat: string;
  subMaddah: string;
  subLeen: string;
  subKhari: string;
  subTanween: string;
  subTashdeed: string;
  subNunSakin: string;
  subMeemSakin: string;
  subMeemPuzzle: string;
  subTafkheem: string;
  subTafkheemPuzzle: string;
  subMaddat: string;
  subMuqattaat: string;
}

export const QAIDA_GAMES_LOCALIZATION: Record<LanguageCode, QaidaGamesTexts> = {
  ur: {
    backBtn: 'واپس جائیں',
    headerTitle: 'قاعدہ و تجوید تعلیمی گیمز زون',
    headerSubtitle: 'کھیل ہی کھیل میں مکمل نورانی و مدنی قاعدہ اور تجوید کے تمام قوانین سیکھیں',
    rankLevel: 'درجہ / لیول',
    todayChallenge: '🔥 آج کا چیلنج',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'حروفِ تہجی اور مخارج ببل پاپ چیلنج مکمل کریں!',
    playNow: 'ابھی کھیلیں',
    learningGamesHeading: '📚 سیکھنے کے کھیل',
    playBtn: 'کھیلیں ▶',
    playPuzzleBtn: 'پزل کھیلیں 🎯',
    lessonTag1to12: 'سبق ۱ تا ۱۲',
    
    cardHurufTitle: '🔤 حروفِ مفردات',
    cardHurufDesc: 'بلینک بورڈ، مخارج اور شناخت',
    cardMagneticTitle: 'حروف جوڑ مقناطیسی پزل',
    cardMagneticDesc: 'مفردات، مرکبات، حرکات، سکون، مدہ، لین، کھڑی حرکات، تنوین، تشدید، نون ساکن، میم ساکن و تفخیم ترقیق',
    cardTajweedTitle: '📖 قاعدہ صوتی گیمز',
    cardTajweedDesc: 'متحرکات، سکون، مدہ، لین، کھڑی حرکات، تنوین، تشدید، نون ساکن، میم ساکن اور تفخیم و ترقیق',
    cardQuizTitle: '🧠 جامع قرآن کوئز',
    cardQuizDesc: 'تمام ۱۲ اسباق اور تجویدی قواعد (اظہار، اخفاء، ادغام، اقلاب، میم ساکن، تفخیم و ترقیق) کی جامع پرکھ',
    cardMemoryTitle: '🎯 یادداشت کارڈز',
    cardMemoryDesc: 'تمام اسباق ۱ تا ۱۲ کی تصویری و صوتی میموری جوڑیاں',

    tabTournament: '🏆 ہفتہ وار ٹورنامنٹ',
    tabBadges: '🏅 بیجز اور اعزازات',
    tabDailyChallenge: '👑 روزانہ تجوید چیلنج',

    subMutaharrikat: '🎯 متحرکات صوتی گیم',
    subSukoon: '🎯 ساکن و قلقلہ',
    subMurakkabat: '🧩 مرکبات مقناطیسی پزل',
    subMaddah: '🌊 حروف مدہ',
    subLeen: '🍃 حروف لین',
    subKhari: '📏 کھڑی حرکات',
    subTanween: '🔔 تنوین گیم',
    subTashdeed: '⚡ تشدید گیم',
    subNunSakin: '🌸 نون ساکن و تنوین',
    subMeemSakin: '🌟 میم ساکن گیم',
    subMeemPuzzle: '🧩 میم ساکن پزل',
    subTafkheem: '⚖️ تفخیم و ترقیق',
    subTafkheemPuzzle: '🧩 تفخیم ترقیق پزل',
    subMaddat: '🌈 اقسامِ مدات',
    subMuqattaat: '✨ حروفِ مقطعات',
  },
  en: {
    backBtn: 'Back',
    headerTitle: 'Qaidah & Tajweed Educational Games Zone',
    headerSubtitle: 'Master complete Noorani & Madani Qaidah rules playfully with interactive games',
    rankLevel: 'Rank / Level',
    todayChallenge: '🔥 Today\'s Challenge',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'Complete the Alphabet & Makharij recognition challenge!',
    playNow: 'Play Now',
    learningGamesHeading: '📚 Learning Games',
    playBtn: 'Play ▶',
    playPuzzleBtn: 'Play Puzzle 🎯',
    lessonTag1to12: 'Lessons 1 to 12',
    
    cardHurufTitle: '🔤 Individual Letters',
    cardHurufDesc: 'Blank board, articulation points & letter recognition',
    cardMagneticTitle: 'Letter Connector Magnetic Puzzle',
    cardMagneticDesc: 'Individual letters, compound shapes, vowels, sukoon, maddah, leen, tanween, tashdeed & tajweed rules',
    cardTajweedTitle: '📖 Qaidah Audio Games',
    cardTajweedDesc: 'Vowels, sukoon, maddah, leen, standing vowels, tanween, shaddah, nun/meem sakin & thick/thin rules',
    cardQuizTitle: '🧠 Comprehensive Quran Quiz',
    cardQuizDesc: 'Thorough evaluation across all 12 lessons and Tajweed rules (Izhar, Ikhfa, Idgham, Iqlab, etc.)',
    cardMemoryTitle: '🎯 Memory Match Cards',
    cardMemoryDesc: 'Visual & audio matching pairs across lessons 1 to 12',

    tabTournament: '🏆 Weekly Tournament',
    tabBadges: '🏅 Badges & Honors',
    tabDailyChallenge: '👑 Daily Tajweed Challenge',

    subMutaharrikat: '🎯 Vowels Audio Game',
    subSukoon: '🎯 Sukoon & Qalqalah',
    subMurakkabat: '🧩 Compound Letters Puzzle',
    subMaddah: '🌊 Maddah Letters',
    subLeen: '🍃 Leen Letters',
    subKhari: '📏 Standing Vowels',
    subTanween: '🔔 Tanween Game',
    subTashdeed: '⚡ Tashdeed Game',
    subNunSakin: '🌸 Nun Sakin & Tanween',
    subMeemSakin: '🌟 Meem Sakin Game',
    subMeemPuzzle: '🧩 Meem Sakin Puzzle',
    subTafkheem: '⚖️ Heavy & Light Letters',
    subTafkheemPuzzle: '🧩 Heavy/Light Puzzle',
    subMaddat: '🌈 Types of Madd',
    subMuqattaat: '✨ Muqatta\'at Letters',
  },
  ar: {
    backBtn: 'رجوع',
    headerTitle: 'منطقة ألعاب القاعدة والتجويد التعليمية',
    headerSubtitle: 'تعلم أحكام وقواعد قراءة القرآن الكريم والقاعدة النورانية والمدنية بطريقة تفاعلية ممتعة',
    rankLevel: 'الرتبة / المستوى',
    todayChallenge: '🔥 تحدي اليوم',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'أكمل تحدي الحروف الهجائية ومخارج الحروف!',
    playNow: 'العب الآن',
    learningGamesHeading: '📚 الألعاب التعليمية',
    playBtn: 'العب ▶',
    playPuzzleBtn: 'العب اللغز 🎯',
    lessonTag1to12: 'الدروس ١ إلى ١٢',
    
    cardHurufTitle: '🔤 الحروف المفردة',
    cardHurufDesc: 'اللوحة التفاعلية، مخارج الحروف وتمييز الأشكال',
    cardMagneticTitle: 'لغز تركيب الحروف المغناطيسي',
    cardMagneticDesc: 'المفردات، المركبات، الحركات، السكون، المد، اللين، التنوين، الشدة، وأحكام التجويد',
    cardTajweedTitle: '📖 ألعاب القاعدة الصوتية',
    cardTajweedDesc: 'المتحركات، السكون، المد، اللين، الحركات القائمة، التنوين، التشديد، النون والميم الساكنتان والتفخيم والترقيق',
    cardQuizTitle: '🧠 اختبار التجويد والقرآن الشامل',
    cardQuizDesc: 'تقييم شامل لجميع الدروس الـ ١٢ وأحكام التجويد (الإظهار، الإخفاء، الإدغام، الإقلاب)',
    cardMemoryTitle: '🎯 بطاقات الذاكرة',
    cardMemoryDesc: 'مطابقة سمعية وبصرية لجميع الدروس من ١ إلى ١٢',

    tabTournament: '🏆 الدوري الأسبوعي',
    tabBadges: '🏅 الأوسمة والإنجازات',
    tabDailyChallenge: '👑 تحدي التجويد اليومي',

    subMutaharrikat: '🎯 لعبة الحركات الصوتية',
    subSukoon: '🎯 السكون والقلقلة',
    subMurakkabat: '🧩 لغز الحروف المركبة',
    subMaddah: '🌊 حروف المد',
    subLeen: '🍃 حروف اللين',
    subKhari: '📏 الحركات القائمة',
    subTanween: '🔔 لعبة التنوين',
    subTashdeed: '⚡ لعبة التشديد',
    subNunSakin: '🌸 النون الساكنة والتنوين',
    subMeemSakin: '🌟 لعبة الميم الساكنة',
    subMeemPuzzle: '🧩 لغز الميم الساكنة',
    subTafkheem: '⚖️ التفخيم والترقيق',
    subTafkheemPuzzle: '🧩 لغز التفخيم والترقيق',
    subMaddat: '🌈 أقسام المدود',
    subMuqattaat: '✨ الحروف المقطعة',
  },
  hi: {
    backBtn: 'वापस जाएं',
    headerTitle: 'क़ायदा व तजवीद शैक्षिक खेल क्षेत्र',
    headerSubtitle: 'खेल-खेल में मुकम्मल नूरानी व मदनी क़ायदा और तजवीद के तमाम नियम सीखें',
    rankLevel: 'रैंक / स्तर',
    todayChallenge: '🔥 आज की चुनौती',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'अरबी वर्णमाला और मखारिज पहचान चुनौती पूरी करें!',
    playNow: 'अभी खेलें',
    learningGamesHeading: '📚 सीखने के खेल',
    playBtn: 'खेलें ▶',
    playPuzzleBtn: 'पहेली खेलें 🎯',
    lessonTag1to12: 'सबक १ से १२',
    
    cardHurufTitle: '🔤 मुफ़्रदात अक्षर',
    cardHurufDesc: 'ब्लैंक बोर्ड, मखारिज और अक्षरों की पहचान',
    cardMagneticTitle: 'अक्षर जोड़ मैग्नेटिक पहेली',
    cardMagneticDesc: 'मुफ़्रदात, मुरक्कबात, हरकत, सुकून, मद्ह, लीन, तनवीन, तशदीद और तजवीद नियम',
    cardTajweedTitle: '📖 क़ायदा ऑडियो गेम्स',
    cardTajweedDesc: 'हरकत, सुकून, मद्ह, लीन, खड़ी हरकत, तनवीन, तशदीद, नून साकिन, मीम साकिन व तफ़ख़ीम तरक़ीक़',
    cardQuizTitle: '🧠 समग्र क़ुरआन प्रश्नोत्तरी',
    cardQuizDesc: 'सभी १२ पाठों और तजवीद नियमों (इज़हार, इख़्फ़ा, इदग़ाम, इक़लाब) का व्यापक परीक्षण',
    cardMemoryTitle: '🎯 मेमोरी मैच कार्ड्स',
    cardMemoryDesc: 'सबक १ से १२ के दृश्य और ध्वनि मेमोरी जोड़े',

    tabTournament: '🏆 साप्ताहिक टूर्नामेंट',
    tabBadges: '🏅 पदक व सम्मान',
    tabDailyChallenge: '👑 दैनिक तजवीद चुनौती',

    subMutaharrikat: '🎯 मुतहर्रिकात ऑडियो गेम',
    subSukoon: '🎯 सुकून व क़लक़ला',
    subMurakkabat: '🧩 मुरक्कबात मैग्नेटिक पहेली',
    subMaddah: '🌊 हुरूफ-ए-मद्दा',
    subLeen: '🍃 हुरूफ-ए-लीन',
    subKhari: '📏 खड़ी हरकतें',
    subTanween: '🔔 तनवीन गेम',
    subTashdeed: '⚡ तशदीद गेम',
    subNunSakin: '🌸 नून साकिन व तनवीन',
    subMeemSakin: '🌟 मीम साकिन गेम',
    subMeemPuzzle: '🧩 मीम साकिन पहेली',
    subTafkheem: '⚖️ तफ़ख़ीम व तरक़ीक़ (मोटे व बारीक)',
    subTafkheemPuzzle: '🧩 तफ़ख़ीम पहेली',
    subMaddat: '🌈 मद्दात के प्रकार',
    subMuqattaat: '✨ हुरूफ-ए-मुक़त्तआत',
  },
  bn: {
    backBtn: 'ফিরে যান',
    headerTitle: 'কায়দা ও তাজবীদ শিক্ষামূলক গেম জোন',
    headerSubtitle: 'খেলার ছলে সম্পূর্ণ নূরানী ও মাদানী কায়দা এবং তাজবীদের সকল নিয়ম শিখুন',
    rankLevel: 'পদমর্যাদা / স্তর',
    todayChallenge: '🔥 আজকের চ্যালেঞ্জ',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'আরবি হরফ ও মাখরাজ সনাক্তকরণ চ্যালেঞ্জ সম্পন্ন করুন!',
    playNow: 'এখনই খেলুন',
    learningGamesHeading: '📚 শিক্ষামূলক গেম',
    playBtn: 'খেলুন ▶',
    playPuzzleBtn: 'ধাঁধা খেলুন 🎯',
    lessonTag1to12: 'পাঠ ১ থেকে ১২',
    
    cardHurufTitle: '🔤 মুফরাদাত হরফ',
    cardHurufDesc: 'ব্ল্যাঙ্ক বোর্ড, মাখরাজ ও হরফ সনাক্তকরণ',
    cardMagneticTitle: 'হরফ জোড়া চৌম্বকীয় ধাঁধা',
    cardMagneticDesc: 'মুফরাদাত, মুরাক্কাবাত, হরকত, সুকূন, মাদ্দাহ, লীন, তানভীন, তাশদীদ ও তাজবীদ নিয়ম',
    cardTajweedTitle: '📖 কায়দা অডিও গেমস',
    cardTajweedDesc: 'হরকত, সুকূন, মাদ্দাহ, লীন, খাড়া হরকত, তানভীন, তাশদীদ, নূন সাকিন, মীম সাকিন ও তাফখীম তারকীক',
    cardQuizTitle: '🧠 সামগ্রিক কুরআন কুইজ',
    cardQuizDesc: '১২টি পাঠ ও তাজবীদ নিয়মের (ইজহার, ইখফা, ইদগাম, ইকলাব) পূর্ণাঙ্গ পরীক্ষা',
    cardMemoryTitle: '🎯 মেমরি ম্যাচ কার্ড',
    cardMemoryDesc: 'পাঠ ১ থেকে ১২ এর ভিজ্যুয়াল ও অডিও মেমরি জোড়া',

    tabTournament: '🏆 সাপ্তাহিক টুর্নামেন্ট',
    tabBadges: '🏅 ব্যাজ ও সম্মাননা',
    tabDailyChallenge: '👑 দৈনিক তাজবীদ চ্যালেঞ্জ',

    subMutaharrikat: '🎯 মুতাহাররিকাত অডিও গেম',
    subSukoon: '🎯 সুকূন ও কলকলাহ',
    subMurakkabat: '🧩 মুরাক্কাবাত ম্যাগনেটিক ধাঁধা',
    subMaddah: '🌊 হরফে মাদ্দাহ',
    subLeen: '🍃 হরফে লীন',
    subKhari: '📏 খাড়া হরকত',
    subTanween: '🔔 তানভীন গেম',
    subTashdeed: '⚡ তাশদীদ গেম',
    subNunSakin: '🌸 নূন সাকিন ও তানভীন',
    subMeemSakin: '🌟 মীম সাকিন গেম',
    subMeemPuzzle: '🧩 মীম সাকিন ধাঁধা',
    subTafkheem: '⚖️ তাফখীম ও তারকীক',
    subTafkheemPuzzle: '🧩 তাফখীম ধাঁধা',
    subMaddat: '🌈 মাদ্দের প্রকারভেদ',
    subMuqattaat: '✨ হরুফে মুকাত্তাআত',
  },
  id: {
    backBtn: 'Kembali',
    headerTitle: 'Zona Permainan Edukatif Qaidah & Tajwid',
    headerSubtitle: 'Kuasai seluruh hukum Qaidah Noorani & Madani serta kaidah Tajwid secara interaktif dan menyenangkan',
    rankLevel: 'Pangkat / Level',
    todayChallenge: '🔥 Tantangan Hari Ini',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'Selesaikan tantangan pengenalan huruf hijaiyah dan makharijul huruf!',
    playNow: 'Main Sekarang',
    learningGamesHeading: '📚 Permainan Edukatif',
    playBtn: 'Mainkan ▶',
    playPuzzleBtn: 'Main Teka-teki 🎯',
    lessonTag1to12: 'Pelajaran 1 sampai 12',
    
    cardHurufTitle: '🔤 Huruf Tunggal',
    cardHurufDesc: 'Papan interaktif, makhraj dan pengenalan huruf',
    cardMagneticTitle: 'Teka-teki Magnetik Sambung Huruf',
    cardMagneticDesc: 'Huruf tunggal, sambung, harakat, sukun, mad, lin, tanwin, tasydid & kaidah tajwid',
    cardTajweedTitle: '📖 Permainan Audio Qaidah',
    cardTajweedDesc: 'Harakat, sukun, mad, lin, harakat berdiri, tanwin, tasydid, nun/mim mati & tafkhim tarqiq',
    cardQuizTitle: '🧠 Kuis Tajwid & Al-Qur\'an Lengkap',
    cardQuizDesc: 'Evaluasi menyeluruh untuk 12 pelajaran dan hukum tajwid (Idzhar, Ikhfa, Idgham, Iqlab)',
    cardMemoryTitle: '🎯 Kartu Memori Tajwid',
    cardMemoryDesc: 'Pasangan memori visual & audio untuk pelajaran 1 sampai 12',

    tabTournament: '🏆 Turnamen Mingguan',
    tabBadges: '🏅 Lencana & Penghargaan',
    tabDailyChallenge: '👑 Tantangan Tajwid Harian',

    subMutaharrikat: '🎯 Permainan Harakat Audio',
    subSukoon: '🎯 Sukun & Qalqalah',
    subMurakkabat: '🧩 Teka-teki Huruf Sambung',
    subMaddah: '🌊 Huruf Mad',
    subLeen: '🍃 Huruf Lin',
    subKhari: '📏 Harakat Berdiri',
    subTanween: '🔔 Permainan Tanwin',
    subTashdeed: '⚡ Permainan Tasydid',
    subNunSakin: '🌸 Nun Mati & Tanwin',
    subMeemSakin: '🌟 Permainan Mim Mati',
    subMeemPuzzle: '🧩 Teka-teki Mim Mati',
    subTafkheem: '⚖️ Tafkhim & Tarqiq',
    subTafkheemPuzzle: '🧩 Teka-teki Tafkhim',
    subMaddat: '🌈 Macam-macam Mad',
    subMuqattaat: '✨ Huruf Muqatta\'ah',
  },
  tr: {
    backBtn: 'Geri',
    headerTitle: 'Kaide ve Tecvid Eğitici Oyun Alanı',
    headerSubtitle: 'Eğlenceli oyunlarla Elif Ba ve Kur\'an-ı Kerim tecvid kurallarını eksiksiz öğrenin',
    rankLevel: 'Derece / Seviye',
    todayChallenge: '🔥 Günün Görevi',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'Harfler ve mahreçler tanıma görevini tamamlayın!',
    playNow: 'Hemen Oyna',
    learningGamesHeading: '📚 Öğrenme Oyunları',
    playBtn: 'Oyna ▶',
    playPuzzleBtn: 'Yapboz Oyna 🎯',
    lessonTag1to12: 'Ders 1 - 12',
    
    cardHurufTitle: '🔤 Müfredat Harfleri',
    cardHurufDesc: 'İnteraktif pano, mahreçler ve harf tanıma',
    cardMagneticTitle: 'Manyetik Harf Birleştirme Yapbozu',
    cardMagneticDesc: 'Ayrı harfler, bitişik harfler, harekeler, cezim, med, lin, tenvin, şedde ve tecvid kuralları',
    cardTajweedTitle: '📖 Kaide Sesli Oyunları',
    cardTajweedDesc: 'Harekeler, cezim, med, lin, uzatma harekeleri, tenvin, şedde, sakin nun/mim ve kalın/ince harfler',
    cardQuizTitle: '🧠 Kapsamlı Kur\'an Testi',
    cardQuizDesc: '12 dersin ve tecvid kurallarının (İzhar, İhfa, İdgam, İklab) tamamını içeren kapsamlı sınav',
    cardMemoryTitle: '🎯 Hafıza Eşleştirme Kartları',
    cardMemoryDesc: '1-12 dersleri için görsel ve sesli hafıza eşleştirme',

    tabTournament: '🏆 Haftalık Turnuva',
    tabBadges: '🏅 Rozetler ve Başarılar',
    tabDailyChallenge: '👑 Günlük Tecvid Görevi',

    subMutaharrikat: '🎯 Sesli Hareke Oyunu',
    subSukoon: '🎯 Cezim ve Kalkale',
    subMurakkabat: '🧩 Bitişik Harf Yapbozu',
    subMaddah: '🌊 Med Harfleri',
    subLeen: '🍃 Lin Harfleri',
    subKhari: '📏 Çekerli Harekeler',
    subTanween: '🔔 Tenvin Oyunu',
    subTashdeed: '⚡ Şedde Oyunu',
    subNunSakin: '🌸 Sakin Nun ve Tenvin',
    subMeemSakin: '🌟 Sakin Mim Oyunu',
    subMeemPuzzle: '🧩 Sakin Mim Yapbozu',
    subTafkheem: '⚖️ Kalın ve İnce Harfler',
    subTafkheemPuzzle: '🧩 Kalın/İnce Yapbozu',
    subMaddat: '🌈 Med Çeşitleri',
    subMuqattaat: '✨ Mukattaa Harfleri',
  },
  fr: {
    backBtn: 'Retour',
    headerTitle: 'Zone de Jeux Éducatifs Qaidah & Tajweed',
    headerSubtitle: 'Maîtrisez la Qaidah Noorani & Madani et les règles de récitation coranique par le jeu interactif',
    rankLevel: 'Rang / Niveau',
    todayChallenge: '🔥 Défi du Jour',
    todayChallengeReward: '+20 XP • +10 🪙',
    todayChallengeDesc: 'Complétez le défi de reconnaissance des lettres arabes et de leurs points d\'articulation !',
    playNow: 'Jouer',
    learningGamesHeading: '📚 Jeux d\'Apprentissage',
    playBtn: 'Jouer ▶',
    playPuzzleBtn: 'Jouer au Puzzle 🎯',
    lessonTag1to12: 'Leçons 1 à 12',
    
    cardHurufTitle: '🔤 Lettres Isolées',
    cardHurufDesc: 'Tableau interactif, points d\'articulation et reconnaissance des lettres',
    cardMagneticTitle: 'Puzzle Magnétique d\'Assemblage de Lettres',
    cardMagneticDesc: 'Lettres isolées, attachées, voyelles, sukoon, maddah, leen, tanween, tashdeed et règles de tajweed',
    cardTajweedTitle: '📖 Jeux Audio de Qaidah',
    cardTajweedDesc: 'Voyelles, sukoon, maddah, leen, voyelles longues, tanween, chadda, nun/mim sakin et lettres emphatiques',
    cardQuizTitle: '🧠 Quiz Complet du Coran & Tajweed',
    cardQuizDesc: 'Évaluation complète sur les 12 leçons et les règles de Tajweed (Izhar, Ikhfa, Idgham, Iqlab)',
    cardMemoryTitle: '🎯 Cartes Mémoire',
    cardMemoryDesc: 'Paires de mémoire visuelles et auditives pour les leçons 1 à 12',

    tabTournament: '🏆 Tournoi Hebdomadaire',
    tabBadges: '🏅 Badges & Distinctions',
    tabDailyChallenge: '👑 Défi Quotidien de Tajweed',

    subMutaharrikat: '🎯 Jeu Audio des Voyelles',
    subSukoon: '🎯 Sukoon & Qalqalah',
    subMurakkabat: '🧩 Puzzle des Lettres Liées',
    subMaddah: '🌊 Lettres de Maddah',
    subLeen: '🍃 Lettres de Leen',
    subKhari: '📏 Voyelles Longues Verticales',
    subTanween: '🔔 Jeu du Tanween',
    subTashdeed: '⚡ Jeu de la Tashdeed',
    subNunSakin: '🌸 Nun Sakin & Tanween',
    subMeemSakin: '🌟 Jeu du Meem Sakin',
    subMeemPuzzle: '🧩 Puzzle du Meem Sakin',
    subTafkheem: '⚖️ Lettres Emphatiques & Légères',
    subTafkheemPuzzle: '🧩 Puzzle Emphase',
    subMaddat: '🌈 Types d\'Allongement (Madd)',
    subMuqattaat: '✨ Lettres Muqatta\'at',
  },
};

export const getQaidaGamesLocalization = (lang: LanguageCode = 'ur'): QaidaGamesTexts => {
  return QAIDA_GAMES_LOCALIZATION[lang] || QAIDA_GAMES_LOCALIZATION.ur;
};
