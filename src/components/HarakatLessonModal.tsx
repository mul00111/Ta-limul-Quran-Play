import React, { useState, useMemo } from 'react';
import { Volume2, VolumeX, ArrowRight, Play, Pause, Sparkles, CheckCircle2, HelpCircle, RefreshCw, Gamepad2, BookOpen, Layers, Search, Filter } from 'lucide-react';
import { playQariText, playWordWithHijjaAndPronunciation, stopAllQariAudio, playQuizFeedbackAudio } from '../utils/qariAudioService';
import { MutharrikātGameModal } from './MutharrikātGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { ALL_MUTAHARRIKAT_MASHQ, ZABAR_MASHQ_DATA, ZER_MASHQ_DATA, PESH_MASHQ_DATA, PAGE_10_EXTRA_MASHQ_DATA, PAGE_11_EXAM_MASHQ_DATA, ALL_MUTAHARRIKAT_WORDS, MutaharrikExerciseWord } from '../data/mutaharrikatMashqData';
import { LanguageCode } from '../types';

interface HarakatLessonModalProps {
  onBack: () => void;
  currentLang?: LanguageCode;
}

export interface HarakatCell {
  id: number;
  text: string;           // Display Arabic e.g. "أَ"
  baseLetterName: string; // e.g. "ہمزہ"
  harakatName: string;    // e.g. "زبر" | "زیر" | "پیش"
  hijjaSpelling: string;  // e.g. "ہمزہ زبر اَ"
  rawSound: string;       // e.g. "اَ"
  isHeavy: boolean;       // Blue/cyan text if heavy
}

