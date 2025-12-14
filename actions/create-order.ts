"use server";

import { initializePayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

interface CartItem {
    id: string; // Product ID or unique ID
    slug: string; // We need product ID for relation, slug is for display
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
    // In a real app, you might validate the amount against the database prices here
    // to prevent tampering. For this milestone, we trust the client's calculated total
    // but in production, ALWAYS recalculate total on server.
    
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success`;
    const payment = await initializePayment(data.email, data.amount, callbackUrl);

    if (payment.status && payment.data.authorization_url) {
        
        // 1. Create or Find Customer
        // In a real app we might search by email, but here we just create a new record for simplicity
        // or upsert.
        // Let's create the Address first.
        const address = await prisma.address.create({
            data: {
                street: data.address,
                city: data.city,
                region: data.region,
            }
        });

        // 2. Create Order with Items
        // We need to fetch real Product IDs based on slugs if items doesn't have them.
        // Assuming items have correct slugs that match Product.slug.
        // Since CartItem.id is just a unique ID, we need to lookup products.
        
        // Optimization: For now, we will perform a lookup or assume `slug` is correct.
        // Ideally the cart should store the real Product database ID.
        // To be safe, let's look up products by slug or assume we can find them.
        
        // Since we can't easily map safely inside a query without IDs, let's fetch products first.
        const slugs = data.items.map(function(item) { return item.slug; });
        const products = await prisma.product.findMany({
            where: { slug: { in: slugs } }
        });

        // Map product slug to ID
        const productMap = new Map();
        for (const p of products) {
            productMap.set(p.slug, p.id);
        }
        
        // Note: For "Donation", we might not have a product record unless we created one.
        // If donation is a special item, we need to handle it.
        // Or we can create a "Donation" product in the seed or on the fly.
        // For this MVP, let's skip saving OrderItems that don't match a product (like custom donation)
        // OR create a placeholder donation product?
        // Let's assume we skip non-product items in OrderItem relation for now to avoid crashes.

        await prisma.order.create({
            data: {
                reference: payment.data.reference,
                totalAmount: data.amount,
                currency: "GHS",
                status: "PENDING",
                customer: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phone: data.phone,
                    }
                },
                billingAddressId: address.id,
                orderItems: {
                    create: data.items
                        .filter(function(item) { return productMap.has(item.slug); }) // Only add valid products
                        .map(function(item) {
                             return {
                                productId: productMap.get(item.slug),
                                quantity: item.quantity,
                                price: item.price,
                            };
                        })
                }
            }
        });

      // Return the authorization URL to the client so they can redirect
        return { 
            success: true, 
            paymentUrl: payment.data.authorization_url, 
            reference: payment.data.reference 
        };
    }

    return { success: false, error: "Failed to initialize payment gateway" };

  } catch (error) {
    console.error("Order Creation Error:", error);
    return { success: false, error: (error as Error).message };
  }
}
