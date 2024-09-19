/*
  Warnings:

  - You are about to drop the column `hour` on the `Method` table. All the data in the column will be lost.
  - You are about to drop the column `minute` on the `Method` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "optional" BOOLEAN,
ADD COLUMN     "prep" TEXT;

-- AlterTable
ALTER TABLE "Method" DROP COLUMN "hour",
DROP COLUMN "minute",
ADD COLUMN     "stepTime" INTEGER;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "cookTime" INTEGER,
ADD COLUMN     "prepTime" INTEGER,
ADD COLUMN     "serves" INTEGER,
ADD COLUMN     "summary" TEXT;
