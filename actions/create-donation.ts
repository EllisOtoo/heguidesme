"use server";

import { initializePayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

interface CreateDonationParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number; // In cents
  message?: string;
}

export async function createDonation(data: CreateDonationParams) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const callbackUrl = `${appUrl}/donate/checkout/success`;
    const payment = await initializePayment(data.email, data.amount, callbackUrl);

    const paymentUrl: string | undefined = payment?.data?.authorization_url;
    const reference: string | undefined = payment?.data?.reference;

    if (payment?.status && paymentUrl && reference) {
      await prisma.$transaction(async (tx) => {
        // Check if user is logged in
        const session = await getServerSession(authOptions);
        let customer;

        if (session?.user?.id) {
          // Use logged-in customer and update their info
          customer = await tx.customer.update({
            where: { id: session.user.id },
            data: {
              name: `${data.firstName} ${data.lastName}`.trim(),
              phone: data.phone,
            },
          });
        } else {
          // Guest donation - upsert customer by email
          const customerName = `${data.firstName} ${data.lastName}`.trim();
          customer = await tx.customer.upsert({
            where: { email: data.email },
            update: { name: customerName, phone: data.phone },
            create: { email: data.email, name: customerName, phone: data.phone },
          });
        }

        // Find or create the donation product
        let donationProduct = await tx.product.findFirst({
          where: { slug: "donation" },
          select: { id: true },
        });

        if (!donationProduct) {
          donationProduct = await tx.product.create({
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
        }

        // Create order without shipping
        await tx.order.create({
          data: {
            reference,
            totalAmount: data.amount,
            status: "PENDING",
            customerId: customer.id,
            // No shippingOptionId or shippingAmount for donations
            items: {
              create: {
                productId: donationProduct.id,
                quantity: 1,
                price: data.amount,
              },
            },
          },
          select: { id: true },
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
    console.error("Donation Creation Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
