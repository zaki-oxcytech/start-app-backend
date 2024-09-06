/*
  Warnings:

  - You are about to drop the column `supporter_id` on the `Support_chat_members` table. All the data in the column will be lost.
  - You are about to drop the column `supporter_status` on the `Support_chat_members` table. All the data in the column will be lost.
  - You are about to drop the column `supporter_status_date` on the `Support_chat_members` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Support_chat_members" DROP COLUMN "supporter_id",
DROP COLUMN "supporter_status",
DROP COLUMN "supporter_status_date";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supporter_status" TEXT;
