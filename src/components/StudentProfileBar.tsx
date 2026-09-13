import React from 'react';
import { Flame, Coins, Award, User, Zap } from 'lucide-react';
import { LanguageCode } from '../types';

interface StudentProfileBarProps {
  currentLang: LanguageCode;
  onOpenGamification: () => void;
  onOpenParentDashboard: () => void;
}

export const StudentProfileBar: React.FC<StudentProfileBarProps> = ({
  onOpenGamification,
  onOpenParentDashboard,
}) => {
  return (
    <div className="w-full bg-zinc-900/90 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Student Profile Info */}
      <div 
        onClick={onOpenParentDashboard}
        className="flex items-center gap-3 cursor-pointer group hover:bg-zinc-800/80 px-3 py-1.5 rounded-2xl transition-all"
        title="والدین کا ڈیش بورڈ کھولیں (Parent Dashboard)"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full bg-zinc-900 rounded-[10px] flex items-center justify-center text-pink-400">
            <User className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>احمد (Ahmad)</span>
            <span className="text-[10px] bg-pink-950 text-pink-300 border border-pink-800 px-1.5 py-0.2 rounded-md">لیول 3</span>
          </div>
          <div className="text-[10px] text-zinc-400">والدین کا ڈیش بورڈ ⚙️</div>
        </div>
      </div>

      {/* Gamification Stats: Streak, Coins, XP */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Streak */}
        <div 
          onClick={onOpenGamification}
          className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/60 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-amber-900/60 transition-colors shadow-sm"
          title="روزانہ اسٹریک (Daily Streak)"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-extrabold text-amber-200">5 دن 🔥</span>
        </div>

        {/* Coins */}
        <div 
          onClick={onOpenGamification}
          className="flex items-center gap-1.5 bg-yellow-950/60 border border-yellow-700/60 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-yellow-900/60 transition-colors shadow-sm"
          title="سکے (Coins)"
        >
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-extrabold text-yellow-200">350 🪙</span>
        </div>

        {/* XP */}
        <div 
          onClick={onOpenGamification}
          className="hidden sm:flex items-center gap-1.5 bg-purple-950/60 border border-purple-800/60 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-purple-900/60 transition-colors shadow-sm"
          title="تجربہ پوائنٹس (XP)"
        >
          <Zap className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-extrabold text-purple-200">1,250 XP ⚡</span>
        </div>

        {/* Trophy / Badges */}
        <button
          onClick={onOpenGamification}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-pink-400 border border-zinc-700 cursor-pointer shadow-sm flex items-center justify-center"
          title="بیجز اور لیڈر بورڈ (Badges & Leaderboard)"
        >
          <Award className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
