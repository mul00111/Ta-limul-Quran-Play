import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Play, Pause, Volume2, ArrowRight, RotateCcw, 
  CheckCircle2, AlertTriangle, Mic, MicOff, RefreshCw, 
  Sparkles, SkipForward, SkipBack, Search,
  Headphones, Check, ChevronLeft, ChevronRight,
  Download, Trash2, HardDrive, Wifi, WifiOff, Loader2,
  Layers, Type, Bookmark
} from 'lucide-react';
import { LanguageCode } from '../types';
import { useBackHandler } from '../hooks/useBackHandler';
import { PARA_30_SURAHS, ProjectorSurah } from '../data/para30Surahs';
import { 
  ALL_30_PARAS, 
  ALL_114_SURAHS, 
  ParaInfo, 
  SurahMeta, 
  getSurahsForJuz,
  getParaAyahRange
} from '../data/quranParasData';
import { loadSurahVerses } from '../services/quranApiService';
import { 
  playQariText, 
  QARI_VOICES, 
  getSelectedQariVoiceId, 
  setSelectedQariVoiceId,
  getAlafasyUrlForSurahAyah,
  getSurahReciterDetail,
  normalizeArabicForMatching,
  stopAllQariAudio
} from '../utils/qariAudioService';
import {
  getAyahAudioSource,
  getSurahDownloadStatus,
  downloadSurahOffline,
  deleteSurahOfflineAudio,
  getAllDownloadedSurahsSet
} from '../services/quranOfflineAudioService';

interface QuranLearningHubProps {
  currentLang: LanguageCode;
  onBack: () => void;
}

export interface Ayah {
  number: number;
  text: string;
  translationUrdu?: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  urduName: string;
  totalAyahs: number;
  type: 'مكية' | 'مدنية';
  hasBismillah: boolean;
  ayahs: Ayah[];
}

// Convert all 37 Para 30 Surahs + Al-Fatiha
const ALL_PARA30_SURAHS: SurahData[] = PARA_30_SURAHS.map((s: ProjectorSurah) => ({
  number: s.number,
  name: s.name,
  englishName: s.englishName,
  urduName: s.urduName,
  totalAyahs: s.totalAyahs,
  type: s.type,
  hasBismillah: s.hasBismillah,
  ayahs: s.verses.map((v) => ({
    number: v.number,
    text: v.arabic,
    translationUrdu: v.urdu
  }))
}));

// Sound Synthesis for Instant Feedback (Chimes & Voices)
const playFeedbackChime = (type: 'success' | 'error') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.4);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(370, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch (e) {
    console.warn('AudioContext error:', e);
  }
};

// Spoken Feedback in Urdu
const speakUrduFeedback = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => 
      v.lang.toLowerCase().includes('ur') || 
      v.lang.toLowerCase().includes('hi') ||
      v.name.toLowerCase().includes('urdu')
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
};

