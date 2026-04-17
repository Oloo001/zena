import Link from "next/link";
import { Car } from "@prisma/client";

interface Props {
  car: Car;
}

const categoryColors: Record<string, string> = {
  ECONOMY: "bg-green-100 text-green-800",
  SUV: "bg-orange-100 text-orange-800",
  LUXURY: "bg-purple-100 text-purple-800",
  ELECTRIC: "bg-blue-100 text-blue-800",
  VAN: "bg-yellow-100 text-yellow-800",
  PICKUP: "bg-red-100 text-red-800",
};

export default function CarCard({ car }: Props) {
  return (
    <Link href={`/cars/${car.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-gray-50 overflow-hidden">
          <img
            src={car.images[0] ?? "/cars/placeholder.jpg"}
            alt={`${car.brand} ${car.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span
            className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${
              categoryColors[car.category] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {car.category}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-0.5">{car.brand}</p>
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            {car.name}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span>{car.seats} seats</span>
            <span>{car.transmission}</span>
            <span>{car.fuelType}</span>
            <span>{car.location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div>
              <span className="text-lg font-bold text-gray-900">
                KES {car.pricePerDay.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400"> / day</span>
            </div>
            <span className="text-xs font-medium text-indigo-600 group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}