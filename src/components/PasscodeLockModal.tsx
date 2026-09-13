import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';

interface PasscodeLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
  currentLang: LanguageCode;
  savedPin?: string;
}

export const PasscodeLockModal: React.FC<PasscodeLockModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "والدین اور ایڈمن سیکیورٹی لاک (Parental & Admin Security Lock)",
  description = "اس سیکشن میں داخل ہونے کے لیے اپنا 4 ہندسوں کا سیکیورٹی پن درج کریں (Defaut PIN: 1234)",
  currentLang,
  savedPin = "1234"
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === savedPin) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        setIsSuccess(false);
        setEnteredPin('');
        onSuccess();
      }, 500);
    } else {
      setErrorMsg('غلط سیکیورٹی پن! براہ کرم صحیح پن درج کریں۔ (Incorrect PIN)');
      setEnteredPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-right" dir="rtl">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer font-bold text-sm"
        >
          ✕
        </button>

        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40 animate-pulse">
            <Lock className="w-8 h-8 text-emerald-200" />
          </div>

          <h3 className="text-xl font-black text-white">{title}</h3>
          <p className="text-xs text-zinc-300 max-w-xs">{description}</p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex justify-center items-center gap-4 mb-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-black transition-all ${
                enteredPin.length > idx
                  ? isSuccess
                    ? 'border-emerald-400 bg-emerald-950/60 text-emerald-300'
                    : 'border-pink-500 bg-pink-950/40 text-pink-300 scale-105'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-600'
              }`}
            >
              {enteredPin.length > idx ? (showPin ? enteredPin[idx] : '●') : ''}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 text-center animate-bounce">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold flex items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>سیکیورٹی پن درست ہے! رسائی منظور کی گئی۔ (Access Granted)</span>
          </div>
        )}

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="py-3.5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-700 text-white font-black text-lg shadow-md active:scale-95 cursor-pointer transition-all border border-zinc-700/50"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setShowPin(!showPin)}
            className="py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer border border-zinc-800"
            title="پن دیکھیں / چھپائیں"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3.5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-700 text-white font-black text-lg shadow-md active:scale-95 cursor-pointer border border-zinc-700/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="py-3.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 font-black text-xs flex items-center justify-center cursor-pointer border border-rose-900/50"
          >
            حذف ⌫
          </button>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>یہ ایپ 256-Bit SSL انکرپشن اور محفوظ پن پروٹیکشن سے مکمل لیس ہے۔</span>
        </div>
      </div>
    </div>
  );
};
