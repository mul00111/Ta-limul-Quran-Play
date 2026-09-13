/**
 * Prayer Times & Daily Sabaq Reminder Calculation Service
 * Highly accurate astronomical calculation for Islamic prayer times (Fajr, Sunrise, Dhuhr, Asr Hanafi/Shafi, Maghrib, Isha, Tahajjud)
 * Includes Hijri Date calculation, notification handling, and cities presets.
 */

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud: string;
  sehriEnd: string;
  iftar: string;
}

export interface CityPreset {
  nameUrdu: string;
  nameEn: string;
  country: string;
  lat: number;
  lng: number;
  timezone: number; // offset in hours
}

export const POPULAR_CITIES: CityPreset[] = [
  { nameUrdu: "کراچی", nameEn: "Karachi", country: "پاکستان", lat: 24.8607, lng: 67.0011, timezone: 5 },
  { nameUrdu: "لاہور", nameEn: "Lahore", country: "پاکستان", lat: 31.5204, lng: 74.3587, timezone: 5 },
  { nameUrdu: "اسلام آباد / راولپنڈی", nameEn: "Islamabad / Rawalpindi", country: "پاکستان", lat: 33.6844, lng: 73.0479, timezone: 5 },
  { nameUrdu: "فیصل آباد", nameEn: "Faisalabad", country: "پاکستان", lat: 31.4504, lng: 73.1350, timezone: 5 },
  { nameUrdu: "ملتان", nameEn: "Multan", country: "پاکستان", lat: 30.1575, lng: 71.5249, timezone: 5 },
  { nameUrdu: "پشاور", nameEn: "Peshawar", country: "پاکستان", lat: 34.0151, lng: 71.5249, timezone: 5 },
  { nameUrdu: "کوئٹہ", nameEn: "Quetta", country: "پاکستان", lat: 30.1798, lng: 66.9750, timezone: 5 },
  { nameUrdu: "دہلی", nameEn: "Delhi", country: "بھارت", lat: 28.6139, lng: 77.2090, timezone: 5.5 },
  { nameUrdu: "ممبئی", nameEn: "Mumbai", country: "بھارت", lat: 19.0760, lng: 72.8777, timezone: 5.5 },
  { nameUrdu: "حیدرآباد", nameEn: "Hyderabad", country: "بھارت", lat: 17.3850, lng: 78.4867, timezone: 5.5 },
  { nameUrdu: "ڈھاکہ", nameEn: "Dhaka", country: "بنگلہ دیش", lat: 23.8103, lng: 90.4125, timezone: 6 },
  { nameUrdu: "مکہ مکرمہ", nameEn: "Makkah", country: "سعودی عرب", lat: 21.3891, lng: 39.8579, timezone: 3 },
  { nameUrdu: "مدینہ منورہ", nameEn: "Madinah", country: "سعودی عرب", lat: 24.5247, lng: 39.5692, timezone: 3 },
  { nameUrdu: "دبئی", nameEn: "Dubai", country: "متحدہ عرب امارات", lat: 25.2048, lng: 55.2708, timezone: 4 },
  { nameUrdu: "لندن", nameEn: "London", country: "برطانیہ", lat: 51.5074, lng: -0.1278, timezone: 1 },
  { nameUrdu: "نیویارک", nameEn: "New York", country: "امریکا", lat: 40.7128, lng: -74.0060, timezone: -4 },
  { nameUrdu: "استنبول", nameEn: "Istanbul", country: "ترکی", lat: 41.0082, lng: 28.9784, timezone: 3 },
];

export interface SabaqReminderConfig {
  enabled: boolean;
  reminderTime: string; // e.g. "17:00"
  reminderRelativePrayer?: 'after_fajr' | 'after_asr' | 'after_maghrib' | 'after_isha' | 'custom';
  notificationSound: boolean;
  message: string;
  lastCompletedDate?: string;
  streakCount: number;
}

// Astronomical math helper functions
const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;

function getSunPosition(julianDate: number) {
  const d = julianDate - 2451545.0;
  const g = 357.529 + 0.98560028 * d;
  const q = 280.459 + 0.98564736 * d;
  const l = q + 1.915 * Math.sin(d2r(g)) + 0.020 * Math.sin(d2r(2 * g));
  const e = 23.439 - 0.00000036 * d;
  const ra = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(l)), Math.cos(d2r(l)))) / 15;
  const decl = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(l))));
  const eqt = q / 15 - (ra < 0 ? ra + 24 : ra);
  return { decl, eqt };
}

