/*
  Warnings:

  - The `sh_event_status` column on the `Sh_Event_Master_Information` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Event_Status" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Sh_Event_Master_Information" DROP COLUMN "sh_event_status",
ADD COLUMN     "sh_event_status" "Event_Status" DEFAULT E'ACTIVE';
