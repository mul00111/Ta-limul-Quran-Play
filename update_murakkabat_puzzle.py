import re

with open('src/components/MurakkabatPuzzleGameModal.tsx', 'r') as f:
    content = f.read()

# 1. Add tashdeed to GameMainMode
content = content.replace("'khari_harakat' | 'surahs';", "'khari_harakat' | 'tashdeed' | 'surahs';")

# 2. Add Tashdeed Tab button in the Nav menu
tashdeed_tab = """
          {/* 7. TASHDEED (سبق ۹) */}
          <div className="relative group shrink-0">
            <button
              onClick={() => setActiveMode('tashdeed')}
              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 min-w-[70px] ${
                activeMode === 'tashdeed'
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  : 'bg-zinc-900/60 border-zinc-700/50 hover:bg-zinc-800'
              }`}
            >
              <div className={`p-2 rounded-xl bg-gradient-to-br shadow-inner ${activeMode === 'tashdeed' ? 'from-amber-400 to-yellow-500' : 'from-zinc-700 to-zinc-800'}`}>
                <Layers className={`w-3.5 h-3.5 ${activeMode === 'tashdeed' ? 'text-zinc-950' : 'text-amber-400'}`} />
              </div>
              <span className={`text-[9px] ${activeMode === 'tashdeed' ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
                تشدید
              </span>
            </button>
            {activeMode === 'tashdeed' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-amber-400 rounded-t-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
            )}
          </div>
"""
# find the surahs tab and insert before it
content = content.replace("{/* 7. SURAHS (سورتیں) */}", tashdeed_tab + "\n          {/* 8. SURAHS (سورتیں) */}")

# 3. Add Tashdeed puzzle logic (We will just alias it or reuse the sukoon state for simplicity, or create separate state. To be safe, we will create separate state).
tashdeed_state = """
  // =========================================================================
  // 7. TASHDEED PUZZLE DATA & STATE (تشدید)
  // =========================================================================
  const [tashdeedIndex, setTashdeedIndex] = useState(0);
  const [tashdeedSlots, setTashdeedSlots] = useState<(string | null)[]>([]);
  const [tashdeedTileBank, setTashdeedTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [tashdeedSelectedId, setTashdeedSelectedId] = useState<string | null>(null);
  const [tashdeedCompleted, setTashdeedCompleted] = useState(false);
  
  const TASHDEED_ITEMS: GenericPuzzleItem[] = useMemo(() => [
    { id: 't1', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'اَبَّ', arabicPhrase: 'اَبَّ', words: ['اَ', 'بَّ'], isQalqalah: true },
    { id: 't2', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'اِنَّ', arabicPhrase: 'اِنَّ', words: ['اِ', 'نَّ'] },
    { id: 't3', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'عَمَّ', arabicPhrase: 'عَمَّ', words: ['عَ', 'مَّ'] },
    { id: 't4', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'ثُمَّ', arabicPhrase: 'ثُمَّ', words: ['ثُ', 'مَّ'] },
    { id: 't5', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'يَظُنُّ', arabicPhrase: 'يَظُنُّ', words: ['يَ', 'ظُ', 'نُّ'] },
    { id: 't6', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'جَنَّتِ', arabicPhrase: 'جَنَّتِ', words: ['جَ', 'نَّ', 'تِ'] },
    { id: 't7', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'سَيِّدِ', arabicPhrase: 'سَيِّدِ', words: ['سَ', 'يِّ', 'دِ'] },
    { id: 't8', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'مُحَمَّدٍ', arabicPhrase: 'مُحَمَّدٍ', words: ['مُ', 'حَ', 'مَّ', 'دٍ'] },
    { id: 't9', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'يُزَكِّي', arabicPhrase: 'يُزَكِّي', words: ['يُ', 'زَ', 'كِّ', 'ي'] },
    { id: 't10', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'فَضَّلَ', arabicPhrase: 'فَضَّلَ', words: ['فَ', 'ضَّ', 'لَ'] }
  ], []);

  const currentTashdeedItem = TASHDEED_ITEMS[tashdeedIndex] || TASHDEED_ITEMS[0];

  const initTashdeedPuzzle = () => {
    if (!currentTashdeedItem) return;
    setTashdeedCompleted(false);
    const correctWords = currentTashdeedItem.words;
    setTashdeedSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['رَّ', 'سُّ', 'جِّ', 'كَ', 'يْ', 'قُ', 'مَّ', 'نِّ', 'وَّ', 'بِّ'];
    const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());
    
    const tiles = shuffled.map((word, idx) => ({ id: `tashdeed-${idx}`, text: word, isUsed: false }));
    setTashdeedTileBank(tiles);
    setTashdeedSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'tashdeed') initTashdeedPuzzle();
  }, [tashdeedIndex, activeMode]);

  const handleTashdeedTileClick = (tileId: string) => {
    const tile = tashdeedTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setTashdeedSelectedId(tashdeedSelectedId === tileId ? null : tileId);
  };

  const handleTashdeedSlotClick = (slotIdx: number) => {
    if (tashdeedSlots[slotIdx] !== null) {
      const wordToRemove = tashdeedSlots[slotIdx];
      const newSlots = [...tashdeedSlots];
      newSlots[slotIdx] = null;
      setTashdeedSlots(newSlots);
      setTashdeedTileBank(tashdeedTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (tashdeedSelectedId) {
      const tile = tashdeedTileBank.find((t) => t.id === tashdeedSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...tashdeedSlots];
      newSlots[slotIdx] = tile.text;
      setTashdeedSlots(newSlots);
      setTashdeedTileBank(tashdeedTileBank.map((t) => (t.id === tashdeedSelectedId ? { ...t, isUsed: true } : t)));
      setTashdeedSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentTashdeedItem.words[idx]);
        if (isCorrect) {
          setTashdeedCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect();
          setTimeout(() => speakText(currentTashdeedItem.arabicPhrase), 1000);
        } else {
          playUrduText('دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextTashdeedItem = () => {
    if (tashdeedIndex < TASHDEED_ITEMS.length - 1) setTashdeedIndex(tashdeedIndex + 1);
    else setTashdeedIndex(0);
  };

  const prevTashdeedItem = () => {
    if (tashdeedIndex > 0) setTashdeedIndex(tashdeedIndex - 1);
    else setTashdeedIndex(TASHDEED_ITEMS.length - 1);
  };
"""
# insert state before "const speakText ="
content = content.replace("  const speakText = (text: string) => {", tashdeed_state + "\n  const speakText = (text: string) => {")

