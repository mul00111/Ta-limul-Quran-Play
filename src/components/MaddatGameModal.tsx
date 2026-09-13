import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Award,
  Flame,
  Gamepad2,
  ArrowRight,
  HelpCircle,
  Zap,
  BookOpen,
  Trophy,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MADDAT_WORDS,
  MADDAT_RULES,
  MaddWord,
  MaddType,
} from '../data/maddatData';
import {
  playQariText,
  playChimeEffect,
  playUrduText,
  stopAllQariAudio,
} from '../utils/qariAudioService';

interface MaddatGameModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

type GameMode = 'identify' | 'duration_master' | 'cause_match' | 'speed_challenge';

export const MaddatGameModal: React.FC<MaddatGameModalProps> = ({
  isOpen = true,
  onClose,
  onBack,
}) => {
  const handleExit = onClose || onBack || (() => {});

  const [activeGameMode, setActiveGameMode] = useState<GameMode>('identify');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(125);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Speed challenge state
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const [speedQuestionsAnswered, setSpeedQuestionsAnswered] = useState(0);

  // Shuffled items pool
  const [gamePool, setGamePool] = useState<MaddWord[]>([]);

  useEffect(() => {
    resetGamePool();
  }, [activeGameMode]);

  const resetGamePool = () => {
    const shuffled = [...MADDAT_WORDS].sort(() => Math.random() - 0.5);
    setGamePool(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);

    if (activeGameMode === 'speed_challenge') {
      setTimeLeft(30);
      setIsSpeedRunning(true);
      setSpeedQuestionsAnswered(0);
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (activeGameMode === 'speed_challenge' && isSpeedRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsSpeedRunning(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeGameMode, isSpeedRunning, timeLeft]);

  const currentWord = gamePool[currentIndex] || MADDAT_WORDS[0];

  const handlePlayAudio = (text: string) => {
    if (isMuted) return;
    stopAllQariAudio();
    playQariText(text);
  };

  const handleAnswerClick = (answerKey: string) => {
    if (selectedAnswer !== null && activeGameMode !== 'speed_challenge') return;

    setSelectedAnswer(answerKey);

    let isCorrect = false;

    if (activeGameMode === 'identify' || activeGameMode === 'speed_challenge') {
      isCorrect = currentWord.maddType === answerKey;
    } else if (activeGameMode === 'duration_master') {
      if (answerKey === '4') {
        isCorrect = currentWord.maddType === 'muttasil' || currentWord.maddType === 'munfasil';
      } else if (answerKey === '6') {
        isCorrect = currentWord.maddType === 'laazim' || currentWord.maddType === 'leen_laazim';
      } else if (answerKey === '2') {
        isCorrect = currentWord.maddType === 'aaridh' || currentWord.maddType === 'leen_aaridh';
      }
    } else if (activeGameMode === 'cause_match') {
      if (currentWord.causeExplanation.includes('ہمزہ')) {
        isCorrect = answerKey === 'hamzah';
      } else if (currentWord.causeExplanation.includes('اصلی') || currentWord.causeExplanation.includes('تشدید') || currentWord.causeExplanation.includes('ساکنہ')) {
        isCorrect = answerKey === 'sukoon_asli';
      } else {
        isCorrect = answerKey === 'sukoon_aaridhi';
      }
    }

    setIsAnswerCorrect(isCorrect);
    setShowExplanation(true);

    if (isCorrect) {
      playChimeEffect('success');
      setScore((s) => s + (activeGameMode === 'speed_challenge' ? 25 : 15));
      setCoins((c) => c + 5);
      setStreak((st) => st + 1);
      if (activeGameMode === 'speed_challenge') {
        setSpeedQuestionsAnswered((n) => n + 1);
        setTimeout(() => handleNext(), 600);
      }
    } else {
      playChimeEffect('error');
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);

    if (currentIndex < gamePool.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      resetGamePool();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-950 border border-purple-500/30 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[96vh]">
        {/* Top Header - Mobile Adaptive */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 px-3 sm:px-6 py-3 border-b border-purple-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExit}
                className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-95 text-amber-300 hover:text-amber-200 border border-purple-500/40 hover:border-purple-400 cursor-pointer shrink-0 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black shadow-md"
                title="واپس جائیں"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xs sm:text-base font-black text-white">
                    سبق ۱۳: مَدَّات کے قواعد
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    Madd Master
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80 truncate">
                  مدِّ متصل، منفصل، لازم، عارض و لین
                </p>
              </div>
            </div>

            {/* Audio Mute on Mobile */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer sm:hidden shrink-0"
              title={isMuted ? 'آواز چالو کریں' : 'آواز بند کریں'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            </button>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <span>🪙</span>
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak} تسلسل</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>{score}</span>
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="hidden sm:flex p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              title={isMuted ? 'آواز چالو کریں' : 'آواز بند کریں'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
            </button>
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2 sm:p-2.5 bg-slate-900/80 border-b border-slate-800/80">
          <button
            onClick={() => setActiveGameMode('identify')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeGameMode === 'identify'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">۱. مد کی قسم پہچانیں</span>
          </button>

          <button
            onClick={() => setActiveGameMode('duration_master')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeGameMode === 'duration_master'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">۲. مد کی مقدار (حرکات)</span>
          </button>

          <button
            onClick={() => setActiveGameMode('cause_match')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeGameMode === 'cause_match'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">۳. مد کا سبب تلاش کریں</span>
          </button>

          <button
            onClick={() => setActiveGameMode('speed_challenge')}
            className={`py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
              activeGameMode === 'speed_challenge'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-400 animate-pulse'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">⚡ اسپیڈ چیلنج (30s)</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col items-center justify-start sm:justify-center">
          <div className="w-full max-w-xl space-y-4">
            {/* Speed Challenge Banner */}
            {activeGameMode === 'speed_challenge' && (
              <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-rose-400" />
                  <span className="text-xs font-bold">وقت باقی: {timeLeft} سیکنڈ</span>
                </div>
                <span className="text-xs font-black bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                  درست جوابات: {speedQuestionsAnswered}
                </span>
              </div>
            )}

            {/* Word Display Box */}
            <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-purple-500/40 rounded-3xl p-4 sm:p-7 text-center shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="پچھلا کلمہ"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-400 px-1">
                    {currentIndex + 1} / {gamePool.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                    title="اگلا کلمہ"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handlePlayAudio(currentWord.arabic)}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-bold flex items-center gap-1.5 border border-purple-500/30 cursor-pointer transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>تلفظ سنیں</span>
                </button>
              </div>

              {/* Massive Arabic Word */}
              <div
                className="text-4xl sm:text-6xl font-arabic font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.25)] py-3 sm:py-5 tracking-wider cursor-pointer select-none"
                onClick={() => handlePlayAudio(currentWord.arabic)}
                dir="rtl"
                title="تلفظ سننے کیلئے کلک کریں"
              >
                {currentWord.arabic}
              </div>

              {currentWord.urduTranslation && (
                <p className="text-xs sm:text-sm text-purple-200/90 font-medium">
                  {currentWord.urduTranslation}
                </p>
              )}

              {/* Hijja hint toggle */}
              <div className="mt-2.5 inline-block px-3 py-1 rounded-xl bg-slate-800/90 text-[11px] sm:text-xs text-purple-300 border border-slate-700/80 max-w-full overflow-x-auto" dir="rtl">
                <span className="font-bold text-amber-400">ہجے : </span>
                <span>{currentWord.spellingHijja}</span>
              </div>
            </div>

            {/* Prompt Question Title */}
            <div className="text-center font-bold text-xs sm:text-sm text-slate-300">
              {activeGameMode === 'identify' || activeGameMode === 'speed_challenge'
                ? '👆 اوپر دیے گئے کلمے میں کون سی مد واقع ہوئی ہے؟'
                : activeGameMode === 'duration_master'
                  ? '⏱️ اس کلمے میں مد کو کتنی مقدار (الف / حرکات) کھینچنا چاہیے؟'
                  : '🔍 اس مد کے پیدا ہونے کا بنیادی سبب کیا ہے؟'}
            </div>

            {/* Options based on Active Mode */}
            {/* Mode 1: Identify Madd Type */}
            {(activeGameMode === 'identify' || activeGameMode === 'speed_challenge') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'muttasil', label: 'مَدِّ مُتَّصِل', sub: 'ایک ہی کلمے میں ہمزہ' },
                  { id: 'munfasil', label: 'مَدِّ مُنْفَصِل', sub: 'دوسرے کلمے میں ہمزہ' },
                  { id: 'laazim', label: 'مَدِّ لَازِم', sub: 'سکونِ اصلی / تشدید' },
                  { id: 'aaridh', label: 'مَدِّ عَارِض وقفی', sub: 'وقف کی وجہ سے سکون' },
                  { id: 'leen_aaridh', label: 'مَدِّ لِیْن عَارِض', sub: 'حرفِ لین + وقف' },
                  { id: 'leen_laazim', label: 'مَدِّ لِیْن لَازِم', sub: 'حرفِ لین + سکون اصلی' },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  const isCorrect = currentWord.maddType === opt.id;
                  let btnStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-purple-500/50';

                  if (selectedAnswer !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-lg';
                    else if (isSelected) btnStyle = 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-400/40 shadow-lg';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerClick(opt.id)}
                      disabled={selectedAnswer !== null && activeGameMode !== 'speed_challenge'}
                      className={`p-3 sm:p-3.5 rounded-2xl border-2 text-right transition-all cursor-pointer flex items-center justify-between gap-2 select-none ${btnStyle}`}
                      dir="rtl"
                    >
                      <div className="min-w-0">
                        <div className="font-black text-xs sm:text-sm text-white">{opt.label}</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-400">{opt.sub}</div>
                      </div>
                      {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode 2: Duration Master */}
            {activeGameMode === 'duration_master' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: '4', label: '۲ یا ڈھائی الف', sub: '۴ یا ۵ حرکات (مد متصل / منفصل)' },
                  { id: '6', label: '۳ الف (طولِ کامل)', sub: '۶ حرکات (مد لازم / لین لازم)' },
                  { id: '2', label: '۱، ۲ یا ۳ الف', sub: '۲، ۴ یا ۶ حرکات (مد عارض / لین عارض)' },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  let isCorrect = false;
                  if (opt.id === '4') isCorrect = currentWord.maddType === 'muttasil' || currentWord.maddType === 'munfasil';
                  else if (opt.id === '6') isCorrect = currentWord.maddType === 'laazim' || currentWord.maddType === 'leen_laazim';
                  else if (opt.id === '2') isCorrect = currentWord.maddType === 'aaridh' || currentWord.maddType === 'leen_aaridh';

                  let btnStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-emerald-500/50';

                  if (selectedAnswer !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-lg';
                    else if (isSelected) btnStyle = 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-400/40 shadow-lg';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerClick(opt.id)}
                      disabled={selectedAnswer !== null}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${btnStyle}`}
                    >
                      <span className="text-sm sm:text-base font-black text-white">{opt.label}</span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mode 3: Cause Match */}
            {activeGameMode === 'cause_match' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'hamzah', label: 'ہمزہ (ء)', desc: 'حرفِ مدہ کے بعد ہمزہ واقع ہے', icon: '✨' },
                  { id: 'sukoon_asli', label: 'سکونِ اصلی (تشدید/جزم)', desc: 'حرف پر اصلی جزم یا تشدید ہے', icon: '👑' },
                  { id: 'sukoon_aaridhi', label: 'سکونِ عارضی (وقف)', desc: 'وقف کرنے کے سبب آخری حرف ساکن ہوا', icon: '🛑' },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  let isCorrect = false;
                  if (currentWord.causeExplanation.includes('ہمزہ')) isCorrect = opt.id === 'hamzah';
                  else if (currentWord.causeExplanation.includes('اصلی') || currentWord.causeExplanation.includes('تشدید') || currentWord.causeExplanation.includes('ساکنہ')) isCorrect = opt.id === 'sukoon_asli';
                  else isCorrect = opt.id === 'sukoon_aaridhi';

                  let btnStyle = 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-blue-500/50';

                  if (selectedAnswer !== null) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40 shadow-lg';
                    else if (isSelected) btnStyle = 'bg-rose-950/90 border-rose-400 text-rose-300 ring-2 ring-rose-400/40 shadow-lg';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswerClick(opt.id)}
                      disabled={selectedAnswer !== null}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${btnStyle}`}
                    >
                      <span className="text-xl sm:text-2xl mb-0.5">{opt.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-white">{opt.label}</span>
                      <span className="text-[10px] text-slate-400">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation and Next Button */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
              >
                <div className="text-right w-full sm:w-auto" dir="rtl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-black text-purple-300">
                      قاعدہ: {currentWord.categoryLabelUrdu}
                    </span>
                    <span className="text-[11px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                      {currentWord.durationText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{currentWord.causeExplanation}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all"
                >
                  <span>اگلا کلمہ</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

