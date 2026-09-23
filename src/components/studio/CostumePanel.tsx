import React from 'react';
import {
  Shirt,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
import type { AppearanceMode, FacialExpression, CostumeLayers } from './character/AnimeHeroine3D';

interface CostumePanelProps {
  appearanceMode: AppearanceMode;
  onSetAppearanceMode: (mode: AppearanceMode) => void;
  costumeLayers: CostumeLayers;
  onToggleLayer: (layer: keyof CostumeLayers) => void;
  expression: FacialExpression;
  onSetExpression: (expr: FacialExpression) => void;
  skinSheen: number;
  onSetSkinSheen: (sheen: number) => void;
}

export const CostumePanel: React.FC<CostumePanelProps> = ({
  appearanceMode,
  onSetAppearanceMode,
  costumeLayers,
  onToggleLayer,
  expression,
  onSetExpression,
  skinSheen,
  onSetSkinSheen,
}) => {
  const appearanceModes: { id: AppearanceMode; label: string; desc: string }[] = [
    {
      id: 'full',
      label: 'Full Combat Outfit',
      desc: 'Complete Demon Slayer uniform with outer haori, jacket, pleated skirt, & striped stockings',
    },
    {
      id: 'revealing',
      label: 'Revealing Variant',
      desc: 'Haori removed with open collar and flared mini skirt accentuating athletic curves',
    },
    {
      id: 'unclothed',
      label: 'Artistic Unclothed Study',
      desc: 'Full-body anatomical figure study for 360° form inspection with soft studio lighting',
    },
  ];

  const layerItems: { key: keyof CostumeLayers; label: string }[] = [
    { key: 'haori', label: 'Outer Haori Robe' },
    { key: 'jacket', label: 'Uniform Jacket & Collar' },
    { key: 'skirt', label: 'Pleated Mini Skirt' },
    { key: 'stockings', label: 'Thigh-High Stockings' },
    { key: 'belt', label: 'White Leather Belt' },
    { key: 'sword', label: 'Nichirin Sword & Sheath' },
  ];

  const expressions: { id: FacialExpression; label: string; icon: string }[] = [
    { id: 'smile', label: 'Gentle Smile', icon: '😊' },
    { id: 'confident', label: 'Confident Smirk', icon: '😏' },
    { id: 'blush', label: 'Rosy Blush', icon: '😳' },
    { id: 'fierce', label: 'Combat Focus', icon: '😠' },
  ];

  return (
    <div className="flex flex-col gap-4 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="font-bold text-sm text-[var(--text-main)]">Wardrobe & Anatomy</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
          3D Studio
        </span>
      </div>

      {/* Preset Appearance States */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider">
          Appearance State
        </label>
        <div className="grid grid-cols-1 gap-1.5">
          {appearanceModes.map((item) => {
            const isActive = appearanceMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSetAppearanceMode(item.id)}
                className={`
                  flex flex-col text-left p-2.5 rounded-xl border transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--text-main)] shadow-sm'
                      : 'bg-[var(--bg-subtle)]/60 border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold ${isActive ? 'text-[var(--color-primary)]' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                </div>
                <span className="text-[10px] opacity-75 mt-0.5">{item.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Individual Layer Toggles */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider flex items-center justify-between">
          <span>Costume Layers</span>
          <span className="text-[10px] font-normal lowercase opacity-70">custom toggle</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {layerItems.map((item) => {
            const isEnabled = costumeLayers[item.key];
            return (
              <button
                key={item.key}
                onClick={() => onToggleLayer(item.key)}
                className={`
                  flex items-center justify-between px-2.5 py-2 rounded-xl border text-[11px] font-medium transition-all cursor-pointer
                  ${
                    isEnabled
                      ? 'bg-[var(--bg-surface)] border-[var(--color-primary)]/50 text-[var(--text-main)]'
                      : 'bg-[var(--bg-subtle)]/40 border-[var(--border-color)]/60 text-[var(--text-muted)] line-through'
                  }
                `}
              >
                <span>{item.label}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEnabled ? 'bg-[var(--color-primary)]' : 'bg-zinc-600'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Facial Expression Selector */}
      <div className="flex flex-col gap-1.5 pt-1">
        <label className="text-[11px] font-semibold text-[var(--text-sub)] uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-[var(--color-primary)]" />
          <span>Facial Expression</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {expressions.map((expr) => {
            const isActive = expression === expr.id;
            return (
              <button
                key={expr.id}
                onClick={() => onSetExpression(expr.id)}
                className={`
                  flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[var(--color-primary)]/15 border-[var(--color-primary)] text-[var(--text-main)] font-semibold'
                      : 'bg-[var(--bg-subtle)]/60 border-[var(--border-color)] text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }
                `}
              >
                <span className="text-base">{expr.icon}</span>
                <span className="text-[11px]">{expr.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Sheen & Skin Texture */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[var(--text-sub)] uppercase tracking-wider flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[var(--color-primary)]" />
            <span>Surface Sheen / Gloss</span>
          </span>
          <span className="font-mono text-[var(--color-primary)]">
            {Math.round(skinSheen * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.05"
          max="0.85"
          step="0.05"
          value={skinSheen}
          onChange={(e) => onSetSkinSheen(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[var(--bg-subtle)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
        />
        <span className="text-[10px] text-[var(--text-muted)]">
          Adjusts specular rim highlights and skin luster for artistic study.
        </span>
      </div>
    </div>
  );
};
