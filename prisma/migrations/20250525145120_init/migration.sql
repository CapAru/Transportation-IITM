/*
  Warnings:

  - Added the required column `password` to the `PendingUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingUser" ADD COLUMN     "password" TEXT NOT NULL;
