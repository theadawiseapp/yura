"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { YuraLogo } from "./YuraLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b transition-shadow ${
          scrolled ? "shadow-md border-black/4" : "border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <YuraLogo className="w-9 h-9" />
            <span className="font-serif text-2xl text-navy">Yura</span>
          </Link>

          <ul className="hidden md:flex items-center gap-9 list-none">
            <li>
              <Link href="/#features" className="text-[15px] font-medium text-grey hover:text-navy transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#occasions" className="text-[15px] font-medium text-grey hover:text-navy transition-colors">
                Occasions
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="text-[15px] font-medium text-grey hover:text-navy transition-colors">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-[15px] font-medium text-grey hover:text-navy transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/#cta"
                className="bg-coral text-white px-6 py-2.5 rounded-full text-[15px] font-semibold hover:bg-coral-dark transition-all hover:-translate-y-0.5"
              >
                Get Early Access
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-navy rounded-sm" />
            <span className="block w-6 h-0.5 bg-navy rounded-sm" />
            <span className="block w-6 h-0.5 bg-navy rounded-sm" />
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed top-[72px] left-0 right-0 bg-white p-6 shadow-xl z-40 md:hidden">
          <Link href="/#features" onClick={() => setMobileOpen(false)} className="block py-3 text-base font-medium text-navy border-b border-black/4">
            Features
          </Link>
          <Link href="/#occasions" onClick={() => setMobileOpen(false)} className="block py-3 text-base font-medium text-navy border-b border-black/4">
            Occasions
          </Link>
          <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="block py-3 text-base font-medium text-navy border-b border-black/4">
            How It Works
          </Link>
          <Link href="/support" onClick={() => setMobileOpen(false)} className="block py-3 text-base font-medium text-navy border-b border-black/4">
            Contact
          </Link>
          <Link
            href="/#cta"
            onClick={() => setMobileOpen(false)}
            className="block mt-4 text-center bg-coral text-white py-3.5 rounded-full font-semibold"
          >
            Get Early Access
          </Link>
        </div>
      )}
    </>
  );
}
