/*
  Warnings:

  - You are about to drop the `Supporter` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" TEXT;

-- DropTable
DROP TABLE "Supporter";
