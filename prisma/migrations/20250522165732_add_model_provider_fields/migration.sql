/*
  Warnings:

  - You are about to drop the column `provider` on the `Model` table. All the data in the column will be lost.
  - Added the required column `modelId` to the `Model` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- 创建 Provider 表
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- 创建唯一索引
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- 添加新的必需列
ALTER TABLE "Model"
ADD COLUMN "modelId" TEXT NOT NULL DEFAULT 'gpt-4',
ADD COLUMN "providerId" TEXT NOT NULL DEFAULT 'default-openai';

-- 先创建默认提供商
INSERT INTO "Provider" ("id", "name", "apiKey", "isActive", "createdAt", "updatedAt")
VALUES
  ('default-openai', 'openai', '', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('default-groq', 'groq', '', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('default-google', 'google', '', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 更新现有模型数据
UPDATE "Model"
SET
  "providerId" = CASE
    WHEN "name" LIKE 'openai%' THEN 'default-openai'
    WHEN "name" LIKE 'groq%' THEN 'default-groq'
    WHEN "name" LIKE 'google%' THEN 'default-google'
    ELSE 'default-openai'
  END,
  "modelId" = CASE
    WHEN "name" LIKE 'openai%' THEN 'gpt-4'
    WHEN "name" LIKE 'groq%' THEN 'qwen-32b'
    WHEN "name" LIKE 'google%' THEN 'gemini-pro'
    ELSE 'gpt-4'
  END;

-- 删除默认值约束
ALTER TABLE "Model"
ALTER COLUMN "modelId" DROP DEFAULT,
ALTER COLUMN "providerId" DROP DEFAULT;

-- 删除旧的 provider 列
ALTER TABLE "Model" DROP COLUMN "provider";

-- 添加外键约束
ALTER TABLE "Model" ADD CONSTRAINT "Model_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "Provider"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
