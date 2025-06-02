/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PastUser` table. All the data in the column will be lost.
  - Added the required column `createdOn` to the `PastUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PastUser" DROP COLUMN "createdAt",
ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL;
