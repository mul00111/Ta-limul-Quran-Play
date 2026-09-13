import React, { useState, useEffect } from "react";
import {
  LanguageCode,
  AppSettings,
  SecurityConfig,
} from "./types";

import { MainMenuDrawer } from "./components/MainMenuDrawer";
import { AboutModal } from "./components/AboutModal";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { HomeScreen } from "./components/HomeScreen";

import { LiveUstadhClassroom } from "./components/LiveUstadhClassroom";
import { VideoAudioUploadPortal } from "./components/VideoAudioUploadPortal";
import { MadaniQaidahBoard } from "./components/MadaniQaidahBoard";
import { FeeManagementPortal } from "./components/FeeManagementPortal";
import { IslamicLearningHub } from "./components/IslamicLearningHub";
import { QaidaGamesModal } from "./components/QaidaGamesModal";
import { QuranLearningHub } from "./components/QuranLearningHub";
import { AiUstadhModal } from "./components/AiUstadhModal";
import { ParentDashboardModal } from "./components/ParentDashboardModal";
import { GamificationModal } from "./components/GamificationModal";
import { SettingsModal } from "./components/SettingsModal";
import { LanguageModal } from "./components/LanguageModal";
import { MurakkabatPuzzleGameModal } from "./components/MurakkabatPuzzleGameModal";
import SequentialBlankBoard from "./components/SequentialBlankBoard";
import { OfflineBanner } from "./components/OfflineBanner";
import { SecurityShieldModal } from "./components/SecurityShieldModal";
import { PasscodeLockModal } from "./components/PasscodeLockModal";
import { MadrasaOnlinePortal } from "./components/MadrasaOnlinePortal";
import { PrayerTimesAndSabaqModal } from "./components/PrayerTimesAndSabaqModal";
import { useProgress } from "./hooks/useProgress";
import { useBackHandler } from "./hooks/useBackHandler";
import { backNavManager } from "./utils/backNavigationManager";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const { progress, addCoins, completeLesson } = useProgress();
  const [currentLang, setCurrentLangState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tqp_lang') as LanguageCode;
      if (saved) return saved;
    }
    return 'ur';
  });

  const setCurrentLang = (lang: LanguageCode) => {
    setCurrentLangState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tqp_lang', lang);
    }
  };

  // Anti-Screenshot, Anti-Copy, and Content Protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen, F12 (DevTools), Ctrl+S (Save), Ctrl+U (Source), Ctrl+P (Print), Ctrl+Shift+I / J / C (Inspect)
      if (
        e.key === "PrintScreen" ||
        e.keyCode === 44 ||
        e.key === "F12" ||
        (e.ctrlKey && (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P" || e.key === "u" || e.key === "U")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J" || e.key === "c" || e.key === "C")) ||
        (e.metaKey && (e.key === "s" || e.key === "S" || e.key === "p" || e.key === "P"))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  // Automatic Tilawat on App Open (Sheikh Sudais - Rabbi Zidni Ilma)
  useEffect(() => {
    let audio: HTMLAudioElement | null = new Audio('/audio/rabbi_zidni_ilma.mp3');
    audio.volume = 1.0;

    const playOnFirstTouch = () => {
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
      window.removeEventListener('click', playOnFirstTouch);
      window.removeEventListener('touchstart', playOnFirstTouch);
      window.removeEventListener('pointerdown', playOnFirstTouch);
    };

    audio.play().catch(() => {
      window.addEventListener('click', playOnFirstTouch, { once: true });
      window.addEventListener('touchstart', playOnFirstTouch, { once: true });
      window.addEventListener('pointerdown', playOnFirstTouch, { once: true });
    });

    return () => {
      window.removeEventListener('click', playOnFirstTouch);
      window.removeEventListener('touchstart', playOnFirstTouch);
      window.removeEventListener('pointerdown', playOnFirstTouch);
      if (audio) {
        audio.pause();
        audio = null;
      }
    };
  }, []);

  // Check if opened with direct classroom link
  const [currentView, setCurrentView] = useState<
    | "home"
    | "live-ustadh"
    | "upload-portal"
    | "madani-qaidah"
    | "fee-portal"
    | "islamic-hub"
    | "qaida-games"
    | "sequential-blank-board"
    | "quran-learning"
    | "ai-ustadh"
    | "parent-dashboard"
    | "gamification"
    | "murakkabat-puzzle"
    | "madrasa-portal"
  >(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('classRoom')) {
      return 'madrasa-portal';
    }
    return 'home';
  });

  const [isMainMenuOpen, setIsMainMenuOpen] =
    useState(false);

  const [isAboutOpen, setIsAboutOpen] =
    useState(false);

  const [isPrivacyOpen, setIsPrivacyOpen] =
    useState(false);

  const [isPrayerTimesOpen, setIsPrayerTimesOpen] =
    useState(false);

  const [islamicHubTab, setIslamicHubTab] =
    useState<'namaz' | 'wudu' | 'azkar' | 'names' | 'stories'>('namaz');

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [isLanguageOpen, setIsLanguageOpen] =
    useState(false);

  const [isSecurityOpen, setIsSecurityOpen] =
    useState(false);

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] =
    useState(false);

  const [pendingViewAfterPin, setPendingViewAfterPin] =
    useState<typeof currentView | null>(null);

  const [isSessionUnlocked, setIsSessionUnlocked] =
    useState(false);

  const [securityConfig, setSecurityConfig] =
    useState<SecurityConfig>({
      pinProtected: true,
      parentPin: "1234",
      e2eEncryption: true,
      safeLinkShield: true,
      autoSessionLock: true,
      dataPrivacyMode: true,
      auditLogging: true,
    });

  const [settings, setSettings] =
    useState<AppSettings>({
      themeColor: "#C2185B",
      fontSize: "lg",
      arabicFont: "font-arabic",
      soundEffects: true,
      reciter: "mishary",
    });

  const handleUpdateSettings = (
    newSettings: Partial<AppSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  const handleUpdateSecurityConfig = (
    newConfig: Partial<SecurityConfig>
  ) => {
    setSecurityConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  const navigateToView = (
    targetView: typeof currentView
  ) => {
    const isProtectedView =
      targetView === "parent-dashboard" ||
      targetView === "fee-portal";

    if (
      isProtectedView &&
      securityConfig.pinProtected &&
      !isSessionUnlocked
    ) {
      setPendingViewAfterPin(targetView);
      setIsPasscodeModalOpen(true);
    } else {
      setCurrentView(targetView);
    }
  };

  const handlePinSuccess = () => {
    setIsSessionUnlocked(true);
    setIsPasscodeModalOpen(false);

    if (pendingViewAfterPin) {
      setCurrentView(pendingViewAfterPin);
      setPendingViewAfterPin(null);
    }
  };

  // Exit Toast State (Double back to exit on root Home screen)
  const [exitToastMessage, setExitToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unbind = backNavManager.onExitToast((msg) => {
      setExitToastMessage(msg);
      setTimeout(() => {
        setExitToastMessage(null);
      }, 2500);
    });
    return () => unbind();
  }, []);

  // 1. Modal Back Handlers (Highest Priority)
  useBackHandler(() => {
    setIsPasscodeModalOpen(false);
    setPendingViewAfterPin(null);
  }, isPasscodeModalOpen, 70, 'app_passcode_modal');

  useBackHandler(() => {
    setIsMainMenuOpen(false);
  }, isMainMenuOpen, 60, 'app_main_drawer');

  useBackHandler(() => {
    setIsSettingsOpen(false);
  }, isSettingsOpen, 50, 'app_settings_modal');

  useBackHandler(() => {
    setIsLanguageOpen(false);
  }, isLanguageOpen, 50, 'app_language_modal');

  useBackHandler(() => {
    setIsSecurityOpen(false);
  }, isSecurityOpen, 50, 'app_security_modal');

  useBackHandler(() => {
    setIsAboutOpen(false);
  }, isAboutOpen, 50, 'app_about_modal');

  useBackHandler(() => {
    setIsPrayerTimesOpen(false);
  }, isPrayerTimesOpen, 50, 'app_prayer_times_modal');

  useBackHandler(() => {
    setIsPrivacyOpen(false);
  }, isPrivacyOpen, 50, 'app_privacy_modal');

  // 2. Main View Back Handler (Priority 10: When inside any screen, back button takes user to Home)
  useBackHandler(() => {
    setCurrentView('home');
  }, currentView !== 'home', 10, 'app_current_view');

  const isRtl =
    currentLang === "ur" ||
    currentLang === "ar";

  const fontClass =
    currentLang === "ur"
      ? "font-urdu"
      : "font-sans";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`
        min-h-screen
        bg-[#0e131d]
        text-white
        flex
        flex-col
        ${fontClass}
        selection:bg-rose-600
        selection:text-white
        pb-12
        sm:pb-0
      `}
    >

      {/* OFFLINE */}
      <OfflineBanner />


      {/* =================================================
          MAIN MENU DRAWER
      ================================================= */}

      {isMainMenuOpen && (
        <MainMenuDrawer
          isOpen={true}
          onClose={() =>
            setIsMainMenuOpen(false)
          }
          currentLang={currentLang}

          onNavigateView={(viewName) => {
            if (viewName === "prayer-times") {
              setIsPrayerTimesOpen(true);
              return;
            }

            if (viewName === "islamic-hub-namaz") {
              setIslamicHubTab("namaz");
              navigateToView("islamic-hub");
              return;
            }

            if (viewName === "islamic-hub-azkar") {
              setIslamicHubTab("azkar");
              navigateToView("islamic-hub");
              return;
            }

            if (
              viewName === "home" ||
              viewName === "live-ustadh" ||
              viewName === "upload-portal" ||
              viewName === "madani-qaidah" ||
              viewName === "fee-portal" ||
              viewName === "islamic-hub" ||
              viewName === "qaida-games" ||
              viewName === "sequential-blank-board" ||
              viewName === "quran-learning" ||
              viewName === "ai-ustadh" ||
              viewName === "parent-dashboard" ||
              viewName === "gamification" ||
              viewName === "murakkabat-puzzle" ||
              viewName === "madrasa-portal"
            ) {
              navigateToView(
                viewName as typeof currentView
              );
            }
          }}

          onOpenLanguage={() =>
            setIsLanguageOpen(true)
          }

          onOpenSettings={() =>
            setIsSettingsOpen(true)
          }

          onOpenSecurity={() =>
            setIsSecurityOpen(true)
          }

          onOpenAbout={() =>
            setIsAboutOpen(true)
          }

          onOpenPrivacy={() =>
            setIsPrivacyOpen(true)
          }
        />
      )}


      {/* =================================================
          HOME SCREEN
          Header + Profile + Bottom Navigation
          HomeScreen ke andar hi hain.
      ================================================= */}

      {currentView === "home" && (
        <HomeScreen
          currentLang={currentLang}
          progress={progress}

          onOpenSettings={() =>
            setIsSettingsOpen(true)
          }

          onOpenLanguage={() =>
            setIsLanguageOpen(true)
          }

          onOpenMenu={() =>
            setIsMainMenuOpen(true)
          }

          onOpenLiveUstadh={() =>
            navigateToView("live-ustadh")
          }

          onOpenUploadPortal={() =>
            navigateToView("upload-portal")
          }

          onOpenMadaniQaidah={() =>
            navigateToView("madani-qaidah")
          }

          onOpenFeePortal={() =>
            navigateToView("fee-portal")
          }

          onOpenIslamicHub={() =>
            navigateToView("islamic-hub")
          }

          onOpenQaidaGames={() =>
            navigateToView("qaida-games")
          }

          onOpenQuranLearning={() =>
            navigateToView("quran-learning")
          }

          onOpenAiUstadh={() =>
            navigateToView("ai-ustadh")
          }

          onOpenParentDashboard={() =>
            navigateToView("parent-dashboard")
          }

          onOpenGamification={() =>
            navigateToView("gamification")
          }

          onOpenMurakkabatPuzzle={() =>
            navigateToView("murakkabat-puzzle")
          }

          onOpenSequentialBlankBoard={() =>
            navigateToView("sequential-blank-board")
          }

          onOpenMadrasaPortal={() =>
            navigateToView("madrasa-portal")
          }

          onOpenPrayerTimes={() =>
            setIsPrayerTimesOpen(true)
          }
        />
      )}


      {/* =================================================
          TALIMUL QURAN ONLINE - MADRASA MANAGEMENT PORTAL
      ================================================= */}

      {currentView === "madrasa-portal" && (
        <MadrasaOnlinePortal
          currentLang={currentLang}
          onSelectLanguage={setCurrentLang}
          onBackToApp={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* MURAKKABAT PUZZLE */}

      {currentView === "murakkabat-puzzle" && (
        <MurakkabatPuzzleGameModal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* LIVE USTADH */}

      {currentView === "live-ustadh" && (
        <LiveUstadhClassroom
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* UPLOAD PORTAL */}

      {currentView === "upload-portal" && (
        <VideoAudioUploadPortal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* MADANI QAIDAH */}

      {currentView === "madani-qaidah" && (
        <MadaniQaidahBoard
          currentLang={currentLang}
          progress={progress}
          onCompleteLesson={completeLesson}
          onBack={() =>
            setCurrentView("home")
          }
          onOpenLiveUstadh={() =>
            navigateToView("live-ustadh")
          }
        />
      )}


      {/* FEE PORTAL */}

      {currentView === "fee-portal" && (
        <FeeManagementPortal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* ISLAMIC HUB */}

      {currentView === "islamic-hub" && (
        <IslamicLearningHub
          currentLang={currentLang}
          initialTab={islamicHubTab}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* QAIDA GAMES */}

      {currentView === "qaida-games" && (
        <QaidaGamesModal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* SEQUENTIAL BLANK BOARD (STANDALONE VIEW) */}

      {currentView === "sequential-blank-board" && (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col items-center">
          <div className="w-full max-w-3xl mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView("home")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-sm font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <span>← مرکزی صفحہ (Home)</span>
            </button>
            <span className="text-xs font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
              ترتیب وار بلینک بورڈ
            </span>
          </div>
          <SequentialBlankBoard
            onBack={() => setCurrentView("home")}
            onComplete={() => {
              // Can also handle completion here
            }}
          />
        </div>
      )}


      {/* QURAN LEARNING */}

      {currentView === "quran-learning" && (
        <QuranLearningHub
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* AI USTADH */}

      {currentView === "ai-ustadh" && (
        <AiUstadhModal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* PARENT DASHBOARD */}

      {currentView === "parent-dashboard" && (
        <ParentDashboardModal
          currentLang={currentLang}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* GAMIFICATION */}

      {currentView === "gamification" && (
        <GamificationModal
          currentLang={currentLang}
          progress={progress}
          onBack={() =>
            setCurrentView("home")
          }
        />
      )}


      {/* SETTINGS */}

      {isSettingsOpen && (
        <SettingsModal
          isOpen={true}
          onClose={() =>
            setIsSettingsOpen(false)
          }
          settings={settings}
          onUpdateSettings={
            handleUpdateSettings
          }
          currentLang={currentLang}
          onOpenPrivacy={() =>
            setIsPrivacyOpen(true)
          }
        />
      )}


      {/* LANGUAGE */}

      {isLanguageOpen && (
        <LanguageModal
          isOpen={true}
          onClose={() =>
            setIsLanguageOpen(false)
          }
          currentLang={currentLang}
          onSelectLanguage={
            setCurrentLang
          }
        />
      )}


      {/* SECURITY */}

      {isSecurityOpen && (
        <SecurityShieldModal
          isOpen={true}
          onClose={() =>
            setIsSecurityOpen(false)
          }
          currentLang={currentLang}
          securityConfig={securityConfig}
          onUpdateSecurityConfig={
            handleUpdateSecurityConfig
          }
        />
      )}


      {/* PASSCODE */}

      {isPasscodeModalOpen && (
        <PasscodeLockModal
          isOpen={true}
          onClose={() => {
            setIsPasscodeModalOpen(false);
            setPendingViewAfterPin(null);
          }}
          onSuccess={handlePinSuccess}
          currentLang={currentLang}
          savedPin={securityConfig.parentPin}
        />
      )}


      {/* ABOUT */}

      {isAboutOpen && (
        <AboutModal
          currentLang={currentLang}
          onClose={() =>
            setIsAboutOpen(false)
          }
          onOpenPrivacy={() =>
            setIsPrivacyOpen(true)
          }
        />
      )}


      {/* PRIVACY POLICY & PLAY STORE COMPLIANCE */}

      {isPrivacyOpen && (
        <PrivacyPolicyModal
          isOpen={true}
          onClose={() =>
            setIsPrivacyOpen(false)
          }
          currentLang={currentLang}
        />
      )}

      {/* PRAYER TIMES & SABAQ REMINDER MODAL */}
      {isPrayerTimesOpen && (
        <PrayerTimesAndSabaqModal
          isOpen={true}
          onClose={() => setIsPrayerTimesOpen(false)}
        />
      )}

      {/* DOUBLE BACK TO EXIT NOTIFICATION TOAST */}
      <AnimatePresence>
        {exitToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[90%] pointer-events-none"
          >
            <div className="bg-zinc-900/95 backdrop-blur-md text-amber-300 px-4 py-3 rounded-2xl border border-amber-500/50 shadow-2xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <span>⚠️</span>
              <span>{exitToastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
