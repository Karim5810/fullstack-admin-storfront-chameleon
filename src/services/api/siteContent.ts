import { supabase } from '../../supabaseClient';
import type { SiteSettings } from '../../types';
import { cloneSiteSettings, defaultSiteSettings } from '../../data/siteContent';
import { normalizeSiteSettings } from '../../utils/siteContent';
import {
  asRecord,
  asString,
  DatabaseRow,
  fromSupabaseOrFallback,
  getStoredSiteSettings,
  setStoredSiteSettings,
} from './shared';

const SITE_SETTINGS_ROW_ID = 'marketplace';

export const siteContentApi = {
  siteContent: {
    getSettings: async (): Promise<SiteSettings> =>
      fromSupabaseOrFallback(
        async () => {
          const { data, error } = await supabase
            .from('site_settings')
            .select('id, value, updated_at')
            .eq('id', SITE_SETTINGS_ROW_ID)
            .limit(1)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (!data) {
            return cloneSiteSettings(defaultSiteSettings);
          }

          return normalizeSiteSettings({
            ...asRecord((data as DatabaseRow).value),
            id: asString((data as DatabaseRow).id, SITE_SETTINGS_ROW_ID),
            updatedAt: asString((data as DatabaseRow).updated_at, new Date().toISOString()),
          });
        },
        () => getStoredSiteSettings(),
      ),
    updateSettings: async (settings: SiteSettings): Promise<SiteSettings> => {
      const nextSettings = normalizeSiteSettings({
        ...settings,
        id: SITE_SETTINGS_ROW_ID,
        updatedAt: new Date().toISOString(),
      });

      return fromSupabaseOrFallback(
        async () => {
          const payload = {
            id: SITE_SETTINGS_ROW_ID,
            value: nextSettings,
          };

          const { data, error } = await supabase
            .from('site_settings')
            .upsert(payload)
            .select('id, value, updated_at')
            .single();

          if (error) {
            throw error;
          }

          return normalizeSiteSettings({
            ...asRecord((data as DatabaseRow).value),
            id: asString((data as DatabaseRow).id, SITE_SETTINGS_ROW_ID),
            updatedAt: asString((data as DatabaseRow).updated_at, nextSettings.updatedAt),
          });
        },
        () => {
          setStoredSiteSettings(nextSettings);
          return nextSettings;
        },
      );
    },
  },
};
