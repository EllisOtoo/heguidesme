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
  const body = await request.json();
  
  // Extract allowed fields
  const { name, description, price, inventory, images } = body;

  const data: any = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (inventory !== undefined) data.inventory = inventory;
  if (images !== undefined) data.images = images;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
