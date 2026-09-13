import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./SequentialBlankBoard.css";
import { playQariText, stopAllQariAudio } from "../utils/qariAudioService";
import { useBackHandler } from "../hooks/useBackHandler";
import { LanguageCode } from "../types";
import { getBlankBoardLocalization } from "../utils/blankBoardLocalization";

/*
=========================================================
 TA'LIMUL QURAN PLAY
 Sequential & Hunt Blank Board — 29 Huruf-e-Tahajji
 Production-quality standalone React component
=========================================================
*/

export interface LetterItem {
  letter: string;
  name: string;
  transliteration: string;
}

export const LETTERS: LetterItem[] = [
  { letter: "ا", name: "أَلِفْ", transliteration: "Alif" },
  { letter: "ب", name: "بَاءْ", transliteration: "Baa" },
  { letter: "ت", name: "تَاءْ", transliteration: "Taa" },
  { letter: "ث", name: "ثَاءْ", transliteration: "Thaa" },
  { letter: "ج", name: "جِيمْ", transliteration: "Jeem" },
  { letter: "ح", name: "حَاءْ", transliteration: "Haa" },
  { letter: "خ", name: "خَاءْ", transliteration: "Khaa" },
  { letter: "د", name: "دَالْ", transliteration: "Daal" },
  { letter: "ذ", name: "ذَالْ", transliteration: "Dhaal" },
  { letter: "ر", name: "رَاءْ", transliteration: "Raa" },
  { letter: "ز", name: "زَا", transliteration: "Zaa" },
  { letter: "س", name: "سِيْنْ", transliteration: "Seen" },
  { letter: "ش", name: "شِيْنْ", transliteration: "Sheen" },
  { letter: "ص", name: "صَادْ", transliteration: "Saad" },
  { letter: "ض", name: "ضَادْ", transliteration: "Daad" },
  { letter: "ط", name: "طَاءْ", transliteration: "Taa" },
  { letter: "ظ", name: "ظَاءْ", transliteration: "Zaa" },
  { letter: "ع", name: "عَيْنْ", transliteration: "Ayn" },
  { letter: "غ", name: "غَيْنْ", transliteration: "Ghayn" },
  { letter: "ف", name: "فَاءْ", transliteration: "Faa" },
  { letter: "ق", name: "قَافْ", transliteration: "Qaaf" },
  { letter: "ك", name: "كَافْ", transliteration: "Kaaf" },
  { letter: "ل", name: "لَامْ", transliteration: "Laam" },
  { letter: "م", name: "مِيمْ", transliteration: "Meem" },
  { letter: "ن", name: "نُوْنْ", transliteration: "Noon" },
  { letter: "و", name: "وَاوْ", transliteration: "Waaw" },
  { letter: "ه", name: "هَاءْ", transliteration: "Haa" },
  { letter: "ء", name: "هَمْزَة", transliteration: "Hamzah" },
  { letter: "ي", name: "يَاءْ", transliteration: "Yaa" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

const speakArabic = (text: string) => {
  try {
    stopAllQariAudio();
    playQariText(text);
  } catch {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA";
      utterance.rate = 0.52;
      window.speechSynthesis.speak(utterance);
    }
  }
};

export interface BlankBoardCompletionData {
  xp: number;
  coins: number;
  totalXp: number;
  totalCoins: number;
  mistakes: number;
  bestStreak: number;
}

export interface SequentialBlankBoardProps {
  currentLang?: LanguageCode;
  onComplete?: (data: BlankBoardCompletionData) => void;
  onBack?: () => void;
  initialXp?: number;
  initialCoins?: number;
}

export default function SequentialBlankBoard({
  currentLang = 'ur',
  onComplete,
  onBack,
  initialXp = 0,
  initialCoins = 0,
}: SequentialBlankBoardProps) {
  const bloc = getBlankBoardLocalization(currentLang);

  // Shuffled by default so children have to search and recognize letters!
  const [board, setBoard] = useState<LetterItem[]>(() => shuffleArray(LETTERS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLetters, setCompletedLetters] = useState<string[]>([]);

  const [xp, setXp] = useState(initialXp);
  const [coins, setCoins] = useState(initialCoins);

  const [mistakes, setMistakes] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [hintUsed, setHintUsed] = useState(false);
  const [isShuffled, setIsShuffled] = useState(true); // Default true for hunt mode
  const [hintLetter, setHintLetter] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{
    type: "correct" | "wrong" | "hint" | "info";
    message: string;
    subMessage: string;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Back Button Handler
  useBackHandler(() => {
    stopAllQariAudio();
    onBack?.();
  }, !!onBack, 25, 'blank_board_back');

  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLetter = useMemo(
    () => LETTERS[currentIndex] || LETTERS[0],
    [currentIndex]
  );

  const progress = Math.round(
    (completedLetters.length / LETTERS.length) * 100
  );

  const completedCount = completedLetters.length;

  const clearFeedback = () => {
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }

    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
    }, 1600);
  };

  const handleCorrect = useCallback(
    (selectedLetter: LetterItem) => {
      if (isCompleted) return;

      const baseXp = 25;
      const baseCoins = 10;

      const streakBonus = Math.min(streak * 2, 20);
      const hintPenalty = hintUsed ? 5 : 0;

      const earnedXp = Math.max(
        5,
        baseXp + streakBonus - hintPenalty
      );

      const earnedCoins = hintUsed ? 3 : baseCoins;
      const newStreak = streak + 1;

      setXp((value) => value + earnedXp);
      setCoins((value) => value + earnedCoins);
      setStreak(newStreak);
      setBestStreak((value) =>
        Math.max(value, newStreak)
      );

      setCompletedLetters((prev) =>
        prev.includes(selectedLetter.letter) ? prev : [...prev, selectedLetter.letter]
      );

      setFeedback({
        type: "correct",
        message: `ماشاءاللہ! بالکل درست: ${selectedLetter.name} (${selectedLetter.letter})`,
        subMessage: `+${earnedXp} XP  •  +${earnedCoins} Coins`,
      });

      speakArabic(selectedLetter.name);

      setHintUsed(false);
      setHintLetter(null);

      if (currentIndex >= LETTERS.length - 1) {
        setIsCompleted(true);
        setCelebrating(true);

        setTimeout(() => {
          setCelebrating(false);

          if (onComplete) {
            onComplete({
              xp: earnedXp,
              coins: earnedCoins,
              totalXp: xp + earnedXp,
              totalCoins: coins + earnedCoins,
              mistakes,
              bestStreak: Math.max(bestStreak, newStreak),
            });
          }
        }, 1600);
      } else {
        setTimeout(() => {
          setCurrentIndex((value) => value + 1);
        }, 550);
      }

      clearFeedback();
    },
    [
      bestStreak,
      coins,
      currentIndex,
      hintUsed,
      isCompleted,
      mistakes,
      onComplete,
      streak,
      xp,
    ]
  );

  const handleLetterClick = (item: LetterItem) => {
    if (isCompleted) return;

    // If letter already completed, inform child and pronounce it
    if (completedLetters.includes(item.letter)) {
      speakArabic(item.name);
      setFeedback({
        type: "info",
        message: bloc.alreadyFoundMsg(item.name),
        subMessage: bloc.alreadyFoundSub(currentLetter.name, currentLetter.letter),
      });
      clearFeedback();
      return;
    }

    const expected = currentLetter.letter;

    if (item.letter === expected) {
      handleCorrect(item);
      return;
    }

    setMistakes((value) => value + 1);
    setStreak(0);

    setFeedback({
      type: "wrong",
      message: bloc.wrongMsg(item.name),
      subMessage: bloc.wrongSub(currentLetter.name, expected),
    });

    speakArabic(item.name);
    clearFeedback();
  };

  const handleHint = () => {
    if (isCompleted || hintUsed) return;

    setHintUsed(true);
    setHintLetter(currentLetter.letter);

    setFeedback({
      type: "hint",
      message: bloc.hintMsg,
      subMessage: bloc.hintSub(currentLetter.name, currentLetter.letter),
    });

    speakArabic(currentLetter.name);
    clearFeedback();
  };

  const handleShuffle = () => {
    if (isCompleted) return;

    setBoard((currentBoard) => shuffleArray(currentBoard));
    setIsShuffled(true);

    setFeedback({
      type: "info",
      message: bloc.shuffledMsg,
      subMessage: bloc.shuffledSub(currentLetter.name),
    });

    clearFeedback();
  };

  const setSequentialMode = () => {
    setBoard(LETTERS.map((item) => item));
    setIsShuffled(false);
    setFeedback({
      type: "info",
      message: bloc.sequentialSetMsg,
      subMessage: bloc.sequentialSetSub,
    });
    clearFeedback();
  };

  const setHuntMode = () => {
    setBoard(shuffleArray(LETTERS));
    setIsShuffled(true);
    setFeedback({
      type: "info",
      message: bloc.huntSetMsg,
      subMessage: bloc.huntSetSub,
    });
    clearFeedback();
  };

  const handleReset = () => {
    stopAllQariAudio();
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    // Default to shuffled hunt on reset
    setBoard(shuffleArray(LETTERS));
    setCompletedLetters([]);
    setCurrentIndex(0);
    setXp(initialXp);
    setCoins(initialCoins);
    setMistakes(0);
    setStreak(0);
    setBestStreak(0);
    setHintUsed(false);
    setHintLetter(null);
    setIsShuffled(true);
    setFeedback(null);
    setIsCompleted(false);
    setCelebrating(false);
  };

  const handleBoardListen = () => {
    if (isCompleted) return;

    speakArabic(currentLetter.name);

    setFeedback({
      type: "info",
      message: `سنیں: ${currentLetter.name} (${currentLetter.letter})`,
      subMessage: `${currentLetter.transliteration}`,
    });

    clearFeedback();
  };

  useEffect(() => {
    return () => {
      stopAllQariAudio();
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }

      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  return (
    <section
      className={`tqp-game ${celebrating ? "is-celebrating" : ""}`}
      dir="rtl"
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="tqp-game-header">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer mt-1"
              title={bloc.back}
            >
              <span>➜</span>
              <span>{bloc.back}</span>
            </button>
          )}
          <div>
            <div className="tqp-game-eyebrow">
              <span>🧠</span>
              <span>{bloc.lessonEyebrow}</span>
            </div>

            <h1 className="tqp-game-title">
              {bloc.title}
            </h1>

            <p className="tqp-game-description">
              {bloc.description}
            </p>
          </div>
        </div>

        <div className="tqp-game-progress">
          <span>{bloc.progress}</span>
          <strong>
            {completedCount}/{LETTERS.length}
          </strong>
        </div>
      </div>

      {/* =================================================
          MODE SWITCHER TABS (SHUFFLED HUNT vs SEQUENTIAL)
      ================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-zinc-900/95 p-2.5 rounded-2xl border border-amber-500/40 shadow-lg mt-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={setHuntMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              isShuffled
                ? "bg-amber-500 text-zinc-950 shadow-md ring-2 ring-amber-300"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            <span>🎲</span>
            <span>{bloc.huntModeBtn}</span>
          </button>

          <button
            type="button"
            onClick={setSequentialMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              !isShuffled
                ? "bg-sky-500 text-zinc-950 shadow-md ring-2 ring-sky-300"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            <span>🔤</span>
            <span>{bloc.sequentialModeBtn}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/40 cursor-pointer flex items-center gap-1 transition-all"
          title={bloc.shuffleBtn}
        >
          <span>🔀</span>
          <span>{bloc.shuffleBtn}</span>
        </button>
      </div>

      {/* =================================================
          CURRENT TARGET CARD
      ================================================== */}

      <div className="tqp-target-card">
        <div className="tqp-target-icon">🎯</div>

        <div className="tqp-target-content">
          <span className="tqp-target-label">
            {bloc.targetCardLabel}
          </span>

          <div className="flex items-baseline gap-3 mt-1">
            <div className="tqp-target-letter">
              {currentLetter?.letter}
            </div>

            <div className="text-sm font-bold text-amber-200 bg-amber-950/80 border border-amber-500/40 px-3 py-1 rounded-xl">
              {currentLetter?.name} ({currentLetter?.transliteration})
            </div>

            <span className="text-xs text-zinc-400 font-semibold">
              {bloc.letterNumberPrefix}{currentIndex + 1} / {LETTERS.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="tqp-listen-button"
          onClick={handleBoardListen}
          aria-label={bloc.listen}
        >
          🔊
          <span>{bloc.listen}</span>
        </button>
      </div>

      {/* =================================================
          PROGRESS BAR
      ================================================== */}

      <div className="tqp-progress-wrapper">
        <div className="tqp-progress-meta">
          <span>{bloc.totalSearchLabel} ({completedCount} / {LETTERS.length})</span>
          <strong>{progress}%</strong>
        </div>

        <div className="tqp-progress-track">
          <div
            className="tqp-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* =================================================
          ACTIONS
      ================================================== */}

      <div className="tqp-actions">
        <button
          type="button"
          className="tqp-action tqp-action-primary"
          onClick={handleHint}
          disabled={hintUsed || isCompleted}
        >
          {bloc.hintBtn}
        </button>

        <button
          type="button"
          className="tqp-action"
          onClick={handleShuffle}
          disabled={isCompleted}
        >
          {bloc.shuffleBtn}
        </button>

        <button
          type="button"
          className="tqp-action"
          onClick={handleBoardListen}
          disabled={isCompleted}
        >
          {bloc.playAudioBtn}
        </button>

        <button
          type="button"
          className="tqp-action tqp-action-danger"
          onClick={handleReset}
        >
          {bloc.restartBtn}
        </button>
      </div>

      {/* =================================================
          FEEDBACK
      ================================================== */}

      {feedback && (
        <div
          className={`tqp-feedback tqp-feedback-${feedback.type}`}
          role="status"
        >
          <div className="tqp-feedback-icon">
            {feedback.type === "correct" && "✓"}
            {feedback.type === "wrong" && "✕"}
            {feedback.type === "hint" && "💡"}
            {feedback.type === "info" && "ℹ"}
          </div>

          <div>
            <strong>{feedback.message}</strong>
            <span>{feedback.subMessage}</span>
          </div>
        </div>
      )}

      {/* =================================================
          BOARD
      ================================================== */}

      <div className="tqp-board-section">
        <div className="tqp-board-heading">
          <div>
            <span className="tqp-board-kicker">
              {isShuffled ? "Shuffled Hunt Board" : "Sequential Board"}
            </span>

            <h2>
              {isShuffled
                ? "بورڈ پر مطلوبہ حرف ڈھونڈ کر ٹیپ کریں (بے ترتیب مشق)"
                : "ہر حرف کو ترتیب سے منتخب کریں"}
            </h2>
          </div>

          <div className="tqp-board-counter">
            <strong>{completedCount}</strong>
            <span>/ {LETTERS.length}</span>
          </div>
        </div>

        <div
          className={`tqp-letter-board ${
            isShuffled ? "is-shuffled" : ""
          }`}
        >
          {board.map((item, index) => {
            const originalIndex = LETTERS.findIndex(
              (letter) => letter.letter === item.letter
            );

            const isCompletedLetter = completedLetters.includes(item.letter);
            const isHinted = hintLetter === item.letter;
            // In sequential mode only, highlight current target if desired, but in shuffled hunt mode NEVER highlight target unless hinted!
            const isCurrent = !isShuffled && item.letter === currentLetter?.letter;

            return (
              <button
                key={`${item.letter}-${index}`}
                type="button"
                className={[
                  "tqp-letter-card",
                  isCompletedLetter ? "is-completed" : "",
                  isHinted || isCurrent ? "is-current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleLetterClick(item)}
                aria-label={`حرف ${item.name}`}
              >
                {!isShuffled && (
                  <span className="tqp-letter-number">
                    #{originalIndex + 1}
                  </span>
                )}

                <span className="tqp-letter">
                  {item.letter}
                </span>

                <span className="tqp-letter-name">
                  {item.name}
                </span>

                {isCompletedLetter && (
                  <span className="tqp-complete-mark">
                    ✓
                  </span>
                )}

                {(isHinted || isCurrent) && (
                  <span className="tqp-target-mark">
                    🎯
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================
          STATS
      ================================================== */}

      <div className="tqp-stats">
        <div className="tqp-stat">
          <span className="tqp-stat-icon">⚡</span>
          <div>
            <small>{bloc.xpLabel}</small>
            <strong>{xp} XP</strong>
          </div>
        </div>

        <div className="tqp-stat">
          <span className="tqp-stat-icon">🪙</span>
          <div>
            <small>{bloc.coinsLabel}</small>
            <strong>{coins}</strong>
          </div>
        </div>

        <div className="tqp-stat">
          <span className="tqp-stat-icon">🔥</span>
          <div>
            <small>{bloc.streakLabel}</small>
            <strong>{streak}</strong>
          </div>
        </div>

        <div className="tqp-stat">
          <span className="tqp-stat-icon">🏆</span>
          <div>
            <small>{bloc.bestStreakLabel}</small>
            <strong>{bestStreak}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
          COMPLETION
      ================================================== */}

      {isCompleted && (
        <div className="tqp-completion">
          <div className="tqp-completion-stars">
            ⭐ ⭐ ⭐
          </div>

          <div className="tqp-completion-icon">
            🏆
          </div>

          <h2>{bloc.completedTitle}</h2>

          <p>
            {bloc.completedDesc}
          </p>

          <div className="tqp-completion-rewards">
            <span>⚡ +XP</span>
            <span>🪙 +Coins</span>
            <span>🔥 Streak</span>
          </div>

          <button
            type="button"
            className="tqp-play-again"
            onClick={handleReset}
          >
            {bloc.playAgain}
            <span>↻</span>
          </button>
        </div>
      )}
    </section>
  );
}

