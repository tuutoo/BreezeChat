/*
  Warnings:

  - You are about to drop the column `apiKey` on the `Provider` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[envApiKeyName]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `envApiKeyName` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN "envApiKeyName" TEXT;

-- Update existing data
UPDATE "Provider"
SET "envApiKeyName" = CASE
  WHEN "name" = 'openai' THEN 'OPENAI_API_KEY'
  WHEN "name" = 'groq' THEN 'GROQ_API_KEY'
  WHEN "name" = 'google' THEN 'GOOGLE_GENERATIVE_AI_API_KEY'
  WHEN "name" = 'mistral' THEN 'MISTRAL_API_KEY'
  ELSE 'OPENAI_API_KEY'
END;

-- Set envApiKeyName to not null
ALTER TABLE "Provider" ALTER COLUMN "envApiKeyName" SET NOT NULL;

-- Add unique constraint
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_envApiKeyName_key" UNIQUE ("envApiKeyName");

-- Drop old apiKey column
ALTER TABLE "Provider" DROP COLUMN "apiKey";
