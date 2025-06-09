/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `PastUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PastUser_email_key" ON "PastUser"("email");
