"use server";

import { prisma } from "@/lib/prisma";

/**
 * Marks an order as paid and reduces inventory for the items in the order.
 * This is designed to be called from both the Paystack webhook and the manual verification action.
 */
export async function completeOrder(orderId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Get the order with its items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 2. If already paid, don't do anything (idempotency)
    if (order.status === "PAID") {
      return order;
    }

    // 3. Update order status
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    // 4. Reduce inventory for each item
    for (const item of order.items) {
      // Skip donations (they don't have inventory)
      if (item.product.category === "DONATION") {
        continue;
      }

      if (item.variantId) {
        // Reduce variant inventory
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      } else {
        // Reduce product inventory
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }
    }

    return updatedOrder;
  });
}
