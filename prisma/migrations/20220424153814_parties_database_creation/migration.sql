-- CreateEnum
CREATE TYPE "User_Account_Types" AS ENUM ('NORMAL', 'PREMIUM');

-- CreateTable
CREATE TABLE "Sh_Token_Information" (
    "id" TEXT NOT NULL,
    "sh_refresh_token" TEXT,
    "sh_user_id" TEXT,

    CONSTRAINT "Sh_Token_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_User_Master_Information" (
    "id" TEXT NOT NULL,
    "user_username" VARCHAR(200),
    "user_email_address" VARCHAR(200),
    "user_phone_number" VARCHAR(200),
    "user_password" TEXT,
    "user_account_type" "User_Account_Types" NOT NULL DEFAULT E'NORMAL',
    "user_account_is_normal_account" BOOLEAN DEFAULT false,
    "user_profile_picture_url" VARCHAR(200),
    "user_profile_picture_image_id" VARCHAR(200),
    "user_account_is_verified" BOOLEAN DEFAULT false,
    "user_account_is_active" BOOLEAN DEFAULT false,
    "user_account_is_locked" BOOLEAN DEFAULT false,
    "user_account_verification_code" VARCHAR(200),
    "user_account_verification_code_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_account_verification_code_expiry_at" TIMESTAMP(3),
    "user_account_password_reset_code" VARCHAR(200),
    "user_account_password_reset_code_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_account_password_reset_code_expiry_at" TIMESTAMP(3),
    "user_account_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "user_account_information_updated_at" TIMESTAMP(3),
    "user_account_information_deleted_at" TIMESTAMP(3),
    "user_account_referred_by_Id" TEXT,
    "sh_referral_master_information_Id" TEXT,

    CONSTRAINT "Sh_User_Master_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Customer_Master_Information" (
    "id" TEXT NOT NULL,
    "customer_first_name" VARCHAR(200),
    "customer_last_name" VARCHAR(200),
    "customer_middle_name" VARCHAR(200),
    "customer_gender" VARCHAR(200),
    "customer_email_address" VARCHAR(200),
    "customer_phone_number" VARCHAR(200),
    "customer_date_of_birth" TIMESTAMP(3),
    "customer_identification_type" VARCHAR(200),
    "customer_identification_number" VARCHAR(200),
    "customer_identification_country_of_issue" VARCHAR(200),
    "customer_address_information_Id" TEXT,
    "user_account_information_Id" TEXT,
    "customer_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "customer_information_updated_at" TIMESTAMP(3),
    "customer_information_deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sh_Customer_Master_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Customer_Address_Information" (
    "id" TEXT NOT NULL,
    "customer_country" VARCHAR(200),
    "customer_city" VARCHAR(200),
    "customer_state" VARCHAR(200),
    "customer_street" VARCHAR(200),
    "customer_postal_code" VARCHAR(200),
    "customer_address_type" VARCHAR(200),
    "customer_address_one" VARCHAR(200),
    "customer_address_two" VARCHAR(200),
    "customer_address_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "customer_address_information_updated_at" TIMESTAMP(3),
    "customer_address_information_deleted_at" TIMESTAMP(3),
    "customer_master_information_Id" TEXT,

    CONSTRAINT "Sh_Customer_Address_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Event_Master_Information" (
    "id" TEXT NOT NULL,
    "sh_event_name" VARCHAR(200),
    "sh_event_description" VARCHAR(200),
    "sh_event_capacity" VARCHAR(200),
    "sh_event_status" VARCHAR(200),
    "sh_event_dress_code" VARCHAR(200),
    "sh_event_start_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sh_event_start_time" VARCHAR(200),
    "sh_event_end_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sh_event_end_time" VARCHAR(200),
    "sh_customer_master_information_Id" TEXT NOT NULL,
    "sh_event_master_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sh_event_master_information_updated_at" TIMESTAMP(3),
    "sh_event_master_information_deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sh_Event_Master_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Event_Location_Information" (
    "id" TEXT NOT NULL,
    "sh_event_location_name" VARCHAR(200),
    "sh_event_location_country" VARCHAR(200),
    "sh_event_location_state" VARCHAR(200),
    "sh_event_location_city" VARCHAR(200),
    "sh_event_location_formatted_address" VARCHAR(200),
    "sh_event_location_latitude" VARCHAR(200),
    "sh_event_location_longitude" VARCHAR(200),
    "sh_event_street_name" VARCHAR(200),
    "sh_event_street_number" VARCHAR(200),
    "sh_event_street_address" VARCHAR(200),
    "sh_event_appartment_name" VARCHAR(200),
    "sh_event_house_number" VARCHAR(200),
    "sh_event_country_code" VARCHAR(200),
    "sh_event_zip_code" VARCHAR(200),
    "sh_event_administrative_area_level_1" VARCHAR(200),
    "sh_event_administrative_area_level_2" VARCHAR(200),
    "sh_event_administrative_area_level_3" VARCHAR(200),
    "sh_event_administrative_area_level_4" VARCHAR(200),
    "sh_event_administrative_area_level_5" VARCHAR(200),
    "sh_event_locality" VARCHAR(200),
    "sh_event_sublocality" VARCHAR(200),
    "sh_event_neighborhood" VARCHAR(200),
    "sh_event_route" VARCHAR(200),
    "sh_event_ward" VARCHAR(200),
    "sh_event_postal_code" VARCHAR(200),
    "customer_master_information_Id" TEXT,
    "sh_event_master_information_Id" TEXT,
    "sh_event_location_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sh_event_location_information_updated_at" TIMESTAMP(3),
    "sh_event_location_information_deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sh_Event_Location_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Event_Members_Master_Information" (
    "id" TEXT NOT NULL,
    "sh_customer_master_information_Id" TEXT NOT NULL,
    "sh_event_master_information_Id" TEXT,
    "sh_event_invitation_status" VARCHAR(200),
    "sh_event_members_master_information_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sh_event_members_master_information_updated_at" TIMESTAMP(3),
    "sh_event_members_master_information_deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sh_Event_Members_Master_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sh_Referral_Master_Information" (
    "id" TEXT NOT NULL,
    "sh_referral_code" VARCHAR(200) NOT NULL,
    "sh_referral_code_referred_number" DECIMAL(16,4) DEFAULT 0.00,
    "sh_referral_code_earn_points" DECIMAL(16,4) DEFAULT 0.00,
    "sh_referral_code_created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sh_Referral_Master_Information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sh_User_Master_Information_sh_referral_master_information_I_key" ON "Sh_User_Master_Information"("sh_referral_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Customer_Master_Information_customer_address_information_key" ON "Sh_Customer_Master_Information"("customer_address_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Customer_Master_Information_user_account_information_Id_key" ON "Sh_Customer_Master_Information"("user_account_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Customer_Address_Information_customer_master_information_key" ON "Sh_Customer_Address_Information"("customer_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Event_Master_Information_sh_customer_master_information__key" ON "Sh_Event_Master_Information"("sh_customer_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Event_Location_Information_customer_master_information_I_key" ON "Sh_Event_Location_Information"("customer_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Event_Location_Information_sh_event_master_information_I_key" ON "Sh_Event_Location_Information"("sh_event_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Event_Members_Master_Information_sh_customer_master_info_key" ON "Sh_Event_Members_Master_Information"("sh_customer_master_information_Id");

-- CreateIndex
CREATE UNIQUE INDEX "Sh_Event_Members_Master_Information_sh_event_master_informa_key" ON "Sh_Event_Members_Master_Information"("sh_event_master_information_Id");

-- AddForeignKey
ALTER TABLE "Sh_User_Master_Information" ADD CONSTRAINT "Sh_User_Master_Information_user_account_referred_by_Id_fkey" FOREIGN KEY ("user_account_referred_by_Id") REFERENCES "Sh_Referral_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_User_Master_Information" ADD CONSTRAINT "Sh_User_Master_Information_sh_referral_master_information__fkey" FOREIGN KEY ("sh_referral_master_information_Id") REFERENCES "Sh_Referral_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Customer_Master_Information" ADD CONSTRAINT "Sh_Customer_Master_Information_user_account_information_Id_fkey" FOREIGN KEY ("user_account_information_Id") REFERENCES "Sh_User_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Customer_Address_Information" ADD CONSTRAINT "Sh_Customer_Address_Information_customer_master_informatio_fkey" FOREIGN KEY ("customer_master_information_Id") REFERENCES "Sh_Customer_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Event_Master_Information" ADD CONSTRAINT "Sh_Event_Master_Information_sh_customer_master_information_fkey" FOREIGN KEY ("sh_customer_master_information_Id") REFERENCES "Sh_Customer_Master_Information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Event_Location_Information" ADD CONSTRAINT "Sh_Event_Location_Information_sh_event_master_information__fkey" FOREIGN KEY ("sh_event_master_information_Id") REFERENCES "Sh_Event_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Event_Members_Master_Information" ADD CONSTRAINT "Sh_Event_Members_Master_Information_sh_customer_master_inf_fkey" FOREIGN KEY ("sh_customer_master_information_Id") REFERENCES "Sh_Customer_Master_Information"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sh_Event_Members_Master_Information" ADD CONSTRAINT "Sh_Event_Members_Master_Information_sh_event_master_inform_fkey" FOREIGN KEY ("sh_event_master_information_Id") REFERENCES "Sh_Event_Master_Information"("id") ON DELETE SET NULL ON UPDATE CASCADE;
