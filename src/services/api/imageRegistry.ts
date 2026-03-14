import { supabase } from '../../supabaseClient';
import { fromSupabaseOrFallback, readStorage, writeStorage } from './shared';

export interface ImageRegistryEntry {
  code: string;
  url: string;
  description?: string | null;
  updated_at?: string;
}

const IMAGE_REGISTRY_STORAGE_KEY = 'alrayan-image-registry';

const DEFAULT_ENTRIES: ImageRegistryEntry[] = [
  { code: 'herot-1', url: '', description: 'Hero slide 1' },
  { code: 'herot-2', url: '', description: 'Hero slide 2' },
  { code: 'herot-3', url: '', description: 'Hero slide 3' },
  ...Array.from({ length: 16 }, (_, i) => ({ code: `Cat-${i + 1}`, url: '', description: `Category ${i + 1}` })),
];

function getStoredRegistry(): Record<string, string> {
  const stored = readStorage<ImageRegistryEntry[]>(IMAGE_REGISTRY_STORAGE_KEY, []);
  const map: Record<string, string> = {};
  for (const e of stored.length > 0 ? stored : DEFAULT_ENTRIES) {
    map[e.code] = e.url ?? '';
  }
  for (const e of DEFAULT_ENTRIES) {
    if (!(e.code in map)) map[e.code] = '';
  }
  return map;
}

function setStoredRegistry(entries: ImageRegistryEntry[]) {
  writeStorage(IMAGE_REGISTRY_STORAGE_KEY, entries);
}

export const imageRegistryApi = {
  getAll: async (): Promise<Record<string, string>> =>
    fromSupabaseOrFallback(
      async () => {
        const { data, error } = await supabase
          .from('image_registry')
          .select('code, url')
          .order('code');

        if (error) throw error;

        const map: Record<string, string> = {};
        for (const row of data ?? []) {
          const r = row as { code: string; url: string | null };
          map[r.code] = r.url ?? '';
        }
        for (const e of DEFAULT_ENTRIES) {
          if (!(e.code in map)) map[e.code] = '';
        }
        return map;
      },
      () => getStoredRegistry(),
    ),

  getEntries: async (): Promise<ImageRegistryEntry[]> =>
    fromSupabaseOrFallback(
      async () => {
        const { data, error } = await supabase
          .from('image_registry')
          .select('code, url, description, updated_at')
          .order('code');

        if (error) throw error;

        const byCode = new Map<string, ImageRegistryEntry>();
        for (const e of DEFAULT_ENTRIES) {
          byCode.set(e.code, { ...e });
        }
        for (const row of data ?? []) {
          const r = row as { code: string; url: string | null; description?: string | null; updated_at?: string };
          byCode.set(r.code, {
            code: r.code,
            url: r.url ?? '',
            description: r.description ?? null,
            updated_at: r.updated_at,
          });
        }
        return Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
      },
      () => {
        const stored = readStorage<ImageRegistryEntry[]>(IMAGE_REGISTRY_STORAGE_KEY, []);
        const byCode = new Map<string, ImageRegistryEntry>();
        for (const e of DEFAULT_ENTRIES) {
          byCode.set(e.code, { ...e });
        }
        for (const e of stored) {
          byCode.set(e.code, { ...e, url: e.url ?? '' });
        }
        return Array.from(byCode.values()).sort((a, b) => a.code.localeCompare(b.code));
      },
    ),

  upsert: async (entries: ImageRegistryEntry[]): Promise<Record<string, string>> =>
    fromSupabaseOrFallback(
      async () => {
        for (const e of entries) {
          const { error } = await supabase.from('image_registry').upsert(
            { code: e.code, url: e.url ?? '', description: e.description ?? null },
            { onConflict: 'code' },
          );
          if (error) throw error;
        }
        return imageRegistryApi.getAll();
      },
      () => {
        setStoredRegistry(entries);
        const map: Record<string, string> = {};
        for (const e of entries) {
          map[e.code] = e.url ?? '';
        }
        return { ...getStoredRegistry(), ...map };
      },
    ),
};
