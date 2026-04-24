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
    { label: "Total revenue", value: formatPrice(stats.totalRevenue), sub: "Confirmed" },
    { label: "Total bookings", value: stats.totalBookings, sub: `${stats.pendingBookings} pending` },
    { label: "Fleet size", value: stats.totalCars, sub: `${stats.availableCars} available` },
    { label: "Total users", value: stats.totalUsers, sub: "Registered" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-0">
      {/* Header - Left aligned on mobile, space between on desktop */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-sm text-gray-500">
          Welcome back <b>admin</b>. Here's your dashboard at a glance.
        </p>
      </div>

      {/* Stat cards - Grid optimized for small screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-100 p-4 md:p-5 shadow-sm"
          >
            <p className="text-[10px] md:text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-lg md:text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-[10px] md:text-xs text-gray-400 mt-1 truncate">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions - Larger touch targets for mobile */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/cars/new", label: "Add new car", color: "bg-indigo-600 text-white shadow-md shadow-indigo-100" },
          { href: "/admin/bookings?status=PENDING", label: "Pending bookings", color: "bg-white text-yellow-700 border border-yellow-200" },
          { href: "/admin/payments", label: "View payments", color: "bg-white text-green-700 border border-green-200" },
          { href: "/admin/users", label: "Manage users", color: "bg-white text-gray-700 border border-gray-200" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`flex items-center justify-center text-center h-12 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${action.color}`}
          >
            {action.label}
          </Link>
        ))}
      </div>

      {/* Recent bookings - List view optimized for vertical stacking on mobile */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-base md:text-sm">
            Recent bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            See all →
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {stats.recentBookings.length === 0 ? (
            <p className="px-6 py-10 text-sm text-gray-400 text-center italic">
              No recent activity
            </p>
          ) : (
            stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {booking.user.name}
                    </p>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <p className="text-sm text-gray-600 truncate">
                      {booking.car.brand} {booking.car.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(booking.totalPrice)}
                  </span>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide uppercase ${
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