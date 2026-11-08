const listeners = new Set<() => void>();

export const subscribe = (callback: () => void): (() => void) => {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
};

export const readRaw = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeRaw = (key: string, value: string | null): boolean => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    return false;
  }
  listeners.forEach((listener) => listener());
  return true;
};
