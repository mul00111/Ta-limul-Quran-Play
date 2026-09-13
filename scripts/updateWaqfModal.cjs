const fs = require('fs');
const modalPath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(modalPath, 'utf8');

// Check if speakWord uses audioKey
if (!content.includes('item.audioKey')) {
  content = content.replace(
    'const textToPlay = mode === \'waqf\' ? item.textWaqf : item.textNormal;\n    await playQariText(textToPlay);',
    `let audioPlayed = false;
    if (item.audioKey) {
      try {
        const audio = new Audio(\`/audio/\${item.audioKey}.mp3\`);
        await audio.play();
        audioPlayed = true;
      } catch (e) {
        console.error(e);
      }
    }
    if (!audioPlayed) {
      const textToPlay = mode === 'waqf' ? item.textWaqf : item.textNormal;
      await playQariText(textToPlay);
    }`
  );
  fs.writeFileSync(modalPath, content, 'utf8');
  console.log('Updated WaqfLessonModal audio playback successfully.');
}
