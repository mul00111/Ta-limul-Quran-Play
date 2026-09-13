import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2, ArrowRight, Sparkles, Trophy, Flame, Coins,
  Star, RefreshCw, Zap, CheckCircle2, XCircle, Timer, Mic, Layers,
  Lightbulb, HelpCircle, ShieldAlert, Award
} from 'lucide-react';
import { playQariText, playQuizFeedbackAudio, stopAllQariAudio, playChimeEffect } from '../utils/qariAudioService';
import { getSukoonLocalization } from '../utils/sukoonGameLocalization';
import { LanguageCode } from '../types';

interface SukoonGameModalProps {
  onBack: () => void;
  initialMode?: SukoonGameCategory;
  currentLang?: LanguageCode;
}

export type SukoonGameCategory = 'all' | 'two-letter' | 'three-plus' | 'qalqalah' | 'hamzah-sakin' | 'heavy-sakin';

export interface SukoonGameItem {
  id: string;
  word: string;             // e.g. "أَبْ", "قُلْ", "يَعْلَمُ", "يَأْكُلُ"
  lettersDisplay: string;    // e.g. "أَ + بْ" or "يَ + عْ + لَ + مُ"
  urduSpelling: string;      // e.g. "ہَمْزَہ زَبَر بَا جزم أَبْ (قلقلہ)"
  category: '۲ حرفی ساکن' | '۳ و ۴ حرفی' | 'قلقلہ' | 'ہمزہ ساکنہ' | 'مستعلیہ ساکن';
  rawSound: string;
  isQalqalah?: boolean;
  qalqalahLetter?: string;
  isHamzahSakinah?: boolean;
  isHeavy?: boolean;
  heavyLetter?: string;
  tajweedNote: string;
  breakdownParts?: string[]; // ["أَ", "بْ"] or ["يَ", "عْ", "لَ", "مُ"]
}

