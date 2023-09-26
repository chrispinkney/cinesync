/*
  Warnings:

  - Added the required column `creator_id` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "creator_id" INTEGER NOT NULL;
