-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "listId" TEXT;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
