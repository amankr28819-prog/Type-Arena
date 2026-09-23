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
    <header className="w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-[var(--bg-main)] shadow-md shadow-[var(--color-primary)]/20 transition-transform group-hover:scale-105">
            <Keyboard className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-[var(--text-main)] flex items-center gap-1.5 font-mono">
              TYPEARENA
              <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--color-primary)] border border-[var(--border-color)]">
                v1.0
              </span>
            </span>
            <span className="text-[10px] text-[var(--text-sub)] tracking-wider uppercase font-semibold">
              Learn. Practice. Master.
            </span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-color)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as NavTab)}
                className={`
                  flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
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

        {/* Action Controls: Theme Picker, Sound Mute, Privacy Pill */}
        <div className="flex items-center gap-2">
          {/* Theme Quick Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-medium text-[var(--text-main)] transition-all"
            title="Choose Theme or Build Custom Theme"
          >
            <Palette className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span className="hidden sm:inline capitalize">{currentTheme.name}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-[var(--bg-subtle)] hover:bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] transition-all"
            title={settings.soundProfile === 'off' ? 'Sound: Muted (Click to enable)' : `Sound: ${settings.soundProfile}`}
          >
            {settings.soundProfile === 'off' ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--color-primary)]" />
            )}
          </button>

          {/* Local Privacy Badge */}
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400"
            title="All your data is stored 100% locally on this device. No account or tracking required."
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Local & Private</span>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as NavTab)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-medium ${
                isActive
                  ? 'text-[var(--color-primary)] font-bold'
                  : 'text-[var(--text-sub)]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
