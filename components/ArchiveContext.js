'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Ctx = createContext(null);
const AUTH_KEY = 'jamail-pin';
const READ_KEY = 'jamail-read';

export function getPin() {
  try {
    return sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
  } catch {
    return null;
  }
}
export function setPin(pin) {
  try {
    sessionStorage.setItem(AUTH_KEY, pin);
    localStorage.setItem(AUTH_KEY, pin);
  } catch {}
}

function loadRead() {
  try {
    return JSON.parse(localStorage.getItem(READ_KEY) || '[]');
  } catch {
    return [];
  }
}

export function ArchiveProvider({ children }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [read, setRead] = useState([]);

  const load = useCallback(async () => {
    const pin = getPin();
    if (!pin) return router.replace('/login');
    try {
      const res = await fetch('/api/archive', { headers: { 'x-pin': pin }, cache: 'no-store' });
      if (res.status === 401) return router.replace('/login');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load');
      setData(json);
    } catch (e) {
      setError(e.message);
    }
  }, [router]);

  useEffect(() => {
    setRead(loadRead());
    load();
  }, [load]);

  const markRead = useCallback((slug) => {
    setRead((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem(READ_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const markAllUnread = useCallback(() => {
    setRead([]);
    try {
      localStorage.removeItem(READ_KEY);
    } catch {}
  }, []);

  return <Ctx.Provider value={{ data, error, read, markRead, markAllUnread, reload: load }}>{children}</Ctx.Provider>;
}

export const useArchive = () => useContext(Ctx);
