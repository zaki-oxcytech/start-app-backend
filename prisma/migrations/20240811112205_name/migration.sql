/*
  Warnings:

  - Added the required column `cost` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectName` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectType` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamLeader` to the `Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamMember` to the `Detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Detail" ADD COLUMN     "cost" INTEGER NOT NULL,
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "projectName" TEXT NOT NULL,
ADD COLUMN     "projectType" TEXT NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "teamLeader" TEXT NOT NULL,
ADD COLUMN     "teamMember" TEXT NOT NULL;
