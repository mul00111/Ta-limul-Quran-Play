import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Volume2, Sparkles, Trophy, Flame, Coins, Heart, RefreshCw,
  CheckCircle2, XCircle, Mic, HelpCircle, Layers, Award,
  Shuffle, ArrowLeft, ArrowRight, BookOpen, VolumeX, Lightbulb,
  Headphones, Puzzle, Star, Zap, Brain, Timer, RotateCcw,
  Sliders, FastForward, Play, Square, Check, X, ShieldAlert
} from 'lucide-react';
import {
  playQariText,
  playQuizFeedbackAudio,
  stopAllQariAudio,
  playChimeEffect,
  playUrduText
} from '../utils/qariAudioService';
import { LanguageCode } from '../types';

export type QuizCategoryType =
  | 'all'
  | 'mufradat'
  | 'murakkabat'
  | 'mutaharrikat'
  | 'sukoon'
  | 'maddah'
  | 'leen'
  | 'khari_harakat'
  | 'tanween'
  | 'tashdeed'
  | 'nun_sakin'
  | 'meem_sakin'
  | 'tafkheem_tarqeeq'
  | 'maddat'
  | 'muqattaat';

export type QuizGameModeType = 'mcq' | 'listening' | 'breakdown' | 'speed';

export interface QuizQuestion {
  id: string;
  category: 'mufradat' | 'murakkabat' | 'mutaharrikat' | 'sukoon' | 'maddah' | 'leen' | 'khari_harakat' | 'tanween' | 'tashdeed' | 'nun_sakin' | 'meem_sakin' | 'tafkheem_tarqeeq' | 'maddat' | 'muqattaat';
  categoryLabelUrdu: string;
  badgeColor: 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
  promptTitle: string;
  arabicDisplay: string;
  audioPronunciation: string;
  correctAnswer: string;
  correctAnswerDisplay: string;
  options: {
    id: string;
    text: string;
    subText?: string;
    isCorrect: boolean;
  }[];
  explanationUrdu: string;
  breakdown?: string;
  tajweedRule?: string;
  breakdownLetters?: string[]; // for interactive word builder mode
  hintText?: string;
}

