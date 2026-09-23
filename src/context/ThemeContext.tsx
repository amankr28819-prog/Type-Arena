import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeConfig } from '../types';
import { BUILTIN_THEMES, applyTheme } from '../lib/themes';
import { storage } from '../lib/storage';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  allThemes: ThemeConfig[];
  customThemes: ThemeConfig[];
  setTheme: (themeId: string) => void;
  saveCustomTheme: (theme: ThemeConfig) => void;
  deleteCustomTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState(() => storage.getSettings());
  const [customThemes, setCustomThemes] = useState<ThemeConfig[]>(settings.customThemes || []);

  const allThemes = [...BUILTIN_THEMES, ...customThemes];
  const activeTheme = allThemes.find((t) => t.id === settings.themeId) || BUILTIN_THEMES[0];

  useEffect(() => {
    applyTheme(activeTheme);
    // Apply font settings
    document.documentElement.style.setProperty('--font-typing', settings.fontFamily);
    document.documentElement.style.setProperty('--font-size-typing', `${settings.fontSize}px`);

    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [activeTheme, settings.fontFamily, settings.fontSize, settings.highContrast, settings.reducedMotion]);

  const setTheme = (themeId: string) => {
    const updated = { ...settings, themeId };
    storage.saveSettings(updated);
    setSettingsState(updated);
  };

  const saveCustomTheme = (theme: ThemeConfig) => {
    const filtered = customThemes.filter((t) => t.id !== theme.id);
    const updatedCustom = [...filtered, theme];
    setCustomThemes(updatedCustom);
    const updatedSettings = {
      ...settings,
      themeId: theme.id,
      customThemes: updatedCustom
    };
    storage.saveSettings(updatedSettings);
    setSettingsState(updatedSettings);
  };

  const deleteCustomTheme = (themeId: string) => {
    const updatedCustom = customThemes.filter((t) => t.id !== themeId);
    setCustomThemes(updatedCustom);
    const nextThemeId = settings.themeId === themeId ? 'midnight' : settings.themeId;
    const updatedSettings = {
      ...settings,
      themeId: nextThemeId,
      customThemes: updatedCustom
    };
    storage.saveSettings(updatedSettings);
    setSettingsState(updatedSettings);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: activeTheme,
        allThemes,
        customThemes,
        setTheme,
        saveCustomTheme,
        deleteCustomTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
