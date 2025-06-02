/*
  Warnings:

  - The primary key for the `SampleData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SampleData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[LogTime,RSU_ID,OBU_ID,PktType,PktLen,Time(IST),GPSValid,Latitude,Longitude,Date(IST),Accel_X,Accel_Y,Accel_Z,Gyro_X,Gyro_Y,Gyro_Z]` on the table `SampleData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SampleData" DROP CONSTRAINT "SampleData_pkey",
DROP COLUMN "id",
ALTER COLUMN "Time(IST)" SET DATA TYPE TEXT,
ALTER COLUMN "Date(IST)" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SampleData_LogTime_RSU_ID_OBU_ID_PktType_PktLen_Time(IST)_G_key" ON "SampleData"("LogTime", "RSU_ID", "OBU_ID", "PktType", "PktLen", "Time(IST)", "GPSValid", "Latitude", "Longitude", "Date(IST)", "Accel_X", "Accel_Y", "Accel_Z", "Gyro_X", "Gyro_Y", "Gyro_Z");
