import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, 
  HelpCircle, RefreshCw, BookOpen, Layers, Search, Filter, AlertCircle, Award,
  Info, ChevronDown, ChevronUp, Check, Lightbulb, Gamepad2, Compass, Puzzle, Bookmark, Grid,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Type, SplitSquareVertical
} from 'lucide-react';
import { 
  playQariText, 
  stopAllQariAudio, 
  playQuizFeedbackAudio, 
  playUrduText, 
  playKhariHarakahSpellingAudio, 
  playWordWithHijjaAndPronunciation 
} from '../utils/qariAudioService';
import {
  SABAQ_7_KHARI_TRIPLETS,
  SABAQ_7_ALL_84_CELLS,
  KHARA_ZABAR_MASHQ_WORDS,
  KHARA_ZER_MASHQ_WORDS,
  ULTA_PESH_MASHQ_WORDS,
  ALL_KHARI_HARAKAT_MASHQ_WORDS,
  QAREEB_US_SAWT_PAIRS,
  KHARI_HARAKAT_RULES,
  KhariHarakahCell,
  KhariHarakahTriplet,
  KhariHarakatMashqWord,
  KhariHarakahType
} from '../data/khariHarakatData';
import { KhariHarakatGameModal } from './KhariHarakatGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { Page20ImtihanView } from './Page20ImtihanView';

interface KhariHarakatLessonModalProps {
  onBack: () => void;
}

