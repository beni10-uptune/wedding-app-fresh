'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { analytics, setUserId, trackPageView } from '@/lib/analytics';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Track page views
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Set user ID when auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Recover critical events on mount
  useEffect(() => {
    analytics.recoverCriticalEvents();
  }, []);

  return <>{children}</>;
}