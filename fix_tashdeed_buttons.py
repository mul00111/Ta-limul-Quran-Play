import re

with open('src/components/TashdeedLessonModal.tsx', 'r') as f:
    content = f.read()

# Make sure buttons look exactly like HuroofMaddahLessonModal
content = content.replace(
    'صوتی و بصری گیم (تَشْدِیْد) 🎯', 
    'صوتی و بصری گیم 🎯'
)

with open('src/components/TashdeedLessonModal.tsx', 'w') as f:
    f.write(content)
