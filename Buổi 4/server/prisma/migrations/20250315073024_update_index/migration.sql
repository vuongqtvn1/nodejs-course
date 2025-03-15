-- DropIndex
DROP INDEX `Post_title_content_idx` ON `Post`;

-- CreateIndex
CREATE FULLTEXT INDEX `Post_title_idx` ON `Post`(`title`);

-- CreateIndex
CREATE FULLTEXT INDEX `Post_content_idx` ON `Post`(`content`);
