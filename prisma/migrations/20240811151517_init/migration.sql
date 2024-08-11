/*
  Warnings:

  - The `teamMember` column on the `Detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Detail" DROP COLUMN "teamMember",
ADD COLUMN     "teamMember" TEXT[];
