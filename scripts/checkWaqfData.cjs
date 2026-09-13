const d = require('./src/data/waqfData.ts');
console.log('Total items:', d.WAQF_ITEMS.length);
d.WAQF_ITEMS.forEach((item, idx) => {
  console.log(`${idx+1}: id=${item.id}, normal="${item.textNormal}", waqf="${item.textWaqf}", category="${item.category}", audioKey=${item.audioKey || 'none'}`);
});
