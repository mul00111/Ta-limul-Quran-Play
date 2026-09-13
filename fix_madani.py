import re

with open('src/components/MadaniQaidahBoard.tsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import { NunSakinTanweenLessonModal } from './NunSakinTanweenLessonModal';\nimport { MeemSakinLessonModal } from './MeemSakinLessonModal';"
content = content.replace("import { NunSakinTanweenLessonModal } from './NunSakinTanweenLessonModal';", import_stmt)

# Add state
state_stmt = "const [showNunSakin, setShowNunSakin] = useState(false);\n  const [showMeemSakin, setShowMeemSakin] = useState(false);"
content = content.replace("const [showNunSakin, setShowNunSakin] = useState(false);", state_stmt)

# Add component
comp_stmt = """      <NunSakinTanweenLessonModal 
        isOpen={showNunSakin} 
        onClose={() => setShowNunSakin(false)} 
      />
      <MeemSakinLessonModal 
        isOpen={showMeemSakin} 
        onClose={() => setShowMeemSakin(false)} 
      />"""
content = content.replace("""      <NunSakinTanweenLessonModal 
        isOpen={showNunSakin} 
        onClose={() => setShowNunSakin(false)} 
      />""", comp_stmt)

# Add lesson card. Let's find the NunSakin card.
nun_sakin_card_pattern = r"onClick:\s*\(\)\s*=>\s*setShowNunSakin\(true\)\s*\}"
match = re.search(nun_sakin_card_pattern, content)
if match:
    # Append Meem Sakin lesson
    meem_sakin_lesson = """,
    {
      id: "lesson11",
      number: "11",
      title: "میم ساکن کے قواعد",
      description: "ادغام، اخفائے اور اظہارِ شفوی",
      icon: <Brain className="w-8 h-8 text-white" />,
      color: "bg-gradient-to-br from-indigo-500 to-blue-600",
      onClick: () => setShowMeemSakin(true)
    }"""
    # Let's just insert it after the match
    content = content[:match.end()] + meem_sakin_lesson + content[match.end():]
    
    # Brain is not imported maybe, so import Brain
    brain_import = "Brain,"
    content = content.replace("BookOpen,", "BookOpen, Brain,")

with open('src/components/MadaniQaidahBoard.tsx', 'w') as f:
    f.write(content)

