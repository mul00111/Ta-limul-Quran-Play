import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, VolumeX, ArrowRight, Sparkles, Trophy, Flame, Coins,
  RefreshCw, Zap, CheckCircle2, XCircle, Timer, Layers,
  Lightbulb, BookOpen, Puzzle, Award, Check, Play, ShoppingBag
} from 'lucide-react';
import { 
  playQariText, 
  playQuizFeedbackAudio, 
  stopAllQariAudio, 
  playChimeEffect, 
  playUrduText 
} from '../utils/qariAudioService';

export interface TanweenItem {
  id: string;
  word: string;
  lettersDisplay: string;
  urduSpelling: string;
  category: 'do_zabar' | 'do_zair' | 'do_paish' | 'mixed';
  categoryLabelUrdu: string;
  rawSound: string;
  tanweenType: 'دو زبر (ً)' | 'دو زیر (ٍ)' | 'دو پیش (ٌ)';
  tajweedNote: string;
  breakdownParts: string[];
}

export const TANWEEN_GAME_ITEMS: TanweenItem[] = [
  {
    id: 'tw1',
    word: 'بً',
    lettersDisplay: 'بً = بَ + نۡ',
    urduSpelling: 'باء دو زبر بَنۡ',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر',
    rawSound: 'بَنۡ',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'دو زبر کی آواز نون ساکن (نۡ) جیسی ہوتی ہے: بً = بَنۡ',
    breakdownParts: ['بَ', 'نۡ']
  },
  {
    id: 'tw2',
    word: 'بٍ',
    lettersDisplay: 'بٍ = بِ + نۡ',
    urduSpelling: 'باء دو زیر بِنۡ',
    category: 'do_zair',
    categoryLabelUrdu: 'دو زیر',
    rawSound: 'بِنۡ',
    tanweenType: 'دو زیر (ٍ)',
    tajweedNote: 'دو زیر کی آواز بھی نون ساکن کے ساتھ ہوتی ہے: بٍ = بِنۡ',
    breakdownParts: ['بِ', 'نۡ']
  },
  {
    id: 'tw3',
    word: 'بٌ',
    lettersDisplay: 'بٌ = بُ + نۡ',
    urduSpelling: 'باء دو پیش بُنۡ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش',
    rawSound: 'بُنۡ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'دو پیش کی آواز پیش اور نون ساکن سے بنتی ہے: بٌ = بُنۡ',
    breakdownParts: ['بُ', 'نۡ']
  },
  {
    id: 'tw4',
    word: 'اَحَدًا',
    lettersDisplay: 'اَ + حَ + دًا',
    urduSpelling: 'ہمزہ زبر اَ، حاء زبر حَ، دال دو زبر دًا',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر لفظ',
    rawSound: 'اَحَدًا',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'دو زبر کے ساتھ الف لکھا جاتا ہے مگر وصل میں پڑھا نہیں جاتا۔',
    breakdownParts: ['اَ', 'حَ', 'دًا']
  },
  {
    id: 'tw5',
    word: 'کُفُوًا',
    lettersDisplay: 'کُ + فُ + وًا',
    urduSpelling: 'کاف پیش کُ، فا پیش فُ، واؤ دو زبر وًا',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر لفظ',
    rawSound: 'کُفُوًا',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'حرکات کو کھینچے بغیر جلدی پڑھیں اور تنوین پر دھیان رکھیں۔',
    breakdownParts: ['کُ', 'فُ', 'وًا']
  },
  {
    id: 'tw6',
    word: 'حَسَدٍ',
    lettersDisplay: 'حَ + سَ + دٍ',
    urduSpelling: 'حاء زبر حَ، سین زبر سَ، دال دو زیر دٍ',
    category: 'do_zair',
    categoryLabelUrdu: 'دو زیر لفظ',
    rawSound: 'حَسَدٍ',
    tanweenType: 'دو زیر (ٍ)',
    tajweedNote: 'دال پر دو زیر ہے، معروف آواز کے ساتھ ادا کریں۔',
    breakdownParts: ['حَ', 'سَ', 'دٍ']
  },
  {
    id: 'tw7',
    word: 'مَسَدٍ',
    lettersDisplay: 'مَ + سَ + دٍ',
    urduSpelling: 'میم زبر مَ، سین زبر سَ، دال دو زیر دٍ',
    category: 'do_zair',
    categoryLabelUrdu: 'دو زیر لفظ',
    rawSound: 'مَسَدٍ',
    tanweenType: 'دو زیر (ٍ)',
    tajweedNote: 'وقف کی صورت میں دال ساکن ہو جائے گی اور قلقلہ ہوگا۔',
    breakdownParts: ['مَ', 'سَ', 'دٍ']
  },
  {
    id: 'tw8',
    word: 'غَاسِقٍ',
    lettersDisplay: 'غَا + سِ + قٍ',
    urduSpelling: 'غین الف زبر غَا، سین زیر سِ، قاف دو زیر قٍ',
    category: 'do_zair',
    categoryLabelUrdu: 'دو زیر لفظ',
    rawSound: 'غَاسِقٍ',
    tanweenType: 'دو زیر (ٍ)',
    tajweedNote: 'قاف کو پر (موٹا) پڑھیں اور دو زیر صاف ادا کریں۔',
    breakdownParts: ['غَا', 'سِ', 'قٍ']
  },
  {
    id: 'tw9',
    word: 'عَمَدٍ',
    lettersDisplay: 'عَ + مَ + دٍ',
    urduSpelling: 'عین زبر عَ، میم زبر مَ، دال دو زیر دٍ',
    category: 'do_zair',
    categoryLabelUrdu: 'دو زیر لفظ',
    rawSound: 'عَمَدٍ',
    tanweenType: 'دو زیر (ٍ)',
    tajweedNote: 'عین کو حلق کے درمیان سے ادا کریں۔',
    breakdownParts: ['عَ', 'مَ', 'دٍ']
  },
  {
    id: 'tw10',
    word: 'کُتُبٌ',
    lettersDisplay: 'کُ + تُ + بٌ',
    urduSpelling: 'کاف پیش کُ، تا پیش تُ، باء دو پیش بٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'کُتُبٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'باء پر دو پیش کی آواز واضح اور بغیر جھٹکے کے ادا کریں۔',
    breakdownParts: ['کُ', 'تُ', 'بٌ']
  },
  {
    id: 'tw11',
    word: 'سُرُرٌ',
    lettersDisplay: 'سُ + رُ + رٌ',
    urduSpelling: 'سین پیش سُ، راء پیش رُ، راء دو پیش رٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'سُرُرٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'پیش کی وجہ سے راء پُر (موٹی) پڑھی جائے گی۔',
    breakdownParts: ['سُ', 'رُ', 'رٌ']
  },
  {
    id: 'tw12',
    word: 'رَحِیۡمٌ',
    lettersDisplay: 'رَ + حِیۡ + مٌ',
    urduSpelling: 'راء زبر رَ، حاء یا زیر حِیۡ، میم دو پیش مٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'رَحِیۡمٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'حروفِ مدہ کے بعد تنوین ہے، مد کی لمبائی اور تنوین کا دھیان رکھیں۔',
    breakdownParts: ['رَ', 'حِیۡ', 'مٌ']
  },
  {
    id: 'tw13',
    word: 'شَہَادَةً',
    lettersDisplay: 'شَ + ہَا + دَةً',
    urduSpelling: 'شین زبر شَ، ہاء الف زبر ہَا، دال زبر دَ، تا دو زبر تً',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر لفظ',
    rawSound: 'شَہَادَةً',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'گول تا (ة) پر دو زبر ہو تو الف نہیں لکھا جاتا۔',
    breakdownParts: ['شَ', 'ہَا', 'دَةً']
  },
  {
    id: 'tw14',
    word: 'مَرَضٌ',
    lettersDisplay: 'مَ + رَ + ضٌ',
    urduSpelling: 'میم زبر مَ، راء زبر رَ، ضاد دو پیش ضٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'مَرَضٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'ضاد کو پر (موٹا) پڑھیں اور دو پیش صاف ادا کریں۔',
    breakdownParts: ['مَ', 'رَ', 'ضٌ']
  },
  {
    id: 'tw15',
    word: 'قَوْلٌ',
    lettersDisplay: 'قَوْ + لٌ',
    urduSpelling: 'قاف واؤ زبر قَوْ، لام دو پیش لٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'قَوْلٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'حرفِ لین (واؤ لین) کے بعد تنوین ہے، نرمی سے ادا کریں۔',
    breakdownParts: ['قَوْ', 'لٌ']
  },
  {
    id: 'tw16',
    word: 'سَلَامٌ',
    lettersDisplay: 'سَ + لَا + مٌ',
    urduSpelling: 'سین زبر سَ، لام الف زبر لَا، میم دو پیش مٌ',
    category: 'do_paish',
    categoryLabelUrdu: 'دو پیش لفظ',
    rawSound: 'سَلَامٌ',
    tanweenType: 'دو پیش (ٌ)',
    tajweedNote: 'لام الف کو ایک الف کی مقدار کھینچیں اور میم دو پیش مٌ ادا کریں۔',
    breakdownParts: ['سَ', 'لَا', 'مٌ']
  },
  {
    id: 'tw17',
    word: 'خَوْفًا',
    lettersDisplay: 'خَوْ + فًا',
    urduSpelling: 'خاء واؤ زبر خَوْ، فا دو زبر فً',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر لفظ',
    rawSound: 'خَوْفًا',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'خاء کو پر پڑھیں، واؤ لین میں نرمی اور فا پر دو زبر فَن ادا کریں۔',
    breakdownParts: ['خَوْ', 'فًا']
  },
  {
    id: 'tw18',
    word: 'طَبَقًا',
    lettersDisplay: 'طَ + بَ + قًا',
    urduSpelling: 'طاء زبر طَ، باء زبر بَ، قاف دو زبر قً',
    category: 'do_zabar',
    categoryLabelUrdu: 'دو زبر لفظ',
    rawSound: 'طَبَقًا',
    tanweenType: 'دو زبر (ً)',
    tajweedNote: 'طاء اور قاف دونوں پر (موٹے) حروف ہیں، دو زبر قَن ادا کریں۔',
    breakdownParts: ['طَ', 'بَ', 'قًا']
  }
];

