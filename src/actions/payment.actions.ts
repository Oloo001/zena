"use server";

import { prisma } from "@/lib/prisma";
import { initiateStkPush, queryStkStatus, formatPhone } from "@/lib/mpesa";
import { initiatePaymentSchema } from "@/schemas/booking.schema";
import { revalidatePath } from "next/cache";

// ── Initiate STK Push ────────────────────────────────────────
export async function initiatePayment(
  userId: string,
  input: { bookingId: string; phone: string }
) {
  const parsed = initiatePaymentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { bookingId, phone } = parsed.data;

  // Verify booking belongs to user and is PENDING
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId, status: "PENDING" },
  });

  if (!booking) {
    return { error: "Booking not found or already paid" };
  }

  // Prevent duplicate payment records
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (existingPayment?.status === "SUCCESS") {
    return { error: "This booking has already been paid" };
  }

  try {
    const stkResponse = await initiateStkPush({
      phone,
      amount: booking.totalPrice,
      bookingId,
    });

    if (stkResponse.ResponseCode !== "0") {
      return { error: stkResponse.ResponseDescription ?? "STK Push failed" };
    }

    // Upsert payment record
    await prisma.payment.upsert({
      where: { bookingId },
      update: {
        phone: formatPhone(phone),
        checkoutRequestId: stkResponse.CheckoutRequestID,
        merchantRequestId: stkResponse.MerchantRequestID,
        status: "PENDING",
      },
      create: {
        bookingId,
        amount: booking.totalPrice,
        phone: formatPhone(phone),
        checkoutRequestId: stkResponse.CheckoutRequestID,
        merchantRequestId: stkResponse.MerchantRequestID,
        status: "PENDING",
      },
    });

    return {
      success: true,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      message: stkResponse.CustomerMessage,
    };
  } catch (err: any) {
    return { error: err.message ?? "Payment initiation failed" };
  }
}

// ── Poll payment status ──────────────────────────────────────
export async function pollPaymentStatus(bookingId: string, userId: string) {
  const payment = await prisma.payment.findFirst({
    where: { bookingId, booking: { userId } },
    include: { booking: true },
  });

  if (!payment) return { status: "NOT_FOUND" };

  return {
    status: payment.status,
    mpesaReceipt: payment.mpesaReceipt,
    bookingStatus: payment.booking.status,
  };
}

// ── Query STK status manually ────────────────────────────────
export async function checkStkStatus(
  bookingId: string,
  userId: string
) {
  const payment = await prisma.payment.findFirst({
    where: { bookingId, booking: { userId } },
  });

  if (!payment?.checkoutRequestId) {
    return { error: "No payment found" };
  }

  try {
    const result = await queryStkStatus(payment.checkoutRequestId);

    // ResultCode 0 = success
    if (result.ResultCode === "0" || result.ResultCode === 0) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { bookingId },
          data: { status: "SUCCESS" },
        }),
        prisma.booking.update({
          where: { id: bookingId },
          data: { status: "CONFIRMED" },
        }),
      ]);
      revalidatePath("/dashboard/bookings");
      return { status: "SUCCESS" };
    }

    if (result.ResultCode === "1032") {
      return { status: "CANCELLED", message: "Payment was cancelled by user" };
    }

    return { status: "PENDING", message: result.ResultDesc };
  } catch (err: any) {
    return { error: err.message };
  }
}