import re

with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    content = f.read()

content = content.replace("isOpen: boolean;\n  onClose: () => void;", "onBack: () => void;\n  onOpenGamesHub?: () => void;")
content = content.replace("export function MeemSakinLessonModal({ isOpen, onClose }: MeemSakinLessonModalProps) {", "export function MeemSakinLessonModal({ onBack, onOpenGamesHub }: MeemSakinLessonModalProps) {")

content = content.replace("if (!isOpen) return null;", "")

# Replace the modal fixed wrapper with the inline wrapper
# We will use regex to find `<div className="fixed inset-0` and replace it
inline_wrapper = '<div className="bg-[#fcfaf5] border-4 border-emerald-600/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">'

content = re.sub(r'<div className="fixed inset-0.*?backdrop-blur-sm[^>]*>', '', content)
content = re.sub(r'<motion\.div[^>]*className="bg-white rounded-2xl w-full max-w-5xl h-\[85vh\][^"]*"[^>]*>', inline_wrapper, content)
content = content.replace('className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex justify-between items-center relative overflow-hidden"', 'className="flex flex-col sm:flex-row items-center justify-between gap-4"')
content = content.replace('<div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32 pointer-events-none"></div>', '')

header_replacement = """          <div className="inline-block px-8 py-2 rounded-full bg-emerald-700 text-white font-black text-base sm:text-lg shadow-lg border-2 border-emerald-500">
            سبق ۱۱: میم ساکن کے قواعد
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              واپس
            </button>
            <button
              onClick={onOpenGamesHub}
              className="px-5 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md shadow-emerald-200 flex items-center gap-2 border-2 border-emerald-400"
            >
              <Gamepad2 className="w-4 h-4" />
              گیم کھیلیں
            </button>
          </div>"""

# Remove the old header content and button onClose
content = re.sub(r'<div>\s*<h2.*?<p.*?</div>\s*<button.*?<X className="w-6 h-6" />\s*</button>', header_replacement, content, flags=re.DOTALL)

# Add Gamepad2, ArrowRight to lucide-react imports
if "Gamepad2" not in content:
    content = content.replace("Info } from 'lucide-react'", "Info, Gamepad2, ArrowRight } from 'lucide-react'")

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.write(content)
