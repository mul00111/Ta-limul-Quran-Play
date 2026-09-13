with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "                </div>\n            )}\n          </AnimatePresence>",
    "                </motion.div>\n            )}\n          </AnimatePresence>"
)

# And another one down below maybe? Let's fix that just in case.
content = content.replace(
    "                </div>\n              </motion.div>\n            ) : (",
    "                </div>\n              </motion.div>\n            ) : ("
) # this one was probably okay but let's check it

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.write(content)
