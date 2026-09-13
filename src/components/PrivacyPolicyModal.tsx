import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  FileText, 
  UserCheck, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Camera, 
  Mic, 
  AlertTriangle 
} from 'lucide-react';
import { LanguageCode } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: LanguageCode;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'family' | 'permissions' | 'data_deletion'>('policy');
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleClearLocalUserData = () => {
    try {
      localStorage.clear();
      setDeletedSuccess(true);
      setTimeout(() => {
        setDeletedSuccess(false);
        setDeleteConfirmation(false);
        window.location.reload();
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-right font-urdu" dir="rtl">
      <div className="bg-[#121824] border-2 border-emerald-500/60 rounded-3xl max-w-2xl w-full p-5 sm:p-7 text-white shadow-2xl relative my-auto overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-800 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white">پرائیویسی پالیسی اور شرائط و ضوابط</h2>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Play Store Compliant
              </span>
            </div>
            <p className="text-xs text-zinc-400">Google Play Family & COPPA Policy 2026</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5 mb-5 bg-zinc-900/80 p-1.5 rounded-2xl border border-zinc-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('policy')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'policy' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📜 پرائیویسی پالیسی
          </button>
          <button
            onClick={() => setActiveTab('family')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'family' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            👶 چائلڈ و فیملی سیفٹی
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'permissions' ? 'bg-emerald-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🔐 پرمیشنز کی تفصیل
          </button>
          <button
            onClick={() => setActiveTab('data_deletion')}
            className={`flex-1 min-w-[100px] py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'data_deletion' ? 'bg-rose-700 text-white shadow' : 'text-zinc-400 hover:text-rose-300'
            }`}
          >
            🗑️ ڈیٹا ڈیلیٹ / ری سیٹ
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 text-xs sm:text-sm text-zinc-300 leading-relaxed custom-scrollbar">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'policy' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>1. تعارف اور بنیادی مقصد (Our Commitment)</span>
                </h4>
                <p>
                  <strong>تعلیم القرآن پلے (Ta'limul Quran Play)</strong> ایک خالص اسلامی و قرآنی تعلیمی ایپلی کیشن ہے جو بچوں، طلباء، اساتذہ اور والدین کے لیے تجوید، مسنون دعائیں اور آن لائن مدرسہ کی سہولت فراہم کرتی ہے۔ ہم اپنے صارفین کی پرائیویسی کا مکمل احترام کرتے ہیں۔
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                  <span>2. ڈیٹا کا عدم فروخت (Zero Data Selling)</span>
                </h4>
                <p>
                  ہم صارف کا کوئی بھی ذاتی ڈیٹا، نام، فون نمبر یا کوئز ریکارڈ کسی تیسرے فریق، تشہیری نیٹ ورک یا مارکیٹنگ کمپنی کو نہ فروخت کرتے ہیں اور نہ ہی شیئر کرتے ہیں۔
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>3. اینڈ ٹو اینڈ سیکیورٹی اور انکرپشن</span>
                </h4>
                <p>
                  لائیو 1-on-1 کلاس روم میں آڈیو اور ویڈیو ڈیٹا WebRTC اور محفوظ انکرپٹڈ ساکٹس کے ذریعے براہ راست دونوں ڈیوائسز کے درمیان منتقل ہوتا ہے اور کسی سرور پر مستقل محفوظ نہیں کیا جاتا۔
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: FAMILY & COPPA */}
          {activeTab === 'family' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2">
                <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Google Play Family Policy & COPPA Compliance</span>
                </h4>
                <p>
                  ہم Google Play کی <strong>Families Policy</strong> اور بین الاقوامی چائلڈ آن لائن پرائیویسی پروٹیکشن ایکٹ (COPPA) کی مکمل پابندی کرتے ہیں:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-zinc-300 pr-2">
                  <li>ایپ میں کوئی نامناسب، غیر اخلاقی یا فریقِ ثالث کے اشتہارات (Third-Party Ads) شامل نہیں ہیں۔</li>
                  <li>بچوں کے ایڈورٹائزنگ آئی ڈی (AAID) یا لوکیشن ٹریکنگ کا کوئی استعمال نہیں ہوتا۔</li>
                  <li>والدین کنٹرولز (Parental Controls) کے لیے 4 ہندسوں کا پن تحفظ فراہم کیا گیا ہے۔</li>
                  <li>ایپ کا مواد معتبر علمائے کرام کی تصدیق شدہ نورانی قاعدہ و قرآنی تجوید پر مبنی ہے۔</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: PERMISSIONS TRANSPARENCY */}
          {activeTab === 'permissions' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-900/40 text-blue-400 mt-1">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">کیمرہ (CAMERA)</h4>
                  <p className="text-zinc-400 mt-0.5">
                    صرف لائیو ون ٹو ون کلاس روم میں استاد اور طالب علم کے براہ راست سبق سنانے کے لیے اختیاری طور پر استعمال ہوتا ہے۔ اسے صارف کسی بھی وقت بند کر سکتا ہے۔
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-900/40 text-emerald-400 mt-1">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">مائیکروفون (RECORD_AUDIO)</h4>
                  <p className="text-zinc-400 mt-0.5">
                    لائیو کلاس اور AI استاد میں تلاوت و مخارج کی صوتی مشق کے لیے استعمال ہوتا ہے۔ پس منظر میں کوئی ریکارڈنگ محفوظ نہیں کی جاتی۔
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-900/40 text-purple-400 mt-1">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">انٹرنیٹ اور نیٹ ورک (INTERNET)</h4>
                  <p className="text-zinc-400 mt-0.5">
                    لائیو کلاس کنکشن، قرآنی آڈیو تلاوت اور آن لائن کلاس روم ڈیٹا سنکرونائزیشن کے لیے ضروری ہے۔
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DATA DELETION & RESET */}
          {activeTab === 'data_deletion' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-3">
                <h4 className="font-bold text-rose-300 text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>صارف ڈیٹا ڈیلیشن کا حق (User Data Deletion Right)</span>
                </h4>
                <p>
                  Google Play کے قوانین کے تحت آپ اپنے ڈیوائس پر موجود تمام لوکل پروگریس، فیس ریکارڈ، طلباء و اساتذہ لسٹ اور سیٹنگز کو ایک کلک میں ڈیلیٹ کر سکتے ہیں۔
                </p>

                {deletedSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-900/80 border border-emerald-600 text-emerald-200 text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>تمام ڈیٹا کامیابی سے ڈیلیٹ ہو گیا ہے! ایپ ریفریش ہو رہی ہے...</span>
                  </div>
                ) : deleteConfirmation ? (
                  <div className="p-3 rounded-xl bg-black/60 border border-rose-700 space-y-2">
                    <p className="text-rose-300 font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>کیا آپ واقعی تمام لوکل ڈیٹا صاف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا۔</span>
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleClearLocalUserData}
                        className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow"
                      >
                        ہاں، ڈیلیٹ کریں
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(false)}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                      >
                        منسوخ کریں
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmation(true)}
                    className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>میرا ڈیٹا اور پروگریس صاف کریں (Reset App Data)</span>
                  </button>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>پرائیویسی یا ڈیٹا سپورٹ:</span>
                </span>
                <strong className="text-white font-mono">support@talimulquranplay.app</strong>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            © 2026 Ta'limul Quran Play • Official App
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            سمجھ گیا (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