export const KhariHarakatLessonModal: React.FC<KhariHarakatLessonModalProps> = ({ onBack }) => {
  // Main Active Tab:
  // 'bookGrid' = اصل کتابی نقشہ (۲۸ ثلاثی قطاریں: کھڑا زبر، کھڑا زیر، الٹا پیش)
  // 'khara_zabar' = کھڑا زبر + قرآنی مشق
  // 'khara_zer' = کھڑا زیر + قرآنی مشق
  // 'ulta_pesh' = الٹا پیش + قرآنی مشق
  // 'qareebSawt' = قریب الصوت حروف (ملتی جلتی آوازوں میں تقابل)
  // 'allMashq' = تمام قرآنی کلمات
  // 'imtihan' = جامع امتحان (۵۰ کلمات)
  // 'rules' = تجویدی قواعد
  // 'quiz' = کوئز و امتحان
  const [activeTab, setActiveTab] = useState<'bookGrid' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'qareebSawt' | 'allMashq' | 'imtihan' | 'rules' | 'quiz'>('bookGrid');
  
  // Font Size
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Pronunciation mode:
  // 'rawani' = بٰ ، بٖ ، بٗ (روانی)
  // 'hijja' = با کھڑا زبر بٰ ، با کھڑا زیر بٖ ، با الٹا پیش بٗ (ہجے)
  // 'compare' = بٰ = بَا  |  بٖ = بِيْ  |  بٗ = بُوْ (مدہ سے تقابل)
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja' | 'compare'>('rawani');
  
  const [filterType, setFilterType] = useState<'all' | 'heavy' | 'light' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [showGameModal, setShowGameModal] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);

  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCellId, setActiveCellId] = useState<number | null>(null);
  const [activeTripletId, setActiveTripletId] = useState<number | null>(null);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);

  // Inspector details for the currently selected item
  const [selectedCell, setSelectedCell] = useState<KhariHarakahCell | null>(null);
  const [selectedWord, setSelectedWord] = useState<KhariHarakatMashqWord | null>(null);

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
    return ALL_KHARI_HARAKAT_MASHQ_WORDS.filter(w => {
      if (filterType === 'heavy' && !w.isHeavy) return false;
      if (filterType === 'light' && w.isHeavy) return false;
      if (filterType === 'khara_zabar' && w.category !== 'khara_zabar') return false;
      if (filterType === 'khara_zer' && w.category !== 'khara_zer') return false;
      if (filterType === 'ulta_pesh' && w.category !== 'ulta_pesh') return false;
      
      if (searchQuery.trim()) {
        const q = searchQuery.trim();
        return w.word.includes(q) || w.hijjaText.includes(q) || w.tajweedNotes.includes(q) || (w.meaningOrContext && w.meaningOrContext.includes(q));
      }
      return true;
    });
  }, [filterType, searchQuery]);

  // Audio Play Cell
  const playCellAudio = (cell: KhariHarakahCell) => {
    if (isMuted) return;
    setActiveCellId(cell.id);
    setSelectedCell(cell);
    setSelectedWord(null);

    if (pronunciationMode === 'hijja') {
      const harakahName = cell.harakahType === 'khara_zabar' ? 'کھڑا زبر' : cell.harakahType === 'khara_zer' ? 'کھڑا زیر' : 'الٹا پیش';
      setActiveAudioText(cell.hijjaSpelling);
      playKhariHarakahSpellingAudio(cell.baseLetterName, harakahName, cell.rawSound);
    } else if (pronunciationMode === 'compare') {
      const soundToPlay = `${cell.displaySymbol} ، یعنی ${cell.equivalentDisplay}`;
      setActiveAudioText(soundToPlay);
      playQariText(soundToPlay);
    } else {
      setActiveAudioText(cell.rawSound);
      playQariText(cell.rawSound);
    }
  };

  // Audio Play Triplet
  const playTripletAudio = (triplet: KhariHarakahTriplet) => {
    if (isMuted) return;
    setActiveTripletId(triplet.id);
    setActiveCellId(null);
    setSelectedWord(null);

    if (pronunciationMode === 'hijja') {
      setActiveAudioText(triplet.tripletHijja);
      playWordWithHijjaAndPronunciation(triplet.tripletHijja, triplet.tripletRaw);
    } else {
      setActiveAudioText(triplet.tripletRaw);
      playQariText(triplet.tripletRaw);
    }
  };

  // Audio Play Word
  const playWordAudio = (word: KhariHarakatMashqWord) => {
    if (isMuted) return;
    setActiveWordId(word.id);
    setSelectedWord(word);
    setSelectedCell(null);

    if (pronunciationMode === 'hijja') {
      setActiveAudioText(word.hijjaText);
      playWordWithHijjaAndPronunciation(word.hijjaText, word.word);
    } else {
      setActiveAudioText(word.word);
      playQariText(word.word);
    }
  };

  // Play Sequence (Auto-read entire page)
  const handlePlaySequence = async () => {
    if (isPlayingSequence) {
      setIsPlayingSequence(false);
      stopAllQariAudio();
      return;
    }

    setIsPlayingSequence(true);
    if (activeTab === 'bookGrid') {
      for (const triplet of SABAQ_7_KHARI_TRIPLETS) {
        if (!isPlayingSequence) break;
        playTripletAudio(triplet);
        await new Promise(r => setTimeout(r, 2200));
      }
    } else if (activeTab === 'khara_zabar') {
      for (const w of KHARA_ZABAR_MASHQ_WORDS) {
        if (!isPlayingSequence) break;
        playWordAudio(w);
        await new Promise(r => setTimeout(r, 1800));
      }
    } else if (activeTab === 'khara_zer') {
      for (const w of KHARA_ZER_MASHQ_WORDS) {
        if (!isPlayingSequence) break;
        playWordAudio(w);
        await new Promise(r => setTimeout(r, 1800));
      }
    } else if (activeTab === 'ulta_pesh') {
      for (const w of ULTA_PESH_MASHQ_WORDS) {
        if (!isPlayingSequence) break;
        playWordAudio(w);
        await new Promise(r => setTimeout(r, 1800));
      }
    }
    setIsPlayingSequence(false);
  };

  // If Game Modal opened
  if (showGameModal) {
    return <KhariHarakatGameModal onBack={() => setShowGameModal(false)} />;
  }

  // If Magnetic Puzzle Board opened
  if (showMagneticGame) {
    return <MurakkabatPuzzleGameModal initialGameMode="khari_harakat" onBack={() => setShowMagneticGame(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden text-slate-800 font-urdu" dir="rtl">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full bg-[#faf7f2] shadow-2xl overflow-hidden border-x border-amber-900/10">
        
        {/* ========================================================================= */}
        {/* TOP HEADER: SABBAQ 7 (KHARI HARAKAT) - RESPONSIVE & COMPACT */}
        {/* ========================================================================= */}
        <header className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white px-3 sm:px-6 py-2 sm:py-3 border-b-2 border-amber-500/30 sticky top-0 z-30 shadow-md">
          <div className="flex items-center justify-between gap-2">
            
            {/* Back Button & Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={onBack}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
                title="واپس جائیں"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-black shadow shrink-0">
                  سبق ۷
                </span>
                <h1 className="text-sm sm:text-xl font-bold font-urdu tracking-wide text-amber-200 truncate">
                  کھڑی حرکات (کھڑا زبر، کھڑا زیر، الٹا پیش)
                </h1>
              </div>
            </div>

            {/* Top Quick Actions (Games, Magnetic Puzzle, Sound) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setShowGameModal(true)}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1 shadow-md transition-transform active:scale-95"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span className="font-urdu">گیمز</span>
              </button>

              <button
                onClick={() => setShowMagneticGame(true)}
                className="flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 text-xs sm:text-sm font-bold border border-emerald-500/40 items-center gap-1.5 transition-all"
              >
                <Puzzle className="w-3.5 h-3.5" />
                <span>پزل</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all ${
                  isMuted 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                    : 'bg-white/10 border-white/20 text-emerald-200 hover:bg-white/20'
                }`}
                title={isMuted ? 'آواز کھولیں' : 'آواز بند کریں'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS (SLIM HORIZONTAL SCROLL) */}
        {/* ========================================================================= */}
        <div className="bg-emerald-950/95 border-b border-emerald-800/60 px-2 sm:px-4 py-1.5 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none text-white shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('bookGrid')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'bookGrid'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>اصل کتابی نقشہ (۲۸ ثلاثی)</span>
            </button>

            <button
              onClick={() => setActiveTab('khara_zabar')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'khara_zabar'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <span className="font-arabic font-bold text-amber-300">ــٰ</span>
              <span>کھڑا زبر و مشق</span>
            </button>

            <button
              onClick={() => setActiveTab('khara_zer')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'khara_zer'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <span className="font-arabic font-bold text-amber-300">ــٖ</span>
              <span>کھڑا زیر و مشق</span>
            </button>

            <button
              onClick={() => setActiveTab('ulta_pesh')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'ulta_pesh'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <span className="font-arabic font-bold text-amber-300">ــٗ</span>
              <span>الٹا پیش و مشق</span>
            </button>

            <button
              onClick={() => setActiveTab('qareebSawt')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'qareebSawt'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>قریب الصوت حروف</span>
            </button>

            <button
              onClick={() => setActiveTab('allMashq')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'allMashq'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>تمام کلمات</span>
            </button>

            <button
              onClick={() => setActiveTab('imtihan')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'imtihan'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>جامع امتحان (۵۰ کلمات)</span>
            </button>

            <button
              onClick={() => setActiveTab('rules')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'rules'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>قواعد</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-emerald-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>کوئز</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-CONTROLS BAR: COMPACT & EFFICIENT */}
        {/* ========================================================================= */}
        <div className="bg-[#f0ece1] border-b border-amber-900/15 px-3 sm:px-6 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs shrink-0 overflow-x-auto scrollbar-none">
          
          {/* Pronunciation Selector */}
          <div className="flex items-center gap-1.5 font-urdu shrink-0">
            <span className="font-bold text-emerald-950 hidden sm:inline">انداز:</span>
            <div className="flex bg-white rounded-xl p-0.5 border border-amber-900/20 shadow-sm">
              <button
                onClick={() => setPronunciationMode('rawani')}
                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                  pronunciationMode === 'rawani'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                روانی
              </button>
              <button
                onClick={() => setPronunciationMode('hijja')}
                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                  pronunciationMode === 'hijja'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ہجے
              </button>
              <button
                onClick={() => setPronunciationMode('compare')}
                className={`px-2 py-0.5 sm:py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                  pronunciationMode === 'compare'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                تقابل
              </button>
            </div>
          </div>

          {/* Sequence Play & Font Size */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={handlePlaySequence}
              className={`px-2.5 sm:px-3 py-1 rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-all shadow-sm ${
                isPlayingSequence
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-800 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlayingSequence ? 'روکیں' : 'آٹو پلے'}</span>
            </button>

            <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded-xl border border-amber-900/20">
              <Type className="w-3 h-3 text-slate-500" />
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 py-0.5 text-[10px] sm:text-xs rounded ${fontSize === 'normal' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'}`}
              >
                عادی
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 py-0.5 text-[10px] sm:text-xs rounded ${fontSize === 'large' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'}`}
              >
                بڑا
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1 py-0.5 text-[10px] sm:text-xs rounded ${fontSize === 'xlarge' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-600'}`}
              >
                جلی
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY CONTENT AREA - FULLY VISIBLE & RESPONSIVE SCROLL */}
        {/* ========================================================================= */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 pb-24 sm:pb-28">

          {/* 1. ORIGINAL BOOK GRID: 28 TRIPLETS */}
          {activeTab === 'bookGrid' && (
            <div className="space-y-6">
              
              {/* Notice Banner */}
              <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right" dir="rtl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                    <span className="font-bold text-emerald-950 text-sm font-urdu">
                      قاعدہ: کھڑے زبر ــٰ ، کھڑے زیر ــٖ ، اور الٹے پیش ــٗ کو کھڑی حرکات کہتے ہیں۔
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-urdu leading-relaxed">
                    کھڑی حرکات حروفِ مدہ کے قائم مقام ہیں اس لیے ان کو بھی حروفِ مدہ کی طرح ۱ الف (۲ حرکات) کے برابر کھینچ کر پڑھیں۔
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-urdu px-3 py-1 rounded-lg bg-emerald-900 text-amber-300 font-bold">
                    کل ۲۸ حروف کے ۸۴ خانے
                  </span>
                </div>
              </div>

              {/* 28 Triplets Grid (Right-to-Left Arabic Reading Order) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
                {SABAQ_7_KHARI_TRIPLETS.map((triplet) => {
                  const isTripletActive = activeTripletId === triplet.id;

                  return (
                    <div
                      key={triplet.id}
                      className={`bg-white border-2 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 ${
                        isTripletActive
                          ? 'border-emerald-600 ring-2 ring-emerald-400/50 bg-emerald-50/40'
                          : 'border-amber-900/15 hover:border-emerald-600/60'
                      }`}
                    >
                      {/* Triplet Header */}
                      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">
                            {triplet.id}
                          </span>
                          <span className="font-bold text-emerald-950 font-urdu text-sm">
                            حرف {triplet.baseLetterName}
                          </span>
                          {triplet.isHeavy && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-200 font-urdu">
                              پُر (موٹا)
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => playTripletAudio(triplet)}
                          className="p-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition-transform hover:scale-110"
                          title="تینوں حرکات سنیں"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* 3 Cells: Khara Zabar, Khara Zer, Ulta Pesh */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        
                        {/* 1. Khara Zabar Cell */}
                        <button
                          onClick={() => playCellAudio(triplet.kharaZabarCell)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                            activeCellId === triplet.kharaZabarCell.id
                              ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                              : 'bg-[#fdfbf7] hover:bg-amber-50/60 border-amber-900/10'
                          }`}
                        >
                          <span className={`font-arabic font-bold text-slate-900 ${
                            fontSize === 'xlarge' ? 'text-4xl' : fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                          }`}>
                            {triplet.kharaZabarCell.displaySymbol}
                          </span>
                          <span className="text-[10px] text-slate-500 font-urdu mt-1">کھڑا زبر</span>
                        </button>

                        {/* 2. Khara Zer Cell */}
                        <button
                          onClick={() => playCellAudio(triplet.kharaZerCell)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                            activeCellId === triplet.kharaZerCell.id
                              ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400'
                              : 'bg-[#fdfbf7] hover:bg-emerald-50/60 border-amber-900/10'
                          }`}
                        >
                          <span className={`font-arabic font-bold text-slate-900 ${
                            fontSize === 'xlarge' ? 'text-4xl' : fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                          }`}>
                            {triplet.kharaZerCell.displaySymbol}
                          </span>
                          <span className="text-[10px] text-slate-500 font-urdu mt-1">کھڑا زیر</span>
                        </button>

                        {/* 3. Ulta Pesh Cell */}
                        <button
                          onClick={() => playCellAudio(triplet.ultaPeshCell)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center cursor-pointer ${
                            activeCellId === triplet.ultaPeshCell.id
                              ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-400'
                              : 'bg-[#fdfbf7] hover:bg-indigo-50/60 border-amber-900/10'
                          }`}
                        >
                          <span className={`font-arabic font-bold text-slate-900 ${
                            fontSize === 'xlarge' ? 'text-4xl' : fontSize === 'large' ? 'text-3xl' : 'text-2xl'
                          }`}>
                            {triplet.ultaPeshCell.displaySymbol}
                          </span>
                          <span className="text-[10px] text-slate-500 font-urdu mt-1">الٹا پیش</span>
                        </button>
                      </div>

                      {/* Footer Triplet Audio Info */}
                      <div className="text-[11px] text-slate-600 font-urdu bg-slate-50 rounded-lg p-1.5 text-center border border-slate-100">
                        {pronunciationMode === 'hijja' ? triplet.tripletHijja : triplet.tripletRaw}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. KHARA ZABAR TAB */}
          {activeTab === 'khara_zabar' && (
            <div className="space-y-6">
              
              {/* Header Rule */}
              <div className="bg-gradient-to-r from-amber-950 to-amber-900 text-amber-100 rounded-3xl p-5 shadow-lg text-right" dir="rtl">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base font-urdu">
                  <Sparkles className="w-5 h-5" />
                  <span>قاعدہ نمبر ۱: کھڑا زبر (الف مدہ کا قائم مقام)</span>
                </div>
                <p className="text-xs sm:text-sm font-urdu leading-relaxed mt-2 text-amber-100/90">
                  کھڑا زبر الف مدہ کی طرح ہوتا ہے اور اسے ایک الف (دو حرکات) کے بقدر کھینچ کر پڑھنا چاہیے، جیسے: <strong>طٰهٰ ، هٰذَا ، اٰدَمَ</strong> وغیرہ۔
                </p>
              </div>

              {/* Khara Zabar Mashq Words Cards */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-950 text-base font-urdu text-right" dir="rtl">
                  قرآنی مشقی کلمات (کھڑا زبر کی مثالیں):
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                  {KHARA_ZABAR_MASHQ_WORDS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => playWordAudio(w)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center gap-2 cursor-pointer ${
                        activeWordId === w.id
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-lg scale-105'
                          : 'bg-white hover:bg-amber-50/50 border-amber-900/15 shadow-sm'
                      }`}
                    >
                      <span className="font-arabic text-3xl sm:text-4xl font-bold text-slate-950">
                        {w.word}
                      </span>
                      <span className="text-xs text-emerald-900 font-urdu font-bold">
                        {w.hijjaText.split('=')[0]?.trim()}
                      </span>
                      {w.meaningOrContext && (
                        <span className="text-[10px] text-slate-500 font-urdu">
                          {w.meaningOrContext}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. KHARA ZER TAB */}
          {activeTab === 'khara_zer' && (
            <div className="space-y-6">
              
              {/* Header Rule */}
              <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-emerald-100 rounded-3xl p-5 shadow-lg text-right" dir="rtl">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base font-urdu">
                  <Sparkles className="w-5 h-5" />
                  <span>قاعدہ نمبر ۲: کھڑا زیر (یاء مدہ کا قائم مقام)</span>
                </div>
                <p className="text-xs sm:text-sm font-urdu leading-relaxed mt-2 text-emerald-100/90">
                  کھڑا زیر یاء مدہ کی طرح ہوتا ہے اور اسے ایک الف (دو حرکات) کے بقدر کھینچ کر پڑھنا چاہیے، جیسے: <strong>بِهٖ ، هٰذِهٖ ، مِثْلِهٖ</strong> وغیرہ۔
                </p>
              </div>

              {/* Khara Zer Mashq Words Cards */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-950 text-base font-urdu text-right" dir="rtl">
                  قرآنی مشقی کلمات (کھڑا زیر کی مثالیں):
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                  {KHARA_ZER_MASHQ_WORDS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => playWordAudio(w)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center gap-2 cursor-pointer ${
                        activeWordId === w.id
                          ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400 shadow-lg scale-105'
                          : 'bg-white hover:bg-emerald-50/50 border-amber-900/15 shadow-sm'
                      }`}
                    >
                      <span className="font-arabic text-3xl sm:text-4xl font-bold text-slate-950">
                        {w.word}
                      </span>
                      <span className="text-xs text-emerald-900 font-urdu font-bold">
                        {w.hijjaText.split('=')[0]?.trim()}
                      </span>
                      {w.meaningOrContext && (
                        <span className="text-[10px] text-slate-500 font-urdu">
                          {w.meaningOrContext}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. ULTA PESH TAB */}
          {activeTab === 'ulta_pesh' && (
            <div className="space-y-6">
              
              {/* Header Rule */}
              <div className="bg-gradient-to-r from-indigo-950 to-blue-950 text-indigo-100 rounded-3xl p-5 shadow-lg text-right" dir="rtl">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm sm:text-base font-urdu">
                  <Sparkles className="w-5 h-5" />
                  <span>قاعدہ نمبر ۳: الٹا پیش (واؤ مدہ کا قائم مقام)</span>
                </div>
                <p className="text-xs sm:text-sm font-urdu leading-relaxed mt-2 text-indigo-100/90">
                  الٹا پیش واؤ مدہ کی طرح ہوتا ہے اور اسے ایک الف (دو حرکات) کے بقدر کھینچ کر پڑھنا چاہیے، جیسے: <strong>دَاوٗدُ ، مَالُهٗ ، وَزَادَهٗ</strong> وغیرہ۔
                </p>
              </div>

              {/* Ulta Pesh Mashq Words Cards */}
              <div className="space-y-3">
                <h3 className="font-bold text-emerald-950 text-base font-urdu text-right" dir="rtl">
                  قرآنی مشقی کلمات (الٹا پیش کی مثالیں):
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3" dir="rtl">
                  {ULTA_PESH_MASHQ_WORDS.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => playWordAudio(w)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center gap-2 cursor-pointer ${
                        activeWordId === w.id
                          ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-400 shadow-lg scale-105'
                          : 'bg-white hover:bg-indigo-50/50 border-amber-900/15 shadow-sm'
                      }`}
                    >
                      <span className="font-arabic text-3xl sm:text-4xl font-bold text-slate-950">
                        {w.word}
                      </span>
                      <span className="text-xs text-indigo-900 font-urdu font-bold">
                        {w.hijjaText.split('=')[0]?.trim()}
                      </span>
                      {w.meaningOrContext && (
                        <span className="text-[10px] text-slate-500 font-urdu">
                          {w.meaningOrContext}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. QAREEB-US-SAWT TAB (ACOUSTIC COMPARISON) */}
          {activeTab === 'qareebSawt' && (
            <div className="space-y-6" dir="rtl">
              <div className="bg-amber-50 border-2 border-amber-400/60 rounded-3xl p-5 text-right space-y-2">
                <h3 className="font-bold text-emerald-950 text-base sm:text-lg font-urdu flex items-center gap-2">
                  <SplitSquareVertical className="w-5 h-5 text-amber-600" />
                  <span>حروفِ قریب الصوت میں واضح صوتی فرق کا تقابل</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 font-urdu leading-relaxed">
                  قریب الصوت حروف (ملتی جلتی آواز والے حروف) کی کھڑی حرکات میں باریک، موٹے، نرم اور سیٹی دار حروف کے مخارج کا واضح فرق کریں۔
                </p>
              </div>

              <div className="space-y-4">
                {QAREEB_US_SAWT_PAIRS.map((pair) => (
                  <div key={pair.id} className="bg-white rounded-3xl border-2 border-amber-900/15 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                      <h4 className="font-bold text-emerald-950 font-urdu text-sm sm:text-base">
                        {pair.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-urdu">{pair.description}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {pair.letters.map((letterItem) => (
                        <div
                          key={letterItem.letter}
                          className={`p-4 rounded-2xl border-2 space-y-2 text-center transition-all ${
                            letterItem.isHeavy
                              ? 'bg-rose-50/60 border-rose-300'
                              : 'bg-emerald-50/60 border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs font-urdu text-slate-800">
                              {letterItem.letterName}
                            </span>
                            <button
                              onClick={() => playQariText(`${letterItem.kharaZabar} ، ${letterItem.kharaZer} ، ${letterItem.ultaPesh}`)}
                              className="p-1 rounded-lg bg-white shadow-sm hover:bg-slate-100 text-emerald-900"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-1 bg-white p-2 rounded-xl border border-slate-200">
                            <span className="font-arabic text-2xl font-bold text-slate-900">{letterItem.kharaZabar}</span>
                            <span className="font-arabic text-2xl font-bold text-slate-900">{letterItem.kharaZer}</span>
                            <span className="font-arabic text-2xl font-bold text-slate-900">{letterItem.ultaPesh}</span>
                          </div>

                          <p className="text-[10px] text-slate-600 font-urdu leading-tight">
                            {letterItem.soundQuality}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. ALL MASHQ TAB */}
          {activeTab === 'allMashq' && (
            <div className="space-y-6" dir="rtl">
              
              {/* Search and Filters */}
              <div className="bg-white p-4 rounded-2xl border border-amber-900/15 shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="کلمہ، ہجے یا معنی تلاش کریں..."
                    className="w-full text-xs font-urdu border-none bg-slate-50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-urdu font-bold transition-all ${
                      filterType === 'all' ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    تمام کلمات
                  </button>
                  <button
                    onClick={() => setFilterType('khara_zabar')}
                    className={`px-3 py-1 rounded-xl text-xs font-urdu font-bold transition-all ${
                      filterType === 'khara_zabar' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    کھڑا زبر
                  </button>
                  <button
                    onClick={() => setFilterType('khara_zer')}
                    className={`px-3 py-1 rounded-xl text-xs font-urdu font-bold transition-all ${
                      filterType === 'khara_zer' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    کھڑا زیر
                  </button>
                  <button
                    onClick={() => setFilterType('ulta_pesh')}
                    className={`px-3 py-1 rounded-xl text-xs font-urdu font-bold transition-all ${
                      filterType === 'ulta_pesh' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    الٹا پیش
                  </button>
                  <button
                    onClick={() => setFilterType('heavy')}
                    className={`px-3 py-1 rounded-xl text-xs font-urdu font-bold transition-all ${
                      filterType === 'heavy' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    پُر (موٹا)
                  </button>
                </div>
              </div>

              {/* Mashq Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredMashqWords.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => playWordAudio(w)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-between text-center gap-2 cursor-pointer ${
                      activeWordId === w.id
                        ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400 shadow-lg scale-105'
                        : 'bg-white hover:bg-amber-50/50 border-amber-900/15 shadow-sm'
                    }`}
                  >
                    <span className="font-arabic text-3xl sm:text-4xl font-bold text-slate-950">
                      {w.word}
                    </span>
                    <span className="text-xs text-emerald-900 font-urdu font-bold">
                      {w.hijjaText.split('=')[0]?.trim()}
                    </span>
                    {w.meaningOrContext && (
                      <span className="text-[10px] text-slate-500 font-urdu">
                        {w.meaningOrContext}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: IMTIHAN PAGE 20 (جامع امتحان - ۵۰ کلمات) */}
          {/* ========================================================================= */}
          {activeTab === 'imtihan' && (
            <Page20ImtihanView accentColor="amber" />
          )}

          {/* 7. TAJWEED RULES TAB */}
          {activeTab === 'rules' && (
            <div className="max-w-4xl mx-auto space-y-4" dir="rtl">
              <div className="bg-emerald-950 text-emerald-100 p-5 rounded-3xl shadow-lg space-y-2">
                <h3 className="font-bold text-lg font-urdu text-amber-300 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>سبق نمبر (۷) : قواعدِ کھڑی حرکات</span>
                </h3>
                <p className="text-xs font-urdu text-emerald-200/90">
                  تجوید کے تمام مستند ۶ قواعد آواز اور مثالوں کے ساتھ ملاحظہ فرمائیں:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {KHARI_HARAKAT_RULES.map((rule) => (
                  <div key={rule.id} className="bg-white p-5 rounded-3xl border-2 border-amber-900/15 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-900 text-amber-300 text-xs font-bold flex items-center justify-center font-mono">
                        {rule.id}
                      </span>
                      <h4 className="font-bold text-emerald-950 font-urdu text-base">
                        {rule.title}
                      </h4>
                      <button
                        onClick={() => playUrduText(`${rule.title}۔ ${rule.urduDescription}`)}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900"
                        title="قاعدہ سنیں"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 font-urdu leading-relaxed">
                      {rule.urduDescription}
                    </p>

                    <div className="bg-[#faf7f2] p-3 rounded-2xl border border-amber-900/10 text-center">
                      <span className="font-arabic text-xl font-bold text-emerald-900">
                        {rule.exampleArabic}
                      </span>
                      <div className="text-[10px] text-amber-700 font-urdu font-bold mt-1">
                        {rule.highlightText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. QUIZ TAB */}
          {activeTab === 'quiz' && (
            <div className="max-w-2xl mx-auto space-y-6 text-center" dir="rtl">
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-600/40 shadow-xl space-y-4">
                <Award className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-xl font-bold font-urdu text-emerald-950">
                  کھڑی حرکات جامع ٹیسٹ و کوئز
                </h3>
                <p className="text-xs font-urdu text-slate-600">
                  صوتی اور بصری گیم زون میں جا کر چاروں پرلطف گیمز کے ذریعے امتحان دیں!
                </p>
                <button
                  onClick={() => setShowGameModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg transition-transform hover:scale-105"
                >
                  🚀 گیم زون شروع کریں
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM ACTIVE AUDIO INSPECTOR BAR (COLLAPSIBLE FOR FULL-SCREEN VIEW) */}
        {/* ========================================================================= */}
        <footer className="bg-emerald-950 text-white px-3 sm:px-6 py-2 sm:py-2.5 border-t border-emerald-800/80 flex items-center justify-between gap-2 text-right shrink-0" dir="rtl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow">
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

            {!isFooterCollapsed ? (
              <div className="min-w-0">
                <div className="text-xs text-amber-300 font-urdu font-bold truncate">
                  {selectedCell 
                    ? `حرف: ${selectedCell.baseLetterName} (${selectedCell.displaySymbol})`
                    : selectedWord 
                    ? `کلمہ: ${selectedWord.word}`
                    : 'کسی بھی خانے یا کلمے پر کلک کر کے تجوید کے ساتھ سنیں'}
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-200/80 font-urdu truncate hidden sm:block">
                  {selectedCell 
                    ? selectedCell.tajweedNote
                    : selectedWord 
                    ? selectedWord.tajweedNotes
                    : 'کھڑی حرکات (کھڑا زبر ، کھڑا زیر ، الٹا پیش) = ۱ الف کے برابر مد'}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-200/70 font-urdu">
                (تجوید نوٹس مخفی ہیں)
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsFooterCollapsed(!isFooterCollapsed)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 text-xs flex items-center gap-1 border border-white/10"
              title={isFooterCollapsed ? 'تجوید پٹی کھولیں' : 'تجوید پٹی چھوٹی کریں'}
            >
              {isFooterCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setShowGameModal(true)}
              className="px-2.5 sm:px-3.5 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-urdu shadow transition-transform active:scale-95"
            >
              گیمز 🎮
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
