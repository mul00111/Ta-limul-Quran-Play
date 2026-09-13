import { LanguageCode } from '../types';
import { MadrasaDonationProject, MadrasaBankAccount, MadrasaClass } from './madrasaData';

export interface LocalizedProjectInfo {
  title: string;
  subtitle: string;
  description: string;
  unitCostLabel: string;
}

export const MADRASA_PROJECT_LOCALIZATIONS: Record<string, Record<LanguageCode, LocalizedProjectInfo>> = {
  'PRJ-1': {
    ur: {
      title: 'کفالتِ طالب علم (حفظ و ناظرہ قرآن)',
      subtitle: 'ایک سال یا ایک ماہ کے لیے مستحق طالب علم کے تعلیمی اخراجات کی کفالت',
      description: 'غریب و نادار اور یتیم بچوں کو مکمل مفت دینی تعلیم، کتب، اور اساتذہ کی رہنمائی فراہم کرنے کے لیے ماہانہ کفالت۔',
      unitCostLabel: 'ماہانہ کفالت: 3,000 ₹ فی طالب علم'
    },
    en: {
      title: 'Student Sponsorship (Hifz & Quran Nazirah)',
      subtitle: 'Sponsor educational & living expenses of a deserving student for one year or month',
      description: 'Monthly sponsorship providing completely free Quranic education, books, and teacher guidance for needy and orphan students.',
      unitCostLabel: 'Monthly Sponsorship: ₹3,000 / student'
    },
    hi: {
      title: 'छात्र प्रायोजन (हिफ्ज़ व नाज़िरा कुरआन)',
      subtitle: 'एक माह या वर्ष के लिए पात्र छात्र के शैक्षिक व्यय का प्रायोजन',
      description: 'गरीब, जरूरतमंद और अनाथ बच्चों को मुफ्त दीनी तालीम, किताबें और उस्ताद की देखरेख प्रदान करने हेतु मासिक प्रायोजन।',
      unitCostLabel: 'मासिक प्रायोजन: ₹3,000 प्रति छात्र'
    },
    bn: {
      title: 'ছাত্র স্পনসরশিপ (হিফজ ও নাজেরা কুরআন)',
      subtitle: 'এক মাস বা বছরের জন্য সুবিধাবঞ্চিত শিক্ষার্থীর শিক্ষা খরচ বহন',
      description: 'দরিদ্র ও এতিম শিক্ষার্থীদের বিনামূল্যে দ্বীনি শিক্ষা, কিতাব এবং শিক্ষক সহায়তার জন্য মাসিক স্পনসরশিপ।',
      unitCostLabel: 'মাসিক স্পনসর: ৩,০০০ ₹ / ছাত্র'
    },
    ar: {
      title: 'كفالة طالب علم (حفظ وناظرة القرآن الكريم)',
      subtitle: 'كفالة النفقات التعليمية لطالب مستحق لمدة شهر أو سنة كاملة',
      description: 'كفالة شهرية لتوفير تعليم قرآني مجاني بالكامل وكتب ورعاية للأطفال الأيتام والمحتاجين.',
      unitCostLabel: 'كفالة شهرية: 3,000 ₹ لكل طالب'
    },
    id: {
      title: 'Sponsor Santri (Tahfiz & Nazirah Al-Qur\'an)',
      subtitle: 'Menanggung biaya pendidikan & kafalah santri dhuafa selama sebulan atau setahun',
      description: 'Sponsor bulanan untuk menyediakan pendidikan agama gratis, kitab, dan bimbingan guru bagi anak yatim & dhuafa.',
      unitCostLabel: 'Sponsor Bulanan: 3.000 ₹ per santri'
    },
    tr: {
      title: 'Öğrenci Bursu (Hafızlık ve Nazıra Kuran)',
      subtitle: 'İhtiyaç sahibi bir öğrencinin aylık veya yıllık eğitim masraflarını karşılama',
      description: 'Yetim ve muhtaç çocuklara ücretsiz dini eğitim, kitap ve hoca rehberliği sağlamak için aylık burs.',
      unitCostLabel: 'Aylık Burs: 3.000 ₹ / öğrenci'
    },
    fr: {
      title: 'Parrainage d\'Étudiant (Hifz & Nazirah)',
      subtitle: 'Parrainez les frais scolaires d\'un élève méritant pour un mois ou un an',
      description: 'Parrainage mensuel pour offrir une éducation coranique gratuite, des livres et un encadrement aux orphelins.',
      unitCostLabel: 'Parrainage mensuel : 3 000 ₹ / élève'
    }
  },
  'PRJ-2': {
    ur: {
      title: 'اعانت و وظائفِ اساتذہ کرام',
      subtitle: 'قرآن کریم کے مخلص اساتذہ و قراء کی باوقار معاونت و تنخواہیں',
      description: 'دن رات قرآن پڑھانے والے اساتذہ اور معلمات کے ماہانہ مشاہرے اور اعزازیہ کی ادائیگی تاکہ تدریس کا سلسلہ بلاتعطل جاری رہے۔',
      unitCostLabel: 'ماہانہ اعزازیہ: 25,000 ₹ فی استاد'
    },
    en: {
      title: 'Teacher Salaries & Honorarium',
      subtitle: 'Dignified monthly salary support for dedicated Quran teachers & Qaris',
      description: 'Monthly honorarium and salaries for teachers who dedicate their lives to Quranic instruction day and night.',
      unitCostLabel: 'Monthly Honorarium: ₹25,000 / teacher'
    },
    hi: {
      title: 'शिक्षकों की सहायता व मानदेय',
      subtitle: 'कुरआन के निष्ठावान शिक्षकों और कारियों का सम्मानजनक वेतन समर्थन',
      description: 'दिन-रात कुरआन पढ़ाने वाले शिक्षकों को मासिक मानदेय ताकि तालीम बिना किसी रुकावट के जारी रहे।',
      unitCostLabel: 'मासिक मानदेय: ₹25,000 प्रति शिक्षक'
    },
    bn: {
      title: 'শিক্ষক সহায়তা ও সম্মানী',
      subtitle: 'কোরআনের একনিষ্ঠ শিক্ষক ও কারীদের সম্মানজনক বেতন সহায়তা',
      description: 'দিনরাত কোরআন শিক্ষাদানকারী সম্মানিত শিক্ষকদের মাসিক বেতন ও ভাতা প্রদানের তহবিল।',
      unitCostLabel: 'মাসিক সম্মানী: ২৫,০০০ ₹ / শিক্ষক'
    },
    ar: {
      title: 'رواتب ومكافآت المعلمين الكرام',
      subtitle: 'دعم كريم لرواتب ومكافآت معلمي وقراء القرآن الكريم',
      description: 'سداد الرواتب والمكافآت الشهرية للمعلمين لضمان استمرار حلقات التحفيظ والتعليم دون انقطاع.',
      unitCostLabel: 'مكافأة شهرية: 25,000 ₹ لكل معلم'
    },
    id: {
      title: 'Kafalah & Gaji Guru Al-Qur\'an',
      subtitle: 'Bantuan gaji terhormat bagi para ustadz & pengajar tahfiz',
      description: 'Penyaluran kafalah bulanan untuk guru-guru yang mengajar Al-Qur\'an agar kegiatan belajar terus berjalan lancar.',
      unitCostLabel: 'Kafalah Bulanan: 25.000 ₹ / guru'
    },
    tr: {
      title: 'Kuran Kursu Hocaları Maaş Fonu',
      subtitle: 'Kuran öğretmenleri ve Kariler için onurlu maaş desteği',
      description: 'Gece gündüz Kuran öğreten hocaların aylık maaşlarının karşılanarak eğitimin kesintisiz sürmesi.',
      unitCostLabel: 'Aylık Maaş: 25.000 ₹ / hoca'
    },
    fr: {
      title: 'Salaires & Soutien des Enseignants',
      subtitle: 'Soutien salarial pour les professeurs dévoués du Saint Coran',
      description: 'Prise en charge des salaires et indemnités des enseignants pour assurer la continuité des cours.',
      unitCostLabel: 'Indemnité : 25 000 ₹ / enseignant'
    }
  },
  'PRJ-3': {
    ur: {
      title: 'راشن و طعامِ طلبہ (لنگرِ قرآن)',
      subtitle: 'مقیم طلباء کے لیے پاکیزہ کھانا اور ناشتہ',
      description: 'مدرسہ میں زیرِ تعلیم طلباء کے لیے روزانہ دو وقت کا باعزت اور غذائیت بخش کھانا اور دودھ و پھل کی فراہمی۔',
      unitCostLabel: 'ماہانہ خوراک: 5,000 ₹ فی بچہ'
    },
    en: {
      title: 'Student Meals & Ration (Quran Kitchen)',
      subtitle: 'Wholesome nutritious breakfast and meals for resident students',
      description: 'Providing two daily nutritious meals, milk, and seasonal fruits for students enrolled at the Madrasa.',
      unitCostLabel: 'Monthly Food: ₹5,000 / child'
    },
    hi: {
      title: 'छात्रों का भोजन व राशन (लंगर-ए-कुरआन)',
      subtitle: 'आवासीय छात्रों के लिए शुद्ध पौष्टिक भोजन व नाश्ता',
      description: 'मदरसे के विद्यार्थियों को प्रतिदिन दो समय का पौष्टिक भोजन, दूध और फल उपलब्ध कराना।',
      unitCostLabel: 'मासिक भोजन: ₹5,000 प्रति बच्चा'
    },
    bn: {
      title: 'ছাত্রদের খাদ্য ও রেশন (লঙ্গরে কোরআন)',
      subtitle: 'আবাসিক শিক্ষার্থীদের জন্য স্বাস্থ্যকর খাবার ও নাস্তা',
      description: 'মাদ্রাসার শিক্ষার্থীদের প্রতিদিন দুই বেলা পুষ্টিকর খাবার, দুধ ও ফলমূল সরবরাহ।',
      unitCostLabel: 'মাসিক খাদ্য: ৫,০০০ ₹ / শিশু'
    },
    ar: {
      title: 'إطعام ووجبات الطلاب (مائدة القرآن)',
      subtitle: 'طعام صحي ونظيف ووجبات غذائية للطلاب المقيمين',
      description: 'توفير وجبتين يوميتين مغذيتين وحليب وفواكه للطلاب الدارسين في رحاب المدرسة.',
      unitCostLabel: 'إطعام شهري: 5,000 ₹ لكل طالب'
    },
    id: {
      title: 'Konsumsi & Makanan Bergizi Santri',
      subtitle: 'Makanan sehat dan sarapan higienis untuk santri mukim',
      description: 'Penyediaan 2 kali makan harian yang bergizi, susu, dan buah untuk santri madrasah.',
      unitCostLabel: 'Biaya Makan: 5.000 ₹ / anak / bln'
    },
    tr: {
      title: 'Öğrenci Yemek ve İaşe Fonu',
      subtitle: 'Yatılı hafızlık öğrencileri için temiz ve besleyici yemekler',
      description: 'Medresede okuyan öğrencilere günlük iki öğün sağlıklı yemek, süt ve meyve ikramı.',
      unitCostLabel: 'Aylık Yemek: 5.000 ₹ / öğrenci'
    },
    fr: {
      title: 'Repas & Nutrition des Étudiants',
      subtitle: 'Repas équilibrés et petits-déjeuners sains pour les élèves résidents',
      description: 'Fourniture quotidienne de deux repas complets, lait et fruits pour les étudiants.',
      unitCostLabel: 'Ration mensuelle : 5 000 ₹ / élève'
    }
  },
  'PRJ-4': {
    ur: {
      title: 'تعمیر و تجدیدِ مدرسہ و کلاس رومز (للہ فنڈ)',
      subtitle: 'ڈیجیٹل سٹوڈیو، کلاس روم کی تعمیر، سولر سسٹم اور کتب خانہ',
      description: 'آن لائن ریکارڈنگ سٹوڈیو کی بہتری، طلباء کے لیے کلاس روم فرنیچر، سولر انورٹر اور ساؤنڈ سسٹم کی فراہمی برائے للہ فنڈ۔',
      unitCostLabel: 'للہ عطیہ برائے تعمیر'
    },
    en: {
      title: 'Madrasa Construction & Classrooms Setup',
      subtitle: 'Digital studio, classroom building, solar system & library',
      description: 'Online recording studio setup, classroom desks, solar backup inverters, and audio equipment for Lillah fund.',
      unitCostLabel: 'Lillah Construction Fund'
    },
    hi: {
      title: 'मदरसा निर्माण व क्लासरूम नवीनीकरण',
      subtitle: 'डिजिटल स्टूडियो, कक्षा निर्माण, सोलर सिस्टम और पुस्तकालय',
      description: 'ऑनलाइन रिकॉर्डिंग स्टूडियो, क्लासरूम फर्नीचर, सोलर इन्वर्टर और साउंड सिस्टम की व्यवस्था।',
      unitCostLabel: 'निर्माण हेतु लिल्लाह दान'
    },
    bn: {
      title: 'মাদ্রাসা নির্মাণ ও ক্লাসরুম উন্নয়ন',
      subtitle: 'ডিজিটাল স্টুডিও, ক্লাসরুম নির্মাণ, সোলার সিস্টেম ও লাইব্রেরি',
      description: 'অনলাইন রেকর্ডিং স্টুডিও, শিক্ষার্থীদের ডেস্ক, সোলার ইনভার্টার ও সাউন্ড সিস্টেমের উন্নয়ন।',
      unitCostLabel: 'নির্মাণের জন্য লিল্লাহ অনুদান'
    },
    ar: {
      title: 'بناء وتجهيز المدرسة والفصول الدراسية',
      subtitle: 'استوديو رقمي، بناء وتجديد الفصول، طاقة شمسية ومكتبة',
      description: 'تجهيز استوديو التسجيل وفصول الطلاب بالأثاث والإنارة الشمسية والأجهزة الصوتية الحديثة.',
      unitCostLabel: 'تبرع لله للبناء والتجهيز'
    },
    id: {
      title: 'Pembangunan & Renovasi Ruang Belajar',
      subtitle: 'Studio rekaman digital, kelas baru, panel surya & perpustakaan',
      description: 'Penyediaan studio online, meja belajar, solar inverter, dan pengeras suara untuk kegiatan madrasah.',
      unitCostLabel: 'Infaq Pembangunan Lillah'
    },
    tr: {
      title: 'Medrese İnşaat ve Derslik Yenileme',
      subtitle: 'Dijital stüdyo, sınıf yapımı, güneş enerjisi ve kütüphane',
      description: 'Kayıt stüdyosu, öğrenci sıraları, solar invertör ve ses sistemi kurulumu.',
      unitCostLabel: 'İnşaat İçin Lillah Bağışı'
    },
    fr: {
      title: 'Construction & Aménagement des Classes',
      subtitle: 'Studio numérique, salles de classe, énergie solaire & bibliothèque',
      description: 'Aménagement du studio d\'enregistrement, mobilier de classe, onduleurs solaires et sono.',
      unitCostLabel: 'Don Lillah pour Travaux'
    }
  },
  'PRJ-5': {
    ur: {
      title: 'کتب، مصاحف اور تعلیمی بیگ کی تقسیم (للہ فنڈ)',
      subtitle: 'نئے طلباء میں نورانی قاعدے، قرآن مجید کے نسخے اور بستے کی فراہمی',
      description: 'قرآن کریم کے خوبصورت نسخے، تجویدی قاعدے اور تعلیمی سٹیشنری طلباء میں للہ عطیہ کے طور پر تقسیم کرنے کا فنڈ۔',
      unitCostLabel: 'ایک قرآنی کٹ: 1,500 ₹'
    },
    en: {
      title: 'Quran Copies, Qaidas & Student Bags Kit',
      subtitle: 'Providing Noorani Qaidas, Quran copies, and educational bags to new students',
      description: 'Distributing printed copies of the Holy Quran, Tajweed Qaidas, and learning stationery sets to enrolled learners.',
      unitCostLabel: 'One Quran Learning Kit: ₹1,500'
    },
    hi: {
      title: 'किताबें, कुरआन व शैक्षिक बैग वितरण',
      subtitle: 'नए छात्रों को नूरानी कायदा, पवित्र कुरआन और बस्ता प्रदान करना',
      description: 'छात्रों को पवित्र कुरआन के नुस्खे, तजवीदी कायदा और स्टेशनरी लिल्लाह दान के रूप में वितरण।',
      unitCostLabel: 'एक कुरआनी किट: ₹1,500'
    },
    bn: {
      title: 'বই, কুরআন শরীফ ও শিক্ষা ব্যাগ বিতরণ',
      subtitle: 'নতুন শিক্ষার্থীদের নূরানী কায়দা, কুরআন ও ব্যাগ প্রদান',
      description: 'পবিত্র কুরআনের কপি, তাজবীদি কায়দা ও শিক্ষা সামগ্রী শিক্ষার্থীদের মাঝে উপহার হিসেবে বিতরণ।',
      unitCostLabel: 'একটি কুরআন কিট: ১,৫০০ ₹'
    },
    ar: {
      title: 'توزيع المصاحف والكتب والحقائب التعليمية',
      subtitle: 'توفير القاعدة النورانية والمصاحف والحقائب للطلاب الجدد',
      description: 'توزيع نسخ المصحف الشريف وكتب التجويد والأدوات المكتبية مجاناً على الطلاب في سبيل الله.',
      unitCostLabel: 'حقيبة قرآنية كاملة: 1,500 ₹'
    },
    id: {
      title: 'Distribusi Mushaf, Qaidah & Tas Belajar',
      subtitle: 'Pemberian Iqro/Qaidah, Mushaf Al-Qur\'an, dan tas santri baru',
      description: 'Penyaluran mushaf Al-Qur\'an terjemah/hafalan, buku tajwid, dan perlengkapan tulis untuk santri.',
      unitCostLabel: '1 Paket Qurani: 1.500 ₹'
    },
    tr: {
      title: 'Kuran-ı Kerim, Elifba ve Çanta Dağıtımı',
      subtitle: 'Yeni öğrencilere Elifba, Kuran nüshası ve okul çantası hediye etme',
      description: 'Öğrencilere Kuran-ı Kerim, tecvid risaleleri ve kırtasiye malzemeleri dağıtım fonu.',
      unitCostLabel: 'Bir Kuran Eğitim Seti: 1.500 ₹'
    },
    fr: {
      title: 'Distribution de Corans, Livres & Trousses',
      subtitle: 'Fourniture de Nourani Qaida, exemplaires du Coran et sacs d\'école',
      description: 'Distribution d\'exemplaires du Saint Coran, règles de Tajwid et fournitures scolaires.',
      unitCostLabel: 'Un Kit Coranique : 1 500 ₹'
    }
  },
  'PRJ-6': {
    ur: {
      title: 'عمومی للہ عطیات فنڈ (General Lillah Fund)',
      subtitle: 'جامعہ کے جملہ تعلیمی، انتظامی و تدریسی اخراجات کے لیے خالص للہ عطیات',
      description: 'اللہ کی رضا اور خوشنودی کے لیے مدرسہ کے تمام ضروری تعلیمی اخراجات، یوٹیلیٹی بلز اور انتظامی ضروریات کے لیے للہ فنڈ۔',
      unitCostLabel: 'خالص للہ عطیہ'
    },
    en: {
      title: 'General Lillah Donations Fund',
      subtitle: 'Pure Lillah funds for overall educational, administrative, and teaching utilities',
      description: 'Seeking the pleasure of Allah by supporting essential utility bills, administrative needs, and campus upkeep.',
      unitCostLabel: 'Pure Lillah Donation'
    },
    hi: {
      title: 'सामान्य लिल्लाह दान फंड (General Lillah)',
      subtitle: 'जामिया के समस्त शैक्षिक, प्रशासनिक व संचालन खर्च हेतु',
      description: 'अल्लाह की रज़ा के लिए मदरसे के आवश्यक बिजली बिल, प्रशासनिक व शैक्षिक व्यय हेतु शुद्ध लिल्लाह दान।',
      unitCostLabel: 'शुद्ध लिल्लाह दान'
    },
    bn: {
      title: 'সাধারণ লিল্লাহ অনুদান তহবিল',
      subtitle: 'মাদ্রাসার সার্বিক শিক্ষা, প্রশাসনিক ও ব্যবস্থাপনা খরচ',
      description: 'মাদ্রাসার বিদ্যুৎ বিল, প্রশাসনিক ও শিক্ষার যাবতীয় প্রয়োজনে খাঁটি লিল্লাহ ফান্ড।',
      unitCostLabel: 'খাঁটি লিল্লাহ অনুদান'
    },
    ar: {
      title: 'صندوق تبرعات لله العام',
      subtitle: 'تبرعات خالصة للنفقات التعليمية والإدارية والتشغيلية للمدرسة',
      description: 'ابتغاء مرضاة الله لدعم فواتير الخدمات والاحتياجات الإدارية والتسييرية لمقر المدرسة.',
      unitCostLabel: 'تبرع لله خالص'
    },
    id: {
      title: 'Dana Umum Donasi Lillah',
      subtitle: 'Dana Lillah untuk operasional, administrasi, dan pendidikan madrasah',
      description: 'Mencari ridho Allah untuk pembiayaan listrik, administrasi, dan pemeliharaan madrasah.',
      unitCostLabel: 'Donasi Lillah Murni'
    },
    tr: {
      title: 'Genel Lillah Bağış Fonu',
      subtitle: 'Medresenin tüm eğitim, idari ve işletme giderleri için',
      description: 'Allah rızası için elektrik faturaları, idari ihtiyaçlar ve medrese masrafları.',
      unitCostLabel: 'Halis Lillah Bağışı'
    },
    fr: {
      title: 'Fonds Général de Dons Lillah',
      subtitle: 'Fonds Lillah purs pour les frais éducatifs, administratifs et de fonctionnement',
      description: 'Pour l\'agrément d\'Allah, soutien aux factures, dépenses administratives et besoins généraux.',
      unitCostLabel: 'Don Lillah Pur'
    }
  }
};

