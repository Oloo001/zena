import { adminGetAllPayments } from "@/actions/admin.actions";
import { formatPrice, formatDate } from "@/lib/dates";

export default async function AdminPaymentsPage() {
  const payments = await adminGetAllPayments();

  const totalSuccess = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">
          {payments.length} transaction{payments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total collected",
            value: formatPrice(totalSuccess),
            color: "text-green-600",
          },
          {
            label: "Successful",
            value: payments.filter((p) => p.status === "SUCCESS").length,
            color: "text-gray-900",
          },
          {
            label: "Failed / pending",
            value: payments.filter((p) => p.status !== "SUCCESS").length,
            color: "text-red-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-3">Customer</div>
          <div className="col-span-2">Vehicle</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">M-Pesa receipt</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2">Date</div>
        </div>

        <div className="divide-y divide-gray-50">
          {payments.length === 0 ? (
            <p className="px-5 py-10 text-sm text-gray-400 text-center">
              No payments yet
            </p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-gray-50 text-sm"
              >
                <div className="col-span-3 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {payment.booking.user.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {payment.phone}
                  </p>
                </div>
                <div className="col-span-2 text-xs text-gray-600 truncate">
                  {payment.booking.car.brand} {payment.booking.car.name}
                </div>
                <div className="col-span-2 font-semibold text-gray-900">
                  {formatPrice(payment.amount)}
                </div>
                <div className="col-span-2">
                  {payment.mpesaReceipt ? (
                    <span className="font-mono text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      {payment.mpesaReceipt}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </div>
                <div className="col-span-1">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      payment.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-gray-500">
                  {formatDate(payment.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}