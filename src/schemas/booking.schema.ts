import { z } from "zod";

export const createBookingSchema = z.object({
  carId: z.string().min(1, "Car is required"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine((d) => new Date(d) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Start date cannot be in the past",
    }),
  endDate: z.string().min(1, "End date is required"),
  withDriver: z.boolean().default(false),
  notes: z.string().optional(),
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);

export const initiatePaymentSchema = z.object({
  bookingId: z.string().min(1),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^(0|254|\+254)[17]\d{8}$/, "Enter a valid Safaricom number"),
});


export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;