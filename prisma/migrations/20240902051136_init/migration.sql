/*
  Warnings:

  - Added the required column `sc_status` to the `Support_chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Support_chat" ADD COLUMN     "sc_status" TEXT NOT NULL;