// Comprehensive dataset for Sakin (Sukoon & Qalqalah & Hamzah Sakinah)
export const SUKOON_GAME_ITEMS: SukoonGameItem[] = [
  // 1. Basic 2-Letter Sakin & Qalqalah
  {
    id: 's-ab',
    word: 'أَبْ',
    lettersDisplay: 'أَ + بْ',
    urduSpelling: 'ہمزہ زبر باء جزم أَبْ',
    category: 'قلقلہ',
    rawSound: 'أَبْ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    tajweedNote: 'باء پر جزم ہے، اس لیے قلقلہ ہوگا (آواز میں جنبش اور گونج پیدا ہوگی)',
    breakdownParts: ['أَ', 'بْ']
  },
  {
    id: 's-at',
    word: 'أَتْ',
    lettersDisplay: 'أَ + تْ',
    urduSpelling: 'ہمزہ زبر تاء جزم أَتْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَتْ',
    tajweedNote: 'تاء ساکن ہے، بغیر کھینچے اور بغیر قلقلہ کے نرمی سے ادا کریں',
    breakdownParts: ['أَ', 'تْ']
  },
  {
    id: 's-ath',
    word: 'أَثْ',
    lettersDisplay: 'أَ + ثْ',
    urduSpelling: 'ہمزہ زبر ثاء جزم أَثْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَثْ',
    tajweedNote: 'ثاء ساکن ہے، زبان کی نوک سامنے والے اوپر کے دانتوں سے لگا کر نرمی سے پڑھیں',
    breakdownParts: ['أَ', 'ثْ']
  },
  {
    id: 's-aj',
    word: 'أَجْ',
    lettersDisplay: 'أَ + جْ',
    urduSpelling: 'ہمزہ زبر جیم جزم أَجْ',
    category: 'قلقلہ',
    rawSound: 'أَجْ',
    isQalqalah: true,
    qalqalahLetter: 'ج',
    tajweedNote: 'جیم ساکن حروفِ قلقلہ (قُطْبُ جَدٍّ) میں سے ہے، آواز کو اچھال کر ادا کریں',
    breakdownParts: ['أَ', 'جْ']
  },
  {
    id: 's-ah',
    word: 'أَحْ',
    lettersDisplay: 'أَ + حْ',
    urduSpelling: 'ہمزہ زبر حاء جزم أَحْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَحْ',
    tajweedNote: 'حاء ساکن حلق کے درمیانی حصے سے صاف نکالیں',
    breakdownParts: ['أَ', 'حْ']
  },
  {
    id: 's-akh',
    word: 'أَخْ',
    lettersDisplay: 'أَ + خْ',
    urduSpelling: 'ہمزہ زبر خاء جزم أَخْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَخْ',
    isHeavy: true,
    heavyLetter: 'خ',
    tajweedNote: 'خاء حرفِ مستعلیہ ہے، ساکن ہونے کی حالت میں بھی موٹا (پُر) پڑھا جائے گا',
    breakdownParts: ['أَ', 'خْ']
  },
  {
    id: 's-ad',
    word: 'أَدْ',
    lettersDisplay: 'أَ + دْ',
    urduSpelling: 'ہمزہ زبر دال جزم أَدْ',
    category: 'قلقلہ',
    rawSound: 'أَدْ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    tajweedNote: 'دال ساکن ہے، قلقلہ کی وجہ سے مخرج میں جنبش ہوگی',
    breakdownParts: ['أَ', 'دْ']
  },
  {
    id: 's-adh',
    word: 'أَذْ',
    lettersDisplay: 'أَ + ذْ',
    urduSpelling: 'ہمزہ زبر ذال جزم أَذْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَذْ',
    tajweedNote: 'ذال ساکن کو نرمی سے ادا کریں',
    breakdownParts: ['أَ', 'ذْ']
  },
  {
    id: 's-ar',
    word: 'أَرْ',
    lettersDisplay: 'أَ + رْ',
    urduSpelling: 'ہمزہ زبر راء جزم أَرْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَرْ',
    isHeavy: true,
    heavyLetter: 'ر',
    tajweedNote: 'راء ساکن سے پہلے زبر ہے، اس لیے راء کو پُر (موٹا) پڑھیں گے',
    breakdownParts: ['أَ', 'رْ']
  },
  {
    id: 's-as',
    word: 'أَسْ',
    lettersDisplay: 'أَ + سْ',
    urduSpelling: 'ہمزہ زبر سین جزم أَسْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَسْ',
    tajweedNote: 'سین ساکن میں سیٹی کی آواز (صفیر) واضح ہو',
    breakdownParts: ['أَ', 'سْ']
  },
  {
    id: 's-ash',
    word: 'أَشْ',
    lettersDisplay: 'أَ + شْ',
    urduSpelling: 'ہمزہ زبر شین جزم أَشْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَشْ',
    tajweedNote: 'شین ساکن میں سانس کی روانی (تفشی) نمایاں ہو',
    breakdownParts: ['أَ', 'شْ']
  },
  {
    id: 's-asaad',
    word: 'أَصْ',
    lettersDisplay: 'أَ + صْ',
    urduSpelling: 'ہمزہ زبر صاد جزم أَصْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَصْ',
    isHeavy: true,
    heavyLetter: 'ص',
    tajweedNote: 'صاد ساکن حرفِ مستعلیہ ہے، اسے پُر (موٹا) اور سیٹی کے ساتھ پڑھیں',
    breakdownParts: ['أَ', 'صْ']
  },
  {
    id: 's-adaad',
    word: 'أَضْ',
    lettersDisplay: 'أَ + ضْ',
    urduSpelling: 'ہمزہ زبر ضاد جزم أَضْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَضْ',
    isHeavy: true,
    heavyLetter: 'ض',
    tajweedNote: 'ضاد ساکن پُر حرف ہے، زبان کی کروٹ داڑھوں سے ملا کر ادا کریں',
    breakdownParts: ['أَ', 'ضْ']
  },
  {
    id: 's-atw',
    word: 'أَطْ',
    lettersDisplay: 'أَ + طْ',
    urduSpelling: 'ہمزہ زبر طاء جزم أَطْ',
    category: 'قلقلہ',
    rawSound: 'أَطْ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ط',
    qalqalahLetter: 'ط',
    tajweedNote: 'طاء حرفِ مستعلیہ بھی ہے اور قلقلہ بھی؛ اسے موٹا کر کے اچھالیں',
    breakdownParts: ['أَ', 'طْ']
  },
  {
    id: 's-azw',
    word: 'أَظْ',
    lettersDisplay: 'أَ + ظْ',
    urduSpelling: 'ہمزہ زبر ظاء جزم أَظْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَظْ',
    isHeavy: true,
    heavyLetter: 'ظ',
    tajweedNote: 'ظاء ساکن حرفِ مستعلیہ ہے، نرمی سے اور پُر پڑھیں',
    breakdownParts: ['أَ', 'ظْ']
  },
  {
    id: 's-aain',
    word: 'أَعْ',
    lettersDisplay: 'أَ + عْ',
    urduSpelling: 'ہمزہ زبر عین جزم أَعْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَعْ',
    tajweedNote: 'عین ساکن حلق کے درمیانی حصے سے صاف نکالیں بغیر جھٹکے کے',
    breakdownParts: ['أَ', 'عْ']
  },
  {
    id: 's-agh',
    word: 'أَغْ',
    lettersDisplay: 'أَ + غْ',
    urduSpelling: 'ہمزہ زبر غین جزم أَغْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَغْ',
    isHeavy: true,
    heavyLetter: 'غ',
    tajweedNote: 'غین ساکن حرفِ مستعلیہ ہے، اسے پُر (موٹا) پڑھیں',
    breakdownParts: ['أَ', 'غْ']
  },
  {
    id: 's-aq',
    word: 'أَقْ',
    lettersDisplay: 'أَ + قْ',
    urduSpelling: 'ہمزہ زبر قاف جزم أَقْ',
    category: 'قلقلہ',
    rawSound: 'أَقْ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'ق',
    tajweedNote: 'قاف ساکن حرفِ مستعلیہ اور قلقلہ دونوں ہے، موٹا کر کے جھٹکے سے اچھالیں',
    breakdownParts: ['أَ', 'قْ']
  },
  {
    id: 's-ak',
    word: 'أَكْ',
    lettersDisplay: 'أَ + كْ',
    urduSpelling: 'ہمزہ زبر کاف جزم أَكْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَكْ',
    tajweedNote: 'کاف ساکن باریک ہے اور اس میں ہلکی سی ہمْس (سانس کی ہوا) خارج ہوگی',
    breakdownParts: ['أَ', 'كْ']
  },
  {
    id: 's-al',
    word: 'أَلْ',
    lettersDisplay: 'أَ + لْ',
    urduSpelling: 'ہمزہ زبر لام جزم أَلْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَلْ',
    tajweedNote: 'لام ساکن کو بغیر قلقلہ کے صاف ادا کریں',
    breakdownParts: ['أَ', 'لْ']
  },
  {
    id: 's-am',
    word: 'أَمْ',
    lettersDisplay: 'أَ + مْ',
    urduSpelling: 'ہمزہ زبر میم جزم أَمْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَمْ',
    tajweedNote: 'میم ساکن کو بغیر غنہ اور بغیر قلقلہ کے ادا کریں (اظہار شفوی)',
    breakdownParts: ['أَ', 'مْ']
  },
  {
    id: 's-an',
    word: 'أَنْ',
    lettersDisplay: 'أَ + نْ',
    urduSpelling: 'ہمزہ زبر نون جزم أَنْ',
    category: '۲ حرفی ساکن',
    rawSound: 'أَنْ',
    tajweedNote: 'نون ساکن پر جزم ہے',
    breakdownParts: ['أَ', 'نْ']
  },

  // 2. 2-Letter Words from Qaida
  {
    id: 's-qul',
    word: 'قُلْ',
    lettersDisplay: 'قُ + لْ',
    urduSpelling: 'قاف پیش لام جزم قُلْ',
    category: '۲ حرفی ساکن',
    rawSound: 'قُلْ',
    isHeavy: true,
    heavyLetter: 'ق',
    tajweedNote: 'قاف پُر (موٹا) اور لام ساکن باریک بغیر کھینچے پڑھیں',
    breakdownParts: ['قُ', 'لْ']
  },
  {
    id: 's-man',
    word: 'مَنْ',
    lettersDisplay: 'مَ + نْ',
    urduSpelling: 'میم زبر نون جزم مَنْ',
    category: '۲ حرفی ساکن',
    rawSound: 'مَنْ',
    tajweedNote: 'میم زبر نون جزم مَنْ',
    breakdownParts: ['مَ', 'نْ']
  },
  {
    id: 's-kam',
    word: 'كَمْ',
    lettersDisplay: 'كَ + مْ',
    urduSpelling: 'کاف زبر میم جزم كَمْ',
    category: '۲ حرفی ساکن',
    rawSound: 'كَمْ',
    tajweedNote: 'کاف زبر میم جزم كَمْ',
    breakdownParts: ['كَ', 'مْ']
  },
  {
    id: 's-hal',
    word: 'هَلْ',
    lettersDisplay: 'هَ + لْ',
    urduSpelling: 'ہا زبر لام جزم هَلْ',
    category: '۲ حرفی ساکن',
    rawSound: 'هَلْ',
    tajweedNote: 'ہا زبر لام جزم هَلْ',
    breakdownParts: ['هَ', 'لْ']
  },
  {
    id: 's-lam',
    word: 'لَمْ',
    lettersDisplay: 'لَ + مْ',
    urduSpelling: 'لام زبر میم جزم لَمْ',
    category: '۲ حرفی ساکن',
    rawSound: 'لَمْ',
    tajweedNote: 'لام زبر میم جزم لَمْ',
    breakdownParts: ['لَ', 'مْ']
  },
  {
    id: 's-bal',
    word: 'بَلْ',
    lettersDisplay: 'بَ + لْ',
    urduSpelling: 'باء زبر لام جزم بَلْ',
    category: '۲ حرفی ساکن',
    rawSound: 'بَلْ',
    tajweedNote: 'باء زبر لام جزم بَلْ',
    breakdownParts: ['بَ', 'لْ']
  },
  {
    id: 's-an-prep',
    word: 'عَنْ',
    lettersDisplay: 'عَ + نْ',
    urduSpelling: 'عین زبر نون جزم عَنْ',
    category: '۲ حرفی ساکن',
    rawSound: 'عَنْ',
    tajweedNote: 'عین زبر نون جزم عَنْ',
    breakdownParts: ['عَ', 'نْ']
  },
  {
    id: 's-qad',
    word: 'قَدْ',
    lettersDisplay: 'قَ + دْ',
    urduSpelling: 'قاف زبر دال جزم قَدْ',
    category: 'قلقلہ',
    rawSound: 'قَدْ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'د',
    tajweedNote: 'قاف پُر پڑھیں اور دال پر قلقلہ کریں',
    breakdownParts: ['قَ', 'دْ']
  },
  {
    id: 's-dhuq',
    word: 'ذُقْ',
    lettersDisplay: 'ذُ + قْ',
    urduSpelling: 'ذال پیش قاف جزم ذُقْ',
    category: 'قلقلہ',
    rawSound: 'ذُقْ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'ق',
    tajweedNote: 'قاف ساکن ہے، اس لیے موٹا اور قلقلہ کے ساتھ پڑھا جائے گا',
    breakdownParts: ['ذُ', 'قْ']
  },
  {
    id: 's-khudh',
    word: 'خُذْ',
    lettersDisplay: 'خُ + ذْ',
    urduSpelling: 'خاء پیش ذال جزم خُذْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'خُذْ',
    isHeavy: true,
    heavyLetter: 'خ',
    tajweedNote: 'خاء حرفِ مستعلیہ ہے، ذال کو نرمی سے ادا کریں',
    breakdownParts: ['خُ', 'ذْ']
  },
  {
    id: 's-sum',
    word: 'صُمْ',
    lettersDisplay: 'صُ + مْ',
    urduSpelling: 'صاد پیش میم جزم صُمْ',
    category: 'مستعلیہ ساکن',
    rawSound: 'صُمْ',
    isHeavy: true,
    heavyLetter: 'ص',
    tajweedNote: 'صاد پُر اور میم ساکن صاف ادا کریں',
    breakdownParts: ['صُ', 'مْ']
  },
  {
    id: 's-kun',
    word: 'كُنْ',
    lettersDisplay: 'كُ + نْ',
    urduSpelling: 'کاف پیش نون جزم كُنْ',
    category: '۲ حرفی ساکن',
    rawSound: 'كُنْ',
    tajweedNote: 'کاف پیش نون جزم كُنْ',
    breakdownParts: ['كُ', 'نْ']
  },
  {
    id: 's-zid',
    word: 'زِدْ',
    lettersDisplay: 'زِ + دْ',
    urduSpelling: 'زا زیر دال جزم زِدْ',
    category: 'قلقلہ',
    rawSound: 'زِدْ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    tajweedNote: 'دال ساکن پر قلقلہ کریں',
    breakdownParts: ['زِ', 'دْ']
  },

  // 3. Hamzah Sakinah (ہمزہ ساکنہ - جھٹکا والی مشق)
  {
    id: 's-yakul',
    word: 'يَأْكُلُ',
    lettersDisplay: 'يَ + أْ + كُ + لُ',
    urduSpelling: 'یاء زبر ہمزہ جزم يَأْ (جھٹکا) کاف پیش کُ لام پیش لُ يَأْكُلُ',
    category: 'ہمزہ ساکنہ',
    rawSound: 'يَأْكُلُ',
    isHamzahSakinah: true,
    tajweedNote: 'ہمزہ ساکنہ (أْ) کو جھٹکا دے کر پڑھیں گے!',
    breakdownParts: ['يَأْ', 'كُ', 'لُ']
  },
  {
    id: 's-takhudh',
    word: 'تَأْخُذُ',
    lettersDisplay: 'تَ + أْ + خُ + ذُ',
    urduSpelling: 'تاء زبر ہمزہ جزم تَأْ (جھٹکا) خاء پیش خُ ذال پیش ذُ تَأْخُذُ',
    category: 'ہمزہ ساکنہ',
    rawSound: 'تَأْخُذُ',
    isHamzahSakinah: true,
    isHeavy: true,
    heavyLetter: 'خ',
    tajweedNote: 'ہمزہ ساکنہ پر جھٹکا اور خاء کو موٹا پڑھیں',
    breakdownParts: ['تَأْ', 'خُ', 'ذُ']
  },
  {
    id: 's-yumin',
    word: 'يُؤْمِنُ',
    lettersDisplay: 'يُ + ؤْ + مِ + نُ',
    urduSpelling: 'یاء پیش ہمزہ جزم يُؤْ (جھٹکا) میم زیر مِ نون پیش نُ يُؤْمِنُ',
    category: 'ہمزہ ساکنہ',
    rawSound: 'يُؤْمِنُ',
    isHamzahSakinah: true,
    tajweedNote: 'واو پر ہمزہ ساکن (ؤْ) ہے، اسے جھٹکے کے ساتھ ادا کریں',
    breakdownParts: ['يُؤْ', 'مِ', 'نُ']
  },
  {
    id: 's-bisa',
    word: 'بِئْسَ',
    lettersDisplay: 'بِ + ئْ + سَ',
    urduSpelling: 'باء زیر ہمزہ جزم بِئْ (جھٹکا) سین زبر سَ بِئْسَ',
    category: 'ہمزہ ساکنہ',
    rawSound: 'بِئْسَ',
    isHamzahSakinah: true,
    tajweedNote: 'یاء کی کرسی پر ہمزہ ساکنہ (ئْ) کو جھٹکا دے کر پڑھیں',
    breakdownParts: ['بِئْ', 'سَ']
  },
  {
    id: 's-yati',
    word: 'يَأْتِي',
    lettersDisplay: 'يَ + أْ + تِي',
    urduSpelling: 'یاء زبر ہمزہ جزم يَأْ (جھٹکا) تاء زیر یا تَأْتِي',
    category: 'ہمزہ ساکنہ',
    rawSound: 'يَأْتِي',
    isHamzahSakinah: true,
    tajweedNote: 'ہمزہ ساکنہ پر صاف جھٹکا دیں',
    breakdownParts: ['يَأْ', 'تِي']
  },
  {
    id: 's-mumin',
    word: 'مُؤْمِنٌ',
    lettersDisplay: 'مُ + ؤْ + مِ + نٌ',
    urduSpelling: 'میم پیش ہمزہ جزم مُؤْ (جھٹکا) میم زیر مِ نون دو پیش نٌ مُؤْمِنٌ',
    category: 'ہمزہ ساکنہ',
    rawSound: 'مُؤْمِنٌ',
    isHamzahSakinah: true,
    tajweedNote: 'ہمزہ ساکنہ کا جھٹکا واضح کریں',
    breakdownParts: ['مُؤْ', 'مِ', 'نٌ']
  },

  // 4. 3-Letter and 4-Letter Sakin Words with Qalqalah
  {
    id: 's-aqbala',
    word: 'أَقْبَلَ',
    lettersDisplay: 'أَ + قْ + بَ + لَ',
    urduSpelling: 'ہمزہ زبر قاف جزم أَقْ (قلقلہ و پُر) باء زبر بَ لام زبر لَ أَقْبَلَ',
    category: 'قلقلہ',
    rawSound: 'أَقْبَلَ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'ق',
    tajweedNote: 'قاف ساکن میں قلقلہ اور پر پڑھنا ضروری ہے',
    breakdownParts: ['أَقْ', 'بَ', 'لَ']
  },
  {
    id: 's-atama',
    word: 'أَطْعَمَ',
    lettersDisplay: 'أَ + طْ + عَ + مَ',
    urduSpelling: 'ہمزہ زبر طاء جزم أَطْ (قلقلہ و پُر) عین زبر عَ میم زبر مَ أَطْعَمَ',
    category: 'قلقلہ',
    rawSound: 'أَطْعَمَ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ط',
    qalqalahLetter: 'ط',
    tajweedNote: 'طاء ساکن پر قلقلہ کریں اور موٹا پڑھیں',
    breakdownParts: ['أَطْ', 'عَ', 'مَ']
  },
  {
    id: 's-absara',
    word: 'أَبْصَرَ',
    lettersDisplay: 'أَ + بْ + صَ + رَ',
    urduSpelling: 'ہمزہ زبر باء جزم أَبْ (قلقلہ) صاد زبر صَ (پُر) راء زبر رَ (پُر) أَبْصَرَ',
    category: 'قلقلہ',
    rawSound: 'أَبْصَرَ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ص',
    qalqalahLetter: 'ب',
    tajweedNote: 'باء پر قلقلہ، صاد اور راء کو موٹا پڑھیں',
    breakdownParts: ['أَبْ', 'صَ', 'رَ']
  },
  {
    id: 's-ajrun',
    word: 'أَجْرٌ',
    lettersDisplay: 'أَ + جْ + رٌ',
    urduSpelling: 'ہمزہ زبر جیم جزم أَجْ (قلقلہ) راء دو پیش رٌ أَجْرٌ',
    category: 'قلقلہ',
    rawSound: 'أَجْرٌ',
    isQalqalah: true,
    qalqalahLetter: 'ج',
    tajweedNote: 'جیم ساکن پر قلقلہ کریں',
    breakdownParts: ['أَجْ', 'رٌ']
  },
  {
    id: 's-adbara',
    word: 'أَدْبَرَ',
    lettersDisplay: 'أَ + دْ + بَ + رَ',
    urduSpelling: 'ہمزہ زبر دال جزم أَدْ (قلقلہ) باء زبر بَ راء زبر رَ أَدْبَرَ',
    category: 'قلقلہ',
    rawSound: 'أَدْبَرَ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    tajweedNote: 'دال ساکن پر قلقلہ کریں',
    breakdownParts: ['أَدْ', 'بَ', 'رَ']
  },
  {
    id: 's-yaqtau',
    word: 'يَقْطَعُ',
    lettersDisplay: 'يَ + قْ + طَ + عُ',
    urduSpelling: 'یاء زبر قاف جزم يَقْ (قلقلہ) طاء زبر طَ عین پیش عُ يَقْطَعُ',
    category: 'قلقلہ',
    rawSound: 'يَقْطَعُ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'ق',
    tajweedNote: 'قاف ساکن پر قلقلہ اور طاء مستعلیہ پُر',
    breakdownParts: ['يَقْ', 'طَ', 'عُ']
  },
  {
    id: 's-yatmayu',
    word: 'يَطْمَعُ',
    lettersDisplay: 'يَ + طْ + مَ + عُ',
    urduSpelling: 'یاء زبر طاء جزم يَطْ (قلقلہ) میم زبر مَ عین پیش عُ يَطْمَعُ',
    category: 'قلقلہ',
    rawSound: 'يَطْمَعُ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ط',
    qalqalahLetter: 'ط',
    tajweedNote: 'طاء ساکن پر قلقلہ کریں',
    breakdownParts: ['يَطْ', 'مَ', 'عُ']
  },
  {
    id: 's-yabgoona',
    word: 'يَبْغُونَ',
    lettersDisplay: 'يَ + بْ + غُ + ونَ',
    urduSpelling: 'یاء زبر باء جزم يَبْ (قلقلہ) غین پیش واو غُو نون زبر نَ يَبْغُونَ',
    category: 'قلقلہ',
    rawSound: 'يَبْغُونَ',
    isQalqalah: true,
    qalqalahLetter: 'ب',
    tajweedNote: 'باء ساکن پر قلقلہ اور غین کو موٹا پڑھیں',
    breakdownParts: ['يَبْ', 'غُو', 'نَ']
  },
  {
    id: 's-yajalu',
    word: 'يَجْعَلُ',
    lettersDisplay: 'يَ + جْ + عَ + لُ',
    urduSpelling: 'یاء زبر جیم جزم يَجْ (قلقلہ) عین زبر عَ لام پیش لُ يَجْعَلُ',
    category: 'قلقلہ',
    rawSound: 'يَجْعَلُ',
    isQalqalah: true,
    qalqalahLetter: 'ج',
    tajweedNote: 'جیم ساکن پر قلقلہ کریں',
    breakdownParts: ['يَجْ', 'عَ', 'لُ']
  },
  {
    id: 's-yaduna',
    word: 'يَدْعُونَ',
    lettersDisplay: 'يَ + دْ + عُ + ونَ',
    urduSpelling: 'یاء زبر دال جزم يَدْ (قلقلہ) عین پیش واو عُو نون زبر نَ يَدْعُونَ',
    category: 'قلقلہ',
    rawSound: 'يَدْعُونَ',
    isQalqalah: true,
    qalqalahLetter: 'د',
    tajweedNote: 'دال ساکن پر قلقلہ کریں',
    breakdownParts: ['يَدْ', 'عُو', 'نَ']
  },
  {
    id: 's-khalaqna',
    word: 'خَلَقْنَا',
    lettersDisplay: 'خَ + لَ + قْ + نَا',
    urduSpelling: 'خاء زبر خَ لام زبر لَ قاف جزم قْ (قلقلہ) نون الف زبر نَا خَلَقْنَا',
    category: 'قلقلہ',
    rawSound: 'خَلَقْنَا',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ق',
    qalqalahLetter: 'ق',
    tajweedNote: 'قاف ساکن پر قلقلہ اور خاء کو موٹا پڑھیں',
    breakdownParts: ['خَ', 'لَقْ', 'نَا']
  },

  // 5. General 3 & 4 Letter Sakin Words
  {
    id: 's-yalamu',
    word: 'يَعْلَمُ',
    lettersDisplay: 'يَ + عْ + لَ + مُ',
    urduSpelling: 'یاء زبر عین جزم يَعْ لام زبر لَ میم پیش مُ يَعْلَمُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'يَعْلَمُ',
    tajweedNote: 'عین ساکن کو حلق کے درمیان سے صاف نکالیں',
    breakdownParts: ['يَعْ', 'لَ', 'مُ']
  },
  {
    id: 's-yakhluqu',
    word: 'يَخْلُقُ',
    lettersDisplay: 'يَ + خْ + لُ + قُ',
    urduSpelling: 'یاء زبر خاء جزم يَخْ (پُر) لام پیش لُ قاف پیش قُ (پُر) يَخْلُقُ',
    category: 'مستعلیہ ساکن',
    rawSound: 'يَخْلُقُ',
    isHeavy: true,
    heavyLetter: 'خ',
    tajweedNote: 'خاء ساکن اور قاف دونوں مستعلیہ ہیں، موٹا پڑھیں',
    breakdownParts: ['يَخْ', 'لُ', 'قُ']
  },
  {
    id: 's-yansuru',
    word: 'يَنْصُرُ',
    lettersDisplay: 'يَ + نْ + صُ + رُ',
    urduSpelling: 'یاء زبر نون جزم يَنْ صاد پیش صُ (پُر) راء پیش رُ (پُر) يَنْصُرُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'يَنْصُرُ',
    isHeavy: true,
    heavyLetter: 'ص',
    tajweedNote: 'صاد اور راء پُر پڑھیں',
    breakdownParts: ['يَنْ', 'صُ', 'رُ']
  },
  {
    id: 's-yursilu',
    word: 'يُرْسِلُ',
    lettersDisplay: 'يُ + رْ + سِ + لُ',
    urduSpelling: 'یاء پیش راء جزم يُرْ (پُر) سین زیر سِ لام پیش لُ يُرْسِلُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'يُرْسِلُ',
    isHeavy: true,
    heavyLetter: 'ر',
    tajweedNote: 'راء ساکن سے پہلے پیش ہے، اس لیے راء کو پُر پڑھیں گے',
    breakdownParts: ['يُرْ', 'سِ', 'لُ']
  },
  {
    id: 's-kasabat',
    word: 'كَسَبَتْ',
    lettersDisplay: 'كَ + سَ + بَ + تْ',
    urduSpelling: 'کاف زبر كَ سین زبر سَ باء زبر بَ تاء جزم تْ كَسَبَتْ',
    category: '۳ و ۴ حرفی',
    rawSound: 'كَسَبَتْ',
    tajweedNote: 'تاء ساکن پر سانس کی ہلکی ہوا (ہمس) کے ساتھ ختم کریں',
    breakdownParts: ['كَ', 'سَ', 'بَتْ']
  },
  {
    id: 's-faraghta',
    word: 'فَرَغْتَ',
    lettersDisplay: 'فَ + رَ + غْ + تَ',
    urduSpelling: 'فاء زبر فَ راء زبر رَ غین جزم غْ (پُر) تاء زبر تَ فَرَغْتَ',
    category: 'مستعلیہ ساکن',
    rawSound: 'فَرَغْتَ',
    isHeavy: true,
    heavyLetter: 'غ',
    tajweedNote: 'غین ساکن حرفِ مستعلیہ ہے، موٹا پڑھیں',
    breakdownParts: ['فَ', 'رَغْ', 'تَ']
  },
  {
    id: 's-wansab',
    word: 'وَانْصَبْ',
    lettersDisplay: 'وَ + انْ + صَ + بْ',
    urduSpelling: 'واو زبر نون جزم وَنْ صاد زبر صَ باء جزم بْ (قلقلہ) وَانْصَبْ',
    category: 'قلقلہ',
    rawSound: 'وَانْصَبْ',
    isQalqalah: true,
    isHeavy: true,
    heavyLetter: 'ص',
    qalqalahLetter: 'ب',
    tajweedNote: 'صاد پُر اور باء ساکن پر قلقلہ کریں',
    breakdownParts: ['وَانْ', 'صَبْ']
  },
  {
    id: 's-anamta',
    word: 'أَنْعَمْتَ',
    lettersDisplay: 'أَ + نْ + عَ + مْ + تَ',
    urduSpelling: 'ہمزہ زبر نون جزم أَنْ عین زبر میم جزم عَمْ تاء زبر تَ أَنْعَمْتَ',
    category: '۳ و ۴ حرفی',
    rawSound: 'أَنْعَمْتَ',
    tajweedNote: 'نون ساکن اور میم ساکن دونوں بغیر قلقلہ کے صاف ادا کریں (اظہار)',
    breakdownParts: ['أَنْ', 'عَمْ', 'تَ']
  },
  {
    id: 's-arsala',
    word: 'أَرْسَلَ',
    lettersDisplay: 'أَ + رْ + سَ + لَ',
    urduSpelling: 'ہمزہ زبر راء جزم أَرْ (پُر) سین زبر سَ لام زبر لَ أَرْسَلَ',
    category: '۳ و ۴ حرفی',
    rawSound: 'أَرْسَلَ',
    isHeavy: true,
    heavyLetter: 'ر',
    tajweedNote: 'راء ساکن سے پہلے زبر ہے، اس لیے راء کو پُر پڑھیں',
    breakdownParts: ['أَرْ', 'سَ', 'لَ']
  },
  {
    id: 's-akhraja',
    word: 'أَخْرَجَ',
    lettersDisplay: 'أَ + خْ + رَ + جَ',
    urduSpelling: 'ہمزہ زبر خاء جزم أَخْ (پُر) راء زبر رَ (پُر) جیم زبر جَ أَخْرَجَ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَخْرَجَ',
    isHeavy: true,
    heavyLetter: 'خ',
    tajweedNote: 'خاء اور راء دونوں پُر پڑھے جائیں گے',
    breakdownParts: ['أَخْ', 'رَ', 'جَ']
  },
  {
    id: 's-azlama',
    word: 'أَظْلَمَ',
    lettersDisplay: 'أَ + ظْ + لَ + مَ',
    urduSpelling: 'ہمزہ زبر ظاء جزم أَظْ (پُر) لام زبر لَ میم زبر مَ أَظْلَمَ',
    category: 'مستعلیہ ساکن',
    rawSound: 'أَظْلَمَ',
    isHeavy: true,
    heavyLetter: 'ظ',
    tajweedNote: 'ظاء ساکن حرفِ مستعلیہ ہے، پُر پڑھیں',
    breakdownParts: ['أَظْ', 'لَ', 'مَ']
  },
  {
    id: 's-yanshur',
    word: 'يَنْظُرُ',
    lettersDisplay: 'يَ + نْ + ظُ + رُ',
    urduSpelling: 'یاء زبر نون جزم يَنْ ظاء پیش ظُ (پُر) راء پیش رُ (پُر) يَنْظُرُ',
    category: 'مستعلیہ ساکن',
    rawSound: 'يَنْظُرُ',
    isHeavy: true,
    heavyLetter: 'ظ',
    tajweedNote: 'ظاء اور راء کو موٹا پڑھیں',
    breakdownParts: ['يَنْ', 'ظُ', 'رُ']
  },
  {
    id: 's-yasamu',
    word: 'يَسْمَعُ',
    lettersDisplay: 'يَ + سْ + مَ + عُ',
    urduSpelling: 'یاء زبر سین جزم يَسْ میم زبر مَ عین پیش عُ يَسْمَعُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'يَسْمَعُ',
    tajweedNote: 'سین ساکن اور عین پیش کو صاف ادا کریں',
    breakdownParts: ['يَسْ', 'مَ', 'عُ']
  },
  {
    id: 's-naabudu',
    word: 'نَعْبُدُ',
    lettersDisplay: 'نَ + عْ + بُ + دُ',
    urduSpelling: 'نون زبر عین جزم نَعْ باء پیش بُ دال پیش دُ نَعْبُدُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'نَعْبُدُ',
    tajweedNote: 'عین ساکن حلق کے وسط سے نکالیں',
    breakdownParts: ['نَعْ', 'بُ', 'دُ']
  },
  {
    id: 's-nastaeen',
    word: 'نَسْتَعِينُ',
    lettersDisplay: 'نَ + سْ + تَ + عِ + ينُ',
    urduSpelling: 'نون زبر سین جزم نَسْ تاء زبر تَ عین زیر یا عِي نون پیش نُ نَسْتَعِينُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'نَسْتَعِينُ',
    tajweedNote: 'سین ساکن پر نرمی اور سیٹی واضح ہو',
    breakdownParts: ['نَسْ', 'تَ', 'عِينُ']
  },
  {
    id: 's-alhamdu',
    word: 'الْحَمْدُ',
    lettersDisplay: 'اَلْ + حَ + مْ + دُ',
    urduSpelling: 'ہمزہ زبر لام جزم اَلْ حاء زبر میم جزم حَمْ دال پیش دُ اَلْحَمْدُ',
    category: '۳ و ۴ حرفی',
    rawSound: 'الْحَمْدُ',
    tajweedNote: 'لام ساکن اور میم ساکن دونوں پر جزم ہے، بغیر قلقلہ کے پڑھیں',
    breakdownParts: ['اَلْ', 'حَمْ', 'دُ']
  },
  {
    id: 's-alfalaq',
    word: 'الْفَلَقِ',
    lettersDisplay: 'اَلْ + فَ + لَ + قِ',
    urduSpelling: 'ہمزہ زبر لام جزم اَلْ فاء زبر فَ لام زبر لَ قاف زیر قِ الْفَلَقِ',
    category: '۳ و ۴ حرفی',
    rawSound: 'الْفَلَقِ',
    isHeavy: true,
    heavyLetter: 'ق',
    tajweedNote: 'وقف کی صورت میں قاف پر قلقلہ کبریٰ ہوگا (الْفَلَقْ)',
    breakdownParts: ['اَلْ', 'فَ', 'لَقِ']
  }
];

