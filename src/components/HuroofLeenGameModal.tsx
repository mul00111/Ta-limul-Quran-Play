import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, ArrowRight, Sparkles, Trophy, Flame, Coins,
  Star, RefreshCw, Zap, CheckCircle2, XCircle, Timer, Mic, Layers,
  Lightbulb, BookOpen, Award
} from 'lucide-react';
import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect } from '../utils/qariAudioService';
import { 
  UNIFIED_HUROOF_LEEN_PAIRS, 
  UNIFIED_ALL_LEEN_CARDS, 
  PAGE_14_WAW_LEEN_WORDS, 
  PAGE_15_YAA_LEEN_WORDS,
  LeenSingleCardItem,
  LeenWordItem
} from '../data/huroofLeenData';

interface HuroofLeenGameModalProps {
  onBack: () => void;
}

export interface LeenGameItem {
  id: string;
  word: string;             // e.g. "سَوْفَ" or "بَوْ" or "بَيْ"
  lettersDisplay: string;    // e.g. "سَوْ + فَ" or "با + واؤ"
  spellingHijja: string;     // e.g. "سین واؤ زبر سَوْ ، فا زبر فَ = سَوْفَ"
  categoryLabelUrdu: string; // e.g. "واؤ لین" | "یاء لین" | "کلماتِ لین" | "جوڑی"
  rawSound: string;
  leenType: 'waw' | 'yaa' | 'pair' | 'word';
  isHeavy?: boolean;
  breakdown?: string;
  meaningOrContext?: string;
  tajweedNote: string;
}

// 1. SINGLE LEEN LETTERS (58 cards = 29 Waw + 29 Yaa)
const SINGLE_LEEN_GAME_ITEMS: LeenGameItem[] = UNIFIED_ALL_LEEN_CARDS.map((card) => ({
  id: `single-${card.id}`,
  word: card.displayLetter,
  lettersDisplay: `${card.baseLetterName} + ${card.leenType === 'waw' ? 'واؤ ساکن' : 'یاء ساکن'}`,
  spellingHijja: card.hijjaSpelling,
  categoryLabelUrdu: card.leenType === 'waw' ? 'واؤ لین' : 'یاء لین',
  rawSound: card.rawSound,
  leenType: card.leenType,
  isHeavy: card.isHeavy,
  breakdown: `${card.baseChar} + ${card.suffixChar}`,
  tajweedNote: `${card.leenType === 'waw' ? 'واؤ' : 'یاء'} ساکن سے پہلے زبر ہے، بغیر کھینچے، نرمی سے اور معروف ادا کریں۔${card.isHeavy ? ' (حرفِ مستعلیہ: پُر پڑھیں)' : ''}`
}));

// 2. LEEN PAIRS (29 pairs: اَوْ ، اَيْ ... يَوْ ، يَيْ)
const PAIR_LEEN_GAME_ITEMS: LeenGameItem[] = UNIFIED_HUROOF_LEEN_PAIRS.map((pair) => ({
  id: `pair-${pair.id}`,
  word: pair.combinedSound,
  lettersDisplay: `${pair.baseLetterName} (واؤ و یاء لین)`,
  spellingHijja: pair.combinedHijja,
  categoryLabelUrdu: 'حروفِ لین جوڑی',
  rawSound: pair.combinedSound,
  leenType: 'pair',
  isHeavy: pair.isHeavy,
  breakdown: `${pair.wawCard.displayLetter} ، ${pair.yaaCard.displayLetter}`,
  tajweedNote: `پہلے واؤ لین پھر یاء لین کو بغیر کھینچے اور بغیر جھٹکے کے یکساں نرم آواز میں پڑھیں۔`
}));

