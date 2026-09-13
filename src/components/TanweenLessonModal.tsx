import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, 
  HelpCircle, RefreshCw, BookOpen, Layers, Search, Filter, AlertCircle, Award,
  Info, ChevronDown, ChevronUp, Check, Lightbulb, Gamepad2, Compass, Puzzle, Bookmark, Grid,
  ZoomIn, ZoomOut, Type
} from 'lucide-react';
import { 
  playQariText, 
  stopAllQariAudio, 
  playQuizFeedbackAudio, 
  playUrduText,
  playWordWithHijjaAndPronunciation 
} from '../utils/qariAudioService';
import {
  TANWEEN_TRIPLETS,
  SABAQ_8_ALL_84_CELLS,
  DO_ZABAR_MASHQ_WORDS,
  DO_ZER_MASHQ_WORDS,
  DO_PESH_MASHQ_WORDS,
  ALL_TANWEEN_MASHQ_WORDS,
  TANWEEN_EXAM_WORDS,
  TANWEEN_RULES,
  TanweenCell,
  TanweenTriplet,
  TanweenMashqWord,
  TanweenExamWord,
  TanweenHarakahType
} from '../data/tanweenData';
import { TanweenGameModal } from './TanweenGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';

interface TanweenLessonModalProps {
  onBack: () => void;
}

