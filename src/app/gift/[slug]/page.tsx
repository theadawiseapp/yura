import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaUsers, FaCircleCheck, FaApple, FaGooglePlay } from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContributeForm } from "@/components/gift/ContributeForm";
import {
  getGiftRequest,
  formatCedis,
  clampPercent,
  type GiftRequestDetail,
} from "@/lib/giftApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function heroImage(gift: GiftRequestDetail): string | null {
  return (
    gift.product_images?.[0]?.url ?? gift.product?.images?.[0]?.url ?? null
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gift = await getGiftRequest(slug).catch(() => null);

  if (!gift) {
    return {
      title: "Gift request not found — Yura",
    };
  }

  const who = gift.user?.display_name ?? "Someone";
  const title = `${who} is raising funds for ${gift.product.name} — Yura`;
  const description =
    gift.note?.trim() ||
    `Help ${who} get ${gift.product.name}${
      gift.occasion_type ? ` for their ${gift.occasion_type}` : ""
    }. Contribute securely on Yura.`;
  const image = heroImage(gift);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function GiftRequestPage({ params }: PageProps) {
  const { slug } = await params;
  const gift = await getGiftRequest(slug);

  if (!gift) notFound();

  const who = gift.user?.display_name ?? "Someone";
  const image = heroImage(gift);
  const percent = clampPercent(gift.progress_percentage);
  // Server component: rendered fresh per request, so a request-time comparison
  // is intentional and stable for this render.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const isExpired = gift.expires_at
    ? new Date(gift.expires_at).getTime() < nowMs
    : false;
  const isClosed = gift.is_fulfilled || isExpired;
  const showPrice = gift.keep_price_visible;

  const paidContributions = gift.contributions.filter(
    (c) => !c.status || c.status === "paid"
  );

  return (
    <>
      <Navbar />
      <main className="pt-[72px] bg-bg min-h-screen">
        <section className="max-w-[1100px] mx-auto px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">
            {/* ── Left: gift details ── */}
            <div>
              {/* Hero card */}
              <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="relative bg-bg aspect-[4/3] w-full">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={gift.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-grey-light">
                      No image
                    </div>
                  )}
                  {gift.occasion_type && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-navy text-xs font-semibold px-3 py-1.5 rounded-full">
                      {gift.occasion_type}
                    </span>
                  )}
                  {isClosed && (
                    <span className="absolute top-4 right-4 bg-navy/85 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {gift.is_fulfilled ? "Fully funded" : "Ended"}
                    </span>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <h1 className="font-serif text-[clamp(1.5rem,3.5vw,2.25rem)] text-navy leading-tight mb-4">
                    {gift.product.name}
                  </h1>

                  {/* Requester */}
                  <div className="flex items-center gap-3 mb-6">
                    {gift.user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={gift.user.avatar}
                        alt={who}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-coral/15 text-coral flex items-center justify-center font-semibold">
                        {who.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="text-[15px] text-grey">
                      <span className="text-navy font-semibold">{who}</span> is
                      asking for this gift
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <div>
                      <span className="font-serif text-2xl text-navy">
                        {formatCedis(gift.amount_collected)}
                      </span>
                      {showPrice && (
                        <span className="text-grey text-[15px]">
                          {" "}
                          raised of {formatCedis(gift.product_price)}
                        </span>
                      )}
                    </div>
                    {showPrice && (
                      <span className="text-coral font-semibold text-[15px]">
                        {percent}%
                      </span>
                    )}
                  </div>
                  <div className="h-2.5 w-full bg-bg rounded-full overflow-hidden border border-black/[0.04]">
                    <div
                      className="h-full bg-gradient-to-r from-coral to-orange-400 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-grey text-sm">
                    <FaUsers size={14} />
                    {gift.contributors_count}{" "}
                    {Number(gift.contributors_count) === 1
                      ? "contributor"
                      : "contributors"}
                  </div>

                  {gift.note?.trim() && (
                    <p className="mt-6 text-grey text-[15px] leading-relaxed border-t border-black/[0.06] pt-6">
                      “{gift.note.trim()}”
                    </p>
                  )}
                </div>
              </div>

              {/* Contributors */}
              <div className="mt-8">
                <h2 className="font-serif text-xl text-navy mb-4">
                  Contributors
                </h2>
                {paidContributions.length === 0 ? (
                  <p className="text-grey text-[15px]">
                    Be the first to contribute 💛
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {paidContributions.map((c, i) => (
                      <li
                        key={c.id ?? `${c.contributor_name}-${i}`}
                        className="flex items-start gap-3 bg-white rounded-2xl border border-black/[0.06] p-4"
                      >
                        {c.contributor_avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.contributor_avatar}
                            alt={c.contributor_name}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-coral/15 text-coral flex items-center justify-center font-semibold shrink-0">
                            {c.contributor_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-navy font-semibold text-[15px] truncate">
                              {c.contributor_name}
                            </span>
                            <span className="text-coral font-semibold text-[15px] shrink-0">
                              {formatCedis(c.amount)}
                            </span>
                          </div>
                          {c.message?.trim() && (
                            <p className="text-grey text-sm mt-0.5">
                              {c.message.trim()}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* ── Right: contribute + app CTA ── */}
            <div className="lg:sticky lg:top-[88px] self-start space-y-6">
              {isClosed ? (
                <div className="bg-white rounded-[24px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                    <FaCircleCheck size={26} className="text-white" />
                  </div>
                  <h3 className="font-serif text-2xl text-navy mb-2">
                    {gift.is_fulfilled
                      ? "Fully funded! 🎉"
                      : "This request has ended"}
                  </h3>
                  <p className="text-grey text-[15px]">
                    {gift.is_fulfilled
                      ? `${who}'s gift has been fully funded. Thank you to everyone who chipped in.`
                      : "Contributions are no longer being accepted for this gift."}
                  </p>
                </div>
              ) : (
                <ContributeForm slug={gift.slug} productName={gift.product.name} />
              )}

              {/* Get the app */}
              <div className="bg-gradient-to-br from-coral to-orange-400 rounded-[24px] p-6 md:p-7 text-center relative overflow-hidden">
                <div className="absolute -top-[60px] -right-[60px] w-[160px] h-[160px] bg-white/[0.08] rounded-full" />
                <h3 className="font-serif text-xl text-white mb-2 relative z-10">
                  Get the Yura app
                </h3>
                <p className="text-white/90 text-sm mb-5 relative z-10">
                  Send and request gifts, track contributions, and more — right
                  from your phone.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 bg-white text-coral px-5 py-3 rounded-full text-sm font-bold hover:-translate-y-0.5 transition-all"
                  >
                    <FaApple size={18} />
                    App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.AdawiseTechnologiesLimited.myyura"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white/15 text-white border border-white/30 backdrop-blur-sm px-5 py-3 rounded-full text-sm font-semibold hover:bg-white/25 transition-all"
                  >
                    <FaGooglePlay size={16} />
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
