-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('free', 'pro', 'enterprise');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "selectedPlan" "Plan" NOT NULL DEFAULT 'free';
