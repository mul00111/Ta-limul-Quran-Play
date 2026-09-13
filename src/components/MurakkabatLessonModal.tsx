import React, { useState, useMemo } from 'react';
import { Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, Layers, BookOpen, Search, CheckCircle2, Bookmark, Flame, Gamepad2, Puzzle } from 'lucide-react';
import { playQariText, stopAllQariAudio } from '../utils/qariAudioService';
import { ALL_MURAKKABAT_MASHQ, PAGE_1_EXERCISE, PAGE_2_EXERCISE, MurakkabExerciseItem } from '../data/murakkabatMashqData';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { getMurakkabatLessonLocalization } from '../utils/murakkabatLessonLocalization';
import { LanguageCode } from '../types';

interface MurakkabatLessonModalProps {
  onBack: () => void;
  currentLang?: LanguageCode;
}

export const MurakkabatLessonModal: React.FC<MurakkabatLessonModalProps> = ({ onBack, currentLang = 'ur' }) => {
  const mLoc = getMurakkabatLessonLocalization(currentLang);
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const [activeTab, setActiveTab] = useState<'page1' | 'page2' | 'sentences' | 'all'>('page1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | '2-letter' | '3-letter' | '4-letter' | 'sentence'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeItem, setActiveItem] = useState<MurakkabExerciseItem | null>(null);
  const [pronounceMode, setPronounceMode] = useState<'spell' | 'word'>('spell'); // 'spell' = ہجے (بَاءْ سِينْ), 'word' = لفظ (بسم)
  const [showGameModal, setShowGameModal] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);

  // Filter items based on active tab, search, and category
  const filteredItems = useMemo(() => {
    let list: MurakkabExerciseItem[] = [];
    if (activeTab === 'page1') {
      list = PAGE_1_EXERCISE;
    } else if (activeTab === 'page2') {
      list = PAGE_2_EXERCISE.filter(item => item.section !== 'page2_sentences');
    } else if (activeTab === 'sentences') {
      list = PAGE_2_EXERCISE.filter(item => item.section === 'page2_sentences');
    } else {
      list = ALL_MURAKKABAT_MASHQ;
    }

    if (selectedCategory !== 'all') {
      list = list.filter(item => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(item =>
        item.compound.includes(q) ||
        item.name.includes(q) ||
        item.breakdown.includes(q) ||
        (item.urduMeaning && item.urduMeaning.includes(q))
      );
    }

    return list;
  }, [activeTab, selectedCategory, searchQuery]);

  const speakCompound = (item: MurakkabExerciseItem) => {
    if (isMuted) return;
    setActiveItem(item);
    // Play either spelling breakdown pronunciation or the compound word
    const textToSpeak = pronounceMode === 'spell' ? item.name : item.compound;
    playQariText(textToSpeak);
  };

  const playFullSequence = async () => {
    if (isMuted) return;
    if (isPlayingAudio) {
      stopAllQariAudio();
      setIsPlayingAudio(false);
      setActiveItem(null);
      return;
    }

    setIsPlayingAudio(true);
    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      setActiveItem(item);
      const textToSpeak = pronounceMode === 'spell' ? item.name : item.compound;
      await playQariText(textToSpeak);
      await new Promise((r) => setTimeout(r, 400));
    }
    setIsPlayingAudio(false);
    setActiveItem(null);
  };

  if (showGameModal || showMagneticGame) {
    return (
      <MurakkabatPuzzleGameModal
        currentLang={currentLang}
        initialGameMode="murakkabat"
        onBack={() => {
          setShowGameModal(false);
          setShowMagneticGame(false);
        }}
      />
    );
  }

  return (
    <div className={`min-h-[calc(100vh-65px)] bg-slate-950 text-slate-100 p-3 sm:p-6 lg:p-8 select-none ${isRtl ? 'font-urdu' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-amber-500/40 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title={mLoc.backBtn}
            >
              <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
              <span>{mLoc.backBtn}</span>
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                  {mLoc.lessonBadge}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  {mLoc.exerciseBadge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 mt-1">{mLoc.title}</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setShowGameModal(true)}
              id="murakkabat-audio-visual-game-btn"
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 border border-emerald-400 shadow-lg transition-all cursor-pointer hover:scale-105"
              title={mLoc.audioVisualGame}
            >
              <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>{mLoc.audioVisualGame}</span>
            </button>

            <button
              onClick={() => setShowMagneticGame(true)}
              id="murakkabat-magnetic-puzzle-btn"
              className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1 border border-purple-400/50 shadow-md transition-all cursor-pointer hover:scale-105"
              title={mLoc.magneticPuzzle}
            >
              <Puzzle className="w-3.5 h-3.5 text-yellow-300" />
              <span>{mLoc.magneticPuzzle}</span>
            </button>

            <div className="flex items-center bg-slate-800/80 rounded-2xl p-1 border border-slate-700">
              <button
                onClick={() => setPronounceMode('spell')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  pronounceMode === 'spell'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                title={mLoc.spellMode}
              >
                {mLoc.spellMode}
              </button>
              <button
                onClick={() => setPronounceMode('word')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                  pronounceMode === 'word'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
                title={mLoc.wordMode}
              >
                {mLoc.wordMode}
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS (MATCHING THE REAL QAIDA PAGES) */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-lg">
          <button
            onClick={() => { setActiveTab('page1'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'page1'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{mLoc.tab1}</span>
          </button>

          <button
            onClick={() => { setActiveTab('page2'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'page2'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{mLoc.tab2}</span>
          </button>

          <button
            onClick={() => { setActiveTab('sentences'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sentences'
                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{mLoc.tabSentences}</span>
          </button>

          <button
            onClick={() => { setActiveTab('all'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{mLoc.tabAll(ALL_MURAKKABAT_MASHQ.length)}</span>
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={mLoc.searchPlaceholder}
              className={`w-full bg-slate-950 border border-slate-700 rounded-xl py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              {mLoc.filterAll(filteredItems.length)}
            </button>
            <button
              onClick={() => setSelectedCategory('2-letter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedCategory === '2-letter' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              {mLoc.filter2Letter}
            </button>
            <button
              onClick={() => setSelectedCategory('3-letter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedCategory === '3-letter' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              {mLoc.filter3Letter}
            </button>
            <button
              onClick={() => setSelectedCategory('sentence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                selectedCategory === 'sentence' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800/80 text-slate-400'
              }`}
            >
              {mLoc.filterSentence}
            </button>
          </div>
        </div>

        {/* MAIN BOARD CONTAINER */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6">
          
          {/* Instructions Banner */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black text-xs">
                {mLoc.ruleTipBadge}
              </span>
              <p className="leading-relaxed">
                {mLoc.ruleTipText}
              </p>
            </div>
            <div className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-800/50 whitespace-nowrap self-end md:self-auto">
              {filteredItems.length}
            </div>
          </div>

          {/* GRID OF MURAKKABAT CARDS */}
          <div className={`grid gap-3 sm:gap-4 ${
            activeTab === 'sentences'
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'
          }`}>
            {filteredItems.map((item, idx) => {
              const isSelected = activeItem?.id === item.id;
              const isSentence = item.category === 'sentence';

              return (
                <div
                  key={item.id}
                  onClick={() => speakCompound(item)}
                  className={`border-2 rounded-2xl p-3 text-center cursor-pointer transition-all shadow-md flex flex-col items-center justify-between gap-1.5 relative select-none ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-amber-500/30 to-amber-950/70 ring-4 ring-amber-400/50 scale-105 z-10 shadow-2xl'
                      : 'border-slate-800/90 hover:border-amber-500/60 bg-slate-950/70 hover:bg-slate-900/90'
                  } ${isSentence ? 'p-5 sm:p-6' : ''}`}
                >
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold text-slate-500 px-1 rounded bg-slate-900/80">
                      #{idx + 1}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40 truncate max-w-[80px]">
                      {item.category === '2-letter' ? mLoc.filter2Letter : item.category === '3-letter' ? mLoc.filter3Letter : item.category === '4-letter' ? (currentLang === 'en' ? '4-Letter' : '۴-حرفی') : (currentLang === 'en' ? 'Quranic' : 'قرآنی')}
                    </span>
                  </div>

                  {/* Main Arabic Compound Display */}
                  <div className="my-2">
                    <span className={`font-black font-arabic text-amber-300 drop-shadow tracking-wider block ${
                      isSentence ? 'text-2xl sm:text-3xl leading-relaxed text-right' : 'text-3xl sm:text-4xl'
                    }`}>
                      {item.compound}
                    </span>
                  </div>

                  {/* Breakdown & Spelling Name */}
                  <div className="flex flex-col gap-1 items-center w-full pt-1.5 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700/60 text-center w-full truncate font-arabic">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono font-black text-amber-400/90 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/50">
                      {item.breakdown}
                    </span>
                    {item.urduMeaning && (
                      <span className="text-[10px] text-emerald-300/90 mt-0.5 text-center font-medium truncate max-w-full">
                        {item.urduMeaning}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* EMPTY SEARCH STATE */}
          {filteredItems.length === 0 && (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Search className="w-8 h-8 text-amber-400 mx-auto opacity-50" />
              <p className="text-base font-bold text-slate-300">{mLoc.noWordsFound}</p>
              <p className="text-xs text-slate-500">{mLoc.noWordsFoundDesc}</p>
            </div>
          )}

          {/* BOTTOM AUDIO PLAYBAR */}
          <div className="bg-slate-950 border-2 border-amber-500/40 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2.5 text-amber-300 bg-amber-950/40 border border-amber-600/40 px-4 py-2 rounded-xl text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{mLoc.qariSystemTitle}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={playFullSequence}
                className={`px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isPlayingAudio ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110'
                }`}
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? mLoc.stopRecitation : mLoc.listenAllWords(filteredItems.length)}</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
                  isMuted ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isMuted ? mLoc.soundMuted : mLoc.soundOn}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
