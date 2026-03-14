"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const EMOJIS = ["❤️", "💕", "💗", "💖", "💝", "🤍", "💘", "🩷", "❣️", "💓"];

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  angle: number;
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"drawing" | "emojis" | "logo-pulse" | "fade-out" | "done">("drawing");
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);
  const emojiIdRef = useRef(0);

  // Spawn emojis during drawing phase
  const spawnEmoji = useCallback(() => {
    const id = ++emojiIdRef.current;
    const emoji: FloatingEmoji = {
      id,
      emoji: EMOJIS[id % EMOJIS.length],
      x: 35 + Math.random() * 30,
      y: 30 + Math.random() * 40,
      size: 16 + Math.random() * 20,
      delay: 0,
      duration: 1.5 + Math.random() * 1,
      angle: -30 + Math.random() * 60,
    };
    setEmojis((prev) => [...prev, emoji]);

    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== id));
    }, (emoji.duration + 0.3) * 1000);
  }, []);

  // Main timeline
  useEffect(() => {
    // Phase 1: Drawing starts immediately (CSS handles the SVG animation)
    // Spawn emojis during drawing
    const emojiIntervals: ReturnType<typeof setTimeout>[] = [];

    // Start spawning emojis after a brief delay
    const startEmojis = setTimeout(() => {
      for (let i = 0; i < 14; i++) {
        emojiIntervals.push(
          setTimeout(() => spawnEmoji(), i * 220)
        );
      }
    }, 400);

    // Phase 2: Logo fully drawn, pulse it
    const pulseTimer = setTimeout(() => setPhase("logo-pulse"), 2800);

    // Phase 3: Fade out
    const fadeTimer = setTimeout(() => setPhase("fade-out"), 3800);

    // Phase 4: Done — remove splash
    const doneTimer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4600);

    return () => {
      clearTimeout(startEmojis);
      emojiIntervals.forEach(clearTimeout);
      clearTimeout(pulseTimer);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, spawnEmoji]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-700 ${
        phase === "fade-out" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,95,109,0.06)_0%,transparent_60%)]" />

      <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
        {/* Floating emojis */}
        {emojis.map((e) => (
          <span
            key={e.id}
            className="absolute pointer-events-none animate-emoji-float"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              fontSize: `${e.size}px`,
              animationDuration: `${e.duration}s`,
              transform: `rotate(${e.angle}deg)`,
            }}
          >
            {e.emoji}
          </span>
        ))}

        {/* SVG Logo — line draw animation */}
        <svg
          viewBox="0 0 100 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full transition-transform duration-500 ${
            phase === "logo-pulse" ? "scale-110" : phase === "fade-out" ? "scale-95" : "scale-100"
          }`}
        >
          {/* Left path of the heart/Y — draws first */}
          <path
            d="M50 20 C65 8, 90 15, 85 38 C82 52, 65 60, 50 70"
            stroke="#FF5F6D"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            className="splash-path splash-path-1"
            style={{
              strokeDasharray: 160,
              strokeDashoffset: 160,
            }}
          />
          {/* Right path + tail — draws second */}
          <path
            d="M50 20 C35 8, 10 15, 15 38 C18 52, 35 65, 50 85 L50 105"
            stroke="#FF5F6D"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            className="splash-path splash-path-2"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: 200,
            }}
          />

          {/* Glow version that fades in after draw */}
          <path
            d="M50 20 C65 8, 90 15, 85 38 C82 52, 65 60, 50 70"
            stroke="#FF5F6D"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.15"
            className={`transition-opacity duration-700 ${
              phase === "logo-pulse" || phase === "fade-out" ? "opacity-15" : "opacity-0"
            }`}
            style={{ filter: "blur(8px)" }}
          />
          <path
            d="M50 20 C35 8, 10 15, 15 38 C18 52, 35 65, 50 85 L50 105"
            stroke="#FF5F6D"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity="0.15"
            className={`transition-opacity duration-700 ${
              phase === "logo-pulse" || phase === "fade-out" ? "opacity-15" : "opacity-0"
            }`}
            style={{ filter: "blur(8px)" }}
          />
        </svg>

        {/* "Yura" text fades in after logo draws */}
        <div
          className={`absolute -bottom-2 left-0 right-0 text-center transition-all duration-600 ${
            phase === "logo-pulse" || phase === "fade-out"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="font-serif text-3xl sm:text-4xl text-navy tracking-wide">Yura</span>
        </div>
      </div>
    </div>
  );
}
