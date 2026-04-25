-- CreateTable
CREATE TABLE `_AssignedTasks` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AssignedTasks_AB_unique`(`A`, `B`),
    INDEX `_AssignedTasks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AssignedTasks` ADD CONSTRAINT `_AssignedTasks_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssignedTasks` ADD CONSTRAINT `_AssignedTasks_B_fkey` FOREIGN KEY (`B`) REFERENCES `task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
