import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  Info,
  ArrowRight,
  Gamepad2,
  Puzzle,
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react';
import {
  MADDAT_WORDS,
  MADDAT_RULES,
  MaddWord,
  MaddType,
} from '../data/maddatData';
import {
  playQariText,
  playWordWithHijjaAndPronunciation,
  stopAllQariAudio,
} from '../utils/qariAudioService';
import { motion, AnimatePresence } from 'motion/react';
import { MaddatGameModal } from './MaddatGameModal';

interface MaddatLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
  onOpenPuzzleModal?: () => void;
}

export function MaddatLessonModal({
  onBack,
  onOpenGamesHub,
  onOpenPuzzleModal,
}: MaddatLessonModalProps) {
  const [activeRule, setActiveRule] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<MaddWord | null>(null);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);
  const [showRulesInfoModal, setShowRulesInfoModal] = useState<boolean>(false);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);

  const filteredWords =
    activeRule === 'all'
      ? MADDAT_WORDS
      : MADDAT_WORDS.filter((w) => w.maddType === activeRule);

  const handlePlay = (word: MaddWord) => {
    if (isMuted) return;
    if (playingId === word.id) return;
    setPlayingId(word.id);
    setSelectedWord(word);

    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(word.spellingHijja, word.arabic);
      setTimeout(() => setPlayingId(null), 3000);
    } else {
      playQariText(word.arabic, () => setPlayingId(null));
    }
  };

  const playTabSequence = async () => {
    if (!filteredWords.length) return;

    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setPlayingId(null);
      return;
    }

    setIsPlayingSequence(true);

    for (let i = 0; i < filteredWords.length; i++) {
      const word = filteredWords[i];
      setPlayingId(word.id);
      setSelectedWord(word);

      if (pronunciationMode === 'hijja') {
        playWordWithHijjaAndPronunciation(word.spellingHijja, word.arabic);
        await new Promise((res) => setTimeout(res, 3500));
      } else {
        playQariText(word.arabic);
        await new Promise((res) => setTimeout(res, 2200));
      }
    }

    setIsPlayingSequence(false);
    setPlayingId(null);
  };

  const getMaddTypeBadge = (type: MaddType) => {
    switch (type) {
      case 'muttasil':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'munfasil':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'laazim':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'leen_laazim':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'aaridh':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'leen_aaridh':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-[#fcfaf5] border-4 border-purple-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 font-urdu" dir="rtl">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopAllQariAudio();
              onBack();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
          <div className="px-6 py-2 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-800 text-white font-black text-base sm:text-xl shadow-lg border-2 border-purple-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>سبق ۱۳: مَدَّات کے قواعد</span>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 bg-purple-100 text-purple-900 border border-purple-300 rounded-full text-xs font-bold">
            مد متصل، منفصل، لازم، عارض و لین
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Rules Info Modal Toggle */}
          <button
            onClick={() => setShowRulesInfoModal(true)}
            className="px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm bg-purple-50 text-purple-800 border-2 border-purple-200 hover:bg-purple-100 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-purple-700" />
            قواعد و تعریفات
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted) stopAllQariAudio();
            }}
            className={`p-2.5 rounded-2xl border-2 transition-all shadow-sm cursor-pointer ${
              isMuted
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
            }`}
            title={isMuted ? 'آواز بند ہے' : 'آواز چالو ہے'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Pronunciation Mode Toggle */}
          <div className="bg-slate-900/90 rounded-2xl p-1 border border-purple-500/40 flex items-center shadow-inner">
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

          {/* Sequence Player Button */}
          <button
            onClick={playTabSequence}
            className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-1.5 border-2 cursor-pointer ${
              isPlayingSequence
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white border-emerald-400 hover:from-teal-600 hover:to-emerald-700'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSequence ? 'تلاوت روکیں' : 'مسلسل سنیں'}</span>
          </button>

          {/* Games Button */}
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all shadow-md flex items-center gap-1.5 border-2 border-purple-400 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4 text-amber-300" />
            صوتی گیمز 🎯
          </button>

          {/* Back Button */}
          <button
            onClick={() => {
              stopAllQariAudio();
              onBack();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
        </div>
      </div>

      {/* Rules Summary Banner */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-950 p-4 sm:p-5 rounded-2xl border-2 border-purple-400/50 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-purple-800/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-base sm:text-lg font-black text-amber-300">
              مد کے بنیادی قواعد و اسباب:
            </h2>
          </div>
          <span className="text-xs text-purple-200 bg-purple-800/60 px-3 py-1 rounded-full border border-purple-700">
            مد کے ۲ سبب ہیں: (۱) ہمزہ (ء) (۲) سکون (اصلی یا عارضی)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs" dir="rtl">
          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50">
            <span className="font-bold text-emerald-400 block mb-0.5">۱. مَدِّ مُتَّصِل:</span>
            <span>حروفِ مدہ کے بعد ہمزہ اسی کلمے میں ہو (۲ تا ڈھائی الف = ۴ یا ۵ حرکات)۔ جیسے: جَآءَ</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50">
            <span className="font-bold text-blue-400 block mb-0.5">۲. مَدِّ مُنْفَصِل:</span>
            <span>حروفِ مدہ کے بعد ہمزہ دوسرے کلمے میں ہو (۲ تا ڈھائی الف = ۴ یا ۵ حرکات)۔ جیسے: فِيْٓ أَنْفُسِكُمْ</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50">
            <span className="font-bold text-purple-300 block mb-0.5">۳. مَدِّ لَازِم و لین لازم:</span>
            <span>حروفِ مدہ یا لین کے بعد سکونِ اصلی (تشدید یا جزم) ہو (۳ الف = ۶ حرکات)۔ جیسے: جَآنٌّ ، عَیْنٓ</span>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-700/50 sm:col-span-2 lg:col-span-3">
            <span className="font-bold text-amber-400 block mb-0.5">۴. مَدِّ عَارِض و مَدِّ لِیْن عَارِض:</span>
            <span>حروفِ مدہ یا لین کے بعد وقف کی وجہ سے عارضی سکون ہو (۱، ۲ یا ۳ الف = ۲، ۴ یا ۶ حرکات: قصر، توسط، طول)۔ جیسے: مُسْلِمُوْنْ ۝ ، شَفَتَیْنْ ۝</span>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl">
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: '✨ تمام اقسام (کُل ۲۶ کلمات)', color: 'bg-purple-700 text-white' },
            { id: 'muttasil', label: '🟢 ۱: مَدِّ مُتَّصِل', color: 'bg-emerald-600 text-white' },
            { id: 'munfasil', label: '🔵 ۲: مَدِّ مُنْفَصِل', color: 'bg-blue-600 text-white' },
            { id: 'laazim', label: '🟣 ۳: مَدِّ لَازِم', color: 'bg-purple-600 text-white' },
            { id: 'leen_laazim', label: '🔴 ۴: مَدِّ لِیْن لَازِم', color: 'bg-rose-600 text-white' },
            { id: 'aaridh', label: '🟡 ۵: مَدِّ عَارِض وقفی', color: 'bg-amber-600 text-white' },
            { id: 'leen_aaridh', label: '🟠 ۶: مَدِّ لِیْن عَارِض', color: 'bg-orange-600 text-white' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveRule(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeRule === cat.id
                  ? `${cat.color} shadow-md scale-105 ring-2 ring-purple-300`
                  : 'bg-white text-purple-900 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Word Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5" dir="rtl">
        {filteredWords.map((word) => {
          const isPlaying = playingId === word.id;
          const isSelected = selectedWord?.id === word.id;
          const badgeClass = getMaddTypeBadge(word.maddType);

          return (
            <motion.div
              key={word.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePlay(word)}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center select-none shadow-sm min-h-[140px] ${
                isPlaying
                  ? 'bg-purple-900 border-purple-400 text-white ring-4 ring-purple-400/40 shadow-xl scale-105'
                  : isSelected
                    ? 'bg-purple-50 border-purple-500 shadow-md'
                    : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              {/* Madd Category Tag */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${
                  isPlaying ? 'bg-purple-800 text-purple-200 border-purple-600' : badgeClass
                }`}
              >
                {word.categoryLabelUrdu}
              </span>

              {/* Massive Arabic Text */}
              <div
                className={`text-2xl sm:text-3xl font-arabic font-black tracking-wide my-auto py-1 ${
                  isPlaying ? 'text-amber-300 drop-shadow' : 'text-slate-900'
                }`}
              >
                {word.arabic}
              </div>

              {/* Duration Sub-text */}
              <div className="mt-2 w-full flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-1.5">
                <span className={isPlaying ? 'text-purple-200' : 'text-purple-700 font-bold'}>
                  {word.durationText}
                </span>
                <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-300 animate-bounce' : 'text-slate-400'}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Word Details Panel */}
      {selectedWord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-2 border-purple-400/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4"
          dir="rtl"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePlay(selectedWord)}
              className="p-3 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all shadow-lg cursor-pointer shrink-0"
            >
              <Volume2 className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-arabic font-black text-amber-300">
                  {selectedWord.arabic}
                </h3>
                <span className="text-xs bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                  {selectedWord.categoryLabelUrdu}
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-1">
                <strong className="text-amber-400">ہجے:</strong> {selectedWord.spellingHijja}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                <strong className="text-teal-400">سبب:</strong> {selectedWord.causeExplanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-purple-950/80 px-4 py-2 rounded-xl border border-purple-700 shrink-0">
            <Clock className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <div className="text-[10px] text-purple-300">کھینچنے کی مقدار:</div>
              <div className="text-xs font-black text-amber-300">{selectedWord.durationText}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rules Info Modal */}
      {showRulesInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-950 border-2 border-purple-500/50 rounded-3xl p-6 w-full max-w-2xl text-white shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-purple-800 pb-3">
              <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>سبق ۱۳: مَدَّات کے تفصیلی قواعد و احکام</span>
              </h3>
              <button
                onClick={() => setShowRulesInfoModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed max-h-[65vh] overflow-y-auto pr-1" dir="rtl">
              <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-700/50">
                <h4 className="font-bold text-amber-300 mb-1">📌 مد کی تعریف و اسباب:</h4>
                <p className="text-slate-300">
                  مد کے لغوی معنی دراز کرنا اور کھینچنا ہے۔ مد کے دو بنیادی سبب ہیں: (۱) ہمزہ (ء) اور (۲) سکون (اصلی یا عارضی)۔
                </p>
              </div>

              {MADDAT_RULES.map((rule) => (
                <div key={rule.id} className="p-3 rounded-xl bg-slate-900 border border-purple-900">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-black text-purple-300">{rule.titleUrdu}</span>
                    <span className="text-[10px] text-amber-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      مقدار: {rule.durationAlif} ({rule.durationHarakat})
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mb-1.5">{rule.definitionUrdu}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-slate-400">مثالیں:</span>
                    {rule.exampleWords.map((ex, i) => (
                      <span
                        key={i}
                        className="font-arabic font-bold text-amber-200 bg-purple-950/80 px-2 py-0.5 rounded text-xs border border-purple-800/40"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRulesInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 font-bold text-sm text-white cursor-pointer"
            >
              سمجھ آ گیا (بند کریں)
            </button>
          </div>
        </div>
      )}

      {/* Render Maddat Game Modal */}
      {showGameModal && (
        <MaddatGameModal
          isOpen={showGameModal}
          onClose={() => setShowGameModal(false)}
          onBack={() => setShowGameModal(false)}
        />
      )}
    </div>
  );
}
