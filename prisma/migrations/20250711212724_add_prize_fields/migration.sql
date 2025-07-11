/*
  Warnings:

  - You are about to drop the column `prize` on the `Contest` table. All the data in the column will be lost.
  - Added the required column `firstPrize` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondPrize` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdPrize` to the `Contest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "JerseyDex" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JerseyDex_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startedAt" DATETIME NOT NULL,
    "endedAt" DATETIME,
    "firstPrize" TEXT NOT NULL,
    "secondPrize" TEXT NOT NULL,
    "thirdPrize" TEXT NOT NULL,
    "maxWinners" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contest" ("createdAt", "description", "endedAt", "id", "maxWinners", "name", "startedAt", "status", "updatedAt") SELECT "createdAt", "description", "endedAt", "id", "maxWinners", "name", "startedAt", "status", "updatedAt" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "JerseyDex_walletAddress_jerseyId_key" ON "JerseyDex"("walletAddress", "jerseyId");
