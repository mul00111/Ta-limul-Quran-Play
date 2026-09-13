import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  GraduationCap, 
  Users, 
  Lock, 
  Key, 
  CheckCircle2, 
  X, 
  Sparkles, 
  LogIn, 
  UserPlus, 
  AlertCircle,
  Phone,
  BookOpen
} from 'lucide-react';
import { MadrasaTeacher, MadrasaStudent } from '../../data/madrasaData';

export interface MadrasaUserSession {
  role: 'admin' | 'teacher' | 'student' | 'parent';
  name: string;
  id: string;
  phone?: string;
  rollNo?: string;
  avatar?: string;
  title?: string;
  isVerified: boolean;
}

interface MadrasaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: MadrasaUserSession | null;
  onLoginSuccess: (session: MadrasaUserSession) => void;
  teachers: MadrasaTeacher[];
  students: MadrasaStudent[];
}

export const MadrasaAuthModal: React.FC<MadrasaAuthModalProps> = ({
  isOpen,
  onClose,
  currentSession,
  onLoginSuccess,
  teachers,
  students
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'student' | 'parent'>('admin');
  
  // Admin fields
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  // Teacher fields
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [teacherPin, setTeacherPin] = useState('');
  const [teacherError, setTeacherError] = useState('');

  // Student fields
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentError, setStudentError] = useState('');

  // Parent fields
  const [parentChildId, setParentChildId] = useState(students[0]?.id || '');
  const [parentPhone, setParentPhone] = useState('');
  const [parentError, setParentError] = useState('');

  if (!isOpen) return null;

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or 786
    if (adminPin === '1234' || adminPin === '786' || adminPin === 'admin') {
      const session: MadrasaUserSession = {
        role: 'admin',
        name: 'مہتمم / ایڈمن صاحب',
        id: 'ADMIN-01',
        isVerified: true,
        avatar: '👑'
      };
      onLoginSuccess(session);
      onClose();
    } else {
      setAdminError('درج کردہ پن کوڈ غلط ہے۔ برائے مہربانی درست ایڈمن کوڈ (1234) درج کریں۔');
    }
  };

  // Handle Teacher Login
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) {
      setTeacherError('براہ کرم استاد کا انتخاب کریں۔');
      return;
    }
    const session: MadrasaUserSession = {
      role: 'teacher',
      name: teacher.name,
      id: teacher.id,
      phone: teacher.phone,
      title: teacher.title,
      avatar: '👨‍🏫',
      isVerified: true
    };
    onLoginSuccess(session);
    onClose();
  };

  // Handle Student Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) {
      setStudentError('طالب علم کا انتخاب درست نہیں ہے۔');
      return;
    }
    const session: MadrasaUserSession = {
      role: 'student',
      name: student.name,
      id: student.id,
      rollNo: student.rollNo,
      phone: student.phone,
      avatar: '👦',
      isVerified: true
    };
    onLoginSuccess(session);
    onClose();
  };

  // Handle Parent Login
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === parentChildId);
    if (!student) {
      setParentError('بچے کا انتخاب کریں۔');
      return;
    }
    const session: MadrasaUserSession = {
      role: 'parent',
      name: `والد/والدہ محترم (${student.guardianName || student.name})`,
      id: `PARENT-${student.id}`,
      phone: parentPhone || student.phone,
      avatar: '👨‍👧',
      isVerified: true
    };
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700/80 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-arabic">مدرسہ لاگ اِن و سیکیورٹی پورٹل</h2>
              <p className="text-xs text-emerald-300/80">اپنے کردار کے مطابق تصدیق شدہ لاگ اِن کریں</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-zinc-950/80 border-b border-zinc-800 text-xs font-bold font-arabic">
          <button
            onClick={() => { setActiveTab('admin'); setAdminError(''); }}
            className={`py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'admin' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>مہتمم (Admin)</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('teacher'); setTeacherError(''); }}
            className={`py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'teacher' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>استاد (Teacher)</span>
          </button>

          <button
            onClick={() => { setActiveTab('student'); setStudentError(''); }}
            className={`py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'student' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>طالب علم</span>
          </button>

          <button
            onClick={() => { setActiveTab('parent'); setParentError(''); }}
            className={`py-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
              activeTab === 'parent' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>والدین</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6">

          {/* ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-2xl text-xs text-emerald-200/90 leading-relaxed font-arabic">
                👑 <strong>ایڈمن لاگ اِن:</strong> مہتمم / ایڈمن پینل کے ذریعے آپ تمام اساتذہ، طلباء، فیسوں، حاضری اور مالیات پر مکمل اختیار حاصل کر سکتے ہیں۔
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  ایڈمن سیکیورٹی پن کوڈ (Default PIN: 1234)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="****"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white text-center tracking-widest text-lg focus:outline-none focus:border-emerald-500 font-mono"
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                </div>
                {adminError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-arabic">
                    <AlertCircle className="w-3.5 h-3.5" /> {adminError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 font-arabic"
              >
                <LogIn className="w-4 h-4" />
                <span>بطور ایڈمن داخل ہوں</span>
              </button>
            </form>
          )}

          {/* TEACHER LOGIN */}
          {activeTab === 'teacher' && (
            <form onSubmit={handleTeacherLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  استاد کا نام منتخب کریں
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-arabic"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} — ({t.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  استاد کا سیکیورٹی پن (اختیاری)
                </label>
                <input
                  type="password"
                  placeholder="پن کوڈ درج کریں..."
                  value={teacherPin}
                  onChange={(e) => setTeacherPin(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-mono text-center tracking-wider"
                />
                {teacherError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-arabic">
                    <AlertCircle className="w-3.5 h-3.5" /> {teacherError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 font-arabic"
              >
                <GraduationCap className="w-4 h-4" />
                <span>استاد کے طور پر لاگ اِن کریں</span>
              </button>
            </form>
          )}

          {/* STUDENT LOGIN */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  طالب علم کا انتخاب کریں
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-arabic"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo}) - {s.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  موبائل نمبر یا رول نمبر کی تصدیق
                </label>
                <input
                  type="text"
                  placeholder="مثلاً: TQ-2026-01 یا موبائل نمبر"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-center font-arabic"
                />
                {studentError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-arabic">
                    <AlertCircle className="w-3.5 h-3.5" /> {studentError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 font-arabic"
              >
                <User className="w-4 h-4" />
                <span>طالب علم کے طور پر داخل ہوں</span>
              </button>
            </form>
          )}

          {/* PARENT LOGIN */}
          {activeTab === 'parent' && (
            <form onSubmit={handleParentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  اپنے بچے (طالب علم) کا انتخاب کریں
                </label>
                <select
                  value={parentChildId}
                  onChange={(e) => setParentChildId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 font-arabic"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} (والد کا نام: {s.guardianName || 'سرپرست'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1 font-arabic">
                  رجسٹرڈ موبائل نمبر
                </label>
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-center font-mono"
                />
                {parentError && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-arabic">
                    <AlertCircle className="w-3.5 h-3.5" /> {parentError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 font-arabic"
              >
                <Users className="w-4 h-4" />
                <span>والدین پورٹل کھولیں</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
