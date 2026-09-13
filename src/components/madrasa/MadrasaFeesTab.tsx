import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Download, 
  DollarSign, 
  X, 
  Calendar, 
  Building2, 
  Sparkles,
  ShieldCheck,
  QrCode,
  Share2,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { MadrasaFeeRecord, MadrasaStudent, MadrasaClass } from '../../data/madrasaData';

interface MadrasaFeesTabProps {
  fees: MadrasaFeeRecord[];
  students: MadrasaStudent[];
  classes: MadrasaClass[];
  onAddFeeRecord: (record: MadrasaFeeRecord) => void;
  onUpdateFeeRecord: (record: MadrasaFeeRecord) => void;
}

export const MadrasaFeesTab: React.FC<MadrasaFeesTabProps> = ({
  fees,
  students,
  classes,
  onAddFeeRecord,
  onUpdateFeeRecord
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'partial'>('all');
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<MadrasaFeeRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [month, setMonth] = useState('اگست 2026');
  const [feeAmount, setFeeAmount] = useState(2000);
  const [paidAmount, setPaidAmount] = useState(2000);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Online UPI' | 'UPI / GPay' | 'PhonePe / Paytm'>('UPI / GPay');
  const [notes, setNotes] = useState('');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Update default fee amount when student changes
  const handleStudentChange = (id: string) => {
    setSelectedStudentId(id);
    const stu = students.find(s => s.id === id);
    if (stu) {
      setFeeAmount(stu.monthlyFee);
      setPaidAmount(stu.monthlyFee);
    }
  };

  const generateFeeWhatsAppText = (fee: MadrasaFeeRecord) => {
    const stu = students.find(s => s.id === fee.studentId);
    const cls = classes.find(c => c.id === stu?.classId);
    const arrears = Math.max(0, fee.feeAmount - fee.paidAmount);

    if (fee.status === 'paid') {
      return `*🧾 جامعۃ تعلیم القرآن آن لائن - آفیشل فیس رسید*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ!\n` +
        `محترم والدین/سرپرست،\n\n` +
        `👤 *طالب علم:* ${stu?.name} (رول نمبر: ${stu?.rollNo})\n` +
        `🏫 *کلاس:* ${cls?.name || 'تعلیم القرآن'}\n` +
        `📅 *مہینہ / سیشن:* ${fee.month}\n` +
        `🔢 *رسید نمبر:* ${fee.receiptNo}\n` +
        `💵 *وصول شدہ رقم:* *₹ ${fee.paidAmount.toLocaleString()} (INR)*\n` +
        `💳 *طریقۂ ادائیگی:* ${fee.paymentMethod || 'آن لائن'}\n` +
        `📆 *تاریخ:* ${fee.paidDate || new Date().toISOString().split('T')[0]}\n\n` +
        `جزاکم اللہ خیراً و احسن الجزاء۔ اللہ تعالی آپ کے مال میں برکت عطا فرمائے۔\n` +
        `ادارہ جامعۃ تعلیم القرآن آن لائن`;
    } else {
      return `*🔔 جامعۃ تعلیم القرآن آن لائن - ماہانہ فیس یاد دہانی*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ!\n` +
        `محترم سرپرست، طالب علم *${stu?.name}* (رول نمبر: ${stu?.rollNo}) کی ماہِ *${fee.month}* کی فیس برائے کرم جلد از جلد جمع فرما دیں۔\n\n` +
        `💰 *مقررہ فیس:* ₹ ${fee.feeAmount.toLocaleString()}\n` +
        `⚠️ *بقایا رقم:* *₹ ${arrears.toLocaleString()}*\n\n` +
        `جزاکم اللہ خیراً۔\nادارہ جامعۃ تعلیم القرآن آن لائن`;
    }
  };

  const handleShareFeeWhatsApp = (fee: MadrasaFeeRecord) => {
    const stu = students.find(s => s.id === fee.studentId);
    const text = generateFeeWhatsAppText(fee);
    const phone = stu?.phone ? stu.phone.replace(/[^0-9]/g, '') : '';
    const url = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyFeeText = (fee: MadrasaFeeRecord) => {
    const text = generateFeeWhatsAppText(fee);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(fee.id);
      showToast('📋 فیس رسید کا ٹیکسٹ کاپی ہو گیا!');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSendPendingRemindersWhatsApp = () => {
    const pendingList = fees.filter(f => f.status === 'pending' || f.status === 'partial');
    if (pendingList.length === 0) {
      showToast('ماشاء اللہ! تمام فیسیں وصول ہو چکی ہیں، کوئی بقایا نہیں۔');
      return;
    }

    let summary = `*📢 جامعۃ تعلیم القرآن آن لائن - بقایا فیس یاد دہانی*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `محترم والدین و طلبہ، درج ذیل سیشن کی فیس فوری ادا فرمائیں:\n\n`;

    pendingList.forEach((fee, i) => {
      const stu = students.find(s => s.id === fee.studentId);
      const remaining = fee.feeAmount - fee.paidAmount;
      summary += `${i + 1}. *${stu?.name}* (رول: ${stu?.rollNo}) - مہینہ: ${fee.month} - بقایا: *₹ ${remaining}*\n`;
    });

    summary += `\nجزاکم اللہ خیراً۔ رابطہ: ادارہ جامعۃ تعلیم القرآن آن لائن`;
    const url = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  const handleOpenCollect = () => {
    const firstStu = students[0];
    setSelectedStudentId(firstStu?.id || '');
    setMonth('اگست 2026');
    setFeeAmount(firstStu?.monthlyFee || 2000);
    setPaidAmount(firstStu?.monthlyFee || 2000);
    setPaymentMethod('UPI / GPay');
    setNotes('');
    setIsCollectModalOpen(true);
  };

  const handleSubmitFee = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = Number(feeAmount) || 0;
    const paid = Number(paidAmount) || 0;
    const status: 'paid' | 'pending' | 'partial' = 
      paid >= fee ? 'paid' : paid > 0 ? 'partial' : 'pending';

    const newRecord: MadrasaFeeRecord = {
      id: `FEE-${Date.now()}`,
      studentId: selectedStudentId,
      month,
      year: 2026,
      feeAmount: fee,
      paidAmount: paid,
      status,
      dueDate: '2026-08-10',
      paidDate: paid > 0 ? new Date().toISOString().split('T')[0] : undefined,
      paymentMethod: paid > 0 ? paymentMethod : undefined,
      receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      notes
    };

    onAddFeeRecord(newRecord);
    setIsCollectModalOpen(false);
  };

  // Analytics
  const totalFeesExpected = fees.reduce((acc, f) => acc + f.feeAmount, 0);
  const totalFeesCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = Math.max(0, totalFeesExpected - totalFeesCollected);
  const paidCount = fees.filter(f => f.status === 'paid').length;
  const pendingCount = fees.filter(f => f.status === 'pending' || f.status === 'partial').length;

  const filteredFees = fees.filter(fee => {
    const stu = students.find(s => s.id === fee.studentId);
    const matchesSearch = 
      stu?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu?.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 font-bold block">کُل واجب الادا فیس</span>
            <span className="text-2xl font-black text-white">₹ {totalFeesExpected.toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
            💵
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-400 font-bold block">کُل وصول شدہ فیس</span>
            <span className="text-2xl font-black text-emerald-300">₹ {totalFeesCollected.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 block font-bold">({paidCount} ادا شدہ رسیدیں)</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-lg">
            ✅
          </div>
        </div>

        <div className="bg-amber-950/40 border border-amber-800/40 p-4 rounded-3xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-400 font-bold block">بقایا جات (Pending Dues)</span>
            <span className="text-2xl font-black text-amber-300">₹ {totalPending.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400 block font-bold">({pendingCount} نامکمل / زیر التواء)</span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-lg">
            ⏳
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-xl">
            💳
          </div>
          <div>
            <h3 className="text-base font-black text-white">فیس مینجمنٹ و رسیدات</h3>
            <p className="text-xs text-zinc-400">فیس اندراج، وصولی اور انوائس جنریٹر</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value="all">تمام فیس ریکارڈز</option>
            <option value="paid">✅ ادا شدہ (Paid)</option>
            <option value="partial">⚠️ نامکمل (Partial)</option>
            <option value="pending">⏳ زیر التواء (Pending)</option>
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="طالب علم یا رسید نمبر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            onClick={handleSendPendingRemindersWhatsApp}
            className="px-3.5 py-2 bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-amber-500/40 cursor-pointer transition-all shrink-0 shadow"
            title="تمام بقایا داران کو واٹس ایپ پر فیس یاد دہانی بھیجیں"
          >
            <Send className="w-3.5 h-3.5" />
            <span>بقایا فیس واٹس ایپ</span>
          </button>

          <button
            onClick={handleOpenCollect}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-teal-900/40 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>فیس وصولی درج کریں</span>
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold text-center shadow-lg animate-fadeIn border border-emerald-400">
          {feedbackToast}
        </div>
      )}

      {/* Fees Records Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">رسید نمبر</th>
                <th className="p-3.5">طالب علم / رول نمبر</th>
                <th className="p-3.5">کلاس / درجہ</th>
                <th className="p-3.5">مہینہ / سال</th>
                <th className="p-3.5">مقررہ فیس</th>
                <th className="p-3.5">ادا شدہ</th>
                <th className="p-3.5">اسٹیٹس (Status)</th>
                <th className="p-3.5 text-center">واٹس ایپ / رسید</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredFees.length > 0 ? (
                filteredFees.map((fee) => {
                  const student = students.find(s => s.id === fee.studentId);
                  const stuClass = classes.find(c => c.id === student?.classId);

                  return (
                    <tr key={fee.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-zinc-400" dir="ltr">{fee.receiptNo}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{student?.name || 'نامعلوم طالب علم'}</span>
                        <span className="text-[10px] text-zinc-400 font-mono" dir="ltr">{student?.rollNo}</span>
                      </td>
                      <td className="p-3.5 text-zinc-300">{stuClass?.name || '—'}</td>
                      <td className="p-3.5 text-zinc-300">{fee.month}</td>
                      <td className="p-3.5 font-bold text-white">₹ {fee.feeAmount.toLocaleString()}</td>
                      <td className="p-3.5 font-black text-emerald-400">₹ {fee.paidAmount.toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                          fee.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : fee.status === 'partial'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {fee.status === 'paid' ? '✅ مکمل ادا شدہ' : fee.status === 'partial' ? '⚠️ جزوی ادا' : '⏳ زیر التواء'}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleShareFeeWhatsApp(fee)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                              fee.status === 'paid'
                                ? 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 border-emerald-700/60'
                                : 'bg-amber-950/70 hover:bg-amber-900 text-amber-400 border-amber-700/60'
                            }`}
                            title={fee.status === 'paid' ? 'واٹس ایپ پر فیس رسید بھیجیں' : 'واٹس ایپ پر بقایا فیس کی یاد دہانی بھیجیں'}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewingReceipt(fee)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-teal-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 border border-zinc-700"
                            title="رسید دیکھیں و پرنٹ کریں"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>رسید</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    کوئی فیس ریکارڈ نہیں ملا۔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Fee Modal */}
      {isCollectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-400" />
                <span>فیس وصولی کا اندراج</span>
              </h3>
              <button 
                onClick={() => setIsCollectModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitFee} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">طالب علم منتخب کریں *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                >
                  {students.map(s => {
                    const c = classes.find(cl => cl.id === s.classId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo}) — {c?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">مہینہ / سیشن</label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">کل مقررہ فیس (₹ / INR)</label>
                  <input
                    type="number"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">وصول شدہ رقم (₹ / INR)</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">طریقۂ ادائیگی (Payment Mode)</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                  >
                    <option value="UPI / GPay">⚡ یو پی آئی و گوگل پے (UPI / GPay)</option>
                    <option value="PhonePe / Paytm">📱 فون پے / پے ٹی ایم (PhonePe / Paytm)</option>
                    <option value="Bank Transfer">🏛️ نیٹ بینکنگ / بینک ٹرانسفر (IMPS/NEFT)</option>
                    <option value="Cash">💵 نقد رقم (Cash)</option>
                    <option value="Online UPI">🌐 آن لائن پیمنٹ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">اضافی نوٹس / ٹرانزیکشن آئی ڈی</label>
                <input
                  type="text"
                  placeholder="مثال: Trx ID # 987654 / نقد موصول ہوا"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCollectModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
                >
                  فیس رسید محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Fee Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 border border-zinc-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="text-xs font-bold text-zinc-500">آفیشل فیس رسید و تصدیق نامہ</span>
              <button 
                onClick={() => setViewingReceipt(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Content */}
            <div className="p-4 bg-amber-50/50 border-2 border-dashed border-amber-300 rounded-2xl space-y-4" id="printable-fee-receipt">
              
              <div className="text-center space-y-1 border-b border-amber-200/80 pb-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl shadow">
                  🕌
                </div>
                <h3 className="text-lg font-black text-emerald-950">جامعۃ تعلیم القرآن آن لائن</h3>
                <p className="text-[11px] text-zinc-600 font-medium">شعبہ مالیات و فیس رسید (Official Fee Voucher)</p>
                <span className="inline-block text-[10px] font-mono bg-zinc-900 text-white px-2 py-0.5 rounded font-bold" dir="ltr">
                  {viewingReceipt.receiptNo}
                </span>
              </div>

              {/* Student Details */}
              {(() => {
                const stu = students.find(s => s.id === viewingReceipt.studentId);
                const cls = classes.find(c => c.id === stu?.classId);

                return (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">نام طالب علم:</span>
                      <strong className="text-zinc-950">{stu?.name}</strong>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">رول نمبر:</span>
                      <strong className="font-mono text-zinc-950" dir="ltr">{stu?.rollNo}</strong>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">سرپرست / والد:</span>
                      <strong className="text-zinc-950">{stu?.guardianName}</strong>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">کلاس / درجہ:</span>
                      <strong className="text-emerald-900">{cls?.name}</strong>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">مہینہ / سیشن:</span>
                      <strong className="text-zinc-950">{viewingReceipt.month}</strong>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/50 py-1">
                      <span className="text-zinc-600">طریقۂ ادائیگی:</span>
                      <strong className="text-zinc-950">{viewingReceipt.paymentMethod || 'Cash'}</strong>
                    </div>

                    <div className="pt-2 flex justify-between items-center text-sm font-black bg-emerald-100/60 p-2.5 rounded-xl text-emerald-950">
                      <span>وصول شدہ رقم:</span>
                      <span>₹ {viewingReceipt.paidAmount.toLocaleString()} (INR)</span>
                    </div>

                    {viewingReceipt.feeAmount > viewingReceipt.paidAmount && (
                      <div className="flex justify-between items-center text-xs font-bold text-amber-900 bg-amber-100/60 p-2 rounded-xl">
                        <span>بقایا رقم (Arrears):</span>
                        <span>₹ {(viewingReceipt.feeAmount - viewingReceipt.paidAmount).toLocaleString()} (INR)</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Stamp & Signature footer */}
              <div className="pt-4 flex justify-between items-end text-[10px] text-zinc-600">
                <div className="text-center">
                  <div className="w-16 h-10 border-b border-zinc-400 mb-1 flex items-center justify-center font-bold text-emerald-800">
                    [ مہر مدرسہ ]
                  </div>
                  <span>دستخط ناظم مالیات</span>
                </div>
                <div className="text-left text-[9px] text-zinc-400 font-mono">
                  تاریخ: {viewingReceipt.paidDate || new Date().toISOString().split('T')[0]}
                </div>
              </div>

            </div>

            {/* Print & Share Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => handleShareFeeWhatsApp(viewingReceipt)}
                className="w-full sm:flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>واٹس ایپ پر رسید بھیجیں (WhatsApp)</span>
              </button>
              <button
                onClick={() => handleCopyFeeText(viewingReceipt)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                title="فیس رسید کا ٹیکسٹ کاپی کریں"
              >
                {copiedId === viewingReceipt.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === viewingReceipt.id ? 'کاپی ہو گیا' : 'کاپی'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>پی ڈی ایف / پرنٹ</span>
              </button>
              <button
                onClick={() => setViewingReceipt(null)}
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs font-bold rounded-xl cursor-pointer"
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
