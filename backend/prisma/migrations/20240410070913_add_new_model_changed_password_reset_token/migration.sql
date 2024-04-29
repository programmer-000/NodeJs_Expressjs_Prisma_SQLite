/*
  Warnings:

  - You are about to drop the column `userPassword` on the `PasswordResetToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resetToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expireTime" TEXT NOT NULL,
    CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PasswordResetToken" ("expireTime", "id", "resetToken", "userId") SELECT "expireTime", "id", "resetToken", "userId" FROM "PasswordResetToken";
DROP TABLE "PasswordResetToken";
ALTER TABLE "new_PasswordResetToken" RENAME TO "PasswordResetToken";
CREATE UNIQUE INDEX "PasswordResetToken_id_key" ON "PasswordResetToken"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
