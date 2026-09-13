import re

with open('src/components/HuroofMaddahGameModal.tsx', 'r') as f:
    content = f.read()

# Replace all occurrences of Maddah with Tashdeed
content = content.replace('Maddah', 'Tashdeed')
content = content.replace('maddah', 'tashdeed')
content = content.replace('MADDAH', 'TASHDEED')
content = content.replace('حروفِ مدہ', 'تشدید و غنہ')

with open('src/components/TashdeedGameModal_new.tsx', 'w') as f:
    f.write(content)
