/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `ConfirmEmailToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `ForgotPasswordToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ConfirmEmailToken_token_key` ON `ConfirmEmailToken`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `ForgotPasswordToken_token_key` ON `ForgotPasswordToken`(`token`);

-- CreateIndex
CREATE UNIQUE INDEX `RefreshToken_token_key` ON `RefreshToken`(`token`);
