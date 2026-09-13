import React from 'react';
import { Home, BookOpen, Gamepad2, Bot, Shield, Video } from 'lucide-react';
import { LanguageCode } from '../types';

interface BottomNavProps {
  currentView: string;
  currentLang: LanguageCode;
  onNavigate: (view: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
}) => {
  const navItems = [
    { id: 'home', label: 'ہوم', icon: Home, color: 'text-rose-400' },
    { id: 'live-ustadh', label: 'لائیو کلاس', icon: Video, color: 'text-rose-400' },
    { id: 'qaida-games', label: 'گیمز', icon: Gamepad2, color: 'text-pink-400' },
    { id: 'madani-qaidah', label: 'قاعدہ و قرآن', icon: BookOpen, color: 'text-amber-400' },
    { id: 'ai-ustadh', label: 'AI استاد', icon: Bot, color: 'text-purple-400' },
    { id: 'parent-dashboard', label: 'والدین', icon: Shield, color: 'text-emerald-400' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 sm:hidden shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white font-black shadow-inner scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-slate-400'}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-white font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
