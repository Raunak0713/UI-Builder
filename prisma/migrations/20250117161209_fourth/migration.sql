/*
  Warnings:

  - Added the required column `clerkId` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "clerkId" TEXT NOT NULL;