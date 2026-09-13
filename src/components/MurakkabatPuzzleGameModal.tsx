import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Music,
  RotateCcw,
  CheckCircle2,
  CheckCircle,
  Lightbulb,
  Puzzle,
  Award,
  BookOpen,
  Layers,
  ChevronRight,
  ChevronLeft,
  Flame,
  HelpCircle,
  VolumeX,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SURAH_PUZZLES_DATA as SURAH_PUZZLES } from '../data/quranJuz30Data';
import { PAGE_1_EXERCISE, PAGE_2_EXERCISE } from '../data/murakkabatMashqData';
import { ALL_MUTAHARRIKAT_WORDS, MutaharrikExerciseWord } from '../data/mutaharrikatMashqData';
import { ALL_SUKOON_MASHQ_WORDS, SukoonMashqItem } from '../data/sukoonMashqData';
import { ALL_HUROOF_LEEN_WORDS, PAGE_14_WAW_LEEN_WORDS, PAGE_15_YAA_LEEN_WORDS, UNIFIED_HUROOF_LEEN_PAIRS, LeenWordItem } from '../data/huroofLeenData';
import { 
  SABAQ_7_ALL_84_CELLS, 
  SABAQ_7_TRIPLETS, 
  PAGE_16_ALIF_MASHQ_WORDS, 
  PAGE_17_WAW_MASHQ_WORDS, 
  PAGE_18_YAA_MASHQ_WORDS, 
  ALL_MADDAH_MASHQ_WORDS 
} from '../data/huroofMaddahData';
import {
  SABAQ_7_KHARI_TRIPLETS,
  ALL_KHARI_HARAKAT_MASHQ_WORDS,
  KHARA_ZABAR_MASHQ_WORDS,
  KHARA_ZER_MASHQ_WORDS,
  ULTA_PESH_MASHQ_WORDS
} from '../data/khariHarakatData';
import { NUN_SAKIN_ALL_WORDS } from '../data/nunSakinTanweenData';
import { meemSakinWords } from '../data/meemSakinData';
import { tafkheemTarqeeqWords } from '../data/tafkheemTarqeeqData';
import { MADDAT_WORDS } from '../data/maddatData';
import { playUrduText, playQariText, playChimeEffect, stopAllQariAudio } from '../utils/qariAudioService';
import { useBackHandler } from '../hooks/useBackHandler';
import { getPuzzleGameLocalization } from '../utils/puzzleGameLocalization';

export type GameMainMode = 'mufradat' | 'murakkabat' | 'mutaharrikat' | 'sukoon' | 'leen' | 'maddah' | 'khari_harakat' | 'tanween' | 'tashdeed' | 'nun_sakin' | 'meem_sakin' | 'tafkheem_tarqeeq' | 'maddat' | 'surahs';

interface MurakkabatPuzzleGameModalProps {
  currentLang?: LanguageCode;
  onBack: () => void;
  initialGameMode?: GameMainMode;
}

interface GenericPuzzleItem {
  id: string;
  category: string;
  categoryLabelUrdu: string;
  title: string;
  arabicPhrase: string;
  words: string[]; // Correct tiles in order
  breakdown?: string;
  spellingHijja?: string;
  tajweedRuleTitle?: string;
  isQalqalah?: boolean;
  isHamzahSakinah?: boolean;
  isHeavyLetterIncluded?: boolean;
  makhrajDescription?: string;
  dotDescription?: string;
  letterNameArabic?: string;
  isHeavy?: boolean;
  isMaddLazim?: boolean;
}

