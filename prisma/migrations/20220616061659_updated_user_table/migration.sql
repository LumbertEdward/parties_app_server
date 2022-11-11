-- AlterTable
ALTER TABLE "Sh_User_Master_Information" ADD COLUMN     "user_account_pin_reset_code" VARCHAR(200),
ADD COLUMN     "user_account_pin_reset_code_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_account_pin_reset_code_expiry_at" TIMESTAMP(3);
