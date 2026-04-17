"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  adminDeleteCar,
  adminToggleCarAvailability,
} from "@/actions/admin.actions";
import { formatPrice } from "@/lib/dates";
import Link from "next/link";
import toast from "react-hot-toast";
import { Car } from "@prisma/client";

interface Props {
  car: Car & { _count: { bookings: number } };
}

export default function AdminCarRow({ car }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (!confirm(`Delete ${car.brand} ${car.name}? This cannot be undone.`))
      return;
    startTransition(async () => {
      const result = await adminDeleteCar(car.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Car deleted");
      router.refresh();
    });
  };

  const handleToggle = () => {
    startTransition(async () => {
      await adminToggleCarAvailability(car.id);
      router.refresh();
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors">

      {/* Vehicle */}
      <div className="col-span-4 flex items-center gap-3">
        <img
          src={car.images[0] ?? "/cars/placeholder.jpg"}
          alt={car.name}
          className="w-12 h-9 object-cover rounded-lg shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {car.brand} {car.name}
          </p>
          <p className="text-xs text-gray-400 truncate">{car.location}</p>
        </div>
      </div>

      {/* Category */}
      <div className="col-span-2">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
          {car.category}
        </span>
      </div>

      {/* Price */}
      <div className="col-span-2 text-sm font-medium text-gray-900">
        {formatPrice(car.pricePerDay)}
      </div>

      {/* Bookings count */}
      <div className="col-span-1 text-sm text-gray-500">
        {car._count.bookings}
      </div>

      {/* Availability toggle */}
      <div className="col-span-1">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
            car.available
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
        >
          {car.available ? "Active" : "Hidden"}
        </button>
      </div>

      {/* Actions */}
      <div className="col-span-2 flex items-center justify-end gap-2">
        <Link
          href={`/admin/cars/${car.id}/edit`}
          className="text-xs text-indigo-600 hover:underline"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs text-red-500 hover:underline disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  );
}