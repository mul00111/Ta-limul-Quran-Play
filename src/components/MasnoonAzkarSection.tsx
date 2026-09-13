import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  Search, 
  BookOpen, 
  Shield, 
  Star, 
  Bookmark, 
  ZoomIn, 
  ZoomOut,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { MASNOON_DUAS_LIST, MASNOON_CATEGORIES, MasnoonDuaItem } from '../data/masnoonDuasData';
import { playRoboticWordByWord, stopAllQariAudio } from '../utils/qariAudioService';

interface MasnoonAzkarSectionProps {
  onBackToHub?: () => void;
}

export const MasnoonAzkarSection: React.FC<MasnoonAzkarSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('morning_evening');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'evening'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [arabicFontSize, setArabicFontSize] = useState<number>(26); // in px
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [tasbihCounts, setTasbihCounts] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('fav_masnoon_azkar');
      return saved ? JSON.parse(saved) : { 'azkar-ayat-kursi': true, 'azkar-bismillah-illadhi': true };
    } catch {
      return { 'azkar-ayat-kursi': true };
    }
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('fav_masnoon_azkar', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleIncrementTasbih = (id: string, targetCount: number) => {
    setTasbihCounts(prev => {
      const current = prev[id] || 0;
      if (current >= targetCount) {
        return { ...prev, [id]: targetCount };
      }
      const next = current + 1;
      // Provide subtle vibration feedback if supported
      if ('vibrate' in navigator) {
        navigator.vibrate(next === targetCount ? [40, 60, 40] : 30);
      }
      return { ...prev, [id]: next };
    });
  };

  const handleResetTasbih = (id: string) => {
    setTasbihCounts(prev => ({ ...prev, [id]: 0 }));
  };

  const handleCopy = (item: MasnoonDuaItem) => {
    const textToCopy = `${item.title}\n\n${item.arabic}\n\nترجمہ:\n${item.translation}\n\nفضیلت و فائدہ: ${item.benefit || ''}\nحوالہ: ${item.reference || ''}\n(تعلیم القرآن پلے - مسنون دعائیں)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handlePlayAudio = (item: MasnoonDuaItem) => {
    // If already playing this item, stop it
    if (playingId === item.id) {
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
      stopAllQariAudio();
      setPlayingId(null);
      return;
    }

    // Stop current audio if playing
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }
    stopAllQariAudio();

    setPlayingId(item.id);

    // Play with robotic voice word-by-word
    playRoboticWordByWord(item.arabic, () => {
      setPlayingId(null);
      setAudioElement(null);
    });
  };

  // Filtered List
  const filteredDuas = useMemo(() => {
    return MASNOON_DUAS_LIST.filter(item => {
      // Time filter (morning / evening / all)
      if (timeFilter === 'morning') {
        if (item.timeTag !== 'morning' && item.timeTag !== 'both') return false;
      } else if (timeFilter === 'evening') {
        if (item.timeTag !== 'evening' && item.timeTag !== 'both') return false;
      } else {
        // When timeFilter is 'all', filter by selected category
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchArabic = item.arabic.toLowerCase().includes(query);
        const matchTranslation = item.translation.toLowerCase().includes(query);
        const matchOccasion = item.occasion.toLowerCase().includes(query);
        const matchCategory = item.categoryLabelUrdu.toLowerCase().includes(query);
        return matchTitle || matchArabic || matchTranslation || matchOccasion || matchCategory;
      }

      return true;
    });
  }, [selectedCategory, timeFilter, searchQuery]);

  return (
    <div className="space-y-6 text-slate-100 font-urdu" dir="rtl">
      {/* =========================================================
          HERO BANNER: TOP LUXURY ISLAMIC EMERALD & GOLD DESIGN
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241c] via-[#093529] to-[#041510] border-2 border-amber-500/40 p-5 sm:p-7 shadow-2xl shadow-emerald-950/60">
        {/* Ornate Background Geometry / Patterns */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Traditional Islamic Bismillah Badge */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>مفتاح الدین • مسنون دعائیں مع صبح و شام کے اذکار</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </div>

          <div className="font-arabic text-xl sm:text-2xl text-amber-200/90 py-1 font-bold select-none">
            بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wide drop-shadow-md">
            صبح و شام کے مسنون اذکار و دعائیں
          </h2>

          <p className="text-emerald-200/80 text-xs sm:text-sm max-w-2xl leading-relaxed pt-1">
            مستند احادیث مبارکہ کی روشنی میں صبح و شام، روزمرہ اور عبادات کی حفاظت والی مسنون دعائیں مع خوبصورت عربی اعراب، اردو ترجمہ، فضائل اور تکرار کاؤنٹر۔
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-xl pt-4">
            <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-2xl p-2.5 text-center">
              <div className="text-amber-300 text-base sm:text-lg font-black">{MASNOON_DUAS_LIST.length}</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">کل مستند دعائیں</div>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-2xl p-2.5 text-center">
              <div className="text-amber-300 text-base sm:text-lg font-black">11</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">صبح و شام کے اذکار</div>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-2xl p-2.5 text-center">
              <div className="text-amber-300 text-base sm:text-lg font-black">7</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">مستقل ابواب و کیٹیگریز</div>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-600/30 rounded-2xl p-2.5 text-center">
              <div className="text-amber-300 text-base sm:text-lg font-black">100%</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">مکمل اعراب و ترجمہ</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTROLS BAR: SEARCH, TIME TOGGLES & FONT ZOOM
      ========================================================= */}
      <div className="bg-[#0b1f1a] border border-emerald-900/80 rounded-2xl p-3 sm:p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="کسی بھی دعا، موقع یا فضیلت کو تلاش کریں... (مثلاً: صبح، کھانا، سفر، آیت الکرسی)"
              className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-emerald-700/40 rounded-xl text-white placeholder-emerald-400/50 text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs bg-zinc-800 px-1.5 py-0.5 rounded cursor-pointer"
              >
                صاف کریں
              </button>
            )}
          </div>

          {/* Time Filter Pills (صبح / شام / سبھی) */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-emerald-900/80">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              تمام اوقات
            </button>
            <button
              onClick={() => setTimeFilter('morning')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                timeFilter === 'morning'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-amber-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span>صبح کے اذکار</span>
            </button>
            <button
              onClick={() => setTimeFilter('evening')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                timeFilter === 'evening'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-indigo-300'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-300" />
              <span>شام کے اذکار</span>
            </button>
          </div>

          {/* Font Zoom Scaler */}
          <div className="flex items-center justify-end gap-2 text-xs text-emerald-300/80 bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-900/80">
            <span className="font-medium text-[11px]">عربی خط:</span>
            <button
              onClick={() => setArabicFontSize(prev => Math.max(20, prev - 2))}
              className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors cursor-pointer"
              title="فونٹ چھوٹا کریں"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-amber-300 font-bold px-1">{arabicFontSize}px</span>
            <button
              onClick={() => setArabicFontSize(prev => Math.min(42, prev + 2))}
              className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-900 text-emerald-300 transition-colors cursor-pointer"
              title="فونٹ بڑا کریں"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Categories Carousel / Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 scrollbar-thin scrollbar-thumb-emerald-800">
          {MASNOON_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id && timeFilter === 'all';
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setTimeFilter('all');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300/60 shadow-lg scale-[1.02]'
                    : 'bg-zinc-900/90 text-zinc-300 hover:text-white border-zinc-800 hover:border-emerald-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.labelUrdu}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          DUAS LISTING: LUXURY ISLAMIC CARDS
      ========================================================= */}
      {filteredDuas.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-[#0b1f1a] border border-emerald-900/60 text-zinc-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-emerald-600/60" />
          <p className="text-base font-bold text-zinc-300">کوئی مسنون دعا نہیں ملی</p>
          <p className="text-xs text-zinc-400">براہ کرم سرچ کے الفاظ بدل کر دوبارہ کوشش کریں یا کیٹیگری تبدیل کریں۔</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setTimeFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            تمام دعائیں دکھائیں
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredDuas.map((item, index) => {
            const currentCount = tasbihCounts[item.id] || 0;
            const isCompleted = currentCount >= item.targetCount;
            const isPlaying = playingId === item.id;
            const isCopied = copiedId === item.id;
            const isFav = !!favorites[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                className={`relative rounded-3xl p-5 sm:p-6 border transition-all duration-300 overflow-hidden shadow-xl ${
                  isCompleted
                    ? 'bg-gradient-to-b from-[#082b21] to-[#041913] border-emerald-500/50 shadow-emerald-950/70'
                    : 'bg-gradient-to-b from-[#0b241e] via-[#081d18] to-[#05130f] border-amber-500/25 hover:border-amber-400/40 shadow-black/60'
                }`}
              >
                {/* Decorative Top Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

                {/* Card Header: Title, Category Badge, Timing & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/60 pb-3.5 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-black text-xs shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-emerald-300/80">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-medium">{item.occasion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Target Count Pill */}
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                      {item.targetCount} مرتبہ
                    </span>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                        isFav 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                          : 'bg-black/30 text-zinc-400 border-zinc-800 hover:text-amber-300'
                      }`}
                      title={isFav ? 'پسندیدہ سے ہٹائیں' : 'پسندیدہ میں شامل کریں'}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Arabic Calligraphy Display with High-Contrast Golden Styling */}
                <div 
                  style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2.1 }}
                  className="font-arabic font-bold text-amber-100 text-right leading-loose py-3 px-3 sm:px-4 rounded-2xl bg-black/30 border border-amber-500/15 tracking-wide select-all selection:bg-amber-500/40"
                  dir="rtl"
                >
                  {item.arabic}
                </div>

                {/* Urdu Translation Box */}
                <div className="mt-4 p-4 rounded-2xl bg-[#061914]/80 border border-emerald-800/40 space-y-2 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-300 shrink-0 text-xs sm:text-sm">ترجمہ:</span>
                    <p className="whitespace-pre-line">{item.translation}</p>
                  </div>

                  {item.benefit && (
                    <div className="flex items-start gap-2 pt-2 border-t border-emerald-900/60 text-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300">فضیلت و فائدہ: </strong>
                        <span>{item.benefit}</span>
                      </div>
                    </div>
                  )}

                  {item.reference && (
                    <div className="text-[11px] text-emerald-400/80 pt-1 text-left" dir="ltr">
                      <span className="bg-emerald-950/90 border border-emerald-800/60 px-2 py-0.5 rounded-md font-sans">
                        حوالہ: {item.reference}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer: Tasbeeh Counter, Audio & Copy */}
                <div className="mt-4 pt-3 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-3">
                  {/* Tasbeeh Counter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleIncrementTasbih(item.id, item.targetCount)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-900/50'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border border-amber-300 shadow-amber-950/50'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>مکمل ہو گیا ({currentCount}/{item.targetCount})</span>
                        </>
                      ) : (
                        <>
                          <Compass className="w-4 h-4 text-slate-950" />
                          <span>تکرار کاؤنٹر: {currentCount} / {item.targetCount}</span>
                        </>
                      )}
                    </button>

                    {currentCount > 0 && (
                      <button
                        onClick={() => handleResetTasbih(item.id)}
                        className="p-2 rounded-xl bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                        title="کاؤنٹر ری سیٹ کریں"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Audio & Copy Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Audio Play/Stop */}
                    <button
                      onClick={() => handlePlayAudio(item)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                        isPlaying
                          ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                          : 'bg-[#09261f] hover:bg-[#0d362c] text-amber-200 border-emerald-700/50 hover:border-amber-400/50'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-4 h-4 text-white" />
                          <span>بند کریں</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-amber-400" />
                          <span>تلاوت سنیں</span>
                        </>
                      )}
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(item)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-700 text-white border-emerald-500'
                          : 'bg-black/40 hover:bg-black/60 text-zinc-300 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>کاپی ہو گئی!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>کاپی</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Footer reference notice */}
      <div className="text-center py-4 text-xs text-emerald-400/70 border-t border-emerald-900/60 space-y-1">
        <p>تمام دعائیں مفتاح الدین / کتاب مسنون دعائیں اور معتبر کتبِ احادیث سے ماخوذ ہیں</p>
        <p className="text-[11px] text-zinc-500">اللہ تعالیٰ ہم سب کو صبح و شام کے مسنون اذکار کی پابندی اور برکات نصیب فرمائے۔ آمین</p>
      </div>
    </div>
  );
};
