/*
  Warnings:

  - You are about to drop the column `sources` on the `job_profile` table. All the data in the column will be lost.
  - Added the required column `country` to the `job_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `job_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_profile" DROP COLUMN "sources",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL;
