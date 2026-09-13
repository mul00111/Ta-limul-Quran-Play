import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, Check, Copy } from 'lucide-react';
import { playQariText, stopAllQariAudio } from '../utils/qariAudioService';

import { SupportedLang } from '../utils/namazMultiLangData';

interface AsmaUlHusnaHeaderBannerProps {
  hubLang?: SupportedLang;
}

export const AsmaUlHusnaHeaderBanner: React.FC<AsmaUlHusnaHeaderBannerProps> = ({ hubLang = 'ur' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const arabicText = 'هُوَ اللَّهُ الَّذِي لَا إِلَهَ إِلَّا هُوَ ۚ';

  const translations: Record<SupportedLang, string> = {
    ur: 'وہی اللہ ہے جس کے سوا کوئی معبود نہیں (سورۃ الحشر: ۲۲)',
    en: 'He is Allah, other than Whom there is no deity (Surah Al-Hashr: 22)',
    hi: 'वही अल्लाह है जिसके सिवा कोई माबूद (सच्चा पूज्य) नहीं (सूरह अल-हश्र: 22)',
    roman: 'Wahi Allah hai jis ke siwa koi mabood nahi (Surah Al-Hashr: 22)'
  };

  const handlePlayAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      stopAllQariAudio();
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    playQariText(arabicText, () => {
      setIsPlaying(false);
    });
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${arabicText}\n${translations[hubLang]}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 rounded-2xl sm:rounded-3xl p-3 sm:p-5 bg-gradient-to-b from-emerald-100 via-emerald-50 to-teal-100 dark:from-emerald-950/40 dark:via-zinc-900/90 dark:to-emerald-950/30 border border-emerald-300/40 dark:border-emerald-600/30 shadow-xl overflow-hidden relative group"
    >
      {/* Background Decorative Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Islamic Plaque Card */}
      <div 
        onClick={handlePlayAudio}
        className="relative cursor-pointer select-none transition-all duration-300 transform active:scale-[0.99] hover:brightness-105"
        title="تلاوت سننے کے لیے کلک کریں (Click to listen)"
      >
        {/* SVG Decorative Mihrab / Scalloped Islamic Plaque */}
        <div className="relative w-full max-w-2xl mx-auto drop-shadow-md sm:drop-shadow-lg">
          <svg
            viewBox="0 0 960 220"
            className="w-full h-auto block filter drop-shadow-[0_4px_12px_rgba(6,78,59,0.35)]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="emeraldBannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#084f3c" />
                <stop offset="50%" stopColor="#0a5c46" />
                <stop offset="100%" stopColor="#064232" />
              </linearGradient>
              <filter id="bannerGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#042f24" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Outer Islamic Cartouche Shape */}
            <path
              d="
                M 170 30
                L 790 30
                C 810 30, 825 42, 820 58
                C 815 72, 835 80, 855 88
                C 885 98, 930 108, 935 110
                C 930 112, 885 122, 855 132
                C 835 140, 815 148, 820 162
                C 825 178, 810 190, 790 190
                L 170 190
                C 150 190, 135 178, 140 162
                C 145 148, 125 140, 105 132
                C 75 122, 30 112, 25 110
                C 30 108, 75 98, 105 88
                C 125 80, 145 72, 140 58
                C 135 42, 150 30, 170 30
                Z
              "
              fill="url(#emeraldBannerGrad)"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Inner Parallel White Contour Line */}
            <path
              d="
                M 172 38
                L 788 38
                C 804 38, 816 48, 812 60
                C 808 72, 826 79, 846 86
                C 874 95, 915 106, 920 110
                C 915 114, 874 125, 846 134
                C 826 141, 808 148, 812 160
                C 816 172, 804 182, 788 182
                L 172 182
                C 156 182, 144 172, 148 160
                C 152 148, 134 141, 114 134
                C 86 125, 45 114, 40 110
                C 45 106, 86 95, 114 86
                C 134 79, 152 72, 148 60
                C 144 48, 156 38, 172 38
                Z
              "
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Left & Right Subtle Star Accents */}
            <circle cx="85" cy="110" r="3.5" fill="#fef08a" />
            <circle cx="875" cy="110" r="3.5" fill="#fef08a" />
          </svg>

          {/* HTML Overlay with Full Crisp Calligraphy */}
          <div className="absolute inset-0 flex items-center justify-center px-8 sm:px-16 pointer-events-none">
            <div className="text-center w-full">
              <h2 
                className="font-arabic font-black text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl leading-none tracking-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] selection:bg-amber-400"
                style={{
                  fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
                  wordSpacing: '0.15em'
                }}
              >
                {arabicText}
              </h2>
            </div>
          </div>
        </div>

        {/* Action Controls & Translation Subtitle */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2 px-2 sm:px-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{translations[hubLang]}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-[11px] font-bold bg-white/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 border border-emerald-200 dark:border-zinc-700 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="کاپی کریں"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              <span className="hidden sm:inline">{copied ? 'کاپی ہو گیا' : 'کاپی'}</span>
            </button>

            {/* Audio Play/Pause Button */}
            <button
              onClick={handlePlayAudio}
              className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce' : ''}`} />
              <span>{isPlaying ? 'روکیں' : 'آواز سنیں'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
