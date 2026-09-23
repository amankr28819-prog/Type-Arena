import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar, type NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ThemeSelectorModal } from './components/themes/ThemeSelectorModal';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { ExamPage } from './pages/ExamPage';
import { GamesPage } from './pages/GamesPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import { CharacterStudioPage } from './pages/CharacterStudioPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // States to pass mistakes directly into practice drill
  const [mistakeKeys, setMistakeKeys] = useState<string[]>([]);
  const [mistakeWords, setMistakeWords] = useState<string[]>([]);

  const handleNavigateToPractice = (keys: string[], words: string[]) => {
    setMistakeKeys(keys);
    setMistakeWords(words);
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab !== 'practice') {
            setMistakeKeys([]);
            setMistakeWords([]);
          }
          setActiveTab(tab);
        }}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col justify-start">
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
        {activeTab === 'studio' && <CharacterStudioPage />}
        {activeTab === 'stats' && <StatsPage />}
        {activeTab === 'settings' && (
          <SettingsPage onOpenThemeModal={() => setIsThemeModalOpen(true)} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenSettings={() => setActiveTab('settings')}
        onOpenThemes={() => setIsThemeModalOpen(true)}
      />

      {/* Theme Selector / Builder Modal */}
      <ThemeSelectorModal
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
