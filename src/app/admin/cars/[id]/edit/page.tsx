import CarForm from "@/components/admin/CarForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: Props) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit vehicle</h1>
        <p className="text-sm text-gray-500 mt-1">
          {car.brand} {car.name}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <CarForm car={car} />
      </div>
    </div>
  );
}