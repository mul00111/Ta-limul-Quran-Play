import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, Video, Music, Play, Pause, Trash2, CheckCircle2, 
  Sparkles, FileText, Mic, Square, Eye, Share2, BookmarkCheck 
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../translations';
import { saveCustomHurufAudio } from '../utils/qariAudioService';
import { useBackHandler } from '../hooks/useBackHandler';

interface MediaItem {
  id: string;
  title: string;
  type: 'video' | 'audio';
  url: string;
  size: string;
  duration: string;
  date: string;
  assignedHuruf?: string;
}

const HURUF_OPTIONS = [
  { letter: 'ا', name: 'أَلِفْ' },
  { letter: 'ب', name: 'بَاءْ' },
  { letter: 'ت', name: 'تَاءْ' },
  { letter: 'ث', name: 'ثَاءْ' },
  { letter: 'ج', name: 'جِيمْ' },
  { letter: 'ح', name: 'حَاءْ' },
  { letter: 'خ', name: 'خَاءْ' },
  { letter: 'د', name: 'دَالْ' },
  { letter: 'ذ', name: 'ذَالْ' },
  { letter: 'ر', name: 'رَاءْ' },
  { letter: 'ز', name: 'زَاءْ' },
  { letter: 'س', name: 'سِيْنْ' },
  { letter: 'ش', name: 'شِيْنْ' },
  { letter: 'ص', name: 'صَادْ' },
  { letter: 'ض', name: 'ضَادْ' },
  { letter: 'ط', name: 'طَاءْ' },
  { letter: 'ظ', name: 'ظَاءْ' },
  { letter: 'ع', name: 'عَيْنْ' },
  { letter: 'غ', name: 'غَيْنْ' },
  { letter: 'ف', name: 'فَاءْ' },
  { letter: 'ق', name: 'قَافْ' },
  { letter: 'ك', name: 'كَافْ' },
  { letter: 'ل', name: 'لَامْ' },
  { letter: 'م', name: 'مِيمْ' },
  { letter: 'ن', name: 'نُوْنْ' },
  { letter: 'و', name: 'وَاوْ' },
  { letter: 'ه', name: 'هَاءْ' },
  { letter: 'ء', name: 'هَمْزَة' },
  { letter: 'ي', name: 'يَاءْ' },
];

interface VideoAudioUploadPortalProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

