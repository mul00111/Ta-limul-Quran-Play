import React, { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lock,
  X,
  KeyRound
} from 'lucide-react';
import { 
  MadrasaTeacher, 
  MadrasaStudent, 
  MadrasaClass, 
  MadrasaFeeRecord, 
  MadrasaAttendanceDay, 
  MadrasaSabaqRecord, 
  MadrasaExam,
  MadrasaDonationRecord
} from '../../data/madrasaData';
import { LanguageCode } from '../../types';
import { getMadrasaTranslation } from '../../data/madrasaTranslations';
import { PasscodeLockModal } from '../PasscodeLockModal';

interface MadrasaOverviewTabProps {
  teachers: MadrasaTeacher[];
  students: MadrasaStudent[];
  classes: MadrasaClass[];
  fees: MadrasaFeeRecord[];
  attendance: MadrasaAttendanceDay[];
  sabaqLogs: MadrasaSabaqRecord[];
  exams: MadrasaExam[];
  donations?: MadrasaDonationRecord[];
  userRole: 'admin' | 'teacher' | 'student';
  setUserRole: (role: 'admin' | 'teacher' | 'student') => void;
  onNavigateTab: (tabId: string) => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  currentLang?: LanguageCode;
}

export const MadrasaOverviewTab: React.FC<MadrasaOverviewTabProps> = ({
  teachers,
  students,
  classes,
  fees,
  attendance,
  sabaqLogs,
  exams,
  donations = [],
  userRole,
  setUserRole,
  onNavigateTab,
  onExportData,
  onImportData,
  onResetData,
  currentLang = 'ur'
}) => {
  const t = getMadrasaTranslation(currentLang);
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  // State for PIN protected Admin Data Controls
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const savedPin = localStorage.getItem('parent_pin') || '1234';

  // Calculations
  const activeStudentsCount = students.filter(s => s.status === 'active').length;
  const activeTeachersCount = teachers.filter(t => t.status === 'active').length;
  const totalFeesExpected = fees.reduce((acc, f) => acc + f.feeAmount, 0);
  const totalFeesCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const pendingFees = Math.max(0, totalFeesExpected - totalFeesCollected);
  const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  // Today's attendance stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const allTodayEntries = todayAttendance.flatMap(a => a.entries);
  const presentToday = allTodayEntries.filter(e => e.status === 'present').length;
  const totalMarkedToday = allTodayEntries.length;
  const attendanceRate = totalMarkedToday > 0 ? Math.round((presentToday / totalMarkedToday) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 👑 Top Role Selector & Quick Administrative Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-slate-900 border border-emerald-800/60 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className={`flex items-center gap-3 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-emerald-300">{t.overviewTitle}</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                {t.overviewControlBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-300">
              {t.overviewSubtitle}
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2 bg-zinc-950/80 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
          <span className="text-xs font-bold text-zinc-400 px-2">{t.currentRoleTitle}</span>
          <button
            onClick={() => setUserRole('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'admin'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.roleAdmin}
          </button>
          <button
            onClick={() => setUserRole('teacher')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'teacher'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.roleTeacher}
          </button>
          <button
            onClick={() => setUserRole('student')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              userRole === 'student'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t.roleStudent}
          </button>
        </div>
      </div>

      {/* 📊 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold">{t.activeStudents}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{students.length}</span>
            <span className="text-[11px] text-emerald-400 font-bold">({activeStudentsCount} {t.statusActive})</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">{t.deptStudentsTitle}</p>
        </div>

        {/* Metric 2: Teachers */}
        <div 
          onClick={() => onNavigateTab('teachers')}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-blue-500/50 p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold">{t.activeTeachers}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{teachers.length}</span>
            <span className="text-[11px] text-blue-400 font-bold">({activeTeachersCount} {t.statusActive})</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">{t.deptTeachersTitle}</p>
        </div>

        {/* Metric 3: Classes */}
        <div 
          onClick={() => onNavigateTab('classes')}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold">{t.deptClassesTitle}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{classes.length}</span>
            <span className="text-[11px] text-amber-400 font-bold">{t.navClasses}</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">{t.deptClassesDesc}</p>
        </div>

        {/* Metric 4: Fee Collection */}
        <div 
          onClick={() => onNavigateTab('fees')}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-teal-500/50 p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold">{t.feesCollected}</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-400">₹ {totalFeesCollected.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            {t.pendingDues}: <span className="text-amber-400 font-bold">₹ {pendingFees.toLocaleString()}</span>
          </p>
        </div>

        {/* Metric 5: Donations & Sponsorship */}
        <div 
          onClick={() => onNavigateTab('donations')}
          className="bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-3xl transition-all cursor-pointer hover:scale-[1.02] group shadow-lg col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-bold">{t.totalDonations}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              🤲
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-black text-emerald-400">₹ {totalDonationsAmount.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">
            {t.lillahOnly}
          </p>
        </div>

      </div>

      {/* 🚀 Quick Action Feature Hub */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.quickDeptTitle}</span>
          </h3>
          <span className="text-xs text-zinc-400">{t.quickDeptSubtitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Action 0: Donations & Sponsorships */}
          <button
            onClick={() => onNavigateTab('donations')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-700/40 hover:border-emerald-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🤲
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                <span>{t.deptLillahTitle}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">Lillah</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptLillahDesc}
              </p>
            </div>
          </button>
          
          {/* Action 1: Live Classroom */}
          <button
            onClick={() => onNavigateTab('live-class')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-700/40 hover:border-emerald-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🎥
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-emerald-300 flex items-center gap-1.5">
                <span>{t.deptLiveTitle}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">Live</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptLiveDesc}
              </p>
            </div>
          </button>

          {/* Action 2: Sabaq Hearing */}
          <button
            onClick={() => onNavigateTab('sabaq-hearing')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-blue-950/60 to-zinc-900 border border-blue-700/40 hover:border-blue-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🎙️
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-blue-300 flex items-center gap-1.5">
                <span>{t.deptSabaqTitle}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded-full font-bold">Mic</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptSabaqDesc}
              </p>
            </div>
          </button>

          {/* Action 3: Exams & Certificates */}
          <button
            onClick={() => onNavigateTab('exams')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-zinc-900 border border-amber-700/40 hover:border-amber-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              🏆
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-amber-300 flex items-center gap-1.5">
                <span>{t.deptExamsTitle}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-bold">Sanad</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptExamsDesc}
              </p>
            </div>
          </button>

          {/* Action 4: Attendance */}
          <button
            onClick={() => onNavigateTab('attendance')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 to-zinc-900 border border-purple-700/40 hover:border-purple-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              📝
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-purple-300 flex items-center gap-1.5">
                <span>{t.deptAttendanceTitle}</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded-full font-bold">Daily</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptAttendanceDesc}
              </p>
            </div>
          </button>

          {/* Action 5: Fees Management */}
          <button
            onClick={() => onNavigateTab('fees')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-teal-950/60 to-zinc-900 border border-teal-700/40 hover:border-teal-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-teal-600/20 text-teal-300 border border-teal-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              💳
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-teal-300 flex items-center gap-1.5">
                <span>{t.deptFeesTitle}</span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded-full font-bold">Invoice</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptFeesDesc}
              </p>
            </div>
          </button>

          {/* Action 6: Teachers & Staff */}
          <button
            onClick={() => onNavigateTab('teachers')}
            className={`p-4 rounded-2xl bg-gradient-to-br from-rose-950/60 to-zinc-900 border border-rose-700/40 hover:border-rose-400 ${isRtl ? 'text-right' : 'text-left'} transition-all cursor-pointer group flex items-start gap-3 hover:scale-[1.01]`}
          >
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              👥
            </div>
            <div>
              <h4 className="text-sm font-black text-white group-hover:text-rose-300 flex items-center gap-1.5">
                <span>{t.deptTeachersTitle}</span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-full font-bold">Staff</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {t.deptTeachersDesc}
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* 🔒 Discreet Master Admin Security & Backup (Only for Admin Role, PIN Protected) */}
      {userRole === 'admin' && (
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800/80 hover:border-emerald-600/40 text-zinc-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.dataManagement} (PIN Protected)</span>
          </button>
        </div>
      )}

      {/* 🔐 Admin Passcode Verification Modal */}
      <PasscodeLockModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => {
          setIsPinModalOpen(false);
          setIsDataModalOpen(true);
        }}
        title="Admin Security Lock"
        description="Enter PIN (Default: 1234)"
        currentLang={currentLang}
        savedPin={savedPin}
      />

      {/* 🛡️ Secure Admin Data Control Modal (Accessible only after PIN verification) */}
      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'} animate-in zoom-in-95 duration-200`} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">{t.dataManagement}</h3>
              </div>
              <button
                onClick={() => setIsDataModalOpen(false)}
                className="p-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {t.overviewSubtitle}
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h4 className="text-xs font-bold text-white">{t.backupExport}</h4>
                  <p className="text-[11px] text-zinc-400">JSON Backup</p>
                </div>
                <button
                  onClick={onExportData}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.backupExport}</span>
                </button>
              </div>

              <div className="p-3.5 bg-zinc-900/90 rounded-2xl border border-zinc-800 flex items-center justify-between gap-3">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h4 className="text-xs font-bold text-white">{t.restoreImport}</h4>
                  <p className="text-[11px] text-zinc-400">Restore File</p>
                </div>
                <label className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>{t.restoreImport}</span>
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={(e) => {
                      onImportData(e);
                      setIsDataModalOpen(false);
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>

              <div className="p-3.5 bg-rose-950/40 rounded-2xl border border-rose-800/40 flex items-center justify-between gap-3">
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h4 className="text-xs font-bold text-rose-300">{t.resetDefault}</h4>
                  <p className="text-[11px] text-rose-400/80">Reset All Data</p>
                </div>
                <button
                  onClick={() => {
                    onResetData();
                    setIsDataModalOpen(false);
                  }}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.resetDefault}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsDataModalOpen(false)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
