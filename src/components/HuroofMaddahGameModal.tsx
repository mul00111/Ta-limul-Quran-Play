import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, ArrowRight, Sparkles, Trophy, Flame, Coins,
  Star, RefreshCw, Zap, CheckCircle2, XCircle, Timer, Mic, Layers,
  Lightbulb, BookOpen, Award, Puzzle, HelpCircle
} from 'lucide-react';
import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect, playUrduText } from '../utils/qariAudioService';
import {
  SABAQ_7_TRIPLETS,
  SABAQ_7_ALL_84_CELLS,
  PAGE_16_ALIF_MASHQ_WORDS,
  PAGE_17_WAW_MASHQ_WORDS,
  PAGE_18_YAA_MASHQ_WORDS,
  ALL_MADDAH_MASHQ_WORDS,
  Sabaq7BookCell,
  Sabaq7Triplet,
  MaddahMashqWord
} from '../data/huroofMaddahData';

interface HuroofMaddahGameModalProps {
  onBack: () => void;
  initialMode?: 'quiz' | 'puzzle' | 'match' | 'speed';
}

export interface MaddahGameItem {
  id: string;
  word: string;             // e.g. "بَابَ" or "بَا" or "بَا ، بُوْ ، بِيْ"
  lettersDisplay: string;    // e.g. "بَ + ا + بَ" or "با + الف زبر"
  spellingHijja: string;     // e.g. "با الف زبر بَا ، با زبر بَ = بَابَ"
  categoryLabelUrdu: string; // e.g. "الف مدہ" | "واؤ مدہ" | "یاء مدہ" | "ثلاثی جوڑی" | "مرکب کلمات"
  rawSound: string;
  maddahType: 'alif' | 'waw' | 'yaa' | 'triplet' | 'mixed';
  isHeavy?: boolean;
  breakdown?: string;
  meaningOrContext?: string;
  tajweedNote: string;
  breakdownParts?: string[];
}

// 1. SINGLE MADDAH CELLS (84 items)
const SINGLE_MADDAH_GAME_ITEMS: MaddahGameItem[] = SABAQ_7_ALL_84_CELLS.map((cell) => ({
  id: `cell-${cell.id}`,
  word: cell.arabicText,
  lettersDisplay: `${cell.baseLetterName} + ${cell.maddahType === 'alif' ? 'الف مدہ' : cell.maddahType === 'waw' ? 'واؤ مدہ' : 'یاء مدہ'}`,
  spellingHijja: cell.hijjaSpelling,
  categoryLabelUrdu: cell.maddahType === 'alif' ? 'الف مدہ' : cell.maddahType === 'waw' ? 'واؤ مدہ' : 'یاء مدہ',
  rawSound: cell.arabicText,
  maddahType: cell.maddahType,
  isHeavy: cell.isHeavy,
  breakdown: cell.arabicText,
  tajweedNote: `${cell.maddahType === 'alif' ? 'الف سے پہلے زبر' : cell.maddahType === 'waw' ? 'واؤ ساکن سے پہلے پیش' : 'یاء ساکن سے پہلے زیر'} ہے، ایک الف (دو حرکات) کھینچ کر پڑھیں۔${cell.isHeavy ? ' (حرفِ مستعلیہ: پُر پڑھیں)' : ''}`,
  breakdownParts: [cell.arabicText]
}));

// 2. MADDAH TRIPLETS (28 items: بَا ، بُوْ ، بِيْ ...)
const TRIPLET_MADDAH_GAME_ITEMS: MaddahGameItem[] = SABAQ_7_TRIPLETS.map((t) => ({
  id: `triplet-${t.id}`,
  word: t.tripletRaw,
  lettersDisplay: `${t.baseLetterName} (الف، واؤ، یاء مدہ)`,
  spellingHijja: t.tripletHijja,
  categoryLabelUrdu: 'حروفِ مدہ ثلاثی',
  rawSound: t.tripletRaw,
  maddahType: 'triplet',
  isHeavy: t.isHeavy,
  breakdown: `${t.alifCell.arabicText} ، ${t.wawCell.arabicText} ، ${t.yaaCell.arabicText}`,
  tajweedNote: `تینوں مدات (الف مدہ، واؤ مدہ، یاء مدہ) کو برابر ۱، ۱ الف کھینچ کر پڑھیں۔${t.isHeavy ? ' (حرفِ مستعلیہ: پُر پڑھیں)' : ''}`,
  breakdownParts: [t.alifCell.arabicText, t.wawCell.arabicText, t.yaaCell.arabicText]
}));

