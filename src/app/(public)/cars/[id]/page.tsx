import { getCarById, getUnavailableDates } from "@/actions/car.actions";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

const specLabel: Record<string, string> = {
  AUTOMATIC: "Automatic",
  MANUAL: "Manual",
  PETROL: "Petrol",
  DIESEL: "Diesel",
  ELECTRIC: "Electric",
  HYBRID: "Hybrid",
};

export default async function CarDetailPage({ params }: Props) {
  // 1. Await the params object first!
  const { id } = await params; 

  // 2. Now 'id' is a string, not undefined
  const car = await getCarById(id);
  
  if (!car) notFound();

  const unavailableDates = await getUnavailableDates(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — image */}
          <div className="rounded-2xl overflow-hidden bg-white border border-gray-100 aspect-video flex items-center justify-center">
            <img
              src={car.images[0] ?? "/cars/placeholder.jpg"}
              alt={`${car.brand} ${car.name}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right — details */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest">
                {car.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {car.brand} {car.name}
              </h1>
              <p className="text-gray-500 mt-2 leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Location", value: car.location },
                { label: "Seats", value: `${car.seats} passengers` },
                { label: "Transmission", value: specLabel[car.transmission] },
                { label: "Fuel type", value: specLabel[car.fuelType] },
              ].map((spec) => (
                <div
                  key={spec.label}
                  className="bg-white rounded-xl border border-gray-100 px-4 py-3"
                >
                  <p className="text-xs text-gray-400">{spec.label}</p>
                  <p className="text-sm font-medium text-gray-800 mt-0.5">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Price per day</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {car.pricePerDay.toLocaleString()}
                </p>
              </div>
              <div className="text-xs text-gray-400 text-right">
                <p>Insurance included</p>
                <p>Free cancellation</p>
              </div>
            </div>

            {/* Book button — will wire up in Phase 3 */}
            
            <a href={`/booking/${car.id}`}
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-xl transition-colors"
            >
              Book this vehicle
            </a>

            {/* Availability note */}
            {unavailableDates.length > 0 && (
              <p className="text-xs text-gray-400 text-center">
                {unavailableDates.length} date range(s) already booked
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}