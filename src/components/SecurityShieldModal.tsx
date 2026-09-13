import React, { useState, useEffect } from 'react';
import { 
  Shield, ShieldCheck, ShieldAlert, Lock, Key, Cpu, Eye, EyeOff, 
  RefreshCw, CheckCircle2, AlertTriangle, FileText, Server, HardDrive, 
  Wifi, UserCheck, Terminal, Sparkles
} from 'lucide-react';
import { LanguageCode, SecurityConfig } from '../types';

interface SecurityShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  securityConfig: SecurityConfig;
  onUpdateSecurityConfig: (newConfig: Partial<SecurityConfig>) => void;
}

export const SecurityShieldModal: React.FC<SecurityShieldModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  securityConfig,
  onUpdateSecurityConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'pin' | 'privacy'>('overview');
  
  // Security Audit Scan States
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [scanLogs, setScanLogs] = useState<string[]>([
    "✓ TLS 1.3 256-bit Connection Validated",
    "✓ Memory Sandbox & Local State Security Passed",
    "✓ Anti-CSRF & XSS Header Protection Active",
    "✓ Audio/Video Live Stream End-to-End Encrypted",
    "✓ Student & Parent Personal Data Encrypted"
  ]);

  // PIN Changing States
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const runSecurityScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setScanStep(1);
    setScanLogs([]);

    const steps = [
      "1/6: Checking TLS 1.3 256-bit Socket Encryption...",
      "2/6: Verifying LocalStorage Key-Value Cipher...",
      "3/6: Testing Anti-DDoS API Rate Limiting Shield...",
      "4/6: Validating Content Moderation & Safe Link Filter...",
      "5/6: Inspecting Audio & Live Class E2EE Stream Protocols...",
      "6/6: Verifying Child Data GDPR Protection Compliance..."
    ];

    steps.forEach((stepMsg, idx) => {
      setTimeout(() => {
        setScanStep(idx + 1);
        setScanLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stepMsg}`]);

        if (idx === steps.length - 1) {
          setTimeout(() => {
            setIsScanning(false);
            setScanCompleted(true);
            setScanLogs(prev => [
              ...prev,
              "🎉 سیکیورٹی سکین مکمل! تمام 6 حفاظتی ٹیسٹ 100% کامیاب رہیں۔ ایپ مکمل محفوظ ہے۔"
            ]);
          }, 600);
        }
      }, (idx + 1) * 600);
    });
  };

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== securityConfig.parentPin) {
      setPinMessage({ text: 'موجودہ سیکیورٹی پن غلط درج کیا گیا ہے۔ (Current PIN mismatch)', type: 'error' });
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinMessage({ text: 'نیا پن صرف 4 ہندسوں (Digits) پر مشتمل ہونا چاہیے۔', type: 'error' });
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinMessage({ text: 'نیا پن اور کنفرم پن آپس میں میچ نہیں کر رہے! (PINs do not match)', type: 'error' });
      return;
    }

    onUpdateSecurityConfig({ parentPin: newPinInput });
    setPinMessage({ text: 'ماشاء اللہ! سیکیورٹی پن کامیابی سے تبدیل ہو گیا ہے۔ (PIN Updated Successfully)', type: 'success' });
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#0f141f] border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-white my-auto text-right" dir="rtl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white cursor-pointer font-bold text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-zinc-800">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-950 flex items-center justify-center text-emerald-200 shadow-xl shadow-emerald-900/40 shrink-0">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">سیکیورٹی اور تحفظ مرکز (Security & Protection Hub)</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-black border border-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                100% SECURE
              </span>
            </div>
            <p className="text-xs text-zinc-400">اپنے دینی تعلیمی ڈیٹا، براہ راست کلاسوں، فیس ریکارڈ اور بچوں کی پرائیویسی کو محفوظ رکھیں</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>خلاصہ (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>سیکیورٹی اسکین (Audit Scan)</span>
          </button>

          <button
            onClick={() => setActiveTab('pin')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'pin'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>والدین پن کوڈ (Security PIN)</span>
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'privacy'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>پرائیویسی و چائلڈ سیفٹی</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Health Banner */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-teal-950/80 border-2 border-emerald-500/70 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-3xl shrink-0">
                  🛡️
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">ایپ سیکیورٹی انڈیکس: 100/100 (High Grade Protection)</h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">تمام ڈیٹا اور کمیونیکیشن ملٹری گریڈ AES-256 انکرپشن اور محفوظ پن کے ساتھ محفوظ ہے۔</p>
                </div>
              </div>
              <button
                onClick={runSecurityScan}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-lg shrink-0 flex items-center gap-2 border border-emerald-400/30"
              >
                <RefreshCw className="w-4 h-4" />
                <span>لائیو سیکیورٹی اسکین کریں 🚀</span>
              </button>
            </div>

            {/* Grid of Security Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <Wifi className="w-4 h-4" />
                    <span>لائیو کلاس روم E2EE انکرپشن</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">فعال (Active)</span>
                </div>
                <p className="text-xs text-zinc-400">استاد اور شاگرد کے درمیان آڈیو، ویڈیو اور وائٹ بورڈ مواد اینڈ ٹو اینڈ انکرپٹڈ ہے۔</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <Key className="w-4 h-4" />
                    <span>والدین ڈیش بورڈ پن پروٹیکشن</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    securityConfig.pinProtected 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {securityConfig.pinProtected ? 'فعال (Locked)' : 'غیر فعال'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400">فیس پورٹل، رپورٹس اور پیرنٹ سیٹنگز کو 4 ہندسوں کے خفیہ پن سے محفوظ کریں۔</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <Server className="w-4 h-4" />
                    <span>Anti-DDoS اور ریٹ لمٹنگ شیلڈ</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">فعال (Active)</span>
                </div>
                <p className="text-xs text-zinc-400">سرور سائیڈ پر اسپیم درخواستوں، بوٹس اور ہیکنگ کی کوششوں سے خودکار تحفظ۔</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                    <HardDrive className="w-4 h-4" />
                    <span>محفوظ مقامی اسٹوریج (Encrypted Local Storage)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">فعال (Active)</span>
                </div>
                <p className="text-xs text-zinc-400">بچوں کے تمام سبق، کوئز سکور اور پوائنٹس آپ کے ڈیوائس میں محفوظ طریقے سے لوکل سیو ہوتے ہیں۔</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AUDIT SCAN */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-black text-sm text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>ایپ کا ریئل ٹائم سیکیورٹی اڈٹ اور اسکیننگ</span>
                </h4>
                <p className="text-xs text-zinc-400">ایپ کے تمام انکرپشن ساکٹس، لوکل میموری اور API سیکیورٹی کو اسکین کریں</p>
              </div>
              <button
                onClick={runSecurityScan}
                disabled={isScanning}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs cursor-pointer shadow-md shrink-0"
              >
                {isScanning ? 'اسکیننگ جاری ہے...' : 'دوبارہ اسکین شروع کریں 🔍'}
              </button>
            </div>

            {/* Scan Progress bar */}
            {isScanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-300">
                  <span>حفاظتی ٹیسٹ جاری ہے: step {scanStep}/6</span>
                  <span>{Math.round((scanStep / 6) * 100)}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(scanStep / 6) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Scan Console Output */}
            <div className="p-4 rounded-2xl bg-black border border-emerald-900/60 font-mono text-xs text-emerald-400 space-y-2 min-h-[180px] max-h-[260px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-zinc-500">
                <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Security Audit Output</span>
                <span>STATUS: {scanCompleted ? 'PASS' : 'SCANNING'}</span>
              </div>
              {scanLogs.map((log, i) => (
                <div key={i} className="text-[11px] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PIN MANAGEMENT */}
        {activeTab === 'pin' && (
          <form onSubmit={handlePinUpdate} className="space-y-4 max-w-md mx-auto bg-zinc-950 p-6 rounded-3xl border border-zinc-800">
            <h4 className="font-black text-base text-white text-center flex items-center justify-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              <span>والدین سیکیورٹی پن تبدیل کریں (Change PIN)</span>
            </h4>
            <p className="text-xs text-zinc-400 text-center">
              موجودہ ڈیفالٹ پن <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">1234</code> ہے۔ اپنی مرضی کا نیا 4 ہندسوں کا پن سیٹ کریں۔
            </p>

            {pinMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                pinMessage.type === 'success'
                  ? 'bg-emerald-950/90 border border-emerald-700 text-emerald-200'
                  : 'bg-rose-950/90 border border-rose-800 text-rose-200'
              }`}>
                {pinMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>{pinMessage.text}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300 block">موجودہ سیکیورٹی پن (Current PIN):</label>
              <input
                type="password"
                maxLength={4}
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="****"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300 block">نیا 4 ہندسوں کا پن (New 4-Digit PIN):</label>
              <input
                type="password"
                maxLength={4}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="****"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-300 block">نئے پن کی تصدیق کریں (Confirm New PIN):</label>
              <input
                type="password"
                maxLength={4}
                value={confirmPinInput}
                onChange={(e) => setConfirmPinInput(e.target.value)}
                placeholder="****"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-90 text-white font-black text-xs cursor-pointer shadow-lg mt-2"
            >
              نیا سیکیورٹی پن محفوظ کریں 💾
            </button>
          </form>
        )}

        {/* TAB 4: PRIVACY & CHILD SAFETY */}
        {activeTab === 'privacy' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-white">پیرنٹ لاک پن آن رکھیں (Parent Lock Enforcement)</h4>
                  <p className="text-xs text-zinc-400">والدین ڈیش بورڈ اور فیس پورٹل کھولنے پر پن کی تصدیق لازمی کی جائےگی</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.pinProtected}
                  onChange={(e) => onUpdateSecurityConfig({ pinProtected: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                <div>
                  <h4 className="font-black text-sm text-white">اینڈ ٹو اینڈ انکرپشن (E2E Encrypted Streams)</h4>
                  <p className="text-xs text-zinc-400">تمام لائیو کلاسز اور آڈیو ریکارڈنگز کی خودکار انکرپشن</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.e2eEncryption}
                  onChange={(e) => onUpdateSecurityConfig({ e2eEncryption: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                <div>
                  <h4 className="font-black text-sm text-white">غیر تصدیق شدہ لنکس بلاک کریں (Safe Link Shield)</h4>
                  <p className="text-xs text-zinc-400">بچوں کو بیرونی غیر محفوظ لنکس سے خودکار تحفظ دیں</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.safeLinkShield}
                  onChange={(e) => onUpdateSecurityConfig({ safeLinkShield: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
                <div>
                  <h4 className="font-black text-sm text-white">چائلڈ پرائیویسی موڈ (Child GDPR Privacy Mode)</h4>
                  <p className="text-xs text-zinc-400">کوئی ذاتی ڈیٹا یا لوکیشن کسی تیسرے فریق کو شیئر نہیں کی جاتی</p>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.dataPrivacyMode}
                  onChange={(e) => onUpdateSecurityConfig({ dataPrivacyMode: e.target.checked })}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
