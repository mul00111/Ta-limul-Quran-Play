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
  Eye,
  Trophy,
  Filter,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  NUN_SAKIN_ALL_WORDS,
  NUN_SAKIN_RULES_SUMMARY,
  NunSakinWordItem,
  NunSakinRuleCategory,
} from '../data/nunSakinTanweenData';
import { playQariText, playChimeEffect, stopAllQariAudio } from '../utils/qariAudioService';

interface NunSakinTanweenGameModalProps {
  onBack?: () => void;
  onClose?: () => void;
}

type GameMode = 'identify' | 'ghunnah_detect' | 'sort_basket' | 'speed_challenge';

export const NunSakinTanweenGameModal: React.FC<NunSakinTanweenGameModalProps> = ({
  onBack,
  onClose,
}) => {
  const handleExit = onBack || onClose || (() => {});

  const [activeGameMode, setActiveGameMode] = useState<GameMode>('identify');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Speed challenge timer
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const [speedQuestionsAnswered, setSpeedQuestionsAnswered] = useState(0);

  // Sorting Basket Game State
  const [basketSelectedCategory, setBasketSelectedCategory] = useState<NunSakinRuleCategory | null>(null);
  const [basketPlacedCount, setBasketPlacedCount] = useState<Record<NunSakinRuleCategory, number>>({
    izhar: 0,
    ikhfa: 0,
    idgham_ghunnah: 0,
    idgham_bila_ghunnah: 0,
    iqlab: 0,
  });

  // Shuffled items
  const [gamePool, setGamePool] = useState<NunSakinWordItem[]>([]);

  useEffect(() => {
    resetGamePool();
  }, [activeGameMode]);

  const resetGamePool = () => {
    const shuffled = [...NUN_SAKIN_ALL_WORDS].sort(() => Math.random() - 0.5);
    setGamePool(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
    setBasketSelectedCategory(null);
    setBasketPlacedCount({
      izhar: 0,
      ikhfa: 0,
      idgham_ghunnah: 0,
      idgham_bila_ghunnah: 0,
      iqlab: 0,
    });

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
    return () => clearInterval(timer);
  }, [activeGameMode, isSpeedRunning, timeLeft]);

  const currentItem = gamePool[currentIndex] || NUN_SAKIN_ALL_WORDS[0];

  const handleSpeak = (text: string) => {
    if (isMuted) return;
    playQariText(text);
  };

  const handleAnswerClick = (chosenCategory: NunSakinRuleCategory | 'ghunnah' | 'no_ghunnah') => {
    if (selectedAnswer !== null) return; // Prevent multi-click

    setSelectedAnswer(chosenCategory);

    let isCorrect = false;

    if (activeGameMode === 'identify' || activeGameMode === 'speed_challenge') {
      if (chosenCategory === 'idgham_ghunnah' || chosenCategory === 'idgham_bila_ghunnah') {
        isCorrect =
          currentItem.ruleCategory === 'idgham_ghunnah' ||
          currentItem.ruleCategory === 'idgham_bila_ghunnah';
      } else {
        isCorrect = currentItem.ruleCategory === chosenCategory;
      }
    } else if (activeGameMode === 'ghunnah_detect') {
      isCorrect =
        (chosenCategory === 'ghunnah' && currentItem.isGhunnah) ||
        (chosenCategory === 'no_ghunnah' && !currentItem.isGhunnah);
    }

    setIsAnswerCorrect(isCorrect);
    setShowExplanation(true);
    handleSpeak(currentItem.arabic);

    if (isCorrect) {
      playChimeEffect('success');
      setScore((s) => s + (activeGameMode === 'speed_challenge' ? 20 : 15));
      setStreak((st) => st + 1);
      setCoins((c) => c + 10);
      if (activeGameMode === 'speed_challenge') {
        setSpeedQuestionsAnswered((q) => q + 1);
        setTimeout(() => {
          handleNextQuestion();
        }, 800);
      }
    } else {
      playChimeEffect('error');
      setStreak(0);
    }
  };

  const handleBasketSort = (chosenRule: NunSakinRuleCategory) => {
    const isCorrect = currentItem.ruleCategory === chosenRule;
    handleSpeak(currentItem.arabic);
    if (isCorrect) {
      playChimeEffect('success');
      setScore((s) => s + 25);
      setCoins((c) => c + 15);
      setStreak((st) => st + 1);
      setBasketPlacedCount((prev) => ({
        ...prev,
        [chosenRule]: prev[chosenRule] + 1,
      }));
      handleNextQuestion();
    } else {
      playChimeEffect('error');
      setStreak(0);
      setSelectedAnswer(chosenRule);
      setIsAnswerCorrect(false);
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
    if (currentIndex + 1 < gamePool.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      resetGamePool();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-urdu select-none overflow-hidden" dir="rtl">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[96vh] max-h-[750px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 p-2.5 sm:p-3.5 border-b border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              onClick={handleExit}
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg shrink-0">🎮</span>
                <h2 className="text-xs sm:text-base font-black text-teal-300 leading-snug">
                  سبق ۱۰: نون ساکن و تنوین کے قواعد
                </h2>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                اظہار، اخفاء، ادغام مع/بلا غنہ اور اقلاب کا کھیل
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-800/80 pt-1.5 sm:pt-0">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-bold">
              <span>🪙</span>
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak} تسلسل</span>
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-teal-400" />
              )}
            </button>
          </div>
        </div>

        {/* 4 Mode Selector Tabs */}
        <div className="bg-slate-950/90 p-1.5 sm:p-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveGameMode('identify')}
            className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'identify'
                ? 'bg-teal-600 text-white shadow-lg ring-2 ring-teal-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>۱. قاعدہ شناخت</span>
          </button>

          <button
            onClick={() => setActiveGameMode('ghunnah_detect')}
            className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'ghunnah_detect'
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>۲. غنہ ڈیٹیکٹر</span>
          </button>

          <button
            onClick={() => setActiveGameMode('sort_basket')}
            className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'sort_basket'
                ? 'bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>۳. ٹوکری چھانٹی</span>
          </button>

          <button
            onClick={() => setActiveGameMode('speed_challenge')}
            className={`px-2 py-1.5 rounded-lg text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'speed_challenge'
                ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>۴. اسپیڈ بلٹز (30s)</span>
          </button>
        </div>

        {/* Game Main Body */}
        <div className="p-2.5 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 flex-1 min-h-0">
          {/* Speed Challenge Banner */}
          {activeGameMode === 'speed_challenge' && (
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-amber-500/30 shrink-0">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                <span className="text-xs font-bold text-amber-300">
                  باقی وقت: {timeLeft} سیکنڈ
                </span>
              </div>
              <span className="text-[11px] font-medium text-amber-200/80">
                حل شدہ: {speedQuestionsAnswered} سوالات
              </span>
            </div>
          )}

          {/* Word Card */}
          <div className="bg-gradient-to-b from-[#fcfaf5] to-[#f4eee1] border-2 sm:border-3 border-amber-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-slate-900 shadow-md flex flex-col items-center justify-center relative shrink-0">
            {/* Target Letter Pill */}
            <div className="px-2.5 py-0.5 bg-amber-200/90 border border-amber-400 rounded-full text-[11px] sm:text-xs font-black text-amber-950 flex items-center justify-center gap-1 shadow-sm">
              <span>سبب:</span>
              <span className="text-emerald-900 font-black text-xs sm:text-sm">
                {currentItem.targetLetter}
              </span>
              <span className="text-[10px] sm:text-[11px] text-zinc-700 font-bold">({currentItem.sourceTypeLabelUrdu})</span>
            </div>

            {/* Arabic Word Display */}
            <div className="my-1.5 text-center">
              <h3 className="text-3xl sm:text-4xl font-black font-arabic tracking-wide text-zinc-950 leading-relaxed drop-shadow-sm">
                {currentItem.arabic}
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-700 font-medium">
                {currentItem.transliteration}
              </p>
            </div>

            {/* Audio Listen Button */}
            <button
              onClick={() => handleSpeak(currentItem.arabic)}
              className="mt-0.5 px-3 py-1 rounded-full bg-teal-800 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>صوتی تلفظ سنیں</span>
            </button>
          </div>

          {/* MODE 1 & 4: IDENTIFY RULE BUTTONS */}
          {(activeGameMode === 'identify' || activeGameMode === 'speed_challenge') && (
            <div className="space-y-2">
              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-300">
                اس کلمہ میں نون ساکن یا تنوین کا کون سا قاعدہ لاگو ہو رہا ہے؟
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. اِظْہَارْ */}
                <button
                  onClick={() => handleAnswerClick('izhar')}
                  disabled={selectedAnswer !== null}
                  className={`p-2.5 sm:p-3 rounded-xl font-black text-xs border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    selectedAnswer === 'izhar'
                      ? currentItem.ruleCategory === 'izhar'
                        ? 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-400/50'
                        : 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  <span className="text-base">🟢</span>
                  <span>۱. اِظْہَارْ</span>
                  <span className="text-[9px] text-emerald-200/80">حروفِ حلقی (۶)</span>
                </button>

                {/* 2. اِخْفَاءْ */}
                <button
                  onClick={() => handleAnswerClick('ikhfa')}
                  disabled={selectedAnswer !== null}
                  className={`p-2.5 sm:p-3 rounded-xl font-black text-xs border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    selectedAnswer === 'ikhfa'
                      ? currentItem.ruleCategory === 'ikhfa'
                        ? 'bg-rose-600 border-rose-300 text-white ring-2 ring-rose-400/50'
                        : 'bg-slate-800 border-rose-400 text-white'
                      : 'bg-rose-950/80 border-rose-600/60 text-rose-300 hover:bg-rose-900'
                  }`}
                >
                  <span className="text-base">🔴</span>
                  <span>۲. اِخْفَاءْ</span>
                  <span className="text-[9px] text-rose-200/80">حروفِ اخفاء (۱۵)</span>
                </button>

                {/* 3. اِدْغَامْ */}
                <button
                  onClick={() => handleAnswerClick('idgham_ghunnah')}
                  disabled={selectedAnswer !== null}
                  className={`p-2.5 sm:p-3 rounded-xl font-black text-xs border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    selectedAnswer === 'idgham_ghunnah' || selectedAnswer === 'idgham_bila_ghunnah'
                      ? currentItem.ruleCategory === 'idgham_ghunnah' || currentItem.ruleCategory === 'idgham_bila_ghunnah'
                        ? 'bg-cyan-600 border-cyan-300 text-white ring-2 ring-cyan-400/50'
                        : 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-cyan-950/80 border-cyan-600/60 text-cyan-300 hover:bg-cyan-900'
                  }`}
                >
                  <span className="text-base">🔵</span>
                  <span>۳. اِدْغَامْ</span>
                  <span className="text-[9px] text-cyan-200/80">حروفِ یرملون (۶)</span>
                </button>

                {/* 4. اِقْلَابْ */}
                <button
                  onClick={() => handleAnswerClick('iqlab')}
                  disabled={selectedAnswer !== null}
                  className={`p-2.5 sm:p-3 rounded-xl font-black text-xs border transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                    selectedAnswer === 'iqlab'
                      ? currentItem.ruleCategory === 'iqlab'
                        ? 'bg-amber-600 border-amber-300 text-slate-950 ring-2 ring-amber-400/50'
                        : 'bg-rose-600 border-rose-400 text-white'
                      : 'bg-amber-950/80 border-amber-600/60 text-amber-300 hover:bg-amber-900'
                  }`}
                >
                  <span className="text-base">🟡</span>
                  <span>۴. اِقْلَابْ</span>
                  <span className="text-[9px] text-amber-200/80">حرفِ باء (۱)</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 2: GHUNNAH DETECTOR BUTTONS */}
          {activeGameMode === 'ghunnah_detect' && (
            <div className="space-y-2">
              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-300">
                کیا اس کلمہ کی ادائی میں ۱ الف غنہ (ناک میں آواز) ہوگا یا نہیں؟
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAnswerClick('ghunnah')}
                  disabled={selectedAnswer !== null}
                  className={`p-3 sm:p-4 rounded-xl font-black text-xs sm:text-sm border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAnswer === 'ghunnah'
                      ? currentItem.isGhunnah
                        ? 'bg-teal-600 border-teal-300 text-white ring-2 ring-teal-400/50'
                        : 'bg-rose-600 text-white'
                      : 'bg-teal-950/80 border-teal-600/60 text-teal-300 hover:bg-teal-900'
                  }`}
                >
                  <span className="text-lg">✨</span>
                  <span>ہاں! غنہ کے ساتھ پڑھیں گے</span>
                  <span className="text-[10px] text-teal-200/80">(اخفاء، ادغام با غنہ، اقلاب)</span>
                </button>

                <button
                  onClick={() => handleAnswerClick('no_ghunnah')}
                  disabled={selectedAnswer !== null}
                  className={`p-3 sm:p-4 rounded-xl font-black text-xs sm:text-sm border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAnswer === 'no_ghunnah'
                      ? !currentItem.isGhunnah
                        ? 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-400/50'
                        : 'bg-rose-600 text-white'
                      : 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  <span className="text-lg">⚡</span>
                  <span>نہیں! بغیر غنہ صاف پڑھیں گے</span>
                  <span className="text-[10px] text-emerald-200/80">(اظہار اور ادغام بلا غنہ)</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: BASKET SORTING GAME */}
          {activeGameMode === 'sort_basket' && (
            <div className="space-y-2">
              <div className="text-center text-[11px] sm:text-xs font-bold text-slate-300">
                اوپر دیے گئے کلمہ کو اس کے درست قاعدہ کی ٹوکری میں چھانٹیں:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'izhar', label: '🟢 اظہار', sub: 'ء ہ ع ح غ خ', color: 'emerald' },
                  { id: 'ikhfa', label: '🔴 اخفاء', sub: '۱۵ حروف', color: 'rose' },
                  { id: 'idgham_ghunnah', label: '🟡 ادغام با غنہ', sub: 'ی ن م و', color: 'cyan' },
                  { id: 'idgham_bila_ghunnah', label: '🔵 ادغام بلا غنہ', sub: 'ل ر', color: 'blue' },
                  { id: 'iqlab', label: '🟣 اقلاب', sub: 'میم (ب)', color: 'amber' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBasketSort(b.id as any)}
                    className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-teal-400 hover:bg-slate-700 transition-all cursor-pointer flex flex-col items-center gap-0.5 shadow group active:scale-95"
                  >
                    <span className="text-base">🧺</span>
                    <span className="text-xs font-black text-white group-hover:text-teal-300">
                      {b.label}
                    </span>
                    <span className="text-[9px] text-slate-400">{b.sub}</span>
                    <span className="mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-teal-300 border border-slate-700">
                      چھانٹے گئے: {basketPlacedCount[b.id as NunSakinRuleCategory]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Explanation & Feedback Kalimat Card */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 space-y-2.5 shadow-xl ${
                  isAnswerCorrect
                    ? 'bg-teal-950/90 border-teal-400 text-teal-100'
                    : 'bg-rose-950/90 border-rose-400 text-rose-100'
                }`}
              >
                {/* Result Title & Badge */}
                <div className="flex items-center justify-between border-b border-teal-500/20 pb-2">
                  <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                        <span className="text-teal-300">ماشاء اللہ! بالکل درست جواب 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span className="text-rose-300">تجویدی اصلاح (درست قاعدہ):</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-amber-300">
                    قاعدہ: {currentItem.ruleCategoryLabelUrdu}
                  </span>
                </div>

                {/* Feedback Kalimat Box */}
                <div className="bg-slate-900/80 p-2.5 sm:p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-300">
                    <span>💬 فیڈ بیک تجویدی کلمات:</span>
                    <button
                      onClick={() => handleSpeak(currentItem.arabic)}
                      className="text-[10px] px-2 py-0.5 rounded bg-teal-800 hover:bg-teal-700 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>صوتی تلفظ دوبارہ سنیں</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-xs leading-relaxed text-slate-200 font-urdu">
                    کلمہ <strong className="text-amber-300 font-arabic text-base px-1">«{currentItem.arabic}»</strong> میں <span className="text-emerald-300 font-bold">{currentItem.sourceTypeLabelUrdu}</span> کے بعد حرف <span className="text-rose-300 font-bold">'{currentItem.targetLetter}'</span> آیا ہے، اس لیے یہاں <span className="text-cyan-300 font-bold">{currentItem.ruleCategoryLabelUrdu}</span> کا قاعدہ لاگو ہوگا۔
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-300 border-t border-slate-800/80 pt-1.5 leading-relaxed">
                    {currentItem.ruleExplanationUrdu}
                  </p>
                </div>

                {/* Spelling & Hijja */}
                <div className="bg-slate-950 p-2 sm:p-2.5 rounded-lg border border-slate-800 text-[11px] sm:text-xs text-amber-300 font-mono flex items-center gap-1.5">
                  <span className="shrink-0 font-bold text-amber-400">💡 ہجے:</span>
                  <span className="truncate">{currentItem.spellingHijja}</span>
                </div>

                {activeGameMode !== 'speed_challenge' && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>اگلا کلمہ / سوال کھیلیں</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-2.5 sm:p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>
            سوال {currentIndex + 1} از {gamePool.length}
          </span>
          <span>
            کل اسکور: <strong className="text-teal-400 font-bold">{score}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
