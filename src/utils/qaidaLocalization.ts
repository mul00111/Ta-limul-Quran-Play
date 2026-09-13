import { LanguageCode } from '../types';

export interface QaidahTexts {
  dotNone: string;
  dotOneBelow: string;
  dotTwoAbove: string;
  dotThreeAbove: string;
  dotOneAbove: string;
  dotTwoBelow: string;
  dotStroke: string;

  makharijMap: string;
  audioVisualGame: string;
  magneticPuzzle: string;
  showDots: string;
  dotsHighlighted: string;
  completed: string;
  markComplete: string;
  recordYourVoice: string;
  yourVoiceBadge: string;
  maddLazim6Harakat: string;

  mufradatTitle: string;
  mufradatNote1: string;
  mufradatNote2: string;
  mufradatMustaliyah: string;
  mufradatMaddLazimRule: string;
  mufradatLipLetters: string;

  lessons: Record<string, string>;
}

export const QAIDAH_LOCALIZATION: Record<LanguageCode, QaidahTexts> = {
  ur: {
    dotNone: 'بے نقطہ (خالی)',
    dotOneBelow: '۱ نقطہ نیچے',
    dotTwoAbove: '۲ نقطے اوپر',
    dotThreeAbove: '۳ نقطے اوپر',
    dotOneAbove: '۱ نقطہ اوپر',
    dotTwoBelow: '۲ نقطے نیچے',
    dotStroke: 'بے نقطہ (کشش والا)',

    makharijMap: 'مخارج کا نقشہ',
    audioVisualGame: 'صوتی و بصری گیم 🎯',
    magneticPuzzle: 'مقناطیسی پزل 🧩',
    showDots: 'نقطے دکھائیں',
    dotsHighlighted: 'نقطے نمایاں',
    completed: 'مکمل شدہ',
    markComplete: 'مکمل کریں',
    recordYourVoice: '🎙️ اپنی آواز میں ریکارڈ کریں / آڈیو اپلوڈ کریں',
    yourVoiceBadge: 'آپ کی آواز',
    maddLazim6Harakat: 'مد لازم (۶ حرکات)',

    mufradatTitle: 'سبق نمبر (۱) : حُرُوفِ مُفْرَدَات و تَہجی',
    mufradatNote1: 'حروفِ مفردات یعنی حروفِ تہجی کل ۲۹ ہیں۔',
    mufradatNote2: 'حروفِ مفردات کو تجوید و قرأت کے مطابق عربی لہجے میں ادا کریں، یعنی بَا، تَا، ثَا، حَا، خَا، طَا، ظَا پڑھیں۔',
    mufradatMustaliyah: 'سات (۷) حروف ہر حالت میں پُر (موٹے) پڑھے جاتے ہیں، انہیں حروفِ مستعلیہ کہتے ہیں: خ، ص، ض، ط، ظ، غ، ق (خُصَّ ضَغْطٍ قِظْ)۔',
    mufradatMaddLazimRule: 'مد لازم حرفی: جن حروف میں مَدِّ لازم ہو، انہیں ۳ الف یعنی ۶ حرکات کھینچ کر پڑھیں۔',
    mufradatLipLetters: 'ہونٹوں سے صرف چار حروف ادا ہوتے ہیں: ب، ف، م، و۔',

    lessons: {
      mufradat: 'سبق ۱: مفردات',
      murakkabat: 'سبق ۲: مرکبات',
      harakat: 'سبق ۳: حَرَکات',
      sukoon: 'سبق ۴: سُکون',
      leen: 'سبق ۵: حروفِ لین',
      maddah: 'سبق ۶: حروفِ مَدَّہ',
      khari_harakat: 'سبق ۷: کھڑی حرکات',
      tanween: 'سبق ۸: تَنْوِیْن',
      tashdeed: 'سبق ۹: تَشْدِیْد',
      nun_sakin: 'سبق ۱۰: نون ساکن',
      meem_sakin: 'سبق ۱۱: میم ساکن',
      tafkheem_tarqeeq: 'سبق ۱۲: تفخیم و ترقیق',
      maddat: 'سبق ۱۳: مَدَّات',
      muqattaat: 'سبق ۱۴: حُرُوفِ مُقَطَّعَات',
      zaid_alif_rasm_khatt: 'سبق ۱۵: زائد الف و رسم الخط',
      mutafarriq_qawaid: 'سبق ۱۶: متفرق قواعد',
      waqf: 'سبق ۱۷: وقف',
    }
  },

  en: {
    dotNone: 'No dots (empty)',
    dotOneBelow: '1 dot below',
    dotTwoAbove: '2 dots above',
    dotThreeAbove: '3 dots above',
    dotOneAbove: '1 dot above',
    dotTwoBelow: '2 dots below',
    dotStroke: 'No dots (with stroke)',

    makharijMap: 'Makharij Chart',
    audioVisualGame: 'Audio-Visual Game 🎯',
    magneticPuzzle: 'Magnetic Puzzle 🧩',
    showDots: 'Show Dots',
    dotsHighlighted: 'Dots Highlighted',
    completed: 'Completed',
    markComplete: 'Mark Complete',
    recordYourVoice: '🎙️ Record Voice / Upload Audio',
    yourVoiceBadge: 'Your Voice',
    maddLazim6Harakat: 'Madd Lazim (6 Counts)',

    mufradatTitle: 'Lesson 1: Individual Arabic Alphabet (Mufradat)',
    mufradatNote1: 'There are 29 individual Arabic alphabet letters (Mufradat).',
    mufradatNote2: 'Pronounce letters in classical Arabic recitation style: Baa, Taa, Thaa, Haa, Khaa, Taa, Zhaa.',
    mufradatMustaliyah: 'Seven (7) letters are always read heavy (Tafkheem): خ، ص، ض، ط، ظ، غ، ق (Khussa Daghtin Qizh).',
    mufradatMaddLazimRule: 'Madd Lazim: Letters containing Madd Lazim are stretched for 6 counts (3 Alifs).',
    mufradatLipLetters: 'Only four letters originate from the lips: ب، ف، م، و (Baa, Faa, Meem, Waw).',

    lessons: {
      mufradat: 'Lesson 1: Mufradat',
      murakkabat: 'Lesson 2: Compound Letters',
      harakat: 'Lesson 3: Short Vowels (Harakat)',
      sukoon: 'Lesson 4: Sukoon & Qalqalah',
      leen: 'Lesson 5: Huroof Leen',
      maddah: 'Lesson 6: Huroof Maddah',
      khari_harakat: 'Lesson 7: Standing Vowels',
      tanween: 'Lesson 8: Tanween (Double Vowels)',
      tashdeed: 'Lesson 9: Tashdeed (Shaddah)',
      nun_sakin: 'Lesson 10: Nun Sakin & Tanween',
      meem_sakin: 'Lesson 11: Meem Sakin Rules',
      tafkheem_tarqeeq: 'Lesson 12: Heavy & Light Letters',
      maddat: 'Lesson 13: Rules of Maddat',
      muqattaat: 'Lesson 14: Huroof Muqatta\'at',
      zaid_alif_rasm_khatt: 'Lesson 15: Silent Alif & Script',
      mutafarriq_qawaid: 'Lesson 16: Miscellaneous Rules',
      waqf: 'Lesson 17: Rules of Waqf (Stopping)',
    }
  },

  ar: {
    dotNone: 'بلا نقط (خالٍ)',
    dotOneBelow: 'نقطة واحدة من أسفل',
    dotTwoAbove: 'نقطتان من أعلى',
    dotThreeAbove: '٣ نقاط من أعلى',
    dotOneAbove: 'نقطة واحدة من أعلى',
    dotTwoBelow: 'نقطتان من أسفل',
    dotStroke: 'بلا نقط (ذو كشيدة)',

    makharijMap: 'مخارج الحروف',
    audioVisualGame: 'لعبة سمعية بصرية 🎯',
    magneticPuzzle: 'الألغاز المغناطيسية 🧩',
    showDots: 'إظهار النقاط',
    dotsHighlighted: 'النقاط مميزة',
    completed: 'مكتمل',
    markComplete: 'تحديد كمكتمل',
    recordYourVoice: '🎙️ سجل بصوتك / ارفع ملف صوتي',
    yourVoiceBadge: 'صوتك',
    maddLazim6Harakat: 'مد لازم (٦ حركات)',

    mufradatTitle: 'الدرس رقم (١) : حُرُوفُ الْمُفْرَدَاتِ وَالْهِجَاءِ',
    mufradatNote1: 'الحروف المفردة (حروف الهجاء) تسعة وعشرون (٢٩) حرفاً.',
    mufradatNote2: 'انطق الحروف بالفصحى وأحكام التجويد: بَا، تَا، ثَا، حَا، خَا، طَا، ظَا.',
    mufradatMustaliyah: 'سبعة (٧) أحرف تُفخَّم دائماً وتُسمَّى حروف الاستعلاء: خ، ص، ض، ط، ظ، غ، ق ومجموعها (خُصَّ ضَغْطٍ قِظْ).',
    mufradatMaddLazimRule: 'المد اللازم الحرفي: الحروف التي بها مد لازم تُمَدُّ بمقدار ٦ حركات (٣ ألفات).',
    mufradatLipLetters: 'الحروف الشفوية (من الشفتين) أربعة فقط: ب، ف، م، و.',

    lessons: {
      mufradat: 'الدرس ١: المفردات',
      murakkabat: 'الدرس ٢: المركبات',
      harakat: 'الدرس ٣: الحركات',
      sukoon: 'الدرس ٤: السكون والقلقلة',
      leen: 'الدرس ٥: حروفا اللين',
      maddah: 'الدرس ٦: حروف المد',
      khari_harakat: 'الدرس ٧: الحركات القائمة',
      tanween: 'الدرس ٨: التنوين',
      tashdeed: 'الدرس ٩: الشدة',
      nun_sakin: 'الدرس ١٠: النون الساكنة',
      meem_sakin: 'الدرس ١١: الميم الساكنة',
      tafkheem_tarqeeq: 'الدرس ١٢: التفخيم والترقيق',
      maddat: 'الدرس ١٣: المدود',
      muqattaat: 'الدرس ١٤: الحروف المقطعة',
      zaid_alif_rasm_khatt: 'الدرس ١٥: الألف والرسم',
      mutafarriq_qawaid: 'الدرس ١٦: قواعد متفرقة',
      waqf: 'الدرس ١٧: الوقف',
    }
  },

  hi: {
    dotNone: 'बिना नुक्ते का (खाली)',
    dotOneBelow: '१ नुक्ता नीचे',
    dotTwoAbove: '२ नुक्ते ऊपर',
    dotThreeAbove: '३ नुक्ते ऊपर',
    dotOneAbove: '१ नुक्ता ऊपर',
    dotTwoBelow: '२ नुक्ते नीचे',
    dotStroke: 'बिना नुक्ते का (लकीर वाला)',

    makharijMap: 'मख़ारिज चार्ट',
    audioVisualGame: 'ऑडियो-विजुअल गेम 🎯',
    magneticPuzzle: 'मैग्नेटिक पज़ल 🧩',
    showDots: 'नुक्ते दिखाएं',
    dotsHighlighted: 'नुक्ते हाइलाइट',
    completed: 'पूर्ण हुआ',
    markComplete: 'पूर्ण करें',
    recordYourVoice: '🎙️ अपनी आवाज़ में रिकॉर्ड करें / ऑडियो अपलोड करें',
    yourVoiceBadge: 'आपकी आवाज़',
    maddLazim6Harakat: 'मद्दे लाज़िम (६ हरकतें)',

    mufradatTitle: 'सबक़ नंबर (१) : हुरूफ़-ए-मुफ़्रदात व तहज्जी',
    mufradatNote1: 'हुरूफ़-ए-मुफ़्रदात यानी अरबी वर्णमाला के कुल २९ अक्षर हैं।',
    mufradatNote2: 'अक्षरों का उच्चारण शुद्ध अरबी तजवीद के साथ करें: बा, ता, सा, हा, ख़ा, ता, ज़ा।',
    mufradatMustaliyah: 'सात (७) अक्षर हमेशा मोटे पढ़े जाते हैं (मुस्तअलिया): خ، ص، ض، ط، ظ، غ، ق।',
    mufradatMaddLazimRule: 'मद्दे लाज़िम: जिन अक्षरों में मद्दे लाज़िम हो, उन्हें ६ हरकात (३ अलिफ़) तक खींच कर पढ़ें।',
    mufradatLipLetters: 'होठों से सिर्फ चार अक्षर अदा होते हैं: ب، ف، م، و।',

    lessons: {
      mufradat: 'सबक़ १: मुफ़्रदात',
      murakkabat: 'सबक़ २: मुरक्कबात',
      harakat: 'सबक़ ३: हरकतें',
      sukoon: 'सबक़ ४: सुकून व क़लक़ला',
      leen: 'सबक़ ५: हुरूफ़-ए-लीन',
      maddah: 'सबक़ ६: हुरूफ़-ए-मद्दा',
      khari_harakat: 'सबक़ ७: खड़ी हरकतें',
      tanween: 'सबक़ ८: तनवीन',
      tashdeed: 'सबक़ ९: तशदीद',
      nun_sakin: 'सबक़ १०: नून साकिन',
      meem_sakin: 'सबक़ ११: मीम साकिन',
      tafkheem_tarqeeq: 'सबक़ १२: तफ़ख़ीम व तरक़ीक़',
      maddat: 'सबक़ १३: मद्दातों के नियम',
      muqattaat: 'सबक़ १४: हुरूफ़-ए-मुक़त्तआत',
      zaid_alif_rasm_khatt: 'सबक़ १५: ज़ायद अलिफ़ व रस्मुल ख़त',
      mutafarriq_qawaid: 'सबक़ १६: विविध नियम',
      waqf: 'सबक़ १७: वक़्फ़',
    }
  },

  bn: {
    dotNone: 'নুকতাহীন (খালি)',
    dotOneBelow: '১ নুকতা নিচে',
    dotTwoAbove: '২ নুকতা উপরে',
    dotThreeAbove: '৩ নুকতা উপরে',
    dotOneAbove: '১ নুকতা উপরে',
    dotTwoBelow: '২ নুকতা নিচে',
    dotStroke: 'নুকতাহীন (দণ্ডযুক্ত)',

    makharijMap: 'মাখরাজের তালিকা',
    audioVisualGame: 'অডিও-ভিজ্যুয়াল গেম 🎯',
    magneticPuzzle: 'ম্যাগনেটিক পাজল 🧩',
    showDots: 'নুকতা দেখান',
    dotsHighlighted: 'নুকতা হাইলাইট',
    completed: 'সম্পন্ন',
    markComplete: 'সম্পন্ন করুন',
    recordYourVoice: '🎙️ নিজের কণ্ঠে রেকর্ড করুন / অডিও আপলোড করুন',
    yourVoiceBadge: 'আপনার কণ্ঠ',
    maddLazim6Harakat: 'মাদ্দে লাযিম (৬ হরকত)',

    mufradatTitle: 'পাঠ নং (১) : একক হরফ (মুফরাদাত)',
    mufradatNote1: 'আরবি বর্ণমালার মোট ২৯টি একক হরফ (মুফরাদাত) রয়েছে।',
    mufradatNote2: 'হরফগুলো বিশুদ্ধ তাজবীদ সহকারে উচ্চারণ করুন: বা, তা, ছা, হা, খা, তা, যা।',
    mufradatMustaliyah: 'সাতটি (৭) হরফ সর্বদা মোটা (পুরু) করে পড়তে হয় (মুস্তা\'লিয়াহ): خ، ص، ض، ط، ظ، غ، ق।',
    mufradatMaddLazimRule: 'মাদ্দে লাযিম হরফী: যে হরফগুলোতে মাদ্দে লাযিম রয়েছে, সেগুলো ৬ হরকত (৩ আলিফ) পরিমাণ টানতে হবে।',
    mufradatLipLetters: 'ঠোঁট থেকে কেবল চারটি হরফ উচ্চারিত হয়: ب، ف، م، و।',

    lessons: {
      mufradat: 'পাঠ ১: মুফরাদাত',
      murakkabat: 'পাঠ ২: মুরাক্কাবাত',
      harakat: 'পাঠ ৩: হরকত',
      sukoon: 'পাঠ ৪: সাকিন ও কলকলাহ',
      leen: 'পাঠ ৫: হরুফে লীন',
      maddah: 'পাঠ ৬: হরুফে মাদ্দাহ',
      khari_harakat: 'পাঠ ৭: খাড়া হরকত',
      tanween: 'পাঠ ৮: তানভীন',
      tashdeed: 'পাঠ ৯: তাশদীদ',
      nun_sakin: 'পাঠ ১০: নূন সাকিন',
      meem_sakin: 'পাঠ ১১: মীম সাকিন',
      tafkheem_tarqeeq: 'পাঠ ১২: তাফখীম ও তারকীক',
      maddat: 'পাঠ ১৩: মাদ্দাত',
      muqattaat: 'পাঠ ১৪: হুরুফে মুকাত্তাআত',
      zaid_alif_rasm_khatt: 'পাঠ ১৫: অতিরিক্ত আলিফ',
      mutafarriq_qawaid: 'পাঠ ১৬: বিবিধ নিয়ম',
      waqf: 'পাঠ ১৭: ওয়াকফ',
    }
  },

  id: {
    dotNone: 'Tanpa titik (kosong)',
    dotOneBelow: '1 titik di bawah',
    dotTwoAbove: '2 titik di atas',
    dotThreeAbove: '3 titik di atas',
    dotOneAbove: '1 titik di atas',
    dotTwoBelow: '2 titik di bawah',
    dotStroke: 'Tanpa titik (garis)',

    makharijMap: 'Bagan Makharij',
    audioVisualGame: 'Game Audio-Visual 🎯',
    magneticPuzzle: 'Puzzle Magnetik 🧩',
    showDots: 'Tampilkan Titik',
    dotsHighlighted: 'Titik Disorot',
    completed: 'Selesai',
    markComplete: 'Tandai Selesai',
    recordYourVoice: '🎙️ Rekam Suara / Unggah Audio',
    yourVoiceBadge: 'Suaramu',
    maddLazim6Harakat: 'Mad Lazim (6 Harakat)',

    mufradatTitle: 'Pelajaran 1: Huruf Tunggal (Mufradat)',
    mufradatNote1: 'Huruf Mufradat (abjad Arab) berjumlah 29 huruf.',
    mufradatNote2: 'Lafalkan huruf dengan kaidah tajwid yang benar: Baa, Taa, Tsaa, Haa, Khaa, Thaa, Zhaa.',
    mufradatMustaliyah: 'Tujuh (7) huruf selalu dibaca tebal (Isti\'la): خ، ص، ض، ط، ظ، غ، ق (Khussa Dhaghthin Qizh).',
    mufradatMaddLazimRule: 'Mad Lazim: Huruf yang memiliki mad lazim dipanjangkan sepanjang 6 harakat (3 alif).',
    mufradatLipLetters: 'Hanya empat huruf yang keluar dari dua bibir: ب، ف، م، و.',

    lessons: {
      mufradat: 'Pelajaran 1: Mufradat',
      murakkabat: 'Pelajaran 2: Huruf Sambung',
      harakat: 'Pelajaran 3: Harakat',
      sukoon: 'Pelajaran 4: Sukun & Qalqalah',
      leen: 'Pelajaran 5: Huruf Lin',
      maddah: 'Pelajaran 6: Huruf Mad',
      khari_harakat: 'Pelajaran 7: Harakat Berdiri',
      tanween: 'Pelajaran 8: Tanwin',
      tashdeed: 'Pelajaran 9: Tasydid',
      nun_sakin: 'Pelajaran 10: Nun Sukun',
      meem_sakin: 'Pelajaran 11: Mim Sukun',
      tafkheem_tarqeeq: 'Pelajaran 12: Tafkhim & Tarqiq',
      maddat: 'Pelajaran 13: Hukum Mad',
      muqattaat: 'Pelajaran 14: Huruf Muqatta\'ah',
      zaid_alif_rasm_khatt: 'Pelajaran 15: Alif Zaidah',
      mutafarriq_qawaid: 'Pelajaran 16: Kaidah Lainnya',
      waqf: 'Pelajaran 17: Waqaf',
    }
  },

  tr: {
    dotNone: 'Noktasız (yalın)',
    dotOneBelow: 'Altta 1 nokta',
    dotTwoAbove: 'Üstte 2 nokta',
    dotThreeAbove: 'Üstte 3 nokta',
    dotOneAbove: 'Üstte 1 nokta',
    dotTwoBelow: 'Altta 2 nokta',
    dotStroke: 'Noktasız (çizgili)',

    makharijMap: 'Mahreç Tablosu',
    audioVisualGame: 'Görsel & İşitsel Oyun 🎯',
    magneticPuzzle: 'Manyetik Yapboz 🧩',
    showDots: 'Noktaları Göster',
    dotsHighlighted: 'Noktalar Vurgulandı',
    completed: 'Tamamlandı',
    markComplete: 'Tamamla',
    recordYourVoice: '🎙️ Kendi Sesinle Kaydet / Ses Yükle',
    yourVoiceBadge: 'Senin Sesin',
    maddLazim6Harakat: 'Meddi Lâzım (6 Hareke)',

    mufradatTitle: 'Ders 1: Müfredat (Tekil Arap Harfleri)',
    mufradatNote1: 'Arap alfabesinde toplam 29 tekil harf (Müfredat) bulunur.',
    mufradatNote2: 'Harfleri doğru tecvid ve Arapça telaffuzu ile okuyun: Bâ, Tâ, Sâ, Hâ, Hâ, Tâ, Zâ.',
    mufradatMustaliyah: 'Yedi (7) harf her zaman kalın okunur (İsti\'la harfleri): خ، ص، ض، ط، ظ، غ، ق.',
    mufradatMaddLazimRule: 'Harfî Meddi Lâzım: Meddi lâzım içeren harfler 6 hareke (3 elif miktarı) uzatılır.',
    mufradatLipLetters: 'Dudaklardan yalnızca dört harf çıkar: ب، ف، م، و.',

    lessons: {
      mufradat: 'Ders 1: Müfredat',
      murakkabat: 'Ders 2: Mürekkebat',
      harakat: 'Ders 3: Harekeler',
      sukoon: 'Ders 4: Sükun & Kalkale',
      leen: 'Ders 5: Lîn Harfleri',
      maddah: 'Ders 6: Med Harfleri',
      khari_harakat: 'Ders 7: Çekerler',
      tanween: 'Ders 8: Tenvin',
      tashdeed: 'Ders 9: Şedde',
      nun_sakin: 'Ders 10: Sâkin Nun',
      meem_sakin: 'Ders 11: Sâkin Mim',
      tafkheem_tarqeeq: 'Ders 12: Tefhim & Terkik',
      maddat: 'Ders 13: Medler',
      muqattaat: 'Ders 14: Hurûf-ı Mukattaa',
      zaid_alif_rasm_khatt: 'Ders 15: Zaid Elif',
      mutafarriq_qawaid: 'Ders 16: Çeşitli Kaideler',
      waqf: 'Ders 17: Vakıf',
    }
  },

  fr: {
    dotNone: 'Sans point (neutre)',
    dotOneBelow: '1 point en dessous',
    dotTwoAbove: '2 points au-dessus',
    dotThreeAbove: '3 points au-dessus',
    dotOneAbove: '1 point au-dessus',
    dotTwoBelow: '2 points en dessous',
    dotStroke: 'Sans point (avec trait)',

    makharijMap: 'Tableau des Makharij',
    audioVisualGame: 'Jeu Audio-Visuel 🎯',
    magneticPuzzle: 'Puzzle Magnétique 🧩',
    showDots: 'Afficher les points',
    dotsHighlighted: 'Points en surbrillance',
    completed: 'Terminé',
    markComplete: 'Marquer terminé',
    recordYourVoice: '🎙️ Enregistrer avec votre voix / Importer',
    yourVoiceBadge: 'Votre voix',
    maddLazim6Harakat: 'Madd Lazim (6 temps)',

    mufradatTitle: 'Leçon 1 : Lettres Individuelles de l\'Alphabet (Mufradat)',
    mufradatNote1: 'Il y a 29 lettres individuelles dans l\'alphabet arabe (Mufradat).',
    mufradatNote2: 'Prononcez les lettres selon les règles du Tajwid : Baa, Taa, Thaa, Haa, Khaa, Taa, Dhaa.',
    mufradatMustaliyah: 'Sept (7) lettres sont toujours emphatiques (lourdes) : خ، ص، ض، ط، ظ، غ، ق (Khoussa Daghtin Qizh).',
    mufradatMaddLazimRule: 'Madd Lazim : Les lettres contenant un allongement obligatoire sont prolongées de 6 temps.',
    mufradatLipLetters: 'Quatre lettres seulement proviennent des lèvres : ب، ف، م، و.',

    lessons: {
      mufradat: 'Leçon 1 : Mufradat',
      murakkabat: 'Leçon 2 : Lettres Composées',
      harakat: 'Leçon 3 : Voyelles Brèves',
      sukoon: 'Leçon 4 : Soukoun & Qalqalah',
      leen: 'Leçon 5 : Lettres de Lin',
      maddah: 'Leçon 6 : Lettres de Prolongation',
      khari_harakat: 'Leçon 7 : Voyelles Longues',
      tanween: 'Leçon 8 : Tanween',
      tashdeed: 'Leçon 9 : Tashdeed',
      nun_sakin: 'Leçon 10 : Nun Sakin',
      meem_sakin: 'Leçon 11 : Meem Sakin',
      tafkheem_tarqeeq: 'Leçon 12 : Emphase et Douceur',
      maddat: 'Leçon 13 : Règles de Madd',
      muqattaat: 'Leçon 14 : Lettres Disjointes',
      zaid_alif_rasm_khatt: 'Leçon 15 : Alif Muet',
      mutafarriq_qawaid: 'Leçon 16 : Règles Diverses',
      waqf: 'Leçon 17 : Règles de Waqf',
    }
  }
};

export const getQaidahLocalization = (lang: LanguageCode = 'ur'): QaidahTexts => {
  return QAIDAH_LOCALIZATION[lang] || QAIDAH_LOCALIZATION.ur;
};

export const getLocalizedDotText = (dotUrdu: string, lang: LanguageCode = 'ur'): string => {
  const loc = getQaidahLocalization(lang);
  switch (dotUrdu) {
    case 'بے نقطہ (خالی)': return loc.dotNone;
    case '۱ نقطہ نیچے': return loc.dotOneBelow;
    case '۲ نقطے اوپر': return loc.dotTwoAbove;
    case '۳ نقطے اوپر': return loc.dotThreeAbove;
    case '۱ نقطہ اوپر': return loc.dotOneAbove;
    case '۲ نقطے نیچے': return loc.dotTwoBelow;
    case 'بے نقطہ (کشش والا)': return loc.dotStroke;
    default: return dotUrdu;
  }
};
