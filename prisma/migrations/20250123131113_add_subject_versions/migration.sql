/*
  Warnings:

  - You are about to drop the column `description` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `comparedSubjectId` to the `Analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originSubjectId` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analysis" DROP CONSTRAINT "Analysis_subjectId_fkey";

-- AlterTable
ALTER TABLE "Analysis" DROP COLUMN "description",
DROP COLUMN "subjectId",
DROP COLUMN "title",
ADD COLUMN     "colorDifference" DOUBLE PRECISION,
ADD COLUMN     "comparedSubjectId" TEXT NOT NULL,
ADD COLUMN     "degradationScore" DOUBLE PRECISION,
ADD COLUMN     "matchedZone" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "originSubjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "parentSubjectId" TEXT;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_parentSubjectId_fkey" FOREIGN KEY ("parentSubjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_originSubjectId_fkey" FOREIGN KEY ("originSubjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_comparedSubjectId_fkey" FOREIGN KEY ("comparedSubjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
