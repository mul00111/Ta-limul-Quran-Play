import fs from 'fs';

const finalUrls = {
  "من غفور": ['https://audio.qurancdn.com/wbw/041_032_002.mp3', 'https://audio.qurancdn.com/wbw/041_032_003.mp3'],
  "من خوف": ['https://audio.qurancdn.com/wbw/106_004_006.mp3', 'https://audio.qurancdn.com/wbw/106_004_007.mp3'],
  "سميع عليم": ['https://audio.qurancdn.com/wbw/002_227_006.mp3', 'https://audio.qurancdn.com/wbw/002_227_007.mp3'],
  "قرضا حسنا": ['https://audio.qurancdn.com/wbw/002_245_006.mp3', 'https://audio.qurancdn.com/wbw/002_245_007.mp3'],
  "عليم خبير": ['https://audio.qurancdn.com/wbw/049_013_021.mp3', 'https://audio.qurancdn.com/wbw/049_013_022.mp3'],
  "قوما غيركم": ['https://audio.qurancdn.com/wbw/011_057_012.mp3', 'https://audio.qurancdn.com/wbw/011_057_013.mp3'],
  "من صلصال": ['https://audio.qurancdn.com/wbw/055_014_001.mp3', 'https://audio.qurancdn.com/wbw/055_014_002.mp3'], // 55:14 words 1,2
  "من طين": ['https://audio.qurancdn.com/wbw/038_076_010.mp3', 'https://audio.qurancdn.com/wbw/038_076_011.mp3'],
  "من قبل": ['https://audio.qurancdn.com/wbw/027_037_006.mp3', 'https://audio.qurancdn.com/wbw/027_037_007.mp3'],
  "من كتب": ['https://audio.qurancdn.com/wbw/034_044_003.mp3', 'https://audio.qurancdn.com/wbw/034_044_004.mp3'],
  "انت": ['https://audio.qurancdn.com/wbw/088_021_003.mp3'], // 88:21 (فَذَكِّرْ إِنَّمَا أَنتَ مُذَكِّرٌ)
  "تنسون": ['https://audio.qurancdn.com/wbw/002_044_005.mp3'],
  "ينصرون": ['https://audio.qurancdn.com/wbw/044_041_010.mp3'],
  "منضود": ['https://audio.qurancdn.com/wbw/056_029_002.mp3'], // 56:29 word 2 (وَطَلْحٍ مَّنضُودٍ)
  "انظر": ['https://audio.qurancdn.com/wbw/006_024_001.mp3'],
  "انفسكم": ['https://audio.qurancdn.com/wbw/002_054_008.mp3'],
  "ينقضون": ['https://audio.qurancdn.com/wbw/002_027_002.mp3'],
  "فصبر جميل": ['https://audio.qurancdn.com/wbw/012_018_014.mp3', 'https://audio.qurancdn.com/wbw/012_018_015.mp3'],
  "سراعا ذلك": ['https://audio.qurancdn.com/wbw/050_044_005.mp3', 'https://audio.qurancdn.com/wbw/050_044_008.mp3'], // 5, 8
  "عذاب شديد": ['https://audio.qurancdn.com/wbw/042_026_011.mp3', 'https://audio.qurancdn.com/wbw/042_026_012.mp3'],
  "عملا صالحا": ['https://audio.qurancdn.com/wbw/018_110_019.mp3', 'https://audio.qurancdn.com/wbw/018_110_020.mp3'],
  "عذابا ضعفا": ['https://audio.qurancdn.com/wbw/007_038_033.mp3', 'https://audio.qurancdn.com/wbw/007_038_034.mp3'],
  "سحاب ظلمات": ['https://audio.qurancdn.com/wbw/024_040_013.mp3', 'https://audio.qurancdn.com/wbw/024_040_016.mp3'], // 13, 16
  "سحاب ظلمت": ['https://audio.qurancdn.com/wbw/024_040_013.mp3', 'https://audio.qurancdn.com/wbw/024_040_016.mp3'], // 13, 16
  "قوما فاسقين": ['https://audio.qurancdn.com/wbw/009_024_032.mp3', 'https://audio.qurancdn.com/wbw/009_024_033.mp3'],
  "ثمنا قليلا": ['https://audio.qurancdn.com/wbw/003_077_021.mp3', 'https://audio.qurancdn.com/wbw/003_077_022.mp3'],
  "رسول كريم": ['https://audio.qurancdn.com/wbw/069_040_003.mp3', 'https://audio.qurancdn.com/wbw/069_040_004.mp3'],
  "من يوم": ['https://audio.qurancdn.com/wbw/019_037_009.mp3', 'https://audio.qurancdn.com/wbw/019_037_011.mp3'], // min ... yawmin
  "من ولي": ['https://audio.qurancdn.com/wbw/002_107_015.mp3', 'https://audio.qurancdn.com/wbw/002_107_016.mp3'],
  "سراجا منيرا": ['https://audio.qurancdn.com/wbw/033_046_005.mp3', 'https://audio.qurancdn.com/wbw/033_046_006.mp3'],
  "ويل لكل": ['https://audio.qurancdn.com/wbw/104_001_001.mp3', 'https://audio.qurancdn.com/wbw/104_001_002.mp3'],
  "خبير بصيرا": ['https://audio.qurancdn.com/wbw/025_058_010.mp3', 'https://audio.qurancdn.com/wbw/025_058_011.mp3'],
  "من اجل": ['https://audio.qurancdn.com/wbw/005_032_001.mp3', 'https://audio.qurancdn.com/wbw/005_032_002.mp3'],
  "من هاد": ['https://audio.qurancdn.com/wbw/039_036_012.mp3', 'https://audio.qurancdn.com/wbw/039_036_013.mp3'], // 39:36
  "من علق": ['https://audio.qurancdn.com/wbw/096_002_003.mp3', 'https://audio.qurancdn.com/wbw/096_002_004.mp3'],
  "من حكيم": ['https://audio.qurancdn.com/wbw/027_006_004.mp3', 'https://audio.qurancdn.com/wbw/027_006_006.mp3'],
  "ينئون": ['https://audio.qurancdn.com/wbw/006_026_004.mp3'],
  "منهم": ['https://audio.qurancdn.com/wbw/018_018_021.mp3'],
  "انعمت": ['https://audio.qurancdn.com/wbw/001_007_003.mp3'],
  "وانحر": ['https://audio.qurancdn.com/wbw/108_002_003.mp3'],
  "فسينغضون": ['https://audio.qurancdn.com/wbw/017_051_018.mp3'],
  "والمنخنقة": ['https://audio.qurancdn.com/wbw/005_003_012.mp3'],
  "عذابا اليما": ['https://audio.qurancdn.com/wbw/004_138_005.mp3', 'https://audio.qurancdn.com/wbw/004_138_006.mp3'],
  "بلدا امنا": ['https://audio.qurancdn.com/wbw/002_126_007.mp3', 'https://audio.qurancdn.com/wbw/002_126_008.mp3'],
  "نوحا هدينا": ['https://audio.qurancdn.com/wbw/029_014_004.mp3', 'https://audio.qurancdn.com/wbw/006_084_008.mp3'], // Wait, just use 6:84 "ونوحا هدينا": 006_084_007.mp3, 006_084_008.mp3
  "فمن تبع": ['https://audio.qurancdn.com/wbw/002_038_010.mp3', 'https://audio.qurancdn.com/wbw/002_038_011.mp3'],
  "من ثمرة": ['https://audio.qurancdn.com/wbw/002_025_017.mp3', 'https://audio.qurancdn.com/wbw/002_025_018.mp3'],
  "من جوع": ['https://audio.qurancdn.com/wbw/106_004_003.mp3', 'https://audio.qurancdn.com/wbw/106_004_004.mp3'],
  "من دونكم": ['https://audio.qurancdn.com/wbw/003_118_007.mp3', 'https://audio.qurancdn.com/wbw/003_118_008.mp3'],
  "من ذهب": ['https://audio.qurancdn.com/wbw/043_053_005.mp3', 'https://audio.qurancdn.com/wbw/043_053_006.mp3'],
  "فان زللتم": ['https://audio.qurancdn.com/wbw/002_209_001.mp3', 'https://audio.qurancdn.com/wbw/002_209_002.mp3'],
  "من سفه": ['https://audio.qurancdn.com/wbw/002_130_007.mp3', 'https://audio.qurancdn.com/wbw/002_130_008.mp3'],
  "من شكر": ['https://audio.qurancdn.com/wbw/027_040_030.mp3', 'https://audio.qurancdn.com/wbw/027_040_031.mp3'],
  "ان ضللت": ['https://audio.qurancdn.com/wbw/034_050_002.mp3', 'https://audio.qurancdn.com/wbw/034_050_003.mp3'],
  "من ظلم": ['https://audio.qurancdn.com/wbw/027_011_002.mp3', 'https://audio.qurancdn.com/wbw/027_011_003.mp3'],
  "من فروج": ['https://audio.qurancdn.com/wbw/050_006_011.mp3', 'https://audio.qurancdn.com/wbw/050_006_012.mp3'],
  "ننشزها": ['https://audio.qurancdn.com/wbw/002_259_059.mp3'],
  "ينطقون": ['https://audio.qurancdn.com/wbw/077_035_004.mp3'],
  "منكم": ['https://audio.qurancdn.com/wbw/043_060_004.mp3'],
  "قولا ثقيلا": ['https://audio.qurancdn.com/wbw/073_005_004.mp3', 'https://audio.qurancdn.com/wbw/073_005_005.mp3'],
  "كاسا دهاقا": ['https://audio.qurancdn.com/wbw/078_034_001.mp3', 'https://audio.qurancdn.com/wbw/078_034_002.mp3'],
  "صعيدا زلقا": ['https://audio.qurancdn.com/wbw/018_040_014.mp3', 'https://audio.qurancdn.com/wbw/018_040_015.mp3'],
  "قولا سديدا": ['https://audio.qurancdn.com/wbw/033_070_007.mp3', 'https://audio.qurancdn.com/wbw/033_070_008.mp3'],
  "سبحا طويلا": ['https://audio.qurancdn.com/wbw/073_007_005.mp3', 'https://audio.qurancdn.com/wbw/073_007_006.mp3'],
  "كراما كاتبين": ['https://audio.qurancdn.com/wbw/082_011_001.mp3', 'https://audio.qurancdn.com/wbw/082_011_002.mp3'],
  "من يقول": ['https://audio.qurancdn.com/wbw/002_008_003.mp3', 'https://audio.qurancdn.com/wbw/002_008_004.mp3'],
  "من ورق الجنة": ['https://audio.qurancdn.com/wbw/007_022_013.mp3', 'https://audio.qurancdn.com/wbw/007_022_014.mp3', 'https://audio.qurancdn.com/wbw/007_022_015.mp3'],
  "من مشهد": ['https://audio.qurancdn.com/wbw/019_037_009.mp3', 'https://audio.qurancdn.com/wbw/019_037_010.mp3'],
  "من مثله": ['https://audio.qurancdn.com/wbw/002_023_011.mp3', 'https://audio.qurancdn.com/wbw/002_023_012.mp3'],
  "من نصير": ['https://audio.qurancdn.com/wbw/022_071_017.mp3', 'https://audio.qurancdn.com/wbw/022_071_018.mp3'],
  "من نطفة": ['https://audio.qurancdn.com/wbw/080_019_001.mp3', 'https://audio.qurancdn.com/wbw/080_019_002.mp3'],
  "كتابا يلقاه": ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],
  "هدى وذكرى": ['https://audio.qurancdn.com/wbw/040_054_001.mp3', 'https://audio.qurancdn.com/wbw/040_054_002.mp3'],
  "حطة نغفر لكم": ['https://audio.qurancdn.com/wbw/002_058_015.mp3', 'https://audio.qurancdn.com/wbw/002_058_016.mp3', 'https://audio.qurancdn.com/wbw/002_058_017.mp3'],
  "من ربك": ['https://audio.qurancdn.com/wbw/002_147_002.mp3', 'https://audio.qurancdn.com/wbw/002_147_003.mp3'],
  "من ربهم": ['https://audio.qurancdn.com/wbw/002_005_004.mp3', 'https://audio.qurancdn.com/wbw/002_005_005.mp3'],
  "من لدنه": ['https://audio.qurancdn.com/wbw/004_040_013.mp3', 'https://audio.qurancdn.com/wbw/004_040_014.mp3'],
  "يكن له": ['https://audio.qurancdn.com/wbw/112_004_002.mp3', 'https://audio.qurancdn.com/wbw/112_004_003.mp3'],
  "محمد رسول الله": ['https://audio.qurancdn.com/wbw/048_029_001.mp3', 'https://audio.qurancdn.com/wbw/048_029_002.mp3', 'https://audio.qurancdn.com/wbw/048_029_003.mp3'],
  "رءوف رحيم": ['https://audio.qurancdn.com/wbw/009_128_013.mp3', 'https://audio.qurancdn.com/wbw/009_128_014.mp3'],
  "مصدقا لما": ['https://audio.qurancdn.com/wbw/002_041_004.mp3', 'https://audio.qurancdn.com/wbw/002_041_005.mp3'],
  "من بعد": ['https://audio.qurancdn.com/wbw/002_027_005.mp3', 'https://audio.qurancdn.com/wbw/002_027_006.mp3'],
  "من بقلها": ['https://audio.qurancdn.com/wbw/002_061_017.mp3', 'https://audio.qurancdn.com/wbw/002_061_018.mp3'],
  "انبئهم": ['https://audio.qurancdn.com/wbw/002_033_004.mp3'], // 2:33 word 3 is 004.mp3 (أَنبِئْهُم)
  "لينبذن": ['https://audio.qurancdn.com/wbw/104_004_003.mp3'],
  "قولا بليغا": ['https://audio.qurancdn.com/wbw/004_063_015.mp3', 'https://audio.qurancdn.com/wbw/004_063_016.mp3'],
  "جنة بربوة": ['https://audio.qurancdn.com/wbw/002_265_012.mp3', 'https://audio.qurancdn.com/wbw/002_265_013.mp3'],
  "كرام بررة": ['https://audio.qurancdn.com/wbw/080_016_001.mp3', 'https://audio.qurancdn.com/wbw/080_016_002.mp3'],
  "حل بهذا": ['https://audio.qurancdn.com/wbw/090_002_002.mp3', 'https://audio.qurancdn.com/wbw/090_002_003.mp3'],
  "صم بكم": ['https://audio.qurancdn.com/wbw/002_018_001.mp3', 'https://audio.qurancdn.com/wbw/002_018_002.mp3']
};

finalUrls['نوحا هدينا'] = ['https://audio.qurancdn.com/wbw/006_084_007.mp3', 'https://audio.qurancdn.com/wbw/006_084_008.mp3']; // 6:84
finalUrls['سحاب ظلمات'] = ['https://audio.qurancdn.com/wbw/024_040_013.mp3', 'https://audio.qurancdn.com/wbw/024_040_016.mp3']; // 24:40
finalUrls['كتابا يلقه'] = finalUrls['كتابا يلقاه'];

let jsContent = '';
for (const [k, v] of Object.entries(finalUrls)) {
  const urls = v.map(u => `'${u}'`);
  jsContent += `        '${k}': [${urls.join(', ')}],\n`;
}

let serverTs = fs.readFileSync('server.ts', 'utf8');

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
console.log("Replaced tajweed overrides perfectly.");