// All letters with Zabar, Zer, Pesh as shown in Madani Qaida Lesson 3
const HARAKAT_LESSON_ITEMS: HarakatCell[] = [
  // Hamza / Alif
  { id: 1, text: 'أَ', baseLetterName: 'ہمزہ', harakatName: 'زبر', hijjaSpelling: 'ہمزہ زبر أَ', rawSound: 'أَ', isHeavy: false },
  { id: 2, text: 'إِ', baseLetterName: 'ہمزہ', harakatName: 'زیر', hijjaSpelling: 'ہمزہ زیر إِ', rawSound: 'إِ', isHeavy: false },
  { id: 3, text: 'أُ', baseLetterName: 'ہمزہ', harakatName: 'پیش', hijjaSpelling: 'ہمزہ پیش أُ', rawSound: 'أُ', isHeavy: false },

  // Baa
  { id: 4, text: 'بَ', baseLetterName: 'باء', harakatName: 'زبر', hijjaSpelling: 'باء زبر بَ', rawSound: 'بَ', isHeavy: false },
  { id: 5, text: 'بِ', baseLetterName: 'باء', harakatName: 'زیر', hijjaSpelling: 'باء زیر بِ', rawSound: 'بِ', isHeavy: false },
  { id: 6, text: 'بُ', baseLetterName: 'باء', harakatName: 'پیش', hijjaSpelling: 'باء پیش بُ', rawSound: 'بُ', isHeavy: false },

  // Taa
  { id: 7, text: 'تَ', baseLetterName: 'تاء', harakatName: 'زبر', hijjaSpelling: 'تاء زبر تَ', rawSound: 'تَ', isHeavy: false },
  { id: 8, text: 'تِ', baseLetterName: 'تاء', harakatName: 'زیر', hijjaSpelling: 'تاء زیر تِ', rawSound: 'تِ', isHeavy: false },
  { id: 9, text: 'تُ', baseLetterName: 'تاء', harakatName: 'پیش', hijjaSpelling: 'تاء پیش تُ', rawSound: 'تُ', isHeavy: false },

  // Thaa
  { id: 10, text: 'ثَ', baseLetterName: 'ثاء', harakatName: 'زبر', hijjaSpelling: 'ثاء زبر ثَ', rawSound: 'ثَ', isHeavy: false },
  { id: 11, text: 'ثِ', baseLetterName: 'ثاء', harakatName: 'زیر', hijjaSpelling: 'ثاء زیر ثِ', rawSound: 'ثِ', isHeavy: false },
  { id: 12, text: 'ثُ', baseLetterName: 'ثاء', harakatName: 'پیش', hijjaSpelling: 'ثاء پیش ثُ', rawSound: 'ثُ', isHeavy: false },

  // Jeem
  { id: 13, text: 'جَ', baseLetterName: 'جیم', harakatName: 'زبر', hijjaSpelling: 'جیم زبر جَ', rawSound: 'جَ', isHeavy: false },
  { id: 14, text: 'جِ', baseLetterName: 'جیم', harakatName: 'زیر', hijjaSpelling: 'جیم زیر جِ', rawSound: 'جِ', isHeavy: false },
  { id: 15, text: 'جُ', baseLetterName: 'جیم', harakatName: 'پیش', hijjaSpelling: 'جیم پیش جُ', rawSound: 'جُ', isHeavy: false },

  // Haa
  { id: 16, text: 'حَ', baseLetterName: 'حاء', harakatName: 'زبر', hijjaSpelling: 'حاء زبر حَ', rawSound: 'حَ', isHeavy: false },
  { id: 17, text: 'حِ', baseLetterName: 'حاء', harakatName: 'زیر', hijjaSpelling: 'حاء زیر حِ', rawSound: 'حِ', isHeavy: false },
  { id: 18, text: 'حُ', baseLetterName: 'حاء', harakatName: 'پیش', hijjaSpelling: 'حاء پیش حُ', rawSound: 'حُ', isHeavy: false },

  // Khaa (Heavy letter with Zabar and Pesh)
  { id: 19, text: 'خَ', baseLetterName: 'خاء', harakatName: 'زبر', hijjaSpelling: 'خاء زبر خَ', rawSound: 'خَ', isHeavy: true },
  { id: 20, text: 'خِ', baseLetterName: 'خاء', harakatName: 'زیر', hijjaSpelling: 'خاء زیر خِ', rawSound: 'خِ', isHeavy: false },
  { id: 21, text: 'خُ', baseLetterName: 'خاء', harakatName: 'پیش', hijjaSpelling: 'خاء پیش خُ', rawSound: 'خُ', isHeavy: true },

  // Daal
  { id: 22, text: 'دَ', baseLetterName: 'دال', harakatName: 'زبر', hijjaSpelling: 'دال زبر دَ', rawSound: 'دَ', isHeavy: false },
  { id: 23, text: 'دِ', baseLetterName: 'دال', harakatName: 'زیر', hijjaSpelling: 'دال زیر دِ', rawSound: 'دِ', isHeavy: false },
  { id: 24, text: 'دُ', baseLetterName: 'دال', harakatName: 'پیش', hijjaSpelling: 'دال پیش دُ', rawSound: 'دُ', isHeavy: false },

  // Zaal
  { id: 25, text: 'ذَ', baseLetterName: 'ذال', harakatName: 'زبر', hijjaSpelling: 'ذال زبر ذَ', rawSound: 'ذَ', isHeavy: false },
  { id: 26, text: 'ذِ', baseLetterName: 'ذال', harakatName: 'زیر', hijjaSpelling: 'ذال زیر ذِ', rawSound: 'ذِ', isHeavy: false },
  { id: 27, text: 'ذُ', baseLetterName: 'ذال', harakatName: 'پیش', hijjaSpelling: 'ذال پیش ذُ', rawSound: 'ذُ', isHeavy: false },

  // Raa (Pur Raa with Zabar & Pesh)
  { id: 28, text: 'رَ', baseLetterName: 'راء', harakatName: 'زبر', hijjaSpelling: 'راء زبر رَ', rawSound: 'رَ', isHeavy: true },
  { id: 29, text: 'رِ', baseLetterName: 'راء', harakatName: 'زیر', hijjaSpelling: 'راء زیر رِ', rawSound: 'رِ', isHeavy: false },
  { id: 30, text: 'رُ', baseLetterName: 'راء', harakatName: 'پیش', hijjaSpelling: 'راء پیش رُ', rawSound: 'رُ', isHeavy: true },

  // Zaa
  { id: 31, text: 'زَ', baseLetterName: 'زَاءْ', harakatName: 'زبر', hijjaSpelling: 'زَاءْ زبر زَ', rawSound: 'زَ', isHeavy: false },
  { id: 32, text: 'زِ', baseLetterName: 'زَاءْ', harakatName: 'زیر', hijjaSpelling: 'زَاءْ زیر زِ', rawSound: 'زِ', isHeavy: false },
  { id: 33, text: 'زُ', baseLetterName: 'زَاءْ', harakatName: 'پیش', hijjaSpelling: 'زَاءْ پیش زُ', rawSound: 'زُ', isHeavy: false },

  // Seen
  { id: 34, text: 'سَ', baseLetterName: 'سین', harakatName: 'زبر', hijjaSpelling: 'سین زبر سَ', rawSound: 'سَ', isHeavy: false },
  { id: 35, text: 'سِ', baseLetterName: 'سین', harakatName: 'زیر', hijjaSpelling: 'سین زیر سِ', rawSound: 'سِ', isHeavy: false },
  { id: 36, text: 'سُ', baseLetterName: 'سین', harakatName: 'پیش', hijjaSpelling: 'سین پیش سُ', rawSound: 'سُ', isHeavy: false },

  // Sheen
  { id: 37, text: 'شَ', baseLetterName: 'شین', harakatName: 'زبر', hijjaSpelling: 'شین زبر شَ', rawSound: 'شَ', isHeavy: false },
  { id: 38, text: 'شِ', baseLetterName: 'شین', harakatName: 'زیر', hijjaSpelling: 'شین زیر شِ', rawSound: 'شِ', isHeavy: false },
  { id: 39, text: 'شُ', baseLetterName: 'شین', harakatName: 'پیش', hijjaSpelling: 'شین پیش شُ', rawSound: 'شُ', isHeavy: false },

  // Saad (Heavy letter)
  { id: 40, text: 'صَ', baseLetterName: 'صاد', harakatName: 'زبر', hijjaSpelling: 'صاد زبر صَ', rawSound: 'صَ', isHeavy: true },
  { id: 41, text: 'صِ', baseLetterName: 'صاد', harakatName: 'زیر', hijjaSpelling: 'صاد زیر صِ', rawSound: 'صِ', isHeavy: false },
  { id: 42, text: 'صُ', baseLetterName: 'صاد', harakatName: 'پیش', hijjaSpelling: 'صاد پیش صُ', rawSound: 'صُ', isHeavy: true },

  // Daad (Heavy letter)
  { id: 43, text: 'ضَ', baseLetterName: 'ضاد', harakatName: 'زبر', hijjaSpelling: 'ضاد زبر ضَ', rawSound: 'ضَ', isHeavy: true },
  { id: 44, text: 'ضِ', baseLetterName: 'ضاد', harakatName: 'زیر', hijjaSpelling: 'ضاد زیر ضِ', rawSound: 'ضِ', isHeavy: true },
  { id: 45, text: 'ضُ', baseLetterName: 'ضاد', harakatName: 'پیش', hijjaSpelling: 'ضاد پیش ضُ', rawSound: 'ضُ', isHeavy: true },

  // Taa (Heavy letter)
  { id: 46, text: 'طَ', baseLetterName: 'طاء', harakatName: 'زبر', hijjaSpelling: 'طاء زبر طَ', rawSound: 'طَ', isHeavy: true },
  { id: 47, text: 'طِ', baseLetterName: 'طاء', harakatName: 'زیر', hijjaSpelling: 'طاء زیر طِ', rawSound: 'طِ', isHeavy: true },
  { id: 48, text: 'طُ', baseLetterName: 'طاء', harakatName: 'پیش', hijjaSpelling: 'طاء پیش طُ', rawSound: 'طُ', isHeavy: true },

  // Zaa (Heavy letter)
  { id: 49, text: 'ظَ', baseLetterName: 'ظاء', harakatName: 'زبر', hijjaSpelling: 'ظاء زبر ظَ', rawSound: 'ظَ', isHeavy: true },
  { id: 50, text: 'ظِ', baseLetterName: 'ظاء', harakatName: 'زیر', hijjaSpelling: 'ظاء زیر ظِ', rawSound: 'ظِ', isHeavy: true },
  { id: 51, text: 'ظُ', baseLetterName: 'ظاء', harakatName: 'پیش', hijjaSpelling: 'ظاء پیش ظُ', rawSound: 'ظُ', isHeavy: true },

  // Ain
  { id: 52, text: 'عَ', baseLetterName: 'عین', harakatName: 'زبر', hijjaSpelling: 'عین زبر عَ', rawSound: 'عَ', isHeavy: false },
  { id: 53, text: 'عِ', baseLetterName: 'عین', harakatName: 'زیر', hijjaSpelling: 'عین زیر عِ', rawSound: 'عِ', isHeavy: false },
  { id: 54, text: 'عُ', baseLetterName: 'عین', harakatName: 'پیش', hijjaSpelling: 'عین پیش عُ', rawSound: 'عُ', isHeavy: false },

  // Ghain (Heavy letter)
  { id: 55, text: 'غَ', baseLetterName: 'غین', harakatName: 'زبر', hijjaSpelling: 'غین زبر غَ', rawSound: 'غَ', isHeavy: true },
  { id: 56, text: 'غِ', baseLetterName: 'غین', harakatName: 'زیر', hijjaSpelling: 'غین زیر غِ', rawSound: 'غِ', isHeavy: false },
  { id: 57, text: 'غُ', baseLetterName: 'غین', harakatName: 'پیش', hijjaSpelling: 'غین پیش غُ', rawSound: 'غُ', isHeavy: true },

  // Faa
  { id: 58, text: 'فَ', baseLetterName: 'فاء', harakatName: 'زبر', hijjaSpelling: 'فاء زبر فَ', rawSound: 'فَ', isHeavy: false },
  { id: 59, text: 'فِ', baseLetterName: 'فاء', harakatName: 'زیر', hijjaSpelling: 'فاء زیر فِ', rawSound: 'فِ', isHeavy: false },
  { id: 60, text: 'فُ', baseLetterName: 'فاء', harakatName: 'پیش', hijjaSpelling: 'فاء پیش فُ', rawSound: 'فُ', isHeavy: false },

  // Qaaf (Heavy letter)
  { id: 61, text: 'قَ', baseLetterName: 'قاف', harakatName: 'زبر', hijjaSpelling: 'قاف زبر قَ', rawSound: 'قَ', isHeavy: true },
  { id: 62, text: 'قِ', baseLetterName: 'قاف', harakatName: 'زیر', hijjaSpelling: 'قاف زیر قِ', rawSound: 'قِ', isHeavy: false },
  { id: 63, text: 'قُ', baseLetterName: 'قاف', harakatName: 'پیش', hijjaSpelling: 'قاف پیش قُ', rawSound: 'قُ', isHeavy: true },

  // Kaaf
  { id: 64, text: 'كَ', baseLetterName: 'کاف', harakatName: 'زبر', hijjaSpelling: 'کاف زبر كَ', rawSound: 'كَ', isHeavy: false },
  { id: 65, text: 'كِ', baseLetterName: 'کاف', harakatName: 'زیر', hijjaSpelling: 'کاف زیر كِ', rawSound: 'كِ', isHeavy: false },
  { id: 66, text: 'كُ', baseLetterName: 'کاف', harakatName: 'پیش', hijjaSpelling: 'کاف پیش كُ', rawSound: 'كُ', isHeavy: false },

  // Laam
  { id: 67, text: 'لَ', baseLetterName: 'لام', harakatName: 'زبر', hijjaSpelling: 'لام زبر لَ', rawSound: 'لَ', isHeavy: false },
  { id: 68, text: 'لِ', baseLetterName: 'لام', harakatName: 'زیر', hijjaSpelling: 'لام زیر لِ', rawSound: 'لِ', isHeavy: false },
  { id: 69, text: 'لُ', baseLetterName: 'لام', harakatName: 'پیش', hijjaSpelling: 'لام پیش لُ', rawSound: 'لُ', isHeavy: false },

  // Meem
  { id: 70, text: 'مَ', baseLetterName: 'میم', harakatName: 'زبر', hijjaSpelling: 'میم زبر مَ', rawSound: 'مَ', isHeavy: false },
  { id: 71, text: 'مِ', baseLetterName: 'میم', harakatName: 'زیر', hijjaSpelling: 'میم زیر مِ', rawSound: 'مِ', isHeavy: false },
  { id: 72, text: 'مُ', baseLetterName: 'میم', harakatName: 'پیش', hijjaSpelling: 'میم پیش مُ', rawSound: 'مُ', isHeavy: false },

  // Noon
  { id: 73, text: 'نَ', baseLetterName: 'نون', harakatName: 'زبر', hijjaSpelling: 'نون زبر نَ', rawSound: 'نَ', isHeavy: false },
  { id: 74, text: 'نِ', baseLetterName: 'نون', harakatName: 'زیر', hijjaSpelling: 'نون زیر نِ', rawSound: 'نِ', isHeavy: false },
  { id: 75, text: 'نُ', baseLetterName: 'نون', harakatName: 'پیش', hijjaSpelling: 'نون پیش نُ', rawSound: 'نُ', isHeavy: false },

  // Waw
  { id: 76, text: 'وَ', baseLetterName: 'واو', harakatName: 'زبر', hijjaSpelling: 'واو زبر وَ', rawSound: 'وَ', isHeavy: false },
  { id: 77, text: 'وِ', baseLetterName: 'واو', harakatName: 'زیر', hijjaSpelling: 'واو زیر وِ', rawSound: 'وِ', isHeavy: false },
  { id: 78, text: 'وُ', baseLetterName: 'واو', harakatName: 'پیش', hijjaSpelling: 'واو پیش وُ', rawSound: 'وُ', isHeavy: false },

  // Haa
  { id: 79, text: 'هَ', baseLetterName: 'هاء', harakatName: 'زبر', hijjaSpelling: 'هاء زبر هَ', rawSound: 'هَ', isHeavy: false },
  { id: 80, text: 'هِ', baseLetterName: 'هاء', harakatName: 'زیر', hijjaSpelling: 'هاء زیر هِ', rawSound: 'هِ', isHeavy: false },
  { id: 81, text: 'هُ', baseLetterName: 'هاء', harakatName: 'پیش', hijjaSpelling: 'هاء پیش هُ', rawSound: 'هُ', isHeavy: false },

  // Hamza (standalone)
  { id: 82, text: 'ءَ', baseLetterName: 'ہمزہ', harakatName: 'زبر', hijjaSpelling: 'ہمزہ زبر أَ', rawSound: 'أَ', isHeavy: false },
  { id: 83, text: 'ءِ', baseLetterName: 'ہمزہ', harakatName: 'زیر', hijjaSpelling: 'ہمزہ زیر إِ', rawSound: 'إِ', isHeavy: false },
  { id: 84, text: 'ءُ', baseLetterName: 'ہمزہ', harakatName: 'پیش', hijjaSpelling: 'ہمزہ پیش أُ', rawSound: 'أُ', isHeavy: false },

  // Yaa
  { id: 85, text: 'يَ', baseLetterName: 'یاء', harakatName: 'زبر', hijjaSpelling: 'یاء زبر يَ', rawSound: 'يَ', isHeavy: false },
  { id: 86, text: 'يِ', baseLetterName: 'یاء', harakatName: 'زیر', hijjaSpelling: 'یاء زیر يِ', rawSound: 'يِ', isHeavy: false },
  { id: 87, text: 'يُ', baseLetterName: 'یاء', harakatName: 'پیش', hijjaSpelling: 'یاء پیش يُ', rawSound: 'يُ', isHeavy: false },
];

