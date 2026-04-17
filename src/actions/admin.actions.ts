"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Schema ───────────────────────────────────────────────────
const carSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum(["ECONOMY", "SUV", "LUXURY", "ELECTRIC", "VAN", "PICKUP"]),
  pricePerDay: z.coerce.number().min(1, "Price must be greater than 0"),
  location: z.string().min(1, "Location is required"),
  seats: z.coerce.number().min(1).max(50),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// ── Dashboard stats ──────────────────────────────────────────
export async function getDashboardStats() {
  const [
    totalCars,
    availableCars,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalUsers,
    revenueResult,
    recentBookings,
  ] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { available: true } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { car: true, user: true, payment: true },
    }),
  ]);

  return {
    totalCars,
    availableCars,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    totalUsers,
    totalRevenue: revenueResult._sum.amount ?? 0,
    recentBookings,
  };
}

// ── Car CRUD ─────────────────────────────────────────────────
export async function adminGetAllCars() {
  return prisma.car.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });
}

export async function adminCreateCar(data: unknown) {
  const parsed = carSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const car = await prisma.car.create({ data: parsed.data });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  return { success: true, car };
}

export async function adminUpdateCar(id: string, data: unknown) {
  const parsed = carSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const car = await prisma.car.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  revalidatePath(`/cars/${id}`);
  return { success: true, car };
}

export async function adminDeleteCar(id: string) {
  const bookings = await prisma.booking.count({
    where: { carId: id, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  if (bookings > 0) {
    return { error: "Cannot delete a car with active bookings" };
  }
  await prisma.car.delete({ where: { id } });
  revalidatePath("/admin/cars");
  revalidatePath("/cars");
  return { success: true };
}

export async function adminToggleCarAvailability(id: string) {
  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) return { error: "Car not found" };
  await prisma.car.update({
    where: { id },
    data: { available: !car.available },
  });
  revalidatePath("/admin/cars");
  return { success: true };
}

// ── Booking management ───────────────────────────────────────
export async function adminGetAllBookings(status?: string) {
  return prisma.booking.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: "desc" },
    include: { car: true, user: true, payment: true },
  });
}

export async function adminUpdateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
) {
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
  revalidatePath("/admin/bookings");
  return { success: true };
}

// ── Users ────────────────────────────────────────────────────
export async function adminGetAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: { select: { bookings: true } },
    },
  });
}

export async function adminToggleUserRole(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "User not found" };
  const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });
  revalidatePath("/admin/users");
  return { success: true };
}

// ── Payments ─────────────────────────────────────────────────
export async function adminGetAllPayments() {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { booking: { include: { car: true, user: true } } },
  });
}