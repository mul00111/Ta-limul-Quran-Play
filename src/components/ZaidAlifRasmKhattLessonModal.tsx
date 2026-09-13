import React, { useState, useMemo } from 'react';
import { 
  ArrowRight, Volume2, Play, Pause, RefreshCw, BookOpen, Sparkles, 
  CheckCircle2, HelpCircle, Layers, Award, Radio, Info, Eye, Check, X
} from 'lucide-react';
import { 
  ZaidAlifWordItem, RasmKhattItem,
  RULE_1_ZAID_ALIF_WORDS, RULE_2_SALASILA, RULE_3_NEVER_READ_WORDS, 
  RULE_4_ANA_NOT_ZAID_WORDS, ALL_ZAID_ALIF_ITEMS, RASM_KHATT_GRID_ITEMS,
  ZAID_ALIF_OFFICIAL_RULES
} from '../data/zaidAlifRasmKhattData';
import { playQariText, stopAllQariAudio } from '../utils/qariAudioService';

interface ZaidAlifRasmKhattLessonModalProps {
  onBack: () => void;
  onOpenGamesHub?: () => void;
  onOpenPuzzleModal?: () => void;
}

export const ZaidAlifRasmKhattLessonModal: React.FC<ZaidAlifRasmKhattLessonModalProps> = ({
  onBack,
  onOpenGamesHub,
  onOpenPuzzleModal
}) => {
  const [activeTab, setActiveTab] = useState<'zaid_alif' | 'rasm_khatt' | 'rules' | 'quiz'>('zaid_alif');
  const [readMode, setReadMode] = useState<'wasl' | 'waqf'>('wasl'); // Wasl vs Waqf state
  const [pronunciationMode, setPronunciationMode] = useState<'rawani' | 'hijja'>('rawani');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'rule1' | 'rule2' | 'rule3' | 'rule4'>('all');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizMode, setQuizMode] = useState<'wasl_quiz' | 'waqf_quiz'>('wasl_quiz');

  // Filtered Zaid Alif Items
  const filteredZaidItems = useMemo(() => {
    if (selectedCategoryFilter === 'rule1') return RULE_1_ZAID_ALIF_WORDS;
    if (selectedCategoryFilter === 'rule2') return RULE_2_SALASILA;
    if (selectedCategoryFilter === 'rule3') return RULE_3_NEVER_READ_WORDS;
    if (selectedCategoryFilter === 'rule4') return RULE_4_ANA_NOT_ZAID_WORDS;
    return ALL_ZAID_ALIF_ITEMS;
  }, [selectedCategoryFilter]);

  // Audio speech handler
  const speakWord = async (item: ZaidAlifWordItem) => {
    setActiveWordId(item.id);
    let textToPlay = item.audioText;
    
    if (pronunciationMode === 'hijja') {
      textToPlay = item.spellingHijja;
    } else {
      if (readMode === 'wasl') {
        textToPlay = item.waslAudioText || item.waslPronunciation;
      } else {
        textToPlay = item.waqfAudioText || item.waqfPronunciation;
      }
    }

    await playQariText(textToPlay);
    setActiveWordId(null);
  };

  const speakRasmItem = async (item: RasmKhattItem) => {
    setActiveWordId(item.id);
    const textToPlay = pronunciationMode === 'hijja' ? item.spellingHijja : (item.audioText || item.arabic);
    await playQariText(textToPlay);
    setActiveWordId(null);
  };

  const playFullSequence = async (items: ZaidAlifWordItem[]) => {
    if (isPlayingSequence) {
      stopAllQariAudio();
      setIsPlayingSequence(false);
      setActiveWordId(null);
      return;
    }

    setIsPlayingSequence(true);
    for (const item of items) {
      setActiveWordId(item.id);
      const textToPlay = readMode === 'wasl' ? (item.waslAudioText || item.waslPronunciation) : (item.waqfAudioText || item.waqfPronunciation);
      await playQariText(textToPlay);
      await new Promise(r => setTimeout(r, 400));
    }
    setIsPlayingSequence(false);
    setActiveWordId(null);
  };

  // Quiz Questions generator
  const quizQuestions = useMemo(() => {
    const list = [...ALL_ZAID_ALIF_ITEMS];
    return list.map((item) => {
      let correctAnswer = '';
      let options: string[] = [];
      let questionText = '';

      if (item.ruleCategory === 'rule1_wasl_no_waqf_yes') {
        questionText = `کلمہ "${item.arabic}" میں وصل (ملا کر پڑھنے) کا صحیح حکم کیا ہے؟`;
        correctAnswer = `زائد الف نہیں پڑھیں گے (${item.waslPronunciation})`;
        options = [
          `زائد الف نہیں پڑھیں گے (${item.waslPronunciation})`,
          `الف ۱ الف کی مقدار کھینچ کر پڑھیں گے`,
          `وقف اور وصل دونوں میں الف نہیں پڑھیں گے`
        ];
      } else if (item.ruleCategory === 'rule2_salabila_optional') {
        questionText = `کلمہ "سَلٰسِلَا۟" کے وقف میں کیا حکم ہے؟`;
        correctAnswer = `الف کے ساتھ اور لام ساکن دونوں صورتیں جائز ہیں`;
        options = [
          `الف کے ساتھ اور لام ساکن دونوں صورتیں جائز ہیں`,
          `صرف الف کے ساتھ پڑھنا واجب ہے`,
          `کسی صورت میں نہیں پڑھا جا سکتا`
        ];
      } else if (item.ruleCategory === 'rule3_never_read') {
        questionText = `کلمہ "${item.arabic}" میں زائد الف کا کیا حکم ہے؟`;
        correctAnswer = `وصل اور وقف دونوں میں الف نہیں پڑھیں گے`;
        options = [
          `وصل اور وقف دونوں میں الف نہیں پڑھیں گے`,
          `صرف وقف کی صورت میں الف پڑھا جائے گا`,
          `ہمیشہ ۱ الف کی مقدار کھینچیں گے`
        ];
      } else {
        questionText = `کلمہ "${item.arabic}" کے الف کا کیا حکم ہے؟`;
        correctAnswer = `الف اصلی ہے، ۱ الف کھینچ کر پڑھا جائے گا`;
        options = [
          `الف اصلی ہے، ۱ الف کھینچ کر پڑھا جائے گا`,
          `یہ زائد الف ہے اور ساقط ہو جائے گا`,
          `وقف میں نہیں پڑھا جائے گا`
        ];
      }

      return {
        item,
        questionText,
        correctAnswer,
        options: options.sort(() => Math.random() - 0.5)
      };
    }).sort(() => Math.random() - 0.5).slice(0, 8);
  }, []);

  const handleQuizAnswer = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedQuizOption(option);
    setIsAnswerSubmitted(true);
    if (option === quizQuestions[quizIndex].correctAnswer) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedQuizOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      alert(`امتحان مکمل! آپ کا اسکور: ${quizScore + (selectedQuizOption === quizQuestions[quizIndex].correctAnswer ? 1 : 0)} / ${quizQuestions.length}`);
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedQuizOption(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-zinc-900 p-3 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* TOP HEADER */}
        <div className="bg-gradient-to-r from-teal-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-4 sm:p-6 shadow-2xl border-2 border-emerald-500/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-700/60 pb-4">
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
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-zinc-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow">
                    سبق نمبر ۱۵ • مکمل تجوید
                  </span>
                  <span className="bg-emerald-500/40 text-emerald-200 text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-400/40">
                    عکسِ نورانی قاعدہ 📖
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-200 mt-1">
                  زائد الف ”ا۟“ و رسم الخط
                </h1>
              </div>
            </div>

            {/* Read Mode Controls (Wasl vs Waqf Toggle) */}
            <div className="flex items-center gap-2 bg-emerald-950/80 p-1.5 rounded-2xl border border-emerald-500/50">
              <span className="text-xs text-amber-300 font-bold px-2">حالتِ قراءت:</span>
              <button
                onClick={() => setReadMode('wasl')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  readMode === 'wasl'
                    ? 'bg-amber-400 text-zinc-950 shadow-md ring-2 ring-amber-300'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                وَصْلًا (ملا کر)
              </button>
              <button
                onClick={() => setReadMode('waqf')}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  readMode === 'waqf'
                    ? 'bg-amber-400 text-zinc-950 shadow-md ring-2 ring-amber-300'
                    : 'text-emerald-200 hover:bg-white/10'
                }`}
              >
                وَقْفًا (رک کر)
              </button>
            </div>
          </div>

          {/* Intro Rule Banner */}
          <div className="bg-amber-500/10 border-2 border-amber-400/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
                <h3 className="font-black text-amber-300 text-base">
                  زائد الف کی بنیادی تعریف:
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-100 font-bold leading-relaxed">
                قرآن پاک میں بعض جگہ الف پر گول دائرہ ”○“ (یا ”۟“) بنا ہوتا ہے، ایسے الف کو <span className="text-amber-300 font-black underline decoration-amber-400 px-1">”زائد الف“</span> کہتے ہیں۔
              </p>
            </div>

            <button
              onClick={() => playFullSequence(filteredZaidItems)}
              className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 ${
                isPlayingSequence
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:brightness-110'
              }`}
            >
              {isPlayingSequence ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-950" />}
              <span>{isPlayingSequence ? 'تلاوت جاری ہے...' : 'پورا سبق سنیں'}</span>
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900/90 p-2 rounded-2xl border border-amber-500/30 shadow-lg">
          <button
            onClick={() => setActiveTab('zaid_alif')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'zaid_alif'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-zinc-950 shadow-md ring-2 ring-amber-300'
                : 'text-amber-200 hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>۱) زائد الف کے قواعد و کلمات ({ALL_ZAID_ALIF_ITEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rasm_khatt')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rasm_khatt'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md ring-2 ring-emerald-300'
                : 'text-emerald-200 hover:bg-zinc-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>۲) رسم الخط (غیر ملفوظ حروف) ({RASM_KHATT_GRID_ITEMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md ring-2 ring-teal-300'
                : 'text-emerald-200 hover:bg-zinc-800'
            }`}
          >
            <Info className="w-4 h-4 text-teal-300" />
            <span>۳) تفصیلی تجویدی قوانین</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-300'
                : 'text-purple-200 hover:bg-zinc-800'
            }`}
          >
            <Award className="w-4 h-4 text-purple-300" />
            <span>۴) خود کار مشق و ٹیسٹ 🎯</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: ZAID ALIF WORDS & RULES 1, 2, 3, 4
           ========================================================================= */}
        {activeTab === 'zaid_alif' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm">
              <span className="text-xs font-black text-emerald-950 px-2">فلٹر کریں:</span>
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                }`}
              >
                تمام کلمات ({ALL_ZAID_ALIF_ITEMS.length})
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('rule1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === 'rule1'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                قاعدہ ۱ (۶ کلمات - وصل/وقف)
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('rule2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === 'rule2'
                    ? 'bg-teal-700 text-white shadow'
                    : 'bg-teal-50 text-teal-900 hover:bg-teal-100'
                }`}
              >
                قاعدہ ۲ (سَلٰسِلَا)
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('rule3')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === 'rule3'
                    ? 'bg-rose-700 text-white shadow'
                    : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
                }`}
              >
                قاعدہ ۳ (کسی صورت نہیں پڑھا جائے گا)
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('rule4')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryFilter === 'rule4'
                    ? 'bg-indigo-700 text-white shadow'
                    : 'bg-indigo-50 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                قاعدہ ۴ (مشتقات "أَنَا" - پڑھا جائے گا)
              </button>
            </div>

            {/* RULE 1 CARDS: 6 WORDS */}
            {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'rule1') && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-3.5 rounded-2xl shadow-md border-r-8 border-amber-300 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <span>۱) ان ۶ کلمات میں زائد الف کو وصل میں نہیں، لیکن وقف میں پڑھیں گے</span>
                      <span className="bg-amber-300 text-zinc-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                        ۶ کلمات
                      </span>
                    </h3>
                    <p className="text-xs text-amber-100 mt-0.5">
                      ملا کر پڑھتے وقت الف خاموش رہے گا، اور وقف کرتے وقت ۱ الف کھینچ کر پڑھیں گے
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {RULE_1_ZAID_ALIF_WORDS.map((item) => {
                    const isActive = activeWordId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => speakWord(item)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${
                          isActive
                            ? 'bg-amber-100 border-amber-500 shadow-xl scale-[1.02] ring-4 ring-amber-300'
                            : 'bg-white hover:bg-amber-50/50 border-amber-200 hover:border-amber-400 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                          <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            {item.surahRefUrdu}
                          </span>
                          <Volume2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="text-center my-1">
                          <span className="text-3xl sm:text-4xl font-black text-zinc-900 font-arabic tracking-wide">
                            {item.displayColoredParts.map((part, i) => (
                              <span
                                key={i}
                                className={
                                  part.type === 'zaid_alif'
                                    ? 'text-rose-600 font-extrabold underline decoration-rose-400'
                                    : 'text-zinc-900'
                                }
                              >
                                {part.text}
                              </span>
                            ))}
                          </span>
                        </div>

                        {/* Wasl vs Waqf Badge */}
                        <div className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-zinc-500">وَصْلًا (ملا کر):</span>
                            <span className="font-black text-emerald-800 dir-rtl">{item.waslPronunciation}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs border-t border-zinc-200/60 pt-1">
                            <span className="font-bold text-zinc-500">وَقْفًا (رک کر):</span>
                            <span className="font-black text-amber-800 dir-rtl">{item.waqfPronunciation}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RULE 2 CARD: SALASILA */}
            {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'rule2') && (
              <div className="space-y-3 pt-2">
                <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white p-3.5 rounded-2xl shadow-md border-r-8 border-teal-300 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <span>۲) کلمہ ”سَلٰسِلَا۟“ (پ ۲۹، سورة الدھر ۴)</span>
                      <span className="bg-teal-300 text-zinc-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                        خاص کلمہ
                      </span>
                    </h3>
                    <p className="text-xs text-teal-100 mt-0.5">
                      وصل میں الف بالکل نہیں پڑھیں گے۔ وقف میں الف پڑھنا "سَلٰسِلَا" اور نہ پڑھنا "سَلٰسِلْ" دونوں جائز ہیں!
                    </p>
                  </div>
                </div>

                {RULE_2_SALASILA.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => speakWord(item)}
                    className="bg-white p-5 rounded-2xl border-2 border-teal-300 shadow-md hover:border-teal-500 transition-all cursor-pointer flex flex-col md:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-zinc-900 font-arabic bg-teal-50 p-3 rounded-2xl border border-teal-200">
                        {item.arabic}
                      </span>
                      <div>
                        <span className="bg-teal-100 text-teal-900 text-xs font-black px-2.5 py-0.5 rounded-full">
                          {item.surahRefUrdu}
                        </span>
                        <p className="text-xs text-zinc-600 mt-1 font-bold">
                          {item.explanationUrdu}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                      <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-emerald-700 font-bold block">وصل میں تلفظ</span>
                        <span className="text-sm font-black text-emerald-900">{item.waslPronunciation}</span>
                      </div>
                      <div className="bg-amber-50 border border-amber-300 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-amber-700 font-bold block">وقف میں ۲ صورتیں جائز</span>
                        <span className="text-sm font-black text-amber-900">{item.waqfPronunciation}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* RULE 3 CARDS: ZAID ALIF NEVER READ */}
            {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'rule3') && (
              <div className="space-y-3 pt-2">
                <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white p-3.5 rounded-2xl shadow-md border-r-8 border-rose-300 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <span>۳) ان کلمات میں زائد الف وصل اور وقف کسی صورت نہیں پڑھا جائے گا</span>
                      <span className="bg-rose-300 text-zinc-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                        ۱۳ کلمات (۱۳ مقامات)
                      </span>
                    </h3>
                    <p className="text-xs text-rose-100 mt-0.5">
                      یہ زائد الف صرف رسم الخط (لکھنے) کا حصہ ہے، تلاوت میں ہمیشہ خاموش رہے گا
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {RULE_3_NEVER_READ_WORDS.map((item) => {
                    const isActive = activeWordId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => speakWord(item)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between space-y-2.5 ${
                          isActive
                            ? 'bg-rose-100 border-rose-500 shadow-xl scale-[1.02] ring-4 ring-rose-300'
                            : 'bg-white hover:bg-rose-50/50 border-rose-200 hover:border-rose-400 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                          <span className="text-[10px] font-black text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded truncate max-w-[150px]">
                            {item.surahRefUrdu}
                          </span>
                          <Volume2 className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="text-center my-1">
                          <span className="text-2xl sm:text-3xl font-black text-zinc-900 font-arabic tracking-wide">
                            {item.displayColoredParts.map((part, i) => (
                              <span
                                key={i}
                                className={
                                  part.type === 'zaid_alif'
                                    ? 'text-rose-600 font-extrabold underline decoration-rose-400'
                                    : 'text-zinc-900'
                                }
                              >
                                {part.text}
                              </span>
                            ))}
                          </span>
                        </div>

                        <div className="bg-rose-50/80 rounded-xl p-2 border border-rose-200/80 text-center">
                          <span className="text-[10px] text-rose-700 font-bold block">حکمِ تلاوت (وصل و وقف)</span>
                          <span className="text-xs font-black text-rose-900 dir-rtl">{item.waslPronunciation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RULE 4 CARDS: ANA DERIVATIVES (ALIF IS PRONOUNCED) */}
            {(selectedCategoryFilter === 'all' || selectedCategoryFilter === 'rule4') && (
              <div className="space-y-3 pt-2">
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-3.5 rounded-2xl shadow-md border-r-8 border-indigo-300 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                      <span>۴) ان کلمات میں لفظ ”أَنَا“ کا الف زائد نہیں ہے، لہٰذا الف پڑھا جائے گا</span>
                      <span className="bg-indigo-300 text-zinc-950 text-[11px] font-black px-2 py-0.5 rounded-full">
                        ۵ کلمات
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-100 mt-0.5">
                      یہاں الف اصلی حرف ہے، اس لیے اسے ۱ الف کی مقدار کھینچ کر پڑھا جائے گا
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {RULE_4_ANA_NOT_ZAID_WORDS.map((item) => {
                    const isActive = activeWordId === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => speakWord(item)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col justify-between space-y-3 ${
                          isActive
                            ? 'bg-indigo-100 border-indigo-500 shadow-xl scale-[1.02] ring-4 ring-indigo-300'
                            : 'bg-white hover:bg-indigo-50/50 border-indigo-200 hover:border-indigo-400 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                          <span className="text-[11px] font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                            {item.surahRefUrdu}
                          </span>
                          <Volume2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="text-center my-1">
                          <span className="text-3xl sm:text-4xl font-black text-zinc-900 font-arabic tracking-wide">
                            {item.displayColoredParts.map((part, i) => (
                              <span
                                key={i}
                                className={
                                  part.type === 'pronounced_alif'
                                    ? 'text-emerald-600 font-extrabold underline decoration-emerald-400'
                                    : 'text-zinc-900'
                                }
                              >
                                {part.text}
                              </span>
                            ))}
                          </span>
                        </div>

                        <div className="bg-indigo-50 rounded-xl p-2.5 border border-indigo-200 text-center">
                          <span className="text-[10px] text-indigo-700 font-bold block">الف کا حکم (ثابت ہے)</span>
                          <span className="text-xs font-black text-indigo-950 dir-rtl">{item.waslPronunciation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 2: RASM UL KHATT GRID (SILENT/UNPRONOUNCED LETTERS)
           ========================================================================= */}
        {activeTab === 'rasm_khatt' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header Description */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-900 text-white p-5 rounded-3xl border-2 border-emerald-500/60 shadow-xl space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-300" />
                <h3 className="font-black text-lg text-emerald-200">
                  تعریفِ رسم الخط (جو حروف حرکت، تنوین و سکون سے خالی ہوں)
                </h3>
              </div>
              <p className="text-sm text-emerald-100 font-bold leading-relaxed">
                "جو حروف حرکت، تنوین، و سکون سے خالی ہوں وہ لکھے جاتے ہیں، پڑھے نہیں جاتے۔ علامتاً کے طور پر چھوٹے دائرے یا رنگین ڈیزائن سے ظاہر کیے جاتے ہیں۔"
              </p>
            </div>

            {/* Grid of Rasm ul Khatt Items */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {RASM_KHATT_GRID_ITEMS.map((item) => {
                const isActive = activeWordId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => speakRasmItem(item)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col items-center justify-between min-h-[140px] text-center ${
                      isActive
                        ? 'bg-emerald-100 border-emerald-500 shadow-xl scale-105 ring-4 ring-emerald-300'
                        : 'bg-white hover:bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 shadow-md'
                    }`}
                  >
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300 w-full truncate">
                      {item.categoryUrdu}
                    </span>

                    <div className="my-2">
                      <span className="text-3xl sm:text-4xl font-black text-zinc-900 font-arabic tracking-wide">
                        {item.displayColoredParts.map((part, i) => (
                          <span
                            key={i}
                            className={
                              part.type === 'silent'
                                ? 'text-rose-500 opacity-60 font-normal line-through decoration-rose-400'
                                : part.type === 'rasm_vowel'
                                ? 'text-amber-600 font-extrabold'
                                : 'text-zinc-900'
                            }
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                    </div>

                    <div className="w-full border-t border-emerald-100 pt-1.5 space-y-0.5">
                      <span className="text-[10px] font-bold text-rose-700 block">
                        غیر ملفوظ: {item.silentLetter}
                      </span>
                      <span className="text-[10px] font-medium text-zinc-500 block truncate" title={item.explanationUrdu}>
                        {item.explanationUrdu}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: OFFICIAL TAJWEED RULES & EXPLANATIONS
           ========================================================================= */}
        {activeTab === 'rules' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-300 shadow-lg space-y-4">
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                <Info className="w-6 h-6 text-emerald-700" />
                <h2 className="text-xl font-black text-emerald-950">
                  سبق نمبر ۱۵: زائد الف و رسم الخط کے مکمل قواعد
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ZAID_ALIF_OFFICIAL_RULES.map((rule) => (
                  <div key={rule.id} className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {rule.id}
                      </span>
                      <h3 className="font-black text-emerald-950 text-sm">{rule.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-700 font-bold leading-relaxed pr-9">
                      {rule.descriptionUrdu}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INTERACTIVE QUIZ & SELF-TEST
           ========================================================================= */}
        {activeTab === 'quiz' && (
          <div className="animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-purple-300 shadow-xl space-y-6 max-w-2xl mx-auto">
              
              {/* Quiz Header */}
              <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl font-black text-lg">
                    🎯 {quizIndex + 1} / {quizQuestions.length}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-purple-950">زائد الف کا خود کار ٹیسٹ</h2>
                    <p className="text-xs text-purple-700">اپنی سمجھ کی تصدیق کیجیے</p>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs font-bold text-zinc-500 block">موجودہ اسکور:</span>
                  <span className="text-xl font-black text-purple-700">{quizScore} پوائنٹس</span>
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-200 text-center space-y-3">
                <span className="text-4xl font-black text-zinc-900 font-arabic block my-2">
                  {quizQuestions[quizIndex]?.item.arabic}
                </span>
                <p className="text-base font-black text-purple-950">
                  {quizQuestions[quizIndex]?.questionText}
                </p>
              </div>

              {/* Option Buttons */}
              <div className="space-y-3">
                {quizQuestions[quizIndex]?.options.map((option, idx) => {
                  let btnStyle = 'bg-zinc-50 border-zinc-200 hover:bg-purple-50 hover:border-purple-300 text-zinc-800';
                  if (isAnswerSubmitted) {
                    if (option === quizQuestions[quizIndex].correctAnswer) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-400';
                    } else if (option === selectedQuizOption) {
                      btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-4 rounded-2xl border-2 text-right transition-all font-bold text-sm flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && option === quizQuestions[quizIndex].correctAnswer && (
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && option === selectedQuizOption && option !== quizQuestions[quizIndex].correctAnswer && (
                        <X className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next / Reset Controls */}
              {isAnswerSubmitted && (
                <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>دوبارہ شروع کریں</span>
                  </button>

                  <button
                    onClick={handleNextQuiz}
                    className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>اگلا سوال</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
