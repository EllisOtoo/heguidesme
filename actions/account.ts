"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedCustomerId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function getMyOrders() {
  try {
    const customerId = await getAuthenticatedCustomerId();

    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true },
            },
          },
        },
        shippingAddress: true,
      },
    });

    return { success: true, orders };
  } catch (error) {
    console.error("Get orders error:", error);
    return { success: false, error: "Failed to fetch orders", orders: [] };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const customerId = await getAuthenticatedCustomerId();

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId, // Authorization check
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true, slug: true },
            },
          },
        },
        shippingAddress: true,
      },
    });

    if (!order) {
      return { success: false, error: "Order not found", order: null };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Get order error:", error);
    return { success: false, error: "Failed to fetch order", order: null };
  }
}

export async function getProfile() {
  try {
    const customerId = await getAuthenticatedCustomerId();

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, email: true, name: true, phone: true },
    });

    return { success: true, profile: customer };
  } catch (error) {
    console.error("Get profile error:", error);
    return { success: false, error: "Failed to fetch profile", profile: null };
  }
}

export async function updateProfile(data: { name?: string; phone?: string }) {
  try {
    const customerId = await getAuthenticatedCustomerId();

    const customer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        phone: data.phone,
      },
      select: { id: true, email: true, name: true, phone: true },
    });

    return { success: true, profile: customer };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function getMyAddresses() {
  try {
    const customerId = await getAuthenticatedCustomerId();

    const addresses = await prisma.address.findMany({
      where: { customerId },
      orderBy: { id: "desc" },
    });

    return { success: true, addresses };
  } catch (error) {
    console.error("Get addresses error:", error);
    return { success: false, error: "Failed to fetch addresses", addresses: [] };
  }
}
