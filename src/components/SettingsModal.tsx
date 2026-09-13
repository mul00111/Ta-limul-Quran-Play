import React from 'react';
import { X, Sliders, Volume2, Sparkles } from 'lucide-react';
import { AppSettings, LanguageCode } from '../types';
import { translations } from '../translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  currentLang: LanguageCode;
  onOpenPrivacy?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentLang,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-pink-900/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-white">{t.settings}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Accent Color Info */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.customizeTheme}
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="w-6 h-6 rounded-full bg-[#C2185B] shadow-md shadow-pink-900/50" />
              <div>
                <p className="text-sm font-bold text-white">Dark Pink Theme (#C2185B)</p>
                <p className="text-xs text-zinc-400">Modern Islamic design accent active</p>
              </div>
            </div>
          </div>

          {/* Reciter Voice */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {t.reciterVoice}
            </label>
            <select
              value={settings.reciter}
              onChange={(e) => onUpdateSettings({ reciter: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#C2185B]"
            >
              <option value="mishary">Sheikh Mishary Rashid Alafasy</option>
              <option value="abdulrahman">Sheikh Abdul Rahman Al-Sudais</option>
              <option value="minshawi">Sheikh Mohamed Siddiq El-Minshawi</option>
              <option value="abdulbasit">Sheikh Abdul Basit 'Abd us-Samad</option>
            </select>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-pink-400" />
              <div>
                <h4 className="text-sm font-bold text-white">{t.soundEffects}</h4>
                <p className="text-xs text-zinc-400">Play navigation & quiz feedback sounds</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => onUpdateSettings({ soundEffects: e.target.checked })}
              className="w-5 h-5 accent-[#C2185B] rounded cursor-pointer"
            />
          </div>

          {/* Privacy Policy & Play Store Compliance */}
          {onOpenPrivacy && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">پرائیویسی پالیسی (Privacy & Policy)</h4>
                <p className="text-xs text-zinc-400">Play Store Family & Data Protection Info</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                📜 دیکھیں (View)
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#C2185B] hover:bg-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-900/30 transition-all"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