tashdeed_ui = """
          {/* MODE 7: TASHDEED */}
          {activeMode === 'tashdeed' && (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/60 border border-amber-500/30">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 text-xs font-bold">تشدید کی مقناطیسی مشق (کُل {TASHDEED_ITEMS.length} کلمات)</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={prevTashdeedItem} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <h2 className="text-3xl sm:text-5xl font-black text-amber-400 py-2">{currentTashdeedItem.arabicPhrase}</h2>
                  <button onClick={nextTashdeedItem} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
                <button onClick={() => speakText(currentTashdeedItem.arabicPhrase)} className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-110">
                  <Volume2 className="w-6 h-6 animate-pulse" />
                </button>
              </div>

              {/* TASHDEED TARGET SLOTS */}
              <div className="flex flex-col items-center justify-center gap-4">
                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">حروف ملا کر کلمہ مکمل کریں (دائیں سے بائیں)</span>
                <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4 p-4 sm:p-6 bg-slate-900/50 rounded-3xl border border-slate-800/80 min-h-[120px] w-full max-w-3xl" dir="rtl">
                  {tashdeedSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleTashdeedSlotClick(idx)}
                      className={`w-14 h-16 sm:w-20 sm:h-24 rounded-2xl border-2 flex items-center justify-center text-2xl sm:text-4xl font-bold cursor-pointer transition-all ${
                        word
                          ? tashdeedCompleted
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] scale-105'
                            : 'bg-zinc-800 border-amber-400/50 text-amber-300 shadow-lg'
                          : tashdeedSelectedId
                          ? 'bg-zinc-900 border-dashed border-amber-500/40 hover:bg-zinc-800 hover:border-amber-400 animate-pulse'
                          : 'bg-zinc-900/80 border-dashed border-slate-700 text-slate-600 hover:bg-zinc-800'
                      }`}
                    >
                      {word || (idx + 1)}
                    </div>
                  ))}
                </div>

                {tashdeedCompleted && (
                  <div className="animate-in zoom-in slide-in-from-bottom-4 duration-500 flex flex-col items-center gap-4 mt-2">
                    <div className="px-6 py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-300 font-black text-sm">ماشاءاللہ! بالکل صحیح</span>
                    </div>
                    <button
                      onClick={nextTashdeedItem}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black shadow-xl hover:shadow-emerald-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>اگلا کلمہ بنائیں</span>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* TASHDEED TILE TRAY */}
              {!tashdeedCompleted && (
                <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between w-full max-w-2xl px-4">
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5"><Puzzle className="w-4 h-4" /> مقناطیسی حروف (نیچے سے منتخب کریں)</span>
                    <button onClick={initTashdeedPuzzle} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"><RotateCcw className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl" dir="rtl">
                    {tashdeedTileBank.map((tile) => {
                      const isSelected = tashdeedSelectedId === tile.id;
                      return (
                        <button
                          key={tile.id}
                          onClick={() => handleTashdeedTileClick(tile.id)}
                          disabled={tile.isUsed}
                          className={`w-14 h-16 sm:w-20 sm:h-24 rounded-2xl border-b-4 flex items-center justify-center text-2xl sm:text-4xl font-bold transition-all ${
                            tile.isUsed
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-700 opacity-40 cursor-not-allowed scale-95'
                              : isSelected
                              ? 'bg-amber-400 border-amber-600 text-zinc-950 scale-110 shadow-[0_10px_30px_rgba(251,191,36,0.4)] -translate-y-2'
                              : 'bg-zinc-800 border-zinc-950 text-amber-400 hover:bg-zinc-700 hover:-translate-y-1 hover:shadow-lg cursor-grab active:cursor-grabbing'
                          }`}
                        >
                          {tile.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
"""
# find surahs mode UI and insert before it
content = content.replace("{/* MODE 8: SURAHS (قرآنی سورتیں) */}", tashdeed_ui + "\n          {/* MODE 8: SURAHS (قرآنی سورتیں) */}")

with open('src/components/MurakkabatPuzzleGameModal.tsx', 'w') as f:
    f.write(content)
