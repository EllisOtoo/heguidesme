"use server";

import { verifyPayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { completeOrder } from "./order-completion";

export async function verifyOrderPayment(reference: string) {
  try {
    const paymentData = await verifyPayment(reference);

    if (paymentData.status && paymentData.data.status === "success") {
      const order = await prisma.order.findUnique({
        where: { reference },
        select: { id: true }
      });

      if (!order) {
        console.error("No order found for reference", reference);
        return { success: false, error: "Order not found" };
      }

      await completeOrder(order.id);

      return { success: true };
    }

    return { success: false, error: "Payment verification failed" };
  } catch (error) {
    console.error("Verification Action Error", error);
    return { success: false, error: "Server error during verification" };
  }
}
