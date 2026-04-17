"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminCreateCar, adminUpdateCar } from "@/actions/admin.actions";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { Car } from "@prisma/client";

interface Props {
  car?: Car;
}

const defaultForm = {
  name: "",
  brand: "",
  category: "ECONOMY",
  pricePerDay: "",
  location: "",
  seats: "5",
  transmission: "AUTOMATIC",
  fuelType: "PETROL",
  description: "",
  images: [] as string[],
  available: true,
  featured: false,
};

export default function CarForm({ car }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState(
    car
      ? {
          ...car,
          pricePerDay: String(car.pricePerDay),
          seats: String(car.seats),
        }
      : defaultForm
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const payload = {
        ...form,
        pricePerDay: Number(form.pricePerDay),
        seats: Number(form.seats),
      };

      const result = car
        ? await adminUpdateCar(car.id, payload)
        : await adminCreateCar(payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(car ? "Car updated" : "Car added to fleet");
      router.push("/admin/cars");
      router.refresh();
    });
  };

  const field = (
    label: string,
    name: string,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        placeholder={placeholder}
        value={(form as any)[name]}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );

  const selectField = (
    label: string,
    name: string,
    options: string[]
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <select
        name={name}
        value={(form as any)[name]}
        onChange={handleChange}
        className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {field("Brand", "brand", "text", "e.g. Toyota")}
        {field("Model name", "name", "text", "e.g. Prado 150")}
        {field("Price per day (KES)", "pricePerDay", "number", "e.g. 9500")}
        {field("Seats", "seats", "number", "e.g. 5")}
        {field("Location", "location", "text", "e.g. Nairobi")}
        {selectField("Category", "category", [
          "ECONOMY", "SUV", "LUXURY", "ELECTRIC", "VAN", "PICKUP",
        ])}
        {selectField("Transmission", "transmission", ["AUTOMATIC", "MANUAL"])}
        {selectField("Fuel type", "fuelType", [
          "PETROL", "DIESEL", "ELECTRIC", "HYBRID",
        ])}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Brief description of the vehicle..."
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          Car images
        </label>

        {form.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Car image ${i + 1}`}
                  className="w-20 h-16 object-cover rounded-lg border border-gray-100"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, idx) => idx !== i),
                    }))
                  }
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <UploadButton
          endpoint="carImageUploader"
          onClientUploadComplete={(res) => {
            const urls = res.map((f) => f.url);
            setForm((prev) => ({
              ...prev,
              images: [...prev.images, ...urls],
            }));
            toast.success(`${res.length} image(s) uploaded`);
          }}
          onUploadError={(err) => {
            toast.error(err.message);
          }}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { name: "available", label: "Available for hire" },
          { name: "featured", label: "Featured on homepage" },
        ].map(({ name, label }) => (
          <label
            key={name}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <input
              type="checkbox"
              name={name}
              checked={(form as any)[name]}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          {isPending
            ? "Saving..."
            : car
            ? "Update vehicle"
            : "Add to fleet"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-xl transition-colors text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}