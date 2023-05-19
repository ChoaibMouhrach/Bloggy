/*
  Warnings:

  - You are about to drop the column `is_draft` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `is_draft`,
    ADD COLUMN `isDraft` BOOLEAN NOT NULL DEFAULT true;
