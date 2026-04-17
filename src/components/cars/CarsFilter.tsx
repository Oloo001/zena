"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"];
const categories = ["ECONOMY", "SUV", "LUXURY", "ELECTRIC", "VAN", "PICKUP"];

export default function CarsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Local state for the price input to make it feel instant
  const [priceInput, setPriceInput] = useState(searchParams.get("maxPrice") ?? "");

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/cars?${params.toString()}`);
    },
    [router, searchParams]
  );

  // 2. Debounce logic for the price input
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentPrice = searchParams.get("maxPrice") ?? "";
      if (priceInput !== currentPrice) {
        updateFilter("maxPrice", priceInput);
      }
    }, 400); // 400ms delay is usually the "sweet spot" for typing

    return () => clearTimeout(timer);
  }, [priceInput, updateFilter, searchParams]);

  // 3. Sync local state if filters are cleared or changed elsewhere
  useEffect(() => {
    setPriceInput(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
      <h3 className="font-semibold text-gray-900 text-sm">Filter vehicles</h3>

      {/* Location */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Location
        </label>
        <select
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchParams.get("location") ?? ""}
          onChange={(e) => updateFilter("location", e.target.value)}
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                updateFilter(
                  "category",
                  searchParams.get("category") === cat ? "" : cat
                )
              }
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                searchParams.get("category") === cat
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Max price per day (KES)
        </label>
        <input
          type="number"
          placeholder="e.g. 10000"
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
      </div>

      {/* Clear */}
      <button
        onClick={() => router.push("/cars")}
        className="w-full text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2"
      >
        Clear all filters
      </button>
    </div>
  );
}