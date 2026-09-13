import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Users, 
  Clock, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { MadrasaClass, MadrasaTeacher, MadrasaStudent } from '../../data/madrasaData';

interface MadrasaClassesTabProps {
  classes: MadrasaClass[];
  teachers: MadrasaTeacher[];
  students: MadrasaStudent[];
  onAddClass: (newClass: MadrasaClass) => void;
  onUpdateClass: (updatedClass: MadrasaClass) => void;
  onDeleteClass: (classId: string) => void;
  onSelectClassForView?: (classId: string) => void;
}

export const MadrasaClassesTab: React.FC<MadrasaClassesTabProps> = ({
  classes,
  teachers,
  students,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onSelectClassForView
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<MadrasaClass | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'qaidah' | 'nazirah' | 'hifz' | 'tajweed' | 'deeniyat'>('qaidah');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [timing, setTiming] = useState('صبح ۰۸:۰۰ تا ۰۹:۳۰');
  const [capacity, setCapacity] = useState(25);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📖');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setName('');
    setCategory('qaidah');
    setTeacherId(teachers[0]?.id || '');
    setTiming('صبح ۰۸:۰۰ تا ۰۹:۳۰');
    setCapacity(25);
    setDescription('');
    setIcon('📖');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: MadrasaClass) => {
    setEditingClass(c);
    setName(c.name);
    setCategory(c.category);
    setTeacherId(c.teacherId);
    setTiming(c.timing);
    setCapacity(c.capacity);
    setDescription(c.description);
    setIcon(c.icon);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingClass) {
      onUpdateClass({
        ...editingClass,
        name,
        category,
        teacherId,
        timing,
        capacity: Number(capacity) || 20,
        description,
        icon
      });
    } else {
      const newClass: MadrasaClass = {
        id: `CLS-${Date.now()}`,
        name,
        code: `CLS-${classes.length + 1}`,
        category,
        teacherId,
        timing,
        capacity: Number(capacity) || 20,
        description: description || 'تعلیم القرآن آن لائن درجہ',
        icon: icon || '📖',
        color: category === 'qaidah' ? 'from-emerald-600 to-teal-800' :
               category === 'nazirah' ? 'from-blue-600 to-indigo-800' :
               category === 'hifz' ? 'from-amber-600 to-orange-800' :
               category === 'tajweed' ? 'from-purple-600 to-fuchsia-800' : 'from-rose-600 to-red-800'
      };
      onAddClass(newClass);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl">
            📚
          </div>
          <div>
            <h3 className="text-base font-black text-white">درجات و کلاسیں (Class Divisions)</h3>
            <p className="text-xs text-zinc-400">کُل کلاسیں: {classes.length} | الگ الگ نصاب و اساتذہ کے ساتھ</p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-900/40 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>نئی کلاس بنائیں</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const teacher = teachers.find(t => t.id === cls.teacherId);
          const enrolledStudents = students.filter(s => s.classId === cls.id);

          return (
            <div 
              key={cls.id}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
            >
              {/* Header Gradient */}
              <div className={`p-4 bg-gradient-to-r ${cls.color || 'from-emerald-700 to-teal-900'} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cls.icon}</span>
                  <div>
                    <h4 className="text-base font-black">{cls.name}</h4>
                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono">{cls.code}</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 text-xs text-zinc-300 flex-1">
                <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-2">
                  {cls.description}
                </p>

                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">معلم / استاد:</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <span>👳‍♂️</span>
                      <span>{teacher?.name || 'استاد غیر متعین'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">اوقات تدریس:</span>
                    <span className="font-medium text-amber-300" dir="rtl">{cls.timing}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">داخل شدہ طلباء:</span>
                    <span className="font-black text-emerald-400">
                      {enrolledStudents.length} / {cls.capacity} طلباء
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>ترمیم</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`کیا آپ واقعی کلاس "${cls.name}" کو حذف کرنا چاہتے ہیں؟`)) {
                      onDeleteClass(cls.id);
                    }
                  }}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-xl cursor-pointer transition-all border border-rose-900/30"
                  title="کلاس حذف کریں"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{editingClass ? 'کلاس کی تفصیلات میں ترمیم' : 'نئی کلاس بنائیں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">کلاس کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: درجہ ۱: نورانی قاعدہ مع تجوید"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">شعبہ / زمرہ (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="qaidah">📖 نورانی و مدنی قاعدہ</option>
                    <option value="nazirah">📜 ناظرہ قرآن مع تجوید</option>
                    <option value="hifz">🕋 حفظ القرآن الکریم</option>
                    <option value="tajweed">🗣️ تجوید و قراءت</option>
                    <option value="deeniyat">🕌 دینیات و مسنون دعائیں</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">نگران استاد (Teacher)</label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.title})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">تدریسی اوقات</label>
                  <input
                    type="text"
                    placeholder="صبح ۰۸:۰۰ تا ۰۹:۳۰"
                    value={timing}
                    onChange={(e) => setTiming(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">گنجائش (Capacity)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">تفصیل و نصاب</label>
                <textarea
                  rows={2}
                  placeholder="اس کلاس کا مختصر نصاب یا مقصد لکھیں..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                />
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
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
                >
                  {editingClass ? 'تبدیلیاں محفوظ کریں' : 'کلاس شامل کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
