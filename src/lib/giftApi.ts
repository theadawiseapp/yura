// API layer for public gift-request pages.
//
// Responses from the Yura backend are wrapped as { success, message, data }.
// The contribution flow is a two-step Paystack flow:
//   1. initiate_contribution -> returns a Paystack authorization_url to redirect to
//   2. verify_contribution   -> settles the payment once the visitor returns

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.myyuraapp.com/api/v1";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  url: string;
  sort_order: number;
}

export interface GiftRequestOwner {
  id: string;
  full_name?: string;
  display_name: string;
  avatar: string | null;
}

export interface GiftProduct {
  id: string;
  name: string;
  price: string;
  original_price: string | null;
  images: ProductImage[];
  vendor_name?: string;
  delivery_estimate?: string;
}

export type ContributionStatus = "pending" | "paid" | "failed";

export interface Contribution {
  id?: string;
  contributor_name: string;
  contributor_phone?: string;
  amount: string;
  message?: string;
  contributor_avatar: string | null;
  status?: ContributionStatus;
  created_at?: string;
}

export interface GiftRequestDetail {
  id: string;
  slug: string;
  user: GiftRequestOwner;
  product: GiftProduct;
  product_images: ProductImage[];
  note: string;
  occasion_type: string;
  is_fulfilled: boolean;
  views: number;
  amount_collected: string;
  product_price: string;
  keep_price_visible: boolean;
  contributions: Contribution[];
  contributors_count: number | string;
  progress_percentage: number | string;
  expires_at: string | null;
  created_at: string;
}

export interface InitiateResponse {
  authorization_url: string;
  reference: string;
  contribution_id: string;
}

export interface InitiateBody {
  contributor_name: string;
  amount: string;
  contributor_phone?: string;
  message?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

// ── Server-side fetch ────────────────────────────────────────────────────────

/**
 * Fetch a gift request by slug. Always hits the network fresh so the funding
 * totals are current (and so the backend records a view). Returns `null` when
 * the request does not exist (404); throws on other failures.
 */
export async function getGiftRequest(
  slug: string
): Promise<GiftRequestDetail | null> {
  const res = await fetch(
    `${API_BASE}/public/gift-requests/${encodeURIComponent(slug)}/`,
    { cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load gift request (${res.status})`);
  }

  const body = (await res.json()) as ApiEnvelope<GiftRequestDetail>;
  if (!body.success || !body.data) return null;
  return body.data;
}

// ── Client-side mutations ─────────────────────────────────────────────────────

/** Initialize a Paystack checkout. Returns the authorization_url to redirect to. */
export async function initiateContribution(
  slug: string,
  body: InitiateBody
): Promise<InitiateResponse> {
  const res = await fetch(
    `${API_BASE}/public/gift-requests/${encodeURIComponent(
      slug
    )}/initiate_contribution/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const json = (await res.json().catch(() => null)) as
    | ApiEnvelope<InitiateResponse>
    | null;

  if (!res.ok || !json?.success || !json.data) {
    throw new Error(json?.message ?? "Could not start the payment. Please try again.");
  }
  return json.data;
}

/** Verify a contribution after the visitor returns from Paystack. */
export async function verifyContribution(
  slug: string,
  paymentReference: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/public/gift-requests/${encodeURIComponent(
      slug
    )}/verify_contribution/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_reference: paymentReference }),
    }
  );

  const json = (await res.json().catch(() => null)) as ApiEnvelope<unknown> | null;

  if (!res.ok || !json?.success) {
    throw new Error(json?.message ?? "We couldn't verify your payment.");
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a decimal string amount as Ghana cedis, e.g. "60.00" -> "₵60.00". */
export function formatCedis(amount: string | number): string {
  const n = typeof amount === "number" ? amount : parseFloat(amount);
  if (Number.isNaN(n)) return `₵${amount}`;
  return `₵${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Clamp a numeric-ish progress value to 0–100. */
export function clampPercent(value: number | string): number {
  const n = typeof value === "number" ? value : parseFloat(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}
