/*
  Warnings:

  - Added the required column `bathrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedrooms` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitingDaysEnd` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitingDaysStart` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "bathrooms" INTEGER NOT NULL,
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "visitingDaysEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visitingDaysStart" TIMESTAMP(3) NOT NULL;
