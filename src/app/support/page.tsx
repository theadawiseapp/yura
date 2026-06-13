import type { Metadata } from "next";
import { FaEnvelope, FaPhone } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Support — Yura",
  description:
    "Need help with Yura? Reach our team at contact@myyura.com. Find answers to common questions about sending and requesting gifts on Yura.",
};

const SUPPORT_EMAIL = "contact@myyura.com";
const SUPPORT_PHONE = "0539511269";

const faqs = [
  {
    q: "What is Yura?",
    a: "Yura is a social gifting platform that lets you discover, send, and request the perfect gifts. We're launching first in Tamale, Ghana.",
  },
  {
    q: "When does Yura launch?",
    a: "We're currently in pre-launch. Join the waitlist on our homepage and we'll notify you the moment Yura goes live in your area.",
  },
  {
    q: "How do I become a vendor on Yura?",
    a: `We'd love to have you. Email us at ${SUPPORT_EMAIL} with a little about your business and we'll share the next steps for getting set up.`,
  },
  {
    q: "How do I get help with my account or an order?",
    a: `Reach out to our support team at ${SUPPORT_EMAIL} and we'll get back to you, usually within 24–48 hours.`,
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px]">
        {/* Header */}
        <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-10 md:pt-24 text-center">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] text-navy mb-4">
            How can we help?
          </h1>
          <p className="text-lg text-grey max-w-[560px] mx-auto">
            We&apos;re here for you. Browse the common questions below, or reach our
            team directly — we usually reply within 24–48 hours.
          </p>
        </section>

        {/* Primary contact card */}
        <section className="max-w-[1200px] mx-auto px-6 pb-16">
          <div className="bg-gradient-to-br from-coral to-orange-400 rounded-[28px] px-6 py-12 md:px-14 md:py-14 text-center relative overflow-hidden">
            <div className="absolute -top-[80px] -right-[80px] w-[240px] h-[240px] bg-white/[0.08] rounded-full" />
            <div className="absolute -bottom-[50px] -left-[50px] w-[180px] h-[180px] bg-white/[0.05] rounded-full" />

            <h2 className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] text-white mb-3 relative z-10">
              Get in touch
            </h2>
            <p className="text-white/90 max-w-[440px] mx-auto mb-8 relative z-10">
              Send us an email and a real person on the Yura team will get back to you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center relative z-10">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2.5 bg-white text-coral px-8 py-4 rounded-full text-base font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all"
              >
                <FaEnvelope size={18} />
                {SUPPORT_EMAIL}
              </a>
              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-white/15 text-white px-8 py-4 rounded-full text-base font-semibold border border-white/30 backdrop-blur-sm hover:bg-white/25 transition-all"
              >
                <FaPhone size={16} />
                {SUPPORT_PHONE}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[760px] mx-auto px-6 pb-20">
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] text-navy mb-8 text-center">
            Frequently asked questions
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>
      </main>
      <Footer />
    </>
  );
}
