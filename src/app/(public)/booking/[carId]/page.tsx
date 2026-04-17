import { getCarById, getUnavailableDates } from "@/actions/car.actions";
import BookingForm from "@/components/booking/BookingForm";
import { notFound, redirect } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Props {
  params: Promise<{ carId: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { carId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    // 3. Use the unwrapped carId here
    redirect(`/login?callbackUrl=/booking/${carId}`);
  }

  const car = await getCarById(carId);
  if (!car) notFound();

  const unavailableDates = await getUnavailableDates(carId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete your booking</h1>
          <p className="text-gray-500 mt-1 text-sm">
            You're booking the {car.brand} {car.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form — left */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Booking details</h2>
              <BookingForm car={car} userId={session.user.id} />
            </div>
          </div>

          {/* Car summary — right */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <img
                src={car.images[0] ?? "/cars/placeholder.jpg"}
                alt={car.name}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
              <p className="text-xs text-indigo-600 font-medium">{car.category}</p>
              <h3 className="font-semibold text-gray-900 mt-0.5">
                {car.brand} {car.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{car.location}</p>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">From</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(car.pricePerDay)}
                  <span className="text-sm font-normal text-gray-400"> / day</span>
                </p>
              </div>
            </div>

            {/* Already booked dates */}
            {unavailableDates.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
                <p className="text-xs font-medium text-amber-700 mb-2">
                  Unavailable dates
                </p>
                <ul className="space-y-1">
                  {unavailableDates.map((d, i) => (
                    <li key={i} className="text-xs text-amber-600">
                      {formatDate(d.startDate)} → {formatDate(d.endDate)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policy */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
              {["Free cancellation up to 24h before", "Insurance included", "24/7 roadside support"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-green-500">✓</span>
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