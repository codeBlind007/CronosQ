/*
  Warnings:

  - The values [QUEUED,SUCCESS,RETRYING] on the enum `ExecutionStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACTIVE,DISABLED,SUCCESS] on the enum `JobStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `completedAt` on the `JobExecution` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idempotencyKey]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,destination,type]` on the table `NotificationChannel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExecutionStatus_new" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');
ALTER TABLE "JobExecution" ALTER COLUMN "status" TYPE "ExecutionStatus_new" USING ("status"::text::"ExecutionStatus_new");
ALTER TYPE "ExecutionStatus" RENAME TO "ExecutionStatus_old";
ALTER TYPE "ExecutionStatus_new" RENAME TO "ExecutionStatus";
DROP TYPE "public"."ExecutionStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JobStatus_new" AS ENUM ('PENDING', 'QUEUED', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED');
ALTER TABLE "public"."Job" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Job" ALTER COLUMN "status" TYPE "JobStatus_new" USING ("status"::text::"JobStatus_new");
ALTER TYPE "JobStatus" RENAME TO "JobStatus_old";
ALTER TYPE "JobStatus_new" RENAME TO "JobStatus";
DROP TYPE "public"."JobStatus_old";
ALTER TABLE "Job" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "actorType" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "deadLettered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "lastRunAt" TIMESTAMP(3),
ADD COLUMN     "nextRunAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "JobExecution" DROP COLUMN "completedAt",
ADD COLUMN     "bullJobId" TEXT,
ADD COLUMN     "finishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Worker" ADD COLUMN     "hostname" TEXT,
ADD COLUMN     "pid" INTEGER,
ALTER COLUMN "lastHeartbeat" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_idempotencyKey_key" ON "Job"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Job_nextRunAt_idx" ON "Job"("nextRunAt");

-- CreateIndex
CREATE INDEX "Job_queueName_idx" ON "Job"("queueName");

-- CreateIndex
CREATE INDEX "JobExecution_bullJobId_idx" ON "JobExecution"("bullJobId");

-- CreateIndex
CREATE INDEX "NotificationChannel_userId_idx" ON "NotificationChannel"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationChannel_userId_destination_type_key" ON "NotificationChannel"("userId", "destination", "type");

-- CreateIndex
CREATE INDEX "Worker_lastHeartbeat_idx" ON "Worker"("lastHeartbeat");
