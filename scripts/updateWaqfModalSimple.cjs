const fs = require('fs');
const modalPath = '/app/applet/src/components/WaqfLessonModal.tsx';
let content = fs.readFileSync(modalPath, 'utf8');

// Let's replace the inner text of Noon Qutni paragraph directly
const target = `تنوین کے بعد ہمزہ وصلی آجائے تو وصل میں ہمزہ وصلی کو گراتے ہوئے تنوین کے نون ساکن کو زیر دے کر ایک چھوٹا سا نون لکھ دیا جاتا ہے اسے <span className="text-amber-400 font-bold">نون قطنی</span> کہتے ہیں۔`;

const replacement = `جب دو زبر، دو زیر یا دو پیش (تنوین) کے بعد همزه وصلی (ٱ) آجائے، تو وصل کی حالت میں همزه وصلی کو گراتے ہوئے تنوین کے نون ساکن کو زیر دے کر چھوٹا نون لکھ دیا جاتا ہے اسے <span className="text-amber-400 font-bold">نون قطنی</span> کہتے ہیں۔`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(modalPath, content, 'utf8');
  console.log('Successfully updated Noon Qutni definition text.');
} else {
  console.log('Target text not found.');
}
