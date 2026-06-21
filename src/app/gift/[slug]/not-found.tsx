import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function GiftNotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] bg-bg min-h-screen">
        <section className="max-w-[640px] mx-auto px-6 py-24 md:py-32 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="font-serif text-[clamp(1.75rem,4vw,2.75rem)] text-navy mb-4">
            Gift request not found
          </h1>
          <p className="text-lg text-grey mb-8">
            This gift request may have been removed, fulfilled, or the link is
            incorrect. Double-check the link or head back home.
          </p>
          <Link
            href="/"
            className="inline-block bg-coral text-white px-8 py-4 rounded-full text-base font-bold hover:bg-coral-dark hover:-translate-y-0.5 transition-all"
          >
            Back to Yura
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
