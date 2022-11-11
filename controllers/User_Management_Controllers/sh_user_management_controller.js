const { PrismaClient } = require('@prisma/client')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var otpGenerator = require('otp-generator');
const validator = require('validator');

const prisma = new PrismaClient()

exports.sh_create_user_information_controller = async (req, res, next) => {
    const { sh_user_email_address, sh_user_password, sh_user_phone_number, sh_user_sign_in_with } = req.body;
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

exports.sh_user_resend_verification_code_controller = async function (req, res, next) {
    const { sh_email_address, sh_phone_number, sh_resend_with } = req.body;

    try {
        if (sh_resend_with === "sh_email_address") {
            const errors = []
            if (!validator.isEmail(sh_email_address)) {
                errors.push({ message: 'Enter valid email address' })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid input")
                error.data = errors
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_email_address: sh_email_address
                }
            })

            if (!userInformation) {
                const error = new Error("Email address does not exist")
                error.code = 404
                throw error
            }

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const updatedUser = await prisma.Sh_User_Master_Information.update({
                where: {
                    id: userInformation.id
                },
                data: {
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                }
            })

            res.status(200).json({
                status: 200,
                message: "Verification code sent successfully",
                user_account_verification_code: updatedUser.user_account_verification_code,
                user_email_address: updatedUser.user_email_address,
            })
        }
        else {
            const errors = []
            if (validator.isEmpty(sh_phone_number)) {
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
                    user_phone_number: sh_phone_number
                }
            })

            if (!userInformation) {
                const error = new Error("Phone number does not exist")
                error.code = 404
                throw error
            }

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const updatedUser = await prisma.Sh_User_Master_Information.update({
                where: {
                    id: userInformation.id
                },
                data: {
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                }
            })

            res.status(200).json({
                status: 200,
                message: "Verification code sent successfully",
                user_account_verification_code: updatedUser.user_account_verification_code,
                user_phone_number: updatedUser.user_phone_number,
            })
        }

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_user_reset_pin_controller = async function (req, res, next) {
    const { sh_phone_number } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        if (validator.isEmpty(sh_phone_number)) {
            const error = new Error("Enter valid phone number")
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                user_phone_number: sh_phone_number
            }
        })

        if (!userInformation) {
            const error = new Error("Phone number does not exist")
            error.code = 404
            throw error
        }

        const one_time_password = otpGenerator.generate(6,
            {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                digits: true,
                specialChars: false,
            }
        )

        const updatedUser = await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                user_account_pin_reset_code: one_time_password,
                user_account_pin_reset_code_created_at: new Date(),
                user_account_pin_reset_code_expiry_at: new Date(Date.now() + 3600000)
            }
        })

        res.status(200).json({
            status: 200,
            message: "Phone pin set successfully",
            user_account_pin_reset_code: updatedUser.user_account_pin_reset_code,
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_user_pin_reset_code_verification_controller = async function (req, res, next) {
    const { sh_pin_reset_code } = req.body;
    try{
        const errors = []
        if (validator.isEmpty(sh_pin_reset_code)) {
            errors.push({ message: 'Enter valid pin reset code' })
        }

        if (errors.length > 0) {
            const error = new Error("Invalid input")
            error.data = errors
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                user_account_pin_reset_code: sh_pin_reset_code,
                user_account_pin_reset_code_expiry_at: {
                    gte: new Date()
                }
            }
        })

        if (!userInformation) {
            const error = new Error("Pin reset code does not exist")
            error.code = 404
            throw error
        }

        const accessToken = jwt.sign({
            userId: userInformation.id,
            email: userInformation.user_email_address,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: '30m' } 
        )

        const refreshToken = jwt.sign({
            userId: userInformation.id,
            email: userInformation.user_email_address,
        }, 
        process.env.REFRESH_TOKEN,
        { expiresIn: '30d' })

        await prisma.Sh_Token_Information.create({
            data: {
                sh_user_id: userInformation.id,
                sh_refresh_token: refreshToken,
            }
        })

        res.status(200).json({
            status: 200,
            message: "Pin reset code verified successfully",
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: userInformation.id,
        })
    }
    catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_set_new_pin_controller = async function (req, res, next) {
    const { sh_phone_pin } = req.body;

    try {
        if(!req.isAuth){
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        if (validator.isEmpty(sh_phone_pin)) {
            const error = new Error("Enter valid phone pin")
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst(
            {
                where: {
                    id: req.userId
                }
            }
        )

        if(!userInformation){
            const error = new Error("User does not exist")
            error.code = 404
            throw error
        }

        const newPin = await bcrypt.hash(sh_phone_pin, 10)

        const updatedUser = await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                user_account_pin: newPin,
            }
        })

        res.status(200).json({
            status: 200,
            message: "Phone pin set successfully",
            user_account_pin: updatedUser.user_account_pin,
        })
        
    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_reset_code_controller = async function (req, res, next) {
    const { sh_email_address, sh_phone_number, sh_reset_with } = req.body;

    try {
        if (sh_reset_with === "sh_email_address") {
            const errors = [];
            if (!validator.isEmail(sh_email_address)) {
                errors.push({ message: 'Enter valid email address' })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid input")
                error.data = errors
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_email_address: sh_email_address
                }
            })

            if (!userInformation) {
                const error = new Error("Email address does not exist")
                error.code = 404
                throw error
            }

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const updatedUser = await prisma.Sh_User_Master_Information.update({
                where: {
                    id: userInformation.id
                },
                data: {
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                }
            })

            res.status(200).json({
                status: 200,
                message: "Verification code sent successfully",
                user_account_verification_code: updatedUser.user_account_verification_code,
                user_email_address: updatedUser.user_email_address,
            })


        }
        else {
            const errors = []
            if (validator.isEmpty(sh_phone_number)) {
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
                    user_phone_number: sh_phone_number
                }
            })

            if (!userInformation) {
                const error = new Error("Phone number does not exist")
                error.code = 404
                throw error
            }

            const one_time_password = otpGenerator.generate(6,
                {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    digits: true,
                    specialChars: false,
                }
            )

            const updatedUser = await prisma.Sh_User_Master_Information.update({
                where: {
                    id: userInformation.id
                },
                data: {
                    user_account_verification_code: one_time_password,
                    user_account_verification_code_created_at: new Date(),
                    user_account_verification_code_expiry_at: new Date(Date.now() + 3600000),
                }
            })

            res.status(200).json({
                status: 200,
                message: "Verification code sent successfully",
                user_account_verification_code: updatedUser.user_account_verification_code,
                user_phone_number: updatedUser.user_phone_number,
            })
        }
    }
    catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }

}

