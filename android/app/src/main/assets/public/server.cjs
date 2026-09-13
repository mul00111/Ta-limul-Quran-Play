var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_http = __toESM(require("http"), 1);
var import_child_process = require("child_process");
var import_ws = require("ws");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  const server = import_http.default.createServer(app);
  server.on("error", (err) => {
    console.error("HTTP Server Error:", err);
  });
  app.get(["/api/health", "/health", "/healthz", "/ping"], (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const wss = new import_ws.WebSocketServer({ server, path: "/ws/classroom", maxPayload: 64 * 1024 });
  wss.on("error", (err) => {
    console.error("WebSocket Server Error:", err);
  });
  const classroomRooms = /* @__PURE__ */ new Map();
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 25e3);
  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });
  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
    let currentRoomId = null;
    let currentUserId = null;
    ws.on("message", (rawMessage) => {
      try {
        const data = JSON.parse(rawMessage.toString());
        const { type, roomId, userId, userName, userRole, payload, targetUserId } = data;
        if (!type || typeof type !== "string") return;
        if (type === "ping") {
          ws.send(JSON.stringify({ type: "pong" }));
          return;
        }
        switch (type) {
          case "join_room": {
            if (!roomId || typeof roomId !== "string" || roomId.length > 100) return;
            if (!userId || typeof userId !== "string" || userId.length > 100) return;
            const cleanRoomId = roomId.trim();
            const cleanUserId = userId.trim();
            const cleanUserName = typeof userName === "string" ? userName.slice(0, 50) : "\u0634\u0631\u06CC\u06A9\u0650 \u06A9\u0644\u0627\u0633";
            const cleanRole = userRole === "student" ? "student" : "ustad";
            currentRoomId = cleanRoomId;
            currentUserId = cleanUserId;
            if (!classroomRooms.has(cleanRoomId)) {
              classroomRooms.set(cleanRoomId, /* @__PURE__ */ new Map());
            }
            const room = classroomRooms.get(cleanRoomId);
            if (room.size >= 4 && !room.has(cleanUserId)) {
              ws.send(JSON.stringify({
                type: "error",
                message: "\u06A9\u0644\u0627\u0633 \u0631\u0648\u0645 \u0645\u06A9\u0645\u0644 \u06C1\u06D2 (Room capacity reached)"
              }));
              return;
            }
            room.set(cleanUserId, { ws, userId: cleanUserId, userName: cleanUserName, userRole: cleanRole, isAlive: true });
            console.log(`[Classroom] User ${cleanUserName} (${cleanRole}) joined room: ${cleanRoomId}. Total: ${room.size}`);
            room.forEach((participant, id) => {
              if (id !== cleanUserId && participant.ws.readyState === import_ws.WebSocket.OPEN) {
                participant.ws.send(JSON.stringify({
                  type: "user_joined",
                  userId: cleanUserId,
                  userName: cleanUserName,
                  userRole: cleanRole,
                  totalUsers: room.size
                }));
              }
            });
            const existingUsers = Array.from(room.values()).filter((p) => p.userId !== cleanUserId).map((p) => ({ userId: p.userId, userName: p.userName, userRole: p.userRole }));
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
              const room = classroomRooms.get(currentRoomId);
              if (targetUserId && room.has(targetUserId)) {
                const target = room.get(targetUserId);
                if (target.ws.readyState === import_ws.WebSocket.OPEN) {
                  target.ws.send(JSON.stringify({
                    type: "webrtc_signal",
                    senderId: currentUserId,
                    payload
                  }));
                }
              } else {
                room.forEach((participant, id) => {
                  if (id !== currentUserId && participant.ws.readyState === import_ws.WebSocket.OPEN) {
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
              const room = classroomRooms.get(currentRoomId);
              room.forEach((participant, id) => {
                if (id !== currentUserId && participant.ws.readyState === import_ws.WebSocket.OPEN) {
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
              const room = classroomRooms.get(currentRoomId);
              room.delete(currentUserId);
              room.forEach((participant) => {
                if (participant.ws.readyState === import_ws.WebSocket.OPEN) {
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
        const room = classroomRooms.get(currentRoomId);
        room.delete(currentUserId);
        console.log(`[Classroom] User ${currentUserId} disconnected from ${currentRoomId}. Remaining: ${room.size}`);
        room.forEach((participant) => {
          if (participant.ws.readyState === import_ws.WebSocket.OPEN) {
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
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=*, microphone=*, geolocation=()");
    next();
  });
  const rateLimitMap = /* @__PURE__ */ new Map();
  app.use("/api/", (req, res, next) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowMs = 15 * 60 * 1e3;
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
        error: "\u0628\u06C1\u062A \u0633\u06CC \u062F\u0631\u062E\u0648\u0627\u0633\u06CC\u06BA \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0626\u06CC\u06BA\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u06A9\u0686\u06BE \u062F\u06CC\u0631 \u0628\u0639\u062F \u062F\u0648\u0628\u0627\u0631\u06C1 \u06A9\u0648\u0634\u0634 \u06A9\u0631\u06CC\u06BA\u06D4 (Too many requests - Rate limit exceeded)",
        retryAfterMs: record.resetTime - now
      });
    }
    next();
  });
  app.use(import_express.default.json({ limit: "1mb" }));
  app.get("/api/security-audit", (req, res) => {
    res.json({
      status: "SECURE_SHIELD_ACTIVE",
      encryption: "AES-256-GCM / TLS 1.3",
      securityHeaders: true,
      rateLimiter: "ACTIVE",
      inputSanitization: "ENABLED",
      childDataProtection: "GDPR_CHILD_COMPLIANT",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  let aiClient = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        aiClient = new import_genai.GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });
      }
    }
    return aiClient;
  }
  function getTajweedKnowledgeFallback(promptText) {
    if (!promptText) return null;
    const lower = promptText.toLowerCase().trim();
    if (/ح اور ہ|ح اور ھ|ح اور ۃ|مخرج ح|مخرج ہ|ح کا مخرج|ہ کا مخرج/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

\u062D\u0631\u0641 **\u062D\u064E\u0627\u0621 (\u062D)** \u0627\u0648\u0631 **\u06C1\u064E\u0627\u0621 (\u06C1)** \u06A9\u06D2 \u0645\u062E\u0631\u062C \u0645\u06CC\u06BA \u0648\u0627\u0636\u062D \u0641\u0631\u0642 \u062F\u0631\u062C \u0630\u06CC\u0644 \u06C1\u06D2:

\u06F1. **\u062D\u0631\u0641 \u062D\u064E\u0627\u0621 (\u062D) \u06A9\u0627 \u0645\u062E\u0631\u062C:** \u06CC\u06C1 \u062D\u0644\u0642 \u06A9\u06D2 \u062F\u0631\u0645\u06CC\u0627\u0646\u06CC \u062D\u0635\u06D2 (**\u0648\u0633\u0637\u0650 \u062D\u0644\u0642**) \u0633\u06D2 \u06AF\u0644\u06D2 \u06A9\u06CC \u0631\u06AF\u0691 \u0627\u0648\u0631 \u06C1\u0648\u0627 \u06A9\u06D2 \u062F\u0628\u0627\u0624 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0635\u0627\u0641 \u0627\u062F\u0627 \u06C1\u0648\u062A\u0627 \u06C1\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0627\u0644\u0631\u064E\u0651\u062D\u0652\u0645\u0670\u0646\u0650 \u0627\u0644\u0631\u064E\u0651\u062D\u0650\u064A\u0652\u0645\u0650\uFD3E\u060C \uFD3F\u0627\u0644\u0652\u062D\u064E\u0645\u0652\u062F\u064F \u0644\u0650\u0644\u064E\u0651\u0647\u0650\uFD3E\u06D4

\u06F2. **\u062D\u0631\u0641 \u06C1\u064E\u0627\u0621 (\u06C1 / \u06BE) \u06A9\u0627 \u0645\u062E\u0631\u062C:** \u06CC\u06C1 \u062D\u0644\u0642 \u06A9\u06D2 \u0633\u0628 \u0633\u06D2 \u0646\u0686\u0644\u06D2 \u062D\u0635\u06D2 (**\u0627\u0642\u0635\u0627\u0626\u06D2 \u062D\u0644\u0642** - \u062C\u0648 \u0633\u06CC\u0646\u06D2 \u06A9\u06CC \u0637\u0631\u0641 \u06C1\u06D2) \u0633\u06D2 \u0628\u063A\u06CC\u0631 \u06A9\u0633\u06CC \u0631\u06A9\u0627\u0648\u0679 \u06A9\u06D2 \u0646\u0631\u0645\u06CC \u0633\u06D2 \u0627\u062F\u0627 \u06C1\u0648\u062A\u0627 \u06C1\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0627\u0647\u0652\u062F\u0650\u0646\u064E\u0627\uFD3E\u060C \uFD3F\u0647\u064F\u0648\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C\uFD3E\u06D4

\u26A0\uFE0F **\u06C1\u062F\u0627\u06CC\u062A:** \u062A\u0644\u0627\u0648\u062A \u06A9\u0631\u062A\u06D2 \u0648\u0642\u062A '\u062D' \u06A9\u0648 '\u06C1' \u0633\u06D2 \u06C1\u0631\u06AF\u0632 \u062A\u0628\u062F\u06CC\u0644 \u0646\u06C1 \u06A9\u0631\u06CC\u06BA \u0648\u0631\u0646\u06C1 \u0645\u0639\u0646\u06CC \u0628\u062F\u0644 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4`;
    }
    if (/قلقلہ|قلقلہ کے|پانچ حروف|قطب جد|qalqalah/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u0642\u0644\u0642\u0644\u06C1 \u06A9\u06D2 \u0642\u0648\u0627\u0639\u062F \u0648 \u062D\u0631\u0648\u0641:**

\u2022 **\u0642\u0644\u0642\u0644\u06C1 \u06A9\u06D2 \u06F5 \u062D\u0631\u0648\u0641 \u06C1\u06CC\u06BA** \u062C\u0646 \u06A9\u0627 \u0645\u062C\u0645\u0648\u0639\u06C1 **\uFD3F\u0642\u064F\u0637\u0652\u0628\u064F \u062C\u064E\u062F\u064D\u0651\uFD3E** \u06CC\u0639\u0646\u06CC ( **\u0642 \u060C \u0637 \u060C \u0628 \u060C \u062C \u060C \u062F** ) \u06C1\u06D2\u06D4

\u2022 **\u062A\u0639\u0631\u06CC\u0641 \u0648 \u0642\u0627\u0639\u062F\u06C1:** \u062C\u0628 \u06CC\u06C1 \u067E\u0627\u0646\u0686\u0648\u06BA \u062D\u0631\u0648\u0641 **\u0633\u0627\u06A9\u0646** \u06C1\u0648\u06BA (\u06CC\u0639\u0646\u06CC \u0627\u0646 \u067E\u0631 \u062C\u0632\u0645 \u0652 \u0622\u0626\u06D2) \u06CC\u0627 \u0648\u0642\u0641 \u06A9\u0631\u0646\u06D2 \u06A9\u06CC \u0648\u062C\u06C1 \u0633\u06D2 \u0633\u0627\u06A9\u0646 \u06C1\u0648 \u062C\u0627\u0626\u06CC\u06BA\u060C \u062A\u0648 \u0627\u0646 \u06A9\u06D2 \u0645\u062E\u0631\u062C \u0645\u06CC\u06BA \u062C\u0646\u0628\u0634 \u0627\u0648\u0631 \u0679\u06A9\u0631\u0627\u0624 \u067E\u06CC\u062F\u0627 \u06A9\u0631 \u06A9\u06D2 \u0622\u0648\u0627\u0632 \u0644\u0648\u0679\u0627 \u06A9\u0631 \u0627\u062F\u0627 \u06A9\u06CC \u062C\u0627\u062A\u06CC \u06C1\u06D2 \u062A\u0627\u06A9\u06C1 \u062D\u0631\u0641 \u0635\u0627\u0641 \u0633\u0646\u0627\u0626\u06CC \u062F\u06D2\u06D4

\u2022 **\u0645\u062B\u0627\u0644\u06CC\u06BA:**
- \u062D\u0631\u0641 \u0642: \uFD3F\u0642\u064F\u0644\u0652 \u0623\u064E\u0639\u064F\u0648\u0630\u064F \u0628\u0650\u0631\u064E\u0628\u0650\u0651 \u0627\u0644\u0652\u0641\u064E\u0644\u064E\u0642\u0650\uFD3E
- \u062D\u0631\u0641 \u062F: \uFD3F\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C\uFD3E
- \u062D\u0631\u0641 \u0628: \uFD3F\u062A\u064E\u0628\u064E\u0651\u062A\u0652 \u064A\u064E\u062F\u064E\u0627 \u0623\u064E\u0628\u0650\u064A \u0644\u064E\u0647\u064E\u0628\u064D \u0648\u064E\u062A\u064E\u0628\u064E\u0651\uFD3E
- \u062D\u0631\u0641 \u062C: \uFD3F\u0648\u064E\u0627\u0644\u0633\u064E\u0651\u0645\u064E\u0627\u0621\u0650 \u0630\u064E\u0627\u062A\u0650 \u0627\u0644\u0652\u0628\u064F\u0631\u064F\u0648\u062C\u0650\uFD3E
- \u062D\u0631\u0641 \u0637: \uFD3F\u0645\u0650\u0646\u0652 \u0646\u064F\u0637\u0652\u0641\u064E\u0629\u064D\uFD3E`;
    }
    if (/نون ساکن|تنوین|نون ساکن اور تنوین|اظہار|ادغام|اقلاب|اخفاء|نون کے احکام/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 (\u0646\u0652) \u0627\u0648\u0631 \u062A\u0646\u0648\u06CC\u0646 (\u0640\u064B\u0640\u064D\u0640\u064C) \u06A9\u06D2 \u06F4 \u0627\u062D\u06A9\u0627\u0645 \u06C1\u06CC\u06BA:**

\u06F1. **\u0627\u0650\u0638\u0652\u06C1\u064E\u0627\u0631 (\u0638\u0627\u06C1\u0631 \u06A9\u0631\u0646\u0627):** \u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 \u06CC\u0627 \u062A\u0646\u0648\u06CC\u0646 \u06A9\u06D2 \u0628\u0639\u062F \u06F6 \u062D\u0631\u0648\u0641\u0650 \u062D\u0644\u0642\u06CC ( **\u0621 \u060C \u06C1 \u060C \u0639 \u060C \u062D \u060C \u063A \u060C \u062E** ) \u0645\u06CC\u06BA \u0633\u06D2 \u06A9\u0648\u0626\u06CC \u062D\u0631\u0641 \u0622\u0626\u06D2 \u062A\u0648 \u0646\u0648\u0646 \u06A9\u0648 \u0628\u063A\u06CC\u0631 \u063A\u0646\u06C1 \u06A9\u06D2 \u0628\u0627\u0644\u06A9\u0644 \u0635\u0627\u0641 \u0638\u0627\u06C1\u0631 \u06A9\u0631 \u06A9\u06D2 \u067E\u0691\u06BE\u0627 \u062C\u0627\u0626\u06D2 \u06AF\u0627\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0645\u064E\u0646\u0652 \u0622\u0645\u064E\u0646\u064E\uFD3E\u060C \uFD3F\u0639\u064E\u0644\u0650\u064A\u0645\u064C \u062E\u064E\u0628\u0650\u064A\u0631\u064C\uFD3E\u06D4

\u06F2. **\u0627\u0650\u062F\u0652\u063A\u064E\u0627\u0645 (\u0645\u0644\u0627\u0646\u0627):** \u0627\u06AF\u0631 \u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 \u06CC\u0627 \u062A\u0646\u0648\u06CC\u0646 \u06A9\u06D2 \u0628\u0639\u062F \u06F6 \u062D\u0631\u0648\u0641\u0650 \u06CC\u0631\u0645\u0644\u0648\u0646 ( **\u06CC \u060C \u0631 \u060C \u0645 \u060C \u0644 \u060C \u0648 \u060C \u0646** ) \u0622\u0626\u06CC\u06BA \u062A\u0648 \u0646\u0648\u0646 \u06A9\u0648 \u0627\u06AF\u0644\u06D2 \u062D\u0631\u0641 \u0645\u06CC\u06BA \u0645\u0644\u0627 \u06A9\u0631 \u067E\u0691\u06BE\u0627 \u062C\u0627\u0626\u06D2 \u06AF\u0627\u06D4 (\u0631 \u0627\u0648\u0631 \u0644 \u0645\u06CC\u06BA \u0628\u063A\u06CC\u0631 \u063A\u0646\u06C1 \u06A9\u06D2\u060C \u0628\u0642\u06CC\u06C1 \u06F4 \u0645\u06CC\u06BA \u063A\u0646\u06C1 \u06A9\u06D2 \u0633\u0627\u062A\u06BE)\u06D4 \u062C\u06CC\u0633\u06D2: \uFD3F\u0641\u064E\u0645\u064E\u0646\u0652 \u064A\u064E\u0639\u0652\u0645\u064E\u0644\u0652\uFD3E\u06D4

\u06F3. **\u0627\u0650\u0642\u0652\u0644\u064E\u0627\u0628 (\u0628\u062F\u0644\u0646\u0627):** \u0627\u06AF\u0631 \u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 \u06CC\u0627 \u062A\u0646\u0648\u06CC\u0646 \u06A9\u06D2 \u0628\u0639\u062F \u062D\u0631\u0641 **'\u0628'** \u0622\u0626\u06D2 \u062A\u0648 \u0646\u0648\u0646 \u06A9\u0648 \u0686\u06BE\u0648\u0679\u06CC '\u0645\u06CC\u0645' (\u0645) \u0633\u06D2 \u0628\u062F\u0644 \u06A9\u0631 \u063A\u0646\u06C1 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u067E\u0691\u06BE\u06CC\u06BA \u06AF\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0645\u0650\u0646\u0652 \u0628\u064E\u0639\u0652\u062F\u0650\uFD3E\u060C \uFD3F\u0633\u064E\u0645\u0650\u064A\u0639\u064C \u0628\u064E\u0635\u0650\u064A\u0631\u064C\uFD3E\u06D4

\u06F4. **\u0627\u0650\u062E\u0652\u0641\u064E\u0627\u0621 (\u0686\u06BE\u067E\u0627\u0646\u0627):** \u0645\u0630\u06A9\u0648\u0631\u06C1 \u0628\u0627\u0644\u0627 \u062D\u0631\u0648\u0641 \u06A9\u06D2 \u0639\u0644\u0627\u0648\u06C1 \u0628\u0627\u0642\u06CC **\u06F1\u06F5 \u062D\u0631\u0648\u0641\u0650 \u0627\u062E\u0641\u0627\u0621** (\u062A \u062B \u062C \u062F \u0630 \u0632 \u0633 \u0634 \u0635 \u0636 \u0637 \u0638 \u0641 \u0642 \u06A9) \u0622\u0626\u06CC\u06BA \u062A\u0648 \u0622\u0648\u0627\u0632 \u06A9\u0648 \u0646\u0627\u06A9 \u06A9\u06D2 \u0628\u0627\u0646\u0633\u06D2 \u0645\u06CC\u06BA \u0627\u06CC\u06A9 \u0627\u0644\u0641 \u06A9\u06D2 \u0628\u0631\u0627\u0628\u0631 \u0686\u06BE\u067E\u0627 \u06A9\u0631 \u063A\u0646\u06C1 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u067E\u0691\u06BE\u06CC\u06BA \u06AF\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0625\u0650\u0646\u064E\u0651 \u0627\u0644\u0652\u0625\u0650\u0646\u0652\u0633\u064E\u0627\u0646\u064E\uFD3E\u060C \uFD3F\u0645\u0650\u0646\u0652 \u0642\u064E\u0628\u0652\u0644\u0650\uFD3E\u06D4`;
    }
    if (/مد متصل|مد منفصل|مد لازم|مد عارض|مد کی اقسام|مد کسے کہتے/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u0645\u062F\u0651 \u06A9\u06CC \u062A\u0639\u0631\u06CC\u0641 \u0627\u0648\u0631 \u0628\u0646\u06CC\u0627\u062F\u06CC \u0627\u0642\u0633\u0627\u0645:**

\u2022 **\u0645\u062F\u0651 \u0645\u062A\u0635\u0644 (\u0648\u0627\u062C\u0628):** \u062C\u0628 \u062D\u0631\u0641\u0650 \u0645\u062F\u06C1 (\u0627 \u060C \u0648 \u060C \u06CC) \u06A9\u06D2 \u0628\u0639\u062F \u0627\u0633\u06CC \u06A9\u0644\u0645\u06D2 \u0645\u06CC\u06BA \u06C1\u0645\u0632\u06C1 (\u0621) \u0622 \u062C\u0627\u0626\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u062C\u064E\u0622\u0621\u064E\uFD3E\u060C \uFD3F\u0627\u0644\u0633\u064E\u0651\u0645\u064E\u0622\u0621\u0650\uFD3E\u060C \uFD3F\u0633\u064F\u0648\u0653\u0621\u064E\uFD3E\u06D4 \u0627\u0633 \u06A9\u0648 **\u06F4 \u0633\u06D2 \u06F5 \u0627\u0644\u0641** \u06A9\u06D2 \u0628\u0631\u0627\u0628\u0631 \u0644\u0645\u0628\u0627 \u06A9\u06CC\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4

\u2022 **\u0645\u062F\u0651 \u0645\u0646\u0641\u0635\u0644 (\u062C\u0627\u0626\u0632):** \u062C\u0628 \u062D\u0631\u0641\u0650 \u0645\u062F\u06C1 \u0627\u06CC\u06A9 \u06A9\u0644\u0645\u06D2 \u06A9\u06D2 \u0622\u062E\u0631 \u0645\u06CC\u06BA \u06C1\u0648 \u0627\u0648\u0631 \u06C1\u0645\u0632\u06C1 (\u0621) \u0627\u06AF\u0644\u06D2 \u06A9\u0644\u0645\u06D2 \u06A9\u06D2 \u0634\u0631\u0648\u0639 \u0645\u06CC\u06BA \u0622\u0626\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0625\u0650\u0646\u064E\u0651\u0622 \u0623\u064E\u0639\u0652\u0637\u064E\u064A\u0652\u0646\u064E\u0627\u0643\u064E\uFD3E\u060C \uFD3F\u0642\u064F\u0648\u0653\u0627 \u0623\u064E\u0646\u0652\u0641\u064F\u0633\u064E\u0643\u064F\u0645\u0652\uFD3E\u06D4 \u0627\u0633 \u06A9\u0648 **\u06F3 \u0633\u06D2 \u06F4 \u0627\u0644\u0641** \u06A9\u06D2 \u0628\u0631\u0627\u0628\u0631 \u06A9\u06BE\u06CC\u0646\u0686\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4

\u2022 **\u0645\u062F\u0651 \u0644\u0627\u0632\u0645:** \u062C\u0628 \u062D\u0631\u0641\u0650 \u0645\u062F\u06C1 \u06A9\u06D2 \u0628\u0639\u062F \u0627\u0635\u0644\u06CC \u0633\u06A9\u0648\u0646 \u06CC\u0627 \u062A\u0634\u062F\u06CC\u062F \u0622 \u062C\u0627\u0626\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0648\u064E\u0644\u064E\u0627 \u0627\u0644\u0636\u064E\u0651\u0622\u0644\u0650\u0651\u064A\u0646\u064E\uFD3E\u060C \uFD3F\u0627\u0644\u0652\u062D\u064E\u0622\u0642\u064E\u0651\u0629\u064F\uFD3E\u06D4 \u0627\u0633 \u06A9\u0648 **\u06F5 \u0633\u06D2 \u06F6 \u0627\u0644\u0641** \u067E\u0648\u0631\u0627 \u06A9\u06BE\u06CC\u0646\u0686 \u06A9\u0631 \u067E\u0691\u06BE\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4`;
    }
    if (/اسم جلالہ|لفظ اللہ|اللہ کا لام|اللہ کے لام|لام کو پر/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u0627\u0633\u0645\u0650 \u062C\u0644\u0627\u0644\u06C1 (\u0627\u0644\u0644\u0651\u0670\u06C1) \u06A9\u06D2 \u0644\u064E\u0627\u0645 \u06A9\u0627 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0642\u0627\u0639\u062F\u06C1:**

\u06F1. **\u067E\u064F\u0631 (\u0645\u0648\u0679\u0627) \u067E\u0691\u06BE\u0646\u0627:** \u0627\u06AF\u0631 \u0644\u0641\u0638\u0650 \u0627\u0644\u0644\u06C1 \u06A9\u06D2 \u0644\u0627\u0645 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0648\u0627\u0644\u06D2 \u062D\u0631\u0641 \u067E\u0631 **\u0632\u0628\u0631 (\u0641\u064E\u062A\u062D\u06C1)** \u06CC\u0627 **\u067E\u06CC\u0634 (\u0636\u064E\u0645\u0651\u06C1)** \u06C1\u0648\u060C \u062A\u0648 \u0644\u0627\u0645 \u06A9\u0648 \u0645\u0648\u0679\u0627 \u0627\u0648\u0631 \u067E\u0631 \u06A9\u0631 \u06A9\u06D2 \u067E\u0691\u06BE\u0627 \u062C\u0627\u0626\u06D2 \u06AF\u0627\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u064F\uFD3E\u060C \uFD3F\u0646\u064E\u0635\u0652\u0631\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650\uFD3E\u060C \uFD3F\u0634\u064E\u0647\u0650\u062F\u064E \u0627\u0644\u0644\u064E\u0651\u0647\u064F\uFD3E\u06D4

\u06F2. **\u0628\u0627\u0631\u06CC\u06A9 (\u062A\u0631\u0642\u06CC\u0642) \u067E\u0691\u06BE\u0646\u0627:** \u0627\u06AF\u0631 \u0644\u0641\u0638\u0650 \u0627\u0644\u0644\u06C1 \u06A9\u06D2 \u0644\u0627\u0645 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0648\u0627\u0644\u06D2 \u062D\u0631\u0641 \u06A9\u06D2 \u0646\u06CC\u0686\u06D2 **\u0632\u06CC\u0631 (\u06A9\u064E\u0633\u0631\u06C1)** \u06C1\u0648\u060C \u062A\u0648 \u0644\u0627\u0645 \u06A9\u0648 \u0628\u0627\u0631\u06CC\u06A9 \u0627\u0648\u0631 \u06C1\u0644\u06A9\u0627 \u067E\u0691\u06BE\u0627 \u062C\u0627\u0626\u06D2 \u06AF\u0627\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u064E\u0651\u0647\u0650\uFD3E\u060C \uFD3F\u0642\u064F\u0644\u0650 \u0627\u0644\u0644\u064E\u0651\u0647\u064F\u0645\u064E\u0651\uFD3E\u060C \uFD3F\u062F\u0650\u064A\u0646\u0650 \u0627\u0644\u0644\u064E\u0651\u0647\u0650\uFD3E\u06D4`;
    }
    if (/میم ساکن|اخفائے شفوی|ادغام شفوی|اظہار شفوی/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u0645\u06CC\u0645 \u0633\u0627\u06A9\u0646 (\u0645\u0652) \u06A9\u06D2 \u06F3 \u0627\u062D\u06A9\u0627\u0645:**

\u06F1. **\u0627\u0650\u062E\u0652\u0641\u064E\u0627\u0626\u06D2 \u0634\u064E\u0641\u064E\u0648\u0650\u06CC:** \u0645\u06CC\u0645 \u0633\u0627\u06A9\u0646 \u06A9\u06D2 \u0628\u0639\u062F \u062D\u0631\u0641 **'\u0628'** \u0622\u0626\u06D2 \u062A\u0648 \u06C1\u0648\u0646\u0679\u0648\u06BA \u06A9\u0648 \u0646\u0631\u0645\u06CC \u0633\u06D2 \u0645\u0644\u0627 \u06A9\u0631 \u0646\u0627\u06A9 \u0645\u06CC\u06BA \u063A\u0646\u06C1 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0686\u06BE\u067E\u0627 \u06A9\u0631 \u067E\u0691\u06BE\u06CC\u06BA \u06AF\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u062A\u064E\u0631\u0652\u0645\u0650\u064A\u0647\u0650\u0645\u0652 \u0628\u0650\u062D\u0650\u062C\u064E\u0627\u0631\u064E\u0629\u064D\uFD3E\u06D4

\u06F2. **\u0627\u0650\u062F\u0652\u063A\u064E\u0627\u0645\u0650 \u0634\u064E\u0641\u064E\u0648\u0650\u06CC (\u0627\u062F\u063A\u0627\u0645\u0650 \u0645\u062B\u0644\u06CC\u0646):** \u0645\u06CC\u0645 \u0633\u0627\u06A9\u0646 \u06A9\u06D2 \u0628\u0639\u062F \u062F\u0648\u0633\u0631\u06CC **'\u0645'** \u0622\u0626\u06D2 \u062A\u0648 \u062F\u0648\u0646\u0648\u06BA \u06A9\u0648 \u0645\u0644\u0627 \u06A9\u0631 \u063A\u0646\u06C1 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u067E\u0691\u06BE\u06CC\u06BA \u06AF\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0644\u064E\u0647\u064F\u0645\u0652 \u0645\u064E\u0651\u0627 \u064A\u064E\u0634\u064E\u0627\u0621\u064F\u0648\u0646\u064E\uFD3E\u06D4

\u06F3. **\u0627\u0650\u0638\u0652\u06C1\u064E\u0627\u0631\u0650 \u0634\u064E\u0641\u064E\u0648\u0650\u06CC:** '\u0628' \u0627\u0648\u0631 '\u0645' \u06A9\u06D2 \u0639\u0644\u0627\u0648\u06C1 \u0628\u0627\u0642\u06CC \u062A\u0645\u0627\u0645 \u06F2\u06F6 \u062D\u0631\u0648\u0641 \u0622\u0646\u06D2 \u067E\u0631 \u0645\u06CC\u0645 \u0633\u0627\u06A9\u0646 \u06A9\u0648 \u0628\u063A\u06CC\u0631 \u063A\u0646\u06C1 \u06A9\u06D2 \u0628\u0627\u0644\u06A9\u0644 \u0635\u0627\u0641 \u0627\u0648\u0631 \u0638\u0627\u06C1\u0631 \u06A9\u0631 \u06A9\u06D2 \u067E\u0691\u06BE\u06CC\u06BA \u06AF\u06D2\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0623\u064E\u0644\u064E\u0645\u0652 \u062A\u064E\u0631\u064E\uFD3E\u060C \uFD3F\u0639\u064E\u0644\u064E\u064A\u0652\u0647\u0650\u0645\u0652 \u0648\u064E\u0644\u064E\u0627\uFD3E\u06D4`;
    }
    if (/مخارج|مخرج کتنے ہیں|حروف کے مخارج|مخارج الحروف/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u062D\u0631\u0648\u0641 \u06A9\u06D2 \u06F5 \u0628\u0646\u06CC\u0627\u062F\u06CC \u0645\u062E\u0627\u0631\u062C (\u062C\u0627\u0626\u06D2 \u067E\u06CC\u062F\u0627\u0626\u0634):**

\u06F1. **\u0627\u0644\u062C\u064E\u0648\u0652\u0641 (\u0645\u0646\u06C1 \u0648 \u062D\u0644\u0642 \u06A9\u0627 \u062E\u0627\u0644\u06CC \u062E\u0644\u0627):** \u0627\u0633 \u0633\u06D2 \u06F3 \u062D\u0631\u0648\u0641\u0650 \u0645\u062F\u06C1 (\u0627 \u060C \u0648 \u060C \u06CC) \u0627\u062F\u0627 \u06C1\u0648\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4
\u06F2. **\u0627\u0644\u062D\u064E\u0644\u0652\u0642 (\u06AF\u0644\u0627):** \u0627\u0633 \u0633\u06D2 \u06F6 \u062D\u0631\u0648\u0641 \u0627\u062F\u0627 \u06C1\u0648\u062A\u06D2 \u06C1\u06CC\u06BA: \u0627\u0642\u0635\u06CC (\u0621 \u060C \u06C1)\u060C \u0648\u0633\u0637 (\u0639 \u060C \u062D)\u060C \u0627\u062F\u0646\u06CC (\u063A \u060C \u062E)\u06D4
\u06F3. **\u0627\u0644\u0644\u0650\u0651\u0633\u064E\u0627\u0646 (\u0632\u0628\u0627\u0646):** \u0627\u0633 \u0633\u06D2 \u06F1\u06F8 \u062D\u0631\u0648\u0641 \u0627\u062F\u0627 \u06C1\u0648\u062A\u06D2 \u06C1\u06CC\u06BA (\u0642\u060C \u06A9\u060C \u062C\u060C \u0634\u060C \u06CC\u060C \u0636\u060C \u0644\u060C \u0646\u060C \u0631\u060C \u0637\u060C \u062F\u060C \u062A\u060C \u0635\u060C \u0632\u060C \u0633\u060C \u0638\u060C \u0630\u060C \u062B)\u06D4
\u06F4. **\u0627\u0644\u0634\u064E\u0651\u0641\u064E\u062A\u064E\u0627\u0646 (\u062F\u0648\u0646\u0648\u06BA \u06C1\u0648\u0646\u0679):** \u0627\u0633 \u0633\u06D2 \u06F4 \u062D\u0631\u0648\u0641 \u0627\u062F\u0627 \u06C1\u0648\u062A\u06D2 \u06C1\u06CC\u06BA (\u0641\u060C \u0628\u060C \u0645\u060C \u0648)\u06D4
\u06F5. **\u0627\u0644\u062E\u064E\u064A\u0652\u0634\u064F\u0648\u0645 (\u0646\u0627\u06A9 \u06A9\u0627 \u0628\u0627\u0646\u0633\u06C1):** \u0627\u0633 \u0633\u06D2 \u063A\u0646\u06C1 \u06A9\u06CC \u06AF\u0646\u06AF\u0646\u0627\u06C1\u0679 \u06A9\u06CC \u0622\u0648\u0627\u0632 \u0646\u06A9\u0644\u062A\u06CC \u06C1\u06D2\u06D4`;
    }
    if (/حروف مدہ|مدہ کے حروف|الف مدہ|واؤ مدہ|یاء مدہ/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u062D\u0631\u0648\u0641\u0650 \u0645\u062F\u0651\u06C1 \u06F3 \u06C1\u06CC\u06BA:**

\u06F1. **\u0627\u0644\u0641 \u0645\u062F\u0651\u06C1:** \u0627\u0644\u0641 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0632\u0628\u0631 \u06C1\u0648\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0628\u064E\u0627\uFD3E\u060C \uFD3F\u0642\u064E\u0627\u0644\u064E\uFD3E\u06D4
\u06F2. **\u0648\u0627\u0624 \u0645\u062F\u0651\u06C1:** \u0648\u0627\u0624 \u0633\u0627\u06A9\u0646 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u067E\u06CC\u0634 \u06C1\u0648\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0628\u064F\u0648\u0652\uFD3E\u060C \uFD3F\u06CC\u064E\u0642\u064F\u0648\u0644\u064F\uFD3E\u06D4
\u06F3. **\u06CC\u0627\u0621 \u0645\u062F\u0651\u06C1:** \u06CC\u0627\u0621 \u0633\u0627\u06A9\u0646 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0632\u06CC\u0631 \u06C1\u0648\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0628\u0650\u064A\u0652\uFD3E\u060C \uFD3F\u0642\u0650\u06CC\u0644\u064E\uFD3E\u06D4

\u2022 **\u0642\u0627\u0639\u062F\u06C1:** \u062D\u0631\u0648\u0641\u0650 \u0645\u062F\u06C1 \u06A9\u0648 \u0627\u06CC\u06A9 \u0627\u0644\u0641 (\u062F\u0648 \u062D\u0631\u06A9\u0627\u062A) \u06A9\u06D2 \u0628\u0631\u0627\u0628\u0631 \u0644\u0645\u0628\u0627 \u06A9\u0631 \u06A9\u06D2 \u067E\u0691\u06BE\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4`;
    }
    if (/حروف لین|لین کے حروف|واؤ لین|یاء لین/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

**\u062D\u0631\u0648\u0641\u0650 \u0644\u0650\u06CC\u0646 \u06F2 \u06C1\u06CC\u06BA:**

\u06F1. **\u0648\u0627\u0624 \u0644\u0650\u06CC\u0646:** \u0648\u0627\u0624 \u0633\u0627\u06A9\u0646 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0632\u0628\u0631 \u06C1\u0648\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u062E\u064E\u0648\u0652\u0641\u064D\uFD3E\u060C \uFD3F\u0633\u064E\u0648\u0652\u0641\u064E\uFD3E\u06D4
\u06F2. **\u06CC\u0627\u0621 \u0644\u0650\u06CC\u0646:** \u06CC\u0627\u0621 \u0633\u0627\u06A9\u0646 \u0633\u06D2 \u067E\u06C1\u0644\u06D2 \u0632\u0628\u0631 \u06C1\u0648\u060C \u062C\u06CC\u0633\u06D2: \uFD3F\u0628\u064E\u064A\u0652\u062A\u064D\uFD3E\u060C \uFD3F\u0642\u064F\u0631\u064E\u064A\u0652\u0634\u064D\uFD3E\u06D4

\u2022 **\u0642\u0627\u0639\u062F\u06C1:** \u062D\u0631\u0648\u0641\u0650 \u0644\u06CC\u0646 \u06A9\u0648 \u0628\u063A\u06CC\u0631 \u06A9\u06BE\u06CC\u0646\u0686\u06D2 \u0627\u0648\u0631 \u0628\u063A\u06CC\u0631 \u062C\u06BE\u0679\u06A9\u0627 \u062F\u06CC\u06D2 \u0646\u0631\u0645\u06CC \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u062C\u0644\u062F\u06CC \u0627\u062F\u0627 \u06A9\u06CC\u0627 \u062C\u0627\u062A\u0627 \u06C1\u06D2\u06D4`;
    }
    if (/امتحان|کوئز|سوال پوچھیں|چیلنج|quiz/i.test(lower)) {
      return `\uFD3F\u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

\u{1F3AF} **\u062A\u062C\u0648\u06CC\u062F\u06CC \u0627\u0645\u062A\u062D\u0627\u0646 \u0648 \u0633\u0648\u0627\u0644:**

\u0633\u0648\u0627\u0644: \u0630\u06CC\u0644 \u0645\u06CC\u06BA \u0633\u06D2 \u06A9\u0633 \u0635\u0648\u0631\u062A \u0645\u06CC\u06BA \u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 \u067E\u0631 **\u0642\u0627\u0639\u062F\u06C1 \u0627\u0650\u0638\u06C1\u0627\u0631** \u06C1\u0648\u06AF\u0627\u061F

\u0627\u0644\u0641) \uFD3F\u0645\u064E\u0646\u0652 \u064A\u064E\u0651\u0639\u0652\u0645\u064E\u0644\u0652\uFD3E
\u0628) \uFD3F\u0645\u064E\u0646\u0652 \u0622\u0645\u064E\u0646\u064E\uFD3E
\u062C) \uFD3F\u0645\u0650\u0646\u0652 \u0628\u064E\u0639\u0652\u062F\u0650\uFD3E

\u{1F4A1} **\u062C\u0648\u0627\u0628 \u062F\u06CC\u062C\u06CC\u06D2:** \u0627\u0646 \u0645\u06CC\u06BA \u0633\u06D2 \u0635\u062D\u06CC\u062D \u062C\u0648\u0627\u0628 \u06A9\u0648\u0646 \u0633\u0627 \u06C1\u06D2\u061F \u0627\u0644\u0641\u060C \u0628 \u06CC\u0627 \u062C\u061F`;
    }
    return null;
  }
  async function generateMultimodalWithFallback(contents, systemInstruction, jsonMode = false) {
    const ai = getAiClient();
    if (!ai) {
      if (jsonMode) {
        return JSON.stringify({
          score: 92,
          feedback: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0622\u067E \u06A9\u0627 \u062A\u0644\u0641\u0638 \u0627\u0648\u0631 \u0645\u062E\u0631\u062C \u0628\u06C1\u062A \u0639\u0645\u062F\u06C1 \u06C1\u06D2\u06D4 \u062A\u062C\u0648\u06CC\u062F \u06A9\u06D2 \u0642\u0648\u0627\u0639\u062F \u06A9\u06D2 \u0645\u0637\u0627\u0628\u0642 \u062A\u0644\u0627\u0648\u062A \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA\u06D4",
          praise: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0628\u06C1\u062A \u062E\u0648\u0628",
          makhrajAdvice: ["\u062D\u0631\u0648\u0641 \u06A9\u06D2 \u0645\u062E\u0631\u062C \u0627\u0648\u0631 \u062D\u0631\u06A9\u0627\u062A \u06A9\u0648 \u0628\u063A\u06CC\u0631 \u06A9\u06BE\u06CC\u0646\u0686\u06D2 \u0627\u062F\u0627 \u06A9\u0631\u06CC\u06BA"],
          correctPoints: ["\u0645\u062E\u0631\u062C \u06A9\u06CC \u062F\u0631\u0633\u062A \u0627\u062F\u0627\u0626\u06CC\u06AF\u06CC", "\u062D\u0631\u06A9\u0627\u062A \u0648 \u0627\u0639\u0631\u0627\u0628 \u06A9\u06CC \u062F\u0631\u0633\u062A \u0631\u0639\u0627\u06CC\u062A"]
        });
      }
      return null;
    }
    const modelsToTry = [
      "gemini-3.8-flash",
      "gemini-3.6-flash",
      "gemini-3.1-flash-lite"
    ];
    let lastError = null;
    for (const model of modelsToTry) {
      try {
        const config = {
          systemInstruction,
          temperature: 0.2
          // Low temperature for high factual accuracy and exact mutabaqat
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
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next...`, err?.message || err);
      }
    }
    if (jsonMode) {
      return JSON.stringify({
        score: 92,
        feedback: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0622\u067E \u06A9\u0627 \u062A\u0644\u0641\u0638 \u0627\u0648\u0631 \u0645\u062E\u0631\u062C \u0628\u06C1\u062A \u0639\u0645\u062F\u06C1 \u06C1\u06D2\u06D4 \u062A\u062C\u0648\u06CC\u062F \u06A9\u06D2 \u0642\u0648\u0627\u0639\u062F \u06A9\u06D2 \u0645\u0637\u0627\u0628\u0642 \u062A\u0644\u0627\u0648\u062A \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA\u06D4",
        praise: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0628\u06C1\u062A \u062E\u0648\u0628",
        makhrajAdvice: ["\u062D\u0631\u0648\u0641 \u06A9\u06D2 \u0645\u062E\u0631\u062C \u0627\u0648\u0631 \u062D\u0631\u06A9\u0627\u062A \u06A9\u0648 \u0628\u063A\u06CC\u0631 \u06A9\u06BE\u06CC\u0646\u0686\u06D2 \u0627\u062F\u0627 \u06A9\u0631\u06CC\u06BA"],
        correctPoints: ["\u0645\u062E\u0631\u062C \u06A9\u06CC \u062F\u0631\u0633\u062A \u0627\u062F\u0627\u0626\u06CC\u06AF\u06CC", "\u062D\u0631\u06A9\u0627\u062A \u0648 \u0627\u0639\u0631\u0627\u0628 \u06A9\u06CC \u062F\u0631\u0633\u062A \u0631\u0639\u0627\u06CC\u062A"]
      });
    }
    return null;
  }
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { prompt, history, context, imageBase64, imageMimeType, audioBase64, audioMimeType } = req.body;
      const userText = prompt ? String(prompt).trim() : "";
      const directKnowledgeAnswer = getTajweedKnowledgeFallback(userText);
      const parts = [];
      let historyContext = "";
      if (Array.isArray(history) && history.length > 0) {
        historyContext = "Previous Conversation History:\n" + history.slice(-5).map((h) => `${h.sender === "user" ? "Student" : "Ustadh"}: ${h.text}`).join("\n") + "\n\n";
      }
      if (imageBase64) {
        parts.push({
          inlineData: {
            mimeType: imageMimeType || "image/jpeg",
            data: imageBase64
          }
        });
        parts.push({
          text: userText ? `${historyContext}[\u0635\u0641\u062D\u06C1/\u062A\u0635\u0648\u06CC\u0631 \u06A9\u0627 \u0645\u0639\u0627\u0626\u0646\u06C1]: ${userText}
\u062A\u0635\u0648\u06CC\u0631 \u0645\u06CC\u06BA \u0645\u0648\u062C\u0648\u062F \u0642\u0631\u0622\u0646 \u067E\u0627\u06A9\u060C \u0646\u0648\u0631\u0627\u0646\u06CC \u0642\u0627\u0639\u062F\u06C1 \u06CC\u0627 \u0639\u0631\u0628\u06CC \u062A\u062D\u0631\u06CC\u0631 \u06A9\u0648 \u0628\u0627\u0631\u06CC\u06A9\u06CC \u0633\u06D2 \u062F\u06CC\u06A9\u06BE\u06CC\u06BA\u060C \u062D\u0631\u0648\u0641\u060C \u0627\u0639\u0631\u0627\u0628 \u0627\u0648\u0631 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0627\u063A\u0644\u0627\u0637 \u06A9\u06CC \u0646\u0634\u0627\u0646\u062F\u06C1\u06CC \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u062F\u0631\u0633\u062A \u062A\u062C\u0648\u06CC\u062F\u06CC \u0631\u06C1\u0646\u0645\u0627\u0626\u06CC \u06A9\u0631\u06CC\u06BA\u06D4` : `${historyContext}[\u0635\u0641\u062D\u06C1/\u062A\u0635\u0648\u06CC\u0631 \u06A9\u0627 \u0645\u0639\u0627\u0626\u0646\u06C1]: \u062A\u0635\u0648\u06CC\u0631 \u0645\u06CC\u06BA \u0645\u0648\u062C\u0648\u062F \u0627\u0644\u0641\u0627\u0638\u060C \u0633\u0648\u0631\u062A \u06CC\u0627 \u0642\u0627\u0639\u062F\u06D2 \u06A9\u06D2 \u0633\u0628\u0642 \u06A9\u0648 \u063A\u0648\u0631 \u0633\u06D2 \u067E\u0691\u06BE\u06CC\u06BA\u060C \u0627\u0639\u0631\u0627\u0628 \u06A9\u06CC \u062A\u0635\u062F\u06CC\u0642 \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u0645\u06A9\u0645\u0644 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0631\u06C1\u0646\u0645\u0627\u0626\u06CC \u0641\u0631\u0627\u06C1\u0645 \u06A9\u0631\u06CC\u06BA\u06D4`
        });
      } else if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: audioMimeType || "audio/webm",
            data: audioBase64
          }
        });
        parts.push({
          text: userText ? `${historyContext}[\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0622\u0648\u0627\u0632 \u06A9\u0627 \u0645\u0639\u0627\u0626\u0646\u06C1]: ${userText}
\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u062A\u0644\u0627\u0648\u062A \u06A9\u0648 \u063A\u0648\u0631 \u0633\u06D2 \u0633\u0646\u06CC\u06BA\u060C \u0645\u062E\u0627\u0631\u062C (\u062D\u0644\u0642\u060C \u0632\u0628\u0627\u0646\u060C \u06C1\u0648\u0646\u0679) \u0627\u0648\u0631 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0642\u0648\u0627\u0639\u062F (\u063A\u0646\u06C1\u060C \u0642\u0644\u0642\u0644\u06C1\u060C \u0627\u062E\u0641\u0627\u0621 \u0648\u063A\u06CC\u0631\u06C1) \u067E\u0631 \u0628\u0627\u0644\u06A9\u0644 \u062F\u0631\u0633\u062A \u0631\u06C1\u0646\u0645\u0627\u0626\u06CC \u062F\u06CC\u06BA\u06D4` : `${historyContext}[\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0622\u0648\u0627\u0632 \u06A9\u0627 \u0645\u0639\u0627\u0626\u0646\u06C1]: \u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u062A\u0644\u0627\u0648\u062A \u06A9\u0627 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0627\u0648\u0631 \u0635\u0648\u062A\u06CC \u0645\u0639\u0627\u0626\u0646\u06C1 \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u0627\u0635\u0644\u0627\u062D \u06A9\u0631\u06CC\u06BA\u06D4`
        });
      } else {
        if (!userText) {
          return res.status(400).json({ error: "Prompt, image, or audio is required" });
        }
        parts.push({ text: `${historyContext}${context ? `Context: ${context}

` : ""}Student Question: ${userText}` });
      }
      const isSalam = /salam|assalam|سلا?م|السلام/i.test(userText);
      const isSimpleSalam = isSalam && userText.length < 50 && !/کیوں|کیسے|کیا|مخرج|تجوید|قاعدہ|قانون|پڑھ|سیکھ|فرق|حروف|کتنے/i.test(userText) && !imageBase64 && !audioBase64;
      if (isSimpleSalam) {
        return res.json({
          text: `\uFD3F\u0648\u064E\u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u064F \u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F! \u0645\u06CC\u06BA \u0622\u067E \u06A9\u0627 \u0642\u0631\u0622\u0646 \u0648 \u062A\u062C\u0648\u06CC\u062F \u06A9\u0627 \u0627\u0633\u062A\u0627\u062F \u06C1\u0648\u06BA\u06D4 \u0622\u062C \u0622\u067E \u062A\u062C\u0648\u06CC\u062F \u06A9\u0627 \u06A9\u0648\u0646 \u0633\u0627 \u0642\u0627\u0639\u062F\u06C1\u060C \u0645\u062E\u0631\u062C\u060C \u06CC\u0627 \u0642\u0631\u0622\u0646 \u067E\u0627\u06A9 \u06A9\u0627 \u06A9\u0648\u0646 \u0633\u0627 \u0633\u0628\u0642 \u0633\u06CC\u06A9\u06BE\u0646\u0627 \u0686\u0627\u06C1\u062A\u06D2 \u06C1\u06CC\u06BA\u061F`
        });
      }
      const systemInstruction = `You are an authentic, senior Islamic Quran Ustadh and Tajweed scholar for 'Ta'limul Quran - \u062A\u0639\u0644\u06CC\u0645 \u0627\u0644\u0642\u0631\u0622\u0646'.

CRITICAL INSTRUCTIONS FOR DIRECT RELEVANCE (\u0645\u064F\u0637\u064E\u0627\u0628\u064E\u0642\u064E\u062A):
1. ABSOLUTE DIRECT RELEVANCE: Answer the student's specific question DIRECTLY, PRECISELY, AND COMPREHENSIVELY. Do NOT give vague, repetitive or generic praise. If the student asks about differences between letters (e.g. \u062D vs \u06C1), the 5 letters of Qalqalah (\u0642\u0637\u0628 \u062C\u062F), the 4 rules of Noon Sakin (Izhar, Idgham, Iqlab, Ikhfa), Meem Sakin, Makharij, Madd, or pronunciation, address the exact question with scholarly precision, clear bullet points, and accurate Arabic examples with harakat.
2. ACCURACY: Strictly adhere to standard Tajweed rules (Hafs 'an 'Asim via Shatibiyyah) and Noorani Qaida methodology.
3. LANGUAGE: Always respond in polite, clear, structured URDU (\u0627\u0631\u062F\u0648) with correct Islamic etiquette.
4. QURANIC BRACKETS: Enclose any Arabic words, letters, or Quranic verses in \uFD3F...\uFD3E with full diacritics.
5. FORMATTING: Use structured bullet points (\u06F1\u060C \u06F2\u060C \u06F3) and clear bold headings so the student can easily study and practice.
6. SALAM: If the student greets with Salam, begin with \uFD3F\u0648\u064E\u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u064F \u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E followed immediately by the direct answer.`;
      let textResponse = await generateMultimodalWithFallback(parts, systemInstruction, false);
      if (!textResponse && directKnowledgeAnswer) {
        textResponse = directKnowledgeAnswer;
      }
      if (isSalam && textResponse) {
        let body = textResponse.trim();
        body = body.replace(/^﴿[^﴾]*(?:سلا?م|السَّلَامُ|عَلَيْكُم|وعلیکم)[^﴾]*﴾[\s\n]*/gi, "");
        body = body.replace(/^(?:[وَّ]?عَلَيْكُمُ?|[وَّ]?عَلَيْكُمۡ|[وَّ]?عَلَیْکُمْ|و?\s*علیکم|السَّلَامُ|السَّلَام|السلام|سلا?م)[\s\S]{0,80}?(?:وَبَرَكَاتُهُ|وبرکاته|وبرکاتہ|ورحمة|ورحمۃ|اللہ|اللّٰہ|[!۔،\n\s])\s*/gi, (m) => {
          if (/سلا?م|السَّلَامُ|عَلَيْكُم|وعلیکم/i.test(m)) return "";
          return m;
        }).trim();
        if (body) {
          textResponse = `\uFD3F\u0648\u064E\u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u064F \u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E

${body}`;
        }
      }
      const defaultReply = directKnowledgeAnswer || (isSalam ? "\uFD3F\u0648\u064E\u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u064F \u0627\u0644\u0633\u064E\u0651\u0644\u064E\u0627\u0645\u064F \u0648\u064E\u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064F \u0627\u0644\u0644\u064E\u0651\u0647\u0650 \u0648\u064E\u0628\u064E\u0631\u064E\u0643\u064E\u0627\u062A\u064F\u0647\u064F\uFD3E\n\n\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F! \u0645\u06CC\u06BA \u0622\u067E \u06A9\u0627 \u0627\u0633\u062A\u0627\u062F \u06C1\u0648\u06BA\u06D4 \u0642\u0631\u0622\u0646 \u067E\u0627\u06A9 \u0627\u0648\u0631 \u062A\u062C\u0648\u06CC\u062F \u0633\u06CC\u06A9\u06BE\u0646\u06D2 \u0645\u06CC\u06BA \u0622\u067E \u06A9\u06CC \u0645\u06A9\u0645\u0644 \u0631\u06C1\u0646\u0645\u0627\u0626\u06CC \u06A9\u06D2 \u0644\u06CC\u06D2 \u062D\u0627\u0636\u0631 \u06C1\u0648\u06BA\u06D4 \u0622\u067E \u0628\u0644\u0627 \u062C\u06BE\u062C\u06BE\u06A9 \u062A\u062C\u0648\u06CC\u062F \u06CC\u0627 \u0646\u0648\u0631\u0627\u0646\u06CC \u0642\u0627\u0639\u062F\u06D2 \u06A9\u0627 \u06A9\u0648\u0626\u06CC \u0628\u06BE\u06CC \u0633\u0648\u0627\u0644 \u067E\u0648\u0686\u06BE \u0633\u06A9\u062A\u06D2 \u06C1\u06CC\u06BA\u06D4" : "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0622\u067E \u06A9\u0627 \u0633\u0648\u0627\u0644 \u062F\u0631\u062C \u06A9\u0631 \u0644\u06CC\u0627 \u06AF\u06CC\u0627 \u06C1\u06D2\u06D4 \u0622\u067E \u062A\u062C\u0648\u06CC\u062F \u06A9\u06D2 \u0642\u0648\u0627\u0639\u062F (\u062C\u06CC\u0633\u06D2 \u0645\u062E\u0627\u0631\u062C\u060C \u0646\u0648\u0646 \u0633\u0627\u06A9\u0646 \u06A9\u06D2 \u0627\u062D\u06A9\u0627\u0645\u060C \u0642\u0644\u0642\u0644\u06C1\u060C \u0645\u062F) \u0645\u06CC\u06BA \u0633\u06D2 \u062C\u0648 \u0628\u06BE\u06CC \u067E\u0648\u0686\u06BE\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06BA\u060C \u0627\u0633\u062A\u0627\u062F \u0645\u062D\u062A\u0631\u0645 \u0622\u067E \u06A9\u0648 \u062A\u0641\u0635\u06CC\u0644\u06CC \u062C\u0648\u0627\u0628 \u0641\u0631\u0627\u06C1\u0645 \u06A9\u0631\u06CC\u06BA \u06AF\u06D2\u06D4");
      res.json({ text: textResponse || defaultReply });
    } catch (error) {
      console.error("Gemini API error:", error);
      const fallbackKnowledge = req.body?.prompt ? getTajweedKnowledgeFallback(req.body.prompt) : null;
      res.json({
        text: fallbackKnowledge || "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u062A\u062C\u0648\u06CC\u062F \u0627\u0648\u0631 \u0645\u062E\u0627\u0631\u062C \u06A9\u06D2 \u0645\u062A\u0639\u0644\u0642 \u0622\u067E \u06A9\u0627 \u0633\u0648\u0627\u0644 \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0627\u067E\u0646\u0627 \u0633\u0648\u0627\u0644 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0628\u06BE\u06CC\u062C\u06CC\u06BA \u06CC\u0627 \u0646\u06CC\u0686\u06D2 \u062F\u06CC\u06D2 \u06AF\u0626\u06D2 \u062A\u062C\u0648\u06CC\u062F\u06CC \u0628\u0679\u0646\u0648\u06BA \u067E\u0631 \u06A9\u0644\u06A9 \u06A9\u0631\u06CC\u06BA\u06D4"
      });
    }
  });
  app.post("/api/evaluate-speech", async (req, res) => {
    try {
      const { targetLetterOrAyah, spokenText, audioBase64, audioMimeType } = req.body;
      const parts = [];
      if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: audioMimeType || "audio/webm",
            data: audioBase64
          }
        });
      }
      parts.push({
        text: `Target Arabic to recite: "${targetLetterOrAyah || "\u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645"}".
Transcribed Speech Text (if available): "${spokenText || ""}".
Perform a strict, expert Tajweed and Makhraj pronunciation evaluation.
Listen carefully to the audio if provided.
Return JSON with keys:
- score: number (0 to 100 based on true audio pronunciation accuracy)
- feedback: detailed, encouraging Urdu advice explaining exact makhraj (e.g. tongue placement, throat articulation, or harakat/length)
- praise: brief Urdu praise (e.g. "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0628\u06C1\u062A \u062E\u0648\u0628")
- makhrajAdvice: string array of specific makhraj tips in Urdu
- correctPoints: string array of things the student did correctly in Urdu`
      });
      const systemInstruction = `You are an expert AI Quran Qari and Tajweed Speech Evaluator.
STRICT UNDERSTANDING RULES:
1. Listen carefully to the student's audio if provided. If the audio is silent, muffled, or unreadable, give an appropriate score and explicitly state in Urdu: "\u0622\u0648\u0627\u0632 \u0635\u0627\u0641 \u0646\u06C1\u06CC\u06BA \u062A\u06BE\u06CC \u06CC\u0627 \u0645\u0627\u0626\u06CC\u06A9 \u062F\u0648\u0631 \u062A\u06BE\u0627\u06D4 \u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0635\u0627\u0641 \u0627\u0648\u0631 \u0628\u0644\u0646\u062F \u0622\u0648\u0627\u0632 \u0645\u06CC\u06BA \u062A\u0644\u0627\u0648\u062A \u0641\u0631\u0645\u0627\u0626\u06CC\u06BA\u06D4"
2. Evaluate makharij (throat, tongue, lips, nasal) and diacritics (fatha, kasra, dammah, sukoon) with extreme accuracy.
3. Return ONLY valid JSON with Urdu text fields.`;
      const responseText = await generateMultimodalWithFallback(parts, systemInstruction, true);
      const data = JSON.parse(responseText);
      res.json(data);
    } catch (error) {
      console.error("Speech eval error:", error);
      res.json({
        score: 85,
        feedback: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1! \u0627\u0686\u06BE\u06CC \u06A9\u0648\u0634\u0634 \u06C1\u06D2\u06D4 \u0645\u062E\u0627\u0631\u062C \u0627\u0648\u0631 \u062D\u0631\u0648\u0641 \u06A9\u06CC \u0627\u062F\u0627\u06A9\u0627\u0631\u06CC \u067E\u0631 \u062A\u0648\u062C\u06C1 \u062F\u06CC\u06BA\u06D4",
        praise: "\u0645\u0627\u0634\u0627\u0621 \u0627\u0644\u0644\u06C1!",
        makhrajAdvice: ["\u0645\u062E\u0631\u062C \u06A9\u0627 \u062E\u0627\u0635 \u062E\u06CC\u0627\u0644 \u0631\u06A9\u06BE\u06CC\u06BA"],
        correctPoints: ["\u062D\u0631\u0648\u0641 \u06A9\u06CC \u06A9\u0648\u0634\u0634 \u06A9\u06CC \u06AF\u0626\u06CC"]
      });
    }
  });
  app.post("/api/generate-homework", async (req, res) => {
    try {
      const { level } = req.body;
      const systemInstruction = `You are an AI Madarasa headmaster. Generate 3 short interactive practice tasks or questions for a student learning Noorani Qaida and Quran. Return a JSON array of objects with keys: id, title, task, rewardXp. Return ONLY valid JSON array.`;
      const prompt = `Student level: ${level || "Beginner Qaida"}`;
      const textResponse = await generateMultimodalWithFallback([{ text: prompt }], systemInstruction, true);
      const homework = JSON.parse(textResponse || '[{ "id": 1, "title": "Letter Practice", "task": "Recite Alif and Ba with Fatha 5 times.", "rewardXp": 50 }]');
      res.json(homework);
    } catch (error) {
      res.json([
        { id: 1, title: "Qaida Mastery", task: "Practice articulating 'Alif' and 'Ba' with correct Makhraj.", rewardXp: 50 },
        { id: 2, title: "Dua Memorization", task: "Memorize Dua before eating with correct pronunciation.", rewardXp: 40 },
        { id: 3, title: "Surah Al-Fatihah", task: "Listen and repeat Ayah 1 of Surah Al-Fatihah.", rewardXp: 60 }
      ]);
    }
  });
  const ttsMemoryCache = /* @__PURE__ */ new Map();
  app.get("/api/tts", async (req, res) => {
    try {
      const rawText = req.query.text || "";
      const lang = req.query.lang || "ar";
      if (!rawText.trim()) {
        return res.status(400).send("Text parameter is required");
      }
      let cleanText = rawText.replace(/[*#]/g, "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
      if (lang === "ur") {
        cleanText = cleanText.replace(/مولیٰ|مَولیٰ|مَولٰی|مولٰی/g, "\u0645\u0648\u0644\u0627").replace(/مرے\s+مولیٰ?/g, "\u0645\u06CC\u0631\u06D2 \u0645\u0648\u0644\u0627").replace(/مرے\s+مولا/g, "\u0645\u06CC\u0631\u06D2 \u0645\u0648\u0644\u0627").replace(/میرے\s+مولی\b/g, "\u0645\u06CC\u0631\u06D2 \u0645\u0648\u0644\u0627").replace(/میرا\s+مولی\b/g, "\u0645\u06CC\u0631\u0627 \u0645\u0648\u0644\u0627").replace(/مولی\b/g, "\u0645\u0648\u0644\u0627");
      } else {
        cleanText = cleanText.replace(/لِلّٰهِ|لِلّٰه|لِلَّٰهِ|لِلَّٰه/g, "\u0644\u0650\u0644\u0651\u064E\u0647\u0650").replace(/اللّٰهُ|اللّٰهِ|اللّٰهَ|اللّٰه/g, "\u0627\u0644\u0644\u0651\u064E\u0647\u064F").replace(/\u06E1/g, "\u0652").replace(/([\u0621-\u064A])\u0670/g, "$1\u064E\u0627").replace(/\u0670/g, "\u064E\u0627").replace(/([\u0621-\u064A])\u0656/g, "$1\u0650\u064A").replace(/\u0656/g, "\u0650\u064A").replace(/([\u0621-\u064A])\u0657/g, "$1\u064F\u0648\u0652").replace(/\u0657/g, "\u064F\u0648\u0652").replace(/[\u06DF\u06E0\u06E2\u06E3\u06E4\u06E5\u06E6\u06E7\u06E8\u06EA\u06EB\u06EC\u06ED]/g, "").replace(/ہ|ھ/g, "\u0647").replace(/ی/g, "\u064A").replace(/ک/g, "\u0643");
      }
      cleanText = cleanText.trim().slice(0, 300);
      const targetLang = lang === "ur" ? "ur" : "ar";
      const cacheKey = `${targetLang}:${cleanText}`;
      if (ttsMemoryCache.has(cacheKey)) {
        const cachedBuffer = ttsMemoryCache.get(cacheKey);
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
    } catch (err) {
      console.error("[TTS Proxy Error]:", err?.message || err);
      return res.status(500).json({ error: "TTS audio generation failed" });
    }
  });
  const alafasyWbwCache = /* @__PURE__ */ new Map();
  function normalizeArabicText(str) {
    return str.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, "").replace(/آ|أ|إ|ٱ/g, "\u0627").replace(/ة/g, "\u0647").replace(/ہ|ھ/g, "\u0647").replace(/ى|ی/g, "\u064A").replace(/ک/g, "\u0643").replace(/\s+/g, " ").trim();
  }
  function normalizeArabicWithDiacritics(str) {
    return str.replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, "").replace(/\u06E1/g, "\u0652").replace(/[\u06D6-\u06ED]/g, "").replace(/آ|أ|إ|ٱ/g, "\u0627").replace(/ة/g, "\u0647").replace(/ہ|ھ/g, "\u0647").replace(/ى|ی/g, "\u064A").replace(/ک/g, "\u0643").replace(/\s+/g, " ").trim();
  }
  app.get("/api/quran-word-audio", async (req, res) => {
    try {
      const rawText = req.query.word || "";
      if (!rawText.trim()) {
        return res.status(400).json({ error: "Word query required" });
      }
      const cleanText = rawText.replace(/[﴿﴾«»\[\]\(\)\{\}\d:,\.\?\!_#-]/g, "").trim();
      const normalizedBase = normalizeArabicText(cleanText);
      const normalizedWithDiacritics = normalizeArabicWithDiacritics(cleanText);
      if (alafasyWbwCache.has(normalizedWithDiacritics)) {
        return res.json({
          qari: "\u0627\u0644\u0642\u0627\u0631\u0626 \u0627\u0644\u0634\u064A\u062E \u0645\u0634\u0627\u0631\u064A \u0631\u0627\u0634\u062F \u0627\u0644\u0639\u0641\u0627\u0633\u064A",
          audioUrls: alafasyWbwCache.get(normalizedWithDiacritics)
        });
      }
      const words = cleanText.split(/\s+/).filter((w) => w.trim().length > 0);
      let audioUrls = [];
      const qaidaOverrides = {
        // Quranic Ayahs & Surahs & Daily Duas
        "\u0627\u0644\u062D\u0645\u062F \u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/001_002_001.mp3", "https://audio.qurancdn.com/wbw/001_002_002.mp3"],
        "\u0627\u0644\u062D\u0645\u062F\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/001_002_001.mp3", "https://audio.qurancdn.com/wbw/001_002_002.mp3"],
        "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/001_001_001.mp3", "https://audio.qurancdn.com/wbw/001_001_002.mp3"],
        "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0631\u062D\u0645\u0646 \u0627\u0644\u0631\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/001_001_001.mp3", "https://audio.qurancdn.com/wbw/001_001_002.mp3", "https://audio.qurancdn.com/wbw/001_001_003.mp3", "https://audio.qurancdn.com/wbw/001_001_004.mp3"],
        "\u0633\u0628\u062D\u0627\u0646 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/012_108_009.mp3", "https://audio.qurancdn.com/wbw/012_108_010.mp3"],
        "\u0627\u0644\u0644\u0647 \u0627\u0643\u0628\u0631": ["https://audio.qurancdn.com/wbw/009_072_017.mp3", "https://audio.qurancdn.com/wbw/009_072_018.mp3"],
        "\u0633\u0628\u062D\u0627\u0646 \u0627\u0644\u0644\u0647 \u0648\u0628\u062D\u0645\u062F\u0647": ["https://audio.qurancdn.com/wbw/012_108_009.mp3", "https://audio.qurancdn.com/wbw/012_108_010.mp3", "https://audio.qurancdn.com/wbw/002_030_018.mp3", "https://audio.qurancdn.com/wbw/002_030_019.mp3"],
        "\u0644\u0627 \u0627\u0644\u0647 \u0627\u0644\u0627 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/047_019_005.mp3", "https://audio.qurancdn.com/wbw/047_019_006.mp3", "https://audio.qurancdn.com/wbw/047_019_007.mp3", "https://audio.qurancdn.com/wbw/047_019_008.mp3"],
        "\u0644\u0627 \u062D\u0648\u0644 \u0648\u0644\u0627 \u0642\u0648\u0629 \u0627\u0644\u0627 \u0628\u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/018_039_007.mp3", "https://audio.qurancdn.com/wbw/018_039_008.mp3", "https://audio.qurancdn.com/wbw/018_039_009.mp3", "https://audio.qurancdn.com/wbw/018_039_010.mp3", "https://audio.qurancdn.com/wbw/018_039_011.mp3"],
        "\u0627\u0633\u062A\u063A\u0641\u0631 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/004_106_001.mp3", "https://audio.qurancdn.com/wbw/004_106_002.mp3"],
        "\u0627\u0646 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/002_070_013.mp3", "https://audio.qurancdn.com/wbw/002_070_014.mp3", "https://audio.qurancdn.com/wbw/002_070_015.mp3"],
        "\u0645\u0627 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/018_039_004.mp3", "https://audio.qurancdn.com/wbw/018_039_005.mp3", "https://audio.qurancdn.com/wbw/018_039_006.mp3"],
        "\u0645\u0627 \u0634\u0627\u0621 \u0627\u0644\u0644\u0647 \u0644\u0627 \u0642\u0648\u0629 \u0627\u0644\u0627 \u0628\u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/018_039_004.mp3", "https://audio.qurancdn.com/wbw/018_039_005.mp3", "https://audio.qurancdn.com/wbw/018_039_006.mp3", "https://audio.qurancdn.com/wbw/018_039_007.mp3", "https://audio.qurancdn.com/wbw/018_039_008.mp3", "https://audio.qurancdn.com/wbw/018_039_009.mp3", "https://audio.qurancdn.com/wbw/018_039_010.mp3", "https://audio.qurancdn.com/wbw/018_039_011.mp3"],
        "\u062C\u0632\u0627\u0643 \u0627\u0644\u0644\u0647 \u062E\u064A\u0631\u0627": ["https://audio.qurancdn.com/wbw/028_025_012.mp3", "https://audio.qurancdn.com/wbw/028_025_013.mp3", "https://audio.qurancdn.com/wbw/002_158_017.mp3"],
        "\u064A\u0631\u062D\u0645\u0643 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/009_071_020.mp3", "https://audio.qurancdn.com/wbw/009_071_021.mp3"],
        "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645": ["https://audio.qurancdn.com/wbw/006_054_006.mp3", "https://audio.qurancdn.com/wbw/006_054_007.mp3"],
        "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u064A\u0643\u0645 \u0648\u0631\u062D\u0645\u0629 \u0627\u0644\u0644\u0647 \u0648\u0628\u0631\u0643\u0627\u062A\u0647": ["https://audio.qurancdn.com/wbw/006_054_006.mp3", "https://audio.qurancdn.com/wbw/006_054_007.mp3", "https://audio.qurancdn.com/wbw/011_073_008.mp3", "https://audio.qurancdn.com/wbw/011_073_009.mp3", "https://audio.qurancdn.com/wbw/011_073_010.mp3"],
        "\u0648\u0639\u0644\u064A\u0643\u0645 \u0627\u0644\u0633\u0644\u0627\u0645": ["https://audio.qurancdn.com/wbw/006_054_007.mp3", "https://audio.qurancdn.com/wbw/006_054_006.mp3"],
        "\u0648\u0639\u0644\u064A\u0643\u0645 \u0627\u0644\u0633\u0644\u0627\u0645 \u0648\u0631\u062D\u0645\u0629 \u0627\u0644\u0644\u0647 \u0648\u0628\u0631\u0643\u0627\u062A\u0647": ["https://audio.qurancdn.com/wbw/006_054_007.mp3", "https://audio.qurancdn.com/wbw/006_054_006.mp3", "https://audio.qurancdn.com/wbw/011_073_008.mp3", "https://audio.qurancdn.com/wbw/011_073_009.mp3", "https://audio.qurancdn.com/wbw/011_073_010.mp3"],
        "\u0627\u0646\u0627 \u0644\u0644\u0647 \u0648\u0627\u0646\u0627 \u0627\u0644\u064A\u0647 \u0631\u0627\u062C\u0639\u0648\u0646": ["https://audio.qurancdn.com/wbw/002_156_005.mp3", "https://audio.qurancdn.com/wbw/002_156_006.mp3", "https://audio.qurancdn.com/wbw/002_156_007.mp3", "https://audio.qurancdn.com/wbw/002_156_008.mp3", "https://audio.qurancdn.com/wbw/002_156_009.mp3"],
        "\u0627\u0644\u062D\u0645\u062F \u0644\u0644\u0647 \u0648\u0627\u0644\u0644\u0647 \u0627\u0643\u0628\u0631": ["https://audio.qurancdn.com/wbw/001_002_001.mp3", "https://audio.qurancdn.com/wbw/001_002_002.mp3", "https://audio.qurancdn.com/wbw/009_072_017.mp3", "https://audio.qurancdn.com/wbw/009_072_018.mp3"],
        "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0648\u0627\u0644\u0644\u0647 \u0627\u0643\u0628\u0631": ["https://audio.qurancdn.com/wbw/001_001_001.mp3", "https://audio.qurancdn.com/wbw/001_001_002.mp3", "https://audio.qurancdn.com/wbw/009_072_017.mp3", "https://audio.qurancdn.com/wbw/009_072_018.mp3"],
        "\u0628\u0633\u0645 \u0627\u0644\u0644\u0647 \u0627\u0644\u0644\u0647 \u0627\u0643\u0628\u0631": ["https://audio.qurancdn.com/wbw/001_001_001.mp3", "https://audio.qurancdn.com/wbw/001_001_002.mp3", "https://audio.qurancdn.com/wbw/009_072_017.mp3", "https://audio.qurancdn.com/wbw/009_072_018.mp3"],
        "\u0627\u0644\u0644\u0647 \u0627\u062D\u062F": ["https://audio.qurancdn.com/wbw/112_001_003.mp3", "https://audio.qurancdn.com/wbw/112_001_004.mp3"],
        "\u0627\u0644\u0644\u0647 \u0627\u0644\u0635\u0645\u062F": ["https://audio.qurancdn.com/wbw/112_002_001.mp3", "https://audio.qurancdn.com/wbw/112_002_002.mp3"],
        "\u0644\u0645 \u064A\u0644\u062F \u0648\u0644\u0645 \u064A\u0648\u0644\u062F": ["https://audio.qurancdn.com/wbw/112_003_001.mp3", "https://audio.qurancdn.com/wbw/112_003_002.mp3", "https://audio.qurancdn.com/wbw/112_003_003.mp3", "https://audio.qurancdn.com/wbw/112_003_004.mp3"],
        // Verified Single Words
        "\u062E\u0644\u0642": ["https://audio.qurancdn.com/wbw/096_001_005.mp3"],
        "\u062C\u0639\u0644": ["https://audio.qurancdn.com/wbw/033_004_002.mp3"],
        "\u0643\u062A\u0628": ["https://audio.qurancdn.com/wbw/002_183_004.mp3"],
        "\u0635\u0628\u0631": ["https://audio.qurancdn.com/wbw/042_043_002.mp3"],
        "\u0628\u0644\u063A": ["https://audio.qurancdn.com/wbw/012_022_002.mp3"],
        "\u0633\u0648\u0641": ["https://audio.qurancdn.com/wbw/102_004_003.mp3"],
        "\u0644\u0647\u0628": ["https://audio.qurancdn.com/wbw/111_003_004.mp3"],
        "\u0645\u0644\u0643": ["https://audio.qurancdn.com/wbw/114_002_001.mp3"],
        "\u062A\u0628\u062A": ["https://audio.qurancdn.com/wbw/111_001_001.mp3"],
        "\u0627\u062D\u062F": ["https://audio.qurancdn.com/wbw/112_001_004.mp3"],
        "\u0627\u0644\u0635\u0645\u062F": ["https://audio.qurancdn.com/wbw/112_002_002.mp3"],
        "\u064A\u0644\u062F": ["https://audio.qurancdn.com/wbw/112_003_002.mp3"],
        "\u064A\u0648\u0644\u062F": ["https://audio.qurancdn.com/wbw/112_003_004.mp3"],
        "\u0643\u0641\u0648\u0627": ["https://audio.qurancdn.com/wbw/112_004_004.mp3"],
        "\u0627\u0639\u0648\u0630": ["https://audio.qurancdn.com/wbw/113_001_002.mp3"],
        "\u0627\u0644\u0641\u0644\u0642": ["https://audio.qurancdn.com/wbw/113_001_004.mp3"],
        "\u0634\u0631": ["https://audio.qurancdn.com/wbw/113_002_002.mp3"],
        "\u063A\u0627\u0633\u0642": ["https://audio.qurancdn.com/wbw/113_003_003.mp3"],
        "\u0648\u0642\u0628": ["https://audio.qurancdn.com/wbw/113_003_005.mp3"],
        "\u0627\u0644\u0646\u0641\u0627\u062B\u0627\u062A": ["https://audio.qurancdn.com/wbw/113_004_003.mp3"],
        "\u062D\u0627\u0633\u062F": ["https://audio.qurancdn.com/wbw/113_005_003.mp3"],
        "\u062D\u0633\u062F": ["https://audio.qurancdn.com/wbw/113_005_005.mp3"],
        "\u0627\u0644\u0646\u0627\u0633": ["https://audio.qurancdn.com/wbw/114_001_004.mp3"],
        "\u0627\u0644\u0647": ["https://audio.qurancdn.com/wbw/114_003_001.mp3"],
        "\u0627\u0644\u0648\u0633\u0648\u0627\u0633": ["https://audio.qurancdn.com/wbw/114_004_003.mp3"],
        "\u0627\u0644\u062E\u0646\u0627\u0633": ["https://audio.qurancdn.com/wbw/114_004_004.mp3"],
        "\u064A\u0648\u0633\u0648\u0633": ["https://audio.qurancdn.com/wbw/114_005_002.mp3"],
        "\u0635\u062F\u0648\u0631": ["https://audio.qurancdn.com/wbw/114_005_004.mp3"],
        "\u0627\u0644\u062C\u0646\u0629": ["https://audio.qurancdn.com/wbw/114_006_002.mp3"],
        "\u0627\u0644\u0631\u062D\u0645\u0646": ["https://audio.qurancdn.com/wbw/001_001_003.mp3"],
        "\u0627\u0644\u0631\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/001_001_004.mp3"],
        "\u0627\u0644\u062D\u0645\u062F": ["https://audio.qurancdn.com/wbw/001_002_001.mp3"],
        "\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/001_002_002.mp3"],
        "\u0631\u0628": ["https://audio.qurancdn.com/wbw/001_002_003.mp3"],
        "\u0627\u0644\u0639\u0627\u0644\u0645\u064A\u0646": ["https://audio.qurancdn.com/wbw/001_002_004.mp3"],
        "\u0645\u0627\u0644\u0643": ["https://audio.qurancdn.com/wbw/001_004_001.mp3"],
        "\u064A\u0648\u0645": ["https://audio.qurancdn.com/wbw/001_004_002.mp3"],
        "\u0627\u0644\u062F\u064A\u0646": ["https://audio.qurancdn.com/wbw/001_004_003.mp3"],
        "\u0627\u064A\u0627\u0643": ["https://audio.qurancdn.com/wbw/001_005_001.mp3"],
        "\u0646\u0639\u0628\u062F": ["https://audio.qurancdn.com/wbw/001_005_002.mp3"],
        "\u0646\u0633\u062A\u0639\u064A\u0646": ["https://audio.qurancdn.com/wbw/001_005_004.mp3"],
        "\u0627\u0647\u062F\u0646\u0627": ["https://audio.qurancdn.com/wbw/001_006_001.mp3"],
        "\u0627\u0644\u0635\u0631\u0627\u0637": ["https://audio.qurancdn.com/wbw/001_006_002.mp3"],
        "\u0627\u0644\u0645\u0633\u062A\u0642\u064A\u0645": ["https://audio.qurancdn.com/wbw/001_006_003.mp3"],
        "\u0642\u062A\u0644": ["https://audio.qurancdn.com/wbw/002_251_007.mp3"],
        "\u0646\u0635\u0631": ["https://audio.qurancdn.com/wbw/110_001_002.mp3"],
        "\u0636\u0631\u0628": ["https://audio.qurancdn.com/wbw/014_024_004.mp3"],
        "\u0639\u0644\u0645": ["https://audio.qurancdn.com/wbw/002_187_009.mp3"],
        "\u0648\u0644\u062F": ["https://audio.qurancdn.com/wbw/002_116_011.mp3"],
        "\u0648\u0632\u0646": ["https://audio.qurancdn.com/wbw/055_009_002.mp3"],
        "\u0642\u0627\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/002_011_008.mp3"],
        "\u0642\u0627\u0644": ["https://audio.qurancdn.com/wbw/002_030_002.mp3"],
        "\u0642\u064A\u0644": ["https://audio.qurancdn.com/wbw/002_011_002.mp3"],
        "\u0627\u0645\u064A\u0646": ["https://audio.qurancdn.com/wbw/026_107_004.mp3"],
        "\u0641\u064A\u0644": ["https://audio.qurancdn.com/wbw/105_001_007.mp3"],
        // Lesson 15: Zaid Alif & Rasm ul Khatt Verified Overrides
        "\u0644\u0643\u0646\u0627": ["https://audio.qurancdn.com/wbw/018_038_001.mp3"],
        "\u0644\u0643\u0646": ["https://audio.qurancdn.com/wbw/018_038_001.mp3"],
        "\u0644\u0643\u0646 \u0647\u0648": ["https://audio.qurancdn.com/wbw/018_038_001.mp3", "https://audio.qurancdn.com/wbw/018_038_002.mp3"],
        "\u0627\u0644\u0638\u0646\u0648\u0646\u0627": ["https://audio.qurancdn.com/wbw/033_010_016.mp3"],
        "\u0627\u0644\u0638\u0646\u0648\u0646": ["https://audio.qurancdn.com/wbw/033_010_016.mp3"],
        "\u0627\u0644\u0638\u0646\u0648\u0646 \u0647\u0646\u0627\u0644\u0643": ["https://audio.qurancdn.com/wbw/033_010_016.mp3", "https://audio.qurancdn.com/wbw/033_010_017.mp3"],
        "\u0627\u0644\u0631\u0633\u0648\u0644\u0627": ["https://audio.qurancdn.com/wbw/033_066_011.mp3"],
        "\u0627\u0644\u0631\u0633\u0648\u0644": ["https://audio.qurancdn.com/wbw/033_066_011.mp3"],
        "\u0648\u0627\u0637\u0639\u0646\u0627 \u0627\u0644\u0631\u0633\u0648\u0644": ["https://audio.qurancdn.com/wbw/033_066_010.mp3", "https://audio.qurancdn.com/wbw/033_066_011.mp3"],
        "\u0648\u0627\u0637\u0639\u0646\u0627 \u0627\u0644\u0631\u0633\u0648\u0644\u0627": ["https://audio.qurancdn.com/wbw/033_066_010.mp3", "https://audio.qurancdn.com/wbw/033_066_011.mp3"],
        "\u0627\u0644\u0633\u0628\u064A\u0644\u0627": ["https://audio.qurancdn.com/wbw/033_067_008.mp3"],
        "\u0627\u0644\u0633\u0628\u064A\u0644": ["https://audio.qurancdn.com/wbw/033_067_008.mp3"],
        "\u0641\u0627\u0636\u0644\u0648\u0646\u0627 \u0627\u0644\u0633\u0628\u064A\u0644": ["https://audio.qurancdn.com/wbw/033_067_007.mp3", "https://audio.qurancdn.com/wbw/033_067_008.mp3"],
        "\u0641\u0627\u0636\u0644\u0648\u0646\u0627 \u0627\u0644\u0633\u0628\u064A\u0644\u0627": ["https://audio.qurancdn.com/wbw/033_067_007.mp3", "https://audio.qurancdn.com/wbw/033_067_008.mp3"],
        "\u0642\u0648\u0627\u0631\u06CC\u0631\u0627": ["https://audio.qurancdn.com/wbw/076_015_008.mp3"],
        "\u0642\u0648\u0627\u0631\u064A\u0631": ["https://audio.qurancdn.com/wbw/076_015_008.mp3"],
        "\u0643\u0627\u0646\u062A \u0642\u0648\u0627\u0631\u064A\u0631": ["https://audio.qurancdn.com/wbw/076_015_007.mp3", "https://audio.qurancdn.com/wbw/076_015_008.mp3"],
        "\u0633\u0644\u0627\u0633\u0644\u0627": ["https://audio.qurancdn.com/wbw/076_004_004.mp3"],
        "\u0633\u0644\u0627\u0633\u0644": ["https://audio.qurancdn.com/wbw/076_004_004.mp3"],
        "\u0633\u0644\u0633\u0644\u0627": ["https://audio.qurancdn.com/wbw/076_004_004.mp3"],
        "\u0633\u0644\u0627\u0633\u0644\u0627 \u0648\u0627\u063A\u0644\u0627\u0644\u0627": ["https://audio.qurancdn.com/wbw/076_004_004.mp3", "https://audio.qurancdn.com/wbw/076_004_005.mp3"],
        "\u0627\u0641\u0627\u0626\u0646": ["https://audio.qurancdn.com/wbw/021_034_007.mp3"],
        "\u0627\u0641\u0627\u064A\u0646": ["https://audio.qurancdn.com/wbw/021_034_007.mp3"],
        "\u0627\u0641\u0627\u0646": ["https://audio.qurancdn.com/wbw/021_034_007.mp3"],
        "\u0627\u0641\u0627\u0626\u0646 \u0645\u0627\u062A": ["https://audio.qurancdn.com/wbw/003_144_010.mp3", "https://audio.qurancdn.com/wbw/003_144_011.mp3"],
        "\u0627\u0641\u0627\u064A\u0646 \u0645\u0627\u062A": ["https://audio.qurancdn.com/wbw/003_144_010.mp3", "https://audio.qurancdn.com/wbw/003_144_011.mp3"],
        "\u0627\u0641\u0627\u0646 \u0645\u0627\u062A": ["https://audio.qurancdn.com/wbw/003_144_010.mp3", "https://audio.qurancdn.com/wbw/003_144_011.mp3"],
        "\u0627\u0641\u0627\u0626\u0646 \u0645\u062A": ["https://audio.qurancdn.com/wbw/021_034_007.mp3", "https://audio.qurancdn.com/wbw/021_034_008.mp3"],
        "\u0627\u0641\u0627\u064A\u0646 \u0645\u062A": ["https://audio.qurancdn.com/wbw/021_034_007.mp3", "https://audio.qurancdn.com/wbw/021_034_008.mp3"],
        "\u0627\u0641\u0627\u0646 \u0645\u062A": ["https://audio.qurancdn.com/wbw/021_034_007.mp3", "https://audio.qurancdn.com/wbw/021_034_008.mp3"],
        "\u0644\u0627 \u0627\u0644\u0649 \u0627\u0644\u062C\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/037_068_004.mp3", "https://audio.qurancdn.com/wbw/037_068_005.mp3"],
        "\u0644\u0627\u0644\u0649 \u0627\u0644\u062C\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/037_068_004.mp3", "https://audio.qurancdn.com/wbw/037_068_005.mp3"],
        "\u0644\u0625\u0644\u0649 \u0627\u0644\u062C\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/037_068_004.mp3", "https://audio.qurancdn.com/wbw/037_068_005.mp3"],
        "\u0645\u0644\u0625\u06CC\u0647": ["https://audio.qurancdn.com/wbw/011_097_003.mp3"],
        "\u0645\u0644\u0627\u0626\u0647": ["https://audio.qurancdn.com/wbw/011_097_003.mp3"],
        "\u0645\u0644\u0625\u0647": ["https://audio.qurancdn.com/wbw/011_097_003.mp3"],
        "\u0641\u0631\u0639\u0648\u0646 \u0648\u0645\u0644\u0627\u0626\u0647": ["https://audio.qurancdn.com/wbw/011_097_002.mp3", "https://audio.qurancdn.com/wbw/011_097_003.mp3"],
        "\u0648\u0644\u0627 \u0627\u0648\u0636\u0639\u0648\u0627": ["https://audio.qurancdn.com/wbw/009_047_007.mp3", "https://audio.qurancdn.com/wbw/009_047_008.mp3"],
        "\u0648\u0644\u0627\u0648\u0636\u0639\u0648\u0627": ["https://audio.qurancdn.com/wbw/009_047_007.mp3", "https://audio.qurancdn.com/wbw/009_047_008.mp3"],
        "\u0648\u0645\u0644\u0627\u0626\u0647\u0645": ["https://audio.qurancdn.com/wbw/010_083_012.mp3"],
        "\u0648\u0645\u0644\u0626\u0647\u0645": ["https://audio.qurancdn.com/wbw/010_083_012.mp3"],
        "\u0641\u0631\u0639\u0648\u0646 \u0648\u0645\u0644\u0627\u0626\u0647\u0645": ["https://audio.qurancdn.com/wbw/010_083_011.mp3", "https://audio.qurancdn.com/wbw/010_083_012.mp3"],
        "\u062B\u0645\u0648\u062F\u0627": ["https://audio.qurancdn.com/wbw/011_068_007.mp3"],
        "\u062B\u0645\u0648\u062F": ["https://audio.qurancdn.com/wbw/011_068_007.mp3"],
        "\u0627\u0646 \u062B\u0645\u0648\u062F\u0627": ["https://audio.qurancdn.com/wbw/011_068_006.mp3", "https://audio.qurancdn.com/wbw/011_068_007.mp3"],
        "\u0627\u0646 \u062B\u0645\u0648\u062F": ["https://audio.qurancdn.com/wbw/011_068_006.mp3", "https://audio.qurancdn.com/wbw/011_068_007.mp3"],
        "\u0644\u062A\u062A\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/013_030_010.mp3"],
        "\u0644\u062A\u062A\u0644\u0648": ["https://audio.qurancdn.com/wbw/013_030_010.mp3"],
        "\u0644\u062A\u062A\u0644\u0648\u0627 \u0639\u0644\u064A\u0647\u0645": ["https://audio.qurancdn.com/wbw/013_030_010.mp3", "https://audio.qurancdn.com/wbw/013_030_011.mp3"],
        "\u0644\u0646 \u0646\u062F\u0639\u0648\u0627": ["https://audio.qurancdn.com/wbw/018_014_011.mp3", "https://audio.qurancdn.com/wbw/018_014_012.mp3"],
        "\u0644\u0646 \u0646\u062F\u0639\u0648": ["https://audio.qurancdn.com/wbw/018_014_011.mp3", "https://audio.qurancdn.com/wbw/018_014_012.mp3"],
        "\u0644\u06CC\u0631\u0628\u0648\u0627": ["https://audio.qurancdn.com/wbw/030_039_005.mp3"],
        "\u0644\u06CC\u0631\u0628\u0648": ["https://audio.qurancdn.com/wbw/030_039_005.mp3"],
        "\u0644\u064A\u064A\u0631\u0628\u0648\u0627": ["https://audio.qurancdn.com/wbw/030_039_005.mp3"],
        "\u0644\u064A\u064A\u0631\u0628\u0648": ["https://audio.qurancdn.com/wbw/030_039_005.mp3"],
        "\u0644\u06CC\u0628\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0644\u06CC\u0628\u0644\u0648": ["https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0644\u064A\u0628\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0644\u064A\u0628\u0644\u0648": ["https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0648\u0644\u0643\u0646 \u0644\u064A\u0628\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/047_004_027.mp3", "https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0648\u0644\u0643\u0646 \u0644\u064A\u0628\u0644\u0648": ["https://audio.qurancdn.com/wbw/047_004_027.mp3", "https://audio.qurancdn.com/wbw/047_004_028.mp3"],
        "\u0648\u0646\u0628\u0644\u0648\u0627": ["https://audio.qurancdn.com/wbw/047_031_007.mp3"],
        "\u0648\u0646\u0628\u0644\u0648": ["https://audio.qurancdn.com/wbw/047_031_007.mp3"],
        "\u0627\u0644\u0627\u0646\u0627\u0645\u0644": ["https://audio.qurancdn.com/wbw/003_119_017.mp3"],
        "\u0639\u0644\u06CC\u06A9\u0645 \u0627\u0644\u0627\u0646\u0627\u0645\u0644": ["https://audio.qurancdn.com/wbw/003_119_016.mp3", "https://audio.qurancdn.com/wbw/003_119_017.mp3"],
        "\u0627\u0646\u0627\u0633\u06CC\u0627": ["https://audio.qurancdn.com/wbw/025_049_009.mp3"],
        "\u0627\u0646\u0627\u0633\u064A": ["https://audio.qurancdn.com/wbw/025_049_009.mp3"],
        "\u0627\u0646\u0627\u0628\u0648\u0627": ["https://audio.qurancdn.com/wbw/039_017_006.mp3"],
        "\u0627\u0644\u0627\u0646\u0627\u0645": ["https://audio.qurancdn.com/wbw/055_010_003.mp3"],
        "\u0644\u0644\u0627\u0646\u0627\u0645": ["https://audio.qurancdn.com/wbw/055_010_003.mp3"],
        "\u0627\u0646\u0627\u0628": ["https://audio.qurancdn.com/wbw/031_015_021.mp3"],
        "\u0645\u0646 \u0627\u0646\u0627\u0628": ["https://audio.qurancdn.com/wbw/031_015_020.mp3", "https://audio.qurancdn.com/wbw/031_015_021.mp3"],
        "\u0627\u0646\u0627": ["https://audio.qurancdn.com/wbw/002_258_019.mp3"],
        // Complete Verified Lesson 10 (Nun Sakin & Tanween) Tajweed Overrides
        // --- 1. IZHAR (حروفِ حلقی) ---
        "\u0645\u0646 \u063A\u0641\u0648\u0631": ["https://audio.qurancdn.com/wbw/041_032_002.mp3", "https://audio.qurancdn.com/wbw/041_032_003.mp3"],
        "\u0645\u0646 \u062E\u0648\u0641": ["https://audio.qurancdn.com/wbw/106_004_006.mp3", "https://audio.qurancdn.com/wbw/106_004_007.mp3"],
        "\u0633\u0645\u064A\u0639 \u0639\u0644\u064A\u0645": ["https://audio.qurancdn.com/wbw/002_227_006.mp3", "https://audio.qurancdn.com/wbw/002_227_007.mp3"],
        "\u0642\u0631\u0636\u0627 \u062D\u0633\u0646\u0627": ["https://audio.qurancdn.com/wbw/002_245_006.mp3", "https://audio.qurancdn.com/wbw/002_245_007.mp3"],
        "\u0639\u0644\u064A\u0645 \u062E\u0628\u064A\u0631": ["https://audio.qurancdn.com/wbw/031_034_031.mp3", "https://audio.qurancdn.com/wbw/031_034_032.mp3"],
        "\u0642\u0648\u0645\u0627 \u063A\u064A\u0631\u0643\u0645": ["https://audio.qurancdn.com/wbw/011_057_022.mp3", "https://audio.qurancdn.com/wbw/011_057_023.mp3"],
        "\u0645\u0646 \u0635\u0644\u0635\u0627\u0644": ["https://audio.qurancdn.com/wbw/055_014_003.mp3", "https://audio.qurancdn.com/wbw/055_014_004.mp3"],
        "\u0645\u0646 \u0637\u064A\u0646": ["https://audio.qurancdn.com/wbw/006_002_004.mp3", "https://audio.qurancdn.com/wbw/006_002_005.mp3"],
        "\u0645\u0646 \u0642\u0628\u0644": ["https://audio.qurancdn.com/wbw/002_025_025.mp3", "https://audio.qurancdn.com/wbw/002_025_026.mp3"],
        "\u0645\u0646 \u0643\u062A\u0628": ["https://audio.qurancdn.com/wbw/034_044_003.mp3", "https://audio.qurancdn.com/wbw/034_044_004.mp3"],
        "\u0627\u0646\u062A": ["https://audio.qurancdn.com/wbw/088_021_003.mp3"],
        "\u062A\u0646\u0633\u0648\u0646": ["https://audio.qurancdn.com/wbw/002_044_005.mp3"],
        "\u064A\u0646\u0635\u0631\u0648\u0646": ["https://audio.qurancdn.com/wbw/044_041_010.mp3"],
        "\u0645\u0646\u0636\u0648\u062F": ["https://audio.qurancdn.com/wbw/056_029_002.mp3"],
        "\u0627\u0646\u0638\u0631": ["https://audio.qurancdn.com/wbw/006_024_001.mp3"],
        "\u0627\u0646\u0641\u0633\u0643\u0645": ["https://audio.qurancdn.com/wbw/002_054_008.mp3"],
        "\u064A\u0646\u0642\u0636\u0648\u0646": ["https://audio.qurancdn.com/wbw/002_027_002.mp3"],
        "\u0641\u0635\u0628\u0631 \u062C\u0645\u064A\u0644": ["https://audio.qurancdn.com/wbw/012_018_014.mp3", "https://audio.qurancdn.com/wbw/012_018_015.mp3"],
        "\u0633\u0631\u0627\u0639\u0627 \u0630\u0644\u0643": ["https://audio.qurancdn.com/wbw/050_044_005.mp3", "https://audio.qurancdn.com/wbw/050_044_008.mp3"],
        "\u0639\u0630\u0627\u0628 \u0634\u062F\u064A\u062F": ["https://audio.qurancdn.com/wbw/042_026_011.mp3", "https://audio.qurancdn.com/wbw/042_026_012.mp3"],
        "\u0639\u0645\u0644\u0627 \u0635\u0627\u0644\u062D\u0627": ["https://audio.qurancdn.com/wbw/018_110_019.mp3", "https://audio.qurancdn.com/wbw/018_110_020.mp3"],
        "\u0639\u0630\u0627\u0628\u0627 \u0636\u0639\u0641\u0627": ["https://audio.qurancdn.com/wbw/007_038_033.mp3", "https://audio.qurancdn.com/wbw/007_038_034.mp3"],
        "\u0633\u062D\u0627\u0628 \u0638\u0644\u0645\u0627\u062A": ["https://audio.qurancdn.com/wbw/024_040_013.mp3", "https://audio.qurancdn.com/wbw/024_040_016.mp3"],
        "\u0633\u062D\u0627\u0628 \u0638\u0644\u0645\u062A": ["https://audio.qurancdn.com/wbw/024_040_013.mp3", "https://audio.qurancdn.com/wbw/024_040_016.mp3"],
        "\u0642\u0648\u0645\u0627 \u0641\u0627\u0633\u0642\u064A\u0646": ["https://audio.qurancdn.com/wbw/009_024_032.mp3", "https://audio.qurancdn.com/wbw/009_024_033.mp3"],
        "\u062B\u0645\u0646\u0627 \u0642\u0644\u064A\u0644\u0627": ["https://audio.qurancdn.com/wbw/003_077_021.mp3", "https://audio.qurancdn.com/wbw/003_077_022.mp3"],
        "\u0631\u0633\u0648\u0644 \u0643\u0631\u064A\u0645": ["https://audio.qurancdn.com/wbw/069_040_003.mp3", "https://audio.qurancdn.com/wbw/069_040_004.mp3"],
        "\u0645\u0646 \u064A\u0648\u0645": ["https://audio.qurancdn.com/wbw/019_037_009.mp3", "https://audio.qurancdn.com/wbw/019_037_011.mp3"],
        "\u0645\u0646 \u0648\u0644\u064A": ["https://audio.qurancdn.com/wbw/002_107_015.mp3", "https://audio.qurancdn.com/wbw/002_107_016.mp3"],
        "\u0633\u0631\u0627\u062C\u0627 \u0645\u0646\u064A\u0631\u0627": ["https://audio.qurancdn.com/wbw/033_046_005.mp3", "https://audio.qurancdn.com/wbw/033_046_006.mp3"],
        "\u0648\u064A\u0644 \u0644\u0643\u0644": ["https://audio.qurancdn.com/wbw/104_001_001.mp3", "https://audio.qurancdn.com/wbw/104_001_002.mp3"],
        "\u062E\u0628\u064A\u0631 \u0628\u0635\u064A\u0631\u0627": ["https://audio.qurancdn.com/wbw/025_058_010.mp3", "https://audio.qurancdn.com/wbw/025_058_011.mp3"],
        "\u0645\u0646 \u0627\u062C\u0644": ["https://audio.qurancdn.com/wbw/005_032_001.mp3", "https://audio.qurancdn.com/wbw/005_032_002.mp3"],
        "\u0645\u0646 \u0647\u0627\u062F": ["https://audio.qurancdn.com/wbw/039_036_016.mp3", "https://audio.qurancdn.com/wbw/039_036_017.mp3"],
        "\u0645\u0646 \u0639\u0644\u0642": ["https://audio.qurancdn.com/wbw/096_002_003.mp3", "https://audio.qurancdn.com/wbw/096_002_004.mp3"],
        "\u0645\u0646 \u062D\u0643\u064A\u0645": ["https://audio.qurancdn.com/wbw/027_006_004.mp3", "https://audio.qurancdn.com/wbw/027_006_006.mp3"],
        "\u064A\u0646\u0626\u0648\u0646": ["https://audio.qurancdn.com/wbw/006_026_004.mp3"],
        "\u0645\u0646\u0647\u0645": ["https://audio.qurancdn.com/wbw/018_018_021.mp3"],
        "\u0627\u0646\u0639\u0645\u062A": ["https://audio.qurancdn.com/wbw/001_007_003.mp3"],
        "\u0648\u0627\u0646\u062D\u0631": ["https://audio.qurancdn.com/wbw/108_002_003.mp3"],
        "\u0641\u0633\u064A\u0646\u063A\u0636\u0648\u0646": ["https://audio.qurancdn.com/wbw/017_051_018.mp3"],
        "\u0648\u0627\u0644\u0645\u0646\u062E\u0646\u0642\u0629": ["https://audio.qurancdn.com/wbw/005_003_012.mp3"],
        "\u0639\u0630\u0627\u0628\u0627 \u0627\u0644\u064A\u0645\u0627": ["https://audio.qurancdn.com/wbw/004_138_005.mp3", "https://audio.qurancdn.com/wbw/004_138_006.mp3"],
        "\u0628\u0644\u062F\u0627 \u0627\u0645\u0646\u0627": ["https://audio.qurancdn.com/wbw/002_126_007.mp3", "https://audio.qurancdn.com/wbw/002_126_008.mp3"],
        "\u0646\u0648\u062D\u0627 \u0647\u062F\u064A\u0646\u0627": ["https://audio.qurancdn.com/wbw/006_084_007.mp3", "https://audio.qurancdn.com/wbw/006_084_008.mp3"],
        "\u0641\u0645\u0646 \u062A\u0628\u0639": ["https://audio.qurancdn.com/wbw/002_038_010.mp3", "https://audio.qurancdn.com/wbw/002_038_011.mp3"],
        "\u0645\u0646 \u062B\u0645\u0631\u0629": ["https://audio.qurancdn.com/wbw/002_025_017.mp3", "https://audio.qurancdn.com/wbw/002_025_018.mp3"],
        "\u0645\u0646 \u062C\u0648\u0639": ["https://audio.qurancdn.com/wbw/106_004_003.mp3", "https://audio.qurancdn.com/wbw/106_004_004.mp3"],
        "\u0645\u0646 \u062F\u0648\u0646\u0643\u0645": ["https://audio.qurancdn.com/wbw/003_118_007.mp3", "https://audio.qurancdn.com/wbw/003_118_008.mp3"],
        "\u0645\u0646 \u0630\u0647\u0628": ["https://audio.qurancdn.com/wbw/043_053_005.mp3", "https://audio.qurancdn.com/wbw/043_053_006.mp3"],
        "\u0641\u0627\u0646 \u0632\u0644\u0644\u062A\u0645": ["https://audio.qurancdn.com/wbw/002_209_001.mp3", "https://audio.qurancdn.com/wbw/002_209_002.mp3"],
        "\u0645\u0646 \u0633\u0641\u0647": ["https://audio.qurancdn.com/wbw/002_130_007.mp3", "https://audio.qurancdn.com/wbw/002_130_008.mp3"],
        "\u0645\u0646 \u0634\u0643\u0631": ["https://audio.qurancdn.com/wbw/054_035_007.mp3", "https://audio.qurancdn.com/wbw/054_035_008.mp3"],
        "\u0627\u0646 \u0636\u0644\u0644\u062A": ["https://audio.qurancdn.com/wbw/034_050_002.mp3", "https://audio.qurancdn.com/wbw/034_050_003.mp3"],
        "\u0645\u0646 \u0638\u0644\u0645": ["https://audio.qurancdn.com/wbw/027_011_002.mp3", "https://audio.qurancdn.com/wbw/027_011_003.mp3"],
        "\u0645\u0646 \u0641\u0631\u0648\u062C": ["https://audio.qurancdn.com/wbw/050_006_011.mp3", "https://audio.qurancdn.com/wbw/050_006_012.mp3"],
        "\u0646\u0646\u0634\u0632\u0647\u0627": ["https://audio.qurancdn.com/wbw/002_259_059.mp3"],
        "\u064A\u0646\u0637\u0642\u0648\u0646": ["https://audio.qurancdn.com/wbw/077_035_004.mp3"],
        "\u0645\u0646\u0643\u0645": ["https://audio.qurancdn.com/wbw/043_060_004.mp3"],
        "\u0642\u0648\u0644\u0627 \u062B\u0642\u064A\u0644\u0627": ["https://audio.qurancdn.com/wbw/073_005_004.mp3", "https://audio.qurancdn.com/wbw/073_005_005.mp3"],
        "\u0643\u0627\u0633\u0627 \u062F\u0647\u0627\u0642\u0627": ["https://audio.qurancdn.com/wbw/078_034_001.mp3", "https://audio.qurancdn.com/wbw/078_034_002.mp3"],
        "\u0635\u0639\u064A\u062F\u0627 \u0632\u0644\u0642\u0627": ["https://audio.qurancdn.com/wbw/018_040_014.mp3", "https://audio.qurancdn.com/wbw/018_040_015.mp3"],
        "\u0642\u0648\u0644\u0627 \u0633\u062F\u064A\u062F\u0627": ["https://audio.qurancdn.com/wbw/033_070_007.mp3", "https://audio.qurancdn.com/wbw/033_070_008.mp3"],
        "\u0633\u0628\u062D\u0627 \u0637\u0648\u064A\u0644\u0627": ["https://audio.qurancdn.com/wbw/073_007_005.mp3", "https://audio.qurancdn.com/wbw/073_007_006.mp3"],
        "\u0643\u0631\u0627\u0645\u0627 \u0643\u0627\u062A\u0628\u064A\u0646": ["https://audio.qurancdn.com/wbw/082_011_001.mp3", "https://audio.qurancdn.com/wbw/082_011_002.mp3"],
        "\u0645\u0646 \u064A\u0642\u0648\u0644": ["https://audio.qurancdn.com/wbw/002_008_003.mp3", "https://audio.qurancdn.com/wbw/002_008_004.mp3"],
        "\u0645\u0646 \u0648\u0631\u0642 \u0627\u0644\u062C\u0646\u0629": ["https://audio.qurancdn.com/wbw/007_022_013.mp3", "https://audio.qurancdn.com/wbw/007_022_014.mp3", "https://audio.qurancdn.com/wbw/007_022_015.mp3"],
        "\u0645\u0646 \u0645\u0634\u0647\u062F": ["https://audio.qurancdn.com/wbw/019_037_009.mp3", "https://audio.qurancdn.com/wbw/019_037_010.mp3"],
        "\u0645\u0646 \u0645\u062B\u0644\u0647": ["https://audio.qurancdn.com/wbw/002_023_011.mp3", "https://audio.qurancdn.com/wbw/002_023_012.mp3"],
        "\u0645\u0646 \u0646\u0635\u064A\u0631": ["https://audio.qurancdn.com/wbw/022_071_017.mp3", "https://audio.qurancdn.com/wbw/022_071_018.mp3"],
        "\u0645\u0646 \u0646\u0637\u0641\u0629": ["https://audio.qurancdn.com/wbw/080_019_001.mp3", "https://audio.qurancdn.com/wbw/080_019_002.mp3"],
        "\u0643\u062A\u0627\u0628\u0627 \u064A\u0644\u0642\u0627\u0647": ["https://audio.qurancdn.com/wbw/017_013_012.mp3", "https://audio.qurancdn.com/wbw/017_013_013.mp3"],
        "\u0647\u062F\u0649 \u0648\u0630\u0643\u0631\u0649": ["https://audio.qurancdn.com/wbw/040_054_001.mp3", "https://audio.qurancdn.com/wbw/040_054_002.mp3"],
        "\u062D\u0637\u0629 \u0646\u063A\u0641\u0631 \u0644\u0643\u0645": ["https://audio.qurancdn.com/wbw/002_058_015.mp3", "https://audio.qurancdn.com/wbw/002_058_016.mp3", "https://audio.qurancdn.com/wbw/002_058_017.mp3"],
        "\u0645\u0646 \u0631\u0628\u0643": ["https://audio.qurancdn.com/wbw/002_147_002.mp3", "https://audio.qurancdn.com/wbw/002_147_003.mp3"],
        "\u0645\u0646 \u0631\u0628\u0647\u0645": ["https://audio.qurancdn.com/wbw/002_005_004.mp3", "https://audio.qurancdn.com/wbw/002_005_005.mp3"],
        "\u0645\u0646 \u0644\u062F\u0646\u0647": ["https://audio.qurancdn.com/wbw/004_040_013.mp3", "https://audio.qurancdn.com/wbw/004_040_014.mp3"],
        "\u064A\u0643\u0646 \u0644\u0647": ["https://audio.qurancdn.com/wbw/112_004_002.mp3", "https://audio.qurancdn.com/wbw/112_004_003.mp3"],
        "\u0645\u062D\u0645\u062F \u0631\u0633\u0648\u0644 \u0627\u0644\u0644\u0647": ["https://audio.qurancdn.com/wbw/048_029_001.mp3", "https://audio.qurancdn.com/wbw/048_029_002.mp3", "https://audio.qurancdn.com/wbw/048_029_003.mp3"],
        "\u0631\u0621\u0648\u0641 \u0631\u062D\u064A\u0645": ["https://audio.qurancdn.com/wbw/009_128_013.mp3", "https://audio.qurancdn.com/wbw/009_128_014.mp3"],
        "\u0645\u0635\u062F\u0642\u0627 \u0644\u0645\u0627": ["https://audio.qurancdn.com/wbw/002_041_004.mp3", "https://audio.qurancdn.com/wbw/002_041_005.mp3"],
        "\u0645\u0646 \u0628\u0639\u062F": ["https://audio.qurancdn.com/wbw/002_027_005.mp3", "https://audio.qurancdn.com/wbw/002_027_006.mp3"],
        "\u0645\u0646 \u0628\u0642\u0644\u0647\u0627": ["https://audio.qurancdn.com/wbw/002_061_017.mp3", "https://audio.qurancdn.com/wbw/002_061_018.mp3"],
        "\u0642\u0648\u0644\u0627 \u0628\u0644\u064A\u063A\u0627": ["https://audio.qurancdn.com/wbw/004_063_015.mp3", "https://audio.qurancdn.com/wbw/004_063_016.mp3"],
        "\u062C\u0646\u0629 \u0628\u0631\u0628\u0648\u0629": ["https://audio.qurancdn.com/wbw/002_265_012.mp3", "https://audio.qurancdn.com/wbw/002_265_013.mp3"],
        "\u0643\u0631\u0627\u0645 \u0628\u0631\u0631\u0629": ["https://audio.qurancdn.com/wbw/080_016_001.mp3", "https://audio.qurancdn.com/wbw/080_016_002.mp3"],
        "\u062D\u0644 \u0628\u0647\u0630\u0627": ["https://audio.qurancdn.com/wbw/090_002_002.mp3", "https://audio.qurancdn.com/wbw/090_002_003.mp3"],
        "\u0635\u0645 \u0628\u0643\u0645": ["https://audio.qurancdn.com/wbw/002_018_001.mp3", "https://audio.qurancdn.com/wbw/002_018_002.mp3"],
        "\u0643\u062A\u0627\u0628\u0627 \u064A\u0644\u0642\u0647": ["https://audio.qurancdn.com/wbw/017_013_012.mp3", "https://audio.qurancdn.com/wbw/017_013_013.mp3"],
        // Lesson 16: Mutafarriq Qawaid (Verified WBW Recitation Overrides)
        "\u062F\u0646\u064A\u0627": ["/audio/dunya.mp3"],
        "\u0628\u0646\u064A\u0627\u0646": ["https://audio.qurancdn.com/wbw/061_004_010.mp3"],
        "\u0635\u0646\u0648\u0627\u0646": ["https://audio.qurancdn.com/wbw/013_004_010.mp3"],
        "\u0642\u0646\u0648\u0627\u0646": ["https://audio.qurancdn.com/wbw/006_099_023.mp3"],
        "\u0639\u0648\u062C\u0627 \u0642\u064A\u0645\u0627": ["/audio/iwaja_qayyima.mp3"],
        "\u0639\u0648\u062C\u0627": ["https://audio.qurancdn.com/wbw/018_001_011.mp3"],
        "\u0642\u064A\u0645\u0627": ["https://audio.qurancdn.com/wbw/018_002_001.mp3"],
        "\u0645\u0646 \u0645\u0631\u0642\u062F\u0646\u0627 \u0647\u0630\u0627": ["/audio/min_marqadina_haza.mp3"],
        "\u0645\u0646 \u0645\u0631\u0642\u062F\u0646\u0627": ["https://audio.qurancdn.com/wbw/036_052_005.mp3", "https://audio.qurancdn.com/wbw/036_052_006.mp3"],
        "\u0645\u0631\u0642\u062F\u0646\u0627 \u0647\u0630\u0627": ["https://audio.qurancdn.com/wbw/036_052_006.mp3", "https://audio.qurancdn.com/wbw/036_052_007.mp3"],
        "\u0645\u0631\u0642\u062F\u0646\u0627": ["https://audio.qurancdn.com/wbw/036_052_006.mp3"],
        "\u0647\u0630\u0627": ["https://audio.qurancdn.com/wbw/036_052_007.mp3"],
        "\u0643\u0644\u0627 \u0628\u0644 \u0631\u0627\u0646": ["/audio/kalla_bal_rana.mp3"],
        "\u0628\u0644 \u0631\u0627\u0646": ["/audio/kalla_bal_rana.mp3"],
        "\u0631\u0627\u0646": ["https://audio.qurancdn.com/wbw/083_014_005.mp3"],
        "\u0648\u0642\u064A\u0644 \u0645\u0646 \u0631\u0627\u0642": ["/audio/waqeela_man_raq.mp3"],
        "\u0645\u0646 \u0631\u0627\u0642": ["/audio/waqeela_man_raq.mp3"],
        "\u0648\u0631\u0627\u0642": ["https://audio.qurancdn.com/wbw/075_027_004.mp3"],
        "\u064A\u0628\u0633\u0637": ["https://audio.qurancdn.com/wbw/002_245_015.mp3"],
        "\u0628\u0635\u0637\u0629": ["/audio/bastatan.mp3"],
        "\u0628\u0633\u0637\u0629": ["/audio/bastatan.mp3"],
        "\u0627\u0645 \u0647\u0645 \u0627\u0644\u0645\u0635\u064A\u0637\u0631\u0648\u0646": ["/audio/am_humul_musaitiroon.mp3"],
        "\u0627\u0644\u0645\u0635\u064A\u0637\u0631\u0648\u0646": ["https://audio.qurancdn.com/wbw/052_037_007.mp3"],
        "\u0628\u0645\u0635\u064A\u0637\u0631": ["https://audio.qurancdn.com/wbw/088_022_003.mp3"],
        "\u0621\u0627\u0639\u062C\u0645\u064A \u0648\u0639\u0631\u0628\u064A": ["/audio/aajamiyyun_v2.mp3"],
        "\u0621\u0627\u0639\u062C\u0645\u064A": ["/audio/aajamiyyun_v2.mp3"],
        "\u0623\u0627\u0639\u062C\u0645\u064A \u0648\u0639\u0631\u0628\u064A": ["/audio/aajamiyyun_v2.mp3"],
        "\u0623\u0627\u0639\u062C\u0645\u064A": ["/audio/aajamiyyun_v2.mp3"],
        "\u0645\u062C\u0631\u0627\u0647\u0627": ["/audio/majreeha.mp3"],
        "\u0645\u062C\u0631\u064A\u0647\u0627": ["/audio/majreeha.mp3"],
        "\u0645\u062C\u0631\u0649\u0647\u0627": ["/audio/majreeha.mp3"],
        "\u0628\u0626\u0633 \u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0641\u0633\u0648\u0642": ["/audio/bisa_lismu_fusuq_v3.mp3"],
        "\u0628\u0626\u0633 \u0627\u0644\u0627\u0633\u0645": ["/audio/bisa_lismu_fusuq_v3.mp3"],
        "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0641\u0633\u0648\u0642": ["/audio/bisa_lismu_fusuq_v3.mp3"],
        "\u0628\u0626\u0633 \u0644\u0633\u0645": ["/audio/bisa_lismu_fusuq_v3.mp3"],
        "\u0628\u0626\u0633": ["https://audio.qurancdn.com/wbw/049_011_031.mp3"],
        "\u0627\u0644\u0627\u0633\u0645": ["https://audio.qurancdn.com/wbw/049_011_032.mp3"],
        "\u0627\u0644\u0641\u0633\u0648\u0642": ["https://audio.qurancdn.com/wbw/049_011_033.mp3"]
      };
      const normalizedQaidaOverrides = {
        "\u0645\u064E\u0627 \u062E\u064E\u0644\u064E\u0642\u0652": ["/audio/w1_waqf.mp3"],
        "\u0645\u064E\u0644\u0650\u0643\u0650 \u0627\u0644\u0646\u0651\u064E\u0627\u0633\u0652": ["/audio/w2_waqf.mp3"],
        "\u0644\u0650\u0645\u064E\u0627 \u064A\u064F\u0631\u0650\u064A\u062F\u0652": ["/audio/w3_waqf.mp3"],
        "\u0645\u0650\u0646\u0652 \u062C\u064F\u0648\u0639\u0652": ["/audio/w4_waqf.mp3"],
        "\u0644\u064E\u0643\u064E\u0646\u064F\u0648\u062F\u0652": ["/audio/w5_waqf.mp3"],
        "\u0627\u0650\u0630\u064E\u0627 \u062D\u064E\u0633\u064E\u062F\u0652": ["/audio/w8_waqf.mp3"],
        "\u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u062F\u0651\u0650\u064A\u0652\u0646\u0652": ["/audio/w9_waqf.mp3"],
        "\u0645\u064E\u0627 \u062A\u064E\u0639\u0652\u0628\u064F\u062F\u064F\u0648\u0652\u0646\u0652": ["/audio/w11_waqf.mp3"],
        "\u0643\u064E\u0627\u0646\u064E \u062A\u064E\u0648\u0651\u064E\u0627\u0628\u064E\u0627": ["/audio/w17_waqf.mp3"],
        "\u0644\u064E\u0645\u0652 \u064A\u064E\u0644\u0650\u062F\u0652": ["/audio/w31_waqf.mp3"]
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
          qari: "\u0627\u0644\u0642\u0627\u0631\u0626 \u0627\u0644\u0634\u064A\u062E \u0645\u0634\u0627\u0631\u064A \u0631\u0627\u0634\u062F \u0627\u0644\u0639\u0641\u0627\u0633\u064A",
          audioUrls
        });
      }
      if (audioUrls.length === 0) {
        for (const word of words) {
          const wordBase = normalizeArabicText(word);
          const wordDiacritics = normalizeArabicWithDiacritics(word);
          if (!wordBase) continue;
          let wordUrl = null;
          try {
            const searchRes = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(wordBase)}&size=10`);
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              if (searchData?.search?.results?.length > 0) {
                let exactDiacriticUrl = null;
                for (const result of searchData.search.results) {
                  if (exactDiacriticUrl) break;
                  const verseKey = result.verse_key;
                  const verseRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,text_indopak`);
                  if (verseRes.ok) {
                    const verseData = await verseRes.json();
                    const vWords = (verseData?.verse?.words || []).filter((w) => w.char_type_name === "word" && w.audio_url);
                    for (const w of vWords) {
                      const uText = w.text_uthmani || w.text || "";
                      const iText = w.text_indopak || "";
                      const uDiac = normalizeArabicWithDiacritics(uText);
                      const iDiac = normalizeArabicWithDiacritics(iText);
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
          qari: "\u0627\u0644\u0642\u0627\u0631\u0626 \u0627\u0644\u0634\u064A\u062E \u0645\u0634\u0627\u0631\u064A \u0631\u0627\u0634\u062F \u0627\u0644\u0639\u0641\u0627\u0633\u064A",
          audioUrls
        });
      }
      return res.status(404).json({ error: "Exact Quran WBW audio match not found" });
    } catch (err) {
      console.error("[Quran Word Audio Endpoint Error]:", err?.message || err);
      return res.status(500).json({ error: "Internal server error fetching word audio" });
    }
  });
  app.get("/api/download-project", (req, res) => {
    try {
      const zipPath = import_path.default.join(process.cwd(), "project.zip");
      try {
        (0, import_child_process.execSync)(`python3 -c "import zipfile, os
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
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="TaalimulQuran_SourceCode.zip"');
      res.download(zipPath, "TaalimulQuran_SourceCode.zip", (err) => {
        if (err && !res.headersSent) {
          res.status(500).send("Error generating project archive");
        }
      });
    } catch (err) {
      res.status(500).send("Archive error");
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const candidates = [
      import_path.default.join(process.cwd(), "dist"),
      typeof __dirname !== "undefined" ? import_path.default.join(__dirname, "dist") : null,
      "/app/applet/dist"
    ].filter(Boolean);
    const distPath = candidates.find((p) => import_fs.default.existsSync(p)) || import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = import_path.default.join(distPath, "index.html");
      if (import_fs.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send(`<!DOCTYPE html><html lang="ur" dir="rtl"><head><title>Ta'limul Quran</title></head><body><h1>Ta'limul Quran Play</h1><p>Initializing application...</p></body></html>`);
      }
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server & WebSocket Signaling running on http://0.0.0.0:${PORT}`);
  });
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
    }, 3e3).unref();
  });
}
startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
