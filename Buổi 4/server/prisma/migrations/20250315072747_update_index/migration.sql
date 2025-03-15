-- CreateIndex
CREATE FULLTEXT INDEX `Post_title_content_idx` ON `Post`(`title`, `content`);
