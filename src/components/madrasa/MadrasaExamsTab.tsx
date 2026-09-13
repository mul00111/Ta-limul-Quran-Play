import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Printer, 
  Download, 
  CheckCircle2, 
  X, 
  Calendar, 
  Star, 
  Sparkles,
  BookOpen,
  GraduationCap,
  Share2,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import { MadrasaExam, MadrasaStudent, MadrasaClass } from '../../data/madrasaData';

interface MadrasaExamsTabProps {
  exams: MadrasaExam[];
  students: MadrasaStudent[];
  classes: MadrasaClass[];
  onAddExam: (exam: MadrasaExam) => void;
  onUpdateExam: (exam: MadrasaExam) => void;
}

export const MadrasaExamsTab: React.FC<MadrasaExamsTabProps> = ({
  exams,
  students,
  classes,
  onAddExam,
  onUpdateExam
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCertificate, setViewingCertificate] = useState<MadrasaExam | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('سالانہ امتحان تجوید و حفظ القرآن 2026');
  const [examType, setExamType] = useState<'monthly' | 'midterm' | 'final' | 'tajweed_test'>('final');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [makharijMarks, setMakharijMarks] = useState(28);
  const [hifzMarks, setHifzMarks] = useState(38);
  const [deeniyatMarks, setDeeniyatMarks] = useState(29);
  const [examinerRemarks, setExaminerRemarks] = useState('شاندار کارکردگی اور بہترین تجوید و تلفظ۔ مبارکباد!');

  const totalMarks = 100;
  const obtainedMarks = Number(makharijMarks) + Number(hifzMarks) + Number(deeniyatMarks);
  const percentage = Math.round((obtainedMarks / totalMarks) * 100);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const getCalculatedGrade = (pct: number) => {
    if (pct >= 90) return 'A+ (ممتاز)';
    if (pct >= 80) return 'A (بہت اچھا)';
    if (pct >= 65) return 'B (مناسب)';
    if (pct >= 50) return 'C (مقبول)';
    return 'D (توجہ طلب)';
  };

  const generateExamWhatsAppText = (exam: MadrasaExam) => {
    const stu = students.find(s => s.id === exam.studentId);
    const stuClass = classes.find(c => c.id === exam.classId);
    const pct = Math.round((exam.obtainedMarks / exam.totalMarks) * 100);

    const subjectsText = exam.subjects?.map(sub => `• ${sub.name}: *${sub.obtainedMarks} / ${sub.maxMarks}*`).join('\n') || '';

    return `*🏆 جامعۃ تعلیم القرآن آن لائن - امتحانی نتیجہ و رزلٹ کارڈ*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ!\n` +
      `محترم والدین/سرپرست،\n\n` +
      `👤 *طالب علم:* ${stu?.name}\n` +
      `🆔 *رول نمبر:* ${stu?.rollNo}\n` +
      `🏫 *کلاس:* ${stuClass?.name || 'تعلیم القرآن'}\n` +
      `📅 *امتحان:* ${exam.title} (تاریخ: ${exam.date})\n\n` +
      `📊 *مضامین و تفصیلی نمبرات:*\n` +
      `${subjectsText}\n\n` +
      `🎯 *کُل نمبرات:* *${exam.obtainedMarks}* / ${exam.totalMarks} (${pct}%)\n` +
      `🏅 *گریڈ / پوزیشن:* *${exam.grade}*\n` +
      `📝 *ممتحن کی رائے:* _"${exam.examinerRemarks}"_\n\n` +
      `ماشاء اللہ! طالب علم کی محنت اور تجوید شاندار ہے۔ مبارکباد! 💐\n` +
      `ادارہ جامعۃ تعلیم القرآن آن لائن`;
  };

  const handleShareExamWhatsApp = (exam: MadrasaExam) => {
    const stu = students.find(s => s.id === exam.studentId);
    const text = generateExamWhatsAppText(exam);
    const phone = stu?.phone ? stu.phone.replace(/[^0-9]/g, '') : '';
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyExamText = (exam: MadrasaExam) => {
    const text = generateExamWhatsAppText(exam);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(exam.id);
      showToast('📋 رزلٹ کارڈ کا ٹیکسٹ کاپی ہو گیا!');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleShareClassSummaryWhatsApp = () => {
    if (filteredExams.length === 0) {
      showToast('کوئی امتحانی نتیجہ موجود نہیں ہے۔');
      return;
    }

    let summary = `*📊 جامعۃ تعلیم القرآن آن لائن - کلاس رزلٹ سمری*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `کُل طلبہ: ${filteredExams.length}\n\n`;

    filteredExams.forEach((ex, idx) => {
      const stu = students.find(s => s.id === ex.studentId);
      const pct = Math.round((ex.obtainedMarks / ex.totalMarks) * 100);
      summary += `${idx + 1}. *${stu?.name}* (رول: ${stu?.rollNo}) - نمبر: *${ex.obtainedMarks}/${ex.totalMarks}* (${pct}%) - گریڈ: *${ex.grade}*\n`;
    });

    summary += `\nماشاء اللہ! تمام کامیاب طلبہ اور والدین کو مبارک ہو۔\nادارہ جامعۃ تعلیم القرآن آن لائن`;
    const url = `https://wa.me/?text=${encodeURIComponent(summary)}`;
    window.open(url, '_blank');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleOpenAdd = () => {
    setTitle('سالانہ امتحان تجوید و حفظ القرآن 2026');
    setExamType('final');
    setDate(new Date().toISOString().split('T')[0]);
    setMakharijMarks(28);
    setHifzMarks(38);
    setDeeniyatMarks(29);
    setExaminerRemarks('شاندار کارکردگی اور بہترین تجوید و تلفظ۔ مبارکباد!');
    setIsAddModalOpen(true);
  };

  const handleSubmitExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const stu = students.find(s => s.id === selectedStudentId);
    const calculatedGrade = getCalculatedGrade(percentage);
    const passed = percentage >= 50;

    const newExam: MadrasaExam = {
      id: `EXM-${Date.now()}`,
      title,
      examType,
      classId: stu?.classId || 'CLS-1',
      studentId: selectedStudentId,
      date,
      totalMarks,
      obtainedMarks,
      grade: calculatedGrade,
      passed,
      examinerRemarks,
      subjects: [
        { name: 'مخارج و تجوید کے قواعد', maxMarks: 30, obtainedMarks: Number(makharijMarks) },
        { name: 'حفظ و ناظرہ کی روانی', maxMarks: 40, obtainedMarks: Number(hifzMarks) },
        { name: 'دینیات، کلمے و مسنون دعائیں', maxMarks: 30, obtainedMarks: Number(deeniyatMarks) }
      ]
    };

    onAddExam(newExam);
    setIsAddModalOpen(false);
  };

  const filteredExams = exams.filter(exam => {
    const stu = students.find(s => s.id === exam.studentId);
    return (
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stu?.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
            🏆
          </div>
          <div>
            <h3 className="text-base font-black text-white">امتحانات و رزلٹ کارڈز (Exams & Certificates)</h3>
            <p className="text-xs text-zinc-400">امتحان کا اندراج، نمبرات اور باضابطہ سند و رزلٹ کارڈ کا اجراء</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="امتحان یا طالب علم تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleShareClassSummaryWhatsApp}
            className="px-3.5 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-emerald-500/40 cursor-pointer transition-all shrink-0 shadow"
            title="پورے امتحان کی کلاس رزلٹ شیٹ واٹس ایپ پر شیئر کریں"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>کلاس رزلٹ واٹس ایپ</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>نیا امتحانی رزلٹ درج کریں</span>
          </button>
        </div>
      </div>

      {feedbackToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold text-center shadow-lg animate-fadeIn border border-emerald-400">
          {feedbackToast}
        </div>
      )}

      {/* Exam Results Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">امتحان کا عنوان</th>
                <th className="p-3.5">طالب علم / رول نمبر</th>
                <th className="p-3.5">کلاس</th>
                <th className="p-3.5">تاریخ</th>
                <th className="p-3.5">کل نمبر</th>
                <th className="p-3.5">حاصل کردہ نمبرات</th>
                <th className="p-3.5">گریڈ</th>
                <th className="p-3.5 text-center">واٹس ایپ / سند کارڈ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredExams.length > 0 ? (
                filteredExams.map((exam) => {
                  const student = students.find(s => s.id === exam.studentId);
                  const stuClass = classes.find(c => c.id === exam.classId);

                  return (
                    <tr key={exam.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-white">{exam.title}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{student?.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono" dir="ltr">{student?.rollNo}</span>
                      </td>
                      <td className="p-3.5 text-zinc-300">{stuClass?.name}</td>
                      <td className="p-3.5 text-zinc-400 font-mono" dir="ltr">{exam.date}</td>
                      <td className="p-3.5 font-bold text-zinc-400">{exam.totalMarks}</td>
                      <td className="p-3.5 font-black text-amber-400">{exam.obtainedMarks} ({Math.round((exam.obtainedMarks / exam.totalMarks) * 100)}%)</td>
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {exam.grade}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleShareExamWhatsApp(exam)}
                            className="p-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 hover:text-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer border border-emerald-700/60"
                            title="واٹس ایپ پر رزلٹ کارڈ بھیجیں"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setViewingCertificate(exam)}
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 border border-zinc-700"
                            title="سند و رزلٹ کارڈ دیکھیں و پرنٹ کریں"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>سند کارڈ</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-zinc-500">
                    کوئی امتحانی نتیجہ موجود نہیں۔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Exam Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span>نیا امتحانی نتیجہ درج کریں</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">امتحان کا عنوان *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">طالب علم منتخب کریں</label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">امتحانی تاریخ</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Marks Section */}
              <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                <span className="font-black text-amber-400 block">شعبہ جات کے نمبرات کا اندراج (کل ۱۰۰ نمبر):</span>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-zinc-400 text-[10px] mb-1">تجوید و مخارج (30 میں سے)</label>
                    <input
                      type="number"
                      max={30}
                      min={0}
                      value={makharijMarks}
                      onChange={(e) => setMakharijMarks(Number(e.target.value))}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-black text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-[10px] mb-1">حفظ و روانی (40 میں سے)</label>
                    <input
                      type="number"
                      max={40}
                      min={0}
                      value={hifzMarks}
                      onChange={(e) => setHifzMarks(Number(e.target.value))}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-black text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 text-[10px] mb-1">دینیات و دعائیں (30 میں سے)</label>
                    <input
                      type="number"
                      max={30}
                      min={0}
                      value={deeniyatMarks}
                      onChange={(e) => setDeeniyatMarks(Number(e.target.value))}
                      className="w-full p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-black text-center"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-zinc-800">
                  <span className="text-zinc-300">کل حاصل کردہ:</span>
                  <span className="text-amber-400 font-black">{obtainedMarks} / 100 ({percentage}%)</span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">ممتحن کے تاثرات و ریمارکس</label>
                <input
                  type="text"
                  value={examinerRemarks}
                  onChange={(e) => setExaminerRemarks(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
                >
                  رزلٹ محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate & Result Card Modal */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-zinc-900 border border-zinc-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
              <span className="text-xs font-bold text-zinc-500">جامعہ کی آفیشل امتحانی سند و نتیجہ نامہ</span>
              <button 
                onClick={() => setViewingCertificate(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Certificate Frame */}
            <div className="p-6 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/70 border-4 border-amber-500/80 rounded-2xl space-y-5 shadow-inner" id="printable-sanad">
              
              <div className="text-center space-y-1">
                <span className="text-xs text-amber-800 font-serif font-bold">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ</span>
                <h2 className="text-2xl font-black text-emerald-950">جامعۃ تعلیم القرآن آن لائن</h2>
                <span className="inline-block text-xs font-bold bg-amber-600 text-white px-3 py-0.5 rounded-full">
                  سَنَدُ الشَّهَادَةِ وَ كَشْفُ النَّتَائِجِ (امتحانی سند و رزلٹ کارڈ)
                </span>
              </div>

              {(() => {
                const stu = students.find(s => s.id === viewingCertificate.studentId);
                const cls = classes.find(c => c.id === viewingCertificate.classId);

                return (
                  <div className="space-y-3 text-xs">
                    <p className="text-center text-zinc-700 leading-relaxed text-sm">
                      تصدیق کی جاتی ہے کہ محترم طالب علم / طالبہ <strong className="text-emerald-900 text-base">{stu?.name}</strong> ولد/بنت <strong className="text-zinc-900">{stu?.guardianName}</strong> نے <strong className="text-zinc-900">{viewingCertificate.title}</strong> میں شرکت کی اور درج ذیل نمبرات کے ساتھ کامیابی حاصل کی۔
                    </p>

                    {/* Table of Marks */}
                    <div className="border border-amber-300 rounded-xl overflow-hidden">
                      <table className="w-full text-center text-xs">
                        <thead className="bg-amber-100 font-bold text-amber-950">
                          <tr>
                            <th className="p-2 text-right">مضمون / شعبہ</th>
                            <th className="p-2">کل نمبر</th>
                            <th className="p-2">حاصل کردہ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-200">
                          {viewingCertificate.subjects?.map((sub, i) => (
                            <tr key={i}>
                              <td className="p-2 text-right font-medium text-zinc-800">{sub.name}</td>
                              <td className="p-2 font-bold text-zinc-600">{sub.maxMarks}</td>
                              <td className="p-2 font-black text-emerald-800">{sub.obtainedMarks}</td>
                            </tr>
                          ))}
                          <tr className="bg-amber-50 font-black">
                            <td className="p-2 text-right text-emerald-950">کُل میزان و فیصد</td>
                            <td className="p-2">{viewingCertificate.totalMarks}</td>
                            <td className="p-2 text-emerald-950 text-sm">{viewingCertificate.obtainedMarks} ({Math.round((viewingCertificate.obtainedMarks / viewingCertificate.totalMarks) * 100)}%)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                      <span>حاصل کردہ پوزیشن / گریڈ:</span>
                      <strong className="text-emerald-900 text-sm">{viewingCertificate.grade}</strong>
                    </div>

                    <p className="text-zinc-600 italic text-[11px] text-center">
                      &quot;{viewingCertificate.examinerRemarks}&quot;
                    </p>
                  </div>
                );
              })()}

              {/* Signatures */}
              <div className="pt-6 flex items-center justify-between text-[11px] text-zinc-700">
                <div className="text-center">
                  <div className="w-20 border-b-2 border-zinc-400 mb-1 mx-auto" />
                  <span>دستخط ممتحن</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-600 flex items-center justify-center font-bold text-amber-800 text-[10px] mx-auto">
                    مہر جامعہ
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-20 border-b-2 border-zinc-400 mb-1 mx-auto" />
                  <span>دستخط مہتمم / مدیر</span>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => handleShareExamWhatsApp(viewingCertificate)}
                className="w-full sm:flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>والدین کو واٹس ایپ بھیجیں (WhatsApp)</span>
              </button>
              <button
                onClick={() => handleCopyExamText(viewingCertificate)}
                className="w-full sm:w-auto px-3.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                title="رزلٹ ٹیکسٹ کاپی کریں"
              >
                {copiedId === viewingCertificate.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === viewingCertificate.id ? 'کاپی ہو گیا' : 'کاپی'}</span>
              </button>
              <button
                onClick={handlePrintCertificate}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4" />
                <span>پی ڈی ایف / پرنٹ</span>
              </button>
              <button
                onClick={() => setViewingCertificate(null)}
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
