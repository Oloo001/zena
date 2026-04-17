import CarForm from "@/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add vehicle</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add a new car to the Zena fleet
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <CarForm />
      </div>
    </div>
  );
}