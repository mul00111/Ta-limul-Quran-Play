// Robust WebRTC Configuration for 2-Device Video Communication across internet & mobile networks
export const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.voiparound.com' },
    { urls: 'stun:stun.voipstunt.com' }
  ],
  iceCandidatePoolSize: 10
};

export interface SignalingMessage {
  type: 'join_room' | 'room_joined' | 'user_joined' | 'user_left' | 'webrtc_signal' | 'board_sync' | 'leave_room' | 'ping' | 'pong';
  roomId?: string;
  userId?: string;
  userName?: string;
  userRole?: 'ustad' | 'student';
  senderId?: string;
  targetUserId?: string;
  payload?: any;
  existingUsers?: Array<{ userId: string; userName: string; userRole: string }>;
  totalUsers?: number;
}