export const MurakkabatPuzzleGameModal: React.FC<MurakkabatPuzzleGameModalProps> = ({
  currentLang = 'ur',
  onBack,
  initialGameMode = 'mufradat',
}) => {
  const pLoc = getPuzzleGameLocalization(currentLang);

  // Main Game Mode: 'mufradat' (حروفِ تہجی) | 'murakkabat' (مرکبات) | 'mutaharrikat' (زبر، زیر، پیش) | 'sukoon' (سکون و قلقلہ) | 'surahs' (سورتیں)
  const [activeMode, setActiveMode] = useState<GameMainMode>(initialGameMode);

  // Common gamification state
  const [score, setScore] = useState<number>(() => Number(localStorage.getItem('puzzle_score') || '1575'));
  const [coins, setCoins] = useState<number>(() => Number(localStorage.getItem('puzzle_coins') || '2700'));
  const [streak, setStreak] = useState<number>(0);

  // Audio & speech state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAlafasy, setIsPlayingAlafasy] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Back Button Handler
  useBackHandler(() => {
    stopAllQariAudio();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onBack();
  }, true, 25, 'murakkabat_puzzle_back');

  // =========================================================================
  // 0. MUFRADAT PUZZLE DATA & STATE (سبق نمبر ۱: حروفِ تہجی و مفردات)
  // =========================================================================
  const [mufradatCategory, setMufradatCategory] = useState<'all' | 'chains' | 'heavy' | 'qalqalah' | 'halqi' | 'shafawi'>('all');
  const [mufradatIndex, setMufradatIndex] = useState(0);
  const [mufradatSlots, setMufradatSlots] = useState<(string | null)[]>([]);
  const [mufradatTileBank, setMufradatTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [mufradatSelectedId, setMufradatSelectedId] = useState<string | null>(null);
  const [mufradatCompleted, setMufradatCompleted] = useState(false);

  const MUFRADAT_ITEMS: GenericPuzzleItem[] = useMemo(() => [
    // 29 INDIVIDUAL LETTERS
    {
      id: 'muf-1',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مفرد',
      title: 'حرف: أَلِفْ (ا)',
      arabicPhrase: 'ا',
      words: ['ا'],
      letterNameArabic: 'أَلِفْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'جوفِ دہن (منہ اور گلے کا خالی حصہ)',
      tajweedRuleTitle: 'حرفِ مدہ / خالی الف',
      isHeavy: false,
    },
    {
      id: 'muf-2',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شفوی',
      title: 'حرف: بَاءْ (ب)',
      arabicPhrase: 'ب',
      words: ['ب'],
      letterNameArabic: 'بَاءْ',
      dotDescription: '۱ نقطہ نیچے',
      makhrajDescription: 'دونوں ہونٹوں کے تری والے حصے کو ملا کر',
      tajweedRuleTitle: 'حروفِ شفویہ و قلقلہ',
      isHeavy: false,
      isQalqalah: true,
    },
    {
      id: 'muf-3',
      category: 'all',
      categoryLabelUrdu: 'حرفِ نطعی',
      title: 'حرف: تَاءْ (ت)',
      arabicPhrase: 'ت',
      words: ['ت'],
      letterNameArabic: 'تَاءْ',
      dotDescription: '۲ نقطے اوپر',
      makhrajDescription: 'زبان کی نوک اور سامنے والے اوپر کے دانتوں کی جڑ',
      tajweedRuleTitle: 'حروفِ نطعیہ (باریک)',
      isHeavy: false,
    },
    {
      id: 'muf-4',
      category: 'all',
      categoryLabelUrdu: 'حرفِ لثوی',
      title: 'حرف: ثَاءْ (ث)',
      arabicPhrase: 'ث',
      words: ['ث'],
      letterNameArabic: 'ثَاءْ',
      dotDescription: '۳ نقطے اوپر',
      makhrajDescription: 'زبان کا سرا اور سامنے والے اوپر کے دانتوں کے اندرونی کنارے (نرمی سے)',
      tajweedRuleTitle: 'حروفِ لثویہ (نرم آواز)',
      isHeavy: false,
    },
    {
      id: 'muf-5',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شجری',
      title: 'حرف: جِيمْ (ج)',
      arabicPhrase: 'ج',
      words: ['ج'],
      letterNameArabic: 'جِيمْ',
      dotDescription: '۱ نقطہ نیچے',
      makhrajDescription: 'زبان کا درمیانی حصہ اور تالو کا درمیانی حصہ',
      tajweedRuleTitle: 'حروفِ شجریہ و قلقلہ (مد لازم)',
      isHeavy: false,
      isQalqalah: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-6',
      category: 'all',
      categoryLabelUrdu: 'حرفِ حلقی',
      title: 'حرف: حَاءْ (ح)',
      arabicPhrase: 'ح',
      words: ['ح'],
      letterNameArabic: 'حَاءْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'درمیانی حلق (وسط الحلق) صاف اور واضح آواز',
      tajweedRuleTitle: 'حروفِ حلقی (اظہار)',
      isHeavy: false,
    },
    {
      id: 'muf-7',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: خَاءْ (خ)',
      arabicPhrase: 'خ',
      words: ['خ'],
      letterNameArabic: 'خَاءْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'حلق کا منہ کی طرف والا ابتدائی حصہ (ادنی الحلق)',
      tajweedRuleTitle: 'حروفِ مستعلیہ (پُر پڑھے جانے والے)',
      isHeavy: true,
    },
    {
      id: 'muf-8',
      category: 'all',
      categoryLabelUrdu: 'حرفِ نطعی',
      title: 'حرف: دَالْ (د)',
      arabicPhrase: 'د',
      words: ['د'],
      letterNameArabic: 'دَالْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'زبان کی نوک اور سامنے والے اوپر کے ۲ دانتوں کی جڑ',
      tajweedRuleTitle: 'حروفِ نطعیہ و قلقلہ (مد لازم)',
      isHeavy: false,
      isQalqalah: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-9',
      category: 'all',
      categoryLabelUrdu: 'حرفِ لثوی',
      title: 'حرف: ذَالْ (ذ)',
      arabicPhrase: 'ذ',
      words: ['ذ'],
      letterNameArabic: 'ذَالْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کے کنارے (نرمی کے ساتھ)',
      tajweedRuleTitle: 'حروفِ لثویہ (نرم حرف، مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-10',
      category: 'all',
      categoryLabelUrdu: 'حرفِ ذلقی',
      title: 'حرف: رَاءْ (ر)',
      arabicPhrase: 'ر',
      words: ['ر'],
      letterNameArabic: 'رَاءْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'زبان کی نوک کی پشت اور اوپر کے مسوڑھے',
      tajweedRuleTitle: 'حروفِ ذلق (زبر/پیش پر پُر، زیر پر باریک)',
      isHeavy: false,
    },
    {
      id: 'muf-11',
      category: 'all',
      categoryLabelUrdu: 'حرفِ اسلی',
      title: 'حرف: زَاءْ (ز)',
      arabicPhrase: 'ز',
      words: ['ز'],
      letterNameArabic: 'زَاءْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'زبان کی نوک اور دونوں دانتوں کے کنارے (سیٹی کی تیز آواز)',
      tajweedRuleTitle: 'حروفِ صفیر (سیٹی والا حرف)',
      isHeavy: false,
    },
    {
      id: 'muf-12',
      category: 'all',
      categoryLabelUrdu: 'حرفِ اسلی',
      title: 'حرف: سِيْنْ (س)',
      arabicPhrase: 'س',
      words: ['س'],
      letterNameArabic: 'سِيْنْ',
      dotDescription: 'بے نقطہ (۳ دندانے)',
      makhrajDescription: 'زبان کی نوک اور سامنے والے دانتوں کے اندرونی کنارے (سیٹی)',
      tajweedRuleTitle: 'حروفِ صفیر (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-13',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شجری',
      title: 'حرف: شِيْنْ (ش)',
      arabicPhrase: 'ش',
      words: ['ش'],
      letterNameArabic: 'شِيْنْ',
      dotDescription: '۳ نقطے اوپر',
      makhrajDescription: 'زبان کا درمیانی حصہ اور تالو کا درمیانی حصہ (پھیلاؤ/تفشی)',
      tajweedRuleTitle: 'حروفِ شجریہ (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-14',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: صَادْ (ص)',
      arabicPhrase: 'ص',
      words: ['ص'],
      letterNameArabic: 'صَادْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'زبان کی نوک اور سامنے والے دانتوں کے کنارے (پُر آواز + سیٹی)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و صفیر (مد لازم)',
      isHeavy: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-15',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: ضَادْ (ض)',
      arabicPhrase: 'ض',
      words: ['ض'],
      letterNameArabic: 'ضَادْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'زبان کی کروٹ اور اوپر کی ۵ داڑھوں کی جڑیں (انتہائی پُر)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و استطالت (مد لازم)',
      isHeavy: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-16',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: طَاءْ (ط)',
      arabicPhrase: 'ط',
      words: ['ط'],
      letterNameArabic: 'طَاءْ',
      dotDescription: 'بے نقطہ (الف دار)',
      makhrajDescription: 'زبان کی نوک اور اوپر کے سامنے والے دانتوں کی جڑ (پُر + قلقلہ)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و نطعیہ و قلقلہ',
      isHeavy: true,
      isQalqalah: true,
    },
    {
      id: 'muf-17',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: ظَاءْ (ظ)',
      arabicPhrase: 'ظ',
      words: ['ظ'],
      letterNameArabic: 'ظَاءْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'زبان کا سرا اور اوپر کے ۲ دانتوں کے کنارے (پُر + نرمی)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و لثویہ',
      isHeavy: true,
    },
    {
      id: 'muf-18',
      category: 'all',
      categoryLabelUrdu: 'حرفِ حلقی',
      title: 'حرف: عَيْنْ (ع)',
      arabicPhrase: 'ع',
      words: ['ع'],
      letterNameArabic: 'عَيْنْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'درمیانی حلق (وسط الحلق) گلے کو دبا کر واضح نکالیں',
      tajweedRuleTitle: 'حروفِ حلقی (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-19',
      category: 'all',
      categoryLabelUrdu: 'حرفِ مستعلیہ',
      title: 'حرف: غَيْنْ (غ)',
      arabicPhrase: 'غ',
      words: ['غ'],
      letterNameArabic: 'غَيْنْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'حلق کا منہ کی طرف والا ابتدائی حصہ (ادنی الحلق)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و حلقی (پُر، مد لازم)',
      isHeavy: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-20',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شفوی',
      title: 'حرف: فَاءْ (ف)',
      arabicPhrase: 'ف',
      words: ['ف'],
      letterNameArabic: 'فَاءْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'اوپر کے سامنے والے ۲ دانتوں کے کنارے اور نیچے والے ہونٹ کا پیٹ',
      tajweedRuleTitle: 'حروفِ شفویہ (ہونٹ کا حرف)',
      isHeavy: false,
    },
    {
      id: 'muf-21',
      category: 'all',
      categoryLabelUrdu: 'حرفِ لہوی',
      title: 'حرف: قَافْ (ق)',
      arabicPhrase: 'ق',
      words: ['ق'],
      letterNameArabic: 'قَافْ',
      dotDescription: '۲ نقطے اوپر',
      makhrajDescription: 'زبان کی جڑ اور اوپر کا نرم تالو (کوّا کے پاس)',
      tajweedRuleTitle: 'حروفِ مستعلیہ و لہویہ و قلقلہ (مد لازم)',
      isHeavy: true,
      isQalqalah: true,
      isMaddLazim: true,
    },
    {
      id: 'muf-22',
      category: 'all',
      categoryLabelUrdu: 'حرفِ لہوی',
      title: 'حرف: كَافْ (ك)',
      arabicPhrase: 'ك',
      words: ['ك'],
      letterNameArabic: 'كَافْ',
      dotDescription: 'بے نقطہ (کشش اور ہمزہ نما نشان)',
      makhrajDescription: 'زبان کی جڑ قاف کے مخرج سے ذرا آگے سخت تالو کی طرف (باریک)',
      tajweedRuleTitle: 'حروفِ لہویہ (مد لازم، باریک)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-23',
      category: 'all',
      categoryLabelUrdu: 'حرفِ ذلقی',
      title: 'حرف: لَامْ (ل)',
      arabicPhrase: 'ل',
      words: ['ل'],
      letterNameArabic: 'لَامْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'زبان کا اگلا کنارہ اور اوپر کے دانتوں کے مسوڑھے',
      tajweedRuleTitle: 'حروفِ ذلق (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-24',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شفوی',
      title: 'حرف: مِيمْ (م)',
      arabicPhrase: 'م',
      words: ['م'],
      letterNameArabic: 'مِيمْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'دونوں ہونٹوں کے بیرونی خشک حصے کو ملا کر',
      tajweedRuleTitle: 'حروفِ شفویہ و غنہ (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-25',
      category: 'all',
      categoryLabelUrdu: 'حرفِ ذلقی',
      title: 'حرف: نُوْنْ (ن)',
      arabicPhrase: 'ن',
      words: ['ن'],
      letterNameArabic: 'نُوْنْ',
      dotDescription: '۱ نقطہ اوپر',
      makhrajDescription: 'زبان کی نوک اور اوپر کے مسوڑھے (ناک سے غنہ کی آواز)',
      tajweedRuleTitle: 'حروفِ ذلق و غنہ (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-26',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شفوی',
      title: 'حرف: وَاوْ (و)',
      arabicPhrase: 'و',
      words: ['و'],
      letterNameArabic: 'وَاوْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'دونوں ہونٹوں کو گول کر کے کچھ کھلا رکھ کر ادا کریں',
      tajweedRuleTitle: 'حروفِ شفویہ و مدہ (مد لازم)',
      isHeavy: false,
      isMaddLazim: true,
    },
    {
      id: 'muf-27',
      category: 'all',
      categoryLabelUrdu: 'حرفِ حلقی',
      title: 'حرف: هَاءْ (ه)',
      arabicPhrase: 'ه',
      words: ['ه'],
      letterNameArabic: 'هَاءْ',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'حلق کا سینے کی طرف والا آخری گہرا حصہ (اقصی الحلق)',
      tajweedRuleTitle: 'حروفِ حلقی (باریک)',
      isHeavy: false,
    },
    {
      id: 'muf-28',
      category: 'all',
      categoryLabelUrdu: 'حرفِ حلقی',
      title: 'حرف: هَمْزَة (ء)',
      arabicPhrase: 'ء',
      words: ['ء'],
      letterNameArabic: 'هَمْزَة',
      dotDescription: 'بے نقطہ (خالی)',
      makhrajDescription: 'حلق کا سینے کی طرف والا حصہ (اقصی الحلق - جھٹکے سے ادا کریں)',
      tajweedRuleTitle: 'حروفِ حلقی (ہمزہ)',
      isHeavy: false,
    },
    {
      id: 'muf-29',
      category: 'all',
      categoryLabelUrdu: 'حرفِ شجری',
      title: 'حرف: يَاءْ (ي)',
      arabicPhrase: 'ي',
      words: ['ي'],
      letterNameArabic: 'يَاءْ',
      dotDescription: '۲ نقطے نیچے',
      makhrajDescription: 'زبان کا درمیانی حصہ اور تالو کا درمیانی حصہ',
      tajweedRuleTitle: 'حروفِ شجریہ و مدہ',
      isHeavy: false,
    },

    // ALPHABETICAL & TAJWEED SEQUENCES (الفبائی و تجویدی زنجیریں)
    {
      id: 'muf-seq-1',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۱: الف تا ثا',
      title: 'زنجیر: ا - ب - ت - ث',
      arabicPhrase: 'ا ب ت ث',
      words: ['ا', 'ب', 'ت', 'ث'],
      letterNameArabic: 'أَلِفْ بَاءْ تَاءْ ثَاءْ',
      tajweedRuleTitle: 'ابتدائی ۴ حروفِ تہجی کی درست ترتیب',
    },
    {
      id: 'muf-seq-2',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۲: جیم تا دال',
      title: 'زنجیر: ج - ح - خ - د',
      arabicPhrase: 'ج ح خ د',
      words: ['ج', 'ح', 'خ', 'د'],
      letterNameArabic: 'جِيمْ حَاءْ خَاءْ دَالْ',
      tajweedRuleTitle: 'شجریہ، حلقی و نطعی حروف کی ترتیب',
    },
    {
      id: 'muf-seq-3',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۳: ذال تا سین',
      title: 'زنجیر: ذ - ر - ز - س',
      arabicPhrase: 'ذ ر ز س',
      words: ['ذ', 'ر', 'ز', 'س'],
      letterNameArabic: 'ذَالْ رَاءْ زَاءْ سِيْنْ',
      tajweedRuleTitle: 'لثویہ، ذلق اور صفیر (سیٹی) کی ترتیب',
    },
    {
      id: 'muf-seq-4',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۴: شین تا طا',
      title: 'زنجیر: ش - ص - ض - ط',
      arabicPhrase: 'ش ص ض ط',
      words: ['ش', 'ص', 'ض', 'ط'],
      letterNameArabic: 'شِيْنْ صَادْ ضَادْ طَاءْ',
      tajweedRuleTitle: 'تفشی اور حروفِ مستعلیہ (پُر حروف) کی ترتیب',
      isHeavyLetterIncluded: true,
    },
    {
      id: 'muf-seq-5',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۵: ظا تا فا',
      title: 'زنجیر: ظ - ع - غ - ف',
      arabicPhrase: 'ظ ع غ ف',
      words: ['ظ', 'ع', 'غ', 'ف'],
      letterNameArabic: 'ظَاءْ عَيْنْ غَيْنْ فَاءْ',
      tajweedRuleTitle: 'پُر، حلقی اور شفوی حروف کی ترتیب',
      isHeavyLetterIncluded: true,
    },
    {
      id: 'muf-seq-6',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۶: قاف تا میم',
      title: 'زنجیر: ق - ك - ل - م',
      arabicPhrase: 'ق ك ل م',
      words: ['ق', 'ك', 'ل', 'م'],
      letterNameArabic: 'قَافْ كَافْ لَامْ مِيمْ',
      tajweedRuleTitle: 'لہویہ، ذلق اور شفوی حروف کی ترتیب',
      isHeavyLetterIncluded: true,
    },
    {
      id: 'muf-seq-7',
      category: 'chains',
      categoryLabelUrdu: 'زنجیر ۷: نون تا یا',
      title: 'زنجیر: ن - و - ه - ء - ي',
      arabicPhrase: 'ن و ه ء ي',
      words: ['ن', 'و', 'ه', 'ء', 'ي'],
      letterNameArabic: 'نُوْنْ وَاوْ هَاءْ هَمْزَة يَاءْ',
      tajweedRuleTitle: 'آخری حروفِ تہجی کی مکمل زنجیر',
    },

    // TAJWEED GROUPS
    {
      id: 'muf-grp-heavy',
      category: 'heavy',
      categoryLabelUrdu: 'حروفِ مستعلیہ (۷ پُر حروف)',
      title: 'مجموعہ: خُصَّ ضَغْطٍ قِظْ',
      arabicPhrase: 'خ ص ض ط ظ غ ق',
      words: ['خ', 'ص', 'ض', 'ط', 'ظ', 'غ', 'ق'],
      letterNameArabic: 'خَاءْ صَادْ ضَادْ طَاءْ ظَاءْ غَيْنْ قَافْ',
      tajweedRuleTitle: '۷ حروفِ مستعلیہ ہمیشہ پُر (موٹے) پڑھے جاتے ہیں',
      isHeavyLetterIncluded: true,
    },
    {
      id: 'muf-grp-qalqalah',
      category: 'qalqalah',
      categoryLabelUrdu: 'حروفِ قلقلہ (۵ ہلنے والے حروف)',
      title: 'مجموعہ: قُطْبُ جَدٍّ',
      arabicPhrase: 'ق ط ب ج د',
      words: ['ق', 'ط', 'ب', 'ج', 'د'],
      letterNameArabic: 'قَافْ طَاءْ بَاءْ جِيمْ دَالْ',
      tajweedRuleTitle: '۵ حروفِ قلقلہ پر سکون کی حالت میں ٹکر لگ کر آواز لوٹتی ہے',
      isQalqalah: true,
    },
    {
      id: 'muf-grp-halqi',
      category: 'halqi',
      categoryLabelUrdu: 'حروفِ حلقی (۶ گلے کے حروف)',
      title: 'حروفِ حلقی: ء - ه - ع - ح - غ - خ',
      arabicPhrase: 'ء ه ع ح غ خ',
      words: ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'],
      letterNameArabic: 'هَمْزَة هَاءْ عَيْنْ حَاءْ غَيْنْ خَاءْ',
      tajweedRuleTitle: 'حلق کے ۳ حصوں (اقصی، وسط، ادنی) سے نکلنے والے ۶ حروف',
    },
    {
      id: 'muf-grp-shafawi',
      category: 'shafawi',
      categoryLabelUrdu: 'حروفِ شفویہ (۴ ہونٹوں کے حروف)',
      title: 'حروفِ شفویہ: ب - م - و - ف',
      arabicPhrase: 'ب م و ف',
      words: ['ب', 'م', 'و', 'ف'],
      letterNameArabic: 'بَاءْ مِيمْ وَاوْ فَاءْ',
      tajweedRuleTitle: 'دونوں ہونٹوں سے ادا ہونے والے ۴ حروف',
    },
  ], []);

  const filteredMufradatItems = useMemo(() => {
    if (mufradatCategory === 'all') return MUFRADAT_ITEMS.filter((i) => i.category === 'all');
    if (mufradatCategory === 'chains') return MUFRADAT_ITEMS.filter((i) => i.category === 'chains');
    if (mufradatCategory === 'heavy') return MUFRADAT_ITEMS.filter((i) => i.category === 'heavy' || (i.category === 'all' && i.isHeavy));
    if (mufradatCategory === 'qalqalah') return MUFRADAT_ITEMS.filter((i) => i.category === 'qalqalah' || (i.category === 'all' && i.isQalqalah));
    if (mufradatCategory === 'halqi') return MUFRADAT_ITEMS.filter((i) => i.category === 'halqi' || (i.category === 'all' && (i.tajweedRuleTitle?.includes('حلقی') || ['ء','ه','ع','ح','غ','خ'].includes(i.arabicPhrase))));
    if (mufradatCategory === 'shafawi') return MUFRADAT_ITEMS.filter((i) => i.category === 'shafawi' || (i.category === 'all' && (i.tajweedRuleTitle?.includes('شفوی') || ['ب','م','و','ف'].includes(i.arabicPhrase))));
    return MUFRADAT_ITEMS;
  }, [MUFRADAT_ITEMS, mufradatCategory]);

  const currentMufradatItem = filteredMufradatItems[mufradatIndex] || filteredMufradatItems[0] || MUFRADAT_ITEMS[0];

  // =========================================================================
  // 1. MUTAHARRIKAT PUZZLE DATA & STATE (متحرکات: زبر، زیر، پیش)
  // =========================================================================
  const [mutaharrikatCategory, setMutaharrikatCategory] = useState<'all' | 'zabar' | 'zer' | 'pesh' | 'extra'>('all');
  const [mutaharrikatIndex, setMutaharrikatIndex] = useState(0);
  const [mutaharrikatSlots, setMutaharrikatSlots] = useState<(string | null)[]>([]);
  const [mutaharrikatTileBank, setMutaharrikatTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [mutaharrikatSelectedId, setMutaharrikatSelectedId] = useState<string | null>(null);
  const [mutaharrikatCompleted, setMutaharrikatCompleted] = useState(false);

  const MUTAHARRIKAT_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return ALL_MUTAHARRIKAT_WORDS.map((item, idx) => ({
      id: `mut-${item.id || idx}`,
      category: item.category || (item.pageNumber === 10 || item.pageNumber === 11 ? 'extra' : 'zabar'),
      categoryLabelUrdu: item.categoryLabelUrdu || 'مشقِ متحرکات',
      title: `${item.categoryLabelUrdu || 'متحرک کلمہ'}: ${item.word}`,
      arabicPhrase: item.word,
      words: item.letters && item.letters.length > 0 ? item.letters : item.word.split(''),
      breakdown: item.breakdown,
      spellingHijja: item.spellingHijja,
      isHeavyLetterIncluded: item.isHeavyLetterIncluded,
    }));
  }, []);

  const filteredMutaharrikatItems = useMemo(() => {
    if (mutaharrikatCategory === 'all') return MUTAHARRIKAT_ITEMS;
    return MUTAHARRIKAT_ITEMS.filter((item) => item.category === mutaharrikatCategory);
  }, [MUTAHARRIKAT_ITEMS, mutaharrikatCategory]);

  const currentMutaharrikItem = filteredMutaharrikatItems[mutaharrikatIndex] || filteredMutaharrikatItems[0] || MUTAHARRIKAT_ITEMS[0];

  // =========================================================================
  // 2. SUKOON & QALQALAH PUZZLE DATA & STATE (سکون و جزم و قلقلہ)
  // =========================================================================
  const [sukoonCategory, setSukoonCategory] = useState<'all' | 'page1' | 'page2' | 'qalqalah' | 'hamzah'>('all');
  const [sukoonIndex, setSukoonIndex] = useState(0);
  const [sukoonSlots, setSukoonSlots] = useState<(string | null)[]>([]);
  const [sukoonTileBank, setSukoonTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [sukoonSelectedId, setSukoonSelectedId] = useState<string | null>(null);
  const [sukoonCompleted, setSukoonCompleted] = useState(false);

  const SUKOON_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return ALL_SUKOON_MASHQ_WORDS.map((item, idx) => {
      let cat = item.mashqPage === 1 ? 'page1' : 'page2';
      if (item.isQalqalah) cat = 'qalqalah';
      if (item.isHamzahSakinah) cat = 'hamzah';

      return {
        id: `suk-${item.id || idx}`,
        category: cat,
        categoryLabelUrdu: item.isQalqalah
          ? 'مشقِ قلقلہ'
          : item.isHamzahSakinah
          ? 'مشقِ ہمزہ ساکنہ'
          : item.categoryLabelUrdu || 'مشقِ سکون و جزم',
        title: `${item.isQalqalah ? 'حرفِ قلقلہ' : 'ساکن کلمہ'}: ${item.word}`,
        arabicPhrase: item.word,
        words: item.letters && item.letters.length > 0 ? item.letters : [item.word],
        breakdown: item.breakdown,
        spellingHijja: item.spellingHijja,
        tajweedRuleTitle: item.tajweedRuleTitle,
        isQalqalah: item.isQalqalah,
        isHamzahSakinah: item.isHamzahSakinah,
        isHeavyLetterIncluded: item.isHeavyLetterIncluded,
      };
    });
  }, []);

  const filteredSukoonItems = useMemo(() => {
    if (sukoonCategory === 'all') return SUKOON_ITEMS;
    if (sukoonCategory === 'qalqalah') return SUKOON_ITEMS.filter((i) => i.isQalqalah);
    if (sukoonCategory === 'hamzah') return SUKOON_ITEMS.filter((i) => i.isHamzahSakinah);
    if (sukoonCategory === 'page1') return SUKOON_ITEMS.filter((i) => i.words.length === 2 && !i.isQalqalah && !i.isHamzahSakinah);
    if (sukoonCategory === 'page2') return SUKOON_ITEMS.filter((i) => i.words.length >= 3);
    return SUKOON_ITEMS;
  }, [SUKOON_ITEMS, sukoonCategory]);

  const currentSukoonItem = filteredSukoonItems[sukoonIndex] || filteredSukoonItems[0] || SUKOON_ITEMS[0];

  // =========================================================================
  // 3. MURAKKABAT PUZZLE DATA & STATE (مرکبات و حروف)
  // =========================================================================
  const [murakkabatCategory, setMurakkabatCategory] = useState<'all' | '2-letter' | '3-letter' | 'muqattaat'>('all');
  const [murakkabatIndex, setMurakkabatIndex] = useState(0);
  const [murakkabatSlots, setMurakkabatSlots] = useState<(string | null)[]>([]);
  const [murakkabatTileBank, setMurakkabatTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [murakkabatSelectedId, setMurakkabatSelectedId] = useState<string | null>(null);
  const [murakkabatCompleted, setMurakkabatCompleted] = useState(false);

  const MURAKKABAT_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    const baseList: GenericPuzzleItem[] = [
      // 2-LETTER MURAKKABAT
      { id: 'l2-1', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: لَامْ أَلِفْ', arabicPhrase: 'لَا', words: ['ل', 'ا'] },
      { id: 'l2-2', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: بَاءْ أَلِفْ', arabicPhrase: 'بَا', words: ['ب', 'ا'] },
      { id: 'l2-3', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: تَاءْ أَلِفْ', arabicPhrase: 'تَا', words: ['ت', 'ا'] },
      { id: 'l2-4', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: ثَاءْ أَلِفْ', arabicPhrase: 'ثَا', words: ['ث', 'ا'] },
      { id: 'l2-5', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: نُوْنْ أَلِفْ', arabicPhrase: 'نَا', words: ['ن', 'ا'] },
      { id: 'l2-6', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: يَاءْ أَلِفْ', arabicPhrase: 'يَا', words: ['ي', 'ا'] },
      { id: 'l2-7', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: سِينْ أَلِفْ', arabicPhrase: 'سَا', words: ['س', 'ا'] },
      { id: 'l2-8', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: شِينْ أَلِفْ', arabicPhrase: 'شَا', words: ['ش', 'ا'] },
      { id: 'l2-9', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: صَادْ أَلِفْ', arabicPhrase: 'صَا', words: ['ص', 'ا'] },
      { id: 'l2-10', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: ضَادْ أَلِفْ', arabicPhrase: 'ضَا', words: ['ض', 'ا'] },
      { id: 'l2-11', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: طَاءْ أَلِفْ', arabicPhrase: 'طَا', words: ['ط', 'ا'] },
      { id: 'l2-12', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: ظَاءْ أَلِفْ', arabicPhrase: 'ظَا', words: ['ظ', 'ا'] },
      { id: 'l2-13', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: عَيْنْ أَلِفْ', arabicPhrase: 'عَا', words: ['ع', 'ا'] },
      { id: 'l2-14', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: غَيْنْ أَلِفْ', arabicPhrase: 'غَا', words: ['غ', 'ا'] },
      { id: 'l2-15', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: فَاءْ أَلِفْ', arabicPhrase: 'فَا', words: ['ف', 'ا'] },
      { id: 'l2-16', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: قَافْ أَلِفْ', arabicPhrase: 'قَا', words: ['ق', 'ا'] },
      { id: 'l2-17', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: كَافْ أَلِفْ', arabicPhrase: 'كَا', words: ['ك', 'ا'] },
      { id: 'l2-18', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: مِيمْ أَلِفْ', arabicPhrase: 'مَا', words: ['م', 'ا'] },
      { id: 'l2-19', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: هَاءْ أَلِفْ', arabicPhrase: 'هَا', words: ['ه', 'ا'] },
      { id: 'l2-20', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: بَاءْ لَامْ', arabicPhrase: 'بَلْ', words: ['ب', 'ل'] },
      { id: 'l2-21', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: تَاءْ لَامْ', arabicPhrase: 'تَلْ', words: ['ت', 'ل'] },
      { id: 'l2-22', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: كَافْ بَاءْ', arabicPhrase: 'كَبْ', words: ['ك', 'ب'] },
      { id: 'l2-23', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: بَاءْ حَاءْ', arabicPhrase: 'بَحْ', words: ['ب', 'ح'] },
      { id: 'l2-24', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: يَاءْ سِينْ', arabicPhrase: 'يَسْ', words: ['ي', 'س'] },
      { id: 'l2-25', category: '2-letter', categoryLabelUrdu: '۲ حرفی مرکب', title: '۲ حرفی مرکب: صَادْ بَاءْ', arabicPhrase: 'صَبْ', words: ['ص', 'ب'] },

      // HUROOF-E-MUQATTA'AT
      { id: 'l2-m1', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: الٓمٓ', arabicPhrase: 'الٓمٓ', words: ['ا', 'ل', 'م'] },
      { id: 'l2-m2', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: طٰهٰ', arabicPhrase: 'طٰهٰ', words: ['ط', 'ه'] },
      { id: 'l2-m3', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: یٰسٓ', arabicPhrase: 'یٰسٓ', words: ['ي', 'س'] },
      { id: 'l2-m4', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: حٰمٓ', arabicPhrase: 'حٰمٓ', words: ['ح', 'م'] },
      { id: 'l2-m5', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: الٓرٰ', arabicPhrase: 'الٓرٰ', words: ['ا', 'ل', 'ر'] },
      { id: 'l2-m6', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: طٰسٰمٓ', arabicPhrase: 'طٰسٰمٓ', words: ['ط', 'س', 'م'] },
      { id: 'l2-m7', category: 'muqattaat', categoryLabelUrdu: 'حروفِ مقطعات', title: 'حروفِ مقطعات: كٓهيعٓصٓ', arabicPhrase: 'كٓهيعٓصٓ', words: ['ك', 'ه', 'ي', 'ع', 'ص'] },

      // 3-LETTER MURAKKABAT
      { id: 'l2-30', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: قَتَلَ', arabicPhrase: 'قَتَلَ', words: ['ق', 'ت', 'ل'] },
      { id: 'l2-31', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: نَصَرَ', arabicPhrase: 'نَصَرَ', words: ['ن', 'ص', 'ر'] },
      { id: 'l2-32', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: خَلَقَ', arabicPhrase: 'خَلَقَ', words: ['خ', 'ل', 'ق'] },
      { id: 'l2-33', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: جَعَلَ', arabicPhrase: 'جَعَلَ', words: ['ج', 'ع', 'ل'] },
      { id: 'l2-34', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: كَتَبَ', arabicPhrase: 'كَتَبَ', words: ['ك', 'ت', 'ب'] },
      { id: 'l2-35', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: ضَرَبَ', arabicPhrase: 'ضَرَبَ', words: ['ض', 'ر', 'ب'] },
      { id: 'l2-36', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: عَلِمَ', arabicPhrase: 'عَلِمَ', words: ['ع', 'ل', 'م'] },
      { id: 'l2-37', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: أَحَدٌ', arabicPhrase: 'أَحَدٌ', words: ['أ', 'ح', 'د'] },
      { id: 'l2-38', category: '3-letter', categoryLabelUrdu: '۳ حرفی مرکب', title: '۳ حرفی مرکب: صَمَدٌ', arabicPhrase: 'صَمَدٌ', words: ['ص', 'م', 'د'] },
    ];

    // Append Qaida Page 1 & 2 exercises
    PAGE_1_EXERCISE.forEach((item, idx) => {
      baseList.push({
        id: `p1-mashq-${idx}`,
        category: '2-letter',
        categoryLabelUrdu: 'مشق ۱: دو حرفی',
        title: `مشق مرکب: ${item.name}`,
        arabicPhrase: item.compound,
        words: item.letters,
      });
    });

    PAGE_2_EXERCISE.forEach((item, idx) => {
      baseList.push({
        id: `p2-mashq-${idx}`,
        category: item.category === 'sentence' ? '3-letter' : item.category === '2-letter' ? '2-letter' : '3-letter',
        categoryLabelUrdu: 'مشق ۲: کلمات',
        title: `مشق کلمہ: ${item.name}`,
        arabicPhrase: item.compound,
        words: item.letters,
      });
    });

    return baseList;
  }, []);

  const filteredMurakkabatItems = useMemo(() => {
    if (murakkabatCategory === 'all') return MURAKKABAT_ITEMS;
    return MURAKKABAT_ITEMS.filter((item) => item.category === murakkabatCategory);
  }, [MURAKKABAT_ITEMS, murakkabatCategory]);

  const currentMurakkabItem = filteredMurakkabatItems[murakkabatIndex] || filteredMurakkabatItems[0] || MURAKKABAT_ITEMS[0];

  // =========================================================================
  // 4. HUROOF LEEN PUZZLE DATA & STATE (سبق نمبر ۵: حروفِ لین - واؤ لین و یاء لین)
  // =========================================================================
  const [leenCategory, setLeenCategory] = useState<'all' | 'waw' | 'yaa' | 'pairs' | 'heavy'>('all');
  const [leenIndex, setLeenIndex] = useState(0);
  const [leenSlots, setLeenSlots] = useState<(string | null)[]>([]);
  const [leenTileBank, setLeenTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [leenSelectedId, setLeenSelectedId] = useState<string | null>(null);
  const [leenCompleted, setLeenCompleted] = useState(false);

  const LEEN_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    const list: GenericPuzzleItem[] = [];

    // A) Waw Leen Words (35 words)
    PAGE_14_WAW_LEEN_WORDS.forEach((item) => {
      const parts = item.breakdown.split(' + ').map((s) => s.trim()).filter(Boolean);
      list.push({
        id: `leen-waw-${item.id}`,
        category: 'waw',
        categoryLabelUrdu: item.categoryLabelUrdu || 'مشق واؤ لین',
        title: `مشق واؤ لین: ${item.word}`,
        arabicPhrase: item.word,
        words: parts.length > 0 ? parts : [item.word],
        breakdown: item.breakdown,
        spellingHijja: item.spellingHijja,
        tajweedRuleTitle: item.isHeavyLetterIncluded
          ? 'حرفِ مستعلیہ مع واؤ لین (پُر آواز)'
          : 'واؤ لین نرمی و بغیر کھینچے معروف ادا کریں',
        isHeavyLetterIncluded: item.isHeavyLetterIncluded,
      });
    });

    // B) Yaa Leen Words (35 words)
    PAGE_15_YAA_LEEN_WORDS.forEach((item) => {
      const parts = item.breakdown.split(' + ').map((s) => s.trim()).filter(Boolean);
      list.push({
        id: `leen-yaa-${item.id}`,
        category: 'yaa',
        categoryLabelUrdu: item.categoryLabelUrdu || 'مشق یاء لین',
        title: `مشق یاء لین: ${item.word}`,
        arabicPhrase: item.word,
        words: parts.length > 0 ? parts : [item.word],
        breakdown: item.breakdown,
        spellingHijja: item.spellingHijja,
        tajweedRuleTitle: item.hasBothLeen
          ? 'واؤ لین اور یاء لین دونوں شامل ہیں'
          : item.isHeavyLetterIncluded
          ? 'حرفِ مستعلیہ مع یاء لین (پُر آواز)'
          : 'یاء لین نرمی و بغیر کھینچے معروف ادا کریں',
        isHeavyLetterIncluded: item.isHeavyLetterIncluded,
      });
    });

    // C) 29 Unified Pairs (اَوْ ، اَيْ ... يَوْ ، يَيْ)
    UNIFIED_HUROOF_LEEN_PAIRS.forEach((pair) => {
      list.push({
        id: `leen-pair-${pair.id}`,
        category: 'pairs',
        categoryLabelUrdu: 'جوڑی حروفِ لین',
        title: `جوڑی: ${pair.wawCard.displayLetter} و ${pair.yaaCard.displayLetter} (${pair.baseLetterName})`,
        arabicPhrase: pair.combinedSound,
        words: [pair.wawCard.displayLetter, pair.yaaCard.displayLetter],
        breakdown: `${pair.wawCard.displayLetter} + ${pair.yaaCard.displayLetter}`,
        spellingHijja: pair.combinedHijja,
        tajweedRuleTitle: pair.isHeavy ? 'حرفِ مستعلیہ مع لین (پُر پڑھیں)' : 'حروفِ لین معروف و بغیر کھینچے',
        isHeavyLetterIncluded: pair.isHeavy,
      });
    });

    return list;
  }, []);

  const filteredLeenItems = useMemo(() => {
    if (leenCategory === 'all') return LEEN_ITEMS;
    if (leenCategory === 'waw') return LEEN_ITEMS.filter((i) => i.category === 'waw');
    if (leenCategory === 'yaa') return LEEN_ITEMS.filter((i) => i.category === 'yaa');
    if (leenCategory === 'pairs') return LEEN_ITEMS.filter((i) => i.category === 'pairs');
    if (leenCategory === 'heavy') return LEEN_ITEMS.filter((i) => i.isHeavyLetterIncluded);
    return LEEN_ITEMS;
  }, [LEEN_ITEMS, leenCategory]);

  const currentLeenItem = filteredLeenItems[leenIndex] || filteredLeenItems[0] || LEEN_ITEMS[0];

  // =========================================================================
  // 5. HUROOF MADDAH PUZZLE DATA & STATE (حروفِ مدہ: الف، واؤ، یاء مدہ)
  // =========================================================================
  const [maddahCategory, setMaddahCategory] = useState<'all' | 'alif' | 'waw' | 'yaa' | 'triplets' | 'words' | 'heavy'>('all');
  const [maddahIndex, setMaddahIndex] = useState(0);
  const [maddahSlots, setMaddahSlots] = useState<(string | null)[]>([]);
  const [maddahTileBank, setMaddahTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [maddahSelectedId, setMaddahSelectedId] = useState<string | null>(null);
  const [maddahCompleted, setMaddahCompleted] = useState(false);

  const MADDAH_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    const list: GenericPuzzleItem[] = [];

    // A) 28 TRIPLETS (بَا ، بُوْ ، بِيْ ...)
    SABAQ_7_TRIPLETS.forEach((t) => {
      list.push({
        id: `mad-triplet-${t.id}`,
        category: 'triplets',
        categoryLabelUrdu: 'حروفِ مدہ ثلاثی',
        title: `ثلاثی جوڑی: ${t.alifCell.arabicText} ، ${t.wawCell.arabicText} ، ${t.yaaCell.arabicText} (${t.baseLetterName})`,
        arabicPhrase: t.tripletRaw,
        words: [t.alifCell.arabicText, t.wawCell.arabicText, t.yaaCell.arabicText],
        breakdown: `${t.alifCell.arabicText} + ${t.wawCell.arabicText} + ${t.yaaCell.arabicText}`,
        spellingHijja: t.tripletHijja,
        tajweedRuleTitle: t.isHeavy ? 'حرفِ مستعلیہ مع حروفِ مدہ (پُر پڑھیں)' : 'تینوں مدات برابر ۱، ۱ الف کھینچیں',
        isHeavyLetterIncluded: t.isHeavy,
      });
    });

    // B) SINGLE MADDAH CELLS (84 Items: 28 Alif, 28 Waw, 28 Yaa)
    SABAQ_7_ALL_84_CELLS.forEach((cell) => {
      const typeLabel = cell.maddahType === 'alif' ? 'الف مدہ' : cell.maddahType === 'waw' ? 'واؤ مدہ' : 'یاء مدہ';
      let parts: string[] = [];
      if (cell.maddahType === 'alif') {
        const baseWithoutAlif = cell.arabicText.replace('ا', '').replace('ءَا', 'ءَ');
        parts = [baseWithoutAlif || cell.arabicText[0] || 'بَ', 'ا'];
      } else if (cell.maddahType === 'waw') {
        parts = [cell.baseLetterName ? `${cell.baseLetterName[0]}ُ` : cell.arabicText.slice(0, 2), 'وْ'];
      } else {
        parts = [cell.baseLetterName ? `${cell.baseLetterName[0]}ِ` : cell.arabicText.slice(0, 2), 'يْ'];
      }

      list.push({
        id: `mad-cell-${cell.id}`,
        category: cell.maddahType,
        categoryLabelUrdu: typeLabel,
        title: `${typeLabel}: ${cell.arabicText} (${cell.baseLetterName})`,
        arabicPhrase: cell.arabicText,
        words: parts,
        breakdown: `${parts.join(' + ')} = ${cell.arabicText}`,
        spellingHijja: cell.hijjaSpelling,
        tajweedRuleTitle: `${typeLabel} - ۱ الف (۲ حرکات) کھینچ کر پڑھیں۔${cell.isHeavy ? ' (پُر حرف)' : ''}`,
        isHeavyLetterIncluded: cell.isHeavy,
      });
    });

    // C) 85 QURANIC MASHQ WORDS (Pages 16, 17, 18)
    ALL_MADDAH_MASHQ_WORDS.forEach((w) => {
      let wordParts: string[] = [];
      if (w.word === 'بَابَ') wordParts = ['بَا', 'بَ'];
      else if (w.word === 'كَانَ') wordParts = ['كَانَ'.slice(0, 3), 'نَ'];
      else if (w.word === 'عَادَ') wordParts = ['عَا', 'دَ'];
      else if (w.word === 'فَازَ') wordParts = ['فَا', 'زَ'];
      else if (w.word === 'زَادَ') wordParts = ['زَا', 'دَ'];
      else if (w.word === 'قَالَ') wordParts = ['قَا', 'لَ'];
      else if (w.word === 'تَابَا') wordParts = ['تَا', 'بَا'];
      else if (w.word === 'خَابَ') wordParts = ['خَا', 'بَ'];
      else if (w.word === 'صَابِرِينَ') wordParts = ['صَا', 'بِ', 'رِي', 'نَ'];
      else if (w.word === 'خَالِدُونَ') wordParts = ['خَا', 'لِ', 'دُو', 'نَ'];
      else if (w.word === 'يَقُولُ') wordParts = ['يَ', 'قُو', 'لُ'];
      else if (w.word === 'تُوبُوا') wordParts = ['تُو', 'بُو', 'ا'];
      else if (w.word === 'نُورُ') wordParts = ['نُو', 'رُ'];
      else if (w.word === 'طُورِ') wordParts = ['طُو', 'رِ'];
      else if (w.word === 'يَمُوتُ') wordParts = ['يَ', 'مُو', 'تُ'];
      else if (w.word === 'قَالُوا') wordParts = ['قَا', 'لُو', 'ا'];
      else if (w.word === 'فِيهِ') wordParts = ['فِي', 'هِ'];
      else if (w.word === 'دِينِ') wordParts = ['دِي', 'نِ'];
      else if (w.word === 'قِيلَ') wordParts = ['قِي', 'لَ'];
      else if (w.word === 'رَحِيمِ') wordParts = ['رَ', 'حِي', 'مِ'];
      else if (w.word === 'عَلِيمٌ') wordParts = ['عَ', 'لِي', 'مٌ'];
      else if (w.word === 'بَصِيرٌ') wordParts = ['بَ', 'صِي', 'رٌ'];
      else if (w.word === 'نُوحِيهَا') wordParts = ['نُو', 'حِي', 'هَا'];
      else if (w.word === 'أُوذِينَا') wordParts = ['أُو', 'ذِي', 'نَا'];
      else if (w.word === 'يُقِيمُونَ') wordParts = ['يُ', 'قِي', 'مُو', 'نَ'];
      else {
        const hijjaParts = w.hijjaText.split('=')[0]?.split('،') || [];
        if (hijjaParts.length >= 2) {
          wordParts = hijjaParts.map((p) => p.trim().split(' ').pop() || p.trim()).filter(Boolean);
        } else {
          wordParts = [w.word];
        }
      }

      const catName = w.maddahType === 'alif' ? 'alif' : w.maddahType === 'waw' ? 'waw' : w.maddahType === 'yaa' ? 'yaa' : 'words';

      list.push({
        id: `mad-word-${w.id}`,
        category: 'words',
        categoryLabelUrdu: `مشقِ مدہ`,
        title: `قرآنی کلمہ: ${w.word}`,
        arabicPhrase: w.word,
        words: wordParts.length > 0 ? wordParts : [w.word],
        breakdown: w.hijjaText.split('=')[0]?.trim() || w.word,
        spellingHijja: w.hijjaText,
        tajweedRuleTitle: w.tajweedNotes || 'حروفِ مدہ کو ۱ الف کھینچ کر اور حرکات کو بغیر کھینچے پڑھیں',
        isHeavyLetterIncluded: w.isHeavy,
      });
    });

    return list;
  }, []);

  const filteredMaddahItems = useMemo(() => {
    if (maddahCategory === 'all') return MADDAH_ITEMS;
    if (maddahCategory === 'alif') return MADDAH_ITEMS.filter((i) => i.category === 'alif' || (i.category === 'words' && i.title.includes('الِف مَدَّہ')));
    if (maddahCategory === 'waw') return MADDAH_ITEMS.filter((i) => i.category === 'waw' || (i.category === 'words' && i.title.includes('وَاو مَدَّہ')));
    if (maddahCategory === 'yaa') return MADDAH_ITEMS.filter((i) => i.category === 'yaa' || (i.category === 'words' && i.title.includes('یَاء مَدَّہ')));
    if (maddahCategory === 'triplets') return MADDAH_ITEMS.filter((i) => i.category === 'triplets');
    if (maddahCategory === 'words') return MADDAH_ITEMS.filter((i) => i.category === 'words');
    if (maddahCategory === 'heavy') return MADDAH_ITEMS.filter((i) => i.isHeavyLetterIncluded);
    return MADDAH_ITEMS;
  }, [MADDAH_ITEMS, maddahCategory]);

  const currentMaddahItem = filteredMaddahItems[maddahIndex] || filteredMaddahItems[0] || MADDAH_ITEMS[0];

  // =========================================================================
  // 4B. KHARI HARAKAT PUZZLES DATA & STATE (سبق ۷: کھڑی حرکات)
  // =========================================================================
  const [khariHarakatCategory, setKhariHarakatCategory] = useState<
    'all' | 'khara_zabar' | 'khara_zer' | 'ulta_pesh' | 'triplets' | 'words' | 'heavy'
  >('all');
  const [khariHarakatIndex, setKhariHarakatIndex] = useState(0);
  const [khariHarakatSlots, setKhariHarakatSlots] = useState<(string | null)[]>([]);
  const [khariHarakatTileBank, setKhariHarakatTileBank] = useState<
    { id: string; text: string; isUsed: boolean }[]
  >([]);
  const [khariHarakatSelectedId, setKhariHarakatSelectedId] = useState<string | null>(null);
  const [khariHarakatCompleted, setKhariHarakatCompleted] = useState(false);

  const KHARI_HARAKAT_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    const list: GenericPuzzleItem[] = [];

    // A) 28 TRIPLETS (e.g. بٰ ، بٖ ، بٗ)
    SABAQ_7_KHARI_TRIPLETS.forEach((t) => {
      list.push({
        id: `khari-triplet-${t.id}`,
        category: 'triplets',
        categoryLabelUrdu: 'کھڑی حرکات ثلاثی ترتیب',
        title: `ثلاثی: ${t.baseLetterName} (${t.tripletRaw})`,
        arabicPhrase: t.tripletRaw,
        words: [t.kharaZabarCell.displaySymbol, t.kharaZerCell.displaySymbol, t.ultaPeshCell.displaySymbol],
        breakdown: `${t.kharaZabarCell.displaySymbol} + ${t.kharaZerCell.displaySymbol} + ${t.ultaPeshCell.displaySymbol}`,
        spellingHijja: t.tripletHijja,
        tajweedRuleTitle: `کھڑی حرکات کو ۱ الف (۲ حرکات) کھینچ کر پڑھیں۔${t.isHeavy ? ' (پُر حرف)' : ''}`,
        isHeavyLetterIncluded: t.isHeavy,
      });
    });

    // B) ALL 45+ QURANIC MASHQ WORDS
    ALL_KHARI_HARAKAT_MASHQ_WORDS.forEach((w) => {
      const catKey = w.category === 'khara_zabar' ? 'khara_zabar' : w.category === 'khara_zer' ? 'khara_zer' : w.category === 'ulta_pesh' ? 'ulta_pesh' : 'words';
      const parts = w.syllableBreakdown && w.syllableBreakdown.length > 0 ? w.syllableBreakdown : [w.word];

      list.push({
        id: `khari-word-${w.id}`,
        category: catKey,
        categoryLabelUrdu: `مشقِ کھڑی حرکات`,
        title: `قرآنی کلمہ: ${w.word}`,
        arabicPhrase: w.word,
        words: parts,
        breakdown: parts.join(' + '),
        spellingHijja: w.hijjaText,
        tajweedRuleTitle: w.tajweedNotes || 'کھڑی حرکات کو ۱ الف کھینچ کر اور حرکات کو بغیر کھینچے پڑھیں',
        isHeavyLetterIncluded: !!w.isHeavy,
      });
    });

    return list;
  }, []);

  const filteredKhariItems = useMemo(() => {
    if (khariHarakatCategory === 'all') return KHARI_HARAKAT_ITEMS;
    if (khariHarakatCategory === 'khara_zabar') return KHARI_HARAKAT_ITEMS.filter((i) => i.category === 'khara_zabar');
    if (khariHarakatCategory === 'khara_zer') return KHARI_HARAKAT_ITEMS.filter((i) => i.category === 'khara_zer');
    if (khariHarakatCategory === 'ulta_pesh') return KHARI_HARAKAT_ITEMS.filter((i) => i.category === 'ulta_pesh');
    if (khariHarakatCategory === 'triplets') return KHARI_HARAKAT_ITEMS.filter((i) => i.category === 'triplets');
    if (khariHarakatCategory === 'words') return KHARI_HARAKAT_ITEMS.filter((i) => i.category !== 'triplets');
    if (khariHarakatCategory === 'heavy') return KHARI_HARAKAT_ITEMS.filter((i) => i.isHeavyLetterIncluded);
    return KHARI_HARAKAT_ITEMS;
  }, [KHARI_HARAKAT_ITEMS, khariHarakatCategory]);

  const currentKhariItem = filteredKhariItems[khariHarakatIndex] || filteredKhariItems[0] || KHARI_HARAKAT_ITEMS[0];

  // =========================================================================
  // 5. SURAH PUZZLES DATA & STATE (۳۰ واں پارہ و الفاتحہ)
  // =========================================================================
  const [surahIndex, setSurahIndex] = useState(0);
  const [surahSlots, setSurahSlots] = useState<(string | null)[]>([]);
  const [surahTileBank, setSurahTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [surahSelectedId, setSurahSelectedId] = useState<string | null>(null);
  const [surahCompleted, setSurahCompleted] = useState(false);

  const currentSurah = SURAH_PUZZLES[surahIndex] || SURAH_PUZZLES[0];

  // =========================================================================
  // AUDIO & SPEECH HELPER
  // =========================================================================

  // =========================================================================
  // 6B. TANWEEN PUZZLE DATA & STATE (سبق ۸: تنوین - دو زبر، دو زیر، دو پیش)
  // =========================================================================
  const [tanweenIndex, setTanweenIndex] = useState(0);
  const [tanweenSlots, setTanweenSlots] = useState<(string | null)[]>([]);
  const [tanweenTileBank, setTanweenTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [tanweenSelectedId, setTanweenSelectedId] = useState<string | null>(null);
  const [tanweenCompleted, setTanweenCompleted] = useState(false);

  const TANWEEN_ITEMS: GenericPuzzleItem[] = useMemo(() => [
    { id: 'tan-1', category: 'triplet', categoryLabelUrdu: 'ثلاثی تنوین', title: 'بً بٍ بٌ', arabicPhrase: 'بً بٍ بٌ', words: ['بً', 'بٍ', 'بٌ'] },
    { id: 'tan-2', category: 'triplet', categoryLabelUrdu: 'ثلاثی تنوین', title: 'تً تٍ تٌ', arabicPhrase: 'تً تٍ تٌ', words: ['تً', 'تٍ', 'تٌ'] },
    { id: 'tan-3', category: 'triplet', categoryLabelUrdu: 'ثلاثی تنوین', title: 'ثً ثٍ ثٌ', arabicPhrase: 'ثً ثٍ ثٌ', words: ['ثً', 'ثٍ', 'ثٌ'] },
    { id: 'tan-4', category: 'triplet', categoryLabelUrdu: 'ثلاثی تنوین', title: 'جً جٍ جٌ', arabicPhrase: 'جً جٍ جٌ', words: ['جً', 'جٍ', 'جٌ'] },
    { id: 'tan-5', category: 'word', categoryLabelUrdu: 'دو زبر کلمہ', title: 'اَبَدًا', arabicPhrase: 'اَبَدًا', words: ['اَ', 'بَ', 'دًا'] },
    { id: 'tan-6', category: 'word', categoryLabelUrdu: 'دو زبر کلمہ', title: 'خَیْرًا', arabicPhrase: 'خَیْرًا', words: ['خَیْ', 'رًا'] },
    { id: 'tan-7', category: 'word', categoryLabelUrdu: 'دو پیش کلمہ', title: 'کِتٰبٌ', arabicPhrase: 'کِتٰبٌ', words: ['کِ', 'تٰ', 'بٌ'] },
    { id: 'tan-8', category: 'word', categoryLabelUrdu: 'دو زیر کلمہ', title: 'رَسُوْلٍ', arabicPhrase: 'رَسُوْلٍ', words: ['رَ', 'سُوْ', 'لٍ'] },
    { id: 'tan-9', category: 'word', categoryLabelUrdu: 'دو پیش کلمہ', title: 'غَفُوْرٌ', arabicPhrase: 'غَفُوْرٌ', words: ['غَ', 'فُوْ', 'رٌ'] },
    { id: 'tan-10', category: 'word', categoryLabelUrdu: 'دو زبر کلمہ', title: 'رَحِیْمًا', arabicPhrase: 'رَحِیْمًا', words: ['رَ', 'حِیْ', 'مًا'] },
    { id: 'tan-11', category: 'word', categoryLabelUrdu: 'دو پیش کلمہ', title: 'عَذَابٌ', arabicPhrase: 'عَذَابٌ', words: ['عَ', 'ذَا', 'بٌ'] },
    { id: 'tan-12', category: 'word', categoryLabelUrdu: 'دو زیر کلمہ', title: 'قَوْمٍ', arabicPhrase: 'قَوْمٍ', words: ['قَوْ', 'مٍ'] },
    { id: 'tan-13', category: 'word', categoryLabelUrdu: 'دو پیش کلمہ', title: 'مَرَضٌ', arabicPhrase: 'مَرَضٌ', words: ['مَ', 'رَ', 'ضٌ'] },
    { id: 'tan-14', category: 'word', categoryLabelUrdu: 'دو زبر کلمہ', title: 'شَيْئًا', arabicPhrase: 'شَيْئًا', words: ['شَيْ', 'ئًا'] },
    { id: 'tan-15', category: 'word', categoryLabelUrdu: 'دو پیش کلمہ', title: 'سَمِیْعٌ', arabicPhrase: 'سَمِیْعٌ', words: ['سَ', 'مِیْ', 'عٌ'] }
  ], []);

  const currentTanweenItem = TANWEEN_ITEMS[tanweenIndex] || TANWEEN_ITEMS[0];

  const initTanweenPuzzle = () => {
    if (!currentTanweenItem) return;
    setTanweenCompleted(false);
    const correctWords = currentTanweenItem.words;
    setTanweenSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['مً', 'لٍ', 'نٌ', 'دً', 'رٍ', 'سٌ', 'قً', 'كٍ', 'حٌ', 'عً'];
    const distractors = distractorPool.filter(d => !correctWords.includes(d)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());
    
    const tiles = shuffled.map((word, idx) => ({ id: `tanween-${idx}`, text: word, isUsed: false }));
    setTanweenTileBank(tiles);
    setTanweenSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'tanween') initTanweenPuzzle();
  }, [tanweenIndex, activeMode]);

  const handleTanweenTileClick = (tileId: string) => {
    const tile = tanweenTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setTanweenSelectedId(tanweenSelectedId === tileId ? null : tileId);
  };

  const handleTanweenSlotClick = (slotIdx: number) => {
    if (tanweenSlots[slotIdx] !== null) {
      const wordToRemove = tanweenSlots[slotIdx];
      const newSlots = [...tanweenSlots];
      newSlots[slotIdx] = null;
      setTanweenSlots(newSlots);
      setTanweenTileBank(tanweenTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (tanweenSelectedId) {
      const tile = tanweenTileBank.find((t) => t.id === tanweenSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...tanweenSlots];
      newSlots[slotIdx] = tile.text;
      setTanweenSlots(newSlots);
      setTanweenTileBank(tanweenTileBank.map((t) => (t.id === tanweenSelectedId ? { ...t, isUsed: true } : t)));
      setTanweenSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentTanweenItem.words[idx]);
        if (isCorrect) {
          setTanweenCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          setTimeout(() => speakText(currentTanweenItem.arabicPhrase), 1000);
        } else {
          playUrduText('دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextTanweenItem = () => {
    if (tanweenIndex < TANWEEN_ITEMS.length - 1) setTanweenIndex(tanweenIndex + 1);
    else setTanweenIndex(0);
  };

  const prevTanweenItem = () => {
    if (tanweenIndex > 0) setTanweenIndex(tanweenIndex - 1);
    else setTanweenIndex(TANWEEN_ITEMS.length - 1);
  };

  // =========================================================================
  // 7. TASHDEED PUZZLE DATA & STATE (تشدید)
  // =========================================================================
  const [tashdeedIndex, setTashdeedIndex] = useState(0);
  const [tashdeedSlots, setTashdeedSlots] = useState<(string | null)[]>([]);
  const [tashdeedTileBank, setTashdeedTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [tashdeedSelectedId, setTashdeedSelectedId] = useState<string | null>(null);
  const [tashdeedCompleted, setTashdeedCompleted] = useState(false);
  
  const TASHDEED_ITEMS: GenericPuzzleItem[] = useMemo(() => [
    { id: 't1', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'اَبَّ', arabicPhrase: 'اَبَّ', words: ['اَ', 'بَّ'], isQalqalah: true },
    { id: 't2', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'اِنَّ', arabicPhrase: 'اِنَّ', words: ['اِ', 'نَّ'] },
    { id: 't3', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'عَمَّ', arabicPhrase: 'عَمَّ', words: ['عَ', 'مَّ'] },
    { id: 't4', category: 'tashdeed', categoryLabelUrdu: 'غنہ', title: 'ثُمَّ', arabicPhrase: 'ثُمَّ', words: ['ثُ', 'مَّ'] },
    { id: 't5', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'يَظُنُّ', arabicPhrase: 'يَظُنُّ', words: ['يَ', 'ظُ', 'نُّ'] },
    { id: 't6', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'جَنَّتِ', arabicPhrase: 'جَنَّتِ', words: ['جَ', 'نَّ', 'تِ'] },
    { id: 't7', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'سَيِّدِ', arabicPhrase: 'سَيِّدِ', words: ['سَ', 'يِّ', 'دِ'] },
    { id: 't8', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'مُحَمَّدٍ', arabicPhrase: 'مُحَمَّدٍ', words: ['مُ', 'حَ', 'مَّ', 'دٍ'] },
    { id: 't9', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'يُزَكِّي', arabicPhrase: 'يُزَكِّي', words: ['يُ', 'زَ', 'كِّ', 'ي'] },
    { id: 't10', category: 'tashdeed', categoryLabelUrdu: 'تشدید', title: 'فَضَّلَ', arabicPhrase: 'فَضَّلَ', words: ['فَ', 'ضَّ', 'لَ'] }
  ], []);

  const currentTashdeedItem = TASHDEED_ITEMS[tashdeedIndex] || TASHDEED_ITEMS[0];

  const initTashdeedPuzzle = () => {
    if (!currentTashdeedItem) return;
    setTashdeedCompleted(false);
    const correctWords = currentTashdeedItem.words;
    setTashdeedSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['رَّ', 'سُّ', 'جِّ', 'كَ', 'يْ', 'قُ', 'مَّ', 'نِّ', 'وَّ', 'بِّ'];
    const distractors = distractorPool.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());
    
    const tiles = shuffled.map((word, idx) => ({ id: `tashdeed-${idx}`, text: word, isUsed: false }));
    setTashdeedTileBank(tiles);
    setTashdeedSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'tashdeed') initTashdeedPuzzle();
  }, [tashdeedIndex, activeMode]);

  const handleTashdeedTileClick = (tileId: string) => {
    const tile = tashdeedTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setTashdeedSelectedId(tashdeedSelectedId === tileId ? null : tileId);
  };

  const handleTashdeedSlotClick = (slotIdx: number) => {
    if (tashdeedSlots[slotIdx] !== null) {
      const wordToRemove = tashdeedSlots[slotIdx];
      const newSlots = [...tashdeedSlots];
      newSlots[slotIdx] = null;
      setTashdeedSlots(newSlots);
      setTashdeedTileBank(tashdeedTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (tashdeedSelectedId) {
      const tile = tashdeedTileBank.find((t) => t.id === tashdeedSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...tashdeedSlots];
      newSlots[slotIdx] = tile.text;
      setTashdeedSlots(newSlots);
      setTashdeedTileBank(tashdeedTileBank.map((t) => (t.id === tashdeedSelectedId ? { ...t, isUsed: true } : t)));
      setTashdeedSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentTashdeedItem.words[idx]);
        if (isCorrect) {
          setTashdeedCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          setTimeout(() => speakText(currentTashdeedItem.arabicPhrase), 1000);
        } else {
          playUrduText('دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextTashdeedItem = () => {
    if (tashdeedIndex < TASHDEED_ITEMS.length - 1) setTashdeedIndex(tashdeedIndex + 1);
    else setTashdeedIndex(0);
  };

  const prevTashdeedItem = () => {
    if (tashdeedIndex > 0) setTashdeedIndex(tashdeedIndex - 1);
    else setTashdeedIndex(TASHDEED_ITEMS.length - 1);
  };

  // =========================================================================
  // 8. NUN SAKIN & TANWEEN PUZZLE DATA & STATE (سبق ۱۰: نون ساکن و تنوین کے ۴ قواعد)
  // =========================================================================
  const [nunSakinIndex, setNunSakinIndex] = useState(0);
  const [nunSakinCategory, setNunSakinCategory] = useState<'all' | 'izhar' | 'ikhfa' | 'idgham_with_ghunnah' | 'idgham_without_ghunnah' | 'iqlab'>('all');
  const [nunSakinSlots, setNunSakinSlots] = useState<(string | null)[]>([]);
  const [nunSakinTileBank, setNunSakinTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [nunSakinSelectedId, setNunSakinSelectedId] = useState<string | null>(null);
  const [nunSakinCompleted, setNunSakinCompleted] = useState(false);

  const NUN_SAKIN_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return NUN_SAKIN_ALL_WORDS.map((w) => ({
      id: `nun-sakin-${w.id}`,
      category: w.ruleCategory,
      categoryLabelUrdu: w.ruleCategoryLabelUrdu,
      title: `${w.ruleCategoryLabelUrdu} : ${w.arabic}`,
      arabicPhrase: w.arabic,
      words: w.breakdownParts,
      spellingHijja: w.spellingHijja,
      tajweedRuleTitle: w.ruleExplanationUrdu,
    }));
  }, []);

  const filteredNunSakinItems = useMemo(() => {
    if (nunSakinCategory === 'all') return NUN_SAKIN_ITEMS;
    return NUN_SAKIN_ITEMS.filter((i) => i.category === nunSakinCategory);
  }, [NUN_SAKIN_ITEMS, nunSakinCategory]);

  const currentNunSakinItem = filteredNunSakinItems[nunSakinIndex] || filteredNunSakinItems[0] || NUN_SAKIN_ITEMS[0];

  const initNunSakinPuzzle = () => {
    if (!currentNunSakinItem) return;
    setNunSakinCompleted(false);
    const correctWords = currentNunSakinItem.words;
    setNunSakinSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['مَنْ', 'مِنْ', 'عَنْ', 'اَنْ', 'فِيْ', 'مَا', 'لَا', 'قَدْ', 'بَلْ', 'كَلَّا', 'هُوَ', 'هِيَ'];
    const distractors = distractorPool.filter((d) => !correctWords.includes(d)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());

    const tiles = shuffled.map((word, idx) => ({ id: `nun-sakin-tile-${idx}-${word}`, text: word, isUsed: false }));
    setNunSakinTileBank(tiles);
    setNunSakinSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'nun_sakin') initNunSakinPuzzle();
  }, [nunSakinIndex, nunSakinCategory, activeMode]);

  const handleNunSakinTileClick = (tileId: string) => {
    const tile = nunSakinTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setNunSakinSelectedId(nunSakinSelectedId === tileId ? null : tileId);
  };

  const handleNunSakinSlotClick = (slotIdx: number) => {
    if (nunSakinSlots[slotIdx] !== null) {
      const wordToRemove = nunSakinSlots[slotIdx];
      const newSlots = [...nunSakinSlots];
      newSlots[slotIdx] = null;
      setNunSakinSlots(newSlots);
      setNunSakinTileBank(nunSakinTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (nunSakinSelectedId) {
      const tile = nunSakinTileBank.find((t) => t.id === nunSakinSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...nunSakinSlots];
      newSlots[slotIdx] = tile.text;
      setNunSakinSlots(newSlots);
      setNunSakinTileBank(nunSakinTileBank.map((t) => (t.id === nunSakinSelectedId ? { ...t, isUsed: true } : t)));
      setNunSakinSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentNunSakinItem.words[idx]);
        if (isCorrect) {
          setNunSakinCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          playUrduText(`ماشاء اللہ! ${currentNunSakinItem.categoryLabelUrdu} کا کلمہ مکمل ہوا`);
          setTimeout(() => speakText(currentNunSakinItem.arabicPhrase), 1200);
        } else {
          playChimeEffect('error');
          playUrduText('ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextNunSakinItem = () => {
    if (nunSakinIndex < filteredNunSakinItems.length - 1) setNunSakinIndex(nunSakinIndex + 1);
    else setNunSakinIndex(0);
  };

  const prevNunSakinItem = () => {
    if (nunSakinIndex > 0) setNunSakinIndex(nunSakinIndex - 1);
    else setNunSakinIndex(filteredNunSakinItems.length - 1);
  };

  // =========================================================================
  // 9. MEEM SAKIN PUZZLE DATA & STATE (سبق ۱۱: میم ساکن کے قواعد)
  // =========================================================================
  const [meemSakinIndex, setMeemSakinIndex] = useState(0);
  const [meemSakinCategory, setMeemSakinCategory] = useState<'all' | 'idgham' | 'ikhfa' | 'izhar'>('all');
  const [meemSakinSlots, setMeemSakinSlots] = useState<(string | null)[]>([]);
  const [meemSakinTileBank, setMeemSakinTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [meemSakinSelectedId, setMeemSakinSelectedId] = useState<string | null>(null);
  const [meemSakinCompleted, setMeemSakinCompleted] = useState(false);

  const MEEM_SAKIN_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return meemSakinWords.map((w, idx) => {
      const parts = w.arabic.trim().split(/\s+/);
      const isIdgham = w.rule.toLowerCase().includes('idgham');
      const isIkhfa = w.rule.toLowerCase().includes('ikhfa');
      const catKey = isIdgham ? 'idgham' : isIkhfa ? 'ikhfa' : 'izhar';
      const labelUrdu = isIdgham ? 'ادغامِ شفوی' : isIkhfa ? 'اخفائے شفوی' : 'اظہارِ شفوی';
      const wordTiles = parts.length > 1 ? parts : [w.arabic.slice(0, Math.ceil(w.arabic.length / 2)), w.arabic.slice(Math.ceil(w.arabic.length / 2))];

      return {
        id: `meem-sakin-${w.id || idx}`,
        category: catKey,
        categoryLabelUrdu: labelUrdu,
        title: `${labelUrdu} : ${w.arabic}`,
        arabicPhrase: w.arabic,
        words: wordTiles,
        spellingHijja: w.spellingHijja,
        tajweedRuleTitle: w.urduTranslation,
      };
    });
  }, []);

  const filteredMeemSakinItems = useMemo(() => {
    if (meemSakinCategory === 'all') return MEEM_SAKIN_ITEMS;
    return MEEM_SAKIN_ITEMS.filter((i) => i.category === meemSakinCategory);
  }, [MEEM_SAKIN_ITEMS, meemSakinCategory]);

  const currentMeemSakinItem = filteredMeemSakinItems[meemSakinIndex] || filteredMeemSakinItems[0] || MEEM_SAKIN_ITEMS[0];

  const initMeemSakinPuzzle = () => {
    if (!currentMeemSakinItem) return;
    setMeemSakinCompleted(false);
    const correctWords = currentMeemSakinItem.words;
    setMeemSakinSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['لَكُمْ', 'هُمْ', 'عَلَيْهِمْ', 'مَّا', 'بِهِمْ', 'فِيْهَا', 'مِنْهُمْ', 'كُنْتُمْ'];
    const distractors = distractorPool.filter((d) => !correctWords.includes(d)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());

    const tiles = shuffled.map((word, idx) => ({ id: `meem-sakin-tile-${idx}-${word}`, text: word, isUsed: false }));
    setMeemSakinTileBank(tiles);
    setMeemSakinSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'meem_sakin') initMeemSakinPuzzle();
  }, [meemSakinIndex, meemSakinCategory, activeMode]);

  const handleMeemSakinTileClick = (tileId: string) => {
    const tile = meemSakinTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setMeemSakinSelectedId(meemSakinSelectedId === tileId ? null : tileId);
  };

  const handleMeemSakinSlotClick = (slotIdx: number) => {
    if (meemSakinSlots[slotIdx] !== null) {
      const wordToRemove = meemSakinSlots[slotIdx];
      const newSlots = [...meemSakinSlots];
      newSlots[slotIdx] = null;
      setMeemSakinSlots(newSlots);
      setMeemSakinTileBank(meemSakinTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (meemSakinSelectedId) {
      const tile = meemSakinTileBank.find((t) => t.id === meemSakinSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...meemSakinSlots];
      newSlots[slotIdx] = tile.text;
      setMeemSakinSlots(newSlots);
      setMeemSakinTileBank(meemSakinTileBank.map((t) => (t.id === meemSakinSelectedId ? { ...t, isUsed: true } : t)));
      setMeemSakinSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMeemSakinItem.words[idx]);
        if (isCorrect) {
          setMeemSakinCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          playUrduText(`ماشاء اللہ! ${currentMeemSakinItem.categoryLabelUrdu} کا کلمہ مکمل ہوا`);
          setTimeout(() => speakText(currentMeemSakinItem.arabicPhrase), 1200);
        } else {
          playChimeEffect('error');
          playUrduText('ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMeemSakinItem = () => {
    if (meemSakinIndex < filteredMeemSakinItems.length - 1) setMeemSakinIndex(meemSakinIndex + 1);
    else setMeemSakinIndex(0);
  };

  const prevMeemSakinItem = () => {
    if (meemSakinIndex > 0) setMeemSakinIndex(meemSakinIndex - 1);
    else setMeemSakinIndex(filteredMeemSakinItems.length - 1);
  };

  // =========================================================================
  // 10. TAFKHEEM & TARQEEQ PUZZLE DATA & STATE (سبق ۱۲: تفخیم و ترقیق)
  // =========================================================================
  const [tafkheemIndex, setTafkheemIndex] = useState(0);
  const [tafkheemCategory, setTafkheemCategory] = useState<'all' | 'alif' | 'laam' | 'raa'>('all');
  const [tafkheemSlots, setTafkheemSlots] = useState<(string | null)[]>([]);
  const [tafkheemTileBank, setTafkheemTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [tafkheemSelectedId, setTafkheemSelectedId] = useState<string | null>(null);
  const [tafkheemCompleted, setTafkheemCompleted] = useState(false);

  const TAFKHEEM_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return tafkheemTarqeeqWords.map((w, idx) => {
      const parts = w.arabic.trim().split(/\s+/);
      const catKey = w.letterType;
      const labelUrdu = catKey === 'alif' ? 'احکامِ الف (پُر و باریک)' : catKey === 'laam' ? 'احکامِ لامِ جلالت' : 'احکامِ راء (پُر و باریک)';
      const wordTiles = parts.length > 1 ? parts : [w.arabic.slice(0, Math.ceil(w.arabic.length / 2)), w.arabic.slice(Math.ceil(w.arabic.length / 2))];

      return {
        id: `tafkheem-${w.id || idx}`,
        category: catKey,
        categoryLabelUrdu: labelUrdu,
        title: `${w.ruleUrdu} : ${w.arabic}`,
        arabicPhrase: w.arabic,
        words: wordTiles,
        spellingHijja: w.spellingHijja,
        tajweedRuleTitle: w.explanation,
      };
    });
  }, []);

  const filteredTafkheemItems = useMemo(() => {
    if (tafkheemCategory === 'all') return TAFKHEEM_ITEMS;
    return TAFKHEEM_ITEMS.filter((i) => i.category === tafkheemCategory);
  }, [TAFKHEEM_ITEMS, tafkheemCategory]);

  const currentTafkheemItem = filteredTafkheemItems[tafkheemIndex] || filteredTafkheemItems[0] || TAFKHEEM_ITEMS[0];

  const initTafkheemPuzzle = () => {
    if (!currentTafkheemItem) return;
    setTafkheemCompleted(false);
    const correctWords = currentTafkheemItem.words;
    setTafkheemSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['قَاْلَ', 'وَاللهُ', 'بِسْمِ اللهِ', 'رَبَّنَا', 'رِجَالٌ', 'مِرْصَادًا', 'فِرْعَوْنَ', 'كَانَ'];
    const distractors = distractorPool.filter((d) => !correctWords.includes(d)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());

    const tiles = shuffled.map((word, idx) => ({ id: `tafkheem-tile-${idx}-${word}`, text: word, isUsed: false }));
    setTafkheemTileBank(tiles);
    setTafkheemSelectedId(null);
  };

  useEffect(() => {
    if (activeMode === 'tafkheem_tarqeeq') initTafkheemPuzzle();
  }, [tafkheemIndex, tafkheemCategory, activeMode]);

  const handleTafkheemTileClick = (tileId: string) => {
    const tile = tafkheemTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setTafkheemSelectedId(tafkheemSelectedId === tileId ? null : tileId);
  };

  const handleTafkheemSlotClick = (slotIdx: number) => {
    if (tafkheemSlots[slotIdx] !== null) {
      const wordToRemove = tafkheemSlots[slotIdx];
      const newSlots = [...tafkheemSlots];
      newSlots[slotIdx] = null;
      setTafkheemSlots(newSlots);
      setTafkheemTileBank(tafkheemTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (tafkheemSelectedId) {
      const tile = tafkheemTileBank.find((t) => t.id === tafkheemSelectedId);
      if (!tile || tile.isUsed) return;
      const newSlots = [...tafkheemSlots];
      newSlots[slotIdx] = tile.text;
      setTafkheemSlots(newSlots);
      setTafkheemTileBank(tafkheemTileBank.map((t) => (t.id === tafkheemSelectedId ? { ...t, isUsed: true } : t)));
      setTafkheemSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentTafkheemItem.words[idx]);
        if (isCorrect) {
          setTafkheemCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          playUrduText(`ماشاء اللہ! ${currentTafkheemItem.categoryLabelUrdu} مکمل ہوا`);
          setTimeout(() => speakText(currentTafkheemItem.arabicPhrase), 1200);
        } else {
          playChimeEffect('error');
          playUrduText('ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextTafkheemItem = () => {
    if (tafkheemIndex < filteredTafkheemItems.length - 1) setTafkheemIndex(tafkheemIndex + 1);
    else setTafkheemIndex(0);
  };

  const prevTafkheemItem = () => {
    if (tafkheemIndex > 0) setTafkheemIndex(tafkheemIndex - 1);
    else setTafkheemIndex(filteredTafkheemItems.length - 1);
  };

  // =========================================================================
  // 11. MADDAT PUZZLE DATA & STATE (سبق ۱۳: مَدَّات کے قواعد)
  // =========================================================================
  const [maddatIndex, setMaddatIndex] = useState(0);
  const [maddatCategory, setMaddatCategory] = useState<string>('all');
  const [maddatSlots, setMaddatSlots] = useState<(string | null)[]>([]);
  const [maddatTileBank, setMaddatTileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [maddatSelectedId, setMaddatSelectedId] = useState<string | null>(null);
  const [maddatCompleted, setMaddatCompleted] = useState(false);

  const MADDAT_ITEMS: GenericPuzzleItem[] = useMemo(() => {
    return MADDAT_WORDS.map((w, idx) => {
      const parts = w.arabic.trim().split(/\s+/);
      const wordTiles = parts.length > 1 ? parts : [w.arabic.slice(0, Math.ceil(w.arabic.length / 2)), w.arabic.slice(Math.ceil(w.arabic.length / 2))];

      return {
        id: `maddat-${w.id || idx}`,
        category: w.maddType,
        categoryLabelUrdu: w.categoryLabelUrdu,
        title: `${w.categoryLabelUrdu} : ${w.arabic}`,
        arabicPhrase: w.arabic,
        words: wordTiles,
        spellingHijja: w.spellingHijja,
        tajweedRuleTitle: `${w.causeExplanation} (مقدار: ${w.durationText})`,
      };
    });
  }, []);

  const filteredMaddatItems = useMemo(() => {
    if (maddatCategory === 'all') return MADDAT_ITEMS;
    return MADDAT_ITEMS.filter((i) => i.category === maddatCategory);
  }, [MADDAT_ITEMS, maddatCategory]);

  const currentMaddatItem = filteredMaddatItems[maddatIndex] || filteredMaddatItems[0] || MADDAT_ITEMS[0];

  const initMaddatPuzzle = () => {
    if (!currentMaddatItem) return;
    setMaddatCompleted(false);
    const correctWords = currentMaddatItem.words;
    setMaddatSlots(Array(correctWords.length).fill(null));

    const distractorPool = ['جَآءَ', 'سِیْٓئَتْ', 'أُولٰٓئِكَ', 'فِيْٓ أَنفُسِكُمْ', 'جَآنٌّ', 'ضَآلًّا', 'مُسْلِمُوْنْ ۝', 'شَفَتَیْنْ ۝'];
    const distractors = distractorPool.filter((d) => !correctWords.includes(d)).sort(() => 0.5 - Math.random()).slice(0, 3);
    const allTiles = [...correctWords, ...distractors];
    const shuffled = allTiles.sort(() => 0.5 - Math.random());

    const tiles = shuffled.map((word, idx) => ({ id: `maddat-tile-${idx}-${word}`, text: word, isUsed: false }));
    setMaddatTileBank(tiles);
    setMaddatSelectedId(null);
  };

  const handleMaddatTileClick = (tileId: string) => {
    const tile = maddatTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    setMaddatSelectedId(maddatSelectedId === tileId ? null : tileId);
  };

  const handleMaddatSlotClick = (slotIdx: number) => {
    if (maddatSlots[slotIdx] !== null) {
      const wordToRemove = maddatSlots[slotIdx];
      const newSlots = [...maddatSlots];
      newSlots[slotIdx] = null;
      setMaddatSlots(newSlots);
      setMaddatTileBank(maddatTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t)));
      return;
    }
    if (maddatSelectedId) {
      const tile = maddatTileBank.find((t) => t.id === maddatSelectedId);
      if (!tile || tile.isUsed) return;

      const newSlots = [...maddatSlots];
      newSlots[slotIdx] = tile.text;
      setMaddatSlots(newSlots);
      setMaddatTileBank(maddatTileBank.map((t) => (t.id === maddatSelectedId ? { ...t, isUsed: true } : t)));
      setMaddatSelectedId(null);

      if (newSlots.every((s) => s !== null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMaddatItem.words[idx]);
        if (isCorrect) {
          setMaddatCompleted(true);
          setScore((s) => s + 50);
          setCoins((c) => c + 35);
          playChimeEffect('success');
          playUrduText(`ماشاء اللہ! ${currentMaddatItem.categoryLabelUrdu} مکمل ہوا`);
          setTimeout(() => speakText(currentMaddatItem.arabicPhrase), 1200);
        } else {
          playChimeEffect('error');
          playUrduText('ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMaddatItem = () => {
    if (maddatIndex < filteredMaddatItems.length - 1) setMaddatIndex(maddatIndex + 1);
    else setMaddatIndex(0);
  };

  const prevMaddatItem = () => {
    if (maddatIndex > 0) setMaddatIndex(maddatIndex - 1);
    else setMaddatIndex(filteredMaddatItems.length - 1);
  };

  const speakText = (text: string) => {
    if (isAudioMuted) return;
    stopAllQariAudio();
    const isUrdu =
      /[پٹڈڑئےںآگھچھٹھڈھ]/.test(text) ||
      text.includes('ماشاء اللہ') ||
      text.includes('بہت خوب') ||
      text.includes('درست') ||
      text.includes('ترتیب') ||
      text.includes('کوشش');

    if (isUrdu) {
      playUrduText(text);
    } else {
      playQariText(text);
    }
  };

  const playAlafasyRecitation = () => {
    if (currentSurah.audioUrl && !isAudioMuted) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(currentSurah.audioUrl);
      audioRef.current = audio;
      setIsPlayingAlafasy(true);
      audio.play().catch(() => setIsPlayingAlafasy(false));
      audio.onended = () => setIsPlayingAlafasy(false);
    }
  };

  // =========================================================================
  // INITIALIZERS FOR EACH MODE
  // =========================================================================
  const initMufradatPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setMufradatCompleted(false);
    const correctWords = currentMufradatItem.words;
    setMufradatSlots(Array(correctWords.length).fill(null));

    const letterPool = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'و', 'ه', 'ء', 'ي'];
    const distractors = letterPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, correctWords.length === 1 ? 5 : 3);

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `muf-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setMufradatTileBank(tiles);
    setMufradatSelectedId(null);
  };

  const initMutaharrikatPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setMutaharrikatCompleted(false);
    const correctWords = currentMutaharrikItem.words;
    setMutaharrikatSlots(Array(correctWords.length).fill(null));

    // Realistic Mutaharrik Distractors
    const harakatDistractorPool = [
      'رَ', 'بَ', 'دَ', 'مَ', 'وَ', 'زَ', 'نَ', 'تَ', 'لَ', 'كَ', 'عَ', 'سَ', 'خَ', 'صَ', 'جَ', 'قَ',
      'إِ', 'بِ', 'تِ', 'ثِ', 'جِ', 'حِ', 'خِ', 'دِ', 'ذِ', 'رِ', 'زِ', 'سِ', 'شِ', 'صِ', 'ضِ', 'طِ',
      'أُ', 'بُ', 'تُ', 'ثُ', 'جُ', 'حُ', 'خُ', 'دُ', 'ذُ', 'رُ', 'زُ', 'سُ', 'شُ', 'صُ', 'ضُ', 'طُ', 'قُ', 'كُ', 'لُ', 'مُ', 'نُ', 'هُ', 'يُ'
    ];
    const distractors = harakatDistractorPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `mut-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setMutaharrikatTileBank(tiles);
    setMutaharrikatSelectedId(null);
  };

  const initSukoonPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setSukoonCompleted(false);
    const correctWords = currentSukoonItem.words;
    setSukoonSlots(Array(correctWords.length).fill(null));

    // Sukoon & Qalqalah Distractor Pool
    const sukoonDistractorPool = [
      'أَبْ', 'إِتْ', 'أُثْ', 'قُلْ', 'كَمْ', 'مَنْ', 'عَنْ', 'قَدْ', 'لَمْ', 'خُذْ', 'ذُقْ', 'بَلْ',
      'أَقْ', 'أَطْ', 'أَبْ', 'أَجْ', 'أَدْ', 'تَأْ', 'يَأْ', 'مَأْ', 'نَقْ', 'ضَبْ', 'فَلَقْ', 'حَبْلْ',
      'يَقْ', 'يَشْ', 'يَدْ', 'تَكْ', 'أَفْ', 'أَطْ', 'خَلْ', 'نَا', 'لُ', 'رُ', 'بُ', 'عُ'
    ];
    const distractors = sukoonDistractorPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `suk-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setSukoonTileBank(tiles);
    setSukoonSelectedId(null);
  };

  const initMurakkabatPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setMurakkabatCompleted(false);
    const correctWords = currentMurakkabItem.words;
    setMurakkabatSlots(Array(correctWords.length).fill(null));

    const letterPool = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
    const distractors = letterPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `mur-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setMurakkabatTileBank(tiles);
    setMurakkabatSelectedId(null);
  };

  const initSurahPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setSurahCompleted(false);
    setIsPlayingAlafasy(false);
    setSurahSlots(Array(currentSurah.words.length).fill(null));

    const shuffled = [...currentSurah.words]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `surah-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setSurahTileBank(shuffled);
    setSurahSelectedId(null);
  };

  const initLeenPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setLeenCompleted(false);
    const correctWords = currentLeenItem.words;
    setLeenSlots(Array(correctWords.length).fill(null));

    // Leen Distractor Pool
    const leenDistractorPool = [
      'سَوْ', 'فَ', 'بَيْ', 'تٍ', 'خَوْ', 'فٍ', 'قَوْ', 'لُ', 'صَيْ', 'فٍ', 'رَيْ', 'بَ',
      'وَيْ', 'لٌ', 'كَيْ', 'فَ', 'عَيْ', 'نٌ', 'لَيْ', 'لٌ', 'زَوْ', 'جَيْ', 'نِ', 'حَوْ',
      'لَيْ', 'اَوْ', 'اَيْ', 'بَوْ', 'بَيْ', 'تَوْ', 'تَيْ', 'ثَوْ', 'ثَيْ', 'جَوْ', 'جَيْ'
    ];
    const distractors = leenDistractorPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `leen-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setLeenTileBank(tiles);
    setLeenSelectedId(null);
  };

  const initMaddahPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setMaddahCompleted(false);
    const correctWords = currentMaddahItem.words;
    setMaddahSlots(Array(correctWords.length).fill(null));

    // Maddah Distractor Pool
    const maddahDistractorPool = [
      'بَا', 'بُوْ', 'بِيْ', 'تَا', 'تُوْ', 'تِيْ', 'ثَا', 'ثُوْ', 'ثِيْ',
      'جَا', 'جُوْ', 'جِيْ', 'حَا', 'حُوْ', 'حِيْ', 'خَا', 'خُوْ', 'خِيْ',
      'قَا', 'قُوْ', 'قِيْ', 'صَا', 'صُوْ', 'صِيْ', 'ضَا', 'ضُوْ', 'ضِيْ',
      'طَا', 'طُوْ', 'طِيْ', 'ظَا', 'ظُوْ', 'ظِيْ', 'غَا', 'غُوْ', 'غِيْ',
      'نَا', 'نُوْ', 'نِيْ', 'مَا', 'مُوْ', 'مِيْ', 'هَا', 'هُوْ', 'هِيْ',
      'يَا', 'يُوْ', 'يِيْ', 'كَ', 'لَ', 'رَ', 'ا', 'وْ', 'يْ'
    ];
    const distractors = maddahDistractorPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(3, 5 - correctWords.length));

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `mad-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setMaddahTileBank(tiles);
    setMaddahSelectedId(null);
  };

  const initKhariHarakatPuzzle = () => {
    if (audioRef.current) audioRef.current.pause();
    setKhariHarakatCompleted(false);
    const correctWords = currentKhariItem.words;
    setKhariHarakatSlots(Array(correctWords.length).fill(null));

    // Khari Harakat Distractor Pool
    const khariDistractorPool = [
      'بٰ', 'بٖ', 'بٗ', 'تٰ', 'تٖ', 'تٗ', 'ثٰ', 'ثٖ', 'ثٗ',
      'جٰ', 'جٖ', 'جٗ', 'حٰ', 'حٖ', 'حٗ', 'خٰ', 'خٖ', 'خٗ',
      'دٰ', 'دٖ', 'دٗ', 'ذٰ', 'ذٖ', 'ذٗ', 'رٰ', 'رٖ', 'رٗ',
      'زٰ', 'زٖ', 'زٗ', 'سٰ', 'سٖ', 'سٗ', 'شٰ', 'شٖ', 'شٗ',
      'صٰ', 'صٖ', 'صٗ', 'ضٰ', 'ضٖ', 'ضٗ', 'طٰ', 'طٖ', 'طٗ',
      'ظٰ', 'ظٖ', 'ظٗ', 'عٰ', 'عٖ', 'عٗ', 'غٰ', 'غٖ', 'غٗ',
      'فٰ', 'فٖ', 'فٗ', 'قٰ', 'قٖ', 'قٗ', 'كٰ', 'كٖ', 'كٗ',
      'لٰ', 'لٖ', 'لٗ', 'مٰ', 'مٖ', 'مٗ', 'نٰ', 'نٖ', 'نٗ',
      'وٰ', 'وٖ', 'وٗ', 'هٰ', 'هٖ', 'هٗ', 'ءٰ', 'ءٖ', 'ءٗ',
      'يٰ', 'يٖ', 'يٗ', 'لَ', 'بِ', 'مُ', 'كَ'
    ];
    const distractors = khariDistractorPool
      .filter((w) => !correctWords.includes(w))
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.max(3, 5 - correctWords.length));

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `khari-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setKhariHarakatTileBank(tiles);
    setKhariHarakatSelectedId(null);
  };

  // Re-initialize whenever mode, category, or index changes
  useEffect(() => {
    if (activeMode === 'mufradat') {
      initMufradatPuzzle();
    } else if (activeMode === 'mutaharrikat') {
      initMutaharrikatPuzzle();
    } else if (activeMode === 'sukoon') {
      initSukoonPuzzle();
    } else if (activeMode === 'murakkabat') {
      initMurakkabatPuzzle();
    } else if (activeMode === 'maddah') {
      initMaddahPuzzle();
    } else if (activeMode === 'leen') {
      initLeenPuzzle();
    } else if (activeMode === 'khari_harakat') {
      initKhariHarakatPuzzle();
    } else if (activeMode === 'tanween') {
      initTanweenPuzzle();
    } else if (activeMode === 'tashdeed') {
      initTashdeedPuzzle();
    } else if (activeMode === 'nun_sakin') {
      initNunSakinPuzzle();
    } else if (activeMode === 'meem_sakin') {
      initMeemSakinPuzzle();
    } else if (activeMode === 'tafkheem_tarqeeq') {
      initTafkheemPuzzle();
    } else if (activeMode === 'maddat') {
      initMaddatPuzzle();
    } else if (activeMode === 'surahs') {
      initSurahPuzzle();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [
    activeMode,
    mufradatIndex,
    mutaharrikatIndex,
    sukoonIndex,
    murakkabatIndex,
    maddahIndex,
    leenIndex,
    khariHarakatIndex,
    tanweenIndex,
    tashdeedIndex,
    nunSakinIndex,
    meemSakinIndex,
    tafkheemIndex,
    maddatIndex,
    surahIndex,
    mufradatCategory,
    mutaharrikatCategory,
    sukoonCategory,
    murakkabatCategory,
    maddahCategory,
    leenCategory,
    khariHarakatCategory,
    nunSakinCategory,
    meemSakinCategory,
    tafkheemCategory,
    maddatCategory
  ]);

  // Reset indices on category changes
  useEffect(() => {
    setNunSakinIndex(0);
  }, [nunSakinCategory]);

  // Reset indices on category changes
  useEffect(() => {
    setMufradatIndex(0);
  }, [mufradatCategory]);

  useEffect(() => {
    setMutaharrikatIndex(0);
  }, [mutaharrikatCategory]);

  useEffect(() => {
    setSukoonIndex(0);
  }, [sukoonCategory]);

  useEffect(() => {
    setMurakkabatIndex(0);
  }, [murakkabatCategory]);

  useEffect(() => {
    setMaddahIndex(0);
  }, [maddahCategory]);

  useEffect(() => {
    setLeenIndex(0);
  }, [leenCategory]);

  useEffect(() => {
    setKhariHarakatIndex(0);
  }, [khariHarakatCategory]);

  // =========================================================================
  // HANDLERS FOR MUFRADAT (حروفِ تہجی)
  // =========================================================================
  const handleMufradatTileClick = (tileId: string) => {
    const tile = mufradatTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    const matchingLetter = MUFRADAT_ITEMS.find((m) => m.words[0] === tile.text);
    speakText(matchingLetter?.letterNameArabic || tile.text);
    setMufradatSelectedId(mufradatSelectedId === tileId ? null : tileId);
  };

  const handleMufradatSlotClick = (slotIdx: number) => {
    if (mufradatSlots[slotIdx] !== null) {
      const wordToRemove = mufradatSlots[slotIdx];
      const newSlots = [...mufradatSlots];
      newSlots[slotIdx] = null;
      setMufradatSlots(newSlots);
      setMufradatTileBank(
        mufradatTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (mufradatSelectedId) {
      const tile = mufradatTileBank.find((t) => t.id === mufradatSelectedId);
      if (!tile) return;

      const newSlots = [...mufradatSlots];
      newSlots[slotIdx] = tile.text;
      setMufradatSlots(newSlots);
      setMufradatTileBank(
        mufradatTileBank.map((t) => (t.id === mufradatSelectedId ? { ...t, isUsed: true } : t))
      );
      setMufradatSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMufradatItem.words[idx]);
        if (isCorrect) {
          setMufradatCompleted(true);
          const ns = score + 40;
          const nc = coins + 20;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          const nameToRead = currentMufradatItem.letterNameArabic || currentMufradatItem.words.join(' ');
          playQariText(nameToRead);
          setTimeout(() => {
            playUrduText('ماشاء اللہ! حرفِ تہجی درست ترتیب میں لگ گیا');
          }, 900);
        } else {
          playChimeEffect('error');
          playUrduText('حرف کی جگہ غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMufradatItem = () => {
    if (mufradatIndex < filteredMufradatItems.length - 1) {
      setMufradatIndex(mufradatIndex + 1);
    } else {
      setMufradatIndex(0);
    }
  };

  const prevMufradatItem = () => {
    if (mufradatIndex > 0) {
      setMufradatIndex(mufradatIndex - 1);
    } else {
      setMufradatIndex(filteredMufradatItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR MUTAHARRIKAT
  // =========================================================================
  const handleMutaharrikatTileClick = (tileId: string) => {
    const tile = mutaharrikatTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setMutaharrikatSelectedId(mutaharrikatSelectedId === tileId ? null : tileId);
  };

  const handleMutaharrikatSlotClick = (slotIdx: number) => {
    if (mutaharrikatSlots[slotIdx] !== null) {
      const wordToRemove = mutaharrikatSlots[slotIdx];
      const newSlots = [...mutaharrikatSlots];
      newSlots[slotIdx] = null;
      setMutaharrikatSlots(newSlots);
      setMutaharrikatTileBank(
        mutaharrikatTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (mutaharrikatSelectedId) {
      const tile = mutaharrikatTileBank.find((t) => t.id === mutaharrikatSelectedId);
      if (!tile) return;

      const newSlots = [...mutaharrikatSlots];
      newSlots[slotIdx] = tile.text;
      setMutaharrikatSlots(newSlots);
      setMutaharrikatTileBank(
        mutaharrikatTileBank.map((t) => (t.id === mutaharrikatSelectedId ? { ...t, isUsed: true } : t))
      );
      setMutaharrikatSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMutaharrikItem.words[idx]);
        if (isCorrect) {
          setMutaharrikatCompleted(true);
          const ns = score + 60;
          const nc = coins + 30;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          playUrduText('ماشاء اللہ! بہت خوب، متحرک کلمہ درست جوڑا گیا');
          setTimeout(() => {
            speakText(currentMutaharrikItem.arabicPhrase);
          }, 1600);
        } else {
          playChimeEffect('error');
          playUrduText('حروف یا حرکات کی ترتیب درست نہیں، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMutaharrikatItem = () => {
    if (mutaharrikatIndex < filteredMutaharrikatItems.length - 1) {
      setMutaharrikatIndex(mutaharrikatIndex + 1);
    } else {
      setMutaharrikatIndex(0);
    }
  };

  const prevMutaharrikatItem = () => {
    if (mutaharrikatIndex > 0) {
      setMutaharrikatIndex(mutaharrikatIndex - 1);
    } else {
      setMutaharrikatIndex(filteredMutaharrikatItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR SUKOON & QALQALAH
  // =========================================================================
  const handleSukoonTileClick = (tileId: string) => {
    const tile = sukoonTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setSukoonSelectedId(sukoonSelectedId === tileId ? null : tileId);
  };

  const handleSukoonSlotClick = (slotIdx: number) => {
    if (sukoonSlots[slotIdx] !== null) {
      const wordToRemove = sukoonSlots[slotIdx];
      const newSlots = [...sukoonSlots];
      newSlots[slotIdx] = null;
      setSukoonSlots(newSlots);
      setSukoonTileBank(
        sukoonTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (sukoonSelectedId) {
      const tile = sukoonTileBank.find((t) => t.id === sukoonSelectedId);
      if (!tile) return;

      const newSlots = [...sukoonSlots];
      newSlots[slotIdx] = tile.text;
      setSukoonSlots(newSlots);
      setSukoonTileBank(
        sukoonTileBank.map((t) => (t.id === sukoonSelectedId ? { ...t, isUsed: true } : t))
      );
      setSukoonSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentSukoonItem.words[idx]);
        if (isCorrect) {
          setSukoonCompleted(true);
          const ns = score + 75;
          const nc = coins + 35;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          const praise = currentSukoonItem.isQalqalah
            ? 'ماشاء اللہ! قلقلہ کا کلمہ بہترین فٹ کیا گیا'
            : currentSukoonItem.isHamzahSakinah
            ? 'بہت خوب! ہمزہ ساکنہ کا جھٹکا یاد رکھیں'
            : 'ماشاء اللہ! ساکن کلمہ درست جوڑا گیا';
          playUrduText(praise);
          setTimeout(() => {
            speakText(currentSukoonItem.arabicPhrase);
          }, 1800);
        } else {
          playChimeEffect('error');
          playUrduText('سکون یا جزم کی ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextSukoonItem = () => {
    if (sukoonIndex < filteredSukoonItems.length - 1) {
      setSukoonIndex(sukoonIndex + 1);
    } else {
      setSukoonIndex(0);
    }
  };

  const prevSukoonItem = () => {
    if (sukoonIndex > 0) {
      setSukoonIndex(sukoonIndex - 1);
    } else {
      setSukoonIndex(filteredSukoonItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR MURAKKABAT
  // =========================================================================
  const handleMurakkabatTileClick = (tileId: string) => {
    const tile = murakkabatTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setMurakkabatSelectedId(murakkabatSelectedId === tileId ? null : tileId);
  };

  const handleMurakkabatSlotClick = (slotIdx: number) => {
    if (murakkabatSlots[slotIdx] !== null) {
      const wordToRemove = murakkabatSlots[slotIdx];
      const newSlots = [...murakkabatSlots];
      newSlots[slotIdx] = null;
      setMurakkabatSlots(newSlots);
      setMurakkabatTileBank(
        murakkabatTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (murakkabatSelectedId) {
      const tile = murakkabatTileBank.find((t) => t.id === murakkabatSelectedId);
      if (!tile) return;

      const newSlots = [...murakkabatSlots];
      newSlots[slotIdx] = tile.text;
      setMurakkabatSlots(newSlots);
      setMurakkabatTileBank(
        murakkabatTileBank.map((t) => (t.id === murakkabatSelectedId ? { ...t, isUsed: true } : t))
      );
      setMurakkabatSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMurakkabItem.words[idx]);
        if (isCorrect) {
          setMurakkabatCompleted(true);
          const ns = score + 50;
          const nc = coins + 25;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          playUrduText('ماشاء اللہ! بہت خوب، مرکب مکمل ہو گیا');
        } else {
          playChimeEffect('error');
          playUrduText('ترتیب درست نہیں ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMurakkabatItem = () => {
    if (murakkabatIndex < filteredMurakkabatItems.length - 1) {
      setMurakkabatIndex(murakkabatIndex + 1);
    } else {
      setMurakkabatIndex(0);
    }
  };

  const prevMurakkabatItem = () => {
    if (murakkabatIndex > 0) {
      setMurakkabatIndex(murakkabatIndex - 1);
    } else {
      setMurakkabatIndex(filteredMurakkabatItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR HUROOF LEEN (حروفِ لین - واؤ لین و یاء لین)
  // =========================================================================
  const handleLeenTileClick = (tileId: string) => {
    const tile = leenTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setLeenSelectedId(leenSelectedId === tileId ? null : tileId);
  };

  const handleLeenSlotClick = (slotIdx: number) => {
    if (leenSlots[slotIdx] !== null) {
      const wordToRemove = leenSlots[slotIdx];
      const newSlots = [...leenSlots];
      newSlots[slotIdx] = null;
      setLeenSlots(newSlots);
      setLeenTileBank(
        leenTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (leenSelectedId) {
      const tile = leenTileBank.find((t) => t.id === leenSelectedId);
      if (!tile) return;

      const newSlots = [...leenSlots];
      newSlots[slotIdx] = tile.text;
      setLeenSlots(newSlots);
      setLeenTileBank(
        leenTileBank.map((t) => (t.id === leenSelectedId ? { ...t, isUsed: true } : t))
      );
      setLeenSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentLeenItem.words[idx]);
        if (isCorrect) {
          setLeenCompleted(true);
          const ns = score + 70;
          const nc = coins + 35;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          const praise = currentLeenItem.category === 'pairs'
            ? 'ماشاء اللہ! واؤ لین اور یاء لین کی جوڑی درست لگ گئی'
            : currentLeenItem.isHeavyLetterIncluded
            ? 'بہت خوب! مستعلیہ کے ساتھ لین کی ادائیگی درست ہے'
            : 'ماشاء اللہ! حروفِ لین کا کلمہ نرمی سے مکمل ہو گیا';
          playUrduText(praise);
          setTimeout(() => {
            speakText(currentLeenItem.arabicPhrase);
          }, 1800);
        } else {
          playChimeEffect('error');
          playUrduText('حروفِ لین کی ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextLeenItem = () => {
    if (leenIndex < filteredLeenItems.length - 1) {
      setLeenIndex(leenIndex + 1);
    } else {
      setLeenIndex(0);
    }
  };

  const prevLeenItem = () => {
    if (leenIndex > 0) {
      setLeenIndex(leenIndex - 1);
    } else {
      setLeenIndex(filteredLeenItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR HUROOF MADDAH
  // =========================================================================
  const handleMaddahTileClick = (tileId: string) => {
    const tile = maddahTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setMaddahSelectedId(maddahSelectedId === tileId ? null : tileId);
  };

  const handleMaddahSlotClick = (slotIdx: number) => {
    if (maddahSlots[slotIdx] !== null) {
      const wordToRemove = maddahSlots[slotIdx];
      const newSlots = [...maddahSlots];
      newSlots[slotIdx] = null;
      setMaddahSlots(newSlots);
      setMaddahTileBank(
        maddahTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (maddahSelectedId) {
      const tile = maddahTileBank.find((t) => t.id === maddahSelectedId);
      if (!tile) return;

      const newSlots = [...maddahSlots];
      newSlots[slotIdx] = tile.text;
      setMaddahSlots(newSlots);
      setMaddahTileBank(
        maddahTileBank.map((t) => (t.id === maddahSelectedId ? { ...t, isUsed: true } : t))
      );
      setMaddahSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentMaddahItem.words[idx]);
        if (isCorrect) {
          setMaddahCompleted(true);
          const ns = score + 80;
          const nc = coins + 40;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          const praise = currentMaddahItem.category === 'triplets'
            ? 'ماشاء اللہ! حروفِ مدہ کی تینوں شکلیں درست لگ گئیں'
            : currentMaddahItem.isHeavyLetterIncluded
            ? 'بہت خوب! پُر حرف کے ساتھ مدہ کی ادائیگی بالکل درست ہے'
            : 'ماشاء اللہ! مدہ کا کلمہ ایک الف کی مقدار کے ساتھ درست جوڑ دیا گیا';
          playUrduText(praise);
          setTimeout(() => {
            speakText(currentMaddahItem.arabicPhrase);
          }, 1800);
        } else {
          playChimeEffect('error');
          playUrduText('حروفِ مدہ کی ترتیب درست نہیں، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextMaddahItem = () => {
    if (maddahIndex < filteredMaddahItems.length - 1) {
      setMaddahIndex(maddahIndex + 1);
    } else {
      setMaddahIndex(0);
    }
  };

  const prevMaddahItem = () => {
    if (maddahIndex > 0) {
      setMaddahIndex(maddahIndex - 1);
    } else {
      setMaddahIndex(filteredMaddahItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR KHARI HARAKAT (سبق ۷)
  // =========================================================================
  const handleKhariHarakatTileClick = (tileId: string) => {
    const tile = khariHarakatTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setKhariHarakatSelectedId(khariHarakatSelectedId === tileId ? null : tileId);
  };

  const handleKhariHarakatSlotClick = (slotIdx: number) => {
    if (khariHarakatSlots[slotIdx] !== null) {
      const wordToRemove = khariHarakatSlots[slotIdx];
      const newSlots = [...khariHarakatSlots];
      newSlots[slotIdx] = null;
      setKhariHarakatSlots(newSlots);
      setKhariHarakatTileBank(
        khariHarakatTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (khariHarakatSelectedId) {
      const tile = khariHarakatTileBank.find((t) => t.id === khariHarakatSelectedId);
      if (!tile) return;

      const newSlots = [...khariHarakatSlots];
      newSlots[slotIdx] = tile.text;
      setKhariHarakatSlots(newSlots);
      setKhariHarakatTileBank(
        khariHarakatTileBank.map((t) => (t.id === khariHarakatSelectedId ? { ...t, isUsed: true } : t))
      );
      setKhariHarakatSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentKhariItem.words[idx]);
        if (isCorrect) {
          setKhariHarakatCompleted(true);
          const ns = score + 80;
          const nc = coins + 40;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          const praise = currentKhariItem.category === 'triplets'
            ? 'ماشاء اللہ! کھڑی حرکات (کھڑا زبر، کھڑا زیر، الٹا پیش) کی تینوں شکلیں درست لگ گئیں'
            : currentKhariItem.isHeavyLetterIncluded
            ? 'بہت خوب! پُر حرف کے ساتھ کھڑی حرکات کی ادائیگی بالکل درست ہے'
            : 'ماشاء اللہ! کھڑی حرکات کا قرآنی کلمہ درست جوڑ دیا گیا';
          playUrduText(praise);
          setTimeout(() => {
            speakText(currentKhariItem.arabicPhrase);
          }, 1800);
        } else {
          playChimeEffect('error');
          playUrduText('کھڑی حرکات کی ترتیب درست نہیں، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextKhariItem = () => {
    if (khariHarakatIndex < filteredKhariItems.length - 1) {
      setKhariHarakatIndex(khariHarakatIndex + 1);
    } else {
      setKhariHarakatIndex(0);
    }
  };

  const prevKhariItem = () => {
    if (khariHarakatIndex > 0) {
      setKhariHarakatIndex(khariHarakatIndex - 1);
    } else {
      setKhariHarakatIndex(filteredKhariItems.length - 1);
    }
  };

  // =========================================================================
  // HANDLERS FOR SURAH PUZZLES
  // =========================================================================
  const handleSurahTileClick = (tileId: string) => {
    const tile = surahTileBank.find((t) => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text);
    setSurahSelectedId(surahSelectedId === tileId ? null : tileId);
  };

  const handleSurahSlotClick = (slotIdx: number) => {
    if (surahSlots[slotIdx] !== null) {
      const wordToRemove = surahSlots[slotIdx];
      const newSlots = [...surahSlots];
      newSlots[slotIdx] = null;
      setSurahSlots(newSlots);
      setSurahTileBank(
        surahTileBank.map((t) => (t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t))
      );
      return;
    }

    if (surahSelectedId) {
      const tile = surahTileBank.find((t) => t.id === surahSelectedId);
      if (!tile) return;

      const newSlots = [...surahSlots];
      newSlots[slotIdx] = tile.text;
      setSurahSlots(newSlots);
      setSurahTileBank(
        surahTileBank.map((t) => (t.id === surahSelectedId ? { ...t, isUsed: true } : t))
      );
      setSurahSelectedId(null);

      // Check Completion
      if (!newSlots.some((s) => s === null)) {
        const isCorrect = newSlots.every((w, idx) => w === currentSurah.words[idx]);
        if (isCorrect) {
          setSurahCompleted(true);
          const ns = score + 100;
          const nc = coins + 50;
          setScore(ns);
          setCoins(nc);
          setStreak((prev) => prev + 1);
          localStorage.setItem('puzzle_score', ns.toString());
          localStorage.setItem('puzzle_coins', nc.toString());

          playChimeEffect('success');
          playUrduText('ماشاء اللہ! سورۃ مکمل ہو گئی');
          setTimeout(() => {
            playAlafasyRecitation();
          }, 2000);
        } else {
          playChimeEffect('error');
          playUrduText('کچھ الفاظ کی ترتیب غلط ہے، دوبارہ کوشش کریں');
        }
      }
    }
  };

  const nextSurahItem = () => {
    if (surahIndex < SURAH_PUZZLES.length - 1) {
      setSurahIndex(surahIndex + 1);
    } else {
      setSurahIndex(0);
    }
  };

  const prevSurahItem = () => {
    if (surahIndex > 0) {
      setSurahIndex(surahIndex - 1);
    } else {
      setSurahIndex(SURAH_PUZZLES.length - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f5f0e6] text-zinc-900 p-3 sm:p-6 lg:p-8 font-urdu select-none" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-5">
        
        {/* =========================================================================
            TOP APP HEADER & GAMIFICATION STATUS
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900 text-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-amber-500/40">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Puzzle className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-amber-300">{pLoc.headerTitle} 🧩</h1>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                  {pLoc.headerBadge}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{pLoc.headerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-3 bg-zinc-950 px-3.5 py-1.5 rounded-2xl border border-zinc-800 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{score}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-black">
                <Award className="w-3.5 h-3.5" />
                <span>{coins}</span>
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-rose-400 font-black animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{streak}x</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                isAudioMuted
                  ? 'bg-rose-900/60 border-rose-600 text-rose-200'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
              title={isAudioMuted ? pLoc.soundOn : pLoc.soundOff}
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title={pLoc.backBtn}
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>{pLoc.backBtn}</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            8 MAIN GAME MODES TABS (MUFRADAT, MURAKKABAT, MUTAHARRIKAT, SUKOON, LEEN, MADDAH, KHARI HARAKAT, SURAHS)
           ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-zinc-900/90 p-2.5 rounded-2xl border border-amber-500/40 shadow-xl">
          {/* 0. MUFRADAT (HURUF-E-TAHAJJI) */}
          <button
            onClick={() => setActiveMode('mufradat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'mufradat'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'mufradat' ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>{pLoc.m1Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'mufradat' ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m1Sub}
            </span>
          </button>

          {/* 1. MURAKKABAT */}
          <button
            onClick={() => setActiveMode('murakkabat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'murakkabat'
                ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white ring-2 ring-purple-300 scale-[1.02] shadow-lg shadow-purple-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <BookOpen className={`w-3.5 h-3.5 ${activeMode === 'murakkabat' ? 'text-yellow-300' : 'text-indigo-400'}`} />
              <span>{pLoc.m2Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'murakkabat' ? 'text-purple-100 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m2Sub}
            </span>
          </button>

          {/* 2. MUTAHARRIKAT */}
          <button
            onClick={() => setActiveMode('mutaharrikat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'mutaharrikat'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-zinc-950 ring-2 ring-amber-300 scale-[1.02]'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'mutaharrikat' ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>{pLoc.m3Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'mutaharrikat' ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m3Sub}
            </span>
          </button>

          {/* 3. SUKOON & QALQALAH (سبق ۴) */}
          <button
            onClick={() => setActiveMode('sukoon')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'sukoon'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-zinc-950 ring-2 ring-emerald-300 scale-[1.02]'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className={`w-3.5 h-3.5 ${activeMode === 'sukoon' ? 'text-zinc-950' : 'text-emerald-400'}`} />
              <span>{pLoc.m4Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'sukoon' ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m4Sub}
            </span>
          </button>

          {/* 4. HUROOF LEEN (سبق ۵: حروفِ لین) */}
          <button
            onClick={() => setActiveMode('leen')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'leen'
                ? 'bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-600 text-zinc-950 ring-2 ring-teal-300 scale-[1.02] shadow-lg shadow-teal-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'leen' ? 'text-zinc-950' : 'text-teal-400'}`} />
              <span>{pLoc.m5Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'leen' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m5Sub}
            </span>
          </button>

          {/* 5. HUROOF MADDAH (سبق ۶: حروفِ مدہ) */}
          <button
            onClick={() => setActiveMode('maddah')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'maddah'
                ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-zinc-950 ring-2 ring-yellow-300 scale-[1.02] shadow-lg shadow-amber-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'maddah' ? 'text-zinc-950' : 'text-yellow-400'}`} />
              <span>{pLoc.m6Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'maddah' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m6Sub}
            </span>
          </button>

          {/* 7. KHARI HARAKAT (سبق ۷) */}
          <button
            onClick={() => setActiveMode('khari_harakat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'khari_harakat'
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-zinc-950 ring-2 ring-emerald-300 scale-[1.02] shadow-lg shadow-emerald-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'khari_harakat' ? 'text-zinc-950' : 'text-emerald-400'}`} />
              <span>{pLoc.m7Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'khari_harakat' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m7Sub}
            </span>
          </button>

          {/* 8. TANWEEN (سبق ۸) */}
          <button
            onClick={() => setActiveMode('tanween')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'tanween'
                ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-zinc-950 ring-2 ring-amber-300 scale-[1.02] shadow-lg shadow-amber-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'tanween' ? 'text-zinc-950' : 'text-yellow-400'}`} />
              <span>{pLoc.m8Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'tanween' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m8Sub}
            </span>
          </button>

          {/* 9. TASHDEED (سبق ۹) */}
          <button
            onClick={() => setActiveMode('tashdeed')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'tashdeed'
                ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-zinc-950 ring-2 ring-emerald-300 scale-[1.02] shadow-lg shadow-emerald-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'tashdeed' ? 'text-zinc-950' : 'text-emerald-400'}`} />
              <span>{pLoc.m9Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'tashdeed' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m9Sub}
            </span>
          </button>

          {/* 10. NUN SAKIN & TANWEEN (سبق ۱۰: نون ساکن و تنوین) */}
          <button
            onClick={() => setActiveMode('nun_sakin')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'nun_sakin'
                ? 'bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 text-zinc-950 ring-2 ring-teal-300 scale-[1.02] shadow-lg shadow-teal-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'nun_sakin' ? 'text-zinc-950' : 'text-cyan-400'}`} />
              <span>{pLoc.m10Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'nun_sakin' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m10Sub}
            </span>
          </button>

          {/* 11. MEEM SAKIN (سبق ۱۱: میم ساکن) */}
          <button
            onClick={() => setActiveMode('meem_sakin')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'meem_sakin'
                ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-sky-500 text-zinc-950 ring-2 ring-blue-300 scale-[1.02] shadow-lg shadow-blue-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'meem_sakin' ? 'text-zinc-950' : 'text-blue-400'}`} />
              <span>{pLoc.m11Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'meem_sakin' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m11Sub}
            </span>
          </button>

          {/* 12. TAFKHEEM & TARQEEQ (سبق ۱۲: تفخیم و ترقیق) */}
          <button
            onClick={() => setActiveMode('tafkheem_tarqeeq')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'tafkheem_tarqeeq'
                ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-zinc-950 ring-2 ring-amber-300 scale-[1.02] shadow-lg shadow-amber-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'tafkheem_tarqeeq' ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>{pLoc.m12Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'tafkheem_tarqeeq' ? 'text-zinc-950 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m12Sub}
            </span>
          </button>

          {/* 13. MADDAT (سبق ۱۳: مَدَّات کے قواعد) */}
          <button
            onClick={() => setActiveMode('maddat')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'maddat'
                ? 'bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-600 text-white ring-2 ring-purple-300 scale-[1.02] shadow-lg shadow-purple-900/50'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-3.5 h-3.5 ${activeMode === 'maddat' ? 'text-amber-300' : 'text-purple-400'}`} />
              <span>{pLoc.m13Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'maddat' ? 'text-white font-bold' : 'text-zinc-400'}`}>
              {pLoc.m13Sub}
            </span>
          </button>

          {/* 14. SURAH PUZZLES (۱۴. سورتیں) */}
          <button
            onClick={() => setActiveMode('surahs')}
            className={`p-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-md text-center ${
              activeMode === 'surahs'
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white ring-2 ring-purple-300 scale-[1.02]'
                : 'bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Puzzle className={`w-3.5 h-3.5 ${activeMode === 'surahs' ? 'text-white' : 'text-purple-400'}`} />
              <span>{pLoc.m14Name}</span>
            </div>
            <span className={`text-[9px] ${activeMode === 'surahs' ? 'text-purple-100 font-bold' : 'text-zinc-400'}`}>
              {pLoc.m14Sub}
            </span>
          </button>
        </div>

        {/* =========================================================================
            MAIN MAGNETIC BOARD CONTAINER
           ========================================================================= */}
        <div className="bg-[#1a1a1a] border-4 border-amber-600/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 text-white">

          {/* =========================================================================
              MODE 0: MUFRADAT (حروفِ تہجی و مفردات - سبق نمبر ۱)
             ========================================================================= */}
          {activeMode === 'mufradat' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentMufradatItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق نمبر ۱: حروفِ تہجی و مخارج کی مقناطیسی مشق (کُل {filteredMufradatItems.length} آئٹمز)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '🔤 تمام ۲۹ حروف' },
                      { id: 'chains', label: '🔗 الفبائی زنجیریں' },
                      { id: 'heavy', label: '🟢 حروفِ مستعلیہ (پُر)' },
                      { id: 'qalqalah', label: '🔵 حروفِ قلقلہ (۵)' },
                      { id: 'halqi', label: '🟠 حروفِ حلقی (۶)' },
                      { id: 'shafawi', label: '🟣 حروفِ شفویہ (۴)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMufradatCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mufradatCategory === cat.id
                            ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Letter Navigator Dropdown + Quick Buttons */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={mufradatIndex}
                      onChange={(e) => setMufradatIndex(Number(e.target.value))}
                      className="bg-amber-950 text-amber-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-amber-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                    >
                      {filteredMufradatItems.map((item, idx) => (
                        <option key={item.id} value={idx}>
                          {idx + 1}. {item.title}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMufradatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="پچھلا حرف"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMufradatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="اگلا حرف"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {filteredMufradatItems.slice(0, 16).map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setMufradatIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          mufradatIndex === idx
                            ? 'bg-amber-500 text-zinc-950 font-black shadow-lg ring-2 ring-amber-300'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET LETTER BANNER */}
              <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-2 border-amber-500/60 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-4 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>مطلوبہ حرفِ تہجی / ترتیب</span>
                </div>

                <div className="py-3 flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-zinc-950/80 border border-amber-500/40 px-6 py-3.5 rounded-2xl shadow-inner">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-5xl sm:text-7xl font-black text-amber-300 font-arabic tracking-normal select-none drop-shadow-lg"
                    >
                      {currentMufradatItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => {
                        const soundToPlay = currentMufradatItem.letterNameArabic || currentMufradatItem.words.join(' ');
                        playQariText(soundToPlay);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>قاری صاحب کی آواز</span>
                    </button>
                  </div>

                  {/* Letter Properties Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    {currentMufradatItem.letterNameArabic && (
                      <span className="bg-amber-900/60 border border-amber-600/50 text-amber-200 px-3 py-1 rounded-xl font-bold">
                        نام: {currentMufradatItem.letterNameArabic}
                      </span>
                    )}
                    {currentMufradatItem.dotDescription && (
                      <span className="bg-sky-900/60 border border-sky-600/50 text-sky-200 px-3 py-1 rounded-xl font-bold">
                        نقطے: {currentMufradatItem.dotDescription}
                      </span>
                    )}
                    {currentMufradatItem.makhrajDescription && (
                      <span className="bg-emerald-900/60 border border-emerald-600/50 text-emerald-200 px-3 py-1 rounded-xl font-bold max-w-md text-center">
                        مخرج: {currentMufradatItem.makhrajDescription}
                      </span>
                    )}
                    {currentMufradatItem.tajweedRuleTitle && (
                      <span className="bg-purple-900/60 border border-purple-600/50 text-purple-200 px-3 py-1 rounded-xl font-bold">
                        تجوید: {currentMufradatItem.tajweedRuleTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* INSTRUCTION */}
              <div className="flex items-center justify-between text-xs text-amber-200/90 bg-amber-950/40 border border-amber-500/30 px-4 py-2 rounded-xl">
                <span className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  نیچے دیے گئے مقناطیسی حروف میں سے درست حرف چن کر بورڈ کے خانے پر چپکائیں:
                </span>
                <span className="text-[11px] text-zinc-400">
                  حرف پر کلک کر کے سنیں اور بورڈ کے سلاٹ پر لگائیں
                </span>
              </div>

              {/* MAGNETIC BOARD DROP SLOTS */}
              <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-4 border-dashed border-amber-500/50 rounded-3xl p-6 sm:p-8 min-h-[160px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 shadow-inner relative">
                {mufradatSlots.map((word, sIdx) => {
                  const isFilled = word !== null;
                  const isCorrect = isFilled && word === currentMufradatItem.words[sIdx];

                  return (
                    <div
                      key={`muf-slot-${sIdx}`}
                      onClick={() => handleMufradatSlotClick(sIdx)}
                      className={`min-w-[70px] sm:min-w-[90px] h-20 sm:h-24 px-3 sm:px-4 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 relative select-none ${
                        isFilled
                          ? isCorrect
                            ? 'bg-gradient-to-b from-emerald-700 to-emerald-900 border-emerald-400 text-white shadow-xl scale-105'
                            : 'bg-gradient-to-b from-rose-800 to-rose-950 border-rose-500 text-white shadow-xl'
                          : mufradatSelectedId
                          ? 'bg-amber-950/40 border-amber-400 text-amber-300/50 border-dashed animate-pulse ring-2 ring-amber-400/40 scale-102'
                          : 'bg-zinc-950/60 border-zinc-700 text-zinc-600 border-dashed hover:border-amber-400/60'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-amber-300/70 absolute top-1 right-2">
                        {sIdx + 1}
                      </span>
                      {isFilled ? (
                        <>
                          <span
                            dir="rtl"
                            lang="ar"
                            className="text-3xl sm:text-4xl font-black font-arabic drop-shadow leading-none"
                          >
                            {word}
                          </span>
                          <span className="text-[9px] text-zinc-300 mt-1">ہٹانے کیلئے ٹیپ کریں</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl sm:text-2xl text-amber-400/60">؟</span>
                          <span className="text-[10px] text-zinc-400 font-bold">خانہ {sIdx + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* SUCCESS / COMPLETION BANNER */}
              {mufradatCompleted && (
                <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-2 border-emerald-400 rounded-3xl p-5 text-center shadow-2xl animate-bounce space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-300 text-base sm:text-xl font-black">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <span>ماشاء اللہ! آپ نے حرفِ تہجی کا درست انتخاب کیا! 🎉</span>
                  </div>
                  <p className="text-xs text-zinc-300">
                    بہترین! آپ کو <strong className="text-amber-300 font-black">+40 پوائنٹس</strong> اور{' '}
                    <strong className="text-amber-300 font-black">+20 سکے</strong> مل گئے ہیں۔
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={nextMufradatItem}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-black rounded-2xl text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      <span>اگلا حرف حل کریں</span>
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const soundToPlay = currentMufradatItem.letterNameArabic || currentMufradatItem.words.join(' ');
                        playQariText(soundToPlay);
                      }}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer border border-zinc-600 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>تلفظ دوبارہ سنیں</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MAGNETIC TILES BANK */}
              <div className="bg-zinc-900/90 border border-amber-500/40 rounded-3xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>مقناطیسی حروف کا بینک (Magnetic Tiles)</span>
                  </div>
                  <span className="text-[11px] text-zinc-400">حرف منتخب کرنے کیلئے کلک کریں</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 py-2">
                  {mufradatTileBank.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleMufradatTileClick(tile.id)}
                      disabled={tile.isUsed}
                      className={`min-w-[60px] sm:min-w-[76px] h-16 sm:h-20 px-3 sm:px-4 rounded-2xl flex flex-col items-center justify-center font-arabic text-2xl sm:text-3xl font-black transition-all cursor-pointer border-2 shadow-lg select-none relative ${
                        tile.isUsed
                          ? 'bg-zinc-950/60 border-zinc-800 text-zinc-700 opacity-40 cursor-not-allowed'
                          : mufradatSelectedId === tile.id
                          ? 'bg-gradient-to-b from-amber-400 to-yellow-500 border-amber-200 text-zinc-950 scale-110 shadow-2xl ring-4 ring-amber-400/60'
                          : 'bg-gradient-to-b from-zinc-800 to-zinc-900 hover:from-amber-600/30 hover:to-zinc-800 border-amber-500/50 text-amber-200 hover:border-amber-300 active:scale-95'
                      }`}
                    >
                      <span dir="rtl" lang="ar" className="leading-none drop-shadow-md">
                        {tile.text}
                      </span>
                      <span className="text-[9px] font-sans font-normal opacity-70 mt-1">مقناطیس</span>
                    </button>
                  ))}
                </div>

                {/* HELPER BUTTONS */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                  <button
                    onClick={() => {
                      const hintLetter = currentMufradatItem.words[0];
                      const hintTile = mufradatTileBank.find((t) => t.text === hintLetter && !t.isUsed);
                      if (hintTile) {
                        setMufradatSelectedId(hintTile.id);
                        speakText(hintLetter);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold rounded-xl border border-amber-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>اشارہ (Hint)</span>
                  </button>

                  <button
                    onClick={initMufradatPuzzle}
                    className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl border border-zinc-700 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ سیٹ کریں (Reset)</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 1: MUTAHARRIKAT (متحرکات - زبر، زیر، پیش والے کلمات)
             ========================================================================= */}
          {activeMode === 'mutaharrikat' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentMutaharrikItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        متحرکات کی مقناطیسی مشق (کُل {filteredMutaharrikatItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '⚡ تمام متحرکات' },
                      { id: 'zabar', label: '🔴 زَبَر کی مشق (16)' },
                      { id: 'zer', label: '🟢 زَیْر کی مشق (16)' },
                      { id: 'pesh', label: '🔵 پَیْش کی مشق (16)' },
                      { id: 'extra', label: '🌟 اضافی و امتحانی کلمات' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMutaharrikatCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          mutaharrikatCategory === cat.id
                            ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={mutaharrikatIndex}
                      onChange={(e) => setMutaharrikatIndex(Number(e.target.value))}
                      className="bg-amber-950 text-amber-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-amber-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                    >
                      {filteredMutaharrikatItems.map((item, idx) => (
                        <option key={item.id} value={idx}>
                          {idx + 1}. {item.arabicPhrase} ({item.categoryLabelUrdu})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMutaharrikatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="پچھلا کلمہ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMutaharrikatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="اگلا کلمہ"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {filteredMutaharrikatItems.slice(0, 15).map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setMutaharrikatIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          mutaharrikatIndex === idx
                            ? 'bg-amber-500 text-zinc-950 font-black shadow-lg ring-2 ring-amber-300'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET WORD BANNER WITH GLIDE ANIMATION */}
              <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-2 border-amber-500/60 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-4 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>مطلوبہ متحرک کلمہ (زبر، زیر، پیش)</span>
                </div>

                <div className="py-3 flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-zinc-950/80 border border-amber-500/40 px-6 py-3.5 rounded-2xl shadow-inner">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-4xl sm:text-6xl font-black text-amber-300 font-arabic tracking-normal select-none drop-shadow-lg"
                    >
                      {currentMutaharrikItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => speakText(currentMutaharrikItem.arabicPhrase)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 تلفظ سنیں</span>
                    </button>
                  </div>

                  {currentMutaharrikItem.breakdown && (
                    <div className="flex items-center gap-2 text-xs text-amber-200/80 font-bold bg-amber-950/40 px-3 py-1 rounded-lg border border-amber-500/20">
                      <span>جوڑ / ہجے:</span>
                      <span className="font-arabic text-sm text-amber-300">{currentMutaharrikItem.breakdown}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* MAGNETIC BOARD SLOTS (TARGET DROP AREA) */}
              <div className="bg-zinc-950 border-4 border-dashed border-amber-500/50 rounded-3xl p-6 min-h-[170px] flex flex-col items-center justify-center gap-4 relative shadow-inner">
                <div className="absolute top-2.5 right-4 bg-amber-950/80 border border-amber-500/50 px-3 py-0.5 rounded-full text-[10px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>مقناطیسی بورڈ کے خانے (ترتیب سے رکھیں)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                  {mutaharrikatSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleMutaharrikatSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-amber-600 border-amber-300 text-zinc-950 font-black animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-amber-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">حرف {idx + 1}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-2xl sm:text-3xl font-black font-arabic tracking-normal text-white"
                      >
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Celebration Banner when solved */}
                {mutaharrikatCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-2 border-amber-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-amber-300">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">ماشاء اللہ! متحرک کلمہ درست جوڑا گیا 🎉</h3>
                        <p className="text-xs text-amber-300">+60 پوائنٹس اور +30 سکے شامل ہو گئے!</p>
                      </div>
                    </div>

                    <button
                      onClick={nextMutaharrikatItem}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا کلمہ ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300">
                      میز پر موجود تختی ٹکڑے (اوپر بورڈ پر رکھنے کے لیے کلک کریں):
                    </span>
                    {mutaharrikatSelectedId && (
                      <span className="bg-amber-500 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initMutaharrikatPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {mutaharrikatTileBank.map((tile) => {
                    const isSelected = mutaharrikatSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleMutaharrikatTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-amber-400 border-white text-zinc-950 ring-4 ring-amber-400/50 scale-105'
                            : 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-400/70 text-white hover:border-amber-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 2: SUKOON & QALQALAH (سکون و جزم اور حروفِ قلقلہ)
             ========================================================================= */}
          {activeMode === 'sukoon' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-emerald-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                      <Layers className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-emerald-300">{currentSukoonItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سکون و جزم و قلقلہ کی مقناطیسی مشق (کُل {filteredSukoonItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '⚡ تمام ساکن کلمات' },
                      { id: 'page1', label: '📖 ۲ حرفی ساکن مشق' },
                      { id: 'page2', label: '📜 ۳ و ۴ حرفی مرکبات' },
                      { id: 'qalqalah', label: '🔴 حروفِ قلقلہ مشق' },
                      { id: 'hamzah', label: '🟢 ہمزہ ساکنہ مشق' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSukoonCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          sukoonCategory === cat.id
                            ? 'bg-emerald-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={sukoonIndex}
                      onChange={(e) => setSukoonIndex(Number(e.target.value))}
                      className="bg-emerald-950 text-emerald-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-emerald-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                    >
                      {filteredSukoonItems.map((item, idx) => (
                        <option key={item.id} value={idx}>
                          {idx + 1}. {item.arabicPhrase} ({item.categoryLabelUrdu})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevSukoonItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="پچھلا کلمہ"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextSukoonItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="اگلا کلمہ"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {filteredSukoonItems.slice(0, 15).map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setSukoonIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          sukoonIndex === idx
                            ? 'bg-emerald-500 text-zinc-950 font-black shadow-lg ring-2 ring-emerald-300'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET WORD BANNER */}
              <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-2 border-emerald-500/60 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-4 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>
                    {currentSukoonItem.isQalqalah
                      ? 'مطلوبہ کلمۂ قلقلہ (قطب جد)'
                      : currentSukoonItem.isHamzahSakinah
                      ? 'مطلوبہ کلمۂ ہمزہ ساکنہ (جھٹکا)'
                      : 'مطلوبہ ساکن کلمہ (جزم)'}
                  </span>
                </div>

                <div className="py-3 flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-zinc-950/80 border border-emerald-500/40 px-6 py-3.5 rounded-2xl shadow-inner">
                    <span
                      dir="rtl"
                      lang="ar"
                      className={`text-4xl sm:text-6xl font-black font-arabic tracking-normal select-none drop-shadow-lg ${
                        currentSukoonItem.isQalqalah
                          ? 'text-rose-400'
                          : currentSukoonItem.isHamzahSakinah
                          ? 'text-emerald-400'
                          : 'text-emerald-200'
                      }`}
                    >
                      {currentSukoonItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => speakText(currentSukoonItem.arabicPhrase)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 تلفظ سنیں</span>
                    </button>
                  </div>

                  {currentSukoonItem.tajweedRuleTitle && (
                    <div className="flex items-center gap-2 text-xs text-emerald-200/90 font-bold bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تجویدی قاعدہ: {currentSukoonItem.tajweedRuleTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SUKOON TARGET SLOTS */}
              <div className="bg-zinc-950 border-4 border-dashed border-emerald-500/50 rounded-3xl p-6 min-h-[170px] flex flex-col items-center justify-center gap-4 relative shadow-inner">
                <div className="absolute top-2.5 right-4 bg-emerald-950/80 border border-emerald-500/50 px-3 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>مقناطیسی بورڈ کے خانے (ساکن و متحرک حروف)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                  {sukoonSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSukoonSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-emerald-700 border-emerald-300 text-white font-black animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-emerald-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">ٹکڑا {idx + 1}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-2xl sm:text-3xl font-black font-arabic tracking-normal text-white"
                      >
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Celebration Banner when solved */}
                {sukoonCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 border-2 border-emerald-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">بہت خوب! ساکن کلمہ بالکل درست جوڑا گیا 🎉</h3>
                        <p className="text-xs text-emerald-300">+75 پوائنٹس اور +35 سکے حاصل ہو گئے!</p>
                      </div>
                    </div>

                    <button
                      onClick={nextSukoonItem}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا کلمہ ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SUKOON TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      نیچے سے ساکن و متحرک ٹکڑے منتخب کریں:
                    </span>
                    {sukoonSelectedId && (
                      <span className="bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initSukoonPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {sukoonTileBank.map((tile) => {
                    const isSelected = sukoonSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleSukoonTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-emerald-400 border-white text-zinc-950 ring-4 ring-emerald-400/50 scale-105'
                            : 'bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-400/70 text-white hover:border-emerald-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 3: MURAKKABAT & COMPOUND LETTERS (مرکبات و حروف)
             ========================================================================= */}
          {activeMode === 'murakkabat' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-sky-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/50 flex items-center justify-center text-sky-300">
                      <BookOpen className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-sky-300">{currentMurakkabItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        ۲ حرفی، ۳ حرفی مرکبات اور مقطعات کی مشق (کُل {filteredMurakkabatItems.length} مرکبات)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '⚡ تمام مرکبات' },
                      { id: '2-letter', label: '✌️ ۲ حرفی مرکبات' },
                      { id: '3-letter', label: '🤟 ۳ حرفی مرکبات' },
                      { id: 'muqattaat', label: '🌟 حروفِ مقطعات' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMurakkabatCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          murakkabatCategory === cat.id
                            ? 'bg-sky-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={murakkabatIndex}
                      onChange={(e) => setMurakkabatIndex(Number(e.target.value))}
                      className="bg-sky-950 text-sky-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-sky-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                    >
                      {filteredMurakkabatItems.map((item, idx) => (
                        <option key={item.id} value={idx}>
                          {idx + 1}. {item.arabicPhrase} ({item.title})
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMurakkabatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="پچھلا مرکب"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMurakkabatItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="اگلا مرکب"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {filteredMurakkabatItems.slice(0, 15).map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setMurakkabatIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          murakkabatIndex === idx
                            ? 'bg-sky-500 text-zinc-950 font-black shadow-lg ring-2 ring-sky-300'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET WORD BANNER */}
              <div className="bg-gradient-to-r from-sky-950 via-zinc-900 to-sky-950 border-2 border-sky-500/60 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-4 bg-sky-500/20 border border-sky-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-sky-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
                  <span>مطلوبہ مرکب / مقطعات</span>
                </div>

                <div className="py-3 flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-zinc-950/80 border border-sky-500/40 px-6 py-3.5 rounded-2xl shadow-inner">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-4xl sm:text-6xl font-black text-sky-300 font-arabic tracking-normal select-none drop-shadow-lg"
                    >
                      {currentMurakkabItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => speakText(currentMurakkabItem.arabicPhrase)}
                      className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 تلفظ سنیں</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* MURAKKABAT TARGET SLOTS */}
              <div className="bg-zinc-950 border-4 border-dashed border-sky-500/50 rounded-3xl p-6 min-h-[170px] flex flex-col items-center justify-center gap-4 relative shadow-inner">
                <div className="absolute top-2.5 right-4 bg-sky-950/80 border border-sky-500/50 px-3 py-0.5 rounded-full text-[10px] font-bold text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>مقناطیسی بورڈ کے خانے (حروف کی ترتیب)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                  {murakkabatSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleMurakkabatSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-sky-700 border-sky-300 text-white font-black animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-sky-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">حرف {idx + 1}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-2xl sm:text-3xl font-black font-arabic tracking-normal text-white"
                      >
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Celebration Banner */}
                {murakkabatCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-sky-950 via-zinc-900 to-sky-950 border-2 border-sky-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-500/25 border border-sky-400/50 flex items-center justify-center text-sky-300">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">بہت خوب! مرکب مکمل ہو گیا 🎉</h3>
                        <p className="text-xs text-sky-300">+50 پوائنٹس اور +25 سکے مل گئے!</p>
                      </div>
                    </div>

                    <button
                      onClick={nextMurakkabatItem}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا مرکب ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* MURAKKABAT TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-sky-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-300">
                      نیچے سے حروف چن کر اوپر خانوں میں رکھیں:
                    </span>
                    {murakkabatSelectedId && (
                      <span className="bg-sky-500 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        حرف منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initMurakkabatPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {murakkabatTileBank.map((tile) => {
                    const isSelected = murakkabatSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleMurakkabatTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-sky-400 border-white text-zinc-950 ring-4 ring-sky-400/50 scale-105'
                            : 'bg-gradient-to-br from-sky-600 to-blue-800 border-sky-400/70 text-white hover:border-sky-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 5: HUROOF LEEN (سبق نمبر ۵: حروفِ لین - واؤ لین و یاء لین)
             ========================================================================= */}
          {activeMode === 'leen' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-teal-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-teal-300">{currentLeenItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق نمبر ۵: بغیر کھینچے، نرم آواز کے ساتھ ادا کریں (کُل {filteredLeenItems.length} آئٹمز)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '⚡ تمام' },
                      { id: 'pairs', label: '🔗 ۲۹ جوڑیاں' },
                      { id: 'waw', label: '🌙 واؤ لین' },
                      { id: 'yaa', label: '🌸 یاء لین' },
                      { id: 'heavy', label: '🛡️ مستعلیہ (پُر)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setLeenCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          leenCategory === cat.id
                            ? 'bg-teal-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                    <div className="flex items-center gap-2">
                      <select
                        value={leenIndex}
                        onChange={(e) => setLeenIndex(Number(e.target.value))}
                        className="bg-teal-950 text-teal-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-teal-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                      >
                        {filteredLeenItems.map((item, idx) => (
                          <option key={item.id} value={idx}>
                            {idx + 1}. {item.arabicPhrase} ({item.categoryLabelUrdu})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={prevLeenItem}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                          title="پچھلا کلمہ"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextLeenItem}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                          title="اگلا کلمہ"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <span className="text-xs text-teal-400 font-bold bg-teal-950/80 px-3 py-1 rounded-xl border border-teal-500/40 shrink-0">
                      کلمہ {leenIndex + 1} از {filteredLeenItems.length}
                    </span>
                  </div>

                  {/* Horizontal Scrollable Word Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 bg-zinc-950/70 rounded-xl border border-zinc-800/80 scrollbar-thin scrollbar-thumb-teal-600/40" dir="rtl">
                    {filteredLeenItems.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setLeenIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-arabic font-bold transition-all shrink-0 cursor-pointer ${
                          leenIndex === idx
                            ? 'bg-teal-500 text-zinc-950 font-black shadow-lg shadow-teal-500/30 scale-105'
                            : 'bg-zinc-900 text-teal-200/90 hover:bg-zinc-800 border border-zinc-800 hover:border-teal-500/30'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET WORD SHOWCASE & TAJWEED INFO */}
              <div className="bg-gradient-to-r from-zinc-950 via-teal-950/40 to-zinc-950 border-2 border-teal-500/40 rounded-3xl p-5 sm:p-6 text-center space-y-3 relative overflow-hidden shadow-2xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-right">
                    <span className="text-xs text-teal-400 font-bold block mb-1">
                      🎯 ہدف: نیچے دیے گئے مقناطیسی ٹکڑوں سے جوڑیں
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">
                      ہجے: {currentLeenItem.spellingHijja || currentLeenItem.breakdown}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-4xl sm:text-5xl font-black font-arabic tracking-normal text-teal-300 drop-shadow-[0_2px_12px_rgba(45,212,191,0.5)]"
                    >
                      {currentLeenItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => speakText(currentLeenItem.arabicPhrase)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>🔊 تلفظ سنیں</span>
                    </button>
                  </div>

                  {currentLeenItem.tajweedRuleTitle && (
                    <div className="flex items-center gap-2 text-xs text-teal-200/90 font-bold bg-teal-950/60 px-3.5 py-1.5 rounded-xl border border-teal-500/30">
                      <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                      <span>تجویدی قاعدہ: {currentLeenItem.tajweedRuleTitle}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* LEEN TARGET SLOTS */}
              <div className="bg-zinc-950 border-4 border-dashed border-teal-500/50 rounded-3xl p-6 min-h-[170px] flex flex-col items-center justify-center gap-4 relative shadow-inner">
                <div className="absolute top-2.5 right-4 bg-teal-950/80 border border-teal-500/50 px-3 py-0.5 rounded-full text-[10px] font-bold text-teal-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>مقناطیسی بورڈ کے خانے (حروفِ لین)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                  {leenSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleLeenSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-teal-700 border-teal-300 text-white font-black animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-teal-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">ٹکڑا {idx + 1}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-2xl sm:text-3xl font-black font-arabic tracking-normal text-white"
                      >
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Celebration Banner when solved */}
                {leenCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-teal-950 via-zinc-900 to-teal-950 border-2 border-teal-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/25 border border-teal-400/50 flex items-center justify-center text-teal-300">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">بہت خوب! حروفِ لین درست ترتیب میں فٹ ہو گئے 🎉</h3>
                        <p className="text-xs text-teal-300">+70 پوائنٹس اور +35 سکے حاصل ہو گئے!</p>
                      </div>
                    </div>

                    <button
                      onClick={nextLeenItem}
                      className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا کلمہ ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* LEEN TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-teal-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-teal-300">
                      نیچے سے حروفِ لین کے ٹکڑے منتخب کریں:
                    </span>
                    {leenSelectedId && (
                      <span className="bg-teal-500 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initLeenPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {leenTileBank.map((tile) => {
                    const isSelected = leenSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleLeenTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-teal-400 border-white text-zinc-950 ring-4 ring-teal-400/50 scale-105'
                            : 'bg-gradient-to-br from-teal-600 to-emerald-800 border-teal-400/70 text-white hover:border-teal-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 4: HUROOF MADDAH (حروفِ مدہ - الف مدہ، واؤ مدہ، یاء مدہ و قرآنی کلمات)
             ========================================================================= */}
          {activeMode === 'maddah' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentMaddahItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        ایک الف (۲ حرکات) کھینچ کر ادا کریں (کُل {filteredMaddahItems.length} آئٹمز)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '⚡ تمام' },
                      { id: 'triplets', label: '✨ ثلاثی جوڑیاں' },
                      { id: 'alif', label: '🟢 الف مدہ' },
                      { id: 'waw', label: '🔵 واؤ مدہ' },
                      { id: 'yaa', label: '🟣 یاء مدہ' },
                      { id: 'words', label: '📖 قرآنی کلمات' },
                      { id: 'heavy', label: '🛡️ مستعلیہ (پُر)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setMaddahCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          maddahCategory === cat.id
                            ? 'bg-amber-400 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                    <div className="flex items-center gap-2">
                      <select
                        value={maddahIndex}
                        onChange={(e) => setMaddahIndex(Number(e.target.value))}
                        className="bg-amber-950 text-amber-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-amber-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                      >
                        {filteredMaddahItems.map((item, idx) => (
                          <option key={item.id} value={idx}>
                            {idx + 1}. {item.arabicPhrase} ({item.categoryLabelUrdu})
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={prevMaddahItem}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                          title="پچھلا کلمہ"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextMaddahItem}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                          title="اگلا کلمہ"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <span className="text-xs text-amber-400 font-bold bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/40 shrink-0">
                      آئٹم {maddahIndex + 1} از {filteredMaddahItems.length}
                    </span>
                  </div>

                  {/* Horizontal Scrollable Word Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 px-1 bg-zinc-950/70 rounded-xl border border-zinc-800/80 scrollbar-thin scrollbar-thumb-amber-600/40" dir="rtl">
                    {filteredMaddahItems.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setMaddahIndex(idx)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-arabic font-bold transition-all shrink-0 cursor-pointer ${
                          maddahIndex === idx
                            ? 'bg-amber-400 text-zinc-950 font-black shadow-lg shadow-amber-500/30 scale-105'
                            : 'bg-zinc-900 text-amber-200/90 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/30'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET MAGNETIC PUZZLE BOARD */}
              <div className="bg-zinc-950/90 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 shadow-inner relative flex flex-col items-center justify-center min-h-[250px] space-y-4">
                {/* Board Info Top Bar */}
                <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">جوڑ اور ہجے:</span>
                    <span className="text-zinc-300 font-arabic font-semibold bg-zinc-900 px-3 py-1 rounded-xl border border-zinc-800">
                      {currentMaddahItem.breakdown}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(currentMaddahItem.arabicPhrase)}
                      className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-amber-500/40 transition-all active:scale-95"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>مکمل آواز سنیں</span>
                    </button>

                    <button
                      onClick={() => speakText(currentMaddahItem.spellingHijja)}
                      className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer border border-yellow-500/40 transition-all active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ہجے سنیں</span>
                    </button>
                  </div>
                </div>

                {/* Tajweed Guidance Note */}
                <div className="w-full bg-amber-950/30 border border-amber-500/30 rounded-xl p-2.5 text-center">
                  <span className="text-xs text-amber-200 font-bold">
                    💡 تجوید کا قاعدہ: {currentMaddahItem.tajweedRuleTitle}
                  </span>
                </div>

                {/* Target Slots */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                  {maddahSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleMaddahSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-amber-600 border-amber-300 text-white font-black animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-amber-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">ٹکڑا {idx + 1}</span>
                      <span
                        dir="rtl"
                        lang="ar"
                        className="text-2xl sm:text-3xl font-black font-arabic tracking-normal text-white"
                      >
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Celebration Banner when solved */}
                {maddahCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-amber-950 via-zinc-900 to-amber-950 border-2 border-amber-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-amber-300">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">بہت خوب! حروفِ مدہ درست ترتیب میں فٹ ہو گئے 🎉</h3>
                        <p className="text-xs text-amber-300">+80 پوائنٹس اور +40 سکے حاصل ہو گئے!</p>
                      </div>
                    </div>

                    <button
                      onClick={nextMaddahItem}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا کلمہ ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* MADDAH TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300">
                      نیچے سے حروفِ مدہ کے ٹکڑے منتخب کریں:
                    </span>
                    {maddahSelectedId && (
                      <span className="bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initMaddahPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {maddahTileBank.map((tile) => {
                    const isSelected = maddahSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleMaddahTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-amber-400 border-white text-zinc-950 ring-4 ring-amber-400/50 scale-105'
                            : 'bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 border-amber-400/70 text-white hover:border-amber-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 6: KHARI HARAKAT (سبق نمبر ۷: کھڑی حرکات - کھڑا زبر ، کھڑا زیر ، الٹا پیش)
             ========================================================================= */}
          {activeMode === 'khari_harakat' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-emerald-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-emerald-300">{currentKhariItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۷: کھڑی حرکات بمطابق مدنی قاعدہ (کُل {filteredKhariItems.length} آئٹمز)
                      </p>
                    </div>
                  </div>

                  {/* Filter Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '🌟 سبھی' },
                      { id: 'triplets', label: '📑 ثلاثی (۲۸)' },
                      { id: 'khara_zabar', label: 'ـٰ کھڑا زبر' },
                      { id: 'khara_zer', label: 'ـٖ کھڑا زیر' },
                      { id: 'ulta_pesh', label: 'ـٗ الٹا پیش' },
                      { id: 'words', label: '📖 قرآنی کلمات' },
                      { id: 'heavy', label: '🟢 پُر حروف' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setKhariHarakatCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          khariHarakatCategory === cat.id
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Word Navigator Dropdown + Quick Buttons */}
                <div className="flex items-center justify-between gap-2 overflow-x-auto max-w-full pb-1">
                  <div className="flex items-center gap-2">
                    <select
                      value={khariHarakatIndex}
                      onChange={(e) => setKhariHarakatIndex(Number(e.target.value))}
                      className="bg-emerald-950 text-emerald-300 font-extrabold text-xs px-3 py-2 rounded-xl border border-emerald-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                    >
                      {filteredKhariItems.map((item, idx) => (
                        <option key={item.id} value={idx}>
                          {idx + 1}. {item.title}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevKhariItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="پچھلا آئٹم"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextKhariItem}
                        className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                        title="اگلا آئٹم"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {filteredKhariItems.slice(0, 14).map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setKhariHarakatIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          khariHarakatIndex === idx
                            ? 'bg-emerald-500 text-zinc-950 font-black shadow-lg ring-2 ring-emerald-300'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                        }`}
                      >
                        {item.arabicPhrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* TARGET KHARI HARAKAT BANNER */}
              <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 border-2 border-emerald-500/60 rounded-3xl p-5 text-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-2 right-4 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>مطلوبہ کلمہ / کھڑی حرکت</span>
                </div>

                <div className="py-3 flex flex-col items-center justify-center gap-3">
                  <div className="flex flex-wrap items-center justify-center gap-4 bg-zinc-950/80 border border-emerald-500/40 px-6 py-3.5 rounded-2xl shadow-inner">
                    <span
                      dir="rtl"
                      lang="ar"
                      className="text-5xl sm:text-7xl font-black text-emerald-300 font-arabic tracking-normal select-none drop-shadow-lg"
                    >
                      {currentKhariItem.arabicPhrase}
                    </span>

                    <button
                      onClick={() => speakText(currentKhariItem.arabicPhrase)}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 flex items-center justify-center cursor-pointer shadow-lg transform transition-all hover:scale-110 active:scale-95 border-2 border-emerald-300"
                      title="قاری کی آواز سنیں"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>

                  {currentKhariItem.spellingHijja && (
                    <div className="bg-zinc-950/70 border border-emerald-500/30 px-4 py-2 rounded-xl text-xs sm:text-sm text-emerald-200 font-bold max-w-2xl flex items-center justify-between gap-3 shadow-md">
                      <span>📖 ہجے: {currentKhariItem.spellingHijja}</span>
                      <button
                        onClick={() => speakText(currentKhariItem.spellingHijja!)}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-amber-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>ہجے سنیں</span>
                      </button>
                    </div>
                  )}

                  {currentKhariItem.tajweedRuleTitle && (
                    <div className="inline-block bg-teal-950/70 border border-teal-500/40 px-3.5 py-1 rounded-full text-xs text-teal-300 font-bold">
                      💡 تجویدی قاعدہ: {currentKhariItem.tajweedRuleTitle}
                    </div>
                  )}
                </div>
              </div>

              {/* MAGNETIC DROP TARGET SLOTS */}
              <div className="bg-zinc-950/90 border-2 border-dashed border-emerald-500/50 rounded-3xl p-5 sm:p-7 shadow-inner space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-300">
                      مقناطیسی بورڈ پر درست ترتیب سے جوڑیں:
                    </span>
                    <span className="text-xs text-zinc-400">
                      (خانے پر کلک کر کے ٹکڑا لگائیں یا ہٹائیں)
                    </span>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/60 text-emerald-300">
                    {khariHarakatSlots.filter((s) => s !== null).length} / {currentKhariItem.words.length} ٹکڑے مکمل
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4" dir="rtl">
                  {khariHarakatSlots.map((slotWord, idx) => {
                    const isFilled = slotWord !== null;
                    const isCorrectSoFar = slotWord === currentKhariItem.words[idx];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleKhariHarakatSlotClick(idx)}
                        className={`min-w-24 sm:min-w-28 h-20 sm:h-24 rounded-2xl border-3 flex flex-col items-center justify-center font-black text-3xl sm:text-4xl shadow-xl transition-all cursor-pointer relative font-arabic ${
                          isFilled
                            ? isCorrectSoFar
                              ? 'bg-gradient-to-br from-emerald-600 to-teal-800 border-emerald-300 text-white shadow-emerald-900/50'
                              : 'bg-gradient-to-br from-red-700 to-amber-900 border-red-400 text-white shadow-red-900/50'
                            : khariHarakatSelectedId
                            ? 'bg-zinc-900/90 border-emerald-400 border-dashed animate-pulse text-emerald-400 hover:bg-emerald-950/40'
                            : 'bg-zinc-900/80 border-zinc-700 border-dashed text-zinc-600 hover:border-zinc-500'
                        }`}
                      >
                        <span className="text-[10px] absolute top-1.5 right-2 font-mono text-zinc-400">
                          #{idx + 1}
                        </span>
                        {isFilled ? slotWord : '?'}
                      </button>
                    );
                  })}
                </div>

                {khariHarakatCompleted && (
                  <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-400 text-zinc-950 flex items-center justify-center font-black text-xl">
                        ✓
                      </div>
                      <div>
                        <h3 className="font-black text-emerald-200 text-base">ماشاء اللہ! بالکل درست</h3>
                        <p className="text-xs text-emerald-300">آپ نے کھڑی حرکات کا کلمہ مکمل طور پر درست ترتیب دیا ہے (+80 پوائنٹس)</p>
                      </div>
                    </div>

                    <button
                      onClick={nextKhariItem}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                    >
                      <span>اگلا کلمہ ←</span>
                    </button>
                  </div>
                )}
              </div>

              {/* KHARI HARAKAT TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      نیچے سے کھڑی حرکات کے ٹکڑے منتخب کریں:
                    </span>
                    {khariHarakatSelectedId && (
                      <span className="bg-emerald-400 text-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initKhariHarakatPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {khariHarakatTileBank.map((tile) => {
                    const isSelected = khariHarakatSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleKhariHarakatTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-emerald-400 border-white text-zinc-950 ring-4 ring-emerald-400/50 scale-105'
                            : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 border-emerald-400/70 text-white hover:border-emerald-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 8: TANWEEN PUZZLES (سبق ۸: تنوین - دو زبر، دو زیر، دو پیش)
             ========================================================================= */}
          {activeMode === 'tanween' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentTanweenItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۸: تنوین کی مقناطیسی مشق (کُل {TANWEEN_ITEMS.length} کلمات و ثلاثیات)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={prevTanweenItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer">
                    پچھلا
                  </button>
                  <span className="text-xs font-bold text-amber-400">
                    {tanweenIndex + 1} / {TANWEEN_ITEMS.length}
                  </span>
                  <button onClick={nextTanweenItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30 cursor-pointer">
                    اگلا
                  </button>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-amber-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentTanweenItem.words.map((_, idx) => {
                      const isFilled = tanweenSlots[idx] !== null;
                      return (
                        <div
                          key={`tan-slot-${idx}`}
                          onClick={() => handleTanweenSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-4xl sm:text-5xl font-black transition-all cursor-pointer relative ${
                            isFilled
                              ? tanweenCompleted
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105'
                                : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : tanweenSelectedId
                                ? 'border-amber-400 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? tanweenSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {tanweenTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleTanweenTileClick(tile.id)}
                        disabled={tile.isUsed || tanweenCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : tanweenSelectedId === tile.id
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {tanweenCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-emerald-950/90 border-4 border-emerald-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(16,185,129,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-emerald-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-emerald-200 font-bold">آپ نے تنوین کا لفظ درست جوڑ لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-amber-400 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 9: TASHDEED PUZZLES (سبق ۹: تشدید و غنہ)
             ========================================================================= */}
          {activeMode === 'tashdeed' && (
            <>
              {/* Category Filter & Selector */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentTashdeedItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۹: تشدید اور غنہ کی مقناطیسی مشق (کُل {TASHDEED_ITEMS.length} کلمات)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={prevTashdeedItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30">
                    پچھلا
                  </button>
                  <span className="text-xs font-bold text-amber-400">
                    {tashdeedIndex + 1} / {TASHDEED_ITEMS.length}
                  </span>
                  <button onClick={nextTashdeedItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-bold border border-amber-500/30">
                    اگلا
                  </button>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-slate-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentTashdeedItem.words.map((_, idx) => {
                      const isFilled = tashdeedSlots[idx] !== null;
                      return (
                        <div
                          key={`slot-${idx}`}
                          onClick={() => handleTashdeedSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-4xl sm:text-5xl font-black transition-all cursor-pointer relative ${
                            isFilled
                              ? tashdeedCompleted
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105'
                                : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : tashdeedSelectedId
                                ? 'border-amber-400 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? tashdeedSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {tashdeedTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleTashdeedTileClick(tile.id)}
                        disabled={tile.isUsed || tashdeedCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black transition-all ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : tashdeedSelectedId === tile.id
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 border-2 border-yellow-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {tashdeedCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-emerald-950/90 border-4 border-emerald-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(16,185,129,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-emerald-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-emerald-200 font-bold">آپ نے درست لفظ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-amber-400 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 10: NUN SAKIN & TANWEEN (سبق ۱۰: نون ساکن و تنوین کے قواعد)
             ========================================================================= */}
          {activeMode === 'nun_sakin' && (
            <>
              {/* Nun Sakin Header & Sub-category Filter */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-teal-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-teal-300">{currentNunSakinItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۱۰: نون ساکن و تنوین کے قواعد (کُل {filteredNunSakinItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tabs: All, Izhar, Ikhfa, Idgham with Ghunnah, Idgham without Ghunnah, Iqlab */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '✨ تمام قواعد' },
                      { id: 'izhar', label: '🟢 اظہار (حلق)' },
                      { id: 'ikhfa', label: '🔴 اخفاء (ناک)' },
                      { id: 'idgham_with_ghunnah', label: '🟡 ادغام مع الغنہ' },
                      { id: 'idgham_without_ghunnah', label: '🔵 ادغام بلا غنہ' },
                      { id: 'iqlab', label: '🟣 اقلاب (میم)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setNunSakinCategory(cat.id as any)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          nunSakinCategory === cat.id
                            ? 'bg-teal-500 text-zinc-950 font-black shadow-md'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={prevNunSakinItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-teal-300 text-xs font-bold border border-teal-500/30">
                    پچھلا
                  </button>
                  <span className="text-xs font-bold text-teal-400">
                    {nunSakinIndex + 1} / {filteredNunSakinItems.length}
                  </span>
                  <button onClick={nextNunSakinItem} className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-teal-300 text-xs font-bold border border-teal-500/30">
                    اگلا
                  </button>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-teal-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentNunSakinItem.words.map((_, idx) => {
                      const isFilled = nunSakinSlots[idx] !== null;
                      return (
                        <div
                          key={`nun-sakin-slot-${idx}`}
                          onClick={() => handleNunSakinSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer relative font-arabic ${
                            isFilled
                              ? nunSakinCompleted
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105'
                                : 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.2)]'
                              : nunSakinSelectedId
                                ? 'border-teal-400 bg-teal-500/10 shadow-[inset_0_0_20px_rgba(20,184,166,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? nunSakinSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {nunSakinTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleNunSakinTileClick(tile.id)}
                        disabled={tile.isUsed || nunSakinCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all font-arabic ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : nunSakinSelectedId === tile.id
                              ? 'bg-gradient-to-br from-teal-400 to-cyan-600 text-zinc-950 border-2 border-teal-200 shadow-[0_0_20px_rgba(20,184,166,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {nunSakinCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-teal-950/90 border-4 border-teal-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(20,184,166,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-teal-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-teal-200 font-bold">آپ نے درست تجویدی کلمہ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-teal-300 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 11: MEEM SAKIN (سبق ۱۱: میم ساکن کے ۳ قواعد)
             ========================================================================= */}
          {activeMode === 'meem_sakin' && (
            <>
              {/* Meem Sakin Header & Sub-category Filter */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-blue-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-blue-300">{currentMeemSakinItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۱۱: میم ساکن کے قواعد (کُل {filteredMeemSakinItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tabs: All, Idgham, Ikhfa, Izhar */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '✨ تمام قواعد' },
                      { id: 'idgham', label: '🟢 ادغامِ شفوی (م + م)' },
                      { id: 'ikhfa', label: '🔴 اخفائے شفوی (م + ب)' },
                      { id: 'izhar', label: '🔵 اظہارِ شفوی (باقی حروف)' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setMeemSakinCategory(cat.id as any);
                          setMeemSakinIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          meemSakinCategory === cat.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Info & Nav */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(currentMeemSakinItem.arabicPhrase)}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-xs font-black flex items-center gap-1.5 border border-blue-500/30 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>صوتی تلفظ سنیں</span>
                    </button>
                    <span className="text-xs font-bold text-zinc-300">{currentMeemSakinItem.tajweedRuleTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">
                      کلمہ {meemSakinIndex + 1} از {filteredMeemSakinItems.length}
                    </span>
                    <button
                      onClick={prevMeemSakinItem}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMeemSakinItem}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-blue-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentMeemSakinItem.words.map((_, idx) => {
                      const isFilled = meemSakinSlots[idx] !== null;
                      return (
                        <div
                          key={`meem-sakin-slot-${idx}`}
                          onClick={() => handleMeemSakinSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer relative font-arabic ${
                            isFilled
                              ? meemSakinCompleted
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105'
                                : 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                              : meemSakinSelectedId
                                ? 'border-blue-400 bg-blue-500/10 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? meemSakinSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {meemSakinTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleMeemSakinTileClick(tile.id)}
                        disabled={tile.isUsed || meemSakinCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all font-arabic ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : meemSakinSelectedId === tile.id
                              ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white border-2 border-blue-200 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {meemSakinCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-blue-950/90 border-4 border-blue-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(59,130,246,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-blue-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-blue-200 font-bold">آپ نے میم ساکن کا درست تجویدی کلمہ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-blue-300 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 12: TAFKHEEM & TARQEEQ (سبق ۱۲: تفخیم و ترقیق - پُر و باریک)
             ========================================================================= */}
          {activeMode === 'tafkheem_tarqeeq' && (
            <>
              {/* Tafkheem Header & Sub-category Filter */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-amber-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-amber-300">{currentTafkheemItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۱۲: تفخیم و ترقیق کے قواعد (کُل {filteredTafkheemItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tabs: All, Alif, Laam, Raa */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '✨ تمام قواعد' },
                      { id: 'alif', label: '🔤 الف پُر و باریک' },
                      { id: 'laam', label: '👑 لامِ اسمِ جلالت' },
                      { id: 'raa', label: '🎯 راء پُر و باریک' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setTafkheemCategory(cat.id as any);
                          setTafkheemIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          tafkheemCategory === cat.id
                            ? 'bg-amber-500 text-zinc-950 shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Info & Nav */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakText(currentTafkheemItem.arabicPhrase)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-black flex items-center gap-1.5 border border-amber-500/30 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>صوتی تلفظ سنیں</span>
                    </button>
                    <span className="text-xs font-bold text-zinc-300">{currentTafkheemItem.tajweedRuleTitle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">
                      کلمہ {tafkheemIndex + 1} از {filteredTafkheemItems.length}
                    </span>
                    <button
                      onClick={prevTafkheemItem}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextTafkheemItem}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Magnet Board */}
              <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 border-4 border-amber-700/80 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-8 min-h-[250px]">
                  {/* Slots */}
                  <div className="flex items-center justify-center gap-4 flex-wrap" dir="rtl">
                    {currentTafkheemItem.words.map((_, idx) => {
                      const isFilled = tafkheemSlots[idx] !== null;
                      return (
                        <div
                          key={`tafkheem-slot-${idx}`}
                          onClick={() => handleTafkheemSlotClick(idx)}
                          className={`w-24 h-28 sm:w-28 sm:h-32 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl sm:text-4xl font-black transition-all cursor-pointer relative font-arabic ${
                            isFilled
                              ? tafkheemCompleted
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-105'
                                : 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : tafkheemSelectedId
                                ? 'border-amber-400 bg-amber-500/10 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)] animate-pulse'
                                : 'border-slate-600 bg-slate-800/50 text-slate-500 hover:border-slate-500'
                          }`}
                        >
                          {isFilled ? tafkheemSlots[idx] : '?'}
                        </div>
                      );
                    })}
                  </div>

                  {/* Tile Bank */}
                  <div className="flex items-center justify-center gap-3 flex-wrap mt-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700 w-full max-w-2xl">
                    {tafkheemTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        onClick={() => handleTafkheemTileClick(tile.id)}
                        disabled={tile.isUsed || tafkheemCompleted}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all font-arabic ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : tafkheemSelectedId === tile.id
                              ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-zinc-950 border-2 border-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {tafkheemCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-amber-950/90 border-4 border-amber-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(245,158,11,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-amber-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-amber-200 font-bold">آپ نے تفخیم و ترقیق کا درست تجویدی کلمہ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-amber-300 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              MODE 13: MADDAT PUZZLE (سبق ۱۳: مَدَّات کے قواعد)
             ========================================================================= */}
          {activeMode === 'maddat' && (
            <>
              {/* Maddat Header & Sub-category Filter */}
              <div className="flex flex-col gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-purple-500/40">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-purple-300">{currentMaddatItem.title}</h2>
                      <p className="text-xs text-zinc-400">
                        سبق ۱۳: مَدَّات کے قواعد (کُل {filteredMaddatItems.length} کلمات)
                      </p>
                    </div>
                  </div>

                  {/* Sub-Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                    {[
                      { id: 'all', label: '✨ تمام اقسام' },
                      { id: 'muttasil', label: '🟢 مد متصل' },
                      { id: 'munfasil', label: '🔵 مد منفصل' },
                      { id: 'laazim', label: '🟣 مد لازم' },
                      { id: 'aaridh', label: '🟡 مد عارض وقفی' },
                      { id: 'leen_aaridh', label: '🟠 مد لین عارض' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setMaddatCategory(cat.id);
                          setMaddatIndex(0);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          maddatCategory === cat.id
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Bar with Tajweed Guidance */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded border border-purple-700/50 font-bold">
                      {currentMaddatItem.categoryLabelUrdu}
                    </span>
                    <span className="text-zinc-300">{currentMaddatItem.tajweedRuleTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 font-urdu">
                      کلمہ {maddatIndex + 1} از {filteredMaddatItems.length}
                    </span>
                    <button
                      onClick={prevMaddatItem}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextMaddatItem}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Magnetic Board */}
              <div className="relative bg-gradient-to-b from-zinc-950 via-slate-900 to-zinc-950 border-2 border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

                {/* Target Word & Audio Button */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <button
                    onClick={() => speakText(currentMaddatItem.arabicPhrase)}
                    className="p-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-purple-300 shadow-lg cursor-pointer transition-all hover:scale-110"
                    title="تلفظ سنیں"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>

                  {/* Target Phrase Display */}
                  <div className="text-center font-arabic text-4xl sm:text-5xl font-black text-amber-300 drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)] select-none">
                    {currentMaddatItem.arabicPhrase}
                  </div>
                </div>

                {/* Target Slots */}
                <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4 my-6 flex-wrap" dir="rtl">
                  {maddatSlots.map((slotWord, idx) => (
                    <div
                      key={`maddat-slot-${idx}`}
                      onClick={() => handleMaddatSlotClick(idx)}
                      className={`min-w-[90px] sm:min-w-[120px] h-16 sm:h-20 rounded-2xl border-2 border-dashed flex items-center justify-center font-arabic text-2xl sm:text-3xl font-black transition-all cursor-pointer select-none ${
                        slotWord
                          ? 'bg-purple-950/80 border-purple-400 text-amber-300 shadow-lg shadow-purple-900/40 scale-105'
                          : 'bg-zinc-900/60 border-zinc-700 text-zinc-600 hover:border-purple-500/50'
                      }`}
                    >
                      {slotWord || (
                        <span className="text-xs font-urdu text-zinc-500">خالی خانہ {idx + 1}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Magnetic Tiles Bank */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="text-xs text-zinc-400 font-urdu flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>نیچے سے مقناطیسی کارڈ منتخب کر کے اوپر خالی خانوں میں لگائیں:</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3" dir="rtl">
                    {maddatTileBank.map((tile) => (
                      <button
                        key={tile.id}
                        disabled={tile.isUsed}
                        onClick={() => handleMaddatTileClick(tile.id)}
                        className={`min-w-[75px] sm:min-w-[95px] h-14 sm:h-16 px-4 rounded-2xl font-arabic text-xl sm:text-2xl font-black transition-all duration-200 cursor-pointer select-none ${
                          tile.isUsed
                            ? 'opacity-0 scale-50 pointer-events-none absolute'
                            : maddatSelectedId === tile.id
                              ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-2 border-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-110 -translate-y-2'
                              : 'bg-slate-800 border-2 border-slate-600 text-slate-300 shadow-[4px_4px_0_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_6px_0_rgba(15,23,42,1)] hover:border-slate-500'
                        }`}
                      >
                        {tile.text}
                      </button>
                    ))}
                  </div>

                  {/* Completion Animation */}
                  {maddatCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                      <div className="bg-purple-950/90 border-4 border-purple-500 p-8 rounded-3xl shadow-[0_0_100px_rgba(168,85,247,0.8)] text-center animate-bounce">
                        <div className="text-6xl mb-4">🌟</div>
                        <h3 className="text-2xl font-black text-amber-400 mb-2">ماشاء اللہ!</h3>
                        <p className="text-purple-200 font-bold">آپ نے مَدَّات کا درست تجویدی کلمہ مکمل کر لیا!</p>
                        <div className="mt-4 flex items-center justify-center gap-4 text-purple-300 font-black">
                          <span>+50 ⭐</span>
                          <span>+35 🪙</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeMode === 'surahs' && (
            <>
              {/* Surah Selector Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/90 p-4 rounded-2xl border border-purple-500/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center text-purple-300">
                    <Puzzle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-purple-300">{currentSurah.title}</h2>
                    <p className="text-xs text-zinc-400">سورت کے الفاظ کو درست ترتیب میں مقناطیسی بورڈ پر لگائیں</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                  <select
                    value={SURAH_PUZZLES[surahIndex]?.id.split('-')[0] || 'fatiha'}
                    onChange={(e) => {
                      const prefix = e.target.value;
                      const foundIdx = SURAH_PUZZLES.findIndex((s) => s.id.startsWith(prefix));
                      if (foundIdx !== -1) {
                        setSurahIndex(foundIdx);
                      }
                    }}
                    className="bg-purple-950 text-purple-200 font-extrabold text-xs px-3 py-2 rounded-xl border border-purple-500/60 cursor-pointer focus:outline-none shrink-0 shadow-md"
                  >
                    <option value="fatiha">📖 ۱. سورۃ الفاتحہ (۷ آیات)</option>
                    <option value="naba">📖 ۷۸. سورۃ النبأ (۴۰ آیات)</option>
                    <option value="naziat">📖 ۷۹. سورۃ النازعات (۴۶ آیات)</option>
                    <option value="abasa">📖 ۸۰. سورۃ عبس (۴۲ آیات)</option>
                    <option value="takwir">📖 ۸۱. سورۃ التكوير (۲۹ آیات)</option>
                    <option value="infitar">📖 ۸۲. سورۃ الانفطار (۱۹ آیات)</option>
                    <option value="mutaffifin">📖 ۸۳. سورۃ المطففين (۳۶ آیات)</option>
                    <option value="inshiqaq">📖 ۸۴. سورۃ الانشقاق (۲۵ آیات)</option>
                    <option value="burooj">📖 ۸۵. سورۃ البروج (۲۲ آیات)</option>
                    <option value="tariq">📖 ۸۶. سورۃ الطارق (۱۷ آیات)</option>
                    <option value="ala">📖 ۸۷. سورۃ الأعلى (۱۹ آیات)</option>
                    <option value="ghashiyah">📖 ۸۸. سورۃ الغاشية (۲۶ آیات)</option>
                    <option value="fajr">📖 ۸۹. سورۃ الفجر (۳۰ آیات)</option>
                    <option value="balad">📖 ۹۰. سورۃ البلد (۲۰ آیات)</option>
                    <option value="shams">📖 ۹۱. سورۃ الشمس (۱۵ آیات)</option>
                    <option value="lail">📖 ۹۲. سورۃ الليل (۲۱ آیات)</option>
                    <option value="duha">📖 ۹۳. سورۃ الضحى (۱۱ آیات)</option>
                    <option value="sharh">📖 ۹۴. سورۃ الشرح (۸ آیات)</option>
                    <option value="tin">📖 ۹۵. سورۃ التين (۸ آیات)</option>
                    <option value="alaq">📖 ۹۶. سورۃ العلق (۱۹ آیات)</option>
                    <option value="qadr">📖 ۹۷. سورۃ القدر (۵ آیات)</option>
                    <option value="bayyinah">📖 ۹۸. سورۃ البينة (۸ آیات)</option>
                    <option value="zalzalah">📖 ۹۹. سورۃ الزلزلة (۸ آیات)</option>
                    <option value="adiyat">📖 ۱۰۰. سورۃ العاديات (۱۱ آیات)</option>
                    <option value="qariah">📖 ۱۰۱. سورۃ القارعة (۱۱ آیات)</option>
                    <option value="takathur">📖 ۱۰۲. سورۃ التكاثر (۸ آیات)</option>
                    <option value="asr">📖 ۱۰۳. سورۃ العصر (۳ آیات)</option>
                    <option value="humazah">📖 ۱۰۴. سورۃ الهمزة (۹ آیات)</option>
                    <option value="fil">📖 ۱۰۵. سورۃ الفيل (۵ آیات)</option>
                    <option value="quraish">📖 ۱۰۶. سورۃ قريش (۴ آیات)</option>
                    <option value="maun">📖 ۱۰۷. سورۃ الماعون (۷ آیات)</option>
                    <option value="kauthar">📖 ۱۰۸. سورۃ الكوثر (۳ آیات)</option>
                    <option value="kafirun">📖 ۱۰۹. سورۃ الكافرون (۶ آیات)</option>
                    <option value="nasr">📖 ۱۱۰. سورۃ النصر (۳ آیات)</option>
                    <option value="lahab">📖 ۱۱۱. سورۃ المسد (۵ آیات)</option>
                    <option value="ikhlas">📖 ۱۱۲. سورۃ الإخلاص (۴ آیات)</option>
                    <option value="falaq">📖 ۱۱۳. سورۃ الفلق (۵ آیات)</option>
                    <option value="nas">📖 ۱۱۴. سورۃ الناس (۶ آیات)</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevSurahItem}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                      title="پچھلی سورت"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextSurahItem}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer border border-zinc-700"
                      title="اگلی سورت"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* SURAH TARGET BANNER */}
              <div className="bg-zinc-950 border-4 border-dashed border-purple-500/50 rounded-3xl p-5 sm:p-7 min-h-[190px] flex flex-col items-center justify-center gap-4 relative shadow-inner">
                <div className="absolute top-3 right-4 bg-purple-950/80 border border-purple-500/50 px-3 py-1 rounded-full text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>مقناطیسی بورڈ (مطلوبہ ترتیب)</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 bg-zinc-900/90 border border-purple-500/50 px-5 py-2.5 rounded-2xl shadow-xl mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-md">متن:</span>
                    <span className="text-purple-100 text-xl sm:text-2xl font-arabic font-black tracking-wide">
                      {currentSurah.arabicName}
                    </span>
                  </div>

                  <button
                    onClick={playAlafasyRecitation}
                    className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAlafasy ? 'animate-bounce' : ''}`} />
                    <span>{isPlayingAlafasy ? 'تلاوت جاری ہے...' : '🔊 تلاوت سنیں (العفاسي)'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3">
                  {surahSlots.map((word, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSurahSlotClick(idx)}
                      className={`w-24 sm:w-28 h-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-xl ${
                        word
                          ? 'bg-purple-700 border-purple-300 text-white animate-fadeIn'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-purple-500/50 border-dashed'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-400 mb-1">خانہ {idx + 1}</span>
                      <span className="text-xl sm:text-2xl font-black font-arabic tracking-wider">
                        {word || '—'}
                      </span>
                    </div>
                  ))}
                </div>

                {surahCompleted && (
                  <div className="mt-3 w-full bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border-2 border-purple-400 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-inner">
                        <Music className={`w-5 h-5 ${isPlayingAlafasy ? 'animate-bounce text-purple-300' : ''}`} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-purple-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>القارئ الشيخ مشاري راشد العفاسي</span>
                        </div>
                        <h3 className="text-base font-black text-white">تلاوة مباركة ({currentSurah.arabicName})</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={playAlafasyRecitation}
                        className="px-3.5 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isPlayingAlafasy ? 'تلاوت جاری ہے...' : 'دوبارہ سنیں'}</span>
                      </button>

                      <button
                        onClick={nextSurahItem}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                      >
                        <span>اگلا پزل ←</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SURAH TILE TRAY / BANK */}
              <div className="bg-zinc-900 border border-purple-500/40 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-300">
                      میز پر بکھرے ہوئے تختی ٹکڑے (اوپر بورڈ پر فٹ کرنے کے لیے کلک کریں):
                    </span>
                    {surahSelectedId && (
                      <span className="bg-purple-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                        ٹکڑا منتخب ہے — اب خالی خانے پر کلک کریں
                      </span>
                    )}
                  </div>

                  <button
                    onClick={initSurahPuzzle}
                    className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-zinc-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>دوبارہ شفل کریں</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 py-2">
                  {surahTileBank.map((tile) => {
                    const isSelected = surahSelectedId === tile.id;
                    if (tile.isUsed) {
                      return (
                        <div
                          key={tile.id}
                          className="w-20 h-16 rounded-2xl bg-zinc-950/50 border border-zinc-800 text-zinc-700 flex items-center justify-center text-lg font-bold opacity-30 select-none"
                        >
                          ✓
                        </div>
                      );
                    }

                    return (
                      <button
                        key={tile.id}
                        onClick={() => handleSurahTileClick(tile.id)}
                        className={`w-22 sm:w-26 h-18 sm:h-20 rounded-2xl font-black text-xl sm:text-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer border-2 flex items-center justify-center font-arabic ${
                          isSelected
                            ? 'bg-purple-400 border-white text-zinc-950 ring-4 ring-purple-400/50 scale-105'
                            : 'bg-gradient-to-br from-purple-600 to-indigo-800 border-purple-400/70 text-white hover:border-purple-300'
                        }`}
                      >
                        {tile.text}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