export const SukoonGameModal: React.FC<SukoonGameModalProps> = ({ onBack, initialMode = 'all', currentLang = 'ur' }) => {
  const sLoc = getSukoonLocalization(currentLang);
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  // 1. Game Config & State
  const [selectedCategory, setSelectedCategory] = useState<SukoonGameCategory>(initialMode);
  const [soundOnlyMode, setSoundOnlyMode] = useState<boolean>(false);
  const [isSpeedChallenge, setIsSpeedChallenge] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // 2. Score & Gamification
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('qaida_coins') || '50', 10);
  });
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);

  // 3. Current Question State
  const [filteredPool, setFilteredPool] = useState<SukoonGameItem[]>(SUKOON_GAME_ITEMS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [targetItem, setTargetItem] = useState<SukoonGameItem>(SUKOON_GAME_ITEMS[0]);
  const [options, setOptions] = useState<SukoonGameItem[]>([]);
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subText: string; type: 'correct' | 'wrong' | 'badge' } | null>(null);

  // 4. Voice Recording Mock State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on category
  useEffect(() => {
    let pool = SUKOON_GAME_ITEMS;
    if (selectedCategory === 'two-letter') {
      pool = SUKOON_GAME_ITEMS.filter(i => i.category === '۲ حرفی ساکن' || i.word.length <= 4);
    } else if (selectedCategory === 'three-plus') {
      pool = SUKOON_GAME_ITEMS.filter(i => i.category === '۳ و ۴ حرفی' || i.word.length > 4);
    } else if (selectedCategory === 'qalqalah') {
      pool = SUKOON_GAME_ITEMS.filter(i => i.isQalqalah);
    } else if (selectedCategory === 'hamzah-sakin') {
      pool = SUKOON_GAME_ITEMS.filter(i => i.isHamzahSakinah);
    } else if (selectedCategory === 'heavy-sakin') {
      pool = SUKOON_GAME_ITEMS.filter(i => i.isHeavy);
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setFilteredPool(shuffled.length > 0 ? shuffled : SUKOON_GAME_ITEMS);
    setCurrentIndex(0);
  }, [selectedCategory]);

  // Set up Question
  useEffect(() => {
    if (filteredPool.length === 0) return;
    const current = filteredPool[currentIndex % filteredPool.length];
    setTargetItem(current);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setHiddenOptionIds([]);
    setVoiceFeedback(null);

    // Create 4 distinct options including the target
    const wrongPool = SUKOON_GAME_ITEMS.filter(item => item.id !== current.id);
    const shuffledWrong = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3);
    const mixedOptions = [current, ...shuffledWrong].sort(() => Math.random() - 0.5);
    setOptions(mixedOptions);

    // Auto-play audio on question load
    const t = setTimeout(() => {
      playQariText(current.rawSound);
    }, 300);

    return () => clearTimeout(t);
  }, [currentIndex, filteredPool]);

  // Speed Challenge Timer
  useEffect(() => {
    if (isSpeedChallenge && isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            playChimeEffect('error');
            setToastMessage({
              title: 'وقت ختم ہو گیا! ⏰',
              subText: `آپ کا حتمی اسکور: ${score} پوائنٹس! ماشاءاللہ شاندار کوشش!`,
              type: 'wrong'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSpeedChallenge, isTimerRunning, timeLeft, score]);

  // Streak Multiplier Calculation
  useEffect(() => {
    if (streak >= 10) setMultiplier(4);
    else if (streak >= 6) setMultiplier(3);
    else if (streak >= 3) setMultiplier(2);
    else setMultiplier(1);

    if (streak > bestStreak) {
      setBestStreak(streak);
    }
  }, [streak, bestStreak]);

  // Handle Option Click
  const handleSelectOption = (item: SukoonGameItem) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedOptionId(item.id);

    if (item.id === targetItem.id) {
      // CORRECT ANSWER
      playChimeEffect('success');
      playQuizFeedbackAudio(true);
      const pointsEarned = 10 * multiplier;
      const coinsEarned = multiplier > 1 ? 5 : 2;

      const newScore = score + pointsEarned;
      const newCoins = coins + coinsEarned;
      const newStreak = streak + 1;

      setScore(newScore);
      setCoins(newCoins);
      setStreak(newStreak);

      localStorage.setItem('qaida_coins', String(newCoins));
      localStorage.setItem('qaida_points', String(newScore));

      // Badges triggers
      if (newStreak === 5 && !achievements.includes('streak-5')) {
        setAchievements(prev => [...prev, 'streak-5']);
        setToastMessage({
          title: '🏅 نیا بیج انلاک: قلقلہ چیمپئن!',
          subText: 'مسلسل ۵ درست جوابات کا شاندار ریکارڈ!',
          type: 'badge'
        });
      } else {
        setToastMessage({
          title: 'ماشاء اللہ! بالکل درست جواب! ✨',
          subText: `${targetItem.word} (${targetItem.tajweedNote}) • +${pointsEarned} پوائنٹس • +${coinsEarned} سکے!`,
          type: 'correct'
        });
      }

      // Auto advance
      setTimeout(() => {
        setToastMessage(null);
        setCurrentIndex(prev => prev + 1);
      }, 1600);

    } else {
      // WRONG ANSWER
      playChimeEffect('error');
      playQuizFeedbackAudio(false);
      setStreak(0);

      // Play clicked item audio so they hear what they clicked
      playQariText(item.rawSound);

      setToastMessage({
        title: 'دوبارہ غور فرمائیں! ❌',
        subText: `آپ نے "${item.word}" پر کلک کیا۔ درست جواب "${targetItem.word}" ہے۔ رہنمائی: ${targetItem.tajweedNote}`,
        type: 'wrong'
      });
    }
  };

  // Play target sound
  const playTargetAudio = () => {
    stopAllQariAudio();
    playQariText(targetItem.rawSound);
  };

  // Play breakdown step by step (e.g. أَ -> بْ -> أَبْ)
  const playBreakdownSequence = async () => {
    if (!targetItem.breakdownParts || targetItem.breakdownParts.length === 0) {
      playTargetAudio();
      return;
    }
    stopAllQariAudio();
    for (const part of targetItem.breakdownParts) {
      if (part) {
        await playQariText(part);
        await new Promise(r => setTimeout(r, 450));
      }
    }
    await new Promise(r => setTimeout(r, 300));
    await playQariText(targetItem.rawSound);
  };

  // 50:50 Lifeline
  const useFiftyFifty = () => {
    if (coins < 10) {
      setToastMessage({
        title: sLoc.insufficientCoins,
        subText: sLoc.insufficientCoinsDesc,
        type: 'wrong'
      });
      return;
    }

    const wrongOptions = options.filter(o => o.id !== targetItem.id);
    const shuffledWrong = [...wrongOptions].sort(() => Math.random() - 0.5);
    const toHide = shuffledWrong.slice(0, 2).map(o => o.id);
    setHiddenOptionIds(toHide);
    setCoins(prev => {
      const updated = prev - 10;
      localStorage.setItem('qaida_coins', String(updated));
      return updated;
    });

    playChimeEffect('success');
    setToastMessage({
      title: sLoc.lifelineUsed,
      subText: sLoc.lifelineUsedDesc,
      type: 'correct'
    });
  };

  // Voice recording test
  const handleVoiceTest = () => {
    if (isRecording) return;
    setIsRecording(true);
    setVoiceFeedback(sLoc.voicePromptFeedback);

    setTimeout(() => {
      setIsRecording(false);
      playQariText(targetItem.rawSound);
      setVoiceFeedback(sLoc.voiceSuccessFeedback(targetItem.word));
    }, 2400);
  };

  // Start Speed Blitz
  const startSpeedChallenge = () => {
    setIsSpeedChallenge(true);
    setTimeLeft(60);
    setIsTimerRunning(true);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-white relative overflow-x-hidden selection:bg-amber-500 selection:text-black ${isRtl ? 'font-urdu' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/80 via-zinc-950 to-emerald-950/70 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-zinc-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                  {sLoc.badgeTitle}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-amber-300">
                  {sLoc.headerTitle}
                </h1>
              </div>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                {sLoc.headerSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title={sLoc.backBtn}
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{sLoc.backBtn}</span>
          </button>
        </div>

        {/* Gamification Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-spin-slow shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{sLoc.score}</p>
              <p className="text-sm font-black text-amber-300">{score} ⭐</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{sLoc.coins}</p>
              <p className="text-sm font-black text-amber-300">{coins} 🪙</p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Flame className={`w-5 h-5 shrink-0 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-zinc-500'}`} />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{sLoc.streak}</p>
              <p className="text-sm font-black text-orange-400">
                {streak} 🔥 {multiplier > 1 && <span className="text-[10px] bg-orange-500 text-black px-1.5 py-0.2 rounded-full">x{multiplier}</span>}
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-2xl p-3 flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase">{sLoc.bestStreak}</p>
              <p className="text-sm font-black text-emerald-300">{bestStreak} 🏆</p>
            </div>
          </div>
        </div>

        {/* Category Filters and Game Modes */}
        <div className="bg-zinc-900/80 border border-amber-500/20 rounded-3xl p-3.5 space-y-3 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-zinc-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{sLoc.selectCategory}</span>
            </span>

            {/* Mode Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundOnlyMode(!soundOnlyMode)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  soundOnlyMode
                    ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'bg-zinc-800/90 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{soundOnlyMode ? sLoc.soundOnlyModeActive : sLoc.soundOnlyMode}</span>
              </button>

              {!isSpeedChallenge ? (
                <button
                  onClick={startSpeedChallenge}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white border border-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105"
                >
                  <Timer className="w-3.5 h-3.5 animate-spin-slow" />
                  <span>{sLoc.speedChallenge}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500 px-3 py-1 rounded-xl text-rose-300 text-xs font-black animate-pulse">
                  <Timer className="w-4 h-4" />
                  <span>{sLoc.timeLeft}: {timeLeft}s</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'all', label: sLoc.catAll, desc: sLoc.catAllDesc },
              { id: 'two-letter', label: sLoc.catTwoLetter, desc: sLoc.catTwoLetterDesc },
              { id: 'three-plus', label: sLoc.catThreePlus, desc: sLoc.catThreePlusDesc },
              { id: 'qalqalah', label: sLoc.catQalqalah, desc: sLoc.catQalqalahDesc },
              { id: 'hamzah-sakin', label: sLoc.catHamzahSakin, desc: sLoc.catHamzahSakinDesc },
              { id: 'heavy-sakin', label: sLoc.catHeavySakin, desc: sLoc.catHeavySakinDesc },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as SukoonGameCategory)}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-200 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-amber-500/40 hover:text-zinc-200'
                }`}
              >
                <div className="text-xs font-extrabold">{cat.label}</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">{cat.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl border text-center shadow-2xl backdrop-blur-md ${
                toastMessage.type === 'correct' || toastMessage.type === 'badge'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-950/90 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
              }`}
            >
              <p className="text-base font-black">{toastMessage.title}</p>
              <p className="text-xs font-bold mt-1 opacity-90">{toastMessage.subText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Stage Card */}
        <div className="bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950/90 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          
          {/* Target Display Area */}
          <div className="flex flex-col items-center justify-center space-y-4">
            
            {/* Tajweed & Type Badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
                🏷️ {targetItem.category}
              </span>

              {targetItem.isQalqalah && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 animate-pulse">
                  💥 {sLoc.badgeQalqalah} ({targetItem.qalqalahLetter})
                </span>
              )}

              {targetItem.isHamzahSakinah && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 animate-pulse">
                  ⚡ {sLoc.badgeJolt}
                </span>
              )}

              {targetItem.isHeavy && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  🟢 {sLoc.catHeavySakin}
                </span>
              )}
            </div>

            {/* Central Word or Audio Target Card */}
            <div className="relative group">
              <div className="w-52 h-44 sm:w-64 sm:h-52 rounded-3xl bg-gradient-to-b from-zinc-800 to-zinc-900 border-4 border-amber-400/60 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all group-hover:border-amber-400 group-hover:scale-[1.02]">
                
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                {soundOnlyMode ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-purple-600/30 border-2 border-purple-400 flex items-center justify-center text-purple-300 animate-pulse shadow-lg">
                      <Volume2 className="w-10 h-10" />
                    </div>
                    <span className="text-xs font-extrabold text-purple-200">
                      {sLoc.listenTargetPrompt}
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-6xl sm:text-7xl font-black text-amber-200 font-arabic tracking-wide drop-shadow-md select-none">
                      {targetItem.word}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-amber-400/90 mt-2">
                      {targetItem.lettersDisplay}
                    </span>
                  </>
                )}

                {/* Speaker Floating Button */}
                <button
                  onClick={playTargetAudio}
                  className="absolute top-3 left-3 p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all hover:scale-110 shadow-lg cursor-pointer flex items-center gap-1 font-bold text-xs"
                  title={sLoc.listenAgain}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Audio & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={playTargetAudio}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <Volume2 className="w-4 h-4 text-zinc-950" />
                <span>{sLoc.listenWord}</span>
              </button>

              <button
                onClick={playBreakdownSequence}
                className="px-4 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 font-black text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{sLoc.listenSpelling}</span>
              </button>

              <button
                onClick={() => setShowRuleModal(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4 text-emerald-400" />
                <span>{sLoc.tajweedRule}</span>
              </button>

              <button
                onClick={useFiftyFifty}
                disabled={hiddenOptionIds.length > 0 || isAnswered}
                className={`px-3.5 py-2.5 rounded-2xl border font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
                  hiddenOptionIds.length > 0
                    ? 'bg-zinc-800/50 text-zinc-500 border-zinc-700 cursor-not-allowed'
                    : 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border-amber-500/50 hover:scale-105'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{sLoc.lifeline5050}</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Option Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 px-1">
              <span>{sLoc.chooseCorrectCard}</span>
              <span className="text-amber-300">{sLoc.questionNum(currentIndex + 1, filteredPool.length)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {options.map((option, idx) => {
                const isHidden = hiddenOptionIds.includes(option.id);
                const isChosen = selectedOptionId === option.id;
                const isCorrect = option.id === targetItem.id;

                let cardStyle = 'bg-zinc-900/90 border-zinc-800 hover:border-amber-400/80 hover:bg-zinc-850 text-white';
                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/50';
                  } else if (isChosen && !isCorrect) {
                    cardStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-2 ring-rose-500/50';
                  } else {
                    cardStyle = 'bg-zinc-900/40 border-zinc-850 opacity-40 text-zinc-500';
                  }
                }

                if (isHidden) {
                  return (
                    <div
                      key={option.id}
                      className="p-4 rounded-3xl border border-zinc-900 bg-zinc-950/40 opacity-20 flex items-center justify-center min-h-[90px]"
                    >
                      <span className="text-xs text-zinc-600 font-bold">{sLoc.eliminated}</span>
                    </div>
                  );
                }

                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswered}
                    className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-4 ${isRtl ? 'text-right' : 'text-left'} relative overflow-hidden ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center font-black text-xs text-amber-300 shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black font-arabic tracking-wide">
                          {option.word}
                        </div>
                        <div className="text-xs text-zinc-400 font-medium mt-0.5">
                          {option.urduSpelling}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {option.isQalqalah && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40">
                          {sLoc.badgeQalqalah}
                        </span>
                      )}
                      {option.isHamzahSakinah && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40">
                          {sLoc.badgeJolt}
                        </span>
                      )}
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 animate-bounce" />
                      )}
                      {isAnswered && isChosen && !isCorrect && (
                        <XCircle className="w-6 h-6 text-rose-400 animate-shake" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Voice Practice Box */}
          <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Mic className="w-5 h-5" />
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h4 className="text-xs sm:text-sm font-black text-amber-200">
                  {sLoc.voicePracticeTitle}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  {sLoc.voicePracticeDesc(targetItem.word)}
                </p>
              </div>
            </div>

            <button
              onClick={handleVoiceTest}
              disabled={isRecording}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 hover:scale-105'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{isRecording ? sLoc.voiceRecording : sLoc.voiceTest}</span>
            </button>
          </div>

          {voiceFeedback && (
            <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-2xl text-xs text-amber-200 text-center font-bold animate-fadeIn">
              {voiceFeedback}
            </div>
          )}

          {/* Next / Shuffle Question Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setHiddenOptionIds([]);
                setCurrentIndex(prev => (prev > 0 ? prev - 1 : filteredPool.length - 1));
              }}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowRight className={`w-4 h-4 ${!isRtl ? 'rotate-180' : ''}`} />
              <span>{sLoc.prevQuestion}</span>
            </button>

            <button
              onClick={() => {
                setHiddenOptionIds([]);
                setCurrentIndex(prev => prev + 1);
              }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs sm:text-sm font-black transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <span>{sLoc.nextQuestion}</span>
            </button>
          </div>
        </div>

        {/* Tajweed Rule Hint Modal */}
        <AnimatePresence>
          {showRuleModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowRuleModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`bg-zinc-900 border-2 border-amber-500/50 rounded-3xl p-6 max-w-lg w-full ${isRtl ? 'text-right' : 'text-left'} space-y-4 shadow-2xl`}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-black">{sLoc.ruleModalTitle(targetItem.word)}</h3>
                  </div>
                  <button
                    onClick={() => setShowRuleModal(false)}
                    className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  <div className="p-3 bg-amber-950/40 rounded-2xl border border-amber-500/30">
                    <p className="font-extrabold text-amber-200 mb-1">{sLoc.ruleWordRule}</p>
                    <p className="text-amber-100/90">{targetItem.tajweedNote}</p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2 text-xs">
                    <p className="font-bold text-zinc-300">{sLoc.ruleBasicDirectives}</p>
                    <ul className="list-disc list-inside space-y-1 text-zinc-400">
                      <li>{sLoc.ruleSukoonDesc}</li>
                      <li>{sLoc.ruleQalqalahDesc}</li>
                      <li>{sLoc.ruleHamzahDesc}</li>
                      <li>{sLoc.ruleHeavyDesc}</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => setShowRuleModal(false)}
                  className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-all cursor-pointer"
                >
                  {sLoc.understoodClose}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
