import re

with open('src/components/TashdeedPuzzleGameModal.tsx', 'r') as f:
    content = f.read()

# Make sure onBack is exported properly in interface
content = content.replace('interface TashdeedPuzzleGameModalProps {', 'export interface TashdeedPuzzleGameModalProps {')
content = content.replace('interface TashdeedPuzzleItem {', 'export interface TashdeedPuzzleItem {')

with open('src/components/TashdeedPuzzleGameModal.tsx', 'w') as f:
    f.write(content)
