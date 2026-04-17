"use server";

import { prisma } from "@/lib/prisma";
import { CarFilter } from "@/schemas/car.schema";

export async function getCars(filters: CarFilter = {}) {
  const { location, category, minPrice, maxPrice } = filters;

  return prisma.car.findMany({
    where: {
      available: true,
      ...(location && { location }),
      ...(category && { category: category as any }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            pricePerDay: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getCarById(id: string) {
  return prisma.car.findUnique({
    where: { id },
  });
}

export async function getFeaturedCars() {
  return prisma.car.findMany({
    where: { featured: true, available: true },
    take: 3,
  });
}

export async function getUnavailableDates(carId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      carId,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { startDate: true, endDate: true },
  });
  return bookings;
}