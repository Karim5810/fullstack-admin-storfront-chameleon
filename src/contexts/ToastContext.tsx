import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

type ToastTone = 'info' | 'success' | 'error' | 'warning';

type ToastState = {
  message: string;
  type: ToastTone;
};

type ToastContextValue = {
  /**
   * Legacy helper kept for backward-compat.
   */
  show: (message: string, type?: ToastTone) => void;
  /**
   * New helper used across the admin dashboard.
   */
  addToast: (message: string, tone?: ToastTone, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const show = useCallback((message: string, type: ToastTone = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToast = useCallback(
    (message: string, tone: ToastTone = 'info', durationMs = 3000) => {
      setToast({ message, type: tone });
      setTimeout(() => setToast(null), durationMs);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ show, addToast }}>
      {children}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

