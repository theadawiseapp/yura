"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheck, FaHeart } from "react-icons/fa6";
import {
  initiateContribution,
  verifyContribution,
} from "@/lib/giftApi";

const PENDING_KEY = "yura_pending_contribution";

interface PendingContribution {
  slug: string;
  reference: string;
  name: string;
}

interface ContributeFormProps {
  slug: string;
  productName: string;
}

function readPending(): PendingContribution | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as PendingContribution) : null;
  } catch {
    return null;
  }
}

function ContributeFormInner({ slug, productName }: ContributeFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "verifying" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [pending, setPending] = useState<PendingContribution | null>(null);

  const runVerify = useCallback(
    async (reference: string) => {
      setStatus("verifying");
      setError("");
      try {
        await verifyContribution(slug, reference);
        localStorage.removeItem(PENDING_KEY);
        setPending(null);
        setStatus("success");
        router.refresh(); // pull the updated funding totals
      } catch (e) {
        setStatus("error");
        setError(
          e instanceof Error
            ? e.message
            : "We couldn't verify your payment."
        );
      }
    },
    [slug, router]
  );

  // On return from Paystack, verify automatically when a reference is present.
  // Otherwise surface any pending contribution saved before the redirect so the
  // visitor can complete verification manually.
  useEffect(() => {
    const reference =
      searchParams.get("reference") ?? searchParams.get("trxref");
    if (reference) {
      // Syncing with the payment gateway on return — an external system.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void runVerify(reference);
      return;
    }
    const saved = readPending();
    if (saved && saved.slug === slug) setPending(saved);
  }, [searchParams, slug, runVerify]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (status === "submitting") return;

      const trimmedName = name.trim();
      const numericAmount = parseFloat(amount);
      if (!trimmedName) {
        setError("Please enter your name.");
        return;
      }
      if (Number.isNaN(numericAmount) || numericAmount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }

      setStatus("submitting");
      setError("");
      try {
        const res = await initiateContribution(slug, {
          contributor_name: trimmedName,
          amount: numericAmount.toFixed(2),
          contributor_phone: phone.trim() || undefined,
          message: message.trim() || undefined,
        });

        const toSave: PendingContribution = {
          slug,
          reference: res.reference,
          name: trimmedName,
        };
        try {
          localStorage.setItem(PENDING_KEY, JSON.stringify(toSave));
        } catch {
          // ignore storage failures; auto-verify via query param still works
        }

        window.location.href = res.authorization_url;
      } catch (e) {
        setStatus("error");
        setError(
          e instanceof Error
            ? e.message
            : "Could not start the payment. Please try again."
        );
      }
    },
    [slug, name, amount, phone, message, status]
  );

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="bg-white rounded-[24px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center animate-bounce-in">
          <FaCheck size={24} className="text-white" />
        </div>
        <h3 className="font-serif text-2xl text-navy mb-2">Thank you! 🎉</h3>
        <p className="text-grey text-[15px]">
          Your contribution towards {productName} has been received.
        </p>
      </div>
    );
  }

  const quickAmounts = ["20", "50", "100", "200"];

  return (
    <div className="bg-white rounded-[24px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-8">
      <h3 className="font-serif text-2xl text-navy mb-1">Make a contribution</h3>
      <p className="text-grey text-[15px] mb-6">
        Chip in towards {productName} — every cedi helps.
      </p>

      {/* Pending-payment fallback (shown if a redirect happened but no reference
          came back in the URL). */}
      {pending && status !== "verifying" && (
        <div className="mb-6 rounded-2xl bg-coral/5 border border-coral/20 p-4">
          <p className="text-sm text-navy font-medium mb-3">
            Already paid on Paystack? Complete your contribution.
          </p>
          <button
            type="button"
            onClick={() => runVerify(pending.reference)}
            className="w-full bg-coral text-white py-3 rounded-full text-[15px] font-semibold hover:bg-coral-dark transition-all cursor-pointer"
          >
            I&apos;ve completed payment
          </button>
        </div>
      )}

      {status === "verifying" && (
        <div className="mb-6 rounded-2xl bg-coral/5 border border-coral/20 p-4 text-center">
          <p className="text-sm text-navy font-medium">
            Verifying your payment…
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Your name <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ama Mensah"
            className="w-full px-4 py-3 rounded-xl text-[15px] text-navy bg-bg border border-black/[0.08] outline-none placeholder:text-grey-light focus:border-coral transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Amount (₵) <span className="text-coral">*</span>
          </label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 rounded-xl text-[15px] text-navy bg-bg border border-black/[0.08] outline-none placeholder:text-grey-light focus:border-coral transition-colors"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {quickAmounts.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                  amount === q
                    ? "bg-coral text-white border-coral"
                    : "bg-white text-grey border-black/[0.1] hover:border-coral hover:text-coral"
                }`}
              >
                ₵{q}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Phone <span className="text-grey-light font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0541234567"
            className="w-full px-4 py-3 rounded-xl text-[15px] text-navy bg-bg border border-black/[0.08] outline-none placeholder:text-grey-light focus:border-coral transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">
            Message{" "}
            <span className="text-grey-light font-normal">(optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a kind word…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-[15px] text-navy bg-bg border border-black/[0.08] outline-none placeholder:text-grey-light focus:border-coral transition-colors resize-none"
          />
        </div>

        {error && <p className="text-sm text-coral-dark">{error}</p>}

        <button
          type="submit"
          disabled={status === "submitting" || status === "verifying"}
          className="w-full inline-flex items-center justify-center gap-2 bg-coral text-white py-4 rounded-full text-base font-bold hover:bg-coral-dark hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <FaHeart size={16} />
          {status === "submitting" ? "Redirecting to Paystack…" : "Contribute"}
        </button>
        <p className="text-center text-xs text-grey-light">
          Secure payment powered by Paystack.
        </p>
      </form>
    </div>
  );
}

export function ContributeForm(props: ContributeFormProps) {
  return (
    <Suspense fallback={null}>
      <ContributeFormInner {...props} />
    </Suspense>
  );
}
