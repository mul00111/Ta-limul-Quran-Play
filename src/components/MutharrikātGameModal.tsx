import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, ArrowRight, Sparkles, Trophy, Flame, Coins,
  Star, RefreshCw, Zap, CheckCircle2, XCircle, Timer, Mic, Layers
} from 'lucide-react';
import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect } from '../utils/qariAudioService';
import { LanguageCode } from '../types';
import { getMutaharrikatLocalization } from '../utils/mutaharrikatLocalization';

interface MutharrikātGameModalProps {
  onBack: () => void;
  currentLang?: LanguageCode;
}

export interface MutaḥarrikItem {
  id: string;
  letterBase: string; // e.g. "ب" or "وزن"
  letterName: string; // e.g. "باء" or "وَزَنَ"
  text: string;       // e.g. "بَ" or "وَزَنَ"
  harakat: string;    // 'زبر' | 'زیر' | 'پیش' | '۳ حرفی'
  rawSound: string;   // e.g. "بَ" or "وَزَنَ"
  isHeavy?: boolean;  // Heavy letters like خَ، صَ، ضَ، طَ، ظَ، غَ، قَ
  breakdown?: string; // e.g. "وَ + زَ + نَ"
}

// 1. Single Letter Mutaḥarrikāt (زبر، زیر، پیش)
const SINGLE_MUTAHARRIKAT_ITEMS: MutaḥarrikItem[] = [
  // Hamza / Alif
  { id: '1-zabar', letterBase: 'ء', letterName: 'ہمزہ', text: 'أَ', harakat: 'زبر', rawSound: 'أَ' },
  { id: '1-zer', letterBase: 'ء', letterName: 'ہمزہ', text: 'إِ', harakat: 'زیر', rawSound: 'إِ' },
  { id: '1-pesh', letterBase: 'ء', letterName: 'ہمزہ', text: 'أُ', harakat: 'پیش', rawSound: 'أُ' },

  // Baa
  { id: '2-zabar', letterBase: 'ب', letterName: 'باء', text: 'بَ', harakat: 'زبر', rawSound: 'بَ' },
  { id: '2-zer', letterBase: 'ب', letterName: 'باء', text: 'بِ', harakat: 'زیر', rawSound: 'بِ' },
  { id: '2-pesh', letterBase: 'ب', letterName: 'باء', text: 'بُ', harakat: 'پیش', rawSound: 'بُ' },

  // Taa
  { id: '3-zabar', letterBase: 'ت', letterName: 'تاء', text: 'تَ', harakat: 'زبر', rawSound: 'تَ' },
  { id: '3-zer', letterBase: 'ت', letterName: 'تاء', text: 'تِ', harakat: 'زیر', rawSound: 'تِ' },
  { id: '3-pesh', letterBase: 'ت', letterName: 'تاء', text: 'تُ', harakat: 'پیش', rawSound: 'تُ' },

  // Thaa
  { id: '4-zabar', letterBase: 'ث', letterName: 'ثاء', text: 'ثَ', harakat: 'زبر', rawSound: 'ثَ' },
  { id: '4-zer', letterBase: 'ث', letterName: 'ثاء', text: 'ثِ', harakat: 'زیر', rawSound: 'ثِ' },
  { id: '4-pesh', letterBase: 'ث', letterName: 'ثاء', text: 'ثُ', harakat: 'پیش', rawSound: 'ثُ' },

  // Jeem
  { id: '5-zabar', letterBase: 'ج', letterName: 'جیم', text: 'جَ', harakat: 'زبر', rawSound: 'جَ' },
  { id: '5-zer', letterBase: 'ج', letterName: 'جیم', text: 'جِ', harakat: 'زیر', rawSound: 'جِ' },
  { id: '5-pesh', letterBase: 'ج', letterName: 'جیم', text: 'جُ', harakat: 'پیش', rawSound: 'جُ' },

  // Haa
  { id: '6-zabar', letterBase: 'ح', letterName: 'حاء', text: 'حَ', harakat: 'زبر', rawSound: 'حَ' },
  { id: '6-zer', letterBase: 'ح', letterName: 'حاء', text: 'حِ', harakat: 'زیر', rawSound: 'حِ' },
  { id: '6-pesh', letterBase: 'ح', letterName: 'حاء', text: 'حُ', harakat: 'پیش', rawSound: 'حُ' },

  // Khaa
  { id: '7-zabar', letterBase: 'خ', letterName: 'خاء', text: 'خَ', harakat: 'زبر', rawSound: 'خَ', isHeavy: true },
  { id: '7-zer', letterBase: 'خ', letterName: 'خاء', text: 'خِ', harakat: 'زیر', rawSound: 'خِ' },
  { id: '7-pesh', letterBase: 'خ', letterName: 'خاء', text: 'خُ', harakat: 'پیش', rawSound: 'خُ', isHeavy: true },

  // Daal
  { id: '8-zabar', letterBase: 'د', letterName: 'دال', text: 'دَ', harakat: 'زبر', rawSound: 'دَ' },
  { id: '8-zer', letterBase: 'د', letterName: 'دال', text: 'دِ', harakat: 'زیر', rawSound: 'دِ' },
  { id: '8-pesh', letterBase: 'د', letterName: 'دال', text: 'دُ', harakat: 'پیش', rawSound: 'دُ' },

  // Zaal
  { id: '9-zabar', letterBase: 'ذ', letterName: 'ذال', text: 'ذَ', harakat: 'زبر', rawSound: 'ذَ' },
  { id: '9-zer', letterBase: 'ذ', letterName: 'ذال', text: 'ذِ', harakat: 'زیر', rawSound: 'ذِ' },
  { id: '9-pesh', letterBase: 'ذ', letterName: 'ذال', text: 'ذُ', harakat: 'پیش', rawSound: 'ذُ' },

  // Raa
  { id: '10-zabar', letterBase: 'ر', letterName: 'راء', text: 'رَ', harakat: 'زبر', rawSound: 'رَ', isHeavy: true },
  { id: '10-zer', letterBase: 'ر', letterName: 'راء', text: 'رِ', harakat: 'زیر', rawSound: 'رِ' },
  { id: '10-pesh', letterBase: 'ر', letterName: 'راء', text: 'رُ', harakat: 'پیش', rawSound: 'رُ', isHeavy: true },

  // Zaa
  { id: '11-zabar', letterBase: 'ز', letterName: 'زَاءْ', text: 'زَ', harakat: 'زبر', rawSound: 'زَ' },
  { id: '11-zer', letterBase: 'ز', letterName: 'زَاءْ', text: 'زِ', harakat: 'زیر', rawSound: 'زِ' },
  { id: '11-pesh', letterBase: 'ز', letterName: 'زَاءْ', text: 'زُ', harakat: 'پیش', rawSound: 'زُ' },

  // Seen
  { id: '12-zabar', letterBase: 'س', letterName: 'سین', text: 'سَ', harakat: 'زبر', rawSound: 'سَ' },
  { id: '12-zer', letterBase: 'س', letterName: 'سین', text: 'سِ', harakat: 'زیر', rawSound: 'سِ' },
  { id: '12-pesh', letterBase: 'س', letterName: 'سین', text: 'سُ', harakat: 'پیش', rawSound: 'سُ' },

  // Sheen
  { id: '13-zabar', letterBase: 'ش', letterName: 'شین', text: 'شَ', harakat: 'زبر', rawSound: 'شَ' },
  { id: '13-zer', letterBase: 'ش', letterName: 'شین', text: 'شِ', harakat: 'زیر', rawSound: 'شِ' },
  { id: '13-pesh', letterBase: 'ش', letterName: 'شین', text: 'شُ', harakat: 'پیش', rawSound: 'شُ' },

  // Saad
  { id: '14-zabar', letterBase: 'ص', letterName: 'صاد', text: 'صَ', harakat: 'زبر', rawSound: 'صَ', isHeavy: true },
  { id: '14-zer', letterBase: 'ص', letterName: 'صاد', text: 'صِ', harakat: 'زیر', rawSound: 'صِ' },
  { id: '14-pesh', letterBase: 'ص', letterName: 'صاد', text: 'صُ', harakat: 'پیش', rawSound: 'صُ', isHeavy: true },

  // Daad
  { id: '15-zabar', letterBase: 'ض', letterName: 'ضاد', text: 'ضَ', harakat: 'زبر', rawSound: 'ضَ', isHeavy: true },
  { id: '15-zer', letterBase: 'ض', letterName: 'ضاد', text: 'ضِ', harakat: 'زیر', rawSound: 'ضِ', isHeavy: true },
  { id: '15-pesh', letterBase: 'ض', letterName: 'ضاد', text: 'ضُ', harakat: 'پیش', rawSound: 'ضُ', isHeavy: true },

  // Taa (Heavy)
  { id: '16-zabar', letterBase: 'ط', letterName: 'طاء', text: 'طَ', harakat: 'زبر', rawSound: 'طَ', isHeavy: true },
  { id: '16-zer', letterBase: 'ط', letterName: 'طاء', text: 'طِ', harakat: 'زیر', rawSound: 'طِ', isHeavy: true },
  { id: '16-pesh', letterBase: 'ط', letterName: 'طاء', text: 'طُ', harakat: 'پیش', rawSound: 'طُ', isHeavy: true },

  // Zaa (Heavy)
  { id: '17-zabar', letterBase: 'ظ', letterName: 'ظاء', text: 'ظَ', harakat: 'زبر', rawSound: 'ظَ', isHeavy: true },
  { id: '17-zer', letterBase: 'ظ', letterName: 'ظاء', text: 'ظِ', harakat: 'زیر', rawSound: 'ظِ', isHeavy: true },
  { id: '17-pesh', letterBase: 'ظ', letterName: 'ظاء', text: 'ظُ', harakat: 'پیش', rawSound: 'ظُ', isHeavy: true },

  // Ain
  { id: '18-zabar', letterBase: 'ع', letterName: 'عین', text: 'عَ', harakat: 'زبر', rawSound: 'عَ' },
  { id: '18-zer', letterBase: 'ع', letterName: 'عین', text: 'عِ', harakat: 'زیر', rawSound: 'عِ' },
  { id: '18-pesh', letterBase: 'ع', letterName: 'عین', text: 'عُ', harakat: 'پیش', rawSound: 'عُ' },

  // Ghain
  { id: '19-zabar', letterBase: 'غ', letterName: 'غین', text: 'غَ', harakat: 'زبر', rawSound: 'غَ', isHeavy: true },
  { id: '19-zer', letterBase: 'غ', letterName: 'غین', text: 'غِ', harakat: 'زیر', rawSound: 'غِ' },
  { id: '19-pesh', letterBase: 'غ', letterName: 'غین', text: 'غُ', harakat: 'پیش', rawSound: 'غُ', isHeavy: true },

  // Faa
  { id: '20-zabar', letterBase: 'ف', letterName: 'فاء', text: 'فَ', harakat: 'زبر', rawSound: 'فَ' },
  { id: '20-zer', letterBase: 'ف', letterName: 'فاء', text: 'فِ', harakat: 'زیر', rawSound: 'فِ' },
  { id: '20-pesh', letterBase: 'ف', letterName: 'فاء', text: 'فُ', harakat: 'پیش', rawSound: 'فُ' },

  // Qaaf
  { id: '21-zabar', letterBase: 'ق', letterName: 'قاف', text: 'قَ', harakat: 'زبر', rawSound: 'قَ', isHeavy: true },
  { id: '21-zer', letterBase: 'ق', letterName: 'قاف', text: 'قِ', harakat: 'زیر', rawSound: 'قِ', isHeavy: true },
  { id: '21-pesh', letterBase: 'ق', letterName: 'قاف', text: 'قُ', harakat: 'پیش', rawSound: 'قُ', isHeavy: true },

  // Kaaf
  { id: '22-zabar', letterBase: 'ك', letterName: 'کاف', text: 'كَ', harakat: 'زبر', rawSound: 'كَ' },
  { id: '22-zer', letterBase: 'ك', letterName: 'کاف', text: 'كِ', harakat: 'زیر', rawSound: 'كِ' },
  { id: '22-pesh', letterBase: 'ك', letterName: 'کاف', text: 'كُ', harakat: 'پیش', rawSound: 'كُ' },

  // Laam
  { id: '23-zabar', letterBase: 'ل', letterName: 'لام', text: 'لَ', harakat: 'زبر', rawSound: 'لَ' },
  { id: '23-zer', letterBase: 'ل', letterName: 'لام', text: 'لِ', harakat: 'زیر', rawSound: 'لِ' },
  { id: '23-pesh', letterBase: 'ل', letterName: 'لام', text: 'لُ', harakat: 'پیش', rawSound: 'لُ' },

  // Meem
  { id: '24-zabar', letterBase: 'م', letterName: 'میم', text: 'مَ', harakat: 'زبر', rawSound: 'مَ' },
  { id: '24-zer', letterBase: 'م', letterName: 'میم', text: 'مِ', harakat: 'زیر', rawSound: 'مِ' },
  { id: '24-pesh', letterBase: 'م', letterName: 'میم', text: 'مُ', harakat: 'پیش', rawSound: 'مُ' },

  // Noon
  { id: '25-zabar', letterBase: 'ن', letterName: 'نون', text: 'نَ', harakat: 'زبر', rawSound: 'نَ' },
  { id: '25-zer', letterBase: 'ن', letterName: 'نون', text: 'نِ', harakat: 'زیر', rawSound: 'نِ' },
  { id: '25-pesh', letterBase: 'ن', letterName: 'نون', text: 'نُ', harakat: 'پیش', rawSound: 'نُ' },

  // Waw
  { id: '26-zabar', letterBase: 'و', letterName: 'واو', text: 'وَ', harakat: 'زبر', rawSound: 'وَ' },
  { id: '26-zer', letterBase: 'و', letterName: 'واو', text: 'وِ', harakat: 'زیر', rawSound: 'وِ' },
  { id: '26-pesh', letterBase: 'و', letterName: 'واو', text: 'وُ', harakat: 'پیش', rawSound: 'وُ' },

  // Haa
  { id: '27-zabar', letterBase: 'ه', letterName: 'هاء', text: 'هَ', harakat: 'زبر', rawSound: 'هَ' },
  { id: '27-zer', letterBase: 'ه', letterName: 'هاء', text: 'هِ', harakat: 'زیر', rawSound: 'هِ' },
  { id: '27-pesh', letterBase: 'ه', letterName: 'هاء', text: 'هُ', harakat: 'پیش', rawSound: 'هُ' },

  // Yaa
  { id: '28-zabar', letterBase: 'ي', letterName: 'یاء', text: 'يَ', harakat: 'زبر', rawSound: 'يَ' },
  { id: '28-zer', letterBase: 'ي', letterName: 'یاء', text: 'يِ', harakat: 'زیر', rawSound: 'يِ' },
  { id: '28-pesh', letterBase: 'ي', letterName: 'یاء', text: 'يُ', harakat: 'پیش', rawSound: 'يُ' },
];

