/*
  Warnings:

  - You are about to drop the column `status` on the `ExtensionRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `ExtensionRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ExtensionRequest" DROP COLUMN "status";

-- CreateIndex
CREATE UNIQUE INDEX "ExtensionRequest_email_key" ON "ExtensionRequest"("email");