export const MADRASA_CLASS_LOCALIZATIONS: Record<string, Record<LanguageCode, { name: string; description: string }>> = {
  'CLS-1': {
    ur: {
      name: 'درجہ ۱: نورانی و مدنی قاعدہ',
      description: 'ابتدائی حروف، مفردات، مرکبات، حرکات، تنوین اور سکون کی بنیادی مشق مع مخارج'
    },
    en: {
      name: 'Grade 1: Noorani & Madani Qaida',
      description: 'Basic Arabic alphabet, joined letters, vowel marks (Harakat, Tanween, Sukoon) with articulation points (Makharij).'
    },
    hi: {
      name: 'दर्जा १: नूरानी व मदनी कायदा',
      description: 'शुरुआती अक्षर, मुफरदात, मुरक्कबात, हरकात, तनवीन और सुकून की बुनियादी मश्क मय मखारिज।'
    },
    bn: {
      name: 'শ্রেণি ১: নূরানী ও মাদানী কায়দা',
      description: 'আরবি বর্ণমালা, হরকত, তানভীন, সাকিন ও মাখরাজের মৌলিক অনুশীলন।'
    },
    ar: {
      name: 'المستوى ١: القاعدة النورانية والمدنية',
      description: 'الحروف الهجائية، المفردات، المركبات، الحركات، التنوين ومخارج الحروف الأساسية.'
    },
    id: {
      name: 'Tingkat 1: Qaidah Noorani & Madani',
      description: 'Pengenalan huruf hijaiyah, harakat, tanwin, sukun, dan makharijul huruf dasar.'
    },
    tr: {
      name: '1. Seviye: Elifba ve Temel Tecvid',
      description: 'Harflerin mahreçleri, harekeler, tenvin, cezm ve temel Kuran okuma kuralları.'
    },
    fr: {
      name: 'Niveau 1 : Nourani & Madani Qaida',
      description: 'Alphabet arabe, voyelles, tanwin, soukoun et points d\'articulation (Makharij).'
    }
  },
  'CLS-2': {
    ur: {
      name: 'درجہ ۲: ناظرہ قرآن مع تجوید',
      description: 'پارہ عم تا مکمل قرآن پاک کی روانی اور احکامِ تجوید (اخفاء، ادغام، اظہار، اقلاب) کے ساتھ تلاوت'
    },
    en: {
      name: 'Grade 2: Quran Nazirah with Tajweed',
      description: 'Fluent recitation of Juz Amma to Full Quran following Tajweed rules (Ikhfa, Idgham, Izhar, Iqlab).'
    },
    hi: {
      name: 'दर्जा २: नाज़िरा कुरआन मय तजवीद',
      description: 'पारा अम्मा से मुकम्मल कुरआन पाक की रवानी और अहकाम-ए-तजवीद के साथ तिलावत।'
    },
    bn: {
      name: 'শ্রেণি ২: নাজেরা কুরআন ও তাজবীদ',
      description: 'আমপারা থেকে পূর্ণ কুরআন তাজবীদের নিয়ম (ইখফা, ইদগাম, ইজহার) সহ তিলাওয়াত।'
    },
    ar: {
      name: 'المستوى ٢: ناظرة القرآن مع التجويد',
      description: 'تلاوة جزء عم إلى الختمة مع تطبيق أحكام التجويد (الإخفاء، الإدغام، الإظهار، الإقلاب).'
    },
    id: {
      name: 'Tingkat 2: Nazirah Al-Qur\'an & Tajwid',
      description: 'Membaca Juz \'Amma hingga khatam dengan kaidah tajwid lengkap.'
    },
    tr: {
      name: '2. Seviye: Tecvidli Kuran Okuma (Nazıra)',
      description: 'Tecvid kuralları (ihfa, izhar, idgam, iklab) ile akıcı Kuran tilaveti.'
    },
    fr: {
      name: 'Niveau 2 : Nazirah avec Règles de Tajweed',
      description: 'Récitation fluide du Saint Coran avec application des règles de Tajweed.'
    }
  },
  'CLS-3': {
    ur: {
      name: 'درجہ ۳: شعبہ حفظ القرآن الکریم',
      description: 'قرآن مجید کا حفظ مع سبق، سبقی، منزل اور دور کا سخت روزانہ جائزہ'
    },
    en: {
      name: 'Grade 3: Quran Hifz Department',
      description: 'Memorization of the Holy Quran with daily evaluation of Sabaq, Sabqi, and Manzil revisions.'
    },
    hi: {
      name: 'दर्जा ३: हिफ्ज़-उल-कुरआन विभाग',
      description: 'पवित्र कुरआन का कंठस्थीकरण (सबक, सबक़ी और मंज़िल का दैनिक मूल्यांकन)।'
    },
    bn: {
      name: 'শ্রেণি ৩: হিফজুল কুরআন বিভাগ',
      description: 'কুরআনুল কারীম হিফজ ও প্রতিদিনের ছবক, ছবকী ও মনজিল তদারকি।'
    },
    ar: {
      name: 'المستوى ٣: قسم تحفيظ القرآن الكريم',
      description: 'حفظ القرآن الكريم مع المتابعة اليومية للدرس والسبقي والمنزل والمراجعة المستمرة.'
    },
    id: {
      name: 'Tingkat 3: Tahfiz Al-Qur\'an (Hifz)',
      description: 'Hafalan Al-Qur\'an 30 juz dengan setoran harian (sabaq, sabqi, manzil).'
    },
    tr: {
      name: '3. Seviye: Hafızlık Bölümü (Hıfz)',
      description: 'Kuran-ı Kerim hafızlığı, günlük ders (hamşira) ve hasene tekrarları.'
    },
    fr: {
      name: 'Niveau 3 : Mémorisation du Coran (Hifz)',
      description: 'Mémorisation intégrale avec suivi quotidien des révisions et leçons.'
    }
  },
  'CLS-4': {
    ur: {
      name: 'درجہ ۴: خصوصی تجوید و قراءت',
      description: 'مخارج الحروف، صفاتِ لازمہ و عارضہ، مدات اور حسنِ صوت کی اعلیٰ مشق'
    },
    en: {
      name: 'Grade 4: Advanced Tajweed & Qira\'at',
      description: 'Letter attributes, Madd rules, voice beautification and classical recitation styles.'
    },
    hi: {
      name: 'दर्जा ४: उन्नत तजवीद व किरात',
      description: 'मखारिज, सिफात-ए-लाज़िमा व आरिज़ा, मद्दाद और सुरीली तिलावत की उच्च मश्क।'
    },
    bn: {
      name: 'শ্রেণি ৪: উচ্চতর তাজবীদ ও ক্বিরাত',
      description: 'মাখরাজ, সিফাত, মাদ্দ ও সুন্দর কণ্ঠে তিলাওয়াতের বিশেষ প্রশিক্ষণ।'
    },
    ar: {
      name: 'المستوى ٤: التجويد المتقدم والقراءات',
      description: 'صفات الحروف ومخارجها والمدود والوقف والابتداء وتحسين الصوت بالتلاوة.'
    },
    id: {
      name: 'Tingkat 4: Tajwid Lanjutan & Seni Tilawah',
      description: 'Sifat huruf, mad, waqaf & ibtida serta irama tilawah Al-Qur\'an.'
    },
    tr: {
      name: '4. Seviye: İleri Tecvid ve Kıraat',
      description: 'Harf sıfatları, medler, vakıf-ibtidâ ve makamlı Kuran okuma dersleri.'
    },
    fr: {
      name: 'Niveau 4 : Tajweed Avancé & Qira\'at',
      description: 'Attributs des lettres, règles d\'élongation (Madd) et mélodie de récitation.'
    }
  },
  'CLS-5': {
    ur: {
      name: 'درجہ ۵: دینیات، مسنون دعائیں و فقہ',
      description: 'مسنون دعائیں، وضو و نماز کا عملی طریقہ، بنیادی عقائد اور سیرت النبی ﷺ'
    },
    en: {
      name: 'Grade 5: Deeniyat, Masnoon Duas & Fiqh',
      description: 'Daily Sunnah supplications, practical Wudu/Salah steps, basic beliefs and Seerah of Prophet Muhammad ﷺ.'
    },
    hi: {
      name: 'दर्जा ५: दीनियात, मसनून दुआएं व फ़िक़्ह',
      description: 'दैनिक सुन्नत दुआएं, वुज़ू व नमाज़ का व्यावहारिक तरीका, अक़ाइद और सीरत-उन-नबी ﷺ।'
    },
    bn: {
      name: 'শ্রেণি ৫: দ্বীনিয়াত, মাসনূন দোয়া ও ফিকহ',
      description: 'দৈনন্দিন মাসনূন দোয়া, অজু-নামাজের নিয়ম, মৌলিক আকাইদ ও সীরাতুন্নবী ﷺ।'
    },
    ar: {
      name: 'المستوى ٥: الدراسات الإسلامية والأدعية والفقه',
      description: 'الأدعية المأثورة، صفة الوضوء والصلاة، العقيدة الإسلامية والسيرة النبوية الشريفة ﷺ.'
    },
    id: {
      name: 'Tingkat 5: Dirasah Islamiyah & Doa Sunnah',
      description: 'Doa harian, tata cara wudhu & shalat praktis, akidah dasar, dan Sirah Nabawiyah ﷺ.'
    },
    tr: {
      name: '5. Seviye: İlmihal, Dua ve Siyer-i Nebi',
      description: 'Günlük sünnet dualar, abdest ve namaz tatbikatı, temel akaid ve Peygamber Efendimiz\'in ﷺ hayatı.'
    },
    fr: {
      name: 'Niveau 5 : Éducation Islamique & Douas',
      description: 'Invocations quotidiennes, pratique des ablutions et de la prière, croyances et Sirah ﷺ.'
    }
  }
};