// 2. MASSIVE COLLECTION OF 2-LETTER MUTAHARRIKĀT WORDS (۲ حرفی متحرک کلمات - نورانی و مدنی قاعدہ)
const TWO_LETTER_MUTAHARRIKAT_ITEMS: MutaḥarrikItem[] = [
  // 1. Authentic Mashq Words from Qaida (Zabar, Zer, Pesh)
  { id: '2w-raba', letterBase: 'رب', letterName: 'رَبَ', text: 'رَبَ', harakat: '۲ حرفی (زبر)', rawSound: 'رَبَ', breakdown: 'رَ + بَ', isHeavy: true },
  { id: '2w-dama', letterBase: 'دم', letterName: 'دَمَ', text: 'دَمَ', harakat: '۲ حرفی (زبر)', rawSound: 'دَمَ', breakdown: 'دَ + مَ' },
  { id: '2w-maa', letterBase: 'مع', letterName: 'مَعَ', text: 'مَعَ', harakat: '۲ حرفی (زبر)', rawSound: 'مَعَ', breakdown: 'مَ + عَ' },
  { id: '2w-tara', letterBase: 'تر', letterName: 'تَرَ', text: 'تَرَ', harakat: '۲ حرفی (زبر)', rawSound: 'تَرَ', breakdown: 'تَ + رَ', isHeavy: true },
  { id: '2w-laka', letterBase: 'لك', letterName: 'لَكَ', text: 'لَكَ', harakat: '۲ حرفی (زبر)', rawSound: 'لَكَ', breakdown: 'لَ + كَ' },

  { id: '2w-izi', letterBase: 'إذ', letterName: 'إِذِ', text: 'إِذِ', harakat: '۲ حرفی (زیر)', rawSound: 'إِذِ', breakdown: 'إِ + ذِ' },
  { id: '2w-lima', letterBase: 'لم', letterName: 'لِمَ', text: 'لِمَ', harakat: '۲ حرفی (زیر)', rawSound: 'لِمَ', breakdown: 'لِ + مَ' },
  { id: '2w-bika', letterBase: 'بك', letterName: 'بِكَ', text: 'بِكَ', harakat: '۲ حرفی (زیر)', rawSound: 'بِكَ', breakdown: 'بِ + كَ' },
  { id: '2w-hiya', letterBase: 'هي', letterName: 'هِيَ', text: 'هِيَ', harakat: '۲ حرفی (زیر)', rawSound: 'هِيَ', breakdown: 'هِ + يَ' },
  { id: '2w-bihi', letterBase: 'به', letterName: 'بِهِ', text: 'بِهِ', harakat: '۲ حرفی (زیر)', rawSound: 'بِهِ', breakdown: 'بِ + هِ' },

  { id: '2w-ukhu', letterBase: 'أخ', letterName: 'أُخُ', text: 'أُخُ', harakat: '۲ حرفی (پیش)', rawSound: 'أُخُ', breakdown: 'أُ + خُ', isHeavy: true },
  { id: '2w-uku', letterBase: 'أك', letterName: 'أُكُ', text: 'أُكُ', harakat: '۲ حرفی (پیش)', rawSound: 'أُكُ', breakdown: 'أُ + كُ' },
  { id: '2w-qumi', letterBase: 'قم', letterName: 'قُمِ', text: 'قُمِ', harakat: '۲ حرفی (پیش)', rawSound: 'قُمِ', breakdown: 'قُ + مِ', isHeavy: true },
  { id: '2w-khuzi', letterBase: 'خذ', letterName: 'خُذِ', text: 'خُذِ', harakat: '۲ حرفی (پیش)', rawSound: 'خُذِ', breakdown: 'خُ + ذِ', isHeavy: true },
  { id: '2w-huwa', letterBase: 'هو', letterName: 'هُوَ', text: 'هُوَ', harakat: '۲ حرفی (پیش)', rawSound: 'هُوَ', breakdown: 'هُ + وَ' },
  { id: '2w-lahu', letterBase: 'له', letterName: 'لَهُ', text: 'لَهُ', harakat: '۲ حرفی (پیش)', rawSound: 'لَهُ', breakdown: 'لَ + هُ' },

  // Additional 2-letter combos
  { id: '2w-dara', letterBase: 'در', letterName: 'دَرَ', text: 'دَرَ', harakat: '۲ حرفی', rawSound: 'دَرَ', breakdown: 'دَ + رَ' },
  { id: '2w-zara', letterBase: 'زر', letterName: 'زَرَ', text: 'زَرَ', harakat: '۲ حرفی', rawSound: 'زَرَ', breakdown: 'زَ + رَ' },
  { id: '2w-rada', letterBase: 'رد', letterName: 'رَدَ', text: 'رَدَ', harakat: '۲ حرفی', rawSound: 'رَدَ', breakdown: 'رَ + دَ' },
  { id: '2w-wada', letterBase: 'ود', letterName: 'وَدَ', text: 'وَدَ', harakat: '۲ حرفی', rawSound: 'وَدَ', breakdown: 'وَ + دَ' },
  { id: '2w-ada', letterBase: 'عد', letterName: 'عَدَ', text: 'عَدَ', harakat: '۲ حرفی', rawSound: 'عَدَ', breakdown: 'عَ + دَ' },
  { id: '2w-qama', letterBase: 'قم', letterName: 'قَمَ', text: 'قَمَ', harakat: '۲ حرفی', rawSound: 'قَمَ', breakdown: 'قَ + مَ' },
  { id: '2w-bala', letterBase: 'بل', letterName: 'بَلَ', text: 'بَلَ', harakat: '۲ حرفی', rawSound: 'بَلَ', breakdown: 'بَ + لَ' },
  { id: '2w-lama', letterBase: 'لم', letterName: 'لَمَ', text: 'لَمَ', harakat: '۲ حرفی', rawSound: 'لَمَ', breakdown: 'لَ + مَ' },
  { id: '2w-ana', letterBase: 'عن', letterName: 'عَنَ', text: 'عَنَ', harakat: '۲ حرفی', rawSound: 'عَنَ', breakdown: 'عَ + نَ' },
  { id: '2w-taba', letterBase: 'طب', letterName: 'طَبَ', text: 'طَبَ', harakat: '۲ حرفی', rawSound: 'طَبَ', breakdown: 'طَ + بَ' },
  { id: '2w-daa', letterBase: 'دع', letterName: 'دَعَ', text: 'دَعَ', harakat: '۲ حرفی', rawSound: 'دَعَ', breakdown: 'دَ + عَ' },
  { id: '2w-sara', letterBase: 'سر', letterName: 'سَرَ', text: 'سَرَ', harakat: '۲ حرفی', rawSound: 'سَرَ', breakdown: 'سَ + رَ' },
  { id: '2w-kasa', letterBase: 'كس', letterName: 'كَسَ', text: 'كَسَ', harakat: '۲ حرفی', rawSound: 'كَسَ', breakdown: 'كَ + سَ' },
  { id: '2w-nawa', letterBase: 'نو', letterName: 'نَوَ', text: 'نَوَ', harakat: '۲ حرفی', rawSound: 'نَوَ', breakdown: 'نَ + وَ' },
  { id: '2w-qada', letterBase: 'قد', letterName: 'قَدَ', text: 'قَدَ', harakat: '۲ حرفی', rawSound: 'قَدَ', breakdown: 'قَ + دَ' },
  { id: '2w-mala', letterBase: 'مل', letterName: 'مَلَ', text: 'مَلَ', harakat: '۲ حرفی', rawSound: 'مَلَ', breakdown: 'مَ + لَ' },
  { id: '2w-wara', letterBase: 'ور', letterName: 'وَرِ', text: 'وَرِ', harakat: '۲ حرفی', rawSound: 'وَرِ', breakdown: 'وَ + رِ' },
  { id: '2w-sama', letterBase: 'سم', letterName: 'سَمِ', text: 'سَمِ', harakat: '۲ حرفی', rawSound: 'سَمِ', breakdown: 'سَ + مِ' },
  { id: '2w-hama', letterBase: 'حم', letterName: 'حَمِ', text: 'حَمِ', harakat: '۲ حرفی', rawSound: 'حَمِ', breakdown: 'حَ + مِ' },
  { id: '2w-fata', letterBase: 'فت', letterName: 'فَتَ', text: 'فَتَ', harakat: '۲ حرفی', rawSound: 'فَتَ', breakdown: 'فَ + تَ' },
  { id: '2w-kata', letterBase: 'كت', letterName: 'كَتَ', text: 'كَتَ', harakat: '۲ حرفی', rawSound: 'كَتَ', breakdown: 'كَ + تَ' },
  { id: '2w-qulu', letterBase: 'قل', letterName: 'قُلِ', text: 'قُلِ', harakat: '۲ حرفی', rawSound: 'قُلِ', breakdown: 'قُ + لِ' },
  { id: '2w-kuti', letterBase: 'كت', letterName: 'كُتِ', text: 'كُتِ', harakat: '۲ حرفی', rawSound: 'كُتِ', breakdown: 'كُ + تِ' },
  { id: '2w-khuli', letterBase: 'خل', letterName: 'خُلِ', text: 'خُلِ', harakat: '۲ حرفی', rawSound: 'خُلِ', breakdown: 'خُ + لِ' },
  { id: '2w-ruzi', letterBase: 'رز', letterName: 'رُزِ', text: 'رُزِ', harakat: '۲ حرفی', rawSound: 'رُزِ', breakdown: 'رُ + زِ' },
  { id: '2w-jui', letterBase: 'جع', letterName: 'جُعِ', text: 'جُعِ', harakat: '۲ حرفی', rawSound: 'جُعِ', breakdown: 'جُ + عِ' }
];

