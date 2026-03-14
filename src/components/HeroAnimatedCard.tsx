"use client";

import { useState, useEffect, useCallback } from "react";

// ── Animation sequence phases ──
// 1. Card fades in blank → user profile appears
// 2. Gift item slides in from below
// 3. URL bar types out character by character
// 4. "Copy" button pulses → changes to "Copied!" with checkmark
// 5. Share options slide in (WhatsApp, SMS)
// 6. "Send This Gift" button fills with a progress shimmer
// 7. Success state: confetti burst + "Gift Sent!" overlay
// 8. Reset and loop

type Phase =
  | "idle"
  | "profile"
  | "gift"
  | "typing"
  | "copied"
  | "share"
  | "sending"
  | "success"
  | "resetting";

const FULL_URL = "/request/amal-birthday-watch";
const TIMINGS = {
  idle: 600,
  profile: 800,
  gift: 900,
  typing: 60,       // per character
  copied: 1200,
  share: 1000,
  sending: 1800,
  success: 2400,
  resetting: 600,
};

export function HeroAnimatedCard() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedChars, setTypedChars] = useState(0);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);

  const advancePhase = useCallback((current: Phase, next: Phase, delay: number) => {
    const timer = setTimeout(() => setPhase(next), delay);
    return timer;
  }, []);

  // Main sequence controller
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "idle":
        timer = advancePhase("idle", "profile", TIMINGS.idle);
        break;
      case "profile":
        timer = advancePhase("profile", "gift", TIMINGS.profile);
        break;
      case "gift":
        timer = advancePhase("gift", "typing", TIMINGS.gift);
        break;
      case "typing":
        // Handled by typing effect below
        break;
      case "copied":
        timer = advancePhase("copied", "share", TIMINGS.copied);
        break;
      case "share":
        timer = advancePhase("share", "sending", TIMINGS.share);
        break;
      case "sending":
        timer = advancePhase("sending", "success", TIMINGS.sending);
        break;
      case "success":
        // Generate confetti
        setConfettiPieces(
          Array.from({ length: 24 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: ["#FF5F6D", "#FF8A94", "#FFD700", "#22C55E", "#6366F1", "#F59E0B"][i % 6],
            delay: Math.random() * 0.4,
          }))
        );
        timer = advancePhase("success", "resetting", TIMINGS.success);
        break;
      case "resetting":
        timer = setTimeout(() => {
          setTypedChars(0);
          setConfettiPieces([]);
          setPhase("idle");
        }, TIMINGS.resetting);
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, advancePhase]);

  // Typing effect
  useEffect(() => {
    if (phase !== "typing") return;

    if (typedChars >= FULL_URL.length) {
      const timer = setTimeout(() => setPhase("copied"), 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setTypedChars((c) => c + 1);
    }, TIMINGS.typing);

    return () => clearTimeout(timer);
  }, [phase, typedChars]);

  const phaseIndex = (p: Phase) =>
    ["idle", "profile", "gift", "typing", "copied", "share", "sending", "success", "resetting"].indexOf(p);
  const isAfter = (p: Phase) => phaseIndex(phase) >= phaseIndex(p);

  return (
    <div className="relative w-full max-w-[440px]">
      {/* Floating badges — appear at different phases */}
      <div
        className={`hidden sm:flex absolute -top-5 -left-10 bg-white rounded-2xl px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-10 items-center gap-2 text-[13px] font-semibold transition-all duration-500 ${
          phase === "success"
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-3 scale-95"
        }`}
      >
        <span className="text-xl">🎁</span> Gift Sent!
      </div>

      <div
        className={`hidden sm:flex absolute bottom-10 -right-8 bg-white rounded-2xl px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] z-10 items-center gap-2 text-[13px] font-semibold animate-float-delayed transition-all duration-500 ${
          isAfter("gift") && phase !== "resetting"
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-4"
        }`}
      >
        <span className="text-xl">❤️</span>
        <span className="tabular-nums">
          {isAfter("success") ? "13" : "12"} requests
        </span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] relative z-[2] overflow-hidden">
        {/* Confetti layer */}
        {confettiPieces.map((p) => (
          <span
            key={p.id}
            className="absolute w-2 h-2 rounded-sm pointer-events-none animate-confetti"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Success overlay */}
        <div
          className={`absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-20 transition-all duration-500 ${
            phase === "success" ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="font-serif text-2xl text-navy mb-1">Gift Sent!</p>
          <p className="text-sm text-grey">Amal will love it</p>
        </div>

        {/* ── Profile Row ── */}
        <div
          className={`flex items-center gap-3 mb-7 transition-all duration-500 ${
            isAfter("profile") && phase !== "resetting"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-coral to-coral-light rounded-full flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          <div>
            <div className="font-semibold text-base">Amal&apos;s Birthday Wishlist</div>
            <div className="text-[13px] text-grey">Birthday &middot; March 20</div>
          </div>
        </div>

        {/* ── Gift Item ── */}
        <div
          className={`bg-bg rounded-2xl p-5 flex gap-4 items-center mb-6 transition-all duration-500 ${
            isAfter("gift") && phase !== "resetting"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center text-3xl shrink-0">
            ⌚
          </div>
          <div>
            <div className="font-semibold text-[15px] mb-1">Classic Leather Watch</div>
            <div className="text-coral font-bold text-base">GH₵ 350.00</div>
            <div className="text-grey-light text-[13px]">by TimeKeepers GH</div>
          </div>
        </div>

        {/* ── URL Bar with typing ── */}
        <div
          className={`flex items-center gap-2.5 bg-bg rounded-full px-5 py-3.5 mb-4 transition-all duration-500 ${
            isAfter("typing") && phase !== "resetting"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <span className="text-green-500 text-xs shrink-0">🔒</span>
          <span className="text-sm text-grey truncate font-mono">
            <strong className="text-navy">yura.app</strong>
            {FULL_URL.slice(0, typedChars)}
            {phase === "typing" && (
              <span className="inline-block w-[2px] h-[14px] bg-coral ml-[1px] align-middle animate-blink" />
            )}
          </span>
          <button
            className={`ml-auto border-none font-semibold text-[13px] cursor-pointer whitespace-nowrap transition-all duration-300 bg-transparent ${
              isAfter("copied") && phase !== "resetting" && phase !== "typing"
                ? "text-green-500"
                : "text-coral"
            }`}
          >
            {isAfter("copied") && phase !== "typing" && phase !== "resetting" ? (
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied!
              </span>
            ) : (
              "Copy"
            )}
          </button>
        </div>

        {/* ── Share Options ── */}
        <div
          className={`flex gap-2 mb-5 transition-all duration-500 ${
            isAfter("share") && phase !== "resetting"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
        >
          <div className="flex-1 bg-[#25D366]/10 text-[#25D366] rounded-xl py-2.5 text-center text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.114 1.519 5.847L.055 23.575l5.891-1.442A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.98 0-3.877-.533-5.539-1.54l-.397-.236-3.497.857.893-3.415-.26-.412A9.78 9.78 0 012.18 12c0-5.418 4.402-9.82 9.82-9.82 5.418 0 9.82 4.402 9.82 9.82 0 5.418-4.402 9.82-9.82 9.82z" />
            </svg>
            WhatsApp
          </div>
          <div className="flex-1 bg-blue-50 text-blue-500 rounded-xl py-2.5 text-center text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            SMS
          </div>
          <div className="flex-1 bg-gray-100 text-grey rounded-xl py-2.5 text-center text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </div>
        </div>

        {/* ── Send Button ── */}
        <button
          className={`relative w-full py-4 border-none rounded-full text-base font-semibold cursor-pointer overflow-hidden transition-all duration-500 ${
            phase === "sending"
              ? "bg-coral-dark text-white scale-[0.98]"
              : isAfter("share") && phase !== "resetting"
              ? "bg-coral text-white"
              : "bg-gray-200 text-grey"
          }`}
        >
          {/* Shimmer effect during sending */}
          {phase === "sending" && (
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          )}
          <span className="relative z-10">
            {phase === "sending" ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                  <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Sending...
              </span>
            ) : (
              "Send This Gift"
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
