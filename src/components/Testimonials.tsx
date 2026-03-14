"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    text: "I always struggle to find gifts for my friends. The request link is genius — I just share it and they buy exactly what I want!",
    name: "Amina S.",
    role: "Student, Tamale",
    initial: "A",
    gradient: "from-coral to-coral-light",
  },
  {
    text: "Sent my girlfriend a surprise birthday gift through Yura. The delivery was smooth and the personal message made her cry happy tears.",
    name: "Kwame D.",
    role: "Professional, Tamale",
    initial: "K",
    gradient: "from-indigo-500 to-indigo-400",
  },
  {
    text: "As a vendor, Yura connects me to customers I'd never reach. My cakes are now getting ordered as gifts from people across town.",
    name: "Rashida M.",
    role: "Vendor, Tamale",
    initial: "R",
    gradient: "from-amber-500 to-amber-400",
  },
];

export function Testimonials() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerVisible = useInView(headerRef);

  return (
    <section className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-coral mb-3">
            Early Reactions
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] text-navy mb-4">
            People are already excited
          </h2>
          <p className="text-[17px] text-grey max-w-[520px] mx-auto leading-relaxed">
            Here&apos;s what our early testers in Tamale are saying about Yura.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  delay,
}: {
  testimonial: (typeof testimonials)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className={`bg-white rounded-3xl p-9 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-600 hover:-translate-y-1 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-amber-400 text-sm mb-4 tracking-widest">★★★★★</div>
      <p className="text-base text-navy leading-relaxed mb-5 italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-sm`}
        >
          {testimonial.initial}
        </div>
        <div>
          <div className="font-semibold text-sm">{testimonial.name}</div>
          <div className="text-xs text-grey-light">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
