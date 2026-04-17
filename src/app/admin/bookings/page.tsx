import { adminGetAllBookings } from "@/actions/admin.actions";
import AdminBookingRow from "@/components/admin/AdminBookingRow";
import Link from "next/link";

const statuses = ["ALL", "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

interface Props {
  searchParams: { status?: string };
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const status =
    searchParams.status && searchParams.status !== "ALL"
      ? searchParams.status
      : undefined;

  const bookings = await adminGetAllBookings(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-500 mt-1">
          {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {statuses.map((s) => {
          const active = (searchParams.status ?? "ALL") === s;
          return (
            <Link
              key={s}
              href={`/admin/bookings${s !== "ALL" ? `?status=${s}` : ""}`}
              className={`text-xs font-medium px-3.5 py-2 rounded-xl transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Vehicle</div>
          <div className="col-span-2">Dates</div>
          <div className="col-span-1">Amount</div>
          <div className="col-span-1">Payment</div>
          <div className="col-span-2">Status</div>
        </div>
        <div className="divide-y divide-gray-50">
          {bookings.length === 0 ? (
            <p className="px-5 py-10 text-sm text-gray-400 text-center">
              No bookings found
            </p>
          ) : (
            bookings.map((booking) => (
              <AdminBookingRow key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}