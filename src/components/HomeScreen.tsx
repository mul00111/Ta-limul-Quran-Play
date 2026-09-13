import React, { useState, useRef } from 'react';
import './HomeScreen.css';
import { LanguageCode, UserProgress } from '../types';
import { translations } from '../translations';
import { getAppLocalization } from '../utils/appLocalization';
import { 
  Menu, 
  Shield, 
  Globe, 
  Settings, 
  User, 
  Coins, 
  Flame, 
  Trophy, 
  BookOpen, 
  Gamepad2, 
  Mic2,
  School,
  Home,
  Video,
  LayoutDashboard,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Landmark,
  Compass,
  Layers,
  CheckCircle
} from 'lucide-react';

export interface HomeScreenProps {
  currentLang?: LanguageCode;
  progress?: UserProgress;
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
  onOpenSequentialBlankBoard?: () => void;
  onOpenFeePortal?: () => void;
  onOpenUploadPortal?: () => void;
  onOpenMadrasaPortal?: () => void;
  onOpenPrayerTimes?: () => void;
}

export function HomeScreen({
  currentLang = 'ur',
  progress,
  onOpenParent,
  onOpenParentDashboard = onOpenParent,
  onOpenAI,
  onOpenAiUstadh = onOpenAI,
  onOpenQaida,
  onOpenMadaniQaidah = onOpenQaida,
  onOpenGames,
  onOpenQaidaGames = onOpenGames,
  onOpenClasses,
  onOpenLiveUstadh = onOpenClasses,
  onOpenMenu,
  onOpenSettings,
  onOpenLanguage,
  onOpenIslamicHub,
  onOpenQuranLearning,
  onOpenGamification,
  onOpenMurakkabatPuzzle,
  onOpenSequentialBlankBoard,
  onOpenMadrasaPortal,
  onOpenPrayerTimes
}: HomeScreenProps) {
  const t = translations[currentLang] || translations.ur;
  const loc = getAppLocalization(currentLang);
  const hs = loc.homeScreen;
  const isRtl = currentLang === 'ar' || currentLang === 'ur';

  const [isPlayingDua, setIsPlayingDua] = useState(false);
  const duaAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleDuaAudio = () => {
    if (!duaAudioRef.current) {
      duaAudioRef.current = new Audio('/audio/rabbi_zidni_ilma.mp3');
      duaAudioRef.current.onended = () => setIsPlayingDua(false);
      duaAudioRef.current.onerror = () => setIsPlayingDua(false);
    }

    if (isPlayingDua) {
      duaAudioRef.current.pause();
      duaAudioRef.current.currentTime = 0;
      setIsPlayingDua(false);
    } else {
      duaAudioRef.current.currentTime = 0;
      duaAudioRef.current.play()
        .then(() => setIsPlayingDua(true))
        .catch(() => setIsPlayingDua(false));
    }
  };

  return (
    <div className={`tqp-home ${isRtl ? 'font-urdu' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* =====================================================
          1. HEADER (MAIN MENU + ACTIONS)
          ===================================================== */}
      <header className="tqp-header">
        <button 
          className="main-menu-btn" 
          onClick={onOpenMenu}
          aria-label={loc.mainMenu.menuTitle}
        >
          <Menu className="menu-icon" />
          <span>
            <span style={{ fontSize: '11px', letterSpacing: '0.5px', opacity: 0.85 }}>MAIN</span>
            <span style={{ fontSize: '14px', fontWeight: 800 }}>MENU</span>
          </span>
        </button>

        <div className="header-actions">
          <button 
            className="header-icon" 
            onClick={onOpenParentDashboard}
            title={hs.header.parentDashboardTitle}
            aria-label="Parent Dashboard"
          >
            <Shield size={22} className="text-rose-400" />
          </button>
          
          <button 
            className="header-icon" 
            onClick={onOpenLanguage}
            title={hs.header.languageTitle}
            aria-label="Language Selector"
          >
            <Globe size={22} className="text-sky-400" />
          </button>
          
          <button 
            className="header-icon" 
            onClick={onOpenSettings}
            title={hs.header.settingsTitle}
            aria-label="Settings"
          >
            <Settings size={22} className="text-slate-300" />
          </button>
        </div>
      </header>

      {/* =====================================================
          1.5 RABBI ZIDNI ILMA - SHEIKH SUDAIS DUA BANNER
          ===================================================== */}
      <div 
        className="tqp-dua-card" 
        onClick={handleToggleDuaAudio}
        style={{ cursor: 'pointer' }}
        title={hs.duaCard.clickToListen}
      >
        <div className="tqp-dua-header">
          <div className="tqp-dua-badge">
            <Sparkles size={13} className="text-amber-400" />
            <span>{hs.duaCard.title}</span>
          </div>
          <div className="tqp-reciter-tag">
            <Volume2 size={13} />
            <span>{hs.duaCard.reciter}</span>
          </div>
        </div>

        <div className="tqp-dua-body">
          <div className="tqp-dua-arabic-container">
            <div className="tqp-dua-arabic">
              رَّبِّ زِدْنِي عِلْمًا
            </div>
            <div className="tqp-dua-trans">
              {hs.duaCard.translation}
            </div>
          </div>

          <button 
            type="button"
            className={`tqp-dua-play-btn ${isPlayingDua ? 'playing' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDuaAudio();
            }}
            aria-label={hs.duaCard.clickToListen}
          >
            {isPlayingDua ? (
              <div className="tqp-sound-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <Play size={24} fill="currentColor" style={{ marginLeft: isRtl ? '0' : '2px' }} />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          2. PROFILE + STATS ROW
          ===================================================== */}
      <div className="tqp-profile-row">
        <button 
          className="profile-avatar" 
          onClick={onOpenGamification}
          title={hs.stats.profileTitle}
          aria-label="User Profile"
        >
          <User size={34} className="text-white" />
        </button>

        <div className="stats-area">
          <div 
            className="stat-card coins" 
            onClick={onOpenGamification}
            title={hs.stats.coinsTitle}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Coins size={16} className="text-amber-400" />
              <span className="stat-number">{progress?.coins || 0}</span>
            </div>
            <span className="stat-label">{t.coins || hs.stats.coinsTitle}</span>
          </div>

          <div 
            className="stat-card streak" 
            onClick={onOpenGamification}
            title={hs.stats.streakTitle}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={16} className="text-orange-500" />
              <span className="stat-number">{progress?.streak || 0}</span>
            </div>
            <span className="stat-label">{t.streak || hs.stats.streakTitle}</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. WELCOME CARD
          ===================================================== */}
      <div className="welcome-card">
        <div className="welcome-content">
          <div className="welcome-title">{t.assalamuAlaikum} 👋</div>
          <p>{t.welcomeSubtitle}</p>
        </div>
        <button 
          className="continue-btn" 
          onClick={onOpenMadaniQaidah}
        >
          <span>{t.continueText}</span>
          <span style={{ fontSize: '13px' }}>{isRtl ? '◀' : '▶'}</span>
        </button>
      </div>

      {/* =====================================================
          4. ONLINE MADRASA PORTAL CARD
          ===================================================== */}
      <div 
        className="welcome-card" 
        style={{ 
          marginTop: '16px',
          background: 'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18), transparent 35%), #12211c',
          border: '2px solid rgba(16, 185, 129, 0.45)',
          cursor: 'pointer'
        }}
        onClick={onOpenMadrasaPortal}
      >
        <div className="welcome-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ 
              background: 'rgba(16, 185, 129, 0.25)', 
              color: '#34d399', 
              fontSize: '11px', 
              fontWeight: 800, 
              padding: '3px 10px', 
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.35)' 
            }}>
              {t.madrasaPanelBadge || loc.mainMenu.madrasaPortalSub}
            </span>
            <div className="welcome-title" style={{ color: '#34d399', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <School size={22} className="text-emerald-400" />
              <span>{t.madrasaPanelTitle || loc.mainMenu.madrasaPortalTitle}</span>
            </div>
          </div>
          <p style={{ color: '#d1fae5', fontSize: '13.5px', marginTop: '6px' }}>
            {t.madrasaPanelDesc || 'لائیو کلاس روم، حاضری، فیس، امتحانات اور اساتذہ کا مکمل پورٹل'}
          </p>
        </div>
        <button 
          className="continue-btn" 
          style={{ background: 'linear-gradient(135deg, #059669, #047857)', alignSelf: 'flex-start' }}
          onClick={(e) => { e.stopPropagation(); onOpenMadrasaPortal?.(); }}
        >
          <span>{t.openPanel || loc.mainMenu.enterPortal}</span>
          <span style={{ fontSize: '13px' }}>{isRtl ? '◀' : '▶'}</span>
        </button>
      </div>

      {/* =====================================================
          5. FEATURED QURAN & ISLAMIC LEARNING HUBS
          ===================================================== */}
      <div className="featured-hubs-section">
        <div className="section-heading">
          <h2>{hs.featuredHubs.heading}</h2>
          <span onClick={onOpenQuranLearning}>{hs.featuredHubs.viewMore}</span>
        </div>

        <div className="featured-hubs-grid">
          {/* 1. قرآن مجید تمام 30 پارے کارڈ */}
          <div 
            className="featured-hub-card quran-hub-card" 
            onClick={onOpenQuranLearning}
            title={hs.featuredHubs.quranTitle}
          >
            <div className="hub-card-top">
              <div className="hub-badge gold">
                <Sparkles size={13} className="text-amber-300" />
                <span>{hs.featuredHubs.quranBadge}</span>
              </div>
              <div className="hub-icon-medallion gold">
                <BookOpen size={24} />
              </div>
            </div>

            <div className="hub-card-content">
              <h3 className="hub-title">{hs.featuredHubs.quranTitle}</h3>
              <p className="hub-desc">
                {hs.featuredHubs.quranDesc}
              </p>
            </div>

            <div className="hub-card-footer">
              <button 
                className="hub-action-btn gold" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onOpenQuranLearning?.(); 
                }}
              >
                <span>{hs.featuredHubs.quranBtn}</span>
                <span style={{ fontSize: '13px' }}>{isRtl ? '◀' : '▶'}</span>
              </button>
            </div>
          </div>

          {/* 2. اسلامی تربیتی مرکز کارڈ */}
          <div 
            className="featured-hub-card islamic-hub-card" 
            onClick={onOpenIslamicHub}
            title={hs.featuredHubs.islamicTitle}
          >
            <div className="hub-card-top">
              <div className="hub-badge emerald">
                <Landmark size={13} className="text-emerald-300" />
                <span>{hs.featuredHubs.islamicBadge}</span>
              </div>
              <div className="hub-icon-medallion emerald">
                <Compass size={24} />
              </div>
            </div>

            <div className="hub-card-content">
              <h3 className="hub-title">{hs.featuredHubs.islamicTitle}</h3>
              <p className="hub-desc">
                {hs.featuredHubs.islamicDesc}
              </p>
            </div>

            <div className="hub-card-footer">
              <button 
                className="hub-action-btn emerald" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onOpenIslamicHub?.(); 
                }}
              >
                <span>{hs.featuredHubs.islamicBtn}</span>
                <span style={{ fontSize: '13px' }}>{isRtl ? '◀' : '▶'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          6. DAILY GOAL CARD
          ===================================================== */}
      <div className="daily-goal-card">
        <div className="goal-top">
          <div className="goal-icon">
            <Trophy size={26} className="text-amber-600" />
          </div>
          <div className="goal-title-area">
            <h2>{t.dailyGoalTitle}</h2>
            <p>{t.dailyGoalSubtitle}</p>
          </div>
          <div className="goal-progress">
            <span>80%</span>
          </div>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: '80%' }}></div>
        </div>

        <div className="goal-bottom">
          <span>{hs.stats.remainingTime}</span>
          <span>{hs.stats.timeFraction}</span>
        </div>
      </div>

      {/* =====================================================
          7. INTERACTIVE LEARNING & TAJWEED GAMES (6 CARDS)
          ===================================================== */}
      <div className="interactive-learning-section">
        <div className="section-heading">
          <h2>{hs.interactiveGrid.heading}</h2>
          <span onClick={onOpenQaidaGames}>{hs.interactiveGrid.viewMore}</span>
        </div>

        <div className="interactive-grid">
          {/* 1. مدنی قاعدہ */}
          <div 
            className="interactive-card" 
            onClick={onOpenMadaniQaidah}
            title={hs.interactiveGrid.madaniQaidah.title}
          >
            <div className="card-badge-pill blue">{hs.interactiveGrid.madaniQaidah.pill}</div>
            <div className="interactive-icon blue">
              <BookOpen size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.madaniQaidah.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.madaniQaidah.sub}</small>
          </div>

          {/* 2. ترتیب وار بلینک بورڈ */}
          <div 
            className="interactive-card" 
            onClick={onOpenSequentialBlankBoard}
            title={hs.interactiveGrid.blankBoard.title}
          >
            <div className="card-badge-pill amber">{hs.interactiveGrid.blankBoard.pill}</div>
            <div className="interactive-icon amber">
              <Sparkles size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.blankBoard.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.blankBoard.sub}</small>
          </div>

          {/* 3. مرکبات پزل گیم */}
          <div 
            className="interactive-card" 
            onClick={onOpenMurakkabatPuzzle}
            title={hs.interactiveGrid.murakkabatPuzzle.title}
          >
            <div className="card-badge-pill purple">{hs.interactiveGrid.murakkabatPuzzle.pill}</div>
            <div className="interactive-icon purple">
              <Layers size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.murakkabatPuzzle.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.murakkabatPuzzle.sub}</small>
          </div>

          {/* 4. تجویدی گیمز و کوئز */}
          <div 
            className="interactive-card" 
            onClick={onOpenQaidaGames}
            title={hs.interactiveGrid.tajweedGames.title}
          >
            <div className="card-badge-pill emerald">{hs.interactiveGrid.tajweedGames.pill}</div>
            <div className="interactive-icon emerald">
              <Gamepad2 size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.tajweedGames.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.tajweedGames.sub}</small>
          </div>

          {/* 5. پرو اے آئی استاد */}
          <div 
            className="interactive-card" 
            onClick={onOpenAiUstadh}
            title={hs.interactiveGrid.aiUstadh.title}
          >
            <div className="card-badge-pill rose">{hs.interactiveGrid.aiUstadh.pill}</div>
            <div className="interactive-icon rose">
              <Mic2 size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.aiUstadh.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.aiUstadh.sub}</small>
          </div>

          {/* 6. لائیو کلاس روم */}
          <div 
            className="interactive-card" 
            onClick={onOpenLiveUstadh}
            title={hs.interactiveGrid.liveClassroom.title}
          >
            <div className="card-badge-pill cyan">{hs.interactiveGrid.liveClassroom.pill}</div>
            <div className="interactive-icon cyan">
              <Video size={24} />
            </div>
            <strong className="interactive-title">{hs.interactiveGrid.liveClassroom.title}</strong>
            <small className="interactive-sub">{hs.interactiveGrid.liveClassroom.sub}</small>
          </div>
        </div>
      </div>

      {/* =====================================================
          8. BOTTOM NAVIGATION
          ===================================================== */}
      <nav className="bottom-nav" aria-label="Bottom Navigation">
        <button className="nav-item active" onClick={() => {}} title={hs.bottomNav.home}>
          <Home className="nav-icon" size={20} />
          <span className="nav-label">{hs.bottomNav.home}</span>
        </button>

        <button className="nav-item" onClick={onOpenLiveUstadh} title={hs.bottomNav.liveClass}>
          <Video className="nav-icon" size={20} />
          <span className="nav-label">{hs.bottomNav.liveClass}</span>
        </button>

        <button className="nav-item" onClick={onOpenQaidaGames} title={hs.bottomNav.games}>
          <Gamepad2 className="nav-icon" size={20} />
          <span className="nav-label">{hs.bottomNav.games}</span>
        </button>

        <button className="nav-item" onClick={onOpenMadaniQaidah} title={hs.bottomNav.qaidaQuran}>
          <BookOpen className="nav-icon" size={20} />
          <span className="nav-label">{hs.bottomNav.qaidaQuran}</span>
        </button>

        <button className="nav-item" onClick={onOpenParentDashboard} title={hs.bottomNav.parent}>
          <LayoutDashboard className="nav-icon" size={20} />
          <span className="nav-label">{hs.bottomNav.parent}</span>
        </button>
      </nav>
    </div>
  );
}
