import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, Volume2, Play, Pause, BookOpen, Sparkles,
  CheckCircle2, HelpCircle, Layers, Award, Radio, Info, Eye,
  UserCheck
} from 'lucide-react';
import { 
  WaqfRuleItem, NoonQutniItem, WAQF_CATEGORIES, WAQF_ITEMS, NOON_QUTNI_ITEMS 
} from '../data/waqfData';
import { 
  playQariText, stopAllQariAudio, QARI_VOICES, 
  getSelectedQariVoiceId, setSelectedQariVoiceId 
} from '../utils/qariAudioService';

interface WaqfLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
}

export const WaqfLessonModal: React.FC<WaqfLessonModalProps> = ({
  onBack
}) => {
  // Tabs: 'waqf' (وقف کے کلمات), 'noon_qutni' (نونِ قطنی کے کلمات), 'rules' (قواعد و رموزِ وقف)
  const [activeTab, setActiveTab] = useState<'waqf' | 'noon_qutni' | 'rules'>('waqf');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [selectedQari, setSelectedQari] = useState<string>(getSelectedQariVoiceId() || 'sudais');
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeNoonQutniId, setActiveNoonQutniId] = useState<string | null>(null);

  // Sync selected reciter
  useEffect(() => {
    setSelectedQariVoiceId(selectedQari);
  }, [selectedQari]);

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllQariAudio();
    };
  }, []);

  // Filtered Waqf items based on category and search (strictly pure Waqf, no Noon Qutni)
  const filteredWaqfItems = useMemo(() => {
    return WAQF_ITEMS.filter(item => {
      const matchesFilter = selectedGroupFilter === 'all' || item.category === selectedGroupFilter;
      const matchesSearch = !searchQuery || 
        item.textNormal.includes(searchQuery) || 
        item.textWaqf.includes(searchQuery) ||
        (item.note && item.note.includes(searchQuery)) ||
        item.category.includes(searchQuery);
      return matchesFilter && matchesSearch;
    });
  }, [selectedGroupFilter, searchQuery]);

  // Filtered Noon Qutni items
  const filteredNoonQutniItems = useMemo(() => {
    if (!searchQuery) return NOON_QUTNI_ITEMS;
    return NOON_QUTNI_ITEMS.filter(item =>
      item.text.includes(searchQuery) ||
      item.وصل.includes(searchQuery) ||
      item.surahName.includes(searchQuery) ||
      item.ruleExplanation.includes(searchQuery)
    );
  }, [searchQuery]);

  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) newRevealed.delete(id);
    else newRevealed.add(id);
    setRevealedIds(newRevealed);
  };

  const revealAll = () => {
    const all = new Set(filteredWaqfItems.map(i => i.id));
    setRevealedIds(all);
  };

  const hideAll = () => {
    setRevealedIds(new Set());
  };

  // Play audio for a pure Waqf word using Qari audio service
  const speakWaqfWord = async (item: WaqfRuleItem, mode: 'normal' | 'waqf') => {
    stopAllQariAudio();
    setActiveWordId(item.id + mode);
    try {
      if (mode === 'normal') {
        // Wasl: Sheikh Abdurrahman As-Sudais (or selected Qari)
        const customUrl = item.audioNormal;
        await playQariText(item.textNormal, undefined, customUrl, false, selectedQari);
      } else {
        // Waqf mode: Robotic voice as requested by user ("waqf ke kalimat me robotic awaz kardijiye")
        await playQariText(item.textWaqf, undefined, undefined, true, selectedQari);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActiveWordId(null);
    }
  };

  // Play audio for Noon Qutni item (Sheikh Sudais for Wasl)
  const speakNoonQutni = async (item: NoonQutniItem) => {
    stopAllQariAudio();
    setActiveNoonQutniId(item.id + 'normal');
    try {
      // Wasl with Sheikh Sudais recitation
      await playQariText(item.text, undefined, item.audioNormal, false, selectedQari);
    } catch (e) {
      console.error(e);
    } finally {
      setActiveNoonQutniId(null);
    }
  };

  // Continuous auto play through pure Waqf items
  const handlePlayAllWaqf = async () => {
    if (isPlayingAll) {
      stopAllQariAudio();
      setIsPlayingAll(false);
      setActiveWordId(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < filteredWaqfItems.length; i++) {
      if (!isPlayingAll && i > 0) break;
      const item = filteredWaqfItems[i];
      
      // 1. Play normal (وصل) in Sheikh Abdurrahman As-Sudais's voice
      setActiveWordId(item.id + 'normal');
      await playQariText(item.textNormal, undefined, item.audioNormal, false, selectedQari);
      await new Promise(r => setTimeout(r, 450));
      
      // 2. Play waqf (وقف) in robotic voice
      setActiveWordId(item.id + 'waqf');
      await playQariText(item.textWaqf, undefined, undefined, true, selectedQari);
      await new Promise(r => setTimeout(r, 550));
    }
    setIsPlayingAll(false);
    setActiveWordId(null);
  };

  // Continuous auto play through Noon Qutni items
  const handlePlayAllNoonQutni = async () => {
    if (isPlayingAll) {
      stopAllQariAudio();
      setIsPlayingAll(false);
      setActiveNoonQutniId(null);
      return;
    }

    setIsPlayingAll(true);
    for (let i = 0; i < filteredNoonQutniItems.length; i++) {
      if (!isPlayingAll && i > 0) break;
      const item = filteredNoonQutniItems[i];
      
      // Play wasl with Sheikh Sudais recitation
      setActiveNoonQutniId(item.id + 'normal');
      await playQariText(item.text, undefined, item.audioNormal, false, selectedQari);
      await new Promise(r => setTimeout(r, 650));
    }
    setIsPlayingAll(false);
    setActiveNoonQutniId(null);
  };

  return (
    <div className="fixed inset-0 bg-emerald-950 z-50 flex flex-col font-urdu font-nastaliq font-jameel overflow-hidden" dir="rtl">
      {/* Compact, Mobile-Optimized Header */}
      <div className="bg-emerald-900/95 backdrop-blur-md px-3 py-2.5 sm:px-5 sm:py-3.5 shadow-xl border-b border-emerald-500/20 flex-shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col gap-2 sm:gap-3">
          
          {/* Top Row: Back Button + Title + Reciter Pill */}
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={() => { stopAllQariAudio(); onBack(); }}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
            
            <div className="text-center flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl text-white font-bold truncate drop-shadow-sm">
                سبق نمبر ۱۷: وقف اور نونِ قطنی
              </h1>
            </div>

            {/* Reciter Selector Dropdown / Voice Selector */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 bg-emerald-950/80 px-2 py-1 rounded-xl border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <select 
                  value={selectedQari}
                  onChange={(e) => setSelectedQari(e.target.value)}
                  className="bg-transparent text-emerald-100 text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer max-w-[90px] sm:max-w-none truncate"
                >
                  {QARI_VOICES.map(v => (
                    <option key={v.id} value={v.id} className="bg-emerald-900 text-white">
                      {v.qariNameUrdu}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sub Row: Context-Aware Legend + Play All Button */}
          <div className="flex items-center justify-between gap-2 bg-emerald-950/80 px-3 py-2 rounded-2xl border border-emerald-700/50 text-xs shadow-inner">
            {activeTab === 'waqf' && (
              <div className="flex items-center gap-2 sm:gap-4 overflow-hidden text-emerald-200">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                  <span className="text-amber-300 font-black">وَصْل:</span>
                  <span className="text-white font-bold truncate">الشيخ عبد الرحمن السديس (192kbps)</span>
                </div>
                <span className="text-emerald-700">|</span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-300 font-bold">وَقْف:</span>
                  <span className="text-emerald-100 truncate">تجویدی صوتی ادائیگی</span>
                </div>
              </div>
            )}

            {activeTab === 'noon_qutni' && (
              <div className="flex items-center gap-1.5 overflow-hidden text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span className="text-amber-300 font-black">تلاوت:</span>
                <span className="text-emerald-100 truncate">فضيلۃ الشيخ عبد الرحمن السديس</span>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="flex items-center gap-1.5 overflow-hidden text-amber-200">
                <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-amber-300 font-bold">رہنمائی:</span>
                <span className="text-amber-100 truncate">قواعد و علاماتِ وقف</span>
              </div>
            )}

            {activeTab === 'waqf' && (
              <button
                onClick={handlePlayAllWaqf}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 ${
                  isPlayingAll 
                    ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400/50' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950'
                }`}
              >
                {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAll ? 'روکیں' : 'تمام وصل سنیں (سدیس)'}</span>
              </button>
            )}

            {activeTab === 'noon_qutni' && (
              <button
                onClick={handlePlayAllNoonQutni}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer flex-shrink-0 ${
                  isPlayingAll 
                    ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400/50' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950'
                }`}
              >
                {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAll ? 'روکیں' : 'سب سنیں (سدیس)'}</span>
              </button>
            )}
          </div>
          
          {/* Main 3-Tab Bar (Single Horizontal Segment on all devices) */}
          <div className="grid grid-cols-3 gap-1 bg-emerald-950/90 p-1 rounded-2xl border border-emerald-700/50 shadow-inner">
            
            {/* Tab 1: Pure Waqf Kalimat */}
            <button
              onClick={() => { stopAllQariAudio(); setIsPlayingAll(false); setActiveTab('waqf'); }}
              className={`flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'waqf' 
                  ? 'bg-emerald-500 text-white shadow-md font-extrabold' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">وقف ({WAQF_ITEMS.length})</span>
            </button>

            {/* Tab 2: Noon Qutni Only */}
            <button
              onClick={() => { stopAllQariAudio(); setIsPlayingAll(false); setActiveTab('noon_qutni'); }}
              className={`flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'noon_qutni' 
                  ? 'bg-indigo-600 text-white shadow-md font-extrabold' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span className="truncate">نُوْنِ قُطْنِی ({NOON_QUTNI_ITEMS.length})</span>
            </button>

            {/* Tab 3: Rules & Symbols */}
            <button
              onClick={() => { stopAllQariAudio(); setIsPlayingAll(false); setActiveTab('rules'); }}
              className={`flex items-center justify-center gap-1 py-1.5 sm:py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'rules' 
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-extrabold' 
                  : 'text-emerald-300 hover:text-white hover:bg-emerald-800/40'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">رموز و قواعد</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-emerald-950 p-3 sm:p-5 lg:p-7 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* ========================================================================= */}
          {/* 1. WAQF KALIMAT TAB (وقف کے کلمات - خالص وقف) */}
          {/* ========================================================================= */}
          {activeTab === 'waqf' && (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Filter Pills and Search */}
              <div className="bg-emerald-900/40 rounded-2xl p-3 sm:p-4 border border-emerald-500/20 shadow-lg backdrop-blur-sm space-y-3">
                {/* Horizontal Scrollable Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => setSelectedGroupFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                      selectedGroupFilter === 'all'
                        ? 'bg-emerald-500 text-white shadow'
                        : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-700/60'
                    }`}
                  >
                    سب ({WAQF_ITEMS.length})
                  </button>
                  {WAQF_CATEGORIES.map(cat => {
                    const count = WAQF_ITEMS.filter(i => i.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedGroupFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1 ${
                          selectedGroupFilter === cat.id
                            ? 'bg-amber-500 text-zinc-950 shadow'
                            : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-700/60'
                        }`}
                      >
                        <span>{cat.title}</span>
                        <span className="text-[10px] opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar + Educational Mode Toggle */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Radio className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
                    <input 
                      type="text" 
                      placeholder="کلمہ تلاش کریں (مثلاً: مَا خَلَقَ، تَوَّابًا)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-emerald-950/70 border border-emerald-500/30 rounded-xl py-1.5 pr-9 pl-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-arabic text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => { setIsPracticeMode(false); revealAll(); }}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        !isPracticeMode ? 'bg-emerald-600 text-white shadow' : 'bg-emerald-950/60 text-emerald-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تعلیمی</span>
                    </button>
                    <button
                      onClick={() => { setIsPracticeMode(true); hideAll(); }}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        isPracticeMode ? 'bg-amber-500 text-zinc-950 shadow' : 'bg-emerald-950/60 text-emerald-300'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>مشق</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Grid (Waqf Words Only - Premium Quality Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                 {filteredWaqfItems.map((item, index) => {
                   const isRevealed = revealedIds.has(item.id);
                   const showWaqf = !isPracticeMode || isRevealed;
                   const isNormalActive = activeWordId === item.id + 'normal';
                   const isWaqfActive = activeWordId === item.id + 'waqf';

                   return (
                     <div 
                       key={item.id}
                       className="bg-gradient-to-b from-emerald-950/95 via-emerald-900/40 to-emerald-950/95 rounded-3xl p-4 sm:p-5 border border-emerald-500/30 hover:border-amber-400/70 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 relative overflow-hidden group flex flex-col justify-between"
                     >
                       {/* Subtle Ambient Glow */}
                       <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500 pointer-events-none" />

                       <div className="flex flex-col h-full gap-3.5 relative z-10">
                         
                         {/* Rule Badge & Note Header */}
                         <div className="flex items-center justify-between gap-2">
                           <span className="text-xs font-black text-amber-300 bg-gradient-to-r from-amber-950 to-amber-900 px-3 py-1 rounded-xl border border-amber-500/40 shadow-inner truncate max-w-[82%]">
                             {item.note || WAQF_CATEGORIES.find(c => c.id === item.category)?.ruleBadge}
                           </span>
                           <span className="text-xs text-amber-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-700/50">
                             #{index + 1}
                           </span>
                         </div>
                         
                         {/* Dual Panel (Wasl vs Waqf) */}
                         <div className="grid grid-cols-2 gap-2.5">
                            
                            {/* 1. Normal Word (وَصْل) - Sheikh Sudais Audio */}
                            <div className={`bg-emerald-950/90 rounded-2xl p-3 border transition-all duration-200 flex flex-col items-center justify-between gap-2.5 shadow-md hover:border-amber-400/60 ${
                              isNormalActive 
                                ? 'border-amber-400 ring-4 ring-amber-400/30 shadow-amber-400/20' 
                                : 'border-amber-500/30'
                            }`}>
                              <div className="flex items-center gap-1 text-amber-300 text-[11px] font-black tracking-wide bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/20">
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>وَصْل (السدیس)</span>
                              </div>
                              
                              <span className="text-2xl sm:text-3xl lg:text-4xl text-white font-arabic font-bold leading-relaxed text-center min-h-[55px] flex items-center justify-center drop-shadow-[0_2px_8px_rgba(251,191,36,0.15)]">
                                {item.textNormal}
                              </span>

                              <button
                                onClick={() => speakWaqfWord(item, 'normal')}
                                className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                                  isNormalActive
                                    ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-400/40 animate-pulse scale-105'
                                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 hover:shadow-amber-500/30'
                                }`}
                                title="وصل کی تلاوت (فضیلۃ الشیخ عبد الرحمن السدیس)"
                              >
                                <Volume2 className={`w-4 h-4 ${isNormalActive ? 'animate-bounce' : ''}`} />
                                <span>{isNormalActive ? 'جاری ہے...' : 'وصل (سدیس)'}</span>
                              </button>
                            </div>
                            
                            {/* 2. Waqf Word (وَقْف) */}
                            <div 
                              onClick={() => isPracticeMode && toggleReveal(item.id)}
                              className={`bg-emerald-900/40 rounded-2xl p-3 border transition-all duration-200 flex flex-col items-center justify-between gap-2.5 shadow-md hover:border-emerald-400/50 ${
                                isWaqfActive 
                                  ? 'border-emerald-400 ring-4 ring-emerald-400/30 shadow-emerald-400/20' 
                                  : 'border-emerald-600/30'
                              } ${isPracticeMode && !isRevealed ? 'cursor-pointer hover:bg-emerald-700/40' : ''}`}
                            >
                              <div className="flex items-center gap-1 text-emerald-300 text-[11px] font-black tracking-wide bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>وَقْف (حالتِ وقف)</span>
                              </div>
                              
                              <div className="min-h-[55px] flex items-center justify-center w-full">
                                {showWaqf ? (
                                  <span className="text-2xl sm:text-3xl lg:text-4xl text-emerald-100 font-arabic font-bold leading-relaxed text-center drop-shadow-[0_2px_8px_rgba(52,211,153,0.2)]">
                                    {item.textWaqf}
                                  </span>
                                ) : (
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-1 bg-emerald-600/60 rounded-full" />
                                    <span className="text-xs text-amber-300 font-bold">کلک کریں</span>
                                  </div>
                                )}
                              </div>

                              <div className="w-full">
                                {showWaqf ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); speakWaqfWord(item, 'waqf'); }}
                                    className={`w-full py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                                      isWaqfActive
                                        ? 'bg-emerald-400 text-zinc-950 ring-2 ring-emerald-400/40 animate-pulse scale-105'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white hover:shadow-emerald-500/30'
                                    }`}
                                    title="وقف کی صوتی ادائیگی"
                                  >
                                    <Volume2 className={`w-4 h-4 ${isWaqfActive ? 'animate-bounce' : ''}`} />
                                    <span>{isWaqfActive ? 'جاری ہے...' : 'وقف سنیں'}</span>
                                  </button>
                                ) : (
                                  <button className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 text-emerald-600 cursor-default text-xs font-bold">
                                    مخفی
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. NOON QUTNI TAB (نُوْنِ قُطْنِی کے کلمات - اعلیٰ ترین کوالٹی کارڈز) */}
          {/* ========================================================================= */}
          {activeTab === 'noon_qutni' && (
            <div className="space-y-4 sm:space-y-6">
              
              {/* Noon Qutni Rule Intro Box */}
              <div className="bg-gradient-to-r from-indigo-950/95 via-purple-950/90 to-emerald-950/95 rounded-3xl p-5 border border-indigo-500/40 shadow-2xl space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-6 h-6 text-amber-300 flex-shrink-0 animate-pulse" />
                  <h2 className="text-lg sm:text-xl font-black text-white">نُوْنِ قُطْنِی (نِ) کا تجویدی قاعدہ:</h2>
                </div>
                <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-medium">
                  تنوین (دو زبر، دو زیر، دو پیش) کے بعد ہمزہ وصلی (الف) آنے پر وصل (ملا کر پڑھنے) کی حالت میں تنوین کے نون ساکن کو کسرہ <span className="text-amber-300 font-bold font-arabic text-lg">(نِ)</span> دے کر اگلے حرف سے ملایا جاتا ہے۔
                </p>
              </div>

              {/* Noon Qutni Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {filteredNoonQutniItems.map((item, idx) => {
                  const isWaslActive = activeNoonQutniId === item.id + 'normal';

                  return (
                    <div 
                      key={item.id}
                      className="bg-gradient-to-b from-indigo-950/90 via-slate-900/80 to-indigo-950/90 rounded-3xl p-5 border border-indigo-500/30 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 space-y-4"
                    >
                      {/* Header Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 bg-amber-950/90 px-3 py-1 rounded-xl border border-amber-500/40 shadow-inner">
                          {item.surahName} (آیت {item.ayahNumber})
                        </span>
                        <span className="text-xs text-amber-400 font-mono font-bold bg-indigo-950/80 px-2.5 py-0.5 rounded-lg border border-indigo-700/50">
                          #{idx + 1}
                        </span>
                      </div>

                      {/* Quranic Text Display */}
                      <div 
                        onClick={() => speakNoonQutni(item)}
                        className="bg-indigo-950/80 hover:bg-indigo-900/60 rounded-2xl p-4 border border-indigo-500/30 text-center cursor-pointer transition-all group/text shadow-inner"
                        title="الشیخ السدیس کی آواز میں سنیں"
                      >
                        <span className="font-arabic text-3xl sm:text-4xl text-white leading-relaxed font-bold group-hover/text:text-amber-200 transition-colors">
                          {item.text}
                        </span>
                      </div>

                      {/* Wasl Action Box with Sheikh Sudais */}
                      <div className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                        isWaslActive 
                          ? 'bg-amber-950/90 border-amber-400 ring-4 ring-amber-400/30 shadow-lg' 
                          : 'bg-emerald-950/70 border-emerald-600/40'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-amber-300">وَصْل (الشيخ عبد الرحمن السديس):</span>
                          <span className="font-arabic text-xl sm:text-2xl text-white font-bold truncate">
                            {item.وصل}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => speakNoonQutni(item)}
                          className={`w-full py-2.5 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md ${
                            isWaslActive
                              ? 'bg-amber-400 text-zinc-950 ring-2 ring-amber-400/40 animate-pulse scale-105'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950'
                          }`}
                          title="وصل میں نونِ قطنی سنیں (الشیخ السدیس)"
                        >
                          <Volume2 className={`w-4 h-4 ${isWaslActive ? 'animate-bounce' : ''}`} />
                          <span>{isWaslActive ? 'جاری ہے...' : 'وصل سنیں (سدیس)'}</span>
                        </button>
                      </div>

                      {/* Explanation Note */}
                      <div className="bg-indigo-950/90 p-3 rounded-2xl border border-indigo-800/60 text-xs text-indigo-100 leading-relaxed font-medium">
                        <span className="font-bold text-amber-300 ml-1">توضیح:</span>
                        {item.ruleExplanation}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. RULES TAB (رموز و قواعدِ وقف) */}
          {/* ========================================================================= */}
          {activeTab === 'rules' && (
            <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
              
              {/* Rules Introduction */}
              <div className="bg-emerald-900/40 rounded-2xl p-4 sm:p-6 border border-emerald-500/20 shadow-xl space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-300 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-400" />
                  وقف کے بنیادی قواعد
                </h2>
                
                <div className="bg-emerald-950/60 rounded-xl p-3.5 border border-emerald-800/50">
                  <h3 className="text-base font-bold text-amber-300 mb-1">وَقْف کی تعریف:</h3>
                  <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
                    وقف کے معنی <span className="text-amber-400 font-bold">ٹھہرنے اور رُکنے</span> کے ہیں۔ یعنی کلمے کے آخری حرف پر آواز اور سانس دونوں کو ختم کر کے آگے بڑھنا۔
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/50">
                    <span className="text-amber-300 font-bold text-xs">۱. حرکات و تنوین:</span>
                    <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
                      زبر، زیر، پیش، دو زیر، دو پیش پر وقف میں حرف کو <span className="text-amber-300 font-bold">ساکن</span> کیا جاتا ہے۔ (مثلاً: مَا خَلَقَ ← مَا خَلَقْ)
                    </p>
                  </div>
                  
                  <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/50">
                    <span className="text-amber-300 font-bold text-xs">۲. دو زبر پر وقف:</span>
                    <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
                      دو زبر کو وقف میں <span className="text-amber-300 font-bold">الف مدہ</span> سے بدل کر ایک الف کھینچتے ہیں۔ (مثلاً: تَوَّابًا ← تَوَّابَا)
                    </p>
                  </div>
                  
                  <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/50">
                    <span className="text-amber-300 font-bold text-xs">۳. گول تا (ة / ـة):</span>
                    <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
                      گول تا وقف میں ہمیشہ ہائے ساکنہ <span className="font-arabic text-amber-300 font-bold">ہْ / هْ</span> بن جاتی ہے۔ (مثلاً: قُوَّةٍ ← قُوَّهْ)
                    </p>
                  </div>
                  
                  <div className="bg-emerald-950/60 rounded-xl p-3 border border-emerald-800/50">
                    <span className="text-amber-300 font-bold text-xs">۴. کھڑا زبر و مد:</span>
                    <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
                      کھڑا زبر اور حروفِ مدہ وقف میں <span className="text-amber-300 font-bold">تبدیل نہیں ہوتے</span>۔ (مثلاً: اَوْحٰى ← اَوْحٰى)
                    </p>
                  </div>
                </div>
              </div>

              {/* Alamat e Waqf Symbols */}
              <div className="bg-emerald-900/40 rounded-2xl p-4 sm:p-6 border border-emerald-500/20 shadow-xl space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  قرآن مجید میں رموزِ وَقْف
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { sym: '۝', name: 'وقف تام', desc: 'آیت مکمل ہونے کی علامت، یہاں ٹھہرنا سنت ہے۔' },
                    { sym: 'م', name: 'وقف لازم', desc: 'یہاں ضرور ٹھہریں، ملا کر پڑھنے سے معنی بگڑ سکتا ہے۔' },
                    { sym: 'ط', name: 'وقف مطلق', desc: 'یہاں ٹھہرنا بہتر ہے۔' },
                    { sym: 'ج', name: 'وقف جائز', desc: 'ٹھہرنا اور ملا کر پڑھنا دونوں جائز ہیں۔' },
                    { sym: 'ز', name: 'وقف مجوّز', desc: 'نہ ٹھہرنا بہتر ہے مگر ٹھہرنا بھی جائز ہے۔' },
                    { sym: 'ص', name: 'وقف مرخّص', desc: 'سانس ٹوٹنے کی مجبوری میں ٹھہرنے کی رخصت ہے۔' },
                    { sym: 'لا', name: 'علامتِ لا', desc: 'درمیانِ آیت میں نہ ٹھہریں، آیت کے آخر پر ٹھہرنا جائز ہے۔' },
                    { sym: 'قف / سکتہ', name: 'سکتہ / وقف', desc: 'سکتہ میں بغیر سانس توڑے تھوڑی دیر آواز روکیں۔' }
                  ].map((r, i) => (
                    <div key={i} className="bg-emerald-950/70 p-3 rounded-xl border border-emerald-800/40 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center text-amber-300 font-bold text-sm flex-shrink-0">
                        {r.sym}
                      </div>
                      <div>
                        <span className="text-white font-bold text-xs sm:text-sm block">{r.name}</span>
                        <span className="text-emerald-200 text-[11px] leading-tight block mt-0.5">{r.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
