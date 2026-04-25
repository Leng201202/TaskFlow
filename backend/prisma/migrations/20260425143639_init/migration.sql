-- AlterTable
ALTER TABLE `Task` ADD COLUMN `priority` ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low';
