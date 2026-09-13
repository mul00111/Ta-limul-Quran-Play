import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  HelpCircle,
  Award,
  BookOpen,
  Flame,
  Gamepad2,
  Info,
  Puzzle,
  Eye,
  Zap,
} from 'lucide-react';
import {
  NUN_SAKIN_ALL_WORDS,
  NUN_SAKIN_RULES_SUMMARY,
  NunSakinWordItem,
  NunSakinRuleCategory,
} from '../data/nunSakinTanweenData';
import { playQariText, playWordWithHijjaAndPronunciation, stopAllQariAudio } from '../utils/qariAudioService';
import { NunSakinTanweenGameModal } from './NunSakinTanweenGameModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';

interface NunSakinTanweenLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
}

export const NunSakinTanweenLessonModal: React.FC<NunSakinTanweenLessonModalProps> = ({
  onBack,
  onOpenGamesHub,
}) => {
  const [activeTab, setActiveTab] = useState<
    'all' | 'izhar' | 'ikhfa' | 'idgham' | 'iqlab' | 'rules' | 'exam'
  >('all');
  const [activeItem, setActiveItem] = useState<NunSakinWordItem | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [isMuted, setIsMuted] = useState(false);

  const speakItem = (item: NunSakinWordItem) => {
    if (isMuted) return;
    setActiveItem(item);
    if (pronunciationMode === 'hijja') {
      playWordWithHijjaAndPronunciation(item.spellingHijja, item.arabic);
    } else {
      playQariText(item.arabic);
    }
  };

  const getFilteredItems = () => {
    if (activeTab === 'all') return NUN_SAKIN_ALL_WORDS;
    if (activeTab === 'izhar') return NUN_SAKIN_ALL_WORDS.filter((i) => i.ruleCategory === 'izhar');
    if (activeTab === 'ikhfa') return NUN_SAKIN_ALL_WORDS.filter((i) => i.ruleCategory === 'ikhfa');
    if (activeTab === 'idgham')
      return NUN_SAKIN_ALL_WORDS.filter(
        (i) => i.ruleCategory === 'idgham_ghunnah' || i.ruleCategory === 'idgham_bila_ghunnah'
      );
    if (activeTab === 'iqlab') return NUN_SAKIN_ALL_WORDS.filter((i) => i.ruleCategory === 'iqlab');
    if (activeTab === 'exam') return NUN_SAKIN_ALL_WORDS.slice(0, 24);
    return [];
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
        await playWordWithHijjaAndPronunciation(item.spellingHijja, item.arabic);
      } else {
        await playQariText(item.arabic);
      }
      await new Promise((r) => setTimeout(r, 450));
    }

    setIsPlayingSequence(false);
    setActiveItem(null);
  };

  const currentItems = getFilteredItems();

  const getCardThemeClasses = (category: NunSakinRuleCategory) => {
    switch (category) {
      case 'izhar':
        return {
          cardBg: 'bg-emerald-50/90 border-emerald-500/70 hover:border-emerald-600',
          textColor: 'text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white',
          highlightText: 'text-emerald-700',
        };
      case 'ikhfa':
        return {
          cardBg: 'bg-rose-50/90 border-rose-500/70 hover:border-rose-600',
          textColor: 'text-rose-950',
          badgeBg: 'bg-rose-600 text-white',
          highlightText: 'text-rose-700',
        };
      case 'idgham_ghunnah':
        return {
          cardBg: 'bg-cyan-50/90 border-cyan-500/70 hover:border-cyan-600',
          textColor: 'text-cyan-950',
          badgeBg: 'bg-cyan-600 text-white',
          highlightText: 'text-cyan-700',
        };
      case 'idgham_bila_ghunnah':
        return {
          cardBg: 'bg-blue-50/90 border-blue-500/70 hover:border-blue-600',
          textColor: 'text-blue-950',
          badgeBg: 'bg-blue-600 text-white',
          highlightText: 'text-blue-700',
        };
      case 'iqlab':
        return {
          cardBg: 'bg-amber-50/90 border-amber-500/70 hover:border-amber-600',
          textColor: 'text-amber-950',
          badgeBg: 'bg-amber-600 text-slate-950',
          highlightText: 'text-amber-700',
        };
    }
  };

  return (
    <div className="bg-[#fcfaf5] border-4 border-amber-600/80 rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6 text-slate-900 font-urdu" dir="rtl">
      
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopAllQariAudio();
              onBack();
            }}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>

          <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white font-black text-sm sm:text-base shadow-lg border-2 border-emerald-400">
            سبق نمبر (۱۰) : قواعدِ نون ساکن و تنوین (اظہار، اخفاء، ادغام، اقلاب)
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Game Zone */}
          <button
            onClick={() => setShowGameModal(true)}
            id="nun-sakin-game-zone-btn"
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-emerald-400 active:scale-95 hover:scale-105"
            title="صوتی و بصری گیم زون"
          >
            <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>صوتی و بصری گیمز 🎯</span>
          </button>

          {/* Magnetic Word Puzzle */}
          <button
            onClick={() => setShowPuzzleModal(true)}
            id="nun-sakin-puzzle-btn"
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border-2 border-amber-300 active:scale-95 hover:scale-105"
            title="حروف جوڑ مقناطیسی پزل گیم"
          >
            <Puzzle className="w-4 h-4 text-zinc-950" />
            <span>مقناطیسی پزل 🧩</span>
          </button>

          {/* Hijja vs Rawani Toggle */}
          <div className="bg-zinc-800 p-1 rounded-xl flex items-center border border-zinc-700 shadow-sm">
            <button
              onClick={() => setPronunciationMode('rawani')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                pronunciationMode === 'rawani'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              روانی
            </button>
            <button
              onClick={() => setPronunciationMode('hijja')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                pronunciationMode === 'hijja'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              ہجے
            </button>
          </div>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-200 hover:bg-zinc-700 cursor-pointer shadow border border-zinc-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. Color-coded 4-Rule Overview Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Izhar */}
        <div
          onClick={() => setActiveTab('izhar')}
          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'izhar'
              ? 'bg-emerald-100 border-emerald-600 ring-2 ring-emerald-500/40 shadow-md scale-102'
              : 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-900">۱. اِظْہَارْ</span>
            <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
              ۶ حروفِ حلقی
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 font-arabic font-bold mt-1">
            ء ، ہ ، ع ، ح ، غ ، خ
          </p>
          <span className="text-[10px] text-emerald-700 mt-1">غنہ کے بغیر صاف پڑھیں</span>
        </div>

        {/* Ikhfa */}
        <div
          onClick={() => setActiveTab('ikhfa')}
          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'ikhfa'
              ? 'bg-rose-100 border-rose-600 ring-2 ring-rose-500/40 shadow-md scale-102'
              : 'bg-rose-50/70 border-rose-300 hover:border-rose-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-rose-900">۲. اِخْفَاءْ</span>
            <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
              ۱۵ حروف
            </span>
          </div>
          <p className="text-[11px] text-rose-800 font-arabic font-bold mt-1 truncate">
            ت، ث، ج، د، ذ، ز، س، ش...
          </p>
          <span className="text-[10px] text-rose-700 mt-1">۱ الف غنہ کے ساتھ چھپائیں</span>
        </div>

        {/* Idgham */}
        <div
          onClick={() => setActiveTab('idgham')}
          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'idgham'
              ? 'bg-cyan-100 border-cyan-600 ring-2 ring-cyan-500/40 shadow-md scale-102'
              : 'bg-cyan-50/70 border-cyan-300 hover:border-cyan-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-cyan-900">۳. اِدْغَامْ</span>
            <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full font-bold">
              ۶ حروفِ یرملون
            </span>
          </div>
          <p className="text-[11px] text-cyan-800 font-arabic font-bold mt-1">
            ی ، ر ، م ، ل ، و ، ن
          </p>
          <span className="text-[10px] text-cyan-700 mt-1">با غنہ (۴) و بلا غنہ (۲)</span>
        </div>

        {/* Iqlab */}
        <div
          onClick={() => setActiveTab('iqlab')}
          className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
            activeTab === 'iqlab'
              ? 'bg-amber-100 border-amber-600 ring-2 ring-amber-500/40 shadow-md scale-102'
              : 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-900">۴. اِقْلَابْ</span>
            <span className="text-[10px] bg-amber-600 text-slate-950 px-2 py-0.5 rounded-full font-bold">
              ۱ حرف (ب)
            </span>
          </div>
          <p className="text-[11px] text-amber-800 font-arabic font-bold mt-1">
            حرف "ب" (میم ۢ سے بدلنا)
          </p>
          <span className="text-[10px] text-amber-700 mt-1">میم سے بدل کر ۱ الف غنہ</span>
        </div>
      </div>

      {/* 3. Sub-Tab Navigator & Auto-Play Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-100/80 p-2.5 rounded-2xl border border-amber-300">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-amber-300 shadow'
                : 'bg-amber-200/80 text-zinc-800 hover:bg-amber-300'
            }`}
          >
            🌟 سبھی کلمات ({NUN_SAKIN_ALL_WORDS.length})
          </button>

          <button
            onClick={() => setActiveTab('izhar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'izhar'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
            }`}
          >
            🟢 ۱. اِظْہَارْ
          </button>

          <button
            onClick={() => setActiveTab('ikhfa')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'ikhfa'
                ? 'bg-rose-700 text-white shadow'
                : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
            }`}
          >
            🔴 ۲. اِخْفَاءْ
          </button>

          <button
            onClick={() => setActiveTab('idgham')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'idgham'
                ? 'bg-cyan-700 text-white shadow'
                : 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200'
            }`}
          >
            🔵 ۳. اِدْغَامْ
          </button>

          <button
            onClick={() => setActiveTab('iqlab')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'iqlab'
                ? 'bg-amber-600 text-slate-950 shadow'
                : 'bg-amber-200 text-amber-950 hover:bg-amber-300'
            }`}
          >
            🟡 ۴. اِقْلَابْ
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-indigo-700 text-white shadow'
                : 'bg-indigo-100 text-indigo-900 hover:bg-indigo-200'
            }`}
          >
            📜 تفصیلی قواعد
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-purple-700 text-white shadow'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200'
            }`}
          >
            📝 امتحانی مشق
          </button>
        </div>

        {/* Auto Play Sequence Button */}
        {activeTab !== 'rules' && (
          <button
            onClick={playTabSequence}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow ${
              isPlayingSequence
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
          >
            {isPlayingSequence ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingSequence ? 'تلاوت روکیں' : 'مسلسل سنیں ▶'}</span>
          </button>
        )}
      </div>

      {/* 4. MAIN CONTENT AREA */}

      {/* A. RULES TAB */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border-2 border-amber-400/80 rounded-2xl p-4 text-xs sm:text-sm text-zinc-900 leading-loose">
            <h4 className="font-black text-amber-900 text-base mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>نون ساکن اور تنوین کے بنیادی احکام و تجویدی قواعد</span>
            </h4>
            <p>
              جس نون پر جزم (سکون) ہو اسے <strong>نون ساکن</strong> کہتے ہیں (جیسے <strong>مِنْ</strong>)،
              اور دو زبر (ً)، دو زیر (ٍ)، دو پیش (ٌ) کو <strong>تنوین</strong> کہتے ہیں (جیسے <strong>عَلِيْمٌ</strong>)۔
              نون ساکن اور تنوین کی آواز اصل میں نون ساکن کی طرح ہوتی ہے۔ نون ساکن اور تنوین کے کل <strong>چار قواعد</strong> ہیں:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NUN_SAKIN_RULES_SUMMARY.map((rule) => (
              <div
                key={rule.id}
                className="bg-white border-2 border-zinc-200 hover:border-amber-500 rounded-2xl p-5 shadow-md space-y-3 transition-all"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-black text-zinc-900 text-sm sm:text-base">
                    {rule.title}
                  </h4>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${rule.badgeBg}`}>
                    {rule.lettersCount} حروف
                  </span>
                </div>

                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                  {rule.lettersJoined}
                </div>

                <p className="text-xs text-zinc-700 leading-relaxed">
                  {rule.definitionUrdu}
                </p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-100">
                  <span className="font-bold text-zinc-600">حکمِ غنہ:</span>
                  <span className="font-black text-emerald-800">{rule.ghunnahStatusUrdu}</span>
                </div>

                <div className="bg-amber-50/80 p-2 rounded-lg text-[11px] text-amber-950 font-mono">
                  مثال و ہجے: {rule.spellingMethodUrdu}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* B. WORD GRID DISPLAY (ALL / IZHAR / IKHFA / IDGHAM / IQLAB / EXAM) */}
      {activeTab !== 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700 px-1">
            <span>کلمات کی تعداد: <strong className="text-amber-800">{currentItems.length}</strong></span>
            <span>کسی بھی خانے پر کلک کر کے آواز سنیں (ہجے یا روانی)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {currentItems.map((item) => {
              const theme = getCardThemeClasses(item.ruleCategory);
              const isActive = activeItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => speakItem(item)}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between gap-2 shadow-sm ${
                    theme.cardBg
                  } ${
                    isActive
                      ? 'ring-4 ring-amber-500 scale-105 shadow-xl bg-amber-100 border-amber-600'
                      : 'hover:scale-[1.02]'
                  }`}
                >
                  {/* Category Pill Tag */}
                  <div className="w-full flex items-center justify-between gap-1 text-[10px]">
                    <span className={`px-1.5 py-0.5 rounded-full font-bold ${theme.badgeBg}`}>
                      {item.targetLetter}
                    </span>
                    <span className="text-zinc-600 font-bold truncate max-w-[80px]">
                      {item.sourceTypeLabelUrdu}
                    </span>
                  </div>

                  {/* Arabic Word Display */}
                  <div className="my-1.5 text-center">
                    <span className={`text-2xl sm:text-3xl font-black font-arabic ${theme.textColor}`}>
                      {item.arabic}
                    </span>
                  </div>

                  {/* Transliteration and Rule Note */}
                  <div className="w-full text-center border-t border-zinc-200/80 pt-1.5">
                    <p className="text-[11px] font-bold text-zinc-700 truncate">
                      {item.transliteration}
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate mt-0.5">
                      {item.ruleCategoryLabelUrdu}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Word Detail Drawer if item selected */}
      {activeItem && (
        <div className="bg-gradient-to-r from-zinc-900 via-slate-900 to-zinc-900 border-2 border-amber-500 rounded-2xl p-4 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 text-zinc-950 rounded-2xl font-black text-2xl font-arabic">
              {activeItem.arabic}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-amber-300 text-sm sm:text-base">
                  {activeItem.ruleCategoryLabelUrdu}
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
                  سبب: {activeItem.targetLetter}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {activeItem.ruleExplanationUrdu}
              </p>
              <p className="text-[11px] text-amber-400/90 font-mono mt-1">
                💡 ہجے: {activeItem.spellingHijja}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => speakItem(activeItem)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>دوبارہ سنیں</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals for Games */}
      {showGameModal && (
        <NunSakinTanweenGameModal onBack={() => setShowGameModal(false)} />
      )}

      {showPuzzleModal && (
        <MurakkabatPuzzleGameModal
          onBack={() => setShowPuzzleModal(false)}
          initialGameMode="nun_sakin"
        />
      )}
    </div>
  );
};
