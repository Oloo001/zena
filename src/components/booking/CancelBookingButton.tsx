"use client";

import { useTransition } from "react";
import { cancelBooking } from "@/actions/booking.actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Props {
  bookingId: string;
}

export default function CancelBookingButton({ bookingId }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    startTransition(async () => {
      const result = await cancelBooking(bookingId, session?.user?.id ?? "");
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Booking cancelled.");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="flex-1 text-center border border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
    >
      {isPending ? "Cancelling..." : "Cancel booking"}
    </button>
  );
}