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
  MUQATTAAT_WORDS,
  MuqattaatWordItem,
} from '../data/muqattaatData';
import {
  playQariText,
  playChimeEffect,
  playUrduText,
  stopAllQariAudio,
} from '../utils/qariAudioService';

interface MuqattaatGameModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

type MuqattaatGameMode = 'identify' | 'duration_master' | 'ghunnah_detector' | 'surah_matcher' | 'speed_challenge';

export const MuqattaatGameModal: React.FC<MuqattaatGameModalProps> = ({
  isOpen = true,
  onClose,
  onBack,
  onComplete,
}) => {
  const handleExit = onBack || onClose || onComplete || (() => {});

  const [activeGameMode, setActiveGameMode] = useState<MuqattaatGameMode>('identify');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(140);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Speed challenge state
  const [timeLeft, setTimeLeft] = useState(30);
  const [isSpeedRunning, setIsSpeedRunning] = useState(false);
  const [speedQuestionsAnswered, setSpeedQuestionsAnswered] = useState(0);

  // Shuffled items pool
  const [gamePool, setGamePool] = useState<MuqattaatWordItem[]>([]);

  useEffect(() => {
    resetGamePool();
  }, [activeGameMode]);

  const resetGamePool = () => {
    const shuffled = [...MUQATTAAT_WORDS].sort(() => Math.random() - 0.5);
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

  const currentWord = gamePool[currentIndex] || MUQATTAAT_WORDS[0];

  const handlePlayAudio = (text: string) => {
    if (isMuted) return;
    stopAllQariAudio();
    playQariText(text);
  };

  const handleAnswerClick = (answerKey: string) => {
    if (selectedAnswer !== null && activeGameMode !== 'speed_challenge') return;

    setSelectedAnswer(answerKey);

    let isCorrect = false;

    if (activeGameMode === 'identify') {
      isCorrect = answerKey === currentWord.rawaniPronunciation;
    } else if (activeGameMode === 'duration_master') {
      const correctRule = currentWord.tajweedRuleTitle.includes('حَیٌّ')
        ? '1_alif'
        : currentWord.arabic === 'الٓرٰ'
        ? 'mix_alif_lam_ra'
        : '3_alif';
      isCorrect = answerKey === correctRule;
    } else if (activeGameMode === 'ghunnah_detector') {
      const correctGhunnahStatus = currentWord.hasGhunnahOrIdgham ? 'has_ghunnah' : 'no_ghunnah';
      isCorrect = answerKey === correctGhunnahStatus;
    } else if (activeGameMode === 'surah_matcher') {
      const correctSurah = currentWord.surahsNamesUrdu[0];
      isCorrect = answerKey === correctSurah;
    } else if (activeGameMode === 'speed_challenge') {
      isCorrect = answerKey === currentWord.rawaniPronunciation;
    }

    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      playChimeEffect('success');
      setScore((prev) => prev + (activeGameMode === 'speed_challenge' ? 20 : 10));
      setStreak((prev) => prev + 1);
      setCoins((prev) => prev + 5);
    } else {
      playChimeEffect('error');
      setStreak(0);
    }

    if (activeGameMode === 'speed_challenge') {
      setSpeedQuestionsAnswered((prev) => prev + 1);
      setTimeout(() => {
        handleNextQuestion();
      }, 400);
    } else {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setShowExplanation(false);

    if (currentIndex + 1 < gamePool.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      resetGamePool();
    }
  };

  const getIdentifyOptions = () => {
    const correct = currentWord.rawaniPronunciation;
    const others = MUQATTAAT_WORDS.filter((w) => w.rawaniPronunciation !== correct)
      .map((w) => w.rawaniPronunciation)
      .slice(0, 3);
    const setOptions = Array.from(new Set([correct, ...others])).sort(() => Math.random() - 0.5);
    return setOptions;
  };

  const getSurahOptions = () => {
    const correct = currentWord.surahsNamesUrdu[0];
    const pool = [
      'سورۃ البقرۃ',
      'سورۃ مریم',
      'سورۃ یٰسٓ',
      'سورۃ طٰہٰ',
      'سورۃ الشعراء',
      'سورۃ الشوریٰ',
      'سورۃ الاعراف',
      'سورۃ یونس',
      'سورۃ ص',
      'سورۃ ق',
      'سورۃ القلم',
    ];
    const filtered = pool.filter((s) => !correct.includes(s)).slice(0, 3);
    return Array.from(new Set([correct, ...filtered])).sort(() => Math.random() - 0.5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="bg-slate-900 border-2 border-emerald-500 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-3 sm:p-4 border-b border-emerald-800/70 text-white space-y-2">
          {/* Top Row: Title & Back Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-700/60 border border-emerald-400 text-amber-300 shrink-0">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-xs sm:text-base text-white truncate">
                    سبق ۱۴: حُرُوفِ مُقَطَّعَات ماسٹر
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 whitespace-nowrap">
                    تجوید چیلنج
                  </span>
                </div>
              </div>
            </div>

            {/* Back Button - Always visible top right */}
            <button
              onClick={handleExit}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white font-black text-xs sm:text-sm border-2 border-rose-400/80 shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="واپسی (باہر نکلیں)"
            >
              <ArrowRight className="w-4 h-4" />
              <span>واپسی</span>
            </button>
          </div>

          {/* Sub Row: Description & Stats Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-slate-800/60">
            <p className="text-[11px] text-emerald-300 hidden sm:block">
              قرآنی مقطعات کی درست ادائیگی، مدات، غنہ و سورتوں کا امتحان
            </p>

            <div className="flex items-center gap-1.5 flex-wrap justify-between w-full sm:w-auto sm:justify-end">
              {/* Stats Badges */}
              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-xl border border-emerald-500/30 text-xs font-bold text-amber-300">
                <span>🪙</span>
                <span>{coins}</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-xl border border-orange-500/30 text-xs font-bold text-orange-400">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                <span>{streak}</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded-xl border border-emerald-500/30 text-xs font-bold text-emerald-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>{score}</span>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer ml-auto sm:ml-0"
                title={isMuted ? 'آواز کھولیں' : 'آواز بند کریں'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>
        </div>

        {/* Game Mode Selector Tabs */}
        <div className="bg-slate-950/60 p-2 sm:p-2.5 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {[
            { id: 'identify', label: '۱. کلمہ و روانی', icon: '🔍' },
            { id: 'duration_master', label: '۲. مد کی مقدار', icon: '📏' },
            { id: 'ghunnah_detector', label: '۳. غنہ و ادغام', icon: '🎶' },
            { id: 'surah_matcher', label: '۴. سورت کا ربط', icon: '📜' },
            { id: 'speed_challenge', label: '⚡ اسپیڈ (30s)', icon: '⏱️' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveGameMode(mode.id as MuqattaatGameMode)}
              className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                activeGameMode === mode.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md border border-emerald-400'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          ))}
        </div>

        {/* Speed Challenge Bar */}
        {activeGameMode === 'speed_challenge' && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 p-2 flex items-center justify-between px-4 text-xs font-bold text-amber-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>وقت باقی: {timeLeft} سیکنڈ</span>
            </div>
            <div>حل کردہ: {speedQuestionsAnswered} سوالات</div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeGameMode === 'speed_challenge' && !isSpeedRunning && timeLeft === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-700/40 border-2 border-emerald-400 mx-auto flex items-center justify-center text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-white">وقت ختم! زبردست کوشش!</h3>
              <p className="text-sm text-emerald-300">
                آپ نے ۳۰ سیکنڈ میں {speedQuestionsAnswered} سوالات حل کیے اور کل {score} پوائنٹس حاصل کیے!
              </p>
              <button
                onClick={resetGamePool}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-lg border border-emerald-300 hover:from-emerald-600 hover:to-teal-700 cursor-pointer"
              >
                دوبارہ کھیلیں
              </button>
            </div>
          ) : (
            <>
              {/* Question Header & Card */}
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-700/50">
                  {activeGameMode === 'identify' && 'سوال: اس مقطعات کلمہ کی درست روانی ادائیگی منتخب کریں:'}
                  {activeGameMode === 'duration_master' && 'سوال: اس کلمہ میں مدات کی درست مقدار و اصول کیا ہے؟'}
                  {activeGameMode === 'ghunnah_detector' && 'سوال: کیا اس مقطعات کلمہ میں غنہ، ادغام یا اخفاء موجود ہے؟'}
                  {activeGameMode === 'surah_matcher' && 'سوال: یہ مقطعات کلمہ قرآن پاک کی کس مبارک سورت کا آغاز ہے؟'}
                  {activeGameMode === 'speed_challenge' && 'روانی ادائیگی جلدی سے پہچانیں:'}
                </span>

                {/* Big Arabic Display Box */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 shadow-inner relative flex flex-col items-center justify-center min-h-[140px]">
                  <div
                    className="text-4xl sm:text-6xl font-arabic font-bold text-amber-300 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handlePlayAudio(currentWord.arabic)}
                  >
                    {currentWord.arabic}
                  </div>

                  <button
                    onClick={() => handlePlayAudio(currentWord.arabic)}
                    className="mt-3 px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 text-xs rounded-xl border border-emerald-600/40 flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>تلاوت سنیں</span>
                  </button>

                  <div className="absolute top-3 right-3 text-[10px] bg-slate-950/60 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800">
                    {currentIndex + 1} / {gamePool.length}
                  </div>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeGameMode === 'identify' || activeGameMode === 'speed_challenge' ? (
                  getIdentifyOptions().map((opt, idx) => {
                    const isChosen = selectedAnswer === opt;
                    const isCorrect = opt === currentWord.rawaniPronunciation;
                    let btnStyle = 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700/80';

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-700 text-white border-emerald-400 shadow-lg';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-800 text-white border-rose-400 shadow-lg';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(opt)}
                        disabled={selectedAnswer !== null && activeGameMode !== 'speed_challenge'}
                        className={`p-4 rounded-2xl border-2 font-arabic text-lg sm:text-xl font-bold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300" />}
                        {selectedAnswer !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-300" />}
                      </button>
                    );
                  })
                ) : activeGameMode === 'duration_master' ? (
                  [
                    { key: '3_alif', label: 'سَنَقُصُّ عِلْمَکَ (۳ الف / ۶ حرکات مد لازم)' },
                    { key: '1_alif', label: 'حَیٌّ طَهُرَ (صرف ۱ الف / ۲ حرکات مد طبیعی)' },
                    { key: 'mix_alif_lam_ra', label: 'الف بغیر مد + لام ۳ الف + را ۱ الف پُر' },
                  ].map((opt, idx) => {
                    const correctRule = currentWord.tajweedRuleTitle.includes('حَیٌّ')
                      ? '1_alif'
                      : currentWord.arabic === 'الٓرٰ'
                      ? 'mix_alif_lam_ra'
                      : '3_alif';
                    const isCorrect = opt.key === correctRule;
                    const isChosen = selectedAnswer === opt.key;
                    let btnStyle = 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80';

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-700 text-white border-emerald-400 shadow-lg';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-800 text-white border-rose-400 shadow-lg';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(opt.key)}
                        disabled={selectedAnswer !== null}
                        className={`p-3.5 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-arabic">{opt.label}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                        {selectedAnswer !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })
                ) : activeGameMode === 'ghunnah_detector' ? (
                  [
                    { key: 'has_ghunnah', label: 'ہاں! غنہ، ادغام یا اخفاء موجود ہے 🎶' },
                    { key: 'no_ghunnah', label: 'نہیں! صرف مدات ہیں، غنہ نہیں 🚫' },
                  ].map((opt, idx) => {
                    const isCorrect = (currentWord.hasGhunnahOrIdgham && opt.key === 'has_ghunnah') || (!currentWord.hasGhunnahOrIdgham && opt.key === 'no_ghunnah');
                    const isChosen = selectedAnswer === opt.key;
                    let btnStyle = 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80';

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-700 text-white border-emerald-400 shadow-lg';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-800 text-white border-rose-400 shadow-lg';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(opt.key)}
                        disabled={selectedAnswer !== null}
                        className={`p-4 rounded-2xl border-2 text-sm sm:text-base font-bold flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-arabic">{opt.label}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                        {selectedAnswer !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  getSurahOptions().map((opt, idx) => {
                    const isCorrect = currentWord.surahsNamesUrdu.some((s) => s.includes(opt) || opt.includes(s.split('(')[0].trim()));
                    const isChosen = selectedAnswer === opt;
                    let btnStyle = 'bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700/80';

                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-700 text-white border-emerald-400 shadow-lg';
                      } else if (isChosen) {
                        btnStyle = 'bg-rose-800 text-white border-rose-400 shadow-lg';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(opt)}
                        disabled={selectedAnswer !== null}
                        className={`p-3.5 rounded-2xl border-2 text-sm sm:text-base font-bold font-arabic flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
                        {selectedAnswer !== null && isChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Explanation & Next Question Bar */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-slate-800/95 border border-emerald-500/40 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        {isAnswerCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                        <span>{isAnswerCorrect ? 'شاباش! درست جواب 🎉' : 'وضاحت و رہنمائی:'}</span>
                      </div>

                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold flex items-center gap-1 shadow cursor-pointer text-xs sm:text-sm"
                      >
                        <span>اگلا سوال</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-slate-200 font-arabic leading-relaxed">
                      {currentWord.tajweedDetailsUrdu}
                    </p>

                    <div className="text-emerald-300/90 text-xs font-arabic">
                      📖 کن سورتوں میں ہے: {currentWord.surahsNamesUrdu.join(' ، ')}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Bottom Back / Exit Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleExit}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/80 text-rose-300 hover:text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-rose-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سبق پر واپسی</span>
            </button>
            <span className="text-[11px] text-slate-400">سبق ۱۴ تجوید چیلنج</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
