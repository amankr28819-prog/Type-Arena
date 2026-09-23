import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserSettings } from '../types';
import { storage, DEFAULT_SETTINGS } from '../lib/storage';
import { soundEngine } from '../lib/audio';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());

  useEffect(() => {
    // Sync sound engine with settings
    soundEngine.setVolume(settings.soundVolume);
    soundEngine.setMuted(settings.soundProfile === 'off');

    // Sync typography and layout styles
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
  }, [settings]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      storage.saveSettings(next);
      return next;
    });
  };

  const resetSettings = () => {
    storage.saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
