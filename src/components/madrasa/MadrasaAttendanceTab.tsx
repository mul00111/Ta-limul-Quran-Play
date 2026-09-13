import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  Filter, 
  Save, 
  Sparkles,
  Download,
  Search
} from 'lucide-react';
import { 
  MadrasaAttendanceDay, 
  MadrasaClass, 
  MadrasaStudent, 
  DailyAttendanceEntry 
} from '../../data/madrasaData';

interface MadrasaAttendanceTabProps {
  attendance: MadrasaAttendanceDay[];
  classes: MadrasaClass[];
  students: MadrasaStudent[];
  onSaveAttendance: (attendanceDay: MadrasaAttendanceDay) => void;
}

export const MadrasaAttendanceTab: React.FC<MadrasaAttendanceTabProps> = ({
  attendance,
  classes,
  students,
  onSaveAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'CLS-1');

  // Find existing attendance for this class & date
  const existingDay = attendance.find(a => a.date === selectedDate && a.classId === selectedClassId);

  // Active students in this class
  const classStudents = students.filter(s => s.classId === selectedClassId && s.status === 'active');

  // Local working state for entries
  const [currentEntries, setCurrentEntries] = useState<Record<string, 'present' | 'absent' | 'leave' | 'late'>>(() => {
    const map: Record<string, 'present' | 'absent' | 'leave' | 'late'> = {};
    classStudents.forEach(s => {
      const match = existingDay?.entries.find(e => e.studentId === s.id);
      map[s.id] = match ? match.status : 'present';
    });
    return map;
  });

  // Sync if class or date changes
  React.useEffect(() => {
    const map: Record<string, 'present' | 'absent' | 'leave' | 'late'> = {};
    classStudents.forEach(s => {
      const match = existingDay?.entries.find(e => e.studentId === s.id);
      map[s.id] = match ? match.status : 'present';
    });
    setCurrentEntries(map);
  }, [selectedDate, selectedClassId]);

  const setStatusForStudent = (studentId: string, status: 'present' | 'absent' | 'leave' | 'late') => {
    setCurrentEntries(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status: 'present' | 'absent') => {
    const map: Record<string, 'present' | 'absent' | 'leave' | 'late'> = {};
    classStudents.forEach(s => {
      map[s.id] = status;
    });
    setCurrentEntries(map);
  };

  const handleSave = () => {
    const entries: DailyAttendanceEntry[] = classStudents.map(s => ({
      studentId: s.id,
      status: currentEntries[s.id] || 'present',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    const attendanceDay: MadrasaAttendanceDay = {
      id: `ATT-${selectedDate}-${selectedClassId}`,
      date: selectedDate,
      classId: selectedClassId,
      entries
    };

    onSaveAttendance(attendanceDay);
    alert('✅ حاضری کامیابی کے ساتھ محفوظ کر لی گئی ہے!');
  };

  // Counts
  const totalCount = classStudents.length;
  const presentCount = classStudents.filter(s => currentEntries[s.id] === 'present').length;
  const absentCount = classStudents.filter(s => currentEntries[s.id] === 'absent').length;
  const leaveCount = classStudents.filter(s => currentEntries[s.id] === 'leave').length;
  const lateCount = classStudents.filter(s => currentEntries[s.id] === 'late').length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Date/Class Controls */}
      <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
              📝
            </div>
            <div>
              <h3 className="text-base font-black text-white">یومیہ حاضری رجسٹر (Daily Attendance)</h3>
              <p className="text-xs text-zinc-400">کلاس وائز حاضری درج کریں اور ریکارڈ محفوظ رکھیں</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => markAll('present')}
              className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-800/40 cursor-pointer transition-all flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>سب کو حاضر کریں</span>
            </button>
            <button
              onClick={() => markAll('absent')}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/40 cursor-pointer transition-all flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>سب کو غائب کریں</span>
            </button>
          </div>
        </div>

        {/* Date & Class Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800">
          <div>
            <label className="block text-zinc-300 text-xs font-bold mb-1">تاریخ منتخب کریں:</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 text-xs font-bold mb-1">کلاس / درجہ منتخب کریں:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs">
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-zinc-400 block text-[10px]">کُل طلباء</span>
            <span className="font-black text-white text-base">{totalCount}</span>
          </div>
          <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
            <span className="text-emerald-400 block text-[10px]">حاضر (Present)</span>
            <span className="font-black text-emerald-300 text-base">{presentCount}</span>
          </div>
          <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">
            <span className="text-rose-400 block text-[10px]">غائب (Absent)</span>
            <span className="font-black text-rose-300 text-base">{absentCount}</span>
          </div>
          <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/40">
            <span className="text-amber-400 block text-[10px]">رخصت (Leave)</span>
            <span className="font-black text-amber-300 text-base">{leaveCount}</span>
          </div>
          <div className="bg-blue-950/40 p-2.5 rounded-xl border border-blue-800/40 col-span-2 sm:col-span-1">
            <span className="text-blue-400 block text-[10px]">فیصد حاضری</span>
            <span className="font-black text-blue-300 text-base">{rate}%</span>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between">
          <h4 className="text-sm font-black text-white flex items-center gap-2">
            <span>کلاس طلباء حاضری لسٹ: {classes.find(c => c.id === selectedClassId)?.name}</span>
          </h4>
          <span className="text-xs text-zinc-400">تاریخ: {selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-zinc-300">
            <thead className="bg-zinc-950 text-zinc-400 font-bold border-b border-zinc-800">
              <tr>
                <th className="p-3.5">نمبر شمار</th>
                <th className="p-3.5">طالب علم کا نام / رول نمبر</th>
                <th className="p-3.5">سرپرست کا نام</th>
                <th className="p-3.5 text-center">حاضری اسٹیٹس (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {classStudents.length > 0 ? (
                classStudents.map((student, idx) => {
                  const status = currentEntries[student.id] || 'present';

                  return (
                    <tr key={student.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 text-zinc-500 font-mono">{idx + 1}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-white block">{student.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono" dir="ltr">{student.rollNo}</span>
                      </td>
                      <td className="p-3.5 text-zinc-300">{student.guardianName}</td>
                      <td className="p-3.5">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setStatusForStudent(student.id, 'present')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 ring-2 ring-emerald-400 scale-105'
                                : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            ✅ حاضر (Present)
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatusForStudent(student.id, 'absent')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50 ring-2 ring-rose-400 scale-105'
                                : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            ❌ غائب (Absent)
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatusForStudent(student.id, 'leave')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              status === 'leave'
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 ring-2 ring-amber-400 scale-105'
                                : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            📝 رخصت (Leave)
                          </button>

                          <button
                            type="button"
                            onClick={() => setStatusForStudent(student.id, 'late')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              status === 'late'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 ring-2 ring-blue-400 scale-105'
                                : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            ⏰ تاخیر (Late)
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    اس کلاس میں فی الحال کوئی فعال طالب علم داخل نہیں ہے۔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">تمام حاضریاں منتخب کرنے کے بعد محفوظ کرنا نہ بھولیں۔</span>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl flex items-center gap-2 shadow-lg shadow-purple-900/50 cursor-pointer transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>حاضری محفوظ کریں (Save Attendance)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
