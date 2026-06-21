import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] bg-bg min-h-screen flex items-center">
        <section className="max-w-[560px] mx-auto px-6 py-20 md:py-28 text-center">
          <p className="font-serif text-[clamp(4rem,12vw,7rem)] text-coral leading-none mb-2">
            404
          </p>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] text-navy mb-4">
            This page wandered off
          </h1>
          <p className="text-lg text-grey mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Let&apos;s get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-block bg-coral text-white px-8 py-4 rounded-full text-base font-bold hover:bg-coral-dark hover:-translate-y-0.5 transition-all"
            >
              Back home
            </Link>
            <Link
              href="/support"
              className="inline-block bg-white text-navy border border-black/[0.1] px-8 py-4 rounded-full text-base font-semibold hover:border-coral hover:text-coral transition-all"
            >
              Contact support
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
