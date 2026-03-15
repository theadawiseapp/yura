"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const occasions = [
  {
    emoji: "🎂",
    title: "Birthdays",
    description: "Make their day unforgettable. Browse curated birthday picks or let them choose their own gift.",
    gradient: "from-red-50 to-rose-100",
  },
  {
    emoji: "💕",
    title: "Anniversaries",
    description: "Celebrate love with thoughtfully curated gifts for couples. From romantic to sentimental.",
    gradient: "from-pink-50 to-pink-100",
  },
  {
    emoji: "🎓",
    title: "Graduations",
    description: "Honor their achievement with a gift that matches the moment. Practical, fun, or premium.",
    gradient: "from-blue-50 to-blue-100",
  },
];

export function Occasions() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerVisible = useInView(headerRef);

  return (
    <section id="occasions" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-coral mb-3">
            For Every Moment
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] text-navy mb-4">
            Shop by Occasion
          </h2>
          <p className="text-[17px] text-grey max-w-[520px] mx-auto leading-relaxed">
            Whether it&apos;s a milestone birthday or a surprise graduation gift, Yura has you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {occasions.map((o, i) => (
            <OccasionCard key={o.title} occasion={o} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OccasionCard({
  occasion,
  delay,
}: {
  occasion: (typeof occasions)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl overflow-hidden cursor-pointer transition-all duration-600 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`h-[200px] flex items-center justify-center text-6xl bg-gradient-to-br ${occasion.gradient}`}>
        {occasion.emoji}
      </div>
      <div className="p-7">
        <h3 className="font-serif text-[22px] text-navy mb-2">{occasion.title}</h3>
        <p className="text-sm text-grey leading-relaxed mb-4">{occasion.description}</p>
        
      </div>
    </div>
  );
}
