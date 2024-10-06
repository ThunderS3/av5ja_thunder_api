/*
  Warnings:

  - You are about to alter the column `job_rate` on the `players` table. The data in that column could be lost. The data in that column will be cast from `SmallInt` to `Decimal(3,2)`.

*/
-- AlterTable
ALTER TABLE "players" ADD COLUMN     "weapon_list" SMALLINT[],
ALTER COLUMN "play_time" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "job_rate" SET DATA TYPE DECIMAL(3,2),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "results" ALTER COLUMN "play_time" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "waves" ALTER COLUMN "play_time" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);
