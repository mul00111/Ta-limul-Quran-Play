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
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  tafkheemTarqeeqWords,
  tafkheemTarqeeqRules,
  TafkheemTarqeeqWord,
} from '../data/tafkheemTarqeeqData';
import {
  playQariText,
  playChimeEffect,
  stopAllQariAudio,
} from '../utils/qariAudioService';

interface TafkheemTarqeeqGameModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

type GameMode = 'identify' | 'rule_reason' | 'sort_basket' | 'speed_challenge';

export const TafkheemTarqeeqGameModal: React.FC<TafkheemTarqeeqGameModalProps> = ({
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

  // Speed challenge state
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const [speedQuestionsAnswered, setSpeedQuestionsAnswered] = useState(0);

  // Sorting Basket Game State
  const [basketCount, setBasketCount] = useState<{ pur: number; bareek: number }>({
    pur: 0,
    bareek: 0,
  });

  // Shuffled items pool
  const [gamePool, setGamePool] = useState<TafkheemTarqeeqWord[]>([]);

  useEffect(() => {
    resetGamePool();
  }, [activeGameMode]);

  const resetGamePool = () => {
    const shuffled = [...tafkheemTarqeeqWords].sort(() => Math.random() - 0.5);
    setGamePool(shuffled);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);
    setBasketCount({ pur: 0, bareek: 0 });

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

  if (!isOpen) return null;

  const currentWord = gamePool[currentIndex] || tafkheemTarqeeqWords[0];

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);

    let correct = false;
    if (activeGameMode === 'identify' || activeGameMode === 'speed_challenge') {
      if (answer === 'tafkheem' && currentWord.ruleType === 'tafkheem') correct = true;
      if (answer === 'tarqeeq' && currentWord.ruleType === 'tarqeeq') correct = true;
      if (answer === 'jawaz' && currentWord.ruleType === 'jawaz') correct = true;
    } else if (activeGameMode === 'rule_reason') {
      correct = answer === currentWord.category;
    }

    setIsAnswerCorrect(correct);
    setShowExplanation(true);

    if (correct) {
      playChimeEffect('success');
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setCoins((c) => c + 5);
      if (activeGameMode === 'speed_challenge') {
        setSpeedQuestionsAnswered((q) => q + 1);
      }
    } else {
      playChimeEffect('error');
      setStreak(0);
    }

    if (!isMuted) {
      setTimeout(() => {
        playQariText(currentWord.arabic);
      }, 300);
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

  const handleSortDrop = (target: 'pur' | 'bareek') => {
    const isTargetPur = target === 'pur';
    const isActuallyPur = currentWord.ruleType === 'tafkheem';
    const isActuallyBareek = currentWord.ruleType === 'tarqeeq';

    const correct = (isTargetPur && isActuallyPur) || (!isTargetPur && isActuallyBareek);

    if (correct) {
      playChimeEffect('success');
      setScore((s) => s + 15);
      setCoins((c) => c + 5);
      setBasketCount((prev) => ({
        ...prev,
        [target]: prev[target] + 1,
      }));
    } else {
      playChimeEffect('error');
    }

    if (!isMuted) {
      playQariText(currentWord.arabic);
    }

    if (currentIndex < gamePool.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      resetGamePool();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm font-urdu" dir="rtl">
      <div className="bg-[#fcfaf5] border-4 border-amber-500 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Game Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleExit}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-emerald-700" />
              <h2 className="text-lg sm:text-xl font-black text-emerald-900 font-urdu">
                سبق ۱۲ گیمز: تَفْخِیْم وَ تَرْقِیْق چیلنج
              </h2>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-urdu font-black">
            <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 flex items-center gap-1 shadow-xs">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{score} پوائنٹس</span>
            </div>
            <div className="bg-orange-100 border border-orange-300 px-3 py-1 rounded-xl text-orange-900 flex items-center gap-1 shadow-xs">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{streak} اسٹریک</span>
            </div>
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute) stopAllQariAudio();
              }}
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-300 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Game Modes Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-900 p-2 rounded-2xl">
          <button
            onClick={() => setActiveGameMode('identify')}
            className={`py-2 px-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeGameMode === 'identify'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 shadow-md scale-[1.02]'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            🎯 پُر یا باریک پہچانیں
          </button>
          <button
            onClick={() => setActiveGameMode('rule_reason')}
            className={`py-2 px-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeGameMode === 'rule_reason'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-zinc-950 shadow-md scale-[1.02]'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            🔍 تجویدی وجہ بتائیں
          </button>
          <button
            onClick={() => setActiveGameMode('sort_basket')}
            className={`py-2 px-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeGameMode === 'sort_basket'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-zinc-950 shadow-md scale-[1.02]'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            🧺 ٹوکریوں میں چھانٹیں
          </button>
          <button
            onClick={() => setActiveGameMode('speed_challenge')}
            className={`py-2 px-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeGameMode === 'speed_challenge'
                ? 'bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-md scale-[1.02]'
                : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            ⚡ ۳۰ سیکنڈ اسپیڈ
          </button>
        </div>

        {/* ----------------- MODE 1 & 4: IDENTIFY & SPEED CHALLENGE ----------------- */}
        {(activeGameMode === 'identify' || activeGameMode === 'speed_challenge') && (
          <div className="space-y-5">
            {activeGameMode === 'speed_challenge' && (
              <div className="flex items-center justify-between bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl font-urdu">
                <span className="font-bold text-rose-800">
                  باقی وقت: {timeLeft} سیکنڈ
                </span>
                <span className="font-bold text-zinc-700">
                  درست جوابات: {speedQuestionsAnswered}
                </span>
              </div>
            )}

            {/* Question Card */}
            <div className="bg-white border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-lg relative overflow-hidden">
              <div className="text-xs sm:text-sm font-urdu font-black text-emerald-800 bg-emerald-100 inline-block px-4 py-1 rounded-full">
                سوال #{currentIndex + 1}: مندرجہ ذیل کلمے میں حرف کا حکم کیا ہے؟
              </div>

              <div className="py-4">
                <span className="text-5xl sm:text-6xl font-arabic text-zinc-900 font-bold tracking-wide">
                  {currentWord.arabic}
                </span>
              </div>

              <button
                onClick={() => playQariText(currentWord.arabic)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-urdu font-black border border-emerald-300 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>آواز سنیں</span>
              </button>

              <div className="text-xs text-zinc-500 font-urdu">
                ترجمہ: {currentWord.urduTranslation}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={() => handleAnswerSelect('tafkheem')}
                disabled={selectedAnswer !== null}
                className={`py-4 px-5 rounded-2xl font-urdu font-black text-lg border-2 transition-all shadow-md flex items-center justify-between cursor-pointer ${
                  selectedAnswer === 'tafkheem'
                    ? isAnswerCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300'
                      : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300'
                    : selectedAnswer !== null && currentWord.ruleType === 'tafkheem'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-300 hover:border-amber-500'
                }`}
              >
                <span>پُر (موٹا) پڑھا جائے گا</span>
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">تَفْخِیْم</span>
              </button>

              <button
                onClick={() => handleAnswerSelect('tarqeeq')}
                disabled={selectedAnswer !== null}
                className={`py-4 px-5 rounded-2xl font-urdu font-black text-lg border-2 transition-all shadow-md flex items-center justify-between cursor-pointer ${
                  selectedAnswer === 'tarqeeq'
                    ? isAnswerCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300'
                      : 'bg-rose-500 text-white border-rose-600 ring-4 ring-rose-300'
                    : selectedAnswer !== null && currentWord.ruleType === 'tarqeeq'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-white hover:bg-teal-50 text-teal-900 border-teal-300 hover:border-teal-500'
                }`}
              >
                <span>باریک پڑھا جائے گا</span>
                <span className="text-xs bg-teal-100 text-teal-900 px-2 py-0.5 rounded-md">تَرْقِیْق</span>
              </button>
            </div>

            {/* Explanation & Next Banner */}
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 font-urdu space-y-2 text-right ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-base flex items-center gap-2">
                    {isAnswerCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>ماشاءاللہ! بالکل درست جواب!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span>دوبارہ غور فرمائیں:</span>
                      </>
                    )}
                  </span>
                  <button
                    onClick={handleNext}
                    className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>اگلا سوال</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-zinc-800">
                  <strong>قاعدہ: </strong> {currentWord.ruleUrdu} — {currentWord.explanation}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* ----------------- MODE 2: RULE DETECTIVE ----------------- */}
        {activeGameMode === 'rule_reason' && (
          <div className="space-y-5">
            <div className="bg-white border-2 border-teal-500/60 rounded-3xl p-6 sm:p-7 text-center space-y-3 shadow-lg">
              <div className="text-xs font-urdu font-black text-teal-800 bg-teal-100 inline-block px-4 py-1 rounded-full">
                تجویدی جاسوس: اس کلمے میں حکم کی درست وجہ منتخب کریں!
              </div>

              <div className="py-2">
                <span className="text-5xl sm:text-6xl font-arabic text-zinc-900 font-bold">
                  {currentWord.arabic}
                </span>
              </div>

              <div className="text-sm font-urdu font-black text-emerald-800">
                حکم: {currentWord.ruleUrdu}
              </div>
            </div>

            {/* Options for Rule Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'alif_pur', label: 'الف سے پہلے حرفِ مستعلیہ ہے (الف پُر)' },
                { id: 'alif_bareek', label: 'الف سے پہلے باریک حرف ہے (الف باریک)' },
                { id: 'laam_jalalat_pur', label: 'اسمِ جلالت سے پہلے زبر یا پیش ہے (لام پُر)' },
                { id: 'laam_jalalat_bareek', label: 'اسمِ جلالت سے پہلے زیر ہے (لام باریک)' },
                { id: 'raa_pur_harakat', label: 'را پر زبر/پیش یا ماقبل زبر/پیش ہے (را پُر)' },
                { id: 'raa_pur_aarizi_zer', label: 'را ساکن سے پہلے عارضی زیر یا دوسرے کلمے میں ہے' },
                { id: 'raa_pur_mutaalliya', label: 'را ساکن کے بعد حرفِ مستعلیہ ہے' },
                { id: 'raa_bareek', label: 'را کے نیچے زیر یا ماقبل زیر اصلی ہے (را باریک)' },
              ].map((opt) => {
                const isSelected = selectedAnswer === opt.id;
                const isCorrectOpt = currentWord.category === opt.id;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleAnswerSelect(opt.id)}
                    disabled={selectedAnswer !== null}
                    className={`p-3.5 rounded-xl font-urdu font-black text-xs sm:text-sm border-2 text-right transition-all cursor-pointer ${
                      isSelected
                        ? isAnswerCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-rose-500 text-white border-rose-600'
                        : selectedAnswer !== null && isCorrectOpt
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : 'bg-white hover:bg-teal-50 text-zinc-800 border-zinc-200 hover:border-teal-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 font-urdu text-right space-y-2">
                <p className="text-xs sm:text-sm text-emerald-950 font-bold">
                  {currentWord.explanation}
                </p>
                <div className="text-left">
                  <button
                    onClick={handleNext}
                    className="px-5 py-1.5 rounded-xl bg-emerald-700 text-white font-black text-xs cursor-pointer"
                  >
                    اگلا لفظ ←
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------- MODE 3: SORTING BASKETS ----------------- */}
        {activeGameMode === 'sort_basket' && (
          <div className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-center font-urdu text-xs text-amber-900">
              سامنے آئے ہوئے لفظ کو اس کی درست ٹوکری (پُر یا باریک) میں ڈالیں!
            </div>

            {/* Draggable/Clickable Central Word Card */}
            <div className="bg-white border-4 border-amber-500 rounded-3xl p-6 text-center space-y-3 shadow-xl">
              <span className="text-xs font-urdu font-black bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full">
                لفظ #{currentIndex + 1}
              </span>
              <div className="py-2">
                <span className="text-5xl sm:text-6xl font-arabic text-zinc-900 font-black">
                  {currentWord.arabic}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-urdu">
                ترجمہ: {currentWord.urduTranslation}
              </div>
            </div>

            {/* Drop Baskets */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSortDrop('pur')}
                className="bg-gradient-to-b from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-4 border-amber-400 rounded-3xl p-6 text-center font-urdu space-y-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="text-4xl">🧺</div>
                <h4 className="text-lg font-black text-amber-950">پُر (موٹا) ٹوکری</h4>
                <span className="text-xs bg-amber-500 text-white font-black px-3 py-0.5 rounded-full inline-block">
                  جمع شدہ: {basketCount.pur}
                </span>
              </button>

              <button
                onClick={() => handleSortDrop('bareek')}
                className="bg-gradient-to-b from-teal-100 to-teal-200 hover:from-teal-200 hover:to-teal-300 border-4 border-teal-400 rounded-3xl p-6 text-center font-urdu space-y-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <div className="text-4xl">🧺</div>
                <h4 className="text-lg font-black text-teal-950">باریک ٹوکری</h4>
                <span className="text-xs bg-teal-600 text-white font-black px-3 py-0.5 rounded-full inline-block">
                  جمع شدہ: {basketCount.bareek}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
