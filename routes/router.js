var express = require('express');
const { 
    sh_create_event_controller, 
    sh_create_event_location_information_controller,
    sh_create_event_members_controller,
    sh_update_event_information_controller,
    sh_remove_event_controller,
    sh_get_event_members_controller,
    sh_get_customer_created_events_controller,
    sh_get_customer_invited_and_pending_events_controller,
    sh_invite_member_controller
 } = require('../controllers/Parties_Management_Controllers/sh_events_management_controller');

const {
    sh_create_user_information_controller,
    sh_user_account_verification_code_controller,
    sh_create_customer_information_controller,
    sh_user_resend_verification_code_controller,
    sh_user_set_phone_pin_controller,
    sh_reset_code_controller,
    sh_reset_code_verification_controller,
    sh_set_new_password_controller,
    sh_set_new_pin_controller,
    sh_create_customer_address_information_controller,
    sh_login_user_information_controller,
    sh_refresh_token_information_controller,
    sh_user_pin_reset_code_verification_controller,
    sh_user_reset_pin_controller
} = require('../controllers/User_Management_Controllers/sh_user_management_controller');

var router = express.Router();

router.post('/sh_create_user_information', sh_create_user_information_controller)

router.post('/sh_user_account_code_verification', sh_user_account_verification_code_controller)

router.post('/sh_user_resend_verification_code', sh_user_resend_verification_code_controller)

router.post('/sh_user_set_phone_pin', sh_user_set_phone_pin_controller)

router.post('/sh_user_reset_code', sh_reset_code_controller)

router.post('/sh_user_reset_code_verification', sh_reset_code_verification_controller)

router.post('/sh_user_set_new_password', sh_set_new_password_controller)

router.post('/sh_user_reset_pin', sh_user_reset_pin_controller)

router.post('/sh_user_reset_pin_code_verification', sh_user_pin_reset_code_verification_controller)

router.post('/sh_user_set_new_pin', sh_set_new_pin_controller)

router.post('/sh_user_create_customer_information', sh_create_customer_information_controller)

router.post('/sh_user_create_customer_address_information', sh_create_customer_address_information_controller)

router.post('/sh_user_login_information', sh_login_user_information_controller)

router.post('/sh_user_refresh_token_information/:sh_refresh_token', sh_refresh_token_information_controller)

//events

router.post('/sh_create_event_information', sh_create_event_controller)

router.post('/sh_create_event_location_information/:sh_event_id', sh_create_event_location_information_controller)

router.post('/sh_create_event_members_information', sh_create_event_members_controller)

router.patch('/sh_update_event_information/:sh_event_id', sh_update_event_information_controller)

router.patch('/sh_invite_member_information', sh_invite_member_controller)

router.delete('/sh_remove_event_information/:sh_event_id', sh_remove_event_controller)

router.get('/sh_get_event_members_information/:sh_event_id', sh_get_event_members_controller)

router.get('/sh_get_customer_created_events_information/:sh_customer_id', sh_get_customer_created_events_controller)

router.get('/sh_get_all_events_infomation_by_customer/:sh_customer_id', sh_get_customer_invited_and_pending_events_controller)

module.exports = router;