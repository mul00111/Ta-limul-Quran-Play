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
  Filter,
  Play
} from 'lucide-react';
import { tafkheemTarqeeqWords, TafkheemTarqeeqWord } from '../data/tafkheemTarqeeqData';
import { playQariText, playChimeEffect, playWordWithHijjaAndPronunciation, stopAllQariAudio } from '../utils/qariAudioService';
import { motion, AnimatePresence } from 'motion/react';

interface TafkheemTarqeeqPuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TafkheemTarqeeqPuzzleGameModal({ isOpen, onClose }: TafkheemTarqeeqPuzzleModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredWords, setFilteredWords] = useState<TafkheemTarqeeqWord[]>(tafkheemTarqeeqWords);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  const [scrambledTiles, setScrambledTiles] = useState<{ id: string; text: string; originalIndex: number }[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<(string | null)[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [score, setScore] = useState<number>(() => Number(localStorage.getItem('tt_puzzle_score') || '180'));
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('tt_puzzle_coins') || '90'));
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('tt_puzzle_streak') || '4'));
  const [showCelebration, setShowCelebration] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredWords(tafkheemTarqeeqWords);
    } else {
      setFilteredWords(tafkheemTarqeeqWords.filter(w => w.letterType === selectedCategory || w.ruleType === selectedCategory));
    }
    setCurrentWordIndex(0);
  }, [selectedCategory]);

  const currentWord: TafkheemTarqeeqWord = filteredWords[currentWordIndex % filteredWords.length] || tafkheemTarqeeqWords[0];

  const preparePuzzle = (word: TafkheemTarqeeqWord) => {
    // Break into parts (words or chunks)
    let chunks = word.arabic.split(' ').filter(Boolean);
    if (chunks.length <= 1) {
      // split into 2-3 logical phonetic syllable chunks for single words
      const text = word.arabic;
      if (text.length >= 6) {
        const mid = Math.floor(text.length / 2);
        chunks = [text.slice(0, mid), text.slice(mid)];
      } else {
        chunks = [text];
      }
    }
    
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

  const checkCompletion = (slots: (string | null)[]) => {
    const isCorrect = slots.every((tileId, idx) => {
      const tile = scrambledTiles.find(t => t.id === tileId);
      return tile && tile.originalIndex === idx;
    });

    if (isCorrect) {
      setIsCompleted(true);
      setShowCelebration(true);
      playChimeEffect('success');
      
      const newScore = score + 25;
      const newCoins = coins + 10;
      const newStreak = streak + 1;
      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);
      localStorage.setItem('tt_puzzle_score', String(newScore));
      localStorage.setItem('tt_puzzle_coins', String(newCoins));
      localStorage.setItem('tt_puzzle_streak', String(newStreak));

      setTimeout(() => {
        playQariText(currentWord.arabic);
      }, 500);
    } else {
      setShowError(true);
      playChimeEffect('error');
      setStreak(0);
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
    }
  };

  const handleHint = () => {
    if (coins >= 5 && !isCompleted) {
      setCoins(c => c - 5);
      // Auto place first wrong slot
      const firstEmptyOrWrong = selectedSlots.findIndex((tileId, idx) => {
        if (!tileId) return true;
        const tile = scrambledTiles.find(t => t.id === tileId);
        return tile?.originalIndex !== idx;
      });

      if (firstEmptyOrWrong !== -1) {
        const correctTile = scrambledTiles.find(t => t.originalIndex === firstEmptyOrWrong);
        if (correctTile) {
          const newSlots = [...selectedSlots];
          newSlots[firstEmptyOrWrong] = correctTile.id;
          setSelectedSlots(newSlots);
          playChimeEffect('success');
          if (!newSlots.includes(null)) {
            checkCompletion(newSlots);
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm font-urdu" dir="rtl">
      <div className="bg-[#fcfaf5] border-4 border-amber-500 rounded-3xl p-5 sm:p-7 max-w-3xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                stopAllQariAudio();
                onClose();
              }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
            <div className="flex items-center gap-2">
              <Puzzle className="w-6 h-6 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-black text-amber-950 font-urdu">
                مقناطیسی تجوید پزل (سبق ۱۲: تَفْخِیْم وَ تَرْقِیْق)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-urdu font-black">
            <div className="bg-amber-100 border border-amber-300 px-3 py-1 rounded-xl text-amber-900 flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{score}</span>
            </div>
            <div className="bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-xl text-yellow-900 flex items-center gap-1">
              <span>🪙 {coins}</span>
            </div>
            <div className="bg-orange-100 border border-orange-300 px-3 py-1 rounded-xl text-orange-900 flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        {/* Filter Category */}
        <div className="flex flex-wrap justify-center gap-2 bg-zinc-900 p-2 rounded-2xl">
          {[
            { id: 'all', label: 'تمام کلمات' },
            { id: 'alif', label: 'الف کے کلمات' },
            { id: 'laam', label: 'لام کے کلمات' },
            { id: 'raa', label: 'را کے کلمات' },
            { id: 'tafkheem', label: 'پُر (موٹا) والے' },
            { id: 'tarqeeq', label: 'باریک والے' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-urdu font-black transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-zinc-950 shadow-md'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Word Info Banner */}
        <div className="bg-white border-2 border-amber-300 rounded-2xl p-4 text-center space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-urdu">
            <span className="bg-amber-100 text-amber-900 font-bold px-3 py-0.5 rounded-full">
              پزل #{currentWordIndex + 1} از {filteredWords.length}
            </span>
            <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
              {currentWord.ruleUrdu}
            </span>
          </div>

          <div className="text-emerald-700 font-urdu font-black text-sm">
            ترجمہ: {currentWord.urduTranslation}
          </div>
        </div>

        {/* Puzzle Target Slots Container */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/60 border-2 border-dashed border-amber-400 rounded-3xl p-6 text-center space-y-4 shadow-inner">
          <div className="text-xs font-urdu text-zinc-600">
            نیچے دیے گئے مقناطیسی ٹکڑوں پر کلک کر کے کلمے کو ترتیب دیں:
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 min-h-[90px]">
            {selectedSlots.map((tileId, idx) => {
              const tile = scrambledTiles.find(t => t.id === tileId);
              return (
                <button
                  key={idx}
                  onClick={() => handleSlotClick(idx)}
                  className={`min-w-[80px] sm:min-w-[110px] h-20 rounded-2xl border-2 flex items-center justify-center p-3 text-3xl sm:text-4xl font-arabic transition-all shadow-md cursor-pointer ${
                    tile
                      ? isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200'
                        : 'bg-white text-zinc-900 border-amber-500 shadow-amber-200'
                      : 'bg-amber-100/50 border-amber-300 text-amber-400 border-dashed'
                  }`}
                >
                  {tile ? tile.text : `${idx + 1}`}
                </button>
              );
            })}
          </div>

          {/* Success / Error Message */}
          {showCelebration && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-100 border-2 border-emerald-500 text-emerald-950 p-4 rounded-2xl font-urdu font-black space-y-2 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>ماشاءاللہ! پزل بالکل درست مکمل ہو گیا! +25 XP</span>
              </div>
              <p className="text-xs text-zinc-700 font-normal">
                {currentWord.explanation}
              </p>
            </motion.div>
          )}

          {showError && (
            <div className="bg-rose-100 border-2 border-rose-400 text-rose-900 p-3 rounded-2xl font-urdu font-black text-sm flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>ترتیب درست نہیں، ٹکڑے پر کلک کر کے درست مقام پر لائیں!</span>
            </div>
          )}
        </div>

        {/* Bank of Available Scrambled Tiles */}
        <div className="bg-white border-2 border-zinc-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="text-xs font-urdu font-black text-zinc-700 flex items-center justify-between">
            <span>دستیاب مقناطیسی ٹکڑے:</span>
            <button
              onClick={handleHint}
              disabled={coins < 5 || isCompleted}
              className="px-3 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-urdu font-black flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>اشارہ / مدد (5 🪙)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {scrambledTiles.map((tile) => {
              const isUsed = selectedSlots.includes(tile.id);
              return (
                <button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  disabled={isUsed || isCompleted}
                  className={`min-w-[80px] sm:min-w-[100px] h-16 rounded-2xl border-2 flex items-center justify-center p-3 text-2xl sm:text-3xl font-arabic transition-all shadow-md cursor-pointer ${
                    isUsed
                      ? 'bg-zinc-100 text-zinc-300 border-zinc-200 opacity-40 cursor-not-allowed'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-400 hover:scale-105 active:scale-95'
                  }`}
                >
                  {tile.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrevWord}
            disabled={currentWordIndex === 0}
            className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-urdu font-black text-xs flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>پچھلا لفظ</span>
          </button>

          <button
            onClick={() => preparePuzzle(currentWord)}
            className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-urdu font-black text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>دوبارہ حل کریں</span>
          </button>

          <button
            onClick={handleNextWord}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-urdu font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>اگلا لفظ</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
