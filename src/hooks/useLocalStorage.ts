import { useState } from 'react';

export const SEARCH_TERM_KEY = 'searchTerm';

export function readLocalStorage(key: string, initialValue = ''): string {
  try {
    return localStorage.getItem(key) ?? initialValue;
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key: string, initialValue: string) {
  const [value, setValueState] = useState<string>(() =>
    readLocalStorage(key, initialValue)
  );

  const setValue = (newValue: string) => {
    setValueState(newValue);
  };

  const saveValue = (newValue?: string) => {
    const toSave = newValue ?? value;
    setValueState(toSave);
    try {
      localStorage.setItem(key, toSave);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return { value, setValue, saveValue };
}
