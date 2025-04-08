import { useState, useEffect, useCallback } from "react";

// Define types
export type ToastType = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: React.ReactNode;
}

interface ToastState {
  toasts: Toast[];
}

export const useToast = () => {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(
    ({ title, description, type, duration = 5000, action }: Omit<Toast, "id">) => {
      const id = String(Math.random().toString(36).substring(2, 9));
      
      setState((prev) => ({
        toasts: [...prev.toasts, { id, title, description, type, duration, action }],
      }));

      return id;
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    setState((prev) => ({
      toasts: toastId
        ? prev.toasts.filter((toast) => toast.id !== toastId)
        : [],
    }));
  }, []);

  const update = useCallback(
    (toastId: string, data: Partial<Omit<Toast, "id">>) => {
      if (!toastId) return;

      setState((prev) => ({
        toasts: prev.toasts.map((t) =>
          t.id === toastId ? { ...t, ...data } : t
        ),
      }));
    },
    []
  );

  // Auto remove toasts after duration
  useEffect(() => {
    const timers = new Map<string, NodeJS.Timeout>();

    state.toasts.forEach((toast) => {
      if (!timers.has(toast.id) && toast.duration) {
        const timer = setTimeout(() => {
          dismiss(toast.id);
          timers.delete(toast.id);
        }, toast.duration);

        timers.set(toast.id, timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [state.toasts, dismiss]);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
    update,
  };
};

// Singleton instance for using toast outside of components
const TOAST_LIMIT = 5;
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

const emitChange = () => {
  listeners.forEach((listener) => {
    listener(toasts);
  });
};

export function toast({ 
  title, 
  description, 
  type = "default", 
  duration = 5000,
  action 
}: Omit<Toast, "id">) {
  const id = String(Math.random().toString(36).substring(2, 9));

  const newToast = { id, title, description, type, duration, action };
  toasts = [newToast, ...toasts].slice(0, TOAST_LIMIT);
  
  emitChange();

  // Auto dismiss
  if (duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      emitChange();
    }, duration);
  }

  return id;
}

toast.dismiss = (toastId?: string) => {
  toasts = toastId 
    ? toasts.filter((t) => t.id !== toastId) 
    : [];
  emitChange();
};

toast.update = (toastId: string, data: Partial<Omit<Toast, "id">>) => {
  toasts = toasts.map((t) => (t.id === toastId ? { ...t, ...data } : t));
  emitChange();
};

export function useToasts() {
  const [localToasts, setLocalToasts] = useState<Toast[]>(toasts);

  useEffect(() => {
    setLocalToasts(toasts);

    const onOpenChange = (open: any) => {
      if (!open) {
        toast.dismiss();
      }
    };
    
    listeners.push(setLocalToasts);
    return () => {
      listeners = listeners.filter((listener) => listener !== setLocalToasts);
    };
  }, []);

  return localToasts;
}
