import React, { useState } from 'react';
import { X, Check, Plus, Trash2, Palette, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { ThemeConfig } from '../../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentTheme, allThemes, customThemes, setTheme, saveCustomTheme, deleteCustomTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [filterCategory, setFilterCategory] = useState<string>('all');

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

  if (!isOpen) return null;

  const categories = ['all', 'dark', 'light', 'colorful', 'retro', 'minimal'];
  const filteredThemes = filterCategory === 'all'
    ? allThemes
    : allThemes.filter((t) => t.category === filterCategory);

  const handleSaveCustom = () => {
    const newTheme: ThemeConfig = {
      id: `custom_${Date.now()}`,
      name: customName.trim() || 'Custom Theme',
      category: 'dark',
      colors: customColors
    };
    saveCustomTheme(newTheme);
    setTheme(newTheme.id);
    setActiveTab('presets');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--color-primary)]/15 text-[var(--color-primary)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-main)]">Theme Collection</h2>
              <p className="text-xs text-[var(--text-sub)]">
                Choose from 24+ crafted themes or build your own custom color palette
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Presets vs Custom Builder */}
        <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            All Themes ({allThemes.length})
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-[var(--color-primary)] text-[var(--bg-main)] shadow-sm'
                : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Custom Theme Builder
          </button>
        </div>

        {/* Tab Content: Presets */}
        {activeTab === 'presets' && (
          <div>
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    filterCategory === cat
                      ? 'bg-[var(--bg-subtle)] text-[var(--color-primary)] font-bold border border-[var(--color-primary)]/40'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
              {filteredThemes.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                const isCustom = customThemes.some((t) => t.id === theme.id);

                return (
                  <div
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`
                      relative flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer select-none transition-all
                      ${
                        isSelected
                          ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 bg-[var(--bg-subtle)] shadow-lg'
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--text-sub)]'
                      }
                    `}
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-main)]">
                          {theme.name}
                        </span>
                        {isCustom && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            Custom
                          </span>
                        )}
                      </div>

                      {/* Color Preview Swatches */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.colors.bgMain }}
                          title="Background"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.colors.textMain }}
                          title="Text"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.colors.colorPrimary }}
                          title="Primary Accent"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.colors.colorCorrect }}
                          title="Correct Color"
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.colors.colorError }}
                          title="Error Color"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-[var(--bg-main)] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      {isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomTheme(theme.id);
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Custom Theme"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Custom Theme Builder */}
        {activeTab === 'custom' && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)] mb-2">
                Theme Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-main)] text-sm font-semibold focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="e.g. Electric Sapphire"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Background Color', key: 'bgMain' },
                { label: 'Surface / Card Color', key: 'bgSurface' },
                { label: 'Primary Text', key: 'textMain' },
                { label: 'Secondary / Subtext', key: 'textSub' },
                { label: 'Primary Accent Color', key: 'colorPrimary' },
                { label: 'Correct Character Color', key: 'colorCorrect' },
                { label: 'Error Character Color', key: 'colorError' },
                { label: 'Caret / Cursor Color', key: 'colorCaret' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]"
                >
                  <span className="text-xs font-medium text-[var(--text-main)]">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customColors[item.key as keyof typeof customColors]}
                      onChange={(e) =>
                        setCustomColors((prev) => ({
                          ...prev,
                          [item.key]: e.target.value
                        }))
                      }
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span className="font-mono text-xs text-[var(--text-sub)] uppercase">
                      {customColors[item.key as keyof typeof customColors]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Mini Preview Box */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                backgroundColor: customColors.bgSurface,
                borderColor: customColors.borderColor
              }}
            >
              <span
                style={{ color: customColors.textSub }}
                className="text-xs uppercase font-mono tracking-wider block mb-2"
              >
                Live Preview
              </span>
              <p style={{ color: customColors.textMain }} className="text-lg font-mono">
                The quick brown{' '}
                <span style={{ color: customColors.colorCorrect, fontWeight: 700 }}>
                  fox jumps
                </span>{' '}
                <span
                  style={{
                    color: customColors.colorError,
                    backgroundColor: customColors.colorErrorBg
                  }}
                >
                  over
                </span>{' '}
                <span style={{ color: customColors.textSub }}>the lazy dog.</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                onClick={() => setActiveTab('presets')}
                className="px-5 py-2.5 rounded-xl text-xs font-medium text-[var(--text-sub)] hover:bg-[var(--bg-subtle)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--bg-main)] font-bold text-xs shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Save & Apply Theme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
