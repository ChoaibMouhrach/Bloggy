-- DropForeignKey
ALTER TABLE `ConfirmEmailToken` DROP FOREIGN KEY `ConfirmEmailToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ForgotPasswordToken` DROP FOREIGN KEY `ForgotPasswordToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `RefreshToken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfirmEmailToken` ADD CONSTRAINT `ConfirmEmailToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForgotPasswordToken` ADD CONSTRAINT `ForgotPasswordToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
