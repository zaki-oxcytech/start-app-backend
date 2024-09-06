/*
  Warnings:

  - You are about to drop the column `sc_flag` on the `Support_chat` table. All the data in the column will be lost.
  - You are about to drop the column `sc_updated_date` on the `Support_chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Support_chat" DROP COLUMN "sc_flag",
DROP COLUMN "sc_updated_date";
