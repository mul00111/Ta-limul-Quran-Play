const fs = require('fs');
const modalPath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(modalPath, 'utf8');

// Let's replace the Noon Qutni section in WaqfLessonModal to display all 4-5 exact Madani Qaida examples with clear spelling (هجے) and pronunciation rules
const oldSectionMatch = content.match(/{\/\* Noon Qutni \*\/}[\s\S]*?{\/\* Alamat e Waqf \*\//);

if (oldSectionMatch) {
  const newSection = `      {/* Noon Qutni */}
              <div className="bg-indigo-900/40 rounded-3xl p-6 sm:p-8 border border-indigo-500/20 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-300 flex items-center gap-3">
                    ⭐ نُوْن قُطْنِی (بَعْض جِگْروں پر الف کے نیچے چھوٹا نون ہوتا ہے)
                  </h2>
                </div>
                <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-800/50">
                  <p className="text-indigo-100 text-lg sm:text-xl leading-relaxed mb-6">
                    جب دو زبر، دو زیر یا دو پیش (<span className="text-amber-400 font-bold">تنوین</span>) کے بعد <span className="text-amber-400 font-bold">ہمزہ وصلی (ٱ)</span> آجائے، تو وصل (मिलाकर پڑھنے) کی حالت میں ہمزہ وصلی کو گراتے ہوئے تنوین کے نون ساکن کو زیر دے کر چھوٹا نون لکھ دیا جاتا ہے اسے <span className="text-amber-400 font-bold">نون قطنی</span> کہتے ہیں۔
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Example 1 */}
                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">لُمَزَةٍ ٱلَّذِى</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed">
                        <span className="text-amber-400 font-bold">ہجے:</span> لام پیش لُ ، میم زبر مَ = لُمَ ، زا زبر زَ ، تا دو زیر تِنْ = لُمَزَتِنْ ، لام شد زبر لَّ = لُمَزَتِنلَّ ، ذال یا زیر ذِیْ = لُمَزَتِنلَّذِیْ
                      </p>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">نُوحٌ ٱبْنَهُ</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed">
                        <span className="text-amber-400 font-bold">ہجے:</span> نون واو پیش نُوْ ، حا دو پیش حُنْ = نُوحُنْ ، با نون زیر بِنْ = نُوحُنْبِنْ ، ها پیش ھُ = نُوحُنْبِنْهُ
                      </p>
                    </div>

                    {/* Example 3 */}
                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">قَدِيرٌ ٱلَّذِي</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed">
                        <span className="text-amber-400 font-bold">ہجے:</span> قاف زبر قَ ، دال یا زیر دِيْ = قَدِيْ ، را دو پیش رُنْ = قَدِيْرُنْ ، لام شد زبر لَّ = قَدِيْرُنلَّ ، ذال یا زیر ذِیْ = قَدِيْرُنلَّذِيْ
                      </p>
                    </div>

                    {/* Example 4 */}
                    <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/60 flex flex-col items-center text-center gap-3">
                      <div className="bg-indigo-950 px-4 py-2 rounded-xl border border-indigo-800">
                        <span className="font-arabic text-3xl sm:text-4xl text-white">شَيْئًا ٱلسَّمَاءِ</span>
                      </div>
                      <p className="text-indigo-200 text-base leading-relaxed">
                        <span className="text-amber-400 font-bold">ہجے:</span> شین یا زبر شَيْء ، همزه دو زبر اَنْ = شَيْئًا ، نون سین زیر نِسْ ، سين زبر سَ = نِسَّ ، ميم الف زبر مَا = نِسَّمَا ، همزه زیر ءِ = نِسَّمَآءِ
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-900/30 p-4 rounded-xl border border-amber-500/30 text-center">
                    <p className="text-amber-200 text-base font-semibold">
                      💡 نوٹ: ان کلمات کو مشق کرنے کے لیے آپ نیچے "کلمات کی مشق" (Practice Words) ٹیب میں جا کر ان کی آڈیو بھی سن سکتے ہیں!
                    </p>
                  </div>
                </div>
              </div>

              {/* Alamat e Waqf`;

  content = content.replace(oldSectionMatch[0], newSection);
  fs.writeFileSync(modalPath, content, 'utf8');
  console.log('Successfully updated WaqfLessonModal Noon Qutni section.');
} else {
  console.log('Could not match Noon Qutni section.');
}
