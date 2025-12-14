-- Add Paystack payment reference to orders so we can verify and update status.
ALTER TABLE "Order" ADD COLUMN "reference" TEXT;

-- Unique index allows multiple NULLs in Postgres.
CREATE UNIQUE INDEX "Order_reference_key" ON "Order"("reference");