export interface LocalizedDonationUIStrings {
  sectionTitle: string;
  sectionDesc: string;
  lillahFundsBadge: string;
  suggestedDonation: string;
  donateBtnText: string;
  raisedText: string;
  totalDonationsLabel: string;
  monthlyPledgeLabel: string;
  sponsoredCountLabel: string;
  donorsCountLabel: string;

  // Sponsorship
  sponsorTabHeading: string;
  sponsorTabSubheading: string;
  hadithText: string;
  sonOfText: string;
  sponsoredBadge: string;
  needsSponsorBadge: string;
  classLabel: string;
  currentLessonLabel: string;
  monthlyFeeLabel: string;
  sponsorStudentBtn: string;
  sendExtraAidBtn: string;

  // Bank & QR
  bankHeading: string;
  bankSubheading: string;
  officialVerifiedBadge: string;
  openGpayBtnText: string;
  scanQrPrompt: string;
  detailsTitle: string;
  detailsSub: string;
  accNameLabel: string;
  bankLabel: string;
  accNumLabel: string;
  ifscLabel: string;
  upiLabel: string;
  branchCodeLabel: string;
  facilityLabel: string;
  recordAndGetReceiptBtn: string;
  copiedText: string;
  copyText: string;
  whatsappInstruction: string;
  whatsappSendBtn: string;

  // History
  searchPlaceholderText: string;
  allCategoriesText: string;
  recordNewDonationBtnText: string;
  thReceipt: string;
  thDonorName: string;
  thCategoryName: string;
  thAmountValue: string;
  thPaymentChannel: string;
  thDateVal: string;
  thStatusVal: string;
  thActionVal: string;
  emptyRecordsText: string;
  anonymousLabel: string;
  monthlyRecurringBadge: string;
  receivedStatusText: string;
  viewReceiptBtnText: string;

  // Form Modal
  modalTitle: string;
  modalSub: string;
  formCategoryPrompt: string;
  formStudentPrompt: string;
  formGeneralFundOption: string;
  formAmountPrompt: string;
  formCurrencyPrompt: string;
  formDonorPrompt: string;
  formAnonCheckbox: string;
  formPhonePrompt: string;
  formCityPrompt: string;
  formPayChannelPrompt: string;
  formTrxPrompt: string;
  formDirectPayTitle: string;
  formPledgeTitle: string;
  formPledgeSub: string;
  formNotesPrompt: string;
  formCancel: string;
  formSaveAndGenerateReceipt: string;

  // Receipt Modal
  receiptBismillahText: string;
  receiptMadrasaName: string;
  receiptDeptTitle: string;
  receiptHeadingTag: string;
  receiptNoLabel: string;
  receiptDateLabel: string;
  receiptDonorLabel: string;
  receiptCityLabel: string;
  receiptPhoneLabel: string;
  receiptPurposeLabel: string;
  receiptMethodLabel: string;
  receiptNotesLabel: string;
  receiptPaidLabel: string;
  receiptStatusText: string;
  receiptDuaHead: string;
  receiptDuaSub: string;
  receiptSealText: string;
  receiptAdminSignText: string;
  receiptCloseBtn: string;
  receiptShareBtn: string;
  receiptPrintBtn: string;
}

