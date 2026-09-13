import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Volume2, Play, Pause, Search, Filter, Sparkles, BookOpen, Layers, 
  CheckCircle2, Info, ArrowRight, Award, Compass, Type
} from 'lucide-react';
import { 
  PAGE_20_IMTIHAN_WORDS, 
  PAGE_20_ROWS, 
  ImtihanWordItem,
  PAGE_20_SECTION_1,
  PAGE_20_SECTION_2,
  PAGE_20_SECTION_3
} from '../data/page20ImtihanData';
import { playQariText, stopAllQariAudio, playUrduText } from '../utils/qariAudioService';

interface Page20ImtihanViewProps {
  onSelectWord?: (word: ImtihanWordItem) => void;
  accentColor?: 'emerald' | 'amber' | 'teal' | 'indigo';
}

export const Page20ImtihanView: React.FC<Page20ImtihanViewProps> = ({
  onSelectWord,
  accentColor = 'emerald'
}) => {
  const [selectedWord, setSelectedWord] = useState<ImtihanWordItem | null>(PAGE_20_IMTIHAN_WORDS[0]);
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja' | 'both'>('rawani');
  const [activeSection, setActiveSection] = useState<'all' | 1 | 2 | 3>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'alif' | 'waw' | 'yaa' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'mixed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);

  const handlePlayWord = async (word: ImtihanWordItem) => {
    setActiveWordId(word.id);
    setSelectedWord(word);
    if (onSelectWord) onSelectWord(word);

    try {
      if (pronunciationMode === 'hijja') {
        await playQariText(word.hijjaText);
      } else if (pronunciationMode === 'both') {
        await playQariText(word.hijjaText);
        await new Promise(r => setTimeout(r, 400));
        await playQariText(word.word);
      } else {
        await playQariText(word.word);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const playSequence = async () => {
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWordId(null);
      return;
    }

    setIsPlayingSequence(true);
    let targetWords = PAGE_20_IMTIHAN_WORDS;
    if (activeSection === 1) targetWords = PAGE_20_SECTION_1;
    else if (activeSection === 2) targetWords = PAGE_20_SECTION_2;
    else if (activeSection === 3) targetWords = PAGE_20_SECTION_3;

    for (const word of targetWords) {
      if (!isPlayingSequence) break;
      setActiveWordId(word.id);
      setSelectedWord(word);
      const textToPlay = pronunciationMode === 'hijja' ? word.hijjaText : word.word;
      await playQariText(textToPlay);
      await new Promise(r => setTimeout(r, 450));
    }

    setIsPlayingSequence(false);
    setActiveWordId(null);
  };

  const filteredWords = PAGE_20_IMTIHAN_WORDS.filter(w => {
    if (activeSection !== 'all' && w.section !== activeSection) return false;
    if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      return w.word.includes(q) || w.hijjaText.includes(q) || w.meaningOrContext.includes(q);
    }
    return true;
  });

  const fontClass = fontSize === 'normal' 
    ? 'text-2xl sm:text-3xl' 
    : fontSize === 'xlarge' 
    ? 'text-4xl sm:text-5xl' 
    : 'text-3xl sm:text-4xl';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/60 border border-emerald-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs px-3 py-1 rounded-full font-black flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                جامع امتحان (۵۰ کلمات)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-300 font-urdu">
                امتحانِ حروفِ مدہ و کھڑی حرکات
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-urdu">
              قاعدہ کا مستند ترین جامع امتحان — جس میں الف مدہ، واؤ مدہ، یاء مدہ، کھڑا زبر، کھڑا زیر، الٹا پیش، حروفِ لین اور حرکات کے ۵۰ جامع قرآنی کلمات شامل ہیں۔
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => playUrduText('جامع امتحان۔ حروف مدہ اور کھڑی حرکات کے کلمات کی مکمل مشق')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-medium transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>ہدایت سنیں</span>
            </button>

            <button
              onClick={playSequence}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all shadow-md ${
                isPlayingSequence
                  ? 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingSequence ? 'روکیں' : 'مکمل سماعت'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Sections, Mode, Font Size, Search */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Section filter */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-urdu ml-1">حصے:</span>
          <button
            onClick={() => setActiveSection('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-urdu font-medium transition-all ${
              activeSection === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            تمام ۵۰ کلمات
          </button>
          <button
            onClick={() => setActiveSection(1)}
            className={`px-2.5 py-1 rounded-lg text-xs font-urdu font-medium transition-all ${
              activeSection === 1
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            حصہ ۱ (سطر ۱ تا ۳)
          </button>
          <button
            onClick={() => setActiveSection(2)}
            className={`px-2.5 py-1 rounded-lg text-xs font-urdu font-medium transition-all ${
              activeSection === 2
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            حصہ ۲ (سطر ۴ تا ۶)
          </button>
          <button
            onClick={() => setActiveSection(3)}
            className={`px-2.5 py-1 rounded-lg text-xs font-urdu font-medium transition-all ${
              activeSection === 3
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            حصہ ۳ (سطر ۷ تا ۱۰)
          </button>
        </div>

        {/* Pronunciation mode toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setPronunciationMode('rawani')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-urdu transition-all ${
              pronunciationMode === 'rawani'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            روانی
          </button>
          <button
            onClick={() => setPronunciationMode('hijja')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-urdu transition-all ${
              pronunciationMode === 'hijja'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ہجے
          </button>
          <button
            onClick={() => setPronunciationMode('both')}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-urdu transition-all ${
              pronunciationMode === 'both'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ہجے + روانی
          </button>
        </div>

        {/* Font size */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
          <Type className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setFontSize('normal')}
            className={`px-1.5 py-0.5 text-xs rounded ${fontSize === 'normal' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
          >
            عادی
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-1.5 py-0.5 text-xs rounded ${fontSize === 'large' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
          >
            بڑا
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-1.5 py-0.5 text-xs rounded ${fontSize === 'xlarge' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
          >
            جلی
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[140px] sm:min-w-[180px]">
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="کلمہ تلاش کریں..."
            dir="rtl"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid: 10 Rows with 5 Columns Right-To-Left matching Page 20 */}
      <div className="space-y-4" dir="rtl">
        {PAGE_20_ROWS.map((rowGroup) => {
          // If activeSection filter is active and doesn't match this row's section, skip
          if (activeSection !== 'all' && rowGroup.section !== activeSection) return null;

          // Filter words in this row by category and search
          const rowWords = rowGroup.words.filter(w => {
            if (categoryFilter !== 'all' && w.category !== categoryFilter) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.trim();
              return w.word.includes(q) || w.hijjaText.includes(q) || w.meaningOrContext.includes(q);
            }
            return true;
          });

          if (rowWords.length === 0) return null;

          return (
            <div key={rowGroup.rowNumber} className="space-y-1.5">
              {/* Row Header & Section Divider */}
              <div className="flex items-center justify-between px-2 text-xs text-slate-400 font-urdu">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-800 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold">
                    سطر {rowGroup.rowNumber}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {rowGroup.section === 1 ? 'حصہ اوّل (کلمات ۱ تا ۱۵)' : rowGroup.section === 2 ? 'حصہ دوم (کلمات ۱۶ تا ۳۰)' : 'حصہ سوم (کلمات ۳۱ تا ۵۰)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">۵ خانے (دائیں سے بائیں)</span>
              </div>

              {/* 5 Column Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {rowWords.map((wordItem) => {
                  const isActive = activeWordId === wordItem.id;
                  const isSelected = selectedWord?.id === wordItem.id;

                  return (
                    <motion.button
                      key={wordItem.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlayWord(wordItem)}
                      className={`p-3 sm:p-4 rounded-2xl border flex flex-col items-center justify-between transition-all cursor-pointer relative shadow-md min-h-[110px] sm:min-h-[125px] ${
                        isActive
                          ? 'bg-emerald-950/90 border-emerald-400 ring-2 ring-emerald-400/60 shadow-emerald-900/30'
                          : isSelected
                          ? 'bg-slate-800/90 border-amber-400/70 ring-1 ring-amber-400/40'
                          : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 hover:border-emerald-500/40'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="w-full flex items-center justify-between text-[9px] mb-1">
                        <span className="text-slate-400 font-urdu font-medium">
                          #{wordItem.id - 500}
                        </span>
                        {wordItem.isHeavy && (
                          <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 px-1 py-0.2 rounded text-[8px] font-urdu">
                            پُر حرف
                          </span>
                        )}
                      </div>

                      {/* Main Arabic Text */}
                      <div className={`font-arabic ${fontClass} font-bold text-amber-200 my-auto tracking-normal leading-relaxed text-center drop-shadow`}>
                        {wordItem.word}
                      </div>

                      {/* Bottom Urdu Hijja */}
                      <div className="w-full mt-1.5 pt-1.5 border-t border-slate-700/50 flex flex-col items-center">
                        <span className="text-[10px] sm:text-[11px] text-slate-300 font-urdu text-center line-clamp-1 leading-tight">
                          {wordItem.hijjaText.split('=')[0]}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Word Detail Inspector */}
      {selectedWord && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-3" 
          dir="rtl"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-4">
              <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 text-center min-w-[100px]">
                <div className="font-arabic text-3xl sm:text-4xl font-black text-amber-300">
                  {selectedWord.word}
                </div>
                <span className="text-[10px] text-amber-400/80 font-urdu">امتحان • کلمہ #{selectedWord.id - 500}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100 font-urdu">
                    تفصیلی ہجے و تجوید
                  </h3>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-urdu">
                    سطر {selectedWord.row} • خانہ {selectedWord.col}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-300 font-urdu font-medium">
                  {selectedWord.hijjaText}
                </p>
                <p className="text-xs text-slate-400 font-urdu">
                  مفہوم: <span className="text-slate-200">{selectedWord.meaningOrContext}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayWord(selectedWord)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>کلمہ سنیں</span>
              </button>
              <button
                onClick={() => playQariText(selectedWord.hijjaText)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-urdu transition-all"
              >
                صرف ہجے سنیں
              </button>
            </div>
          </div>

          {/* Syllables breakdown & Tajweed Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-xs text-slate-400 font-urdu font-bold">اجزاء / ٹکڑے (Syllables):</span>
              <div className="flex items-center gap-2">
                {selectedWord.syllableBreakdown.map((syl, idx) => (
                  <span 
                    key={idx}
                    className="bg-slate-900 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg font-arabic text-lg font-bold"
                  >
                    {syl}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-xs text-amber-400 font-urdu font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                تجویدی رہنمائی:
              </span>
              <p className="text-xs text-slate-300 font-urdu leading-relaxed">
                {selectedWord.tajweedNotes}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
