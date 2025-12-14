"use server";

import { initializePayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

interface CartItem {
  id: string; // Product ID (or a client-side ID for non-products like donation)
  slug: string; // Used to identify special items like "donation"
  quantity: number;
  price: number;
}

interface CreateOrderParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  amount: number; // In cents
  items: CartItem[];
}

export async function createOrder(data: CreateOrderParams) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/checkout/success`;
    const payment = await initializePayment(data.email, data.amount, callbackUrl);

    const paymentUrl: string | undefined = payment?.data?.authorization_url;
    const reference: string | undefined = payment?.data?.reference;

    if (payment?.status && paymentUrl && reference) {
      await prisma.$transaction(async (tx) => {
        const customerName = `${data.firstName} ${data.lastName}`.trim();
        const customer = await tx.customer.upsert({
          where: { email: data.email },
          update: { name: customerName, phone: data.phone },
          create: { email: data.email, name: customerName, phone: data.phone },
        });

        const productIds = data.items
          .filter((item) => item.slug !== "donation")
          .map((item) => item.id);

        const wantsDonation = data.items.some((item) => item.slug === "donation");

        const products = await tx.product.findMany({
          where: {
            OR: [
              ...(productIds.length > 0 ? [{ id: { in: productIds } }] : []),
              ...(wantsDonation ? [{ slug: "donation" }] : []),
            ],
          },
          select: { id: true, slug: true },
        });

        const validProductIds = new Set(products.map((p) => p.id));
        let donationProductId = products.find((p) => p.slug === "donation")?.id;

        if (wantsDonation && !donationProductId) {
          const donationProduct = await tx.product.create({
            data: {
              slug: "donation",
              name: "Donation",
              description: "Support our mission with a donation.",
              price: 0,
              images: [],
              category: "DONATION",
              inventory: 0,
            },
            select: { id: true },
          });
          donationProductId = donationProduct.id;
        }

        const orderItems = data.items
          .map((item) => {
            if (item.quantity < 1) return null;

            if (item.slug === "donation") {
              if (!donationProductId) return null;
              return {
                productId: donationProductId,
                quantity: item.quantity,
                price: item.price,
              };
            }

            if (!validProductIds.has(item.id)) return null;
            return { productId: item.id, quantity: item.quantity, price: item.price };
          })
          .filter(Boolean) as Array<{ productId: string; quantity: number; price: number }>;

        const order = await tx.order.create({
          data: {
            reference,
            totalAmount: data.amount,
            status: "PENDING",
            customerId: customer.id,
            ...(orderItems.length > 0 ? { items: { create: orderItems } } : {}),
          },
          select: { id: true },
        });

        await tx.address.create({
          data: {
            street: data.address,
            city: data.city,
            state: data.region,
            customerId: customer.id,
            orderId: order.id,
          },
        });
      });

      return {
        success: true,
        paymentUrl,
        reference,
      };
    }

    return { success: false, error: "Failed to initialize payment gateway" };

  } catch (error) {
    console.error("Order Creation Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
