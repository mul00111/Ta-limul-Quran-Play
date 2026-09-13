import React, { useState, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  User, 
  BookOpen, 
  Volume2, 
  X,
  Clock
} from 'lucide-react';
import { MadrasaStudent, MadrasaTeacher, MadrasaSabaqRecord, MadrasaClass } from '../../data/madrasaData';

interface MadrasaSabaqHearingTabProps {
  students: MadrasaStudent[];
  teachers: MadrasaTeacher[];
  classes: MadrasaClass[];
  sabaqLogs: MadrasaSabaqRecord[];
  onSaveSabaqLog: (log: MadrasaSabaqRecord) => void;
  preselectedStudentId?: string | null;
}

export const MadrasaSabaqHearingTab: React.FC<MadrasaSabaqHearingTabProps> = ({
  students,
  teachers,
  classes,
  sabaqLogs,
  onSaveSabaqLog,
  preselectedStudentId
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState(
    preselectedStudentId || students[0]?.id || ''
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Sabaq Details
  const [sabaqLesson, setSabaqLesson] = useState('تختی نمبر ۵: تنوین (دو زبر، دو زیر، دو پیش)');
  const [sabqiLesson, setSabqiLesson] = useState('تختی نمبر ۴: حروف مدہ');
  const [manzilLesson, setManzilLesson] = useState('پارہ ۳۰: سورۃ النبأ تا سورۃ التکویر');

  // Evaluation Marks & Mistakes
  const [sabaqMistakes, setSabaqMistakes] = useState(0);
  const [sabqiMistakes, setSabqiMistakes] = useState(0);
  const [tajweedMistakes, setTajweedMistakes] = useState(0);
  const [grade, setGrade] = useState<'ممتاز (A+)' | 'بہت اچھا (A)' | 'مناسب (B)' | 'توجہ طلب (C)' | 'دوبارہ یاد کریں (D)'>('ممتاز (A+)');
  const [teacherRemarks, setTeacherRemarks] = useState('ماشاءاللہ تلفظ عمدہ تھا، تنوین کے غنہ پر مزید دھیان دیں۔');

  // Interactive Live Microphone Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('مائیکروفون تک رسائی ممکن نہیں ہوئی۔ براہ کرم براؤزر کی اجازت چیک کریں۔');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const newRecord: MadrasaSabaqRecord = {
      id: `SBQ-${Date.now()}`,
      studentId: selectedStudentId,
      teacherId: selectedTeacherId,
      date,
      sabaq: sabaqLesson,
      sabqi: sabqiLesson,
      manzil: manzilLesson,
      sabaqMistakes: Number(sabaqMistakes),
      sabqiMistakes: Number(sabqiMistakes),
      tajweedMistakes: Number(tajweedMistakes),
      grade,
      teacherRemarks,
      audioRecordingUrl: recordedAudioUrl || undefined
    };

    onSaveSabaqLog(newRecord);
    alert('✅ طالب علم کا روزانہ سبق و ڈائری کا ریکارڈ کامیابی سے محفوظ ہو گیا!');
  };

  const activeStudent = students.find(s => s.id === selectedStudentId);
  const activeClass = classes.find(c => c.id === activeStudent?.classId);
  const recentLogsForStudent = sabaqLogs.filter(l => l.studentId === selectedStudentId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-zinc-900/80 p-5 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">
            🎙️
          </div>
          <div>
            <h3 className="text-base font-black text-white">سبق سماعت و یومیہ کارکردگی ڈائری</h3>
            <p className="text-xs text-zinc-400">استاد طالب علم کا سبق سنیں، آواز ریکارڈ کریں اور غلطیوں کا جائزہ لیں</p>
          </div>
        </div>

        {/* Student Selection */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 font-bold">طالب علم منتخب کریں:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left Listening Evaluation Form, Right Previous History & Recording */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Sabaq Evaluation Form (2 cols) */}
        <div className="lg:col-span-2 bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <span>طالب علم: {activeStudent?.name || 'منتخب کریں'}</span>
              <span className="text-xs text-blue-400">({activeClass?.name})</span>
            </h4>
            <span className="text-xs text-zinc-400 font-mono" dir="ltr">{date}</span>
          </div>

          <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
            
            {/* Lessons Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  📖 آج کا نیا سبق (Sabaq):
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تختی ۵ تنوین / پارہ ۱ رکوع ۲"
                  value={sabaqLesson}
                  onChange={(e) => setSabaqLesson(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    📜 پچھلا سبق (سبقی - Sabqi):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تختی ۴ حروف مدہ / پچھلا نصف پارہ"
                    value={sabqiLesson}
                    onChange={(e) => setSabqiLesson(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">
                    🕋 منزل / دور (Manzil):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: پارہ ۳۰ مکمل / سورۃ یس تا الواقعۃ"
                    value={manzilLesson}
                    onChange={(e) => setManzilLesson(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mistakes Counters */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-3">
              <span className="text-zinc-300 font-black block">غلطیوں کی تعداد (Mistake Evaluation):</span>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                  <label className="block text-zinc-400 text-[10px] mb-1">سبق کی غلطیاں</label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSabaqMistakes(Math.max(0, sabaqMistakes - 1))}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-amber-400">{sabaqMistakes}</span>
                    <button
                      type="button"
                      onClick={() => setSabaqMistakes(sabaqMistakes + 1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                  <label className="block text-zinc-400 text-[10px] mb-1">سبقی کی غلطیاں</label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSabqiMistakes(Math.max(0, sabqiMistakes - 1))}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-amber-400">{sabqiMistakes}</span>
                    <button
                      type="button"
                      onClick={() => setSabqiMistakes(sabqiMistakes + 1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                  <label className="block text-zinc-400 text-[10px] mb-1">تجوید و مخارج خامیاں</label>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTajweedMistakes(Math.max(0, tajweedMistakes - 1))}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-rose-400">{tajweedMistakes}</span>
                    <button
                      type="button"
                      onClick={() => setTajweedMistakes(tajweedMistakes + 1)}
                      className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">حاصل کردہ گریڈ (Grade):</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none font-bold"
                >
                  <option value="ممتاز (A+)">🌟 ممتاز (A+ Excellent)</option>
                  <option value="بہت اچھا (A)">✨ بہت اچھا (A Very Good)</option>
                  <option value="مناسب (B)">👍 مناسب (B Good)</option>
                  <option value="توجہ طلب (C)">⚠️ توجہ طلب (C Needs Work)</option>
                  <option value="دوبارہ یاد کریں (D)">🔄 دوبارہ یاد کریں (D Repeat)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">نگران استاد:</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.title})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teacher Remarks */}
            <div>
              <label className="block text-zinc-300 font-bold mb-1">استاد کے تاثرات و ڈائری نوٹس (Remarks):</label>
              <input
                type="text"
                value={teacherRemarks}
                onChange={(e) => setTeacherRemarks(e.target.value)}
                placeholder="طالب علم کے لیے حوصلہ افزا یا اصلاحی کلمات..."
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl flex items-center gap-2 shadow-lg shadow-blue-900/50 cursor-pointer transition-all hover:scale-105"
              >
                <Save className="w-4 h-4" />
                <span>سبق کا ریکارڈ محفوظ کریں (Save Diary Entry)</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right: Live Audio Recording & Student History (1 Col) */}
        <div className="space-y-6">
          
          {/* Live Mic Recorder Box */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4 text-center">
            <h4 className="text-xs font-black text-white flex items-center justify-center gap-1.5">
              <Mic className="w-4 h-4 text-rose-400" />
              <span>براہِ راست سبق تلاوت ریکارڈنگ (Live Mic)</span>
            </h4>
            <p className="text-[11px] text-zinc-400">
              طالب علم کی تلاوت ریکارڈ کریں تاکہ بعد میں جائزہ لیا جا سکے
            </p>

            {/* Mic Button */}
            <div className="py-3 flex flex-col items-center justify-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:scale-110 text-white flex items-center justify-center text-2xl shadow-xl shadow-rose-900/50 cursor-pointer transition-transform"
                  title="ریکارڈنگ شروع کریں"
                >
                  <Mic className="w-7 h-7" />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-rose-500 text-rose-400 flex items-center justify-center text-2xl animate-pulse cursor-pointer shadow-xl shadow-rose-900/50"
                  title="ریکارڈنگ مکمل کریں"
                >
                  <Square className="w-7 h-7" />
                </button>
              )}

              <span className="text-xs font-mono font-bold text-zinc-300">
                {isRecording ? `🔴 ریکارڈ ہو رہا ہے (${recordingDuration} سیکنڈ)` : 'ریکارڈنگ شروع کرنے کے لیے بٹن دبائیں'}
              </span>
            </div>

            {/* Audio Playback if recorded */}
            {recordedAudioUrl && (
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold block">
                  ✅ ریکارڈ شدہ تلاوت موجود ہے:
                </span>
                <audio controls src={recordedAudioUrl} className="w-full h-8" />
              </div>
            )}
          </div>

          {/* Previous History for this student */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>گزشتہ اسباق کی تاریخ (Previous History)</span>
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 text-xs">
              {recentLogsForStudent.length > 0 ? (
                recentLogsForStudent.map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1 text-right">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">{log.grade}</span>
                      <span className="text-zinc-400 font-mono text-[10px]">{log.date}</span>
                    </div>
                    <p className="text-zinc-200 font-medium truncate">سبق: {log.sabaq}</p>
                    <p className="text-zinc-400 text-[10px] leading-tight">نوٹ: {log.teacherRemarks}</p>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-zinc-500 text-[11px]">
                  اس طالب علم کا کوئی سابقہ ریکارڈ موجود نہیں ہے۔
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
