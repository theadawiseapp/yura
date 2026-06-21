"use client";

import { useEffect, useState } from "react";

interface Heart {
  id: number;
  left: number;
  emoji: string;
  duration: number;
  delay: number;
  size: number;
}

const EMOJIS = ["❤️", "💕", "💝", "💖", "🎁", "💗", "✨"];

/**
 * Decorative hearts drifting up the background. Generated on the client only so
 * the randomized positions don't cause SSR hydration mismatches.
 */
export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const next: Heart[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      emoji: EMOJIS[i % EMOJIS.length],
      duration: 12 + Math.random() * 16,
      delay: Math.random() * 20,
      size: 0.9 + Math.random() * 0.8,
    }));
    // Client-only randomized decoration; set once on mount to avoid SSR mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHearts(next);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-40px] animate-heart-rise"
          style={{
            left: `${h.left}vw`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
}
