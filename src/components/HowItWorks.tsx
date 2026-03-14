"use client";

import { useRef, useEffect, useState, useCallback } from "react";

const steps = [
  {
    number: 1,
    title: "Browse",
    description: "Explore curated gifts from trusted vendors in Ghana.",
    icon: (active: boolean) => (
      <svg viewBox="0 0 80 80" className={`w-full h-full transition-all duration-700 ${active ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        {/* Search/browse icon */}
        <circle cx="35" cy="35" r="18" fill="none" stroke="#FF5F6D" strokeWidth="4" strokeLinecap="round" />
        <line x1="48" y1="48" x2="62" y2="62" stroke="#FF5F6D" strokeWidth="4" strokeLinecap="round" />
        {/* Gift inside */}
        <rect x="27" y="28" width="16" height="14" rx="2" fill="none" stroke="#FF8A94" strokeWidth="2.5" />
        <line x1="35" y1="28" x2="35" y2="42" stroke="#FF8A94" strokeWidth="2.5" />
        <path d="M29 28 C29 24, 35 22, 35 28" fill="none" stroke="#FF8A94" strokeWidth="2" />
        <path d="M41 28 C41 24, 35 22, 35 28" fill="none" stroke="#FF8A94" strokeWidth="2" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Choose",
    description: "Pick the perfect gift or create a wishlist link to share.",
    icon: (active: boolean) => (
      <svg viewBox="0 0 80 80" className={`w-full h-full transition-all duration-700 ${active ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        {/* Gift box */}
        <rect x="15" y="35" width="50" height="32" rx="4" fill="none" stroke="#FF5F6D" strokeWidth="3.5" />
        <rect x="12" y="25" width="56" height="14" rx="4" fill="none" stroke="#FF5F6D" strokeWidth="3.5" />
        <line x1="40" y1="25" x2="40" y2="67" stroke="#FF8A94" strokeWidth="3" />
        {/* Ribbon */}
        <path d="M30 25 C30 18, 40 14, 40 25" fill="none" stroke="#FF8A94" strokeWidth="2.5" />
        <path d="M50 25 C50 18, 40 14, 40 25" fill="none" stroke="#FF8A94" strokeWidth="2.5" />
        {/* Sparkle */}
        <circle cx="60" cy="18" r="2" fill="#FF5F6D" className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`} />
        <circle cx="18" cy="22" r="1.5" fill="#FF8A94" className={`transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`} />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Pay",
    description: "Checkout with Mobile Money — fast, simple, and secure.",
    icon: (active: boolean) => (
      <svg viewBox="0 0 80 80" className={`w-full h-full transition-all duration-700 ${active ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        {/* Phone */}
        <rect x="22" y="8" width="36" height="64" rx="8" fill="none" stroke="#FF5F6D" strokeWidth="3.5" />
        <line x1="22" y1="18" x2="58" y2="18" stroke="#FF5F6D" strokeWidth="2" />
        <line x1="22" y1="60" x2="58" y2="60" stroke="#FF5F6D" strokeWidth="2" />
        {/* Checkmark */}
        <path d="M32 38 L38 44 L50 32" fill="none" stroke="#FF8A94" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-all duration-500 ${active ? "opacity-100" : "opacity-0"}`} />
        {/* MoMo dots */}
        <circle cx="36" cy="66" r="2" fill="#FF8A94" />
        <circle cx="44" cy="66" r="2" fill="#FF8A94" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Deliver",
    description: "We coordinate delivery right to the recipient's door.",
    icon: (active: boolean) => (
      <svg viewBox="0 0 80 80" className={`w-full h-full transition-all duration-700 ${active ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
        {/* Delivery box / package */}
        <path d="M10 30 L40 15 L70 30 L40 45 Z" fill="none" stroke="#FF5F6D" strokeWidth="3" strokeLinejoin="round" />
        <path d="M10 30 L10 55 L40 70 L70 55 L70 30" fill="none" stroke="#FF5F6D" strokeWidth="3" strokeLinejoin="round" />
        <line x1="40" y1="45" x2="40" y2="70" stroke="#FF5F6D" strokeWidth="3" />
        {/* Heart on package */}
        <path d="M37 33 C37 31, 40 30, 40 33 C40 30, 43 31, 43 33 C43 36, 40 38, 40 38 C40 38, 37 36, 37 33Z"
          fill="#FF8A94" className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`} />
        {/* Motion lines */}
        <line x1="4" y1="40" x2="8" y2="40" stroke="#FF8A94" strokeWidth="2" strokeLinecap="round"
          className={`transition-opacity duration-300 ${active ? "opacity-60" : "opacity-0"}`} />
        <line x1="2" y1="48" x2="7" y2="48" stroke="#FF8A94" strokeWidth="2" strokeLinecap="round"
          className={`transition-opacity duration-500 ${active ? "opacity-60" : "opacity-0"}`} />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate how far through the section we've scrolled
    const scrolled = -rect.top;
    const totalScrollable = sectionHeight - viewportHeight;
    const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

    setScrollProgress(progress);
    setIsInView(rect.top < viewportHeight && rect.bottom > 0);
    if (rect.top < viewportHeight * 0.7) setHasEntered(true);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Which step is active (0-3)
  const activeStep = Math.min(3, Math.floor(scrollProgress * 4));
  // Progress within current step (0-1)
  const stepProgress = (scrollProgress * 4) - activeStep;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative"
      // Tall section to create scroll room
      style={{ height: "300vh" }}
    >
      {/* Sticky container */}
      <div
        className={`sticky top-0 h-screen flex items-center overflow-hidden transition-opacity duration-500 ${
          hasEntered ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background gradient that shifts */}
        <div
          className="absolute inset-0 transition-colors duration-700"
          style={{
            background: isInView
              ? `radial-gradient(circle at ${30 + activeStep * 15}% ${40 + Math.sin(scrollProgress * Math.PI) * 10}%, rgba(255,95,109,0.06) 0%, transparent 60%)`
              : "transparent",
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-600 ${
              hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-coral mb-3">
              How It Works
            </p>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] text-navy mb-4">
              Four simple steps to perfect gifting
            </h2>
            <p className="text-[17px] text-grey max-w-[520px] mx-auto leading-relaxed">
              From discovery to delivery, Yura makes the entire experience feel effortless.
            </p>
          </div>

          {/* Main content area */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left: Animated illustration */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-[220px] h-[220px] sm:w-[280px] sm:h-[280px]">
                {/* Rotating ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-coral/15 transition-transform duration-1000"
                  style={{ transform: `rotate(${scrollProgress * 360}deg)` }}
                >
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-coral rounded-full" />
                </div>

                {/* Inner glow */}
                <div
                  className="absolute inset-6 rounded-full transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle, rgba(255,95,109,${0.06 + stepProgress * 0.06}) 0%, transparent 70%)`,
                    transform: `scale(${0.9 + stepProgress * 0.1})`,
                  }}
                />

                {/* Step icons — each fades in/out */}
                {steps.map((step, i) => (
                  <div
                    key={step.number}
                    className="absolute inset-8 sm:inset-12 flex items-center justify-center transition-all duration-500"
                    style={{
                      opacity: activeStep === i ? 1 : 0,
                      transform: `scale(${activeStep === i ? 1 : 0.8}) translateY(${activeStep === i ? 0 : 20}px)`,
                    }}
                  >
                    {step.icon(activeStep === i)}
                  </div>
                ))}

                {/* Step number badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-coral to-coral-light text-white rounded-full flex items-center justify-center text-lg font-bold shadow-[0_8px_24px_rgba(255,95,109,0.25)] transition-all duration-300">
                  {activeStep + 1}
                </div>
              </div>
            </div>

            {/* Right: Steps list */}
            <div className="flex-1 max-w-[460px]">
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                const isPast = activeStep > i;

                return (
                  <div
                    key={step.number}
                    className={`flex gap-5 py-5 transition-all duration-500 ${
                      isActive ? "opacity-100" : isPast ? "opacity-40" : "opacity-30"
                    }`}
                  >
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-[2.5px] transition-all duration-500 ${
                          isActive
                            ? "border-coral bg-coral scale-110 shadow-[0_0_12px_rgba(255,95,109,0.4)]"
                            : isPast
                            ? "border-coral bg-coral"
                            : "border-grey-light bg-transparent"
                        }`}
                      />
                      {i < steps.length - 1 && (
                        <div className="w-0.5 flex-1 mt-2 rounded-full overflow-hidden bg-black/[0.06]">
                          <div
                            className="w-full bg-gradient-to-b from-coral to-coral-light transition-all duration-500 rounded-full"
                            style={{
                              height: isPast ? "100%" : isActive ? `${Math.min(100, stepProgress * 100)}%` : "0%",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 transition-transform duration-500 ${isActive ? "translate-x-1" : ""}`}>
                      <h3
                        className={`font-serif text-xl mb-1.5 transition-colors duration-500 ${
                          isActive ? "text-coral" : "text-navy"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[15px] text-grey leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar at bottom */}
          <div className="mt-12 max-w-[400px] mx-auto">
            <div className="h-1 rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-coral to-coral-light rounded-full transition-[width] duration-100"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {steps.map((step, i) => (
                <span
                  key={step.number}
                  className={`text-xs font-medium transition-colors duration-300 ${
                    activeStep >= i ? "text-coral" : "text-grey-light"
                  }`}
                >
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
