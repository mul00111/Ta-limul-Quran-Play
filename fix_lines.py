with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
"""                ))}
              </div>
            )}
          </AnimatePresence>""", 
"""                ))}
              </motion.div>
            )}
          </AnimatePresence>""")

content = content.replace(
"""                </div>
              </div>
            ) : (""",
"""                </div>
              </motion.div>
            ) : (""")

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.write(content)