// 3. MASSIVE COLLECTION OF 3-LETTER MURAKKABĀT (۳ حرفی متحرک مرکبات - ۳۳ کلمات مشق)
const THREE_LETTER_MURAKKABAT_ITEMS: MutaḥarrikItem[] = [
  // 1. Zabar Mashq 3-letter Words
  { id: '3w-wazana', letterBase: 'وزن', letterName: 'وَزَنَ', text: 'وَزَنَ', harakat: '۳ حرفی (زبر)', rawSound: 'وَزَنَ', breakdown: 'وَ + زَ + نَ' },
  { id: '3w-warada', letterBase: 'ورد', letterName: 'وَرَدَ', text: 'وَرَدَ', harakat: '۳ حرفی (زبر)', rawSound: 'وَرَدَ', breakdown: 'وَ + رَ + دَ', isHeavy: true },
  { id: '3w-wazara', letterBase: 'وزر', letterName: 'وَزَرَ', text: 'وَزَرَ', harakat: '۳ حرفی (زبر)', rawSound: 'وَزَرَ', breakdown: 'وَ + زَ + رَ', isHeavy: true },
  { id: '3w-zaraa', letterBase: 'زرع', letterName: 'زَرَعَ', text: 'زَرَعَ', harakat: '۳ حرفی (زبر)', rawSound: 'زَرَعَ', breakdown: 'زَ + رَ + عَ', isHeavy: true },
  { id: '3w-daraka', letterBase: 'درك', letterName: 'دَرَكَ', text: 'دَرَكَ', harakat: '۳ حرفی (زبر)', rawSound: 'دَرَكَ', breakdown: 'دَ + رَ + كَ', isHeavy: true },
  { id: '3w-zakara', letterBase: 'ذكر', letterName: 'ذَكَرَ', text: 'ذَكَرَ', harakat: '۳ حرفی (زبر)', rawSound: 'ذَكَرَ', breakdown: 'ذَ + كَ + رَ', isHeavy: true },
  { id: '3w-walada', letterBase: 'ولد', letterName: 'وَلَدَ', text: 'وَلَدَ', harakat: '۳ حرفی (زبر)', rawSound: 'وَلَدَ', breakdown: 'وَ + لَ + دَ' },
  { id: '3w-ashara', letterBase: 'عشر', letterName: 'عَشَرَ', text: 'عَشَرَ', harakat: '۳ حرفی (زبر)', rawSound: 'عَشَرَ', breakdown: 'عَ + شَ + رَ', isHeavy: true },
  { id: '3w-adala', letterBase: 'عدل', letterName: 'عَدَلَ', text: 'عَدَلَ', harakat: '۳ حرفی (زبر)', rawSound: 'عَدَلَ', breakdown: 'عَ + دَ + لَ' },
  { id: '3w-sadaqa', letterBase: 'صدق', letterName: 'صَدَقَ', text: 'صَدَقَ', harakat: '۳ حرفی (زبر)', rawSound: 'صَدَقَ', breakdown: 'صَ + دَ + قَ', isHeavy: true },
  { id: '3w-rafaa', letterBase: 'رفع', letterName: 'رَفَعَ', text: 'رَفَعَ', harakat: '۳ حرفی (زبر)', rawSound: 'رَفَعَ', breakdown: 'رَ + فَ + عَ', isHeavy: true },

  // 2. Zer Mashq 3-letter Words
  { id: '3w-irama', letterBase: 'إرم', letterName: 'إِرَمَ', text: 'إِرَمَ', harakat: '۳ حرفی (زیر)', rawSound: 'إِرَمَ', breakdown: 'إِ + رَ + مَ', isHeavy: true },
  { id: '3w-azina', letterBase: 'أذن', letterName: 'أَذِنَ', text: 'أَذِنَ', harakat: '۳ حرفی (زیر)', rawSound: 'أَذِنَ', breakdown: 'أَ + ذِ + نَ' },
  { id: '3w-rahima', letterBase: 'رحم', letterName: 'رَحِمَ', text: 'رَحِمَ', harakat: '۳ حرفی (زیر)', rawSound: 'رَحِمَ', breakdown: 'رَ + حِ + مَ', isHeavy: true },
  { id: '3w-qadima', letterBase: 'قدم', letterName: 'قَدِمَ', text: 'قَدِمَ', harakat: '۳ حرفی (زیر)', rawSound: 'قَدِمَ', breakdown: 'قَ + دِ + مَ', isHeavy: true },
  { id: '3w-kaziba', letterBase: 'كذب', letterName: 'كَذِبَ', text: 'كَذِبَ', harakat: '۳ حرفی (زیر)', rawSound: 'كَذِبَ', breakdown: 'كَ + ذِ + بَ' },
  { id: '3w-radiya', letterBase: 'رضي', letterName: 'رَضِيَ', text: 'رَضِيَ', harakat: '۳ حرفی (زیر)', rawSound: 'رَضِيَ', breakdown: 'رَ + ضِ + يَ', isHeavy: true },
  { id: '3w-raqabi', letterBase: 'رقب', letterName: 'رَقَبِ', text: 'رَقَبِ', harakat: '۳ حرفی (زیر)', rawSound: 'رَقَبِ', breakdown: 'رَ + قَ + بِ', isHeavy: true },
  { id: '3w-ibili', letterBase: 'إبل', letterName: 'إِبِلِ', text: 'إِبِلِ', harakat: '۳ حرفی (زیر)', rawSound: 'إِبِلِ', breakdown: 'إِ + بِ + لِ' },
  { id: '3w-baladi', letterBase: 'بلد', letterName: 'بَلَدِ', text: 'بَلَدِ', harakat: '۳ حرفی (زیر)', rawSound: 'بَلَدِ', breakdown: 'بَ + لَ + دِ' },
  { id: '3w-shariba', letterBase: 'شرب', letterName: 'شَرِبَ', text: 'شَرِبَ', harakat: '۳ حرفی (زیر)', rawSound: 'شَرِبَ', breakdown: 'شَ + رِ + بَ' },
  { id: '3w-hatabi', letterBase: 'حطب', letterName: 'حَطَبِ', text: 'حَطَبِ', harakat: '۳ حرفی (زیر)', rawSound: 'حَطَبِ', breakdown: 'حَ + طَ + بِ', isHeavy: true },

  // 3. Pesh Mashq 3-letter Words
  { id: '3w-uuida', letterBase: 'وعد', letterName: 'وُعِدَ', text: 'وُعِدَ', harakat: '۳ حرفی (پیش)', rawSound: 'وُعِدَ', breakdown: 'وُ + عِ + دَ' },
  { id: '3w-qudira', letterBase: 'قدر', letterName: 'قُدِرَ', text: 'قُدِرَ', harakat: '۳ حرفی (پیش)', rawSound: 'قُدِرَ', breakdown: 'قُ + دِ + رَ', isHeavy: true },
  { id: '3w-qudusi', letterBase: 'قدس', letterName: 'قُدُسِ', text: 'قُدُسِ', harakat: '۳ حرفی (پیش)', rawSound: 'قُدُسِ', breakdown: 'قُ + دُ + سِ', isHeavy: true },
  { id: '3w-ufuqi', letterBase: 'أفق', letterName: 'أُفُقِ', text: 'أُفُقِ', harakat: '۳ حرفی (پیش)', rawSound: 'أُفُقِ', breakdown: 'أُ + فُ + قِ', isHeavy: true },
  { id: '3w-rubuu', letterBase: 'ربع', letterName: 'رُبُعُ', text: 'رُبُعُ', harakat: '۳ حرفی (پیش)', rawSound: 'رُبُعُ', breakdown: 'رُ + بُ + عُ', isHeavy: true },
  { id: '3w-zuburi', letterBase: 'زبر', letterName: 'زُبُرِ', text: 'زُبُرِ', harakat: '۳ حرفی (پیش)', rawSound: 'زُبُرِ', breakdown: 'زُ + بُ + رِ' },
  { id: '3w-umami', letterBase: 'أمم', letterName: 'أُمَمِ', text: 'أُمَمِ', harakat: '۳ حرفی (پیش)', rawSound: 'أُمَمِ', breakdown: 'أُ + مَ + مِ' },
  { id: '3w-masalu', letterBase: 'مثل', letterName: 'مَثَلُ', text: 'مَثَلُ', harakat: '۳ حرفی (پیش)', rawSound: 'مَثَلُ', breakdown: 'مَ + ثَ + لُ' },
  { id: '3w-sulusu', letterBase: 'ثلث', letterName: 'ثُلُثُ', text: 'ثُلُثُ', harakat: '۳ حرفی (پیش)', rawSound: 'ثُلُثُ', breakdown: 'ثُ + لُ + ثُ' },
  { id: '3w-rusulu', letterBase: 'رسل', letterName: 'رُسُلُ', text: 'رُسُلُ', harakat: '۳ حرفی (پیش)', rawSound: 'رُسُلُ', breakdown: 'رُ + سُ + لُ', isHeavy: true },

  // Additional Quranic Murakkabat
  { id: '3w-amara', letterBase: 'امر', letterName: 'أَمَرَ', text: 'أَمَرَ', harakat: '۳ حرفی', rawSound: 'أَمَرَ', breakdown: 'أَ + مَ + رَ' },
  { id: '3w-balagha', letterBase: 'بلغ', letterName: 'بَلَغَ', text: 'بَلَغَ', harakat: '۳ حرفی', rawSound: 'بَلَغَ', breakdown: 'بَ + لَ + غَ' },
  { id: '3w-wahuwa', letterBase: 'وهو', letterName: 'وَهُوَ', text: 'وَهُوَ', harakat: '۳ حرفی', rawSound: 'وَهُوَ', breakdown: 'وَ + هُ + وَ' },
  { id: '3w-kataba', letterBase: 'كتب', letterName: 'كَتَبَ', text: 'كَتَبَ', harakat: '۳ حرفی', rawSound: 'كَتَبَ', breakdown: 'كَ + تَ + بَ' },
  { id: '3w-qaraa', letterBase: 'قرأ', letterName: 'قَرَأَ', text: 'قَرَأَ', harakat: '۳ حرفی', rawSound: 'قَرَأَ', breakdown: 'قَ + رَ + أَ' },
  { id: '3w-dakhala', letterBase: 'دخل', letterName: 'دَخَلَ', text: 'دَخَلَ', harakat: '۳ حرفی', rawSound: 'دَخَلَ', breakdown: 'دَ + خَ + لَ' },
  { id: '3w-khalaqa', letterBase: 'خلق', letterName: 'خَلَقَ', text: 'خَلَقَ', harakat: '۳ حرفی', rawSound: 'خَلَقَ', breakdown: 'خَ + لَ + قَ' },
  { id: '3w-razaqa', letterBase: 'رزق', letterName: 'رَزَقَ', text: 'رَزَقَ', harakat: '۳ حرفی', rawSound: 'رَزَقَ', breakdown: 'رَ + زَ + قَ' },
  { id: '3w-jaala', letterBase: 'جعل', letterName: 'جَعَلَ', text: 'جَعَلَ', harakat: '۳ حرفی', rawSound: 'جَعَلَ', breakdown: 'جَ + عَ + لَ' },
  { id: '3w-alima', letterBase: 'علم', letterName: 'عَلِمَ', text: 'عَلِمَ', harakat: '۳ حرفی', rawSound: 'عَلِمَ', breakdown: 'عَ + لِ + مَ' },
  { id: '3w-amila', letterBase: 'عمل', letterName: 'عَمِلَ', text: 'عَمِلَ', harakat: '۳ حرفی', rawSound: 'عَمِلَ', breakdown: 'عَ + مِ + لَ' },
  { id: '3w-samia', letterBase: 'سمع', letterName: 'سَمِعَ', text: 'سَمِعَ', harakat: '۳ حرفی', rawSound: 'سَمِعَ', breakdown: 'سَ + مِ + عَ' },
  { id: '3w-hamida', letterBase: 'حمد', letterName: 'حَمِدَ', text: 'حَمِدَ', harakat: '۳ حرفی', rawSound: 'حَمِدَ', breakdown: 'حَ + مِ + دَ' },
  { id: '3w-abada', letterBase: 'عبد', letterName: 'عَبَدَ', text: 'عَبَدَ', harakat: '۳ حرفی', rawSound: 'عَبَدَ', breakdown: 'عَ + بَ + دَ' },
  { id: '3w-nasara', letterBase: 'نصر', letterName: 'نَصَرَ', text: 'نَصَرَ', harakat: '۳ حرفی', rawSound: 'نَصَرَ', breakdown: 'نَ + صَ + رَ' },
  { id: '3w-daraba', letterBase: 'ضرب', letterName: 'ضَرَبَ', text: 'ضَرَبَ', harakat: '۳ حرفی', rawSound: 'ضَرَبَ', breakdown: 'ضَ + رَ + بَ' },
  { id: '3w-fataha', letterBase: 'فتح', letterName: 'فَتَحَ', text: 'فَتَحَ', harakat: '۳ حرفی', rawSound: 'فَتَحَ', breakdown: 'فَ + تَ + حَ' },
  { id: '3w-wajada', letterBase: 'وجد', letterName: 'وَجَدَ', text: 'وَجَدَ', harakat: '۳ حرفی', rawSound: 'وَجَدَ', breakdown: 'وَ + جَ + دَ' },
  { id: '3w-wadaa', letterBase: 'وضع', letterName: 'وَضَعَ', text: 'وَضَعَ', harakat: '۳ حرفی', rawSound: 'وَضَعَ', breakdown: 'وَ + ضَ + عَ' },
  { id: '3w-jamaa', letterBase: 'جمع', letterName: 'جَمَعَ', text: 'جَمَعَ', harakat: '۳ حرفی', rawSound: 'جَمَعَ', breakdown: 'جَ + مَ + عَ' },
  { id: '3w-sajada', letterBase: 'سجد', letterName: 'سَجَدَ', text: 'سَجَدَ', harakat: '۳ حرفی', rawSound: 'سَجَدَ', breakdown: 'سَ + جَ + دَ' },
  { id: '3w-shakara', letterBase: 'شكر', letterName: 'شَكَرَ', text: 'شَكَرَ', harakat: '۳ حرفی', rawSound: 'شَكَرَ', breakdown: 'شَ + كَ + رَ' },
  { id: '3w-sabara', letterBase: 'صبر', letterName: 'صَبَرَ', text: 'صَبَرَ', harakat: '۳ حرفی', rawSound: 'صَبَرَ', breakdown: 'صَ + بَ + رَ' },
  { id: '3w-qadara', letterBase: 'قدر', letterName: 'قَدَرَ', text: 'قَدَرَ', harakat: '۳ حرفی', rawSound: 'قَدَرَ', breakdown: 'قَ + دَ + رَ' },
  { id: '3w-baasa', letterBase: 'بعث', letterName: 'بَعَثَ', text: 'بَعَثَ', harakat: '۳ حرفی', rawSound: 'بَعَثَ', breakdown: 'بَ + عَ + ثَ' },
  { id: '3w-hakama', letterBase: 'حكم', letterName: 'حَكَمَ', text: 'حَكَمَ', harakat: '۳ حرفی', rawSound: 'حَكَمَ', breakdown: 'حَ + كَ + مَ' },
  { id: '3w-nazala', letterBase: 'نزل', letterName: 'نَزَلَ', text: 'نَزَلَ', harakat: '۳ حرفی', rawSound: 'نَزَلَ', breakdown: 'نَ + زَ + لَ' },
  { id: '3w-arafa', letterBase: 'عرف', letterName: 'عَرَفَ', text: 'عَرَفَ', harakat: '۳ حرفی', rawSound: 'عَرَفَ', breakdown: 'عَ + رَ + فَ' },
  { id: '3w-kafara', letterBase: 'كفر', letterName: 'كَفَرَ', text: 'كَفَرَ', harakat: '۳ حرفی', rawSound: 'كَفَرَ', breakdown: 'كَ + فَ + رَ' },
  { id: '3w-zalama', letterBase: 'ظلم', letterName: 'ظَلَمَ', text: 'ظَلَمَ', harakat: '۳ حرفی', rawSound: 'ظَلَمَ', breakdown: 'ظَ + لَ + مَ' },
  { id: '3w-akhaza', letterBase: 'أخذ', letterName: 'أَخَذَ', text: 'أَخَذَ', harakat: '۳ حرفی', rawSound: 'أَخَذَ', breakdown: 'أَ + خَ + ذَ' },
  { id: '3w-waada', letterBase: 'وعد', letterName: 'وَعَدَ', text: 'وَعَدَ', harakat: '۳ حرفی', rawSound: 'وَعَدَ', breakdown: 'وَ + عَ + دَ' },
  { id: '3w-hasaba', letterBase: 'حسب', letterName: 'حَسَبَ', text: 'حَسَبَ', harakat: '۳ حرفی', rawSound: 'حَسَبَ', breakdown: 'حَ + سَ + بَ' },
  { id: '3w-shahida', letterBase: 'شهد', letterName: 'شَهِدَ', text: 'شَهِدَ', harakat: '۳ حرفی', rawSound: 'شَهِدَ', breakdown: 'شَ + هِ + دَ' },
  { id: '3w-azuma', letterBase: 'عظم', letterName: 'عَظُمَ', text: 'عَظُمَ', harakat: '۳ حرفی', rawSound: 'عَظُمَ', breakdown: 'عَ + ظُ + مَ' },
  { id: '3w-kabura', letterBase: 'كبر', letterName: 'كَبُرَ', text: 'كَبُرَ', harakat: '۳ حرفی', rawSound: 'كَبُرَ', breakdown: 'كَ + بُ + رَ' },
  { id: '3w-hasuna', letterBase: 'حسن', letterName: 'حَسُنَ', text: 'حَسُنَ', harakat: '۳ حرفی', rawSound: 'حَسُنَ', breakdown: 'حَ + سُ + نَ' },
  { id: '3w-thaqula', letterBase: 'ثقل', letterName: 'ثَقُلَ', text: 'ثَقُلَ', harakat: '۳ حرفی', rawSound: 'ثَقُلَ', breakdown: 'ثَ + قُ + لَ' },
  { id: '3w-qaruba', letterBase: 'قرب', letterName: 'قَرُبَ', text: 'قَرُبَ', harakat: '۳ حرفی', rawSound: 'قَرُبَ', breakdown: 'قَ + رُ + بَ' },
  { id: '3w-bauda', letterBase: 'بعد', letterName: 'بَعُدَ', text: 'بَعُدَ', harakat: '۳ حرفی', rawSound: 'بَعُدَ', breakdown: 'بَ + عُ + دَ' },
  { id: '3w-duifa', letterBase: 'ضعف', letterName: 'ضُعِفَ', text: 'ضُعِفَ', harakat: '۳ حرفی', rawSound: 'ضُعِفَ', breakdown: 'ضُ + عِ + فَ' },
  { id: '3w-qutila', letterBase: 'قتل', letterName: 'قُتِلَ', text: 'قُتِلَ', harakat: '۳ حرفی', rawSound: 'قُتِلَ', breakdown: 'قُ + تِ + لَ' },
  { id: '3w-kutiba', letterBase: 'كتب', letterName: 'كُتِبَ', text: 'كُتِبَ', harakat: '۳ حرفی', rawSound: 'كُتِبَ', breakdown: 'كُ + تِ + بَ' },
  { id: '3w-khuliqa', letterBase: 'خلق', letterName: 'خُلِقَ', text: 'خُلِقَ', harakat: '۳ حرفی', rawSound: 'خُلِقَ', breakdown: 'خُ + لِ + قَ' },
  { id: '3w-ruziqa', letterBase: 'رزق', letterName: 'رُزِقَ', text: 'رُزِقَ', harakat: '۳ حرفی', rawSound: 'رُزِقَ', breakdown: 'رُ + زِ + قَ' },

  { id: '3w-juila', letterBase: 'جعل', letterName: 'جُعِلَ', text: 'جُعِلَ', harakat: '۳ حرفی', rawSound: 'جُعِلَ', breakdown: 'جُ + عِ + لَ' },
  { id: '3w-futiha', letterBase: 'فتح', letterName: 'فُتِحَ', text: 'فُتِحَ', harakat: '۳ حرفی', rawSound: 'فُتِحَ', breakdown: 'فُ + تِ + حَ' },
  { id: '3w-wujida', letterBase: 'وجد', letterName: 'وُجِدَ', text: 'وُجِدَ', harakat: '۳ حرفی', rawSound: 'وُجِدَ', breakdown: 'وُ + جِ + دَ' },
  { id: '3w-suila', letterBase: 'سئل', letterName: 'سُئِلَ', text: 'سُئِلَ', harakat: '۳ حرفی', rawSound: 'سُئِلَ', breakdown: 'سُ + ئِ + لَ' },
  { id: '3w-nusira', letterBase: 'نصر', letterName: 'نُصِرَ', text: 'نُصِرَ', harakat: '۳ حرفی', rawSound: 'نُصِرَ', breakdown: 'نُ + صِ + رَ' },

  { id: '3w-basata', letterBase: 'بسط', letterName: 'بَسَطَ', text: 'بَسَطَ', harakat: '۳ حرفی', rawSound: 'بَسَطَ', breakdown: 'بَ + سَ + طَ' },
  { id: '3w-tabaa', letterBase: 'طبع', letterName: 'طَبَعَ', text: 'طَبَعَ', harakat: '۳ حرفی', rawSound: 'طَبَعَ', breakdown: 'طَ + بَ + عَ' },
  { id: '3w-ghafara', letterBase: 'غفر', letterName: 'غَفَرَ', text: 'غَفَرَ', harakat: '۳ حرفی', rawSound: 'غَفَرَ', breakdown: 'غَ + فَ + رَ' },
  { id: '3w-saala', letterBase: 'سأل', letterName: 'سَأَلَ', text: 'سَأَلَ', harakat: '۳ حرفی', rawSound: 'سَأَلَ', breakdown: 'سَ + أَ + لَ' },
  { id: '3w-manaa', letterBase: 'منع', letterName: 'مَنَعَ', text: 'مَنَعَ', harakat: '۳ حرفی', rawSound: 'مَنَعَ', breakdown: 'مَ + نَ + عَ' },

  { id: '3w-talaba', letterBase: 'طلب', letterName: 'طَلَبَ', text: 'طَلَبَ', harakat: '۳ حرفی', rawSound: 'طَلَبَ', breakdown: 'طَ + لَ + بَ' },
  { id: '3w-zahara', letterBase: 'ظهر', letterName: 'ظَهَرَ', text: 'ظَهَرَ', harakat: '۳ حرفی', rawSound: 'ظَهَرَ', breakdown: 'ظَ + هَ + رَ' },
  { id: '3w-wasala', letterBase: 'وصل', letterName: 'وَصَلَ', text: 'وَصَلَ', harakat: '۳ حرفی', rawSound: 'وَصَلَ', breakdown: 'وَ + صَ + لَ' },
  { id: '3w-waqaa', letterBase: 'وقع', letterName: 'وَقَعَ', text: 'وَقَعَ', harakat: '۳ حرفی', rawSound: 'وَقَعَ', breakdown: 'وَ + قَ + عَ' },
  { id: '3w-walada', letterBase: 'ولد', letterName: 'وَلَدَ', text: 'وَلَدَ', harakat: '۳ حرفی', rawSound: 'وَلَدَ', breakdown: 'وَ + لَ + دَ' },
  { id: '3w-wahaba', letterBase: 'وهب', letterName: 'وَهَبَ', text: 'وَهَبَ', harakat: '۳ حرفی', rawSound: 'وَهَبَ', breakdown: 'وَ + هَ + بَ' },
];

