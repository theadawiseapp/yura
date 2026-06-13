"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "./SplashScreen";

// Persisted per browser tab/session so the splash plays once on app start,
// not on every subsequent navigation or reload.
const SPLASH_SEEN_KEY = "yura_splash_seen";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  // `ready` gates the first paint until we've checked sessionStorage on the
  // client (it isn't available during SSR).
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(SPLASH_SEEN_KEY)) {
      setShowSplash(true);
    }
    setReady(true);
  }, []);

  const handleComplete = () => {
    sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleComplete} />}
      <div
        className={`transition-opacity duration-700 ${
          ready && !showSplash ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
