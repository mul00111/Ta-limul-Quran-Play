import re

with open('src/components/MadaniQaidahBoard.tsx', 'r') as f:
    content = f.read()

# Add MeemSakinLessonModal import
if "import { MeemSakinLessonModal }" not in content:
    content = content.replace("import { NunSakinTanweenLessonModal } from './NunSakinTanweenLessonModal';", "import { NunSakinTanweenLessonModal } from './NunSakinTanweenLessonModal';\nimport { MeemSakinLessonModal } from './MeemSakinLessonModal';")

# Add Tab
tab_pattern = r"(<button[^>]+>\s*<Sparkles className=\"w-4 h-4 text-cyan-300\" />\s*<span>سبق ۱۰: نون ساکن</span>\s*</button>)"
match = re.search(tab_pattern, content)
if match:
    tab_html = """
          <button
            onClick={() => setActiveLesson('meem_sakin')}
            className={`py-2 px-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeLesson === 'meem_sakin'
                ? 'bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 text-zinc-950 shadow-lg scale-[1.01] ring-2 ring-blue-300'
                : 'text-blue-300/80 hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>سبق ۱۱: میم ساکن</span>
          </button>"""
    if "سبق ۱۱: میم ساکن" not in content:
        content = content[:match.end()] + tab_html + content[match.end():]

# Add component rendering
render_pattern = r"({\/\* RENDER LESSON 10.*?}\))"
match = re.search(render_pattern, content, re.DOTALL)
if match:
    render_html = """
        {/* RENDER LESSON 11 (MEEM SAKIN RULES) IF SELECTED */}
        {activeLesson === 'meem_sakin' && (
          <MeemSakinLessonModal onBack={() => setActiveLesson('mufradat')} onOpenGamesHub={() => setShowQaidaGamesModal(true)} />
        )}
"""
    if "RENDER LESSON 11" not in content:
        content = content[:match.end()] + render_html + content[match.end():]

# In QaidaGamesModal.tsx, add MeemSakinGame
with open('src/components/QaidaGamesModal.tsx', 'r') as f:
    games_content = f.read()

if "import { MeemSakinGameModal }" not in games_content:
    games_content = games_content.replace("import { NunSakinTanweenGameModal } from './NunSakinTanweenGameModal';", "import { NunSakinTanweenGameModal } from './NunSakinTanweenGameModal';\nimport { MeemSakinGameModal } from './MeemSakinGameModal';")
    games_content = games_content.replace("'nunSakinTanween' |", "'nunSakinTanween' | 'meemSakin' |")
    
    card_pattern = r"({\s*id:\s*'nunSakinTanween'\s*as\s*const,.*?},)"
    match_card = re.search(card_pattern, games_content, re.DOTALL)
    if match_card:
        meem_card = """
    {
      id: 'meemSakin' as const,
      title: 'میم ساکن گیم',
      description: 'ادغام، اخفاء، اور اظہارِ شفوی کی پہچان',
      icon: <Layers className="w-8 h-8 text-white" />,
      color: 'bg-indigo-500',
      shadow: 'shadow-indigo-200'
    },"""
        games_content = games_content[:match_card.end()] + meem_card + games_content[match_card.end():]
        
    render_game_pattern = r"(<NunSakinTanweenGameModal.*?/>)"
    match_render = re.search(render_game_pattern, games_content, re.DOTALL)
    if match_render:
        meem_render = """
      <MeemSakinGameModal 
        isOpen={activeGame === 'meemSakin'} 
        onClose={() => setActiveGame(null)} 
      />"""
        games_content = games_content[:match_render.end()] + meem_render + games_content[match_render.end():]

with open('src/components/MadaniQaidahBoard.tsx', 'w') as f:
    f.write(content)

with open('src/components/QaidaGamesModal.tsx', 'w') as f:
    f.write(games_content)

