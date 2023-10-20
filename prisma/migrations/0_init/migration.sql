-- CreateTable
CREATE TABLE `barcode_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `barcode_id` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    INDEX `barcode_id`(`barcode_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barcodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `barcode_number` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `count_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NULL,
    `counted` BOOLEAN NULL,
    `quantity` INTEGER NULL,
    `type` VARCHAR(255) NULL,
    `barcode_id` INTEGER NULL,
    `route` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `barcode_id`(`barcode_id`),
    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `freight_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `UD` INTEGER NULL,
    `UE` INTEGER NULL,
    `UV` INTEGER NULL,
    `product_id` INTEGER NULL,
    `freight` VARCHAR(255) NULL,
    `route` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `position_code` VARCHAR(255) NOT NULL,
    `position_number` INTEGER NULL,
    `occupied` BOOLEAN NOT NULL,
    `due_date` TIMESTAMP(0) NULL,
    `product_id` INTEGER NULL,

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ERP` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NULL,
    `SKU` VARCHAR(255) NULL,
    `measure` VARCHAR(255) NULL,
    `category` VARCHAR(255) NULL,
    `blocked` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `rol` VARCHAR(50) NOT NULL,
    `createdAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `password` VARCHAR(200) NOT NULL,
    `email` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

