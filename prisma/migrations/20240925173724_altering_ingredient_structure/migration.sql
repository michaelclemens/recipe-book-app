/*
  Warnings:

  - You are about to drop the column `prep` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `unitValue` on the `Ingredient` table. All the data in the column will be lost.
  - The `unit` column on the `Ingredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "prep",
DROP COLUMN "unitValue",
ADD COLUMN     "preparation" TEXT,
ALTER COLUMN "quantity" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "unit",
ADD COLUMN     "unit" TEXT;

-- DropEnum
DROP TYPE "Unit";