export const HarakatLessonModal: React.FC<HarakatLessonModalProps> = ({ onBack, currentLang = 'ur' }) => {
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const [activeTab, setActiveTab] = useState<'mashq' | 'page10' | 'exam' | 'mufradat'>('mashq');
  const [mashqFilter, setMashqFilter] = useState<'all' | 'zabar' | 'zer' | 'pesh' | '2-letter' | '3-letter'>('all');
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeCell, setActiveCell] = useState<HarakatCell | null>(null);
  const [activeMashqWord, setActiveMashqWord] = useState<MutaharrikExerciseWord | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showFullGame, setShowFullGame] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);
  
  // Practice Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizItem, setQuizItem] = useState<HarakatCell | MutaharrikExerciseWord | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Active word list based on selected tab
  const currentTabWords = useMemo(() => {
    if (activeTab === 'page10') return PAGE_10_EXTRA_MASHQ_DATA;
    if (activeTab === 'exam') return PAGE_11_EXAM_MASHQ_DATA;
    return ALL_MUTAHARRIKAT_MASHQ;
  }, [activeTab]);

  // Filtered mashq list
  const filteredMashqList = useMemo(() => {
    return currentTabWords.filter(item => {
      // Category filter
      if (mashqFilter === 'zabar' && item.category !== 'zabar') return false;
      if (mashqFilter === 'zer' && item.category !== 'zer') return false;
      if (mashqFilter === 'pesh' && item.category !== 'pesh') return false;
      if (mashqFilter === '2-letter' && item.letterCount !== 2) return false;
      if (mashqFilter === '3-letter' && item.letterCount < 3) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim();
        const matchesWord = item.word.includes(q);
        const matchesSpelling = item.spellingHijja.includes(q);
        const matchesMeaning = item.urduMeaning ? item.urduMeaning.includes(q) : false;
        const matchesLetters = item.letters.some(l => l.includes(q));
        return matchesWord || matchesSpelling || matchesMeaning || matchesLetters;
      }
      return true;
    });
  }, [currentTabWords, mashqFilter, searchQuery]);

  if (showFullGame) {
    return <MutharrikātGameModal onBack={() => setShowFullGame(false)} currentLang={currentLang} />;
  }

  if (showMagneticGame) {
    return (
      <MurakkabatPuzzleGameModal
        initialGameMode="mutaharrikat"
        currentLang={currentLang}
        onBack={() => setShowMagneticGame(false)}
      />
    );
  }

  const speakCell = (cell: HarakatCell) => {
    if (isMuted) return;
    setActiveCell(cell);
    setActiveMashqWord(null);
    if (pronunciationMode === 'hijja') {
      playQariText(cell.hijjaSpelling);
    } else {
      playQariText(cell.rawSound);
    }
  };

  const speakMashqWord = (item: MutaharrikExerciseWord) => {
    if (isMuted) return;
    setActiveMashqWord(item);
    setActiveCell(null);
    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(item.spellingHijja, item.pronunciationWord);
    } else {
      playQariText(item.pronunciationWord);
    }
  };

  const playFullSequence = async () => {
    if (isMuted) return;
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveCell(null);
      setActiveMashqWord(null);
      return;
    }

    setIsPlayingSequence(true);

    if (activeTab === 'mashq') {
      const itemsToPlay = filteredMashqList;
      for (let i = 0; i < itemsToPlay.length; i++) {
        const item = itemsToPlay[i];
        setActiveMashqWord(item);
        if (pronunciationMode === 'hijja') {
          await playWordWithHijjaAndPronunciation(item.spellingHijja, item.pronunciationWord);
        } else {
          await playQariText(item.pronunciationWord);
        }
        await new Promise((r) => setTimeout(r, 450));
      }
      setActiveMashqWord(null);
    } else {
      for (let i = 0; i < HARAKAT_LESSON_ITEMS.length; i++) {
        const item = HARAKAT_LESSON_ITEMS[i];
        setActiveCell(item);
        if (pronunciationMode === 'hijja') {
          await playQariText(item.hijjaSpelling);
        } else {
          await playQariText(item.rawSound);
        }
        await new Promise((r) => setTimeout(r, 300));
      }
      setActiveCell(null);
    }

    setIsPlayingSequence(false);
  };

  const playQuizItemAudio = (item?: any) => {
    const target = item || quizItem;
    if (!target || isMuted) return;
    if ('rawSound' in target) {
      playQariText(target.rawSound);
    } else if ('pronunciationWord' in target) {
      playQariText(target.pronunciationWord);
    }
  };

  const startNewQuiz = () => {
    const isWord = Math.random() > 0.4;
    if (isWord) {
      const randomIndex = Math.floor(Math.random() * ALL_MUTAHARRIKAT_MASHQ.length);
      const item = ALL_MUTAHARRIKAT_MASHQ[randomIndex];
      setQuizItem(item);
    } else {
      const randomIndex = Math.floor(Math.random() * HARAKAT_LESSON_ITEMS.length);
      const item = HARAKAT_LESSON_ITEMS[randomIndex];
      setQuizItem(item);
    }
    setQuizFeedback(null);
  };

  const handleQuizAnswer = (chosenHarakat: string) => {
    if (!quizItem) return;
    let correct = false;
    let targetName = '';
    let sound = '';

    if ('harakatName' in quizItem) {
      correct = chosenHarakat === quizItem.harakatName;
      targetName = quizItem.harakatName;
      sound = quizItem.rawSound;
    } else {
      const catMap: Record<string, string> = {
        zabar: 'زبر',
        zer: 'زیر',
        pesh: 'پیش'
      };
      targetName = catMap[quizItem.category] || 'زبر';
      correct = chosenHarakat === targetName;
      sound = quizItem.pronunciationWord;
    }

    if (correct) {
      setQuizFeedback('شاباش! بالکل درست جواب ہے۔ 🎉');
      setQuizScore(prev => prev + 1);
      if (!isMuted) {
        playQuizFeedbackAudio(true, sound, targetName);
      }
      setTimeout(() => startNewQuiz(), 2500);
    } else {
      setQuizFeedback(`غلط! یہ "${targetName}" کی مشق ہے۔ دوبارہ کوشش کریں۔`);
      if (!isMuted) {
        playQuizFeedbackAudio(false, sound, targetName);
      }
    }
  };

  return (
    <div className={`bg-[#fcfaf5] border-4 border-emerald-700/80 rounded-3xl p-3 sm:p-7 shadow-2xl space-y-6 ${isRtl ? 'font-urdu' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b-2 border-amber-500/30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-md border border-zinc-700"
            title="واپس جائیں"
          >
            <ArrowRight className={`w-4 h-4 text-amber-400 ${!isRtl ? 'rotate-180' : ''}`} />
            <span>{currentLang === 'en' ? 'Back' : currentLang === 'ar' ? 'رجوع' : 'واپسی'}</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-4 sm:px-6 py-1.5 rounded-full bg-emerald-700 text-white font-black text-sm sm:text-lg shadow-md border border-emerald-500">
                سبق نمبر (۳) : حَرَکات و مُتَحَرِّکات
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold px-2.5 py-1 rounded-full hidden sm:inline-block">
                مکمل مشق (۴۸ کلمات)
              </span>
            </div>
            <p className="text-xs text-emerald-900 font-semibold mt-1">
              زبر (ـَ)، زیر (ـِ) اور پیش (ـُ) کے مکمل قواعد، مفردات اور الفاظ کی مشق
            </p>
          </div>
        </div>

        {/* Mode & Quiz Switch */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowMagneticGame(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 text-xs font-black shadow-lg border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-zinc-950 animate-pulse" />
            <span>مقناطیسی بورڈ پزل گیم (متحرکات) 🧩</span>
          </button>

          <button
            onClick={() => setShowFullGame(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg border border-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>صوتی و بصری گیم (بغیر کھینچے مشق) 🎯</span>
          </button>

          <button
            onClick={() => {
              setShowQuiz(!showQuiz);
              if (!showQuiz) startNewQuiz();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 border ${
              showQuiz ? 'bg-cyan-700 text-white border-cyan-500' : 'bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showQuiz ? 'مشق بند کریں' : 'حرکات کی مشق (کویز)'}</span>
          </button>
        </div>
      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/10 p-2 rounded-2xl border border-emerald-600/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Mashq Pages 8-9 */}
          <button
            onClick={() => setActiveTab('mashq')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'mashq'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>مشقِ متحرکات (صفحات ۸-۹)</span>
            <span className="bg-amber-400 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              48
            </span>
          </button>

          {/* Tab 2: Extra Mashq */}
          <button
            onClick={() => setActiveTab('page10')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'page10'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>اضافی مشقِ متحرکات</span>
            <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              77
            </span>
          </button>

          {/* Tab 3: Exam */}
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'exam'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>امتحانِ متحرکات (جامع)</span>
            <span className="bg-blue-400 text-blue-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              50
            </span>
          </button>

          {/* Tab 4: Mufradat 29 Letters */}
          <button
            onClick={() => setActiveTab('mufradat')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'mufradat'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-300" />
            <span>مفرداتِ حرکات (تختی ۳)</span>
            <span className="bg-zinc-200 text-zinc-800 text-[10px] font-black px-1.5 py-0.5 rounded-full">
              87
            </span>
          </button>
        </div>

        {/* Pronunciation mode toggle (روانی / ہجے) */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-800">
          <span className="text-zinc-500 text-[11px]">طریقۂ تلاوت:</span>
          <button
            onClick={() => setPronunciationMode('rawani')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              pronunciationMode === 'rawani'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            روانی (ملا کر)
          </button>
          <button
            onClick={() => setPronunciationMode('hijja')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              pronunciationMode === 'hijja'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            ہجے کے ساتھ
          </button>
        </div>
      </div>

      {/* Rules Box (قواعد) */}
      <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-zinc-900 leading-loose space-y-2.5 shadow-inner">
        <div className="flex items-center justify-between border-b border-amber-300/80 pb-2">
          <h2 className="font-extrabold text-amber-950 text-sm sm:text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            <span>قواعد و اہم ہدایات (سبق نمبر ۳ - حرکات و متحرکات):</span>
          </h2>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
            مدنی و نورانی قاعدہ مطابقت
          </span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right font-medium">
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">1.</span>
            <span>
              حرکت کی جمع حرکات ہے۔ <strong className="text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">زبر (ـَ)</strong>، <strong className="text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">زیر (ـِ)</strong> اور <strong className="text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">پیش (ـُ)</strong> کو حرکات کہتے ہیں۔
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">2.</span>
            <span>جس حرف پر کوئی حرکت ہو اسے <strong>متحرک</strong> کہتے ہیں۔ متحرک کلمات کو بغیر کھینچے پڑھیں۔</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">3.</span>
            <span>
              <strong>زبر</strong> منہ اور آواز کو کھول کر، <strong>زیر</strong> آواز کو نیچے گرا کر اور <strong>پیش</strong> ہونٹوں کو گول کر کے ادا کریں۔
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">4.</span>
            <span>
              "الف" پر کوئی حرکت یا جزم آ جائے تو اسے <strong>حمزہ</strong> "<span className="font-bold text-cyan-900">أَ، إِ، أُ</span>" پڑھیں۔
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">5.</span>
            <span>
              "را" پر زبر یا پیش ہو تو را کو <strong>پُر (موٹا)</strong> اور "را" کے نیچے زیر ہو تو "را" کو <strong>باریک</strong> پڑھیں۔
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-700 font-bold">6.</span>
            <span>
              مستعلیہ حروف (<span className="text-cyan-800 font-bold">خ، ص، ض، ط، ظ، غ، ق</span>) ہر حال میں <strong>پُر (موٹے)</strong> پڑھے جائیں گے۔
            </span>
          </li>
        </ul>
      </div>

      {/* QUIZ SECTION IF ACTIVE */}
      {showQuiz && quizItem && (
        <div className="bg-cyan-950 text-white p-6 rounded-3xl border-2 border-cyan-500 shadow-xl space-y-4 text-center">
          <div className="flex items-center justify-between text-xs text-cyan-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
              حرکات شناسی کوئز (با آوازِ قاری)
            </span>
            <span className="font-bold bg-cyan-900 px-3 py-1 rounded-full border border-cyan-700">اسکور: {quizScore}</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-zinc-200">
              {'word' in quizItem ? 'بتایئے یہ کلمہ کس حرکت کی مشق سے تعلق رکھتا ہے؟' : 'بتایئے اس حرف پر کونسی حرکت ہے؟'}
            </p>
            
            <div className="flex items-center justify-center gap-4 my-2">
              <div className="text-6xl font-black font-arabic text-amber-300 bg-cyan-900/80 px-10 py-4 rounded-2xl border-2 border-cyan-600 shadow-inner tracking-wider">
                {'word' in quizItem ? quizItem.word : quizItem.text}
              </div>

              <button
                onClick={() => playQuizItemAudio()}
                className="p-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-2xl font-extrabold shadow-lg flex flex-col items-center gap-1 cursor-pointer transition-all active:scale-95"
                title="قاری کی آواز سنیں"
              >
                <Volume2 className="w-6 h-6" />
                <span className="text-[10px]">آواز سنیں</span>
              </button>
            </div>

            <p className="text-xs text-cyan-200 font-medium">
              {'word' in quizItem ? `ہجے: ${quizItem.spellingHijja}` : `حرف: (${quizItem.baseLetterName})`}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <button
              onClick={() => handleQuizAnswer('زبر')}
              className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              زبر (ـَ)
            </button>
            <button
              onClick={() => handleQuizAnswer('زیر')}
              className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              زیر (ـِ)
            </button>
            <button
              onClick={() => handleQuizAnswer('پیش')}
              className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              پیش (ـُ)
            </button>
          </div>

          {quizFeedback && (
            <p className={`text-sm font-bold mt-3 ${quizFeedback.includes('شاباش') ? 'text-emerald-400 animate-bounce' : 'text-rose-400'}`}>
              {quizFeedback}
            </p>
          )}
        </div>
      )}

      {/* =========================================================
          TAB 1, 2, 3: MUTAHARRIKAT MASHQ & EXAM WORD GRIDS
         ========================================================= */}
      {activeTab !== 'mufradat' && (
        <div className="space-y-4">
          
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-zinc-300 shadow-sm">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500 ml-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                فلٹر:
              </span>

              <button
                onClick={() => setMashqFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mashqFilter === 'all'
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                تمام ({currentTabWords.length})
              </button>

              <button
                onClick={() => setMashqFilter('zabar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  mashqFilter === 'zabar'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span>زَبَر</span>
                <span className="text-[10px] opacity-80">
                  ({currentTabWords.filter(w => w.category === 'zabar').length})
                </span>
              </button>

              <button
                onClick={() => setMashqFilter('zer')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  mashqFilter === 'zer'
                    ? 'bg-rose-700 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span>زَیْر</span>
                <span className="text-[10px] opacity-80">
                  ({currentTabWords.filter(w => w.category === 'zer').length})
                </span>
              </button>

              <button
                onClick={() => setMashqFilter('pesh')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  mashqFilter === 'pesh'
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <span>پَیْش</span>
                <span className="text-[10px] opacity-80">
                  ({currentTabWords.filter(w => w.category === 'pesh').length})
                </span>
              </button>

              <button
                onClick={() => setMashqFilter('2-letter')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mashqFilter === '2-letter'
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                ۲ حرفی ({currentTabWords.filter(w => w.letterCount === 2).length})
              </button>

              <button
                onClick={() => setMashqFilter('3-letter')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  mashqFilter === '3-letter'
                    ? 'bg-amber-700 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                ۳/۴ حرفی ({currentTabWords.filter(w => w.letterCount >= 3).length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="تلاش کریں (مثلاً: رَبَ، جُعِلَ، عَدَ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-9 py-1.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-arabic"
              />
            </div>
          </div>

          {/* Section Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {activeTab === 'mashq' && 'مشقِ متحرکات (بنیادی مشق)'}
              {activeTab === 'page10' && 'اضافی مشقِ متحرکات'}
              {activeTab === 'exam' && 'امتحانِ متحرکات (جامع مشق)'}
            </span>
            <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              تعداد: {filteredMashqList.length} کلمات
            </span>
          </div>

          {/* WORDS GRID (6 or 7 columns responsive) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {filteredMashqList.map((item, idx) => {
              const isSelected = activeMashqWord?.id === item.id;
              
              const badgeColors = {
                zabar: 'bg-emerald-100 text-emerald-800 border-emerald-300',
                zer: 'bg-rose-100 text-rose-800 border-rose-300',
                pesh: 'bg-blue-100 text-blue-800 border-blue-300'
              };

              return (
                <div
                  key={item.id}
                  onClick={() => speakMashqWord(item)}
                  className={`bg-white border-2 rounded-2xl p-3 text-center cursor-pointer transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex flex-col items-center justify-between min-h-[145px] relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400 scale-105 shadow-xl'
                      : 'border-emerald-600/40 hover:border-emerald-600'
                  }`}
                >
                  {/* Top Badge: Type and Index */}
                  <div className="text-[10px] font-bold text-zinc-400 flex items-center justify-between w-full">
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-black ${badgeColors[item.category]}`}>
                      {item.categoryLabelUrdu}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-sans">#{idx + 1}</span>
                  </div>

                  {/* Main Arabic Word */}
                  <span
                    className={`text-4xl sm:text-5xl font-black font-arabic my-1 tracking-wider ${
                      item.isHeavyLetterIncluded ? 'text-cyan-700' : 'text-zinc-900'
                    }`}
                  >
                    {item.word}
                  </span>

                  {/* Letter Breakdown */}
                  <div className="text-xs font-extrabold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200 my-1 w-full text-center">
                    {item.breakdown}
                  </div>

                  {/* Bottom: Urdu Meaning or Hijja */}
                  <div className="text-[10px] font-bold text-zinc-600 w-full truncate border-t border-zinc-100 pt-1">
                    {pronunciationMode === 'hijja' ? item.spellingHijja : (item.urduMeaning || item.pronunciationWord)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: HARAKAT MUFRADAT TABLE (29 LETTERS WITH ZABAR, ZER, PESH)
         ========================================================= */}
      {activeTab === 'mufradat' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900 px-1">
            <span>مفردات پر حرکات کی مشق (۲۹ حروف کے ساتھ زبر، زیر، پیش):</span>
            <span className="text-cyan-800 font-extrabold">(پُر حروف نیلے رنگ میں ہیں)</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {HARAKAT_LESSON_ITEMS.map((item) => {
              const isSelected = activeCell?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => speakCell(item)}
                  className={`bg-white border-2 rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all shadow-sm hover:shadow-md transform hover:scale-105 flex flex-col items-center justify-between min-h-[110px] sm:min-h-[125px] relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400 scale-105 shadow-lg'
                      : 'border-emerald-600/60 hover:border-emerald-600'
                  }`}
                >
                  {/* Top Badge for Harakat Name */}
                  <div className="text-[10px] font-bold text-zinc-400 flex items-center justify-between w-full">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                      {item.harakatName}
                    </span>
                    <span className="text-[9px] text-emerald-800">#{item.id}</span>
                  </div>

                  {/* Main Large Arabic Letter with Diacritic */}
                  <span
                    className={`text-4xl sm:text-5xl font-black font-arabic my-1 ${
                      item.isHeavy ? 'text-cyan-600 font-extrabold' : 'text-zinc-900'
                    }`}
                  >
                    {item.text}
                  </span>

                  {/* Bottom Spelling Text */}
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 w-full truncate">
                    {pronunciationMode === 'hijja' ? item.hijjaSpelling : item.rawSound}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BOTTOM CONTROL TOOLBAR */}
      <div className="bg-zinc-900 text-white border border-amber-800/40 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="text-xs text-amber-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {activeMashqWord
              ? `چل رہا ہے: ${activeMashqWord.word} (${pronunciationMode === 'hijja' ? activeMashqWord.spellingHijja : activeMashqWord.breakdown})`
              : activeCell
              ? `چل رہا ہے: ${activeCell.text} (${activeCell.hijjaSpelling})`
              : 'کسی بھی خانے پر کلک کر کے اس کی درست تلاوت و تلفظ سنیں۔'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={playFullSequence}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
              isPlayingSequence ? 'bg-amber-600 text-white animate-pulse' : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlayingSequence ? 'روکیں...' : activeTab === 'mufradat' ? 'پورا سبق سنیں (تسلسل سے)' : 'اس صفحے کی پوری مشق سنیں (تسلسل سے)'}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
              isMuted
                ? 'bg-rose-950 text-rose-400 border border-rose-800'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? 'میوٹ' : 'آواز آن'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
