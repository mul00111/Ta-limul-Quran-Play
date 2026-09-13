import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, Volume2, Play, Pause, RefreshCw, BookOpen, Sparkles, 
  CheckCircle2, HelpCircle, Layers, Award, Radio, Info, Eye, Check, X,
  ShieldCheck, AlertTriangle, UserCheck
} from 'lucide-react';
import { 
  MutafarriqRuleItem, MutafarriqCategoryGroup,
  MUTAFARRIQ_GROUPS, ALL_MUTAFARRIQ_ITEMS,
  IZHAR_MUTLAQ_ITEMS, SAKTAH_ITEMS, SAD_SIN_ITEMS,
  TASHEEL_ITEMS, IMALAH_ITEMS, BISA_LISMU_ITEMS
} from '../data/mutafarriqQawaidData';
import { playQariText, stopAllQariAudio, QARI_VOICES, getSelectedQariVoiceId, setSelectedQariVoiceId } from '../utils/qariAudioService';

interface MutafarriqQawaidLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
  onOpenPuzzleModal?: () => void;
}

export const MutafarriqQawaidLessonModal: React.FC<MutafarriqQawaidLessonModalProps> = ({
  onBack,
  onOpenGamesHub,
  onOpenPuzzleModal
}) => {
  const [activeTab, setActiveTab] = useState<'words' | 'rules' | 'quiz'>('words');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [selectedQari, setSelectedQari] = useState<string>(() => getSelectedQariVoiceId() || 'sudais');

  const handleQariChange = (qariId: string) => {
    setSelectedQari(qariId);
    setSelectedQariVoiceId(qariId);
  };

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

  // Filtered items based on category filter
  const filteredItems = useMemo(() => {
    if (selectedGroupFilter === 'all') return ALL_MUTAFARRIQ_ITEMS;
    return ALL_MUTAFARRIQ_ITEMS.filter(item => item.category === selectedGroupFilter);
  }, [selectedGroupFilter]);

  // Play audio for a word
  const speakWord = async (item: MutafarriqRuleItem) => {
    setActiveWordId(item.id);
    const textToPlay = pronunciationMode === 'hijja' ? item.spellingHijja : item.audioText;
    const customUrl = (pronunciationMode === 'rawani' && selectedQari !== 'sudais') ? item.customAudioUrl : undefined;
    await playQariText(textToPlay, undefined, customUrl, false, selectedQari);
    setActiveWordId(null);
  };

  // Play full audio sequence
  const playFullSequence = async (itemsList: MutafarriqRuleItem[]) => {
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWordId(null);
      return;
    }

    setIsPlayingSequence(true);
    for (const item of itemsList) {
      setActiveWordId(item.id);
      const customUrl = selectedQari !== 'sudais' ? item.customAudioUrl : undefined;
      await playQariText(item.audioText, undefined, customUrl, false, selectedQari);
      await new Promise(r => setTimeout(r, 600));
    }
    setIsPlayingSequence(false);
    setActiveWordId(null);
  };

  // Quiz questions
  const quizQuestions = useMemo(() => {
    return [
      {
        question: 'کلمہ "دُنْيَا" میں نون ساکن کے بعد یا (حروف یرملون) ایک ہی کلمے میں آنے پر کیا حکم ہے؟',
        options: [
          'ادغام مع الغنہ ہوگا',
          'اظہارِ مطلق ہوگا (بغیر غنہ کے نون ظاہر کریں گے)',
          'اخفاء ہوگا'
        ],
        correctAnswer: 'اظہارِ مطلق ہوگا (بغیر غنہ کے نون ظاہر کریں گے)',
        explanation: 'ان چار کلمات (دُنْيَا، بُنْيَانٌ، صِنْوَانٌ، قِنْوَانٌ) میں نون ساکن کے بعد یا/واؤ ایک ہی کلمے میں ہے، لہذا اظہارِ مطلق ہوگا۔'
      },
      {
        question: 'سکتہ واجبہ کا کیا مطلب ہے؟',
        options: [
          'سانس توڑ کر لمبا وقف کرنا',
          'آواز روک کر بغیر سانس توڑے اگلا کلمہ پڑھنا',
          'آواز اور سانس دونوں جاری رکھنا'
        ],
        correctAnswer: 'آواز روک کر بغیر سانس توڑے اگلا کلمہ پڑھنا',
        explanation: 'سکتہ میں آواز روک دی جاتی ہے اور سانس جاری رکھتے ہوئے اگلا کلمہ پڑھا جاتا ہے۔'
      },
      {
        question: 'سورۃ المطففین میں "كَلَّا بَلْ ۜ رَانَ" پر کیا حکم نافذ ہوتا ہے؟',
        options: [
          'لام کا را میں ادغام کریں گے (بَرَّانَ)',
          'لام ساکن پر سکتہ واجبہ کریں گے (آواز روک کر بغیر سانس کے رَانَ پڑھیں گے)',
          'قصر کریں گے'
        ],
        correctAnswer: 'لام ساکن پر سکتہ واجبہ کریں گے (آواز روک کر بغیر سانس کے رَانَ پڑھیں گے)',
        explanation: 'یہاں سکتہ واجبہ ہے، اس لیے ادغام نہیں ہوگا بلکہ سکتہ کیا جائے گا۔'
      },
      {
        question: 'کلمہ "يَبْصُطُ" (البقرۃ ۲۴۵) میں صاد کے اوپر چھوٹا سین لکھا ہے، اس کو کیسے پڑھا جائے گا؟',
        options: [
          'صرف سین (س) سے پڑھنا واجب ہے (يَبْسُطُ)',
          'صرف صاد (ص) سے پڑھا جائے گا',
          'صاد اور سین دونوں جائز ہیں'
        ],
        correctAnswer: 'صرف سین (س) سے پڑھنا واجب ہے (يَبْسُطُ)',
        explanation: 'يَبْصُطُ اور بَصْطَةً دونوں میں صاد کے اوپر سین ہے اور ان دونوں میں صرف سین پڑھنا واجب ہے۔'
      },
      {
        question: 'کلمہ "أَمْ هُمُ الْمُصَيْطِرُونَ" (الطور ۳۷) کا کیا حکم ہے؟',
        options: [
          'صرف سین سے پڑھیں گے',
          'صاد (ص) اور سین (س) دونوں طرح پڑھنا جائز ہے',
          'صرف صاد سے پڑھیں گے'
        ],
        correctAnswer: 'صاد (ص) اور سین (س) دونوں طرح پڑھنا جائز ہے',
        explanation: 'اس کلمے میں صاد اور سین دونوں قرأتیں جائز ہیں۔'
      },
      {
        question: 'کلمہ "بِمُصَيْطِرٍ" (الغاشیۃ ۲۲) میں صاد کے نیچے سین لکھا ہے، اس کو کیسے پڑھیں گے؟',
        options: [
          'صرف صاد (ص) سے پڑھا جائے گا',
          'صرف سین سے پڑھا جائے گا',
          'دونوں جائز ہیں'
        ],
        correctAnswer: 'صرف صاد (ص) سے پڑھا جائے گا',
        explanation: 'جب سین صاد کے نیچے ہو تو صرف صاد (ص) پڑھا جاتا ہے۔'
      },
      {
        question: 'قرآن پاک میں کلمہ "ءَأَعْجَمِيٌّ وَعَرَبِيٌّ" (فصلت ۴۴) میں "تسهیل" کا کیا طریقہ ہے؟',
        options: [
          'دوسرے ہمزہ کو لمبا کھینچ کر پڑھیں',
          'دوسرے ہمزہ کو بغیر جھٹکے کے نرمی کے ساتھ پڑھیں',
          'ہمزہ کو گرا دیں'
        ],
        correctAnswer: 'دوسرے ہمزہ کو بغیر جھٹکے کے نرمی کے ساتھ پڑھیں',
        explanation: 'تسهیل کے معنی نرمی کے ہیں، دوسرے ہمزہ کو نرمی سے ادا کیا جاتا ہے۔'
      },
      {
        question: 'کلمہ "مَجْرٰىهَا" (ہود ۴۱) میں "امالہ" کا کیا طریقہ ہے؟',
        options: [
          'را کو "ری" پڑھیں',
          'را کو زبر کو زیر کی طرف مائل کر کے اردو کے "رے" کی طرح پڑھیں',
          'را کو پر (موٹا) پڑھیں'
        ],
        correctAnswer: 'را کو زبر کو زیر کی طرف مائل کر کے اردو کے "رے" کی طرح پڑھیں',
        explanation: 'امالہ میں زبر کو زیر کی طرف مائل کر کے "مَجْرٰىهَا" (رے) پڑھا جاتا ہے۔'
      },
      {
        question: 'کلمہ "بِئْسَ الاِسْمُ الْفُسُوقُ" (الحجرات ۱۱) کی درست تلاوت کیا ہے؟',
        options: [
          'بِئْسَ اَلاِسْمُ',
          'لام سے پہلے اور بعد کے الف چھوڑ کر لام کو زیر دے کر "بِئْسَ لِلِاسْمُ" پڑھیں',
          'بِئْسَ اُلاِسْمُ'
        ],
        correctAnswer: 'لام سے پہلے اور بعد کے الف چھوڑ کر لام کو زیر دے کر "بِئْسَ لِلِاسْمُ" پڑھیں',
        explanation: 'اس کلمے میں دونوں الف نہیں پڑھے جاتے اور لام کو زیر دے کر "بِئْسَ لِلِاسْمُ" پڑھا جاتا ہے۔'
      }
    ];
  }, []);

  const handleQuizOptionSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedQuizOption(option);
  };

  const handleQuizSubmit = () => {
    if (!selectedQuizOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedQuizOption === quizQuestions[quizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    setSelectedQuizOption(null);
    setIsAnswerSubmitted(false);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Quiz finished
    }
  };

  const handleQuizReset = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedQuizOption(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col overflow-hidden text-white font-urdu" dir="rtl">
      
      {/* HEADER BAR */}
      <header className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 border-b border-emerald-500/40 p-4 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              stopAllQariAudio();
              onBack();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md">
                سبق نمبر ۱۶
              </span>
              <h1 className="text-lg sm:text-xl font-black text-amber-300 tracking-tight">
                متفرق قواعد (Mutafarriq Qawaid)
              </h1>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 hidden sm:block">
              اظہارِ مطلق ، سکتہ ، ص/س کے قواعد ، تسہیل ، امالہ ، اور بئس الاسم کی مکمل تجوید
            </p>
          </div>
        </div>

        {/* Audio sequence toggle & Qari Voice selector */}
        <div className="flex items-center gap-2">
          {/* Qari Voice Selector Dropdown */}
          <div className="flex items-center gap-1 bg-emerald-950/90 px-2.5 py-1.5 rounded-2xl border border-emerald-500/40 shadow-inner">
            <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={selectedQari}
              onChange={(e) => handleQariChange(e.target.value)}
              className="bg-transparent text-amber-300 text-xs font-black focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
            >
              {QARI_VOICES.map((v) => (
                <option key={v.id} value={v.id} className="bg-zinc-900 text-amber-200">
                  {v.qariNameUrdu}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => playFullSequence(filteredItems)}
            className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg border ${
              isPlayingSequence
                ? 'bg-amber-500 text-zinc-950 border-amber-300 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isPlayingSequence ? 'تلاوت جاری ہے...' : 'سبق کی مکمل تلاوت سنیں'}
            </span>
          </button>

          {onOpenGamesHub && (
            <button
              onClick={onOpenGamesHub}
              className="p-2 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">گیمز لیب</span>
            </button>
          )}
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'words'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 border-emerald-300 shadow-md'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>۱. کلمات و امثلہ</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 border-amber-300 shadow-md'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>۲. قواعد کی تفصیل</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-zinc-950 border-cyan-300 shadow-md'
                : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 border-zinc-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>۳. تجوید کوئز</span>
          </button>
        </div>

        {/* Pronunciation mode toggle (Rawani vs Hijja) */}
        {activeTab === 'words' && (
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                pronunciationMode === 'rawani'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-500 text-zinc-950 shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ہجے
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        {/* TAB 1: WORDS GRID & CATEGORIES */}
        {activeTab === 'words' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* CATEGORY FILTER BUTTONS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedGroupFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedGroupFilter === 'all'
                    ? 'bg-amber-500 text-zinc-950 border-amber-300 font-black shadow-md'
                    : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                تمام متفرق قواعد (۱۵)
              </button>

              {MUTAFARRIQ_GROUPS.map((grp) => (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroupFilter(grp.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedGroupFilter === grp.id
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-300 font-black shadow-md'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {grp.titleUrdu}
                </button>
              ))}
            </div>

            {/* RENDER GROUP BY GROUP OR ALL */}
            {MUTAFARRIQ_GROUPS.filter(g => selectedGroupFilter === 'all' || selectedGroupFilter === g.id).map((grp) => (
              <section key={grp.id} className="space-y-3 bg-zinc-900/60 p-4 sm:p-5 rounded-3xl border border-zinc-800">
                
                {/* Group Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border ${grp.badgeBg} ${grp.badgeText}`}>
                      {grp.titleArabic}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-amber-300">
                      {grp.titleUrdu}
                    </h3>
                  </div>

                  <button
                    onClick={() => playFullSequence(grp.items)}
                    className="self-start sm:self-auto px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>اس قاعدے کی تلاوت سنیں</span>
                  </button>
                </div>

                {/* Group Definition Banner */}
                <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{grp.definitionUrdu}</span>
                </div>

                {/* Words Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 pt-2">
                  {grp.items.map((item) => {
                    const isActive = activeWordId === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => speakWord(item)}
                        className={`p-5 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 transition-all cursor-pointer relative group flex flex-col justify-between space-y-4 hover:scale-[1.01] shadow-xl ${
                          isActive 
                            ? 'border-amber-400 shadow-amber-950/50 bg-zinc-900' 
                            : 'border-zinc-800 hover:border-emerald-500/50'
                        }`}
                      >
                        {/* Card Top Row: Rule Badge & Surah Reference */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {item.categoryTitleUrdu}
                          </span>

                          <span className="text-[10px] font-bold text-amber-300/80 bg-zinc-800 px-2.5 py-0.5 rounded-full border border-zinc-700">
                            📖 {item.surahRefUrdu}
                          </span>
                        </div>

                        {/* Arabic Word Display */}
                        <div className="text-center py-2">
                          <div className={`text-3xl sm:text-4xl md:text-5xl font-black font-quran text-amber-300 tracking-wide transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.arabic}
                          </div>
                          
                          {/* Rule Detail Highlight Badge if any */}
                          {item.ruleDetailUrdu && (
                            <div className="mt-2 inline-block px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                              {item.ruleDetailUrdu}
                            </div>
                          )}
                        </div>

                        {/* Card Bottom Row: Hijja / Pronunciation & Speaker Icon */}
                        <div className="bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                            <span>طریقہ ادا:</span>
                            <span className="text-zinc-300 font-normal text-[11px]">
                              {pronunciationMode === 'hijja' ? 'ہجے' : 'روانی / تجوید'}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-200 font-medium leading-relaxed">
                            {pronunciationMode === 'hijja' ? item.spellingHijja : item.pronunciationUrdu}
                          </p>

                          <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-800/60 mt-1">
                            <span className="text-zinc-400">تجوید کی ہدایت: {item.explanationUrdu}</span>
                            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-amber-500 text-zinc-950 animate-bounce' : 'bg-zinc-800 text-amber-300 group-hover:bg-emerald-600 group-hover:text-white'}`}>
                              <Volume2 className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </section>
            ))}

          </div>
        )}

        {/* TAB 2: DETAILED TAJWEED RULES EXPLANATIONS */}
        {activeTab === 'rules' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-zinc-900 border border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-2xl">
                  📜
                </div>
                <div>
                  <h2 className="text-xl font-black text-amber-300">سبق ۱۶: متفرق قواعد کے مکمل اصول</h2>
                  <p className="text-xs text-zinc-400">قرآن مجید کی ان خاص تلاوتوں اور کلمات کے تجویدی اصول سمجھیں</p>
                </div>
              </div>

              <div className="space-y-6 pt-2">
                
                {/* 1. Izhar Mutlaq */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-emerald-500/30 space-y-2">
                  <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs">۱</span>
                    <span>اظہارِ مطلق (Izhar Mutlaq):</span>
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    نون ساکن کا قاعدہ ہے کہ نون ساکن کے بعد حروفِ یرملون (ی، ر، م، ل، و، ن) آئیں تو ادغام ہوتا ہے، لیکن اگر نون ساکن اور حروفِ یرملون ایک ہی کلمے میں جمع ہو جائیں تو ادغام نہیں بلکہ <strong>اظہارِ مطلق</strong> ہوتا ہے یعنی نون ساکن کو بغیر غنہ کے بالکل صاف بولا جاتا ہے۔
                  </p>
                  <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 text-xs font-bold text-amber-300 flex flex-wrap gap-2">
                    <span>قرآن مجید میں صرف ۴ کلمات ہیں:</span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded text-white font-quran text-base">دُنْيَا</span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded text-white font-quran text-base">بُنْيَانٌ</span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded text-white font-quran text-base">صِنْوَانٌ</span>
                    <span className="bg-emerald-950 px-2 py-0.5 rounded text-white font-quran text-base">قِنْوَانٌ</span>
                  </div>
                </div>

                {/* 2. Saktah */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-amber-500/30 space-y-2">
                  <h3 className="text-base font-black text-amber-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs">۲</span>
                    <span>سَكْتَهْ (Saktah - Mandatory Pauses):</span>
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    آواز کو تھوڑی دیر کے لیے روک کر سانس توڑے بغیر آگے تلاوت جاری رکھنے کو سکتہ کہتے ہیں۔ روایتِ حفص میں ۴ کلمات پر سکتہ واجب ہے:
                  </p>
                  <ul className="list-disc list-inside text-xs text-zinc-300 space-y-1.5 pr-2">
                    <li><strong>عِوَجًا ۜ قَيِّمًا</strong> (سورۃ الکہف ۱) - "عِوَجَا" پر سکتہ کر کے بغیر سانس توڑے قَيِّمًا پڑھیں</li>
                    <li><strong>مِنْ مَّرْقَدِنَا ۜ هٰذَا</strong> (سورۃ یٰس ۵۲) - "مَّرْقَدِنَا" پر بغیر سانس لیے آواز روکیں</li>
                    <li><strong>كَلَّا بَلْ ۜ رَانَ</strong> (سورۃ المطففین ۱۴) - "بَلْ" کی لام پر ادغام کیے بغیر سکتہ کریں</li>
                    <li><strong>وَقِيْلَ مَنْ ۜ رَاقٍ</strong> (سورۃ القیامہ ۲۷) - "مَنْ" کی نون پر ادغام کیے بغیر سکتہ کریں</li>
                  </ul>
                </div>

                {/* 3. Sad & Sin */}
                <div className="bg-zinc-950 p-5 rounded-2xl border border-cyan-500/30 space-y-2">
                  <h3 className="text-base font-black text-cyan-400 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">۳</span>
                    <span>صاد پر سین کے قواعد (ص / س):</span>
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    قرآن پاک میں ۴ کلمات میں صاد کے اوپر یا نیچے چھوٹا سین لکھا ہوتا ہے:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-amber-300 font-bold">۱. يَبْصُطُ:</span> صرف سین (س) پڑھیں
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-amber-300 font-bold">۲. بَصْطَةً:</span> صرف سین (س) پڑھیں
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-amber-300 font-bold">۳. الْمُصَيْطِرُونَ:</span> صاد (ص) و سین (س) دونوں جائز
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-amber-300 font-bold">۴. بِمُصَيْطِرٍ:</span> صرف صاد (ص) پڑھیں
                    </div>
                  </div>
                </div>

                {/* 4. Tasheel, Imalah & Bisa Lismu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-teal-500/30 space-y-1">
                    <h4 className="font-black text-teal-300 text-sm">۴. تَسْهِيْلٌ (Tasheel)</h4>
                    <p className="text-zinc-300 leading-relaxed">
                      "ءَأَعْجَمِيٌّ" میں دوسرے ہمزہ کو بغیر جھٹکے کے نرمی سے ادا کریں۔
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-rose-500/30 space-y-1">
                    <h4 className="font-black text-rose-300 text-sm">۵. إِمَالَهْ (Imalah)</h4>
                    <p className="text-zinc-300 leading-relaxed">
                      "مَجْرٰىهَا" میں را کے زبر کو زیر کی طرف مائل کر کے "رے" پڑھیں۔
                    </p>
                  </div>

                  <div className="bg-zinc-950 p-4 rounded-2xl border border-purple-500/30 space-y-1">
                    <h4 className="font-black text-purple-300 text-sm">۶. بِئْسَ الاِسْمُ</h4>
                    <p className="text-zinc-300 leading-relaxed">
                      لام سے پہلے و بعد کے الف کو گرا کر "بِئْسَ لِلِاسْمُ" پڑھیں۔
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE QUIZ ENGINE */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-zinc-900 border border-cyan-500/40 p-6 rounded-3xl shadow-2xl space-y-6 relative">
              
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 font-black">
                    ❓
                  </div>
                  <div>
                    <h3 className="text-base font-black text-amber-300">متفرق قواعد تجوید کوئز</h3>
                    <p className="text-xs text-zinc-400">سوال {quizIndex + 1} از {quizQuestions.length}</p>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold text-amber-300">
                  اسکور: {quizScore} / {quizQuestions.length}
                </div>
              </div>

              {/* Question Content */}
              {quizIndex < quizQuestions.length ? (
                <div className="space-y-5">
                  <h4 className="text-sm sm:text-base font-bold text-zinc-100 leading-relaxed">
                    {quizQuestions[quizIndex].question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {quizQuestions[quizIndex].options.map((opt, idx) => {
                      const isSelected = selectedQuizOption === opt;
                      const isCorrect = opt === quizQuestions[quizIndex].correctAnswer;

                      let btnStyle = 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800';
                      if (isAnswerSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-950 text-emerald-200 border-emerald-500 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950 text-rose-200 border-rose-500 font-bold';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleQuizOptionSelect(opt)}
                          className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-right transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation box after submit */}
                  {isAnswerSubmitted && (
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1">
                      <span className="font-bold text-amber-300 block">تجویدی وجہ:</span>
                      <p>{quizQuestions[quizIndex].explanation}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    {!isAnswerSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        disabled={!selectedQuizOption}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black text-xs disabled:opacity-50 cursor-pointer shadow-md"
                      >
                        جواب سبمٹ کریں
                      </button>
                    ) : (
                      <button
                        onClick={handleQuizNext}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs cursor-pointer shadow-md"
                      >
                        {quizIndex < quizQuestions.length - 1 ? 'اگلا سوال ▶' : 'کوئز مکمل کریں'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Complete Result */
                <div className="text-center py-8 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-xl font-black text-amber-300">کوئز مکمل ہو گیا!</h3>
                  <p className="text-sm text-zinc-300">
                    آپ کا اسکور: <strong className="text-emerald-400 text-lg">{quizScore}</strong> از {quizQuestions.length}
                  </p>
                  <button
                    onClick={handleQuizReset}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                  >
                    دوبارہ کوئز دیں
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

    </div>
  );
};