exports.sh_reset_code_verification_controller = async function (req, res, next) {
    const { sh_account_verification_code } = req.body;

    try {
        const errors = []
        if (validator.isEmpty(sh_account_verification_code)) {
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
                user_account_verification_code: sh_account_verification_code,
                user_account_verification_code_expiry_at: {
                    gte: new Date()
                }
            }
        })

        if (!userInformation) {
            const error = new Error("Verification code does not exist")
            error.code = 404
            throw error
        }

        await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                user_account_verification_code: null,
                user_account_verification_code_created_at: null,
                user_account_verification_code_expiry_at: null,
                user_account_is_verified: true
            }
        })

        const accessToken = jwt.sign({
            userId: userInformation.id,
            email: userInformation.sh_email_address,
        },
            "weliveoncesotakeadvatagofthelifethealmightyhasgivenyouandmakeadifferenceintheworld",
            { expiresIn: "30m" })

        const refreshToken = jwt.sign({
            userId: userInformation.id,
            email: userInformation.sh_email_address,
        },
            "d2VsaXZlb25jZXNvdGFrZWFkdmF0YWdvZnRoZWxpZmV0aGVhbG1pZ2h0eWhhc2dpdmVueW91YW5kbWFrZWFkaWZmZXJlbmNlaW50aGV3b3JsZA",
            { expiresIn: "30d" })

        await prisma.Sh_Token_Information.create({
            data: {
                sh_user_id: userInformation.id,
                sh_refresh_token: refreshToken,
            }
        })

        res.status(200).json({
            status: 200,
            message: "Account verified successfully",
            access_token: accessToken,
            refresh_token: refreshToken,
            id: userInformation.id
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }

}

