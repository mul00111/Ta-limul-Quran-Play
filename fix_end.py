with open('src/components/MeemSakinLessonModal.tsx', 'r') as f:
    lines = f.readlines()

# Remove the last </div> if it exists (the one from fixed inset-0)
# We know the original had `</motion.div>\n    </div>\n  );\n}\n`
# We replaced `</motion.div>` with `</div>` so it's `</div>\n    </div>\n  );\n}\n`
# We need to remove one `</div>`
if lines[-3].strip() == '</div>' and lines[-4].strip() == '</div>':
    lines.pop(-3)

with open('src/components/MeemSakinLessonModal.tsx', 'w') as f:
    f.writelines(lines)
