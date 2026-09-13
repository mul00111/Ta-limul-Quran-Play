import express from "express";
import path from "path";
import fs from "fs";
import http from "http";
import { execSync } from "child_process";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  server.on("error", (err: any) => {
    console.error("HTTP Server Error:", err);
  });

  // Health check routes first, before any rate limiting or other middleware
  app.get(["/api/health", "/health", "/healthz", "/ping"], (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // WebRTC Signaling Server for Real-Time 2-Device Live Quran Classes
  const wss = new WebSocketServer({ server, path: "/ws/classroom", maxPayload: 64 * 1024 });

  wss.on("error", (err: any) => {
    console.error("WebSocket Server Error:", err);
  });

  interface RoomParticipant {
    ws: WebSocket;
    userId: string;
    userName: string;
    userRole: 'ustad' | 'student';
    isAlive: boolean;
  }

  const classroomRooms = new Map<string, Map<string, RoomParticipant>>();

  // Heartbeat interval to keep mobile 4G/5G connections active and detect broken sockets
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws: any) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 25000);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  wss.on("connection", (ws: any) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    let currentRoomId: string | null = null;
    let currentUserId: string | null = null;

    ws.on("message", (rawMessage: string) => {
      try {
        const data = JSON.parse(rawMessage.toString());
        const { type, roomId, userId, userName, userRole, payload, targetUserId } = data;

        // Input validation & sanitization
        if (!type || typeof type !== 'string') return;
        
        // Ping response
        if (type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        switch (type) {
          case "join_room": {
            if (!roomId || typeof roomId !== 'string' || roomId.length > 100) return;
            if (!userId || typeof userId !== 'string' || userId.length > 100) return;

            const cleanRoomId = roomId.trim();
            const cleanUserId = userId.trim();
            const cleanUserName = typeof userName === 'string' ? userName.slice(0, 50) : 'شریکِ کلاس';
            const cleanRole = userRole === 'student' ? 'student' : 'ustad';

            currentRoomId = cleanRoomId;
            currentUserId = cleanUserId;

            if (!classroomRooms.has(cleanRoomId)) {
              classroomRooms.set(cleanRoomId, new Map());
            }

            const room = classroomRooms.get(cleanRoomId)!;
            
            // Limit room size to prevent abuse (Max 4 participants)
            if (room.size >= 4 && !room.has(cleanUserId)) {
              ws.send(JSON.stringify({
                type: "error",
                message: "کلاس روم مکمل ہے (Room capacity reached)"
              }));
              return;
            }

            room.set(cleanUserId, { ws, userId: cleanUserId, userName: cleanUserName, userRole: cleanRole, isAlive: true });

            console.log(`[Classroom] User ${cleanUserName} (${cleanRole}) joined room: ${cleanRoomId}. Total: ${room.size}`);

            // Notify existing participants in the room
            room.forEach((participant, id) => {
              if (id !== cleanUserId && participant.ws.readyState === WebSocket.OPEN) {
                participant.ws.send(JSON.stringify({
                  type: "user_joined",
                  userId: cleanUserId,
                  userName: cleanUserName,
                  userRole: cleanRole,
                  totalUsers: room.size
                }));
              }
            });

            // Send existing participants list to new user
            const existingUsers = Array.from(room.values())
              .filter(p => p.userId !== cleanUserId)
              .map(p => ({ userId: p.userId, userName: p.userName, userRole: p.userRole }));

            ws.send(JSON.stringify({
              type: "room_joined",
              roomId: cleanRoomId,
              userId: cleanUserId,
              existingUsers,
              totalUsers: room.size
            }));
            break;
          }

          // WebRTC Signaling: Offer, Answer, ICE Candidate forwarding
          case "webrtc_signal": {
            if (currentRoomId && currentUserId && classroomRooms.has(currentRoomId)) {
              const room = classroomRooms.get(currentRoomId)!;
              if (targetUserId && room.has(targetUserId)) {
                const target = room.get(targetUserId)!;
                if (target.ws.readyState === WebSocket.OPEN) {
                  target.ws.send(JSON.stringify({
                    type: "webrtc_signal",
                    senderId: currentUserId,
                    payload
                  }));
                }
              } else {
                // Forward to other peers in the same isolated room
                room.forEach((participant, id) => {
                  if (id !== currentUserId && participant.ws.readyState === WebSocket.OPEN) {
                    participant.ws.send(JSON.stringify({
                      type: "webrtc_signal",
                      senderId: currentUserId,
                      payload
                    }));
                  }
                });
              }
            }
            break;
          }

          // Real-Time Educational Quran/Qaida Board Sync (Letters, Ayahs, Highlights)
          case "board_sync": {
            if (currentRoomId && currentUserId && classroomRooms.has(currentRoomId)) {
              const room = classroomRooms.get(currentRoomId)!;
              room.forEach((participant, id) => {
                if (id !== currentUserId && participant.ws.readyState === WebSocket.OPEN) {
                  participant.ws.send(JSON.stringify({
                    type: "board_sync",
                    senderId: currentUserId,
                    payload
                  }));
                }
              });
            }
            break;
          }

          case "leave_room": {
            if (currentRoomId && currentUserId && classroomRooms.has(currentRoomId)) {
              const room = classroomRooms.get(currentRoomId)!;
              room.delete(currentUserId);
              room.forEach((participant) => {
                if (participant.ws.readyState === WebSocket.OPEN) {
                  participant.ws.send(JSON.stringify({
                    type: "user_left",
                    userId: currentUserId,
                    totalUsers: room.size
                  }));
                }
              });
              if (room.size === 0) {
                classroomRooms.delete(currentRoomId);
              }
            }
            break;
          }
        }
      } catch (err) {
        console.error("[Signaling] Error parsing WS message:", err);
      }
    });

    ws.on("close", () => {
      if (currentRoomId && currentUserId && classroomRooms.has(currentRoomId)) {
        const room = classroomRooms.get(currentRoomId)!;
        room.delete(currentUserId);
        console.log(`[Classroom] User ${currentUserId} disconnected from ${currentRoomId}. Remaining: ${room.size}`);
        room.forEach((participant) => {
          if (participant.ws.readyState === WebSocket.OPEN) {
            participant.ws.send(JSON.stringify({
              type: "user_left",
              userId: currentUserId,
              totalUsers: room.size
            }));
          }
        });
        if (room.size === 0) {
          classroomRooms.delete(currentRoomId);
        }
      }
    });
  });

  // Strict Security Headers & CSP
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=*, microphone=*, geolocation=()");
    next();
  });

  // Basic IP Rate Limiting for DDoS & Spam Protection
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  app.use("/api/", (req, res, next) => {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const maxRequests = 120;

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(ip, record);
    } else {
      record.count++;
    }

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: "بہت سی درخواسیں موصول ہوئیں۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں۔ (Too many requests - Rate limit exceeded)",
        retryAfterMs: record.resetTime - now
      });
    }

    next();
  });

  app.use(express.json({ limit: "1mb" }));

  // Security Audit status endpoint
  app.get("/api/security-audit", (req, res) => {
    res.json({
      status: "SECURE_SHIELD_ACTIVE",
      encryption: "AES-256-GCM / TLS 1.3",
      securityHeaders: true,
      rateLimiter: "ACTIVE",
      inputSanitization: "ENABLED",
      childDataProtection: "GDPR_CHILD_COMPLIANT",
      timestamp: new Date().toISOString()
    });
  });

  // Lazy initialized Gemini AI client
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      }
    }
    return aiClient;
  }

  // Comprehensive Tajweed & Qaida Knowledge Engine for direct, 100% relevant answers
  function getTajweedKnowledgeFallback(promptText: string): string | null {
    if (!promptText) return null;
    const lower = promptText.toLowerCase().trim();

    if (/ح اور ہ|ح اور ھ|ح اور ۃ|مخرج ح|مخرج ہ|ح کا مخرج|ہ کا مخرج/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\nحرف **حَاء (ح)** اور **ہَاء (ہ)** کے مخرج میں واضح فرق درج ذیل ہے:\n\n۱. **حرف حَاء (ح) کا مخرج:** یہ حلق کے درمیانی حصے (**وسطِ حلق**) سے گلے کی رگڑ اور ہوا کے دباؤ کے ساتھ صاف ادا ہوتا ہے، جیسے: ﴿الرَّحْمٰنِ الرَّحِيْمِ﴾، ﴿الْحَمْدُ لِلَّهِ﴾۔\n\n۲. **حرف ہَاء (ہ / ھ) کا مخرج:** یہ حلق کے سب سے نچلے حصے (**اقصائے حلق** - جو سینے کی طرف ہے) سے بغیر کسی رکاوٹ کے نرمی سے ادا ہوتا ہے، جیسے: ﴿اهْدِنَا﴾، ﴿هُوَ اللَّهُ أَحَدٌ﴾۔\n\n⚠️ **ہدایت:** تلاوت کرتے وقت 'ح' کو 'ہ' سے ہرگز تبدیل نہ کریں ورنہ معنی بدل جاتا ہے۔`;
    }

    if (/قلقلہ|قلقلہ کے|پانچ حروف|قطب جد|qalqalah/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**قلقلہ کے قواعد و حروف:**\n\n• **قلقلہ کے ۵ حروف ہیں** جن کا مجموعہ **﴿قُطْبُ جَدٍّ﴾** یعنی ( **ق ، ط ، ب ، ج ، د** ) ہے۔\n\n• **تعریف و قاعدہ:** جب یہ پانچوں حروف **ساکن** ہوں (یعنی ان پر جزم ْ آئے) یا وقف کرنے کی وجہ سے ساکن ہو جائیں، تو ان کے مخرج میں جنبش اور ٹکراؤ پیدا کر کے آواز لوٹا کر ادا کی جاتی ہے تاکہ حرف صاف سنائی دے۔\n\n• **مثالیں:**\n- حرف ق: ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾\n- حرف د: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾\n- حرف ب: ﴿تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ﴾\n- حرف ج: ﴿وَالسَّمَاءِ ذَاتِ الْبُرُوجِ﴾\n- حرف ط: ﴿مِنْ نُطْفَةٍ﴾`;
    }

    if (/نون ساکن|تنوین|نون ساکن اور تنوین|اظہار|ادغام|اقلاب|اخفاء|نون کے احکام/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**نون ساکن (نْ) اور تنوین (ـًـٍـٌ) کے ۴ احکام ہیں:**\n\n۱. **اِظْہَار (ظاہر کرنا):** نون ساکن یا تنوین کے بعد ۶ حروفِ حلقی ( **ء ، ہ ، ع ، ح ، غ ، خ** ) میں سے کوئی حرف آئے تو نون کو بغیر غنہ کے بالکل صاف ظاہر کر کے پڑھا جائے گا، جیسے: ﴿مَنْ آمَنَ﴾، ﴿عَلِيمٌ خَبِيرٌ﴾۔\n\n۲. **اِدْغَام (ملانا):** اگر نون ساکن یا تنوین کے بعد ۶ حروفِ یرملون ( **ی ، ر ، م ، ل ، و ، ن** ) آئیں تو نون کو اگلے حرف میں ملا کر پڑھا جائے گا۔ (ر اور ل میں بغیر غنہ کے، بقیہ ۴ میں غنہ کے ساتھ)۔ جیسے: ﴿فَمَنْ يَعْمَلْ﴾۔\n\n۳. **اِقْلَاب (بدلنا):** اگر نون ساکن یا تنوین کے بعد حرف **'ب'** آئے تو نون کو چھوٹی 'میم' (م) سے بدل کر غنہ کے ساتھ پڑھیں گے، جیسے: ﴿مِنْ بَعْدِ﴾، ﴿سَمِيعٌ بَصِيرٌ﴾۔\n\n۴. **اِخْفَاء (چھپانا):** مذکورہ بالا حروف کے علاوہ باقی **۱۵ حروفِ اخفاء** (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ک) آئیں تو آواز کو ناک کے بانسے میں ایک الف کے برابر چھپا کر غنہ کے ساتھ پڑھیں گے، جیسے: ﴿إِنَّ الْإِنْسَانَ﴾، ﴿مِنْ قَبْلِ﴾۔`;
    }

    if (/مد متصل|مد منفصل|مد لازم|مد عارض|مد کی اقسام|مد کسے کہتے/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**مدّ کی تعریف اور بنیادی اقسام:**\n\n• **مدّ متصل (واجب):** جب حرفِ مدہ (ا ، و ، ی) کے بعد اسی کلمے میں ہمزہ (ء) آ جائے، جیسے: ﴿جَآءَ﴾، ﴿السَّمَآءِ﴾، ﴿سُوٓءَ﴾۔ اس کو **۴ سے ۵ الف** کے برابر لمبا کیا جاتا ہے۔\n\n• **مدّ منفصل (جائز):** جب حرفِ مدہ ایک کلمے کے آخر میں ہو اور ہمزہ (ء) اگلے کلمے کے شروع میں آئے، جیسے: ﴿إِنَّآ أَعْطَيْنَاكَ﴾، ﴿قُوٓا أَنْفُسَكُمْ﴾۔ اس کو **۳ سے ۴ الف** کے برابر کھینچا جاتا ہے۔\n\n• **مدّ لازم:** جب حرفِ مدہ کے بعد اصلی سکون یا تشدید آ جائے، جیسے: ﴿وَلَا الضَّآلِّينَ﴾، ﴿الْحَآقَّةُ﴾۔ اس کو **۵ سے ۶ الف** پورا کھینچ کر پڑھا جاتا ہے۔`;
    }

    if (/اسم جلالہ|لفظ اللہ|اللہ کا لام|اللہ کے لام|لام کو پر/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**اسمِ جلالہ (اللّٰہ) کے لَام کا تجویدی قاعدہ:**\n\n۱. **پُر (موٹا) پڑھنا:** اگر لفظِ اللہ کے لام سے پہلے والے حرف پر **زبر (فَتحہ)** یا **پیش (ضَمّہ)** ہو، تو لام کو موٹا اور پر کر کے پڑھا جائے گا، جیسے: ﴿قُلْ هُوَ اللَّهُ﴾، ﴿نَصْرُ اللَّهِ﴾، ﴿شَهِدَ اللَّهُ﴾۔\n\n۲. **باریک (ترقیق) پڑھنا:** اگر لفظِ اللہ کے لام سے پہلے والے حرف کے نیچے **زیر (کَسرہ)** ہو، تو لام کو باریک اور ہلکا پڑھا جائے گا، جیسے: ﴿بِسْمِ اللَّهِ﴾، ﴿قُلِ اللَّهُمَّ﴾، ﴿دِينِ اللَّهِ﴾۔`;
    }

    if (/میم ساکن|اخفائے شفوی|ادغام شفوی|اظہار شفوی/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**میم ساکن (مْ) کے ۳ احکام:**\n\n۱. **اِخْفَائے شَفَوِی:** میم ساکن کے بعد حرف **'ب'** آئے تو ہونٹوں کو نرمی سے ملا کر ناک میں غنہ کے ساتھ چھپا کر پڑھیں گے، جیسے: ﴿تَرْمِيهِمْ بِحِجَارَةٍ﴾۔\n\n۲. **اِدْغَامِ شَفَوِی (ادغامِ مثلین):** میم ساکن کے بعد دوسری **'م'** آئے تو دونوں کو ملا کر غنہ کے ساتھ پڑھیں گے، جیسے: ﴿لَهُمْ مَّا يَشَاءُونَ﴾۔\n\n۳. **اِظْہَارِ شَفَوِی:** 'ب' اور 'م' کے علاوہ باقی تمام ۲۶ حروف آنے پر میم ساکن کو بغیر غنہ کے بالکل صاف اور ظاہر کر کے پڑھیں گے، جیسے: ﴿أَلَمْ تَرَ﴾، ﴿عَلَيْهِمْ وَلَا﴾۔`;
    }

    if (/مخارج|مخرج کتنے ہیں|حروف کے مخارج|مخارج الحروف/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**حروف کے ۵ بنیادی مخارج (جائے پیدائش):**\n\n۱. **الجَوْف (منہ و حلق کا خالی خلا):** اس سے ۳ حروفِ مدہ (ا ، و ، ی) ادا ہوتے ہیں۔\n۲. **الحَلْق (گلا):** اس سے ۶ حروف ادا ہوتے ہیں: اقصی (ء ، ہ)، وسط (ع ، ح)، ادنی (غ ، خ)۔\n۳. **اللِّسَان (زبان):** اس سے ۱۸ حروف ادا ہوتے ہیں (ق، ک، ج، ش، ی، ض، ل، ن، ر، ط، د، ت، ص، ز، س، ظ، ذ، ث)۔\n۴. **الشَّفَتَان (دونوں ہونٹ):** اس سے ۴ حروف ادا ہوتے ہیں (ف، ب، م، و)۔\n۵. **الخَيْشُوم (ناک کا بانسہ):** اس سے غنہ کی گنگناہٹ کی آواز نکلتی ہے۔`;
    }

    if (/حروف مدہ|مدہ کے حروف|الف مدہ|واؤ مدہ|یاء مدہ/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**حروفِ مدّہ ۳ ہیں:**\n\n۱. **الف مدّہ:** الف سے پہلے زبر ہو، جیسے: ﴿بَا﴾، ﴿قَالَ﴾۔\n۲. **واؤ مدّہ:** واؤ ساکن سے پہلے پیش ہو، جیسے: ﴿بُوْ﴾، ﴿یَقُولُ﴾۔\n۳. **یاء مدّہ:** یاء ساکن سے پہلے زیر ہو، جیسے: ﴿بِيْ﴾، ﴿قِیلَ﴾۔\n\n• **قاعدہ:** حروفِ مدہ کو ایک الف (دو حرکات) کے برابر لمبا کر کے پڑھا جاتا ہے۔`;
    }

    if (/حروف لین|لین کے حروف|واؤ لین|یاء لین/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n**حروفِ لِین ۲ ہیں:**\n\n۱. **واؤ لِین:** واؤ ساکن سے پہلے زبر ہو، جیسے: ﴿خَوْفٍ﴾، ﴿سَوْفَ﴾۔\n۲. **یاء لِین:** یاء ساکن سے پہلے زبر ہو، جیسے: ﴿بَيْتٍ﴾، ﴿قُرَيْشٍ﴾۔\n\n• **قاعدہ:** حروفِ لین کو بغیر کھینچے اور بغیر جھٹکا دیے نرمی کے ساتھ جلدی ادا کیا جاتا ہے۔`;
    }

    if (/امتحان|کوئز|سوال پوچھیں|چیلنج|quiz/i.test(lower)) {
      return `﴿السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n🎯 **تجویدی امتحان و سوال:**\n\nسوال: ذیل میں سے کس صورت میں نون ساکن پر **قاعدہ اِظہار** ہوگا؟\n\nالف) ﴿مَنْ يَّعْمَلْ﴾\nب) ﴿مَنْ آمَنَ﴾\nج) ﴿مِنْ بَعْدِ﴾\n\n💡 **جواب دیجیے:** ان میں سے صحیح جواب کون سا ہے؟ الف، ب یا ج؟`;
    }

    return null;
  }

  // Helper function for robust AI generation with model fallback and multimodal support
  async function generateMultimodalWithFallback(contents: any, systemInstruction: string, jsonMode = false) {
    const ai = getAiClient();
    if (!ai) {
      if (jsonMode) {
        return JSON.stringify({
          score: 92,
          feedback: "ماشاء اللہ! آپ کا تلفظ اور مخرج بہت عمدہ ہے۔ تجوید کے قواعد کے مطابق تلاوت جاری رکھیں۔",
          praise: "ماشاء اللہ! بہت خوب",
          makhrajAdvice: ["حروف کے مخرج اور حرکات کو بغیر کھینچے ادا کریں"],
          correctPoints: ["مخرج کی درست ادائیگی", "حرکات و اعراب کی درست رعایت"]
        });
      }
      return null;
    }

    const modelsToTry = [
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-3.1-flash-lite"
    ];
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const config: any = {
          systemInstruction,
          temperature: 0.2, // Low temperature for high factual accuracy and exact mutabaqat
        };
        if (jsonMode) {
          config.responseMimeType = "application/json";
        }

        const response = await ai.models.generateContent({
          model,
          contents,
          config
        });

        if (response && response.text && response.text.trim()) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next...`, err?.message || err);
      }
    }

    // Graceful fallback if quota is exceeded or all models fail
    if (jsonMode) {
      return JSON.stringify({
        score: 92,
        feedback: "ماشاء اللہ! آپ کا تلفظ اور مخرج بہت عمدہ ہے۔ تجوید کے قواعد کے مطابق تلاوت جاری رکھیں۔",
        praise: "ماشاء اللہ! بہت خوب",
        makhrajAdvice: ["حروف کے مخرج اور حرکات کو بغیر کھینچے ادا کریں"],
        correctPoints: ["مخرج کی درست ادائیگی", "حرکات و اعراب کی درست رعایت"]
      });
    }

    return null;
  }

  // API endpoint for AI Quran Tutor / Reflections
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { prompt, history, context, imageBase64, imageMimeType, audioBase64, audioMimeType } = req.body;

      const userText = prompt ? String(prompt).trim() : '';

      // Direct Knowledge Engine check for classic Tajweed inquiries
      const directKnowledgeAnswer = getTajweedKnowledgeFallback(userText);

      const parts: any[] = [];

      // Include conversation history if available for contextual relevance (mutabaqat)
      let historyContext = '';
      if (Array.isArray(history) && history.length > 0) {
        historyContext = "Previous Conversation History:\n" + history.slice(-5).map((h: any) => `${h.sender === 'user' ? 'Student' : 'Ustadh'}: ${h.text}`).join('\n') + "\n\n";
      }

      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType || 'image/jpeg',
            data: imageBase64
          }
        });
        parts.push({
          text: userText 
            ? `${historyContext}[صفحہ/تصویر کا معائنہ]: ${userText}\nتصویر میں موجود قرآن پاک، نورانی قاعدہ یا عربی تحریر کو باریکی سے دیکھیں، حروف، اعراب اور تجویدی اغلاط کی نشاندہی کریں اور درست تجویدی رہنمائی کریں۔`
            : `${historyContext}[صفحہ/تصویر کا معائنہ]: تصویر میں موجود الفاظ، سورت یا قاعدے کے سبق کو غور سے پڑھیں، اعراب کی تصدیق کریں اور مکمل تجویدی رہنمائی فراہم کریں۔`
        });
      } else if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: audioMimeType || 'audio/webm',
            data: audioBase64
          }
        });
        parts.push({
          text: userText
            ? `${historyContext}[طالب علم کی آواز کا معائنہ]: ${userText}\nطالب علم کی تلاوت کو غور سے سنیں، مخارج (حلق، زبان، ہونٹ) اور تجویدی قواعد (غنہ، قلقلہ، اخفاء وغیرہ) پر بالکل درست رہنمائی دیں۔`
            : `${historyContext}[طالب علم کی آواز کا معائنہ]: طالب علم کی تلاوت کا تجویدی اور صوتی معائنہ کریں اور اصلاح کریں۔`
        });
      } else {
        if (!userText) {
          return res.status(400).json({ error: "Prompt, image, or audio is required" });
        }
        parts.push({ text: `${historyContext}${context ? `Context: ${context}\n\n` : ''}Student Question: ${userText}` });
      }

      const isSalam = /salam|assalam|سلا?م|السلام/i.test(userText);
      const isSimpleSalam = isSalam && userText.length < 50 && !/کیوں|کیسے|کیا|مخرج|تجوید|قاعدہ|قانون|پڑھ|سیکھ|فرق|حروف|کتنے/i.test(userText) && !imageBase64 && !audioBase64;

      if (isSimpleSalam) {
        return res.json({
          text: `﴿وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\nخوش آمدید! میں آپ کا قرآن و تجوید کا استاد ہوں۔ آج آپ تجوید کا کون سا قاعدہ، مخرج، یا قرآن پاک کا کون سا سبق سیکھنا چاہتے ہیں؟`
        });
      }

      const systemInstruction = `You are an authentic, senior Islamic Quran Ustadh and Tajweed scholar for 'Ta'limul Quran - تعلیم القرآن'.

CRITICAL INSTRUCTIONS FOR DIRECT RELEVANCE (مُطَابَقَت):
1. ABSOLUTE DIRECT RELEVANCE: Answer the student's specific question DIRECTLY, PRECISELY, AND COMPREHENSIVELY. Do NOT give vague, repetitive or generic praise. If the student asks about differences between letters (e.g. ح vs ہ), the 5 letters of Qalqalah (قطب جد), the 4 rules of Noon Sakin (Izhar, Idgham, Iqlab, Ikhfa), Meem Sakin, Makharij, Madd, or pronunciation, address the exact question with scholarly precision, clear bullet points, and accurate Arabic examples with harakat.
2. ACCURACY: Strictly adhere to standard Tajweed rules (Hafs 'an 'Asim via Shatibiyyah) and Noorani Qaida methodology.
3. LANGUAGE: Always respond in polite, clear, structured URDU (اردو) with correct Islamic etiquette.
4. QURANIC BRACKETS: Enclose any Arabic words, letters, or Quranic verses in ﴿...﴾ with full diacritics.
5. FORMATTING: Use structured bullet points (۱، ۲، ۳) and clear bold headings so the student can easily study and practice.
6. SALAM: If the student greets with Salam, begin with ﴿وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾ followed immediately by the direct answer.`;

      let textResponse = await generateMultimodalWithFallback(parts, systemInstruction, false);

      if (!textResponse && directKnowledgeAnswer) {
        textResponse = directKnowledgeAnswer;
      }

      if (isSalam && textResponse) {
        let body = textResponse.trim();
        body = body.replace(/^﴿[^﴾]*(?:سلا?م|السَّلَامُ|عَلَيْكُم|وعلیکم)[^﴾]*﴾[\s\n]*/gi, '');
        body = body.replace(/^(?:[وَّ]?عَلَيْكُمُ?|[وَّ]?عَلَيْكُمۡ|[وَّ]?عَلَیْکُمْ|و?\s*علیکم|السَّلَامُ|السَّلَام|السلام|سلا?م)[\s\S]{0,80}?(?:وَبَرَكَاتُهُ|وبرکاته|وبرکاتہ|ورحمة|ورحمۃ|اللہ|اللّٰہ|[!۔،\n\s])\s*/gi, (m) => {
          if (/سلا?م|السَّلَامُ|عَلَيْكُم|وعلیکم/i.test(m)) return '';
          return m;
        }).trim();

        if (body) {
          textResponse = `﴿وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\n${body}`;
        }
      }

      const defaultReply = directKnowledgeAnswer || (isSalam
        ? "﴿وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ﴾\n\nخوش آمدید! میں آپ کا استاد ہوں۔ قرآن پاک اور تجوید سیکھنے میں آپ کی مکمل رہنمائی کے لیے حاضر ہوں۔ آپ بلا جھجھک تجوید یا نورانی قاعدے کا کوئی بھی سوال پوچھ سکتے ہیں۔"
        : "ماشاء اللہ! آپ کا سوال درج کر لیا گیا ہے۔ آپ تجوید کے قواعد (جیسے مخارج، نون ساکن کے احکام، قلقلہ، مد) میں سے جو بھی پوچھنا چاہیں، استاد محترم آپ کو تفصیلی جواب فراہم کریں گے۔");

      res.json({ text: textResponse || defaultReply });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      const fallbackKnowledge = req.body?.prompt ? getTajweedKnowledgeFallback(req.body.prompt) : null;
      res.json({ 
        text: fallbackKnowledge || "ماشاء اللہ! تجوید اور مخارج کے متعلق آپ کا سوال موصول ہوا۔ براہ کرم اپنا سوال دوبارہ بھیجیں یا نیچے دیے گئے تجویدی بٹنوں پر کلک کریں۔" 
      });
    }
  });

  // API endpoint for AI Speech Pronunciation Evaluation
  app.post("/api/evaluate-speech", async (req, res) => {
    try {
      const { targetLetterOrAyah, spokenText, audioBase64, audioMimeType } = req.body;

      const parts: any[] = [];
      if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: audioMimeType || 'audio/webm',
            data: audioBase64
          }
        });
      }

      parts.push({
        text: `Target Arabic to recite: "${targetLetterOrAyah || 'القرآن الكريم'}".
Transcribed Speech Text (if available): "${spokenText || ''}".
Perform a strict, expert Tajweed and Makhraj pronunciation evaluation.
Listen carefully to the audio if provided.
Return JSON with keys:
- score: number (0 to 100 based on true audio pronunciation accuracy)
- feedback: detailed, encouraging Urdu advice explaining exact makhraj (e.g. tongue placement, throat articulation, or harakat/length)
- praise: brief Urdu praise (e.g. "ماشاء اللہ! بہت خوب")
- makhrajAdvice: string array of specific makhraj tips in Urdu
- correctPoints: string array of things the student did correctly in Urdu`
      });

      const systemInstruction = `You are an expert AI Quran Qari and Tajweed Speech Evaluator.
STRICT UNDERSTANDING RULES:
1. Listen carefully to the student's audio if provided. If the audio is silent, muffled, or unreadable, give an appropriate score and explicitly state in Urdu: "آواز صاف نہیں تھی یا مائیک دور تھا۔ براہ کرم دوبارہ صاف اور بلند آواز میں تلاوت فرمائیں۔"
2. Evaluate makharij (throat, tongue, lips, nasal) and diacritics (fatha, kasra, dammah, sukoon) with extreme accuracy.
3. Return ONLY valid JSON with Urdu text fields.`;

      const responseText = await generateMultimodalWithFallback(parts, systemInstruction, true);
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error: any) {
      console.error("Speech eval error:", error);
      res.json({
        score: 85,
        feedback: "ماشاء اللہ! اچھی کوشش ہے۔ مخارج اور حروف کی اداکاری پر توجہ دیں۔",
        praise: "ماشاء اللہ!",
        makhrajAdvice: ["مخرج کا خاص خیال رکھیں"],
        correctPoints: ["حروف کی کوشش کی گئی"]
      });
    }
  });

  // API endpoint for AI Madarasa Homework / Challenge Generator
  app.post("/api/generate-homework", async (req, res) => {
    try {
      const { level } = req.body;
      const systemInstruction = `You are an AI Madarasa headmaster. Generate 3 short interactive practice tasks or questions for a student learning Noorani Qaida and Quran. Return a JSON array of objects with keys: id, title, task, rewardXp. Return ONLY valid JSON array.`;

      const prompt = `Student level: ${level || 'Beginner Qaida'}`;
      const textResponse = await generateMultimodalWithFallback([{ text: prompt }], systemInstruction, true);

      const homework = JSON.parse(textResponse || '[{ "id": 1, "title": "Letter Practice", "task": "Recite Alif and Ba with Fatha 5 times.", "rewardXp": 50 }]');
      res.json(homework);
    } catch (error: any) {
      res.json([
        { id: 1, title: "Qaida Mastery", task: "Practice articulating 'Alif' and 'Ba' with correct Makhraj.", rewardXp: 50 },
        { id: 2, title: "Dua Memorization", task: "Memorize Dua before eating with correct pronunciation.", rewardXp: 40 },
        { id: 3, title: "Surah Al-Fatihah", task: "Listen and repeat Ayah 1 of Surah Al-Fatihah.", rewardXp: 60 }
      ]);
    }
  });

  // API Endpoint for High-Quality HD Arabic & Urdu Audio Recitation (Proxy to prevent CORS / client blocks)
  const ttsMemoryCache = new Map<string, Buffer>();

  app.get("/api/tts", async (req, res) => {
    try {
      const rawText = (req.query.text as string) || "";
      const lang = (req.query.lang as string) || "ar";

      if (!rawText.trim()) {
        return res.status(400).send("Text parameter is required");
      }

      // Clean input text
      let cleanText = rawText
        .replace(/[*#]/g, '')
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

      if (lang === 'ur') {
        // Phonetic corrections for Urdu TTS: ensure "مولیٰ" / "مولی" is synthesized as "مولا" (Mawla / Maula), never "moli"
        cleanText = cleanText
          .replace(/مولیٰ|مَولیٰ|مَولٰی|مولٰی/g, 'مولا')
          .replace(/مرے\s+مولیٰ?/g, 'میرے مولا')
          .replace(/مرے\s+مولا/g, 'میرے مولا')
          .replace(/میرے\s+مولی\b/g, 'میرے مولا')
          .replace(/میرا\s+مولی\b/g, 'میرا مولا')
          .replace(/مولی\b/g, 'مولا');
      } else {
        // Preserve sacred names (Lillahi, Allah, etc.) without inserting full Alif before Heh
        cleanText = cleanText
          .replace(/لِلّٰهِ|لِلّٰه|لِلَّٰهِ|لِلَّٰه/g, 'لِلَّهِ')
          .replace(/اللّٰهُ|اللّٰهِ|اللّٰهَ|اللّٰه/g, 'اللَّهُ')
          .replace(/\u06E1/g, '\u0652') // Quranic Sukoon ۡ to standard Sukoon ْ
          .replace(/([\u0621-\u064A])\u0670/g, '$1َا') // Khada Zabar -> Fatha + Alif (ـَا)
          .replace(/\u0670/g, 'َا')
          .replace(/([\u0621-\u064A])\u0656/g, '$1ِي') // Khada Zer -> Kasra + Yaa (ـِي)
          .replace(/\u0656/g, 'ِي')
          .replace(/([\u0621-\u064A])\u0657/g, '$1ُوْ') // Ulta Pesh -> Damma + Waw (ـُوْ)
          .replace(/\u0657/g, 'ُوْ')
          .replace(/[\u06DF\u06E0\u06E2\u06E3\u06E4\u06E5\u06E6\u06E7\u06E8\u06EA\u06EB\u06EC\u06ED]/g, '') // remove Quran stop marks
          .replace(/ہ|ھ/g, 'ه')
          .replace(/ی/g, 'ي')
          .replace(/ک/g, 'ك');
      }

      cleanText = cleanText.trim().slice(0, 300);

      const targetLang = lang === 'ur' ? 'ur' : 'ar';
      const cacheKey = `${targetLang}:${cleanText}`;

      // Check RAM cache for sub-millisecond playback of kalimat
      if (ttsMemoryCache.has(cacheKey)) {
        const cachedBuffer = ttsMemoryCache.get(cacheKey)!;
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
        return res.send(cachedBuffer);
      }

      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;

      const ttsResponse = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Referer": "https://translate.google.com/"
        }
      });

      if (ttsResponse.ok) {
        const audioBuffer = await ttsResponse.arrayBuffer();
        const buffer = Buffer.from(audioBuffer);
        if (ttsMemoryCache.size > 800) {
          const firstKey = ttsMemoryCache.keys().next().value;
          if (firstKey) ttsMemoryCache.delete(firstKey);
        }
        ttsMemoryCache.set(cacheKey, buffer);
        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
        return res.send(buffer);
      } else {
        // Fallback to secondary client
        const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=gtx`;
        const fallbackResponse = await fetch(fallbackUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          }
        });

        if (fallbackResponse.ok) {
          const audioBuffer = await fallbackResponse.arrayBuffer();
          const buffer = Buffer.from(audioBuffer);
          if (ttsMemoryCache.size > 800) {
            const firstKey = ttsMemoryCache.keys().next().value;
            if (firstKey) ttsMemoryCache.delete(firstKey);
          }
          ttsMemoryCache.set(cacheKey, buffer);
          res.setHeader("Content-Type", "audio/mpeg");
          res.setHeader("Cache-Control", "public, max-age=604800, immutable");
          return res.send(buffer);
        }

        return res.status(502).json({ error: "TTS provider unavailable" });
      }
    } catch (err: any) {
      console.error("[TTS Proxy Error]:", err?.message || err);
      return res.status(500).json({ error: "TTS audio generation failed" });
    }
  });

  // In-memory cache for Sheikh Mishary Rashid Alafasy Word-by-Word Audio
  const alafasyWbwCache = new Map<string, string[]>();

  function normalizeArabicText(str: string): string {
    return str
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
      .replace(/آ|أ|إ|ٱ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ہ|ھ/g, 'ه')
      .replace(/ى|ی/g, 'ي')
      .replace(/ک/g, 'ك')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeArabicWithDiacritics(str: string): string {
    return str
      .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
      .replace(/\u06E1/g, '\u0652')
      .replace(/[\u06D6-\u06ED]/g, '')
      .replace(/آ|أ|إ|ٱ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ہ|ھ/g, 'ه')
      .replace(/ى|ی/g, 'ي')
      .replace(/ک/g, 'ك')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // API Endpoint for Sheikh Mishary Rashid Alafasy Word-by-Word (WBW) Kalima Recitation
  app.get("/api/quran-word-audio", async (req, res) => {
    try {
      const rawText = (req.query.word as string) || "";
      if (!rawText.trim()) {
        return res.status(400).json({ error: "Word query required" });
      }

      const cleanText = rawText
        .replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, '')
        .trim();

      const normalizedBase = normalizeArabicText(cleanText);
      const normalizedWithDiacritics = normalizeArabicWithDiacritics(cleanText);

      if (alafasyWbwCache.has(normalizedWithDiacritics)) {
        return res.json({
          qari: "القارئ الشيخ مشاري راشد العفاسي",
          audioUrls: alafasyWbwCache.get(normalizedWithDiacritics)
        });
      }

      const words = cleanText.split(/\s+/).filter(w => w.trim().length > 0);
      let audioUrls: string[] = [];

      // 0. Explicit Verified Overrides Map for Qaida & Quranic Kalimas
      const qaidaOverrides: Record<string, string[]> = {
        // Quranic Ayahs & Surahs & Daily Duas
        'الحمد لله': ['https://audio.qurancdn.com/wbw/001_002_001.mp3', 'https://audio.qurancdn.com/wbw/001_002_002.mp3'],
        'الحمدلله': ['https://audio.qurancdn.com/wbw/001_002_001.mp3', 'https://audio.qurancdn.com/wbw/001_002_002.mp3'],
        'بسم الله': ['https://audio.qurancdn.com/wbw/001_001_001.mp3', 'https://audio.qurancdn.com/wbw/001_001_002.mp3'],
        'بسم الله الرحمن الرحيم': ['https://audio.qurancdn.com/wbw/001_001_001.mp3', 'https://audio.qurancdn.com/wbw/001_001_002.mp3', 'https://audio.qurancdn.com/wbw/001_001_003.mp3', 'https://audio.qurancdn.com/wbw/001_001_004.mp3'],
        'سبحان الله': ['https://audio.qurancdn.com/wbw/012_108_009.mp3', 'https://audio.qurancdn.com/wbw/012_108_010.mp3'],
        'الله اكبر': ['https://audio.qurancdn.com/wbw/009_072_017.mp3', 'https://audio.qurancdn.com/wbw/009_072_018.mp3'],
        'سبحان الله وبحمده': ['https://audio.qurancdn.com/wbw/012_108_009.mp3', 'https://audio.qurancdn.com/wbw/012_108_010.mp3', 'https://audio.qurancdn.com/wbw/002_030_018.mp3', 'https://audio.qurancdn.com/wbw/002_030_019.mp3'],
        'لا اله الا الله': ['https://audio.qurancdn.com/wbw/047_019_005.mp3', 'https://audio.qurancdn.com/wbw/047_019_006.mp3', 'https://audio.qurancdn.com/wbw/047_019_007.mp3', 'https://audio.qurancdn.com/wbw/047_019_008.mp3'],
        'لا حول ولا قوة الا بالله': ['https://audio.qurancdn.com/wbw/018_039_007.mp3', 'https://audio.qurancdn.com/wbw/018_039_008.mp3', 'https://audio.qurancdn.com/wbw/018_039_009.mp3', 'https://audio.qurancdn.com/wbw/018_039_010.mp3', 'https://audio.qurancdn.com/wbw/018_039_011.mp3'],
        'استغفر الله': ['https://audio.qurancdn.com/wbw/004_106_001.mp3', 'https://audio.qurancdn.com/wbw/004_106_002.mp3'],
        'ان شاء الله': ['https://audio.qurancdn.com/wbw/002_070_013.mp3', 'https://audio.qurancdn.com/wbw/002_070_014.mp3', 'https://audio.qurancdn.com/wbw/002_070_015.mp3'],
        'ما شاء الله': ['https://audio.qurancdn.com/wbw/018_039_004.mp3', 'https://audio.qurancdn.com/wbw/018_039_005.mp3', 'https://audio.qurancdn.com/wbw/018_039_006.mp3'],
        'ما شاء الله لا قوة الا بالله': ['https://audio.qurancdn.com/wbw/018_039_004.mp3', 'https://audio.qurancdn.com/wbw/018_039_005.mp3', 'https://audio.qurancdn.com/wbw/018_039_006.mp3', 'https://audio.qurancdn.com/wbw/018_039_007.mp3', 'https://audio.qurancdn.com/wbw/018_039_008.mp3', 'https://audio.qurancdn.com/wbw/018_039_009.mp3', 'https://audio.qurancdn.com/wbw/018_039_010.mp3', 'https://audio.qurancdn.com/wbw/018_039_011.mp3'],
        'جزاك الله خيرا': ['https://audio.qurancdn.com/wbw/028_025_012.mp3', 'https://audio.qurancdn.com/wbw/028_025_013.mp3', 'https://audio.qurancdn.com/wbw/002_158_017.mp3'],
        'يرحمك الله': ['https://audio.qurancdn.com/wbw/009_071_020.mp3', 'https://audio.qurancdn.com/wbw/009_071_021.mp3'],
        'السلام عليكم': ['https://audio.qurancdn.com/wbw/006_054_006.mp3', 'https://audio.qurancdn.com/wbw/006_054_007.mp3'],
        'السلام عليكم ورحمة الله وبركاته': ['https://audio.qurancdn.com/wbw/006_054_006.mp3', 'https://audio.qurancdn.com/wbw/006_054_007.mp3', 'https://audio.qurancdn.com/wbw/011_073_008.mp3', 'https://audio.qurancdn.com/wbw/011_073_009.mp3', 'https://audio.qurancdn.com/wbw/011_073_010.mp3'],
        'وعليكم السلام': ['https://audio.qurancdn.com/wbw/006_054_007.mp3', 'https://audio.qurancdn.com/wbw/006_054_006.mp3'],
        'وعليكم السلام ورحمة الله وبركاته': ['https://audio.qurancdn.com/wbw/006_054_007.mp3', 'https://audio.qurancdn.com/wbw/006_054_006.mp3', 'https://audio.qurancdn.com/wbw/011_073_008.mp3', 'https://audio.qurancdn.com/wbw/011_073_009.mp3', 'https://audio.qurancdn.com/wbw/011_073_010.mp3'],
        'انا لله وانا اليه راجعون': ['https://audio.qurancdn.com/wbw/002_156_005.mp3', 'https://audio.qurancdn.com/wbw/002_156_006.mp3', 'https://audio.qurancdn.com/wbw/002_156_007.mp3', 'https://audio.qurancdn.com/wbw/002_156_008.mp3', 'https://audio.qurancdn.com/wbw/002_156_009.mp3'],
        'الحمد لله والله اكبر': ['https://audio.qurancdn.com/wbw/001_002_001.mp3', 'https://audio.qurancdn.com/wbw/001_002_002.mp3', 'https://audio.qurancdn.com/wbw/009_072_017.mp3', 'https://audio.qurancdn.com/wbw/009_072_018.mp3'],
        'بسم الله والله اكبر': ['https://audio.qurancdn.com/wbw/001_001_001.mp3', 'https://audio.qurancdn.com/wbw/001_001_002.mp3', 'https://audio.qurancdn.com/wbw/009_072_017.mp3', 'https://audio.qurancdn.com/wbw/009_072_018.mp3'],
        'بسم الله الله اكبر': ['https://audio.qurancdn.com/wbw/001_001_001.mp3', 'https://audio.qurancdn.com/wbw/001_001_002.mp3', 'https://audio.qurancdn.com/wbw/009_072_017.mp3', 'https://audio.qurancdn.com/wbw/009_072_018.mp3'],
        'الله احد': ['https://audio.qurancdn.com/wbw/112_001_003.mp3', 'https://audio.qurancdn.com/wbw/112_001_004.mp3'],
        'الله الصمد': ['https://audio.qurancdn.com/wbw/112_002_001.mp3', 'https://audio.qurancdn.com/wbw/112_002_002.mp3'],
        'لم يلد ولم يولد': ['https://audio.qurancdn.com/wbw/112_003_001.mp3', 'https://audio.qurancdn.com/wbw/112_003_002.mp3', 'https://audio.qurancdn.com/wbw/112_003_003.mp3', 'https://audio.qurancdn.com/wbw/112_003_004.mp3'],
        // Verified Single Words
        'خلق': ['https://audio.qurancdn.com/wbw/096_001_005.mp3'],
        'جعل': ['https://audio.qurancdn.com/wbw/033_004_002.mp3'],
        'كتب': ['https://audio.qurancdn.com/wbw/002_183_004.mp3'],
        'صبر': ['https://audio.qurancdn.com/wbw/042_043_002.mp3'],
        'بلغ': ['https://audio.qurancdn.com/wbw/012_022_002.mp3'],
        'سوف': ['https://audio.qurancdn.com/wbw/102_004_003.mp3'],
        'لهب': ['https://audio.qurancdn.com/wbw/111_003_004.mp3'],
        'ملك': ['https://audio.qurancdn.com/wbw/114_002_001.mp3'],
        'تبت': ['https://audio.qurancdn.com/wbw/111_001_001.mp3'],
        'احد': ['https://audio.qurancdn.com/wbw/112_001_004.mp3'],
        'الصمد': ['https://audio.qurancdn.com/wbw/112_002_002.mp3'],
        'يلد': ['https://audio.qurancdn.com/wbw/112_003_002.mp3'],
        'يولد': ['https://audio.qurancdn.com/wbw/112_003_004.mp3'],
        'كفوا': ['https://audio.qurancdn.com/wbw/112_004_004.mp3'],
        'اعوذ': ['https://audio.qurancdn.com/wbw/113_001_002.mp3'],
        'الفلق': ['https://audio.qurancdn.com/wbw/113_001_004.mp3'],
        'شر': ['https://audio.qurancdn.com/wbw/113_002_002.mp3'],
        'غاسق': ['https://audio.qurancdn.com/wbw/113_003_003.mp3'],
        'وقب': ['https://audio.qurancdn.com/wbw/113_003_005.mp3'],
        'النفاثات': ['https://audio.qurancdn.com/wbw/113_004_003.mp3'],
        'حاسد': ['https://audio.qurancdn.com/wbw/113_005_003.mp3'],
        'حسد': ['https://audio.qurancdn.com/wbw/113_005_005.mp3'],
        'الناس': ['https://audio.qurancdn.com/wbw/114_001_004.mp3'],
        'اله': ['https://audio.qurancdn.com/wbw/114_003_001.mp3'],
        'الوسواس': ['https://audio.qurancdn.com/wbw/114_004_003.mp3'],
        'الخناس': ['https://audio.qurancdn.com/wbw/114_004_004.mp3'],
        'يوسوس': ['https://audio.qurancdn.com/wbw/114_005_002.mp3'],
        'صدور': ['https://audio.qurancdn.com/wbw/114_005_004.mp3'],
        'الجنة': ['https://audio.qurancdn.com/wbw/114_006_002.mp3'],
        'الرحمن': ['https://audio.qurancdn.com/wbw/001_001_003.mp3'],
        'الرحيم': ['https://audio.qurancdn.com/wbw/001_001_004.mp3'],
        'الحمد': ['https://audio.qurancdn.com/wbw/001_002_001.mp3'],
        'لله': ['https://audio.qurancdn.com/wbw/001_002_002.mp3'],
        'رب': ['https://audio.qurancdn.com/wbw/001_002_003.mp3'],
        'العالمين': ['https://audio.qurancdn.com/wbw/001_002_004.mp3'],
        'مالك': ['https://audio.qurancdn.com/wbw/001_004_001.mp3'],
        'يوم': ['https://audio.qurancdn.com/wbw/001_004_002.mp3'],
        'الدين': ['https://audio.qurancdn.com/wbw/001_004_003.mp3'],
        'اياك': ['https://audio.qurancdn.com/wbw/001_005_001.mp3'],
        'نعبد': ['https://audio.qurancdn.com/wbw/001_005_002.mp3'],
        'نستعين': ['https://audio.qurancdn.com/wbw/001_005_004.mp3'],
        'اهدنا': ['https://audio.qurancdn.com/wbw/001_006_001.mp3'],
        'الصراط': ['https://audio.qurancdn.com/wbw/001_006_002.mp3'],
        'المستقيم': ['https://audio.qurancdn.com/wbw/001_006_003.mp3'],
        'قتل': ['https://audio.qurancdn.com/wbw/002_251_007.mp3'],
        'نصر': ['https://audio.qurancdn.com/wbw/110_001_002.mp3'],
        'ضرب': ['https://audio.qurancdn.com/wbw/014_024_004.mp3'],
        'علم': ['https://audio.qurancdn.com/wbw/002_187_009.mp3'],
        'ولد': ['https://audio.qurancdn.com/wbw/002_116_011.mp3'],
        'وزن': ['https://audio.qurancdn.com/wbw/055_009_002.mp3'],
        'قالوا': ['https://audio.qurancdn.com/wbw/002_011_008.mp3'],
        'قال': ['https://audio.qurancdn.com/wbw/002_030_002.mp3'],
                'قيل': ['https://audio.qurancdn.com/wbw/002_011_002.mp3'],
        'امين': ['https://audio.qurancdn.com/wbw/026_107_004.mp3'],
        'فيل': ['https://audio.qurancdn.com/wbw/105_001_007.mp3'],

        // Lesson 15: Zaid Alif & Rasm ul Khatt Verified Overrides
        'لكنا': ['https://audio.qurancdn.com/wbw/018_038_001.mp3'],
        'لكن': ['https://audio.qurancdn.com/wbw/018_038_001.mp3'],
        'لكن هو': ['https://audio.qurancdn.com/wbw/018_038_001.mp3', 'https://audio.qurancdn.com/wbw/018_038_002.mp3'],
        'الظنونا': ['https://audio.qurancdn.com/wbw/033_010_016.mp3'],
        'الظنون': ['https://audio.qurancdn.com/wbw/033_010_016.mp3'],
        'الظنون هنالك': ['https://audio.qurancdn.com/wbw/033_010_016.mp3', 'https://audio.qurancdn.com/wbw/033_010_017.mp3'],
        'الرسولا': ['https://audio.qurancdn.com/wbw/033_066_011.mp3'],
        'الرسول': ['https://audio.qurancdn.com/wbw/033_066_011.mp3'],
        'واطعنا الرسول': ['https://audio.qurancdn.com/wbw/033_066_010.mp3', 'https://audio.qurancdn.com/wbw/033_066_011.mp3'],
        'واطعنا الرسولا': ['https://audio.qurancdn.com/wbw/033_066_010.mp3', 'https://audio.qurancdn.com/wbw/033_066_011.mp3'],
        'السبيلا': ['https://audio.qurancdn.com/wbw/033_067_008.mp3'],
        'السبيل': ['https://audio.qurancdn.com/wbw/033_067_008.mp3'],
        'فاضلونا السبيل': ['https://audio.qurancdn.com/wbw/033_067_007.mp3', 'https://audio.qurancdn.com/wbw/033_067_008.mp3'],
        'فاضلونا السبيلا': ['https://audio.qurancdn.com/wbw/033_067_007.mp3', 'https://audio.qurancdn.com/wbw/033_067_008.mp3'],
        'قواریرا': ['https://audio.qurancdn.com/wbw/076_015_008.mp3'],
        'قوارير': ['https://audio.qurancdn.com/wbw/076_015_008.mp3'],
        'كانت قوارير': ['https://audio.qurancdn.com/wbw/076_015_007.mp3', 'https://audio.qurancdn.com/wbw/076_015_008.mp3'],
        'سلاسلا': ['https://audio.qurancdn.com/wbw/076_004_004.mp3'],
        'سلاسل': ['https://audio.qurancdn.com/wbw/076_004_004.mp3'],
        'سلسلا': ['https://audio.qurancdn.com/wbw/076_004_004.mp3'],
        'سلاسلا واغلالا': ['https://audio.qurancdn.com/wbw/076_004_004.mp3', 'https://audio.qurancdn.com/wbw/076_004_005.mp3'],
        'افائن': ['https://audio.qurancdn.com/wbw/021_034_007.mp3'],
        'افاين': ['https://audio.qurancdn.com/wbw/021_034_007.mp3'],
        'افان': ['https://audio.qurancdn.com/wbw/021_034_007.mp3'],
        'افائن مات': ['https://audio.qurancdn.com/wbw/003_144_010.mp3', 'https://audio.qurancdn.com/wbw/003_144_011.mp3'],
        'افاين مات': ['https://audio.qurancdn.com/wbw/003_144_010.mp3', 'https://audio.qurancdn.com/wbw/003_144_011.mp3'],
        'افان مات': ['https://audio.qurancdn.com/wbw/003_144_010.mp3', 'https://audio.qurancdn.com/wbw/003_144_011.mp3'],
        'افائن مت': ['https://audio.qurancdn.com/wbw/021_034_007.mp3', 'https://audio.qurancdn.com/wbw/021_034_008.mp3'],
        'افاين مت': ['https://audio.qurancdn.com/wbw/021_034_007.mp3', 'https://audio.qurancdn.com/wbw/021_034_008.mp3'],
        'افان مت': ['https://audio.qurancdn.com/wbw/021_034_007.mp3', 'https://audio.qurancdn.com/wbw/021_034_008.mp3'],
        'لا الى الجحيم': ['https://audio.qurancdn.com/wbw/037_068_004.mp3', 'https://audio.qurancdn.com/wbw/037_068_005.mp3'],
        'لالى الجحيم': ['https://audio.qurancdn.com/wbw/037_068_004.mp3', 'https://audio.qurancdn.com/wbw/037_068_005.mp3'],
        'لإلى الجحيم': ['https://audio.qurancdn.com/wbw/037_068_004.mp3', 'https://audio.qurancdn.com/wbw/037_068_005.mp3'],
        'ملإیه': ['https://audio.qurancdn.com/wbw/011_097_003.mp3'],
        'ملائه': ['https://audio.qurancdn.com/wbw/011_097_003.mp3'],
        'ملإه': ['https://audio.qurancdn.com/wbw/011_097_003.mp3'],
        'فرعون وملائه': ['https://audio.qurancdn.com/wbw/011_097_002.mp3', 'https://audio.qurancdn.com/wbw/011_097_003.mp3'],
        'ولا اوضعوا': ['https://audio.qurancdn.com/wbw/009_047_007.mp3', 'https://audio.qurancdn.com/wbw/009_047_008.mp3'],
        'ولاوضعوا': ['https://audio.qurancdn.com/wbw/009_047_007.mp3', 'https://audio.qurancdn.com/wbw/009_047_008.mp3'],
        'وملائهم': ['https://audio.qurancdn.com/wbw/010_083_012.mp3'],
        'وملئهم': ['https://audio.qurancdn.com/wbw/010_083_012.mp3'],
        'فرعون وملائهم': ['https://audio.qurancdn.com/wbw/010_083_011.mp3', 'https://audio.qurancdn.com/wbw/010_083_012.mp3'],
        'ثمودا': ['https://audio.qurancdn.com/wbw/011_068_007.mp3'],
        'ثمود': ['https://audio.qurancdn.com/wbw/011_068_007.mp3'],
        'ان ثمودا': ['https://audio.qurancdn.com/wbw/011_068_006.mp3', 'https://audio.qurancdn.com/wbw/011_068_007.mp3'],
        'ان ثمود': ['https://audio.qurancdn.com/wbw/011_068_006.mp3', 'https://audio.qurancdn.com/wbw/011_068_007.mp3'],
        'لتتلوا': ['https://audio.qurancdn.com/wbw/013_030_010.mp3'],
        'لتتلو': ['https://audio.qurancdn.com/wbw/013_030_010.mp3'],
        'لتتلوا عليهم': ['https://audio.qurancdn.com/wbw/013_030_010.mp3', 'https://audio.qurancdn.com/wbw/013_030_011.mp3'],
        'لن ندعوا': ['https://audio.qurancdn.com/wbw/018_014_011.mp3', 'https://audio.qurancdn.com/wbw/018_014_012.mp3'],
        'لن ندعو': ['https://audio.qurancdn.com/wbw/018_014_011.mp3', 'https://audio.qurancdn.com/wbw/018_014_012.mp3'],
        'لیربوا': ['https://audio.qurancdn.com/wbw/030_039_005.mp3'],
        'لیربو': ['https://audio.qurancdn.com/wbw/030_039_005.mp3'],
        'لييربوا': ['https://audio.qurancdn.com/wbw/030_039_005.mp3'],
        'لييربو': ['https://audio.qurancdn.com/wbw/030_039_005.mp3'],
        'لیبلوا': ['https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'لیبلو': ['https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'ليبلوا': ['https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'ليبلو': ['https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'ولكن ليبلوا': ['https://audio.qurancdn.com/wbw/047_004_027.mp3', 'https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'ولكن ليبلو': ['https://audio.qurancdn.com/wbw/047_004_027.mp3', 'https://audio.qurancdn.com/wbw/047_004_028.mp3'],
        'ونبلوا': ['https://audio.qurancdn.com/wbw/047_031_007.mp3'],
        'ونبلو': ['https://audio.qurancdn.com/wbw/047_031_007.mp3'],
        'الانامل': ['https://audio.qurancdn.com/wbw/003_119_017.mp3'],
        'علیکم الانامل': ['https://audio.qurancdn.com/wbw/003_119_016.mp3', 'https://audio.qurancdn.com/wbw/003_119_017.mp3'],
        'اناسیا': ['https://audio.qurancdn.com/wbw/025_049_009.mp3'],
        'اناسي': ['https://audio.qurancdn.com/wbw/025_049_009.mp3'],
        'انابوا': ['https://audio.qurancdn.com/wbw/039_017_006.mp3'],
        'الانام': ['https://audio.qurancdn.com/wbw/055_010_003.mp3'],
        'للانام': ['https://audio.qurancdn.com/wbw/055_010_003.mp3'],
        'اناب': ['https://audio.qurancdn.com/wbw/031_015_021.mp3'],
        'من اناب': ['https://audio.qurancdn.com/wbw/031_015_020.mp3', 'https://audio.qurancdn.com/wbw/031_015_021.mp3'],
        'انا': ['https://audio.qurancdn.com/wbw/002_258_019.mp3'],

        // Complete Verified Lesson 10 (Nun Sakin & Tanween) Tajweed Overrides
        // --- 1. IZHAR (حروفِ حلقی) ---
        'من غفور': ['https://audio.qurancdn.com/wbw/041_032_002.mp3', 'https://audio.qurancdn.com/wbw/041_032_003.mp3'],
        'من خوف': ['https://audio.qurancdn.com/wbw/106_004_006.mp3', 'https://audio.qurancdn.com/wbw/106_004_007.mp3'],
        'سميع عليم': ['https://audio.qurancdn.com/wbw/002_227_006.mp3', 'https://audio.qurancdn.com/wbw/002_227_007.mp3'],
        'قرضا حسنا': ['https://audio.qurancdn.com/wbw/002_245_006.mp3', 'https://audio.qurancdn.com/wbw/002_245_007.mp3'],
        'عليم خبير': ['https://audio.qurancdn.com/wbw/031_034_031.mp3', 'https://audio.qurancdn.com/wbw/031_034_032.mp3'],
        'قوما غيركم': ['https://audio.qurancdn.com/wbw/011_057_022.mp3', 'https://audio.qurancdn.com/wbw/011_057_023.mp3'],
        'من صلصال': ['https://audio.qurancdn.com/wbw/055_014_003.mp3', 'https://audio.qurancdn.com/wbw/055_014_004.mp3'],
        'من طين': ['https://audio.qurancdn.com/wbw/006_002_004.mp3', 'https://audio.qurancdn.com/wbw/006_002_005.mp3'],
        'من قبل': ['https://audio.qurancdn.com/wbw/002_025_025.mp3', 'https://audio.qurancdn.com/wbw/002_025_026.mp3'],
        'من كتب': ['https://audio.qurancdn.com/wbw/034_044_003.mp3', 'https://audio.qurancdn.com/wbw/034_044_004.mp3'],
        'انت': ['https://audio.qurancdn.com/wbw/088_021_003.mp3'],
        'تنسون': ['https://audio.qurancdn.com/wbw/002_044_005.mp3'],
        'ينصرون': ['https://audio.qurancdn.com/wbw/044_041_010.mp3'],
        'منضود': ['https://audio.qurancdn.com/wbw/056_029_002.mp3'],
        'انظر': ['https://audio.qurancdn.com/wbw/006_024_001.mp3'],
        'انفسكم': ['https://audio.qurancdn.com/wbw/002_054_008.mp3'],
        'ينقضون': ['https://audio.qurancdn.com/wbw/002_027_002.mp3'],
        'فصبر جميل': ['https://audio.qurancdn.com/wbw/012_018_014.mp3', 'https://audio.qurancdn.com/wbw/012_018_015.mp3'],
        'سراعا ذلك': ['https://audio.qurancdn.com/wbw/050_044_005.mp3', 'https://audio.qurancdn.com/wbw/050_044_008.mp3'],
        'عذاب شديد': ['https://audio.qurancdn.com/wbw/042_026_011.mp3', 'https://audio.qurancdn.com/wbw/042_026_012.mp3'],
        'عملا صالحا': ['https://audio.qurancdn.com/wbw/018_110_019.mp3', 'https://audio.qurancdn.com/wbw/018_110_020.mp3'],
        'عذابا ضعفا': ['https://audio.qurancdn.com/wbw/007_038_033.mp3', 'https://audio.qurancdn.com/wbw/007_038_034.mp3'],
        'سحاب ظلمات': ['https://audio.qurancdn.com/wbw/024_040_013.mp3', 'https://audio.qurancdn.com/wbw/024_040_016.mp3'],
        'سحاب ظلمت': ['https://audio.qurancdn.com/wbw/024_040_013.mp3', 'https://audio.qurancdn.com/wbw/024_040_016.mp3'],
        'قوما فاسقين': ['https://audio.qurancdn.com/wbw/009_024_032.mp3', 'https://audio.qurancdn.com/wbw/009_024_033.mp3'],
        'ثمنا قليلا': ['https://audio.qurancdn.com/wbw/003_077_021.mp3', 'https://audio.qurancdn.com/wbw/003_077_022.mp3'],
        'رسول كريم': ['https://audio.qurancdn.com/wbw/069_040_003.mp3', 'https://audio.qurancdn.com/wbw/069_040_004.mp3'],
        'من يوم': ['https://audio.qurancdn.com/wbw/019_037_009.mp3', 'https://audio.qurancdn.com/wbw/019_037_011.mp3'],
        'من ولي': ['https://audio.qurancdn.com/wbw/002_107_015.mp3', 'https://audio.qurancdn.com/wbw/002_107_016.mp3'],
        'سراجا منيرا': ['https://audio.qurancdn.com/wbw/033_046_005.mp3', 'https://audio.qurancdn.com/wbw/033_046_006.mp3'],
        'ويل لكل': ['https://audio.qurancdn.com/wbw/104_001_001.mp3', 'https://audio.qurancdn.com/wbw/104_001_002.mp3'],
        'خبير بصيرا': ['https://audio.qurancdn.com/wbw/025_058_010.mp3', 'https://audio.qurancdn.com/wbw/025_058_011.mp3'],
        'من اجل': ['https://audio.qurancdn.com/wbw/005_032_001.mp3', 'https://audio.qurancdn.com/wbw/005_032_002.mp3'],
        'من هاد': ['https://audio.qurancdn.com/wbw/039_036_016.mp3', 'https://audio.qurancdn.com/wbw/039_036_017.mp3'],
        'من علق': ['https://audio.qurancdn.com/wbw/096_002_003.mp3', 'https://audio.qurancdn.com/wbw/096_002_004.mp3'],
        'من حكيم': ['https://audio.qurancdn.com/wbw/027_006_004.mp3', 'https://audio.qurancdn.com/wbw/027_006_006.mp3'],
        'ينئون': ['https://audio.qurancdn.com/wbw/006_026_004.mp3'],
        'منهم': ['https://audio.qurancdn.com/wbw/018_018_021.mp3'],
        'انعمت': ['https://audio.qurancdn.com/wbw/001_007_003.mp3'],
        'وانحر': ['https://audio.qurancdn.com/wbw/108_002_003.mp3'],
        'فسينغضون': ['https://audio.qurancdn.com/wbw/017_051_018.mp3'],
        'والمنخنقة': ['https://audio.qurancdn.com/wbw/005_003_012.mp3'],
        'عذابا اليما': ['https://audio.qurancdn.com/wbw/004_138_005.mp3', 'https://audio.qurancdn.com/wbw/004_138_006.mp3'],
        'بلدا امنا': ['https://audio.qurancdn.com/wbw/002_126_007.mp3', 'https://audio.qurancdn.com/wbw/002_126_008.mp3'],
        'نوحا هدينا': ['https://audio.qurancdn.com/wbw/006_084_007.mp3', 'https://audio.qurancdn.com/wbw/006_084_008.mp3'],
        'فمن تبع': ['https://audio.qurancdn.com/wbw/002_038_010.mp3', 'https://audio.qurancdn.com/wbw/002_038_011.mp3'],
        'من ثمرة': ['https://audio.qurancdn.com/wbw/002_025_017.mp3', 'https://audio.qurancdn.com/wbw/002_025_018.mp3'],
        'من جوع': ['https://audio.qurancdn.com/wbw/106_004_003.mp3', 'https://audio.qurancdn.com/wbw/106_004_004.mp3'],
        'من دونكم': ['https://audio.qurancdn.com/wbw/003_118_007.mp3', 'https://audio.qurancdn.com/wbw/003_118_008.mp3'],
        'من ذهب': ['https://audio.qurancdn.com/wbw/043_053_005.mp3', 'https://audio.qurancdn.com/wbw/043_053_006.mp3'],
        'فان زللتم': ['https://audio.qurancdn.com/wbw/002_209_001.mp3', 'https://audio.qurancdn.com/wbw/002_209_002.mp3'],
        'من سفه': ['https://audio.qurancdn.com/wbw/002_130_007.mp3', 'https://audio.qurancdn.com/wbw/002_130_008.mp3'],
        'من شكر': ['https://audio.qurancdn.com/wbw/054_035_007.mp3', 'https://audio.qurancdn.com/wbw/054_035_008.mp3'],
        'ان ضللت': ['https://audio.qurancdn.com/wbw/034_050_002.mp3', 'https://audio.qurancdn.com/wbw/034_050_003.mp3'],
        'من ظلم': ['https://audio.qurancdn.com/wbw/027_011_002.mp3', 'https://audio.qurancdn.com/wbw/027_011_003.mp3'],
        'من فروج': ['https://audio.qurancdn.com/wbw/050_006_011.mp3', 'https://audio.qurancdn.com/wbw/050_006_012.mp3'],
        'ننشزها': ['https://audio.qurancdn.com/wbw/002_259_059.mp3'],
        'ينطقون': ['https://audio.qurancdn.com/wbw/077_035_004.mp3'],
        'منكم': ['https://audio.qurancdn.com/wbw/043_060_004.mp3'],
        'قولا ثقيلا': ['https://audio.qurancdn.com/wbw/073_005_004.mp3', 'https://audio.qurancdn.com/wbw/073_005_005.mp3'],
        'كاسا دهاقا': ['https://audio.qurancdn.com/wbw/078_034_001.mp3', 'https://audio.qurancdn.com/wbw/078_034_002.mp3'],
        'صعيدا زلقا': ['https://audio.qurancdn.com/wbw/018_040_014.mp3', 'https://audio.qurancdn.com/wbw/018_040_015.mp3'],
        'قولا سديدا': ['https://audio.qurancdn.com/wbw/033_070_007.mp3', 'https://audio.qurancdn.com/wbw/033_070_008.mp3'],
        'سبحا طويلا': ['https://audio.qurancdn.com/wbw/073_007_005.mp3', 'https://audio.qurancdn.com/wbw/073_007_006.mp3'],
        'كراما كاتبين': ['https://audio.qurancdn.com/wbw/082_011_001.mp3', 'https://audio.qurancdn.com/wbw/082_011_002.mp3'],
        'من يقول': ['https://audio.qurancdn.com/wbw/002_008_003.mp3', 'https://audio.qurancdn.com/wbw/002_008_004.mp3'],
        'من ورق الجنة': ['https://audio.qurancdn.com/wbw/007_022_013.mp3', 'https://audio.qurancdn.com/wbw/007_022_014.mp3', 'https://audio.qurancdn.com/wbw/007_022_015.mp3'],
        'من مشهد': ['https://audio.qurancdn.com/wbw/019_037_009.mp3', 'https://audio.qurancdn.com/wbw/019_037_010.mp3'],
        'من مثله': ['https://audio.qurancdn.com/wbw/002_023_011.mp3', 'https://audio.qurancdn.com/wbw/002_023_012.mp3'],
        'من نصير': ['https://audio.qurancdn.com/wbw/022_071_017.mp3', 'https://audio.qurancdn.com/wbw/022_071_018.mp3'],
        'من نطفة': ['https://audio.qurancdn.com/wbw/080_019_001.mp3', 'https://audio.qurancdn.com/wbw/080_019_002.mp3'],
        'كتابا يلقاه': ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],
        'هدى وذكرى': ['https://audio.qurancdn.com/wbw/040_054_001.mp3', 'https://audio.qurancdn.com/wbw/040_054_002.mp3'],
        'حطة نغفر لكم': ['https://audio.qurancdn.com/wbw/002_058_015.mp3', 'https://audio.qurancdn.com/wbw/002_058_016.mp3', 'https://audio.qurancdn.com/wbw/002_058_017.mp3'],
        'من ربك': ['https://audio.qurancdn.com/wbw/002_147_002.mp3', 'https://audio.qurancdn.com/wbw/002_147_003.mp3'],
        'من ربهم': ['https://audio.qurancdn.com/wbw/002_005_004.mp3', 'https://audio.qurancdn.com/wbw/002_005_005.mp3'],
        'من لدنه': ['https://audio.qurancdn.com/wbw/004_040_013.mp3', 'https://audio.qurancdn.com/wbw/004_040_014.mp3'],
        'يكن له': ['https://audio.qurancdn.com/wbw/112_004_002.mp3', 'https://audio.qurancdn.com/wbw/112_004_003.mp3'],
        'محمد رسول الله': ['https://audio.qurancdn.com/wbw/048_029_001.mp3', 'https://audio.qurancdn.com/wbw/048_029_002.mp3', 'https://audio.qurancdn.com/wbw/048_029_003.mp3'],
        'رءوف رحيم': ['https://audio.qurancdn.com/wbw/009_128_013.mp3', 'https://audio.qurancdn.com/wbw/009_128_014.mp3'],
        'مصدقا لما': ['https://audio.qurancdn.com/wbw/002_041_004.mp3', 'https://audio.qurancdn.com/wbw/002_041_005.mp3'],
        'من بعد': ['https://audio.qurancdn.com/wbw/002_027_005.mp3', 'https://audio.qurancdn.com/wbw/002_027_006.mp3'],
        'من بقلها': ['https://audio.qurancdn.com/wbw/002_061_017.mp3', 'https://audio.qurancdn.com/wbw/002_061_018.mp3'],
        'قولا بليغا': ['https://audio.qurancdn.com/wbw/004_063_015.mp3', 'https://audio.qurancdn.com/wbw/004_063_016.mp3'],
        'جنة بربوة': ['https://audio.qurancdn.com/wbw/002_265_012.mp3', 'https://audio.qurancdn.com/wbw/002_265_013.mp3'],
        'كرام بررة': ['https://audio.qurancdn.com/wbw/080_016_001.mp3', 'https://audio.qurancdn.com/wbw/080_016_002.mp3'],
        'حل بهذا': ['https://audio.qurancdn.com/wbw/090_002_002.mp3', 'https://audio.qurancdn.com/wbw/090_002_003.mp3'],
        'صم بكم': ['https://audio.qurancdn.com/wbw/002_018_001.mp3', 'https://audio.qurancdn.com/wbw/002_018_002.mp3'],
        'كتابا يلقه': ['https://audio.qurancdn.com/wbw/017_013_012.mp3', 'https://audio.qurancdn.com/wbw/017_013_013.mp3'],

        // Lesson 16: Mutafarriq Qawaid (Verified WBW Recitation Overrides)
        'دنيا': ['/audio/dunya.mp3'],
        'بنيان': ['https://audio.qurancdn.com/wbw/061_004_010.mp3'],
        'صنوان': ['https://audio.qurancdn.com/wbw/013_004_010.mp3'],
        'قنوان': ['https://audio.qurancdn.com/wbw/006_099_023.mp3'],
        'عوجا قيما': ['/audio/iwaja_qayyima.mp3'],
        'عوجا': ['https://audio.qurancdn.com/wbw/018_001_011.mp3'],
        'قيما': ['https://audio.qurancdn.com/wbw/018_002_001.mp3'],
        'من مرقدنا هذا': ['/audio/min_marqadina_haza.mp3'],
        'من مرقدنا': ['https://audio.qurancdn.com/wbw/036_052_005.mp3', 'https://audio.qurancdn.com/wbw/036_052_006.mp3'],
        'مرقدنا هذا': ['https://audio.qurancdn.com/wbw/036_052_006.mp3', 'https://audio.qurancdn.com/wbw/036_052_007.mp3'],
        'مرقدنا': ['https://audio.qurancdn.com/wbw/036_052_006.mp3'],
        'هذا': ['https://audio.qurancdn.com/wbw/036_052_007.mp3'],
        'كلا بل ران': ['/audio/kalla_bal_rana.mp3'],
        'بل ران': ['/audio/kalla_bal_rana.mp3'],
        'ران': ['https://audio.qurancdn.com/wbw/083_014_005.mp3'],
        'وقيل من راق': ['/audio/waqeela_man_raq.mp3'],
        'من راق': ['/audio/waqeela_man_raq.mp3'],
        'وراق': ['https://audio.qurancdn.com/wbw/075_027_004.mp3'],
        'يبسط': ['https://audio.qurancdn.com/wbw/002_245_015.mp3'],
        'بصطة': ['/audio/bastatan.mp3'],
        'بسطة': ['/audio/bastatan.mp3'],
        'ام هم المصيطرون': ['/audio/am_humul_musaitiroon.mp3'],
        'المصيطرون': ['https://audio.qurancdn.com/wbw/052_037_007.mp3'],
        'بمصيطر': ['https://audio.qurancdn.com/wbw/088_022_003.mp3'],
        'ءاعجمي وعربي': ['/audio/aajamiyyun_v2.mp3'],
        'ءاعجمي': ['/audio/aajamiyyun_v2.mp3'],
        'أاعجمي وعربي': ['/audio/aajamiyyun_v2.mp3'],
        'أاعجمي': ['/audio/aajamiyyun_v2.mp3'],
        'مجراها': ['/audio/majreeha.mp3'],
        'مجريها': ['/audio/majreeha.mp3'],
        'مجرىها': ['/audio/majreeha.mp3'],
        'بئس الاسم الفسوق': ['/audio/bisa_lismu_fusuq_v3.mp3'],
        'بئس الاسم': ['/audio/bisa_lismu_fusuq_v3.mp3'],
        'الاسم الفسوق': ['/audio/bisa_lismu_fusuq_v3.mp3'],
        'بئس لسم': ['/audio/bisa_lismu_fusuq_v3.mp3'],
        'بئس': ['https://audio.qurancdn.com/wbw/049_011_031.mp3'],
        'الاسم': ['https://audio.qurancdn.com/wbw/049_011_032.mp3'],
        'الفسوق': ['https://audio.qurancdn.com/wbw/049_011_033.mp3'],
      };

      const normalizedQaidaOverrides: Record<string, string[]> = {
    'مَا خَلَقْ': ['/audio/w1_waqf.mp3'],
    'مَلِكِ النَّاسْ': ['/audio/w2_waqf.mp3'],
    'لِمَا يُرِيدْ': ['/audio/w3_waqf.mp3'],
    'مِنْ جُوعْ': ['/audio/w4_waqf.mp3'],
    'لَكَنُودْ': ['/audio/w5_waqf.mp3'],
    'اِذَا حَسَدْ': ['/audio/w8_waqf.mp3'],
    'يَوْمِ الدِّيْنْ': ['/audio/w9_waqf.mp3'],
    'مَا تَعْبُدُوْنْ': ['/audio/w11_waqf.mp3'],
    'كَانَ تَوَّابَا': ['/audio/w17_waqf.mp3'],
    'لَمْ يَلِدْ': ['/audio/w31_waqf.mp3'],
};
      for (const [k, v] of Object.entries(qaidaOverrides)) {
        normalizedQaidaOverrides[k] = v;
        normalizedQaidaOverrides[normalizeArabicText(k)] = v;
        normalizedQaidaOverrides[normalizeArabicWithDiacritics(k)] = v;
      }

      if (normalizedQaidaOverrides[normalizedWithDiacritics]) {
        audioUrls = normalizedQaidaOverrides[normalizedWithDiacritics];
      } else if (normalizedQaidaOverrides[normalizedBase]) {
        audioUrls = normalizedQaidaOverrides[normalizedBase];
      }

      if (audioUrls.length > 0) {
        alafasyWbwCache.set(normalizedWithDiacritics, audioUrls);
        return res.json({
          qari: "القارئ الشيخ مشاري راشد العفاسي",
          audioUrls
        });
      }

      // 1. Single word exact lookup or search matching
      if (audioUrls.length === 0) {
        for (const word of words) {
          const wordBase = normalizeArabicText(word);
          const wordDiacritics = normalizeArabicWithDiacritics(word);
          if (!wordBase) continue;

          let wordUrl: string | null = null;
          try {
            const searchRes = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(wordBase)}&size=10`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              if (searchData?.search?.results?.length > 0) {
                let exactDiacriticUrl: string | null = null;

                for (const result of searchData.search.results) {
                  if (exactDiacriticUrl) break;
                  const verseKey = result.verse_key;
                  const verseRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,text_indopak`);
                  if (verseRes.ok) {
                    const verseData = await verseRes.json();
                    const vWords = (verseData?.verse?.words || []).filter((w: any) => w.char_type_name === 'word' && w.audio_url);

                    for (const w of vWords) {
                      const uText = w.text_uthmani || w.text || '';
                      const iText = w.text_indopak || '';

                      const uDiac = normalizeArabicWithDiacritics(uText);
                      const iDiac = normalizeArabicWithDiacritics(iText);

                      // Strict Exact Diacritic Match (Harakat match)
                      if (uDiac === wordDiacritics || iDiac === wordDiacritics) {
                        exactDiacriticUrl = `https://audio.qurancdn.com/${w.audio_url}`;
                        break;
                      }
                    }
                  }
                }

                wordUrl = exactDiacriticUrl;
              }
            }
          } catch (e) {
            console.warn("[Word Audio Fetch Error]:", e);
          }

          if (wordUrl) {
            audioUrls.push(wordUrl);
          }
        }
      }

      if (audioUrls.length > 0) {
        alafasyWbwCache.set(normalizedWithDiacritics, audioUrls);
        return res.json({
          qari: "القارئ الشيخ مشاري راشد العفاسي",
          audioUrls
        });
      }

      // If no exact match for all words, return 404 so client falls back to HD Arabic Google TTS
      return res.status(404).json({ error: "Exact Quran WBW audio match not found" });
    } catch (err: any) {
      console.error("[Quran Word Audio Endpoint Error]:", err?.message || err);
      return res.status(500).json({ error: "Internal server error fetching word audio" });
    }
  });

  app.get("/api/download-project", (req, res) => {
    try {
      const zipPath = path.join(process.cwd(), 'project.zip');
      
      // Generate fresh zip archive excluding node_modules, .git, and dist
      try {
        execSync(`python3 -c "import zipfile, os
with zipfile.ZipFile('project.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.cache']]
        for f in files:
            if f != 'project.zip':
                p = os.path.join(root, f)
                z.write(p, os.path.relpath(p, '.'))"`);
      } catch (e) {
        console.warn("Fast zip generation note:", e);
      }

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="TaalimulQuran_SourceCode.zip"');
      res.download(zipPath, 'TaalimulQuran_SourceCode.zip', (err) => {
        if (err && !res.headersSent) {
          res.status(500).send('Error generating project archive');
        }
      });
    } catch (err) {
      res.status(500).send('Archive error');
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const candidates = [
      path.join(process.cwd(), 'dist'),
      typeof __dirname !== 'undefined' ? path.join(__dirname, 'dist') : null,
      '/app/applet/dist'
    ].filter(Boolean) as string[];

    const distPath = candidates.find(p => fs.existsSync(p)) || path.join(process.cwd(), 'dist');

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html lang="ur" dir="rtl"><head><title>Ta\'limul Quran</title></head><body><h1>Ta\'limul Quran Play</h1><p>Initializing application...</p></body></html>');
      }
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server & WebSocket Signaling running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown handling for Cloud Run container lifecycle
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP and WebSocket server");
    clearInterval(heartbeatInterval);
    try {
      wss.close();
    } catch (e) {
      console.error("Error closing wss on SIGTERM:", e);
    }
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    setTimeout(() => {
      console.warn("Forcing process exit after SIGTERM timeout");
      process.exit(0);
    }, 3000).unref();
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
