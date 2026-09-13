import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { RTC_CONFIG } from '../utils/webrtcService';

export interface LiveRoomParticipant {
  id: string;
  name: string;
  role: 'ustadh' | 'student';
  avatar?: string;
  country?: string;
  isCamOn: boolean;
  isMicOn: boolean;
  handRaised: boolean;
  joinedAt: number;
}

export interface LiveRoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  role: 'ustadh' | 'student';
  text: string;
  time: string;
  timestamp: number;
}

export const liveClassroomSignaling = {
  // Join or Create a Live Classroom Room
  async joinRoom(
    roomId: string, 
    user: LiveRoomParticipant,
    onParticipantsUpdate: (participants: LiveRoomParticipant[]) => void,
    onNewMessage: (msg: LiveRoomMessage) => void
  ) {
    const cleanRoomId = roomId.trim().toUpperCase() || 'TQ-MADRASA-1';
    const roomRef = doc(db, 'madrasa_live_rooms', cleanRoomId);
    const participantsRef = collection(roomRef, 'participants');
    const messagesRef = collection(roomRef, 'messages');

    // Create room document if doesn't exist
    await setDoc(roomRef, {
      roomId: cleanRoomId,
      lastActive: serverTimestamp(),
      hostId: user.role === 'ustadh' ? user.id : undefined
    }, { merge: true });

    // Add this participant
    const userDocRef = doc(participantsRef, user.id);
    await setDoc(userDocRef, {
      ...user,
      lastPing: Date.now()
    });

    // Listen to participants
    const unsubParticipants = onSnapshot(participantsRef, (snapshot) => {
      const list: LiveRoomParticipant[] = [];
      snapshot.forEach((snap) => {
        list.push(snap.data() as LiveRoomParticipant);
      });
      onParticipantsUpdate(list);
    });

    // Listen to chat messages
    const unsubMessages = onSnapshot(messagesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          onNewMessage(change.doc.data() as LiveRoomMessage);
        }
      });
    });

    return {
      roomId: cleanRoomId,
      cleanup: async () => {
        unsubParticipants();
        unsubMessages();
        try {
          await deleteDoc(userDocRef);
        } catch (e) {
          console.warn('Participant cleanup notice:', e);
        }
      }
    };
  },

  // Send a live chat message
  async sendMessage(roomId: string, message: Omit<LiveRoomMessage, 'timestamp'>) {
    const cleanRoomId = roomId.trim().toUpperCase() || 'TQ-MADRASA-1';
    const messagesRef = collection(db, 'madrasa_live_rooms', cleanRoomId, 'messages');
    await addDoc(messagesRef, {
      ...message,
      timestamp: Date.now()
    });
  },

  // WebRTC Signaling: Create an Offer (Host / Caller)
  async createOffer(roomId: string, pc: RTCPeerConnection, callerId: string) {
    const cleanRoomId = roomId.trim().toUpperCase() || 'TQ-MADRASA-1';
    const roomRef = doc(db, 'madrasa_live_rooms', cleanRoomId);
    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(callerCandidatesCollection, event.candidate.toJSON());
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
      callerId
    };

    await setDoc(roomRef, { offer }, { merge: true });

    // Listen for Remote Answer
    const unsub = onSnapshot(roomRef, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // Listen for Callee ICE Candidates
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');
    const unsubCandidates = onSnapshot(calleeCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate).catch(e => console.warn('ICE add error:', e));
        }
      });
    });

    return () => {
      unsub();
      unsubCandidates();
    };
  },

  // WebRTC Signaling: Answer an Offer (Joiner / Callee)
  async answerOffer(roomId: string, pc: RTCPeerConnection, calleeId: string) {
    const cleanRoomId = roomId.trim().toUpperCase() || 'TQ-MADRASA-1';
    const roomRef = doc(db, 'madrasa_live_rooms', cleanRoomId);
    const calleeCandidatesCollection = collection(roomRef, 'calleeCandidates');

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        addDoc(calleeCandidatesCollection, event.candidate.toJSON());
      }
    };

    const roomSnapshot = await getDoc(roomRef);
    const roomData = roomSnapshot.data();

    if (roomData?.offer) {
      await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
        calleeId
      };

      await setDoc(roomRef, { answer }, { merge: true });
    }

    // Listen for Caller ICE Candidates
    const callerCandidatesCollection = collection(roomRef, 'callerCandidates');
    const unsub = onSnapshot(callerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate).catch(e => console.warn('ICE add error:', e));
        }
      });
    });

    return () => unsub();
  }
};
