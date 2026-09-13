const fs = require('fs');
const filePath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Let's add click handlers to the 6 Noon Qutni example cards in WaqfLessonModal.tsx
// We can use an audio helper function inside the component or direct Audio play
// Let's check if playWord helper or handlePlayAudio exists
const oldCards = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {/* 1. خَيْرًا ٱلْوَصِيَّةُ */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">خَيْرًا ٱلْوَصِيَّةُ</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">خَيْرَنِ الْوَصِيَّةُ</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> ملا کر پڑھنے پر نون قطنی پڑھا جائے گا، وقف کی صورت میں قاعدے کے مطابق وقف ہوگا۔
                      </p>
                    </div>

                    {/* 2. شَيْبًا ٱلسَّمَاءِ */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">شَيْبًا ٱلسَّمَاءِ</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">شَيْبَنِ السَّمَاءِ</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> تنوین کے بعد ہمزہ وصلی آنے پر نون قطنی کے ساتھ ملا کر پڑھیں۔
                      </p>
                    </div>

                    {/* 3. مُبِيْنٍ ٱقْتُلُوْا */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">مُبِيْنٍ ٱقْتُلُوْا</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">مُبِيْنِنِ اقْتُلُوْا</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> دو زیر (تنوین) کے بعد همزه وصلی پر نون قطنی کی مشق۔
                      </p>
                    </div>

                    {/* 4. خَبِيْرًا ٱلَّذِيْ */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">خَبِيْرًا ٱلَّذِيْ</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">خَبِيْرَنِ الَّذِيْ</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> دو زبر کے بعد ہمزہ وصلی آنے پر نون قطنی کے تحت پڑھیں گے۔
                      </p>
                    </div>

                    {/* 5. قَدِيْرٌ ٱلَّذِيْ */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">قَدِيْرٌ ٱلَّذِيْ</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">قَدِيْرُنِ الَّذِيْ</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> دو پیش (تنوین) کے بعد ہمزہ وصلی پر نون قطنی۔
                      </p>
                    </div>

                    {/* 6. مُنِيْبٍ ٱدْخُلُوْهَا */}
                    <div className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400/50 transition-all">
                      <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2">
                        <span className="font-arabic text-2xl sm:text-3xl text-white">مُنِيْبٍ ٱدْخُلُوْهَا</span>
                        <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">مُنِيْبِنِ ادْخُلُوْهَا</span>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">وصل / وقف:</span> تنوین کے بعد ہمزہ وصلی آنے کی بہترین قرآنی مثال۔
                      </p>
                    </div>
                  </div>`;

const newCards = `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {[
                      { text: 'خَيْرًا ٱلْوَصِيَّةُ', وصل: 'خَيْرَنِ الْوَصِيَّةُ', desc: 'ملا کر پڑھنے پر نون قطنی پڑھا جائے گا', audioKey: 'nq1' },
                      { text: 'شَيْبًا ٱلسَّمَاءِ', وصل: 'شَيْبَنِ السَّمَاءِ', desc: 'تنوین کے بعد ہمزہ وصلی آنے پر نون قطنی', audioKey: 'nq4' },
                      { text: 'مُبِيْنٍ ٱقْتُلُوْا', وصل: 'مُبِيْنِنِ اقْتُلُوْا', desc: 'دو زیر (تنوین) کے بعد ہمزہ وصلی پر نون قطنی', audioKey: 'nq3' },
                      { text: 'خَبِيْرًا ٱلَّذِيْ', وصل: 'خَبِيْرَنِ الَّذِيْ', desc: 'دو زبر کے بعد ہمزہ وصلی آنے پر نون قطنی', audioKey: 'nq3' },
                      { text: 'قَدِيْرٌ ٱلَّذِيْ', وصل: 'قَدِيْرُنِ الَّذِيْ', desc: 'دو پیش (تنوین) کے بعد ہمزہ وصلی پر نون قطنی', audioKey: 'nq3' },
                      { text: 'مُنِيْبٍ ٱدْخُلُوْهَا', وصل: 'مُنِيْبِنِ ادْخُلُوْهَا', desc: 'تنوین کے بعد ہمزہ وصلی آنے کی قرآنی مثال', audioKey: 'nq2' },
                    ].map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={async () => {
                          stopAllQariAudio();
                          try {
                            const audio = new Audio(\`/audio/\${item.audioKey}.mp3\`);
                            await audio.play();
                          } catch (e) {
                            await playQariText(item.text);
                          }
                        }}
                        className="bg-indigo-900/60 p-4 rounded-2xl border border-indigo-700/60 flex flex-col items-center text-center gap-3 shadow-md hover:border-amber-400 hover:scale-[1.02] transition-all cursor-pointer group"
                      >
                        <div className="bg-indigo-950 w-full py-3 px-2 rounded-xl border border-indigo-800/80 flex flex-col gap-2 relative">
                          <span className="absolute top-2 left-2 text-indigo-400 group-hover:text-amber-400 transition-colors">
                            <Volume2 className="w-5 h-5 animate-pulse" />
                          </span>
                          <span className="font-arabic text-2xl sm:text-3xl text-white">{item.text}</span>
                          <span className="font-arabic text-2xl sm:text-3xl text-emerald-300">{item.وصل}</span>
                        </div>
                        <p className="text-indigo-200 text-sm leading-relaxed" dir="rtl">
                          <span className="text-amber-400 font-bold">تجوید:</span> {item.desc} (سننے کے لیے کلک کریں 🔊)
                        </p>
                      </div>
                    ))}
                  </div>`;

if (content.includes('خَيْرًا ٱلْوَصِيَّةُ')) {
  content = content.replace(oldCards, newCards);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated WaqfLessonModal Noon Qutni examples with click-to-play audio.');
} else {
  console.log('Could not find old cards match.');
}
