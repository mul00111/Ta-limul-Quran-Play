import re
with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    content = f.read()

# The specific ones that need to be motion.div
# 1. AnimatePresence child
content = content.replace("                </div>\n              )}\n            </AnimatePresence>", "                </motion.div>\n              )}\n            </AnimatePresence>")

# 2. selectedWord child
content = content.replace("                    {selectedWord.spellingHijja}\n                  </p>\n                </div>\n              </div>\n            ) : (", "                    {selectedWord.spellingHijja}\n                  </p>\n                </div>\n              </motion.div>\n            ) : (")

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.write(content)
