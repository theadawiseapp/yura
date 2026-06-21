"use client";

import { useCallback } from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa6";
import { appDeepLink } from "@/lib/giftApi";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.AdawiseTechnologiesLimited.myyura";
// TODO: replace with the real App Store URL once the iOS app is live.
const APP_STORE_URL = "#";

interface AppOpenButtonsProps {
  slug: string;
}

export function AppOpenButtons({ slug }: AppOpenButtonsProps) {
  // Try to open the native app via its custom scheme. If the app isn't
  // installed nothing happens and the visitor stays on the web page (where they
  // can still contribute or use the store buttons below).
  const openApp = useCallback(() => {
    window.location.href = appDeepLink(slug);
  }, [slug]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={openApp}
        className="w-full inline-flex items-center justify-center gap-2 bg-coral text-white py-3.5 rounded-full text-base font-bold hover:bg-coral-dark hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        Open in Yura app 💝
      </button>
      <div className="grid grid-cols-2 gap-3">
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-navy border border-black/[0.1] py-3 rounded-full text-sm font-semibold hover:border-coral hover:text-coral transition-all"
        >
          <FaGooglePlay size={15} />
          Google Play
        </a>
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-navy border border-black/[0.1] py-3 rounded-full text-sm font-semibold hover:border-coral hover:text-coral transition-all"
        >
          <FaApple size={16} />
          App Store
        </a>
      </div>
    </div>
  );
}
