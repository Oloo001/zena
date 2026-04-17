import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[M-Pesa Callback]", JSON.stringify(body, null, 2));

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Find the payment by checkoutRequestId
    const payment = await prisma.payment.findFirst({
      where: { checkoutRequestId: CheckoutRequestID },
    });

    if (!payment) {
      console.error("[M-Pesa Callback] Payment not found:", CheckoutRequestID);
      return NextResponse.json({ received: true });
    }

    // ── Payment SUCCESS ──────────────────────────────────────
    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item ?? [];

      const getMeta = (name: string) =>
        items.find((i: any) => i.Name === name)?.Value ?? null;

      const mpesaReceipt = getMeta("MpesaReceiptNumber");
      const amount = getMeta("Amount");
      const phoneNumber = getMeta("PhoneNumber");

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "SUCCESS",
            mpesaReceipt,
          },
        }),
        prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: "CONFIRMED" },
        }),
      ]);

      console.log(
        `[M-Pesa Callback] Payment SUCCESS — Receipt: ${mpesaReceipt}, Amount: ${amount}`
      );
    }

    // ── Payment FAILED or CANCELLED ──────────────────────────
    if (ResultCode !== 0) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      console.log(`[M-Pesa Callback] Payment FAILED — ${ResultDesc}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[M-Pesa Callback] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}