export const TanweenLessonModal: React.FC<TanweenLessonModalProps> = ({ onBack }) => {
  // Main Active Tab:
  // 'bookGrid' = اصل کتابی نقشہ (۲۸ ثلاثی قطاریں)
  // 'do_zabar' = مشق ۱: دو زبر
  // 'do_zer' = مشق ۲: دو زیر
  // 'do_pesh' = مشق ۳: دو پیش
  // 'allMashq' = تمام مشقی کلمات
  // 'imtihan' = امتحان برائے تنوین (۵۵ کلمات)
  // 'rules' = تجویدی قواعد
  // 'quiz' = کوئز و امتحان
  const [activeTab, setActiveTab] = useState<'bookGrid' | 'do_zabar' | 'do_zer' | 'do_pesh' | 'allMashq' | 'imtihan' | 'rules' | 'quiz'>('bookGrid');
  
  // Font Size
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Pronunciation mode:
  // 'rawani' = تَنْ ، تِنْ ، تُنْ (روانی)
  // 'hijja' = تا دو زبر تَنْ ، تا دو زیر تِنْ ، تا دو پیش تُنْ (ہجے)
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  
  const [filterType, setFilterType] = useState<'all' | 'heavy' | 'light' | 'do_zabar' | 'do_zer' | 'do_pesh'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showGameModal, setShowGameModal] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);

  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCellId, setActiveCellId] = useState<number | null>(null);
  const [activeTripletId, setActiveTripletId] = useState<number | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [activeExamWordId, setActiveExamWordId] = useState<number | null>(null);

  // Inspector details for the currently selected item
  const [selectedCell, setSelectedCell] = useState<TanweenCell | null>(null);
  const [selectedMashqWord, setSelectedMashqWord] = useState<TanweenMashqWord | null>(null);
  const [selectedExamWord, setSelectedExamWord] = useState<TanweenExamWord | null>(null);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswerState, setQuizAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllQariAudio();
    };
  }, []);

  // Filtered Mashq Words
  const filteredMashqWords = useMemo(() => {
    return ALL_TANWEEN_MASHQ_WORDS.filter(w => {
      if (filterType === 'heavy' && !w.isHeavy) return false;
      if (filterType === 'light' && w.isHeavy) return false;
      if (filterType === 'do_zabar' && w.category !== 'do_zabar') return false;
      if (filterType === 'do_zer' && w.category !== 'do_zer') return false;
      if (filterType === 'do_pesh' && w.category !== 'do_pesh') return false;
      
      if (searchQuery.trim()) {
        return w.word.includes(searchQuery.trim()) || w.spellingHijja.includes(searchQuery.trim());
      }
      return true;
    });
  }, [filterType, searchQuery]);

  // Filtered Exam Words
  const filteredExamWords = useMemo(() => {
    return TANWEEN_EXAM_WORDS.filter(w => {
      if (filterType === 'do_zabar' && w.primaryTanweenType !== 'do_zabar') return false;
      if (filterType === 'do_zer' && w.primaryTanweenType !== 'do_zer') return false;
      if (filterType === 'do_pesh' && w.primaryTanweenType !== 'do_pesh') return false;
      if (searchQuery.trim()) {
        return w.word.includes(searchQuery.trim()) || w.spellingHijja.includes(searchQuery.trim());
      }
      return true;
    });
  }, [filterType, searchQuery]);

  // Sound handler for individual cell (تًا ، تٍ ، تٌ)
  const handlePlayCell = async (cell: TanweenCell, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isMuted) return;

    setActiveCellId(cell.id);
    setSelectedCell(cell);
    setSelectedMashqWord(null);
    setSelectedExamWord(null);

    try {
      if (pronunciationMode === 'hijja') {
        await playUrduText(cell.spellingHijja);
        await new Promise(r => setTimeout(r, 200));
        await playQariText(cell.soundText);
      } else {
        await playQariText(cell.soundText);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sound handler for complete Triplet (Row of 3: Do Zabar, Do Zer, Do Pesh)
  const handlePlayTriplet = async (triplet: TanweenTriplet) => {
    if (isMuted) return;
    setActiveTripletId(triplet.id);
    
    try {
      // 1. Do Zabar
      setActiveCellId(triplet.doZabar.id);
      setSelectedCell(triplet.doZabar);
      await playQariText(triplet.doZabar.soundText);
      await new Promise(r => setTimeout(r, 350));

      // 2. Do Zer
      setActiveCellId(triplet.doZer.id);
      setSelectedCell(triplet.doZer);
      await playQariText(triplet.doZer.soundText);
      await new Promise(r => setTimeout(r, 350));

      // 3. Do Pesh
      setActiveCellId(triplet.doPesh.id);
      setSelectedCell(triplet.doPesh);
      await playQariText(triplet.doPesh.soundText);
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(err);
    } finally {
      setActiveCellId(null);
      setActiveTripletId(null);
    }
  };

  // Sound handler for Mashq Word
  const handlePlayMashqWord = async (word: TanweenMashqWord) => {
    if (isMuted) return;
    setActiveWordId(word.id);
    setSelectedMashqWord(word);
    setSelectedCell(null);
    setSelectedExamWord(null);

    try {
      if (pronunciationMode === 'hijja') {
        await playWordWithHijjaAndPronunciation(word.spellingHijja, word.word);
      } else {
        await playQariText(word.word);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sound handler for Exam Word
  const handlePlayExamWord = async (word: TanweenExamWord) => {
    if (isMuted) return;
    setActiveExamWordId(word.id);
    setSelectedExamWord(word);
    setSelectedCell(null);
    setSelectedMashqWord(null);

    try {
      if (pronunciationMode === 'hijja') {
        await playWordWithHijjaAndPronunciation(word.spellingHijja, word.word);
      } else {
        await playQariText(word.word);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sequence player
  const playSequence = async () => {
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveCellId(null);
      setActiveWordId(null);
      setActiveExamWordId(null);
      return;
    }

    setIsPlayingSequence(true);

    if (activeTab === 'bookGrid') {
      for (const triplet of TANWEEN_TRIPLETS) {
        if (!isPlayingSequence) break;
        await handlePlayTriplet(triplet);
        await new Promise(r => setTimeout(r, 400));
      }
    } else if (activeTab === 'imtihan') {
      for (const w of TANWEEN_EXAM_WORDS) {
        if (!isPlayingSequence) break;
        setActiveExamWordId(w.id);
        setSelectedExamWord(w);
        await playQariText(w.word);
        await new Promise(r => setTimeout(r, 600));
      }
    } else {
      const list = activeTab === 'do_zabar' 
        ? DO_ZABAR_MASHQ_WORDS 
        : activeTab === 'do_zer' 
        ? DO_ZER_MASHQ_WORDS 
        : activeTab === 'do_pesh' 
        ? DO_PESH_MASHQ_WORDS 
        : filteredMashqWords;

      for (const w of list) {
        if (!isPlayingSequence) break;
        setActiveWordId(w.id);
        setSelectedMashqWord(w);
        await playQariText(w.word);
        await new Promise(r => setTimeout(r, 600));
      }
    }

    setIsPlayingSequence(false);
    setActiveCellId(null);
    setActiveWordId(null);
    setActiveExamWordId(null);
  };

  // Dynamic Font Class
  const fontClass = fontSize === 'xlarge' 
    ? 'text-4xl sm:text-5xl md:text-6xl' 
    : fontSize === 'large' 
    ? 'text-3xl sm:text-4xl md:text-5xl' 
    : 'text-2xl sm:text-3xl md:text-4xl';

  // Quiz Questions for Lesson 8
  const quizQuestions = [
    {
      q: 'دو زبر ( ً )، دو زیر ( ٍ ) اور دو پیش ( ٌ ) کو کیا کہتے ہیں؟',
      options: ['حرکات', 'تنوین', 'حروفِ مدہ', 'حروفِ لین'],
      correct: 1,
      hint: 'جس حرف پر یہ علامتیں ہوں اسے مُنَوَّن کہتے ہیں اور اس میں نون ساکن کی آواز ہوتی ہے۔'
    },
    {
      q: 'تنوین کی آواز کس کے مشابہ ہوتی ہے؟',
      options: ['میم ساکن', 'نون ساکن', 'الف مدہ', 'واؤ لین'],
      correct: 1,
      hint: 'جیسے: اً = اَنْ ، اٍ = اِنْ ، اٌ = اُنْ'
    },
    {
      q: 'دو زبر کے بعد لکھے جانے والے "الف" یا "یاء" کے متعلق کیا قاعدہ ہے؟',
      options: ['الف کو ۲ سیکنڈ کھینچیں گے', 'الف لکھا جاتا ہے مگر پڑھا نہیں جاتا', 'الف پر مد لگائیں گے', 'الف کو نون پڑھیں گے'],
      correct: 1,
      hint: 'ہجے اور روانی کرتے وقت الف یا یاء کا نام بالکل نہیں لیا جاتا۔'
    },
    {
      q: 'کلمہ "خَوْفًا" میں فا پر کون سی تنوین ہے؟',
      options: ['دو زیر', 'دو پیش', 'دو زبر', 'کھڑا زبر'],
      correct: 2,
      hint: 'فا کے اوپر دو ترچھی لکیریں ( ً ) ہیں = فا دو زبر فَنْ۔'
    },
    {
      q: 'کلمہ "نُوْرٌ" میں راء کو کیسا پڑھا جائے گا؟',
      options: ['باریک', 'پُر (موٹا)', 'غنہ کے ساتھ', 'کھینچ کر'],
      correct: 1,
      hint: 'راء پر دو پیش ہے، اور راء پر زبر یا پیش ہو تو وہ ہمیشہ موٹی پڑھی جاتی ہے۔'
    }
  ];

  const handleQuizAnswer = (optionIdx: number) => {
    if (quizAnswerState !== 'idle') return;
    const isCorrect = optionIdx === quizQuestions[currentQuizIndex].correct;
    if (isCorrect) {
      setQuizAnswerState('correct');
      setQuizScore(s => s + 10);
      playQuizFeedbackAudio(true);
    } else {
      setQuizAnswerState('wrong');
      playQuizFeedbackAudio(false);
    }
  };

  const nextQuizQuestion = () => {
    setQuizAnswerState('idle');
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(i => i + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden text-slate-100 font-urdu" dir="rtl">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl overflow-hidden">
        
        {/* =========================================================================
            TOP HEADER & NAVIGATION BAR
        ========================================================================= */}
        <header className="px-2.5 sm:px-6 py-2 sm:py-3.5 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            
            {/* Top Bar for Mobile / Right/Left for Desktop */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 shrink-0">
              {/* 1. Back Button - ALWAYS VISIBLE */}
              <button
                onClick={() => {
                  stopAllQariAudio();
                  onBack();
                }}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
                title="واپسی"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>

              {/* Action Buttons on Mobile */}
              <div className="flex md:hidden items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowGameModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-black text-xs flex items-center gap-1 shadow-md active:scale-95 cursor-pointer"
                  title="صوتی و بصری گیم زون"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-zinc-950" />
                  <span className="font-urdu">گیمز 🎯</span>
                </button>

                <button
                  onClick={() => setShowPuzzleModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs flex items-center gap-1 shadow-md active:scale-95 cursor-pointer border border-purple-400/40"
                  title="حروف و تنوین مقناطیسی پزل گیم"
                >
                  <Puzzle className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="font-urdu">پزل 🧩</span>
                </button>

                <button
                  onClick={() => {
                    if (isPlayingSequence) {
                      stopAllQariAudio();
                      setIsPlayingSequence(false);
                    }
                    setIsMuted(!isMuted);
                  }}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-rose-950/60 border-rose-700 text-rose-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                  title={isMuted ? 'آواز آن کریں' : 'میوٹ کریں'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* 2. Header Title & Badge */}
            <div className="flex flex-col items-center text-center min-w-0 px-1 my-0.5 md:my-0">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm whitespace-nowrap">
                  سبق نمبر ۸
                </span>
                <h1 className="text-xs sm:text-base md:text-xl font-black text-white font-urdu tracking-tight text-center">
                  تَنْوِیْن : دو زبر ً ، دو زیر ٍ ، دو پیش ٌ
                </h1>
              </div>
              <span className="text-[10px] sm:text-xs text-amber-400/90 font-urdu hidden xs:inline-block mt-0.5">
                تنوین نون ساکن کی آواز میں ادا کی جاتی ہے • جس حرف پر ہو اسے مُنَوَّن کہتے ہیں
              </span>
            </div>

            {/* 3. Action Buttons on Desktop */}
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShowGameModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
                title="صوتی و بصری گیم زون"
              >
                <Gamepad2 className="w-4 h-4 text-zinc-950" />
                <span className="font-urdu">گیم زون 🎯</span>
              </button>

              <button
                onClick={() => setShowPuzzleModal(true)}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer border border-purple-400/40"
                title="حروف و تنوین مقناطیسی پزل گیم"
              >
                <Puzzle className="w-4 h-4 text-yellow-300" />
                <span className="font-urdu">پزل 🧩</span>
              </button>

              <button
                onClick={() => {
                  if (isPlayingSequence) {
                    stopAllQariAudio();
                    setIsPlayingSequence(false);
                  }
                  setIsMuted(!isMuted);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isMuted 
                    ? 'bg-rose-950/60 border-rose-700 text-rose-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'آواز آن کریں' : 'میوٹ کریں'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>

          </div>

          {/* Quick Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 sm:pt-3 text-xs font-urdu font-bold">
            <button
              onClick={() => setActiveTab('bookGrid')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'bookGrid'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>اصل کتابی تختی (۲۸ حروف)</span>
            </button>

            <button
              onClick={() => setActiveTab('do_zabar')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'do_zabar'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>مشق ۱ : دو زبر ( ً )</span>
            </button>

            <button
              onClick={() => setActiveTab('do_zer')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'do_zer'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>مشق ۲ : دو زیر ( ٍ )</span>
            </button>

            <button
              onClick={() => setActiveTab('do_pesh')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'do_pesh'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <span>مشق ۳ : دو پیش ( ٌ )</span>
            </button>

            <button
              onClick={() => setActiveTab('imtihan')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'imtihan'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-black ring-2 ring-emerald-300'
                  : 'bg-slate-800/80 text-emerald-300 hover:bg-slate-750'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>امتحان برائے تنوین (۵۵ کلمات)</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'rules'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>تجویدی قواعد</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'quiz'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>کوئز و امتحان</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
            MAIN CONTENT AREA
        ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">

          {/* Controls Bar: Sequence Play, Pronunciation Mode, Zoom */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-950/70 p-2.5 sm:p-3 rounded-2xl border border-slate-800 shadow-inner">
            
            {/* Left: Play Sequence & Audio Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={playSequence}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlayingSequence
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="font-urdu">{isPlayingSequence ? 'توقف (Stop)' : 'مکمل سماعت (Play All)'}</span>
              </button>

              <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800 text-xs font-urdu font-bold">
                <button
                  onClick={() => setPronunciationMode('rawani')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    pronunciationMode === 'rawani'
                      ? 'bg-amber-500 text-zinc-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  روانی
                </button>
                <button
                  onClick={() => setPronunciationMode('hijja')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    pronunciationMode === 'hijja'
                      ? 'bg-amber-500 text-zinc-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ہجے
                </button>
              </div>
            </div>

            {/* Right: Font Zoom & Search */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'normal' ? 'bg-amber-500 text-zinc-950' : 'text-slate-400 hover:text-white'}`}
                  title="چھوٹا فونٹ"
                >
                  <Type className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'large' ? 'bg-amber-500 text-zinc-950' : 'text-slate-400 hover:text-white'}`}
                  title="درمیانہ فونٹ"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${fontSize === 'xlarge' ? 'bg-amber-500 text-zinc-950' : 'text-slate-400 hover:text-white'}`}
                  title="بڑا فونٹ"
                >
                  <ZoomIn className="w-4 h-4 font-black" />
                </button>
              </div>
            </div>

          </div>

          {/* =========================================================================
              TAB 1: اصل کتابی نقشہ (۲۸ ثلاثی قطاریں)
          ========================================================================= */}
          {activeTab === 'bookGrid' && (
            <div className="space-y-4">
              
              {/* Header explanation rule banner */}
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📖</span>
                  <div>
                    <h3 className="font-urdu font-black text-amber-300 text-sm sm:text-base">
                      تنوین کی تقابلی تختی (دو زبر ، دو زیر ، دو پیش)
                    </h3>
                    <p className="font-urdu text-xs text-slate-300 mt-0.5">
                      کسی بھی خانے پر کلک کر کے قاری کی آواز سنیں، یا قطار پر کلک کر کے تینوں کی مسلسل روانی سنیں۔
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-urdu bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  کل حروف: ۲۸ ثلاثی (۸۴ اشکال)
                </span>
              </div>

              {/* Responsive Grid of Triplets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {TANWEEN_TRIPLETS.map((triplet) => {
                  const isTripletActive = activeTripletId === triplet.id;

                  return (
                    <div
                      key={triplet.id}
                      className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col justify-between bg-slate-900/90 shadow-md ${
                        isTripletActive 
                          ? 'border-amber-400 ring-2 ring-amber-400/40 bg-slate-850 scale-[1.02]' 
                          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850/80'
                      }`}
                    >
                      {/* Triplet Header: Letter Name & Makhraj Badge */}
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80 text-xs font-urdu">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-amber-400 text-sm">{triplet.letter} ({triplet.letterUrdu})</span>
                          {triplet.isHeavy && (
                            <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 py-0.5 rounded font-black border border-rose-500/30">
                              پُر (موٹا)
                            </span>
                          )}
                          {triplet.isWhistle && (
                            <span className="bg-yellow-500/20 text-yellow-300 text-[9px] px-1.5 py-0.5 rounded font-black border border-yellow-500/30">
                              سیٹی
                            </span>
                          )}
                          {triplet.isSoft && (
                            <span className="bg-teal-500/20 text-teal-300 text-[9px] px-1.5 py-0.5 rounded font-black border border-teal-500/30">
                              نرم
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handlePlayTriplet(triplet)}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-zinc-950 text-slate-300 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                          title="تینوں کی روانی سنیں"
                        >
                          <Play className="w-2.5 h-2.5" />
                          <span>سلسلہ</span>
                        </button>
                      </div>

                      {/* 3 Cells in Row: [Do Zabar | Do Zer | Do Pesh] */}
                      <div className="grid grid-cols-3 gap-2 text-center" dir="rtl">
                        
                        {/* 1. Do Zabar */}
                        <button
                          onClick={(e) => handlePlayCell(triplet.doZabar, e)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            activeCellId === triplet.doZabar.id
                              ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-lg scale-105'
                              : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-100'
                          }`}
                        >
                          <span className={`font-arabic font-bold ${fontClass}`}>
                            {triplet.doZabar.word}
                          </span>
                          <span className="text-[9px] font-urdu text-amber-400/80 mt-1">
                            دو زبر
                          </span>
                        </button>

                        {/* 2. Do Zer */}
                        <button
                          onClick={(e) => handlePlayCell(triplet.doZer, e)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            activeCellId === triplet.doZer.id
                              ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-lg scale-105'
                              : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-100'
                          }`}
                        >
                          <span className={`font-arabic font-bold ${fontClass}`}>
                            {triplet.doZer.word}
                          </span>
                          <span className="text-[9px] font-urdu text-amber-400/80 mt-1">
                            دو زیر
                          </span>
                        </button>

                        {/* 3. Do Pesh */}
                        <button
                          onClick={(e) => handlePlayCell(triplet.doPesh, e)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                            activeCellId === triplet.doPesh.id
                              ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-lg scale-105'
                              : 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-100'
                          }`}
                        >
                          <span className={`font-arabic font-bold ${fontClass}`}>
                            {triplet.doPesh.word}
                          </span>
                          <span className="text-[9px] font-urdu text-amber-400/80 mt-1">
                            دو پیش
                          </span>
                        </button>

                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: مشق ۱ (دو زبر)
          ========================================================================= */}
          {activeTab === 'do_zabar' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="font-urdu font-black text-amber-300 text-sm sm:text-base">
                    مشق ۱ : دو زبر ( ً ) کے ۲۵ قرآنی کلمات
                  </h3>
                  <p className="font-urdu text-xs text-slate-300">
                    دو زبر کے بعد الف لکھا جاتا ہے پڑھا نہیں جاتا، تنوین کو نون ساکن کی آواز میں معروف پڑھیں۔
                  </p>
                </div>
                <span className="text-xs font-urdu bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  ۲۵ کلمات
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                {DO_ZABAR_MASHQ_WORDS.map((item) => {
                  const isActive = activeWordId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePlayMashqWord(item)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-xl scale-105 ring-2 ring-amber-300'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-100 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <span className={`font-arabic font-bold leading-relaxed ${fontClass}`}>
                        {item.word}
                      </span>
                      <span className="text-[10px] font-urdu text-slate-400 mt-1 truncate max-w-full">
                        {item.spellingHijja.split('=')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: مشق ۲ (دو زیر)
          ========================================================================= */}
          {activeTab === 'do_zer' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="font-urdu font-black text-amber-300 text-sm sm:text-base">
                    مشق ۲ : دو زیر ( ٍ ) کے ۲۵ قرآنی کلمات
                  </h3>
                  <p className="font-urdu text-xs text-slate-300">
                    دو زیر کو تنوین کہتے ہیں، دو زیر کی تنوین نون ساکن کی آواز میں بغیر جھٹکے کے ادا کریں۔
                  </p>
                </div>
                <span className="text-xs font-urdu bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  ۲۵ کلمات
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                {DO_ZER_MASHQ_WORDS.map((item) => {
                  const isActive = activeWordId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePlayMashqWord(item)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-xl scale-105 ring-2 ring-amber-300'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-100 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <span className={`font-arabic font-bold leading-relaxed ${fontClass}`}>
                        {item.word}
                      </span>
                      <span className="text-[10px] font-urdu text-slate-400 mt-1 truncate max-w-full">
                        {item.spellingHijja.split('=')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: مشق ۳ (دو پیش)
          ========================================================================= */}
          {activeTab === 'do_pesh' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <h3 className="font-urdu font-black text-amber-300 text-sm sm:text-base">
                    مشق ۳ : دو پیش ( ٌ ) کے ۲۵ قرآنی کلمات
                  </h3>
                  <p className="font-urdu text-xs text-slate-300">
                    دو پیش کو تنوین کہتے ہیں، دونوں ہونٹوں کو گول کر کے نون ساکن کی آواز ادا کریں۔
                  </p>
                </div>
                <span className="text-xs font-urdu bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                  ۲۵ کلمات
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                {DO_PESH_MASHQ_WORDS.map((item) => {
                  const isActive = activeWordId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePlayMashqWord(item)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-xl scale-105 ring-2 ring-amber-300'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-100 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <span className={`font-arabic font-bold leading-relaxed ${fontClass}`}>
                        {item.word}
                      </span>
                      <span className="text-[10px] font-urdu text-slate-400 mt-1 truncate max-w-full">
                        {item.spellingHijja.split('=')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: امتحان برائے تنوین (۵۵ کلمات)
          ========================================================================= */}
          {activeTab === 'imtihan' && (
            <div className="space-y-4">
              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <h3 className="font-urdu font-black text-emerald-300 text-sm sm:text-base flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>امتحان برائے تنوین و جملہ حرکات (۵۵ جامع قرآنی کلمات)</span>
                  </h3>
                  <p className="font-urdu text-xs text-slate-300 mt-0.5">
                    تنوین، حروفِ مدہ، حروفِ لین اور کھڑی حرکات کے مشترکہ کلمات کی مکمل آزمائش اور مشق۔
                  </p>
                </div>
                <span className="text-xs font-urdu bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30">
                  ۱۱ قطاریں • ۵۵ کلمات
                </span>
              </div>

              {/* 11 Rows Table / Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3" dir="rtl">
                {filteredExamWords.map((item) => {
                  const isActive = activeExamWordId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handlePlayExamWord(item)}
                      className={`p-3 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-300 shadow-xl scale-105 ring-2 ring-emerald-300'
                          : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-100 hover:border-slate-700 shadow-md'
                      }`}
                    >
                      <span className={`font-arabic font-bold leading-relaxed ${fontClass}`}>
                        {item.word}
                      </span>
                      <span className="text-[10px] font-urdu text-slate-400 mt-1 truncate max-w-full">
                        {item.spellingHijja.split('=')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: تجویدی قواعد (TANWEEN RULES)
          ========================================================================= */}
          {activeTab === 'rules' && (
            <div className="space-y-4 max-w-4xl mx-auto" dir="rtl">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                <h3 className="font-urdu font-black text-amber-300 text-base sm:text-lg mb-1">
                  سبق نمبر ۸ کے بنیادی تجویدی قواعد و رہنمائی
                </h3>
                <p className="font-urdu text-xs sm:text-sm text-slate-300">
                  بچوں اور طلباء کو تنوین سکھاتے وقت درج ذیل تجویدی نکات کا خصوصی خیال رکھیں۔
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TANWEEN_RULES.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{r.icon}</span>
                      <h4 className="font-urdu font-black text-amber-300 text-sm sm:text-base">{r.title}</h4>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-urdu text-xs text-amber-200/90 font-bold">
                      {r.summary}
                    </div>
                    <p className="font-urdu text-xs text-slate-300 leading-relaxed">
                      {r.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: کوئز و امتحان (QUIZ & TEST)
          ========================================================================= */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-4" dir="rtl">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                
                {/* Quiz Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="font-urdu font-bold text-slate-200">
                      سوال {currentQuizIndex + 1} از {quizQuestions.length}
                    </span>
                  </div>
                  <div className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-urdu font-black border border-amber-500/30">
                    اسکور: {quizScore} پوائنٹس
                  </div>
                </div>

                {/* Question */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
                  <p className="font-urdu font-bold text-sm sm:text-base text-slate-100">
                    {quizQuestions[currentQuizIndex].q}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {quizQuestions[currentQuizIndex].options.map((opt, idx) => {
                    const isSelected = quizAnswerState !== 'idle';
                    const isCorrect = idx === quizQuestions[currentQuizIndex].correct;

                    let btnStyle = 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700';
                    if (isSelected) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-400 shadow-lg';
                      } else {
                        btnStyle = 'bg-slate-800 text-slate-500 border-slate-800 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        disabled={quizAnswerState !== 'idle'}
                        className={`p-3 rounded-xl border font-urdu font-bold text-xs sm:text-sm text-right transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="ml-2 font-mono text-amber-400 font-bold">{idx + 1}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Next */}
                {quizAnswerState !== 'idle' && (
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <p className={`font-urdu text-xs font-bold ${quizAnswerState === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {quizAnswerState === 'correct' ? '✅ ماشاءاللہ! بالکل درست جواب۔' : '❌ جواب درست نہیں۔ اگلی کوشش میں توجہ دیں۔'}
                    </p>
                    <p className="font-urdu text-[11px] text-slate-400">
                      💡 نکتہ: {quizQuestions[currentQuizIndex].hint}
                    </p>
                    <button
                      onClick={nextQuizQuestion}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-urdu font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      اگلا سوال ←
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>

        {/* =========================================================================
            BOTTOM ACTIVE INSPECTOR DRAWER (DETAILS OF CURRENTLY SELECTED ITEM)
        ========================================================================= */}
        {(selectedCell || selectedMashqWord || selectedExamWord) && (
          <footer className="border-t border-slate-800 bg-slate-950/95 p-3 sm:p-4 text-xs font-urdu shadow-2xl transition-all">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3" dir="rtl">
              
              {/* Selected Cell or Word details */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500 text-zinc-950 font-arabic font-black text-2xl sm:text-3xl shadow-inner shrink-0 min-w-[50px] text-center">
                  {selectedCell?.word || selectedMashqWord?.word || selectedExamWord?.word}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-300 text-sm">
                      {selectedCell?.harakahUrdu || selectedMashqWord?.categoryLabelUrdu || 'تنوین'}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {selectedCell?.spellingHijja || selectedMashqWord?.spellingHijja || selectedExamWord?.spellingHijja}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] truncate">
                    💡 {selectedCell?.tajweedRule || selectedMashqWord?.tajweedNote || selectedExamWord?.tajweedRule}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (selectedCell) handlePlayCell(selectedCell);
                    else if (selectedMashqWord) handlePlayMashqWord(selectedMashqWord);
                    else if (selectedExamWord) handlePlayExamWord(selectedExamWord);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>دوبارہ سنیں</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCell(null);
                    setSelectedMashqWord(null);
                    setSelectedExamWord(null);
                  }}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  title="بند کریں"
                >
                  ✕
                </button>
              </div>

            </div>
          </footer>
        )}

      </div>

      {/* =========================================================================
          GAME MODAL (سبق نمبر ۸ گیم زون)
      ========================================================================= */}
      {showGameModal && (
        <TanweenGameModal onBack={() => setShowGameModal(false)} />
      )}

      {showPuzzleModal && (
        <MurakkabatPuzzleGameModal
          initialGameMode="tanween"
          onBack={() => setShowPuzzleModal(false)}
        />
      )}

    </div>
  );
};
