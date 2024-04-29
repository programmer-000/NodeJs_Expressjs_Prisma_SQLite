-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "resetToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expireTime" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_id_key" ON "PasswordResetToken"("id");
