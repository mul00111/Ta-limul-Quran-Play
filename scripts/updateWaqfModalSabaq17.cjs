const fs = require('fs');
const filePath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldSectionMatch = content.match(/{\/\* Noon Qutni \*\/}[\s\S]*?{\/\* Alamat e Waqf \*\//);

if (oldSectionMatch) {
  const newSection = `      {/* Noon Qutni */}
              <div className="bg-indigo-900/40 rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-300 flex items-center gap-3">
                    ⭐ نُوْن قُطْنِی (سبق نمبر 17 - قواعدِ وقف اور نون قطنی)
                  </h2>
                </div>
                <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-800/50">
                  <p className="text-indigo-100 text-lg sm:text-xl leading-relaxed mb-6">
                    جب تنوین کے بعد <span className="text-amber-400 font-bold">ہمزہ وصلی (ٱ)</span> آجائے، تو وصل (मिलाकर پڑھنے) کی حالت میں ہمزہ وصلی کو گراتے ہوئے تنوین کے نون ساکن کو زیر دے کر چھوٹا نون لکھ دیا جاتا ہے اسے <span className="text-amber-400 font-bold">نون قطنی</span> کہتے ہیں۔ ذیل میں مدنی قاعدہ سبق نمبر 17 کی تمام 6 مستند مثالیں درج ہیں:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
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
                  </div>

                  <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/30 text-center">
                    <p className="text-amber-200 text-base font-semibold">
                      ✨ مدنی قاعدہ سبق نمبر 17 کے مطابق نون قطنی کی ان تمام مثالوں کو بہترین انداز میں الگ سے نمایاں کر دیا گیا ہے تاکہ تلفظ اور تجوید میں کوئی ابہام نہ رہے۔
                    </p>
                  </div>
                </div>
              </div>

              {/* Alamat e Waqf`;

  content = content.replace(oldSectionMatch[0], newSection);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated WaqfLessonModal with Sabaq 17 examples.');
} else {
  console.log('Could not match Noon Qutni section.');
}
