import Link from "next/link";
import { YuraLogo } from "@/components/YuraLogo";

export default function GiftNotFound() {
  return (
    <main className="relative min-h-screen bg-bg flex items-center justify-center px-5">
      <div className="max-w-[480px] w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <YuraLogo className="w-8 h-8" />
          <span className="font-serif text-2xl text-coral italic">Yura</span>
        </div>
        <div className="bg-white rounded-[28px] border border-black/[0.05] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-8 md:p-10">
          <div className="text-5xl mb-5">🎁</div>
          <h1 className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] text-navy mb-3">
            Gift request not found
          </h1>
          <p className="text-grey mb-7">
            This gift request may have been removed, fulfilled, or the link is
            incorrect. Double-check the link or head back home.
          </p>
          <Link
            href="/"
            className="inline-block bg-coral text-white px-8 py-4 rounded-full text-base font-bold hover:bg-coral-dark hover:-translate-y-0.5 transition-all"
          >
            Back to Yura
          </Link>
        </div>
      </div>
    </main>
  );
}
