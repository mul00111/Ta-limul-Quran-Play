import React from 'react';
import { X, BookOpen, Heart, Shield, Award, Sparkles, Star } from 'lucide-react';
import { LanguageCode } from '../types';

interface AboutModalProps {
  currentLang: LanguageCode;
  onClose: () => void;
  onOpenPrivacy?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, onOpenPrivacy }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#161d2a] border border-rose-900/60 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C2185B] to-rose-900 flex items-center justify-center shadow-lg shadow-pink-900/40">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">تعليم القرآن پلے</h2>
              <p className="text-xs text-rose-400 font-medium">ایپلی کیشن کے بارے میں (About App)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-4 text-right leading-relaxed text-sm text-zinc-300">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <p className="font-bold text-white text-base flex items-center gap-2 justify-start">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>اسلامی و قرآنی تعلیمی پلیٹ فارم</span>
            </p>
            <p>
              **تعلیم القرآن پلے** بچوں، والدین اور اساتذہ کے لیے تجوید، حروف مفردات، مرکبات، مسنون دعائیں اور تجوید کے قواعد کھیل ہی کھیل میں اور AI استاد کی رہنمائی سے سیکھنے کا جدید ترین تعلیمی پلیٹ فارم ہے۔
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 shrink-0" />
              <div>
                <div className="font-bold text-white">ورژن (Version)</div>
                <div className="text-zinc-400">v2.5.0 (2026 Edition)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-white">تجوید و تلفظ</div>
                <div className="text-zinc-400">100% مستند و صوتی</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="font-bold text-white">سیکیورٹی</div>
                <div className="text-zinc-400">والدین لاک و PIN تحفظ</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="font-bold text-white">صدقہ جاریہ</div>
                <div className="text-zinc-400">100% مفت تعلیمی خدمت</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-zinc-500">
            © 2026 Taleem-ul-Quran Play. All rights reserved.
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800 flex gap-2 justify-end">
          {onOpenPrivacy && (
            <button
              onClick={() => {
                onClose();
                onOpenPrivacy();
              }}
              className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              پرائیویسی پالیسی (Privacy Policy)
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-700 to-pink-600 hover:from-rose-600 hover:to-pink-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
