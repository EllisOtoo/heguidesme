import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, UNAUTHORIZED_RESPONSE } from "@/lib/admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, description, price, isActive } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (isActive !== undefined) data.isActive = isActive;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updatedOption = await prisma.shippingOption.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedOption);
  } catch (error) {
    console.error("Failed to update shipping option:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return UNAUTHORIZED_RESPONSE;
  }

  const { id } = await params;

  try {
    // Check if there are any orders using this shipping option
    const orderCount = await prisma.order.count({
      where: { shippingOptionId: id },
    });

    if (orderCount > 0) {
      // Soft delete if orders exist (set isActive: false)
      await prisma.shippingOption.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ 
        message: "Shipping option has orders and cannot be deleted. It has been deactivated instead." 
      });
    }

    await prisma.shippingOption.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete shipping option:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