exports.sh_set_new_password_controller = async function (req, res, next) {
    const { sh_new_password } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        if (validator.isEmpty(sh_new_password)) {
            const error = new Error("Enter valid new password")
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                id: req.userId
            }
        })

        if (!userInformation) {
            const error = new Error("User does not exist")
            error.code = 404
            throw error
        }

        const password = await bcrypt.hash(sh_new_password, 12)

        const updatedUser = await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                sh_password: password,
            }
        })

        res.status(200).json({
            status: 200,
            message: "Password updated successfully",
            id: updatedUser.id
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_user_set_phone_pin_controller = async function (req, res, next) {
    const { sh_phone_pin } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        if (validator.isEmpty(sh_phone_pin)) {
            const error = new Error("Enter valid new pin")
            error.code = 400
            throw error
        }

        const userInformation = await prisma.Sh_User_Master_Information.findFirst({
            where: {
                id: req.userId
            }
        })

        if (!userInformation) {
            const error = new Error("User does not exist")
            error.code = 404
            throw error
        }

        const pin = await bcrypt.hash(sh_phone_pin, 12)

        const updatedUser = await prisma.Sh_User_Master_Information.update({
            where: {
                id: userInformation.id
            },
            data: {
                sh_phone_pin: pin,
            }
        })

        res.status(200).json({
            status: 200,
            message: "Pin updated successfully",
            id: updatedUser.id
        })

    } catch (error) {
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
        customer_referral_code

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
                            customer_date_of_birth: new Date(),
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
                            customer_date_of_birth: new Date(),
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
            ...updatedInformation
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_create_customer_address_information_controller = async function (req, res, next) {
    const {
        customer_id,
        customer_country,
        customer_state,
        customer_city,
        customer_street,
        customer_address_type,
        customer_postal_code,
        customer_address_line_1,
        customer_address_line_2,
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
            }
        })

        if (!userInformation) {
            const error = new Error("User not found")
            error.code = 404
            throw error
        }

        const customerInformation = await prisma.Sh_Customer_Master_Information.findFirst({
            where: {
                id: customer_id
            }
        })

        if (!customerInformation) {
            const error = new Error("Customer not found")
            error.code = 404
            throw error
        }

        const updatedInformation = await prisma.Sh_Customer_Master_Information.update({
            where: {
                id: customer_id
            },
            data: {
                customer_address_information: {
                    upsert: {
                        create: {
                            customer_country: customer_country,
                            customer_state: customer_state,
                            customer_city: customer_city,
                            customer_street: customer_street,
                            customer_address_type: customer_address_type,
                            customer_postal_code: customer_postal_code,
                            customer_address_one: customer_address_line_1,
                            customer_address_two: customer_address_line_2,
                            customer_address_created_at: new Date(),
                            customer_address_updated_at: new Date()
                        },
                        update: {
                            customer_country: customer_country,
                            customer_state: customer_state,
                            customer_city: customer_city,
                            customer_street: customer_street,
                            customer_address_type: customer_address_type,
                            customer_postal_code: customer_postal_code,
                            customer_address_one: customer_address_line_1,
                            customer_address_two: customer_address_line_2,
                            customer_address_created_at: new Date(),
                            customer_address_updated_at: new Date()
                        }
                    }
                }
            }
        })

        res.status(200).json({
            status: 200,
            message: "Customer address information updated successfully",
            ...updatedInformation
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_login_user_information_controller = async function (req, res, next) {
    const { sh_user_email_address, sh_user_password, sh_user_phone_number, sh_login_with } = req.body;

    try {
        if (sh_login_with === "sh_email_address") {
            const errors = []

            if (!validator.isEmail(sh_user_email_address)) {
                errors.push({
                    message: "Enter a valid email address"
                })
            }

            if (validator.isEmpty(sh_user_password)) {
                errors.push({
                    message: "Enter a valid password"
                })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid inputs")
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_email_address: sh_user_email_address,
                }
            })

            if (!userInformation) {
                const error = new Error("User not found")
                error.code = 404
                throw error
            }

            const userPassword = await bcrypt.compare(sh_user_password, userInformation.user_password)

            if (!userPassword) {
                const error = new Error("Wrong email or password")
                error.code = 400
                throw error
            }

            if (!userInformation.user_account_is_verified) {
                const error = new Error("User account is not verified")
                error.code = 401
                throw error
            }

            const accessToken = jwt.sign({
                userId: userInformation.id,
                email: userInformation.user_email_address,
            },
                "weliveoncesotakeadvatagofthelifethealmightyhasgivenyouandmakeadifferenceintheworld",
                { expiresIn: "30d" })

            const refreshToken = jwt.sign({
                userId: userInformation.id,
                email: userInformation.user_email_address,
            },
                "d2VsaXZlb25jZXNvdGFrZWFkdmF0YWdvZnRoZWxpZmV0aGVhbG1pZ2h0eWhhc2dpdmVueW91YW5kbWFrZWFkaWZmZXJlbmNlaW50aGV3b3JsZA",
                { expiresIn: "30d" })

            await prisma.Sh_Token_Information.create({
                data: {
                    sh_user_id: userInformation.id,
                    sh_refresh_token: refreshToken,
                }
            })

            res.status(200).json({
                status: 200,
                message: "User logged in successfully",
                accessToken: accessToken,
                refreshToken: refreshToken,
                id: userInformation.id,
            })
        }
        else {
            const errors = []
            if (validator.isEmpty(sh_user_phone_number)) {
                errors.push({
                    message: "Enter a valid phone number"
                })
            }

            if (errors.length > 0) {
                const error = new Error("Invalid inputs")
                error.code = 400
                throw error
            }

            const userInformation = await prisma.Sh_User_Master_Information.findFirst({
                where: {
                    user_phone_number: sh_user_phone_number,
                }
            })

            if (!userInformation) {
                const error = new Error("Phone number not found")
                error.code = 404
                throw error
            }

            if (userInformation.user_account_is_verified == false) {
                const error = new Error("User account is not verified")
                error.code = 401
                throw error
            }

            const accessToken = jwt.sign({
                userId: userInformation.id,
                email: userInformation.user_email_address,
            },
                "weliveoncesotakeadvatagofthelifethealmightyhasgivenyouandmakeadifferenceintheworld",
                { expiresIn: "30d" })

            const refreshToken = jwt.sign({
                userId: userInformation.id,
                email: userInformation.user_email_address,
            },
                "d2VsaXZlb25jZXNvdGFrZWFkdmF0YWdvZnRoZWxpZmV0aGVhbG1pZ2h0eWhhc2dpdmVueW91YW5kbWFrZWFkaWZmZXJlbmNlaW50aGV3b3JsZA",
                { expiresIn: "30d" })

            await prisma.Sh_Token_Information.create({
                data: {
                    sh_user_id: userInformation.id,
                    sh_refresh_token: refreshToken,
                }
            })

            res.status(200).json({
                status: 200,
                message: "User logged in successfully",
                accessToken: accessToken,
                refreshToken: refreshToken,
                id: userInformation.id,
            })
        }
    }
    catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_refresh_token_information_controller = async function (req, res, next) {
    const { sh_refresh_token } = req.params;

    try {
        const errors = []
        if (validator.isEmpty(sh_refresh_token)) {
            errors.push({
                message: "Enter a valid refresh token"
            })
        }

        if (errors.length > 0) {
            const error = new Error("Invalid inputs")
            error.code = 400
            throw error
        }

        const refreshTokenInformation = await prisma.Sh_Token_Information.findFirst({
            where: {
                sh_refresh_token: sh_refresh_token,
            }
        })

        if (!refreshTokenInformation) {
            const error = new Error("Refresh token not found")
            error.code = 404
            throw error
        }

        const payloadInfo = jwt.verify(refreshTokenInformation.sh_refresh_token, "d2VsaXZlb25jZXNvdGFrZWFkdmF0YWdvZnRoZWxpZmV0aGVhbG1pZ2h0eWhhc2dpdmVueW91YW5kbWFrZWFkaWZmZXJlbmNlaW50aGV3b3JsZA")

        if(!payloadInfo){
            const error = new Error("Refresh token is invalid")
            error.code = 400
            throw error
        }

        const accessToken = jwt.sign({
            userId: payloadInfo.userId,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "30m" })

        res.status(200).json({
            status: 200,
            message: "Refresh token verified successfully",
            accessToken: accessToken,
            refreshToken: refreshTokenInformation.sh_refresh_token,
            id: refreshTokenInformation.sh_user_id,
        })
        
    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}