export const DONATION_UI_STRINGS: Record<LanguageCode, LocalizedDonationUIStrings> = {
  ur: {
    sectionTitle: 'مدرسہ کے فنڈز اور خالص للہ عطیات کے منصوبے',
    sectionDesc: 'اپنے خالص للہ عطیات کے لیے مطلوبہ شعبے کا انتخاب کریں (نوٹ: یہاں صرف للہ عطیات قبول کیے جاتے ہیں)',
    lillahFundsBadge: '✨ صرف للہ عطیات (Lillah Funds Only)',
    suggestedDonation: 'تجویز کردہ عطیہ:',
    donateBtnText: 'اس شعبے میں عطیہ دیں',
    raisedText: 'جمع شدہ:',
    totalDonationsLabel: 'کل وصول شدہ للہ عطیات',
    monthlyPledgeLabel: 'رواں ماہ کے عطیات',
    sponsoredCountLabel: 'کفالت شدہ طلباء',
    donorsCountLabel: 'معزز ڈونرز',

    sponsorTabHeading: 'طلباء و طالبات کی مکمل ماہانہ/سالانہ کفالت',
    sponsorTabSubheading: 'ایک طالب علم کی ماہانہ کفالت صرف 3,000 ₹ (INR) ہے جس سے اس کے حفظ و ناظرہ کا خرچ ادا ہوتا ہے۔',
    hadithText: 'حدیثِ مبارکہ: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»',
    sonOfText: 'ولد',
    sponsoredBadge: 'کفالت جاری ہے',
    needsSponsorBadge: 'کفالت درکار ہے',
    classLabel: 'کلاس / درجہ:',
    currentLessonLabel: 'موجودہ سبق:',
    monthlyFeeLabel: 'ماہانہ فیس / کفالت:',
    sponsorStudentBtn: 'اس طالب علم کی کفالت کریں',
    sendExtraAidBtn: 'مزید تعاون / وظیفہ بھیجیں',

    bankHeading: 'باضابطہ تصدیق شدہ اکاؤنٹ و یو پی آئی کیو آر',
    bankSubheading: 'گوگل پے (Google Pay)، یو پی آئی، اور آئی سی آئی سی آئی (ICICI) بینک ٹرانسفر',
    officialVerifiedBadge: '✓ تصدیق شدہ آفیشل اکاؤنٹ',
    openGpayBtnText: 'براہِ راست UPI ایپ میں کھولیں (GPay)',
    scanQrPrompt: 'کسی بھی UPI ایپ سے کیو آر اسکین کریں',
    detailsTitle: 'آفیشل بینک و یو پی آئی اکاؤنٹ تفصیلات',
    detailsSub: 'جامعہ تعلیم القرآن آن لائن کے تمام للہ عطیات، صدقات، کفالت اور اعانت کے لیے',
    accNameLabel: 'اکاؤنٹ ٹائٹل (Name):',
    bankLabel: 'بینک کا نام (Bank):',
    accNumLabel: 'اکاؤنٹ نمبر (Account Number):',
    ifscLabel: 'آئی ایف ایس سی کوڈ (IFSC Code):',
    upiLabel: 'یو پی آئی آئی ڈی (UPI ID / GPay):',
    branchCodeLabel: 'برانچ کوڈ:',
    facilityLabel: 'سہولت: NEFT / RTGS / IMPS / UPI 24x7',
    recordAndGetReceiptBtn: 'عطیہ کی انٹری کریں اور فوری رسید حاصل کریں',
    copiedText: 'کاپی ہو گیا!',
    copyText: 'کاپی',
    whatsappInstruction: 'رقم منتقل کرنے کے بعد اسکرین شاٹ یا سلپ واٹس ایپ پر ارسال فرمائیں تاکہ رسید جاری کی جا سکے۔',
    whatsappSendBtn: 'واٹس ایپ پر سلپ بھیجیں',

    searchPlaceholderText: 'ڈونر کا نام، رسید نمبر، فون یا مد تلاش کریں...',
    allCategoriesText: 'تمام شعبہ جات (للہ عطیات)',
    recordNewDonationBtnText: 'نیا للہ عطیہ ریکارڈ کریں',
    thReceipt: 'رسید نمبر',
    thDonorName: 'عطیہ دہندہ (Donor)',
    thCategoryName: 'شعبہ / مد',
    thAmountValue: 'رقم (Amount)',
    thPaymentChannel: 'طریقہ ادائیگی',
    thDateVal: 'تاریخ',
    thStatusVal: 'حیثیت',
    thActionVal: 'باضابطہ رسید',
    emptyRecordsText: 'کوئی عطیہ ریکارڈ نہیں ملا۔',
    anonymousLabel: 'مخفی',
    monthlyRecurringBadge: 'ماہانہ وظیفہ',
    receivedStatusText: 'موصول شدہ',
    viewReceiptBtnText: 'رسید دیکھیں',

    modalTitle: 'آن لائن عطیہ و کفالت فارم',
    modalSub: 'جامعہ تعلیم القرآن آن لائن کے فنڈز میں شرکت',
    formCategoryPrompt: 'عطیہ کا شعبہ / مد (خالص للہ فنڈ):',
    formStudentPrompt: 'طالب علم کا انتخاب (اختیاری):',
    formGeneralFundOption: '-- عام کفالت فنڈ (کسی بھی مستحق بچے کے لیے) --',
    formAmountPrompt: 'رقم (Amount):',
    formCurrencyPrompt: 'کرنسی (Currency):',
    formDonorPrompt: 'عطیہ دہندہ کا نام (Donor Name):',
    formAnonCheckbox: 'نام مخفی رکھیں (Anonymous)',
    formPhonePrompt: 'واٹس ایپ / موبائل نمبر:',
    formCityPrompt: 'شہر / ملک:',
    formPayChannelPrompt: 'طریقہ ادائیگی (Payment Channel):',
    formTrxPrompt: 'ٹرانزیکشن ID / ریفرنس (اختیاری):',
    formDirectPayTitle: '✓ براہِ راست ادائیگی اکاؤنٹ:',
    formPledgeTitle: 'ماہانہ مستقل وظیفہ / کفالت (Monthly Recurring Pledge)',
    formPledgeSub: 'میں ہر ماہ یہ رقم باقاعدگی سے جامعہ کو ادا کروں گا۔',
    formNotesPrompt: 'خصوصی دعا / ایصالِ ثواب یا تفصیل:',
    formCancel: 'منسوخ کریں',
    formSaveAndGenerateReceipt: 'عطیہ محفوظ کریں و رسید بنائیں',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'جامعۃ تعلیم القرآن آن لائن',
    receiptDeptTitle: 'شعبہ مالیات و للہ عطیات و کفالتِ طلبہ',
    receiptHeadingTag: 'رسیدِ وصولی برائے للہ عطیات و اعانت',
    receiptNoLabel: 'رسید نمبر:',
    receiptDateLabel: 'تاریخ:',
    receiptDonorLabel: 'عطیہ دہندہ کا نام:',
    receiptCityLabel: 'شہر / ملک:',
    receiptPhoneLabel: 'رابطہ نمبر:',
    receiptPurposeLabel: 'شعبہ / مد (Purpose):',
    receiptMethodLabel: 'طریقہ ادائیگی:',
    receiptNotesLabel: 'تفصیل / دعا:',
    receiptPaidLabel: 'موصول شدہ رقم (Amount Paid):',
    receiptStatusText: 'حیثیت: باضابطہ تصدیق شدہ',
    receiptDuaHead: 'جَزَاكُمُ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالآخِرَةِ',
    receiptDuaSub: 'اللہ تعالیٰ آپ کے اس للہ عطیہ و اعانت کو اپنی بارگاہ میں قبول فرمائے اور دونوں جہانوں میں برکت عطا فرمائے۔',
    receiptSealText: 'مہرِ جامعہ',
    receiptAdminSignText: 'دستخط ناظمِ مدرسہ',
    receiptCloseBtn: 'بند کریں',
    receiptShareBtn: 'شیئر کریں',
    receiptPrintBtn: 'رسید پرنٹ کریں'
  },
  en: {
    sectionTitle: 'Madrasa Funds & Pure Lillah Donation Projects',
    sectionDesc: 'Choose your desired department for pure Lillah donations (Note: Only Lillah funds are accepted here)',
    lillahFundsBadge: '✨ Lillah Funds Only',
    suggestedDonation: 'Suggested Donation:',
    donateBtnText: 'Donate to this Cause',
    raisedText: 'Raised:',
    totalDonationsLabel: 'Total Lillah Donations Received',
    monthlyPledgeLabel: 'This Month Donations',
    sponsoredCountLabel: 'Sponsored Students',
    donorsCountLabel: 'Honorable Donors',

    sponsorTabHeading: 'Full Monthly & Annual Student Sponsorship',
    sponsorTabSubheading: 'Sponsoring one student is only ₹3,000 (INR)/month, covering full Quranic education, books, and living expenses.',
    hadithText: 'Hadith: "The best of you are those who learn the Quran and teach it."',
    sonOfText: 's/o',
    sponsoredBadge: 'Sponsored',
    needsSponsorBadge: 'Needs Sponsor',
    classLabel: 'Class / Level:',
    currentLessonLabel: 'Current Sabaq:',
    monthlyFeeLabel: 'Monthly Fee / Sponsorship:',
    sponsorStudentBtn: 'Sponsor This Student',
    sendExtraAidBtn: 'Send Additional Aid / Stipend',

    bankHeading: 'Official Verified Bank Accounts & UPI QR',
    bankSubheading: 'Google Pay (GPay), UPI QR, and ICICI Bank Direct Transfer',
    officialVerifiedBadge: '✓ Officially Verified Account',
    openGpayBtnText: 'Open Directly in UPI App (GPay)',
    scanQrPrompt: 'Scan to pay with any UPI app',
    detailsTitle: 'Official Bank & UPI Account Details',
    detailsSub: 'For all Lillah donations, student sponsorship, and education funds of Jamia Taleem-ul-Quran Online',
    accNameLabel: 'Account Title (Name):',
    bankLabel: 'Bank Name:',
    accNumLabel: 'Account Number:',
    ifscLabel: 'IFSC Code:',
    upiLabel: 'UPI ID / GPay:',
    branchCodeLabel: 'Branch Code:',
    facilityLabel: 'Facility: NEFT / RTGS / IMPS / UPI 24x7',
    recordAndGetReceiptBtn: 'Record Donation & Get Instant Receipt',
    copiedText: 'Copied!',
    copyText: 'Copy',
    whatsappInstruction: 'After transferring, please send screenshot on WhatsApp to receive your official receipt.',
    whatsappSendBtn: 'Send Slip on WhatsApp',

    searchPlaceholderText: 'Search donor name, receipt no, phone or category...',
    allCategoriesText: 'All Categories (Lillah Funds)',
    recordNewDonationBtnText: 'Record New Lillah Donation',
    thReceipt: 'Receipt No',
    thDonorName: 'Donor Name',
    thCategoryName: 'Category / Purpose',
    thAmountValue: 'Amount',
    thPaymentChannel: 'Payment Method',
    thDateVal: 'Date',
    thStatusVal: 'Status',
    thActionVal: 'Official Receipt',
    emptyRecordsText: 'No donation records found.',
    anonymousLabel: 'Anonymous',
    monthlyRecurringBadge: 'Monthly Pledge',
    receivedStatusText: 'Received',
    viewReceiptBtnText: 'View Receipt',

    modalTitle: 'Online Donation & Sponsorship Form',
    modalSub: 'Participate in Jamia Taleem-ul-Quran Online Funds',
    formCategoryPrompt: 'Donation Category (Pure Lillah Fund):',
    formStudentPrompt: 'Select Specific Student (Optional):',
    formGeneralFundOption: '-- General Sponsorship Fund (For any deserving student) --',
    formAmountPrompt: 'Amount:',
    formCurrencyPrompt: 'Currency:',
    formDonorPrompt: 'Donor Full Name:',
    formAnonCheckbox: 'Keep Name Anonymous (For Allah)',
    formPhonePrompt: 'WhatsApp / Mobile Number:',
    formCityPrompt: 'City / Country:',
    formPayChannelPrompt: 'Payment Method:',
    formTrxPrompt: 'Transaction ID / Reference (Optional):',
    formDirectPayTitle: '✓ Direct Payment Account:',
    formPledgeTitle: 'Monthly Recurring Pledge',
    formPledgeSub: 'I pledge to contribute this amount regularly every month to the Jamia.',
    formNotesPrompt: 'Special Prayer / Dedication / Notes:',
    formCancel: 'Cancel',
    formSaveAndGenerateReceipt: 'Save Donation & Generate Receipt',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'Jamia Taleem-ul-Quran Online',
    receiptDeptTitle: 'Department of Finance, Lillah Funds & Student Sponsorship',
    receiptHeadingTag: 'Official Receipt for Lillah Donations & Aid',
    receiptNoLabel: 'Receipt No:',
    receiptDateLabel: 'Date:',
    receiptDonorLabel: 'Donor Name:',
    receiptCityLabel: 'City / Country:',
    receiptPhoneLabel: 'Contact No:',
    receiptPurposeLabel: 'Purpose / Category:',
    receiptMethodLabel: 'Payment Method:',
    receiptNotesLabel: 'Notes / Prayer:',
    receiptPaidLabel: 'Amount Paid:',
    receiptStatusText: 'Status: Officially Verified',
    receiptDuaHead: 'JAZAKUMULLAHU KHAIRAN FI AL-DUNYA WAL-AKHIRAH',
    receiptDuaSub: 'May Allah accept your pure donation and grant abundant blessings in this world and the Hereafter.',
    receiptSealText: 'Madrasa Seal',
    receiptAdminSignText: 'Administrator Signature',
    receiptCloseBtn: 'Close',
    receiptShareBtn: 'Share',
    receiptPrintBtn: 'Print Receipt'
  },
  hi: {
    sectionTitle: 'मदरसा फंड और शुद्ध लिल्लाह दान परियोजनाएं',
    sectionDesc: 'अपने शुद्ध लिल्लाह दान के लिए इच्छित विभाग चुनें (नोट: यहां केवल लिल्लाह फंड स्वीकार किए जाते हैं)',
    lillahFundsBadge: '✨ केवल लिल्लाह दान (Lillah Only)',
    suggestedDonation: 'सुझाया गया दान:',
    donateBtnText: 'इस मद में दान करें',
    raisedText: 'एकत्रित:',
    totalDonationsLabel: 'कुल प्राप्त लिल्लाह दान',
    monthlyPledgeLabel: 'इस माह का दान',
    sponsoredCountLabel: 'प्रायोजित छात्र',
    donorsCountLabel: 'सम्मानित दानदाता',

    sponsorTabHeading: 'छात्र-छात्राओं का पूर्ण मासिक व वार्षिक प्रायोजन',
    sponsorTabSubheading: 'एक छात्र का मासिक प्रायोजन मात्र ₹3,000 (INR) है जिससे उसकी हिफ्ज़ व नाज़िरा की पढ़ाई और भोजन का खर्च पूरा होता है।',
    hadithText: 'हदीस शरीफ: "तुम में सबसे बेहतर वह है जिसने कुरआन सीखा और सिखाया।"',
    sonOfText: 'सुपुत्र',
    sponsoredBadge: 'प्रायोजित',
    needsSponsorBadge: 'प्रायोजन आवश्यक',
    classLabel: 'कक्षा / स्तर:',
    currentLessonLabel: 'वर्तमान सबक:',
    monthlyFeeLabel: 'मासिक शुल्क / प्रायोजन:',
    sponsorStudentBtn: 'इस छात्र को प्रायोजित करें',
    sendExtraAidBtn: 'अतिरिक्त सहायता / वज़ीफ़ा भेजें',

    bankHeading: 'आधिकारिक सत्यापित बैंक खाता व यूपीआई क्यूआर',
    bankSubheading: 'गूगल पे (Google Pay), यूपीआई, और आईसीआईसीआई (ICICI) बैंक ट्रांसफर',
    officialVerifiedBadge: '✓ सत्यापित आधिकारिक खाता',
    openGpayBtnText: 'सीधे यूपीआई ऐप में खोलें (GPay)',
    scanQrPrompt: 'किसी भी यूपीआई ऐप से क्यूआर स्कैन करें',
    detailsTitle: 'आधिकारिक बैंक व यूपीआई विवरण',
    detailsSub: 'जामिया तालीम-उल-कुरआन के सभी लिल्लाह दान, प्रायोजन व शैक्षिक फंड हेतु',
    accNameLabel: 'खाता धारक (Name):',
    bankLabel: 'बैंक का नाम:',
    accNumLabel: 'खाता संख्या (Account No):',
    ifscLabel: 'आईएफएससी कोड (IFSC Code):',
    upiLabel: 'यूपीआई आईडी (UPI ID / GPay):',
    branchCodeLabel: 'शाखा कोड:',
    facilityLabel: 'सुविधा: NEFT / RTGS / IMPS / UPI 24x7',
    recordAndGetReceiptBtn: 'दान दर्ज करें और तुरंत रसीद प्राप्त करें',
    copiedText: 'कॉपी हो गया!',
    copyText: 'कॉपी',
    whatsappInstruction: 'रकम ट्रांसफर करने के बाद स्क्रीनशॉट व्हाट्सएप पर भेजें ताकि रसीद जारी की जा सके।',
    whatsappSendBtn: 'व्हाट्सएप पर स्लिप भेजें',

    searchPlaceholderText: 'दाता का नाम, रसीद नंबर, फोन या श्रेणी खोजें...',
    allCategoriesText: 'सभी श्रेणियां (लिल्लाह फंड)',
    recordNewDonationBtnText: 'नया लिल्लाह दान दर्ज करें',
    thReceipt: 'रसीद नं.',
    thDonorName: 'दानकर्ता का नाम',
    thCategoryName: 'श्रेणी / उद्देश्य',
    thAmountValue: 'राशि (Amount)',
    thPaymentChannel: 'भुगतान विधि',
    thDateVal: 'दिनांक',
    thStatusVal: 'स्थिति',
    thActionVal: 'आधिकारिक रसीद',
    emptyRecordsText: 'कोई दान रिकॉर्ड नहीं मिला।',
    anonymousLabel: 'गुप्त',
    monthlyRecurringBadge: 'मासिक संकल्प',
    receivedStatusText: 'प्राप्त हुआ',
    viewReceiptBtnText: 'रसीद देखें',

    modalTitle: 'ऑनलाइन दान व प्रायोजन फॉर्म',
    modalSub: 'जामिया तालीम-उल-कुरआन ऑनलाइन के फंड में भागीदारी',
    formCategoryPrompt: 'दान की श्रेणी / मद (शुद्ध लिल्लाह फंड):',
    formStudentPrompt: 'छात्र का चयन करें (वैकल्पिक):',
    formGeneralFundOption: '-- सामान्य प्रायोजन फंड (किसी भी पात्र बच्चे हेतु) --',
    formAmountPrompt: 'राशि (Amount):',
    formCurrencyPrompt: 'मुद्रा (Currency):',
    formDonorPrompt: 'दानकर्ता का नाम:',
    formAnonCheckbox: 'नाम गुप्त रखें (Anonymous)',
    formPhonePrompt: 'व्हाट्सएप / मोबाइल नं.:',
    formCityPrompt: 'शहर / देश:',
    formPayChannelPrompt: 'भुगतान विधि (Payment Channel):',
    formTrxPrompt: 'ट्रांजेक्शन आईडी / संदर्भ (वैकल्पिक):',
    formDirectPayTitle: '✓ प्रत्यक्ष भुगतान खाता:',
    formPledgeTitle: 'मासिक नियमित संकल्प (Monthly Recurring Pledge)',
    formPledgeSub: 'मैं हर महीने यह राशि नियमित रूप से जामिया को दान करूंगा।',
    formNotesPrompt: 'विशेष दुआ / ईसाल-ए-सवाब या विवरण:',
    formCancel: 'रद्द करें',
    formSaveAndGenerateReceipt: 'दान सहेजें व रसीद बनाएं',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'जामिया तालीम-उल-कुरआन ऑनलाइन',
    receiptDeptTitle: 'वित्त विभाग, लिल्लाह फंड व छात्र प्रायोजन',
    receiptHeadingTag: 'लिल्लाह दान व सहायता हेतु आधिकारिक रसीद',
    receiptNoLabel: 'रसीद नंबर:',
    receiptDateLabel: 'दिनांक:',
    receiptDonorLabel: 'दानकर्ता का नाम:',
    receiptCityLabel: 'शहर / देश:',
    receiptPhoneLabel: 'संपर्क नंबर:',
    receiptPurposeLabel: 'उद्देश्य / श्रेणी:',
    receiptMethodLabel: 'भुगतान विधि:',
    receiptNotesLabel: 'विवरण / दुआ:',
    receiptPaidLabel: 'प्राप्त राशि:',
    receiptStatusText: 'स्थिति: आधिकारिक सत्यापित',
    receiptDuaHead: 'जज़ाकुमुल्लाहु खैरा फिद-दुनिया वल-आख़िरह',
    receiptDuaSub: 'अल्लाह तआला आपके इस लिल्लाह दान को अपनी बारगाह में स्वीकार फरमाए और दोनों जहान में बरकत दे।',
    receiptSealText: 'जामिया मुहर',
    receiptAdminSignText: 'प्रबंधक हस्ताक्षर',
    receiptCloseBtn: 'बंद करें',
    receiptShareBtn: 'शेयर करें',
    receiptPrintBtn: 'रसीद प्रिंट करें'
  },
  bn: {
    sectionTitle: 'মাদ্রাসা তহবিল ও খাঁটি লিল্লাহ অনুদান প্রকল্প',
    sectionDesc: 'আপনার খাঁটি লিল্লাহ অনুদানের জন্য উপযুক্ত বিভাগ নির্বাচন করুন (এখানে শুধু লিল্লাহ দান গ্রহণ করা হয়)',
    lillahFundsBadge: '✨ শুধুমাত্র লিল্লাহ অনুদান',
    suggestedDonation: 'প্রস্তাবিত অনুদান:',
    donateBtnText: 'এই খাতে অনুদান দিন',
    raisedText: 'সংগৃহীত:',
    totalDonationsLabel: 'মোট প্রাপ্ত লিল্লাহ অনুদান',
    monthlyPledgeLabel: 'চলতি মাসের অনুদান',
    sponsoredCountLabel: 'স্পনসরকৃত শিক্ষার্থী',
    donorsCountLabel: 'সম্মানিত দাতাগণ',

    sponsorTabHeading: 'শিক্ষার্থীদের সম্পূর্ণ মাসিক ও বাৎসরিক স্পনসরশিপ',
    sponsorTabSubheading: 'একজন শিক্ষার্থীর মাসিক খরচ মাত্র ৩,০০০ ₹ (INR), যা দিয়ে তার সম্পূর্ণ হিফজ ও পড়াশোনার ব্যয় নির্বাহ হয়।',
    hadithText: 'হাদীস: "তোমাদের মধ্যে সর্বোত্তম সে, যে কুরআন শেখে এবং অন্যকে শেখায়।"',
    sonOfText: 'পিতা',
    sponsoredBadge: 'স্পনসরকৃত',
    needsSponsorBadge: 'স্পনসর প্রয়োজন',
    classLabel: 'শ্রেণি / স্তর:',
    currentLessonLabel: 'বর্তমান পাঠ:',
    monthlyFeeLabel: 'মাসিক ফি / স্পনসর:',
    sponsorStudentBtn: 'এই শিক্ষার্থীকে স্পনসর করুন',
    sendExtraAidBtn: 'অতিরিক্ত অনুদান পাঠান',

    bankHeading: 'অফিসিয়াল ভেরিফাইড ব্যাংক অ্যাকাউন্ট ও ইউপিআই',
    bankSubheading: 'গুগল পে (Google Pay), ইউপিআই এবং আইসিআইসিআই (ICICI) ব্যাংক সরাসরি স্থানান্তর',
    officialVerifiedBadge: '✓ যাচাইকৃত অফিশিয়াল অ্যাকাউন্ট',
    openGpayBtnText: 'সরাসরি UPI অ্যাপে খুলুন (GPay)',
    scanQrPrompt: 'যেকোনো ইউপিআই অ্যাপ দিয়ে স্ক্যান করুন',
    detailsTitle: 'অফিসিয়াল ব্যাংক ও ইউপিআই বিবরণ',
    detailsSub: 'জামিয়া তালিমুল কুরআন অনলাইনের সকল লিল্লাহ অনুদান ও ছাত্র সহায়তার জন্য',
    accNameLabel: 'অ্যাকাউন্ট নাম (Name):',
    bankLabel: 'ব্যাংকের নাম:',
    accNumLabel: 'অ্যাকাউন্ট নম্বর:',
    ifscLabel: 'আইএফএসসি কোড (IFSC):',
    upiLabel: 'ইউপিআই আইডি (UPI / GPay):',
    branchCodeLabel: 'শাখা কোড:',
    facilityLabel: 'সুবিধা: NEFT / RTGS / IMPS / UPI 24x7',
    recordAndGetReceiptBtn: 'অনুদান রেকর্ড করুন এবং রসিদ পান',
    copiedText: 'কপি হয়েছে!',
    copyText: 'কপি',
    whatsappInstruction: 'টাকা পাঠানোর পর স্ক্রিনশট হোয়াটসঅ্যাপে পাঠান যাতে রসিদ প্রদান করা যায়।',
    whatsappSendBtn: 'হোয়াটসঅ্যাপে স্লিপ পাঠান',

    searchPlaceholderText: 'দাতার নাম, রসিদ নম্বর, ফোন বা খাত অনুসন্ধান করুন...',
    allCategoriesText: 'সকল খাত (লিল্লাহ তহবিল)',
    recordNewDonationBtnText: 'নতুন লিল্লাহ অনুদান এন্ট্রি করুন',
    thReceipt: 'রসিদ নং',
    thDonorName: 'দাতার নাম',
    thCategoryName: 'খাত / উদ্দেশ্য',
    thAmountValue: 'পরিমাণ',
    thPaymentChannel: 'পদ্ধতি',
    thDateVal: 'তারিখ',
    thStatusVal: 'অবস্থা',
    thActionVal: 'অফিসিয়াল রসিদ',
    emptyRecordsText: 'কোনো অনুদান রেকর্ড পাওয়া যায়নি।',
    anonymousLabel: 'গোপন',
    monthlyRecurringBadge: 'মাসিক অঙ্গীকার',
    receivedStatusText: 'গৃহীত',
    viewReceiptBtnText: 'রসিদ দেখুন',

    modalTitle: 'অনলাইন অনুদান ও স্পনসর ফর্ম',
    modalSub: 'জামিয়া তালিমুল কুরআন অনলাইনের তহবিলে অংশগ্রহণ',
    formCategoryPrompt: 'অনুদানের খাত (খাঁটি লিল্লাহ তহবিল):',
    formStudentPrompt: 'শিক্ষার্থী নির্বাচন করুন (ঐচ্ছিক):',
    formGeneralFundOption: '-- সাধারণ স্পনসরশিপ তহবিল (যেকোনো এতিম ও দরিদ্রের জন্য) --',
    formAmountPrompt: 'পরিমাণ (Amount):',
    formCurrencyPrompt: 'মুদ্রা (Currency):',
    formDonorPrompt: 'দাতার পূর্ণ নাম:',
    formAnonCheckbox: 'নাম প্রকাশ না করার অনুরোধ (Anonymous)',
    formPhonePrompt: 'হোয়াটসঅ্যাপ / মোবাইল নম্বর:',
    formCityPrompt: 'শহর / দেশ:',
    formPayChannelPrompt: 'পেমেন্ট মাধ্যম:',
    formTrxPrompt: 'লেনদেন আইডি / রেফারেন্স (ঐচ্ছিক):',
    formDirectPayTitle: '✓ সরাসরি পেমেন্ট অ্যাকাউন্ট:',
    formPledgeTitle: 'মাসিক নিয়মিত অনুদানের অঙ্গীকার',
    formPledgeSub: 'আমি প্রতি মাসে নিয়মিত এই পরিমাণ অর্থ প্রদান করব।',
    formNotesPrompt: 'বিশেষ দোয়া / বিবরণ:',
    formCancel: 'বাতিল',
    formSaveAndGenerateReceipt: 'অনুদান সংরক্ষণ ও রসিদ তৈরি করুন',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'জামিয়া তালিমুল কুরআন অনলাইন',
    receiptDeptTitle: 'অর্থ বিভাগ, লিল্লাহ তহবিল ও ছাত্র স্পনসরশিপ',
    receiptHeadingTag: 'লিল্লাহ অনুদান ও সহায়তার রসিদ',
    receiptNoLabel: 'রসিদ নম্বর:',
    receiptDateLabel: 'তারিখ:',
    receiptDonorLabel: 'দাতার নাম:',
    receiptCityLabel: 'শহর / দেশ:',
    receiptPhoneLabel: 'মোবাইল নম্বর:',
    receiptPurposeLabel: 'উদ্দেশ্য / খাত:',
    receiptMethodLabel: 'পেমেন্ট মাধ্যম:',
    receiptNotesLabel: 'বিবরণ / দোয়া:',
    receiptPaidLabel: 'প্রাপ্ত পরিমাণ:',
    receiptStatusText: 'অবস্থা: আনুষ্ঠানিকভাবে যাচাইকৃত',
    receiptDuaHead: 'জাযাকুমুল্লাহু খাইরান ফিদ দুনিয়া ওয়াল আখিরাহ',
    receiptDuaSub: 'আল্লাহ তায়ালা আপনার এই লিল্লাহ দান কবুল করুন এবং উভয় জাহানে উত্তম প্রতিদান দিন।',
    receiptSealText: 'মাদ্রাসার সিল',
    receiptAdminSignText: 'মুহতামিমের স্বাক্ষর',
    receiptCloseBtn: 'বন্ধ করুন',
    receiptShareBtn: 'শেয়ার করুন',
    receiptPrintBtn: 'রসিদ প্রিন্ট করুন'
  },
  ar: {
    sectionTitle: 'مشاريع وصناديق المدرسة وتبرعات لله الخالصة',
    sectionDesc: 'اختر القسم المطلوب لتبرعاتك الخالصة في سبيل الله (ملاحظة: تقبل هنا تبرعات لله فقط)',
    lillahFundsBadge: '✨ تبرعات لله فقط (Lillah Only)',
    suggestedDonation: 'التبرع المقترح:',
    donateBtnText: 'تبرع لهذا المشروع',
    raisedText: 'تم جمع:',
    totalDonationsLabel: 'إجمالي التبرعات المستلمة لله',
    monthlyPledgeLabel: 'تبرعات الشهر الحالي',
    sponsoredCountLabel: 'الطلاب المكفولون',
    donorsCountLabel: 'المتبرعون الكرام',

    sponsorTabHeading: 'الكفالة الكاملة الشهرية والسنوية للطلاب',
    sponsorTabSubheading: 'كفالة الطالب الواحد شهرياً 3,000 ₹ (INR) فقط وتغطي نفقات تعليمه القرآني وكتبه وإطعامه.',
    hadithText: 'حديث شريف: «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»',
    sonOfText: 'ابن',
    sponsoredBadge: 'مكفول حالياً',
    needsSponsorBadge: 'بحاجة لكفالة',
    classLabel: 'الفصل / المستوى:',
    currentLessonLabel: 'الدرس الحالي:',
    monthlyFeeLabel: 'الرسوم / الكفالة الشهرية:',
    sponsorStudentBtn: 'اكفل هذا الطالب',
    sendExtraAidBtn: 'إرسال دعم ومكافأة إضافية',

    bankHeading: 'الحساب المصرفي المعتمد ورمز الاستجابة السريعة (UPI QR)',
    bankSubheading: 'جوجل باي (Google Pay)، يو بي آي، وتحويل بنك ICICI المباشر',
    officialVerifiedBadge: '✓ حساب رسمي معتمد',
    openGpayBtnText: 'فتح مباشرة في تطبيق UPI (GPay)',
    scanQrPrompt: 'امسح الرمز للدفع عبر أي تطبيق UPI',
    detailsTitle: 'تفاصيل الحساب المصرفي وUPI الرسمي',
    detailsSub: 'لكافة تبرعات لله وكفالة الطلاب ومشاريع جامعۃ تعلیم القرآن آن لائن',
    accNameLabel: 'اسم صاحب الحساب:',
    bankLabel: 'اسم البنك:',
    accNumLabel: 'رقم الحساب:',
    ifscLabel: 'رمز IFSC:',
    upiLabel: 'معرّف UPI / GPay:',
    branchCodeLabel: 'رمز الفرع:',
    facilityLabel: 'الخدمة: تحويل فوري NEFT / RTGS / IMPS / UPI 24/7',
    recordAndGetReceiptBtn: 'تسجيل التبرع والحصول على إيصال رسمي فوري',
    copiedText: 'تم النسخ!',
    copyText: 'نسخ',
    whatsappInstruction: 'بعد التحويل، يرجى إرسال إشعار التحويل عبر واتساب لإصدار الإيصال الرسمي.',
    whatsappSendBtn: 'إرسال الإشعار عبر واتساب',

    searchPlaceholderText: 'ابحث بالاسم، رقم الإيصال، الهاتف أو الفئة...',
    allCategoriesText: 'جميع الأقسام (صناديق لله)',
    recordNewDonationBtnText: 'تسجيل تبرع لله جديد',
    thReceipt: 'رقم الإيصال',
    thDonorName: 'اسم المتبرع',
    thCategoryName: 'القسم / الغرض',
    thAmountValue: 'المبلغ',
    thPaymentChannel: 'طريقة الدفع',
    thDateVal: 'التاريخ',
    thStatusVal: 'الحالة',
    thActionVal: 'الإيصال الرسمي',
    emptyRecordsText: 'لم يتم العثور على سجلات تبرع.',
    anonymousLabel: 'فاعل خير',
    monthlyRecurringBadge: 'كفالة شهرية',
    receivedStatusText: 'مستلم',
    viewReceiptBtnText: 'عرض الإيصال',

    modalTitle: 'استمارة التبرع والكفالة أونلاين',
    modalSub: 'المساهمة في صناديق جامعۃ تعلیم القرآن آن لائن',
    formCategoryPrompt: 'فئة التبرع (صندوق لله الخالص):',
    formStudentPrompt: 'اختيار طالب معين (اختياري):',
    formGeneralFundOption: '-- صندوق الكفالة العامة (لأي طالب محتاج) --',
    formAmountPrompt: 'المبلغ (Amount):',
    formCurrencyPrompt: 'العملة (Currency):',
    formDonorPrompt: 'اسم المتبرع الكريم:',
    formAnonCheckbox: 'إخفاء الاسم (فاعل خير لوجه الله)',
    formPhonePrompt: 'رقم الهاتف / واتساب:',
    formCityPrompt: 'المدينة / الدولة:',
    formPayChannelPrompt: 'طريقة الدفع (Payment Channel):',
    formTrxPrompt: 'رقم المعاملة / المرجع (اختياري):',
    formDirectPayTitle: '✓ حساب الدفع المباشر:',
    formPledgeTitle: 'التزام شهري دوري (Monthly Recurring Pledge)',
    formPledgeSub: 'أتعهد بتقديم هذا المبلغ بانتظام شهرياً للمدرسة.',
    formNotesPrompt: 'دعاء خاص / إهداء ثواب أو ملاحظات:',
    formCancel: 'إلغاء',
    formSaveAndGenerateReceipt: 'حفظ التبرع وإصدار الإيصال',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'جامعۃ تعلیم القرآن آن لائن',
    receiptDeptTitle: 'قسم المالية وتبرعات لله وكفالة الطلاب',
    receiptHeadingTag: 'إيصال استلام تبرعات لله والإعانات',
    receiptNoLabel: 'رقم الإيصال:',
    receiptDateLabel: 'التاريخ:',
    receiptDonorLabel: 'اسم المتبرع:',
    receiptCityLabel: 'المدينة / الدولة:',
    receiptPhoneLabel: 'رقم الهاتف:',
    receiptPurposeLabel: 'الغرض / الفئة:',
    receiptMethodLabel: 'طريقة الدفع:',
    receiptNotesLabel: 'ملاحظات / دعاء:',
    receiptPaidLabel: 'المبلغ المستلم:',
    receiptStatusText: 'الحالة: معتمد رسمياً',
    receiptDuaHead: 'جَزَاكُمُ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالآخِرَةِ',
    receiptDuaSub: 'تقبل الله منكم صالح الأعمال وبارك لكم في أموالكم وأهليكم في الدنيا والآخرة.',
    receiptSealText: 'ختم المدرسة',
    receiptAdminSignText: 'توقيع مدير المدرسة',
    receiptCloseBtn: 'إغلاق',
    receiptShareBtn: 'مشاركة',
    receiptPrintBtn: 'طباعة الإيصال'
  },
  id: {
    sectionTitle: 'Proyek Dana Madrasah & Donasi Lillah',
    sectionDesc: 'Pilih kategori program untuk donasi murni karena Allah (Hanya dana Lillah yang diterima)',
    lillahFundsBadge: '✨ Khusus Dana Lillah',
    suggestedDonation: 'Donasi yang Disarankan:',
    donateBtnText: 'Salurkan Donasi ke Program Ini',
    raisedText: 'Terkumpul:',
    totalDonationsLabel: 'Total Donasi Lillah Terkumpul',
    monthlyPledgeLabel: 'Donasi Bulan Ini',
    sponsoredCountLabel: 'Santri Tersponsori',
    donorsCountLabel: 'Donatur Terhormat',

    sponsorTabHeading: 'Program Kafalah & Sponsor Santri Lengkap',
    sponsorTabSubheading: 'Sponsor satu santri hanya 3.000 ₹ (INR)/bulan mencakup seluruh kebutuhan tahfiz, kitab, dan konsumsi.',
    hadithText: 'Hadits: "Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya."',
    sonOfText: 'bin',
    sponsoredBadge: 'Sudah Disponsori',
    needsSponsorBadge: 'Butuh Sponsor',
    classLabel: 'Kelas / Tingkat:',
    currentLessonLabel: 'Setoran Saat Ini:',
    monthlyFeeLabel: 'Biaya / Kafalah Bulanan:',
    sponsorStudentBtn: 'Sponsori Santri Ini',
    sendExtraAidBtn: 'Kirim Bantuan Tambahan',

    bankHeading: 'Rekening Bank Resmi & QRIS / UPI QR',
    bankSubheading: 'Google Pay (GPay), UPI QR, dan Transfer Bank ICICI Langsung',
    officialVerifiedBadge: '✓ Rekening Resmi Terverifikasi',
    openGpayBtnText: 'Buka Langsung di Aplikasi UPI (GPay)',
    scanQrPrompt: 'Pindai untuk membayar dengan aplikasi UPI',
    detailsTitle: 'Rincian Rekening Bank & UPI Resmi',
    detailsSub: 'Untuk seluruh donasi Lillah, kafalah santri, dan operasional Jamia Taleem-ul-Quran Online',
    accNameLabel: 'Nama Pemilik Rekening:',
    bankLabel: 'Nama Bank:',
    accNumLabel: 'Nomor Rekening:',
    ifscLabel: 'Kode IFSC:',
    upiLabel: 'ID UPI / GPay:',
    branchCodeLabel: 'Kode Cabang:',
    facilityLabel: 'Layanan: NEFT / RTGS / IMPS / UPI 24x7',
    recordAndGetReceiptBtn: 'Catat Donasi & Buat Kuitansi Instan',
    copiedText: 'Tersalin!',
    copyText: 'Salin',
    whatsappInstruction: 'Setelah transfer, mohon kirim bukti transaksi ke WhatsApp untuk mendapatkan kuitansi resmi.',
    whatsappSendBtn: 'Kirim Bukti via WhatsApp',

    searchPlaceholderText: 'Cari nama donatur, nomor kuitansi, telepon...',
    allCategoriesText: 'Semua Kategori (Dana Lillah)',
    recordNewDonationBtnText: 'Catat Donasi Lillah Baru',
    thReceipt: 'No. Kuitansi',
    thDonorName: 'Nama Donatur',
    thCategoryName: 'Kategori / Tujuan',
    thAmountValue: 'Jumlah',
    thPaymentChannel: 'Metode Pembayaran',
    thDateVal: 'Tanggal',
    thStatusVal: 'Status',
    thActionVal: 'Kuitansi Resmi',
    emptyRecordsText: 'Belum ada catatan donasi.',
    anonymousLabel: 'Hamba Allah',
    monthlyRecurringBadge: 'Komitmen Bulanan',
    receivedStatusText: 'Diterima',
    viewReceiptBtnText: 'Lihat Kuitansi',

    modalTitle: 'Formulir Donasi & Sponsor Santri Online',
    modalSub: 'Berpartisipasi dalam dana Jamia Taleem-ul-Quran Online',
    formCategoryPrompt: 'Kategori Program (Dana Lillah Murni):',
    formStudentPrompt: 'Pilih Santri Khusus (Opsional):',
    formGeneralFundOption: '-- Dana Sponsor Umum (Untuk santri dhuafa mana saja) --',
    formAmountPrompt: 'Jumlah Donasi (Amount):',
    formCurrencyPrompt: 'Mata Uang (Currency):',
    formDonorPrompt: 'Nama Lengkap Donatur:',
    formAnonCheckbox: 'Sembunyikan Nama (Hamba Allah)',
    formPhonePrompt: 'Nomor WhatsApp / HP:',
    formCityPrompt: 'Kota / Negara:',
    formPayChannelPrompt: 'Metode Pembayaran:',
    formTrxPrompt: 'ID Transaksi / Referensi (Opsional):',
    formDirectPayTitle: '✓ Rekening Pembayaran Langsung:',
    formPledgeTitle: 'Komitmen Donasi Rutin Bulanan',
    formPledgeSub: 'Saya berniat menyalurkan dana ini secara rutin setiap bulan ke madrasah.',
    formNotesPrompt: 'Doa Khusus / Hajat / Catatan:',
    formCancel: 'Batal',
    formSaveAndGenerateReceipt: 'Simpan Donasi & Terbitkan Kuitansi',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'Jamia Taleem-ul-Quran Online',
    receiptDeptTitle: 'Departemen Keuangan, Dana Lillah & Kafalah Santri',
    receiptHeadingTag: 'Kuitansi Resmi Donasi & Bantuan Lillah',
    receiptNoLabel: 'No. Kuitansi:',
    receiptDateLabel: 'Tanggal:',
    receiptDonorLabel: 'Nama Donatur:',
    receiptCityLabel: 'Kota / Negara:',
    receiptPhoneLabel: 'No. Kontak:',
    receiptPurposeLabel: 'Tujuan / Kategori:',
    receiptMethodLabel: 'Metode Pembayaran:',
    receiptNotesLabel: 'Catatan / Doa:',
    receiptPaidLabel: 'Jumlah Diterima:',
    receiptStatusText: 'Status: Terverifikasi Resmi',
    receiptDuaHead: 'JAZAKUMULLAHU KHAIRAN FI AD-DUNYA WAL-AKHIRAH',
    receiptDuaSub: 'Semoga Allah menerima amal jariah ini dan memberikan berkah berlimpah di dunia dan akhirat.',
    receiptSealText: 'Stempel Madrasah',
    receiptAdminSignText: 'Tanda Tangan Mudir',
    receiptCloseBtn: 'Tutup',
    receiptShareBtn: 'Bagikan',
    receiptPrintBtn: 'Cetak Kuitansi'
  },
  tr: {
    sectionTitle: 'Medrese Fonları ve Halis Lillah Bağış Projeleri',
    sectionDesc: 'Halis Allah rızası için bağış yapacağınız alanı seçiniz (Not: Sadece Lillah bağışlar kabul edilir)',
    lillahFundsBadge: '✨ Sadece Lillah Bağışlar',
    suggestedDonation: 'Önerilen Bağış:',
    donateBtnText: 'Bu Alana Bağış Yap',
    raisedText: 'Toplanan:',
    totalDonationsLabel: 'Toplam Alınan Lillah Bağışları',
    monthlyPledgeLabel: 'Bu Ayki Bağışlar',
    sponsoredCountLabel: 'Burs Verilen Öğrenciler',
    donorsCountLabel: 'Değerli Bağışçılar',

    sponsorTabHeading: 'Öğrencilere Tam Aylık ve Yıllık Burs Programı',
    sponsorTabSubheading: 'Bir öğrencinin aylık bursu sadece 3.000 ₹ (INR) olup tüm hafızlık ve iaşe giderlerini karşılar.',
    hadithText: 'Hadis-i Şerif: "Sizin en hayırlınız Kur\'an\'ı öğrenen ve öğretendir."',
    sonOfText: 'oğlu',
    sponsoredBadge: 'Burslu',
    needsSponsorBadge: 'Burs Bekliyor',
    classLabel: 'Sınıf / Seviye:',
    currentLessonLabel: 'Mevcut Ders:',
    monthlyFeeLabel: 'Aylık Ücret / Burs:',
    sponsorStudentBtn: 'Bu Öğrenciye Burs Ver',
    sendExtraAidBtn: 'Ek Destek / Harçlık Gönder',

    bankHeading: 'Resmi Doğrulanmış Banka Hesapları ve UPI QR',
    bankSubheading: 'Google Pay (GPay), UPI QR ve ICICI Bankası Doğrudan Havale',
    officialVerifiedBadge: '✓ Doğrulanmış Resmi Hesap',
    openGpayBtnText: 'Doğrudan UPI Uygulamasında Aç (GPay)',
    scanQrPrompt: 'Ödeme için QR kodu taratın',
    detailsTitle: 'Resmi Banka ve UPI Hesap Bilgileri',
    detailsSub: 'Jamia Taleem-ul-Quran Online\'ın tüm Lillah bağışları ve talebe bursları için',
    accNameLabel: 'Hesap Sahibi (Name):',
    bankLabel: 'Banka Adı:',
    accNumLabel: 'Hesap Numarası:',
    ifscLabel: 'IFSC Kodu:',
    upiLabel: 'UPI ID / GPay:',
    branchCodeLabel: 'Şube Kodu:',
    facilityLabel: 'Hizmet: 7/24 Anında Transfer (NEFT / UPI)',
    recordAndGetReceiptBtn: 'Bağışı Kaydet ve Anında Makbuz Al',
    copiedText: 'Kopyalandı!',
    copyText: 'Kopyala',
    whatsappInstruction: 'Havale yaptıktan sonra resmi makbuzunuz için dekontu WhatsApp\'tan iletiniz.',
    whatsappSendBtn: 'Dekontu WhatsApp ile Gönder',

    searchPlaceholderText: 'Bağışçı adı, makbuz no, telefon veya kategori ara...',
    allCategoriesText: 'Tüm Kategoriler (Lillah)',
    recordNewDonationBtnText: 'Yeni Lillah Bağışı Kaydet',
    thReceipt: 'Makbuz No',
    thDonorName: 'Bağışçı Adı',
    thCategoryName: 'Kategori / Amaç',
    thAmountValue: 'Miktar',
    thPaymentChannel: 'Ödeme Yöntemi',
    thDateVal: 'Tarih',
    thStatusVal: 'Durum',
    thActionVal: 'Resmi Makbuz',
    emptyRecordsText: 'Kayıt bulunamadı.',
    anonymousLabel: 'Gizli',
    monthlyRecurringBadge: 'Aylık Taahhüt',
    receivedStatusText: 'Alındı',
    viewReceiptBtnText: 'Makbuzu Gör',

    modalTitle: 'Online Bağış ve Burs Formu',
    modalSub: 'Jamia Taleem-ul-Quran Online Fonlarına Katkı',
    formCategoryPrompt: 'Bağış Kategorisi (Halis Lillah Fonu):',
    formStudentPrompt: 'Öğrenci Seçimi (İsteğe bağlı):',
    formGeneralFundOption: '-- Genel Burs Fonu (Herhangi bir ihtiyaç sahibi öğrenci için) --',
    formAmountPrompt: 'Bağış Miktarı (Amount):',
    formCurrencyPrompt: 'Para Birimi (Currency):',
    formDonorPrompt: 'Bağışçı Adı Soyadı:',
    formAnonCheckbox: 'İsmi Gizli Tut (Allah Rızası İçin)',
    formPhonePrompt: 'WhatsApp / Telefon Numarası:',
    formCityPrompt: 'Şehir / Ülke:',
    formPayChannelPrompt: 'Ödeme Kanalı:',
    formTrxPrompt: 'İşlem No / Referans (İsteğe bağlı):',
    formDirectPayTitle: '✓ Doğrudan Ödeme Hesabı:',
    formPledgeTitle: 'Aylık Düzenli Bağış Taahhüdü',
    formPledgeSub: 'Her ay bu miktarı düzenli olarak medreseye bağışlayacağım.',
    formNotesPrompt: 'Özel Dua / Açıklama / Notlar:',
    formCancel: 'İptal',
    formSaveAndGenerateReceipt: 'Bağışı Kaydet ve Makbuz Oluştur',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'Jamia Taleem-ul-Quran Online',
    receiptDeptTitle: 'Maliye, Lillah Fonları ve Öğrenci Bursları Departmanı',
    receiptHeadingTag: 'Lillah Bağış ve Yardım Resmi Makbuzu',
    receiptNoLabel: 'Makbuz No:',
    receiptDateLabel: 'Tarih:',
    receiptDonorLabel: 'Bağışçı Adı:',
    receiptCityLabel: 'Şehir / Ülke:',
    receiptPhoneLabel: 'İletişim Tel:',
    receiptPurposeLabel: 'Amaç / Kategori:',
    receiptMethodLabel: 'Ödeme Yöntemi:',
    receiptNotesLabel: 'Notlar / Dua:',
    receiptPaidLabel: 'Ödenen Miktar:',
    receiptStatusText: 'Durum: Resmi Onaylı',
    receiptDuaHead: 'CEZÂKÜMULLÂHU HAYRAN Fİ\'D-DÜNYÂ VE\'L-ÂHİREH',
    receiptDuaSub: 'Allah hayrınızı dergah-ı izzetinde kabul eylesin, her iki cihanda bereket ihsan eylesin.',
    receiptSealText: 'Medrese Mührü',
    receiptAdminSignText: 'Müdür İmzası',
    receiptCloseBtn: 'Kapat',
    receiptShareBtn: 'Paylaş',
    receiptPrintBtn: 'Makbuzu Yazdır'
  },
  fr: {
    sectionTitle: 'Fonds de la Médersa & Projets de Dons Lillah',
    sectionDesc: 'Sélectionnez le département souhaité pour vos dons Lillah purs (Note : Seuls les dons Lillah sont acceptés)',
    lillahFundsBadge: '✨ Dons Lillah Uniquement',
    suggestedDonation: 'Don Suggéré :',
    donateBtnText: 'Faire un don à cette cause',
    raisedText: 'Collecté :',
    totalDonationsLabel: 'Total des Dons Lillah Reçus',
    monthlyPledgeLabel: 'Dons de ce Mois',
    sponsoredCountLabel: 'Étudiants Parrainés',
    donorsCountLabel: 'Honorables Donateurs',

    sponsorTabHeading: 'Parrainage Mensuel & Annuel des Étudiants',
    sponsorTabSubheading: 'Le parrainage d\'un étudiant est de seulement 3 000 ₹ (INR)/mois pour couvrir l\'ensemble des frais de scolarité et de vie.',
    hadithText: 'Hadith : "Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne."',
    sonOfText: 'fils de',
    sponsoredBadge: 'Parrainé',
    needsSponsorBadge: 'En attente de parrain',
    classLabel: 'Classe / Niveau :',
    currentLessonLabel: 'Leçon en cours :',
    monthlyFeeLabel: 'Frais / Parrainage Mensuel :',
    sponsorStudentBtn: 'Parrainer cet étudiant',
    sendExtraAidBtn: 'Envoyer une aide supplémentaire',

    bankHeading: 'Comptes Bancaires Officiels Vérifiés & QR UPI',
    bankSubheading: 'Google Pay (GPay), UPI QR et virement direct ICICI Bank',
    officialVerifiedBadge: '✓ Compte Officiel Vérifié',
    openGpayBtnText: 'Ouvrir directement dans l\'application UPI (GPay)',
    scanQrPrompt: 'Scannez pour payer avec votre application bancaire',
    detailsTitle: 'Détails Officiels du Compte Bancaire & UPI',
    detailsSub: 'Pour tous les dons Lillah et le parrainage des étudiants de Jamia Taleem-ul-Quran En Ligne',
    accNameLabel: 'Titulaire du Compte (Name) :',
    bankLabel: 'Nom de la Banque :',
    accNumLabel: 'Numéro de Compte :',
    ifscLabel: 'Code IFSC :',
    upiLabel: 'Identifiant UPI / GPay :',
    branchCodeLabel: 'Code Agence :',
    facilityLabel: 'Disponibilité : Virement instantané 24h/24 7j/7',
    recordAndGetReceiptBtn: 'Enregistrer le don & obtenir le reçu instantané',
    copiedText: 'Copié !',
    copyText: 'Copier',
    whatsappInstruction: 'Après votre transfert, veuillez envoyer le reçu sur WhatsApp pour recevoir votre attestation officielle.',
    whatsappSendBtn: 'Envoyer le reçu sur WhatsApp',

    searchPlaceholderText: 'Rechercher par nom, n° de reçu, téléphone ou catégorie...',
    allCategoriesText: 'Toutes les catégories (Fonds Lillah)',
    recordNewDonationBtnText: 'Enregistrer un nouveau don Lillah',
    thReceipt: 'N° de Reçu',
    thDonorName: 'Nom du Donateur',
    thCategoryName: 'Catégorie / Motif',
    thAmountValue: 'Montant',
    thPaymentChannel: 'Mode de Paiement',
    thDateVal: 'Date',
    thStatusVal: 'Statut',
    thActionVal: 'Reçu Officiel',
    emptyRecordsText: 'Aucun enregistrement trouvé.',
    anonymousLabel: 'Anonyme',
    monthlyRecurringBadge: 'Engagement Mensuel',
    receivedStatusText: 'Reçu',
    viewReceiptBtnText: 'Voir le Reçu',

    modalTitle: 'Formulaire de Don et Parrainage en Ligne',
    modalSub: 'Participer aux fonds de Jamia Taleem-ul-Quran En Ligne',
    formCategoryPrompt: 'Catégorie de Don (Fonds Lillah Pur) :',
    formStudentPrompt: 'Sélectionner un étudiant spécifique (Optionnel) :',
    formGeneralFundOption: '-- Fonds de parrainage général (Pour tout élève nécessiteux) --',
    formAmountPrompt: 'Montant (Amount) :',
    formCurrencyPrompt: 'Devise (Currency) :',
    formDonorPrompt: 'Nom complet du donateur :',
    formAnonCheckbox: 'Garder l\'anonymat (Pour Allah)',
    formPhonePrompt: 'Numéro WhatsApp / Mobile :',
    formCityPrompt: 'Ville / Pays :',
    formPayChannelPrompt: 'Mode de Paiement :',
    formTrxPrompt: 'ID Transaction / Référence (Optionnel) :',
    formDirectPayTitle: '✓ Compte de Paiement Direct :',
    formPledgeTitle: 'Engagement de Don Mensuel Récurrent',
    formPledgeSub: 'Je m\'engage à verser régulièrement cette somme chaque mois.',
    formNotesPrompt: 'Prière Spéciale / Dédicace / Notes :',
    formCancel: 'Annuler',
    formSaveAndGenerateReceipt: 'Enregistrer le don & générer le reçu',

    receiptBismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    receiptMadrasaName: 'Jamia Taleem-ul-Quran En Ligne',
    receiptDeptTitle: 'Département des Finances, Dons Lillah & Parrainage',
    receiptHeadingTag: 'Reçu Officiel pour Dons Lillah et Aides',
    receiptNoLabel: 'N° de Reçu :',
    receiptDateLabel: 'Date :',
    receiptDonorLabel: 'Nom du Donateur :',
    receiptCityLabel: 'Ville / Pays :',
    receiptPhoneLabel: 'N° de Contact :',
    receiptPurposeLabel: 'Motif / Catégorie :',
    receiptMethodLabel: 'Mode de Paiement :',
    receiptNotesLabel: 'Notes / Doua :',
    receiptPaidLabel: 'Montant Reçu :',
    receiptStatusText: 'Statut : Officiellement Vérifié',
    receiptDuaHead: 'JAZAKUMULLAHU KHAYRAN FI AD-DOUNYA WAL-AKHIRAH',
    receiptDuaSub: 'Qu\'Allah accepte votre don et vous accorde Ses bénédictions ici-bas et dans l\'au-delà.',
    receiptSealText: 'Sceau de la Médersa',
    receiptAdminSignText: 'Signature du Directeur',
    receiptCloseBtn: 'Fermer',
    receiptShareBtn: 'Partager',
    receiptPrintBtn: 'Imprimer le Reçu'
  }
};

