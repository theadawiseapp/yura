import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { YuraLogo } from "@/components/YuraLogo";
import { ContributeForm } from "@/components/gift/ContributeForm";
import { AppOpenButtons } from "@/components/gift/AppOpenButtons";
import { FloatingHearts } from "@/components/gift/FloatingHearts";
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
  return gift.product_images?.[0]?.url ?? gift.product?.images?.[0]?.url ?? null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const gift = await getGiftRequest(slug).catch(() => null);

  if (!gift) {
    return { title: "Gift request not found — Yura" };
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
  const gift = await getGiftRequest(slug).catch(() => null);

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
    <main className="relative min-h-screen bg-bg overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10 max-w-[560px] mx-auto px-5 py-10 md:py-14">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <YuraLogo className="w-8 h-8" />
          <span className="font-serif text-2xl text-coral italic">Yura</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] border border-black/[0.05] shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6 md:p-8">
          {/* Occasion badge */}
          {gift.occasion_type && (
            <span className="inline-block bg-coral/10 text-coral-dark text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5">
              {gift.occasion_type}
            </span>
          )}

          {/* Requester */}
          <div className="flex items-center gap-3 mb-4">
            {gift.user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gift.user.avatar}
                alt={who}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-coral/15 text-coral flex items-center justify-center font-semibold">
                {who.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="leading-tight">
              <p className="text-grey text-sm">A gift request from</p>
              <p className="text-navy font-semibold text-lg">{who}</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(1.6rem,5vw,2.1rem)] text-navy leading-tight mb-6">
            Help make {who}&apos;s <span className="text-coral italic">wish</span>{" "}
            come true 💕
          </h1>

          {/* Product mini-card */}
          <div className="flex items-center gap-4 bg-bg rounded-2xl p-3 mb-6">
            <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shrink-0 border border-black/[0.05]">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={gift.product.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-navy font-semibold truncate">
                {gift.product.name}
              </p>
              {gift.product.vendor_name && (
                <p className="text-grey text-sm truncate">
                  {gift.product.vendor_name}
                </p>
              )}
              {showPrice && (
                <p className="text-coral font-bold mt-0.5">
                  {formatCedis(gift.product_price)}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          <div className="mb-1.5 flex items-end justify-between gap-3">
            <span className="text-navy">
              <span className="font-serif text-xl">
                {formatCedis(gift.amount_collected)}
              </span>{" "}
              <span className="text-grey text-sm">raised</span>
            </span>
            {showPrice && (
              <span className="text-coral font-semibold text-sm">{percent}%</span>
            )}
          </div>
          <div className="h-2 w-full bg-bg rounded-full overflow-hidden border border-black/[0.04]">
            <div
              className="h-full bg-gradient-to-r from-coral to-orange-400 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-grey text-sm">
            <FaUsers size={13} />
            {gift.contributors_count}{" "}
            {Number(gift.contributors_count) === 1
              ? "contributor"
              : "contributors"}
          </div>

          {gift.note?.trim() && (
            <p className="mt-5 text-grey text-[15px] leading-relaxed border-t border-black/[0.06] pt-5">
              “{gift.note.trim()}”
            </p>
          )}

          <div className="my-6 border-t border-black/[0.06]" />

          {/* Contribute (web) */}
          {isClosed ? (
            <div className="text-center py-2">
              <div className="text-3xl mb-2">
                {gift.is_fulfilled ? "🎉" : "⏳"}
              </div>
              <h3 className="font-serif text-xl text-navy mb-1">
                {gift.is_fulfilled
                  ? "Fully funded!"
                  : "This request has ended"}
              </h3>
              <p className="text-grey text-[15px]">
                {gift.is_fulfilled
                  ? `${who}'s gift has been fully funded. Thank you 💛`
                  : "Contributions are no longer being accepted."}
              </p>
            </div>
          ) : (
            <ContributeForm slug={gift.slug} productName={gift.product.name} />
          )}

          {/* Open in app / stores */}
          <div className="mt-6 pt-6 border-t border-black/[0.06]">
            <p className="text-center text-sm text-grey mb-3">
              Have the Yura app? Open it for the full experience.
            </p>
            <AppOpenButtons slug={gift.slug} />
          </div>
        </div>

        {/* Contributors */}
        {paidContributions.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-lg text-navy mb-3 text-center">
              Contributors
            </h2>
            <ul className="space-y-2.5">
              {paidContributions.map((c, i) => (
                <li
                  key={c.id ?? `${c.contributor_name}-${i}`}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-black/[0.05] p-3"
                >
                  {c.contributor_avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.contributor_avatar}
                      alt={c.contributor_name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-coral/15 text-coral flex items-center justify-center text-sm font-semibold shrink-0">
                      {c.contributor_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-navy font-medium text-sm truncate">
                        {c.contributor_name}
                      </span>
                      <span className="text-coral font-semibold text-sm shrink-0">
                        {formatCedis(c.amount)}
                      </span>
                    </div>
                    {c.message?.trim() && (
                      <p className="text-grey text-xs mt-0.5 truncate">
                        {c.message.trim()}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tagline */}
        <p className="text-center text-sm text-grey mt-8">
          Send gifts with love — powered by{" "}
          <span className="text-coral font-semibold">Yura</span> 💕
        </p>
      </div>
    </main>
  );
}
