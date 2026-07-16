import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export interface LocalStorageOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export type LocalStorageResult<T> = readonly [
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  removeValue: () => void,
];

const defaultSerialize = <T,>(value: T) => JSON.stringify(value);
const defaultDeserialize = <T,>(value: string) => JSON.parse(value) as T;

function resolveInitialValue<T>(initialValue: T | (() => T)): T {
  return initialValue instanceof Function ? initialValue() : initialValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: LocalStorageOptions<T> = {},
): LocalStorageResult<T> {
  const [initialSnapshot] = useState(() => resolveInitialValue(initialValue));
  const serialize = options.serialize ?? defaultSerialize<T>;
  const deserialize = options.deserialize ?? defaultDeserialize<T>;

  const readStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialSnapshot;

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue === null ? initialSnapshot : deserialize(storedValue);
    } catch {
      return initialSnapshot;
    }
  }, [deserialize, initialSnapshot, key]);

  const [value, setValue] = useState<T>(readStoredValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // In-memory state remains the source of truth when storage is unavailable.
    }
  }, [key, serialize, value]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) return;

      if (event.newValue === null) {
        setValue(initialSnapshot);
        return;
      }

      try {
        setValue(deserialize(event.newValue));
      } catch {
        setValue(initialSnapshot);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [deserialize, initialSnapshot, key]);

  const removeValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Removing persisted state is best-effort only.
      }
    }

    setValue(initialSnapshot);
  }, [initialSnapshot, key]);

  return [value, setValue, removeValue] as const;
}
