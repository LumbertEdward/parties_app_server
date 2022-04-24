var express = require('express');
const {
    sh_create_user_information_controller,
    sh_user_account_verification_code_controller,
    sh_create_customer_information_controller
} = require('../controllers/User_Management_Controllers/sh_user_management_controller');

var router = express.Router();

router.post('/sh_create_user_information', sh_create_user_information_controller)

router.post('/sh_account_code_verification', sh_user_account_verification_code_controller)

router.post('/sh_create_customer_information', sh_create_customer_information_controller)

module.exports = router;