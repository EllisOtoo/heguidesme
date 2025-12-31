import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { completeOrder } from "@/actions/order-completion";

type PaystackWebhookEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    status?: string;
  };
};

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  const signatureHeader = request.headers.get("x-paystack-signature") ?? "";
  const secret = process.env.PAYSTACK_SECRET_KEY ?? "";

  if (!signatureHeader || !secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rawBody = Buffer.from(await request.arrayBuffer());
  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (!timingSafeEqual(signatureHeader, expectedSignature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: PaystackWebhookEvent;
  try {
    payload = JSON.parse(rawBody.toString("utf8")) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.info("[paystack:webhook] received", {
    event: payload.event ?? "unknown",
    reference: payload.data?.reference ?? null,
    status: payload.data?.status ?? null,
    amount: payload.data?.amount ?? null,
  });

  if (payload.event !== "charge.success") {
    return NextResponse.json({ ok: true });
  }

  const reference = payload.data?.reference;
  const amount = payload.data?.amount;
  const status = payload.data?.status;

  if (!reference || typeof amount !== "number" || status !== "success") {
    return NextResponse.json({ ok: true });
  }

  try {
    const order = await prisma.order.findFirst({
      where: { reference },
      select: { id: true, totalAmount: true, status: true },
    });

    if (!order) {
      console.info("[paystack:webhook] no matching order", { reference });
      return NextResponse.json({ ok: true });
    }

    if (order.totalAmount !== amount) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAYMENT_MISMATCH" },
      });
      console.info("[paystack:webhook] amount mismatch", {
        reference,
        orderId: order.id,
        expectedAmount: order.totalAmount,
        receivedAmount: amount,
      });
      return NextResponse.json({ ok: true });
    }

    if (order.status !== "PAID") {
      await completeOrder(order.id);
      console.info("[paystack:webhook] marked paid and inventory reduced", { reference, orderId: order.id });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Paystack webhook error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
