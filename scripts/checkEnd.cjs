const fs = require('fs');
const content = fs.readFileSync('/app/applet/src/components/WaqfLessonModal.tsx', 'utf8');
const lines = content.split('\n');
for (let i = Math.max(0, lines.length - 40); i < lines.length; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