export const MutharrikātGameModal: React.FC<MutharrikātGameModalProps> = ({ onBack, currentLang = 'ur' }) => {
  const mLoc = getMutaharrikatLocalization(currentLang);
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  // Game Modes: 
  // 1 = Same Letter Single Harakat (بَ، بِ، بُ)
  // 2 = Mixed Single Letters (مخلوط حروف)
  // 3 = 3-Letter Words (۳ حرفی مرکبات کلمات: وَزَنَ، وَرَدَ، أَمَرَ، بَلَغَ...)
  // 4 = 3-Letter Speed Rush (۳ حرفی سپیڈ رَش ۵ سیکنڈ)
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(3); // Default to 3-Letter Words mode!
  const [targetItem, setTargetItem] = useState<MutaḥarrikItem>(THREE_LETTER_MURAKKABAT_ITEMS[0]);
  const [options, setOptions] = useState<MutaḥarrikItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);

  // Advance timer ref to avoid race conditions
  const advanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Stats & Progress
  const [score, setScore] = useState(() => Number(localStorage.getItem('mutaharrikat_score') || 0));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('mutaharrikat_coins') || 50));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(() => Number(localStorage.getItem('mutaharrikat_best_streak') || 0));

  // Speed Challenge Timer
  const [isSpeedMode, setIsSpeedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Voice Recording Practice State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<{ title: string; subText: string; type: 'correct' | 'wrong' } | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
      }
      stopAllQariAudio();
    };
  }, []);

  // Initialize a new round
  const generateNewQuestion = (targetLevel = level) => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    stopAllQariAudio();

    setSelectedId(null);
    setAnswerStatus(null);
    setToastMessage(null);
    setVoiceFeedback(null);

    let choiceOptions: MutaḥarrikItem[] = [];
    let randomTarget: MutaḥarrikItem;

    if (targetLevel === 2) {
      // 2-Letter Words mode! (۲ حرفی متحرک کلمات: دَرَ، زَرَ، عَدَ، رَدَ...)
      randomTarget = TWO_LETTER_MUTAHARRIKAT_ITEMS[Math.floor(Math.random() * TWO_LETTER_MUTAHARRIKAT_ITEMS.length)];

      const otherPool = TWO_LETTER_MUTAHARRIKAT_ITEMS.filter(i => i.id !== randomTarget.id);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    } else if (targetLevel === 3 || targetLevel === 4) {
      // 3-Letter Words mode! (۳ حرفی مرکبات کلمات: وَزَنَ، وَرَدَ، أَمَرَ...)
      randomTarget = THREE_LETTER_MURAKKABAT_ITEMS[Math.floor(Math.random() * THREE_LETTER_MURAKKABAT_ITEMS.length)];

      const otherPool = THREE_LETTER_MURAKKABAT_ITEMS.filter(i => i.id !== randomTarget.id);
      const shuffledOthers = [...otherPool].sort(() => Math.random() - 0.5).slice(0, 3);
      choiceOptions = [randomTarget, ...shuffledOthers].sort(() => Math.random() - 0.5);
    } else {
      // Level 1: Same letter single harakat (e.g. بَ، بِ، بُ)
      randomTarget = SINGLE_MUTAHARRIKAT_ITEMS[Math.floor(Math.random() * SINGLE_MUTAHARRIKAT_ITEMS.length)];
      const sameLetterSet = SINGLE_MUTAHARRIKAT_ITEMS.filter(item => item.letterBase === randomTarget.letterBase);
      choiceOptions = sameLetterSet.length === 3
        ? [...sameLetterSet].sort(() => Math.random() - 0.5)
        : [randomTarget, ...SINGLE_MUTAHARRIKAT_ITEMS.filter(i => i.id !== randomTarget.id).slice(0, 2)];
    }

    setTargetItem(randomTarget);
    setOptions(choiceOptions);

    // Play target audio cleanly
    advanceTimerRef.current = setTimeout(() => {
      playQariText(randomTarget.rawSound);
    }, 250);

    // Reset speed timer if enabled
    if (isSpeedMode || targetLevel === 4) {
      setTimeLeft(5);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  };

  useEffect(() => {
    generateNewQuestion(level);
  }, [level]);

  // Speed timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0 && answerStatus === null) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0 && answerStatus === null) {
      // Time ran out!
      setAnswerStatus('wrong');
      setStreak(0);
      stopAllQariAudio();
      playChimeEffect('error');
      setToastMessage({
        title: mLoc.wrongToastTitle,
        subText: mLoc.wrongToastDesc('⏱️', targetItem.text, targetItem.breakdown || targetItem.harakat),
        type: 'wrong'
      });
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, answerStatus, targetItem, mLoc]);

  const handleOptionClick = (item: MutaḥarrikItem) => {
    if (answerStatus === 'correct') return;

    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }

    setSelectedId(item.id);
    setIsTimerActive(false);

    if (item.id === targetItem.id) {
      // Correct!
      setAnswerStatus('correct');
      const newScore = score + 25;
      const newCoins = coins + 15;
      const newStreak = streak + 1;

      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);

      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
        localStorage.setItem('mutaharrikat_best_streak', newStreak.toString());
      }

      localStorage.setItem('mutaharrikat_score', newScore.toString());
      localStorage.setItem('mutaharrikat_coins', newCoins.toString());

      stopAllQariAudio();
      playChimeEffect('success');
      playQariText(targetItem.rawSound);

      setToastMessage({
        title: mLoc.correctToastTitle,
        subText: `+25 ${mLoc.score} ⭐ | +15 ${mLoc.coins} 🪙 | ${mLoc.streak}: ${newStreak} 🔥 — "${targetItem.text}"`,
        type: 'correct'
      });

      // Auto advance smoothly after full word audio finishes (2.5s)
      advanceTimerRef.current = setTimeout(() => {
        generateNewQuestion();
      }, 2500);
    } else {
      // Wrong
      setAnswerStatus('wrong');
      setStreak(0);

      stopAllQariAudio();
      playChimeEffect('error');
      // Play clicked option sound so player hears what they chose
      playQariText(item.rawSound);

      setToastMessage({
        title: mLoc.wrongToastTitle,
        subText: mLoc.wrongToastDesc(item.text, targetItem.text, targetItem.breakdown || ''),
        type: 'wrong'
      });
    }
  };

  const playTargetAudio = () => {
    stopAllQariAudio();
    playQariText(targetItem.rawSound);
  };

  // Play letter-by-letter breakdown sequence (e.g. وَ -> زَ -> نَ -> وَزَنَ)
  const playBreakdownSequence = async () => {
    if (!targetItem.breakdown) {
      playTargetAudio();
      return;
    }
    stopAllQariAudio();
    const parts = targetItem.breakdown.split('+').map(p => p.trim());
    for (const part of parts) {
      if (part) {
        await playQariText(part);
        await new Promise(r => setTimeout(r, 400));
      }
    }
    await new Promise(r => setTimeout(r, 250));
    await playQariText(targetItem.rawSound);
  };

  // Voice recording practice
  const handleVoiceTest = () => {
    if (isRecording) return;
    setIsRecording(true);
    setVoiceFeedback(mLoc.voicePromptFeedback);

    setTimeout(() => {
      setIsRecording(false);
      playQariText(targetItem.rawSound);
      setVoiceFeedback(mLoc.voiceSuccessFeedback(targetItem.text));
    }, 2200);
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto bg-zinc-950 text-white relative selection:bg-emerald-500 selection:text-black ${isRtl ? 'font-urdu' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Background Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/90 via-zinc-950 to-teal-950/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-600 flex items-center justify-center text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-emerald-300">
                {mLoc.headerTitle}
              </h1>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                {mLoc.headerSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title={mLoc.backBtn}
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{mLoc.backBtn}</span>
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin-slow shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{mLoc.score}</p>
              <p className="text-sm font-black text-amber-300">{score} ⭐</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{mLoc.coins}</p>
              <p className="text-sm font-black text-amber-300">{coins} 🪙</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{mLoc.streak}</p>
              <p className="text-sm font-black text-orange-400">{streak} 🔥 ({mLoc.best}: {bestStreak})</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Trophy className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{mLoc.level}</p>
              <p className="text-sm font-black text-cyan-300">{mLoc.level} {level}</p>
            </div>
          </div>
        </div>

        {/* Level Switcher & Speed Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 border border-emerald-500/30 p-2.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => {
                setLevel(2);
                setIsSpeedMode(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                level === 2
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-lg scale-105'
                  : 'bg-zinc-800 text-emerald-200 hover:bg-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mLoc.level2}</span>
            </button>

            <button
              onClick={() => {
                setLevel(3);
                setIsSpeedMode(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                level === 3
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 shadow-lg scale-105'
                  : 'bg-zinc-800 text-emerald-200 hover:bg-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{mLoc.level3}</span>
            </button>

            <button
              onClick={() => {
                setLevel(4);
                setIsSpeedMode(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                level === 4
                  ? 'bg-amber-500 text-zinc-950 shadow-lg scale-105'
                  : 'bg-zinc-800 text-amber-200 hover:bg-zinc-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{mLoc.level4}</span>
            </button>

            <button
              onClick={() => {
                setLevel(1);
                setIsSpeedMode(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                level === 1
                  ? 'bg-emerald-500 text-zinc-950 shadow-lg'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {mLoc.level1}
            </button>
          </div>

          <button
            onClick={() => {
              setIsSpeedMode(!isSpeedMode);
              setIsTimerActive(!isSpeedMode);
              setTimeLeft(5);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isSpeedMode
                ? 'bg-rose-950 text-rose-300 border-rose-600 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <Timer className={`w-4 h-4 ${isSpeedMode ? 'animate-spin text-rose-400' : ''}`} />
            <span>{isSpeedMode ? mLoc.timerActive : mLoc.timerChallenge}</span>
          </button>
        </div>

        {/* Rule Banner */}
        <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-3.5 text-xs text-amber-200/90 leading-relaxed flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-amber-300">{mLoc.ruleTitle} </span>
            <span>
              {mLoc.ruleDesc}
            </span>
          </div>
        </div>

        {/* MAIN GAME CARD */}
        <div className="bg-zinc-900/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 text-center">

          {/* Speed Countdown Timer Bar if Speed Mode */}
          {isSpeedMode && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black text-rose-300 px-1">
                <span className="flex items-center gap-1">
                  <Timer className="w-4 h-4 animate-bounce text-rose-400" />
                  {mLoc.timeRemaining} {timeLeft}s
                </span>
                <span>{mLoc.answerQuickly}</span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden border border-rose-900">
                <motion.div
                  className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                  animate={{ width: `${(timeLeft / 5) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'linear' }}
                />
              </div>
            </div>
          )}

          {/* Audio Replay Header Section */}
          <div className="space-y-3">
            <p className="text-sm font-extrabold text-emerald-200">
              {mLoc.listenPrompt}
            </p>

            <div className="flex items-center justify-center gap-4 my-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={playTargetAudio}
                className="px-8 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-zinc-950 font-black text-base sm:text-lg shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center gap-3 cursor-pointer border border-emerald-300/60 hover:brightness-110"
              >
                <Volume2 className="w-7 h-7 animate-pulse text-zinc-950" />
                <span>{mLoc.listenAgain}</span>
              </motion.button>
            </div>

            {targetItem.breakdown && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2 bg-zinc-950/80 p-2.5 rounded-2xl border border-emerald-500/30 max-w-xl mx-auto">
                <span className="text-xs text-emerald-300 font-bold">{mLoc.breakdownTitle}</span>
                <div className="flex items-center gap-1.5 dir-rtl">
                  {targetItem.breakdown.split('+').map((part, idx) => {
                    const cleanPart = part.trim();
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          stopAllQariAudio();
                          playQariText(cleanPart);
                        }}
                        title={cleanPart}
                        className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-emerald-900 text-amber-300 border border-emerald-500/40 text-sm font-black hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-md flex items-center gap-1"
                      >
                        <span>{cleanPart}</span>
                        <Volume2 className="w-3 h-3 text-emerald-400 opacity-70" />
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={playBreakdownSequence}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>{mLoc.listenBreakdownFlow}</span>
                </button>
              </div>
            )}
          </div>

          {/* OPTIONS GRID */}
          <div className={`grid gap-4 max-w-2xl mx-auto pt-2 ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {options.map((item) => {
              const isSelected = selectedId === item.id;
              const isCorrectTarget = item.id === targetItem.id;

              let cardStyle = 'bg-zinc-950/90 border-emerald-500/40 text-emerald-100 hover:border-emerald-400 hover:bg-zinc-800/80';

              if (answerStatus !== null) {
                if (isCorrectTarget) {
                  cardStyle = 'bg-emerald-950 border-emerald-400 text-white ring-4 ring-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.8)] scale-105';
                } else if (isSelected && !isCorrectTarget) {
                  cardStyle = 'bg-rose-950 border-rose-500 text-rose-200 ring-2 ring-rose-600 scale-95';
                } else {
                  cardStyle = 'bg-zinc-950/40 border-zinc-800 text-zinc-600 opacity-50';
                }
              }

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: answerStatus === null ? 1.08 : 1 }}
                  whileTap={{ scale: answerStatus === null ? 0.94 : 1 }}
                  onClick={() => handleOptionClick(item)}
                  disabled={answerStatus !== null}
                  className={`p-4 sm:p-5 rounded-3xl border-3 font-arabic text-4xl sm:text-5xl font-black shadow-2xl transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] relative overflow-hidden ${cardStyle}`}
                >
                  {/* Top Harakat / Breakdown Tag */}
                  <span className="text-[10px] font-extrabold text-amber-300 bg-zinc-900/90 px-2 py-0.5 rounded-full border border-amber-500/30 mb-2 font-sans tracking-wide">
                    {item.breakdown || item.harakat}
                  </span>

                  {/* Main Large Diacritic Word */}
                  <span className="text-emerald-300 drop-shadow-[0_2px_10px_rgba(16,185,129,0.3)]">
                    {item.text}
                  </span>

                  {/* Success checkmark or cross icon */}
                  {answerStatus !== null && isCorrectTarget && (
                    <div className="absolute top-2 left-2 text-emerald-400 animate-bounce">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                  {answerStatus !== null && isSelected && !isCorrectTarget && (
                    <div className="absolute top-2 left-2 text-rose-500">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback Toast Banner */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border text-center shadow-2xl backdrop-blur-md max-w-lg mx-auto ${
                  toastMessage.type === 'correct'
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                    : 'bg-rose-950/90 border-rose-400 text-rose-100 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                }`}
              >
                <p className="text-base font-black">{toastMessage.title}</p>
                <p className="text-xs font-bold mt-1 opacity-90 leading-relaxed">{toastMessage.subText}</p>

                {toastMessage.type === 'wrong' && (
                  <button
                    onClick={() => generateNewQuestion()}
                    className="mt-3 px-5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
                  >
                    {mLoc.tryAgainBtn}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* VOICE PRONUNCIATION PRACTICE (مائیک سے مشق) */}
          <div className="border-t border-emerald-500/20 pt-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950/80 p-3.5 rounded-2xl border border-emerald-500/30">
              <div className={`${isRtl ? 'text-right' : 'text-left'} text-xs`}>
                <span className="font-extrabold text-amber-300 flex items-center gap-1">
                  <Mic className="w-4 h-4 text-emerald-400" />
                  {mLoc.voicePracticeTitle}
                </span>
                <span className="text-zinc-400">{mLoc.voicePracticeDesc(targetItem.text, targetItem.breakdown || '')}</span>
              </div>

              <button
                onClick={handleVoiceTest}
                disabled={isRecording}
                className={`px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? mLoc.voiceRecording : mLoc.voiceButton}</span>
              </button>
            </div>

            {voiceFeedback && (
              <p className="text-xs font-bold text-cyan-300 mt-2 bg-cyan-950/80 p-2 rounded-xl border border-cyan-800">
                {voiceFeedback}
              </p>
            )}
          </div>

        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => generateNewQuestion()}
            className="px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-emerald-200 border border-emerald-500/30 font-black text-xs transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-xl"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{mLoc.skipNewWord}</span>
          </button>

          <button
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all font-black text-xs sm:text-sm flex items-center gap-2 border border-amber-500/30 hover:border-amber-400 shadow-xl cursor-pointer"
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{mLoc.backToBoard}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
