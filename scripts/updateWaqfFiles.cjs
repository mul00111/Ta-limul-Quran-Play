const fs = require('fs');

// 1. Update waqfData.ts to include Noon Qutni category and precise examples from Madani Qaida image
const waqfDataPath = '/app/applet/src/data/waqfData.ts';
let waqfDataContent = fs.readFileSync(waqfDataPath, 'utf8');

// Add audioKey?: string to WaqfRuleItem
waqfDataContent = waqfDataContent.replace(
  'export type WaqfRuleItem = {\n  id: string;\n  textNormal: string;\n  textWaqf: string;\n  category: string;\n};',
  'export type WaqfRuleItem = {\n  id: string;\n  textNormal: string;\n  textWaqf: string;\n  category: string;\n  audioKey?: string;\n};'
);

// Add 'noon_qutni' category to WAQF_CATEGORIES if not present
if (!waqfDataContent.includes("id: 'noon_qutni'")) {
  waqfDataContent = waqfDataContent.replace(
    'export const WAQF_CATEGORIES = [',
    `export const WAQF_CATEGORIES = [
  { id: 'noon_qutni', title: 'نون قطنی (خاص قواعد)', description: 'الکلمات جن کے نیچے چھوٹا نون ہوتا ہے' },`
  );
}

// Replace WAQF_ITEMS or append Noon Qutni items at the beginning of WAQF_ITEMS
const noonQutniItems = `  // Noon Qutni (Madani Qaida Exact Examples)
  { id: 'wq1', textNormal: 'لُمَزَةٍ ٱلَّذِى', textWaqf: 'لُمَزَةِنِ ٱلَّذِى', category: 'noon_qutni', audioKey: 'nq1' },
  { id: 'wq2', textNormal: 'نُوحٌ ٱبْنَهُ', textWaqf: 'نُوحُنِ ٱبْنَهُ', category: 'noon_qutni', audioKey: 'nq2' },
  { id: 'wq3', textNormal: 'قَدِيرٌ ٱلَّذِي', textWaqf: 'قَدِيرُنِ ٱلَّذِي', category: 'noon_qutni', audioKey: 'nq3' },
  { id: 'wq4', textNormal: 'شَيْئًا ٱلسَّمَاءِ', textWaqf: 'شَيْئَنِ ٱلسَّمَاءِ', category: 'noon_qutni', audioKey: 'nq4' },
  { id: 'wq5', textNormal: 'خَيْرًا ٱلْوَصِيَّةُ', textWaqf: 'خَيْرَنِ ٱلْوَصِيَّةُ', category: 'noon_qutni', audioKey: 'nq1' },`;

if (!waqfDataContent.includes("id: 'wq1'")) {
  waqfDataContent = waqfDataContent.replace(
    'export const WAQF_ITEMS: WaqfRuleItem[] = [',
    `export const WAQF_ITEMS: WaqfRuleItem[] = [\n${noonQutniItems}`
  );
}

fs.writeFileSync(waqfDataPath, waqfDataContent, 'utf8');
console.log('Updated waqfData.ts successfully.');
