import React from 'react';
import {
  Keyboard,
  BookOpen,
  Target,
  GraduationCap,
  Gamepad2,
  BarChart3,
  Settings,
  Palette,
  Volume2,
  VolumeX,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { soundEngine } from '../../lib/audio';

export type NavTab = 'home' | 'learn' | 'practice' | 'exam' | 'games' | 'stats' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenThemeModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenThemeModal
}) => {
  const { currentTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const toggleMute = () => {
    if (settings.soundProfile === 'off') {
      updateSettings({ soundProfile: 'clicky' });
    } else {
      updateSettings({ soundProfile: 'off' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Type', icon: Keyboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'exam', label: 'Exam', icon: GraduationCap },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/85 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--bg-main)] shadow-md shadow-[var(--color-primary)]/25 transition-transform group-hover:scale-105 group-active:scale-95">
            <Keyboard className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base tracking-tight text-[var(--text-main)] flex items-center gap-1.5 font-mono">
              TYPEARENA
              <span className="text-[10px] font-sans px-1.5 py-0.5 rounded-full bg-[var(--bg-subtle)] text-[var(--color-primary)] border border-[var(--border-color)] shadow-xs">
                3D
              </span>
            </span>
            <span className="text-[10px] text-[var(--text-sub)] tracking-wider uppercase font-semibold">
              Tactile Interactive Typing
            </span>
          </div>
        </div>

        {/* Primary 3D Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-subtle)]/90 p-1.5 rounded-2xl border border-[var(--border-color)] shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEngine.playButtonClick();
                  onTabChange(item.id as NavTab);
                }}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none
                  ${
                    isActive
                      ? 'btn-3d btn-3d-primary font-bold shadow-md'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                  }
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Theme Studio, Sound Toggle, Local Privacy */}
        <div className="flex items-center gap-2">
          {/* Theme Studio Button */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenThemeModal();
            }}
            className="btn-3d flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] transition-all cursor-pointer min-h-[40px]"
            title="Open 3D Theme Studio"
            aria-label="Open Theme Studio"
          >
            <span
              className="w-3 h-3 rounded-full ring-2 ring-[var(--border-color)] shadow-xs"
              style={{ backgroundColor: currentTheme.colors.colorPrimary }}
            />
            <span className="hidden sm:inline capitalize font-mono text-[11px]">{currentTheme.name}</span>
            <Palette className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              toggleMute();
            }}
            className="btn-3d p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={settings.soundProfile === 'off' ? 'Sound: Muted (Click to enable)' : `Sound: ${settings.soundProfile}`}
            aria-label="Toggle Sound"
          >
            {settings.soundProfile === 'off' ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--color-primary)]" />
            )}
          </button>

          {/* Local Privacy Badge */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400 select-none shadow-xs"
            title="All your data is stored 100% locally on this device. No account or tracking required."
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local & Private</span>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Touch-optimized 44px+ targets & Safe Area support) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--bg-surface)]/95 backdrop-blur-xl border-t border-[var(--border-color)] px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playButtonClick();
                onTabChange(item.id as NavTab);
              }}
              className={`flex-1 min-h-[44px] min-w-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'text-[var(--color-primary)] font-bold bg-[var(--bg-subtle)]/70'
                  : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
