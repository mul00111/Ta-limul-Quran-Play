export interface MadrasaTeacher {
  id: string;
  name: string;
  title: string; // e.g., قاری و حافظ, مفتی, استاد التجوید, معلمہ
  classesAssigned: string[]; // class IDs
  phone: string;
  email: string;
  salary: number;
  status: 'active' | 'inactive';
  timeSlot: string;
  joinDate: string;
  bio: string;
  avatarColor: string;
}

export interface MadrasaClass {
  id: string;
  name: string;
  code: string;
  category: 'qaidah' | 'nazirah' | 'hifz' | 'tajweed' | 'deeniyat';
  teacherId: string;
  timing: string;
  capacity: number;
  description: string;
  icon: string;
  color: string;
}

export interface MadrasaStudent {
  id: string;
  rollNo: string;
  name: string;
  guardianName: string;
  classId: string;
  monthlyFee: number;
  phone: string;
  admissionDate: string;
  status: 'active' | 'inactive' | 'graduated';
  age: number;
  gender: 'طالب علم' | 'طالبہ';
  currentSabaqSummary?: string;
  address?: string;
}

export interface DailyAttendanceEntry {
  studentId: string;
  status: 'present' | 'absent' | 'leave' | 'late';
  time?: string;
  note?: string;
}

export interface MadrasaAttendanceDay {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  entries: DailyAttendanceEntry[];
}

export interface MadrasaFeeRecord {
  id: string;
  studentId: string;
  month: string; // e.g., "اگست 2026"
  year: number;
  feeAmount: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Online UPI' | 'PhonePe / Paytm' | 'UPI / GPay';
  receiptNo: string;
  notes?: string;
}

export interface MadrasaSabaqRecord {
  id: string;
  studentId: string;
  classId?: string;
  teacherId: string;
  date: string;
  sabaqText?: string; // سبق
  sabaq?: string;
  sabaqGrade?: 'ممتاز (A+)' | 'عمدہ (A)' | 'تسلی بخش (B)' | 'محتاجِ محنت (C)' | string;
  sabaqiText?: string; // سبقی
  sabqi?: string;
  sabaqiGrade?: 'ممتاز (A+)' | 'عمدہ (A)' | 'تسلی بخش (B)' | 'محتاجِ محنت (C)' | string;
  manzilText?: string; // منزل
  manzil?: string;
  manzilGrade?: 'ممتاز (A+)' | 'عمدہ (A)' | 'تسلی بخش (B)' | 'محتاجِ محنت (C)' | string;
  tajweedMistakes?: number;
  pronunciationMistakes?: number;
  harakatMistakes?: number;
  sabaqMistakes?: number;
  sabqiMistakes?: number;
  grade?: string;
  teacherRemarks: string;
  status?: 'pass' | 'repeat';
  audioRecordingUrl?: string;
}

