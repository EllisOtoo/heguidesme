-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAmount" INTEGER,
ADD COLUMN     "shippingOptionId" TEXT;

-- CreateTable
CREATE TABLE "ShippingOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingOptionId_fkey" FOREIGN KEY ("shippingOptionId") REFERENCES "ShippingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;
