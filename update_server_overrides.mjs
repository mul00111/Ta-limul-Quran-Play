import fs from 'fs';

const customMatches = {
  "من غفور": { verse: "41:32", words: [2, 3] },
  "من خوف": { verse: "106:4", words: [6, 7] }, // مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ
  "سميع عليم": { verse: "2:227", words: [6, 7] },
  "قرضا حسنا": { verse: "2:245", words: [6, 7] },
  "عليم خبير": { verse: "66:3", words: [23, 24] },
  "قوما غيركم": { verse: "9:39", words: [7, 8] },
  "من صلصال": { verse: "15:26", words: [4, 5] },
  "من طين": { verse: "6:2", words: [4, 5] },
  "من قبل": { verse: "2:25", words: [25, 26] },
  "من كتب": { verse: "34:44", words: [3, 4] },
  "انت": { verse: "2:32", words: [11] },
  "تنسون": { verse: "2:44", words: [6] }, // أََتَأْمُرُونَ النَّاسَ بِالْبِرِّ وَتَنسَوْنَ أَنفُسَكُمْ 
  "ينصرون": { verse: "44:41", words: [10] }, // لا يغني مولى عن مولى شيئا ولا هم ينصرون
  "منضود": { verse: "11:82", words: [14] }, // حِجَارَةً مِّن طِينٍ مَّنضُودٍ
  "انظر": { verse: "6:24", words: [1] },
  "انفسكم": { verse: "2:54", words: [8] },
  "ينقضون": { verse: "2:27", words: [2] }, // الَّذِينَ يَنقُضُونَ عَهْدَ اللَّهِ
  "فصبر جميل": { verse: "12:18", words: [14, 15] },
  "سراعا ذلك": { verse: "50:44", words: [5, 7] }, // يَوْمَ تَشَقَّقُ الْأَرْضُ عَنْهُمْ سِرَاعًا ۚ ذَٰلِكَ حَشْرٌ
  "عذاب شديد": { verse: "3:4", words: [14, 15] },
  "عملا صالحا": { verse: "18:110", words: [19, 20] },
  "عذابا ضعفا": { verse: "7:38", words: [33, 34] },
  "سحاب ظلمات": { verse: "24:40", words: [13, 15] }, // سَحَابٌ ۚ ظُلُمَاتٌ
  "سحاب ظلمت": { verse: "24:40", words: [13, 15] },
  "قوما فاسقين": { verse: "9:24", words: [32, 33] },
  "ثمنا قليلا": { verse: "2:41", words: [16, 17] },
  "رسول كريم": { verse: "69:40", words: [3, 4] },
  "من يوم": { verse: "2:254", words: [10, 11] }, // مِن قَبْلِ أَن يَأْتِيَ يَوْمٌ 
  "من ولي": { verse: "2:107", words: [15, 16] },
  "سراجا منيرا": { verse: "33:46", words: [5, 6] },
  "ويل لكل": { verse: "104:1", words: [1, 2] },
  "خبير بصيرا": { verse: "17:96", words: [10, 11] }, // خَبِيرًا بَصِيرًا (khabeeran baseera)
  "من اجل": { verse: "5:32", words: [1, 2] },
  "من هاد": { verse: "39:23", words: [28, 29] },
  "من علق": { verse: "96:2", words: [3, 4] },
  "من حكيم": { verse: "41:42", words: [12, 13] },
  "ينئون": { verse: "6:26", words: [4] },
  "منهم": { verse: "18:18", words: [21] },
  "انعمت": { verse: "1:7", words: [3] },
  "وانحر": { verse: "108:2", words: [3] },
  "فسينغضون": { verse: "17:51", words: [18] },
  "والمنخنقة": { verse: "5:3", words: [12] },
  "عذابا اليما": { verse: "4:138", words: [5, 6] },
  "بلدا امنا": { verse: "2:126", words: [7, 8] },
  "نوحا هدينا": { verse: "6:84", words: [7, 8] }, // وَنُوحًا هَدَيْنَا مِن قَبْلُ
  "فمن تبع": { verse: "2:38", words: [10, 11] },
  "من ثمرة": { verse: "2:25", words: [17, 18] },
  "من جوع": { verse: "106:4", words: [3, 4] },
  "من دونكم": { verse: "3:118", words: [7, 8] },
  "من ذهب": { verse: "43:53", words: [5, 6] },
  "فان زللتم": { verse: "2:209", words: [1, 2] },
  "من سفه": { verse: "2:130", words: [7, 8] },
  "من شكر": { verse: "27:40", words: [30, 31] }, // وَمَن شَكَرَ
  "ان ضللت": { verse: "34:50", words: [2, 3] },
  "من ظلم": { verse: "27:11", words: [2, 3] },
  "من فروج": { verse: "50:6", words: [11, 12] },
  "ننشزها": { verse: "2:259", words: [59] },
  "ينطقون": { verse: "77:35", words: [4] },
  "منكم": { verse: "43:60", words: [4] },
  "قولا ثقيلا": { verse: "73:5", words: [4, 5] },
  "كاسا دهاقا": { verse: "78:34", words: [1, 2] },
  "صعيدا زلقا": { verse: "18:40", words: [14, 15] },
  "قولا سديدا": { verse: "33:70", words: [7, 8] },
  "سبحا طويلا": { verse: "73:7", words: [5, 6] },
  "كراما كاتبين": { verse: "82:11", words: [1, 2] },
  "من يقول": { verse: "2:8", words: [3, 4] },
  "من ورق الجنة": { verse: "7:22", words: [13, 14, 15] },
  "من مشهد": { verse: "19:37", words: [9, 10] },
  "من مثله": { verse: "2:23", words: [11, 12] },
  "من نصير": { verse: "22:71", words: [17, 18] },
  "من نطفة": { verse: "80:19", words: [1, 2] },
  "كتابا يلقاه": { verse: "17:13", words: [12, 13] },
  "كتابا يلقه": { verse: "17:13", words: [12, 13] },
  "هدى وذكرى": { verse: "40:54", words: [1, 2] },
  "حطة نغفر لكم": { verse: "2:58", words: [15, 16, 17] },
  "من ربك": { verse: "2:147", words: [2, 3] },
  "من ربهم": { verse: "2:5", words: [4, 5] },
  "من لدنه": { verse: "4:40", words: [13, 14] },
  "يكن له": { verse: "112:4", words: [2, 3] },
  "محمد رسول الله": { verse: "48:29", words: [1, 2, 3] },
  "رءوف رحيم": { verse: "9:128", words: [13, 14] },
  "مصدقا لما": { verse: "2:41", words: [4, 5] },
  "من بعد": { verse: "2:27", words: [5, 6] },
  "من بقلها": { verse: "2:61", words: [17, 18] },
  "انبئهم": { verse: "2:33", words: [4] }, // أَنبِئْهُم
  "لينبذن": { verse: "104:4", words: [3] },
  "قولا بليغا": { verse: "4:63", words: [15, 16] },
  "جنة بربوة": { verse: "2:265", words: [12, 13] },
  "كرام بررة": { verse: "80:16", words: [1, 2] },
  "حل بهذا": { verse: "90:2", words: [2, 3] },
  "صم بكم": { verse: "2:18", words: [1, 2] }
};

let jsContent = '';
for (const [k, v] of Object.entries(customMatches)) {
  const [s, a] = v.verse.split(':');
  const surahStr = s.padStart(3, '0');
  const ayahStr = a.padStart(3, '0');
  const urls = v.words.map(w => `'https://audio.qurancdn.com/wbw/${surahStr}_${ayahStr}_${w.toString().padStart(3, '0')}.mp3'`);
  jsContent += `        '${k}': [${urls.join(', ')}],\n`;
}

let serverTs = fs.readFileSync('server.ts', 'utf8');

// replace everything between `// --- 1. IZHAR (حروفِ حلقی) ---` and `// --- 4. IQLAB (اقلاب) ---`+ till `      };`
const startMarker = "// --- 1. IZHAR (حروفِ حلقی) ---";
const endMarker = "      };";

const startIdx = serverTs.indexOf(startMarker);
const endIdx = serverTs.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find markers!");
  process.exit(1);
}

const before = serverTs.substring(0, startIdx);
const after = serverTs.substring(endIdx);

const newContent = before + startMarker + '\n' + jsContent + after;
fs.writeFileSync('server.ts', newContent);
console.log("Replaced tajweed overrides successfully.");
