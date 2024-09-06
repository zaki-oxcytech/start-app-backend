/*
  Warnings:

  - Added the required column `user_id` to the `Support_chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Support_chat_message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Support_chat" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Support_chat_message" ADD COLUMN     "user_id" INTEGER NOT NULL;
