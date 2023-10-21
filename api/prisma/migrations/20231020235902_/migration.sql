/*
  Warnings:

  - You are about to drop the column `release_year` on the `Movie` table. All the data in the column will be lost.
  - Added the required column `imdb_id` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poster_url` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "release_year",
ADD COLUMN     "imdb_id" TEXT NOT NULL,
ADD COLUMN     "poster_url" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "release_date" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
