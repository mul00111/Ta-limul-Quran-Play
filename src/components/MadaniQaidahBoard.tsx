import React, { useState, useRef } from 'react';
import { 
  Volume2, VolumeX, BookOpen, ArrowRight, Play, Pause, Video as VideoIcon, 
  Sparkles, CheckCircle2, Layers, Flame, Mic, Square, Upload, Trash2, 
  RefreshCw, Music, Check, Radio, Award, Gamepad2, Puzzle, Compass
} from 'lucide-react';
import { MakharijChartModal } from './MakharijChartModal';
import { MurakkabatLessonModal } from './MurakkabatLessonModal';
import { HarakatLessonModal } from './HarakatLessonModal';
import { SukoonLessonModal } from './SukoonLessonModal';
import { HuroofLeenLessonModal } from './HuroofLeenLessonModal';
import { HuroofMaddahLessonModal } from './HuroofMaddahLessonModal';
import { KhariHarakatLessonModal } from './KhariHarakatLessonModal';
import { TanweenLessonModal } from './TanweenLessonModal';
import { TashdeedLessonModal } from './TashdeedLessonModal';
import { NunSakinTanweenLessonModal } from './NunSakinTanweenLessonModal';
import { MeemSakinLessonModal } from './MeemSakinLessonModal';
import { TafkheemTarqeeqLessonModal } from './TafkheemTarqeeqLessonModal';
import { MaddatLessonModal } from './MaddatLessonModal';
import { MuqattaatLessonModal } from './MuqattaatLessonModal';
import { ZaidAlifRasmKhattLessonModal } from './ZaidAlifRasmKhattLessonModal';
import { MutafarriqQawaidLessonModal } from './MutafarriqQawaidLessonModal';
import { WaqfLessonModal } from './WaqfLessonModal';
import { QaidaGamesModal } from './QaidaGamesModal';
import { MurakkabatPuzzleGameModal } from './MurakkabatPuzzleGameModal';
import { LanguageCode, UserProgress } from '../types';
import confetti from 'canvas-confetti';
import { useBackHandler } from '../hooks/useBackHandler';
import { getQaidahLocalization, getLocalizedDotText } from '../utils/qaidaLocalization';
import { 
  playQariText, stopAllQariAudio, 
  saveCustomHurufAudio, getCustomHurufAudio, deleteCustomHurufAudio, 
  getAllCustomHurufRecordings, clearAllCustomHurufRecordings 
} from '../utils/qariAudioService';

interface MadaniQaidahBoardProps {
  currentLang?: LanguageCode;
  onBack: () => void;
  onOpenLiveUstadh: () => void;
  progress?: UserProgress;
  onCompleteLesson?: (lessonId: string) => boolean;
}

interface HurufMufradItem {
  id: number;
  letter: string;
  name: string;
  isHeavy: boolean;
  hasMaddLazim: boolean;
  dotText: string;
}

