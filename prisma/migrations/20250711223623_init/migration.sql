-- CreateEnum
CREATE TYPE "ContestStatus" AS ENUM ('ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Jersey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jersey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "firstPrize" TEXT NOT NULL,
    "secondPrize" TEXT NOT NULL,
    "thirdPrize" TEXT NOT NULL,
    "maxWinners" INTEGER NOT NULL DEFAULT 3,
    "status" "ContestStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "username" TEXT,
    "participatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "wonAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Winner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JerseyDex" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "jerseyId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JerseyDex_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participation_contestId_walletAddress_jerseyId_key" ON "Participation"("contestId", "walletAddress", "jerseyId");

-- CreateIndex
CREATE UNIQUE INDEX "JerseyDex_walletAddress_jerseyId_key" ON "JerseyDex"("walletAddress", "jerseyId");

-- AddForeignKey
ALTER TABLE "Scan" ADD CONSTRAINT "Scan_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Winner" ADD CONSTRAINT "Winner_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JerseyDex" ADD CONSTRAINT "JerseyDex_jerseyId_fkey" FOREIGN KEY ("jerseyId") REFERENCES "Jersey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