function getJulianDate(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function timeToString(hours: number): string {
  let h = (hours + 24) % 24;
  const hour = Math.floor(h);
  const mins = Math.round((h - hour) * 60);
  const correctedMins = mins === 60 ? 0 : mins;
  const correctedHour = mins === 60 ? (hour + 1) % 24 : hour;

  const displayHour = correctedHour % 12 || 12;
  const ampm = correctedHour < 12 ? 'AM' : 'PM';
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

  return `${pad(displayHour)}:${pad(correctedMins)} ${ampm}`;
}

export function calculatePrayerTimes(
  date: Date = new Date(),
  lat: number = 24.8607,
  lng: number = 67.0011,
  timezoneOffsetHours: number = 5,
  isHanafi: boolean = true,
  fajrAngle: number = 18.0,
  ishaAngle: number = 18.0
): PrayerTimes {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const { decl, eqt } = getSunPosition(jd);

  // Noon (Dhuhr)
  const dhuhrTime = 12 + timezoneOffsetHours - lng / 15 - eqt;

  // Sunrise / Sunset calculation
  const sunAngle = -0.833; // standard refraction + radius
  const cosSunrise = (Math.sin(d2r(sunAngle)) - Math.sin(d2r(lat)) * Math.sin(d2r(decl))) /
                     (Math.cos(d2r(lat)) * Math.cos(d2r(decl)));
  
  let sunriseHours = 6;
  let sunsetHours = 18;
  if (cosSunrise >= -1 && cosSunrise <= 1) {
    const sunHours = r2d(Math.acos(cosSunrise)) / 15;
    sunriseHours = dhuhrTime - sunHours;
    sunsetHours = dhuhrTime + sunHours;
  }

  // Fajr
  const cosFajr = (Math.sin(d2r(-fajrAngle)) - Math.sin(d2r(lat)) * Math.sin(d2r(decl))) /
                  (Math.cos(d2r(lat)) * Math.cos(d2r(decl)));
  let fajrHours = dhuhrTime - 1.5;
  if (cosFajr >= -1 && cosFajr <= 1) {
    fajrHours = dhuhrTime - (r2d(Math.acos(cosFajr)) / 15);
  }

  // Isha
  const cosIsha = (Math.sin(d2r(-ishaAngle)) - Math.sin(d2r(lat)) * Math.sin(d2r(decl))) /
                  (Math.cos(d2r(lat)) * Math.cos(d2r(decl)));
  let ishaHours = sunsetHours + 1.5;
  if (cosIsha >= -1 && cosIsha <= 1) {
    ishaHours = dhuhrTime + (r2d(Math.acos(cosIsha)) / 15);
  }

  // Asr (Hanafi shadow = 2, Shafi'i shadow = 1)
  const shadowFactor = isHanafi ? 2 : 1;
  const asrAngle = -r2d(Math.atan(1 / (shadowFactor + Math.tan(d2r(Math.abs(lat - decl))))));
  const cosAsr = (Math.sin(d2r(asrAngle)) - Math.sin(d2r(lat)) * Math.sin(d2r(decl))) /
                 (Math.cos(d2r(lat)) * Math.cos(d2r(decl)));
  let asrHours = dhuhrTime + 3;
  if (cosAsr >= -1 && cosAsr <= 1) {
    asrHours = dhuhrTime + (r2d(Math.acos(cosAsr)) / 15);
  }

  // Maghrib = Sunset + 2 mins safety
  const maghribHours = sunsetHours + (2 / 60);

  // Sehri End = Fajr - 10 mins
  const sehriHours = fajrHours - (10 / 60);

  // Tahajjud = Mid-night to last third of night (approx halfway between Isha and Fajr)
  const tahajjudHours = fajrHours - 1.5;

  return {
    fajr: timeToString(fajrHours),
    sunrise: timeToString(sunriseHours),
    dhuhr: timeToString(dhuhrTime),
    asr: timeToString(asrHours),
    maghrib: timeToString(maghribHours),
    isha: timeToString(ishaHours),
    tahajjud: timeToString(tahajjudHours),
    sehriEnd: timeToString(sehriHours),
    iftar: timeToString(maghribHours),
  };
}

/**
 * Approximate Islamic Hijri Date representation
 */
export function getHijriDate(date: Date = new Date()): { day: number; monthName: string; year: number; formatted: string } {
  try {
    const formatter = new Intl.DateTimeFormat('ur-PK-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1', 10);
    const month = parts.find(p => p.type === 'month')?.value || 'شوال';
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '1447', 10);
    return {
      day,
      monthName: month,
      year,
      formatted: `${day} ${month} ${year}ھ`
    };
  } catch (e) {
    return {
      day: 15,
      monthName: 'ربیع الاول',
      year: 1448,
      formatted: `15 ربیع الاول 1448ھ`
    };
  }
}

/**
 * Determine currently active prayer & next upcoming prayer
 */