const DISTRACTOR_TILES = ['قً', 'تٍ', 'مٌ', 'سَ', 'لِ', 'نُ', 'بً', 'حٍ', 'دٌ', 'زً', 'رٌ', 'فً'];

export interface TanweenGameModalProps {
  onClose?: () => void;
  onBack?: () => void;
}

export const TanweenGameModal: React.FC<TanweenGameModalProps> = ({ onClose, onBack }) => {
  const handleExit = onBack || onClose;
  const [activeTab, setActiveTab] = useState<'puzzle' | 'audioQuiz' | 'sortBasket' | 'speedChallenge'>('puzzle');
  const [filterCategory, setFilterCategory] = useState<'all' | 'do_zabar' | 'do_zair' | 'do_paish'>('all');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(150);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showRuleCard, setShowRuleCard] = useState(true);

  // Puzzle State
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [tileBank, setTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);

  // Audio Quiz State
  const [quizOptions, setQuizOptions] = useState<TanweenItem[]>([]);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);

  // Basket Sorting State
  const [sortedCounts, setSortedCounts] = useState({ do_zabar: 0, do_zair: 0, do_paish: 0 });

  // Speed Challenge Timer State
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const filteredItems = useMemo(() => {
    if (filterCategory === 'all') return TANWEEN_GAME_ITEMS;
    return TANWEEN_GAME_ITEMS.filter(i => i.category === filterCategory);
  }, [filterCategory]);

  const currentItem = filteredItems[currentIndex % filteredItems.length] || TANWEEN_GAME_ITEMS[0];

  // Timer for Speed Challenge
  useEffect(() => {
    let timer: any = null;
    if (activeTab === 'speedChallenge' && isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeTab === 'speedChallenge') {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [activeTab, isTimerActive, timeLeft]);

  // Reset/Initialize Puzzle
  useEffect(() => {
    if (!currentItem) return;
    const parts = currentItem.breakdownParts;
    setSlots(new Array(parts.length).fill(null));

    const correctTiles = parts.map((p, idx) => ({ id: `correct-${idx}-${p}`, text: p, isUsed: false }));
    const distractors = DISTRACTOR_TILES
      .filter(d => !parts.includes(d))
      .slice(0, 3)
      .map((d, idx) => ({ id: `distractor-${idx}-${d}`, text: d, isUsed: false }));

    const combined = [...correctTiles, ...distractors].sort(() => Math.random() - 0.5);
    setTileBank(combined);
    setFeedback(null);
  }, [currentIndex, filterCategory]);

  // Reset/Initialize Audio Quiz
  useEffect(() => {
    if (activeTab === 'audioQuiz' || activeTab === 'speedChallenge') {
      const wrong = TANWEEN_GAME_ITEMS.filter(i => i.id !== currentItem.id).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [currentItem, ...wrong].sort(() => Math.random() - 0.5);
      setQuizOptions(opts);
      setSelectedQuizAnswer(null);
      setFeedback(null);
    }
  }, [currentIndex, activeTab]);

  const handlePlayAudio = async (text?: string) => {
    if (isMuted) return;
    setIsPlayingAudio(true);
    try {
      await playQariText(text || currentItem.rawSound);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const triggerSuccessPraise = async () => {
    if (!isMuted) {
      playChimeEffect('success'); // Triggers praise voice e.g. "ماشاء اللہ! بہت خوب!"
      await playQariText(currentItem.rawSound);
    }
  };

  // Puzzle Tile Click
  const handleTileClick = (tile: { id: string; text: string; isUsed: boolean }) => {
    if (tile.isUsed) return;
    const emptyIndex = slots.findIndex(s => s === null);
    if (emptyIndex === -1) return;

    const newSlots = [...slots];
    newSlots[emptyIndex] = tile.text;
    setSlots(newSlots);

    setTileBank(prev => prev.map(t => t.id === tile.id ? { ...t, isUsed: true } : t));

    if (!isMuted) {
      playQariText(tile.text);
    }

    if (emptyIndex === slots.length - 1) {
      validatePuzzle(newSlots as string[]);
    }
  };

  const handleSlotClick = (index: number) => {
    const text = slots[index];
    if (!text) return;

    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);

    const tileIndex = tileBank.findIndex(t => t.text === text && t.isUsed);
    if (tileIndex !== -1) {
      const newBank = [...tileBank];
      newBank[tileIndex].isUsed = false;
      setTileBank(newBank);
    }
  };

  const validatePuzzle = async (finalSlots: string[]) => {
    const isCorrect = finalSlots.every((s, i) => s === currentItem.breakdownParts[i]);
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 20);
      setStreak(st => st + 1);
      setCoins(c => c + 15);
      await triggerSuccessPraise();
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % filteredItems.length);
      }, 1400);
    } else {
      setFeedback('wrong');
      setStreak(0);
      if (!isMuted) playQuizFeedbackAudio(false);
      setTimeout(() => {
        setSlots(new Array(currentItem.breakdownParts.length).fill(null));
        setTileBank(prev => prev.map(t => ({ ...t, isUsed: false })));
        setFeedback(null);
      }, 1200);
    }
  };

  // Quiz Select Handler
  const handleQuizSelect = async (option: TanweenItem) => {
    setSelectedQuizAnswer(option.id);
    if (option.id === currentItem.id) {
      setFeedback('correct');
      setScore(s => s + 25);
      setStreak(st => st + 1);
      setCoins(c => c + 20);
      await triggerSuccessPraise();
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % filteredItems.length);
      }, 1400);
    } else {
      setFeedback('wrong');
      setStreak(0);
      if (!isMuted) playQuizFeedbackAudio(false);
    }
  };

  // Basket Sort Handler
  const handleSortBasket = async (targetCategory: 'do_zabar' | 'do_zair' | 'do_paish') => {
    const isCorrect = currentItem.category === targetCategory;
    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 30);
      setStreak(st => st + 1);
      setCoins(c => c + 25);
      setSortedCounts(prev => ({ ...prev, [targetCategory]: prev[targetCategory] + 1 }));
      await triggerSuccessPraise();
      setTimeout(() => {
        setCurrentIndex(i => (i + 1) % filteredItems.length);
        setFeedback(null);
      }, 1400);
    } else {
      setFeedback('wrong');
      setStreak(0);
      if (!isMuted) playQuizFeedbackAudio(false);
      setTimeout(() => {
        setFeedback(null);
      }, 1200);
    }
  };

  const startSpeedChallenge = () => {
    setTimeLeft(30);
    setIsTimerActive(true);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-urdu select-none overflow-y-auto" dir="rtl">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl sm:rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* =========================================================================
            1. TOP CONTROL BAR & STATS
        ========================================================================= */}
        <header className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          <div className="flex items-center gap-2">
            {handleExit && (
              <button
                onClick={handleExit}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-amber-300 flex items-center gap-1.5">
                  <span>سبق ۸: تنوین گیم زون</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-sans font-bold">ً ٍ ٌ</span>
                </h2>
                <p className="text-[11px] text-slate-400 hidden xs:block">دو زبر، دو زیر اور دو پیش کی تفریحی مشق</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-amber-500/30 text-xs font-bold text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>{score}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-orange-500/30 text-xs font-bold text-orange-400">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{streak}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-amber-400/30 text-xs font-bold text-amber-300">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>{coins}</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                isMuted ? 'bg-rose-950/60 border-rose-700 text-rose-300' : 'bg-slate-800 border-slate-700 text-amber-400'
              }`}
              title={isMuted ? 'آواز آن کریں' : 'میوٹ کریں'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

        </header>

        {/* =========================================================================
            2. GAME TABS & FILTERS
        ========================================================================= */}
        <div className="p-2 sm:p-3 bg-slate-900 border-b border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('puzzle')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'puzzle'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>🧩 پزل جوڑیں</span>
            </button>

            <button
              onClick={() => setActiveTab('audioQuiz')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'audioQuiz'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>🎧 صوتی کوئز</span>
            </button>

            <button
              onClick={() => setActiveTab('sortBasket')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'sortBasket'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>🧺 ٹوکری چھانٹیں</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('speedChallenge');
                if (!isTimerActive && timeLeft === 30) startSpeedChallenge();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'speedChallenge'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ اسپیڈ چیلنج</span>
            </button>
          </div>

          {/* Sub-Filter for categories */}
          {activeTab !== 'speedChallenge' && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400 shrink-0">فلٹر:</span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(['all', 'do_zabar', 'do_zair', 'do_paish'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilterCategory(cat);
                      setCurrentIndex(0);
                    }}
                    className={`px-2.5 py-0.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat === 'all' && 'تمام تنوین'}
                    {cat === 'do_zabar' && 'دو زبر (ً)'}
                    {cat === 'do_zair' && 'دو زیر (ٍ)'}
                    {cat === 'do_paish' && 'دو پیش (ٌ)'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            3. MAIN GAME CONTENT AREA
        ========================================================================= */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 flex-1">

          {/* TAJWEED TIP CARD */}
          {showRuleCard && activeTab !== 'speedChallenge' && (
            <div className="bg-amber-950/20 border border-amber-500/25 p-2.5 sm:p-3 rounded-2xl flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-amber-300">قاعدہ:</strong> دو زبر (ً)، دو زیر (ٍ) اور دو پیش (ٌ) کو تنوین کہتے ہیں۔ تنوین میں نون ساکن (نۡ) کی آواز ہوتی ہے!
                </p>
              </div>
              <button
                onClick={() => setShowRuleCard(false)}
                className="text-slate-500 hover:text-slate-300 text-[10px] px-1.5 py-0.5 rounded border border-slate-800 shrink-0"
              >
                بند کریں
              </button>
            </div>
          )}

          {/* =========================================================
              MODE 1: PUZZLE BUILDER
          ========================================================= */}
          {activeTab === 'puzzle' && (
            <div className="space-y-3">
              
              {/* Target Stage Card */}
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 sm:p-4 text-center space-y-2 shadow-lg relative">
                
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-[11px] font-bold">
                    <span>{currentItem.tanweenType}</span>
                    <span>•</span>
                    <span>{currentItem.categoryLabelUrdu}</span>
                  </div>

                  <button
                    onClick={() => handlePlayAudio()}
                    disabled={isPlayingAudio}
                    className="px-3 py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isPlayingAudio ? 'تلاوت...' : 'تلاوت سنیں'}</span>
                  </button>
                </div>

                {/* Big Word Display */}
                <div className="py-1 min-h-[60px] flex items-center justify-center">
                  <div
                    key={currentItem.id}
                    className="text-4xl sm:text-6xl font-black text-amber-300 font-arabic tracking-wide drop-shadow-md select-none"
                  >
                    {currentItem.word}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-amber-300/90 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    ہجے: {currentItem.urduSpelling}
                  </span>
                  <p className="text-slate-400">
                    💡 {currentItem.tajweedNote}
                  </p>
                </div>
              </div>

              {/* Puzzle Target Slots */}
              <div className="space-y-1.5 text-center bg-slate-950/60 p-2.5 sm:p-3 rounded-2xl border border-slate-800">
                <div className="text-[11px] font-bold text-amber-300/90">
                  حروف و تنوین کے ٹکڑے درست ترتیب سے خانوں میں رکھیں:
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl font-black font-arabic transition-all ${
                        slot
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md scale-105'
                          : 'bg-slate-900 border-dashed border-slate-700 text-slate-500 hover:border-amber-400/50'
                      }`}
                    >
                      {slot || '_'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Tile Bank */}
              <div className="bg-slate-950/80 p-2.5 sm:p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 text-center">
                  نیچے دیے گئے حروف پر ٹیپ کر کے پزل مکمل کریں:
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {tileBank.map(tile => (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile)}
                      disabled={tile.isUsed}
                      className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl font-black text-lg sm:text-xl font-arabic transition-all flex items-center justify-center cursor-pointer ${
                        tile.isUsed
                          ? 'opacity-20 bg-slate-900 text-slate-600 cursor-not-allowed scale-90'
                          : 'bg-slate-800 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 border border-amber-500/30 shadow-md hover:scale-105 active:scale-95'
                      }`}
                    >
                      {tile.text}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* =========================================================
              MODE 2: AUDIO QUIZ
          ========================================================= */}
          {activeTab === 'audioQuiz' && (
            <div className="space-y-4">
              
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 text-center space-y-4 shadow-lg">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-300 text-xs font-bold">
                  <span>🎧 صوتی سماعت چیلنج</span>
                </div>

                <div>
                  <button
                    onClick={() => handlePlayAudio()}
                    disabled={isPlayingAudio}
                    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 flex flex-col items-center justify-center gap-1 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold"
                  >
                    <Volume2 className="w-8 h-8 animate-bounce" />
                    <span className="text-xs">تلاوت سنیں</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-300">
                  قاری صاحب کی تلاوت سن کر بتائیں کہ کون سا کلمہ پڑھا گیا ہے؟
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {quizOptions.map((opt) => {
                  const isSelected = selectedQuizAnswer === opt.id;
                  const isCorrect = opt.id === currentItem.id;
                  let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-amber-300 border-slate-800';

                  if (selectedQuizAnswer) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md scale-[1.02]';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleQuizSelect(opt)}
                      disabled={selectedQuizAnswer !== null}
                      className={`p-4 rounded-xl border-2 text-2xl sm:text-3xl font-black font-arabic transition-all flex flex-col items-center justify-center gap-1 cursor-pointer shadow-md ${btnStyle}`}
                    >
                      <span>{opt.word}</span>
                      <span className="text-[11px] font-sans text-slate-400 font-bold">{opt.categoryLabelUrdu}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

          {/* =========================================================
              MODE 3: BASKET SORTING
          ========================================================= */}
          {activeTab === 'sortBasket' && (
            <div className="space-y-4">
              
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 text-center space-y-3 shadow-lg">
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                  درست ٹوکری منتخب کریں
                </span>

                <div className="py-2">
                  <motion.div
                    key={currentItem.id}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-5xl sm:text-6xl font-black text-amber-300 font-arabic tracking-wide"
                  >
                    {currentItem.word}
                  </motion.div>
                </div>

                <p className="text-xs text-slate-300">
                  اس لفظ میں کون سی تنوین موجود ہے؟ متعلقہ ٹوکری پر کلک کریں:
                </p>
              </div>

              {/* 3 Category Baskets */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={() => handleSortBasket('do_zabar')}
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/50 hover:border-emerald-400 text-emerald-300 flex flex-col items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-6 h-6 text-emerald-400" />
                  <span className="font-black text-sm sm:text-base font-arabic">دو زبر (ً)</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-sans">
                    جمع: {sortedCounts.do_zabar}
                  </span>
                </button>

                <button
                  onClick={() => handleSortBasket('do_zair')}
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-300 flex flex-col items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-6 h-6 text-cyan-400" />
                  <span className="font-black text-sm sm:text-base font-arabic">دو زیر (ٍ)</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full font-sans">
                    جمع: {sortedCounts.do_zair}
                  </span>
                </button>

                <button
                  onClick={() => handleSortBasket('do_paish')}
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 hover:border-amber-400 text-amber-300 flex flex-col items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-6 h-6 text-amber-400" />
                  <span className="font-black text-sm sm:text-base font-arabic">دو پیش (ٌ)</span>
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full font-sans">
                    جمع: {sortedCounts.do_paish}
                  </span>
                </button>
              </div>

            </div>
          )}

          {/* =========================================================
              MODE 4: SPEED CHALLENGE
          ========================================================= */}
          {activeTab === 'speedChallenge' && (
            <div className="space-y-4">
              
              {/* Speed Header */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 text-center space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Timer className="w-4 h-4 animate-spin" />
                    <span>وقت: {timeLeft} سیکنڈ</span>
                  </div>
                  <button
                    onClick={startSpeedChallenge}
                    className="px-2.5 py-1 bg-amber-500 text-zinc-950 rounded-lg font-black text-xs cursor-pointer"
                  >
                    دوبارہ شروع کریں
                  </button>
                </div>

                <div className="py-2">
                  <span className="text-4xl sm:text-5xl font-black text-amber-300 font-arabic">
                    {currentItem.word}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-bold">
                  تیزی سے بتائیں کہ اس میں کون سی تنوین ہے؟
                </p>
              </div>

              {/* Speed Options */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSortBasket('do_zabar')}
                  disabled={timeLeft === 0}
                  className="p-3 bg-slate-950 border border-amber-500/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 rounded-xl font-black text-sm font-arabic transition-all cursor-pointer"
                >
                  دو زبر (ً)
                </button>
                <button
                  onClick={() => handleSortBasket('do_zair')}
                  disabled={timeLeft === 0}
                  className="p-3 bg-slate-950 border border-amber-500/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 rounded-xl font-black text-sm font-arabic transition-all cursor-pointer"
                >
                  دو زیر (ٍ)
                </button>
                <button
                  onClick={() => handleSortBasket('do_paish')}
                  disabled={timeLeft === 0}
                  className="p-3 bg-slate-950 border border-amber-500/40 hover:bg-amber-500 hover:text-zinc-950 text-amber-300 rounded-xl font-black text-sm font-arabic transition-all cursor-pointer"
                >
                  دو پیش (ٌ)
                </button>
              </div>

            </div>
          )}

          {/* FEEDBACK OVERLAY */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3.5 rounded-xl text-center font-black text-xs sm:text-sm flex items-center justify-center gap-2 ${
                  feedback === 'correct'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg'
                }`}
              >
                {feedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>ماشاء اللہ! بالکل درست جواب! 🎉 (+25 پوائنٹس)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>جواب درست نہیں۔ تنوین کی علامت (ً ٍ ٌ) پر دوبارہ غور فرمائیں۔</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* =========================================================================
            4. FOOTER PAGINATION & NAVIGATION
        ========================================================================= */}
        <footer className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-bold shrink-0">
          <button
            onClick={() => setCurrentIndex(i => (i - 1 + filteredItems.length) % filteredItems.length)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer"
          >
            پچھلا کلمہ
          </button>

          <span className="text-slate-400">
            کلمہ {currentIndex + 1} از {filteredItems.length}
          </span>

          <button
            onClick={() => setCurrentIndex(i => (i + 1) % filteredItems.length)}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl font-black shadow-md cursor-pointer flex items-center gap-1"
          >
            <span>اگلا کلمہ</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </footer>

      </div>
    </div>
  );
};
