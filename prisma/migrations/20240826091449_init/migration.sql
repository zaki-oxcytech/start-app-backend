/*
  Warnings:

  - Added the required column `supporter_status` to the `Support_chat_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Support_chat_members" ADD COLUMN     "supporter_status" TEXT NOT NULL;
