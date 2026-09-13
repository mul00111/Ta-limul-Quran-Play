import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  HelpCircle,
  Award,
  BookOpen,
  Flame,
  Gamepad2,
  Info,
  Puzzle,
  Eye,
  Zap,
  BookMarked,
  RotateCcw,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  tafkheemTarqeeqWords,
  tafkheemTarqeeqRules,
  TafkheemTarqeeqWord,
} from '../data/tafkheemTarqeeqData';
import {
  playQariText,
  playWordWithHijjaAndPronunciation,
  stopAllQariAudio,
} from '../utils/qariAudioService';
import { TafkheemTarqeeqGameModal } from './TafkheemTarqeeqGameModal';
import { TafkheemTarqeeqPuzzleGameModal } from './TafkheemTarqeeqPuzzleGameModal';

interface TafkheemTarqeeqLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
}

export const TafkheemTarqeeqLessonModal: React.FC<TafkheemTarqeeqLessonModalProps> = ({
  onBack,
  onOpenGamesHub,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'alif' | 'laam' | 'raa_pur' | 'raa_bareek' | 'special_rules' | 'exam'
  >('all');
  const [activeItem, setActiveItem] = useState<TafkheemTarqeeqWord | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [showDetailedRulesModal, setShowDetailedRulesModal] = useState(false);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const getFilteredItems = () => {
    switch (activeFilter) {
      case 'alif':
        return tafkheemTarqeeqWords.filter((w) => w.letterType === 'alif');
      case 'laam':
        return tafkheemTarqeeqWords.filter((w) => w.letterType === 'laam');
      case 'raa_pur':
        return tafkheemTarqeeqWords.filter(
          (w) =>
            w.letterType === 'raa' &&
            (w.ruleType === 'tafkheem' || w.category === 'raa_pur_harakat')
        );
      case 'raa_bareek':
        return tafkheemTarqeeqWords.filter(
          (w) => w.letterType === 'raa' && w.ruleType === 'tarqeeq'
        );
      case 'special_rules':
        return tafkheemTarqeeqWords.filter(
          (w) =>
            w.category === 'raa_pur_aarizi_zer' ||
            w.category === 'raa_pur_mutaalliya' ||
            w.ruleType === 'jawaz'
        );
      case 'exam':
        return [
          ...tafkheemTarqeeqWords.slice(0, 6),
          ...tafkheemTarqeeqWords.slice(12, 18),
          ...tafkheemTarqeeqWords.slice(24, 30),
          ...tafkheemTarqeeqWords.slice(36, 42),
          ...tafkheemTarqeeqWords.slice(47, 53),
          ...tafkheemTarqeeqWords.slice(59, 65),
        ];
      default:
        return tafkheemTarqeeqWords;
    }
  };

  const currentWords = getFilteredItems();

  const handlePlayWord = (word: TafkheemTarqeeqWord) => {
    if (isMuted) return;
    setPlayingId(word.id);
    setActiveItem(word);

    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(word.spellingHijja, word.arabic);
      setTimeout(() => setPlayingId(null), 2500);
    } else {
      playQariText(word.arabic, () => setPlayingId(null));
    }
  };

  const playTabSequence = async () => {
    const items = getFilteredItems();
    if (!items.length) return;

    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setPlayingId(null);
      return;
    }

    setIsPlayingSequence(true);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      setPlayingId(item.id);
      setActiveItem(item);

      if (pronunciationMode === 'hijja') {
        playWordWithHijjaAndPronunciation(item.spellingHijja, item.arabic);
        await new Promise((resolve) => setTimeout(resolve, 2600));
      } else {
        await new Promise<void>((resolve) => {
          playQariText(item.arabic, () => resolve());
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    setIsPlayingSequence(false);
    setPlayingId(null);
  };

  const getRuleBadgeClass = (word: TafkheemTarqeeqWord) => {
    if (word.ruleType === 'jawaz') {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (word.ruleType === 'tafkheem') {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
  };

  // Colored letter visual formatting for authentic Madani Qaidah appearance
  const renderStyledArabic = (word: TafkheemTarqeeqWord) => {
    // Return formatted word highlighting key letters
    return (
      <span className="text-3xl sm:text-4xl md:text-5xl font-arabic tracking-wide leading-relaxed">
        {word.arabic}
      </span>
    );
  };

  return (
    <div className="bg-[#fcfaf5] border-4 border-emerald-600/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 font-urdu" dir="rtl">
      
      {/* Top Banner & Control Center */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-900 p-4 sm:p-5 rounded-2xl text-white shadow-xl border border-emerald-600">
        
        {/* Title Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black text-xl shadow-lg border-2 border-yellow-200">
            ۱۲
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-amber-300 font-urdu flex items-center gap-2">
              <span>سبق نمبر (۱۲) : تَفْخِیْم وَ تَرْقِیْق</span>
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 font-urdu mt-0.5">
              حروف کو پُر (موٹا) اور باریک پڑھنے کے جامع و مستند قواعد
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 justify-center">
          
          {/* Mute Button */}
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted) stopAllQariAudio();
            }}
            className={`p-2.5 rounded-xl border-2 transition-all shadow-sm cursor-pointer ${
              isMuted
                ? 'bg-rose-600/90 text-white border-rose-400'
                : 'bg-zinc-800/80 text-emerald-300 border-emerald-500 hover:bg-zinc-700'
            }`}
            title={isMuted ? 'آواز بند ہے' : 'آواز چالو ہے'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Rawani / Hijja Mode Switch */}
          <div className="bg-zinc-950/80 rounded-xl p-1 border border-amber-400/40 flex items-center shadow-inner">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3.5 py-1 rounded-lg font-urdu text-xs sm:text-sm transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3.5 py-1 rounded-lg font-urdu text-xs sm:text-sm transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-black shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              ہجے
            </button>
          </div>

          {/* Sequence Auto Play Button */}
          <button
            onClick={playTabSequence}
            className={`px-3.5 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 border cursor-pointer ${
              isPlayingSequence
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white border-teal-400'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSequence ? 'روکیں' : 'مسلسل سنیں'}</span>
          </button>

          {/* Rules Summary Modal Button */}
          <button
            onClick={() => setShowDetailedRulesModal(true)}
            className="px-3.5 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <BookMarked className="w-4 h-4 text-amber-300" />
            <span>تفصیلی قواعد</span>
          </button>

          {/* Magnetic Puzzle Button */}
          <button
            onClick={() => setShowPuzzleModal(true)}
            className="px-3.5 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md flex items-center gap-1.5 border-2 border-yellow-200 cursor-pointer"
          >
            <Puzzle className="w-4 h-4" />
            <span>مقناطیسی پزل 🧩</span>
          </button>

          {/* Games Hub Button */}
          <button
            onClick={() => setShowGameModal(true)}
            className="px-3.5 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-zinc-950 transition-all shadow-md flex items-center gap-1.5 border-2 border-emerald-300 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>صوتی و بصری گیمز 🎯</span>
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>واپسی</span>
          </button>
        </div>
      </div>

      {/* Main Rules Summary Banner directly on screen (Madani Qaidah Exact Text) */}
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-inner space-y-3 text-zinc-900 font-urdu leading-relaxed">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full shadow">
              خلاصۂ سبق
            </span>
            <span className="font-bold text-amber-950 text-sm sm:text-base">
              تَفْخِیْم کے معنی حرف کو <strong className="text-rose-700">پُر یعنی موٹا</strong> پڑھنا اور تَرْقِیْق کے معنی حرف کو <strong className="text-emerald-700">باریک</strong> پڑھنا ہے۔
            </span>
          </div>
          <span className="text-xs bg-amber-200/80 px-2.5 py-1 rounded-lg text-amber-900 font-bold">
            تین حروف: اَلِفْ ، لَامْ ، رَا
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm pt-1">
          {/* Rule 1: Alif */}
          <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-sm space-y-1">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-sm border-b border-amber-100 pb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">۱</span>
              <span>اَلِفْ کا قاعدہ:</span>
            </h4>
            <p className="text-zinc-700">
              الف سے پہلے اگر <strong>پُر حرف</strong> (حروفِ مستعلیہ یا را پُر) آئے تو الف کو پُر پڑھیں (جیسے: <strong>قَاْلَ، صِرَاطَ</strong>)، اور باریک حرف آئے تو الف کو باریک پڑھیں (جیسے: <strong>كَانَ، مَالًا</strong>)۔
            </p>
          </div>

          {/* Rule 2: Laam */}
          <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm space-y-1">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm border-b border-emerald-100 pb-1">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۲</span>
              <span>لَامْ (اسمِ جلالت و عام) کا قاعدہ:</span>
            </h4>
            <p className="text-zinc-700">
              اسم جلالت <strong>"اللہ"</strong> کے لام سے پہلے <strong>زبر یا پیش</strong> ہو تو لام کو پُر پڑھیں (جیسے: <strong>وَاللهُ، رَسُوْلُ اللهِ</strong>)، اور <strong>زیر</strong> ہو تو باریک پڑھیں (جیسے: <strong>بِسْمِ اللهِ، لِلّٰهِ</strong>)۔ باقی تمام عام لام ہمیشہ باریک پڑھے جاتے ہیں۔
            </p>
          </div>

          {/* Rule 3: Raa */}
          <div className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm space-y-1">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-sm border-b border-blue-100 pb-1">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">۳</span>
              <span>رَا کا قاعدہ:</span>
            </h4>
            <p className="text-zinc-700">
              را پر زبر/پیش، کھڑا زبر یا را ساکن ماقبل زبر/پیش یا عارضی زیر ہو تو <strong>پُر</strong> (جیسے: <strong>رَجُلٌ، تُرْجَعُوْنَ، اِرْجِعِیْ</strong>)۔ را کے نیچے زیر ہو یا را ساکن ماقبل زیر اصلی ہو تو <strong>باریک</strong> (جیسے: <strong>رِجَالٌ، فَاصْبِرْ</strong>)۔
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-zinc-900/90 p-2.5 rounded-2xl shadow-md border border-amber-500/30">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-lg scale-105'
              : 'text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          تمام کلمات ({tafkheemTarqeeqWords.length})
        </button>

        <button
          onClick={() => setActiveFilter('alif')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'alif'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 shadow-lg scale-105'
              : 'text-amber-300 hover:bg-zinc-800'
          }`}
        >
          الف پُر و باریک
        </button>

        <button
          onClick={() => setActiveFilter('laam')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'laam'
              ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-zinc-950 shadow-lg scale-105'
              : 'text-emerald-300 hover:bg-zinc-800'
          }`}
        >
          لامِ جلالت و عام
        </button>

        <button
          onClick={() => setActiveFilter('raa_pur')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'raa_pur'
              ? 'bg-gradient-to-r from-rose-400 to-red-500 text-zinc-950 shadow-lg scale-105'
              : 'text-rose-300 hover:bg-zinc-800'
          }`}
        >
          را پُر (موٹا)
        </button>

        <button
          onClick={() => setActiveFilter('raa_bareek')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'raa_bareek'
              ? 'bg-gradient-to-r from-teal-400 to-cyan-500 text-zinc-950 shadow-lg scale-105'
              : 'text-cyan-300 hover:bg-zinc-800'
          }`}
        >
          را باریک
        </button>

        <button
          onClick={() => setActiveFilter('special_rules')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'special_rules'
              ? 'bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-lg scale-105'
              : 'text-purple-300 hover:bg-zinc-800'
          }`}
        >
          خاص قواعد (عارضی زیر / مستعلیہ)
        </button>

        <button
          onClick={() => setActiveFilter('exam')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl font-urdu font-black text-xs sm:text-sm transition-all cursor-pointer ${
            activeFilter === 'exam'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 shadow-lg scale-105'
              : 'text-yellow-300 hover:bg-zinc-800'
          }`}
        >
          امتحان و ٹیسٹ بورڈ 📝
        </button>
      </div>

      {/* Main Content Layout (Cards Grid + Interactive Detail Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Words Grid Container */}
        <div className="flex-1 bg-white border-2 border-emerald-600/50 rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between mb-4 border-b border-emerald-100 pb-2">
            <span className="font-urdu font-black text-sm text-emerald-900">
              کل کلمات: {currentWords.length} (کسی بھی خانے پر کلک کر کے تلفظ اور ہجے سنیں)
            </span>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-urdu px-3 py-1 rounded-full border border-emerald-200">
              {pronunciationMode === 'rawani' ? 'طریقہ: روانی' : 'طریقہ: ہجے مع روانی'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {currentWords.map((word, index) => {
              const isSelected = activeItem?.id === word.id;
              const isCurrentlyPlaying = playingId === word.id;

              return (
                <motion.div
                  key={word.id}
                  layout
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePlayWord(word)}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center gap-2 shadow-sm ${
                    isCurrentlyPlaying
                      ? 'border-amber-500 bg-amber-50/90 ring-4 ring-amber-300 shadow-xl scale-105'
                      : isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-400'
                      : 'border-emerald-200 bg-[#fdfcf9] hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  {/* Serial Number */}
                  <span className="absolute top-2 right-2.5 text-[10px] font-bold text-zinc-400">
                    {index + 1}
                  </span>

                  {/* Rule Category Chip */}
                  <span
                    className={`text-[10px] sm:text-xs font-urdu px-2 py-0.5 rounded-full border shadow-2xs mt-1 max-w-[90%] truncate ${getRuleBadgeClass(
                      word
                    )}`}
                    title={word.ruleUrdu}
                  >
                    {word.ruleType === 'tafkheem' ? 'پُر (موٹا)' : word.ruleType === 'tarqeeq' ? 'باریک' : 'دونوں جائز'}
                  </span>

                  {/* Arabic Text Display */}
                  <div className="py-2 flex items-center justify-center min-h-[64px]">
                    {renderStyledArabic(word)}
                  </div>

                  {/* Audio Playing Indicator */}
                  {isCurrentlyPlaying && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-200/90 px-2 py-0.5 rounded-md animate-pulse">
                      <Volume2 className="w-3 h-3" />
                      <span>پڑھا جا رہا ہے</span>
                    </div>
                  )}

                  {/* Bottom Rule Short Label */}
                  <span className="text-[11px] text-zinc-600 font-urdu border-t border-zinc-200/60 pt-1 w-full truncate">
                    {word.ruleUrdu}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Selected Word Tajweed Breakdown Sidebar */}
        <div className="w-full lg:w-80 bg-gradient-to-b from-white to-emerald-50/50 border-2 border-emerald-500/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4">
          {activeItem ? (
            <div className="space-y-4 font-urdu">
              
              <div className="text-center border-b border-emerald-200 pb-3">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border mb-2 ${getRuleBadgeClass(activeItem)}`}>
                  {activeItem.ruleUrdu}
                </span>
                
                <div className="bg-white border-2 border-emerald-300 rounded-2xl p-4 shadow-inner mb-2">
                  <div className="text-4xl sm:text-5xl font-arabic text-zinc-900 leading-loose">
                    {activeItem.arabic}
                  </div>
                  <div className="text-emerald-700 font-black text-sm sm:text-base mt-2">
                    ترجمہ: {activeItem.urduTranslation}
                  </div>
                </div>

                <button
                  onClick={() => handlePlayWord(activeItem)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 text-amber-300" />
                  <span>دوبارہ سنیں ({pronunciationMode === 'rawani' ? 'روانی' : 'ہجے'})</span>
                </button>
              </div>

              {/* Tajweed Explanation */}
              <div className="space-y-2 text-right">
                <h4 className="font-black text-zinc-800 text-sm flex items-center justify-end gap-1.5 text-emerald-800">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>تجویدی وجہ و وضاحت:</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-700 bg-white p-3 rounded-xl border border-emerald-200 leading-relaxed shadow-2xs">
                  {activeItem.explanation}
                </p>
              </div>

              {/* Hijja Breakdown */}
              <div className="space-y-2 text-right">
                <h4 className="font-black text-zinc-800 text-sm flex items-center justify-end gap-1.5 text-amber-800">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>طریقۂ ہجے (Spelling):</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-800 bg-amber-50/90 p-3 rounded-xl border border-amber-200 leading-relaxed font-bold shadow-2xs">
                  {activeItem.spellingHijja}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-zinc-400">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Eye className="w-8 h-8 opacity-70" />
              </div>
              <h3 className="font-urdu font-black text-base text-zinc-700">
                تجویدی تجزیہ دیکھنے کے لیے
              </h3>
              <p className="font-urdu text-xs text-zinc-500 leading-relaxed">
                بائیں جانب کسی بھی کلمے پر کلک کریں تاکہ اس کا قاعدہ، ہجے، تلفظ اور تجویدی وجہ تفصیل سے سامنے آئے۔
              </p>
            </div>
          )}

          {/* Bottom Quick Help Card */}
          <div className="bg-emerald-900 text-emerald-100 p-3 rounded-xl text-center text-xs font-urdu space-y-1">
            <div className="font-black text-amber-300 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>سنہری اصول</span>
            </div>
            <p className="text-[11px] text-emerald-200">
              حروفِ مستعلیہ (خ، ص، ض، ط، ظ، غ، ق) ہمیشہ پُر پڑھے جاتے ہیں۔
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Rules Modal */}
      <AnimatePresence>
        {showDetailedRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#fcfaf5] border-4 border-emerald-600 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-urdu text-right"
            >
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-6 h-6 text-emerald-700" />
                  <h3 className="text-xl font-black text-emerald-900">
                    سبق نمبر ۱۲ : تَفْخِیْم وَ تَرْقِیْق کے تفصیلی احکام
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailedRulesModal(false)}
                  className="p-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-zinc-800 leading-relaxed">
                
                {/* 1. Alif */}
                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2">
                  <h4 className="font-black text-amber-900 text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">۱</span>
                    <span>اَلِفْ کے تفخیم و ترقیق کے اصول:</span>
                  </h4>
                  <p>
                    الف کی اپنی کوئی ذاتی آواز موٹی یا باریک نہیں ہوتی بلکہ یہ اپنے سے پہلے والے حرف کے تابع ہوتا ہے:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-700 pr-2">
                    <li>اگر الف سے پہلے <strong>پُر حرف</strong> (حروفِ مستعلیہ یا را پُر) ہو تو الف کو <strong>پُر (موٹا)</strong> پڑھیں گے جیسے: <strong className="text-emerald-800">قَاْلَ ، صِرَاطَ ، طَالِبٌ ، خَالِدًا ، غَاسِقٍ</strong>۔</li>
                    <li>اگر الف سے پہلے <strong>باریک حرف</strong> ہو تو الف کو <strong>باریک</strong> پڑھیں گے جیسے: <strong className="text-emerald-800">كَانَ ، مَالًا ، مَفَازًا ، تَابُوْا ، عَابِدٌ</strong>۔</li>
                  </ul>
                </div>

                {/* 2. Laam */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
                  <h4 className="font-black text-emerald-900 text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">۲</span>
                    <span>لَامْ کے تفخیم و ترقیق کے اصول:</span>
                  </h4>
                  <p>
                    قرآنِ مجید میں صرف اسمِ جلالت <strong>"اللہ"</strong> کے لام کے احکام جدا ہیں:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-zinc-700 pr-2">
                    <li>اسم جلالت کے لام سے پہلے <strong>زبر یا پیش</strong> ہو تو لام کو <strong>پُر</strong> پڑھیں گے جیسے: <strong className="text-emerald-800">اَللهُ ، وَاللهُ ، فَاللّٰهُ ، اِنَّ اللهَ ، هُوَ اللهُ ، رَسُوْلُ اللهِ</strong>۔</li>
                    <li>اسم جلالت کے لام سے پہلے <strong>زیر</strong> ہو تو لام کو <strong>باریک</strong> پڑھیں گے جیسے: <strong className="text-emerald-800">لِلّٰهِ ، بِاللهِ ، بِسْمِ اللهِ ، قُلِ اللّٰهُمَّ ، دِیْنِ اللهِ</strong>۔</li>
                    <li>اسمِ جلالت کے علاوہ قرآنِ مجید کے <strong>باقی تمام لام ہمیشہ باریک</strong> پڑھے جاتے ہیں جیسے: <strong className="text-emerald-800">مَالَهُمُ ، اِلَّا الَّذِیْنَ ، عَلٰی ، صَلٰوةَ</strong>۔</li>
                  </ul>
                </div>

                {/* 3. Raa */}
                <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-2">
                  <h4 className="font-black text-blue-900 text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">۳</span>
                    <span>رَا کے تفخیم (پُر) اور ترقیق (باریک) کے اصول:</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                      <strong className="text-amber-900 block mb-1">را کو پُر (موٹا) پڑھنے کی صورتیں:</strong>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-700">
                        <li>را پر زبر یا پیش ہو (رَجُلٌ، رُزِقُوْا)</li>
                        <li>را پر دو زبر یا دو پیش ہوں (اَجْرًا، اَجْرٌ)</li>
                        <li>را پر کھڑا زبر ہو (اِبْرٰهِیْمَ)</li>
                        <li>را ساکن سے پہلے زبر یا پیش ہو (عَرْشٌ، تُرْجَعُوْنَ)</li>
                        <li>را ساکن سے پہلے عارضی زیر ہو (اِرْجِعْ، اِرْجِعِیْ)</li>
                        <li>را ساکن سے پہلے زیر دوسرے کلمے میں ہو (رَبِّ ارْحَمْهُمَا)</li>
                        <li>را ساکن کے بعد حرفِ مستعلیہ اسی کلمے میں ہو (مِرْصَادًا، قِرْطَاسٍ)</li>
                      </ol>
                    </div>

                    <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-200">
                      <strong className="text-teal-900 block mb-1">را کو باریک پڑھنے کی صورتیں:</strong>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-700">
                        <li>را کے نیچے زیر یا دو زیر ہوں (رِجَالٌ، اَمْرٍ، وَالنَّهَارِ)</li>
                        <li>را ساکن سے پہلے زیرِ اصلی اسی کلمے میں ہو (فَاصْبِرْ، قُمْ فَاَنْذِرْ)</li>
                        <li>را ساکن سے پہلے یائے ساکنہ ہو (خَبِیْرٌ، نَذِیْرٌ)</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Important Notes & Exceptions */}
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-300 space-y-1">
                  <h5 className="font-black text-emerald-950">اہم نکتہ (عارضی حرکت اور استثناء):</h5>
                  <p className="text-zinc-700 text-xs">
                    قرآن مجید میں جو کلمات الف سے شروع ہوتے ہیں اور ان کے الف پر حرکت نہیں ہوتی ان پر لگائی جانے والی حرکت <strong>عارضی</strong> کہلاتی ہے (جیسے <strong>اِرْجِعِیْ</strong>)۔ اور کلمہ <strong>كُلُّ فِرْقٍ</strong> میں را ساکن کے بعد قاف مکسور ہونے کے سبب پُر اور باریک دونوں طرح پڑھنا جائز ہے۔
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setShowDetailedRulesModal(false)}
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md cursor-pointer"
                >
                  سمجھ آ گیا (بند کریں)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Game Modal */}
      {showGameModal && (
        <TafkheemTarqeeqGameModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          onBack={() => setShowGameModal(false)}
        />
      )}

      {/* Magnetic Puzzle Game Modal */}
      {showPuzzleModal && (
        <TafkheemTarqeeqPuzzleGameModal
          isOpen={showPuzzleModal}
          onClose={() => setShowPuzzleModal(false)}
        />
      )}

    </div>
  );
};
