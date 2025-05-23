/*
  Warnings:

  - You are about to drop the column `providerId` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `providerName` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- First, add the providerName column with a default value
ALTER TABLE "Model" ADD COLUMN "providerName" TEXT;

-- Update providerName based on existing providerId
UPDATE "Model" m
SET "providerName" = p.name
FROM "Provider" p
WHERE m."providerId" = p.id;

-- Make providerName required
ALTER TABLE "Model" ALTER COLUMN "providerName" SET NOT NULL;

-- Drop the foreign key constraint
ALTER TABLE "Model" DROP CONSTRAINT "Model_providerId_fkey";

-- Drop the providerId column
ALTER TABLE "Model" DROP COLUMN "providerId";

-- Drop the Provider table
DROP TABLE "Provider";
