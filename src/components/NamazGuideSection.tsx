import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, BookOpen, Sun, Moon, Sunrise, Sunset, Award, 
  CheckCircle, Copy, Volume2, VolumeX, Sparkles, ChevronDown, 
  ChevronUp, Heart, Share2, Info, Compass, Pause, Globe, Check
} from 'lucide-react';
import { LanguageCode } from '../types';
import { 
  LOCALIZED_PRAYER_TIMES, 
  LOCALIZED_RAKAHS_TABLE, 
  LOCALIZED_SPECIAL_PRAYERS, 
  LOCALIZED_MANZOOM_DUA, 
  LOCALIZED_NAMAZ_STEPS, 
  LOCALIZED_DUA_E_QUNOOT, 
  LOCALIZED_SHARAAIT_ARKAAN, 
  NAMAZ_UI_TEXTS,
  SupportedLang 
} from '../utils/namazMultiLangData';

interface NamazGuideSectionProps {
  currentLang?: LanguageCode;
  onBackToHub?: () => void;
}

export const NamazGuideSection: React.FC<NamazGuideSectionProps> = ({ currentLang }) => {
  const [subTab, setSubTab] = useState<'chart' | 'steps' | 'qunoot' | 'sharaait'>('chart');
  
  // Multi-language state: ur (Urdu), en (English), hi (Hindi), roman (Roman Urdu)
  const [activeLang, setActiveLang] = useState<SupportedLang>(() => {
    if (currentLang === 'hi') return 'hi';
    if (currentLang === 'en') return 'en';
    return 'ur';
  });

  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('zuhr');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [arabicFontSize, setArabicFontSize] = useState<number>(24);
  const [individualStepLang, setIndividualStepLang] = useState<Record<number, SupportedLang>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playSpeech = (text: string, id: string, lang: 'ar' | 'ur' = 'ar') => {
    // If clicked on currently playing audio, stop it
    if (isPlayingAudio === id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(null);
      return;
    }

    // Stop any previously playing audio or speech
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsPlayingAudio(id);

    // 1. High-fidelity audio via server TTS proxy (ensures correct Urdu/Arabic accent and pronunciation)
    const ttsUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
    const audio = new Audio(ttsUrl);
    currentAudioRef.current = audio;

    audio.onended = () => {
      setIsPlayingAudio(null);
      currentAudioRef.current = null;
    };

    audio.onerror = () => {
      // 2. Fallback to Web Speech API with language-appropriate voice selection
      currentAudioRef.current = null;
      if (!('speechSynthesis' in window)) {
        setIsPlayingAudio(null);
        return;
      }

      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = lang === 'ur' ? 0.88 : 0.82; // gentle, measured pace for clarity

      if (lang === 'ur') {
        u.lang = 'ur-PK';
        try {
          const voices = window.speechSynthesis.getVoices();
          const urVoice = voices.find(v => v.lang.startsWith('ur')) || 
                          voices.find(v => v.lang.startsWith('hi'));
          if (urVoice) u.voice = urVoice;
        } catch {}
      } else {
        u.lang = 'ar-SA';
        try {
          const voices = window.speechSynthesis.getVoices();
          const arVoice = voices.find(v => v.lang.startsWith('ar'));
          if (arVoice) u.voice = arVoice;
        } catch {}
      }

      u.onend = () => setIsPlayingAudio(null);
      u.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(u);
    };

    audio.play().catch(() => {
      audio.onerror?.(new Event('error'));
    });
  };

  const isRtl = activeLang === 'ur';

  const selectedPrayerData = LOCALIZED_RAKAHS_TABLE.find(p => p.id === selectedPrayerId) || LOCALIZED_RAKAHS_TABLE[1];

  const languagesList: { id: SupportedLang; label: string; flag: string }[] = [
    { id: 'ur', label: 'اردو', flag: '🇵🇰' },
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { id: 'roman', label: 'Roman Urdu', flag: '🔤' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Banner with multi-language bar and book reference */}
      <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-[#06241c] via-[#093528] to-[#041913] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Language Selection Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-black text-amber-200">
              {NAMAZ_UI_TEXTS.languageLabel[activeLang]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 border border-emerald-500/40 shadow-inner">
            {languagesList.map(lang => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeLang === lang.id
                    ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-md font-black scale-105'
                    : 'text-zinc-300 hover:text-white hover:bg-emerald-950/60'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{NAMAZ_UI_TEXTS.badge[activeLang]}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{NAMAZ_UI_TEXTS.mainTitle[activeLang]}</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              {NAMAZ_UI_TEXTS.mainSubtitle[activeLang]}
            </p>
          </div>

          {/* Arabic Font Size Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center bg-black/40 border border-emerald-500/30 px-3 py-1.5 rounded-2xl">
            <span className="text-xs text-emerald-300 font-bold">{NAMAZ_UI_TEXTS.fontLabel[activeLang]}</span>
            <button
              onClick={() => setArabicFontSize(prev => Math.max(18, prev - 2))}
              className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              title="Decrease Font Size"
            >
              -A
            </button>
            <span className="text-xs font-bold text-amber-300 w-8 text-center">{arabicFontSize}px</span>
            <button
              onClick={() => setArabicFontSize(prev => Math.min(36, prev + 2))}
              className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs font-bold hover:bg-emerald-900 cursor-pointer"
              title="Increase Font Size"
            >
              +A
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-emerald-800/50">
          <button
            onClick={() => setSubTab('chart')}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              subTab === 'chart'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300 shadow-lg scale-[1.02]'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 border-emerald-700/40'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>{NAMAZ_UI_TEXTS.tabs.chart[activeLang]}</span>
          </button>
          <button
            onClick={() => setSubTab('steps')}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              subTab === 'steps'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300 shadow-lg scale-[1.02]'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 border-emerald-700/40'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>{NAMAZ_UI_TEXTS.tabs.steps[activeLang]}</span>
          </button>
          <button
            onClick={() => setSubTab('qunoot')}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              subTab === 'qunoot'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300 shadow-lg scale-[1.02]'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 border-emerald-700/40'
            }`}
          >
            <Moon className="w-4 h-4 text-teal-300" />
            <span>{NAMAZ_UI_TEXTS.tabs.qunoot[activeLang]}</span>
          </button>
          <button
            onClick={() => setSubTab('sharaait')}
            className={`px-3 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              subTab === 'sharaait'
                ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white border-amber-300 shadow-lg scale-[1.02]'
                : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900/60 border-emerald-700/40'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-cyan-300" />
            <span>{NAMAZ_UI_TEXTS.tabs.sharaait[activeLang]}</span>
          </button>
        </div>
      </div>

      {/* 1. CHART & PRAYER TIMES SECTION */}
      {subTab === 'chart' && (
        <div className="space-y-6">
          {/* A. اوقاتِ صلوٰۃ Card */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-emerald-700/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-amber-300">
                    {NAMAZ_UI_TEXTS.timesHeader.title[activeLang]}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {NAMAZ_UI_TEXTS.timesHeader.desc[activeLang]}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                مفتاح الدین
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {LOCALIZED_PRAYER_TIMES.map((def) => {
                const iconMap: Record<string, typeof Sunrise> = {
                  fajr: Sunrise,
                  zuhr: Sun,
                  asr: Sun,
                  maghrib: Sunset,
                  isha: Moon
                };
                const Icon = iconMap[def.id] || Clock;

                return (
                  <div
                    key={def.id}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${def.color} border ${def.borderColor} space-y-1.5 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${def.textColor}`} />
                        <h4 className={`text-base font-extrabold ${def.textColor}`}>
                          {def.name[activeLang]}
                        </h4>
                      </div>
                      <span className="text-xs font-arabic text-zinc-300" dir="rtl">{def.arabicName}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                      {def.definition[activeLang]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* B. تعدادِ رکعاتِ نماز (The Complete Chart from Book) */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border-2 border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span className="text-amber-400">{NAMAZ_UI_TEXTS.rakahsHeader.title[activeLang]}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {NAMAZ_UI_TEXTS.badge[activeLang].split('•')[0]}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  {NAMAZ_UI_TEXTS.rakahsHeader.desc[activeLang]}
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="flex items-center gap-1 bg-amber-950/70 border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-xl font-bold">
                  <span className="w-3.5 h-3.5 rounded-full border border-amber-400 flex items-center justify-center text-[9px]">➁</span>
                  <span>{NAMAZ_UI_TEXTS.legend.muakkadah[activeLang].split('(')[0].trim()}</span>
                </span>
                <span className="flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-xl font-bold">
                  <span>{NAMAZ_UI_TEXTS.tableCols.fard[activeLang]}</span>
                </span>
                <span className="flex items-center gap-1 bg-teal-950/70 border border-teal-500/50 text-teal-300 px-2.5 py-1 rounded-xl font-bold">
                  <span>{NAMAZ_UI_TEXTS.tableCols.wajib[activeLang]}</span>
                </span>
              </div>
            </div>

            {/* Table layout exactly as in the book image */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 shadow-inner bg-black/40">
              <table className="w-full text-center text-xs sm:text-sm border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-950 text-amber-300 font-extrabold border-b border-zinc-800">
                    <th className="p-3 border-l border-zinc-800 text-right pr-4">{NAMAZ_UI_TEXTS.tableCols.prayer[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800 text-white font-black bg-zinc-800/40">{NAMAZ_UI_TEXTS.tableCols.total[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800">{NAMAZ_UI_TEXTS.tableCols.sunnahPrior[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800 text-emerald-400 font-black">{NAMAZ_UI_TEXTS.tableCols.fard[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800">{NAMAZ_UI_TEXTS.tableCols.sunnahPost[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800">{NAMAZ_UI_TEXTS.tableCols.nafl1[activeLang]}</th>
                    <th className="p-3 border-l border-zinc-800 text-teal-300">{NAMAZ_UI_TEXTS.tableCols.wajib[activeLang]}</th>
                    <th className="p-3">{NAMAZ_UI_TEXTS.tableCols.nafl2[activeLang]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-bold">
                  {LOCALIZED_RAKAHS_TABLE.map((row, idx) => {
                    const isSelected = selectedPrayerId === row.id;
                    const prayerIcons: Record<string, typeof Sunrise> = {
                      fajr: Sunrise,
                      zuhr: Sun,
                      asr: Sun,
                      maghrib: Sunset,
                      isha: Moon,
                      jumuah: Sparkles
                    };
                    const Icon = prayerIcons[row.id] || Clock;

                    return (
                      <tr 
                        key={row.id}
                        onClick={() => setSelectedPrayerId(row.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-amber-500/10' : idx % 2 === 0 ? 'bg-zinc-900/50 hover:bg-zinc-800/50' : 'bg-zinc-950/50 hover:bg-zinc-800/50'
                        }`}
                      >
                        {/* 1. نماز کا نام */}
                        <td className="p-3 border-l border-zinc-800 text-right pr-4 font-black text-white flex items-center justify-between">
                          <span className="text-sm sm:text-base">{row.prayer[activeLang]}</span>
                          <Icon className="w-3.5 h-3.5 text-amber-400" />
                        </td>

                        {/* 2. کل رکعتیں */}
                        <td className="p-3 border-l border-zinc-800 font-black text-base sm:text-lg text-amber-300 bg-zinc-800/30">
                          {row.total}
                        </td>

                        {/* 3. سنت اول */}
                        <td className="p-3 border-l border-zinc-800">
                          {row.sunnahPrior !== null ? (
                            row.isSunnahPriorMuakkadah ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-sm shadow-sm" title={NAMAZ_UI_TEXTS.legend.muakkadah[activeLang]}>
                                {row.sunnahPrior}
                              </span>
                            ) : (
                              <span className="text-zinc-300 font-medium">{row.sunnahPrior}</span>
                            )
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>

                        {/* 4. فرض */}
                        <td className="p-3 border-l border-zinc-800 font-black text-emerald-400 text-base sm:text-lg">
                          {row.fard}
                        </td>

                        {/* 5. سنت دوم */}
                        <td className="p-3 border-l border-zinc-800">
                          {row.sunnahPostAlt ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-xs">
                              {row.sunnahPostAlt}
                            </span>
                          ) : row.sunnahPost !== null ? (
                            row.isSunnahPostMuakkadah ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-300 font-black text-sm shadow-sm" title={NAMAZ_UI_TEXTS.legend.muakkadah[activeLang]}>
                                {row.sunnahPost}
                              </span>
                            ) : (
                              <span className="text-zinc-300 font-medium">{row.sunnahPost}</span>
                            )
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>

                        {/* 6. نفل ۱ */}
                        <td className="p-3 border-l border-zinc-800 text-zinc-300">
                          {row.nafl1 !== null ? row.nafl1 : <span className="text-zinc-600">—</span>}
                        </td>

                        {/* 7. واجب (وتر) */}
                        <td className="p-3 border-l border-zinc-800">
                          {row.wajibText ? (
                            <span className="px-2 py-0.5 rounded-lg bg-teal-950 border border-teal-500/50 text-teal-300 font-bold text-xs">
                              {row.wajibText[activeLang]}
                            </span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>

                        {/* 8. نفل ۲ */}
                        <td className="p-3 text-zinc-300">
                          {row.nafl2 !== null ? row.nafl2 : <span className="text-zinc-600">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Special Section: عیدین اور تراویح */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {LOCALIZED_SPECIAL_PRAYERS.map((sp) => {
                return (
                  <div
                    key={sp.id}
                    className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-600/40 flex items-start gap-3 shadow-md"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-white">{sp.title[activeLang]}</h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40">
                          {sp.rakahs[activeLang]}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">{sp.note[activeLang]}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footnote / Legend explanation */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200/90 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>{NAMAZ_UI_TEXTS.legend.title[activeLang]}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-zinc-300 pr-2">
                <li><strong className="text-amber-300">⭘ :</strong> {NAMAZ_UI_TEXTS.legend.muakkadah[activeLang]}</li>
                <li><strong>— :</strong> {NAMAZ_UI_TEXTS.legend.ghairMuakkadah[activeLang]}</li>
                <li><strong className="text-teal-300">وتر :</strong> {NAMAZ_UI_TEXTS.legend.wajib[activeLang]}</li>
              </ul>
            </div>

            {/* Prayer Breakdown Detail Card */}
            {selectedPrayerData && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{selectedPrayerData.prayer[activeLang]}:</span>
                  </h4>
                  <span className="text-xs font-bold text-emerald-300">
                    {NAMAZ_UI_TEXTS.tableCols.total[activeLang]}: {selectedPrayerData.total}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                  {selectedPrayerData.orderDescription[activeLang]}
                </p>
              </motion.div>
            )}
          </div>

          {/* C. منظوم دعا (Book Bottom Munajat) with Multi-Language Support */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-950/40 via-zinc-900 to-emerald-950/50 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-amber-300">
                  {LOCALIZED_MANZOOM_DUA.title[activeLang]}
                </h3>
              </div>
              <button
                onClick={() => {
                  const allLines = LOCALIZED_MANZOOM_DUA.lines.map(l => `${l.ur}\n(${l[activeLang] || l.roman})`).join('\n\n');
                  handleCopy(allLines, 'manzoom-dua');
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>{copiedText === 'manzoom-dua' ? NAMAZ_UI_TEXTS.copied[activeLang] : NAMAZ_UI_TEXTS.copy[activeLang]}</span>
              </button>
            </div>

            {/* The 4 poetic lines with Multi-Language Display */}
            <div className="max-w-2xl mx-auto my-3 space-y-4">
              {LOCALIZED_MANZOOM_DUA.lines.map((line, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-2xl bg-black/50 border border-amber-400/30 space-y-1.5 text-center shadow-inner"
                >
                  {/* Original Urdu Nastaliq Line */}
                  <p className="text-lg sm:text-2xl font-bold text-amber-200 font-arabic tracking-wide leading-relaxed" dir="rtl">
                    {line.ur}
                  </p>
                  
                  {/* Roman Urdu Transliteration */}
                  <p className="text-xs sm:text-sm text-emerald-300 font-medium italic">
                    "{line.roman}"
                  </p>

                  {/* Hindi & English Translations */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-300 pt-1 border-t border-zinc-800/80">
                    <span className="text-amber-100/90 font-semibold">{line.hi}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-300">{line.en}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <button
                id="play-manzoom-dua-btn"
                onClick={() => {
                  // Urdu speech text using phonetic normalization for perfect 'Maula' accent
                  const speechText = "اے میرے مالک، اے میرے مولا! کر دے تُو سب پہ کرم، میرے مولا! جن کا نہیں ہے کوئی جہاں میں، ان کا بھی رکھ دے بھرم، میرے مولا!";
                  playSpeech(speechText, 'dua-audio', 'ur');
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isPlayingAudio === 'dua-audio'
                    ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white ring-2 ring-amber-300 scale-105'
                    : 'bg-gradient-to-r from-amber-600 to-emerald-700 hover:from-amber-500 hover:to-emerald-600 text-white'
                }`}
              >
                {isPlayingAudio === 'dua-audio' ? (
                  <>
                    <Pause className="w-4 h-4 text-white animate-pulse" />
                    <span>{NAMAZ_UI_TEXTS.stopAudio[activeLang]}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-200" />
                    <span>{NAMAZ_UI_TEXTS.listenRecitation[activeLang]} (Urdu / مولا)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STEP BY STEP NAMAZ GUIDE */}
      {subTab === 'steps' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-300">
                {NAMAZ_UI_TEXTS.tabs.steps[activeLang]}
              </h3>
              <p className="text-xs text-zinc-300">
                {activeLang === 'ur' && 'تمام مسنون اذکار، ثناء، تعوذ، تشہد و درود شریف مع مکمل اعراب و سلیس ترجمہ'}
                {activeLang === 'en' && 'All Sunnah supplications, Sana, Tashahhud, and Durood with accurate transliteration & translation'}
                {activeLang === 'hi' && 'तमाम मसनून अज़कार, सना, तशह्हुद और दुरूद शरीफ़ मअ एअराब व तर्जुमा'}
                {activeLang === 'roman' && 'Tamam masnoon azkar, Sana, Tashahhud aur Durood Shareef ma aeraab aur tarjuma'}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 font-bold border border-emerald-700">
              14 Steps
            </span>
          </div>

          <div className="space-y-4">
            {LOCALIZED_NAMAZ_STEPS.map((s) => {
              const stepLang = individualStepLang[s.step] || activeLang;

              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 sm:p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-3.5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-700 font-black flex items-center justify-center text-xs">
                        {s.step}
                      </span>
                      <h4 className="text-base font-black text-white">{s.title[activeLang]}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-700/50 px-3 py-1 rounded-full">
                        {s.timing[activeLang]}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                    {s.desc[activeLang]}
                  </p>

                  {/* Arabic Text with size controls */}
                  <div 
                    className="font-arabic font-bold text-amber-200 text-right leading-loose py-3 px-4 rounded-2xl bg-black/40 border border-amber-500/20"
                    style={{ fontSize: `${arabicFontSize}px` }}
                    dir="rtl"
                  >
                    {s.arabic}
                  </div>

                  {/* Roman Transliteration for accurate recitation */}
                  <div className="p-3 bg-black/30 rounded-2xl border border-zinc-800/80 text-xs sm:text-sm text-zinc-300">
                    <strong className="text-amber-300 font-bold block mb-1">
                      {NAMAZ_UI_TEXTS.transliterationLabel[activeLang]}
                    </strong>
                    <span className="italic text-emerald-200">{s.transliteration}</span>
                  </div>

                  {/* Multi-Language Translation Box with quick language chips */}
                  <div className="p-3.5 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <strong className="text-xs text-emerald-400 font-bold">
                        {NAMAZ_UI_TEXTS.translationLabel[activeLang]}
                      </strong>
                      {/* Interactive translation language switch */}
                      <div className="flex items-center gap-1">
                        {languagesList.map(l => (
                          <button
                            key={l.id}
                            onClick={() => setIndividualStepLang(prev => ({ ...prev, [s.step]: l.id }))}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              stepLang === l.id
                                ? 'bg-amber-500 text-zinc-950 font-black'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                      {s.translation[stepLang]}
                    </p>
                  </div>

                  {/* Audio and Copy actions */}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleCopy(`${s.arabic}\n\n${s.transliteration}\n\nTranslation: ${s.translation[activeLang]}`, `step-${s.step}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{copiedText === `step-${s.step}` ? NAMAZ_UI_TEXTS.copied[activeLang] : NAMAZ_UI_TEXTS.copy[activeLang]}</span>
                    </button>

                    <button
                      onClick={() => playSpeech(s.arabic, `step-${s.step}`, 'ar')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-emerald-800 transition-colors"
                    >
                      {isPlayingAudio === `step-${s.step}` ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>{NAMAZ_UI_TEXTS.stopAudio[activeLang]}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{NAMAZ_UI_TEXTS.listenRecitation[activeLang]}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. WITR & DUA E QUNOOT */}
      {subTab === 'qunoot' && (
        <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900 border-2 border-teal-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-teal-300">
                  {LOCALIZED_DUA_E_QUNOOT.title[activeLang]}
                </h3>
                <p className="text-xs text-zinc-400">
                  {activeLang === 'ur' && 'عشاء کے ۳ رکعت وتر واجب میں تیسری رکعت میں پڑھی جانے والی مسنون دعا'}
                  {activeLang === 'en' && 'Supplication recited in the 3rd Rakah of Witr prayer after Isha'}
                  {activeLang === 'hi' && 'इशा की ३ रकअत वित्र में तीसरी रकअत में पढ़ी जाने वाली मसनून दुआ'}
                  {activeLang === 'roman' && 'Isha ki 3 rakat Witr mein 3rd rakat mein padhi jaane wali masnoon dua'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-950 text-teal-200 border border-teal-800">
              {NAMAZ_UI_TEXTS.tableCols.wajib[activeLang]}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/40 text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
            <strong className="text-amber-300">طریقہ / Method:</strong> {LOCALIZED_DUA_E_QUNOOT.note[activeLang]}
          </div>

          <div 
            className="font-arabic font-bold text-amber-200 text-right leading-loose py-4 px-5 rounded-2xl bg-black/60 border border-teal-500/30"
            style={{ fontSize: `${arabicFontSize + 2}px` }}
            dir="rtl"
          >
            {LOCALIZED_DUA_E_QUNOOT.arabic}
          </div>

          {/* Transliteration */}
          <div className="p-3 bg-black/40 rounded-2xl border border-zinc-800 text-xs sm:text-sm text-zinc-300">
            <strong className="text-teal-300 block mb-1">
              {NAMAZ_UI_TEXTS.transliterationLabel[activeLang]}
            </strong>
            <p className="italic text-teal-100">{LOCALIZED_DUA_E_QUNOOT.transliteration}</p>
          </div>

          {/* Multi-Language Translations */}
          <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <strong className="text-amber-300 text-xs font-bold">
                {NAMAZ_UI_TEXTS.translationLabel[activeLang]}
              </strong>
              <div className="flex items-center gap-1">
                {languagesList.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLang(l.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      activeLang === l.id
                        ? 'bg-teal-500 text-zinc-950 font-black'
                        : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
              {LOCALIZED_DUA_E_QUNOOT.translation[activeLang]}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => handleCopy(`${LOCALIZED_DUA_E_QUNOOT.arabic}\n\n${LOCALIZED_DUA_E_QUNOOT.transliteration}\n\nTranslation: ${LOCALIZED_DUA_E_QUNOOT.translation[activeLang]}`, 'qunoot')}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>{copiedText === 'qunoot' ? NAMAZ_UI_TEXTS.copied[activeLang] : NAMAZ_UI_TEXTS.copy[activeLang]}</span>
            </button>
            <button
              onClick={() => playSpeech(LOCALIZED_DUA_E_QUNOOT.arabic, 'qunoot-audio', 'ar')}
              className="px-4 py-2 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-300 text-xs font-bold flex items-center gap-2 cursor-pointer border border-teal-700 transition-colors"
            >
              {isPlayingAudio === 'qunoot-audio' ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{NAMAZ_UI_TEXTS.stopAudio[activeLang]}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-teal-400" />
                  <span>{NAMAZ_UI_TEXTS.listenRecitation[activeLang]}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. SHARAAIT & ARKAAN */}
      {subTab === 'sharaait' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Sharaait (7 conditions outside namaz) */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-emerald-700/40 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-emerald-300 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>{LOCALIZED_SHARAAIT_ARKAAN.sharaaitTitle[activeLang]}</span>
            </h3>
            <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-200 list-none pr-1">
              {LOCALIZED_SHARAAIT_ARKAAN.sharaait.map(c => (
                <li key={c.number} className="p-3 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 font-black text-xs flex items-center justify-center">
                      {c.number}
                    </span>
                    <strong className="text-emerald-300 font-bold">{c.title[activeLang]}:</strong>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm pr-7 leading-relaxed">{c.desc[activeLang]}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Arkaan (6 internal pillars inside namaz) */}
          <div className="p-6 rounded-3xl bg-zinc-900 border border-amber-700/40 shadow-xl space-y-4">
            <h3 className="text-lg font-black text-amber-300 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>{LOCALIZED_SHARAAIT_ARKAAN.arkaanTitle[activeLang]}</span>
            </h3>
            <ol className="space-y-2.5 text-xs sm:text-sm text-zinc-200 list-none pr-1">
              {LOCALIZED_SHARAAIT_ARKAAN.arkaan.map(a => (
                <li key={a.number} className="p-3 rounded-2xl bg-black/40 border border-zinc-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-600 text-amber-300 font-black text-xs flex items-center justify-center">
                      {a.number}
                    </span>
                    <strong className="text-amber-300 font-bold">{a.title[activeLang]}:</strong>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm pr-7 leading-relaxed">{a.desc[activeLang]}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
export default NamazGuideSection;
