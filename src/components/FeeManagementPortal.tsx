import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  User, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Printer,
  Trash2
} from 'lucide-react';
import { LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';

interface FeeManagementPortalProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

interface StudentFeeRecord {
  id: string;
  studentName: string;
  guardianName: string;
  courseName: string;
  monthlyFee: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Partial';
  dueDate: string;
  lastPaymentDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

const INITIAL_RECORDS: StudentFeeRecord[] = [];

export const FeeManagementPortal: React.FC<FeeManagementPortalProps> = ({ currentLang, onBack }) => {
  const [records, setRecords] = useState<StudentFeeRecord[]>(() => {
    const saved = localStorage.getItem('talimul_quran_fees');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: StudentFeeRecord) => !r.id?.startsWith('STU-10') && !r.transactionId?.startsWith('TXN-98234'));
        }
      } catch (e) {
        return [];
      }
    }
    return INITIAL_RECORDS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Pending' | 'Partial'>('All');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StudentFeeRecord | null>(null);

  // Back Button Handlers (Hierarchy: Modals > Return to Home)
  useBackHandler(() => {
    setShowAddModal(false);
  }, showAddModal, 50, 'fee_add_modal');

  useBackHandler(() => {
    setShowPayModal(false);
  }, showPayModal, 50, 'fee_pay_modal');

  useBackHandler(() => {
    setShowReceiptModal(false);
  }, showReceiptModal, 50, 'fee_receipt_modal');

  useBackHandler(() => {
    onBack();
  }, !showAddModal && !showPayModal && !showReceiptModal, 20, 'fee_root_back');

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newCourseName, setNewCourseName] = useState('مدنی قاعدہ و تجوید');
  const [newMonthlyFee, setNewMonthlyFee] = useState('1500');
  const [newDueDate, setNewDueDate] = useState('2026-08-15');

  // Online Payment Form
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI / Online (GooglePay/PhonePe)');
  const [payerName, setPayerName] = useState('');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('talimul_quran_fees', JSON.stringify(records));
  }, [records]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newRecord: StudentFeeRecord = {
      id: `STU-${Math.floor(100 + Math.random() * 900)}`,
      studentName: newStudentName,
      guardianName: newGuardianName || 'والد محترم',
      courseName: newCourseName,
      monthlyFee: Number(newMonthlyFee) || 1500,
      paidAmount: 0,
      status: 'Pending',
      dueDate: newDueDate,
    };

    setRecords([newRecord, ...records]);
    setNewStudentName('');
    setNewGuardianName('');
    setShowAddModal(false);
  };

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const amount = Number(payAmount) || 0;
    if (amount <= 0) return;

    const updatedPaid = selectedRecord.paidAmount + amount;
    const newStatus: 'Paid' | 'Pending' | 'Partial' = 
      updatedPaid >= selectedRecord.monthlyFee ? 'Paid' : 'Partial';

    const txId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    const updatedRecord: StudentFeeRecord = {
      ...selectedRecord,
      paidAmount: updatedPaid,
      status: newStatus,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      transactionId: txId
    };

    setRecords(records.map(r => r.id === selectedRecord.id ? updatedRecord : r));
    setSelectedRecord(updatedRecord);
    setPaymentSuccessMsg('فیس کامیابی کے ساتھ جمع ہو گئی! (Fee Paid Successfully)');
    
    setTimeout(() => {
      setShowPayModal(false);
      setShowReceiptModal(true);
      setPaymentSuccessMsg('');
      setPayAmount('');
    }, 1000);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('کیا آپ اس طالبعلم کا ریکارڈ حذف کرنا چاہتے ہیں؟')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' ? true : r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCollected = records.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const totalPending = records.reduce((acc, curr) => acc + Math.max(0, curr.monthlyFee - curr.paidAmount), 0);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#121212] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/90 border border-emerald-800/40 p-5 rounded-3xl shadow-xl">
          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-emerald-400">آن لائن فیس اور ریکارڈ مینجمنٹ سسٹم</h1>
            <p className="text-xs text-zinc-400">تعليم القرآن - فیس وصولی، ادائیگی اور ریکارڈ کا محفوظ ڈیجیٹل نظام</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-90 text-white text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>نیا طالبعلم درج کریں</span>
          </button>
        </div>

        {/* Financial Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-400">کل طلباء (Total Students)</p>
              <h3 className="text-2xl font-black text-white mt-1">{records.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800">
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-400">وصول شدہ فیس (Total Collected)</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-1">INR {totalCollected.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-950/80 text-teal-400 flex items-center justify-center border border-teal-800">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-400">بقیہ واجب الادا (Pending Dues)</p>
              <h3 className="text-2xl font-black text-rose-400 mt-1">INR {totalPending.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 text-rose-400 flex items-center justify-center border border-rose-800">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="طالبعلم کا نام یا آئی ڈی تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Paid', 'Pending', 'Partial'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                }`}
              >
                {status === 'All' ? 'تمام ریکارڈ' : status === 'Paid' ? 'ادا شدہ (Paid)' : status === 'Pending' ? 'بقیہ (Pending)' : 'جزوی (Partial)'}
              </button>
            ))}
          </div>
        </div>

        {/* Records Table Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-zinc-800/90 text-zinc-300 text-xs sm:text-sm font-bold border-b border-zinc-700">
                  <th className="p-4 text-center">آئی ڈی</th>
                  <th className="p-4">طالبعلم کا نام / سرپرست</th>
                  <th className="p-4">کورس</th>
                  <th className="p-4 text-center">کل فیس</th>
                  <th className="p-4 text-center">ادا شدہ</th>
                  <th className="p-4 text-center">سٹیٹس</th>
                  <th className="p-4 text-center">کارروائی (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-xs sm:text-sm">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      کوئی ریکارڈ نہیں ملا۔
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const isPaid = rec.status === 'Paid';
                    const isPartial = rec.status === 'Partial';
                    return (
                      <tr key={rec.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="p-4 font-mono text-xs text-zinc-400 text-center font-bold">
                          {rec.id}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{rec.studentName}</div>
                          <div className="text-[11px] text-zinc-400">والدین: {rec.guardianName}</div>
                        </td>
                        <td className="p-4 text-zinc-300 font-medium">
                          {rec.courseName}
                        </td>
                        <td className="p-4 font-bold text-center text-zinc-200">
                          INR {rec.monthlyFee}
                        </td>
                        <td className="p-4 font-bold text-center text-emerald-400">
                          INR {rec.paidAmount}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                            isPaid
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : isPartial
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}>
                            {isPaid && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isPartial && <Clock className="w-3.5 h-3.5" />}
                            {!isPaid && !isPartial && <AlertCircle className="w-3.5 h-3.5" />}
                            <span>{isPaid ? 'ادا شدہ' : isPartial ? 'جزوی ادائیگی' : 'بقیہ ہے'}</span>
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedRecord(rec);
                                setPayAmount((rec.monthlyFee - rec.paidAmount).toString());
                                setPayerName(rec.studentName);
                                setShowPayModal(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>فیس ادا کریں</span>
                            </button>

                            {rec.transactionId && (
                              <button
                                onClick={() => {
                                  setSelectedRecord(rec);
                                  setShowReceiptModal(true);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>رسید</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteRecord(rec.id)}
                              className="p-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-400 border border-rose-800 transition-colors cursor-pointer"
                              title="حذف کریں"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: ADD NEW STUDENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-emerald-600/50 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>نیا طالبعلم اور فیس ریکارڈ درج کریں</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">طالبعلم کا نام (Student Name)</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: محمد عثمان"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">سرپرست / والد کا نام (Guardian Name)</label>
                <input
                  type="text"
                  placeholder="مثلاً: طارق جمیل"
                  value={newGuardianName}
                  onChange={(e) => setNewGuardianName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">کورس کا انتخاب (Course)</label>
                <select
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="مدنی قاعدہ و تجوید">مدنی قاعدہ و تجوید</option>
                  <option value="ناظره قرآن پاک">ناظره قرآن پاک</option>
                  <option value="حفظ القرآن">حفظ القرآن</option>
                  <option value="دعاٸیں و نماز کورس">دعاٸیں و نماز کورس</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">ماہانہ فیس (Monthly Fee in INR)</label>
                <input
                  type="number"
                  required
                  value={newMonthlyFee}
                  onChange={(e) => setNewMonthlyFee(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">آخری تاریخ (Due Date)</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-lg"
                >
                  محفوظ کریں (Save)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ONLINE PAYMENT PORTAL */}
      {showPayModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-emerald-600/50 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>آن لائن فیس ادائیگی گیٹ وے (Secure Checkout)</span>
              </h3>
              <button 
                onClick={() => setShowPayModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">طالبعلم:</span>
                <span className="font-bold text-white">{selectedRecord.studentName} ({selectedRecord.id})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">کورس:</span>
                <span className="font-bold text-white">{selectedRecord.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">بقیہ واجب الادا فیس:</span>
                <span className="font-bold text-emerald-400">INR {Math.max(0, selectedRecord.monthlyFee - selectedRecord.paidAmount)}</span>
              </div>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-6 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-center space-y-2 animate-pulse">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400" />
                <div className="font-bold text-base">{paymentSuccessMsg}</div>
                <p className="text-xs text-emerald-400/80">رسید تیار کی جارہی ہے...</p>
              </div>
            ) : (
              <form onSubmit={handleMakePayment} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">ادا کرنے کی رقم (Amount in INR)</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-base font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">پেমنٹ گیٹ وے کا طریقہ (Payment Gateway Method)</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="Debit / Credit Card (Stripe/Visa)">💳 Debit / Credit Card (Visa / Mastercard)</option>
                    <option value="EasyPaisa / JazzCash Mobile Wallet">📱 EasyPaisa / JazzCash Mobile Wallet</option>
                    <option value="Raast / Bank Transfer (IBAN)">🏦 Raast Instant / Bank Wire Transfer</option>
                    <option value="UPI / QR Code Scan">📲 UPI / QR Code Scan (GooglePay/PhonePe)</option>
                  </select>
                </div>

                {payMethod.includes('Card') && (
                  <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-400 font-bold">কার্ড نمبر (Card Number)</label>
                      <input type="text" placeholder="4242 •••• •••• 4242" defaultValue="4242 4242 4242 4242" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-400 font-bold">میعاد ختم (MM/YY)</label>
                        <input type="text" placeholder="12/28" defaultValue="12/28" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-zinc-400 font-bold">CVV</label>
                        <input type="password" placeholder="123" defaultValue="123" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod.includes('Wallet') && (
                  <div className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-700 space-y-2">
                    <label className="text-[11px] text-zinc-400 font-bold">موبائل والٹ نمبر (Mobile Account No)</label>
                    <input type="text" placeholder="0300-1234567" defaultValue="0300-9876543" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs" />
                    <p className="text-[10px] text-emerald-400">MPIN درج کرنے کی ضرورت نہیں، سینڈ باکس ٹیسٹ موڈ فعال ہے۔</p>
                  </div>
                )}

                {payMethod.includes('QR') && (
                  <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 text-zinc-900">
                    <div className="w-28 h-28 bg-zinc-100 border-2 border-dashed border-zinc-400 rounded-xl flex items-center justify-center p-2 text-center text-[10px] font-bold text-zinc-600">
                      📷 Scan QR via Raast or Banking App
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700">Taleem-ul-Quran Merchant ID: #TQ-99882</div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">جمع کرانے والے کا نام (Payer Name)</label>
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPayModal(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                  >
                    منسوخ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold cursor-pointer shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>محفوظ ادائیگی کریں (Pay Now)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: DIGITAL RECEIPT */}
      {showReceiptModal && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-zinc-900 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6 relative border-4 border-emerald-600">
            
            <div className="text-center space-y-1 border-b border-zinc-200 pb-4">
              <div className="w-12 h-12 mx-auto bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-1">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-emerald-800">تعليم القرآن (رسمی فیس رسید)</h2>
              <p className="text-xs text-zinc-500">Official Digital Fee Receipt - Maktab-ul-Madinah</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">ٹرানزیکشن آئی ڈی:</span>
                <span className="font-mono font-bold text-zinc-900">{selectedRecord.transactionId || 'TXN-982341'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">طالبعلم کا نام:</span>
                <span className="font-bold text-zinc-900">{selectedRecord.studentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">سرپرست:</span>
                <span className="font-bold text-zinc-900">{selectedRecord.guardianName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">کورس:</span>
                <span className="font-bold text-zinc-900">{selectedRecord.courseName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">ادائیگی کا طریقہ:</span>
                <span className="font-bold text-emerald-700">{selectedRecord.paymentMethod || 'Online'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">تاریخ:</span>
                <span className="font-bold text-zinc-900">{selectedRecord.lastPaymentDate || new Date().toISOString().split('T')[0]}</span>
              </div>
              <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-xl font-bold text-sm">
                <span className="text-emerald-900">ادا شدہ رقم:</span>
                <span className="text-emerald-700">INR {selectedRecord.paidAmount}</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-zinc-400">
              یہ کمپیوٹر سے تیار کردہ مصدقہ ڈیجیٹل فیس رسید ہے۔
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>پرنٹ / ڈاؤن لوڈ</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                بند کریں
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
