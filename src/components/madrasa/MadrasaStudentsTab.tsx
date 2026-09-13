import React, { useState } from 'react';
import { 
  GraduationCap, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Phone, 
  Search, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  X, 
  Filter, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { MadrasaStudent, MadrasaClass } from '../../data/madrasaData';

interface MadrasaStudentsTabProps {
  students: MadrasaStudent[];
  classes: MadrasaClass[];
  onAddStudent: (student: MadrasaStudent) => void;
  onUpdateStudent: (student: MadrasaStudent) => void;
  onDeleteStudent: (id: string) => void;
  onNavigateToSabaq?: (studentId: string) => void;
  onNavigateToDonation?: (studentId: string) => void;
}

export const MadrasaStudentsTab: React.FC<MadrasaStudentsTabProps> = ({
  students,
  classes,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onNavigateToSabaq,
  onNavigateToDonation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<MadrasaStudent | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [classId, setClassId] = useState(classes[0]?.id || 'CLS-1');
  const [monthlyFee, setMonthlyFee] = useState(2000);
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState(8);
  const [gender, setGender] = useState<'طالب علم' | 'طالبہ'>('طالب علم');
  const [currentSabaqSummary, setCurrentSabaqSummary] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'graduated'>('active');

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setName('');
    setGuardianName('');
    setClassId(classes[0]?.id || 'CLS-1');
    setMonthlyFee(2000);
    setPhone('');
    setAge(8);
    setGender('طالب علم');
    setCurrentSabaqSummary('ابتدائی تختی');
    setAddress('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: MadrasaStudent) => {
    setEditingStudent(s);
    setName(s.name);
    setGuardianName(s.guardianName);
    setClassId(s.classId);
    setMonthlyFee(s.monthlyFee);
    setPhone(s.phone);
    setAge(s.age);
    setGender(s.gender);
    setCurrentSabaqSummary(s.currentSabaqSummary || '');
    setAddress(s.address || '');
    setStatus(s.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name,
        guardianName,
        classId,
        monthlyFee: Number(monthlyFee) || 0,
        phone,
        age: Number(age) || 8,
        gender,
        currentSabaqSummary,
        address,
        status
      });
    } else {
      const newRoll = `TQ-${new Date().getFullYear()}-${String(students.length + 1).padStart(3, '0')}`;
      const newStudent: MadrasaStudent = {
        id: `STU-${Date.now()}`,
        rollNo: newRoll,
        name,
        guardianName,
        classId,
        monthlyFee: Number(monthlyFee) || 0,
        phone,
        admissionDate: new Date().toISOString().split('T')[0],
        age: Number(age) || 8,
        gender,
        currentSabaqSummary: currentSabaqSummary || 'نورانی قاعدہ سبق ۱',
        address,
        status
      };
      onAddStudent(newStudent);
    }
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm);

    const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Controls */}
      <div className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
            🎓
          </div>
          <div>
            <h3 className="text-base font-black text-white">طلباء و طالبات رجسٹریشن پینل</h3>
            <p className="text-xs text-zinc-400">کُل رجسٹرڈ: {students.length} طلباء | فعال: {students.filter(s => s.status === 'active').length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">تمام کلاسیں (All Classes)</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="نام، رول نمبر یا فون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>نیا طالب علم داخل کریں</span>
          </button>
        </div>
      </div>

      {/* Student List Table / Card View */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-300">
            <thead className="bg-zinc-950/80 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">رول نمبر / نام</th>
                <th className="p-3.5">سرپرست / والد</th>
                <th className="p-3.5">کلاس / درجہ</th>
                <th className="p-3.5">موجودہ سبق</th>
                <th className="p-3.5">ماہانہ فیس (₹)</th>
                <th className="p-3.5">حیثیت (Status)</th>
                <th className="p-3.5 text-center">اختیارات (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentClass = classes.find(c => c.id === student.classId);

                  return (
                    <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors group">
                      {/* Name & Roll */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-emerald-900/40 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-700/40">
                            {student.gender === 'طالبہ' ? '👧' : '👦'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{student.name}</span>
                            <span className="text-[10px] text-zinc-400 font-mono" dir="ltr">{student.rollNo}</span>
                          </div>
                        </div>
                      </td>

                      {/* Guardian & Phone */}
                      <td className="p-3.5">
                        <span className="text-zinc-200 block">{student.guardianName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono" dir="ltr">{student.phone || '—'}</span>
                      </td>

                      {/* Class */}
                      <td className="p-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 font-medium">
                          {studentClass?.name || 'کلاس غیر متعین'}
                        </span>
                      </td>

                      {/* Sabaq */}
                      <td className="p-3.5 max-w-[200px]">
                        <span className="text-emerald-400 font-medium truncate block" title={student.currentSabaqSummary}>
                          {student.currentSabaqSummary || 'سبق جاری ہے'}
                        </span>
                      </td>

                      {/* Fee */}
                      <td className="p-3.5">
                        <span className="font-black text-amber-400">₹ {student.monthlyFee.toLocaleString()}</span>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                          student.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : student.status === 'graduated'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {student.status === 'active' ? '● فعال' : student.status === 'graduated' ? '🎓 فارغ التحصیل' : '○ غیر فعال'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onNavigateToDonation && (
                            <button
                              onClick={() => onNavigateToDonation(student.id)}
                              className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer border border-rose-800/40 flex items-center gap-1"
                              title="اس بچے کی کفالت کریں"
                            >
                              <span>🤲 کفالت</span>
                            </button>
                          )}

                          {onNavigateToSabaq && (
                            <button
                              onClick={() => onNavigateToSabaq(student.id)}
                              className="px-2 py-1 bg-blue-950/60 hover:bg-blue-900 text-blue-300 rounded-lg text-[11px] font-bold transition-all cursor-pointer border border-blue-800/40 flex items-center gap-1"
                              title="سبق سنیں"
                            >
                              <span>🎙️ سبق سنیں</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all cursor-pointer"
                            title="ترمیم کریں"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`کیا آپ واقعی طالب علم ${student.name} کو خارج کرنا چاہتے ہیں؟`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-lg transition-all cursor-pointer border border-rose-900/30"
                            title="طالب علم خارج کریں"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500">
                    کوئی طالب علم نہیں ملا۔ نیا طالب علم داخل کرنے کے لیے اوپر والا بٹن دبائیں۔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <span>{editingStudent ? 'طالب علم کی تفصیلات میں ترمیم' : 'نیا طالب علم داخل کریں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">طالب علم کا نام *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد علی"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">سرپرست / والد کا نام</label>
                  <input
                    type="text"
                    placeholder="مثال: محمد اسلم"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">کلاس / درجہ منتخب کریں</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">ماہانہ فیس (₹ / INR)</label>
                  <input
                    type="number"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">رابطہ فون نمبر</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">عمر (سال)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">جنس</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'طالب علم' | 'طالبہ')}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="طالب علم">طالب علم (Boy)</option>
                    <option value="طالبہ">طالبہ (Girl)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">موجودہ سبق / کیفیت</label>
                <input
                  type="text"
                  placeholder="مثال: تختی نمبر ۵: تنوین / پارہ ۳۰ سورۃ النبأ"
                  value={currentSabaqSummary}
                  onChange={(e) => setCurrentSabaqSummary(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">حیثیت (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive' | 'graduated')}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="active">فعال (Active Student)</option>
                  <option value="inactive">غیر فعال (Inactive)</option>
                  <option value="graduated">فارغ التحصیل (Graduated)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl cursor-pointer"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
                >
                  {editingStudent ? 'تبدیلیاں محفوظ کریں' : 'طالب علم داخل کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
