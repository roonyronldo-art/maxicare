'use client';
// Fires logout after 15 minutes (900,000 ms) of no user interaction
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function InactivityLogout({ timeoutMs = 900000 }) {
  const router = useRouter();
  const timer = useRef();

  const logout = () => {
    try {
      // Clear cookies by setting expiry in past (only for cookies we set in JS)
      document.cookie = 'token=; Max-Age=0; path=/';
      document.cookie = 'labAdmin=; Max-Age=0; path=/';
      // Any localStorage items
      localStorage.removeItem('labUser');
      localStorage.removeItem('labToken');
    } catch (e) {
      console.error('logout error', e);
    }
    router.replace('/');
  };

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(logout, timeoutMs);
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
    };
  }, [timeoutMs]);

  return null;
}
