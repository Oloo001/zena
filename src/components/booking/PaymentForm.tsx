"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initiatePayment, pollPaymentStatus, checkStkStatus } from "@/actions/payment.actions";
import toast from "react-hot-toast";

interface Props {
  bookingId: string;
  userId: string;
  totalPrice: number;
  userPhone?: string | null;
}

type Step = "form" | "waiting" | "success" | "failed";

export default function PaymentForm({
  bookingId,
  userId,
  totalPrice,
  userPhone,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState(userPhone ?? "");
  const [step, setStep] = useState<Step>("form");
  const [receipt, setReceipt] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // ── Auto-poll after STK push ─────────────────────────────
  const poll = useCallback(async () => {
    const result = await pollPaymentStatus(bookingId, userId);

    if (result.status === "SUCCESS") {
      setReceipt(result.mpesaReceipt ?? null);
      setStep("success");
      return true;
    }

    if (result.status === "FAILED") {
      setStep("failed");
      return true;
    }

    return false;
  }, [bookingId, userId]);

  useEffect(() => {
    if (step !== "waiting") return;

    const MAX_POLLS = 12; // 60 seconds
    let count = 0;

    const interval = setInterval(async () => {
      count++;
      setPollCount(count);

      const done = await poll();
      if (done || count >= MAX_POLLS) {
        clearInterval(interval);
        if (count >= MAX_POLLS && step === "waiting") {
          toast.error("Payment timed out. Use 'Check status' to verify.");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [step, poll]);

  // ── Submit STK Push ──────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await initiatePayment(userId, { bookingId, phone });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setStep("waiting");
      toast.success("Check your phone — M-Pesa prompt sent!");
    });
  };

  // ── Manual status check ──────────────────────────────────
  const handleManualCheck = () => {
    startTransition(async () => {
      const result = await checkStkStatus(bookingId, userId);

      if (result.status === "SUCCESS") {
        setStep("success");
        toast.success("Payment confirmed!");
      } else if (result.status === "CANCELLED") {
        setStep("failed");
        toast.error("Payment was cancelled.");
      } else {
        toast("Payment still pending. Try again in a moment.");
      }
    });
  };

  // ── Retry ────────────────────────────────────────────────
  const handleRetry = () => {
    setStep("form");
    setPollCount(0);
  };

  // ── SUCCESS state ────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment confirmed!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Your booking is now confirmed.
          </p>
        </div>
        {receipt && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-xs text-green-600 mb-1">M-Pesa receipt</p>
            <p className="font-mono text-sm font-semibold text-green-800">
              {receipt}
            </p>
          </div>
        )}
        <button
          onClick={() => router.push("/dashboard/bookings")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          View my bookings
        </button>
      </div>
    );
  }

  // ── FAILED state ─────────────────────────────────────────
  if (step === "failed") {
    return (
      <div className="text-center space-y-5">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">✕</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Payment failed</h2>
          <p className="text-sm text-gray-500 mt-1">
            The payment was not completed. You can try again.
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Try again
        </button>
        
        <a href="/dashboard/bookings"
          className="block text-sm text-gray-400 hover:text-gray-600"
        >
          Back to my bookings
        </a>
      </div>
    );
  }

  // ── WAITING state ────────────────────────────────────────
  if (step === "waiting") {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-indigo-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Waiting for payment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your M-Pesa PIN on your phone to complete payment.
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i < pollCount ? "bg-indigo-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400">
          Checking every 5 seconds — {Math.max(0, 60 - pollCount * 5)}s remaining
        </p>

        <button
          onClick={handleManualCheck}
          disabled={isPending}
          className="w-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {isPending ? "Checking..." : "Check payment status"}
        </button>

        <button
          onClick={handleRetry}
          className="block w-full text-sm text-gray-400 hover:text-gray-600"
        >
          Cancel and re-enter phone number
        </button>
      </div>
    );
  }

  // ── FORM state ───────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
        <span className="text-2xl">📱</span>
        <div>
          <p className="text-sm font-medium text-green-800">Pay via M-Pesa</p>
          <p className="text-xs text-green-600 mt-0.5">
            You will receive an STK push prompt on your phone
          </p>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          M-Pesa phone number
        </label>
        <input
          type="tel"
          required
          placeholder="0712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          Safaricom numbers only (07xx or 01xx)
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-600">Amount to pay</span>
        <span className="text-lg font-bold text-gray-900">
          KES {totalPrice.toLocaleString()}
        </span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors"
      >
        {isPending ? "Sending prompt..." : `Pay KES ${totalPrice.toLocaleString()} via M-Pesa`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        A payment request will be sent to your phone.
        Enter your M-Pesa PIN to confirm.
      </p>
    </form>
  );
}