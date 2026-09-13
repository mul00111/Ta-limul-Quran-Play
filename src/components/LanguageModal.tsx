import React from 'react';
import { X, Globe, Check } from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

const languages: { code: LanguageCode; name: string; nativeName: string; flag: string }[] = [
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;
  const t = translations[currentLang];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-pink-900/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-white">{t.language}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {languages.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-pink-950/60 border-[#C2185B] text-white shadow-md shadow-pink-950/50'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-sm text-white">{lang.name}</span>
                    <span className="text-xs text-pink-400">{lang.nativeName}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-[#C2185B]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
