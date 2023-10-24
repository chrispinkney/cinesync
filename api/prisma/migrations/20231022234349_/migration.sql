-- CreateTable
CREATE TABLE "Friends" (
    "id_1" TEXT NOT NULL,
    "id_2" TEXT NOT NULL,
    "is_friend" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id_1","id_2")
);

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_1_fkey" FOREIGN KEY ("id_1") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_id_2_fkey" FOREIGN KEY ("id_2") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
