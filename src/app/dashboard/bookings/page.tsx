import { getUserBookings } from "@/actions/booking.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formatDate, formatPrice } from "@/lib/dates";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-gray-100 text-gray-600",
};

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const bookings = await getUserBookings(session.user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400 text-lg">No bookings yet</p>
            <Link
              href="/cars"
              className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
            >
              Browse available vehicles →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5 items-start"
              >
                {/* Car image */}
                <img
                  src={booking.car.images[0] ?? "/cars/placeholder.jpg"}
                  alt={booking.car.name}
                  className="w-24 h-20 object-cover rounded-xl shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {booking.car.brand} {booking.car.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                        statusStyles[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(booking.totalPrice)}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        View details
                      </Link>
                      {booking.status === "PENDING" && (
                        <Link
                          href={`/checkout/${booking.id}`}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                        >
                          Pay now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}