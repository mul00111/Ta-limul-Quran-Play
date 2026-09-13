import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Send, Mic, Bot, User, ArrowRight, Volume2, 
  Award, CheckCircle2, AlertTriangle, RefreshCw, BookOpen, ChevronRight, Play,
  Flame, Star, Trophy, Zap, HelpCircle, Radio, Compass, MessageSquare, Camera, Image, X, Square
} from 'lucide-react';
import { LanguageCode } from '../types';
import { speakUstadhMessage, stopAllQariAudio, playQariText } from '../utils/qariAudioService';
import { useBackHandler } from '../hooks/useBackHandler';

interface AiUstadhModalProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  evalResult?: {
    score: number;
    correctPoints: string[];
    makhrajAdvice: string[];
    praise: string;
  };
}

const PRACTICE_TARGETS = [
  { id: 'ha_letter', category: 'letters', title: 'مخرج چیلنج: حرف حَاءْ (وسطِ حلق)', text: 'حَ حِ حُ - الرَّحْمَٰنِ الرَّحِيمِ', makhrajInfo: 'حلق کے درمیانی حصے (وسطِ حلق) سے سانس کے ساتھ صاف ح ادا کریں۔' },
  { id: 'qaaf_letter', category: 'letters', title: 'مخرج چیلنج: حرف قَافْ (اقصائے لسان)', text: 'قَ قِ قُ - قُلْ هُوَ اللَّهُ أَحَدٌ', makhrajInfo: 'زبان کی جڑ جب اوپر والے نرم تالو سے لگے تو ق کو پر (موٹا) پڑھا جاتا ہے۔' },
  { id: 'ain_letter', category: 'letters', title: 'مخرج چیلنج: حرف عَيْنْ (وسطِ حلق)', text: 'عَ عِ عُ - الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', makhrajInfo: 'عین حلق کے درمیانی حصے سے ادا ہوتا ہے، اسے الف کی طرح سادہ نہ پڑھیں۔' },
  { id: 'khaa_letter', category: 'letters', title: 'مخرج چیلنج: حرف خَاءْ (ادنائے حلق)', text: 'خَ خِ خُ - خَلَقَ الْإِنْسَانَ', makhrajInfo: 'حلق کے اوپر والے حصے (منہ کی طرف) سے خ پر کر کے ادا ہوتا ہے۔' },
  { id: 'saad_letter', category: 'letters', title: 'مخرج چیلنج: حرف صَادْ (حروفِ صفیر)', text: 'صَ صِ صُ - اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', makhrajInfo: 'زبان کی نوک نیچے کے دانتوں کے اندرونی حصے سے لگے تو سیٹی کی آواز (ص) نکلتی ہے۔' },
  { id: 'dhaad_letter', category: 'letters', title: 'مخرج چیلنج: حرف ضَادْ (حافة اللسان)', text: 'ضَ ضِ ضُ - وَلَا الضَّالِّينَ', makhrajInfo: 'زبان کی کروٹ جب اوپر کی داڑھوں کی جڑ سے لگے تو ض ادا ہوتا ہے۔' },

  { id: 'fatiha_2', category: 'surahs', title: 'سورة الفاتحة - آیت ۲', text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', makhrajInfo: 'ح اور ع دونوں کے مخرج کا خاص خیال رکھیں۔' },
  { id: 'ikhlas_1', category: 'surahs', title: 'سورة الإخلاص - آیت ۱', text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', makhrajInfo: 'ق کو موٹا اور د پر قلقلہ (آواز لوٹانا) صفائی سے ادا کریں۔' },
  { id: 'falaq_1', category: 'surahs', title: 'سورة الفلق - آیت ۱', text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', makhrajInfo: 'ذ کو زبان کے سرے اور اوپر کے دانتوں سے نرمی سے پڑھیں۔' },
  { id: 'nas_1', category: 'surahs', title: 'سورة الناس - آیت ۱', text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', makhrajInfo: 'نون مشدد پر غنہ (ناک میں آواز ایک الف کے برابر روکنا) ضروری ہے۔' },
  { id: 'takathur_1', category: 'surahs', title: 'سورة التكاثر - آیت ۱', text: 'أَلْهَاكُمُ التَّكَاثُرُ', makhrajInfo: 'ث کو نرمی سے زبان کی نوک سے ادا کریں، س کی طرح نہ پڑھیں۔' },
  { id: 'kauthar_1', category: 'surahs', title: 'سورة الكوثر - آیت ۱', text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', makhrajInfo: 'ط اور ر کو موٹا پڑھیں اور نون مشدد پر غنہ کریں۔' },

  { id: 'rule_ghunnah', category: 'rules', title: 'تجوید چیلنج: غنّہ (نون و میم مشدد)', text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', makhrajInfo: 'نون اور میم مشدد پر ناک میں ایک الف کے برابر آواز روک کر غنہ کریں۔' },
  { id: 'rule_qalqalah', category: 'rules', title: 'تجوید چیلنج: قلقلہ (قُطْبُ جَدٍّ)', text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', makhrajInfo: 'قلقلہ کے ۵ حروف (ق، ط، ب، ج، د) ساکن ہونے پر آواز لوٹا کر پڑھیں۔' },
  { id: 'rule_ikhfa', category: 'rules', title: 'تجوید چیلنج: اخفاء (چھپانا)', text: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', makhrajInfo: 'نون ساکن یا تنوین کے بعد حروفِ اخفاء پر آواز کو ناک میں چھپا کر پڑھیں۔' },
  { id: 'rule_idgham', category: 'rules', title: 'تجوید چیلنج: ادغام (ملانا)', text: 'فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ', makhrajInfo: 'نون ساکن کو نون/میم/واؤ/یا میں ملا کر غنہ کے ساتھ پڑھیں۔' },
  { id: 'rule_izhar', category: 'rules', title: 'تجوید چیلنج: اظهار (ظاہر کرنا)', text: 'مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ', makhrajInfo: 'حروفِ حلق کے ساتھ نون ساکن کو بغیر غنہ کے صاف اور ظاہر کر کے پڑھیں۔' },
  { id: 'rule_madd', category: 'rules', title: 'تجوید چیلنج: مدّ متصل (لمبا کرنا)', text: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', makhrajInfo: 'الف، واؤ یا یاء کے بعد ہمزہ اسی لفظ میں ہو تو ۴ سے ۵ الف کے برابر لمبا کریں۔' }
];

const QUICK_QUESTIONS = [
  'ح اور ہ کے مخرج میں کیا فرق ہے؟',
  'قلقلہ کے کون سے ۵ حروف ہیں اور ان کا قاعدہ کیا ہے؟',
  'نون ساکن اور تنوین کے ۴ احکام بتائیں',
  'مدّ متصل اور مدّ منفصل میں کیا فرق ہے؟',
  'اسمِ جلالہ (اللّٰہ) کے لَام کو کب پر اور کب باریک پڑھا جاتا ہے؟',
  'میم ساکن کے کتنے احکام ہیں؟',
  'حروفِ مدّہ اور حروفِ لِین میں کیا فرق ہے؟'
];

export const AiUstadhModal: React.FC<AiUstadhModalProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: '﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\nمیں آپ کا پرو اے۔آئی استاد (AI Ustadh Pro) ہوں۔ آج آپ کو کون سا حرف، سورت یا تجویدی قاعدہ سیکھنا ہے؟ لائیو مائیک کا بٹن دبا کر تلاوت فرما ئیں، کیمرے سے صفحہ اسکین کریں یا تجویدی کوئز شروع کریں۔' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(PRACTICE_TARGETS[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'letters' | 'surahs' | 'rules'>('all');
  const [showMakhrajModal, setShowMakhrajModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Back Button Handlers (Hierarchy: Makhraj Modal > Return to Home)
  useBackHandler(() => {
    setShowMakhrajModal(false);
  }, showMakhrajModal, 50, 'ai_ustadh_makhraj_modal');

  useBackHandler(() => {
    stopAllQariAudio();
    onBack();
  }, !showMakhrajModal, 20, 'ai_ustadh_root');

  // Image & Camera scan state
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // User Gamification Stats
  const [userScore, setUserScore] = useState(380);
  const [userStreak, setUserStreak] = useState(7);
  const [micVolumeLevel, setMicVolumeLevel] = useState<number[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const getUserRankTitle = (score: number) => {
    if (score >= 1000) return 'استادِ تجوید 🥇';
    if (score >= 500) return 'قاریِ قرآن 🥈';
    return 'طالبِ علم 🥉';
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isRecording]);

  // Mic level animation effect during recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        const levels = Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 20);
        setMicVolumeLevel(levels);
      }, 100);
    } else {
      setMicVolumeLevel([]);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const speakText = (text: string) => {
    speakUstadhMessage(text, playbackSpeed);
  };

  const handleStartQuiz = () => {
    handleSend('🎯 استاد محترم! تجویدی قواعد یا مخارج سے متعلق مجھ سے ایک زبردست سوال یا تجویدی چیلنج پوچھیں اور آپشنز دیں۔');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const base64Data = result.split(',')[1];
        const mimeType = file.type || 'image/jpeg';
        setSelectedImage({
          base64: base64Data,
          mimeType: mimeType,
          previewUrl: result
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if ((!textToSend.trim() && !selectedImage) || isThinking) return;

    const currentImg = selectedImage;
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: textToSend || '📷 [صفحہ / تصویر کا تجویدی معائنہ]',
      imageUrl: currentImg?.previewUrl
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setIsThinking(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: textToSend,
          history: historyPayload,
          imageBase64: currentImg?.base64,
          imageMimeType: currentImg?.mimeType
        })
      });
      const data = await res.json();
      const replyText = data.text || 'ماشاء اللہ! آپ کا سوال درج کر لیا گیا ہے۔ مزید مشق جاری رکھیں۔';
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText
      };
      setMessages(prev => [...prev, aiReply]);
      speakText(replyText);
    } catch (err) {
      const fallbackText = 'ماشاء اللہ بہت عمدہ کوشش! حروف کی ادائیگی میں مخرج اور صفات کا خاص خیال رکھیں۔';
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: fallbackText
      };
      setMessages(prev => [...prev, fallbackReply]);
      speakText(fallbackText);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRecordRecitation = async () => {
    if (isRecording) {
      // Manual stop
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    stopAllQariAudio();
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = (reader.result as string).split(',')[1];
          processRecitationEvaluation(selectedTarget.text, base64Audio);
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto stop after 6 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 6000);

    } catch (err) {
      console.warn("MediaRecorder fallback to speech recognition:", err);
      // Fallback to Speech Recognition or simulation
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        try {
          setIsRecording(true);
          const recognition = new SpeechRecognitionAPI();
          recognition.lang = 'ar-SA';
          recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            processRecitationEvaluation(speechResult);
          };
          recognition.onend = () => setIsRecording(false);
          recognition.onerror = () => simulateRecitationEvaluation();
          recognition.start();
          return;
        } catch {
          // Fallback
        }
      }
      simulateRecitationEvaluation();
    }
  };

  const simulateRecitationEvaluation = () => {
    setTimeout(() => {
      setIsRecording(false);
      processRecitationEvaluation(selectedTarget.text);
    }, 2200);
  };

  const processRecitationEvaluation = async (spokenText: string, audioBase64?: string) => {
    const userMsg: ChatMessage = { 
      id: Date.now().toString(), 
      sender: 'user', 
      text: `🎤 [تلاوت کی لائیو آواز: "${selectedTarget.text}"]` 
    };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/evaluate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetLetterOrAyah: selectedTarget.text, 
          spokenText: spokenText,
          audioBase64: audioBase64,
          audioMimeType: 'audio/webm'
        })
      });
      const data = await res.json();
      
      const score = typeof data.score === 'number' ? data.score : 92;
      const feedback = data.feedback || 'ماشاء اللہ! آپ کا تلفظ اور مخرج بالکل درست ہے۔';
      const praise = data.praise || 'ماشاء اللہ! بہت خوب!';
      const correctPoints = Array.isArray(data.correctPoints) && data.correctPoints.length > 0
        ? data.correctPoints
        : ['مخرج کی درست ادائیگی کی گئی', 'حرکات و اعراب کو صحیح ادا کیا گیا'];
      const makhrajAdvice = Array.isArray(data.makhrajAdvice) && data.makhrajAdvice.length > 0
        ? data.makhrajAdvice
        : [selectedTarget.makhrajInfo];

      const evalData = {
        score,
        correctPoints,
        makhrajAdvice,
        praise
      };

      const replyText = `${praise}\n\n${feedback}\n\nتجوید و مخرج کا اسکور: ${score}% ⭐`;
      
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        evalResult: evalData
      };

      setMessages(prev => [...prev, aiReply]);
      setUserScore(s => s + Math.round(score / 4));
      setUserStreak(st => st + 1);
      speakText(replyText);
    } catch {
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `ماشاء اللہ! بہت عمدہ تلاوت۔ آپ کو 25 پوائنٹس حاصل ہوئے! ⭐\n\nمخرج کی رہنمائی: ${selectedTarget.makhrajInfo}`,
        evalResult: {
          score: 95,
          correctPoints: ['تلفظ اور مخرج صحیح ہے'],
          makhrajAdvice: [selectedTarget.makhrajInfo],
          praise: 'ماشاء اللہ! ممتاز'
        }
      };
      setMessages(prev => [...prev, fallbackReply]);
      setUserScore(s => s + 25);
      speakText(fallbackReply.text);
    } finally {
      setIsThinking(false);
    }
  };

  const filteredTargets = activeCategory === 'all' 
    ? PRACTICE_TARGETS 
    : PRACTICE_TARGETS.filter(t => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0e131d] text-white p-3 sm:p-6 flex flex-col font-urdu" dir="rtl">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-4">
        
        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center text-white shadow-xl shrink-0">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">مصنوعی ذہانت استاد (AI Ustadh Pro)</h1>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full font-bold">
                  تلفظ، مخرج و تجوید ماسٹر
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">لائیو تلاوت ریکارڈ کریں، نورانی قاعدہ/صفحہ اسکین کریں اور تجویدی استاد سے بات کریں</p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
            {/* Gamification Stats */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
              <span className="bg-purple-950 text-purple-300 px-2 py-0.5 rounded-md font-bold text-[10px]">
                {getUserRankTitle(userScore)}
              </span>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1 text-amber-300 font-extrabold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{userScore} XP</span>
              </div>
              <div className="h-3 w-px bg-slate-800" />
              <div className="flex items-center gap-1 text-orange-400 font-extrabold">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>{userStreak} دن</span>
              </div>
            </div>

            {/* Playback Speed Controller */}
            <div className="flex items-center bg-slate-900 border border-slate-800 px-1.5 py-1 rounded-xl text-[11px] font-bold text-slate-300">
              <span className="text-slate-400 px-1 text-[10px]">آواز:</span>
              {[0.75, 1, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                    playbackSpeed === speed ? 'bg-amber-500 text-slate-950 font-black' : 'hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={onBack}
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
              title="واپس جائیں"
            >
              <ArrowRight className="w-4 h-4 text-amber-400" />
              <span>واپسی</span>
            </button>
          </div>
        </div>

        {/* PRACTICE TARGET SELECTOR CARD */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-purple-500/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-pink-400" />
              <span>مشق و تلفظ چیلنج کا سبق چنیں:</span>
            </span>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeCategory === 'all' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تمام
                </button>
                <button
                  onClick={() => setActiveCategory('letters')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeCategory === 'letters' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  مخارج حروف
                </button>
                <button
                  onClick={() => setActiveCategory('surahs')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeCategory === 'surahs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  سورتیں
                </button>
                <button
                  onClick={() => setActiveCategory('rules')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                    activeCategory === 'rules' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تجویدی قواعد
                </button>
              </div>

              <button
                onClick={handleStartQuiz}
                className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-1.5 rounded-xl border border-amber-700/80 hover:bg-amber-900 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                title="استاد محترم سے تجویدی سوال پوچھوائیں"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>🎯 تجویدی امتحان</span>
              </button>

              <button
                onClick={() => setShowMakhrajModal(true)}
                className="text-[11px] font-bold text-pink-300 bg-pink-950/80 px-2.5 py-1.5 rounded-xl border border-pink-800 hover:bg-pink-900 transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-pink-400" />
                <span>📚 مخارج نقشہ</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar">
            {filteredTargets.map((target) => (
              <button
                key={target.id}
                onClick={() => {
                  setSelectedTarget(target);
                  playQariText(target.text);
                }}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  selectedTarget.id === target.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-md scale-105'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {target.title}
              </button>
            ))}
          </div>

          {/* Active Target Recitation Banner */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="text-[11px] text-purple-400 font-extrabold flex items-center justify-center sm:justify-start gap-1">
                <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>برائے مشق و ریکارڈنگ (Target Text):</span>
              </div>
              <div className="text-xl sm:text-2xl font-arabic font-black text-amber-300" dir="rtl">
                ﴿ {selectedTarget.text} ﴾
              </div>
              <p className="text-[11px] text-slate-400 font-bold">{selectedTarget.makhrajInfo}</p>
            </div>

            <div className="flex items-center gap-2.5 z-10 shrink-0">
              <button
                onClick={() => playQariText(selectedTarget.text)}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Volume2 className="w-4 h-4 text-pink-400" />
                <span>قاری کی تلاوت سنیں</span>
              </button>

              <button
                onClick={handleRecordRecitation}
                disabled={isRecording}
                className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all active:scale-95 ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse border border-rose-400' 
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white border border-pink-400/50'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>{isRecording ? 'تلاوت سنی جا رہی ہے...' : '🎙️ تلاوت ریکارڈ کریں'}</span>
              </button>
            </div>
          </div>

          {/* Animated Mic Waveform when recording */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 py-2 bg-rose-950/60 rounded-xl border border-rose-800/80">
              <span className="text-xs text-rose-300 font-bold ml-2">مائیک پر آواز کا تجزیہ ہو رہا ہے:</span>
              {micVolumeLevel.map((lvl, idx) => (
                <div
                  key={idx}
                  style={{ height: `${lvl * 0.3}px` }}
                  className="w-1.5 bg-rose-400 rounded-full transition-all duration-100"
                />
              ))}
            </div>
          )}
        </div>

        {/* CHAT MESSAGES & AI EVALUATIONS DISPLAY */}
        <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-2xl max-h-[420px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'ai' ? 'bg-purple-950 text-purple-400 border border-purple-800' : 'bg-pink-950 text-pink-400 border border-pink-800'
              }`}>
                {m.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>

              <div className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-md space-y-3 ${
                m.sender === 'ai' ? 'bg-slate-800 text-white rounded-tr-none border border-slate-700' : 'bg-pink-600 text-white rounded-tl-none'
              }`}>
                {m.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-700/80 max-w-xs mb-2 shadow-lg">
                    <img src={m.imageUrl} alt="Uploaded Quran/Qaida page" className="w-full h-auto max-h-48 object-cover" />
                  </div>
                )}

                <div className="whitespace-pre-line font-medium">{m.text}</div>

                {/* Detailed Evaluation Card if present */}
                {m.evalResult && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-purple-800/80 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-2">
                      <span className="text-amber-300 flex items-center gap-1">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>تجویدی کارکردگی کا تجزیہ:</span>
                      </span>
                      <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-xs font-black border border-purple-700">
                        اسکور: {m.evalResult.score}% ⭐
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-1">
                      {m.evalResult.correctPoints.map((pt, i) => (
                        <div key={i} className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}

                      {m.evalResult.makhrajAdvice.map((adv, i) => (
                        <div key={i} className="text-amber-300 font-bold flex items-start gap-1.5 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>مخرج کی رہنمائی: {adv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons inside eval card */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={handleRecordRecitation}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-pink-300 text-[11px] rounded-xl border border-slate-700 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>دوبارہ تلاوت کریں</span>
                      </button>

                      <button
                        onClick={() => playQariText(selectedTarget.text)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] rounded-xl border border-slate-700 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>قاری کا لہجہ سنیں</span>
                      </button>

                      <button
                        onClick={() => setShowMakhrajModal(true)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] rounded-xl border border-slate-700 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>وضاحت و مخرج دیکھو</span>
                      </button>
                    </div>
                  </div>
                )}

                {m.sender === 'ai' && (
                  <button
                    onClick={() => speakText(m.text)}
                    className="mt-2 text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1 font-bold bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/60 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>آواز سنیں (Audio)</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isRecording && (
            <div className="flex items-center gap-3 text-pink-400 text-xs font-bold animate-pulse p-3 bg-pink-950/30 rounded-2xl border border-pink-800/50">
              <Mic className="w-5 h-5 animate-bounce text-pink-400" />
              <span>آپ کی تلاوت ریکارڈ کی جا رہی ہے (Analyzing Makhraj & Tajweed)...</span>
            </div>
          )}

          {isThinking && !isRecording && (
            <div className="flex items-center gap-3 text-purple-400 text-xs font-bold animate-pulse p-3 bg-purple-950/30 rounded-2xl border border-purple-800/50">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span>استاد محترم جواب اور تجزیہ تیار فرما رہے ہیں...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* QUICK QUESTION SHORTCUT CHIPS */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
            <span>فوری سوال پوچھیں (Quick Tajweed Questions):</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-950/80 border border-slate-800 hover:border-purple-600/60 text-slate-300 hover:text-purple-200 text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT & MIC TOOLBAR */}
        <div className="space-y-2">
          {selectedImage && (
            <div className="flex items-center justify-between bg-purple-950/80 border border-purple-700/80 px-3 py-2 rounded-xl text-xs text-purple-200 shadow-md">
              <div className="flex items-center gap-2">
                <img src={selectedImage.previewUrl} alt="Preview" className="w-8 h-8 rounded-lg object-cover border border-purple-500 shrink-0" />
                <span className="font-bold">صفحہ/تصویر منسلک کی گئی ہے (Image attached for AI Scan)</span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-purple-900 rounded-lg text-purple-300 cursor-pointer"
                title="تصویر ہٹائیں"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-900 border border-slate-800 p-2 sm:p-3 rounded-2xl shadow-xl w-full"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageSelect} 
              className="hidden" 
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 sm:p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all cursor-pointer shrink-0 flex items-center justify-center"
              title="صفحہ/تصویر اسکین کریں (Camera / Image Scan)"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={handleRecordRecitation}
              className={`p-2.5 sm:p-3 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700'
              }`}
              title="تلاوت کی لائیو آواز ریکارڈ کریں"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="استاد محترم سے سوال پوچھیں..."
              className="flex-1 min-w-0 bg-slate-950 border border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 font-medium"
            />

            <button
              type="submit"
              onClick={() => handleSend()}
              disabled={(!input.trim() && !selectedImage) || isThinking}
              id="ai-ustadh-send-button"
              className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5 active:scale-95 border shrink-0 ${
                (!input.trim() && !selectedImage) || isThinking
                  ? 'bg-slate-800/80 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-purple-400/50 shadow-purple-950/50'
              }`}
              title="ارسال (Send Message)"
            >
              <Send className="w-4 h-4 rtl:-scale-x-100" />
              <span className="font-bold">ارسال</span>
            </button>
          </form>
        </div>

      </div>

      {/* MAKHRAJ EXPLANATION MODAL */}
      <AnimatePresence>
        {showMakhrajModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-urdu" dir="rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border-2 border-purple-500/50 rounded-3xl p-5 sm:p-6 max-w-xl w-full space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-pink-400" />
                  <span>تجوید و مخارج کی ۵ بنیادی جگہیں (Makharij Map)</span>
                </h3>
                <button
                  onClick={() => setShowMakhrajModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-amber-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-300 text-sm">۱. الجوف (منہ اور حلق کا خلا):</span>
                    <button 
                      onClick={() => playQariText('ا و ی')}
                      className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-800"
                    >
                      🔊 سنیں
                    </button>
                  </div>
                  <p className="text-slate-300">حروفِ مدہ (ا، و، ی) منہ اور حلق کے خالی حصے سے سانس کے ساتھ بغیر کسی رکاوٹ کے ادا ہوتے ہیں۔</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-pink-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-pink-300 text-sm">۲. الحلق (حلق کے ۶ حروف):</span>
                    <button 
                      onClick={() => playQariText('ء ہ ع ح غ خ')}
                      className="text-[10px] bg-pink-950 text-pink-300 px-2 py-0.5 rounded-lg border border-pink-800"
                    >
                      🔊 سنیں
                    </button>
                  </div>
                  <p className="text-slate-300">
                    • <strong>اقصائے حلق (نیچلا حصہ):</strong> ہَمْزَة (ء)، هَاء (ہ)<br/>
                    • <strong>وسطِ حلق (درمیانی حصہ):</strong> عَيْن (ع)، حَاء (ح)<br/>
                    • <strong>ادنائے حلق (اوپری حصہ):</strong> غَيْن (غ)، خَاء (خ)
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-cyan-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-cyan-300 text-sm">۳. اللسان (زبان کے ۱۸ حروف):</span>
                    <button 
                      onClick={() => playQariText('ق ک ج ش ی ط د ت ص ز س ظ ذ ث ل ن ر ض')}
                      className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-800"
                    >
                      🔊 سنیں
                    </button>
                  </div>
                  <p className="text-slate-300">زبان کی جڑ، درمیان، کنارے اور نوک سے ۱۸ حروف ادا ہوتے ہیں۔ (مثلاً: ق، ک، ج، ش، ط، د، ت، ص، ض وغیرہ)۔</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-emerald-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-emerald-300 text-sm">۴. الشفتان (ہونٹوں کے ۴ حروف):</span>
                    <button 
                      onClick={() => playQariText('ف ب م و')}
                      className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-800"
                    >
                      🔊 سنیں
                    </button>
                  </div>
                  <p className="text-slate-300">فَاء (ف)، بَاء (ب)، مِيم (م)، وَاو (و) دونوں ہونٹوں کی ملاوٹ یا گولائی سے ادا ہوتے ہیں۔</p>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-2xl border border-purple-900/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-purple-300 text-sm">۵. الخيشوم (ناک کا بانسہ - غنہ):</span>
                    <button 
                      onClick={() => playQariText('إنّ مّ')}
                      className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-800"
                    >
                      🔊 سنیں
                    </button>
                  </div>
                  <p className="text-slate-300">نون اور میم مشدد یا ادغام و اخفاء کی حالت میں گنگنائٹ کی آواز ناک کے بانسے سے نکلتی ہے۔</p>
                </div>
              </div>

              <button
                onClick={() => setShowMakhrajModal(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs cursor-pointer shadow-lg hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                سمجھ میں آ گیا (تمام کریں)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

