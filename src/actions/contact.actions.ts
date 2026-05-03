"use server";

import { Resend } from "resend";
import { contactSchema, ContactInput } from "@/schemas/contact.schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const subjectLabels: Record<string, string> = {
  general: "General enquiry",
  booking: "Booking question",
  payment: "Payment issue",
  corporate: "Corporate hire",
  complaint: "Complaint",
  other: "Other",
};

export async function sendContactEmail(input: ContactInput) {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, phone, subject, message } = parsed.data;
  const subjectLabel = subjectLabels[subject];

  try {
    // ── Email to your support inbox ──────────────────────
    await resend.emails.send({
      from: "City Contact Form <noreply@car-hire-ltd.vercel.app>",
      to: "oloochino001@gmail.com",
      replyTo: email,
      subject: `[${subjectLabel}] Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;font-size:20px;margin:0;">New contact message</h1>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
            <table style="width:100%;font-size:14px;border-collapse:collapse;">
              <tr>
                <td style="color:#6b7280;padding:6px 0;width:120px;">Name</td>
                <td style="color:#111827;font-weight:500;">${name}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;padding:6px 0;">Email</td>
                <td style="color:#4F46E5;">${email}</td>
              </tr>
              ${phone ? `<tr><td style="color:#6b7280;padding:6px 0;">Phone</td><td style="color:#111827;">${phone}</td></tr>` : ""}
              <tr>
                <td style="color:#6b7280;padding:6px 0;">Subject</td>
                <td style="color:#111827;">${subjectLabel}</td>
              </tr>
            </table>
            <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f3f4f6;">
              <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">Message</p>
              <p style="color:#111827;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    // ── Auto-reply to the sender ──────────────────────────
    await resend.emails.send({
      from: "City <noreply@car-hire-ltd.vercel.app>",
      to: email,
      subject: "We received your message — City Hire Ltd",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;font-size:20px;margin:0;">Thanks for reaching out</h1>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
            <p style="color:#374151;line-height:1.7;margin:0 0 16px;">
              Hi ${name}, we've received your message and will get back to you within 24 hours.
            </p>
            <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
              <p style="font-size:12px;color:#9ca3af;margin:0 0 6px;">Your message</p>
              <p style="color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0;">${message}</p>
            </div>
            <p style="color:#6b7280;font-size:13px;line-height:1.7;margin:0;">
              Need urgent help? Call us on <strong>+254 700 000 000</strong> or 
              reply directly to this email.
            </p>
            <div style="margin-top:24px;padding-top:24px;border-top:1px solid #f3f4f6;text-align:center;">
              <a href="https://yourdomain.com/cars" 
                style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">
                Browse our fleet
              </a>
            </div>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
            © ${new Date().getFullYear()} City Hire Ltd · Nairobi, Kenya
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Contact Email Error]", err);
    return { error: "Failed to send message. Please try again." };
  }
}