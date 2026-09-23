import React, { useState, useRef } from 'react';
import {
  Settings,
  Palette,
  Volume2,
  Sliders,
  Shield,
  Download,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../context/ThemeContext';
import { storage } from '../lib/storage';
import type { CaretStyle, LayoutType, SoundProfile, Difficulty } from '../types';
import { soundEngine } from '../lib/audio';

interface SettingsPageProps {
  onOpenThemeModal: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenThemeModal }) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { currentTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [resetModalScope, setResetModalScope] = useState<'all' | 'history' | 'progress' | 'settings' | null>(null);

  // Sound test button
  const handleTestSound = () => {
    soundEngine.playKeystroke(settings.soundProfile);
  };

  // Export JSON file
  const handleExportData = async () => {
    const jsonStr = await storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typearena_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await storage.importAllData(content);
      if (res.success) {
        setImportStatus({ success: true, msg: 'Backup imported successfully! Reloading data...' });
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus({ success: false, msg: res.error || 'Failed to parse backup JSON.' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Confirm and execute reset
  const handleConfirmReset = async () => {
    if (!resetModalScope) return;
    await storage.resetAllData(resetModalScope);
    if (resetModalScope === 'settings' || resetModalScope === 'all') {
      resetSettings();
    }
    setResetModalScope(null);
    setImportStatus({ success: true, msg: 'Selected data was reset successfully.' });
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-10 px-4 flex flex-col gap-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-wider mb-2">
          <Settings className="w-4 h-4" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-main)] tracking-tight">
          Preferences & Configuration
        </h1>
        <p className="text-sm text-[var(--text-sub)] mt-1">
          Every option here directly alters the typing engine, audio synthesis, and visual appearance in real time.
        </p>
      </div>

      {/* Import / Reset Alert Message */}
      {importStatus && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
            importStatus.success
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
          }`}
        >
          {importStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{importStatus.msg}</span>
        </div>
      )}

      {/* 1. TYPING ENGINE & RULES */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
          Typing Engine & Behavior Rules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Caret Style */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Caret Style
            </label>
            <select
              value={settings.caretStyle}
              onChange={(e) => updateSettings({ caretStyle: e.target.value as CaretStyle })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)]"
            >
              <option value="line">Line (Vertical Line)</option>
              <option value="block">Block (Shaded Box)</option>
              <option value="underline">Underline</option>
              <option value="box">Box (Outlined Border)</option>
            </select>
          </div>

          {/* Difficulty Rules */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Difficulty Strictness
            </label>
            <select
              value={settings.difficulty}
              onChange={(e) => updateSettings({ difficulty: e.target.value as Difficulty })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)]"
            >
              <option value="normal">Normal (Standard corrections)</option>
              <option value="advanced">Advanced (No previous word backspacing)</option>
              <option value="expert">Expert (Stop on error)</option>
              <option value="master">Master (Instant failure on any mistake)</option>
            </select>
          </div>

          {/* Minimum WPM Threshold */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Minimum Required WPM (0 = disabled)
            </label>
            <input
              type="number"
              min="0"
              max="200"
              value={settings.minWpm}
              onChange={(e) =>
                updateSettings({ minWpm: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)]"
            />
          </div>

          {/* Minimum Accuracy Threshold */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Minimum Required Accuracy % (0 = disabled)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.minAccuracy}
              onChange={(e) =>
                updateSettings({ minAccuracy: Math.max(0, parseInt(e.target.value, 10) || 0) })
              }
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-mono text-[var(--text-main)]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Smooth Caret Motion</span>
            <input
              type="checkbox"
              checked={settings.smoothCaret}
              onChange={(e) => updateSettings({ smoothCaret: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Blind Mode (Hide character colors)</span>
            <input
              type="checkbox"
              checked={settings.blindMode}
              onChange={(e) => updateSettings({ blindMode: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Stop On Error (Lock progression)</span>
            <input
              type="checkbox"
              checked={settings.stopOnError}
              onChange={(e) => updateSettings({ stopOnError: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Disable Backspace (Permanent strokes)</span>
            <input
              type="checkbox"
              checked={settings.disableBackspace}
              onChange={(e) => updateSettings({ disableBackspace: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>
        </div>
      </div>

      {/* 2. AUDIO SYNTHESIS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[var(--color-primary)]" />
          Sound Engine (Web Audio Synthesizer)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Switch Sound Profile */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Switch Sound Profile
            </label>
            <div className="flex items-center gap-2">
              <select
                value={settings.soundProfile}
                onChange={(e) => updateSettings({ soundProfile: e.target.value as SoundProfile })}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)]"
              >
                <option value="off">Off (Silent Mute)</option>
                <option value="clicky">Cherry MX Blue (Clicky)</option>
                <option value="tactile">Cherry MX Brown (Tactile)</option>
                <option value="linear">Cherry MX Red (Linear)</option>
                <option value="typewriter">Typewriter (Mechanical Vintage)</option>
                <option value="beep">Retro Beep (8-Bit Chip)</option>
              </select>
              {settings.soundProfile !== 'off' && (
                <button
                  onClick={handleTestSound}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--border-color)] shrink-0"
                >
                  Test
                </button>
              )}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase text-[var(--text-sub)]">
                Sound Volume
              </label>
              <span className="text-xs font-mono font-bold text-[var(--text-main)]">
                {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.soundVolume}
              onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
              className="w-full accent-[var(--color-primary)] cursor-pointer"
            />
          </div>
        </div>

        <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
          <span className="text-xs font-medium text-[var(--text-main)]">Play Error Alert Sound</span>
          <input
            type="checkbox"
            checked={settings.playErrorSound}
            onChange={(e) => updateSettings({ playErrorSound: e.target.checked })}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
        </label>
      </div>

      {/* 3. APPEARANCE, LAYOUT & TYPOGRAPHY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md flex flex-col gap-6">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[var(--color-primary)]" />
          Appearance, Layout & Typography
        </h2>

        {/* Theme button */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <div>
            <span className="text-xs font-semibold uppercase text-[var(--text-sub)] block">
              Active Theme
            </span>
            <span className="text-base font-bold text-[var(--text-main)] capitalize">
              {currentTheme.name}
            </span>
          </div>
          <button
            onClick={onOpenThemeModal}
            className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] text-xs font-bold shadow-md"
          >
            Browse 24+ Themes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* UI Layout */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Interface Layout Arrangement
            </label>
            <select
              value={settings.layout}
              onChange={(e) => updateSettings({ layout: e.target.value as LayoutType })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)]"
            >
              <option value="classic">Classic (Standard top bar + keyboard)</option>
              <option value="minimal">Minimal (Typing area only, distraction-free)</option>
              <option value="focus">Focus (Fades outer elements during typing)</option>
              <option value="developer">Developer (Code editor header and monospace)</option>
            </select>
          </div>

          {/* Font Family */}
          <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
            <label className="block text-xs font-semibold uppercase text-[var(--text-sub)] mb-2">
              Typing Font Family
            </label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)]"
            >
              <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
              <option value="'Fira Code', monospace">Fira Code</option>
              <option value="'Roboto Mono', monospace">Roboto Mono</option>
              <option value="'Outfit', sans-serif">Outfit</option>
              <option value="'Inter', sans-serif">Inter</option>
            </select>
          </div>
        </div>

        {/* Font Size Slider */}
        <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase text-[var(--text-sub)]">
              Typing Font Size
            </label>
            <span className="text-xs font-mono font-bold text-[var(--text-main)]">
              {settings.fontSize}px
            </span>
          </div>
          <input
            type="range"
            min="16"
            max="36"
            step="1"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value, 10) })}
            className="w-full accent-[var(--color-primary)] cursor-pointer"
          />
        </div>

        {/* UI Elements Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Show Virtual Keyboard</span>
            <input
              type="checkbox"
              checked={settings.showVirtualKeyboard}
              onChange={(e) => updateSettings({ showVirtualKeyboard: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Keyboard Error Heatmap</span>
            <input
              type="checkbox"
              checked={settings.keyboardHeatmap}
              onChange={(e) => updateSettings({ keyboardHeatmap: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">High Contrast Accessibility</span>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={(e) => updateSettings({ highContrast: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] cursor-pointer">
            <span className="text-xs font-medium text-[var(--text-main)]">Reduced Motion (A11y)</span>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
          </label>
        </div>
      </div>

      {/* 4. LOCAL DATA MANAGEMENT (EXPORT, IMPORT, RESET) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-md flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Local Data & Privacy Management
          </h2>
          <p className="text-xs text-[var(--text-sub)] mt-1">
            TypeArena is strictly local-first. We do not transmit or store your typing history on remote servers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export Button */}
          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1">
                <Download className="w-4 h-4 text-[var(--color-primary)]" />
                Export Local Backup
              </span>
              <p className="text-[11px] text-[var(--text-sub)]">
                Download a clean JSON archive of your entire test history, personal bests, custom themes, and course progress.
              </p>
            </div>
            <button
              onClick={handleExportData}
              className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs shadow-md"
            >
              Export JSON File
            </button>
          </div>

          {/* Import Button */}
          <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 mb-1">
                <Upload className="w-4 h-4 text-indigo-400" />
                Import & Restore Backup
              </span>
              <p className="text-[11px] text-[var(--text-sub)]">
                Restore your previous data from a valid TypeArena JSON export. Validates schema before applying.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] font-bold text-xs hover:bg-[var(--border-color)]"
            >
              Select Backup File
            </button>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="pt-4 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium text-[var(--text-sub)]">Danger Zone:</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setResetModalScope('history')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20"
            >
              Reset History
            </button>
            <button
              onClick={() => setResetModalScope('progress')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20"
            >
              Reset Course Progress
            </button>
            <button
              onClick={() => setResetModalScope('settings')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold hover:bg-rose-500/20"
            >
              Reset Settings
            </button>
            <button
              onClick={() => setResetModalScope('all')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-md"
            >
              Factory Wipe Everything
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {resetModalScope && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between text-xs animate-in fade-in">
            <span className="text-rose-400 font-bold">
              Are you sure you want to reset: {resetModalScope.toUpperCase()}? This cannot be undone.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setResetModalScope(null)}
                className="px-3 py-1 rounded-lg bg-[var(--bg-subtle)] text-[var(--text-main)]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold"
              >
                Yes, Reset Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
