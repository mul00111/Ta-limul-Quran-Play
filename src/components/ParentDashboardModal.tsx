import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Clock, Award, BarChart2, CheckCircle, ArrowRight, 
  Lock, Unlock, KeyRound, Sparkles, UserCheck, Flame, Calendar,
  Bell, Settings, AlertTriangle, Share2, Download, RefreshCw,
  Sliders, Moon, Sun, Volume2, VolumeX, Smartphone, CheckCircle2,
  FileText, MessageSquare, ShieldAlert, Heart
} from 'lucide-react';
import { LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';

interface ParentDashboardModalProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade: string;
  screenTimeUsed: number; // in minutes
  screenTimeLimit: number; // in minutes
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  coins: number;
  stars: number;
  lastActive: string;
  weeklyHours: number[];
}

const DEFAULT_CHILDREN: ChildProfile[] = [
  {
    id: 'child-1',
    name: 'احمد (Ahmad)',
    age: 7,
    grade: 'لیول ۳ - متحرکات',
    screenTimeUsed: 45,
    screenTimeLimit: 90,
    completedLessons: 14,
    totalLessons: 20,
    streakDays: 5,
    coins: 350,
    stars: 28,
    lastActive: 'آج، 2:30 بجے دوپہر',
    weeklyHours: [20, 35, 45, 50, 40, 60, 45]
  },
  {
    id: 'child-2',
    name: 'فاطمہ (Fatima)',
    age: 9,
    grade: 'لیول ۵ - تجوید و حفظ',
    screenTimeUsed: 30,
    screenTimeLimit: 60,
    completedLessons: 18,
    totalLessons: 20,
    streakDays: 8,
    coins: 520,
    stars: 42,
    lastActive: 'کل، 5:15 بجے شام',
    weeklyHours: [30, 40, 25, 60, 45, 50, 30]
  }
];

