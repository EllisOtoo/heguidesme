"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { 
      category: { not: "DONATION" },
      isArchived: false
    },
    orderBy: { createdAt: "desc" },
  });
  return products;
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
    },
  });
  return product;
}
