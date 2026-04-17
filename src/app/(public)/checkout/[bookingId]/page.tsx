import { getBookingById } from "@/actions/booking.actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { formatPrice, formatDate, getDaysBetween } from "@/lib/dates";
import PaymentForm from "@/components/booking/PaymentForm";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ bookingId: string }>;
}

export default async function CheckoutPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { bookingId } = await params;

  const booking = await getBookingById(bookingId, session.user.id);
  if (!booking) notFound();

  // Already paid — redirect to dashboard
  if (booking.status === "CONFIRMED") {
    redirect("/dashboard/bookings");
  }

  // Get user phone for pre-fill
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { phone: true },
  });

  const days = getDaysBetween(
    new Date(booking.startDate),
    new Date(booking.endDate)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete payment</h1>
          <p className="text-sm text-gray-500 mt-1">
            Pay securely via M-Pesa to confirm your booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Payment form — left */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-5">
                Payment details
              </h2>
              <PaymentForm
                bookingId={booking.id}
                userId={session.user.id}
                totalPrice={booking.totalPrice}
                userPhone={user?.phone}
              />
            </div>
          </div>

          {/* Order summary — right */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                Order summary
              </h3>

              <img
                src={booking.car.images[0] ?? "/cars/placeholder.jpg"}
                alt={booking.car.name}
                className="w-full h-32 object-cover rounded-xl mb-4"
              />

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle</span>
                  <span className="font-medium">
                    {booking.car.brand} {booking.car.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pick-up</span>
                  <span className="font-medium">
                    {formatDate(booking.startDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Return</span>
                  <span className="font-medium">
                    {formatDate(booking.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">
                    {days} day{days !== 1 ? "s" : ""}
                  </span>
                </div>
                {booking.withDriver && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver</span>
                    <span className="font-medium text-green-600">
                      Included
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-900 pt-2.5 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(booking.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              {[
                "Payments processed by Safaricom M-Pesa",
                "Booking confirmed instantly on payment",
                "Receipt sent to your phone",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2 text-xs text-gray-500"
                >
                  <span className="text-green-500 mt-0.5">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}