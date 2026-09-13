import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  RefreshCw, 
  Lock, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  WifiOff, 
  Copy, 
  Check, 
  LayoutGrid,
  BookOpen,
  Volume1,
  UserCheck,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { MadrasaStudent, MadrasaTeacher } from '../../data/madrasaData';
import { playPhoneticLetterAudio } from '../../utils/qariAudioService';
import { RTC_CONFIG, SignalingMessage } from '../../utils/webrtcService';

interface SecureLiveClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: MadrasaStudent;
  teacher: MadrasaTeacher;
  classNameTitle?: string;
  myRole?: 'ustad' | 'student';
}

export const SecureLiveClassroomModal: React.FC<SecureLiveClassroomModalProps> = ({
  isOpen,
  onClose,
  student,
  teacher,
  classNameTitle = 'آن لائن لائیو ون ٹو ون درجہ (1-on-1 Private Live Class)',
  myRole = 'ustad'
}) => {
  // Video and Audio Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const iceCandidatesQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const addedCandidatesSetRef = useRef<Set<string>>(new Set());
  const reconnectTimeoutRef = useRef<any>(null);
  const pingIntervalRef = useRef<any>(null);

  // States
  const [activeRole, setActiveRole] = useState<'ustad' | 'student'>(myRole);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'WAITING_FOR_PEER' | 'PEER_CONNECTED'>('DISCONNECTED');
  const [callDuration, setCallDuration] = useState(0);
  const [activeBoardMode, setActiveBoardMode] = useState<'split_videos' | 'qaida' | 'quran'>('split_videos');
  const [highlightedLetter, setHighlightedLetter] = useState<string | null>(null);
  const [selectedSurahIdx, setSelectedSurahIdx] = useState(0);
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [connectedPeerName, setConnectedPeerName] = useState<string | null>(null);
  const [isAudioAutoplayBlocked, setIsAudioAutoplayBlocked] = useState(false);
  const [isPeerMuted, setIsPeerMuted] = useState(false);

  // Room ID based on Teacher & Student ID for secure 1-on-1 isolation
  const roomId = `class_${teacher.id}_${student.id}`;
  const myUserId = useRef(`user_${activeRole}_${Math.random().toString(36).substring(2, 8)}`).current;
  const myUserName = activeRole === 'ustad' ? teacher.name : student.name;

  // Qaida & Surah Data
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
    },
    {
      title: 'سورۃ الفلق',
      verses: [
        'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ',
        'قُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ',
        'مِنْ شَرِّ مَا خَلَقَۙ',
        'وَ مِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ',
        'وَ مِنْ شَرِّ النَّفّٰثٰتِ فِی الْعُقَدِۙ',
        'وَ مِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ'
      ]
    },
    {
      title: 'سورۃ الناس',
      verses: [
        'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِیْمِ',
        'قُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ',
        'مَلِكِ النَّاسِۙ',
        'اِلٰهِ النَّاسِۙ',
        'مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۙ',
        'الَّذِیْ یُوَسْوِسُ فِیْ صُدُوْرِ النَّاسِۙ',
        'مِنَ الْجِنَّةِ وَ النَّاسِ'
      ]
    }
  ];

  // Helper to send message to Signaling Server
  const sendSignaling = (msg: SignalingMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  // Broadcast Quran / Qaida board changes in real time
  const broadcastBoardChange = (boardData: any) => {
    sendSignaling({
      type: 'board_sync',
      roomId,
      userId: myUserId,
      payload: boardData
    });
  };

  // 1. Initialize Real Media Stream
  const initLocalMedia = async (targetFacing = facingMode) => {
    try {
      setErrorMessage(null);

      // Stop previous tracks cleanly
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: isVideoOn ? {
          facingMode: { ideal: targetFacing },
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 24, max: 30 }
        } : false,
        audio: isAudioOn ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setCameraPermissionGranted(true);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
        localVideoRef.current.play().catch(e => console.log('Local preview play:', e));
      }

      // If peer connection exists, add or replace tracks
      if (peerConnectionRef.current) {
        const senders = peerConnectionRef.current.getSenders();
        stream.getTracks().forEach(track => {
          const sender = senders.find(s => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track).catch(e => console.warn('replaceTrack error:', e));
          } else {
            peerConnectionRef.current?.addTrack(track, stream);
          }
        });
      }

      return stream;
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      setCameraPermissionGranted(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('کیمرہ یا مائیکروفون کی اجازت نہیں ملی۔ براہ کرم اینڈرائیڈ / براؤزر سیٹنگز سے کیمرہ اور مائیکروفون فعال کریں۔');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('اس ڈیوائس پر کیمرہ یا مائیکروفون دستیاب نہیں ہے۔');
      } else {
        setErrorMessage('میڈیا شروع کرنے میں مسئلہ پیش آیا۔ براہ کرم پیج ریفریش کریں۔');
      }
      return null;
    }
  };

  // Helper to drain queued ICE candidates safely once remoteDescription is set
  const drainIceCandidatesQueue = async (pc: RTCPeerConnection) => {
    if (iceCandidatesQueueRef.current.length > 0) {
      console.log(`[WebRTC] Draining ${iceCandidatesQueueRef.current.length} queued ICE candidates`);
      const queue = [...iceCandidatesQueueRef.current];
      iceCandidatesQueueRef.current = [];

      for (const candidate of queue) {
        const candStr = JSON.stringify(candidate);
        if (!addedCandidatesSetRef.current.has(candStr)) {
          addedCandidatesSetRef.current.add(candStr);
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (e) {
            console.warn('[WebRTC] Error adding drained candidate:', e);
          }
        }
      }
    }
  };

  // 2. Setup RTCPeerConnection with candidate buffering, track handler, and auto-recovery
  const createPeerConnection = (remoteUserId?: string) => {
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.close();
      } catch (e) {
        console.warn('Error closing previous pc:', e);
      }
    }

    iceCandidatesQueueRef.current = [];
    addedCandidatesSetRef.current.clear();
    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerConnectionRef.current = pc;

    // Add local tracks to new peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle ICE Candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate) {
        sendSignaling({
          type: 'webrtc_signal',
          roomId,
          userId: myUserId,
          targetUserId: remoteUserId,
          payload: { candidate: event.candidate }
        });
      }
    };

    // Handle Remote Stream Tracks
    pc.ontrack = (event) => {
      console.log('[WebRTC] Received remote track:', event.track.kind);
      
      if (!remoteStreamRef.current) {
        remoteStreamRef.current = new MediaStream();
      }
      
      // Avoid duplicate tracks
      if (!remoteStreamRef.current.getTracks().some(t => t.id === event.track.id)) {
        remoteStreamRef.current.addTrack(event.track);
      }

      if (remoteVideoRef.current) {
        if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }
        
        remoteVideoRef.current.play().then(() => {
          setIsAudioAutoplayBlocked(false);
        }).catch(e => {
          console.log('[WebRTC] Autoplay waiting for user gesture:', e);
          setIsAudioAutoplayBlocked(true);
        });
      }
      setConnectionStatus('PEER_CONNECTED');
    };

    // Connection state monitoring
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('PEER_CONNECTED');
        setIsAudioAutoplayBlocked(false);
      } else if (pc.connectionState === 'disconnected') {
        setConnectionStatus('WAITING_FOR_PEER');
      } else if (pc.connectionState === 'failed') {
        console.log('[WebRTC] Connection failed, attempting ICE restart...');
        setConnectionStatus('CONNECTING');
        if (remoteUserId) {
          initiateCall(remoteUserId, true);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionStatus('PEER_CONNECTED');
      }
    };

    return pc;
  };

  // 3. Initiate WebRTC Call (Caller/Offer) with optional ICE restart
  const initiateCall = async (targetId?: string, iceRestart = false) => {
    try {
      const pc = createPeerConnection(targetId);
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        iceRestart
      });
      await pc.setLocalDescription(offer);

      sendSignaling({
        type: 'webrtc_signal',
        roomId,
        userId: myUserId,
        targetUserId: targetId,
        payload: { sdp: pc.localDescription }
      });
    } catch (err) {
      console.error('[WebRTC] Error creating offer:', err);
    }
  };

  // 4. Handle Received WebRTC Signal (Offer / Answer / Candidate)
  const handleWebRTCSignal = async (senderId: string, payload: any) => {
    try {
      let pc = peerConnectionRef.current;

      if (payload.sdp) {
        const sdp = new RTCSessionDescription(payload.sdp);

        if (sdp.type === 'offer') {
          console.log('[WebRTC] Received Offer from:', senderId);
          pc = createPeerConnection(senderId);
          await pc.setRemoteDescription(sdp);
          await drainIceCandidatesQueue(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          sendSignaling({
            type: 'webrtc_signal',
            roomId,
            userId: myUserId,
            targetUserId: senderId,
            payload: { sdp: pc.localDescription }
          });
        } else if (sdp.type === 'answer') {
          console.log('[WebRTC] Received Answer from:', senderId);
          if (pc && pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(sdp);
            await drainIceCandidatesQueue(pc);
          }
        }
      } else if (payload.candidate) {
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          const candStr = JSON.stringify(payload.candidate);
          if (!addedCandidatesSetRef.current.has(candStr)) {
            addedCandidatesSetRef.current.add(candStr);
            try {
              await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
            } catch (e) {
              console.warn('[WebRTC] Error adding immediate ICE candidate:', e);
            }
          }
        } else {
          // Buffer candidate until remote description is established
          iceCandidatesQueueRef.current.push(payload.candidate);
        }
      }
    } catch (err) {
      console.error('[WebRTC] Error handling signal:', err);
    }
  };

  // 5. Connect to WebSocket Signaling Server with Heartbeat & Auto-Reconnect
  const connectSignalingServer = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/classroom`;

    console.log('[Signaling] Connecting to:', wsUrl);
    setConnectionStatus('CONNECTING');

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('[Signaling] WebSocket connected to server.');
      setConnectionStatus('WAITING_FOR_PEER');

      // Join classroom room
      ws.send(JSON.stringify({
        type: 'join_room',
        roomId,
        userId: myUserId,
        userName: myUserName,
        userRole: activeRole
      }));

      // Periodic ping to keep carrier connection alive
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
        }
      }, 20000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'room_joined':
            if (data.existingUsers && data.existingUsers.length > 0) {
              const remotePeer = data.existingUsers[0];
              setConnectedPeerName(remotePeer.userName);
              initiateCall(remotePeer.userId);
            }
            break;

          case 'user_joined':
            setConnectedPeerName(data.userName);
            break;

          case 'webrtc_signal':
            handleWebRTCSignal(data.senderId, data.payload);
            break;

          case 'board_sync':
            if (data.payload) {
              if (data.payload.activeBoardMode !== undefined) setActiveBoardMode(data.payload.activeBoardMode);
              if (data.payload.highlightedLetter !== undefined) {
                setHighlightedLetter(data.payload.highlightedLetter);
                if (data.payload.highlightedLetter) {
                  playPhoneticLetterAudio(data.payload.highlightedLetter);
                }
              }
              if (data.payload.selectedSurahIdx !== undefined) setSelectedSurahIdx(data.payload.selectedSurahIdx);
              if (data.payload.selectedVerseIdx !== undefined) setSelectedVerseIdx(data.payload.selectedVerseIdx);
            }
            break;

          case 'user_left':
            setConnectedPeerName(null);
            setConnectionStatus('WAITING_FOR_PEER');
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = null;
            }
            remoteStreamRef.current = null;
            break;

          case 'error':
            setErrorMessage(data.message || 'کنکشن کی خرابی پیش آئی');
            break;
        }
      } catch (err) {
        console.error('[Signaling] Message parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.warn('[Signaling] WebSocket Error:', err);
    };

    ws.onclose = () => {
      console.log('[Signaling] WebSocket Closed. Reconnecting in 3s...');
      clearInterval(pingIntervalRef.current);
      setConnectionStatus('DISCONNECTED');
      if (isOpen) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSignalingServer();
        }, 3000);
      }
    };
  }, [roomId, myUserId, myUserName, activeRole, isOpen]);

  // Main lifecycle
  useEffect(() => {
    if (isOpen) {
      initLocalMedia('user').then(() => {
        connectSignalingServer();
      });

      const timer = setInterval(() => {
        setCallDuration(c => c + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(pingIntervalRef.current);
        clearTimeout(reconnectTimeoutRef.current);
        if (socketRef.current) {
          try {
            socketRef.current.send(JSON.stringify({ type: 'leave_room', roomId, userId: myUserId }));
            socketRef.current.close();
          } catch (e) {}
        }
        if (peerConnectionRef.current) {
          try {
            peerConnectionRef.current.close();
          } catch (e) {}
          peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(t => t.stop());
          localStreamRef.current = null;
        }
        remoteStreamRef.current = null;
      };
    }
  }, [isOpen, connectSignalingServer]);

  // Production-Safe Front/Rear Camera Switching via RTCRtpSender.replaceTrack()
  const toggleCameraFacingMode = async () => {
    if (isSwitchingCamera || !isVideoOn) return;
    setIsSwitchingCamera(true);

    const nextMode = facingMode === 'user' ? 'environment' : 'user';

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: nextMode },
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 24, max: 30 }
        }
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      if (newVideoTrack) {
        // 1. Replace track in ongoing RTCPeerConnection without reconnecting
        if (peerConnectionRef.current) {
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(s => s.track?.kind === 'video');
          if (videoSender) {
            await videoSender.replaceTrack(newVideoTrack);
          }
        }

        // 2. Stop old video track
        if (localStreamRef.current) {
          const oldVideoTracks = localStreamRef.current.getVideoTracks();
          oldVideoTracks.forEach(t => t.stop());
          localStreamRef.current.removeTrack(oldVideoTracks[0]);
          localStreamRef.current.addTrack(newVideoTrack);
        }

        // 3. Update local preview
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }

        setFacingMode(nextMode);
      }
    } catch (err: any) {
      console.warn('Camera switch error:', err);
      setErrorMessage('اس ڈیوائس پر کیمرہ سوئچ نہیں ہو سکا۔');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  // Toggle Video Track
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const vTrack = localStreamRef.current.getVideoTracks()[0];
      if (vTrack) {
        vTrack.enabled = !vTrack.enabled;
        setIsVideoOn(vTrack.enabled);
      } else {
        setIsVideoOn(true);
        initLocalMedia();
      }
    } else {
      setIsVideoOn(true);
      initLocalMedia();
    }
  };

  // Toggle Audio Track
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const aTrack = localStreamRef.current.getAudioTracks()[0];
      if (aTrack) {
        aTrack.enabled = !aTrack.enabled;
        setIsAudioOn(aTrack.enabled);
      }
    } else {
      setIsAudioOn(prev => !prev);
    }
  };

  // Toggle Speaker
  const toggleSpeaker = () => {
    setIsSpeakerOn(prev => !prev);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = isSpeakerOn;
    }
  };

  // Tap to resume / unlock audio on Android Chrome
  const handleUnlockAudio = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current.play().then(() => {
        setIsAudioAutoplayBlocked(false);
      }).catch(e => console.log('Unlock audio issue:', e));
    }
  };

  // Board interaction handlers with instant real-time broadcast
  const handleLetterClick = (letter: string) => {
    setHighlightedLetter(letter);
    playPhoneticLetterAudio(letter);
    broadcastBoardChange({ highlightedLetter: letter });
  };

  const handleBoardModeChange = (mode: 'split_videos' | 'qaida' | 'quran') => {
    setActiveBoardMode(mode);
    broadcastBoardChange({ activeBoardMode: mode });
  };

  const handleSurahChange = (idx: number) => {
    setSelectedSurahIdx(idx);
    setSelectedVerseIdx(null);
    broadcastBoardChange({ selectedSurahIdx: idx, selectedVerseIdx: null });
  };

  const handleVerseClick = (vIdx: number) => {
    setSelectedVerseIdx(vIdx);
    broadcastBoardChange({ selectedVerseIdx: vIdx });
  };

  // Copy shareable class link
  const copyClassLink = () => {
    const url = `${window.location.origin}?classRoom=${roomId}&student=${student.id}&teacher=${teacher.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 overflow-hidden text-right font-urdu" dir="rtl">
      
      {/* Main Classroom Window */}
      <div className={`bg-zinc-950 border border-zinc-800 rounded-2xl sm:rounded-3xl w-full flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'h-full max-w-none' : 'max-w-6xl max-h-[98vh] h-[96vh]'
      }`}>
        
        {/* Top Header Bar */}
        <div className="p-2.5 sm:p-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-2 text-xs shrink-0">
          
          {/* Left: Info & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-lg sm:text-xl shadow-lg shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-xs sm:text-base font-black text-white">{classNameTitle}</h3>
                
                {/* Connection Status Badge */}
                {connectionStatus === 'PEER_CONNECTED' ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    لائیو آن لائن (Connected)
                  </span>
                ) : connectionStatus === 'WAITING_FOR_PEER' ? (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    دوسرے فون کا انتظار ہے...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] bg-zinc-700/40 text-zinc-400 px-2 py-0.5 rounded-full font-bold">
                    منسلک ہو رہا ہے...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-[10px] sm:text-[11px] text-zinc-400">
                  استاد: <strong className="text-emerald-300">{teacher.name}</strong> | طالب علم: <strong className="text-white">{student.name}</strong>
                </p>
                {/* Switch Device Role */}
                <div className="flex items-center gap-1 bg-zinc-800 p-0.5 rounded-lg border border-zinc-700 text-[9px] sm:text-[10px]">
                  <button
                    onClick={() => setActiveRole('ustad')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${activeRole === 'ustad' ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400'}`}
                  >
                    استاد
                  </button>
                  <button
                    onClick={() => setActiveRole('student')}
                    className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${activeRole === 'student' ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400'}`}
                  >
                    طالب علم
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions & Timer */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Share / Copy Class Link */}
            <button
              onClick={copyClassLink}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] sm:text-[11px] border border-zinc-700 transition-all cursor-pointer"
              title="دوسرے موبائل پر کلاس روم جوائن کروانے کے لیے لنک کاپی کریں"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'لنک کاپی ہو گیا!' : 'دوسرا فون لنک'}</span>
            </button>

            {/* Duration */}
            <div className="px-2.5 py-1 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 font-mono font-bold text-[11px] sm:text-xs">
              ⏱️ {formatDuration(callDuration)}
            </div>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 sm:p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer"
              title="فل اسکرین"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Audio Autoplay Warning Banner for Mobile Devices */}
        {isAudioAutoplayBlocked && (
          <div 
            onClick={handleUnlockAudio}
            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-all animate-bounce"
          >
            <div className="flex items-center gap-2">
              <Volume1 className="w-4 h-4 animate-pulse" />
              <span>براہ راست آواز سننے کے لیے یہاں اسکرین پر ٹیپ کریں۔ (Tap to enable Live Audio)</span>
            </div>
            <span className="bg-black/30 px-2 py-0.5 rounded font-bold">آواز فعال کریں</span>
          </div>
        )}

        {/* Mode Selector Tabs (Mobile & Desktop Optimized) */}
        <div className="px-3 pt-2 pb-1 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleBoardModeChange('split_videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeBoardMode === 'split_videos'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>دونوں کیمرے (Split Video)</span>
            </button>
            <button
              onClick={() => handleBoardModeChange('qaida')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeBoardMode === 'qaida'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>نورانی قاعدہ سبق</span>
            </button>
            <button
              onClick={() => handleBoardModeChange('quran')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeBoardMode === 'quran'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                  : 'text-zinc-400 hover:text-white bg-zinc-900'
              }`}
            >
              <span>📜 تلاوت قرآن</span>
            </button>
          </div>

          <span className="text-[10px] sm:text-[11px] text-zinc-400 hidden sm:inline-block">
            کلاس روم کوڈ: <strong className="text-amber-300 font-mono">{roomId}</strong>
          </span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-2 sm:p-4 overflow-hidden">
          
          {/* MODE 1: SPLIT VIDEOS (Large Both Ustad & Student Video Feeds on 2 Devices) */}
          {activeBoardMode === 'split_videos' && (
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 overflow-y-auto">
              
              {/* 1. Remote Device Video Feed (Opposite Peer) */}
              <div 
                onClick={handleUnlockAudio}
                className="relative bg-zinc-900 border-2 border-emerald-500/60 rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center shadow-xl group min-h-[220px]"
              >
                {/* Real Remote WebRTC Video Track */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Waiting State */}
                {connectionStatus !== 'PEER_CONNECTED' && (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 text-white p-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-800/40 text-emerald-300 border-2 border-emerald-400 flex items-center justify-center text-3xl shadow-lg animate-pulse">
                      {activeRole === 'ustad' ? '👦' : '👳‍♂️'}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm sm:text-base font-black text-white">
                        {activeRole === 'ustad' ? student.name : teacher.name}
                      </h4>
                      <p className="text-xs text-amber-400 font-bold mt-1">
                        دوسرے موبائل فون کا انتظار ہے... (دوسرے فون پر بھی یہ کلاس روم کھولیں)
                      </p>
                    </div>
                  </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{activeRole === 'ustad' ? `طالب علم (${student.name})` : `استاد محترم (${teacher.name})`}</span>
                </div>

                {/* Speaker indicator */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-1 rounded-lg text-[10px] text-emerald-400 border border-white/10">
                  <Volume2 className="w-3 h-3" />
                  <span>براہ راست 2 طرفہ آڈیو</span>
                </div>
              </div>

              {/* 2. My Local Device Video Feed */}
              <div className="relative bg-zinc-900 border-2 border-blue-500/60 rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center shadow-xl min-h-[220px]">
                
                {/* Real Local Video Stream */}
                {isVideoOn && cameraPermissionGranted ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-zinc-950 text-white p-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-800/40 text-blue-300 border-2 border-blue-400 flex items-center justify-center text-3xl shadow-lg">
                      {activeRole === 'ustad' ? '👳‍♂️' : '👦'}
                    </div>
                    <div className="mt-3">
                      <h4 className="text-sm sm:text-base font-black text-white">{myUserName} (آپ کا کیمرہ)</h4>
                    </div>
                    {!isVideoOn && (
                      <span className="text-xs bg-rose-950/80 text-rose-300 px-3 py-1 rounded-full mt-2 border border-rose-800">
                        کیمرہ آف ہے
                      </span>
                    )}
                  </div>
                )}

                {/* Overlay Badge */}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-xl text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10 shadow">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>آپ کا کیمرہ ({activeRole === 'ustad' ? 'استاد' : 'طالب علم'})</span>
                </div>

                {/* Quick Flip camera button */}
                {isVideoOn && (
                  <button
                    onClick={toggleCameraFacingMode}
                    disabled={isSwitchingCamera}
                    className={`absolute top-2 left-2 p-2 rounded-xl bg-black/80 hover:bg-black text-white text-[11px] flex items-center gap-1.5 border border-white/15 cursor-pointer shadow ${isSwitchingCamera ? 'opacity-50' : ''}`}
                    title="کیمرہ سوئچ کریں (سامنے / پیچھے)"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSwitchingCamera ? 'animate-spin' : ''}`} />
                    <span>{facingMode === 'user' ? 'فرنٹ کیمرہ' : 'بیک کیمرہ'}</span>
                  </button>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="absolute inset-x-2 bottom-2 bg-rose-950/95 border border-rose-700 text-rose-200 p-2.5 rounded-xl text-xs text-center backdrop-blur-sm shadow-xl">
                    {errorMessage}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* MODE 2: NOORANI QAIDA TEACHING BOARD WITH PIP VIDEOS */}
          {activeBoardMode === 'qaida' && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
              
              {/* Qaida Board (8 Cols) */}
              <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 sm:p-4 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="text-center mb-3">
                    <h4 className="text-sm font-black text-emerald-400">تختی نمبر ۱: حروفِ مفردات (تجوید و تلفظ)</h4>
                    <p className="text-[11px] text-zinc-400">دونوں جانب حرف پر کلک کرنے سے آواز بیک وقت سنکرونائز ہو گی</p>
                  </div>

                  <div className="grid grid-cols-7 gap-2 max-w-xl mx-auto" dir="rtl">
                    {qaidaLetters.map((letter) => {
                      const isSelected = highlightedLetter === letter;

                      return (
                        <button
                          key={letter}
                          onClick={() => handleLetterClick(letter)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-xl font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-110 shadow-lg shadow-emerald-900/60 ring-2 ring-white animate-pulse'
                              : 'bg-zinc-950 hover:bg-zinc-800 text-emerald-300 border border-zinc-800 hover:border-emerald-500/50'
                          }`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>مخارج کی مشق کے لیے کسی بھی حرف پر ٹیپ کریں۔</span>
                  </span>
                  <span className="text-emerald-400 font-bold">● ریئل ٹائم لائیو بورڈ</span>
                </div>
              </div>

              {/* Side Stacked Videos (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-2 justify-between">
                {/* Remote Video Frame */}
                <div className="relative bg-zinc-900 border border-emerald-500/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    {activeRole === 'ustad' ? 'طالب علم' : 'استاد'}
                  </div>
                </div>

                {/* Local Video Frame */}
                <div className="relative bg-zinc-900 border border-blue-500/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                  <div className="absolute top-1.5 right-1.5 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    آپ کا کیمرہ
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MODE 3: QURAN SURAH RECITATION BOARD */}
          {activeBoardMode === 'quran' && (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
              
              {/* Quran Board (8 Cols) */}
              <div className="lg:col-span-8 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-3 sm:p-4 overflow-y-auto flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {quranSurahs.map((s, idx) => (
                      <button
                        key={s.title}
                        onClick={() => handleSurahChange(idx)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          selectedSurahIdx === idx 
                            ? 'bg-blue-600 text-white shadow' 
                            : 'bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>

                  <div className="max-w-xl mx-auto space-y-2 text-center" dir="rtl">
                    <h3 className="text-base font-black text-amber-400">
                      {quranSurahs[selectedSurahIdx].title}
                    </h3>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {quranSurahs[selectedSurahIdx].verses.map((verse, idx) => (
                        <p 
                          key={idx}
                          onClick={() => handleVerseClick(idx)}
                          className={`text-base sm:text-lg font-serif p-2 rounded-xl cursor-pointer transition-all ${
                            selectedVerseIdx === idx
                              ? 'bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold shadow-lg scale-102'
                              : 'text-white hover:text-emerald-300 hover:bg-zinc-950'
                          }`}
                          title="آیت منتخب کریں"
                        >
                          {verse}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between mt-2">
                  <span>استاد اور طالب علم دونوں آیت سن کر تکرار کر سکتے ہیں۔</span>
                  <span className="text-emerald-400 font-bold">● تلاوت سنکرونائزڈ</span>
                </div>
              </div>

              {/* Side Stacked Videos (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-2 justify-between">
                {/* Remote Video Frame */}
                <div className="relative bg-zinc-900 border border-emerald-500/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 right-1.5 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    {activeRole === 'ustad' ? 'طالب علم' : 'استاد'}
                  </div>
                </div>

                {/* Local Video Frame */}
                <div className="relative bg-zinc-900 border border-blue-500/50 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                  <video ref={localVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} />
                  <div className="absolute top-1.5 right-1.5 bg-black/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">
                    آپ کا کیمرہ
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Control Bar */}
        <div className="p-2.5 sm:p-4 bg-zinc-900/95 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 sm:gap-3 shrink-0">
          
          {/* Left Media Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Mic Toggle */}
            <button
              onClick={toggleAudio}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isAudioOn
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
              }`}
              title={isAudioOn ? 'مائیکروفون بند کریں' : 'مائیکروفون کھولیں'}
            >
              {isAudioOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
              <span>{isAudioOn ? 'مائیک آن' : 'مائیک میوٹ'}</span>
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isVideoOn
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
              }`}
              title={isVideoOn ? 'کیمرہ بند کریں' : 'کیمرہ کھولیں'}
            >
              {isVideoOn ? <Video className="w-4 h-4 text-blue-400" /> : <VideoOff className="w-4 h-4" />}
              <span>{isVideoOn ? 'کیمرہ آن' : 'کیمرہ آف'}</span>
            </button>

            {/* Front / Back Camera Switcher */}
            <button
              onClick={toggleCameraFacingMode}
              disabled={!isVideoOn || isSwitchingCamera}
              className={`min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isVideoOn 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700' 
                  : 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
              } ${isSwitchingCamera ? 'opacity-50' : ''}`}
              title="فرنٹ / بیک کیمرہ تبدیل کریں"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSwitchingCamera ? 'animate-spin' : ''}`} />
              <span>کیمرہ سوئچ ({facingMode === 'user' ? 'فرنٹ' : 'بیک'})</span>
            </button>

            {/* Speaker Control */}
            <button
              onClick={toggleSpeaker}
              className={`min-h-[44px] p-2.5 sm:px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isSpeakerOn
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  : 'bg-rose-950/70 border-rose-800 text-rose-300'
              }`}
              title={isSpeakerOn ? 'اسپیکر بند کریں' : 'اسپیکر کھولیں'}
            >
              {isSpeakerOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeakerOn ? 'اسپیکر آن' : 'میوٹ'}</span>
            </button>

          </div>

          {/* Right Action: End Class */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="min-h-[44px] px-5 sm:px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black rounded-2xl flex items-center gap-1.5 shadow-xl shadow-rose-900/50 cursor-pointer transition-all hover:scale-105"
            >
              <PhoneOff className="w-4 h-4" />
              <span>کلاس ختم کریں (End Class)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
