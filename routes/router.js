var express = require('express');
const { 
    sh_create_user_information_controller
 } = require('../controllers/UserManagementControllers/sh_user_management_controller');

var router = express.Router();

router.get('/sh_create_user_information', sh_create_user_information_controller)

module.exports = router;