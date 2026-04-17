"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Car } from "@prisma/client";
import { createBooking } from "@/actions/booking.actions";
import {
  getTodayInputValue,
  getTomorrowInputValue,
  getDaysBetween,
  formatPrice,
} from "@/lib/dates";
import toast from "react-hot-toast";

interface Props {
  car: Car;
  userId: string;
}

export default function BookingForm({ car, userId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [startDate, setStartDate] = useState(getTodayInputValue());
  const [endDate, setEndDate] = useState(getTomorrowInputValue());
  const [withDriver, setWithDriver] = useState(false);
  const [notes, setNotes] = useState("");

  const days = startDate && endDate
    ? getDaysBetween(new Date(startDate), new Date(endDate))
    : 0;

  const driverFee = withDriver ? 1500 * days : 0;
  const subtotal = car.pricePerDay * days;
  const total = subtotal + driverFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createBooking(userId, {
        carId: car.id,
        startDate,
        endDate,
        withDriver,
        notes,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Booking created! Proceed to payment.");
      router.push(`/checkout/${result.bookingId}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Pick-up date
          </label>
          <input
            type="date"
            required
            min={getTodayInputValue()}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Return date
          </label>
          <input
            type="date"
            required
            min={startDate}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* With driver toggle */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Add a driver</p>
          <p className="text-xs text-gray-400 mt-0.5">KES 1,500 extra per day</p>
        </div>
        <button
          type="button"
          onClick={() => setWithDriver(!withDriver)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            withDriver ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              withDriver ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          Special requests (optional)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any notes for the hire team..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Price breakdown */}
      {days > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>
              {formatPrice(car.pricePerDay)} × {days} day{days !== 1 ? "s" : ""}
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {withDriver && (
            <div className="flex justify-between text-gray-600">
              <span>Driver fee × {days} days</span>
              <span>{formatPrice(driverFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || days <= 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors"
      >
        {isPending ? "Creating booking..." : `Confirm booking — ${formatPrice(total)}`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        No payment yet. You will pay via M-Pesa on the next step.
      </p>
    </form>
  );
}