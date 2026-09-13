import React, { useState } from 'react';
import { 
  Heart, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Printer, 
  Search, 
  Plus, 
  Users, 
  HandHeart, 
  UserCheck, 
  Award, 
  Send
} from 'lucide-react';
import { 
  MadrasaDonationRecord, 
  MadrasaDonationProject, 
  MadrasaStudent, 
  MadrasaClass,
  initialMadrasaBankAccounts,
  initialMadrasaDonationProjects
} from '../../data/madrasaData';
import { LanguageCode } from '../../types';
import { getMadrasaTranslation } from '../../data/madrasaTranslations';
import { 
  DONATION_UI_STRINGS, 
  getLocalizedMadrasaProject, 
  getLocalizedMadrasaClass, 
  getLocalizedCategoryName 
} from '../../data/madrasaLocalizedData';

interface MadrasaDonationsTabProps {
  donations: MadrasaDonationRecord[];
  students: MadrasaStudent[];
  classes: MadrasaClass[];
  onAddDonation: (donation: MadrasaDonationRecord) => void;
  onUpdateDonation?: (donation: MadrasaDonationRecord) => void;
  onDeleteDonation?: (id: string) => void;
  preselectedStudentId?: string | null;
  currentLang?: LanguageCode;
}

export const MadrasaDonationsTab: React.FC<MadrasaDonationsTabProps> = ({
  donations,
  students,
  classes,
  onAddDonation,
  preselectedStudentId,
  currentLang = 'ur'
}) => {
  const t = getMadrasaTranslation(currentLang);
  const ui = DONATION_UI_STRINGS[currentLang] || DONATION_UI_STRINGS.ur;
  const isRtl = currentLang === 'ur' || currentLang === 'ar';

  // Navigation inside Donations Tab
  const [subTab, setSubTab] = useState<'projects' | 'sponsorship' | 'bank-accounts' | 'history'>('projects');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MadrasaDonationProject | null>(null);
  const [selectedStudentForSponsor, setSelectedStudentForSponsor] = useState<MadrasaStudent | null>(() => {
    if (preselectedStudentId) {
      return students.find(s => s.id === preselectedStudentId) || null;
    }
    return null;
  });

  const [receiptToView, setReceiptToView] = useState<MadrasaDonationRecord | null>(null);

  // New Donation Form State
  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    donorCity: '',
    donorCountry: 'India',
    amount: 3000,
    currency: 'INR' as 'INR' | 'USD' | 'AED' | 'GBP' | 'SAR' | 'EUR',
    category: 'sponsorship' as MadrasaDonationRecord['category'],
    categoryTitle: getLocalizedCategoryName('sponsorship', currentLang),
    paymentMethod: 'UPI / Google Pay' as MadrasaDonationRecord['paymentMethod'],
    transactionRef: '',
    isAnonymous: false,
    isMonthlyRecurring: false,
    notes: '',
    studentId: preselectedStudentId || ''
  });

  // Calculate quick metrics
  const totalDonationsAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthDonations = donations
    .filter(d => d.date.startsWith(currentMonth))
    .reduce((sum, d) => sum + d.amount, 0);
  const totalDonorsCount = new Set(donations.map(d => d.donorName)).size;
  const sponsoredStudentIds = new Set(donations.filter(d => d.studentId).map(d => d.studentId));

  // Helper for copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Open donation modal pre-configured
  const handleOpenDonateModal = (project?: MadrasaDonationProject, student?: MadrasaStudent) => {
    if (project) {
      setSelectedProject(project);
      const projInfo = getLocalizedMadrasaProject(project, currentLang);
      setFormData(prev => ({
        ...prev,
        category: project.category,
        categoryTitle: projInfo.title,
        amount: project.suggestedAmounts[0] || 3000,
        studentId: student ? student.id : ''
      }));
    } else if (student) {
      setSelectedStudentForSponsor(student);
      const studentClass = classes.find(c => c.id === student.classId);
      const classInfo = studentClass ? getLocalizedMadrasaClass(studentClass, currentLang) : null;
      setFormData(prev => ({
        ...prev,
        category: 'sponsorship',
        categoryTitle: `${getLocalizedCategoryName('sponsorship', currentLang)} (${student.name})`,
        amount: student.monthlyFee || 3000,
        studentId: student.id,
        notes: `${student.name} ${ui.sonOfText} ${student.guardianName} (${classInfo?.name || studentClass?.name || 'Class'})`
      }));
    }
    setIsDonateModalOpen(true);
  };

  // Submit Donation
  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.donorName.trim() && !formData.isAnonymous) {
      alert(currentLang === 'ur' ? 'براہ کرم عطیہ دہندہ کا نام درج کریں یا مخفی رکھیں کا انتخاب کریں۔' : 'Please enter donor name or choose anonymous.');
      return;
    }
    if (formData.amount <= 0) {
      alert(currentLang === 'ur' ? 'براہ کرم درست رقم درج کریں۔' : 'Please enter a valid donation amount.');
      return;
    }

    const newRecord: MadrasaDonationRecord = {
      id: `DON-${Date.now().toString().slice(-6)}`,
      receiptNo: `TQ-DON-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: formData.isAnonymous ? (ui.anonymousLabel || 'Anonymous') : formData.donorName,
      donorPhone: formData.donorPhone,
      donorEmail: formData.donorEmail,
      donorCity: formData.donorCity,
      donorCountry: formData.donorCountry,
      amount: Number(formData.amount),
      currency: formData.currency,
      category: formData.category,
      categoryTitle: formData.categoryTitle || getLocalizedCategoryName(formData.category, currentLang),
      paymentMethod: formData.paymentMethod,
      transactionRef: formData.transactionRef || `TRX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'verified',
      isAnonymous: formData.isAnonymous,
      isMonthlyRecurring: formData.isMonthlyRecurring,
      studentId: formData.studentId || undefined,
      notes: formData.notes
    };

    onAddDonation(newRecord);
    setIsDonateModalOpen(false);
    setReceiptToView(newRecord);

    // Reset Form
    setFormData({
      donorName: '',
      donorPhone: '',
      donorEmail: '',
      donorCity: '',
      donorCountry: 'India',
      amount: 3000,
      currency: 'INR',
      category: 'sponsorship',
      categoryTitle: getLocalizedCategoryName('sponsorship', currentLang),
      paymentMethod: 'UPI / Google Pay',
      transactionRef: '',
      isAnonymous: false,
      isMonthlyRecurring: false,
      notes: '',
      studentId: ''
    });
  };

  // Filtered donation list
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donorPhone && d.donorPhone.includes(searchTerm)) ||
      (d.notes && d.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`space-y-6 animate-in fade-in duration-300 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 🌟 Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-zinc-950 border border-emerald-800/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950 border border-emerald-400/40 shrink-0">
              🤲
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-white">{t.donationsTitle}</h2>
                <span className="text-xs bg-emerald-500/30 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  {t.lillahOnly}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl">
                {t.donationsSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setSelectedProject(null);
                setSelectedStudentForSponsor(null);
                setIsDonateModalOpen(true);
              }}
              className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{t.btnDonateNow}</span>
            </button>
          </div>
        </div>

        {/* 📊 Metrics Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-800/40">
          <div className="bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-900/40">
            <span className="text-[11px] text-zinc-400 font-bold block">{ui.totalDonationsLabel}</span>
            <span className="text-lg sm:text-xl font-black text-emerald-400">
              {totalDonationsAmount.toLocaleString()} <span className="text-xs text-zinc-400">₹ (INR)</span>
            </span>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-teal-900/40">
            <span className="text-[11px] text-zinc-400 font-bold block">{ui.monthlyPledgeLabel}</span>
            <span className="text-lg sm:text-xl font-black text-teal-300">
              {thisMonthDonations.toLocaleString()} <span className="text-xs text-zinc-400">₹ (INR)</span>
            </span>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-blue-900/40">
            <span className="text-[11px] text-zinc-400 font-bold block">{ui.sponsoredCountLabel}</span>
            <span className="text-lg sm:text-xl font-black text-blue-400">
              {sponsoredStudentIds.size} <span className="text-xs text-zinc-400">/ {students.length}</span>
            </span>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-sm p-3.5 rounded-2xl border border-amber-900/40">
            <span className="text-[11px] text-zinc-400 font-bold block">{ui.donorsCountLabel}</span>
            <span className="text-lg sm:text-xl font-black text-amber-300">
              {totalDonorsCount}
            </span>
          </div>
        </div>
      </div>

      {/* 🧭 Internal Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-zinc-900/90 rounded-2xl border border-zinc-800">
        <button
          onClick={() => setSubTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'projects'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          <span>{t.subTabOverview} ({initialMadrasaDonationProjects.length})</span>
        </button>

        <button
          onClick={() => setSubTab('sponsorship')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'sponsorship'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.subTabSponsorship} ({students.length})</span>
        </button>

        <button
          onClick={() => setSubTab('bank-accounts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'bank-accounts'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.subTabAccounts} ({initialMadrasaBankAccounts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === 'history'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t.subTabHistory} ({donations.length})</span>
        </button>
      </div>

      {/* =====================================================
          TAB 1: DONATION PROJECTS & GIVING CARDS
      ===================================================== */}
      {subTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white">{ui.sectionTitle}</h3>
              <p className="text-xs text-zinc-400">{ui.sectionDesc}</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-xl">
              {ui.lillahFundsBadge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialMadrasaDonationProjects.map((project) => {
              const projectInfo = getLocalizedMadrasaProject(project, currentLang);
              const progress = Math.min(100, Math.round((project.collectedAmount / project.targetAmount) * 100));

              return (
                <div 
                  key={project.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 rounded-3xl p-5 shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {project.icon}
                      </div>
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {projectInfo.unitCostLabel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                        {projectInfo.title}
                      </h4>
                      <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                        {projectInfo.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {projectInfo.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-zinc-400">{ui.raisedText} {project.collectedAmount.toLocaleString()} ₹</span>
                        <span className="text-emerald-400">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Suggested Amount Chips */}
                    <div className="pt-2">
                      <span className="text-[10px] text-zinc-500 font-bold block mb-1.5">{ui.suggestedDonation}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.suggestedAmounts.map((amt) => (
                          <button
                            key={amt}
                            onClick={() => {
                              setSelectedProject(project);
                              setFormData(prev => ({
                                ...prev,
                                category: project.category,
                                categoryTitle: projectInfo.title,
                                amount: amt
                              }));
                              setIsDonateModalOpen(true);
                            }}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-emerald-600 hover:text-white text-zinc-300 border border-zinc-700 transition-all cursor-pointer"
                          >
                            {amt.toLocaleString()} ₹
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Donate Button */}
                  <div className="pt-4 mt-4 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleOpenDonateModal(project)}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 fill-white" />
                      <span>{ui.donateBtnText}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2: STUDENT SPONSORSHIP (کفالتِ طلبہ)
      ===================================================== */}
      {subTab === 'sponsorship' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900/60 to-zinc-900 border border-emerald-700/50 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-2xl flex items-center justify-center border border-emerald-400/30">
                🎓
              </div>
              <div>
                <h3 className="text-base font-black text-white">{ui.sponsorTabHeading}</h3>
                <p className="text-xs text-zinc-300">
                  {ui.sponsorTabSubheading}
                </p>
              </div>
            </div>

            <div className="text-xs bg-zinc-950/80 px-4 py-2 rounded-xl border border-zinc-800 text-zinc-300">
              <span className="text-emerald-300 font-bold">{ui.hadithText}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => {
              const isSponsored = sponsoredStudentIds.has(student.id);
              const studentClass = classes.find(c => c.id === student.classId);
              const classInfo = studentClass ? getLocalizedMadrasaClass(studentClass, currentLang) : null;

              return (
                <div
                  key={student.id}
                  className={`bg-zinc-900/90 border rounded-3xl p-5 shadow-xl flex flex-col justify-between transition-all ${
                    isSponsored 
                      ? 'border-emerald-600/50 bg-emerald-950/10' 
                      : 'border-zinc-800 hover:border-teal-500/50'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg font-black text-emerald-400">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{student.name}</h4>
                          <span className="text-[11px] text-zinc-400">{ui.sonOfText} {student.guardianName}</span>
                        </div>
                      </div>

                      {isSponsored ? (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {ui.sponsoredBadge}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                          {ui.needsSponsorBadge}
                        </span>
                      )}
                    </div>

                    <div className="bg-zinc-950/60 rounded-2xl p-3 border border-zinc-800/80 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{ui.classLabel}</span>
                        <span className="font-bold text-zinc-200">{classInfo?.name || studentClass?.name || 'Quran'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{ui.currentLessonLabel}</span>
                        <span className="font-bold text-emerald-400">{student.currentSabaqSummary || 'Juz 1'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{ui.monthlyFeeLabel}</span>
                        <span className="font-bold text-zinc-200">{student.monthlyFee || 3000} ₹ (INR)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-zinc-800">
                    <button
                      onClick={() => handleOpenDonateModal(undefined, student)}
                      className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSponsored
                          ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isSponsored ? ui.sendExtraAidBtn : ui.sponsorStudentBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 3: BANK ACCOUNTS & DIGITAL PAYMENT WALLETS
      ===================================================== */}
      {subTab === 'bank-accounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-white">{ui.bankHeading}</h3>
              <p className="text-xs text-zinc-400">{ui.bankSubheading}</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
              {ui.officialVerifiedBadge}
            </span>
          </div>

          {/* Primary Featured Card: Google Pay & ICICI Bank Live QR Card */}
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* QR Code Visual Canvas */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-emerald-600/30 max-w-[280px] w-full text-center space-y-3">
                  
                  {/* GPay Header */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      🕌
                    </div>
                    <span className="text-xs font-black text-zinc-800 tracking-tight">
                      Lukman Abdulrahim Malpara
                    </span>
                  </div>

                  {/* QR Image */}
                  <div className="relative mx-auto bg-white p-2 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi%3A%2F%2Fpay%3Fpa%3Dlmalpara5%40okicici%26pn%3DLukman%2520Abdulrahim%2520Malpara%26cu%3DINR"
                      alt="Google Pay UPI QR Code"
                      className="w-44 h-44 object-contain rounded-xl"
                    />
                    {/* Google Pay Center Badge */}
                    <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full p-1 shadow-lg border border-zinc-200 flex items-center justify-center">
                      <span className="text-xs font-black text-blue-600">G<span className="text-red-500">P</span><span className="text-amber-500">a</span><span className="text-green-500">y</span></span>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-zinc-600">
                    {ui.scanQrPrompt}
                  </p>

                  {/* Bank Badge */}
                  <div className="flex items-center justify-center gap-1.5 py-1 px-2.5 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700">
                    <span className="text-red-600 font-extrabold text-sm">ⓘ</span>
                    <span>ICICI Bank 6759</span>
                  </div>

                  {/* UPI ID Box */}
                  <div className="flex items-center justify-between bg-zinc-50 p-2 rounded-xl border border-zinc-200 text-xs">
                    <div className="text-left font-mono">
                      <span className="text-[9px] text-zinc-500 block uppercase">UPI ID</span>
                      <span className="font-bold text-zinc-800 text-xs select-all">lmalpara5@okicici</span>
                    </div>
                    <button
                      onClick={() => handleCopy('lmalpara5@okicici', 'gpay-qr-upi')}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === 'gpay-qr-upi' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{ui.copiedText}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{ui.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Direct Pay Link for Mobile */}
                <a
                  href="upi://pay?pa=lmalpara5@okicici&pn=Lukman%20Abdulrahim%20Malpara&cu=INR"
                  className="mt-3 w-full max-w-[280px] py-2.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 text-white text-xs font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{ui.openGpayBtnText}</span>
                </a>
              </div>

              {/* Account Details Column */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-2.5 py-1 rounded-lg inline-block">
                    {ui.detailsTitle}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-white mt-1.5">
                    Lukman Abdulrahim Malpara
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {ui.detailsSub}
                  </p>
                </div>

                <div className="space-y-2.5 bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800/90 text-xs">
                  
                  {/* Account Title */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                    <span className="text-zinc-400">{ui.accNameLabel}</span>
                    <span className="font-bold text-white text-sm">Lukman Abdulrahim Malpara</span>
                  </div>

                  {/* Bank Name */}
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60">
                    <span className="text-zinc-400">{ui.bankLabel}</span>
                    <span className="font-bold text-zinc-200">ICICI Bank Ltd</span>
                  </div>

                  {/* Account Number with Copy */}
                  <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{ui.accNumLabel}</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm sm:text-base tracking-wider">028101516759</span>
                    </div>
                    <button
                      onClick={() => handleCopy('028101516759', 'icici-acc-main')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedId === 'icici-acc-main' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{ui.copiedText}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{ui.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* IFSC Code with Copy */}
                  <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{ui.ifscLabel}</span>
                      <span className="font-mono font-bold text-teal-300 text-sm tracking-wider">ICIC0000281</span>
                    </div>
                    <button
                      onClick={() => handleCopy('ICIC0000281', 'icici-ifsc-main')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-teal-600 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedId === 'icici-ifsc-main' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{ui.copiedText}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{ui.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* UPI ID with Copy */}
                  <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">{ui.upiLabel}</span>
                      <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">lmalpara5@okicici</span>
                    </div>
                    <button
                      onClick={() => handleCopy('lmalpara5@okicici', 'upi-id-main')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-600 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedId === 'upi-id-main' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>{ui.copiedText}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{ui.copyText}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-zinc-400">
                    <span>{ui.branchCodeLabel} <span className="font-mono text-zinc-300">0281</span></span>
                    <span><span className="text-emerald-400 font-bold">{ui.facilityLabel}</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleOpenDonateModal()}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ui.recordAndGetReceiptBtn}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* All Listed Accounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initialMadrasaBankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                        {acc.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">{acc.bankName}</h4>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-md inline-block mt-0.5">
                          {acc.badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800/90 text-xs">
                    {/* Title */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">{ui.accNameLabel}</span>
                      <span className="font-bold text-zinc-200">{acc.accountTitle}</span>
                    </div>

                    {/* Account / UPI */}
                    <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">
                          {acc.type === 'bank' ? ui.accNumLabel : ui.upiLabel}
                        </span>
                        <span className="font-mono font-bold text-emerald-400 text-xs tracking-wider">{acc.accountNumber}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(acc.accountNumber, `${acc.id}-num`)}
                        className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-emerald-600 text-zinc-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedId === `${acc.id}-num` ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>{ui.copiedText}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{ui.copyText}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* IFSC if bank */}
                    {acc.iban && acc.type === 'bank' && (
                      <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-xl border border-zinc-800">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">{ui.ifscLabel}</span>
                          <span className="font-mono font-bold text-teal-300 text-xs tracking-wider">{acc.iban}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(acc.iban, `${acc.id}-iban`)}
                          className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-teal-600 text-zinc-300 hover:text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === `${acc.id}-iban` ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                              <span>{ui.copiedText}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{ui.copyText}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed">
                    💡 {acc.instructions}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Support Notice */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">📲</span>
              <span className="text-zinc-300">
                {ui.whatsappInstruction}
              </span>
            </div>
            <a
              href="https://wa.me/919876543210?text=Assalamu%20Alaikum!%20I%20have%20sent%20a%20Lillah%20donation%20to%20Jamia%20Taleem-ul-Quran%20Online.%20Please%20issue%20receipt."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{ui.whatsappSendBtn}</span>
            </a>
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 4: DONATION HISTORY & OFFICIAL RECEIPTS
      ===================================================== */}
      {subTab === 'history' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/90 p-3.5 rounded-2xl border border-zinc-800">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`w-4 h-4 text-zinc-400 absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={ui.searchPlaceholderText}
                className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">{ui.allCategoriesText}</option>
                <option value="sponsorship">{getLocalizedCategoryName('sponsorship', currentLang)}</option>
                <option value="teachers">{getLocalizedCategoryName('teachers', currentLang)}</option>
                <option value="ration">{getLocalizedCategoryName('ration', currentLang)}</option>
                <option value="construction">{getLocalizedCategoryName('construction', currentLang)}</option>
                <option value="quran">{getLocalizedCategoryName('quran', currentLang)}</option>
                <option value="lillah">{getLocalizedCategoryName('lillah', currentLang)}</option>
              </select>

              <button
                onClick={() => {
                  setSelectedProject(null);
                  setSelectedStudentForSponsor(null);
                  setIsDonateModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{ui.recordNewDonationBtnText}</span>
              </button>
            </div>
          </div>

          {/* Donations Table */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} text-xs`}>
                <thead>
                  <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-bold">
                    <th className="p-3.5">{ui.thReceipt}</th>
                    <th className="p-3.5">{ui.thDonorName}</th>
                    <th className="p-3.5">{ui.thCategoryName}</th>
                    <th className="p-3.5">{ui.thAmountValue}</th>
                    <th className="p-3.5">{ui.thPaymentChannel}</th>
                    <th className="p-3.5">{ui.thDateVal}</th>
                    <th className="p-3.5">{ui.thStatusVal}</th>
                    <th className="p-3.5 text-center">{ui.thActionVal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-zinc-500">
                        {ui.emptyRecordsText}
                      </td>
                    </tr>
                  ) : (
                    filteredDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-zinc-300">{don.receiptNo}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{don.donorName}</span>
                            {don.isAnonymous && (
                              <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">{ui.anonymousLabel}</span>
                            )}
                          </div>
                          {don.donorCity && (
                            <span className="text-[11px] text-zinc-400 block">{don.donorCity} ({don.donorCountry || 'India'})</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-emerald-300">{don.categoryTitle}</span>
                          {don.notes && (
                            <span className="text-[10px] text-zinc-500 block truncate max-w-xs">{don.notes}</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="font-black text-emerald-400 text-sm">
                            {don.amount.toLocaleString()} {don.currency}
                          </span>
                          {don.isMonthlyRecurring && (
                            <span className="text-[9px] bg-teal-500/20 text-teal-300 font-bold px-1.5 py-0.5 rounded block w-fit mt-0.5">
                              {ui.monthlyRecurringBadge}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className="text-zinc-300 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800 text-[11px]">
                            {don.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5 text-zinc-400 text-[11px]">{don.date}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {ui.receivedStatusText}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setReceiptToView(don)}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>{ui.viewReceiptBtnText}</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL: MAKE / RECORD A DONATION
      ===================================================== */}
      {isDonateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl">
                  🤲
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{ui.modalTitle}</h3>
                  <p className="text-xs text-zinc-400">{ui.modalSub}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDonateModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDonation} className="space-y-4 text-xs">
              
              {/* Category / Project Selector */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1">{ui.formCategoryPrompt}</label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value as MadrasaDonationRecord['category'];
                    setFormData(prev => ({
                      ...prev,
                      category: cat,
                      categoryTitle: getLocalizedCategoryName(cat, currentLang)
                    }));
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="sponsorship">🎓 {getLocalizedCategoryName('sponsorship', currentLang)}</option>
                  <option value="teachers">👳‍♂️ {getLocalizedCategoryName('teachers', currentLang)}</option>
                  <option value="ration">🍲 {getLocalizedCategoryName('ration', currentLang)}</option>
                  <option value="construction">🕌 {getLocalizedCategoryName('construction', currentLang)}</option>
                  <option value="quran">📖 {getLocalizedCategoryName('quran', currentLang)}</option>
                  <option value="lillah">🤲 {getLocalizedCategoryName('lillah', currentLang)}</option>
                </select>
              </div>

              {/* Specific Student Sponsorship Selection if Category is sponsorship */}
              {formData.category === 'sponsorship' && (
                <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-2xl space-y-1.5">
                  <label className="block text-emerald-300 font-bold">{ui.formStudentPrompt}</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => {
                      const stId = e.target.value;
                      const st = students.find(s => s.id === stId);
                      setFormData(prev => ({
                        ...prev,
                        studentId: stId,
                        notes: st ? `${st.name} ${ui.sonOfText} ${st.guardianName}` : ''
                      }));
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">{ui.formGeneralFundOption}</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} {ui.sonOfText} {s.guardianName} ({s.rollNo} - {s.monthlyFee || 3000} ₹)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Amount & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formAmountPrompt}</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-emerald-400 font-black text-base focus:border-emerald-500 focus:outline-none"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formCurrencyPrompt}</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="AED">AED (Dirham)</option>
                    <option value="SAR">SAR (Riyal)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[1500, 3000, 5000, 10000, 25000, 50000].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setFormData(prev => ({ ...prev, amount: amt }))}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      formData.amount === amt 
                        ? 'bg-emerald-600 text-white border-emerald-500' 
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Donor Name & Anonymous */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-zinc-400 font-bold">{ui.formDonorPrompt}</label>
                  <label className="flex items-center gap-1.5 text-zinc-400 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                      className="accent-emerald-500 rounded"
                    />
                    <span>{ui.formAnonCheckbox}</span>
                  </label>
                </div>
                {!formData.isAnonymous && (
                  <input
                    type="text"
                    required={!formData.isAnonymous}
                    value={formData.donorName}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
                    placeholder="Name"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formPhonePrompt}</label>
                  <input
                    type="text"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formCityPrompt}</label>
                  <input
                    type="text"
                    value={formData.donorCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, donorCity: e.target.value }))}
                    placeholder="City / Country"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method & Transaction Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formPayChannelPrompt}</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="UPI / Google Pay">⚡ Google Pay / UPI (lmalpara5@okicici)</option>
                    <option value="ICICI Bank">🏛️ ICICI Bank (028101516759)</option>
                    <option value="PhonePe / Paytm">📱 PhonePe / Paytm</option>
                    <option value="Bank Transfer (NEFT/IMPS)">🏦 Net Banking (NEFT / RTGS / IMPS)</option>
                    <option value="Cash">💵 Cash</option>
                    <option value="Online/Card">🌐 Online Transfer / Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">{ui.formTrxPrompt}</label>
                  <input
                    type="text"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData(prev => ({ ...prev, transactionRef: e.target.value }))}
                    placeholder="UPI Ref / TRX-123456"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Payment Details Info Box inside Modal */}
              <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-1 w-full sm:w-auto">
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    {ui.formDirectPayTitle}
                  </span>
                  <div className="font-bold text-white text-xs">
                    Lukman Abdulrahim Malpara • ICICI Bank
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-300 font-mono">
                    <span>A/C: <b className="text-emerald-300">028101516759</b></span>
                    <span>•</span>
                    <span>IFSC: <b className="text-teal-300">ICIC0000281</b></span>
                    <span>•</span>
                    <span>UPI: <b className="text-amber-300">lmalpara5@okicici</b></span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="upi://pay?pa=lmalpara5@okicici&pn=Lukman%20Abdulrahim%20Malpara&cu=INR"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 transition-all"
                  >
                    <span>GPay</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy('lmalpara5@okicici', 'modal-upi-copy')}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === 'modal-upi-copy' ? ui.copiedText : ui.copyText}
                  </button>
                </div>
              </div>

              {/* Monthly Recurring Checkbox */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isMonthlyRecurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, isMonthlyRecurring: e.target.checked }))}
                  className="accent-emerald-500 rounded w-4 h-4"
                />
                <div>
                  <span className="font-bold text-emerald-300 block">{ui.formPledgeTitle}</span>
                  <span className="text-[10px] text-zinc-400">{ui.formPledgeSub}</span>
                </div>
              </label>

              {/* Notes */}
              <div>
                <label className="block text-zinc-400 font-bold mb-1">{ui.formNotesPrompt}</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsDonateModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  {ui.formCancel}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{ui.formSaveAndGenerateReceipt}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL: OFFICIAL PRINTABLE DONATION RECEIPT (رسیدِ وصولی)
      ===================================================== */}
      {receiptToView && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className="bg-white text-zinc-900 border-4 border-emerald-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 relative animate-in zoom-in-95 font-serif">
            
            {/* Close Button */}
            <button
              onClick={() => setReceiptToView(null)}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-sm cursor-pointer no-print`}
            >
              ✕
            </button>

            {/* Receipt Header */}
            <div className="text-center space-y-1 border-b-2 border-emerald-600 pb-4">
              <div className="text-sm font-arabic font-bold text-emerald-800">
                {ui.receiptBismillahText}
              </div>
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-xl">
                🕌
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                {ui.receiptMadrasaName}
              </h2>
              <p className="text-xs text-zinc-600 font-sans">
                {ui.receiptDeptTitle}
              </p>
              <div className="inline-block bg-emerald-800 text-white font-black text-xs px-4 py-1 rounded-full uppercase tracking-wider mt-1">
                {ui.receiptHeadingTag}
              </div>
            </div>

            {/* Receipt Meta (Serial & Date) */}
            <div className="flex justify-between items-center text-xs font-sans bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <div>
                <span className="text-zinc-600">{ui.receiptNoLabel} </span>
                <span className="font-mono font-bold text-emerald-900">{receiptToView.receiptNo}</span>
              </div>
              <div>
                <span className="text-zinc-600">{ui.receiptDateLabel} </span>
                <span className="font-bold text-zinc-900">{receiptToView.date}</span>
              </div>
            </div>

            {/* Receipt Body Fields */}
            <div className="space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                <span className="text-zinc-500 font-bold">{ui.receiptDonorLabel}</span>
                <span className="font-black text-sm text-zinc-900">{receiptToView.donorName}</span>
              </div>

              {receiptToView.donorCity && (
                <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-bold">{ui.receiptCityLabel}</span>
                  <span className="font-bold text-zinc-800">{receiptToView.donorCity} ({receiptToView.donorCountry || 'India'})</span>
                </div>
              )}

              {receiptToView.donorPhone && (
                <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-bold">{ui.receiptPhoneLabel}</span>
                  <span className="font-mono font-bold text-zinc-800">{receiptToView.donorPhone}</span>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                <span className="text-zinc-500 font-bold">{ui.receiptPurposeLabel}</span>
                <span className="font-black text-emerald-800 text-sm">{receiptToView.categoryTitle}</span>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                <span className="text-zinc-500 font-bold">{ui.receiptMethodLabel}</span>
                <span className="font-bold text-zinc-800">{receiptToView.paymentMethod} ({receiptToView.transactionRef || 'Cash'})</span>
              </div>

              {receiptToView.notes && (
                <div className="border-b border-zinc-200 pb-1.5">
                  <span className="text-zinc-500 font-bold block mb-0.5">{ui.receiptNotesLabel}</span>
                  <span className="text-zinc-700 italic">{receiptToView.notes}</span>
                </div>
              )}

              {/* Amount Box */}
              <div className="bg-emerald-100/80 border-2 border-emerald-600 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-950 font-bold block">{ui.receiptPaidLabel}</span>
                  <span className="text-xl font-black text-emerald-900">
                    {receiptToView.amount.toLocaleString()} {receiptToView.currency === 'INR' ? '₹ (INR)' : receiptToView.currency}
                  </span>
                </div>
                <div className="text-left text-[11px] text-emerald-900 font-bold">
                  {ui.receiptStatusText}
                </div>
              </div>
            </div>

            {/* Islamic Dua Note */}
            <div className="text-center py-2 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
              <span className="font-bold block">{ui.receiptDuaHead}</span>
              <span className="text-[11px] text-zinc-600">{ui.receiptDuaSub}</span>
            </div>

            {/* Signatures & Seal */}
            <div className="flex justify-between items-end pt-4 border-t border-zinc-300 text-[11px] font-sans">
              <div className="text-center space-y-1">
                <div className="w-20 h-10 border border-dashed border-emerald-500 rounded-lg flex items-center justify-center text-[10px] text-emerald-800 font-bold bg-emerald-50">
                  {ui.receiptSealText}
                </div>
                <span className="text-zinc-500 block">{ui.receiptDeptTitle}</span>
              </div>

              <div className="text-center space-y-1">
                <div className="font-signature font-bold text-emerald-900 text-sm">محمد عثمان قاری</div>
                <div className="w-28 border-t border-zinc-400 pt-0.5">
                  <span className="text-zinc-600 block">{ui.receiptAdminSignText}</span>
                </div>
              </div>
            </div>

            {/* Action Bar (Print & Close) */}
            <div className="pt-3 flex items-center justify-between gap-2 no-print font-sans">
              <button
                onClick={() => setReceiptToView(null)}
                className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                {ui.receiptCloseBtn}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `*${ui.receiptMadrasaName} - ${ui.receiptHeadingTag}*\n${ui.receiptNoLabel} ${receiptToView.receiptNo}\n${ui.receiptDonorLabel} ${receiptToView.donorName}\n${ui.receiptPaidLabel} ${receiptToView.amount.toLocaleString()} ${receiptToView.currency === 'INR' ? '₹ (INR)' : receiptToView.currency}\n${ui.receiptPurposeLabel} ${receiptToView.categoryTitle}\n${ui.receiptDateLabel} ${receiptToView.date}\n${ui.receiptDuaHead}`;
                    navigator.clipboard.writeText(text);
                    alert(currentLang === 'ur' ? 'رسید کا متن کاپی ہو گیا ہے! آپ واٹس ایپ پر بھیج سکتے ہیں۔' : 'Receipt text copied to clipboard! You can share it on WhatsApp.');
                  }}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-900 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{ui.receiptShareBtn}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{ui.receiptPrintBtn}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
