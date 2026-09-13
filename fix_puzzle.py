import re

with open('src/components/MurakkabatPuzzleGameModal.tsx', 'r') as f:
    content = f.read()

# 1. Add the Tashdeed Tab Button
tab_button = """          {/* 7. KHARI HARAKAT (سبق ۷) */}
          <button
            onClick={() => setActiveMode('khari_harakat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'khari_harakat'
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-zinc-950 ring-2 ring-emerald-300 scale-[1.02] shadow-lg shadow-emerald-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'khari_harakat' ? 'text-zinc-950' : 'text-emerald-400'}`} />
              <span>۷. کھڑی حرکات</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'khari_harakat' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              کھڑا زبر، زیر، الٹا پیش
            </span>
          </button>

          {/* 8. TASHDEED (سبق ۹) */}
          <button
            onClick={() => setActiveMode('tashdeed')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'tashdeed'
                ? 'bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 ring-2 ring-amber-300 scale-[1.02] shadow-lg shadow-amber-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'tashdeed' ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>۸. تشدید و غنہ</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'tashdeed' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              مشدد کلمات
            </span>
          </button>"""

content = re.sub(r"\{\/\* 6\. KHARI HARAKAT.*?<\/button>", tab_button, content, flags=re.DOTALL)

# Also fix the grid-cols count from 8 to 9
content = content.replace('lg:grid-cols-8 gap-2 bg-zinc-900', 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-zinc-900')


# 2. Add the Tashdeed Game Board Section
tashdeed_board = """          {activeMode === 'tashdeed' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentTashdeedItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۹: تشدید اور غنہ کی مقناطیسی مشق (کُل {TASHDEED_ITEMS.length} کلمات)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={prevTashdeedItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30">
                    پچھلا
                  </button>
                  <span className="text-xs font-bold text-amber-400">
                    {tashdeedIndex + 1} / {TASHDEED_ITEMS.length}
                  </span>
                  <button onClick={nextTashdeedItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30">
                    اگلا
                  </button>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-slate-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentTashdeedItem.words.map((_, idx) => {
                      const isFilled = tashdeedSlots[idx] !== null;
                      return (
                        <div
                          key={`slot-${idx}`}
                          onClick={() => handleTashdeedSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-4xl sm:text-5xl font-black transition-all cursor-pointer relative ${
                            isFilled
                              ? tashdeedCompleted
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105'
                                : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : tashdeedSelectedId
                                ? 'border-amber-400 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? tashdeedSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {tashdeedTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleTashdeedTileClick(tile.id)}
                        disabled={tile.isUsed || tashdeedCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : tashdeedSelectedId === tile.id
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {tashdeedCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-emerald-950/90 border-4 border-emerald-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(16,185,129,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-emerald-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-emerald-200 font-bold">آپ نے درست لفظ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-amber-400 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMode === 'surahs' && ("""

content = content.replace("{activeMode === 'surahs' && (", tashdeed_board)

# We need to make sure handleReset runs when activeMode changes. Oh wait, it does!

with open('src/components/MurakkabatPuzzleGameModal.tsx', 'w') as f:
    f.write(content)
