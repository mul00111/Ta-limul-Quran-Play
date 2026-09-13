import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, Mic, MicOff, Camera, CameraOff, Users, MessageSquare, 
  Hand, Send, Sparkles, CheckCircle2, Award, BookOpen, 
  Volume2, VolumeX, RotateCcw, Download, Trash2, PenTool, Globe, Plus, UserPlus,
  Play, Pause, Radio, Monitor, LayoutGrid, Heart, Flame, ShieldAlert,
  Disc, Square, FileText, UserCheck, XCircle, LogIn, User, ShieldCheck, RefreshCw, Bell,
  Maximize2, Minimize2, ScreenShare, ScreenShareOff, SwitchCamera, Sparkle, Sliders, Waves,
  Check, Volume1, Bookmark, Eye, HelpCircle, Layers, Star, Zap, Gauge, ArrowLeftRight, Crown
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';
import { PARA_30_SURAHS, ProjectorSurah } from '../data/para30Surahs';
import { getAlafasyUrlForSurahAyah, getSelectedQariVoiceId } from '../utils/qariAudioService';
import { useBackHandler } from '../hooks/useBackHandler';

interface LiveUstadhClassroomProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

interface Mudarris {
  id: string;
  name: string;
  title: string;
  studentsCount: number;
  avatar: string;
  country: string;
}

interface ReactionParticle {
  id: string;
  emoji: string;
  x: number;
}

interface QuranVerse {
  number: number;
  arabic: string;
  urdu: string;
  audioUrl: string;
}

interface AttendanceRecord {
  id: string;
  name: string;
  country: string;
  level: string;
  time: string;
  date: string;
  status: 'حاضر (Present)' | 'غائب (Absent)' | 'تاخیر (Late)';
  role: 'student' | 'ustadh';
}

interface UserProfile {
  id: string;
  name: string;
  role: 'ustadh' | 'student';
  title?: string;
  country?: string;
  level?: string;
  joinTime: string;
}

