"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

interface Faq {
  q: string;
  a: string;
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div
            key={faq.q}
            className="bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="w-full flex items-center justify-between gap-4 text-left p-6 cursor-pointer"
            >
              <span className="text-navy font-semibold text-lg">{faq.q}</span>
              <FaChevronDown
                size={16}
                className={`shrink-0 text-coral transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-grey text-[15px] leading-relaxed px-6 pb-6">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
