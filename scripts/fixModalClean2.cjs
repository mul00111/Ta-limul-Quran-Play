const fs = require('fs');
const modalPath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(modalPath, 'utf8');

const startIdx = content.indexOf('{/* Noon Qutni */}');
const endIdx = content.indexOf('{/* Alamat e Waqf');

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `      {/* Noon Qutni */}
              <div className="bg-indigo-900/40 rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-300 flex items-center gap-3">
                    ⭐ نُوْن قُطْنِی (بَعْض جِگْروں پر الف کے نیچے چھوٹا نون ہوتا ہے)
                  </h2>
                </div>
                <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-800/50">
                  <p className="text-indigo-100 text-lg sm:text-xl leading-relaxed mb-6">
                    جب دو زبر، دو زیر یا دو پیش (تنوین) کے بعد همزه وصلی (ٱ) آجائے، تو وصل کی حالت میں همزه وصلی کو گراتے ہوئے تنوین کے نون ساکن کو زیر دے کر چھوٹا نون لکھ دیا جاتا ہے اسے نون قطنی کہتے ہیں۔
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">لُمَزَةٍ ٱلَّذِى</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">ہجے:</span> لام پیش لُ ، میم زبر مَ = لُمَ ، زا زبر زَ ، تا دو زیر تِنْ = لُمَزَتِنْ ، لام شد زبر لَّ = لُمَزَتِنلَّ ، ذال یا زیر ذِیْ = لُمَزَتِنلَّذِیْ
                      </p>
                    </div>

                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">نُوحٌ ٱبْنَهُ</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">ہجے:</span> نون واو پیش نُوْ ، حا دو پیش حُنْ = نُوحُنْ ، با نون زیر بِنْ = نُوحُنْبِنْ ، ها پیش ھُ = نُوحُنْبِنْهُ
                      </p>
                    </div>

                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">قَدِيرٌ ٱلَّذِي</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">ہجے:</span> قاف زبر قَ ، دال یا زیر دِيْ = قَدِيْ ، را دو پیش رُنْ = قَدِيْرُنْ ، لام شد زبر لَّ = قَدِيْرُنلَّ ، ذال یا زیر ذِیْ = قَدِيْرُنلَّذِیْ
                      </p>
                    </div>

                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">شَيْئًا ٱلسَّمَاءِ</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed" dir="rtl">
                        <span className="text-amber-400 font-bold">ہجے:</span> شین یا زبر شَيْء ، همزه دو زبر اَنْ = شَيْئًا ، نون سین زیر نِسْ ، سين زبر سَ = نِسَّ ، ميم الف زبر مَا = نِسَّمَا ، همزه زیر ءِ = نِسَّمَآءِ
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/30 text-center">
                    <p className="text-amber-200 text-base font-semibold">
                      💡 نوٹ: ان کلمات کی مزید مشق کے لیے اوپر "کلمات کی مشق" ٹیب میں جائیں۔
                    </p>
                  </div>
                </div>
              </div>

              `;

  content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  fs.writeFileSync(modalPath, content, 'utf8');
  console.log('Successfully updated WaqfLessonModal.');
} else {
  console.log('Indices not found:', startIdx, endIdx);
}
