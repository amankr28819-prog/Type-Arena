import { Shield } from 'lucide-react';

interface FooterProps {
  onOpenSettings: () => void;
  onOpenThemes: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSettings, onOpenThemes }) => {
  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-surface)]/50 mt-auto py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-sub)]">
        {/* Keyboard Shortcuts Hint */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-main)]">
              Tab
            </kbd>
            <span>+</span>
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-main)]">
              Enter
            </kbd>
            <span className="text-[var(--text-sub)] ml-1">Restart</span>
          </div>

          <div className="flex items-center gap-1.5 hidden sm:flex">
            <kbd className="px-2 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-[10px] text-[var(--text-main)]">
              Esc
            </kbd>
            <span className="text-[var(--text-sub)] ml-1">Pause / Reset</span>
          </div>
        </div>

        {/* Local Privacy Pledge */}
        <div className="flex items-center gap-1.5 text-center sm:text-left">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Your typing data stays on this device. 100% Local-First.</span>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenThemes}
            className="hover:text-[var(--text-main)] transition-colors"
          >
            Themes
          </button>
          <span>•</span>
          <button
            onClick={onOpenSettings}
            className="hover:text-[var(--text-main)] transition-colors"
          >
            Preferences
          </button>
          <span>•</span>
          <span className="text-[var(--text-muted)]">TypeArena © 2026</span>
        </div>
      </div>
    </footer>
  );
};
