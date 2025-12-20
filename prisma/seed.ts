import { PrismaClient } from "./generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 0. Create Admin Customer Account
  const adminEmail = process.env.ADMIN_EMAIL || "admin@heguidesme.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Change this!

  const existingAdmin = await prisma.customer.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.customer.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Admin User",
      },
    });
    console.log("✅ Admin account created:", { email: admin.email });
  } else {
    console.log("ℹ️  Admin account already exists:", { email: adminEmail });
  }

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

  // 2b. Scripture Card (GHS 5)
  const card = await prisma.product.upsert({
    where: { slug: 'scripture-card' },
    update: {
      price: 500, // 5.00 GHS
    },
    create: {
        slug: 'scripture-card',
        name: 'Quiet Time Scripture Card',
        description: 'A pocket-sized laminated card featuring encouraging scriptures for your daily walk.',
        price: 500, // 5.00 GHS
        images: ['https://placehold.co/600x800/EEE/31343C?text=Scripture+Card'],
        category: 'JOURNAL',
        inventory: 500
    },
  })
  console.log({ card });

  // 3. Shipping Options
  const shippingOptions = [
    {
      name: "Standard Shipping",
      description: "3-5 business days delivery within Ghana",
      price: 3500, // 35.00 GHS
    },
    {
      name: "Express Shipping",
      description: "Next day delivery within Accra",
      price: 6000, // 60.00 GHS
    },
    {
      name: "Pick-up / Delivery at Meet-up",
      description: "Pick up from our designated location",
      price: 0,
    }
  ];

  for (const option of shippingOptions) {
    const seededOption = await prisma.shippingOption.upsert({
      where: { id: option.name.toLowerCase().replace(/\s+/g, '-') }, // Using name as a slug-like ID for seeding
      update: {
        price: option.price,
        description: option.description,
      },
      create: {
        id: option.name.toLowerCase().replace(/\s+/g, '-'),
        name: option.name,
        description: option.description,
        price: option.price,
      },
    });
    console.log("✅ Shipping option seeded:", seededOption.name);
  }
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
