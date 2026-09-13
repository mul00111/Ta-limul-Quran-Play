import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, ArrowRight, Sparkles, Trophy, Flame, Coins,
  Star, RefreshCw, Zap, CheckCircle2, XCircle, Timer, Mic, Layers,
  Lightbulb, BookOpen, Award, Puzzle, HelpCircle
} from 'lucide-react';
import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect, playUrduText } from '../utils/qariAudioService';
import {
  SABAQ_7_KHARI_TRIPLETS,
  SABAQ_7_ALL_84_CELLS,
  KHARA_ZABAR_MASHQ_WORDS,
  KHARA_ZER_MASHQ_WORDS,
  ULTA_PESH_MASHQ_WORDS,
  ALL_KHARI_HARAKAT_MASHQ_WORDS,
  QAREEB_US_SAWT_PAIRS,
  KhariHarakahCell,
  KhariHarakahTriplet,
  KhariHarakatMashqWord
} from '../data/khariHarakatData';

interface KhariHarakatGameModalProps {
  onBack: () => void;
  initialMode?: 'quiz' | 'puzzle' | 'match' | 'speed';
}

export interface KhariGameItem {
  id: string;
  word: string;
  lettersDisplay: string;
  spellingHijja: string;
  categoryLabelUrdu: string;
  rawSound: string;
  harakahType: 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'triplet' | 'mixed';
  isHeavy?: boolean;
  breakdown?: string;
  meaningOrContext?: string;
  tajweedNote: string;
  breakdownParts: string[];
}

// 1. SINGLE KHARI HARAKAT CELLS (84 items)
const SINGLE_CELL_GAME_ITEMS: KhariGameItem[] = SABAQ_7_ALL_84_CELLS.map((cell) => ({
  id: `cell-${cell.id}`,
  word: cell.displaySymbol,
  lettersDisplay: `${cell.baseLetterName} + ${cell.harakahType === 'khara_zabar' ? 'کھڑا زبر' : cell.harakahType === 'khara_zer' ? 'کھڑا زیر' : 'الٹا پیش'}`,
  spellingHijja: cell.hijjaSpelling,
  categoryLabelUrdu: cell.harakahType === 'khara_zabar' ? 'کھڑا زبر' : cell.harakahType === 'khara_zer' ? 'کھڑا زیر' : 'الٹا پیش',
  rawSound: cell.rawSound,
  harakahType: cell.harakahType,
  isHeavy: cell.isHeavy,
  breakdown: cell.displaySymbol,
  tajweedNote: `${cell.harakahType === 'khara_zabar' ? 'کھڑا زبر الف مدہ کی طرح' : cell.harakahType === 'khara_zer' ? 'کھڑا زیر یاء مدہ کی طرح' : 'الٹا پیش واؤ مدہ کی طرح'} ۱ الف (دو حرکات) کھینچ کر پڑھیں۔${cell.isHeavy ? ' (حرفِ مستعلیہ: پُر پڑھیں)' : ''}`,
  breakdownParts: [cell.displaySymbol]
}));

// 2. TRIPLET ITEMS (28 items: بٰ ، بٖ ، بٗ ...)
const TRIPLET_GAME_ITEMS: KhariGameItem[] = SABAQ_7_KHARI_TRIPLETS.map((t) => ({
  id: `triplet-${t.id}`,
  word: t.tripletRaw,
  lettersDisplay: `${t.baseLetterName} (کھڑا زبر، کھڑا زیر، الٹا پیش)`,
  spellingHijja: t.tripletHijja,
  categoryLabelUrdu: 'کھڑی حرکات ثلاثی',
  rawSound: t.tripletRaw,
  harakahType: 'triplet',
  isHeavy: t.isHeavy,
  breakdown: `${t.kharaZabarCell.displaySymbol} ، ${t.kharaZerCell.displaySymbol} ، ${t.ultaPeshCell.displaySymbol}`,
  tajweedNote: `تینوں کھڑی حرکات کو حروفِ مدہ کی طرح برابر ۱، ۱ الف کھینچ کر پڑھیں۔${t.isHeavy ? ' (پُر پڑھیں)' : ''}`,
  breakdownParts: [t.kharaZabarCell.displaySymbol, t.kharaZerCell.displaySymbol, t.ultaPeshCell.displaySymbol]
}));

