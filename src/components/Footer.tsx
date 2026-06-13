import Link from "next/link";
import { FaXTwitter, FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { YuraLogo } from "./YuraLogo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Occasions", href: "/#occasions" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "For Vendors", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "/support" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Vendor Agreement", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy text-white/70 pt-[72px] pb-9">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#" className="inline-flex items-center gap-2">
              <YuraLogo className="w-10 h-10" />
              <span className="font-serif text-[22px] text-white">Yura</span>
            </a>
            <p className="text-[15px] leading-relaxed mt-4 max-w-[300px]">
              Discover, send, and request the perfect gifts. Made with love in Ghana.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-sm font-semibold uppercase tracking-[0.08em] mb-5">
                {heading}
              </h4>
              <ul className="list-none space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[15px] text-white/60 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-9 flex flex-col sm:flex-row justify-between items-center gap-4 text-[13px]">
          <span>&copy; 2026 Yura. All rights reserved.</span>
          <div className="flex gap-4">
            {[
              { icon: <FaXTwitter size={18} />, label: "X (Twitter)", href: "#" },
              { icon: <FaInstagram size={18} />, label: "Instagram", href: "#" },
              { icon: <FaWhatsapp size={18} />, label: "WhatsApp", href: "#" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-white/60 hover:bg-coral hover:text-white transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
