import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  Calendar, 
  Award, 
  Video, 
  Mic, 
  LayoutDashboard, 
  Shield, 
  Settings, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Upload, 
  RotateCcw,
  Cloud,
  Globe
} from 'lucide-react';
import { 
  MadrasaTeacher, 
  MadrasaStudent, 
  MadrasaClass, 
  MadrasaFeeRecord, 
  MadrasaAttendanceDay, 
  MadrasaSabaqRecord, 
  MadrasaExam, 
  MadrasaDonationRecord,
  initialMadrasaTeachers,
  initialMadrasaClasses,
  initialMadrasaStudents,
  initialMadrasaFees,
  initialMadrasaAttendance,
  initialMadrasaSabaqLogs,
  initialMadrasaExams,
  initialMadrasaDonations
} from '../data/madrasaData';
import { LanguageCode } from '../types';
import { getMadrasaTranslation } from '../data/madrasaTranslations';
import { LanguageModal } from './LanguageModal';
import { madrasaFirebaseService } from '../services/madrasaFirebaseService';

import { MadrasaOverviewTab } from './madrasa/MadrasaOverviewTab';
import { MadrasaTeachersTab } from './madrasa/MadrasaTeachersTab';
import { MadrasaStudentsTab } from './madrasa/MadrasaStudentsTab';
import { MadrasaClassesTab } from './madrasa/MadrasaClassesTab';
import { MadrasaAttendanceTab } from './madrasa/MadrasaAttendanceTab';
import { MadrasaFeesTab } from './madrasa/MadrasaFeesTab';
import { MadrasaLiveClassTab } from './madrasa/MadrasaLiveClassTab';
import { MadrasaSabaqHearingTab } from './madrasa/MadrasaSabaqHearingTab';
import { MadrasaExamsTab } from './madrasa/MadrasaExamsTab';
import { MadrasaDonationsTab } from './madrasa/MadrasaDonationsTab';
import { MadrasaAuthModal, MadrasaUserSession } from './madrasa/MadrasaAuthModal';
import { useBackHandler } from '../hooks/useBackHandler';

interface MadrasaOnlinePortalProps {
  onBackToApp?: () => void;
  currentLang?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
}

