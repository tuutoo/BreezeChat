/*
  Warnings:

  - The values [OTHERS] on the enum `PromptCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromptCategory_new" AS ENUM ('LANGUAGE', 'TONE', 'STYLE', 'DOMAIN', 'OTHER');
ALTER TABLE "additional_prompts" ALTER COLUMN "category" TYPE "PromptCategory_new" USING ("category"::text::"PromptCategory_new");
ALTER TYPE "PromptCategory" RENAME TO "PromptCategory_old";
ALTER TYPE "PromptCategory_new" RENAME TO "PromptCategory";
DROP TYPE "PromptCategory_old";
COMMIT;
