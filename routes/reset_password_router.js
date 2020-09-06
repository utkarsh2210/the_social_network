const express = require('express');
const router = express.Router();
const passport = require('passport');

const reset_password_controller = require('../controllers/reset_password_controller');


router.get('/email_id', reset_password_controller.email_page);
router.post('/send_mail', reset_password_controller.reset_pass_send_mail);

module.exports = router;