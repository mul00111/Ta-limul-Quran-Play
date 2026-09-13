import React, { useState, useMemo } from 'react';
import { 
  Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, 
  HelpCircle, RefreshCw, BookOpen, Layers, Search, Filter, AlertCircle, Award,
  Info, ChevronDown, ChevronUp, Check, Lightbulb
} from 'lucide-react';
import { playQariText, playWordWithHijjaAndPronunciation, stopAllQariAudio, playQuizFeedbackAudio } from '../utils/qariAudioService';
import { 
  ALL_SUKOON_QALQALAH_DATA, 
  PAGE_12_HAMZA_SUKOON, 
  PAGE_12_TRI_HARAKAT, 
  PAGE_12_WORDS, 
  PAGE_13_QALQALAH_BASIC, 
  PAGE_13_QALQALAH_2LETTER, 
  PAGE_13_QURANIC_3LETTER, 
  PAGE_13_QURANIC_COMPOUNDS,
  ALL_PAGE_12_ITEMS,
  ALL_PAGE_13_ITEMS,
  HAMZAH_SAKINAH_PAGE_ITEMS,
  SUKOON_PAGE_OFFICIAL_RULES,
  SukoonWordItem 
} from '../data/sukoonQalqalahData';
import { 
  ALL_SUKOON_MASHQ_WORDS, 
  SukoonMashqItem 
} from '../data/sukoonMashqData';
import { SukoonMashqSection } from './SukoonMashqSection';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { SukoonGameModal } from './SukoonGameModal';
import { LanguageCode } from '../types';

interface SukoonLessonModalProps {
  onBack: () => void;
  currentLang?: LanguageCode;
}

