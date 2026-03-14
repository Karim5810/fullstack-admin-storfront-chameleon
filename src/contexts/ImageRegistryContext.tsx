import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api';

/** خريطة كود → رابط الصورة */
type ImageRegistryMap = Record<string, string>;

interface ImageRegistryContextValue {
  /** الحصول على رابط الصورة من الكود. يرجع undefined إذا لم يكن هناك رابط. */
  getUrl: (code: string) => string | undefined;
  /** الخريطة الكاملة للاستخدام في الواجهة الإدارية */
  registry: ImageRegistryMap;
  isLoading: boolean;
  reload: () => Promise<void>;
}

const ImageRegistryContext = createContext<ImageRegistryContextValue | undefined>(undefined);

export function ImageRegistryProvider({ children }: { children: ReactNode }) {
  const [registry, setRegistry] = useState<ImageRegistryMap>({});
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const map = await api.imageRegistry.getAll();
      setRegistry(map);
    } catch {
      setRegistry({});
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const getUrl = (code: string): string | undefined => {
    const url = registry[code];
    if (!url || url.trim() === '') return undefined;
    return url;
  };

  return (
    <ImageRegistryContext.Provider value={{ getUrl, registry, isLoading, reload: load }}>
      {children}
    </ImageRegistryContext.Provider>
  );
}

export const useImageRegistry = () => {
  const ctx = useContext(ImageRegistryContext);
  if (!ctx) {
    throw new Error('useImageRegistry must be used within ImageRegistryProvider');
  }
  return ctx;
};
