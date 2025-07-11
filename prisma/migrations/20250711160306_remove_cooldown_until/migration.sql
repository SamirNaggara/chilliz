/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `userId` on the `Scan` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Winner` table. All the data in the column will be lost.
  - Added the required column `name` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prize` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Scan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `walletAddress` to the `Winner` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_wallet_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contestId" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "username" TEXT,
    "participatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Participation_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participation_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "prize" TEXT NOT NULL,
    "maxWinners" INTEGER NOT NULL DEFAULT 3,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contest" ("createdAt", "endedAt", "id", "startedAt") SELECT "createdAt", "endedAt", "id", "startedAt" FROM "Contest";
DROP TABLE "Contest";
ALTER TABLE "new_Contest" RENAME TO "Contest";
CREATE TABLE "new_Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "walletAddress" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "scannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Scan_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scan" ("id", "jerseyId", "scannedAt") SELECT "id", "jerseyId", "scannedAt" FROM "Scan";
DROP TABLE "Scan";
ALTER TABLE "new_Scan" RENAME TO "Scan";
CREATE TABLE "new_Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contestId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "wonAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Winner_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Winner" ("contestId", "id", "prize") SELECT "contestId", "id", "prize" FROM "Winner";
DROP TABLE "Winner";
ALTER TABLE "new_Winner" RENAME TO "Winner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Participation_contestId_walletAddress_jerseyId_key" ON "Participation"("contestId", "walletAddress", "jerseyId");