// 3. QURANIC MASHQ WORDS ITEMS
const MASHQ_GAME_ITEMS: KhariGameItem[] = ALL_KHARI_HARAKAT_MASHQ_WORDS.map((w) => {
  const parts = w.syllableBreakdown && w.syllableBreakdown.length > 0 ? w.syllableBreakdown : [w.word];
  return {
    id: `word-${w.id}`,
    word: w.word,
    lettersDisplay: parts.join(' + '),
    spellingHijja: w.hijjaText,
    categoryLabelUrdu: w.category === 'khara_zabar' ? 'کھڑا زبر کلمات' : w.category === 'khara_zer' ? 'کھڑا زیر کلمات' : w.category === 'ulta_pesh' ? 'الٹا پیش کلمات' : 'مرکب کھڑی حرکات',
    rawSound: w.rawSound,
    harakahType: w.harakahType,
    isHeavy: w.isHeavy,
    breakdown: parts.join(' • '),
    meaningOrContext: w.meaningOrContext,
    tajweedNote: w.tajweedNotes,
    breakdownParts: parts
  };
});

const ALL_KHARI_GAME_ITEMS: KhariGameItem[] = [
  ...MASHQ_GAME_ITEMS,
  ...SINGLE_CELL_GAME_ITEMS,
  ...TRIPLET_GAME_ITEMS
];

interface MatchCard {
  id: string;
  content: string;
  pairKey: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'text' | 'sound';
}

