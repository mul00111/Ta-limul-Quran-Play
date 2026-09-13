import re

with open('src/components/QaidaGamesModal.tsx', 'r') as f:
    content = f.read()

tashdeed_block_old = """        {/* GAME MODE 2G: TASHDEED GAME ZONE (سبق ۹) */}
        {activeTab === 'tashdeed' && (
          <div className="space-y-4">
            <TashdeedGameModal
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}"""

tashdeed_block_new = """        {/* GAME MODE 2G: TASHDEED GAME ZONE (سبق ۹) */}
        {activeTab === 'tashdeed' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-amber-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-amber-400/50"
              >
                <span>🎯 تشدید گیم زون</span>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
            </div>
            
            <TashdeedGameModal
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}"""

content = content.replace(tashdeed_block_old, tashdeed_block_new)

with open('src/components/QaidaGamesModal.tsx', 'w') as f:
    f.write(content)
