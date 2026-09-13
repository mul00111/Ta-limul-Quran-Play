import React from 'react';
import { motion } from 'motion/react';
import { Award, Coins, Flame, Trophy, Zap, ArrowRight, CheckCircle } from 'lucide-react';
import { UserProgress, LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';

interface GamificationModalProps {
  currentLang: LanguageCode;
  onBack: () => void;
  progress?: UserProgress;
}

const BADGES = [
  { title: 'پہلا حرف ماسٹر', desc: 'مدنی قاعدہ کا پہلا سبق مکمل کیا', icon: '🌟', unlocked: true },
  { title: 'تجوید چیمپئن', desc: '5 حروف صحیح تلفظ سے پڑھے', icon: '🏆', unlocked: true },
  { title: 'حفظ اسٹار', desc: 'سورۃ الإخلاص زبانی یاد کی', icon: '📖', unlocked: true },
  { title: 'مسلسل 5 دن', desc: '5 دن لگاتار ایپ استعمال کی', icon: '🔥', unlocked: true },
];

const LEADERBOARD = [
  { rank: 1, name: 'عبداللہ (Abdullah)', xp: '2,450 XP', badge: '🥇' },
  { rank: 2, name: 'احمد (Ahmad - آپ)', xp: '1,250 XP', badge: '🥈' },
  { rank: 3, name: 'فاطمہ (Fatima)', xp: '1,120 XP', badge: '🥉' },
];

export const GamificationModal: React.FC<GamificationModalProps> = ({ onBack, progress }) => {
  useBackHandler(() => {
    onBack();
  }, true, 20, 'gamification_modal_back');
  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-zinc-950 shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">بیجز، سکے اور لیڈر بورڈ (Rewards & Leaderboard)</h1>
              <p className="text-xs text-zinc-400">XP پوائنٹس، انعامات اور روزانہ کے چیلنجز</p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>واپس ہوم</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-md">
            <Flame className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />
            <div className="text-lg font-black text-white">{progress?.streak || 0} دن</div>
            <div className="text-[10px] text-zinc-400">اسٹریک (Streak)</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-md">
            <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{progress?.coins || 0} 🪙</div>
            <div className="text-[10px] text-zinc-400">کل سکے (Coins)</div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-center shadow-md">
            <Zap className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-black text-white">{progress?.xp || 0} XP</div>
            <div className="text-[10px] text-zinc-400">تجربہ پوائنٹس</div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mb-6 space-y-3">
          <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>حاصل کردہ انعامات و بیجز (Earned Badges)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES.map((b, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md flex items-center gap-4">
                <div className="text-3xl w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{b.title}</h4>
                  <p className="text-xs text-zinc-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-amber-300 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>طلبا کی لیڈر بورڈ (Student Leaderboard)</span>
          </h3>
          <div className="space-y-2">
            {LEADERBOARD.map((item) => (
              <div key={item.rank} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.badge}</span>
                  <span className="text-sm font-bold text-white">{item.name}</span>
                </div>
                <span className="text-xs font-black text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1 rounded-xl">
                  {item.xp}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
