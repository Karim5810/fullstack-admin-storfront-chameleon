import { cloneSiteSettings, defaultSiteSettings } from '../data/siteContent';
import type { SiteSettings } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const deepMerge = <T>(base: T, override: unknown): T => {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isRecord(base) && isRecord(override)) {
    const nextValue: Record<string, unknown> = { ...base };

    for (const key of Object.keys(override)) {
      const baseValue = nextValue[key];
      const overrideValue = override[key];

      if (Array.isArray(baseValue)) {
        nextValue[key] = Array.isArray(overrideValue) ? overrideValue : baseValue;
        continue;
      }

      if (isRecord(baseValue) && isRecord(overrideValue)) {
        nextValue[key] = deepMerge(baseValue, overrideValue);
        continue;
      }

      nextValue[key] = overrideValue;
    }

    return nextValue as T;
  }

  return ((override ?? base) as T);
};

export const normalizeSiteSettings = (value: unknown): SiteSettings =>
  deepMerge(cloneSiteSettings(defaultSiteSettings), value);