export const KhariHarakatGameModal: React.FC<KhariHarakatGameModalProps> = ({
  onBack,
  initialMode = 'quiz'
}) => {
  const [gameTab, setGameTab] = useState<'quiz' | 'puzzle' | 'match' | 'speed'>(initialMode);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(150);
  const [multiplier, setMultiplier] = useState(1);

  // 1. QUIZ STATE
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswerState, setQuizAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  // 2. PUZZLE ASSEMBLY STATE
  const [puzzleTargetItem, setPuzzleTargetItem] = useState<KhariGameItem>(MASHQ_GAME_ITEMS[0]);
  const [puzzlePool, setPuzzlePool] = useState<string[]>([]);
  const [puzzleCurrentSlots, setPuzzleCurrentSlots] = useState<string[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<'building' | 'success'>('building');

  // 3. MEMORY MATCH STATE
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);

  // 4. SPEED RUSH STATE
  const [speedScore, setSpeedScore] = useState(0);
  const [speedTimeLeft, setSpeedTimeLeft] = useState(30);
  const [speedActive, setSpeedActive] = useState(false);
  const [speedCurrentItem, setSpeedCurrentItem] = useState<KhariGameItem>(ALL_KHARI_GAME_ITEMS[0]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate Quiz Questions
  const generateQuizQuestions = () => {
    const list = [...ALL_KHARI_GAME_ITEMS].sort(() => Math.random() - 0.5);
    const questions = list.slice(0, 15).map((target) => {
      // Pick 3 distractors
      const distractors = ALL_KHARI_GAME_ITEMS
        .filter(x => x.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      const correctIdx = options.findIndex(o => o.id === target.id);

      return {
        target,
        options,
        correctIdx,
        questionType: Math.random() > 0.4 ? 'identify_sound' : 'identify_rule'
      };
    });
    setQuizQuestions(questions);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizAnswerState('idle');
    setShowExplanation(false);
  };

  useEffect(() => {
    generateQuizQuestions();
  }, []);

  // Initialize Puzzle
  const loadPuzzle = (item?: KhariGameItem) => {
    const target = item || MASHQ_GAME_ITEMS[Math.floor(Math.random() * MASHQ_GAME_ITEMS.length)];
    setPuzzleTargetItem(target);

    const parts = [...target.breakdownParts];
    // Add 2 decoy parts from other items
    const decoys = ['مَ', 'تِ', 'لَ', 'رِ', 'بُ', 'هٖ', 'وٗ', 'ذٰ', 'طٰ'].filter(d => !parts.includes(d)).slice(0, 2);
    const pool = [...parts, ...decoys].sort(() => Math.random() - 0.5);

    setPuzzlePool(pool);
    setPuzzleCurrentSlots([]);
    setPuzzleStatus('building');
    playQariText(target.rawSound);
  };

  useEffect(() => {
    if (gameTab === 'puzzle') {
      loadPuzzle();
    }
  }, [gameTab]);

  // Initialize Memory Match
  const initMatchGame = () => {
    const sample = [...MASHQ_GAME_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6);
    const cards: MatchCard[] = [];
    sample.forEach((w, idx) => {
      cards.push({
        id: `card-${idx}-word`,
        content: w.word,
        pairKey: `pair-${w.id}`,
        isFlipped: false,
        isMatched: false,
        type: 'text'
      });
      cards.push({
        id: `card-${idx}-hijja`,
        content: w.spellingHijja.split('=')[0]?.trim() || w.word,
        pairKey: `pair-${w.id}`,
        isFlipped: false,
        isMatched: false,
        type: 'sound'
      });
    });
    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCardIds([]);
    setMatchMoves(0);
  };

  useEffect(() => {
    if (gameTab === 'match') {
      initMatchGame();
    }
  }, [gameTab]);

  const handleFlipCard = (card: MatchCard) => {
    if (card.isFlipped || card.isMatched || flippedCardIds.length >= 2) return;

    playQariText(card.content);
    const newFlipped = [...flippedCardIds, card.id];
    setFlippedCardIds(newFlipped);

    setMatchCards(prev => prev.map(c => c.id === card.id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      setMatchMoves(m => m + 1);
      const firstCard = matchCards.find(c => c.id === newFlipped[0]);
      const secondCard = card;

      if (firstCard && firstCard.pairKey === secondCard.pairKey) {
        // MATCH!
        playChimeEffect('success');
        setScore(s => s + 15);
        setCoins(c => c + 3);
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => 
            c.id === firstCard.id || c.id === secondCard.id ? { ...c, isMatched: true } : c
          ));
          setFlippedCardIds([]);
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          setMatchCards(prev => prev.map(c => 
            c.id === firstCard?.id || c.id === secondCard.id ? { ...c, isFlipped: false } : c
          ));
          setFlippedCardIds([]);
        }, 1200);
      }
    }
  };

  // Speed Challenge Handlers
  const startSpeedRush = () => {
    setSpeedScore(0);
    setSpeedTimeLeft(30);
    setSpeedActive(true);
    setSpeedCurrentItem(ALL_KHARI_GAME_ITEMS[Math.floor(Math.random() * ALL_KHARI_GAME_ITEMS.length)]);
  };

  useEffect(() => {
    if (speedActive && speedTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setSpeedTimeLeft(t => t - 1);
      }, 1000);
    } else if (speedTimeLeft === 0 && speedActive) {
      setSpeedActive(false);
      playChimeEffect('success');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speedActive, speedTimeLeft]);

  const handleSpeedAnswer = (selectedType: 'khara_zabar' | 'khara_zer' | 'ulta_pesh') => {
    if (!speedActive) return;

    const isCorrect = speedCurrentItem.harakahType === selectedType || 
      (selectedType === 'khara_zabar' && speedCurrentItem.word.includes('ٰ')) ||
      (selectedType === 'khara_zer' && speedCurrentItem.word.includes('ٖ')) ||
      (selectedType === 'ulta_pesh' && speedCurrentItem.word.includes('ٗ'));

    if (isCorrect) {
      playChimeEffect('success');
      setSpeedScore(s => s + 10);
      setScore(s => s + 10);
      setCoins(c => c + 2);
    } else {
      playChimeEffect('error');
    }

    setSpeedCurrentItem(ALL_KHARI_GAME_ITEMS[Math.floor(Math.random() * ALL_KHARI_GAME_ITEMS.length)]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden text-slate-100 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Game Navigation & Status Bar - Fully Responsive */}
        <header className="px-2.5 sm:px-6 py-2 sm:py-3.5 border-b border-slate-800 bg-slate-950/95 sticky top-0 z-30 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            
            <div className="flex items-center justify-between w-full sm:w-auto gap-2 shrink-0">
              {/* 1. Back Button */}
              <button
                onClick={onBack}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
                title="سبق پر واپس جائیں"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>

              {/* Player Stats on Mobile */}
              <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-xl">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-black text-amber-300 text-xs">{score}</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 py-1 rounded-xl">
                  <Coins className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-black text-yellow-300 text-xs">{coins}</span>
                </div>
              </div>
            </div>

            {/* 2. Header Title & Badge */}
            <div className="flex flex-col items-center text-center min-w-0 px-1 my-0.5 sm:my-0">
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <span className="bg-amber-400/20 text-amber-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-black border border-amber-400/30 whitespace-nowrap">
                  🎮 سبق نمبر ۷
                </span>
                <h1 className="text-xs sm:text-base md:text-lg font-black text-white font-urdu text-center">
                  کھڑی حرکات گیم زون
                </h1>
              </div>
              <span className="text-[10px] text-slate-400 font-urdu hidden sm:inline-block mt-0.5">
                کھڑا زبر ( ــٰ ) • کھڑا زیر ( ــٖ ) • الٹا پیش ( ــٗ )
              </span>
            </div>

            {/* 3. Player Stats on Desktop */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2 sm:px-3 py-1 rounded-xl shadow-inner">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="font-black text-amber-300 text-xs sm:text-sm">{score}</span>
                <span className="text-[9px] text-amber-400/70 hidden md:inline font-urdu">پوائنٹس</span>
              </div>

              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2 sm:px-3 py-1 rounded-xl shadow-inner">
                <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="font-black text-yellow-300 text-xs sm:text-sm">{coins}</span>
                <span className="text-[9px] text-yellow-400/70 hidden md:inline font-urdu">سکے</span>
              </div>

              {streak > 1 && (
                <div className="flex items-center gap-0.5 bg-rose-500/20 border border-rose-500/40 px-1.5 sm:px-2 py-1 rounded-xl animate-pulse">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-black text-rose-300 text-[10px] sm:text-xs">x{multiplier}</span>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Game Mode Tabs: Quiz, Puzzle, Memory Match, Speed Rush */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max mx-auto sm:mx-0">
            <button
              onClick={() => setGameTab('quiz')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                gameTab === 'quiz'
                  ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-950/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>۱. تجوید کوئز</span>
            </button>

            <button
              onClick={() => setGameTab('puzzle')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                gameTab === 'puzzle'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>۲. کلمات و ہجے پزل</span>
            </button>

            <button
              onClick={() => setGameTab('match')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                gameTab === 'match'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>۳. میموری میچ</span>
            </button>

            <button
              onClick={() => setGameTab('speed')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                gameTab === 'speed'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>۴. سپیڈ چیلنج</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GAME CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6">

          {/* 1. QUIZ MODE */}
          {gameTab === 'quiz' && quizQuestions.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-urdu px-1">
                <span className="font-bold text-amber-300">سوال {currentQuizIndex + 1} از {quizQuestions.length}</span>
                <span className="bg-slate-800/90 text-slate-200 px-3 py-1 rounded-full border border-slate-700 text-[11px] font-bold">
                  {quizQuestions[currentQuizIndex]?.target?.categoryLabelUrdu}
                </span>
              </div>

              {/* Central Audio / Word Display Card */}
              <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 border-2 border-slate-700 rounded-3xl p-5 sm:p-7 text-center space-y-3.5 shadow-xl">
                <div className="flex items-center justify-center gap-2.5">
                  <button
                    onClick={() => playQariText(quizQuestions[currentQuizIndex]?.target?.rawSound)}
                    className="p-3 sm:p-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 font-bold text-xs"
                    title="آواز سنیں"
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>آواز سنیں</span>
                  </button>
                </div>

                <div className="py-2">
                  <span className="font-arabic text-5xl sm:text-6xl md:text-7xl font-bold text-amber-300 tracking-wide drop-shadow-md inline-block leading-tight">
                    {quizQuestions[currentQuizIndex]?.target?.word}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-urdu text-slate-300">
                  اس لفظ میں کھڑی حرکت کی صحیح پہچان اور ہجے کا انتخاب کریں:
                </p>
              </div>

              {/* 4 Multi-Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {quizQuestions[currentQuizIndex]?.options.map((opt: KhariGameItem, idx: number) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === quizQuestions[currentQuizIndex].correctIdx;
                  
                  let btnStyle = 'bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-200 hover:border-amber-500/50';
                  if (quizAnswerState !== 'idle') {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600 border-emerald-400 text-white ring-2 ring-emerald-400 shadow-lg';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600 border-rose-400 text-white';
                    } else {
                      btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  const optionLabels = ['الف', 'ب', 'ج', 'د'];

                  return (
                    <button
                      key={opt.id}
                      disabled={quizAnswerState !== 'idle'}
                      onClick={() => {
                        playQariText(opt.rawSound);
                        setSelectedOption(idx);
                        if (isCorrect) {
                          setQuizAnswerState('correct');
                          playChimeEffect('success');
                          setScore(s => s + 10 * multiplier);
                          setCoins(c => c + 2);
                          setStreak(s => s + 1);
                          setMultiplier(m => Math.min(m + 1, 4));
                        } else {
                          setQuizAnswerState('wrong');
                          playChimeEffect('error');
                          setStreak(0);
                          setMultiplier(1);
                        }
                        setShowExplanation(true);
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                      dir="rtl"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-900/80 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                          {optionLabels[idx] || (idx + 1)}
                        </span>
                        <div className="min-w-0">
                          <div className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300 leading-tight">{opt.word}</div>
                          <div className="text-[11px] sm:text-xs text-slate-300 font-urdu mt-0.5">{opt.spellingHijja}</div>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-urdu px-2 py-0.5 rounded-lg bg-slate-900/80 text-slate-300 shrink-0 border border-slate-700/60">
                        {opt.categoryLabelUrdu}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tajweed Explanation Banner & Next Question Button */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 text-right space-y-2.5 ${
                    quizAnswerState === 'correct'
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 shadow-lg'
                      : 'bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-lg'
                  }`}
                  dir="rtl"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm sm:text-base font-urdu">
                      {quizAnswerState === 'correct' ? 'ماشاءاللہ! بالکل درست جواب ✅' : 'غلط جواب! صحیح جواب دیکھیے ❌'}
                    </span>
                    <button
                      onClick={() => {
                        if (currentQuizIndex + 1 < quizQuestions.length) {
                          setCurrentQuizIndex(i => i + 1);
                          setSelectedOption(null);
                          setQuizAnswerState('idle');
                          setShowExplanation(false);
                        } else {
                          generateQuizQuestions();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                    >
                      {currentQuizIndex + 1 < quizQuestions.length ? 'اگلا سوال ➔' : 'نیا کوئز شروع کریں 🔄'}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed font-urdu text-slate-200">
                    💡 <strong>تجویدی نکتہ:</strong> {quizQuestions[currentQuizIndex]?.target?.tajweedNote}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* 2. PUZZLE ASSEMBLY MODE */}
          {gameTab === 'puzzle' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-800/90 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 text-center space-y-4 shadow-xl">
                <span className="text-xs font-urdu text-emerald-300 bg-emerald-500/20 px-3.5 py-1 rounded-full border border-emerald-500/40 font-bold inline-block">
                  کلمہ مکمل کریں اور صحیح ہجے جوڑیں 🧩
                </span>

                <div className="flex items-center justify-center gap-3 py-2">
                  <span className="font-arabic text-5xl sm:text-6xl font-bold text-emerald-300 drop-shadow">
                    {puzzleTargetItem.word}
                  </span>
                  <button
                    onClick={() => playQariText(puzzleTargetItem.rawSound)}
                    className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    title="لفظ کی آواز سنیں"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-urdu">
                  ہجے: <strong className="text-amber-300">{puzzleTargetItem.spellingHijja}</strong>
                </p>

                {/* Target Assembled Slots */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-700 min-h-[70px] flex items-center justify-center gap-3 flex-wrap" dir="rtl">
                  {puzzleTargetItem.breakdownParts.map((part, idx) => {
                    const filledVal = puzzleCurrentSlots[idx];
                    return (
                      <div
                        key={idx}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-arabic font-bold transition-all ${
                          filledVal
                            ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105'
                            : 'border-dashed border-slate-600 text-slate-500 bg-slate-900/50'
                        }`}
                      >
                        {filledVal || '?'}
                      </div>
                    );
                  })}
                </div>

                {/* Pool of Choices to Click */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-300 font-urdu">نیچے دیے گئے حصوں پر کلک کر کے ترتیب دیں:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1" dir="rtl">
                    {puzzlePool.map((piece, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playQariText(piece);
                          if (puzzleCurrentSlots.length < puzzleTargetItem.breakdownParts.length) {
                            const newSlots = [...puzzleCurrentSlots, piece];
                            setPuzzleCurrentSlots(newSlots);

                            // Check if completed
                            if (newSlots.length === puzzleTargetItem.breakdownParts.length) {
                              const isCorrect = newSlots.every((val, i) => val === puzzleTargetItem.breakdownParts[i]);
                              if (isCorrect) {
                                playChimeEffect('success');
                                setPuzzleStatus('success');
                                setScore(s => s + 20);
                                setCoins(c => c + 5);
                              } else {
                                playChimeEffect('error');
                                setTimeout(() => {
                                  setPuzzleCurrentSlots([]);
                                }, 800);
                              }
                            }
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-amber-300 font-arabic text-xl font-bold shadow transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {piece}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setPuzzleCurrentSlots([])}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-urdu border border-slate-700 font-bold cursor-pointer"
                  >
                    دوبارہ ترتیب دیں 🔄
                  </button>
                  <button
                    onClick={() => loadPuzzle()}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs font-urdu shadow cursor-pointer"
                  >
                    اگلا لفظ ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEMORY MATCH MODE */}
          {gameTab === 'match' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-urdu">
                <span>چالیں (Moves): <strong className="text-indigo-300">{matchMoves}</strong></span>
                <button
                  onClick={initMatchGame}
                  className="px-3 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 text-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>دوبارہ ملائیں</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" dir="rtl">
                {matchCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleFlipCard(card)}
                    disabled={card.isMatched || card.isFlipped}
                    className={`h-24 sm:h-28 rounded-2xl border-2 font-arabic transition-all duration-300 flex flex-col items-center justify-center p-2 text-center shadow-md ${
                      card.isMatched
                        ? 'bg-emerald-900/40 border-emerald-500 text-emerald-300 scale-95 opacity-80'
                        : card.isFlipped
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl scale-105'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-amber-400 cursor-pointer'
                    }`}
                  >
                    {card.isFlipped || card.isMatched ? (
                      <span className="text-xl sm:text-2xl font-bold">{card.content}</span>
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span className="text-[10px] text-slate-400 font-urdu">کھولیں</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 4. SPEED RUSH MODE */}
          {gameTab === 'speed' && (
            <div className="max-w-xl mx-auto space-y-6">
              <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 text-center space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <Timer className="w-5 h-5 animate-spin" />
                    <span className="text-xl font-bold font-mono">{speedTimeLeft}s</span>
                  </div>
                  <div className="text-xs text-amber-300 font-urdu font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                    اسکور: {speedScore}
                  </div>
                </div>

                {!speedActive ? (
                  <div className="space-y-4 py-4">
                    <Zap className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                    <h3 className="text-lg font-bold text-white font-urdu">۳۰ سیکنڈز سپیڈ چیلنج!</h3>
                    <p className="text-xs text-slate-300 font-urdu max-w-sm mx-auto">
                      سامنے آنے والے حروف اور کلمات کو دیکھ کر بتائیں کہ ان میں کون سی کھڑی حرکت ہے:
                    </p>
                    <button
                      onClick={startSpeedRush}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl transition-transform hover:scale-105"
                    >
                      🚀 گیم شروع کریں
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="py-4">
                      <span className="font-arabic text-6xl sm:text-7xl font-bold text-yellow-300 drop-shadow">
                        {speedCurrentItem.word}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3" dir="rtl">
                      <button
                        onClick={() => handleSpeedAnswer('khara_zabar')}
                        className="p-4 rounded-2xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold border border-amber-500/50 text-xs sm:text-sm font-urdu transition-all shadow cursor-pointer active:scale-95"
                      >
                        کھڑا زبر ( ــٰ )
                      </button>
                      <button
                        onClick={() => handleSpeedAnswer('khara_zer')}
                        className="p-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold border border-emerald-500/50 text-xs sm:text-sm font-urdu transition-all shadow cursor-pointer active:scale-95"
                      >
                        کھڑا زیر ( ــٖ )
                      </button>
                      <button
                        onClick={() => handleSpeedAnswer('ulta_pesh')}
                        className="p-4 rounded-2xl bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white font-bold border border-indigo-500/50 text-xs sm:text-sm font-urdu transition-all shadow cursor-pointer active:scale-95"
                      >
                        الٹا پیش ( ــٗ )
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
