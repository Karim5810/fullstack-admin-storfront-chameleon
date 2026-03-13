import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';
import { cloneSiteSettings, defaultSiteSettings } from '../data/siteContent';
import type { SiteSettings } from '../types';

interface SiteContentContextValue {
  settings: SiteSettings;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  saveSettings: (settings: SiteSettings) => Promise<SiteSettings>;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(cloneSiteSettings(defaultSiteSettings));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextSettings = await api.siteContent.getSettings();
      setSettings(nextSettings);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to load storefront settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const saveSettings = async (nextSettings: SiteSettings) => {
    const savedSettings = await api.siteContent.updateSettings(nextSettings);
    setSettings(savedSettings);
    return savedSettings;
  };

  return (
    <SiteContentContext.Provider
      value={{
        settings,
        isLoading,
        error,
        reload: loadSettings,
        saveSettings,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);

  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }

  return context;
};
