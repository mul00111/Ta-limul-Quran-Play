import React, { useState } from 'react';
import { 
  Volume2, VolumeX, ArrowRight, Sparkles, CheckCircle2, Play, Pause, 
  HelpCircle, Award, BookOpen, Flame, Music, Gamepad2, Info
} from 'lucide-react';
import { TASHDEED_RULES, TASHDEED_ITEMS, TashdeedItem } from '../data/tashdeedData';
import { playQariText, stopAllQariAudio, playWordWithHijjaAndPronunciation } from '../utils/qariAudioService';
import { TashdeedGameModal } from './TashdeedGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';

interface TashdeedLessonModalProps {
  onBack: () => void;
}

const ARABIC_LETTER_NAMES: Record<string, string> = {
  'أ': 'ہَمْزَہ', 'إ': 'ہَمْزَہ', 'ا': 'ہَمْزَہ', 'ب': 'بَا', 'ت': 'تَا', 'ث': 'ثَا',
  'ج': 'جِیْم', 'ح': 'حَا', 'خ': 'خَا', 'د': 'دَال', 'ذ': 'ذَال', 'ر': 'رَا',
  'ز': 'زَا', 'س': 'سِیْن', 'ش': 'شِیْن', 'ص': 'صَاد', 'ض': 'ضَاد', 'ط': 'طَا',
  'ظ': 'ظَا', 'ع': 'عَیْن', 'غ': 'غَیْن', 'ف': 'فَا', 'ق': 'قَاف', 'ك': 'كَاف',
  'ک': 'كَاف', 'ل': 'لَام', 'م': 'مِیْم', 'ن': 'نُون', 'و': 'وَاؤ', 'ه': 'ہَا',
  'ہ': 'ہَا', 'ي': 'یَا', 'ی': 'یَا', 'ء': 'ہَمْزَہ'
};

const ARABIC_HARAKAH_NAMES: Record<string, string> = {
  '\u064E': 'زَبَر', // Fatha
  '\u0650': 'زَیْر', // Kasrah
  '\u064F': 'پَیْش'  // Dammah
};

export const getTashdeedSpelling = (item: TashdeedItem): string => {
  const text = item.arabic;
  
  const customSpellings: Record<string, string> = {
    'عَلَّمَ': 'عَیْن زَبَر لَام عَلْ ، لَام زَبَر لَا لَّ ، مِیْم زَبَر مَ = عَلَّمَ',
    'نَزَّلَ': 'نُون زَبَر زَا نَزْ ، زَا زَبَر زَا زَّ ، لَام زَبَر لَ = نَزَّلَ',
    'صَدَّقَ': 'صَاد زَبَر دَال صَدْ ، دَال زَبَر دَا دَّ ، قَاف زَبَر قَ = صَدَّقَ',
    'ثُمَّ': 'ثَا پَیْش مِیْم ثُمْ ، مِیْم زَبَر مَ = ثُمَّ',
    'عَمَّ': 'عَیْن زَبَر مِیْم عَمْ ، مِیْم زَبَر مَ = عَمَّ',
    'إِنَّ': 'ہَمْزَہ زَیْر نُون اِنْ ، نُون زَبَر نَ = إِنَّ',
    'أَنَّ': 'ہَمْزَہ زَبَر نُون اَنْ ، نُون زَبَر نَ = أَنَّ',
    'رَبَّ': 'رَا زَبَر بَا رَبْ ، بَا زَبَر بَا رَبَّ',
    'حَقَّ': 'حَا زَبَر قَاف حَقْ ، قَاف زَبَر قَا حَقَّ',
    'يَدُعُّ': 'یَا زَبَر یَ ، دَال پَیْش عَیْن دُعْ ، عَیْن پَیْش عُ = يَدُعُّ',
    'مُحَمَّدٌ': 'مِیْم پَیْش مُ ، حَا زَبَر مِیْم حَمْ ، مِیْم زَبَر مَ ، دَال دُو پَیْش دُنْ = مُحَمَّدٌ'
  };

  if (customSpellings[text]) {
    return customSpellings[text];
  }

  const chars = Array.from(text);
  const letters = chars.filter(c => ARABIC_LETTER_NAMES[c] !== undefined);
  const harakat = chars.filter(c => ARABIC_HARAKAH_NAMES[c] !== undefined);

  if (letters.length >= 2 && harakat.length >= 2) {
    const l1 = letters[0];
    const h1 = harakat[0];
    const l2 = letters[1];
    const h2 = harakat[1];

    const l1Name = ARABIC_LETTER_NAMES[l1];
    const h1Name = ARABIC_HARAKAH_NAMES[h1];
    const l2Name = ARABIC_LETTER_NAMES[l2];
    const h2Name = ARABIC_HARAKAH_NAMES[h2];

    const firstSyllableSound = `${l1}${h1}${l2}ْ`;
    return `${l1Name} ${h1Name} ${l2Name} ${firstSyllableSound} ، ${l2Name} ${h2Name} ${text}`;
  }

  return text;
};

