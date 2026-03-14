"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    step: "Step 01",
    icon: "🔍",
    title: "Discover Gifts",
    description: "Browse curated collections from trusted local vendors. Filter by occasion, budget, or who it's for.",
    visual: (
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { emoji: "🎁", name: "Gift Box Set", price: "GH₵ 180" },
          { emoji: "🌹", name: "Rose Bouquet", price: "GH₵ 95" },
          { emoji: "⌚", name: "Leather Watch", price: "GH₵ 350" },
          { emoji: "🎧", name: "Headphones", price: "GH₵ 420" },
        ].map((item) => (
          <div key={item.name} className="bg-bg rounded-xl p-3 text-center">
            <div className="text-2xl mb-1.5">{item.emoji}</div>
            <div className="text-[11px] text-grey font-medium">{item.name}</div>
            <div className="text-xs font-bold text-navy">{item.price}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "Step 02",
    icon: "🎁",
    title: "Send a Gift",
    description: "Add a personal message, enter the delivery address, and checkout — we handle the rest.",
    visual: (
      <div className="flex flex-col gap-2.5">
        {[
          { icon: "👤", label: "Recipient", value: "Fatima Ibrahim" },
          { icon: "💬", label: "Message", value: "Happy Birthday!" },
          { icon: "📍", label: "Deliver to", value: "Tamale, Kaladan" },
        ].map((row) => (
          <div key={row.label} className="flex items-center gap-2.5 bg-bg rounded-xl px-3.5 py-2.5 text-[13px]">
            <span>{row.icon}</span>
            <div>
              <div className="text-[11px] text-grey-light">{row.label}</div>
              <div className="font-semibold text-[13px]">{row.value}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "Step 03",
    icon: "🔗",
    title: "Request a Gift",
    description: "Pick what you want, generate a shareable link, and share it on WhatsApp or anywhere.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="bg-bg rounded-full px-4 py-2.5 text-xs text-grey w-full text-center">
          yura.app/request/amal-birthday
        </div>
        <div className="flex gap-2">
          <span className="bg-bg rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-grey">💬 WhatsApp</span>
          <span className="bg-bg rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-grey">📋 Copy Link</span>
        </div>
      </div>
    ),
  },
];

export function Features() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerVisible = useInView(headerRef);

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-coral mb-3">
            Core Features
          </p>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] leading-[1.15] text-navy mb-4">
            Gifting, simplified.
          </h2>
          <p className="text-[17px] text-grey max-w-[520px] mx-auto leading-relaxed">
            Three powerful actions that make every gift feel personal, effortless, and right on time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  delay,
}: {
  feature: (typeof features)[number];
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className={`bg-bg rounded-3xl p-8 transition-all duration-600 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {feature.icon}
      </div>
      <p className="text-xs font-bold text-coral tracking-[0.1em] uppercase mb-3">{feature.step}</p>
      <h3 className="font-serif text-2xl text-navy mb-3">{feature.title}</h3>
      <p className="text-[15px] text-grey leading-relaxed">{feature.description}</p>
      <div className="mt-7 bg-white rounded-2xl p-4">{feature.visual}</div>
    </div>
  );
}
