/*
  Warnings:

  - The primary key for the `List` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_ListToMovie" DROP CONSTRAINT "_ListToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListToUser" DROP CONSTRAINT "_ListToUser_A_fkey";

-- AlterTable
ALTER TABLE "List" DROP CONSTRAINT "List_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "List_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "List_id_seq";

-- AlterTable
ALTER TABLE "_ListToMovie" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ListToUser" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_ListToMovie" ADD CONSTRAINT "_ListToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToUser" ADD CONSTRAINT "_ListToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
