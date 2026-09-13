import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, 
  HelpCircle, RefreshCw, BookOpen, Layers, Search, Filter, AlertCircle, Award,
  Info, ChevronDown, ChevronUp, Check, Lightbulb, Gamepad2, Compass, Puzzle, Bookmark, Grid,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Type
} from 'lucide-react';
import { playQariText, stopAllQariAudio, playQuizFeedbackAudio, playUrduText, playWordWithHijjaAndPronunciation } from '../utils/qariAudioService';
import { 
  HUROOF_MADDAH_RULES, 
  SABAQ_7_TRIPLETS,
  SABAQ_7_ALL_84_CELLS,
  Sabaq7BookCell,
  Sabaq7Triplet,
  ALIF_MADDAH_29_PAIRS,
  WAW_MADDAH_29_PAIRS,
  YAA_MADDAH_29_PAIRS,
  PAGE_16_ALIF_MASHQ_WORDS,
  PAGE_17_WAW_MASHQ_WORDS,
  PAGE_18_YAA_MASHQ_WORDS,
  ALL_MADDAH_MASHQ_WORDS,
  MaddahPairItem,
  MaddahMashqWord,
  MaddahType
} from '../data/huroofMaddahData';
import { HuroofMaddahGameModal } from './HuroofMaddahGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { Page20ImtihanView } from './Page20ImtihanView';

interface HuroofMaddahLessonModalProps {
  onBack: () => void;
}

