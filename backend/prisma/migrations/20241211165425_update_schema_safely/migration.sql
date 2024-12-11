/*
  Warnings:

  - You are about to drop the column `address` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `assistance` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `birthdate` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `birthplace` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `nik` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `Resident` table. All the data in the column will be lost.
  - Changed the type of `education` on the `Resident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Resident_nik_key";

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "address",
DROP COLUMN "assistance",
DROP COLUMN "birthdate",
DROP COLUMN "birthplace",
DROP COLUMN "details",
DROP COLUMN "gender",
DROP COLUMN "grade",
DROP COLUMN "major",
DROP COLUMN "nik",
DROP COLUMN "phone",
DROP COLUMN "schoolName",
DROP COLUMN "education",
ADD COLUMN     "education" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
