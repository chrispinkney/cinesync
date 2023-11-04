/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar";

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "avatar" BYTEA,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_user_id_key" ON "Avatar"("user_id");