export const HuroofMaddahLessonModal: React.FC<HuroofMaddahLessonModalProps> = ({ onBack }) => {
  // Main Active Tab:
  // 'bookGrid' = اصل کتابی ترتیب (حروفِ مدہ مکمل جدول : ۱۴ سطریں × ۶ خانے = ۸۴ حروفِ مدہ)
  // 'alif' = الف مدہ + ۳۰ مشقی کلمات
  // 'waw' = واؤ مدہ + ۳۰ مشقی کلمات
  // 'yaa' = یاء مدہ + ۲۵ مشقی کلمات
  // 'allMashq' = تمام قرآنی و مشقی کلمات
  // 'imtihan' = جامع امتحان (۵۰ کلمات)
  // 'rules' = تجویدی قواعد
  // 'quiz' = ٹیسٹ کوئز
  const [activeTab, setActiveTab] = useState<'bookGrid' | 'alif' | 'waw' | 'yaa' | 'allMashq' | 'imtihan' | 'rules' | 'quiz'>('bookGrid');
  
  // Font Size for Reading Comfort (پڑھنے میں سہولت)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Pronunciation mode:
  // 'rawani' = بَا ، بُوْ ، بِيْ
  // 'hijja' = با الف زبر بَا ، با واؤ پیش بُوْ ، با یا زیر بِيْ
  // 'compare' = بَ بَا ، بُ بُوْ ، بِ بِيْ
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja' | 'compare'>('rawani');
  
  const [filterType, setFilterType] = useState<'all' | 'heavy' | 'light' | 'short' | 'compound'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showGameModal, setShowGameModal] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);

  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCellId, setActiveCellId] = useState<string | null>(null);
  const [activeTripletId, setActiveTripletId] = useState<string | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);

  // Inspector details for the currently selected item
  const [selectedCell, setSelectedCell] = useState<Sabaq7BookCell | null>(null);
  const [selectedWord, setSelectedWord] = useState<MaddahMashqWord | null>(null);

  // Section visibility in book view
  const [showRulesBanner, setShowRulesBanner] = useState(true);
  const [bookMashqSection, setBookMashqSection] = useState<'all' | 'alif' | 'waw' | 'yaa'>('all');

  // Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);

  // 14 Rows Structured from the 28 Triplets
  const structuredRows = useMemo(() => {
    const rows = [];
    for (let r = 0; r < 14; r++) {
      const trip1 = SABAQ_7_TRIPLETS[r * 2];
      const trip2 = SABAQ_7_TRIPLETS[r * 2 + 1];
      if (trip1 && trip2) {
        rows.push({
          rowNumber: r + 1,
          trip1,
          trip2,
          cells: [trip1.alifCell, trip1.wawCell, trip1.yaaCell, trip2.alifCell, trip2.wawCell, trip2.yaaCell]
        });
      }
    }
    return rows;
  }, []);

  // Stop audio on tab switch or unmount
  useEffect(() => {
    stopAllQariAudio();
    setIsPlayingSequence(false);
    setActiveCellId(null);
    setActiveTripletId(null);
    setActiveWordId(null);
    setActiveAudioText(null);
  }, [activeTab]);

  // Quiz Questions Pool
  const quizPool = useMemo(() => {
    return [
      {
        question: 'حروفِ مدہ کل کتنے ہیں؟',
        correct: 'تین (۳): الف مدہ ، واؤ مدہ ، اور یاء مدہ',
        options: [
          'تین (۳): الف مدہ ، واؤ مدہ ، اور یاء مدہ',
          'دو (۲): واؤ اور یاء',
          'چار (۴): زبر، زیر، پیش، جزم',
          'سات (۷): حروفِ مستعلیہ'
        ],
        explanation: 'حروفِ مدہ تین ہیں: خالی الف سے پہلے زبر ہو، واؤ ساکن سے پہلے پیش ہو، یاء ساکن سے پہلے زیر ہو۔'
      },
      {
        question: 'الف مدہ کب ہوتا ہے؟',
        correct: 'الف سے پہلے حرف پر زبر آئے جیسے بَ + ا = بَا',
        options: [
          'الف سے پہلے حرف پر زبر آئے جیسے بَ + ا = بَا',
          'الف پر جزم ہو جیسے اْ',
          'الف کے نیچے زیر ہو جیسے اِ',
          'الف سے پہلے پیش ہو جیسے اُ'
        ],
        explanation: 'الف سے پہلے حرف پر زبر آئے تو الف مدہ ہوگا، ایک الف کے برابر کھینچ کر پڑھیں جیسے بَا ، کَانَ ، قَالَ ۔'
      },
      {
        question: 'واؤ مدہ کب بنتا ہے؟',
        correct: 'واؤ ساکن (وْ) سے پہلے حرف پر پیش آئے جیسے اُ + وْ = اُوْ',
        options: [
          'واؤ ساکن (وْ) سے پہلے حرف پر پیش آئے جیسے اُ + وْ = اُوْ',
          'واؤ ساکن سے پہلے زبر آئے جیسے بَوْ',
          'واؤ کے نیچے زیر آئے',
          'واؤ پر تشدید ہو'
        ],
        explanation: 'واؤ ساکن سے پہلے پیش ہو تو واؤ مدہ ہوگا جیسے بُوْ ، نُوْرُ ، یَقُوْلُ ۔'
      },
      {
        question: 'یاء مدہ کب بنتا ہے؟',
        correct: 'یاء ساکن (يْ) سے پہلے حرف کے نیچے زیر ہو جیسے اِ + يْ = اِيْ',
        options: [
          'یاء ساکن (يْ) سے پہلے حرف کے نیچے زیر ہو جیسے اِ + يْ = اِيْ',
          'یاء ساکن سے پہلے زبر ہو جیسے بَيْ',
          'یاء پر پیش ہو جیسے يُ',
          'یاء پر دو زبر ہوں'
        ],
        explanation: 'یاء ساکن سے پہلے زیر ہو تو یاء مدہ ہوگا جیسے بِيْ ، دِیْنِ ، قِیْلَ ۔'
      },
      {
        question: 'حرکت اور مدہ میں کیا بنیادی فرق ہے؟',
        correct: 'حرکت کو بغیر کھینچے پڑھتے ہیں جبکہ مدہ کو ایک الف کھینچتے ہیں',
        options: [
          'حرکت کو بغیر کھینچے پڑھتے ہیں جبکہ مدہ کو ایک الف کھینچتے ہیں',
          'دونوں کو برابر لمبا کھینچا جاتا ہے',
          'حرکت موٹی ہوتی ہے اور مدہ باریک ہوتا ہے',
          'حرکت پر وقف کیا جاتا ہے'
        ],
        explanation: 'مثال: "بَ" کو جلدی بغیر کھینچے پڑھیں گے جبکہ "بَا" کو ایک الف (دو حرکات) کھینچ کر پڑھیں گے۔'
      },
      {
        question: 'کلمہ "قَالَ" اور "خُرُوْجِ" میں موٹا (پُر) حرف کون سا ہے؟',
        correct: 'قاف اور خاء (حروفِ مستعلیہ)',
        options: [
          'قاف اور خاء (حروفِ مستعلیہ)',
          'الف اور واؤ',
          'لام اور جیم',
          'سب حروف باریک ہیں'
        ],
        explanation: 'سات حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) حروف مدہ کے ساتھ بھی ہمیشہ پُر (موٹے) پڑھے جاتے ہیں۔'
      },
      {
        question: 'کلمہ "فِيْهَا" میں کون کون سے مدات ہیں؟',
        correct: 'فِيْ (یاء مدہ) اور هَا (الف مدہ)',
        options: [
          'فِيْ (یاء مدہ) اور هَا (الف مدہ)',
          'صرف واؤ مدہ ہے',
          'صرف الف مدہ ہے',
          'کوئی مدہ نہیں ہے'
        ],
        explanation: 'فِيْ میں یاء ساکن سے پہلے زیر (یاء مدہ) اور هَا میں الف سے پہلے زبر (الف مدہ) ہے۔'
      }
    ];
  }, []);

  // Handle Book Cell Audio Click
  const handlePlayCell = (cell: Sabaq7BookCell) => {
    if (isMuted) return;
    setActiveCellId(cell.id);
    setSelectedCell(cell);
    setSelectedWord(null);
    setActiveTripletId(null);
    setActiveWordId(null);

    let textToPlay = cell.arabicText;
    if (pronunciationMode === 'hijja') {
      textToPlay = cell.hijjaSpelling;
    } else if (pronunciationMode === 'compare') {
      const harakahExample = cell.maddahType === 'alif' ? `${cell.letterBase}َ` : cell.maddahType === 'waw' ? `${cell.letterBase}ُ` : `${cell.letterBase}ِ`;
      textToPlay = `${harakahExample} ، ${cell.arabicText}`;
    }

    setActiveAudioText(textToPlay);
    playQariText(textToPlay);
  };

  // Play Row by Row
  const handlePlayRow = async (rowCells: Sabaq7BookCell[]) => {
    if (isMuted) return;
    setIsPlayingSequence(true);
    for (const cell of rowCells) {
      if (!isPlayingSequence) break;
      setActiveCellId(cell.id);
      setSelectedCell(cell);
      const text = pronunciationMode === 'hijja' ? cell.hijjaSpelling : cell.arabicText;
      setActiveAudioText(text);
      await playQariText(text);
      await new Promise(r => setTimeout(r, 450));
    }
    setIsPlayingSequence(false);
  };

  // Handle Full Triplet Play (e.g. بَا ، بُوْ ، بِيْ)
  const handlePlayTriplet = (triplet: Sabaq7Triplet) => {
    if (isMuted) return;
    setActiveTripletId(triplet.id);
    setActiveCellId(null);
    setActiveWordId(null);

    const textToPlay = pronunciationMode === 'hijja' ? triplet.tripletHijja : triplet.tripletRaw;
    setActiveAudioText(textToPlay);
    playQariText(textToPlay);
  };

  // Handle Mashq Word Audio Click
  const handlePlayWord = (wordItem: MaddahMashqWord) => {
    if (isMuted) return;
    setActiveWordId(wordItem.id);
    setSelectedWord(wordItem);
    setSelectedCell(null);
    setActiveCellId(null);
    setActiveTripletId(null);

    if (pronunciationMode === 'hijja') {
      setActiveAudioText(wordItem.hijjaText);
      playWordWithHijjaAndPronunciation(wordItem.hijjaText, wordItem.word);
    } else {
      setActiveAudioText(wordItem.word);
      playQariText(wordItem.word);
    }
  };

  // Next / Prev Navigation for Reading Inspector
  const navigateCell = (direction: 'next' | 'prev') => {
    if (!selectedCell) {
      handlePlayCell(SABAQ_7_ALL_84_CELLS[0]);
      return;
    }
    const currentIndex = SABAQ_7_ALL_84_CELLS.findIndex(c => c.id === selectedCell.id);
    if (currentIndex === -1) return;
    
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= SABAQ_7_ALL_84_CELLS.length) newIndex = 0;
    if (newIndex < 0) newIndex = SABAQ_7_ALL_84_CELLS.length - 1;

    handlePlayCell(SABAQ_7_ALL_84_CELLS[newIndex]);
  };

  // Play Sequence for Book Grid or Tabs
  const playCurrentTabSequence = async () => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveCellId(null);
      setActiveTripletId(null);
      setActiveWordId(null);
      setActiveAudioText(null);
      return;
    }

    setIsPlayingSequence(true);

    if (activeTab === 'bookGrid') {
      // Play 84 cells in sequence
      for (const cell of SABAQ_7_ALL_84_CELLS) {
        if (!isPlayingSequence) break;
        setActiveCellId(cell.id);
        setSelectedCell(cell);
        const text = pronunciationMode === 'hijja' ? cell.hijjaSpelling : cell.arabicText;
        setActiveAudioText(text);
        await playQariText(text);
        await new Promise(r => setTimeout(r, 450));
      }
    } else {
      let words: MaddahMashqWord[] = [];
      if (activeTab === 'alif') words = PAGE_16_ALIF_MASHQ_WORDS;
      else if (activeTab === 'waw') words = PAGE_17_WAW_MASHQ_WORDS;
      else if (activeTab === 'yaa') words = PAGE_18_YAA_MASHQ_WORDS;
      else words = ALL_MADDAH_MASHQ_WORDS;

      for (const word of words) {
        if (!isPlayingSequence) break;
        setActiveWordId(word.id);
        setSelectedWord(word);
        const text = pronunciationMode === 'hijja' ? word.hijjaText : word.word;
        setActiveAudioText(text);
        await playQariText(text);
        await new Promise(r => setTimeout(r, 500));
      }
    }

    setIsPlayingSequence(false);
    setActiveCellId(null);
    setActiveTripletId(null);
    setActiveWordId(null);
    setActiveAudioText(null);
  };

  // Filter Mashq Words
  const getFilteredWords = (words: MaddahMashqWord[]) => {
    return words.filter(w => {
      if (filterType === 'heavy' && !w.isHeavy) return false;
      if (filterType === 'light' && w.isHeavy) return false;
      if (filterType === 'short' && w.category !== 'short') return false;
      if (filterType === 'compound' && w.category !== 'compound') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim();
        return w.word.includes(q) || w.hijjaText.includes(q);
      }
      return true;
    });
  };

  // Dynamic Arabic Font Class based on user selection for maximum reading comfort
  const arabicFontClass = useMemo(() => {
    switch (fontSize) {
      case 'normal':
        return 'text-2xl sm:text-3xl';
      case 'xlarge':
        return 'text-4xl sm:text-5xl md:text-6xl';
      case 'large':
      default:
        return 'text-3xl sm:text-4xl md:text-5xl';
    }
  }, [fontSize]);

  // Render Full Interactive Game Modal
  if (showGameModal) {
    return <HuroofMaddahGameModal onBack={() => setShowGameModal(false)} />;
  }

  // Render Puzzle Game Modal
  if (showMagneticGame) {
    return <MurakkabatPuzzleGameModal onBack={() => setShowMagneticGame(false)} initialGameMode="maddah" />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden text-slate-100 font-urdu" dir="rtl">
      {/* Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Header Navbar - Sleek & Mobile Optimized */}
        <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-30 min-h-[52px]">
          {/* Back & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button 
              onClick={onBack}
              id="maddah-back-btn"
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-black border border-emerald-500/40 shrink-0">
                سبق نمبر ۶
              </span>
              <h1 className="text-sm sm:text-lg font-black text-amber-300 tracking-tight font-urdu truncate">
                سبق نمبر (۶) : حُرُوفِ مَدَّہ (الف، واؤ، یاء)
              </h1>
            </div>
          </div>

          {/* Quick Actions & Game Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Font Size Selector for Reading Comfort */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800" title="فونٹ سائز تبدیل کریں">
              <span className="text-[10px] text-slate-400 px-1 font-urdu">فونٹ:</span>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded-lg text-sm font-bold transition-all ${fontSize === 'large' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-0.5 rounded-lg text-base font-bold transition-all ${fontSize === 'xlarge' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                A++
              </button>
            </div>

            <button
              onClick={() => setShowGameModal(true)}
              id="maddah-open-games-btn"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 border border-emerald-400 shadow-lg transition-all cursor-pointer hover:scale-105"
              title="صوتی و بصری گیم (کوئز، پزل، میموری میچ، سپیڈ چیلنج)"
            >
              <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>صوتی و بصری گیم 🎯</span>
            </button>

            <button
              onClick={() => setShowMagneticGame(true)}
              id="maddah-open-puzzle-btn"
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1 border border-indigo-400/50 shadow-md transition-all cursor-pointer hover:scale-105"
              title="مقناطیسی بورڈ اور کلمات پزل گیم کھیلیں"
            >
              <Puzzle className="w-3.5 h-3.5 text-yellow-300" />
              <span>مقناطیسی پزل 🧩</span>
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-rose-900/30 border-rose-700/50 text-rose-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'صدا بند ہے' : 'صدا جاری ہے'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            <button
              onClick={playCurrentTabSequence}
              id="maddah-autoplay-btn"
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 border transition-all shadow-md ${
                isPlayingSequence
                  ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'
              }`}
            >
              {isPlayingSequence ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">روکیں</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>سنیں</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Tab Navigation: Book Grid, Alif Maddah, Waw Maddah, Yaa Maddah, All Mashq, Rules, Quiz */}
        <div className="bg-slate-950/70 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max">
            
            {/* 1. BOOK GRID TAB (اصل کتابی تصویری ترتیب) */}
            <button
              onClick={() => setActiveTab('bookGrid')}
              id="tab-book-grid"
              className={`px-3 py-1 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'bookGrid'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>اصل کتابی جدول (۸۴ حروف)</span>
            </button>

            {/* 2. ALIF MADDAH */}
            <button
              onClick={() => setActiveTab('alif')}
              id="tab-alif-maddah"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'alif'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>الف مدہ (مشق)</span>
            </button>

            {/* 3. WAW MADDAH */}
            <button
              onClick={() => setActiveTab('waw')}
              id="tab-waw-maddah"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'waw'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>واؤ مدہ (مشق)</span>
            </button>

            {/* 4. YAA MADDAH */}
            <button
              onClick={() => setActiveTab('yaa')}
              id="tab-yaa-maddah"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'yaa'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>یاء مدہ (مشق)</span>
            </button>

            {/* 5. ALL MASHQ WORDS */}
            <button
              onClick={() => setActiveTab('allMashq')}
              id="tab-all-mashq"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'allMashq'
                  ? 'bg-amber-600 text-white font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>تمام کلمات</span>
            </button>

            {/* 6. IMTIHAN (جامع امتحان ۵۰ کلمات) */}
            <button
              onClick={() => setActiveTab('imtihan')}
              id="tab-imtihan-p20"
              className={`px-3 py-1 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'imtihan'
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900/80 border border-emerald-500/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>جامع امتحان (۵۰ کلمات)</span>
            </button>

            {/* 7. RULES */}
            <button
              onClick={() => setActiveTab('rules')}
              id="tab-rules"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'rules'
                  ? 'bg-indigo-500 text-white font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>تجویدی قواعد</span>
            </button>

            {/* 8. QUIZ */}
            <button
              onClick={() => setActiveTab('quiz')}
              id="tab-quiz"
              className={`px-2.5 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-rose-500 text-white font-bold shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>کوئز</span>
            </button>

            {/* 8. AUDIO VISUAL GAME BUTTON */}
            <button
              onClick={() => setShowGameModal(true)}
              id="tab-audio-visual-game"
              className="px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400 shadow-md cursor-pointer shrink-0"
              title="صوتی و بصری گیم (کوئز، پزل، میموری میچ، سپیڈ چیلنج)"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
              <span>صوتی و بصری گیم 🎯</span>
            </button>

            {/* 9. MAGNETIC PUZZLE BOARD BUTTON */}
            <button
              onClick={() => setShowMagneticGame(true)}
              id="tab-magnetic-puzzle"
              className="px-2.5 py-1 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 hover:from-indigo-600 hover:to-purple-600 text-white border border-indigo-400/50 shadow-md cursor-pointer shrink-0"
              title="مقناطیسی بورڈ اور کلمات پزل گیم"
            >
              <Puzzle className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>مقناطیسی بورڈ پزل 🧩</span>
            </button>
          </div>
        </div>

        {/* Compact Filter & Pronunciation Control Ribbon */}
        {(activeTab === 'bookGrid' || activeTab === 'alif' || activeTab === 'waw' || activeTab === 'yaa' || activeTab === 'allMashq') && (
          <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
            {/* Pronunciation mode - Single row compact */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setPronunciationMode('rawani')}
                className={`px-2 py-0.5 rounded-lg transition-all font-urdu text-[11px] ${
                  pronunciationMode === 'rawani'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                روانی
              </button>
              <button
                onClick={() => setPronunciationMode('hijja')}
                className={`px-2 py-0.5 rounded-lg transition-all font-urdu text-[11px] ${
                  pronunciationMode === 'hijja'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                ہجے
              </button>
              <button
                onClick={() => setPronunciationMode('compare')}
                className={`px-2 py-0.5 rounded-lg transition-all font-urdu text-[11px] ${
                  pronunciationMode === 'compare'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                موازنہ
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-1 bg-slate-950/70 p-0.5 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded-lg transition-all font-urdu text-[11px] ${
                  filterType === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                تمام
              </button>
              <button
                onClick={() => setFilterType('heavy')}
                className={`px-2 py-0.5 rounded-lg transition-all font-urdu text-[11px] ${
                  filterType === 'heavy' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                پُر حروف
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[120px] max-w-[200px] flex-1">
              <Search className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="تلاش کریں..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pr-7 pl-2 py-0.5 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-arabic"
                dir="rtl"
              />
            </div>
          </div>
        )}

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-900/60 space-y-4 pb-36">
          
          {/* ========================================================================= */}
          {/* TAB 1: EXACT BOOK GRID ORDER (اصل کتابی تصویری ترتیب) */}
          {/* ========================================================================= */}
          {activeTab === 'bookGrid' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              
              {/* Compact Collapsible Rules Banner to keep reading grid prominently at the top */}
              <div className="bg-[#fcf8ec] text-zinc-900 border-2 sm:border-3 border-emerald-600 rounded-2xl p-3 sm:p-4 shadow-md space-y-2 relative overflow-hidden" dir="rtl">
                
                {/* Title Badge & Toggle */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-1.5 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="font-bold text-emerald-950 text-xs sm:text-sm font-urdu">
                      سبق نمبر (۶) : قواعدِ حُرُوفِ مَدَّہ (الف، واؤ، یاء) — ایک الف کھینچیں
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playUrduText('حروف مدہ تین ہیں: الف، واؤ، یا۔ خالی الف سے پہلے زبر ہو تو الف مدہ، واؤ ساکن سے پہلے پیش ہو تو واؤ مدہ، یاء ساکن سے پہلے زیر ہو تو یاء مدہ ہوگا۔ حروف مدہ کو ایک الف یعنی دو حرکات کے برابر کھینچ کر پڑھیں۔')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] border border-emerald-300 flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3 text-emerald-800" />
                      <span>سنیں</span>
                    </button>
                    <button
                      onClick={() => setShowRulesBanner(!showRulesBanner)}
                      className="px-2 py-0.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-zinc-800 text-[11px] font-urdu flex items-center gap-1"
                    >
                      <span>{showRulesBanner ? 'قواعد چھپائیں' : 'قواعد پڑھیں'}</span>
                      {showRulesBanner ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* 6 Authentic Rules - Collapsible */}
                {showRulesBanner && (
                  <div className="space-y-1.5 text-xs font-urdu leading-relaxed text-zinc-800 pt-1">
                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        اس علامت <span className="font-arabic font-bold text-sm text-emerald-800 bg-white px-1.5 py-0.2 rounded border border-emerald-300 inline-block mx-1">" ْ "</span> کو <strong className="text-emerald-800">جزم</strong> کہتے ہیں۔ جس حرف پر جزم ہو اُسے <strong className="text-emerald-800">ساکن</strong> کہتے ہیں۔
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        ساکن حرف اپنے سے پہلے متحرک حرف سے مل کر پڑھا جاتا ہے۔
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        حروفِ مدہ تین ہیں: <strong className="text-emerald-800">الف</strong> ، <strong className="text-emerald-800">واؤ</strong> ، <strong className="text-emerald-800">یا</strong> ۔
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        الف سے پہلے زبر ہو تو الف مدہ ہوگا جیسے <span className="font-arabic font-bold text-emerald-800 text-sm">بَا</span> ، واؤ ساکن <span className="font-arabic font-bold text-emerald-800 text-sm">"وْ"</span> سے پہلے پیش ہو تو واؤ مدہ ہوگا جیسے <span className="font-arabic font-bold text-emerald-800 text-sm">بُوْ</span> ، یاء ساکن <span className="font-arabic font-bold text-emerald-800 text-sm">"يْ"</span> سے پہلے زیر ہو تو یاء مدہ ہوگا جیسے <span className="font-arabic font-bold text-emerald-800 text-sm">بِيْ</span> ۔
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        حروفِ مدہ کو ایک الف یعنی دو حرکات کے برابر کھینچ کر پڑھیں۔
                      </p>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <span className="text-red-600 font-bold text-xs select-none">❖</span>
                      <p>
                        ہجے اس طرح کریں: <span className="font-arabic font-bold text-emerald-800">بَا</span> = با الف زبر بَا ، <span className="font-arabic font-bold text-emerald-800">بُوْ</span> = با واؤ پیش بُوْ ، <span className="font-arabic font-bold text-emerald-800">بِيْ</span> = با یا زیر بِيْ = <strong className="font-arabic text-emerald-900 text-sm">بَا ، بُوْ ، بِيْ</strong> ۔
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Exact Book Table Layout with 14 Structured Rows × 6 Columns - PROMINENT & HIGHLY READABLE */}
              <div className="bg-[#fffef8] border-3 sm:border-4 border-emerald-600 rounded-3xl p-3 sm:p-5 shadow-2xl space-y-3" dir="rtl">
                
                {/* Column Headers for Reading Clarity */}
                <div className="hidden sm:grid grid-cols-6 gap-2 bg-emerald-800 text-white rounded-xl p-2 text-center font-urdu font-bold text-xs shadow-sm">
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">الف مدہ (زبر)</div>
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">واؤ مدہ (پیش)</div>
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">یاء مدہ (زیر)</div>
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">الف مدہ (زبر)</div>
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">واؤ مدہ (پیش)</div>
                  <div className="bg-emerald-900/60 py-0.5 rounded-lg">یاء مدہ (زیر)</div>
                </div>

                {/* 14 Structured Rows */}
                <div className="space-y-2.5">
                  {structuredRows.map((row) => (
                    <div 
                      key={row.rowNumber}
                      className="bg-amber-50/40 border border-emerald-300/80 rounded-2xl p-2 sm:p-2.5 relative shadow-sm hover:border-emerald-500 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1 pb-1 border-b border-emerald-200/60 text-xs">
                        <span className="font-urdu font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 text-[11px]">
                          سطر #{row.rowNumber}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handlePlayTriplet(row.trip1)}
                            className="text-[10px] text-emerald-800 hover:text-emerald-950 font-urdu bg-white px-1.5 py-0.5 rounded border border-emerald-300 hover:bg-emerald-50 transition-all"
                            title="پہلی ۳ جوڑیاں سنیں"
                          >
                            ▶ {row.trip1.baseLetterName}
                          </button>
                          <button
                            onClick={() => handlePlayTriplet(row.trip2)}
                            className="text-[10px] text-emerald-800 hover:text-emerald-950 font-urdu bg-white px-1.5 py-0.5 rounded border border-emerald-300 hover:bg-emerald-50 transition-all"
                            title="دوسری ۳ جوڑیاں سنیں"
                          >
                            ▶ {row.trip2.baseLetterName}
                          </button>
                          <button
                            onClick={() => handlePlayRow(row.cells)}
                            className="text-[10px] text-emerald-900 font-bold font-urdu bg-emerald-200 hover:bg-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400 transition-all flex items-center gap-1"
                          >
                            <Play className="w-2.5 h-2.5" />
                            <span>سطر سنیں</span>
                          </button>
                        </div>
                      </div>

                      {/* 6 Grid Cells in Row */}
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
                        {row.cells.map((cell) => {
                          const isActive = activeCellId === cell.id;
                          const isHeavy = cell.isHeavy;

                          return (
                            <motion.button
                              key={cell.id}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handlePlayCell(cell)}
                              className={`aspect-square sm:h-20 md:h-24 rounded-xl border-2 flex flex-col items-center justify-center p-1.5 transition-all cursor-pointer relative shadow-sm ${
                                isActive
                                  ? 'bg-emerald-100 border-emerald-600 ring-3 ring-emerald-400 scale-105 z-10 shadow-md'
                                  : 'bg-white hover:bg-emerald-50/60 border-emerald-500/80 hover:border-emerald-600'
                              }`}
                            >
                              {/* Arabic Text */}
                              <div className={`font-arabic ${arabicFontClass} font-bold select-none leading-none ${
                                isHeavy 
                                  ? 'text-sky-600' 
                                  : cell.maddahType === 'alif' 
                                  ? 'text-zinc-900' 
                                  : cell.maddahType === 'waw' 
                                  ? 'text-zinc-900' 
                                  : 'text-emerald-700'
                              }`}>
                                {cell.arabicText}
                              </div>

                              {/* Helper Sub-label */}
                              <div className="text-[9px] text-zinc-500 mt-1 font-urdu leading-none">
                                {cell.maddahType === 'alif' ? 'الف مدہ' : cell.maddahType === 'waw' ? 'واؤ مدہ' : 'یاء مدہ'}
                              </div>

                              {/* Heavy Tag */}
                              {isHeavy && (
                                <span className="absolute top-1 left-1 text-[7px] bg-sky-100 text-sky-700 border border-sky-300 px-0.5 rounded font-bold">
                                  پُر
                                </span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Practice Words directly on the Book View for Reading Ease */}
              <div className="bg-[#fffef8] border-3 sm:border-4 border-emerald-600 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4" dir="rtl">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b-2 border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                    <h3 className="font-urdu font-black text-base sm:text-lg text-emerald-950">
                      مشق (قرآنی کلماتِ حروفِ مدہ)
                    </h3>
                  </div>

                  {/* Filter Subtabs */}
                  <div className="flex items-center gap-1 bg-emerald-100/80 p-0.5 rounded-xl border border-emerald-300 overflow-x-auto">
                    <button
                      onClick={() => setBookMashqSection('all')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all font-urdu ${bookMashqSection === 'all' ? 'bg-emerald-700 text-white' : 'text-emerald-900 hover:bg-emerald-200'}`}
                    >
                      تمام ۸۵
                    </button>
                    <button
                      onClick={() => setBookMashqSection('alif')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all font-urdu ${bookMashqSection === 'alif' ? 'bg-emerald-700 text-white' : 'text-emerald-900 hover:bg-emerald-200'}`}
                    >
                      الف مدہ (۳۰)
                    </button>
                    <button
                      onClick={() => setBookMashqSection('waw')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all font-urdu ${bookMashqSection === 'waw' ? 'bg-emerald-700 text-white' : 'text-emerald-900 hover:bg-emerald-200'}`}
                    >
                      واؤ مدہ (۳۰)
                    </button>
                    <button
                      onClick={() => setBookMashqSection('yaa')}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all font-urdu ${bookMashqSection === 'yaa' ? 'bg-emerald-700 text-white' : 'text-emerald-900 hover:bg-emerald-200'}`}
                    >
                      یاء مدہ (۲۵)
                    </button>
                  </div>
                </div>

                {/* Words Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                  {(bookMashqSection === 'all' 
                    ? ALL_MADDAH_MASHQ_WORDS 
                    : bookMashqSection === 'alif' 
                    ? PAGE_16_ALIF_MASHQ_WORDS 
                    : bookMashqSection === 'waw' 
                    ? PAGE_17_WAW_MASHQ_WORDS 
                    : PAGE_18_YAA_MASHQ_WORDS
                  ).map((wordItem) => {
                    const isActive = activeWordId === wordItem.id;
                    return (
                      <motion.button
                        key={wordItem.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePlayWord(wordItem)}
                        className={`p-2.5 sm:p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-sm ${
                          isActive
                            ? 'bg-emerald-100 border-emerald-600 ring-3 ring-emerald-400 scale-105'
                            : 'bg-white hover:bg-emerald-50/50 border-emerald-300'
                        }`}
                      >
                        <span className="text-[9px] text-emerald-800 font-urdu mb-0.5">
                          {wordItem.maddahType === 'alif' ? 'الف مدہ' : wordItem.maddahType === 'waw' ? 'واؤ مدہ' : wordItem.maddahType === 'yaa' ? 'یاء مدہ' : 'مشترکہ مد'}
                        </span>
                        <div className="font-arabic text-xl sm:text-2xl font-bold text-zinc-950 mb-0.5">
                          {wordItem.word}
                        </div>
                        <div className="text-[10px] text-zinc-600 font-urdu text-center leading-tight">
                          {wordItem.hijjaText}
                        </div>
                        {wordItem.isHeavy && (
                          <span className="absolute top-1 left-1 text-[7px] bg-sky-100 text-sky-700 border border-sky-300 px-1 rounded font-bold">
                            پُر حرف
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Game Zone Banner */}
              <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-2 border-amber-500/40 rounded-2xl p-4 text-center space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-amber-300 font-urdu">
                  🎯 حروفِ مدہ کا ٹیسٹ اور پریکٹس گیمز
                </h3>
                <p className="text-xs text-slate-300 font-urdu">
                  ۴ تفریحی گیم موڈز: پہچان کوئز، مقناطیسی پزل، میموری کارڈ میچنگ، اور ۵ سیکنڈ سپیڈ رَش!
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setShowGameModal(true)}
                    className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm shadow-xl flex items-center gap-2 transition-all cursor-pointer font-urdu"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span>گیم زون میں داخل ہوں</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('allMashq')}
                    className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 flex items-center gap-2 font-urdu"
                  >
                    <Layers className="w-4 h-4" />
                    <span>تمام ۸۵ کلماتِ مشق دیکھیں</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ALIF MADDAH (الف مدہ + مشق ۳۰ کلمات) */}
          {/* ========================================================================= */}
          {activeTab === 'alif' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-800/80 to-amber-950/30 border border-amber-500/30 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        حرفِ مدہ اول
                      </span>
                      <h2 className="text-lg font-bold text-amber-300 font-urdu">
                        الف مدہ کا قاعدہ و مشق (۳۰ کلمات)
                      </h2>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-urdu" dir="rtl">
                      <strong className="text-amber-400">قاعدہ الف مدہ:</strong> الف سے پہلے حرف پر زبر آئے تو الف مدہ ہوگا، ایک الف کے برابر کھینچ کر پڑھیں۔ جیسے: <span className="font-arabic text-base text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-500/30">بَ + ا = بَا</span>
                    </p>
                  </div>

                  <button
                    onClick={() => playUrduText('الف سے پہلے حرف پر زبر آئے تو الف مدہ ہوگا، ایک الف کے برابر کھینچ کر پڑھیں جیسے با الف زبر با')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-2 text-xs font-medium transition-all min-w-max"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>قاعدہ کی آواز سنیں</span>
                  </button>
                </div>
              </div>

              {/* Mashq 30 Words */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-urdu">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>الف مدہ کے مشقی و قرآنی کلمات (۳۰ کلمات)</span>
                  </h3>
                  <span className="text-xs text-slate-400">کل تعداد: {PAGE_16_ALIF_MASHQ_WORDS.length} کلمات</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {getFilteredWords(PAGE_16_ALIF_MASHQ_WORDS).map((wordItem) => {
                    const isActive = activeWordId === wordItem.id;
                    return (
                      <motion.button
                        key={wordItem.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePlayWord(wordItem)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                          isActive
                            ? 'bg-amber-950/70 border-amber-400 ring-2 ring-amber-400/50'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-amber-500/50'
                        }`}
                      >
                        <div className="font-arabic text-2xl sm:text-3xl font-bold text-amber-200 mb-1">
                          {wordItem.word}
                        </div>
                        <div className="text-[11px] text-slate-400 font-urdu text-center leading-tight">
                          {wordItem.hijjaText}
                        </div>
                        {wordItem.isHeavy && (
                          <span className="absolute top-1.5 left-1.5 text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1 rounded font-bold">
                            پُر حرف
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: WAW MADDAH (واؤ مدہ + مشق ۳۰ کلمات) */}
          {/* ========================================================================= */}
          {activeTab === 'waw' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-slate-800/80 to-teal-950/30 border border-teal-500/30 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-teal-500 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        حرفِ مدہ دوم
                      </span>
                      <h2 className="text-lg font-bold text-teal-300 font-urdu">
                        واؤ مدہ کا قاعدہ و مشق (۳۰ کلمات)
                      </h2>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-urdu" dir="rtl">
                      <strong className="text-teal-400">قاعدہ واؤ مدہ:</strong> واؤ ساکن (وْ) سے پہلے حرف پر پیش آئے تو واؤ مدہ ہوگا، ایک الف کھینچ کر پڑھیں۔ جیسے: <span className="font-arabic text-base text-teal-300 bg-slate-900/80 px-2 py-0.5 rounded border border-teal-500/30">بُ + وْ = بُوْ</span>
                    </p>
                  </div>

                  <button
                    onClick={() => playUrduText('واؤ ساکن سے پہلے پیش ہو تو واؤ مدہ ہوگا جیسے با واؤ پیش بو')}
                    className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 flex items-center gap-2 text-xs font-medium transition-all min-w-max"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>قاعدہ کی آواز سنیں</span>
                  </button>
                </div>
              </div>

              {/* Mashq 30 Words */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-urdu">
                    <Layers className="w-4 h-4 text-teal-400" />
                    <span>واؤ مدہ کے مشقی و قرآنی کلمات (۳۰ کلمات)</span>
                  </h3>
                  <span className="text-xs text-slate-400">کل تعداد: {PAGE_17_WAW_MASHQ_WORDS.length} کلمات</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {getFilteredWords(PAGE_17_WAW_MASHQ_WORDS).map((wordItem) => {
                    const isActive = activeWordId === wordItem.id;
                    return (
                      <motion.button
                        key={wordItem.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePlayWord(wordItem)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                          isActive
                            ? 'bg-teal-950/70 border-teal-400 ring-2 ring-teal-400/50'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-teal-500/50'
                        }`}
                      >
                        <div className="font-arabic text-2xl sm:text-3xl font-bold text-teal-200 mb-1">
                          {wordItem.word}
                        </div>
                        <div className="text-[11px] text-slate-400 font-urdu text-center leading-tight">
                          {wordItem.hijjaText}
                        </div>
                        {wordItem.isHeavy && (
                          <span className="absolute top-1.5 left-1.5 text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1 rounded font-bold">
                            پُر حرف
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: YAA MADDAH (یاء مدہ + مشق ۲۵ کلمات) */}
          {/* ========================================================================= */}
          {activeTab === 'yaa' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-800/80 to-sky-950/30 border border-sky-500/30 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-sky-500 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        حرفِ مدہ سوم
                      </span>
                      <h2 className="text-lg font-bold text-sky-300 font-urdu">
                        یاء مدہ کا قاعدہ و مشق (۲۵ کلمات)
                      </h2>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-urdu" dir="rtl">
                      <strong className="text-sky-400">قاعدہ یاء مدہ:</strong> یاء ساکن (يْ) سے پہلے حرف کے نیچے زیر آئے تو یاء مدہ ہوگا، ایک الف کھینچ کر پڑھیں۔ جیسے: <span className="font-arabic text-base text-sky-300 bg-slate-900/80 px-2 py-0.5 rounded border border-sky-500/30">بِ + يْ = بِيْ</span>
                    </p>
                  </div>

                  <button
                    onClick={() => playUrduText('یاء ساکن سے پہلے زیر ہو تو یاء مدہ ہوگا جیسے با یا زیر بی')}
                    className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 flex items-center gap-2 text-xs font-medium transition-all min-w-max"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>قاعدہ کی آواز سنیں</span>
                  </button>
                </div>
              </div>

              {/* Mashq 25 Words */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-urdu">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>یاء مدہ کے مشقی و قرآنی کلمات (۲۵ کلمات)</span>
                  </h3>
                  <span className="text-xs text-slate-400">کل تعداد: {PAGE_18_YAA_MASHQ_WORDS.length} کلمات</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {getFilteredWords(PAGE_18_YAA_MASHQ_WORDS).map((wordItem) => {
                    const isActive = activeWordId === wordItem.id;
                    return (
                      <motion.button
                        key={wordItem.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePlayWord(wordItem)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                          isActive
                            ? 'bg-sky-950/70 border-sky-400 ring-2 ring-sky-400/50'
                            : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-sky-500/50'
                        }`}
                      >
                        <div className="font-arabic text-2xl sm:text-3xl font-bold text-sky-200 mb-1">
                          {wordItem.word}
                        </div>
                        <div className="text-[11px] text-slate-400 font-urdu text-center leading-tight">
                          {wordItem.hijjaText}
                        </div>
                        {wordItem.isHeavy && (
                          <span className="absolute top-1.5 left-1.5 text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1 rounded font-bold">
                            پُر حرف
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ALL 85 MASHQ WORDS (تمام کلماتِ مشق) */}
          {/* ========================================================================= */}
          {activeTab === 'allMashq' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 font-urdu">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span>حروفِ مدہ کے تمام ۸۵ مشقی و قرآنی کلمات</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-urdu">
                    الف، واؤ اور یاء مدہ کے تمام مختصر اور مرکب کلمات مع تجویدی ہجے
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {getFilteredWords(ALL_MADDAH_MASHQ_WORDS).map((wordItem) => {
                  const isActive = activeWordId === wordItem.id;
                  return (
                    <motion.button
                      key={wordItem.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handlePlayWord(wordItem)}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all cursor-pointer relative shadow-lg ${
                        isActive
                          ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400/50'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-[10px] text-amber-400/80 mb-1 font-urdu">
                        {wordItem.maddahType === 'alif' ? 'الف مدہ' : wordItem.maddahType === 'waw' ? 'واؤ مدہ' : wordItem.maddahType === 'yaa' ? 'یاء مدہ' : 'مکسڈ مد'}
                      </span>
                      <div className="font-arabic text-2xl sm:text-3xl font-bold text-amber-200 mb-1">
                        {wordItem.word}
                      </div>
                      <div className="text-[10px] text-slate-400 font-urdu text-center leading-tight">
                        {wordItem.hijjaText}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: IMTIHAN PAGE 20 (جامع امتحان - ۵۰ کلمات) */}
          {/* ========================================================================= */}
          {activeTab === 'imtihan' && (
            <Page20ImtihanView />
          )}

          {/* ========================================================================= */}
          {/* TAB 6: TAJWEED RULES (تجویدی قواعد) */}
          {/* ========================================================================= */}
          {activeTab === 'rules' && (
            <div className="space-y-4 max-w-4xl mx-auto" dir="rtl">
              <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-indigo-300 font-urdu flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>حروفِ مدہ کے مکمل تجویدی قواعد و احکام</span>
                </h2>

                <div className="grid gap-3 font-urdu">
                  {HUROOF_MADDAH_RULES.map((rule) => (
                    <div key={rule.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-amber-300 text-sm">{rule.title}</h4>
                        <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                          {rule.highlightText}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {rule.urduDescription}
                      </p>
                      <div className="font-arabic text-base text-emerald-400 font-bold bg-slate-950/60 p-2 rounded border border-slate-800/80 text-left">
                        {rule.exampleArabic}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: QUIZ TEST (آزمائشی کوئز) */}
          {/* ========================================================================= */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-6 font-urdu" dir="rtl">
              <div className="bg-slate-800/90 border-2 border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                    سوال #{quizIndex + 1} از {quizPool.length}
                  </span>
                  <span className="text-xs text-amber-300 font-bold">
                    اسکور: {quizScore} پوائنٹس
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {quizPool[quizIndex].question}
                </h3>

                <div className="grid gap-2.5 pt-2">
                  {quizPool[quizIndex].options.map((opt, i) => {
                    const isSelected = selectedQuizAnswer === opt;
                    const isCorrect = opt === quizPool[quizIndex].correct;
                    let optStyle = 'bg-slate-900/80 border-slate-700 hover:border-amber-500/60 text-slate-200';
                    if (quizFeedback !== null) {
                      if (isCorrect) optStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
                      else if (isSelected && !isCorrect) optStyle = 'bg-rose-950 border-rose-500 text-rose-200';
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizFeedback !== null}
                        onClick={() => {
                          setSelectedQuizAnswer(opt);
                          if (opt === quizPool[quizIndex].correct) {
                            setQuizScore(s => s + 10);
                            setQuizFeedback({ isCorrect: true, text: 'ماشاء اللہ! بالکل درست جواب!' });
                            playQuizFeedbackAudio(true);
                          } else {
                            setQuizFeedback({ isCorrect: false, text: quizPool[quizIndex].explanation });
                            playQuizFeedbackAudio(false);
                          }
                        }}
                        className={`p-3 rounded-xl border text-right text-xs sm:text-sm font-medium transition-all ${optStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizFeedback && (
                  <div className={`p-3 rounded-xl border text-xs leading-relaxed ${quizFeedback.isCorrect ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'}`}>
                    <strong>{quizFeedback.isCorrect ? '✨ درست: ' : '❌ رہنمائی: '}</strong>
                    <span>{quizFeedback.text}</span>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedQuizAnswer(null);
                      setQuizFeedback(null);
                      setQuizIndex(q => (q + 1) % quizPool.length);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>اگلا سوال</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Pinned Bottom Interactive Reading Inspector (رہنمائے تجوید و ہجے) */}
        <AnimatePresence>
          {(selectedCell || selectedWord) && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t-2 border-amber-500/60 shadow-2xl backdrop-blur-xl px-4 py-2.5 max-w-5xl mx-auto rounded-t-3xl"
              dir="rtl"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                
                {/* Cell/Word Info */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-arabic text-3xl font-bold text-amber-300 shadow-inner">
                    {selectedCell ? selectedCell.arabicText : selectedWord?.word}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400 text-sm sm:text-base font-urdu">
                        {selectedCell ? selectedCell.hijjaSpelling : selectedWord?.hijjaText}
                      </span>
                      {((selectedCell?.isHeavy) || (selectedWord?.isHeavy)) && (
                        <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/40 px-1.5 py-0.5 rounded-full font-urdu font-bold">
                          پُر حرف
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-urdu mt-0.5">
                      {selectedCell 
                        ? (selectedCell.maddahType === 'alif' 
                            ? 'الف مدہ: الف سے پہلے زبر، ایک الف (دو حرکات) کھینچیں' 
                            : selectedCell.maddahType === 'waw' 
                            ? 'واؤ مدہ: واؤ ساکن سے پہلے پیش، ایک الف کھینچیں' 
                            : 'یاء مدہ: یاء ساکن سے پہلے زیر، ایک الف کھینچیں')
                        : selectedWord?.tajweedNotes || 'حروفِ مدہ کو ایک الف یعنی دو حرکات کے برابر کھینچ کر پڑھیں۔'}
                    </p>
                  </div>
                </div>

                {/* Navigation & Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateCell('prev')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="پچھلا حرف"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (selectedCell) handlePlayCell(selectedCell);
                      else if (selectedWord) handlePlayWord(selectedWord);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>دوبارہ سنیں</span>
                  </button>

                  <button
                    onClick={() => navigateCell('next')}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    title="اگلا حرف"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCell(null);
                      setSelectedWord(null);
                    }}
                    className="p-2 rounded-xl bg-rose-900/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs"
                    title="بند کریں"
                  >
                    ✕
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
