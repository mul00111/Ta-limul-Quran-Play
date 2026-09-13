const fs = require('fs');
const filePath = './src/utils/qariAudioService.ts';
let content = fs.readFileSync(filePath, 'utf8');

const targetFormant = `playFormantSynthesizerAudio = (  text: string,  onEnd?: () => void,  resolve?: () => void): void => {`;

const replacementFormant = `playFormantSynthesizerAudio = (  text: string,  onEnd?: () => void,  resolve?: () => void): void => {
  const cleanT = text.replace(/[\\u064B-\\u065F\\u0670]/g, '').trim();
  const isBaa = cleanT === 'ب' || cleanT === 'باء' || cleanT === 'باءْ' || text.includes('بَاء') || text.includes('بَا');
  
  const ctx = getSharedAudioContext();
  const finish = () => {
    if (onEnd) onEnd();
    if (resolve) resolve();
  };
  if (!ctx) {
    finish();
    return;
  }
  
  if (isBaa) {
    try {
      const now = ctx.currentTime;
      const duration = 0.95;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      
      const pitch = 135;
      osc1.frequency.setValueAtTime(pitch, now);
      osc2.frequency.setValueAtTime(pitch * 2, now);
      
      osc1.frequency.exponentialRampToValueAtTime(pitch * 1.15, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(pitch * 0.95, now + duration);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 2.3, now + 0.3);
      osc2.frequency.exponentialRampToValueAtTime(pitch * 1.9, now + duration);
      
      const filter1 = ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(750, now);
      filter1.Q.value = 5.0;
      
      const filter2 = ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(1300, now);
      filter2.Q.value = 5.5;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.32, now + 0.08);
      gainNode.gain.setValueAtTime(0.30, now + duration - 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      osc1.connect(filter1);
      osc2.connect(filter2);
      filter1.connect(gainNode);
      filter2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
      
      setTimeout(finish, duration * 1000 + 50);
      return;
    } catch (e) {
      console.warn("Baa formant error:", e);
    }
  }`;

if (content.includes(targetFormant) && !content.includes('const isBaa = cleanT === \'ب\'')) {
  content = content.replace(targetFormant, replacementFormant);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated qariAudioService.ts with professional Qari Baa synthesis');
} else {
  console.log('Already updated or target not found');
}
