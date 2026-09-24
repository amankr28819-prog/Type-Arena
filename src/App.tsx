import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Navbar, type NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ThemeStudioModal } from './components/ui3d/ThemeStudioModal';
import { AmbientEnvironment } from './components/ui3d/AmbientEnvironment';
import { PageTransition } from './components/ui3d/PageTransition';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { ExamPage } from './pages/ExamPage';
import { GamesPage } from './pages/GamesPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { cleanupCharacterStudioData } from './lib/storage';

function getTabFromPath(pathname: string): NavTab {
  const clean = pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!clean || clean === 'home') return 'home';
  if (clean.startsWith('learn')) return 'learn';
  if (clean.startsWith('practice')) return 'practice';
  if (clean.startsWith('exam') || clean.startsWith('test')) return 'exam';
  if (clean.startsWith('game') || clean.startsWith('games')) return 'games';
  if (clean.startsWith('stat') || clean.startsWith('stats')) return 'stats';
  if (clean.startsWith('setting') || clean.startsWith('settings')) return 'settings';
  return 'home';
}

function getPathFromTab(tab: NavTab): string {
  if (tab === 'home') return '/';
  return `/${tab}`;
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'home';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const { settings } = useSettings();

  // One-time cleanup of legacy character data
  useEffect(() => {
    cleanupCharacterStudioData();
  }, []);

  // Synchronize with browser Back and Forward history buttons
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // States to pass mistakes directly into practice drill
  const [mistakeKeys, setMistakeKeys] = useState<string[]>([]);
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);

  const handleNavigateToPractice = (keys: string[], words: string[]) => {
    setMistakeKeys(keys);
    setMistakeWords(words);
    handleTabChange('practice');
  };

  const handleTabChange = (tab: NavTab) => {
    if (tab !== 'practice') {
      setMistakeKeys([]);
      setMistakeWords([]);
    }
    setActiveTab(tab);
    const targetPath = getPathFromTab(tab);
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200 relative overflow-x-hidden intensity-${settings.animationIntensity} depth-${settings.uiDepth}`}
    >
      {/* Dynamic 3D Environmental Atmosphere */}
      <AmbientEnvironment />

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main View Area with Smooth 3D Section Transitions */}
      <main className="flex-1 flex flex-col justify-start relative z-10 pb-20 md:pb-0">
        <PageTransition activeKey={activeTab}>
          {activeTab === 'home' && (
            <HomePage onNavigateToPractice={handleNavigateToPractice} />
          )}
          {activeTab === 'learn' && <LearnPage />}
          {activeTab === 'practice' && (
            <PracticePage
              initialMistakeKeys={mistakeKeys}
              initialMistakeWords={mistakeWords}
            />
          )}
          {activeTab === 'exam' && <ExamPage />}
          {activeTab === 'games' && <GamesPage />}
          {activeTab === 'stats' && <StatsPage />}
          {activeTab === 'settings' && (
            <SettingsPage onOpenThemeModal={() => setIsThemeModalOpen(true)} />
          )}
        </PageTransition>
      </main>

      {/* Footer */}
      <Footer
        onOpenSettings={() => handleTabChange('settings')}
        onOpenThemes={() => setIsThemeModalOpen(true)}
      />

      {/* 3D Theme Studio Modal */}
      <ThemeStudioModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </ThemeProvider>
  );
}
