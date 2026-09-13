import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Heart, Compass, Shield, Award, ArrowRight, X, Sun, Moon, Volume2, Copy, Play, Pause, Globe } from 'lucide-react';
import { LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';
import { MasnoonAzkarSection } from './MasnoonAzkarSection';
import { NamazGuideSection } from './NamazGuideSection';
import { AsmaUlHusnaHeaderBanner } from './AsmaUlHusnaHeaderBanner';
import { 
  LOCALIZED_WUDU_STEPS, 
  LOCALIZED_ISLAMIC_STORIES, 
  LOCALIZED_HUB_TEXTS 
} from '../utils/hubMultiLangData';
import { SupportedLang } from '../utils/namazMultiLangData';

interface IslamicLearningHubProps {
  currentLang: LanguageCode;
  onBack: () => void;
  initialTab?: 'namaz' | 'wudu' | 'azkar' | 'names' | 'stories';
}

const NAMES_OF_ALLAH = [
  { number: 1, arabic: 'الرَّحْمٰن', transliteration: 'Ar-Rahman', meaning: 'بڑا مہربان' },
  { number: 2, arabic: 'الرَّحِيم', transliteration: 'Ar-Rahim', meaning: 'نہایت رحم کرنے والا' },
  { number: 3, arabic: 'الْمَلِك', transliteration: 'Al-Malik', meaning: 'سب کا بادشاہ' },
  { number: 4, arabic: 'الْقُدُّوس', transliteration: 'Al-Quddus', meaning: 'سب سے پاک' },
  { number: 5, arabic: 'السَّلَام', transliteration: 'As-Salam', meaning: 'سلامتی دینے والا' },
  { number: 6, arabic: 'الْمُؤْمِن', transliteration: 'Al-Mu`min', meaning: 'امن و ایمان دینے والا' },
  { number: 7, arabic: 'الْمُهَيْمِن', transliteration: 'Al-Muhaymin', meaning: 'نگہبان' },
  { number: 8, arabic: 'الْعَزِيز', transliteration: 'Al-Aziz', meaning: 'سب پر غالب' },
  { number: 9, arabic: 'الْجَبَّار', transliteration: 'Al-Jabbar', meaning: 'زبردست اور درست کرنے والا' },
  { number: 10, arabic: 'الْمُتَكَبِّر', transliteration: 'Al-Mutakabbir', meaning: 'بڑائی والا' },
  { number: 11, arabic: 'الْخَالِق', transliteration: 'Al-Khaliq', meaning: 'پیدا کرنے والا' },
  { number: 12, arabic: 'الْبَارِئ', transliteration: 'Al-Bari`', meaning: 'ٹھیک بنانے والا' },
  { number: 13, arabic: 'الْمُصَوِّر', transliteration: 'Al-Musawwir', meaning: 'صورت بنانے والا' },
  { number: 14, arabic: 'الْغَفَّار', transliteration: 'Al-Ghaffar', meaning: 'بہت بخشنے والا' },
  { number: 15, arabic: 'الْقَهَّار', transliteration: 'Al-Qahhar', meaning: 'سب پر حاوی' },
  { number: 16, arabic: 'الْوَهَّاب', transliteration: 'Al-Wahhab', meaning: 'بہت دینے والا' },
  { number: 17, arabic: 'الرَّزَّاق', transliteration: 'Ar-Razzaq', meaning: 'روزی دینے والا' },
  { number: 18, arabic: 'الْفَتَّاح', transliteration: 'Al-Fattah', meaning: 'فتح دینے والا / کھولنے والا' },
  { number: 19, arabic: 'الْعَلِيم', transliteration: 'Al-`Alim', meaning: 'سب کچھ جاننے والا' },
  { number: 20, arabic: 'الْقَابِض', transliteration: 'Al-Qabid', meaning: 'تنگ کرنے والا' },
  { number: 21, arabic: 'الْبَاسِط', transliteration: 'Al-Basit', meaning: 'کشادہ کرنے والا' },
  { number: 22, arabic: 'الْخَافِض', transliteration: 'Al-Khafid', meaning: 'پست کرنے والا' },
  { number: 23, arabic: 'الرَّافِع', transliteration: 'Ar-Rafi`', meaning: 'بلند کرنے والا' },
  { number: 24, arabic: 'الْمُعِزّ', transliteration: 'Al-Mu`izz', meaning: 'عزت دینے والا' },
  { number: 25, arabic: 'الْمُذِلّ', transliteration: 'Al-Mudhill', meaning: 'ذلیل کرنے والا' },
  { number: 26, arabic: 'السَّمِيع', transliteration: 'As-Sami`', meaning: 'سب کچھ سننے والا' },
  { number: 27, arabic: 'الْبَصِير', transliteration: 'Al-Basir', meaning: 'سب کچھ دیکھنے والا' },
  { number: 28, arabic: 'الْحَكَم', transliteration: 'Al-Hakam', meaning: 'فیصلہ کرنے والا' },
  { number: 29, arabic: 'الْعَدْل', transliteration: 'Al-`Adl', meaning: 'سراسر انصاف کرنے والا' },
  { number: 30, arabic: 'اللَّطِيف', transliteration: 'Al-Latif', meaning: 'لطف و کرم کرنے والا' },
  { number: 31, arabic: 'الْخَبِير', transliteration: 'Al-Khabir', meaning: 'خبر رکھنے والا' },
  { number: 32, arabic: 'الْحَلِيم', transliteration: 'Al-Halim', meaning: 'بردبار' },
  { number: 33, arabic: 'الْعَظِيم', transliteration: 'Al-`Azim', meaning: 'بہت عظمت والا' },
  { number: 34, arabic: 'الْغَفُور', transliteration: 'Al-Ghafur', meaning: 'بخشنے والا' },
  { number: 35, arabic: 'الشَّكُور', transliteration: 'As-Shakur', meaning: 'قدردان' },
  { number: 36, arabic: 'الْعَلِيّ', transliteration: 'Al-Aliyy', meaning: 'سب سے بلند' },
  { number: 37, arabic: 'الْكَبِير', transliteration: 'Al-Kabir', meaning: 'سب سے بڑا' },
  { number: 38, arabic: 'الْحَفِيظ', transliteration: 'Al-Hafiz', meaning: 'حفاظت کرنے والا' },
  { number: 39, arabic: 'الْمُقِيت', transliteration: 'Al-Muqit', meaning: 'روزی دینے والا' },
  { number: 40, arabic: 'الْحَسِيب', transliteration: 'Al-Hasib', meaning: 'حساب لینے والا' },
  { number: 41, arabic: 'الْجَلِيل', transliteration: 'Al-Jalil', meaning: 'جلال والا' },
  { number: 42, arabic: 'الْكَرِيم', transliteration: 'Al-Karim', meaning: 'بزرگ اور سخی' },
  { number: 43, arabic: 'الرَّقِيب', transliteration: 'Ar-Raqib', meaning: 'نگہبان' },
  { number: 44, arabic: 'الْمُجِيب', transliteration: 'Al-Mujib', meaning: 'دعا قبول کرنے والا' },
  { number: 45, arabic: 'الْوَاسِع', transliteration: 'Al-Wasi`', meaning: 'ہر چیز کو گھیرے ہوئے' },
  { number: 46, arabic: 'الْحَكِيم', transliteration: 'Al-Hakim', meaning: 'حکمت والا' },
  { number: 47, arabic: 'الْوَدُود', transliteration: 'Al-Wadud', meaning: 'محبت کرنے والا' },
  { number: 48, arabic: 'الْمَجِید', transliteration: 'Al-Majid', meaning: 'بزرگی والا' },
  { number: 49, arabic: 'الْبَاعِث', transliteration: 'Al-Ba`ith', meaning: 'مردوں کو اٹھانے والا' },
  { number: 50, arabic: 'الشَّهِيد', transliteration: 'Ash-Shahid', meaning: 'گواہ' },
  { number: 51, arabic: 'الْحَقّ', transliteration: 'Al-Haqq', meaning: 'سچا' },
  { number: 52, arabic: 'الْوَكِيل', transliteration: 'Al-Wakil', meaning: 'کارساز' },
  { number: 53, arabic: 'الْقَوِيّ', transliteration: 'Al-Qawiy', meaning: 'بہت طاقتور' },
  { number: 54, arabic: 'الْمَتِين', transliteration: 'Al-Matin', meaning: 'مضبوط' },
  { number: 55, arabic: 'الْوَلِيّ', transliteration: 'Al-Waliyy', meaning: 'مددگار و دوست' },
  { number: 56, arabic: 'الْحَمِيد', transliteration: 'Al-Hamid', meaning: 'تعریف کے لائق' },
  { number: 57, arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', meaning: 'شمار کرنے والا' },
  { number: 58, arabic: 'الْمُبْدِئ', transliteration: 'Al-Mubdi`', meaning: 'پہلی بار پیدا کرنے والا' },
  { number: 59, arabic: 'الْمُعِید', transliteration: 'Al-Mu`id', meaning: 'دوبارہ پیدا کرنے والا' },
  { number: 60, arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', meaning: 'زندگی دینے والا' },
  { number: 61, arabic: 'الْمُمِيت', transliteration: 'Al-Mumit', meaning: 'موت دینے والا' },
  { number: 62, arabic: 'الْحَيّ', transliteration: 'Al-Hayy', meaning: 'ہمیشہ زندہ رہنے والا' },
  { number: 63, arabic: 'الْقَيُّوم', transliteration: 'Al-Qayyum', meaning: 'سب کو قائم رکھنے والا' },
  { number: 64, arabic: 'الْوَاجِد', transliteration: 'Al-Wajid', meaning: 'سب کچھ پانے والا' },
  { number: 65, arabic: 'الْمَاجِد', transliteration: 'Al-Majid', meaning: 'بزرگی والا' },
  { number: 66, arabic: 'الْوَاحِد', transliteration: 'Al-Wahid', meaning: 'اکیلا' },
  { number: 67, arabic: 'الأَحَد', transliteration: 'Al-Ahad', meaning: 'ایک' },
  { number: 68, arabic: 'الصَّمَد', transliteration: 'As-Samad', meaning: 'بے نیاز' },
  { number: 69, arabic: 'الْقَادِر', transliteration: 'Al-Qadir', meaning: 'قادر و توانا' },
  { number: 70, arabic: 'الْمُقْتَدِر', transliteration: 'Al-Muqtadir', meaning: 'اقتدار والا' },
  { number: 71, arabic: 'الْمُقَدِّم', transliteration: 'Al-Muqaddim', meaning: 'آگے کرنے والا' },
  { number: 72, arabic: 'الْمُؤَخِّر', transliteration: 'Al-Mu`akhkhir', meaning: 'پیچھے کرنے والا' },
  { number: 73, arabic: 'الأَوَّل', transliteration: 'Al-Awwal', meaning: 'سب سے پہلا' },
  { number: 74, arabic: 'الآخِر', transliteration: 'Al-Akhir', meaning: 'سب سے آخری' },
  { number: 75, arabic: 'الظَّاهِر', transliteration: 'Az-Zahir', meaning: 'ظاہر' },
  { number: 76, arabic: 'الْبَاطِن', transliteration: 'Al-Batin', meaning: 'پوشیدہ' },
  { number: 77, arabic: 'الْوَالِي', transliteration: 'Al-Wali', meaning: 'مالک و حاکم' },
  { number: 78, arabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta`ali', meaning: 'بہت بلند' },
  { number: 79, arabic: 'الْبَرّ', transliteration: 'Al-Barr', meaning: 'احسان کرنے والا' },
  { number: 80, arabic: 'التَّوَّاب', transliteration: 'At-Tawwab', meaning: 'توبہ قبول کرنے والا' },
  { number: 81, arabic: 'الْمُنْتَقِم', transliteration: 'Al-Muntaqim', meaning: 'بدلہ لینے والا' },
  { number: 82, arabic: 'الْعَفُوّ', transliteration: 'Al-`Afuww', meaning: 'معاف کرنے والا' },
  { number: 83, arabic: 'الرَّؤُوف', transliteration: 'Ar-Ra`uf', meaning: 'بہت مہربان' },
  { number: 84, arabic: 'مَالِكُ الْمُلْك', transliteration: 'Malik-ul-Mulk', meaning: 'سلطنت کا مالک' },
  { number: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَام', transliteration: 'Zul-Jalali wal-Ikram', meaning: 'جلال اور بزرگی والا' },
  { number: 86, arabic: 'الْمُقْسِط', transliteration: 'Al-Muqsit', meaning: 'انصاف کرنے والا' },
  { number: 87, arabic: 'الْجَامِع', transliteration: 'Al-Jami`', meaning: 'جمع کرنے والا' },
  { number: 88, arabic: 'الْغَنِيّ', transliteration: 'Al-Ghaniyy', meaning: 'بے نیاز' },
  { number: 89, arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', meaning: 'غنی کرنے والا' },
  { number: 90, arabic: 'الْمَانِع', transliteration: 'Al-Mani`', meaning: 'روکنے والا' },
  { number: 91, arabic: 'الضَّارّ', transliteration: 'Ad-Darr', meaning: 'نقصان پہنچانے والا' },
  { number: 92, arabic: 'النَّافِع', transliteration: 'An-Nafi`', meaning: 'فائدہ دینے والا' },
  { number: 93, arabic: 'النُّور', transliteration: 'An-Nur', meaning: 'نور / روشنی' },
  { number: 94, arabic: 'الْهَادِي', transliteration: 'Al-Hadi', meaning: 'ہدایت دینے والا' },
  { number: 95, arabic: 'الْبَدِيع', transliteration: 'Al-Badi`', meaning: 'انوکھی چیز بنانے والا' },
  { number: 96, arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', meaning: 'ہمیشہ رہنے والا' },
  { number: 97, arabic: 'الْوَارِث', transliteration: 'Al-Warith', meaning: 'وارث' },
  { number: 98, arabic: 'الرَّشِيد', transliteration: 'Ar-Rashid', meaning: 'سیدھی راہ دکھانے والا' },
  { number: 99, arabic: 'الصَّبُور', transliteration: 'As-Sabur', meaning: 'بہت صبر کرنے والا' },
];

const WUDU_STEPS = [
  { step: 1, title: 'نیت اور بسم اللہ', desc: 'دل میں وضو کی نیت کریں اور "بِسْمِ اللَّهِ" پڑھ کر دونوں ہاتھ گٹوں تک تین بار دھوئیں۔' },
  { step: 2, title: 'کلی کرنا اور ناک میں پانی', desc: 'تین بار منہ میں کلی کریں اور تین بار ناک میں نرم حصے تک پانی چڑھا کر صاف کریں۔' },
  { step: 3, title: 'چہرہ دھونا', desc: 'پیشانی کے بالوں سے لے کر ٹھوڑی کے نیچے تک اور ایک کان کی لو سے دوسرے کان تک पूरा چہرہ تین بار دھوئیں' },
  { step: 4, title: 'بازو دھونا', desc: 'پہلے دایاں بازو کہنیوں سمیت تین بار دھوئیں، پھر بایاں بازو اسی طرح دھوئیں۔' },
  { step: 5, title: 'مسح اور پاؤں دھونا', desc: 'گیلے ہاتھوں سے سر اور کانوں کا مسح کریں، آخر میں دونوں ٹخنے سمیت پاؤں تین بار دھوئیں۔' },
];

const ISLAMIC_STORIES = [
  { id: 1, title: 'حضرت ابراہیم علیہ السلام اور آگ', category: 'انبیاء کے قصے', summary: 'جب نمرود نے حضرت ابراہیم کو آگ میں ڈال دیا تو اللہ کے حکم سے آگ ٹھنڈی اور سلامتی والی بن گئی۔' },
  { id: 2, title: 'حضرت یونس علیہ السلام اور مچھلی', category: 'ایمان اور صبر', summary: 'مچھلی کے پیٹ میں اندھیرے میں حضرت یونس نے توبہ کی اور اللہ نے انہیں نجات دی۔' },
  { id: 3, title: 'صبر کا پھل اور سچا مسلمان', category: 'اخلاقیات', summary: 'سچ بولنے اور والدین کی نافرمانی نہ کرنے کی خوبصورت اخلاقی کہانی بچوں کے لیے۔' },
];

export const IslamicLearningHub: React.FC<IslamicLearningHubProps> = ({ currentLang, onBack, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'namaz' | 'wudu' | 'azkar' | 'names' | 'stories'>(initialTab || 'namaz');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [hubLang, setHubLang] = useState<SupportedLang>(() => {
    if (currentLang === 'hi') return 'hi';
    if (currentLang === 'en') return 'en';
    return 'ur';
  });

  const isRtl = hubLang === 'ur';

  const languagesList: { id: SupportedLang; label: string; flag: string }[] = [
    { id: 'ur', label: 'اردو', flag: '🇵🇰' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { id: 'roman', label: 'Roman Urdu', flag: '🔤' }
  ];

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Back Button Handlers (Hierarchy: Sub-tabs > Return to Home)
  useBackHandler(() => {
    if (isPlayingAll) {
      window.speechSynthesis?.cancel();
      setIsPlayingAll(false);
    }
    setActiveTab('namaz');
  }, activeTab !== 'namaz', 30, 'islamic_active_tab');

  useBackHandler(() => {
    if (isPlayingAll) {
      window.speechSynthesis?.cancel();
      setIsPlayingAll(false);
    }
    onBack();
  }, activeTab === 'namaz', 20, 'islamic_root_back');

  const playName = (name: string, index: number) => {
    setActiveIndex(index);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(name);
      u.lang = 'ar-SA';
      u.rate = 0.6;
      u.onend = () => setActiveIndex(null);
      window.speechSynthesis.speak(u);
    }
  };

  const playAllNames = async () => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      window.speechSynthesis.cancel();
      setActiveIndex(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < NAMES_OF_ALLAH.length; i++) {
      const name = NAMES_OF_ALLAH[i];
      setActiveIndex(i);
      await new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(name.arabic);
        u.lang = 'ar-SA';
        u.rate = 0.7;
        u.onend = resolve;
        window.speechSynthesis.speak(u);
      });
      if (!isPlayingAll) break;
    }
    setIsPlayingAll(false);
    setActiveIndex(null);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Language Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {LOCALIZED_HUB_TEXTS.headerTitle[hubLang]}
              </h1>
              <p className="text-xs text-zinc-400">
                {LOCALIZED_HUB_TEXTS.headerSubtitle[hubLang]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Language Switcher Bar */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/60 border border-emerald-500/40 shadow-inner">
              {languagesList.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => setHubLang(lang.id)}
                  className={`px-2.5 py-1 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    hubLang === lang.id
                      ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white font-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title={lang.label}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden sm:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title={LOCALIZED_HUB_TEXTS.backButton[hubLang]}
            >
              <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
              <span>{LOCALIZED_HUB_TEXTS.backButton[hubLang]}</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('namaz')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'namaz'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-amber-600 text-white shadow-xl border border-amber-300 scale-105'
                : 'bg-zinc-900 text-emerald-200/90 hover:bg-zinc-800 border border-emerald-500/30'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{LOCALIZED_HUB_TEXTS.tabs.namaz[hubLang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('wudu')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'wudu' ? 'bg-teal-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{LOCALIZED_HUB_TEXTS.tabs.wudu[hubLang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('azkar')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'azkar'
                ? 'bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white shadow-xl border border-amber-300 scale-105'
                : 'bg-zinc-900 text-amber-200/90 hover:bg-zinc-800 border border-amber-500/30'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{LOCALIZED_HUB_TEXTS.tabs.azkar[hubLang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('names')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'names' ? 'bg-amber-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{LOCALIZED_HUB_TEXTS.tabs.names[hubLang]}</span>
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'stories' ? 'bg-pink-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{LOCALIZED_HUB_TEXTS.tabs.stories[hubLang]}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'namaz' && (
          <NamazGuideSection currentLang={hubLang as LanguageCode} onBackToHub={() => setActiveTab('azkar')} />
        )}

        {activeTab === 'wudu' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-teal-400 mb-2">
              {LOCALIZED_HUB_TEXTS.wuduSectionTitle[hubLang]}
            </h3>
            {LOCALIZED_WUDU_STEPS.map((w) => (
              <motion.div
                key={w.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 font-black flex items-center justify-center shrink-0 text-base">
                  {w.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white">{w.title[hubLang]}</h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">{w.desc[hubLang]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'azkar' && (
          <MasnoonAzkarSection onBackToHub={() => setActiveTab('namaz')} />
        )}

        {activeTab === 'names' && (
          <div>
            {/* Beautiful Ornamental Asma-ul-Husna Calligraphy Header Banner */}
            <AsmaUlHusnaHeaderBanner hubLang={hubLang} />

            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold text-amber-400">
                {LOCALIZED_HUB_TEXTS.namesSectionTitle[hubLang]}
              </h3>
              <button
                onClick={playAllNames}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isPlayingAll ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAll ? LOCALIZED_HUB_TEXTS.stopAll[hubLang] : LOCALIZED_HUB_TEXTS.playAll[hubLang]}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {NAMES_OF_ALLAH.map((item, idx) => (
                <motion.div
                  key={item.number}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => playName(item.arabic, idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex items-center justify-between group ${
                    activeIndex === idx 
                      ? 'bg-amber-900/40 border-amber-400 ring-2 ring-amber-500/30' 
                      : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg font-bold text-[10px] flex items-center justify-center transition-colors ${
                      activeIndex === idx ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500 group-hover:bg-amber-900 group-hover:text-amber-400'
                    }`}>
                      {item.number}
                    </span>
                    <div>
                      <div className={`text-xl font-arabic font-black transition-colors ${
                        activeIndex === idx ? 'text-white' : 'text-amber-300 group-hover:text-white'
                      }`}>
                        {item.arabic}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.transliteration}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200">{item.meaning}</div>
                    {activeIndex === idx && (
                      <div className="mt-1">
                        <Volume2 className="w-3 h-3 text-amber-400 animate-pulse inline" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-pink-400 mb-2">
              {LOCALIZED_HUB_TEXTS.storiesSectionTitle[hubLang]}
            </h3>
            {LOCALIZED_ISLAMIC_STORIES.map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-800 px-2.5 py-1 rounded-full font-bold">
                    {story.category[hubLang]}
                  </span>
                  <span className="text-xs text-zinc-400">#{story.id}</span>
                </div>
                <h4 className="text-lg font-extrabold text-white">{story.title[hubLang]}</h4>
                <p className="text-sm text-zinc-300 leading-relaxed font-medium">{story.summary[hubLang]}</p>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

