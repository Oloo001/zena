import { getBookingById } from "@/actions/booking.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { formatDate, formatPrice, getDaysBetween } from "@/lib/dates";
import CancelBookingButton from "@/components/booking/CancelBookingButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const booking = await getBookingById(id, session.user.id);
  if (!booking) notFound();

  const days = getDaysBetween(new Date(booking.startDate), new Date(booking.endDate));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
        <h1 className="text-2xl font-bold text-gray-900">Booking details</h1>

        {/* Car */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
          <img
            src={booking.car.images[0] ?? "/cars/placeholder.jpg"}
            alt={booking.car.name}
            className="w-28 h-24 object-cover rounded-xl"
          />
          <div>
            <p className="font-semibold text-gray-900">
              {booking.car.brand} {booking.car.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">{booking.car.location}</p>
            <p className="text-xs text-gray-400 mt-0.5">{booking.car.category}</p>
          </div>
        </div>

        {/* Booking info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 text-sm">
          {[
            { label: "Booking ID", value: booking.id },
            { label: "Status", value: booking.status },
            { label: "Pick-up", value: formatDate(booking.startDate) },
            { label: "Return", value: formatDate(booking.endDate) },
            { label: "Duration", value: `${days} day${days !== 1 ? "s" : ""}` },
            { label: "Driver included", value: booking.withDriver ? "Yes" : "No" },
            { label: "Total price", value: formatPrice(booking.totalPrice) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900 text-right max-w-xs truncate">
                {value}
              </span>
            </div>
          ))}

          {booking.notes && (
            <div className="pt-3 border-t border-gray-50">
              <p className="text-gray-500 text-xs mb-1">Notes</p>
              <p className="text-gray-700 text-sm">{booking.notes}</p>
            </div>
          )}
        </div>

        {/* Payment status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
        <p className="font-medium text-gray-900 mb-3">Payment</p>
        {booking.payment ? (
        <div className="space-y-2.5">
        <div className="flex justify-between">
        <span className="text-gray-500">Status</span>
        <span
          className={`font-medium ${
            booking.payment.status === "SUCCESS"
              ? "text-green-600"
              : booking.payment.status === "FAILED"
              ? "text-red-500"
              : "text-yellow-600"
          }`}
        >
          {booking.payment.status}
        </span>
        </div>
        <div className="flex justify-between">
        <span className="text-gray-500">Amount</span>
        <span className="font-medium">
          {formatPrice(booking.payment.amount)}
        </span>
        </div>
        <div className="flex justify-between">
        <span className="text-gray-500">Phone</span>
        <span className="font-medium">{booking.payment.phone}</span>
        </div>
        {booking.payment.mpesaReceipt && (
        <div className="flex justify-between">
          <span className="text-gray-500">M-Pesa receipt</span>
          <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
            {booking.payment.mpesaReceipt}
          </span>
        </div>
        )}
        </div>
        ) : (
        <p className="text-gray-400 text-xs">No payment recorded yet.</p>
        )}
        </div>


        {/* Actions */}
        <div className="flex gap-3">
          {booking.status === "PENDING" && (
            
            <a href={`/checkout/${booking.id}`}
              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl text-sm transition-colors"
            >
              Pay now via M-Pesa
            </a>
          )}
          {["PENDING", "CONFIRMED"].includes(booking.status) && (
            <CancelBookingButton bookingId={booking.id} />
          )}
        </div>
      </div>
    </div>
  );
}