// Syllable extractor for Quranic Maddah words to avoid breaking diacritics
export const extractMaddahSyllables = (wordObj: MaddahMashqWord): string[] => {
  if (wordObj.hijjaText && wordObj.hijjaText.includes('=')) {
    const formulaPart = wordObj.hijjaText.split('=')[0];
    const parts = formulaPart.split('،').map((part) => {
      const tokens = part.trim().split(/\s+/);
      return tokens[tokens.length - 1]?.trim();
    }).filter((s): s is string => Boolean(s && s.length > 0));

    if (parts.length >= 2) {
      return parts;
    }
  }

  // Fallback: segment Arabic syllables (consonant + harakah + optional maddah/sukoon)
  const matched = wordObj.word.match(/[\u0621-\u064A][\u064B-\u0652]?([\u0627\u0648\u064A][\u0652]?)?/g);
  if (matched && matched.length > 0) {
    return matched;
  }

  return [wordObj.word];
};

const SMART_MADDAH_DISTRACTORS = [
  'بَا', 'بُوْ', 'بِيْ', 'تَا', 'تُوْ', 'تِيْ', 'ثَا', 'ثُوْ', 'جَا', 'جُوْ', 'جِيْ',
  'حَا', 'حُوْ', 'حِيْ', 'خَا', 'خُوْ', 'خِيْ', 'دَا', 'دُوْ', 'دِيْ', 'ذَا', 'ذُوْ',
  'رَا', 'رُوْ', 'رِيْ', 'زَا', 'زُوْ', 'زِيْ', 'سَا', 'سُوْ', 'سِيْ', 'شَا', 'شُوْ',
  'صَا', 'صُوْ', 'صِيْ', 'ضَا', 'ضُوْ', 'طَا', 'طُوْ', 'ظَا', 'ظُوْ', 'عَا', 'عُوْ',
  'غَا', 'غُوْ', 'فَا', 'فُوْ', 'فِيْ', 'قَا', 'قُوْ', 'قِيْ', 'کَا', 'کُوْ', 'کِيْ',
  'لَا', 'لُوْ', 'لِيْ', 'مَا', 'مُوْ', 'مِيْ', 'نَا', 'نُوْ', 'نِيْ', 'وَا', 'وُوْ',
  'هَا', 'هُوْ', 'هِيْ', 'يَا', 'يُوْ', 'بَ', 'تَ', 'لَ', 'دَ', 'مَ', 'نَ', 'رَ', 'سَ'
];

interface PuzzleTileItem {
  id: string;
  text: string;
  isUsed: boolean;
}

// 3. ALL 85 MASHQ WORDS
const WORD_MADDAH_GAME_ITEMS: MaddahGameItem[] = ALL_MADDAH_MASHQ_WORDS.map((w) => {
  const parts = extractMaddahSyllables(w);
  return {
    id: `word-${w.id}`,
    word: w.word,
    lettersDisplay: w.hijjaText.split('=')[0]?.trim() || w.word,
    spellingHijja: w.hijjaText,
    categoryLabelUrdu: w.maddahType === 'alif' ? 'الف مدہ' : w.maddahType === 'waw' ? 'واؤ مدہ' : w.maddahType === 'yaa' ? 'یاء مدہ' : 'حروفِ مدہ',
    rawSound: w.word,
    maddahType: w.maddahType,
    isHeavy: w.isHeavy,
    breakdown: parts.join(' + '),
    meaningOrContext: w.meaningOrContext,
    tajweedNote: w.tajweedNotes,
    breakdownParts: parts
  };
});

