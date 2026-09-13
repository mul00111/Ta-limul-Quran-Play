const fs = require('fs');
const lines = fs.readFileSync('/app/applet/src/components/WaqfLessonModal.tsx', 'utf8').split('\n');
for (let i = 25; i < 65; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
