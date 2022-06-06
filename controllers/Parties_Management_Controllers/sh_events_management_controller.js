const { PrismaClient } = require('@prisma/client')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var otpGenerator = require('otp-generator');
const validator = require('validator');

const prisma = new PrismaClient()

exports.sh_create_event_controller = async (req, res, next) => {
    const {
        customer_id,
        sh_event_name,
        sh_event_description,
        sh_event_capacity,
        sh_event_status,
        sh_event_dress_code,
        sh_event_start_date,
        sh_event_start_time,
        sh_event_end_date,
        sh_event_end_time,
    } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const customerInformation = await prisma.Sh_Customer_Master_Information.findFirst({
            where: {
                id: customer_id
            }
        })

        if (!customerInformation) {
            const error = new Error("Customer information not found")
            error.code = 404
            throw error
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.create({
            data: {
                sh_event_name: sh_event_name,
                sh_event_description: sh_event_description,
                sh_event_capacity: sh_event_capacity,
                sh_event_status: sh_event_status,
                sh_event_dress_code: sh_event_dress_code,
                sh_event_start_date: sh_event_start_date,
                sh_event_start_time: sh_event_start_time,
                sh_event_end_date: sh_event_end_date,
                sh_event_end_time: sh_event_end_time,
                sh_event_master_information_created_at: new Date(),
                sh_event_master_information_updated_at: new Date(),
                sh_customer_master_information: {
                    connect: {
                        id: customerInformation.id,
                    }
                }
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event information created successfully",
            ...eventInformation
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_create_event_location_information_controller = async function (req, res, next) {
    const { sh_event_id } = req.params;
    const {
        event_location_name,
        sh_event_location_country,
        sh_event_location_state,
        sh_event_location_city,
        sh_event_location_formatted_address,
        sh_event_location_latitude,
        sh_event_location_longitude,
        sh_event_street_name,
        sh_event_street_number,
        sh_event_street_address,
        sh_event_appartment_name,
        sh_event_house_number,
        sh_event_country_code,
        sh_event_zip_code,
        sh_event_administrative_area_level_1,
        sh_event_administrative_area_level_2,
        sh_event_administrative_area_level_3,
        sh_event_administrative_area_level_4,
        sh_event_administrative_area_level_5,
        sh_event_locality,
        sh_event_sublocality,
        sh_event_neighborhood,
        sh_event_route,
        sh_event_ward,
        sh_event_postal_code,
    } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }

        const eventLocationInformation = await prisma.Sh_Event_Location_Information.create({
            data: {
                event_location_name: event_location_name,
                sh_event_location_country: sh_event_location_country,
                sh_event_location_state: sh_event_location_state,
                sh_event_location_city: sh_event_location_city,
                sh_event_location_formatted_address: sh_event_location_formatted_address,
                sh_event_location_latitude: sh_event_location_latitude,
                sh_event_location_longitude: sh_event_location_longitude,
                sh_event_street_name: sh_event_street_name,
                sh_event_street_number: sh_event_street_number,
                sh_event_street_address: sh_event_street_address,
                sh_event_appartment_name: sh_event_appartment_name,
                sh_event_house_number: sh_event_house_number,
                sh_event_country_code: sh_event_country_code,
                sh_event_zip_code: sh_event_zip_code,
                sh_event_administrative_area_level_1: sh_event_administrative_area_level_1,
                sh_event_administrative_area_level_2: sh_event_administrative_area_level_2,
                sh_event_administrative_area_level_3: sh_event_administrative_area_level_3,
                sh_event_administrative_area_level_4: sh_event_administrative_area_level_4,
                sh_event_administrative_area_level_5: sh_event_administrative_area_level_5,
                sh_event_locality: sh_event_locality,
                sh_event_sublocality: sh_event_sublocality,
                sh_event_neighborhood: sh_event_neighborhood,
                sh_event_route: sh_event_route,
                sh_event_ward: sh_event_ward,
                sh_event_postal_code: sh_event_postal_code,
                sh_event_location_information_created_at: new Date(),
                sh_event_location_information_updated_at: new Date(),
                sh_event_master_information: {
                    connect: {
                        id: eventInformation.id,
                    }
                }
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event location information created successfully",
            ...eventLocationInformation
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_create_event_members_controller = async function (req, res, next) {
    const {
        sh_event_id,
        sh_customer_id
    } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }

        const customerInformation = await prisma.Sh_Customer_Master_Information.findFirst({
            where: {
                id: sh_customer_id
            }
        })

        if (!customerInformation) {
            const error = new Error("Customer information not found")
            error.code = 401
            throw error
        }

        const eventMembers = await prisma.Sh_Event_Members_Master_Information.create({
            data: {
                sh_customer_master_information: {
                    connect: {
                        id: customerInformation.id,
                    }
                },
                sh_event_master_information: {
                    connect: {
                        id: eventInformation.id,
                    }
                },
                sh_event_invitation_status: "Pending",
                sh_event_members_master_information_created_at: new Date(),
                sh_event_members_master_information_updated_at: new Date(),
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event members created successfully",
            ...eventMembers
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_update_event_information_controller = async function (req, res, next) {
    const { sh_event_id } = req.params;
    const {
        sh_event_name,
        sh_event_description,
        sh_event_capacity,
        sh_event_status,
        sh_event_dress_code,
        sh_event_start_date,
        sh_event_start_time,
        sh_event_end_date,
        sh_event_end_time,
    } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, login to continue")
            error.code = 401
            throw error;
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }

        const eventInformationUpdated = await prisma.Sh_Event_Master_Information.update({
            where: {
                id: sh_event_id
            },
            data: {
                sh_event_name: sh_event_name,
                sh_event_description: sh_event_description,
                sh_event_capacity: sh_event_capacity,
                sh_event_status: sh_event_status,
                sh_event_dress_code: sh_event_dress_code,
                sh_event_start_date: sh_event_start_date,
                sh_event_start_time: sh_event_start_time,
                sh_event_end_date: sh_event_end_date,
                sh_event_end_time: sh_event_end_time,
                sh_event_master_information_updated_at: new Date(),
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event information updated successfully",
            ...eventInformationUpdated
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next()
    }
}

exports.sh_remove_event_controller = async function (req, res, next) {
    const { sh_event_id } = req.params;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, login to continue")
            error.code = 401
            throw error;
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }

        await prisma.Sh_Event_Master_Information.delete({
            where: {
                id: sh_event_id
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event information deleted successfully",
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_get_event_members_controller = async function (req, res, next) {
    const {
        sh_event_id,
    } = req.params;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, login to continue")
            error.code = 401
            throw error;
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }


        const eventMembers = await prisma.Sh_Event_Members_Master_Information.findMany({
            where: {
                sh_event_master_information_Id: sh_event_id
            }
        })

        res.status(200).json({
            status: 200,
            message: "Event members found successfully",
            ...eventMembers
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_invite_member_controller = async (req, res, next) => {
    const { sh_customer_id, sh_event_id } = req.body;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const eventInformation = await prisma.Sh_Event_Master_Information.findFirst({
            where: {
                id: sh_event_id
            }
        })

        if (!eventInformation) {
            const error = new Error("Event information not found")
            error.code = 404
            throw error
        }

        const memberInformation = await prisma.Sh_Event_Members_Master_Information.findFirst({
            where: {
                sh_customer_master_information: {
                    id: sh_customer_id
                },
                sh_event_master_information: {
                    id: sh_event_id
                }
            }
        })

        if (!memberInformation) {
            const error = new Error("Member information not found")
            error.code = 401
            throw error
        }

        const inviteMember = await prisma.Sh_Event_Master_Information.update({
            where: {
                id: memberInformation.id
            },
            data: {
                sh_event_invitation_status: "Invited",
                sh_event_members_master_information_updated_at: new Date(),
            }
        })

        res.status(200).json({
            status: 200,
            message: "Member invited successfully",
            ...inviteMember
        })

    } catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_get_customer_created_events_controller = async function (req, res, next){
    const { sh_customer_id } = req.params;

    try {
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const customerInformation = await prisma.Sh_Customer_Master_Information.findFirst({
            where: {
                id: sh_customer_id
            }
        })

        if (!customerInformation) {
            const error = new Error("Customer information not found")
            error.code = 401
            throw error
        }

        const customerEvents = await prisma.Sh_Event_Master_Information.findMany({
            where: {
                sh_customer_master_information: {
                    id: sh_customer_id
                }
            },
            include: {
                sh_event_location_information: true
            }
        })

        res.status(200).json({
            status: 200,
            message: "Customer events found successfully",
            ...customerEvents
        })
    }
    catch (error) {
        res.json({ message: error.message, status: error.code })
        next();
    }
}

exports.sh_get_customer_invited_and_pending_events_controller = async function (req, res, next) {
    const { sh_customer_id } = req.params;

    try{
        if (!req.isAuth) {
            const error = new Error("Unauthorised access, Login to continue")
            error.code = 401
            throw error
        }

        const customerInformation = await prisma.Sh_Customer_Master_Information.findFirst({
            where: {
                id: sh_customer_id
            }
        })

        if (!customerInformation) {
            const error = new Error("Customer information not found")
            error.code = 401
            throw error
        }

        const events = await prisma.Sh_Event_Members_Master_Information.findMany({
            where: {
                sh_customer_master_information: {
                    id: sh_customer_id
                }
            }
        })

        res.status(200).json({
            status: 200,
            message: "Customer events found successfully",
            ...events
        })

    }
    catch(error){
        res.json({ message: error.message, status: error.code })
        next();
    }
}