export const VideoAudioUploadPortal: React.FC<VideoAudioUploadPortalProps> = ({ currentLang, onBack }) => {
  const t = translations[currentLang];

  const [mediaList, setMediaList] = useState<MediaItem[]>([
    {
      id: '1',
      title: 'قاعدة نورانية - الدرس الأول (حروف الهجاء)',
      type: 'audio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      size: '3.2 MB',
      duration: '02:45',
      date: 'Today, 10:30 AM',
    },
    {
      id: '2',
      title: 'تلاوة سورة الفاتحة مع الأستاذ أحمد',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      size: '14.8 MB',
      duration: '04:15',
      date: 'Yesterday',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [titleInput, setTitleInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('audio');
  const [selectedHurufToAssign, setSelectedHurufToAssign] = useState<string>('none');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Back Button Handlers (Hierarchy: Record Tab -> Return to Home)
  useBackHandler(() => {
    setActiveTab('upload');
  }, activeTab !== 'upload', 30, 'media_portal_tab');

  useBackHandler(() => {
    onBack();
  }, activeTab === 'upload', 20, 'media_portal_root');

  // Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.includes('video')) {
        setMediaType('video');
      } else {
        setMediaType('audio');
      }
      if (!titleInput) {
        setTitleInput(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !titleInput) return;

    if (selectedHurufToAssign !== 'none' && selectedFile) {
      const matchedHuruf = HURUF_OPTIONS.find(h => h.name === selectedHurufToAssign || h.letter === selectedHurufToAssign);
      const letterChar = matchedHuruf ? matchedHuruf.letter : undefined;
      const reader = new FileReader();
      reader.onloadend = () => {
        saveCustomHurufAudio(selectedHurufToAssign, reader.result as string, letterChar);
      };
      reader.readAsDataURL(selectedFile);
    }

    setIsUploading(true);
    setTimeout(() => {
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        title: titleInput || (selectedFile ? selectedFile.name : 'Untitled Lesson'),
        type: mediaType,
        url: selectedFile ? URL.createObjectURL(selectedFile) : 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        size: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.1 MB',
        duration: '03:00',
        date: 'Just now',
        assignedHuruf: selectedHurufToAssign !== 'none' ? selectedHurufToAssign : undefined,
      };

      setMediaList(prev => [newMedia, ...prev]);
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFile(null);
      setTitleInput('');
      setSelectedHurufToAssign('none');

      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1200);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);

    const newRecorded: MediaItem = {
      id: Date.now().toString(),
      title: `لائیو ریکارڈنگ - ${new Date().toLocaleTimeString()}`,
      type: 'audio',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      size: '1.5 MB',
      duration: `${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      date: 'Just now',
    };

    setMediaList(prev => [newRecorded, ...prev]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const deleteMedia = (id: string) => {
    setMediaList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#121212] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-zinc-900/90 border border-pink-900/40 p-5 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
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
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-xs uppercase tracking-widest text-pink-400 font-bold">MEDIA LESSONS PORTAL</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">وڈیو اور آڈیو اپ لوڈ اور ریکارڈنگ (Video & Audio Upload)</h2>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'upload' ? 'bg-[#C2185B] text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>فائل اپ لوڈ (Upload)</span>
            </button>

            <button
              onClick={() => setActiveTab('record')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'record' ? 'bg-[#C2185B] text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>لائیو ریکارڈ (Record)</span>
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold text-sm flex items-center gap-3 shadow-lg animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>ماشاء الله! میڈیا فائل کامیابی کے ساتھ محفوظ ہو گئی ہے۔</span>
          </div>
        )}

        {/* TAB 1: UPLOAD FILE */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Upload Form Card */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl lg:col-span-1">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-pink-500" />
                <span>نئی وڈیو یا آڈیو اپ لوڈ کریں</span>
              </h3>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">سبق کا عنوان (Title)</label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={e => setTitleInput(e.target.value)}
                    placeholder="مثال: قاعدہ سبق نمبر 3..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C2185B] mb-1.5 flex items-center gap-1">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>حروفِ تہجی میں آڈیو سیٹ کریں (اختیاری)</span>
                  </label>
                  <select
                    value={selectedHurufToAssign}
                    onChange={e => setSelectedHurufToAssign(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="none">-- کوئی نہیں (عمومی سبق) --</option>
                    {HURUF_OPTIONS.map((h) => (
                      <option key={h.name} value={h.name}>
                        حرف: {h.name} ({h.letter})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">میڈیا کی قسم (Type)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMediaType('audio')}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                        mediaType === 'audio' ? 'bg-pink-950 border-pink-700 text-pink-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                      <span>آڈیو (Audio)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border cursor-pointer ${
                        mediaType === 'video' ? 'bg-pink-950 border-pink-700 text-pink-300' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>وڈیو (Video)</span>
                    </button>
                  </div>
                </div>

                {/* File Dropzone / Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">فائل منتخب کریں (Select File)</label>
                  <label className="border-2 border-dashed border-zinc-700 hover:border-pink-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-zinc-950 transition-colors group">
                    <Upload className="w-8 h-8 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-zinc-300 text-center">
                      {selectedFile ? selectedFile.name : 'کلک کریں یا یہاں فائل ڈراپ کریں'}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1">MP3, MP4, WAV, MOV (Max 50MB)</span>
                    <input
                      type="file"
                      accept="audio/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C2185B] to-rose-700 hover:opacity-90 text-white font-bold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <span>اپ لوڈ ہو رہا ہے... (Uploading...)</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>محفوظ کریں (Upload Lesson)</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Media List / Player Section */}
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" />
                <span>محفوظ کردہ دروس کی فہرست (Uploaded Lessons)</span>
              </h3>

              <div className="space-y-3">
                {mediaList.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.type === 'video' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-pink-950 text-pink-400 border border-pink-800'
                      }`}>
                        {item.type === 'video' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-0.5">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 text-pink-400" />
                        <span>سنیں / دیکھیں</span>
                      </a>

                      <button
                        onClick={() => deleteMedia(item.id)}
                        className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE RECORDING */}
        {activeTab === 'record' && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-pink-950/80 border-2 border-pink-700 flex items-center justify-center text-pink-400 mb-6 shadow-2xl relative">
              <Mic className={`w-10 h-10 ${isRecording ? 'animate-bounce text-red-500' : ''}`} />
              {isRecording && (
                <span className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-50" />
              )}
            </div>

            <h3 className="text-2xl font-black text-white mb-2">وائس یا وڈیو لائیو ریکارڈنگ (Live Recorder)</h3>
            <p className="text-xs text-zinc-400 mb-8">اپنے مائیکروفون سے قرآن پاک کی تلاوت یا استاد کا لیکچر ریکارڈ کریں۔</p>

            {isRecording ? (
              <div className="space-y-6">
                <div className="text-3xl font-mono font-bold text-red-500 tracking-wider">
                  {Math.floor(recordingTime / 60).toString().padStart(2, '0')}:{(recordingTime % 60).toString().padStart(2, '0')}
                </div>
                <button
                  onClick={stopRecording}
                  className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Square className="w-5 h-5 fill-current" />
                  <span>ریکارڈنگ روکیں اور محفوظ کریں (Stop & Save)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={startRecording}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:opacity-90 text-white font-black text-sm shadow-xl flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>ریکارڈنگ شروع کریں (Start Recording 🎙️)</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
