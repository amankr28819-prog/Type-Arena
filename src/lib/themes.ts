import type { ThemeConfig } from '../types';

export const BUILTIN_THEMES: ThemeConfig[] = [
  // --- ORIGINAL CORE THEMES (Preserved for backwards compatibility & tests) ---
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'dark',
    colors: {
      bgMain: '#0b0f19',
      bgSurface: '#111827',
      bgSubtle: '#1f2937',
      borderColor: '#2d3748',
      textMain: '#f9fafb',
      textSub: '#6b7280',
      textMuted: '#4b5563',
      colorPrimary: '#38bdf8',
      colorCorrect: '#38bdf8',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#1a2234',
      keyText: '#9ca3af',
      keyActive: '#0284c7',
    },
    atmosphere: {
      glow: 'rgba(56, 189, 248, 0.25)',
      ambientParticles: 'stars',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'dracula',
    name: 'Dracula Dark',
    category: 'dark',
    colors: {
      bgMain: '#21222c',
      bgSurface: '#282a36',
      bgSubtle: '#343746',
      borderColor: '#44475a',
      textMain: '#f8f8f2',
      textSub: '#6272a4',
      textMuted: '#4a5370',
      colorPrimary: '#bd93f9',
      colorCorrect: '#50fa7b',
      colorError: '#ff5555',
      colorErrorBg: 'rgba(255, 85, 85, 0.2)',
      colorCaret: '#bd93f9',
      keyBg: '#2d303e',
      keyText: '#f8f8f2',
      keyActive: '#bd93f9',
    },
    atmosphere: {
      glow: 'rgba(189, 147, 249, 0.25)',
      ambientParticles: 'dust',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    category: 'dark',
    colors: {
      bgMain: '#242933',
      bgSurface: '#2e3440',
      bgSubtle: '#3b4252',
      borderColor: '#434c5e',
      textMain: '#eceff4',
      textSub: '#7b88a1',
      textMuted: '#4c566a',
      colorPrimary: '#88c0d0',
      colorCorrect: '#8fbcbb',
      colorError: '#bf616a',
      colorErrorBg: 'rgba(191, 97, 106, 0.2)',
      colorCaret: '#88c0d0',
      keyBg: '#353c4a',
      keyText: '#d8dee9',
      keyActive: '#81a1c1',
    },
    atmosphere: {
      glow: 'rgba(136, 192, 208, 0.22)',
      ambientParticles: 'none',
      gridPattern: false,
      glassOpacity: 0.88
    }
  },
  {
    id: 'monokai',
    name: 'Monokai Cyber',
    category: 'dark',
    colors: {
      bgMain: '#1e1f1c',
      bgSurface: '#272822',
      bgSubtle: '#383830',
      borderColor: '#49483e',
      textMain: '#f8f8f2',
      textSub: '#75715e',
      textMuted: '#595543',
      colorPrimary: '#e6db74',
      colorCorrect: '#a6e22e',
      colorError: '#f92672',
      colorErrorBg: 'rgba(249, 38, 114, 0.2)',
      colorCaret: '#e6db74',
      keyBg: '#32332c',
      keyText: '#f8f8f2',
      keyActive: '#a6e22e',
    },
    atmosphere: {
      glow: 'rgba(230, 219, 116, 0.22)',
      ambientParticles: 'none',
      gridPattern: true,
      glassOpacity: 0.85
    }
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Twilight',
    category: 'dark',
    colors: {
      bgMain: '#16161e',
      bgSurface: '#1a1b26',
      bgSubtle: '#24283b',
      borderColor: '#292e42',
      textMain: '#c0caf5',
      textSub: '#565f89',
      textMuted: '#414868',
      colorPrimary: '#7aa2f7',
      colorCorrect: '#9ece6a',
      colorError: '#f7768e',
      colorErrorBg: 'rgba(247, 118, 142, 0.2)',
      colorCaret: '#7aa2f7',
      keyBg: '#202334',
      keyText: '#a9b1d6',
      keyActive: '#7aa2f7',
    },
    atmosphere: {
      glow: 'rgba(122, 162, 247, 0.25)',
      ambientParticles: 'neon',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    category: 'colorful',
    colors: {
      bgMain: '#05050a',
      bgSurface: '#0c0d18',
      bgSubtle: '#16182c',
      borderColor: '#ff007f',
      textMain: '#00f0ff',
      textSub: '#7000ff',
      textMuted: '#3d0a66',
      colorPrimary: '#ffe600',
      colorCorrect: '#00f0ff',
      colorError: '#ff0055',
      colorErrorBg: 'rgba(255, 0, 85, 0.25)',
      colorCaret: '#ffe600',
      keyBg: '#111226',
      keyText: '#00f0ff',
      keyActive: '#ff007f',
    },
    atmosphere: {
      glow: 'rgba(255, 0, 127, 0.35)',
      ambientParticles: 'neon',
      gridPattern: true,
      glassOpacity: 0.8
    }
  },
  {
    id: 'matrix-digital',
    name: 'Matrix Digital',
    category: 'retro',
    colors: {
      bgMain: '#020d04',
      bgSurface: '#051808',
      bgSubtle: '#0a260f',
      borderColor: '#00ff41',
      textMain: '#00ff41',
      textSub: '#008f11',
      textMuted: '#003b00',
      colorPrimary: '#00ff41',
      colorCorrect: '#00ff41',
      colorError: '#ff3333',
      colorErrorBg: 'rgba(255, 51, 51, 0.2)',
      colorCaret: '#00ff41',
      keyBg: '#06200a',
      keyText: '#00ff41',
      keyActive: '#00ff41',
    },
    atmosphere: {
      glow: 'rgba(0, 255, 65, 0.3)',
      ambientParticles: 'matrix',
      gridPattern: true,
      glassOpacity: 0.85
    }
  },
  {
    id: 'amoled-black',
    name: 'AMOLED Black',
    category: 'dark',
    colors: {
      bgMain: '#000000',
      bgSurface: '#0a0a0a',
      bgSubtle: '#141414',
      borderColor: '#262626',
      textMain: '#ffffff',
      textSub: '#737373',
      textMuted: '#404040',
      colorPrimary: '#ffffff',
      colorCorrect: '#22c55e',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#ffffff',
      keyBg: '#121212',
      keyText: '#e5e5e5',
      keyActive: '#ffffff',
    },
    atmosphere: {
      glow: 'rgba(255, 255, 255, 0.15)',
      ambientParticles: 'none',
      gridPattern: false,
      glassOpacity: 0.95
    }
  },
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    category: 'dark',
    colors: {
      bgMain: '#03141f',
      bgSurface: '#072435',
      bgSubtle: '#0c354d',
      borderColor: '#144c6e',
      textMain: '#e0f2fe',
      textSub: '#38bdf8',
      textMuted: '#0284c7',
      colorPrimary: '#38bdf8',
      colorCorrect: '#34d399',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#092e44',
      keyText: '#bae6fd',
      keyActive: '#0ea5e9',
    },
    atmosphere: {
      glow: 'rgba(56, 189, 248, 0.28)',
      ambientParticles: 'bubbles',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'forest-pine',
    name: 'Forest Pine',
    category: 'dark',
    colors: {
      bgMain: '#0a1912',
      bgSurface: '#10261c',
      bgSubtle: '#183829',
      borderColor: '#214e3a',
      textMain: '#e8f5e9',
      textSub: '#81c784',
      textMuted: '#4caf50',
      colorPrimary: '#4ade80',
      colorCorrect: '#4ade80',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#4ade80',
      keyBg: '#133023',
      keyText: '#c8e6c9',
      keyActive: '#22c55e',
    },
    atmosphere: {
      glow: 'rgba(74, 222, 128, 0.25)',
      ambientParticles: 'dust',
      gridPattern: false,
      glassOpacity: 0.88
    }
  },
  {
    id: 'sunset-ember',
    name: 'Sunset Ember',
    category: 'colorful',
    colors: {
      bgMain: '#1a0d0d',
      bgSurface: '#2b1414',
      bgSubtle: '#3d1c1c',
      borderColor: '#542626',
      textMain: '#ffedd5',
      textSub: '#fb923c',
      textMuted: '#c2410c',
      colorPrimary: '#f97316',
      colorCorrect: '#fbbf24',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#f97316',
      keyBg: '#341919',
      keyText: '#fed7aa',
      keyActive: '#ea580c',
    },
    atmosphere: {
      glow: 'rgba(249, 115, 22, 0.3)',
      ambientParticles: 'sparks',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    category: 'colorful',
    colors: {
      bgMain: '#180d13',
      bgSurface: '#26141e',
      bgSubtle: '#361b2a',
      borderColor: '#4d243c',
      textMain: '#fce7f3',
      textSub: '#f472b6',
      textMuted: '#be185d',
      colorPrimary: '#ec4899',
      colorCorrect: '#f472b6',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#ec4899',
      keyBg: '#2f1825',
      keyText: '#fbcfe8',
      keyActive: '#db2777',
    },
    atmosphere: {
      glow: 'rgba(236, 72, 153, 0.28)',
      ambientParticles: 'sakura',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    category: 'colorful',
    colors: {
      bgMain: '#1c1b29',
      bgSurface: '#262438',
      bgSubtle: '#33314c',
      borderColor: '#444166',
      textMain: '#fdf4dc',
      textSub: '#b8c0ff',
      textMuted: '#71759d',
      colorPrimary: '#ffd6ff',
      colorCorrect: '#c8b6ff',
      colorError: '#ff99c8',
      colorErrorBg: 'rgba(255, 153, 200, 0.2)',
      colorCaret: '#ffd6ff',
      keyBg: '#2c2a41',
      keyText: '#e7c6ff',
      keyActive: '#bbadff',
    },
    atmosphere: {
      glow: 'rgba(255, 214, 255, 0.25)',
      ambientParticles: 'bubbles',
      gridPattern: false,
      glassOpacity: 0.88
    }
  },
  {
    id: 'solarized-amber',
    name: 'Solarized Amber',
    category: 'retro',
    colors: {
      bgMain: '#002b36',
      bgSurface: '#073642',
      bgSubtle: '#0e4552',
      borderColor: '#195c6b',
      textMain: '#fdf6e3',
      textSub: '#93a1a1',
      textMuted: '#586e75',
      colorPrimary: '#b58900',
      colorCorrect: '#2aa198',
      colorError: '#dc322f',
      colorErrorBg: 'rgba(220, 50, 47, 0.2)',
      colorCaret: '#b58900',
      keyBg: '#0a3d4a',
      keyText: '#eee8d5',
      keyActive: '#cb4b16',
    },
    atmosphere: {
      glow: 'rgba(181, 137, 0, 0.25)',
      ambientParticles: 'none',
      gridPattern: false,
      glassOpacity: 0.88
    }
  },
  {
    id: 'paper-clean',
    name: 'Paper Clean',
    category: 'light',
    colors: {
      bgMain: '#f5f5f0',
      bgSurface: '#ffffff',
      bgSubtle: '#eaeae3',
      borderColor: '#d4d4cb',
      textMain: '#262624',
      textSub: '#73736c',
      textMuted: '#a3a399',
      colorPrimary: '#3b82f6',
      colorCorrect: '#16a34a',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.15)',
      colorCaret: '#3b82f6',
      keyBg: '#f0f0ea',
      keyText: '#40403b',
      keyActive: '#2563eb',
    },
    atmosphere: {
      glow: 'rgba(59, 130, 246, 0.15)',
      ambientParticles: 'none',
      gridPattern: false,
      glassOpacity: 0.95
    }
  },
  {
    id: 'snow-blizzard',
    name: 'Snow Blizzard',
    category: 'light',
    colors: {
      bgMain: '#f8fafc',
      bgSurface: '#ffffff',
      bgSubtle: '#f1f5f9',
      borderColor: '#e2e8f0',
      textMain: '#0f172a',
      textSub: '#64748b',
      textMuted: '#94a3b8',
      colorPrimary: '#0ea5e9',
      colorCorrect: '#059669',
      colorError: '#e11d48',
      colorErrorBg: 'rgba(225, 29, 72, 0.15)',
      colorCaret: '#0ea5e9',
      keyBg: '#f1f5f9',
      keyText: '#334155',
      keyActive: '#0284c7',
    },
    atmosphere: {
      glow: 'rgba(14, 165, 233, 0.15)',
      ambientParticles: 'dust',
      gridPattern: false,
      glassOpacity: 0.95
    }
  },
  {
    id: 'coffee-roast',
    name: 'Coffee Roast',
    category: 'retro',
    colors: {
      bgMain: '#211714',
      bgSurface: '#2d1f1b',
      bgSubtle: '#3d2b25',
      borderColor: '#523a32',
      textMain: '#ede0d4',
      textSub: '#b08968',
      textMuted: '#7f5539',
      colorPrimary: '#ddb892',
      colorCorrect: '#7f5539',
      colorError: '#e76f51',
      colorErrorBg: 'rgba(231, 111, 81, 0.2)',
      colorCaret: '#ddb892',
      keyBg: '#34241f',
      keyText: '#e6ccb2',
      keyActive: '#c59a72',
    },
    atmosphere: {
      glow: 'rgba(221, 184, 146, 0.25)',
      ambientParticles: 'dust',
      gridPattern: false,
      glassOpacity: 0.9
    }
  },
  {
    id: 'retro-terminal',
    name: 'Retro Terminal 80s',
    category: 'retro',
    colors: {
      bgMain: '#100c08',
      bgSurface: '#1a140d',
      bgSubtle: '#261e14',
      borderColor: '#ffb000',
      textMain: '#ffb000',
      textSub: '#cc8d00',
      textMuted: '#805800',
      colorPrimary: '#ffb000',
      colorCorrect: '#ffb000',
      colorError: '#ff3333',
      colorErrorBg: 'rgba(255, 51, 51, 0.2)',
      colorCaret: '#ffb000',
      keyBg: '#211910',
      keyText: '#ffb000',
      keyActive: '#ffb000',
    },
    atmosphere: {
      glow: 'rgba(255, 176, 0, 0.3)',
      ambientParticles: 'none',
      gridPattern: true,
      glassOpacity: 0.85
    }
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Blossom',
    category: 'colorful',
    colors: {
      bgMain: '#fff5f7',
      bgSurface: '#ffffff',
      bgSubtle: '#ffe4e9',
      borderColor: '#fbcfe8',
      textMain: '#831843',
      textSub: '#be185d',
      textMuted: '#db2777',
      colorPrimary: '#f43f5e',
      colorCorrect: '#059669',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.15)',
      colorCaret: '#f43f5e',
      keyBg: '#ffe4e9',
      keyText: '#9d174d',
      keyActive: '#f43f5e',
    },
    atmosphere: {
      glow: 'rgba(244, 63, 94, 0.2)',
      ambientParticles: 'sakura',
      gridPattern: false,
      glassOpacity: 0.92
    }
  },
  {
    id: 'neon-synth',
    name: 'Neon Synth',
    category: 'colorful',
    colors: {
      bgMain: '#13091f',
      bgSurface: '#1c0f2e',
      bgSubtle: '#291742',
      borderColor: '#00fff0',
      textMain: '#ffffff',
      textSub: '#ff007f',
      textMuted: '#a30052',
      colorPrimary: '#00fff0',
      colorCorrect: '#00fff0',
      colorError: '#ff0055',
      colorErrorBg: 'rgba(255, 0, 85, 0.25)',
      colorCaret: '#00fff0',
      keyBg: '#221338',
      keyText: '#00fff0',
      keyActive: '#ff007f',
    },
    atmosphere: {
      glow: 'rgba(0, 255, 240, 0.32)',
      ambientParticles: 'neon',
      gridPattern: true,
      glassOpacity: 0.82
    }
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    category: 'light',
    colors: {
      bgMain: '#f5f3ff',
      bgSurface: '#ffffff',
      bgSubtle: '#ede9fe',
      borderColor: '#ddd6fe',
      textMain: '#2e1065',
      textSub: '#6b21a8',
      textMuted: '#8b5cf6',
      colorPrimary: '#7c3aed',
      colorCorrect: '#16a34a',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.15)',
      colorCaret: '#7c3aed',
      keyBg: '#ede9fe',
      keyText: '#4c1d95',
      keyActive: '#6d28d9',
    },
    atmosphere: {
      glow: 'rgba(124, 58, 237, 0.2)',
      ambientParticles: 'bubbles',
      gridPattern: false,
      glassOpacity: 0.92
    }
  },
  {
    id: 'minimal-slate',
    name: 'Minimal Slate',
    category: 'minimal',
    colors: {
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
      keyActive: '#0284c7',
    },
    atmosphere: {
      glow: 'rgba(56, 189, 248, 0.2)',
      ambientParticles: 'none',
      gridPattern: false,
      glassOpacity: 0.9
    }
  },
  {
    id: 'deep-space',
    name: 'Deep Space',
    category: 'dark',
    colors: {
      bgMain: '#080914',
      bgSurface: '#0e1022',
      bgSubtle: '#161933',
      borderColor: '#23284f',
      textMain: '#f1f5f9',
      textSub: '#64748b',
      textMuted: '#475569',
      colorPrimary: '#818cf8',
      colorCorrect: '#38bdf8',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#818cf8',
      keyBg: '#141730',
      keyText: '#cbd5e1',
      keyActive: '#6366f1',
    },
    atmosphere: {
      glow: 'rgba(129, 140, 248, 0.28)',
      ambientParticles: 'stars',
      gridPattern: false,
      glassOpacity: 0.85
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Vault',
    category: 'dark',
    colors: {
      bgMain: '#091a13',
      bgSurface: '#0e261d',
      bgSubtle: '#15382b',
      borderColor: '#1e4e3c',
      textMain: '#e6f7ef',
      textSub: '#5c997e',
      textMuted: '#3d6955',
      colorPrimary: '#10b981',
      colorCorrect: '#34d399',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#10b981',
      keyBg: '#123024',
      keyText: '#a7f3d0',
      keyActive: '#059669',
    },
    atmosphere: {
      glow: 'rgba(16, 185, 129, 0.28)',
      ambientParticles: 'dust',
      gridPattern: false,
      glassOpacity: 0.88
    }
  },

  // =========================================================================
  // --- 60 THEMES SPECIFICALLY ENUMERATED IN USER SPECIFICATION ---
  // =========================================================================

  // 1. Midnight Core
  {
    id: 'midnight-core',
    name: 'Midnight Core',
    category: 'dark',
    colors: {
      bgMain: '#070a12',
      bgSurface: '#0d1322',
      bgSubtle: '#151e36',
      borderColor: '#202e52',
      textMain: '#e2e8f0',
      textSub: '#7082a6',
      textMuted: '#475569',
      colorPrimary: '#38bdf8',
      colorCorrect: '#60a5fa',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#11182c',
      keyText: '#cbd5e1',
      keyActive: '#2563eb',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.3)', ambientParticles: 'stars', gridPattern: true, glassOpacity: 0.85 }
  },

  // 2. Cyber Neon
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'scifi',
    colors: {
      bgMain: '#06060c',
      bgSurface: '#0d0d1a',
      bgSubtle: '#16162a',
      borderColor: '#00f7ff',
      textMain: '#ffffff',
      textSub: '#00f7ff',
      textMuted: '#7000ff',
      colorPrimary: '#00f7ff',
      colorCorrect: '#00ff66',
      colorError: '#ff003c',
      colorErrorBg: 'rgba(255, 0, 60, 0.25)',
      colorCaret: '#00f7ff',
      keyBg: '#121224',
      keyText: '#00f7ff',
      keyActive: '#ff007f',
    },
    atmosphere: { glow: 'rgba(0, 247, 255, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.8 }
  },

  // 3. Cyberpunk City
  {
    id: 'cyberpunk-city',
    name: 'Cyberpunk City',
    category: 'scifi',
    colors: {
      bgMain: '#0f051d',
      bgSurface: '#190a30',
      bgSubtle: '#260f4a',
      borderColor: '#ff0055',
      textMain: '#ffe600',
      textSub: '#ff007f',
      textMuted: '#7900b3',
      colorPrimary: '#ffe600',
      colorCorrect: '#00f0ff',
      colorError: '#ff0055',
      colorErrorBg: 'rgba(255, 0, 85, 0.25)',
      colorCaret: '#ffe600',
      keyBg: '#210c40',
      keyText: '#ffe600',
      keyActive: '#ff007f',
    },
    atmosphere: { glow: 'rgba(255, 0, 85, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.8 }
  },

  // 4. Matrix Terminal
  {
    id: 'matrix-terminal',
    name: 'Matrix Terminal',
    category: 'retro',
    colors: {
      bgMain: '#010903',
      bgSurface: '#031406',
      bgSubtle: '#07240c',
      borderColor: '#00ff41',
      textMain: '#52ff75',
      textSub: '#00b32c',
      textMuted: '#005916',
      colorPrimary: '#00ff41',
      colorCorrect: '#00ff41',
      colorError: '#ff3b30',
      colorErrorBg: 'rgba(255, 59, 48, 0.22)',
      colorCaret: '#00ff41',
      keyBg: '#051f09',
      keyText: '#00ff41',
      keyActive: '#00cc33',
    },
    atmosphere: { glow: 'rgba(0, 255, 65, 0.32)', ambientParticles: 'matrix', gridPattern: true, glassOpacity: 0.85 }
  },

  // 5. AMOLED Void
  {
    id: 'amoled-void',
    name: 'AMOLED Void',
    category: 'dark',
    colors: {
      bgMain: '#000000',
      bgSurface: '#050505',
      bgSubtle: '#0f0f0f',
      borderColor: '#1f1f1f',
      textMain: '#ffffff',
      textSub: '#8a8a8a',
      textMuted: '#444444',
      colorPrimary: '#38bdf8',
      colorCorrect: '#22c55e',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#0a0a0a',
      keyText: '#ededed',
      keyActive: '#38bdf8',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.2)', ambientParticles: 'none', gridPattern: false, glassOpacity: 0.95 }
  },

  // 6. Deep Space
  {
    id: 'deep-space-v2',
    name: 'Deep Space Core',
    category: 'scifi',
    colors: {
      bgMain: '#05060f',
      bgSurface: '#0a0d1e',
      bgSubtle: '#121733',
      borderColor: '#1d2552',
      textMain: '#e0e7ff',
      textSub: '#6366f1',
      textMuted: '#4338ca',
      colorPrimary: '#818cf8',
      colorCorrect: '#38bdf8',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#818cf8',
      keyBg: '#0f142e',
      keyText: '#c7d2fe',
      keyActive: '#6366f1',
    },
    atmosphere: { glow: 'rgba(129, 140, 248, 0.3)', ambientParticles: 'stars', gridPattern: false, glassOpacity: 0.85 }
  },

  // 7. Galaxy Drift
  {
    id: 'galaxy-drift',
    name: 'Galaxy Drift',
    category: 'scifi',
    colors: {
      bgMain: '#0a0518',
      bgSurface: '#140b2e',
      bgSubtle: '#201247',
      borderColor: '#381f7d',
      textMain: '#f3e8ff',
      textSub: '#c084fc',
      textMuted: '#7e22ce',
      colorPrimary: '#d8b4fe',
      colorCorrect: '#67e8f9',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#d8b4fe',
      keyBg: '#1a0e3c',
      keyText: '#e9d5ff',
      keyActive: '#a855f7',
    },
    atmosphere: { glow: 'rgba(216, 180, 254, 0.3)', ambientParticles: 'stars', gridPattern: false, glassOpacity: 0.85 }
  },

  // 8. Nebula
  {
    id: 'nebula',
    name: 'Nebula',
    category: 'scifi',
    colors: {
      bgMain: '#10051a',
      bgSurface: '#1c0a2e',
      bgSubtle: '#2c1047',
      borderColor: '#4e1c7d',
      textMain: '#fae8ff',
      textSub: '#e879f9',
      textMuted: '#a21caf',
      colorPrimary: '#f0abfc',
      colorCorrect: '#38bdf8',
      colorError: '#fb7185',
      colorErrorBg: 'rgba(251, 113, 133, 0.2)',
      colorCaret: '#f0abfc',
      keyBg: '#240d3b',
      keyText: '#f5d0fe',
      keyActive: '#c026d3',
    },
    atmosphere: { glow: 'rgba(240, 171, 252, 0.3)', ambientParticles: 'stars', gridPattern: false, glassOpacity: 0.85 }
  },

  // 9. Lunar
  {
    id: 'lunar',
    name: 'Lunar',
    category: 'dark',
    colors: {
      bgMain: '#0f1115',
      bgSurface: '#171a21',
      bgSubtle: '#222730',
      borderColor: '#323946',
      textMain: '#f1f5f9',
      textSub: '#94a3b8',
      textMuted: '#64748b',
      colorPrimary: '#cbd5e1',
      colorCorrect: '#93c5fd',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#ffffff',
      keyBg: '#1e222b',
      keyText: '#e2e8f0',
      keyActive: '#94a3b8',
    },
    atmosphere: { glow: 'rgba(203, 213, 225, 0.22)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.9 }
  },

  // 10. Solar Flare
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'colorful',
    colors: {
      bgMain: '#170900',
      bgSurface: '#261102',
      bgSubtle: '#3b1c04',
      borderColor: '#612c08',
      textMain: '#fff7ed',
      textSub: '#fdba74',
      textMuted: '#c2410c',
      colorPrimary: '#fb923c',
      colorCorrect: '#facc15',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#fb923c',
      keyBg: '#301603',
      keyText: '#ffedd5',
      keyActive: '#f97316',
    },
    atmosphere: { glow: 'rgba(251, 146, 60, 0.35)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.85 }
  },

  // 11. Ocean Depth
  {
    id: 'ocean-depth-v2',
    name: 'Ocean Abyssal',
    category: 'dark',
    colors: {
      bgMain: '#020f18',
      bgSurface: '#051c2c',
      bgSubtle: '#092b43',
      borderColor: '#0e4166',
      textMain: '#f0f9ff',
      textSub: '#38bdf8',
      textMuted: '#0369a1',
      colorPrimary: '#38bdf8',
      colorCorrect: '#2dd4bf',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#072439',
      keyText: '#bae6fd',
      keyActive: '#0284c7',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.3)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.85 }
  },

  // 12. Arctic Ocean
  {
    id: 'arctic-ocean',
    name: 'Arctic Ocean',
    category: 'light',
    colors: {
      bgMain: '#f0f9ff',
      bgSurface: '#ffffff',
      bgSubtle: '#e0f2fe',
      borderColor: '#bae6fd',
      textMain: '#0c4a6e',
      textSub: '#0284c7',
      textMuted: '#38bdf8',
      colorPrimary: '#0284c7',
      colorCorrect: '#0d9488',
      colorError: '#e11d48',
      colorErrorBg: 'rgba(225, 29, 72, 0.15)',
      colorCaret: '#0284c7',
      keyBg: '#e0f2fe',
      keyText: '#0369a1',
      keyActive: '#0284c7',
    },
    atmosphere: { glow: 'rgba(2, 132, 199, 0.18)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.94 }
  },

  // 13. Tropical
  {
    id: 'tropical',
    name: 'Tropical',
    category: 'nature',
    colors: {
      bgMain: '#021815',
      bgSurface: '#062923',
      bgSubtle: '#0b3c33',
      borderColor: '#135c4f',
      textMain: '#f0fdfa',
      textSub: '#2dd4bf',
      textMuted: '#0f766e',
      colorPrimary: '#14b8a6',
      colorCorrect: '#facc15',
      colorError: '#fb7185',
      colorErrorBg: 'rgba(251, 113, 133, 0.2)',
      colorCaret: '#14b8a6',
      keyBg: '#09332b',
      keyText: '#99f6e4',
      keyActive: '#0d9488',
    },
    atmosphere: { glow: 'rgba(20, 184, 166, 0.3)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.85 }
  },

  // 14. Deep Sea
  {
    id: 'deep-sea',
    name: 'Deep Sea',
    category: 'dark',
    colors: {
      bgMain: '#010c14',
      bgSurface: '#031726',
      bgSubtle: '#06253c',
      borderColor: '#0a395c',
      textMain: '#ecfeff',
      textSub: '#22d3ee',
      textMuted: '#0891b2',
      colorPrimary: '#06b6d4',
      colorCorrect: '#34d399',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#06b6d4',
      keyBg: '#051f33',
      keyText: '#a5f3fc',
      keyActive: '#0891b2',
    },
    atmosphere: { glow: 'rgba(6, 182, 212, 0.28)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.85 }
  },

  // 15. Forest Night
  {
    id: 'forest-night',
    name: 'Forest Night',
    category: 'nature',
    colors: {
      bgMain: '#06120b',
      bgSurface: '#0b2014',
      bgSubtle: '#123321',
      borderColor: '#1b4d32',
      textMain: '#ecfdf5',
      textSub: '#6ee7b7',
      textMuted: '#059669',
      colorPrimary: '#10b981',
      colorCorrect: '#34d399',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#10b981',
      keyBg: '#0e2b1b',
      keyText: '#a7f3d0',
      keyActive: '#059669',
    },
    atmosphere: { glow: 'rgba(16, 185, 129, 0.28)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.88 }
  },

  // 16. Enchanted Forest
  {
    id: 'enchanted-forest',
    name: 'Enchanted Forest',
    category: 'nature',
    colors: {
      bgMain: '#071510',
      bgSurface: '#0e271e',
      bgSubtle: '#173c2f',
      borderColor: '#245946',
      textMain: '#f0fdf4',
      textSub: '#86efac',
      textMuted: '#16a34a',
      colorPrimary: '#4ade80',
      colorCorrect: '#fde047',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#4ade80',
      keyBg: '#123327',
      keyText: '#bbf7d0',
      keyActive: '#22c55e',
    },
    atmosphere: { glow: 'rgba(74, 222, 128, 0.3)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.85 }
  },

  // 17. Moss
  {
    id: 'moss',
    name: 'Moss',
    category: 'nature',
    colors: {
      bgMain: '#11170e',
      bgSurface: '#1a2417',
      bgSubtle: '#263422',
      borderColor: '#394d33',
      textMain: '#f7fee7',
      textSub: '#bef264',
      textMuted: '#65a30d',
      colorPrimary: '#a3e635',
      colorCorrect: '#4ade80',
      colorError: '#fb7185',
      colorErrorBg: 'rgba(251, 113, 133, 0.2)',
      colorCaret: '#a3e635',
      keyBg: '#212d1d',
      keyText: '#d9f99d',
      keyActive: '#84cc16',
    },
    atmosphere: { glow: 'rgba(163, 230, 53, 0.28)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.88 }
  },

  // 18. Sakura
  {
    id: 'sakura',
    name: 'Sakura Petals',
    category: 'nature',
    colors: {
      bgMain: '#1c0b13',
      bgSurface: '#2b121e',
      bgSubtle: '#3e1a2c',
      borderColor: '#5c2741',
      textMain: '#fff1f2',
      textSub: '#fda4af',
      textMuted: '#e11d48',
      colorPrimary: '#fb7185',
      colorCorrect: '#f43f5e',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#fb7185',
      keyBg: '#351625',
      keyText: '#fecdd3',
      keyActive: '#e11d48',
    },
    atmosphere: { glow: 'rgba(251, 113, 133, 0.3)', ambientParticles: 'sakura', gridPattern: false, glassOpacity: 0.85 }
  },

  // 19. Cherry Blossom
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    category: 'nature',
    colors: {
      bgMain: '#fff0f3',
      bgSurface: '#ffffff',
      bgSubtle: '#ffe0e6',
      borderColor: '#ffccd5',
      textMain: '#590d22',
      textSub: '#a4133c',
      textMuted: '#c9184a',
      colorPrimary: '#ff4d6d',
      colorCorrect: '#059669',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.15)',
      colorCaret: '#ff4d6d',
      keyBg: '#ffe0e6',
      keyText: '#800f2f',
      keyActive: '#ff4d6d',
    },
    atmosphere: { glow: 'rgba(255, 77, 109, 0.2)', ambientParticles: 'sakura', gridPattern: false, glassOpacity: 0.92 }
  },

  // 20. Sunset
  {
    id: 'sunset',
    name: 'Sunset Twilight',
    category: 'colorful',
    colors: {
      bgMain: '#180a18',
      bgSurface: '#291026',
      bgSubtle: '#3d1838',
      borderColor: '#592352',
      textMain: '#fff1f2',
      textSub: '#fb7185',
      textMuted: '#c026d3',
      colorPrimary: '#f97316',
      colorCorrect: '#fbbf24',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#f97316',
      keyBg: '#341431',
      keyText: '#fecdd3',
      keyActive: '#e11d48',
    },
    atmosphere: { glow: 'rgba(249, 115, 22, 0.3)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.85 }
  },

  // 21. Golden Hour
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    category: 'colorful',
    colors: {
      bgMain: '#1a1202',
      bgSurface: '#2b1e05',
      bgSubtle: '#3e2c09',
      borderColor: '#5e430f',
      textMain: '#fefce8',
      textSub: '#fde047',
      textMuted: '#ca8a04',
      colorPrimary: '#eab308',
      colorCorrect: '#84cc16',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#eab308',
      keyBg: '#352507',
      keyText: '#fef08a',
      keyActive: '#ca8a04',
    },
    atmosphere: { glow: 'rgba(234, 179, 8, 0.32)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.88 }
  },

  // 22. Aurora
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    category: 'nature',
    colors: {
      bgMain: '#05131a',
      bgSurface: '#0a212e',
      bgSubtle: '#103245',
      borderColor: '#194c69',
      textMain: '#ecfeff',
      textSub: '#67e8f9',
      textMuted: '#22d3ee',
      colorPrimary: '#34d399',
      colorCorrect: '#a78bfa',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#34d399',
      keyBg: '#0d2a3a',
      keyText: '#a5f3fc',
      keyActive: '#10b981',
    },
    atmosphere: { glow: 'rgba(52, 211, 153, 0.35)', ambientParticles: 'neon', gridPattern: false, glassOpacity: 0.82 }
  },

  // 23. Volcanic
  {
    id: 'volcanic',
    name: 'Volcanic Caldera',
    category: 'dark',
    colors: {
      bgMain: '#120505',
      bgSurface: '#1f0909',
      bgSubtle: '#300f0f',
      borderColor: '#4d1919',
      textMain: '#fee2e2',
      textSub: '#f87171',
      textMuted: '#b91c1c',
      colorPrimary: '#ef4444',
      colorCorrect: '#f97316',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#ef4444',
      keyBg: '#280c0c',
      keyText: '#fca5a5',
      keyActive: '#dc2626',
    },
    atmosphere: { glow: 'rgba(239, 68, 68, 0.35)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.85 }
  },

  // 24. Ember
  {
    id: 'ember-glow',
    name: 'Ember Hearth',
    category: 'dark',
    colors: {
      bgMain: '#140804',
      bgSurface: '#210e08',
      bgSubtle: '#33170d',
      borderColor: '#4f2415',
      textMain: '#ffedd5',
      textSub: '#fb923c',
      textMuted: '#9a3412',
      colorPrimary: '#f97316',
      colorCorrect: '#facc15',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#f97316',
      keyBg: '#2a120a',
      keyText: '#fed7aa',
      keyActive: '#ea580c',
    },
    atmosphere: { glow: 'rgba(249, 115, 22, 0.3)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.88 }
  },

  // 25. Firestorm
  {
    id: 'firestorm',
    name: 'Firestorm Inferno',
    category: 'colorful',
    colors: {
      bgMain: '#1a0400',
      bgSurface: '#2e0a02',
      bgSubtle: '#451205',
      borderColor: '#6b1e09',
      textMain: '#fff7ed',
      textSub: '#ea580c',
      textMuted: '#9a3412',
      colorPrimary: '#f97316',
      colorCorrect: '#facc15',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.25)',
      colorCaret: '#f97316',
      keyBg: '#3a0e04',
      keyText: '#fdba74',
      keyActive: '#ea580c',
    },
    atmosphere: { glow: 'rgba(249, 115, 22, 0.38)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.82 }
  },

  // 26. Ice Crystal
  {
    id: 'ice-crystal',
    name: 'Ice Crystal',
    category: 'light',
    colors: {
      bgMain: '#f0fdfa',
      bgSurface: '#ffffff',
      bgSubtle: '#ccfbf1',
      borderColor: '#99f6e4',
      textMain: '#134e4a',
      textSub: '#0f766e',
      textMuted: '#14b8a6',
      colorPrimary: '#0d9488',
      colorCorrect: '#0284c7',
      colorError: '#e11d48',
      colorErrorBg: 'rgba(225, 29, 72, 0.15)',
      colorCaret: '#0d9488',
      keyBg: '#e6fffa',
      keyText: '#115e59',
      keyActive: '#0f766e',
    },
    atmosphere: { glow: 'rgba(13, 148, 136, 0.2)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.94 }
  },

  // 27. Diamond
  {
    id: 'diamond',
    name: 'Diamond Spark',
    category: 'light',
    colors: {
      bgMain: '#f8fafc',
      bgSurface: '#ffffff',
      bgSubtle: '#f1f5f9',
      borderColor: '#cbd5e1',
      textMain: '#0f172a',
      textSub: '#475569',
      textMuted: '#94a3b8',
      colorPrimary: '#38bdf8',
      colorCorrect: '#0ea5e9',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.15)',
      colorCaret: '#38bdf8',
      keyBg: '#f1f5f9',
      keyText: '#1e293b',
      keyActive: '#0284c7',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.25)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.96 }
  },

  // 28. Crystal Cave
  {
    id: 'crystal-cave',
    name: 'Crystal Cave',
    category: 'dark',
    colors: {
      bgMain: '#0d0b1a',
      bgSurface: '#16132b',
      bgSubtle: '#221f42',
      borderColor: '#373266',
      textMain: '#f5f3ff',
      textSub: '#a78bfa',
      textMuted: '#6d28d9',
      colorPrimary: '#818cf8',
      colorCorrect: '#2dd4bf',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#818cf8',
      keyBg: '#1c1836',
      keyText: '#ddd6fe',
      keyActive: '#7c3aed',
    },
    atmosphere: { glow: 'rgba(129, 140, 248, 0.3)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.85 }
  },

  // 29. Lavender Dream
  {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    category: 'colorful',
    colors: {
      bgMain: '#130d24',
      bgSurface: '#1e1538',
      bgSubtle: '#2e2054',
      borderColor: '#483380',
      textMain: '#faf5ff',
      textSub: '#c084fc',
      textMuted: '#7e22ce',
      colorPrimary: '#a855f7',
      colorCorrect: '#38bdf8',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#a855f7',
      keyBg: '#261b47',
      keyText: '#e9d5ff',
      keyActive: '#9333ea',
    },
    atmosphere: { glow: 'rgba(168, 85, 247, 0.3)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.86 }
  },

  // 30. Rose
  {
    id: 'rose',
    name: 'Rose Velvet',
    category: 'dark',
    colors: {
      bgMain: '#1a070e',
      bgSurface: '#2b0c18',
      bgSubtle: '#3e1324',
      borderColor: '#5e1e37',
      textMain: '#fff1f2',
      textSub: '#fb7185',
      textMuted: '#be123c',
      colorPrimary: '#f43f5e',
      colorCorrect: '#fda4af',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#f43f5e',
      keyBg: '#351020',
      keyText: '#fecdd3',
      keyActive: '#e11d48',
    },
    atmosphere: { glow: 'rgba(244, 63, 94, 0.3)', ambientParticles: 'sakura', gridPattern: false, glassOpacity: 0.85 }
  },

  // 31. Pastel Dream (Special Core)
  {
    id: 'pastel-dream-v2',
    name: 'Pastel Fantasy',
    category: 'colorful',
    colors: {
      bgMain: '#1a1928',
      bgSurface: '#242338',
      bgSubtle: '#32314d',
      borderColor: '#47456b',
      textMain: '#fdf4dc',
      textSub: '#b8c0ff',
      textMuted: '#71759d',
      colorPrimary: '#ffd6ff',
      colorCorrect: '#c8b6ff',
      colorError: '#ff99c8',
      colorErrorBg: 'rgba(255, 153, 200, 0.2)',
      colorCaret: '#ffd6ff',
      keyBg: '#2b2a42',
      keyText: '#e7c6ff',
      keyActive: '#bbadff',
    },
    atmosphere: { glow: 'rgba(255, 214, 255, 0.25)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.88 }
  },

  // 32. Cotton Candy
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'colorful',
    colors: {
      bgMain: '#161124',
      bgSurface: '#221b36',
      bgSubtle: '#32284f',
      borderColor: '#493a73',
      textMain: '#ffffff',
      textSub: '#f472b6',
      textMuted: '#93c5fd',
      colorPrimary: '#38bdf8',
      colorCorrect: '#f472b6',
      colorError: '#fb7185',
      colorErrorBg: 'rgba(251, 113, 133, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#2a2243',
      keyText: '#fbcfe8',
      keyActive: '#ec4899',
    },
    atmosphere: { glow: 'rgba(244, 114, 182, 0.32)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.85 }
  },

  // 33. Bubblegum
  {
    id: 'bubblegum',
    name: 'Bubblegum Pop',
    category: 'colorful',
    colors: {
      bgMain: '#1f0d1a',
      bgSurface: '#2e1427',
      bgSubtle: '#421d37',
      borderColor: '#612b51',
      textMain: '#fff0f8',
      textSub: '#f472b6',
      textMuted: '#db2777',
      colorPrimary: '#ec4899',
      colorCorrect: '#38bdf8',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#ec4899',
      keyBg: '#381930',
      keyText: '#fce7f3',
      keyActive: '#be185d',
    },
    atmosphere: { glow: 'rgba(236, 72, 153, 0.32)', ambientParticles: 'bubbles', gridPattern: false, glassOpacity: 0.85 }
  },

  // 34. Coffee
  {
    id: 'coffee',
    name: 'Warm Coffee',
    category: 'retro',
    colors: {
      bgMain: '#1c1310',
      bgSurface: '#291c18',
      bgSubtle: '#382721',
      borderColor: '#4f372f',
      textMain: '#ede0d4',
      textSub: '#b08968',
      textMuted: '#7f5539',
      colorPrimary: '#ddb892',
      colorCorrect: '#a68a68',
      colorError: '#e76f51',
      colorErrorBg: 'rgba(231, 111, 81, 0.2)',
      colorCaret: '#ddb892',
      keyBg: '#31211c',
      keyText: '#e6ccb2',
      keyActive: '#b08968',
    },
    atmosphere: { glow: 'rgba(221, 184, 146, 0.22)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.9 }
  },

  // 35. Espresso
  {
    id: 'espresso',
    name: 'Dark Espresso',
    category: 'dark',
    colors: {
      bgMain: '#120b08',
      bgSurface: '#1a100b',
      bgSubtle: '#261811',
      borderColor: '#382319',
      textMain: '#f5ebe0',
      textSub: '#d5bdaf',
      textMuted: '#8a6e5b',
      colorPrimary: '#d6ccc2',
      colorCorrect: '#b7b7a4',
      colorError: '#e76f51',
      colorErrorBg: 'rgba(231, 111, 81, 0.2)',
      colorCaret: '#d6ccc2',
      keyBg: '#20140e',
      keyText: '#edede9',
      keyActive: '#a68a68',
    },
    atmosphere: { glow: 'rgba(214, 204, 194, 0.2)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.92 }
  },

  // 36. Chocolate
  {
    id: 'chocolate',
    name: 'Rich Chocolate',
    category: 'dark',
    colors: {
      bgMain: '#1c0f0a',
      bgSurface: '#2b1710',
      bgSubtle: '#3d2218',
      borderColor: '#593224',
      textMain: '#fdf0ed',
      textSub: '#d4a373',
      textMuted: '#936639',
      colorPrimary: '#faedcd',
      colorCorrect: '#a98467',
      colorError: '#e07a5f',
      colorErrorBg: 'rgba(224, 122, 95, 0.2)',
      colorCaret: '#faedcd',
      keyBg: '#341c14',
      keyText: '#faedcd',
      keyActive: '#c58f5c',
    },
    atmosphere: { glow: 'rgba(250, 237, 205, 0.22)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.9 }
  },

  // 37. Paper
  {
    id: 'paper',
    name: 'Parchment Paper',
    category: 'light',
    colors: {
      bgMain: '#fbf8ee',
      bgSurface: '#ffffff',
      bgSubtle: '#f2edd9',
      borderColor: '#ded6be',
      textMain: '#2c2518',
      textSub: '#70644d',
      textMuted: '#a39578',
      colorPrimary: '#855828',
      colorCorrect: '#2e7d32',
      colorError: '#c62828',
      colorErrorBg: 'rgba(198, 40, 40, 0.15)',
      colorCaret: '#855828',
      keyBg: '#f5f0dc',
      keyText: '#473d2b',
      keyActive: '#855828',
    },
    atmosphere: { glow: 'rgba(133, 88, 40, 0.18)', ambientParticles: 'none', gridPattern: false, glassOpacity: 0.95 }
  },

  // 38. Snow
  {
    id: 'snow',
    name: 'Pure Snow',
    category: 'light',
    colors: {
      bgMain: '#f8fafc',
      bgSurface: '#ffffff',
      bgSubtle: '#f1f5f9',
      borderColor: '#e2e8f0',
      textMain: '#0f172a',
      textSub: '#64748b',
      textMuted: '#94a3b8',
      colorPrimary: '#0284c7',
      colorCorrect: '#16a34a',
      colorError: '#e11d48',
      colorErrorBg: 'rgba(225, 29, 72, 0.15)',
      colorCaret: '#0284c7',
      keyBg: '#f1f5f9',
      keyText: '#334155',
      keyActive: '#0284c7',
    },
    atmosphere: { glow: 'rgba(2, 132, 199, 0.16)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.96 }
  },

  // 39. Minimal White
  {
    id: 'minimal-white',
    name: 'Minimal White',
    category: 'minimal',
    colors: {
      bgMain: '#fafafa',
      bgSurface: '#ffffff',
      bgSubtle: '#f4f4f5',
      borderColor: '#e4e4e7',
      textMain: '#18181b',
      textSub: '#71717a',
      textMuted: '#a1a1aa',
      colorPrimary: '#18181b',
      colorCorrect: '#16a34a',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.15)',
      colorCaret: '#18181b',
      keyBg: '#f4f4f5',
      keyText: '#27272a',
      keyActive: '#18181b',
    },
    atmosphere: { glow: 'rgba(24, 24, 27, 0.15)', ambientParticles: 'none', gridPattern: false, glassOpacity: 0.96 }
  },

  // 40. Minimal Black
  {
    id: 'minimal-black',
    name: 'Minimal Black',
    category: 'minimal',
    colors: {
      bgMain: '#09090b',
      bgSurface: '#121215',
      bgSubtle: '#18181c',
      borderColor: '#27272a',
      textMain: '#fafafa',
      textSub: '#a1a1aa',
      textMuted: '#52525b',
      colorPrimary: '#ffffff',
      colorCorrect: '#4ade80',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#ffffff',
      keyBg: '#151518',
      keyText: '#f4f4f5',
      keyActive: '#ffffff',
    },
    atmosphere: { glow: 'rgba(255, 255, 255, 0.2)', ambientParticles: 'none', gridPattern: false, glassOpacity: 0.92 }
  },

  // 41. Retro Arcade
  {
    id: 'retro-arcade',
    name: 'Retro Arcade',
    category: 'retro',
    colors: {
      bgMain: '#100a1c',
      bgSurface: '#19102c',
      bgSubtle: '#261942',
      borderColor: '#ff007f',
      textMain: '#00ffff',
      textSub: '#ffff00',
      textMuted: '#99004d',
      colorPrimary: '#ff007f',
      colorCorrect: '#00ff66',
      colorError: '#ff0033',
      colorErrorBg: 'rgba(255, 0, 51, 0.25)',
      colorCaret: '#00ffff',
      keyBg: '#201538',
      keyText: '#ffff00',
      keyActive: '#ff007f',
    },
    atmosphere: { glow: 'rgba(255, 0, 127, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.82 }
  },

  // 42. Synthwave
  {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    category: 'retro',
    colors: {
      bgMain: '#1a0b2e',
      bgSurface: '#261447',
      bgSubtle: '#391c6b',
      borderColor: '#ff71ce',
      textMain: '#01cdfe',
      textSub: '#b967ff',
      textMuted: '#6825a3',
      colorPrimary: '#ff71ce',
      colorCorrect: '#05ffa1',
      colorError: '#ff2a6d',
      colorErrorBg: 'rgba(255, 42, 109, 0.25)',
      colorCaret: '#05ffa1',
      keyBg: '#301859',
      keyText: '#01cdfe',
      keyActive: '#ff71ce',
    },
    atmosphere: { glow: 'rgba(255, 113, 206, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.8 }
  },

  // 43. Vaporwave
  {
    id: 'vaporwave',
    name: 'Vaporwave Aesthetic',
    category: 'colorful',
    colors: {
      bgMain: '#241734',
      bgSurface: '#34214a',
      bgSubtle: '#482e66',
      borderColor: '#ff99c8',
      textMain: '#d0f4de',
      textSub: '#a9def9',
      textMuted: '#84609c',
      colorPrimary: '#fcf6bd',
      colorCorrect: '#a9def9',
      colorError: '#ff99c8',
      colorErrorBg: 'rgba(255, 153, 200, 0.2)',
      colorCaret: '#fcf6bd',
      keyBg: '#3d2757',
      keyText: '#e4c1f9',
      keyActive: '#ff99c8',
    },
    atmosphere: { glow: 'rgba(255, 153, 200, 0.3)', ambientParticles: 'bubbles', gridPattern: true, glassOpacity: 0.85 }
  },

  // 44. Terminal Green
  {
    id: 'terminal-green',
    name: 'Terminal Green',
    category: 'retro',
    colors: {
      bgMain: '#020b04',
      bgSurface: '#051808',
      bgSubtle: '#09260d',
      borderColor: '#39ff14',
      textMain: '#39ff14',
      textSub: '#23a00d',
      textMuted: '#145c07',
      colorPrimary: '#39ff14',
      colorCorrect: '#39ff14',
      colorError: '#ff3333',
      colorErrorBg: 'rgba(255, 51, 51, 0.2)',
      colorCaret: '#39ff14',
      keyBg: '#07200a',
      keyText: '#39ff14',
      keyActive: '#39ff14',
    },
    atmosphere: { glow: 'rgba(57, 255, 20, 0.32)', ambientParticles: 'matrix', gridPattern: true, glassOpacity: 0.85 }
  },

  // 45. DOS
  {
    id: 'dos',
    name: 'MS-DOS Classic',
    category: 'retro',
    colors: {
      bgMain: '#0000aa',
      bgSurface: '#000088',
      bgSubtle: '#000066',
      borderColor: '#aaaaaa',
      textMain: '#ffffff',
      textSub: '#55ffff',
      textMuted: '#5555ff',
      colorPrimary: '#ffff55',
      colorCorrect: '#55ff55',
      colorError: '#ff5555',
      colorErrorBg: 'rgba(255, 85, 85, 0.3)',
      colorCaret: '#ffffff',
      keyBg: '#000077',
      keyText: '#ffffff',
      keyActive: '#ffff55',
    },
    atmosphere: { glow: 'rgba(85, 255, 255, 0.25)', ambientParticles: 'none', gridPattern: true, glassOpacity: 0.9 }
  },

  // 46. Hacker
  {
    id: 'hacker',
    name: 'Cyber Hacker',
    category: 'retro',
    colors: {
      bgMain: '#040804',
      bgSurface: '#091209',
      bgSubtle: '#112111',
      borderColor: '#00ff66',
      textMain: '#00ff66',
      textSub: '#00cc52',
      textMuted: '#008033',
      colorPrimary: '#00ff66',
      colorCorrect: '#38bdf8',
      colorError: '#ff1744',
      colorErrorBg: 'rgba(255, 23, 68, 0.25)',
      colorCaret: '#00ff66',
      keyBg: '#0d1a0d',
      keyText: '#00ff66',
      keyActive: '#00ff66',
    },
    atmosphere: { glow: 'rgba(0, 255, 102, 0.32)', ambientParticles: 'matrix', gridPattern: true, glassOpacity: 0.85 }
  },

  // 47. Blueprint
  {
    id: 'blueprint',
    name: 'Architect Blueprint',
    category: 'scifi',
    colors: {
      bgMain: '#0a2540',
      bgSurface: '#0f3356',
      bgSubtle: '#154472',
      borderColor: '#2570b5',
      textMain: '#ffffff',
      textSub: '#93c5fd',
      textMuted: '#60a5fa',
      colorPrimary: '#60a5fa',
      colorCorrect: '#38bdf8',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#ffffff',
      keyBg: '#123d67',
      keyText: '#dbeafe',
      keyActive: '#3b82f6',
    },
    atmosphere: { glow: 'rgba(96, 165, 250, 0.3)', ambientParticles: 'none', gridPattern: true, glassOpacity: 0.88 }
  },

  // 48. Industrial
  {
    id: 'industrial',
    name: 'Heavy Industrial',
    category: 'dark',
    colors: {
      bgMain: '#17191d',
      bgSurface: '#212429',
      bgSubtle: '#2d3138',
      borderColor: '#f59e0b',
      textMain: '#f3f4f6',
      textSub: '#fbbf24',
      textMuted: '#b45309',
      colorPrimary: '#f59e0b',
      colorCorrect: '#10b981',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#f59e0b',
      keyBg: '#272b32',
      keyText: '#fde68a',
      keyActive: '#d97706',
    },
    atmosphere: { glow: 'rgba(245, 158, 11, 0.3)', ambientParticles: 'sparks', gridPattern: true, glassOpacity: 0.88 }
  },

  // 49. Steampunk
  {
    id: 'steampunk',
    name: 'Brass Steampunk',
    category: 'retro',
    colors: {
      bgMain: '#1a130e',
      bgSurface: '#291e17',
      bgSubtle: '#3b2c22',
      borderColor: '#b45309',
      textMain: '#fef3c7',
      textSub: '#d97706',
      textMuted: '#92400e',
      colorPrimary: '#d97706',
      colorCorrect: '#84cc16',
      colorError: '#dc2626',
      colorErrorBg: 'rgba(220, 38, 38, 0.2)',
      colorCaret: '#d97706',
      keyBg: '#33261d',
      keyText: '#fde68a',
      keyActive: '#b45309',
    },
    atmosphere: { glow: 'rgba(217, 119, 6, 0.28)', ambientParticles: 'dust', gridPattern: true, glassOpacity: 0.88 }
  },

  // 50. Neon Tokyo
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    category: 'scifi',
    colors: {
      bgMain: '#0c071e',
      bgSurface: '#160d33',
      bgSubtle: '#22154d',
      borderColor: '#ff2a85',
      textMain: '#00f2fe',
      textSub: '#fe5196',
      textMuted: '#9a1f55',
      colorPrimary: '#ff2a85',
      colorCorrect: '#00f2fe',
      colorError: '#ff0055',
      colorErrorBg: 'rgba(255, 0, 85, 0.25)',
      colorCaret: '#00f2fe',
      keyBg: '#1e1245',
      keyText: '#00f2fe',
      keyActive: '#ff2a85',
    },
    atmosphere: { glow: 'rgba(255, 42, 133, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.82 }
  },

  // 51. Neon Seoul
  {
    id: 'neon-seoul',
    name: 'Neon Seoul',
    category: 'scifi',
    colors: {
      bgMain: '#080c1e',
      bgSurface: '#0f1738',
      bgSubtle: '#182454',
      borderColor: '#4361ee',
      textMain: '#f72585',
      textSub: '#4cc9f0',
      textMuted: '#3f37c9',
      colorPrimary: '#4cc9f0',
      colorCorrect: '#7209b7',
      colorError: '#f72585',
      colorErrorBg: 'rgba(247, 37, 133, 0.25)',
      colorCaret: '#4cc9f0',
      keyBg: '#141e47',
      keyText: '#4cc9f0',
      keyActive: '#4361ee',
    },
    atmosphere: { glow: 'rgba(76, 201, 240, 0.35)', ambientParticles: 'neon', gridPattern: true, glassOpacity: 0.82 }
  },

  // 52. Digital Rain
  {
    id: 'digital-rain',
    name: 'Digital Rain',
    category: 'scifi',
    colors: {
      bgMain: '#000803',
      bgSurface: '#001407',
      bgSubtle: '#00260e',
      borderColor: '#00ff41',
      textMain: '#2bf761',
      textSub: '#00b32c',
      textMuted: '#005916',
      colorPrimary: '#00ff41',
      colorCorrect: '#00ff41',
      colorError: '#ff334b',
      colorErrorBg: 'rgba(255, 51, 75, 0.22)',
      colorCaret: '#00ff41',
      keyBg: '#001c0a',
      keyText: '#00ff41',
      keyActive: '#00cc33',
    },
    atmosphere: { glow: 'rgba(0, 255, 65, 0.35)', ambientParticles: 'matrix', gridPattern: true, glassOpacity: 0.85 }
  },

  // 53. Holographic
  {
    id: 'holographic',
    name: 'Holographic Shimmer',
    category: 'scifi',
    colors: {
      bgMain: '#0d131f',
      bgSurface: '#141d2e',
      bgSubtle: '#1e2b45',
      borderColor: '#38bdf8',
      textMain: '#f0fdfa',
      textSub: '#a7f3d0',
      textMuted: '#67e8f9',
      colorPrimary: '#38bdf8',
      colorCorrect: '#a78bfa',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: '#19243a',
      keyText: '#bae6fd',
      keyActive: '#818cf8',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.35)', ambientParticles: 'neon', gridPattern: false, glassOpacity: 0.8 }
  },

  // 54. Glassmorphism
  {
    id: 'glassmorphism',
    name: 'Frost Glassmorphism',
    category: 'scifi',
    colors: {
      bgMain: '#0b1120',
      bgSurface: 'rgba(30, 41, 59, 0.65)',
      bgSubtle: 'rgba(51, 65, 85, 0.6)',
      borderColor: 'rgba(255, 255, 255, 0.25)',
      textMain: '#ffffff',
      textSub: '#94a3b8',
      textMuted: '#64748b',
      colorPrimary: '#38bdf8',
      colorCorrect: '#4ade80',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#38bdf8',
      keyBg: 'rgba(30, 41, 59, 0.7)',
      keyText: '#f1f5f9',
      keyActive: '#0284c7',
    },
    atmosphere: { glow: 'rgba(56, 189, 248, 0.35)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.65 }
  },

  // 55. Liquid Metal
  {
    id: 'liquid-metal',
    name: 'Liquid Metal Chrome',
    category: 'scifi',
    colors: {
      bgMain: '#111317',
      bgSurface: '#1a1d24',
      bgSubtle: '#262a34',
      borderColor: '#94a3b8',
      textMain: '#ffffff',
      textSub: '#cbd5e1',
      textMuted: '#64748b',
      colorPrimary: '#e2e8f0',
      colorCorrect: '#38bdf8',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#ffffff',
      keyBg: '#20242d',
      keyText: '#f1f5f9',
      keyActive: '#94a3b8',
    },
    atmosphere: { glow: 'rgba(226, 232, 240, 0.25)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.88 }
  },

  // 56. Titanium
  {
    id: 'titanium',
    name: 'Brushed Titanium',
    category: 'dark',
    colors: {
      bgMain: '#14161a',
      bgSurface: '#1d2026',
      bgSubtle: '#2a2e37',
      borderColor: '#404654',
      textMain: '#f3f4f6',
      textSub: '#9ca3af',
      textMuted: '#6b7280',
      colorPrimary: '#93c5fd',
      colorCorrect: '#34d399',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#93c5fd',
      keyBg: '#232730',
      keyText: '#e5e7eb',
      keyActive: '#60a5fa',
    },
    atmosphere: { glow: 'rgba(147, 197, 253, 0.22)', ambientParticles: 'none', gridPattern: false, glassOpacity: 0.9 }
  },

  // 57. Carbon Fiber
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber Weave',
    category: 'dark',
    colors: {
      bgMain: '#0c0d0f',
      bgSurface: '#15171a',
      bgSubtle: '#1f2227',
      borderColor: '#30343c',
      textMain: '#f9fafb',
      textSub: '#9ca3af',
      textMuted: '#4b5563',
      colorPrimary: '#06b6d4',
      colorCorrect: '#10b981',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.2)',
      colorCaret: '#06b6d4',
      keyBg: '#191b1f',
      keyText: '#f3f4f6',
      keyActive: '#0891b2',
    },
    atmosphere: { glow: 'rgba(6, 182, 212, 0.25)', ambientParticles: 'none', gridPattern: true, glassOpacity: 0.9 }
  },

  // 58. Royal Purple
  {
    id: 'royal-purple',
    name: 'Royal Purple Monarch',
    category: 'colorful',
    colors: {
      bgMain: '#100720',
      bgSurface: '#1a0b36',
      bgSubtle: '#281152',
      borderColor: '#431c87',
      textMain: '#faf5ff',
      textSub: '#d8b4fe',
      textMuted: '#9333ea',
      colorPrimary: '#c084fc',
      colorCorrect: '#facc15',
      colorError: '#f43f5e',
      colorErrorBg: 'rgba(244, 63, 94, 0.2)',
      colorCaret: '#c084fc',
      keyBg: '#210e44',
      keyText: '#f3e8ff',
      keyActive: '#a855f7',
    },
    atmosphere: { glow: 'rgba(192, 132, 252, 0.32)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.85 }
  },

  // 59. Crimson
  {
    id: 'crimson',
    name: 'Crimson Sovereign',
    category: 'dark',
    colors: {
      bgMain: '#140306',
      bgSurface: '#22060b',
      bgSubtle: '#330a11',
      borderColor: '#52101b',
      textMain: '#fff1f2',
      textSub: '#fda4af',
      textMuted: '#9f1239',
      colorPrimary: '#f43f5e',
      colorCorrect: '#fbbf24',
      colorError: '#ef4444',
      colorErrorBg: 'rgba(239, 68, 68, 0.25)',
      colorCaret: '#f43f5e',
      keyBg: '#2b080e',
      keyText: '#ffe4e6',
      keyActive: '#e11d48',
    },
    atmosphere: { glow: 'rgba(244, 63, 94, 0.35)', ambientParticles: 'sparks', gridPattern: false, glassOpacity: 0.85 }
  },

  // 60. Emerald
  {
    id: 'emerald-sovereign',
    name: 'Emerald Sovereign',
    category: 'nature',
    colors: {
      bgMain: '#03140e',
      bgSurface: '#072419',
      bgSubtle: '#0d3827',
      borderColor: '#15573d',
      textMain: '#ecfdf5',
      textSub: '#6ee7b7',
      textMuted: '#047857',
      colorPrimary: '#10b981',
      colorCorrect: '#34d399',
      colorError: '#f87171',
      colorErrorBg: 'rgba(248, 113, 113, 0.2)',
      colorCaret: '#10b981',
      keyBg: '#0a2f21',
      keyText: '#a7f3d0',
      keyActive: '#059669',
    },
    atmosphere: { glow: 'rgba(16, 185, 129, 0.35)', ambientParticles: 'dust', gridPattern: false, glassOpacity: 0.85 }
  }
];

function parseRgb(color: string): [number, number, number] {
  if (!color) return [128, 128, 128];
  const trimmed = color.trim();
  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((x) => x + x).join('');
    }
    const num = parseInt(hex.slice(0, 6), 16);
    if (!isNaN(num)) {
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
  } else if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
    }
  }
  return [128, 128, 128];
}

function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(c1: string, c2: string): number {
  const l1 = getLuminance(parseRgb(c1));
  const l2 = getLuminance(parseRgb(c2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ensureReadableContrast(foreground: string, background: string, minRatio = 4.5): string {
  const ratio = getContrastRatio(foreground, background);
  if (ratio >= minRatio) return foreground;

  const bgLum = getLuminance(parseRgb(background));
  const targetRgb: [number, number, number] = bgLum < 0.5 ? [255, 255, 255] : [0, 0, 0];
  const fgRgb = parseRgb(foreground);

  // Incrementally blend towards target until threshold is satisfied
  for (let step = 0.15; step <= 1.0; step += 0.15) {
    const blended: [number, number, number] = [
      Math.round(fgRgb[0] * (1 - step) + targetRgb[0] * step),
      Math.round(fgRgb[1] * (1 - step) + targetRgb[1] * step),
      Math.round(fgRgb[2] * (1 - step) + targetRgb[2] * step)
    ];
    const blendedHex = `#${blended.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
    if (getContrastRatio(blendedHex, background) >= minRatio) {
      return blendedHex;
    }
  }

  return bgLum < 0.5 ? '#ffffff' : '#000000';
}

export function applyTheme(theme: ThemeConfig) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const c = theme.colors;

  // Guarantee readability of secondary & typing target text against background
  const verifiedTextSub = ensureReadableContrast(c.textSub, c.bgSurface, 4.5);
  const verifiedTextMuted = ensureReadableContrast(c.textMuted, c.bgSurface, 3.2);
  const typingTarget = ensureReadableContrast(c.textSub, c.bgSurface, 4.5);

  root.style.setProperty('--bg-main', c.bgMain);
  root.style.setProperty('--bg-surface', c.bgSurface);
  root.style.setProperty('--bg-subtle', c.bgSubtle);
  root.style.setProperty('--border-color', c.borderColor);
  root.style.setProperty('--text-main', c.textMain);
  root.style.setProperty('--text-sub', verifiedTextSub);
  root.style.setProperty('--text-muted', verifiedTextMuted);
  root.style.setProperty('--color-primary', c.colorPrimary);
  root.style.setProperty('--color-correct', c.colorCorrect);
  root.style.setProperty('--color-error', c.colorError);
  root.style.setProperty('--color-error-bg', c.colorErrorBg);
  root.style.setProperty('--color-caret', c.colorCaret);
  root.style.setProperty('--key-bg', c.keyBg);
  root.style.setProperty('--key-text', c.keyText);
  root.style.setProperty('--key-active', c.keyActive);

  // Semantic Design System Tokens (Requirement 30)
  root.style.setProperty('--text-primary', c.textMain);
  root.style.setProperty('--text-secondary', verifiedTextSub);
  root.style.setProperty('--typing-target', typingTarget);
  root.style.setProperty('--typing-correct', c.colorCorrect);
  root.style.setProperty('--typing-error', c.colorError);
  root.style.setProperty('--typing-error-bg', c.colorErrorBg);
  root.style.setProperty('--typing-current', c.textMain);
  root.style.setProperty('--caret', c.colorCaret);
  root.style.setProperty('--surface', c.bgSurface);
  root.style.setProperty('--surface-raised', c.bgSubtle);
  root.style.setProperty('--border', c.borderColor);
  root.style.setProperty('--accent', c.colorPrimary);
  const accentLum = getLuminance(parseRgb(c.colorPrimary));
  root.style.setProperty('--accent-contrast', accentLum > 0.45 ? '#090d16' : '#ffffff');
  root.style.setProperty('--success', '#10b981');
  root.style.setProperty('--warning', '#f59e0b');
  root.style.setProperty('--error', '#ef4444');

  // 3D Atmosphere Tokens
  const glow = theme.atmosphere?.glow || `${c.colorPrimary}33`;
  root.style.setProperty('--theme-glow', glow);
  root.style.setProperty('--theme-grid', theme.atmosphere?.gridPattern ? '1' : '0');
  root.style.setProperty('--theme-particles', theme.atmosphere?.ambientParticles || 'none');
  root.style.setProperty('--theme-glass-opacity', (theme.atmosphere?.glassOpacity ?? 0.85).toString());
}