export const SukoonLessonModal: React.FC<SukoonLessonModalProps> = ({ onBack, currentLang = 'ur' }) => {
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const [activeTab, setActiveTab] = useState<'mashq' | 'hamzah' | 'rules' | 'page12' | 'page13' | 'quiz' | 'all'>('mashq');
  const [filterType, setFilterType] = useState<'all' | 'qalqalah' | 'heavy' | '2-letter' | '3-letter'>('all');
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRulesExpanded, setIsRulesExpanded] = useState(true);
  const [showMagneticGame, setShowMagneticGame] = useState(false);
  const [showSukoonGame, setShowSukoonGame] = useState(false);
  
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeWord, setActiveWord] = useState<SukoonWordItem | SukoonMashqItem | null>(null);
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);

  // Mini Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);

  // Active word list based on tab
  const currentTabWords = useMemo(() => {
    if (activeTab === 'hamzah') return HAMZAH_SAKINAH_PAGE_ITEMS;
    if (activeTab === 'page12') return ALL_PAGE_12_ITEMS;
    if (activeTab === 'page13') return ALL_PAGE_13_ITEMS;
    return ALL_SUKOON_QALQALAH_DATA;
  }, [activeTab]);

  // Filtered list
  const filteredWords = useMemo(() => {
    return currentTabWords.filter(item => {
      // Category / feature filter
      if (filterType === 'qalqalah' && !item.isQalqalah) return false;
      if (filterType === 'heavy' && !item.isHeavyLetterIncluded) return false;
      if (filterType === '2-letter' && item.letterCount !== 2) return false;
      if (filterType === '3-letter' && item.letterCount < 3) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          item.word.includes(q) ||
          item.breakdown.includes(q) ||
          item.spellingHijja.includes(q) ||
          item.categoryLabelUrdu.includes(q)
        );
      }
      return true;
    });
  }, [currentTabWords, filterType, searchQuery]);

  // Quiz Questions Pool (comprehensive questions covering Qalqalah, Hamzah Sakinah, Sukoon & Heavy letters)
  const quizPool = useMemo(() => {
    const combinedAll: (SukoonWordItem | SukoonMashqItem)[] = [
      ...ALL_SUKOON_MASHQ_WORDS,
      ...ALL_SUKOON_QALQALAH_DATA
    ];
    const shuffled = [...combinedAll].sort(() => 0.5 - Math.random()).slice(0, 16);
    
    return shuffled.map((item, idx) => {
      // Alternate question types
      if (item.isHamzahSakinah) {
        return {
          item,
          question: `اس کلمے "${item.word}" میں ہمزہ ساکنہ ہے، اس کو کیسے پڑھا جائے گا؟`,
          correct: 'جھٹکے کے ساتھ ادا کریں گے',
          options: ['جھٹکے کے ساتھ ادا کریں گے', 'قلقلہ کے ساتھ گونجائیں گے', 'نرمی سے لمبا کریں گے', 'غنّہ کریں گے'],
          explanation: `شاباش! قاعدے کے مطابق "ہمزہ ساکنہ (أْ، ءْ) کو ہمیشہ جھٹکا دے کر پڑھتے ہیں"۔`
        };
      } else if (item.isQalqalah) {
        return {
          item,
          question: `کیا کلمہ "${item.word}" میں حرفِ قلقلہ (ق، ط، ب، ج، د) موجود ہے؟`,
          correct: 'ہاں (قلقلہ ہوگا)',
          options: ['ہاں (قلقلہ ہوگا)', 'نہیں (قلقلہ نہیں ہوگا)'],
          explanation: `شاباش! اس میں ساکن حرف "${item.qalqalahLetter || ''}" ہے جو حروفِ قلقلہ (قُطْبُ جَدٍّ) میں سے ہے، اس لیے مخرج ٹکرا کر آواز گونجے گی۔`
        };
      } else if (item.isHeavyLetterIncluded) {
        return {
          item,
          question: `کلمہ "${item.word}" میں موجود حرفِ مستعلیہ کو کیسی آواز سے پڑھیں گے؟`,
          correct: 'پُر (موٹی اور بھاری آواز)',
          options: ['پُر (موٹی اور بھاری آواز)', 'باریک اور ہلکی آواز', 'جھٹکے کے ساتھ', 'لمبا کر کے'],
          explanation: `درست! حروفِ مستعلیہ (خ ص ض ط ظ غ ق) ہر حالت میں پُر (موٹے) پڑھے جاتے ہیں۔`
        };
      } else {
        return {
          item,
          question: `کیا اس کلمے "${item.word}" میں قلقلہ ہوگا؟`,
          correct: 'نہیں (قلقلہ نہیں ہوگا)',
          options: ['نہیں (قلقلہ نہیں ہوگا)', 'ہاں (قلقلہ ہوگا)'],
          explanation: `درست! اس میں ساکن حرف حروفِ قلقلہ (ق، ط، ب، ج، د) میں سے نہیں ہے، اس لیے آواز میں گونج نہیں ہوگی۔`
        };
      }
    });
  }, []);

  const speakWord = (item: SukoonWordItem | SukoonMashqItem) => {
    if (isMuted) return;
    setActiveWord(item);
    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(item.spellingHijja, item.pronunciationWord);
    } else {
      playQariText(item.pronunciationWord);
    }
  };

  const playCustomText = async (text: string) => {
    if (isMuted) return;
    setActiveAudioText(text);
    await playQariText(text);
    setActiveAudioText(null);
  };

  const playFullPageSequence = async () => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWord(null);
      return;
    }

    setIsPlayingSequence(true);
    const list = filteredWords.length > 0 ? filteredWords : currentTabWords;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      setActiveWord(item);
      if (pronunciationMode === 'hijja') {
        await playWordWithHijjaAndPronunciation(item.spellingHijja, item.pronunciationWord);
      } else {
        await playQariText(item.pronunciationWord);
      }
      await new Promise(r => setTimeout(r, 450));
    }
    setIsPlayingSequence(false);
    setActiveWord(null);
  };

  const playMashqSequence = async (items: SukoonMashqItem[]) => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWord(null);
      return;
    }

    setIsPlayingSequence(true);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setActiveWord(item);
      if (pronunciationMode === 'hijja') {
        await playWordWithHijjaAndPronunciation(item.spellingHijja, item.pronunciationWord);
      } else {
        await playQariText(item.pronunciationWord);
      }
      await new Promise(r => setTimeout(r, 450));
    }
    setIsPlayingSequence(false);
    setActiveWord(null);
  };

  const handleQuizAnswer = (answer: string) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(answer);

    const currentQ = quizPool[quizIndex];
    const isCorrect = answer === currentQ.correct;

    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      playQuizFeedbackAudio(true);
      setQuizFeedback({ isCorrect: true, text: currentQ.explanation });
    } else {
      playQuizFeedbackAudio(false);
      setQuizFeedback({ isCorrect: false, text: `غلط جواب! ${currentQ.explanation}` });
    }
  };

  const nextQuizQuestion = () => {
    setSelectedQuizAnswer(null);
    setQuizFeedback(null);
    if (quizIndex < quizPool.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizIndex(0);
    }
  };

  if (showSukoonGame) {
    return (
      <SukoonGameModal
        onBack={() => setShowSukoonGame(false)}
        currentLang={currentLang}
      />
    );
  }

  if (showMagneticGame) {
    return (
      <MurakkabatPuzzleGameModal
        initialGameMode="sukoon"
        currentLang={currentLang}
        onBack={() => setShowMagneticGame(false)}
      />
    );
  }

  return (
    <div className={`bg-[#fcfaf5] border-4 border-amber-600/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 ${isRtl ? 'text-right font-urdu' : 'text-left font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl border-2 border-amber-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>واپسی</span>
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-zinc-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                سبق نمبر ۴
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300">
                سکون (جزم) اور حروفِ قلقلہ
              </h2>
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              ساکن حروف، قلقلہ اور ہمزہ ساکنہ کی مکمل مشق
            </p>
          </div>
        </div>

        {/* Audio & Game Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSukoonGame(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-yellow-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>صوتی و بصری گیم (سکون و قلقلہ) 🎯</span>
          </button>

          <button
            onClick={() => setShowMagneticGame(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg border border-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مقناطیسی پزل 🧩</span>
          </button>
          {/* Hijja vs Rawani Switch */}
          <div className="bg-black/40 p-1 rounded-xl border border-amber-500/30 flex items-center gap-1 text-xs">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              روانی (Word)
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              ہجے (Spelling)
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted ? 'bg-rose-900/80 text-rose-300 border-rose-600' : 'bg-white/10 text-amber-300 border-white/20 hover:bg-white/20'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/10 p-2 rounded-2xl border border-emerald-600/30">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Tab 0: Mashq-e-Kitab (60 Words from images) */}
          <button
            onClick={() => setActiveTab('mashq')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'mashq'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>مشقِ کتاب (۶۰ کلمات)</span>
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              نورانی مشق ✨
            </span>
          </button>

          {/* Tab 0.5: Hamzah Sakinah (Photo Page Page 12) */}
          <button
            onClick={() => setActiveTab('hamzah')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'hamzah'
                ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md border border-emerald-400 ring-2 ring-emerald-400/40'
                : 'bg-white text-emerald-950 hover:bg-emerald-50 border border-emerald-400/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>سکون و ہمزہ ساکنہ (جھٹکا)</span>
            <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
              عکسِ کتاب ⚡
            </span>
          </button>

          {/* Tab 1: Official Tajweed Rules Box */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>قواعد و ہدایات (کتابی اصول)</span>
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              ۷ اصول
            </span>
          </button>

          {/* Tab 2: Page 12 - Sukoon (Jazm) */}
          <button
            onClick={() => setActiveTab('page12')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'page12'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>مشق ۱: سکون (جزم) [ ْ ]</span>
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              67 کلمات
            </span>
          </button>

          {/* Tab 3: Page 13 - Qalqalah & Quranic Words */}
          <button
            onClick={() => setActiveTab('page13')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'page13'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مشق ۲: حروفِ قلقلہ (قُطْبُ جَدٍّ)</span>
            <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              63 کلمات
            </span>
          </button>

          {/* Tab 4: Qalqalah Quiz */}
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'quiz'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>امتحان و قلقلہ کوئز</span>
            <span className="bg-purple-400 text-purple-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              ٹیسٹ 🎯
            </span>
          </button>

          {/* Tab 5: All Words */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'all'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>تمام کلمات (130)</span>
          </button>
        </div>

        {/* Global Page Sequence Player Button */}
        {activeTab !== 'quiz' && activeTab !== 'rules' && activeTab !== 'mashq' && (
          <button
            onClick={playFullPageSequence}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md flex items-center gap-2 cursor-pointer transition-all ${
              isPlayingSequence
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSequence ? 'تلاوت روکیں...' : 'پورے صفحے کی تلاوت سنیں'}</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB: MASHQ SECTION (AUTHENTIC 60 WORDS FROM BOOK IMAGES)
         ========================================================================= */}
      {activeTab === 'mashq' && (
        <SukoonMashqSection
          pronunciationMode={pronunciationMode}
          isMuted={isMuted}
          activeWordId={activeWord?.id || null}
          isPlayingSequence={isPlayingSequence}
          onWordClick={speakWord}
          onPlaySequence={playMashqSequence}
          onGoToRules={() => setActiveTab('rules')}
          onGoToQuiz={() => setActiveTab('quiz')}
        />
      )}

      {/* =========================================================================
          AUTHENTIC QAIDA RULES BANNER (EXACT TO BOOK IMAGE)
         ========================================================================= */}
      {(activeTab === 'page12' || activeTab === 'page13' || activeTab === 'all') && (
        <div className="bg-[#fff9ee] border-2 border-amber-500/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-amber-300/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
              <h3 className="font-black text-sm sm:text-base text-amber-950 flex items-center gap-1.5">
                <span>تجویدی قواعد و ہدایات (سبق نمبر ۴: سکون، قلقلہ اور ہمزہ ساکنہ)</span>
              </h3>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('rules')}
                className="text-[11px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-black px-2.5 py-1 rounded-lg border border-amber-400 flex items-center gap-1 transition-all"
              >
                <span>تفصیلی جائزہ</span>
                <span>←</span>
              </button>
              <button
                onClick={() => setIsRulesExpanded(!isRulesExpanded)}
                className="text-zinc-600 hover:text-zinc-900 p-1 rounded-lg"
              >
                {isRulesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRulesExpanded && (
            <div className="space-y-2.5 text-xs sm:text-sm text-zinc-900 leading-loose divide-y divide-amber-200/60">
              
              {/* Point 1 */}
              <div className="flex items-start gap-2.5 pt-1.5">
                <span className="text-rose-600 font-bold text-base select-none">✦</span>
                <p>
                  جیسا کہ آپ پیچھے پڑھ چکے ہیں اس علامت <span className="bg-sky-100 text-sky-900 font-black px-1.5 py-0.5 rounded border border-sky-300 font-arabic text-base">[ ْ ]</span> کو <span className="text-sky-800 font-black underline decoration-sky-500">جزم</span> کہتے ہیں۔ جس حرف پر جزم ہو اُسے <span className="text-sky-800 font-black">ساکن</span> کہتے ہیں۔
                </p>
              </div>

              {/* Point 2 */}
              <div className="flex items-start gap-2.5 pt-1.5">
                <span className="text-rose-600 font-bold text-base select-none">✦</span>
                <p>
                  جزم والا حرف اپنے سے پہلے متحرک حرف سے مل کر پڑھا جاتا ہے۔
                </p>
              </div>

              {/* Point 3 - Hamzah Sakinah */}
              <div className="flex items-start gap-2.5 pt-1.5 bg-emerald-50/70 p-2 rounded-xl border border-emerald-300/60">
                <span className="text-emerald-700 font-bold text-base select-none">✦</span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="font-medium text-emerald-950">
                    <span className="text-emerald-800 font-black text-sm sm:text-base">ہمزہ ساکنہ (أْ ، ءْ)</span> کو ہمیشہ <span className="text-rose-700 font-black underline decoration-rose-400">جھٹکا</span> دے کر پڑھیں۔
                  </p>
                  <button
                    onClick={() => playCustomText('يَأْكُلُوْنَ')}
                    className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black flex items-center gap-1 shadow cursor-pointer transition-all"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>جھٹکا کی آواز سنیں (يَأْكُلُوْنَ)</span>
                  </button>
                </div>
              </div>

              {/* Point 4 - Qalqalah letters */}
              <div className="flex items-start gap-2.5 pt-1.5">
                <span className="text-rose-600 font-bold text-base select-none">✦</span>
                <p>
                  <span className="text-rose-600 font-black">حروفِ قلقلہ</span> پانچ ہیں: <span className="text-rose-700 font-black text-base sm:text-lg tracking-wider">ق ، ط ، ب ، ج ، د</span> ان کا مجموعہ <span className="text-rose-800 font-black text-base sm:text-lg underline decoration-rose-500 font-arabic">قُطْبُ جَدٍّ</span> ہے۔
                </p>
              </div>

              {/* Point 5 - Qalqalah Meaning */}
              <div className="flex items-start gap-2.5 pt-1.5">
                <span className="text-rose-600 font-bold text-base select-none">✦</span>
                <p>
                  قلقلہ کے معنیٰ <span className="text-amber-900 font-black">جنبش اور حرکت</span> کے ہیں، ان حروف کے ادا کرتے وقت مخرج میں جنبش سی ہو جس کی وجہ سے <span className="text-emerald-900 font-black">آواز لوٹتی ہوئی نکلے</span>۔
                </p>
              </div>

              {/* Point 6 - Sukoon state Qalqalah */}
              <div className="flex items-start gap-2.5 pt-1.5">
                <span className="text-rose-600 font-bold text-base select-none">✦</span>
                <p>
                  جب <span className="text-rose-600 font-black">حروفِ قلقلہ</span> ساکن ہوں تو ان میں <span className="text-sky-800 font-black">قلقلہ خوب ظاہر ہوگا</span>۔
                </p>
              </div>

              {/* Point 7 - Warnings & Similar letters */}
              <div className="flex items-start gap-2.5 pt-1.5 bg-amber-100/70 p-2 rounded-xl border border-amber-300">
                <span className="text-amber-700 font-bold text-base select-none">✦</span>
                <p className="font-bold text-amber-950">
                  اس سبق میں <span className="text-rose-600 font-black">حروفِ قلقلہ</span> اور <span className="text-emerald-800 font-black">ہمزہ ساکنہ</span> کی ادائیگی کا خاص خیال رکھیں اور <span className="text-purple-900 font-black underline decoration-purple-400">ملتی جلتی آواز والے حروف</span> میں واضح فرق کریں۔
                </p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB: DEDICATED HAMZAH SAKINAH PAGE (EXACT TO BOOK IMAGE)
         ========================================================================= */}
      {activeTab === 'hamzah' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Page Banner */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-900 border-2 border-emerald-500 rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 flex items-center justify-center font-black text-2xl shadow-lg ring-2 ring-amber-300">
                  ءْ
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-zinc-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow">
                      سبق نمبر ۴ • خاص صفحہ
                    </span>
                    <span className="bg-emerald-500/40 text-emerald-200 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-400/40">
                      عکسِ کتاب
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-200 mt-1">
                    سکون و ہمزہ ساکنہ (جھٹکا کا قاعدہ)
                  </h2>
                </div>
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setPronunciationMode(pronunciationMode === 'rawani' ? 'hijja' : 'rawani')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-emerald-400/50 text-xs font-black text-emerald-200 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                  <span>طریقہ: {pronunciationMode === 'rawani' ? 'روانی (مستند)' : 'ہجے (جوڑ)'}</span>
                </button>

                <button
                  onClick={() => playMashqSequence(HAMZAH_SAKINAH_PAGE_ITEMS as any)}
                  className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all ${
                    isPlayingSequence
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:brightness-110'
                  }`}
                >
                  {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-950" />}
                  <span>{isPlayingSequence ? 'تلاوت جاری ہے...' : 'پورا صفحہ سنیں'}</span>
                </button>
              </div>
            </div>

            {/* Official Qaida Rule Card (Exact from Textbook Image) */}
            <div className="bg-amber-500/10 border-2 border-amber-400/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
                <h3 className="font-black text-base text-amber-300">
                  قاعدہ: ہمزہ ساکنہ (سکون کی حالت میں جھٹکا)
                </h3>
              </div>
              
              <p className="text-sm sm:text-base font-bold text-amber-100 leading-loose">
                "جس الف کی شکل پر حرکت یا سکون ہو وہ ہمزہ ہے، اور ہمزہ کی دیگر شکلیں، سکون کی حالت میں سب کو <span className="text-amber-300 font-black underline decoration-amber-400 text-lg px-1">جھٹکے سے</span> پڑھیں۔"
              </p>

              {/* Forms of Hamzah Visual Box (Exact to textbook) */}
              <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 space-y-1">
                  <span className="text-[10px] text-emerald-300 font-bold block">علامتِ ہمزہ</span>
                  <span className="text-xl font-black text-amber-300 font-arabic">ء</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 space-y-1">
                  <span className="text-[10px] text-emerald-300 font-bold block">الف کی شکل</span>
                  <span className="text-xl font-black text-amber-300 font-arabic">أُ  إِ  أَ</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 space-y-1">
                  <span className="text-[10px] text-emerald-300 font-bold block">واؤ کی شکل</span>
                  <span className="text-xl font-black text-amber-300 font-arabic">ؤُ</span>
                </div>
                <div className="bg-white/5 p-2 rounded-lg border border-white/10 space-y-1">
                  <span className="text-[10px] text-emerald-300 font-bold block">یاء کی شکل</span>
                  <span className="text-xl font-black text-amber-300 font-arabic">ئُ</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: 2-LETTER COMBINATIONS WITH HAMZAH SAKINAH (20 items) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-r-4 border-amber-500 pr-3 py-1">
              <div>
                <h3 className="font-black text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                  <span>۲ حرفی مرکبات مع ہمزہ ساکنہ</span>
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2 py-0.5 rounded-full border border-emerald-300">
                    ۲۰ مرکبات (جھٹکا)
                  </span>
                </h3>
                <p className="text-xs text-zinc-600">
                  ان تمام مرکبات میں ہمزہ ساکنہ پر آواز کو جھٹکا دے کر روکیں
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2.5">
              {HAMZAH_SAKINAH_PAGE_ITEMS.filter(item => item.section === 'hamzah_sakinah_combinations').map((item) => {
                const isActive = activeWord?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => speakWord(item)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-amber-100 border-amber-500 shadow-lg scale-105 ring-4 ring-amber-300'
                        : 'bg-white hover:bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 shadow-sm'
                    }`}
                  >
                    <span className="absolute top-1 left-1.5 text-[9px] font-black text-emerald-700 bg-emerald-100 px-1 rounded">
                      ⚡ جھٹکا
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-zinc-900 font-arabic leading-none mt-2">
                      {item.displayColored ? (
                        item.displayColored.map((part, i) => (
                          <span
                            key={i}
                            className={
                              part.type === 'hamzah_sakinah'
                                ? 'text-rose-600 font-extrabold underline decoration-rose-400'
                                : part.type === 'heavy'
                                ? 'text-indigo-700 font-bold'
                                : 'text-zinc-900'
                            }
                          >
                            {part.letter}
                          </span>
                        ))
                      ) : (
                        item.word
                      )}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-500 mt-1 group-hover:text-emerald-800">
                      {pronunciationMode === 'hijja' ? item.spellingHijja : item.pronunciationWord}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: QURANIC WORDS WITH HAMZAH SAKINAH (15 items) */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-r-4 border-emerald-600 pr-3 py-1">
              <div>
                <h3 className="font-black text-base sm:text-lg text-emerald-950 flex items-center gap-2">
                  <span>قرآنی کلمات مع ہمزہ ساکنہ</span>
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded-full border border-amber-300">
                    ۱۵ کلمات (عکسِ نورانی قاعدہ)
                  </span>
                </h3>
                <p className="text-xs text-zinc-600">
                  تمام کلمات میں ہمزہ ساکنہ کو واضح جھٹکے کے ساتھ ادا کیجیے
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {HAMZAH_SAKINAH_PAGE_ITEMS.filter(item => item.section === 'hamzah_sakinah_words').map((item) => {
                const isActive = activeWord?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => speakWord(item)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center justify-between min-h-[120px] ${
                      isActive
                        ? 'bg-amber-100 border-amber-500 shadow-xl scale-105 ring-4 ring-amber-300'
                        : 'bg-white hover:bg-emerald-50 border-emerald-200 hover:border-emerald-400 shadow-md'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 border-b border-zinc-100 pb-1">
                      <span className="bg-rose-100 text-rose-800 font-black px-1.5 py-0.5 rounded">
                        ہمزہ ساکنہ
                      </span>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    </div>

                    <div className="my-2 text-center">
                      <span className="text-3xl sm:text-4xl font-black text-zinc-900 font-arabic tracking-wide">
                        {item.displayColored ? (
                          item.displayColored.map((part, i) => (
                            <span
                              key={i}
                              className={
                                part.type === 'hamzah_sakinah'
                                  ? 'text-rose-600 font-extrabold underline decoration-rose-400'
                                  : part.type === 'qalqalah'
                                  ? 'text-emerald-600 font-bold'
                                  : part.type === 'heavy'
                                  ? 'text-indigo-700 font-bold'
                                  : 'text-zinc-900'
                              }
                            >
                              {part.letter}
                            </span>
                          ))
                        ) : (
                          item.word
                        )}
                      </span>
                    </div>

                    <div className="w-full pt-1 border-t border-zinc-100 text-center">
                      <span className="text-xs font-bold text-emerald-800 dir-rtl block truncate">
                        {pronunciationMode === 'hijja' ? item.spellingHijja : `جوڑ: ${item.breakdown}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB: DEDICATED TAJWEED RULES & INTERACTIVE GUIDELINES (DETAILED)
         ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          
          {/* Top Rule Header */}
          <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-yellow-100 border-2 border-amber-500 rounded-3xl p-5 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-amber-300 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow">
                  ْ
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-amber-950">
                    سبق نمبر ۴ کے بنیادی قواعد و تجویدی ہدایات
                  </h3>
                  <p className="text-xs text-amber-800">
                    (مأخوذ از نورانی و مدنی قاعدہ - مصدقہ تجویدی رہنما اصول)
                  </p>
                </div>
              </div>
              <span className="bg-amber-400 text-zinc-950 text-xs font-black px-3 py-1 rounded-full shadow">
                ۷ مستند اصول
              </span>
            </div>

            {/* List of 7 rules cards styled as authentic book */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Sukoon / Jazm definition */}
              <div className="bg-white border-2 border-sky-200 rounded-2xl p-4 shadow-sm hover:border-sky-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-sky-100 text-sky-900 text-xs font-black px-2.5 py-0.5 rounded-md border border-sky-300">
                    قاعدہ نمبر ۱
                  </span>
                  <span className="text-sky-800 text-xs font-bold">جزم و ساکن کی تعریف</span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                  جیسا کہ آپ پیچھے پڑھ چکے ہیں اس علامت <span className="bg-sky-100 text-sky-900 font-black px-2 py-0.5 rounded border border-sky-400 font-arabic text-base">[ ْ ]</span> کو <strong className="text-sky-800 font-black">جزم</strong> کہتے ہیں۔ جس حرف پر جزم ہو اُسے <strong className="text-sky-800 font-black">ساکن</strong> کہتے ہیں۔
                </p>
              </div>

              {/* Card 2: Method of reading sukoon */}
              <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-sm hover:border-emerald-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-md border border-emerald-300">
                    قاعدہ نمبر ۲
                  </span>
                  <span className="text-emerald-800 text-xs font-bold">پڑھنے کا طریقہ</span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                  جزم والا حرف اپنے سے پہلے متحرک حرف سے مل کر پڑھا جاتا ہے۔ مثلاً: <span className="font-arabic font-black text-emerald-900 text-base">اَبْ ، اَتْ ، قُلْ ، هَلْ</span>۔
                </p>
              </div>

              {/* Card 3: Hamzah Sakinah Jhatka */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-4 shadow-sm md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-700 text-white text-xs font-black px-2.5 py-0.5 rounded-md shadow">
                      قاعدہ نمبر ۳
                    </span>
                    <span className="text-emerald-950 font-black text-sm sm:text-base">
                      ہمزہ ساکنہ (أْ ، ءْ) کا جھٹکا
                    </span>
                  </div>
                  <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    اہم ترین اصول
                  </span>
                </div>

                <p className="text-sm font-bold text-emerald-950 leading-relaxed">
                  <span className="text-emerald-800 font-black text-base">ہمزہ ساکنہ (أْ ، ءْ)</span> کو ہمیشہ <span className="text-rose-700 font-black underline text-base">جھٹکا</span> دے کر پڑھیں۔ یعنی سانس اور آواز کو مخرج پر سختی سے روک کر یکدم چھوڑا جائے۔
                </p>

                {/* Hamzah Sakina Examples with audio buttons */}
                <div className="pt-2">
                  <div className="text-xs font-black text-emerald-900 mb-2 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span>ہمزہ ساکنہ کی قرآنی مثالیں (سننے کے لیے کلک کریں):</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      { word: 'يَأْكُلُوْنَ', label: 'يَأْكُلُوْنَ', translit: 'ہمزہ ساکنہ جھٹکا' },
                      { word: 'يُؤْمِنُوْنَ', label: 'يُؤْمِنُوْنَ', translit: 'واؤ پر ہمزہ ساکنہ' },
                      { word: 'بِئْسَ', label: 'بِئْسَ', translit: 'یا پر ہمزہ ساکنہ' },
                      { word: 'جِئْتَ', label: 'جِئْتَ', translit: 'ہمزہ ساکنہ' },
                      { word: 'مُؤْمِنٌ', label: 'مُؤْمِنٌ', translit: 'ہمزہ ساکنہ' },
                      { word: 'اِقْرَأْ', label: 'اِقْرَأْ', translit: 'آخر میں ہمزہ ساکنہ' },
                    ].map((ex, i) => (
                      <button
                        key={i}
                        onClick={() => playCustomText(ex.word)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-sm ${
                          activeAudioText === ex.word
                            ? 'bg-emerald-700 text-white border-emerald-800 scale-105 ring-2 ring-amber-400'
                            : 'bg-white hover:bg-emerald-100/70 text-emerald-950 border-emerald-300'
                        }`}
                      >
                        <span className="text-lg font-black font-arabic">{ex.word}</span>
                        <span className="text-[10px] opacity-80">{ex.translit}</span>
                        <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 4: 5 Qalqalah Letters */}
              <div className="bg-white border-2 border-rose-200 rounded-2xl p-4 shadow-sm hover:border-rose-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-rose-100 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-md border border-rose-300">
                    قاعدہ نمبر ۴
                  </span>
                  <span className="text-rose-800 text-xs font-bold">حروفِ قلقلہ کی تعداد</span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                  <strong className="text-rose-600 font-black text-base">حروفِ قلقلہ پانچ ہیں:</strong> <span className="text-rose-700 font-black text-base">ق ، ط ، ب ، ج ، د</span> ان کا مجموعہ <strong className="text-rose-800 font-black text-base underline font-arabic">قُطْبُ جَدٍّ</strong> ہے۔
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {['ق', 'ط', 'ب', 'ج', 'د'].map((lettr, idx) => (
                    <span key={idx} className="w-8 h-8 rounded-lg bg-rose-600 text-white font-black text-base flex items-center justify-center shadow">
                      {lettr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card 5: Qalqalah Definition */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-sm hover:border-amber-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-md border border-amber-300">
                    قاعدہ نمبر ۵
                  </span>
                  <span className="text-amber-800 text-xs font-bold">قلقلہ کے لغوی و اصطلاحی معنی</span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                  قلقلہ کے معنیٰ <strong className="text-amber-900 font-black">جنبش اور حرکت</strong> کے ہیں۔ ان حروف کے ادا کرتے وقت مخرج میں جنبش سی ہو جس کی وجہ سے <strong className="text-emerald-900 font-black">آواز لوٹتی ہوئی نکلے</strong>۔
                </p>
              </div>

              {/* Card 6: Qalqalah on Sukoon */}
              <div className="bg-white border-2 border-indigo-200 rounded-2xl p-4 shadow-sm hover:border-indigo-400 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-2.5 py-0.5 rounded-md border border-indigo-300">
                    قاعدہ نمبر ۶
                  </span>
                  <span className="text-indigo-800 text-xs font-bold">حالتِ سکون میں قلقلہ</span>
                </div>
                <p className="text-sm font-semibold text-zinc-900 leading-relaxed">
                  جب <strong className="text-rose-600 font-black">حروفِ قلقلہ ساکن ہوں</strong> تو ان میں <strong className="text-indigo-900 font-black">قلقلہ خوب ظاہر ہوگا</strong>۔ (مثلاً: <span className="font-arabic font-black text-indigo-950 text-base">اَبْ ، اَجْ ، اَدْ ، اَطْ ، اَقْ</span>)۔
                </p>
              </div>

              {/* Card 7: Warning on Similar Letters */}
              <div className="bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-400 rounded-2xl p-4 shadow-sm md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md shadow">
                      قاعدہ نمبر ۷
                    </span>
                    <span className="text-amber-950 font-black text-sm sm:text-base">
                      اہم تنبیہ: ملتی جلتی آواز والے حروف (قریب الصوت) میں واضح فرق
                    </span>
                  </div>
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    لازمی احتیاط
                  </span>
                </div>

                <p className="text-sm font-bold text-amber-950 leading-relaxed">
                  اس سبق میں <span className="text-rose-600 font-black">حروفِ قلقلہ</span> اور <span className="text-emerald-800 font-black">ہمزہ ساکنہ</span> کی ادائیگی کا خاص خیال رکھیں اور <span className="text-purple-900 font-black underline">ملتی جلتی آواز والے حروف میں واضح فرق کریں</span>۔
                </p>

                {/* Similar Sounding Letters Comparison Grid */}
                <div className="pt-2">
                  <div className="text-xs font-black text-zinc-800 mb-2">
                    حروفِ قریب الصوت کا تقابلی چارٹ (تلفظ سن کر فرق پہچانیں):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    
                    {/* Pair 1: Ta vs Taa */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        تْ (باریک) بمقابلہ طْ (پُر مع قلقلہ)
                      </div>
                      <div className="flex items-center justify-around gap-2">
                        <button
                          onClick={() => playCustomText('اَتْ')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>اَتْ</span>
                        </button>
                        <span className="text-zinc-400 text-xs font-bold">بمقابلہ</span>
                        <button
                          onClick={() => playCustomText('اَطْ')}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                          <span>اَطْ</span>
                        </button>
                      </div>
                    </div>

                    {/* Pair 2: Seen vs Saad */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        سْ (سیٹی باریک) بمقابلہ صْ (سیٹی پُر)
                      </div>
                      <div className="flex items-center justify-around gap-2">
                        <button
                          onClick={() => playCustomText('اَسْ')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>اَسْ</span>
                        </button>
                        <span className="text-zinc-400 text-xs font-bold">بمقابلہ</span>
                        <button
                          onClick={() => playCustomText('اَصْ')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-950 border border-cyan-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                          <span>اَصْ</span>
                        </button>
                      </div>
                    </div>

                    {/* Pair 3: Kaaf vs Qaaf */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        كْ (باریک) بمقابلہ قْ (پُر مع قلقلہ)
                      </div>
                      <div className="flex items-center justify-around gap-2">
                        <button
                          onClick={() => playCustomText('اَكْ')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>اَكْ</span>
                        </button>
                        <span className="text-zinc-400 text-xs font-bold">بمقابلہ</span>
                        <button
                          onClick={() => playCustomText('اَقْ')}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-rose-700" />
                          <span>اَقْ</span>
                        </button>
                      </div>
                    </div>

                    {/* Pair 4: Hamzah vs Ain */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        ءْ (ہمزہ جھٹکا) بمقابلہ عْ (عین نرم)
                      </div>
                      <div className="flex items-center justify-around gap-2">
                        <button
                          onClick={() => playCustomText('يَأْكُلُ')}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-arabic font-black text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>يَأْكُلُ</span>
                        </button>
                        <span className="text-zinc-400 text-xs font-bold">بمقابلہ</span>
                        <button
                          onClick={() => playCustomText('يَعْمَلُ')}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-arabic font-black text-sm flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                          <span>يَعْمَلُ</span>
                        </button>
                      </div>
                    </div>

                    {/* Pair 5: Haa vs Hha */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        هْ (سینے سے) بمقابلہ حْ (حلق سے صاف)
                      </div>
                      <div className="flex items-center justify-around gap-2">
                        <button
                          onClick={() => playCustomText('اَهْ')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>اَهْ</span>
                        </button>
                        <span className="text-zinc-400 text-xs font-bold">بمقابلہ</span>
                        <button
                          onClick={() => playCustomText('اَحْ')}
                          className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-950 border border-teal-300 font-arabic font-black text-base flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                          <span>اَحْ</span>
                        </button>
                      </div>
                    </div>

                    {/* Pair 6: Zaa vs Zaal vs Zaa */}
                    <div className="bg-white p-3 rounded-xl border border-zinc-300 space-y-2">
                      <div className="text-xs font-black text-zinc-700 border-b pb-1">
                        زْ (سیٹی) | ذْ (نرم باریک) | ظْ (نرم پُر)
                      </div>
                      <div className="flex items-center justify-around gap-1.5">
                        <button
                          onClick={() => playCustomText('اَزْ')}
                          className="px-2 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-950 border border-purple-300 font-arabic font-black text-sm flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>اَزْ</span>
                        </button>
                        <button
                          onClick={() => playCustomText('اَذْ')}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-arabic font-black text-sm flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>اَذْ</span>
                        </button>
                        <button
                          onClick={() => playCustomText('اَظْ')}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-300 font-arabic font-black text-sm flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>اَظْ</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>

            {/* Back to practice button */}
            <div className="pt-2 flex items-center justify-center">
              <button
                onClick={() => setActiveTab('page12')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>سکون کے کلمات کی مشق شروع کریں ←</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 1, 2, 4: WORD GRIDS WITH SECTIONS & FILTERS
         ========================================================================= */}
      {activeTab !== 'quiz' && activeTab !== 'rules' && (
        <div className="space-y-5">
          
          {/* Filter Buttons & Search Bar */}
          <div className="bg-white border border-zinc-300 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-bold text-zinc-500 ml-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                فلٹرز:
              </span>

              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-zinc-800 text-white shadow'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                تمام ({currentTabWords.length})
              </button>

              <button
                onClick={() => setFilterType('qalqalah')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'qalqalah'
                    ? 'bg-emerald-700 text-white shadow ring-2 ring-emerald-400'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span>حروفِ قلقلہ والے</span>
                <span className="text-[10px] opacity-80">
                  ({currentTabWords.filter(w => w.isQalqalah).length})
                </span>
              </button>

              <button
                onClick={() => setFilterType('heavy')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filterType === 'heavy'
                    ? 'bg-cyan-700 text-white shadow ring-2 ring-cyan-400'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200'
                }`}
              >
                <span>حروفِ مستعلیہ (پُر)</span>
                <span className="text-[10px] opacity-80">
                  ({currentTabWords.filter(w => w.isHeavyLetterIncluded).length})
                </span>
              </button>

              <button
                onClick={() => setFilterType('2-letter')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === '2-letter'
                    ? 'bg-purple-700 text-white shadow'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                ۲ حرفی ({currentTabWords.filter(w => w.letterCount === 2).length})
              </button>

              <button
                onClick={() => setFilterType('3-letter')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterType === '3-letter'
                    ? 'bg-amber-700 text-white shadow'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                ۳/۴ حرفی ({currentTabWords.filter(w => w.letterCount >= 3).length})
              </button>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="تلاش کریں (مثلاً: اَبْ، قَدْ، نَحْنُ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic"
              />
            </div>
          </div>

          {/* Section 1 on Page 12: Hamza + Sukoon Alphabet Breakdown Grid */}
          {activeTab === 'page12' && filterType === 'all' && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-amber-200/60 px-4 py-2 rounded-xl border border-amber-400 font-black text-xs sm:text-sm text-amber-950">
                <span>۱. ہمزہ کے ساتھ حروفِ تہجی پر سکون (اَبْ، اِبْ، اُبْ... تا اَيْ)</span>
                <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">31 کلمات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
                {PAGE_12_HAMZA_SUKOON.map(item => renderWordCard(item))}
              </div>

              {/* Tri-harakat section */}
              <div className="flex items-center justify-between bg-teal-100/70 px-4 py-2 rounded-xl border border-teal-300 font-black text-xs sm:text-sm text-teal-950 mt-4">
                <span>۲. تینوں حرکات کے ساتھ مشق (دَرْ دِرْ دُرْ، دَحْ دِحْ دُحْ، رَشْ رِشْ رُشْ...)</span>
                <span className="text-xs bg-teal-700 text-white px-2 py-0.5 rounded-full">8 سیٹس</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {PAGE_12_TRI_HARAKAT.map(item => renderWordCard(item, true))}
              </div>

              {/* 28 Two-letter Words section */}
              <div className="flex items-center justify-between bg-emerald-100/70 px-4 py-2 rounded-xl border border-emerald-300 font-black text-xs sm:text-sm text-emerald-950 mt-4">
                <span>۳. دو حرفی ساکن کلمات (اَزْ، اِمْ، اِذْ، رَدْ، قُلْ، هَلْ، لَنْ، كُلْ، هَبْ، قَدْ...)</span>
                <span className="text-xs bg-emerald-700 text-white px-2 py-0.5 rounded-full">28 کلمات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {PAGE_12_WORDS.map(item => renderWordCard(item))}
              </div>
            </div>
          )}

          {/* Section 2 on Page 13: Qalqalah Sets + Words Breakdown */}
          {activeTab === 'page13' && filterType === 'all' && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-100/80 px-4 py-2 rounded-xl border border-emerald-400 font-black text-xs sm:text-sm text-emerald-950">
                <span>۱. حروفِ قلقلہ کی بنیادی مشق (اَبْ، بَجْ، سَدْ، قَطْ، جَقْ، جَبْ)</span>
                <span className="text-xs bg-emerald-800 text-white px-2 py-0.5 rounded-full">6 سیٹس</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PAGE_13_QALQALAH_BASIC.map(item => renderWordCard(item, true))}
              </div>

              {/* 2-letter Qalqalah words */}
              <div className="flex items-center justify-between bg-cyan-100/80 px-4 py-2 rounded-xl border border-cyan-400 font-black text-xs sm:text-sm text-cyan-950 mt-4">
                <span>۲. قلقلہ کے دو حرفی کلمات (قَدْ، يَقْ، قَبْ، مَطْ، نُطْ، نَقْ، فِجْ، لُقْ...)</span>
                <span className="text-xs bg-cyan-800 text-white px-2 py-0.5 rounded-full">21 کلمات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {PAGE_13_QALQALAH_2LETTER.map(item => renderWordCard(item))}
              </div>

              {/* 3-letter Quranic words block 1 */}
              <div className="flex items-center justify-between bg-purple-100/80 px-4 py-2 rounded-xl border border-purple-400 font-black text-xs sm:text-sm text-purple-950 mt-4">
                <span>۳. تین حرفی قرآنی کلمات مع سکون و قلقلہ (وِزْرَ، اَجْرٌ، عَفْوُ، قَرْنَ، لَحْمَ، اَمْرُ...)</span>
                <span className="text-xs bg-purple-800 text-white px-2 py-0.5 rounded-full">18 کلمات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {PAGE_13_QURANIC_3LETTER.map(item => renderWordCard(item))}
              </div>

              {/* Quranic compounds block 2 */}
              <div className="flex items-center justify-between bg-amber-100/80 px-4 py-2 rounded-xl border border-amber-400 font-black text-xs sm:text-sm text-amber-950 mt-4">
                <span>۴. قرآنی الفاظ و مرکبات (نَحْنُ، اَلْفِ، عَنْهُ، تِلْكَ، فَهُمْ، بِهِمْ، اَنْتَ، عِنْدَ...)</span>
                <span className="text-xs bg-amber-800 text-white px-2 py-0.5 rounded-full">18 کلمات</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {PAGE_13_QURANIC_COMPOUNDS.map(item => renderWordCard(item))}
              </div>
            </div>
          )}

          {/* Regular Filtered / Search Grid (when filters or search are active, or on "all" tab) */}
          {(activeTab === 'all' || filterType !== 'all' || searchQuery) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {filteredWords.map(item => renderWordCard(item))}
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: INTERACTIVE QALQALAH & SUKOON QUIZ
         ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="bg-white border-2 border-emerald-600/40 rounded-3xl p-5 sm:p-8 max-w-2xl mx-auto shadow-xl space-y-6 text-center">
          
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <span className="font-black text-base sm:text-lg text-emerald-950">قلقلہ فلیش کارڈ کوئز</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-purple-100 text-purple-900 font-black px-3 py-1 rounded-full border border-purple-300">
                سوال {quizIndex + 1} / {quizPool.length}
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-full border border-amber-300">
                سکور: {quizScore}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-amber-50 border-2 border-amber-400/70 rounded-2xl p-6 sm:p-8 space-y-4 shadow-inner">
            
            {/* Word Display with sound button */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black text-emerald-900 tracking-wider font-arabic py-2">
                {quizPool[quizIndex]?.item.word}
              </span>
              
              <button
                onClick={() => speakWord(quizPool[quizIndex]?.item)}
                className="px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>تلفظ سنیں</span>
              </button>
            </div>

            <p className="text-sm sm:text-base font-black text-zinc-800">
              {quizPool[quizIndex]?.question}
            </p>

            <div className="text-xs text-zinc-500">
              (یاد رکھیں: حروفِ قلقلہ ۵ ہیں: ق ، ط ، ب ، ج ، د)
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizPool[quizIndex]?.options.map((opt, i) => {
              const isSelected = selectedQuizAnswer === opt;
              const isCorrect = opt === quizPool[quizIndex]?.correct;
              
              let btnStyle = 'bg-zinc-50 hover:bg-emerald-50 text-zinc-900 border-2 border-zinc-300';
              if (selectedQuizAnswer !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 font-black';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-600 text-white border-rose-700 font-black';
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedQuizAnswer !== null}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-4 rounded-2xl text-sm font-black transition-all cursor-pointer shadow-sm ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback Banner */}
          {quizFeedback && (
            <div className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-bold shadow-md flex items-center gap-3 ${
              quizFeedback.isCorrect
                ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                : 'bg-rose-100 border-rose-500 text-rose-950'
            }`}>
              {quizFeedback.isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              )}
              <span className="text-right leading-relaxed">{quizFeedback.text}</span>
            </div>
          )}

          {/* Next Button */}
          {selectedQuizAnswer !== null && (
            <button
              onClick={nextQuizQuestion}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-sm sm:text-base shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 border border-amber-600"
            >
              <span>اگلا سوال ←</span>
            </button>
          )}

        </div>
      )}

      {/* Bottom Summary Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900 text-amber-200/90 p-4 rounded-2xl border border-amber-500/30 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>تجوید نوٹ: سکون کے وقت صرف پانچ حروف (قُطْبُ جَدٍّ) میں قلقلہ ہوگا، اور ہمزہ ساکنہ (أْ، ءْ) میں ہمیشہ جھٹکا دیا جائے گا۔</span>
        </div>
        <div className="text-zinc-400 font-bold">
          کل کلمات: {ALL_SUKOON_QALQALAH_DATA.length} (صفحات ۱۲ و ۱۳)
        </div>
      </div>

    </div>
  );

  // Helper renderer for word cards
  function renderWordCard(item: SukoonWordItem, isWide: boolean = false) {
    const isSelected = activeWord?.id === item.id;

    return (
      <div
        key={item.id}
        onClick={() => speakWord(item)}
        className={`bg-white border-2 rounded-2xl p-3 text-center cursor-pointer transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex flex-col items-center justify-between relative min-h-[140px] ${
          isWide ? 'col-span-1 sm:col-span-2 md:col-span-1' : ''
        } ${
          isSelected
            ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400 scale-105 shadow-xl'
            : 'border-emerald-600/40 hover:border-emerald-600'
        }`}
      >
        {/* Badges */}
        <div className="w-full flex items-center justify-between">
          {item.isQalqalah ? (
            <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow flex items-center gap-0.5">
              <span>قلقلہ</span>
              <span className="text-amber-300">({item.qalqalahLetter || '✓'})</span>
            </span>
          ) : item.isHeavyLetterIncluded ? (
            <span className="bg-cyan-700 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow">
              پُر حرف
            </span>
          ) : (
            <span className="text-[9px] text-emerald-700 font-bold">سکون</span>
          )}

          <Volume2 className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-amber-600 animate-bounce' : 'text-zinc-300'}`} />
        </div>

        {/* Word Arabic Text */}
        <div className="my-auto py-1">
          <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-wider font-arabic">
            {item.word}
          </div>
        </div>

        {/* Breakdown & Hijja label */}
        <div className="w-full bg-emerald-50/80 rounded-xl py-1 px-1.5 border border-emerald-200/60 mt-1">
          <div className="text-[10px] font-black text-emerald-900 truncate" title={item.breakdown}>
            {item.breakdown}
          </div>
          <div className="text-[9px] text-zinc-500 truncate" title={item.spellingHijja}>
            {item.spellingHijja}
          </div>
        </div>

      </div>
    );
  }
};

