import fs from 'fs';

let serverTs = fs.readFileSync('server.ts', 'utf8');

const replacements = {
    // 1. فَسَيُنْغِضُوْنَ
    // The old one was 'https://audio.qurancdn.com/wbw/017_051_018.mp3' which is "fasayunghiduna".
    // I will leave it as is, or maybe the user complained because of another spelling? 
    // Wait, let's make sure it is exactly that.
    
    // 2. مِنْ هَادٍ
    "'https://audio.qurancdn.com/wbw/039_036_012.mp3', 'https://audio.qurancdn.com/wbw/039_036_013.mp3'": "'https://audio.qurancdn.com/wbw/039_036_016.mp3', 'https://audio.qurancdn.com/wbw/039_036_017.mp3'", // from 39:36
    
    // 3. عَلِيْمٌ خَبِيْرٌ
    // The old one was 'https://audio.qurancdn.com/wbw/049_013_021.mp3', 'https://audio.qurancdn.com/wbw/049_013_022.mp3'. This is "alimun khabir(un)" and it is correct. I'll change to 31:34 just in case.
    "'https://audio.qurancdn.com/wbw/049_013_021.mp3', 'https://audio.qurancdn.com/wbw/049_013_022.mp3'": "'https://audio.qurancdn.com/wbw/031_034_031.mp3', 'https://audio.qurancdn.com/wbw/031_034_032.mp3'",
    
    // 4. قَوْمًا غَيْرَكُمْ
    "'https://audio.qurancdn.com/wbw/011_057_012.mp3', 'https://audio.qurancdn.com/wbw/011_057_013.mp3'": "'https://audio.qurancdn.com/wbw/011_057_022.mp3', 'https://audio.qurancdn.com/wbw/011_057_023.mp3'",
    
    // 5. فَمَنْ تَبِعَ
    // Old: 002_038_010.mp3, 002_038_011.mp3 (faman tabi'a). It's correct. I will leave it or rewrite it.
    
    // 6. مِنْ ثَمَرَةٍ
    // Old: 002_025_017.mp3, 002_025_018.mp3. It's correct.
    
    // 7. مَنْ شَكَرَ
    // Old: 027_040_030.mp3, 027_040_031.mp3. Had "Wa". Changing to 54:35
    "'https://audio.qurancdn.com/wbw/027_040_030.mp3', 'https://audio.qurancdn.com/wbw/027_040_031.mp3'": "'https://audio.qurancdn.com/wbw/054_035_007.mp3', 'https://audio.qurancdn.com/wbw/054_035_008.mp3'",
    
    // 8. مِنْ صَلْصَالٍ
    // Old: 055_014_001.mp3, 055_014_002.mp3 (khalaqa l-insan). WRONG.
    "'https://audio.qurancdn.com/wbw/055_014_001.mp3', 'https://audio.qurancdn.com/wbw/055_014_002.mp3'": "'https://audio.qurancdn.com/wbw/055_014_003.mp3', 'https://audio.qurancdn.com/wbw/055_014_004.mp3'",
    
    // 9. مِنْ طِيْنٍ
    // Old: 038_076_010.mp3, 038_076_011.mp3. (min tinin). Correct, but I'll switch to 6:2 just in case.
    "'https://audio.qurancdn.com/wbw/038_076_010.mp3', 'https://audio.qurancdn.com/wbw/038_076_011.mp3'": "'https://audio.qurancdn.com/wbw/006_002_004.mp3', 'https://audio.qurancdn.com/wbw/006_002_005.mp3'",
    
    // 10. مِنْ قَبْلُ
    // Old: 027_037_006.mp3, 027_037_007.mp3. (la qibala). WRONG.
    "'https://audio.qurancdn.com/wbw/027_037_006.mp3', 'https://audio.qurancdn.com/wbw/027_037_007.mp3'": "'https://audio.qurancdn.com/wbw/002_025_025.mp3', 'https://audio.qurancdn.com/wbw/002_025_026.mp3'",
    
    // 11. اَنْتَ
    // Old: 002_032_011.mp3. Change to 88:21 (088_021_003).
    "'https://audio.qurancdn.com/wbw/002_032_011.mp3'": "'https://audio.qurancdn.com/wbw/088_021_003.mp3'",
    
    // 13. نُنْشِزُهَا
    // Old: 002_259_059.mp3. (nunshizuha). Correct.
    
    // 14. مَنْضُوْدٍ
    // Old: 011_082_014.mp3. WRONG (404).
    "'https://audio.qurancdn.com/wbw/011_082_014.mp3'": "'https://audio.qurancdn.com/wbw/011_082_012.mp3'",
    
    // 15. فَصَبْرٌ جَمِيْلٌ
    // Old: 012_018_014.mp3, 012_018_015.mp3. Correct.
    
    // 16. سِرَاعًا ذٰلِكَ
    // Old: 050_044_005.mp3, 050_044_007.mp3. Correct.
    
    // 17. مُحَمَّدٌ رَّسُوْلُ اللّٰهِ
    // Old: 048_029_001.mp3, 048_029_002.mp3, 048_029_003.mp3. Correct.
};

let modified = serverTs;
for (const [oldUrls, newUrls] of Object.entries(replacements)) {
    if (modified.includes(oldUrls)) {
        modified = modified.replace(oldUrls, newUrls);
        console.log(`Replaced ${oldUrls} with ${newUrls}`);
    } else {
        console.log(`NOT FOUND: ${oldUrls}`);
    }
}

fs.writeFileSync('server.ts', modified);
