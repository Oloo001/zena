import { getCars } from "@/actions/car.actions";
import CarCard from "@/components/cars/CarCard";
import CarsFilter from "@/components/cars/CarsFilter";
import { Suspense } from "react";

interface Props {
  searchParams: {
    location?: string;
    category?: string;
    maxPrice?: string;
  };
}

  export default async function CarsPage({ searchParams }: Props) {
  // 2. Await the searchParams object
  const resolvedParams = await searchParams;

  // 3. Use the resolved values
  const cars = await getCars({
    location: resolvedParams.location,
    category: resolvedParams.category as any,
    maxPrice: resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : undefined,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our fleet</h1>
          <p className="text-gray-500 mt-1">
            {cars.length} vehicle{cars.length !== 1 ? "s" : ""} available
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar filter */}
          <aside className="w-full md:w-64 shrink-0">
            <Suspense>
              <CarsFilter />
            </Suspense>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {cars.length === 0 ? (
              <div className="text-center py-10 md:py-20 text-gray-400">
                <p className="text-lg">No vehicles match your filters.</p>
                <p className="text-sm mt-1">Try adjusting your search.</p>
              </div>
            ) : (
              /* Grid: 1 column on tiny phones, 2 on tablets, 3 on desktop */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}