const MADANI_HURUF_29: HurufMufradItem[] = [
  { id: 1, letter: 'ا', name: 'أَلِفْ', isHeavy: false, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 2, letter: 'ب', name: 'بَاءْ', isHeavy: false, hasMaddLazim: false, dotText: '۱ نقطہ نیچے' },
  { id: 3, letter: 'ت', name: 'تَاءْ', isHeavy: false, hasMaddLazim: false, dotText: '۲ نقطے اوپر' },
  { id: 4, letter: 'ث', name: 'ثَاءْ', isHeavy: false, hasMaddLazim: false, dotText: '۳ نقطے اوپر' },
  { id: 5, letter: 'ج', name: 'جِيمْ', isHeavy: false, hasMaddLazim: true, dotText: '۱ نقطہ نیچے' },
  { id: 6, letter: 'ح', name: 'حَاءْ', isHeavy: false, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 7, letter: 'خ', name: 'خَاءْ', isHeavy: true, hasMaddLazim: false, dotText: '۱ نقطہ اوپر' },
  { id: 8, letter: 'د', name: 'دَالْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 9, letter: 'ذ', name: 'ذَالْ', isHeavy: false, hasMaddLazim: true, dotText: '۱ نقطہ اوپر' },
  { id: 10, letter: 'ر', name: 'رَاءْ', isHeavy: false, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 11, letter: 'ز', name: 'زَا', isHeavy: false, hasMaddLazim: false, dotText: '۱ نقطہ اوپر' },
  { id: 12, letter: 'س', name: 'سِيْنْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 13, letter: 'ش', name: 'شِيْنْ', isHeavy: false, hasMaddLazim: true, dotText: '۳ نقطے اوپر' },
  { id: 14, letter: 'ص', name: 'صَادْ', isHeavy: true, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 15, letter: 'ض', name: 'ضَادْ', isHeavy: true, hasMaddLazim: true, dotText: '۱ نقطہ اوپر' },
  { id: 16, letter: 'ط', name: 'طَاءْ', isHeavy: true, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 17, letter: 'ظ', name: 'ظَاءْ', isHeavy: true, hasMaddLazim: false, dotText: '۱ نقطہ اوپر' },
  { id: 18, letter: 'ع', name: 'عَيْنْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 19, letter: 'غ', name: 'غَيْنْ', isHeavy: true, hasMaddLazim: true, dotText: '۱ نقطہ اوپر' },
  { id: 20, letter: 'ف', name: 'فَاءْ', isHeavy: false, hasMaddLazim: false, dotText: '۱ نقطہ اوپر' },
  { id: 21, letter: 'ق', name: 'قَافْ', isHeavy: true, hasMaddLazim: true, dotText: '۲ نقطے اوپر' },
  { id: 22, letter: 'ك', name: 'كَافْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (کشش والا)' },
  { id: 23, letter: 'ل', name: 'لَامْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 24, letter: 'م', name: 'مِيمْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 25, letter: 'ن', name: 'نُوْنْ', isHeavy: false, hasMaddLazim: true, dotText: '۱ نقطہ اوپر' },
  { id: 26, letter: 'و', name: 'وَاوْ', isHeavy: false, hasMaddLazim: true, dotText: 'بے نقطہ (خالی)' },
  { id: 27, letter: 'ه', name: 'هَاءْ', isHeavy: false, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 28, letter: 'ء', name: 'هَمْزَة', isHeavy: false, hasMaddLazim: false, dotText: 'بے نقطہ (خالی)' },
  { id: 29, letter: 'ي', name: 'يَاءْ', isHeavy: false, hasMaddLazim: false, dotText: '۲ نقطے نیچے' },
];

export const MadaniQaidahBoard: React.FC<MadaniQaidahBoardProps> = ({ 
  currentLang = 'ur', 
  onBack, 
  onOpenLiveUstadh,
  progress,
  onCompleteLesson
}) => {
  const [activeLesson, setActiveLesson] = useState<'mufradat' | 'murakkabat' | 'harakat' | 'sukoon' | 'leen' | 'maddah' | 'khari_harakat' | 'tanween' | 'tashdeed' | 'nun_sakin' | 'meem_sakin' | 'tafkheem_tarqeeq' | 'maddat' | 'muqattaat' | 'zaid_alif_rasm_khatt' | 'mutafarriq_qawaid' | 'waqf'>(() => {
    const saved = localStorage.getItem('target_lesson');
    if (saved) {
      localStorage.removeItem('target_lesson');
      return saved as any;
    }
    return 'mufradat';
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeItem, setActiveItem] = useState<HurufMufradItem | null>(null);
  const [showDotsHighlight, setShowDotsHighlight] = useState(true);
  const [showMakharijModal, setShowMakharijModal] = useState(false);
  const [showQaidaGamesModal, setShowQaidaGamesModal] = useState(false);
  const [showMagneticGame, setShowMagneticGame] = useState(false);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');

  const qloc = getQaidahLocalization(currentLang);

  // Lesson filtering logic
  const allLessons = [
    { id: 'mufradat', name: qloc.lessons.mufradat, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'murakkabat', name: qloc.lessons.murakkabat, icon: <Layers className="w-4 h-4" /> },
    { id: 'harakat', name: qloc.lessons.harakat, icon: <Flame className="w-4 h-4" /> },
    { id: 'sukoon', name: qloc.lessons.sukoon, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'leen', name: qloc.lessons.leen, icon: <Compass className="w-4 h-4" /> },
    { id: 'maddah', name: qloc.lessons.maddah, icon: <Award className="w-4 h-4" /> },
    { id: 'khari_harakat', name: qloc.lessons.khari_harakat, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tanween', name: qloc.lessons.tanween, icon: <Award className="w-4 h-4" /> },
    { id: 'tashdeed', name: qloc.lessons.tashdeed, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'nun_sakin', name: qloc.lessons.nun_sakin, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'meem_sakin', name: qloc.lessons.meem_sakin, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'tafkheem_tarqeeq', name: qloc.lessons.tafkheem_tarqeeq, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'maddat', name: qloc.lessons.maddat, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'muqattaat', name: qloc.lessons.muqattaat, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'zaid_alif_rasm_khatt', name: qloc.lessons.zaid_alif_rasm_khatt, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'mutafarriq_qawaid', name: qloc.lessons.mutafarriq_qawaid, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'waqf', name: qloc.lessons.waqf, icon: <Sparkles className="w-4 h-4" /> },
  ];

  const filteredLessonsList = allLessons.filter(l => 
    l.name.includes(lessonSearchQuery) || l.id.includes(lessonSearchQuery)
  );

  // Custom User Recordings State
  const [customRecordingsMap, setCustomRecordingsMap] = useState<Record<string, string>>(() => getAllCustomHurufRecordings());
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [selectedStudioItem, setSelectedStudioItem] = useState<HurufMufradItem>(MADANI_HURUF_29[0]);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [tempAudioUrl, setTempAudioUrl] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const refreshRecordingsMap = () => {
    setCustomRecordingsMap(getAllCustomHurufRecordings());
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Back Button Handlers (Hierarchy: Modals > Active Lesson > Return to Home)
  useBackHandler(() => {
    stopMicRecording();
    setShowStudioModal(false);
  }, showStudioModal, 50, 'qaidah_studio_modal');

  useBackHandler(() => {
    setShowMakharijModal(false);
  }, showMakharijModal, 45, 'qaidah_makharij_modal');

  useBackHandler(() => {
    setShowQaidaGamesModal(false);
  }, showQaidaGamesModal, 45, 'qaidah_games_modal');

  useBackHandler(() => {
    setShowMagneticGame(false);
  }, showMagneticGame, 45, 'qaidah_magnetic_modal');

  useBackHandler(() => {
    setActiveLesson('mufradat');
  }, activeLesson !== 'mufradat' && !showStudioModal && !showMakharijModal && !showQaidaGamesModal && !showMagneticGame, 30, 'qaidah_active_lesson');

  useBackHandler(() => {
    onBack();
  }, activeLesson === 'mufradat' && !showStudioModal && !showMakharijModal && !showQaidaGamesModal && !showMagneticGame, 20, 'qaidah_root_back');

  const speakLetter = (item: HurufMufradItem) => {
    if (isMuted) return;
    setActiveItem(item);
    playQariText(item.name);
  };

  const playFullSequence = async () => {
    if (isMuted) return;
    if (isPlayingAudio) {
      stopAllQariAudio();
      setIsPlayingAudio(false);
      setActiveItem(null);
      return;
    }

    setIsPlayingAudio(true);
    for (let i = 0; i < MADANI_HURUF_29.length; i++) {
      const item = MADANI_HURUF_29[i];
      setActiveItem(item);
      await playQariText(item.name);
      await new Promise(r => setTimeout(r, 300));
    }

    setIsPlayingAudio(false);
    setActiveItem(null);
  };

  // Mic Recording Handlers
  const startMicRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setTempAudioUrl(base64data);
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecordingMic(true);
    } catch (err) {
      alert("مائیکروفون کا کنکشن فراہم نہیں ہو سکا۔ براہ کرم براؤزر کی پرمیشنز چیک کریں۔");
    }
  };

  const stopMicRecording = () => {
    if (mediaRecorderRef.current && isRecordingMic) {
      mediaRecorderRef.current.stop();
      setIsRecordingMic(false);
    }
  };

  const handleSaveRecordingForSelected = (dataUrl: string) => {
    saveCustomHurufAudio(selectedStudioItem.name, dataUrl, selectedStudioItem.letter, selectedStudioItem.id);
    refreshRecordingsMap();
    showToast(`حرف "${selectedStudioItem.name}" کی آواز کامیابی سے اپلوڈ/محفوظ ہو گئی! 🎙️`);
    setTempAudioUrl(null);
    playQariText(selectedStudioItem.name, undefined, dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        handleSaveRecordingForSelected(base64data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSingleRecording = (item: HurufMufradItem) => {
    deleteCustomHurufAudio(item.name, item.letter, item.id);
    refreshRecordingsMap();
    showToast(`حرف "${item.name}" کی کسٹم ریکارڈنگ ختم کر دی گئی`);
  };

  const handleClearAllRecordings = () => {
    if (confirm("کیا آپ تمام ۲۹ حروفِ تہجی کی اپلوڈ کردہ/ریکارڈ شدہ آوازیں ختم کرنا چاہتے ہیں؟")) {
      clearAllCustomHurufRecordings();
      refreshRecordingsMap();
      showToast("تمام کسٹم ریکارڈنگز ختم کر دی گئیں");
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#f5f0e6] text-zinc-900 p-4 sm:p-6 lg:p-8 font-urdu" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between bg-zinc-900 text-white p-4 rounded-2xl shadow-xl">
          <button
            onClick={onBack}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
            title="واپس جائیں"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span>واپسی</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-black text-amber-300">مَدنی قاعدہ</h1>
          </div>

          <button
            onClick={onOpenLiveUstadh}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-90 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <VideoIcon className="w-4 h-4" />
            <span>لائیو کلاس</span>
          </button>
        </div>

        {/* Lesson Switcher Tabs with Search */}
        <div className="space-y-3 bg-zinc-900/95 border border-amber-500/30 p-3 rounded-2xl shadow-xl">
          <div className="relative">
            <Radio className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
            <input 
              type="text"
              placeholder="سبق تلاش کریں (مثلاً: وقف، حرکات، نون ساکن)..."
              value={lessonSearchQuery}
              onChange={(e) => setLessonSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/80 border border-amber-500/20 rounded-xl py-2 pr-10 pl-4 text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all font-urdu"
            />
            {lessonSearchQuery && (
               <button 
                onClick={() => setLessonSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
               >
                 <RefreshCw className="w-3.5 h-3.5" />
               </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
            {filteredLessonsList.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson.id as any)}
                className={`py-2 px-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  activeLesson === lesson.id
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 shadow-lg scale-[1.01]'
                    : 'text-amber-200/80 hover:bg-zinc-800 border border-transparent'
                } ${lessonSearchQuery && lesson.name.includes(lessonSearchQuery) ? 'ring-2 ring-amber-400' : ''}`}
              >
                {progress?.completedLessons.includes(lesson.id) ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  lesson.icon
                )}
                <span>{lesson.name}</span>
              </button>
            ))}
            
            {filteredLessonsList.length === 0 && (
              <div className="col-span-full py-4 text-center text-zinc-500 text-xs font-bold">
                کوئی سبق نہیں ملا
              </div>
            )}
          </div>
        </div>

        {/* RENDER LESSON 17 (WAQF) IF SELECTED */}
        {activeLesson === 'waqf' && (
          <WaqfLessonModal
            onBack={() => setActiveLesson('mufradat')}
            onOpenGamesHub={() => {
              localStorage.setItem('target_game_tab', 'waqf');
              setShowQaidaGamesModal(true);
            }}
          />
        )}

        {/* RENDER LESSON 16 (MUTAFARRIQ QAWAID) IF SELECTED */}
        {activeLesson === 'mutafarriq_qawaid' && (
          <MutafarriqQawaidLessonModal
            onBack={() => setActiveLesson('mufradat')}
            onOpenGamesHub={() => {
              localStorage.setItem('target_game_tab', 'mutafarriq');
              setShowQaidaGamesModal(true);
            }}
            onOpenPuzzleModal={() => {
              localStorage.setItem('target_game_tab', 'mutafarriq');
              setShowMagneticGame(true);
            }}
          />
        )}

        {/* RENDER LESSON 15 (ZAID ALIF & RASM UL KHATT) IF SELECTED */}
        {activeLesson === 'zaid_alif_rasm_khatt' && (
          <ZaidAlifRasmKhattLessonModal
            onBack={() => setActiveLesson('mufradat')}
            onOpenGamesHub={() => {
              localStorage.setItem('target_game_tab', 'zaid_alif');
              setShowQaidaGamesModal(true);
            }}
            onOpenPuzzleModal={() => {
              localStorage.setItem('target_game_tab', 'zaid_alif');
              setShowMagneticGame(true);
            }}
          />
        )}

        {/* RENDER LESSON 14 (MUQATTAAT) IF SELECTED */}
        {activeLesson === 'muqattaat' && (
          <MuqattaatLessonModal
            onBack={() => setActiveLesson('mufradat')}
            onOpenGamesHub={() => {
              localStorage.setItem('target_game_tab', 'muqattaat');
              setShowQaidaGamesModal(true);
            }}
            onOpenPuzzleModal={() => {
              localStorage.setItem('target_game_tab', 'muqattaat');
              setShowMagneticGame(true);
            }}
          />
        )}

        {/* RENDER LESSON 13 (MADDAT RULES) IF SELECTED */}
        {activeLesson === 'maddat' && (
          <MaddatLessonModal onBack={() => setActiveLesson('mufradat')} onOpenGamesHub={() => {
            localStorage.setItem('target_game_tab', 'maddat');
            setShowQaidaGamesModal(true);
          }} onOpenPuzzleModal={() => {
            localStorage.setItem('target_game_tab', 'maddat');
            setShowMagneticGame(true);
          }} />
        )}

        {/* RENDER LESSON 12 (TAFKHEEM & TARQEEQ RULES) IF SELECTED */}
        {activeLesson === 'tafkheem_tarqeeq' && (
          <TafkheemTarqeeqLessonModal onBack={() => setActiveLesson('mufradat')} onOpenGamesHub={() => {
            localStorage.setItem('target_game_tab', 'tafkheem_tarqeeq');
            setShowQaidaGamesModal(true);
          }} />
        )}

        {/* RENDER LESSON 11 (MEEM SAKIN RULES) IF SELECTED */}
        {activeLesson === 'meem_sakin' && (
          <MeemSakinLessonModal onBack={() => setActiveLesson('mufradat')} onOpenGamesHub={() => {
            localStorage.setItem('target_game_tab', 'meem_sakin');
            setShowQaidaGamesModal(true);
          }} />
        )}

        {/* RENDER LESSON 10 (NUN SAKIN & TANWEEN RULES) IF SELECTED */}
        {activeLesson === 'nun_sakin' && (
          <NunSakinTanweenLessonModal onBack={() => setActiveLesson('mufradat')} onOpenGamesHub={() => {
            localStorage.setItem('target_game_tab', 'nun_sakin');
            setShowQaidaGamesModal(true);
          }} />
        )}

        {/* RENDER LESSON 9 (TASHDEED) IF SELECTED */}
        {activeLesson === 'tashdeed' && (
          <TashdeedLessonModal onBack={() => setActiveLesson('mufradat')} />
        )}

        {/* RENDER LESSON 8 (TANWEEN: DO ZABAR, DO ZER, DO PESH) IF SELECTED */}
        {activeLesson === 'tanween' && (
          <TanweenLessonModal onBack={() => setActiveLesson('mufradat')} />
        )}

        {/* RENDER LESSON 7 (KHARI HARAKAT: KHARA ZABAR, KHARA ZER, ULTA PESH) IF SELECTED */}
        {activeLesson === 'khari_harakat' && (
          <KhariHarakatLessonModal onBack={() => setActiveLesson('mufradat')} />
        )}

        {/* RENDER LESSON 6 (HUROOF MADDAH: ALIF, WAW & YAA MADDAH) IF SELECTED */}
        {activeLesson === 'maddah' && (
          <HuroofMaddahLessonModal onBack={() => setActiveLesson('mufradat')} />
        )}

        {/* RENDER LESSON 5 (HUROOF LEEN: WAW & YAA LEEN) IF SELECTED */}
        {activeLesson === 'leen' && (
          <HuroofLeenLessonModal onBack={() => setActiveLesson('mufradat')} />
        )}

        {/* RENDER LESSON 4 (SUKOON & QALQALAH) IF SELECTED */}
        {activeLesson === 'sukoon' && (
          <SukoonLessonModal onBack={() => setActiveLesson('mufradat')} currentLang={currentLang} />
        )}

        {/* RENDER LESSON 3 (HARAKAT) IF SELECTED */}
        {activeLesson === 'harakat' && (
          <HarakatLessonModal onBack={() => setActiveLesson('mufradat')} currentLang={currentLang} />
        )}

        {/* RENDER LESSON 2 (MURAKKABAT) IF SELECTED */}
        {activeLesson === 'murakkabat' && (
          <MurakkabatLessonModal onBack={() => setActiveLesson('mufradat')} currentLang={currentLang} />
        )}

        {/* RENDER LESSON 1 (MUFRADAT) IF SELECTED */}
        {activeLesson === 'mufradat' && (
          <div className="bg-[#fcfaf5] border-4 border-amber-600/80 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6">
            
            {/* Lesson Title Banner & Dot Toggle & Makharij Chart Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="inline-block px-8 py-2 rounded-full bg-emerald-700 text-white font-black text-base sm:text-lg shadow-lg border-2 border-emerald-500">
                {qloc.mufradatTitle}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const newlyCompleted = onCompleteLesson?.('mufradat');
                    if (newlyCompleted) {
                      confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ['#fbbf24', '#34d399', '#f87171']
                      });
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    progress?.completedLessons.includes('mufradat')
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200'
                  }`}
                >
                  {progress?.completedLessons.includes('mufradat') ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Award className="w-4 h-4" />
                  )}
                  <span>{progress?.completedLessons.includes('mufradat') ? qloc.completed : qloc.markComplete}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowQaidaGamesModal(true)}
                  id="mufradat-audio-visual-game-btn"
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border border-emerald-400 active:scale-95 hover:scale-105"
                  title="صوتی و بصری گیم (بلینک بورڈ، حروف پہچان، کوئز)"
                >
                  <Gamepad2 className="w-4 h-4 text-yellow-300 animate-bounce" />
                  <span>{qloc.audioVisualGame}</span>
                </button>

                <button
                  onClick={() => setShowMagneticGame(true)}
                  id="mufradat-magnetic-puzzle-btn"
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border-2 border-amber-300 active:scale-95 hover:scale-105"
                  title="مقناطیسی بورڈ اور حروف پزل گیم"
                >
                  <Puzzle className="w-4 h-4 text-zinc-950" />
                  <span>{qloc.magneticPuzzle}</span>
                </button>

                <button
                  onClick={() => setShowMakharijModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 border border-cyan-500"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{qloc.makharijMap}</span>
                </button>

                <button
                  onClick={() => setShowDotsHighlight(!showDotsHighlight)}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2 border ${
                    showDotsHighlight 
                      ? 'bg-amber-500 text-zinc-950 border-amber-600 ring-2 ring-amber-300' 
                      : 'bg-zinc-800 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{showDotsHighlight ? qloc.dotsHighlighted : qloc.showDots}</span>
                </button>
              </div>
            </div>

            {/* Descriptive Tajweed Box & Custom Audio Studio Button */}
            <div className="bg-amber-100/90 border-2 border-amber-500/60 rounded-2xl p-4 text-xs sm:text-sm text-zinc-900 leading-loose space-y-3 text-right shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-300 pb-2">
                <p className="font-bold text-emerald-900 text-sm sm:text-base flex items-center gap-2">
                  <span>{qloc.mufradatNote1}</span>
                </p>

                {/* Prominent Recording & Upload Studio Button */}
                <button
                  onClick={() => setShowStudioModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 border-2 border-emerald-400 transform transition-all hover:scale-105 cursor-pointer animate-pulse"
                >
                  <Mic className="w-5 h-5 text-amber-300" />
                  <span>{qloc.recordYourVoice}</span>
                </button>
              </div>

              <p>
                {qloc.mufradatNote2}
              </p>
              <p>
                {qloc.mufradatMustaliyah}
              </p>
              <p className="bg-amber-200/80 p-2 rounded-xl border border-amber-400 font-bold text-amber-950">
                ⭐ {qloc.mufradatMaddLazimRule}
              </p>
              <p>
                {qloc.mufradatLipLetters}
              </p>
            </div>

            {/* Toast Notification Banner */}
            {toastMsg && (
              <div className="bg-emerald-900 text-amber-200 px-4 py-3 rounded-2xl border-2 border-emerald-500 font-bold text-center text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* HURUF GRID (29 CARDS) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {MADANI_HURUF_29.map((item) => {
                const isSelected = activeItem?.id === item.id;
                const hasCustomAudio = !!(customRecordingsMap[item.name] || customRecordingsMap[item.letter]);

                return (
                  <div
                    key={item.id}
                    onClick={() => speakLetter(item)}
                    className={`bg-white border-2 rounded-2xl p-4 text-center cursor-pointer transition-all shadow-md transform hover:scale-105 flex flex-col items-center justify-between gap-2 relative ${
                      isSelected ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-400' : 'border-emerald-600/50 hover:border-emerald-600'
                    }`}
                  >
                    <span className="absolute top-2 right-2 text-[10px] font-bold text-zinc-400">{item.id}</span>
                    
                    {/* Custom Voice Badge */}
                    {hasCustomAudio && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow border border-emerald-400">
                        <Mic className="w-3 h-3 text-amber-300" />
                        <span>{qloc.yourVoiceBadge}</span>
                      </span>
                    )}

                    {/* Green Arabic Pronunciation Header */}
                    <div className="flex flex-col items-center gap-1 mt-3 sm:mt-1">
                      <span className="text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                        ({item.name})
                      </span>
                      {item.hasMaddLazim && (
                        <span className="text-[9px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-400">
                          {qloc.maddLazim6Harakat}
                        </span>
                      )}
                    </div>

                    {/* Large Letter */}
                    <span className={`text-4xl sm:text-6xl font-black font-arabic my-2 ${item.isHeavy ? 'text-cyan-700' : 'text-zinc-900'}`}>
                      {item.letter}
                    </span>

                    {/* Dot Badge */}
                    {showDotsHighlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                        {getLocalizedDotText(item.dotText, currentLang)}
                      </span>
                    )}

                    {/* Re-record / Delete quick trigger */}
                    {hasCustomAudio && (
                      <div className="flex items-center gap-1 mt-1 pt-1 border-t border-zinc-100 w-full justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudioItem(item);
                            setShowStudioModal(true);
                          }}
                          className="text-[10px] text-teal-700 hover:text-teal-900 font-bold underline"
                        >
                          {currentLang === 'en' ? 'Edit' : currentLang === 'ar' ? 'تعديل' : currentLang === 'hi' ? 'बदलें' : currentLang === 'bn' ? 'পরিবর্তন' : currentLang === 'id' ? 'Ubah' : currentLang === 'tr' ? 'Düzenle' : currentLang === 'fr' ? 'Modifier' : 'تبدیل کریں'}
                        </button>
                        <span className="text-zinc-300">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSingleRecording(item);
                          }}
                          className="text-[10px] text-rose-600 hover:text-rose-800 font-bold underline"
                        >
                          {currentLang === 'en' ? 'Delete' : currentLang === 'ar' ? 'حذف' : currentLang === 'hi' ? 'हटाएं' : currentLang === 'bn' ? 'মুছুন' : currentLang === 'id' ? 'Hapus' : currentLang === 'tr' ? 'Sil' : currentLang === 'fr' ? 'Supprimer' : 'ڈیلیٹ'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* BOTTOM AUDIO & VIDEO TOOLBAR */}
            <div className="bg-zinc-900 border border-amber-800/40 p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStudioModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 border border-teal-400 shadow-md cursor-pointer"
                >
                  <Mic className="w-4 h-4 text-amber-300" />
                  <span>{currentLang === 'en' ? 'Voice Recording Studio' : currentLang === 'ar' ? 'استوديو تسجيل الصوت' : currentLang === 'hi' ? 'वॉइस रिकॉर्डिंग स्टूडियो' : currentLang === 'bn' ? 'ভয়েস রেকর্ডিং স্টুডিও' : currentLang === 'id' ? 'Studio Rekaman Suara' : currentLang === 'tr' ? 'Ses Kayıt Stüdyosu' : currentLang === 'fr' ? 'Studio d\'Enregistrement' : 'آواز ریکارڈنگ اسٹوڈیو'}</span>
                </button>

                {Object.keys(customRecordingsMap).length > 0 && (
                  <button
                    onClick={handleClearAllRecordings}
                    className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-900/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-zinc-700 cursor-pointer"
                    title="Delete All Recordings"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Delete All Recordings' : currentLang === 'ar' ? 'حذف جميع التسجيلات' : currentLang === 'hi' ? 'सभी रिकॉर्डिंग हटाएं' : currentLang === 'bn' ? 'সব রেকর্ডিং মুছুন' : currentLang === 'id' ? 'Hapus Semua Rekaman' : currentLang === 'tr' ? 'Tüm Kayıtları Sil' : currentLang === 'fr' ? 'Tout supprimer' : 'تمام ریکارڈنگز ڈیلیٹ کریں'}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={onOpenLiveUstadh}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <VideoIcon className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Video (Live Practice)' : currentLang === 'ar' ? 'فيديو (تدريب مباشر)' : currentLang === 'hi' ? 'वीडियो (लाइव अभ्यास)' : currentLang === 'bn' ? 'ভিডিও (লাইভ অনুশীলন)' : currentLang === 'id' ? 'Video (Latihan Live)' : currentLang === 'tr' ? 'Video (Canlı Pratik)' : currentLang === 'fr' ? 'Vidéo (Pratique en direct)' : 'وڈیو (لائیو مشق)'}</span>
                </button>

                <button
                  onClick={playFullSequence}
                  className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isPlayingAudio ? 'bg-amber-600 text-white animate-pulse' : 'bg-yellow-400 text-zinc-950 hover:bg-yellow-300'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? (currentLang === 'en' ? 'Pause...' : currentLang === 'ar' ? 'إيقاف...' : 'روکیں...') : (currentLang === 'en' ? 'Listen All Letters' : currentLang === 'ar' ? 'استماع الحروف' : currentLang === 'hi' ? 'सभी अक्षर सुनें' : currentLang === 'bn' ? 'সব হরফ শুনুন' : currentLang === 'id' ? 'Dengar Semua Huruf' : currentLang === 'tr' ? 'Tüm Harfleri Dinle' : currentLang === 'fr' ? 'Écouter les lettres' : 'آڈیو سنیں (الگ الگ حروف)')}</span>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer ${
                    isMuted ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? (currentLang === 'en' ? 'Muted' : currentLang === 'ar' ? 'كتم الصوت' : 'میوٹ') : (currentLang === 'en' ? 'Sound On' : currentLang === 'ar' ? 'تشغيل الصوت' : 'آواز آن')}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {showMakharijModal && (
        <MakharijChartModal onClose={() => setShowMakharijModal(false)} currentLang={currentLang} />
      )}

      {/* CUSTOM HURUF-E-TAHAJJI VOICE RECORDING & UPLOAD STUDIO MODAL */}
      {showStudioModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-zinc-900 text-white border-2 border-emerald-500 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg">
                  <Mic className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-amber-300">حروفِ تہجی آواز ریکارڈر و اپلوڈ اسٹوڈیو</h3>
                  <p className="text-xs text-zinc-400">اپنی ریکارڈ کی ہوئی آواز یا آڈیو فائل حروفِ تہجی (مفردات) میں سیٹ کریں</p>
                </div>
              </div>
              <button
                onClick={() => {
                  stopMicRecording();
                  setShowStudioModal(false);
                }}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Letter Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 block">
                ۱. اس حرف کا انتخاب کریں جس کی آواز آپ اپلوڈ/ریکارڈ کرنا چاہتے ہیں:
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-2 bg-zinc-950 rounded-2xl border border-zinc-800">
                {MADANI_HURUF_29.map((item) => {
                  const isSelected = selectedStudioItem.id === item.id;
                  const hasCustom = !!(customRecordingsMap[item.name] || customRecordingsMap[item.letter]);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedStudioItem(item);
                        setTempAudioUrl(null);
                      }}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border relative ${
                        isSelected 
                          ? 'bg-amber-500 text-zinc-950 font-black border-amber-300 scale-105 shadow-md' 
                          : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      <span className="text-lg font-black">{item.letter}</span>
                      <span className="text-[9px] opacity-80">{item.name}</span>
                      {hasCustom && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-zinc-900" title="Custom Voice Uploaded" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Letter Preview */}
            <div className="bg-zinc-950 border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl font-black text-amber-300">
                  {selectedStudioItem.letter}
                </div>
                <div>
                  <h4 className="text-base font-black text-emerald-300">حرف: {selectedStudioItem.name} ({selectedStudioItem.letter})</h4>
                  <p className="text-xs text-zinc-400">{selectedStudioItem.dotText}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playQariText(selectedStudioItem.name)}
                  className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer border border-emerald-600"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>آواز سنیں</span>
                </button>
              </div>
            </div>

            {/* Recording & Upload Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: Live Microphone Recording */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5 mb-1">
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>طریقہ ۱: براؤزر مائیک سے ریکارڈ کریں</span>
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    مائیک بٹن دبائیں، اپنے ڈیوائس کا مائیکروفون کھول کر بولیں اور روک کر محفوظ کریں۔
                  </p>
                </div>

                {!isRecordingMic ? (
                  <button
                    onClick={startMicRecording}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>ریکارڈنگ شروع کریں</span>
                  </button>
                ) : (
                  <button
                    onClick={stopMicRecording}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer animate-pulse"
                  >
                    <Square className="w-4 h-4 text-rose-900" />
                    <span>ریکارڈنگ روکیں (ریکارڈ ہو رہا ہے...)</span>
                  </button>
                )}
              </div>

              {/* Option B: Audio File Upload */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-xs font-black text-amber-300 flex items-center gap-1.5 mb-1">
                    <Upload className="w-4 h-4 text-teal-400" />
                    <span>طریقہ ۲: ریکارڈ شدہ آڈیو فائل اپلوڈ کریں</span>
                  </h5>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    کمپیوٹر یا موبائل سے MP3, WAV, M4A, WEBM فائل منتخب کریں۔
                  </p>
                </div>

                <label className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all text-center">
                  <Upload className="w-4 h-4 text-amber-300" />
                  <span>آڈیو فائل چنیں</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            {/* Temp Audio Playback & Final Save */}
            {tempAudioUrl && (
              <div className="bg-emerald-950/80 border-2 border-emerald-500/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>نئی ریکارڈ شدہ آواز تیار ہے!</span>
                  </span>
                  <audio src={tempAudioUrl} controls className="h-8 max-w-[200px]" />
                </div>

                <button
                  onClick={() => handleSaveRecordingForSelected(tempAudioUrl)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>حرف "{selectedStudioItem.name}" کے لیے یہ آواز محفوظ کریں</span>
                </button>
              </div>
            )}

            {/* Existing Custom Recording Status for this letter */}
            {getCustomHurufAudio(selectedStudioItem.name) && (
              <div className="bg-zinc-950 p-3 rounded-xl border border-teal-500/50 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>اس حرف کی کسٹم آواز اپلوڈ شدہ ہے</span>
                </span>
                <button
                  onClick={() => handleDeleteSingleRecording(selectedStudioItem)}
                  className="px-3 py-1 rounded-lg bg-rose-900/40 hover:bg-rose-900 text-rose-300 font-bold border border-rose-800 text-[11px]"
                >
                  ڈیلیٹ کریں
                </button>
              </div>
            )}

            {/* Footer Summary */}
            <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-xs text-zinc-400">
              <span>کل اپلوڈ شدہ کسٹم آوازیں: <strong className="text-amber-300">{Object.keys(customRecordingsMap).length / 2} / 29</strong></span>
              <button
                onClick={() => setShowStudioModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black"
              >
                مکمل ہوا
              </button>
            </div>

          </div>
        </div>
      )}

      {/* QAIDA GAMES & BLANK BOARD MODAL */}
      {showQaidaGamesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md overflow-y-auto p-2 sm:p-6">
          <QaidaGamesModal currentLang={currentLang} onBack={() => setShowQaidaGamesModal(false)} />
        </div>
      )}

      {/* MAGNETIC BOARD & QURANIC PUZZLE GAME (MUFRADAT / TAHAJJI MODE) */}
      {showMagneticGame && (
        <MurakkabatPuzzleGameModal
          currentLang={currentLang}
          initialGameMode="mufradat"
          onBack={() => setShowMagneticGame(false)}
        />
      )}

    </div>
  );
};
