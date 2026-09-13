import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  X, 
  Search, 
  Sparkles,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { MadrasaTeacher, MadrasaClass } from '../../data/madrasaData';

interface MadrasaTeachersTabProps {
  teachers: MadrasaTeacher[];
  classes: MadrasaClass[];
  onAddTeacher: (teacher: MadrasaTeacher) => void;
  onUpdateTeacher: (teacher: MadrasaTeacher) => void;
  onDeleteTeacher: (id: string) => void;
}

export const MadrasaTeachersTab: React.FC<MadrasaTeachersTabProps> = ({
  teachers,
  classes,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<MadrasaTeacher | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('قاری و حافظ');
  const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState(30000);
  const [timeSlot, setTimeSlot] = useState('صبح ۰۸:۰۰ تا ۱۲:۰۰');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setName('');
    setTitle('قاری و حافظ');
    setAssignedClasses([]);
    setPhone('');
    setEmail('');
    setSalary(30000);
    setTimeSlot('صبح ۰۸:۰۰ تا ۱۲:۰۰');
    setBio('');
    setStatus('active');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: MadrasaTeacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setTitle(t.title);
    setAssignedClasses(t.classesAssigned || []);
    setPhone(t.phone);
    setEmail(t.email);
    setSalary(t.salary);
    setTimeSlot(t.timeSlot);
    setBio(t.bio);
    setStatus(t.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingTeacher) {
      onUpdateTeacher({
        ...editingTeacher,
        name,
        title,
        classesAssigned: assignedClasses,
        phone,
        email,
        salary: Number(salary) || 0,
        timeSlot,
        bio,
        status
      });
    } else {
      const newTeacher: MadrasaTeacher = {
        id: `TCH-${Date.now()}`,
        name,
        title,
        classesAssigned: assignedClasses,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '')}@talimulquran.online`,
        salary: Number(salary) || 0,
        timeSlot,
        joinDate: new Date().toISOString().split('T')[0],
        bio: bio || 'تعلیم القرآن آن لائن کے معزز استاد۔',
        status,
        avatarColor: 'bg-emerald-600'
      };
      onAddTeacher(newTeacher);
    }
    setIsModalOpen(false);
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-900/80 p-4 rounded-3xl border border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <h3 className="text-base font-black text-white">اساتذہ کرام و معلمات پینل</h3>
            <p className="text-xs text-zinc-400">کُل اساتذہ: {teachers.length} | حاضر: {teachers.filter(t => t.status === 'active').length}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="استاد کا نام یا فون تلاش کریں..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-3 pr-9 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-900/40 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>نیا استاد شامل کریں</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => {
          const assignedClassObjects = classes.filter(c => teacher.classesAssigned?.includes(c.id));

          return (
            <div 
              key={teacher.id}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-5 shadow-lg transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${teacher.avatarColor || 'bg-blue-600'} text-white font-black flex items-center justify-center text-lg shadow-md border border-white/20`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white group-hover:text-blue-300 transition-colors">
                        {teacher.name}
                      </h4>
                      <p className="text-xs text-blue-400 font-bold">{teacher.title}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    teacher.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    {teacher.status === 'active' ? 'فعال (Active)' : 'غیر فعال'}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>اوقات: <strong className="text-zinc-200">{teacher.timeSlot}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span dir="ltr">{teacher.phone || 'فون درج نہیں'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400">
                    <DollarSign className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>ماہانہ مشاہرہ: <strong className="text-emerald-400">Rs. {teacher.salary?.toLocaleString()}</strong></span>
                  </div>

                  {/* Assigned Classes */}
                  <div className="pt-2 border-t border-zinc-800">
                    <span className="text-[11px] text-zinc-400 font-bold block mb-1">تفویض شدہ درجات (Classes):</span>
                    <div className="flex flex-wrap gap-1">
                      {assignedClassObjects.length > 0 ? (
                        assignedClassObjects.map(c => (
                          <span key={c.id} className="text-[10px] bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800 text-zinc-300">
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-500">کوئی کلاس تفویض نہیں</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(teacher)}
                  className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>ترمیم کریں</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`کیا آپ واقعی استاد ${teacher.name} کو فہرست سے ہٹانا چاہتے ہیں؟`)) {
                      onDeleteTeacher(teacher.id);
                    }
                  }}
                  className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-xl transition-all cursor-pointer border border-rose-900/30"
                  title="استاد ہٹائیں"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 text-right">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{editingTeacher ? 'استاد کی تفصیلات میں ترمیم' : 'نیا استاد شامل کریں'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">استاد کا نام *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: قاری محمد بلال"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">عہدہ / سند</label>
                  <input
                    type="text"
                    placeholder="مثال: قاری و حافظ، مفتی، معلمہ"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">ماہانہ مشاہرہ (Rs.)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">فون نمبر</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">تدریسی اوقات (Time Slot)</label>
                  <input
                    type="text"
                    placeholder="صبح ۰۸:۰۰ تا ۱۲:۰۰"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Class Assignment */}
              <div>
                <label className="block text-zinc-300 font-bold mb-1">تفویض شدہ درجات (Classes)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  {classes.map(c => {
                    const isChecked = assignedClasses.includes(c.id);
                    return (
                      <label key={c.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignedClasses([...assignedClasses, c.id]);
                            } else {
                              setAssignedClasses(assignedClasses.filter(id => id !== c.id));
                            }
                          }}
                          className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span className="text-zinc-200">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">استاد کی حیثیت (Status)</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="active">فعال (Active Teacher)</option>
                  <option value="inactive">غیر فعال (Inactive / On Leave)</option>
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
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-xl shadow-lg cursor-pointer"
                >
                  {editingTeacher ? 'تبدیلیاں محفوظ کریں' : 'استاد شامل کریں'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