export const ParentDashboardModal: React.FC<ParentDashboardModalProps> = ({ onBack }) => {
  // Security PIN Lock State
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [parentPin, setParentPin] = useState(() => localStorage.getItem('parent_pin') || '1234');
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [newPin, setNewPin] = useState('');

  // Back Button Handlers (Hierarchy: Change Pin Modal > Return to Home)
  useBackHandler(() => {
    setShowChangePinModal(false);
  }, showChangePinModal, 50, 'parent_change_pin_modal');

  useBackHandler(() => {
    onBack();
  }, !showChangePinModal, 20, 'parent_dashboard_root');

  // Selected Child Profile State
  const [selectedChildId, setSelectedChildId] = useState('child-1');
  const activeChild = DEFAULT_CHILDREN.find(c => c.id === selectedChildId) || DEFAULT_CHILDREN[0];

  // Screen Time & Controls Settings
  const [screenLimit, setScreenLimit] = useState(() => Number(localStorage.getItem('screen_limit') || 90)); // minutes
  const [autoLockOnLimit, setAutoLockOnLimit] = useState(() => localStorage.getItem('auto_lock') !== 'false');
  const [bedtimeLock, setBedtimeLock] = useState(() => localStorage.getItem('bedtime_lock') !== 'false');
  const [soundEffects, setSoundEffects] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);

  // Success Notification Toast
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  // Unlock PIN Handler
  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === parentPin) {
      setIsLocked(false);
      setPinError(false);
      setPinInput('');
      triggerToast('والدین کا ڈیش بورڈ کامیا بی سے ان لاک ہو گیا! 🎉');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Save new PIN
  const handleSaveNewPin = () => {
    if (newPin.length === 4) {
      setParentPin(newPin);
      localStorage.setItem('parent_pin', newPin);
      setShowChangePinModal(false);
      setNewPin('');
      triggerToast('والدین کا سیکیورٹی پن (PIN) کامیابی سے تبدیل ہو گیا! 🔑');
    }
  };

  // Save Screen Limit
  const handleUpdateScreenLimit = (limitMin: number) => {
    setScreenLimit(limitMin);
    localStorage.setItem('screen_limit', limitMin.toString());
    triggerToast(`اسکرین ٹائم کی حد ${limitMin} منٹ پر سیٹ کر دی گئی! ⏱️`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8 font-urdu selection:bg-emerald-500 selection:text-black" dir="rtl">
      
      {/* Background Decorative Element */}
      <div className="max-w-4xl mx-auto space-y-6 relative">

        {/* TOP HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-700 flex items-center justify-center text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  والدین کا ڈیش بورڈ
                </h1>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  Parent Dashboard
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                بچے کی روزانہ کی تعلیم، پیش رفت، رپورٹس اور اسکرین ٹائم کنٹرول
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lock/Unlock Toggle */}
            <button
              onClick={() => {
                if (!isLocked) {
                  setIsLocked(true);
                  triggerToast('ڈیش بورڈ سیکیورٹی کے لیے دوبارہ مقفل (Locked) کر دیا گیا۔');
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                isLocked 
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800 shadow-[0_0_10px_rgba(244,63,94,0.3)]' 
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4 text-rose-400" /> : <Unlock className="w-4 h-4 text-emerald-400" />}
              <span>{isLocked ? 'مقفل (Locked)' : 'غیر مقفل (Unlocked)'}</span>
            </button>

            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <ArrowRight className="w-4 h-4" />
              <span>واپس ہوم</span>
            </button>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}
        <AnimatePresence>
          {toastText && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 bg-emerald-900/90 border border-emerald-400 text-emerald-100 text-xs font-bold rounded-2xl text-center shadow-xl backdrop-blur-md"
            >
              {toastText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN SECURITY MODAL LOCK SCREEN IF LOCKED */}
        {isLocked ? (
          <div className="bg-zinc-900/90 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 backdrop-blur-md relative overflow-hidden">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-rose-950 to-zinc-900 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
              <Lock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-xl font-black text-white">
                والدین سیکیورٹی ان لاک (Parent Verification)
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                بچے کو ترتیبات اور اسکرین ٹائم تبدیل کرنے سے روکنے کے لیے اپنا 4 ہندسوں کا والدین سیکیورٹی پن (PIN) درج کریں:
              </p>
              <p className="text-[11px] font-bold text-amber-400 bg-amber-950/60 p-2 rounded-xl border border-amber-800">
                💡 ڈیفالٹ پن code ہے: <span className="font-mono text-sm tracking-widest text-amber-300">1234</span>
              </p>
            </div>

            <form onSubmit={handleUnlock} className="max-w-xs mx-auto space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="• • • •"
                  className="w-full text-center text-2xl tracking-[1em] font-mono py-3.5 px-4 bg-zinc-950 border-2 border-emerald-500/50 rounded-2xl text-emerald-300 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 shadow-inner"
                />
                {pinError && (
                  <p className="text-xs font-bold text-rose-400 mt-2 animate-bounce">
                    ❌ غلط پن درج کیا گیا! دوبارہ کوشش کریں۔
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-emerald-300"
              >
                <KeyRound className="w-5 h-5 text-zinc-950" />
                <span>ان لاک ڈیش بورڈ</span>
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500">
              والدین کے سیکیورٹی کنٹرولز فعال ہیں ✨
            </div>
          </div>
        ) : (
          /* FULL UNLOCKED DASHBOARD CONTENT */
          <div className="space-y-6">

            {/* Child Profile Selector Bar */}
            <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-zinc-400 shrink-0">بچہ منتخب کریں:</span>
                <div className="flex gap-2">
                  {DEFAULT_CHILDREN.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border ${
                        selectedChildId === child.id
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-300 shadow-md scale-105'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{child.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-zinc-950 px-3.5 py-2 rounded-2xl border border-zinc-800">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>آخری سرگرمی: <strong className="text-zinc-200">{activeChild.lastActive}</strong></span>
              </div>
            </div>

            {/* Key Performance Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Screen Time Card */}
              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 shadow-xl space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-extrabold">آج کا اسکرین ٹائم</span>
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  {activeChild.screenTimeUsed} منٹ / <span className="text-emerald-400">{screenLimit} منٹ</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 mt-2">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                    style={{ width: `${Math.min((activeChild.screenTimeUsed / screenLimit) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400 font-bold pt-1">
                  مقررہ حد کا {Math.round((activeChild.screenTimeUsed / screenLimit) * 100)}% استعمال ہو چکا ہے
                </p>
              </div>

              {/* Completed Lessons */}
              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-cyan-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-extrabold">مکمل شدہ اسباق</span>
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-cyan-300">
                  {activeChild.completedLessons} / {activeChild.totalLessons} اسباق
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 mt-2">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${(activeChild.completedLessons / activeChild.totalLessons) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-cyan-200/80 font-bold pt-1">
                  کورس پیش رفت: {Math.round((activeChild.completedLessons / activeChild.totalLessons) * 100)}%
                </p>
              </div>

              {/* Daily Streak */}
              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-orange-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-extrabold">تعلیمی تسلسل (Streak)</span>
                  <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-orange-400">
                  {activeChild.streakDays} دن لگاتار 🔥
                </div>
                <p className="text-[10px] text-zinc-400 font-bold pt-2">
                  روزانہ باقاعدگی سے آن لائن کلاسیں لیں
                </p>
              </div>

              {/* Badges & Stars */}
              <div className="p-5 rounded-3xl bg-zinc-900/90 border border-amber-500/30 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs font-extrabold">انعامات و کوائنز</span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-300">
                  {activeChild.coins} 🪙 | {activeChild.stars} ⭐
                </div>
                <p className="text-[10px] text-amber-200/80 font-bold pt-2">
                  ماہر قاری کا اعزاز حاصل ہے
                </p>
              </div>
            </div>

            {/* SCREEN TIME CONTROL & DAILY LIMIT SETTER */}
            <div className="p-6 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">اسکرین ٹائم حد اور کنٹرول (Screen Time Limits)</h3>
                    <p className="text-xs text-zinc-400">بچے کے لیے روزانہ آن لائن پڑھائی کی زیادہ سے زیادہ حد مقرر کریں</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-bold text-zinc-300">روزانہ کی اسکرین حد منتخب کریں:</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleUpdateScreenLimit(mins)}
                      className={`py-3 px-3 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                        screenLimit === mins
                          ? 'bg-emerald-500 text-zinc-950 border-emerald-300 shadow-lg scale-105'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                      }`}
                    >
                      {mins} منٹ ({mins / 60 >= 1 ? `${mins / 60} گھنٹہ` : `${mins} min`})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Auto Lock switch */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">حد مکمل ہونے پر خودکار لاک</p>
                      <p className="text-[11px] text-zinc-400">وقت ختم ہونے پر ایپ کو اٹومیٹک بند کر دیں</p>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !autoLockOnLimit;
                        setAutoLockOnLimit(newVal);
                        localStorage.setItem('auto_lock', newVal.toString());
                        triggerToast(newVal ? 'حد مکمل ہونے پر ایپ خودکار بند ہو جائے گی۔' : 'خودکار بندش آف کر دی گئی۔');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        autoLockOnLimit ? 'bg-emerald-500' : 'bg-zinc-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        autoLockOnLimit ? 'right-6' : 'right-0.5'
                      }`} />
                    </button>
                  </div>

                  {/* Bedtime Lock switch */}
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-white">رات کا نائٹ لاک (Bedtime Lock)</p>
                        <p className="text-[11px] text-zinc-400">رات ۹ بجے کے بعد ایپ استعمال پر پابندی</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !bedtimeLock;
                        setBedtimeLock(newVal);
                        localStorage.setItem('bedtime_lock', newVal.toString());
                        triggerToast(newVal ? 'نائٹ لاک آن کر دیا گیا۔' : 'نائٹ لاک بند کر دیا گیا۔');
                      }}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        bedtimeLock ? 'bg-purple-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        bedtimeLock ? 'right-6' : 'right-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBJECT-WISE ANALYTICS & AI REPORT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Weekly Analytics Breakdown */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-emerald-400" />
                    <span>مضامین اور تجویدی پیش رفت (Subject Performance)</span>
                  </h3>
                  <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
                    ماشاء اللہ ممتاز ⭐
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-zinc-200">مدنی و نورانی قاعدہ (حروف مفردات و مرکبات)</span>
                      <span className="text-emerald-400">100% (مکمل)</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-zinc-200">حرکات و متحرکات (زبر، زیر، پیش بغیر کھینچے)</span>
                      <span className="text-teal-400">92%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-teal-400 rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-zinc-200">تجوید اور مخارج صحت (Pronunciation Accuracy)</span>
                      <span className="text-cyan-400">88%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-cyan-500 rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-zinc-200">مسنون دعائیں اور ۶ کلمات</span>
                      <span className="text-amber-400">80%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-amber-500 rounded-full w-[80%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-zinc-200">نماز و وضو کا عملی طریقہ</span>
                      <span className="text-purple-400">75%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                      <div className="h-full bg-purple-500 rounded-full w-[75%]" />
                    </div>
                  </div>
                </div>

                {/* Weekly Attendance Activity chart */}
                <div className="pt-3 border-t border-zinc-800">
                  <div className="text-xs font-bold text-zinc-300 mb-2 flex items-center justify-between">
                    <span>اس ہفتے کا حاضری چارٹ (Daily Minutes Played):</span>
                    <span className="text-emerald-400">کل وقت: 4.5 گھنٹے</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center pt-2">
                    {['پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ', 'اتوار'].map((day, idx) => {
                      const mins = activeChild.weeklyHours[idx];
                      return (
                        <div key={day} className="space-y-1">
                          <div className="h-20 bg-zinc-950 rounded-xl border border-zinc-800 flex items-end p-1 justify-center">
                            <div 
                              className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-lg"
                              style={{ height: `${(mins / 60) * 100}%` }}
                              title={`${mins} mins`}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-400">{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Ustadh Audio Report Box */}
              <div className="p-6 rounded-3xl bg-zinc-900/90 border border-purple-500/30 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-800">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">اے آئی استاد کی تجویدی رپورٹ</h3>
                      <p className="text-[11px] text-zinc-400">آڈیو سن کر خودکار تجویز</p>
                    </div>
                  </div>

                  <div className="bg-purple-950/40 border border-purple-800/50 p-4 rounded-2xl space-y-3 text-xs leading-relaxed text-purple-200">
                    <p className="font-extrabold text-amber-300">
                      درس تبصرہ (Teacher Note):
                    </p>
                    <p>
                      "{activeChild.name} نے ۳ حرفی متحرک الفاظ (وزن، ورد، امر، بلغ) کو بغیر کھینچے روانی سے پڑھنے کا کھیل کامیابی سے مکمل کیا ہے۔"
                    </p>
                    <div className="bg-zinc-950 p-3 rounded-xl border border-purple-900 space-y-1 text-[11px]">
                      <p className="text-emerald-400 font-bold">✔️ مضبوط پوائنٹس: حروفِ مفردات کی پہچان اور زبر/زیر/پیش کی ادائیگی۔</p>
                      <p className="text-amber-300 font-bold">🎯 توجہ کی ضرورت: حروفِ مستعلیہ (خ، ص، ض، ط، ظ) کو پر (موٹا) پڑھنے پر مزید مشق۔</p>
                    </div>
                  </div>
                </div>

                {/* Share Report & Settings Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      triggerToast('بچے کی کارکردگی کی رپورٹ واٹس ایپ شیئر کے لیے کاپی ہو گئی! 📱');
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>رپورٹ واٹس ایپ پر شیئر کریں</span>
                  </button>

                  <button
                    onClick={() => setShowChangePinModal(true)}
                    className="w-full py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-zinc-700 transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>والدین کا سیکیورٹی پن (PIN) تبدیل کریں</span>
                  </button>

                  {/* Developer / Admin Section (PIN Protected) */}
                  <div className="pt-3 border-t border-zinc-800 text-center">
                    <details className="group text-left">
                      <summary className="text-[11px] font-bold text-zinc-500 hover:text-zinc-400 cursor-pointer flex items-center justify-between px-2 py-1 rounded-lg bg-zinc-950/50">
                        <span>🛠️ Developer & Admin Tools</span>
                        <span className="text-[10px] text-zinc-600 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="p-3 mt-2 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                        <p className="text-[10px] text-zinc-400">سورس کوڈ بیک اپ صرف ایڈمنسٹریٹر اور ڈیولپر کے لیے ہے:</p>
                        <a
                          href="/api/download-project"
                          download="TaalimulQuran200Games.zip"
                          className="w-full py-2 px-3 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-[11px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download Source Code (ZIP)</span>
                        </a>
                      </div>
                    </details>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* CHANGE PIN MODAL */}
      <AnimatePresence>
        {showChangePinModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border-2 border-emerald-500/50 rounded-3xl p-6 max-w-sm w-full space-y-5 text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white">نیا ۴ ہندسوں کا پن (PIN) درج کریں</h3>
                <p className="text-xs text-zinc-400 mt-1">والدین کے سیکیورٹی کوڈ کو محفوظ رکھنے کے لیے</p>
              </div>

              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="• • • •"
                className="w-full text-center text-2xl tracking-[1em] font-mono py-3 px-4 bg-zinc-950 border border-emerald-500/50 rounded-2xl text-emerald-300 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setShowChangePinModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  onClick={handleSaveNewPin}
                  disabled={newPin.length !== 4}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  محفوظ کریں
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
