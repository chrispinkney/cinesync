-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_id_1_fkey";

-- DropForeignKey
ALTER TABLE "Friends" DROP CONSTRAINT "Friends_id_2_fkey";

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_1_fkey" FOREIGN KEY ("id_1") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_2_fkey" FOREIGN KEY ("id_2") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
