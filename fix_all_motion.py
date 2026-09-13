import re

with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    content = f.read()

# Animate presence child
content = re.sub(
    r'(<motion\.div[^>]*className="overflow-hidden"[^>]*>.*?)\s*</div>\s*(?:)}\s*</AnimatePresence>)',
    r'\1\n              </motion.div>\n            )}\n          </AnimatePresence>',
    content,
    flags=re.DOTALL
)

# selectedWord child
content = re.sub(
    r'(<motion\.div[^>]*className="w-full"[^>]*>.*?)\s*</div>\s*(?:\)\s*:\s*\(\s*<div className="h-full)',
    r'\1\n              </motion.div>\n            ) : (\n              <div className="h-full',
    content,
    flags=re.DOTALL
)

# And words map child is motion.button, let's make sure it closes properly
# Actually it closes with </motion.button>, let's check if it was changed to </div>
# I didn't change motion.button.

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.write(content)