// ============================================================================
// MASSIVE COMPREHENSIVE QUESTION POOL (50+ RICH QUESTIONS)
// ============================================================================
export const COMPREHENSIVE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================================================
  // 1. 🧩 مرکبات کوئز (MURAKKABAT QUESTIONS - 2 & 3 LETTER COMPOUNDS)
  // ==========================================================================
  {
    id: 'murak-1',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۲ حرفی)',
    badgeColor: 'amber',
    promptTitle: 'اس مرکب کو پہچانیں: "لَا"',
    arabicDisplay: 'لَا',
    audioPronunciation: 'لَامْ أَلِفْ',
    correctAnswer: 'لَامْ + أَلِفْ',
    correctAnswerDisplay: 'لَامْ + أَلِفْ',
    options: [
      { id: 'm1-opt1', text: 'لَامْ + أَلِفْ', subText: 'لام اور الف کا جوڑ', isCorrect: true },
      { id: 'm1-opt2', text: 'بَاءْ + أَلِفْ', subText: 'با اور الف', isCorrect: false },
      { id: 'm1-opt3', text: 'نُوْنْ + أَلِفْ', subText: 'نون اور الف', isCorrect: false },
      { id: 'm1-opt4', text: 'كَافْ + أَلِفْ', subText: 'کاف اور الف', isCorrect: false },
    ],
    explanationUrdu: 'یہ "لَامْ أَلِفْ" ہے جو کہ لام (ل) اور الف (ا) سے مل کر بنتا ہے۔',
    breakdown: 'ل + ا',
    breakdownLetters: ['ل', 'ا'],
    tajweedRule: 'مرکب حروف: لام اور الف کا اتصال',
    hintText: 'غور فرمائیں: اس میں پہلا موڑ لام کا اور سیدھی لکیر الف کی ہے۔',
  },
  {
    id: 'murak-2',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۲ حرفی)',
    badgeColor: 'amber',
    promptTitle: 'مرکب لفظ "بَلْ" کن دو حروف کا مجموعہ ہے؟',
    arabicDisplay: 'بَلْ',
    audioPronunciation: 'بَاءْ لَامْ',
    correctAnswer: 'بَاءْ + لَامْ',
    correctAnswerDisplay: 'بَاءْ + لَامْ',
    options: [
      { id: 'm2-opt1', text: 'تَاءْ + لَامْ', subText: 'ت اور ل', isCorrect: false },
      { id: 'm2-opt2', text: 'بَاءْ + لَامْ', subText: 'ب (۱ نقطہ نیچے) اور ل', isCorrect: true },
      { id: 'm2-opt3', text: 'نُوْنْ + لَامْ', subText: 'ن اور ل', isCorrect: false },
      { id: 'm2-opt4', text: 'يَاءْ + لَامْ', subText: 'ی اور ل', isCorrect: false },
    ],
    explanationUrdu: 'لفظ "بَلْ" میں پہلا حرف "باء" (۱ نقطہ نیچے) اور دوسرا حرف "لام" ہے۔',
    breakdown: 'ب + ل',
    breakdownLetters: ['ب', 'ل'],
    tajweedRule: 'مرکب حروف: باء اور لام',
    hintText: 'پہلے حرف کے نیچے ایک نقطہ ہے (باء) اور آگے لام جڑا ہے۔',
  },
  {
    id: 'murak-3',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۳ حرفی کلمات)',
    badgeColor: 'amber',
    promptTitle: 'تین حرفی کلمہ "كَتَبَ" کے حروف کی صحیح ترتیب کیا ہے؟',
    arabicDisplay: 'كَتَبَ',
    audioPronunciation: 'كَافْ تَاءْ بَاءْ',
    correctAnswer: 'كَافْ + تَاءْ + بَاءْ',
    correctAnswerDisplay: 'كَافْ + تَاءْ + بَاءْ',
    options: [
      { id: 'm3-opt1', text: 'كَافْ + تَاءْ + بَاءْ', subText: 'ک + ت (۲ نقطے اوپر) + ب (۱ نقطہ نیچے)', isCorrect: true },
      { id: 'm3-opt2', text: 'قَافْ + تَاءْ + بَاءْ', subText: 'ق + ت + ب', isCorrect: false },
      { id: 'm3-opt3', text: 'كَافْ + ثَاءْ + بَاءْ', subText: 'ک + ث + ب', isCorrect: false },
      { id: 'm3-opt4', text: 'لَامْ + تَاءْ + بَاءْ', subText: 'ل + ت + ب', isCorrect: false },
    ],
    explanationUrdu: 'کلمہ "كَتَبَ" کا پہلا حرف کاف (ک)، درمیانی حرف تاء (ت) اور آخری حرف باء (ب) ہے۔',
    breakdown: 'ك + ت + ب',
    breakdownLetters: ['ك', 'ت', 'ب'],
    tajweedRule: 'تین حرفی مرکب کلمات کی ہجے و جوڑ',
    hintText: 'پہلا حرف کاف، درمیانی حرف کے اوپر دو نقطے (تاء) اور آخری کے نیچے ایک نقطہ ہے۔',
  },
  {
    id: 'murak-4',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (حروفِ مقطعات)',
    badgeColor: 'amber',
    promptTitle: 'قرآنی مقطعات "طٰهٰ" کا صحیح نام اور تلفظ کیا ہے؟',
    arabicDisplay: 'طٰهٰ',
    audioPronunciation: 'طَاءْ هَاءْ',
    correctAnswer: 'طَاءْ هَاءْ',
    correctAnswerDisplay: 'طَاءْ هَاءْ',
    options: [
      { id: 'm4-opt1', text: 'طَاءْ هَاءْ', subText: 'طا اور ہا (سورہ طٰہٰ)', isCorrect: true },
      { id: 'm4-opt2', text: 'ظَاءْ هَاءْ', subText: 'ظا اور ہا', isCorrect: false },
      { id: 'm4-opt3', text: 'طَاءْ حَاءْ', subText: 'طا اور حا', isCorrect: false },
      { id: 'm4-opt4', text: 'تَاءْ هَاءْ', subText: 'تا اور ہا', isCorrect: false },
    ],
    explanationUrdu: '"طٰهٰ" حروفِ مقطعات میں سے ہے جسے "طَاءْ هَاءْ" پڑھا جاتا ہے۔',
    breakdown: 'ط + ه',
    breakdownLetters: ['ط', 'ه'],
    tajweedRule: 'حروفِ مقطعات قرآنیہ',
    hintText: 'ط (طا، حرفِ پُر) اور ہ (ہا، ادنیٰ حلق کا حرف) ہیں۔',
  },
  {
    id: 'murak-5',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۲ حرفی جوڑ)',
    badgeColor: 'amber',
    promptTitle: 'اس مرکب کو پہچانیں: "نَا"',
    arabicDisplay: 'نَا',
    audioPronunciation: 'نُوْنْ أَلِفْ',
    correctAnswer: 'نُوْنْ + أَلِفْ',
    correctAnswerDisplay: 'نُوْنْ + أَلِفْ',
    options: [
      { id: 'm5-opt1', text: 'بَاءْ + أَلِفْ', subText: '۱ نقطہ نیچے', isCorrect: false },
      { id: 'm5-opt2', text: 'تَاءْ + أَلِفْ', subText: '۲ نقطے اوپر', isCorrect: false },
      { id: 'm5-opt3', text: 'نُوْنْ + أَلِفْ', subText: '۱ نقطہ اوپر', isCorrect: true },
      { id: 'm5-opt4', text: 'يَاءْ + أَلِفْ', subText: '۲ نقطے نیچے', isCorrect: false },
    ],
    explanationUrdu: 'نقطہ اوپر ہونے کی وجہ سے پہلا حرف "نُوْنْ" اور دوسرا حرف "أَلِفْ" ہے۔',
    breakdown: 'ن + ا',
    breakdownLetters: ['ن', 'ا'],
    tajweedRule: 'نقطوں سے پہچان: نون مع الف',
    hintText: 'دیکھیں: شوشے کے اوپر ایک نقطہ ہے جو نون کی علامت ہے۔',
  },
  {
    id: 'murak-6',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۳ حرفی کلمات)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "نَصَرَ" کن حروف پر مشتمل ہے؟',
    arabicDisplay: 'نَصَرَ',
    audioPronunciation: 'نُوْنْ صَادْ رَاءْ',
    correctAnswer: 'نُوْنْ + صَادْ + رَاءْ',
    correctAnswerDisplay: 'نُوْنْ + صَادْ + رَاءْ',
    options: [
      { id: 'm6-opt1', text: 'نُوْنْ + سِينْ + رَاءْ', subText: 'ن + س + ر', isCorrect: false },
      { id: 'm6-opt2', text: 'نُوْنْ + صَادْ + رَاءْ', subText: 'ن + ص + ر (صاد پُر پڑھا جائے گا)', isCorrect: true },
      { id: 'm6-opt3', text: 'تَاءْ + صَادْ + رَاءْ', subText: 'ت + ص + ر', isCorrect: false },
      { id: 'm6-opt4', text: 'نُوْنْ + ضَادْ + رَاءْ', subText: 'ن + ض + ر', isCorrect: false },
    ],
    explanationUrdu: 'نَصَرَ میں "ص" حرفِ مستعلیہ (پُر پڑھا جانے والا) ہے، لہذا یہ نُوْنْ + صَادْ + رَاءْ ہے۔',
    breakdown: 'ن + ص + ر',
    breakdownLetters: ['ن', 'ص', 'ر'],
    tajweedRule: 'حرفِ مستعلیہ صَاد در کلمہ',
    hintText: 'درمیان میں صاد (ص) کا پیالہ ہے، نہ کہ سین کا۔',
  },
  {
    id: 'murak-7',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۲ حرفی جوڑ)',
    badgeColor: 'amber',
    promptTitle: 'مرکب "يَسْ" میں کون کون سے حروف شامل ہیں؟',
    arabicDisplay: 'يَسْ',
    audioPronunciation: 'يَاءْ سِينْ',
    correctAnswer: 'يَاءْ + سِينْ',
    correctAnswerDisplay: 'يَاءْ + سِينْ',
    options: [
      { id: 'm7-opt1', text: 'تَاءْ + سِينْ', subText: 'ت اور س', isCorrect: false },
      { id: 'm7-opt2', text: 'بَاءْ + سِينْ', subText: 'ب اور س', isCorrect: false },
      { id: 'm7-opt3', text: 'يَاءْ + سِينْ', subText: 'ی (۲ نقطے نیچے) اور س', isCorrect: true },
      { id: 'm7-opt4', text: 'ثَاءْ + شِينْ', subText: 'ث اور ش', isCorrect: false },
    ],
    explanationUrdu: 'دو نقطے نیچے ہونے کی وجہ سے پہلا حرف "یاء" اور دوسرا تین دانتوں والا "سین" ہے۔',
    breakdown: 'ي + س',
    breakdownLetters: ['ي', 'س'],
    tajweedRule: 'شوشوں اور نقطوں کی پہچان: یاء و سین',
    hintText: 'پہلے شوشے کے نیچے ۲ نقطے ہیں (یاء) اور آگے تین دانتوں والا سین ہے۔',
  },
  {
    id: 'murak-8',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (۴ حرفی کلمات)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "خَلَقَ" میں موجود حروف کی شناخت کریں:',
    arabicDisplay: 'خَلَقَ',
    audioPronunciation: 'خَاءْ لَامْ قَافْ',
    correctAnswer: 'خَاءْ + لَامْ + قَافْ',
    correctAnswerDisplay: 'خَاءْ + لَامْ + قَافْ',
    options: [
      { id: 'm8-opt1', text: 'خَاءْ + لَامْ + قَافْ', subText: 'خ (اوپر ۱ نقطہ) + ل + ق', isCorrect: true },
      { id: 'm8-opt2', text: 'جِيمْ + لَامْ + قَافْ', subText: 'ج + ل + ق', isCorrect: false },
      { id: 'm8-opt3', text: 'حَاءْ + لَامْ + كَافْ', subText: 'ح + ل + ک', isCorrect: false },
      { id: 'm8-opt4', text: 'خَاءْ + أَلِفْ + قَافْ', subText: 'خ + ا + ق', isCorrect: false },
    ],
    explanationUrdu: 'خَلَقَ میں خاء (حرفِ پُر)، لام (درمیان میں) اور قاف (آخر میں ۲ نقطوں کے ساتھ) ہے۔',
    breakdown: 'خ + ل + ق',
    breakdownLetters: ['خ', 'ل', 'ق'],
    tajweedRule: 'حروفِ مستعلیہ خاء اور قاف کی پہچان',
    hintText: 'پہلے حرف کے اوپر ایک نقطہ ہے (خاء)، درمیان میں لام اور آخر میں قاف ہے۔',
  },
  {
    id: 'murak-9',
    category: 'murakkabat',
    categoryLabelUrdu: 'مرکبات (حروفِ مقطعات)',
    badgeColor: 'amber',
    promptTitle: 'قرآنی کلمہ "الٓمّٓ" میں کون کون سے حروف شامل ہیں؟',
    arabicDisplay: 'الٓمّٓ',
    audioPronunciation: 'أَلِفْ لَامْ مِيمْ',
    correctAnswer: 'أَلِفْ + لَامْ + مِيمْ',
    correctAnswerDisplay: 'أَلِفْ + لَامْ + مِيمْ',
    options: [
      { id: 'm9-opt1', text: 'أَلِفْ + لَامْ + مِيمْ', subText: 'الف، لام اور میم (مد لازم کے ساتھ)', isCorrect: true },
      { id: 'm9-opt2', text: 'أَلِفْ + كَافْ + مِيمْ', subText: 'الف، کاف اور میم', isCorrect: false },
      { id: 'm9-opt3', text: 'لَامْ + أَلِفْ + مِيمْ', subText: 'لام، الف اور میم', isCorrect: false },
      { id: 'm9-opt4', text: 'أَلِفْ + لَامْ + نُوْنْ', subText: 'الف، لام اور نون', isCorrect: false },
    ],
    explanationUrdu: 'سورہ بقرہ کا آغاز "الٓمّٓ" (الف لام میم) سے ہوتا ہے جو تین حروف پر مشتمل ہے۔',
    breakdown: 'ا + ل + م',
    breakdownLetters: ['ا', 'ل', 'م'],
    tajweedRule: 'مد لازم کلمی در حروفِ مقطعات',
    hintText: 'الف، لام اور میم — سورہ بقرہ کی پہلی آیت۔',
  },

  // ==========================================================================
  // 2. ⚡ حرکات و متحرکات کوئز (MUTAHARRIKAT & 3 VOWELS)
  // ==========================================================================
  {
    id: 'muth-1',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (حرکاتِ ثلاثہ)',
    badgeColor: 'emerald',
    promptTitle: 'حرکات کتنی ہیں اور ان کے نام کیا ہیں؟',
    arabicDisplay: 'ـَ  ـِ  ـُ',
    audioPronunciation: 'زَبَر زَیْر پَیْش',
    correctAnswer: '۳ حرکات: زَبَر (فَتْحَة)، زَیْر (كَسْرَة)، پَیْش (ضَمَّة)',
    correctAnswerDisplay: '۳ حرکات: زَبَر، زَیْر، پَیْش',
    options: [
      { id: 'mt1-opt1', text: '۳ حرکات: زَبَر، زَیْر، پَیْش', subText: 'فَتْحَة، كَسْرَة، ضَمَّة', isCorrect: true },
      { id: 'mt1-opt2', text: '۲ حرکات: زَبَر اور زَیْر', subText: 'دو حرکات', isCorrect: false },
      { id: 'mt1-opt3', text: '۴ حرکات: زبر، زیر، پیش، جزم', subText: 'جزم حرکت نہیں ہے', isCorrect: false },
      { id: 'mt1-opt4', text: '۱ حرکت: صرف زبر', subText: 'ایک حرکت', isCorrect: false },
    ],
    explanationUrdu: 'حرکات تین ہیں: زَبَر (اوپر)، زَیْر (نیچے)، اور پَیْش (اوپر واؤ کی طرح)۔ متحرک حرف کو بغیر کھینچے پڑھا جاتا ہے۔',
    tajweedRule: 'قاعدہ حرکات: متحرک حرف کو بغیر کھینچے اور بغیر جھٹکے کے جلدی پڑھیں',
    hintText: 'یاد رکھیں: زبر، زیر اور پیش کو حرکات کہتے ہیں۔',
  },
  {
    id: 'muth-2',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (زَبَر / فتحہ)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "رَبَ" کا درست تلفظ اور ہجہ کیا ہے؟',
    arabicDisplay: 'رَبَ',
    audioPronunciation: 'رَبَ',
    correctAnswer: 'رَاء زبر رَ + بَاء زبر بَ = رَبَ',
    correctAnswerDisplay: 'رَاء زبر رَ + بَاء زبر بَ = رَبَ',
    options: [
      { id: 'mt2-opt1', text: 'رَاء زبر رَ + بَاء زبر بَ = رَبَ', subText: 'دونوں حروف پر زبر ہے (جلدی پڑھیں)', isCorrect: true },
      { id: 'mt2-opt2', text: 'راء پیش رُ + باء زبر بَ = رُبَ', subText: 'پیش اور زبر', isCorrect: false },
      { id: 'mt2-opt3', text: 'راء زیر رِ + باء زیر بِ = رِبِ', subText: 'دونوں پر زیر', isCorrect: false },
      { id: 'mt2-opt4', text: 'راء زبر باء جزم = رَبْ', subText: 'یہ ساکن ہے', isCorrect: false },
    ],
    explanationUrdu: 'رَبَ میں راء اور باء دونوں پر زَبَر ہے، اس لیے رَاء زبر رَ، بَاء زبر بَ = رَبَ۔',
    breakdown: 'رَ + بَ',
    breakdownLetters: ['رَ', 'بَ'],
    tajweedRule: 'زبر والی راء موٹی (پُر) پڑھی جاتی ہے',
    hintText: 'دونوں حروف کے اوپر لکیر (زبر) ہے۔',
  },
  {
    id: 'muth-3',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (زَیْر / کسرہ)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "إِذِ" میں کون سی حرکت پائی جاتی ہے؟',
    arabicDisplay: 'إِذِ',
    audioPronunciation: 'إِذِ',
    correctAnswer: 'دونوں حروف پر زَیْر (كَسْرَة) ہے',
    correctAnswerDisplay: 'دونوں حروف پر زَیْر ہے',
    options: [
      { id: 'mt3-opt1', text: 'دونوں حروف پر زَیْر (كَسْرَة) ہے', subText: 'إِ + ذِ = إِذِ', isCorrect: true },
      { id: 'mt3-opt2', text: 'دونوں حروف پر زَبَر ہے', subText: 'زبر اوپر ہوتا ہے', isCorrect: false },
      { id: 'mt3-opt3', text: 'دونوں پر پَیْش ہے', subText: 'پیش واؤ کی طرح ہوتا ہے', isCorrect: false },
      { id: 'mt3-opt4', text: 'پہلے پر زبر دوسرے پر زیر', subText: 'مخلوط حرکات', isCorrect: false },
    ],
    explanationUrdu: 'إِذِ میں ہمزہ اور ذال دونوں کے نیچے زَیْر (کسرہ) ہے، معروف طریقے سے "إِذِ" ادا کریں۔',
    breakdown: 'إِ + ذِ',
    breakdownLetters: ['إِ', 'ذِ'],
    tajweedRule: 'معروف تلفظ: زیر کو معروف ادا کریں، مجہول سے بچیں',
    hintText: 'دونوں حروف کے نیچے لکیر لگی ہے۔',
  },
  {
    id: 'muth-4',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (پَیْش / ضمہ)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "أُخُ" میں کس حرکت کا استعمال ہوا ہے؟',
    arabicDisplay: 'أُخُ',
    audioPronunciation: 'أُخُ',
    correctAnswer: 'دونوں حروف پر پَیْش (ضَمَّة) ہے',
    correctAnswerDisplay: 'دونوں پر پَیْش (ضَمَّة)',
    options: [
      { id: 'mt4-opt1', text: 'دونوں حروف پر پَیْش (ضَمَّة) ہے', subText: 'أُ + خُ = أُخُ', isCorrect: true },
      { id: 'mt4-opt2', text: 'دونوں پر زَبَر ہے', subText: 'أَ + خَ', isCorrect: false },
      { id: 'mt4-opt3', text: 'دونوں پر زَیْر ہے', subText: 'إِ + خِ', isCorrect: false },
      { id: 'mt4-opt4', text: 'ہمزہ پر پیش اور خاء پر جزم', subText: 'أُخْ', isCorrect: false },
    ],
    explanationUrdu: 'أُخُ میں ہمزہ اور خاء دونوں کے اوپر پَیْش (ضمہ) ہے، ہونٹوں کو گول کر کے ادا کریں۔',
    breakdown: 'أُ + خُ',
    breakdownLetters: ['أُ', 'خُ'],
    tajweedRule: 'پیش کی ادائیگی میں ہونٹوں کو پوری طرح گول کریں',
    hintText: 'دونوں حروف کے اوپر چھوٹے واؤ کی شکل ہے۔',
  },
  {
    id: 'muth-5',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (۳ حرفی کلمات)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "دَرَسَ" کی درست ہجہ کیا ہے؟',
    arabicDisplay: 'دَرَسَ',
    audioPronunciation: 'دَرَسَ',
    correctAnswer: 'دَال زبر دَ + رَاء زبر رَ + سِين زبر سَ = دَرَسَ',
    correctAnswerDisplay: 'دَال زبر دَ + رَاء زبر رَ + سِين زبر سَ',
    options: [
      { id: 'mt5-opt1', text: 'دَال زبر دَ + رَاء زبر رَ + سِين زبر سَ', subText: 'دَ + رَ + سَ (تینوں پر زبر)', isCorrect: true },
      { id: 'mt5-opt2', text: 'دال پیش دُ + راء زیر رِ + سین زبر سَ', subText: 'دُرِسَ', isCorrect: false },
      { id: 'mt5-opt3', text: 'دال زبر راء جزم + سین زبر سَ', subText: 'دَرْسَ', isCorrect: false },
      { id: 'mt5-opt4', text: 'دال زیر دِ + راء زیر رِ + سین زبر سَ', subText: 'دِرِسَ', isCorrect: false },
    ],
    explanationUrdu: 'دَرَسَ میں تینوں حروف پر زبر ہے: دَ + رَ + سَ = دَرَسَ۔',
    breakdown: 'دَ + رَ + سَ',
    breakdownLetters: ['دَ', 'رَ', 'سَ'],
    tajweedRule: 'تینوں متحرک حروف کو یکساں رفتار سے بغیر کھینچے ادا کریں',
    hintText: 'د، ر اور س تینوں کے اوپر زبر لگا ہوا ہے۔',
  },
  {
    id: 'muth-6',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (مخلوط حرکات)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "عَلِمَ" میں حرکات کی ترتیب کیا ہے؟',
    arabicDisplay: 'عَلِمَ',
    audioPronunciation: 'عَلِمَ',
    correctAnswer: 'زَبَر (عَ) + زَیْر (لِ) + زَبَر (مَ)',
    correctAnswerDisplay: 'زَبَر + زَیْر + زَبَر (عَ لِ مَ)',
    options: [
      { id: 'mt6-opt1', text: 'زَبَر (عَ) + زَیْر (لِ) + زَبَر (مَ)', subText: 'عین زبر عَ، لام زیر لِ، میم زبر مَ', isCorrect: true },
      { id: 'mt6-opt2', text: 'تینوں پر زبر ہے', subText: 'عَلَمَ', isCorrect: false },
      { id: 'mt6-opt3', text: 'پیش + زیر + زبر', subText: 'عُلِمَ', isCorrect: false },
      { id: 'mt6-opt4', text: 'زیر + زیر + زبر', subText: 'عِلِمَ', isCorrect: false },
    ],
    explanationUrdu: 'عَلِمَ میں عین پر زبر (عَ)، لام کے نیچے زیر (لِ) اور میم پر زبر (مَ) ہے۔',
    breakdown: 'عَ + لِ + مَ',
    breakdownLetters: ['عَ', 'لِ', 'مَ'],
    tajweedRule: 'زیر اور زبر کی درست تفریق اور مجہول آواز سے اجتناب',
    hintText: 'درمیانی حرف لام کے نیچے زیر ہے، باقی دونوں پر زبر ہے۔',
  },
  {
    id: 'muth-7',
    category: 'mutaharrikat',
    categoryLabelUrdu: 'متحرکات (مخلوط حرکات)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "خُلِقَ" میں پہلا، دوسرا اور تیسرا حرف کن حرکات کے ساتھ ہے؟',
    arabicDisplay: 'خُلِقَ',
    audioPronunciation: 'خُلِقَ',
    correctAnswer: 'پَیْش (خُ) + زَیْر (لِ) + زَبَر (قَ)',
    correctAnswerDisplay: 'پَیْش + زَیْر + زَبَر (خُ لِ قَ)',
    options: [
      { id: 'mt7-opt1', text: 'پَیْش (خُ) + زَیْر (لِ) + زَبَر (قَ)', subText: 'خاء پیش خُ، لام زیر لِ، قاف زبر قَ', isCorrect: true },
      { id: 'mt7-opt2', text: 'تینوں پر پیش ہے', subText: 'خُلُقُ', isCorrect: false },
      { id: 'mt7-opt3', text: 'زبر + زبر + زبر', subText: 'خَلَقَ', isCorrect: false },
      { id: 'mt7-opt4', text: 'زیر + پیش + زبر', subText: 'خِلُقَ', isCorrect: false },
    ],
    explanationUrdu: 'خُلِقَ میں خاء پر پیش (خُ)، لام کے نیچے زیر (لِ) اور قاف پر زبر (قَ) ہے۔',
    breakdown: 'خُ + لِ + قَ',
    breakdownLetters: ['خُ', 'لِ', 'قَ'],
    tajweedRule: 'خاء اور قاف دونوں حروفِ مستعلیہ (موٹے) پڑھے جائیں گے',
    hintText: 'پہلے پر پیش، دوسرے کے نیچے زیر اور تیسرے پر زبر ہے۔',
  },

  // ==========================================================================
  // 3. 🛑 ساکن حروف و سکون کوئز (SUKOON, JAZM & QALQALAH)
  // ==========================================================================
  {
    id: 'suk-1',
    category: 'sukoon',
    categoryLabelUrdu: 'سکون و جزم',
    badgeColor: 'purple',
    promptTitle: 'سکون (جزم) والے حرف کو کیا کہتے ہیں؟',
    arabicDisplay: 'ـْ (جَزْم)',
    audioPronunciation: 'سَاكِنْ',
    correctAnswer: 'ساکن حرف (جس پر جزم ہو)',
    correctAnswerDisplay: 'ساکن حرف',
    options: [
      { id: 'sk1-opt1', text: 'ساکن حرف (جس پر جزم ہو)', subText: 'ساکن حرف اکیلا نہیں پڑھا جا سکتا', isCorrect: true },
      { id: 'sk1-opt2', text: 'متحرک حرف', subText: 'جس پر حرکت ہو', isCorrect: false },
      { id: 'sk1-opt3', text: 'مشدد حرف', subText: 'جس پر تشدید ہو', isCorrect: false },
      { id: 'sk1-opt4', text: 'منون حرف', subText: 'جس پر تنوین ہو', isCorrect: false },
    ],
    explanationUrdu: 'جس حرف پر جزم (سکون) ہو اسے "ساکن" کہتے ہیں، یہ اپنے سے پہلے والے متحرک حرف سے مل کر پڑھا جاتا ہے۔',
    tajweedRule: 'سکون کا قاعدہ: ساکن حرف ماقبل متحرک حرف کے سہارے پڑھا جاتا ہے',
    hintText: 'جس پر جزم ہو اسے ساکن کہتے ہیں۔',
  },
  {
    id: 'suk-2',
    category: 'sukoon',
    categoryLabelUrdu: 'حروفِ قلقلہ',
    badgeColor: 'purple',
    promptTitle: 'حروفِ قلقلہ کتنے ہیں اور ان کا مجموعہ کیا ہے؟',
    arabicDisplay: 'قُطْبُ جَدٍّ (ق ط ب ج د)',
    audioPronunciation: 'قَافْ طَاءْ بَاءْ جِيمْ دَالْ',
    correctAnswer: '۵ حروف: ق ، ط ، ب ، ج ، د (قُطْبُ جَدٍّ)',
    correctAnswerDisplay: '۵ حروف: قُطْبُ جَدٍّ',
    options: [
      { id: 'sk2-opt1', text: '۵ حروف: ق ، ط ، ب ، ج ، د (قُطْبُ جَدٍّ)', subText: 'ساکن ہونے پر ان میں جنبش پیدا ہوتی ہے', isCorrect: true },
      { id: 'sk2-opt2', text: '۳ حروف: ا ، و ، ی', subText: 'یہ حروفِ مدہ ہیں', isCorrect: false },
      { id: 'sk2-opt3', text: '۶ حروف: ء ، ہ ، ع ، ح ، غ ، خ', subText: 'یہ حروفِ حلقی ہیں', isCorrect: false },
      { id: 'sk2-opt4', text: '۴ حروف: ب ، م ، و ، ف', subText: 'یہ حروفِ شفویہ ہیں', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ قلقلہ پانچ ہیں (ق، ط، ب، ج، د) جن کا مجموعہ "قُطْبُ جَدٍّ" ہے۔ جب یہ ساکن ہوں تو ان کے مخرج میں جنبش اور آواز کی بازگشت ہوتی ہے۔',
    tajweedRule: 'قاعدہ قلقلہ: حروفِ قلقلہ پر سکون کی حالت میں آواز لوٹتی ہے',
    hintText: 'یاد رکھیں: قطب جد (قاف، طا، با، جیم، دال)۔',
  },
  {
    id: 'suk-3',
    category: 'sukoon',
    categoryLabelUrdu: 'سکون (۲ حرفی کلمات)',
    badgeColor: 'purple',
    promptTitle: 'لفظ "قُلْ" میں ساکن حرف کون سا ہے؟',
    arabicDisplay: 'قُلْ',
    audioPronunciation: 'قُلْ',
    correctAnswer: 'لَامْ (لْ)',
    correctAnswerDisplay: 'لَامْ (لْ)',
    options: [
      { id: 'sk3-opt1', text: 'لَامْ (لْ)', subText: 'لام پر جزم ہے', isCorrect: true },
      { id: 'sk3-opt2', text: 'قَافْ (قُ)', subText: 'قاف پر پیش ہے (متحرک)', isCorrect: false },
      { id: 'sk3-opt3', text: 'دونوں ساکن ہیں', subText: 'پہلا حرف متحرک ہے', isCorrect: false },
      { id: 'sk3-opt4', text: 'کوئی بھی ساکن نہیں', subText: 'لام پر جزم ہے', isCorrect: false },
    ],
    explanationUrdu: 'قُلْ میں قاف پر پیش ہے (قُ) اور لام پر جزم ہے (لْ)، پس ساکن حرف لام ہے۔',
    breakdown: 'قُ + لْ',
    breakdownLetters: ['قُ', 'لْ'],
    tajweedRule: 'قاف مستعلیہ کو موٹا اور لام کو باریک پڑھیں',
    hintText: 'لام کے اوپر جزم (سکون کا دائرہ) لگا ہوا ہے۔',
  },
  {
    id: 'suk-4',
    category: 'sukoon',
    categoryLabelUrdu: 'قاعدہ ہمزہ ساکنہ',
    badgeColor: 'purple',
    promptTitle: 'جب ہمزہ پر جزم (سکون) آئے تو اسے کیسے پڑھا جاتا ہے؟',
    arabicDisplay: 'يَأْكُلُ ، مُؤْمِنٌ (ءْ)',
    audioPronunciation: 'يَأْكُلُ',
    correctAnswer: 'جھٹکا دے کر پڑھا جاتا ہے',
    correctAnswerDisplay: 'جھٹکا دے کر پڑھا جاتا ہے',
    options: [
      { id: 'sk4-opt1', text: 'جھٹکا دے کر پڑھا جاتا ہے', subText: 'ہمزہ ساکنہ پر آواز رکتی ہے', isCorrect: true },
      { id: 'sk4-opt2', text: 'کھینچ کر پڑھا جاتا ہے', subText: 'مد کی طرح نہیں پڑھا جاتا', isCorrect: false },
      { id: 'sk4-opt3', text: 'غنہ کر کے پڑھا جاتا ہے', subText: 'ناک میں آواز نہیں جائے گی', isCorrect: false },
      { id: 'sk4-opt4', text: 'قلقلہ کیا جاتا ہے', subText: 'ہمزہ حروف قلقلہ میں نہیں ہے', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: جب ہمزہ ساکنہ ہو (جیسے يَأْكُلُ، مُؤْمِنٌ) تو اسے جھٹکا دے کر سختی کے ساتھ ادا کرتے ہیں۔',
    tajweedRule: 'قاعدہ ہمزہ ساکنہ: ہمزہ ساکنہ کو جھٹکا دے کر پڑھتے ہیں',
    hintText: 'ہمزہ ساکنہ کی خاص صفت ہے کہ اس میں سانس اور آواز کو جھٹکا لگتا ہے۔',
  },
  {
    id: 'suk-5',
    category: 'sukoon',
    categoryLabelUrdu: 'سکون و ساکن حروف',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "يَعْلَمُ" میں کون سا حرف ساکن ہے؟',
    arabicDisplay: 'يَعْلَمُ',
    audioPronunciation: 'يَعْلَمُ',
    correctAnswer: 'عَيْنْ (عْ)',
    correctAnswerDisplay: 'عَيْنْ (عْ)',
    options: [
      { id: 'sk5-opt1', text: 'يَاءْ (يَ)', subText: 'یاء زبر والی ہے', isCorrect: false },
      { id: 'sk5-opt2', text: 'عَيْنْ (عْ)', subText: 'عین پر جزم ہے', isCorrect: true },
      { id: 'sk5-opt3', text: 'لَامْ (لَ)', subText: 'لام زبر والی ہے', isCorrect: false },
      { id: 'sk5-opt4', text: 'مِيمْ (مُ)', subText: 'میم پیش والی ہے', isCorrect: false },
    ],
    explanationUrdu: 'يَعْلَمُ میں صرف "عین" پر جزم (سکون) ہے، باقی تینوں حروف (یَ، لَ، مُ) متحرک ہیں۔',
    breakdown: 'يَ + عْ + لَ + مُ',
    breakdownLetters: ['يَ', 'عْ', 'لَ', 'مُ'],
    tajweedRule: 'حلق کے درمیان سے عین ساکنہ کی درست ادائیگی',
    hintText: 'عین کے اوپر جزم کا نشان لگا ہے۔',
  },
  {
    id: 'suk-6',
    category: 'sukoon',
    categoryLabelUrdu: 'سکون (۲ حرفی ساکن کلمات)',
    badgeColor: 'purple',
    promptTitle: 'لفظ "مَنْ" کا صحیح ہجہ کیا ہے؟',
    arabicDisplay: 'مَنْ',
    audioPronunciation: 'مَنْ',
    correctAnswer: 'مِيم زبر نون جزم = مَنْ',
    correctAnswerDisplay: 'مِيم زبر نون جزم = مَنْ',
    options: [
      { id: 'sk6-opt1', text: 'مِيم زبر نون جزم = مَنْ', subText: 'مَ + نْ', isCorrect: true },
      { id: 'sk6-opt2', text: 'میم پیش نون جزم = مُنْ', subText: 'مُ + نْ', isCorrect: false },
      { id: 'sk6-opt3', text: 'میم زیر نون جزم = مِنْ', subText: 'مِ + نْ', isCorrect: false },
      { id: 'sk6-opt4', text: 'میم زبر نون زبر = مَنَ', subText: 'مَ + نَ', isCorrect: false },
    ],
    explanationUrdu: 'میم پر زبر اور نون پر جزم ہے: مَ + نْ = مَنْ (جو کوئی)۔',
    breakdown: 'مَ + نْ',
    breakdownLetters: ['مَ', 'نْ'],
    tajweedRule: 'ساکن حرف کی متحرک حرف سے ملاوٹ',
    hintText: 'میم پر زبر اور نون پر جزم ہے۔',
  },
  {
    id: 'suk-7',
    category: 'sukoon',
    categoryLabelUrdu: 'حروفِ قلقلہ',
    badgeColor: 'purple',
    promptTitle: 'مندرجہ ذیل میں سے کس کلمے میں قلقلہ پایا جاتا ہے؟',
    arabicDisplay: 'حَبْ',
    audioPronunciation: 'حَبْ',
    correctAnswer: 'حَبْ (کیونکہ باء ساکن ہے)',
    correctAnswerDisplay: 'حَبْ (کیونکہ باء ساکن ہے)',
    options: [
      { id: 'sk7-opt1', text: 'حَبْ', subText: 'باء ساکن پر قلقلہ ہوگا', isCorrect: true },
      { id: 'sk7-opt2', text: 'عَنْ', subText: 'نون ساکن ہے (قلقلہ نہیں)', isCorrect: false },
      { id: 'sk7-opt3', text: 'هَلْ', subText: 'لام ساکن ہے (قلقلہ نہیں)', isCorrect: false },
      { id: 'sk7-opt4', text: 'لَمْ', subText: 'میم ساکن ہے (قلقلہ نہیں)', isCorrect: false },
    ],
    explanationUrdu: 'صرف "حَبْ" میں باء (ب) ساکن ہے جو کہ حروفِ قلقلہ (ق، ط، ب، ج، د) میں سے ہے۔',
    breakdown: 'حَ + بْ',
    breakdownLetters: ['حَ', 'بْ'],
    tajweedRule: 'حروفِ قلقلہ کی تمیز و پہچان',
    hintText: 'ق، ط، ب، ج، د میں سے باء (ب) موجود ہے۔',
  },
  {
    id: 'suk-8',
    category: 'sukoon',
    categoryLabelUrdu: 'سکون و جزم',
    badgeColor: 'purple',
    promptTitle: 'لفظ "كَمْ" میں کس حرف پر جزم لگی ہے؟',
    arabicDisplay: 'كَمْ',
    audioPronunciation: 'كَمْ',
    correctAnswer: 'مِيمْ (مْ)',
    correctAnswerDisplay: 'مِيمْ (مْ)',
    options: [
      { id: 'sk8-opt1', text: 'كَافْ (كَ)', subText: 'کاف متحرک بالفتح ہے', isCorrect: false },
      { id: 'sk8-opt2', text: 'مِيمْ (مْ)', subText: 'میم پر جزم ہے', isCorrect: true },
      { id: 'sk8-opt3', text: 'نون (نْ)', subText: 'نون موجود نہیں', isCorrect: false },
      { id: 'sk8-opt4', text: 'لام (لْ)', subText: 'لام موجود نہیں', isCorrect: false },
    ],
    explanationUrdu: 'کاف پر زبر ہے اور میم پر جزم ہے: كَ + مْ = كَمْ۔',
    breakdown: 'كَ + مْ',
    breakdownLetters: ['كَ', 'مْ'],
    tajweedRule: 'میم ساکنہ کی بنیادی پہچان',
    hintText: 'آخری حرف میم کے اوپر جزم کا نشان ہے۔',
  },

  // ==========================================================================
  // 4. 🔤 حروفِ تہجی و مفردات کوئز (MUFRADAT & 29 LETTERS & MAKHAARIJ)
  // ==========================================================================
  {
    id: 'muf-1',
    category: 'mufradat',
    categoryLabelUrdu: 'حروفِ مفردات',
    badgeColor: 'cyan',
    promptTitle: 'اس حرف کو پہچانیں: "ض"',
    arabicDisplay: 'ض',
    audioPronunciation: 'ضَادْ',
    correctAnswer: 'ضَادْ',
    correctAnswerDisplay: 'ضَادْ (حرفِ پُر و مستعلیہ)',
    options: [
      { id: 'mf1-opt1', text: 'صَادْ', subText: 'بے نقطہ', isCorrect: false },
      { id: 'mf1-opt2', text: 'ضَادْ', subText: '۱ نقطہ اوپر (پُر پڑھا جانے والا)', isCorrect: true },
      { id: 'mf1-opt3', text: 'ظَاءْ', subText: 'طوئے والی شکل', isCorrect: false },
      { id: 'mf1-opt4', text: 'طَاءْ', subText: 'بے نقطہ', isCorrect: false },
    ],
    explanationUrdu: 'حرف "ضَادْ" زبان کی کروٹ اور اوپر کی داڑھوں کی جڑ سے ادا ہوتا ہے اور ہمیشہ پُر پڑھا جاتا ہے۔',
    tajweedRule: 'حروفِ مستعلیہ: ضاد پُر پڑھا جاتا ہے',
    hintText: 'اس حرف کے اوپر ایک نقطہ ہے اور یہ صاد کا جوڑی دار ہے۔',
  },
  {
    id: 'muf-2',
    category: 'mufradat',
    categoryLabelUrdu: 'مخارج الحروف',
    badgeColor: 'cyan',
    promptTitle: 'حروفِ شفویہ (ہونٹوں سے ادا ہونے والے) حروف کون سے ہیں؟',
    arabicDisplay: 'ب ، م ، و ، ف',
    audioPronunciation: 'بَاءْ مِيمْ وَاوْ فَاءْ',
    correctAnswer: 'ب ، م ، و ، ف',
    correctAnswerDisplay: 'ب ، م ، و ، ف (چار حروف)',
    options: [
      { id: 'mf2-opt1', text: 'ب ، م ، و ، ف', subText: 'دونوں ہونٹوں اور دانتوں کے کنارے سے', isCorrect: true },
      { id: 'mf2-opt2', text: 'ء ، ہ ، ع ، ح', subText: 'حروفِ حلقی', isCorrect: false },
      { id: 'mf2-opt3', text: 'ق ، ك', subText: 'حروفِ لہویہ', isCorrect: false },
      { id: 'mf2-opt4', text: 'ت ، د ، ط', subText: 'حروفِ نطعیہ', isCorrect: false },
    ],
    explanationUrdu: 'شفویہ یعنی ہونٹوں کے حروف چار ہیں: ب، م، و، ف۔',
    tajweedRule: 'مخرج: ہونٹوں کے چار حروف',
    hintText: 'ہونٹ ملانے یا ہونٹ اور دانت چھونے سے ادا ہوتے ہیں۔',
  },
  {
    id: 'muf-3',
    category: 'mufradat',
    categoryLabelUrdu: 'حروفِ حلقیہ',
    badgeColor: 'cyan',
    promptTitle: 'حلق سے ادا ہونے والے حروفِ حلقیہ کی تعداد کتنی ہے؟',
    arabicDisplay: 'ء ه ع ح غ خ',
    audioPronunciation: 'هَمْزَة هَاءْ عَيْنْ حَاءْ غَيْنْ خَاءْ',
    correctAnswer: '۶ حروف (ء، ہ، ع، ح، غ، خ)',
    correctAnswerDisplay: '۶ حروف (ء، ہ، ع، ح، غ، خ)',
    options: [
      { id: 'mf3-opt1', text: '۴ حروف', subText: 'چار حروف', isCorrect: false },
      { id: 'mf3-opt2', text: '۶ حروف (ء، ہ، ع، ح، غ، خ)', subText: 'حلق کے ۳ حصوں سے ۶ حروف', isCorrect: true },
      { id: 'mf3-opt3', text: '۷ حروف', subText: 'سات حروف', isCorrect: false },
      { id: 'mf3-opt4', text: '۵ حروف', subText: 'پانچ حروف', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ حلقی چھ ہیں: ادنیٰ حلق سے (غ، خ)، وسط حلق سے (ع، ح)، اور اقصی حلق سے (ء، ہ) ادا ہوتے ہیں۔',
    tajweedRule: 'مخرج: حروفِ حلقیہ شش گانہ',
    hintText: 'ہمزہ، ہا، عین، حا، غین اور خاء — کل چھ حروف۔',
  },
  {
    id: 'muf-4',
    category: 'mufradat',
    categoryLabelUrdu: 'حروفِ مستعلیہ (پُر پڑھے جانے والے)',
    badgeColor: 'cyan',
    promptTitle: 'ہمیشہ موٹے (پُر) پڑھے جانے والے حروفِ مستعلیہ کا مجموعہ کیا ہے؟',
    arabicDisplay: 'خُصَّ ضَغْطٍ قِظْ',
    audioPronunciation: 'خُصَّ ضَغْطٍ قِظْ',
    correctAnswer: 'خ ص ض ط ظ غ ق (خُصَّ ضَغْطٍ قِظْ)',
    correctAnswerDisplay: 'خ ص ض ط ظ غ ق (خُصَّ ضَغْطٍ قِظْ)',
    options: [
      { id: 'mf4-opt1', text: 'خ ص ض ط ظ غ ق (خُصَّ ضَغْطٍ قِظْ)', subText: 'سات حروف ہمیشہ موٹے پڑھے جاتے ہیں', isCorrect: true },
      { id: 'mf4-opt2', text: 'ق ط ب ج د', subText: 'یہ حروفِ قلقلہ ہیں', isCorrect: false },
      { id: 'mf4-opt3', text: 'ا و ی', subText: 'یہ حروفِ مدہ ہیں', isCorrect: false },
      { id: 'mf4-opt4', text: 'ء ہ ع ح', subText: 'یہ حروفِ حلقی ہیں', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ مستعلیہ سات ہیں جو ہر حال میں موٹے (پُر) پڑھے جاتے ہیں: خ، ص، ض، ط، ظ، غ، ق۔',
    tajweedRule: 'حروفِ مستعلیہ کا قاعدہ',
    hintText: 'خُصَّ ضَغْطٍ قِظْ — سات حروف۔',
  },
  {
    id: 'muf-5',
    category: 'mufradat',
    categoryLabelUrdu: 'حروفِ مدہ',
    badgeColor: 'cyan',
    promptTitle: 'حروفِ مدہ کتنے ہیں اور کون سے ہیں؟',
    arabicDisplay: 'ا  و  ی (حُرُوْفِ مَدَّہ)',
    audioPronunciation: 'أَلِفْ وَاوْ يَاءْ',
    correctAnswer: '۳ حروف: الف، واؤ، یاء (الف مدہ، واؤ مدہ، یاء مدہ)',
    correctAnswerDisplay: '۳ حروف: الف، واؤ، یاء',
    options: [
      { id: 'mf5-opt1', text: '۳ حروف: الف، واؤ، یاء', subText: 'ایک الف (۲ حرکات) کے برابر کھینچا جاتا ہے', isCorrect: true },
      { id: 'mf5-opt2', text: '۵ حروف: ق، ط، ب، ج، د', subText: 'یہ حروف قلقلہ ہیں', isCorrect: false },
      { id: 'mf5-opt3', text: '۴ حروف: ب، م، و، ف', subText: 'یہ شفویہ ہیں', isCorrect: false },
      { id: 'mf5-opt4', text: '۲ حروف: زبر اور زیر', subText: 'یہ حرکات ہیں', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ مدہ تین ہیں: الف سے پہلے زبر ہو، واؤ ساکن سے پہلے پیش ہو، یاء ساکن سے پہلے زیر ہو۔',
    tajweedRule: 'قاعدہ حروفِ مدہ: ۱ الف کی مقدار کھینچ کر پڑھیں',
    hintText: 'الف، واؤ اور یاء حروفِ مدہ ہیں۔',
  },

  // ==========================================================================
  // 5. 🎮 حروفِ مدہ کوئز (MADDAH QUESTIONS - ALIF, WAW, YAA MADDAH)
  // ==========================================================================
  {
    id: 'mad-1',
    category: 'maddah',
    categoryLabelUrdu: 'حروفِ مدہ (الف مدہ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "بَا" میں کونسا قاعدہ جاری ہے اور اسے کتنا کھینچیں گے؟',
    arabicDisplay: 'بَا',
    audioPronunciation: 'بَا',
    correctAnswer: 'الف مدہ — ۱ الف (۲ حرکات) کے برابر کھینچیں گے',
    correctAnswerDisplay: 'الف مدہ (۱ الف)',
    options: [
      { id: 'md1-opt1', text: 'الف مدہ — ۱ الف کے برابر لمبا کریں گے', subText: 'الف سے پہلے زبر ہے', isCorrect: true },
      { id: 'md1-opt2', text: 'الف لین — بغیر کھینچے جلدی پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'md1-opt3', text: 'صرف عام زبر ہے', subText: 'غلط', isCorrect: false },
      { id: 'md1-opt4', text: 'قلقلہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'جب الف خالی ہو اور اس سے پہلے والے حرف پر زبر ہو تو اسے "الف مدہ" کہتے ہیں اور ۱ الف یعنی ۲ حرکات کی مقدار کھینچتے ہیں۔',
    breakdown: 'بَ + ا',
    breakdownLetters: ['بَ', 'ا'],
    tajweedRule: 'الف مدہ کا قاعدہ: الف خالی قبل مفتوح',
    hintText: 'الف سے پہلے زبر ہے، اس لیے ۱ الف کھینچیں گے۔',
  },
  {
    id: 'mad-2',
    category: 'maddah',
    categoryLabelUrdu: 'حروفِ مدہ (واؤ مدہ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "تُوْ" میں واؤ مدہ کی کیا پہچان ہے؟',
    arabicDisplay: 'تُوْ',
    audioPronunciation: 'تُوْ',
    correctAnswer: 'واؤ ساکن سے پہلے پیش ہے',
    correctAnswerDisplay: 'واؤ ساکن قبل مضموم',
    options: [
      { id: 'md2-opt1', text: 'واؤ ساکن سے پہلے پیش ہے', subText: 'واؤ مدہ بنتا ہے اور ۱ الف کھینچتے ہیں', isCorrect: true },
      { id: 'md2-opt2', text: 'واؤ ساکن سے پہلے زبر ہے', subText: 'یہ واؤ لین ہوتا ہے', isCorrect: false },
      { id: 'md2-opt3', text: 'واؤ پر زبر ہے', subText: 'غلط', isCorrect: false },
      { id: 'md2-opt4', text: 'ت پر جزم ہے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'واؤ ساکن (جزم والی) سے پہلے پیش ہو تو "واؤ مدہ" ہوتا ہے، جیسے: تُوْ، نُوْ۔',
    breakdown: 'تُ + وْ',
    breakdownLetters: ['تُ', 'وْ'],
    tajweedRule: 'واؤ مدہ کا قاعدہ: واؤ ساکن قبل مضموم',
    hintText: 'ت پر پیش اور آگے واؤ ساکن ہے۔',
  },
  {
    id: 'mad-3',
    category: 'maddah',
    categoryLabelUrdu: 'حروفِ مدہ (یاء مدہ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "فِیْ" میں یاء مدہ کو کس انداز سے پڑھا جائے گا؟',
    arabicDisplay: 'فِیْ',
    audioPronunciation: 'فِیْ',
    correctAnswer: 'معروف اور ۱ الف کھینچ کر',
    correctAnswerDisplay: 'معروف ۱ الف کھینچ کر',
    options: [
      { id: 'md3-opt1', text: 'معروف اور ۱ الف کھینچ کر', subText: 'یاء ساکن سے پہلے زیر ہے', isCorrect: true },
      { id: 'md3-opt2', text: 'مجہول اور جھٹکے کے ساتھ', subText: 'مجہول پڑھنا منع ہے', isCorrect: false },
      { id: 'md3-opt3', text: 'غنّہ کر کے ناک سے', subText: 'غلط', isCorrect: false },
      { id: 'md3-opt4', text: 'بغیر کھینچے جلدی سے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'یاء ساکن سے پہلے زیر ہو تو یاء مدہ ہوتا ہے، اسے معروف اور ۱ الف لمبا کر کے پڑھتے ہیں۔',
    breakdown: 'فِ + یْ',
    breakdownLetters: ['فِ', 'یْ'],
    tajweedRule: 'یاء مدہ کا قاعدہ: یاء ساکن قبل مکسور',
    hintText: 'فاء کے نیچے زیر اور آگے یاء ساکن ہے۔',
  },

  // ==========================================================================
  // 6. 🍃 حروفِ لین کوئز (LEEN QUESTIONS - WAW LEEN & YAA LEEN)
  // ==========================================================================
  {
    id: 'leen-1',
    category: 'leen',
    categoryLabelUrdu: 'حروفِ لین (واؤ لین)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "خَوْفٌ" میں واؤ کونسا حرف ہے اور کیسے پڑھا جائے گا؟',
    arabicDisplay: 'خَوْفٌ',
    audioPronunciation: 'خَوْفٌ',
    correctAnswer: 'واؤ لین — نرمی سے بغیر جھٹکے اور بغیر کھینچے',
    correctAnswerDisplay: 'واؤ لین (نرمی سے)',
    options: [
      { id: 'ln1-opt1', text: 'واؤ لین — نرم آواز سے بغیر کھینچے', subText: 'واؤ ساکن سے پہلے زبر ہے', isCorrect: true },
      { id: 'ln1-opt2', text: 'واؤ مدہ — ۱ الف کھینچ کر', subText: 'غلط کیونکہ پہلے زبر ہے پیش نہیں', isCorrect: false },
      { id: 'ln1-opt3', text: 'قلقلہ کے ساتھ گونج پیدا کر کے', subText: 'غلط', isCorrect: false },
      { id: 'ln1-opt4', text: 'مجہول پڑھا جائے گا', subText: 'مجہول پڑھنا منع ہے', isCorrect: false },
    ],
    explanationUrdu: 'واؤ ساکن سے پہلے زبر ہو تو واؤ لین ہوتا ہے، اسے بغیر کھینچے اور بغیر جھٹکا دیے نرمی سے ادا کرتے ہیں۔',
    breakdown: 'خَ + وْ + فٌ',
    breakdownLetters: ['خَ', 'وْ', 'فٌ'],
    tajweedRule: 'قاعدہ واؤ لین: واؤ ساکن قبل مفتوح',
    hintText: 'خاء پر زبر اور آگے واؤ ساکن ہے۔',
  },
  {
    id: 'leen-2',
    category: 'leen',
    categoryLabelUrdu: 'حروفِ لین (یاء لین)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "بَیْتٌ" میں یاء لین کی ادائیگی کا درست طریقہ کیا ہے؟',
    arabicDisplay: 'بَیْتٌ',
    audioPronunciation: 'بَیْتٌ',
    correctAnswer: 'نرمی اور معروف آواز سے بغیر کھینچے',
    correctAnswerDisplay: 'نرمی سے معروف',
    options: [
      { id: 'ln2-opt1', text: 'نرمی اور معروف آواز سے بغیر کھینچے', subText: 'یاء ساکن سے پہلے زبر ہے', isCorrect: true },
      { id: 'ln2-opt2', text: 'بہت زیادہ کھینچ کر', subText: 'حروفِ لین کو کھینچا نہیں جاتا', isCorrect: false },
      { id: 'ln2-opt3', text: 'ناک سے غنہ کے ساتھ', subText: 'غلط', isCorrect: false },
      { id: 'ln2-opt4', text: 'جھٹکے کے ساتھ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'یاء ساکن سے پہلے زبر ہو تو یاء لین ہوتا ہے، جیسے: بَیْتٌ، صَیْفٌ، شَیْءٌ۔',
    breakdown: 'بَ + یْ + تٌ',
    breakdownLetters: ['بَ', 'یْ', 'تٌ'],
    tajweedRule: 'قاعدہ یاء لین: یاء ساکن قبل مفتوح',
    hintText: 'باء پر زبر اور آگے یاء ساکن ہے۔',
  },
  {
    id: 'leen-3',
    category: 'leen',
    categoryLabelUrdu: 'حروفِ لین کی تعداد',
    badgeColor: 'emerald',
    promptTitle: 'حروفِ لین کل کتنے ہیں؟',
    arabicDisplay: 'حُرُوْفِ لِیْن (۲ حروف)',
    audioPronunciation: 'وَاوْ لِیْن وَ يَاءْ لِیْن',
    correctAnswer: '۲ حروف: واؤ لین اور یاء لین',
    correctAnswerDisplay: '۲ حروف (وْ ، یْ)',
    options: [
      { id: 'ln3-opt1', text: '۲ حروف: واؤ ساکن اور یاء ساکن (جبکہ ان سے پہلے زبر ہو)', subText: 'درست', isCorrect: true },
      { id: 'ln3-opt2', text: '۳ حروف: الف، واؤ، یاء', subText: 'یہ حروف مدہ ہیں', isCorrect: false },
      { id: 'ln3-opt3', text: '۵ حروف: قطب جد', subText: 'یہ قلقلہ ہیں', isCorrect: false },
      { id: 'ln3-opt4', text: '۶ حروفِ حلقی', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ لین ۲ ہیں: واؤ ساکن اور یاء ساکن جب ان سے پہلے والے حرف پر زبر ہو۔',
    tajweedRule: 'حروفِ لین کی تعریف و شناخت',
    hintText: 'واؤ اور یاء دونوں پر جزم اور ماقبل زبر۔',
  },

  // ==========================================================================
  // 7. ✨ کھڑی حرکات کوئز (KHARI HARAKAT - KHARA ZABAR, KHARA ZER, ULTA PESH)
  // ==========================================================================
  {
    id: 'kh-1',
    category: 'khari_harakat',
    categoryLabelUrdu: 'کھڑی حرکات (کھڑا زبر)',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "مٰلِكِ" میں میم پر "کھڑا زبر" کس کے برابر ہوتا ہے؟',
    arabicDisplay: 'مٰلِكِ',
    audioPronunciation: 'مٰلِكِ',
    correctAnswer: 'الف مدہ کے برابر (۱ الف لمبا کریں گے)',
    correctAnswerDisplay: 'الف مدہ کے برابر (۱ الف)',
    options: [
      { id: 'kh1-opt1', text: 'الف مدہ کے برابر — ۱ الف کھینچیں گے', subText: 'کھڑا زبر قائم مقام الف مدہ ہے', isCorrect: true },
      { id: 'kh1-opt2', text: 'عام زبر کی طرح بغیر کھینچے پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'kh1-opt3', text: 'واؤ مدہ کے برابر', subText: 'غلط', isCorrect: false },
      { id: 'kh1-opt4', text: 'صرف قلقلہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'کھڑا زبر الف مدہ کے قائم مقام ہوتا ہے، اس لیے اسے ۱ الف (۲ حرکات) کے برابر کھینچ کر پڑھتے ہیں۔',
    breakdown: 'مٰ + لِ + كِ',
    breakdownLetters: ['مٰ', 'لِ', 'كِ'],
    tajweedRule: 'کھڑا زبر: الف مدہ کے برابر کشش',
    hintText: 'میم پر کھڑا زبر ہے، جو الف مدہ کے برابر کھینچا جائے گا۔',
  },
  {
    id: 'kh-2',
    category: 'khari_harakat',
    categoryLabelUrdu: 'کھڑی حرکات (کھڑا زیر و الٹا پیش)',
    badgeColor: 'rose',
    promptTitle: 'کھڑا زیر اور الٹا پیش بالترتیب کن حروفِ مدہ کے قائم مقام ہیں؟',
    arabicDisplay: 'بٖ ، بٗ (کھڑا زیر و الٹا پیش)',
    audioPronunciation: 'بٖ بٗ',
    correctAnswer: 'کھڑا زیر = یاء مدہ، اور الٹا پیش = واؤ مدہ',
    correctAnswerDisplay: 'یاء مدہ اور واؤ مدہ کے قائم مقام',
    options: [
      { id: 'kh2-opt1', text: 'کھڑا زیر = یاء مدہ، الٹا پیش = واؤ مدہ', subText: 'دونوں کو ۱، ۱ الف کھینچتے ہیں', isCorrect: true },
      { id: 'kh2-opt2', text: 'دونوں الف مدہ کے برابر ہیں', subText: 'غلط', isCorrect: false },
      { id: 'kh2-opt3', text: 'حروفِ لین کے برابر ہیں', subText: 'غلط', isCorrect: false },
      { id: 'kh2-opt4', text: 'ان کو کھینچا نہیں جاتا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'کھڑا زیر یاء مدہ کی طرح اور الٹا پیش واؤ مدہ کی طرح ۱ الف کے برابر کھینچ کر پڑھا جاتا ہے۔',
    tajweedRule: 'کھڑی حرکات: حروفِ مدہ کے قائم مقام',
    hintText: 'کھڑا زیر یاء مدہ اور الٹا پیش واؤ مدہ کے برابر ہے۔',
  },
  {
    id: 'kh-3',
    category: 'khari_harakat',
    categoryLabelUrdu: 'کھڑی حرکات (الٹا پیش)',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "لَہٗ" میں ہاء پر الٹا پیش پڑھنے کی مقدار کیا ہے؟',
    arabicDisplay: 'لَہٗ',
    audioPronunciation: 'لَہٗ',
    correctAnswer: '۱ الف (۲ حرکات) کھینچ کر',
    correctAnswerDisplay: '۱ الف لمبا کریں گے',
    options: [
      { id: 'kh3-opt1', text: '۱ الف (۲ حرکات) کے برابر لمبا کریں گے', subText: 'الٹا پیش واؤ مدہ کے برابر ہے', isCorrect: true },
      { id: 'kh3-opt2', text: 'جلدی سے بغیر کھینچے پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'kh3-opt3', text: 'جھٹکے سے پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'kh3-opt4', text: 'غنّہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'کلمہ "لَہٗ" میں ہاء پر الٹا پیش ہے جسے واؤ مدہ کی طرح ۱ الف کھینچ کر پڑھا جائے گا۔',
    breakdown: 'لَ + ہٗ',
    breakdownLetters: ['لَ', 'ہٗ'],
    tajweedRule: 'الٹا پیش کا قاعدہ',
    hintText: 'ہاء ضمیر پر الٹا پیش ۱ الف لمبا ہوگا۔',
  },

  // ==========================================================================
  // 8. 🌟 تنوین کوئز (TANWEEN - DO ZABAR, DO ZER, DO PESH)
  // ==========================================================================
  {
    id: 'tan-1',
    category: 'tanween',
    categoryLabelUrdu: 'تنوین (تعریف و پہچان)',
    badgeColor: 'amber',
    promptTitle: 'تنوین کسے کہتے ہیں اور اس کی آواز میں کیا پوشیدہ ہوتا ہے؟',
    arabicDisplay: 'ً  ٍ  ٌ (تَنْوِیْن)',
    audioPronunciation: 'تَنْوِیْن',
    correctAnswer: 'دو زبر، دو زیر اور دو پیش کو تنوین کہتے ہیں (نون ساکن کی آواز)',
    correctAnswerDisplay: 'دو زبر، دو زیر، دو پیش (نون ساکن)',
    options: [
      { id: 'tn1-opt1', text: 'دو زبر، دو زیر، دو پیش (نون ساکن کی آواز نکلتی ہے)', subText: 'درست تعریف', isCorrect: true },
      { id: 'tn1-opt2', text: 'صرف ایک زبر اور ایک زیر کو', subText: 'یہ حرکات ہیں', isCorrect: false },
      { id: 'tn1-opt3', text: 'جزم اور سکون کو', subText: 'یہ علامتِ سکون ہے', isCorrect: false },
      { id: 'tn1-opt4', text: 'تشدید کو', subText: 'یہ مشدد ہے', isCorrect: false },
    ],
    explanationUrdu: 'دو زبر، دو زیر اور دو پیش کو تنوین کہتے ہیں۔ تنوین کی اصل درحقیقت نون ساکن (نْ) کی آواز ہوتی ہے جیسے بً = بَنْ۔',
    tajweedRule: 'تنوین کی تعریف: نون ساکن زائدہ',
    hintText: 'تنوین میں دو زبر، دو زیر اور دو پیش شامل ہیں۔',
  },
  {
    id: 'tan-2',
    category: 'tanween',
    categoryLabelUrdu: 'تنوین (دو زبر کلمہ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "اَحَدًا" کے آخری حرف دال پر تنوین کا تلفظ کیا ہے؟',
    arabicDisplay: 'اَحَدًا',
    audioPronunciation: 'اَحَدًا',
    correctAnswer: 'دَنْ (دو زبر کی تنوین)',
    correctAnswerDisplay: 'دَنْ (دو زبر)',
    options: [
      { id: 'tn2-opt1', text: 'دَنْ (دو زبر نون ساکن کی آواز کے ساتھ)', subText: 'درست', isCorrect: true },
      { id: 'tn2-opt2', text: 'دَا (الف مدہ لمبا کر کے)', subText: 'غلط', isCorrect: false },
      { id: 'tn2-opt3', text: 'دُوں (پیش کی آواز)', subText: 'غلط', isCorrect: false },
      { id: 'tn2-opt4', text: 'دِدْ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'اَحَدًا میں دال پر دو زبر ہیں، ہجے: اَ۔ حَ۔ دًا "اَحَدًا" (دال دو زبر دَنْ)۔',
    breakdown: 'اَ + حَ + دًا',
    breakdownLetters: ['اَ', 'حَ', 'دًا'],
    tajweedRule: 'دو زبر کی تنوین کی ادائیگی',
    hintText: 'دال کے اوپر دو زبر ہیں، اس کا تلفظ "دَنْ" ہے۔',
  },
  {
    id: 'tan-3',
    category: 'tanween',
    categoryLabelUrdu: 'تنوین (دو پیش کلمہ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "عَفُوٌّ" میں واؤ پر کونسی دو چیزیں جمع ہیں؟',
    arabicDisplay: 'عَفُوٌّ',
    audioPronunciation: 'عَفُوٌّ',
    correctAnswer: 'تشدید اور دو پیش کی تنوین',
    correctAnswerDisplay: 'تشدید + تنوین',
    options: [
      { id: 'tn3-opt1', text: 'تشدید اور دو پیش کی تنوین', subText: 'واؤ مشدد بھی ہے اور منون بھی', isCorrect: true },
      { id: 'tn3-opt2', text: 'صرف جزم اور سکون', subText: 'غلط', isCorrect: false },
      { id: 'tn3-opt3', text: 'الف مدہ اور زیر', subText: 'غلط', isCorrect: false },
      { id: 'tn3-opt4', text: 'صرف ایک پیش', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'عَفُوٌّ میں واؤ پر تشدید بھی ہے اور اوپر دو پیش کی تنوین بھی ہے، ہجے: عَ۔ فُ۔ وٌّ "عَفُوٌّ"۔',
    breakdown: 'عَ + فُ + وٌّ',
    breakdownLetters: ['عَ', 'فُ', 'وٌّ'],
    tajweedRule: 'مشدد حرف پر تنوین کا اجتماع',
    hintText: 'واؤ کے اوپر تشدید اور دو پیش ہیں۔',
  },

  // ==========================================================================
  // 9. 🎯 تشدید کوئز (TASHDEED - MUSHADDAD HUROOF, GHUNNAH & QALQALAH)
  // ==========================================================================
  {
    id: 'tash-1',
    category: 'tashdeed',
    categoryLabelUrdu: 'تشدید (تعریف و ساخت)',
    badgeColor: 'purple',
    promptTitle: 'مشدد حرف (جس پر تشدید ہو) دراصل کتنے حروف پر مشتمل ہوتا ہے؟',
    arabicDisplay: 'ّ (عَلاَمَتِ تَشْدِیْد)',
    audioPronunciation: 'تَشْدِیْد',
    correctAnswer: 'دو حروف: پہلا ساکن (جزم والا) اور دوسرا متحرک',
    correctAnswerDisplay: 'دو حروف (ساکن + متحرک)',
    options: [
      { id: 'ts1-opt1', text: 'دو حروف: پہلا ساکن اور دوسرا متحرک', subText: 'مثلاً: اَبَّ = اَبْ + بَ', isCorrect: true },
      { id: 'ts1-opt2', text: 'تین حروف کا مجموعہ', subText: 'غلط', isCorrect: false },
      { id: 'ts1-opt3', text: 'صرف ایک ساکن حرف', subText: 'غلط', isCorrect: false },
      { id: 'ts1-opt4', text: 'حرفِ مدہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مشدد حرف دو بار پڑھا جاتا ہے: پہلی بار پچھلے حرف سے ملا کر ساکن حالت میں، اور دوسری بار اپنی حرکت کے ساتھ۔',
    tajweedRule: 'تشدید کی حقیقت: ادغامِ متماثلین (ساکن + متحرک)',
    hintText: 'مشدد حرف دراصل دو حروف ہوتے ہیں: پہلا ساکن اور دوسرا متحرک۔',
  },
  {
    id: 'tash-2',
    category: 'tashdeed',
    categoryLabelUrdu: 'تشدید (نون و میم مشدد پر غنہ)',
    badgeColor: 'purple',
    promptTitle: 'کلمات "اِنَّ" اور "عَمَّ" میں نون اور میم مشدد پر کیا کرنا واجب ہے؟',
    arabicDisplay: 'اِنَّ  ،  عَمَّ',
    audioPronunciation: 'اِنَّ عَمَّ',
    correctAnswer: '۱ الف کے برابر غنّہ (ناک میں آواز روکنا) واجب ہے',
    correctAnswerDisplay: 'غنّہ واجب (۱ الف)',
    options: [
      { id: 'ts2-opt1', text: '۱ الف کے برابر ناک سے غنّہ کرنا واجب ہے', subText: 'نون و میم مشدد پر ہمیشہ غنہ ہوتا ہے', isCorrect: true },
      { id: 'ts2-opt2', text: 'قلقلہ کرنا', subText: 'غلط', isCorrect: false },
      { id: 'ts2-opt3', text: 'بغیر رکے جلدی سے گزر جانا', subText: 'غلط', isCorrect: false },
      { id: 'ts2-opt4', text: 'جھٹکا دینا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون مشدد (نَّ) اور میم مشدد (مَّ) پر ہمیشہ ۱ الف کی مقدار غنّہ کرنا واجب ہے۔',
    breakdown: 'اِ + نَّ',
    breakdownLetters: ['اِ', 'نَّ'],
    tajweedRule: 'وجوبِ غنہ در نون و میم مشدد',
    hintText: 'نون اور میم پر جب بھی تشدید ہو تو غنہ واجب ہوتا ہے۔',
  },
  {
    id: 'tash-3',
    category: 'tashdeed',
    categoryLabelUrdu: 'تشدید (قلقلہ والی تشدید)',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "تَبَّ" پر جب وقف کریں گے تو باء مشدد پر قلقلہ کیسا ہوگا؟',
    arabicDisplay: 'تَبَّ (وَقْفْ: تَبّْ)',
    audioPronunciation: 'تَبَّ',
    correctAnswer: 'قلقلہ اکبر (سب سے زیادہ مضبوط و شدید قلقلہ)',
    correctAnswerDisplay: 'قلقلہ اکبر (مشدد قلقلہ)',
    options: [
      { id: 'ts3-opt1', text: 'قلقلہ اکبر — نہایت مضبوط و پرزور گونج کے ساتھ', subText: 'مشدد موقوف پر قلقلہ کا اعلیٰ ترین درجہ ہوتا ہے', isCorrect: true },
      { id: 'ts3-opt2', text: 'کوئی قلقلہ نہیں ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'ts3-opt3', text: 'صرف غنہ ہوگا', subText: 'غلط کیونکہ باء میں غنہ نہیں ہوتا', isCorrect: false },
      { id: 'ts3-opt4', text: 'جھٹکا دیا جائے گا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'جب حروفِ قلقلہ (قطب جد) پر تشدید ہو اور اس پر وقف کیا جائے تو وہاں قلقلہ اکبر (سب سے شدید قلقلہ) ہوتا ہے۔',
    breakdown: 'تَ + بَّ',
    breakdownLetters: ['تَ', 'بَّ'],
    tajweedRule: 'مراتبِ قلقلہ: قلقلہ اکبر در مشدد موقوف',
    hintText: 'باء حرفِ قلقلہ ہے، اور مشدد پر وقف سے قلقلہ اکبر ہوگا۔',
  },
  // ==========================================================================
  // 10. 🎯 نون ساکن و تنوین کے چار قواعد (IZHAR, IKHFA, IDGHAM, IQLAB)
  // ==========================================================================
  {
    id: 'nun-1',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اظہار (حروفِ حلقی)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "مَنْ آمَنَ" میں نون ساکن کا کون سا قاعدہ لاگو ہوتا ہے؟',
    arabicDisplay: 'مَنْ آمَنَ',
    audioPronunciation: 'مَنْ آمَنَ',
    correctAnswer: 'اظہارِ حلقی (بغیر غنہ کے ظاہر کر کے پڑھنا)',
    correctAnswerDisplay: 'اظہارِ حلقی',
    options: [
      { id: 'n1-opt1', text: 'اظہارِ حلقی — نون کو صاف اور ظاہر کر کے پڑھیں', subText: 'کیونکہ نون ساکن کے بعد ہمزہ (حرفِ حلقی) آیا ہے', isCorrect: true },
      { id: 'n1-opt2', text: 'اخفاء — ناک میں چھپا کر غنہ کرنا', subText: 'غلط', isCorrect: false },
      { id: 'n1-opt3', text: 'ادغام — نون کو دوسرے حرف میں ملانا', subText: 'غلط', isCorrect: false },
      { id: 'n1-opt4', text: 'اقلاب — نون کو میم سے بدلنا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن یا تنوین کے بعد حروفِ حلقی (ء، ہ، ع، ح، غ، خ) میں سے کوئی حرف آئے تو اظہار ہوگا یعنی بغیر غنہ کے نون کو واضح پڑھا جائے گا۔',
    breakdown: 'مَنْ + آمَنَ',
    breakdownLetters: ['مَنْ', 'آمَنَ'],
    tajweedRule: 'اظہارِ حلقی: حروفِ حلقی کے سبب نون کو ظاہر کرنا',
    hintText: 'نون ساکن کے بعد ہمزہ (حرفِ حلقی) موجود ہے۔',
  },
  {
    id: 'nun-2',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اخفاء (۱۵ حروف)',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "مِنْ قَبْلُ" میں نون ساکن کو کیسے ادا کیا جائے گا؟',
    arabicDisplay: 'مِنْ قَبْلُ',
    audioPronunciation: 'مِنْ قَبْلُ',
    correctAnswer: 'اخفاء (ناک کے بانسے میں آواز چھپا کر غنہ کے ساتھ)',
    correctAnswerDisplay: 'اخفاء مع الغنہ',
    options: [
      { id: 'n2-opt1', text: 'اخفاء — ناک میں آواز چھپا کر ۱ الف غنہ کے ساتھ', subText: 'کیونکہ نون ساکن کے بعد "ق" (حرفِ اخفاء) ہے', isCorrect: true },
      { id: 'n2-opt2', text: 'اظہار — بغیر غنہ کے', subText: 'غلط', isCorrect: false },
      { id: 'n2-opt3', text: 'ادغام بلا غنہ', subText: 'غلط', isCorrect: false },
      { id: 'n2-opt4', text: 'اقلاب', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن یا تنوین کے بعد ۱۵ حروفِ اخفاء (ت، ث، ج، د، ذ، ز، س، ش، ص، ض، ط، ظ، ف، ق، ک) میں سے کوئی حرف آئے تو اخفاء ہوگا یعنی آواز کو ناک میں چھپا کر ۱ الف کی مقدار غنہ کریں گے۔ چونکہ "ق" حرفِ مستعلیہ ہے اس لیے یہاں غنہ بھی موٹا (پُر) ہوگا۔',
    breakdown: 'مِنْ + قَبْلُ',
    breakdownLetters: ['مِنْ', 'قَبْلُ'],
    tajweedRule: 'اخفاء مع الغنہ اور پر غنہ کا قاعدہ',
    hintText: 'قاف حروفِ اخفاء میں سے ہے اور موٹا حرف ہے۔',
  },
  {
    id: 'nun-3',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ ادغام مع الغنہ (ی، ن، م، و)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "مَنْ يَّقُوْلُ" میں نون ساکن کا کیا بنے گا؟',
    arabicDisplay: 'مَنْ يَّقُوْلُ',
    audioPronunciation: 'مَنْ يَّقُوْلُ',
    correctAnswer: 'ادغام مع الغنہ (نون کو یاء میں ملا کر غنہ کے ساتھ پڑھیں)',
    correctAnswerDisplay: 'ادغام مع الغنہ',
    options: [
      { id: 'n3-opt1', text: 'ادغام مع الغنہ — نون کو یاء میں ملا کر ۱ الف غنہ کرنا', subText: 'حروف یرملون میں سے "ی، ن، م، و" میں ادغام مع الغنہ ہوتا ہے', isCorrect: true },
      { id: 'n3-opt2', text: 'ادغام بلا غنہ — بغیر غنہ کے ملانا', subText: 'غلط کیونکہ بلا غنہ صرف ل اور ر میں ہوتا ہے', isCorrect: false },
      { id: 'n3-opt3', text: 'اظہار — نون کو الگ پڑھنا', subText: 'غلط', isCorrect: false },
      { id: 'n3-opt4', text: 'اقلاب — میم میں بدلنا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن یا تنوین کے بعد "یَ نْ مُ وْ" (ی، ن، م، و) میں سے کوئی حرف آئے تو ادغام مع الغنہ ہوگا یعنی نون اگلے حرف میں مدغم ہو جائے گا اور غنہ بھی کیا جائے گا۔',
    breakdown: 'مَنْ + يَّقُوْلُ',
    breakdownLetters: ['مَنْ', 'يَّقُوْلُ'],
    tajweedRule: 'ادغام مع الغنہ در حروفِ ینمو',
    hintText: 'یاء ینمو کا حصہ ہے، نون یاء بن کر تشدید اور غنہ کے ساتھ ادا ہوگا۔',
  },
  {
    id: 'nun-4',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ ادغام بلا غنہ (ل، ر)',
    badgeColor: 'cyan',
    promptTitle: 'کلمہ "مِنْ لَّدُنْهُ" میں کون سا قاعدہ ہے؟',
    arabicDisplay: 'مِنْ لَّدُنْهُ (مِلَّدُنْهُ)',
    audioPronunciation: 'مِنْ لَّدُنْهُ',
    correctAnswer: 'ادغام بلا غنہ (بغیر غنہ کے مکمل ملا کر پڑھنا)',
    correctAnswerDisplay: 'ادغام بلا غنہ',
    options: [
      { id: 'n4-opt1', text: 'ادغام بلا غنہ — نون کو لام میں ملا کر بغیر غنہ کے پڑھنا', subText: 'لام اور راء میں ادغام بلا غنہ (بغیر غنہ) ہوتا ہے', isCorrect: true },
      { id: 'n4-opt2', text: 'ادغام مع الغنہ', subText: 'غلط کیونکہ ل اور ر میں غنہ نہیں ہوتا', isCorrect: false },
      { id: 'n4-opt3', text: 'اظہار', subText: 'غلط', isCorrect: false },
      { id: 'n4-opt4', text: 'اخفاء', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن یا تنوین کے بعد لام (ل) یا راء (ر) آئے تو ادغام بلا غنہ ہوگا یعنی نون مکمل طور پر لام/راء میں مل جائے گا مگر ناک میں غنہ بالکل نہیں ہوگا۔',
    breakdown: 'مِنْ + لَّدُنْهُ',
    breakdownLetters: ['مِنْ', 'لَّدُنْهُ'],
    tajweedRule: 'ادغام تام بلا غنہ در لام و راء',
    hintText: 'لام اور راء میں غنہ نہیں کیا جاتا۔',
  },
  {
    id: 'nun-5',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اقلاب (حرفِ باء)',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "مِنْۢ بَعْدِ" میں نون ساکن کس حرف سے بدل جاتا ہے؟',
    arabicDisplay: 'مِنْۢ بَعْدِ',
    audioPronunciation: 'مِنْۢ بَعْدِ',
    correctAnswer: 'چھوٹی میم (م) سے بدل کر غنہ کے ساتھ پڑھا جاتا ہے',
    correctAnswerDisplay: 'اقلاب (نون میم میں تبدیل)',
    options: [
      { id: 'n5-opt1', text: 'چھوٹی میم (م) سے بدل کر غنہ و اخفاء کے ساتھ پڑھا جاتا ہے', subText: 'کیونکہ نون ساکن کے بعد حرف "ب" آیا ہے', isCorrect: true },
      { id: 'n5-opt2', text: 'واؤ سے بدل جاتا ہے', subText: 'غلط', isCorrect: false },
      { id: 'n5-opt3', text: 'نون ہی رہتا ہے بغیر کسی تبدیلی کے', subText: 'غلط', isCorrect: false },
      { id: 'n5-opt4', text: 'لام میں بدل جاتا ہے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ اقلاب: نون ساکن یا تنوین کے بعد حرفِ باء (ب) آئے تو نون ساکن یا تنوین کو خالص میم (م) سے بدل کر اخفاء اور غنہ کے ساتھ ادا کرتے ہیں۔ قرآن مجید میں اس کی نشانی چھوٹا میم (ۢ) لکھا ہوتا ہے۔',
    breakdown: 'مِنْۢ + بَعْدِ',
    breakdownLetters: ['مِنْۢ', 'بَعْدِ'],
    tajweedRule: 'قاعدہ اقلاب: قلبِ نون ساکنہ بہ میم مخفاة مع الغنة',
    hintText: 'اقلاب کا صرف ایک ہی حرف ہے: باء (ب)۔',
  },
  {
    id: 'nun-6',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اظہار (حرفِ خاء)',
    badgeColor: 'emerald',
    promptTitle: 'آیتِ مبارکہ "مِنْ خَوْفٍ" میں نون ساکن کی ادائی کیسے ہوگی؟',
    arabicDisplay: 'مِنْ خَوْفٍ',
    audioPronunciation: 'مِنْ خَوْفٍ',
    correctAnswer: 'اظہار — بغیر غنہ کے نون ساکن کو بالکل صاف پڑھیں گے',
    correctAnswerDisplay: 'اظہارِ حلقی',
    options: [
      { id: 'n6-opt1', text: 'اظہار — نون ساکن کو بغیر غنہ کے صاف و واضح پڑھیں گے', subText: 'کیونکہ "خ" حروفِ حلقیہ میں سے ہے', isCorrect: true },
      { id: 'n6-opt2', text: 'اخفاء — ناک میں غنہ کے ساتھ', subText: 'غلط', isCorrect: false },
      { id: 'n6-opt3', text: 'ادغام — نون کو خاء میں ملانا', subText: 'غلط', isCorrect: false },
      { id: 'n6-opt4', text: 'اقلاب — میم سے بدلنا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن یا تنوین کے بعد حروفِ حلقی (ء، ہ، ع، ح، غ، خ) میں سے حرف "خ" آیا ہے اس لیے اظہار ہوگا، یعنی نون ساکن کو بغیر غنہ کے صاف پڑھیں گے۔',
    breakdown: 'مِنْ + خَوْفٍ',
    breakdownLetters: ['مِنْ', 'خَوْفٍ'],
    tajweedRule: 'اظہارِ حلقی در حرفِ خاء',
    hintText: 'خاء حروفِ حلقی میں سے ہے۔',
  },
  {
    id: 'nun-7',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ تنوین مع اظہار',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "كُفُوًا اَحَدٌ" میں تنوین (اً) کا کیا قاعدہ لاگو ہوگا؟',
    arabicDisplay: 'كُفُوًا اَحَدٌ',
    audioPronunciation: 'كُفُوًا اَحَدٌ',
    correctAnswer: 'اظہارِ حلقی (تنوین کو بغیر غنہ کے واضح پڑھیں گے)',
    correctAnswerDisplay: 'تنوین کا اظہار',
    options: [
      { id: 'n7-opt1', text: 'اظہار — تنوین کو بغیر غنہ کے واضح صاف پڑھیں گے', subText: 'تنوین کے بعد "ا" (ہمزہ) حرفِ حلقی ہے', isCorrect: true },
      { id: 'n7-opt2', text: 'اخفاء کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'n7-opt3', text: 'ادغام کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'n7-opt4', text: 'اقلاب کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: تنوین (دو زبر) کے بعد حرفِ ہمزہ (حرفِ حلقی) آیا ہے، اس لیے یہاں اظہار ہوگا یعنی تنوین کی نون ساکن آواز کو صاف ظاہر کر کے پڑھا جائے گا۔',
    breakdown: 'كُفُوًا + اَحَدٌ',
    breakdownLetters: ['كُفُوًا', 'اَحَدٌ'],
    tajweedRule: 'اظہارِ تنوین در نزدِ ہمزہ',
    hintText: 'تنوین کے بعد ہمزہ (ء) موجود ہے۔',
  },
  {
    id: 'nun-8',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اخفاء (حرفِ صـ)',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "عَنْ صَلَاتِهِمْ" میں نون ساکن کی اداکاری کیسے ہوگی؟',
    arabicDisplay: 'عَنْ صَلَاتِهِمْ',
    audioPronunciation: 'عَنْ صَلَاتِهِمْ',
    correctAnswer: 'اخفاء — ۱ الف غنہ ناک میں چھپا کر اور موٹا غنہ کریں گے',
    correctAnswerDisplay: 'اخفاء مع الغنہ',
    options: [
      { id: 'n8-opt1', text: 'اخفاء — ناک کے بانسے میں آواز چھپا کر پر (موٹا) غنہ کریں گے', subText: 'کیونکہ صلوٰۃ کا "ص" حرفِ اخفاء اور مستعلیہ (پر) ہے', isCorrect: true },
      { id: 'n8-opt2', text: 'اظہار — صاف پڑھنا', subText: 'غلط', isCorrect: false },
      { id: 'n8-opt3', text: 'ادغام مع الغنہ', subText: 'غلط', isCorrect: false },
      { id: 'n8-opt4', text: 'ادغام بلا غنہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن کے بعد حرف "ص" آیا ہے جو حروفِ اخفاء (۱۵) میں سے بھی ہے اور پُر (صاد) حرف بھی ہے۔ لہٰذا ۱ الف ناک میں آواز چھپا کر موٹا (پُر) غنہ ہوگا۔',
    breakdown: 'عَنْ + صَلَاتِهِمْ',
    breakdownLetters: ['عَنْ', 'صَلَاتِهِمْ'],
    tajweedRule: 'اخفاء مع الغنہ المفخمة (پُر اخفاء)',
    hintText: 'صاد حروفِ اخفاء اور حروفِ مستعلیہ کا حصہ ہے۔',
  },
  {
    id: 'nun-9',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ ادغام مع الغنہ (حرفِ واؤ)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "مِنْ وَالٍ" میں نون ساکن کس طرح ادا ہوگا؟',
    arabicDisplay: 'مِنْ وَالٍ',
    audioPronunciation: 'مِنْ وَالٍ',
    correctAnswer: 'ادغام مع الغنہ (نون واؤ میں مل کر مشدد اور ۱ الف غنہ ہوگا)',
    correctAnswerDisplay: 'ادغام مع الغنہ (واؤ)',
    options: [
      { id: 'n9-opt1', text: 'ادغام مع الغنہ — نون واؤ میں مل کر غنہ کے ساتھ ادا ہوگا', subText: 'واؤ حروفِ ینمو (ی، ن، م، و) میں شامل ہے', isCorrect: true },
      { id: 'n9-opt2', text: 'ادغام بلا غنہ — بغیر غنہ کے', subText: 'غلط', isCorrect: false },
      { id: 'n9-opt3', text: 'اظہار', subText: 'غلط', isCorrect: false },
      { id: 'n9-opt4', text: 'اخفاء', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ: نون ساکن کے بعد واؤ (و) آیا ہے جو "ینمو" کا حصہ ہے۔ اس لیے ادغام مع الغنہ ہوگا، یعنی نون واؤ میں مدغم ہو کر ۱ الف کے برابر غنہ ہوگا۔',
    breakdown: 'مِنْ + وَالٍ',
    breakdownLetters: ['مِنْ', 'وَالٍ'],
    tajweedRule: 'ادغام ناقص مع الغنہ در حرفِ واؤ',
    hintText: 'واؤ ینمو کا حرف ہے۔',
  },
  {
    id: 'nun-10',
    category: 'nun_sakin',
    categoryLabelUrdu: 'قاعدہ اقلاب تنوین (باء)',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "كِرَامٍ بَرَرَةٍ" میں تنوین (ٍ) کے بعد حرف "ب" آنے پر کیا حکم ہے؟',
    arabicDisplay: 'كِرَامٍ بَرَرَةٍ (كِرَامِمْ بَرَرَةٍ)',
    audioPronunciation: 'كِرَامٍ بَرَرَةٍ',
    correctAnswer: 'اقلاب — تنوین کو میم ساکنہ سے بدل کر غنہ و اخفاء کریں گے',
    correctAnswerDisplay: 'اقلاب تنوین',
    options: [
      { id: 'n10-opt1', text: 'اقلاب — تنوین کی آواز میم (م) سے بدل کر غنہ کے ساتھ پڑھی جائے گی', subText: 'تنوین کے بعد حرف "ب" آیا ہے', isCorrect: true },
      { id: 'n10-opt2', text: 'اظہار — صاف پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'n10-opt3', text: 'ادغام', subText: 'غلط', isCorrect: false },
      { id: 'n10-opt4', text: 'اخفاء', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ اقلاب: تنوین کے بعد حرف "ب" آئے تو تنوین کو چھوٹی میم (م) سے تبدیل کر کے اخفاء مع الغنہ کرتے ہیں۔',
    breakdown: 'كِرَامٍ + بَرَرَةٍ',
    breakdownLetters: ['كِرَامٍ', 'بَرَرَةٍ'],
    tajweedRule: 'اقلاب تنوین بہ میم مخفاة',
    hintText: 'حرفِ باء آنے پر تنوین میم میں بدل جاتی ہے۔',
  },

  // ==========================================================================
  // 11. 👑 میم ساکن کے تین قواعد (MEEM SAKIN: IDGHAM, IKHFA, IZHAR SHAFAWI)
  // ==========================================================================
  {
    id: 'meem-1',
    category: 'meem_sakin',
    categoryLabelUrdu: 'ادغامِ شفوی (میم ساکن + م)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "لَكُمْ مَّا كَسَبْتُمْ" میں میم ساکن کا کون سا قاعدہ لاگو ہوتا ہے؟',
    arabicDisplay: 'لَكُمْ مَّا كَسَبْتُمْ',
    audioPronunciation: 'لَكُمْ مَّا كَسَبْتُمْ',
    correctAnswer: 'ادغامِ شفوی (میم کا میم میں ادغام مع الغنہ)',
    correctAnswerDisplay: 'ادغامِ شفوی',
    options: [
      { id: 'm1-opt1', text: 'ادغامِ شفوی — میم کو میم سے ملا کر تشدید و غنہ کے ساتھ پڑھیں گے', subText: 'میم ساکن کے بعد دوسری متحرک میم آئی ہے', isCorrect: true },
      { id: 'm1-opt2', text: 'اظہارِ شفوی — بغیر غنہ کے ظاہر کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'm1-opt3', text: 'اخفاء شفوی — چھپا کر پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'm1-opt4', text: 'قلقلہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'ادغامِ شفوی: جب میم ساکن کے بعد متحرک میم آئے تو دونوں کو ملا کر غنہ کے ساتھ (ایک الف کی مقدار) ادا کیا جاتا ہے۔',
    breakdown: 'لَكُمْ + مَّا كَسَبْتُمْ',
    breakdownLetters: ['لَكُمْ', 'مَّا', 'كَسَبْتُمْ'],
    tajweedRule: 'ادغامِ شفوی (ادغامِ متماثلین صغیر)',
    hintText: 'میم ساکن کے بعد حرف "م" آنے پر ادغام شفوی ہوتا ہے۔',
  },
  {
    id: 'meem-2',
    category: 'meem_sakin',
    categoryLabelUrdu: 'اخفاءِ شفوی (میم ساکن + ب)',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "تَرْمِيْهِمْ بِحِجَارَةٍ" میں میم ساکن کو کیسے ادا کیا جائے گا؟',
    arabicDisplay: 'تَرْمِيْهِمْ بِحِجَارَةٍ',
    audioPronunciation: 'تَرْمِيْهِمْ بِحِجَارَةٍ',
    correctAnswer: 'اخفاءِ شفوی (ہونٹوں کو ہلکا ملا کر غنہ کے ساتھ اخفاء)',
    correctAnswerDisplay: 'اخفاءِ شفوی',
    options: [
      { id: 'm2-opt1', text: 'اخفاءِ شفوی — ہونٹوں کو ہلکا دبا کر غنہ کے ساتھ اخفاء کریں گے', subText: 'میم ساکن کے بعد حرف "ب" آیا ہے', isCorrect: true },
      { id: 'm2-opt2', text: 'اظہارِ شفوی — بغیر غنہ کے', subText: 'غلط', isCorrect: false },
      { id: 'm2-opt3', text: 'ادغام کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'm2-opt4', text: 'اقلاب کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'اخفاءِ شفوی: میم ساکن کے بعد حرفِ "باء" آئے تو ہونٹوں کو نرمی سے ملا کر ناک سے غنہ کی آواز نکالتے ہوئے اخفاء کیا جاتا ہے۔',
    breakdown: 'تَرْمِيْهِمْ + بِحِجَارَةٍ',
    breakdownLetters: ['تَرْمِيْهِمْ', 'بِحِجَارَةٍ'],
    tajweedRule: 'اخفاءِ شفوی در حرفِ باء',
    hintText: 'میم ساکن کے بعد صرف ایک حرف "ب" پر اخفاء شفوی ہوتا ہے۔',
  },
  {
    id: 'meem-3',
    category: 'meem_sakin',
    categoryLabelUrdu: 'اظہارِ شفوی (باقی ۲۶ حروف)',
    badgeColor: 'emerald',
    promptTitle: 'آیتِ مبارکہ "عَلَيْهِمْ غَيْرِ الْمَغْضُوْبِ" میں میم ساکن کی ادائی کیسی ہوگی؟',
    arabicDisplay: 'عَلَيْهِمْ غَيْرِ',
    audioPronunciation: 'عَلَيْهِمْ غَيْرِ',
    correctAnswer: 'اظہارِ شفوی (میم کو بغیر غنہ کے واضح ظاہر کرنا)',
    correctAnswerDisplay: 'اظہارِ شفوی',
    options: [
      { id: 'm3-opt1', text: 'اظہارِ شفوی — میم کی آواز کو بغیر غنہ کے بالکل صاف اور واضح ادا کریں گے', subText: 'میم ساکن کے بعد حرف "غ" آیا ہے', isCorrect: true },
      { id: 'm3-opt2', text: 'اخفاء کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'm3-opt3', text: 'ادغام مع الغنہ', subText: 'غلط', isCorrect: false },
      { id: 'm3-opt4', text: 'قلقلہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'اظہارِ شفوی: میم اور باء کے علاوہ باقی تمام ۲۶ حروف میں سے کوئی حرف میم ساکن کے بعد آئے تو بغیر غنہ کے صاف ظاہر کرتے ہیں۔',
    breakdown: 'عَلَيْهِمْ + غَيْرِ',
    breakdownLetters: ['عَلَيْهِمْ', 'غَيْرِ'],
    tajweedRule: 'اظہارِ شفوی در حروفِ باقیہ',
    hintText: 'غین میم اور باء میں سے نہیں ہے، اس لیے اظہار ہوگا۔',
  },
  {
    id: 'meem-4',
    category: 'meem_sakin',
    categoryLabelUrdu: 'اظہارِ شفوی موکد (و، ف)',
    badgeColor: 'cyan',
    promptTitle: 'کلمہ "هُمْ فِيْهَا" میں میم ساکن کے بعد حرفِ "ف" آنے پر کس بات کی احتیاط لازم ہے؟',
    arabicDisplay: 'هُمْ فِيْهَا',
    audioPronunciation: 'هُمْ فِيْهَا',
    correctAnswer: 'شدید اظہارِ شفوی (اخفاء سے بچتے ہوئے میم کو خوب ظاہر کرنا)',
    correctAnswerDisplay: 'شدید اظہارِ شفوی',
    options: [
      { id: 'm4-opt1', text: 'شدید اظہارِ شفوی — مخرج کے قریب ہونے کی وجہ سے اخفاء سے بچتے ہوئے خوب ظاہر کرنا', subText: 'حرف "و" اور "ف" پر خاص تاکید ہے', isCorrect: true },
      { id: 'm4-opt2', text: 'اخفاء شفوی کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'm4-opt3', text: 'ادغام کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'm4-opt4', text: 'میم کو حذف کر دیں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'حرفِ "واؤ" اور "فاء" کا مخرج ہونٹوں کے قریب ہونے کی وجہ سے قاری کو خاص دھیان رکھنا ہوتا ہے کہ کہیں اخفاء نہ ہو جائے، لہٰذا یہاں اظہار موکد ہے۔',
    breakdown: 'هُمْ + فِيْهَا',
    breakdownLetters: ['هُمْ', 'فِيْهَا'],
    tajweedRule: 'اظہارِ شفوی اشد عند الفاء والواو',
    hintText: 'ہونٹ کے حروف کے پاس اخفاء کا خطرہ ہوتا ہے، اس لیے اظہار پختہ ہوگا۔',
  },
  {
    id: 'meem-5',
    category: 'meem_sakin',
    categoryLabelUrdu: 'اخفاءِ شفوی (میم ساکن + ب)',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "رَبُّهُم بِهِم" میں میم ساکن پر کیا حکم ہوگا؟',
    arabicDisplay: 'رَبُّهُم بِهِم',
    audioPronunciation: 'رَبُّهُم بِهِم',
    correctAnswer: 'اخفاء شفوی مع الغنہ',
    correctAnswerDisplay: 'اخفاء شفوی',
    options: [
      { id: 'm5-opt1', text: 'اخفاء شفوی مع الغنہ', subText: 'میم ساکن کے بعد باء آئی ہے', isCorrect: true },
      { id: 'm5-opt2', text: 'اظہار شفوی', subText: 'غلط', isCorrect: false },
      { id: 'm5-opt3', text: 'ادغام شفوی', subText: 'غلط', isCorrect: false },
      { id: 'm5-opt4', text: 'قلقلہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'میم ساکن کے بعد باء آنے کی صورت میں اخفاء شفوی ہوتا ہے، ہونٹوں کو ملاتے ہوئے غنہ کی مقدار ۱ الف رکھی جاتی ہے۔',
    breakdown: 'رَبُّهُم + بِهِم',
    breakdownLetters: ['رَبُّهُم', 'بِهِم'],
    tajweedRule: 'اخفاء شفوی',
    hintText: 'میم ساکنہ کے بعد باء ہے۔',
  },

  // ==========================================================================
  // 12. ✨ تفخیم و ترقیق کے قواعد (TAFKHEEM & TARQEEQ: ALIF, LAAM, RAA)
  // ==========================================================================
  {
    id: 'tafkheem-1',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'الف کی تفخیم (الف پُر)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "قَاْلَ" اور "صِرَاطَ" میں الف مدہ کو پُر پڑھیں گے یا باریک؟',
    arabicDisplay: 'قَاْلَ — صِرَاطَ',
    audioPronunciation: 'قَالَ',
    correctAnswer: 'الف پُر (کیونکہ ماقبل حرفِ مستعلیہ ہے)',
    correctAnswerDisplay: 'الف پُر (تفخیم)',
    options: [
      { id: 'tf1-opt1', text: 'الف پُر (تفخیم) — کیونکہ الف سے پہلے حروفِ مستعلیہ (ق، ص) میں سے حرف آیا ہے', subText: 'الف اپنے ماقبل کے تابع ہوتا ہے', isCorrect: true },
      { id: 'tf1-opt2', text: 'الف باریک (ترقیق) — ہمیشہ باریک رہتا ہے', subText: 'غلط', isCorrect: false },
      { id: 'tf1-opt3', text: 'غنہ کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'tf1-opt4', text: 'امالہ کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ تفخیمِ الف: الف اپنے ماقبل حرف کے تابع ہوتا ہے۔ اگر ماقبل حرف پُر (مستعلیہ) ہو تو الف پُر، اور اگر باریک ہو تو الف باریک پڑھا جائے گا۔',
    breakdown: 'قَ + ا + لَ',
    breakdownLetters: ['قَا', 'لَ'],
    tajweedRule: 'تفخیمِ الف بعد از حروفِ مستعلیہ',
    hintText: 'قاف اور صاد حروفِ مستعلیہ (پُر حروف) ہیں۔',
  },
  {
    id: 'tafkheem-2',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'الف کی ترقیق (الف باریک)',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "كَانَ" اور "مَالًا" میں الف کو کیسا پڑھا جائے گا؟',
    arabicDisplay: 'كَانَ — مَالًا',
    audioPronunciation: 'كَانَ',
    correctAnswer: 'الف باریک (ترقیق)',
    correctAnswerDisplay: 'الف باریک (ترقیق)',
    options: [
      { id: 'tf2-opt1', text: 'الف باریک (ترقیق) — کیونکہ ماقبل حروف (ک، م) حروفِ مستفلہ (باریک) ہیں', subText: 'درست تجویدی قاعدہ', isCorrect: true },
      { id: 'tf2-opt2', text: 'الف پُر پڑھا جائے گا', subText: 'غلط', isCorrect: false },
      { id: 'tf2-opt3', text: 'اخفاء ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'tf2-opt4', text: 'قلقلہ ہوگا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ ترقیقِ الف: جب الف سے پہلے کوئی باریک حرف ہو (جیسے کاف، میم، باء وغیرہ) تو الف کو منہ کھول کر باریک پڑھا جاتا ہے۔',
    breakdown: 'كَ + ا + نَ',
    breakdownLetters: ['كَا', 'نَ'],
    tajweedRule: 'ترقیقِ الف بعد از حروفِ مستفلہ',
    hintText: 'کاف حرفِ مستعلیہ نہیں ہے۔',
  },
  {
    id: 'tafkheem-3',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'لامِ جلالت کی تفخیم (لام پُر)',
    badgeColor: 'amber',
    promptTitle: 'کلمہ "وَاللهُ" اور "رَسُوْلُ اللهِ" میں لفظِ "الله" کا لام کیسا پڑھا جائے گا؟',
    arabicDisplay: 'وَاللهُ — رَسُوْلُ اللهِ',
    audioPronunciation: 'وَاللّٰهُ',
    correctAnswer: 'لام پُر (تفخیم لامِ جلالت)',
    correctAnswerDisplay: 'لام پُر (تفخیم)',
    options: [
      { id: 'tf3-opt1', text: 'لام پُر (تفخیم) — کیونکہ اسمِ جلالت سے پہلے زبر (فتحہ) یا پیش (ضمہ) ہے', subText: 'اسمِ جلالت "الله" کا خاص قاعدہ', isCorrect: true },
      { id: 'tf3-opt2', text: 'لام باریک (ترقیق)', subText: 'غلط', isCorrect: false },
      { id: 'tf3-opt3', text: 'قلقلہ کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'tf3-opt4', text: 'ادغام بلا غنہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ لامِ جلالت: اسمِ جلالت "الله" کے لام سے پہلے زبر یا پیش ہو تو اس لام کو پُر (موٹا) پڑھتے ہیں۔',
    breakdown: 'وَ + اللهُ',
    breakdownLetters: ['وَ', 'اللهُ'],
    tajweedRule: 'تفخیمِ لامِ اسمِ جلالت بعد الفتح والضم',
    hintText: 'اسمِ جلالت سے پہلے زبر یا پیش آنے پر لام پُر ہوتا ہے۔',
  },
  {
    id: 'tafkheem-4',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'لامِ جلالت کی ترقیق (لام باریک)',
    badgeColor: 'cyan',
    promptTitle: 'کلمہ "بِسْمِ اللهِ" اور "لِلّٰهِ" میں لفظِ "الله" کے لام کی ادائیگی کیسی ہوگی؟',
    arabicDisplay: 'بِسْمِ اللهِ — لِلّٰهِ',
    audioPronunciation: 'بِسْمِ اللّٰهِ',
    correctAnswer: 'لام باریک (ترقیق لامِ جلالت)',
    correctAnswerDisplay: 'لام باریک (ترقیق)',
    options: [
      { id: 'tf4-opt1', text: 'لام باریک (ترقیق) — کیونکہ اسمِ جلالت کے ماقبل زیر (کسرہ) ہے', subText: 'زیر کے بعد لام باریک ہوتا ہے', isCorrect: true },
      { id: 'tf4-opt2', text: 'لام پُر پڑھیں گے', subText: 'غلط', isCorrect: false },
      { id: 'tf4-opt3', text: 'غنہ کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'tf4-opt4', text: 'وقف کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'قاعدہ ترقیقِ لام: اسمِ جلالت "الله" کے لام سے پہلے زیر (کسرہ) ہو تو اس لام کو باریک پڑھا جاتا ہے، جیسے بِسْمِ اللهِ۔',
    breakdown: 'بِسْمِ + اللهِ',
    breakdownLetters: ['بِسْمِ', 'اللهِ'],
    tajweedRule: 'ترقیقِ لامِ اسمِ جلالت بعد الکسر',
    hintText: 'میم کے نیچے کسرہ (زیر) موجود ہے۔',
  },
  {
    id: 'tafkheem-5',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'حرفِ راء کی تفخیم (را پُر)',
    badgeColor: 'amber',
    promptTitle: 'کلمات "رَبَّنَا" اور "رُحَمَاءُ" میں حرفِ "رَ / رُ" کو کیسا پڑھا جائے گا؟',
    arabicDisplay: 'رَبَّنَا — رُحَمَاءُ',
    audioPronunciation: 'رَبَّنَا',
    correctAnswer: 'راء پُر (کیونکہ را پر زبر یا پیش ہے)',
    correctAnswerDisplay: 'راء پُر (تفخیم)',
    options: [
      { id: 'tf5-opt1', text: 'راء پُر (تفخیم) — کیونکہ راء پر زبر (فتحہ) یا پیش (ضمہ) ہے', subText: 'زبر و پیش پر راء ہمیشہ پُر ہوتی ہے', isCorrect: true },
      { id: 'tf5-opt2', text: 'راء باریک (ترقیق)', subText: 'غلط', isCorrect: false },
      { id: 'tf5-opt3', text: 'قلقلہ ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'tf5-opt4', text: 'اخفاء ہوگا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'احکامِ راء: راء پر زبر یا پیش ہو، یا کھڑا زبر ہو، تو راء کو پر (موٹا) پڑھا جاتا ہے۔',
    breakdown: 'رَبَّ + نَا',
    breakdownLetters: ['رَبَّ', 'نَا'],
    tajweedRule: 'تفخیمِ راء متحرکہ بالفتح والضم',
    hintText: 'راء پر زبر یا پیش ہونا تفخیم کا سب سے بنیادی سبب ہے۔',
  },
  {
    id: 'tafkheem-6',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'حرفِ راء کی ترقیق (را باریک)',
    badgeColor: 'emerald',
    promptTitle: 'کلمات "رِجَالٌ" اور "خَبِيْرٌ" (وقف پر) میں حرفِ "راء" کیسی پڑھی جائے گی؟',
    arabicDisplay: 'رِجَالٌ — خَبِيْرٌ',
    audioPronunciation: 'رِجَالٌ',
    correctAnswer: 'راء باریک (ترقیق راء)',
    correctAnswerDisplay: 'راء باریک (ترقیق)',
    options: [
      { id: 'tf6-opt1', text: 'راء باریک (ترقیق) — کیونکہ راء کے نیچے زیر ہے یا ماقبل یائے ساکنہ ہے', subText: 'زیر اور یائے لین/ساکنہ پر راء باریک', isCorrect: true },
      { id: 'tf6-opt2', text: 'راء پُر پڑھی جائے گی', subText: 'غلط', isCorrect: false },
      { id: 'tf6-opt3', text: 'ادغام ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'tf6-opt4', text: 'غنہ ہوگا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'احکامِ ترقیقِ راء: راء کے نیچے زیر ہو (رِجَال)، یا راء ساکنہ سے پہلے زیر اصلی ہو (فِرْعَوْن)، یا ماقبل یائے ساکنہ ہو (خَبِيْر) تو راء باریک پڑھی جاتی ہے۔',
    breakdown: 'رِ + جَا + لٌ',
    breakdownLetters: ['رِ', 'جَا', 'لٌ'],
    tajweedRule: 'ترقیقِ راء مکسورہ و بعد الیاء',
    hintText: 'کسرہ (زیر) راء کو باریک کر دیتا ہے۔',
  },
  {
    id: 'tafkheem-7',
    category: 'tafkheem_tarqeeq',
    categoryLabelUrdu: 'استثناء: راء ساکنہ + حرفِ مستعلیہ',
    badgeColor: 'rose',
    promptTitle: 'کلمہ "مِرْصَادًا" اور "قِرْطَاسٍ" میں را ساکنہ سے پہلے زیر ہونے کے باوجود راء پُر کیوں ہے؟',
    arabicDisplay: 'مِرْصَادًا — قِرْطَاسٍ',
    audioPronunciation: 'مِرْصَادًا',
    correctAnswer: 'کیونکہ راء کے بعد اسی کلمے میں حرفِ مستعلیہ (ص، ط) مفتوح آ رہا ہے',
    correctAnswerDisplay: 'راء پُر (استثناء)',
    options: [
      { id: 'tf7-opt1', text: 'کیونکہ راء کے بعد اسی کلمے میں حرفِ مستعلیہ مفتوح (ص، ط) موجود ہے', subText: 'مستعلیہ حرف زیر کے اثر کو زائل کر دیتا ہے', isCorrect: true },
      { id: 'tf7-opt2', text: 'کیونکہ راء پر تشدید ہے', subText: 'غلط', isCorrect: false },
      { id: 'tf7-opt3', text: 'یہاں راء باریک ہی پڑھی جائے گی', subText: 'غلط', isCorrect: false },
      { id: 'tf7-opt4', text: 'قلقلہ کی وجہ سے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'خاص تجویدی نکتہ: راء ساکنہ سے پہلے کسرہ اصلیہ ہو لیکن بعد میں اسی کلمے میں حرفِ مستعلیہ مفتوح ہو (جیسے مِرْصَاد، قِرْطَاس، فِرْقَة) تو راء پُر پڑھی جاتی ہے۔',
    breakdown: 'مِرْ + صَا + دًا',
    breakdownLetters: ['مِرْ', 'صَادًا'],
    tajweedRule: 'تفخیمِ راء ساکنہ قبل حرفِ استعلاء',
    hintText: 'صاد اور طا حروفِ مستعلیہ (موٹے حروف) ہیں۔',
  },
  // =========================================================================
  // 13. مَدَّات کے قواعد (LESSON 13: MADDAT - Muttasil, Munfasil, Laazim, Aaridh, Leen)
  // =========================================================================
  {
    id: 'madd-1',
    category: 'maddat',
    categoryLabelUrdu: 'مد کے اسباب و تعریف',
    badgeColor: 'purple',
    promptTitle: 'مد کے لغوی معنی کیا ہیں اور اس کے کتنے اسباب ہیں؟',
    arabicDisplay: 'مَدّ — اَسْبَابِ مَدّ',
    audioPronunciation: 'مَدّ',
    correctAnswer: 'مد کے معنی دراز کرنا / کھینچنا، اس کے ۲ اسباب ہیں: ہمزہ اور سکون',
    correctAnswerDisplay: '۲ اسباب: ہمزہ اور سکون',
    options: [
      { id: 'md1-opt1', text: 'مد کے معنی کھینچنا ہے، اور اس کے ۲ اسباب ہیں: ہمزہ اور سکون', subText: 'ہمزہ (ء) یا سکون (اصلی/عارضی)', isCorrect: true },
      { id: 'md1-opt2', text: 'مد کے معنی جلدی پڑھنا ہے اور ۱ سبب ہے', subText: 'غلط', isCorrect: false },
      { id: 'md1-opt3', text: 'مد صرف تنوین پر ہوتی ہے', subText: 'غلط', isCorrect: false },
      { id: 'md1-opt4', text: 'مد کے ۴ اسباب ہیں', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مد کے لغوی معنی دراز کرنا اور کھینچنا ہے۔ حروفِ مدہ کے بعد مد آنے کے دو بنیادی اسباب ہیں: (۱) ہمزہ اور (۲) سکون (اصلی یا عارضی)۔',
    breakdown: 'مَدّ',
    breakdownLetters: ['مَدّ'],
    tajweedRule: 'تعریف و اسبابِ مد',
    hintText: 'حروف مدہ کے بعد ہمزہ یا جزم/تشدید آئے۔',
  },
  {
    id: 'madd-2',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ مُتَّصِل',
    badgeColor: 'emerald',
    promptTitle: 'کلمہ "جَآءَ" اور "سِیْٓئَتْ" میں کون سی مد ہے اور اس کی مقدار کیا ہے؟',
    arabicDisplay: 'جَآءَ — سِیْٓئَتْ',
    audioPronunciation: 'جَآءَ',
    correctAnswer: 'مَدِّ مُتَّصِل — مقدار: ۲ تا ڈھائی الف (۴ یا ۵ حرکات)',
    correctAnswerDisplay: 'مدِ متصل (۴ یا ۵ حرکات)',
    options: [
      { id: 'md2-opt1', text: 'مَدِّ مُتَّصِل (کیونکہ ہمزہ اسی کلمے میں ہے)، مقدار: ۴ یا ۵ حرکات', subText: '۲ تا ۲.۵ الف', isCorrect: true },
      { id: 'md2-opt2', text: 'مَدِّ مُنْفَصِل (کیونکہ ہمزہ الگ کلمے میں ہے)', subText: 'غلط', isCorrect: false },
      { id: 'md2-opt3', text: 'مَدِّ لَازِم (کیونکہ سکون اصلی ہے)', subText: 'غلط', isCorrect: false },
      { id: 'md2-opt4', text: 'قصر (صرف ۱ الف)', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ مُتَّصِل: حروفِ مدہ کے بعد ہمزہ اسی کلمے میں متصل آئے تو مد متصل ہوتی ہے، اس کو ۲ تا ڈھائی الف (۴ یا ۵ حرکات) کھینچ کر پڑھتے ہیں۔',
    breakdown: 'جَآ + ءَ',
    breakdownLetters: ['جَآءَ'],
    tajweedRule: 'مَدِّ مُتَّصِل واجب',
    hintText: 'متصل کا مطلب ہے ملا ہوا (ایک ہی کلمے میں)۔',
  },
  {
    id: 'madd-3',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ مُنْفَصِل',
    badgeColor: 'cyan',
    promptTitle: 'قرآنی مثال "فِيْٓ أَنفُسِكُمْ" اور "قُوْٓا أَنْفُسَكُمْ" میں کون سی مد واقع ہوئی ہے؟',
    arabicDisplay: 'فِيْٓ أَنفُسِكُمْ — قُوْٓا أَنْفُسَكُمْ',
    audioPronunciation: 'فِيْٓ أَنفُسِكُمْ',
    correctAnswer: 'مَدِّ مُنْفَصِل — کیونکہ ہمزہ دوسرے کلمے کے شروع میں ہے',
    correctAnswerDisplay: 'مدِ منفصل (۲ تا ۲.۵ الف)',
    options: [
      { id: 'md3-opt1', text: 'مَدِّ مُنْفَصِل — کیونکہ حرفِ مدہ پہلے کلمے کے آخر میں اور ہمزہ دوسرے کلمے کے شروع میں ہے', subText: 'مقدار: ۲ تا ڈھائی الف', isCorrect: true },
      { id: 'md3-opt2', text: 'مَدِّ مُتَّصِل — کیونکہ دونوں ایک ہی کلمہ ہیں', subText: 'غلط', isCorrect: false },
      { id: 'md3-opt3', text: 'مَدِّ بَدَل', subText: 'غلط', isCorrect: false },
      { id: 'md3-opt4', text: 'اخفاء شفوی', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ مُنْفَصِل: حروفِ مدہ کے بعد ہمزہ دوسرے کلمے کے شروع میں جدا (منفصل) آئے تو مد منفصل (مد جائز) ہوتی ہے۔',
    breakdown: 'فِيْٓ + أَنفُسِكُمْ',
    breakdownLetters: ['فِيْٓ', 'أَنفُسِكُمْ'],
    tajweedRule: 'مَدِّ مُنْفَصِل جائز',
    hintText: 'منفصل کا مطلب ہے جدا جدا (دو الگ کلمات میں)۔',
  },
  {
    id: 'madd-4',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ لَازِم',
    badgeColor: 'purple',
    promptTitle: 'کلمات "جَآنٌّ" اور "ضَآلًّا" اور "الٓمٓ" میں کون سی مد ہے اور اس کی مقدار کتنی ہے؟',
    arabicDisplay: 'جَآنٌّ — وَلَا الضَّآلِّينَ',
    audioPronunciation: 'جَآنٌّ',
    correctAnswer: 'مَدِّ لَازِم — مقدار: ۳ الف (۶ حرکات یعنی طول)',
    correctAnswerDisplay: 'مدِ لازم (۶ حرکات / ۳ الف)',
    options: [
      { id: 'md4-opt1', text: 'مَدِّ لَازِم — حرفِ مدہ کے بعد سکونِ اصلی (تشدید/جزم) ہے، مقدار: ۳ الف (۶ حرکات)', subText: 'سب سے لمبی مد (طول)', isCorrect: true },
      { id: 'md4-opt2', text: 'مَدِّ عارض — وقف کی وجہ سے عارضی سکون ہے', subText: 'غلط', isCorrect: false },
      { id: 'md4-opt3', text: 'مَدِّ منفصل — ۲ الف', subText: 'غلط', isCorrect: false },
      { id: 'md4-opt4', text: 'قصر — ۱ الف', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ لَازِم: حروفِ مدہ کے بعد سکونِ اصلی (جزم یا تشدید) واقع ہو تو مد لازم ہوتی ہے، اس کو ۳ الف (۶ حرکات) مکمل طول کے ساتھ کھینچنا لازم ہے۔',
    breakdown: 'جَآ + نٌّ',
    breakdownLetters: ['جَآنٌّ'],
    tajweedRule: 'مَدِّ لَازِم کلمی مثقل',
    hintText: 'تشدید والے حرف میں پہلا حرف ساکن ہوتا ہے جو سکونِ اصلی ہے۔',
  },
  {
    id: 'madd-5',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ عَارِض وقفی',
    badgeColor: 'amber',
    promptTitle: 'آیت کے آخر میں وقف کرتے وقت "مُسْلِمُوْنْ ۝" اور "الْعٰلَمِیْنْ ۝" میں کون سی مد بنتی ہے؟',
    arabicDisplay: 'مُسْلِمُوْنْ ۝ — الْعٰلَمِیْنْ ۝',
    audioPronunciation: 'مُسْلِمُوْنْ',
    correctAnswer: 'مَدِّ عَارِض وقفی — اس میں قصر، توسط اور طول (۱، ۲ یا ۳ الف) جائز ہے',
    correctAnswerDisplay: 'مدِ عارض (قصر، توسط، طول)',
    options: [
      { id: 'md5-opt1', text: 'مَدِّ عَارِض وقفی — وقف کی وجہ سے عارضی سکون پیدا ہوا، ۱، ۲ یا ۳ الف پڑھ سکتے ہیں', subText: '۲، ۴ یا ۶ حرکات', isCorrect: true },
      { id: 'md5-opt2', text: 'مَدِّ متصل — کیونکہ ہمزہ ہے', subText: 'غلط', isCorrect: false },
      { id: 'md5-opt3', text: 'مَدِّ لازم — کیونکہ سکون اصلی ہے', subText: 'غلط', isCorrect: false },
      { id: 'md5-opt4', text: 'کوئی مد نہیں ہوتی', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ عَارِض: حروفِ مدہ کے بعد وقف کی وجہ سے عارضی سکون پیدا ہو جائے تو مد عارض کہلاتی ہے۔ اس میں طول (۳ الف)، توسط (۲ الف) اور قصر (۱ الف) تینوں جائز ہیں۔',
    breakdown: 'مُسْ + لِ + مُوْنْ',
    breakdownLetters: ['مُسْلِمُوْنْ'],
    tajweedRule: 'مَدِّ عَارِض وقفی',
    hintText: 'عارض کا مطلب ہے وقتی/عارضی جو وقف کرنے سے پیدا ہو۔',
  },
  {
    id: 'madd-6',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ لِیْن لَازِم',
    badgeColor: 'rose',
    promptTitle: 'حروفِ مقطعات میں "عٓسٓقٓ" کے "عَیْنٓ" میں کون سی مد ہے؟',
    arabicDisplay: 'عٓسٓقٓ — (عَیْنٓ)',
    audioPronunciation: 'عٓسٓقٓ',
    correctAnswer: 'مَدِّ لِیْن لَازِم — حرف لین (یا ساکن ماقبل مفتوح) کے بعد سکون اصلی ہے',
    correctAnswerDisplay: 'مدِ لین لازم (۶ حرکات)',
    options: [
      { id: 'md6-opt1', text: 'مَدِّ لِیْن لَازِم — حرفِ لین کے بعد سکونِ اصلی ہے، مقدار: ۳ الف (۶ حرکات)', subText: 'توسط (۴ حرکات) بھی جائز ہے', isCorrect: true },
      { id: 'md6-opt2', text: 'مد منفصل', subText: 'غلط', isCorrect: false },
      { id: 'md6-opt3', text: 'مد متصل', subText: 'غلط', isCorrect: false },
      { id: 'md6-opt4', text: 'صرف قصر (۱ الف)', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ لِیْن لَازِم: حرفِ لین (واؤ یا یاء ساکن ماقبل زبر) کے بعد سکونِ اصلی آئے (جیسے سورہ شوریٰ و مریم میں حرف عَیْنٓ)، اس میں طول (۳ الف) افضل ہے۔',
    breakdown: 'عَیْنٓ',
    breakdownLetters: ['عَیْنٓ'],
    tajweedRule: 'مَدِّ لِیْن لَازِم حرفی',
    hintText: 'عین میں یاء لین کے بعد نون ساکنہ اصلی ہے۔',
  },
  {
    id: 'madd-7',
    category: 'maddat',
    categoryLabelUrdu: 'مَدِّ لِیْن عَارِض',
    badgeColor: 'amber',
    promptTitle: 'وقف کی حالت میں "خَوْفْ ۝" اور "شَفَتَیْنْ ۝" میں کون سی مد واقع ہوتی ہے؟',
    arabicDisplay: 'مِنْ خَوْفٍ ۝ — شَفَتَیْنِ ۝',
    audioPronunciation: 'مِنْ خَوْفٍ',
    correctAnswer: 'مَدِّ لِیْن عَارِض — حروفِ لین کے بعد وقف کی وجہ سے عارضی سکون',
    correctAnswerDisplay: 'مدِ لین عارض (قصر، توسط، طول)',
    options: [
      { id: 'md7-opt1', text: 'مَدِّ لِیْن عَارِض — حروفِ لین کے بعد وقف کی وجہ سے عارضی سکون واقع ہوا', subText: 'طول، توسط یا قصر جائز ہے', isCorrect: true },
      { id: 'md7-opt2', text: 'مد لازم کلمی', subText: 'غلط', isCorrect: false },
      { id: 'md7-opt3', text: 'مد متصل', subText: 'غلط', isCorrect: false },
      { id: 'md7-opt4', text: 'ادغام مع الغنہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مَدِّ لِیْن عَارِض: حروفِ لین کے بعد وقف کرنے سے آخری حرف ساکن ہو جائے تو مد لین عارض ہوتی ہے جیسے "قُرَیْشٍ ۝" اور "الصَّیْفِ ۝"۔',
    breakdown: 'خَوْفْ',
    breakdownLetters: ['خَوْفْ'],
    tajweedRule: 'مَدِّ لِیْن عَارِض وقفی',
    hintText: 'واؤ ساکن یا یاء ساکن سے پہلے زبر ہو اور بعد میں وقف ہو۔',
  },

  // =========================================================================
  // 14. حُرُوفِ مُقَطَّعَات (LESSON 14: HUROOF-E-MUQATTA'AT)
  // =========================================================================
  {
    id: 'muq-1',
    category: 'muqattaat',
    categoryLabelUrdu: 'حروفِ مقطعات کا تعارف و تعداد',
    badgeColor: 'emerald',
    promptTitle: 'قرآن مجید میں حروفِ مقطعات کل کتنے حروف ہیں اور کتنی سورتوں کے شروع میں آتے ہیں؟',
    arabicDisplay: 'حُرُوفِ مُقَطَّعَات (۲۹ سورتیں)',
    audioPronunciation: 'الم',
    correctAnswer: '۱۴ حروف ہیں جو ۲۹ سورتوں کے شروع میں آتے ہیں',
    correctAnswerDisplay: '۱۴ حروف، ۲۹ سورتوں میں',
    options: [
      { id: 'mq1-opt1', text: '۱۴ حروف ہیں جو قرآن مجید کی ۲۹ سورتوں کے شروع میں آتے ہیں', subText: 'مجموعہ: نَصٌّ حَکِیْمٌ قَاطِعٌ لَہٗ سِرٌّ', isCorrect: true },
      { id: 'mq1-opt2', text: '۱۰ حروف ہیں جو ۱۵ سورتوں میں آتے ہیں', subText: 'غلط', isCorrect: false },
      { id: 'mq1-opt3', text: '۲۸ حروف ہیں جو تمام سورتوں میں آتے ہیں', subText: 'غلط', isCorrect: false },
      { id: 'mq1-opt4', text: '۷ حروف ہیں', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'حروفِ مقطعات وہ الگ الگ پڑھے جانے والے حروف ہیں جن کے معنی اللہ اور رسول ﷺ ہی بہتر جانتے ہیں۔ یہ کل ۱۴ حروف ہیں اور ۲۹ سورتوں کے شروع میں آتے ہیں۔',
    breakdown: 'مُقَطَّعَات',
    breakdownLetters: ['مُ', 'قَ', 'طَّ', 'عَا', 'ت'],
    tajweedRule: 'حروفِ مقطعات کی تعریف و تعداد',
    hintText: 'مجموعہ نَصٌّ حَکِیْمٌ قَاطِعٌ لَہٗ سِرٌّ میں کل ۱۴ حروف ہیں۔',
  },
  {
    id: 'muq-2',
    category: 'muqattaat',
    categoryLabelUrdu: 'الٓمٓ کی تجویدی ادائیگی',
    badgeColor: 'purple',
    promptTitle: 'کلمہ "الٓمٓ" کو تجوید کے ساتھ کس طرح پڑھا جائے گا؟',
    arabicDisplay: 'الٓمٓ (أَلِفْ لَامْ مِّيمْ)',
    audioPronunciation: 'الم',
    correctAnswer: 'الف کو بغیر کھینچے، لام پر مد لازم (۳ الف) + میم میں ادغام مع الغنہ + میم پر مد لازم (۳ الف)',
    correctAnswerDisplay: 'أَلِفْ — لَامْ مِّيمْ (مد لازم و ادغام)',
    options: [
      { id: 'mq2-opt1', text: 'أَلِفْ (بغیر مد) + لَامْ (۳ الف) + میم میں ادغام و غنہ + مِّيمْ (۳ الف)', subText: 'لام کے آخر کا میم اگلے میم میں مدغم ہو کر ۱ الف غنہ بنے گا', isCorrect: true },
      { id: 'mq2-opt2', text: 'الم کو ملا کر "اَلَمْ" پڑھیں گے', subText: 'غلط، مقطعات کو ہجہ نہیں بلکہ مفرد نام سے پڑھتے ہیں', isCorrect: false },
      { id: 'mq2-opt3', text: 'تینوں پر ایک ایک الف مد کریں گے', subText: 'غلط', isCorrect: false },
      { id: 'mq2-opt4', text: 'صرف الف پر مد کریں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'الٓمٓ میں: الف پر کوئی مد نہیں، لَامْ کے الف پر مدِ لازم ۳ الف، پھر لام کے میم ساکنہ کا میم کے ساتھ ادغامِ شفوی مع الغنہ، اور مِّيمْ پر مدِ لازم ۳ الف ہوگی۔',
    breakdown: 'أَلِفْ + لَامْ + مِّيمْ',
    breakdownLetters: ['أَلِفْ', 'لَامْ', 'مِّيمْ'],
    tajweedRule: 'مدِ لازم حرفی مثقل و ادغام متماثلین مع الغنہ',
    hintText: 'الف بغیر مد کے، لام اور میم ۳، ۳ الف اور درمیان میں ادغام مع الغنہ ہے۔',
  },
  {
    id: 'muq-3',
    category: 'muqattaat',
    categoryLabelUrdu: 'مجموعہ حَیٌّ طَهُرَ (طبعی مد)',
    badgeColor: 'amber',
    promptTitle: 'حروفِ مقطعات کے مجموعے "حَیٌّ طَهُرَ" (ح، ی، ط، ہ، ر) کو کتنا کھینچ کر پڑھا جاتا ہے؟',
    arabicDisplay: 'حَیٌّ طَهُرَ — (حٰ، یٰ، طٰ، ہٰ، رٰ)',
    audioPronunciation: 'طه',
    correctAnswer: '۱ الف (۲ حرکات) یعنی مدِ طبعی کی مقدار',
    correctAnswerDisplay: '۱ الف (۲ حرکات)',
    options: [
      { id: 'mq3-opt1', text: '۱ الف (۲ حرکات) — کیونکہ ان کے نام کے آخر میں ہمزہ نہیں پڑھی جاتی (حَا، یَا، طَا، ہَا، رَا)', subText: 'مدِ طبعی کے برابر کھینچا جائے گا', isCorrect: true },
      { id: 'mq3-opt2', text: '۳ الف (۶ حرکات)', subText: 'غلط', isCorrect: false },
      { id: 'mq3-opt3', text: 'بالکل نہیں کھینچیں گے', subText: 'غلط', isCorrect: false },
      { id: 'mq3-opt4', text: '۵ الف کھینچیں گے', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'حَیٌّ طَهُرَ کے ۵ حروف (ح، ی، ط، ہ، ر) دو حرفی پڑھے جاتے ہیں (حا، یا، طا، ہا، را) اور ان پر صرف ۱ الف (مدِ طبعی) کی مقدار کھینچنا ہوتا ہے۔',
    breakdown: 'حَا + یَا + طَا + ہَا + رَا',
    breakdownLetters: ['حٰ', 'یٰ', 'طٰ', 'ہٰ', 'رٰ'],
    tajweedRule: 'مدِ طبعی حرفی در مجموعہ حی طہر',
    hintText: 'طٰہٰ اور یٰسٓ کے ط، ہ، ی ایک الف کے برابر پڑھے جاتے ہیں۔',
  },
  {
    id: 'muq-4',
    category: 'muqattaat',
    categoryLabelUrdu: 'کٓہٰیٰعٓصٓ کا تفصیلی قاعدہ',
    badgeColor: 'rose',
    promptTitle: 'سورۃ مریم کے آغاز "کٓہٰیٰعٓصٓ" میں کس حرف کے بعد اخفاء مع الغنہ ہوتا ہے؟',
    arabicDisplay: 'کٓہٰیٰعٓصٓ (کَافْ ہَا یَا عَیْنْ صَادْ)',
    audioPronunciation: 'كهيعص',
    correctAnswer: 'عَیْنْ (ع) کے نون ساکنہ کے بعد حرفِ صاد کی وجہ سے اخفاء مع الغنہ ہوگا',
    correctAnswerDisplay: 'عَیْنْ اور صَادْ کے درمیان اخفاء',
    options: [
      { id: 'mq4-opt1', text: 'عَیْنْ کے نون ساکن کے بعد صاد (حرفِ اخفاء) کی وجہ سے ناک میں اخفاء مع الغنہ ہوگا', subText: 'اور صاد پُر ہونے کی وجہ سے غنہ بھی پُر ہوگا', isCorrect: true },
      { id: 'mq4-opt2', text: 'کاف اور ہا کے درمیان ادغام ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'mq4-opt3', text: 'ہا اور یا کے درمیان قلقلہ ہوگا', subText: 'غلط', isCorrect: false },
      { id: 'mq4-opt4', text: 'کوئی غنہ یا اخفاء نہیں ہوگا', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'کٓہٰیٰعٓصٓ میں: کاف (۳ الف)، ہا (۱ الف)، یا (۱ الف)، عَیْنْ (۳ الف، مدِ لین لازم)، پھر عین کے آخر کے نون ساکنہ پر صاد کی وجہ سے اخفاء مع الغنہ، اور آخر میں صَادْ (۳ الف + دال پر قلقلہ) ہوگا۔',
    breakdown: 'کَافْ + ہَا + یَا + عَیْنْ + صَادْ',
    breakdownLetters: ['کٓ', 'ہٰ', 'یٰ', 'عٓ', 'صٓ'],
    tajweedRule: 'اخفاء مع الغنہ بین العین والصاد در حروف مقطعات',
    hintText: 'عین کے نون ساکن کے بعد صاد حروفِ اخفاء میں سے ہے۔',
  },
  {
    id: 'muq-5',
    category: 'muqattaat',
    categoryLabelUrdu: 'طٰسٓمٓ میں ادغامِ نون و میم',
    badgeColor: 'cyan',
    promptTitle: 'کلمہ "طٰسٓمٓ" (سورۃ الشعراء و القصص) میں سین اور میم کے درمیان کون سا قاعدہ ہے؟',
    arabicDisplay: 'طٰسٓمٓ (طَا سِیْنْ مِّيمْ)',
    audioPronunciation: 'طسم',
    correctAnswer: 'ادغام مع الغنہ (سِیْن کے نون ساکن کا مِّيم میں ادغام)',
    correctAnswerDisplay: 'ادغام مع الغنہ (سِیْمْ مِّيمْ)',
    options: [
      { id: 'mq5-opt1', text: 'ادغام مع الغنہ — سِیْنْ کے نون ساکن کو میم میں ملا کر ۱ الف غنہ کیا جائے گا', subText: 'کیونکہ نون ساکن کے بعد میم (حرفِ یرملون) آیا ہے', isCorrect: true },
      { id: 'mq5-opt2', text: 'اظہارِ حلقی — بغیر غنہ کے', subText: 'غلط', isCorrect: false },
      { id: 'mq5-opt3', text: 'اقلاب', subText: 'غلط', isCorrect: false },
      { id: 'mq5-opt4', text: 'قلقلہ', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'طٰسٓمٓ میں سِیْنْ کا آخری حرف نون ساکنہ ہے، اس کے بعد مِّيمْ آنے سے ادغام مع الغنہ ہوگا یعنی نون میم میں مدغم ہو کر غنہ کے ساتھ ادا ہوگا۔',
    breakdown: 'طَا + سِیْنْ + مِّيمْ',
    breakdownLetters: ['طٰ', 'سٓ', 'مٓ'],
    tajweedRule: 'ادغام مع الغنہ بین السین والمیم',
    hintText: 'سین کا نون ساکن میم میں مل کر تشدید اور غنہ اختیار کرتا ہے۔',
  },
  {
    id: 'muq-6',
    category: 'muqattaat',
    categoryLabelUrdu: 'مجموعہ نَقَصَ عَسَلُكُمْ (مدِ لازم حرفی)',
    badgeColor: 'emerald',
    promptTitle: 'حروفِ مقطعات کے مجموعے "نَقَصَ عَسَلُكُمْ" کے ۸ حروف کو کتنا کھینچنا ضروری ہے؟',
    arabicDisplay: 'نَقَصَ عَسَلُكُمْ (ن، ق، ص، ع، س، ل، ک، م)',
    audioPronunciation: 'ق',
    correctAnswer: '۳ الف (۵ یا ۶ حرکات) یعنی مدِ لازم حرفی کے مطابق',
    correctAnswerDisplay: '۳ الف (۶ حرکات)',
    options: [
      { id: 'mq6-opt1', text: '۳ الف (۵ سے ۶ حرکات) — کیونکہ ان حروف کے ہجے ۳ حرفی ہیں اور درمیان میں حرفِ مد/لین کے بعد سکونِ اصلی ہے', subText: 'مدِ لازم حرفی مخفف یا مثقل', isCorrect: true },
      { id: 'mq6-opt2', text: 'صرف ۱ الف', subText: 'غلط', isCorrect: false },
      { id: 'mq6-opt3', text: 'بالکل نہیں کھینچتے', subText: 'غلط', isCorrect: false },
      { id: 'mq6-opt4', text: '۱۰ حرکات', subText: 'غلط', isCorrect: false },
    ],
    explanationUrdu: 'مجموعہ "نَقَصَ عَسَلُكُمْ" کے ۸ حروف (ن، ق، ص، ع، س، ل، ک، م) تین حرفی ہیں جن کے درمیان میں حرفِ مد یا لین ہے اور بعد میں سکونِ اصلی ہے، اس لیے ان پر مدِ لازم حرفی (۳ الف / ۶ حرکات) ہوتی ہے۔',
    breakdown: 'نُوْنْ + قَافْ + صَادْ + عَیْنْ + سِیْنْ + لَامْ + کَافْ + مِيمْ',
    breakdownLetters: ['نٓ', 'قٓ', 'صٓ', 'عٓ', 'سٓ', 'لٓ', 'کٓ', 'مٓ'],
    tajweedRule: 'مدِ لازم حرفی در حروفِ نقص عسلکم',
    hintText: 'قٓ، صٓ، نٓ، الٓمٓ، یٰسٓ سبھی میں یہ حروف ۳ الف تک کھینچے جاتے ہیں۔',
  }
];

interface QuranTajweedQuizEngineProps {
  currentLang?: LanguageCode;
  onBack?: () => void;
}

export const QuranTajweedQuizEngine: React.FC<QuranTajweedQuizEngineProps> = ({
  currentLang = 'ur',
  onBack,
}) => {
  // 1. Quiz Settings & Filter States
  const [selectedCategory, setSelectedCategory] = useState<QuizCategoryType>('all');
  const [gameMode, setGameMode] = useState<QuizGameModeType>('mcq');

  // 2. Score & Gamification (Local Storage Synchronized)
  const [points, setPoints] = useState<number>(() => Number(localStorage.getItem('qaida_points') || 320));
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('qaida_coins') || 500));
  const [streak, setStreak] = useState<number>(() => Number(localStorage.getItem('qaida_streak') || 5));
  const [lives, setLives] = useState<number>(3);
  const [xp, setXp] = useState<number>(920);
  const [completedCount, setCompletedCount] = useState<number>(() => Number(localStorage.getItem('qaida_quiz_completed') || 18));
  const [highScore, setHighScore] = useState<number>(() => Number(localStorage.getItem('qaida_quiz_highscore') || 450));

  // 3. Question Flow State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [showRewardToast, setShowRewardToast] = useState<{ text: string; subText: string; type: 'correct' | 'wrong' | 'badge' } | null>(null);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);

  // 4. Lifelines: 50-50 & Slow Audio Speed
  const [hiddenOptionIds, setHiddenOptionIds] = useState<string[]>([]);
  const [hasUsedFiftyFifty, setHasUsedFiftyFifty] = useState<boolean>(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1.0);

  // 5. Interactive Word Builder (Breakdown Mode)
  const [selectedLetterChips, setSelectedLetterChips] = useState<string[]>([]);
  const [builderStatus, setBuilderStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // 6. 60-Second Speed Timer Challenge Mode
  const [speedTimeLeft, setSpeedTimeLeft] = useState<number>(60);
  const [isSpeedRunning, setIsSpeedRunning] = useState<boolean>(false);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedCorrectCount, setSpeedCorrectCount] = useState<number>(0);
  const [showSpeedSummary, setShowSpeedSummary] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 7. AI Tajweed Tester Simulator
  const [isRecordingAI, setIsRecordingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{ score: number; feedback: string } | null>(null);

  // Filter Questions by Category
  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') return COMPREHENSIVE_QUIZ_QUESTIONS;
    return COMPREHENSIVE_QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0] || COMPREHENSIVE_QUIZ_QUESTIONS[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('qaida_points', points.toString());
    localStorage.setItem('qaida_coins', coins.toString());
    localStorage.setItem('qaida_streak', streak.toString());
    localStorage.setItem('qaida_quiz_completed', completedCount.toString());
    localStorage.setItem('qaida_quiz_highscore', highScore.toString());
  }, [points, coins, streak, completedCount, highScore]);

  // When category changes, reset states
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setAiResult(null);
    setHiddenOptionIds([]);
    setHasUsedFiftyFifty(false);
    setSelectedLetterChips([]);
    setBuilderStatus('idle');
  }, [selectedCategory]);

  // When question changes, reset per-question helper states
  useEffect(() => {
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setHiddenOptionIds([]);
    setSelectedLetterChips([]);
    setBuilderStatus('idle');
  }, [currentIndex]);

  // Auto-play audio on question load in listening mode
  useEffect(() => {
    if (gameMode === 'listening' && currentQuestion) {
      const timer = setTimeout(() => {
        playQariText(currentQuestion.audioPronunciation);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, gameMode]);

  // Speed Challenge Timer Loop
  useEffect(() => {
    if (gameMode === 'speed' && isSpeedRunning) {
      timerRef.current = setInterval(() => {
        setSpeedTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsSpeedRunning(false);
            setShowSpeedSummary(true);
            triggerConfetti();
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
  }, [gameMode, isSpeedRunning]);

  // Confetti trigger helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899']
      });
    } catch {
      // safe fallback
    }
  };

  // 8. Handle Option Selection
  const handleOptionClick = (option: QuizQuestion['options'][0]) => {
    if (answerStatus === 'correct' || isFlipping || showGameOverModal) return;

    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      setAnswerStatus('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      const earnedPoints = 25 * (gameMode === 'speed' ? Math.min(newStreak, 4) : 1);
      const earnedCoins = 15;
      const earnedXp = 60;

      setPoints((p) => {
        const nextP = p + earnedPoints;
        if (nextP > highScore) setHighScore(nextP);
        return nextP;
      });
      setCoins((c) => c + earnedCoins);
      setXp((x) => x + earnedXp);
      setCompletedCount((cnt) => cnt + 1);

      if (gameMode === 'speed') {
        setSpeedScore((s) => s + earnedPoints);
        setSpeedCorrectCount((c) => c + 1);
      }

      playQuizFeedbackAudio(true, currentQuestion.audioPronunciation);

      if (newStreak % 3 === 0) {
        triggerConfetti();
      }

      setShowRewardToast({
        text: 'ماشاء اللہ! بالکل درست جواب 🎉',
        subText: `+${earnedPoints} اسکور | +${earnedCoins} سکے | +${earnedXp} XP حاصل ہوئے! (تسلسل x${newStreak})`,
        type: 'correct',
      });

      setIsFlipping(true);

      // In speed mode auto-advance after 700ms
      if (gameMode === 'speed') {
        setTimeout(() => {
          goToNextQuestion();
        }, 800);
      }
    } else {
      setAnswerStatus('wrong');
      setStreak(0);

      if (gameMode !== 'speed') {
        const newLives = lives - 1;
        setLives(newLives);

        if (newLives <= 0) {
          setTimeout(() => {
            setShowGameOverModal(true);
          }, 1200);
        }
      }

      playQuizFeedbackAudio(false);

      setShowRewardToast({
        text: 'دوبارہ کوشش کریں! ❌',
        subText: `صحیح جواب اور تجوید کا قاعدہ ملاحظہ فرمائیں۔`,
        type: 'wrong',
      });

      setTimeout(() => {
        setShowRewardToast(null);
      }, 2000);
    }
  };

  // 9. Interactive Word Builder Letter Click
  const handleChipClick = (letter: string) => {
    if (builderStatus === 'success') return;

    const newSelected = [...selectedLetterChips, letter];
    setSelectedLetterChips(newSelected);

    const targetBreakdown = currentQuestion.breakdownLetters || currentQuestion.breakdown?.split('+').map(s => s.trim()) || [];
    
    // Check if so far is correct prefix
    const isCorrectSoFar = newSelected.every((l, idx) => l === targetBreakdown[idx]);

    if (!isCorrectSoFar) {
      setBuilderStatus('fail');
      playQuizFeedbackAudio(false);
      setTimeout(() => {
        setSelectedLetterChips([]);
        setBuilderStatus('idle');
      }, 1000);
      return;
    }

    // If fully built
    if (newSelected.length === targetBreakdown.length) {
      setBuilderStatus('success');
      setAnswerStatus('correct');
      setPoints((p) => p + 35);
      setCoins((c) => c + 20);
      setStreak((s) => s + 1);
      triggerConfetti();
      playQuizFeedbackAudio(true, currentQuestion.audioPronunciation);

      setShowRewardToast({
        text: 'شاندار! حروف بالکل صحیح جوڑے 🧩✨',
        subText: '+35 پوائنٹس | +20 سکے حاصل ہوئے!',
        type: 'correct',
      });
    } else {
      playChimeEffect('success');
    }
  };

  const resetWordBuilder = () => {
    setSelectedLetterChips([]);
    setBuilderStatus('idle');
  };

  // 10. Lifeline: 50:50
  const useFiftyFiftyLifeline = () => {
    if (hasUsedFiftyFifty || answerStatus || coins < 10) return;

    setCoins((c) => Math.max(0, c - 10));
    setHasUsedFiftyFifty(true);

    const wrongOptions = currentQuestion.options.filter((o) => !o.isCorrect);
    // pick 2 random wrong options to hide
    const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
    const toHide = shuffledWrong.slice(0, 2).map((o) => o.id);
    setHiddenOptionIds(toHide);

    playChimeEffect('success');
  };

  // 11. Audio Recitation with speed control
  const playCurrentQuestionAudio = () => {
    playQariText(currentQuestion.audioPronunciation);
  };

  // 12. Navigation
  const goToNextQuestion = () => {
    setShowRewardToast(null);
    setIsFlipping(false);
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setAiResult(null);
    setHiddenOptionIds([]);
    setHasUsedFiftyFifty(false);
    setSelectedLetterChips([]);
    setBuilderStatus('idle');

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const goToPrevQuestion = () => {
    setShowRewardToast(null);
    setIsFlipping(false);
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setAiResult(null);
    setHiddenOptionIds([]);
    setHasUsedFiftyFifty(false);
    setSelectedLetterChips([]);
    setBuilderStatus('idle');

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredQuestions.length - 1);
    }
  };

  const shuffleQuestion = () => {
    const randIdx = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentIndex(randIdx);
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setAiResult(null);
    setHiddenOptionIds([]);
    setHasUsedFiftyFifty(false);
    setSelectedLetterChips([]);
    setBuilderStatus('idle');
  };

  const startSpeedRound = () => {
    setSpeedTimeLeft(60);
    setSpeedScore(0);
    setSpeedCorrectCount(0);
    setIsSpeedRunning(true);
    setShowSpeedSummary(false);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setAnswerStatus(null);
  };

  const refillLivesAndRestart = () => {
    setLives(3);
    setShowGameOverModal(false);
    setSelectedOptionId(null);
    setAnswerStatus(null);
  };

  // 13. AI Pronunciation Simulator
  const handleAiCheck = () => {
    if (isRecordingAI) return;
    setIsRecordingAI(true);
    playUrduText('براہ کرم مائیک میں تلاوت فرمائیں...');

    setTimeout(() => {
      setIsRecordingAI(false);
      const randomScore = Math.floor(Math.random() * 10) + 90;
      setAiResult({
        score: randomScore,
        feedback: `ماشاء اللہ! تجوید کا مخرج، غنہ اور صوتی توازن انتہائی شاندار ہے۔ (${currentQuestion.tajweedRule || 'مخارج و حرکات درست'})`,
      });
      setPoints((p) => p + 30);
      setCoins((c) => c + 15);
      triggerConfetti();
      playUrduText('ماشاء اللہ! بہت عمدہ تلاوت');
    }, 2500);
  };

  // Helper letter options pool for Word Builder
  const wordBuilderPool = useMemo(() => {
    const targetLetters = currentQuestion.breakdownLetters || currentQuestion.breakdown?.split('+').map(s => s.trim()) || [currentQuestion.arabicDisplay];
    const dummyPool = ['ك', 'ت', 'ب', 'ن', 'ل', 'ا', 'ص', 'ر', 'س', 'ق', 'م', 'خ', 'د', 'ي', 'ع', 'ح'];
    const extraDistractors = dummyPool.filter(l => !targetLetters.includes(l)).slice(0, 3);
    return [...targetLetters, ...extraDistractors].sort(() => 0.5 - Math.random());
  }, [currentQuestion]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden font-urdu select-none" dir="rtl">
      
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ==================================================================== */}
      {/* TOP HEADER: Title & Live Gamification Bar */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5">
            {onBack && (
              <button
                onClick={() => {
                  stopAllQariAudio();
                  onBack();
                }}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
                title="واپس جائیں"
              >
                <ArrowRight className="w-4 h-4 text-amber-400" />
                <span>واپسی</span>
              </button>
            )}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
                <span>🧠 قرآن و تجوید کوئز ماسٹر</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold">
                  سوال {currentIndex + 1} / {filteredQuestions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                مرکبات، متحرکات، ساکن حروف، قلقلہ اور مخارج کی جامع پرکھ
              </p>
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={() => setShowBadgesModal(true)}
            className="bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-amber-300 cursor-pointer transition-colors shadow-sm"
            title="بیجز اور انعامات دیکھیں"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{points} ⭐</span>
          </button>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-yellow-300">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span>{coins} 🪙</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-orange-400">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>x{streak} 🔥</span>
          </div>

          {gameMode !== 'speed' ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center gap-1">
              {[1, 2, 3].map((h) => (
                <Heart
                  key={h}
                  className={`w-4 h-4 ${
                    h <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700 fill-slate-800'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="bg-amber-950/80 border border-amber-600/80 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-amber-300 animate-pulse">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>{speedTimeLeft}s باقی</span>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. CATEGORY SWITCHER TABS */}
      {/* ==================================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>کوئز کا سبق منتخب کریں:</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={shuffleQuestion}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>بے ترتیب</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {/* ALL */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/20'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span>🌟 سبھی (جامع مکسڈ)</span>
          </button>

          {/* MUFRADAT (Lesson 1) */}
          <button
            onClick={() => setSelectedCategory('mufradat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'mufradat'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/20'
                : 'bg-slate-950/80 text-cyan-400 border-cyan-900/50 hover:border-cyan-700'
            }`}
          >
            <span>🔤 ۱: مفردات و مخارج</span>
          </button>

          {/* MURAKKABAT (Lesson 2) */}
          <button
            onClick={() => setSelectedCategory('murakkabat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'murakkabat'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-indigo-500/20'
                : 'bg-slate-950/80 text-indigo-400 border-indigo-900/50 hover:border-indigo-700'
            }`}
          >
            <span>🧩 ۲: مرکبات (جوڑ)</span>
          </button>

          {/* MUTAHARRIKAT (Lesson 3) */}
          <button
            onClick={() => setSelectedCategory('mutaharrikat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'mutaharrikat'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
                : 'bg-slate-950/80 text-emerald-400 border-emerald-900/50 hover:border-emerald-700'
            }`}
          >
            <span>⚡ ۳: حرکات ثلاثہ</span>
          </button>

          {/* SUKOON / SAKIN HUROOF (Lesson 4) */}
          <button
            onClick={() => setSelectedCategory('sukoon')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'sukoon'
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-500/20'
                : 'bg-slate-950/80 text-purple-400 border-purple-900/50 hover:border-purple-700'
            }`}
          >
            <span>🛑 ۴: ساکن و قلقلہ</span>
          </button>

          {/* MADDAH (Lesson 5) */}
          <button
            onClick={() => setSelectedCategory('maddah')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'maddah'
                ? 'bg-amber-600 text-white border-amber-400 shadow-amber-500/20'
                : 'bg-slate-950/80 text-amber-400 border-amber-900/50 hover:border-amber-700'
            }`}
          >
            <span>🎮 ۵: حروفِ مدہ</span>
          </button>

          {/* LEEN (Lesson 6) */}
          <button
            onClick={() => setSelectedCategory('leen')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'leen'
                ? 'bg-teal-600 text-white border-teal-400 shadow-teal-500/20'
                : 'bg-slate-950/80 text-teal-400 border-teal-900/50 hover:border-teal-700'
            }`}
          >
            <span>🍃 ۶: حروفِ لین</span>
          </button>

          {/* KHARI HARAKAT (Lesson 7) */}
          <button
            onClick={() => setSelectedCategory('khari_harakat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'khari_harakat'
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-500/20'
                : 'bg-slate-950/80 text-rose-400 border-rose-900/50 hover:border-rose-700'
            }`}
          >
            <span>✨ ۷: کھڑی حرکات</span>
          </button>

          {/* TANWEEN (Lesson 8) */}
          <button
            onClick={() => setSelectedCategory('tanween')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'tanween'
                ? 'bg-yellow-500 text-slate-950 border-yellow-300 shadow-yellow-500/20'
                : 'bg-slate-950/80 text-yellow-400 border-yellow-900/50 hover:border-yellow-700'
            }`}
          >
            <span>🌟 ۸: تنوین (دو زبر...)</span>
          </button>

          {/* TASHDEED (Lesson 9) */}
          <button
            onClick={() => setSelectedCategory('tashdeed')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'tashdeed'
                ? 'bg-orange-600 text-white border-orange-400 shadow-orange-500/20'
                : 'bg-slate-950/80 text-orange-400 border-orange-900/50 hover:border-orange-700'
            }`}
          >
            <span>🎯 ۹: تشدید و غنہ</span>
          </button>

          {/* NUN SAKIN & TANWEEN (Lesson 10) */}
          <button
            onClick={() => setSelectedCategory('nun_sakin')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'nun_sakin'
                ? 'bg-teal-500 text-slate-950 border-teal-300 shadow-teal-500/20'
                : 'bg-slate-950/80 text-teal-400 border-teal-900/50 hover:border-teal-700'
            }`}
          >
            <span>💎 ۱۰: نون ساکن و تنوین</span>
          </button>

          {/* MEEM SAKIN (Lesson 11) */}
          <button
            onClick={() => setSelectedCategory('meem_sakin')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'meem_sakin'
                ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                : 'bg-slate-950/80 text-blue-400 border-blue-900/50 hover:border-blue-700'
            }`}
          >
            <span>👑 ۱۱: میم ساکن (۳ قواعد)</span>
          </button>

          {/* TAFKHEEM & TARQEEQ (Lesson 12) */}
          <button
            onClick={() => setSelectedCategory('tafkheem_tarqeeq')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'tafkheem_tarqeeq'
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/20'
                : 'bg-slate-950/80 text-amber-400 border-amber-900/50 hover:border-amber-700'
            }`}
          >
            <span>✨ ۱۲: تفخیم و ترقیق (پُر/باریک)</span>
          </button>

          {/* MADDAT RULES (Lesson 13) */}
          <button
            onClick={() => setSelectedCategory('maddat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'maddat'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-300 shadow-purple-500/20'
                : 'bg-slate-950/80 text-purple-300 border-purple-900/50 hover:border-purple-700'
            }`}
          >
            <span>📜 ۱۳: مَدَّات کے قواعد</span>
          </button>

          {/* MUQATTAAT (Lesson 14) */}
          <button
            onClick={() => setSelectedCategory('muqattaat')}
            className={`py-2.5 px-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              selectedCategory === 'muqattaat'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 shadow-emerald-500/20'
                : 'bg-slate-950/80 text-emerald-300 border-emerald-900/50 hover:border-emerald-700'
            }`}
          >
            <span>✨ ۱۴: حُرُوفِ مُقَطَّعَات</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. GAME MODE SWITCHER (MCQ | Listening | Word Builder | Speed Challenge) */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {/* MCQ Mode */}
          <button
            onClick={() => setGameMode('mcq')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              gameMode === 'mcq'
                ? 'bg-slate-800 text-amber-300 border-amber-500/50 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>💡 ۴ انتخابی کوئز</span>
          </button>

          {/* Listening Mode */}
          <button
            onClick={() => setGameMode('listening')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              gameMode === 'listening'
                ? 'bg-purple-950 text-purple-300 border-purple-500/50 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>🎧 سن کر پہچانیں</span>
          </button>

          {/* Word Builder Mode */}
          <button
            onClick={() => setGameMode('breakdown')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              gameMode === 'breakdown'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>🧩 حروف جوڑیں اور بنائیں</span>
          </button>

          {/* Speed Challenge Mode */}
          <button
            onClick={() => {
              setGameMode('speed');
              if (!isSpeedRunning) startSpeedRound();
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
              gameMode === 'speed'
                ? 'bg-rose-950 text-rose-300 border-rose-500/50 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>⚡ اسپیڈ چیلنج (60s)</span>
          </button>
        </div>

        {/* Action Toolbar: Lifelines & AI Pronunciation */}
        <div className="flex items-center gap-2 justify-end">
          {/* 50:50 Lifeline Button */}
          {gameMode === 'mcq' && (
            <button
              onClick={useFiftyFiftyLifeline}
              disabled={hasUsedFiftyFifty || Boolean(answerStatus) || coins < 10}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                hasUsedFiftyFifty || Boolean(answerStatus) || coins < 10
                  ? 'bg-slate-950 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                  : 'bg-amber-950/60 border-amber-600 text-amber-300 hover:bg-amber-900/60'
              }`}
              title="10 سکے خرچ کر کے دو غلط آپشنز ہٹائیں"
            >
              <span>50:50</span>
              <span className="text-[10px] text-yellow-400">(-10🪙)</span>
            </button>
          )}

          {/* Tajweed Hint Button */}
          <button
            onClick={() => setShowHintModal(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="تجوید کا اشارہ دیکھیں"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>اشارہ</span>
          </button>

          {/* AI Voice check button */}
          <button
            onClick={handleAiCheck}
            disabled={isRecordingAI}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 transition-transform active:scale-95"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecordingAI ? 'سن رہے ہیں...' : '🎙️ AI تلفظ'}</span>
          </button>
        </div>
      </div>

      {/* AI Voice Evaluation Result Display */}
      {aiResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-500 text-purple-200 text-xs text-center font-bold space-y-1 shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <span>⭐ AI تجوید اسکور:</span>
            <span className="text-amber-300 text-base font-black">{aiResult.score}/100</span>
          </div>
          <p className="text-purple-300">{aiResult.feedback}</p>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* 3. MAIN TARGET CARD (DISPLAY / AUDIO / MYSTERY CARD) */}
      {/* ==================================================================== */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center relative shadow-2xl group">
          
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 shadow-sm">
              {currentQuestion.categoryLabelUrdu}
            </span>
          </div>

          {/* Sound Repeat Button */}
          <button
            onClick={playCurrentQuestionAudio}
            className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 flex items-center justify-center cursor-pointer transition-all shadow-md active:scale-95"
            title="قاری صاحب کی تلاوت سنیں"
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Prompt Header */}
          <p className="text-xs sm:text-sm font-bold text-slate-300 text-center mb-2 mt-4">
            {currentQuestion.promptTitle}
          </p>

          {/* Main Visual Display */}
          {gameMode === 'listening' ? (
            <div className="py-6 flex flex-col items-center justify-center gap-3">
              <button
                onClick={playCurrentQuestionAudio}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl cursor-pointer transition-all border-4 border-purple-400/40"
              >
                <Headphones className="w-10 h-10 animate-bounce" />
              </button>
              <div className="text-center">
                <p className="text-xs text-purple-300 font-black">
                  قاری صاحب کی تلاوت سنیں 🔊
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  نیچے دیے گئے اختیارات میں سے درست لفظ تلاش کریں
                </p>
              </div>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center justify-center">
              <span className="text-6xl sm:text-7xl font-black text-amber-300 font-arabic select-none tracking-wide drop-shadow-md">
                {currentQuestion.arabicDisplay}
              </span>
              
              {/* Optional breakdown indicator */}
              {currentQuestion.breakdown && (
                <span className="text-xs text-emerald-400 font-black mt-2.5 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/60 shadow-sm">
                  اجزاء: {currentQuestion.breakdown}
                </span>
              )}
            </div>
          )}

          {/* Tajweed Rule Helper Pill */}
          {currentQuestion.tajweedRule && (
            <div className="mt-2 text-[11px] text-slate-400 font-bold flex items-center gap-1.5 bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{currentQuestion.tajweedRule}</span>
            </div>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. GAMEPLAY SECTIONS (MCQ vs WORD BUILDER) */}
      {/* ==================================================================== */}
      {gameMode === 'breakdown' ? (
        /* INTERACTIVE WORD BUILDER MODE */
        <div className="space-y-4 max-w-xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <p className="text-xs font-black text-emerald-300 flex items-center justify-center gap-1.5">
              <Puzzle className="w-4 h-4 text-emerald-400" />
              <span>حروف کو صحیح ترتیب میں کلک کر کے جوڑیں:</span>
            </p>

            {/* Selected Letters Slot */}
            <div className="flex items-center justify-center gap-2 min-h-16 p-2 rounded-xl bg-slate-900 border-2 border-dashed border-slate-700">
              {selectedLetterChips.length === 0 ? (
                <span className="text-xs text-slate-500 font-bold">
                  نیچے دیے گئے حروف پر کلک کریں...
                </span>
              ) : (
                selectedLetterChips.map((letter, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-md ${
                      builderStatus === 'success'
                        ? 'bg-emerald-600 border border-emerald-400'
                        : builderStatus === 'fail'
                        ? 'bg-rose-600 border border-rose-400'
                        : 'bg-amber-600 border border-amber-400 text-slate-950 font-bold'
                    }`}
                  >
                    {letter}
                  </motion.div>
                ))
              )}
            </div>

            {/* Letter Options Pool Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {wordBuilderPool.map((letter, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(letter)}
                  disabled={builderStatus === 'success'}
                  className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 border-2 border-slate-700 hover:border-amber-400 text-amber-300 text-2xl font-black flex items-center justify-center cursor-pointer transition-all shadow-md"
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Reset builder button */}
            <div className="flex justify-center pt-1">
              <button
                onClick={resetWordBuilder}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>دوبارہ منتخب کریں</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STANDARD 4-OPTIONS MCQ GRID */
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 text-center">
            درست جواب منتخب کریں:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isThisCorrect = isSelected && answerStatus === 'correct';
              const isThisWrong = isSelected && answerStatus === 'wrong';
              const showCorrectAnswerRevealed = answerStatus === 'wrong' && option.isCorrect;
              const isHiddenByLifeline = hiddenOptionIds.includes(option.id);

              if (isHiddenByLifeline) {
                return (
                  <div
                    key={option.id}
                    className="p-4 rounded-2xl border-2 border-slate-900 bg-slate-950/40 opacity-20 pointer-events-none flex items-center justify-center"
                  >
                    <span className="text-xs text-slate-600 font-bold">50:50 سے خارج کردہ</span>
                  </div>
                );
              }

              return (
                <motion.div
                  key={option.id}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOptionClick(option);
                    }
                  }}
                  whileHover={{ scale: answerStatus ? 1 : 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(option)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md select-none ${
                    isThisCorrect
                      ? 'bg-emerald-950/90 border-emerald-400 text-white'
                      : isThisWrong
                      ? 'bg-rose-950/90 border-rose-400 text-white'
                      : showCorrectAnswerRevealed
                      ? 'bg-emerald-950/50 border-emerald-500/80 text-emerald-300'
                      : 'bg-slate-950 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${
                        isThisCorrect
                          ? 'bg-emerald-600 border-emerald-400 text-white'
                          : isThisWrong
                          ? 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-slate-900 border-slate-700 text-amber-300'
                      }`}
                    >
                      {isThisCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isThisWrong ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        '✦'
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm sm:text-base font-black text-amber-200">
                        {option.text}
                      </p>
                      {option.subText && (
                        <p className="text-xs text-slate-400 mt-0.5">{option.subText}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playQariText(option.text);
                    }}
                    className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-amber-300 cursor-pointer transition-colors"
                    title="آواز سنیں"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. EXPLANATION & NEXT BUTTON ON COMPLETION */}
      {/* ==================================================================== */}
      {answerStatus === 'correct' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border border-emerald-500/60 text-center space-y-3 max-w-xl mx-auto shadow-xl"
        >
          <div className="flex items-center justify-center gap-2 text-emerald-300 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>ماشاء اللہ! آپ کا جواب بالکل درست ہے۔</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-bold">
            {currentQuestion.explanationUrdu}
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={goToNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>اگلا سوال جاری رکھیں</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ==================================================================== */}
      {/* 6. BOTTOM NAVIGATION BAR */}
      {/* ==================================================================== */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        <button
          onClick={goToPrevQuestion}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800 transition-all active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
          <span>پچھلا سوال</span>
        </button>

        <span className="text-xs text-slate-400 font-bold">
          سوال {currentIndex + 1} از {filteredQuestions.length}
        </span>

        <button
          onClick={goToNextQuestion}
          className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-800 transition-all active:scale-95"
        >
          <span>اگلا سوال</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* ==================================================================== */}
      {/* HINT MODAL */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-500/80 p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-700 flex items-center justify-center mx-auto text-2xl font-black">
                💡
              </div>
              <h3 className="text-base font-black text-amber-300">تجوید کا رہنما اشارہ</h3>
              
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-bold">
                {currentQuestion.hintText || currentQuestion.explanationUrdu}
              </div>

              {currentQuestion.tajweedRule && (
                <p className="text-xs text-emerald-400 font-black">
                  📖 قاعدہ: {currentQuestion.tajweedRule}
                </p>
              )}

              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer transition-transform active:scale-95"
              >
                سمجھ آگیا، واپس جائیں ✓
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* ACHIEVEMENTS & BADGES MODAL */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showBadgesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 text-center space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>انعامات اور تجوید کے اعزازی بیجز</span>
                </h3>
                <button
                  onClick={() => setShowBadgesModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 gap-3 text-right">
                <div className="p-3 rounded-2xl bg-slate-950 border border-amber-600/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧩</span>
                    <span className="text-xs font-black text-amber-300">مرکبات کا ماہر</span>
                  </div>
                  <p className="text-[11px] text-slate-400">۱۰ مرکبات کے سوالات حل کیے</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-600/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <span className="text-xs font-black text-emerald-300">حرکات کا استاد</span>
                  </div>
                  <p className="text-[11px] text-slate-400">زبر، زیر، پیش کی درست پہچان</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-purple-600/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🛑</span>
                    <span className="text-xs font-black text-purple-300">قلقلہ چیمپیئن</span>
                  </div>
                  <p className="text-[11px] text-slate-400">ساکن حروف و قلقلہ پر عبور</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-600/50 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔤</span>
                    <span className="text-xs font-black text-cyan-300">مخارج کا عالم</span>
                  </div>
                  <p className="text-[11px] text-slate-400">۲۹ حروفِ مفردات کی ادائیگی</p>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-around font-bold">
                <div>
                  <p className="text-amber-400 font-black text-base">{points}</p>
                  <p className="text-[10px] text-slate-400">کل پوائنٹس</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-black text-base">{coins}</p>
                  <p className="text-[10px] text-slate-400">سونے کے سکے</p>
                </div>
                <div>
                  <p className="text-emerald-400 font-black text-base">{completedCount}</p>
                  <p className="text-[10px] text-slate-400">حل شدہ سوالات</p>
                </div>
              </div>

              <button
                onClick={() => setShowBadgesModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                بند کریں
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* SPEED CHALLENGE SUMMARY MODAL */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showSpeedSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-500 p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-950 text-amber-400 border-2 border-amber-600 flex items-center justify-center mx-auto text-3xl font-black">
                ⏱️
              </div>
              <h3 className="text-lg font-black text-amber-300">اسپیڈ راؤنڈ مکمل!</h3>
              
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400">حاصل کردہ اسپیڈ اسکور:</p>
                <p className="text-3xl font-black text-amber-300">+{speedScore} ⭐</p>
                <p className="text-xs text-emerald-400 font-bold">
                  درست جوابات: {speedCorrectCount} سوالات
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startSpeedRound}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  دوبارہ کھیلیں ⚡
                </button>
                <button
                  onClick={() => {
                    setShowSpeedSummary(false);
                    setGameMode('mcq');
                  }}
                  className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  کوئز پر واپس
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* GAME OVER / REFILL LIVES MODAL */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showGameOverModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-rose-600/80 p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto text-2xl font-black">
                💔
              </div>
              <h3 className="text-lg font-black text-rose-300">زندگیاں ختم ہو گئیں!</h3>
              <p className="text-xs text-slate-300">
                فکر نہ کریں! دوبارہ کوشش کریں اور مرکبات و حرکات پر توجہ دیں۔
              </p>
              <button
                onClick={refillLivesAndRestart}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg cursor-pointer transition-transform active:scale-95"
              >
                زندگیاں بحال کریں اور دوبارہ شروع کریں 🔄
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* FLOATING REWARD TOAST */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {showRewardToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 rounded-2xl border text-center shadow-xl backdrop-blur-md ${
              showRewardToast.type === 'correct'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500 text-rose-200'
            }`}
          >
            <h4 className="text-sm font-black">{showRewardToast.text}</h4>
            <p className="text-xs mt-0.5">{showRewardToast.subText}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QuranTajweedQuizEngine;
