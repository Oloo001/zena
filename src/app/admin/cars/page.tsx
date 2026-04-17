import { adminGetAllCars } from "@/actions/admin.actions";
import AdminCarRow from "@/components/admin/AdminCarRow";
import Link from "next/link";

export default async function AdminCarsPage() {
  const cars = await adminGetAllCars();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet</h1>
          <p className="text-sm text-gray-500 mt-1">
            {cars.length} vehicle{cars.length !== 1 ? "s" : ""} in fleet
          </p>
        </div>
        <Link
          href="/admin/cars/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          + Add vehicle
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-4">Vehicle</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Price/day</div>
          <div className="col-span-1">Bookings</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <div className="divide-y divide-gray-50">
          {cars.length === 0 ? (
            <p className="px-5 py-10 text-sm text-gray-400 text-center">
              No cars in fleet yet.{" "}
              <Link href="/admin/cars/new" className="text-indigo-600 hover:underline">
                Add one →
              </Link>
            </p>
          ) : (
            cars.map((car) => <AdminCarRow key={car.id} car={car} />)
          )}
        </div>
      </div>
    </div>
  );
}