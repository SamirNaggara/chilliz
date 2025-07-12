-- Ajouter la nouvelle valeur PENDING à l'enum ContestStatus
ALTER TYPE "ContestStatus" ADD VALUE 'PENDING';

-- Supprimer les colonnes startedAt et endedAt
ALTER TABLE "Contest" DROP COLUMN "startedAt";
ALTER TABLE "Contest" DROP COLUMN "endedAt";

-- Mettre à jour le statut par défaut pour les nouveaux concours
ALTER TABLE "Contest" ALTER COLUMN "status" SET DEFAULT 'PENDING';