export function getCurrentAndNextPrayer(
  prayerTimes: PrayerTimes,
  now: Date = new Date()
): {
  currentPrayer: { nameUrdu: string; nameEn: string; time: string; key: keyof PrayerTimes };
  nextPrayer: { nameUrdu: string; nameEn: string; time: string; key: keyof PrayerTimes; minutesLeft: number };
} {
  const parseTimeToDate = (timeStr: string) => {
    const [time, ampm] = timeStr.split(' ');
    const [hoursStr, minsStr] = time.split(':');
    let h = parseInt(hoursStr, 10);
    const m = parseInt(minsStr, 10);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const prayers: { nameUrdu: string; nameEn: string; key: keyof PrayerTimes; timeStr: string; date: Date }[] = [
    { nameUrdu: 'فجر', nameEn: 'Fajr', key: 'fajr', timeStr: prayerTimes.fajr, date: parseTimeToDate(prayerTimes.fajr) },
    { nameUrdu: 'طلوع آفتاب', nameEn: 'Sunrise', key: 'sunrise', timeStr: prayerTimes.sunrise, date: parseTimeToDate(prayerTimes.sunrise) },
    { nameUrdu: 'ظہر', nameEn: 'Dhuhr', key: 'dhuhr', timeStr: prayerTimes.dhuhr, date: parseTimeToDate(prayerTimes.dhuhr) },
    { nameUrdu: 'عصر', nameEn: 'Asr', key: 'asr', timeStr: prayerTimes.asr, date: parseTimeToDate(prayerTimes.asr) },
    { nameUrdu: 'مغرب', nameEn: 'Maghrib', key: 'maghrib', timeStr: prayerTimes.maghrib, date: parseTimeToDate(prayerTimes.maghrib) },
    { nameUrdu: 'عشاء', nameEn: 'Isha', key: 'isha', timeStr: prayerTimes.isha, date: parseTimeToDate(prayerTimes.isha) },
  ];

  const nowMs = now.getTime();
  let current = prayers[prayers.length - 1]; // default Isha/night
  let next = prayers[0]; // default next Fajr

  for (let i = 0; i < prayers.length; i++) {
    if (nowMs < prayers[i].date.getTime()) {
      next = prayers[i];
      current = i > 0 ? prayers[i - 1] : prayers[prayers.length - 1];
      break;
    }
  }

  let diffMs = next.date.getTime() - nowMs;
  if (diffMs < 0) {
    // Next day's fajr
    diffMs += 24 * 60 * 60 * 1000;
  }
  const minutesLeft = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  return {
    currentPrayer: { nameUrdu: current.nameUrdu, nameEn: current.nameEn, time: current.timeStr, key: current.key },
    nextPrayer: { nameUrdu: next.nameUrdu, nameEn: next.nameEn, time: next.timeStr, key: next.key, minutesLeft }
  };
}

/**
 * Storage helpers for Prayer config & Daily Sabaq Reminders
 */
const SABAQ_REMINDER_KEY = 'tqp_sabaq_reminder_cfg_v1';
const PRAYER_LOCATION_KEY = 'tqp_prayer_loc_v1';

export function getSavedSabaqReminder(): SabaqReminderConfig {
  if (typeof window === 'undefined') {
    return {
      enabled: true,
      reminderTime: "17:00",
      reminderRelativePrayer: 'after_asr',
      notificationSound: true,
      message: "روزانہ سبق اور تجوید دہرانے کا وقت ہو گیا ہے۔ آئیں تلاوت فرمائیں!",
      streakCount: 3
    };
  }
  try {
    const raw = localStorage.getItem(SABAQ_REMINDER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return {
    enabled: true,
    reminderTime: "17:00",
    reminderRelativePrayer: 'after_asr',
    notificationSound: true,
    message: "روزانہ سبق اور تجوید دہرانے کا وقت ہو گیا ہے۔ آئیں تلاوت فرمائیں!",
    streakCount: 3
  };
}

export function saveSabaqReminder(cfg: SabaqReminderConfig) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SABAQ_REMINDER_KEY, JSON.stringify(cfg));
    } catch (e) {}
  }
}

export function getSavedPrayerLocation(): CityPreset {
  if (typeof window === 'undefined') return POPULAR_CITIES[0];
  try {
    const raw = localStorage.getItem(PRAYER_LOCATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return POPULAR_CITIES[0]; // Default Karachi
}

export function savePrayerLocation(city: CityPreset) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRAYER_LOCATION_KEY, JSON.stringify(city));
    } catch (e) {}
  }
}

/**
 * Request Web Notification permission and trigger test notification
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  const res = await Notification.requestPermission();
  return res === 'granted';
}

export function triggerSabaqNotification(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'sabaq-daily-reminder'
      });
    } catch (e) {
      console.warn('Notification trigger error:', e);
    }
  }
}
