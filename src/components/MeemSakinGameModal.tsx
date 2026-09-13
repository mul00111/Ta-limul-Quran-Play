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
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  meemSakinWords,
  meemSakinRules,
  MeemSakinWord,
} from '../data/meemSakinData';
import { playQariText, playChimeEffect, stopAllQariAudio } from '../utils/qariAudioService';

interface MeemSakinGameModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

type GameMode = 'identify' | 'ghunnah_detect' | 'sort_basket' | 'speed_challenge';

export const MeemSakinGameModal: React.FC<MeemSakinGameModalProps> = ({
  isOpen = true,
  onClose,
  onBack,
}) => {
  const handleExit = onClose || onBack || (() => {});

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
  const [basketPlacedCount, setBasketPlacedCount] = useState<Record<string, number>>({
    'Idgham Shafawi': 0,
    'Ikhfa Shafawi': 0,
    'Izhar Shafawi': 0,
  });

  // Shuffled items
  const [gamePool, setGamePool] = useState<MeemSakinWord[]>([]);

  useEffect(() => {
    resetGamePool();
  }, [activeGameMode]);

  const resetGamePool = () => {
    const shuffled = [...meemSakinWords].sort(() => Math.random() - 0.5);
    setGamePool(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
    setBasketPlacedCount({
      'Idgham Shafawi': 0,
      'Ikhfa Shafawi': 0,
      'Izhar Shafawi': 0,
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

  const currentItem = gamePool[currentIndex] || meemSakinWords[0];

  const getRuleDetails = (rule: string) => {
    switch (rule) {
      case 'Idgham Shafawi':
        return {
          urduLabel: 'ادغامِ شفوی',
          targetLetter: 'میم (م)',
          isGhunnah: true,
          explanation: 'میم ساکن کے بعد دوسری میم (م) آ جائے تو میم ساکن میں ادغامِ شفوی ہو گا یعنی غنہ (ناک میں آواز روکنا) کیا جائے گا۔',
          badgeColor: 'bg-green-500/20 text-green-300 border-green-500/40',
        };
      case 'Ikhfa Shafawi':
        return {
          urduLabel: 'اخفائے شفوی',
          targetLetter: 'باء (ب)',
          isGhunnah: true,
          explanation: 'میم ساکن کے بعد حرف باء (ب) آ جائے تو میم ساکن میں اخفائے شفوی ہو گا یعنی غنہ کے ساتھ پڑھیں گے۔',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        };
      case 'Izhar Shafawi':
      default:
        return {
          urduLabel: 'اظہارِ شفوی',
          targetLetter: 'م اور ب کے علاوہ',
          isGhunnah: false,
          explanation: 'میم ساکن کے بعد باء (ب) اور میم (م) کے علاوہ کوئی اور حرف آ جائے تو میم ساکن ظاہر ہو گا، غنہ نہیں کیا جائے گا۔',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        };
    }
  };

  const currentRuleInfo = getRuleDetails(currentItem.rule);

  const handleSpeak = (text: string) => {
    if (isMuted) return;
    playQariText(text);
  };

  const handleAnswerClick = (chosenRuleOrMode: string) => {
    if (selectedAnswer !== null) return; // Prevent multi-click

    setSelectedAnswer(chosenRuleOrMode);
    let isCorrect = false;

    if (activeGameMode === 'identify' || activeGameMode === 'speed_challenge') {
      isCorrect = chosenRuleOrMode === currentItem.rule;
    } else if (activeGameMode === 'ghunnah_detect') {
      isCorrect =
        (chosenRuleOrMode === 'ghunnah' && currentRuleInfo.isGhunnah) ||
        (chosenRuleOrMode === 'no_ghunnah' && !currentRuleInfo.isGhunnah);
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

  const handleBasketSort = (chosenRule: string) => {
    const isCorrect = chosenRule === currentItem.rule;
    handleSpeak(currentItem.arabic);
    if (isCorrect) {
      playChimeEffect('success');
      setScore((s) => s + 25);
      setCoins((c) => c + 15);
      setStreak((st) => st + 1);
      setBasketPlacedCount((prev) => ({
        ...prev,
        [chosenRule]: (prev[chosenRule] || 0) + 1,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-urdu select-none overflow-hidden" dir="rtl">
      <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[750px]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-2 sm:p-3 border-b border-emerald-500/30 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleExit}
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg">👑</span>
                <h2 className="text-xs sm:text-base font-black text-emerald-300 leading-tight">
                  سبق ۱۱: میم ساکن کے قواعد (گیم زون)
                </h2>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-300 truncate">
                اظهار، اخفاء اور ادغامِ شفوی کا صوتی و بصری مقابلہ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 text-xs font-bold">
              <span>🪙</span>
              <span>{coins}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5" />
              <span>{streak}</span>
            </div>
            <button
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                if (newMuted) stopAllQariAudio();
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Rules Legend Banner */}
        <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-300 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>اظهارِ شفوی</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>ادغامِ شفوی</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>اخفائے شفوی</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] font-bold">کل کلمات: {meemSakinWords.length}</span>
        </div>

        {/* 4 Game Mode Selector Tabs */}
        <div className="bg-slate-950/90 p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setActiveGameMode('identify')}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'identify'
                ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>۱. قاعدہ شناخت</span>
          </button>

          <button
            onClick={() => setActiveGameMode('ghunnah_detect')}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'ghunnah_detect'
                ? 'bg-teal-600 text-white shadow-lg ring-2 ring-teal-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>۲. غنہ ڈیٹیکٹر</span>
          </button>

          <button
            onClick={() => setActiveGameMode('sort_basket')}
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
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
            className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeGameMode === 'speed_challenge'
                ? 'bg-amber-600 text-white shadow-lg ring-2 ring-amber-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>۴. اسپیڈ بلٹز (30s)</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 sm:space-y-3 flex-1 min-h-0">
          
          {/* Speed Challenge Timer Header */}
          {activeGameMode === 'speed_challenge' && (
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-amber-500/30 shrink-0">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                <span className="text-xs font-bold text-amber-300">
                  باقی وقت: {timeLeft} سیکنڈ
                </span>
              </div>
              <span className="text-xs font-medium text-amber-200/80">
                حل شدہ: {speedQuestionsAnswered} سوالات
              </span>
            </div>
          )}

          {/* Word Display Card */}
          <div className="bg-gradient-to-b from-[#fcfaf5] to-[#f4eee1] border-2 border-emerald-500/40 rounded-xl p-3 text-slate-900 shadow-md flex flex-col items-center justify-center relative shrink-0">
            <div className="flex items-center justify-between w-full mb-1">
              <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 rounded-full text-xs font-bold text-emerald-900">
                ترجمہ: {currentItem.urduTranslation}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${currentRuleInfo.badgeColor}`}>
                {currentRuleInfo.urduLabel}
              </span>
            </div>

            <div className="my-2 text-center">
              <h3 className="text-2xl sm:text-4xl font-black font-arabic tracking-wide text-zinc-950 leading-relaxed drop-shadow-sm">
                {currentItem.arabic}
              </h3>
            </div>

            <button
              onClick={() => handleSpeak(currentItem.arabic)}
              className="mt-1 px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>صوتی تلفظ سنیں</span>
            </button>
          </div>

          {/* MODE 1: IDENTIFY RULE BUTTONS */}
          {(activeGameMode === 'identify' || activeGameMode === 'speed_challenge') && (
            <div className="space-y-2">
              <div className="text-center text-xs font-bold text-slate-300">
                اس کلمے میں میم ساکن کا کون سا قاعدہ لاگو ہو رہا ہے؟
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'Izhar Shafawi',
                    title: '۱. اظہارِ شفوی',
                    sub: 'ب اور م کے علاوہ',
                    color: 'bg-blue-950/90 border-blue-500 text-blue-200 hover:bg-blue-900',
                  },
                  {
                    id: 'Ikhfa Shafawi',
                    title: '۲. اخفائے شفوی',
                    sub: 'حرف باء (ب)',
                    color: 'bg-rose-950/90 border-rose-500 text-rose-200 hover:bg-rose-900',
                  },
                  {
                    id: 'Idgham Shafawi',
                    title: '۳. ادغامِ شفوی',
                    sub: 'حرف میم (م)',
                    color: 'bg-green-950/90 border-green-500 text-green-200 hover:bg-green-900',
                  },
                ].map((opt) => {
                  const isSelected = selectedAnswer === opt.id;
                  const isCorrectOption = opt.id === currentItem.rule;

                  let cardStyle = opt.color;
                  if (selectedAnswer !== null) {
                    if (isCorrectOption) {
                      cardStyle = 'bg-emerald-600 border-emerald-300 text-white shadow-lg ring-2 ring-emerald-400';
                    } else if (isSelected && !isAnswerCorrect) {
                      cardStyle = 'bg-rose-600 border-rose-300 text-white';
                    } else {
                      cardStyle = 'bg-slate-900 border-slate-800 text-slate-500 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerClick(opt.id)}
                      className={`p-2.5 rounded-xl font-bold text-xs border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-0.5 shadow ${cardStyle}`}
                    >
                      <span className="font-black text-sm">{opt.title}</span>
                      <span className="text-[10px] opacity-80">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 2: GHUNNAH DETECTOR */}
          {activeGameMode === 'ghunnah_detect' && (
            <div className="space-y-2">
              <div className="text-center text-xs font-bold text-slate-300">
                کیا اس کلمے کی ادائی میں غنہ (ناک میں آواز روکنا) ہوگا یا نہیں؟
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAnswerClick('ghunnah')}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAnswer === 'ghunnah'
                      ? currentRuleInfo.isGhunnah
                        ? 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-400'
                        : 'bg-rose-600 text-white'
                      : 'bg-emerald-950/80 border-emerald-600/60 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  <span className="text-lg">✨</span>
                  <span>ہاں! غنہ کے ساتھ پڑھیں گے</span>
                  <span className="text-[10px] text-emerald-200/80">(ادغام و اخفائے شفوی)</span>
                </button>

                <button
                  onClick={() => handleAnswerClick('no_ghunnah')}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-xl font-black text-xs sm:text-sm border-2 transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    selectedAnswer === 'no_ghunnah'
                      ? !currentRuleInfo.isGhunnah
                        ? 'bg-blue-600 border-blue-300 text-white ring-2 ring-blue-400'
                        : 'bg-rose-600 text-white'
                      : 'bg-blue-950/80 border-blue-600/60 text-blue-300 hover:bg-blue-900'
                  }`}
                >
                  <span className="text-lg">⚡</span>
                  <span>نہیں! بغیر غنہ ظاہر پڑھیں گے</span>
                  <span className="text-[10px] text-blue-200/80">(اظہارِ شفوی)</span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: BASKET SORTING */}
          {activeGameMode === 'sort_basket' && (
            <div className="space-y-2">
              <div className="text-center text-xs font-bold text-slate-300">
                اس کلمہ کو اس کے درست قاعدے والی ٹوکری میں چھانٹیں:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Izhar Shafawi', label: '🔵 اظہارِ شفوی', sub: 'ب اور م کے علاوہ' },
                  { id: 'Ikhfa Shafawi', label: '🔴 اخفائے شفوی', sub: 'میم کے بعد باء (ب)' },
                  { id: 'Idgham Shafawi', label: '🟢 ادغامِ شفوی', sub: 'میم کے بعد میم (م)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBasketSort(b.id)}
                    className="p-2.5 rounded-xl bg-slate-800/90 border-2 border-slate-700 hover:border-emerald-400 hover:bg-slate-700 transition-all cursor-pointer flex flex-col items-center gap-0.5 shadow group active:scale-95"
                  >
                    <span className="text-xl">🧺</span>
                    <span className="text-xs font-black text-white group-hover:text-emerald-300">
                      {b.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{b.sub}</span>
                    <span className="mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-emerald-300 border border-slate-700">
                      چھانٹے گئے: {basketPlacedCount[b.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Explanation & Feedback Card */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-xl border-2 space-y-2 shadow-xl ${
                  isAnswerCorrect
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                    : 'bg-rose-950/90 border-rose-400 text-rose-100'
                }`}
              >
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">ماشاء اللہ! بالکل درست جواب 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-rose-300">تجویدی اصلاح (درست قاعدہ):</span>
                      </>
                    )}
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentRuleInfo.badgeColor}`}>
                    قاعدہ: {currentRuleInfo.urduLabel}
                  </span>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                    <span>💬 فیڈ بیک تجویدی کلمات:</span>
                    <button
                      onClick={() => handleSpeak(currentItem.arabic)}
                      className="text-[10px] px-2 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>تلفظ سنیں</span>
                    </button>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-200 font-urdu">
                    کلمہ <strong className="text-amber-300 font-arabic text-sm px-1">«{currentItem.arabic}»</strong> میں میم ساکن کے بعد <span className="text-rose-300 font-bold">{currentRuleInfo.targetLetter}</span> آیا ہے، اس لیے یہاں <span className="text-cyan-300 font-bold">{currentRuleInfo.urduLabel}</span> کا قاعدہ ہوگا۔
                  </p>
                  <p className="text-[11px] text-slate-300 border-t border-slate-800/80 pt-1 leading-relaxed">
                    {currentRuleInfo.explanation}
                  </p>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[11px] text-amber-300 font-mono flex items-center gap-1.5">
                  <span className="shrink-0 font-bold text-amber-400">💡 ہجے:</span>
                  <span className="truncate">{currentItem.spellingHijja}</span>
                </div>

                {activeGameMode !== 'speed_challenge' && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
        <div className="bg-slate-950 p-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <span>
            سوال {currentIndex + 1} از {gamePool.length}
          </span>
          <span>
            کل اسکور: <strong className="text-emerald-400 font-bold">{score}</strong>
          </span>
        </div>

      </div>
    </div>
  );
};