export const TashdeedLessonModal: React.FC<TashdeedLessonModalProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'basic' | 'ghunnah' | 'shaddah_rules' | 'words' | 'exam'>('rules');
  const [activeItem, setActiveItem] = useState<TashdeedItem | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<number | null>(null);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState(false);

  const speakItem = (item: TashdeedItem) => {
    if (isMuted) return;
    setActiveItem(item);
    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(getTashdeedSpelling(item), item.arabic);
    } else {
      playQariText(item.arabic);
    }
  };

  const getFilteredItems = () => {
    if (activeTab === 'rules') return [];
    return TASHDEED_ITEMS.filter(item => item.category === activeTab);
  };

  const playTabSequence = async () => {
    const items = getFilteredItems();
    if (!items.length) return;

    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveItem(null);
      return;
    }

    setIsPlayingSequence(true);
    for (let i = 0; i < items.length; i++) {
      if (isMuted) break;
      const item = items[i];
      setActiveItem(item);
      if (pronunciationMode === 'hijja') {
        await playWordWithHijjaAndPronunciation(getTashdeedSpelling(item), item.arabic);
      } else {
        await playQariText(item.arabic);
      }
      await new Promise(r => setTimeout(r, 400));
    }

    setIsPlayingSequence(false);
    setActiveItem(null);
  };

  const currentItems = getFilteredItems();

  if (showGameModal) {
    return (
      <TashdeedGameModal onClose={() => setShowGameModal(false)} />
    );
  }

  if (showPuzzleModal) {
    return (
      <MurakkabatPuzzleGameModal onBack={() => setShowPuzzleModal(false)} initialGameMode="tashdeed" />
    );
  }

  return (
    <div className="bg-[#fcfaf5] border-4 border-emerald-600/80 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 font-urdu" dir="rtl">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/50 shadow-xl text-white">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-amber-300 transition-all flex items-center gap-1.5 text-xs font-black border border-amber-500/30 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-zinc-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow">
                سبق نمبر ۹
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-amber-300">
                تَشْدِیْد (Sabaq 9)
              </h2>
            </div>
            <p className="text-xs text-emerald-200 mt-1">دو مرتبہ پڑھے جانے والے مشدد حروف اور غنہ کی جامع تجویدی مشق</p>
          </div>
        </div>

        {/* Audio & Game Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setShowGameModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 text-xs sm:text-sm font-black shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-yellow-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>صوتی و بصری گیم 🎯</span>
          </button>

          <button
            onClick={() => setShowPuzzleModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg border border-emerald-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>مقناطیسی پزل 🧩</span>
          </button>

          {/* Hijja vs Rawani Switch */}
          <div className="bg-black/40 p-1 rounded-xl border border-emerald-500/30 flex items-center gap-1 text-xs">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              روانی (Word)
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-400 text-zinc-950 shadow'
                  : 'text-amber-200/80 hover:text-white'
              }`}
            >
              ہجے (Spelling)
            </button>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted ? 'bg-rose-900/80 text-rose-300 border-rose-600' : 'bg-white/10 text-amber-300 border-white/20 hover:bg-white/20'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {activeTab !== 'rules' && (
            <button
              onClick={playTabSequence}
              className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all ${
                isPlayingSequence 
                  ? 'bg-rose-600 text-white border border-rose-400 animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlayingSequence ? 'روکیں' : 'مکمل سبق سنیں'}</span>
            </button>
          )}

        </div>

      </div>

      {/* Primary Section Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-950/10 p-2 rounded-2xl border border-emerald-600/30">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Rules */}
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-amber-950 hover:bg-amber-50 border border-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>قواعد و تجوید</span>
          </button>
          
          {/* Tab 2: Basic */}
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'basic'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>بنیادی تختی</span>
          </button>

          {/* Tab 3: Ghunnah */}
          <button
            onClick={() => setActiveTab('ghunnah')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'ghunnah'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>غنہ (نّ / مّ)</span>
          </button>

          {/* Tab 4: Shaddah Rules */}
          <button
            onClick={() => setActiveTab('shaddah_rules')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'shaddah_rules'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>تشدید میں جماؤ</span>
          </button>

          {/* Tab 5: Words */}
          <button
            onClick={() => setActiveTab('words')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'words'
                ? 'bg-emerald-700 text-white shadow-md border border-emerald-500 ring-2 ring-emerald-400/40'
                : 'bg-white text-zinc-700 hover:bg-emerald-50 border border-zinc-300'
            }`}
          >
            <Music className="w-4 h-4 text-amber-400" />
            <span>مشق کلمات</span>
          </button>

          {/* Tab 6: Exam */}
          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              activeTab === 'exam'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400 ring-2 ring-amber-400/40'
                : 'bg-white text-zinc-700 hover:bg-amber-50 border border-zinc-300'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>امتحان</span>
          </button>
        </div>
      </div>

      {/* TAB 1: RULES & TAJWEED EXPLANATION */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-amber-100/90 border-2 border-amber-500/60 rounded-2xl p-5 text-zinc-900 leading-loose text-right shadow-inner space-y-4">
            <h3 className="text-lg font-black text-emerald-950 border-b border-amber-300 pb-2 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-800" />
              <span>تَشْدِیْد کے اہم قواعد و قوانین:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TASHDEED_RULES.map((rule) => (
                <div 
                  key={rule.id}
                  onClick={() => setSelectedRule(selectedRule === rule.id ? null : rule.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRule === rule.id
                      ? 'bg-emerald-900 text-white border-emerald-400 shadow-xl'
                      : 'bg-white text-zinc-900 border-amber-300 hover:border-emerald-500 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-base text-amber-600 mb-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>قاعدہ {rule.id}: {rule.title}</span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">
                    {rule.urdu}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual Example Card */}
            <div className="bg-emerald-950 text-white p-4 rounded-xl border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-amber-300 font-bold">مثال مع تجزیہ:</span>
                <p className="text-sm font-medium">
                  <strong>إِنَّ</strong> = <span className="text-amber-300 font-bold">إِنْ (ساکن)</span> + <span className="text-teal-300 font-bold">نَ (متحرک)</span> (نون مشدد پر ۱ الف کے برابر غنہ کیا جائے گا)
                </p>
              </div>
              <button
                onClick={() => speakItem({ id: 0, arabic: 'إِنَّ', transliteration: 'In-na', category: 'basic', categoryLabelUrdu: '' })}
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-black text-xs flex items-center gap-2 cursor-pointer hover:bg-amber-400 shadow"
              >
                <Volume2 className="w-4 h-4" />
                <span>"إِنَّ" کی آواز سنیں</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ITEMS GRID DISPLAY FOR OTHER TABS */}
      {activeTab !== 'rules' && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between bg-amber-100/90 border border-amber-300 px-4 py-2 rounded-xl text-xs sm:text-sm text-emerald-950 font-bold">
            <span>کل کلمات: {currentItems.length}</span>
            <span className="text-amber-800">
              {pronunciationMode === 'hijja' ? 'ہجے (Spelling) موڈ فعال ہے: حرف پر کلک کر کے مکمل ہجے سنیں' : 'روانی (Word) موڈ فعال ہے: کلک کر کے تلفظ سنیں'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentItems.map((item) => {
              const isActive = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => speakItem(item)}
                  className={`relative group p-4 rounded-2xl border-2 transition-all cursor-pointer text-center shadow-md flex flex-col items-center justify-center min-h-[110px] ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-500 to-yellow-500 text-zinc-950 border-amber-300 scale-105 shadow-2xl ring-4 ring-amber-300'
                      : 'bg-white hover:bg-amber-50/80 border-amber-300/80 hover:border-emerald-500 hover:shadow-xl'
                  }`}
                >
                  {/* Badges for Ghunnah */}
                  {item.isGhunnah && (
                    <span className="absolute top-1 right-1 text-[10px] bg-emerald-700 text-white px-1.5 py-0.5 rounded-md font-bold">
                      غنہ
                    </span>
                  )}

                  {/* Main Arabic Text */}
                  <div className={`text-2xl sm:text-3xl font-black ${isActive ? 'text-zinc-950' : 'text-emerald-950 group-hover:text-amber-700'}`}>
                    {item.arabic}
                  </div>

                  {/* Transliteration */}
                  <div className={`text-[11px] font-bold mt-1 ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {item.transliteration}
                  </div>

                  {/* Play Icon */}
                  <Volume2 className={`w-3.5 h-3.5 mt-1.5 opacity-60 group-hover:opacity-100 ${isActive ? 'text-zinc-950 animate-bounce' : 'text-emerald-700'}`} />
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
