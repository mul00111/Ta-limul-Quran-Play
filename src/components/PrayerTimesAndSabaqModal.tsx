import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Clock, Bell, MapPin, Compass, Volume2, VolumeX, CheckCircle, 
  Sparkles, Calendar, Share2, Check, RefreshCw, Sun, Moon, Sunrise, Sunset, Award
} from 'lucide-react';
import { 
  calculatePrayerTimes, 
  getHijriDate, 
  getCurrentAndNextPrayer, 
  POPULAR_CITIES, 
  CityPreset, 
  getSavedPrayerLocation, 
  savePrayerLocation, 
  getSavedSabaqReminder, 
  saveSabaqReminder, 
  SabaqReminderConfig, 
  requestNotificationPermission, 
  triggerSabaqNotification,
  PrayerTimes
} from '../utils/prayerTimesService';

interface PrayerTimesAndSabaqModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onAddCoins?: (amount: number) => void;
}

export const PrayerTimesAndSabaqModal: React.FC<PrayerTimesAndSabaqModalProps> = ({
  isOpen = true,
  onClose,
  onAddCoins
}) => {
  const [selectedCity, setSelectedCity] = useState<CityPreset>(() => getSavedPrayerLocation());
  const [isHanafi, setIsHanafi] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [sabaqConfig, setSabaqConfig] = useState<SabaqReminderConfig>(() => getSavedSabaqReminder());
  const [isPlayingAdhan, setIsPlayingAdhan] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'prayers' | 'sabaq_reminder'>('prayers');
  const [todayCompleted, setTodayCompleted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const todayStr = new Date().toISOString().split('T')[0];
    return localStorage.getItem('tqp_sabaq_completed_date') === todayStr;
  });

  // Keep current time updated every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hijri = useMemo(() => getHijriDate(currentTime), [currentTime]);

  const prayerTimes: PrayerTimes = useMemo(() => {
    return calculatePrayerTimes(
      currentTime,
      selectedCity.lat,
      selectedCity.lng,
      selectedCity.timezone,
      isHanafi
    );
  }, [currentTime, selectedCity, isHanafi]);

  const { currentPrayer, nextPrayer } = useMemo(() => {
    return getCurrentAndNextPrayer(prayerTimes, currentTime);
  }, [prayerTimes, currentTime]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCityChange = (cityName: string) => {
    const found = POPULAR_CITIES.find(c => c.nameEn === cityName);
    if (found) {
      setSelectedCity(found);
      savePrayerLocation(found);
      showToast(`مقام تبدیل ہو گیا: ${found.nameUrdu}`);
    }
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      showToast('آپ کے براؤزر میں GPS لوکیشن دستیاب نہیں ہے۔');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const custom: CityPreset = {
          nameUrdu: 'میرا موجودہ مقام (GPS)',
          nameEn: 'Current Location',
          country: 'مقامی',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timezone: -new Date().getTimezoneOffset() / 60
        };
        setSelectedCity(custom);
        savePrayerLocation(custom);
        showToast('📍 موجودہ مقام سے اوقاتِ نماز سیٹ ہو گئے!');
      },
      (err) => {
        setIsLocating(false);
        showToast('لوکیشن کی اجازت نہیں ملی۔ فہرست میں سے شہر منتخب کریں۔');
      },
      { timeout: 10000 }
    );
  };

  const handleToggleSabaq = async () => {
    const updated = { ...sabaqConfig, enabled: !sabaqConfig.enabled };
    setSabaqConfig(updated);
    saveSabaqReminder(updated);

    if (updated.enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        showToast('🔔 روزانہ سبق کی یاد دہانی فعال ہو گئی!');
      } else {
        showToast('🔔 یاد دہانی محفوظ، براؤزر نوٹیفکیشن فعال کرنے کے لیے اجازت دیں۔');
      }
    } else {
      showToast('یاد دہانی بند کر دی گئی۔');
    }
  };

  const handleSaveReminderTime = (time: string) => {
    const updated = { ...sabaqConfig, reminderTime: time };
    setSabaqConfig(updated);
    saveSabaqReminder(updated);
    showToast(`یاد دہانی کا وقت محفوظ ہو گیا: ${time}`);
  };

  const handleSendTestNotification = async () => {
    const granted = await requestNotificationPermission();
    triggerSabaqNotification(
      '🕌 جامعۃ تعلیم القرآن - روزانہ سبق یاد دہانی',
      sabaqConfig.message || 'ماشاء اللہ! آج کا سبق اور قرآن پاک کی تلاوت دہرانے کا وقت ہو گیا ہے۔'
    );
    showToast('📢 نوٹیفکیشن ٹیسٹ بھیج دیا گیا ہے!');
  };

  const handleMarkSabaqDone = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    localStorage.setItem('tqp_sabaq_completed_date', todayStr);
    setTodayCompleted(true);
    const updatedConfig = {
      ...sabaqConfig,
      lastCompletedDate: todayStr,
      streakCount: (sabaqConfig.streakCount || 0) + 1
    };
    setSabaqConfig(updatedConfig);
    saveSabaqReminder(updatedConfig);

    if (onAddCoins) {
      onAddCoins(25);
    }
    showToast('🎉 ماشاء اللہ! آج کا سبق مکمل کرنے پر +25 سکے اور اسٹریک حاصل ہوئی!');
  };

  const handleShareSabaqWhatsApp = () => {
    const text = `*🕌 جامعۃ تعلیم القرآن آن لائن - روزانہ سبق یاد دہانی*\n\n` +
      `السلام علیکم ورحمۃ اللہ وبرکاتہ!\n` +
      `آج کا سبق اور تجوید دہرانے کا وقت ہو گیا ہے۔\n` +
      `📌 *آج کے اوقاتِ نماز (${selectedCity.nameUrdu}):*\n` +
      `• فجر: ${prayerTimes.fajr}\n` +
      `• ظہر: ${prayerTimes.dhuhr}\n` +
      `• عصر: ${prayerTimes.asr}\n` +
      `• مغرب: ${prayerTimes.maghrib}\n` +
      `• عشاء: ${prayerTimes.isha}\n\n` +
      `📖 _"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"_\n` +
      `آئیں وقت نکال کر قرآن پاک کی تلاوت فرمائیں۔\n` +
      `ادارہ جامعۃ تعلیم القرآن آن لائن`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleToggleAdhan = () => {
    setIsPlayingAdhan(!isPlayingAdhan);
    if (!isPlayingAdhan) {
      showToast('🔊 اذان کی پرسکون آواز سنیں');
    }
  };

  const prayersList = [
    { key: 'fajr', nameUrdu: 'فجر', nameEn: 'Fajr', time: prayerTimes.fajr, icon: Moon, desc: 'صبح صادق سے طلوع آفتاب تک' },
    { key: 'sunrise', nameUrdu: 'طلوع آفتاب', nameEn: 'Sunrise', time: prayerTimes.sunrise, icon: Sunrise, desc: 'اشراق کا آغاز' },
    { key: 'dhuhr', nameUrdu: 'ظہر', nameEn: 'Dhuhr', time: prayerTimes.dhuhr, icon: Sun, desc: 'زوال آفتاب کے بعد' },
    { key: 'asr', nameUrdu: 'عصر', nameEn: 'Asr', time: prayerTimes.asr, icon: Sun, desc: isHanafi ? 'حنفی (دو مثل)' : 'شافعی (ایک مثل)' },
    { key: 'maghrib', nameUrdu: 'مغرب', nameEn: 'Maghrib', time: prayerTimes.maghrib, icon: Sunset, desc: 'غروب آفتاب / افطار' },
    { key: 'isha', nameUrdu: 'عشاء', nameEn: 'Isha', time: prayerTimes.isha, icon: Moon, desc: 'شفق احمر کے بعد تا نصف شب' },
  ];

  const formatMinutesLeft = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} منٹ`;
    return `${h} گھنٹہ ${m > 0 ? `${m} منٹ` : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 border border-emerald-500/30 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto text-right text-white relative">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-emerald-400/50 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>🕌 اوقاتِ نماز و روزانہ سبق یاد دہانی</span>
              </h2>
              <p className="text-[11px] text-emerald-400 font-medium">
                {hijri.formatted} • {currentTime.toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 gap-1.5 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('prayers')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'prayers'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>اوقاتِ نماز (Prayer Times)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sabaq_reminder')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'sabaq_reminder'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>سبق یاد دہانی (Sabaq Reminder)</span>
            {sabaqConfig.enabled && (
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            )}
          </button>
        </div>

        {activeSubTab === 'prayers' && (
          <div className="space-y-4">
            
            {/* Location & Method Controls */}
            <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-400 font-bold">شہر / مقام:</span>
                <select
                  value={selectedCity.nameEn}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="bg-zinc-950 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 flex-1"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.nameEn} value={c.nameEn}>
                      {c.nameUrdu} ({c.nameEn}) - {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGPSDetect}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 border border-zinc-700 transition-all cursor-pointer disabled:opacity-50"
                  title="خودکار GPS مقام تلاش کریں"
                >
                  <Compass className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>GPS لوکیشن</span>
                </button>

                <button
                  onClick={() => {
                    setIsHanafi(!isHanafi);
                    showToast(`مسلک فقہ: ${!isHanafi ? 'حنفی (Hanafi)' : 'شافعی/جمہور (Shafi)'}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isHanafi
                      ? 'bg-emerald-900/40 text-emerald-300 border-emerald-600/50'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                  title="عصر کا وقت حنفی یا شافعی"
                >
                  {isHanafi ? 'عصر: حنفی' : 'عصر: شافعی'}
                </button>
              </div>
            </div>

            {/* Current & Next Prayer Active Banner */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-zinc-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="space-y-1 text-center sm:text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>موجودہ وقت: نمازِ {currentPrayer.nameUrdu} ({currentPrayer.time})</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white pt-1">
                    اگلی نماز: <span className="text-amber-400">{nextPrayer.nameUrdu}</span> ({nextPrayer.time})
                  </h3>
                  <p className="text-xs text-zinc-300 font-medium">
                    باقی وقت: <strong className="text-emerald-300 text-sm font-mono">{formatMinutesLeft(nextPrayer.minutesLeft)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleAdhan}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>اذان سنیں</span>
                  </button>
                  <button
                    onClick={handleShareSabaqWhatsApp}
                    className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 rounded-2xl border border-zinc-700 transition-all cursor-pointer"
                    title="اوقات نماز واٹس ایپ پر شیئر کریں"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

            {/* Prayers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {prayersList.map((p) => {
                const isCurrent = currentPrayer.key === p.key;
                const isNext = nextPrayer.key === p.key;
                const Icon = p.icon;

                return (
                  <div 
                    key={p.key}
                    className={`p-3.5 rounded-2xl border transition-all space-y-1 relative ${
                      isCurrent 
                        ? 'bg-emerald-950/60 border-emerald-400/80 shadow-lg shadow-emerald-950/50' 
                        : isNext 
                          ? 'bg-amber-950/30 border-amber-500/50' 
                          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2 left-2 text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                        جاری
                      </span>
                    )}
                    {isNext && (
                      <span className="absolute top-2 left-2 text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        اگلی
                      </span>
                    )}

                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isCurrent ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-white">{p.nameUrdu}</div>
                        <div className="text-[10px] text-zinc-400">{p.nameEn}</div>
                      </div>
                    </div>

                    <div className="text-base font-black text-emerald-400 font-mono pt-1" dir="ltr">
                      {p.time}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {p.desc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Extra Islamic Timings (Tahajjud, Sehri, Iftar) */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 text-center text-xs">
              <div className="p-2 bg-zinc-900/60 rounded-xl">
                <span className="text-[10px] text-zinc-400 block">🌙 تہجد کا وقت</span>
                <strong className="text-white text-xs font-mono" dir="ltr">{prayerTimes.tahajjud}</strong>
              </div>
              <div className="p-2 bg-zinc-900/60 rounded-xl">
                <span className="text-[10px] text-zinc-400 block">🥣 اختتامِ سحری</span>
                <strong className="text-amber-300 text-xs font-mono" dir="ltr">{prayerTimes.sehriEnd}</strong>
              </div>
              <div className="p-2 bg-zinc-900/60 rounded-xl">
                <span className="text-[10px] text-zinc-400 block">🍇 افطار / مغرب</span>
                <strong className="text-emerald-300 text-xs font-mono" dir="ltr">{prayerTimes.iftar}</strong>
              </div>
            </div>

          </div>
        )}

        {activeSubTab === 'sabaq_reminder' && (
          <div className="space-y-4">
            
            {/* Daily Sabaq Reminder Configuration Card */}
            <div className="bg-gradient-to-r from-purple-950/60 via-pink-950/40 to-zinc-900 border border-purple-500/40 rounded-3xl p-5 space-y-4 shadow-xl">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-pink-400" />
                    <span>روزانہ تلاوت و سبق دہرانے کی یاد دہانی</span>
                  </h3>
                  <p className="text-xs text-purple-300">
                    طلبہ کو روزانہ مقررہ وقت پر قرآن پاک اور نورانی قاعدہ یاد کرانے کا الرٹ
                  </p>
                </div>

                <button
                  onClick={handleToggleSabaq}
                  className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                    sabaqConfig.enabled ? 'bg-pink-600' : 'bg-zinc-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform absolute top-1 ${
                    sabaqConfig.enabled ? 'left-1' : 'right-1'
                  }`} />
                </button>
              </div>

              {sabaqConfig.enabled && (
                <div className="space-y-3 pt-2 border-t border-purple-500/20 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-300 font-bold mb-1.5">
                        روزانہ الارم کا وقت مقرر کریں:
                      </label>
                      <input
                        type="time"
                        value={sabaqConfig.reminderTime}
                        onChange={(e) => handleSaveReminderTime(e.target.value)}
                        className="w-full bg-zinc-950 border border-purple-500/40 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-pink-500 text-center text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-bold mb-1.5">
                        نماز کے بعد کا وقت (فوری انتخاب):
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => handleSaveReminderTime('06:30')}
                          className="p-2 bg-zinc-950 hover:bg-purple-900/40 border border-zinc-800 rounded-xl text-[11px] font-bold text-zinc-300 text-center"
                        >
                          🌅 بعد فجر (06:30 AM)
                        </button>
                        <button
                          onClick={() => handleSaveReminderTime('17:15')}
                          className="p-2 bg-zinc-950 hover:bg-purple-900/40 border border-zinc-800 rounded-xl text-[11px] font-bold text-zinc-300 text-center"
                        >
                          🌇 بعد عصر (05:15 PM)
                        </button>
                        <button
                          onClick={() => handleSaveReminderTime('19:30')}
                          className="p-2 bg-zinc-950 hover:bg-purple-900/40 border border-zinc-800 rounded-xl text-[11px] font-bold text-zinc-300 text-center"
                        >
                          🌆 بعد مغرب (07:30 PM)
                        </button>
                        <button
                          onClick={() => handleSaveReminderTime('21:00')}
                          className="p-2 bg-zinc-950 hover:bg-purple-900/40 border border-zinc-800 rounded-xl text-[11px] font-bold text-zinc-300 text-center"
                        >
                          🌙 بعد عشاء (09:00 PM)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">
                      یاد دہانی کا پیغام (Reminder Message):
                    </label>
                    <input
                      type="text"
                      value={sabaqConfig.message}
                      onChange={(e) => {
                        const updated = { ...sabaqConfig, message: e.target.value };
                        setSabaqConfig(updated);
                        saveSabaqReminder(updated);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={handleSendTestNotification}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>ٹیسٹ نوٹیفکیشن بھیجیں</span>
                    </button>
                    <button
                      onClick={handleShareSabaqWhatsApp}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>واٹس ایپ پر سبق یاد دہانی بھیجیں</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Today's Sabaq Completion Action */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-black text-white">آج کا سبق اور تلاوت ٹریکر</span>
                </div>
                <p className="text-xs text-zinc-400">
                  مسلسل اسٹریک: <strong className="text-amber-400 font-mono">{sabaqConfig.streakCount || 0} دن</strong>
                </p>
              </div>

              <button
                onClick={handleMarkSabaqDone}
                disabled={todayCompleted}
                className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  todayCompleted
                    ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/50 cursor-default'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg active:scale-95'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{todayCompleted ? 'آج کا سبق مکمل ✅' : 'آج کا سبق یاد ہو گیا (+25 سکے)'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>جامعۃ تعلیم القرآن آن لائن • اوقاتِ نماز و یاد دہانی</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            بند کریں
          </button>
        </div>

      </div>
    </div>
  );
};
