import fs from 'fs';
const file = 'src/utils/qariAudioService.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `    // For any Quranic kalima, letter, word, or lesson phrase (e.g. 'مِنْ اَجْلٍ', 'مِنْ هَادٍ', 'عَذَابًا اَلِيْمًا', 'خَلَقَ'):
    // Play Sheikh Mishary Rashid Alafasy's authentic recitation
    const wbwAudioUrls = await getAlafasyWordAudioUrls(text);
    if (wbwAudioUrls && wbwAudioUrls.length > 0) {
      playAlafasyWordSequence(wbwAudioUrls, onEnd, resolve);
      return;
    }

    // Fallback to HD Arabic Qari TTS if WBW audio is unavailable
    fallbackToArabicTTS(text, onEnd, resolve);`;

const replacement = `    // For any Quranic kalima, letter, word, or lesson phrase (e.g. 'مِنْ اَجْلٍ', 'مِنْ هَادٍ', 'عَذَابًا اَلِيْمًا', 'خَلَقَ'):
    // User requested to force robotic TTS voice for all lessons and all words.
    
    fallbackToArabicTTS(text, onEnd, resolve);`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
