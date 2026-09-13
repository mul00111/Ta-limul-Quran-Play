const fs = require('fs');
const modalPath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(modalPath, 'utf8');

content = content.replace('{/* Alamat e Waqf}', '{/* Alamat e Waqf */}');
fs.writeFileSync(modalPath, content, 'utf8');
console.log('Fixed comment successfully.');
