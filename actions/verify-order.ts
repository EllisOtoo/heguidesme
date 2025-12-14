"use server";

import { verifyPayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

export async function verifyOrderPayment(reference: string) {
  try {
    const paymentData = await verifyPayment(reference);

    if (paymentData.status && paymentData.data.status === "success") {
        
        // Update the order status to PAID
        try {
            await prisma.order.update({
                where: { reference: reference },
                data: { status: "PAID" }
            });
        } catch (e) {
            console.error("Failed to update order status", e);
        }

        return { success: true };
    }

    return { success: false, error: "Payment verification failed" };
  } catch (error) {
    console.error("Verification Action Error", error);
    return { success: false, error: "Server error during verification" };
  }
}
