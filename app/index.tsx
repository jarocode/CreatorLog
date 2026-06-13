import React, { useCallback, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import type { Href } from 'expo-router';
import { AnimatedSplash } from '@/components/splash/AnimatedSplash';
import { getInitialRoute } from '@/lib/getInitialRoute';

// Keep the native splash up until the animated splash has mounted, so the
// native → animated handoff has no blank frame.
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * App entry. Plays the animated splash while resolving where to route, then
 * replaces the splash with the initial route (no splash entry in the back stack).
 */
export default function Index() {
  const routeRef = useRef<Href | null>(null);

  useEffect(() => {
    let cancelled = false;
    getInitialRoute().then((route) => {
      if (!cancelled) routeRef.current = route;
    });
    // Animated splash has mounted and shares the native splash bg — safe to hide.
    SplashScreen.hideAsync().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFinish = useCallback(() => {
    // getInitialRoute resolves near-instantly; fall back to auth if not ready.
    router.replace(routeRef.current ?? ('/(auth)/sign-in' as Href));
  }, []);

  return <AnimatedSplash onFinish={handleFinish} />;
}
