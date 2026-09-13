import re

with open('src/components/TashdeedGameModal.tsx', 'r') as f:
    content = f.read()

content = content.replace('onClick={onBack}', 'onClick={onClose}')

with open('src/components/TashdeedGameModal.tsx', 'w') as f:
    f.write(content)
