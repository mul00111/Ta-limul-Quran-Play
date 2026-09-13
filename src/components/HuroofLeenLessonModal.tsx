import React, { useState, useMemo } from 'react';
import { 
  Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, 
  HelpCircle, RefreshCw, BookOpen, Layers, Search, Filter, AlertCircle, Award,
  Info, ChevronDown, ChevronUp, Check, Lightbulb, Gamepad2, Compass, Puzzle
} from 'lucide-react';
import { playQariText, stopAllQariAudio, playQuizFeedbackAudio, playWordWithHijjaAndPronunciation } from '../utils/qariAudioService';
import { 
  HUROOF_LEEN_RULES, 
  UNIFIED_HUROOF_LEEN_PAIRS, 
  UNIFIED_ALL_LEEN_CARDS,
  ALL_HUROOF_LEEN_WORDS,
  PAGE_14_WAW_LEEN_WORDS,
  PAGE_15_YAA_LEEN_WORDS,
  LeenSingleCardItem,
  LeenPairItem,
  LeenWordItem 
} from '../data/huroofLeenData';
import { HuroofLeenGameModal } from './HuroofLeenGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';

interface HuroofLeenLessonModalProps {
  onBack: () => void;
}

export const HuroofLeenLessonModal: React.FC<HuroofLeenLessonModalProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'board' | 'page14' | 'page15' | 'words' | 'rules' | 'quiz' | 'game'>('page14');
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja' | 'pair'>('rawani');
  const [filterType, setFilterType] = useState<'all' | 'heavy' | 'waw' | 'yaa'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showFullGame, setShowFullGame] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);

  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCardId, setActiveCardId] = useState<number | null>(null);
  const [activePairId, setActivePairId] = useState<number | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);

  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);

  // Game Mode States
  const [gameScore, setGameScore] = useState(0);
  const [gameTarget, setGameTarget] = useState<LeenSingleCardItem | null>(null);
  const [gameFeedback, setGameFeedback] = useState<string | null>(null);

  // Quiz Questions Pool
  const quizPool = useMemo(() => {
    return [
      {
        question: 'حروفِ لین کتنے اور کون سے ہیں؟',
        correct: 'دو (۲) ہیں: وَاو اور یَا',
        options: ['تین ہیں: الف، واؤ، یاء', 'دو (۲) ہیں: وَاو اور یَا', 'چار ہیں: زبر، زیر، پیش، سکون', 'سات ہیں: حروف مستعلیہ'],
        explanation: 'حروفِ لین کل دو (۲) ہیں: واؤ ساکن سے پہلے زبر ہو تو واؤ لین، اور یاء ساکن سے پہلے زبر ہو تو یاء لین۔'
      },
      {
        question: 'واؤ ساکن سے پہلے زبر ہو تو کیا کہلائے گا؟',
        correct: 'واؤ لین جیسے جَوْ',
        options: ['واؤ لین جیسے جَوْ', 'واؤ مدہ جیسے جُوْ', 'قلقلہ کا قاعدہ', 'ہمزہ ساکنہ'],
        explanation: 'واؤ ساکن سے پہلے زبر ہو تو واؤ لین ہوتا ہے، جیسے: بَوْ ، جَوْ ، سَوْفَ ۔'
      },
      {
        question: 'یاء ساکن سے پہلے زبر ہو تو کیا کہلائے گا؟',
        correct: 'یاء لین جیسے جَيْ',
        options: ['یاء مدہ جیسے جِيْ', 'یاء لین جیسے جَيْ', 'اظہار کا قاعدہ', 'ادغام کا قاعدہ'],
        explanation: 'یاء ساکن سے پہلے زبر ہو تو یاء لین ہوتا ہے، جیسے: بَيْ ، جَيْ ، بَيْتٍ ۔'
      },
      {
        question: 'حروفِ لین کو کیسے پڑھنا چاہیے؟',
        correct: 'بغیر کھینچے بغیر جھٹکا دیے نرمی سے معروف پڑھیں',
        options: ['بغیر کھینچے بغیر جھٹکا دیے نرمی سے معروف پڑھیں', 'ایک الف کے برابر لمبا کھینچ کر', 'جھٹکا دے کر اور مجہول', 'ناک میں آواز لے جا کر غنہ سے'],
        explanation: 'حروف لین کو بغیر کھینچے، بغیر جھٹکا دیے، نرم آواز کے ساتھ اور مجہول آوازوں سے بچ کر معروف پڑھتے ہیں۔'
      },
      {
        question: 'کلمہ "اَوْ" اور "اَيْ" کے ہجے کیا ہیں؟',
        correct: 'ہمزہ واؤ زبر اَوْ ، ہمزہ یاء زبر اَيْ = اَوْ ، اَيْ',
        options: ['ہمزہ واؤ زبر اَوْ ، ہمزہ یاء زبر اَيْ = اَوْ ، اَيْ', 'الف واؤ پیش اُوْ ، الف یا زیر اِيْ', 'با الف زبر بَا', 'با تا زبر بَتْ'],
        explanation: 'ہجے کا درست طریقہ: ہمزہ واؤ زبر اَوْ ، ہمزہ یاء زبر اَيْ = اَوْ ، اَيْ ہے۔'
      },
      {
        question: 'حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) کو حروفِ لین میں کیسا پڑھیں گے؟',
        correct: 'پُر (موٹا) پڑھیں گے',
        options: ['پُر (موٹا) پڑھیں گے', 'باریک پڑھیں گے', 'جھٹکے سے پڑھیں گے', 'سیٹی کے ساتھ پڑھیں گے'],
        explanation: 'خ، ص، ض، ط، ظ، غ اور ق حروفِ مستعلیہ ہیں جنہیں ہر حال میں موٹا (پُر) پڑھا جاتا ہے۔'
      }
    ];
  }, []);

  // Single card audio playback
  const handlePlayCard = (card: LeenSingleCardItem) => {
    if (isMuted) return;
    setActiveCardId(card.id);
    setActivePairId(card.pairId);
    setActiveWordId(null);

    let textToPlay = card.rawSound;
    if (pronunciationMode === 'hijja') {
      textToPlay = card.hijjaSpelling;
    } else if (pronunciationMode === 'pair') {
      const pair = UNIFIED_HUROOF_LEEN_PAIRS.find(p => p.id === card.pairId);
      if (pair) textToPlay = pair.combinedSound;
    }

    setActiveAudioText(textToPlay);
    playQariText(textToPlay);
  };

  // Pair audio playback
  const handlePlayPair = (pair: LeenPairItem) => {
    if (isMuted) return;
    setActivePairId(pair.id);
    setActiveCardId(pair.wawCard.id);
    setActiveWordId(null);

    const textToPlay = pronunciationMode === 'hijja' ? pair.combinedHijja : pair.combinedSound;
    setActiveAudioText(textToPlay);
    playQariText(textToPlay);
  };

  // Word playback
  const handlePlayWord = (item: LeenWordItem) => {
    if (isMuted) return;
    setActiveWordId(item.id);
    setActiveCardId(null);
    setActivePairId(null);

    if (pronunciationMode === 'hijja') {
      setActiveAudioText(item.spellingHijja);
      playWordWithHijjaAndPronunciation(item.spellingHijja, item.word);
    } else {
      setActiveAudioText(item.word);
      playQariText(item.word);
    }
  };

  // Full continuous sequence playback for Unified pairs (Row 1 to Row 10)
  const playFullUnifiedSequence = async () => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveCardId(null);
      setActivePairId(null);
      setActiveWordId(null);
      return;
    }

    setIsPlayingSequence(true);

    for (let i = 0; i < UNIFIED_HUROOF_LEEN_PAIRS.length; i++) {
      const pair = UNIFIED_HUROOF_LEEN_PAIRS[i];
      setActivePairId(pair.id);

      if (pronunciationMode === 'pair') {
        setActiveCardId(pair.wawCard.id);
        setActiveAudioText(pair.combinedSound);
        await playQariText(pair.combinedSound);
        await new Promise(r => setTimeout(r, 600));
      } else {
        // Play Waw Card first
        setActiveCardId(pair.wawCard.id);
        const wawText = pronunciationMode === 'hijja' ? pair.wawCard.hijjaSpelling : pair.wawCard.rawSound;
        setActiveAudioText(wawText);
        await playQariText(wawText);
        await new Promise(r => setTimeout(r, 450));

        // Play Yaa Card second
        setActiveCardId(pair.yaaCard.id);
        const yaaText = pronunciationMode === 'hijja' ? pair.yaaCard.hijjaSpelling : pair.yaaCard.rawSound;
        setActiveAudioText(yaaText);
        await playQariText(yaaText);
        await new Promise(r => setTimeout(r, 550));
      }
    }

    setIsPlayingSequence(false);
    setActiveCardId(null);
    setActivePairId(null);
    setActiveAudioText(null);
  };

  // Full continuous sequence playback for Page 14 or Page 15
  const playPageSequence = async (pageNum: 14 | 15) => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWordId(null);
      return;
    }

    const wordsToPlay = pageNum === 14 ? PAGE_14_WAW_LEEN_WORDS : PAGE_15_YAA_LEEN_WORDS;
    setIsPlayingSequence(true);

    for (let i = 0; i < wordsToPlay.length; i++) {
      const item = wordsToPlay[i];
      setActiveWordId(item.id);
      const textToPlay = pronunciationMode === 'hijja' ? item.spellingHijja : item.word;
      setActiveAudioText(textToPlay);
      await playQariText(textToPlay);
      await new Promise(r => setTimeout(r, pronunciationMode === 'hijja' ? 1200 : 700));
    }

    setIsPlayingSequence(false);
    setActiveWordId(null);
    setActiveAudioText(null);
  };

  // Quiz Answer Handler
  const handleAnswerQuiz = (selectedOpt: string) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(selectedOpt);
    const currentQ = quizPool[quizIndex];
    const isCorrect = selectedOpt === currentQ.correct;

    if (isCorrect) {
      setQuizScore(prev => prev + 10);
      setQuizFeedback({ isCorrect: true, text: currentQ.explanation });
      playQuizFeedbackAudio(true);
    } else {
      setQuizFeedback({ isCorrect: false, text: `درست جواب: "${currentQ.correct}" تھا۔ ${currentQ.explanation}` });
      playQuizFeedbackAudio(false);
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

  // Game Handlers
  const startLeenGame = () => {
    setGameScore(0);
    pickNextGameTarget();
  };

  const pickNextGameTarget = () => {
    const randomCard = UNIFIED_ALL_LEEN_CARDS[Math.floor(Math.random() * UNIFIED_ALL_LEEN_CARDS.length)];
    setGameTarget(randomCard);
    setGameFeedback(null);
    playQariText(randomCard.rawSound);
  };

  const handleGameCardClick = (clickedCard: LeenSingleCardItem) => {
    if (!gameTarget) return;
    if (clickedCard.id === gameTarget.id) {
      setGameScore(prev => prev + 10);
      setGameFeedback('بہت خوب! ماشاء اللہ درست انتخاب 🎉');
      playQuizFeedbackAudio(true);
      setTimeout(() => {
        pickNextGameTarget();
      }, 1200);
    } else {
      setGameFeedback('غلط! دوبارہ سنیں اور درست حرف کا انتخاب کریں ❌');
      playQuizFeedbackAudio(false);
      playQariText(gameTarget.rawSound);
    }
  };

  if (showFullGame) {
    return <HuroofLeenGameModal onBack={() => setShowFullGame(false)} />;
  }

  if (showMagneticGame) {
    return (
      <MurakkabatPuzzleGameModal
        initialGameMode="leen"
        onBack={() => setShowMagneticGame(false)}
      />
    );
  }

  return (
    <div className="bg-[#fef8ee] border-4 border-emerald-700/80 rounded-3xl p-3 sm:p-6 shadow-2xl space-y-5 text-zinc-900 font-urdu select-none" dir="rtl">
      
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-3.5 sm:p-5 rounded-2xl shadow-xl border border-emerald-500/40">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-black shadow-lg border border-amber-500/30 hover:border-amber-400 shrink-0"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-300 flex items-center justify-center text-zinc-950 font-black shadow-lg">
            <span className="text-xl">۵</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black text-amber-300">سبق نمبر (۵) : حُرُوفِ لِين و مشق</h2>
              <span className="bg-emerald-800 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-600">
                حروف و کلماتِ مشق (۷۰ کلمات)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5 font-sans">
              حروفِ واؤ لین و یاء لین مع مکمل مشق، ہجے و روانی، مقناطیسی پزل اور گیمز
            </p>
          </div>
        </div>

        {/* Action Buttons & Pronunciation Toggles & Game Launchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Magnetic Board Game Launcher */}
          <button
            onClick={() => setShowMagneticGame(true)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 text-xs font-black shadow-lg border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Puzzle className="w-4 h-4 text-zinc-950 animate-pulse" />
            <span>مقناطیسی پزل گیم 🧩</span>
          </button>

          {/* Full Multi-Level Game Launcher */}
          <button
            onClick={() => setShowFullGame(true)}
            className="px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg border border-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>صوتی و بصری گیم 🎯</span>
          </button>

          {/* Mode switch */}
          <div className="bg-zinc-900/90 p-1 rounded-xl border border-emerald-700/60 flex items-center gap-1 text-xs">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-2.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-2.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ہجے
            </button>
            {activeTab === 'board' && (
              <button
                onClick={() => setPronunciationMode('pair')}
                className={`px-2.5 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
                  pronunciationMode === 'pair'
                    ? 'bg-teal-500 text-zinc-950 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                جوڑی
              </button>
            )}
          </div>

          {/* Continuous Sequence Playback */}
          <button
            onClick={() => {
              if (activeTab === 'board') playFullUnifiedSequence();
              else if (activeTab === 'page14') playPageSequence(14);
              else if (activeTab === 'page15') playPageSequence(15);
              else playPageSequence(14);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer border ${
              isPlayingSequence
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 border-amber-600'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlayingSequence ? 'روکیں' : 'مکمل آڈیو سنیں'}</span>
          </button>

          {/* Mute Button */}
          <button
            onClick={() => {
              if (!isMuted) stopAllQariAudio();
              setIsMuted(!isMuted);
            }}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted ? 'bg-rose-900/80 text-rose-300 border-rose-700' : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-white'
            }`}
            title={isMuted ? 'آواز کھولیں' : 'آواز بند کریں'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-zinc-900/90 p-2 rounded-2xl border border-emerald-700/50 shadow-md">
        <button
          onClick={() => setActiveTab('page14')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'page14'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-300" />
          <span>📗 مشق واؤ لین</span>
        </button>

        <button
          onClick={() => setActiveTab('page15')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'page15'
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-300" />
          <span>📘 مشق یاء لین</span>
        </button>

        <button
          onClick={() => setActiveTab('board')}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'board'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-300" />
          <span>📖 قاعدہ تختی (۲۹ جوڑیاں)</span>
        </button>

        <button
          onClick={() => setActiveTab('words')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'words'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-300" />
          <span>🗂️ تمام کلمات (۷۰ کلمات)</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>📜 تجوید و قواعد</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-[1.01]'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 text-pink-300" />
          <span>🧠 کوئز</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: MASHQ WAW LEEN */}
      {/* ========================================================================= */}
      {activeTab === 'page14' && (
        <div className="space-y-4">
          
          {/* Authentic Qaida Waw Leen Book Card */}
          <div className="bg-[#fffdf5] border-4 border-emerald-700/80 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
            
            {/* Top Page Header Pill */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-emerald-600/40 pb-3">
              <div className="inline-flex items-center justify-center px-6 sm:px-10 py-1.5 rounded-full bg-white border-2 border-emerald-700 text-emerald-900 font-black shadow-sm text-base sm:text-xl">
                <span>مَشْق : </span>
                <span className="text-red-600 mr-2 font-bold font-quran text-xl sm:text-2xl">وَاو لِين</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playPageSequence(14)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow border ${
                    isPlayingSequence
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>مکمل واؤ لین سنیں</span>
                </button>
                <button
                  onClick={() => setShowMagneticGame(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow border border-amber-600"
                >
                  <Puzzle className="w-3.5 h-3.5" />
                  <span>پزل میں مشق کریں</span>
                </button>
                <span className="bg-emerald-800 text-white px-3 py-1 rounded-full text-xs font-bold font-sans">
                  مشق واؤ لین (۳۵ کلمات)
                </span>
              </div>
            </div>

            {/* Book Rule Summary Banner */}
            <div className="bg-[#fcf5e5] border border-emerald-600/50 rounded-2xl p-3 text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed flex items-center gap-2.5">
              <span className="text-red-600 text-base font-bold shrink-0">🪷</span>
              <p>
                <strong>قاعدہ:</strong> واؤ ساکن سے پہلے زبر ہو تو واؤ لین ہوگا۔ واؤ لین کو <span className="text-sky-700 font-bold">بغیر کھینچے اور بغیر جھٹکا دیے نرمی سے معروف</span> پڑھیں۔
              </p>
            </div>

            {/* Exact 7-Row Grid from Page 14 */}
            <div className="space-y-3 pt-1">
              {/* Row 1 to Row 3 (15 words) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {PAGE_14_WAW_LEEN_WORDS.slice(0, 15).map((item) => {
                  const isWordActive = activeWordId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handlePlayWord(item)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between p-2 relative group shadow-sm select-none ${
                        isWordActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : 'bg-[#fffef8] hover:bg-emerald-50 border-emerald-600/80 hover:border-emerald-700 hover:shadow-md'
                      }`}
                    >
                      {/* Top Action Icons */}
                      <div className="w-full flex items-center justify-between text-[10px] text-zinc-400">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowMagneticGame(true); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 p-1 rounded-md text-[9px] hover:bg-amber-600"
                          title="مقناطیسی پزل میں کھولیں"
                        >
                          <Puzzle className="w-3 h-3" />
                        </button>
                        {item.isHeavyLetterIncluded ? (
                          <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold text-[9px]">پُر</span>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-sans">{item.letterCount} حرفی</span>
                        )}
                      </div>

                      {/* Crisp Calligraphy Word */}
                      <span className={`font-quran text-3xl sm:text-4xl font-bold tracking-normal leading-tight ${
                        item.isHeavyLetterIncluded ? 'text-sky-800' : 'text-zinc-950'
                      }`}>
                        {item.word}
                      </span>

                      {/* Syllable Breakdown */}
                      <span className="text-[11px] text-emerald-800 font-bold font-sans">
                        {item.breakdown}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Authentic Page Divider Line with Central Rosette (Matching Book Page 14) */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="w-full border-t-2 border-emerald-600/60"></div>
                <div className="absolute bg-[#fffdf5] px-4 text-red-600 text-sm font-bold flex items-center gap-1.5 font-sans">
                  <span>✦</span>
                  <span className="text-emerald-900 font-bold text-xs">حُرُوفِ لِين کلماتِ مشق</span>
                  <span>✦</span>
                </div>
              </div>

              {/* Row 4 to Row 7 (20 words) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {PAGE_14_WAW_LEEN_WORDS.slice(15, 35).map((item) => {
                  const isWordActive = activeWordId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handlePlayWord(item)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between p-2 relative group shadow-sm select-none ${
                        isWordActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : 'bg-[#fffef8] hover:bg-emerald-50 border-emerald-600/80 hover:border-emerald-700 hover:shadow-md'
                      }`}
                    >
                      {/* Top Action Icons */}
                      <div className="w-full flex items-center justify-between text-[10px] text-zinc-400">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowMagneticGame(true); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 p-1 rounded-md text-[9px] hover:bg-amber-600"
                          title="مقناطیسی پزل میں کھولیں"
                        >
                          <Puzzle className="w-3 h-3" />
                        </button>
                        {item.isHeavyLetterIncluded ? (
                          <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold text-[9px]">پُر</span>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-sans">{item.letterCount} حرفی</span>
                        )}
                      </div>

                      {/* Crisp Calligraphy Word */}
                      <span className={`font-quran text-3xl sm:text-4xl font-bold tracking-normal leading-tight ${
                        item.isHeavyLetterIncluded ? 'text-sky-800' : 'text-zinc-950'
                      }`}>
                        {item.word}
                      </span>

                      {/* Syllable Breakdown */}
                      <span className="text-[11px] text-emerald-800 font-bold font-sans">
                        {item.breakdown}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Page Navigation & Helper */}
            <div className="mt-4 p-3 bg-[#f3ecda] rounded-2xl border border-emerald-600/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-700 font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>تجویدی مشورہ:</strong> کسی بھی کلمے پر کلک کر کے اس کا صوتی تلفظ سنیں، یا اوپر سے ہجے / روانی سوئچ کریں۔
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('page15')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>مشق یاء لین پر جائیں</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MASHQ YAA LEEN */}
      {/* ========================================================================= */}
      {activeTab === 'page15' && (
        <div className="space-y-4">
          
          {/* Authentic Qaida Yaa Leen Book Card */}
          <div className="bg-[#fffdf5] border-4 border-teal-700/80 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
            
            {/* Top Page Header Pill */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b-2 border-teal-600/40 pb-3">
              <div className="inline-flex items-center justify-center px-6 sm:px-10 py-1.5 rounded-full bg-white border-2 border-teal-700 text-teal-900 font-black shadow-sm text-base sm:text-xl">
                <span>مَشْق : </span>
                <span className="text-red-600 mr-2 font-bold font-quran text-xl sm:text-2xl">يَا لِين</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playPageSequence(15)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow border ${
                    isPlayingSequence
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-teal-700 hover:bg-teal-800 text-white border-teal-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>مکمل یاء لین سنیں</span>
                </button>
                <button
                  onClick={() => setShowMagneticGame(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow border border-amber-600"
                >
                  <Puzzle className="w-3.5 h-3.5" />
                  <span>پزل میں مشق کریں</span>
                </button>
                <span className="bg-teal-800 text-white px-3 py-1 rounded-full text-xs font-bold font-sans">
                  مشق یاء لین (۳۵ کلمات)
                </span>
              </div>
            </div>

            {/* Book Rule Summary Banner */}
            <div className="bg-[#f0faf9] border border-teal-600/50 rounded-2xl p-3 text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed flex items-center gap-2.5">
              <span className="text-red-600 text-base font-bold shrink-0">🪷</span>
              <p>
                <strong>قاعدہ:</strong> یاء ساکن سے پہلے زبر ہو تو یاء لین ہوگا۔ یاء لین کو <span className="text-teal-700 font-bold">بغیر کھینچے اور بغیر جھٹکا دیے نرمی سے معروف</span> پڑھیں۔
              </p>
            </div>

            {/* Exact 7-Row Grid from Page 15 */}
            <div className="space-y-3 pt-1">
              {/* Row 1 to Row 3 (15 words) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {PAGE_15_YAA_LEEN_WORDS.slice(0, 15).map((item) => {
                  const isWordActive = activeWordId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handlePlayWord(item)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between p-2 relative group shadow-sm select-none ${
                        isWordActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : 'bg-[#fffef8] hover:bg-teal-50 border-teal-600/80 hover:border-teal-700 hover:shadow-md'
                      }`}
                    >
                      {/* Top Action Icons */}
                      <div className="w-full flex items-center justify-between text-[10px] text-zinc-400">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowMagneticGame(true); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 p-1 rounded-md text-[9px] hover:bg-amber-600"
                          title="مقناطیسی پزل میں کھولیں"
                        >
                          <Puzzle className="w-3 h-3" />
                        </button>
                        {item.isHeavyLetterIncluded ? (
                          <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold text-[9px]">پُر</span>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-sans">{item.letterCount} حرفی</span>
                        )}
                      </div>

                      {/* Crisp Calligraphy Word */}
                      <span className={`font-quran text-3xl sm:text-4xl font-bold tracking-normal leading-tight ${
                        item.isHeavyLetterIncluded ? 'text-sky-800' : 'text-zinc-950'
                      }`}>
                        {item.word}
                      </span>

                      {/* Syllable Breakdown */}
                      <span className="text-[11px] text-teal-800 font-bold font-sans">
                        {item.breakdown}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Authentic Page Divider Line with Central Rosette (Matching Book Page 15) */}
              <div className="relative py-2 flex items-center justify-center">
                <div className="w-full border-t-2 border-teal-600/60"></div>
                <div className="absolute bg-[#fffdf5] px-4 text-red-600 text-sm font-bold flex items-center gap-1.5 font-sans">
                  <span>✦</span>
                  <span className="text-teal-900 font-bold text-xs">حُرُوفِ لِين کلماتِ مشق</span>
                  <span>✦</span>
                </div>
              </div>

              {/* Row 4 to Row 7 (20 words) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {PAGE_15_YAA_LEEN_WORDS.slice(15, 35).map((item) => {
                  const isWordActive = activeWordId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handlePlayWord(item)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between p-2 relative group shadow-sm select-none ${
                        isWordActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : item.hasBothLeen
                          ? 'bg-amber-50/80 hover:bg-amber-100 border-amber-400 hover:border-amber-600'
                          : 'bg-[#fffef8] hover:bg-teal-50 border-teal-600/80 hover:border-teal-700 hover:shadow-md'
                      }`}
                    >
                      {/* Top Action Icons */}
                      <div className="w-full flex items-center justify-between text-[10px] text-zinc-400">
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowMagneticGame(true); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-zinc-950 p-1 rounded-md text-[9px] hover:bg-amber-600"
                          title="مقناطیسی پزل میں کھولیں"
                        >
                          <Puzzle className="w-3 h-3" />
                        </button>
                        {item.hasBothLeen ? (
                          <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold text-[9px]">واؤ+یاء</span>
                        ) : item.isHeavyLetterIncluded ? (
                          <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-bold text-[9px]">پُر</span>
                        ) : (
                          <span className="text-[9px] text-zinc-400 font-sans">{item.letterCount} حرفی</span>
                        )}
                      </div>

                      {/* Crisp Calligraphy Word */}
                      <span className={`font-quran text-3xl sm:text-4xl font-bold tracking-normal leading-tight ${
                        item.isHeavyLetterIncluded ? 'text-sky-800' : 'text-zinc-950'
                      }`}>
                        {item.word}
                      </span>

                      {/* Syllable Breakdown */}
                      <span className="text-[11px] text-teal-800 font-bold font-sans">
                        {item.breakdown}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Bottom Page Navigation & Helper */}
            <div className="mt-4 p-3 bg-[#e8f7f5] rounded-2xl border border-teal-600/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-700 font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>تجویدی مشورہ:</strong> آخری دو کلمات (زَوْجَيْنِ اور حَوْلَيْنِ) میں واؤ لین اور یاء لین دونوں موجود ہیں۔
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('page14')}
                  className="bg-teal-800 hover:bg-teal-900 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>مشق واؤ لین پر جائیں</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN TAB: SINGLE UNIFIED LESSON BOARD (29 PAIRS) */}
      {/* ========================================================================= */}
      {activeTab === 'board' && (
        <div className="space-y-5">
          
          {/* Top Title Pill & Textbook Rules Box (Exact Match to Image 1) */}
          <div className="bg-[#fff9ea] border-2 border-emerald-600/70 rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden space-y-3.5">
            
            {/* Top Pill Header (Matching the green outline pill in the image) */}
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center px-6 sm:px-10 py-1.5 rounded-full bg-white border-2 border-emerald-600 text-emerald-800 font-black shadow-sm text-base sm:text-xl">
                <span>سبق نمبر (۵) : </span>
                <span className="text-red-600 mr-1.5 font-bold">حُرُوفِ لِين</span>
              </div>
            </div>

            {/* 4 Golden Rules with Fleurons (Matching the Book Text Exactly) */}
            <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-zinc-900 font-sans pr-1">
              
              {/* Rule 1 */}
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-sm sm:text-base font-bold shrink-0 mt-0.5">🪷</span>
                <p>
                  <span>حروفِ </span>
                  <strong className="text-red-600 font-arabic text-sm sm:text-base font-bold">لِین</strong>
                  <span> دو (۲) ہیں: </span>
                  <strong className="text-red-600 font-arabic text-sm sm:text-base font-bold">وَاو</strong>
                  <span> اور </span>
                  <strong className="text-red-600 font-arabic text-sm sm:text-base font-bold">یَا</strong>
                  <span> ۔</span>
                </p>
              </div>

              {/* Rule 2 */}
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-sm sm:text-base font-bold shrink-0 mt-0.5">🪷</span>
                <p>
                  <span>وَاو ساکن سے پہلے زبر ہو تو واؤ لین ہوگا جیسے </span>
                  <strong className="text-red-600 font-arabic text-base sm:text-lg font-black mx-1">جَوْ</strong>
                  <span> ، یا ساکن سے پہلے زبر ہو تو یا لین ہوگا جیسے </span>
                  <strong className="text-red-600 font-arabic text-base sm:text-lg font-black mx-1">جَيْ</strong>
                  <span> ۔</span>
                </p>
              </div>

              {/* Rule 3 */}
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-sm sm:text-base font-bold shrink-0 mt-0.5">🪷</span>
                <p>
                  <span>حروفِ لین کو </span>
                  <span className="text-sky-600 font-bold">بغیر کھینچے بغیر جھٹکا دیے نرمی سے معروف پڑھیں۔</span>
                </p>
              </div>

              {/* Rule 4 */}
              <div className="flex items-start gap-2">
                <span className="text-red-600 text-sm sm:text-base font-bold shrink-0 mt-0.5">🪷</span>
                <p>
                  <span>اس سبق میں بھی </span>
                  <span className="text-sky-600 font-bold">حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) اور راء کو ہر حال میں پُر (موٹا) پڑھیں۔</span>
                </p>
              </div>

            </div>

          </div>

          {/* Authentic Qaida Board with 29 Pairs */}
          <div className="bg-[#fffdf5] border-4 border-emerald-700/80 rounded-3xl p-3 sm:p-5 shadow-xl relative">
            
            {/* Header Columns Guide (واؤ لین vs یاء لین) */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mb-3 bg-emerald-900 text-white p-2 rounded-xl text-center text-xs font-bold font-sans">
              <span className="hidden sm:inline">حرف / واؤ لین</span>
              <span className="hidden sm:inline">حرف / یاء لین</span>
              <span className="hidden sm:inline">حرف / واؤ لین</span>
              <span className="hidden sm:inline">حرف / یاء لین</span>
              <span className="hidden sm:inline">حرف / واؤ لین</span>
              <span className="hidden sm:inline">حرف / یاء لین</span>
              <span className="sm:hidden col-span-1 text-amber-300">واؤ لین (ساکن مع زبر)</span>
              <span className="sm:hidden col-span-1 text-teal-300">یاء لین (ساکن مع زبر)</span>
            </div>

            {/* 29 Pairs in 6 columns grid on desktop, 2 columns on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
              {UNIFIED_HUROOF_LEEN_PAIRS.map((pair) => {
                const isPairActive = activePairId === pair.id;
                const isWawActive = activeCardId === pair.wawCard.id;
                const isYaaActive = activeCardId === pair.yaaCard.id;

                return (
                  <React.Fragment key={pair.id}>
                    {/* 1. Waw Leen Box (e.g. بَوْ) */}
                    <div
                      onClick={() => handlePlayCard(pair.wawCard)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center relative group select-none shadow-sm ${
                        isWawActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : isPairActive
                          ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-300'
                          : 'bg-[#fffef8] hover:bg-emerald-50/80 border-emerald-600/80 hover:border-emerald-700 hover:shadow-md'
                      }`}
                    >
                      {/* Pair sound trigger pill on hover */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlayPair(pair); }}
                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-800 text-white p-1 rounded-md text-[9px] font-sans hover:bg-emerald-950"
                        title="مکمل جوڑی سنیں"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>

                      {/* Pristine Connected Arabic Calligraphy */}
                      <div className="flex items-center justify-center pt-1">
                        <span
                          className={`font-quran text-3xl sm:text-4xl font-bold select-none leading-normal tracking-normal ${
                            pair.isHeavy ? 'text-sky-700' : 'text-zinc-950'
                          }`}
                          dir="rtl"
                        >
                          {pair.wawCard.displayLetter}
                        </span>
                      </div>

                      {/* Small letter name helper */}
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                        {pair.baseLetterName} (واؤ لین)
                      </span>
                    </div>

                    {/* 2. Yaa Leen Box (e.g. بَيْ) */}
                    <div
                      onClick={() => handlePlayCard(pair.yaaCard)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center relative group select-none shadow-sm ${
                        isYaaActive
                          ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                          : isPairActive
                          ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-300'
                          : 'bg-[#fffef8] hover:bg-emerald-50/80 border-emerald-600/80 hover:border-emerald-700 hover:shadow-md'
                      }`}
                    >
                      {/* Pair sound trigger pill on hover */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePlayPair(pair); }}
                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-800 text-white p-1 rounded-md text-[9px] font-sans hover:bg-emerald-950"
                        title="مکمل جوڑی سنیں"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>

                      {/* Pristine Connected Arabic Calligraphy */}
                      <div className="flex items-center justify-center pt-1">
                        <span
                          className={`font-quran text-3xl sm:text-4xl font-bold select-none leading-normal tracking-normal ${
                            pair.isHeavy ? 'text-sky-700' : 'text-zinc-950'
                          }`}
                          dir="rtl"
                        >
                          {pair.yaaCard.displayLetter}
                        </span>
                      </div>

                      {/* Small letter name helper */}
                      <span className="text-[10px] text-zinc-500 font-sans mt-0.5">
                        {pair.baseLetterName} (یاء لین)
                      </span>
                    </div>

                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Note & Explanation */}
            <div className="mt-4 p-3 bg-[#f3ecda] rounded-2xl border border-emerald-600/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-700 font-sans">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>تجویدی نکتہ:</strong> کسی بھی خانے پر کلک کر کے اس کا صوتی تلفظ سنیں، یا اوپر سے روانی/ہجے سوئچ کر کے مشق کریں۔
                </span>
              </div>
              <span className="bg-emerald-800 text-white px-2.5 py-1 rounded-full font-bold text-[11px]">
                کل حروف: ۵۸ خانے (۲۹ جوڑیاں)
              </span>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WORDS PRACTICE (۷۰ کلمات کی تفصیلی مشق) */}
      {/* ========================================================================= */}
      {activeTab === 'words' && (
        <div className="bg-white border-2 border-emerald-600/60 rounded-3xl p-4 sm:p-6 shadow-lg space-y-5">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="کلمہ تلاش کریں (مثلاً: سَوْفَ، بَيْتٍ، زَوْجَيْنِ)..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-white border border-zinc-300 focus:outline-none focus:border-emerald-600 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === 'all' ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
              >
                سب کلمات ({ALL_HUROOF_LEEN_WORDS.length})
              </button>
              <button
                onClick={() => setFilterType('heavy')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === 'heavy' ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
              >
                حروفِ مستعلیہ (پُر)
              </button>
              <button
                onClick={() => setFilterType('waw')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === 'waw' ? 'bg-emerald-700 text-white' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
              >
                واؤ لین کلمات
              </button>
              <button
                onClick={() => setFilterType('yaa')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterType === 'yaa' ? 'bg-teal-700 text-white' : 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                }`}
              >
                یاء لین کلمات
              </button>
            </div>
          </div>

          {/* 70 Practice Words Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ALL_HUROOF_LEEN_WORDS.filter(w => {
              if (filterType === 'heavy' && !w.isHeavyLetterIncluded) return false;
              if (filterType === 'waw' && w.leenType !== 'waw' && !w.hasBothLeen) return false;
              if (filterType === 'yaa' && w.leenType !== 'yaa' && !w.hasBothLeen) return false;
              if (searchQuery.trim()) {
                const q = searchQuery.trim().toLowerCase();
                return w.word.includes(q) || w.breakdown.includes(q) || w.spellingHijja.includes(q);
              }
              return true;
            }).map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handlePlayWord(item)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative group shadow-sm ${
                  activeWordId === item.id
                    ? 'bg-amber-300 border-amber-600 scale-105 shadow-xl ring-2 ring-amber-400 z-10'
                    : item.hasBothLeen
                    ? 'bg-amber-50 border-amber-400 hover:bg-amber-100 ring-1 ring-amber-300'
                    : item.leenType === 'waw'
                    ? 'bg-emerald-50/70 hover:bg-emerald-100 border-emerald-300 text-emerald-950'
                    : 'bg-teal-50/70 hover:bg-teal-100 border-teal-300 text-teal-950'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-1">
                  <span>#{idx + 1}</span>
                  {item.hasBothLeen ? (
                    <span className="text-[9px] bg-amber-300 text-zinc-950 px-1.5 py-0.2 rounded font-sans font-bold">
                      واؤ+یاء لین
                    </span>
                  ) : item.isHeavyLetterIncluded ? (
                    <span className="text-[9px] bg-sky-200 text-sky-950 px-1.5 py-0.2 rounded font-sans font-bold">
                      پُر
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-500 font-sans">
                      {item.leenType === 'waw' ? 'واؤ لین' : 'یاء لین'}
                    </span>
                  )}
                </div>
                
                <span className="text-2xl sm:text-3xl font-black my-1 text-zinc-950 font-quran">{item.word}</span>
                
                <div className="w-full pt-1.5 border-t border-zinc-200/60 mt-1 flex flex-col gap-0.5">
                  <span className="text-[11px] text-emerald-800 font-bold font-sans">{item.breakdown}</span>
                  {item.meaningOrContext && (
                    <span className="text-[9px] text-zinc-500 truncate font-sans">{item.meaningOrContext}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: RULES & TAJWEED NOTES */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="bg-white border-2 border-amber-500/60 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
          
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold">
              📜
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-900">سبق نمبر ۵ کے تفصیلی قواعد و تجوید</h3>
              <p className="text-xs text-zinc-500 font-sans">مستند علمائے کرام اور علم التجوید کے قواعد کے مطابق</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-2">
              <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <span className="text-lg">۱.</span>
                <span>واؤ لین (Waw Leen) کی تعریف</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
                {HUROOF_LEEN_RULES.definitionWaw}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs font-mono font-bold text-emerald-900 text-center">
                مثال: بَوْ ، جَوْ ، سَوْفَ ، خَوْفٍ
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-300 space-y-2">
              <h4 className="font-bold text-teal-950 text-sm flex items-center gap-2">
                <span className="text-lg">۲.</span>
                <span>یاء لین (Yaa Leen) کی تعریف</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-sans">
                {HUROOF_LEEN_RULES.definitionYaa}
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-teal-200 text-xs font-mono font-bold text-teal-900 text-center">
                مثال: بَيْ ، جَيْ ، بَيْتٍ ، قُرَيْشٍ
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>تقابلی جائزہ: حروفِ لین بمقابلہ حروفِ مدہ</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-right border-collapse border border-zinc-200 rounded-xl overflow-hidden font-sans">
                <thead className="bg-emerald-900 text-white font-bold">
                  <tr>
                    <th className="p-3 border border-emerald-800">قسم (Type)</th>
                    <th className="p-3 border border-emerald-800">شرط (Condition)</th>
                    <th className="p-3 border border-emerald-800">مثال (Example)</th>
                    <th className="p-3 border border-emerald-800">کھینچنے کی مقدار (Duration)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-zinc-50">
                  {HUROOF_LEEN_RULES.comparisonTable.map((row, i) => (
                    <tr key={i} className="hover:bg-amber-50">
                      <td className="p-3 font-bold text-emerald-950">{row.type}</td>
                      <td className="p-3 text-zinc-700">{row.condition}</td>
                      <td className="p-3 font-bold font-arabic text-base text-zinc-900">{row.example}</td>
                      <td className="p-3 font-semibold text-rose-800">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: QUIZ & EXAM */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="bg-white border-2 border-purple-500/60 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
          
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                🧠
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">حروفِ لین کا تجویدی کوئز</h3>
                <p className="text-xs text-zinc-500 font-sans">واؤ لین اور یاء لین کے قواعد کی آزمائش</p>
              </div>
            </div>
            <div className="bg-purple-100 text-purple-900 px-3 py-1 rounded-full font-bold text-xs border border-purple-300 font-sans">
              اسکور: {quizScore} پوائنٹس
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-sans">
              <span>سوال نمبر {quizIndex + 1} از {quizPool.length}</span>
              <span>درست جواب کے ۱۰ پوائنٹس</span>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <h4 className="text-base sm:text-lg font-black text-purple-950">
                {quizPool[quizIndex].question}
              </h4>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizPool[quizIndex].options.map((opt, idx) => {
                const isSelected = selectedQuizAnswer === opt;
                const isCorrect = opt === quizPool[quizIndex].correct;
                
                let btnStyle = 'bg-zinc-50 hover:bg-purple-50 border-zinc-200 text-zinc-900';
                if (selectedQuizAnswer !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 text-white border-rose-600';
                  } else {
                    btnStyle = 'bg-zinc-100 text-zinc-400 border-zinc-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedQuizAnswer !== null}
                    onClick={() => handleAnswerQuiz(opt)}
                    className={`p-3.5 rounded-2xl border-2 font-bold text-xs sm:text-sm text-right transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedQuizAnswer !== null && isCorrect && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {quizFeedback && (
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                quizFeedback.isCorrect ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className="text-xs sm:text-sm font-sans leading-relaxed">
                  <strong>{quizFeedback.isCorrect ? 'ماشاء اللہ درست جواب! 🎉 ' : 'غلط جواب! ❌ '}</strong>
                  <span>{quizFeedback.text}</span>
                </div>
                <button
                  onClick={nextQuizQuestion}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer"
                >
                  اگلا سوال ⬅️
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AUDIO MATCHING GAME */}
      {/* ========================================================================= */}
      {activeTab === 'game' && (
        <div className="bg-white border-2 border-rose-500/60 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
          
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                🎮
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900">حروفِ لین صوتی پہچان گیم</h3>
                <p className="text-xs text-zinc-500 font-sans">قاری صاحب کی آواز سن کر درست حرف پر کلک کریں</p>
              </div>
            </div>
            <div className="bg-rose-100 text-rose-900 px-3 py-1 rounded-full font-bold text-xs border border-rose-300 font-sans">
              اسکور: {gameScore} پوائنٹس
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-rose-50/60 rounded-3xl border border-rose-200 space-y-4">
            <button
              onClick={() => gameTarget && playQariText(gameTarget.rawSound)}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl transition-all cursor-pointer scale-100 hover:scale-105 active:scale-95"
              title="آواز دوبارہ سنیں"
            >
              <Volume2 className="w-8 h-8" />
            </button>
            <span className="text-xs font-bold text-rose-950 font-sans">
              آواز سنیں اور نیچے دیے گئے حروف میں سے درست حرف پر کلک کریں
            </span>
            {gameFeedback && (
              <div className="text-sm font-bold font-sans text-emerald-800 bg-white px-4 py-1.5 rounded-full border border-emerald-300 shadow-sm animate-bounce">
                {gameFeedback}
              </div>
            )}
          </div>

          {/* Cards for game */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {UNIFIED_ALL_LEEN_CARDS.map(card => (
              <button
                key={card.id}
                onClick={() => handleGameCardClick(card)}
                className="h-20 rounded-2xl bg-[#fffef8] hover:bg-amber-100 border-2 border-emerald-600 text-2xl sm:text-3xl font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer active:scale-95 font-quran"
                dir="rtl"
              >
                <span className={card.isHeavy ? 'text-sky-700' : 'text-zinc-950'}>
                  {card.displayLetter}
                </span>
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
