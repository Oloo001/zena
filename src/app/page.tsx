import { getFeaturedCars } from "@/actions/car.actions";
import CarCard from "@/components/cars/CarCard";
import Link from "next/link";

export default async function HomePage() {
  const featured = await getFeaturedCars();

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-indigo-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Kwa hakika, huu ndio uhuru wa usafiri. Test our wheeled beasts today.
          </h1>
          <p className="text-indigo-200 text-lg mb-10 max-w-xl mx-auto">
            Premium car hire across Kenya. Instant booking, transparent pricing,
            M-Pesa payments.
          </p>
          <Link
            href="/cars"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Book now →
          </Link>
        </div>
      </section>

      {/* Featured cars */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured vehicles</h2>
          <Link href="/cars" className="text-sm text-indigo-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-gray-50 border-t border-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: "280+", label: "Vehicles" },
            { num: "48", label: "Locations" },
            { num: "4.9★", label: "Avg rating" },
            { num: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-indigo-600">{stat.num}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}