/*
  Warnings:

  - You are about to drop the column `avatar` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(128)`.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatar",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(128);
