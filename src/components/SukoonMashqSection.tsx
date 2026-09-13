import React, { useState, useMemo } from 'react';
import { 
  Volume2, Play, Pause, Sparkles, Filter, Search, BookOpen, 
  Grid, LayoutGrid, CheckCircle2, Info, Lightbulb, HelpCircle
} from 'lucide-react';
import { 
  SUKOON_MASHQ_PAGE_1_ITEMS, 
  SUKOON_MASHQ_PAGE_2_ITEMS, 
  ALL_SUKOON_MASHQ_WORDS, 
  SukoonMashqItem 
} from '../data/sukoonMashqData';

interface SukoonMashqSectionProps {
  pronunciationMode: 'rawani' | 'hijja';
  isMuted: boolean;
  activeWordId: string | null;
  isPlayingSequence: boolean;
  onWordClick: (item: SukoonMashqItem) => void;
  onPlaySequence: (items: SukoonMashqItem[]) => void;
  onGoToRules: () => void;
  onGoToQuiz: () => void;
}

export const SukoonMashqSection: React.FC<SukoonMashqSectionProps> = ({
  pronunciationMode,
  isMuted,
  activeWordId,
  isPlayingSequence,
  onWordClick,
  onPlaySequence,
  onGoToRules,
  onGoToQuiz
}) => {
  const [selectedPage, setSelectedPage] = useState<'all' | 'page1' | 'page2'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'qalqalah' | 'hamzah' | 'heavy' | 'leen'>('all');
  const [viewMode, setViewMode] = useState<'book_grid' | 'detailed_cards'>('book_grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailWord, setSelectedDetailWord] = useState<SukoonMashqItem | null>(null);

  // Filter based on selected page
  const pageWords = useMemo(() => {
    if (selectedPage === 'page1') return SUKOON_MASHQ_PAGE_1_ITEMS;
    if (selectedPage === 'page2') return SUKOON_MASHQ_PAGE_2_ITEMS;
    return ALL_SUKOON_MASHQ_WORDS;
  }, [selectedPage]);

  // Filter based on rule/tag and search
  const filteredWords = useMemo(() => {
    return pageWords.filter(item => {
      if (activeFilter === 'qalqalah' && !item.isQalqalah) return false;
      if (activeFilter === 'hamzah' && !item.isHamzahSakinah) return false;
      if (activeFilter === 'heavy' && !item.isHeavyLetterIncluded) return false;
      if (activeFilter === 'leen' && !item.tajweedRuleTitle.includes('لین')) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        return (
          item.word.includes(q) ||
          item.breakdown.includes(q) ||
          item.spellingHijja.includes(q) ||
          item.tajweedRuleTitle.includes(q)
        );
      }
      return true;
    });
  }, [pageWords, activeFilter, searchQuery]);

  // Render clean, authentic Arabic word as a single contiguous string with proper Tajweed color
  const renderColoredArabicWord = (item: SukoonMashqItem, customSizeClass: string = 'text-3xl sm:text-4xl') => {
    let colorClass = 'text-zinc-950';
    if (item.isQalqalah) {
      colorClass = 'text-rose-600';
    } else if (item.isHamzahSakinah) {
      colorClass = 'text-emerald-700';
    } else if (item.isHeavyLetterIncluded) {
      colorClass = 'text-sky-700';
    }

    return (
      <span
        dir="rtl"
        lang="ar"
        className={`${customSizeClass} font-black font-arabic tracking-normal ${colorClass} select-none block leading-tight text-center`}
      >
        {item.word}
      </span>
    );
  };

  const handleCardClick = (item: SukoonMashqItem) => {
    setSelectedDetailWord(item);
    onWordClick(item);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Color Code Guide Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-amber-500/50 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-500/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-zinc-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow">
                مشقِ کتاب - سبق نمبر ۴
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-amber-300">
                جامع مشق: سکون، قلقلہ اور ہمزہ ساکنہ (۶۰ کلمات)
              </h3>
            </div>
            <p className="text-xs text-amber-100/90 max-w-2xl leading-relaxed">
              اصل کتابی صفحات کے مطابق ترتیب دی گئی رنگین مشق۔ حروف کے رنگ دیکھ کر تلفظ کا صحیح طریقہ پہچانیں۔
            </p>
          </div>

          {/* Quick Play & Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onPlaySequence(filteredWords)}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isPlayingSequence
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 border border-amber-600'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-950" />}
              <span>{isPlayingSequence ? 'تلاوت روکیں' : 'پورے مشق کی تلاوت سنیں'}</span>
            </button>

            <button
              onClick={onGoToRules}
              className="px-3 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all"
              title="تجویدی قواعد دیکھیں"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">قواعد</span>
            </button>
          </div>
        </div>

        {/* Authentic Color Key Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          
          <div className="bg-white/10 rounded-2xl p-2.5 border border-rose-500/40 flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-rose-600 flex-shrink-0 shadow-md ring-2 ring-rose-300/40"></span>
            <div>
              <span className="font-black text-rose-400 block">سرخ رنگ (قلقلہ)</span>
              <span className="text-[10px] text-zinc-300">مخرج میں جنبش و گونج</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 border border-emerald-500/40 flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-emerald-600 flex-shrink-0 shadow-md ring-2 ring-emerald-300/40"></span>
            <div>
              <span className="font-black text-emerald-400 block">سبز رنگ (ہمزہ ساکنہ)</span>
              <span className="text-[10px] text-zinc-300">جھٹکے کے ساتھ پڑھیں</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 border border-sky-500/40 flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-sky-500 flex-shrink-0 shadow-md ring-2 ring-sky-300/40"></span>
            <div>
              <span className="font-black text-sky-400 block">نیلا رنگ (مستعلیہ)</span>
              <span className="text-[10px] text-zinc-300">پُر (موٹی آواز) سے ادا کریں</span>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 border border-zinc-500/40 flex items-center gap-2.5">
            <span className="w-4 h-4 rounded-full bg-zinc-400 flex-shrink-0 shadow-md"></span>
            <div>
              <span className="font-black text-zinc-200 block">سیاہ رنگ (عام حروف)</span>
              <span className="text-[10px] text-zinc-400">عام باریک ادائیگی</span>
            </div>
          </div>

        </div>
      </div>

      {/* Control Bar: Page Selector, Tajweed Filters, View Mode, Search */}
      <div className="bg-white border-2 border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
        
        {/* Top Row: Page Selector + View Mode */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          
          {/* Page Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            <span className="text-xs font-bold text-zinc-600 ml-1">حصہ کا انتخاب:</span>
            
            <button
              onClick={() => setSelectedPage('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedPage === 'all'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              مکمل مشق (۶۰ کلمات)
            </button>

            <button
              onClick={() => setSelectedPage('page1')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedPage === 'page1'
                  ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              مشق ۱ (۲۵ کلمات)
            </button>

            <button
              onClick={() => setSelectedPage('page2')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedPage === 'page2'
                  ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-400'
                  : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
              }`}
            >
              مشق ۲ (۳۵ کلمات)
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <span className="text-xs font-bold text-zinc-500 hidden sm:inline">اندازِ نمائش:</span>
            
            <div className="bg-zinc-100 p-1 rounded-xl border border-zinc-300 flex items-center gap-1">
              <button
                onClick={() => setViewMode('book_grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'book_grid'
                    ? 'bg-white text-emerald-950 shadow border border-zinc-300'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="کتابی بکس چارٹ (5 کالمز)"
              >
                <Grid className="w-3.5 h-3.5 text-emerald-700" />
                <span>کتابی چارٹ</span>
              </button>

              <button
                onClick={() => setViewMode('detailed_cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'detailed_cards'
                    ? 'bg-white text-emerald-950 shadow border border-zinc-300'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
                title="تفصیلی فلیش کارڈز مع ہجے"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-700" />
                <span>تفصیلی کارڈز</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Row: Tajweed Filters + Search Box */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Tajweed Attribute Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-xs font-bold text-zinc-500 ml-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              تجوید فلٹر:
            </span>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-zinc-900 text-white shadow'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              تمام ({pageWords.length})
            </button>

            <button
              onClick={() => setActiveFilter('qalqalah')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'qalqalah'
                  ? 'bg-rose-700 text-white shadow ring-2 ring-rose-400'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              <span>قلقلہ (سرخ)</span>
              <span className="text-[10px] opacity-80">
                ({pageWords.filter(w => w.isQalqalah).length})
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('hamzah')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'hamzah'
                  ? 'bg-emerald-700 text-white shadow ring-2 ring-emerald-400'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>ہمزہ ساکنہ (سبز)</span>
              <span className="text-[10px] opacity-80">
                ({pageWords.filter(w => w.isHamzahSakinah).length})
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('heavy')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'heavy'
                  ? 'bg-sky-700 text-white shadow ring-2 ring-sky-400'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-600"></span>
              <span>حروفِ مستعلیہ پُر (نیلا)</span>
              <span className="text-[10px] opacity-80">
                ({pageWords.filter(w => w.isHeavyLetterIncluded).length})
              </span>
            </button>

            <button
              onClick={() => setActiveFilter('leen')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeFilter === 'leen'
                  ? 'bg-purple-700 text-white shadow ring-2 ring-purple-400'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <span>حروفِ لین</span>
              <span className="text-[10px] opacity-80">
                ({pageWords.filter(w => w.tajweedRuleTitle.includes('لین')).length})
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-60">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="مشق کے کلمات تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-arabic"
            />
          </div>

        </div>

      </div>

      {/* =========================================================================
          VIEW MODE 1: AUTHENTIC BOOK GRID (5 COLUMNS FRAME LIKE THE QAIDA SHEET)
         ========================================================================= */}
      {viewMode === 'book_grid' && (
        <div className="space-y-6">
          
          {/* Page 1 Container (if active) */}
          {(selectedPage === 'all' || selectedPage === 'page1') && (
            <div className="bg-[#fffdfa] border-4 border-amber-600/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
              
              {/* Page 1 Header Banner */}
              <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-3 sm:p-4 text-center shadow-md flex items-center justify-between">
                <span className="text-xs bg-amber-900 text-amber-200 px-3 py-1 rounded-full font-bold">
                  مشق نمبر ۱
                </span>
                
                <h4 className="text-base sm:text-xl font-black tracking-wide">
                  مشقِ سکون و قلقلہ (۲۵ کلمات - ۲ و ۳ حرفی الفاظ)
                </h4>

                <span className="text-xs bg-amber-950 text-amber-300 px-3 py-1 rounded-full font-bold">
                  ۵ قطاریں × ۵ کالمز
                </span>
              </div>

              {/* 5-Columns Authentic Quranic Grid for Page 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
                {SUKOON_MASHQ_PAGE_1_ITEMS
                  .filter(item => filteredWords.some(fw => fw.id === item.id))
                  .map((item) => {
                    const isSelected = activeWordId === item.id;
                    const isDetailSelected = selectedDetailWord?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className={`bg-white border-2 rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-between relative min-h-[125px] sm:min-h-[140px] ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 ring-4 ring-amber-400 scale-105 shadow-2xl z-10'
                            : isDetailSelected
                              ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-400'
                              : 'border-amber-400/60 hover:border-amber-600'
                        }`}
                      >
                        {/* Top Indicator / Badge */}
                        <div className="w-full flex items-center justify-between text-[10px] font-bold">
                          {item.isQalqalah ? (
                            <span className="bg-rose-100 text-rose-900 border border-rose-300 px-1.5 py-0.5 rounded-md font-black flex items-center gap-0.5">
                              <span>قلقلہ</span>
                              <span className="text-rose-700">({item.qalqalahLetter})</span>
                            </span>
                          ) : item.isHeavyLetterIncluded ? (
                            <span className="bg-sky-100 text-sky-900 border border-sky-300 px-1.5 py-0.5 rounded-md font-black">
                              پُر حرف
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-medium">ساکن</span>
                          )}

                          <Volume2 className={`w-4 h-4 transition-all ${
                            isSelected ? 'text-amber-600 animate-bounce' : 'text-zinc-300 group-hover:text-zinc-600'
                          }`} />
                        </div>

                        {/* Large Colored Arabic Word */}
                        <div className="my-auto py-1">
                          {renderColoredArabicWord(item, 'text-3xl sm:text-4xl')}
                        </div>

                        {/* Word Breakdown & Hijja footer */}
                        <div className="w-full bg-amber-50/80 rounded-xl py-1 px-1.5 border border-amber-200/80 mt-1">
                          <div className="text-[11px] font-black text-amber-950 font-arabic truncate">
                            {item.breakdown}
                          </div>
                          <div className="text-[9px] text-zinc-600 truncate font-urdu">
                            {pronunciationMode === 'hijja' ? item.spellingHijja : item.tajweedRuleTitle}
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* Page 2 Container (if active) */}
          {(selectedPage === 'all' || selectedPage === 'page2') && (
            <div className="bg-[#fffdfa] border-4 border-teal-700/90 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
              
              {/* Page 2 Header Banner */}
              <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white rounded-2xl p-3 sm:p-4 text-center shadow-md flex items-center justify-between">
                <span className="text-xs bg-teal-950 text-teal-200 px-3 py-1 rounded-full font-bold">
                  مشق نمبر ۲
                </span>
                
                <h4 className="text-base sm:text-xl font-black tracking-wide">
                  مشقِ ہمزہ ساکنہ، قلقلہ و افعالِ قرآنی (۳۵ کلمات)
                </h4>

                <span className="text-xs bg-teal-950 text-amber-300 px-3 py-1 rounded-full font-bold">
                  ۷ قطاریں × ۵ کالمز
                </span>
              </div>

              {/* 5-Columns Authentic Quranic Grid for Page 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-3.5">
                {SUKOON_MASHQ_PAGE_2_ITEMS
                  .filter(item => filteredWords.some(fw => fw.id === item.id))
                  .map((item) => {
                    const isSelected = activeWordId === item.id;
                    const isDetailSelected = selectedDetailWord?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleCardClick(item)}
                        className={`bg-white border-2 rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex flex-col items-center justify-between relative min-h-[125px] sm:min-h-[140px] ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-400 scale-105 shadow-2xl z-10'
                            : isDetailSelected
                              ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-400'
                              : 'border-teal-400/60 hover:border-teal-600'
                        }`}
                      >
                        {/* Top Indicator / Badge */}
                        <div className="w-full flex items-center justify-between text-[10px] font-bold">
                          {item.isHamzahSakinah ? (
                            <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 px-1.5 py-0.5 rounded-md font-black flex items-center gap-0.5">
                              <span>ہمزہ جھٹکا</span>
                            </span>
                          ) : item.isQalqalah ? (
                            <span className="bg-rose-100 text-rose-900 border border-rose-300 px-1.5 py-0.5 rounded-md font-black flex items-center gap-0.5">
                              <span>قلقلہ</span>
                              <span className="text-rose-700">({item.qalqalahLetter})</span>
                            </span>
                          ) : item.isHeavyLetterIncluded ? (
                            <span className="bg-sky-100 text-sky-900 border border-sky-300 px-1.5 py-0.5 rounded-md font-black">
                              پُر حرف
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-medium">ساکن</span>
                          )}

                          <Volume2 className={`w-4 h-4 transition-all ${
                            isSelected ? 'text-teal-600 animate-bounce' : 'text-zinc-300'
                          }`} />
                        </div>

                        {/* Large Colored Arabic Word */}
                        <div className="my-auto py-1">
                          {renderColoredArabicWord(item, 'text-3xl sm:text-4xl')}
                        </div>

                        {/* Word Breakdown & Hijja footer */}
                        <div className="w-full bg-teal-50/80 rounded-xl py-1 px-1.5 border border-teal-200/80 mt-1">
                          <div className="text-[11px] font-black text-teal-950 font-arabic truncate">
                            {item.breakdown}
                          </div>
                          <div className="text-[9px] text-zinc-600 truncate font-urdu">
                            {pronunciationMode === 'hijja' ? item.spellingHijja : item.tajweedRuleTitle}
                          </div>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: DETAILED FLASHCARDS VIEW
         ========================================================================= */}
      {viewMode === 'detailed_cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWords.map((item) => {
            const isSelected = activeWordId === item.id;
            const isDetailSelected = selectedDetailWord?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className={`bg-white border-2 rounded-3xl p-5 cursor-pointer transition-all shadow-md hover:shadow-xl space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/80 ring-4 ring-amber-400 scale-105 shadow-2xl'
                    : isDetailSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-400'
                      : 'border-zinc-200 hover:border-amber-500'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="text-[11px] font-black bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200">
                    مشق {item.mashqPage} • قطار {item.rowNumber}
                  </span>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    item.isQalqalah
                      ? 'bg-rose-100 text-rose-900 border border-rose-300'
                      : item.isHamzahSakinah
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : item.isHeavyLetterIncluded
                          ? 'bg-sky-100 text-sky-900 border border-sky-300'
                          : 'bg-purple-100 text-purple-900 border border-purple-300'
                  }`}>
                    {item.tajweedRuleTitle}
                  </span>
                </div>

                {/* Main Word */}
                <div className="text-center py-2">
                  {renderColoredArabicWord(item, 'text-4xl sm:text-5xl')}
                </div>

                {/* Hijja & Breakdown Details */}
                <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200 space-y-1.5 text-right">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-bold">حروف کا جوڑ:</span>
                    <span className="font-black text-zinc-900 font-arabic text-sm">{item.breakdown}</span>
                  </div>
                  <div className="text-xs text-zinc-700 font-urdu leading-relaxed">
                    <strong className="text-emerald-800">ہجے:</strong> {item.spellingHijja}
                  </div>
                </div>

                {/* Sound Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(item);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-zinc-100 hover:bg-amber-100 text-zinc-800 border border-zinc-300'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>تلفظ سنیں ({pronunciationMode === 'rawani' ? 'روانی' : 'ہجے'})</span>
                </button>

              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          ACTIVE WORD TAJWEED INSPECTOR (WHEN A WORD IS CLICKED)
         ========================================================================= */}
      {selectedDetailWord && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-7 border-2 border-amber-500 shadow-2xl space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/20 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-amber-400 text-zinc-950 flex items-center justify-center font-black text-xl shadow">
                ✦
              </span>
              <div>
                <h4 className="text-lg sm:text-xl font-black text-amber-300">
                  تجویدی تفصیلی جائزہ: {selectedDetailWord.word}
                </h4>
                <p className="text-xs text-emerald-200">
                  {selectedDetailWord.categoryLabelUrdu} • {selectedDetailWord.tajweedRuleTitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => onWordClick(selectedDetailWord)}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              <Volume2 className="w-4 h-4 text-zinc-950" />
              <span>دوبارہ سنیں</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            
            {/* Box 1: Word and Breakdown */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-black text-amber-300 font-arabic">
                {selectedDetailWord.word}
              </div>
              <div className="text-xs text-emerald-200 font-black">
                حروف: {selectedDetailWord.breakdown}
              </div>
            </div>

            {/* Box 2: Hijja */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-1.5">
              <div className="text-xs text-amber-300 font-bold">ہجے کرنے کا طریقہ:</div>
              <p className="font-urdu text-sm sm:text-base text-white leading-relaxed font-bold">
                {selectedDetailWord.spellingHijja}
              </p>
            </div>

            {/* Box 3: Tajweed Rule */}
            <div className="bg-white/10 rounded-2xl p-4 border border-white/20 space-y-1.5">
              <div className="text-xs text-amber-300 font-bold">خاص تجویدی ہدایت:</div>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                {selectedDetailWord.isQalqalah
                  ? `اس کلمے میں حرفِ قلقلہ "${selectedDetailWord.qalqalahLetter}" ساکن ہے، لہٰذا اس کو پڑھتے وقت مخرج میں ہلکی جنبش دیں تاکہ آواز لوٹتی ہوئی محسوس ہو۔`
                  : selectedDetailWord.isHamzahSakinah
                    ? `اس کلمے میں ہمزہ ساکنہ ہے، اس کو نرمی کی بجائے واضح اور تیز جھٹکے کے ساتھ ادا کریں۔`
                    : selectedDetailWord.isHeavyLetterIncluded
                      ? `اس کلمے میں حرفِ مستعلیہ (${selectedDetailWord.heavyLetter || 'پُر حرف'}) ہے، اس کو موٹی اور بھاری آواز کے ساتھ ادا کریں۔`
                      : `سکون والا حرف اپنے سے پہلے متحرک حرف سے مل کر ادا ہوگا۔ آواز کو بغیر جھٹکے کے نرمی سے روکیں۔`}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Quick Test / Quiz Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-5 sm:p-6 border-2 border-purple-400 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg font-black text-2xl">
            🎯
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-purple-200">
              مشق کے کلمات کا تجویدی امتحان (کوئز)
            </h4>
            <p className="text-xs text-purple-300">
              قلقلہ اور ہمزہ ساکنہ کے کلمات پر مبنی انٹرایکٹو ٹیسٹ حل کر کے اپنا سکور چیک کریں۔
            </p>
          </div>
        </div>

        <button
          onClick={onGoToQuiz}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all border border-amber-500"
        >
          <HelpCircle className="w-4 h-4 text-zinc-950" />
          <span>امتحان شروع کریں ←</span>
        </button>
      </div>

    </div>
  );
};
