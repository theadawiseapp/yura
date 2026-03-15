"use client";

import { useRef, useState, useCallback, useEffect, FormEvent } from "react";
import { useInView } from "@/hooks/useInView";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
  velocityX: number;
  velocityY: number;
  shape: "square" | "circle" | "strip";
}

const CONFETTI_COLORS = [
  "#FF5F6D", "#FF8A94", "#FFD700", "#FF6B35",
  "#FF1493", "#FFA07A", "#FF69B4", "#FFBA08",
  "#E8454F", "#FF85A1", "#FFC2D1", "#FB6F92",
];

// TODO: Replace with actual API call when backend is ready
async function submitEmail(email: string): Promise<{ success: boolean }> {
  // Store locally until API is available
  const existing = JSON.parse(localStorage.getItem("yura_waitlist") || "[]");
  if (!existing.includes(email)) {
    existing.push(email);
    localStorage.setItem("yura_waitlist", JSON.stringify(existing));
  }
  return { success: true };
}

export function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visible = useInView(ref);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [showSuccess, setShowSuccess] = useState(false);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const rafRef = useRef<number>(0);

  const launchConfetti = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const pieces: ConfettiPiece[] = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + (Math.random() - 0.5) * 0.5;
      const velocity = 4 + Math.random() * 10;
      pieces.push({
        id: i,
        x: centerX,
        y: centerY,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 3 - Math.random() * 4,
        shape: (["square", "circle", "strip"] as const)[Math.floor(Math.random() * 3)],
      });
    }
    piecesRef.current = pieces;

    let frame = 0;
    const gravity = 0.15;
    const friction = 0.98;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of piecesRef.current) {
        p.velocityY += gravity;
        p.velocityX *= friction;
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.rotation += p.velocityX * 2;

        const opacity = Math.max(0, 1 - frame / 120);
        if (opacity <= 0) continue;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "square") {
          const size = 6 * p.scale;
          ctx.fillRect(-size / 2, -size / 2, size, size);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, 4 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-1, -8 * p.scale, 3, 16 * p.scale);
        }

        ctx.restore();
      }

      if (alive && frame < 150) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "submitting" || status === "success") return;

    setStatus("submitting");
    try {
      const res = await submitEmail(email.trim());
      if (res.success) {
        setStatus("success");
        setShowSuccess(true);
        launchConfetti();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [email, status, launchConfetti]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section id="cta" className="py-28">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={ref}
          className={`bg-gradient-to-br from-coral to-orange-400 rounded-[32px] px-6 py-20 md:px-16 text-center relative overflow-hidden transition-all duration-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Confetti canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-30"
          />

          {/* Decorative circles */}
          <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-white/[0.08] rounded-full" />
          <div className="absolute -bottom-[60px] -left-[60px] w-[200px] h-[200px] bg-white/[0.05] rounded-full" />

          {/* Success overlay */}
          <div
            className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-500 pointer-events-none ${
              showSuccess ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className={`bg-white/95 backdrop-blur-sm rounded-2xl px-8 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${showSuccess ? "animate-bounce-in" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10L9 14L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-navy font-bold text-lg">You&apos;re on the list!</p>
                  <p className="text-grey text-sm">We&apos;ll notify you when Yura launches</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] text-white mb-4 relative z-10">
            Ready to make gifting effortless?
          </h2>
          <p className="text-lg text-white/90 max-w-[480px] mx-auto mb-10 relative z-10">
            Join the waitlist and be among the first to send and request gifts on Yura when we launch in Tamale.
          </p>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-[520px] mx-auto relative z-10">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "success"}
              className="w-full sm:flex-1 px-6 py-4 rounded-full text-base text-navy bg-white outline-none placeholder:text-grey-light shadow-[0_4px_20px_rgba(0,0,0,0.1)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className={`w-full sm:w-auto bg-white text-coral px-9 py-4 rounded-full text-base font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                status === "success" ? "ring-2 ring-white/50 ring-offset-2 ring-offset-coral" : ""
              }`}
            >
              {status === "submitting" ? "Joining..." : status === "success" ? "You're In! 🎉" : "Join Waitlist"}
            </button>
          </form>
          {status === "error" && (
            <p className="text-white/90 text-sm mt-3 relative z-10">Something went wrong. Please try again.</p>
          )}

          <a
            href="#features"
            className="inline-block mt-6 text-white/80 text-sm font-medium hover:text-white transition-colors relative z-10"
          >
            Learn more about Yura
          </a>
        </div>
      </div>
    </section>
  );
}
