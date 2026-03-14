"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { HeroAnimatedCard } from "./HeroAnimatedCard";

export function Hero() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftVisible = useInView(leftRef);
  const rightVisible = useInView(rightRef);

  return (
    <section className="pt-40 pb-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,95,109,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: Content */}
        <div
          ref={leftRef}
          className={`relative z-10 transition-all duration-600 ${
            leftVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-coral/15 px-4 py-2 rounded-full text-[13px] font-semibold text-coral mb-8 shadow-[0_2px_12px_rgba(255,95,109,0.08)]">
            <span className="w-1.5 h-1.5 bg-coral rounded-full animate-pulse-dot" />
            Launching in Tamale, Ghana
          </div>

          <h1 className="font-serif text-[clamp(2.75rem,5.5vw,4rem)] leading-[1.08] text-navy mb-6">
            Request what you
            <br />
            <span className="text-coral">actually want.</span>
          </h1>

          <p className="text-lg text-grey max-w-[460px] leading-relaxed mb-10">
            No more guessing games. Yura lets you discover, send, and request
            the perfect gifts — all through one beautiful link.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 bg-coral text-white px-8 py-4 rounded-full text-base font-semibold shadow-[0_4px_20px_rgba(255,95,109,0.3)] hover:bg-coral-dark hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,95,109,0.35)] transition-all"
            >
              Get Early Access
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white text-navy px-8 py-4 rounded-full text-base font-semibold border-[1.5px] border-black/8 hover:border-coral hover:-translate-y-0.5 transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* Right: Animated Demo Card */}
        <div
          ref={rightRef}
          className={`relative flex justify-center items-center order-first lg:order-last transition-all duration-600 delay-150 ${
            rightVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <HeroAnimatedCard />
        </div>
      </div>
    </section>
  );
}
