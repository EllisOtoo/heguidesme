"use server";

import { verifyPayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

export async function verifyOrderPayment(reference: string) {
  try {
    const paymentData = await verifyPayment(reference);

    if (paymentData.status && paymentData.data.status === "success") {
      const updateResult = await prisma.order.updateMany({
        where: { reference },
        data: { status: "PAID" },
      });

      if (updateResult.count === 0) {
        console.error("No order found for reference", reference);
      }

      return { success: true };
    }

    return { success: false, error: "Payment verification failed" };
  } catch (error) {
    console.error("Verification Action Error", error);
    return { success: false, error: "Server error during verification" };
  }
}
