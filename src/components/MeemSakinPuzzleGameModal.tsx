import React, { useState, useEffect } from 'react';
import { 
  X, 
  Puzzle, 
  Trophy, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  Volume2, 
  Sparkles, 
  Award, 
  Lightbulb, 
  Flame,
  ArrowRight,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { meemSakinWords, MeemSakinWord } from '../data/meemSakinData';
import { playQariText, playChimeEffect, playWordWithHijjaAndPronunciation, stopAllQariAudio } from '../utils/qariAudioService';
import { motion, AnimatePresence } from 'motion/react';

interface MeemSakinPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeemSakinPuzzleGameModal({ isOpen, onClose }: MeemSakinPuzzleModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredWords, setFilteredWords] = useState<MeemSakinWord[]>(meemSakinWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const [scrambledTiles, setScrambledTiles] = useState<{ id: string; text: string; originalIndex: number }[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [score, setScore] = useState<number>(() => Number(localStorage.getItem('meem_puzzle_score') || '150'));
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('meem_puzzle_coins') || '75'));
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('meem_puzzle_streak') || '3'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [showError, setShowError] = useState(false);

  // Filter words when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredWords(meemSakinWords);
    } else {
      setFilteredWords(meemSakinWords.filter(w => w.rule === selectedCategory));
    }
    setCurrentWordIndex(0);
  }, [selectedCategory]);

  const currentWord: MeemSakinWord = filteredWords[currentWordIndex % filteredWords.length] || meemSakinWords[0];

  const preparePuzzle = (word: MeemSakinWord) => {
    const chunks = word.arabic.split(' ').filter(Boolean);
    
    const tiles = chunks.map((chunk, idx) => ({
      id: `${word.id}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      text: chunk,
      originalIndex: idx
    }));

    const shuffled = [...tiles].sort(() => Math.random() - 0.5);
    setScrambledTiles(shuffled);
    setSelectedSlots(new Array(chunks.length).fill(null));
    setIsCompleted(false);
    setShowCelebration(false);
    setShowError(false);
  };

  useEffect(() => {
    if (isOpen && currentWord) {
      preparePuzzle(currentWord);
    }
  }, [isOpen, currentWordIndex, selectedCategory]);

  if (!isOpen) return null;

  const handleTileClick = (tile: { id: string; text: string; originalIndex: number }) => {
    if (isCompleted) return;
    setShowError(false);
    const emptyIndex = selectedSlots.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      const newSlots = [...selectedSlots];
      newSlots[emptyIndex] = tile.id;
      setSelectedSlots(newSlots);

      playChimeEffect('success');
      
      // Check if all slots filled
      if (!newSlots.includes(null)) {
        checkCompletion(newSlots);
      }
    }
  };

  const handleSlotClick = (slotIdx: number) => {
    if (isCompleted) return;
    setShowError(false);
    const slotTileId = selectedSlots[slotIdx];
    if (slotTileId) {
      const newSlots = [...selectedSlots];
      newSlots[slotIdx] = null;
      setSelectedSlots(newSlots);
    }
  };

  const checkCompletion = (currentSlots: (string | null)[]) => {
    const isCorrect = currentSlots.every((slotId, slotIdx) => {
      const tileObj = scrambledTiles.find(t => t.id === slotId);
      return tileObj?.originalIndex === slotIdx;
    });

    if (isCorrect) {
      setIsCompleted(true);
      setShowCelebration(true);
      setShowError(false);
      
      const newScore = score + 35;
      const newCoins = coins + 15;
      const newStreak = streak + 1;
      
      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);
      localStorage.setItem('meem_puzzle_score', newScore.toString());
      localStorage.setItem('meem_puzzle_coins', newCoins.toString());
      localStorage.setItem('meem_puzzle_streak', newStreak.toString());
      
      playChimeEffect('success');
      try {
        playWordWithHijjaAndPronunciation(currentWord.spellingHijja, currentWord.arabic);
      } catch (e) {
        playQariText(currentWord.arabic);
      }

      // Auto advance after 2.5 seconds
      setTimeout(() => {
        handleNextWord();
      }, 2500);
    } else {
      setIsCompleted(false);
      setShowCelebration(false);
      setShowError(true);
      setStreak(0);
      playChimeEffect('error');
    }
  };

  const handleNextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setCurrentWordIndex(0);
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    } else {
      setCurrentWordIndex(filteredWords.length - 1);
    }
  };

  const handleUseHint = () => {
    if (isCompleted) return;
    setShowError(false);
    const chunks = currentWord.arabic.split(' ').filter(Boolean);
    const newSlots = [...selectedSlots];

    for (let i = 0; i < chunks.length; i++) {
      const currentTileId = newSlots[i];
      const currentTile = scrambledTiles.find(t => t.id === currentTileId);
      if (!currentTile || currentTile.originalIndex !== i) {
        const correctTile = scrambledTiles.find(t => t.originalIndex === i);
        if (correctTile) {
          const existingIdx = newSlots.indexOf(correctTile.id);
          if (existingIdx !== -1) {
            newSlots[existingIdx] = null;
          }
          newSlots[i] = correctTile.id;
          setSelectedSlots(newSlots);
          playChimeEffect('success');

          if (!newSlots.includes(null)) {
            checkCompletion(newSlots);
          }
          break;
        }
      }
    }
  };

  const getRuleBadgeStyle = (rule: string) => {
    switch (rule) {
      case 'Idgham Shafawi':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'Ikhfa Shafawi':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/50';
      case 'Izhar Shafawi':
      default:
        return 'bg-teal-500/20 text-teal-300 border-teal-500/50';
    }
  };

  const getRuleUrduName = (rule: string) => {
    switch (rule) {
      case 'Idgham Shafawi': return 'ادغامِ شفوی (میم)';
      case 'Ikhfa Shafawi': return 'اخفائے شفوی (باء)';
      case 'Izhar Shafawi': default: return 'اظهارِ شفوی (بقیہ حروف)';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-3 font-urdu select-none overflow-y-auto" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#0e131f] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-teal-500/40 flex flex-col my-auto max-h-[88vh]"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-5 py-4 text-white flex justify-between items-center border-b border-teal-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center shadow-inner shrink-0">
              <Puzzle className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">مقناطیسی پزل: سبق ۱۱ (میم ساکن)</h2>
              <p className="text-teal-200/80 text-[11px] sm:text-xs mt-0.5">حروف اور الفاظ کو درست خانوں میں جوڑ کر تلاوت سیکھیں</p>
            </div>
          </div>
          <button 
            onClick={() => {
              stopAllQariAudio();
              onClose();
            }} 
            className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-teal-300 hover:text-teal-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-teal-500/40 hover:border-teal-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-teal-300" />
            <span>واپسی</span>
          </button>
        </div>

        {/* Stats & Controls Bar */}
        <div className="bg-slate-900 px-3.5 sm:px-4 py-2 border-b border-slate-800/80 flex items-center justify-between gap-1.5 text-slate-200 text-xs overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-300 text-[11px] sm:text-xs">اسکور: {score}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold text-rose-300 text-[11px] sm:text-xs">اسٹریک: {streak}</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
              <span>🪙</span>
              <span className="font-bold text-yellow-300 text-[11px] sm:text-xs">{coins}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleUseHint}
              disabled={isCompleted}
              className="flex items-center gap-1 text-[11px] bg-amber-600/90 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg transition-all shadow cursor-pointer disabled:opacity-50 font-bold border border-amber-500/40 shrink-0"
            >
              <Lightbulb className="w-3.5 h-3.5 text-yellow-200" />
              <span>اشارہ</span>
            </button>
            <button
              onClick={() => preparePuzzle(currentWord)}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition-all shadow cursor-pointer border border-slate-700 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>شفل</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-slate-950 px-3.5 sm:px-4 py-2 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden border-b border-slate-800/80 shrink-0">
          <span className="text-slate-400 text-[11px] flex items-center gap-1 shrink-0"><Filter className="w-3.5 h-3.5 text-teal-400" /> قاعدہ:</span>
          {[
            { id: 'all', label: 'تمام قواعد ✨' },
            { id: 'Idgham Shafawi', label: 'ادغامِ شفوی' },
            { id: 'Ikhfa Shafawi', label: 'اخفائے شفوی' },
            { id: 'Izhar Shafawi', label: 'اظہارِ شفوی' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main Interactive Board */}
        <div className="p-3.5 sm:p-5 flex-1 overflow-y-auto flex flex-col items-center space-y-3.5 bg-[#0a0f18]">
          
          {/* Navigation & Question Indicator */}
          <div className="w-full max-w-lg flex items-center justify-between text-xs font-bold shrink-0">
            <button 
              onClick={handlePrevWord}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow shrink-0"
            >
              <ArrowRight className="w-4 h-4 text-teal-400" />
              <span>پچھلا</span>
            </button>
            <div className="px-4 py-1 rounded-full bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30 text-xs">
              پزل {currentWordIndex + 1} از {filteredWords.length}
            </div>
            <button 
              onClick={handleNextWord}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 shadow shrink-0"
            >
              <span>اگلا</span>
              <ArrowLeft className="w-4 h-4 text-teal-400" />
            </button>
          </div>

          {/* Target Rule & Word Info Card */}
          <div className="bg-slate-900/95 border border-teal-500/40 shadow-xl rounded-2xl p-3.5 sm:p-4 w-full max-w-lg text-center shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-800">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getRuleBadgeStyle(currentWord.rule)}`}>
                {getRuleUrduName(currentWord.rule)}
              </span>
              <button
                onClick={() => {
                  try {
                    playWordWithHijjaAndPronunciation(currentWord.spellingHijja, currentWord.arabic);
                  } catch (e) {
                    playQariText(currentWord.arabic);
                  }
                }}
                className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow shrink-0"
              >
                <Volume2 className="w-3.5 h-3.5 text-yellow-200" />
                <span>تلاوت سنیں</span>
              </button>
            </div>

            <div className="my-2">
              <h3 className="text-3xl sm:text-4xl font-arabic font-black text-amber-300 tracking-wide leading-relaxed drop-shadow-sm">
                {currentWord.arabic}
              </h3>
              <p className="text-teal-200 text-xs sm:text-sm font-bold mt-1">
                ترجمہ: {currentWord.urduTranslation}
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2 text-[11px] text-slate-300 font-mono mt-2">
              <span className="font-bold text-teal-400">ہجے و ترکیب: </span>
              <span className="text-slate-300">{currentWord.spellingHijja}</span>
            </div>
          </div>

          {/* Puzzle Question Slots with '?' */}
          <div className="w-full max-w-lg shrink-0">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-xs font-bold text-slate-300">مقناطیسی تختی (خانوں میں ٹکڑے جوڑیں):</span>
              <span className="text-[10px] text-teal-400">کلک کر کے ہٹا سکتے ہیں</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 min-h-[90px] p-3 bg-slate-900/90 border-2 border-dashed border-teal-500/40 rounded-2xl shadow-inner">
              {selectedSlots.map((tileId, slotIdx) => {
                const tile = scrambledTiles.find(t => t.id === tileId);
                return (
                  <motion.button
                    key={slotIdx}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSlotClick(slotIdx)}
                    className={`min-w-[85px] sm:min-w-[100px] h-16 sm:h-20 rounded-xl border-2 flex items-center justify-center font-arabic text-2xl shadow-md transition-all cursor-pointer px-3 ${
                      tile 
                        ? 'bg-slate-800 border-teal-400 text-white font-bold shadow-teal-500/20 hover:border-rose-400' 
                        : 'bg-slate-950/60 border-slate-700 border-dashed text-slate-500 hover:border-teal-500/60'
                    }`}
                  >
                    {tile ? tile.text : '?'}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Scrambled Tile Bank */}
          <div className="w-full max-w-lg shrink-0">
            <p className="text-xs font-bold text-slate-300 mb-1.5 px-1">دستیاب ٹکڑے (کلک کر کے اوپر خانوں میں بھریں):</p>
            <div className="flex flex-wrap justify-center gap-2.5 min-h-[70px] p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
              {scrambledTiles.map((tile) => {
                const isUsed = selectedSlots.includes(tile.id);
                if (isUsed) return null;
                return (
                  <motion.button
                    key={tile.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTileClick(tile)}
                    className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-teal-600 hover:to-emerald-600 text-white font-arabic font-bold text-2xl rounded-xl shadow-lg border border-slate-700 hover:border-teal-400 cursor-pointer transition-all"
                  >
                    {tile.text}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Celebration or Error Feedback Banners */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-emerald-400"
              >
                <Award className="w-6 h-6 text-yellow-300 shrink-0" />
                <span>ماشاء اللہ! بالکل درست! اگلے سوال پر منتقل ہو رہے ہیں... 🎉</span>
              </motion.div>
            )}

            {showError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="bg-rose-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-rose-400"
              >
                <XCircle className="w-6 h-6 text-white shrink-0" />
                <span>معذرت! ترتیب درست نہیں ہے۔ ٹکڑے پر کلک کر کے واپس کریں۔ ❌</span>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
