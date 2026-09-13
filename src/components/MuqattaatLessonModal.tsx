import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BookOpen,
  Gamepad2,
  HelpCircle,
  CheckCircle2,
  Info,
  X,
  Repeat,
  Compass,
  Flame,
  Volume1,
  ArrowRight,
} from 'lucide-react';
import {
  MUQATTAAT_WORDS,
  MUQATTAAT_SUMMARY_RULES,
  MuqattaatWordItem,
} from '../data/muqattaatData';
import {
  playQariText,
  playWordWithHijjaAndPronunciation,
  stopAllQariAudio,
} from '../utils/qariAudioService';
import { motion, AnimatePresence } from 'motion/react';
import { MuqattaatGameModal } from './MuqattaatGameModal';

interface MuqattaatLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
  onOpenPuzzleModal?: () => void;
}

export function MuqattaatLessonModal({
  onBack,
  onOpenGamesHub,
  onOpenPuzzleModal,
}: MuqattaatLessonModalProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<MuqattaatWordItem | null>(null);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);
  const [showRulesInfoModal, setShowRulesInfoModal] = useState<boolean>(false);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);

  const filteredWords = MUQATTAAT_WORDS.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'single' && item.letterCount === 1) return true;
    if (activeFilter === 'two' && item.letterCount === 2) return true;
    if (activeFilter === 'three' && item.letterCount === 3) return true;
    if (activeFilter === 'four_plus' && item.letterCount >= 4) return true;
    if (activeFilter === 'ghunnah' && item.hasGhunnahOrIdgham) return true;
    return true;
  });

  const handlePlayWord = (item: MuqattaatWordItem) => {
    if (isMuted) return;
    setPlayingId(item.id);
    setSelectedWord(item);

    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(item.spellingHijja, item.rawaniPronunciation);
      setTimeout(() => setPlayingId(null), 3500);
    } else {
      playQariText(item.arabic, () => setPlayingId(null));
    }
  };

  const playSequence = async () => {
    if (!filteredWords.length) return;

    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setPlayingId(null);
      return;
    }

    setIsPlayingSequence(true);

    for (let i = 0; i < filteredWords.length; i++) {
      const item = filteredWords[i];
      setPlayingId(item.id);
      setSelectedWord(item);

      if (pronunciationMode === 'hijja') {
        playWordWithHijjaAndPronunciation(item.spellingHijja, item.rawaniPronunciation);
        await new Promise((res) => setTimeout(res, 4000));
      } else {
        playQariText(item.arabic);
        await new Promise((res) => setTimeout(res, 2600));
      }
    }

    setIsPlayingSequence(false);
    setPlayingId(null);
  };

  return (
    <div className="bg-[#fcfaf5] border-4 border-emerald-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 font-urdu" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-5 sm:px-6 py-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white font-black text-base sm:text-xl shadow-lg border-2 border-emerald-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>سبق ۱۴: حُرُوفِ مُقَطَّعَات</span>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-bold">
            قرآنی متشابہات، مدات و غنہ کے احکام
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white border-2 border-rose-400/80 transition-all shadow-md flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95"
            title="مین بورڈ پر واپسی"
          >
            <ArrowRight className="w-4 h-4" />
            <span>واپسی</span>
          </button>

          {/* Rules Modal Button */}
          <button
            onClick={() => setShowRulesInfoModal(true)}
            className="px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm bg-emerald-50 text-emerald-900 border-2 border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            قواعد و احکام
          </button>

          {/* Mute Button */}
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted) stopAllQariAudio();
            }}
            className={`p-2.5 rounded-2xl border-2 transition-all shadow-sm cursor-pointer ${
              isMuted
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
            title={isMuted ? 'آواز بند ہے' : 'آواز چالو ہے'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Pronunciation Toggle */}
          <div className="bg-slate-900/90 rounded-2xl p-1 border border-emerald-500/40 flex items-center shadow-inner">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ہجے
            </button>
          </div>

          {/* Sequence Autoplay Button */}
          <button
            onClick={playSequence}
            className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 border-2 cursor-pointer ${
              isPlayingSequence
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-emerald-400 hover:from-teal-600 hover:to-emerald-700'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSequence ? 'تلاوت روکیں' : 'مسلسل سنیں'}</span>
          </button>

          {/* Games Hub Button */}
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 border-2 border-amber-300 hover:from-amber-400 hover:to-yellow-400 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer transform hover:scale-105"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>مشقی گیمز 🎮</span>
          </button>
        </div>
      </div>

      {/* Official Madani Qaidah Rule Banner matching Image */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border-2 border-emerald-400/50 rounded-2xl p-4 sm:p-5 text-white shadow-xl space-y-3">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-amber-300 font-black text-sm sm:text-base">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>قاعدہ: حُرُوفِ مُقَطَّعَات کی ادائیگی کے احکام</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-300/90 font-bold bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-500/30">
            <span>سَنَقُصُّ عِلْمَکَ = ۳ الف</span>
            <span>•</span>
            <span>حَیٌّ طَهُرَ = ۱ الف</span>
          </div>
        </div>

        <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed font-arabic">
          حروفِ مقطعات قرآن پاک کی بعض سورتوں کے شروع میں آتے ہیں۔ ان حروف کو مفرد حروف کی طرح الگ الگ اس طرح پڑھیں کہ مدات کی مقدار پوری ادا ہو نیز اخفاء و ادغام آنے کی صورت میں غنہ بھی کریں۔
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `تمام حروف (${MUQATTAAT_WORDS.length})` },
          { id: 'single', label: '۱ حرف والے (ص، ق، ن)' },
          { id: 'two', label: '۲ حروف والے (طٰہٰ، یٰسٓ، طٰسٓ، حٰمٓ)' },
          { id: 'three', label: '۳ حروف والے (الٓرٰ، الٓمٓ، عٓسٓقٓ، طٰسٓمٓ)' },
          { id: 'four_plus', label: '۴ و ۵ حروف والے (کٓہٰیٰعٓصٓ، الٓمٰرٰ، الٓمٓصٓ)' },
          { id: 'ghunnah', label: '🎶 غنہ و ادغام والے' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
              activeFilter === tab.id
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                : 'bg-white text-emerald-900 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Muqattaat 16-Card Grid (Matching standard Madani Qaidah page) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4.5">
        {filteredWords.map((item) => {
          const isPlaying = playingId === item.id;
          const isSelected = selectedWord?.id === item.id;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlayWord(item)}
              className={`relative rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between border-2 transition-all cursor-pointer select-none min-h-[145px] sm:min-h-[170px] ${
                isPlaying
                  ? 'bg-gradient-to-b from-amber-100 to-amber-200 border-amber-500 shadow-xl ring-4 ring-amber-300'
                  : isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-emerald-50/50 border-emerald-200/90 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Surah or Rule Tag Badge */}
              <div className="w-full flex items-center justify-between gap-1 text-[10px] sm:text-xs">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold truncate max-w-[110px]">
                  {item.surahsNamesUrdu[0].split('(')[0]}
                </span>
                {item.hasGhunnahOrIdgham && (
                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded font-bold flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                    غنہ
                  </span>
                )}
              </div>

              {/* Central Big Calligraphy Display */}
              <div className="my-auto py-2 text-center">
                <div
                  className={`text-3xl sm:text-4xl md:text-5xl font-arabic font-bold transition-transform ${
                    isPlaying ? 'scale-110 text-emerald-800' : 'text-slate-900'
                  }`}
                  style={{
                    letterSpacing: item.letterCount > 3 ? '0.05em' : '0.15em',
                  }}
                >
                  {item.arabic}
                </div>

                {/* Rawani Pronunciation Sub-label */}
                <div className="mt-1.5 text-emerald-700 font-arabic font-bold text-sm sm:text-base tracking-wide">
                  {item.rawaniPronunciation}
                </div>
              </div>

              {/* Bottom Info Bar: Letter parts summary */}
              <div className="w-full pt-1.5 border-t border-emerald-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="text-emerald-800 font-bold">{item.letterCount} حروف</span>
                <span className="text-[10px] text-slate-600 truncate max-w-[120px]">
                  {item.tajweedRuleTitle.split('+')[0]}
                </span>
              </div>

              {/* Audio Play Overlay Icon on hover/play */}
              <div
                className={`absolute top-2 left-2 p-1 rounded-full transition-opacity ${
                  isPlaying ? 'bg-amber-500 text-white opacity-100' : 'bg-emerald-100 text-emerald-700 opacity-0 group-hover:opacity-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Word Detail Card Drawer */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-emerald-400 text-white shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl sm:text-5xl font-arabic font-bold text-amber-300">
                  {selectedWord.arabic}
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold font-arabic text-emerald-200">
                    {selectedWord.rawaniPronunciation}
                  </div>
                  <div className="text-xs text-slate-300">
                    {selectedWord.surahsNamesUrdu.join(' ، ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayWord(selectedWord)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 rounded-xl font-bold text-sm flex items-center gap-1.5 shadow-md cursor-pointer hover:from-amber-300 hover:to-yellow-400"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>دوبارہ سنیں</span>
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letter-by-Letter Breakdown Cards */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>حرف بہ حرف تجوید و مد کی مقدار کی تفصیل:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {selectedWord.parts.map((part, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-emerald-600/40 rounded-xl p-3 flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-arabic font-bold text-amber-300">
                        {part.letter}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-600/30">
                        {part.pronunciation}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-emerald-300">
                      {part.ruleLabelUrdu}
                    </div>

                    <div className="text-[11px] text-amber-200/90 font-medium">
                      مقدار: {part.duration}
                    </div>

                    {part.notes && (
                      <div className="text-[10px] text-slate-300/80 leading-tight">
                        {part.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Urdu Spelling & Tajweed Detail */}
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3.5 text-xs sm:text-sm space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-400" />
                <span>طریقہ ہجے و اصول:</span>
              </div>
              <p className="text-slate-200 font-arabic leading-relaxed">
                {selectedWord.spellingHijja}
              </p>
              <p className="text-emerald-200/90 text-xs font-arabic">
                {selectedWord.tajweedDetailsUrdu}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Info Modal */}
      <AnimatePresence>
        {showRulesInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-5 sm:p-7 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 text-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-700/50 border border-emerald-400 text-amber-300">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      قواعد و احکام: حُرُوفِ مُقَطَّعَات
                    </h3>
                    <p className="text-xs text-emerald-300">
                      مدنی قاعدہ سبق ۱۴ کے مستند تجویدی اصول
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRulesInfoModal(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5">
                {MUQATTAAT_SUMMARY_RULES.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/80 border border-emerald-700/40 rounded-2xl p-3.5 sm:p-4 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                      <span>{rule.icon}</span>
                      <span>{rule.title}</span>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm font-arabic leading-relaxed">
                      {rule.text}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRulesInfoModal(false)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg"
              >
                سمجھ گیا / واپس جائیں
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Muqattaat Game Modal */}
      <AnimatePresence>
        {showGameModal && (
          <MuqattaatGameModal
            onClose={() => setShowGameModal(false)}
            onComplete={() => setShowGameModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