const SURAH_FATIHA_VERSES: QuranVerse[] = [
  { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3' },
  { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', urdu: 'سب تعریفیں اللہ ہی کے لیے ہیں جو تمام جہانوں کا پرورش کرنے والا ہے', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2.mp3' },
  { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', urdu: 'بہت مہربان، نہایت رحم فرمانے والا', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/3.mp3' },
  { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', urdu: 'روز جزا اور بدلے کے دن کا مالک', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3' },
  { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', urdu: 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5.mp3' },
  { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', urdu: 'ہمیں سیدھے اور سچے راستے کی ہدایت فرما', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/6.mp3' },
  { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', urdu: 'ان لوگوں کا راستہ جن پر تو نے انعام فرمایا، جن پر نہ غضب ہوا اور نہ وہ گمراہ ہوئے', audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/7.mp3' },
];

export const LiveUstadhClassroom: React.FC<LiveUstadhClassroomProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];
  
  // Tabs: 'classroom' | 'blackboard' | 'attendance' | 'mudarris-list'
  const [activeTab, setActiveTab] = useState<'classroom' | 'blackboard' | 'attendance' | 'mudarris-list'>('classroom');

  // View mode inside Classroom: 'duo' (Face-to-Face 1-on-1) | 'speaker' | 'mushaf' | 'gallery'
  const [screenMode, setScreenMode] = useState<'duo' | 'speaker' | 'mushaf' | 'gallery'>('duo');

  // Current Active User (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('live_class_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  // Save current user on update
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('live_class_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('live_class_current_user');
    }
  }, [currentUser]);

  // Unlimited Mudarris (Teachers) list with localStorage persistence
  const [mudarrisList, setMudarrisList] = useState<Mudarris[]>(() => {
    const saved = localStorage.getItem('live_class_mudarris_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', name: 'الشيخ الأستاذ أحمد الحافظ', title: 'معلم القران الكريم والتجويد (Expert Tajweed)', studentsCount: 1420, avatar: '👨‍🏫', country: 'مصر 🇪🇬' },
      { id: '2', name: 'القاري زياد القاسمي', title: 'خبير مخارج الحروف وقواعد النورانية', studentsCount: 980, avatar: '🧕', country: 'باكستان 🇵🇰' },
      { id: '3', name: 'الأستاذة مریم الکبری', title: 'معلمة الحفظ والتجويد للبنات والأطفال', studentsCount: 2310, avatar: '👩‍🏫', country: 'الإمارات 🇦🇪' },
      { id: '4', name: 'الشیخ بلال المصطفی', title: 'حلقة القراءات السبع والسبع المثاني', studentsCount: 750, avatar: '🧔', country: 'السعودية 🇸🇦' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('live_class_mudarris_list', JSON.stringify(mudarrisList));
  }, [mudarrisList]);

  const [selectedMudarris, setSelectedMudarris] = useState<Mudarris>(mudarrisList[0]);

  // Join & Role Selection Modals
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinRoleTab, setJoinRoleTab] = useState<'ustadh' | 'student'>('student');

  // Forms State
  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('اسلام آباد، پاکستان 🇵🇰');
  const [formTitle, setFormTitle] = useState('استاد و قاری قرآن کریم (تجويد و مخارج)');
  const [formLevel, setFormLevel] = useState('قاعدة نورانية');
  const [formContact, setFormContact] = useState('+92 300 1234567');
  const [formExperience, setFormExperience] = useState('10 سالہ آن لائن تدریسی تجربہ، فاضل مدینہ و جامعہ الازہر شریف');

  // Teacher detail viewer modal
  const [selectedTeacherDetail, setSelectedTeacherDetail] = useState<{ id: string; name: string; title: string; country: string; contact?: string; experience?: string; time: string } | null>(null);

  // Direct Add Student modal for Ustadh
  const [showDirectAddStudentModal, setShowDirectAddStudentModal] = useState(false);
  const [directStudentName, setDirectStudentName] = useState('');
  const [directStudentCountry, setDirectStudentCountry] = useState('پاکستان 🇵🇰');
  const [directStudentLevel, setDirectStudentLevel] = useState('قاعدة نورانية');

  // Pending approval arrays (starts clean without static demo data)
  const [pendingStudents, setPendingStudents] = useState<Array<{ id: string; name: string; country: string; level: string; time: string }>>([]);
  const [pendingTeachers, setPendingTeachers] = useState<Array<{ id: string; name: string; title: string; country: string; contact?: string; experience?: string; time: string }>>([]);

  // Back Button Handlers (Hierarchy: Modals > Return to Home)
  useBackHandler(() => {
    setShowJoinModal(false);
  }, showJoinModal, 50, 'live_class_join_modal');

  useBackHandler(() => {
    setShowDirectAddStudentModal(false);
  }, showDirectAddStudentModal, 50, 'live_class_add_student_modal');

  useBackHandler(() => {
    setSelectedTeacherDetail(null);
  }, selectedTeacherDetail !== null, 50, 'live_class_teacher_detail_modal');

  useBackHandler(() => {
    onBack();
  }, !showJoinModal && !showDirectAddStudentModal && selectedTeacherDetail === null, 20, 'live_class_root_back');

  const simulateIncomingUstadhRequest = () => {
    const sampleTeachers = [
      {
        id: 'pt_' + Date.now() + '_1',
        name: 'فضيلة الشيخ القاري عبد الرحمن آل سعود',
        title: 'خبير القراءات العشر وأحكام التجويد (استاد تجوید و قراءات)',
        country: 'مکہ مکرمہ، سعودی عرب 🇸🇦',
        contact: '+966 50 123 4567',
        experience: '15 سالہ تدریسی تجربہ، جامعہ ام القریٰ مکہ مکرمہ',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'pt_' + Date.now() + '_2',
        name: 'الأستاذ الدكتور محمد شفيق الباكستاني',
        title: 'مدرس القواعد النورانية والقرآن الكريم (شعبہ حفظ و نورانی قاعدہ)',
        country: 'اسلام آباد، پاکستان 🇵🇰',
        contact: '+92 300 9876543',
        experience: '10 سالہ آن لائن تدریس و سند الماهر فی القرآن',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'pt_' + Date.now() + '_3',
        name: 'الشيخ القاري إبراهيم الأخضر',
        title: 'مدرس الحفظ والتلاوة بالمسجد النبوي الشريف',
        country: 'مدینہ منورہ، سعودی عرب 🇸🇦',
        contact: '+966 54 999 8877',
        experience: 'سابق قاری المسجد النبوی الشریف، خبير السبع القراءات',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'pt_' + Date.now() + '_4',
        name: 'المعلم القاري يوسف نور',
        title: 'استاد مخارج الحروف والتجويد المصور (جامعہ الازہر)',
        country: 'قاہرہ، مصر 🇪🇬',
        contact: '+20 100 123 9988',
        experience: 'استاد تجوید جامعہ الازہر الشریف، مؤلف کتب تجوید',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: 'pt_' + Date.now() + '_5',
        name: 'الشيخ القاري محمود الخشت',
        title: 'قاري واستاد تاج القرآن و مدرسِ جامعہ',
        country: 'لاہور، پاکستان 🇵🇰',
        contact: '+92 321 4455667',
        experience: '12 سالہ تجربہ بحیثیت استادِ شعبہ تجوید و قراءت',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    const randomT = sampleTeachers[Math.floor(Math.random() * sampleTeachers.length)];

    setPendingTeachers(prev => [randomT, ...prev]);
    speakUstadh(`وصل طلب انضمام جديد من الأستاذ ${randomT.name} من ${randomT.country}`);
    showToast(`🔔 لائیو درخواست: استاد ${randomT.name} (${randomT.country}) کی تدریس کی درخواست موصول ہوئی! 📝`);
  };

  const [showOwnerApprovalModal, setShowOwnerApprovalModal] = useState(false);
  const [showParentGuideModal, setShowParentGuideModal] = useState(false);

  // Gallery Meeting Grid Students
  const [meetingStudents, setMeetingStudents] = useState([
    { id: 's1', name: 'أحمد خان', country: 'پاکستان 🇵🇰', isSpeaking: true, handRaised: false, avatar: '👦' },
    { id: 's2', name: 'فاطمة زہرا', country: 'یو اے ای 🇦🇪', isSpeaking: false, handRaised: true, avatar: '👧' },
    { id: 's3', name: 'محمد عمر', country: 'برطانیہ 🇬🇧', isSpeaking: false, handRaised: false, avatar: '🧑' },
    { id: 's4', name: 'عائشة صدیقی', country: 'امریکہ 🇺🇸', isSpeaking: false, handRaised: false, avatar: '👧' },
    { id: 's5', name: 'زينب بتول', country: 'کینیڈا 🇨🇦', isSpeaking: false, handRaised: true, avatar: '👧' },
    { id: 's6', name: 'عبد الله فاروق', country: 'سعودی عرب 🇸🇦', isSpeaking: false, handRaised: false, avatar: '👦' },
  ]);

  // Classroom state
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [liveTalbaCount, setLiveTalbaCount] = useState(1425);
  
  // Real Media Stream Reference
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [camError, setCamError] = useState(false);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Reactions Particles
  const [reactions, setReactions] = useState<ReactionParticle[]>([]);

  // Quran Recitation Audio State (Mus'haf Projector - Para 30 & Surah Fatiha)
  const [selectedProjectorSurah, setSelectedProjectorSurah] = useState<ProjectorSurah>(PARA_30_SURAHS[0]);
  const [surahSearchQuery, setSurahSearchQuery] = useState('');
  const [isPlayingRecitation, setIsPlayingRecitation] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const quranAudioRef = useRef<HTMLAudioElement | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Chat State (Persisted)
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; text: string; time: string; isUstadh?: boolean }>>(() => {
    const saved = localStorage.getItem('live_class_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', sender: 'الشيخ الأستاذ أحمد الحافظ', text: 'أهلاً بك يا طلاب! مرحباً بكم جميعاً في حلقة القرآن الكريم العالمية. سبحان الله وبحمده!', time: '10:00 AM', isUstadh: true },
      { id: '2', sender: 'فاطمة زہرا', text: 'السلام عليكم يا استاذ! ما شاء الله عدد الطلاب كبير جداً', time: '10:01 AM' },
      { id: '3', sender: 'أحمد خان', text: 'وعليكم السلام! حاضر يا استاذ نحن مستعدون للدرس', time: '10:02 AM' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('live_class_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const [inputMessage, setInputMessage] = useState('');

  // Attendance Ledger (Persisted in localStorage)
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('live_class_attendance_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const today = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    return [
      { id: 'a1', name: 'أحمد خان (Ahmad Khan)', country: 'پاکستان 🇵🇰', level: 'قاعدة نورانية', time: '10:00 AM', date: today, status: 'حاضر (Present)', role: 'student' },
      { id: 'a2', name: 'فاطمة زہرا (Fatima Zahra)', country: 'یو اے ای 🇦🇪', level: 'حفظ القرآن', time: '10:01 AM', date: today, status: 'حاضر (Present)', role: 'student' },
      { id: 'a3', name: 'محمد عمر (Muhammad Umar)', country: 'برطانیہ 🇬🇧', level: 'تجويد و مخارج', time: '10:03 AM', date: today, status: 'حاضر (Present)', role: 'student' },
      { id: 'a4', name: 'عائشة صدیقی (Aisha Siddiqui)', country: 'امریکہ 🇺🇸', level: 'ناظره قرآن', time: '10:05 AM', date: today, status: 'حاضر (Present)', role: 'student' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('live_class_attendance_list', JSON.stringify(attendanceList));
  }, [attendanceList]);

  // Blackboard state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#f3f4f6');
  const [brushSize, setBrushSize] = useState(4);
  const [boardMode, setBoardMode] = useState<'free' | 'qaida' | 'tajweed'>('free');
  const [customStampText, setCustomStampText] = useState('');
  
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  // Camera, Video Quality & Facing Mode State
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMirrored, setIsMirrored] = useState(true);
  const [videoQuality, setVideoQuality] = useState<'1080p' | '720p' | 'saver'>('1080p');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenShareStreamRef = useRef<MediaStream | null>(null);

  // Ustadh Live Tajweed Feedback Banner State
  const [tajweedFeedback, setTajweedFeedback] = useState<{ text: string; subtext: string; icon: string; id: number } | null>(null);

  // Audio Speed, Repetition Loop & Laser Pointer State for Quran & Classroom
  const [recitationSpeed, setRecitationSpeed] = useState<number>(1.0);
  const [isAyahLoop, setIsAyahLoop] = useState(false);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });

  // Real-time Audio Level Visualizer (simulated decibel fluctuation when mic is active)
  const [micDecibels, setMicDecibels] = useState(15);
  useEffect(() => {
    let interval: any = null;
    if (isMicOn) {
      interval = setInterval(() => {
        setMicDecibels(Math.floor(Math.random() * 65) + 35);
      }, 150);
    } else {
      setMicDecibels(8);
    }
    return () => clearInterval(interval);
  }, [isMicOn]);

  // Ustadh audio speaking decibels (active during recitation or speech)
  const [ustadhDecibels, setUstadhDecibels] = useState(30);
  useEffect(() => {
    let interval: any = null;
    if (isPlayingRecitation) {
      interval = setInterval(() => {
        setUstadhDecibels(Math.floor(Math.random() * 55) + 45);
      }, 180);
    } else {
      setUstadhDecibels(12);
    }
    return () => clearInterval(interval);
  }, [isPlayingRecitation]);

  // Trigger Ustadh Tajweed Feedback to Student
  const sendTajweedFeedback = (text: string, subtext: string, icon: string, arabicVoice: string) => {
    setTajweedFeedback({ text, subtext, icon, id: Date.now() });
    speakUstadh(arabicVoice);
    showToast(`استاد کی طرف سے لائیو تجوید رائے: ${text} ✨`);
    setTimeout(() => {
      setTajweedFeedback(null);
    }, 4500);
  };

  // Handle Camera toggling & Facing Mode
  useEffect(() => {
    if (isCamOn) {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: videoQuality === '1080p' ? { ideal: 1920 } : videoQuality === '720p' ? { ideal: 1280 } : { ideal: 640 },
          height: videoQuality === '1080p' ? { ideal: 1080 } : videoQuality === '720p' ? { ideal: 720 } : { ideal: 480 },
        },
        audio: isMicOn
      };

      navigator.mediaDevices?.getUserMedia(constraints)
        .then(stream => {
          setMediaStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCamError(false);
        })
        .catch(err => {
          console.log("Webcam access error / fallback to simulated HD stream:", err);
          // Try fallback without strict resolution
          navigator.mediaDevices?.getUserMedia({ video: true, audio: isMicOn })
            .then(fallbackStream => {
              setMediaStream(fallbackStream);
              if (videoRef.current) {
                videoRef.current.srcObject = fallbackStream;
              }
              setCamError(false);
            })
            .catch(() => {
              setCamError(true);
            });
        });
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        setMediaStream(null);
      }
    }
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCamOn, facingMode, videoQuality]);

  // Handle Screen Sharing Toggle
  const toggleScreenSharing = async () => {
    if (isScreenSharing) {
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(t => t.stop());
        screenShareStreamRef.current = null;
      }
      setIsScreenSharing(false);
      showToast('اسکرین شیئرنگ بند کر دی گئی 🖥️');
    } else {
      try {
        if (navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          screenShareStreamRef.current = stream;
          setIsScreenSharing(true);
          showToast('آپ کی اسکرین کلاس روم میں لائیو شیئر ہو رہی ہے! 🖥️✨');
          stream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            showToast('اسکرین شیئرنگ ختم ہو گئی');
          };
        } else {
          showToast('براؤزر اسکرین شیئرنگ کی اجازت نہیں دیتا');
        }
      } catch (e) {
        showToast('اسکرین شیئرنگ منسوخ کر دی گئی');
      }
    }
  };

  // Recording Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatRecordingTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Speech helper for Ustadh voice
  const speakUstadh = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(text);
      ut.lang = 'ar-SA';
      ut.rate = 0.85;
      window.speechSynthesis.speak(ut);
    }
  };

  // Floating Reactions Trigger
  const triggerReaction = (emoji: string) => {
    const newPart: ReactionParticle = {
      id: Date.now().toString() + Math.random(),
      emoji,
      x: Math.floor(Math.random() * 80) + 10,
    };
    setReactions(prev => [...prev, newPart]);
    setTimeout(() => {
      setReactions(prev => prev.filter(p => p.id !== newPart.id));
    }, 2500);
  };

  // Play Real Quran Recitation Ayah
  const playAyahRecitation = (index: number, surahObj = selectedProjectorSurah) => {
    if (!surahObj || !surahObj.verses || surahObj.verses.length === 0) return;
    const safeIndex = Math.min(Math.max(0, index), surahObj.verses.length - 1);
    setCurrentAyahIndex(safeIndex);
    setIsPlayingRecitation(true);
    const verse = surahObj.verses[safeIndex];
    if (verse) {
      const activeQariId = getSelectedQariVoiceId();
      const dynamicAudioUrl = getAlafasyUrlForSurahAyah(surahObj.number, verse.number, activeQariId) || verse.audioUrl;
      if (quranAudioRef.current && dynamicAudioUrl) {
        quranAudioRef.current.src = dynamicAudioUrl;
        quranAudioRef.current.play().catch(e => {
          console.log("Audio play error, falling back to synthesis:", e);
          speakUstadh(verse.arabic);
        });
      } else {
        speakUstadh(verse.arabic);
      }
    }
  };

  const toggleQuranRecitation = () => {
    if (isPlayingRecitation) {
      if (quranAudioRef.current) quranAudioRef.current.pause();
      setIsPlayingRecitation(false);
    } else {
      playAyahRecitation(currentAyahIndex, selectedProjectorSurah);
    }
  };

  const handleSelectProjectorSurah = (surah: ProjectorSurah) => {
    if (quranAudioRef.current) {
      quranAudioRef.current.pause();
    }
    setIsPlayingRecitation(false);
    setSelectedProjectorSurah(surah);
    setCurrentAyahIndex(0);
    showToast(`مصحف پروجیکٹر: ${surah.name} (${surah.urduName}) منتخب کی گئی ✨`);
  };

  // Blackboard drawing handlers
  useEffect(() => {
    if (activeTab === 'blackboard' && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement?.clientWidth || 750;
      canvas.height = 420;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBoardLines(ctx, canvas.width, canvas.height);
      }
    }
  }, [activeTab, boardMode]);

  const drawBoardLines = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 1.5;
    for (let i = 70; i < h; i += 70) {
      ctx.beginPath();
      ctx.moveTo(30, i);
      ctx.lineTo(w - 30, i);
      ctx.stroke();
    }

    if (boardMode === 'qaida') {
      ctx.font = 'bold 55px Amiri, Arial';
      ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
      ctx.textAlign = 'center';
      ctx.fillText('أَ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ سَ شَ', w / 2, 120);
      ctx.fillText('صَ ضَ طَ ظَ عَ غَ فَ قَ كَ ل مَ نَ هَ وَ يَ', w / 2, 260);
    } else if (boardMode === 'tajweed') {
      ctx.font = 'bold 45px Amiri, Arial';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.textAlign = 'center';
      ctx.fillText('قَـلْـقَـلَـة الكبرى والصغرى: (ق ط ب ج د)', w / 2, 150);
      ctx.fillText('حروف المد الطبيعي: (ا ، و ، ي)', w / 2, 280);
    }
  };

  const stampTextToBoard = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.font = 'bold 42px Amiri, Arial';
    ctx.fillStyle = brushColor === '#111827' ? '#f3f4f6' : brushColor;
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);
    ctx.restore();
    speakUstadh(`تم كتابة: ${text}`);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = 'clientY' in e ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    lastXRef.current = clientX - rect.left;
    lastYRef.current = clientY - rect.top;
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = 'clientY' in e ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    const xc = (lastXRef.current + currentX) / 2;
    const yc = (lastYRef.current + currentY) / 2;
    ctx.quadraticCurveTo(lastXRef.current, lastYRef.current, xc, yc);
    ctx.stroke();

    lastXRef.current = currentX;
    lastYRef.current = currentY;
  };

  const clearBlackboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBoardLines(ctx, canvas.width, canvas.height);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const senderName = currentUser ? currentUser.name : 'آپ (You - Talib-e-Ilm)';
    const isTeacher = currentUser?.role === 'ustadh';

    const newMsg = {
      id: Date.now().toString(),
      sender: senderName,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUstadh: isTeacher
    };

    setChatMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    if (!isTeacher) {
      // Simulate Ustadh reply
      setTimeout(() => {
        const replies = [
          `ماشاء الله يا ${senderName}! بارك الله فيك على هذه المشاركة الطيبة.`,
          `أحسنت جداً! استمر في القراءة بتجويد صحيح.`,
          `سبحان الله وبحمده! أجبت إجابة صحيحة وموفقة.`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        speakUstadh(randomReply);
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: selectedMudarris.name,
            text: randomReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isUstadh: true,
          }
        ]);
      }, 1400);
    }
  };

  // Mark Self Attendance
  const markSelfAttendance = () => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    const nameToMark = currentUser ? `${currentUser.name} (${currentUser.country || 'پاکستان 🇵🇰'})` : 'آپ (You - Active Student)';

    // Check if already marked
    const exists = attendanceList.some(a => a.name === nameToMark);
    if (exists) {
      showToast('آپ کی حاضری پہلے ہی درج ہے! 🟢');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      name: nameToMark,
      country: currentUser?.country || 'پاکستان 🇵🇰',
      level: currentUser?.level || 'قاعدة نورانية',
      time: nowTime,
      date: todayDate,
      status: 'حاضر (Present)',
      role: currentUser?.role || 'student'
    };

    setAttendanceList(prev => [newRecord, ...prev]);
    setLiveTalbaCount(c => c + 1);
    speakUstadh('تم تسجيل الحضور بنجاح في السجل العالمي للطلبة!');
    showToast('آپ کی حاضری کامیابی کے ساتھ درج ہو گئی! 🟢');
  };

  // Ustadh / Admin Attendance Actions
  const markAllPresent = () => {
    setAttendanceList(prev => prev.map(item => ({
      ...item,
      status: 'حاضر (Present)'
    })));
    speakUstadh('تم تسجيل جميع الطلاب حاضرين في السجل!');
    showToast('تمام طلباء کی حاضری کو "حاضر" کر دیا گیا! 🟢');
  };

  const toggleStudentStatus = (id: string) => {
    setAttendanceList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'حاضر (Present)' ? 'غائب (Absent)' : item.status === 'غائب (Absent)' ? 'تاخیر (Late)' : 'حاضر (Present)';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceList(prev => prev.filter(item => item.id !== id));
    showToast('حاضری کے ریکارڈ سے حذف کر دیا گیا');
  };

  // Download Attendance Report file
  const downloadAttendanceReport = () => {
    const today = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });
    const presentCount = attendanceList.filter(a => a.status.includes('Present') || a.status.includes('حاضر')).length;
    
    let reportText = `=====================================================\n`;
    reportText += `   جامعہ آن لائن نورانی قاعدہ و قرآن - لائیو حاضری رپورٹ\n`;
    reportText += `=====================================================\n`;
    reportText += `استاد کا نام: ${selectedMudarris.name}\n`;
    reportText += `تاریخ: ${today}\n`;
    reportText += `کل تعداد: ${attendanceList.length} | حاضر: ${presentCount} | غائب: ${attendanceList.length - presentCount}\n`;
    reportText += `=====================================================\n\n`;
    reportText += `شمار | طالب علم کا نام | ملک | تعلیمی درجہ | وقت | حاضری\n`;
    reportText += `-----------------------------------------------------\n`;
    
    attendanceList.forEach((item, idx) => {
      reportText += `${idx + 1}. ${item.name} | ${item.country} | ${item.level} | ${item.time} | ${item.status}\n`;
    });

    reportText += `\n=====================================================\n`;
    reportText += `درج شدہ محفوظ ڈیٹا: جامعہ آن لائن محفوظ ہوسٹنگ\n`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Haziri_Report_${selectedMudarris.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('حاضری کی مکمل رپورٹ ٹیکسٹ فائل میں ڈاؤن لوڈ ہو گئی! 📥');
  };

  // Handle Join as Ustadh or Student
  const handleJoinFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

    if (joinRoleTab === 'ustadh') {
      // Create new Mudarris
      const newM: Mudarris = {
        id: Date.now().toString(),
        name: formName,
        title: formTitle || 'معلم القرآن الكريم والقواعد النورانية',
        studentsCount: 1,
        avatar: '👨‍🏫',
        country: formCountry || 'پاکستان 🇵🇰'
      };

      const newUser: UserProfile = {
        id: newM.id,
        name: formName,
        role: 'ustadh',
        title: newM.title,
        country: newM.country,
        joinTime: nowTime
      };

      setMudarrisList(prev => [newM, ...prev]);
      setSelectedMudarris(newM);
      setCurrentUser(newUser);

      // Add to attendance ledger as Host Ustadh
      const uAttendance: AttendanceRecord = {
        id: 'u_' + Date.now(),
        name: `${formName} (استاد - Host)`,
        country: formCountry,
        level: formTitle,
        time: nowTime,
        date: todayDate,
        status: 'حاضر (Present)',
        role: 'ustadh'
      };

      setAttendanceList(prev => [uAttendance, ...prev]);
      setShowJoinModal(false);
      speakUstadh(`مرحباً بكم يا فضيلة الشيخ ${formName}. تم تفعيل الغرفة لتدريس الطلاب.`);
      showToast(`استاد ${formName} کے طور پر کلاس کا انعقاد کر دیا گیا! 🎥`);

    } else {
      // Join as Student
      const newUser: UserProfile = {
        id: Date.now().toString(),
        name: formName,
        role: 'student',
        country: formCountry,
        level: formLevel,
        joinTime: nowTime
      };

      setCurrentUser(newUser);

      // Add student to meeting grid
      setMeetingStudents(prev => [
        { id: newUser.id, name: formName, country: formCountry, isSpeaking: false, handRaised: false, avatar: '👦' },
        ...prev
      ]);

      // Add student to attendance list
      const sAttendance: AttendanceRecord = {
        id: 's_' + Date.now(),
        name: `${formName} (${formCountry})`,
        country: formCountry,
        level: formLevel,
        time: nowTime,
        date: todayDate,
        status: 'حاضر (Present)',
        role: 'student'
      };

      setAttendanceList(prev => [sAttendance, ...prev]);
      setLiveTalbaCount(c => c + 1);

      // Add welcome chat
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: `${formName} (${formCountry})`,
          text: `السلام علیکم! میں کلاس میں شامل ہو گیا ہوں۔ کورس: ${formLevel}`,
          time: nowTime,
        }
      ]);

      setShowJoinModal(false);
      speakUstadh(`أهلاً بك يا طالب العلم ${formName}! تم تسجيلك في الحلقة بنجاح.`);
      showToast(`کلاس میں طالب علم ${formName} کا انضمام ہو گیا! 🎒`);
    }

    setFormName('');
  };

  // Direct Add Student by Ustadh
  const handleDirectAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directStudentName.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

    const newRec: AttendanceRecord = {
      id: Date.now().toString(),
      name: `${directStudentName} (${directStudentCountry})`,
      country: directStudentCountry,
      level: directStudentLevel,
      time: nowTime,
      date: todayDate,
      status: 'حاضر (Present)',
      role: 'student'
    };

    setAttendanceList(prev => [newRec, ...prev]);
    setMeetingStudents(prev => [
      { id: newRec.id, name: directStudentName, country: directStudentCountry, isSpeaking: false, handRaised: false, avatar: '👦' },
      ...prev
    ]);
    setLiveTalbaCount(c => c + 1);

    setShowDirectAddStudentModal(false);
    setDirectStudentName('');
    speakUstadh(`تمت إضافة الطالب ${directStudentName} بنجاح إلى سجل الحضور.`);
    showToast(`طالب علم ${directStudentName} کو حاضری رجسٹر میں شامل کر دیا گیا! 🟢`);
  };

  const approveStudent = (id: string) => {
    const sItem = pendingStudents.find(s => s.id === id);
    if (!sItem) return;

    setPendingStudents(prev => prev.filter(s => s.id !== id));
    setLiveTalbaCount(c => c + 1);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

    setAttendanceList(prev => [
      { id: Date.now().toString(), name: `${sItem.name} (${sItem.country})`, country: sItem.country, level: sItem.level, time: now, date: todayDate, status: 'حاضر (Present)', role: 'student' },
      ...prev
    ]);

    setMeetingStudents(prev => [
      { id: Date.now().toString(), name: sItem.name, country: sItem.country, isSpeaking: false, handRaised: false, avatar: '👦' },
      ...prev
    ]);

    speakUstadh(`طالب علم ${sItem.name} کی درخواست منظور ہو گئی ہے!`);
    showToast(`طالب علم ${sItem.name} کی کلاس میں انضمام کی منظوری مل گئی! 🌟`);
  };

  const rejectStudent = (id: string) => {
    const sItem = pendingStudents.find(s => s.id === id);
    setPendingStudents(prev => prev.filter(s => s.id !== id));
    speakUstadh('درخواست مسترد کر دی گئی ہے۔');
    showToast(`طالب علم ${sItem?.name || ''} کی درخواست مسترد کر دی گئی۔ 🔴`);
  };

  const approveTeacher = (id: string) => {
    const tItem = pendingTeachers.find(t => t.id === id);
    if (!tItem) return;

    setPendingTeachers(prev => prev.filter(t => t.id !== id));

    const newM: Mudarris = {
      id: Date.now().toString(),
      name: tItem.name,
      title: tItem.title || 'معلم القرآن الكريم والتجويد',
      studentsCount: 1,
      avatar: '👨‍🏫',
      country: tItem.country || 'پاکستان 🇵🇰'
    };

    setMudarrisList(prev => [newM, ...prev]);
    setSelectedMudarris(newM);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('ur-PK', { year: 'numeric', month: 'long', day: 'numeric' });

    setAttendanceList(prev => [
      {
        id: 'u_' + Date.now(),
        name: `${tItem.name} (استاد - Host)`,
        country: tItem.country || 'پاکستان 🇵🇰',
        level: tItem.title,
        time: now,
        date: todayDate,
        status: 'حاضر (Present)',
        role: 'ustadh'
      },
      ...prev
    ]);

    speakUstadh(`تمت موافقة طلب انضمام الأستاذ ${tItem.name}! أهلاً بك في شبكة المدرسين.`);
    showToast(`استاد ${tItem.name} کی تدریس کی درخواست (Darkhast) منظور کر لی گئی اور وہ اساتذہ کی ڈائریکٹری میں شامل ہو گئے! 🌟`);
  };

  const rejectTeacher = (id: string) => {
    const tItem = pendingTeachers.find(t => t.id === id);
    setPendingTeachers(prev => prev.filter(t => t.id !== id));
    speakUstadh('تم رفض طلب الانضمام.');
    showToast(`استاد ${tItem?.name || ''} کی درخواست مسترد کر دی گئی۔ 🔴`);
  };

  const handleTeacherApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newApp = {
      id: 'pt_' + Date.now(),
      name: formName,
      title: formTitle || 'معلم القرآن الكريم والقواعد النورانية',
      country: formCountry || 'پاکستان 🇵🇰',
      contact: formContact || '+92 300 0000000',
      experience: formExperience || 'مدرسِ قرآن کریم و تجوید',
      time: nowTime
    };

    setPendingTeachers(prev => [newApp, ...prev]);
    setShowJoinModal(false);
    setFormName('');
    speakUstadh(`تم إرسال طلب انضمام الأستاذ ${formName} بنجاح إلى الإدارة.`);
    showToast(`استاد ${formName} (${formCountry}) کی تدریس کی درخواست ایڈمن پینل کو بھیج دی گئی ہے! 📝`);
  };

  const handleStudentApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newApp = {
      id: 'p_' + Date.now(),
      name: formName,
      country: formCountry || 'پاکستان 🇵🇰',
      level: formLevel || 'قاعدة نورانية',
      time: nowTime
    };

    setPendingStudents(prev => [newApp, ...prev]);
    setShowJoinModal(false);
    setFormName('');
    speakUstadh(`تم إرسال طلب الطالب ${formName} بنجاح.`);
    showToast(`طالب علم ${formName} کی کلاس میں انضمام کی درخواست بھیج دی گئی ہے! 📝`);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-3 sm:p-6 lg:p-8 font-urdu selection:bg-rose-600 selection:text-white" dir="rtl">
      
      {/* Hidden Audio Element for Real Recitation */}
      <audio
        ref={quranAudioRef}
        onEnded={() => {
          if (selectedProjectorSurah && currentAyahIndex < selectedProjectorSurah.verses.length - 1) {
            playAyahRecitation(currentAyahIndex + 1, selectedProjectorSurah);
          } else {
            setIsPlayingRecitation(false);
          }
        }}
      />

      {/* Global Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 border-2 border-emerald-400 text-emerald-100 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-black flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP HEADER & LIVE NETWORK BAR */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-zinc-900/90 border border-rose-900/50 p-4 sm:p-6 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden">
          
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <span>➜</span>
              <span>واپسی ({t.backHome})</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-black tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  عالمی اساتذہ اور طلباء کا لائیو ایکٹیو نیٹ ورک 🟢
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                آن لائن لائیو قرآن کلاس اور میٹنگ روم
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5">
                <p className="text-xs text-rose-300 font-bold">
                  موجودہ میزبان استاد: <strong className="text-white">{selectedMudarris.name}</strong> • 👥 <span className="text-emerald-400 font-black">{liveTalbaCount}+ طلباء متصل ہیں</span>
                </p>

                {currentUser ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-700 text-purple-200 text-xs font-black">
                    <UserCheck className="w-4 h-4 text-purple-400" />
                    <span>آپ بطور: <strong className="text-amber-300">{currentUser.name}</strong> ({currentUser.role === 'ustadh' ? '👨‍🏫 استاد' : '🎒 طالب علم'})</span>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="mr-1 text-[10px] text-purple-300 underline hover:text-white"
                    >
                      تبدیل کریں
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5 border border-emerald-400/30"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-200" />
                    <span>کلاس میں شامل ہوں (استاد یا طالب علم 🚀)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 w-full lg:w-auto justify-start lg:justify-end">
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'classroom'
                  ? 'bg-gradient-to-r from-[#C2185B] to-rose-700 text-white shadow-lg scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>لائیو کلاس روم</span>
            </button>

            <button
              onClick={() => setActiveTab('mudarris-list')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'mudarris-list'
                  ? 'bg-gradient-to-r from-[#C2185B] to-rose-700 text-white shadow-lg scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>اساتذہ ڈائریکٹری ({mudarrisList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('blackboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'blackboard'
                  ? 'bg-gradient-to-r from-[#C2185B] to-rose-700 text-white shadow-lg scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>بلیک بورڈ / تختی</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-r from-[#C2185B] to-rose-700 text-white shadow-lg scale-105'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>طلباء حاضری ({attendanceList.length})</span>
            </button>

            <button
              onClick={() => setShowOwnerApprovalModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md relative"
            >
              <span>👑 ایڈمن پینل و درخواستیں</span>
              {(pendingTeachers.length + pendingStudents.length) > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-600 text-[10px] text-white font-black animate-bounce shadow-md">
                  {pendingTeachers.length + pendingStudents.length}
                </span>
              )}
            </button>

            <button
              onClick={simulateIncomingUstadhRequest}
              className="px-3.5 py-2 rounded-xl bg-purple-800/90 hover:bg-purple-700 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md border border-purple-400/30"
              title="نئی استاد تدریس کی درخواست کا لائیو ٹیسٹ کریں"
            >
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>🔔 لائیو درخواست ٹیسٹ</span>
            </button>

            <button
              onClick={() => setShowParentGuideModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              <span>گائیڈ</span>
            </button>
          </div>
        </div>

        {/* LIVE INCOMING TEACHER REQUEST NOTIFICATION BANNER */}
        {pendingTeachers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-950 via-zinc-900 to-rose-950 border-2 border-amber-500/90 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 text-3xl animate-bounce shrink-0 mt-1">
                👨‍🏫
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black animate-pulse shadow-md">
                    سامنے سے استاد کی تدریس کی درخواست (Incoming Darkhast) 🔔
                  </span>
                  <span className="text-xs text-amber-300 font-bold font-mono">
                    درخواست کا وقت: {pendingTeachers[0].time}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-white flex flex-wrap items-center gap-2">
                  <span>👤 نام: <strong className="text-amber-300">{pendingTeachers[0].name}</strong></span>
                  <span className="px-2 py-0.5 rounded-lg bg-amber-950 border border-amber-800 text-amber-200 text-xs font-bold">
                    📍 مقام: {pendingTeachers[0].country}
                  </span>
                </h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300 font-medium pt-0.5">
                  <p>🎓 <strong className="text-emerald-300">سند / مضمون:</strong> {pendingTeachers[0].title}</p>
                  {pendingTeachers[0].contact && (
                    <p>📱 <strong className="text-sky-300">رابطہ:</strong> {pendingTeachers[0].contact}</p>
                  )}
                </div>

                {pendingTeachers[0].experience && (
                  <p className="text-xs text-zinc-400 font-medium italic line-clamp-1">
                    📝 <strong className="text-pink-300">تجربہ و تعارف:</strong> {pendingTeachers[0].experience}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-end lg:self-center shrink-0">
              <button
                onClick={() => setSelectedTeacherDetail(pendingTeachers[0])}
                className="px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1 transition-all hover:scale-105 border border-purple-400/30"
              >
                <span>👁️ پروفائل دیکھئے (Details)</span>
              </button>

              <button
                onClick={() => approveTeacher(pendingTeachers[0].id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5 transition-all hover:scale-105 border border-emerald-400/40"
              >
                <span>منظور کریں 🟢 (Approve)</span>
              </button>

              <button
                onClick={() => rejectTeacher(pendingTeachers[0].id)}
                className="px-3 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-black cursor-pointer border border-rose-800"
              >
                <span>رد کریں 🔴</span>
              </button>

              <button
                onClick={() => setShowOwnerApprovalModal(true)}
                className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black cursor-pointer shadow-md"
              >
                <span>تمام ({pendingTeachers.length}) 👑</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 1: LIVE CLASSROOM WITH SELECTED MUDARRIS */}
        {activeTab === 'classroom' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left/Center Main Interactive Screen Area */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Screen Mode Switcher & Quality Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl shadow-lg gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <span className="text-xs font-black text-zinc-400 whitespace-nowrap">کلاس موڈ:</span>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => setScreenMode('duo')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        screenMode === 'duo'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg ring-2 ring-emerald-400/40'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-300" />
                      <span>آمنے سامنے ویڈیو (1-on-1 Duo)</span>
                    </button>

                    <button
                      onClick={() => setScreenMode('speaker')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        screenMode === 'speaker'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>استاد فوکس (Speaker)</span>
                    </button>

                    <button
                      onClick={() => setScreenMode('mushaf')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        screenMode === 'mushaf'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>مصحف پروجیکٹر (Mus'haf)</span>
                    </button>

                    <button
                      onClick={() => setScreenMode('gallery')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        screenMode === 'gallery'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>طلباء مانیٹر ({meetingStudents.length})</span>
                    </button>
                  </div>
                </div>

                {/* HD Quality & Tool Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {/* Video Quality Switcher */}
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
                    {(['1080p', '720p', 'saver'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setVideoQuality(q);
                          showToast(`ویڈیو ریزولوشن تبدیل: ${q === '1080p' ? '1080p Full HD' : q === '720p' ? '720p HD' : 'ڈیٹا سیور'}`);
                        }}
                        className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                          videoQuality === q 
                            ? 'bg-emerald-600 text-white' 
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {q === '1080p' ? '1080p' : q === '720p' ? '720p' : 'Lite'}
                      </button>
                    ))}
                  </div>

                  {/* Flip Camera */}
                  <button
                    onClick={() => {
                      setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
                      showToast('کیمرا رخ تبدیل کر دیا گیا (Front/Back) 🔄');
                    }}
                    title="کیمرا تبدیل کریں (Front / Back)"
                    className="p-1.5 rounded-xl bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 cursor-pointer text-xs"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>

                  {/* Screen Share */}
                  <button
                    onClick={toggleScreenSharing}
                    title="اسکرین شیئرنگ"
                    className={`p-1.5 rounded-xl border cursor-pointer text-xs transition-all ${
                      isScreenSharing 
                        ? 'bg-teal-600 text-white border-teal-400 animate-pulse' 
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {isScreenSharing ? <ScreenShareOff className="w-4 h-4" /> : <ScreenShare className="w-4 h-4" />}
                  </button>

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="flex items-center gap-1.5 bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-1 rounded-full text-xs font-mono font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>REC {formatRecordingTime(recordingSeconds)}</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isRecording) {
                        setIsRecording(false);
                        showToast(`لائیو لیکچر ریکارڈنگ محفوظ! وقت: ${formatRecordingTime(recordingSeconds)} 📼`);
                      } else {
                        setIsRecording(true);
                        showToast('لائیو قرآن کلاس کی ریکارڈنگ شروع ہو گئی ہے 🔴');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isRecording 
                        ? 'bg-rose-600 text-white border-rose-400' 
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    <Disc className="w-4 h-4" />
                    <span>{isRecording ? 'روکیں' : 'ریکارڈ'}</span>
                  </button>
                </div>
              </div>

              {/* MAIN DISPLAY SCREEN BASED ON MODE */}
              <div className="relative rounded-3xl bg-zinc-950 border-2 border-zinc-800 overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-4 sm:p-5">
                
                {/* Floating Emoji Reaction Particles Layer */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                  <AnimatePresence>
                    {reactions.map(p => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 1, y: 300, scale: 0.8 }}
                        animate={{ opacity: 0, y: -100, scale: 1.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2.2, ease: "easeOut" }}
                        style={{ left: `${p.x}%` }}
                        className="absolute text-4xl"
                      >
                        {p.emoji}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Ustadh Live Tajweed Toast Overlay Banner */}
                <AnimatePresence>
                  {tajweedFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.9 }}
                      className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-zinc-950 px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-amber-200 flex items-center gap-3 backdrop-blur-md"
                    >
                      <span className="text-2xl">{tajweedFeedback.icon}</span>
                      <div className="text-right font-sans">
                        <p className="text-sm font-black text-zinc-950 leading-tight">{tajweedFeedback.text}</p>
                        <p className="text-[11px] font-bold text-zinc-800">{tajweedFeedback.subtext}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* SCREEN MODE 0: FACE-TO-FACE (DUO 1-ON-1 VIDEO FEED) */}
                {screenMode === 'duo' && (
                  <div className="flex flex-col h-full justify-between space-y-4 z-10">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-500/30">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black text-emerald-300">
                          1-on-1 آمنے سامنے لائیو کلاس (Face-to-Face Duo View)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-xl border border-zinc-800">
                          {videoQuality === '1080p' ? '1080p Full HD' : videoQuality === '720p' ? '720p HD' : 'Data Saver'}
                        </span>

                        <button
                          onClick={toggleQuranRecitation}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-1.5 border ${
                            isPlayingRecitation 
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-300 animate-pulse' 
                              : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
                          }`}
                        >
                          {isPlayingRecitation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlayingRecitation ? 'تلاوت جاری...' : 'تلاوت سنیں'}</span>
                        </button>
                      </div>
                    </div>

                    {/* DUAL SPLIT SCREEN: LEFT TEACHER, RIGHT STUDENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
                      
                      {/* 1. USTADH / TEACHER VIDEO BOX */}
                      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-emerald-500/40 p-4 flex flex-col items-center justify-between min-h-[260px] shadow-xl overflow-hidden group">
                        
                        {/* Background Glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Badge */}
                        <div className="w-full flex items-center justify-between">
                          <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5">
                            <Crown className="w-3 h-3 text-amber-400" />
                            <span>استاد محترم (Teacher)</span>
                          </div>

                          {/* Voice Wave Visualizer */}
                          <div className="flex items-center gap-0.5 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                            {[40, 70, 90, 60, 100, 50].map((h, i) => (
                              <div
                                key={i}
                                className="w-1 bg-emerald-400 rounded-full transition-all duration-150"
                                style={{
                                  height: `${isPlayingRecitation ? Math.max(6, (ustadhDecibels * h) / 100) : 4}px`
                                }}
                              />
                            ))}
                            <Volume2 className="w-3 h-3 text-emerald-400 ml-1" />
                          </div>
                        </div>

                        {/* Center Teacher Avatar & Live Indicator */}
                        <div className="text-center my-3 space-y-2">
                          <div className="relative inline-block">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-1 shadow-[0_0_30px_rgba(16,185,129,0.35)] flex items-center justify-center animate-pulse">
                              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                                <span className="text-4xl sm:text-5xl">{selectedMudarris.avatar}</span>
                              </div>
                            </div>
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-md animate-ping" />
                            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-md" />
                          </div>

                          <div>
                            <h4 className="text-base sm:text-lg font-black text-white">{selectedMudarris.name}</h4>
                            <p className="text-[11px] text-emerald-300 font-bold">{selectedMudarris.title} • {selectedMudarris.country}</p>
                          </div>
                        </div>

                        {/* Teacher Status Footer */}
                        <div className="w-full bg-black/50 border border-white/5 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            لائیو سیشن فعال ہے
                          </span>
                          <button
                            onClick={() => speakUstadh(`أهلاً بك يا بني، استمع لتلاوة القرآن الكريم بخشوع وتدبر.`)}
                            className="text-[10px] text-amber-300 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 px-2 py-0.5 rounded-md cursor-pointer font-bold transition-all"
                          >
                            نصیحت سنیں 🔊
                          </button>
                        </div>
                      </div>

                      {/* 2. TALIB-E-ILM / STUDENT (USER) WEBCAM VIDEO BOX */}
                      <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-teal-500/40 p-4 flex flex-col items-center justify-between min-h-[260px] shadow-xl overflow-hidden">
                        
                        {/* Background Glow */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Badge */}
                        <div className="w-full flex items-center justify-between z-10">
                          <div className="bg-teal-950/90 text-teal-300 border border-teal-700/60 px-2.5 py-1 rounded-xl text-[10px] font-extrabold flex items-center gap-1.5">
                            <User className="w-3 h-3 text-teal-300" />
                            <span>طالب علم / آپ (Student Video)</span>
                          </div>

                          {/* Student Mic Decibel Bar */}
                          <div className="flex items-center gap-0.5 bg-black/60 px-2 py-1 rounded-lg border border-white/10">
                            {[30, 60, 90, 50, 80].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-150 ${isMicOn ? 'bg-teal-400' : 'bg-zinc-600'}`}
                                style={{
                                  height: `${isMicOn ? Math.max(4, (micDecibels * h) / 100) : 4}px`
                                }}
                              />
                            ))}
                            {isMicOn ? <Mic className="w-3 h-3 text-teal-400 ml-1" /> : <MicOff className="w-3 h-3 text-rose-400 ml-1" />}
                          </div>
                        </div>

                        {/* Center Student Video Feed / Avatar */}
                        <div className="w-full my-2 flex flex-col items-center justify-center">
                          {isCamOn && !camError ? (
                            <div className="relative w-full aspect-video max-w-[280px] rounded-2xl overflow-hidden border-2 border-teal-500/60 shadow-lg bg-black">
                              <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                              />
                              <div className="absolute bottom-1 right-1 bg-black/70 px-2 py-0.5 rounded-lg text-[9px] font-mono text-teal-300 border border-teal-500/30">
                                لائیو فیڈ 🟢
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 py-2">
                              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 p-1 flex items-center justify-center shadow-lg border-2 border-teal-400/50">
                                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                                  <span className="text-3xl sm:text-4xl">👨‍🎓</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-white">
                                  {currentUser ? currentUser.name : 'طالب علم (آپ)'}
                                </h4>
                                <p className="text-[10px] text-teal-300/80 font-bold">
                                  {currentUser?.country || 'پاکستان 🇵🇰'} • {currentUser?.level || 'قاعدة نورانية'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Student Video Controls Footer */}
                        <div className="w-full bg-black/50 border border-white/5 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[10px] z-10">
                          <button
                            onClick={() => {
                              const newCam = !isCamOn;
                              setIsCamOn(newCam);
                              showToast(newCam ? 'کیمرا آن کر دیا گیا 📹' : 'کیمرا بند کر دیا گیا 📷');
                            }}
                            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all ${
                              isCamOn ? 'bg-teal-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            <Camera className="w-3 h-3" />
                            <span>{isCamOn ? 'کیمرا فعال' : 'کیمرا کھولیں'}</span>
                          </button>

                          <button
                            onClick={() => setIsMirrored(prev => !prev)}
                            className="text-zinc-400 hover:text-white px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                            title="شیشہ اثر (Mirror)"
                          >
                            <span>{isMirrored ? 'شیشہ آن' : 'شیشہ آف'}</span>
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* LIVE USTADH TAJWEED CORRECTION QUICK BAR */}
                    <div className="bg-zinc-900/90 border border-emerald-700/40 p-3 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          استاد کی لائیو تجوید تصحیح اور داد بار (Live Ustadh Tajweed Feedback):
                        </span>
                        <span className="text-[10px] text-zinc-400">کلک کرنے پر استاد صوتی رہنمائی فرمائیں گے</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => sendTajweedFeedback('ماشاء اللہ ممتاز! قراءت بالکل درست ہے 🌟', 'قواعدِ تجوید کی شاندار پابندی', '🌟', 'ما شاء الله تبارك الله، قراءة ممتازة وأحكام متقنة')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/80 hover:bg-emerald-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>🌟 ماشاء اللہ ممتاز</span>
                        </button>

                        <button
                          onClick={() => sendTajweedFeedback('مخرج درست کریں: حلق سے ادا کریں 👄', 'ع، ح کا مخرج وسط الحلق ہے', '👄', 'انتبه للمخرج يا بني، أخرج الحرف من وسط الحلق')}
                          className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-700/80 hover:bg-amber-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>👄 مخرج درست کریں</span>
                        </button>

                        <button
                          onClick={() => sendTajweedFeedback('مدّ کی مقدار: 4 سے 5 حرکات کھینچیں 📏', 'مد متصل / منفصل کو پورا کریں', '📏', 'مد الصوت بمقدار أربع أو خمس حركات')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-700/80 hover:bg-cyan-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>📏 مدّ 4 حرکات کھینچیں</span>
                        </button>

                        <button
                          onClick={() => sendTajweedFeedback('غنّہ ظاہر کریں: 2 حرکات کی آواز 🔔', 'نون و میم مشدد پر غنہ لازم ہے', '🔔', 'أظهر الغنة في النون والميم بمقدار حركتين')}
                          className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-300 border border-purple-700/80 hover:bg-purple-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>🔔 غنّہ کی مقدار بڑھائیں</span>
                        </button>

                        <button
                          onClick={() => sendTajweedFeedback('قلقلہ ظاہر کریں: قطب جد 💥', 'حرف ساکن پر جنبش دیں', '💥', 'بيّن القلقلة في حروف قطب جد عند السكون')}
                          className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-700/80 hover:bg-rose-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>💥 قلقلہ ظاہر کریں</span>
                        </button>

                        <button
                          onClick={() => sendTajweedFeedback('آیت دوبارہ دہرائیں 🔄', 'آہستہ اور ٹھہر ٹھہر کر پڑھیں', '🔄', 'أعد قراءة الآية مرة أخرى بالترتيل والتمهل')}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>🔄 دوبارہ پڑھیں</span>
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* SCREEN MODE 1: SPEAKER (USTADH LIVE VIDEO FEED) */}
                {screenMode === 'speaker' && (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Top Status inside Video */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-xs font-black text-white">
                          LIVE CLASSROOM • {selectedMudarris.name} ({selectedMudarris.country})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleQuranRecitation}
                          className={`px-3.5 py-2 rounded-2xl text-xs font-black shadow-lg transition-all cursor-pointer flex items-center gap-2 border ${
                            isPlayingRecitation 
                              ? 'bg-emerald-500 text-zinc-950 border-emerald-300 animate-pulse' 
                              : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400'
                          }`}
                        >
                          {isPlayingRecitation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isPlayingRecitation ? 'تلاوت جاری ہے...' : 'استاد کی تلاوت سنیں 🎧'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Center Feed: Real Webcam Video if Cam is ON else Ustadh Interactive Avatar */}
                    <div className="text-center my-auto py-6 z-10">
                      {isCamOn && !camError ? (
                        <div className="relative w-full max-w-md mx-auto aspect-video rounded-3xl overflow-hidden border-4 border-emerald-500/50 shadow-2xl bg-black">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded-xl text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
                            آپ کا لائیو کیمرا فیڈ 🟢
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-1.5 shadow-[0_0_40px_rgba(244,63,94,0.3)] border-4 border-rose-500/40 flex items-center justify-center animate-pulse">
                            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
                              <span className="text-5xl">{selectedMudarris.avatar}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-black text-white">{selectedMudarris.name}</h3>
                            <p className="text-xs text-rose-300 font-bold mt-1">{selectedMudarris.title}</p>
                          </div>
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-black shadow-md">
                            <Users className="w-4 h-4" />
                            <span>{liveTalbaCount} طلباء لائیو کلاس روم میں حاضر ہیں</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Recitation Subtitle Overlay */}
                    {isPlayingRecitation && selectedProjectorSurah.verses[currentAyahIndex] && (
                      <div className="bg-emerald-950/90 border-2 border-emerald-400 p-4 rounded-2xl text-center space-y-1 shadow-2xl backdrop-blur-md z-10 animate-fade-in">
                        <div className="flex items-center justify-center gap-2 text-xs font-black text-amber-400">
                          <span>{selectedProjectorSurah.name}</span>
                          <span>•</span>
                          <span>آیت {currentAyahIndex + 1} / {selectedProjectorSurah.verses.length}</span>
                        </div>
                        <p className="text-lg sm:text-2xl font-bold font-arabic text-amber-300">
                          {selectedProjectorSurah.verses[currentAyahIndex].arabic}
                        </p>
                        <p className="text-xs sm:text-sm text-emerald-200 font-bold">
                          {selectedProjectorSurah.verses[currentAyahIndex].urdu}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* SCREEN MODE 2: MUSHAF & TAJWEED PROJECTOR WITH FLOATING DUO PIP */}
                {screenMode === 'mushaf' && (
                  <div className="space-y-4 text-center z-10 my-auto w-full max-w-4xl mx-auto relative">
                    
                    {/* Floating Picture-in-Picture (PIP) Duo Video Widget */}
                    <div className="hidden sm:flex absolute -top-2 left-2 z-30 bg-zinc-950/95 border-2 border-emerald-500/60 rounded-2xl p-2 shadow-2xl backdrop-blur-md items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-400 flex items-center justify-center text-sm">
                          {selectedMudarris.avatar}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-white">{selectedMudarris.name.slice(0, 15)}...</p>
                          <p className="text-[8px] text-emerald-400">استاد لائیو 🟢</p>
                        </div>
                      </div>

                      <div className="w-px h-6 bg-zinc-800" />

                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-teal-900 border border-teal-400 flex items-center justify-center text-sm">
                          👨‍🎓
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-white">طالب علم</p>
                          <p className="text-[8px] text-teal-400">{isCamOn ? 'کیمرا آن' : 'حاضر'}</p>
                        </div>
                      </div>
                    </div>

                    {/* SURAH SELECTION & SEARCH BAR */}
                    <div className="bg-emerald-950/80 border border-emerald-800/80 p-4 rounded-3xl space-y-3 backdrop-blur-md text-right">
                      
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-emerald-800/60">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-amber-400" />
                          <h3 className="text-sm sm:text-base font-black text-emerald-300">
                            مصحف پروجیکٹر - پاره نمبر 30 (عمّ) + سورۃ الفاتحہ
                          </h3>
                        </div>

                        {/* Dropdown Select for All 38 Surahs */}
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedProjectorSurah.number}
                            onChange={(e) => {
                              const sNum = parseInt(e.target.value, 10);
                              const found = PARA_30_SURAHS.find(s => s.number === sNum);
                              if (found) handleSelectProjectorSurah(found);
                            }}
                            className="bg-zinc-900 border-2 border-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            {PARA_30_SURAHS.map((surah) => (
                              <option key={surah.number} value={surah.number}>
                                {surah.number}. {surah.name} ({surah.englishName}) - {surah.totalAyahs} آیات
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* QUICK FILTER PILLS FOR POPULAR SURAHS */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-emerald-700">
                        <span className="text-[11px] font-bold text-emerald-400 whitespace-nowrap pl-1">مقبول سورتیں:</span>
                        {[
                          { num: 1, label: 'الفاتحة' },
                          { num: 78, label: 'النبأ (عمّ)' },
                          { num: 79, label: 'النازعات' },
                          { num: 80, label: 'عبس' },
                          { num: 81, label: 'التكوير' },
                          { num: 85, label: 'البروج' },
                          { num: 87, label: 'الأعلى' },
                          { num: 89, label: 'الفجر' },
                          { num: 93, label: 'الضحى' },
                          { num: 94, label: 'الشرح' },
                          { num: 97, label: 'القدر' },
                          { num: 99, label: 'الزلزلة' },
                          { num: 108, label: 'الکوثر' },
                          { num: 109, label: 'الكافرون' },
                          { num: 112, label: 'الإخلاص' },
                          { num: 113, label: 'الفلق' },
                          { num: 114, label: 'الناس' }
                        ].map((item) => {
                          const isSelected = selectedProjectorSurah.number === item.num;
                          return (
                            <button
                              key={item.num}
                              onClick={() => {
                                const target = PARA_30_SURAHS.find(s => s.number === item.num);
                                if (target) handleSelectProjectorSurah(target);
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                                isSelected
                                  ? 'bg-amber-500 text-zinc-950 border-amber-300 font-extrabold shadow-md'
                                  : 'bg-zinc-900/90 text-emerald-200 border-emerald-800/80 hover:bg-emerald-900/50'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* ACTIVE SURAH HEADER CARD & CONTROLS */}
                      <div className="bg-emerald-900/40 border border-emerald-700/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
                        <div>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-arabic">
                              {selectedProjectorSurah.name}
                            </h2>
                            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-md font-bold">
                              {selectedProjectorSurah.type}
                            </span>
                            <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-md font-mono">
                              پارہ 30 (عمّ)
                            </span>
                          </div>
                          <p className="text-xs text-emerald-200/80 font-bold mt-0.5">
                            {selectedProjectorSurah.urduName} • کل آیات: {selectedProjectorSurah.totalAyahs}
                          </p>
                        </div>

                        {/* PLAYBACK CONTROL BUTTONS */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (currentAyahIndex > 0) {
                                playAyahRecitation(currentAyahIndex - 1);
                              }
                            }}
                            disabled={currentAyahIndex === 0}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold disabled:opacity-40 hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            ◄ پچھلی آیت
                          </button>

                          <button
                            onClick={toggleQuranRecitation}
                            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg ${
                              isPlayingRecitation
                                ? 'bg-amber-500 text-zinc-950 animate-pulse'
                                : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {isPlayingRecitation ? <Pause className="w-4 h-4 fill-zinc-950" /> : <Play className="w-4 h-4 fill-white" />}
                            <span>{isPlayingRecitation ? 'روکیں (Pause)' : 'سورۃ سنیں (Play)'}</span>
                          </button>

                          <button
                            onClick={() => {
                              if (currentAyahIndex < selectedProjectorSurah.verses.length - 1) {
                                playAyahRecitation(currentAyahIndex + 1);
                              }
                            }}
                            disabled={currentAyahIndex >= selectedProjectorSurah.verses.length - 1}
                            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs font-bold disabled:opacity-40 hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            اگلی آیت ►
                          </button>
                        </div>
                      </div>

                      {/* BISMILLAH BANNER */}
                      {selectedProjectorSurah.hasBismillah && (
                        <div className="bg-emerald-950/90 border border-emerald-700/80 py-3 px-4 rounded-2xl text-center text-amber-300 font-arabic text-xl sm:text-2xl font-bold shadow-inner">
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </div>
                      )}

                      {/* VERSES LIST */}
                      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-emerald-700 pt-1">
                        {selectedProjectorSurah.verses.map((verse, idx) => {
                          const isActive = currentAyahIndex === idx && isPlayingRecitation;
                          return (
                            <div
                              key={verse.number}
                              onClick={() => playAyahRecitation(idx)}
                              className={`p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border text-right space-y-1.5 ${
                                isActive
                                  ? 'bg-emerald-900/60 border-amber-400 shadow-xl scale-[1.01] ring-2 ring-amber-400/30'
                                  : 'bg-zinc-900/80 border-zinc-800 hover:border-emerald-600 hover:bg-zinc-900'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center font-mono ${
                                    isActive ? 'bg-amber-400 text-zinc-950 font-black' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  }`}>
                                    {verse.number}
                                  </span>
                                  {isActive && (
                                    <span className="flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                      <Volume2 className="w-3 h-3 text-amber-400" />
                                      صوتی تلاوت جاری...
                                    </span>
                                  )}
                                </div>

                                <p className={`text-lg sm:text-2xl font-bold font-arabic leading-relaxed ${
                                  isActive ? 'text-amber-300' : 'text-white'
                                }`}>
                                  {verse.arabic}
                                </p>
                              </div>

                              <p className="text-xs sm:text-sm text-emerald-300/80 pr-9 font-sans">
                                {verse.urdu}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>
                )}

                {/* SCREEN MODE 3: GALLERY MEETING GRID */}
                {screenMode === 'gallery' && (
                  <div className="space-y-4 z-10">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                      <h4 className="text-xs font-black text-purple-300">متصل طلباء کا میٹنگ روم (Interactive Video Grid)</h4>
                      <span className="text-xs text-zinc-400">کل متصل: {meetingStudents.length}</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {meetingStudents.map((s) => (
                        <div
                          key={s.id}
                          className={`p-4 rounded-2xl bg-zinc-900 border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center space-y-2 ${
                            s.isSpeaking ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-zinc-800'
                          }`}
                        >
                          <div className="text-3xl bg-zinc-950 p-2.5 rounded-2xl border border-zinc-800">
                            {s.avatar}
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-black text-white">{s.name}</p>
                            <p className="text-[10px] text-zinc-400">{s.country}</p>
                          </div>

                          {s.handRaised && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-zinc-950 p-1 rounded-lg text-xs font-black animate-bounce shadow-md">
                              ✋ ہاتھ اٹھایا
                            </div>
                          )}

                          {s.isSpeaking && (
                            <div className="absolute bottom-2 left-2 bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded-md text-[9px] font-extrabold flex items-center gap-1">
                              <Mic className="w-3 h-3" /> پڑھ رہا ہے
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BOTTOM CONTROLS & ACTION BAR INSIDE CLASSROOM SCREEN */}
                <div className="flex flex-wrap items-center justify-between bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 gap-3 z-10">
                  
                  {/* Mic & Camera buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newMic = !isMicOn;
                        setIsMicOn(newMic);
                        showToast(newMic ? 'مائیک آن کر دیا گیا 🎙️' : 'مائیک بند کر دیا گیا 🔇');
                      }}
                      className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isMicOn ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      <span>{isMicOn ? 'مائیک آن' : 'مائیک بند'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const newCam = !isCamOn;
                        setIsCamOn(newCam);
                        showToast(newCam ? 'کیمرا فیڈ آن کر دی گئی 📹' : 'کیمرا آف کر دیا گیا 📷');
                      }}
                      className={`px-3.5 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCamOn ? 'bg-emerald-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {isCamOn ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                      <span>{isCamOn ? 'کیمرا آن' : 'کیمرا بند'}</span>
                    </button>
                  </div>

                  {/* Raise Hand & Reactions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const nextState = !isHandRaised;
                        setIsHandRaised(nextState);
                        speakUstadh(nextState ? 'تم رفع اليد للاستئذان في القراءة!' : 'تم إنزال اليد');
                        showToast(nextState ? 'استاد سے تلاوت کی اجازت کے لیے ہاتھ اٹھایا گیا ✋' : 'ہاتھ نیچے کر لیا گیا');
                      }}
                      className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        isHandRaised ? 'bg-amber-500 text-zinc-950 shadow-lg scale-105' : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                      }`}
                    >
                      <Hand className="w-4 h-4" />
                      <span>{isHandRaised ? 'ہاتھ اٹھایا ہوا ہے' : 'ہاتھ اٹھائیں (Raise Hand)'}</span>
                    </button>

                    {/* Floating Reaction Buttons */}
                    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                      {['🤲', '❤️', '👏', '🌟', '🌸'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => triggerReaction(emoji)}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg text-sm cursor-pointer transition-transform active:scale-125"
                          title="ردعمل بھیجیں"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Quick Islamic Soundboard */}
              <div className="p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-400" />
                  <span>تلاوة وذكر (Interactive Islamic Soundboard)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => speakUstadh('سبحان الله وبحمده، سبحان الله العظيم!')}
                    className="p-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>✨ سبحان الله</span>
                  </button>

                  <button
                    onClick={() => speakUstadh('ماشاء الله تبارك الله!')}
                    className="p-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>⭐ ماشاء الله</span>
                  </button>

                  <button
                    onClick={() => speakUstadh('الحمد لله رب العالمين!')}
                    className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>🌿 الحمد لله</span>
                  </button>

                  <button
                    onClick={() => speakUstadh('بارك الله فيك، أحسنت ممتاز!')}
                    className="p-3 rounded-2xl bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-200 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <span>🏆 بارك الله فيك</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Live Chat with Unlimited Talba */}
            <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-5 flex flex-col h-[560px] shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-500" />
                  <h3 className="font-black text-white text-sm">لائیو چیت (Interactive Chat)</h3>
                </div>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800 font-black">
                  {liveTalbaCount} Online
                </span>
              </div>

              {/* Chat messages list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      msg.isUstadh
                        ? 'bg-gradient-to-r from-rose-950/80 to-purple-950/80 border border-rose-800/60 text-rose-100'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black">
                      <span className={msg.isUstadh ? 'text-rose-400' : 'text-emerald-400'}>{msg.sender}</span>
                      <span className="text-[10px] text-zinc-500">{msg.time}</span>
                    </div>
                    <p className="leading-relaxed font-bold">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="سؤال پوچھیں یا سلام بھیجیں..."
                  className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-bold"
                />
                <button
                  type="submit"
                  title="ارسال (Send)"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C2185B] to-rose-700 text-white font-black text-xs hover:opacity-90 cursor-pointer shadow-md flex items-center justify-center shrink-0 gap-1"
                >
                  <Send className="w-4 h-4 rtl:-scale-x-100" />
                  <span>ارسال</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 2: UNLIMITED MUDARRIS (TEACHERS) DIRECTORY */}
        {activeTab === 'mudarris-list' && (
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400" />
                  <span>شبكة المدرسين غير المحدودة (Unlimited Mudarris Directory)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  کوئی بھی نیا استاد (Mudarris) یا عالم دین اپنی لائیو کلاس شروع کر سکتا ہے اور طلباء شامل ہو سکتے ہیں۔
                </p>
              </div>

              <button
                onClick={() => { setJoinRoleTab('ustadh'); setShowJoinModal(true); }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#C2185B] to-rose-700 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer border border-rose-400/30"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ نیا مدرس شامل کریں / درخواست دیں 📝</span>
              </button>
            </div>

            {pendingTeachers.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600/70 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="font-black text-amber-200 text-sm">منتظر اساتذہ کی درخواستیں ({pendingTeachers.length})</h4>
                    <p className="text-xs text-amber-300/80">نئے اساتذہ / قاری صاحبان نے کلاس میں تدریس کی درخواست بھیجی ہے۔ منظوری کے لیے پینل میں دیکھیں۔</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOwnerApprovalModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black shrink-0 cursor-pointer shadow-md"
                >
                  درخواستیں ملاحظہ کریں 👑
                </button>
              </div>
            )}

            {/* Grid of Mudarris */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mudarrisList.map(m => (
                <div 
                  key={m.id}
                  className={`p-5 rounded-3xl border transition-all flex items-center justify-between gap-4 ${
                    selectedMudarris.id === m.id 
                      ? 'bg-rose-950/40 border-rose-500 shadow-xl' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-purple-900 flex items-center justify-center text-2xl shadow-md shrink-0">
                      {m.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-white text-base">{m.name}</h4>
                      <p className="text-xs text-rose-300 font-bold mt-0.5">{m.title}</p>
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-2 font-bold">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Users className="w-3.5 h-3.5" />
                          {m.studentsCount}+ طالب علم
                        </span>
                        <span className="bg-zinc-900 px-2 py-0.5 rounded-md text-zinc-300 border border-zinc-800">
                          {m.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMudarris(m);
                      setActiveTab('classroom');
                      speakUstadh(`تم اختيار ${m.name}. أهلاً بك في الحلقة.`);
                      showToast(`الشيخ ${m.name} کا لائیو کلاس روم منتخب کر لیا گیا! 🎥`);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                      selectedMudarris.id === m.id
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    {selectedMudarris.id === m.id ? 'الحلقة النشطة' : 'انضم للحلقة 🎥'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BLACKBOARD */}
        {activeTab === 'blackboard' && (
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-rose-400" />
                  <span>کلسیجیکل تختی اور بلیک بورڈ (Authentic Chalk Blackboard)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">اصلی تختی اور چاک کا انداز • {liveTalbaCount} طلباء لائیو دیکھ رہے ہیں</p>
              </div>

              {/* Board tools */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                  <button
                    onClick={() => { setBoardMode('free'); clearBlackboard(); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${boardMode === 'free' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
                  >
                    سادہ تختی
                  </button>
                  <button
                    onClick={() => { setBoardMode('qaida'); clearBlackboard(); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${boardMode === 'qaida' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
                  >
                    قاعدة نورانية
                  </button>
                  <button
                    onClick={() => { setBoardMode('tajweed'); clearBlackboard(); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${boardMode === 'tajweed' ? 'bg-emerald-600 text-white' : 'text-zinc-400'}`}
                  >
                    قلقلہ و تجوید
                  </button>
                </div>

                {/* Chalk Colors */}
                <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
                  {[
                    { name: 'سفید چاک', color: '#f3f4f6' },
                    { name: 'پیلا چاک', color: '#fde047' },
                    { name: 'گلابی', color: '#f43f5e' },
                    { name: 'نیلا', color: '#38bdf8' },
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => setBrushColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${brushColor === c.color ? 'scale-125 border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                  <button
                    onClick={() => setBrushColor('#111827')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer ${brushColor === '#111827' ? 'border border-rose-500' : ''}`}
                    title="Eraser (ڈسٹر)"
                  >
                    🧽 ڈسٹر
                  </button>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-400 font-bold">
                  <span>سائز:</span>
                  {[2, 4, 8].map(sz => (
                    <button
                      key={sz}
                      onClick={() => setBrushSize(sz)}
                      className={`px-2 py-1 rounded ${brushSize === sz ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}
                    >
                      {sz === 2 ? 'باریک' : sz === 4 ? 'درمیانہ' : 'موٹا'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={clearBlackboard}
                  className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>سب کچھ صاف کریں</span>
                </button>
              </div>
            </div>

            {/* Quick Stamping & Perfect Writing Bar */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-rose-400">✨ فوری خوبصورت تحریر:</span>
                {[
                  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                  'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                  'قُلْ هُوَ اللَّهُ أَحَدٌ',
                  'أَ بَ تَ ثَ',
                  'سبحان الله',
                  'ماشاء الله'
                ].map(word => (
                  <button
                    key={word}
                    onClick={() => stampTextToBoard(word)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-200 text-xs font-black cursor-pointer transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customStampText}
                  onChange={e => setCustomStampText(e.target.value)}
                  placeholder="کوئی بھی لفظ یہاں لکھ کر تختی پر لگائیں..."
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-bold"
                />
                <button
                  onClick={() => {
                    if (customStampText.trim()) {
                      stampTextToBoard(customStampText);
                      setCustomStampText('');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  ٹیکست چھاپیں ✍️
                </button>
              </div>
            </div>

            {/* Authentic Chalkboard Canvas Frame */}
            <div className="relative rounded-2xl overflow-hidden border-[10px] border-[#5c3a21] bg-[#111827] shadow-2xl flex justify-center p-2">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="cursor-crosshair touch-none w-full max-w-4xl rounded-xl shadow-inner"
              />
            </div>
            <p className="text-center text-xs text-zinc-400 font-bold">چاک سے تختی پر لکھیے • تمام طلباء کلاس روم میں حقیقی وقت میں ملاحظہ کر رہے ہیں ✍️</p>
          </div>
        )}

        {/* TAB 4: ACTIVE ATTENDANCE LEDGER */}
        {activeTab === 'attendance' && (
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 shadow-2xl space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-black text-white">طلباء کی حاضری کا مکمل رجسٹر (Live Attendance Ledger)</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  میزبان استاد: <span className="text-rose-300 font-black">{selectedMudarris.name}</span> • ڈیٹا مقامی اور کلاؤڈ ہوسٹنگ میں محفوظ ہو رہا ہے 🔒
                </p>
              </div>

              {/* Attendance Action Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={markSelfAttendance}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>اپنی حاضری درج کریں 🟢</span>
                </button>

                <button
                  onClick={() => setShowDirectAddStudentModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ نیا طالب علم شامل کریں</span>
                </button>

                <button
                  onClick={markAllPresent}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تمام کو حاضر کریں</span>
                </button>

                <button
                  onClick={downloadAttendanceReport}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-rose-300 font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>رپورٹ ڈاؤن لوڈ کریں (TXT) 📥</span>
                </button>
              </div>
            </div>

            {/* Attendance Summary Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
                <span className="text-xs text-zinc-400 font-bold">کل طلباء رجسٹرڈ</span>
                <p className="text-2xl font-black text-white">{attendanceList.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-1">
                <span className="text-xs text-emerald-300 font-bold">حاضر طلباء</span>
                <p className="text-2xl font-black text-emerald-400">
                  {attendanceList.filter(a => a.status.includes('Present') || a.status.includes('حاضر')).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-center space-y-1">
                <span className="text-xs text-rose-300 font-bold">غائب طلباء</span>
                <p className="text-2xl font-black text-rose-400">
                  {attendanceList.filter(a => a.status.includes('Absent') || a.status.includes('غائب')).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-center space-y-1">
                <span className="text-xs text-amber-300 font-bold">حاضری فیصد</span>
                <p className="text-2xl font-black text-amber-400">
                  {attendanceList.length > 0
                    ? Math.round((attendanceList.filter(a => a.status.includes('Present') || a.status.includes('حاضر')).length / attendanceList.length) * 100)
                    : 100}%
                </p>
              </div>
            </div>

            {/* Attendance List Table */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-inner">
              <div className="px-5 py-3.5 bg-zinc-900 border-b border-zinc-800 grid grid-cols-12 gap-2 text-xs font-black text-zinc-400">
                <span className="col-span-1 text-center">#</span>
                <span className="col-span-4">طالب علم / رکن کا نام</span>
                <span className="col-span-2 text-center">ملک</span>
                <span className="col-span-2 text-center">وقت</span>
                <span className="col-span-3 text-left">حاضری کی حیثیت</span>
              </div>

              <div className="divide-y divide-zinc-900">
                {attendanceList.map((item, idx) => (
                  <div key={item.id} className="px-5 py-3.5 grid grid-cols-12 gap-2 items-center text-xs font-bold hover:bg-zinc-900/50 transition-colors">
                    <span className="col-span-1 text-center font-mono text-zinc-500">{idx + 1}</span>
                    <span className="col-span-4 text-white flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${item.status.includes('Present') || item.status.includes('حاضر') ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {item.name}
                    </span>
                    <span className="col-span-2 text-center text-zinc-300">{item.country}</span>
                    <span className="col-span-2 text-center text-zinc-400 font-mono">{item.time}</span>
                    <div className="col-span-3 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleStudentStatus(item.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-black border cursor-pointer transition-all ${
                          item.status.includes('Present') || item.status.includes('حاضر')
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                            : item.status.includes('Late') || item.status.includes('تاخیر')
                            ? 'bg-amber-950 text-amber-300 border-amber-800 hover:bg-amber-900'
                            : 'bg-rose-950 text-rose-300 border-rose-800 hover:bg-rose-900'
                        }`}
                        title="حاضری کی حیثیت تبدیل کرنے کے لیے کلک کریں"
                      >
                        {item.status}
                      </button>

                      <button
                        onClick={() => deleteAttendanceRecord(item.id)}
                        className="p-1 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-zinc-800 cursor-pointer"
                        title="ریکارڈ حذف کریں"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* COMBINED JOIN CLASS / HOST ROOM MODAL */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-rose-400" />
                  <h3 className="font-black text-lg text-white">لائیو قرآن کلاس روم انضمام</h3>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Role Switcher */}
              <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setJoinRoleTab('student')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    joinRoleTab === 'student'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>بطور طالب علم (Student)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setJoinRoleTab('ustadh')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    joinRoleTab === 'ustadh'
                      ? 'bg-gradient-to-r from-[#C2185B] to-rose-700 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>بطور استاد (Ustadh / Host)</span>
                </button>
              </div>

              <form onSubmit={handleJoinFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    {joinRoleTab === 'ustadh' ? 'استاد / قاری صاحب کا نام' : 'طالب علم کا نام'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder={joinRoleTab === 'ustadh' ? 'مثال: الشيخ الأستاذ عبد الرحمن' : 'مثال: محمد زبیر'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">شہر یا ملک (Country / City)</label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={e => setFormCountry(e.target.value)}
                    placeholder="مثال: Pakistan 🇵🇰 / Saudi Arabia 🇸🇦"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                {joinRoleTab === 'ustadh' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">علمی مضمون / لقب (Specialty & Title)</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={e => setFormTitle(e.target.value)}
                        placeholder="مثال: خبير مخارج الحروف والقواعد النورانية"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">رابطہ / فون نمبر (Contact / WhatsApp)</label>
                      <input
                        type="text"
                        value={formContact}
                        onChange={e => setFormContact(e.target.value)}
                        placeholder="مثال: +92 300 1234567"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">مختصر تعارف و تجربہ (Bio & Experience)</label>
                      <textarea
                        rows={2}
                        value={formExperience}
                        onChange={e => setFormExperience(e.target.value)}
                        placeholder="مثال: 10 سالہ آن لائن تدریسی تجربہ، فاضل مدینہ منورہ و الازہر شریف"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 font-bold resize-none"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">تعلیمی درجہ (Course Level)</label>
                    <select
                      value={formLevel}
                      onChange={e => setFormLevel(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="قاعدة نورانية">قاعدة نورانية (Noorani Qaida)</option>
                      <option value="حفظ القرآن">حفظ القرآن (Quran Hifz)</option>
                      <option value="تجويد و مخارج">تجويد و مخارج (Tajweed & Makharij)</option>
                      <option value="ناظره قرآن">ناظره قرآن (Nazra Quran)</option>
                    </select>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-bold leading-relaxed flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>آپ کا نام، وقت اور ڈیٹا لوکل ہوسٹنگ میں محفوظ ہو کر لائیو رجسٹر میں درج ہوگا۔</span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                  >
                    منسوخ کریں
                  </button>

                  {joinRoleTab === 'ustadh' ? (
                    <>
                      <button
                        type="button"
                        onClick={handleTeacherApplicationSubmit}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>تدریس کی درخواست (Darkhast) بھیجیں 📝</span>
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C2185B] to-rose-700 text-white font-black text-xs shadow-lg hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>کلاس روم آن کریں 🎥</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleStudentApplicationSubmit}
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                      >
                        <span>داخلے کی درخواست (Darkhast) بھیجیں 📝</span>
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-lg hover:opacity-90 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>کلاس میں شامل ہوں 🎒</span>
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DIRECT ADD STUDENT MODAL BY USTADH */}
        {showDirectAddStudentModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="font-black text-base text-white">استاد بذریعہ رجسٹر: نیا طالب علم شامل کریں</h3>
                <button onClick={() => setShowDirectAddStudentModal(false)} className="text-zinc-400 hover:text-white font-bold">✕</button>
              </div>

              <form onSubmit={handleDirectAddStudent} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">طالب علم کا نام</label>
                  <input
                    type="text"
                    required
                    value={directStudentName}
                    onChange={e => setDirectStudentName(e.target.value)}
                    placeholder="مثال: عبد الرحمن فاروق"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">ملک یا شہر</label>
                  <input
                    type="text"
                    value={directStudentCountry}
                    onChange={e => setDirectStudentCountry(e.target.value)}
                    placeholder="مثال: Pakistan 🇵🇰"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">کورس کی سطح</label>
                  <select
                    value={directStudentLevel}
                    onChange={e => setDirectStudentLevel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="قاعدة نورانية">قاعدة نورانية (Noorani Qaida)</option>
                    <option value="حفظ القرآن">حفظ القرآن (Quran Hifz)</option>
                    <option value="تجويد و مخارج">تجويد و مخارج (Tajweed)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowDirectAddStudentModal(false)} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl">منسوخ</button>
                  <button type="submit" className="px-5 py-2 bg-purple-700 hover:bg-purple-600 text-white text-xs font-black rounded-xl shadow-lg">حاضری میں درج کریں 🟢</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* OWNER APPROVAL MODAL */}
        {showOwnerApprovalModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-amber-700/50 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="font-black text-lg text-white">ایڈمن اور منظوری کا پینل (Owner Approval Hub)</h3>
                    <p className="text-xs text-zinc-400">اساتذہ اور طلباء کی طرف سے موصول ہونے والی درخواستیں (Darkhast) منظور یا مسترد کریں</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOwnerApprovalModal(false)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-800 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Pending Teachers Section */}
              <div className="space-y-3 pb-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-400" />
                    <span>👨‍🏫 منتظر اساتذہ و قاری صاحبان کی درخواستیں ({pendingTeachers.length})</span>
                  </h4>
                  {pendingTeachers.length > 0 && (
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800 font-black">
                      Darkhast Received
                    </span>
                  )}
                </div>

                {pendingTeachers.length === 0 ? (
                  <p className="text-xs text-zinc-500 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center font-bold">
                    کوئی نئی استاد کی درخواست موجود نہیں۔
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingTeachers.map(t => (
                      <div key={t.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h5 className="font-black text-white text-sm flex items-center gap-2">
                            <span>{t.name}</span>
                            <span className="text-xs text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800">
                              📍 {t.country}
                            </span>
                          </h5>
                          <p className="text-xs text-rose-300 font-bold">🎓 سند و مضمون: {t.title}</p>
                          {t.contact && <p className="text-xs text-sky-300 font-medium">📱 رابطہ: {t.contact}</p>}
                          {t.experience && <p className="text-[11px] text-zinc-400 font-medium italic line-clamp-1">📝 تعارف: {t.experience}</p>}
                          <span className="text-[10px] text-zinc-500 font-mono">درخواست کا وقت: {t.time}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => setSelectedTeacherDetail(t)}
                            className="px-3 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-1 border border-purple-500/30"
                          >
                            👁️ تفصیلات
                          </button>
                          <button
                            onClick={() => approveTeacher(t.id)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-1"
                          >
                            منظور کریں 🟢
                          </button>
                          <button
                            onClick={() => rejectTeacher(t.id)}
                            className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-black cursor-pointer"
                          >
                            رد کریں 🔴
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Students Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-400" />
                  <span>🎒 منتظر طلباء کی درخواستیں ({pendingStudents.length})</span>
                </h4>
                {pendingStudents.length === 0 ? (
                  <p className="text-xs text-zinc-500 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center font-bold">کوئی نئی طالب علم کی درخواست موجود نہیں۔</p>
                ) : (
                  <div className="space-y-2">
                    {pendingStudents.map(s => (
                      <div key={s.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h5 className="font-black text-white text-sm flex items-center gap-2">
                            <span>{s.name}</span>
                            <span className="text-xs text-zinc-400">({s.country})</span>
                          </h5>
                          <p className="text-xs text-emerald-300 font-bold">مطلوبہ کورس: {s.level}</p>
                          <span className="text-[10px] text-zinc-500 font-mono">درخواست کا وقت: {s.time}</span>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => approveStudent(s.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black cursor-pointer shadow-md flex items-center gap-1"
                          >
                            منظور کریں 🟢
                          </button>
                          <button
                            onClick={() => rejectStudent(s.id)}
                            className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-black cursor-pointer"
                          >
                            رد کریں 🔴
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowOwnerApprovalModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-200 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                >
                  بند کریں
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PARENT & TEACHER EASY GUIDE MODAL */}
        {showParentGuideModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-teal-700/50 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-teal-400" />
                  <div>
                    <h3 className="font-black text-lg text-white">والدین اور اساتذہ کے لیے آسان لائیو گائیڈ</h3>
                    <p className="text-xs text-zinc-400">آن لائن میٹنگ اور قرآن کلاس جوائن کرنے کا نہایت آسان طریقہ</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowParentGuideModal(false)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-zinc-800 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 leading-relaxed font-bold">
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-black text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">1</span>
                    <span>والدین اور طلباء کے لیے کلاس میں شمولیت کا طریقہ:</span>
                  </h4>
                  <p className="text-zinc-400 pr-8">
                    اوپر دیے گئے بٹن <span className="text-emerald-400 font-bold">"کلاس میں شامل ہوں"</span> پر کلک کریں۔ اپنا نام، شہر یا ملک (مثلاً پاکستان، یو اے ای، یو کے) اور کورس منتخب کر کے داخل ہوں۔ آپ کا نام فوری لائیو حاضری اور کلاس روم میں درج ہو جائے گا۔
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-black text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
                    <span>اساتذہ (Ustadh) کے لیے کلاس کا انعقاد:</span>
                  </h4>
                  <p className="text-zinc-400 pr-8">
                    "کلاس میں شامل ہوں" پر کلک کر کے <span className="text-rose-400 font-bold">"بطور استاد"</span> کا انتخاب کریں۔ اپنا نام اور علمِ تجوید کی تفصیل درج کر کے روم آن کریں اور لائیو بلیک بورڈ، وائس فیڈ، تلاوت اور حاضری شیٹ کے ذریعے طلباء کو پڑھائیں۔
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-black text-white text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">3</span>
                    <span>حاضری اور ڈیٹا کی حفاظت:</span>
                  </h4>
                  <p className="text-zinc-400 pr-8">
                    ہر طالب علم کی حاضری، وقت اور ملک کی تفصیل محفوظ رہتی ہے۔ استاد ہر وقت حاضری رپورٹ کی TXT/CSV فائل ڈاؤن لوڈ کر سکتے ہیں۔
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowParentGuideModal(false)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black cursor-pointer shadow-lg"
                >
                  سمجھ آ گئی، شکریہ 🌟
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DETAILED TEACHER APPLICATION INSPECTION MODAL */}
        {selectedTeacherDetail && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border-2 border-purple-600/70 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-2xl bg-purple-950 text-purple-300 border border-purple-700 text-2xl">👨‍🏫</span>
                  <div>
                    <h3 className="font-black text-lg text-white">استاد کی تدریس کی کامل درخواست (Darkhast)</h3>
                    <p className="text-xs text-purple-300 font-bold">سامنے سے موصول شدہ کامل تعارف و پروفائل</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeacherDetail(null)}
                  className="text-zinc-400 hover:text-white p-1.5 rounded-xl bg-zinc-800 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400 font-bold">👤 استاد کا نام:</span>
                  <span className="text-base font-black text-amber-300">{selectedTeacherDetail.name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400 font-bold">📍 مقام (کہاں سے ہیں):</span>
                  <span className="text-sm font-black text-emerald-300">{selectedTeacherDetail.country}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400 font-bold">🎓 دینی سند / مضمون:</span>
                  <span className="text-xs font-black text-white text-right max-w-[250px]">{selectedTeacherDetail.title}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400 font-bold">📱 رابطہ / WhatsApp:</span>
                  <span className="text-xs font-mono font-black text-sky-300">{selectedTeacherDetail.contact || 'فراہم نہیں کیا گیا'}</span>
                </div>

                <div className="space-y-1 pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400 font-bold block">📝 تجربہ و مختصر تعارف:</span>
                  <p className="text-xs text-zinc-200 leading-relaxed font-bold bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                    {selectedTeacherDetail.experience || 'قرآن کریم اور علومِ اسلامیہ کا تدریسی تجربہ'}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-bold">🕒 درخواست موصول کا وقت:</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">{selectedTeacherDetail.time}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                <button
                  onClick={() => setSelectedTeacherDetail(null)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold hover:bg-zinc-700 cursor-pointer"
                >
                  بند کریں
                </button>

                <button
                  onClick={() => {
                    rejectTeacher(selectedTeacherDetail.id);
                    setSelectedTeacherDetail(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 text-rose-200 text-xs font-black cursor-pointer border border-rose-800"
                >
                  درخواست رد کریں 🔴
                </button>

                <button
                  onClick={() => {
                    approveTeacher(selectedTeacherDetail.id);
                    setSelectedTeacherDetail(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-xs shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                >
                  <span>منظور کریں اور نیٹ ورک میں شامل کریں 🟢</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};
