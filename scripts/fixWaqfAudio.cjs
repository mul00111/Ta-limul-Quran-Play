const fs = require('fs');
const filePath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldSpeakWord = `  // Play audio for a word
  const speakWord = async (item: WaqfRuleItem, mode: 'normal' | 'waqf') => {
    setActiveWordId(item.id + mode);
    let audioPlayed = false;
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
    }
    setActiveWordId(null);
  };`;

const newSpeakWord = `  // Play audio for a word (always using authentic Qari recitation of the word/verse)
  const speakWord = async (item: WaqfRuleItem, mode: 'normal' | 'waqf') => {
    setActiveWordId(item.id + mode);
    let audioPlayed = false;
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
      // Always play authentic Alafasy Qari audio for the word/verse textNormal to avoid TTS fallback errors
      await playQariText(item.textNormal);
    }
    setActiveWordId(null);
  };`;

if (content.includes(oldSpeakWord)) {
  content = content.replace(oldSpeakWord, newSpeakWord);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated speakWord in WaqfLessonModal.tsx');
} else {
  console.log('Could not match oldSpeakWord exactly. Let\'s check content.');
}
