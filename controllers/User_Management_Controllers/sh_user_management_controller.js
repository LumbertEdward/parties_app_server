const { PrismaClient } = require('@prisma/client')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var otpGenerator = require('otp-generator');
const validator = require('validator');

const prisma = new PrismaClient()

exports.sh_create_user_information_controller = async (req, res, next) => {
    const { sh_user_email_address, sh_user_password, sh_user_phone_number, sh_user_sign_in_with } = req.body;
    console.log(req.body)

    try {
        if (sh_user_sign_in_with === 'sh_email_address') {
            const errors = []
            if (!validator.isEmail(sh_user_email_address)) {
                errors.push({ message: 'Enter valid email address' })
            }

            if (validator.isEmpty(sh_user_password) || !validator.isLength(sh_user_password, { min: 8 })) {
                errors.push({ message: 'Enter valid password' })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid input")
                error.data = errors
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_email_address: sh_user_email_address
                }
            })

            if (userInformation) {
                const error = new Error("Email address already exists")
                error.code = 400
                throw error
            }

            const hashedPassword = await bcrypt.hash(sh_user_password, 12)

            const referral_code = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: true,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            );

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const createdUser = await prisma.Sh_User_Master_Information.create({
                data: {
                    user_email_address: sh_user_email_address,
                    user_password: hashedPassword,
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                    user_account_information_created_at: new Date(),
                    user_account_information_created_at: new Date(),
                    sh_referral_master_information: {
                        create: {
                            sh_referral_code: referral_code,
                            sh_referral_code_created_at: new Date()
                        }
                    }

                }
            })

            res.status(200).json({
                status: 200,
                message: "User created successfully",
                id: createdUser.id,
                user_email_address: createdUser.user_email_address,
                user_account_verification_code: createdUser.user_account_verification_code,
                user_account_verified: createdUser.user_account_is_verified,
            })
        }
        else {
            const errors = []

            if (validator.isEmpty(sh_user_phone_number)) {
                errors.push({ message: 'Enter valid phone number' })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid input")
                error.data = errors
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_phone_number: sh_user_phone_number
                }
            })

            if (userInformation) {
                const error = new Error("Phone number already exists")
                error.code = 404
                throw error
            }

            const referral_code = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: true,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const createdUser = await prisma.Sh_User_Master_Information.create({
                data: {
                    user_phone_number: sh_user_phone_number,
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                    user_account_information_created_at: new Date(),
                    sh_referral_master_information: {
                        create: {
                            sh_referral_code: referral_code,
                            sh_referral_code_created_at: new Date()
                        }
                    }

                }
            })

            res.status(200).json({
                status: 200,
                message: "User created successfully",
                id: createdUser.id,
                user_phone_number: createdUser.user_phone_number,
                user_account_verification_code: createdUser.user_account_verification_code,
                user_account_verified: createdUser.user_account_is_verified,
            })

        }
    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_user_account_verification_code_controller = async (req, res, next) => {
    const { sh_verification_code } = req.body;

    try {
        const errors = []
        if (validator.isEmpty(sh_verification_code)) {
            errors.push({ message: 'Enter valid verification code' })
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input")
            error.data = errors
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                user_account_verification_code: sh_verification_code,
                user_account_verification_code_expiry_at: {
                    gte: new Date()
                }
            }
        })

        if (!userInformation) {
            const error = new Error("Invalid verification code")
            error.code = 400
            throw error
        }

        const updatedUser = await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                user_account_verification_code: null,
                user_account_verification_code_expiry_at: null,
                user_account_verification_code_created_at: null,
                user_account_is_verified: true
            }
        })

        const accessToken = jwt.sign({
            userId: updatedUser.id,
            email: updatedUser.user_email_address,
        },
            "weliveoncesotakeadvatagofthelifethealmightyhasgivenyouandmakeadifferenceintheworld",
            { expiresIn: "30m" })

        const refreshToken = jwt.sign({
            userId: updatedUser.id,
            email: updatedUser.user_email_address,
        },
            "d2VsaXZlb25jZXNvdGFrZWFkdmF0YWdvZnRoZWxpZmV0aGVhbG1pZ2h0eWhhc2dpdmVueW91YW5kbWFrZWFkaWZmZXJlbmNlaW50aGV3b3JsZA",
            { expiresIn: "30d" })

        await prisma.Sh_Token_Information.create({
            data: {
                sh_refresh_token: refreshToken,
                sh_user_id: updatedUser.id,
            }
        })

        res.status(200).json({
            status: 200,
            message: "User verified successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user_id: updatedUser.id,
        })


    }
    catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_create_customer_information_controller = async (req, res, next) => {
    const {
        customer_username,
        customer_first_name,
        customer_middle_name,
        customer_last_name,
        customer_email_address,
        customer_phone_number,
        customer_gender,
        customer_date_of_birth,
        customer_identification_type,
        customer_identification_number,
        customer_identification_country_of_issue,

    } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                id: req.userId
            },
            include: {
                sh_referral_master_information: true
            }
        })

        if (!userInformation) {
            const error = new Error("User not found")
            error.code = 404
            throw error
        }

        const updatedInformation = await prisma.Sh_User_Master_Information.update({
            where: {
                id: req.userId
            },
            data: {
                user_username: customer_username,
                sh_user_customer_information: {
                    upsert: {
                        create: {
                            customer_first_name: customer_first_name,
                            customer_middle_name: customer_middle_name,
                            customer_last_name: customer_last_name,
                            customer_email_address: customer_email_address,
                            customer_phone_number: customer_phone_number,
                            customer_gender: customer_gender,
                            customer_date_of_birth: customer_date_of_birth,
                            customer_identification_type: customer_identification_type,
                            customer_identification_number: customer_identification_number,
                            customer_identification_country_of_issue: customer_identification_country_of_issue,
                            customer_information_created_at: new Date(),
                            customer_information_updated_at: new Date()
                        },
                        update: {
                            customer_first_name: customer_first_name,
                            customer_middle_name: customer_middle_name,
                            customer_last_name: customer_last_name,
                            customer_email_address: customer_email_address,
                            customer_phone_number: customer_phone_number,
                            customer_gender: customer_gender,
                            customer_date_of_birth: customer_date_of_birth,
                            customer_identification_type: customer_identification_type,
                            customer_identification_number: customer_identification_number,
                            customer_identification_country_of_issue: customer_identification_country_of_issue,
                            customer_information_created_at: new Date(),
                            customer_information_updated_at: new Date()
                        },
                    }
                }
            },
            include: {
                sh_user_customer_information: true
            }
        })

        res.status(200).json({
            status: 200,
            message: "Customer information updated successfully",
            userInformation: updatedInformation
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}