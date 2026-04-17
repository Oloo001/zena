"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminUpdateBookingStatus } from "@/actions/admin.actions";
import { formatPrice, formatDate } from "@/lib/dates";
import toast from "react-hot-toast";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-gray-100 text-gray-600",
};

const nextStatus: Record<string, string> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "COMPLETED",
};

interface Props {
  booking: any;
}

export default function AdminBookingRow({ booking }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusUpdate = (status: any) => {
    startTransition(async () => {
      await adminUpdateBookingStatus(booking.id, status);
      toast.success(`Booking marked as ${status}`);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50 transition-colors text-sm">

      {/* Customer */}
      <div className="col-span-3 min-w-0">
        <p className="font-medium text-gray-900 truncate">{booking.user.name}</p>
        <p className="text-xs text-gray-400 truncate">{booking.user.email}</p>
      </div>

      {/* Vehicle */}
      <div className="col-span-3 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {booking.car.brand} {booking.car.name}
        </p>
        <p className="text-xs text-gray-400">{booking.car.location}</p>
      </div>

      {/* Dates */}
      <div className="col-span-2 text-xs text-gray-500">
        <p>{formatDate(booking.startDate)}</p>
        <p>{formatDate(booking.endDate)}</p>
      </div>

      {/* Amount */}
      <div className="col-span-1 font-semibold text-gray-900 text-xs">
        {formatPrice(booking.totalPrice)}
      </div>

      {/* Payment */}
      <div className="col-span-1">
        {booking.payment ? (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              booking.payment.status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : booking.payment.status === "FAILED"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {booking.payment.status}
          </span>
        ) : (
          <span className="text-xs text-gray-400">None</span>
        )}
      </div>

      {/* Status + actions */}
      <div className="col-span-2 flex items-center gap-2">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            statusStyles[booking.status]
          }`}
        >
          {booking.status}
        </span>
        {nextStatus[booking.status] && (
          <button
            onClick={() => handleStatusUpdate(nextStatus[booking.status])}
            disabled={isPending}
            className="text-xs text-indigo-600 hover:underline disabled:opacity-40"
          >
            → {nextStatus[booking.status]}
          </button>
        )}
      </div>
    </div>
  );
}