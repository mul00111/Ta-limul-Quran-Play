import re

with open('src/components/TashdeedLessonModal.tsx', 'r') as f:
    content = f.read()

# Replace the bulky grid navigation tabs with the standard compact flex tabs
old_tabs = r"""      \{/\* NAVIGATION TABS \*/\}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-zinc-900/90 border border-emerald-500/30 p-2 rounded-2xl shadow-lg">.*?</div>"""

new_tabs = """      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/10 p-2 rounded-2xl border border-emerald-600/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Rules */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>قواعد و تجوید</span>
          </button>
          
          {/* Tab 2: Basic */}
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'basic'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>بنیادی تختی</span>
          </button>

          {/* Tab 3: Ghunnah */}
          <button
            onClick={() => setActiveTab('ghunnah')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'ghunnah'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>غنہ (نّ / مّ)</span>
          </button>

          {/* Tab 4: Qalqalah */}
          <button
            onClick={() => setActiveTab('qalqalah')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'qalqalah'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>قلقلہ بالتشدید</span>
          </button>

          {/* Tab 5: Words */}
          <button
            onClick={() => setActiveTab('words')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'words'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Music className="w-4 h-4 text-amber-400" />
            <span>مشق کلمات</span>
          </button>

          {/* Tab 6: Exam */}
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-zinc-700 hover:bg-amber-50 border border-zinc-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>امتحان</span>
          </button>
        </div>
      </div>"""

content = re.sub(old_tabs, new_tabs, content, flags=re.DOTALL)

with open('src/components/TashdeedLessonModal.tsx', 'w') as f:
    f.write(content)

