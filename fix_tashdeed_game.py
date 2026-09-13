import re

with open('src/components/HuroofMaddahGameModal.tsx', 'r') as f:
    content = f.read()

# I will replace Maddah references with Tashdeed
content = content.replace('MaddahGameItem', 'TashdeedGameItem')
content = content.replace('maddahType', 'category')
content = content.replace('HuroofMaddahGameModal', 'TashdeedGameModal')
content = content.replace('ALL_MADDAH_MASHQ_WORDS', 'TASHDEED_GAME_ITEMS')
content = content.replace('WORD_MADDAH_GAME_ITEMS', 'TASHDEED_GAME_ITEMS')
content = content.replace('maddah_game_score', 'qaida_coins')

# Let's save this as a base and then I'll manually fix the syntax errors.
with open('src/components/TashdeedGameModal_new.tsx', 'w') as f:
    f.write(content)
