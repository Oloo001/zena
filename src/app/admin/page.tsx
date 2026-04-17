import { getDashboardStats } from "@/actions/admin.actions";
import { formatPrice, formatDate } from "@/lib/dates";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
  COMPLETED: "bg-gray-100 text-gray-600",
};

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Total revenue", value: formatPrice(stats.totalRevenue), sub: "Confirmed payments" },
    { label: "Total bookings", value: stats.totalBookings, sub: `${stats.pendingBookings} pending` },
    { label: "Fleet size", value: stats.totalCars, sub: `${stats.availableCars} available` },
    { label: "Total users", value: stats.totalUsers, sub: "Registered customers" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back <b>admin</b>. Here's what's happening with Zena.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/cars/new", label: "Add new car", color: "bg-indigo-600 text-white" },
          { href: "/admin/bookings?status=PENDING", label: "View pending bookings", color: "bg-yellow-50 text-yellow-700 border border-yellow-100" },
          { href: "/admin/payments", label: "View payments", color: "bg-green-50 text-green-700 border border-green-100" },
          { href: "/admin/users", label: "Manage users", color: "bg-gray-50 text-gray-700 border border-gray-100" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`text-center py-3 px-4 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs text-indigo-600 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recentBookings.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">
              No bookings yet
            </p>
          ) : (
            stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="px-6 py-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.user.name} — {booking.car.brand} {booking.car.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(booking.startDate)} →{" "}
                    {formatDate(booking.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(booking.totalPrice)}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      statusStyles[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}