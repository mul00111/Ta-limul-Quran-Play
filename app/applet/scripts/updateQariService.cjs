const fs = require('fs');
const filePath = './src/utils/qariAudioService.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove auto-clearing of custom recordings on module import
content = content.replace(
  /\/\/ Initialize immediately on module import - clear custom recordings as requested\s*if \(typeof window !== 'undefined'\) \{\s*clearAllCustomHurufRecordings\(\);\s*\}/g,
  '// Custom recordings preserved across reloads'
);

// 2. Add custom huruf audio check at the beginning of playQariText
const targetPlayStart = `    // 0. Use passed customAudioUrl only if explicitly provided
    if (customAudioUrl) {
      playAudioUrl(customAudioUrl, text, onEnd, resolve);
      return;
    }`;

const replacementPlayStart = `    // 0. Use passed customAudioUrl only if explicitly provided
    if (customAudioUrl) {
      playAudioUrl(customAudioUrl, text, onEnd, resolve);
      return;
    }

    // Check custom huruf audio map (user uploaded/recorded voice for Madani Qaida letters)
    const customRec = getCustomHurufAudio(text);
    if (customRec) {
      playAudioUrl(customRec, text, onEnd, resolve);
      return;
    }`;

if (content.includes(targetPlayStart)) {
  content = content.replace(targetPlayStart, replacementPlayStart);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated src/utils/qariAudioService.ts');
