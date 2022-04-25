/*
  Warnings:

  - You are about to drop the column `customer_master_information_Id` on the `Sh_Event_Location_Information` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sh_Event_Location_Information_customer_master_information_I_key";

-- AlterTable
ALTER TABLE "Sh_Event_Location_Information" DROP COLUMN "customer_master_information_Id";

-- AlterTable
ALTER TABLE "Sh_User_Master_Information" ADD COLUMN     "user_phone_pin" VARCHAR(200);
