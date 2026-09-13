export type LanguageCode = 'en' | 'ar' | 'ur' | 'hi' | 'bn' | 'id' | 'tr' | 'fr';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  verses: {
    numberInSurah: number;
    text: string;
    translation: string;
    transliteration?: string;
  }[];
}

export interface QaidaLetter {
  id: number;
  arabic: string;
  name: string;
  transliteration: string;
  makhraj: string; // articulation point
  soundExample: string;
  description: string;
}

export interface DuaItem {
  id: string;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  benefit: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface AppSettings {
  themeColor: string; // e.g. '#C2185B' (Dark Pink)
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  arabicFont: string;
  soundEffects: boolean;
  reciter: string;
}

export interface SecurityConfig {
  pinProtected: boolean;
  parentPin: string;
  e2eEncryption: boolean;
  safeLinkShield: boolean;
  autoSessionLock: boolean;
  dataPrivacyMode: boolean;
  auditLogging: boolean;
}

export interface UserProgress {
  coins: number;
  streak: number;
  lastActiveDate: string; // ISO date string
  completedLessons: string[]; // IDs of lessons
  xp: number;
  badges: string[];
}
