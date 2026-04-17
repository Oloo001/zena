"use server";

import { prisma } from "@/lib/prisma";
import { createBookingSchema, CreateBookingInput } from "@/schemas/booking.schema";
import { revalidatePath } from "next/cache";

// ── Conflict check ──────────────────────────────────────────
export async function checkDateConflict(
  carId: string,
  startDate: Date,
  endDate: Date,
  excludeBookingId?: string
) {
  const conflict = await prisma.booking.findFirst({
    where: {
      carId,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(excludeBookingId && { id: { not: excludeBookingId } }),
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } },
      ],
    },
  });
  return !!conflict;
}

// ── Calculate total price ───────────────────────────────────
export async function calculatePrice(
  carId: string,
  startDate: Date,
  endDate: Date,
  withDriver: boolean
) {
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) throw new Error("Car not found");

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const driverFee = withDriver ? 1500 * days : 0;
  const total = car.pricePerDay * days + driverFee;

  return { days, pricePerDay: car.pricePerDay, driverFee, total };
}

// ── Create booking ──────────────────────────────────────────
export async function createBooking(
  userId: string,
  input: CreateBookingInput
) {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { carId, startDate, endDate, withDriver, notes } = parsed.data;
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check car exists and is available
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) return { error: "Car not found" };
  if (!car.available) return { error: "This car is not available for hire" };

  // Check date conflict
  const hasConflict = await checkDateConflict(carId, start, end);
  if (hasConflict) {
    return { error: "These dates are already booked. Please choose different dates." };
  }

  // Calculate price
  const { total } = await calculatePrice(carId, start, end, withDriver);

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      userId,
      carId,
      startDate: start,
      endDate: end,
      totalPrice: total,
      withDriver,
      notes,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard/bookings");
  return { success: true, bookingId: booking.id };
}

// ── Get bookings for a user ─────────────────────────────────
export async function getUserBookings(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    include: { car: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

// ── Get single booking ──────────────────────────────────────
export async function getBookingById(bookingId: string, userId: string) {
  return prisma.booking.findFirst({
    where: { id: bookingId, userId },
    include: { car: true, payment: true },
  });
}

// ── Cancel booking ──────────────────────────────────────────
export async function cancelBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId },
  });

  if (!booking) return { error: "Booking not found" };
  if (booking.status === "CONFIRMED") {
    return { error: "Confirmed bookings cannot be cancelled. Please contact support." };
  }
  if (booking.status === "CANCELLED") {
    return { error: "Booking is already cancelled" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/dashboard/bookings");
  return { success: true };
}