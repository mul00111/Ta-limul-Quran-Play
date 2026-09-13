import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  Home,
  BookOpen,
  Gamepad2,
  Bot,
  Landmark,
  Video,
  Users,
  Trophy,
  Globe,
  Settings,
  ShieldCheck,
  Info,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { LanguageCode } from '../types';
import { getAppLocalization } from '../utils/appLocalization';

interface MainMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onNavigateView: (viewName: string, tabOrMode?: string) => void;
  onOpenLanguage: () => void;
  onOpenSettings: () => void;
  onOpenSecurity: () => void;
  onOpenAbout: () => void;
  onOpenPrivacy?: () => void;
}

export const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentLang,
  onNavigateView,
  onOpenLanguage,
  onOpenSettings,
  onOpenSecurity,
  onOpenAbout,
  onOpenPrivacy,
}) => {
  const isRtl = currentLang === 'ur' || currentLang === 'ar';
  const loc = getAppLocalization(currentLang).mainMenu;

  // Keep track of which categories are open in accordion view
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    quran: true,
    games: true,
    ai: true,
    islamic: false,
    live: false,
    parents: false,
    profile: false,
  });

  if (!isOpen) return null;

  const toggleCategory = (key: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAction = (viewName: string, extraParam?: string) => {
    onNavigateView(viewName, extraParam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <aside 
        className={`absolute top-0 bottom-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} w-full max-w-sm sm:max-w-md bg-[#0f1523] border-rose-900/50 text-white shadow-2xl flex flex-col z-10 animate-in ${isRtl ? 'slide-in-from-right' : 'slide-in-from-left'} duration-300 ${isRtl ? 'font-urdu' : 'font-sans'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-950 via-[#182030] to-[#0f1523] border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C2185B] to-rose-900 flex items-center justify-center shadow-lg shadow-pink-900/40 border border-pink-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>{loc.menuTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/80 text-pink-300 border border-rose-700">{loc.menuBadge}</span>
              </h2>
              <p className="text-xs text-rose-300 font-medium">{loc.menuSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          
          {/* 1. 🏠 Home */}
          <button
            onClick={() => handleAction('home')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-200 hover:text-white font-bold transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-900/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Home className="w-4 h-4 text-pink-300" />
              </div>
              <span className="text-base">{loc.homeBtn}</span>
            </div>
            {isRtl ? (
              <ChevronLeft className="w-4 h-4 text-rose-400 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          {/* 🌟 🕌 Madrasa Portal */}
          <button
            onClick={() => handleAction('madrasa-portal')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 hover:from-emerald-900 hover:to-teal-900 border-2 border-emerald-500/50 text-white font-black transition-all cursor-pointer group shadow-lg shadow-emerald-950/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-base shadow group-hover:scale-110 transition-transform">
                🕌
              </div>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <span className="text-sm block text-emerald-300">{loc.madrasaPortalTitle}</span>
                <span className="text-[10px] text-zinc-300 font-normal">{loc.madrasaPortalSub}</span>
              </div>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
              {loc.enterPortal}
            </span>
          </button>

          {/* 2. 📖 Quran Studies */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('quran')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-900/60 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-base">{loc.categories.quran.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.quran ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.quran && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('madani-qaidah')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.quran.qaidah}</span>
                </button>
                <button
                  onClick={() => handleAction('quran-learning', 'read')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.quran.quran}</span>
                </button>
                <button
                  onClick={() => handleAction('sequential-blank-board')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.quran.blankBoard}</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. 🎮 Games Zone */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('games')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-900/60 flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-base">{loc.categories.games.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.games ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.games && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('qaida-games')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.games.allGames}</span>
                </button>
                <button
                  onClick={() => handleAction('murakkabat-puzzle')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.games.magnetic}</span>
                </button>
                <button
                  onClick={() => handleAction('islamic-hub', 'quiz')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.games.quiz}</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. 🤖 AI Teacher */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('ai')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-900/60 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-base">{loc.categories.ai.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.ai ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.ai && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('ai-ustadh', 'pronunciation')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.ai.aiTutor}</span>
                </button>
                <button
                  onClick={() => handleAction('upload-portal')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.ai.voicePortal}</span>
                </button>
              </div>
            )}
          </div>

          {/* 5. 🕌 Islamic Library & Duas */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('islamic')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-base">{loc.categories.islamic.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.islamic ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.islamic && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('prayer-times')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer bg-emerald-950/40 border border-emerald-500/30"
                >
                  <span className="text-emerald-300 font-bold">├── {loc.categories.islamic.prayerTimes}</span>
                </button>
                <button
                  onClick={() => handleAction('islamic-hub-namaz')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-900/30 text-emerald-300 hover:text-emerald-200 text-sm font-bold transition-colors cursor-pointer bg-emerald-950/30 border border-emerald-500/30"
                >
                  <span>├── 🕌 نماز کا طریقہ و نقشہ رکعات</span>
                </button>
                <button
                  onClick={() => handleAction('islamic-hub-azkar')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-900/30 text-amber-300 hover:text-amber-200 text-sm font-bold transition-colors cursor-pointer bg-amber-950/30 border border-amber-500/30"
                >
                  <span>├── 🌅 صبح و شام کے مسنون اذکار</span>
                </button>
                <button
                  onClick={() => handleAction('islamic-hub')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.islamic.hub}</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. 🎥 Live Classes */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('live')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-900/60 flex items-center justify-center">
                  <Video className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-base">{loc.categories.live.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.live ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.live && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('live-ustadh')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>├── {loc.categories.live.liveClass}</span>
                </button>
                <button
                  onClick={() => handleAction('fee-portal')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-red-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.live.fees}</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. 👨‍👩‍👧 Parents */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('parents')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-900/60 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-base">{loc.categories.parents.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.parents ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.parents && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('parent-dashboard')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.parents.controls}</span>
                </button>
              </div>
            )}
          </div>

          {/* 8. 🏆 Student Profile */}
          <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 overflow-hidden">
            <button
              onClick={() => toggleCategory('profile')}
              className="w-full flex items-center justify-between p-3.5 hover:bg-zinc-800/60 font-bold text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-yellow-900/60 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-base">{loc.categories.profile.title}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  openCategories.profile ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openCategories.profile && (
              <div className="px-3 pb-3 space-y-1 bg-black/20 border-t border-zinc-800/60 pt-2">
                <button
                  onClick={() => handleAction('gamification')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-yellow-900/30 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>└── {loc.categories.profile.rewards}</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            {/* 9. 🌐 Language */}
            <button
              onClick={() => {
                onOpenLanguage();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-900/60 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <span>{loc.footerButtons.language}</span>
              </div>
              <span className="text-xs uppercase px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                {currentLang}
              </span>
            </button>

            {/* 10. ⚙️ Settings */}
            <button
              onClick={() => {
                onOpenSettings();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-zinc-300" />
                </div>
                <span>{loc.footerButtons.settings}</span>
              </div>
            </button>

            {/* 11. 🔒 Security & Privacy */}
            <button
              onClick={() => {
                onOpenSecurity();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-900/60 text-emerald-200 hover:text-white font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/80 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                </div>
                <span>{loc.footerButtons.security}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700">100% Secure</span>
            </button>

            {/* 12. ℹ️ About */}
            <button
              onClick={() => {
                onOpenAbout();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 hover:text-white font-bold transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                  <Info className="w-4 h-4 text-rose-400" />
                </div>
                <span>{loc.footerButtons.about}</span>
              </div>
            </button>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
          Ta'limul Quran Play • v2.5.0
        </div>
      </aside>
    </div>
  );
};
