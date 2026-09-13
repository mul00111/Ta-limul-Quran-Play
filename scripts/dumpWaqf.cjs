const fs = require('fs');
const content = fs.readFileSync('/app/applet/src/data/waqfData.ts', 'utf8');
console.log(content);
