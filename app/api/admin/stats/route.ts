import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  try {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      totalRevenue,
      totalDonations,
      lowStockProducts,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { totalAmount: true },
      }),
      prisma.orderItem.aggregate({
        where: { 
          product: { category: "DONATION" },
          order: { status: "PAID" }
        },
        _sum: { price: true },
      }),
      prisma.product.count({ where: { inventory: { lt: 5 } } }),
    ]);

    return NextResponse.json({
      summary: {
        totalOrders,
        pendingOrders,
        paidOrders,
        totalRevenueCents: totalRevenue._sum.totalAmount || 0,
        totalDonationsCents: totalDonations._sum.price || 0,
        lowStockItems: lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
