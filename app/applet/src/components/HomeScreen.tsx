import React from "react";
import "./HomeScreen.css";
import { LanguageCode } from "../types";
import { translations } from "../translations";

export interface HomeScreenProps {
  currentLang?: LanguageCode;
  onOpenParent?: () => void;
  onOpenParentDashboard?: () => void;
  onOpenAI?: () => void;
  onOpenAiUstadh?: () => void;
  onOpenQaida?: () => void;
  onOpenMadaniQaidah?: () => void;
  onOpenGames?: () => void;
  onOpenQaidaGames?: () => void;
  onOpenClasses?: () => void;
  onOpenLiveUstadh?: () => void;
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
  onOpenLanguage?: () => void;
  onOpenIslamicHub?: () => void;
  onOpenQuranLearning?: () => void;
  onOpenGamification?: () => void;
  onOpenMurakkabatPuzzle?: () => void;
  onOpenFeePortal?: () => void;
  onOpenUploadPortal?: () => void;
  onOpenMadrasaPortal?: () => void;
}

export function HomeScreen({
  currentLang = "ur",
  onOpenParent,
  onOpenParentDashboard,
  onOpenAI,
  onOpenAiUstadh,
  onOpenQaida,
  onOpenMadaniQaidah,
  onOpenGames,
  onOpenQaidaGames,
  onOpenClasses,
  onOpenLiveUstadh,
  onOpenMenu,
  onOpenSettings,
  onOpenLanguage,
  onOpenQuranLearning,
  onOpenGamification,
  onOpenMadrasaPortal,
}: HomeScreenProps) {
  const t = translations[currentLang] || translations.ur;

  const handleParent = onOpenParent || onOpenParentDashboard;
  const handleAI = onOpenAI || onOpenAiUstadh;
  const handleQaida = onOpenQaida || onOpenMadaniQaidah;
  const handleGames = onOpenGames || onOpenQaidaGames;
  const handleClasses = onOpenClasses || onOpenLiveUstadh;

  return (
    <div className="tqp-home" dir={currentLang === 'ar' || currentLang === 'ur' ? 'rtl' : 'ltr'}>

      {/* ================= TOP HEADER ================= */}
      <header className="tqp-header">

        <button className="main-menu-btn" onClick={onOpenMenu}>
          <span className="menu-icon">☰</span>
          <span>
            <strong>MAIN</strong>
            <strong>MENU</strong>
          </span>
        </button>

        <div className="header-actions">
          <button className="header-icon" aria-label="Security" onClick={handleParent}>
            🛡️
          </button>

          <button className="header-icon" aria-label="Language" onClick={onOpenLanguage}>
            🌐
          </button>

          <button className="header-icon" aria-label="Settings" onClick={onOpenSettings}>
            ⚙️
          </button>
        </div>

      </header>

      {/* ================= PROFILE + STATS ================= */}
      <section className="tqp-profile-row">

        <button className="profile-avatar" onClick={onOpenGamification} aria-label="Profile">
          <span>👤</span>
        </button>

        <div className="stats-area">
          <div className="stat-card coins" onClick={onOpenGamification}>
            <span className="stat-number">350</span>
            <span className="stat-label">
              {t.coins} 🪙
            </span>
          </div>

          <div className="stat-card streak" onClick={onOpenGamification}>
            <span className="stat-number">5</span>
            <span className="stat-label">
              {t.streak} 🔥
            </span>
          </div>

        </div>

      </section>

      {/* ================= WELCOME CARD ================= */}
      <section className="welcome-card">

        <div className="welcome-content">
          <div className="welcome-title">
            {t.assalamuAlaikum}! 👋
          </div>
          <p>
            {t.welcomeSubtitle}
          </p>
        </div>

        <button className="continue-btn" onClick={handleQaida}>
          <span>▶</span>
          {t.continueText}
        </button>

      </section>

      {/* ================= 🕌 TALIMUL QURAN MADRASA ONLINE PORTAL CARD ================= */}
      <section 
        onClick={onOpenMadrasaPortal}
        className="mx-4 my-2 p-4 rounded-3xl bg-gradient-to-r from-emerald-950 via-zinc-900 to-teal-950 border-2 border-emerald-500/50 hover:border-emerald-400 text-white shadow-2xl transition-all hover:scale-[1.01] cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group"
      >
        <div className="flex items-center gap-3 text-right">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform">
            🕌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                {t.madrasaPanelTitle}
              </h3>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40 animate-pulse">
                {t.madrasaPanelBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              {t.madrasaPanelDesc}
              </p>
          </div>
        </div>

        <button 
          type="button"
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 shrink-0 group-hover:shadow-emerald-500/40"
        >
          <span>{t.openPanel}</span>
          <span className="text-sm">←</span>
        </button>
      </section>

      {/* ================= DAILY GOAL ================= */}
      <section className="daily-goal-card">

        <div className="goal-top">

          <div className="goal-progress">
            <span>80%</span>
          </div>

          <div className="goal-title-area">
            <h2>{t.dailyGoalTitle}</h2>
            <p>{t.dailyGoalSubtitle}</p>
          </div>

          <div className="goal-icon">
            🏆
          </div>

        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: "80%" }}
          />
        </div>

        <div className="goal-bottom">
          <span>3 min left</span>
          <span>12 / 15 min</span>
        </div>

      </section>


      {/* ================= QUICK LEARNING ================= */}
      <section className="quick-section">

        <div className="section-heading">
          <h2>{t.quickLearning}</h2>
          <span onClick={onOpenQuranLearning}>{t.viewMore} ←</span>
        </div>

        <div className="quick-grid">

          <button className="quick-card" onClick={handleQaida}>
            <div className="quick-icon">📖</div>
            <strong>{t.qaida}</strong>
            <small>{t.qaidaTitle}</small>
          </button>

          <button className="quick-card" onClick={handleGames}>
            <div className="quick-icon">🎮</div>
            <strong>{t.games}</strong>
            <small>{t.gamesTitle}</small>
          </button>

          <button className="quick-card" onClick={handleAI}>
            <div className="quick-icon">🎙️</div>
            <strong>{t.aiTutor}</strong>
            <small>{t.aiTajweedTitle}</small>
          </button>

        </div>

      </section>


      {/* ================= BOTTOM NAVIGATION ================= */}
      <nav className="bottom-nav">

        <button className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>{t.homeNav}</span>
        </button>

        <button className="nav-item" onClick={handleClasses}>
          <span className="nav-icon">🎥</span>
          <span>{t.liveClassNav}</span>
        </button>

        <button className="nav-item" onClick={handleGames}>
          <span className="nav-icon">🎮</span>
          <span>{t.gamesNav}</span>
        </button>

        <button className="nav-item" onClick={handleQaida}>
          <span className="nav-icon">📖</span>
          <span>{t.qaidaQuranNav}</span>
        </button>

        <button className="nav-item" onClick={handleParent}>
          <span className="nav-icon">🛡️</span>
          <span>{t.parentNav}</span>
        </button>

      </nav>

    </div>
  );
}

export default HomeScreen;
