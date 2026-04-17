-- DropIndex
DROP INDEX "idx_category_name";

-- CreateIndex
CREATE INDEX "idx_comment_ideaId" ON "comments"("ideaId");

-- CreateIndex
CREATE INDEX "idx_comment_parentId" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "idx_idea_authorId" ON "ideas"("authorId");

-- CreateIndex
CREATE INDEX "idx_idea_categoryId" ON "ideas"("categoryId");

-- CreateIndex
CREATE INDEX "idx_idea_status_createdAt" ON "ideas"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "idx_payment_userId_ideaId" ON "payments"("userId", "ideaId");

-- CreateIndex
CREATE INDEX "idx_vote_userId_ideaId" ON "votes"("userId", "ideaId");
