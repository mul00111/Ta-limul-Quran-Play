const fs = require('fs');
const filePath = '/app/applet/src/data/waqfData.ts';
let content = fs.readFileSync(filePath, 'utf8');

// We want to add audioKey support to WaqfRuleItem and add new Noon Qutni examples at the beginning of WAQF_ITEMS or as a dedicated category/section
// Let's check src/types.ts or waqfData.ts for WaqfRuleItem definition
const interfaceCheck = content.includes('audioKey?: string;');
console.log('Has audioKey in type:', interfaceCheck);
