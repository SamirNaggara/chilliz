-- AlterTable
ALTER TABLE "Contest" ADD COLUMN     "blockchainEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "blockchainEvents" JSONB,
ADD COLUMN     "blockchainNetwork" TEXT NOT NULL DEFAULT 'testnet';

-- AlterTable
ALTER TABLE "Jersey" ADD COLUMN     "assetType" TEXT,
ADD COLUMN     "assetUrl" TEXT;

-- AlterTable
ALTER TABLE "Participation" ADD COLUMN     "blockchainConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blockchainData" JSONB,
ADD COLUMN     "blockchainTimestamp" TIMESTAMP(3),
ADD COLUMN     "blockchainTxHash" TEXT;

-- AlterTable
ALTER TABLE "Winner" ADD COLUMN     "blockchainConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blockchainData" JSONB,
ADD COLUMN     "blockchainTimestamp" TIMESTAMP(3),
ADD COLUMN     "blockchainTxHash" TEXT;
