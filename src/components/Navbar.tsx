import React from 'react';
import { BookOpen, Settings, Globe, Home, ShieldCheck, Menu } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface NavbarProps {
  currentLang: LanguageCode;
  onOpenSettings: () => void;
  onOpenLanguage: () => void;
  onOpenSecurity?: () => void;
  onOpenMenu: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onOpenSettings,
  onOpenLanguage,
  onOpenSecurity,
  onOpenMenu,
  onGoHome,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-pink-900/30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMenu}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-rose-900 via-[#C2185B] to-rose-800 hover:from-rose-800 hover:to-pink-600 text-white font-black text-sm transition-all shadow-md shadow-pink-950/60 border border-pink-500/40 cursor-pointer active:scale-95"
            title="مین مینو (MAIN MENU)"
          >
            <Menu className="w-5 h-5 text-white" />
            <span className="font-bold tracking-wide">MAIN MENU</span>
          </button>

          <div 
            onClick={onGoHome}
            className="hidden sm:flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C2185B] to-rose-900 flex items-center justify-center shadow-lg shadow-pink-900/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {t.appTitle}
              </h1>
              <p className="text-xs text-pink-400 font-medium">{t.interactiveLearning}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-black transition-all border border-emerald-600/70 cursor-pointer shadow-md shadow-emerald-950/50"
              title="سیکیورٹی اینڈ پرائیویسی ڈیش بورڈ"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">سیکیورٹی 100%</span>
            </button>
          )}

          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700 cursor-pointer"
            title={t.home}
          >
            <Home className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">{t.home}</span>
          </button>

          <button
            onClick={onOpenLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700 cursor-pointer"
            title="Language"
          >
            <Globe className="w-4 h-4 text-pink-400" />
            <span className="uppercase text-xs font-bold">{currentLang}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition-colors border border-zinc-700 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">{t.settings}</span>
          </button>
        </div>
      </div>
    </header>
  );
};


