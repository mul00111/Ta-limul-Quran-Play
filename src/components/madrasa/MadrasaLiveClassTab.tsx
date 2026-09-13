import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  PenTool, 
  Eraser, 
  Trash2, 
  Share2, 
  Sparkles, 
  BookOpen, 
  Users, 
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Camera,
  PhoneCall
} from 'lucide-react';
import { MadrasaClass, MadrasaStudent, MadrasaTeacher } from '../../data/madrasaData';
import { playPhoneticLetterAudio } from '../../utils/qariAudioService';
import { SecureLiveClassroomModal } from './MadrasaLiveClassroomModal';

interface MadrasaLiveClassTabProps {
  classes: MadrasaClass[];
  students: MadrasaStudent[];
  teachers: MadrasaTeacher[];
}

export const MadrasaLiveClassTab: React.FC<MadrasaLiveClassTabProps> = ({
  classes,
  students,
  teachers
}) => {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'CLS-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || 'TCH-1');
  const [isClassLive, setIsClassLive] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // 1-on-1 Private Live Video Classroom Modal State
  const [isPrivateLiveModalOpen, setIsPrivateLiveModalOpen] = useState(false);
  const [selectedStudentForCall, setSelectedStudentForCall] = useState<MadrasaStudent | null>(null);
  const [detectedRoleForCall, setDetectedRoleForCall] = useState<'ustad' | 'student'>('ustad');

  // Auto-connect if student & teacher provided via shareable URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const studentId = params.get('student');
      const teacherId = params.get('teacher');

      if (studentId && teacherId) {
        const foundStudent = students.find(s => s.id === studentId) || students[0];
        const foundTeacher = teachers.find(t => t.id === teacherId) || teachers[0];

        if (foundStudent && foundTeacher) {
          setSelectedStudentForCall(foundStudent);
          setSelectedTeacherId(foundTeacher.id);
          setDetectedRoleForCall('student');
          setIsPrivateLiveModalOpen(true);
        }
      }
    }
  }, [students, teachers]);

  // Teaching Materials
  const [activeBoardMode, setActiveBoardMode] = useState<'whiteboard' | 'qaida' | 'quran'>('qaida');
  
  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#10b981');
  const [penSize, setPenSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  // Lesson Pointer
  const [highlightedLetter, setHighlightedLetter] = useState<string | null>(null);

  // Sample Quran / Qaida Verses
  const qaidaLetters = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 
    'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 
    'ك', 'ل', 'م', 'ن', 'و', 'ه', 'ء', 'ي'
  ];

  const quranSurahs = [
    {
      title: 'سورۃ الفاتحۃ',
      verses: [
        'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ',
        'اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِیْنَۙ',
        'الرَّحْمٰنِ الرَّحِیْمِۙ',
        'مٰلِكِ یَوْمِ الدِّیْنِؕ',
        'اِیَّاكَ نَعْبُدُ وَ اِیَّاكَ نَسْتَعِیْنُؕ',
        'اِهْدِنَا الصِّرَاطَ الْمُسْتَقِیْمَۙ',
        'صِرَاطَ الَّذِیْنَ اَنْعَمْتَ عَلَیْهِمْ غَیْرِ الْمَغْضُوْبِ عَلَیْهِمْ وَ لَا الضَّآلِّیْنَ'
      ]
    },
    {
      title: 'سورۃ الإخلاص',
      verses: [
        'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ',
        'قُلْ هُوَ اللّٰهُ اَحَدٌۚ',
        'اَللّٰهُ الصَّمَدُۚ',
        'لَمْ یَلِدْ وَ لَمْ یُوْلَدْۙ',
        'وَ لَمْ یَكُنْ لَّهٗ كُفُوًا اَحَدٌ'
      ]
    }
  ];

  const [selectedSurahIdx, setSelectedSurahIdx] = useState(0);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.strokeStyle = isEraser ? '#18181b' : penColor;
    ctx.lineWidth = isEraser ? penSize * 4 : penSize;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleLetterClick = (letter: string) => {
    setHighlightedLetter(letter);
    playPhoneticLetterAudio(letter);
  };

  const currentClassStudents = students.filter(s => s.classId === selectedClassId && s.status === 'active');
  const currentClass = classes.find(c => c.id === selectedClassId);
  const currentTeacher = teachers.find(t => t.id === selectedTeacherId);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Class Selection & Live Status Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border border-emerald-800/60 p-4 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 text-right">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-2xl">
              🎥
            </div>
            {isClassLive && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">لائیو تدریسی کلاس روم (Live Ustadh Classroom)</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                ● لائیو آن ایئر
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              معلم: <strong className="text-emerald-300">{currentTeacher?.name}</strong> | کلاس: <strong className="text-white">{currentClass?.name}</strong>
            </p>
          </div>
        </div>

        {/* Class Selection & Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isMicOn ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-400'
            }`}
            title={isMicOn ? 'مائیک آن ہے' : 'مائیک بند ہے'}
          >
            {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isSpeakerOn ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
            title={isSpeakerOn ? 'اسپیکر آن ہے' : 'اسپیکر میوٹ ہے'}
          >
            {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Classroom Layout (Left: Whiteboard & Texts, Right: Joined Students) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Teaching Stage (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Mode Switcher */}
          <div className="flex items-center justify-between bg-zinc-900/90 p-2 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveBoardMode('qaida')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBoardMode === 'qaida'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📖 نورانی قاعدہ تختی
              </button>
              <button
                onClick={() => setActiveBoardMode('quran')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBoardMode === 'quran'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📜 قرآن مجید سورتیں
              </button>
              <button
                onClick={() => setActiveBoardMode('whiteboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeBoardMode === 'whiteboard'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ✏️ ڈرائنگ وائٹ بورڈ
              </button>
            </div>

            {/* Whiteboard Controls */}
            {activeBoardMode === 'whiteboard' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  {['#10b981', '#38bdf8', '#f59e0b', '#f43f5e', '#ffffff'].map(color => (
                    <button
                      key={color}
                      onClick={() => { setPenColor(color); setIsEraser(false); }}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${penColor === color && !isEraser ? 'scale-125 ring-2 ring-white' : ''}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsEraser(!isEraser)}
                  className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer ${isEraser ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  title="مٹانے کا ربڑ"
                >
                  <Eraser className="w-4 h-4" />
                </button>

                <button
                  onClick={clearCanvas}
                  className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-lg text-xs font-bold cursor-pointer"
                  title="بورڈ صاف کریں"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Interactive Screen Display */}
          <div className="relative bg-zinc-950 border-2 border-zinc-800 rounded-3xl min-h-[420px] p-6 flex flex-col justify-center items-center overflow-hidden shadow-2xl">
            
            {/* Mode 1: Qaida Board */}
            {activeBoardMode === 'qaida' && (
              <div className="w-full space-y-4">
                <div className="text-center space-y-1 border-b border-zinc-800 pb-3">
                  <h4 className="text-base font-black text-emerald-400">سبق نمبر ۱: حروفِ مفردات (تجوید و مخارج)</h4>
                  <p className="text-xs text-zinc-400">کسی بھی حرف پر کلک کریں تاکہ طالب علم کو آواز اور تلفظ سکھایا جا سکے</p>
                </div>

                <div className="grid grid-cols-7 gap-2.5 sm:gap-3 max-w-2xl mx-auto" dir="rtl">
                  {qaidaLetters.map((letter) => {
                    const isSelected = highlightedLetter === letter;

                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        className={`aspect-square rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-110 shadow-lg shadow-emerald-900/60 ring-2 ring-white animate-pulse'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-emerald-300 border border-zinc-800 hover:border-emerald-500/50 hover:scale-105'
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Quran Verses */}
            {activeBoardMode === 'quran' && (
              <div className="w-full space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 border-b border-zinc-800 pb-3">
                  {quranSurahs.map((s, idx) => (
                    <button
                      key={s.title}
                      onClick={() => setSelectedSurahIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        selectedSurahIdx === idx 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>

                <div className="max-w-2xl mx-auto space-y-4 py-4" dir="rtl">
                  <h3 className="text-xl font-black text-amber-400">
                    {quranSurahs[selectedSurahIdx].title}
                  </h3>

                  <div className="space-y-3">
                    {quranSurahs[selectedSurahIdx].verses.map((verse, idx) => (
                      <p 
                        key={idx}
                        className="text-xl sm:text-2xl font-serif text-white hover:text-emerald-300 transition-colors p-2 rounded-xl hover:bg-zinc-900/60 cursor-pointer"
                        title="آیت دہرائیں"
                      >
                        {verse}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mode 3: Freeform Whiteboard */}
            {activeBoardMode === 'whiteboard' && (
              <div className="w-full h-full flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={750}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[400px] bg-zinc-950 rounded-2xl cursor-crosshair touch-none"
                />
              </div>
            )}

          </div>

          {/* Ustadh Instruction Bar */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-3xl flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>استاد براہ راست وائٹ بورڈ یا حروف کی تختی کا استعمال کر کے طلباء کو پڑھا سکتے ہیں۔</span>
            </div>
            <span className="text-emerald-400 font-bold">● آن لائن کلاس چالو ہے</span>
          </div>

        </div>

        {/* Live Participants / Students in Classroom (1 Col) */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>حاضر طلباء ({currentClassStudents.length})</span>
              </h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                آن لائن
              </span>
            </div>

            {/* Student list */}
            <div className="mt-3 space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {currentClassStudents.map((stu) => (
                <div 
                  key={stu.id}
                  className="p-2.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-emerald-500/40 flex items-center justify-between gap-2 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-900/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      {stu.gender === 'طالبہ' ? '👧' : '👦'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{stu.name}</span>
                      <span className="text-[9px] text-zinc-400 font-mono" dir="ltr">{stu.rollNo}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedStudentForCall(stu);
                        setIsPrivateLiveModalOpen(true);
                      }}
                      className="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-emerald-500/40"
                      title="طالب علم سے براہ راست 1-on-1 ویڈیو کلاس شروع کریں"
                    >
                      <Camera className="w-3 h-3" />
                      <span>لائیو کال</span>
                    </button>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="آن لائن" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Audio / Hand raise notice */}
          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
            <span className="font-bold text-zinc-200 block">💡 کلاس روم ہدایات:</span>
            <p>کسی بھی طالب علم کے ساتھ کیمرہ اور 2 طرفہ آڈیو کے ساتھ 1-on-1 پرائیویٹ لائیو کلاس کے لیے &quot;لائیو کال&quot; پر کلک کریں۔</p>
          </div>
        </div>

      </div>

      {/* 1-on-1 Private Live Video Classroom Modal */}
      {selectedStudentForCall && currentTeacher && (
        <SecureLiveClassroomModal
          isOpen={isPrivateLiveModalOpen}
          onClose={() => {
            setIsPrivateLiveModalOpen(false);
            setSelectedStudentForCall(null);
          }}
          student={selectedStudentForCall}
          teacher={currentTeacher}
          classNameTitle={`${currentClass?.name || 'کلاس'} - براہِ راست لائیو تدریس`}
          myRole={detectedRoleForCall}
        />
      )}

    </div>
  );
};
