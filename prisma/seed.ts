import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Single Quiet Time Journal
  const journal = await prisma.product.upsert({
    where: { slug: 'single-quiet-time-journal' },
    update: {},
    create: {
        slug: 'single-quiet-time-journal',
        name: 'The Quiet Time Journal',
        description: 'A beautifully crafted journal designed to help you focus, reflect, and grow in your spiritual journey. Features guided sections for scripture, prayer, and gratitude.',
        price: 8000, // 80.00 GHS
        images: ['https://placehold.co/600x800/EEE/31343C?text=Journal+Cover'], // Placeholder
        category: 'JOURNAL',
        inventory: 100
    },
  })
  console.log({ journal });

  // 1b. Donation (hidden from shop listings)
  const donation = await prisma.product.upsert({
    where: { slug: 'donation' },
    update: {},
    create: {
      slug: 'donation',
      name: 'Donation',
      description: 'Support our mission with a donation.',
      price: 0,
      images: [],
      category: 'DONATION',
      inventory: 0,
    },
  })
  console.log({ donation });

  // 2. Gift Bundle
  const bundle = await prisma.product.upsert({
    where: { slug: 'quiet-time-gift-bundle' },
    update: {},
    create: {
        slug: 'quiet-time-gift-bundle',
        name: 'The Complete Quiet Time Gift Bundle',
        description: 'The perfect gift for yourself or a loved one. Includes the Quiet Time Journal, a premium pen, and a scripture bookmark, all beautifully packaged.',
        price: 15000, // 150.00 GHS
        images: ['https://placehold.co/600x800/EEE/31343C?text=Gift+Bundle'],
        category: 'BUNDLE',
        inventory: 25
    },
  })
  console.log({ bundle });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