export const QuranLearningHub: React.FC<QuranLearningHubProps> = ({ onBack }) => {
  // Selected Para: 1 to 30, or 'all'. Default is Para 30 (Amma Para)
  const [selectedPara, setSelectedPara] = useState<number | 'all'>(30);
  const [showFullSurah, setShowFullSurah] = useState<boolean>(false);
  const [selectedSurahMeta, setSelectedSurahMeta] = useState<SurahMeta>(
    ALL_114_SURAHS.find((s) => s.number === 78) || ALL_114_SURAHS[0]
  );
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [arabicFontSize, setArabicFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');

  // Default to Surah An-Naba (#78)
  const [selectedSurah, setSelectedSurah] = useState<SurahData>(
    ALL_PARA30_SURAHS.find((s) => s.number === 78) || ALL_PARA30_SURAHS[0]
  );

  // Active Para Info
  const currentParaInfo = useMemo(() => {
    return selectedPara === 'all' ? null : ALL_30_PARAS.find((p) => p.number === selectedPara) || null;
  }, [selectedPara]);

  // Exact Para Ayah Range for the currently selected Surah
  const paraRange = useMemo(() => {
    if (selectedPara === 'all') return null;
    return getParaAyahRange(selectedPara, selectedSurah.number);
  }, [selectedPara, selectedSurah.number]);

  // Displayed Ayahs: precisely starts where the Para starts (respecting startAyah and endAyah)
  const displayedAyahs = useMemo(() => {
    if (!paraRange || showFullSurah) {
      return selectedSurah.ayahs;
    }
    return selectedSurah.ayahs.filter(
      (a) => a.number >= paraRange.startAyah && a.number <= paraRange.endAyah
    );
  }, [selectedSurah.ayahs, paraRange, showFullSurah]);

  // Only display Bismillah if the displayed subset begins with Ayah 1 and the Surah has Bismillah
  const hasBismillahForDisplay = useMemo(() => {
    if (!selectedSurah.hasBismillah) return false;
    if (displayedAyahs.length > 0 && displayedAyahs[0].number !== 1) {
      return false;
    }
    return true;
  }, [selectedSurah.hasBismillah, displayedAyahs]);
  
  // Default Qari is Sheikh Sudais
  const [selectedQari, setSelectedQari] = useState<string>(getSelectedQariVoiceId() || 'sudais');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingAyahIndex, setCurrentPlayingAyahIndex] = useState<number | null>(null);
  const [isBismillahPlaying, setIsBismillahPlaying] = useState(false);
  
  // Modes: 'repeatSingleAyah' (Default TRUE: ہر آیت خود بخود ریپیٹ ہوتی رہے گی جب تک اگلی پر کلک نہ کیا جائے)
  const [repeatSingleAyah, setRepeatSingleAyah] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'مكية' | 'مدنية'>('all');

  // Recitation Practice / سنانے کا فیچر
  const [testingAyahIndex, setTestingAyahIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognizedTranscript, setRecognizedTranscript] = useState('');
  const [testResult, setTestResult] = useState<{
    status: 'correct' | 'incorrect' | 'waiting' | null;
    score: number;
    message: string;
    wordMatches: { word: string; matched: boolean }[];
  }>({
    status: null,
    score: 0,
    message: '',
    wordMatches: []
  });

  // Offline Audio Download & Caching State
  const [isCurrentSurahDownloaded, setIsCurrentSurahDownloaded] = useState(false);
  const [isPlayingOfflineAudio, setIsPlayingOfflineAudio] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    isDownloading: boolean;
    percent: number;
    completed: number;
    total: number;
    currentAyah?: number;
  } | null>(null);
  const [downloadedSurahsSet, setDownloadedSurahsSet] = useState<Set<number>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check download status whenever selectedSurah or selectedQari changes
  useEffect(() => {
    let isSubscribed = true;
    getSurahDownloadStatus(selectedSurah.number, selectedSurah.totalAyahs, selectedQari).then((res) => {
      if (isSubscribed) {
        setIsCurrentSurahDownloaded(res.isFullyDownloaded);
      }
    });

    getAllDownloadedSurahsSet(
      ALL_114_SURAHS.map((s) => ({ number: s.number, totalAyahs: s.totalAyahs })),
      selectedQari
    ).then((set) => {
      if (isSubscribed) {
        setDownloadedSurahsSet(set);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [selectedSurah.number, selectedSurah.totalAyahs, selectedQari]);

  // Back Button Handlers (Hierarchy: Close Testing Modal > Return to Home)
  useBackHandler(() => {
    stopSpeechRecognition();
    setTestingAyahIndex(null);
  }, testingAyahIndex !== null, 40, 'quran_testing_modal');

  useBackHandler(() => {
    stopAudio();
    onBack();
  }, testingAyahIndex === null, 20, 'quran_root_back');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopSpeechRecognition();
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    stopAllQariAudio();
    setIsPlaying(false);
    setIsBismillahPlaying(false);
  };

  const handleQariChange = (qariId: string) => {
    setSelectedQari(qariId);
    setSelectedQariVoiceId(qariId);
    if (isPlaying && currentPlayingAyahIndex !== null) {
      playAyahByIndex(currentPlayingAyahIndex, qariId);
    }
  };

  const handleStartDownloadSurah = async () => {
    if (downloadProgress?.isDownloading) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setDownloadProgress({
      isDownloading: true,
      percent: 0,
      completed: 0,
      total: selectedSurah.totalAyahs,
    });

    try {
      const ayahNumbers = selectedSurah.ayahs.map((a) => a.number);
      const success = await downloadSurahOffline(
        selectedSurah.number,
        ayahNumbers,
        selectedQari,
        (p) => {
          setDownloadProgress({
            isDownloading: true,
            percent: p.percent,
            completed: p.completed,
            total: p.total,
            currentAyah: p.currentAyah,
          });
        },
        controller.signal
      );

      if (success) {
        setIsCurrentSurahDownloaded(true);
        setDownloadedSurahsSet((prev) => new Set(prev).add(selectedSurah.number));
        playFeedbackChime('success');
        speakUrduFeedback('سورۃ مکمل آف لائن محفوظ ہو چکی ہے۔');
      }
    } catch {
      // Aborted or failed
    } finally {
      setDownloadProgress(null);
      abortControllerRef.current = null;
    }
  };

  const handleCancelDownload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setDownloadProgress(null);
  };

  const handleDeleteSurahAudio = async () => {
    const confirmDelete = window.confirm
      ? window.confirm(`کیا آپ واقعی ${selectedSurah.name} کی آف لائن آڈیو حذف کرنا چاہتے ہیں؟`)
      : true;
    if (!confirmDelete) return;

    const ayahNumbers = selectedSurah.ayahs.map((a) => a.number);
    await deleteSurahOfflineAudio(selectedSurah.number, ayahNumbers, selectedQari);
    setIsCurrentSurahDownloaded(false);
    setDownloadedSurahsSet((prev) => {
      const next = new Set(prev);
      next.delete(selectedSurah.number);
      return next;
    });
  };

  const playAyahAudio = async (
    surahNum: number, 
    ayahNum: number, 
    customQariId?: string, 
    onEndedCallback?: () => void
  ) => {
    // Thoroughly clean up previous audio element to prevent event collisions
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    stopAllQariAudio();

    const qari = customQariId || selectedQari;
    
    try {
      const audioSource = await getAyahAudioSource(surahNum, ayahNum, qari);
      setIsPlayingOfflineAudio(audioSource.isOffline);

      const audio = new Audio(audioSource.url);
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.play().catch((err) => {
        console.warn('Audio play error:', err);
        setIsPlaying(false);
      });

      audio.onended = () => {
        if (onEndedCallback) {
          onEndedCallback();
        } else {
          setIsPlaying(false);
        }
      };
    } catch (err) {
      console.warn('Audio load error:', err);
      setIsPlaying(false);
    }
  };

  const playAyahByIndex = (index: number, customQariId?: string) => {
    if (index < 0 || index >= displayedAyahs.length) return;

    // Immediately stop old audio before initiating new verse
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    stopAllQariAudio();

    setIsPlaying(true);
    setIsBismillahPlaying(false);
    setCurrentPlayingAyahIndex(index);

    const ayah = displayedAyahs[index];

    // Smooth auto-scroll to ensure active Ayah is always centered in view
    if (typeof document !== 'undefined' && ayah) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-card-${ayah.number}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 60);
    }

    playAyahAudio(selectedSurah.number, ayah.number, customQariId, () => {
      if (repeatSingleAyah) {
        // Repeat the same Ayah continuously
        playAyahByIndex(index, customQariId);
      } else {
        // Go to next Ayah in sequence
        if (index + 1 < displayedAyahs.length) {
          playAyahByIndex(index + 1, customQariId);
        } else {
          setIsPlaying(false);
        }
      }
    });
  };

  const handleTogglePlaySurah = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      // If user had an Ayah active/selected, resume directly from that Ayah
      if (currentPlayingAyahIndex !== null && currentPlayingAyahIndex >= 0 && currentPlayingAyahIndex < displayedAyahs.length) {
        playAyahByIndex(currentPlayingAyahIndex);
      } else if (hasBismillahForDisplay) {
        setIsPlaying(true);
        setIsBismillahPlaying(true);
        setCurrentPlayingAyahIndex(null);
        playAyahAudio(1, 1, selectedQari, () => {
          setIsBismillahPlaying(false);
          playAyahByIndex(0);
        });
      } else {
        playAyahByIndex(0);
      }
    }
  };

  const handleNextAyah = () => {
    const nextIdx = (currentPlayingAyahIndex ?? -1) + 1;
    if (nextIdx < displayedAyahs.length) {
      playAyahByIndex(nextIdx);
    }
  };

  const handlePrevAyah = () => {
    const current = currentPlayingAyahIndex ?? 0;
    const prevIdx = current - 1;
    if (prevIdx >= 0) {
      playAyahByIndex(prevIdx);
    }
  };

  const handleSelectSurah = (surah: SurahData) => {
    stopAudio();
    stopSpeechRecognition();
    setTestingAyahIndex(null);
    setTestResult({ status: null, score: 0, message: '', wordMatches: [] });
    setSelectedSurah(surah);
  };

  const handleSelectSurahMeta = async (meta: SurahMeta) => {
    stopAudio();
    stopSpeechRecognition();
    setTestingAyahIndex(null);
    setTestResult({ status: null, score: 0, message: '', wordMatches: [] });
    setSelectedSurahMeta(meta);

    // If it's one of the embedded Para 30 surahs:
    const embedded = ALL_PARA30_SURAHS.find((s) => s.number === meta.number);
    if (embedded && embedded.ayahs && embedded.ayahs.length > 0) {
      setSelectedSurah(embedded);
      return;
    }

    // Otherwise load from local cache or API
    setIsLoadingVerses(true);
    try {
      const ayahs = await loadSurahVerses(meta);
      setSelectedSurah({
        number: meta.number,
        name: meta.name,
        englishName: meta.englishName,
        urduName: meta.urduName,
        totalAyahs: meta.totalAyahs,
        type: meta.type,
        hasBismillah: meta.hasBismillah,
        ayahs: ayahs
      });
    } catch (err) {
      console.warn('Failed to load surah verses:', err);
    } finally {
      setIsLoadingVerses(false);
    }
  };

  const handleSelectPara = (paraNum: number | 'all') => {
    setSelectedPara(paraNum);
    setShowFullSurah(false);
    stopAudio();
    setCurrentPlayingAyahIndex(null);
    if (paraNum === 'all') return;
    const para = ALL_30_PARAS.find((p) => p.number === paraNum);
    if (para && para.surahNumbers.length > 0) {
      // Always switch to the authentic starting Surah of this selected Para
      const startSurah = ALL_114_SURAHS.find((s) => s.number === para.startSurah) 
        || ALL_114_SURAHS.find((s) => s.number === para.surahNumbers[0]);
      if (startSurah) {
        handleSelectSurahMeta(startSurah);
      }
    }
  };

  const handlePrevPara = () => {
    if (selectedPara === 'all' || selectedPara <= 1) {
      handleSelectPara(30);
    } else {
      handleSelectPara(selectedPara - 1);
    }
  };

  const handleNextPara = () => {
    if (selectedPara === 'all' || selectedPara >= 30) {
      handleSelectPara(1);
    } else {
      handleSelectPara(selectedPara + 1);
    }
  };

  // Speech Recognition & Recitation Validation
  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const startRecitationTest = (ayahIndex: number) => {
    stopAudio();
    stopSpeechRecognition();

    setTestingAyahIndex(ayahIndex);
    setRecognizedTranscript('');
    setTestResult({
      status: 'waiting',
      score: 0,
      message: 'مائیکروفون آن ہے، براہ کرم تلاوت فرمائیے...',
      wordMatches: []
    });

    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTestResult({
        status: 'incorrect',
        score: 0,
        message: 'معذرت! آپ کے براؤزر میں وائس سپورٹ نہیں ہے۔ براہ کرم گوگل کروم استعمال کیجیے۔',
        wordMatches: []
      });
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setRecognizedTranscript(transcript);
        
        if (event.results[0].isFinal) {
          evaluateRecitation(transcript, displayedAyahs[ayahIndex]);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setTestResult({
            status: 'incorrect',
            score: 0,
            message: 'کوئی آواز نہیں سنی گئی۔ براہ کرم مائیکروفون کے قریب آ کر دوبارہ پڑھ کر سنائیے۔',
            wordMatches: []
          });
          playFeedbackChime('error');
          speakUrduFeedback('کوئی آواز موصول نہیں ہوئی۔ دوبارہ سنائیے۔');
        } else if (event.error === 'not-allowed') {
          setTestResult({
            status: 'incorrect',
            score: 0,
            message: 'مائیکروفون کی اجازت نہیں ملی۔ براؤزر سیٹنگز میں مائیکروفون آن کیجیے۔',
            wordMatches: []
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  // Helper: Levenshtein distance for string comparison
  const getLevenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  };

  const isWordAccuratelyMatched = (orig: string, recited: string): boolean => {
    if (!orig || !recited) return false;
    if (orig === recited) return true;
    
    // Normalization handles most variations
    const cleanOrig = orig.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    const cleanRecited = recited.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
    if (cleanOrig === cleanRecited) return true;

    // For short words (length <= 3 chars like عم, عن, في, من, ان, ما, لا), MUST match exact normalized text!
    if (cleanOrig.length <= 3) {
      return cleanOrig === cleanRecited;
    }
    
    // For longer words (length >= 4), allow at most 1 phonetic/transcription typo
    const dist = getLevenshteinDistance(cleanOrig, cleanRecited);
    if (cleanOrig.length >= 6 && dist <= 2) return true;
    if (cleanOrig.length >= 4 && dist <= 1) return true;
    return false;
  };

  const evaluateRecitation = (recitedText: string, originalAyah: Ayah) => {
    setIsListening(false);
    
    const normRecited = normalizeArabicForMatching(recitedText).trim();
    const normOriginal = normalizeArabicForMatching(originalAyah.text).trim();

    if (!normRecited) {
      setTestResult({
        status: 'incorrect',
        score: 0,
        message: 'کوئی آواز موصول نہیں ہوئی۔ براہ کرم مائیکروفون کے قریب آ کر دوبارہ پڑھ کر سنائیے۔',
        wordMatches: []
      });
      playFeedbackChime('error');
      speakUrduFeedback('کوئی آواز موصول نہیں ہوئی۔ دوبارہ سنائیے۔');
      return;
    }

    const originalWords = normOriginal.split(/\s+/).filter(Boolean);
    const recitedWords = normRecited.split(/\s+/).filter(Boolean);

    // 1. Strict Sequential Matching (ترتیبِ کلمات کی مکمل پابندی):
    // Words MUST appear in strict forward order without reversing or shuffling!
    let recitedPointer = 0;
    let matchedCount = 0;
    const wordMatches = originalWords.map((origWord) => {
      let isMatched = false;
      for (let rIdx = recitedPointer; rIdx < recitedWords.length; rIdx++) {
        if (isWordAccuratelyMatched(origWord, recitedWords[rIdx])) {
          isMatched = true;
          recitedPointer = rIdx + 1; // Advance forward pointer strictly!
          break;
        }
      }
      if (isMatched) {
        matchedCount++;
      }
      return { word: origWord, matched: isMatched };
    });

    // 2. Character-level whole string sequential similarity
    const cleanOrig = normOriginal.replace(/\s+/g, '');
    const cleanRecited = normRecited.replace(/\s+/g, '');
    const maxChars = Math.max(cleanOrig.length, cleanRecited.length, 1);
    const charDist = getLevenshteinDistance(cleanOrig, cleanRecited);
    const charSimilarity = Math.max(0, 1 - (charDist / maxChars));

    // Word match ratio
    const wordMatchRatio = matchedCount / Math.max(originalWords.length, 1);
    
    // Strict calculated score (0-100)
    const calculatedScore = Math.round((wordMatchRatio * 0.7 + charSimilarity * 0.3) * 100);

    // 3. STRICT SEQUENTIAL PASS CRITERIA:
    // Any reversal of words (e.g. "يتساءلون عما" instead of "عم يتساءلون") will fail!
    let isPassed = false;
    if (originalWords.length <= 2) {
      // For short ayahs: ALL words must match sequentially, charSimilarity >= 0.82, correct length
      isPassed = matchedCount === originalWords.length && charSimilarity >= 0.82 && Math.abs(recitedWords.length - originalWords.length) <= 1;
    } else if (originalWords.length <= 4) {
      // For 3-4 words ayahs: at least N-1 words must match sequentially, charSimilarity >= 0.78, score >= 82
      isPassed = matchedCount >= originalWords.length - 1 && charSimilarity >= 0.78 && calculatedScore >= 82 && recitedWords.length >= originalWords.length - 1;
    } else {
      // For longer ayahs (5+ words): at least 85% words matched sequentially, charSimilarity >= 0.75, score >= 80
      isPassed = matchedCount >= Math.ceil(originalWords.length * 0.85) && charSimilarity >= 0.75 && calculatedScore >= 80 && recitedWords.length >= Math.ceil(originalWords.length * 0.75);
    }

    if (isPassed) {
      const finalScore = Math.max(calculatedScore, 90);
      setTestResult({
        status: 'correct',
        score: finalScore,
        message: 'ماشاء اللہ! آپ نے بالکل درست پڑھا ہے۔ بارک اللہ!',
        wordMatches
      });
      playFeedbackChime('success');
      speakUrduFeedback('ماشاء اللہ! آپ نے بالکل درست پڑھا ہے۔');
    } else {
      setTestResult({
        status: 'incorrect',
        score: Math.min(calculatedScore, 45),
        message: 'آپ نے غلط پڑھا، دوبارہ قاری صاحب کی تلاوت سنیں اور درست کیجیے۔',
        wordMatches
      });
      playFeedbackChime('error');
      speakUrduFeedback('آپ نے غلط پڑھا، دوبارہ قاری صاحب کی تلاوت سنیں اور درست کیجیے۔');
    }
  };

  // Candidate surahs: If a Para is selected, only show surahs in that Para. If 'all', show all 114 surahs.
  const baseSurahs = React.useMemo(() => {
    if (selectedPara === 'all') {
      return ALL_114_SURAHS;
    }
    const para = ALL_30_PARAS.find((p) => p.number === selectedPara);
    if (!para) return ALL_114_SURAHS;
    return ALL_114_SURAHS.filter((s) => para.surahNumbers.includes(s.number));
  }, [selectedPara]);

  // Filtered Surahs based on Search & Makki/Madani filter
  const filteredSurahs = React.useMemo(() => {
    return baseSurahs.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        s.name.includes(searchQuery.trim()) ||
        s.englishName.toLowerCase().includes(q) ||
        s.urduName.includes(searchQuery.trim()) ||
        String(s.number) === searchQuery.trim() ||
        `سورۃ ${s.name}`.includes(searchQuery.trim());

      if (filterType === 'all') return matchesSearch;
      return matchesSearch && s.type === filterType;
    });
  }, [baseSurahs, searchQuery, filterType]);

  // Para coverage badge for the currently selected Surah
  const surahParaNumber = ALL_30_PARAS.find((p) => p.surahNumbers.includes(selectedSurah.number))?.number;

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-3 sm:p-6 select-none font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* 1. Header Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <BookOpen className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-amber-300 font-arabic">
                  قرآن مجید و ناظرہ (تمام ۳۰ پارے)
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[11px] font-bold">
                  مکمل ۳۰ پارے | 114 سورتیں
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ہر پارہ الگ الگ، آیت بہ آیت تلاوت، تکرار (Loop) اور پڑھ کر سنانے کا امتحانی فیچر
              </p>
            </div>
          </div>

          <button
            id="back-to-home-btn"
            onClick={() => {
              stopAudio();
              stopSpeechRecognition();
              onBack();
            }}
            className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 hover:text-amber-200 transition-all flex items-center gap-2 text-xs sm:text-sm font-black border border-amber-500/30 hover:border-amber-400 shrink-0 shadow-lg cursor-pointer"
          >
            <span>واپسی (Back)</span>
            <ArrowRight className="w-4 h-4 text-amber-400 rotate-180" />
          </button>
        </header>

        {/* 2. Top Qari Selection Carousel / Pills (شیخ السدیس اور دیگر قراء) */}
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>قاری صاحب کی آواز منتخب کریں (Select Qari):</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
              اعلیٰ کوالٹی آڈیو MP3
            </span>
          </div>

          {/* Qari Quick Choice Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {QARI_VOICES.map((q) => {
              const isActive = selectedQari === q.id;
              return (
                <button
                  key={q.id}
                  id={`qari-btn-${q.id}`}
                  onClick={() => handleQariChange(q.id)}
                  className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-500/30 scale-[1.02]'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="text-right truncate">
                    <div className="text-xs font-arabic font-bold truncate">
                      {q.qariNameUrdu}
                    </div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                      {q.name}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub Controls: Loop & Speed */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
            {/* Loop Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>تکرارِ آیت (Loop):</span>
              </span>
              <button
                onClick={() => setRepeatSingleAyah(!repeatSingleAyah)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  repeatSingleAyah
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {repeatSingleAyah ? 'آن (ایک ہی آیت دہرائیں)' : 'آف (مسلسل تلاوت)'}
              </button>
            </div>

            {/* Speed Controller */}
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-bold">رفتار (Speed):</span>
              <div className="flex items-center gap-1">
                {[0.75, 1.0, 1.25].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setPlaybackSpeed(spd);
                      if (audioRef.current) {
                        audioRef.current.playbackRate = spd;
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      playbackSpeed === spd
                        ? 'bg-amber-500 text-slate-950 font-black shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd === 0.75 ? '0.75x (آہستہ)' : spd === 1.0 ? '1.0x (عام)' : '1.25x'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. All 30 Paras Selector (قرآن مجید کے ۳۰ پارے علیحدہ علیحدہ) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/95 border border-amber-500/25 shadow-2xl space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Layers className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-sm sm:text-base font-black text-amber-300 font-arabic">
                پارہ منتخب کیجیے (Select Para 1 - 30):
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                ۳۰ پارے علیحدہ علیحدہ
              </span>
              <button
                onClick={() => handleSelectPara('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedPara === 'all'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                تمام ۱۱۴ سورتیں
              </button>
            </div>
          </div>

          {/* Horizontally scrollable 30 Paras Carousel / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 custom-scrollbar">
            {ALL_30_PARAS.map((para) => {
              const isSelected = selectedPara === para.number;
              return (
                <button
                  key={para.number}
                  id={`para-btn-${para.number}`}
                  onClick={() => handleSelectPara(para.number)}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 font-black shadow-lg shadow-amber-500/25 scale-[1.02]'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-sans font-black ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-900 border border-slate-700 text-slate-400'
                  }`}>
                    {para.number}
                  </span>
                  <div className="text-right">
                    <div className="text-xs font-arabic font-extrabold whitespace-nowrap">
                      {para.arabicName}
                    </div>
                    <div className={`text-[10px] whitespace-nowrap ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                      {para.urduName}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Para Info Highlight Banner */}
          {currentParaInfo && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-l from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex flex-col items-center justify-center text-amber-300 font-sans">
                  <span className="text-[9px] text-amber-400 font-semibold leading-none">JUZ</span>
                  <span className="text-sm font-black leading-tight">{currentParaInfo.number}</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-arabic font-black text-amber-200">
                      {currentParaInfo.arabicName}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">
                      ({currentParaInfo.urduName})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{currentParaInfo.romanName} • {currentParaInfo.surahNumbers.length} سورتیں • {currentParaInfo.totalAyahs} آیات</span>
                    <span className="text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      آغاز: سورۃ {ALL_114_SURAHS.find(s => s.number === currentParaInfo.startSurah)?.name || ''} (آیت نمبر {currentParaInfo.startAyah})
                    </span>
                  </div>
                </div>
              </div>

              {/* Prev / Next Para Switchers */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={handlePrevPara}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="پچھلا پارہ منتخب کریں"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>پچھلا پارہ</span>
                </button>
                <button
                  onClick={handleNextPara}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow"
                  title="اگلا پارہ منتخب کریں"
                >
                  <span>اگلا پارہ</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-950" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Surah Browser & Search */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="سورت تلاش کریں (نام یا نمبر)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-right"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {(['all', 'مكية', 'مدنية'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterType === type
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {type === 'all' 
                    ? `تمام سورتیں (${filteredSurahs.length})` 
                    : type === 'مكية' 
                    ? 'مکی (Makki)' 
                    : 'مدنی (Madani)'}
                </button>
              ))}
            </div>
          </div>

          {/* Surah Badges Scroller */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-48 overflow-y-auto pl-1 custom-scrollbar">
            {filteredSurahs.map((s) => {
              const isSelected = selectedSurah.number === s.number;
              const sRange = selectedPara !== 'all' ? getParaAyahRange(selectedPara, s.number) : null;
              return (
                <button
                  key={s.number}
                  id={`surah-select-${s.number}`}
                  onClick={() => handleSelectSurahMeta(s)}
                  className={`p-2.5 rounded-2xl border text-right cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                      : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-slate-950 text-amber-300 border border-amber-500/30">
                      #{s.number}
                    </span>
                    <div className="flex items-center gap-1">
                      {downloadedSurahsSet.has(s.number) && (
                        <span 
                          className="px-1.5 py-0.2 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 text-[8.5px] font-bold flex items-center gap-0.5"
                          title="مکمل آف لائن محفوظ شدہ"
                        >
                          <HardDrive className="w-2.5 h-2.5 text-emerald-400" />
                          <span>آف لائن</span>
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400">{s.type}</span>
                    </div>
                  </div>
                  <div className="text-sm font-arabic font-extrabold text-white my-1 truncate w-full text-right">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between w-full">
                    <span className="truncate">{s.urduName || s.englishName}</span>
                    <span className="text-amber-400 font-bold whitespace-nowrap">
                      {sRange ? `آیت ${sRange.startAyah}-${sRange.endAyah}` : `${s.totalAyahs} آیات`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Active Surah Reading and Recitation Container */}
        <section className="p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          
          {/* Active Surah Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="text-right">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-arabic font-black text-amber-300">
                  {selectedSurah.name}
                </h2>
                {surahParaNumber && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-600/60 text-emerald-300 text-xs font-bold font-arabic">
                    پارہ {surahParaNumber}: {ALL_30_PARAS[surahParaNumber - 1]?.arabicName || ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  {selectedSurah.urduName}
                </span>
                <span className="text-xs text-slate-300 font-bold">
                  {paraRange && !showFullSurah
                    ? `پارہ ${selectedPara} کی آیات: ${paraRange.startAyah} تا ${paraRange.endAyah} (کل ${paraRange.totalAyahsInPara} آیات)`
                    : `${selectedSurah.totalAyahs} آیات (مکمل سورۃ) • ${selectedSurah.type}`}
                </span>
                {paraRange && (
                  <button
                    onClick={() => setShowFullSurah(!showFullSurah)}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-700/60 text-xs font-bold cursor-pointer transition-all"
                  >
                    {showFullSurah ? `صرف پارہ ${selectedPara} کی آیات دیکھیں` : 'مکمل سورۃ دکھائیں'}
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Font Size, Play Surah & Offline Download Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Arabic Font Size Toggle */}
              <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-0.5">
                <button
                  onClick={() => setArabicFontSize('normal')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    arabicFontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title="عام سائز"
                >
                  A-
                </button>
                <button
                  onClick={() => setArabicFontSize('large')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    arabicFontSize === 'large' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title="بڑا سائز"
                >
                  A
                </button>
                <button
                  onClick={() => setArabicFontSize('xlarge')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    arabicFontSize === 'xlarge' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                  title="بہت بڑا سائز"
                >
                  A+
                </button>
              </div>

              {/* Offline Audio Caching Control */}
              {downloadProgress?.isDownloading ? (
                <div className="flex items-center gap-2 bg-slate-950/90 border border-emerald-500/70 px-3.5 py-2 rounded-2xl shadow-lg">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                  <div className="flex flex-col text-right">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400">
                        {downloadProgress.completed} / {downloadProgress.total} آیات
                      </span>
                      <span className="text-xs font-bold text-emerald-300">
                        ڈاؤن لوڈ: {downloadProgress.percent}%
                      </span>
                    </div>
                    <div className="w-28 sm:w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-200"
                        style={{ width: `${downloadProgress.percent}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleCancelDownload}
                    className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-bold cursor-pointer transition-all ml-1"
                    title="ڈاؤن لوڈ منسوخ کریں"
                  >
                    منسوخ
                  </button>
                </div>
              ) : isCurrentSurahDownloaded ? (
                <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-600/70 pl-1.5 pr-3 py-1.5 rounded-2xl shadow">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>آف لائن محفوظ ہے</span>
                  </div>
                  <button
                    onClick={handleDeleteSurahAudio}
                    className="p-1.5 rounded-xl hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-800 text-xs transition-all cursor-pointer"
                    title="آف لائن آڈیو کیشے خالی کریں"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartDownloadSurah}
                  className="px-3.5 py-2.5 rounded-2xl font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all bg-slate-950 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-700/60 hover:border-cyan-500"
                  title="مکمل سورۃ کو اپنے فون/ڈیوائس میں محفوظ کریں تاکہ بغیر انٹرنیٹ بھی سنی جا سکے"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>آف لائن ڈاؤن لوڈ</span>
                </button>
              )}

              {/* Quick Play Full Surah / Para Button */}
              <button
                onClick={handleTogglePlaySurah}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'تلاوت روکیے' : (paraRange && !showFullSurah ? `پارہ ${selectedPara} سنیں` : 'پوری سورۃ سنیں')}</span>
              </button>
            </div>
          </div>

          {/* Verses Loading Indicator */}
          {isLoadingVerses && (
            <div className="py-12 text-center space-y-3 bg-slate-950/60 rounded-3xl border border-amber-500/20">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
              <p className="text-sm font-arabic font-bold text-amber-300">
                آیاتِ مبارکہ اور تلاوت لوڈ ہو رہی ہیں...
              </p>
              <p className="text-xs text-slate-400">
                پہلی بار انٹرنیٹ سے حاصل ہو کر خود بخود محفوظ ہو جاتی ہیں
              </p>
            </div>
          )}

          {/* Bismillah */}
          {!isLoadingVerses && hasBismillahForDisplay && (
            <div
              className={`text-center py-4 px-4 rounded-2xl border transition-all ${
                isBismillahPlaying
                  ? 'bg-amber-950/70 border-amber-400 shadow-lg ring-2 ring-amber-400/40 scale-[1.01]'
                  : 'bg-slate-950/80 border-slate-800'
              }`}
            >
              <p className={`text-2xl sm:text-3xl font-arabic font-bold ${
                isBismillahPlaying ? 'text-amber-300' : 'text-emerald-300'
              }`}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              {isBismillahPlaying && (
                <span className="text-[11px] text-amber-400 font-bold mt-1 inline-flex items-center gap-1 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" /> تسمیہ کی تلاوت جاری ہے...
                </span>
              )}
            </div>
          )}

          {/* Para Start Indicator Banner when starting mid-Surah */}
          {!isLoadingVerses && paraRange && !showFullSurah && displayedAyahs.length > 0 && displayedAyahs[0].number !== 1 && currentParaInfo && (
            <div className="text-center py-3.5 px-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-slate-950 via-amber-950/25 to-slate-950 shadow-inner">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-bold font-arabic">
                  {currentParaInfo.urduName} ({currentParaInfo.arabicName})
                </span>
                <span className="text-xs text-amber-200 font-bold">
                  یہ پارہ آیت نمبر {paraRange.startAyah} سے شروع ہوتا ہے
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                سورۃ {selectedSurah.name} • آیت {paraRange.startAyah} تا {paraRange.endAyah} (کل {displayedAyahs.length} آیات)
              </p>
            </div>
          )}

          {/* Ayahs List - Correct Authentic Flow */}
          {!isLoadingVerses && (
          <div className="space-y-4">
            {displayedAyahs.map((ayah, idx) => {
              const isThisAyahPlaying = isPlaying && currentPlayingAyahIndex === idx;
              const isTestingThisAyah = testingAyahIndex === idx;

              return (
                <div
                  key={ayah.number}
                  id={`ayah-card-${ayah.number}`}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    isThisAyahPlaying
                      ? 'bg-gradient-to-l from-slate-950 via-slate-900 to-amber-950/40 border-amber-400 shadow-xl ring-2 ring-amber-500/50'
                      : isTestingThisAyah
                      ? 'bg-slate-950/90 border-cyan-500 ring-2 ring-cyan-500/40'
                      : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Top Action Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/70 pb-2.5">
                    {/* Right: Ayah Number Badge */}
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-bold font-sans">
                        {ayah.number}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">
                        آیت نمبر {ayah.number}
                      </span>
                    </div>

                    {/* Left: Play, Prev/Next & Recite Test Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {/* Prev Ayah Quick Action */}
                      <button
                        onClick={() => playAyahByIndex(idx - 1)}
                        disabled={idx === 0}
                        className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-25 transition-all"
                        title="پچھلی آیت سنیں"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">پچھلی</span>
                      </button>

                      {/* Play Ayah Audio */}
                      <button
                        id={`play-ayah-${ayah.number}`}
                        onClick={() => {
                          if (isThisAyahPlaying) {
                            stopAudio();
                          } else {
                            playAyahByIndex(idx);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          isThisAyahPlaying
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {isThisAyahPlaying ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>روکیے</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>آیت سنیں</span>
                          </>
                        )}
                      </button>

                      {/* Next Ayah Quick Action */}
                      <button
                        onClick={() => playAyahByIndex(idx + 1)}
                        disabled={idx >= displayedAyahs.length - 1}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-25 transition-all"
                        title="اگلی آیت سنیں"
                      >
                        <span>اگلی آیت</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      {/* Voice Recitation Test Button */}
                      <button
                        id={`test-recite-btn-${ayah.number}`}
                        onClick={() => {
                          if (isTestingThisAyah && isListening) {
                            stopSpeechRecognition();
                          } else {
                            startRecitationTest(idx);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border ${
                          isTestingThisAyah && isListening
                            ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/40'
                            : isTestingThisAyah
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                            : 'bg-emerald-950/90 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                        }`}
                      >
                        {isTestingThisAyah && isListening ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>سن رہا ہے...</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5" />
                            <span>🎙️ پڑھ کر سنائیں</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 5. Authentic Quranic Arabic Text (100% Correct RTL Flow) */}
                  <div className="text-right py-2 space-y-2">
                    <p 
                      dir="rtl"
                      className={`font-arabic font-extrabold text-amber-100 tracking-normal text-right select-text cursor-pointer hover:text-white transition-colors ${
                        arabicFontSize === 'normal'
                          ? 'text-xl sm:text-2xl md:text-3xl leading-[2.1]'
                          : arabicFontSize === 'xlarge'
                          ? 'text-3xl sm:text-4xl md:text-5xl leading-[2.6]'
                          : 'text-2xl sm:text-3xl md:text-4xl leading-[2.3]'
                      }`}
                      onClick={() => playAyahByIndex(idx)}
                      title="مکمل آیت کی تلاوت سننے کے لیے کلک کریں"
                    >
                      {ayah.text}
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-300 text-xs font-sans font-bold mr-2 align-middle">
                        ﴿{ayah.number}﴾
                      </span>
                    </p>

                    {/* Urdu Translation */}
                    {ayah.translationUrdu && (
                      <p className="text-xs sm:text-sm text-slate-300 font-medium text-right leading-relaxed pt-1">
                        {ayah.translationUrdu}
                      </p>
                    )}
                  </div>

                  {/* Recitation Test Feedback Panel */}
                  {isTestingThisAyah && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className={`p-3.5 rounded-2xl border mt-2 space-y-2.5 ${
                          testResult.status === 'correct'
                            ? 'bg-emerald-950/90 border-emerald-500 shadow-xl'
                            : testResult.status === 'incorrect'
                            ? 'bg-rose-950/90 border-rose-500 shadow-xl'
                            : 'bg-cyan-950/70 border-cyan-500/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            {testResult.status === 'correct' && (
                              <div className="flex items-center gap-1.5 text-emerald-300 font-black text-xs sm:text-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>ماشاء اللہ! بالکل درست تلاوت فرمائی</span>
                              </div>
                            )}
                            {testResult.status === 'incorrect' && (
                              <div className="flex items-center gap-1.5 text-rose-300 font-black text-xs sm:text-sm">
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                                <span>تلاوت میں غلطی ہوئی، دوبارہ سن کر درست کیجیے</span>
                              </div>
                            )}
                            {testResult.status === 'waiting' && (
                              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs">
                                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                                <span>مائیکروفون آن ہے، تلاوت فرمائیے...</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {testResult.status === 'incorrect' && (
                              <button
                                onClick={() => playAyahByIndex(idx)}
                                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1 shadow cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>قاری صاحب کو سنیں</span>
                              </button>
                            )}
                            <button
                              onClick={() => startRecitationTest(idx)}
                              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-slate-700"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>دوبارہ سنائیں</span>
                            </button>
                          </div>
                        </div>

                        {/* Transcript & Word-by-Word Validation */}
                        {recognizedTranscript && (
                          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-right space-y-2">
                            <span className="text-[10px] text-slate-400 block">آپ نے جو پڑھا:</span>
                            <p className="text-base font-arabic font-bold text-amber-200">
                              "{recognizedTranscript}"
                            </p>
                            
                            {/* Word Match Badges */}
                            {testResult.wordMatches.length > 0 && (
                              <div className="pt-2 border-t border-slate-800/80">
                                <span className="text-[10px] text-slate-400 block mb-1">الفاظ کی تفتیش:</span>
                                <div className="flex flex-wrap gap-1.5 justify-end" dir="rtl">
                                  {testResult.wordMatches.map((wm, wIdx) => (
                                    <span
                                      key={wIdx}
                                      className={`px-2 py-0.5 rounded-lg text-xs font-arabic font-bold border ${
                                        wm.matched
                                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                                          : 'bg-rose-950/80 text-rose-300 border-rose-700/80'
                                      }`}
                                    >
                                      {wm.word} {wm.matched ? '✓' : '✗'}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-slate-200 text-right font-medium">
                          {testResult.message}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Sticky Bottom Player */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-800 sticky bottom-2 shadow-2xl z-20">
            {/* 3-Button Media Controls: Single Clean Row on all devices */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full sm:w-auto sm:flex sm:items-center">
              {/* Previous Ayah */}
              <button
                onClick={handlePrevAyah}
                disabled={currentPlayingAyahIndex === null || currentPlayingAyahIndex === 0}
                className="px-2 sm:px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-bold"
                title="پچھلی آیت"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
                <span className="truncate">پچھلی آیت</span>
              </button>

              {/* Play/Pause Surah */}
              <button
                id="main-play-surah-btn"
                onClick={handleTogglePlaySurah}
                className={`px-2 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 shrink-0" /> : <Play className="w-4 h-4 fill-current shrink-0" />}
                <span className="truncate">
                  {isPlaying ? 'روکیے' : 'تلاوت سنیں'}
                </span>
              </button>

              {/* Next Ayah */}
              <button
                onClick={handleNextAyah}
                disabled={currentPlayingAyahIndex === null || currentPlayingAyahIndex >= displayedAyahs.length - 1}
                className="px-2 sm:px-3 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 hover:text-cyan-200 disabled:opacity-30 transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-bold shadow-md shadow-cyan-950/40"
                title="اگلی آیت"
              >
                <span className="truncate">اگلی آیت</span>
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </button>
            </div>

            <div className="text-xs text-slate-400 text-center sm:text-left font-arabic w-full sm:w-auto">
              {isPlaying ? (
                <div className="flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-2 justify-center sm:justify-end flex-wrap">
                    {isPlayingOfflineAudio ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/60 font-bold flex items-center gap-1 shadow-sm">
                        <HardDrive className="w-3 h-3 text-emerald-400" />
                        <span>آف لائن آڈیو</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-bold flex items-center gap-1 shadow-sm">
                        <Wifi className="w-3 h-3 text-cyan-400" />
                        <span>آن لائن سٹریمنگ</span>
                      </span>
                    )}

                    <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
                      {isBismillahPlaying 
                        ? 'تسمیہ کی تلاوت جاری ہے...' 
                        : `آیت ${currentPlayingAyahIndex !== null ? (displayedAyahs[currentPlayingAyahIndex]?.number ?? 1) : 1} کی تلاوت (خودکار تکرار 🔁)`}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-medium">
                    (تلاوت: {getSurahReciterDetail(selectedSurah.number, selectedQari).urdu})
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-xs">
                  قاری: {getSurahReciterDetail(selectedSurah.number, selectedQari).urdu}
                </span>
              )}
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
