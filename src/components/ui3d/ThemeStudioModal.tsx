import React, { useState, useMemo } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Palette,
  Sparkles,
  Layers,
  Activity,
  Eye,
  Search
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { Button3D } from './Button3D';
import type { ThemeConfig } from '../../types';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeStudioModal: React.FC<ThemeStudioModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentTheme, allThemes, customThemes, setTheme, saveCustomTheme, deleteCustomTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'themes' | 'customizer' | 'create'>('themes');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom theme editor state
  const [customName, setCustomName] = useState('My Custom Theme');
  const [customColors, setCustomColors] = useState({
    bgMain: '#0f172a',
    bgSurface: '#1e293b',
    bgSubtle: '#334155',
    borderColor: '#475569',
    textMain: '#f8fafc',
    textSub: '#94a3b8',
    textMuted: '#64748b',
    colorPrimary: '#38bdf8',
    colorCorrect: '#4ade80',
    colorError: '#f43f5e',
    colorErrorBg: 'rgba(244, 63, 94, 0.2)',
    colorCaret: '#38bdf8',
    keyBg: '#1e293b',
    keyText: '#f8fafc',
    keyActive: '#0284c7'
  });

  const categories = ['all', 'dark', 'light', 'scifi', 'nature', 'colorful', 'retro', 'minimal'];

  const filteredThemes = useMemo(() => {
    return allThemes.filter((t) => {
      const matchesCat = filterCategory === 'all' || t.category === filterCategory;
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allThemes, filterCategory, searchQuery]);

  if (!isOpen) return null;

  // Preset Handlers
  const applyPreset = (preset: 'minimal' | 'balanced' | 'immersive' | 'futuristic') => {
    if (preset === 'minimal') {
      updateSettings({
        uiDepth: 'subtle',
        animationIntensity: 'low',
        backgroundAtmosphere: 'none',
        glassmorphism: false,
        cardTilt: false,
        cursorGlow: false,
        themePreset: 'minimal'
      });
    } else if (preset === 'balanced') {
      updateSettings({
        uiDepth: 'medium',
        animationIntensity: 'medium',
        backgroundAtmosphere: 'subtle',
        glassmorphism: true,
        cardTilt: true,
        cursorGlow: true,
        themePreset: 'balanced'
      });
    } else if (preset === 'immersive') {
      updateSettings({
        uiDepth: 'deep',
        animationIntensity: 'medium',
        backgroundAtmosphere: 'dynamic',
        glassmorphism: true,
        cardTilt: true,
        cursorGlow: true,
        themePreset: 'immersive'
      });
    } else if (preset === 'futuristic') {
      updateSettings({
        uiDepth: 'deep',
        animationIntensity: 'high',
        backgroundAtmosphere: 'dynamic',
        glassmorphism: true,
        cardTilt: true,
        cursorGlow: true,
        themePreset: 'futuristic'
      });
    }
  };

  const handleSaveCustom = () => {
    const newTheme: ThemeConfig = {
      id: `custom_${Date.now()}`,
      name: customName.trim() || 'Custom Theme',
      category: 'dark',
      colors: customColors,
      atmosphere: {
        glow: `${customColors.colorPrimary}40`,
        ambientParticles: 'dust',
        gridPattern: false,
        glassOpacity: 0.85
      }
    };
    saveCustomTheme(newTheme);
    setTheme(newTheme.id);
    setActiveTab('themes');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-5xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl my-8 relative z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between pb-5 border-b border-[var(--border-color)] gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--color-primary)]/15 text-[var(--color-primary)] shadow-sm">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">3D Theme Studio</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  {allThemes.length} Themes
                </span>
              </div>
              <p className="text-xs text-[var(--text-sub)]">
                Immersive color palettes, tactile physical depths, and dynamic environmental motion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-color)] text-xs">
              <button
                onClick={() => setActiveTab('themes')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'themes'
                    ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                Collection
              </button>
              <button
                onClick={() => setActiveTab('customizer')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'customizer'
                    ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                3D Experience
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                    : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                }`}
              >
                Create
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 pr-1">
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-md'
                          : 'bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-sub)]" />
                  <input
                    type="text"
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {/* Theme Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredThemes.map((theme) => {
                  const isSelected = currentTheme.id === theme.id;
                  const c = theme.colors;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => setTheme(theme.id)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden card-3d ${
                        isSelected
                          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 shadow-lg'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--color-primary)]/50'
                      }`}
                      style={{
                        backgroundColor: c.bgSurface
                      }}
                    >
                      {/* Theme Glow Accent */}
                      <div
                        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 pointer-events-none filter blur-xl transition-opacity group-hover:opacity-40"
                        style={{ backgroundColor: c.colorPrimary }}
                      />

                      <div className="flex items-start justify-between mb-3 relative z-10">
                        <div>
                          <span
                            className="font-bold text-sm block"
                            style={{ color: c.textMain }}
                          >
                            {theme.name}
                          </span>
                          <span
                            className="text-[10px] capitalize opacity-70"
                            style={{ color: c.textSub }}
                          >
                            {theme.category}
                            {theme.atmosphere?.ambientParticles && theme.atmosphere.ambientParticles !== 'none'
                              ? ` • ${theme.atmosphere.ambientParticles}`
                              : ''}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="p-1 rounded-full bg-[var(--color-primary)] text-[var(--bg-main)]">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Theme Palette Swatches */}
                      <div className="grid grid-cols-5 gap-1.5 h-7 rounded-xl p-1 bg-black/20 border border-white/5 relative z-10">
                        <div className="rounded-lg" style={{ backgroundColor: c.bgMain }} title="Main BG" />
                        <div className="rounded-lg" style={{ backgroundColor: c.colorPrimary }} title="Primary" />
                        <div className="rounded-lg" style={{ backgroundColor: c.colorCorrect }} title="Correct" />
                        <div className="rounded-lg" style={{ backgroundColor: c.colorError }} title="Error" />
                        <div className="rounded-lg" style={{ backgroundColor: c.keyBg }} title="Keycap" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'customizer' && (
            <div className="space-y-6">
              {/* Presets Row */}
              <div className="p-5 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--text-main)]">One-Click 3D Presets</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['minimal', 'balanced', 'immersive', 'futuristic'] as const).map((preset) => (
                    <Button3D
                      key={preset}
                      variant={settings.themePreset === preset ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      className="capitalize py-2"
                    >
                      {preset}
                    </Button3D>
                  ))}
                </div>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 3D UI Depth */}
                <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                      Physical 3D Depth
                    </span>
                    <span className="text-xs font-mono capitalize text-[var(--color-primary)]">
                      {settings.uiDepth}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {(['none', 'subtle', 'medium', 'deep'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => updateSettings({ uiDepth: d })}
                        className={`py-1.5 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-all ${
                          settings.uiDepth === d
                            ? 'bg-[var(--color-primary)] text-[var(--bg-main)] font-bold shadow-md'
                            : 'bg-[var(--bg-surface)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Intensity */}
                <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                      Motion & Animation
                    </span>
                    <span className="text-xs font-mono capitalize text-[var(--color-primary)]">
                      {settings.animationIntensity}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {(['off', 'low', 'medium', 'high'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateSettings({ animationIntensity: lvl })}
                        className={`py-1.5 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-all ${
                          settings.animationIntensity === lvl
                            ? 'bg-[var(--color-primary)] text-[var(--bg-main)] font-bold shadow-md'
                            : 'bg-[var(--bg-surface)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Atmosphere */}
                <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)] flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[var(--color-primary)]" />
                      Atmospheric Backdrop
                    </span>
                    <span className="text-xs font-mono capitalize text-[var(--color-primary)]">
                      {settings.backgroundAtmosphere}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {(['none', 'subtle', 'dynamic'] as const).map((bg) => (
                      <button
                        key={bg}
                        onClick={() => updateSettings({ backgroundAtmosphere: bg })}
                        className={`py-1.5 text-xs font-semibold rounded-xl capitalize cursor-pointer transition-all ${
                          settings.backgroundAtmosphere === bg
                            ? 'bg-[var(--color-primary)] text-[var(--bg-main)] font-bold shadow-md'
                            : 'bg-[var(--bg-surface)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-around gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cardTilt}
                      onChange={(e) => updateSettings({ cardTilt: e.target.checked })}
                      className="rounded accent-[var(--color-primary)]"
                    />
                    3D Card Tilt
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.glassmorphism}
                      onChange={(e) => updateSettings({ glassmorphism: e.target.checked })}
                      className="rounded accent-[var(--color-primary)]"
                    />
                    Glassmorphism
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text-main)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.cursorGlow}
                      onChange={(e) => updateSettings({ cursorGlow: e.target.checked })}
                      className="rounded accent-[var(--color-primary)]"
                    />
                    Cursor Glow
                  </label>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-xl card-3d">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
                  <span className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-wider">
                    Live 3D Component Preview
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)]">
                    Active: {currentTheme.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="space-y-2">
                    <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Tactile 3D Buttons</span>
                    <div className="flex gap-2">
                      <Button3D variant="primary" size="sm">Primary</Button3D>
                      <Button3D variant="secondary" size="sm">Secondary</Button3D>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Physical Keycaps</span>
                    <div className="flex gap-2">
                      <div className="keycap-3d px-3 py-1.5 text-xs font-mono font-bold">Space</div>
                      <div className="keycap-3d keycap-3d-active px-3 py-1.5 text-xs font-mono font-bold">Enter</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-[var(--text-sub)] font-semibold uppercase">Readability & Contrast</span>
                    <div className="text-xs">
                      <span className="text-[var(--color-correct)] font-bold">99.8% WPM Accuracy</span>
                      <p className="text-[var(--text-sub)] text-[11px]">WCAG High Contrast Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Theme Name..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--color-primary)]"
                />
                <Button3D variant="primary" onClick={handleSaveCustom} icon={<Plus className="w-4 h-4" />}>
                  Save Custom Theme
                </Button3D>
              </div>

              {/* Color pickers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between">
                    <label className="text-xs capitalize font-medium text-[var(--text-sub)]">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => setCustomColors((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                ))}
              </div>

              {customThemes.length > 0 && (
                <div className="pt-4 border-t border-[var(--border-color)]">
                  <h4 className="text-xs font-bold uppercase text-[var(--text-sub)] mb-3">Saved Custom Themes ({customThemes.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customThemes.map((ct) => (
                      <div key={ct.id} className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: ct.colors.colorPrimary }} />
                          <span className="text-xs font-bold text-[var(--text-main)]">{ct.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setTheme(ct.id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-primary)] text-[var(--bg-main)]"
                          >
                            Apply
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCustomTheme(ct.id)}
                            className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            title="Delete custom theme"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
