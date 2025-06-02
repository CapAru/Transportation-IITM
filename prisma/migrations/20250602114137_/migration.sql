/*
  Warnings:

  - The required column `id` was added to the `SampleData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "SampleData_LogTime_RSU_ID_OBU_ID_PktType_PktLen_Time(IST)_G_key";

-- AlterTable
ALTER TABLE "SampleData" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SampleData_pkey" PRIMARY KEY ("id");
