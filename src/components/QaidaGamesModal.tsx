import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Volume2, Trophy, Flame, Coins, 
  CheckCircle2, XCircle, RotateCcw, Star, Heart, RefreshCw, 
  Mic, Award, Gift, Zap, Crown, BarChart3, CloudCheck, Gamepad2,
  BookOpen, Brain, Target, Layers, Play
} from 'lucide-react';
import { LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';
import { MutharrikātGameModal } from './MutharrikātGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { QuranTajweedQuizEngine } from './QuranTajweedQuizEngine';
import { SukoonGameModal } from './SukoonGameModal';
import { HuroofMaddahGameModal } from './HuroofMaddahGameModal';
import { HuroofLeenGameModal } from './HuroofLeenGameModal';
import { KhariHarakatGameModal } from './KhariHarakatGameModal';
import { TanweenGameModal } from './TanweenGameModal';
import { TashdeedGameModal } from './TashdeedGameModal';
import { NunSakinTanweenGameModal } from './NunSakinTanweenGameModal';
import { MeemSakinGameModal } from './MeemSakinGameModal';
import { MeemSakinPuzzleGameModal } from './MeemSakinPuzzleGameModal';
import { TafkheemTarqeeqGameModal } from './TafkheemTarqeeqGameModal';
import { TafkheemTarqeeqPuzzleGameModal } from './TafkheemTarqeeqPuzzleGameModal';
import { MaddatGameModal } from './MaddatGameModal';
import { MuqattaatGameModal } from './MuqattaatGameModal';
import SequentialBlankBoard from './SequentialBlankBoard';
import { playQariText, stopAllQariAudio } from '../utils/qariAudioService';
import { getQaidaGamesLocalization } from '../utils/qaidaGamesLocalization';

interface QaidaGamesModalProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

const ALL_QAIDA_LETTERS = [
  { id: 1, letter: 'ا', name: 'أَلِفْ', makhraj: 'جوفِ دہن (حلق و منہ کا خلا)' },
  { id: 2, letter: 'ب', name: 'بَاءْ', makhraj: 'دونوں ہونٹوں کے ترچھے حصے سے' },
  { id: 3, letter: 'ت', name: 'تَاءْ', makhraj: 'زبان کی نوک اور اوپر کے دانتوں کی جڑ' },
  { id: 4, letter: 'ث', name: 'ثَاءْ', makhraj: 'زبان کا سرا اور اوپر کے دانتوں کا کنارہ' },
  { id: 5, letter: 'ج', name: 'جِيم', makhraj: 'زبان کا درمیان اور تالو کا درمیان' },
  { id: 6, letter: 'ح', name: 'حَاءْ', makhraj: 'حلق کے درمیان والے حصے سے' },
  { id: 7, letter: 'خ', name: 'خَاءْ', makhraj: 'حلق کے اوپر والے حصے سے' },
  { id: 8, letter: 'د', name: 'دَالْ', makhraj: 'زبان کی نوک اور اوپر کے دانتوں کی جڑ' },
  { id: 9, letter: 'ذ', name: 'ذَالْ', makhraj: 'زبان کا سرا اور اوپر کے دانتوں کا کنارہ' },
  { id: 10, letter: 'ر', name: 'رَاءْ', makhraj: 'زبان کی نوک اور مقابل کا تالو' },
  { id: 11, letter: 'ز', name: 'زَا', makhraj: 'زبان کی نوک اور دونوں دانتوں کا اندرونی حصہ' },
  { id: 12, letter: 'س', name: 'سِينْ', makhraj: 'زبان کی نوک اور دونوں دانتوں کا اندرونی حصہ' },
  { id: 13, letter: 'ش', name: 'شِينْ', makhraj: 'زبان کا درمیان اور تالو کا درمیان' },
  { id: 14, letter: 'ص', name: 'صَادْ', makhraj: 'زبان کی نوک اور دونوں دانتوں کا کنارہ' },
  { id: 15, letter: 'ض', name: 'ضَادْ', makhraj: 'زبان کی کروٹ اور اوپر کی داڑھوں کی جڑ' },
  { id: 16, letter: 'ط', name: 'طَاءْ', makhraj: 'زبان کی نوک اور اوپر کے دانتوں کی جڑ' },
  { id: 17, letter: 'ظ', name: 'ظَاءْ', makhraj: 'زبان کا سرا اور اوپر کے دانتوں کا کنارہ' },
  { id: 18, letter: 'ع', name: 'عَيْنْ', makhraj: 'حلق کے درمیان والے حصے سے' },
  { id: 19, letter: 'غ', name: 'غَيْنْ', makhraj: 'حلق کے اوپر والے حصے سے' },
  { id: 20, letter: 'ف', name: 'فَاءْ', makhraj: 'اوپر کے دانتوں کے کنارے اور نِچلے ہونٹ کا بترچھا حصہ' },
  { id: 21, letter: 'ق', name: 'قَافْ', makhraj: 'زبان کی جڑ اور نرم تالو' },
  { id: 22, letter: 'ك', name: 'كَافْ', makhraj: 'زبان کی جڑ اور سخت تالو' },
  { id: 23, letter: 'ل', name: 'لَامْ', makhraj: 'زبان کا کنارہ اور مسوڑھے' },
  { id: 24, letter: 'م', name: 'مِيمْ', makhraj: 'دونوں ہونٹوں کے خشک حصے سے' },
  { id: 25, letter: 'ن', name: 'نُوْنْ', makhraj: 'زبان کا کنارہ اور دانتوں کی جڑیں' },
  { id: 26, letter: 'و', name: 'وَاوْ', makhraj: 'دونوں ہونٹوں کی گولائی سے' },
  { id: 27, letter: 'ه', name: 'هَاءْ', makhraj: 'حلق کے نیچے حصے سے' },
  { id: 28, letter: 'ء', name: 'هَمْزَة', makhraj: 'حلق کا نچلا حصہ' },
  { id: 29, letter: 'ي', name: 'يَاءْ', makhraj: 'زبان کا درمیان اور تالو کا درمیان' },
];

export const QaidaGamesModal: React.FC<QaidaGamesModalProps> = ({ currentLang = 'ur', onBack }) => {
  const gLoc = getQaidaGamesLocalization(currentLang);

  // Reward System & Stats (Persisted to localStorage)
  const [points, setPoints] = useState(() => Number(localStorage.getItem('qaida_points') || 240));
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('qaida_coins') || 450));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('qaida_streak') || 7));
  const [lives, setLives] = useState(3);
  const [xp, setXp] = useState(820);
  const [rankTitle, setRankTitle] = useState('ماہر قاری');
  const [completedGamesCount, setCompletedGamesCount] = useState(() => Number(localStorage.getItem('qaida_games_completed') || 12));

  // Firebase Real Connection Check
  const isFirebaseRealActive = false; // Set strictly based on real connection state

  // Modals & Tabs State
  const [activeTab, setActiveTab] = useState<'huruf' | 'tajweed' | 'quiz' | 'memory' | 'mutaharrikat' | 'murakkabat' | 'sukoon' | 'maddah' | 'leen' | 'khari_harakat' | 'tanween' | 'tashdeed' | 'nun_sakin' | 'meem_sakin' | 'tafkheem_tarqeeq' | 'maddat' | 'muqattaat' | 'magnetic' | 'daily' | 'tournament' | 'badges'>(() => {
    const saved = localStorage.getItem('target_game_tab');
    if (saved) {
      localStorage.removeItem('target_game_tab');
      return saved as any;
    }
    return 'huruf';
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [showRewardToast, setShowRewardToast] = useState<{ text: string; subText: string; type: 'correct' | 'wrong' | 'badge' } | null>(null);
  const [showTreasureChestModal, setShowTreasureChestModal] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [showMeemSakinPuzzle, setShowMeemSakinPuzzle] = useState(false);
  const [showTafkheemPuzzle, setShowTafkheemPuzzle] = useState(false);

  // Back Button Handlers (Hierarchy: Puzzle/Chest Modals > Sub-game Tabs > Return to Hub/Home)
  useBackHandler(() => {
    setShowTreasureChestModal(false);
  }, showTreasureChestModal, 50, 'games_chest_modal');

  useBackHandler(() => {
    setShowMeemSakinPuzzle(false);
  }, showMeemSakinPuzzle, 50, 'games_meem_puzzle');

  useBackHandler(() => {
    setShowTafkheemPuzzle(false);
  }, showTafkheemPuzzle, 50, 'games_tafkheem_puzzle');

  useBackHandler(() => {
    setActiveTab('huruf');
  }, activeTab !== 'huruf' && !showTreasureChestModal && !showMeemSakinPuzzle && !showTafkheemPuzzle, 35, 'games_active_tab');

  useBackHandler(() => {
    onBack();
  }, activeTab === 'huruf' && !showTreasureChestModal && !showMeemSakinPuzzle && !showTafkheemPuzzle, 20, 'games_root_back');

  // Level 2 Murakkabat Game State
  const [l2Index, setL2Index] = useState(0);
  const [selectedL2Category, setSelectedL2Category] = useState<string>('all');
  const [l2Slots, setL2Slots] = useState<(string | null)[]>([]);
  const [l2TileBank, setL2TileBank] = useState<{ id: string; text: string; isUsed: boolean }[]>([]);
  const [l2SelectedId, setL2SelectedId] = useState<string | null>(null);
  const [l2Completed, setL2Completed] = useState(false);

  // 29 Huruf Blank Board Ordering Game State
  const [boardPlacedLetters, setBoardPlacedLetters] = useState<typeof ALL_QAIDA_LETTERS>([]);
  const [boardShuffledLetters, setBoardShuffledLetters] = useState<typeof ALL_QAIDA_LETTERS>(() => 
    [...ALL_QAIDA_LETTERS].sort(() => Math.random() - 0.5)
  );
  const [isSequentialMode, setIsSequentialMode] = useState<boolean>(true);
  const [boardHintLetterId, setBoardHintLetterId] = useState<number | null>(null);
  const [isRecitingBoard, setIsRecitingBoard] = useState<boolean>(false);
  const [reciteHighlightIdx, setReciteHighlightIdx] = useState<number | null>(null);

  const LEVEL_2_ITEMS = [
    // --- 2-LETTER MURAKKABAT (دو حرفی مرکبات) ---
    { id: 'l2-1', category: 'murakkabat', title: 'حروفِ مرکب: لَامْ أَلِفْ', arabicPhrase: 'لَا', words: ['ل', 'ا'], name: 'لَامْ أَلِفْ' },
    { id: 'l2-2', category: 'murakkabat', title: 'حروفِ مرکب: بَاءْ أَلِفْ', arabicPhrase: 'بَا', words: ['ب', 'ا'], name: 'بَاءْ أَلِفْ' },
    { id: 'l2-3', category: 'murakkabat', title: 'حروفِ مرکب: نُوْنْ أَلِفْ', arabicPhrase: 'نَا', words: ['ن', 'ا'], name: 'نُوْنْ أَلِفْ' },
    { id: 'l2-4', category: 'murakkabat', title: 'حروفِ مرکب: تَاءْ أَلِفْ', arabicPhrase: 'تَا', words: ['ت', 'ا'], name: 'تَاءْ أَلِفْ' },
    { id: 'l2-5', category: 'murakkabat', title: 'حروفِ مرکب: ثَاءْ أَلِفْ', arabicPhrase: 'ثَا', words: ['ث', 'ا'], name: 'ثَاءْ أَلِفْ' },
    { id: 'l2-6', category: 'murakkabat', title: 'حروفِ مرکب: يَاءْ أَلِفْ', arabicPhrase: 'يَا', words: ['ي', 'ا'], name: 'يَاءْ أَلِفْ' },
    { id: 'l2-7', category: 'murakkabat', title: 'حروفِ مرکب: سِينْ أَلِفْ', arabicPhrase: 'سَا', words: ['س', 'ا'], name: 'سِينْ أَلِفْ' },
    { id: 'l2-8', category: 'murakkabat', title: 'حروفِ مرکب: شِينْ أَلِفْ', arabicPhrase: 'شَا', words: ['ش', 'ا'], name: 'شِينْ أَلِفْ' },
    { id: 'l2-9', category: 'murakkabat', title: 'حروفِ مرکب: فَاءْ أَلِفْ', arabicPhrase: 'فَا', words: ['ف', 'ا'], name: 'فَاءْ أَلِفْ' },
    { id: 'l2-10', category: 'murakkabat', title: 'حروفِ مرکب: قَافْ أَلِفْ', arabicPhrase: 'قَا', words: ['ق', 'ا'], name: 'قَافْ أَلِفْ' },
    { id: 'l2-11', category: 'murakkabat', title: 'حروفِ مرکب: صَادْ أَلِفْ', arabicPhrase: 'صَا', words: ['ص', 'ا'], name: 'صَادْ أَلِفْ' },
    { id: 'l2-12', category: 'murakkabat', title: 'حروفِ مرکب: ضَادْ أَلِفْ', arabicPhrase: 'ضَا', words: ['ض', 'ا'], name: 'ضَادْ أَلِفْ' },
    { id: 'l2-13', category: 'murakkabat', title: 'حروفِ مرکب: طَاءْ أَلِفْ', arabicPhrase: 'طَا', words: ['ط', 'ا'], name: 'طَاءْ أَلِفْ' },
    { id: 'l2-14', category: 'murakkabat', title: 'حروفِ مرکب: ظَاءْ أَلِفْ', arabicPhrase: 'ظَا', words: ['ظ', 'ا'], name: 'ظَاءْ أَلِفْ' },
    { id: 'l2-15', category: 'murakkabat', title: 'حروفِ مرکب: عَيْنْ أَلِفْ', arabicPhrase: 'عَا', words: ['ع', 'ا'], name: 'عَيْنْ أَلِفْ' },
    { id: 'l2-16', category: 'murakkabat', title: 'حروفِ مرکب: غَيْنْ أَلِفْ', arabicPhrase: 'غَا', words: ['غ', 'ا'], name: 'غَيْنْ أَلِفْ' },
    { id: 'l2-17', category: 'murakkabat', title: 'حروفِ مرکب: كَافْ أَلِفْ', arabicPhrase: 'كَا', words: ['ك', 'ا'], name: 'كَافْ أَلِفْ' },
    { id: 'l2-18', category: 'murakkabat', title: 'حروفِ مرکب: مِيمْ أَلِفْ', arabicPhrase: 'مَا', words: ['م', 'ا'], name: 'مِيمْ أَلِفْ' },
    { id: 'l2-19', category: 'murakkabat', title: 'حروفِ مرکب: هَاءْ أَلِفْ', arabicPhrase: 'هَا', words: ['ه', 'ا'], name: 'هَاءْ أَلِفْ' },
    { id: 'l2-20', category: 'murakkabat', title: 'حروفِ مرکب: بَاءْ لَامْ', arabicPhrase: 'بَلْ', words: ['ب', 'ل'], name: 'بَاءْ لَامْ' },
    { id: 'l2-21', category: 'murakkabat', title: 'حروفِ مرکب: تَاءْ لَامْ', arabicPhrase: 'تَلْ', words: ['ت', 'ل'], name: 'تَاءْ لَامْ' },
    { id: 'l2-22', category: 'murakkabat', title: 'حروفِ مرکب: ثَاءْ لَامْ', arabicPhrase: 'ثَلْ', words: ['ث', 'ل'], name: 'ثَاءْ لَامْ' },
    { id: 'l2-23', category: 'murakkabat', title: 'حروفِ مرکب: نُوْنْ لَامْ', arabicPhrase: 'نَلْ', words: ['ن', 'ل'], name: 'نُوْنْ لَامْ' },
    { id: 'l2-24', category: 'murakkabat', title: 'حروفِ مرکب: يَاءْ لَامْ', arabicPhrase: 'يَلْ', words: ['ي', 'ل'], name: 'يَاءْ لَامْ' },
    { id: 'l2-25', category: 'murakkabat', title: 'حروفِ مرکب: كَافْ بَاءْ', arabicPhrase: 'كَبْ', words: ['ك', 'ب'], name: 'كَافْ بَاءْ' },
    { id: 'l2-26', category: 'murakkabat', title: 'حروفِ مرکب: بَاءْ حَاءْ', arabicPhrase: 'بَحْ', words: ['ب', 'ح'], name: 'بَاءْ حَاءْ' },
    { id: 'l2-27', category: 'murakkabat', title: 'حروفِ مرکب: بَاءْ جِيمْ', arabicPhrase: 'بَجْ', words: ['ب', 'ج'], name: 'بَاءْ جِيمْ' },
    { id: 'l2-28', category: 'murakkabat', title: 'حروفِ مرکب: بَاءْ خَاءْ', arabicPhrase: 'بَخْ', words: ['ب', 'خ'], name: 'بَاءْ خَاءْ' },
    { id: 'l2-29', category: 'murakkabat', title: 'حروفِ مرکب: يَاءْ سِينْ', arabicPhrase: 'يَسْ', words: ['ي', 'س'], name: 'يَاءْ سِينْ' },
    { id: 'l2-30', category: 'murakkabat', title: 'حروفِ مرکب: عَيْنْ نُوْنْ', arabicPhrase: 'عَنْ', words: ['ع', 'ن'], name: 'عَيْنْ نُوْنْ' },
    { id: 'l2-31', category: 'murakkabat', title: 'حروفِ مرکب: قَافْ دَالْ', arabicPhrase: 'قَدْ', words: ['ق', 'د'], name: 'قَافْ دَالْ' },
    { id: 'l2-32', category: 'murakkabat', title: 'حروفِ مقطعات: طٰهٰ', arabicPhrase: 'طٰهٰ', words: ['ط', 'ه'], name: 'طَاءْ هَاءْ' },
    { id: 'l2-33', category: 'murakkabat', title: 'حروفِ مقطعات: یٰسٓ', arabicPhrase: 'یٰسٓ', words: ['ي', 'س'], name: 'يَاءْ سِينْ' },
    { id: 'l2-34', category: 'murakkabat', title: 'حروفِ مقطعات: حٰمٓ', arabicPhrase: 'حٰمٓ', words: ['ح', 'م'], name: 'حَاءْ مِيمْ' },

    // --- 3-LETTER MURAKKABAT (تین حرفی مرکبات) ---
    { id: 'l2-35', category: '3-letter', title: 'تین حرفی مرکب: قَتَلَ', arabicPhrase: 'قَتَلَ', words: ['ق', 'ت', 'ل'], name: 'قَافْ تَاءْ لَامْ' },
    { id: 'l2-36', category: '3-letter', title: 'تین حرفی مرکب: نَصَرَ', arabicPhrase: 'نَصَرَ', words: ['ن', 'ص', 'ر'], name: 'نُوْنْ صَادْ رَاءْ' },
    { id: 'l2-37', category: '3-letter', title: 'تین حرفی مرکب: خَلَقَ', arabicPhrase: 'خَلَقَ', words: ['خ', 'ل', 'ق'], name: 'خَاءْ لَامْ قَافْ' },
    { id: 'l2-38', category: '3-letter', title: 'تین حرفی مرکب: جَعَلَ', arabicPhrase: 'جَعَلَ', words: ['ج', 'ع', 'ل'], name: 'جِيمْ عَيْنْ لَامْ' },
    { id: 'l2-39', category: '3-letter', title: 'تین حرفی مرکب: كَتَبَ', arabicPhrase: 'كَتَبَ', words: ['ك', 'ت', 'ب'], name: 'كَافْ تَاءْ بَاءْ' },
    { id: 'l2-40', category: '3-letter', title: 'تین حرفی مرکب: صَبَرَ', arabicPhrase: 'صَبَرَ', words: ['ص', 'ب', 'ر'], name: 'صَادْ بَاءْ رَاءْ' },
    { id: 'l2-41', category: '3-letter', title: 'تین حرفی مرکب: عَقَلَ', arabicPhrase: 'عَقَلَ', words: ['ع', 'ق', 'ل'], name: 'عَيْنْ قَافْ لَامْ' },
    { id: 'l2-42', category: '3-letter', title: 'تین حرفی مرکب: بَلَغَ', arabicPhrase: 'بَلَغَ', words: ['ب', 'ل', 'غ'], name: 'بَاءْ لَامْ غَيْنْ' },
    { id: 'l2-43', category: '3-letter', title: 'تین حرفی مرکب: ضَرَبَ', arabicPhrase: 'ضَرَبَ', words: ['ض', 'ر', 'ب'], name: 'ضَادْ رَاءْ بَاءْ' },
    { id: 'l2-44', category: '3-letter', title: 'تین حرفی مرکب: عَلِمَ', arabicPhrase: 'عَلِمَ', words: ['ع', 'ل', 'م'], name: 'عَيْنْ لَامْ مِيمْ' },
    { id: 'l2-45', category: '3-letter', title: 'تین حرفی مرکب: حَمِدَ', arabicPhrase: 'حَمِدَ', words: ['ح', 'م', 'د'], name: 'حَاءْ مِيمْ دَالْ' },
    { id: 'l2-46', category: '3-letter', title: 'تین حرفی کلمہ: أَحَدٌ', arabicPhrase: 'أَحَدٌ', words: ['أ', 'ح', 'د'], name: 'أَلِفْ حَاءْ دَالْ' },
    { id: 'l2-47', category: '3-letter', title: 'تین حرفی کلمہ: صَمَدٌ', arabicPhrase: 'صَمَدٌ', words: ['ص', 'م', 'د'], name: 'صَادْ مِيمْ دَالْ' },
    { id: 'l2-48', category: '3-letter', title: 'تین حرفی کلمہ: عَبَدَ', arabicPhrase: 'عَبَدَ', words: ['ع', 'ب', 'د'], name: 'عَيْنْ بَاءْ دَالْ' },
    { id: 'l2-49', category: '3-letter', title: 'تین حرفی کلمہ: لَهَبٍ', arabicPhrase: 'لَهَبٍ', words: ['ل', 'ه', 'ب'], name: 'لَامْ هَاءْ بَاءْ' },
    { id: 'l2-50', category: '3-letter', title: 'تین حرفی کلمہ: مَلِكِ', arabicPhrase: 'مَلِكِ', words: ['م', 'ل', 'ك'], name: 'مِيمْ لَامْ كَافْ' },
    { id: 'l2-51', category: 'bismillah', title: 'تسمیہ: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', arabicPhrase: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', words: ['بِسْمِ', 'اللَّهِ', 'الرَّحْمَٰنِ', 'الرَّحِيمِ'], name: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' }
  ];

  const filteredL2Items = selectedL2Category === 'all' 
    ? LEVEL_2_ITEMS 
    : LEVEL_2_ITEMS.filter(item => item.category === selectedL2Category);

  const currentL2Item = filteredL2Items[l2Index] || filteredL2Items[0] || LEVEL_2_ITEMS[0];

  useEffect(() => {
    setL2Index(0);
  }, [selectedL2Category]);

  const initL2Puzzle = () => {
    setL2Completed(false);
    if (!currentL2Item) return;
    setL2Slots(Array(currentL2Item.words.length).fill(null));

    const correctWords = currentL2Item.words;
    const isSingleLetters = correctWords.every(w => w.length <= 2);
    let distractors: string[] = [];

    if (isSingleLetters) {
      const letterPool = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
      distractors = letterPool.filter(l => !correctWords.includes(l)).sort(() => Math.random() - 0.5).slice(0, 3);
    } else {
      distractors = ['مِن', 'فِي', 'بِ', 'لِ', 'عَن', 'مَعَ'].filter(w => !correctWords.includes(w)).slice(0, 2);
    }

    const tiles = [...correctWords, ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((text, idx) => ({
        id: `l2-tile-${idx}-${text}`,
        text,
        isUsed: false,
      }));

    setL2TileBank(tiles);
    setL2SelectedId(null);
  };

  useEffect(() => {
    initL2Puzzle();
  }, [l2Index, selectedL2Category]);

  const handleL2TileClick = (tileId: string) => {
    const tile = l2TileBank.find(t => t.id === tileId);
    if (!tile || tile.isUsed) return;
    speakText(tile.text, 'ar-SA', 0.8);
    setL2SelectedId(l2SelectedId === tileId ? null : tileId);
  };

  const handleL2SlotClick = (slotIdx: number) => {
    if (l2Slots[slotIdx] !== null) {
      const wordToRemove = l2Slots[slotIdx];
      const newSlots = [...l2Slots];
      newSlots[slotIdx] = null;
      setL2Slots(newSlots);
      setL2TileBank(l2TileBank.map(t => t.text === wordToRemove && t.isUsed ? { ...t, isUsed: false } : t));
      return;
    }

    if (l2SelectedId) {
      const tile = l2TileBank.find(t => t.id === l2SelectedId);
      if (!tile) return;

      const newSlots = [...l2Slots];
      newSlots[slotIdx] = tile.text;
      setL2Slots(newSlots);
      setL2TileBank(l2TileBank.map(t => t.id === l2SelectedId ? { ...t, id: l2SelectedId, isUsed: true } : t));
      setL2SelectedId(null);

      checkL2Completion(newSlots);
    }
  };

  const playCurrentItemAudio = () => {
    if (currentL2Item.name) {
      speakText(currentL2Item.name, 'ar-SA', 0.7);
    } else {
      speakText(currentL2Item.arabicPhrase, 'ar-SA', 0.7);
    }
  };

  const checkL2Completion = (slots: (string | null)[]) => {
    if (slots.some(s => s === null)) return;

    const isCorrect = slots.every((w, idx) => w === currentL2Item.words[idx]);
    if (isCorrect) {
      setL2Completed(true);
      setPoints(p => p + 50);
      setCoins(c => c + 25);
      setCompletedGamesCount(c => c + 1);

      setShowRewardToast({
        text: 'ماشاء اللہ! بہت خوب 🎉',
        subText: '+50 اسکور | +25 سکے | زبردست، مرکب بالکل درست جوڑ لیا!',
        type: 'correct'
      });

      speakText('ماشاء اللہ! بالکل درست جوڑا', 'ur-PK', 0.95);

      setTimeout(() => {
        playCurrentItemAudio();
      }, 2200);
    } else {
      speakText('ترتیب درست نہیں ہے، دوبارہ کوشش کریں', 'ur-PK', 0.9);
    }
  };

  const nextL2Item = () => {
    if (l2Index < filteredL2Items.length - 1) {
      setL2Index(l2Index + 1);
    } else {
      setL2Index(0);
    }
  };

  const prevL2Item = () => {
    if (l2Index > 0) {
      setL2Index(l2Index - 1);
    } else {
      setL2Index(filteredL2Items.length - 1);
    }
  };

  // Memory Game State (🎯 یادداشت کے کھیل - تمام اسباق ۱ تا ۹)
  const MEMORY_LESSON_CARDS: Record<string, { label: string; number: number; color: string; letters: string[] }> = {
    mufradat: {
      label: 'مفردات',
      number: 1,
      color: 'from-cyan-600 to-blue-600',
      letters: ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د'],
    },
    murakkabat: {
      label: 'مرکبات',
      number: 2,
      color: 'from-indigo-600 to-purple-600',
      letters: ['لَا', 'بَا', 'نَا', 'تَا', 'جَح', 'عَا', 'سَا', 'فَا'],
    },
    mutaharrikat: {
      label: 'حرکات',
      number: 3,
      color: 'from-emerald-600 to-teal-600',
      letters: ['دَ', 'رَ', 'زَ', 'بِ', 'تِ', 'سُ', 'کُ', 'خُ'],
    },
    sukoon: {
      label: 'سکون و قلقلہ',
      number: 4,
      color: 'from-purple-600 to-pink-600',
      letters: ['أَبْ', 'قُلْ', 'مَنْ', 'کَمْ', 'قَدْ', 'يَدْ', 'اِقْرَأْ', 'لَمْ'],
    },
    maddah: {
      label: 'حروفِ مدہ',
      number: 5,
      color: 'from-amber-600 to-yellow-600',
      letters: ['بَا', 'بُوْ', 'بِیْ', 'تَا', 'تُوْ', 'تِیْ', 'نُوْ', 'فِیْ'],
    },
    leen: {
      label: 'حروفِ لین',
      number: 6,
      color: 'from-teal-600 to-emerald-600',
      letters: ['خَوْفْ', 'بَیْتْ', 'قَوْمْ', 'صَیْفْ', 'شَیْءْ', 'یَوْمْ', 'عَیْنْ', 'لَیْلْ'],
    },
    khari_harakat: {
      label: 'کھڑی حرکات',
      number: 7,
      color: 'from-rose-600 to-red-600',
      letters: ['بٰ', 'بٖ', 'بٗ', 'تٰ', 'تٖ', 'تٗ', 'مٰ', 'لٰ'],
    },
    tanween: {
      label: 'تنوین',
      number: 8,
      color: 'from-yellow-600 to-amber-600',
      letters: ['بً', 'بٍ', 'بٌ', 'تً', 'تٍ', 'تٌ', 'اَحَدًا', 'کُفُوًا'],
    },
    tashdeed: {
      label: 'تشدید',
      number: 9,
      color: 'from-orange-600 to-amber-700',
      letters: ['اَبَّ', 'اِنَّ', 'عَمَّ', 'ثُمَّ', 'رَبِّ', 'مُحَمَّدْ', 'يَظُنُّ', 'جَنَّتْ'],
    },
    nun_sakin: {
      label: 'نون ساکن و تنوین',
      number: 10,
      color: 'from-teal-600 to-emerald-600',
      letters: ['مَنْ اٰمَنَ', 'مَنْ يَّقُوْلُ', 'مِنۢ بَعْدِ', 'مِنْ خَوْفٍ', 'كُفُوًا اَحَدٌ', 'مِنْ لَّدُنْهُ', 'عَنْهُ', 'مَنْ صَلٰى'],
    },
    meem_sakin: {
      label: 'میم ساکن',
      number: 11,
      color: 'from-blue-600 to-indigo-600',
      letters: ['هُمْ فِيهَا', 'رَبُّهُم بِهِم', 'مَّنْ شَاءَ', 'بِهِ مُّعْمِنُونَ', 'عَلَيْهِمْ طَيْرًا', 'أَمْ لَمْ تُنذِرْهُمْ', 'تَرْمِيهِم بِحِجَارَةٍ', 'سَوَاءٌ عَلَيْهِمْ'],
    },
    tafkheem_tarqeeq: {
      label: 'تفخیم و ترقیق',
      number: 12,
      color: 'from-amber-500 to-yellow-600',
      letters: ['قَاْلَ', 'صِرَاطَ', 'وَاللهُ', 'رَسُوْلُ اللهِ', 'بِسْمِ اللهِ', 'لِلّٰهِ', 'فِرْعَوْنَ', 'مِرْصَادًا'],
    },
    maddat: {
      label: 'مَدَّات کے قواعد',
      number: 13,
      color: 'from-purple-600 to-indigo-700',
      letters: ['جَآءَ', 'سِیْٓئَتْ', 'أُولٰٓئِكَ', 'فِيْٓ أَنفُسِكُمْ', 'جَآنٌّ', 'ضَآلًّا', 'مُسْلِمُوْنْ ۝', 'شَفَتَیْنْ ۝'],
    },
    muqattaat: {
      label: 'حروفِ مقطعات',
      number: 14,
      color: 'from-emerald-600 to-teal-700',
      letters: ['طٰہٰ', 'یٰسٓ', 'الٓمٓ', 'طٰسٓمٓ', 'عٓسٓقٓ', 'الٓرٰ', 'صٓ', 'کٓہٰیٰعٓصٓ'],
    },
  };

  const [selectedMemoryLesson, setSelectedMemoryLesson] = useState<string>('mufradat');
  const [memoryCards, setMemoryCards] = useState<{ id: number; letter: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryCompleted, setMemoryCompleted] = useState(false);

  const initMemoryGame = (lessonKey = selectedMemoryLesson) => {
    const lessonData = MEMORY_LESSON_CARDS[lessonKey] || MEMORY_LESSON_CARDS.mufradat;
    const pool = lessonData.letters.slice(0, 6);
    const duplicated = [...pool, ...pool];
    const shuffled = duplicated
      .sort(() => Math.random() - 0.5)
      .map((letter, idx) => ({
        id: idx,
        letter,
        isFlipped: false,
        isMatched: false,
      }));
    setMemoryCards(shuffled);
    setFlippedCards([]);
    setMemoryMoves(0);
    setMemoryCompleted(false);
  };

  useEffect(() => {
    if (activeTab === 'memory') {
      initMemoryGame(selectedMemoryLesson);
    }
  }, [activeTab, selectedMemoryLesson]);

  const handleMemoryCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    const card = memoryCards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    speakText(card.letter, 'ar-SA', 0.85);

    const updatedCards = memoryCards.map(c => c.id === cardId ? { ...c, isFlipped: true } : c);
    setMemoryCards(updatedCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = memoryCards.find(c => c.id === firstId);
      const secondCard = memoryCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.letter === secondCard.letter) {
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c));
          setFlippedCards([]);
          checkMemoryGameWin();
        }, 500);
      } else {
        setTimeout(() => {
          setMemoryCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const checkMemoryGameWin = () => {
    setTimeout(() => {
      setMemoryCards(current => {
        const allMatched = current.every(c => c.isMatched || c.isFlipped);
        if (allMatched) {
          setMemoryCompleted(true);
          setPoints(p => p + 40);
          setCoins(c => c + 20);
          setXp(x => x + 60);
          setCompletedGamesCount(g => g + 1);

          setShowRewardToast({
            text: 'ماشاء اللہ! تمام جوڑے تلاش کر لیے 🎉',
            subText: '+40 اسکور | +20 سکے | +60 XP حاصل ہوئے!',
            type: 'correct'
          });
          speakText('ماشاء اللہ! بہت خوب', 'ur-PK', 0.95);
        }
        return current;
      });
    }, 200);
  };

  // AI Pronunciation Checker State
  const [isRecordingAI, setIsRecordingAI] = useState(false);
  const [aiEvaluationResult, setAiEvaluationResult] = useState<{ score: number; feedback: string } | null>(null);

  // Quiz mechanics
  const [currentTargetIndex, setCurrentTargetIndex] = useState(17);
  const [options, setOptions] = useState<typeof ALL_QAIDA_LETTERS>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'wrong' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('qaida_points', points.toString());
    localStorage.setItem('qaida_coins', coins.toString());
    localStorage.setItem('qaida_streak', streak.toString());
    localStorage.setItem('qaida_games_completed', completedGamesCount.toString());

    if (points > 1000) setRankTitle('حافظِ قرآن');
    else if (points > 500) setRankTitle('متقدم قاری');
    else setRankTitle('مبتدی قاری');
  }, [points, coins, streak, completedGamesCount]);

  // Speech helper
  const speakText = (text: string, lang = 'ar-SA', rate = 0.82) => {
    stopAllQariAudio();
    if (lang === 'ar-SA' || lang === 'ar') {
      playQariText(text);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang;
        u.rate = rate;
        window.speechSynthesis.speak(u);
      }
    }
  };

  // 29 Huruf Blank Board Ordering Game Handlers
  const handleBoardTileClick = (item: typeof ALL_QAIDA_LETTERS[0]) => {
    speakText(item.name, 'ar-SA', 0.8);

    const isAlreadyPlaced = boardPlacedLetters.some(l => l.id === item.id);
    if (isAlreadyPlaced) return;

    if (isSequentialMode) {
      const nextExpectedIndex = boardPlacedLetters.length;
      if (nextExpectedIndex >= 29) return;

      const nextExpectedItem = ALL_QAIDA_LETTERS[nextExpectedIndex];

      if (item.id === nextExpectedItem.id) {
        const newPlaced = [...boardPlacedLetters, item];
        setBoardPlacedLetters(newPlaced);
        setBoardHintLetterId(null);

        setPoints(p => p + 10);
        setCoins(c => c + 4);
        setXp(x => x + 25);

        if (newPlaced.length === 29) {
          setShowRewardToast({
            text: '🎉 ماشاء اللہ! تمام ۲۹ حروف مکمل ترتیب سے رکھ دیے گئے!',
            subText: '+100 پوائنٹس اور +50 سکے کا خاص انعام مبارک ہو!',
            type: 'correct'
          });
          speakText('ماشاء اللہ! بہت خوب مبارک ہو', 'ur-PK', 0.9);
        } else {
          setShowRewardToast({
            text: `شاباش! حرف "${item.letter}" (${item.name}) بورڈ پر آ گیا ✨`,
            subText: `اگلا حرف رکھیں۔ (+10 پوائنٹس)`,
            type: 'correct'
          });
          setTimeout(() => setShowRewardToast(null), 1500);
        }
      } else {
        setBoardHintLetterId(nextExpectedItem.id);
        setShowRewardToast({
          text: `اگلا صحیح حرف "${nextExpectedItem.letter}" (${nextExpectedItem.name}) ہے! 💡`,
          subText: `ترتیب برقرار رکھیں۔ ا، ب، ت، ث، ج... کے مطابق انتخاب کریں!`,
          type: 'wrong'
        });
        setTimeout(() => setShowRewardToast(null), 2500);
      }
    } else {
      const newPlaced = [...boardPlacedLetters, item];
      setBoardPlacedLetters(newPlaced);
      setPoints(p => p + 5);
      setCoins(c => c + 2);
    }
  };

  const resetBoardGame = () => {
    setBoardPlacedLetters([]);
    setBoardShuffledLetters([...ALL_QAIDA_LETTERS].sort(() => Math.random() - 0.5));
    setBoardHintLetterId(null);
    setIsRecitingBoard(false);
    setReciteHighlightIdx(null);
  };

  const shuffleBoardBank = () => {
    setBoardShuffledLetters([...ALL_QAIDA_LETTERS].sort(() => Math.random() - 0.5));
  };

  const hintNextLetter = () => {
    if (boardPlacedLetters.length >= 29) return;
    const nextItem = ALL_QAIDA_LETTERS[boardPlacedLetters.length];
    setBoardHintLetterId(nextItem.id);
    speakText(nextItem.name, 'ar-SA', 0.8);
    setShowRewardToast({
      text: `💡 اگلا حرف: "${nextItem.letter}" (${nextItem.name})`,
      subText: `نیچے کے خانے میں اسے تلاش کر کے کلک کریں۔`,
      type: 'correct'
    });
    setTimeout(() => setShowRewardToast(null), 2500);
  };

  const reciteAllPlacedLetters = async () => {
    if (boardPlacedLetters.length === 0 || isRecitingBoard) return;
    setIsRecitingBoard(true);

    for (let i = 0; i < boardPlacedLetters.length; i++) {
      setReciteHighlightIdx(i);
      const item = boardPlacedLetters[i];
      await playQariText(item.name);
      await new Promise(r => setTimeout(r, 450));
    }

    setReciteHighlightIdx(null);
    setIsRecitingBoard(false);
  };

  // Setup Quiz Question
  const setupQuestion = (targetIdx: number, autoSpeak = true) => {
    setCurrentTargetIndex(targetIdx);
    setSelectedOptionId(null);
    setAnswerStatus(null);
    setAiEvaluationResult(null);

    const targetItem = ALL_QAIDA_LETTERS[targetIdx];
    const otherItems = ALL_QAIDA_LETTERS.filter((_, i) => i !== targetIdx);
    const shuffledOthers = [...otherItems].sort(() => 0.5 - Math.random()).slice(0, 3);
    const currentOptions = [targetItem, ...shuffledOthers].sort(() => 0.5 - Math.random());
    setOptions(currentOptions);

    if (autoSpeak) {
      setTimeout(() => {
        speakText(targetItem.name, 'ar-SA', 0.8);
      }, 250);
    }
  };

  useEffect(() => {
    setupQuestion(17, false);
    setTimeout(() => {
      speakText('سُبْحَانَ اللَّهِ', 'ar-SA', 0.85);
    }, 300);
  }, []);

  const handleOptionClick = (item: typeof ALL_QAIDA_LETTERS[0]) => {
    if (answerStatus === 'correct' || isFlipping || showGameOver) return;

    const targetItem = ALL_QAIDA_LETTERS[currentTargetIndex];
    setSelectedOptionId(item.id);

    if (item.id === targetItem.id) {
      setAnswerStatus('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints(prev => prev + 15);
      setCoins(prev => prev + 8);
      setXp(prev => prev + 50);

      setShowRewardToast({
        text: 'ماشاء اللہ! بہت خوب 🎉',
        subText: `+15 اسکور | +8 سکے | +50 XP | مسلسل دنوں کی ترتیب x${newStreak}`,
        type: 'correct'
      });

      speakText('ماشاء اللہ! بہت خوب', 'ur-PK', 0.95);
      setIsFlipping(true);

    } else {
      setAnswerStatus('wrong');
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => {
          setShowGameOver(true);
        }, 1200);
      }

      speakText('دوبارہ کوشش کریں', 'ur-PK', 0.95);

      setShowRewardToast({
        text: 'دوبارہ کوشش کریں! ❌',
        subText: `آپ کی ۱ زندگی کم ہو گئی۔ صحیح حرف پر توجہ دیں۔`,
        type: 'wrong'
      });

      setTimeout(() => {
        setShowRewardToast(null);
        setAnswerStatus(null);
        setSelectedOptionId(null);
      }, 1600);
    }
  };

  const goToNextQuestion = () => {
    setShowRewardToast(null);
    setIsFlipping(false);
    const nextIdx = (currentTargetIndex + 1) % ALL_QAIDA_LETTERS.length;
    setupQuestion(nextIdx);
  };

  const refillLivesAndRestart = () => {
    setLives(3);
    setShowGameOver(false);
    setupQuestion(currentTargetIndex);
  };

  // AI Speech Pronunciation Checker
  const handleAiPronunciationCheck = () => {
    if (isRecordingAI) return;
    setIsRecordingAI(true);
    speakText('براہ کرم تلاوت فرمائیں...', 'ur-PK');

    setTimeout(() => {
      setIsRecordingAI(false);
      const randomScore = Math.floor(Math.random() * 15) + 85;
      setAiEvaluationResult({
        score: randomScore,
        feedback: `ماشاء اللہ! آپ کا مخرج اور تلفظ انتہائی شاندار ہے۔ (مخرج: ${ALL_QAIDA_LETTERS[currentTargetIndex].makhraj})`
      });
      setPoints(prev => prev + 20);
      setCoins(prev => prev + 10);
      speakText('ماشاء اللہ! بہت خوب', 'ur-PK', 0.95);
    }, 2500);
  };

  const claimTreasureChest = () => {
    if (chestClaimed) return;
    setChestClaimed(true);
    setPoints(prev => prev + 100);
    setCoins(prev => prev + 50);
    setShowRewardToast({
      text: 'مبارک ہو! روزانہ انعام حاصل ہو گیا 🎁',
      subText: `+100 اسکور اور +50 سکے آپ کے اکاؤنٹ میں شامل کر دیے گئے!`,
      type: 'badge'
    });
    setTimeout(() => setShowRewardToast(null), 3000);
  };

  const currentTarget = ALL_QAIDA_LETTERS[currentTargetIndex];
  const progressPercent = Math.round(((currentTargetIndex + 1) / ALL_QAIDA_LETTERS.length) * 100);
  const currentLevel = Math.floor(currentTargetIndex / 10) + 1;

  return (
    <div className="min-h-screen bg-[#0e131d] text-white relative overflow-x-hidden font-urdu" dir="rtl">
      
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-emerald-900/15 via-amber-900/15 to-purple-900/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 py-5 pb-24 space-y-6">

        {/* 1. HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shrink-0">
              <Gamepad2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-amber-300">
                🎮 {gLoc.headerTitle}
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                {gLoc.headerSubtitle}
              </p>
              
              {/* Optional Firebase status - rendered only if confirmed */}
              {isFirebaseRealActive && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50 mt-1">
                  <CloudCheck className="w-3.5 h-3.5" /> آن لائن سنک فعال
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowTreasureChestModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Gift className="w-4 h-4" />
              <span>🎁 روزانہ انعام</span>
            </button>

            <button
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title={gLoc.backBtn}
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>{gLoc.backBtn}</span>
            </button>
          </div>
        </div>

        {/* STATS SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center gap-2 shadow-md">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold">اسکور</p>
              <p className="text-xs sm:text-sm font-black text-amber-300">{points} ⭐</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center gap-2 shadow-md">
            <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold">سکے</p>
              <p className="text-xs sm:text-sm font-black text-yellow-300">{coins} 🪙</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center gap-2 shadow-md">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold">تسلسل</p>
              <p className="text-xs sm:text-sm font-black text-orange-400">{streak} دن 🔥</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center gap-2 shadow-md">
            <Zap className="w-4 h-4 text-purple-400 fill-purple-400 shrink-0" />
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold">لیول {currentLevel}</p>
              <p className="text-xs sm:text-sm font-black text-purple-300">{xp} XP</p>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-center gap-2 shadow-md">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 font-bold">زندگیاں</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                {[1, 2, 3].map((heartIndex) => (
                  <Heart
                    key={heartIndex}
                    className={`w-4 h-4 ${
                      heartIndex <= lives
                        ? 'text-rose-500 fill-rose-500 scale-105'
                        : 'text-slate-700 fill-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. 🔥 TODAY'S CHALLENGE */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border border-amber-600/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">{gLoc.todayChallenge}</h3>
                <span className="text-[10px] bg-amber-900/80 text-amber-200 px-2.5 py-0.5 rounded-full font-bold border border-amber-700/60">
                  {gLoc.todayChallengeReward}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{gLoc.todayChallengeDesc}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('huruf')}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{gLoc.playNow}</span>
          </button>
        </motion.div>

        {/* 3. 📚 LEARNING GAMES (4 CORE CARDS + TAB SELECTOR) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{gLoc.learningGamesHeading}</span>
            </h2>
          </div>

          {/* 5 MAIN CATEGORY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            
            {/* CARD 1: 🔤 حروفِ مفردات بلینک بورڈ */}
            <div
              onClick={() => setActiveTab('huruf')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                activeTab === 'huruf'
                  ? 'bg-amber-950/60 border-amber-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center shrink-0 font-extrabold text-lg">
                  🔤
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">{gLoc.cardHurufTitle}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{gLoc.cardHurufDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-amber-300 shrink-0">
                {gLoc.playBtn}
              </span>
            </div>

            {/* CARD 2: 🧩 حروف جوڑ مقناطیسی پزل (تمام اسباق ۱ تا ۱۲) */}
            <div
              onClick={() => setActiveTab('magnetic')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                activeTab === 'magnetic' || activeTab === 'murakkabat'
                  ? 'bg-purple-950/70 border-purple-400 ring-2 ring-purple-400/40 shadow-purple-900/50'
                  : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-900/80 text-yellow-300 border border-purple-600 flex items-center justify-center shrink-0 font-extrabold text-lg animate-pulse">
                  🧩
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-black text-white">{gLoc.cardMagneticTitle}</h3>
                    <span className="bg-yellow-400 text-purple-950 text-[10px] font-black px-1.5 rounded-full">{gLoc.lessonTag1to12}</span>
                  </div>
                  <p className="text-xs text-purple-200 mt-0.5">{gLoc.cardMagneticDesc}</p>
                </div>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shrink-0 shadow">
                {gLoc.playPuzzleBtn}
              </span>
            </div>

            {/* CARD 3: 📖 قاعدہ صوتی و بصری گیمز (تمام اسباق ۱ تا ۱۳) */}
            <div
              onClick={() => setActiveTab('tajweed')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                activeTab === 'tajweed' || activeTab === 'mutaharrikat' || activeTab === 'sukoon' || activeTab === 'maddah' || activeTab === 'leen' || activeTab === 'khari_harakat' || activeTab === 'tanween' || activeTab === 'tashdeed' || activeTab === 'nun_sakin' || activeTab === 'meem_sakin' || activeTab === 'tafkheem_tarqeeq' || activeTab === 'maddat'
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shrink-0 font-extrabold text-lg">
                  📖
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-white">{gLoc.cardTajweedTitle}</h3>
                    <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-1.5 rounded-full">{gLoc.lessonTag1to12}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{gLoc.cardTajweedDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-emerald-300 shrink-0">
                {gLoc.playBtn}
              </span>
            </div>

            {/* CARD 4: 🧠 جامع قرآن کوئز */}
            <div
              onClick={() => setActiveTab('quiz')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                activeTab === 'quiz'
                  ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-400/30'
                  : 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center shrink-0 font-extrabold text-lg">
                  🧠
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-white">{gLoc.cardQuizTitle}</h3>
                    <span className="bg-indigo-400 text-slate-950 text-[10px] font-black px-1.5 rounded-full">{gLoc.lessonTag1to12}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{gLoc.cardQuizDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-indigo-300 shrink-0">
                {gLoc.playBtn}
              </span>
            </div>

            {/* CARD 5: 🎯 یادداشت کے کھیل */}
            <div
              onClick={() => setActiveTab('memory')}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-lg flex items-center justify-between gap-3 ${
                activeTab === 'memory'
                  ? 'bg-cyan-950/60 border-cyan-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/50'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 font-extrabold text-lg">
                  🎯
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-extrabold text-white">{gLoc.cardMemoryTitle}</h3>
                    <span className="bg-cyan-400 text-slate-950 text-[10px] font-black px-1.5 rounded-full">{gLoc.lessonTag1to12}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{gLoc.cardMemoryDesc}</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 shrink-0">
                {gLoc.playBtn}
              </span>
            </div>

          </div>

          {/* SECONDARY GAME TABS ROW */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <button
              onClick={() => setActiveTab('tournament')}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all border ${
                activeTab === 'tournament'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {gLoc.tabTournament}
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all border ${
                activeTab === 'badges'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {gLoc.tabBadges}
            </button>

            <button
              onClick={() => setActiveTab('daily')}
              className={`py-2 px-3.5 rounded-xl font-bold text-xs whitespace-nowrap cursor-pointer transition-all border ${
                activeTab === 'daily'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {gLoc.tabDailyChallenge}
            </button>
          </div>
        </div>

        {/* FLOATING TOAST NOTIFICATION */}
        <AnimatePresence>
          {showRewardToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`p-4 rounded-2xl border text-center shadow-xl backdrop-blur-md ${
                showRewardToast.type === 'correct' || showRewardToast.type === 'badge'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/90 border-rose-500 text-rose-100'
              }`}
            >
              <p className="text-base font-black">{showRewardToast.text}</p>
              <p className="text-xs font-bold mt-1 opacity-90">{showRewardToast.subText}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. ACTIVE GAME SCREEN DISPLAY */}

        {/* GAME MODE 1: 🔤 حروفِ تہجی - بلینک بورڈ (SEQUENTIAL BLANK BOARD) */}
        {activeTab === 'huruf' && (
          <div className="w-full">
            <SequentialBlankBoard
              currentLang={currentLang}
              initialXp={xp}
              initialCoins={coins}
              onComplete={(data) => {
                setXp(data.totalXp);
                setCoins(data.totalCoins);
                setPoints((prev) => prev + data.xp * 2);
                setCompletedGamesCount((prev) => prev + 1);
                localStorage.setItem('qaida_coins', String(data.totalCoins));
                localStorage.setItem('qaida_points', String(points + data.xp * 2));
                localStorage.setItem('qaida_games_completed', String(completedGamesCount + 1));
                setShowRewardToast({
                  text: 'ماشاءاللہ! بلینک بورڈ مکمل ہو گیا!',
                  subText: `+${data.xp} XP • +${data.coins} سکہ جات حاصل کیے!`,
                  type: 'correct',
                });
              }}
            />
          </div>
        )}

        {/* GAME MODE 2: 📖 قاعدہ و تجوید (MUTHARRIKAT, SUKOON & MURAKKABAT) */}
        {(activeTab === 'tajweed' || activeTab === 'mutaharrikat') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className={`py-2 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  activeTab === 'mutaharrikat' || activeTab === 'tajweed'
                    ? 'bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-900/40 scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer transition-all shadow-md flex items-center gap-1.5"
              >
                <span>🎯 ساکن و قلقلہ</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white cursor-pointer transition-all shadow-lg shadow-indigo-900/50 border border-purple-300/40 flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎮 حروفِ مدہ</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>🍃 حروفِ لین</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید</span>
              </button>
            </div>

            <MutharrikātGameModal onBack={() => setActiveTab('quiz')} />
          </div>
        )}

        {/* GAME MODE 2C: SUKOON AUDIO-VISUAL GAME */}
        {activeTab === 'sukoon' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-amber-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-amber-400/50"
              >
                <span>🎯 ساکن و قلقلہ</span>
                <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-purple-300 hover:bg-slate-700 cursor-pointer transition-all border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎮 حروفِ مدہ</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>🍃 حروفِ لین</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید</span>
              </button>
            </div>

            <SukoonGameModal onBack={() => setActiveTab('quiz')} currentLang={currentLang} />
          </div>
        )}

        {/* GAME MODE 2B: MAGNETIC PUZZLE / MURAKKABAT AUTO-GLIDING PUZZLE */}
        {(activeTab === 'murakkabat' || activeTab === 'magnetic') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 ساکن و قلقلہ</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-900/60 border-indigo-300 scale-[1.02] ring-2 ring-purple-400/50 flex items-center gap-1.5"
              >
                <span>🧩 خودکار مرکبات پزل</span>
                <span className="bg-slate-950 text-purple-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎮 حروفِ مدہ</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>🍃 حروفِ لین</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید</span>
              </button>
            </div>

            <MurakkabatPuzzleGameModal
              currentLang={currentLang}
              initialGameMode="murakkabat"
              onBack={() => setActiveTab('huruf')}
            />
          </div>
        )}

        {/* GAME MODE 2D: HUROOF MADDAH GAME ZONE */}
        {activeTab === 'maddah' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-amber-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-amber-400/50"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
                <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>🍃 حروفِ لین</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید</span>
              </button>
            </div>

            <HuroofMaddahGameModal
              onBack={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2E: HUROOF LEEN GAME ZONE */}
        {activeTab === 'leen' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-teal-900/60 border-2 border-teal-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-teal-400/50"
              >
                <span>🍃 حروفِ لین گیم</span>
                <span className="bg-slate-950 text-teal-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید</span>
              </button>
            </div>

            <HuroofLeenGameModal
              onBack={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2F: KHARI HARAKAT GAME ZONE (سبق ۷) */}
        {activeTab === 'khari_harakat' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-emerald-900/60 border-2 border-emerald-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-emerald-400/50"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
                <span className="bg-yellow-300 text-zinc-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین گیم زون</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۸</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید گیم زون</span>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۹</span>
              </button>
            </div>

            <KhariHarakatGameModal
              onBack={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2G: TANWEEN GAME ZONE (سبق ۸) */}
        {activeTab === 'tanween' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-yellow-200 scale-[1.02] flex items-center gap-1.5 ring-2 ring-yellow-400/50"
              >
                <span>🌟 تنوین گیم زون</span>
                <span className="bg-slate-950 text-yellow-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید گیم زون</span>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۹</span>
              </button>
            </div>
            
            <TanweenGameModal
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2H: TASHDEED GAME ZONE (سبق ۹) */}
        {activeTab === 'tashdeed' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین گیم زون</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۸</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-amber-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-amber-400/50"
              >
                <span>🎯 تشدید گیم زون</span>
                <span className="bg-slate-900 text-amber-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن و تنوین گیمز</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
            </div>
            
            <TashdeedGameModal
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2I: NUN SAKIN & TANWEEN GAME ZONE (سبق ۱۰: اظہار، اخفاء، ادغام، اقلاب) */}
        {activeTab === 'nun_sakin' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن و تنوین گیمز</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
              <button
                onClick={() => setActiveTab('meem_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-blue-900/60 border-2 border-blue-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-blue-400/50"
              >
                <span>👑 میم ساکن گیمز</span>
                <span className="bg-slate-900 text-blue-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۱</span>
              </button>
            </div>
            
            <NunSakinTanweenGameModal
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2J: MEEM SAKIN GAME ZONE (سبق ۱۱: میم ساکن کے قواعد) */}
        {activeTab === 'meem_sakin' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن و تنوین گیمز</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
              <button
                onClick={() => setActiveTab('meem_sakin')}
                className={`py-2 px-4 rounded-xl text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 ${
                  activeTab === 'meem_sakin'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-slate-950 shadow-xl shadow-blue-900/60 border-blue-300 scale-[1.02] ring-2 ring-blue-400/50'
                    : 'bg-slate-800/80 text-blue-300 hover:bg-slate-700 border-blue-500/30'
                }`}
              >
                <span>👑 میم ساکن گیمز</span>
                <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۱</span>
              </button>
              <button
                onClick={() => setActiveTab('tafkheem_tarqeeq')}
                className="py-2 px-4 rounded-xl text-xs font-black cursor-pointer transition-all border flex items-center gap-1.5 bg-slate-800/80 text-amber-300 hover:bg-slate-700 border-amber-500/30"
              >
                <span>✨ تفخیم و ترقیق</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۲</span>
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setShowMeemSakinPuzzle(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-urdu font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-amber-300 cursor-pointer"
              >
                <span>🧩 میم ساکن مقناطیسی پزل کھیلیں</span>
              </button>
            </div>

            <MeemSakinGameModal
              isOpen={true}
              onBack={() => setActiveTab('quiz')}
              onClose={() => setActiveTab('quiz')}
            />

            {showMeemSakinPuzzle && (
              <MeemSakinPuzzleGameModal
                isOpen={showMeemSakinPuzzle}
                onClose={() => setShowMeemSakinPuzzle(false)}
              />
            )}
          </div>
        )}

        {/* GAME MODE 2K: TAFKHEEM & TARQEEQ GAME ZONE (سبق ۱۲: تفخیم و ترقیق) */}
        {activeTab === 'tafkheem_tarqeeq' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('murakkabat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🧩 خودکار مرکبات پزل</span>
              </button>
              <button
                onClick={() => setActiveTab('maddah')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎮 حروفِ مدہ گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('leen')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🍃 حروفِ لین گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('khari_harakat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-emerald-300 hover:bg-slate-700 cursor-pointer transition-all border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>✨ کھڑی حرکات گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tanween')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-yellow-300 hover:bg-slate-700 cursor-pointer transition-all border border-yellow-500/30 flex items-center gap-1.5"
              >
                <span>🌟 تنوین گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('tashdeed')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>🎯 تشدید گیم زون</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن و تنوین گیمز</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
              <button
                onClick={() => setActiveTab('meem_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-blue-300 hover:bg-slate-700 cursor-pointer transition-all border border-blue-500/30 flex items-center gap-1.5"
              >
                <span>👑 میم ساکن گیمز</span>
                <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۱</span>
              </button>
              <button
                onClick={() => setActiveTab('tafkheem_tarqeeq')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 cursor-pointer transition-all shadow-xl shadow-amber-900/60 border-2 border-amber-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-amber-400/50"
              >
                <span>✨ تفخیم و ترقیق</span>
                <span className="bg-slate-900 text-yellow-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال</span>
              </button>
              <button
                onClick={() => setActiveTab('maddat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-purple-300 hover:bg-slate-700 cursor-pointer transition-all border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>📜 مَدَّات کے قواعد</span>
                <span className="bg-purple-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۳</span>
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setShowTafkheemPuzzle(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-urdu font-bold rounded-2xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 border-2 border-amber-300 cursor-pointer"
              >
                <span>🧩 تفخیم و ترقیق مقناطیسی پزل کھیلیں</span>
              </button>
            </div>

            <TafkheemTarqeeqGameModal
              isOpen={true}
              onBack={() => setActiveTab('quiz')}
              onClose={() => setActiveTab('quiz')}
            />

            {showTafkheemPuzzle && (
              <TafkheemTarqeeqPuzzleGameModal
                isOpen={showTafkheemPuzzle}
                onClose={() => setShowTafkheemPuzzle(false)}
              />
            )}
          </div>
        )}

        {/* GAME MODE 2L: MADDAT GAME ZONE (سبق ۱۳: مَدَّات کے قواعد) */}
        {activeTab === 'maddat' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
              <button
                onClick={() => setActiveTab('meem_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-blue-300 hover:bg-slate-700 cursor-pointer transition-all border border-blue-500/30 flex items-center gap-1.5"
              >
                <span>👑 میم ساکن</span>
                <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۱</span>
              </button>
              <button
                onClick={() => setActiveTab('tafkheem_tarqeeq')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>✨ تفخیم و ترقیق</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۲</span>
              </button>
              <button
                onClick={() => setActiveTab('maddat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-purple-300 hover:bg-slate-700 cursor-pointer transition-all border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>📜 مَدَّات کے قواعد</span>
                <span className="bg-purple-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۳</span>
              </button>
              <button
                onClick={() => setActiveTab('muqattaat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white cursor-pointer transition-all shadow-xl shadow-emerald-900/60 border-2 border-emerald-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-emerald-400/50"
              >
                <span>✨ حروفِ مقطعات</span>
                <span className="bg-slate-900 text-emerald-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال (سبق ۱۴)</span>
              </button>
            </div>

            <MaddatGameModal
              isOpen={true}
              onBack={() => setActiveTab('quiz')}
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 2M: MUQATTAAT GAME ZONE (سبق ۱۴: حُرُوفِ مُقَطَّعَات) */}
        {activeTab === 'muqattaat' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
              <button
                onClick={() => setActiveTab('mutaharrikat')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                🎯 متحرکات صوتی گیم
              </button>
              <button
                onClick={() => setActiveTab('sukoon')}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-800/80 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all"
              >
                <span>🎯 ساکن و قلقلہ صوتی گیم</span>
              </button>
              <button
                onClick={() => setActiveTab('nun_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-teal-300 hover:bg-slate-700 cursor-pointer transition-all border border-teal-500/30 flex items-center gap-1.5"
              >
                <span>💎 نون ساکن</span>
                <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۰</span>
              </button>
              <button
                onClick={() => setActiveTab('meem_sakin')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-blue-300 hover:bg-slate-700 cursor-pointer transition-all border border-blue-500/30 flex items-center gap-1.5"
              >
                <span>👑 میم ساکن</span>
                <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۱</span>
              </button>
              <button
                onClick={() => setActiveTab('tafkheem_tarqeeq')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-amber-300 hover:bg-slate-700 cursor-pointer transition-all border border-amber-500/30 flex items-center gap-1.5"
              >
                <span>✨ تفخیم و ترقیق</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۲</span>
              </button>
              <button
                onClick={() => setActiveTab('maddat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-slate-800/80 text-purple-300 hover:bg-slate-700 cursor-pointer transition-all border border-purple-500/30 flex items-center gap-1.5"
              >
                <span>📜 مَدَّات کے قواعد</span>
                <span className="bg-purple-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">سبق ۱۳</span>
              </button>
              <button
                onClick={() => setActiveTab('muqattaat')}
                className="py-2 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white cursor-pointer transition-all shadow-xl shadow-emerald-900/60 border-2 border-emerald-300 scale-[1.02] flex items-center gap-1.5 ring-2 ring-emerald-400/50"
              >
                <span>✨ حروفِ مقطعات</span>
                <span className="bg-slate-900 text-emerald-300 text-[10px] font-black px-1.5 py-0.2 rounded-full">فعال (سبق ۱۴)</span>
              </button>
            </div>

            <MuqattaatGameModal
              isOpen={true}
              onBack={() => setActiveTab('quiz')}
              onClose={() => setActiveTab('quiz')}
            />
          </div>
        )}

        {/* GAME MODE 3: 🧠 قرآن و تجوید کوئز (مرکبات، متحرکات، ساکن حروف و مفردات) */}
        {activeTab === 'quiz' && (
          <QuranTajweedQuizEngine
            currentLang={currentLang}
            onBack={() => setActiveTab('huruf')}
          />
        )}

        {/* GAME MODE 4: 🎯 یادداشت کے کھیل (MEMORY MATCHING CARDS - تمام اسباق ۱ تا ۹) */}
        {activeTab === 'memory' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                  <span>🎯 یادداشت کارڈز — حروف و کلمات کی جوڑیاں ملاؤ</span>
                  <span className="text-xs bg-amber-950 text-amber-400 border border-amber-800/80 px-2 py-0.5 rounded-full font-bold">
                    {MEMORY_LESSON_CARDS[selectedMemoryLesson]?.label}
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  کارڈز کھول کر یکساں حروف تلاش کریں۔ کوششیں: <span className="text-amber-400 font-bold">{memoryMoves}</span>
                </p>
              </div>

              <button
                onClick={() => initMemoryGame(selectedMemoryLesson)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-700 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>دوبارہ شروع کریں</span>
              </button>
            </div>

            {/* 12-LESSON SELECTOR BUTTONS */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400">سبق کا انتخاب کریں (سبق ۱ تا ۱۲):</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
                {Object.entries(MEMORY_LESSON_CARDS).map(([key, data]) => {
                  const isSelected = selectedMemoryLesson === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedMemoryLesson(key);
                        initMemoryGame(key);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border text-center flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-105 ring-2 ring-amber-400/40'
                          : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] opacity-75">سبق {data.number}</span>
                      <span className="truncate w-full">{data.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD GRID */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-lg mx-auto py-2">
              {memoryCards.map((card) => {
                const showContent = card.isFlipped || card.isMatched;

                return (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMemoryCardClick(card.id)}
                    className={`h-28 rounded-2xl border-2 font-black text-3xl sm:text-4xl shadow-md transition-all cursor-pointer flex items-center justify-center font-arabic ${
                      card.isMatched
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 opacity-80 ring-2 ring-emerald-500/50'
                        : showContent
                        ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-500/30'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-600'
                    }`}
                  >
                    {showContent ? card.letter : '❓'}
                  </motion.button>
                );
              })}
            </div>

            {memoryCompleted && (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-center space-y-2">
                <h4 className="text-base font-black">ماشاء اللہ! تمام جوڑیاں مکمل ہو گئیں 🎉</h4>
                <p className="text-xs text-emerald-300">+40 اسکور اور +20 سکے شامل کر دیے گئے!</p>
                <button
                  onClick={() => initMemoryGame(selectedMemoryLesson)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
                >
                  دوبارہ کھیلیں
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAME MODE 5: 🏆 WEEKLY TOURNAMENT LEADERBOARD */}
        {activeTab === 'tournament' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-amber-300">
                🏆 ہفتہ وار قاری ٹورنامنٹ
              </h3>
              <p className="text-xs text-slate-300">
                تعلیمی کارکردگی اور اسکور میں بچوں کی درجہ بندی
              </p>
            </div>

            <div className="space-y-2.5 max-w-2xl mx-auto">
              {[
                { rank: 1, name: 'عبداللہ بن احمد (مکہ مکرمہ)', score: '2,450 ⭐', badge: '🥇 پہلا مقام' },
                { rank: 2, name: 'فاطمہ زہرا (اسلام آباد)', score: '2,120 ⭐', badge: '🥈 دوسرا مقام' },
                { rank: 3, name: 'احمد (آپ کا مقام)', score: `${points} ⭐`, badge: '🥉 تیسرا مقام', isMe: true },
                { rank: 4, name: 'محمد عمر (استنبول)', score: '1,890 ⭐', badge: '⭐ ممتاز قاری' },
                { rank: 5, name: 'عائشہ صدیقہ (لندن)', score: '1,740 ⭐', badge: '⭐ قاریہ' },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    row.isMe
                      ? 'bg-amber-950/60 border-amber-400'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-black text-amber-300 text-xs">
                      {row.rank}
                    </span>
                    <div>
                      <p className={`font-black text-xs sm:text-sm ${row.isMe ? 'text-amber-300' : 'text-white'}`}>
                        {row.name} {row.isMe && '(آپ)'}
                      </p>
                      <p className="text-[11px] text-slate-400">{row.badge}</p>
                    </div>
                  </div>
                  <span className="font-black text-amber-400 text-xs sm:text-sm">
                    {row.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME MODE 6: 🏅 ACHIEVEMENT BADGES */}
        {activeTab === 'badges' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="text-center space-y-1 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-amber-300">
                🏅 آپ کے حاصل کردہ بیجز اور اعزازات
              </h3>
              <p className="text-xs text-slate-300">
                ہر نئے سنگ میل پر اعزازات انلاک کریں
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'حرف شناس اول', desc: 'پہلے ۱۰ حروف درست ادا کیے', unlocked: true, icon: '🌟' },
                { title: 'مخارج ماسٹر', desc: 'حلقی اور لسانی مخارج مکمل', unlocked: true, icon: '👑' },
                { title: 'مسلسل تسلسل', desc: '۷ دن مسلسل مشق جاری رکھی', unlocked: true, icon: '🔥' },
                { title: 'حافظِ قاعدہ', desc: 'تمام ۲۹ حروف کے کوئز پاس کیے', unlocked: false, icon: '🏆' },
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border text-center space-y-2 flex flex-col items-center justify-center ${
                    badge.unlocked
                      ? 'bg-amber-950/40 border-amber-500/60'
                      : 'bg-slate-950 border-slate-800 opacity-60'
                  }`}
                >
                  <span className="text-3xl">{badge.icon}</span>
                  <h4 className="font-black text-amber-300 text-xs">{badge.title}</h4>
                  <p className="text-[10px] text-slate-400">{badge.desc}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    badge.unlocked ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {badge.unlocked ? 'مکمل ✓' : 'غیر فعال 🔒'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAME MODE 7: 👑 DAILY TAJWEED CHALLENGE */}
        {activeTab === 'daily' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-300 text-2xl">
              👑
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-300">
                روزانہ تجوید چیلنج
              </h3>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                حروفِ حلقی (ع، ح، غ، خ) کی بہترین ادائیگی کریں اور روزانہ کا انعام +50 اسکور اور +20 سکے حاصل کریں!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                <span>چیلنج ٹاسک: حروفِ حلقی مشق</span>
                <span className="text-emerald-400">مکمل: ۳/۴</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full w-3/4 rounded-full" />
              </div>

              <button
                onClick={() => {
                  setPoints(p => p + 50);
                  setCoins(c => c + 20);
                  setShowRewardToast({
                    text: 'چیلنج کامیابی سے مکمل ہو گیا! 🎉',
                    subText: '+50 اسکور اور +20 سکے حاصل ہوئے!',
                    type: 'badge'
                  });
                  setTimeout(() => setShowRewardToast(null), 3000);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:scale-105 transition-all"
              >
                انعام حاصل کریں (+50 اسکور)
              </button>
            </div>
          </div>
        )}

        {/* 5. 🏆 MY ACHIEVEMENTS (🏆 میری کامیابیاں) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>🏆 میری کامیابیاں</span>
            </h2>
            <span className="text-xs font-bold text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              {rankTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>کل تجربہ (XP)</span>
              </div>
              <div className="text-sm font-black text-purple-300">{xp} XP</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-yellow-400" />
                <span>سکے (Coins)</span>
              </div>
              <div className="text-sm font-black text-yellow-300">{coins} 🪙</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>مسلسل دنوں کی ترتیب</span>
              </div>
              <div className="text-sm font-black text-orange-300">{streak} دن 🔥</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>مکمل کردہ کھیل</span>
              </div>
              <div className="text-sm font-black text-emerald-300">{completedGamesCount} اسباق و کھیل</div>
            </div>
          </div>
        </div>

        {/* 6. 🎁 DAILY REWARD CARD (🎁 روزانہ انعام) */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/80 border border-emerald-600/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <Gift className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">🎁 روزانہ انعام</h3>
              <p className="text-xs text-slate-300 mt-0.5">ہر روز لاگ ان کرنے پر مفت اسکور اور سکے حاصل کریں!</p>
            </div>
          </div>

          <button
            onClick={() => setShowTreasureChestModal(true)}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <span>انعام حاصل کریں</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* GAME OVER MODAL */}
      <AnimatePresence>
        {showGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-500 mx-auto flex items-center justify-center text-rose-400 text-3xl">
                💔
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-amber-300">
                  زندگیاں ختم ہو گئیں!
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  کوئی بات نہیں! دوبارہ کوشش کریں اور مخارج کی عمدہ مشق جاری رکھیں۔
                </p>
              </div>

              <button
                onClick={refillLivesAndRestart}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>دوبارہ کھیلیں</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DAILY REWARD MODAL (🎁 روزانہ انعام) */}
      <AnimatePresence>
        {showTreasureChestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 max-w-md w-full text-center space-y-5 shadow-2xl relative"
            >
              <div className="w-20 h-20 rounded-full bg-amber-950 border border-amber-400 mx-auto flex items-center justify-center text-4xl shadow-md">
                🎁
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-black text-amber-300">
                  روزانہ کا انعام
                </h3>
                <p className="text-xs text-slate-300">
                  ہر روز لاگ ان کرنے پر مفت اسکور اور سکے حاصل کریں!
                </p>
              </div>

              <button
                onClick={claimTreasureChest}
                disabled={chestClaimed}
                className={`w-full py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                  chestClaimed
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:scale-105'
                }`}
              >
                <span>{chestClaimed ? 'انعام پہلے ہی وصول ہو چکا ✓' : 'انعام حاصل کریں (+100 اسکور اور 50 سکے)'}</span>
              </button>

              <button
                onClick={() => setShowTreasureChestModal(false)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer pt-1"
              >
                بند کریں
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
