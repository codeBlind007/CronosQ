/*
  Warnings:

  - A unique constraint covering the columns `[createdById,name]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `NotificationChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationChannel" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_createdById_name_key" ON "Job"("createdById", "name");

-- AddForeignKey
ALTER TABLE "NotificationChannel" ADD CONSTRAINT "NotificationChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