export const getLocalizedMadrasaProject = (project: MadrasaDonationProject, lang: LanguageCode = 'ur') => {
  const localized = MADRASA_PROJECT_LOCALIZATIONS[project.id]?.[lang];
  if (localized) {
    return {
      title: localized.title,
      subtitle: localized.subtitle,
      description: localized.description,
      unitCostLabel: localized.unitCostLabel
    };
  }
  return {
    title: project.title,
    subtitle: project.urduTitle,
    description: project.description,
    unitCostLabel: project.unitCostLabel
  };
};

export const getLocalizedMadrasaClass = (cls: MadrasaClass, lang: LanguageCode = 'ur') => {
  const localized = MADRASA_CLASS_LOCALIZATIONS[cls.id]?.[lang];
  if (localized) {
    return {
      name: localized.name,
      description: localized.description
    };
  }
  return {
    name: cls.name,
    description: cls.description
  };
};

export const getLocalizedCategoryName = (cat: string, lang: LanguageCode = 'ur'): string => {
  const categories: Record<string, Record<LanguageCode, string>> = {
    sponsorship: {
      ur: 'کفالتِ طالب علم (للہ فنڈ)',
      en: 'Student Sponsorship (Lillah Fund)',
      hi: 'छात्र प्रायोजन (लिल्लाह फंड)',
      bn: 'ছাত্র স্পনসরশিপ (লিল্লাহ)',
      ar: 'كفالة طالب علم (صندوق لله)',
      id: 'Sponsor Santri (Dana Lillah)',
      tr: 'Öğrenci Bursu (Lillah Fonu)',
      fr: 'Parrainage d\'Étudiant (Fonds Lillah)'
    },
    teachers: {
      ur: 'اعانت و وظائفِ اساتذہ کرام (للہ فنڈ)',
      en: 'Teacher Salaries & Honorarium (Lillah Fund)',
      hi: 'शिक्षकों का मानदेय (लिल्लाह फंड)',
      bn: 'শিক্ষক সহায়তা (লিল্লাহ)',
      ar: 'رواتب المعلمين الكرام (صندوق لله)',
      id: 'Kafalah Guru (Dana Lillah)',
      tr: 'Öğretmen Maaşları (Lillah Fonu)',
      fr: 'Salaires des Enseignants (Fonds Lillah)'
    },
    ration: {
      ur: 'راشن و طعامِ طلبہ (للہ فنڈ)',
      en: 'Student Meals & Ration (Lillah Fund)',
      hi: 'छात्र भोजन व राशन (लिल्लाह फंड)',
      bn: 'খাদ্য ও রেশন (লিল্লাহ)',
      ar: 'إطعام ورعاية طعام الطلاب (صندوق لله)',
      id: 'Konsumsi & Makanan Santri (Dana Lillah)',
      tr: 'Öğrenci Yemek Fonu (Lillah)',
      fr: 'Ration des Étudiants (Fonds Lillah)'
    },
    construction: {
      ur: 'تعمیر و تجدیدِ مدرسہ و کلاس رومز (للہ فنڈ)',
      en: 'Madrasa Construction & Classrooms (Lillah Fund)',
      hi: 'मदरसा निर्माण व नवीनीकरण (लिल्लाह फंड)',
      bn: 'মাদ্রাসা নির্মাণ (লিল্লাহ)',
      ar: 'بناء وتجديد الفصول والمدرسة (صندوق لله)',
      id: 'Pembangunan & Renovasi (Dana Lillah)',
      tr: 'Medrese İnşaat Fonu (Lillah)',
      fr: 'Construction & Rénovation (Fonds Lillah)'
    },
    quran: {
      ur: 'کتب، مصاحف و قرآنی کٹ تقسیم (للہ فنڈ)',
      en: 'Quran Copies & Student Kits (Lillah Fund)',
      hi: 'कुरआन व शैक्षिक किट वितरण (लिल्लाह फंड)',
      bn: 'কুরআন ও শিক্ষা কিট বিতরণ (লিল্লাহ)',
      ar: 'توزيع المصاحف والكتب (صندوق لله)',
      id: 'Distribusi Mushaf & Kitab (Dana Lillah)',
      tr: 'Kuran Dağıtım Fonu (Lillah)',
      fr: 'Distribution de Corans & Livres (Fonds Lillah)'
    },
    lillah: {
      ur: 'عمومی للہ عطیات فنڈ',
      en: 'General Lillah Donations Fund',
      hi: 'सामान्य लिल्लाह दान फंड',
      bn: 'সাধারণ লিল্লাহ অনুদান তহবিল',
      ar: 'صندوق تبرعات لله العام',
      id: 'Dana Umum Donasi Lillah',
      tr: 'Genel Lillah Bağış Fonu',
      fr: 'Fonds Général de Dons Lillah'
    },
    general: {
      ur: 'عمومی للہ فنڈ',
      en: 'General Lillah Fund',
      hi: 'सामान्य लिल्लाह फंड',
      bn: 'সাধারণ লিল্লাহ ফান্ড',
      ar: 'صندوق لله العام',
      id: 'Dana Lillah Umum',
      tr: 'Genel Lillah Fonu',
      fr: 'Fonds Lillah Général'
    }
  };

  return categories[cat]?.[lang] || categories[cat]?.ur || cat;
};
