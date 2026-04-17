const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// ── Get OAuth token ──────────────────────────────────────────
export async function getMpesaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!;
  const secret = process.env.MPESA_CONSUMER_SECRET!;
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");

  const res = await fetch(
    `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to get M-Pesa token: ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

// ── Generate password ────────────────────────────────────────
export function getMpesaPassword(): { password: string; timestamp: string } {
  const shortcode = process.env.MPESA_SHORTCODE!;
  const passkey = process.env.MPESA_PASSKEY!;
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64"
  );
  return { password, timestamp };
}

// ── Format phone number ──────────────────────────────────────
export function formatPhone(phone: string): string {
  // Accepts: 0712345678 or +254712345678 or 254712345678
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.slice(1);
  }
  if (cleaned.startsWith("254")) {
    return cleaned;
  }
  return cleaned;
}

// ── STK Push ─────────────────────────────────────────────────
export async function initiateStkPush({
  phone,
  amount,
  bookingId,
}: {
  phone: string;
  amount: number;
  bookingId: string;
}) {
  const token = await getMpesaToken();
  const { password, timestamp } = getMpesaPassword();
  const formattedPhone = formatPhone(phone);
  const roundedAmount = Math.ceil(amount);

  const body = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: roundedAmount,
    PartyA: formattedPhone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: `ZENA-${bookingId.slice(0, 8).toUpperCase()}`,
    TransactionDesc: `Zena car hire booking ${bookingId.slice(0, 8)}`,
  };

  const res = await fetch(
    `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`STK Push failed: ${error}`);
  }

  return res.json();
}

// ── Query STK Push status ────────────────────────────────────
export async function queryStkStatus(checkoutRequestId: string) {
  const token = await getMpesaToken();
  const { password, timestamp } = getMpesaPassword();

  const body = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  const res = await fetch(
    `${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return res.json();
}