export interface ExamSubject {
  name: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface StudentExamResult {
  studentId: string;
  tilawatMarks?: number;
  hifzMarks?: number;
  tajweedMarks?: number;
  deeniyatMarks?: number;
  totalMarks: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | string;
  status: 'کامیاب (Pass)' | 'دوبارہ ٹیسٹ (Retake)' | string;
  remarks: string;
}

export interface MadrasaBankAccount {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string; // Used for IFSC or VPA or International
  branchCode?: string;
  swiftCode?: string;
  type: 'bank' | 'easypaisa' | 'jazzcash' | 'raast' | 'international' | 'upi';
  badge: string;
  icon: string;
  instructions: string;
}

export interface MadrasaDonationProject {
  id: string;
  title: string;
  urduTitle: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  category: 'sponsorship' | 'teachers' | 'ration' | 'construction' | 'quran' | 'general' | 'lillah';
  suggestedAmounts: number[];
  unitCostLabel: string;
  icon: string;
  color: string;
}

export interface MadrasaDonationRecord {
  id: string;
  receiptNo: string;
  donorName: string;
  donorPhone?: string;
  donorEmail?: string;
  donorCity?: string;
  donorCountry?: string;
  amount: number;
  currency: 'INR' | 'USD' | 'AED' | 'GBP' | 'SAR' | 'EUR';
  category: 'sponsorship' | 'teachers' | 'ration' | 'construction' | 'quran' | 'general' | 'lillah';
  categoryTitle: string;
  paymentMethod: 'UPI / Google Pay' | 'PhonePe / Paytm' | 'Bank Transfer (NEFT/IMPS)' | 'State Bank of India' | 'HDFC Bank' | 'Cash' | 'Online/Card';
  transactionRef?: string;
  date: string;
  status: 'verified' | 'pending';
  isAnonymous?: boolean;
  isMonthlyRecurring?: boolean;
  studentId?: string;
  notes?: string;
}

export interface MadrasaExam {
  id: string;
  title: string;
  term?: 'ماہانہ ٹیسٹ' | 'ششماہی امتحان' | 'سالانہ امتحان' | 'کوئز مقابلہ' | string;
  examType?: 'monthly' | 'midterm' | 'final' | 'quiz' | string;
  classId?: string;
  studentId?: string;
  date: string;
  totalMarks?: number;
  totalPossibleMarks?: number;
  obtainedMarks?: number;
  grade?: string;
  passed?: boolean;
  examinerRemarks?: string;
  subjects?: ExamSubject[];
  results?: StudentExamResult[];
}

// Initial Seed Data
export const INITIAL_CLASSES: MadrasaClass[] = [
  {
    id: 'CLS-1',
    name: 'درجہ ۱: نورانی و مدنی قاعدہ',
    code: 'QAIDAH-01',
    category: 'qaidah',
    teacherId: 'TCH-1',
    timing: 'صبح ۰۸:۰۰ تا ۰۹:۳۰',
    capacity: 25,
    description: 'ابتدائی حروف، مفردات، مرکبات، حرکات، تنوین اور سکون کی بنیادی مشق مع مخارج',
    icon: '📖',
    color: 'from-emerald-600 to-teal-800'
  },
  {
    id: 'CLS-2',
    name: 'درجہ ۲: ناظرہ قرآن مع تجوید',
    code: 'NAZIRAH-02',
    category: 'nazirah',
    teacherId: 'TCH-2',
    timing: 'صبح ۰۹:۳۰ تا ۱۱:۰۰',
    capacity: 20,
    description: 'پارہ عم تا مکمل قرآن پاک کی روانی اور احکامِ تجوید (اخفاء، ادغام، اظہار، اقلاب) کے ساتھ تلاوت',
    icon: '📜',
    color: 'from-blue-600 to-indigo-800'
  },
  {
    id: 'CLS-3',
    name: 'درجہ ۳: شعبہ حفظ القرآن الکریم',
    code: 'HIFZ-03',
    category: 'hifz',
    teacherId: 'TCH-3',
    timing: 'بعد نمازِ فجر ۰۵:۳۰ تا ۰۸:۰۰',
    capacity: 15,
    description: 'قرآن مجید کا حفظ مع سبق، سبقی، منزل اور دور کا سخت روزانہ جائزہ',
    icon: '🕋',
    color: 'from-amber-600 to-orange-800'
  },
  {
    id: 'CLS-4',
    name: 'درجہ ۴: خصوصی تجوید و قراءت',
    code: 'TAJWEED-04',
    category: 'tajweed',
    teacherId: 'TCH-4',
    timing: 'شام ۰۵:۰۰ تا ۰۶:۳۰',
    capacity: 18,
    description: 'مخارج الحروف، صفاتِ لازمہ و عارضہ، مدات اور حسنِ صوت کی اعلیٰ مشق',
    icon: '🗣️',
    color: 'from-purple-600 to-fuchsia-800'
  },
  {
    id: 'CLS-5',
    name: 'درجہ ۵: دینیات، مسنون دعائیں و فقہ',
    code: 'DEENIYAT-05',
    category: 'deeniyat',
    teacherId: 'TCH-5',
    timing: 'شام ۰۶:۳۰ تا ۰۷:۳۰',
    capacity: 30,
    description: 'مسنون دعائیں، وضو و نماز کا عملی طریقہ، بنیادی عقائد اور سیرت النبی ﷺ',
    icon: '🕌',
    color: 'from-rose-600 to-red-800'
  }
];

export const INITIAL_TEACHERS: MadrasaTeacher[] = [
  {
    id: 'TCH-1',
    name: 'قاری عبد الرحمن القادری',
    title: 'استاذ التجوید و مصدق القراءت',
    classesAssigned: ['CLS-1', 'CLS-4'],
    phone: '+92 301 2345678',
    email: 'abdurrahman@talimulquran.online',
    salary: 35000,
    status: 'active',
    timeSlot: 'صبح ۰۸:۰۰ تا ۱۲:۰۰',
    joinDate: '2023-01-15',
    bio: 'جامعہ سے فراغت، ۱۰ سالہ تدریسی تجربہ، نورانی قاعدہ اور تجویدی مخارج کے ماہر۔',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'TCH-2',
    name: 'حافظ و قاری محمد بلال',
    title: 'معلم ناظرہ و تجوید',
    classesAssigned: ['CLS-2'],
    phone: '+92 312 9876543',
    email: 'bilal@talimulquran.online',
    salary: 30000,
    status: 'active',
    timeSlot: 'صبح ۰۹:۳۰ تا ۰۱:۰۰',
    joinDate: '2023-06-01',
    bio: 'خوش الحان قاری، بچوں کی نفسیات اور آن لائن تدریس میں ماہر۔',
    avatarColor: 'bg-blue-600'
  },
  {
    id: 'TCH-3',
    name: 'شیخ الحدیث و الحفظ مفتی طارق اسلم',
    title: 'صدر شعبہ حفظ القرآن',
    classesAssigned: ['CLS-3'],
    phone: '+92 333 4567890',
    email: 'tariq@talimulquran.online',
    salary: 45000,
    status: 'active',
    timeSlot: 'فجر تا ظہر',
    joinDate: '2022-08-10',
    bio: '۲۰ سالہ تجربہ، سینکڑوں حفاظ تیار کیے، حفظ و دور کا بے مثال نظام۔',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'TCH-4',
    name: 'قاریہ عائشہ فاطمہ',
    title: 'معلمہ طالبات و تجوید',
    classesAssigned: ['CLS-4', 'CLS-5'],
    phone: '+92 321 5556677',
    email: 'ayesha@talimulquran.online',
    salary: 28000,
    status: 'active',
    timeSlot: 'شام ۰۴:۰۰ تا ۰۷:۳۰',
    joinDate: '2024-02-01',
    bio: 'طالبات کی کلاسز، مخارج اور مسنون دعاؤں کی خصوصی معلّمہ۔',
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'TCH-5',
    name: 'مولانا محمد عثمان مدنی',
    title: 'مدرس دینیات و فقہ',
    classesAssigned: ['CLS-5'],
    phone: '+92 345 8889900',
    email: 'usman@talimulquran.online',
    salary: 25000,
    status: 'active',
    timeSlot: 'شام ۰۶:۰۰ تا ۰۸:۰۰',
    joinDate: '2024-05-10',
    bio: 'درس نظامی فاضل، سیرت و مسنون دعاؤں کی دلنشین تدریس۔',
    avatarColor: 'bg-rose-600'
  }
];

export const INITIAL_STUDENTS: MadrasaStudent[] = [
  {
    id: 'STU-101',
    rollNo: 'TQ-2026-001',
    name: 'محمد علی اسلم',
    guardianName: 'محمد اسلم صاحب',
    classId: 'CLS-1',
    monthlyFee: 2000,
    phone: '+92 300 1112233',
    admissionDate: '2026-01-05',
    status: 'active',
    age: 7,
    gender: 'طالب علم',
    currentSabaqSummary: 'تختی ۵: تنوین (دو زبر، دو زیر، دو پیش)',
    address: 'لاہور، پاکستان'
  },
  {
    id: 'STU-102',
    rollNo: 'TQ-2026-002',
    name: 'فاطمہ زہرا',
    guardianName: 'زبیر احمد',
    classId: 'CLS-1',
    monthlyFee: 2000,
    phone: '+92 311 2223344',
    admissionDate: '2026-01-10',
    status: 'active',
    age: 6,
    gender: 'طالبہ',
    currentSabaqSummary: 'تختی ۴: حرکات (زبر، زیر، پیش)',
    address: 'کراچی، پاکستان'
  },
  {
    id: 'STU-103',
    rollNo: 'TQ-2026-003',
    name: 'عبد اللہ قاسم',
    guardianName: 'قاسم رضا',
    classId: 'CLS-2',
    monthlyFee: 2500,
    phone: '+92 322 3334455',
    admissionDate: '2025-08-15',
    status: 'active',
    age: 9,
    gender: 'طالب علم',
    currentSabaqSummary: 'پارہ ۳۰: سورۃ النبأ (آیت ۱ تا ۲۰)',
    address: 'اسلام آباد'
  },
  {
    id: 'STU-104',
    rollNo: 'TQ-2026-004',
    name: 'عائشہ صدیقہ',
    guardianName: 'طارق محمود',
    classId: 'CLS-2',
    monthlyFee: 2500,
    phone: '+92 333 4445566',
    admissionDate: '2025-09-01',
    status: 'active',
    age: 8,
    gender: 'طالبہ',
    currentSabaqSummary: 'پارہ ۳۰: سورۃ الفجر',
    address: 'راولپنڈی'
  },
  {
    id: 'STU-105',
    rollNo: 'TQ-2026-005',
    name: 'حافظ حذیفہ رحمن',
    guardianName: 'عبد الرحمن',
    classId: 'CLS-3',
    monthlyFee: 3000,
    phone: '+92 344 5556677',
    admissionDate: '2024-03-01',
    status: 'active',
    age: 12,
    gender: 'طالب علم',
    currentSabaqSummary: 'پارہ ۱۰: سورۃ الانفال (صفحہ ۲)',
    address: 'فیصل آباد'
  },
  {
    id: 'STU-106',
    rollNo: 'TQ-2026-006',
    name: 'ابراہیم خلیل',
    guardianName: 'خلیل احمد',
    classId: 'CLS-3',
    monthlyFee: 3000,
    phone: '+92 305 6667788',
    admissionDate: '2024-06-15',
    status: 'active',
    age: 11,
    gender: 'طالب علم',
    currentSabaqSummary: 'پارہ ۷: سورۃ المائدۃ',
    address: 'ملتان'
  },
  {
    id: 'STU-107',
    rollNo: 'TQ-2026-007',
    name: 'مریم نور',
    guardianName: 'نور محمد',
    classId: 'CLS-4',
    monthlyFee: 2200,
    phone: '+92 315 7778899',
    admissionDate: '2025-11-20',
    status: 'active',
    age: 10,
    gender: 'طالبہ',
    currentSabaqSummary: 'احکامِ مدات و قلقلہ مشق',
    address: 'پشاور'
  },
  {
    id: 'STU-108',
    rollNo: 'TQ-2026-008',
    name: 'حسن معاویہ',
    guardianName: 'معاویہ خان',
    classId: 'CLS-5',
    monthlyFee: 1800,
    phone: '+92 325 8889900',
    admissionDate: '2026-02-01',
    status: 'active',
    age: 7,
    gender: 'طالب علم',
    currentSabaqSummary: 'نماز کا مکمل ترجمہ و مسنون دعائیں',
    address: 'کوئٹہ'
  }
];

export const INITIAL_ATTENDANCE: MadrasaAttendanceDay[] = [
  {
    id: 'ATT-2026-08-16-CLS-1',
    date: '2026-08-16',
    classId: 'CLS-1',
    entries: [
      { studentId: 'STU-101', status: 'present', time: '08:02 AM' },
      { studentId: 'STU-102', status: 'present', time: '08:05 AM' }
    ]
  },
  {
    id: 'ATT-2026-08-16-CLS-2',
    date: '2026-08-16',
    classId: 'CLS-2',
    entries: [
      { studentId: 'STU-103', status: 'present', time: '09:30 AM' },
      { studentId: 'STU-104', status: 'late', time: '09:45 AM', note: 'انٹرنیٹ تعطل' }
    ]
  },
  {
    id: 'ATT-2026-08-16-CLS-3',
    date: '2026-08-16',
    classId: 'CLS-3',
    entries: [
      { studentId: 'STU-105', status: 'present', time: '05:30 AM' },
      { studentId: 'STU-106', status: 'present', time: '05:35 AM' }
    ]
  }
];

export const INITIAL_FEES: MadrasaFeeRecord[] = [];

export const INITIAL_SABAQ_LOGS: MadrasaSabaqRecord[] = [
  {
    id: 'SBQ-1',
    studentId: 'STU-101',
    classId: 'CLS-1',
    teacherId: 'TCH-1',
    date: '2026-08-16',
    sabaqText: 'تختی ۵: تنوین (دو زبر و دو زیر)',
    sabaqGrade: 'عمدہ (A)',
    sabaqiText: 'تختی ۴: حرکات کی روانی',
    sabaqiGrade: 'ممتاز (A+)',
    manzilText: 'تختی ۱ تا ۳ مکمل اعادہ',
    manzilGrade: 'عمدہ (A)',
    tajweedMistakes: 1,
    pronunciationMistakes: 0,
    harakatMistakes: 1,
    teacherRemarks: 'ماشاء اللہ بہت عمدہ پڑھا۔ غنہ کی ادائیگی پر مزید توجہ دیں۔',
    status: 'pass'
  },
  {
    id: 'SBQ-2',
    studentId: 'STU-103',
    classId: 'CLS-2',
    teacherId: 'TCH-2',
    date: '2026-08-16',
    sabaqText: 'سورۃ النبأ آیات ۱ تا ۲۰',
    sabaqGrade: 'ممتاز (A+)',
    sabaqiText: 'سورۃ المرسلات مکمل',
    sabaqiGrade: 'عمدہ (A)',
    manzilText: 'پارہ ۲۹: نصف اخیرہ',
    manzilGrade: 'ممتاز (A+)',
    tajweedMistakes: 0,
    pronunciationMistakes: 0,
    harakatMistakes: 0,
    teacherRemarks: 'بہترین تلاوت، مخارج اور اخفاء بالکل درست تھا۔ بارک اللہ فی علمک!',
    status: 'pass'
  },
  {
    id: 'SBQ-3',
    studentId: 'STU-105',
    classId: 'CLS-3',
    teacherId: 'TCH-3',
    date: '2026-08-16',
    sabaqText: 'پارہ ۱۰: سورۃ الانفال ۱ تا ۲ رکوع',
    sabaqGrade: 'عمدہ (A)',
    sabaqiText: 'پارہ ۹: مکمل',
    sabaqiGrade: 'تسلی بخش (B)',
    manzilText: 'پارہ ۱ تا ۳',
    manzilGrade: 'عمدہ (A)',
    tajweedMistakes: 1,
    pronunciationMistakes: 1,
    harakatMistakes: 1,
    teacherRemarks: 'سبق اچھا تھا، لیکن پارہ ۹ کی سبقی میں ۲ جگہ اٹکے۔ پکا یاد کریں۔',
    status: 'pass'
  }
];

export const INITIAL_EXAMS: MadrasaExam[] = [
  {
    id: 'EXM-1',
    title: 'ششماہی جائزہ و تجوید امتحان 2026',
    term: 'ششماہی امتحان',
    classId: 'CLS-1',
    date: '2026-08-10',
    totalPossibleMarks: 100,
    results: [
      {
        studentId: 'STU-101',
        tilawatMarks: 24,
        hifzMarks: 23,
        tajweedMarks: 24,
        deeniyatMarks: 25,
        totalMarks: 96,
        percentage: 96,
        grade: 'A+',
        status: 'کامیاب (Pass)',
        remarks: 'ماشاء اللہ شاندار کارکردگی! ممتاز پوزیشن۔'
      },
      {
        studentId: 'STU-102',
        tilawatMarks: 22,
        hifzMarks: 22,
        tajweedMarks: 23,
        deeniyatMarks: 24,
        totalMarks: 91,
        percentage: 91,
        grade: 'A+',
        status: 'کامیاب (Pass)',
        remarks: 'بہت خوبصورت تلاوت اور دعائیں حفظ۔'
      }
    ]
  },
  {
    id: 'EXM-2',
    title: 'ماہانہ حفظ و ناظرہ ٹیسٹ (جولائی-اگست)',
    term: 'ماہانہ ٹیسٹ',
    classId: 'CLS-3',
    date: '2026-08-12',
    totalPossibleMarks: 100,
    results: [
      {
        studentId: 'STU-105',
        tilawatMarks: 25,
        hifzMarks: 24,
        tajweedMarks: 24,
        deeniyatMarks: 25,
        totalMarks: 98,
        percentage: 98,
        grade: 'A+',
        status: 'کامیاب (Pass)',
        remarks: 'پارہ ۱ تا ۹ کا دور اور حفظ نہایت پختہ ہے۔'
      },
      {
        studentId: 'STU-106',
        tilawatMarks: 21,
        hifzMarks: 20,
        tajweedMarks: 22,
        deeniyatMarks: 23,
        totalMarks: 86,
        percentage: 86,
        grade: 'A',
        status: 'کامیاب (Pass)',
        remarks: 'اچھی کوشش ہے، منزل کے اعادہ پر مزید توجہ درکار ہے۔'
      }
    ]
  }
];

export const INITIAL_BANK_ACCOUNTS: MadrasaBankAccount[] = [
  {
    id: 'ACC-1',
    bankName: 'گوگل پے و یو پی آئی کیو آر (Google Pay & UPI QR)',
    accountTitle: 'Lukman Abdulrahim Malpara',
    accountNumber: 'lmalpara5@okicici',
    iban: 'lmalpara5@okicici',
    type: 'upi',
    badge: '⚡ Google Pay / PhonePe / Paytm / BHIM (0% فیس)',
    icon: '⚡',
    instructions: 'Google Pay، PhonePe، Paytm یا کسی بھی UPI ایپ سے کیو آر کوڈ اسکین کریں یا UPI ID: lmalpara5@okicici درج کر کے براہِ راست رقم منتقل کریں۔'
  },
  {
    id: 'ACC-2',
    bankName: 'آئی سی آئی سی آئی بینک (ICICI Bank Ltd)',
    accountTitle: 'Lukman Abdulrahim Malpara',
    accountNumber: '028101516759',
    iban: 'ICIC0000281',
    branchCode: '0281 (ICICI Bank 6759)',
    swiftCode: 'ICICINBB',
    type: 'bank',
    badge: '🏛️ باضابطہ تصدیق شدہ اکاؤنٹ (NEFT / RTGS / IMPS)',
    icon: '🏛️',
    instructions: 'نیٹ بینکنگ، موبائل بینکنگ، NEFT، RTGS یا IMPS کے ذریعے بھارت کے کسی بھی بینک اکاؤنٹ سے براہِ راست فنڈ ٹرانسفر کریں۔'
  },
  {
    id: 'ACC-3',
    bankName: 'فون پے و پے ٹی ایم (PhonePe & Paytm Transfer)',
    accountTitle: 'Lukman Abdulrahim Malpara',
    accountNumber: 'lmalpara5@okicici',
    iban: 'lmalpara5@okicici',
    type: 'easypaisa',
    badge: '📱 فوری موبائل ادائیگی (Instant Transfer)',
    icon: '📱',
    instructions: 'PhonePe یا Paytm ایپ میں "To UPI ID" منتخب کر کے lmalpara5@okicici درج کریں اور رقم بھیجیں۔'
  }
];

export const INITIAL_DONATION_PROJECTS: MadrasaDonationProject[] = [
  {
    id: 'PRJ-1',
    title: 'کفالتِ طالب علم (حفظ و ناظرہ قرآن)',
    urduTitle: 'ایک سال یا ایک ماہ کے لیے مستحق طالب علم کے تعلیمی اخراجات کی کفالت',
    description: 'غریب و نادار اور یتیم بچوں کو مکمل مفت دینی تعلیم، کتب، اور اساتذہ کی رہنمائی فراہم کرنے کے لیے ماہانہ کفالت۔',
    targetAmount: 150000,
    collectedAmount: 0,
    category: 'sponsorship',
    suggestedAmounts: [3000, 6000, 15000, 36000],
    unitCostLabel: 'ماہانہ کفالت: 3,000 ₹ فی طالب علم',
    icon: '🎓',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'PRJ-2',
    title: 'اعانت و وظائفِ اساتذہ کرام',
    urduTitle: 'قرآن کریم کے مخلص اساتذہ و قراء کی باوقار معاونت و تنخواہیں',
    description: 'دن رات قرآن پڑھانے والے اساتذہ اور معلمات کے ماہانہ مشاہرے اور اعزازیہ کی ادائیگی تاکہ تدریس کا سلسلہ بلاتعطل جاری رہے۔',
    targetAmount: 200000,
    collectedAmount: 0,
    category: 'teachers',
    suggestedAmounts: [5000, 10000, 25000, 50000],
    unitCostLabel: 'ماہانہ اعزازیہ: 25,000 ₹ فی استاد',
    icon: '👳‍♂️',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'PRJ-3',
    title: 'راشن و طعامِ طلبہ (لنگرِ قرآن)',
    urduTitle: 'مقیم طلباء کے لیے پاکیزہ کھانا اور ناشتہ',
    description: 'مدرسہ میں زیرِ تعلیم طلباء کے لیے روزانہ دو وقت کا باعزت اور غذائیت بخش کھانا اور دودھ و پھل کی فراہمی۔',
    targetAmount: 180000,
    collectedAmount: 0,
    category: 'ration',
    suggestedAmounts: [2500, 5000, 15000, 30000],
    unitCostLabel: 'ماہانہ خوراک: 5,000 ₹ فی بچہ',
    icon: '🍲',
    color: 'from-amber-600 to-orange-600'
  },
  {
    id: 'PRJ-4',
    title: 'تعمیر و تجدیدِ مدرسہ و کلاس رومز (للہ فنڈ)',
    urduTitle: 'ڈیجیٹل سٹوڈیو، کلاس روم کی تعمیر، سولر سسٹم اور کتب خانہ',
    description: 'آن لائن ریکارڈنگ سٹوڈیو کی بہتری، طلباء کے لیے کلاس روم فرنیچر، سولر انورٹر اور ساؤنڈ سسٹم کی فراہمی برائے للہ فنڈ۔',
    targetAmount: 500000,
    collectedAmount: 0,
    category: 'construction',
    suggestedAmounts: [10000, 25000, 50000, 100000],
    unitCostLabel: 'للہ عطیہ برائے تعمیر',
    icon: '🕌',
    color: 'from-purple-600 to-violet-600'
  },
  {
    id: 'PRJ-5',
    title: 'کتب، مصاحف اور تعلیمی بیگ کی تقسیم (للہ فنڈ)',
    urduTitle: 'نئے طلباء میں نورانی قاعدے، قرآن مجید کے نسخے اور بستے کی فراہمی',
    description: 'قرآن کریم کے خوبصورت نسخے، تجویدی قاعدے اور تعلیمی سٹیشنری طلباء میں للہ عطیہ کے طور پر تقسیم کرنے کا فنڈ۔',
    targetAmount: 50000,
    collectedAmount: 0,
    category: 'quran',
    suggestedAmounts: [1000, 2500, 5000, 10000],
    unitCostLabel: 'ایک قرآنی کٹ: 1,500 ₹',
    icon: '📖',
    color: 'from-teal-600 to-cyan-600'
  },
  {
    id: 'PRJ-6',
    title: 'عمومی للہ عطیات فنڈ (General Lillah Fund)',
    urduTitle: 'جامعہ کے جملہ تعلیمی، انتظامی و تدریسی اخراجات کے لیے خالص للہ عطیات',
    description: 'اللہ کی رضا اور خوشنودی کے لیے مدرسہ کے تمام ضروری تعلیمی اخراجات، یوٹیلیٹی بلز اور انتظامی ضروریات کے لیے للہ فنڈ۔',
    targetAmount: 300000,
    collectedAmount: 0,
    category: 'lillah',
    suggestedAmounts: [5000, 15000, 30000, 50000],
    unitCostLabel: 'خالص للہ عطیہ',
    icon: '🤲',
    color: 'from-emerald-600 to-teal-600'
  }
];

export const INITIAL_DONATIONS: MadrasaDonationRecord[] = [];

export const initialMadrasaTeachers = INITIAL_TEACHERS;
export const initialMadrasaClasses = INITIAL_CLASSES;
export const initialMadrasaStudents = INITIAL_STUDENTS;
export const initialMadrasaAttendance = INITIAL_ATTENDANCE;
export const initialMadrasaFees = INITIAL_FEES;
export const initialMadrasaSabaqLogs = INITIAL_SABAQ_LOGS;
export const initialMadrasaExams = INITIAL_EXAMS;
export const initialMadrasaBankAccounts = INITIAL_BANK_ACCOUNTS;
export const initialMadrasaDonationProjects = INITIAL_DONATION_PROJECTS;
export const initialMadrasaDonations = INITIAL_DONATIONS;


