/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `PastUser` table. All the data in the column will be lost.
  - Added the required column `expiredOn` to the `PastUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PastUser" DROP COLUMN "expiredAt",
ADD COLUMN     "expiredOn" TIMESTAMP(3) NOT NULL;
