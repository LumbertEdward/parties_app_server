const { PrismaClient } = require('@prisma/client')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var otpGenerator = require('otp-generator');
const validator = require('validator');

const prisma = new PrismaClient()

exports.sh_create_user_information_controller = async (req, res, next) => {
    res.send('respond with a resource');
}