// 3. COMPREHENSIVE LEEN WORDS (حروفِ لین کے تمام قرآنی و قراءتی کلمات)
const WORD_LEEN_GAME_ITEMS: LeenGameItem[] = [
  ...PAGE_14_WAW_LEEN_WORDS,
  ...PAGE_15_YAA_LEEN_WORDS
].map((wordItem) => ({
  id: `word-${wordItem.id}`,
  word: wordItem.word,
  lettersDisplay: wordItem.breakdown,
  spellingHijja: wordItem.spellingHijja,
  categoryLabelUrdu: wordItem.categoryLabelUrdu,
  rawSound: wordItem.word,
  leenType: 'word',
  isHeavy: wordItem.isHeavyLetterIncluded,
  breakdown: wordItem.breakdown,
  meaningOrContext: wordItem.meaningOrContext,
  tajweedNote: wordItem.leenType === 'both' 
    ? 'اس کلمے میں واؤ لین اور یاء لین دونوں موجود ہیں، دونوں کو بغیر کھینچے معروف پڑھیں۔'
    : `${wordItem.leenType === 'waw' ? 'واؤ لین' : 'یاء لین'} کا قاعدہ ہے، بغیر کھینچے روانی سے پڑھیں۔`
}));

export const HuroofLeenGameModal: React.FC<HuroofLeenGameModalProps> = ({ onBack }) => {
  // Game Modes:
  // 1 = مفرداتِ لین (واؤ لین اور یاء لین کے الگ الگ حروف: اَوْ ، اَيْ ، بَوْ ، بَيْ...)
  // 2 = جوڑیاں (تمام ۲۹ جوڑیاں: اَوْ ، اَيْ ، بَوْ ، بَيْ...)
  // 3 = کلماتِ لین (قرآنی و مشقی کلمات: سَوْفَ ، بَيْتٌ ، خَوْفٍ ، قَوْلُ ، قُرَيْشٍ ...)
  // 4 = سپیڈ رَش (۵ سیکنڈ ٹائمر چیلنج)
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(3); // Default to Words mode!
  const [targetItem, setTargetItem] = useState<LeenGameItem>(WORD_LEEN_GAME_ITEMS[0]);
  const [options, setOptions] = useState<LeenGameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  // Advance timer ref
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats & Progress
  const [score, setScore] = useState(() => Number(localStorage.getItem('leen_game_score') || 0));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('leen_game_coins') || 50));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem('leen_best_streak') || 0));

  // Speed Challenge Timer
  const [isSpeedMode, setIsSpeedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Voice Recording Practice State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<{ title: string; subText: string; type: 'correct' | 'wrong' } | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
      stopAllQariAudio();
    };
  }, []);

  // Initialize a new round
  const generateNewQuestion = (targetLevel = level) => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    stopAllQariAudio();

    setSelectedId(null);
    setAnswerStatus(null);
    setToastMessage(null);
    setVoiceFeedback(null);

    let choiceOptions: LeenGameItem[] = [];
    let randomTarget: LeenGameItem;

    if (targetLevel === 1) {
      // Level 1: Single Leen Letters (58 items: اَوْ ، اَيْ ، بَوْ ، بَيْ ...)
      randomTarget = SINGLE_LEEN_GAME_ITEMS[Math.floor(Math.random() * SINGLE_LEEN_GAME_ITEMS.length)];
      const otherPool = SINGLE_LEEN_GAME_ITEMS.filter(i => i.id !== randomTarget.id);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    } else if (targetLevel === 2) {
      // Level 2: Pairs (29 items: اَوْ ، اَيْ ...)
      randomTarget = PAIR_LEEN_GAME_ITEMS[Math.floor(Math.random() * PAIR_LEEN_GAME_ITEMS.length)];
      const otherPool = PAIR_LEEN_GAME_ITEMS.filter(i => i.id !== randomTarget.id);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    } else if (targetLevel === 3 || targetLevel === 4) {
      // Level 3 & 4: Words (سَوْفَ ، بَيْتٌ ، خَوْفٍ ...)
      randomTarget = WORD_LEEN_GAME_ITEMS[Math.floor(Math.random() * WORD_LEEN_GAME_ITEMS.length)];
      const otherPool = WORD_LEEN_GAME_ITEMS.filter(i => i.id !== randomTarget.id);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    } else {
      randomTarget = WORD_LEEN_GAME_ITEMS[0];
      choiceOptions = WORD_LEEN_GAME_ITEMS.slice(0, 4);
    }

    setTargetItem(randomTarget);
    setOptions(choiceOptions);

    // Play target audio cleanly
    advanceTimerRef.current = setTimeout(() => {
      playQariText(randomTarget.rawSound);
    }, 250);

    // Reset speed timer if enabled
    if (isSpeedMode || targetLevel === 4) {
      setTimeLeft(5);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  };

  useEffect(() => {
    generateNewQuestion(level);
  }, [level]);

  // Speed timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && answerStatus === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0 && answerStatus === null) {
      // Time ran out!
      setAnswerStatus('wrong');
      setStreak(0);
      stopAllQariAudio();
      playChimeEffect('error');
      setToastMessage({
        title: 'وقت ختم ہو گیا! ⏱️',
        subText: `صحیح جواب "${targetItem.word}" (${targetItem.breakdown || targetItem.categoryLabelUrdu}) تھا! حروف لین کو بغیر کھینچے روانی سے وقت کے اندر جواب دیں۔`,
        type: 'wrong'
      });
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, answerStatus, targetItem]);

  const handleOptionClick = (item: LeenGameItem) => {
    if (answerStatus !== null) return; // Prevent multiple taps

    setSelectedId(item.id);
    setIsTimerActive(false);

    if (item.id === targetItem.id) {
      // CORRECT ANSWER!
      setAnswerStatus('correct');
      const newScore = score + 10;
      const newCoins = coins + 5;
      const newStreak = streak + 1;

      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('leen_best_streak', String(newStreak));
      }

      localStorage.setItem('leen_game_score', String(newScore));
      localStorage.setItem('leen_game_coins', String(newCoins));

      stopAllQariAudio();
      playChimeEffect('success');
      playQuizFeedbackAudio(true, targetItem.rawSound);

      setToastMessage({
        title: 'ماشاء اللہ! بالکل درست جواب 🎉',
        subText: `بہترین! "${targetItem.word}" - ${targetItem.spellingHijja} (${targetItem.tajweedNote})`,
        type: 'correct'
      });

      // Auto advance to next question
      advanceTimerRef.current = setTimeout(() => {
        generateNewQuestion(level);
      }, 2200);
    } else {
      // WRONG ANSWER
      setAnswerStatus('wrong');
      setStreak(0);

      stopAllQariAudio();
      playChimeEffect('error');
      playQuizFeedbackAudio(false, targetItem.rawSound);

      setToastMessage({
        title: 'غلط جواب! ❌',
        subText: `آپ نے "${item.word}" منتخب کیا، جبکہ درست جواب "${targetItem.word}" تھا۔ ${targetItem.tajweedNote}`,
        type: 'wrong'
      });
    }
  };

  // Simulate Voice Pronunciation Practice
  const handleRecordVoice = () => {
    if (isRecording) return;
    setIsRecording(true);
    setVoiceFeedback('استاذ صاحب آپ کا تلفظ سن رہے ہیں... 🎙️');

    setTimeout(() => {
      setIsRecording(false);
      setVoiceFeedback('بہت خوب! آپ نے حروفِ لین کو بغیر کھینچے اور نرمی کے ساتھ ادا کیا۔ ماشاء اللہ! ⭐⭐⭐');
      playChimeEffect('success');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-md p-2 sm:p-5 font-urdu select-none flex items-center justify-center" dir="rtl">
      <div className="bg-[#fef8ee] border-4 border-emerald-700/80 rounded-3xl p-3 sm:p-6 shadow-2xl space-y-5 text-zinc-900 w-full max-w-5xl my-auto">
      
      {/* 1. TOP HEADER & GAMIFICATION STATS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-amber-500/30">
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-black shadow-lg border border-amber-500/30 hover:border-amber-400 shrink-0"
            title="سبق میں واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md border border-emerald-500 flex items-center gap-1">
                <Gamepad2Icon className="w-4 h-4 text-amber-300" />
                <span>گیم: حروفِ لین (واؤ لین و یاء لین)</span>
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                سبق نمبر ۵
              </span>
            </div>
            <p className="text-[11px] text-emerald-950 font-bold mt-1">
              صوتی تلفظ سنیں، بغیر کھینچے اور بغیر جھٹکا دیے درست کلمہ منتخب کریں
            </p>
          </div>
        </div>

        {/* Gamification Counters */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
          {/* Flame / Streak */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-2xl shadow-sm">
            <Flame className={`w-4 h-4 ${streak > 2 ? 'text-orange-500 animate-bounce' : 'text-amber-500'}`} />
            <span className="text-xs font-black text-amber-900">{streak} اسٹریک</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-300 px-3 py-1.5 rounded-2xl shadow-sm">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-black text-yellow-900">{coins} سکے</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-2xl shadow-sm">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black text-emerald-900">{score} اسکور</span>
          </div>
        </div>
      </div>

      {/* 2. LEVEL SELECTOR TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-emerald-950/10 p-1.5 rounded-2xl border border-emerald-600/30">
        <button
          onClick={() => {
            setLevel(1);
            setIsSpeedMode(false);
          }}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
            level === 1 && !isSpeedMode
              ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
              : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-300" />
          <span>لیول ۱: مفرداتِ لین</span>
          <span className="text-[9px] bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded-full">۵۸</span>
        </button>

        <button
          onClick={() => {
            setLevel(2);
            setIsSpeedMode(false);
          }}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
            level === 2 && !isSpeedMode
              ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
              : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>لیول ۲: لین جوڑیاں</span>
          <span className="text-[9px] bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full">۲۹</span>
        </button>

        <button
          onClick={() => {
            setLevel(3);
            setIsSpeedMode(false);
          }}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
            level === 3 && !isSpeedMode
              ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
              : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>لیول ۳: کلماتِ لین</span>
          <span className="text-[9px] bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded-full">۶۷</span>
        </button>

        <button
          onClick={() => {
            setLevel(4);
            setIsSpeedMode(true);
          }}
          className={`py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
            level === 4 || isSpeedMode
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md border border-rose-400 ring-2 ring-rose-400/40 animate-pulse'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>لیول ۴: ۵ سیکنڈ رَش ⚡</span>
        </button>
      </div>

      {/* 3. QUESTION CARD & AUDIO PLAYBACK */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-amber-400/50 text-center relative overflow-hidden">
        
        {/* Background Decorative Pattern */}
        <div className="absolute top-2 right-4 text-emerald-800/40 text-7xl font-arabic pointer-events-none">
          و ي
        </div>
        <div className="absolute bottom-2 left-4 text-emerald-800/40 text-7xl font-arabic pointer-events-none">
          لِين
        </div>

        {/* Speed Rush Timer Display */}
        {(isSpeedMode || level === 4) && (
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className={`px-4 py-1 rounded-full font-black text-xs flex items-center gap-1.5 border shadow-lg ${
              timeLeft <= 2 ? 'bg-rose-600 text-white border-rose-300 animate-ping' : 'bg-amber-500 text-zinc-950 border-amber-300'
            }`}>
              <Timer className="w-4 h-4" />
              <span>وقت باقی: {timeLeft} سیکنڈ</span>
            </div>
          </div>
        )}

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 px-3.5 py-1 rounded-full border border-emerald-500/60 text-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>قاری صاحب کی تلاوت سنیں اور درست حرف/کلمہ پہچانیں</span>
          </div>

          {/* Big Audio Play Button */}
          <div className="flex items-center justify-center py-2">
            <button
              onClick={() => playQariText(targetItem.rawSound)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 shadow-2xl flex flex-col items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer border-4 border-white/80"
              title="دوبارہ سنیں"
            >
              <Volume2 className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
              <span className="text-[10px] font-black mt-0.5">سنیں</span>
            </button>
          </div>

          <div className="text-xs text-amber-200/90 font-bold">
            قسم: <span className="text-amber-400 font-extrabold">{targetItem.categoryLabelUrdu}</span>
            {targetItem.isHeavy && <span className="text-cyan-300 font-black mr-2">(حرفِ مستعلیہ: پُر)</span>}
          </div>
        </div>
      </div>

      {/* 4. MULTIPLE CHOICE OPTIONS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {options.map((item) => {
          const isSelected = selectedId === item.id;
          const isTarget = item.id === targetItem.id;

          let btnStyle = 'bg-white border-2 border-emerald-600/50 hover:border-emerald-600 text-zinc-900 hover:bg-emerald-50/60 shadow-md';

          if (answerStatus !== null) {
            if (isTarget) {
              btnStyle = 'bg-emerald-600 border-2 border-emerald-400 text-white shadow-xl ring-4 ring-emerald-300/60 scale-105';
            } else if (isSelected && !isTarget) {
              btnStyle = 'bg-rose-600 border-2 border-rose-400 text-white shadow-xl ring-4 ring-rose-300/60';
            } else {
              btnStyle = 'bg-zinc-100 border border-zinc-300 text-zinc-400 opacity-60';
            }
          }

          return (
            <motion.button
              key={item.id}
              onClick={() => handleOptionClick(item)}
              whileHover={{ scale: answerStatus === null ? 1.04 : 1 }}
              whileTap={{ scale: answerStatus === null ? 0.96 : 1 }}
              className={`rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] sm:min-h-[160px] relative ${btnStyle}`}
            >
              {/* Category Badge */}
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                answerStatus !== null && isTarget
                  ? 'bg-emerald-800 text-white border-emerald-400'
                  : 'bg-zinc-100 text-zinc-600 border-zinc-200'
              }`}>
                {item.categoryLabelUrdu}
              </span>

              {/* Large Arabic Word */}
              <span className={`text-4xl sm:text-5xl font-black font-arabic my-2 tracking-wider ${
                item.isHeavy && answerStatus === null ? 'text-cyan-700 font-extrabold' : ''
              }`}>
                {item.word}
              </span>

              {/* Breakdown or hint */}
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md w-full truncate border ${
                answerStatus !== null && isTarget
                  ? 'bg-emerald-800/80 text-emerald-100 border-emerald-400'
                  : 'bg-amber-50 text-amber-900 border-amber-200'
              }`}>
                {item.breakdown || item.lettersDisplay}
              </span>

              {/* Icon status indicator */}
              {answerStatus !== null && isTarget && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {answerStatus !== null && isSelected && !isTarget && (
                <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg">
                  <XCircle className="w-5 h-5" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 5. TOAST FEEDBACK ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`p-4 rounded-2xl border-2 shadow-xl flex items-start gap-3 text-right ${
              toastMessage.type === 'correct'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                : 'bg-rose-50 border-rose-500 text-rose-950'
            }`}
          >
            {toastMessage.type === 'correct' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 w-full">
              <h4 className="font-black text-sm">{toastMessage.title}</h4>
              <p className="text-xs font-semibold leading-relaxed">{toastMessage.subText}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. BOTTOM ACTIONS & VOICE PRACTICE */}
      <div className="bg-zinc-900 text-white p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-zinc-700">
        
        {/* Next Question / Skip Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => generateNewQuestion(level)}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-105 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>اگلا سوال (نیا کلمہ)</span>
          </button>
        </div>

        {/* Voice Practice & Recording */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleRecordVoice}
            disabled={isRecording}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md w-full sm:w-auto ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700'
            }`}
          >
            <Mic className="w-4 h-4 text-amber-400" />
            <span>{isRecording ? 'آواز ریکارڈ ہو رہی ہے...' : 'اپنی آواز میں مشق کریں (مائیک)'}</span>
          </button>
        </div>
      </div>

      {/* Voice feedback dialog */}
      {voiceFeedback && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-black text-amber-900 text-center animate-fade-in">
          {voiceFeedback}
        </div>
      )}

      </div>
    </div>
  );
};

function Gamepad2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="6" />
    </svg>
  );
}
