/*
  Warnings:

  - You are about to drop the column `listId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_listId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "listId";

-- CreateTable
CREATE TABLE "_ListToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ListToRecipe_AB_unique" ON "_ListToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_ListToRecipe_B_index" ON "_ListToRecipe"("B");

-- AddForeignKey
ALTER TABLE "_ListToRecipe" ADD CONSTRAINT "_ListToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ListToRecipe" ADD CONSTRAINT "_ListToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
