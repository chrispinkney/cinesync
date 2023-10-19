/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_B_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Movie_id_seq";

-- AlterTable
ALTER TABLE "_ListToMovie" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_ListToMovie" ADD CONSTRAINT "_ListToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