export const MadrasaOnlinePortal: React.FC<MadrasaOnlinePortalProps> = ({ 
  onBackToApp,
  currentLang,
  onSelectLanguage
}) => {
  // Language State
  const [portalLang, setPortalLang] = useState<LanguageCode>(() => {
    if (currentLang) return currentLang;
    const saved = localStorage.getItem('TQ_LANGUAGE') as LanguageCode;
    return saved || 'ur';
  });
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  useEffect(() => {
    if (currentLang && currentLang !== portalLang) {
      setPortalLang(currentLang);
    }
  }, [currentLang]);

  const handleLanguageSelect = (newLang: LanguageCode) => {
    setPortalLang(newLang);
    localStorage.setItem('TQ_LANGUAGE', newLang);
    onSelectLanguage?.(newLang);
    setIsLangModalOpen(false);
  };

  const t = getMadrasaTranslation(portalLang);
  const isRtl = portalLang === 'ur' || portalLang === 'ar';

  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students' | 'classes' | 'attendance' | 'fees' | 'live-class' | 'sabaq-hearing' | 'exams' | 'donations'>('overview');
  const [userRole, setUserRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const [currentUserSession, setCurrentUserSession] = useState<MadrasaUserSession | null>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_USER_SESSION');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      role: 'admin',
      name: 'مہتمم / ایڈمن صاحب',
      id: 'ADMIN-01',
      isVerified: true,
      avatar: '👑'
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preselectedStudentForSabaq, setPreselectedStudentForSabaq] = useState<string | null>(null);
  const [preselectedStudentForDonation, setPreselectedStudentForDonation] = useState<string | null>(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // Back Button Handlers (Hierarchy: Auth Modal > Sub-tabs > Return to Home)
  useBackHandler(() => {
    setIsAuthModalOpen(false);
  }, isAuthModalOpen, 50, 'madrasa_auth_modal');

  useBackHandler(() => {
    setIsLangModalOpen(false);
  }, isLangModalOpen, 45, 'madrasa_lang_modal');

  useBackHandler(() => {
    setActiveTab('overview');
  }, activeTab !== 'overview' && !isAuthModalOpen && !isLangModalOpen, 35, 'madrasa_active_tab');

  useBackHandler(() => {
    onBackToApp?.();
  }, activeTab === 'overview' && !isAuthModalOpen && !isLangModalOpen, 20, 'madrasa_root_back');

  // Persistent State
  const [teachers, setTeachers] = useState<MadrasaTeacher[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_TEACHERS');
    return saved ? JSON.parse(saved) : initialMadrasaTeachers;
  });

  const [classes, setClasses] = useState<MadrasaClass[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_CLASSES');
    return saved ? JSON.parse(saved) : initialMadrasaClasses;
  });

  const [students, setStudents] = useState<MadrasaStudent[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_STUDENTS');
    return saved ? JSON.parse(saved) : initialMadrasaStudents;
  });

  const [fees, setFees] = useState<MadrasaFeeRecord[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_FEES');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((f: MadrasaFeeRecord) => !f.id?.startsWith('FEE-10') && !f.receiptNo?.startsWith('REC-2026-880'));
        }
      } catch (e) {
        return [];
      }
    }
    return initialMadrasaFees;
  });

  const [attendance, setAttendance] = useState<MadrasaAttendanceDay[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_ATTENDANCE');
    return saved ? JSON.parse(saved) : initialMadrasaAttendance;
  });

  const [sabaqLogs, setSabaqLogs] = useState<MadrasaSabaqRecord[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_SABAQ_LOGS');
    return saved ? JSON.parse(saved) : initialMadrasaSabaqLogs;
  });

  const [exams, setExams] = useState<MadrasaExam[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_EXAMS');
    return saved ? JSON.parse(saved) : initialMadrasaExams;
  });

  const [donations, setDonations] = useState<MadrasaDonationRecord[]>(() => {
    const saved = localStorage.getItem('TQ_MADRASA_DONATIONS');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((d: MadrasaDonationRecord) => !d.id?.startsWith('DON-10') && !d.receiptNo?.startsWith('TQ-DON-2026-00'));
        }
      } catch (e) {
        return [];
      }
    }
    return initialMadrasaDonations;
  });

  // ☁️ Firebase Firestore Live Sync Subscriptions
  useEffect(() => {
    setIsCloudSyncing(true);
    // Seed cloud on startup if first time
    madrasaFirebaseService.seedCloudIfEmpty({
      teachers,
      classes,
      students,
      fees,
      attendance,
      sabaqLogs,
      exams,
      donations
    }).finally(() => {
      setIsCloudSyncing(false);
    });

    const unsubStudents = madrasaFirebaseService.subscribeStudents((cloudStudents) => {
      if (cloudStudents && cloudStudents.length > 0) {
        setStudents(cloudStudents);
      }
    });

    const unsubTeachers = madrasaFirebaseService.subscribeTeachers((cloudTeachers) => {
      if (cloudTeachers && cloudTeachers.length > 0) {
        setTeachers(cloudTeachers);
      }
    });

    const unsubClasses = madrasaFirebaseService.subscribeClasses((cloudClasses) => {
      if (cloudClasses && cloudClasses.length > 0) {
        setClasses(cloudClasses);
      }
    });

    const unsubAttendance = madrasaFirebaseService.subscribeAttendance((cloudAtt) => {
      if (cloudAtt && cloudAtt.length > 0) {
        setAttendance(cloudAtt);
      }
    });

    const unsubSabaq = madrasaFirebaseService.subscribeSabaq((cloudSabaq) => {
      if (cloudSabaq && cloudSabaq.length > 0) {
        setSabaqLogs(cloudSabaq);
      }
    });

    const unsubFees = madrasaFirebaseService.subscribeFees((cloudFees) => {
      if (cloudFees && cloudFees.length > 0) {
        setFees(cloudFees);
      }
    });

    const unsubExams = madrasaFirebaseService.subscribeExams((cloudExams) => {
      if (cloudExams && cloudExams.length > 0) {
        setExams(cloudExams);
      }
    });

    const unsubDonations = madrasaFirebaseService.subscribeDonations((cloudDonations) => {
      if (cloudDonations && cloudDonations.length > 0) {
        setDonations(cloudDonations);
      }
    });

    return () => {
      unsubStudents?.();
      unsubTeachers?.();
      unsubClasses?.();
      unsubAttendance?.();
      unsubSabaq?.();
      unsubFees?.();
      unsubExams?.();
      unsubDonations?.();
    };
  }, []);

  // Sync to LocalStorage as offline fallback
  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_TEACHERS', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_CLASSES', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_STUDENTS', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_FEES', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_ATTENDANCE', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_SABAQ_LOGS', JSON.stringify(sabaqLogs));
  }, [sabaqLogs]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_EXAMS', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('TQ_MADRASA_DONATIONS', JSON.stringify(donations));
  }, [donations]);

  // Handlers for Teachers
  const handleAddTeacher = (newT: MadrasaTeacher) => {
    setTeachers(prev => [newT, ...prev]);
    madrasaFirebaseService.saveTeacher(newT);
  };
  const handleUpdateTeacher = (updatedT: MadrasaTeacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedT.id ? updatedT : t));
    madrasaFirebaseService.saveTeacher(updatedT);
  };
  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    madrasaFirebaseService.deleteTeacher(id);
  };

  // Handlers for Students
  const handleAddStudent = (newS: MadrasaStudent) => {
    setStudents(prev => [newS, ...prev]);
    madrasaFirebaseService.saveStudent(newS);
  };
  const handleUpdateStudent = (updatedS: MadrasaStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedS.id ? updatedS : s));
    madrasaFirebaseService.saveStudent(updatedS);
  };
  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    madrasaFirebaseService.deleteStudent(id);
  };

  // Handlers for Classes
  const handleAddClass = (newC: MadrasaClass) => {
    setClasses(prev => [...prev, newC]);
    madrasaFirebaseService.saveClass(newC);
  };
  const handleUpdateClass = (updatedC: MadrasaClass) => {
    setClasses(prev => prev.map(c => c.id === updatedC.id ? updatedC : c));
    madrasaFirebaseService.saveClass(updatedC);
  };
  const handleDeleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    madrasaFirebaseService.deleteClass(id);
  };

  // Handlers for Fees
  const handleAddFeeRecord = (newF: MadrasaFeeRecord) => {
    setFees(prev => [newF, ...prev]);
    madrasaFirebaseService.saveFee(newF);
  };
  const handleUpdateFeeRecord = (updatedF: MadrasaFeeRecord) => {
    setFees(prev => prev.map(f => f.id === updatedF.id ? updatedF : f));
    madrasaFirebaseService.saveFee(updatedF);
  };

  // Handlers for Attendance
  const handleSaveAttendance = (day: MadrasaAttendanceDay) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.date === day.date && a.classId === day.classId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = day;
        return copy;
      }
      return [day, ...prev];
    });
    madrasaFirebaseService.saveAttendance(day);
  };

  // Handlers for Sabaq
  const handleSaveSabaqLog = (log: MadrasaSabaqRecord) => {
    setSabaqLogs(prev => [log, ...prev]);
    madrasaFirebaseService.saveSabaq(log);
  };

  // Handlers for Exams
  const handleAddExam = (newE: MadrasaExam) => {
    setExams(prev => [newE, ...prev]);
    madrasaFirebaseService.saveExam(newE);
  };
  const handleUpdateExam = (updatedE: MadrasaExam) => {
    setExams(prev => prev.map(e => e.id === updatedE.id ? updatedE : e));
    madrasaFirebaseService.saveExam(updatedE);
  };

  // Handlers for Donations
  const handleAddDonation = (newD: MadrasaDonationRecord) => {
    setDonations(prev => [newD, ...prev]);
    madrasaFirebaseService.saveDonation(newD);
  };
  const handleUpdateDonation = (updatedD: MadrasaDonationRecord) => {
    setDonations(prev => prev.map(d => d.id === updatedD.id ? updatedD : d));
    madrasaFirebaseService.saveDonation(updatedD);
  };
  const handleDeleteDonation = (id: string) => {
    setDonations(prev => prev.filter(d => d.id !== id));
    madrasaFirebaseService.deleteDonation(id);
  };

  // Backup / Export
  const handleExportData = () => {
    const allData = {
      teachers,
      classes,
      students,
      fees,
      attendance,
      sabaqLogs,
      exams,
      donations,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TalimulQuran_Madrasa_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  // Restore / Import
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.teachers) setTeachers(parsed.teachers);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.fees) setFees(parsed.fees);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.sabaqLogs) setSabaqLogs(parsed.sabaqLogs);
        if (parsed.exams) setExams(parsed.exams);
        if (parsed.donations) setDonations(parsed.donations);
        alert('✅ مدرسہ کا تمام ڈیٹا بحال کر دیا گیا ہے!');
      } catch (err) {
        alert('فائل درست فارمیٹ میں نہیں ہے۔');
      }
    };
    reader.readAsText(file);
  };

  // Reset Data
  const handleResetData = () => {
    if (window.confirm('کیا آپ واقعی تمام ڈیٹا ری سیٹ کر کے ڈیفالٹ حالت پر لانا چاہتے ہیں؟')) {
      setTeachers(initialMadrasaTeachers);
      setClasses(initialMadrasaClasses);
      setStudents(initialMadrasaStudents);
      setFees(initialMadrasaFees);
      setAttendance(initialMadrasaAttendance);
      setSabaqLogs(initialMadrasaSabaqLogs);
      setExams(initialMadrasaExams);
      setDonations(initialMadrasaDonations);
      alert('ڈیٹا ری سیٹ ہو گیا۔');
    }
  };

  const handleNavigateToSabaqForStudent = (studentId: string) => {
    setPreselectedStudentForSabaq(studentId);
    setActiveTab('sabaq-hearing');
  };

  const handleNavigateToDonationForStudent = (studentId: string) => {
    setPreselectedStudentForDonation(studentId);
    setActiveTab('donations');
  };

  const navItems = [
    { id: 'overview', label: t.navOverview, icon: '🕌' },
    { id: 'donations', label: t.navDonations, icon: '🤲' },
    { id: 'teachers', label: t.navTeachers, icon: '👳‍♂️' },
    { id: 'students', label: t.navStudents, icon: '🎓' },
    { id: 'classes', label: t.navClasses, icon: '📚' },
    { id: 'attendance', label: t.navAttendance, icon: '📝' },
    { id: 'fees', label: t.navFees, icon: '💳' },
    { id: 'live-class', label: t.navLiveClass, icon: '🎥' },
    { id: 'sabaq-hearing', label: t.navSabaq, icon: '🎙️' },
    { id: 'exams', label: t.navExams, icon: '🏆' },
  ];

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 🌟 Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                title={t.backToApp}
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'}`} />
                <span className="hidden sm:inline">{t.backToApp}</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl shadow-md border border-emerald-400/30 shrink-0">
              🕌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white">{t.portalTitle}</h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {t.portalBadge}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Language, Role & Cloud Sync Status */}
          <div className="flex items-center gap-2">
            
            {/* 🌐 Language Switcher Button */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-zinc-300 hover:text-white group"
              title="Language / زبان"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
              <span className="font-bold text-xs">
                {portalLang === 'ur' ? '🇵🇰 اردو' :
                 portalLang === 'en' ? '🇬🇧 English' :
                 portalLang === 'hi' ? '🇮🇳 हिन्दी' :
                 portalLang === 'bn' ? '🇧🇩 বাংলা' :
                 portalLang === 'ar' ? '🇸🇦 العربية' :
                 portalLang === 'id' ? '🇮🇩 ID' :
                 portalLang === 'tr' ? '🇹🇷 TR' : '🇫🇷 FR'}
              </span>
            </button>

            {/* Cloud Status */}
            <div className="hidden sm:flex bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[11px] items-center gap-1.5 text-emerald-300 font-bold shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isCloudSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span>{isCloudSyncing ? t.cloudSyncing : t.cloudSafe}</span>
            </div>

            {/* Role Button */}
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-emerald-500/50 px-3 py-1 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
              title={t.changeLabel}
            >
              <span className="text-zinc-500 text-[11px] hidden sm:inline">{t.roleLabel}:</span>
              <span className="font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1">
                <span>{currentUserSession?.avatar || '👑'}</span>
                <span className="max-w-[100px] truncate">{currentUserSession?.name || (userRole === 'admin' ? t.roleAdmin : userRole === 'teacher' ? t.roleTeacher : t.roleStudent)}</span>
              </span>
              <span className="text-[10px] text-zinc-500 underline">{t.changeLabel}</span>
            </button>
          </div>

        </div>

        {/* Horizontal Navigation Scrollable Tabs */}
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar border-t border-zinc-800/60 flex items-center gap-1 py-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 🏛️ Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'overview' && (
          <MadrasaOverviewTab
            teachers={teachers}
            students={students}
            classes={classes}
            fees={fees}
            attendance={attendance}
            sabaqLogs={sabaqLogs}
            exams={exams}
            donations={donations}
            userRole={userRole}
            setUserRole={setUserRole}
            onNavigateTab={(tab) => setActiveTab(tab as any)}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetData={handleResetData}
            currentLang={portalLang}
          />
        )}

        {activeTab === 'donations' && (
          <MadrasaDonationsTab
            donations={donations}
            students={students}
            classes={classes}
            onAddDonation={handleAddDonation}
            onUpdateDonation={handleUpdateDonation}
            onDeleteDonation={handleDeleteDonation}
            preselectedStudentId={preselectedStudentForDonation}
            currentLang={portalLang}
          />
        )}

        {activeTab === 'teachers' && (
          <MadrasaTeachersTab
            teachers={teachers}
            classes={classes}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
          />
        )}

        {activeTab === 'students' && (
          <MadrasaStudentsTab
            students={students}
            classes={classes}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onNavigateToSabaq={handleNavigateToSabaqForStudent}
            onNavigateToDonation={handleNavigateToDonationForStudent}
          />
        )}

        {activeTab === 'classes' && (
          <MadrasaClassesTab
            classes={classes}
            teachers={teachers}
            students={students}
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
          />
        )}

        {activeTab === 'attendance' && (
          <MadrasaAttendanceTab
            attendance={attendance}
            classes={classes}
            students={students}
            onSaveAttendance={handleSaveAttendance}
          />
        )}

        {activeTab === 'fees' && (
          <MadrasaFeesTab
            fees={fees}
            students={students}
            classes={classes}
            onAddFeeRecord={handleAddFeeRecord}
            onUpdateFeeRecord={handleUpdateFeeRecord}
          />
        )}

        {activeTab === 'live-class' && (
          <MadrasaLiveClassTab
            classes={classes}
            students={students}
            teachers={teachers}
          />
        )}

        {activeTab === 'sabaq-hearing' && (
          <MadrasaSabaqHearingTab
            students={students}
            teachers={teachers}
            classes={classes}
            sabaqLogs={sabaqLogs}
            onSaveSabaqLog={handleSaveSabaqLog}
            preselectedStudentId={preselectedStudentForSabaq}
          />
        )}

        {activeTab === 'exams' && (
          <MadrasaExamsTab
            exams={exams}
            students={students}
            classes={classes}
            onAddExam={handleAddExam}
            onUpdateExam={handleUpdateExam}
          />
        )}
      </main>

      {/* 🛡️ Madrasa Auth Modal */}
      <MadrasaAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentSession={currentUserSession}
        onLoginSuccess={(session) => {
          setCurrentUserSession(session);
          localStorage.setItem('TQ_MADRASA_USER_SESSION', JSON.stringify(session));
          if (session.role === 'teacher') setUserRole('teacher');
          else if (session.role === 'student' || session.role === 'parent') setUserRole('student');
          else setUserRole('admin');
        }}
        teachers={teachers}
        students={students}
      />

      {/* 🌐 Language Selection Modal */}
      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLang={portalLang}
        onSelectLanguage={handleLanguageSelect}
      />

    </div>
  );
};