export const HuroofMaddahGameModal: React.FC<HuroofMaddahGameModalProps> = ({ onBack, initialMode = 'quiz' }) => {
  // Main Game Mode:
  // 'quiz' = پہچان و کوئز چیلنج (Multiple Choice with 4 Sub-Levels)
  // 'puzzle' = مقناطیسی حروف جوڑ پزل
  // 'match' = میموری کارڈ میچنگ گیم
  // 'speed' = سپیڈ رَش چیلنج
  const [gameTab, setGameTab] = useState<'quiz' | 'puzzle' | 'match' | 'speed'>(initialMode);

  // Sub-level for Quiz Mode:
  // 1 = مفرداتِ مدہ (۸۴ حروف)
  // 2 = ثلاثی جوڑیاں (۲۸ جوڑیاں)
  // 3 = تمام ۸۵ مشقی و قرآنی کلمات
  // 4 = مکسڈ ماسٹر چیلنج
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(3);

  // Quiz States
  const [targetItem, setTargetItem] = useState<MaddahGameItem>(WORD_MADDAH_GAME_ITEMS[0]);
  const [options, setOptions] = useState<MaddahGameItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; subText: string; type: 'correct' | 'wrong' | 'badge' } | null>(null);

  // Stats & Progress
  const [score, setScore] = useState(() => Number(localStorage.getItem('maddah_game_score') || 0));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('maddah_game_coins') || 50));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem('maddah_best_streak') || 0));
  const [multiplier, setMultiplier] = useState(1);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Speed Challenge Timer
  const [timeLeft, setTimeLeft] = useState(6);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Voice recording practice
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // --- PUZZLE GAME STATE ---
  const [puzzleTargetIndex, setPuzzleTargetIndex] = useState(0);
  const currentPuzzleWord = ALL_MADDAH_MASHQ_WORDS[puzzleTargetIndex % ALL_MADDAH_MASHQ_WORDS.length];
  const [puzzleSlots, setPuzzleSlots] = useState<(string | null)[]>([]);
  const [puzzleTileBank, setPuzzleTileBank] = useState<PuzzleTileItem[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // --- MEMORY MATCH GAME STATE ---
  interface MatchCard {
    id: string;
    content: string;
    pairKey: string;
    isFlipped: boolean;
    isMatched: boolean;
    type: 'sound' | 'text';
  }
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [matchMoves, setMatchMoves] = useState(0);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAllQariAudio();
    };
  }, []);

  // Streak Multiplier Calculation
  useEffect(() => {
    if (streak >= 10) setMultiplier(4);
    else if (streak >= 6) setMultiplier(3);
    else if (streak >= 3) setMultiplier(2);
    else setMultiplier(1);

    if (streak > bestStreak) {
      setBestStreak(streak);
      localStorage.setItem('maddah_best_streak', String(streak));
    }
  }, [streak, bestStreak]);

  // Generate New Quiz Question
  const generateNewQuestion = (targetLevel = level) => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopAllQariAudio();
    setSelectedId(null);
    setAnswerStatus(null);
    setHiddenOptionIds([]);
    setToastMessage(null);
    setVoiceFeedback(null);

    let choiceOptions: MaddahGameItem[] = [];
    let randomTarget: MaddahGameItem;

    if (targetLevel === 1) {
      randomTarget = SINGLE_MADDAH_GAME_ITEMS[Math.floor(Math.random() * SINGLE_MADDAH_GAME_ITEMS.length)];
      const others = SINGLE_MADDAH_GAME_ITEMS.filter(i => i.id !== randomTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...others].sort(() => Math.random() - 0.5);
    } else if (targetLevel === 2) {
      randomTarget = TRIPLET_MADDAH_GAME_ITEMS[Math.floor(Math.random() * TRIPLET_MADDAH_GAME_ITEMS.length)];
      const others = TRIPLET_MADDAH_GAME_ITEMS.filter(i => i.id !== randomTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...others].sort(() => Math.random() - 0.5);
    } else if (targetLevel === 3) {
      randomTarget = WORD_MADDAH_GAME_ITEMS[Math.floor(Math.random() * WORD_MADDAH_GAME_ITEMS.length)];
      const others = WORD_MADDAH_GAME_ITEMS.filter(i => i.id !== randomTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...others].sort(() => Math.random() - 0.5);
    } else {
      // Mixed Master
      const allPool = [...SINGLE_MADDAH_GAME_ITEMS, ...TRIPLET_MADDAH_GAME_ITEMS, ...WORD_MADDAH_GAME_ITEMS];
      randomTarget = allPool[Math.floor(Math.random() * allPool.length)];
      const others = allPool.filter(i => i.id !== randomTarget.id).sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...others].sort(() => Math.random() - 0.5);
    }

    setTargetItem(randomTarget);
    setOptions(choiceOptions);

    // Auto-play audio on question load
    setTimeout(() => {
      playQariText(randomTarget.rawSound);
    }, 250);

    // If speed mode active
    if (gameTab === 'speed' || targetLevel === 4) {
      setTimeLeft(6);
      setIsTimerRunning(true);
    }
  };

  // Speed Challenge Timer Loop
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playChimeEffect('error');
            setToastMessage({
              title: 'وقت ختم ہو گیا! ⏰',
              subText: `آپ کا حتمی اسکور: ${score} پوائنٹس! شاندار کوشش!`,
              type: 'wrong'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft, score]);

  // Initial Load
  useEffect(() => {
    generateNewQuestion(level);
  }, [level, gameTab]);

  // Handle Option Click
  const handleSelectOption = (item: MaddahGameItem) => {
    if (answerStatus !== null) return;
    setSelectedId(item.id);

    if (item.id === targetItem.id) {
      // CORRECT ANSWER
      setAnswerStatus('correct');
      playChimeEffect('success');
      playQuizFeedbackAudio(true);

      const pointsEarned = 10 * multiplier;
      const coinsEarned = multiplier > 1 ? 5 : 2;

      const newScore = score + pointsEarned;
      const newCoins = coins + coinsEarned;
      const newStreak = streak + 1;

      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);

      localStorage.setItem('maddah_game_score', String(newScore));
      localStorage.setItem('maddah_game_coins', String(newCoins));

      if (newStreak === 5 && !achievements.includes('streak-5')) {
        setAchievements(prev => [...prev, 'streak-5']);
        setToastMessage({
          title: '🏅 نیا بیج انلاک: مدہ چیمپئن!',
          subText: 'مسلسل ۵ درست جوابات کا شاندار ریکارڈ!',
          type: 'badge'
        });
      } else {
        setToastMessage({
          title: 'ماشاء اللہ! بالکل درست جواب! ✨',
          subText: `${targetItem.word} (${targetItem.tajweedNote}) • +${pointsEarned} پوائنٹس • +${coinsEarned} سکے!`,
          type: 'correct'
        });
      }

      setTimeout(() => {
        generateNewQuestion(level);
      }, 1800);

    } else {
      // WRONG ANSWER
      setAnswerStatus('wrong');
      playChimeEffect('error');
      playQuizFeedbackAudio(false);
      setStreak(0);

      // Play wrong clicked item so user hears it
      playQariText(item.rawSound);

      setToastMessage({
        title: 'دوبارہ غور فرمائیں! ❌',
        subText: `آپ نے "${item.word}" پر کلک کیا۔ درست جواب "${targetItem.word}" ہے۔ رہنمائی: ${targetItem.tajweedNote}`,
        type: 'wrong'
      });
    }
  };

  // 50:50 Lifeline
  const useFiftyFifty = () => {
    if (coins < 10) {
      setToastMessage({
        title: 'سکے ناکافی ہیں! 🪙',
        subText: '۵۰:۵۰ لائف لائن کے لیے کم از کم ۱۰ سکے درکار ہیں۔ درست جوابات دے کر سکے کمائیں۔',
        type: 'wrong'
      });
      return;
    }
    if (hiddenOptionIds.length > 0) return;

    const wrongOptions = options.filter(o => o.id !== targetItem.id);
    const toHide = wrongOptions.slice(0, 2).map(o => o.id);
    setHiddenOptionIds(toHide);
    setCoins(prev => {
      const updated = prev - 10;
      localStorage.setItem('maddah_game_coins', String(updated));
      return updated;
    });
    playChimeEffect('success');
  };

  // Play Breakdown Step by Step
  const playBreakdownSequence = async () => {
    if (!targetItem.breakdownParts || targetItem.breakdownParts.length === 0) {
      playQariText(targetItem.rawSound);
      return;
    }
    stopAllQariAudio();
    for (const part of targetItem.breakdownParts) {
      if (part) {
        await playQariText(part);
        await new Promise(r => setTimeout(r, 450));
      }
    }
    await new Promise(r => setTimeout(r, 300));
    await playQariText(targetItem.rawSound);
  };

  // Initialize Puzzle Game
  const initPuzzleRound = (index: number) => {
    const wordObj = ALL_MADDAH_MASHQ_WORDS[index % ALL_MADDAH_MASHQ_WORDS.length];
    const targetSyllables = extractMaddahSyllables(wordObj);

    // Create target slots matching syllable count
    setPuzzleSlots(new Array(targetSyllables.length).fill(null));

    // Choose 3-4 smart distractors not in target syllables
    const availableDistractors = SMART_MADDAH_DISTRACTORS.filter(d => !targetSyllables.includes(d));
    const chosenDistractors = availableDistractors.sort(() => Math.random() - 0.5).slice(0, 4);

    const combined: PuzzleTileItem[] = [
      ...targetSyllables.map((s, idx) => ({ id: `target-${idx}-${s}`, text: s, isUsed: false })),
      ...chosenDistractors.map((d, idx) => ({ id: `distract-${idx}-${d}`, text: d, isUsed: false }))
    ].sort(() => Math.random() - 0.5);

    setPuzzleTileBank(combined);
    setPuzzleStatus('idle');
    playQariText(wordObj.word);
  };

  useEffect(() => {
    if (gameTab === 'puzzle') {
      initPuzzleRound(puzzleTargetIndex);
    }
  }, [gameTab, puzzleTargetIndex]);

  const handlePuzzleTileClick = (tileId: string) => {
    const tile = puzzleTileBank.find(t => t.id === tileId);
    if (!tile || tile.isUsed) return;

    playQariText(tile.text);

    // Find first empty slot
    const emptyIndex = puzzleSlots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    const newSlots = [...puzzleSlots];
    newSlots[emptyIndex] = tile.text;
    setPuzzleSlots(newSlots);

    setPuzzleTileBank(prev => prev.map(t => t.id === tileId ? { ...t, isUsed: true } : t));

    // Check completion when all slots filled
    const targetSyllables = extractMaddahSyllables(currentPuzzleWord);
    if (!newSlots.some(s => s === null)) {
      const isCorrect = newSlots.every((s, idx) => s === targetSyllables[idx]);
      if (isCorrect) {
        setPuzzleStatus('success');
        playChimeEffect('success');
        playQuizFeedbackAudio(true);
        setScore(s => s + 30);
        setCoins(c => c + 10);
        setStreak(st => st + 1);
        setTimeout(() => {
          playQariText(currentPuzzleWord.word);
        }, 600);
      } else {
        setPuzzleStatus('error');
        playChimeEffect('error');
      }
    }
  };

  const handlePuzzleSlotClick = (slotIndex: number) => {
    const value = puzzleSlots[slotIndex];
    if (!value) return;

    const newSlots = [...puzzleSlots];
    newSlots[slotIndex] = null;
    setPuzzleSlots(newSlots);
    setPuzzleStatus('idle');

    // Return tile to bank
    setPuzzleTileBank(prev => {
      let found = false;
      return prev.map(t => {
        if (!found && t.text === value && t.isUsed) {
          found = true;
          return { ...t, isUsed: false };
        }
        return t;
      });
    });
  };

  const handleResetPuzzle = () => {
    initPuzzleRound(puzzleTargetIndex);
  };

  const nextPuzzleWord = () => {
    setPuzzleTargetIndex(prev => (prev + 1) % ALL_MADDAH_MASHQ_WORDS.length);
  };

  const prevPuzzleWord = () => {
    setPuzzleTargetIndex(prev => (prev === 0 ? ALL_MADDAH_MASHQ_WORDS.length - 1 : prev - 1));
  };

  // Initialize Memory Match Game
  const initMatchGame = () => {
    const sampleWords = [...ALL_MADDAH_MASHQ_WORDS].sort(() => Math.random() - 0.5).slice(0, 6);
    const cards: MatchCard[] = [];
    sampleWords.forEach((w, idx) => {
      cards.push({
        id: `card-${idx}-text`,
        content: w.word,
        pairKey: `pair-${w.id}`,
        isFlipped: false,
        isMatched: false,
        type: 'text'
      });
      cards.push({
        id: `card-${idx}-hijja`,
        content: w.hijjaText.split('=')[0]?.trim() || w.word,
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden text-slate-100 font-sans">
      <div className="w-full max-w-6xl mx-auto flex flex-col h-full bg-slate-900 border-x border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Top Game Navigation & Status Bar - Responsive */}
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
                  🎮 سبق نمبر ۶
                </span>
                <h1 className="text-xs sm:text-base md:text-lg font-black text-white font-urdu text-center">
                  حروفِ مدہ گیم زون
                </h1>
              </div>
              <span className="text-[10px] text-slate-400 font-urdu hidden sm:inline-block mt-0.5">
                الف مدہ • یاء مدہ • واؤ مدہ
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
        <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setGameTab('quiz')}
              className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                gameTab === 'quiz'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>پہچان و کوئز چیلنج</span>
            </button>

            <button
              onClick={() => setGameTab('puzzle')}
              className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                gameTab === 'puzzle'
                  ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Puzzle className="w-4 h-4" />
              <span>حروف جوڑ مقناطیسی پزل</span>
            </button>

            <button
              onClick={() => setGameTab('match')}
              className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                gameTab === 'match'
                  ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>میموری کارڈ میچنگ گیم</span>
            </button>

            <button
              onClick={() => setGameTab('speed')}
              className={`px-3.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                gameTab === 'speed'
                  ? 'bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/30 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>سپیڈ رَش (ٹائمر چیلنج)</span>
            </button>
          </div>
        </div>

        {/* Sub-Levels for Quiz Mode */}
        {gameTab === 'quiz' && (
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium">سطح کا انتخاب:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setLevel(1)}
                className={`px-3 py-1 rounded-lg transition-all ${level === 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                ۱. مفرداتِ مدہ (۸۴ حروف)
              </button>
              <button
                onClick={() => setLevel(2)}
                className={`px-3 py-1 rounded-lg transition-all ${level === 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                ۲. ثلاثی جوڑیاں (۲۸ حروف)
              </button>
              <button
                onClick={() => setLevel(3)}
                className={`px-3 py-1 rounded-lg transition-all ${level === 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                ۳. تمام ۸۵ مشقی کلمات
              </button>
              <button
                onClick={() => setLevel(4)}
                className={`px-3 py-1 rounded-lg transition-all ${level === 4 ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                ۴. ماسٹر مکسڈ چیلنج
              </button>
            </div>
          </div>
        )}

        {/* Toast Feedback Notification Banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`px-4 py-2.5 border-b flex items-center justify-between text-xs sm:text-sm font-urdu ${
                toastMessage.type === 'correct' 
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' 
                  : toastMessage.type === 'badge'
                  ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
              }`}
              dir="rtl"
            >
              <div className="flex items-center gap-2">
                {toastMessage.type === 'correct' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-rose-400" />}
                <div>
                  <div className="font-bold">{toastMessage.title}</div>
                  <div className="text-[11px] opacity-90">{toastMessage.subText}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Game Arena */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60 flex flex-col items-center justify-center">
          
          {/* ========================================================================= */}
          {/* GAME 1 & 4: QUIZ / SPEED RUSH ARENA */}
          {/* ========================================================================= */}
          {(gameTab === 'quiz' || gameTab === 'speed') && (
            <div className="w-full max-w-2xl mx-auto space-y-6">
              
              {/* Question Audio & Prompt Card */}
              <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/95 border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
                
                {/* Speed Countdown Timer */}
                {(gameTab === 'speed' || level === 4) && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/40 px-3 py-1 rounded-full text-xs font-bold text-rose-300">
                    <Timer className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                    <span>{timeLeft}s</span>
                  </div>
                )}

                {/* Target Category Pill */}
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 mb-3 font-urdu">
                  {targetItem.categoryLabelUrdu} • {targetItem.isHeavy ? 'پُر حرف (مستعلیہ)' : 'باریک حرف'}
                </div>

                <h2 className="text-sm sm:text-base text-slate-300 font-urdu mb-4">
                  صدا سنیں اور درست حرف / کلمہ منتخب کریں:
                </h2>

                {/* Play Audio Button */}
                <div className="flex items-center justify-center gap-3 my-4">
                  <button
                    onClick={() => playQariText(targetItem.rawSound)}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/40"
                    title="دوبارہ سنیں"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>

                  <button
                    onClick={playBreakdownSequence}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
                    title="حرف بہ حرف ہجے سنیں"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>ہجے سنیں</span>
                  </button>
                </div>

                {/* Lifelines Toolbar */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={useFiftyFifty}
                    disabled={hiddenOptionIds.length > 0}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-yellow-300 flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>۵۰:۵۰ لائف لائن (-۱۰ سکے)</span>
                  </button>

                  <button
                    onClick={() => playUrduText(targetItem.tajweedNote)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                    <span>تجویدی اشارہ</span>
                  </button>
                </div>
              </div>

              {/* 4 Multiple Choice Option Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {options.map((opt) => {
                  const isHidden = hiddenOptionIds.includes(opt.id);
                  if (isHidden) {
                    return (
                      <div key={opt.id} className="h-24 sm:h-28 rounded-2xl bg-slate-900/30 border border-slate-800/40 opacity-20 pointer-events-none" />
                    );
                  }

                  const isSelected = selectedId === opt.id;
                  const isTarget = opt.id === targetItem.id;

                  let cardStyle = 'bg-slate-800/90 border-slate-700 hover:border-amber-500/60 text-slate-100';
                  if (answerStatus !== null) {
                    if (isTarget) {
                      cardStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500';
                    } else if (isSelected && !isTarget) {
                      cardStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-500';
                    }
                  }

                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: answerStatus === null ? 1.02 : 1 }}
                      whileTap={{ scale: answerStatus === null ? 0.98 : 1 }}
                      onClick={() => handleSelectOption(opt)}
                      disabled={answerStatus !== null}
                      className={`h-24 sm:h-28 rounded-2xl border-2 p-3 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer relative overflow-hidden ${cardStyle}`}
                    >
                      <span className={`font-arabic text-2xl sm:text-3xl font-bold ${opt.isHeavy ? 'text-cyan-400' : 'text-amber-300'}`}>
                        {opt.word}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-urdu">
                        {opt.categoryLabelUrdu}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Next Question Manual Trigger */}
              <div className="flex justify-center">
                <button
                  onClick={() => generateNewQuestion(level)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>اگلا سوال تبدیل کریں</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* GAME 2: MAGNETIC WORD PUZZLE ARENA */}
          {/* ========================================================================= */}
          {gameTab === 'puzzle' && (
            <div className="w-full max-w-2xl mx-auto space-y-4">
              <div className="bg-slate-800/90 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-center space-y-4">
                
                {/* Header & Quick Dropdown Navigator */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={puzzleTargetIndex}
                      onChange={(e) => setPuzzleTargetIndex(Number(e.target.value))}
                      className="bg-slate-950 text-indigo-300 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-indigo-500/50 cursor-pointer focus:outline-none shadow-md"
                    >
                      {ALL_MADDAH_MASHQ_WORDS.map((w, idx) => (
                        <option key={w.id} value={idx}>
                          {idx + 1}. {w.word} ({w.maddahType === 'alif' ? 'الف مدہ' : w.maddahType === 'waw' ? 'واؤ مدہ' : 'یاء مدہ'})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevPuzzleWord}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700 cursor-pointer"
                        title="پچھلا کلمہ"
                      >
                        ❮
                      </button>
                      <button
                        onClick={nextPuzzleWord}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl text-xs border border-slate-700 cursor-pointer"
                        title="اگلا کلمہ"
                      >
                        ❯
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playQariText(currentPuzzleWord.word)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>مکمل آواز سنیں</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base text-slate-200 font-urdu">
                  نیچے سے حروف و مدات پر کلک کر کے یہ کلمہ مکمل کریں:
                </h3>

                {/* Target word display banner */}
                <div className="text-3xl sm:text-4xl font-arabic font-bold text-amber-300 bg-slate-950/80 py-3 px-6 rounded-2xl border border-slate-800 inline-block shadow-inner">
                  {currentPuzzleWord.word}
                </div>

                <div className="text-xs text-slate-300 font-arabic font-semibold bg-slate-900/60 py-1.5 px-4 rounded-xl border border-slate-800">
                  ہجے: {currentPuzzleWord.hijjaText}
                </div>

                {/* Target Slots Tray - RTL Arabic Layout */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 flex-wrap" dir="rtl">
                  {puzzleSlots.map((val, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePuzzleSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer ${
                        val
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-300 text-white font-arabic font-bold text-2xl sm:text-3xl animate-fadeIn'
                          : 'bg-slate-900/90 border-dashed border-indigo-500/50 text-slate-500 hover:border-indigo-400'
                      }`}
                      title={val ? 'اس ٹکڑے کو ہٹانے کے لیے کلک کریں' : `خالی خانہ ${idx + 1}`}
                    >
                      <span className="text-[10px] text-indigo-300/80 mb-1 font-sans">
                        ٹکڑا {idx + 1}
                      </span>
                      <span className="font-arabic font-bold text-2xl sm:text-3xl">
                        {val || '—'}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Status indicator */}
                {puzzleStatus === 'success' && (
                  <div className="bg-emerald-950/80 border border-emerald-500/60 p-3 rounded-2xl text-emerald-300 text-sm font-bold flex items-center justify-center gap-2 font-urdu animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>ماشاء اللہ! حروفِ مدہ درست ترتیب میں لگ گئے! +۳۰ پوائنٹس 🎉</span>
                  </div>
                )}
                {puzzleStatus === 'error' && (
                  <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-2xl text-rose-300 text-sm font-bold flex items-center justify-center gap-2 font-urdu animate-fadeIn">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>ترتیب درست نہیں ہوئی، خانے پر کلک کر کے دوبارہ لگائیں!</span>
                  </div>
                )}

                {/* Pool of Tiles to Choose From */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-xs text-indigo-300 font-urdu block">
                    نیچے دیے گئے کارڈز میں سے درست ٹکڑے منتخب کریں:
                  </span>

                  <div className="flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap py-2" dir="rtl">
                    {puzzleTileBank.map((tile) => {
                      if (tile.isUsed) {
                        return (
                          <div
                            key={tile.id}
                            className="w-18 sm:w-22 h-14 sm:h-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-600 flex items-center justify-center text-sm font-bold opacity-30 select-none"
                          >
                            ✓
                          </div>
                        );
                      }

                      return (
                        <motion.button
                          key={tile.id}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handlePuzzleTileClick(tile.id)}
                          className="w-18 sm:w-22 h-14 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-amber-600 hover:to-amber-700 text-amber-300 hover:text-white font-arabic text-2xl sm:text-3xl font-bold border-2 border-slate-700 hover:border-amber-400 shadow-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
                        >
                          {tile.text}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetPuzzle}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>دوبارہ شروع کریں</span>
                  </button>
                  <button
                    onClick={nextPuzzleWord}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <span>اگلا کلمہ ❯</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* GAME 3: MEMORY MATCH ARENA */}
          {/* ========================================================================= */}
          {gameTab === 'match' && (
            <div className="w-full max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-xs">
                <span className="text-slate-300 font-urdu">حرکات و مدات کے جوڑے تلاش کریں (کل چالیں: {matchMoves})</span>
                <button
                  onClick={initMatchGame}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>نیا گیم</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {matchCards.map((card) => {
                  const isOpen = card.isFlipped || card.isMatched;
                  return (
                    <motion.button
                      key={card.id}
                      whileHover={{ scale: isOpen ? 1 : 1.03 }}
                      whileTap={{ scale: isOpen ? 1 : 0.97 }}
                      onClick={() => handleFlipCard(card)}
                      className={`h-24 sm:h-28 rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all shadow-md cursor-pointer ${
                        card.isMatched
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 opacity-60 pointer-events-none'
                          : card.isFlipped
                          ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-400'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <span className="font-arabic text-xl sm:text-2xl font-bold">
                            {card.content}
                          </span>
                          <span className="text-[9px] text-amber-400/80 mt-1 font-urdu">
                            {card.type === 'text' ? 'کلمہ' : 'ہجے'}
                          </span>
                        </>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-700/60 flex items-center justify-center text-amber-400 font-bold text-xs">
                          ؟
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
